import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Scissors,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  BarChart3,
  Zap,
  ZoomIn,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ViralClip } from '../../types';
import { getTemplateById } from '../../data/captionTemplates';
import { getOpusCaptionChunk } from '../../utils/captionChunker';
import { formatTime } from '../../utils/youtubeHelper';
import { useVideoProjects } from '../../context/VideoProjectContext';

interface ClipCardProps {
  clip: ViralClip;
  onOpenStudio: (clip: ViralClip) => void;
  isSelected?: boolean;
  onToggleSelect?: (clipId: string) => void;
}

export const ClipCard: React.FC<ClipCardProps> = ({ clip, onOpenStudio, isSelected = false, onToggleSelect }) => {
  const { deleteClip } = useVideoProjects();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showRadar, setShowRadar] = useState<boolean>(false);
  const [selectedSocialTab, setSelectedSocialTab] = useState<'tiktok' | 'reels' | 'shorts' | 'linkedin'>('tiktok');
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dynamic template details from the 35 OpusClip styles
  const tpl = getTemplateById(clip.captionTemplateId);

  // Time tracking for dynamic caption synchronization & cut looping
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (videoRef.current) {
          if (videoRef.current.currentTime >= clip.duration || videoRef.current.ended) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
            setCurrentTime(0);
          } else {
            setCurrentTime(videoRef.current.currentTime);
          }
        } else {
          setCurrentTime((t) => {
            if (t >= clip.duration) {
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'seekTo', args: [Math.floor(clip.startTime), true] }),
                  '*'
                );
                iframeRef.current.contentWindow.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                  '*'
                );
              }
              return 0;
            }
            return Number((t + 0.1).toFixed(1));
          });
        }
      }, 100);
    } else {
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
    return () => clearInterval(interval);
  }, [isPlaying, clip.duration, clip.startTime]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (videoRef.current.currentTime >= clip.duration || videoRef.current.ended) {
          videoRef.current.currentTime = 0;
        }
        videoRef.current.muted = isMuted;
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    if (iframeRef.current?.contentWindow) {
      const cmd = nextMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: cmd, args: [] }),
        '*'
      );
      if (!nextMuted) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        );
      }
    }
  };

  const handleExportHD = async () => {
    setIsExporting(true);
    try {
      const downloadTarget = clip.downloadUrl || `http://localhost:3001/api/clips/${clip.id}/download`;
      const link = document.createElement('a');
      link.href = downloadTarget;
      link.setAttribute('download', `${clip.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setIsExporting(false), 1200);
    }
  };

  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  // Find active words and Opus karaoke chunk based on currentTime
  const { chunkWords, activeWord } = getOpusCaptionChunk(clip.words, currentTime, 'karaoke_phrase', 4);

  const shouldZoomPunch =
    clip.autoZoom?.enabled &&
    activeWord &&
    (!!activeWord.highlightColor || !!activeWord.emoji || activeWord.text.length > 5);

  const viralityColor =
    clip.virality.overallScore >= 90
      ? 'from-purple-500 to-pink-500 text-purple-300 border-purple-500/40'
      : clip.virality.overallScore >= 80
      ? 'from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/40'
      : 'from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/40';

  const socialCaptionText =
    selectedSocialTab === 'tiktok'
      ? clip.socialCaptions.tiktok
      : selectedSocialTab === 'reels'
      ? clip.socialCaptions.instagramReels
      : selectedSocialTab === 'shorts'
      ? clip.socialCaptions.youtubeShorts
      : clip.socialCaptions.linkedin;

  return (
    <div className="glass-panel-elevated rounded-2xl border border-slate-800 hover:border-purple-500/30 transition-all duration-300 overflow-hidden flex flex-col lg:flex-row">
      {/* LEFT: 9:16 Vertical Video Preview Stage with Auto-Zoom */}
      <div className="relative w-full lg:w-72 aspect-[9/16] max-h-[440px] sm:max-h-[500px] lg:max-h-none bg-black shrink-0 overflow-hidden group flex items-center justify-center">
        <div
          style={{ transform: shouldZoomPunch ? `scale(${clip.autoZoom.zoomScale})` : 'scale(1)' }}
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
        >
          {clip.videoUrl ? (
            <video
              ref={videoRef}
              src={clip.videoUrl}
              poster={clip.previewThumbnail}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play().catch(() => {});
                }
              }}
            />
          ) : clip.youtubeId ? (
            isPlaying ? (
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${clip.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&start=${Math.floor(clip.startTime)}&end=${Math.floor(clip.endTime)}&enablejsapi=1&controls=0&loop=1&playlist=${clip.youtubeId}&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                title={clip.title}
                className="w-full h-full object-cover pointer-events-none scale-125"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => {
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      JSON.stringify({ event: 'command', func: isMuted ? 'mute' : 'unMute', args: [] }),
                      '*'
                    );
                    if (!isMuted) {
                      iframeRef.current.contentWindow.postMessage(
                        JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
                        '*'
                      );
                    }
                  }
                }}
              />
            ) : (
              <img
                src={clip.previewThumbnail}
                alt={clip.title}
                className="w-full h-full object-cover filter brightness-85"
              />
            )
          ) : (
            <img
              src={clip.previewThumbnail}
              alt={clip.title}
              className="w-full h-full object-cover filter brightness-75"
            />
          )}
        </div>

        {/* Top On-Screen Viral Hook Banner */}
        <div className="absolute top-3 sm:top-4 inset-x-3 z-20 pointer-events-none">
          <div className="bg-yellow-400 text-black px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-center font-black text-[10px] sm:text-xs uppercase tracking-tight shadow-xl truncate">
            {clip.hookTitle}
          </div>
        </div>

        {/* Dynamic Animated Opus Karaoke Captions — Large, Center-Bottom like OpusClip */}
        <div data-testid="caption-container" className="absolute inset-x-0 bottom-14 sm:bottom-16 z-20 pointer-events-none px-3">
          {/* Semi-transparent backing for readability like OpusClip */}
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 max-w-full">
            {(isPlaying ? chunkWords : clip.words.slice(0, 4)).map((w) => {
              const isActive = isPlaying && activeWord?.id === w.id;
              return (
                <span key={w.id} className="relative inline-flex flex-col items-center">
                  {/* AI Emoji Above Active Word */}
                  {clip.emojiConfig?.enabled && clip.emojiConfig.position === 'above' && w.emoji && isActive && (
                    <span className="absolute -top-7 text-xl sm:text-2xl animate-bounce z-30">
                      {w.emoji}
                    </span>
                  )}

                  <span
                    style={{
                      fontFamily: tpl.fontFamily || 'Montserrat, sans-serif',
                      color: isActive ? (tpl.activeWordColor || '#FACC15') : (tpl.textColor || '#FFFFFF'),
                      textShadow: tpl.textShadow || '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 4px 12px rgba(0,0,0,0.95)',
                      backgroundColor: isActive && tpl.backgroundColor ? tpl.backgroundColor : 'transparent',
                      lineHeight: 1.1
                    }}
                    className={`font-black uppercase transition-all duration-100 drop-shadow-2xl ${
                      isActive
                        ? 'scale-115 text-lg sm:text-xl lg:text-2xl px-1.5 py-0.5 rounded-md z-10'
                        : 'scale-100 text-base sm:text-lg lg:text-xl opacity-95'
                    }`}
                  >
                    {w.text}
                    {clip.emojiConfig?.enabled && clip.emojiConfig.position === 'inline' && w.emoji && isActive && (
                      <span className="ml-1 text-sm">{w.emoji}</span>
                    )}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Speaker Mode & Zoom Indicator */}
        <div className="absolute top-11 sm:top-14 left-3 z-20 flex items-center gap-1.5">
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] sm:text-[10px] text-purple-300 font-mono border border-purple-500/20">
            {clip.speakerMode === 'split-top-bottom' ? 'Split-Screen' : 'Auto-Track'}
          </span>
          {clip.autoZoom?.enabled && (
            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] sm:text-[10px] text-cyan-300 font-mono border border-cyan-500/20 flex items-center gap-1">
              <ZoomIn className="w-2.5 h-2.5" />
              <span>Zoom</span>
            </span>
          )}
        </div>

        {/* Play/Pause Button Overlay */}
        <button
          onClick={togglePlay}
          data-testid="clipcard-play-btn"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-purple/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition duration-200">
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />}
          </div>
        </button>

        {/* Audio Mute Toggle & Time Scrubber */}
        <div className="absolute bottom-2 inset-x-3 z-20 flex items-center justify-between text-white text-[9px] sm:text-[10px] font-mono bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-700/60 shadow-lg">
          <button
            onClick={toggleMute}
            className="hover:text-purple-300 flex items-center gap-1.5 transition active:scale-95"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            data-testid="audio-toggle-btn"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-brand-emerald animate-pulse" />
            )}
            <span className={`text-[9px] font-bold ${isMuted ? 'text-slate-400' : 'text-brand-emerald'}`}>
              {isMuted ? 'Muted' : 'Sound ON'}
            </span>
          </button>
          <span>
            {currentTime.toFixed(1)}s / {clip.duration.toFixed(1)}s
          </span>
          <span className="text-purple-300 font-bold truncate max-w-[90px]">{tpl.name.split(' ')[0]}</span>
        </div>
      </div>

      {/* RIGHT: Opus Viral Intelligence & Metadata Studio */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div>
          {/* Top Row: AI Virality Score Badge & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {onToggleSelect && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(clip.id)}
                  data-testid={`select-clip-${clip.id}`}
                  className="w-4 h-4 rounded accent-brand-purple cursor-pointer mr-1"
                  title="Select for batch action"
                />
              )}
              <div
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r ${viralityColor} border font-bold text-xs shadow-md`}
              >
                <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
                <span className="font-mono text-white text-xs sm:text-sm">{clip.virality.overallScore}</span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/90">
                  / 100 • {clip.virality.tier}
                </span>
              </div>

              <button
                onClick={() => setShowRadar(!showRadar)}
                className="flex items-center gap-1 text-[10px] sm:text-[11px] text-purple-300 hover:text-white px-2 py-1 rounded-lg bg-studio-900 border border-slate-700 transition"
              >
                <BarChart3 className="w-3 h-3 text-brand-purple" />
                <span>Radar</span>
                {showRadar ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-studio-900 text-slate-300 border border-slate-700 hidden sm:inline">
                Style: {tpl.name.split(' ')[0]}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="text-slate-400 font-mono" data-testid="cut-time-range">
                {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-brand-emerald font-semibold font-mono" data-testid="clip-duration-badge">
                {clip.duration.toFixed(1)}s
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-extrabold text-sm sm:text-base text-white hover:text-purple-300 transition">
            {clip.title}
          </h3>

          {/* AI Rationale Snippet */}
          <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 leading-relaxed bg-studio-900/60 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-purple-300 flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Opus AI Virality Rationale:
            </strong>
            {clip.virality.rationale}
          </p>

          {/* Expandable Virality Radar Breakdown */}
          {showRadar && (
            <div className="mt-3 p-3 rounded-xl bg-studio-900 border border-purple-500/30 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 animate-fade-in">
              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Hook Strength</span>
                  <span className="font-mono font-bold text-amber-400">{clip.virality.hookStrength}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${clip.virality.hookStrength}%` }} className="h-full bg-amber-400 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Pacing Cadence</span>
                  <span className="font-mono font-bold text-brand-cyan">{clip.virality.pacingScore}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${clip.virality.pacingScore}%` }} className="h-full bg-brand-cyan rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Emotional Peak</span>
                  <span className="font-mono font-bold text-brand-purple">{clip.virality.emotionalPeak}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${clip.virality.emotionalPeak}%` }} className="h-full bg-brand-purple rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[9px] sm:text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Retention Curve</span>
                  <span className="font-mono font-bold text-brand-emerald">{clip.virality.retentionProbability}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div style={{ width: `${clip.virality.retentionProbability}%` }} className="h-full bg-brand-emerald rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Social Media Copy Box */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {(['tiktok', 'reels', 'shorts', 'linkedin'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedSocialTab(tab)}
                    className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold uppercase transition ${
                      selectedSocialTab === tab
                        ? 'bg-brand-purple text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleCopyCaption(socialCaptionText)}
                className="flex items-center gap-1 text-[10px] sm:text-[11px] text-purple-300 hover:text-white transition"
              >
                {copiedCaption ? <Check className="w-3 h-3 text-brand-emerald" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-2 rounded-lg bg-studio-950 border border-slate-800 text-[10px] sm:text-[11px] text-slate-300 font-mono line-clamp-2">
              {socialCaptionText}
            </div>
          </div>
        </div>

        {/* Bottom Studio Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <div className="flex items-center flex-wrap gap-1">
            {clip.virality.keyTopics.map((topic, i) => (
              <span
                key={i}
                className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-studio-900 text-slate-400 border border-slate-800 font-medium"
              >
                #{topic}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto mt-1 sm:mt-0">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-xl animate-fade-in">
                <span className="text-[10px] text-red-200 px-1 font-bold">Delete?</span>
                <button
                  onClick={() => {
                    deleteClip(clip.id);
                    setIsConfirmingDelete(false);
                  }}
                  data-testid="confirm-delete-clip-btn"
                  className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition active:scale-95"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingDelete(true)}
                data-testid="clipcard-delete-btn"
                title="Delete this clip"
                className="p-2 sm:p-2.5 rounded-xl bg-studio-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onOpenStudio(clip)}
              data-testid="clipcard-studio-btn"
              className="flex-1 sm:flex-initial px-3 py-1.5 sm:py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-100 border border-slate-700 text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Scissors className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Studio</span>
            </button>

            <button
              onClick={handleExportHD}
              disabled={isExporting}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              {isExporting ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export HD</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
