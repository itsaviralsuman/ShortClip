import React, { createContext, useContext, useState } from 'react';
import {
  VideoProject,
  ViralClip,
  TranscriptWord,
  AspectRatio,
  CaptionPreset,
  SpeakerMode,
  AIProcessingConfig
} from '../types';
import { INITIAL_PROJECTS, SAMPLE_CLIPS, SAMPLE_PODCAST_WORDS } from '../data/sampleProjects';
import { filterClipsByPrompt } from '../utils/viralityScorer';

interface VideoProjectContextType {
  projects: VideoProject[];
  activeProject: VideoProject | null;
  selectedClip: ViralClip | null;
  activeFilterPrompt: string;
  isProcessingNew: boolean;
  processingProgress: number;
  processingStageText: string;
  isEditorOpen: boolean;
  setActiveProject: (project: VideoProject) => void;
  setSelectedClip: (clip: ViralClip | null) => void;
  openEditorForClip: (clip: ViralClip) => void;
  closeEditor: () => void;
  setFilterPrompt: (prompt: string) => void;
  createNewProjectFromInput: (
    title: string,
    durationMinutes: number,
    sourceType: 'local' | 'url',
    sourceUrl?: string,
    config?: Partial<AIProcessingConfig>
  ) => Promise<VideoProject>;
  updateClipWords: (clipId: string, updatedWords: TranscriptWord[]) => void;
  toggleWordDeleted: (clipId: string, wordId: string) => void;
  removeFillerWordsFromClip: (clipId: string) => void;
  removeSilencesFromClip: (clipId: string) => void;
  updateClipCaptionPreset: (clipId: string, preset: CaptionPreset) => void;
  updateClipAspectRatio: (clipId: string, ratio: AspectRatio) => void;
  updateClipSpeakerMode: (clipId: string, mode: SpeakerMode) => void;
  updateClipHookTitle: (clipId: string, newHook: string) => void;
  getFilteredClips: () => ViralClip[];
}

const VideoProjectContext = createContext<VideoProjectContextType | undefined>(undefined);

export const VideoProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<VideoProject[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<VideoProject | null>(INITIAL_PROJECTS[0]);
  const [selectedClip, setSelectedClip] = useState<ViralClip | null>(null);
  const [activeFilterPrompt, setActiveFilterPrompt] = useState<string>('');
  const [isProcessingNew, setIsProcessingNew] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [processingStageText, setProcessingStageText] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  const openEditorForClip = (clip: ViralClip) => {
    setSelectedClip(clip);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const setFilterPrompt = (prompt: string) => {
    setActiveFilterPrompt(prompt);
  };

  const getFilteredClips = (): ViralClip[] => {
    if (!activeProject) return [];
    return filterClipsByPrompt(activeProject.clips, activeFilterPrompt);
  };

  const createNewProjectFromInput = async (
    title: string,
    durationMinutes: number,
    sourceType: 'local' | 'url',
    sourceUrl?: string,
    config?: Partial<AIProcessingConfig>
  ): Promise<VideoProject> => {
    setIsProcessingNew(true);
    setProcessingProgress(5);
    setProcessingStageText('Ingesting Media & Initializing Neural Pipeline...');

    // Simulate multi-stage AI extraction
    const stages = [
      { progress: 25, text: 'Stage 1/5: Extracting Audio & Enhancing Dialogue with AI Denoising...' },
      { progress: 50, text: 'Stage 2/5: Whisper AI Large-v3 Generating Word-Level Timestamps...' },
      { progress: 72, text: 'Stage 3/5: Computer Vision Face Tracking & Multi-Speaker Detection...' },
      { progress: 88, text: 'Stage 4/5: Opus Virality Score™ Ranking Hooks & Retention Curves...' },
      { progress: 98, text: 'Stage 5/5: Auto-Generating Hormozi Captions, B-Roll & Social Meta...' },
    ];

    for (const stage of stages) {
      await new Promise(r => setTimeout(r, 600));
      setProcessingProgress(stage.progress);
      setProcessingStageText(stage.text);
    }

    const newProjectId = `proj-${Date.now()}`;
    const generatedClips: ViralClip[] = SAMPLE_CLIPS.map((clip, idx) => ({
      ...clip,
      id: `clip-${newProjectId}-${idx + 1}`,
      projectId: newProjectId,
      captionPreset: config?.captionPreset || 'hormozi',
      aspectRatio: config?.aspectRatio || '9:16',
    }));

    const newProject: VideoProject = {
      id: newProjectId,
      title: title || 'New Repurposed Studio Stream',
      sourceType,
      sourceUrl,
      durationMinutes,
      durationFormatted: `${durationMinutes}m 00s`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=80',
      uploadedAt: Date.now(),
      status: 'completed',
      progress: 100,
      clipsCount: generatedClips.length,
      clips: generatedClips,
      rawTranscript: SAMPLE_PODCAST_WORDS
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProject(newProject);
    setIsProcessingNew(false);
    setProcessingProgress(100);
    setProcessingStageText('Processing Complete!');

    return newProject;
  };

  const updateClipWords = (clipId: string, updatedWords: TranscriptWord[]) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => {
        const updatedClips = proj.clips.map(clip => {
          if (clip.id === clipId) {
            return { ...clip, words: updatedWords };
          }
          return clip;
        });
        return { ...proj, clips: updatedClips };
      })
    );

    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev => (prev ? { ...prev, words: updatedWords } : null));
    }
  };

  const toggleWordDeleted = (clipId: string, wordId: string) => {
    if (!selectedClip || selectedClip.id !== clipId) return;
    const newWords = selectedClip.words.map(w =>
      w.id === wordId ? { ...w, isDeleted: !w.isDeleted } : w
    );
    updateClipWords(clipId, newWords);
  };

  const removeFillerWordsFromClip = (clipId: string) => {
    if (!selectedClip || selectedClip.id !== clipId) return;
    const newWords = selectedClip.words.map(w =>
      w.isFiller ? { ...w, isDeleted: true } : w
    );
    updateClipWords(clipId, newWords);
  };

  const removeSilencesFromClip = (clipId: string) => {
    if (!selectedClip || selectedClip.id !== clipId) return;
    // Compress gaps greater than 0.8s between words
    let accumulatedCut = 0;
    const newWords = selectedClip.words.map((w, index) => {
      if (index > 0) {
        const prevEnd = selectedClip.words[index - 1].end;
        const gap = w.start - prevEnd;
        if (gap > 0.8) {
          accumulatedCut += (gap - 0.2);
        }
      }
      return {
        ...w,
        start: Math.max(0, w.start - accumulatedCut),
        end: Math.max(0.1, w.end - accumulatedCut)
      };
    });
    updateClipWords(clipId, newWords);
  };

  const updateClipCaptionPreset = (clipId: string, preset: CaptionPreset) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => (clip.id === clipId ? { ...clip, captionPreset: preset } : clip))
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev => (prev ? { ...prev, captionPreset: preset } : null));
    }
  };

  const updateClipAspectRatio = (clipId: string, ratio: AspectRatio) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => (clip.id === clipId ? { ...clip, aspectRatio: ratio } : clip))
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev => (prev ? { ...prev, aspectRatio: ratio } : null));
    }
  };

  const updateClipSpeakerMode = (clipId: string, mode: SpeakerMode) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => (clip.id === clipId ? { ...clip, speakerMode: mode } : clip))
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev => (prev ? { ...prev, speakerMode: mode } : null));
    }
  };

  const updateClipHookTitle = (clipId: string, newHook: string) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => (clip.id === clipId ? { ...clip, hookTitle: newHook } : clip))
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev => (prev ? { ...prev, hookTitle: newHook } : null));
    }
  };

  return (
    <VideoProjectContext.Provider
      value={{
        projects,
        activeProject,
        selectedClip,
        activeFilterPrompt,
        isProcessingNew,
        processingProgress,
        processingStageText,
        isEditorOpen,
        setActiveProject,
        setSelectedClip,
        openEditorForClip,
        closeEditor,
        setFilterPrompt,
        createNewProjectFromInput,
        updateClipWords,
        toggleWordDeleted,
        removeFillerWordsFromClip,
        removeSilencesFromClip,
        updateClipCaptionPreset,
        updateClipAspectRatio,
        updateClipSpeakerMode,
        updateClipHookTitle,
        getFilteredClips
      }}
    >
      {children}
    </VideoProjectContext.Provider>
  );
};

export const useVideoProjects = (): VideoProjectContextType => {
  const context = useContext(VideoProjectContext);
  if (!context) {
    throw new Error('useVideoProjects must be used within a VideoProjectProvider');
  }
  return context;
};
