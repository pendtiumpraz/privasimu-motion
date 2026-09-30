// TY07 — klik tuts pelan per karakter (sinkron dengan style.js: baris ke-i mulai pada cue, karakter ke-j pada +j×JEDA).
// Disintesis di sini (orisinal). Musik latar chip dari music-kit.
const { CONFIG, SCENES } = require('./scenes');
const { wordTime } = require('../lib/wordtime');
const kit = require('../lib/music-kit')(CONFIG.music, SCENES);
const JEDA = 0.03;
const PANJANG = [39, 0, 19, 24, 1, 24, 24, 48, 3, 47]; // jumlah karakter per baris (perkiraan cukup untuk klik)

module.exports = function compose(music, rev, tl, I) {
  kit(music, rev, tl, I);
  const { SR, SVF, noise } = I;
  function klik(t0, g, pan) {
    const n = Math.floor(0.03 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
    for (let i = 0; i < n; i++) { const t = i / SR; const y = f.run(noise(), 3200, 1.4).bp * Math.exp(-t * 220); music.add(s0 + i, y * g, pan); }
  }
  SCENES.forEach((s, i) => {
    const sc = tl.scenes[i];
    const R = (c, fb) => { try { return typeof c === 'number' ? c : wordTime(sc, c); } catch (e) { return fb; } };
    (s.vis.baris || []).forEach(([bi, at]) => { const t0 = sc.start + R(at, 0.5); for (let j = 0; j < PANJANG[bi]; j++) klik(t0 + j * JEDA, 0.12 + 0.05 * ((j * 7) % 3) / 2, -0.2 + 0.4 * (j / Math.max(1, PANJANG[bi]))); });
    if (s.vis.komentar != null) { const t0 = sc.start + R(s.vis.komentar, 3); for (let j = 0; j < 20; j++) klik(t0 + j * JEDA, 0.14, 0.1); }
  });
};
