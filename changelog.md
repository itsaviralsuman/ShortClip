# Changelog — AI Video Repurposing & Viral Clipping SaaS (OpusClip + Vizard.ai Fusion)

All notable changes and architectural updates executed by the Senior Multi-Agent Squad are recorded here.

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
