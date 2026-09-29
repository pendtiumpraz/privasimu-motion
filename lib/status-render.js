// Apakah sebuah video perlu dirender? Dipakai RENDER.bat supaya video yang sudah jadi tidak dirender ulang.
//   node lib/status-render.js <folder> [--fmt=16x9,9x16]
//   keluar 0  = perlu render (hasil belum ada, atau sumbernya berubah sejak render terakhir)
//   keluar 10 = sudah dirender dan tidak berubah (lewati)
//   keluar 2  = folder tidak ditemukan
// Sidik jari sumber (semua file di folder video kecuali timeline.js, ditambah rekaman VN tim untuk kode naskahnya)
// dicatat build.js di out/<folder>/render-info.json setiap satu format selesai dirender.
// Hasil lama tanpa catatan dianggap sudah jadi (render ulang dengan --paksa di RENDER.bat).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const VN = path.join(ROOT, 'vn');
const sha1 = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex').slice(0, 16);

function fingerprint(dir) {
  const out = {};
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (f === 'timeline.js' || !fs.statSync(p).isFile()) continue;
    out[f] = sha1(p);
  }
  let code = null;
  try { code = require(path.join(dir, 'scenes.js')).CONFIG.naskah; } catch (e) { /* tanpa kode naskah */ }
  if (code && fs.existsSync(VN)) {
    const re = new RegExp('^' + code + '(_S[0-9]+)?$', 'i');
    for (const f of fs.readdirSync(VN).sort()) if (re.test(path.parse(f).name)) out['vn/' + f] = sha1(path.join(VN, f));
  }
  return out;
}

// dipanggil build.js setelah satu format berhasil dirender (fp = sidik jari saat build dimulai)
function record(outDir, fmt, fp, total) {
  const f = path.join(outDir, 'render-info.json');
  let info = {};
  try { info = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { /* belum ada */ }
  info[fmt] = { at: new Date().toISOString(), total, sources: fp };
  fs.writeFileSync(f, JSON.stringify(info, null, 2));
}

module.exports = { fingerprint, record };

if (require.main === module) {
  const name = path.basename(process.argv[2] || '');
  const fmtArg = process.argv.find((a) => a.startsWith('--fmt='));
  const fmts = (fmtArg ? fmtArg.slice(6) : '16x9,9x16').split(',');
  const dir = path.join(ROOT, name);
  if (!name || !fs.existsSync(path.join(dir, 'scenes.js'))) { console.log(`   ${name}: folder tidak ditemukan`); process.exit(2); }
  const out = path.join(ROOT, 'out', name);
  let info = {};
  try { info = JSON.parse(fs.readFileSync(path.join(out, 'render-info.json'), 'utf8')); } catch (e) { /* hasil lama tanpa catatan */ }
  const now = fingerprint(dir);
  const reasons = [];
  for (const fmt of fmts) {
    if (!fs.existsSync(path.join(out, `${name}-${fmt}.mp4`))) { reasons.push(`${fmt} belum ada`); continue; }
    const rec = info[fmt];
    if (!rec) continue; // hasil lama: anggap sudah jadi
    const keys = [...new Set([...Object.keys(now), ...Object.keys(rec.sources || {})])];
    const changed = keys.filter((k) => now[k] !== (rec.sources || {})[k]);
    if (changed.length) reasons.push(`${fmt}: berubah sejak render terakhir (${changed.join(', ')})`);
  }
  if (reasons.length) { console.log(`   perlu dirender: ${reasons.join('; ')}`); process.exit(0); }
  console.log('   sudah dirender dan tidak berubah');
  process.exit(10);
}
