import React, { useState } from 'react';
import { Sparkles, Sliders, X, Check, Wand2 } from 'lucide-react';
import { AIProcessingConfig, AspectRatio, CaptionPreset } from '../../types';

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
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [captionPreset, setCaptionPreset] = useState<CaptionPreset>('hormozi');
  const [clipAnythingPrompt, setClipAnythingPrompt] = useState<string>('');
  const [autoEmojis, setAutoEmojis] = useState<boolean>(true);
  const [removeFillers, setRemoveFillers] = useState<boolean>(true);
  const [highlightKeywords, setHighlightKeywords] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      targetClipDuration,
      aspectRatio,
      captionPreset,
      clipAnythingPrompt,
      autoEmojis,
      removeFillers,
      highlightKeywords
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-elevated border border-purple-500/40 p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-purple/20 text-brand-purple border border-purple-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Processing Configuration</h3>
              <p className="text-xs text-slate-400">
                Customizing pipeline for: <strong className="text-purple-300">{videoTitle}</strong> ({videoDurationMinutes}m)
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

        <form onSubmit={handleSubmit} className="space-y-6 mt-5">
          {/* 1. Target Clip Length */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
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
                  className={`p-3 rounded-xl border text-left transition ${
                    targetClipDuration === item.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white shadow-lg shadow-purple-500/20'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:bg-studio-800'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-200">{item.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Aspect Ratio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Auto-Reframe Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '9:16', label: '9:16 Vertical', icon: '📱' },
                { id: '1:1', label: '1:1 Square', icon: '⏹️' },
                { id: '16:9', label: '16:9 Landscape', icon: '🖥️' },
                { id: '4:5', label: '4:5 Portrait', icon: '🖼️' },
              ].map((ratio) => (
                <button
                  type="button"
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id as AspectRatio)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    aspectRatio === ratio.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:bg-studio-800'
                  }`}
                >
                  <span className="text-base block">{ratio.icon}</span>
                  <span className="text-xs font-semibold block mt-1">{ratio.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Caption Style Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Viral Dynamic Caption Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'hormozi', name: 'Alex Hormozi', badge: 'HIGH POP', bg: 'bg-yellow-400 text-black' },
                { id: 'mrbeast', name: 'MrBeast', badge: 'BOUNCY', bg: 'bg-cyan-400 text-black' },
                { id: 'iman', name: 'Iman Gadzhi', badge: 'ELEGANT', bg: 'bg-amber-100 text-black' },
                { id: 'minimalist', name: 'Minimalist', badge: 'CLEAN', bg: 'bg-slate-700 text-white' },
              ].map((tpl) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => setCaptionPreset(tpl.id as CaptionPreset)}
                  className={`p-3 rounded-xl border text-left transition relative ${
                    captionPreset === tpl.id
                      ? 'bg-brand-purple/20 border-brand-purple shadow-lg shadow-purple-500/20'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:bg-studio-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {tpl.badge}
                    </span>
                    {captionPreset === tpl.id && (
                      <Check className="w-3.5 h-3.5 text-brand-purple" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-slate-200 mt-2">{tpl.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. ClipAnything™ Multimodal Query Filter */}
          <div className="p-4 rounded-xl bg-studio-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <Wand2 className="w-4 h-4 text-brand-purple" />
              <span>ClipAnything™ Multimodal Prompt Filter (Optional)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct the AI to find exact topics, emotions, or hooks.
            </p>
            <input
              type="text"
              placeholder="e.g. Find all moments where they talk about money, failure, or the funniest joke..."
              value={clipAnythingPrompt}
              onChange={(e) => setClipAnythingPrompt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-studio-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
            />
          </div>

          {/* 5. Additional AI Polish Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-300">Auto-Inject Emojis in Captions (🚀, 💰, 🔥)</span>
              <input
                type="checkbox"
                checked={autoEmojis}
                onChange={(e) => setAutoEmojis(e.target.checked)}
                className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-300">1-Click Auto-Remove Filler Words (um, uh, like)</span>
              <input
                type="checkbox"
                checked={removeFillers}
                onChange={(e) => setRemoveFillers(e.target.checked)}
                className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-300">AI Kinetic Keyword Highlighting</span>
              <input
                type="checkbox"
                checked={highlightKeywords}
                onChange={(e) => setHighlightKeywords(e.target.checked)}
                className="w-4 h-4 accent-brand-purple rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
