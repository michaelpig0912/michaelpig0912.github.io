import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultForm, defaultSettings, normalizeForm, normalizeSettings, timecode, makeRecord, parseBackup, mergeRecords, recordsToCSV } from '../themes/butterfly/source/sideProject/digitalSlate/model.mjs';
import { createSoundSamples } from '../themes/butterfly/source/sideProject/digitalSlate/sounds.mjs';

const timestamp = new Date(2026, 8, 20, 14, 3, 9, 999).getTime();
const make = (overrides = {}, id = 'take-1') => makeRecord({ ...defaultForm, ...overrides }, timestamp, true, id);
const backup = (records) => JSON.stringify({ version: 1, form: defaultForm, settings: defaultSettings, records });

test('old settings retain data and receive default sound and board color', () => {
  assert.deepEqual(normalizeSettings({ sound: false, countdown: 3 }), { ...defaultSettings, sound: false, countdown: 3 });
  assert.equal(normalizeSettings({ boardTheme: 'white', soundType: 'wood' }).boardTheme, 'white');
  assert.equal(normalizeSettings({ boardTheme: 'white', soundType: 'wood' }).soundType, 'wood');
  assert.equal(normalizeSettings({ boardTheme: '<bad>', soundType: 'toString' }).soundType, 'clack');
  const oldBackup = JSON.stringify({ version: 1, records: [make()], settings: { sound: false } });
  assert.equal(parseBackup(oldBackup).settings.boardTheme, 'black');
  assert.equal(parseBackup(oldBackup).records.length, 1);
});

test('all sound choices have distinct, bounded waveforms and a quiet end at device sample rates', () => {
  for (const sampleRate of [44100, 48000]) {
    const signatures = new Set();
    for (const type of ['clack', 'wood', 'beep']) {
      const samples = createSoundSamples(type, sampleRate);
      let peak = 0;
      for (const value of samples) { assert.ok(Number.isFinite(value)); peak = Math.max(peak, Math.abs(value)); }
      assert.ok(peak > .4 && peak <= .91, 'audible signal without clipping');
      assert.equal(Math.abs(samples[0]), 0);
      assert.ok(Math.abs(samples.at(-1)) < .001, 'no abrupt cutoff');
      signatures.add(Array.from(samples.slice(0, 200)).join(','));
    }
    assert.equal(signatures.size, 3);
  }
});

test('a clap snapshots notes and slate settings without changing earlier takes', () => {
  const form = { ...defaultForm, scene: '12B', take: 7, notes: '雨聲，保留' };
  const record = makeRecord(form, timestamp, true, 'snapshot');
  form.notes = ''; form.take++;
  assert.equal(record.notes, '雨聲，保留');
  assert.equal(record.take, 7);
  assert.equal(record.scene, '12B');
  assert.equal(record.timecode, '14:03:09:24');
  assert.equal(record.soundPlayed, true);
});
test('frame digits stay in the selected integer frame rate, including second rollover', () => {
  for (const fps of [24, 25, 30, 50, 60]) {
    assert.equal(timecode(timestamp, fps), `14:03:09:${String(fps - 1).padStart(2, '0')}`);
    assert.equal(timecode(timestamp + 1, fps), '14:03:10:00');
  }
});
test('invalid take / fps values cannot corrupt state', () => {
  for (const take of [-2, 0, 2.5, 10000, 'bad']) assert.equal(normalizeForm({ take }).take, 1);
  assert.equal(normalizeForm({ fps: 29.97 }).fps, 25);
  assert.equal(normalizeForm({ take: '9999', fps: '60' }).take, 9999);
  assert.equal(normalizeForm({ scene: 'x'.repeat(100) }).scene.length, 12);
});
test('JSON backup roundtrip preserves Unicode, newlines, ratings and clap timecode', () => {
  const record = { ...make({ production: '九月的午後', notes: '第一行\n第二行 🎬' }), rating: 'ok' };
  assert.deepEqual(parseBackup(backup([record])).records, [record]);
});
test('bad imports are rejected as a whole, including duplicate IDs and malformed records', () => {
  assert.throws(() => parseBackup('{}'));
  assert.throws(() => parseBackup(backup([make(), make()])));
  for (const patch of [{ timestamp: null }, { rating: 'bad' }, { fps: 0 }, { id: '' }, { notes: {} }, { soundPlayed: 'yes' }, { take: 0 }, { timecode: '<script>' }]) {
    assert.throws(() => parseBackup(backup([make({}, 'valid'), { ...make({}, 'bad'), ...patch }])));
  }
});
test('reimport is idempotent and preserves locally edited ratings and notes', () => {
  const original = make();
  const edited = { ...original, notes: '現場補記', rating: 'ok' };
  const second = { ...make({}, 'take-2'), timestamp: timestamp + 5000 };
  const merged = mergeRecords([edited], [original, second]);
  assert.deepEqual(merged, [second, edited]);
  assert.deepEqual(mergeRecords(merged, [original, second]), merged);
});
test('CSV keeps Chinese text / quotes / multiline notes and neutralizes spreadsheet formulas', () => {
  const csv = recordsToCSV([make({ production: '=HYPERLINK("bad")', director: '  +SUM(1,2)', notes: '收音正常\n他說「OK」,"再一鏡"' })]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"\'=HYPERLINK(""bad"")"'));
  assert.ok(csv.includes('"\'  +SUM(1,2)"'));
  assert.ok(csv.includes('"收音正常\n他說「OK」,""再一鏡"""'));
  assert.ok(csv.includes(new Date(timestamp).toISOString()));
});
