async function run() {
  const { CandidateService } = await import('./server/services/candidateService.js');
  const candidates = CandidateService.discoverCandidates({
    videoTitle: 'Test 2-Hour Video Stream',
    totalDurationSeconds: 7200,
    language: 'hinglish'
  });
  console.log('Total candidates generated:', candidates.length);
  let allValidDuration = true;
  candidates.forEach((c, idx) => {
    console.log(`Clip #${idx+1}: "${c.title}" | Duration: ${c.duration}s (${c.startTime}s - ${c.endTime}s)`);
    if (c.duration < 60 || c.duration > 120) allValidDuration = false;
  });
  console.log('All clips strictly between 60s and 120s:', allValidDuration);
  console.log('At least 8 clips returned:', candidates.length >= 8);
}
run();
