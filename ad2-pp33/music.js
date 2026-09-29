// Musik iklan #2 — 120 bpm, detak jam sebagai metronom.
// Tegang (D minor: Dm–Bb–Gm–A) sampai "sudah siap?", jeda satu ketukan, lalu drop cerah (F mayor: F–C–Dm–Bb).
module.exports = function compose(music, rev, tl, I) {
  const { pad, bass, pluck, kick, clap, hat, sine, clock } = I;
  const sc = (id) => tl.scenes.find((s) => s.id === id);
  const B = 0.5, BAR = 4 * B;
  const tW = sc('wajib').start, tS = sc('siap').start, tN = sc('nexus').start, total = tl.total;

  // Detak jam tiap ketukan (tick/tock), lebih keras di "sudah siap?", berhenti 1 ketukan sebelum drop
  for (let t = 0, k = 0; t < tN - B + 0.01; t += B, k++) clock(music, t, t < tS ? 0.2 : 0.34, k % 2 === 1);

  // Scene tanggal: dengung rendah setelah mendarat
  pad(music, 1.0, 3.0, [38, 45, 50], { gain: 0.08, cutoff: 380, attack: 0.05, release: 1.5 });
  sine(music, 1.0, 36.71, 3.5, 0.28, 0.9);

  // Bagian tegang: mulai ketukan ke-3 (1.0 dtk) sampai scene "siap"
  const TENSE = [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]];
  const TB = [38, 34, 31, 33];
  let bi = 0;
  for (let tb = 1.0 + BAR * 2; tb < tS - 0.01; tb += BAR, bi++) {
    const end = Math.min(tb + BAR, tS), prog = (tb - 1) / (tS - 1);
    pad(music, tb, end - tb, TENSE[bi % 4], { gain: 0.06 + 0.03 * prog, cutoff: 500 + 1300 * prog, attack: 0.3, release: 0.4 });
    pad(rev, tb, end - tb, TENSE[bi % 4].map((m) => m + 12), { gain: 0.03, cutoff: 1500, attack: 0.5, release: 0.6 });
    for (let s = 0; s < 8; s++) {
      const t = tb + s * B / 2; if (t >= end) break;
      bass(music, t, B / 2 * 0.7, TB[bi % 4] + (s % 2 ? 12 : 0), { gain: 0.14 + 0.1 * prog, cutoff: 300 + 800 * prog });
      if (t >= tW) {
        if (s % 4 === 0) kick(music, t, 0.6);
        hat(music, t, 0.03 + 0.02 * prog, false, s % 2 ? 0.3 : -0.3);
        hat(music, t + B / 4, 0.02, false, -0.2);
      }
    }
  }

  // "Sudah siap?": hanya detak jam + detak jantung + nada rendah
  for (let t = tS; t < tN - B - 0.01; t += BAR / 2) { kick(music, t, 0.55, 0.35); kick(music, t + 0.2, 0.3, 0.3); }
  pad(music, tS, tN - tS - 0.6, [38, 45], { gain: 0.07, cutoff: 300, attack: 0.3, release: 0.3 });

  // Drop cerah: F–C–Dm–Bb
  const BRIGHT = [
    { b: 41, p: [53, 57, 60, 67] }, { b: 36, p: [52, 55, 60, 67] },
    { b: 38, p: [50, 53, 57, 64] }, { b: 34, p: [50, 53, 58, 65] },
  ];
  const tEnd = tN + Math.floor((total - 2.4 - tN) / B) * B; // akor penutup jatuh di ketukan
  sine(music, tN, 43.65, 2.2, 0.4, 1.4);
  bi = 0;
  for (let tb = tN; tb < tEnd - 0.01; tb += BAR, bi++) {
    const c = BRIGHT[bi % 4], end = Math.min(tb + BAR, tEnd);
    pad(music, tb, end - tb, c.p, { gain: 0.075, cutoff: 2000, attack: 0.06, release: 0.45 });
    pad(rev, tb, end - tb, c.p, { gain: 0.035, cutoff: 2000, attack: 0.06, release: 0.45 });
    for (let s = 0; s < 16; s++) {
      const t = tb + s * B / 4; if (t >= end) break;
      const arp = [0, 1, 2, 3, 2, 1, 3, 2][s % 8];
      pluck(music, t, c.p[arp] + 12, { gain: 0.034, pan: s % 2 ? 0.45 : -0.45 });
      if (s % 2 === 0) pluck(rev, t, c.p[arp] + 12, { gain: 0.018 });
      if (s % 2 === 0) bass(music, t, B / 2 * 0.85, c.b, { gain: 0.22, cutoff: 850 });
      if (s % 4 === 0) kick(music, t, 0.78);
      if (s % 8 === 4) { clap(music, t, 0.3); clap(rev, t, 0.14); }
      if (s % 4 === 2) hat(music, t, 0.065, true);
      else hat(music, t, 0.032, false, s % 2 ? 0.3 : -0.3);
    }
  }
  // Akor penutup + lonceng
  const tail = total - tEnd;
  kick(music, tEnd, 0.85, 1.4);
  sine(music, tEnd, 43.65, tail, 0.35, 1.2);
  bass(music, tEnd, tail - 0.9, 41, { gain: 0.22, cutoff: 420 });
  pad(music, tEnd, tail - 1.1, [41, 53, 57, 60, 67, 72], { gain: 0.11, cutoff: 2400, attack: 0.02, release: 1.1 });
  pad(rev, tEnd, tail - 1.1, [57, 60, 67, 72, 77], { gain: 0.06, cutoff: 2400, attack: 0.02, release: 1.1 });
  [77, 81, 84, 89].forEach((m, k) => pluck(music, tEnd + k * 0.09, m, { gain: 0.04, decay: 2.2, pan: k % 2 ? 0.4 : -0.4 }));
};
