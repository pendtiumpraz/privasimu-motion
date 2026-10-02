// LP03 — musik orisinal (disintesis di sini + instrumen lib/audio.js, bebas royalti). 72 bpm, E♭ mayor (relatif C minor).
// Piano "felt" aditif (sedikit inharmonis, ketukan palu lembut) + pad hangat + bas gesek lembut, TANPA drum.
// Alur: sampul (E♭–Cm–A♭, motif turun F–E♭–D–E♭ mengikuti baris tabel) → latar & tanggal (tenang, satu nada tiap baris
// tinta) → taruhan (C minor, denyut rendah per ketukan, G7 menggantung) → kutipan (sunyi, pad rendah) → usulan
// (resolusi tipuan G7→A♭, arpeggio seperdelapan mengalir, satu nada melodi tiap baris daftar) → rekomendasi
// (akor jatuh tepat saat stempel) → CTA: E♭ + sonic logo "Pri-va-si-mu" (sol-mi-re-do: B♭ G F E♭).
// Bunyi kertas & pena juga disintesis di sini: balik halaman / lembar diangkat (sesuai `trans` scene) dan goresan
// pena biru (garis bawah, lingkaran, paraf) tepat pada jendela gambarnya di style.js.
const { SCENES, BEAT } = require('./scenes');

module.exports = function compose(music, rev, tl, I) {
  const { SR, mtof, pad, bell, SVF, noise } = I;
  const B = BEAT, TAU = Math.PI * 2;
  const S = (id) => tl.scenes.find((s) => s.id === id);
  const at = (id, beats) => S(id).start + beats * B;

  // ---------- instrumen ----------
  // piano felt: parsial 1..8 sedikit inharmonis, parsial atas meluruh lebih cepat, palu lembut, peredam saat dilepas
  function felt(t0, m, dur, g, pan = 0, wet = 0.32) {
    const f = mtof(m), n = Math.floor((dur + 0.5) * SR), s0 = Math.floor(t0 * SR);
    const tone = Math.min(0.92, 0.55 + g * 5);
    const ps = [];
    for (let k = 1; k <= 8; k++) {
      const fk = f * k * Math.sqrt(1 + 0.00032 * k * k);
      if (fk > 9500) break;
      ps.push({ w: TAU * fk / SR, a: Math.pow(k, -1.2) * Math.pow(tone, k - 1), dm: Math.exp(-((0.5 + 0.4 * k) * (0.7 + 0.3 * f / 262)) / SR), e: 1 });
    }
    const flt = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      let y = 0;
      for (const p of ps) { y += Math.sin(p.w * i) * p.a * p.e; p.e *= p.dm; }
      if (t < 0.025) y += flt.run(noise(), 700 + f, 0.7).lp * 0.5 * (1 - t / 0.025);
      const v = y * Math.min(1, t / 0.004) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.5) : 1) * g;
      music.add(s0 + i, v, pan);
      rev.add(s0 + i, v * wet, pan);
    }
  }
  // akor digulung (arpeggio cepat ke atas)
  const roll = (t0, notes, dur, g, gap = 0.035) => notes.forEach((m, k) => felt(t0 + k * gap, m, dur - k * gap, g * (1 - k * 0.06), (k / Math.max(1, notes.length - 1) - 0.5) * 0.5));
  // bas gesek lembut: sinus + harmonik 2/3, serangan pelan, vibrato halus
  function low(t0, m, dur, g) {
    const f = mtof(m), n = Math.floor((dur + 0.6) * SR), s0 = Math.floor(t0 * SR);
    let ph = 0;
    for (let i = 0; i < n; i++) {
      const t = i / SR;
      ph += f * (1 + 0.0025 * Math.sin(TAU * 4.6 * t) * Math.min(1, t / 0.8)) / SR;
      const y = 0.75 * Math.sin(TAU * ph) + 0.42 * Math.sin(TAU * 2 * ph) + 0.12 * Math.sin(TAU * 3 * ph);
      const e = Math.min(1, t / 0.14) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.6) : 1);
      music.add(s0 + i, y * e * g);
    }
  }
  const padC = (t0, dur, notes, o) => { pad(music, t0, dur, notes, o); pad(rev, t0, dur, notes.map((x) => x + 12), { ...o, gain: o.gain * 0.3 }); };
  const chime = (t, m, g, pan = 0) => { bell(music, t, m, { gain: g, pan, decay: 2.6 }); bell(rev, t, m, { gain: g * 0.7 }); };
  function drone(t0, dur, m, g) { // sinus rendah yang mengembang (untuk sunyi/taruhan)
    const f = mtof(m), n = Math.floor(dur * SR), s0 = Math.floor(t0 * SR);
    for (let i = 0; i < n; i++) {
      const t = i / SR, e = Math.sin(Math.PI * Math.min(1, t / dur)) ** 1.5;
      music.add(s0 + i, Math.sin(TAU * f * t) * e * g);
    }
  }

  // ---------- bunyi kertas & pena (orisinal) ----------
  function pageTurn(t0, len, g) { // desis kertas tersaring + kresek halus + "jatuh" lembut di akhir
    const n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), f1 = new SVF(), f2 = new SVF(), f3 = new SVF();
    for (let i = 0; i < n; i++) {
      const p = i / n, env = Math.pow(Math.sin(Math.PI * Math.min(1, p * 1.12)), 1.4);
      const cr = noise() > 0.982 ? noise() * 2.4 : 0;
      const y = f1.run(noise(), 1600 + 4200 * Math.sin(Math.PI * p), 0.9).bp * 0.75 + f2.run(cr, 3800, 1.4).bp * 1.1;
      music.add(s0 + i, y * env * g, -0.45 + 0.9 * p);
      rev.add(s0 + i, y * env * g * 0.12);
    }
    const m = Math.floor(0.22 * SR), s1 = Math.floor((t0 + len * 0.82) * SR);
    for (let i = 0; i < m; i++) { const t = i / SR; music.add(s1 + i, f3.run(noise(), 260, 0.7).lp * Math.exp(-t * 20) * g * 1.6); }
  }
  function sheetSlide(t0, len, g) { // lembar diangkat & digeser: desis lebih rendah dan halus
    const n = Math.floor(len * SR), s0 = Math.floor(t0 * SR), f1 = new SVF();
    for (let i = 0; i < n; i++) {
      const p = i / n, env = Math.pow(Math.sin(Math.PI * p), 2);
      const y = f1.run(noise(), 900 + 2600 * p, 0.7).bp;
      music.add(s0 + i, y * env * g, 0.3 - 0.6 * p);
      rev.add(s0 + i, y * env * g * 0.1);
    }
  }
  function penScratch(t0, t1, g, speed) { // ujung pena di kertas: noise pita sempit yang bergerak seperti tangan
    const n = Math.floor((t1 - t0) * SR), s0 = Math.floor(t0 * SR), f = new SVF(), f2 = new SVF();
    for (let i = 0; i < n; i++) {
      const t = i / SR, p = i / n, edge = Math.min(1, t * 14) * Math.min(1, (t1 - t0 - t) * 12);
      const move = 0.5 + 0.5 * Math.sin(TAU * (speed * t + 0.5 * Math.sin(TAU * 1.7 * t)));
      const y = f.run(noise(), 2400 + 1600 * move, 1.2).bp * 0.85 + f2.run(noise(), 6800, 0.8).hp * 0.1;
      music.add(s0 + i, y * g * edge * (0.3 + 0.7 * move), -0.2 + 0.4 * p);
    }
  }

  // ---------- akor (E♭ mayor / C minor) ----------
  const CH = {
    Eb: { b: 39, p: [55, 58, 62, 65] }, Cm: { b: 36, p: [55, 58, 62, 63] }, Ab: { b: 44, p: [55, 60, 63, 70] },
    Bbs: { b: 46, p: [58, 63, 65, 70] }, Bb: { b: 46, p: [58, 62, 65, 70] }, Fm: { b: 41, p: [56, 60, 63, 67] },
    Gm: { b: 43, p: [58, 62, 65, 67] }, EbG: { b: 43, p: [55, 58, 63, 67] }, Cm9: { b: 36, p: [55, 60, 62, 63] },
    Ab7: { b: 44, p: [55, 60, 62, 67] }, G7s: { b: 43, p: [55, 60, 62, 65] }, G7: { b: 43, p: [55, 59, 62, 65] },
  };
  // per scene: progresi [akor, ketukan], gaya iringan, melodi [ketukan, midi, durasi ketukan, gain?]
  const PLAN = {
    s1: { prog: [['Eb', 4], ['Cm', 4], ['Ab', 4]], style: 'intro',
      mel: [[0.25, 70, 2, 0.034], [0.75, 79, 2.5], [2.5, 77, 1], [3.5, 75, 1], [4.5, 74, 1], [5.5, 75, 1.5], [6.5, 79, 1.5], [8, 72, 1], [9, 75, 1], [10, 70, 2]] },
    s2: { prog: [['Bbs', 4], ['Eb', 4], ['Fm', 2]], style: 'calm',
      mel: [[1.25, 77, 0.75], [2, 75, 0.75], [2.75, 70, 1.5], [4.25, 79, 1], [4.75, 77, 1.5], [6.25, 74, 1.5], [8, 72, 1], [9, 75, 1]] },
    s3: { prog: [['Gm', 4], ['Ab', 4], ['Bbs', 2]], style: 'calm',
      mel: [[1.25, 70, 0.75], [2, 74, 1.5, 0.05], [2.75, 70, 0.75], [3.5, 77, 1.5], [5, 75, 1.5], [5.5, 72, 1], [6.75, 67, 1.5], [8, 77, 1], [9, 75, 1]] },
    s4: { prog: [['Eb', 4], ['Cm', 4], ['Ab', 4]], style: 'calm',
      mel: [[1.25, 79, 1], [2.25, 77, 0.75], [3, 75, 1], [4.5, 74, 1], [5.5, 74, 1], [6.5, 75, 1], [7.5, 79, 1.5], [9, 84, 1, 0.03], [10, 82, 2, 0.03]] },
    s5: { prog: [['Cm9', 4], ['Ab7', 4], ['Fm', 4], ['G7s', 1], ['G7', 1]], style: 'tense',
      mel: [[1.5, 72, 2], [3, 75, 1.5], [5.5, 74, 1.5], [6.5, 72, 2], [9, 68, 2], [12, 71, 2, 0.03]] },
    s6: { prog: [['Ab7', 4], ['Fm', 4], ['G7', 2]], style: 'hush',
      mel: [[1.25, 79, 1.5, 0.036], [2.5, 75, 2, 0.034], [4, 74, 1.5, 0.03], [4.75, 72, 2, 0.028], [8, 77, 1, 0.026], [9, 71, 1, 0.03]] },
    s7: { prog: [['Ab', 4], ['EbG', 4], ['Fm', 4], ['Bbs', 4], ['Eb', 4], ['Cm', 2]], style: 'main',
      mel: [[0, 72, 1.5], [1.25, 75, 1], [2.25, 79, 1.5], [4, 75, 1], [6, 79, 1], [8, 80, 1], [10, 79, 1], [12, 77, 1], [14, 82, 1], [16, 79, 1], [18, 82, 1, 0.03], [20, 79, 2, 0.03]] },
    s8: { prog: [['Ab', 4], ['Bbs', 4], ['Bb', 2]], style: 'main',
      mel: [[1, 72, 1], [2.5, 84, 1, 0.032], [4, 82, 1, 0.032], [5.5, 77, 1.5], [8, 74, 1.5]] },
    s9: { prog: [['Eb', 4], ['Ab', 4], ['Bbs', 2], ['Bb', 2]], style: 'calm',
      mel: [[1.75, 79, 1.5], [3.25, 82, 1, 0.03], [4.5, 84, 2, 0.026], [6.25, 79, 1.5], [10, 74, 2]] },
  };

  for (const [id, pl] of Object.entries(PLAN)) {
    const s = S(id);
    let bt = 0;
    pl.prog.forEach(([cn, nb], ci) => {
      const c = CH[cn], t0 = at(id, bt), dur = nb * B, st = pl.style;
      const pg = { intro: 0.04, calm: 0.044, tense: 0.05, hush: 0.04, main: 0.046 }[st];
      const cut = { intro: 950, calm: 1100, tense: 720, hush: 620, main: 1500 }[st];
      padC(t0, dur, st === 'tense' || st === 'hush' ? c.p.map((x) => x - 12).concat([c.p[2]]) : c.p, { gain: pg, cutoff: cut, attack: id === 's1' && ci === 0 ? 1.8 : 0.45, release: 0.7 });
      // bas: tidak di birama pertama sampul; taruhan & sunyi lebih rendah
      if (!(id === 's1' && ci === 0)) low(t0, c.b, dur - 0.08, st === 'hush' ? 0.03 : st === 'tense' ? 0.048 : 0.042);
      if (st === 'intro' || st === 'calm') {
        roll(t0, c.p, Math.min(dur, 3 * B), st === 'intro' ? 0.022 : 0.026);
        if (nb >= 4) { felt(t0 + 2 * B, c.p[0], B * 1.5, 0.017, -0.3); felt(t0 + 2 * B, c.p[2], B * 1.5, 0.015, 0.3); }
      } else if (st === 'main') {
        roll(t0, c.p, Math.min(dur, 2 * B), 0.024);
        const arp = [0, 2, 1, 3, 2, 1, 3, 2];
        for (let e = 0; e < nb * 2; e++) {
          const m = c.p[arp[e % 8]] + (e % 4 === 3 ? 12 : 0);
          felt(t0 + e * B / 2, m, B * 0.6, 0.015 + (e % 2 ? 0 : 0.004), e % 2 ? 0.35 : -0.35, 0.36);
        }
      } else if (st === 'tense') {
        for (let q = 0; q < nb; q++) felt(t0 + q * B, c.b + 12, B * 0.7, q % 2 ? 0.02 : 0.028, -0.15, 0.2);
        roll(t0, c.p.map((x) => x - 12), Math.min(dur, 3 * B), 0.016, 0.05);
      } else if (st === 'hush') {
        if (ci === 0) drone(t0, s.dur, c.b - 12, 0.03);
      }
      bt += nb;
    });
    pl.mel.forEach(([b0, m, nb, g = 0.05]) => felt(at(id, b0), m, nb * B, g * 1.15, (m - 76) * 0.03, 0.42));
  }
  // kilau lonceng di momen kunci (sangat tipis)
  chime(at('s1', 0.75), 91, 0.012, 0.3);
  chime(at('s3', 2), 86, 0.012, -0.2);
  chime(at('s7', 0), 84, 0.014, 0.2);

  // ---------- rekomendasi: akor B♭sus4 jatuh tepat saat stempel ----------
  {
    const tS = S('s9').start + SCENES.find((x) => x.id === 's9').vis.at.stamp;
    roll(tS, [46, 58, 63, 65, 70], 2.4 * B, 0.03, 0.012);
  }

  // ---------- CTA: E♭ + sonic logo "Pri-va-si-mu" (sol-mi-re-do = B♭5 G5 F5 E♭5) ----------
  {
    const s = S('s10'), len = s.dur, c = CH.Eb;
    low(s.start, c.b, len - 1.4, 0.05);
    low(s.start, c.b - 12, len - 1.4, 0.02);
    padC(s.start, len - 1.2, [51, ...c.p, 70], { gain: 0.052, cutoff: 1700, attack: 0.25, release: 1.2 });
    roll(s.start, [51, 58, 62, 67, 70], 3 * B, 0.026);
    [[2, 82], [2.5, 79], [3, 77], [3.5, 75]].forEach(([b0, m], k) => {
      felt(at('s10', b0), m, k === 3 ? B * 3.5 : B * 0.9, k === 3 ? 0.075 : 0.062, 0, 0.45);
      chime(at('s10', b0), m + 12, k === 3 ? 0.018 : 0.012, (k - 1.5) * 0.15);
    });
    roll(at('s10', 4), [63, 67, 70, 74], 3 * B, 0.022, 0.06);
    [87, 91, 94].forEach((m, k) => chime(at('s10', 6) + k * B / 2, m, 0.009 * (1 - k * 0.2), k % 2 ? 0.4 : -0.4));
  }

  // ---------- bunyi transisi kertas ----------
  SCENES.forEach((sc) => {
    const t = S(sc.id).start;
    if (sc.vis.trans === 'turn') pageTurn(t, 0.95, 0.055);
    if (sc.vis.trans === 'lift') sheetSlide(t + 0.05, 0.9, 0.045);
  });
  // ---------- goresan pena biru (sinkron dengan style.js) ----------
  const PEN = { 'mm-law': [(a) => [a.pen, a.pen + 0.55], 0.02, 3.2], 'mm-date': [(a) => [a.pen, a.pen + 0.9], 0.018, 2.4],
    'mm-quote': [(a) => [a.pen, a.pen + 0.6], 0.02, 3.2], 'mm-close': [(a) => [a.sign, a.sign + a.signDur], 0.022, 4.2] };
  SCENES.forEach((sc) => {
    const p = PEN[sc.vis.type];
    if (!p) return;
    const [a, b2] = p[0](sc.vis.at), t0 = S(sc.id).start;
    penScratch(t0 + a, t0 + b2, p[1], p[2]);
  });
};
