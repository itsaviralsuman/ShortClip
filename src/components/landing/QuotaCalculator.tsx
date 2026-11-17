import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { MAX_DAILY_CAPACITY_MINUTES } from '../../utils/quotaEngine';

export const QuotaCalculator: React.FC = () => {
  const [fourHourCount, setFourHourCount] = useState<number>(1);
  const [oneHourCount, setOneHourCount] = useState<number>(4);

  const totalMinutes = (fourHourCount * 240) + (oneHourCount * 60);
  const remainingPool = MAX_DAILY_CAPACITY_MINUTES - totalMinutes;
  const isExceeded = totalMinutes > MAX_DAILY_CAPACITY_MINUTES;
  const percentFilled = Math.min(100, Math.round((totalMinutes / MAX_DAILY_CAPACITY_MINUTES) * 100));

  return (
    <div className="glass-panel-elevated p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/30 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-brand-purple/20 text-purple-300 text-[11px] sm:text-xs font-semibold border border-purple-500/30 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            24-Hour Rolling Quota Calculator
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            8-Hour Daily Power Limit (480 Mins)
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 max-w-xl">
            Test any flexible upload combination within your rolling 24-hour window. Max single video duration is 4 hours (240 mins).
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          <button
            onClick={() => { setFourHourCount(2); setOneHourCount(0); }}
            className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 transition"
          >
            2× 4-Hr (480m)
          </button>
          <button
            onClick={() => { setFourHourCount(0); setOneHourCount(8); }}
            className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 transition"
          >
            8× 1-Hr (480m)
          </button>
          <button
            onClick={() => { setFourHourCount(1); setOneHourCount(4); }}
            className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-brand-purple/20 text-purple-300 border border-purple-500/30 transition"
          >
            1× 4-Hr + 4× 1-Hr
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-studio-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
        {/* Slider 1: 4-Hour Videos */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-purple inline-block" />
              4-Hour Videos (240 mins each)
            </label>
            <span className="font-mono text-sm sm:text-base font-bold text-brand-purple">
              {fourHourCount} ({fourHourCount * 240}m)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={fourHourCount}
            onChange={(e) => setFourHourCount(parseInt(e.target.value))}
            className="w-full accent-brand-purple cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0</span>
            <span>1 (240m)</span>
            <span>2 (480m - Max)</span>
            <span className="text-red-400">3 (Over)</span>
          </div>
        </div>

        {/* Slider 2: 1-Hour Videos */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan inline-block" />
              1-Hour Videos (60 mins each)
            </label>
            <span className="font-mono text-sm sm:text-base font-bold text-brand-cyan">
              {oneHourCount} ({oneHourCount * 60}m)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={oneHourCount}
            onChange={(e) => setOneHourCount(parseInt(e.target.value))}
            className="w-full accent-brand-cyan cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8 (480m)</span>
            <span className="text-red-400">10</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] sm:text-xs mb-2">
          <span className="text-slate-400 font-medium truncate">
            Allocation: <strong className="text-white font-mono">{totalMinutes}m</strong> of 480m
          </span>
          <span className={`font-mono font-bold shrink-0 ml-2 ${isExceeded ? 'text-red-400' : 'text-brand-emerald'}`}>
            {isExceeded ? `EXCEEDED BY ${Math.abs(remainingPool)}m` : `${remainingPool}m remaining`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 sm:h-3 bg-studio-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            style={{ width: `${percentFilled}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              isExceeded
                ? 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-brand-purple via-indigo-500 to-brand-emerald'
            }`}
          />
        </div>

        <div className="mt-3 sm:mt-4 flex items-center gap-3">
          {isExceeded ? (
            <div className="flex items-start gap-2 text-[11px] sm:text-xs text-red-300 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl w-full">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong>Quota Exceeded:</strong> Total requested duration exceeds 480 minutes. Reduce videos or let the 24h rolling window restore minutes.
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-[11px] sm:text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl w-full">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
              <span>
                <strong>Supported Combination:</strong> Fits within your 24-hour limit! Generates approximately <strong>{Math.floor(totalMinutes / 4)} viral shorts</strong>.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
