import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  X,
  Check,
  Wand2,
  ZoomIn,
  Smile,
  Film,
  Type,
  Globe
} from 'lucide-react';
import { AIProcessingConfig, AspectRatio, AutoZoomConfig, EmojiConfig, AutoBRollConfig, VideoLanguage } from '../../types';
import { OPUS_CAPTION_TEMPLATES } from '../../data/captionTemplates';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: AIProcessingConfig) => void;
  videoTitle: string;
  videoDurationMinutes: number;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  videoTitle,
  videoDurationMinutes
}) => {
  const [targetClipDuration, setTargetClipDuration] = useState<AIProcessingConfig['targetClipDuration']>('30-60s');
  const [language, setLanguage] = useState<VideoLanguage>('hinglish');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [captionTemplateId, setCaptionTemplateId] = useState<string>('hormozi-yellow');
  const [clipAnythingPrompt, setClipAnythingPrompt] = useState<string>('');
  const [templateCategory, setTemplateCategory] = useState<string>('All');

  // New Superpowers
  const [autoZoom, setAutoZoom] = useState<AutoZoomConfig>({
    enabled: true,
    energy: 'dynamic',
    zoomScale: 1.15,
    speed: 'smooth'
  });

  const [emojiConfig, setEmojiConfig] = useState<EmojiConfig>({
    enabled: true,
    density: 'medium',
    animation: 'bounce',
    position: 'above',
    pack: 'viral_fire'
  });

  const [autoBRoll, setAutoBRoll] = useState<AutoBRollConfig>({
    enabled: true,
    frequency: 'balanced',
    source: 'ai_stock',
    kenBurnsTransition: true
  });

  const [removeFillers, setRemoveFillers] = useState<boolean>(true);
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);

  if (!isOpen) return null;

  const filteredTemplates = OPUS_CAPTION_TEMPLATES.filter(tpl =>
    templateCategory === 'All' ? true : tpl.category.toLowerCase().includes(templateCategory.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      targetClipDuration,
      language,
      aspectRatio,
      captionTemplateId,
      clipAnythingPrompt,
      autoEmojis: emojiConfig.enabled,
      emojiConfig,
      autoZoom,
      autoBRoll,
      removeFillers,
      highlightKeywords
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-elevated border border-purple-500/40 p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-purple/20 text-brand-purple border border-purple-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">AI Processing Configuration</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Pipeline for: <strong className="text-purple-300 truncate max-w-xs">{videoTitle}</strong> ({videoDurationMinutes}m)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* 1. Target Clip Length */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Clip Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '<30s', label: '< 30s', desc: 'YouTube Shorts' },
                { id: '30-60s', label: '30 - 60s', desc: 'TikTok / IG Reels' },
                { id: '60-90s', label: '60 - 90s', desc: 'Deep Engagement' },
                { id: '3m', label: 'Up to 3m', desc: 'Extended Stories' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTargetClipDuration(item.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    targetClipDuration === item.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white shadow-lg shadow-purple-500/20'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:bg-studio-800'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-200">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Core 3 Languages (Hindi, English, Hinglish) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Primary Video Language (3 Languages)</span>
              </label>
              <span className="text-[10px] font-mono text-purple-300">
                Whisper AI Multilingual Engine
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hinglish', label: 'Hinglish (Viral)', desc: 'Roman Hindi + English', flag: '🇮🇳' },
                { id: 'hindi', label: 'Hindi (हिंदी)', desc: 'Devanagari Subtitles', flag: '🇮🇳' },
                { id: 'english', label: 'English', desc: 'Global English', flag: '🇬🇧' },
              ].map((lang) => (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setLanguage(lang.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    language === lang.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white shadow-lg shadow-purple-500/20'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:bg-studio-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{lang.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Choose from 35 OpusClip Caption Templates */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-brand-purple" />
                <span>Choose Caption Template (35 OpusClip Styles)</span>
              </label>
              <div className="flex items-center gap-1 text-[10px]">
                {['All', 'Creator', 'Kinetic', 'Minimalist', 'Broadcast'].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-2 py-0.5 rounded ${
                      templateCategory === cat
                        ? 'bg-purple-500/20 text-purple-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 scroll-fade-y border border-slate-800 rounded-xl bg-studio-950/60">
              {filteredTemplates.map((tpl) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => setCaptionTemplateId(tpl.id)}
                  className={`p-2 rounded-lg border text-left transition relative ${
                    captionTemplateId === tpl.id
                      ? 'bg-brand-purple/20 border-brand-purple ring-1 ring-purple-400'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:bg-studio-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-purple-300">{tpl.badge}</span>
                    {captionTemplateId === tpl.id && <Check className="w-3 h-3 text-brand-purple" />}
                  </div>
                  <div className="font-bold text-[11px] text-white truncate mt-1">{tpl.name}</div>
                  <div
                    style={{ color: tpl.activeWordColor, fontFamily: tpl.fontFamily }}
                    className="text-[10px] font-black truncate mt-0.5"
                  >
                    {tpl.sampleText}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Auto-Zoom, AI Emojis & Auto B-Roll Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Auto Zoom Card */}
            <div className="p-3 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                  Auto-Zoom
                </span>
                <input
                  type="checkbox"
                  checked={autoZoom.enabled}
                  onChange={(e) => setAutoZoom({ ...autoZoom, enabled: e.target.checked })}
                  className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400">Punches camera in 1.15x on energetic words</p>
            </div>

            {/* AI Emojis Card */}
            <div className="p-3 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  AI Emojis
                </span>
                <input
                  type="checkbox"
                  checked={emojiConfig.enabled}
                  onChange={(e) => setEmojiConfig({ ...emojiConfig, enabled: e.target.checked })}
                  className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400">Injects animated emojis above punchlines</p>
            </div>

            {/* Auto B-Roll Card */}
            <div className="p-3 rounded-xl bg-studio-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
                  Auto B-Roll
                </span>
                <input
                  type="checkbox"
                  checked={autoBRoll.enabled}
                  onChange={(e) => setAutoBRoll({ ...autoBRoll, enabled: e.target.checked })}
                  className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
                />
              </div>
              <p className="text-[10px] text-slate-400">Overlays stock footage on spoken topics</p>
            </div>
          </div>

          {/* 4. ClipAnything™ Multimodal Query Filter */}
          <div className="p-3.5 rounded-xl bg-studio-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <Wand2 className="w-4 h-4 text-brand-purple" />
              <span>ClipAnything™ Multimodal Search Prompt (Optional)</span>
            </div>
            <input
              type="text"
              placeholder="e.g. Find all moments where they talk about money, failure, or the funniest joke..."
              value={clipAnythingPrompt}
              onChange={(e) => setClipAnythingPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-studio-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
            />
          </div>

          {/* Confirm Button */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start AI Repurposing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
