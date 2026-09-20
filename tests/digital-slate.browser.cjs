// Requires Playwright. Start a static server over `public` after `npm run build`.
// SLATE_URL, CHROME_EXECUTABLE and SLATE_QA_DIR may override the defaults below.
const { chromium, devices } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const url = process.env.SLATE_URL || 'http://127.0.0.1:4173/sideProject/digitalSlate/';
const output = process.env.SLATE_QA_DIR || '/tmp/digital-slate-qa';
const key = 'michaelpig.digital-slate.v1';
const errors = [];
const state = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
const ready = page => page.waitForFunction(() => !document.getElementById('clap-button').disabled);
const count = (page, n) => page.waitForFunction(n => document.getElementById('record-count').textContent === String(n), n);
const noOverflow = async page => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'page should fit viewport');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, acceptDownloads: true });
    await context.addInitScript(() => {
      window.audioStarts = 0;
      window.audioLengths = [];
      const start = AudioBufferSourceNode.prototype.start;
      AudioBufferSourceNode.prototype.start = function(...args) { window.audioStarts++; window.audioLengths.push(this.buffer.length); return start.apply(this, args); };
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await page.waitForFunction(() => document.getElementById('offline-status').textContent === '可離線使用');
    await noOverflow(page);
    await page.screenshot({ path: path.join(output, 'desktop-empty.png'), fullPage: true });
    await page.locator('#production').fill('九月的午後');
    await page.locator('#scene').fill('03');
    await page.locator('#shot').fill('B');
    await page.locator('#director').fill('Michael');
    await page.locator('#camera').fill('A CAM');
    await page.locator('#notes').fill('窗邊對話\n注意背景的腳步聲');
    await page.locator('#test-sound').click();
    await page.waitForFunction(() => window.audioStarts === 1);
    assert.equal((await state(page)).records.length, 0, 'sound test does not save a take');
    await page.locator('#clap-button').click();
    await page.evaluate(() => document.getElementById('clap-button').click());
    await count(page, 1);
    assert.equal(await page.locator('#board-take').textContent(), '01', 'clap keeps the recorded take visible');
    await ready(page);
    let saved = await state(page);
    assert.equal(saved.form.take, 2);
    assert.equal(saved.form.notes, '');
    assert.equal(saved.records[0].notes, '窗邊對話\n注意背景的腳步聲');
    assert.equal(saved.records[0].soundPlayed, true);
    assert.equal(await page.evaluate(() => window.audioStarts), 2);
    const lengths = [];
    for (const type of ['clack', 'wood', 'beep']) {
      await page.locator('#sound-type').selectOption(type);
      await page.locator('#test-sound').click();
      await page.waitForFunction(() => !document.getElementById('test-sound').disabled);
      lengths.push(await page.evaluate(() => window.audioLengths.at(-1)));
    }
    assert.equal(new Set(lengths).size, 3, 'each sound uses its own buffer');
    assert.equal((await state(page)).records.length, 1, 'sound previews do not create records');
    await page.locator('[name=boardTheme][value=white]').check();
    await page.locator('#records-list .edit-record').first().click();
    await page.locator('#record-rating').selectOption('ok');
    await page.locator('#record-notes').fill('情緒很好，保留這一鏡。');
    await page.locator('#record-form button[type=submit]').click();
    await page.reload();
    assert.equal(await page.locator('#production').inputValue(), '九月的午後');
    await count(page, 1);
    assert.equal((await state(page)).records[0].rating, 'ok');
    assert.equal(await page.locator('#sound-type').inputValue(), 'beep');
    assert.equal(await page.locator('body').getAttribute('data-board-theme'), 'white');
    await page.screenshot({ path: path.join(output, 'desktop-record.png'), fullPage: true });

    const csvEvent = page.waitForEvent('download');
    await page.locator('#export-csv').click();
    const csv = await csvEvent;
    const csvText = await fs.readFile(await csv.path(), 'utf8');
    assert.ok(csvText.includes('情緒很好，保留這一鏡。'));
    const jsonEvent = page.waitForEvent('download');
    await page.locator('#export-json').click();
    const json = await jsonEvent;
    const backupPath = path.join(output, 'backup.json');
    await json.saveAs(backupPath);
    await page.locator('#import-file').setInputFiles(backupPath);
    await page.waitForFunction(() => document.getElementById('toast').textContent.includes('匯入 0 筆'));
    assert.equal((await state(page)).records.length, 1);
    await page.locator('#import-file').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"version":1,"records":[{}]}') });
    await page.waitForFunction(() => document.getElementById('toast').textContent.includes('格式不完整'));
    assert.equal((await state(page)).records.length, 1);

    await page.locator('#sound').uncheck();
    await page.locator('#auto-next').uncheck();
    await page.locator('#countdown').selectOption('3');
    await page.locator('#clap-button').click();
    await page.locator('#cancel-countdown').click();
    assert.equal((await state(page)).records.length, 1);
    await page.locator('#clap-button').click();
    await count(page, 2);
    await ready(page);
    assert.equal((await state(page)).records[0].soundPlayed, false);
    assert.equal((await state(page)).form.take, 2, 'manual take does not auto advance');
    await page.locator('#clap-button').click();
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await ready(page);
    assert.equal((await state(page)).records.length, 2, 'backgrounding cancels countdown');
    await page.locator('#countdown').selectOption('0');
    await page.locator('#notes').fill('keyboard');
    await page.keyboard.press('Space');
    assert.equal((await state(page)).records.length, 2, 'space in input does not clap');

    await context.setOffline(true);
    await page.reload();
    await page.waitForFunction(() => document.getElementById('offline-status').textContent === '離線模式');
    await page.locator('#clap-button').click();
    await count(page, 3);
    await ready(page);
    assert.equal((await state(page)).records.length, 3);
    await page.goto(url + 'index.html?offline-test=1');
    await count(page, 3);
    await context.setOffline(false);
    assert.equal(await page.evaluate(() => new URL(navigator.serviceWorker.controller.scriptURL).pathname), '/sideProject/digitalSlate/sw.js');
    console.log('PASS: audio scheduling, clap snapshots, repeat guard, edit, persistence, export/import, countdown cancellation, background cancellation, offline navigation and clap');

    const ipad = await browser.newContext({ ...devices['iPad Pro 11'], viewport: { width: 1194, height: 834 } });
    const tablet = await ipad.newPage();
    tablet.on('pageerror', error => errors.push(error.message));
    await tablet.goto(url);
    await tablet.locator('#production').fill('九月的午後');
    await tablet.locator('#director').fill('Michael');
    await tablet.locator('#camera').fill('A CAM');
    for (const theme of ['black', 'white', 'navy', 'green', 'burgundy']) {
      await tablet.locator(`[name=boardTheme][value=${theme}]`).check();
      assert.equal(await tablet.locator('body').getAttribute('data-board-theme'), theme);
    }
    await tablet.locator('[name=boardTheme][value=white]').check();
    await noOverflow(tablet);
    await tablet.screenshot({ path: path.join(output, 'ipad-landscape.png'), fullPage: true });
    await tablet.locator('#focus-toggle').tap();
    for (const viewport of [{ width: 1194, height: 834 }, { width: 1024, height: 768 }, { width: 834, height: 1194 }, { width: 1366, height: 1024 }]) {
      await tablet.setViewportSize(viewport);
      const frame = await tablet.locator('.slate-section').boundingBox();
      assert.equal(frame.x, 0); assert.equal(frame.y, 0);
      assert.equal(frame.width, viewport.width); assert.equal(frame.height, viewport.height);
      const button = await tablet.locator('#clap-button').boundingBox();
      assert.ok(Math.abs(button.y + button.height - viewport.height) < 2, 'clap button reaches the bottom edge');
      const board = await tablet.locator('.slate-frame').boundingBox();
      assert.equal(board.x, 0); assert.equal(board.width, viewport.width);
      assert.ok(await tablet.evaluate(() => document.documentElement.scrollHeight <= innerHeight), 'focus mode must not scroll');
    }
    await tablet.setViewportSize({ width: 1194, height: 834 });
    await tablet.screenshot({ path: path.join(output, 'ipad-focus.png'), fullPage: true });
    await noOverflow(tablet);
    const focusBox = await tablet.locator('#clap-button').boundingBox();
    assert.ok(focusBox.y + focusBox.height <= 834, 'iPad landscape focus mode keeps clap in view');
    await tablet.locator('#focus-toggle').tap();
    assert.equal(await tablet.locator('body').evaluate(el => el.classList.contains('focus-mode')), false);
    await tablet.setViewportSize({ width: 834, height: 1194 });
    await noOverflow(tablet);
    await tablet.screenshot({ path: path.join(output, 'ipad-portrait.png'), fullPage: true });
    const phone = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 } });
    const mobile = await phone.newPage();
    await mobile.goto(url);
    await noOverflow(mobile);
    await mobile.screenshot({ path: path.join(output, 'phone.png'), fullPage: true });
    // Force the viewport fallback used when the native fullscreen API is unavailable.
    await mobile.evaluate(() => { document.documentElement.requestFullscreen = undefined; document.documentElement.webkitRequestFullscreen = undefined; });
    await mobile.locator('#focus-toggle').tap();
    assert.equal((await mobile.locator('.slate-section').boundingBox()).height, 844);
    await mobile.screenshot({ path: path.join(output, 'phone-focus.png'), fullPage: true });
    await mobile.locator('#focus-toggle').tap();
    await mobile.locator('#install-app').tap();
    assert.equal(await mobile.locator('#help-dialog').isVisible(), true);
    console.log('PASS: iPad landscape / portrait, focus mode, phone layout and install guide');

    const damagedContext = await browser.newContext();
    const damaged = await damagedContext.newPage();
    await damaged.goto(url);
    await damaged.evaluate(key => localStorage.setItem(key, 'broken data preserved'), key);
    await damaged.reload();
    assert.equal(await damaged.locator('#storage-warning').isVisible(), true);
    await damaged.locator('#production').fill('測試保護');
    assert.equal(await damaged.evaluate(key => localStorage.getItem(key), key), 'broken data preserved');
    const quotaContext = await browser.newContext();
    await quotaContext.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); }; });
    const quota = await quotaContext.newPage();
    await quota.goto(url);
    await quota.locator('#sound').uncheck();
    await quota.locator('#clap-button').click();
    await count(quota, 1);
    assert.equal(await quota.locator('#storage-warning').isVisible(), true);
    assert.ok((await quota.locator('#save-status').textContent()).includes('尚未'));
    console.log('PASS: corrupt storage preserved and quota failure clearly reported without losing in-memory take');
    assert.deepEqual(errors, [], 'no browser JavaScript errors');
    console.log('All browser checks passed. Screenshots:', output);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
