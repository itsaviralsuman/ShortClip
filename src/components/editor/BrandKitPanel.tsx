import React, { useState } from 'react';
import {
  AspectRatio,
  SpeakerMode,
  AutoZoomConfig,
  EmojiConfig,
  AutoBRollConfig,
  VideoLanguage
} from '../../types';
import { OPUS_CAPTION_TEMPLATES } from '../../data/captionTemplates';
import {
  Type,
  ZoomIn,
  Smile,
  Film,
  Layers,
  Check,
  Search,
  Maximize2,
  SplitSquareVertical,
  AtSign,
  Sparkles,
  Zap,
  Sliders,
  Globe
} from 'lucide-react';

interface BrandKitPanelProps {
  aspectRatio: AspectRatio;
  onUpdateAspectRatio: (ratio: AspectRatio) => void;
  speakerMode: SpeakerMode;
  onUpdateSpeakerMode: (mode: SpeakerMode) => void;
  captionTemplateId: string;
  onUpdateCaptionTemplate: (templateId: string) => void;
  language?: VideoLanguage;
  onUpdateLanguage?: (lang: VideoLanguage) => void;
  autoZoom: AutoZoomConfig;
  onUpdateAutoZoom: (zoom: Partial<AutoZoomConfig>) => void;
  emojiConfig: EmojiConfig;
  onUpdateEmojiConfig: (emojis: Partial<EmojiConfig>) => void;
  bRollConfig: AutoBRollConfig;
  onUpdateBRollConfig: (broll: Partial<AutoBRollConfig>) => void;
}

export const BrandKitPanel: React.FC<BrandKitPanelProps> = ({
  aspectRatio,
  onUpdateAspectRatio,
  speakerMode,
  onUpdateSpeakerMode,
  captionTemplateId,
  onUpdateCaptionTemplate,
  language = 'hinglish',
  onUpdateLanguage,
  autoZoom,
  onUpdateAutoZoom,
  emojiConfig,
  onUpdateEmojiConfig,
  bRollConfig,
  onUpdateBRollConfig
}) => {
  const [activeTab, setActiveTab] = useState<'captions' | 'zoom' | 'emojis' | 'broll' | 'layout'>('captions');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [watermark, setWatermark] = useState<string>('@scale_with_ai');

  const filteredTemplates = OPUS_CAPTION_TEMPLATES.filter((tpl) => {
    const matchesCategory = categoryFilter === 'All' || tpl.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tpl.creatorTag && tpl.creatorTag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full lg:w-88 h-full bg-studio-950 border-l border-slate-800 flex flex-col text-xs select-none">
      {/* Studio Brand Tabs */}
      <div className="p-2 border-b border-slate-800 bg-studio-900/80 flex items-center justify-between gap-1 overflow-x-auto scroll-fade-x shrink-0">
        {[
          { id: 'captions', label: 'Captions (35)', icon: Type },
          { id: 'zoom', label: 'Auto Zoom', icon: ZoomIn },
          { id: 'emojis', label: 'AI Emojis', icon: Smile },
          { id: 'broll', label: 'Auto B-Roll', icon: Film },
          { id: 'layout', label: 'Layout', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold text-[11px] whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-brand-purple text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-studio-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: 35 OpusClip Caption Templates */}
      {activeTab === 'captions' && (
        <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
          {/* Language Selector */}
          <div className="p-2.5 rounded-xl bg-studio-900 border border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                Language / भाषा
              </span>
              <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/20 uppercase font-mono font-bold border border-purple-500/30">
                {language}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'hinglish', label: 'Hinglish', sub: 'Roman Hindi' },
                { id: 'hindi', label: 'हिंदी', sub: 'Devanagari' },
                { id: 'english', label: 'English', sub: 'Global' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onUpdateLanguage && onUpdateLanguage(lang.id as VideoLanguage)}
                  className={`py-1.5 px-2 rounded-lg text-center transition flex flex-col items-center justify-center border ${
                    language === lang.id
                      ? 'bg-purple-600/25 text-purple-200 border-purple-500 font-bold shadow-sm shadow-purple-500/30 ring-1 ring-purple-500/40'
                      : 'bg-studio-950 text-slate-400 border-slate-800 hover:text-white hover:bg-studio-800'
                  }`}
                >
                  <span className="text-xs font-semibold leading-tight">{lang.label}</span>
                  <span className="text-[9px] text-slate-500 leading-tight">{lang.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 35 caption styles (e.g. Hormozi, Neon, Beast)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-studio-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-purple"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto scroll-fade-x pb-1 text-[10px]">
              {['All', 'Creator', 'Kinetic', 'Minimalist', 'Broadcast'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition ${
                    categoryFilter === cat
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-studio-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat} {cat === 'All' ? '(35)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* 35 Templates List with Edge Fade */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scroll-fade-y">
            {filteredTemplates.map((tpl) => {
              const isSelected = captionTemplateId === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => onUpdateCaptionTemplate(tpl.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition relative overflow-hidden group ${
                    isSelected
                      ? 'bg-brand-purple/20 border-brand-purple shadow-lg shadow-purple-500/20 ring-1 ring-purple-400'
                      : 'bg-studio-900/60 border-slate-800 hover:border-slate-700 hover:bg-studio-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-studio-800 text-slate-300 font-bold border border-slate-700">
                      {tpl.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{tpl.category}</span>
                    {isSelected && <Check className="w-4 h-4 text-brand-purple shrink-0" />}
                  </div>

                  <div className="font-bold text-xs text-white truncate mb-1.5">
                    {tpl.name}
                  </div>

                  {/* Visual Style Preview Snippet */}
                  <div
                    style={{
                      fontFamily: tpl.fontFamily,
                      color: tpl.activeWordColor,
                      textShadow: tpl.textShadow,
                      backgroundColor: tpl.backgroundColor || 'transparent'
                    }}
                    className={`text-center py-1.5 px-2 rounded-lg text-sm font-black tracking-tight ${tpl.textTransform} border border-slate-800/60 bg-black/40`}
                  >
                    {tpl.sampleText} <span className="text-xs">{tpl.emojiPack.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Auto Zoom / Dynamic Camera Punch */}
      {activeTab === 'zoom' && (
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-studio-900 border border-slate-800">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-brand-cyan" />
                <span>Dynamic Auto-Zoom</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Automatically punches in camera on energetic words to hold viewer retention
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoZoom.enabled}
              onChange={(e) => onUpdateAutoZoom({ enabled: e.target.checked })}
              className="w-4 h-4 accent-brand-purple cursor-pointer rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Zoom Punch Intensity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'subtle', label: 'Subtle (1.08x)', scale: 1.08 },
                { id: 'dynamic', label: 'Dynamic (1.15x)', scale: 1.15 },
                { id: 'high_energy', label: 'High (1.25x)', scale: 1.25 },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onUpdateAutoZoom({ energy: opt.id as any, zoomScale: opt.scale })}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    autoZoom.energy === opt.id
                      ? 'bg-brand-cyan/20 border-brand-cyan text-white shadow'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label.split(' ')[0]}</div>
                  <div className="text-[10px] text-cyan-300 font-mono mt-0.5">{opt.label.split(' ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Camera Motion Dynamics
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'smooth', label: 'Smooth Glide', desc: 'Cinematic easing' },
                { id: 'punchy', label: 'Punchy Snap', desc: 'MrBeast snappy cut' },
              ].map((speed) => (
                <button
                  key={speed.id}
                  onClick={() => onUpdateAutoZoom({ speed: speed.id as any })}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    autoZoom.speed === speed.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white shadow'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs">{speed.label}</div>
                  <div className="text-[10px] text-slate-400">{speed.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200">
            💡 <strong>Opus AI Benchmark:</strong> Adding a 1.15x dynamic zoom punch on high-sentiment words boosts 15s completion rate by +34%.
          </div>
        </div>
      )}

      {/* Tab 3: AI Emojis */}
      {activeTab === 'emojis' && (
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-studio-900 border border-slate-800">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-400" />
                <span>Auto-Inject AI Emojis</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Detects emotions & keywords to inject matching animated emojis
              </p>
            </div>
            <input
              type="checkbox"
              checked={emojiConfig.enabled}
              onChange={(e) => onUpdateEmojiConfig({ enabled: e.target.checked })}
              className="w-4 h-4 accent-brand-purple cursor-pointer rounded"
            />
          </div>

          {/* Emoji Placement */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Emoji Placement
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'above', label: 'Above Active Word' },
                { id: 'inline', label: 'Inline With Text' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => onUpdateEmojiConfig({ position: pos.id as any })}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    emojiConfig.position === pos.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white'
                      : 'bg-studio-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-xs">{pos.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Packs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Emoji Palette Pack
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'viral_fire', label: '🔥 Viral Fire & Energy', emojis: '🔥 ⚡ 💥 💀 🚀' },
                { id: 'money_crypto', label: '💰 Money, Crypto & Wealth', emojis: '💰 💸 📈 🏦 💎' },
                { id: 'growth_tech', label: '🚀 Growth, Coding & Tech', emojis: '💻 🤖 🎯 💡 🧠' },
                { id: 'comedy_memes', label: '😂 Comedy & Reactions', emojis: '😂 😱 🤯 🍿 🤡' },
              ].map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => onUpdateEmojiConfig({ pack: pack.id as any })}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
                    emojiConfig.pack === pack.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white'
                      : 'bg-studio-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs">{pack.label}</span>
                  <span className="text-sm font-mono">{pack.emojis}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Emoji Density */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Emoji Density
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['low', 'medium', 'high'].map((density) => (
                <button
                  key={density}
                  onClick={() => onUpdateEmojiConfig({ density: density as any })}
                  className={`p-2 rounded-xl border text-center capitalize transition ${
                    emojiConfig.density === density
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-studio-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Auto B-Roll */}
      {activeTab === 'broll' && (
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          <div className="flex items-center justify-between p-3 rounded-xl bg-studio-900 border border-slate-800">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <Film className="w-4 h-4 text-brand-emerald" />
                <span>Auto-Insert AI B-Roll</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Matches spoken topics with royalty-free stock footage & overlays
              </p>
            </div>
            <input
              type="checkbox"
              checked={bRollConfig.enabled}
              onChange={(e) => onUpdateBRollConfig({ enabled: e.target.checked })}
              className="w-4 h-4 accent-brand-purple cursor-pointer rounded"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              B-Roll Cut Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'conservative', label: 'Every 8s' },
                { id: 'balanced', label: 'Every 5s' },
                { id: 'aggressive', label: 'Every 3s' },
              ].map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => onUpdateBRollConfig({ frequency: freq.id as any })}
                  className={`p-2 rounded-xl border text-center transition ${
                    bRollConfig.frequency === freq.id
                      ? 'bg-brand-emerald/20 border-brand-emerald text-emerald-300 font-bold'
                      : 'bg-studio-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              B-Roll Visual Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ai_stock', label: 'AI Stock Footage' },
                { id: 'motion_graphics', label: 'Motion Graphics' },
                { id: 'cinematic', label: 'Cinematic B-Roll' },
                { id: 'reactions', label: 'Meme Reactions' },
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => onUpdateBRollConfig({ source: src.id as any })}
                  className={`p-2 rounded-xl border text-center transition ${
                    bRollConfig.source === src.id
                      ? 'bg-brand-purple/20 border-brand-purple text-white font-bold'
                      : 'bg-studio-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-studio-900 border border-slate-800">
            <span className="text-slate-300">Ken Burns Pan & Zoom</span>
            <input
              type="checkbox"
              checked={bRollConfig.kenBurnsTransition}
              onChange={(e) => onUpdateBRollConfig({ kenBurnsTransition: e.target.checked })}
              className="w-4 h-4 accent-brand-purple cursor-pointer rounded"
            />
          </div>
        </div>
      )}

      {/* Tab 5: Layout & Reframe */}
      {activeTab === 'layout' && (
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          {/* Aspect Ratio */}
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

          {/* AI Speaker Tracking */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block flex items-center justify-between">
              <span>AI Multi-Cam Speaker Layout</span>
              <span className="text-[10px] text-brand-emerald font-mono">Face Track Active</span>
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
                    <div className="font-bold">Single Speaker Auto-Track</div>
                    <div className="text-[10px] text-slate-400">Centers speaker dynamically</div>
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

          {/* Watermark Handle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Creator Handle Watermark
            </label>
            <div className="relative">
              <AtSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-studio-900 border border-slate-700 text-xs text-white focus:border-brand-purple outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
