async function run() {
  const { CandidateService } = await import('./server/services/candidateService.js');
  const { TranscriptionService } = await import('./server/services/transcriptionService.js');

  const candidates = CandidateService.discoverCandidates({
    videoTitle: 'Test 2-Hour Video Stream',
    totalDurationSeconds: 7200,
    language: 'hinglish'
  });

  console.log('Total candidates generated:', candidates.length);
  const sampleSentences = [];

  candidates.forEach((cand, idx) => {
    const words = TranscriptionService.getClipWordsFromFullTranscript(
      null, // simulated without full transcript to test thematic pools
      cand.startTime,
      cand.endTime,
      idx,
      'hinglish'
    );

    const first5 = words.slice(0, 5).map(w => w.text).join(' ');
    sampleSentences.push(first5);

    const firstStart = words[0]?.start;
    const lastEnd = words[words.length - 1]?.end;
    console.log(`Clip #${idx + 1} (${cand.duration}s): "${first5}..." | Local: [${firstStart}s -> ${lastEnd}s] | Source: [${words[0]?.sourceStart}s -> ${words[words.length - 1]?.sourceEnd}s]`);
  });

  const uniqueSentences = new Set(sampleSentences);
  console.log('\n--- VERIFICATION STATS ---');
  console.log(`Total generated clips: ${candidates.length}`);
  console.log(`Unique caption dialogues: ${uniqueSentences.size} of ${candidates.length}`);
  console.log(`Zero duplicate captions across all clips: ${uniqueSentences.size === candidates.length}`);

  if (uniqueSentences.size !== candidates.length) {
    throw new Error('Duplicate captions found across clips!');
  }
}

run().catch(console.error);
