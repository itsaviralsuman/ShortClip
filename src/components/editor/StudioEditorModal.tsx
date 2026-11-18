import React, { useState, useEffect } from 'react';
import { useVideoProjects } from '../../context/VideoProjectContext';
import { TranscriptPanel } from './TranscriptPanel';
import { CanvasStage } from './CanvasStage';
import { BrandKitPanel } from './BrandKitPanel';
import { MultiTrackTimeline } from './MultiTrackTimeline';
import {
  X,
  Download,
  Flame,
  Zap,
  Scissors,
  Smartphone,
  Palette
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
    updateClipCaptionTemplate,
    updateClipLanguage,
    updateClipAspectRatio,
    updateClipSpeakerMode,
    updateClipHookTitle,
    updateClipAutoZoom,
    updateClipEmojiConfig,
    updateClipBRollConfig
  } = useVideoProjects();

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Mobile viewport tab mode
  const [mobileTab, setMobileTab] = useState<'canvas' | 'transcript' | 'brand'>('canvas');

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
    try {
      const downloadTarget = clip.downloadUrl || `http://localhost:3001/api/clips/${clip.id}/download`;
      const link = document.createElement('a');
      link.href = downloadTarget;
      link.setAttribute('download', `${clip.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_master.mp4`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setIsExporting(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-studio-950 text-white animate-fade-in overflow-hidden select-none">
      {/* 1. TOP STUDIO HEADER */}
      <header className="h-14 px-3 sm:px-6 border-b border-slate-800 bg-studio-900/90 backdrop-blur-md flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition shrink-0"
            title="Return to Viral Clips Grid"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[140px] sm:max-w-md">
                {clip.title}
              </span>
              <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 font-mono font-bold border border-purple-500/30 flex items-center gap-1 shrink-0">
                <Flame className="w-3 h-3 text-yellow-300" />
                <span>{clip.virality.overallScore}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Vizard Precision Timeline & Doc-Style Editor
            </p>
          </div>
        </div>

        {/* Right Header CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => alert('Changes autosaved to cloud!')}
            className="hidden sm:block px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-studio-800 hover:bg-studio-700 border border-slate-700 transition"
          >
            Save
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-brand-purple via-indigo-600 to-brand-emerald hover:opacity-95 text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-purple-500/30 flex items-center gap-1.5 transition active:scale-95"
          >
            {isExporting ? (
              <>
                <Zap className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Export</span>
                <span>1080p</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE SEGMENTED CONTROL BAR */}
      <div className="lg:hidden bg-studio-900 border-b border-slate-800 px-3 py-1.5 flex items-center justify-around text-xs shrink-0">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
            mobileTab === 'canvas' ? 'bg-brand-purple text-white shadow' : 'text-slate-400'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Canvas</span>
        </button>

        <button
          onClick={() => setMobileTab('transcript')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
            mobileTab === 'transcript' ? 'bg-brand-purple text-white shadow' : 'text-slate-400'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Transcript</span>
        </button>

        <button
          onClick={() => setMobileTab('brand')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
            mobileTab === 'brand' ? 'bg-brand-purple text-white shadow' : 'text-slate-400'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Brand & Styles</span>
        </button>
      </div>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Doc-Style Transcript Panel */}
        <div className={`w-full lg:w-80 shrink-0 h-full ${mobileTab === 'transcript' ? 'block' : 'hidden lg:block'}`}>
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
        <div className={`flex-1 h-full flex flex-col ${mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'}`}>
          <CanvasStage
            videoUrl={clip.videoUrl}
            youtubeId={clip.youtubeId}
            posterUrl={clip.previewThumbnail}
            currentTime={currentTime}
            duration={clip.duration}
            startTime={clip.startTime}
            endTime={clip.endTime}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onTogglePlay={handleTogglePlay}
            onToggleMute={() => setIsMuted(!isMuted)}
            aspectRatio={clip.aspectRatio}
            captionTemplateId={clip.captionTemplateId}
            speakerMode={clip.speakerMode}
            autoZoom={clip.autoZoom}
            emojiConfig={clip.emojiConfig}
            bRollConfig={clip.bRollConfig}
            hookTitle={clip.hookTitle}
            onUpdateHookTitle={(title) => updateClipHookTitle(clip.id, title)}
            words={clip.words}
            bRollTracks={clip.bRollTracks}
          />
        </div>

        {/* Right: Brand Kit & 35 Styles Panel */}
        <div className={`w-full lg:w-88 shrink-0 h-full ${mobileTab === 'brand' ? 'block' : 'hidden lg:block'}`}>
          <BrandKitPanel
            aspectRatio={clip.aspectRatio}
            onUpdateAspectRatio={(ratio) => updateClipAspectRatio(clip.id, ratio)}
            speakerMode={clip.speakerMode}
            onUpdateSpeakerMode={(mode) => updateClipSpeakerMode(clip.id, mode)}
            captionTemplateId={clip.captionTemplateId}
            onUpdateCaptionTemplate={(templateId) => updateClipCaptionTemplate(clip.id, templateId)}
            language={clip.language}
            onUpdateLanguage={(lang) => updateClipLanguage(clip.id, lang)}
            autoZoom={clip.autoZoom}
            onUpdateAutoZoom={(zoom) => updateClipAutoZoom(clip.id, zoom)}
            emojiConfig={clip.emojiConfig}
            onUpdateEmojiConfig={(emojis) => updateClipEmojiConfig(clip.id, emojis)}
            bRollConfig={clip.bRollConfig}
            onUpdateBRollConfig={(broll) => updateClipBRollConfig(clip.id, broll)}
          />
        </div>
      </div>

      {/* 3. BOTTOM MULTI-TRACK TIMELINE */}
      <MultiTrackTimeline
        currentTime={currentTime}
        duration={clip.duration}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={handleTogglePlay}
        onToggleMute={() => setIsMuted(!isMuted)}
        onSeek={handleSeek}
        words={clip.words}
        bRollTracks={clip.bRollTracks}
      />
    </div>
  );
};
