import React from 'react';
import { Video, Sparkles, Sliders, LayoutDashboard, Film, Shield, Zap } from 'lucide-react';
import { QuotaGauge } from './QuotaGauge';

export type ActiveTab = 'landing' | 'dashboard' | 'clips' | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenUploadModal: () => void;
  clipsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUploadModal,
  clipsCount = 4
}) => {
  return (
    <header className="sticky top-0 z-30 bg-studio-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple via-indigo-500 to-brand-cyan p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition duration-300">
            <div className="w-full h-full bg-studio-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                ClipFusion<span className="text-brand-purple">.AI</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider font-semibold">
                Opus × Vizard
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Viral Video Repurposing & Transcript Studio
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-studio-900/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('landing')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'landing'
                ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Creator Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('clips')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'clips'
                ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Viral Clips</span>
            <span className="px-1.5 py-0.2 rounded-full bg-brand-emerald/20 text-brand-emerald text-[10px] font-mono font-bold">
              {clipsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'analytics'
                ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Quota Engine</span>
          </button>
        </nav>

        {/* Right Action: Quota Gauge + Ingest CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <QuotaGauge compact />
          </div>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 transition duration-200 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Repurpose Video</span>
          </button>
        </div>
      </div>
    </header>
  );
};
