import React, { useState, useRef } from 'react';
import { Sparkles, Video, Play, Flame } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  return (
    <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden glass-panel-elevated p-2 border border-purple-500/30">
      <div className="text-center py-3">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          60FPS Interactive Visual Engine
        </span>
        <h3 className="text-xl font-display font-extrabold text-white mt-1">
          Raw 4-Hour Stream <span className="text-slate-500">→</span> 15 Viral Shorts in 1 Click
        </h3>
        <p className="text-xs text-slate-400">
          Drag the center handle horizontally to compare the raw source footage with the AI-repurposed clip
        </p>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden select-none cursor-ew-resize bg-studio-950 border border-slate-800"
      >
        {/* AFTER (AI Viral Clip 9:16 vertical overlay with dynamic captions) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-purple-950/40 to-slate-900 flex items-center justify-center">
          {/* Vertical 9:16 Mock Phone in Center */}
          <div className="relative w-64 h-[92%] bg-black rounded-2xl border-2 border-purple-500/40 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            {/* Top Hook Banner */}
            <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-center font-black text-[11px] tracking-tight uppercase shadow-lg animate-pulse">
              WHY 99% OF CREATORS FAIL 💀
            </div>

            {/* Video preview with dynamic captions */}
            <div className="my-auto text-center space-y-2">
              <div className="inline-block px-2 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald border border-emerald-500/30 text-[10px] font-mono font-bold">
                Virality Score: 97/100
              </div>
              <div className="caption-hormozi text-2xl tracking-tighter leading-none">
                MOST CREATORS <br />
                <span className="text-yellow-400">SPEND 40 HOURS</span> <br />
                <span className="text-emerald-400">ON ONE VIDEO! ⏳</span>
              </div>
            </div>

            {/* Bottom Platform Pills */}
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-medium">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                TikTok + Reels Ready
              </span>
              <span className="font-mono text-purple-400">00:15 / 1080p</span>
            </div>
          </div>

          {/* After Tag */}
          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-brand-purple/80 backdrop-blur-md text-white text-xs font-bold border border-purple-400/40 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            AI Repurposed (9:16 + Dynamic Captions)
          </div>
        </div>

        {/* BEFORE (Raw 4-Hour Stream, clipped to slider position) */}
        <div
          style={{ width: `${sliderPosition}%` }}
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-brand-purple bg-studio-900"
        >
          <div className="relative w-[1000px] h-full flex items-center justify-center bg-slate-900/90">
            {/* Background unedited stream mock */}
            <img
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop&q=80"
              alt="Raw 4-Hour Stream"
              className="w-full h-full object-cover filter grayscale contrast-75 brightness-50"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
                <Video className="w-6 h-6" />
              </div>
              <span className="font-mono text-sm text-slate-300 font-bold">
                Raw 4-Hour Zoom / Podcast VOD (240 mins)
              </span>
              <span className="text-xs text-slate-400 max-w-sm mt-1">
                Horizontal 16:9, wide angle, unedited filler words, awkward silences, zero captions.
              </span>
            </div>
          </div>

          {/* Before Tag */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-slate-400" />
            Raw 4-Hour Stream (Uncut)
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute inset-y-0 -ml-4 w-8 flex items-center justify-center pointer-events-none z-20"
        >
          <div className="w-8 h-8 rounded-full bg-brand-purple text-white shadow-lg shadow-purple-600/50 flex items-center justify-center border-2 border-white">
            <span className="text-[10px] font-black tracking-widest">↔</span>
          </div>
        </div>
      </div>
    </div>
  );
};
