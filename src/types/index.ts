export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';

export type CaptionPreset = 'hormozi' | 'mrbeast' | 'iman' | 'minimalist';

export type SpeakerMode = 'single' | 'split-top-bottom' | 'grid' | 'pip';

export interface UploadRecord {
  id: string;
  filename: string;
  durationMinutes: number;
  fileSizeBytes?: number;
  uploadedAt: number; // unix timestamp in ms
  source: 'local' | 'youtube' | 'twitch' | 'rumble' | 'loom' | 'zoom' | 'gdrive' | 'vimeo' | 'podcast';
  sourceUrl?: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface QuotaState {
  totalCapacityMinutes: number; // 480 (8 hours)
  maxSingleVideoMinutes: number; // 240 (4 hours)
  records: UploadRecord[];
  simulatedTimeOffsetMs: number; // for developer fast-forward testing
}

export interface ViralityBreakdown {
  overallScore: number; // 0 - 100
  tier: 'VIRAL SUPERNOVA' | 'HIGH REACH' | 'SOLID ENGAGEMENT' | 'NICHE';
  hookStrength: number; // 0 - 100 (first 3s spike)
  pacingScore: number; // 0 - 100 (cadence & scene cuts)
  emotionalPeak: number; // 0 - 100 (sentiment & vocal energy)
  retentionProbability: number; // 0 - 100 (% predicted completion)
  rationale: string;
  keyTopics: string[];
}

export interface TranscriptWord {
  id: string;
  text: string;
  start: number; // seconds (e.g. 0.45)
  end: number;   // seconds (e.g. 0.85)
  speaker: string; // 'Speaker 1' | 'Speaker 2'
  isFiller?: boolean; // 'um', 'uh', 'like', 'you know'
  isDeleted?: boolean; // edited out by user in doc-style editor
  highlightColor?: string; // custom emphasis color
  emoji?: string; // injected emoji
}

export interface SocialCaptions {
  tiktok: string;
  instagramReels: string;
  youtubeShorts: string;
  linkedin: string;
  hashtags: string[];
}

export interface BRollTrigger {
  id: string;
  start: number;
  end: number;
  keyword: string;
  previewUrl: string;
  enabled: boolean;
}

export interface ViralClip {
  id: string;
  projectId: string;
  title: string;
  hookTitle: string; // On-screen header banner e.g. "WAIT TILL THE END 😱"
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  virality: ViralityBreakdown;
  socialCaptions: SocialCaptions;
  words: TranscriptWord[];
  bRollTracks: BRollTrigger[];
  aspectRatio: AspectRatio;
  captionPreset: CaptionPreset;
  speakerMode: SpeakerMode;
  previewThumbnail: string;
  videoUrl?: string;
  targetPlatform: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  sourceType: 'local' | 'url';
  sourceUrl?: string;
  durationMinutes: number;
  durationFormatted: string;
  thumbnailUrl: string;
  uploadedAt: number;
  status: 'queued' | 'extracting_audio' | 'transcribing_whisper' | 'detecting_scenes' | 'ranking_virality' | 'completed' | 'error';
  progress: number; // 0 - 100
  clipsCount: number;
  clips: ViralClip[];
  rawTranscript: TranscriptWord[];
}

export interface AIProcessingConfig {
  targetClipDuration: '<30s' | '30-60s' | '60-90s' | '3m';
  aspectRatio: AspectRatio;
  captionPreset: CaptionPreset;
  clipAnythingPrompt: string; // Multimodal search prompt
  autoEmojis: boolean;
  removeFillers: boolean;
  highlightKeywords: boolean;
}
