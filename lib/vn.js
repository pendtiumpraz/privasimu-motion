// VN (rekaman suara tim) menggantikan TTS: dibersihkan, dipotong per bagian, timing kata diselaraskan
// dari referensi TTS lewat jeda yang cocok (piecewise linear) agar subtitle, SFX, dan animasi tetap sinkron.
// Taruh file di motion/vn/: <KODE>_S1.wav, <KODE>_S2.wav, ... atau satu file utuh <KODE>.wav (jeda ± 2 dtk antar bagian).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const VN_DIR = path.join(__dirname, '..', 'vn');
const EXT = /\.(wav|mp3|m4a|aac|ogg|oga|opus|flac|webm|mp4|3gp|amr)$/i;
const ff = (a) => execFileSync('ffmpeg', a, { encoding: 'utf8', maxBuffer: 1 << 30 });
const ffErr = (a) => spawnSync('ffmpeg', a, { encoding: 'utf8', maxBuffer: 1 << 30 }).stderr;
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }).trim());

function silences(file, noiseDb, minDur) {
  const e = ffErr(['-hide_banner', '-i', file, '-af', `silencedetect=noise=${noiseDb}dB:d=${minDur}`, '-f', 'null', '-']);
  const out = [];
  let st = null;
  for (const line of e.split(/\r?\n/)) {
    let m = /silence_start: ([\d.]+)/.exec(line);
    if (m) st = +m[1];
    m = /silence_end: ([\d.]+)/.exec(line);
    if (m && st !== null) { out.push({ a: st, b: +m[1] }); st = null; }
  }
  return out;
}

// Rantai pembersih suara: buang dengung rendah, kurangi noise, ratakan dinamika.
// Loudness dinormalkan SETELAH hening dipotong, dengan gain linear (loudnorm dinamis memperkeras noise di bagian hening).
const CLEAN = [
  'highpass=f=80', 'lowpass=f=15000', 'afftdn=nf=-25',
  'acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2',
].join(',');
const TARGET_LUFS = -17;

// Bersihkan, potong hening awal/akhir (ambang adaptif: rata-rata level klip - 18 dB), lalu normalkan loudness.
function clean(src, out, range) {
  const tmp = out.replace(/\.wav$/, '.tmp.wav');
  const a = ['-y', '-v', 'error'];
  if (range) a.push('-ss', range[0].toFixed(3), '-to', range[1].toFixed(3));
  a.push('-i', src, '-af', CLEAN, '-ar', '44100', '-ac', '1', tmp);
  ff(a);
  const D = dur(tmp);
  const vd = ffErr(['-hide_banner', '-i', tmp, '-af', 'volumedetect', '-f', 'null', '-']);
  const mean = parseFloat((/mean_volume: ([-\d.]+) dB/.exec(vd) || [])[1] || '-20');
  const sil = silences(tmp, Math.round(mean - 18), 0.08);
  // lonjakan pendek (< 0,15 dtk) di ujung klip — klik, napas, sisa noise saat filter mulai — tidak dianggap ucapan
  let start = 0, end = D;
  if (sil.length && sil[0].a <= 0.15) start = sil[0].b;
  const lastSil = sil[sil.length - 1];
  if (lastSil && lastSil.b >= D - 0.15 && lastSil.a > start) end = lastSil.a;
  if (end - start < 0.3) { start = 0; end = D; }
  const s0 = Math.max(0, start - 0.05), s1 = Math.min(D, end + 0.12);
  const trim = `atrim=start=${s0.toFixed(3)}:end=${s1.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st=${Math.max(0, s1 - s0 - 0.03).toFixed(3)}:d=0.03`;
  const e = ffErr(['-hide_banner', '-i', tmp, '-af', `${trim},ebur128`, '-f', 'null', '-']);
  const lufs = parseFloat((/I:\s+([-\d.]+) LUFS/.exec(e.slice(e.lastIndexOf('Summary'))) || [])[1]);
  const gain = Number.isFinite(lufs) ? Math.max(-20, Math.min(30, TARGET_LUFS - lufs)) : 0;
  ff(['-y', '-v', 'error', '-i', tmp, '-af', `${trim},volume=${gain.toFixed(2)}dB,alimiter=limit=0.84:level=false`, '-ar', '44100', '-ac', '1', out]);
  fs.unlinkSync(tmp);
}

// Satu rekaman utuh -> n bagian, dipotong di (n-1) jeda terpanjang
function splitWhole(file, n) {
  const total = dur(file);
  const sil = silences(file, -38, 0.6).filter((s) => s.a > 0.3 && s.b < total - 0.3);
  if (sil.length < n - 1) {
    throw new Error(`VN ${path.basename(file)}: hanya ada ${sil.length} jeda panjang, butuh ${n - 1}. ` +
      'Minta tim memberi jeda ± 2 detik antar bagian, atau rekam per bagian (_S1, _S2, ...).');
  }
  const cuts = sil.sort((x, y) => (y.b - y.a) - (x.b - x.a)).slice(0, n - 1).sort((x, y) => x.a - y.a).map((s) => (s.a + s.b) / 2);
  const edges = [0, ...cuts, total];
  return edges.slice(0, -1).map((a, i) => [a, edges[i + 1]]);
}

// Petakan timing kata TTS ke rekaman manusia: jeda antar-kata TTS dipasangkan dengan jeda nyata di rekaman
function alignWords(ttsWords, file) {
  const D = dur(file);
  if (!ttsWords.length) return [];
  const last = ttsWords[ttsWords.length - 1];
  const t0 = ttsWords[0].t, t1 = last.t + last.d;
  const gaps = [];
  for (let i = 0; i < ttsWords.length - 1; i++) {
    const a = ttsWords[i].t + ttsWords[i].d, b = ttsWords[i + 1].t;
    if (b - a > 0.12) gaps.push({ mid: (a + b) / 2, len: b - a });
  }
  const pauses = silences(file, -36, 0.16).filter((s) => s.a > 0.1 && s.b < D - 0.1).map((s) => ({ mid: (s.a + s.b) / 2, len: s.b - s.a }));
  const k = Math.min(gaps.length, pauses.length);
  const top = (arr) => arr.slice().sort((x, y) => y.len - x.len).slice(0, k).sort((x, y) => x.mid - y.mid);
  const G = top(gaps), PZ = top(pauses);
  const anchors = [[t0, 0.05]];
  G.forEach((g, i) => {
    const rx = (g.mid - t0) / (t1 - t0), ry = PZ[i].mid / D;
    if (Math.abs(rx - ry) < 0.2 && PZ[i].mid > anchors[anchors.length - 1][1] && g.mid > anchors[anchors.length - 1][0]) anchors.push([g.mid, PZ[i].mid]);
  });
  anchors.push([t1, Math.max(D - 0.05, anchors[anchors.length - 1][1] + 0.1)]);
  const f = (x) => {
    if (x <= anchors[0][0]) return anchors[0][1];
    for (let i = 1; i < anchors.length; i++) {
      const [x0, y0] = anchors[i - 1], [x1, y1] = anchors[i];
      if (x <= x1) return y0 + (y1 - y0) * (x - x0) / Math.max(1e-6, x1 - x0);
    }
    return anchors[anchors.length - 1][1];
  };
  return ttsWords.map((w) => { const a = f(w.t), b = f(w.t + w.d); return { w: w.w, t: +a.toFixed(3), d: +Math.max(0.05, b - a).toFixed(3) }; });
}

// Ganti VO TTS dengan VN bila ada. SCENES harus sudah berisi words (referensi TTS). Mengembalikan jumlah bagian yang memakai VN.
function applyVN(SCENES, code, cacheDir) {
  if (!code || !fs.existsSync(VN_DIR)) return 0;
  const files = fs.readdirSync(VN_DIR).filter((f) => EXT.test(f));
  const byName = (n) => files.find((f) => path.parse(f).name.toLowerCase() === n.toLowerCase());
  // scene tanpa VO dilewati; nomor bagian (S1, S2, ...) tetap mengikuti urutan scene
  let parts = SCENES.map((s, i) => s.vo && byName(`${code}_S${i + 1}`)).map((f) => f && { src: path.join(VN_DIR, f) });
  const whole = byName(code);
  if (!parts.some(Boolean) && whole) {
    const src = path.join(VN_DIR, whole), withVo = SCENES.map((s, i) => (s.vo ? i : -1)).filter((i) => i >= 0);
    const ranges = splitWhole(src, withVo.length);
    parts = SCENES.map(() => null);
    withVo.forEach((si, k) => (parts[si] = { src, range: ranges[k] }));
  }
  let used = 0;
  SCENES.forEach((s, i) => {
    const p = parts[i];
    if (!p) return;
    const st = fs.statSync(p.src);
    const key = crypto.createHash('md5').update([p.src, st.size, st.mtimeMs, JSON.stringify(p.range || ''), s.vo].join('|')).digest('hex').slice(0, 8);
    const out = path.join(cacheDir, `vn-${code}-S${i + 1}-${key}.wav`);
    if (!fs.existsSync(out)) clean(p.src, out, p.range);
    s.words = alignWords(s.words, out);
    s.voFile = out;
    s.voDur = dur(out);
    s.voSource = 'vn';
    used++;
  });
  const missing = parts.map((p, i) => (p || !SCENES[i].vo ? null : `S${i + 1}`)).filter(Boolean);
  if (used && missing.length) console.warn(`[vn] ${code}: bagian ${missing.join(', ')} belum ada rekaman — sementara memakai TTS`);
  return used;
}

module.exports = { applyVN, VN_DIR };
