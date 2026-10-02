// LP02 — musik orisinal (disintesis di lib/audio.js, bebas royalti). 84 bpm, D minor → F mayor.
// Alur: hook sunyi (pad rendah + nada keys di tiap baris) → konteks (denyut mulai) → sembilan stasiun: progresi
// Dm–B♭–F–C (2 birama per stasiun) yang menebal pelan-pelan (bass, kick ringan, hi-hat, arpeggio keys) dengan
// satu nada melodi tepat saat kata kerja muncul → taruhan "2%": semua turun, detak jantung, akor A (dominan) menggantung
// → "Satu platform.": resolusi ke F mayor → kamera mundur: F–C–Dm–B♭ penuh → CTA: B♭→F (kadens plagal) + sonic logo
// "Pri-va-si-mu" (sol-mi-re-do). Semua waktu dihitung dalam ketukan sejak awal scene, jadi jatuh bersama teks.
const { BEAT } = require('./scenes');

module.exports = function compose(music, rev, tl, I) {
  const { pad, bass, keys, bell, kick, hat, sine, mtof } = I;
  const B = BEAT;
  const S = (id) => tl.scenes.find((s) => s.id === id);
  const at = (id, beats) => S(id).start + beats * B;

  // akor (voicing pad) + akar bass
  const CH = {
    Dm: { p: [50, 57, 62, 65], b: 38 }, Bb: { p: [53, 58, 62, 65], b: 34 }, F: { p: [53, 57, 60, 65], b: 41 },
    C: { p: [52, 55, 60, 64], b: 36 }, A: { p: [52, 57, 61, 64], b: 33 },
  };
  const tone = (t, m, g, pan = 0, dur = B * 1.6) => { keys(music, t, m, dur, { gain: g, pan }); keys(rev, t, m, dur, { gain: g * 0.55 }); };
  const chime = (t, m, g, pan = 0) => { bell(music, t, m, { gain: g, pan, decay: 2.4 }); bell(rev, t, m, { gain: g * 0.6 }); };
  const padBar = (t, dur, c, o) => { pad(music, t, dur, c.p, o); pad(rev, t, dur, c.p.map((n) => n + 12), { ...o, gain: o.gain * 0.35 }); };

  // ---------- 1 · hook: sunyi, pad Dm rendah, nada naik di tiap baris ----------
  {
    const s = S('s1');
    pad(music, s.start, s.dur, [38, 45, 50], { gain: 0.06, cutoff: 420, attack: 1.4, release: 0.8 });
    pad(rev, s.start, s.dur, [57, 62], { gain: 0.02, cutoff: 900, attack: 2, release: 1 });
    kick(music, at('s1', 0.5), 0.28, 1.1);
    sine(music, at('s1', 0.5), mtof(26), 2.4, 0.1, 1.1);
    [[0.5, 69], [2, 72], [3.5, 74], [5, 77]].forEach(([bt, m], i) => tone(at('s1', bt), m, 0.05, i % 2 ? 0.25 : -0.25, B * 2));
    chime(at('s1', 5), 81, 0.035, 0.3);
  }

  // ---------- 2 · konteks: denyut mulai (Dm | B♭ | C) ----------
  {
    [CH.Dm, CH.Bb, CH.C].forEach((c, bar) => {
      const t0 = at('s2', bar * 4);
      padBar(t0, 4 * B, c, { gain: 0.055 + bar * 0.006, cutoff: 600 + bar * 150, attack: 0.5, release: 0.6 });
      for (let q = 0; q < 4; q++) bass(music, t0 + q * B, B * 0.8, c.b, { gain: 0.085 + bar * 0.01, cutoff: 260 });
      kick(music, t0, 0.3, 0.5);
    });
    [[1.5, 74], [3, 69], [5, 77], [6.5, 76]].forEach(([bt, m], i) => tone(at('s2', bt), m, 0.045, i % 2 ? 0.3 : -0.3, B * 2));
  }

  // ---------- 3–11 · sembilan stasiun: Dm–B♭ | F–C, menebal pelan ----------
  const MEL = [69, 72, 74, 72, 77, 76, 74, 77, 81];
  const ANS = [65, 69, 69, 67, 74, 72, 69, 74, 77];
  for (let k = 1; k <= 9; k++) {
    const id = 's' + (k + 2), L = (k - 1) / 8;
    const prog = k % 2 ? [CH.Dm, CH.Bb] : [CH.F, CH.C];
    prog.forEach((c, bar) => {
      const t0 = at(id, bar * 4);
      padBar(t0, 4 * B, c, { gain: 0.05 + 0.03 * L, cutoff: 750 + 1500 * L, attack: 0.35, release: 0.5 });
      for (let e = 0; e < 8; e++) { // per seperdelapan
        const t = t0 + e * B / 2;
        if (e % 2 === 0 || L >= 0.3) bass(music, t, B / 2 * 0.8, c.b + (L >= 0.6 && e % 4 === 3 ? 12 : 0), { gain: (e % 2 ? 0.07 : 0.1) + 0.07 * L, cutoff: 280 + 520 * L });
        if (e % 4 === 0) kick(music, t, 0.34 + 0.16 * L, 0.5);
        if (L >= 0.6 && e === 5) kick(music, t, 0.16 + 0.1 * L, 0.35);
        if (L >= 0.2 && e % 2 === 1) hat(music, t, 0.02 + 0.03 * L, false, e % 4 === 1 ? 0.3 : -0.3);
        if (L >= 0.7) hat(music, t + B / 4, 0.014 + 0.014 * L, false, 0.2);
        if (L >= 0.35) { // arpeggio keys (oktaf atas)
          const arp = c.p.map((n) => n + 12);
          keys(music, t, arp[[0, 2, 1, 3, 2, 1, 3, 2][e]], B * 0.45, { gain: 0.014 + 0.018 * L, pan: e % 2 ? 0.4 : -0.4 });
          if (L >= 0.75) keys(music, t + B / 4, arp[[2, 3, 2, 1, 3, 0, 2, 3][e]], B * 0.3, { gain: 0.008 + 0.008 * L, pan: e % 2 ? -0.35 : 0.35 });
        }
      }
    });
    tone(at(id, 1.5), MEL[k - 1], 0.052, k % 2 ? -0.15 : 0.15, B * 2.2);
    chime(at(id, 1.5), MEL[k - 1] + 12, 0.014, k % 2 ? 0.3 : -0.3);
    tone(at(id, 3), ANS[k - 1], 0.03, k % 2 ? 0.2 : -0.2, B * 1.6);
  }

  // ---------- 12 · taruhan: semua turun, detak jantung, A (dominan) menggantung ----------
  {
    const s = S('s12');
    pad(music, s.start, 4 * B, [46, 53, 58], { gain: 0.06, cutoff: 480, attack: 0.25, release: 0.5 });
    pad(music, at('s12', 4), s.dur - 4 * B, CH.A.p.map((n) => n - 12).concat([57]), { gain: 0.07, cutoff: 650, attack: 0.08, release: 0.9 });
    pad(rev, at('s12', 4), s.dur - 4 * B, CH.A.p, { gain: 0.03, cutoff: 1400, attack: 0.3, release: 1 });
    for (let bt = 0; bt < 10; bt += 2) { kick(music, at('s12', bt), 0.42, 0.35); kick(music, at('s12', bt) + 0.2, 0.24, 0.3); }
    sine(music, at('s12', 4), 41.2, 3.2, 0.34, 0.9);
    keys(music, at('s12', 4), 38, B * 3, { gain: 0.06 }); keys(music, at('s12', 4), 45, B * 3, { gain: 0.045 });
    tone(at('s12', 1.5), 62, 0.03, -0.2, B * 2);
    tone(at('s12', 6.5), 64, 0.026, 0.2, B * 2);
  }

  // ---------- 13 · balik: Dm tenang → "Satu platform." resolusi F mayor ----------
  {
    const s = S('s13'), tp = at('s13', 5.5);
    pad(music, s.start, 5.5 * B, CH.Dm.p, { gain: 0.045, cutoff: 600, attack: 0.6, release: 0.5 });
    tone(at('s13', 1.5), 69, 0.045, -0.25, B * 2);
    tone(at('s13', 3.5), 72, 0.045, 0.25, B * 2);
    sine(music, tp, 43.65, 2.6, 0.32, 1.2);
    kick(music, tp, 0.5, 0.9);
    [65, 69, 72, 76].forEach((m, i) => tone(tp + i * 0.06, m, 0.045, (i - 1.5) * 0.25, B * 3));
    chime(tp + 0.12, 84, 0.04, 0.2);
    padBar(tp, s.start + s.dur - tp, CH.F, { gain: 0.07, cutoff: 1900, attack: 0.08, release: 0.6 });
    bass(music, tp, s.start + s.dur - tp - 0.05, 41, { gain: 0.16, cutoff: 420 });
  }

  // ---------- 14 · kamera mundur: F–C–Dm–B♭ penuh ----------
  {
    let bt = 0;
    [[CH.F, 4], [CH.C, 4], [CH.Dm, 4], [CH.Bb, 2]].forEach(([c, n]) => {
      const t0 = at('s14', bt);
      padBar(t0, n * B, c, { gain: 0.07, cutoff: 2300, attack: 0.25, release: 0.6 });
      const arp = c.p.map((x) => x + 12);
      for (let e = 0; e < n * 2; e++) {
        const t = t0 + e * B / 2, m = arp[[0, 2, 1, 3, 2, 1, 3, 2][e % 8]];
        bass(music, t, B / 2 * 0.85, c.b, { gain: e % 2 ? 0.1 : 0.15, cutoff: 700 });
        if (e % 4 === 0) kick(music, t, 0.5, 0.55);
        if (e % 2 === 1) hat(music, t, 0.042, false, e % 4 === 1 ? 0.3 : -0.3);
        keys(music, t, m, B * 0.5, { gain: 0.024, pan: e % 2 ? 0.45 : -0.45 });
        keys(rev, t, m, B * 0.5, { gain: 0.012 });
      }
      bt += n;
    });
    [[5, 84], [5.5, 81], [6, 79], [7, 77]].forEach(([b2, m], i) => chime(at('s14', b2), m, i ? 0.022 : 0.04, (i - 1.5) * 0.2));
  }

  // ---------- 15 · CTA: F mayor + sonic logo "Pri-va-si-mu" (sol-mi-re-do: C6 A5 G5 F5) ----------
  {
    const s = S('s15'), len = s.dur;
    kick(music, s.start, 0.55, 1.2);
    bass(music, s.start, len - 1.2, 41, { gain: 0.18, cutoff: 380 });
    padBar(s.start, len - 1.0, { p: [53, 57, 60, 65, 67] }, { gain: 0.085, cutoff: 2200, attack: 0.05, release: 1.2 });
    [[84, 2.5], [81, 3], [79, 3.5], [77, 4]].forEach(([m, b2], k) => {
      tone(at('s15', b2), m, k === 3 ? 0.07 : 0.055, 0, B * (k === 3 ? 3 : 1.2));
      chime(at('s15', b2), m, k === 3 ? 0.03 : 0.022, 0);
    });
    [65, 69, 72, 77, 79, 84].forEach((m, k) => keys(music, at('s15', 6) + k * B / 2, m + 12, B, { gain: 0.02 * (1 - k / 8), pan: k % 2 ? 0.45 : -0.45 }));
  }
};
