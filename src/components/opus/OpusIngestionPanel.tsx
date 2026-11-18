import React, { useState } from 'react';
import {
  Sparkles,
  Scissors,
  Wand2,
  Trash2,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  Clock,
  Check,
  Smartphone,
  Sliders,
  FolderKanban
} from 'lucide-react';
import { AspectRatio, VideoLanguage, AIProcessingConfig } from '../../types';
import { OpusLayoutModal } from './OpusLayoutModal';
import { OpusRecipesModal } from './OpusRecipesModal';
import { OPUS_RECIPES } from '../../data/opusRecipes';
import { OPUS_LAYOUTS } from '../../data/opusLayouts';

interface OpusIngestionPanelProps {
  videoTitle: string;
  durationMinutes: number;
  thumbnailUrl: string;
  onConfirm: (config: AIProcessingConfig) => void;
  onCancel: () => void;
}

export const OpusIngestionPanel: React.FC<OpusIngestionPanelProps> = ({
  videoTitle,
  durationMinutes,
  thumbnailUrl,
  onConfirm,
  onCancel
}) => {
  // Config state
  const [speechLanguage, setSpeechLanguage] = useState<VideoLanguage>('hinglish');
  const [genre, setGenre] = useState<string>('Auto');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('9:16');
  const [activeLayoutIds, setActiveLayoutIds] = useState<string[]>(['fill', 'fit', 'split', 'three', 'four', 'screenshare', 'gameplay']);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('clip-long-video');
  const [selectedBrandKit, setSelectedBrandKit] = useState<string>('No brand kit');
  const [isClippingEnabled, setIsClippingEnabled] = useState<boolean>(true);
  const [aiPicksMode, setAiPicksMode] = useState<string>('Auto');
  const [clipLength, setClipLength] = useState<AIProcessingConfig['targetClipDuration']>('30-60s');
  const [momentsPrompt, setMomentsPrompt] = useState<string>('');
  const [isRecipeSettingsOpen, setIsRecipeSettingsOpen] = useState<boolean>(true);

  // Modals state
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState<boolean>(false);
  const [isRecipesModalOpen, setIsRecipesModalOpen] = useState<boolean>(false);

  // Active recipe info
  const activeRecipe = OPUS_RECIPES.find((r) => r.id === selectedRecipeId) || OPUS_RECIPES[0];

  // Credit calculation
  const creditsRequired = Math.max(15, Math.round(durationMinutes * 2.3));

  const handleToggleLayoutId = (id: string) => {
    setActiveLayoutIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((x) => x !== id) : prev) : [...prev, id]
    );
  };

  const handleCreate = () => {
    onConfirm({
      targetClipDuration: clipLength,
      language: speechLanguage,
      aspectRatio: selectedAspectRatio,
      captionTemplateId: 'hormozi-yellow',
      clipAnythingPrompt: momentsPrompt,
      autoEmojis: true,
      emojiConfig: {
        enabled: true,
        density: 'medium',
        animation: 'bounce',
        position: 'above',
        pack: 'viral_fire'
      },
      autoZoom: {
        enabled: true,
        energy: 'dynamic',
        zoomScale: 1.15,
        speed: 'smooth'
      },
      autoBRoll: {
        enabled: true,
        frequency: 'balanced',
        source: 'ai_stock',
        kenBurnsTransition: true
      },
      removeFillers: true,
      highlightKeywords: true
    });
  };

  const formatSecondsToHms = (mins: number) => {
    const totalSecs = mins * 60;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = Math.floor(totalSecs % 60);
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full rounded-2xl bg-[#121214] border border-slate-800 text-slate-100 shadow-2xl overflow-hidden p-4 sm:p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT / CENTER: Settings & Ingestion Form (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Top Video Preview & Range Card matching Screenshot 3 */}
          <div className="p-4 rounded-xl bg-[#1c1c1f] border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Thumbnail with 1080p Badge */}
              <div className="relative w-36 sm:w-44 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700">
                <img src={thumbnailUrl} alt={videoTitle} className="w-full h-full object-cover" />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-white border border-white/20">
                  1080p
                </span>
                <button
                  type="button"
                  onClick={onCancel}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-black/80 text-slate-400 hover:text-red-400 transition"
                  title="Remove video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Range & Metadata Dropdowns */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <span>Adjust range</span>
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Credit saver
                  </span>
                </div>

                {/* Keyframe Filmstrip Visual Slider */}
                <div className="w-full h-9 rounded-md bg-black/80 border border-slate-700/80 flex items-center justify-between px-2 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-2 bg-white rounded-l cursor-ew-resize" />
                  <div className="absolute inset-y-0 right-0 w-2 bg-white rounded-r cursor-ew-resize" />
                  <div className="w-full flex items-center justify-around opacity-30 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7].map((k) => (
                      <div key={k} className="w-8 h-6 bg-slate-700 rounded-sm" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>0:00:00</span>
                  <span className="text-purple-300 font-bold">{durationMinutes}m duration</span>
                  <span>{formatSecondsToHms(durationMinutes)}</span>
                </div>
              </div>
            </div>

            {/* Quick Selectors Row (3 Core Languages: Hindi, Hinglish, English, Genre, Layout, SRT) */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
              {/* 3 Core Languages Pill Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#27272a] border border-slate-700">
                {(['hinglish', 'hindi', 'english'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSpeechLanguage(lang)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition capitalize ${
                      speechLanguage === lang
                        ? 'bg-brand-purple text-white shadow-md shadow-purple-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang === 'hinglish' ? 'Hinglish (Viral)' : lang === 'hindi' ? 'Hindi (हिंदी)' : 'English'}
                  </button>
                ))}
              </div>

              {/* Genre Selector */}
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#27272a] border border-slate-700">
                <span className="text-slate-400 text-[11px]">Genre:</span>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-transparent text-white font-bold text-[11px] outline-none cursor-pointer"
                >
                  <option value="Auto" className="bg-[#27272a]">Auto</option>
                  <option value="Podcast" className="bg-[#27272a]">Podcast</option>
                  <option value="Interview" className="bg-[#27272a]">Interview</option>
                  <option value="Education" className="bg-[#27272a]">Education</option>
                  <option value="Horror" className="bg-[#27272a]">Horror / Cinema</option>
                  <option value="Gaming" className="bg-[#27272a]">Gaming</option>
                </select>
              </div>

              {/* Layout Button Trigger */}
              <button
                type="button"
                onClick={() => setIsLayoutModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-white transition"
              >
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>Layout {selectedAspectRatio}, {activeLayoutIds.length} layouts</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Upload SRT button */}
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#27272a] hover:bg-slate-700 border border-slate-700 text-[11px] text-slate-300 transition"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Upload SRT</span>
              </button>
            </div>
          </div>

          {/* Middle Row: Recipe & Brand Kit Cards matching Screenshot 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Recipe Card */}
            <div
              onClick={() => setIsRecipesModalOpen(true)}
              className="p-3.5 rounded-xl bg-[#1c1c1f] hover:bg-[#232327] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Recipe</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{activeRecipe.title}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Kit Card */}
            <div className="p-3.5 rounded-xl bg-[#1c1c1f] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <FolderKanban className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Brand kit</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{selectedBrandKit}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Your Recipe sets which edits run. Your brand kit sets the look, like your logo, intro, outro and caption style.
          </p>

          {/* Recipe Settings (Collapsible) matching Screenshot 3 */}
          <div className="p-4 rounded-xl bg-[#1c1c1f] border border-slate-800 space-y-4">
            <div
              onClick={() => setIsRecipeSettingsOpen(!isRecipeSettingsOpen)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Recipe settings</span>
                {isRecipeSettingsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
              </h4>
            </div>

            {isRecipeSettingsOpen && (
              <div className="space-y-4 pt-1 border-t border-slate-800 animate-fade-in">
                {/* Clipping Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-white">Clipping</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsClippingEnabled(!isClippingEnabled)}
                    className={`w-10 h-5 rounded-full transition relative ${
                      isClippingEnabled ? 'bg-purple-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition transform ${
                        isClippingEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* AI Picks & Clip Length Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">AI picks</label>
                    <select
                      value={aiPicksMode}
                      onChange={(e) => setAiPicksMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#27272a] border border-slate-700 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="Auto">Auto (Hook + High Retention)</option>
                      <option value="Q&A">Interview Questions & Answers</option>
                      <option value="Highlights">Top Climax Moments</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Clip length</label>
                    <select
                      value={clipLength}
                      onChange={(e) => setClipLength(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-[#27272a] border border-slate-700 text-xs font-bold text-white outline-none cursor-pointer"
                    >
                      <option value="<30s">&lt; 30s (Shorts Fast Hook)</option>
                      <option value="30-60s">Auto (30s - 60s)</option>
                      <option value="60-90s">60s - 90s (Deep Story)</option>
                      <option value="3m">Up to 3m (Extended Cut)</option>
                    </select>
                  </div>
                </div>

                {/* Moments to include (optional) input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-slate-300">Moments to include (optional)</label>
                    <button type="button" className="text-[10px] text-purple-400 hover:underline">
                      How to prompt ⓘ
                    </button>
                  </div>
                  <input
                    type="text"
                    value={momentsPrompt}
                    onChange={(e) => setMomentsPrompt(e.target.value)}
                    placeholder="Example: Compile all the hilarious moments, business advice, or scary scenes..."
                    className="w-full px-3 py-2 rounded-lg bg-[#27272a] border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Opus Summary Card matching Screenshot 3 */}
        <div className="p-5 rounded-2xl bg-[#1c1c1f] border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Summary</h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span>Video processing</span>
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span className="font-mono font-bold text-white">{creditsRequired} credits</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Clipping</span>
                <span className="text-emerald-400 font-bold">Free</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Captions</span>
                <span className="text-emerald-400 font-bold">Free</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Premium features</span>
                <span className="text-slate-400">Applied to top 10 clips</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Headline</span>
                <span className="text-emerald-400 font-bold">Free</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-base font-black text-amber-400 flex items-center gap-1 font-mono">
                <Zap className="w-4 h-4" />
                {creditsRequired} credits
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleCreate}
              data-testid="start-ai-repurposing-btn"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Viral Shorts</span>
            </button>

            <p className="text-[10px] text-slate-500 text-center leading-tight">
              By continuing, you confirm you have rights to use this video.
            </p>
          </div>
        </div>
      </div>

      {/* Opus Layouts Modal */}
      {isLayoutModalOpen && (
        <OpusLayoutModal
          isOpen={isLayoutModalOpen}
          onClose={() => setIsLayoutModalOpen(false)}
          selectedAspectRatio={selectedAspectRatio}
          onSelectAspectRatio={setSelectedAspectRatio}
          activeLayoutIds={activeLayoutIds}
          onToggleLayoutId={handleToggleLayoutId}
        />
      )}

      {/* Opus Recipes Modal */}
      {isRecipesModalOpen && (
        <OpusRecipesModal
          isOpen={isRecipesModalOpen}
          onClose={() => setIsRecipesModalOpen(false)}
          selectedRecipeId={selectedRecipeId}
          onSelectRecipe={(id) => {
            setSelectedRecipeId(id);
            setIsRecipesModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
