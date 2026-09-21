export const STORAGE_KEY = 'michaelpig.digital-slate.v1';
export const FPS_OPTIONS = [24, 25, 30, 50, 60];
export const BOARD_THEMES = ['black', 'white', 'navy', 'green', 'burgundy'];
export const SOUND_TYPES = { clack: '經典喀聲', wood: '低沉木板聲', beep: '電子嗶聲' };
export const defaultForm = { production: '', roll: '001', scene: '01', shot: 'A', take: 1, director: '', camera: '', fps: 25, notes: '', isTail: false };
export const defaultSettings = { sound: true, soundType: 'clack', boardTheme: 'black', autoNext: true, keepAwake: false, countdown: 0 };
const limits = { production: 80, roll: 12, scene: 12, shot: 12, director: 60, camera: 60, notes: 2000 };
export const pad = (value) => String(value).padStart(2, '0');
export function normalizeForm(value = {}) {
  const form = { ...defaultForm };
  for (const [key, max] of Object.entries(limits)) {
    if (typeof value[key] === 'string') form[key] = value[key].slice(0, max);
  }
  const take = Number(value.take);
  form.take = Number.isInteger(take) && take >= 1 && take <= 9999 ? take : 1;
  form.fps = FPS_OPTIONS.includes(Number(value.fps)) ? Number(value.fps) : 25;
  form.isTail = value.isTail === true || value.isTail === 'tail';
  return form;
}
export function normalizeSettings(value = {}) {
  const settings = { ...defaultSettings };
  for (const key of ['sound', 'autoNext', 'keepAwake']) if (typeof value[key] === 'boolean') settings[key] = value[key];
  if ([0, 3, 5].includes(value.countdown)) settings.countdown = value.countdown;
  if (BOARD_THEMES.includes(value.boardTheme)) settings.boardTheme = value.boardTheme;
  if (Object.hasOwn(SOUND_TYPES, value.soundType)) settings.soundType = value.soundType;
  return settings;
}
export function timecode(timestamp, fps = 25) {
  const date = new Date(timestamp);
  return [date.getHours(), date.getMinutes(), date.getSeconds(), Math.floor(date.getMilliseconds() * fps / 1000)].map(pad).join(':');
}
export function localDate(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}
export function makeRecord(form, timestamp, soundPlayed, id) {
  const normalized = normalizeForm(form);
  return { ...normalized, id, timestamp, timecode: timecode(timestamp, normalized.fps), rating: 'unrated', soundPlayed };
}
export function parseBackup(text) {
  const data = JSON.parse(text);
  if (!data || data.version !== 1 || !Array.isArray(data.records)) throw new Error('這不是 SLATE v1 的 JSON 備份檔。');
  if (data.records.length > 50000) throw new Error('備份筆數過多，請分批匯入。');
  const ids = new Set();
  const records = data.records.map((record) => {
    if (!record || typeof record.id !== 'string' || record.id.length > 100 || !record.id || ids.has(record.id) ||
      !Number.isSafeInteger(record.timestamp) || record.timestamp < 0 || record.timestamp > 8640000000000000 ||
      !['unrated', 'ok', 'keep', 'ng'].includes(record.rating) || typeof record.soundPlayed !== 'boolean' ||
      !Number.isInteger(record.take) || record.take < 1 || record.take > 9999 || !FPS_OPTIONS.includes(record.fps) ||
      !/^\d{2}:\d{2}:\d{2}:\d{2}$/.test(record.timecode)) throw new Error('備份中的拍攝紀錄格式不完整，未匯入任何資料。');
    const compatibleRecord = { ...record, roll: record.roll ?? '' };
    for (const [key, max] of Object.entries(limits)) {
      if (typeof compatibleRecord[key] !== 'string' || compatibleRecord[key].length > max) throw new Error('備份中的文字欄位格式不正確。');
    }
    if (record.isTail !== undefined && typeof record.isTail !== 'boolean') throw new Error('備份中的正常 / 尾板格式不正確。');
    ids.add(record.id);
    return { ...normalizeForm(compatibleRecord), id: record.id, timestamp: record.timestamp, timecode: record.timecode, rating: record.rating, soundPlayed: record.soundPlayed };
  });
  return { version: 1, form: normalizeForm(data.form || {}), settings: normalizeSettings(data.settings || {}), records };
}
export function mergeRecords(current, incoming) {
  const ids = new Set(current.map(record => record.id));
  return [...current, ...incoming.filter(record => !ids.has(record.id))].sort((a, b) => b.timestamp - a.timestamp);
}
// Quoting handles commas/newlines; an apostrophe also prevents spreadsheet formula execution.
function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function recordsToCSV(records) {
  const headers = ['拍攝時間（ISO 8601 / UTC）', '片名', '捲號', '場次', '鏡號', 'Take', '導演', '攝影', '板別', 'FPS', '打板時間碼（當地時間）', '評記', '音效已播放', '備註'];
  const ratings = { unrated: '未評記', ok: 'OK', keep: 'KEEP', ng: 'NG' };
  const rows = records.map(record => [new Date(record.timestamp).toISOString(), record.production, record.roll, record.scene, record.shot, record.take, record.director, record.camera, record.isTail ? '尾板' : '正常', record.fps, record.timecode, ratings[record.rating], record.soundPlayed ? '是' : '否', record.notes]);
  return '\uFEFF' + [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n');
}
