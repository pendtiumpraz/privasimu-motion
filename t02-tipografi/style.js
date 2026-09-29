// Gaya T02 · FULL TYPOGRAPHY: satu kanvas dunia berisi blok teks; kamera (pan + putar + zoom) berpindah antarblok
// mengikuti VO, kata muncul tepat saat diucapkan, grid latar ikut bergerak bersama kamera (digambar di kanvas bg).
// Kamera = fungsi murni dari waktu global → deterministik untuk render paralel.
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const LOGO = '../assets/privasimu_logo.png';
  // grid dunia per format (kolom × baris sel, jalur ular), blok ke-k menempati sel ke-k
  const G = V ? { cols: 2, rows: 6, cw: 1300, ch: 1250 } : { cols: 4, rows: 3, cw: 1400, ch: 1150 };
  const WW = G.cols * G.cw, WH = G.rows * G.ch;
  const cellPos = (k) => { const r = Math.floor(k / G.cols), c0 = k % G.cols, c = r % 2 ? G.cols - 1 - c0 : c0; return { x: (c + 0.5) * G.cw, y: (r + 0.5) * G.ch }; };
  const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

  let world = null;
  const BLOCKS = [];
  let ZO = null, CTA0 = null;

  function ensureWorld() {
    if (world) return;
    world = h(`<div id="ky-world" style="width:${WW}px;height:${WH}px"></div>`);
    $('#stage').insertBefore(world, $('#bg').nextSibling);
  }

  // pencocok kata VO berurutan dalam satu scene
  function matcher(sc) {
    const W = (sc.words || []).map((w) => ({ n: norm(w.w), t: sc.voStart + w.t }));
    let cur = 0, last = sc.voStart;
    return {
      next(word) {
        const n = norm(word);
        for (let j = cur; n && j < W.length; j++) {
          const m = W[j].n;
          if (m === n || (n.length > 2 && m.startsWith(n)) || (m.length > 2 && n.startsWith(m))) { cur = j + 1; last = W[j].t; return last; }
        }
        last += 0.1;
        return last;
      },
      seek(t) { while (cur < W.length && W[cur].t <= t + 1e-3) cur++; last = t; },
    };
  }

  // satu baris teks → elemen + daftar kata bertanda waktu (global)
  function buildLine(ln, M, sc, T) {
    const el = h(`<div class="ky-line ${ln.c || ''}"></div>`);
    const words = ln.t.split(' ');
    const at = ln.at != null ? sc.start + T(ln.at, 0) : null;
    if (at != null) M.seek(at);
    const ws = words.map((w, i) => {
      const letters = ln.fx === 'type' ? [...w].map((ch) => `<span class="ky-l">${esc(ch)}</span>`).join('') : esc(w);
      const we = h(`<span class="ky-w ${(ln.fx || 'up') === 'up' ? 'clip' : ''}"><span class="ky-i">${letters}</span></span>`);
      el.appendChild(we);
      const t = at != null ? at + i * 0.07 : M.next(w);
      return { el: we, i: $('.ky-i', we), letters: ln.fx === 'type' ? [...we.querySelectorAll('.ky-l')] : null, t, fx: ln.fx || 'up' };
    });
    const L = { el, ws, t0: ws[0].t, t1: ws[ws.length - 1].t };
    if (/\byel\b/.test(ln.c || '')) { L.ul = h('<i class="ky-ul"></i>'); el.appendChild(L.ul); }
    if (ln.strike) { L.strike = h('<i class="ky-strike"></i>'); el.appendChild(L.strike); L.tStrike = sc.start + T(ln.strike, 0); }
    if (ln.check) { L.check = h('<svg class="ky-check" viewBox="0 0 100 100"><path pathLength="1" d="M10 55 L40 84 L92 16"/></svg>'); el.appendChild(L.check); }
    return L;
  }

  function wordState(w, t) {
    const u = t - w.t;
    if (u < 0) { w.el.style.opacity = 0; return; }
    w.el.style.opacity = 1;
    if (w.fx === 'up') { const k = E.out3(P(u, 0, 0.3)); w.i.style.transform = `translateY(${((1 - k) * 105).toFixed(1)}%)`; }
    else if (w.fx === 'pop') { const k = P(u, 0, 0.32); w.i.style.transform = `scale(${E.outBack(k).toFixed(3)})`; }
    else if (w.fx === 'slam') { const k = E.outExpo(P(u, 0, 0.2)); w.i.style.transform = `scale(${lerp(2.6, 1, k).toFixed(3)})`; w.el.style.opacity = P(u, 0, 0.04); }
    else if (w.fx === 'stretch') {
      const k = E.out3(P(u, 0, 0.45));
      w.i.style.fontStretch = lerp(125, 100, k).toFixed(1) + '%'; w.i.style.fontWeight = Math.round(lerp(250, 900, k));
      w.i.style.transform = `translateY(${((1 - E.out3(P(u, 0, 0.2))) * 60).toFixed(1)}%)`;
    } else if (w.fx === 'type') w.letters.forEach((l, j) => { l.style.opacity = u >= j * 0.035 ? 1 : 0; });
    else w.el.style.opacity = P(u, 0, 0.3);
  }

  // ---------- kamera ----------
  // Keyframe per baris: kamera membingkai baris-baris yang sudah muncul (zoom mengecil saat blok makin penuh), pindah
  // antarblok dengan pan + putar + sedikit zoom-out. Tiap transisi mulai dari posisi kamera yang sebenarnya (tanpa lompatan).
  let KF = null;
  const FULL = () => ({ x: WW / 2, y: WH / 2, r: 0, z: Math.min(SW * 0.92 / WW, SH * 0.9 / WH) });
  function mix(a, b, p, dip = 0) {
    let r1 = b.r; while (r1 - a.r > 180) r1 -= 360; while (r1 - a.r < -180) r1 += 360;
    return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), r: lerp(a.r, r1, p), z: lerp(a.z, b.z, p) * (1 - dip * Math.sin(Math.PI * p)) };
  }
  function buildKF() {
    KF = [];
    for (const B of BLOCKS) {
      const bw = B.el.offsetWidth || 1, bh = B.el.offsetHeight || 1, zb = Math.min(SW * 0.84 / bw, SH * 0.72 / bh, 1.35);
      const rad = (B.rot * Math.PI) / 180;
      B.lines.forEach((L, j) => {
        L.cy = L.el.offsetTop + L.el.offsetHeight / 2 - bh / 2; L.hh = L.el.offsetHeight; L.ww = L.el.offsetWidth;
        const shown = B.lines.slice(0, j + 1), top = Math.min(...shown.map((x) => x.cy - x.hh / 2)), bot = Math.max(...shown.map((x) => x.cy + x.hh / 2));
        const wmax = Math.max(...shown.map((x) => x.ww)), cy = (top + bot) / 2;
        const z = Math.min(SW * 0.84 / wmax, SH * 0.66 / (bot - top), zb * 1.45, 1.6);
        const c = { x: B.x - cy * Math.sin(rad), y: B.y + cy * Math.cos(rad), r: B.rot, z };
        const first = j === 0, a = first ? (KF.length ? B.ma : -1) : L.t0 - 0.1, b = first ? (KF.length ? B.mb : -1) : L.t0 + 0.3;
        KF.push({ c, a, b, dip: first ? 0.2 : 0, blk: B });
      });
    }
    // posisi awal tiap transisi = keadaan kamera sebenarnya saat transisi dimulai
    KF.forEach((k, i) => {
      if (!i) { k.from = k.c; return; }
      const pv = KF[i - 1];
      k.from = k.a < pv.b ? mix(pv.from, pv.c, E.io3(P(k.a, pv.a, pv.b)), pv.dip) : pv.c;
    });
  }
  function camera(t) {
    if (!KF) buildKF();
    let i = 0;
    for (let j = 0; j < KF.length; j++) if (t >= KF[j].a) i = j;
    const k = KF[i];
    let c = t < k.b ? mix(k.from, k.c, E.io3(P(t, k.a, k.b)), k.dip) : { ...k.c };
    if (ZO != null && t >= ZO) c = mix(KF[KF.length - 1].c, FULL(), E.io3(P(t, ZO, ZO + 1.7)));
    return c;
  }
  function blockAlpha(B, t) { // blok aktif terang, blok lain redup (tampil semua saat kanvas diperlihatkan)
    if (ZO != null && t >= ZO) return lerp(0.28, 1, P(t, ZO, ZO + 0.8));
    const nxt = BLOCKS[BLOCKS.indexOf(B) + 1];
    if (t < B.ma) return 1;
    if (nxt && t >= nxt.ma) return lerp(1, 0.28, P(t, nxt.ma, nxt.mb));
    return 1;
  }
  const camCss = (c) => `translate(${SW / 2}px, ${SH / 2}px) rotate(${(-c.r).toFixed(3)}deg) scale(${c.z.toFixed(5)}) translate(${(-c.x).toFixed(2)}px, ${(-c.y).toFixed(2)}px)`;

  function renderWorld(t) {
    const c = camera(t);
    world.style.transform = camCss(c);
    world.style.opacity = CTA0 != null ? lerp(1, 0.1, E.io3(P(t, CTA0 - 0.1, CTA0 + 0.7))) : 1;
    for (const B of BLOCKS) {
      if (t < B.t0 - 0.05) { B.el.style.visibility = 'hidden'; continue; }
      B.el.style.visibility = 'visible';
      B.el.style.opacity = blockAlpha(B, t).toFixed(3);
      for (const L of B.lines) {
        L.ws.forEach((w) => wordState(w, t));
        if (L.ul) L.ul.style.transform = `scaleX(${E.out3(P(t, L.t1 + 0.05, L.t1 + 0.4)).toFixed(3)})`;
        if (L.strike) { const k = E.out3(P(t, L.tStrike, L.tStrike + 0.3)); L.strike.style.transform = `scaleX(${k.toFixed(3)})`; L.el.style.opacity = lerp(1, 0.55, k); }
        if (L.check) L.check.querySelector('path').style.strokeDashoffset = (1 - E.out3(P(t, L.t1 + 0.12, L.t1 + 0.45))).toFixed(3);
      }
    }
  }

  // ---------- latar: navy + grid dunia yang ikut kamera ----------
  KIT.style({
    fonts: ['900 100px Archivo', '600 100px Archivo', '400 100px "Instrument Serif"', 'italic 400 100px "Instrument Serif"'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      g.addColorStop(0, '#15224F'); g.addColorStop(1, '#070C22');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      if (!BLOCKS.length) return;
      const c = camera(t);
      cx.save();
      cx.translate(W / 2, H / 2); cx.rotate((-c.r * Math.PI) / 180); cx.scale(c.z, c.z); cx.translate(-c.x, -c.y);
      const reach = Math.hypot(W, H) / c.z / 2 + 200, x0 = c.x - reach, x1 = c.x + reach, y0 = c.y - reach, y1 = c.y + reach;
      for (const [step, a, lw] of [[100, 0.035, 1.5], [500, 0.085, 3]]) {
        if (step * c.z < 6) continue;
        cx.strokeStyle = `rgba(160,185,255,${a})`; cx.lineWidth = lw / Math.max(c.z, 0.2);
        cx.beginPath();
        for (let x = Math.floor(x0 / step) * step; x <= x1; x += step) { cx.moveTo(x, y0); cx.lineTo(x, y1); }
        for (let y = Math.floor(y0 / step) * step; y <= y1; y += step) { cx.moveTo(x0, y); cx.lineTo(x1, y); }
        cx.stroke();
      }
      cx.restore();
    },
  });

  // ---------- tipe scene ----------
  KIT.registerType('ky', (root, v, sc, tm, T) => {
    ensureWorld();
    const M = matcher(sc);
    for (const b of v.blocks) {
      const k = BLOCKS.length, pos = cellPos(k);
      const el = h(`<div class="ky-block" style="left:${pos.x}px;top:${pos.y}px;transform:translate(-50%,-50%) rotate(${b.rot || 0}deg)"></div>`);
      world.appendChild(el);
      const lines = b.lines.map((ln) => { const L = buildLine(ln, M, sc, T); el.appendChild(L.el); return L; });
      const t0 = Math.min(...lines.map((L) => L.t0)), t1 = Math.max(...lines.map((L) => L.t1));
      const prev = BLOCKS[k - 1];
      const mb = t0 + 0.02, dur = prev ? cl(t0 - prev.t1 - 0.15, 0.28, 0.65) : 0;
      BLOCKS.push({ el, x: pos.x, y: pos.y, rot: b.rot || 0, lines, t0, t1, ma: k ? mb - dur : -1, mb: k ? mb : -1 });
    }
    if (v.zoomOut) ZO = sc.start + T(v.zoomOut, 1);
    return (lt) => renderWorld(sc.start + lt);
  });

  KIT.registerType('ky_cta', (root, v, sc, tm, T) => {
    ensureWorld();
    CTA0 = sc.start;
    const M = matcher(sc);
    const box = h('<div class="ky-cta"></div>');
    root.appendChild(box);
    const l1 = buildLine({ t: 'Siap diperiksa', c: 'xl' }, M, sc, T), l2 = buildLine({ t: 'kapan saja.', c: 'xl serif yel' }, M, sc, T);
    box.appendChild(l1.el); box.appendChild(l2.el);
    const rest = h(`<div class="ky-cta2"><div class="logo"><img src="${LOGO}" alt=""><div class="nx">NEXUS</div></div>
      <div class="pill">Cek kesiapan · <b>GRATIS</b></div><div class="url">${[...'privasimu.com'].map((ch) => `<span>${ch}</span>`).join('')}</div>
      <div class="foot">support@privasimu.com · 0851 8318 2722</div></div>`);
    box.appendChild(rest);
    const logo = $('.logo', rest), pill = $('.pill', rest), url = $('.url', rest), foot = $('.foot', rest), letters = [...url.children];
    const tL = T(v.logoAt, 2.2), tP = T(v.pillAt, 3), tU = T(v.urlAt, 4.2);
    const fade = h('<div class="ky-fade"></div>');
    root.appendChild(fade);
    return (lt, d) => {
      const t = sc.start + lt;
      renderWorld(t);
      for (const L of [l1, l2]) { L.ws.forEach((w) => wordState(w, t)); if (L.ul) L.ul.style.transform = `scaleX(${E.out3(P(t, L.t1 + 0.05, L.t1 + 0.4)).toFixed(3)})`; }
      const kl = E.out3(P(lt, tL - 0.1, tL + 0.35));
      tf(logo, { y: (1 - kl) * 30, o: kl });
      tf(pill, { s: E.outBack(P(lt, tP, tP + 0.35)), o: P(lt, tP, tP + 0.1) });
      letters.forEach((l, j) => { l.style.opacity = lt >= tU + j * 0.03 ? 1 : 0; });
      tf(foot, { o: P(lt, tU + 0.6, tU + 1) });
      fade.style.opacity = P(lt, d - 0.45, d - 0.02);
    };
  });
})();
