import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Film,
  Scissors,
  Flame,
  ArrowRight,
  ShieldCheck,
  Video,
  Play,
  UploadCloud,
  Check,
  Star,
  Layers,
  MessageSquare,
  Wand2
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { QuotaCalculator } from './QuotaCalculator';

interface LandingPageProps {
  onStartRepurposing: () => void;
  onPasteUrl: (url: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRepurposing,
  onPasteUrl
}) => {
  const [inputUrl, setInputUrl] = useState<string>('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onPasteUrl(inputUrl.trim());
    } else {
      onStartRepurposing();
    }
  };

  return (
    <div className="space-y-24 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/15 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-500/10">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>The Next-Gen Fusion of OpusClip & Vizard.ai</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-ping" />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Turn Long-Form Streams into{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            Viral TikToks & Reels
          </span>{' '}
          in 1 Click
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal">
          Harness the viral scoring of <strong>Opus.pro</strong> and the precision transcript studio of{' '}
          <strong>Vizard.ai</strong>. Powered by a strict <strong>24-Hour Rolling Quota Engine</strong> with an 8-Hour daily capacity (2× 4-Hour or 8× 1-Hour streams).
        </p>

        {/* Universal Input Ingestion Box right at the Top */}
        <div className="max-w-3xl mx-auto mt-8">
          <form
            onSubmit={handleUrlSubmit}
            className="p-2 rounded-2xl glass-panel-elevated border-2 border-purple-500/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2 transition focus-within:border-brand-purple"
          >
            <div className="flex-1 flex items-center gap-3 px-3 w-full">
              <Video className="w-5 h-5 text-purple-400 shrink-0" />
              <input
                type="text"
                placeholder="Paste YouTube, Twitch VOD, Rumble, Loom, Zoom or Podcast URL..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition active:scale-95 shrink-0"
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Generate Viral Clips</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Direct File Dropzone Trigger */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
            <button
              onClick={onStartRepurposing}
              className="hover:text-purple-300 flex items-center gap-1.5 transition underline underline-offset-4"
            >
              <UploadCloud className="w-3.5 h-3.5 text-brand-emerald" />
              Or drag & drop local files (MP4, MOV, MKV up to 4 Hours)
            </button>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-purple" />
              480-Min Rolling Quota Protection
            </span>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER 60FPS COMPARISON SLIDER */}
      <section>
        <BeforeAfterSlider />
      </section>

      {/* 24-HOUR ROLLING QUOTA CALCULATOR */}
      <section>
        <QuotaCalculator />
      </section>

      {/* SUPERPOWERS SHOWCASE (OPUS + VIZARD) */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-emerald font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Hybrid AI Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
            The Best of Opus.pro & Vizard.ai Combined
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Everything you need to turn raw unedited footage into high-converting vertical shorts without hiring an agency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Virality Score */}
          <div className="glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-brand-purple" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">AI Virality Score™ (0–100)</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">OPUS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every clip gets evaluated across <strong>Hook Strength, Pacing, Emotional Peak, and Retention Probability</strong> so you only publish shorts guaranteed to convert.
            </p>
          </div>

          {/* Card 2: Doc-Style Transcript Editing */}
          <div className="glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-brand-emerald border border-emerald-500/30 flex items-center justify-center">
              <Scissors className="w-6 h-6 text-brand-emerald" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Edit-by-Transcript</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">VIZARD</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Edit videos like a Google Doc! Delete words or sentences from the transcript to automatically trim video frames. 1-click removes all filler words and awkward silences.
            </p>
          </div>

          {/* Card 3: ClipAnything Search */}
          <div className="glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-brand-cyan border border-cyan-500/30 flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-brand-cyan" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">ClipAnything™ Multimodal Search</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">OPUS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type custom prompts like <em>"Find all moments where the guest talks about money"</em> or <em>"Extract the funniest joke"</em> to instantly isolate viral moments.
            </p>
          </div>

          {/* Card 4: AI Speaker Detection & Smart Reframe */}
          <div className="glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Smart Reframe & Split-Screen</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">VIZARD</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto face-tracking keeps speakers centered. Easily toggle between Single Speaker Fullscreen and Split-Screen (Top/Bottom) for multi-host podcasts and interviews.
            </p>
          </div>

          {/* Card 5: Dynamic Animated Captions */}
          <div className="glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Hormozi & MrBeast Captions</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">FUSION</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Word-by-word animated subtitles with custom color pop, active word emphasis, automated emoji injection, and AI B-roll overlays.
            </p>
          </div>

          {/* Card 6: 24h Rolling Quota Engine */}
          <div className="glass-card-interactive p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">24-Hour Rolling Quota</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">ENGINE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload up to 480 minutes (8 hours) every 24 hours. Accommodates 2× 4-hour streams or 8× 1-hour podcasts with live second-by-second countdown recovery.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="text-center p-12 rounded-3xl glass-panel-elevated border border-purple-500/30 relative overflow-hidden space-y-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 via-indigo-600/10 to-brand-emerald/15 pointer-events-none" />
        <h2 className="text-3xl sm:text-5xl font-display font-black text-white relative z-10">
          Ready to 10x Your Short-Form Video Output?
        </h2>
        <p className="text-slate-300 text-sm max-w-xl mx-auto relative z-10">
          Upload your first stream today with your full 480-minute rolling quota. Zero credit card required to test.
        </p>
        <div className="pt-2 relative z-10">
          <button
            onClick={onStartRepurposing}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-emerald hover:opacity-95 text-white font-extrabold text-base shadow-2xl shadow-purple-600/40 inline-flex items-center gap-3 transition active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span>Launch Creator Studio Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
