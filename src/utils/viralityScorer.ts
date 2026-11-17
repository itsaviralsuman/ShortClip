import { ViralClip, ViralityBreakdown, TranscriptWord } from '../types';

export function determineViralityTier(score: number): ViralityBreakdown['tier'] {
  if (score >= 90) return 'VIRAL SUPERNOVA';
  if (score >= 80) return 'HIGH REACH';
  if (score >= 70) return 'SOLID ENGAGEMENT';
  return 'NICHE';
}

export function filterClipsByPrompt(clips: ViralClip[], prompt: string): ViralClip[] {
  if (!prompt || !prompt.trim()) return clips;
  
  const query = prompt.toLowerCase().trim();
  const tokens = query.split(/\s+/).filter(t => t.length > 2);

  return clips.filter(clip => {
    // Check clip title & hook
    const titleMatch = clip.title.toLowerCase().includes(query) || clip.hookTitle.toLowerCase().includes(query);
    if (titleMatch) return true;

    // Check key topics
    const topicsMatch = clip.virality.keyTopics.some(topic => 
      topic.toLowerCase().includes(query) || tokens.some(tok => topic.toLowerCase().includes(tok))
    );
    if (topicsMatch) return true;

    // Check transcript words
    const transcriptText = clip.words.map(w => w.text.toLowerCase()).join(' ');
    const textMatch = transcriptText.includes(query) || tokens.some(tok => transcriptText.includes(tok));
    return textMatch;
  });
}

export function generateSocialCaptions(title: string, topics: string[]): {
  tiktok: string;
  instagramReels: string;
  youtubeShorts: string;
  linkedin: string;
  hashtags: string[];
} {
  const primaryTopic = topics[0] || 'ViralGrowth';
  const tagList = ['#shorts', '#viral', '#creator', `#${primaryTopic.replace(/\s+/g, '')}`, '#entrepreneurship', '#mindset'];
  
  return {
    tiktok: `Watch this before you make your next move! ⚡ ${title} 👀 Save for later!`,
    instagramReels: `Stop scrolling if you want to master ${primaryTopic}. Here's the raw truth nobody is telling you. 👇 Follow for daily gems.`,
    youtubeShorts: `The secret behind ${title} 😱 (Mind blown!) Drop your thoughts in the comments.`,
    linkedin: `Critical perspective on ${primaryTopic}: "${title}". What's your take on this approach? Let's discuss in the comments.`,
    hashtags: tagList
  };
}
