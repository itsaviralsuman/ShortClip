import React, { useRef, useEffect } from 'react';
import {
  AspectRatio,
  SpeakerMode,
  TranscriptWord,
  BRollTrigger,
  AutoZoomConfig,
  EmojiConfig,
  AutoBRollConfig
} from '../../types';
import { getTemplateById } from '../../data/captionTemplates';
import { getOpusCaptionChunk } from '../../utils/captionChunker';
import {
  Play,
  Pause,
  Scan,
  ZoomIn,
  Type
} from 'lucide-react';

interface CanvasStageProps {
  videoUrl?: string;
  youtubeId?: string;
  posterUrl: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  aspectRatio: AspectRatio;
  captionTemplateId: string;
  speakerMode: SpeakerMode;
  autoZoom: AutoZoomConfig;
  emojiConfig: EmojiConfig;
  bRollConfig: AutoBRollConfig;
  hookTitle: string;
  onUpdateHookTitle: (title: string) => void;
  words: TranscriptWord[];
  bRollTracks: BRollTrigger[];
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  videoUrl,
  youtubeId,
  posterUrl,
  currentTime,
  duration,
  isPlaying,
  onTogglePlay,
  aspectRatio,
  captionTemplateId,
  speakerMode,
  autoZoom,
  emojiConfig,
  bRollConfig,
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

  // Determine OpusClip active chunk & active word
  const { chunkWords, activeWord } = getOpusCaptionChunk(words, currentTime, 'karaoke_phrase', 4);

  // Determine active B-roll overlay
  const activeBRoll = bRollConfig.enabled
    ? bRollTracks.find((b) => b.enabled && currentTime >= b.start && currentTime <= b.end)
    : undefined;

  // Active caption template from 35 presets
  const tpl = getTemplateById(captionTemplateId);

  // Dynamic Camera Auto-Zoom Punch calculation
  const shouldZoomPunch =
    autoZoom.enabled &&
    activeWord &&
    (!!activeWord.highlightColor || !!activeWord.emoji || activeWord.text.length > 5);

  const zoomScaleStyle = shouldZoomPunch
    ? `scale(${autoZoom.zoomScale})`
    : 'scale(1)';

  // Responsive Aspect ratio wrapper styling
  const aspectClass =
    aspectRatio === '9:16'
      ? 'w-[220px] xs:w-[260px] sm:w-[300px] md:w-[320px] aspect-[9/16]'
      : aspectRatio === '1:1'
      ? 'w-[260px] sm:w-[360px] md:w-[400px] aspect-square'
      : aspectRatio === '16:9'
      ? 'w-[90vw] sm:w-[500px] md:w-[560px] aspect-video'
      : 'w-[260px] sm:w-[320px] md:w-[360px] aspect-[4/5]';

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

        <div className="flex items-center gap-2">
          {autoZoom.enabled && shouldZoomPunch && (
            <div className="bg-brand-cyan/20 border border-brand-cyan/40 text-cyan-300 px-2 py-0.5 rounded-lg text-[10px] font-mono flex items-center gap-1 animate-pulse">
              <ZoomIn className="w-3 h-3" />
              <span>Auto-Zoom {autoZoom.zoomScale}x</span>
            </div>
          )}
          <div className="bg-studio-950/80 px-2 sm:px-3 py-1 rounded-xl border border-slate-800 font-mono text-slate-200 text-[10px] sm:text-xs">
            {aspectRatio}
          </div>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div
        className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-black shadow-2xl border-2 border-purple-500/40 select-none group my-auto transition-transform duration-300 ease-out`}
      >
        {/* Scalable Container for Auto-Zoom Punch */}
        <div
          style={{ transform: zoomScaleStyle }}
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
        >
          {/* Render Single vs Split-Screen */}
          {speakerMode === 'split-top-bottom' ? (
            <div className="w-full h-full flex flex-col">
              {/* Top Speaker: Host (Using Real Media / YouTube Stream) */}
              <div className="relative flex-1 bg-black overflow-hidden border-b-2 border-brand-purple">
                {youtubeId ? (
                  isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                      title="Host Track"
                      className="w-full h-full object-cover pointer-events-none scale-150 origin-top"
                    />
                  ) : (
                    <img
                      src={posterUrl}
                      alt="Host Track"
                      className="w-full h-full object-cover filter brightness-90"
                    />
                  )
                ) : videoUrl ? (
                  <video
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
                    alt="Host Track"
                    className="w-full h-full object-cover filter brightness-90"
                  />
                )}
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                  <span className="text-[8px] sm:text-[9px] font-mono text-brand-emerald bg-black/80 px-1.5 py-0.5 rounded border border-brand-emerald/40">
                    Host Focal Track (98%)
                  </span>
                </div>
              </div>

              {/* Bottom Speaker: Guest / Context Track */}
              <div className="relative flex-1 bg-black overflow-hidden">
                {youtubeId ? (
                  isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&start=20`}
                      title="Guest Track"
                      className="w-full h-full object-cover pointer-events-none scale-150 origin-bottom"
                    />
                  ) : (
                    <img
                      src={posterUrl}
                      alt="Guest Track"
                      className="w-full h-full object-cover filter brightness-85"
                    />
                  )
                ) : videoUrl ? (
                  <video
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
                    alt="Guest Track"
                    className="w-full h-full object-cover filter brightness-85"
                  />
                )}
                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                  <span className="text-[8px] sm:text-[9px] font-mono text-brand-cyan bg-black/80 px-1.5 py-0.5 rounded border border-brand-cyan/40">
                    Reaction Track (96%)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {youtubeId ? (
                isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                    title="YouTube Studio Stream"
                    className="w-full h-full object-cover pointer-events-none scale-125"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                ) : (
                  <img
                    src={posterUrl}
                    alt="Video Poster"
                    className="w-full h-full object-cover filter brightness-90"
                  />
                )
              ) : videoUrl ? (
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
            <div className={`absolute inset-0 z-15 bg-black ${bRollConfig.kenBurnsTransition ? 'animate-shimmer' : 'animate-fade-in'}`}>
              <img
                src={activeBRoll.previewUrl}
                alt="B-Roll Overlay"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-12 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-amber-300 font-mono border border-amber-500/30">
                AI B-Roll: #{activeBRoll.keyword}
              </div>
            </div>
          )}
        </div>

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

        {/* OpusClip Dynamic Animated Karaoke Captions Engine */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-12 sm:bottom-16 z-30 pointer-events-none text-center px-1">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2 gap-y-1 max-w-full">
            {chunkWords.map((w) => {
              const isActive = activeWord?.id === w.id;
              return (
                <span key={w.id} className="relative inline-flex flex-col items-center">
                  {/* AI Emoji Above Active Word */}
                  {emojiConfig.enabled && emojiConfig.position === 'above' && w.emoji && isActive && (
                    <span className="absolute -top-7 sm:-top-8 text-xl sm:text-2xl animate-bounce z-40">
                      {w.emoji}
                    </span>
                  )}

                  <span
                    style={{
                      fontFamily: tpl.fontFamily,
                      color: isActive ? tpl.activeWordColor : tpl.textColor,
                      textShadow: tpl.textShadow,
                      backgroundColor: isActive && tpl.backgroundColor ? tpl.backgroundColor : 'transparent'
                    }}
                    className={`font-black ${tpl.textTransform} transition-all duration-100 ${
                      isActive
                        ? 'scale-115 text-lg sm:text-2xl px-1.5 py-0.5 rounded-md drop-shadow-2xl z-20'
                        : 'scale-100 text-base sm:text-xl opacity-90'
                    }`}
                  >
                    {w.text}
                    {emojiConfig.enabled && emojiConfig.position === 'inline' && w.emoji && isActive && (
                      <span className="ml-1 text-sm sm:text-base">{w.emoji}</span>
                    )}
                  </span>
                </span>
              );
            })}
          </div>
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
