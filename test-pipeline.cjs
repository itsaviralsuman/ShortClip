const fs = require('fs');
const path = require('path');

async function testProcess() {
  console.log('Testing real video processing pipeline...');
  const res = await fetch('http://localhost:3001/api/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filePath: path.resolve('server/uploads/sample_input.mp4'),
      title: 'Real AI Video Processing Demo',
      durationMinutes: 1,
      config: { targetClipDuration: '<30s', language: 'hinglish' }
    })
  });
  const data = await res.json();
  console.log('Init response:', data);

  const jobId = data.jobId;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const statusRes = await fetch('http://localhost:3001/api/jobs/' + jobId);
    const job = await statusRes.json();
    console.log(`Poll ${i+1}: ${job.status} (${job.progress}%) - ${job.stage}`);
    if (job.status === 'completed') {
      console.log('✅ SUCCESS! Rendered clips count:', job.clips.length);
      job.clips.forEach((c, idx) => {
        console.log(`  Clip #${idx+1}: "${c.title}" (${c.duration}s)`);
        console.log(`    Rendered file: ${c.renderedFile}`);
        console.log(`    Video URL: ${c.videoUrl}`);
        console.log(`    Download URL: ${c.downloadUrl}`);
      });
      break;
    }
    if (job.status === 'failed') {
      console.error('Job failed:', job.error);
      break;
    }
  }
}

testProcess();
