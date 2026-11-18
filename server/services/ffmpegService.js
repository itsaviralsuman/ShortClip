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
   * Render real 9:16 Vertical Short MP4 with 1080x1920 blurred-background reframing
   */
  static renderClip({ inputPath, outputPath, startTime, endTime, aspectRatio = '9:16' }) {
    return new Promise((resolve, reject) => {
      const duration = Math.max(1, endTime - startTime);
      const safeStart = Math.max(0, startTime);

      let args = ['-y', '-ss', safeStart.toString(), '-t', duration.toString(), '-i', inputPath];

      if (aspectRatio === '9:16') {
        // High-speed dual-layer 9:16 vertical short:
        // [bg]: scale to fill 1080x1920, crop, boxblur
        // [fg]: scale width to 1080, height automatically even (-2)
        // [overlay]: center foreground on top of blurred background
        const filterGraph = [
          '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=15:3[bg]',
          '[0:v]scale=1080:-2[fg]',
          '[bg][fg]overlay=(W-w)/2:(H-h)/2[outv]'
        ].join(';');

        args.push(
          '-filter_complex', filterGraph,
          '-map', '[outv]',
          '-map', '0:a?',
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-movflags', '+faststart',
          outputPath
        );
      } else {
        args.push(
          '-c:v', 'libx264',
          '-preset', 'ultrafast',
          '-crf', '23',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-movflags', '+faststart',
          outputPath
        );
      }

      const proc = spawn(FFMPEG_BIN, args);
      let stderr = '';
      proc.stderr.on('data', d => { stderr += d.toString(); });

      proc.on('close', code => {
        if (code === 0 && fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath);
          resolve({
            outputPath,
            sizeBytes: stats.size,
            duration
          });
        } else {
          reject(new Error(`FFmpeg render failed with code ${code}: ${stderr}`));
        }
      });
    });
  }
}
