import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const subtitlesDir = path.resolve(__dirname, '../subtitles');

if (!fs.existsSync(subtitlesDir)) {
  fs.mkdirSync(subtitlesDir, { recursive: true });
}

function formatAssTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

export class SubtitleService {
  /**
   * Generates a modern OpusClip-style .ass subtitle file with karaoke phrase highlight
   */
  static generateAssFile({ clipId, words, templateId = 'hormozi-yellow', videoWidth = 1080, videoHeight = 1920 }) {
    const filePath = path.join(subtitlesDir, `${clipId}.ass`);

    const isHormoziLime = templateId === 'hormozi-lime';
    const isMrBeast = templateId === 'mrbeast-comic';

    const highlightColor = isHormoziLime
      ? '&H0000FF00&' // Neon Lime (BGR)
      : isMrBeast
      ? '&H0000A5FF&' // Orange
      : '&H0000FFFF&'; // Bright Hormozi Yellow

    const defaultTextColor = isMrBeast ? '&H00FFF000&' : '&H00FFFFFF&';
    const outlineColor = '&H00000000&';
    const fontSize = Math.round(videoHeight * 0.038); // ~72px on 1920h
    const marginV = Math.round(videoHeight * 0.14);   // ~270px from bottom

    // ASS Header
    let ass = `[Script Info]
Title: OpusClip Style Captions - ${clipId}
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
PlayResX: ${videoWidth}
PlayResY: ${videoHeight}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: OpusCaption,Arial,${fontSize},${defaultTextColor},${highlightColor},${outlineColor},&H80000000,-1,0,0,0,100,100,0,0,1,6,2,2,40,40,${marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    // Group words into 3-5 word spoken chunks
    const chunks = [];
    let currentChunk = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      if (w.isDeleted) continue;
      currentChunk.push(w);

      const hasPunctuation = /[.!?]$/.test(w.text);
      if (currentChunk.length >= 4 || (hasPunctuation && currentChunk.length >= 2) || i === words.length - 1) {
        chunks.push([...currentChunk]);
        currentChunk = [];
      }
    }

    // For each chunk, emit karaoke events where each word gets its turn to be highlighted
    chunks.forEach(chunk => {
      chunk.forEach(activeWord => {
        const lineStart = formatAssTime(activeWord.start);
        const lineEnd = formatAssTime(activeWord.end);

        // Build line text with active word highlighted
        const lineText = chunk.map(w => {
          const upperText = (w.text || '').toUpperCase();
          if (w.id === activeWord.id) {
            const emojiStr = w.emoji ? `${w.emoji} ` : '';
            return `{\\c${highlightColor}\\b1}${emojiStr}${upperText}{\\c${defaultTextColor}\\b1}`;
          }
          return upperText;
        }).join(' ');

        ass += `Dialogue: 0,${lineStart},${lineEnd},OpusCaption,,0,0,0,,${lineText}\n`;
      });
    });

    fs.writeFileSync(filePath, ass, 'utf-8');
    return filePath;
  }
}
