import { VideoProject, ViralClip, TranscriptWord } from '../types';

export const SAMPLE_PODCAST_WORDS: TranscriptWord[] = [
  { id: 'w1', text: 'Listen,', start: 0.1, end: 0.4, speaker: 'Speaker 1', highlightColor: '#F59E0B' },
  { id: 'w2', text: 'most', start: 0.5, end: 0.7, speaker: 'Speaker 1' },
  { id: 'w3', text: 'creators', start: 0.75, end: 1.1, speaker: 'Speaker 1' },
  { id: 'w4', text: 'fail', start: 1.15, end: 1.45, speaker: 'Speaker 1', highlightColor: '#EF4444', emoji: '💀' },
  { id: 'w5', text: 'because', start: 1.5, end: 1.75, speaker: 'Speaker 1' },
  { id: 'w6', text: 'they', start: 1.8, end: 1.95, speaker: 'Speaker 1' },
  { id: 'w7', text: 'um', start: 2.0, end: 2.25, speaker: 'Speaker 1', isFiller: true },
  { id: 'w8', text: 'spend', start: 2.3, end: 2.6, speaker: 'Speaker 1' },
  { id: 'w9', text: 'forty', start: 2.65, end: 2.9, speaker: 'Speaker 1' },
  { id: 'w10', text: 'hours', start: 2.95, end: 3.3, speaker: 'Speaker 1', emoji: '⏳' },
  { id: 'w11', text: 'editing', start: 3.35, end: 3.75, speaker: 'Speaker 1' },
  { id: 'w12', text: 'one', start: 3.8, end: 3.95, speaker: 'Speaker 1' },
  { id: 'w13', text: 'video.', start: 4.0, end: 4.4, speaker: 'Speaker 1' },
  { id: 'w14', text: 'Like,', start: 4.8, end: 5.1, speaker: 'Speaker 2', isFiller: true },
  { id: 'w15', text: 'that', start: 5.2, end: 5.4, speaker: 'Speaker 2' },
  { id: 'w16', text: 'is', start: 5.45, end: 5.6, speaker: 'Speaker 2' },
  { id: 'w17', text: 'literally', start: 5.65, end: 6.0, speaker: 'Speaker 2', isFiller: true },
  { id: 'w18', text: 'suicide', start: 6.05, end: 6.45, speaker: 'Speaker 2', highlightColor: '#EF4444' },
  { id: 'w19', text: 'for', start: 6.5, end: 6.65, speaker: 'Speaker 2' },
  { id: 'w20', text: 'your', start: 6.7, end: 6.85, speaker: 'Speaker 2' },
  { id: 'w21', text: 'growth.', start: 6.9, end: 7.3, speaker: 'Speaker 2', emoji: '📈' },
  { id: 'w22', text: 'If', start: 7.5, end: 7.7, speaker: 'Speaker 1' },
  { id: 'w23', text: 'you', start: 7.75, end: 7.9, speaker: 'Speaker 1' },
  { id: 'w24', text: 'repurpose', start: 7.95, end: 8.4, speaker: 'Speaker 1', highlightColor: '#10B981', emoji: '⚡' },
  { id: 'w25', text: 'one', start: 8.45, end: 8.65, speaker: 'Speaker 1' },
  { id: 'w26', text: 'stream', start: 8.7, end: 9.05, speaker: 'Speaker 1' },
  { id: 'w27', text: 'into', start: 9.1, end: 9.3, speaker: 'Speaker 1' },
  { id: 'w28', text: 'thirty', start: 9.35, end: 9.65, speaker: 'Speaker 1', highlightColor: '#F59E0B' },
  { id: 'w29', text: 'shorts,', start: 9.7, end: 10.15, speaker: 'Speaker 1' },
  { id: 'w30', text: 'you', start: 10.3, end: 10.45, speaker: 'Speaker 1' },
  { id: 'w31', text: 'get', start: 10.5, end: 10.7, speaker: 'Speaker 1' },
  { id: 'w32', text: 'thirty', start: 10.75, end: 11.05, speaker: 'Speaker 1', highlightColor: '#10B981', emoji: '🎯' },
  { id: 'w33', text: 'chances', start: 11.1, end: 11.45, speaker: 'Speaker 1' },
  { id: 'w34', text: 'to', start: 11.5, end: 11.65, speaker: 'Speaker 1' },
  { id: 'w35', text: 'go', start: 11.7, end: 11.9, speaker: 'Speaker 1' },
  { id: 'w36', text: 'viral', start: 11.95, end: 12.35, speaker: 'Speaker 1', highlightColor: '#8B5CF6', emoji: '🚀' },
  { id: 'w37', text: 'every', start: 12.4, end: 12.65, speaker: 'Speaker 1' },
  { id: 'w38', text: 'single', start: 12.7, end: 13.0, speaker: 'Speaker 1' },
  { id: 'w39', text: 'day.', start: 13.05, end: 13.4, speaker: 'Speaker 1' },
  { id: 'w40', text: 'Uh,', start: 13.6, end: 13.85, speaker: 'Speaker 1', isFiller: true },
  { id: 'w41', text: 'the', start: 13.9, end: 14.1, speaker: 'Speaker 1' },
  { id: 'w42', text: 'math', start: 14.15, end: 14.45, speaker: 'Speaker 1', highlightColor: '#06B6D4', emoji: '🧮' },
  { id: 'w43', text: 'is', start: 14.5, end: 14.65, speaker: 'Speaker 1' },
  { id: 'w44', text: 'undeniable.', start: 14.7, end: 15.3, speaker: 'Speaker 1', highlightColor: '#10B981' },
];

export const SAMPLE_CLIPS: ViralClip[] = [
  {
    id: 'clip-101',
    projectId: 'proj-1',
    title: 'Why 99% of Content Creators Burn Out in 30 Days',
    hookTitle: 'WHY 99% CREATORS FAIL 💀',
    startTime: 0,
    endTime: 15.3,
    duration: 15.3,
    aspectRatio: '9:16',
    captionPreset: 'hormozi',
    speakerMode: 'split-top-bottom',
    previewThumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    targetPlatform: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    virality: {
      overallScore: 97,
      tier: 'VIRAL SUPERNOVA',
      hookStrength: 98,
      pacingScore: 94,
      emotionalPeak: 96,
      retentionProbability: 95,
      rationale: 'Instant high-stakes provocative opening statement ("creators fail") triggers dopamine retention spike within first 1.8 seconds. Strong contrasting speaker reaction.',
      keyTopics: ['Creator Economy', 'Productivity', 'Burnout', 'Viral Systems']
    },
    socialCaptions: {
      tiktok: 'Stop spending 40 hours on one video 💀 Here is how top creators 100x their output with zero extra effort 🚀 #creatorhacks #shorts #viral',
      instagramReels: 'The uncomfortable truth about why 99% of creators quit within 30 days. Save this before your next upload! ⏳👇',
      youtubeShorts: 'Why 40 hours of editing is DESTROYING your channel growth 😱 (Watch till end)',
      linkedin: 'Content output is not an art problem; it is a distribution system bottleneck. Why multi-format repurposing wins every time.',
      hashtags: ['#CreatorEconomy', '#ViralShorts', '#ProductivityHacks', '#EntrepreneurMindset']
    },
    words: SAMPLE_PODCAST_WORDS,
    bRollTracks: [
      { id: 'b1', start: 2.3, end: 4.0, keyword: 'editing-desk', previewUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=60', enabled: true },
      { id: 'b2', start: 7.9, end: 10.5, keyword: 'viral-metrics', previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60', enabled: true },
    ]
  },
  {
    id: 'clip-102',
    projectId: 'proj-1',
    title: 'The "Repurposing Flywheel": Turning 1 Stream into 30 Viral Assets',
    hookTitle: 'THE 1-STREAM 30X FLYWHEEL ⚡',
    startTime: 7.5,
    endTime: 15.3,
    duration: 7.8,
    aspectRatio: '9:16',
    captionPreset: 'mrbeast',
    speakerMode: 'single',
    previewThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    targetPlatform: ['YouTube Shorts', 'TikTok'],
    virality: {
      overallScore: 92,
      tier: 'VIRAL SUPERNOVA',
      hookStrength: 91,
      pacingScore: 95,
      emotionalPeak: 89,
      retentionProbability: 93,
      rationale: 'Extremely snappy mathematical argument. High word density and punchy metric shifts create strong replayability.',
      keyTopics: ['Growth Flywheel', 'Shorts Strategy', 'AI Video', 'Content Scaling']
    },
    socialCaptions: {
      tiktok: '1 stream = 30 viral shorts every single day 🤯 Try this framework now! #videomarketing #opusclip #contentstrategy',
      instagramReels: 'The 30x viral framework explained in 8 seconds. Stop trading time for views. 🎯',
      youtubeShorts: 'How to get 30 chances to go viral EVERY SINGLE DAY ⚡',
      linkedin: 'Operationalizing video production: Turning long-form podcast VODs into modular micro-content.',
      hashtags: ['#ContentMarketing', '#ShortFormVideo', '#GrowthHacks']
    },
    words: SAMPLE_PODCAST_WORDS.slice(21),
    bRollTracks: [
      { id: 'b3', start: 8.5, end: 11.0, keyword: 'smartphone-reels', previewUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=60', enabled: true }
    ]
  },
  {
    id: 'clip-103',
    projectId: 'proj-1',
    title: 'Why Editing 40 Hours for One Video Is Career Suicide',
    hookTitle: 'THE 40-HOUR EDITING TRAP 🚫',
    startTime: 1.5,
    endTime: 7.3,
    duration: 5.8,
    aspectRatio: '9:16',
    captionPreset: 'iman',
    speakerMode: 'split-top-bottom',
    previewThumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    targetPlatform: ['Instagram Reels', 'TikTok', 'LinkedIn'],
    virality: {
      overallScore: 88,
      tier: 'HIGH REACH',
      hookStrength: 87,
      pacingScore: 91,
      emotionalPeak: 86,
      retentionProbability: 88,
      rationale: 'Controversial stance that polarizes video editors and creators, generating high comment-section debate and shares.',
      keyTopics: ['Video Editing', 'Perfectionism Trap', 'Time Management']
    },
    socialCaptions: {
      tiktok: 'Stop obsessing over micro-transitions. Focus on hook and distribution instead! 💥 #editorlife #videoeditor #creators',
      instagramReels: 'Is perfectionism killing your channel? Here is what nobody tells you about the algorithm. 📱',
      youtubeShorts: 'The 40-hour editing trap exposed in 5 seconds 💀',
      linkedin: 'Perfectionism is the enemy of volume. Why iteration velocity outpaces craft in digital distribution.',
      hashtags: ['#VideoProduction', '#CreatorEconomy', '#Scalability']
    },
    words: SAMPLE_PODCAST_WORDS.slice(4, 21),
    bRollTracks: []
  },
  {
    id: 'clip-104',
    projectId: 'proj-1',
    title: 'The Math Behind Algorithmic Luck: 30 Chances to Win',
    hookTitle: 'HACKING ALGORITHMIC LUCK 🧮',
    startTime: 8.0,
    endTime: 15.3,
    duration: 7.3,
    aspectRatio: '9:16',
    captionPreset: 'minimalist',
    speakerMode: 'single',
    previewThumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    targetPlatform: ['YouTube Shorts', 'LinkedIn'],
    virality: {
      overallScore: 84,
      tier: 'HIGH REACH',
      hookStrength: 82,
      pacingScore: 86,
      emotionalPeak: 83,
      retentionProbability: 85,
      rationale: 'Intellectual framing appealing to analytical creators and startup founders looking for predictable virality.',
      keyTopics: ['Probability', 'Viral Math', 'Algorithm Optimization']
    },
    socialCaptions: {
      tiktok: 'The math is undeniable. 30 shots on goal beat 1 shot every time 🎯 #math #growth #algorithm',
      instagramReels: 'How the biggest YouTube channels actually view the algorithm. 🧮',
      youtubeShorts: 'Algorithmic probability explained in 7 seconds 🧠',
      linkedin: 'Distribution is a probabilistic game. Maximize your surface area of luck by increasing your shots on goal.',
      hashtags: ['#Probability', '#ContentOperations', '#GrowthMarketing']
    },
    words: SAMPLE_PODCAST_WORDS.slice(23),
    bRollTracks: []
  }
];

export const INITIAL_PROJECTS: VideoProject[] = [
  {
    id: 'proj-1',
    title: 'The $100M Founder Playbook: Building Scaling Systems & AI Leverage',
    sourceType: 'url',
    sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationMinutes: 58,
    durationFormatted: '58m 20s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    uploadedAt: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
    status: 'completed',
    progress: 100,
    clipsCount: 4,
    clips: SAMPLE_CLIPS,
    rawTranscript: SAMPLE_PODCAST_WORDS
  },
  {
    id: 'proj-2',
    title: 'Deep Learning Revolution: Neural Synthesis & Real-time Video Repurposing',
    sourceType: 'local',
    durationMinutes: 45,
    durationFormatted: '45m 12s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    uploadedAt: Date.now() - (7 * 60 * 60 * 1000), // 7 hours ago
    status: 'completed',
    progress: 100,
    clipsCount: 3,
    clips: SAMPLE_CLIPS.slice(0, 3),
    rawTranscript: SAMPLE_PODCAST_WORDS
  }
];
