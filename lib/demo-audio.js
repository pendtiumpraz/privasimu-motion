// Demo audio berlabel suara: efek VO (lib/vofx.js) & SFX meme sintetis (lib/audio.js).
// Pakai: node lib/demo-audio.js  → out/_demo/demo-efek-vo.mp3 & out/_demo/demo-sfx-meme.mp3
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { SFX, I } = require('./audio');
const { FX, apply } = require('./vofx');

const SR = I.SR;
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'out', '_demo');
const VO = path.join(ROOT, 'vo');
fs.mkdirSync(OUT, { recursive: true });

function tts(text, voice = 'id-ID-ArdiNeural', rate = '+5%') {
  const h = crypto.createHash('md5').update(text + voice + rate).digest('hex').slice(0, 8);
  const f = path.join(VO, `demo-${h}.mp3`);
  if (!fs.existsSync(f)) execFileSync('python', [path.join(__dirname, 'tts.py'), voice, rate, text, f, f.replace(/\.mp3$/, '.json')]);
  return f;
}
function decode(f) {
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), 'pipe:1'], { maxBuffer: 1 << 30 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}
class Bus {
  constructor(n) { this.L = new Float32Array(n); this.R = new Float32Array(n); this.n = n; }
  add(i, v, pan = 0) { if (i < 0 || i >= this.n) return; const p = (pan + 1) * Math.PI / 4; this.L[i] += v * Math.cos(p); this.R[i] += v * Math.sin(p); }
  mono(t, pcm, gain = 1) { const s0 = Math.floor(t * SR); for (let i = 0; i < pcm.length; i++) this.add(s0 + i, pcm[i] * gain); }
}
function save(bus, rev, name) {
  const wav = path.join(OUT, name + '.wav'), mp3 = path.join(OUT, name + '.mp3');
  const n = bus.n, data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Math.tanh(bus.L[i] + (rev ? rev.L[i] * 0.5 : 0)))) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, Math.tanh(bus.R[i] + (rev ? rev.R[i] * 0.5 : 0)))) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(wav, Buffer.concat([h, data]));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '192k', mp3]);
  fs.unlinkSync(wav);
  console.log('ok', mp3);
}

// ---------------- demo efek VO
(function demoVo() {
  const sample = tts('Halo, ini DPO. Laporan insidennya wajib masuk dalam tiga kali dua puluh empat jam.', 'id-ID-GadisNeural', '+8%');
  const items = [['Tanpa efek.', decode(sample)]];
  for (const [name, fx] of Object.entries(FX)) {
    const f = path.join(OUT, `tmp-fx-${name}.wav`);
    apply(sample, f, name);
    items.push([`Efek ${fx.label}.`, decode(f)]);
    fs.unlinkSync(f);
  }
  const intro = decode(tts('Demo efek suara VO Privasimu. Tiap efek diumumkan dulu, lalu contoh kalimatnya.'));
  const labels = items.map(([t]) => decode(tts(t)));
  const total = 0.4 + intro.length / SR + 0.8 + items.reduce((a, [, pcm], k) => a + labels[k].length / SR + 0.3 + pcm.length / SR + 0.9, 0) + 0.5;
  const bus = new Bus(Math.ceil(total * SR));
  let t = 0.4;
  bus.mono(t, intro, 0.9); t += intro.length / SR + 0.8;
  items.forEach(([, pcm], k) => {
    bus.mono(t, labels[k], 0.8); t += labels[k].length / SR + 0.3;
    bus.mono(t, pcm, 1); t += pcm.length / SR + 0.9;
  });
  save(bus, null, 'demo-efek-vo');
})();

// ---------------- demo SFX meme (pengganti suara myinstants yang berhak cipta)
(function demoSfx() {
  const LIST = [
    ['vineboom', 'Vine boom, pengganti instagram thud', 1.5], ['dundun', 'Dun dun dun', 2.4], ['sadviolin', 'Sad violin, melodi orisinal', 2.9],
    ['sadtrombone', 'Sad trombone', 2.6], ['reveal', 'Reveal, pengganti role reveal', 2.5], ['error', 'Error', 0.6], ['shock', 'Kaget', 1.3],
    ['gameover', 'Game over', 1.2], ['outro', 'Outro kocak', 1.5], ['eurobeat', 'Eurobeat, pengganti deja vu', 1.8], ['shutter', 'Shutter kamera', 0.4],
    ['hit', 'Pukulan', 0.6], ['scratch', 'Record scratch', 0.7], ['airhorn', 'Airhorn', 1.3], ['hitmarker', 'Hitmarker', 0.3], ['crickets', 'Jangkrik', 1.9],
    ['boing', 'Boing', 0.8], ['rimshot', 'Ba dum tss', 1.6], ['auraUp', 'Aura naik', 1.0], ['auraDown', 'Aura turun', 0.7], ['rewind', 'Rewind VHS', 1.0],
    ['clank', 'Borgol logam', 1.1], ['notif', 'Notifikasi HP', 1.5], ['slidedown', 'Peluit turun', 0.8], ['tada', 'Tada', 1.6],
  ];
  const intro = decode(tts('Demo SFX meme versi aman Privasimu. Semua disintesis sendiri, bebas hak cipta.'));
  const labels = LIST.map(([, t]) => decode(tts(t + '.')));
  const total = 0.4 + intro.length / SR + 0.8 + LIST.reduce((a, [, , d], k) => a + labels[k].length / SR + 0.25 + d + 0.6, 0) + 0.5;
  const n = Math.ceil(total * SR), bus = new Bus(n), rev = new Bus(n);
  let t = 0.4;
  bus.mono(t, intro, 0.9); t += intro.length / SR + 0.8;
  LIST.forEach(([name, , d], k) => {
    bus.mono(t, labels[k], 0.8); t += labels[k].length / SR + 0.25;
    SFX[name](bus, t, 0.8, rev); t += d + 0.6;
  });
  save(bus, rev, 'demo-sfx-meme');
})();
