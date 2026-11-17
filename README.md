# ShortClip — AI Video Repurposing & Viral Clipping SaaS (OpusClip × Vizard.ai Fusion)

> **ShortClip** combines the viral intelligence superpowers of **OpusClip (Opus.pro)** and the precision multi-track timeline studio of **Vizard.ai**, governed by an intelligent **24-Hour Rolling Quota Engine**.

---

## ⚡ Core Superpowers

### 1. 24-Hour Rolling Quota Engine (Critical Business Logic)
- **Total Rolling Capacity**: 480 Minutes (8 Hours) per rolling 24-hour window.
- **Max Single Video Limit**: Up to 240 Minutes (4 Hours) per file or stream link.
- **Supported Upload Combinations within 24 Hours**:
  - Up to **2 videos** of **4 hours (240 mins)** each ($2 \times 240\text{m} = 480\text{m}$), OR
  - Up to **8 videos** of **1 hour (60 mins)** each ($8 \times 60\text{m} = 480\text{m}$), OR
  - **Any flexible mix** (e.g. 1× 4-hr + 4× 1-hr, or 16× 30-min).
- **Universal Ingestion**: Local files (MP4, MOV, MKV, WebM, AVI) with HTML5 video duration probing + Universal URLs (YouTube, Twitch, Rumble, Loom, Zoom, Drive, Vimeo, Podcasts).
- **Live Circular Quota Dashboard**: Live `HH:MM:SS` countdown timer to the exact second the oldest upload expires.
- **Developer Simulation Toolbar**: Instant buttons to simulate 1-hr/4-hr uploads, fast-forward time (+12h, +24h), and reset pool.

### 2. Opus.pro Viral Superpowers
- **AI Virality Score™ (0–100)**: Hook Strength, Pacing Cadence, Emotional Peak, and Retention Probability radar curves with AI rationale.
- **ClipAnything™ Multimodal Search**: Natural language semantic query search across long-form video transcripts.
- **Dynamic Animated Captions**: Word-by-word active pop in **Alex Hormozi**, **MrBeast**, **Iman Gadzhi**, and **Minimalist** styles with automated emoji injection.
- **Social Media Metadata Generator**: 1-click captions and viral hashtags for TikTok, Instagram Reels, YouTube Shorts, and LinkedIn.

### 3. Vizard.ai Studio Superpowers
- **Edit-by-Transcript (Doc-Style Video Editing)**: Word-level transcript display where deleting words/sentences trims corresponding video frames. 1-click **"Remove Filler Words"** (`um`, `uh`, `like`) and **"Remove Silences"**.
- **AI Speaker Detection & Smart Reframe**: Real-time aspect ratio switching (`9:16`, `1:1`, `16:9`, `4:5`) with face-tracking camera crop and **Split-Screen (Top/Bottom)** mode for 2-speaker podcast conversations.
- **Multi-Track Interactive Timeline**: 4 synchronized tracks (Video cuts, Dynamic captions, AI B-roll overlays, and Audio waveforms).
- **Custom Brand Kits & Hook Titles**: On-screen viral header banners and creator handle watermarks.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Dark Mode Creator Studio aesthetic, glassmorphism, neon violet/emerald accents)
- **Icons**: Lucide React
- **Visuals**: HTML5 Canvas, Video API, `canvas-confetti`

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/itsaviralsuman/ShortClip.git
cd ShortClip

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open `http://localhost:5173` to view the application in the browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License
