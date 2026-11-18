export interface OpusRecipe {
  id: string;
  title: string;
  description: string;
  tag: string;
  badge?: string;
  icon: string;
  isDefault?: boolean;
}

export const OPUS_RECIPES: OpusRecipe[] = [
  {
    id: 'clip-long-video',
    title: 'Clip long video',
    description: 'AI finds the hooks, best moments, and turns them into viral shorts. The #1 video repurposing recipe.',
    tag: 'Long-form to Shorts',
    badge: 'In use',
    icon: 'Scissors',
    isDefault: true
  },
  {
    id: 'clean-up-recording',
    title: 'Clean up recording',
    description: 'Look and sound sharp in podcasts, interviews, and webinars. AI cleans up your speech, eye contact and color.',
    tag: 'Audio & Visual Denoising',
    icon: 'Sparkles'
  },
  {
    id: 'auto-edit-talking-videos',
    title: 'Auto-edit talking videos',
    description: 'Turn raw footage into a ready-to-post video. Apply quality fixes, add captions, graphics, effects and viral hooks.',
    tag: 'Post-Production Flow',
    icon: 'Wand2'
  },
  {
    id: 'captions',
    title: 'Captions',
    description: 'Add eye-catching animated captions in 1 click with 35+ viral templates.',
    tag: 'Karaoke Subtitles',
    icon: 'Type'
  },
  {
    id: 'reframe',
    title: 'Reframe',
    description: 'AI auto reframes any video to fit every social platform. No manual cropping. The #1 reframe engine.',
    tag: '9:16 / 1:1 Auto Crop',
    icon: 'Maximize2'
  },
  {
    id: 'social-edits',
    title: 'Social edits',
    description: 'Add viral hooks and motion graphics to hold attention on TikTok, Reels & Shorts.',
    tag: 'Retention Boosters',
    icon: 'Flame'
  }
];
