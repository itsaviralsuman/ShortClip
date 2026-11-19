export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';

export type SpeakerMode = 'single' | 'split-top-bottom' | 'grid' | 'pip';

export interface CaptionTemplate {
  id: string;
  name: string;
  category: 'Creator Styles' | 'Kinetic & Animated' | 'Minimalist Subtitles' | 'Broadcast & Social';
  creatorTag?: string;
  fontFamily: string;
  fontSize: string;
  textColor: string;
  activeWordColor: string;
  backgroundColor?: string;
  textShadow: string;
  animationClass: string;
  textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  sampleText: string;
  emojiPack: string;
  badge: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'Creator Free' | 'Creator Pro' | 'Agency Enterprise';
  signedIn: boolean;
  memberSince: string;
}

export interface EmailSecurityNotification {
  id: string;
  toEmail: string;
  userName: string;
  subject: string;
  timestamp: number;
  deviceInfo: string;
  browser: string;
  ipAddress: string;
  method: 'Email OTP Verification' | 'Direct Email Auth' | 'Google OAuth 2.0' | 'GitHub OAuth';
  status: 'delivered';
  read: boolean;
}

export interface ActiveDeviceSession {
  deviceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  deviceName: string;
  browser: string;
  lastActive: number;
  ipAddress: string;
  isCurrentDevice: boolean;
}

export type CaptionChunkMode = 'karaoke_phrase' | 'single_punch' | 'stacked_lines';

export type VideoLanguage = 'hindi' | 'english' | 'hinglish';

export interface AutoZoomConfig {
  enabled: boolean;
  energy: 'subtle' | 'dynamic' | 'high_energy';
  zoomScale: number; // 1.08, 1.15, 1.25
  speed: 'smooth' | 'punchy';
}

export interface EmojiConfig {
  enabled: boolean;
  density: 'low' | 'medium' | 'high'; // low (key words), medium, high (almost every phrase)
  animation: 'bounce' | 'pop' | 'pulse' | 'float';
  position: 'above' | 'inline';
  pack: 'viral_fire' | 'money_crypto' | 'growth_tech' | 'comedy_memes';
}

export interface AutoBRollConfig {
  enabled: boolean;
  frequency: 'conservative' | 'balanced' | 'aggressive'; // 8s, 5s, 3s
  source: 'ai_stock' | 'motion_graphics' | 'cinematic' | 'reactions';
  kenBurnsTransition: boolean;
}

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
  simulatedTimeOffsetMs: number;
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
  start: number; // seconds (e.g. 0.45) - clip-local timestamp (starts at 0)
  end: number;   // seconds (e.g. 0.85) - clip-local timestamp
  sourceStart?: number; // absolute source video timeline start
  sourceEnd?: number;   // absolute source video timeline end
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
  hashtags?: string[];
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
  captionTemplateId: string; // One of the 35 OpusClip styles
  captionChunkMode?: CaptionChunkMode; // Opus phrase karaoke vs single punch
  customHighlightColor?: string; // Optional custom active word highlight
  language?: VideoLanguage;
  speakerMode: SpeakerMode;
  autoZoom: AutoZoomConfig;
  emojiConfig: EmojiConfig;
  bRollConfig: AutoBRollConfig;
  previewThumbnail: string;
  videoUrl?: string;
  downloadUrl?: string;
  renderedFile?: string | null;
  youtubeId?: string;
  targetPlatform: string[];
}

export interface VideoProject {
  id: string;
  title: string;
  sourceType: 'local' | 'url';
  sourceUrl?: string;
  youtubeId?: string;
  language?: VideoLanguage;
  durationMinutes: number;
  durationFormatted: string;
  thumbnailUrl: string;
  uploadedAt: number;
  status: 'queued' | 'extracting_audio' | 'transcribing_whisper' | 'detecting_scenes' | 'ranking_virality' | 'completed' | 'error';
  progress: number;
  clipsCount: number;
  clips: ViralClip[];
  rawTranscript: TranscriptWord[];
}

export interface AIProcessingConfig {
  targetClipDuration: '<30s' | '30-60s' | '60-90s' | '3m';
  language?: VideoLanguage;
  aspectRatio: AspectRatio;
  captionTemplateId: string; // 35 templates
  clipAnythingPrompt: string;
  autoEmojis: boolean;
  emojiConfig: EmojiConfig;
  autoZoom: AutoZoomConfig;
  autoBRoll: AutoBRollConfig;
  removeFillers: boolean;
  highlightKeywords: boolean;
  rangeStart?: number;
  rangeEnd?: number;
  autoSaveToGallery?: boolean;
  isCaptionsEnabled?: boolean;
  isHookTitleEnabled?: boolean;
}
