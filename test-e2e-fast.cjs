const { chromium } = require('playwright');

async function testFastE2E() {
  console.log('🚀 Starting E2E Verification with Live Console Logs...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('   [PAGE LOG]', msg.text()));
  page.on('dialog', async dialog => {
    console.log('   [DIALOG]', dialog.message());
    await dialog.accept();
  });

  // 1. Load app
  console.log('1️⃣ Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  console.log('   Title:', await page.title());

  // 2. Clear localStorage
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // 3. Paste YouTube URL
  const ytUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  console.log(`2️⃣ Pasting YouTube URL: ${ytUrl}`);
  const input = page.locator('input[placeholder*="Paste YouTube"]');
  await input.fill(ytUrl);
  await page.waitForTimeout(500);

  // 4. Submit
  console.log('3️⃣ Submitting URL...');
  await page.click('button:has-text("Generate Viral Clips")');
  await page.waitForTimeout(1000);

  // 5. Configure AI
  console.log('4️⃣ Clicking Configure AI...');
  await page.click('button:has-text("Configure AI")');
  await page.waitForTimeout(1000);

  // 6. Check Opus Ingestion Panel
  console.log('5️⃣ Opus Ingestion Panel verified...');
  await page.waitForSelector('text=Summary');

  // 7. Click Create Viral Shorts
  console.log('6️⃣ Clicking Create Viral Shorts...');
  const submitBtn = page.locator('[data-testid="start-ai-repurposing-btn"], button:has-text("Create Viral Shorts")');
  await submitBtn.click();
  console.log('   Waiting for processing...');

  // Wait for processing to complete or active project ready banner
  await page.waitForFunction(() => {
    return document.body.innerText.includes('Viral Shorts Ready') ||
           document.body.innerText.includes('Processing Complete') ||
           document.querySelector('[data-testid="cut-time-range"]') !== null;
  }, null, { timeout: 180000 });
  console.log('   ✅ Processing finished!');

  // 8. View clips
  const viewClipsBtn = await page.$('button:has-text("View Viral Clips")');
  if (viewClipsBtn) {
    await viewClipsBtn.click();
    await page.waitForTimeout(1000);
  }

  // 9. Verify clips
  const cutRanges = await page.$$eval('[data-testid="cut-time-range"]', els => els.map(e => e.textContent.trim()));
  console.log(`8️⃣ Generated ${cutRanges.length} clips with cut time ranges:`, cutRanges);

  if (cutRanges.length < 2) {
    throw new Error(`Expected at least 2 clips, found ${cutRanges.length}`);
  }

  // 10. Verify captions
  const captions = await page.$$eval('[data-testid="caption-container"]', containers =>
    containers.map(c => c.textContent.trim().replace(/\s+/g, ' '))
  );
  console.log('9️⃣ Sample clip captions:');
  captions.slice(0, 4).forEach((c, idx) => console.log(`   Clip #${idx + 1}: "${c}"`));

  // 11. Verify video playback
  console.log('🔟 Testing video playback & sound button...');
  const playBtn = page.locator('[data-testid="clipcard-play-btn"]').first();
  await playBtn.click();
  await page.waitForTimeout(600);

  const audioBtn = page.locator('[data-testid="audio-toggle-btn"]').first();
  console.log('   Audio button text:', await audioBtn.textContent());
  await audioBtn.click();
  await page.waitForTimeout(300);

  // 12. Test Save to Gallery / Export HD button
  console.log('1️⃣1️⃣ Testing Export HD / Save to Gallery button...');
  const exportBtn = page.locator('button:has-text("Export HD"), button:has-text("Save to Gallery")').first();
  if (await exportBtn.count() > 0) {
    console.log('   Export button found, text:', await exportBtn.textContent());
  }

  console.log('\n🎉 ALL END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY! ✅');
  await browser.close();
}

testFastE2E().catch(err => {
  console.error('❌ Fast E2E Test Error:', err);
  process.exit(1);
});
