import React, { useState } from 'react';
import { useQuota } from '../../context/QuotaContext';
import { useVideoProjects } from '../../context/VideoProjectContext';
import { QuotaGauge } from '../common/QuotaGauge';
import { UploadModal } from './UploadModal';
import {
  Film,
  Sparkles,
  Play,
  Clock,
  CheckCircle,
  ExternalLink,
  Scissors,
  Flame,
  Plus,
  Loader2,
  HardDrive
} from 'lucide-react';

interface DashboardPageProps {
  onViewClips: () => void;
  onOpenStudio: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onViewClips,
  onOpenStudio
}) => {
  const { remainingMinutes } = useQuota();
  const {
    projects,
    activeProject,
    setActiveProject,
    isProcessingNew,
    processingProgress,
    processingStageText,
    createNewProjectFromInput
  } = useVideoProjects();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const handleStartProcessing = (
    title: string,
    durationMinutes: number,
    sourceType: 'local' | 'url',
    sourceUrl?: string,
    config?: any,
    thumbnailUrl?: string
  ) => {
    createNewProjectFromInput(title, durationMinutes, sourceType, sourceUrl, config, thumbnailUrl);
  };

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Live 24-Hour Quota Dashboard Tracker */}
      <section>
        <QuotaGauge />
      </section>

      {/* 2. Top Universal Video Ingestion Quick Bar */}
      <section className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Universal Ingestion Studio</h2>
            <p className="text-xs text-slate-400">
              Drag local files or paste YouTube, Twitch, Loom, Rumble, Zoom, Drive links
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Upload & Ingest Video</span>
        </button>
      </section>

      {/* 3. Active AI Neural Pipeline Banner (when processing) */}
      {isProcessingNew && (
        <section className="glass-panel-elevated p-6 rounded-2xl border border-purple-500/40 space-y-4 animate-pulse-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-white">Neural Repurposing Pipeline Active</h3>
                <p className="text-xs text-purple-300 font-mono">{processingStageText}</p>
              </div>
            </div>
            <span className="font-mono text-base font-black text-brand-emerald">
              {processingProgress}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-studio-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              style={{ width: `${processingProgress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-brand-purple via-indigo-500 to-brand-emerald transition-all duration-300"
            />
          </div>
        </section>
      )}

      {/* 4. Creator Projects Grid */}
      <section className="space-y-4">
        {/* Active Project Ready Banner */}
        {activeProject && !isProcessingNew && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl animate-fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-purple-500/30">
                <img src={activeProject.thumbnailUrl} alt={activeProject.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase mb-0.5">
                  <CheckCircle className="w-3 h-3" />
                  <span>Processing Complete • {activeProject.clipsCount} Viral Shorts Ready</span>
                </div>
                <h3 className="text-sm font-bold text-white truncate">{activeProject.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={onViewClips}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Flame className="w-3.5 h-3.5 text-yellow-300" />
                <span>View Viral Clips ({activeProject.clipsCount}) →</span>
              </button>
              <button
                onClick={onOpenStudio}
                className="px-3.5 py-2 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Scissors className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Studio</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-brand-purple" />
              <span>Creator Streams & Projects</span>
              <span className="text-xs font-mono text-slate-500">({projects.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Long-form streams repurposed into viral micro-assets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                className={`glass-card-interactive p-5 rounded-2xl border transition relative overflow-hidden flex flex-col justify-between ${
                  isSelected ? 'border-brand-purple/70 shadow-lg shadow-purple-500/15' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-studio-950">
                    <img
                      src={proj.thumbnailUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Duration Badge */}
                    <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-cyan" />
                      <span>{proj.durationFormatted}</span>
                    </div>

                    {/* Clips Count Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-brand-emerald/90 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3 text-yellow-300" />
                      <span>{proj.clipsCount} Viral Clips</span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <h3 className="font-display font-bold text-sm text-white line-clamp-1 mb-1">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span className="capitalize text-purple-300 font-medium">
                      Source: {proj.sourceType}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 font-mono">
                      Uploaded {new Date(proj.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      setActiveProject(proj);
                      onViewClips();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-purple/20 hover:bg-brand-purple/30 text-purple-200 border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Flame className="w-3.5 h-3.5 text-purple-400" />
                    <span>View Viral Clips ({proj.clipsCount})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveProject(proj);
                      if (proj.clips.length > 0) {
                        onOpenStudio();
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-studio-800 hover:bg-studio-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    title="Open Vizard Multi-Track Studio"
                  >
                    <Scissors className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>Studio</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onStartProcessing={handleStartProcessing}
        />
      )}
    </div>
  );
};
