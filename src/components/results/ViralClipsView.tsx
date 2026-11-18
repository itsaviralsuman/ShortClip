import React, { useState } from 'react';
import { useVideoProjects } from '../../context/VideoProjectContext';
import { ClipCard } from './ClipCard';
import { ViralClip } from '../../types';
import {
  Sparkles,
  Flame,
  Wand2,
  Filter,
  ArrowUpDown,
  Search,
  RotateCcw,
  Film,
  Layers,
  Clock,
  Trash2,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';

interface ViralClipsViewProps {
  onOpenStudio: (clip: ViralClip) => void;
  onBackToDashboard: () => void;
}

export const ViralClipsView: React.FC<ViralClipsViewProps> = ({
  onOpenStudio,
  onBackToDashboard
}) => {
  const {
    activeProject,
    activeFilterPrompt,
    setFilterPrompt,
    getFilteredClips,
    deleteSelectedClips
  } = useVideoProjects();

  const [activeChip, setActiveChip] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'duration'>('score');
  const [selectedClipIds, setSelectedClipIds] = useState<Set<string>>(new Set());
  const [isConfirmingBulkDelete, setIsConfirmingBulkDelete] = useState<boolean>(false);

  const filteredClips = getFilteredClips();

  // Apply sorting
  const sortedClips = [...filteredClips].sort((a, b) => {
    if (sortBy === 'score') {
      return b.virality.overallScore - a.virality.overallScore;
    }
    return a.duration - b.duration;
  });

  const handleChipClick = (chip: string, query: string) => {
    setActiveChip(chip);
    setFilterPrompt(query);
  };

  const handleToggleSelect = (clipId: string) => {
    setSelectedClipIds(prev => {
      const next = new Set(prev);
      if (next.has(clipId)) {
        next.delete(clipId);
      } else {
        next.add(clipId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedClipIds.size === sortedClips.length) {
      setSelectedClipIds(new Set());
    } else {
      setSelectedClipIds(new Set(sortedClips.map(c => c.id)));
    }
  };

  const handleDeleteSelected = () => {
    deleteSelectedClips(Array.from(selectedClipIds));
    setSelectedClipIds(new Set());
    setIsConfirmingBulkDelete(false);
  };

  const handleBatchDownload = () => {
    const clipsToDownload = sortedClips.filter(c => selectedClipIds.has(c.id));
    clipsToDownload.forEach((c, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = c.downloadUrl || `http://localhost:3001/api/clips/${c.id}/download`;
        link.setAttribute('download', `${c.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.mp4`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 400);
    });
  };

  if (!activeProject) {
    return (
      <div className="text-center py-24 space-y-4">
        <Film className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Active Stream Selected</h3>
        <p className="text-xs text-slate-400">Select a project in the Creator Studio to view viral clips</p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold"
        >
          Return to Studio
        </button>
      </div>
    );
  }

  const avgVirality = Math.round(
    activeProject.clips.reduce((sum, c) => sum + c.virality.overallScore, 0) / (activeProject.clips.length || 1)
  );

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Stream Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-purple/20 text-purple-300 border border-purple-500/30 uppercase font-semibold">
              Opus AI Virality Engine
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-brand-cyan" />
              Source Stream: {activeProject.durationFormatted}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
            {activeProject.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generated {activeProject.clipsCount} viral shorts ranked by algorithmic retention and emotional triggers
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-studio-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Clips Ready</div>
            <div className="text-lg font-black text-brand-emerald font-mono">
              {activeProject.clipsCount}
            </div>
          </div>

          <div className="bg-studio-900/80 p-3 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Virality</div>
            <div className="text-lg font-black text-brand-purple font-mono flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span>{avgVirality}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ClipAnything™ Multimodal Query Filter Bar */}
      <div className="glass-panel-elevated p-4 rounded-2xl border border-purple-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ClipAnything™ Search: e.g. 'Find moments where they talk about money', 'failure', 'funniest joke'..."
              value={activeFilterPrompt}
              onChange={(e) => setFilterPrompt(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-studio-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
            />
            {activeFilterPrompt && (
              <button
                onClick={() => setFilterPrompt('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-slate-500" />
              Sort:
            </span>
            <button
              onClick={() => setSortBy('score')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                sortBy === 'score'
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'bg-studio-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Virality (99 → 70)
            </button>
            <button
              onClick={() => setSortBy('duration')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                sortBy === 'duration'
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'bg-studio-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Shortest First
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-[11px] text-slate-500 font-medium">Quick Prompts:</span>
          {[
            { id: 'all', label: 'All Viral Clips', query: '' },
            { id: 'money', label: '💰 Money & Scaling', query: 'money' },
            { id: 'fail', label: '💀 Creator Failure', query: 'fail' },
            { id: 'math', label: '🧮 30x Math Flywheel', query: 'math' },
            { id: 'supernova', label: '⚡ Virality 90+', query: 'VIRAL SUPERNOVA' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => handleChipClick(chip.id, chip.query)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                activeChip === chip.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-studio-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Operations & Clip Selection Toolbar */}
      {sortedClips.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-studio-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              data-testid="select-all-clips-btn"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-studio-800 hover:bg-studio-700 text-slate-300 hover:text-white transition"
            >
              {selectedClipIds.size === sortedClips.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-brand-purple" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{selectedClipIds.size === sortedClips.length ? 'Deselect All' : 'Select All'}</span>
            </button>

            {selectedClipIds.size > 0 && (
              <span className="font-mono text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                {selectedClipIds.size} of {sortedClips.length} selected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedClipIds.size > 0 && (
              <>
                {isConfirmingBulkDelete ? (
                  <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-lg">
                    <span className="text-[11px] text-red-200 px-1 font-bold">Delete {selectedClipIds.size} clips?</span>
                    <button
                      onClick={handleDeleteSelected}
                      data-testid="confirm-bulk-delete-btn"
                      className="px-2 py-0.5 rounded bg-red-600 text-white text-[11px] font-bold"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setIsConfirmingBulkDelete(false)}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsConfirmingBulkDelete(true)}
                    data-testid="bulk-delete-btn"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected ({selectedClipIds.size})</span>
                  </button>
                )}

                <button
                  onClick={handleBatchDownload}
                  data-testid="bulk-download-btn"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Selected ({selectedClipIds.size})</span>
                </button>
              </>
            )}

            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              Duration strictly 60s–120s • {sortedClips.length} clips ready
            </span>
          </div>
        </div>
      )}

      {/* Ranked Clips List */}
      {sortedClips.length === 0 ? (
        <div className="text-center py-16 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <Search className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Clips Match Your Prompt</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try a different search prompt or reset filters to see all generated clips
          </p>
          <button
            onClick={() => {
              setFilterPrompt('');
              setActiveChip('all');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-studio-800 text-slate-200 text-xs font-medium border border-slate-700"
          >
            Reset ClipFilter
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedClips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onOpenStudio={onOpenStudio}
              isSelected={selectedClipIds.has(clip.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
