// Menyatakan satu video SIAP RENDER: cue kata lengkap → naskah VN ditulis → katalog gaya ditandai → berkas DRAF dihapus.
//   node lib/siap.js <folder>
// Setelah ini folder otomatis masuk antrean RENDER.bat. Jalankan hanya setelah QA still kedua format beres.
// Data naskah diambil dari scenes.js: CONFIG.meta { judul, gaya, jenisHook, hook, komposisi, sasaran, pengisi, rekam[], fakta[] }
// dan bidang `layar` di tiap scene (uraian singkat apa yang tampil).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const folder = path.basename(process.argv[2] || ''), dir = path.join(ROOT, folder);
const gagal = (m) => { console.error(`${folder}: ${m}`); process.exit(1); };
if (!folder || !fs.existsSync(path.join(dir, 'scenes.js'))) gagal('folder tidak ditemukan');
const tlFile = path.join(dir, 'timeline.js');
if (!fs.existsSync(tlFile)) gagal('timeline.js belum ada: node build.js ' + folder + ' --audio-only');
for (const f of ['scenes.js', 'music.js']) {
  const p = path.join(dir, f);
  if (fs.existsSync(p) && fs.statSync(p).mtimeMs > fs.statSync(tlFile).mtimeMs + 1000) gagal(`${f} lebih baru daripada timeline.js: bangun ulang audio dulu`);
}
try { execFileSync('node', [path.join(__dirname, 'cek-cue.js'), folder], { stdio: 'pipe' }); } catch (e) { console.error(String(e.stdout || e.message)); gagal('cue kata belum lengkap'); }

const { CONFIG, SCENES } = require(path.join(dir, 'scenes.js'));
const TL = JSON.parse(fs.readFileSync(tlFile, 'utf8').replace(/^window\.TIMELINE\s*=\s*/, '').replace(/;\s*$/, ''));
const M = CONFIG.meta || {}, kode = CONFIG.naskah;
if (!kode || !M.judul || !M.gaya || !M.hook || !M.jenisHook || !M.komposisi || !(M.fakta || []).length) gagal('CONFIG.naskah / CONFIG.meta {judul, gaya, jenisHook, hook, komposisi, fakta[]} belum lengkap');
const semua = JSON.stringify([CONFIG, SCENES]);
if (/vendor/i.test(semua)) gagal('ada kata "vendor": pakai "pihak ketiga"');

const bungkus = (s, n, ind) => {
  const out = []; let ln = '';
  for (const w of String(s).split(/\s+/)) { if ((ln + ' ' + w).trim().length > n) { out.push(ln); ln = w; } else ln = (ln + ' ' + w).trim(); }
  if (ln) out.push(ln);
  return out.join('\n' + ' '.repeat(ind));
};
const garis = '-'.repeat(64);
const L = [];
L.push(`NASKAH ${kode} — "${M.judul.toUpperCase()}" · GAYA: ${M.gaya.toUpperCase()}`, '='.repeat(64));
L.push(`Jenis      : ${bungkus(M.jenis || 'video pendek satu gaya (seri katalog gaya)', 100, 13)}`);
L.push(`Gaya       : ${bungkus(M.tampilan ? `${M.gaya} — ${M.tampilan}` : M.gaya, 100, 13)}`);
L.push(`Durasi     : ± ${Math.round(TL.total)} detik`);
L.push(`Format     : 16:9 dan 9:16${CONFIG.burnCaptions === false ? ' (subtitle tidak dibakar karena teks di layar sudah memuat ucapan; .srt tetap tersedia)' : ''}`);
L.push(`Komposisi  : ${M.komposisi}`);
L.push(`Sasaran    : ${bungkus(M.sasaran || 'pemilik bisnis, manajemen, DPO/PPDP', 100, 13)}`);
L.push(`Hook       : ${bungkus(`${M.jenisHook.toLowerCase()} — ${M.hook}`, 100, 13)}`);
L.push(`Pengisi    : ${M.pengisi || '1 suara (bebas pria/wanita)'}`);
L.push(`Video      : SUDAH DIRAKIT (folder motion/${folder}). Suara sementara = TTS`, '', '');
L.push('CARA REKAM', garis);
const bagian = SCENES.filter((s) => s.vo).map((s) => `${kode}_${s.id.toUpperCase()}`);
L.push(`1. Satu bagian = satu file: ${bagian.join(', ')} (atau satu file utuh ${kode} dengan jeda 2 detik antarbagian).`);
L.push('2. Baca PERSIS sesuai teks VO: gambar di layar mengikuti kata yang diucapkan.');
L.push('3. Ruangan senyap, jarak mulut ke HP/mic ± 20 cm, sisakan ± 1 detik hening di awal dan akhir.');
(M.rekam || []).forEach((x, i) => L.push(`${i + 4}. ${x}`));
L.push('', '', 'NASKAH', garis);
SCENES.forEach((s) => {
  const tag = `[${s.id.toUpperCase()}]`.padEnd(6);
  L.push(`${tag}VO: ${s.vo ? `"${s.vo}"` : '(tanpa suara)'}`);
  if (s.layar) L.push(`      Layar: ${bungkus(s.layar, 100, 13)}`);
});
L.push('', '', 'DASAR FAKTA (untuk tim, tidak dibaca)', garis);
M.fakta.forEach((x) => L.push('- ' + bungkus(x, 110, 2)));
L.push('- Musik & efek suara disintesis sendiri. Kontak: support@privasimu.com · 0851 8318 2722.');
L.push('- Suara TTS hanya sementara; untuk tayang pakai rekaman tim atau TTS berlisensi.');
const slug = folder.replace(/^[a-z]+\d+-/, '');
const nf = path.join(ROOT, 'naskah', `${kode}-${slug}.txt`);
fs.writeFileSync(nf, L.join('\n') + '\n');

// tandai katalog gaya: baris R('KODE', … 'Bisa' → 'Sudah (KODE)'
let tanda = 'katalog: kode tidak ada di katalog gaya';
for (const f of ['gaya_ty.py', 'gaya_gb.py', 'gaya_lain.py']) {
  const p = path.join(ROOT, 'rancangan', 'sumber', f);
  const s = fs.readFileSync(p, 'utf8'), i = s.indexOf(`R('${kode}',`);
  if (i < 0) continue;
  const j = s.indexOf("R('", i + 5), blok = s.slice(i, j < 0 ? s.length : j);
  if (/'Sudah \(/.test(blok)) { tanda = 'katalog: sudah bertanda'; break; }
  const k = blok.search(/'(Bisa|Berat)',/);
  if (k < 0) { tanda = 'katalog: status tidak ditemukan, periksa manual'; break; }
  const baru = blok.slice(0, k) + `'Sudah (${kode})',` + blok.slice(k).replace(/^'(Bisa|Berat)',/, '');
  fs.writeFileSync(p, s.slice(0, i) + baru + s.slice(i + blok.length));
  tanda = `katalog: ${kode} -> Sudah`;
  break;
}
const draf = path.join(dir, 'DRAF');
if (fs.existsSync(draf)) fs.unlinkSync(draf);
console.log(`${folder}: SIAP RENDER | ${TL.total.toFixed(1)} dtk | naskah/${path.basename(nf)} | ${tanda}`);
