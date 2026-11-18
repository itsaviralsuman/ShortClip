import { TranscriptWord, CaptionChunkMode } from '../types';

export interface CaptionChunkResult {
  chunkWords: TranscriptWord[];
  activeWord: TranscriptWord | undefined;
  chunkStartIndex: number;
}

/**
 * Splits transcript words into readable OpusClip-style 3-5 word spoken phrases.
 * Punctuations (., ?, !, ,) naturally close a phrase early.
 */
export function getOpusCaptionChunk(
  words: TranscriptWord[],
  currentTime: number,
  mode: CaptionChunkMode = 'karaoke_phrase',
  maxWordsPerChunk: number = 4
): CaptionChunkResult {
  const visibleWords = words.filter((w) => !w.isDeleted);
  if (visibleWords.length === 0) {
    return { chunkWords: [], activeWord: undefined, chunkStartIndex: 0 };
  }

  // Find the exact word spoken right now
  const activeWord = visibleWords.find(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  // If mode is single_punch, just return the active word or the first upcoming word
  if (mode === 'single_punch') {
    if (activeWord) {
      return { chunkWords: [activeWord], activeWord, chunkStartIndex: visibleWords.indexOf(activeWord) };
    }
    const closest = visibleWords.find((w) => w.start >= currentTime) || visibleWords[0];
    return { chunkWords: [closest], activeWord: undefined, chunkStartIndex: visibleWords.indexOf(closest) };
  }

  // Pre-calculate chunks of 3-5 words
  const chunks: TranscriptWord[][] = [];
  let currentGroup: TranscriptWord[] = [];

  for (let i = 0; i < visibleWords.length; i++) {
    const word = visibleWords[i];
    currentGroup.push(word);

    const hasPunctuation = /[.!?]$/.test(word.text);
    if (currentGroup.length >= maxWordsPerChunk || (hasPunctuation && currentGroup.length >= 2) || i === visibleWords.length - 1) {
      chunks.push([...currentGroup]);
      currentGroup = [];
    }
  }

  // Find which chunk covers the currentTime
  let activeChunkIndex = 0;
  let found = false;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkStart = chunk[0].start;
    const chunkEnd = chunk[chunk.length - 1].end;

    if (currentTime >= chunkStart && currentTime <= chunkEnd) {
      activeChunkIndex = i;
      found = true;
      break;
    }
  }

  // If between words or before/after, find closest upcoming or preceding chunk
  if (!found) {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk[0].start > currentTime) {
        activeChunkIndex = Math.max(0, i > 0 ? i - 1 : 0);
        found = true;
        break;
      }
    }
    if (!found && chunks.length > 0) {
      activeChunkIndex = chunks.length - 1;
    }
  }

  const selectedChunk = chunks[activeChunkIndex] || visibleWords.slice(0, 4);

  return {
    chunkWords: selectedChunk,
    activeWord,
    chunkStartIndex: visibleWords.indexOf(selectedChunk[0])
  };
}
