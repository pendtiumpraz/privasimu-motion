// TY44 — klik huruf plastik masuk alur papan (sinkron dengan style.js: huruf ke-j pada waktu baris + j × JEDA, spasi
// dilewati) + "cetak" kecil saat huruf lama dicopot. Disintesis di sini (orisinal). Musik latar dari music-kit.
const { CONFIG, SCENES } = require('./scenes');
const { wordTime } = require('../lib/wordtime');
const kit = require('../lib/music-kit')(CONFIG.music, SCENES);
const JEDA = 0.07;

module.exports = function compose(music, rev, tl, I) {
  kit(music, rev, tl, I);
  const { SR, SVF, noise } = I;
  function klik(t0, g, pan, f0 = 2400) {
    const n = Math.floor(0.05 * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f2 = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const y = f.run(noise(), f0, 1.6).bp * Math.exp(-t * 160) * 1.2 + f2.run(noise(), 700, 1).bp * Math.exp(-t * 90) * 0.5;
      music.add(s0 + i, y * g, pan); rev.add(s0 + i, y * g * 0.2, pan);
    }
  }
  const per = [[], [], []]; // per baris: waktu mulai tiap keadaan
  SCENES.forEach((s, i) => {
    const sc = tl.scenes[i];
    const R = (c, fb) => { try { return typeof c === 'number' ? c : wordTime(sc, c); } catch (e) { return fb; } };
    (s.vis.baris || []).forEach(([bi, at, teks], n) => per[bi].push({ t: sc.start + R(at, 0.2 + n * 0.8), teks }));
  });
  per.forEach((sts, bi) => {
    sts.sort((a, b) => a.t - b.t);
    sts.forEach((st, k) => {
      let j = 0;
      [...st.teks].forEach((ch) => { if (ch === ' ') return; klik(st.t + j * JEDA, 0.2 + 0.08 * ((j * 5) % 3) / 2, -0.25 + 0.5 * (j / st.teks.length), bi === 1 ? 1900 : 2600); j++; });
      if (k + 1 < sts.length) { const tOut = sts[k + 1].t - 0.45; for (let m = 0; m < Math.min(j, 6); m++) klik(tOut + m * 0.04, 0.1, 0.2 - 0.4 * (m / 6), 1200); }
    });
  });
};
