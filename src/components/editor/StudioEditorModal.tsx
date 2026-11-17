import React, { useState, useEffect } from 'react';
import { useVideoProjects } from '../../context/VideoProjectContext';
import { TranscriptPanel } from './TranscriptPanel';
import { CanvasStage } from './CanvasStage';
import { BrandKitPanel } from './BrandKitPanel';
import { MultiTrackTimeline } from './MultiTrackTimeline';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Flame,
  Zap,
  CheckCircle,
  Scissors
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ViralClip } from '../../types';

interface StudioEditorModalProps {
  clip: ViralClip;
  onClose: () => void;
}

export const StudioEditorModal: React.FC<StudioEditorModalProps> = ({
  clip,
  onClose
}) => {
  const {
    toggleWordDeleted,
    removeFillerWordsFromClip,
    removeSilencesFromClip,
    updateClipCaptionPreset,
    updateClipAspectRatio,
    updateClipSpeakerMode,
    updateClipHookTitle
  } = useVideoProjects();

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Playback timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= clip.duration) {
            setIsPlaying(false);
            return 0;
          }
          return t + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, clip.duration]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.min(clip.duration, Math.max(0, time)));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      alert(`Master Export Rendered! 1080x1920 (9:16) ProRes / H.264 file with synced ${clip.captionPreset.toUpperCase()} captions ready for TikTok & Shorts.`);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-studio-950 text-white animate-fade-in overflow-hidden select-none">
      {/* 1. TOP STUDIO HEADER */}
      <header className="h-14 px-6 border-b border-slate-800 bg-studio-900/90 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition"
            title="Return to Viral Clips Grid"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white line-clamp-1 max-w-md">
                {clip.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 font-mono font-bold border border-purple-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-yellow-300" />
                Score: {clip.virality.overallScore}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Vizard Precision Timeline & Doc-Style Editor
            </p>
          </div>
        </div>

        {/* Right Header CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Changes autosaved to cloud!')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-studio-800 hover:bg-studio-700 border border-slate-700 transition"
          >
            Save Draft
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-emerald hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition active:scale-95"
          >
            {isExporting ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting 1080p...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export HD (1080x1920)</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Doc-Style Transcript Panel */}
        <div className="w-80 shrink-0 h-full">
          <TranscriptPanel
            words={clip.words}
            currentTime={currentTime}
            onSeek={handleSeek}
            onToggleWordDeleted={(wordId) => toggleWordDeleted(clip.id, wordId)}
            onRemoveFillers={() => removeFillerWordsFromClip(clip.id)}
            onRemoveSilences={() => removeSilencesFromClip(clip.id)}
          />
        </div>

        {/* Center: Canvas Video Stage */}
        <CanvasStage
          videoUrl={clip.videoUrl}
          posterUrl={clip.previewThumbnail}
          currentTime={currentTime}
          duration={clip.duration}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          aspectRatio={clip.aspectRatio}
          captionPreset={clip.captionPreset}
          speakerMode={clip.speakerMode}
          hookTitle={clip.hookTitle}
          onUpdateHookTitle={(title) => updateClipHookTitle(clip.id, title)}
          words={clip.words}
          bRollTracks={clip.bRollTracks}
        />

        {/* Right: Brand Kit & Styling Panel */}
        <BrandKitPanel
          aspectRatio={clip.aspectRatio}
          onUpdateAspectRatio={(ratio) => updateClipAspectRatio(clip.id, ratio)}
          speakerMode={clip.speakerMode}
          onUpdateSpeakerMode={(mode) => updateClipSpeakerMode(clip.id, mode)}
          captionPreset={clip.captionPreset}
          onUpdateCaptionPreset={(preset) => updateClipCaptionPreset(clip.id, preset)}
        />
      </div>

      {/* 3. BOTTOM MULTI-TRACK TIMELINE */}
      <MultiTrackTimeline
        currentTime={currentTime}
        duration={clip.duration}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        words={clip.words}
        bRollTracks={clip.bRollTracks}
      />
    </div>
  );
};
