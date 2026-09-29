// Orkestrator: TTS -> timeline -> subtitle -> audio -> render (16:9 & 9:16) -> mux MP4 -> verifikasi audio.
// Pakai: node build.js <folder-iklan> [--fmt=16x9,9x16] [--audio-only] [--workers=N]
//   contoh: node build.js ad2-pp33
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const { wordTime } = require('./lib/wordtime');
const { buildCaptions, toSrt } = require('./lib/captions');

const argVal = (k) => { const a = process.argv.find((x) => x.startsWith(k + '=')); return a ? a.slice(k.length + 1) : null; };
const flags = new Set(process.argv.slice(3));
if (!process.argv[2]) { console.error('Pakai: node build.js <folder-iklan> [--fmt=16x9,9x16] [--audio-only]'); process.exit(1); }

const AD = path.resolve(__dirname, process.argv[2]);
const NAME = path.basename(AD);
const { CONFIG, SCENES, CUE_EXPANDERS = {} } = require(path.join(AD, 'scenes.js'));
const compose = require(path.join(AD, 'music.js'));
const OUT = path.join(__dirname, 'out', NAME);
const VO = path.join(__dirname, 'vo');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VO, { recursive: true });
const FMTS = (argVal('--fmt') || '16x9,9x16').split(',');
// sidik jari sumber saat build dimulai; dicatat setelah render berhasil (RENDER.bat melewati video yang tidak berubah)
const RS = require('./lib/status-render');
const FP = RS.fingerprint(AD);

const sh = (cmd, a) => execFileSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 30 });
const stderrOf = (cmd, a) => spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 30 }).stderr;
const duration = (f) => parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).trim());

// 1. Voice-over + timing kata (cache per naskah+suara). Scene tanpa VO (vo kosong) = murni musik & visual (mis. gaya stomp).
for (const s of SCENES) {
  if (!s.vo) { s.voFile = null; s.voDur = 0; s.words = []; continue; }
  // pitch opsional (mis. '-12Hz'); kosong = bawaan, sehingga cache TTS lama tetap berlaku
  const voice = s.voice || CONFIG.voice, rate = s.voiceRate || CONFIG.voiceRate, pitch = s.voicePitch || CONFIG.voicePitch || '';
  const hash = crypto.createHash('md5').update(s.vo + voice + rate + pitch).digest('hex').slice(0, 8);
  s.voFile = path.join(VO, `${s.id}-${hash}.mp3`);
  const wordsFile = s.voFile.replace(/\.mp3$/, '.json');
  if (!fs.existsSync(s.voFile) || !fs.existsSync(wordsFile)) {
    console.log(`[tts] ${s.id}`);
    sh('python', [path.join(__dirname, 'lib', 'tts.py'), voice, rate, s.vo, s.voFile, wordsFile, ...(pitch ? [pitch] : [])]);
  }
  s.voDur = duration(s.voFile);
  // edge-tts melaporkan awal kata ± 0,085 dtk lebih awal dari suaranya (diukur); koreksi agar SFX & subtitle pas di kata
  s.words = JSON.parse(fs.readFileSync(wordsFile, 'utf8')).map((w) => ({ ...w, t: +(w.t + 0.085).toFixed(3) }));
}

// 1b. VN tim (motion/vn/<KODE>_S1.wav, ... atau <KODE>.wav) menggantikan TTS; timing kata TTS jadi referensi penyelarasan.
//     Paksa TTS dengan --tts.
SCENES.forEach((s) => (s.ttsFile = s.voFile));
if (!flags.has('--tts')) {
  const n = require('./lib/vn').applyVN(SCENES, CONFIG.naskah, VO);
  if (n) console.log(`[vn] ${CONFIG.naskah}: ${n}/${SCENES.length} bagian memakai rekaman tim`);
}

// 1c. Opsional: rapatkan jeda TTS yang terlalu panjang (edge-tts berhenti ± 1 dtk di tiap titik/tanya).
//     CONFIG.maxPause / s.maxPause (detik) = jeda maksimum antarkata; hanya untuk bagian yang masih TTS (bukan VN).
function writeWavMono(file, pcm, sr) {
  const data = Buffer.alloc(pcm.length * 2);
  for (let i = 0; i < pcm.length; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, pcm[i])) * 32767), i * 2);
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}
for (const s of SCENES) {
  const mp = s.maxPause ?? CONFIG.maxPause;
  if (!mp || !s.vo || s.voFile !== s.ttsFile) continue;
  // hening nyata di audio (durasi kata dari edge-tts memanjang sebelum tanda baca, jadi tidak bisa dipakai)
  const w = s.words, cuts = [], first = w[0].t, lastEnd = w[w.length - 1].t + w[w.length - 1].d;
  const log = stderrOf('ffmpeg', ['-hide_banner', '-i', s.voFile, '-af', `silencedetect=noise=-40dB:d=${mp}`, '-f', 'null', '-']);
  const st = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]), en = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  st.forEach((a, i) => {
    const b = en[i];
    if (b == null || a < first + 0.05 || b > lastEnd) return; // hanya jeda di antara kata
    if (b - a - mp > 0.02) cuts.push([a + mp / 2, b - a - mp]); // buang bagian tengah jeda, sisakan mp
  });
  if (!cuts.length) continue;
  const tight = s.voFile.replace(/\.mp3$/, `-s${Math.round(mp * 100)}.wav`);
  if (!fs.existsSync(tight)) {
    const SRV = 24000;
    const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', s.voFile, '-f', 'f32le', '-ac', '1', '-ar', String(SRV), 'pipe:1'], { maxBuffer: 1 << 30 });
    const pcm = new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4), keep = [];
    let from = 0;
    for (const [c, len] of cuts) { keep.push(pcm.subarray(from, Math.floor(c * SRV))); from = Math.floor((c + len) * SRV); }
    keep.push(pcm.subarray(from));
    const out = new Float32Array(keep.reduce((a, k) => a + k.length, 0));
    let o = 0;
    for (const k of keep) {
      // crossfade 5 ms di sambungan agar tanpa klik
      const f = Math.min(120, k.length);
      for (let i = 0; i < k.length; i++) out[o + i] = k[i] * (o > 0 && i < f ? i / f : 1);
      o += k.length;
    }
    writeWavMono(tight, out, SRV);
  }
  s.words = w.map((x) => ({ ...x, t: +(x.t - cuts.filter(([c]) => c < x.t).reduce((a, [, len]) => a + len, 0)).toFixed(3) }));
  s.voFile = tight;
  s.voDur = duration(tight);
}

// 1d. Efek VO per scene (s.voFx, lihat lib/vofx.js): berlaku untuk TTS maupun VN tim
for (const s of SCENES) {
  if (!s.voFx || !s.vo) continue;
  const { FX, apply } = require('./lib/vofx');
  if (FX[s.voFx] && FX[s.voFx].tempo) throw new Error(`voFx "${s.voFx}" mengubah tempo, tidak bisa dipakai di scene yang sinkron per kata (${s.id})`);
  const fxFile = s.voFile.replace(/\.(mp3|wav|m4a)$/i, '') + `-fx-${s.voFx}.wav`;
  if (!fs.existsSync(fxFile)) apply(s.voFile, fxFile, s.voFx);
  s.voFile = fxFile;
  s.voDur = duration(fxFile);
}

// 2. Timeline (opsional: durasi scene dibulatkan ke ketukan agar cut jatuh di beat)
let t = 0;
const timeline = SCENES.map((s) => {
  // pakai akhir kata terakhir (file TTS menyisakan hening ±0,6 dtk di ujung)
  const last = s.words[s.words.length - 1];
  const speech = last ? Math.min(s.voDur, last.t + last.d + 0.1) : s.voDur;
  const vd = s.voDelay ?? 0;
  let dur = Math.max(s.min, s.vo ? vd + speech + (s.tail ?? CONFIG.tail ?? 0.5) : 0);
  if (CONFIG.beat && !s.free) dur = Math.ceil(dur / CONFIG.beat - 1e-6) * CONFIG.beat; // s.free: tanpa pembulatan (mis. scene penutup)
  const sc = { id: s.id, start: +t.toFixed(3), dur: +dur.toFixed(3), voStart: +(t + vd).toFixed(3), voDur: s.voDur, voFile: s.voFile, words: s.words };
  t += dur;
  return sc;
});
const total = +t.toFixed(3);

// 3. Cue SFX absolut
const cues = [];
SCENES.forEach((s, i) => {
  const sc = timeline[i];
  for (const [when, name, gain] of s.sfx || []) {
    let locals;
    if (typeof when === 'number') locals = [when];
    else if (CUE_EXPANDERS[when]) locals = CUE_EXPANDERS[when](sc);
    else if (when.startsWith('w:')) locals = [wordTime(sc, when)];
    else if (when.startsWith('end-')) locals = [sc.dur - parseFloat(when.slice(4))];
    else throw new Error(`cue tidak dikenal: ${when}`);
    for (const lt of locals) cues.push({ t: +(sc.start + lt).toFixed(4), name, gain });
  }
  // iklan berbasis kit: SFX otomatis dari event visual (waktu sama persis dengan animasi)
  if (s.vis && s.autoSfx !== false) {
    const KE = require('./lib/kit-events');
    for (const [lt, name, gain] of KE.events(s.vis, KE.resolver(sc, wordTime))) cues.push({ t: +(sc.start + lt).toFixed(4), name, gain });
  }
});

// 4. Subtitle (dibakar ke 9:16; .srt untuk diunggah terpisah)
// CONFIG.capMap: ejaan fonetis untuk TTS -> tulisan di subtitle, mis. [['hev', 'have']]
// Video tipografi: teks di layar = VO, jadi subtitle bakar bisa dimatikan (CONFIG.burnCaptions = false atau s.cap = false);
// .srt tetap lengkap untuk diunggah.
const noBurn = (i) => CONFIG.burnCaptions === false || SCENES[i].cap === false;
const capScenes = timeline.map((sc, i) => (noBurn(i) ? { ...sc, words: [] } : sc));
const captions = { '16x9': buildCaptions(capScenes, SCENES, 42, CONFIG.capMap), '9x16': buildCaptions(capScenes, SCENES, 28, CONFIG.capMap) };
fs.writeFileSync(path.join(OUT, `${NAME}.srt`), toSrt(buildCaptions(timeline, SCENES, 42, CONFIG.capMap)));

const data = { total, beat: CONFIG.beat || null, scenes: timeline, cues };
fs.writeFileSync(path.join(OUT, 'timeline.json'), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(AD, 'timeline.js'), 'window.TIMELINE = ' + JSON.stringify({
  total, beat: CONFIG.beat || null, scenes: timeline.map(({ voFile, ...r }) => r), captions,
}) + ';\n');
console.log(`[timeline] ${NAME}: ${total.toFixed(2)} dtk —`, timeline.map((s) => `${s.id}:${s.dur.toFixed(1)}`).join(' '));

// 5. Audio + master loudness (loudnorm 2-pass, -14 LUFS standar media sosial)
const mix = require('./lib/audio').build(data, OUT, compose, CONFIG.mix || {});
const master = path.join(OUT, 'audio-master.m4a');
const LN = 'loudnorm=I=-14:TP=-1.5:LRA=11';
const e1 = stderrOf('ffmpeg', ['-hide_banner', '-i', mix, '-af', `${LN}:print_format=json`, '-f', 'null', '-']);
const meas = JSON.parse(e1.slice(e1.lastIndexOf('{'), e1.lastIndexOf('}') + 1));
sh('ffmpeg', ['-y', '-v', 'error', '-i', mix, '-af',
  `${LN}:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`,
  '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', master]);

function verifyAudio(file) {
  const streams = sh('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_name,channels', '-of', 'csv=p=0', file]).trim();
  if (!streams) throw new Error(`TIDAK ADA TRACK AUDIO di ${file}`);
  const vd = stderrOf('ffmpeg', ['-hide_banner', '-i', file, '-map', '0:a', '-af', 'volumedetect', '-f', 'null', '-']);
  const mean = parseFloat((/mean_volume: ([-\d.]+) dB/.exec(vd) || [])[1]);
  if (!(mean > -35)) throw new Error(`Audio terlalu pelan/senyap (${mean} dB) di ${file}`);
  return `${streams}, rata-rata ${mean} dB`;
}

// 6. Render + mux per format
(async () => {
  if (flags.has('--audio-only')) return;
  const { render } = require('./lib/render');
  for (const fmt of FMTS) {
    const video = path.join(OUT, `${NAME}-${fmt}.video.mp4`);
    const final = path.join(OUT, `${NAME}-${fmt}.mp4`);
    await render(AD, fmt, total, video, { fps: CONFIG.fps || 30, cap: fmt === '9x16', workers: +argVal('--workers') || undefined });
    sh('ffmpeg', ['-y', '-v', 'error', '-i', video, '-i', master, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-shortest', '-movflags', '+faststart', final]);
    fs.unlinkSync(video);
    console.log(`[ok] ${path.basename(final)} — audio: ${verifyAudio(final)}`);
    RS.record(OUT, fmt, FP, total);
  }
})().catch((e) => { console.error(e); process.exit(1); });
