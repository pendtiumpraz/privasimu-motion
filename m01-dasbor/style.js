// Gaya M01 · seri "Nexus Explained". Hook khusus: tumpukan laporan jatuh lalu disilang (s1) dan stopwatch 10 detik (s2).
// Adegan lain memakai tipe seri: nx_shot (screenshot asli) & nx_cta.
(function () {
  const { V, SW, SH, h, pick, splitWords, revealWords, float } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const { popK, place } = SERI;
  SERI.init({ kode: 'M01', modul: 'Dasbor Kepatuhan', emoji: '📄⏱️' });

  const N = 14; // jumlah lembar di tumpukan
  const sheetHtml = (top) => `<div class="m1-sheet ${top ? 'top' : ''}">${top ? '<div class="clip"></div><b>LAPORAN KEPATUHAN<br>2026</b><small>482 halaman · lampiran 1–27</small>' : ''}<i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`;

  function textBlock(root, l1, l2) {
    const el = h(`<div class="m1-text"><div class="nx-line lg">${l1}</div><div class="nx-line lg red">${l2}</div></div>`);
    root.appendChild(el);
    Object.assign(el.style, V ? { left: '60px', right: '60px', top: '330px', textAlign: 'center' } : { left: '120px', width: '860px' });
    return { el, w1: splitWords(el.children[0]), w2: splitWords(el.children[1]) };
  }

  // ---------------- s1: tumpukan laporan setebal bantal → disilang ----------------
  KIT.registerType('m01_tumpukan', (root, v, sc, tm, T) => {
    const t1 = T(v.lineAt, 1.3), t2 = T(v.line2At, 2.3), tS = T(v.strikeAt, 3);
    const tx = textBlock(root, 'Laporan kepatuhan terbaik', 'bukan yang paling <em>tebal.</em>');
    const SWD = pick(360, 380), SHT = pick(460, 480), CX = pick(1440, 540), BASE = pick(900, 1380), STEP = pick(10, 11);
    const table = h('<div class="m1-table"></div>');
    root.appendChild(table);
    Object.assign(table.style, { left: CX - pick(430, 470) + 'px', top: BASE + 'px', width: pick(860, 940) + 'px' });
    const sheets = Array.from({ length: N }, (_, i) => {
      const el = h(sheetHtml(i === N - 1));
      Object.assign(el.style, { width: SWD + 'px', height: SHT + 'px' });
      root.appendChild(el);
      return { el, t0: 0.12 + i * 0.075, r: (hash(i * 3.1 + 1) - 0.5) * 7, dx: (hash(i * 5.3 + 2) - 0.5) * 22 };
    });
    const X = pick([CX - SWD * 0.72, BASE - SHT - N * STEP - 30, CX + SWD * 0.72, BASE + 10], [CX - SWD * 0.72, BASE - SHT - N * STEP - 30, CX + SWD * 0.72, BASE + 10]);
    const cross = h(`<svg class="nx-svg" width="${SW}" height="${SH}"><g fill="none" stroke="#E5484D" stroke-width="${pick(18, 16)}" stroke-linecap="round">
      <path d="M${X[0]} ${X[1]} L${X[2]} ${X[3]}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M${X[2]} ${X[1]} L${X[0]} ${X[3]}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></g></svg>`);
    root.appendChild(cross);
    const [c1, c2] = cross.querySelectorAll('path');
    return (lt) => {
      if (!V && !tx.el._y && tx.el.offsetHeight) tx.el._y = (SH - tx.el.offsetHeight) / 2;
      if (!V && tx.el._y) tx.el.style.top = tx.el._y + 'px';
      revealWords(tx.w1, t1, lt, { stagger: 0.07, dur: 0.55 });
      revealWords(tx.w2, t2, lt, { stagger: 0.07, dur: 0.55 });
      const struck = lt > tS;
      sheets.forEach((s, i) => {
        const k = P(lt, s.t0, s.t0 + 0.32), yRest = BASE - SHT - i * STEP;
        const land = s.t0 + 0.32, kb = P(lt, land, land + 0.2);
        const y = k < 1 ? lerp(-SHT - 160, yRest, k * k) : yRest - Math.sin(Math.PI * kb) * 10 * (1 - kb);
        tf(s.el, { x: CX - SWD / 2 + s.dx * (1 - 0.6 * k), y, r: s.r * (0.4 + 0.6 * (1 - k)) + (struck ? Math.sin(lt * 30 + i) * (1 - P(lt, tS, tS + 0.4)) * 2 : 0), o: k > 0 ? 1 : 0 });
        s.el.style.filter = struck ? `grayscale(${0.7 * P(lt, tS, tS + 0.4)})` : 'none';
      });
      c1.setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, tS, tS + 0.22)));
      c2.setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, tS + 0.14, tS + 0.36)));
      tf(table, { o: P(lt, 0, 0.3) });
    };
  });

  // ---------------- s2: kertas terbang, stopwatch 10 detik ----------------
  KIT.registerType('m01_jam', (root, v, sc, tm, T) => {
    const t1 = T(v.lineAt, 0.4), tN = T(v.numAt, 2.2);
    const tx = textBlock(root, '…tapi yang bisa dipahami', 'direksi dalam <em>10 detik.</em>');
    tx.el.children[1].classList.remove('red');
    const CX = pick(1430, 540), CY = pick(540, 1040), R = pick(230, 240);
    const flyers = Array.from({ length: 8 }, (_, i) => {
      const el = h(sheetHtml(false));
      Object.assign(el.style, { width: pick(300, 300) + 'px', height: pick(380, 380) + 'px' });
      root.appendChild(el);
      const a = (i / 8) * Math.PI * 2 + 0.4;
      return { el, a, sp: 1400 + hash(i + 3) * 700, r: (hash(i * 2.2) - 0.5) * 540 };
    });
    const watch = h(`<div class="m1-watch" style="left:${CX - R - 30}px;top:${CY - R - 30}px;width:${2 * R + 60}px;height:${2 * R + 60}px">
      <svg width="${2 * R + 60}" height="${2 * R + 60}"><circle cx="${R + 30}" cy="${R + 30}" r="${R}" fill="#fff" stroke="#E3E8F2" stroke-width="16"/>
      <circle class="pr" cx="${R + 30}" cy="${R + 30}" r="${R}" fill="none" stroke="url(#m1g)" stroke-width="16" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 ${R + 30} ${R + 30})"/>
      <defs><linearGradient id="m1g" x1="0" x2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset="1" stop-color="#6D4CFF"/></linearGradient></defs>
      <rect x="${R + 30 - 22}" y="0" width="44" height="30" rx="8" fill="#0B1B4D"/></svg>
      <div class="num"><b>10</b><span>detik</span></div></div>`);
    root.appendChild(watch);
    const pr = watch.querySelector('.pr'), num = watch.querySelector('.num');
    return (lt, d) => {
      if (!V && !tx.el._y && tx.el.offsetHeight) tx.el._y = (SH - tx.el.offsetHeight) / 2;
      if (!V && tx.el._y) tx.el.style.top = tx.el._y + 'px';
      revealWords(tx.w1, t1, lt, { stagger: 0.06, dur: 0.55 });
      revealWords(tx.w2, t1 + 0.9, lt, { stagger: 0.06, dur: 0.55 });
      flyers.forEach((f) => {
        const k = P(lt, 0, 0.7), dist = f.sp * E.out3(k);
        tf(f.el, { x: CX - 150 + Math.cos(f.a) * dist, y: CY - 190 + Math.sin(f.a) * dist - 200 * k, r: f.r * k, o: 1 - k });
      });
      const kw = popK(lt, 0.35, 0.6);
      tf(watch, { s: kw, y: float(lt, 0, 5), o: cl(kw * 2) });
      pr.setAttribute('stroke-dashoffset', (100 * (1 - P(lt, tN - 0.3, d - 0.2))).toFixed(2));
      const kn = P(lt, tN - 0.05, tN + 0.25);
      tf(num, { s: lerp(1.6, 1, E.outExpo(kn)), o: kn > 0 ? 1 : 0.18 });
    };
  });
})();
