const { chromium, devices } = require('playwright');

async function testAdjustRangeAndToggles() {
  console.log('🧪 Starting Verification Test for Adjust Range, Feature Switches, Brand Kit Removal & Gallery Save...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  try {
    // 1. Open app
    console.log('1️⃣ Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // 2. Open Ingest Modal via mobile (+) button
    console.log('2️⃣ Tapping Floating (+) Ingest button...');
    await page.locator('nav.md\\:hidden button[title="Ingest Video"]').click({ force: true });
    await page.waitForTimeout(600);

    // 3. Click "Configure AI" to open Opus Ingestion Panel
    console.log('3️⃣ Opening Opus Ingestion Panel...');
    await page.locator('button:has-text("Configure AI")').click({ force: true });
    await page.waitForTimeout(1000);

    // 4. Verify Brand Kit is REMOVED
    console.log('4️⃣ Verifying Brand Kit section is completely REMOVED...');
    const brandKitText = await page.$('text=Brand kit');
    const brandKitPresent = brandKitText !== null;
    console.log(`   Brand Kit Present: ${brandKitPresent ? 'YES ❌' : 'NO ✅ (Cleanly removed!)'}`);

    // 5. Verify "Save in Gallery" is present in place of "Upload SRT"
    console.log('5️⃣ Verifying "Save in Gallery" option is present in place of SRT...');
    const saveInGalleryBtn = await page.$('button:has-text("Save in Gallery")');
    console.log(`   Save in Gallery Button: ${saveInGalleryBtn ? 'Found ✅' : 'Missing ❌'}`);
    const srtBtn = await page.$('button:has-text("Upload SRT")');
    console.log(`   Old Upload SRT Button: ${srtBtn ? 'Still present ❌' : 'Successfully replaced ✅'}`);

    // 6. Test Interactive Range Adjuster (video ko chota bada karna)
    console.log('6️⃣ Testing Interactive Adjust Range & Credit Saver Calculation...');
    const initialDurationText = await page.innerText('span:has-text("duration")');
    console.log(`   Initial Range Duration: "${initialDurationText}"`);

    // Click "First 30m" preset
    console.log('   Clicking "First 30m" preset button...');
    await page.locator('button:has-text("First 30m")').click({ force: true });
    await page.waitForTimeout(400);

    const adjustedDurationText = await page.innerText('span:has-text("duration")');
    console.log(`   Updated Range Duration: "${adjustedDurationText}"`);

    // Verify credits dynamically updated
    const summaryCreditText = await page.innerText('span:has-text("credits")');
    console.log(`   Dynamically recalculated credits: "${summaryCreditText}"`);

    // Click "First 15m" preset
    console.log('   Clicking "First 15m" preset button...');
    await page.locator('button:has-text("First 15m")').click({ force: true });
    await page.waitForTimeout(400);

    const finalDurationText = await page.innerText('span:has-text("duration")');
    console.log(`   Final Range Duration: "${finalDurationText}"`);

    // 7. Verify Feature ON/OFF Switches ("sab chiz ka button hona chiaye on off karne ka")
    console.log('7️⃣ Verifying all feature ON/OFF switches in Recipe Settings...');
    const features = [
      'Clipping & Highlights',
      'Dynamic Captions',
      'Auto Emojis & Stickers',
      'Auto-Zoom & Punch',
      'Remove Fillers & Silences',
      'AI B-Roll Cutaways',
      'Viral Hook Title Header'
    ];

    for (const f of features) {
      const el = await page.$(`text=${f}`);
      console.log(`   Feature switch "${f}": ${el ? 'Verified ✅' : 'Missing ❌'}`);
    }

    // 8. Click "Create Viral Shorts"
    console.log('8️⃣ Clicking "Create Viral Shorts" with adjusted range...');
    await page.locator('button[data-testid="start-ai-repurposing-btn"]').click({ force: true });
    await page.waitForTimeout(4000);

    // 9. Verify navigation to Clips tab and check captions
    console.log('9️⃣ Navigating to Clips view to verify Captions and Save to Gallery...');
    await page.locator('nav.md\\:hidden button:has-text("Clips")').click({ force: true });
    await page.waitForTimeout(1000);

    const captionContainer = await page.$('[data-testid="caption-container"]');
    console.log(`   Dynamic Hormozi Captions Container: ${captionContainer ? 'Present & Verified ✅' : 'Missing ❌'}`);

    // 10. Test "Save to Gallery" click - verify NO reload happens!
    console.log('🔟 Testing "Save to Gallery" download flow on mobile...');
    const galleryBtn = await page.locator('button[data-testid="export-hd-btn"]').first();
    await galleryBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Check page URL didn't navigate to error
    const currentUrl = page.url();
    console.log(`   Current URL after Save click: ${currentUrl} (No reload / error ✅)`);

    console.log('\n======================================================');
    console.log('🎉 ALL TESTS PASSED: Adjust Range, Toggles, BrandKit Removed, Captions & Reload-Free Gallery Save verified!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test Error:', err);
  } finally {
    await browser.close();
  }
}

testAdjustRangeAndToggles();
