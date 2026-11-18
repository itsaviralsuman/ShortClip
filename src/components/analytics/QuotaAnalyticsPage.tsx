import React, { useState } from 'react';
import { useQuota } from '../../context/QuotaContext';
import { QuotaGauge } from '../common/QuotaGauge';
import {
  ShieldCheck,
  Clock,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Zap,
  Info,
  Play,
  FastForward,
  Wrench
} from 'lucide-react';
import { ROLLING_WINDOW_MS } from '../../utils/quotaEngine';

export const QuotaAnalyticsPage: React.FC = () => {
  const {
    remainingMinutes,
    activeUsageMinutes,
    activeUploads,
    fourHourSlotsAvailable,
    oneHourSlotsAvailable,
    percentUsed,
    countdownFormatted,
    effectiveNow,
    clearUploadHistory,
    resetAllQuota,
    simulateQuickUpload,
    fastForwardTime,
    simulatedTimeOffsetMs
  } = useQuota();

  const [toastMsg, setToastMsg] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const notify = (message: string, type: 'success' | 'error') => {
    setToastMsg({ message, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSimulate1Hr = () => {
    const res = simulateQuickUpload(60, 'Demo 1-Hour Stream (60m)');
    if (res.allowed) {
      notify('Simulated 1-Hour Upload (60m) added successfully!', 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const handleSimulate4Hr = () => {
    const res = simulateQuickUpload(240, 'Max 4-Hour Raw Stream (240m)');
    if (res.allowed) {
      notify('Simulated 4-Hour Upload (240m) added successfully!', 'success');
    } else {
      notify(res.message, 'error');
    }
  };

  const handleFastForward12h = () => {
    fastForwardTime(12);
    notify('Fast-forwarded clock by +12 Hours! Rolling window updated.', 'success');
  };

  const handleFastForward24h = () => {
    fastForwardTime(24);
    notify('Fast-forwarded clock by +24 Hours! 24h rolling slots restored.', 'success');
  };

  const handleReset = () => {
    resetAllQuota();
    notify('Quota reset to full 480 minutes capacity!', 'success');
  };

  const simulatedHours = Math.round(simulatedTimeOffsetMs / (1000 * 60 * 60));

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Core Mathematical Quota Engine</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-white">
          24-Hour Rolling Quota Engine Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Real-time mathematical audit of your rolling 24-hour ingestion and processing capacity.
        </p>
      </div>

      {/* Main Gauge */}
      <QuotaGauge />

      {/* Business Logic Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-purple-400 font-bold uppercase">
            Rule #1: 480-Minute Capacity
          </div>
          <h3 className="text-base font-bold text-white">8-Hour Daily Window</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every account gets 480 minutes of processing per continuous 24-hour window. This is not tied to a calendar midnight reset, but calculates on a dynamic rolling curve.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
            Rule #2: 240-Minute File Limit
          </div>
          <h3 className="text-base font-bold text-white">4-Hour Max Single Video</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No single file or stream link can exceed 240 minutes (4 hours). Large podcasts, Twitch VODs, or Zoom calls up to 4 hours are ingested using chunked processing.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
            Rule #3: Flexible Combinations
          </div>
          <h3 className="text-base font-bold text-white">2× 4-Hr or 8× 1-Hr Slots</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload two 4-hour streams (2 x 240m = 480m), eight 1-hour streams (8 x 60m = 480m), or any flexible mix (e.g. 1x 4hr + 4x 1hr).
          </p>
        </div>
      </div>

      {/* Active Uploads Table with Dynamic Expiration Calculation */}
      <div className="glass-panel-elevated p-6 rounded-2xl border border-purple-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Active Upload Records in Rolling Pool</h3>
            <p className="text-xs text-slate-400">
              Each upload frees up its consumed minutes exactly 24 hours after submission.
            </p>
          </div>

          <button
            onClick={resetAllQuota}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Pool to 480m</span>
          </button>
        </div>

        {activeUploads.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            No active uploads currently in the 24-hour rolling window. Your pool is 100% full (480 mins available).
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3">Video / Stream Name</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Duration</th>
                  <th className="pb-3">Submitted At</th>
                  <th className="pb-3">Expires & Restores In</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeUploads.map((up) => {
                  const expirationTime = up.uploadedAt + ROLLING_WINDOW_MS;
                  const diffSeconds = Math.max(0, Math.floor((expirationTime - effectiveNow) / 1000));
                  const hours = Math.floor(diffSeconds / 3600);
                  const mins = Math.floor((diffSeconds % 3600) / 60);
                  const secs = diffSeconds % 60;
                  const timeUntilRestored = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

                  return (
                    <tr key={up.id} className="text-slate-200">
                      <td className="py-3 font-semibold text-white">{up.filename}</td>
                      <td className="py-3 uppercase font-mono text-[11px] text-purple-300">
                        {up.source}
                      </td>
                      <td className="py-3 font-mono font-bold text-brand-cyan">
                        +{up.durationMinutes} mins
                      </td>
                      <td className="py-3 font-mono text-slate-400">
                        {new Date(up.uploadedAt).toLocaleTimeString()}
                      </td>
                      <td className="py-3 font-mono font-bold text-amber-400">
                        {timeUntilRestored}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          <CheckCircle className="w-3 h-3" />
                          Active Slot
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {toastMsg && (
          <div
            className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              toastMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/80 border-red-500/40 text-red-300'
            }`}
          >
            {toastMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{toastMsg.message}</span>
          </div>
        )}
      </div>

      {/* Developer Quota Simulation & Time Travel Sandbox */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Wrench className="w-4 h-4 text-brand-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Interactive Quota Simulation & Time Travel Sandbox</span>
                {simulatedHours > 0 && (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    +{simulatedHours}h Time Travel Active
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Simulate 1-hour or 4-hour video uploads and fast-forward clock to verify the 24-hour expiration mechanics.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
            <span>Reset Clock & Quota</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={handleSimulate1Hr}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-studio-900/80 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/40 text-slate-200 hover:text-white transition group"
          >
            <Play className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-bold">+1-Hr Upload</div>
              <div className="text-[10px] text-slate-400 font-mono">Consumes 60m</div>
            </div>
          </button>

          <button
            onClick={handleSimulate4Hr}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-studio-900/80 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/40 text-slate-200 hover:text-white transition group"
          >
            <Play className="w-4 h-4 text-brand-purple group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-bold">+4-Hr Upload</div>
              <div className="text-[10px] text-slate-400 font-mono">Consumes 240m</div>
            </div>
          </button>

          <button
            onClick={handleFastForward12h}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-studio-900/80 hover:bg-amber-900/20 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-white transition group"
          >
            <FastForward className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-bold">+12 Hours</div>
              <div className="text-[10px] text-slate-400 font-mono">Fast-forward clock</div>
            </div>
          </button>

          <button
            onClick={handleFastForward24h}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-studio-900/80 hover:bg-emerald-900/20 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-white transition group"
          >
            <FastForward className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-xs font-bold">+24 Hours</div>
              <div className="text-[10px] text-slate-400 font-mono">Full cycle reset</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
