// Synth audio offline: instrumen + SFX + penempatan voice-over + ducking -> WAV stereo.
// Semua suara disintesis di sini (bebas royalti). Komposisi musik per iklan ada di <iklan>/music.js.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SR = 44100;
const TAU = Math.PI * 2;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

class Bus {
  constructor(n) { this.L = new Float32Array(n); this.R = new Float32Array(n); this.n = n; }
  add(i, v, pan = 0) {
    if (i < 0 || i >= this.n) return;
    const p = (pan + 1) * Math.PI / 4;
    this.L[i] += v * Math.cos(p); this.R[i] += v * Math.sin(p);
  }
}

// TPT state-variable filter
class SVF {
  constructor() { this.ic1 = 0; this.ic2 = 0; }
  run(x, fc, q = 0.707) {
    fc = Math.min(Math.max(fc, 20), SR * 0.45);
    const g = Math.tan(Math.PI * fc / SR), k = 1 / q;
    const a1 = 1 / (1 + g * (g + k)), a2 = g * a1, a3 = g * a2;
    const v3 = x - this.ic2, v1 = a1 * this.ic1 + a2 * v3, v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
    this.ic1 = 2 * v1 - this.ic1; this.ic2 = 2 * v2 - this.ic2;
    return { lp: v2, bp: v1, hp: x - k * v1 - v2 };
  }
}

function env(t, a, d, s, r, len) {
  if (t < 0) return 0;
  let v;
  if (t < a) v = t / a;
  else if (t < a + d) v = 1 - (1 - s) * (t - a) / d;
  else v = s;
  if (t > len) { const rr = (t - len) / r; v = rr >= 1 ? 0 : v * (1 - rr); }
  return v;
}

const rng = mulberry32(20260929);
const noise = () => rng() * 2 - 1;

// ---------- Instrumen ----------
function pad(bus, t0, dur, notes, { gain = 0.08, cutoff = 1400, attack = 0.5, release = 1.2 } = {}) {
  const n = Math.floor((dur + release) * SR), s0 = Math.floor(t0 * SR);
  notes.forEach((m, ni) => {
    [-7, 0, 7].forEach((cents, di) => {
      const f = mtof(m) * Math.pow(2, cents / 1200);
      let ph = rng();
      const flt = new SVF(), pan = (di - 1) * 0.6;
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        ph += f / SR; if (ph >= 1) ph -= 1;
        const y = flt.run(2 * ph - 1, cutoff * (1 + 0.15 * Math.sin(TAU * 0.3 * t + ni))).lp;
        bus.add(s0 + i, y * gain * env(t, attack, 0.3, 0.85, release, dur) / notes.length * 2.2, pan);
      }
    });
  });
}

function bass(bus, t0, dur, m, { gain = 0.28, cutoff = 700 } = {}) {
  const f = mtof(m), n = Math.floor((dur + 0.08) * SR), s0 = Math.floor(t0 * SR);
  let ph = 0; const flt = new SVF();
  for (let i = 0; i < n; i++) {
    const t = i / SR; ph += f / SR; if (ph >= 1) ph -= 1;
    const x = (2 * ph - 1) * 0.6 + Math.sin(TAU * ph) * 0.8;
    const y = flt.run(x, 120 + cutoff * Math.exp(-t * 14), 1.1).lp;
    bus.add(s0 + i, y * gain * env(t, 0.004, 0.1, 0.7, 0.06, dur));
  }
}

function pluck(bus, t0, m, { gain = 0.07, pan = 0, decay = 5, bright = 3500 } = {}) {
  const f = mtof(m), n = Math.floor(0.6 * SR), s0 = Math.floor(t0 * SR);
  let ph = 0, ph2 = 0.3; const flt = new SVF();
  for (let i = 0; i < n; i++) {
    const t = i / SR; ph += f / SR; ph2 += f * 1.004 / SR; ph %= 1; ph2 %= 1;
    const y = flt.run((2 * ph - 1) + (2 * ph2 - 1), 300 + bright * Math.exp(-t * 18), 1.3).lp;
    bus.add(s0 + i, y * gain * Math.exp(-t * decay) * Math.min(1, t * 400), pan);
  }
}

function kick(bus, t0, gain = 0.9, len = 0.4) {
  const n = Math.floor(len * SR), s0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, f = 45 + 110 * Math.exp(-t * 32);
    ph += f / SR;
    const y = Math.sin(TAU * ph) * Math.exp(-t * (4.5 / len)) + (t < 0.004 ? noise() * 0.3 : 0);
    bus.add(s0 + i, Math.tanh(y * 1.6) * gain);
  }
}

function clap(bus, t0, gain = 0.35) {
  const n = Math.floor(0.25 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let e = Math.exp(-t * 22);
    if (t < 0.03) e = Math.exp(-((t % 0.01)) * 300);
    bus.add(s0 + i, flt.run(noise(), 1300, 1.2).bp * e * gain * 2.2, 0.1);
  }
}

function hat(bus, t0, gain = 0.07, open = false, pan = 0.25) {
  const len = open ? 0.18 : 0.045, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    bus.add(s0 + i, flt.run(noise(), 8000).hp * Math.exp(-t * (open ? 16 : 90)) * gain, pan);
  }
}

function sine(bus, t0, f, len, gain, decay, pan = 0) {
  const n = Math.floor(len * SR), s0 = Math.floor(t0 * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    bus.add(s0 + i, Math.sin(TAU * f * t) * gain * Math.exp(-t * decay) * Math.min(1, t * 300), pan);
  }
}

// Piano elektrik (FM): nada hangat untuk gaya elegan/tenang
function keys(bus, t0, m, dur = 1.2, { gain = 0.06, pan = 0 } = {}) {
  const f = mtof(m), n = Math.floor((dur + 0.6) * SR), s0 = Math.floor(t0 * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR, idx = 1.8 * Math.exp(-t * 6);
    const y = Math.sin(TAU * f * t + idx * Math.sin(TAU * f * t)) * 0.8 + Math.sin(TAU * f * 2 * t) * 0.12 * Math.exp(-t * 4);
    bus.add(s0 + i, y * gain * Math.exp(-t * 1.6) * Math.min(1, t * 200) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.6) : 1), pan);
  }
}
// Lonceng / glockenspiel: parsial inharmonis
function bell(bus, t0, m, { gain = 0.05, pan = 0, decay = 2.2 } = {}) {
  const f = mtof(m), n = Math.floor(2.5 * SR), s0 = Math.floor(t0 * SR);
  const parts = [[1, 1, 1], [2.0, 0.45, 1.6], [3.01, 0.25, 2.4], [4.2, 0.12, 3.2], [5.43, 0.08, 4]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let y = 0;
    for (const [h, a, dm] of parts) y += Math.sin(TAU * f * h * t) * a * Math.exp(-t * decay * dm);
    bus.add(s0 + i, y * gain * Math.min(1, t * 800), pan);
  }
}
// Gelombang kotak (chiptune)
function square(bus, t0, m, dur, { gain = 0.05, pan = 0, duty = 0.5, slide = 0 } = {}) {
  const n = Math.floor(dur * SR), s0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR, f = mtof(m + slide * (t / dur));
    ph = (ph + f / SR) % 1;
    const e = Math.min(1, t * 400) * (t > dur - 0.02 ? Math.max(0, (dur - t) / 0.02) : 1);
    bus.add(s0 + i, (ph < duty ? 1 : -1) * gain * e, pan);
  }
}
// Gelombang segitiga (bass chiptune)
function tri(bus, t0, m, dur, { gain = 0.12 } = {}) {
  const f = mtof(m), n = Math.floor(dur * SR), s0 = Math.floor(t0 * SR);
  for (let i = 0; i < n; i++) {
    const t = i / SR, ph = (f * t) % 1;
    const e = Math.min(1, t * 400) * (t > dur - 0.02 ? Math.max(0, (dur - t) / 0.02) : 1);
    bus.add(s0 + i, (4 * Math.abs(ph - 0.5) - 1) * gain * e);
  }
}

// Detak jam (tick/tock bergantian) — kayu kecil + resonansi logam
function clock(bus, t0, gain = 0.3, tock = false) {
  const n = Math.floor(0.09 * SR), s0 = Math.floor(t0 * SR), flt = new SVF(), f = tock ? 1700 : 2400;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const y = flt.run(noise(), f, 6).bp * Math.exp(-t * 120) * 3 + Math.sin(TAU * f * 1.5 * t) * Math.exp(-t * 90) * 0.35;
    bus.add(s0 + i, y * gain, tock ? -0.15 : 0.15);
  }
}

// ---------- SFX ----------
const SFX = {
  whoosh(bus, t0, g) {
    const len = 0.6, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) {
      const p = i / n, a = Math.sin(Math.PI * p) ** 2;
      bus.add(s0 + i, flt.run(noise(), 300 + 3500 * Math.sin(Math.PI * p), 1.5).bp * a * g * 0.9, -0.8 + 1.6 * p);
    }
  },
  suck(bus, t0, g) {
    const len = 0.38, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) {
      const p = i / n;
      bus.add(s0 + i, flt.run(noise(), 5000 * (1 - p) + 200, 2).bp * p ** 3 * g * 1.4);
    }
  },
  riser(bus, t0, g, rev, len = 1.1) {
    const n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const p = i / n, f = 200 * Math.pow(6, p);
      ph += f / SR;
      const y = flt.run(noise(), 500 + 7000 * p, 2).bp * 0.6 + Math.sin(TAU * ph) * 0.25;
      bus.add(s0 + i, y * p ** 2 * g, Math.sin(p * 20) * 0.3);
    }
  },
  riserLong(bus, t0, g, rev) { SFX.riser(bus, t0, g, rev, 2.0); },
  sweep(bus, t0, g) {
    const len = 0.9, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) {
      const p = i / n;
      bus.add(s0 + i, flt.run(noise(), 1500 + 9000 * p, 3).bp * Math.sin(Math.PI * p) * g * 0.5, 0.6 - 1.2 * p);
    }
  },
  impact(bus, t0, g) {
    kick(bus, t0, 0.9 * g, 1.1);
    const n = Math.floor(0.5 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, flt.run(noise(), 900).lp * Math.exp(-i / SR * 9) * g * 0.8);
  },
  boom(bus, t0, g) {
    kick(bus, t0, g, 2.2);
    sine(bus, t0, 38, 2.5, 0.5 * g, 1.6);
    const n = Math.floor(1.5 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, flt.run(noise(), 1800 * Math.exp(-i / SR * 3) + 100).lp * Math.exp(-i / SR * 3) * g * 0.6);
  },
  stamp(bus, t0, g) {
    kick(bus, t0, 0.8 * g, 0.5);
    const n = Math.floor(0.12 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, flt.run(noise(), 750, 2.5).bp * Math.exp(-i / SR * 45) * g * 2.5);
  },
  hit(bus, t0, g) {
    let ph = 0; const n = Math.floor(0.5 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR; ph += (70 + 90 * Math.exp(-t * 25)) / SR;
      const y = Math.sin(TAU * ph) * Math.exp(-t * 8) + flt.run(noise(), 2500, 0.8).bp * Math.exp(-t * 40) * 1.2;
      bus.add(s0 + i, Math.tanh(y * 1.5) * g * 0.8);
    }
  },
  glitch(bus, t0, g) {
    const r = mulberry32(Math.floor(t0 * 1000));
    let t = 0;
    while (t < 0.4) {
      const chunk = 0.012 + r() * 0.03, f = 150 + r() * 2200, s0 = Math.floor((t0 + t) * SR), n = Math.floor(chunk * SR);
      const kind = r(), pan = r() * 1.4 - 0.7;
      if (r() > 0.25) for (let i = 0; i < n; i++) {
        const sq = Math.sign(Math.sin(TAU * f * i / SR));
        const v = kind < 0.5 ? sq : Math.round(noise() * 4) / 4;
        bus.add(s0 + i, v * g * 0.18, pan);
      }
      t += chunk;
    }
  },
  pop(bus, t0, g) {
    let ph = 0; const n = Math.floor(0.08 * SR), s0 = Math.floor(t0 * SR);
    for (let i = 0; i < n; i++) { const t = i / SR; ph += (500 + 700 * (t / 0.08)) / SR; bus.add(s0 + i, Math.sin(TAU * ph) * Math.exp(-t * 45) * g * 0.5); }
  },
  tick(bus, t0, g) { sine(bus, t0, 1900 + rng() * 300, 0.05, g * 0.35, 90, rng() - 0.5); },
  key(bus, t0, g) {
    const n = Math.floor(0.03 * SR), s0 = Math.floor(t0 * SR), flt = new SVF(), f = 2500 + rng() * 2000;
    for (let i = 0; i < n; i++) bus.add(s0 + i, flt.run(noise(), f, 2).bp * Math.exp(-i / SR * 180) * g * 1.8, rng() * 0.4 - 0.2);
  },
  ding(bus, t0, g, rev) {
    [[1046.5, 0], [1568, 0.09]].forEach(([f, dt]) => {
      [[1, 1], [2.76, 0.35], [5.4, 0.12]].forEach(([h, a]) => {
        sine(bus, t0 + dt, f * h, 1.6, g * 0.18 * a, 3 + h);
        sine(rev, t0 + dt, f * h, 1.6, g * 0.12 * a, 3 + h);
      });
    });
  },
  shimmer(bus, t0, g, rev) {
    [72, 76, 79, 84, 88, 91, 96].forEach((m, k) => {
      sine(bus, t0 + k * 0.06, mtof(m), 2.5, g * 0.07, 2, (k % 2 ? 0.5 : -0.5));
      sine(rev, t0 + k * 0.06, mtof(m), 2.5, g * 0.1, 1.5);
    });
  },
  // --- tambahan untuk iklan countdown ---
  clock(bus, t0, g) { clock(bus, t0, g, false); },
  tock(bus, t0, g) { clock(bus, t0, g, true); },
  flip(bus, t0, g) { // split-flap clack
    const n = Math.floor(0.05 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) { const t = i / SR; bus.add(s0 + i, (flt.run(noise(), 3200, 1.8).bp * 2.2 + (t < 0.002 ? 0.6 : 0)) * Math.exp(-t * 140) * g, rng() * 0.3 - 0.15); }
  },
  paper(bus, t0, g) { // kertas digeser
    const len = 0.35, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) { const p = i / n; bus.add(s0 + i, flt.run(noise(), 2500 + 3000 * p, 0.9).bp * Math.sin(Math.PI * p) ** 1.5 * (0.6 + 0.4 * Math.sin(p * 90)) * g * 0.9, -0.3 + 0.6 * p); }
  },
  slam(bus, t0, g) { // baris checklist masuk
    kick(bus, t0, 0.45 * g, 0.3);
    const n = Math.floor(0.06 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, flt.run(noise(), 1800, 1.5).bp * Math.exp(-i / SR * 70) * g * 1.4);
  },
  check(bus, t0, g, rev) { // centang positif (naik kuint)
    [[76, 0], [83, 0.07]].forEach(([m, dt]) => { sine(bus, t0 + dt, mtof(m), 0.5, g * 0.22, 9); sine(rev, t0 + dt, mtof(m), 0.5, g * 0.1, 7); });
  },
  heart(bus, t0, g) { kick(bus, t0, 0.7 * g, 0.35); kick(bus, t0 + 0.2, 0.4 * g, 0.3); },
  // --- SFX bergaya meme (disintesis sendiri, bebas hak cipta) ---
  vineboom(bus, t0, g, rev) { // "bwoom" dalam dengan pitch turun
    const n = Math.floor(1.4 * SR), s0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, f = 48 + 95 * Math.exp(-t * 9);
      ph += f / SR;
      const y = Math.tanh((Math.sin(TAU * ph) + 0.35 * Math.sin(TAU * ph * 2)) * 2.4) * Math.exp(-t * 2.4) + (t < 0.01 ? noise() * 0.5 : 0);
      bus.add(s0 + i, y * g * 0.9);
      rev.add(s0 + i, y * g * 0.15);
    }
  },
  scratch(bus, t0, g) { // gesekan piringan hitam (dua gesekan)
    const len = 0.5, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR, stroke = t < 0.22 ? t / 0.22 : 1 - (t - 0.22) / 0.28;
      const fc = 500 + 2600 * Math.abs(Math.sin(Math.PI * stroke * 1.5));
      const y = flt.run(noise(), fc, 4).bp * 2.2 + Math.sin(TAU * fc * 0.25 * t) * 0.2;
      bus.add(s0 + i, y * g * 0.6 * Math.sin(Math.PI * Math.min(1, t / len)), Math.sin(t * 30) * 0.3);
    }
  },
  sadtrombone(bus, t0, g) { // "wah wah wah waaah"
    [[58, 0, 0.36], [57, 0.4, 0.36], [56, 0.8, 0.36], [55, 1.2, 1.3]].forEach(([m, dt, len], k) => {
      const n = Math.floor(len * SR), s0 = Math.floor((t0 + dt) * SR), flt = new SVF();
      let ph = 0;
      for (let i = 0; i < n; i++) {
        const t = i / SR, vib = k === 3 ? Math.sin(TAU * 5.5 * t) * 0.35 * Math.min(1, t / 0.3) : 0;
        ph = (ph + mtof(m + vib) / SR) % 1;
        const wah = 350 + 1300 * Math.sin(Math.PI * Math.min(1, t / (k === 3 ? 0.5 : len)));
        const y = flt.run(2 * ph - 1, wah, 2.2).lp;
        bus.add(s0 + i, y * g * 0.35 * Math.min(1, t * 60) * Math.min(1, (len - t) * 12));
      }
    });
  },
  dundun(bus, t0, g, rev) { // "dun dun dunnn" dramatis
    [[[50, 53, 57], 0, 0.28], [[49, 52, 56], 0.34, 0.28], [[48, 51, 55], 0.7, 1.6]].forEach(([ch, dt, len]) => {
      kick(bus, t0 + dt, 0.55 * g, len > 1 ? 1.2 : 0.4);
      ch.forEach((m) => [0, 12].forEach((o) => {
        const n = Math.floor((len + 0.3) * SR), s0 = Math.floor((t0 + dt) * SR), flt = new SVF();
        let ph = rng();
        for (let i = 0; i < n; i++) {
          const t = i / SR; ph = (ph + mtof(m + o) / SR) % 1;
          const y = flt.run(2 * ph - 1, 900 + 1500 * Math.exp(-t * 3), 1).lp * Math.min(1, t * 80) * (t > len ? Math.max(0, 1 - (t - len) / 0.3) : 1);
          bus.add(s0 + i, y * g * 0.07, o ? 0.3 : -0.3);
          rev.add(s0 + i, y * g * 0.03);
        }
      }));
    });
  },
  rimshot(bus, t0, g) { // "ba dum tss"
    [[0, 180, 0.25], [0.16, 120, 0.35]].forEach(([dt, f0, len]) => {
      const n = Math.floor(len * SR), s0 = Math.floor((t0 + dt) * SR);
      let ph = 0;
      for (let i = 0; i < n; i++) { const t = i / SR; ph += (f0 * (1 + Math.exp(-t * 30))) / SR; bus.add(s0 + i, Math.sin(TAU * ph) * Math.exp(-t * 11) * g * 0.6); }
    });
    const n = Math.floor(1.2 * SR), s0 = Math.floor((t0 + 0.34) * SR), flt = new SVF();
    for (let i = 0; i < n; i++) { const t = i / SR; bus.add(s0 + i, flt.run(noise(), 7000, 0.7).hp * Math.exp(-t * 3.5) * g * 0.35, 0.3); }
  },
  buzzer(bus, t0, g) { // jawaban salah
    const n = Math.floor(0.6 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR, sq = (Math.sin(TAU * 110 * t) > 0 ? 1 : -1) + (Math.sin(TAU * 117 * t) > 0 ? 1 : -1);
      bus.add(s0 + i, flt.run(sq, 1800).lp * g * 0.16 * Math.min(1, t * 200) * Math.min(1, (0.6 - t) * 20));
    }
  },
  correct(bus, t0, g, rev) { bell(bus, t0, 88, { gain: 0.09 * g }); bell(bus, t0 + 0.11, 93, { gain: 0.09 * g }); bell(rev, t0 + 0.11, 93, { gain: 0.04 * g }); },
  boing(bus, t0, g) {
    const n = Math.floor(0.7 * SR), s0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let i = 0; i < n; i++) { const t = i / SR, f = 180 + 260 * t + 70 * Math.sin(TAU * 11 * t) * Math.exp(-t * 3); ph += f / SR; bus.add(s0 + i, Math.sin(TAU * ph) * Math.exp(-t * 3.5) * g * 0.45); }
  },
  slidewhistle(bus, t0, g) {
    const n = Math.floor(0.6 * SR), s0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let i = 0; i < n; i++) { const t = i / SR, f = 600 + 1300 * (t / 0.6) ** 1.4 + Math.sin(TAU * 7 * t) * 25; ph += f / SR; bus.add(s0 + i, Math.sin(TAU * ph) * g * 0.22 * Math.min(1, t * 30) * Math.min(1, (0.6 - t) * 15)); }
  },
  crickets(bus, t0, g) { // jangkrik: canggung / hening
    for (let c = 0; c < 5; c++) {
      const st = t0 + c * 0.34 + rng() * 0.05, n = Math.floor(0.14 * SR), s0 = Math.floor(st * SR);
      for (let i = 0; i < n; i++) { const t = i / SR; bus.add(s0 + i, Math.sin(TAU * 4400 * t) * (0.5 + 0.5 * Math.sin(TAU * 32 * t)) * Math.sin(Math.PI * t / 0.14) * g * 0.07, 0.5); }
    }
  },
  airhorn(bus, t0, g) {
    [[0, 0.22], [0.28, 0.22], [0.56, 0.6]].forEach(([dt, len]) => [69, 73, 76].forEach((m) => {
      const n = Math.floor(len * SR), s0 = Math.floor((t0 + dt) * SR), flt = new SVF();
      let ph = rng();
      for (let i = 0; i < n; i++) { const t = i / SR; ph = (ph + mtof(m - 0.3 * Math.exp(-t * 20)) / SR) % 1; bus.add(s0 + i, flt.run(2 * ph - 1, 2600, 1.4).lp * g * 0.06 * Math.min(1, t * 150) * Math.min(1, (len - t) * 40)); }
    }));
  },
  coin(bus, t0, g) { square(bus, t0, 83, 0.07, { gain: 0.06 * g, duty: 0.5 }); square(bus, t0 + 0.07, 88, 0.3, { gain: 0.06 * g, duty: 0.5 }); },
  levelup(bus, t0, g) { [72, 76, 79, 84, 88, 91].forEach((m, k) => square(bus, t0 + k * 0.07, m, 0.09, { gain: 0.05 * g, duty: 0.25 })); square(bus, t0 + 0.45, 96, 0.5, { gain: 0.05 * g, duty: 0.5 }); },
  blip(bus, t0, g) { square(bus, t0, 79, 0.05, { gain: 0.05 * g, duty: 0.25 }); },
  tada(bus, t0, g, rev) {
    [60, 64, 67, 72].forEach((m) => { keys(bus, t0, m, 1.2, { gain: 0.05 * g }); keys(rev, t0, m + 12, 1.2, { gain: 0.02 * g }); });
    const n = Math.floor(1.5 * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, flt.run(noise(), 6000).hp * Math.exp(-i / SR * 2.5) * g * 0.2, 0.2);
  },
  alarm(bus, t0, g) { // dengung peringatan pendek
    const len = 0.5, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), flt = new SVF();
    let ph = 0;
    for (let i = 0; i < n; i++) { const t = i / SR; ph += 440 / SR; bus.add(s0 + i, flt.run((2 * (ph % 1) - 1), 1400).lp * Math.exp(-t * 5) * g * 0.35); }
  },
  // --- SFX meme tambahan (orisinal, pengganti suara meme berhak cipta; lihat rancangan/Bank Sound Meme) ---
  hitmarker(bus, t0, g) { // "tk" hitmarker montase ala MLG
    [[0, 3200], [0.016, 2600]].forEach(([dt, f]) => sine(bus, t0 + dt, f, 0.05, g * 0.5, 75));
    const n = Math.floor(0.012 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, f.run(noise(), 6000).hp * (1 - i / n) * g * 0.6);
  },
  rewind(bus, t0, g) { // pita VHS di-rewind: cicit naik makin cepat + desis, ditutup "klunk"
    const len = 0.72, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f2 = new SVF();
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, p = t / len, rate = 7 + 26 * p * p, cp = (t * rate) % 1;
      ph += (700 + 2600 * cp * (0.6 + 0.4 * p)) / SR;
      const y = Math.sin(TAU * ph) * 0.35 + f.run(noise(), 1500 + 3000 * cp, 2).bp * 0.6 + f2.run(noise(), 7000).hp * 0.15;
      bus.add(s0 + i, y * Math.min(1, t / 0.05) * (p > 0.9 ? (1 - p) / 0.1 : 1) * g * 0.5, Math.sin(t * 9) * 0.4);
    }
    kick(bus, t0 + len - 0.02, 0.35 * g, 0.18);
  },
  clank(bus, t0, g, rev) { // borgol/logam: parsial inharmonis + dua pantulan
    const parts = [[540, 1, 7], [1253, 0.7, 10], [2087, 0.5, 13], [3170, 0.35, 17], [4410, 0.25, 22], [5870, 0.15, 28]];
    [[0, 1], [0.085, 0.45], [0.16, 0.2]].forEach(([dt, a]) => {
      const n = Math.floor(0.9 * SR), s0 = Math.floor((t0 + dt) * SR);
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        let y = t < 0.004 ? noise() * 0.8 : 0;
        for (const [f, amp, d] of parts) y += Math.sin(TAU * f * (1 + dt * 0.02) * t) * amp * Math.exp(-t * d);
        bus.add(s0 + i, y * g * a * 0.16, 0.1);
        if (rev) rev.add(s0 + i, y * g * a * 0.04);
      }
    });
  },
  slidedown(bus, t0, g) { // peluit geser turun
    const len = 0.6, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, p = t / len;
      ph += (1900 * Math.pow(0.28, p ** 0.8) + Math.sin(TAU * 6.5 * t) * 22) / SR;
      bus.add(s0 + i, Math.sin(TAU * ph) * g * 0.22 * Math.min(1, t * 40) * Math.min(1, (len - t) * 14));
    }
  },
  auraUp(bus, t0, g, rev) { // "+aura": arpeggio chip + kilau
    [84, 88, 91, 96].forEach((m, k) => square(bus, t0 + k * 0.045, m, 0.08, { gain: 0.04 * g, duty: 0.25 }));
    [96, 100, 103].forEach((m, k) => { sine(bus, t0 + 0.18 + k * 0.03, mtof(m), 0.8, 0.05 * g, 5); if (rev) sine(rev, t0 + 0.18 + k * 0.03, mtof(m), 0.8, 0.05 * g, 4); });
  },
  auraDown(bus, t0, g) { // "−aura": "bwomp" saw menurun lewat filter wah
    const len = 0.5, n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), f = new SVF();
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR, p = t / len;
      ph = (ph + 330 * Math.pow(0.35, p) / SR) % 1;
      const y = f.run(2 * ph - 1, 300 + 1500 * Math.sin(Math.PI * Math.min(1, p * 1.4)), 3).lp;
      bus.add(s0 + i, y * g * 0.35 * Math.min(1, t * 80) * Math.min(1, (len - t) * 10));
    }
  },
  notif(bus, t0, g, rev) { // getar HP dua kali + denting notifikasi
    [[0, 0.16], [0.24, 0.16]].forEach(([dt, len]) => {
      const n = Math.floor(len * SR), s0 = Math.floor((t0 + dt) * SR), f = new SVF();
      for (let i = 0; i < n; i++) {
        const t = i / SR, am = 0.55 + 0.45 * Math.sin(TAU * 34 * t);
        bus.add(s0 + i, f.run(Math.sign(Math.sin(TAU * 150 * t)), 420, 1.2).lp * am * g * 0.3 * Math.min(1, t * 200) * Math.min(1, (len - t) * 60));
      }
    });
    [[1318.5, 0.46], [1975.5, 0.53]].forEach(([fr, dt]) => { sine(bus, t0 + dt, fr, 0.9, 0.09 * g, 5); if (rev) sine(rev, t0 + dt, fr, 0.9, 0.05 * g, 4); });
  },
  shutter(bus, t0, g) { // rana kamera
    [[0, 3400, 1], [0.07, 2200, 0.7]].forEach(([dt, fc, a]) => {
      const n = Math.floor(0.04 * SR), s0 = Math.floor((t0 + dt) * SR), f = new SVF();
      for (let i = 0; i < n; i++) bus.add(s0 + i, f.run(noise(), fc, 1.6).bp * Math.exp(-i / SR * 110) * g * a * 1.6);
    });
  },
  sadviolin(bus, t0, g, rev) { // melodi sedih orisinal (turun minor) dengan synth gesek + vibrato
    [[67, 0, 0.42], [65, 0.45, 0.42], [63, 0.9, 0.42], [62, 1.35, 1.25]].forEach(([m, dt, len]) => {
      const n = Math.floor((len + 0.25) * SR), s0 = Math.floor((t0 + dt) * SR), f1 = new SVF(), f2 = new SVF();
      let p1 = rng(), p2 = rng();
      for (let i = 0; i < n; i++) {
        const t = i / SR, fr = mtof(m + Math.sin(TAU * 5.6 * t) * 0.18 * Math.min(1, t / 0.25));
        p1 = (p1 + fr / SR) % 1; p2 = (p2 + fr * 1.003 / SR) % 1;
        const lp = f1.run((2 * p1 - 1) + (2 * p2 - 1) * 0.7, 2400, 0.7).lp, y = lp * 0.35 + f2.run(lp, 1100, 1.2).bp * 1.2;
        const e = Math.min(1, t / 0.12) * (t > len ? Math.max(0, 1 - (t - len) / 0.25) : 1);
        bus.add(s0 + i, y * e * g * 0.12, -0.1);
        if (rev) rev.add(s0 + i, y * e * g * 0.05);
      }
    });
  },
  reveal(bus, t0, g, rev) { // sting "pengungkapan" orisinal: dentum + akor mengembang + kilau
    kick(bus, t0, 0.9 * g, 1.4);
    sine(bus, t0, 41, 2.2, 0.45 * g, 1.3);
    [57, 64, 67, 71, 74].forEach((m, k) => {
      const n = Math.floor(2.0 * SR), s0 = Math.floor((t0 + 0.05) * SR), f = new SVF();
      let p = rng();
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        p = (p + mtof(m) / SR) % 1;
        const e = Math.min(1, t / 0.5) * Math.exp(-Math.max(0, t - 0.6) * 2.2);
        const y = f.run(2 * p - 1, 400 + 2600 * Math.min(1, t / 0.6), 1).lp;
        bus.add(s0 + i, y * e * g * 0.05, (k - 2) * 0.25);
        if (rev) rev.add(s0 + i, y * e * g * 0.03);
      }
    });
    bell(bus, t0 + 0.55, 86, { gain: 0.06 * g });
  },
  error(bus, t0, g) { // bunyi galat UI generik: dua nada turun
    [[76, 0, 0.14], [71, 0.16, 0.22]].forEach(([m, dt, len]) => square(bus, t0 + dt, m, len, { gain: 0.07 * g, duty: 0.35 }));
  },
  shock(bus, t0, g, rev) { // hentakan orkestra (kaget)
    kick(bus, t0, 0.8 * g, 0.9);
    [36, 48, 51, 55, 60, 63, 67].forEach((m, k) => {
      const n = Math.floor(1.1 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
      let p = rng(), p2 = rng();
      for (let i = 0; i < n; i++) {
        const t = i / SR;
        p = (p + mtof(m) / SR) % 1; p2 = (p2 + mtof(m) * 1.006 / SR) % 1;
        const y = f.run((2 * p - 1) + (2 * p2 - 1), 1200 + 5000 * Math.exp(-t * 8), 0.9).lp * Math.exp(-t * 4.5) * Math.min(1, t * 900);
        bus.add(s0 + i, y * g * 0.04, k % 2 ? 0.3 : -0.3);
        if (rev) rev.add(s0 + i, y * g * 0.03);
      }
    });
    const n = Math.floor(0.3 * SR), s0 = Math.floor(t0 * SR), f = new SVF();
    for (let i = 0; i < n; i++) bus.add(s0 + i, f.run(noise(), 3000, 0.8).bp * Math.exp(-i / SR * 18) * g * 0.5);
  },
  gameover(bus, t0, g) { // "kalah" 8-bit
    [[72, 0], [67, 0.13], [64, 0.26], [60, 0.39]].forEach(([m, dt]) => square(bus, t0 + dt, m, 0.12, { gain: 0.06 * g, duty: 0.5 }));
    square(bus, t0 + 0.54, 48, 0.5, { gain: 0.05 * g, duty: 0.5, slide: -5 });
  },
  outro(bus, t0, g) { // jingle penutup kocak orisinal (pizzicato + bass)
    const B = 0.2;
    [[72, 0], [76, 1], [79, 2], [84, 3], [79, 4.5], [84, 5.5]].forEach(([m, k]) => pluck(bus, t0 + k * B, m, { gain: 0.08 * g, decay: 9, pan: k % 2 ? 0.3 : -0.3 }));
    [[36, 0], [43, 2], [36, 4], [48, 5.5]].forEach(([m, k]) => bass(bus, t0 + k * B, B * 1.6, m, { gain: 0.25 * g, cutoff: 600 }));
    [0, 2, 4].forEach((k) => hat(bus, t0 + k * B + B, 0.05 * g, false, 0.2));
    kick(bus, t0 + 5.5 * B, 0.5 * g, 0.4);
  },
  eurobeat(bus, t0, g) { // sting eurobeat orisinal 150 bpm (arpeggio + kick + bass off-beat)
    const S = 60 / 150 / 4, ARP = [69, 72, 76, 72, 69, 72, 76, 79, 81, 79, 76, 72, 69, 72, 76, 81];
    for (let k = 0; k < 16; k++) {
      const t = t0 + k * S;
      if (k % 4 === 0) kick(bus, t, 0.7 * g, 0.25);
      if (k % 4 === 2) { bass(bus, t, S * 1.6, 45, { gain: 0.22 * g, cutoff: 900 }); hat(bus, t, 0.05 * g, true, 0.2); }
      square(bus, t, ARP[k], S * 0.9, { gain: 0.035 * g, duty: 0.25, pan: k % 2 ? 0.3 : -0.3 });
    }
  },
};

// Reverb Schroeder sederhana (stereo)
function reverb(src, out, wet = 0.35) {
  const combs = [1557, 1617, 1491, 1422, 1277, 1356], aps = [225, 556];
  ['L', 'R'].forEach((ch, ci) => {
    const x = src[ch], y = new Float32Array(src.n);
    combs.forEach((d0) => {
      const d = d0 + ci * 23, buf = new Float32Array(d); let idx = 0, lp = 0;
      for (let i = 0; i < src.n; i++) {
        const o = buf[idx]; lp = o * 0.7 + lp * 0.3;
        buf[idx] = x[i] + lp * 0.84; idx = (idx + 1) % d; y[i] += o / combs.length;
      }
    });
    aps.forEach((d) => {
      const buf = new Float32Array(d); let idx = 0;
      for (let i = 0; i < src.n; i++) { const b = buf[idx], v = y[i] + b * -0.5; buf[idx] = y[i] + b * 0.5; y[i] = v; idx = (idx + 1) % d; }
    });
    for (let i = 0; i < src.n; i++) out[ch][i] += y[i] * wet;
  });
}

function customSfx(name) {
  const dir = path.join(__dirname, '..', 'sfx-kustom');
  const f = fs.existsSync(dir) && fs.readdirSync(dir).find((x) => path.parse(x).name.toLowerCase() === name.toLowerCase());
  if (!f) throw new Error(`SFX kustom "${name}" tidak ada di motion/sfx-kustom/`);
  return path.join(dir, f);
}

function decodeMono(file) {
  const buf = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'f32le', '-ac', '1', '-ar', String(SR), 'pipe:1'], { maxBuffer: 1 << 30 });
  return new Float32Array(buf.buffer, buf.byteOffset, buf.length / 4);
}

function writeWav(file, L, R) {
  const n = L.length, data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}

const I = { SR, mtof, pad, bass, pluck, kick, clap, hat, sine, clock, keys, bell, square, tri, rng, noise, SVF, env };

// compose(music, rev, tl, I): komposisi musik khas iklan
function build(tl, outDir, compose, { duckTo = 0.42, musicGain = 0.85, voGain = 1.05, sfxGain = 0.8 } = {}) {
  const n = Math.ceil((tl.total + 0.2) * SR);
  const music = new Bus(n), rev = new Bus(n), sfx = new Bus(n), vo = new Float32Array(n);
  console.log('[audio] musik...');
  compose(music, rev, tl, I);
  console.log('[audio] sfx...');
  for (const c of tl.cues) {
    if (c.name.startsWith('file:')) { // SFX milik sendiri / berlisensi di motion/sfx-kustom/
      const f = customSfx(c.name.slice(5));
      const d = decodeMono(f), s0 = Math.floor(c.t * SR);
      for (let i = 0; i < d.length; i++) sfx.add(s0 + i, d[i] * c.gain);
      continue;
    }
    if (!SFX[c.name]) throw new Error('SFX tidak dikenal: ' + c.name);
    SFX[c.name](sfx, c.t, c.gain, rev);
  }
  reverb(rev, music, 0.9);
  console.log('[audio] voice-over...');
  let voSamples = 0;
  for (const s of tl.scenes) {
    if (!s.voFile) continue; // scene tanpa VO
    const d = decodeMono(s.voFile), s0 = Math.floor(s.voStart * SR);
    voSamples += d.length;
    for (let i = 0; i < d.length && s0 + i < n; i++) vo[s0 + i] += d[i];
  }
  if (voSamples < SR && tl.scenes.some((s) => s.voFile)) throw new Error('Voice-over kosong — cek file TTS di folder vo/');
  // Ducking musik saat VO
  const target = new Float32Array(n).fill(1);
  for (const s of tl.scenes) {
    if (!s.voFile) continue;
    const a = Math.floor((s.voStart - 0.05) * SR), b = Math.floor((s.voStart + s.voDur) * SR);
    for (let i = Math.max(0, a); i < Math.min(n, b); i++) target[i] = duckTo;
  }
  const duck = new Float32Array(n);
  let g = 1;
  for (let i = 0; i < n; i++) {
    const coef = target[i] < g ? 1 / (0.12 * SR) : 1 / (0.45 * SR);
    g += (target[i] - g) * coef * 5; duck[i] = g;
  }
  const fadeOut = (i) => Math.min(1, Math.max(0, (tl.total - i / SR) / 1.5));
  const L = new Float32Array(n), R = new Float32Array(n), ML = new Float32Array(n), MR = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const m = duck[i] * musicGain * fadeOut(i);
    L[i] = Math.tanh((music.L[i] * m + sfx.L[i] * sfxGain + vo[i] * voGain) * 0.95);
    R[i] = Math.tanh((music.R[i] * m + sfx.R[i] * sfxGain + vo[i] * voGain) * 0.95);
    ML[i] = Math.tanh(music.L[i] * fadeOut(i) + sfx.L[i] * sfxGain);
    MR[i] = Math.tanh(music.R[i] * fadeOut(i) + sfx.R[i] * sfxGain);
  }
  const mix = path.join(outDir, 'mix.wav');
  writeWav(mix, L, R);
  writeWav(path.join(outDir, 'music-sfx-tanpa-vo.wav'), ML, MR);
  console.log('[audio] selesai', mix);
  return mix;
}

module.exports = { build, I, SFX };
