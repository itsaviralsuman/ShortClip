import React, { useRef, useEffect } from 'react';
import {
  AspectRatio,
  CaptionPreset,
  SpeakerMode,
  TranscriptWord,
  BRollTrigger
} from '../../types';
import {
  Play,
  Pause,
  Scan
} from 'lucide-react';

interface CanvasStageProps {
  videoUrl?: string;
  posterUrl: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  aspectRatio: AspectRatio;
  captionPreset: CaptionPreset;
  speakerMode: SpeakerMode;
  hookTitle: string;
  onUpdateHookTitle: (title: string) => void;
  words: TranscriptWord[];
  bRollTracks: BRollTrigger[];
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  videoUrl,
  posterUrl,
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  aspectRatio,
  captionPreset,
  speakerMode,
  hookTitle,
  onUpdateHookTitle,
  words,
  bRollTracks
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync play state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync time seek
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.4) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Determine active word
  const activeWord = words.find(
    (w) => !w.isDeleted && currentTime >= w.start && currentTime <= w.end
  );

  // Determine active B-roll overlay
  const activeBRoll = bRollTracks.find(
    (b) => b.enabled && currentTime >= b.start && currentTime <= b.end
  );

  // Responsive Aspect ratio wrapper styling (fluid on mobile, fixed max on laptop)
  const aspectClass =
    aspectRatio === '9:16'
      ? 'w-[220px] xs:w-[260px] sm:w-[300px] md:w-[320px] aspect-[9/16]'
      : aspectRatio === '1:1'
      ? 'w-[260px] sm:w-[360px] md:w-[400px] aspect-square'
      : aspectRatio === '16:9'
      ? 'w-[90vw] sm:w-[500px] md:w-[560px] aspect-video'
      : 'w-[260px] sm:w-[320px] md:w-[360px] aspect-[4/5]';

  const captionStyle =
    captionPreset === 'hormozi'
      ? 'caption-hormozi text-lg sm:text-2xl text-yellow-300'
      : captionPreset === 'mrbeast'
      ? 'caption-mrbeast text-lg sm:text-2xl text-cyan-300'
      : captionPreset === 'iman'
      ? 'caption-iman text-base sm:text-xl text-amber-100 italic'
      : 'caption-minimalist text-xs sm:text-base text-white';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 bg-studio-900/60 overflow-hidden relative">
      {/* Top Floating Controls info */}
      <div className="absolute top-2 sm:top-4 inset-x-3 sm:inset-x-6 flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto bg-studio-950/80 px-2 sm:px-3 py-1 rounded-xl border border-slate-800 text-[10px] sm:text-xs">
          <Scan className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-emerald animate-pulse" />
          <span className="font-mono text-slate-200">
            {speakerMode === 'split-top-bottom' ? 'Split-Screen Mode' : 'Single Host Mode'}
          </span>
        </div>

        <div className="bg-studio-950/80 px-2 sm:px-3 py-1 rounded-xl border border-slate-800 font-mono text-slate-200 text-[10px] sm:text-xs">
          {aspectRatio}
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-purple-500/40 select-none group my-auto`}>
        {/* Render Single vs Split-Screen */}
        {speakerMode === 'split-top-bottom' ? (
          <div className="w-full h-full flex flex-col">
            {/* Top Speaker: Host */}
            <div className="relative flex-1 bg-slate-900 overflow-hidden border-b-2 border-brand-purple">
              <img
                src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80"
                alt="Host"
                className="w-full h-full object-cover filter brightness-90"
              />
              {/* Face Tracking Bounding Box */}
              <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-20 sm:h-28 border-2 border-brand-emerald/70 rounded-xl pointer-events-none flex flex-col justify-between p-1">
                <span className="text-[8px] sm:text-[9px] font-mono text-brand-emerald bg-black/60 px-1 rounded w-max">
                  Host (98%)
                </span>
              </div>
            </div>

            {/* Bottom Speaker: Guest */}
            <div className="relative flex-1 bg-slate-900 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
                alt="Guest"
                className="w-full h-full object-cover filter brightness-90"
              />
              {/* Face Tracking Bounding Box */}
              <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-20 sm:h-28 border-2 border-brand-cyan/70 rounded-xl pointer-events-none flex flex-col justify-between p-1">
                <span className="text-[8px] sm:text-[9px] font-mono text-brand-cyan bg-black/60 px-1 rounded w-max">
                  Guest (96%)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                loop
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={posterUrl}
                alt="Video Poster"
                className="w-full h-full object-cover filter brightness-90"
              />
            )}

            {/* Single Speaker Face-Tracking Bracket */}
            <div className="absolute top-8 sm:top-12 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-28 sm:h-36 border-2 border-brand-emerald/80 rounded-2xl pointer-events-none flex flex-col justify-between p-1.5 shadow-lg">
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-brand-emerald bg-black/80 px-1.5 py-0.5 rounded w-max">
                AI Auto-Track
              </span>
            </div>
          </div>
        )}

        {/* AI B-Roll Overlay if Active */}
        {activeBRoll && (
          <div className="absolute inset-0 z-15 animate-fade-in bg-black">
            <img
              src={activeBRoll.previewUrl}
              alt="B-Roll Overlay"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-12 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-amber-300 font-mono border border-amber-500/30">
              #{activeBRoll.keyword}
            </div>
          </div>
        )}

        {/* Top Editable Viral Hook Banner */}
        <div className="absolute top-2.5 sm:top-4 inset-x-2 sm:inset-x-3 z-30">
          <input
            type="text"
            value={hookTitle}
            onChange={(e) => onUpdateHookTitle(e.target.value)}
            className="w-full bg-yellow-400 text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-center font-black text-[10px] sm:text-xs uppercase tracking-tight shadow-2xl border-none outline-none focus:ring-2 focus:ring-purple-600 truncate"
            title="Click to edit on-screen hook header"
          />
        </div>

        {/* Dynamic Animated Captions */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-12 sm:bottom-16 z-30 pointer-events-none text-center">
          {activeWord ? (
            <div className={`${captionStyle} transform scale-105 transition-transform duration-100`}>
              {activeWord.text} {activeWord.emoji}
            </div>
          ) : (
            <div className={`${captionStyle} opacity-75`}>
              {words.slice(0, 3).map((w) => w.text).join(' ')}
            </div>
          )}
        </div>

        {/* Click to Play/Pause overlay */}
        <button
          onClick={onTogglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 group-hover:bg-black/5 transition"
        >
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-brand-purple/90 hover:bg-brand-purple text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition duration-200">
            {isPlaying ? <Pause className="w-4 h-4 sm:w-6 sm:h-6" /> : <Play className="w-4 h-4 sm:w-6 sm:h-6 fill-current ml-0.5" />}
          </div>
        </button>
      </div>
    </div>
  );
};
