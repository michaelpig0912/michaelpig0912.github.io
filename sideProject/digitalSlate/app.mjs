import { STORAGE_KEY, SOUND_TYPES, defaultForm, defaultSettings, normalizeForm, pad, timecode, localDate, makeRecord, parseBackup, mergeRecords, recordsToCSV } from './model.mjs';
import { createSoundSamples } from './sounds.mjs';

const $ = (id) => document.getElementById(id);
const isIPad = /iPad/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
document.documentElement.classList.toggle('is-ipad', isIPad);
let state = { version: 1, form: { ...defaultForm }, settings: { ...defaultSettings }, records: [] };
let storageBlocked = false;
let busy = false;
let generation = 0;
let countdownTimer;
let releaseTimer;
let frozenRecord = null;
let activeRecordId = null;
let toastTimer;
let audioContext;
const soundBuffers = new Map();
let focusScrollY = 0;
let wakeLock;
let wakePending = false;
let deferredInstall;
let waitingWorker;

function toast(message) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').hidden = false;
  toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4200);
}
function storageWarning(message) {
  $('storage-warning').textContent = message;
  $('storage-warning').hidden = false;
  $('save-status').textContent = '尚未永久儲存';
  $('save-status').classList.add('unsaved');
}
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) state = parseBackup(saved);
} catch (error) {
  storageBlocked = true;
  storageWarning('無法讀取既有紀錄，已保留原始資料，不會覆寫。這次拍攝請用「備份 JSON」另存紀錄；重新開啟前請先匯出。');
}

function persist() {
  if (storageBlocked) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $('save-status').textContent = '已存於此裝置';
    $('save-status').classList.remove('unsaved');
    $('storage-warning').hidden = true;
    return true;
  } catch {
    storageWarning('裝置儲存空間不足或瀏覽器不允許儲存。目前資料只保留在這個頁面，請立即備份 JSON，關閉頁面後可能遺失。');
    return false;
  }
}
function fillForm() {
  for (const [key, value] of Object.entries(state.form)) {
    if (key === 'isTail') $(key).value = value ? 'tail' : 'normal';
    else $(key).value = value;
  }
  $('sound').checked = state.settings.sound;
  $('auto-next').checked = state.settings.autoNext;
  $('keep-awake').checked = state.settings.keepAwake;
  $('countdown').value = state.settings.countdown;
  $('sound-type').value = state.settings.soundType;
  for (const input of document.querySelectorAll('[name=boardTheme]')) input.checked = input.value === state.settings.boardTheme;
  document.body.dataset.boardTheme = state.settings.boardTheme;
}
function readForm() {
  state.form = normalizeForm(Object.fromEntries(new FormData($('slate-form'))));
}
function renderBoard() {
  const form = frozenRecord || state.form;
  for (const field of ['production', 'roll', 'scene', 'shot', 'director', 'camera']) {
    $(`board-${field}`).textContent = form[field].trim() || (field === 'production' ? '未命名製作' : '—');
  }
  $('board-take').textContent = pad(form.take);
  document.body.classList.toggle('tail-slate', form.isTail);
  $('tail-toggle').setAttribute('aria-pressed', String(form.isTail));
  $('tail-toggle').textContent = form.isTail ? '板別：尾板' : '板別：正常';
  for (const field of ['roll', 'scene', 'shot', 'take']) {
    const display = $(`board-${field}`);
    display.classList.toggle('long-value', display.textContent.length > 3);
    display.style.setProperty('--value-length', Math.max(2, display.textContent.length));
  }
  $('board-fps').textContent = `${form.fps} FPS`;
  renderClock();
}
function resetClapHint() {
  $('clap-hint').textContent = state.settings.sound ? `${SOUND_TYPES[state.settings.soundType]} · 打板後自動儲存` : '無聲 · 打板後自動儲存';
}
function renderClock() {
  if (document.hidden) return;
  const timestamp = frozenRecord?.timestamp ?? Date.now();
  const code = frozenRecord?.timecode ?? timecode(timestamp, state.form.fps);
  $('timecode').replaceChildren(document.createTextNode(code.slice(0, 8)), Object.assign(document.createElement('span'), { textContent: code.slice(8) }));
  $('board-date').textContent = localDate(timestamp);
  $('today-label').textContent = `${localDate(Date.now())} / ${['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()]}`;
}
function updateRecordField(record, key, value) {
  record[key] = value;
  persist(); renderRecords();
}
function renderRecords() {
  const total = state.records.length;
  const slateFilter = $('filter-slate').value;
  const records = state.records.filter(record => slateFilter === 'all' || record.isTail === (slateFilter === 'tail'));
  $('record-count').textContent = total;
  $('clear-count').textContent = total;
  $('clear-records').disabled = !total || busy;
  $('empty-state').hidden = total > 0;
  $('record-filters').hidden = !total;
  $('no-matching-records').hidden = !total || records.length > 0;
  $('records-table-wrap').hidden = !records.length;
  $('filtered-count').textContent = `顯示 ${records.length} / ${total} 筆`;
  $('export-csv').disabled = !total;
  const fragment = document.createDocumentFragment();
  for (const record of [...records].sort((a, b) => b.timestamp - a.timestamp)) {
    const row = document.createElement('tr');
    row.dataset.recordId = record.id;
    const cell = (text = '') => { const td = document.createElement('td'); td.textContent = text; row.append(td); return td; };
    const time = cell(record.timecode);
    time.append(Object.assign(document.createElement('span'), { className: 'record-date', textContent: localDate(record.timestamp) }));
    if (!record.soundPlayed) time.append(Object.assign(document.createElement('span'), { className: 'record-silent', textContent: '無音效' }));
    const scene = cell(`${record.roll || '—'} / ${record.scene || '—'} / ${record.shot || '—'}`);
    scene.append(Object.assign(document.createElement('span'), { className: 'record-production', textContent: record.production || '未命名製作' }));
    cell(pad(record.take));
    const slate = document.createElement('select');
    slate.append(new Option('正常', 'normal'), new Option('尾板', 'tail'));
    slate.value = record.isTail ? 'tail' : 'normal';
    slate.setAttribute('aria-label', `Take ${record.take} 板別`);
    slate.addEventListener('change', () => updateRecordField(record, 'isTail', slate.value === 'tail'));
    cell().append(slate);
    const rating = Object.assign(document.createElement('button'), { type: 'button', className: `rating ${record.rating}`, textContent: { unrated: '未評記', ok: 'OK', keep: 'KEEP', ng: 'NG' }[record.rating] });
    rating.setAttribute('aria-label', `Take ${record.take} 評記：${rating.textContent}，點擊編輯`);
    rating.addEventListener('click', () => editRecord(record.id));
    cell().append(rating);
    cell(record.notes || '—').className = 'record-note';
    const edit = Object.assign(document.createElement('button'), { type: 'button', className: 'edit-record', textContent: '編輯 ↗' });
    edit.setAttribute('aria-label', `編輯 Take ${record.take} 的紀錄`);
    edit.addEventListener('click', () => editRecord(record.id));
    cell().append(edit);
    fragment.append(row);
  }
  $('records-list').replaceChildren(fragment);
}

// Resume from the user's gesture, before a countdown, for Safari's audio policy.
async function prepareAudio() {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return false;
    if (!audioContext || audioContext.state === 'closed') audioContext = new Audio({ latencyHint: 'interactive' });
    if (audioContext.state !== 'running') {
      let timeout;
      try { await Promise.race([audioContext.resume(), new Promise(resolve => { timeout = setTimeout(resolve, 1200); })]); }
      finally { clearTimeout(timeout); }
    }
    return audioContext.state === 'running';
  } catch { return false; }
}
function playClap(type = state.settings.soundType) {
  if (!audioContext || audioContext.state !== 'running') return false;
  try {
    const cacheKey = `${type}:${audioContext.sampleRate}`;
    let buffer = soundBuffers.get(cacheKey);
    if (!buffer) {
      const samples = createSoundSamples(type, audioContext.sampleRate);
      buffer = audioContext.createBuffer(1, samples.length, audioContext.sampleRate);
      buffer.copyToChannel(samples, 0);
      soundBuffers.set(cacheKey, buffer);
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.onended = () => source.disconnect();
    source.start();
    return true;
  } catch { return false; }
}

function setBusy(value) {
  busy = value;
  $('clap-button').disabled = value;
  $('clapper').disabled = value;
  $('slate-fields').disabled = value;
  $('import-json').disabled = value;
  $('tail-toggle').disabled = value;
  $('clear-records').disabled = value || !state.records.length;
}
function cancelCountdown(announce = true) {
  generation++;
  clearTimeout(countdownTimer);
  clearTimeout(releaseTimer);
  frozenRecord = null;
  $('clap-overlay').hidden = true;
  $('cancel-countdown').hidden = true;
  $('slate-frame').classList.remove('is-clapping');
  $('clap-label').textContent = '打板';
  resetClapHint();
  setBusy(false);
  renderBoard();
  if (announce) toast('已取消倒數，沒有新增紀錄。');
}
function commitClap(snapshot, token) {
  if (token !== generation || document.hidden) return;
  const timestamp = Date.now();
  const soundPlayed = state.settings.sound && playClap();
  const id = globalThis.crypto?.randomUUID?.() || `${timestamp}-${Math.random().toString(36).slice(2)}`;
  const record = makeRecord(snapshot, timestamp, soundPlayed, id);
  frozenRecord = record;
  $('clap-overlay').hidden = true;
  $('cancel-countdown').hidden = true;
  $('slate-frame').classList.add('is-clapping');
  $('clap-label').textContent = `TAKE ${pad(record.take)} · 已打板`;
  renderBoard();
  state.records.unshift(record);
  if (state.settings.autoNext && record.take < 9999) {
    state.form.take = record.take + 1;
    state.form.notes = '';
    fillForm();
  }
  const saved = persist();
  renderRecords();
  $('clap-hint').textContent = saved ? `TAKE ${pad(record.take)} 已儲存` : '這一鏡尚未永久儲存，請匯出備份。';
  if (state.settings.sound && !soundPlayed) toast('這次音效無法播放；紀錄已標示無音效。請按「試聽」再試一次。');
  else if (record.take === 9999 && state.settings.autoNext) toast('Take 已達 9999，請切換場次並重設 Take。');
  releaseTimer = setTimeout(() => {
    if (token !== generation) return;
    frozenRecord = null;
    $('slate-frame').classList.remove('is-clapping');
    $('clap-label').textContent = '打板';
    setBusy(false);
    renderBoard();
  }, 1100);
}
async function clap() {
  if (busy || document.querySelector('dialog[open]')) return;
  if (!$('slate-form').reportValidity()) {
    if (document.body.classList.contains('focus-mode')) toggleFocus();
    return;
  }
  readForm();
  const snapshot = { ...state.form };
  const token = ++generation;
  setBusy(true);
  if (state.settings.sound) await prepareAudio();
  if (token !== generation || document.hidden) return;
  requestWakeLock();
  if (!state.settings.countdown) { commitClap(snapshot, token); return; }
  const deadline = performance.now() + state.settings.countdown * 1000;
  $('clap-overlay').hidden = false;
  $('cancel-countdown').hidden = false;
  const tick = () => {
    if (token !== generation) return;
    const remaining = Math.ceil((deadline - performance.now()) / 1000);
    if (remaining <= 0) { commitClap(snapshot, token); return; }
    $('clap-overlay-text').textContent = remaining;
    $('clap-label').textContent = `${remaining} 秒後打板`;
    $('clap-hint').textContent = '倒數中，切換到其他 App 會自動取消。';
    countdownTimer = setTimeout(tick, 80);
  };
  tick();
}

async function requestWakeLock() {
  if (!state.settings.keepAwake || document.hidden || wakePending || wakeLock) return;
  if (!('wakeLock' in navigator)) { $('wake-status').textContent = '此瀏覽器不支援螢幕恆亮'; return; }
  wakePending = true;
  try {
    const lock = await navigator.wakeLock.request('screen');
    if (!state.settings.keepAwake || document.hidden) { await lock.release(); return; }
    wakeLock = lock;
    $('wake-status').textContent = '● 螢幕恆亮中';
    lock.addEventListener('release', () => {
      if (wakeLock === lock) wakeLock = null;
      $('wake-status').textContent = state.settings.keepAwake ? '螢幕恆亮已暫停' : '螢幕恆亮未開啟';
    });
  } catch { $('wake-status').textContent = '恆亮未啟用，請檢查省電設定'; }
  finally { wakePending = false; }
}
function setFocusMode(enabled) {
  if (enabled) focusScrollY = window.scrollY;
  document.body.classList.toggle('focus-mode', enabled);
  $('focus-toggle').setAttribute('aria-pressed', String(enabled));
  $('focus-toggle').querySelector('span').textContent = enabled ? '離開全螢幕' : '專注模式';
  if (!enabled) window.scrollTo(0, focusScrollY);
}
async function toggleFocus() {
  const enabled = !document.body.classList.contains('focus-mode');
  setFocusMode(enabled);
  try {
    const root = document.documentElement;
    if (enabled) {
      const request = root.requestFullscreen || root.webkitRequestFullscreen;
      if (request) await request.call(root);
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (document.fullscreenElement || document.webkitFullscreenElement) await exit?.call(document);
    }
  } catch { /* Viewport-filling layout remains available without the Fullscreen API. */ }
}
for (const event of ['fullscreenchange', 'webkitfullscreenchange']) {
  document.addEventListener(event, () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && document.body.classList.contains('focus-mode')) setFocusMode(false);
  });
}

function editRecord(id) {
  if (busy && !frozenRecord) cancelCountdown();
  const record = state.records.find(item => item.id === id);
  if (!record) return;
  activeRecordId = id;
  $('record-title').textContent = `場次 ${record.scene || '—'} / ${record.shot || '—'} · Take ${pad(record.take)}`;
  $('record-meta').textContent = `${record.production || '未命名製作'} · ${localDate(record.timestamp)} ${record.timecode} · ${record.fps} FPS${record.soundPlayed ? '' : ' · 無音效'}`;
  $('record-notes').value = record.notes;
  $('record-isTail').value = record.isTail ? 'tail' : 'normal';
  $('record-rating').value = record.rating;
  $('record-dialog').showModal();
}
function download(content, type, extension) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `SLATE-${localDate(Date.now()).replaceAll('.', '-')}-${Date.now()}.${extension}`;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function exportJSON() { download(JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2), 'application/json;charset=utf-8', 'json'); }

$('slate-form').addEventListener('submit', event => event.preventDefault());
$('slate-form').addEventListener('input', event => {
  if (!Object.hasOwn(defaultForm, event.target.name)) return;
  readForm(); persist(); renderBoard();
});
$('take').addEventListener('change', () => { $('take').value = state.form.take; });
for (const input of document.querySelectorAll('[name=boardTheme]')) {
  input.addEventListener('change', () => {
    if (!input.checked) return;
    state.settings.boardTheme = input.value;
    document.body.dataset.boardTheme = input.value;
    persist();
  });
}
$('sound-type').addEventListener('change', () => {
  state.settings.soundType = $('sound-type').value;
  persist(); resetClapHint();
});
for (const [id, key] of [['sound', 'sound'], ['auto-next', 'autoNext'], ['keep-awake', 'keepAwake'], ['countdown', 'countdown']]) {
  $(id).addEventListener('change', async () => {
    state.settings[key] = key === 'countdown' ? Number($(id).value) : $(id).checked;
    persist();
    if (key === 'sound') { resetClapHint(); if (state.settings.sound) await prepareAudio(); }
    if (key === 'keepAwake') {
      if (state.settings.keepAwake) requestWakeLock();
      else { if (wakeLock) await wakeLock.release(); $('wake-status').textContent = '螢幕恆亮未開啟'; }
    }
  });
}
$('clap-button').addEventListener('click', clap);
$('clapper').addEventListener('click', clap);
$('cancel-countdown').addEventListener('click', () => cancelCountdown());
$('focus-toggle').addEventListener('click', toggleFocus);
$('tail-toggle').addEventListener('click', () => {
  if (busy) return;
  state.form.isTail = !state.form.isTail;
  $('isTail').value = state.form.isTail ? 'tail' : 'normal';
  persist(); renderBoard();
});
$('test-sound').addEventListener('click', async () => {
  $('test-sound').disabled = true;
  const ready = await prepareAudio();
  const played = ready && playClap();
  toast(played ? `試聽：${SOUND_TYPES[state.settings.soundType]}` : '無法播放音效，請確認裝置音量與靜音設定後重試。');
  $('test-sound').disabled = false;
});
$('record-form').addEventListener('submit', event => {
  event.preventDefault();
  const record = state.records.find(item => item.id === activeRecordId);
  if (record) {
    record.notes = $('record-notes').value;
    record.rating = $('record-rating').value;
    record.isTail = $('record-isTail').value === 'tail';
    persist(); renderRecords();
  }
  $('record-dialog').close();
});
$('delete-record').addEventListener('click', () => {
  if (!window.confirm('確定刪除這筆拍攝紀錄？此操作無法復原。')) return;
  state.records = state.records.filter(item => item.id !== activeRecordId);
  persist(); renderRecords(); $('record-dialog').close(); toast('已刪除此筆紀錄。');
});
$('filter-slate').addEventListener('input', renderRecords);
$('clear-records').addEventListener('click', () => {
  if (busy || !state.records.length) return;
  $('clear-count').textContent = state.records.length;
  $('clear-dialog').showModal();
});
$('confirm-clear').addEventListener('click', () => {
  state.records = [];
  $('filter-slate').value = 'all';
  const saved = persist();
  renderRecords(); $('clear-dialog').close();
  toast(saved ? '已清除全部拍攝紀錄。' : '無法永久清除；目前頁面已清空，重新開啟可能恢復舊紀錄。');
});
$('export-csv').addEventListener('click', () => download(recordsToCSV(state.records), 'text/csv;charset=utf-8', 'csv'));
$('export-json').addEventListener('click', exportJSON);
$('import-json').addEventListener('click', () => $('import-file').click());
$('import-file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 25 * 1024 * 1024) throw new Error('備份檔超過 25 MB，請分批匯入。');
    const backup = parseBackup(await file.text());
    if (busy) throw new Error('請等打板完成，再重新匯入。');
    const before = state.records.length;
    state.records = mergeRecords(state.records, backup.records);
    const saved = persist(); renderRecords();
    toast(`已匯入 ${state.records.length - before} 筆新紀錄，既有紀錄保持不變。${saved ? '' : '請備份，目前無法永久儲存。'}`);
  } catch (error) { toast(error instanceof SyntaxError ? '無法讀取 JSON，請選擇 SLATE 匯出的備份檔。' : error.message); }
  finally { event.target.value = ''; }
});
for (const button of document.querySelectorAll('[data-close]')) button.addEventListener('click', () => button.closest('dialog').close());
function showHelp() {
  if (busy && !frozenRecord) cancelCountdown();
  $('help-dialog').showModal();
}
$('open-help').addEventListener('click', showHelp);
document.addEventListener('keydown', event => {
  const isEditing = /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(event.target.tagName) || event.target.isContentEditable;
  if (event.code === 'Space' && !isEditing && !document.querySelector('dialog[open]')) { event.preventDefault(); if (!event.repeat) clap(); }
  if (event.key === 'Escape') {
    if (document.querySelector('dialog[open]')) return;
    if (busy && !frozenRecord) cancelCountdown();
    else if (document.body.classList.contains('focus-mode')) toggleFocus();
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && busy) cancelCountdown(!frozenRecord);
  if (!document.hidden) { renderClock(); requestWakeLock(); }
});
window.addEventListener('pagehide', () => { if (busy) cancelCountdown(false); });
window.addEventListener('pageshow', () => requestWakeLock());
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY || !event.newValue || storageBlocked) return;
  // Every local edit is saved immediately. Accept the latest state from other tabs.
  try {
    const next = parseBackup(event.newValue);
    if (busy) cancelCountdown(false);
    for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
    state = next; fillForm(); renderBoard(); renderRecords(); resetClapHint();
    if (!state.settings.keepAwake && wakeLock) wakeLock.release();
    else requestWakeLock();
    toast('已載入另一個分頁更新的紀錄。');
  } catch { toast('另一個分頁的資料格式有誤，目前紀錄保持不變。'); }
});

window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstall = event; });
window.addEventListener('appinstalled', () => { deferredInstall = null; $('install-app').hidden = true; toast('SLATE 已加入你的裝置。'); });
$('install-app').addEventListener('click', async () => {
  if (deferredInstall) { const prompt = deferredInstall; deferredInstall = null; await prompt.prompt(); await prompt.userChoice; }
  else showHelp();
});
if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) $('install-app').hidden = true;
let offlineReady = false;
function updateOfflineStatus(error = false) {
  $('offline-status').textContent = offlineReady ? (navigator.onLine ? '可離線使用' : '離線模式') : error ? '離線功能未就緒' : navigator.onLine ? '準備離線使用中' : '離線快取未就緒';
  $('offline-status').parentElement.dataset.state = offlineReady ? 'ready' : error ? 'error' : 'pending';
}
window.addEventListener('online', () => updateOfflineStatus());
window.addEventListener('offline', () => updateOfflineStatus());
if ('serviceWorker' in navigator && window.isSecureContext) {
  navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).then(async registration => {
    function offerUpdate() { if (registration.waiting && navigator.serviceWorker.controller) { waitingWorker = registration.waiting; $('update-app').hidden = false; } }
    offerUpdate();
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => { if (worker.state === 'installed') offerUpdate(); if (worker.state === 'redundant' && !offlineReady) updateOfflineStatus(true); });
    });
    await navigator.serviceWorker.ready;
    offlineReady = true; updateOfflineStatus();
  }).catch(() => updateOfflineStatus(true));
  $('update-app').addEventListener('click', () => {
    if (busy || document.querySelector('dialog[open]')) { toast('請先完成這一鏡或儲存編輯，再更新版本。'); return; }
    if (!persist()) { toast('請先備份未儲存的紀錄，再重新整理更新。'); return; }
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
  });
} else updateOfflineStatus(true);

fillForm(); renderBoard(); renderRecords(); resetClapHint(); requestWakeLock();
setInterval(renderClock, 40);
