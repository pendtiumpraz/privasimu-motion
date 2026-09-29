// Efek suara VO (voice effect) berbasis filter FFmpeg. Dipakai build.js lewat s.voFx per scene (TTS maupun VN tim).
// Contoh di scenes.js: { id: 's5', voFx: 'berat', vo: '...' }
// Efek bertanda tempo:true mengubah kecepatan bicara → tidak boleh dipakai pada scene yang animasinya sinkron per kata.
const { execFileSync } = require('child_process');

const FX = {
  berat: { label: 'suara berat', af: 'rubberband=pitch=0.78,bass=g=5:f=110,acompressor=threshold=-18dB:ratio=3:attack=5:release=80' },
  tupai: { label: 'suara tupai', af: 'rubberband=pitch=1.55' },
  telepon: { label: 'telepon', af: 'highpass=f=450,lowpass=f=3000,acompressor=threshold=-22dB:ratio=6,volume=4dB' },
  toa: { label: 'toa', af: 'highpass=f=700,lowpass=f=3500,volume=7dB,acrusher=bits=10:mode=log:aa=1,aecho=0.8:0.5:22:0.35,alimiter=limit=0.9' },
  robot: { label: 'robot', af: "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75,aecho=0.8:0.7:12:0.3" },
  gema: { label: 'gema', af: 'aecho=0.8:0.7:180|360:0.45|0.25' },
  aula: { label: 'aula', af: 'aecho=0.8:0.88:60|120|240:0.4|0.3|0.2' },
  bisik: { label: 'bisik', af: "highpass=f=900,afftfilt=real='hypot(re,im)*cos((random(0)*2-1)*2*3.14)':imag='hypot(re,im)*sin((random(1)*2-1)*2*3.14)':win_size=128:overlap=0.8,volume=6dB" },
  lebay: { label: 'lebay, bass boosted', af: 'bass=g=12:f=90,acrusher=bits=6:mode=log:aa=0.5,volume=-4dB,alimiter=limit=0.8' },
  nangis: { label: 'bergetar mau nangis', af: 'vibrato=f=7:d=0.35' },
  slowed: { label: 'slowed plus reverb', af: 'aresample=48000,asetrate=40800,aresample=48000,aecho=0.8:0.8:90|180:0.4|0.25', tempo: true },
};

function apply(inFile, outFile, name) {
  const fx = FX[name];
  if (!fx) throw new Error(`voFx tidak dikenal: "${name}" (pilihan: ${Object.keys(FX).join(', ')})`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', inFile, '-af', fx.af, '-ar', '48000', '-ac', '1', outFile]);
  return outFile;
}

module.exports = { FX, apply };
