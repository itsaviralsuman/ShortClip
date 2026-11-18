import React, { useState, useRef } from 'react';
import { Sparkles, Video, Flame } from 'lucide-react';

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
      <div className="text-center py-2 sm:py-3 px-2">
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-purple-400 font-bold px-2.5 sm:px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
          60FPS Interactive Visual Engine
        </span>
        <h3 className="text-lg sm:text-xl font-display font-extrabold text-white mt-1">
          Long-Form Video Stream <span className="text-slate-500">→</span> 15 Viral Shorts in 1 Click
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 max-w-md mx-auto">
          Drag horizontally on mobile or laptop to compare original footage with AI-repurposed vertical short
        </p>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[21/9] rounded-xl overflow-hidden select-none cursor-ew-resize bg-studio-950 border border-slate-800 touch-none"
      >
        {/* AFTER (AI Viral Clip 9:16 vertical overlay with dynamic captions) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-purple-950/40 to-slate-900 flex items-center justify-center p-2">
          {/* Vertical 9:16 Mock Phone in Center */}
          <div className="relative w-44 xs:w-52 sm:w-64 h-[94%] bg-black rounded-xl sm:rounded-2xl border-2 border-purple-500/40 shadow-2xl overflow-hidden flex flex-col justify-between p-2.5 sm:p-4">
            {/* Top Hook Banner */}
            <div className="bg-yellow-400 text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-center font-black text-[9px] sm:text-[11px] tracking-tight uppercase shadow-lg animate-pulse truncate">
              WHY 99% CREATORS FAIL 💀
            </div>

            {/* Video preview with dynamic captions */}
            <div className="my-auto text-center space-y-1 sm:space-y-2">
              <div className="inline-block px-1.5 py-0.5 rounded bg-brand-emerald/20 text-brand-emerald border border-emerald-500/30 text-[9px] sm:text-[10px] font-mono font-bold">
                Virality: 97/100
              </div>
              <div className="caption-hormozi text-sm xs:text-base sm:text-2xl tracking-tighter leading-none">
                MOST CREATORS <br />
                <span className="text-yellow-400">SPEND 40 HOURS</span> <br />
                <span className="text-emerald-400">ON ONE VIDEO! ⏳</span>
              </div>
            </div>

            {/* Bottom Platform Pills */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-300 font-medium">
              <span className="flex items-center gap-1 truncate">
                <Flame className="w-3 h-3 text-rose-500 shrink-0" />
                TikTok & Reels
              </span>
              <span className="font-mono text-purple-400 shrink-0">1080p</span>
            </div>
          </div>

          {/* After Tag */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-brand-purple/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold border border-purple-400/40 flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="hidden xs:inline">AI Repurposed</span>
            <span>(9:16)</span>
          </div>
        </div>

        {/* BEFORE (Original Uncut Stream, clipped to slider position) */}
        <div
          style={{ width: `${sliderPosition}%` }}
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-brand-purple bg-studio-900"
        >
          <div className="relative w-[1000px] h-full flex items-center justify-center bg-slate-900/90">
            <img
              src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop&q=80"
              alt="Original Video Stream"
              className="w-full h-full object-cover filter grayscale contrast-75 brightness-50"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-1 sm:mb-2">
                <Video className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="font-mono text-xs sm:text-sm text-slate-300 font-bold">
                Original Uncut Stream (Wide 16:9)
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 max-w-xs mt-0.5 hidden xs:block">
                Horizontal wide angle, unedited pauses, filler words, zero captions.
              </span>
            </div>
          </div>

          {/* Before Tag */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-slate-900/90 backdrop-blur-md text-slate-300 text-[10px] sm:text-xs font-bold border border-slate-700 flex items-center gap-1">
            <Video className="w-3 h-3 text-slate-400" />
            <span>Original Stream</span>
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          style={{ left: `${sliderPosition}%` }}
          className="absolute inset-y-0 -ml-3.5 sm:-ml-4 w-7 sm:w-8 flex items-center justify-center pointer-events-none z-20"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-purple text-white shadow-lg shadow-purple-600/50 flex items-center justify-center border-2 border-white">
            <span className="text-[9px] sm:text-[10px] font-black tracking-widest">↔</span>
          </div>
        </div>
      </div>
    </div>
  );
};
