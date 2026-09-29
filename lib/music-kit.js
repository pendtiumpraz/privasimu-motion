// Musik generatif per iklan. Tiap scene memberi "energi" lewat `mus`:
//   hook | tense | hush | main | calm | play | outro | none
// Opsi (CONFIG.music): bpm, root (MIDI), mode 'minor'|'major', clock (detak jam), progression,
//   lead: 'pluck' | 'keys' | 'bell' | 'chip'   — warna instrumen utama
//   drums: 'full' | 'light' | 'chip' | 'none'
//   sonic: true — sonic logo "Pri-va-si-mu" (4 nada) di bagian outro
// Durasi scene dibulatkan ke ketukan (CONFIG.beat = 60/bpm), jadi pergantian bagian musik jatuh tepat di beat.
// Pakai di <iklan>/music.js:  module.exports = require('../lib/music-kit')(CONFIG.music, SCENES);
module.exports = function musicKit(opt = {}, SCENES) {
  const bpm = opt.bpm || 112, B = 60 / bpm, BAR = 4 * B;
  const minorRoot = opt.mode === 'major' ? (opt.root ?? 55) - 3 : (opt.root ?? 50);
  const majorRoot = minorRoot + 3;
  const LEAD = opt.lead || 'pluck', DRUMS = opt.drums || 'full', CHIP = LEAD === 'chip';
  const Q = { m: [0, 3, 7], M: [0, 4, 7], add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14], sus2: [0, 2, 7], sus4: [0, 5, 7], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10] };
  const voice = (root, q) => Q[q].map((iv) => { let n = root + iv; while (n < 52) n += 12; while (n >= 74) n -= 12; return n; }).sort((a, b) => a - b);
  const bassOf = (root) => { let n = root; while (n >= 48) n -= 12; while (n < 36) n += 12; return n; };
  const TENSE = [[0, 'm'], [-4, 'M'], [-7, 'm'], [-5, 'M']].map(([o, q]) => ({ p: voice(minorRoot + o, q), b: bassOf(minorRoot + o) }));
  const BRIGHT = (opt.progression || [[0, 'add9'], [7, 'M'], [9, 'm'], [5, 'add9']]).map(([o, q]) => ({ p: voice(majorRoot + o, q), b: bassOf(majorRoot + o) }));

  return function compose(music, rev, tl, I) {
    const { pad, bass, pluck, kick, clap, hat, sine, clock, keys, bell, square, tri } = I;
    // instrumen sesuai gaya
    const lead = (t, m, g, pan = 0) => {
      if (LEAD === 'keys') keys(music, t, m, B * 1.5, { gain: g * 1.6, pan });
      else if (LEAD === 'bell') bell(music, t, m, { gain: g * 1.3, pan, decay: 2.6 });
      else if (CHIP) square(music, t, m, B / 4 * .9, { gain: g * 1.1, pan, duty: .25 });
      else pluck(music, t, m, { gain: g, pan });
    };
    const leadRev = (t, m, g) => { if (!CHIP) (LEAD === 'keys' ? keys(rev, t, m, B, { gain: g }) : LEAD === 'bell' ? bell(rev, t, m, { gain: g }) : pluck(rev, t, m, { gain: g })); };
    const bassN = (t, dur, m, o = {}) => (CHIP ? tri(music, t, m + 12, dur, { gain: (o.gain || .2) * .8 }) : bass(music, t, dur, m, o));
    const padN = (bus, t, dur, notes, o) => { if (CHIP) { if (bus === music) notes.forEach((m, k) => square(music, t + k * .02, m, Math.min(dur, B * 2) * .9, { gain: .012, duty: .5 })); } else pad(bus, t, dur, notes, o); };
    const kickN = (t, g, len) => { if (DRUMS === 'none') return; if (CHIP) { kick(music, t, g * .7, .15); return; } kick(music, t, DRUMS === 'light' ? g * .6 : g, len); };
    const clapN = (t, g) => { if (DRUMS === 'full') clap(music, t, g); else if (CHIP) hat(music, t, .08, true, 0); };
    const hatN = (t, g, open, pan) => { if (DRUMS === 'none') return; hat(music, t, DRUMS === 'light' ? g * .6 : g, open, pan); };

    const secs = tl.scenes.map((s, i) => ({ id: s.id, a: s.start, b: s.start + s.dur, mus: (SCENES[i] && SCENES[i].mus) || 'main' }));
    let tenseBar = 0, brightBar = 0;
    secs.forEach((s, si) => {
      const next = secs[si + 1], prev = secs[si - 1];
      const dropNext = next && ['main', 'play'].includes(next.mus) && ['tense', 'hush', 'hook'].includes(s.mus);
      const end = dropNext ? s.b - B / 2 : s.b; // hening setengah ketukan sebelum drop
      const len = end - s.a;
      if (len <= 0 || s.mus === 'none') return;
      if (prev && ['tense', 'hush', 'hook'].includes(prev.mus) && ['main', 'play', 'calm'].includes(s.mus)) sine(music, s.a, 43.65, 2.2, .38, 1.4); // sub drop

      if (s.mus === 'hook' || s.mus === 'hush') {
        const c = TENSE[0];
        padN(music, s.a, len - .2, [c.b + 12, c.b + 19], { gain: .07, cutoff: 360, attack: .4, release: .4 });
        sine(music, s.a, 440 * Math.pow(2, (c.b - 69) / 12), len, .22, .35);
        for (let t = s.a, k = 0; t < end - .01; t += B, k++) {
          if (opt.clock) clock(music, t, s.mus === 'hush' ? .32 : .2, k % 2 === 1);
          if (s.mus === 'hush' && k % 2 === 0) { kick(music, t, .55, .35); kick(music, t + .2, .3, .3); }
          if (s.mus === 'hook' && k % 4 === 0) kickN(t, .45, .6);
        }
        return;
      }

      if (s.mus === 'tense') {
        for (let tb = s.a; tb < end - .01; tb += BAR, tenseBar++) {
          const c = TENSE[tenseBar % 4], e = Math.min(tb + BAR, end), prog = (tb - s.a) / Math.max(1, len);
          padN(music, tb, e - tb, c.p, { gain: .06 + .03 * prog, cutoff: 600 + 1200 * prog, attack: .25, release: .35 });
          padN(rev, tb, e - tb, c.p.map((n) => n + 12), { gain: .025, cutoff: 1500, attack: .4, release: .5 });
          for (let st = 0; st < 8; st++) {
            const t = tb + st * B / 2; if (t >= e - .01) break;
            bassN(t, B / 2 * .7, c.b + (st % 2 ? 12 : 0), { gain: .15 + .08 * prog, cutoff: 320 + 700 * prog });
            if (st % 4 === 0) kickN(t, .6);
            if (opt.clock && st % 2 === 0) clock(music, t, .18, st % 4 === 2);
            hatN(t + B / 4, .02 + .02 * prog, false, st % 2 ? .3 : -.3);
          }
        }
        return;
      }

      if (s.mus === 'outro') {
        const c = BRIGHT[0];
        kickN(s.a, .8, 1.3);
        bassN(s.a, Math.max(.5, len - .9), c.b, { gain: .22, cutoff: 420 });
        padN(music, s.a, Math.max(.5, len - 1.1), [c.b + 12, ...c.p, c.p[c.p.length - 1] + 5], { gain: .1, cutoff: 2300, attack: .02, release: 1.1 });
        padN(rev, s.a, Math.max(.5, len - 1.1), c.p.map((n) => n + 12), { gain: .05, cutoff: 2300, attack: .02, release: 1.1 });
        // sonic logo "Pri-va-si-mu": sol-mi-re-do (turun, mantap)
        if (opt.sonic !== false) [[7, 0], [4, .5], [2, 1], [0, 1.5]].forEach(([iv, dt], k) => { lead(s.a + B * 2 + dt * B, majorRoot + 12 + iv, k === 3 ? .06 : .045, 0); leadRev(s.a + B * 2 + dt * B, majorRoot + 12 + iv, .02); });
        c.p.concat(c.p.map((n) => n + 12)).forEach((m, k) => lead(s.a + B * 5 + k * B / 2, m + 12, .025 * (1 - k / 8), k % 2 ? .45 : -.45));
        return;
      }

      // main / calm / play: progresi cerah
      for (let tb = s.a; tb < end - .01; tb += BAR, brightBar++) {
        const c = BRIGHT[brightBar % 4], e = Math.min(tb + BAR, end);
        const calm = s.mus === 'calm', play = s.mus === 'play';
        padN(music, tb, e - tb, c.p, { gain: calm ? .08 : .065, cutoff: calm ? 1500 : 2000, attack: calm ? .3 : .06, release: .45 });
        padN(rev, tb, e - tb, c.p, { gain: .03, cutoff: 1800, attack: .1, release: .5 });
        for (let st = 0; st < 16; st++) {
          const t = tb + st * B / 4; if (t >= e - .01) break;
          const arp = [0, 1, 2, c.p.length - 1, 2, 1, c.p.length - 1, 2][st % 8] % c.p.length;
          if (play) {
            const pat = [0, 3, 6, 8, 10, 13], pi = pat.indexOf(st);
            if (pi >= 0) lead(t, c.p[[0, 2, 1, 2, 0, 1][pi]] + 12, .045, st % 2 ? .35 : -.35);
            if (st % 4 === 0) { kickN(t, .6); bassN(t, B * .35, c.b, { gain: .2, cutoff: 700 }); }
            if (st % 8 === 4) clapN(t, .28);
            if (st % 2 === 0) hatN(t, .03, false, st % 4 ? .35 : -.35);
            continue;
          }
          if (calm) {
            if (st % 2 === 0) lead(t, c.p[arp] + 12, .028, st % 4 ? .4 : -.4);
            if (st % 8 === 0) kickN(t, .45);
            if (st % 4 === 0) bassN(t, B * .9, c.b, { gain: .15, cutoff: 500 });
            if (st % 4 === 2) hatN(t, .02, false, .3);
            continue;
          }
          lead(t, c.p[arp] + 12, .032, st % 2 ? .45 : -.45);
          if (st % 2 === 0) leadRev(t, c.p[arp] + 12, .016);
          if (st % 2 === 0) bassN(t, B / 2 * .85, c.b, { gain: .21, cutoff: 850 });
          if (st % 4 === 0) kickN(t, .74);
          if (st % 8 === 4) { clapN(t, .28); if (DRUMS === 'full') clap(rev, t, .12); }
          if (st % 4 === 2) hatN(t, .06, true);
          else hatN(t, .03, false, st % 2 ? .3 : -.3);
        }
      }
    });
  };
};
