// TY36 — desain suara jadi "gambar": ketukan pintu dan langkah kaki disintesis di sini (orisinal, bebas royalti).
// Musik (music-kit) baru masuk saat layar menyala (scene s4).
const { CONFIG, SCENES } = require('./scenes');
const kit = require('../lib/music-kit')(CONFIG.music, SCENES);

module.exports = function compose(music, rev, tl, I) {
  kit(music, rev, tl, I);
  const { SR, SVF, noise } = I;
  // pukulan pada kayu: dentum rendah + resonansi badan pintu + ketuk tajam di awal
  function kayu(t0, g, pan, nada = 1) {
    const n = Math.floor(0.3 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const badan = Math.sin(2 * Math.PI * 165 * nada * t) * Math.exp(-t * 26) + Math.sin(2 * Math.PI * 310 * nada * t) * Math.exp(-t * 38) * 0.5;
      const ketuk = f.run(noise(), 1900, 1.4).bp * Math.exp(-t * 120) * 0.9;
      const y = (badan * 0.8 + ketuk) * g;
      music.add(s0 + i, y, pan);
      rev.add(s0 + i, y * 0.35, pan);
    }
  }
  // langkah sepatu di lantai: tumit lalu tapak, makin keras (mendekat)
  function langkah(t0, g, pan) {
    const n = Math.floor(0.2 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const y = (Math.sin(2 * Math.PI * 95 * t) * Math.exp(-t * 40) * 0.9 + f.run(noise(), 900, 0.9).bp * Math.exp(-t * 55) * 0.5
        + (t > 0.07 ? f.run(noise(), 1500, 0.8).bp * Math.exp(-(t - 0.07) * 70) * 0.3 : 0)) * g;
      music.add(s0 + i, y, pan);
      rev.add(s0 + i, y * 0.4, pan);
    }
  }
  SCENES.forEach((s, i) => {
    const sc = tl.scenes[i];
    for (const [jenis, at] of s.vis.bunyi || []) {
      const t = sc.start + at;
      if (jenis === 'ketuk') [[0, 0.5, 1], [0.27, 0.62, 1.04], [0.54, 0.72, 0.97]].forEach(([dt, g, nada]) => kayu(t + dt, g, 0.15, nada));
      if (jenis === 'langkah') [0, 0.3, 0.6, 0.9].forEach((dt, k) => langkah(t + dt, 0.28 + k * 0.12, k % 2 ? 0.3 : -0.3));
    }
  });
};
