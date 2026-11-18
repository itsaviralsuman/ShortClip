import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Film,
  Shield,
  Zap,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Mail,
  Users
} from 'lucide-react';
import { QuotaGauge } from './QuotaGauge';
import { useAuth } from '../../context/AuthContext';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const {
    user,
    isAuthenticated,
    openAuthModal,
    signOut,
    activeSeats,
    maxSeats,
    notifications,
    openSecurityInbox
  } = useAuth();

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-7 md:top-8 z-30 bg-studio-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => handleTabClick('landing')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-purple via-indigo-500 to-brand-cyan p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition duration-300">
              <div className="w-full h-full bg-studio-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                  ClipFusion<span className="text-brand-purple">.AI</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider font-semibold">
                  Opus × Vizard
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-medium hidden md:block">
                Viral Video Repurposing & Transcript Studio
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-studio-900/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => handleTabClick('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'landing'
                  ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Creator Studio</span>
            </button>

            <button
              onClick={() => handleTabClick('clips')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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
              onClick={() => handleTabClick('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'analytics'
                  ? 'bg-brand-purple text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Quota Engine</span>
            </button>
          </nav>

          {/* Right Action: Quota Gauge + Sign In / User Profile + Ingest CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <QuotaGauge compact />
            </div>

            {/* 3-Seat Concurrency Indicator */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-studio-900 border border-slate-700/80 text-xs font-mono"
              title={`${activeSeats.length} of ${maxSeats} allowed devices currently logged in`}
            >
              <Users className="w-3.5 h-3.5 text-brand-emerald" />
              <span className="text-white font-bold">{activeSeats.length}/{maxSeats}</span>
              <span className="text-slate-400 text-[10px]">Seats</span>
            </div>

            {/* Email Notification Inbox Trigger */}
            <button
              onClick={openSecurityInbox}
              title="Security Email Notification Log (Kaise Hua)"
              className="relative p-2 rounded-xl bg-studio-900 border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white transition"
            >
              <Mail className="w-4 h-4 text-purple-400" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-purple text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Repurpose Video CTA */}
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-purple-500/25 transition duration-200 active:scale-95 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">Repurpose</span>
              <span>Video</span>
            </button>

            {/* Sign In / User Profile Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-studio-900 border border-slate-700 hover:border-purple-500/50 transition text-xs"
                >
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-purple-500/40 shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-brand-emerald ring-1 ring-black" />
                  </div>
                  <span className="hidden sm:inline font-semibold text-white max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel-elevated border border-purple-500/30 p-2 shadow-2xl z-50 text-xs animate-fade-in">
                    <div className="p-2 border-b border-slate-800">
                      <div className="font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{user.email}</div>
                      <div className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                        {user.plan} • 480m Quota Active
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full mt-1 flex items-center gap-2 p-2 rounded-xl text-red-300 hover:bg-red-500/10 transition text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-900 hover:bg-studio-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              >
                <User className="w-3.5 h-3.5 text-brand-purple" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-studio-800 border border-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-purple-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-studio-950/95 border-b border-purple-500/30 px-4 py-3 space-y-2 animate-fade-in backdrop-blur-xl">
            <div className="pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
              <QuotaGauge compact />
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-brand-purple text-white text-[11px] font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>

            <button
              onClick={() => handleTabClick('landing')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'landing' ? 'bg-brand-purple text-white' : 'text-slate-300 hover:bg-studio-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Home & Quota Calculator
              </span>
            </button>

            <button
              onClick={() => handleTabClick('dashboard')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'dashboard' ? 'bg-brand-purple text-white' : 'text-slate-300 hover:bg-studio-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-brand-emerald" />
                Creator Studio & Ingestion
              </span>
            </button>

            <button
              onClick={() => handleTabClick('clips')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'clips' ? 'bg-brand-purple text-white' : 'text-slate-300 hover:bg-studio-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                Opus Viral Clips ({clipsCount})
              </span>
            </button>

            <button
              onClick={() => handleTabClick('analytics')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                activeTab === 'analytics' ? 'bg-brand-purple text-white' : 'text-slate-300 hover:bg-studio-900'
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                24h Quota Analytics
              </span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Floating Bottom Quick-Nav Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-studio-950/90 backdrop-blur-xl border-t border-slate-800 px-3 py-2 flex items-center justify-around text-[10px] text-slate-400">
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'landing' ? 'text-brand-purple font-bold' : ''}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-brand-purple font-bold' : ''}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('clips')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'clips' ? 'text-brand-purple font-bold' : ''}`}
        >
          <Film className="w-4 h-4" />
          <span>Clips ({clipsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'analytics' ? 'text-brand-purple font-bold' : ''}`}
        >
          <Shield className="w-4 h-4" />
          <span>Quota</span>
        </button>
      </div>
    </>
  );
};
