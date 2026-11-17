import React from 'react';
import { TranscriptWord } from '../../types';
import { Scissors, Trash2, RotateCcw, Sparkles } from 'lucide-react';

interface TranscriptPanelProps {
  words: TranscriptWord[];
  currentTime: number;
  onSeek: (time: number) => void;
  onToggleWordDeleted: (wordId: string) => void;
  onRemoveFillers: () => void;
  onRemoveSilences: () => void;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  words,
  currentTime,
  onSeek,
  onToggleWordDeleted,
  onRemoveFillers,
  onRemoveSilences
}) => {
  const fillerCount = words.filter(w => w.isFiller && !w.isDeleted).length;
  const deletedCount = words.filter(w => w.isDeleted).length;

  return (
    <div className="flex flex-col h-full bg-studio-950 border-r border-slate-800 text-xs">
      {/* Panel Header */}
      <div className="p-3 sm:p-4 border-b border-slate-800 shrink-0 space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-emerald/20 text-brand-emerald border border-emerald-500/30">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xs sm:text-sm">Edit-by-Transcript</h3>
              <p className="text-[10px] text-slate-400">Doc-Style Precision Video Editor</p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-studio-900 text-slate-300 border border-slate-800">
            {words.length} words
          </span>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onRemoveFillers}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-medium transition active:scale-95"
            title="Auto-cut 'um', 'uh', 'like' from the video"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Cut Fillers ({fillerCount})</span>
          </button>

          <button
            onClick={onRemoveSilences}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-studio-900 hover:bg-studio-800 text-slate-200 border border-slate-700 font-medium transition active:scale-95"
            title="Automatically trim pauses > 0.8s"
          >
            <Scissors className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Trim Silences</span>
          </button>
        </div>

        {deletedCount > 0 && (
          <div className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 flex items-center justify-between animate-fade-in">
            <span>{deletedCount} word(s) cut from video</span>
            <span className="font-mono text-slate-400">Frames muted</span>
          </div>
        )}
      </div>

      {/* Transcript Words Stream with Edge Scroll Fade Mask */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-fade-y">
        {/* Render grouped by speaker */}
        {['Speaker 1', 'Speaker 2'].map(speakerName => {
          const speakerWords = words.filter(w => w.speaker === speakerName);
          if (speakerWords.length === 0) return null;

          return (
            <div key={speakerName} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${speakerName === 'Speaker 1' ? 'bg-brand-purple' : 'bg-brand-cyan'}`} />
                <span className="text-[11px] font-bold text-slate-300 font-mono">
                  {speakerName === 'Speaker 1' ? 'Speaker 1 (Host)' : 'Speaker 2 (Guest)'}
                </span>
              </div>

              <div className="leading-relaxed flex flex-wrap gap-1.5 bg-studio-900/50 p-3 rounded-xl border border-slate-800/80">
                {speakerWords.map(word => {
                  const isActive = !word.isDeleted && currentTime >= word.start && currentTime <= word.end;
                  const isDeleted = word.isDeleted;

                  return (
                    <span
                      key={word.id}
                      onClick={() => onSeek(word.start)}
                      onDoubleClick={() => onToggleWordDeleted(word.id)}
                      className={`cursor-pointer px-1.5 py-0.5 rounded transition-all duration-200 select-none group relative inline-flex items-center gap-0.5 ${
                        isDeleted
                          ? 'line-through text-red-400/60 bg-red-950/30 border border-red-900/40'
                          : isActive
                          ? 'bg-brand-purple text-white font-bold scale-105 shadow-md shadow-purple-500/30 ring-1 ring-purple-300'
                          : word.isFiller
                          ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          : 'text-slate-200 hover:bg-studio-800 hover:text-white'
                      }`}
                      title={`Click to seek (${word.start.toFixed(1)}s) • Double-click to ${isDeleted ? 'restore' : 'cut'}`}
                    >
                      <span>{word.text}</span>
                      {word.emoji && <span className="text-xs">{word.emoji}</span>}

                      {/* Micro Cut Button on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWordDeleted(word.id);
                        }}
                        className="hidden group-hover:inline-block ml-0.5 text-slate-400 hover:text-red-400 transition"
                      >
                        {isDeleted ? <RotateCcw className="w-2.5 h-2.5" /> : <Trash2 className="w-2.5 h-2.5" />}
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-studio-900/80 border-t border-slate-800 text-[10px] text-slate-500 shrink-0">
        💡 Double-click any word or click delete to remove it from the final video render.
      </div>
    </div>
  );
};
