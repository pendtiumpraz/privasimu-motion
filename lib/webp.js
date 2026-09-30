#!/usr/bin/env node
// Konversi hasil render MP4 → WebP animasi (untuk pratinjau ringan di web/chat). MP4 asli TIDAK disentuh.
//
//   node lib/webp.js                    semua out/*/*.mp4 (yang belum punya .webp, atau .mp4-nya lebih baru)
//   node lib/webp.js gb05-satu-garis    folder tertentu saja (boleh beberapa)
//   node lib/webp.js --paksa            konversi ulang walau .webp sudah ada
//   Opsi mutu: --sisi=720 (sisi terpanjang, px)  --fps=15  --q=70 (0–100)  --paralel=1  --fmt=16x9|9x16
//
// Hasil: berdampingan dengan MP4-nya, nama sama berekstensi .webp (out/<folder>/<folder>-16x9.webp).
// Lewati otomatis bila .webp sudah ada dan tidak lebih tua dari .mp4-nya, jadi aman dijalankan berulang.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'out');
const args = process.argv.slice(2);
const opsi = { sisi: 720, fps: 15, q: 70, paralel: 1, fmt: '', paksa: false };
const folders = [];
for (const a of args) {
  if (a === '--paksa') opsi.paksa = true;
  else if (a.startsWith('--')) { const [k, v] = a.slice(2).split('='); if (k in opsi) opsi[k] = typeof opsi[k] === 'number' ? Number(v) : v; else console.warn(`opsi tak dikenal: ${a}`); }
  else folders.push(a.replace(/[\\/]+$/, ''));
}

function daftarMp4() {
  if (!fs.existsSync(OUT)) return [];
  const dirs = folders.length ? folders : fs.readdirSync(OUT).filter((d) => d !== 'log');
  const hasil = [];
  for (const d of dirs) {
    const dir = path.join(OUT, d);
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) { console.log(`[LEWAT] out/${d}: folder tidak ada`); continue; }
    for (const f of fs.readdirSync(dir)) {
      if (!/\.mp4$/i.test(f)) continue;
      if (opsi.fmt && !f.includes(`-${opsi.fmt}`)) continue;
      hasil.push(path.join(dir, f));
    }
  }
  return hasil.sort();
}

function perluKonversi(mp4) {
  const webp = mp4.replace(/\.mp4$/i, '.webp');
  if (opsi.paksa || !fs.existsSync(webp)) return { webp, perlu: true };
  const lebihBaru = fs.statSync(mp4).mtimeMs > fs.statSync(webp).mtimeMs + 1000;
  return { webp, perlu: lebihBaru, alasan: lebihBaru ? 'mp4 lebih baru' : 'sudah ada' };
}

function konversi(mp4, webp) {
  return new Promise((resolve) => {
    const tmp = webp + '.sementara.webp';
    const S = opsi.sisi;
    // sisi terpanjang = S, sisi lain proporsional & genap; fps dikurangi supaya berkas ringan
    const vf = `fps=${opsi.fps},scale='if(gt(iw,ih),${S},-2)':'if(gt(iw,ih),-2,${S})':flags=lanczos`;
    const argv = ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-an', '-vf', vf,
      '-c:v', 'libwebp_anim', '-lossless', '0', '-quality', String(opsi.q), '-compression_level', '4', '-loop', '0', '-fps_mode', 'passthrough', tmp];
    const t0 = Date.now();
    const p = spawn('ffmpeg', argv, { stdio: ['ignore', 'inherit', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => { err += d; });
    p.on('close', (code) => {
      if (code === 0 && fs.existsSync(tmp)) { fs.renameSync(tmp, webp); resolve({ ok: true, dtk: (Date.now() - t0) / 1000, ukuran: fs.statSync(webp).size }); }
      else { try { fs.unlinkSync(tmp); } catch (e) { /* abaikan */ } resolve({ ok: false, err: err.trim().split('\n').slice(-3).join(' | ') || `ffmpeg keluar dengan kode ${code}` }); }
    });
    p.on('error', (e) => resolve({ ok: false, err: e.message }));
  });
}

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

(async () => {
  const semua = daftarMp4();
  if (!semua.length) { console.log('Tidak ada berkas .mp4 di out/. Render dulu lewat RENDER.bat.'); process.exit(0); }
  const antre = [], lewat = [];
  for (const mp4 of semua) { const k = perluKonversi(mp4); (k.perlu ? antre : lewat).push({ mp4, ...k }); }
  console.log(`Ditemukan ${semua.length} MP4: ${antre.length} perlu dikonversi, ${lewat.length} dilewati (sudah ada .webp).`);
  console.log(`Mutu: sisi terpanjang ${opsi.sisi}px · ${opsi.fps} fps · q${opsi.q}${opsi.paksa ? ' · --paksa' : ''}\n`);
  if (!fs.existsSync(path.join(OUT, 'log'))) fs.mkdirSync(path.join(OUT, 'log'), { recursive: true });
  const log = path.join(OUT, 'log', `webp-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}.txt`);
  const catat = (s) => { console.log(s); fs.appendFileSync(log, s + '\n'); };
  let ok = 0, gagal = 0, no = 0, sisa = antre.slice();
  async function pekerja() {
    while (sisa.length) {
      const item = sisa.shift(); const n = ++no;
      console.log(`[${n}/${antre.length}] ${rel(item.mp4)} (${mb(fs.statSync(item.mp4).size)}) ...`);
      const r = await konversi(item.mp4, item.webp);
      if (r.ok) { ok++; catat(`[OK] ${rel(item.webp)}  ${mb(r.ukuran)}  ${r.dtk.toFixed(0)} dtk`); }
      else { gagal++; catat(`[GAGAL] ${rel(item.mp4)}: ${r.err}`); }
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, opsi.paralel | 0) }, pekerja));
  catat(`\nSelesai: ${ok} dikonversi, ${lewat.length} dilewati, ${gagal} gagal — dari ${semua.length} MP4. MP4 asli tetap utuh.`);
  if (gagal) process.exit(1);
})();
