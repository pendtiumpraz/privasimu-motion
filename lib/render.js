// Render halaman animasi frame-per-frame (deterministik lewat window.seek) -> H.264, paralel per potongan.
// Still untuk cek visual: node lib/render.js still <folder-iklan> <16x9|9x16> <detik...>
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
// playwright-core: pakai node_modules milik motion (npm install) bila ada; kalau tidak, pinjam dari ../frontend (monorepo)
function loadPlaywright() {
  for (const base of [path.join(__dirname, '..'), path.join(__dirname, '..', '..', 'frontend')]) {
    try { return require(require.resolve('playwright-core', { paths: [base] })); } catch (e) { /* coba lokasi berikutnya */ }
  }
  throw new Error('playwright-core tidak ditemukan. Jalankan "npm install" lalu "npx playwright install chromium" di folder motion.');
}
const { chromium } = loadPlaywright();

const FORMATS = { '16x9': { w: 1920, h: 1080 }, '9x16': { w: 1080, h: 1920 } };

async function openPage(browser, adDir, fmt, cap) {
  const { w, h } = FORMATS[fmt];
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error(`\n[halaman ${fmt}] ${e.message}`));
  const url = 'file:///' + path.join(adDir, 'index.html').replace(/\\/g, '/') + `?fmt=${fmt}&cap=${cap ? 1 : 0}&render=1`;
  await page.goto(url);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 180000 });
  return page;
}

async function renderChunk(browser, adDir, fmt, cap, fps, f0, f1, outFile, tick) {
  let page = await openPage(browser, adDir, fmt, cap);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', 'pipe:0',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(fps), outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) {
    // komputer sedang sibuk (proses lain) bisa membuat satu screenshot macet: tunggu lebih lama, lalu coba ulang
    // dengan halaman baru (frame deterministik, jadi hasilnya tetap sama) sebelum menyerah
    let buf = null;
    for (let attempt = 1; !buf; attempt++) {
      try {
        await page.evaluate((t) => window.seek(t), f / fps);
        buf = await page.screenshot({ type: 'jpeg', quality: 93, timeout: 120000 });
      } catch (e) {
        if (attempt >= 3) throw e;
        const why = String(e.message).split(/\r?\n/)[0];
        console.warn(`\n[render ${fmt}] frame ${f} gagal (percobaan ${attempt}: ${why}), coba ulang`);
        await page.close().catch(() => {});
        page = await openPage(browser, adDir, fmt, cap);
      }
    }
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    tick();
  }
  ff.stdin.end();
  const code = await new Promise((r) => ff.on('close', r));
  if (code !== 0) throw new Error(`ffmpeg gagal (${code}) untuk ${outFile}`);
  await page.close();
}

async function render(adDir, fmt, total, outFile, { fps = 30, cap = false, workers } = {}) {
  const frames = Math.round(total * fps);
  const n = workers || Math.max(1, Math.min(4, Math.floor(os.cpus().length / 2)));
  const per = Math.ceil(frames / n);
  const browser = await chromium.launch();
  let done = 0;
  const t0 = Date.now();
  const tick = () => { if (++done % 30 === 0 || done === frames) process.stdout.write(`\r[render ${fmt}] ${done}/${frames} frame (${((Date.now() - t0) / 1000).toFixed(0)} dtk)   `); };
  const parts = Array.from({ length: n }, (_, i) => outFile.replace(/\.mp4$/, `.part${i}.mp4`));
  await Promise.all(parts.map((p, i) => renderChunk(browser, adDir, fmt, cap, fps, i * per, Math.min(frames, (i + 1) * per), p, tick)));
  await browser.close();
  const list = outFile.replace(/\.mp4$/, '.parts.txt');
  fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', outFile]);
  parts.forEach((p) => fs.unlinkSync(p));
  fs.unlinkSync(list);
  console.log(`\n[render ${fmt}] selesai ${path.basename(outFile)}`);
}

module.exports = { render, FORMATS };

if (require.main === module && process.argv[2] === 'still') {
  (async () => {
    const adDir = path.resolve(process.argv[3]), fmt = process.argv[4];
    const outDir = path.join(__dirname, '..', 'out', path.basename(adDir), 'stills');
    fs.mkdirSync(outDir, { recursive: true });
    const browser = await chromium.launch();
    const page = await openPage(browser, adDir, fmt, fmt === '9x16');
    const files = [];
    for (const t of process.argv.slice(5)) {
      await page.evaluate((tt) => window.seek(tt), parseFloat(t));
      const f = path.join(outDir, `${fmt}-${t}.jpg`);
      await page.screenshot({ path: f, type: 'jpeg', quality: 80 });
      files.push(f);
    }
    await browser.close();
    console.log(files.join('\n'));
  })();
}
