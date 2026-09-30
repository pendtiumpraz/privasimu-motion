// GB05 — musik tenang (music-kit) + bunyi goresan pena yang mengikuti saat garis digambar.
// Goresan = noise tersaring yang bergelombang seperti pena di atas kertas; disintesis di sini (orisinal, bebas royalti).
const { CONFIG, SCENES } = require('./scenes');
const { wordTime } = require('../lib/wordtime');
const kit = require('../lib/music-kit')(CONFIG.music, SCENES);

module.exports = function compose(music, rev, tl, I) {
  kit(music, rev, tl, I);
  const { SR, SVF, noise } = I;
  function gores(t0, t1, g, cepat) {
    const n = Math.floor((t1 - t0) * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f2 = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR, p = i / n;
      const tepi = Math.min(1, t * 12) * Math.min(1, (t1 - t0 - t) * 10); // masuk & keluar halus
      // gelombang gerak tangan: cepat-lambat tak beraturan tapi deterministik
      const gerak = 0.55 + 0.45 * Math.sin(2 * Math.PI * (cepat * t + 0.6 * Math.sin(2 * Math.PI * 1.3 * t)));
      const y = f.run(noise(), 2600 + 1400 * gerak, 1.1).bp * 0.8 + f2.run(noise(), 6500, 0.8).hp * 0.12;
      music.add(s0 + i, y * g * tepi * (0.35 + 0.65 * gerak), -0.25 + 0.5 * p);
    }
  }
  SCENES.forEach((s, i) => {
    const sc = tl.scenes[i];
    const R = (c) => (typeof c === 'number' ? c : c.startsWith('end-') ? sc.dur - parseFloat(c.slice(4)) : wordTime(sc, c));
    for (const [id, a, b] of s.vis.gambar || []) {
      const t0 = sc.start + R(a), t1 = sc.start + R(b);
      if (t1 - t0 > 0.2) gores(t0, t1, id === 'kusut' ? 0.085 : id === 'pembuka' ? 0.05 : 0.06, id === 'kusut' ? 5.5 : 3.2);
    }
  });
};
