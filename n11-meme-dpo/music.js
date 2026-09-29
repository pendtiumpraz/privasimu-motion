// N11 — musik & SFX meme. Semua disintesis di sini (orisinal, bebas royalti); tidak ada sampel/lagu pihak lain.
// Bagian musik per scene (SCENES[i].mus):
//   chaos (panik kantor lalu berhenti di record scratch) · bounce (meme perbandingan) · muzak (musik lift kantor, putus di vine boom)
//   phonk (cowbell 808 gelap ala editan "sigma") · tense (jam 3 pagi) -> lega · funk (tamborzão ala funk Brasil untuk Polyester Edit)
//   chic (lo-fi elegan) · mlg (drop wobble ala montase MLG 2016) -> sonic logo "Pri-va-si-mu"
const { SCENES } = require('./scenes');
const { wordTime } = require('../lib/wordtime');
const { SFX, I: A } = require('../lib/audio');

const { SR, mtof, SVF, sine, kick, clap, hat, square, keys, bell, pluck, pad, bass } = A;
const TAU = Math.PI * 2;
let seed = 11;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const nz = () => rnd() * 2 - 1;

// SFX meme (hitmarker, rewind, clank, slidedown, auraUp/auraDown, notif, shutter) ada di lib/audio.js.

// ---------- instrumen tambahan ----------
function cowbell(bus, t0, m, g = 0.1, pan = 0) { // cowbell 808: dua kotak (rasio 1,48) lewat band-pass
  const f1 = mtof(m), f2 = f1 * 1.4823, n = Math.floor(0.5 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
  let p1 = 0, p2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p1 = (p1 + f1 / SR) % 1; p2 = (p2 + f2 / SR) % 1;
    const e = Math.min(1, t * 800) * (0.42 * Math.exp(-t * 7) + 0.58 * Math.exp(-t * 45));
    bus.add(s0 + i, f.run((p1 < 0.5 ? 1 : -1) + (p2 < 0.5 ? 1 : -1), f1 * 2.1, 1.8).bp * e * g, pan);
  }
}
function b808(bus, t0, dur, m, g = 0.3, m2 = null) { // bass 808 bersaturasi, opsional meluncur ke nada m2
  const n = Math.floor((dur + 0.05) * SR), s0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, gl = m2 == null ? 0 : Math.min(1, Math.max(0, (t - dur * 0.55) / (dur * 0.4)));
    ph += mtof(m + (m2 == null ? 0 : (m2 - m) * gl)) * (1 + 1.2 * Math.exp(-t * 40)) / SR;
    const e = Math.min(1, t * 300) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.05) : 1) * (0.55 + 0.45 * Math.exp(-t * 2.5));
    bus.add(s0 + i, Math.tanh(Math.sin(TAU * ph) * 2.2) * e * g);
  }
}
function tom(bus, t0, g = 0.4, f0 = 190, pan = 0) {
  const n = Math.floor(0.22 * SR), s0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += f0 * (0.6 + 0.4 * Math.exp(-t * 18)) / SR; bus.add(s0 + i, Math.tanh(Math.sin(TAU * ph) * 1.6) * Math.exp(-t * 14) * g, pan); }
}
function stab(bus, t0, m, g = 0.06, len = 0.16, pan = 0) { // stab synth ala "montagem"
  const n = Math.floor((len + 0.05) * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f1 = mtof(m), f2 = f1 * 1.006;
  let p1 = 0, p2 = 0.5;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p1 = (p1 + f1 / SR) % 1; p2 = (p2 + f2 / SR) % 1;
    const y = f.run((2 * p1 - 1) + (2 * p2 - 1), 900 + 4000 * Math.exp(-t * 16), 1.4).lp;
    bus.add(s0 + i, y * g * Math.min(1, t * 400) * (t > len ? Math.max(0, 1 - (t - len) / 0.05) : 1), pan);
  }
}
function wobble(bus, t0, dur, m, rateHz, g = 0.2) { // bass wobble dubstep 2016
  const n = Math.floor(dur * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f1 = mtof(m), f2 = f1 * 1.01;
  let p1 = 0, p2 = 0.3;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    p1 = (p1 + f1 / SR) % 1; p2 = (p2 + f2 / SR) % 1;
    const lfo = 0.5 - 0.5 * Math.cos(TAU * rateHz * t);
    const y = f.run((2 * p1 - 1) + (2 * p2 - 1) + Math.sin(TAU * p1) * 1.2, 120 + 2600 * lfo * lfo, 3.2).lp;
    bus.add(s0 + i, Math.tanh(y * 1.8) * g * Math.min(1, t * 200) * Math.min(1, (dur - t) * 30));
  }
}
function rim(bus, t0, g = 0.2, pan = 0.2) {
  const n = Math.floor(0.05 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
  for (let i = 0; i < n; i++) { const t = i / SR; bus.add(s0 + i, (f.run(nz(), 1700, 3).bp * 2 + Math.sin(TAU * 820 * t) * 0.5) * Math.exp(-t * 90) * g, pan); }
}
function crackle(bus, a, b, g = 0.3) { // desis & letupan piringan hitam
  const f = new SVF();
  for (let i = Math.floor(a * SR); i < Math.floor(b * SR); i++) {
    let y = f.run(nz(), 3500, 0.7).bp * 0.05;
    if (rnd() < 0.0007) y += nz() * 0.9;
    bus.add(i, y * g);
  }
}

module.exports = function compose(music, rev, tl) {
  const B = 60 / 128, S16 = B / 4, BAR = B * 4;
  const sc = (id) => tl.scenes.find((x) => x.id === id);
  const W = (id, spec, fb) => { const s = sc(id); try { return s.start + wordTime(s, spec); } catch (e) { return s.start + fb; } };
  const span = (id) => { const s = sc(id); return [s.start, s.start + s.dur]; };
  const steps = (a, b, fn) => { for (let k = 0, t = a; t < b - 0.01; k++, t = a + k * S16) fn(t, k); };

  // ---- s1 · chaos: panik 1 detik, berhenti mendadak di record scratch; lalu desis piringan + pad misterius ----
  {
    const [a, b] = span('s1'), fz = a + 0.9;
    steps(a, fz, (t, k) => {
      pluck(music, t, [84, 88, 91, 96, 91, 88, 86, 89][k % 8], { gain: 0.05, pan: k % 2 ? 0.4 : -0.4, decay: 9 });
      if (k % 4 === 0) kick(music, t, 0.7, 0.3);
      if (k % 8 === 4) clap(music, t, 0.25);
      hat(music, t, 0.035, false, k % 2 ? 0.3 : -0.3);
    });
    bass(music, a, 0.95, 36, { gain: 0.2, cutoff: 900 });
    crackle(music, fz, b, 0.4);
    pad(music, fz + 0.5, Math.max(0.5, b - fz - 1.4), [45, 52, 57, 60], { gain: 0.045, cutoff: 520, attack: 1.2, release: 0.5 });
  }

  // ---- s2 · bounce: C–G–Am–F, kick 4/4, bass memantul, pluck ceria ----
  {
    const [a, b] = span('s2');
    const PROG = [[36, [60, 64, 67]], [43, [59, 62, 67]], [45, [60, 64, 69]], [41, [60, 65, 69]]];
    const MEL = [0, -1, 2, -1, 1, -1, 2, 1, 0, -1, 2, -1, 1, 2, 1, -1];
    steps(a, b - B / 2, (t, k) => {
      const st = k % 16, [bn, ch] = PROG[Math.floor(k / 16) % 4];
      if (st % 4 === 0) kick(music, t, 0.65, 0.35);
      if (st % 8 === 4) clap(music, t, 0.3);
      if (st % 2 === 1) hat(music, t, 0.03, false, 0.3);
      if ([0, 3, 6, 8, 11, 14].includes(st)) bass(music, t, S16 * 1.6, bn + (st === 6 || st === 14 ? 12 : 0), { gain: 0.22, cutoff: 900 });
      if (MEL[st] >= 0) pluck(music, t, ch[MEL[st]] + 12, { gain: 0.04, pan: st % 2 ? 0.35 : -0.35, decay: 7 });
      if (st === 0) pad(music, t, BAR * 0.95, ch, { gain: 0.03, cutoff: 1600, attack: 0.05, release: 0.3 });
    });
  }

  // ---- s3–s4 · muzak: bossa lift kantor (Cmaj7–Am7–Dm7–G7), putus total di vine boom ----
  {
    const a = sc('s3').start, stop = W('s4', 'w:bercanda+0.42', sc('s4').start + 3);
    const CH = [[48, [64, 67, 71, 72]], [45, [64, 67, 69, 72]], [50, [65, 69, 72, 74]], [43, [65, 67, 71, 74]]];
    steps(a, stop, (t, k) => {
      const st = k % 16, [bn, ch] = CH[Math.floor(k / 16) % 4];
      if ([0, 3, 6, 10, 12].includes(st)) ch.forEach((m, j) => keys(music, t + j * 0.012, m, S16 * (st === 12 ? 3 : 2), { gain: 0.022, pan: j % 2 ? 0.25 : -0.25 }));
      if (st === 0) bass(music, t, B * 1.4, bn, { gain: 0.16, cutoff: 500 });
      if (st === 8) bass(music, t, B * 1.4, bn + 7, { gain: 0.14, cutoff: 500 });
      if ([3, 6, 10, 13].includes(st)) rim(music, t, 0.12);
      hat(music, t, st % 2 ? 0.012 : 0.02, false, 0.4);
    });
  }

  // ---- s5 · phonk: cowbell 808 (A minor), bass 808 meluncur, half-time, hat ber-roll ----
  {
    const [a, b] = span('s5');
    const MEL = [81, -1, -1, 81, -1, -1, 84, -1, 83, -1, 81, -1, 79, -1, -1, -1, 81, -1, -1, 81, -1, -1, 88, -1, 86, -1, 84, -1, 83, -1, 79, -1];
    steps(a, b - B / 2, (t, k) => {
      const st = k % 32, bar = st < 16 ? 0 : 1, s16 = st % 16;
      if (MEL[st] > 0) { cowbell(music, t, MEL[st], 0.08, st % 2 ? 0.2 : -0.2); cowbell(rev, t, MEL[st], 0.04); }
      if (bar === 0 && (s16 === 0 || s16 === 10)) kick(music, t, 0.7, 0.45);
      if (bar === 1 && (s16 === 0 || s16 === 7 || s16 === 10)) kick(music, t, 0.7, 0.45);
      if (s16 === 8) { clap(music, t, 0.4); clap(rev, t, 0.15); }
      if (s16 % 2 === 0) hat(music, t, 0.03, false, 0.25);
      if (bar === 1 && s16 >= 12) { hat(music, t + S16 / 2, 0.022, false, -0.25); }
      if (s16 === 0) b808(music, t, B * 1.4, bar ? 29 : 33, 0.24);
      if (s16 === 10) b808(music, t, B * 1.3, bar ? 31 : 33, 0.22, bar ? 33 : null);
      if (st === 0) pad(music, t, BAR * 2 * 0.95, [57, 60, 64], { gain: 0.03, cutoff: 700, attack: 0.3, release: 0.4 });
    });
  }

  // ---- s6 · tense: jam berdetak + detak jantung + drone; lega setelah "Tenang"; riser ke drop funk ----
  {
    const [a, b] = span('s6'), calm = W('s6', 'w:Tenang', 5);
    for (let t = a, k = 0; t < calm - 0.01; t += B, k++) {
      A.clock(music, t, 0.22, k % 2 === 1);
      if (k % 4 === 0) { kick(music, t, 0.45, 0.35); kick(music, t + 0.2, 0.28, 0.3); }
    }
    sine(music, a, 55, calm - a, 0.16, 0.05);
    pad(music, a, calm - a - 0.1, [45, 48, 52, 53], { gain: 0.04, cutoff: 420, attack: 0.6, release: 0.3 });
    SFX.riser(music, W('s6', 'w:Wajib', 3) - 1.0, 0.35, rev, 1.0);
    pad(music, calm, b - calm - B / 2, [53, 57, 60, 64], { gain: 0.05, cutoff: 1800, attack: 0.15, release: 0.4 });
    for (let t = calm, k = 0; t < b - B / 2 - 0.01; t += B / 2, k++) { bell(music, t, [77, 81, 84, 88][k % 4], { gain: 0.035, pan: k % 2 ? 0.3 : -0.3 }); if (k % 2 === 0) bell(rev, t, [77, 81, 84, 88][k % 4], { gain: 0.02 }); }
    SFX.riser(music, b - 1.25, 0.4, rev, 1.2);
  }

  // ---- s7 · funk: tamborzão 128 bpm, stab "montagem", 808 ----
  {
    const [a, b] = span('s7'), all = W('s7', 'w:Semua', 4);
    sine(music, a, 43.65, 1.6, 0.4, 1.4); // sub drop
    const R1 = { 0: 69, 3: 69, 6: 72, 8: 69, 10: 76, 12: 74, 14: 72 }, R2 = { 0: 69, 3: 69, 6: 72, 8: 69, 10: 67, 12: 64, 14: 67 };
    steps(a, b - 0.05, (t, k) => {
      const st = k % 16, bar = Math.floor(k / 16) % 2;
      if ([0, 3, 7, 10].includes(st)) kick(music, t, 0.75, 0.4);
      if (st === 4 || st === 12) { clap(music, t, 0.38); clap(rev, t, 0.1); }
      if (st === 6 || st === 14 || st === 15) tom(music, t, 0.28, 230, 0.3);
      if (st === 2 || st === 9) tom(music, t, 0.3, 150, -0.3);
      if (st % 2 === 0) hat(music, t, 0.035, st % 4 === 2, st % 4 ? 0.3 : -0.3);
      const m = (bar ? R2 : R1)[st];
      if (m) { stab(music, t, m, 0.04, 0.14, st % 2 ? 0.25 : -0.25); stab(music, t, m + 12, 0.016, 0.1, 0); }
      if (st === 0 || st === 10) b808(music, t, B * 1.1, st ? 28 : 33, 0.22);
    });
    SFX.impact(music, all, 0.55);
  }

  // ---- s8 · chic: lo-fi elegan (Fmaj7–Em7–Dm7–Cmaj7), half-time, desis piringan ----
  {
    const [a, b] = span('s8');
    const CH = [[41, [57, 60, 64, 65]], [40, [55, 59, 62, 64]], [38, [53, 57, 60, 62]], [36, [52, 55, 59, 60]]];
    steps(a, b - 0.05, (t, k) => {
      const st = k % 16, [bn, ch] = CH[Math.floor(k / 16) % 4];
      if (st === 0) {
        ch.forEach((m, j) => keys(music, t + j * 0.03, m, BAR * 0.9, { gain: 0.03, pan: j % 2 ? 0.3 : -0.3 }));
        bass(music, t, BAR * 0.8, bn, { gain: 0.15, cutoff: 380 });
      }
      if (st === 10) keys(music, t, ch[ch.length - 1] + 12, B, { gain: 0.02, pan: 0.2 });
      if (st === 0 || st === 10) kick(music, t, 0.4, 0.35);
      if (st === 8) clap(music, t, 0.13);
      if (st % 2 === 0) hat(music, t + (st % 4 === 2 ? S16 * 0.3 : 0), 0.014, false, 0.3);
    });
    crackle(music, a, b, 0.6);
  }

  // ---- s9 · mlg: drop wobble + kick/snare sampai logo; lalu akor cerah + sonic logo sesudah VO ----
  {
    const [a, b] = span('s9'), logo = W('s9', 'w:Privasimu', 1.1), voEnd = W('s9', 'w:com', 3.2) + 0.45;
    wobble(music, a + 0.4, logo - a - 0.45, 33, 2 / B, 0.2);
    for (let t = a + 0.4, k = 0; t < logo - 0.05; t += B / 2, k++) {
      if (k % 2 === 0) kick(music, t, 0.9, 0.35);
      if (k % 4 === 2) clap(music, t, 0.4);
      hat(music, t + B / 4, 0.03, false, 0.3);
    }
    kick(music, logo, 0.8, 1.2);
    pad(music, logo, b - logo - 0.9, [48, 60, 64, 67, 74], { gain: 0.07, cutoff: 2300, attack: 0.02, release: 1.0 });
    pad(rev, logo, b - logo - 0.9, [72, 76, 79], { gain: 0.04, cutoff: 2300, attack: 0.05, release: 1.0 });
    bass(music, logo, b - logo - 1.0, 36, { gain: 0.2, cutoff: 420 });
    // sonic logo "Pri-va-si-mu": sol-mi-re-do
    [[79, 0], [76, 0.5], [74, 1], [72, 1.5]].forEach(([m, dt], k) => {
      keys(music, voEnd + dt * B, m, B * (k === 3 ? 2 : 0.9), { gain: k === 3 ? 0.07 : 0.055 });
      bell(rev, voEnd + dt * B, m + 12, { gain: 0.03 });
    });
  }
};
