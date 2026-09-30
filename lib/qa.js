// QA cepat satu video: still di kedua format + lembar kontak + cek teks terpotong. BUKAN render penuh.
//   node lib/qa.js <folder> [--t=0.05,2.4,7] [--fmt=9x16] [--kol=4]
//   tanpa --t: frame pertama, 45% dan 92% tiap scene, frame terakhir
//   hasil: out/<folder>/qa-16x9.jpg, out/<folder>/qa-9x16.jpg (still satuan di out/<folder>/stills/)
// Cek teks: elemen berteks yang terlihat tetapi keluar layar dilaporkan ("TERPOTONG"); di 9:16 juga yang masuk area
// subtitle bila subtitle dibakar. Elemen yang memang sengaja keluar layar diberi atribut data-bebas (di elemen/induknya).
// Proses dijalankan dengan prioritas rendah supaya tidak mengganggu render yang sedang berjalan.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

try { os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* abaikan */ }
const { openPage, chromium } = require('./render');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2), folder = path.basename(args.find((a) => !a.startsWith('--')) || '');
const opt = (k) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : null; };
const dir = path.join(ROOT, folder), out = path.join(ROOT, 'out', folder), stills = path.join(out, 'stills');
if (!folder || !fs.existsSync(path.join(dir, 'timeline.js'))) { console.error(`${folder}: timeline.js belum ada (node build.js ${folder} --audio-only)`); process.exit(1); }
const TL = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.js'), 'utf8').replace(/^window\.TIMELINE\s*=\s*/, '').replace(/;\s*$/, ''));
const { CONFIG, SCENES } = require(path.join(dir, 'scenes.js'));
let times = opt('t') ? opt('t').split(',').map(Number) : null;
if (!times) {
  times = [0.04];
  for (const s of TL.scenes) times.push(s.start + s.dur * 0.45, s.start + s.dur * 0.92);
  times.push(TL.total - 0.06);
}
times = times.map((t) => +t.toFixed(2));
const fmts = (opt('fmt') || '16x9,9x16').split(',');
fs.mkdirSync(stills, { recursive: true });

function cekTeks({ capOn }) {
  const W = innerWidth, H = innerHeight, res = [];
  const vis = (e) => {
    let o = 1;
    for (let n = e; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
      if (n.hasAttribute('data-bebas')) return 0;
      o *= parseFloat(cs.opacity);
    }
    return o;
  };
  document.querySelectorAll('#stage *').forEach((e) => {
    if (e.id === 'mg-cap' || e.closest('#mg-cap')) return;
    const teks = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').trim();
    if (!teks || vis(e) < 0.2) return;
    const r = e.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const luar = r.left < -2 || r.right > W + 2 || r.top < -2 || r.bottom > H + 2;
    const sub = capOn && r.bottom > 1450 && r.top < 1640;
    if (luar || sub) res.push(`${luar ? 'TERPOTONG' : 'kena subtitle'} "${teks.slice(0, 40)}" [${Math.round(r.left)},${Math.round(r.top)} - ${Math.round(r.right)},${Math.round(r.bottom)}]`);
  });
  return [...new Set(res)].slice(0, 8);
}

(async () => {
  const browser = await chromium.launch();
  let masalah = 0;
  for (const fmt of fmts) {
    const Vt = fmt === '9x16', bakar = Vt && CONFIG.burnCaptions !== false;
    const page = await openPage(browser, dir, fmt, Vt);
    const files = [];
    for (const t of times) {
      await page.evaluate((tt) => window.seek(tt), t);
      const f = path.join(stills, `${fmt}-${t}.jpg`);
      await page.screenshot({ path: f, type: 'jpeg', quality: 82 });
      files.push(f);
      const sc = TL.scenes.filter((s) => t >= s.start).pop(), si = TL.scenes.indexOf(sc);
      const capOn = !!(bakar && SCENES[si].cap !== false && SCENES[si].vo);
      const temuan = await page.evaluate(cekTeks, { capOn });
      temuan.forEach((x) => { if (++masalah <= 12) console.log(`  ${fmt} @${t}: ${x}`); });
    }
    await page.close();
    const kol = +(opt('kol') || (Vt ? 4 : 3)), baris = Math.ceil(files.length / kol), sc = Vt ? '360:640' : '512:288';
    const list = path.join(stills, `list-qa-${fmt}.txt`);
    fs.writeFileSync(list, files.map((f) => `file '${path.basename(f)}'`).join('\n'));
    const sheet = path.join(out, `qa-${fmt}.jpg`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `scale=${sc},tile=${kol}x${baris}:padding=6:color=white`, '-frames:v', '1', sheet]);
    console.log(`${fmt}: ${path.relative(ROOT, sheet).replace(/\\/g, '/')}  (detik: ${times.join(' ')})`);
  }
  await browser.close();
  console.log(masalah ? `cek teks: ${masalah} temuan${masalah > 12 ? ' (12 pertama ditampilkan)' : ''}` : 'cek teks: bersih');
})().catch((e) => { console.error(e.message); process.exit(1); });
