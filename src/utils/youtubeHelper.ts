export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function formatTime(seconds: number): string {
  const totalSec = Math.floor(seconds || 0);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  author?: string;
  durationMinutes: number;
}

export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  const ytId = extractYouTubeId(url);

  if (ytId) {
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          return {
            title: data.title,
            thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
            author: data.author_name || 'YouTube Creator',
            durationMinutes: 85
          };
        }
      }
    } catch {
      // Fallback
    }

    return {
      title: 'YouTube Stream',
      thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      durationMinutes: 60
    };
  }

  return {
    title: 'Ingested Video Stream',
    thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 60
  };
}
