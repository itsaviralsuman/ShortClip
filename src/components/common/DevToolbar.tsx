import React, { useState } from 'react';
import { useQuota } from '../../context/QuotaContext';
import { Play, FastForward, RotateCcw, Wrench, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const DevToolbar: React.FC = () => {
  const {
    simulateQuickUpload,
    fastForwardTime,
    resetAllQuota,
    simulatedTimeOffsetMs
  } = useQuota();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSimulate1Hr = () => {
    const res = simulateQuickUpload(60, 'Demo 1-Hour Stream (60m)');
    if (res.allowed) {
      showToast('Simulated 1-Hour Upload (60m) added successfully!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSimulate4Hr = () => {
    const res = simulateQuickUpload(240, 'Max 4-Hour Raw Stream (240m)');
    if (res.allowed) {
      showToast('Simulated 4-Hour Upload (240m) added successfully!', 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleFastForward12h = () => {
    fastForwardTime(12);
    showToast('Fast-forwarded clock by +12 Hours! Rolling window updated.', 'success');
  };

  const handleFastForward24h = () => {
    fastForwardTime(24);
    showToast('Fast-forwarded clock by +24 Hours! 24h rolling slots expired and quota restored.', 'success');
  };

  const handleResetPool = () => {
    resetAllQuota();
    showToast('Quota reset to full 480 minutes capacity!', 'success');
  };

  const simulatedHours = Math.round(simulatedTimeOffsetMs / (1000 * 60 * 60));

  return (
    <div className="bg-studio-900/95 border-b border-purple-500/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 sticky top-0 z-50 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Toolbar Label & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold border border-purple-500/30 text-[11px]"
          >
            <Wrench className="w-3 h-3 text-brand-purple" />
            <span>Dev Toolbar</span>
            {isMobileOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold border border-purple-500/30">
            <Wrench className="w-3.5 h-3.5 text-brand-purple" />
            <span>DEV QUOTA TESTING TOOLBAR</span>
          </div>

          {simulatedHours > 0 && (
            <span className="text-[10px] sm:text-[11px] text-amber-400 font-mono">
              (+{simulatedHours}h)
            </span>
          )}
        </div>

        {/* Desktop Button Row */}
        <div className="hidden md:flex items-center flex-wrap gap-2">
          <button
            onClick={handleSimulate1Hr}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-studio-800 hover:bg-studio-700 hover:text-white border border-slate-700 transition"
            title="Uploads a simulated 60-minute video"
          >
            <Play className="w-3 h-3 text-brand-cyan" />
            <span>+ Simulate 1-Hr (60m)</span>
          </button>

          <button
            onClick={handleSimulate4Hr}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-purple/20 hover:bg-brand-purple/30 text-purple-200 border border-purple-500/40 font-medium transition"
            title="Uploads a simulated 240-minute (4-hour) video (Max Limit)"
          >
            <Play className="w-3 h-3 text-purple-400" />
            <span>+ Simulate 4-Hr (240m)</span>
          </button>

          <button
            onClick={handleFastForward12h}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-studio-800 hover:bg-studio-700 text-slate-300 border border-slate-700 transition"
            title="Advance clock by 12 hours"
          >
            <FastForward className="w-3 h-3 text-amber-400" />
            <span>+12h</span>
          </button>

          <button
            onClick={handleFastForward24h}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-studio-800 hover:bg-studio-700 text-slate-300 border border-slate-700 transition"
            title="Advance clock by 24 hours to clear all expired uploads"
          >
            <FastForward className="w-3 h-3 text-brand-emerald" />
            <span>+24h (Reset)</span>
          </button>

          <button
            onClick={handleResetPool}
            className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition"
            title="Reset history and quota to 480m"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Mobile Quick Action Pill */}
        <div className="md:hidden flex items-center gap-1.5">
          <button
            onClick={handleSimulate1Hr}
            className="px-2 py-0.5 rounded bg-studio-800 text-brand-cyan border border-slate-700 text-[10px] font-mono"
          >
            +1h
          </button>
          <button
            onClick={handleSimulate4Hr}
            className="px-2 py-0.5 rounded bg-brand-purple/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold"
          >
            +4h
          </button>
          <button
            onClick={handleFastForward24h}
            className="px-2 py-0.5 rounded bg-emerald-500/15 text-brand-emerald border border-emerald-500/30 text-[10px] font-mono"
          >
            +24h
          </button>
        </div>
      </div>

      {/* Mobile Expanded Drawer */}
      {isMobileOpen && (
        <div className="md:hidden pt-2 pb-1 border-t border-slate-800 mt-1.5 grid grid-cols-2 gap-1.5 animate-fade-in">
          <button
            onClick={handleSimulate1Hr}
            className="p-1.5 rounded bg-studio-800 text-slate-200 border border-slate-700 text-[11px] flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3 text-brand-cyan" />
            <span>+ 1-Hour (60m)</span>
          </button>
          <button
            onClick={handleSimulate4Hr}
            className="p-1.5 rounded bg-brand-purple/20 text-purple-200 border border-purple-500/40 text-[11px] font-medium flex items-center justify-center gap-1"
          >
            <Play className="w-3 h-3 text-purple-400" />
            <span>+ 4-Hour (240m)</span>
          </button>
          <button
            onClick={handleFastForward12h}
            className="p-1.5 rounded bg-studio-800 text-slate-300 border border-slate-700 text-[11px] flex items-center justify-center gap-1"
          >
            <FastForward className="w-3 h-3 text-amber-400" />
            <span>Fast-Forward +12h</span>
          </button>
          <button
            onClick={handleFastForward24h}
            className="p-1.5 rounded bg-studio-800 text-slate-300 border border-slate-700 text-[11px] flex items-center justify-center gap-1"
          >
            <FastForward className="w-3 h-3 text-brand-emerald" />
            <span>Reset (+24h)</span>
          </button>
          <button
            onClick={handleResetPool}
            className="col-span-2 p-1.5 rounded bg-red-500/10 text-red-300 border border-red-500/30 text-[11px] flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>Reset Quota Pool to 480m</span>
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 max-w-[90vw] sm:max-w-md ${
            notification.type === 'success'
              ? 'bg-studio-900/95 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20'
              : 'bg-studio-900/95 border-red-500/50 text-red-300 shadow-red-500/20'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}
    </div>
  );
};
