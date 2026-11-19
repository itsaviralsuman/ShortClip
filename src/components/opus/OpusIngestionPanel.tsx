import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Scissors,
  Trash2,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
  Check,
  Smartphone,
  Sliders,
  Type,
  Smile,
  ZoomIn,
  Film,
  RotateCcw
} from 'lucide-react';
import { AspectRatio, VideoLanguage, AIProcessingConfig } from '../../types';
import { OpusLayoutModal } from './OpusLayoutModal';
import { OpusRecipesModal } from './OpusRecipesModal';
import { OPUS_RECIPES } from '../../data/opusRecipes';

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
  // Total source duration in seconds
  const totalVideoSeconds = Math.max(60, Math.round(durationMinutes * 60));

  // 1. Interactive Dual-Handle Video Range Adjuster ("Adjust range video ko chota bada kar sake")
  const [rangeStartSec, setRangeStartSec] = useState<number>(0);
  const [rangeEndSec, setRangeEndSec] = useState<number>(totalVideoSeconds);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<'start' | 'end' | null>(null);

  // 2. Feature ON/OFF Toggles ("sab chiz ka button hona chiaye on off karne ka")
  const [isClippingEnabled, setIsClippingEnabled] = useState<boolean>(true);
  const [isCaptionsEnabled, setIsCaptionsEnabled] = useState<boolean>(true);
  const [isEmojisEnabled, setIsEmojisEnabled] = useState<boolean>(true);
  const [isAutoZoomEnabled, setIsAutoZoomEnabled] = useState<boolean>(true);
  const [isFillerRemovalEnabled, setIsFillerRemovalEnabled] = useState<boolean>(true);
  const [isAutoBRollEnabled, setIsAutoBRollEnabled] = useState<boolean>(true);
  const [isHookTitleEnabled, setIsHookTitleEnabled] = useState<boolean>(true);

  // 3. Save in Gallery Default Option ("srt ke jagah save in gallery ka option rakh do")
  const [autoSaveToGallery, setAutoSaveToGallery] = useState<boolean>(true);

  // Language & layout config
  const [speechLanguage, setSpeechLanguage] = useState<VideoLanguage>('hinglish');
  const [genre, setGenre] = useState<string>('Auto');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>('9:16');
  const [activeLayoutIds, setActiveLayoutIds] = useState<string[]>([
    'fill', 'fit', 'split', 'three', 'four', 'screenshare', 'gameplay'
  ]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('clip-long-video');
  const [aiPicksMode, setAiPicksMode] = useState<string>('Auto');
  const [clipLength, setClipLength] = useState<AIProcessingConfig['targetClipDuration']>('30-60s');
  const [momentsPrompt, setMomentsPrompt] = useState<string>('');
  const [isRecipeSettingsOpen, setIsRecipeSettingsOpen] = useState<boolean>(true);

  // Modals state
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState<boolean>(false);
  const [isRecipesModalOpen, setIsRecipesModalOpen] = useState<boolean>(false);

  // Active recipe info
  const activeRecipe = OPUS_RECIPES.find((r) => r.id === selectedRecipeId) || OPUS_RECIPES[0];

  // Dynamic adjusted range and credit calculations
  const adjustedDurationSec = Math.max(30, rangeEndSec - rangeStartSec);
  const adjustedDurationMinutes = adjustedDurationSec / 60;
  const creditsRequired = Math.max(5, Math.round(adjustedDurationMinutes * 2.3));

  // Format seconds to H:MM:SS
  const formatSecondsToHms = (secs: number) => {
    const s = Math.round(secs);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const remSecs = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  // Dual-Handle Range Slider Pointer / Touch Handlers
  const handleRangePointerDown = (handle: 'start' | 'end', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = handle;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleRangePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !filmstripRef.current) return;
    const rect = filmstripRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSec = Math.round(ratio * totalVideoSeconds);

    if (isDraggingRef.current === 'start') {
      // Must not cross end handle (keep minimum 30s)
      const maxStart = Math.max(0, rangeEndSec - 30);
      setRangeStartSec(Math.min(targetSec, maxStart));
    } else if (isDraggingRef.current === 'end') {
      // Must not cross start handle (keep minimum 30s)
      const minEnd = Math.min(totalVideoSeconds, rangeStartSec + 30);
      setRangeEndSec(Math.max(targetSec, minEnd));
    }
  };

  const handleRangePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
      isDraggingRef.current = null;
    }
  };

  // Quick preset ranges for easy 1-touch mobile resizing
  const handleSetPresetRange = (type: 'full' | 'first15' | 'first30' | 'first60') => {
    if (type === 'full') {
      setRangeStartSec(0);
      setRangeEndSec(totalVideoSeconds);
    } else if (type === 'first15') {
      setRangeStartSec(0);
      setRangeEndSec(Math.min(totalVideoSeconds, 15 * 60));
    } else if (type === 'first30') {
      setRangeStartSec(0);
      setRangeEndSec(Math.min(totalVideoSeconds, 30 * 60));
    } else if (type === 'first60') {
      setRangeStartSec(0);
      setRangeEndSec(Math.min(totalVideoSeconds, 60 * 60));
    }
  };

  const startPercent = Math.min(100, Math.max(0, (rangeStartSec / totalVideoSeconds) * 100));
  const endPercent = Math.min(100, Math.max(0, (rangeEndSec / totalVideoSeconds) * 100));

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
      captionTemplateId: isCaptionsEnabled ? 'hormozi-yellow' : 'none',
      clipAnythingPrompt: momentsPrompt,
      autoEmojis: isEmojisEnabled,
      emojiConfig: {
        enabled: isEmojisEnabled,
        density: 'medium',
        animation: 'bounce',
        position: 'above',
        pack: 'viral_fire'
      },
      autoZoom: {
        enabled: isAutoZoomEnabled,
        energy: 'dynamic',
        zoomScale: 1.15,
        speed: 'smooth'
      },
      autoBRoll: {
        enabled: isAutoBRollEnabled,
        frequency: 'balanced',
        source: 'ai_stock',
        kenBurnsTransition: true
      },
      removeFillers: isFillerRemovalEnabled,
      highlightKeywords: true,
      rangeStart: rangeStartSec,
      rangeEnd: rangeEndSec,
      autoSaveToGallery,
      isCaptionsEnabled,
      isHookTitleEnabled
    });
  };

  return (
    <div className="w-full rounded-2xl bg-[#121214] border border-slate-800 text-slate-100 shadow-2xl overflow-hidden p-3 sm:p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* LEFT / CENTER: Settings & Ingestion Form (2 cols) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          {/* Top Video Preview & Interactive Range Adjuster */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#1c1c1f] border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-4">
              {/* Thumbnail with 1080p Badge */}
              <div className="relative w-full sm:w-44 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-slate-700 max-h-[160px] sm:max-h-none">
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

              {/* Working Interactive Dual-Handle Range Adjuster */}
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

                {/* Interactive Filmstrip Bar */}
                <div
                  ref={filmstripRef}
                  onPointerMove={handleRangePointerMove}
                  onPointerUp={handleRangePointerUp}
                  className="w-full h-10 rounded-lg bg-black/90 border border-slate-700/80 relative overflow-hidden select-none touch-none cursor-pointer"
                >
                  {/* Filmstrip Frame Previews Mock */}
                  <div className="absolute inset-0 flex items-center justify-around opacity-30 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
                      <div key={k} className="w-7 sm:w-8 h-7 bg-slate-700 rounded-sm" />
                    ))}
                  </div>

                  {/* Dimmed Left Mask */}
                  <div
                    style={{ width: `${startPercent}%` }}
                    className="absolute inset-y-0 left-0 bg-black/75 pointer-events-none transition-[width] duration-75"
                  />

                  {/* Active Selected Range Box */}
                  <div
                    style={{ left: `${startPercent}%`, width: `${Math.max(2, endPercent - startPercent)}%` }}
                    className="absolute inset-y-0 border-y-2 border-purple-500 bg-purple-500/20 pointer-events-none transition-all duration-75"
                  />

                  {/* Dimmed Right Mask */}
                  <div
                    style={{ left: `${endPercent}%`, width: `${100 - endPercent}%` }}
                    className="absolute inset-y-0 right-0 bg-black/75 pointer-events-none transition-[width] duration-75"
                  />

                  {/* Left Drag Handle */}
                  <div
                    style={{ left: `${startPercent}%` }}
                    onPointerDown={(e) => handleRangePointerDown('start', e)}
                    className="absolute inset-y-0 -ml-2.5 w-5 bg-white hover:bg-purple-200 border border-slate-900 rounded-md cursor-ew-resize flex items-center justify-center shadow-2xl z-20 transition-transform active:scale-110"
                    title="Drag to trim start time"
                  >
                    <div className="w-1 h-4 bg-slate-600 rounded-full" />
                  </div>

                  {/* Right Drag Handle */}
                  <div
                    style={{ left: `${endPercent}%` }}
                    onPointerDown={(e) => handleRangePointerDown('end', e)}
                    className="absolute inset-y-0 -ml-2.5 w-5 bg-white hover:bg-purple-200 border border-slate-900 rounded-md cursor-ew-resize flex items-center justify-center shadow-2xl z-20 transition-transform active:scale-110"
                    title="Drag to trim end time"
                  >
                    <div className="w-1 h-4 bg-slate-600 rounded-full" />
                  </div>
                </div>

                {/* Live Timestamps and Duration Counters */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-slate-800">
                    {formatSecondsToHms(rangeStartSec)}
                  </span>
                  <span className="text-purple-300 font-bold">
                    {Math.round(adjustedDurationMinutes)}m duration ({Math.round(adjustedDurationSec)}s)
                  </span>
                  <span className="font-bold text-white bg-black/40 px-1.5 py-0.5 rounded border border-slate-800">
                    {formatSecondsToHms(rangeEndSec)}
                  </span>
                </div>

                {/* Quick 1-Touch Presets to Resize Video */}
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[10px]">
                  <span className="text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSetPresetRange('full')}
                    className="px-2 py-0.5 rounded bg-[#27272a] hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-slate-700 shrink-0 transition"
                  >
                    Full Video ({durationMinutes}m)
                  </button>
                  {durationMinutes > 15 && (
                    <button
                      type="button"
                      onClick={() => handleSetPresetRange('first15')}
                      className="px-2 py-0.5 rounded bg-[#27272a] hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-slate-700 shrink-0 transition"
                    >
                      First 15m
                    </button>
                  )}
                  {durationMinutes > 30 && (
                    <button
                      type="button"
                      onClick={() => handleSetPresetRange('first30')}
                      className="px-2 py-0.5 rounded bg-[#27272a] hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-slate-700 shrink-0 transition"
                    >
                      First 30m
                    </button>
                  )}
                  {durationMinutes > 60 && (
                    <button
                      type="button"
                      onClick={() => handleSetPresetRange('first60')}
                      className="px-2 py-0.5 rounded bg-[#27272a] hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-slate-700 shrink-0 transition"
                    >
                      First 60m
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Selectors Row: Languages, Genre, Layout, and Save in Gallery */}
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

              {/* Save in Gallery Option (Replaced SRT) */}
              <button
                type="button"
                onClick={() => setAutoSaveToGallery(!autoSaveToGallery)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition ${
                  autoSaveToGallery
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                    : 'bg-[#27272a] text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Save video directly to your Phone Photos / Gallery"
              >
                <Smartphone className="w-3.5 h-3.5 text-amber-300" />
                <span>Save in Gallery</span>
                <span className={`w-2 h-2 rounded-full ${autoSaveToGallery ? 'bg-brand-emerald animate-pulse' : 'bg-slate-600'}`} />
              </button>
            </div>
          </div>

          {/* Middle Row: Recipe Selection Card (Brand kit completely removed per user request) */}
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
            <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Change Recipe
            </span>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            Your Recipe sets which AI clipping, dynamic captions, and viral edits run.
          </p>

          {/* Recipe Settings (Collapsible) with full ON/OFF Buttons for EVERY Feature */}
          <div className="p-4 rounded-xl bg-[#1c1c1f] border border-slate-800 space-y-4">
            <div
              onClick={() => setIsRecipeSettingsOpen(!isRecipeSettingsOpen)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Recipe settings (Features & ON/OFF Controls)</span>
              </h4>
              {isRecipeSettingsOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </div>

            {isRecipeSettingsOpen && (
              <div className="space-y-4 pt-1 border-t border-slate-800 animate-fade-in">
                {/* 1. Feature Switches Grid ("sab chiz ka button hona chiaye on off karne ka") */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Clipping Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-semibold text-white">Clipping & Highlights</span>
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

                  {/* Captions Switch ("caption hona chaiye jaise phele tha") */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold text-white">Dynamic Captions</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCaptionsEnabled(!isCaptionsEnabled)}
                      className={`w-10 h-5 rounded-full transition relative ${
                        isCaptionsEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition transform ${
                          isCaptionsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Auto-Emojis Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <Smile className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">Auto Emojis & Stickers</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEmojisEnabled(!isEmojisEnabled)}
                      className={`w-10 h-5 rounded-full transition relative ${
                        isEmojisEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition transform ${
                          isEmojisEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Auto-Zoom Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <ZoomIn className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-white">Auto-Zoom & Punch</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAutoZoomEnabled(!isAutoZoomEnabled)}
                      className={`w-10 h-5 rounded-full transition relative ${
                        isAutoZoomEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition transform ${
                          isAutoZoomEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Remove Fillers & Silence Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-semibold text-white">Remove Fillers & Silences</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsFillerRemovalEnabled(!isFillerRemovalEnabled)}
                      className={`w-10 h-5 rounded-full transition relative ${
                        isFillerRemovalEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition transform ${
                          isFillerRemovalEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Auto B-Roll Visuals Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-white">AI B-Roll Cutaways</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAutoBRollEnabled(!isAutoBRollEnabled)}
                      className={`w-10 h-5 rounded-full transition relative ${
                        isAutoBRollEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition transform ${
                          isAutoBRollEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Hook Title Overlay Switch */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#27272a]/70 border border-slate-700/80 sm:col-span-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-300" />
                      <span className="text-xs font-semibold text-white">Viral Hook Title Header</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsHookTitleEnabled(!isHookTitleEnabled)}
                      className={`w-10 h-5 rounded-full transition relative ${
                        isHookTitleEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition transform ${
                          isHookTitleEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* AI Picks & Clip Length Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
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

        {/* RIGHT: Opus Summary Card */}
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
              className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create Viral Shorts ({creditsRequired} Credits)</span>
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
