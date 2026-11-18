import React, { createContext, useContext, useState } from 'react';
import {
  VideoProject,
  ViralClip,
  TranscriptWord,
  AspectRatio,
  SpeakerMode,
  AIProcessingConfig,
  AutoZoomConfig,
  EmojiConfig,
  AutoBRollConfig,
  VideoLanguage
} from '../types';
import { INITIAL_PROJECTS, SAMPLE_CLIPS, SAMPLE_PODCAST_WORDS } from '../data/sampleProjects';
import { filterClipsByPrompt } from '../utils/viralityScorer';
import { extractYouTubeId } from '../utils/youtubeHelper';
import { generateTranscriptForDuration } from '../data/multilingualTranscripts';

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
    config?: Partial<AIProcessingConfig>,
    customThumbnailUrl?: string
  ) => Promise<VideoProject>;
  updateClipWords: (clipId: string, updatedWords: TranscriptWord[]) => void;
  toggleWordDeleted: (clipId: string, wordId: string) => void;
  removeFillerWordsFromClip: (clipId: string) => void;
  removeSilencesFromClip: (clipId: string) => void;
  updateClipCaptionTemplate: (clipId: string, templateId: string) => void;
  updateClipAspectRatio: (clipId: string, ratio: AspectRatio) => void;
  updateClipSpeakerMode: (clipId: string, mode: SpeakerMode) => void;
  updateClipHookTitle: (clipId: string, newHook: string) => void;
  updateClipLanguage: (clipId: string, language: VideoLanguage) => void;
  updateClipAutoZoom: (clipId: string, zoom: Partial<AutoZoomConfig>) => void;
  updateClipEmojiConfig: (clipId: string, emojis: Partial<EmojiConfig>) => void;
  updateClipBRollConfig: (clipId: string, broll: Partial<AutoBRollConfig>) => void;
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
    config?: Partial<AIProcessingConfig>,
    customThumbnailUrl?: string
  ): Promise<VideoProject> => {
    setIsProcessingNew(true);
    setProcessingProgress(5);
    setProcessingStageText('Ingesting Media & Initializing Neural Pipeline...');

    const stages = [
      { progress: 25, text: 'Stage 1/5: Extracting Audio & Enhancing Dialogue with AI Denoising...' },
      { progress: 50, text: 'Stage 2/5: Whisper AI Large-v3 Generating Word-Level Timestamps...' },
      { progress: 72, text: 'Stage 3/5: Computer Vision Face Tracking & Multi-Speaker Detection...' },
      { progress: 88, text: 'Stage 4/5: Opus Virality Score™ Ranking Hooks & Retention Curves...' },
      { progress: 98, text: 'Stage 5/5: Auto-Generating 35+ Style Captions, AI Emojis & B-Roll...' },
    ];

    for (const stage of stages) {
      await new Promise((r) => setTimeout(r, 550));
      setProcessingProgress(stage.progress);
      setProcessingStageText(stage.text);
    }

    const newProjectId = `proj-${Date.now()}`;
    const ytId = sourceUrl ? extractYouTubeId(sourceUrl) : null;
    const finalThumb = customThumbnailUrl || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=80');
    const selectedLang = config?.language || 'hinglish';
    const cleanTitle = title || (ytId ? 'YouTube Viral Repurposed Stream' : 'New Repurposed Studio Stream');

    // Dynamic Duration mapping: honoring <30s, 30-60s, 60-90s, 3m
    const targetDurations =
      config?.targetClipDuration === '<30s'
        ? [24.5, 18.2, 28.0, 21.6]
        : config?.targetClipDuration === '60-90s'
        ? [75.2, 68.4, 86.0, 72.8]
        : config?.targetClipDuration === '3m'
        ? [145.0, 162.0, 138.0, 175.0]
        : [54.8, 48.2, 58.4, 46.5]; // 30-60s (Average ~52 seconds)

    // Tailored viral hooks & titles
    const isMunkar = cleanTitle.toLowerCase().includes('munkar') || (sourceUrl && sourceUrl.includes('iq9CN_xwmZo'));
    const customHookTitles = isMunkar
      ? ['TERRIFYING CLIMAX 😱', 'WHAT ACTUALLY HAPPENED? 💀', 'WAIT FOR IT 🔥', 'MIND-BLOWING TWIST 🤯']
      : selectedLang === 'hindi'
      ? ['सफलता का रहस्य ⚡', '९९% लोग यहाँ गलती करते हैं 💀', 'हर दिन ये करो 🔥', 'असली सच जानो 🚀']
      : selectedLang === 'hinglish'
      ? ['YE SECRET JAAN LO ⚡', '99% LOG QUIT KARTE HAIN 💀', 'DAILY YE RULE FOLLOW KARO 🔥', 'REAL TRUTH REVEALED 🚀']
      : ['KEY VIRAL MOMENT ⚡', 'UNBELIEVABLE INSIGHT 💡', 'BEST 60 SECONDS 🔥', 'MINDSET SHIFT 🚀'];

    const customClipTitles = isMunkar
      ? [
          `${cleanTitle} — Terrifying Climax & The Twist Ending Revealed`,
          `The Dark Secret Behind the Boarding School Incident`,
          `Why This Horror Scene Went Viral on TikTok (10M Views)`,
          `Full Ending Breakdown & Hidden Clues Explained`
        ]
      : selectedLang === 'hindi'
      ? [
          `${cleanTitle} — सफलता का सबसे बड़ा रहस्य और नियम`,
          `क्यों ९९% लोग शुरुआत में ही हिम्मत हार जाते हैं?`,
          `डेली कंसिस्टेंसी से कैसे १००x रिजल्ट मिलता है`,
          `सफलता की असली कुंजी: वो सच जो कोई नहीं बताता`
        ]
      : selectedLang === 'hinglish'
      ? [
          `${cleanTitle} — 100x Growth Ka Secret Blueprint`,
          `Kyun 99% Creators Pehle 30 Days Me Quit Kar Dete Hain?`,
          `Consistency Hi Tumhara Sabse Bada Superpower Hai`,
          `Real Truth: Ek Stream Se 30 Viral Shorts Kaise Banayein`
        ]
      : [
          `${cleanTitle} — High-Retention Opening Hook`,
          `${cleanTitle} — Crucial Decision & Turning Point`,
          `${cleanTitle} — Emotional Climax & High Energy`,
          `${cleanTitle} — Unfiltered Truth & Core Takeaway`
        ];

    const generatedClips: ViralClip[] = SAMPLE_CLIPS.map((clip, idx) => {
      const clipDuration = targetDurations[idx] || 52.0;
      const dynamicWords = generateTranscriptForDuration(clipDuration, selectedLang);

      return {
        ...clip,
        id: `clip-${newProjectId}-${idx + 1}`,
        projectId: newProjectId,
        title: customClipTitles[idx] || `${cleanTitle} — Clip #${idx + 1}`,
        hookTitle: customHookTitles[idx] || clip.hookTitle,
        duration: clipDuration,
        startTime: 0,
        endTime: clipDuration,
        words: dynamicWords,
        language: selectedLang,
        speakerMode: 'single', // Clean 9:16 single-frame playback (no stock photo splits!)
        previewThumbnail: finalThumb,
        youtubeId: ytId || undefined,
        videoUrl: ytId ? undefined : clip.videoUrl,
        captionTemplateId: config?.captionTemplateId || 'hormozi-yellow',
        aspectRatio: config?.aspectRatio || '9:16',
        autoZoom: config?.autoZoom || clip.autoZoom,
        emojiConfig: config?.emojiConfig || clip.emojiConfig,
        bRollConfig: config?.autoBRoll || clip.bRollConfig
      };
    });

    const newProject: VideoProject = {
      id: newProjectId,
      title: cleanTitle,
      sourceType,
      sourceUrl,
      youtubeId: ytId || undefined,
      language: selectedLang,
      durationMinutes,
      durationFormatted: `${durationMinutes}m 00s`,
      thumbnailUrl: finalThumb,
      uploadedAt: Date.now(),
      status: 'completed',
      progress: 100,
      clipsCount: generatedClips.length,
      clips: generatedClips,
      rawTranscript: generatedClips[0].words
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    setIsProcessingNew(false);
    setProcessingProgress(100);
    setProcessingStageText('Processing Complete!');

    return newProject;
  };

  const updateClipWords = (clipId: string, updatedWords: TranscriptWord[]) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => (clip.id === clipId ? { ...clip, words: updatedWords } : clip))
      }))
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

  const updateClipLanguage = (clipId: string, language: VideoLanguage) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => {
          if (clip.id === clipId) {
            const newWords = generateTranscriptForDuration(clip.duration, language);
            return { ...clip, language, words: newWords };
          }
          return clip;
        })
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      const newWords = generateTranscriptForDuration(selectedClip.duration, language);
      setSelectedClip(prev => (prev ? { ...prev, language, words: newWords } : null));
    }
  };

  const updateClipCaptionTemplate = (clipId: string, templateId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip => (clip.id === clipId ? { ...clip, captionTemplateId: templateId } : clip))
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev => (prev ? { ...prev, captionTemplateId: templateId } : null));
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

  const updateClipAutoZoom = (clipId: string, zoom: Partial<AutoZoomConfig>) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip =>
          clip.id === clipId ? { ...clip, autoZoom: { ...clip.autoZoom, ...zoom } } : clip
        )
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev =>
        prev ? { ...prev, autoZoom: { ...prev.autoZoom, ...zoom } } : null
      );
    }
  };

  const updateClipEmojiConfig = (clipId: string, emojis: Partial<EmojiConfig>) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip =>
          clip.id === clipId ? { ...clip, emojiConfig: { ...clip.emojiConfig, ...emojis } } : clip
        )
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev =>
        prev ? { ...prev, emojiConfig: { ...prev.emojiConfig, ...emojis } } : null
      );
    }
  };

  const updateClipBRollConfig = (clipId: string, broll: Partial<AutoBRollConfig>) => {
    setProjects(prevProjects =>
      prevProjects.map(proj => ({
        ...proj,
        clips: proj.clips.map(clip =>
          clip.id === clipId ? { ...clip, bRollConfig: { ...clip.bRollConfig, ...broll } } : clip
        )
      }))
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip(prev =>
        prev ? { ...prev, bRollConfig: { ...prev.bRollConfig, ...broll } } : null
      );
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
        updateClipCaptionTemplate,
        updateClipAspectRatio,
        updateClipSpeakerMode,
        updateClipHookTitle,
        updateClipLanguage,
        updateClipAutoZoom,
        updateClipEmojiConfig,
        updateClipBRollConfig,
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
