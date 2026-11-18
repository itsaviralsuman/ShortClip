# Changelog — AI Video Repurposing & Viral Clipping SaaS (OpusClip + Vizard.ai Fusion)

All notable changes and architectural updates executed by the Senior Multi-Agent Squad are recorded here.

---

## [1.0.8] - 2026-11-18

### YouTube Ingestion Metadata Detection & Creator Studio Workflow Fix
- **Workflow & Navigation Fix (`src/App.tsx`, `src/components/dashboard/DashboardPage.tsx`)**:
  - Fixed the abrupt navigation jump where uploading or pasting a video immediately forced the navbar tab to "Viral Clips".
  - Uploading now routes directly to **Creator Studio** (`dashboard`), where the user observes the active 5-stage AI neural progress bar (Audio Extraction -> Whisper Transcription -> Scene Tracking -> Virality Scoring -> Shorts Generation) in real-time.
  - On completion, a celebration banner displays the newly ingested video title, thumbnail, and a prominent `View Viral Clips (4) →` button, keeping the user in full control.
- **YouTube Automatic Live Metadata Detection (`src/utils/youtubeHelper.ts`, `src/components/dashboard/UploadModal.tsx`)**:
  - Implemented dynamic video ID extraction and live oEmbed metadata query for YouTube links (e.g. `https://youtu.be/iq9CN_xwmZo`).
  - Automatically detects the real video title (`MUNKAR 2024 full movie Indonesia`), creator (`BLOODMOON FILMS`), and high-res thumbnail (`https://i.ytimg.com/vi/iq9CN_xwmZo/hqdefault.jpg`).
  - Added live preview verification card inside the Upload Modal.
- **Customized Viral Shorts Generation (`src/context/VideoProjectContext.tsx`)**:
  - Ingested YouTube streams now generate tailored viral shorts reflecting the real video topic (e.g. horror climax, dark secret, viral scene, twist ending for *Munkar*), each paired with the genuine YouTube video thumbnail and Opus phrase karaoke captions.

---

## [1.0.7] - 2026-11-18

### Email Sign-In Alerts, 3-Device Workspace Cap & OpusClip Phrase Karaoke
- **Sign-In Security Email Notifications (`src/context/AuthContext.tsx`, `src/components/auth/SecurityInboxModal.tsx`, `SecurityToast.tsx`)**:
  - Implemented automatic transactional security email alert whenever a user logs in.
  - Generates RFC-822 formatted security email containing user details, timestamp, OS, Browser, Screen type, and Network IP.
  - Added real-time floating security toast alert + in-app **Security Inbox** reader with full Gmail/Outlook-style template inspection and architectural explanation of how the dispatch pipeline works.
- **Strict 3-Device / User Workspace Cap (`src/context/AuthContext.tsx`, `src/components/auth/SeatLimitModal.tsx`)**:
  - Enforced a hard ceiling of `MAX_ACTIVE_SEATS = 3` concurrent active devices/users across the application.
  - Automatically captures device fingerprints (`getClientDeviceInfo()`).
  - Blocks any 4th device attempting to sign in with an interactive **Seat Limit Exceeded Modal (3/3 Active Seats Occupied)**.
  - Added session revocation controls so authorized users can kick idle devices to free up seats.
  - Added live `Seats: X/3` indicator badge in Navbar.
- **OpusClip-Style Phrase Karaoke Captions (`src/utils/captionChunker.ts`, `src/components/editor/CanvasStage.tsx`, `src/components/results/ClipCard.tsx`)**:
  - Replaced isolated single-word subtitle display with true OpusClip-style 3–5 word spoken phrase chunks.
  - The entire sentence/phrase is visible on screen with high-contrast text and thick black border (Alex Hormozi / MrBeast standard).
  - Spoken words light up in real time with dynamic template highlight colors (e.g. Neon Yellow `#FACC15`, Lime `#4ADE80`), `scale-115` spring pop, and animated bouncing emojis above keywords.
  - Fully synchronized across both fullscreen Studio Canvas and Viral Clips cards.

---

## [1.0.6] - 2026-11-18

### Toolbar Removal & Vercel Injection Suppression
- **Removal of Sticky Dev Toolbar from Global UI (`src/App.tsx`)**:
  - Removed `<DevToolbar />` from the top of the app so no testing bar or "Dev Toolbar" badge pops up across pages on phones or laptops.
- **Relocation of Simulation Controls (`src/components/analytics/QuotaAnalyticsPage.tsx`)**:
  - Integrated the quota simulation tools (`+1h`, `+4h`, `+12h Fast-Forward`, `+24h Fast-Forward`, and `Reset Quota`) directly inside the dedicated "Quota Engine" tab within an Interactive Sandbox panel.
- **Vercel Toolbar & Feedback Injections Suppression (`src/index.css`)**:
  - Added aggressive CSS suppression rules targeting `#vercel-toolbar`, `[data-vercel-toolbar]`, `#vercel-live-feedback`, `.vercel-toolbar`, and `vercel.live` iframes so third-party toolbars never intrude on the user experience.
- **Vercel Deployment Configuration (`vercel.json`)**:
  - Added SPA rewrite configuration for single-page routing on Vercel deployments.

---

## [1.0.5] - 2026-11-18

### Dynamic Multi-Device Email Sign In & Unauthenticated Default State
- **Clean Default State on New Devices (`src/context/AuthContext.tsx`)**:
  - Eliminated hardcoded fallback user (`DEFAULT_USER`) that caused any new phone or device opening the site to pre-load as "Aviral Suman".
  - On first visit on any new phone, tablet, or browser, the app starts cleanly in unauthenticated guest mode (`user = null`) displaying the prominent "Sign In" button in the Navbar.
- **Dynamic Email & OTP Sign In Flow (`src/components/auth/AuthModal.tsx`)**:
  - Replaced pre-filled form fields with clean empty input states.
  - Implemented 2 authentic sign-in pathways:
    1. **Passwordless Email OTP Verification**: Enter any email address, click "Send Code", and verify with a simulated 6-digit one-time passcode (`654321` or any 6 digits).
    2. **Direct Email & Password Sign In / Registration**: Allows any user to input their custom name, email, and password.
  - Dynamic user profile avatar generator via DiceBear API based on the user's actual entered name/email (`https://api.dicebear.com/7.x/initials/svg?seed=...`).
  - Added clean sign-out action in navbar dropdown that flushes `localStorage` and resets state to guest.

---

## [1.0.4] - 2026-11-18

### Sign In, 35 OpusClip Caption Styles, Auto-Zoom & Auto B-Roll
- **Authentication & Sign In Flow (`src/context/AuthContext.tsx`, `src/components/auth/AuthModal.tsx`)**:
  - Added full Sign In / Sign Up authentication system with persistent user state in `localStorage`.
  - Added 1-Click "Continue with Google", "Continue with GitHub", and Email/Password sign in.
  - Navbar updated with user profile avatar, plan tier (`Creator Pro`), and dropdown menu with Sign Out.
- **Navbar Clean-Up**:
  - Removed "Showcase" and any "raw 4 hour stream" wording from navbar; streamlined to "Home", "Creator Studio", "Viral Clips", and "Quota Engine".
  - Cleaned up Hero Before/After slider to "Long-Form Video Stream → 15 Viral Shorts in 1 Click".
- **35 OpusClip Caption Templates (`src/data/captionTemplates.ts`)**:
  - Implemented 35 distinct caption style templates categorized exactly like OpusClip (Opus.pro):
    - *Creator Styles (10)*: Alex Hormozi (Yellow & Lime), MrBeast Comic, Iman Gadzhi Gold, Ali Abdaal Clean, GaryVee Shout, Joe Rogan Focus, Andrew Tate Neon, Grant Cardone 10X, Chris Do Design.
    - *Kinetic & Animated Series (10)*: Karaoke Bounce, Word Pop (1.3x Scale), Cyber Neon Glow, RGB Chroma Glitch, 3D Superhero Comic, Terminal Typewriter, Fire Blaze Flame, Frost Chill Ice, Sunset Pastel, Fluorescent Marker.
    - *Minimalist Subtitles (10)*: Classic Subtitle Pill, Cinematic Letterbox, Nordic Frost, Swiss Modern, Minimal Dark Shadow, Floating Glass Blur, Accent Underline, Vogue Editorial Serif, Developer Terminal Mono, Crystal Glass Border.
    - *Broadcast & Social Styles (5)*: TikTok Official, Netflix Original Yellow, Breaking News Lower-Third, Documentary Cinema, Dual-Tone Speaker Split.
  - Full search & category filter tabs in both Studio Editor and AI Config Modal.
- **Dynamic Camera Auto-Zoom Punch**:
  - Implemented dynamic auto-zoom camera punch (1.08x Subtle, 1.15x Dynamic, 1.25x High Energy) that punches in on energetic keywords to boost retention.
- **AI Emojis & Auto B-Roll Manager**:
  - Added dedicated controls for AI emoji placement (Above Word, Inline), animation styles (Bounce, Pop, Pulse, Float), and emoji packs (Viral Fire, Money Crypto, Growth Tech, Comedy Memes).
  - Added Auto B-Roll frequency selector (Conservative, Balanced, Aggressive), visual style sources (AI Stock, Motion Graphics, Cinematic, Reactions), and Ken Burns pan & zoom transitions.

---

## [1.0.3] - 2026-11-17

### Smooth Scrolling & Scroll Fade-Out Effects
- **Global Smooth Scrolling**: Added `scroll-behavior: smooth` with `-webkit-font-smoothing` and cubic-bezier easing curves across the entire app.
- **Scroll Fade-Out Masks (`.scroll-fade-y`, `.scroll-fade-x`)**:
  - Implemented Apple/Linear-style edge gradient transparency masks on scrollable containers.
- **Scroll-Driven Reveal (`useScrollReveal`)**:
  - Added an interactive IntersectionObserver hook with smooth `opacity` and `translate-y` transitions.

---

## [1.0.2] - 2026-11-17

### Mobile & Laptop Cross-Device Optimization
- **Responsive Navigation**: Added collapsible mobile hamburger menu and sticky mobile bottom navigation bar.
- **Responsive Vizard Studio Editor**: Segmented mobile tab switcher (`[📱 Canvas]`, `[✂️ Transcript]`, `[🎨 Brand Kit]`) for phones.
- **Mobile Touch Ergonomics & Timeline**: Touch-optimized multi-track timeline scrubber.

---

## [1.0.1] - 2026-11-17

### Added & Published
- **GitHub Remote Push**:
  - Successfully published codebase to **[https://github.com/itsaviralsuman/ShortClip](https://github.com/itsaviralsuman/ShortClip)**.

---

## [1.0.0] - 2026-11-17

### Initial Release
- 24-Hour Rolling Quota Engine (480 mins / 8 hours capacity, 240 mins max per single file).
- Hybrid OpusClip + Vizard.ai video repurposing studio.
