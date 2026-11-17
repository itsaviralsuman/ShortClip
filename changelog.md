# Changelog — AI Video Repurposing & Viral Clipping SaaS (OpusClip + Vizard.ai Fusion)

All notable changes and architectural updates executed by the Senior Multi-Agent Squad are recorded here.

---

## [1.0.1] - 2026-11-17

### Added & Published
- **GitHub Remote Push**:
  - Initialized git repository on branch `main`.
  - Added `.gitignore` to protect `node_modules` and `dist`.
  - Created complete `README.md` with system overview, architecture breakdown, and local setup instructions.
  - Successfully published and pushed codebase to **[https://github.com/itsaviralsuman/ShortClip](https://github.com/itsaviralsuman/ShortClip)**.

---

## [1.0.0] - 2026-11-17

### Added
- **Core 24-Hour Rolling Quota Engine (`src/utils/quotaEngine.ts`, `src/context/QuotaContext.tsx`)**:
  - 480-minute (8-hour) total rolling capacity per user account.
  - 240-minute (4-hour) maximum single video upload limit.
  - Mathematical support for 2x 4-hour, 8x 1-hour, or any flexible combination ($1\times 4\text{hr} + 4\times 1\text{hr}$, $16\times 30\text{min}$).
  - Live second-by-second countdown timer (`HH:MM:SS`) to oldest slot expiration.
  - Pre-flight rejection with clear explanation when requested video duration exceeds single-file limit or rolling pool.
- **Developer Quick-Test Simulation Toolbar (`src/components/common/DevToolbar.tsx`)**:
  - `+ Simulate 1-Hr (60m)` quick upload button.
  - `+ Simulate 4-Hr (240m)` quick upload button.
  - `Fast-Forward +12h` and `Fast-Forward +24h` time travel controls.
  - `Reset Quota` button.
- **Universal Video Ingestion System (`src/components/dashboard/UploadModal.tsx`)**:
  - Direct local file upload (MP4, MOV, MKV, WebM, AVI) with HTML5 Video metadata duration probe.
  - Universal URL ingestion (YouTube, Twitch, Rumble, Loom, Zoom, Drive, Vimeo, Podcasts).
- **AI Processing Configuration Modal (`src/components/dashboard/ConfigModal.tsx`)**:
  - Target clip duration (<30s, 30-60s, 60-90s, 3m).
  - Auto-reframe aspect ratio (9:16, 1:1, 16:9, 4:5).
  - Viral dynamic caption templates (Alex Hormozi, MrBeast, Iman Gadzhi, Minimalist).
  - ClipAnything™ multimodal semantic search prompt filter.
  - Auto-emoji injection, filler word removal, and keyword highlighting toggles.
- **Opus-Style Viral Clips Results View (`src/components/results/ViralClipsView.tsx`, `ClipCard.tsx`)**:
  - Ranked list by AI Virality Score™ (0-100).
  - Virality radar metrics breakdown (Hook Strength, Pacing, Emotional Peak, Retention Probability).
  - AI Viral Rationale explanation.
  - 9:16 vertical video preview player with live dynamic animated captions.
  - Social media captions generator with 1-click copy for TikTok, Instagram Reels, YouTube Shorts, LinkedIn, and hashtags.
  - 1080p HD Export with canvas confetti celebration.
- **Vizard-Style Precision Multi-Track & Transcript Studio (`src/components/editor/StudioEditorModal.tsx`)**:
  - `TranscriptPanel.tsx`: Doc-style word-level transcript editor, click to seek, double-click to cut/delete, 1-click "Cut Fillers" (`um`, `uh`, `like`), 1-click "Trim Silences".
  - `CanvasStage.tsx`: 9:16 / 1:1 / 16:9 canvas with AI face tracking bounding box, Single Speaker vs Split-Screen Top/Bottom mode for 2-host podcasts, on-screen editable hook title header.
  - `BrandKitPanel.tsx`: Aspect ratio, speaker mode, caption preset, creator watermark, viral hook bumper.
  - `MultiTrackTimeline.tsx`: Multi-track scrubber (Video cuts track, Dynamic captions track, AI B-roll track, Audio waveform).
- **High-Converting Landing Page (`src/components/landing/LandingPage.tsx`)**:
  - Top hero URL ingestion box + drag-and-drop file uploader.
  - 60FPS interactive Before/After comparison slider (`BeforeAfterSlider.tsx`).
  - Interactive 24-hour quota calculator widget (`QuotaCalculator.tsx`).
  - Feature matrix showcasing Opus and Vizard superpowers.
