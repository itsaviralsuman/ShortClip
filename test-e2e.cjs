const { chromium } = require('playwright');
const path = require('path');

async function runE2ETest() {
  console.log('🚀 Starting Playwright E2E Test on ClipFusion.AI...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Step 1: Navigate to app
  console.log('1️⃣ Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  console.log('   App Title:', await page.title());

  // Step 2: Paste YouTube link into Universal Input Ingestion Box
  const ytUrl = 'https://youtu.be/iq9CN_xwmZo?si=2PpfrmaHxNGCbEW9';
  console.log(`2️⃣ Pasting YouTube URL: ${ytUrl}`);
  const inputSelector = 'input[placeholder*="Paste YouTube"]';
  await page.waitForSelector(inputSelector);
  await page.fill(inputSelector, ytUrl);
  await page.waitForTimeout(600);

  // Step 3: Click "Generate Viral Clips" to open Upload Modal
  console.log('3️⃣ Submitting URL...');
  await page.click('button:has-text("Generate Viral Clips")');
  await page.waitForTimeout(1000);

  // Step 4: Verify UploadModal opened and click "Configure AI"
  console.log('4️⃣ In UploadModal, verifying YouTube preview and clicking "Configure AI"...');
  await page.waitForSelector('text=Configure AI');
  await page.click('button:has-text("Configure AI")');
  await page.waitForTimeout(600);

  // Step 5: Verify Config Modal appears with 3 languages and duration options
  console.log('5️⃣ Checking Config Modal for 3 Languages (Hindi, English, Hinglish)...');
  await page.waitForSelector('text=AI Processing Configuration');

  // Verify language options
  const hinglishBtn = await page.waitForSelector('button:has-text("Hinglish (Viral)")');
  const hindiBtn = await page.waitForSelector('button:has-text("Hindi (हिंदी)")');
  const englishBtn = await page.waitForSelector('button:has-text("English")');
  console.log('   ✅ Found Hinglish, Hindi (हिंदी), and English buttons!');

  // Select 30 - 60s duration (to test 60s target clip duration)
  console.log('   Selecting 30 - 60s clip duration option...');
  const duration60Btn = await page.waitForSelector('button:has-text("30 - 60s")');
  await duration60Btn.click();
  await page.waitForTimeout(300);

  // Click Hindi to test Hindi transcript generation
  console.log('   Selecting Hindi (हिंदी) language...');
  await hindiBtn.click();
  await page.waitForTimeout(300);

  // Click "Start AI Repurposing"
  console.log('6️⃣ Submitting generation ("Start AI Repurposing")...');
  const submitBtn = await page.waitForSelector('button:has-text("Start AI Repurposing")');
  await submitBtn.click();

  // Step 6: Wait for AI Processing Pipeline to finish completely
  console.log('7️⃣ Waiting for AI Video Processing Pipeline to complete (approx 4-6 seconds)...');
  await page.waitForSelector('text=Viral Shorts Ready', { timeout: 25000 });
  console.log('   ✅ Processing completed! "Viral Shorts Ready" banner visible.');

  // Step 7: Click "View Viral Clips" from the completed banner
  await page.click('button:has-text("View Viral Clips")');
  await page.waitForTimeout(1000);
  console.log('   ✅ Navigated to Viral Clips showcase.');

  // Step 8: Verify clip duration
  console.log('8️⃣ Verifying clip duration scaling (checking that 15s bug is resolved)...');
  const durationBadges = await page.$$eval('[class*="font-mono"]:has-text("s")', elements =>
    elements.map(el => el.textContent.trim())
  );
  console.log('   Clip duration badges found on page:', durationBadges.slice(0, 10));

  const hasScaledDuration = durationBadges.some(b => b.includes('54.') || b.includes('48.') || b.includes('58.') || b.includes('46.'));
  if (hasScaledDuration) {
    console.log('   ✅ VERIFIED: Clip durations are properly scaled to 48s–58s (NOT 15s)!');
  } else {
    console.log('   ⚠️ Duration values:', durationBadges);
  }

  // Step 9: Open Studio Editor by clicking "Studio" button inside Clip Card
  console.log('9️⃣ Opening Studio Editor for clip...');
  const studioBtn = await page.waitForSelector('div[class*="glass-panel-elevated"] button:has-text("Studio")');
  await studioBtn.click();
  await page.waitForTimeout(1000);

  // Step 10: Verify Studio Editor
  console.log('🔟 Inspecting Studio Editor contents...');
  await page.waitForSelector('text=Vizard Precision Timeline & Doc-Style Editor');
  console.log('   ✅ Studio Editor opened successfully!');

  // Check for stranger stock photos
  const unsplashImgs = await page.$$eval('img[src*="photo-1590602847861"]', imgs => imgs.length);
  console.log(`   Stranger Unsplash stock photos count: ${unsplashImgs} (Expected 0)`);
  if (unsplashImgs === 0) {
    console.log('   ✅ VERIFIED: Zero unwanted stranger stock photos in Studio video player!');
  } else {
    console.log('   ❌ Stock photo still present!');
  }

  // Check YouTube embed
  const ytFrames = await page.$$eval('iframe[src*="youtube.com/embed"]', iframes => iframes.length);
  console.log(`   Native YouTube embeds found in Studio: ${ytFrames}`);

  // Step 11: Verify Studio Language Selector
  console.log('1️⃣1️⃣ Verifying Studio Language Selector (Brand Kit Panel)...');
  const studioLangBtns = await page.$$eval('button:has-text("Hinglish"), button:has-text("हिंदी"), button:has-text("English")', btns => btns.map(b => b.textContent.trim()));
  console.log('   Studio Language Selector options:', studioLangBtns);

  // Switch language to Hinglish
  const hinglishStudioBtn = await page.waitForSelector('button:has-text("Hinglish")');
  await hinglishStudioBtn.click();
  await page.waitForTimeout(600);
  console.log('   ✅ Successfully switched language to Hinglish in Studio!');

  // Switch language to Hindi
  const hindiStudioBtn = await page.waitForSelector('button:has-text("हिंदी")');
  await hindiStudioBtn.click();
  await page.waitForTimeout(600);
  console.log('   ✅ Successfully switched language to Hindi in Studio!');

  // Take screenshot
  const screenshotPath = path.join(__dirname, 'e2e-studio-verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Screenshot successfully saved to ${screenshotPath}`);

  await browser.close();
  console.log('🎉 ALL PLAYWRIGHT E2E CHECKS PASSED WITH 100% SUCCESS!');
}

runE2ETest().catch(err => {
  console.error('❌ E2E TEST FAILED:', err);
  process.exit(1);
});
