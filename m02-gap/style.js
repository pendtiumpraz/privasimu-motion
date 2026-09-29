// Gaya M02 · seri "Nexus Explained". Hook khusus: kursor ragu di tombol asli "Mulai Assessment" (s1), 😬 (s2),
// "Merasa patuh ≠ Patuh" (s3), dan analisis dokumen bukti oleh AI (s7). Adegan lain: nx_shot & nx_cta.
(function () {
  const { V, SW, SH, h, rich, pick, splitWords, revealWords, float } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const { popK, place } = SERI;
  SERI.init({ kode: 'M02', modul: 'GAP Assessment', emoji: '😬🚫📄✨✅🟡❌❔' });

  const CURSOR = '<svg class="nx-cursor" viewBox="0 0 24 24"><path d="M4 2l15 10.5-6.6 1.2 3.9 7.4-3 1.6-3.9-7.5L4 20z" fill="#0B1B4D" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  function lineBlock(root, html, cls = 'lg') {
    const el = h(`<div class="m2-line nx-line ${cls}">${html}</div>`);
    root.appendChild(el);
    Object.assign(el.style, V ? { left: '60px', right: '60px', top: '330px', textAlign: 'center' } : { left: '160px', right: '160px', top: '190px', textAlign: 'center' });
    return { el, w: splitWords(el) };
  }

  // ---------------- s1: kursor menuju tombol asli, lalu "JANGAN" ----------------
  KIT.registerType('m02_tombol', (root, v, sc, tm, T) => {
    const tL = T(v.lineAt, 0.9), tStop = T(v.stopAt, 1);
    const tx = lineBlock(root, 'Jangan cek skor kepatuhan <em>perusahaanmu…</em>');
    const IW = 1002, IH = 150, CW = pick(1440, 1000), sc0 = CW / IW, CH = IH * sc0;
    const CX = (SW - CW) / 2, CY = pick(520, 900);
    const card = h(`<div class="m2-card" style="left:${CX}px;top:${CY}px;width:${CW}px;height:${CH}px"><img src="../assets/app/gap-mulai.png" style="width:${CW}px;height:${CH}px" alt=""></div>`);
    root.appendChild(card);
    const B = [763, 87, 190, 44].map((n) => n * sc0), bx = CX + B[0], by = CY + B[1];
    const glow = h(`<div class="m2-glow" style="left:${bx - 10}px;top:${by - 10}px;width:${B[2] + 20}px;height:${B[3] + 20}px"></div>`);
    root.appendChild(glow);
    const ban = h(`<div class="m2-ban" style="left:${bx + B[2] / 2 - pick(110, 90)}px;top:${by + B[3] / 2 - pick(110, 90)}px;width:${pick(220, 180)}px;height:${pick(220, 180)}px"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#E5484D" stroke-width="10"/><path d="M21 79L79 21" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/></svg></div>`);
    root.appendChild(ban);
    const cur = h(CURSOR);
    root.appendChild(cur);
    const target = [bx + B[2] * 0.55, by + B[3] * 0.55], start = [pick(1700, 980), pick(1000, 1500)];
    return (lt) => {
      revealWords(tx.w, tL, lt, { stagger: 0.07, dur: 0.55 });
      const kc = E.out3(P(lt, 0, 0.6));
      tf(card, { y: (1 - kc) * 60 + float(lt, 0, 4, 0.8), s: lerp(0.94, 1, kc), o: kc });
      // kursor: meluncur ke tombol, ragu (gemetar), lalu mundur pelan
      const km = E.io3(P(lt, 0.25, tStop - 0.1));
      let x = lerp(start[0], target[0], km), y = lerp(start[1], target[1], km);
      if (lt > tStop) { const kr = E.io3(P(lt, tStop + 0.4, tStop + 1.6)); x += kr * pick(160, 120); y += kr * pick(120, 140); }
      const trem = lt > tStop - 0.1 && lt < tStop + 0.5 ? (1 - P(lt, tStop - 0.1, tStop + 0.5)) : 0;
      place(cur, x + Math.sin(lt * 60) * 5 * trem, y + Math.cos(lt * 47) * 4 * trem);
      tf(cur, { o: P(lt, 0.2, 0.4), s: 1 });
      glow.style.opacity = km > 0.95 && lt < tStop + 0.2 ? 0.6 + 0.4 * Math.sin(lt * 8) : 0;
      const kb = popK(lt, tStop, 0.4);
      tf(ban, { s: kb, r: (1 - kb) * -40, o: cl(kb * 3) });
    };
  });

  // ---------------- s2: 😬 membesar + vine boom ----------------
  KIT.registerType('m02_kaget', (root, v, sc, tm, T) => {
    const tL = T(v.lineAt, 0.3), tB = T(v.boomAt, 1);
    const tx = lineBlock(root, '…kalau belum siap <em>kaget.</em>');
    const emo = h('<div class="nx-emo" style="font-size:420px">😬</div>');
    root.appendChild(emo);
    return (lt) => {
      revealWords(tx.w, tL, lt, { stagger: 0.07, dur: 0.5 });
      const k = P(lt, tB - 0.03, tB + 0.25), pre = E.out3(P(lt, 0, 0.5));
      place(emo, SW / 2 - 210, pick(560, 880));
      tf(emo, { s: lt < tB ? 0.55 * pre : lerp(1.6, 1.15, E.outExpo(k)) * (1 + 0.02 * Math.sin(lt * 9)), r: Math.sin(lt * 3) * 4, o: pre });
    };
  });

  // ---------------- s3: "Merasa patuh ≠ Patuh" · "Perasaan ≠ Bukti" ----------------
  KIT.registerType('m02_neq', (root, v, sc, tm, T) => {
    const tA = T(v.aAt, 0.5), tB = T(v.bAt, 1), tC = T(v.cAt, 2.5), tD = T(v.dAt, 3.2);
    const row = (a, b, cls) => {
      const el = h(`<div class="m2-neq ${cls}"><div class="a nx-line lg mute">${a}</div><div class="op">≠</div><div class="b nx-line lg">${b}</div></div>`);
      root.appendChild(el);
      return { el, a: el.querySelector('.a'), op: el.querySelector('.op'), b: el.querySelector('.b') };
    };
    const r1 = row('Merasa patuh', 'Patuh ✓', 'r1'), r2 = row('Perasaan', 'Bukti', 'r2');
    const stamp = h('<div class="m2-stamp">BUTUH BUKTI</div>');
    r2.el.appendChild(stamp);
    return (lt) => {
      [[r1, tA, tB], [r2, tC, tD]].forEach(([r, ta, tb], i) => {
        const ka = E.out3(P(lt, ta - 0.05, ta + 0.4)), kb = E.out3(P(lt, tb - 0.05, tb + 0.4)), ko = popK(lt, tb + 0.12, 0.35);
        tf(r.a, { x: (1 - ka) * -40, o: ka });
        tf(r.b, { x: (1 - kb) * 40, o: kb });
        tf(r.op, { s: ko, r: (1 - Math.min(1, ko)) * -90, o: cl(ko * 3) });
        tf(r.el, { y: float(lt, i, 3) });
      });
      const ks = P(lt, tD + 0.1, tD + 0.3);
      tf(stamp, { s: lerp(2.4, 1, E.outExpo(ks)), r: -8, o: ks > 0 ? 1 : 0 });
    };
  });

  // ---------------- s7: dokumen bukti → AI → status per pertanyaan ----------------
  KIT.registerType('m02_ai', (root, v, sc, tm, T) => {
    const tD = T(v.docAt, 0.3), tA = T(v.aiAt, 1.2), tR = T(v.resAt, 2.2);
    const title = h(`<div class="nx-title"><div class="eb">M02 · Analisis bukti</div><div class="tt">${rich('Dokumen bukti, *dianalisis AI.*')}</div><div class="sb">Per pertanyaan · 1 kredit per analisis · hasilnya disimpan</div></div>`);
    root.appendChild(title);
    Object.assign(title.style, V ? { left: '60px', width: '960px', top: '300px' } : { left: '110px', width: '600px' });
    const ttW = splitWords(title.querySelector('.tt')), sbW = splitWords(title.querySelector('.sb'));
    const doc = h('<div class="m2-doc"><div class="ic">📄</div><b>kebijakan-privasi.pdf</b><i></i><i></i><i></i><i></i></div>');
    const orb = h('<div class="m2-orb"><span>✨</span><b>AI</b></div>');
    const RES = [['✅', 'Memenuhi', 'green'], ['🟡', 'Memenuhi sebagian', 'amber'], ['❌', 'Belum memenuhi', 'red'], ['❔', 'Perlu dicek', 'blue']];
    const res = RES.map(([e, t, c]) => { const el = h(`<div class="m2-res ${c}"><span>${e}</span>${t}</div>`); root.appendChild(el); return el; });
    root.appendChild(doc); root.appendChild(orb);
    const flow = h(`<svg class="nx-svg" width="${SW}" height="${SH}"><path class="f1" fill="none" stroke="#2F6BFF" stroke-width="5" stroke-dasharray="10 12" stroke-linecap="round"/><path class="f2" fill="none" stroke="#6D4CFF" stroke-width="5" stroke-dasharray="10 12" stroke-linecap="round"/></svg>`);
    root.insertBefore(flow, doc);
    const L = pick({ doc: [760, 380], orb: [1270, 540], res: [[1480, 330], [1480, 450], [1480, 570], [1480, 690]] }, { doc: [290, 600], orb: [540, 1010], res: [[70, 1150], [555, 1150], [70, 1260], [555, 1260]] });
    const f1 = flow.querySelector('.f1'), f2 = flow.querySelector('.f2');
    f1.setAttribute('d', V ? `M540 ${600 + 250} L540 ${1010 - 100}` : `M${760 + 360} 540 L${1270 - 100} 540`);
    f2.setAttribute('d', V ? `M540 ${1010 + 100} L540 1140` : `M${1270 + 100} 540 L1470 540`);
    return (lt) => {
      if (!V && !title._y && title.offsetHeight) title._y = (SH - title.offsetHeight) / 2;
      if (!V && title._y) title.style.top = title._y + 'px';
      revealWords(ttW, 0.1, lt, { stagger: 0.06, dur: 0.6 });
      revealWords(sbW, 0.6, lt, { stagger: 0.03, dur: 0.5 });
      const kd = popK(lt, tD, 0.5);
      place(doc, L.doc[0], L.doc[1]);
      tf(doc, { s: kd, r: (1 - kd) * 8 - 3 + Math.sin(lt * 1.3) * 1.5, y: float(lt, 0, 5), o: cl(kd * 3) });
      const ko = popK(lt, tA - 0.2, 0.5);
      place(orb, L.orb[0] - 100, L.orb[1] - 100);
      tf(orb, { s: ko * (1 + 0.05 * Math.sin(lt * 5)), r: lt * 20 * 0, o: cl(ko * 3) });
      orb.style.boxShadow = `0 0 ${60 + 30 * Math.sin(lt * 4)}px rgba(109,76,255,.45)`;
      f1.style.opacity = P(lt, tA - 0.3, tA); f1.setAttribute('stroke-dashoffset', (-lt * 60).toFixed(1));
      f2.style.opacity = P(lt, tR - 0.3, tR); f2.setAttribute('stroke-dashoffset', (-lt * 60).toFixed(1));
      res.forEach((el, i) => {
        const kr = popK(lt, tR + i * 0.15, 0.4);
        place(el, L.res[i][0], L.res[i][1]);
        tf(el, { s: kr, x: (1 - Math.min(1, kr)) * pick(40, 0), o: cl(kr * 3) });
      });
    };
  });
})();
