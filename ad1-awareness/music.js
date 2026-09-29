// Musik iklan #1: bagian A tegang (A minor, 100 bpm) -> bagian B uplifting (C mayor, 112 bpm) mulai scene modul.
module.exports = function compose(music, rev, tl, I) {
  const { pad, bass, pluck, kick, clap, hat, sine } = I;
  const sc = Object.fromEntries(tl.scenes.map((s) => [s.id, s]));
  const tReveal = sc.reveal.start, tMod = sc.modules.start, tCta = sc.cta.start, total = tl.total;

  // Bagian A
  const beatA = 60 / 100, endA = tReveal - 0.35;
  pad(music, 0, endA - 0.6, [45, 52, 57, 60], { gain: 0.07, cutoff: 700, attack: 1.5, release: 0.6 });
  for (let t = 0, k = 0; t < endA; t += beatA / 2, k++) {
    const prog = t / endA;
    bass(music, t, beatA / 2 * 0.8, k % 8 === 7 ? 34 : 33, { gain: 0.16 + 0.1 * prog, cutoff: 250 + 900 * prog });
    if (k % 2 === 0) kick(music, t, 0.55);
    if (k % 2 === 0 && t + 0.2 < endA) kick(music, t + 0.19, 0.25, 0.25); // lub-dub
    if (t > sc.chaos.start) { hat(music, t, 0.05); hat(music, t + beatA / 4, 0.03, false, -0.25); }
  }
  for (let t = sc.law.start; t < endA; t += beatA) sine(music, t, 3200, 0.03, 0.05, 120, 0.4);

  // Bagian B
  pad(music, tReveal, tMod - tReveal, [60, 64, 67, 74], { gain: 0.09, cutoff: 1100, attack: 1.2 });
  pad(rev, tReveal, tMod - tReveal, [60, 64, 67, 74], { gain: 0.05, cutoff: 1100, attack: 1.2 });
  const beat = 60 / 112, bar = beat * 4;
  const CH = [
    { b: 36, p: [60, 64, 67, 74] }, { b: 43, p: [59, 62, 67, 74] },
    { b: 45, p: [60, 64, 69, 72] }, { b: 41, p: [60, 65, 69, 72] },
  ];
  for (let t = tMod - bar, k = 0; t < tMod; t += beat / 4, k++) {
    if (t < tReveal + 1.8) continue;
    pluck(music, t, [72, 76, 79, 84][k % 4], { gain: 0.03 + 0.04 * ((t - (tMod - bar)) / bar), bright: 2000 });
  }
  let bi = 0;
  for (let tb = tMod; tb < tCta - 0.01; tb += bar, bi++) {
    const c = CH[bi % 4], barEnd = Math.min(tb + bar, tCta);
    pad(music, tb, barEnd - tb, c.p, { gain: 0.07, cutoff: 1800, attack: 0.08, release: 0.5 });
    pad(rev, tb, barEnd - tb, c.p, { gain: 0.03, cutoff: 1800, attack: 0.08, release: 0.5 });
    for (let s = 0; s < 16; s++) {
      const t = tb + s * beat / 4; if (t >= tCta) break;
      const arp = [0, 1, 2, 3, 2, 1, 3, 2][s % 8];
      pluck(music, t, c.p[arp] + 12, { gain: 0.035, pan: s % 2 ? 0.45 : -0.45 });
      if (s % 2 === 0) pluck(rev, t, c.p[arp] + 12, { gain: 0.02 });
      if (s % 2 === 0) bass(music, t, beat / 2 * 0.85, c.b, { gain: 0.22, cutoff: 800 });
      if (s % 4 === 0) kick(music, t, 0.75);
      if (s % 8 === 4) { clap(music, t, 0.3); clap(rev, t, 0.15); }
      if (s % 4 === 2) hat(music, t, 0.07, true);
      else hat(music, t, 0.035, false, s % 2 ? 0.3 : -0.3);
    }
  }
  // CTA: chord akhir
  const tail = total - tCta;
  kick(music, tCta, 0.8, 1.2);
  bass(music, tCta, tail - 0.8, 36, { gain: 0.24, cutoff: 400 });
  pad(music, tCta, tail - 1.4, [48, 60, 64, 67, 74, 79], { gain: 0.11, cutoff: 2200, attack: 0.02, release: 1.4 });
  pad(rev, tCta, tail - 1.4, [60, 64, 67, 74, 79], { gain: 0.06, cutoff: 2200, attack: 0.02, release: 1.4 });
  for (let t = tCta + beat * 2, k = 0; t < total - 1.6; t += beat / 2, k++) {
    pluck(music, t, [84, 79, 76, 74, 72, 76][k % 6], { gain: 0.03 * (1 - (t - tCta) / tail), pan: k % 2 ? 0.5 : -0.5 });
  }
};
