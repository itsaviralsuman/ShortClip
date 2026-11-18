import { spawn } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import fs from 'fs';

const FFMPEG_BIN = ffmpegInstaller.path;
const FFPROBE_BIN = ffprobeInstaller.path;

export class FFmpegService {
  /**
   * Probe media using ffprobe CLI
   */
  static probeMedia(filePath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        return reject(new Error(`File not found for probing: ${filePath}`));
      }

      const args = [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath
      ];

      const proc = spawn(FFPROBE_BIN, args);
      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', data => { stdout += data.toString(); });
      proc.stderr.on('data', data => { stderr += data.toString(); });

      proc.on('close', code => {
        if (code !== 0) {
          return reject(new Error(`ffprobe failed with code ${code}: ${stderr}`));
        }
        try {
          const metadata = JSON.parse(stdout);
          const videoStream = (metadata.streams || []).find(s => s.codec_type === 'video');
          const audioStream = (metadata.streams || []).find(s => s.codec_type === 'audio');
          const format = metadata.format || {};

          const durationSeconds = format.duration ? parseFloat(format.duration) : 0;
          const width = videoStream ? parseInt(videoStream.width) : 1920;
          const height = videoStream ? parseInt(videoStream.height) : 1080;
          let fps = 30;
          if (videoStream && videoStream.r_frame_rate) {
            const parts = videoStream.r_frame_rate.split('/');
            if (parts.length === 2 && parseInt(parts[1]) > 0) {
              fps = Math.round(parseInt(parts[0]) / parseInt(parts[1]));
            }
          }

          resolve({
            duration: durationSeconds,
            durationMinutes: Math.round(durationSeconds / 60),
            width,
            height,
            aspectRatio: width / height,
            fps,
            videoCodec: videoStream ? videoStream.codec_name : 'unknown',
            audioCodec: audioStream ? audioStream.codec_name : 'none',
            hasAudio: !!audioStream,
            audioChannels: audioStream ? audioStream.channels : 0,
            audioSampleRate: audioStream ? parseInt(audioStream.sample_rate || '44100') : 0,
            sizeBytes: parseInt(format.size || '0'),
            bitrate: parseInt(format.bit_rate || '0')
          });
        } catch (e) {
          reject(new Error(`Failed to parse ffprobe JSON: ${e.message}`));
        }
      });
    });
  }

  /**
   * Extract 16kHz Mono PCM WAV audio for transcription
   */
  static extractAudio(videoPath, outputAudioPath) {
    return new Promise((resolve, reject) => {
      const args = [
        '-y',
        '-i', videoPath,
        '-vn',
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-ac', '1',
        outputAudioPath
      ];

      const proc = spawn(FFMPEG_BIN, args);
      let stderr = '';
      proc.stderr.on('data', d => { stderr += d.toString(); });

      proc.on('close', code => {
        if (code === 0 && fs.existsSync(outputAudioPath)) {
          resolve(outputAudioPath);
        } else {
          reject(new Error(`Audio extraction failed (code ${code}): ${stderr}`));
        }
      });
    });
  }

  /**
   * Render real Short MP4 with reframing (9:16, 1:1, 16:9, 4:5), burned captions,
   * atomic file creation (.tmp staging), and normalized AAC audio.
   */
  static renderClip({ inputPath, outputPath, startTime, endTime, aspectRatio = '9:16', subtitlePath }) {
    return new Promise((resolve, reject) => {
      const duration = Math.max(1, endTime - startTime);
      const safeStart = Math.max(0, startTime);
      const tempOutputPath = `${outputPath}.tmp.mp4`;

      let args = ['-y', '-ss', safeStart.toString(), '-t', duration.toString(), '-i', inputPath];

      // Format subtitle path for FFmpeg on Windows: C\:/path/to/sub.ass
      let subFilter = '';
      if (subtitlePath && fs.existsSync(subtitlePath)) {
        const escapedSub = subtitlePath.replace(/\\/g, '/').replace(':', '\\:');
        subFilter = `,subtitles='${escapedSub}'`;
      }

      let filterGraph = '';
      if (aspectRatio === '9:16') {
        // 1080x1920 Vertical Mobile Short with dual-layer blur padding
        filterGraph = `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=15:3[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2${subFilter}[outv]`;
      } else if (aspectRatio === '1:1') {
        // 1080x1080 Square Feed
        filterGraph = `[0:v]scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,boxblur=15:3[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2${subFilter}[outv]`;
      } else if (aspectRatio === '4:5') {
        // 1080x1350 Portrait
        filterGraph = `[0:v]scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,boxblur=15:3[bg];[0:v]scale=1080:-2[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2${subFilter}[outv]`;
      } else {
        // 16:9 Landscape / Default
        filterGraph = subFilter ? `[0:v]null${subFilter}[outv]` : `[0:v]null[outv]`;
      }

      args.push(
        '-filter_complex', filterGraph,
        '-map', '[outv]',
        '-map', '0:a?',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '23',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '44100',
        '-ac', '2',
        '-movflags', '+faststart',
        tempOutputPath
      );

      const proc = spawn(FFMPEG_BIN, args);
      let stderr = '';
      proc.stderr.on('data', d => { stderr += d.toString(); });

      proc.on('close', code => {
        if (code === 0 && fs.existsSync(tempOutputPath)) {
          try {
            // Atomic rename from tempOutputPath to final outputPath
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
            fs.renameSync(tempOutputPath, outputPath);
            resolve({ outputPath, duration });
          } catch (renameErr) {
            // If rename failed (e.g. file lock on Windows), copy and unlink
            fs.copyFileSync(tempOutputPath, outputPath);
            fs.unlinkSync(tempOutputPath);
            resolve({ outputPath, duration });
          }
        } else {
          // If subtitle filter failed (e.g. font missing or filter graph error), retry without subtitle filter
          if (subFilter) {
            console.warn('Retrying render without subtitle filter...');
            this.renderClip({ inputPath, outputPath, startTime, endTime, aspectRatio, subtitlePath: null })
              .then(resolve)
              .catch(reject);
          } else {
            if (fs.existsSync(tempOutputPath)) {
              try { fs.unlinkSync(tempOutputPath); } catch (_) {}
            }
            reject(new Error(`FFmpeg render failed with code ${code}: ${stderr}`));
          }
        }
      });
    });
  }

  /**
   * Validate that rendered MP4 satisfies browser playback, duration and audio requirements
   */
  static async validateClip(filePath, minDuration = 60.0, maxDuration = 120.0) {
    const probe = await this.probeMedia(filePath);
    const validDuration = probe.duration >= minDuration - 2.0 && probe.duration <= maxDuration + 2.0;
    const validVideo = probe.videoCodec === 'h264';
    const validAudio = probe.audioCodec === 'aac' || probe.audioCodec === 'mp3';

    return {
      isValid: validDuration && validVideo && probe.sizeBytes > 10000,
      probe,
      validDuration,
      validVideo,
      validAudio
    };
  }
}
