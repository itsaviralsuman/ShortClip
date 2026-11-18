import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import path from 'path';
import fs from 'fs';

// Configure binaries
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export class FFmpegService {
  /**
   * Probe media file using ffprobe to obtain real container metadata
   */
  static probeMedia(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        const audioStream = metadata.streams.find(s => s.codec_type === 'audio');
        const format = metadata.format;

        const durationSeconds = format.duration ? parseFloat(format.duration) : 0;
        const width = videoStream ? videoStream.width : 1920;
        const height = videoStream ? videoStream.height : 1080;
        const fps = videoStream && videoStream.r_frame_rate
          ? eval(videoStream.r_frame_rate)
          : 30;

        resolve({
          duration: durationSeconds,
          durationMinutes: Math.round(durationSeconds / 60),
          width,
          height,
          aspectRatio: width / height,
          fps: Math.round(fps),
          videoCodec: videoStream ? videoStream.codec_name : 'unknown',
          audioCodec: audioStream ? audioStream.codec_name : 'none',
          sizeBytes: format.size || 0,
          bitrate: format.bit_rate || 0
        });
      });
    });
  }

  /**
   * Extract 16kHz Mono PCM WAV audio for Whisper transcription
   */
  static extractAudio(videoPath, outputAudioPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec('pcm_s16le')
        .audioChannels(1)
        .audioFrequency(16000)
        .output(outputAudioPath)
        .on('end', () => resolve(outputAudioPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  /**
   * Render real 9:16 Vertical Short MP4 with 1080x1920 blurred-background reframing
   */
  static renderClip({ inputPath, outputPath, startTime, endTime, aspectRatio = '9:16' }) {
    return new Promise((resolve, reject) => {
      const duration = Math.max(1, endTime - startTime);
      const safeStart = Math.max(0, startTime);

      let command = ffmpeg(inputPath)
        .setStartTime(safeStart)
        .setDuration(duration);

      if (aspectRatio === '9:16') {
        // High quality Dual-layer 9:16 vertical shorts filter:
        // [bg]: scale to fill 1080x1920 and apply Gaussian blur
        // [fg]: scale source video to fit 1080px width preserving aspect ratio
        // [overlay]: center foreground on top of blurred background
        const filterGraph = [
          '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:5[bg]',
          '[0:v]scale=1080:-1[fg]',
          '[bg][fg]overlay=(W-w)/2:(H-h)/2[outv]'
        ].join(';');

        command = command
          .complexFilter(filterGraph, ['outv'])
          .outputOptions([
            '-c:v libx264',
            '-preset fast',
            '-crf 22',
            '-pix_fmt yuv420p',
            '-c:a aac',
            '-b:a 192k',
            '-movflags +faststart'
          ]);
      } else {
        // Direct copy or standard scale
        command = command.outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 22',
          '-pix_fmt yuv420p',
          '-c:a aac',
          '-b:a 192k',
          '-movflags +faststart'
        ]);
      }

      command
        .output(outputPath)
        .on('end', () => {
          if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            resolve({
              outputPath,
              sizeBytes: stats.size,
              duration
            });
          } else {
            reject(new Error('FFmpeg completed but output file was not found on disk.'));
          }
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
  }
}
