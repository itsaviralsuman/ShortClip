import React, { useState } from 'react';
import { useQuota } from '../../context/QuotaContext';
import { Play, FastForward, RotateCcw, Wrench, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export const DevToolbar: React.FC = () => {
  const {
    simulateQuickUpload,
    fastForwardTime,
    resetSimulatedTime,
    resetAllQuota,
    clearUploadHistory,
    simulatedTimeOffsetMs
  } = useQuota();

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
    <div className="bg-studio-900/90 border-b border-purple-500/20 backdrop-blur-md px-4 py-2 sticky top-0 z-40 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold border border-purple-500/30">
            <Wrench className="w-3.5 h-3.5 text-brand-purple" />
            DEV QUOTA TESTING TOOLBAR
          </div>
          {simulatedHours > 0 && (
            <span className="text-[11px] text-amber-400 font-mono">
              (Time Travel: +{simulatedHours}h)
            </span>
          )}
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Upload Buttons */}
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

          {/* Time Machine Buttons */}
          <button
            onClick={handleFastForward12h}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-studio-800 hover:bg-studio-700 text-slate-300 border border-slate-700 transition"
            title="Advance clock by 12 hours"
          >
            <FastForward className="w-3 h-3 text-amber-400" />
            <span>Fast-Forward +12h</span>
          </button>

          <button
            onClick={handleFastForward24h}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-studio-800 hover:bg-studio-700 text-slate-300 border border-slate-700 transition"
            title="Advance clock by 24 hours to clear all expired uploads"
          >
            <FastForward className="w-3 h-3 text-brand-emerald" />
            <span>Fast-Forward +24h</span>
          </button>

          <button
            onClick={handleResetPool}
            className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition"
            title="Reset history and quota to 480m"
          >
            <RotateCcw className="w-3 h-3 text-red-400" />
            <span>Reset Quota</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 ${
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
