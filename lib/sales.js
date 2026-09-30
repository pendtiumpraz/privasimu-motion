// Versi video per sales: kontak umum di penutup video diganti nama + nomor WhatsApp tiap sales.
//   node lib/sales.js [folder...] [--fmt=9x16,16x9] [--paksa] [--excel=sales/daftar-sales.xlsx]
// Data dari Excel (dibuat lib/buat_template_sales.py, dibaca lib/baca_sales.py). Hanya bagian akhir video yang dirender
// ulang: mulai keyframe terakhir sebelum kontak pertama kali terlihat. Kepala video dasar disalin tanpa encode ulang,
// audio tetap dari video dasar (VO tidak menyebut nomor).
// Hasil: out/<folder>/<pola>.mp4 (bawaan <folder>-<format>-<nomor>.mp4). Catatan: out/<folder>/sales-info.json.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const { render, openPage, chromium } = require('./render');
const RS = require('./status-render');

const ROOT = path.join(__dirname, '..');
const FPS = 30;
const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const PAKSA = args.includes('--paksa');
const PILIH = args.filter((a) => !a.startsWith('--')).map((a) => path.basename(a));
const FMT = opt('fmt', null);
const EXCEL = path.resolve(ROOT, opt('excel', path.join('sales', 'daftar-sales.xlsx')));

const sh = (cmd, a) => execFileSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 28 });
const durasi = (f) => parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).trim());
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const posix = (p) => p.replace(/\\/g, '/');

// ---------- nomor & teks ----------
function normTelp(raw) {
  let d = String(raw || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  if (d.startsWith('62')) d = '0' + d.slice(2);
  else if (d.startsWith('8')) d = '0' + d;
  return /^0\d{8,13}$/.test(d) ? d : null;
}
const tampilTelp = (d) => [d.slice(0, 4), d.slice(4, 8), d.slice(8, 12), d.slice(12)].filter(Boolean).join('-');
const slug = (s) => s.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase().slice(0, 40);
const aman = (s) => s.replace(/[^\w.-]+/g, '-');

// ---------- analisis video dasar ----------
// detik pertama kontak umum terlihat di layar (dicari di halaman animasi), null bila video tidak menampilkan kontak
async function waktuKontak(dir, fmt) {
  const browser = await chromium.launch();
  try {
    const page = await openPage(browser, dir, fmt, fmt === '9x16');
    return await page.evaluate(() => {
      const re = /0851 8318 2722/;
      const els = [...document.querySelectorAll('body *')].filter((e) => !/^(SCRIPT|STYLE)$/.test(e.tagName) && re.test(e.textContent) && ![...e.children].some((c) => re.test(c.textContent)));
      if (!els.length) return null;
      const terlihat = (e) => {
        const r = e.getBoundingClientRect();
        if (r.width * r.height < 4 || r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth) return false;
        let o = 1;
        for (let n = e; n && n !== document.documentElement; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          o *= parseFloat(cs.opacity);
        }
        return o > 0.03;
      };
      const T = window.TIMELINE.total;
      for (let t = 0; t < T; t += 0.1) { window.seek(t); if (els.some(terlihat)) return t; }
      return null;
    });
  } finally { await browser.close(); }
}
// waktu keyframe (paket berflag K) video dasar
function keyframes(file) {
  return sh('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'packet=pts_time,flags', '-of', 'csv=p=0', file])
    .split(/\r?\n/).map((l) => l.split(',')).filter((c) => (c[1] || '').includes('K')).map((c) => parseFloat(c[0])).filter(Number.isFinite).sort((a, b) => a - b);
}
// potongan kepala video dasar [0, K) tanpa encode ulang (K = keyframe, jadi potongannya bersih)
function kepala(base, K, tmp) {
  const f = path.join(tmp, `kepala-${K.toFixed(3)}.mp4`);
  if (fs.existsSync(f)) return f;
  for (const x of fs.readdirSync(tmp)) if (/^seg\d+\.mp4$/.test(x)) fs.unlinkSync(path.join(tmp, x));
  sh('ffmpeg', ['-y', '-v', 'error', '-i', base, '-map', '0:v', '-c', 'copy', '-f', 'segment', '-segment_times', K.toFixed(3),
    '-reset_timestamps', '1', path.join(tmp, 'seg%d.mp4')]);
  fs.renameSync(path.join(tmp, 'seg0.mp4'), f);
  for (const x of fs.readdirSync(tmp)) if (/^seg\d+\.mp4$/.test(x)) fs.unlinkSync(path.join(tmp, x));
  return f;
}
function rakit(head, tail, base, outFile) {
  const vid = outFile.replace(/\.mp4$/, '.v.mp4');
  if (head) {
    const list = outFile + '.txt';
    fs.writeFileSync(list, [head, tail].map((p) => `file '${posix(p)}'`).join('\n'));
    sh('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', vid]);
    fs.unlinkSync(list);
  } else fs.copyFileSync(tail, vid);
  sh('ffmpeg', ['-y', '-v', 'error', '-i', vid, '-i', base, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', outFile]);
  fs.unlinkSync(vid);
}
const jumlahFrame = (f) => parseInt(sh('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f]).trim(), 10);
function cekDecode(file) {
  const r = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-map', '0:v', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
  return (r.stderr || '').trim();
}

(async () => {
  const n0 = new Date(), dua = (x) => String(x).padStart(2, '0');
  const stamp = `${n0.getFullYear()}${dua(n0.getMonth() + 1)}${dua(n0.getDate())}-${dua(n0.getHours())}${dua(n0.getMinutes())}`;
  const LOG = path.join(ROOT, 'out', 'log', `sales-${stamp}.txt`);
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  const log = (s) => { console.log(s); fs.appendFileSync(LOG, s + '\n'); };

  if (!fs.existsSync(EXCEL)) { console.log(`Excel belum ada: ${EXCEL}\nBuat dulu: python lib/buat_template_sales.py`); process.exit(1); }
  const data = JSON.parse(sh('python', [path.join(__dirname, 'baca_sales.py'), EXCEL]));
  const PG = data.pengaturan || {};
  const TPL_PENUH = PG.teks_penuh || '{nama} · WA {telp}', TPL_NOMOR = PG.teks_nomor || 'WA {telp}';
  const POLA = PG.pola_nama_file || '{video}-{format}-{telp}', MAKS = +PG.maks_huruf_nama || 22;

  const sales = [], dipakai = new Set();
  for (const s of data.sales.filter((x) => x.aktif)) {
    const d = normTelp(s.telp);
    if (!d) { log(`[LEWAT] sales "${s.nama}": nomor "${s.telp}" tidak valid`); continue; }
    if (dipakai.has(d)) { log(`[LEWAT] sales "${s.nama}": nomor ${d} dobel`); continue; }
    dipakai.add(d);
    const nama = s.nama.length > MAKS ? s.nama.slice(0, MAKS - 1).trimEnd() + '…' : s.nama;
    const isi = (tpl) => tpl.replace(/\{nama\}/g, nama).replace(/\{telp\}/g, tampilTelp(d));
    sales.push({ nama: s.nama, digit: d, kontak: { penuh: isi(TPL_PENUH), nomor: isi(TPL_NOMOR) } });
  }
  if (!sales.length) { log('Tidak ada sales aktif (kolom Aktif = Ya) dengan nomor yang valid.'); process.exit(1); }
  // video baru yang belum ada di sheet Video ikut otomatis (format 9:16); sheet Video tetap menang bila folder tercantum
  const tercatat = new Set(data.video.map((v) => v.folder));
  const baru = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !tercatat.has(d.name) && fs.existsSync(path.join(ROOT, d.name, 'scenes.js')))
    .map((d) => ({ kode: '', folder: d.name, aktif: true, '9x16': true, '16x9': false, otomatis: true }));
  const videos = [...data.video, ...baru].filter((v) => (PILIH.length ? PILIH.includes(v.folder) : v.aktif));
  if (baru.length) log(`Video baru di luar sheet Video (ikut otomatis, 9:16): ${baru.map((v) => v.folder).join(', ')}`);
  log(`Versi sales: ${sales.length} sales × ${videos.length} video — ${new Date().toLocaleString('id-ID')}`);

  let dibuat = 0, dilewati = 0, gagal = 0;
  const mulai = Date.now();
  for (const v of videos) {
    const dir = path.join(ROOT, v.folder), out = path.join(ROOT, 'out', v.folder);
    const catFile = path.join(out, 'sales-info.json');
    let cat = {};
    try { cat = JSON.parse(fs.readFileSync(catFile, 'utf8')); } catch (e) { /* belum ada */ }
    const simpan = () => fs.writeFileSync(catFile, JSON.stringify(cat, null, 2));
    const fmts = FMT ? FMT.split(',') : ['9x16', '16x9'].filter((f) => v[f]);
    for (const fmt of fmts) {
      const base = path.join(out, `${v.folder}-${fmt}.mp4`);
      log(`\n=== ${v.folder} ${fmt}`);
      if (!fs.existsSync(path.join(dir, 'scenes.js'))) { log('[LEWAT] folder video tidak ditemukan'); gagal++; continue; }
      if (!fs.existsSync(base) || !fs.existsSync(path.join(dir, 'timeline.js'))) { log('[LEWAT] video dasar belum dirender — jalankan RENDER.bat dulu'); if (v.otomatis) dilewati++; else gagal++; continue; }
      let info = {};
      try { info = JSON.parse(fs.readFileSync(path.join(out, 'render-info.json'), 'utf8')); } catch (e) { /* hasil lama */ }
      if (info[fmt]) {
        const now = RS.fingerprint(dir), rec = info[fmt].sources || {};
        const beda = [...new Set([...Object.keys(now), ...Object.keys(rec)])].filter((k) => now[k] !== rec[k]);
        if (beda.length) { log(`[LEWAT] sumber video berubah sejak render dasar (${beda.join(', ')}) — jalankan RENDER.bat dulu`); gagal++; continue; }
      }
      const st = fs.statSync(base), baseId = sha(`${st.size}|${st.mtimeMs}`);
      const total = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.js'), 'utf8').replace(/^window\.TIMELINE\s*=\s*/, '').replace(/;\s*$/, '')).total;
      cat._analisis = cat._analisis || {};
      let an = cat._analisis[fmt];
      if (!an || an.baseId !== baseId || an.ver !== 2) {
        const tK = await waktuKontak(dir, fmt);
        const kf = tK == null ? [] : keyframes(base).filter((k) => k <= tK - 0.05);
        an = cat._analisis[fmt] = { ver: 2, baseId, kontak: tK, K: kf.length ? kf[kf.length - 1] : 0 };
        simpan();
      }
      if (an.kontak == null) { log('[LEWAT] video ini tidak menampilkan nomor kontak'); dilewati++; continue; }
      const f0 = Math.round(an.K * FPS);
      log(`kontak muncul di ${an.kontak.toFixed(1)} dtk; render ulang mulai ${an.K.toFixed(2)} dtk (${(total - an.K).toFixed(1)} dtk per sales)`);
      const tmp = path.join(out, '.sales-tmp');
      fs.mkdirSync(tmp, { recursive: true });
      let head = null;
      for (const s of sales) {
        const nama = aman(POLA.replace(/\{video\}/g, v.folder).replace(/\{format\}/g, fmt).replace(/\{telp\}/g, s.digit).replace(/\{nama\}/g, slug(s.nama))) + '.mp4';
        const outFile = path.join(out, nama), key = `${fmt}|${s.digit}`, fp = sha(JSON.stringify([baseId, s.kontak, f0]));
        if (!PAKSA && fs.existsSync(outFile) && cat[key] && cat[key].fp === fp && cat[key].file === nama) { log(`[LEWAT] ${nama} sudah ada`); dilewati++; continue; }
        log(`[${s.nama}] "${s.kontak.penuh}" -> ${nama}`);
        try {
          if (f0 > 0 && !head) head = kepala(base, an.K, tmp);
          const tail = path.join(tmp, `ekor-${s.digit}.mp4`);
          await render(dir, fmt, total, tail, { fps: FPS, cap: fmt === '9x16', from: f0, query: '&kontak=' + encodeURIComponent(JSON.stringify(s.kontak)) });
          rakit(head, tail, base, outFile);
          fs.unlinkSync(tail);
          const d0 = durasi(base), d1 = durasi(outFile), err = cekDecode(outFile);
          if (Math.abs(d1 - d0) > 0.1) throw new Error(`durasi ${d1.toFixed(2)} dtk, seharusnya ${d0.toFixed(2)} dtk`);
          const n0 = jumlahFrame(base), n1 = jumlahFrame(outFile);
          if (n0 !== n1) throw new Error(`jumlah frame ${n1}, seharusnya ${n0}`);
          if (err) throw new Error(`video rusak: ${err.split('\n')[0]}`);
          if (cat[key] && cat[key].file !== nama) { const lama = path.join(out, cat[key].file); if (fs.existsSync(lama)) fs.unlinkSync(lama); }
          cat[key] = { file: nama, fp, nama: s.nama, at: new Date().toISOString() };
          simpan();
          log(`[OK] ${nama}`);
          dibuat++;
        } catch (e) {
          log(`[GAGAL] ${nama}: ${e.message}`);
          if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
          gagal++;
        }
      }
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }
  log(`\nSelesai dalam ${((Date.now() - mulai) / 60000).toFixed(1)} menit: ${dibuat} dibuat, ${dilewati} dilewati, ${gagal} gagal/dilewati karena masalah.`);
  log(`Log: ${LOG}`);
  process.exit(gagal ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
