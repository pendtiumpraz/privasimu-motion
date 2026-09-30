// Menulis DAFTAR-VIDEO.md: semua folder video, kode naskah, judul, gaya, durasi, dan status render.
//   node lib/daftar-video.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const rows = [];
for (const f of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, f);
  if (!fs.existsSync(path.join(dir, 'scenes.js'))) continue;
  let C = {};
  try { C = require(path.join(dir, 'scenes.js')).CONFIG || {}; } catch (e) { /* lewati */ }
  let total = null;
  try { total = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.js'), 'utf8').replace(/^window\.TIMELINE\s*=\s*/, '').replace(/;\s*$/, '')).total; } catch (e) { /* belum dibangun */ }
  const out = path.join(ROOT, 'out', f);
  const ada = ['16x9', '9x16'].filter((x) => fs.existsSync(path.join(out, `${f}-${x}.mp4`)));
  const status = fs.existsSync(path.join(dir, 'DRAF')) ? 'masih dirakit' : ada.length === 2 ? 'sudah dirender' : ada.length ? `baru ${ada[0]}` : 'siap render';
  const M = C.meta || {};
  rows.push({ f, kode: C.naskah || '', judul: M.judul || (C.title || '').replace(/^[A-Z0-9]+\s*·\s*/, ''), gaya: M.gaya || '', hook: M.jenisHook || '', komp: M.komposisi || '', total, status });
}
const urut = (k) => { const m = /^([a-z]+)(\d+)/.exec(k.f); return m ? [m[1], +m[2]] : [k.f, 0]; };
rows.sort((a, b) => { const [x, i] = urut(a), [y, j] = urut(b); return x === y ? i - j : x < y ? -1 : 1; });
const L = ['# Daftar video', '', '> Dibuat otomatis oleh `node lib/daftar-video.js`. Jangan disunting tangan.', '',
  `Jumlah: ${rows.length} video · siap render: ${rows.filter((r) => r.status === 'siap render').length} · sudah dirender: ${rows.filter((r) => r.status === 'sudah dirender').length} · masih dirakit: ${rows.filter((r) => r.status === 'masih dirakit').length}`, '',
  '| Kode | Folder | Judul | Gaya | Hook | Komposisi | Durasi | Status |', '|---|---|---|---|---|---|---|---|'];
for (const r of rows) L.push(`| ${r.kode} | \`${r.f}\` | ${r.judul} | ${r.gaya} | ${r.hook} | ${r.komp} | ${r.total ? r.total.toFixed(1).replace('.', ',') + ' dtk' : '-'} | ${r.status} |`);
fs.writeFileSync(path.join(ROOT, 'DAFTAR-VIDEO.md'), L.join('\n') + '\n');
console.log(`DAFTAR-VIDEO.md: ${rows.length} video`);
