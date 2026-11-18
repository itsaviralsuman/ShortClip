# Implementation Roadmap: Next-Gen AI Video Repurposing Platform

**Execution Strategy**: Controlled, testable milestones. Each milestone must produce functional, verifiable code before proceeding.

---

## Milestone 1: The First Real End-to-End Pipeline (ACTIVE)
**Objective**: Replace all mock pipelines with real audio extraction, speech transcription, candidate discovery, and genuine FFmpeg MP4 video rendering.

### Tasks:
1. **Node.js Processing Backend (`/server`)**:
   - Initialize Express server with CORS, JSON body parser, and static file serving for rendered outputs.
   - Configure `@ffmpeg-installer/ffmpeg` and `@ffprobe-installer/ffprobe` for guaranteed cross-platform FFmpeg binary execution on Windows/Linux.
2. **Real Media Ingestion (`/api/upload` & `/api/process-url`)**:
   - Handle multipart file uploads directly to `server/uploads/`.
   - Probe media with `ffprobe` to verify real container, audio/video streams, bitrate, and duration.
3. **Real Audio Extraction & Speech Transcription**:
   - Extract 16kHz mono `.wav` audio using FFmpeg.
   - Run speech transcription with word-level start/end timestamps.
4. **Semantic Candidate Boundary Detection & Scoring**:
   - Group words into complete grammatical and semantic thoughts (30s to 60s windows).
   - Evaluate candidates against viral hook strength, information value, and narrative completion.
   - Discard weak candidates (<65 score).
5. **Real FFmpeg Video Slicing & Rendering**:
   - Execute FFmpeg commands cutting exact candidate start and end timestamps.
   - Reframe into 9:16 vertical short format with blurred ambient background.
   - Encode to valid `H.264 / AAC .mp4` files saved in `server/outputs/`.
6. **Frontend Integration & Real Downloads**:
   - Connect `src/context/VideoProjectContext.tsx` to call real backend endpoints.
   - Replace fake `alert('Export complete!')` with actual file download (`<a href="/outputs/clip.mp4" download>`).
   - Allow users to play the genuine rendered `.mp4` video files directly in the browser.

---

## Milestone 2: Multimodal Understanding & Clip Modes
**Objective**: Enhance candidate selection with visual scene detection and genre-specific clipping modes.

### Tasks:
1. **Visual Scene Detection**:
   - Integrate FFmpeg scene change filter (`gt(scene,0.3)`) to prevent cutting across mid-scene actions.
2. **Genre-Specific Clip Modes**:
   - Implement Podcast, Interview, Gaming, Education, Storytelling, and Vlog heuristics.
3. **Full Video Semantic Search**:
   - Index transcripts with vector embeddings or BM25 text search to find timestamps matching user search prompts.

---

## Milestone 3: Studio Editor & Advanced Reframing
**Objective**: Full parity with Vizard.ai and OpusClip studio capabilities.

### Tasks:
1. **Dynamic Word-by-Word Subtitle Burning**:
   - Generate ASS subtitle files with Hormozi, Beast, and Neon kinetic styles.
   - Burn subtitles directly into exported MP4 files via FFmpeg `-vf subtitles=...`.
2. **Subject & Face Tracking**:
   - Auto-detect bounding box of primary speaker; pan-and-scan camera reframe.
3. **Timeline Cut Adjustment**:
   - Allow users to nudge start/end timestamps in Studio, triggering fast sub-clip re-renders.

---

## Milestone 4: Quota Enforcement, Persistence & Production Hardening
**Objective**: Enforce rolling 24-hour upload limits on the backend and harden against failures.

### Tasks:
1. **Backend Database & Quota Store**:
   - SQLite / PostgreSQL persistent database for user accounts, upload history, and minute tracking.
   - Enforce 480-minute rolling window server-side.
2. **Asynchronous Worker Queue**:
   - Redis BullMQ / persistent queue for processing multi-hour videos without HTTP timeout.
   - Resumable job architecture with progress persistence.
3. **Automated End-to-End QA**:
   - Playwright automated regression tests verifying real video uploads, real rendering, and real downloads.
