import React, { useState } from 'react';
import { Calculator, CheckCircle2, AlertCircle, Sparkles, Clock, Zap } from 'lucide-react';
import { MAX_DAILY_CAPACITY_MINUTES, MAX_SINGLE_VIDEO_MINUTES } from '../../utils/quotaEngine';

export const QuotaCalculator: React.FC = () => {
  const [fourHourCount, setFourHourCount] = useState<number>(1);
  const [oneHourCount, setOneHourCount] = useState<number>(4);

  const totalMinutes = (fourHourCount * 240) + (oneHourCount * 60);
  const remainingPool = MAX_DAILY_CAPACITY_MINUTES - totalMinutes;
  const isExceeded = totalMinutes > MAX_DAILY_CAPACITY_MINUTES;
  const percentFilled = Math.min(100, Math.round((totalMinutes / MAX_DAILY_CAPACITY_MINUTES) * 100));

  return (
    <div className="glass-panel-elevated p-6 md:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 text-purple-300 text-xs font-semibold border border-purple-500/30 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            Interactive 24-Hour Quota Calculator
          </div>
          <h3 className="text-2xl font-display font-extrabold text-white">
            8-Hour Daily Power Limit (480 Mins)
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Test any flexible upload combination within your rolling 24-hour window. Max single video duration is 4 hours (240 mins).
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setFourHourCount(2); setOneHourCount(0); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 transition"
          >
            Preset: 2× 4-Hour (480m)
          </button>
          <button
            onClick={() => { setFourHourCount(0); setOneHourCount(8); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 transition"
          >
            Preset: 8× 1-Hour (480m)
          </button>
          <button
            onClick={() => { setFourHourCount(1); setOneHourCount(4); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-purple/20 text-purple-300 border border-purple-500/30 transition"
          >
            Preset: 1× 4-Hr + 4× 1-Hr
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-studio-900/60 p-5 rounded-2xl border border-slate-800">
        {/* Slider 1: 4-Hour Videos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-purple inline-block" />
              4-Hour Videos (240 mins each)
            </label>
            <span className="font-mono text-base font-bold text-brand-purple">
              {fourHourCount} videos ({fourHourCount * 240} mins)
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
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0</span>
            <span>1 (240m)</span>
            <span>2 (480m - Max)</span>
            <span>3 (Over Limit)</span>
          </div>
        </div>

        {/* Slider 2: 1-Hour Videos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-cyan inline-block" />
              1-Hour Videos (60 mins each)
            </label>
            <span className="font-mono text-base font-bold text-brand-cyan">
              {oneHourCount} videos ({oneHourCount * 60} mins)
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
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8 (480m)</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 font-medium">
            Daily Quota Allocation: <strong className="text-white font-mono">{totalMinutes} mins</strong> of 480 mins
          </span>
          <span className={`font-mono font-bold ${isExceeded ? 'text-red-400' : 'text-brand-emerald'}`}>
            {isExceeded ? `EXCEEDED BY ${Math.abs(remainingPool)} MINS` : `${remainingPool} mins remaining`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-studio-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            style={{ width: `${percentFilled}%` }}
            className={`h-full rounded-full transition-all duration-300 ${
              isExceeded
                ? 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-brand-purple via-indigo-500 to-brand-emerald'
            }`}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          {isExceeded ? (
            <div className="flex items-center gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl w-full">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Quota Exceeded:</strong> Total requested duration exceeds your 480-minute 24-hour limit.
                Reduce videos or wait for the rolling window to restore minutes.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl w-full">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
              <span>
                <strong>Combination Valid:</strong> Fully supported within your 24-hour rolling window!
                You can generate approximately <strong>{Math.floor(totalMinutes / 4)} viral shorts</strong> from this footage.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
