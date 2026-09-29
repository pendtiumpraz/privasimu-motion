// Timing event visual per tipe scene kit + SFX otomatis. Dipakai bersama oleh kit.js (browser) dan build.js (Node),
// jadi animasi dan suara selalu memakai waktu yang sama. Tipe kustom (KIT.registerType) tidak punya SFX otomatis:
// tulis SFX-nya manual di `sfx` scene.
(function (root) {
  // Waktu lokal: angka | 'w:<kata>[#n][+/-offset]' (kata di VO) | 'end-<detik>'
  function resolver(sc, wordTime) {
    return (spec, fb = 0) => {
      if (spec == null) return fb;
      if (typeof spec === 'number') return spec;
      if (spec.startsWith('w:')) { try { return wordTime(sc, spec); } catch (e) { return fb; } }
      if (spec.startsWith('end-')) return sc.dur - parseFloat(spec.slice(4));
      return fb;
    };
  }

  const TIMING = {
    headline: (v, T) => ({ lines: v.lines.map((l, i) => T(l.at, 0.15 + i * 0.35)) }),
    alert: (v, T) => ({ notif: T(v.at, 0.6), aside: (v.aside || []).map((a, i) => T(a.at, T(v.at, 0.6) + 0.3 + i * 0.3)) }),
    countdown: (v, T) => ({ start: T(v.at, 0.3) }),
    stack: (v, T) => ({
      items: v.items.map((it, i) => T(it.at, 0.1 + i * (v.step || 0.22))),
      words: (v.words || []).map((w, i) => T(w.at, 1.5 + i * 0.6)),
      merge: v.merge ? T(v.merge.at, 3) : null,
    }),
    checklist: (v, T) => ({
      rows: v.rows.map((r, i) => T(r.at, 0.3 + i * 0.45)),
      checks: v.rows.map((r) => (r.check == null ? null : T(r.check, null))),
      alarm: v.alarm == null ? null : T(v.alarm, null),
    }),
    flow: (v, T) => ({ steps: v.steps.map((s, i) => T(s.at, 0.4 + i * 0.5)) }),
    card: (v, T) => ({ fields: (v.fields || []).map((f, i) => T(f.at, 0.6 + i * 0.4)), ons: (v.fields || []).map((f) => (f.on == null ? null : T(f.on, null))) }),
    dashboard: (v, T) => ({
      panels: v.panels.map((p, i) => T(p.at, 0.4 + i * 0.3)),
      msgs: v.panels.map((p) => (p.kind === 'chat' ? p.msgs.map((m, j) => T(m.at, T(p.at, 0.4) + 0.5 + j * 1.2)) : [])),
      items: v.panels.map((p) => ((p.kind === 'queue' || p.kind === 'log') ? p.items.map((q, j) => T(q.at, T(p.at, 0.4) + 0.3 + j * 0.3)) : [])),
    }),
    badges: (v, T) => ({ lines: (v.lines || []).map((l, i) => T(l.at, 0.1 + i * 0.3)), badges: v.badges.map((b, i) => T(b.at, 0.6 + i * 0.4)), sub: T(v.subAt, 1.8) }),
    tree: (v, T) => ({
      root: T(v.at, 0.2),
      kids: v.children.map((c, i) => T(c.at, T(v.at, 0.2) + 0.5 + i * 0.12)),
      scores: v.scoreAt == null ? null : T(v.scoreAt, null),
      unify: v.unifyAt == null ? null : T(v.unifyAt, null),
    }),
    grid: (v, T) => ({ scan: T(v.at, 0.4), fix: v.fixAt == null ? null : T(v.fixAt, null) }),
    doc: (v, T) => ({ marks: (v.marks || []).map((m) => T(m.at, 1)), stamp: v.stamp ? T(v.stamp.at, 2) : null }),
    logo: (v, T) => ({ mark: T(v.at, 0.3), nexus: T(v.nexusAt, T(v.at, 0.3) + 0.6), tag: T(v.tagAt, T(v.at, 0.3) + 1.2) }),
    cta: (v, T) => ({ lines: (v.lines || []).map((l, i) => T(l.at, 0.6 + i * 0.5)), btn: T(v.btnAt, 1.8) }),
    // meme: drake (rows) | expect (left/right) | nobody (lines + emoji) | pov (text + emoji)
    meme: (v, T) => {
      if (v.variant === 'drake') return { rows: v.rows.map((r, i) => T(r.at, 0.3 + i * 1.2)) };
      if (v.variant === 'expect') return { left: T(v.left.at, 0.3), right: T(v.right.at, 1.6) };
      if (v.variant === 'nobody') return { lines: v.lines.map((l, i) => T(l.at, 0.2 + i * 0.9)), emoji: T(v.emojiAt, 0.2 + v.lines.length * 0.9) };
      return { text: T(v.at, 0.3), emoji: T(v.emojiAt, T(v.at, 0.3) + 0.8) };
    },
  };

  const stickerTimes = (v, T) => (v.stickers || []).map((s, i) => T(s.at, 0.8 + i * 0.4));

  // SFX bawaan per event [waktu, nama, gain]
  function events(v, T) {
    const ev = [];
    const add = (t, name, g) => { if (t != null && Number.isFinite(t)) ev.push([t, name, g]); };
    (v.stickers || []).forEach((s, i) => add(stickerTimes(v, T)[i], s.sfx || 'pop', s.gain ?? 0.55));
    if (!TIMING[v.type]) return ev;
    const tm = TIMING[v.type](v, T);
    switch (v.type) {
      case 'headline': v.lines.forEach((l, i) => { if (l.fx === 'punch') add(tm.lines[i], 'hit', 0.8); else if (l.sfx) add(tm.lines[i], l.sfx, 0.6); }); break;
      case 'alert': add(tm.notif, 'alarm', 0.7); add(tm.notif, 'pop', 0.6); break;
      case 'countdown': add(tm.start, 'impact', 0.6); break;
      case 'stack':
        tm.items.forEach((t) => add(t, 'pop', 0.45));
        tm.words.forEach((t) => add(t, 'hit', 0.9));
        if (tm.merge != null) { add(tm.merge - 0.35, 'suck', 0.8); add(tm.merge + 0.15, 'ding', 0.6); }
        break;
      case 'checklist':
        tm.rows.forEach((t) => add(t, 'slam', 0.8));
        tm.checks.forEach((t) => add(t, 'check', 0.9));
        add(tm.alarm, 'alarm', 0.8);
        break;
      case 'flow': tm.steps.forEach((t) => add(t, 'pop', 0.6)); break;
      case 'card':
        add(0, 'paper', 0.6);
        tm.fields.forEach((t) => add(t, 'tick', 0.45));
        tm.ons.forEach((t) => add(t, 'check', 0.7));
        break;
      case 'dashboard':
        add(0, 'whoosh', 0.5);
        tm.msgs.flat().forEach((t) => add(t, 'pop', 0.5));
        tm.items.flat().forEach((t) => add(t, 'tick', 0.4));
        break;
      case 'badges': tm.badges.forEach((t) => add(t, 'ding', 0.45)); break;
      case 'tree':
        add(tm.root, 'pop', 0.7);
        tm.kids.forEach((t) => add(t, 'tick', 0.4));
        if (tm.unify != null) { add(tm.unify, 'sweep', 0.6); add(tm.unify + 0.4, 'check', 0.7); }
        break;
      case 'grid': add(tm.scan, 'sweep', 0.5); if (tm.fix != null) add(tm.fix, 'shimmer', 0.5); break;
      case 'doc': add(0, 'paper', 0.9); if (tm.stamp != null) add(tm.stamp, 'stamp', 1); break;
      case 'logo': add(0, 'boom', 1); add(0, 'shimmer', 0.7); break;
      case 'cta': add(0, 'whoosh', 0.6); add(tm.btn, 'ding', 0.6); break;
      case 'meme':
        if (v.variant === 'drake') tm.rows.forEach((t, i) => add(t, i === 0 ? 'buzzer' : 'correct', 0.7));
        else if (v.variant === 'expect') { add(tm.left, 'pop', 0.6); add(tm.right, 'scratch', 0.8); }
        else if (v.variant === 'nobody') { tm.lines.forEach((t) => add(t, 'pop', 0.4)); add(tm.emoji, 'vineboom', 0.9); }
        else { add(tm.text, 'pop', 0.5); add(tm.emoji, 'vineboom', 0.8); }
        break;
    }
    return ev;
  }

  const api = { resolver, TIMING, events, stickerTimes };
  if (typeof module !== 'undefined') module.exports = api; else root.KE = api;
})(this);
