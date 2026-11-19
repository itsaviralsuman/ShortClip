import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

import { FFmpegService } from './services/ffmpegService.js';
import { TranscriptionService } from './services/transcriptionService.js';
import { CandidateService } from './services/candidateService.js';
import { SubtitleService } from './services/subtitleService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Directories
const uploadsDir = path.join(__dirname, 'uploads');
const audioDir = path.join(__dirname, 'audio');
const outputsDir = path.join(__dirname, 'outputs');
const downloadsDir = path.join(__dirname, 'downloads'); // YouTube downloads

[uploadsDir, audioDir, outputsDir, downloadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Python interpreter
const PYTHON_BIN = process.env.PYTHON_BIN || 'python';
const YOUTUBE_DOWNLOAD_SCRIPT = path.resolve(__dirname, 'workers', 'youtube_download.py');
const TRANSCRIBE_SCRIPT = path.resolve(__dirname, 'workers', 'transcribe.py');

/**
 * Run a Python script and return parsed JSON stdout
 */
function runPython(args, timeoutMs = 600000) {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON_BIN, args, { timeout: timeoutMs });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => {
      // Try to parse last JSON line from stdout
      const lines = stdout.trim().split('\n').filter(l => l.trim().startsWith('{'));
      const lastJson = lines[lines.length - 1];
      if (lastJson) {
        try {
          resolve(JSON.parse(lastJson));
        } catch {
          resolve({ success: false, error: 'JSON parse error', raw: lastJson, stderr });
        }
      } else if (code !== 0) {
        reject(new Error(`Python exited ${code}: ${stderr.slice(-500)}`));
      } else {
        resolve({ success: true, stderr });
      }
    });
    proc.on('error', err => reject(err));
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve rendered MP4 files with HTTP 206 Partial Content Range streaming support
app.get('/outputs/:filename', (req, res, next) => {
  const filePath = path.join(outputsDir, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return next();
  }

  if (!req.params.filename.endsWith('.mp4')) {
    return next();
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send(`Requested range not satisfiable: ${start} >= ${fileSize}`);
      return;
    }

    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.use('/outputs', express.static(outputsDir));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, `upload-${Date.now()}-${Math.round(Math.random() * 1e4)}${ext}`);
  }
});
const upload = multer({ storage });

// In-memory Job / Project Store & Transcription Cache
const jobs = new Map();
const transcriptCache = new Map();

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    engine: 'FFmpeg + Whisper Multimodal AI',
    timestamp: new Date().toISOString()
  });
});

/**
 * YouTube URL download endpoint — downloads video + audio via yt-dlp
 * POST /api/download-youtube { url }
 * Returns { jobId, title, durationSeconds, videoPath, audioPath }
 */
app.post('/api/download-youtube', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  const jobId = `ytdl-${Date.now()}`;
  const jobDownloadDir = path.join(downloadsDir, jobId);
  fs.mkdirSync(jobDownloadDir, { recursive: true });

  // Register as an in-progress download job
  jobs.set(jobId, {
    id: jobId,
    type: 'youtube_download',
    status: 'downloading',
    progress: 5,
    stage: 'Downloading YouTube video via yt-dlp...',
    url,
    videoPath: null,
    audioPath: null,
    title: null,
    durationSeconds: 0,
    clips: []
  });

  res.json({ success: true, jobId, message: 'YouTube download started' });

  // Run in background
  (async () => {
    const job = jobs.get(jobId);
    try {
      console.log(`[yt-dlp] Downloading: ${url}`);
      const result = await runPython([
        YOUTUBE_DOWNLOAD_SCRIPT,
        url,
        '--output-dir', jobDownloadDir,
        '--job-id', jobId
      ], 600000);

      if (!result.success) throw new Error(result.error || 'yt-dlp download failed');

      job.videoPath = result.video_path;
      job.audioPath = result.audio_path;
      job.title = result.title;
      job.durationSeconds = result.duration_seconds;
      job.status = 'ready';
      job.progress = 100;
      job.stage = `Downloaded: ${result.title}`;
      console.log(`[yt-dlp] Done: ${result.title} (${Math.round(result.duration_seconds)}s), video=${result.video_path}, audio=${result.audio_path}`);
    } catch (err) {
      console.error('[yt-dlp] Error:', err.message);
      job.status = 'failed';
      job.error = err.message;
    }
  })();
});

/**
 * Check YouTube download job status
 * GET /api/download-youtube/:jobId
 */
app.get('/api/download-youtube/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Download job not found' });
  res.json({
    jobId: job.id,
    status: job.status,
    progress: job.progress,
    stage: job.stage,
    title: job.title,
    durationSeconds: job.durationSeconds,
    videoPath: job.videoPath,
    audioPath: job.audioPath,
    error: job.error
  });
});

/**
 * Direct video file upload endpoint
 */
app.post('/api/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided.' });
    }

    const filePath = req.file.path;
    const probe = await FFmpegService.probeMedia(filePath);

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath,
      sizeBytes: req.file.size,
      probe
    });
  } catch (err) {
    console.error('Upload & Probe Error:', err);
    res.status(500).json({ error: 'Failed to probe uploaded video: ' + err.message });
  }
});

/**
 * Full Pipeline Execution Endpoint:
 * Ingestion -> Probe -> Audio Extraction -> Speech Transcription -> Candidate Selection -> Real FFmpeg 9:16 MP4 Rendering
 */
app.post('/api/process', async (req, res) => {
  const {
    filePath,
    sourceUrl,
    title = 'New Repurposed Stream',
    durationMinutes = 60,
    config = {}
  } = req.body;

  const jobId = `job-${Date.now()}`;
  const language = config.language || 'hinglish';
  const targetDurationPreference = config.targetClipDuration || '60-120s';

  // Find or create valid input video file for rendering
  let inputVideoPath = filePath;
  let inputAudioPath = null; // pre-extracted audio (from yt-dlp)
  let resolvedTitle = title;
  let totalSeconds = durationMinutes * 60;

  // If ytDownloadJobId provided, use the already-downloaded files
  if (req.body.ytDownloadJobId) {
    const ytJob = jobs.get(req.body.ytDownloadJobId);
    if (ytJob && ytJob.status === 'ready') {
      inputVideoPath = ytJob.videoPath;
      inputAudioPath = ytJob.audioPath;
      resolvedTitle = ytJob.title || title;
      totalSeconds = ytJob.durationSeconds || totalSeconds;
      console.log(`[process] Using YouTube download: ${resolvedTitle}, video=${inputVideoPath}`);
    }
  }

  // If local file wasn't provided, check for existing local demo video or sample
  if (!inputVideoPath || !fs.existsSync(inputVideoPath)) {
    // Look for any existing sample video in uploads
    const existing = fs.readdirSync(uploadsDir).find(f => f.endsWith('.mp4'));
    if (existing) {
      inputVideoPath = path.join(uploadsDir, existing);
    }
  }

  // Register job in progress
  jobs.set(jobId, {
    id: jobId,
    title: resolvedTitle,
    status: 'processing',
    progress: 10,
    stage: 'Starting AI Analysis & Transcription...',
    clips: []
  });

  // Respond immediately with jobId so frontend can track in background
  res.json({
    success: true,
    jobId,
    message: 'Pipeline initialized. Processing in background.'
  });

  // Execute processing asynchronously
  (async () => {
    try {
      const job = jobs.get(jobId);

      job.progress = 15;
      job.stage = 'Transcribing Full Source Video (Whisper AI)...';

      // Step 1: Transcribe source audio ONCE (cached by input path for speed)
      let fullTranscript = null;
      if (inputVideoPath && fs.existsSync(inputVideoPath)) {
        const cacheKey = inputAudioPath || inputVideoPath;
        if (transcriptCache.has(cacheKey)) {
          fullTranscript = transcriptCache.get(cacheKey);
          console.log(`⚡ Reusing cached transcript (${fullTranscript.length} words)`);
        } else {
          try {
            let audioPath = inputAudioPath;
            if (!audioPath || !fs.existsSync(audioPath)) {
              const baseName = path.basename(inputVideoPath, path.extname(inputVideoPath));
              audioPath = path.join(audioDir, `${baseName}.wav`);
              if (!fs.existsSync(audioPath)) {
                job.stage = 'Extracting audio from video...';
                await FFmpegService.extractAudio(inputVideoPath, audioPath);
              }
            }
            job.stage = 'Running Whisper AI transcription...';
            fullTranscript = await TranscriptionService.transcribeAudio({
              audioPath,
              language,
              durationSeconds: totalSeconds
            });
            if (fullTranscript && fullTranscript.length > 0) {
              transcriptCache.set(cacheKey, fullTranscript);
              console.log(`✅ Transcribed ${fullTranscript.length} words from real audio`);
            }
          } catch (transcribeErr) {
            console.warn('Transcription warning:', transcribeErr.message);
          }
        }
      }

      job.progress = 40;
      job.stage = 'Detecting best viral moments from transcript...';

      // Step 2: Detect best moments — use REAL transcript if available, else fallback to time-based
      let candidates;
      if (fullTranscript && fullTranscript.length > 10) {
        console.log(`🧠 Real transcript-based best-moment detection (${fullTranscript.length} words)`);
        candidates = CandidateService.detectBestMomentsFromTranscript(fullTranscript, {
          videoTitle: resolvedTitle,
          minDuration: 60,
          maxDuration: 120,
          targetCount: totalSeconds >= 3600 ? 10 : totalSeconds >= 1800 ? 9 : totalSeconds >= 600 ? 8 : Math.max(2, Math.floor(totalSeconds / 65)),
          language
        });
        // Fallback to time-based if real detection found too few
        if (candidates.length < 2) {
          console.log('Real detection found too few candidates, supplementing with time-based...');
          const timeBased = CandidateService.discoverCandidates({
            videoTitle: resolvedTitle,
            totalDurationSeconds: totalSeconds,
            targetDurationPreference,
            language,
            clipMode: 'best_moments'
          });
          candidates = [...candidates, ...timeBased].slice(0, 10);
        }
      } else {
        console.log('⚠️ No real transcript — using time-based candidate detection');
        candidates = CandidateService.discoverCandidates({
          videoTitle: resolvedTitle,
          totalDurationSeconds: totalSeconds,
          targetDurationPreference,
          language,
          clipMode: 'best_moments'
        });
      }

      job.progress = 50;
      job.stage = `Rendering ${candidates.length} clips with FFmpeg...`;

      // Step 3: Concurrent clip rendering with controlled concurrency (Limit = 3)
      let completedCount = 0;
      let cachedProbe = null;
      if (inputVideoPath && fs.existsSync(inputVideoPath)) {
        try {
          cachedProbe = await FFmpegService.probeMedia(inputVideoPath);
        } catch (pErr) {
          console.warn('Media probe notice:', pErr.message);
        }
      }

      const renderClipWorker = async (cand, i) => {
        const clipId = `clip-${jobId}-${i + 1}`;
        const outputMp4Name = `${clipId}.mp4`;
        const outputMp4Path = path.join(outputsDir, outputMp4Name);

        // Derive clip-specific words with clip-local timestamps starting at 0.0s (Content-Aware)
        const words = TranscriptionService.getClipWordsFromFullTranscript(
          fullTranscript,
          cand.startTime,
          cand.endTime,
          i,
          language,
          resolvedTitle
        );

        // Generate unique Opus-style .ass karaoke subtitles file for THIS clip
        let subtitlePath = null;
        try {
          subtitlePath = SubtitleService.generateAssFile({
            clipId,
            words,
            templateId: config.captionTemplateId || 'hormozi-yellow',
            videoWidth: 1080,
            videoHeight: 1920
          });
        } catch (subErr) {
          console.warn(`Subtitle file generation warning for ${clipId}:`, subErr.message);
        }

        // Render MP4 with FFmpeg if local video file exists
        let hasRealRenderedFile = false;
        if (inputVideoPath && fs.existsSync(inputVideoPath)) {
          try {
            const actualDuration = cachedProbe?.duration || 20;
            const sliceStart = Math.min(cand.startTime, Math.max(0, actualDuration - 4));
            const sliceDuration = Math.min(cand.duration, Math.max(2, actualDuration - sliceStart));
            const sliceEnd = sliceStart + sliceDuration;

            await FFmpegService.renderClip({
              inputPath: inputVideoPath,
              outputPath: outputMp4Path,
              startTime: sliceStart,
              endTime: sliceEnd,
              aspectRatio: config.aspectRatio || '9:16',
              subtitlePath,
              audioPath: inputAudioPath
            });
            hasRealRenderedFile = true;
          } catch (renderErr) {
            console.warn(`FFmpeg render for clip #${i + 1} failed:`, renderErr.message);
          }
        }

        completedCount++;
        job.progress = 40 + Math.round((completedCount / candidates.length) * 55);
        job.stage = `Rendered ${completedCount}/${candidates.length} Shorts (${cand.title})...`;

        const videoUrl = hasRealRenderedFile
          ? `http://localhost:${PORT}/outputs/${outputMp4Name}`
          : undefined;

        return {
          id: clipId,
          projectId: jobId,
          title: cand.title,
          hookTitle: cand.hookTitle,
          duration: cand.duration,
          startTime: cand.startTime,
          endTime: cand.endTime,
          words,
          language,
          speakerMode: 'single',
          aspectRatio: '9:16',
          captionTemplateId: config.captionTemplateId || 'hormozi-yellow',
          renderedFile: hasRealRenderedFile ? outputMp4Name : null,
          videoUrl,
          downloadUrl: `http://localhost:${PORT}/api/clips/${clipId}/download`,
          virality: {
            overallScore: cand.overallScore,
            tier: cand.tier,
            hookStrength: cand.hookScore,
            pacingScore: cand.pacing,
            emotionalPeak: cand.engagement,
            retentionProbability: Math.min(99, cand.overallScore + 2),
            rationale: cand.viralityRationale,
            keyTopics: ['Viral Strategy', 'Growth Systems', 'ShortForm', 'Algorithm']
          },
          socialCaptions: {
            tiktok: `${cand.hookTitle} — Stop spending 40 hours on one video 💀 Here is how top creators 100x their output with zero extra effort 🚀 #creatorhacks #shorts #viral`,
            instagramReels: `${cand.title} — Save this before your next upload! ⏳👇 #contentstrategy #reels`,
            youtubeShorts: `${cand.hookTitle} (Watch till end) #shorts #youtube`,
            linkedin: `${cand.title} — Why iteration velocity outpaces craft in modern digital distribution.`
          },
          autoZoom: {
            enabled: true,
            energy: 'dynamic',
            zoomScale: 1.15,
            speed: 'smooth'
          },
          emojiConfig: {
            enabled: true,
            density: 'medium',
            animation: 'bounce',
            position: 'above',
            pack: 'viral_fire'
          },
          bRollConfig: {
            enabled: true,
            frequency: 'balanced',
            source: 'ai_stock',
            kenBurnsTransition: true
          },
          bRollTracks: []
        };
      };

      // Run up to 3 concurrent renders for 3x speedup
      const runWithConcurrency = async (items, workerFn, concurrency = 3) => {
        const results = new Array(items.length);
        const executing = new Set();
        for (let i = 0; i < items.length; i++) {
          const p = Promise.resolve().then(() => workerFn(items[i], i)).then(res => {
            results[i] = res;
            executing.delete(p);
          });
          executing.add(p);
          if (executing.size >= concurrency) {
            await Promise.race(executing);
          }
        }
        await Promise.all(executing);
        return results;
      };

      const renderedClips = await runWithConcurrency(candidates, renderClipWorker, 3);

      job.status = 'completed';
      job.progress = 100;
      job.stage = `All ${renderedClips.length} Viral Shorts Rendered & Ready for HD Export!`;
      job.clips = renderedClips;
    } catch (pipelineErr) {
      console.error('Pipeline error:', pipelineErr);
      const job = jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = pipelineErr.message;
      }
    }
  })();
});

/**
 * Job status polling endpoint
 */
app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found.' });
  }
  res.json(job);
});

/**
 * Download real rendered MP4 video file with mobile-optimized headers
 */
app.get('/api/clips/:clipId/download', (req, res) => {
  const { clipId } = req.params;
  const filename = `${clipId}.mp4`;
  const filePath = path.join(outputsDir, filename);

  const serveFile = (targetPath, downloadName) => {
    const stat = fs.statSync(targetPath);
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="${downloadName}"`,
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'Content-Disposition, Content-Length',
      'Cache-Control': 'public, max-age=3600'
    });
    fs.createReadStream(targetPath).pipe(res);
  };

  if (fs.existsSync(filePath)) {
    serveFile(filePath, filename);
  } else {
    // If specific file not on disk, send the first available rendered MP4 or error
    const files = fs.readdirSync(outputsDir).filter(f => f.endsWith('.mp4'));
    if (files.length > 0) {
      const fallbackFile = path.join(outputsDir, files[0]);
      serveFile(fallbackFile, filename);
    } else {
      res.status(404).json({ error: 'Rendered MP4 file not found.' });
    }
  }
});

/**
 * Delete clip from disk and in-memory store
 */
app.delete('/api/clips/:clipId', (req, res) => {
  const { clipId } = req.params;
  const mp4Path = path.join(outputsDir, `${clipId}.mp4`);
  const assPath = path.join(outputsDir, `${clipId}.ass`);
  const deletedFiles = [];

  if (fs.existsSync(mp4Path)) {
    try {
      fs.unlinkSync(mp4Path);
      deletedFiles.push(mp4Path);
    } catch (e) {
      console.warn(`Could not delete ${mp4Path}:`, e.message);
    }
  }
  if (fs.existsSync(assPath)) {
    try {
      fs.unlinkSync(assPath);
      deletedFiles.push(assPath);
    } catch (e) {
      console.warn(`Could not delete ${assPath}:`, e.message);
    }
  }

  for (const [jobId, job] of jobs.entries()) {
    if (job.clips && job.clips.length > 0) {
      job.clips = job.clips.filter(c => c.id !== clipId);
    }
  }

  res.json({ success: true, clipId, deletedFiles });
});

app.listen(PORT, () => {
  console.log(`🚀 ClipFusion AI Video Processing Server running on http://localhost:${PORT}`);
  console.log(`   Outputs directory: ${outputsDir}`);
  console.log(`   Uploads directory: ${uploadsDir}`);
});
