import React, { useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Type,
  Image,
  Music
} from 'lucide-react';
import { TranscriptWord, BRollTrigger } from '../../types';

interface MultiTrackTimelineProps {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  words: TranscriptWord[];
  bRollTracks: BRollTrigger[];
}

export const MultiTrackTimeline: React.FC<MultiTrackTimelineProps> = ({
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  onSeek,
  words,
  bRollTracks
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percent * duration);
  };

  const playheadPercent = Math.min(100, Math.max(0, (currentTime / (duration || 1)) * 100));

  return (
    <div className="h-36 sm:h-44 md:h-48 bg-studio-950 border-t border-slate-800 flex flex-col shrink-0 select-none text-xs">
      {/* Timeline Controls Header */}
      <div className="h-9 sm:h-10 px-3 sm:px-4 border-b border-slate-800 flex items-center justify-between bg-studio-900/60">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onSeek(0)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-studio-800 transition"
            title="Rewind to start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-2.5 sm:px-3 py-1 rounded-lg bg-brand-purple hover:bg-purple-600 text-white font-bold flex items-center gap-1 shadow-md shadow-purple-500/20 transition active:scale-95"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            <span className="text-[10px] sm:text-[11px]">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <div className="font-mono text-slate-300 font-semibold text-[11px] sm:text-xs ml-1 sm:ml-2">
            <span className="text-brand-cyan">{currentTime.toFixed(1)}s</span> / {duration.toFixed(1)}s
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 md:gap-4 text-slate-400 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-brand-purple inline-block" />
            <span>Video Cuts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-brand-emerald inline-block" />
            <span>Captions</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-amber-400 inline-block" />
            <span>AI B-Roll</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-brand-cyan inline-block" />
            <span>Waveform</span>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Tracks Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers (Left labels) */}
        <div className="w-16 sm:w-28 md:w-32 bg-studio-900/90 border-r border-slate-800 flex flex-col justify-around py-1 px-1.5 sm:px-3 text-[10px] sm:text-[11px] font-medium text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Video className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="hidden sm:inline truncate">Video Cuts</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Type className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline truncate">Captions</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Image className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden sm:inline truncate">AI B-Roll</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Music className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline truncate">Waveform</span>
          </div>
        </div>

        {/* Tracks Content Area & Scrubber */}
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="flex-1 relative cursor-pointer bg-studio-950 flex flex-col justify-around py-1 px-2 overflow-hidden"
        >
          {/* Vertical Playhead Cursor Line */}
          <div
            style={{ left: `${playheadPercent}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-30 pointer-events-none shadow-[0_0_8px_#FACC15]"
          >
            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-yellow-400 rounded-full -ml-[4px] sm:-ml-[5px] -mt-1 shadow-md" />
          </div>

          {/* Track 1: Video Track */}
          <div className="h-5 sm:h-6 w-full bg-studio-900 rounded-md relative overflow-hidden flex items-center px-1 border border-slate-800/80">
            {words.map((w) => {
              const leftPercent = (w.start / (duration || 1)) * 100;
              const widthPercent = ((w.end - w.start) / (duration || 1)) * 100;
              return (
                <div
                  key={w.id}
                  style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  className={`absolute h-3.5 sm:h-4 rounded-sm ${
                    w.isDeleted
                      ? 'bg-red-600/70 border border-red-500'
                      : 'bg-brand-purple/60 border border-purple-500/50'
                  }`}
                  title={`${w.text} ${w.isDeleted ? '(CUT)' : ''}`}
                />
              );
            })}
          </div>

          {/* Track 2: Caption Track */}
          <div className="h-5 sm:h-6 w-full bg-studio-900 rounded-md relative overflow-hidden flex items-center px-1 border border-slate-800/80">
            {words
              .filter((w) => !w.isDeleted)
              .map((w) => {
                const leftPercent = (w.start / (duration || 1)) * 100;
                const widthPercent = ((w.end - w.start) / (duration || 1)) * 100;
                return (
                  <div
                    key={w.id}
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                    className="absolute h-3.5 sm:h-4 rounded-sm bg-brand-emerald/70 border border-emerald-400/50 flex items-center justify-center overflow-hidden text-[7px] sm:text-[8px] font-mono text-white px-0.5"
                  >
                    {w.text}
                  </div>
                );
              })}
          </div>

          {/* Track 3: B-Roll Track */}
          <div className="h-5 sm:h-6 w-full bg-studio-900 rounded-md relative overflow-hidden flex items-center px-1 border border-slate-800/80">
            {bRollTracks.map((b) => {
              const leftPercent = (b.start / (duration || 1)) * 100;
              const widthPercent = ((b.end - b.start) / (duration || 1)) * 100;
              return (
                <div
                  key={b.id}
                  style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  className="absolute h-3.5 sm:h-4 rounded-sm bg-amber-500/70 border border-amber-400/60 flex items-center justify-center text-[8px] sm:text-[9px] font-mono text-black font-bold px-1 truncate"
                >
                  #{b.keyword}
                </div>
              );
            })}
          </div>

          {/* Track 4: Audio Waveform Simulation */}
          <div className="h-5 sm:h-6 w-full bg-studio-900 rounded-md relative overflow-hidden flex items-center px-1 border border-slate-800/80">
            <div className="w-full flex items-center justify-between h-3 opacity-60">
              {Array.from({ length: 45 }).map((_, i) => (
                <div
                  key={i}
                  style={{ height: `${20 + ((i * 13) % 80)}%` }}
                  className="w-1 bg-brand-cyan rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
