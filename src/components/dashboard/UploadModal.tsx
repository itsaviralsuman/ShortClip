import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Link as LinkIcon,
  Video,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  FileVideo,
  Sparkles
} from 'lucide-react';
import { useQuota } from '../../context/QuotaContext';
import { MAX_SINGLE_VIDEO_MINUTES } from '../../utils/quotaEngine';
import { ConfigModal } from './ConfigModal';
import { AIProcessingConfig } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartProcessing: (
    title: string,
    durationMinutes: number,
    sourceType: 'local' | 'url',
    sourceUrl?: string,
    config?: Partial<AIProcessingConfig>
  ) => void;
  initialUrl?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onStartProcessing,
  initialUrl = ''
}) => {
  const { remainingMinutes, addUpload, countdownFormatted } = useQuota();

  const [activeTab, setActiveTab] = useState<'url' | 'local'>(initialUrl ? 'url' : 'local');
  const [videoUrl, setVideoUrl] = useState<string>(initialUrl);
  const [urlTitle, setUrlTitle] = useState<string>('Founder Scale & AI Systems Stream');
  const [urlDuration, setUrlDuration] = useState<number>(60); // minutes

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localFileDuration, setLocalFileDuration] = useState<number | null>(null);
  const [isProbingDuration, setIsProbingDuration] = useState<boolean>(false);

  // AI Configuration Modal state
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [pendingUploadData, setPendingUploadData] = useState<{
    title: string;
    duration: number;
    sourceType: 'local' | 'url';
    sourceUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real HTML5 Video duration probe for local files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProbingDuration(true);

    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    const objectUrl = URL.createObjectURL(file);

    videoEl.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const minutes = Math.max(1, Math.round(videoEl.duration / 60));
      setLocalFileDuration(minutes);
      setIsProbingDuration(false);
    };

    videoEl.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback: estimate based on size ~ 20MB per minute
      const estimatedMinutes = Math.min(240, Math.max(5, Math.round(file.size / (1024 * 1024 * 25))));
      setLocalFileDuration(estimatedMinutes);
      setIsProbingDuration(false);
    };

    videoEl.src = objectUrl;
  };

  const currentDuration = activeTab === 'local' ? (localFileDuration || 60) : urlDuration;
  const currentTitle = activeTab === 'local' ? (selectedFile?.name || 'Local Video Upload') : (urlTitle || 'Ingested Stream');

  // Pre-flight check
  const exceedsSingleLimit = currentDuration > MAX_SINGLE_VIDEO_MINUTES;
  const exceedsRollingQuota = currentDuration > remainingMinutes;
  const isUploadBlocked = exceedsSingleLimit || exceedsRollingQuota;

  const handleProceedToConfig = () => {
    if (isUploadBlocked) return;

    setPendingUploadData({
      title: currentTitle,
      duration: currentDuration,
      sourceType: activeTab,
      sourceUrl: activeTab === 'url' ? videoUrl : undefined
    });
    setIsConfigOpen(true);
  };

  const handleConfigConfirmed = (config: AIProcessingConfig) => {
    if (!pendingUploadData) return;

    // Record upload in 24-hour quota engine
    const quotaResult = addUpload({
      filename: pendingUploadData.title,
      durationMinutes: pendingUploadData.duration,
      source: pendingUploadData.sourceType === 'local' ? 'local' : 'youtube',
      sourceUrl: pendingUploadData.sourceUrl,
      status: 'completed'
    });

    if (!quotaResult.allowed) {
      alert(quotaResult.message);
      return;
    }

    setIsConfigOpen(false);
    onClose();

    // Trigger full project creation pipeline
    onStartProcessing(
      pendingUploadData.title,
      pendingUploadData.duration,
      pendingUploadData.sourceType,
      pendingUploadData.sourceUrl,
      config
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-xl rounded-2xl glass-panel-elevated border border-purple-500/40 p-6 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-purple/20 text-brand-purple border border-purple-500/30">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Universal Video Ingestion</h3>
                <p className="text-xs text-slate-400">Strict 24-Hour Rolling Quota Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-studio-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-studio-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('local')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'local'
                  ? 'bg-brand-purple text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Direct File Upload</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'url'
                  ? 'bg-brand-purple text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Universal URL Ingestion</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="mt-5 space-y-4">
            {activeTab === 'local' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-brand-purple/60 bg-studio-950/80 cursor-pointer text-center space-y-3 transition group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/avi"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-full bg-studio-800 border border-slate-700 text-brand-purple mx-auto flex items-center justify-center group-hover:scale-110 transition duration-200">
                  <FileVideo className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                    <p className="text-xs text-purple-300 font-mono mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB •{' '}
                      {isProbingDuration ? 'Probing duration...' : `${localFileDuration} minutes`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Click to choose video or drag and drop
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports MP4, MOV, MKV, WebM, AVI (Up to 4 Hours / 240 mins)
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="YouTube, Twitch, Rumble, Loom, Zoom, Drive, Vimeo..."
                    className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-brand-purple outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Stream Title
                  </label>
                  <input
                    type="text"
                    value={urlTitle}
                    onChange={(e) => setUrlTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-studio-950 border border-slate-700 text-xs text-white focus:border-brand-purple outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Video Duration (Minutes)
                    </label>
                    <span className="font-mono text-xs text-brand-cyan font-bold">
                      {urlDuration} mins ({Math.floor(urlDuration / 60)}h {urlDuration % 60}m)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="300"
                    step="15"
                    value={urlDuration}
                    onChange={(e) => setUrlDuration(parseInt(e.target.value))}
                    className="w-full accent-brand-purple cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>15m</span>
                    <span>60m (1h)</span>
                    <span>120m (2h)</span>
                    <span>240m (4h Max)</span>
                    <span className="text-red-400">300m (Over Limit)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Quota Pre-Flight Check Box */}
            <div className="p-3.5 rounded-xl bg-studio-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Remaining in 24h Window:</span>
                <span className="font-mono font-bold text-brand-emerald">
                  {remainingMinutes} mins / 480 mins
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">This Video Duration:</span>
                <span className="font-mono font-bold text-purple-300">
                  {currentDuration} mins
                </span>
              </div>

              {/* Status Indicator */}
              {exceedsSingleLimit ? (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs mt-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Blocked:</strong> Exceeds single video limit of 240 mins (4 Hours). Please trim the file before repurposing.
                  </div>
                </div>
              ) : exceedsRollingQuota ? (
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs mt-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Quota Reached:</strong> Needs {currentDuration} mins, but only {remainingMinutes} mins remain. Quota resets in <span className="font-mono font-bold">{countdownFormatted}</span>.
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs mt-2">
                  <CheckCircle className="w-4 h-4 text-brand-emerald shrink-0" />
                  <span>Quota Check Passed! Video fits inside your 24-hour limit.</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              disabled={isUploadBlocked}
              onClick={handleProceedToConfig}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition ${
                isUploadBlocked
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-purple-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Configure AI & Repurpose</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Processing Configuration Modal */}
      {isConfigOpen && (
        <ConfigModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          onConfirm={handleConfigConfirmed}
          videoTitle={currentTitle}
          videoDurationMinutes={currentDuration}
        />
      )}
    </>
  );
};
