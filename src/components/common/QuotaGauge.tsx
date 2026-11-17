import React from 'react';
import { useQuota } from '../../context/QuotaContext';
import { Clock, HardDrive, ShieldCheck, AlertTriangle } from 'lucide-react';

interface QuotaGaugeProps {
  compact?: boolean;
}

export const QuotaGauge: React.FC<QuotaGaugeProps> = ({ compact = false }) => {
  const {
    remainingMinutes,
    activeUsageMinutes,
    fourHourSlotsAvailable,
    oneHourSlotsAvailable,
    percentUsed,
    countdownFormatted,
    activeUploads
  } = useQuota();

  const isLow = remainingMinutes < 60;
  const isFull = remainingMinutes === 0;

  if (compact) {
    return (
      <div className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 rounded-full glass-panel border border-purple-500/20 text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          <span className={`w-2 h-2 rounded-full ${isFull ? 'bg-red-500 animate-pulse' : isLow ? 'bg-amber-400' : 'bg-brand-emerald animate-pulse'}`} />
          <span className="text-slate-300">24h Quota:</span>
          <span className={`font-mono font-bold ${isFull ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-brand-emerald'}`}>
            {remainingMinutes}m
          </span>
          <span className="text-slate-500">/ 480m</span>
        </div>

        <div className="h-3 w-px bg-slate-700" />

        <div className="flex items-center gap-1 text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-brand-purple" />
          <span>{countdownFormatted}</span>
        </div>
      </div>
    );
  }

  // Full detailed gauge
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentUsed / 100) * circumference;

  return (
    <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-purple/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-brand-purple/20 text-brand-purple border border-purple-500/30">
            <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              24-Hour Rolling Quota
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 border border-purple-500/30 font-bold">
                8-Hour Cap
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-400">Strict rolling capacity per user account</p>
          </div>
        </div>

        {/* Live Countdown Badge */}
        <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-studio-900 border border-slate-700/60 font-mono text-xs self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-brand-emerald animate-pulse" />
          <span className="text-slate-400">Next Reset:</span>
          <span className="text-slate-200 font-bold">{countdownFormatted}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center">
        {/* Radial Circular Progress */}
        <div className="flex items-center gap-3 sm:gap-4 bg-studio-900/60 p-3 rounded-xl border border-slate-800">
          <div className="relative w-20 sm:w-24 h-20 sm:h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-studio-800 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={`stroke-current transition-all duration-700 ease-out ${
                  isFull ? 'text-red-500' : isLow ? 'text-amber-400' : 'text-brand-emerald'
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-lg font-black font-mono text-slate-100">{remainingMinutes}</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">mins left</span>
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Daily Consumption</div>
            <div className="text-xs sm:text-sm font-bold text-slate-200">
              {activeUsageMinutes}m <span className="text-slate-500 font-normal">used of 480m</span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">
              {percentUsed}% capacity allocated
            </div>
          </div>
        </div>

        {/* 4-Hour Slots & 1-Hour Slots Box */}
        <div className="bg-studio-900/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-full">
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium mb-1.5 flex items-center justify-between">
              <span>Supported Upload Slots</span>
              <span className="text-[9px] sm:text-[10px] text-brand-purple">Max 240m / file</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-studio-800/80 p-2 rounded-lg border border-slate-700/50 text-center">
                <span className="block text-[11px] text-slate-400">4-Hour Slots</span>
                <span className="text-base sm:text-lg font-black text-brand-purple font-mono">
                  {fourHourSlotsAvailable} <span className="text-[11px] text-slate-500 font-normal">/ 2</span>
                </span>
              </div>
              <div className="bg-studio-800/80 p-2 rounded-lg border border-slate-700/50 text-center">
                <span className="block text-[11px] text-slate-400">1-Hour Slots</span>
                <span className="text-base sm:text-lg font-black text-brand-cyan font-mono">
                  {oneHourSlotsAvailable} <span className="text-[11px] text-slate-500 font-normal">/ 8</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-brand-emerald" />
            Automatic minute-by-minute window release
          </div>
        </div>

        {/* Active Uploads in Rolling Window with edge fade mask */}
        <div className="bg-studio-900/60 p-3 rounded-xl border border-slate-800 flex flex-col justify-between h-full">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium mb-1.5 flex items-center justify-between">
            <span>Recent Active Window</span>
            <span className="text-[10px] text-slate-400">{activeUploads.length} item(s)</span>
          </div>

          <div className="space-y-1.5 max-h-20 overflow-y-auto pr-1 scroll-fade-y">
            {activeUploads.length === 0 ? (
              <div className="text-xs text-slate-500 py-3 text-center">
                No active uploads in current 24h window
              </div>
            ) : (
              activeUploads.map(up => (
                <div key={up.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-studio-800/40 border border-slate-800">
                  <span className="truncate max-w-[130px] text-slate-300" title={up.filename}>
                    {up.filename}
                  </span>
                  <span className="font-mono text-purple-300 font-bold ml-2 shrink-0">
                    +{up.durationMinutes}m
                  </span>
                </div>
              ))
            )}
          </div>

          {isFull && (
            <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Quota locked. Wait for slot expiration.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
