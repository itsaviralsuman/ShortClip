import React, { useState } from 'react';
import {
  AspectRatio,
  CaptionPreset,
  SpeakerMode
} from '../../types';
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  AtSign,
  Smile,
  Check,
  SplitSquareVertical,
  Maximize2
} from 'lucide-react';

interface BrandKitPanelProps {
  aspectRatio: AspectRatio;
  onUpdateAspectRatio: (ratio: AspectRatio) => void;
  speakerMode: SpeakerMode;
  onUpdateSpeakerMode: (mode: SpeakerMode) => void;
  captionPreset: CaptionPreset;
  onUpdateCaptionPreset: (preset: CaptionPreset) => void;
}

export const BrandKitPanel: React.FC<BrandKitPanelProps> = ({
  aspectRatio,
  onUpdateAspectRatio,
  speakerMode,
  onUpdateSpeakerMode,
  captionPreset,
  onUpdateCaptionPreset
}) => {
  const [handleText, setHandleText] = useState<string>('@scale_with_ai');
  const [includeBumper, setIncludeBumper] = useState<boolean>(true);
  const [autoEmojis, setAutoEmojis] = useState<boolean>(true);

  return (
    <div className="w-80 h-full bg-studio-950 border-l border-slate-800 p-4 space-y-6 overflow-y-auto text-xs shrink-0">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
          <Palette className="w-4 h-4 text-brand-purple" />
          <span>Brand Kit & Styling Studio</span>
        </h3>
        <p className="text-[10px] text-slate-400">Configure visual themes, framing & typography</p>
      </div>

      {/* 1. Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Aspect Ratio Reframe
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: '9:16', label: '9:16 TikTok/Reels' },
            { id: '1:1', label: '1:1 Square' },
            { id: '16:9', label: '16:9 Landscape' },
            { id: '4:5', label: '4:5 Feed' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onUpdateAspectRatio(item.id as AspectRatio)}
              className={`p-2 rounded-xl border text-left transition ${
                aspectRatio === item.id
                  ? 'bg-brand-purple/20 border-brand-purple text-white shadow-md'
                  : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-bold text-xs">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Speaker Tracking & Multi-Cam Layout */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block flex items-center justify-between">
          <span>AI Speaker Cam Layout</span>
          <span className="text-[10px] text-brand-emerald font-mono">Auto-Track Active</span>
        </label>
        <div className="space-y-2">
          <button
            onClick={() => onUpdateSpeakerMode('single')}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
              speakerMode === 'single'
                ? 'bg-brand-purple/20 border-brand-purple text-white'
                : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-brand-purple" />
              <div className="text-left">
                <div className="font-bold">Single Speaker Auto-Center</div>
                <div className="text-[10px] text-slate-400">Centers active speaker dynamically</div>
              </div>
            </div>
            {speakerMode === 'single' && <Check className="w-4 h-4 text-brand-purple" />}
          </button>

          <button
            onClick={() => onUpdateSpeakerMode('split-top-bottom')}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
              speakerMode === 'split-top-bottom'
                ? 'bg-brand-purple/20 border-brand-purple text-white'
                : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <SplitSquareVertical className="w-4 h-4 text-brand-emerald" />
              <div className="text-left">
                <div className="font-bold">Split-Screen (Top / Bottom)</div>
                <div className="text-[10px] text-slate-400">Host on top, guest on bottom</div>
              </div>
            </div>
            {speakerMode === 'split-top-bottom' && <Check className="w-4 h-4 text-brand-purple" />}
          </button>
        </div>
      </div>

      {/* 3. Viral Caption Presets */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Dynamic Caption Styles
        </label>
        <div className="space-y-2">
          {[
            { id: 'hormozi', name: 'Alex Hormozi', desc: 'Bold Yellow uppercase, high drop-shadow' },
            { id: 'mrbeast', name: 'MrBeast', desc: 'Bouncy Cyan comic style, high energy' },
            { id: 'iman', name: 'Iman Gadzhi', desc: 'Serif elegance, minimalist gold underline' },
            { id: 'minimalist', name: 'Minimalist', desc: 'Clean translucent background subtitle' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => onUpdateCaptionPreset(preset.id as CaptionPreset)}
              className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                captionPreset === preset.id
                  ? 'bg-brand-purple/20 border-brand-purple text-white'
                  : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div>
                <div className="font-bold text-xs">{preset.name}</div>
                <div className="text-[10px] text-slate-400">{preset.desc}</div>
              </div>
              {captionPreset === preset.id && <Check className="w-4 h-4 text-brand-purple" />}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Creator Brand Watermark */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Creator Handle Watermark
        </label>
        <div className="relative">
          <AtSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={handleText}
            onChange={(e) => setHandleText(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-studio-900 border border-slate-700 text-xs text-white focus:border-brand-purple outline-none font-mono"
          />
        </div>
      </div>

      {/* 5. Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">Auto Emoji Injection</span>
          <input
            type="checkbox"
            checked={autoEmojis}
            onChange={(e) => setAutoEmojis(e.target.checked)}
            className="w-4 h-4 accent-brand-purple cursor-pointer rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300">Viral Intro Hook Bumper</span>
          <input
            type="checkbox"
            checked={includeBumper}
            onChange={(e) => setIncludeBumper(e.target.checked)}
            className="w-4 h-4 accent-brand-purple cursor-pointer rounded"
          />
        </div>
      </div>
    </div>
  );
};
