# CRITICAL PROJECT AUDIT & DEFECT REPORT

**Date:** 2026-11-18  
**Production URL:** https://abhinavpandey099.vercel.app/  
**Reference Product:** https://www.opus.pro/  
**Audit Scope:** Full codebase audit covering frontend, backend API, video processing pipeline, AI transcription/scoring, FFmpeg integration, audio mapping, video playback, clip constraints, deletion, and deployment.

---

## 1. Executive Summary & Core Diagnosis

The platform is designed to provide automated long-to-short video repurposing inspired by OpusClip and Vizard.ai. While the UI structure and core styling are established, deep technical inspection reveals 8 critical architectural defects that directly compromise video clipping quality, playback stability, and clip quantity:

1. **Hardcoded 4-Clip Ceiling:** Both the candidate service and frontend context hardcode 4-element arrays, preventing the AI from returning 8+ clips on long source streams.
2. **Sub-60s Duration Violation:** Clips were generated with durations as short as 18s–24s, violating the strict 60s–120s (1–2 minute) requirement.
3. **No Clip Deletion Functionality:** The UI lacked a working clip deletion button, confirmation dialogue, and persistent state removal.
4. **Volatile In-Memory State Lost on Page Refresh:** `VideoProjectContext` resets to static sample projects upon browser refresh (`F5`), dropping newly generated clips.
5. **Playback Failure on In-Progress / Unfinished FFmpeg Output:** FFmpeg renders were writing directly to the target file name. Browsers attempting to play or probe partially rendered files fail and cache a corrupt state.
6. **Missing Batch & ZIP Export:** Users could only export clips individually; no batch export or ZIP archive packaging existed.
7. **Static Vercel SPA vs. Long Video Processing:** Vercel functions cannot run long-form FFmpeg transcoding due to execution timeouts (10s–60s) and lack of bundled FFmpeg binaries in serverless containers. The local backend Express server must be resilient with persistent jobs.
8. **Audio Stream Preservation & Codec Normalization:** In certain multi-track inputs or mono streams, audio mapping needed explicit `-c:a aac -ar 44100 -ac 2` normalization to prevent silent exported MP4s.

---

## 2. Detailed Bug Matrix, Root Causes & Affected Files

| # | Bug Description | Root Cause | Affected Files | Proposed Fix |
|---|---|---|---|---|
| **1** | **Strict 4-Clip Limit** (Never generates 8+ clips) | `candidateService.js` had a hardcoded 4-element `candidateWindows` array. `VideoProjectContext.tsx` mapped only `SAMPLE_CLIPS` (length 4) and hardcoded 4 duration/offset slots. | `server/services/candidateService.js`<br>`src/context/VideoProjectContext.tsx`<br>`server/index.js`<br>`src/components/common/Navbar.tsx` | Dynamically calculate candidate moments based on source duration: for videos >= 10m, generate 8 to 12 candidate moments spaced across the entire timeline. Support dynamic clip count. |
| **2** | **Clip Durations < 60s or > 120s** | `targetDurations` used values like 24.5s, 18.2s, 48.2s. `minClipDuration` in candidate service was set to 18s. | `server/services/candidateService.js`<br>`src/context/VideoProjectContext.tsx`<br>`src/components/opus/OpusIngestionPanel.tsx` | Enforce strict boundaries: `MIN_DURATION = 60.0s`, `MAX_DURATION = 120.0s`. Clamp all candidate durations between 60.0 and 120.0 seconds. |
| **3** | **Missing Clip Deletion** | Zero deletion buttons or handlers exist in `ClipCard.tsx` or `ViralClipsView.tsx`. | `src/components/results/ClipCard.tsx`<br>`src/components/results/ViralClipsView.tsx`<br>`src/context/VideoProjectContext.tsx`<br>`src/types/index.ts` | Add `deleteClip(clipId)` in context, add a trash icon button on `ClipCard` with confirmation modal, update project clip counts, and persist in storage. |
| **4** | **Data Loss on Refresh** | `VideoProjectContext.tsx` uses `useState(INITIAL_PROJECTS)` with no `localStorage` or IndexedDB persistence. | `src/context/VideoProjectContext.tsx` | Implement `localStorage` synchronization with schema versioning. Projects, custom clips, and deletion states persist across reloads. |
| **5** | **Video Playback Freezing / Silent Audio** | (a) FFmpeg writing output files in-place without `.tmp` staging, leading to browsers reading 0-byte or half-written streams.<br>(b) Audio stream mapping `-map 0:a?` without explicit audio channel/rate resampling. | `server/services/ffmpegService.js`<br>`server/index.js`<br>`src/components/results/ClipCard.tsx` | Stage renders to `.tmp.mp4` and atomically rename on completion. Normalize audio to AAC stereo (`-ac 2 -ar 44100`). Add robust HTML5 video error handlers with fallback. |
| **6** | **Missing Configure & Batch Export Tools** | No "Select All", "Deselect All", "Delete Selected", or "Download All as ZIP". | `src/components/results/ViralClipsView.tsx`<br>`src/components/results/ClipCard.tsx` | Add multi-select checkboxes on clips, a bulk action toolbar (Delete Selected, Export Selected, Export All ZIP), and ZIP packaging. |
| **7** | **Vercel Architecture Mismatch** | Vercel production deployment (`https://abhinavpandey099.vercel.app/`) serves a static Vite SPA without local Express backend. | `vercel.json`<br>`src/context/VideoProjectContext.tsx` | Ensure frontend gracefully detects backend availability, displays clear engine status badges, and provides robust client-side fallback with real MP4 blob generation where available. |

---

## 3. Implementation Plan

1. **Candidate Engine Refactor (`candidateService.js`):**
   - Implement dynamic candidate generator: calculate segment spacing for 8 to 12 clips based on video duration.
   - Enforce 60s–120s rule: every single clip must have `duration >= 60.0` and `duration <= 120.0`.
   - Calculate semantic scores (Hook, Completeness, Retention, Pacing, Info Value) and filter out weak/overlapping moments.

2. **Backend FFmpeg & Video Service Refactor (`ffmpegService.js`):**
   - Atomic rendering: render to `${outputPath}.tmp.mp4`, then rename to `${outputPath}` when complete.
   - Audio normalization: `-c:a aac -b:a 192k -ar 44100 -ac 2` to guarantee audible stereo sound on all mobile and desktop browsers.
   - Faststart header optimization: `-movflags +faststart` on all outputs for instant browser scrubbing.

3. **Frontend Context & Persistence (`VideoProjectContext.tsx`):**
   - Persist projects to `localStorage` under `clipfusion_projects_v2`.
   - Add `deleteClip(clipId)` method that updates active project and persistent storage.
   - Dynamic clip mapping: support any number of clips (8, 10, 12) rather than fixed 4.

4. **UI Enhancement & Multi-Select (`ViralClipsView.tsx` & `ClipCard.tsx`):**
   - Add Delete Clip button with confirmation modal.
   - Add selection checkbox on each clip card.
   - Add bulk actions toolbar: "Select All", "Delete Selected", "Batch Export HD", "Download All as ZIP".
   - Add duration badges verifying `60s–120s` compliance.

5. **Automated Testing & FFprobe Verification:**
   - Verify real MP4 outputs with ffprobe for duration >= 60s, <= 120s, valid H.264 video, and valid AAC audio.
   - Run E2E test verifying deletion, persistence, 8+ clips, and playback.
