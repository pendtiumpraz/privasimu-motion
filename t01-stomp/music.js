// T01 — musik stomp orisinal (disintesis di sini, bebas royalti; tidak memakai sampel/lagu pihak lain).
// Pola global 100 bpm: STOMP di ketukan 0 & 0,5 dan 2 & 2,5, CLAP di ketukan 1 & 3 (dihitung dari awal scene,
// dan semua scene berdurasi kelipatan birama — sama dengan pola kartu di style.js).
// Bagian (SCENES[i].mus): hook (stomp-clap polos) · break (scratch → hening → gulungan clap + riser) · drop (Dm, bass kasar,
// stab) · logo (resolusi ke F mayor) · siap (tegang → berhenti, detak jantung) · cta (F mayor ringan → sonic logo).
const { SCENES, BEAT, BAR } = require('./scenes');
const { wordTime } = require('../lib/wordtime');
const { SFX, I: A } = require('../lib/audio');

const { SR, mtof, SVF, sine, kick, clap, hat, pad, bass, keys, bell, noise } = A;
const TAU = Math.PI * 2;
const STOMP = [0, 0.5, 2, 2.5], CLAP = [1, 3];

// ---------- instrumen ----------
function stomp(bus, rev, t0, g = 1) { // hentakan kaki di lantai kayu: badan kick + dentum rendah + sedikit ruang
  kick(bus, t0, 0.8 * g, 0.55);
  const n = Math.floor(0.14 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
  for (let i = 0; i < n; i++) { const t = i / SR; bus.add(s0 + i, f.run(noise(), 230, 0.9).lp * Math.exp(-t * 26) * 1.1 * g); }
  kick(rev, t0, 0.16 * g, 0.4);
}
function bigClap(bus, rev, t0, g = 1) { // tepuk ramai: tiga lapis sedikit bergeser + ruang
  clap(bus, t0, 0.4 * g); clap(bus, t0 + 0.011, 0.28 * g); clap(bus, t0 + 0.024, 0.2 * g);
  clap(rev, t0, 0.32 * g);
}
function crash(bus, rev, t0, g = 0.2) {
  const n = Math.floor(1.6 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
  for (let i = 0; i < n; i++) { const t = i / SR, y = f.run(noise(), 5200, 0.7).hp * Math.exp(-t * 2.6) * g; bus.add(s0 + i, y, 0.3); rev.add(s0 + i, y * 0.3, -0.3); }
}
function grit(bus, t0, dur, m, g = 0.2) { // bass kasar: saw + sub, low-pass, saturasi
  const n = Math.floor((dur + 0.04) * SR), s0 = Math.floor(t0 * SR), f = new SVF(), fr = mtof(m);
  let p = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p = (p + fr / SR) % 1;
    const y = f.run((2 * p - 1) * 0.8 + Math.sin(TAU * p) * 0.9, 380 + 1400 * Math.exp(-t * 14), 1.3).lp;
    const e = Math.min(1, t * 400) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.04) : 1);
    bus.add(s0 + i, Math.tanh(y * 2.2) * e * g);
  }
}
function stab(bus, t0, m, g = 0.04, len = 0.14, pan = 0) { // stab synth pendek
  const n = Math.floor((len + 0.05) * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f1 = mtof(m), f2 = f1 * 1.007;
  let p1 = 0, p2 = 0.5;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p1 = (p1 + f1 / SR) % 1; p2 = (p2 + f2 / SR) % 1;
    const y = f.run((2 * p1 - 1) + (2 * p2 - 1), 900 + 4200 * Math.exp(-t * 15), 1.3).lp;
    bus.add(s0 + i, y * g * Math.min(1, t * 400) * (t > len ? Math.max(0, 1 - (t - len) / 0.05) : 1), pan);
  }
}

module.exports = function compose(music, rev, tl) {
  const B = BEAT, S16 = B / 4;
  const sc = (id) => tl.scenes.find((x) => x.id === id);
  const span = (id) => { const s = sc(id); return [s.start, s.start + s.dur]; };

  // groove stomp per birama dari a sampai b
  function groove(a, b, { g = 1, hats = 1, roots = null, chords = null, stop = b } = {}) {
    for (let bar = 0, t0 = a; t0 < b - 0.01; bar++, t0 += BAR) {
      for (const bt of STOMP) { const t = t0 + bt * B; if (t < stop - 0.01) stomp(music, rev, t, g); }
      for (const bt of CLAP) { const t = t0 + bt * B; if (t < stop - 0.01) bigClap(music, rev, t, g); }
      if (hats) for (let k = 0; k < 16; k++) { const t = t0 + k * S16; if (t < stop - 0.01) hat(music, t, (k % 4 === 2 ? 0.034 : 0.016) * hats, false, k % 2 ? 0.3 : -0.3); }
      if (roots) { const m = roots[bar % roots.length]; for (const bt of STOMP) { const t = t0 + bt * B; if (t < stop - 0.01) grit(music, t, B * 0.42, m, 0.19 * g); } }
      if (chords) {
        const ch = chords[bar % chords.length];
        for (const bt of [1, 3, 3.5]) { const t = t0 + bt * B; if (t < stop - 0.01) ch.forEach((m, j) => stab(music, t, m, 0.028 * g, 0.13, j % 2 ? 0.3 : -0.3)); }
      }
    }
  }

  // ---- s1 · hook: stomp-clap polos (a cappella) + dengung D rendah; birama 2 ditambah hat & bass ----
  {
    const [a, b] = span('s1');
    groove(a, a + BAR, { hats: 0 });
    groove(a + BAR, b, { hats: 0.7, roots: [38] });
    pad(music, a, b - a - 0.2, [38, 45], { gain: 0.035, cutoff: 320, attack: 0.4, release: 0.3 });
  }

  // ---- s2 · break: scratch (SFX scene) → hampir hening → gulungan clap makin rapat + riser → drop ----
  {
    const [a, b] = span('s2'), r0 = a + 2 * B;
    pad(music, a + 0.2, b - a - 0.4, [50, 53, 57], { gain: 0.022, cutoff: 420, attack: 0.5, release: 0.2 });
    for (let t = r0, k = 0; t < b - 0.02; k++) {
      const p = (t - r0) / (b - r0), step = p < 0.34 ? B / 2 : p < 0.67 ? B / 4 : B / 8;
      clap(music, t, 0.12 + 0.3 * p);
      t += step;
    }
    SFX.riser(music, r0, 0.42, rev, b - r0);
    sine(music, r0, 36.7, b - r0, 0.12, 0.2);
  }

  // ---- s3–s4 · drop (Dm – Bb – Dm – C), lalu birama "Semua. Dalam. Satu. Platform." (Bb → C) ----
  {
    const [a] = span('s3'), [c, d] = span('s4');
    crash(music, rev, a, 0.22);
    sine(music, a, 36.7, 1.2, 0.35, 1.8); // sub drop
    groove(a, c, { roots: [38, 34, 38, 36], chords: [[62, 65, 69], [58, 62, 65], [62, 65, 69], [60, 64, 67]] });
    // s4: groove sampai ketukan 2 ("PLATFORM."), hentakan besar di ketukan 2, clap di 3, lalu jeda singkat sebelum logo
    crash(music, rev, c, 0.16);
    groove(c, d, { roots: [34], chords: [[58, 62, 65]], stop: c + 2 * B });
    SFX.impact(music, c + 2 * B, 0.7);
    crash(music, rev, c + 2 * B, 0.2);
    grit(music, c + 2 * B, B * 0.9, 36, 0.22);
    bigClap(music, rev, c + 3 * B, 1.1);
    [60, 64, 67].forEach((m, j) => stab(music, c + 3 * B, m, 0.035, 0.3, j % 2 ? 0.3 : -0.3));
  }

  // ---- s5 · logo: resolusi terang ke F mayor, setengah tempo, arpeggio lonceng ----
  {
    const [a, b] = span('s5');
    crash(music, rev, a, 0.24);
    stomp(music, rev, a, 1.1); bigClap(music, rev, a + 2 * B, 1);
    pad(music, a, b - a - 0.1, [53, 57, 60, 65], { gain: 0.06, cutoff: 2400, attack: 0.02, release: 0.4 });
    pad(rev, a, b - a - 0.1, [69, 72, 77], { gain: 0.03, cutoff: 2400, attack: 0.05, release: 0.6 });
    bass(music, a, b - a - 0.15, 41, { gain: 0.22, cutoff: 500 });
    [77, 81, 84, 89, 84, 81, 84, 89].forEach((m, k) => { bell(music, a + k * B / 2, m, { gain: 0.035, pan: k % 2 ? 0.3 : -0.3 }); if (k % 2 === 0) bell(rev, a + k * B / 2, m, { gain: 0.02 }); });
  }

  // ---- s6 · siap: birama tegang (D), lalu berhenti di "SIAP?" (vineboom = SFX scene), detak jantung + riser ke CTA ----
  {
    const [a, b] = span('s6'), mid = a + BAR;
    groove(a, mid, { roots: [38], chords: [[62, 65, 69]] });
    crash(music, rev, a, 0.14);
    sine(music, mid, 36.7, b - mid, 0.14, 0.15);
    pad(music, mid, b - mid - 0.1, [50, 53, 56], { gain: 0.03, cutoff: 500, attack: 0.3, release: 0.2 });
    SFX.heart(music, mid + B, 0.8); SFX.heart(music, mid + 2 * B, 0.7); SFX.heart(music, mid + 3 * B, 0.6);
  }

  // ---- s7 · CTA: groove F mayor yang lebih ringan (F – C – Dm – Bb), berhenti setelah VO → sonic logo "Pri-va-si-mu" ----
  {
    const s = sc('s7'), [a, b] = span('s7');
    let voEnd = b - 3;
    try { voEnd = s.start + wordTime(s, 'w:com') + 0.3; } catch (e) { /* pakai perkiraan */ }
    const stop = Math.min(b - 2.8, a + Math.ceil((voEnd - a) / (B / 2)) * (B / 2)); // sama dengan style.js (stomp_cta)
    crash(music, rev, a, 0.2);
    groove(a, b, { g: 0.72, hats: 0.8, roots: [41, 36, 38, 34], stop });
    const CH = [[53, 57, 60, 65], [52, 55, 60, 64], [50, 53, 57, 62], [50, 53, 58, 62]];
    for (let bar = 0, t0 = a; t0 < stop - 0.01; bar++, t0 += BAR) pad(music, t0, Math.min(BAR, stop - t0) * 0.95, CH[bar % 4], { gain: 0.035, cutoff: 1600, attack: 0.05, release: 0.3 });
    // penutup: stomp-stomp-clap terakhir + akor F + sonic logo (do'-la-sol-fa)
    stomp(music, rev, stop, 1); stomp(music, rev, stop + B / 2, 1); bigClap(music, rev, stop + B, 1.1);
    crash(music, rev, stop + B, 0.18);
    pad(music, stop + B, Math.max(0.4, b - stop - B - 0.2), [53, 57, 60, 65, 69], { gain: 0.06, cutoff: 2300, attack: 0.02, release: 0.8 });
    bass(music, stop + B, Math.max(0.3, b - stop - B - 0.3), 41, { gain: 0.2, cutoff: 420 });
    [[84, 0], [81, 0.5], [79, 1], [77, 1.5]].forEach(([m, dt], k) => {
      keys(music, stop + B + dt * B, m, B * (k === 3 ? 2 : 0.9), { gain: k === 3 ? 0.07 : 0.055 });
      bell(rev, stop + B + dt * B, m + 12, { gain: 0.03 });
    });
  }
};
