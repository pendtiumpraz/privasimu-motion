// TY05 — bunyi tuts mesin tik per huruf (sinkron dengan style.js: huruf ke-j muncul pada waktu baris + j × JEDA) + "ting"
// di akhir baris. Disintesis di sini (orisinal). Musik latar tipis dari music-kit.
const { CONFIG, SCENES } = require('./scenes');
const { wordTime } = require('../lib/wordtime');
const kit = require('../lib/music-kit')(CONFIG.music, SCENES);
const JEDA = 0.055;

module.exports = function compose(music, rev, tl, I) {
  kit(music, rev, tl, I);
  const { SR, SVF, noise } = I;
  function tuts(t0, g, pan) {
    const n = Math.floor(0.09 * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f2 = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      const y = f.run(noise(), 2600, 1.2).bp * Math.exp(-t * 90) * 1.1 + f2.run(noise(), 900, 1).bp * Math.exp(-t * 60) * 0.6 + Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 70) * 0.35;
      music.add(s0 + i, y * g, pan); rev.add(s0 + i, y * g * 0.25, pan);
    }
  }
  function ting(t0, g) {
    const n = Math.floor(1.2 * SR), s0 = Math.floor(t0 * SR);
    for (let i = 0; i < n; i++) { const t = i / SR; const y = (Math.sin(2 * Math.PI * 2093 * t) + Math.sin(2 * Math.PI * 3140 * t) * 0.4) * Math.exp(-t * 4) * g; music.add(s0 + i, y, 0.3); rev.add(s0 + i, y * 0.5, 0.3); }
  }
  SCENES.forEach((s, i) => {
    const sc = tl.scenes[i];
    const R = (c, fb) => { try { return typeof c === 'number' ? c : wordTime(sc, c); } catch (e) { return fb; } };
    const baris = [...(s.vis.kepala ? [[s.vis.kepala, 0.05]] : []), ...(s.vis.baris || [])];
    baris.forEach(([teks, at], bi) => {
      const t0 = sc.start + R(at, 0.5);
      [...teks].forEach((ch, j) => { if (ch !== ' ') tuts(t0 + j * JEDA, 0.22 + 0.1 * ((j * 7) % 3) / 3, -0.2 + 0.4 * (j / teks.length)); });
      ting(t0 + teks.length * JEDA + 0.05, 0.12);
    });
    if (s.vis.timpa != null) { const t0 = sc.start + R(s.vis.timpa, 0.5); for (let j = 0; j < 17; j++) tuts(t0 + j * JEDA * 0.7, 0.3, 0); }
  });
};
