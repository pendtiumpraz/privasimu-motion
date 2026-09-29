// N10 · Satu Grup Satu Standar — gaya "blueprint arsitektural".
// Kertas cetak-biru (#0E3A7A → #0A2A5C) + grid putih halus, garis putih yang "digambar" (stroke draw), bangunan isometrik
// ber-arsir, garis dimensi & anotasi (IBM Plex Mono / Sans), cap STANDAR GRUP, silo data. Tampilan produk = screenshot ASLI
// yang ditempel sebagai "lembar cetak". Kamera: dolly pelan + pan antar-detail di atas satu lembar besar (grid ikut bergerak).
// Deterministik: semua dari waktu (lt/t). Tanpa CSS animation/transition, Math.random, Date, setTimeout.
(function () {
  const { P, cl, lerp, E, hash } = MG;
  const { V, SW, SH, pick } = KIT;
  const NS = 'http://www.w3.org/2000/svg';
  const AMB = '#FFD27A';
  const SUBS = (window.PRV && window.PRV.SUBS) || [];
  const sine = (k) => .5 - .5 * Math.cos(Math.PI * k);

  /* =============================== util SVG =============================== */
  function S(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    if (a) for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const r1 = (n) => Math.round(n * 10) / 10;
  const D = (pts, close) => 'M' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + (close ? 'Z' : '');
  const rectD = (x, y, w, h) => `M${r1(x)} ${r1(y)}H${r1(x + w)}V${r1(y + h)}H${r1(x)}Z`;
  function layer(root) {
    const s = S('svg', { class: 'bp-svg', width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}` });
    root.appendChild(s);
    return s;
  }
  // Teks SVG yang bisa "diketik": sisa teks tetap memakan tempat (tspan transparan) → rata tengah/kanan tidak bergeser.
  function TX(parent, x, y, str, cls, anchor) {
    const t = S('text', { x: r1(x), y: r1(y), class: cls || '', 'text-anchor': anchor || 'start' }, parent);
    t._a = S('tspan', null, t); t._b = S('tspan', { class: 'ghost' }, t);
    t._s = String(str); t._n = -1; setN(t, t._s.length);
    return t;
  }
  function setN(t, n) {
    n = cl(Math.floor(n), 0, t._s.length);
    if (n === t._n) return;
    t._n = n; t._a.textContent = t._s.slice(0, n); t._b.textContent = t._s.slice(n);
  }
  function setText(t, s) { t._s = String(s); t._n = -1; setN(t, t._s.length); }

  // Penjadwal animasi per scene
  function Tl() {
    const fns = [];
    const tl = {
      add(f) { fns.push(f); return tl; },
      // garis "digambar": pathLength=1 + dasharray, offset 1 → 0
      draw(e, t0, dur = .6, ease = E.io3) {
        e.setAttribute('pathLength', '1');
        e.style.strokeDasharray = '1 1';
        fns.push((lt) => {
          const k = ease(P(lt, t0, t0 + dur));
          e.style.strokeDashoffset = (1 - k).toFixed(4);
          e.style.visibility = k > .002 ? 'visible' : 'hidden';
        });
        return e;
      },
      fade(e, t0, dur = .4, max = 1, ease = E.out3) {
        fns.push((lt) => { e.style.opacity = (max * ease(P(lt, t0, t0 + dur))).toFixed(3); });
        return e;
      },
      type(t, t0, cps = 36) {
        fns.push((lt) => { setN(t, (lt - t0) * cps); t.style.visibility = lt >= t0 ? 'visible' : 'hidden'; });
        return t;
      },
      run(lt, d) { for (let i = 0; i < fns.length; i++) fns[i](lt, d); },
    };
    return tl;
  }

  // Garis putus-putus / titik-strip yang "digambar": dash asli tetap, dibuka lewat mask berjalan
  let MID = 0;
  function drawMasked(tl, defs, el, t0, dur, ease = E.io3, w = 10) {
    const id = 'bpm' + (MID++);
    const m = S('mask', { id, maskUnits: 'userSpaceOnUse', x: -SW, y: -SH, width: SW * 3, height: SH * 3 }, defs);
    const c = S('path', { d: el.getAttribute('d'), fill: 'none', stroke: '#fff', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, m);
    el.setAttribute('mask', `url(#${id})`);
    tl.draw(c, t0, dur, ease);
    return el;
  }

  // Pola arsir (bahan gambar teknik), ruang layar
  function hatch(defs, id, kind, col, sw = 1.3, gap = 8) {
    const p = S('pattern', { id, patternUnits: 'userSpaceOnUse', width: gap, height: gap }, defs);
    const L = (x1, y1, x2, y2) => S('line', { x1, y1, x2, y2, stroke: col, 'stroke-width': sw }, p);
    const h2 = gap / 2;
    switch (kind) {
      case 'd45': p.setAttribute('patternTransform', 'rotate(45)'); L(h2, 0, h2, gap); break;
      case 'd135': p.setAttribute('patternTransform', 'rotate(-45)'); L(h2, 0, h2, gap); break;
      case 'cross': p.setAttribute('patternTransform', 'rotate(45)'); L(h2, 0, h2, gap); L(0, h2, gap, h2); break;
      case 'hor': L(0, h2, gap, h2); break;
      case 'ver': L(h2, 0, h2, gap); break;
      case 'grid': L(0, h2, gap, h2); L(h2, 0, h2, gap); break;
      case 'dots': S('circle', { cx: h2, cy: h2, r: sw * 1.05, fill: col }, p); break;
      case 'ring': p.setAttribute('width', gap * 1.5); p.setAttribute('height', gap * 1.5); S('circle', { cx: gap * .75, cy: gap * .75, r: gap * .42, fill: 'none', stroke: col, 'stroke-width': sw * .9 }, p); break;
      case 'iso': p.setAttribute('patternTransform', 'rotate(26.565)'); L(0, h2, gap, h2); break;
      case 'isoL': p.setAttribute('patternTransform', 'rotate(-26.565)'); L(0, h2, gap, h2); break;
      case 'brick': p.setAttribute('width', gap * 2); L(0, gap * .25, gap * 2, gap * .25); L(0, gap * .75, gap * 2, gap * .75); L(gap * .5, 0, gap * .5, gap * .25); L(gap * 1.5, gap * .25, gap * 1.5, gap * .75); L(gap * .5, gap * .75, gap * .5, gap); break;
      case 'zig': p.setAttribute('width', gap * 1.2); S('path', { d: `M0 ${gap * .72}L${gap * .3} ${gap * .28}L${gap * .6} ${gap * .72}L${gap * .9} ${gap * .28}L${gap * 1.2} ${gap * .72}`, fill: 'none', stroke: col, 'stroke-width': sw }, p); break;
      default: L(h2, 0, h2, gap);
    }
    return `url(#${id})`;
  }

  // Blok judul gambar (gelembung detail: nomor / N10) + judul + subjudul
  function title(svg, tl, o, t0) {
    if (!o) return;
    const x = pick(92, 70), y = pick(58, 204), r = pick(29, 34), cx = x + r, cy = y + r;
    const g = S('g', null, svg);
    tl.draw(S('circle', { cx, cy, r, class: 'bp-e', transform: `rotate(-90 ${cx} ${cy})` }, g), t0, .6, E.io3);
    tl.draw(S('path', { d: `M${cx - r} ${cy}H${cx + r}`, class: 'bp-e2' }, g), t0 + .25, .3, E.out3);
    tl.fade(TX(g, cx, cy - pick(7, 8), o.no, 'bp-tn', 'middle'), t0 + .2, .35);
    tl.fade(TX(g, cx, cy + pick(19, 22), 'N10', 'bp-tsh', 'middle'), t0 + .3, .35);
    tl.draw(S('path', { d: `M${cx + r + 10} ${cy}H${cx + r + 10 + pick(560, 600)}`, class: 'bp-e2' }, g), t0 + .3, .8, E.out3);
    tl.type(TX(g, cx + r + 24, cy - pick(12, 14), o.text, 'bp-tt'), t0 + .3, 30);
    if (o.sub) tl.type(TX(g, cx + r + 24, cy + pick(25, 31), o.sub, 'bp-ts'), t0 + .55, 50);
    return g;
  }

  // Garis dimensi horizontal (garis dari tengah ke ujung, garis bantu, tanda miring, label di atas)
  function dimH(g, tl, x1, x2, y, label, t0, o = {}) {
    const xm = (x1 + x2) / 2, ext = o.ext ?? 14, amb = o.amb ? ' bp-amb' : '';
    tl.draw(S('path', { d: `M${r1(xm)} ${r1(y)}H${r1(x1)}`, class: 'bp-e2' + amb }, g), t0, .55, E.out3);
    tl.draw(S('path', { d: `M${r1(xm)} ${r1(y)}H${r1(x2)}`, class: 'bp-e2' + amb }, g), t0, .55, E.out3);
    [x1, x2].forEach((x) => {
      tl.draw(S('path', { d: `M${r1(x)} ${r1(y - ext)}V${r1(y + ext)}`, class: 'bp-e2' + amb }, g), t0 + .35, .2);
      tl.draw(S('path', { d: `M${r1(x - 7)} ${r1(y + 7)}L${r1(x + 7)} ${r1(y - 7)}`, class: 'bp-e' + amb }, g), t0 + .45, .15);
    });
    if (label) return tl.type(TX(g, xm, y - pick(12, 14), label, o.cls || 'bp-a2', 'middle'), t0 + .3, o.cps || 44);
  }

  // Keterangan dengan garis penunjuk (leader): titik jangkar → siku → garis bawah label
  function callout(g, tl, o) {
    const left = o.side === 'l', ex = o.ex ?? (o.ax + (left ? -1 : 1) * 34);
    const dot = S('circle', { cx: r1(o.ax), cy: r1(o.ay), r: pick(4.5, 5.5), class: 'bp-dot' }, g);
    if (o.amb) dot.style.fill = AMB;
    tl.fade(dot, o.t0, .2);
    tl.draw(S('path', { d: D([[o.ax, o.ay], [ex, o.ly], [o.lx, o.ly]]), class: 'bp-e2' + (o.amb ? ' bp-amb' : '') }, g), o.t0 + .05, .45, E.out3);
    const an = left ? 'start' : 'end';
    let top = null;
    if (o.code) {
      top = TX(g, o.lx, o.ly - pick(36, 44), o.code, 'bp-a2', an);
      if (o.codeCol) top.style.fill = o.codeCol;
      tl.type(top, o.t0 + .3, 50);
    }
    const main = TX(g, o.lx, o.ly - pick(10, 12), o.text, o.cls || 'bp-a', an);
    if (o.amb) main.style.fill = AMB;
    tl.type(main, o.t0 + .38, o.cps || 42);
    return { dot, top, main };
  }

  // Kotak isometrik: garis dasar → rusuk tegak → atap, lalu lantai/mullion, latar pekat & arsir muka
  function isoBox(g, pr, tl, o) {
    const { x, y, w, d, h } = o, z0 = o.z0 || 0, z1 = z0 + h, sp = o.speed || 1, t0 = o.t0;
    const A0 = pr(x, y, z0), B0 = pr(x + w, y, z0), C0 = pr(x + w, y + d, z0), D0 = pr(x, y + d, z0);
    const A1 = pr(x, y, z1), B1 = pr(x + w, y, z1), C1 = pr(x + w, y + d, z1), D1 = pr(x, y + d, z1);
    const bb = S('g', null, g);
    if (!o.noBack) tl.fade(S('path', { d: D([B0, C0, D0, D1, A1, B1], true), class: 'bp-back' }, bb), t0 + .3 * sp, .35);
    const faces = [];
    if (o.fR) faces.push(tl.fade(S('path', { d: D([B0, C0, C1, B1], true), fill: o.fR, class: 'bp-face' }, bb), o.hatchT, .6, o.opR ?? .9));
    if (o.fL) faces.push(tl.fade(S('path', { d: D([D0, C0, C1, D1], true), fill: o.fL, class: 'bp-face' }, bb), o.hatchT + .08, .6, o.opL ?? .55));
    if (o.fT) faces.push(tl.fade(S('path', { d: D([A1, B1, C1, D1], true), fill: o.fT, class: 'bp-face' }, bb), o.hatchT + .12, .6, o.opT ?? .16));
    for (let k = 1; k < (o.floors || 1); k++) {
      const z = z0 + h * k / o.floors;
      tl.draw(S('path', { d: D([pr(x, y + d, z), pr(x + w, y + d, z), pr(x + w, y, z)]), class: 'bp-e3' }, bb), t0 + (.3 + k * .012) * sp, .3 * sp, E.out3);
    }
    for (let k = 1; k < (o.mull || 1); k++) {
      const yy = y + d * k / o.mull, xx = x + w * k / o.mull;
      tl.draw(S('path', { d: D([pr(x + w, yy, z0), pr(x + w, yy, z1)]), class: 'bp-e3' }, bb), t0 + (.28 + k * .03) * sp, .3 * sp, E.out3);
      tl.draw(S('path', { d: D([pr(xx, y + d, z0), pr(xx, y + d, z1)]), class: 'bp-e3' }, bb), t0 + (.28 + k * .03) * sp, .3 * sp, E.out3);
    }
    tl.draw(S('path', { d: D([D0, C0, B0]), class: 'bp-e' }, bb), t0, .28 * sp, E.out3);
    [[B0, B1], [C0, C1], [D0, D1]].forEach(([a, b], k) => tl.draw(S('path', { d: D([a, b]), class: 'bp-e' }, bb), t0 + (.1 + k * .04) * sp, .3 * sp, E.out3));
    tl.draw(S('path', { d: D([A1, B1, C1, D1], true), class: 'bp-e' }, bb), t0 + .3 * sp, .36 * sp, E.io3);
    return { g: bb, faces, top: [A1, B1, C1, D1] };
  }

  // Ikon garis: gembok (belenggu bisa naik/turun) & kunci
  function lockIcon(g, x, y, size) {
    const s = size / 24, gg = S('g', { transform: `translate(${r1(x - 12 * s)} ${r1(y - 12 * s)}) scale(${s.toFixed(3)})` }, g);
    S('rect', { x: 5, y: 11, width: 14, height: 10, rx: 2, class: 'bp-ic' }, gg);
    const sh = S('path', { d: 'M8 11V7.5a4 4 0 0 1 8 0V11', class: 'bp-ic' }, gg);
    S('path', { d: 'M12 15v2.2', class: 'bp-ic' }, gg);
    return { g: gg, sh };
  }
  function keyIcon(g, x, y, size) {
    const s = size / 24, gg = S('g', { transform: `translate(${r1(x - 12 * s)} ${r1(y - 12 * s)}) scale(${s.toFixed(3)})` }, g);
    S('circle', { cx: 7.5, cy: 15.5, r: 4.2, class: 'bp-ic' }, gg);
    S('path', { d: 'M10.6 12.4L20.5 2.5M16.5 6.5l3 3M13.8 9.2l2 2', class: 'bp-ic' }, gg);
    return gg;
  }

  // Lembar dokumen (outline + telinga lipat + pita arsir + baris teks), koordinat lokal berpusat
  function docShape(g, w, h, o = {}) {
    const x0 = -w / 2, y0 = -h / 2, f = Math.round(w * .16);
    const d = `M${r1(x0)} ${r1(y0)}H${r1(x0 + w - f)}L${r1(x0 + w)} ${r1(y0 + f)}V${r1(y0 + h)}H${r1(x0)}Z`;
    const back = S('path', { d, class: 'bp-back' }, g);
    const band = o.band ? S('rect', { x: r1(x0 + 12), y: r1(y0 + 14), width: r1(w - 24 - f * .8), height: r1(h * .11), fill: o.band, class: 'bp-face' }, g) : null;
    const lines = [.92, .76, .86, .58, .82, .66, .5].slice(0, o.nl || 6)
      .map((q, k) => S('path', { d: `M${r1(x0 + 12)} ${r1(y0 + h * .33 + k * h * .09)}h${r1((w - 24) * q)}`, class: 'bp-e3' }, g));
    const outline = S('path', { d, class: 'bp-e' }, g);
    const ear = S('path', { d: `M${r1(x0 + w - f)} ${r1(y0)}V${r1(y0 + f)}H${r1(x0 + w)}`, class: 'bp-e2' }, g);
    return { back, band, lines, outline, ear };
  }

  // Cap "STANDAR GRUP" (bingkai ganda, tinta amber)
  function makeStamp(parent, text, sub) {
    const g = S('g', null, parent), w = pick(282, 300), h = pick(86, 92);
    S('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 7, fill: 'rgba(255,210,122,.1)', stroke: AMB, 'stroke-width': 3.4 }, g);
    S('rect', { x: -w / 2 + 7, y: -h / 2 + 7, width: w - 14, height: h - 14, rx: 3, fill: 'none', stroke: AMB, 'stroke-width': 1.3 }, g);
    if (sub) TX(g, 0, -h / 2 + pick(23, 24), sub, 'bp-stamp2', 'middle');
    TX(g, 0, pick(21, 23), text, 'bp-stamp', 'middle');
    return g;
  }

  // Lembar cetak screenshot ASLI (HTML <img>, dipotong via CSS). Skala ≤ 1,4× agar tetap tajam.
  function makePrint(root, o) {
    const [sx, sy, sw, sh] = o.crop || [0, 0, o.iw, o.ih], s = o.scale, pad = o.pad ?? pick(9, 10);
    const w = sw * s, h = sh * s;
    const el = KIT.h(`<div class="bp-print"><div class="bp-crop"><img src="${o.src}" alt=""></div><div class="scan"></div></div>`);
    Object.assign(el.style, { left: r1(o.x - pad) + 'px', top: r1(o.y - pad) + 'px', padding: pad + 'px' });
    const crop = el.firstChild, img = crop.firstChild;
    Object.assign(crop.style, { width: r1(w) + 'px', height: r1(h) + 'px' });
    Object.assign(img.style, { width: r1(o.iw * s) + 'px', height: r1(o.ih * s) + 'px', left: r1(-sx * s) + 'px', top: r1(-sy * s) + 'px' });
    root.appendChild(el);
    const pr = { el, crop, img, scan: el.lastChild, x: o.x, y: o.y, w, h, pad, s, sx, sy };
    pr.at = (ix, iy) => [o.x + (ix - sx) * s, o.y + (iy - sy) * s]; // piksel gambar → layar (posisi diam)
    // "dicetak": pindai atas→bawah + warna berkembang dari pucat
    pr.reveal = (k, k2) => {
      el.style.clipPath = k >= 1 ? 'none' : `inset(0 0 ${((1 - k) * 100).toFixed(2)}% 0)`;
      el.style.visibility = k > 0 ? 'visible' : 'hidden';
      pr.scan.style.opacity = k > 0 && k < 1 ? 1 : 0;
      pr.scan.style.top = r1(k * (h + 2 * pad) - 2) + 'px';
      crop.style.filter = k2 >= 1 ? 'none' : `grayscale(${(1 - k2).toFixed(2)}) brightness(${(1 + .35 * (1 - k2)).toFixed(2)}) contrast(${(1 - .25 * (1 - k2)).toFixed(2)})`;
    };
    return pr;
  }
  // tanda sudut (registrasi) di sekeliling lembar cetak
  function cornerMarks(g, tl, x, y, w, h, t0, L = 22, gap = 14) {
    const c = [[x - gap, y - gap, 1, 1], [x + w + gap, y - gap, -1, 1], [x + w + gap, y + h + gap, -1, -1], [x - gap, y + h + gap, 1, -1]];
    c.forEach(([cx, cy, dx, dy], k) => tl.draw(S('path', { d: `M${r1(cx)} ${r1(cy + dy * L)}V${r1(cy)}H${r1(cx + dx * L)}`, class: 'bp-e2' }, g), t0 + k * .05, .3, E.out3));
  }

  /* =============================== latar & kamera =============================== */
  // Tiap scene = satu "detail" di lembar besar. Pergantian scene = kamera pan (grid ikut bergerak) + tarik mundur sedikit.
  const PAN = pick([[1560, 0], [1560, 0], [1560, 0], [1560, 0]], [[0, 1480], [0, 1480], [0, 1480], [0, 1480]]);
  const TA = .55, TB = .6, PUSH = .024, PULL = .045;
  let SCN = null;
  const scenesTL = () => SCN || (SCN = window.TIMELINE.scenes);
  function idxAt(t) { const sc = scenesTL(); let i = 0; for (let j = 1; j < sc.length; j++) if (t >= sc[j].start) i = j; return i; }
  const dollyOf = (i) => { const sc = window.PRV && window.PRV.SCENES[i]; return (sc && sc.vis && sc.vis.dolly) ?? PUSH; };
  function base(t) { const i = idxAt(t), s = scenesTL()[i]; return 1 + dollyOf(i) * P(t - s.start, 0, s.dur); }
  function cam(t) {
    const sc = scenesTL();
    let x = 0, y = 0, s = base(t), mot = 0;
    for (let j = 1; j < sc.length; j++) {
      const tc = sc[j].start, k = P(t, tc - TA, tc + TB);
      if (k <= 0) break;
      const e = E.io3(k), dv = PAN[(j - 1) % PAN.length];
      x += dv[0] * e; y += dv[1] * e;
      if (k < 1) { s = lerp(base(tc - TA), base(tc + TB), e) * (1 - PULL * Math.sin(Math.PI * k)); mot = Math.sin(Math.PI * k); }
    }
    x += 12 * Math.sin(t * .27); y += 7 * Math.sin(t * .2 + 1.2);
    return { x, y, s, mot };
  }
  function origin(i) { let x = 0, y = 0; for (let j = 0; j < i; j++) { x += PAN[j % PAN.length][0]; y += PAN[j % PAN.length][1]; } return [x, y]; }

  function gridLines(cx, c, step, col) {
    const s = c.s, mx = SW / 2, my = SH / 2;
    const X0 = (0 - mx) / s + c.x + mx, X1 = (SW - mx) / s + c.x + mx, Y0 = (0 - my) / s + c.y + my, Y1 = (SH - my) / s + c.y + my;
    cx.strokeStyle = col; cx.lineWidth = 1; cx.beginPath();
    for (let X = Math.ceil(X0 / step) * step; X <= X1; X += step) { const sx = mx + s * (X - c.x - mx); cx.moveTo(sx, 0); cx.lineTo(sx, SH); }
    for (let Y = Math.ceil(Y0 / step) * step; Y <= Y1; Y += step) { const sy = my + s * (Y - c.y - my); cx.moveTo(0, sy); cx.lineTo(SW, sy); }
    cx.stroke();
  }
  function paper(cx, c) {
    const g = cx.createLinearGradient(0, 0, SW * .35, SH);
    g.addColorStop(0, '#10418A'); g.addColorStop(.5, '#0E3A7A'); g.addColorStop(1, '#0A2A5C');
    cx.fillStyle = g; cx.fillRect(0, 0, SW, SH);
    const rg = cx.createRadialGradient(SW * .5, SH * .4, 0, SW * .5, SH * .4, Math.max(SW, SH) * .65);
    rg.addColorStop(0, 'rgba(120,170,255,.10)'); rg.addColorStop(1, 'rgba(120,170,255,0)');
    cx.fillStyle = rg; cx.fillRect(0, 0, SW, SH);
    gridLines(cx, c, 30, 'rgba(255,255,255,.05)');
    gridLines(cx, c, 150, 'rgba(255,255,255,.11)');
  }
  // bingkai lembar gambar dengan pita zona (1..8 / A..D) — tetap di layar
  function sheetBorder(cx) {
    const o = 22, i = 44, W = SW, H = SH;
    cx.save();
    cx.strokeStyle = 'rgba(255,255,255,.30)'; cx.lineWidth = 1.5; cx.strokeRect(o + .5, o + .5, W - 2 * o - 1, H - 2 * o - 1);
    cx.strokeStyle = 'rgba(255,255,255,.14)'; cx.lineWidth = 1; cx.strokeRect(i + .5, i + .5, W - 2 * i - 1, H - 2 * i - 1);
    const nx = V ? 4 : 8, ny = V ? 8 : 4;
    cx.beginPath();
    for (let k = 1; k < nx; k++) { const x = Math.round(i + (W - 2 * i) * k / nx) + .5; cx.moveTo(x, o); cx.lineTo(x, i); cx.moveTo(x, H - i); cx.lineTo(x, H - o); }
    for (let k = 1; k < ny; k++) { const y = Math.round(i + (H - 2 * i) * k / ny) + .5; cx.moveTo(o, y); cx.lineTo(i, y); cx.moveTo(W - i, y); cx.lineTo(W - o, y); }
    cx.strokeStyle = 'rgba(255,255,255,.22)'; cx.stroke();
    cx.fillStyle = 'rgba(255,255,255,.36)'; cx.font = '500 11px "IBM Plex Mono"'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    for (let k = 0; k < nx; k++) { const x = i + (W - 2 * i) * (k + .5) / nx; cx.fillText(String(k + 1), x, (o + i) / 2); cx.fillText(String(k + 1), x, H - (o + i) / 2); }
    for (let k = 0; k < ny; k++) { const y = i + (H - 2 * i) * (k + .5) / ny, L = 'ABCDEFGH'[k]; cx.fillText(L, (o + i) / 2, y); cx.fillText(L, W - (o + i) / 2, y); }
    cx.restore();
  }
  // Pembukaan: lembar cetak-biru terlipat dibuka (lipatan kiri/kanan lalu atas/bawah), bekas lipatan tertinggal
  const sheet = document.createElement('canvas');
  sheet.width = SW; sheet.height = SH;
  const shx = sheet.getContext('2d');
  function shade(cx, x, y, w, h, a) { if (a > .005 && w > .5 && h > .5) { cx.fillStyle = `rgba(2,8,24,${a.toFixed(3)})`; cx.fillRect(x, y, w, h); } }
  function backSide(cx, x, y, w, h, a) {
    if (w < .5 || h < .5) return;
    const g = cx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, '#2a5aa3'); g.addColorStop(1, '#1d4a90');
    cx.fillStyle = g; cx.fillRect(x, y, w, h);
    shade(cx, x, y, w, h, a);
  }
  function unfold(cx, lt) {
    const W = SW, H = SH;
    paper(shx, { x: 0, y: 0, s: 1 }); sheetBorder(shx);
    cx.fillStyle = '#030a17'; cx.fillRect(0, 0, W, H);
    const sp = cx.createRadialGradient(W / 2, H * .46, 0, W / 2, H * .46, Math.max(W, H) * .62);
    sp.addColorStop(0, 'rgba(40,86,160,.34)'); sp.addColorStop(1, 'rgba(0,0,0,0)');
    cx.fillStyle = sp; cx.fillRect(0, 0, W, H);
    const kin = E.out3(P(lt, -.14, .22));
    const kh = E.io3(P(lt, .16, .56)), kv = E.io3(P(lt, .48, .9));
    const ch = -Math.cos(Math.PI * kh), cv = -Math.cos(Math.PI * kv); // -1 = tertutup, 1 = terbuka
    const x0 = W / 4, x1 = W * .75, y0 = H / 4, y1 = H * .75, fw = W / 4, fh = H / 4;
    const L = x0 - (ch > 0 ? fw * ch : 0), R = x1 + (ch > 0 ? fw * ch : 0);
    const T0 = y0 - (cv > 0 ? fh * cv : 0), B0 = y1 + (cv > 0 ? fh * cv : 0);
    cx.save();
    cx.globalAlpha = kin;
    const sc = lerp(.93, 1, kin);
    cx.translate(W / 2, H / 2 + (1 - kin) * 26); cx.scale(sc, sc); cx.translate(-W / 2, -H / 2);
    cx.save(); cx.shadowColor = 'rgba(0,0,0,.6)'; cx.shadowBlur = 60; cx.shadowOffsetY = 22; cx.fillStyle = '#0b2e66'; cx.fillRect(L, T0, R - L, B0 - T0); cx.restore();
    cx.drawImage(sheet, x0, y0, W / 2, H / 2, x0, y0, W / 2, H / 2);
    if (cv > 0) {
      const hh = fh * cv, a = .5 * (1 - cv);
      cx.drawImage(sheet, 0, 0, W, fh, L, y0 - hh, R - L, hh); shade(cx, L, y0 - hh, R - L, hh, a);
      cx.drawImage(sheet, 0, y1, W, fh, L, y1, R - L, hh); shade(cx, L, y1, R - L, hh, a);
    }
    if (ch >= 0) {
      const ww = fw * ch, a = .5 * (1 - ch);
      cx.drawImage(sheet, 0, y0, fw, H / 2, x0 - ww, y0, ww, H / 2); shade(cx, x0 - ww, y0, ww, H / 2, a);
      cx.drawImage(sheet, x1, y0, fw, H / 2, x1, y0, ww, H / 2); shade(cx, x1, y0, ww, H / 2, a);
    } else {
      const ww = fw * -ch, a = .42 * (1 + ch);
      backSide(cx, x0, y0, ww, H / 2, a);
      backSide(cx, x1 - ww, y0, ww, H / 2, a);
      if (ww > fw * .96) { cx.fillStyle = 'rgba(2,8,24,.35)'; cx.fillRect(W / 2 - 1, y0, 2, H / 2); }
    }
    creaseLines(cx, { x: 0, y: 0, s: 1 }, .16 * P(lt, .3, .9), L, R, T0, B0);
    cx.restore();
  }
  function creaseLines(cx, c, a, L = 0, R = SW, T0 = 0, B0 = SH) {
    if (a <= .002) return;
    const mx = SW / 2, my = SH / 2, X = (v) => mx + c.s * (v - c.x - mx), Y = (v) => my + c.s * (v - c.y - my);
    cx.save();
    cx.lineWidth = 1.2;
    [[1, 'rgba(255,255,255,' + a + ')'], [-1, 'rgba(0,6,20,' + (a * 1.4) + ')']].forEach(([o, col]) => {
      cx.strokeStyle = col; cx.beginPath();
      [SW / 4, SW * .75].forEach((v) => { cx.moveTo(X(v) + o, Y(T0)); cx.lineTo(X(v) + o, Y(B0)); });
      [SH / 4, SH * .75].forEach((v) => { cx.moveTo(X(L), Y(v) + o); cx.lineTo(X(R), Y(v) + o); });
      cx.stroke();
    });
    cx.restore();
  }
  function bg(cx, t, id, theme, W, H, lt) {
    const sc = scenesTL(), first = id === sc[0].id;
    if (first && lt < .92) { unfold(cx, lt); return; }
    const c = cam(t);
    paper(cx, c);
    if (first || idxAt(t - TB) === 0) creaseLines(cx, c, .16 * (1 - P(t, 1.2, 5.2)));
    sheetBorder(cx);
  }
  // Kamera per scene: posisi dunia scene − posisi kamera, skala sekitar pusat layar; transisi = pan + fade + blur halus
  function frame(id, lt, d, sec) {
    const sc = scenesTL(), i = sc.findIndex((s) => s.id === id), t = sc[i].start + lt, c = cam(t), o = origin(i);
    sec.style.transform = `translate(${(c.s * (o[0] - c.x)).toFixed(2)}px, ${(c.s * (o[1] - c.y)).toFixed(2)}px) scale(${c.s.toFixed(5)})`;
    let op = 1;
    if (i > 0) op *= sine(P(lt, .03, TB * .92));
    if (i < sc.length - 1) op *= 1 - sine(P(lt, d - TA * .92, d - .03));
    sec.style.opacity = op.toFixed(3);
    const bl = 2.2 * c.mot;
    sec.style.filter = bl > .25 ? `blur(${bl.toFixed(2)}px)` : 'none';
  }

  KIT.style({
    fonts: ['400 20px "IBM Plex Sans"', '600 20px "IBM Plex Sans"', '400 20px "IBM Plex Mono"', '500 20px "IBM Plex Mono"', '600 20px "IBM Plex Mono"'],
    themes: { blueprint: ['#0E3A7A', '#0A2A5C', '#0A2A5C', 'rgba(255,255,255,.06)', 'rgba(255,255,255,.07)'] },
    bg,
    frame,
  });

  /* =============================== S1 · PETA GRUP =============================== */
  KIT.registerType('bpGroup', (root, v, sc, tm, T) => {
    const tl = Tl(), svg = layer(root), defs = S('defs', null, svg);
    const t1 = T(v.holdingAt, 1.05), t2 = T(v.subsAt, 1.8), t3 = T(v.hatchAt, 3.2), t4 = T(v.calloutAt, 3.9), t5 = T(v.legendAt, 5);
    title(svg, tl, v.title, T(v.titleAt, .78));
    const u = pick(1.02, .84), O = pick([960, 606], [540, 872]);
    const pr = (x, y, z = 0) => [O[0] + (x - y) * u, O[1] + (x + y) * u * .5 - z * u];
    const pats = SUBS.map((s, i) => hatch(defs, 'h1-' + i, s.pat, s.tint, 1.3, 8));
    // arsir tiap anak usaha bergeser pelan ke arah masing-masing ("punya cara sendiri")
    const drift = SUBS.map((s, i) => {
      const el = defs.querySelector('#h1-' + i), base = el.getAttribute('patternTransform') || '', a = hash(i * 3.1 + 7) * Math.PI * 2;
      return { el, base, vx: Math.cos(a) * (3.5 + 3 * hash(i + 2)), vy: Math.sin(a) * (3.5 + 3 * hash(i + 5)) };
    });
    tl.add((lt) => { const tt = Math.max(0, lt - t3); drift.forEach((q) => q.el.setAttribute('patternTransform', `${q.base} translate(${(q.vx * tt).toFixed(2)} ${(q.vy * tt).toFixed(2)})`)); });
    const twPat = hatch(defs, 'h1-tw', 'ver', 'rgba(255,255,255,.34)', 1, 6);
    const G = S('g', null, svg), B = S('g', null, svg), A = S('g', null, svg);
    // tapak: batas (titik-strip), petak, plaza, garis kepemilikan
    drawMasked(tl, defs, S('path', { d: D([pr(-272, -272), pr(272, -272), pr(272, 272), pr(-272, 272)], true), class: 'bp-dd' }, G), t1 - .5, 1.3);
    const SP = 130, CELLS = [[-1.5, -1.5], [-.5, -1.5], [.5, -1.5], [1.5, -1.5], [1.5, -.5], [1.5, .5], [1.5, 1.5], [.5, 1.5], [-.5, 1.5], [-1.5, 1.5], [-1.5, .5], [-1.5, -.5]].map(([a, b]) => [a * SP, b * SP]);
    const plot = (x, y, r) => D([pr(x - r, y - r), pr(x + r, y - r), pr(x + r, y + r), pr(x - r, y + r)], true);
    CELLS.forEach(([x, y], i) => tl.draw(S('path', { d: plot(x, y, 58), class: 'bp-c' }, G), t1 - .3 + i * .025, .45));
    tl.draw(S('path', { d: plot(0, 0, 124), class: 'bp-c' }, G), t1 - .35, .5);
    CELLS.forEach(([x, y], i) => drawMasked(tl, defs, S('path', { d: D([pr(0, 0), pr(x, y)]), class: 'bp-dash' }, G), t2 - .15 + i * .06, .5, E.out3));
    // bangunan (urut kedalaman: belakang dulu)
    const HS = [70, 100, 55, 120, 80, 62, 95, 66, 110, 52, 90, 76];
    const roof = [], anc = [];
    const sub = (i) => {
      const [x, y] = CELLS[i], w = 80, h = HS[i];
      anc[i] = { lf: pr(x, y + w / 2, h / 2), rf: pr(x + w / 2, y, h / 2), D1: pr(x - w / 2, y + w / 2, h), B1: pr(x + w / 2, y - w / 2, h) };
      isoBox(B, pr, tl, { x: x - w / 2, y: y - w / 2, w, d: w, h, floors: Math.max(2, Math.round(h / 22)), mull: 3, t0: t2 + i * .075, fR: pats[i], fL: pats[i], fT: SUBS[i].tint, hatchT: t3 + i * .055, opR: .95, opL: .6, opT: .16 });
      roof[i] = pr(x, y, h);
    };
    const tower = () => {
      isoBox(B, pr, tl, { x: -96, y: -96, w: 192, d: 192, h: 48, floors: 2, mull: 7, t0: t1 - .22, fR: twPat, fL: twPat, hatchT: t1 + .45, opR: .75, opL: .45 });
      isoBox(B, pr, tl, { x: -62, y: -62, w: 124, d: 124, h: 282, z0: 48, floors: 16, mull: 5, t0: t1, speed: 1.5, fR: twPat, fL: twPat, hatchT: t1 + .9, opR: .75, opL: .45 });
      isoBox(B, pr, tl, { x: -38, y: -38, w: 76, d: 76, h: 24, z0: 330, floors: 1, mull: 2, t0: t1 + .6 });
      tl.draw(S('path', { d: D([pr(0, 0, 354), pr(0, 0, 432)]), class: 'bp-e' }, B), t1 + .85, .3, E.out3);
    };
    let tw = false;
    CELLS.map((c, i) => i).sort((a, b) => (CELLS[a][0] + CELLS[a][1]) - (CELLS[b][0] + CELLS[b][1]) || (CELLS[a][0] - CELLS[b][0])).forEach((i) => {
      if (!tw && CELLS[i][0] + CELLS[i][1] > 0) { tower(); tw = true; }
      sub(i);
    });
    if (!tw) tower();
    // panah utara (U) — berputar lalu mengunci ke utara
    const NA = pick({ x: 1782, y: 104, r: 26 }, { x: 984, y: 238, r: 28 }), tN = T(v.titleAt, .78) + .2;
    const na = S('g', null, A);
    tl.draw(S('circle', { cx: NA.x, cy: NA.y, r: NA.r, class: 'bp-e2', transform: `rotate(-90 ${NA.x} ${NA.y})` }, na), tN, .6, E.io3);
    const arrow = S('g', null, na);
    S('path', { d: `M${NA.x} ${NA.y - NA.r - 8}L${NA.x + 9} ${NA.y + 10}L${NA.x} ${NA.y + 4}Z`, fill: '#fff', class: 'bp-face' }, arrow);
    S('path', { d: `M${NA.x} ${NA.y - NA.r - 8}L${NA.x - 9} ${NA.y + 10}L${NA.x} ${NA.y + 4}Z`, class: 'bp-e2' }, arrow);
    const nU = TX(na, NA.x, NA.y + NA.r + pick(20, 24), 'U', 'bp-a2', 'middle');
    tl.fade(nU, tN + .5, .3);
    tl.add((lt) => {
      const k = P(lt, tN + .1, tN + 1.3);
      arrow.setAttribute('transform', `rotate(${(-70 * (1 - E.outElastic(k))).toFixed(2)} ${NA.x} ${NA.y})`);
      arrow.style.opacity = P(lt, tN + .1, tN + .35).toFixed(3);
    });
    // label induk
    const at = pr(0, 0, 432);
    if (V) {
      tl.draw(S('path', { d: D([[at[0], at[1] - 8], [at[0], at[1] - 44]]), class: 'bp-e2' }, A), t1 + 1, .3, E.out3);
      tl.type(TX(A, at[0], at[1] - 56, v.holdingLabel, 'bp-a', 'middle'), t1 + 1.15, 36);
    } else callout(A, tl, { ax: at[0] + 3, ay: at[1] + 6, ex: at[0] + 60, lx: 1330, ly: at[1] - 10, side: 'r', text: v.holdingLabel, t0: t1 + 1 });
    // keterangan dokumen kebijakan tiap anak usaha
    const SLOTS = pick(
      [{ i: 10, lx: 96, ly: 430, side: 'l', a: 'lf' }, { i: 9, lx: 96, ly: 668, side: 'l', a: 'lf' }, { i: 2, lx: 1824, ly: 430, side: 'r', a: 'rf' }, { i: 3, lx: 1824, ly: 668, side: 'r', a: 'rf' }],
      [{ i: 9, lx: 72, ly: 404, side: 'l', a: 'D1', ex: 112 }, { i: 3, lx: 1008, ly: 404, side: 'r', a: 'B1', ex: 968 }]);
    SLOTS.forEach((s, k) => {
      if (!v.docs[k]) return;
      const rp = anc[s.i][s.a];
      callout(A, tl, { ax: rp[0], ay: rp[1], ex: s.ex, lx: s.lx, ly: s.ly, side: s.side, code: `${SUBS[s.i].code} · ${SUBS[s.i].name.toUpperCase()}`, codeCol: SUBS[s.i].tint, text: v.docs[k], t0: t4 + k * .16 - .2 });
    });
    // garis dimensi: jumlah entitas
    const yDim = pick(972, 1128);
    dimH(A, tl, pr(-272, 272)[0], pr(272, -272)[0], yDim, v.dim, t2 + .55, { ext: 12 });
    // legenda arsir = cara kelola data
    const LG = pick({ x: 96, y: 800, cw: 256, rh: 40, sw: 46, sh: 24 }, { x: 70, y: 1232, cw: 470, rh: 50, sw: 58, sh: 30 });
    const lg = S('g', null, A);
    tl.type(TX(lg, LG.x, LG.y, v.legend.title, 'bp-a2'), t5, 60);
    tl.draw(S('path', { d: `M${LG.x} ${LG.y + 12}H${LG.x + LG.cw * 2 - 24}`, class: 'bp-e2' }, lg), t5 + .05, .5, E.out3);
    v.legend.items.forEach((it, k) => {
      const col = k < 3 ? 0 : 1, row = k % 3, x = LG.x + col * LG.cw, y = LG.y + 20 + LG.rh * (row + .5) + 8;
      const sw_ = S('rect', { x, y: y - LG.sh + 6, width: LG.sw, height: LG.sh, fill: pats[k], class: 'bp-face' }, lg);
      const ol = S('rect', { x, y: y - LG.sh + 6, width: LG.sw, height: LG.sh, class: 'bp-e2' }, lg);
      tl.fade(sw_, t5 + .12 + k * .06, .35); tl.draw(ol, t5 + .08 + k * .06, .35);
      tl.type(TX(lg, x + LG.sw + 14, y + 1, it, 'bp-a'), t5 + .16 + k * .06, 55);
    });
    return (lt, d) => tl.run(lt, d);
  });

  /* =============================== S2 · HARMONISASI & ASESMEN =============================== */
  KIT.registerType('bpHarmoni', (root, v, sc, tm, T) => {
    const tA = T(v.alignAt, 1.8), tM = T(v.mergeAt, 2.4), tS = T(v.stampAt, 3.1), tB = T(v.shiftAt, 4.1), tC = T(v.chartAt, 4.3), tV = T(v.avgAt, 6);
    const C = pick([960, 548], [540, 760]);
    const SHIFT = pick([-1180, 0], [0, -1060]);
    // lembar cetak asli (HTML) di bawah lapisan SVG
    const crop = pick([0, 0, 1440, 520], [262, 60, 900, 380]);
    const psc = pick(.82, 1.05);
    const pw = crop[2] * psc, ph = crop[3] * psc;
    const print = makePrint(root, { src: v.shot.src, iw: v.shot.iw, ih: v.shot.ih, crop, scale: psc, x: C[0] - pw / 2, y: C[1] - ph / 2 });
    const svg = layer(root), defs = S('defs', null, svg);
    const tl = Tl();
    title(svg, tl, v.title, .25);
    const world = S('g', null, svg);
    SUBS.slice(0, 6).forEach((s, i) => hatch(defs, 'h2-' + i, s.pat, s.tint, 1.2, 7));
    const std = hatch(defs, 'h2-std', 'd45', 'rgba(255,255,255,.72)', 1.1, 7);
    const earth = hatch(defs, 'h2-earth', 'd45', 'rgba(255,255,255,.4)', 1, 6);
    // --- dokumen kebijakan tiap anak usaha
    const dw = pick(166, 170), dh = pick(220, 224);
    const START = pick(
      [[330, 560, -8, .96], [560, 450, 5, 1.04], [760, 650, -4, .9], [1165, 640, 5, 1], [1370, 450, -6, .94], [1600, 560, 7, 1.04]],
      [[230, 470, -8, .95], [545, 430, 5, 1.03], [855, 490, -5, .92], [230, 1060, 6, 1], [540, 1100, -4, .95], [850, 1050, 7, 1.02]]);
    const ALIGN = pick(
      [0, 1, 2, 3, 4, 5].map((i) => [960 + (i - 2.5) * 238, 548]),
      [[230, 470], [540, 470], [850, 470], [230, 1060], [540, 1060], [850, 1060]]);
    const gGuide = S('g', null, world);
    const docs = v.docs.map((ext, i) => {
      const g = S('g', null, world), s = SUBS[i];
      const p = docShape(g, dw, dh, { band: `url(#h2-${i})` });
      const tag = TX(g, -dw / 2, -dh / 2 - pick(12, 14), `${s.code} · ${ext}`, 'bp-a2');
      tag.style.fill = s.tint;
      const t0 = .3 + i * .12;
      tl.draw(p.outline, t0, .55); tl.draw(p.ear, t0 + .4, .2); tl.fade(p.back, t0 + .2, .3, .96); tl.fade(p.band, t0 + .35, .4, .95);
      p.lines.forEach((ln, k) => tl.draw(ln, t0 + .3 + k * .04, .3, E.out3));
      tl.type(tag, t0 + .2, 40);
      return { g, i };
    });
    tl.add((lt) => docs.forEach(({ g, i }) => {
      const [sx, sy, sr, ss] = START[i], [ax, ay] = ALIGN[i];
      const ka = E.io3(P(lt, tA + i * .035, tA + .55 + i * .035));
      const km = E.io3(P(lt, tM + .02 + i * .045, tM + .55 + i * .045));
      const ki = E.out3(P(lt, .3 + i * .12, .8 + i * .12));
      let x = lerp(sx, ax, ka), y = lerp(sy, ay, ka) + (1 - ki) * 24, r = lerp(sr, 0, ka), s = lerp(ss, 1, ka);
      x = lerp(x, C[0] + (i - 2.5) * 6, km); y = lerp(y, C[1] + (i - 2.5) * 5, km); s = lerp(s, 1.25, km); r = lerp(r, (i - 2.5) * 1.5, km);
      g.setAttribute('transform', `translate(${r1(x)} ${r1(y)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(3)})`);
      g.style.opacity = (1 - P(lt, tM + .32 + i * .04, tM + .62 + i * .04)).toFixed(3);
    }));
    // garis bantu penyelarasan (amber) + tanda jarak sama (EQ)
    const rows = pick([[548]], [[470], [1060]]).map((a) => a[0]);
    const guideEls = [];
    rows.forEach((ry, ri) => {
      const xs = ALIGN.filter((a) => a[1] === ry).map((a) => a[0]);
      const xa = xs[0] - dw / 2 - pick(46, 26), xb = xs[xs.length - 1] + dw / 2 + pick(46, 26);
      [ry - dh / 2 - 6, ry + dh / 2 + 6].forEach((gy, k) => {
        const ln = S('path', { d: `M${r1(xa)} ${r1(gy)}H${r1(xb)}`, class: 'bp-adash' }, gGuide);
        drawMasked(tl, defs, ln, tA + .3 + k * .08 + ri * .06, .45, E.out3);
        guideEls.push(ln);
      });
      for (let k = 0; k < xs.length - 1; k++) {
        const g0 = xs[k] + dw / 2, g1 = xs[k + 1] - dw / 2, yy = ry + pick(20, 26);
        const gg = S('g', null, gGuide);
        dimH(gg, tl, g0 + 3, g1 - 3, yy, 'EQ', tA + .42 + k * .05, { amb: true, ext: 8, cls: 'bp-a2 bp-amt', cps: 20 });
        guideEls.push(gg);
      }
    });
    tl.add((lt) => { gGuide.style.opacity = (1 - P(lt, tM + .1, tM + .45)).toFixed(3); });
    // --- lembar cetak Policy Review (asli) + cap STANDAR GRUP + anotasi tombol Harmonisasi
    const gPrint = S('g', null, world);
    cornerMarks(gPrint, tl, print.x, print.y, pw, ph, tM + .5);
    const stampG = S('g', null, world);
    const stamp = makeStamp(stampG, v.stamp, v.stampSub);
    const stP = pick([print.x + pw - 130, print.y + ph - 4], [print.x + pw - 150, print.y + ph + 10]);
    const ink = S('circle', { cx: stP[0], cy: stP[1], r: 10, fill: 'none', stroke: AMB, 'stroke-width': 2 }, stampG);
    const hb = print.at(934, 297); // tombol "Harmonisasi" di policy-review.png
    const note = S('g', null, world);
    const ring = S('ellipse', { cx: r1(hb[0]), cy: r1(hb[1]), rx: r1(76 * psc), ry: r1(30 * psc), class: 'bp-e bp-amb' }, note);
    tl.draw(ring, tS + .35, .5, E.io3);
    const nl = pick({ lx: 1700, ly: 268 }, { lx: 1008, ly: 486 });
    const noteEx = pick(hb[0] + 110, hb[0] + 40);
    const co = callout(note, tl, { ax: hb[0] + 40 * psc, ay: hb[1] - 26 * psc, ex: noteEx, lx: nl.lx, ly: nl.ly, side: 'r', text: v.note.title, amb: true, t0: tS + .55, cls: 'bp-a' });
    const noteSub = tl.type(TX(note, nl.lx, nl.ly + pick(24, 30), v.note.sub, 'bp-a2', 'end'), tS + .9, 50);
    // --- asesmen holding: tampak depan bangunan anak usaha, tinggi arsiran = tingkat kesiapan
    const chart = S('g', null, world);
    const off = (x, y) => [x - SHIFT[0], y - SHIFT[1]];
    const CH = pick({ x0: 360, bw: 150, gap: 60, ground: 852, h: 436, hx: 352, hy: 246 }, { x0: 86, bw: 128, gap: 28, ground: 1196, h: 560, hx: 78, hy: 372 });
    const [hx, hy] = off(CH.hx, CH.hy);
    const head = TX(chart, hx, hy, v.chart.title, 'bp-h');
    tl.type(head, tC + .05, 26);
    const headUl = S('path', { d: `M${hx} ${hy + 12}H${hx + pick(330, 360)}`, class: 'bp-e bp-amb bp-glow' }, chart);
    tl.draw(headUl, tV + .02, .5, E.io3);
    tl.type(TX(chart, hx, hy + pick(36, 42), v.chart.sub, 'bp-ts'), tC + .3, 60);
    const N = 6, gx0 = CH.x0, gx1 = CH.x0 + N * CH.bw + (N - 1) * CH.gap;
    const [g0x, gy] = off(gx0 - 40, CH.ground), [g1x] = off(gx1 + 40, CH.ground);
    tl.draw(S('path', { d: `M${r1(g0x)} ${gy}H${r1(g1x)}`, class: 'bp-e' }, chart), tC + .15, .7, E.io3);
    tl.fade(S('rect', { x: g0x, y: gy + 2, width: g1x - g0x, height: 16, fill: earth, class: 'bp-face' }, chart), tC + .5, .5, .9);
    const bars = [];
    for (let i = 0; i < N; i++) {
      const s = SUBS[i], [bx] = off(CH.x0 + i * (CH.bw + CH.gap), 0), top = gy - CH.h, t0 = tC + .25 + i * .09;
      const g = S('g', null, chart);
      tl.fade(S('path', { d: rectD(bx, top, CH.bw, CH.h), class: 'bp-back' }, g), t0 + .2, .3, .9);
      const fill = S('rect', { x: bx, y: gy, width: CH.bw, height: 0, fill: std, class: 'bp-face' }, g);
      const lvl = S('path', { d: `M${bx} ${gy}H${bx + CH.bw}`, class: 'bp-e' }, g);
      for (let k = 1; k < 7; k++) S('path', { d: `M${bx} ${r1(top + CH.h * k / 7)}H${bx + CH.bw}`, class: 'bp-e3' }, g);
      for (let k = 1; k < 3; k++) S('path', { d: `M${r1(bx + CH.bw * k / 3)} ${top}V${gy}`, class: 'bp-e3' }, g);
      const grid = [...g.querySelectorAll('.bp-e3')];
      grid.forEach((el, k) => tl.fade(el, t0 + .35 + k * .02, .3));
      tl.draw(S('path', { d: `M${bx} ${gy}V${top}H${bx + CH.bw}V${gy}`, class: 'bp-e' }, g), t0, .55, E.io3);
      tl.draw(S('path', { d: `M${bx - 8} ${top}H${bx + CH.bw + 8}M${bx - 8} ${top}v-10H${bx + CH.bw + 8}v10`, class: 'bp-e2' }, g), t0 + .45, .3, E.out3);
      const dwD = pick(26, 24), dhD = pick(40, 38);
      tl.draw(S('path', { d: `M${r1(bx + CH.bw / 2 - dwD / 2)} ${gy}v${-dhD}h${dwD}v${dhD}`, class: 'bp-e2' }, g), t0 + .5, .3, E.out3);
      const val = TX(g, bx + CH.bw / 2, 0, '0%', 'bp-val', 'middle');
      const code = TX(g, bx + CH.bw / 2, gy + pick(44, 52), s.code, 'bp-a2', 'middle');
      const nm = TX(g, bx + CH.bw / 2, gy + pick(70, 82), s.name, 'bp-a', 'middle');
      const tri = S('path', { d: 'M0 0l-9 -13h18z', class: 'bp-face' }, g);
      tl.type(code, t0 + .2, 30); tl.type(nm, t0 + .3, 30);
      bars.push({ s, bx, top, fill, lvl, val, tri, t0 });
    }
    const hAvg = CH.h * .68, yAvg = gy - hAvg;
    const avgL = S('path', { d: `M${r1(g0x)} ${r1(yAvg)}H${r1(g1x)}`, class: 'bp-adash' }, chart);
    const valTop = S('g', null, chart); // nilai selalu di atas garis rata-rata
    bars.forEach((b) => valTop.appendChild(b.val));
    drawMasked(tl, defs, avgL, tV + .2, .7, E.io3);
    const avgT = V ? TX(chart, g0x + 6, gy + pick(118, 132), `- - -  ${v.chart.avg} 68%`, 'bp-a2', 'start') : TX(chart, g1x + 22, yAvg + 5, `${v.chart.avg} 68%`, 'bp-a2', 'start');
    avgT.style.fill = AMB;
    tl.type(avgT, tV + .6, 40);
    if (!V) tl.fade(S('path', { d: `M${r1(g1x + 6)} ${r1(yAvg)}l12 -7v14z`, fill: AMB, class: 'bp-face' }, chart), tV + .6, .3);
    tl.add((lt) => bars.forEach((b) => {
      const k = E.io3(P(lt, b.t0 + .5, b.t0 + 1.5)), sc_ = b.s.score / 100 * k, y = gy - CH.h * sc_;
      b.fill.setAttribute('y', r1(y)); b.fill.setAttribute('height', r1(gy - y));
      b.fill.style.opacity = k > 0 ? .95 : 0;
      b.lvl.setAttribute('d', `M${b.bx} ${r1(y)}H${b.bx + CH.bw}`);
      b.lvl.style.opacity = k > 0 ? 1 : 0;
      setText(b.val, Math.round(b.s.score * k) + '%');
      b.val.setAttribute('y', r1(y - pick(14, 16)));
      b.val.style.opacity = k > 0 ? 1 : 0;
      b.tri.setAttribute('transform', `translate(${r1(b.bx + CH.bw + 12)} ${r1(y)})`);
      b.tri.style.fill = b.s.score < 60 ? AMB : '#fff';
      b.tri.style.opacity = P(lt, b.t0 + 1.3, b.t0 + 1.6);
    }));
    // --- gerak dunia: pan ke asesmen; lembar cetak ikut
    tl.add((lt) => {
      const kb = E.io3(P(lt, tB - .05, tB + .95));
      const ox = SHIFT[0] * kb, oy = SHIFT[1] * kb;
      world.setAttribute('transform', `translate(${r1(ox)} ${r1(oy)})`);
      // cetak: muncul saat dokumen menyatu
      const kr = P(lt, tM + .28, tM + .95), k2 = P(lt, tM + .55, tM + 1.35);
      print.reveal(E.io3(kr), E.out3(k2));
      print.el.style.transform = `translate(${r1(ox)}px, ${r1(oy)}px)`;
      // cap: hentak masuk
      const ks = P(lt, tS - .05, tS + .16);
      stamp.setAttribute('transform', `translate(${r1(stP[0])} ${r1(stP[1])}) rotate(-8) scale(${lerp(2.3, 1, E.outExpo(ks)).toFixed(3)})`);
      stamp.style.opacity = ks > 0 ? Math.min(1, ks * 3).toFixed(3) : 0;
      const ki = P(lt, tS + .05, tS + .75);
      ink.setAttribute('r', r1(20 + 190 * E.out3(ki)));
      ink.style.opacity = ki > 0 && ki < 1 ? (.5 * (1 - ki)).toFixed(3) : 0;
      note.style.opacity = (1 - P(lt, tB + .3, tB + .7)).toFixed(3);
      const kf = (1 - P(lt, tB + .15, tB + .75)).toFixed(3);
      print.el.style.opacity = kf; gPrint.style.opacity = kf; stampG.style.opacity = kf;
    });
    return (lt, d) => tl.run(lt, d);
  });

  /* =============================== S3 · DASBOR HOLDING (screenshot asli) =============================== */
  // Denah akses per divisi: ruang = divisi, pintu + gembok = akses modul yang diatur (gambar arsitektur, bukan UI)
  function floorPlan(g, tl, defs, PL, rooms, tP, tL, tD) {
    const n = rooms.length, nTop = PL.double ? Math.ceil(n / 2) : n;
    const c0 = PL.double ? PL.y + (PL.h - PL.corr) / 2 : PL.y + PL.h - PL.corr, c1 = c0 + PL.corr;
    tl.draw(S('path', { d: rectD(PL.x, PL.y, PL.w, PL.h), class: 'bp-e' }, g), tP, .6, E.io3);
    tl.draw(S('path', { d: rectD(PL.x - 7, PL.y - 7, PL.w + 14, PL.h + 14), class: 'bp-e2' }, g), tP + .05, .6, E.io3);
    const out = rooms.map((rm, k) => {
      const row = PL.double && k >= nTop ? 1 : 0, col = row ? k - nTop : k, cnt = row ? n - nTop : nTop, rw = PL.w / cnt;
      const x = PL.x + col * rw, y = row ? c1 : PL.y, h = row ? PL.y + PL.h - c1 : c0 - PL.y, wy = row ? c1 : c0;
      const dW = PL.door, dx0 = x + rw / 2 - dW / 2, dx1 = dx0 + dW, dir = row ? 1 : -1, t0 = tP + .2 + k * .06;
      if (col) tl.draw(S('path', { d: `M${r1(x)} ${r1(y)}V${r1(y + h)}`, class: 'bp-e' }, g), t0, .35, E.out3);
      tl.draw(S('path', { d: `M${r1(x)} ${r1(wy)}H${r1(dx0)}M${r1(dx1)} ${r1(wy)}H${r1(x + rw)}`, class: 'bp-e' }, g), t0 + .05, .3, E.out3);
      const leaf = S('path', { d: `M${r1(dx0)} ${r1(wy)}h${dW}`, class: 'bp-e2' }, g);
      const arc = S('path', { d: `M${r1(dx1)} ${r1(wy)}A${dW} ${dW} 0 0 ${row ? 1 : 0} ${r1(dx0)} ${r1(wy + dir * dW)}`, class: 'bp-dash' }, g);
      drawMasked(tl, defs, arc, t0 + .15, .35, E.out3, 6);
      const hl = S('path', { d: rectD(x + 6, y + 6, rw - 12, h - 12), class: 'bp-e bp-amb bp-glow' }, g);
      hl.style.opacity = 0;
      const ny = row ? y + h - PL.pad2 : y + PL.pad1;
      tl.type(TX(g, x + 16, ny, rm.name, 'bp-a'), t0 + .15, 30);
      tl.type(TX(g, x + 16, ny + PL.lh, rm.mods, 'bp-a3'), t0 + .35, 40);
      tl.fade(keyIcon(g, x + rw - 26, ny - PL.ks * .35, PL.ks), t0 + .4, .3);
      if (PL.furn) {
        // perabot denah: meja rapat + kursi (garis tipis)
        const fy = (ny + PL.lh + 18 + wy - dW - 12) / 2, fx = x + rw / 2, tw = Math.min(76, rw - 56), th = 30;
        tl.draw(S('path', { d: rectD(fx - tw / 2, fy - th / 2, tw, th), class: 'bp-e3' }, g), t0 + .35, .35, E.out3);
        [-1, 1].forEach((sy) => [-.25, .25].forEach((q) => tl.draw(S('circle', { cx: r1(fx + q * tw), cy: r1(fy + sy * (th / 2 + 10)), r: 6.5, class: 'bp-e3' }, g), t0 + .45, .3, E.out3)));
      }
      const lk = lockIcon(g, x + rw / 2, row ? c1 - PL.corr * .27 : (PL.double ? c0 + PL.corr * .27 : c0 + PL.corr * .5), PL.ls);
      tl.fade(lk.g, t0 + .3, .3);
      return { leaf, hl, lk, dx0, wy, dir, k };
    });
    tl.add((lt) => out.forEach((r) => {
      const kc = E.outBack(P(lt, tL + r.k * .09, tL + .32 + r.k * .09)), ang = 90 * (1 - Math.min(1.06, kc));
      r.leaf.setAttribute('transform', `rotate(${(r.dir * ang).toFixed(2)} ${r1(r.dx0)} ${r1(r.wy)})`);
      r.leaf.style.opacity = P(lt, tP + .3, tP + .5).toFixed(3);
      const kl = E.outBack(P(lt, tL + .12 + r.k * .09, tL + .36 + r.k * .09));
      r.lk.sh.setAttribute('transform', `translate(0 ${(-4.5 * (1 - kl)).toFixed(2)})`);
      const kh = P(lt, tD + r.k * .1, tD + .25 + r.k * .1), ko = 1 - P(lt, tD + .55 + r.k * .1, tD + .95 + r.k * .1);
      r.hl.style.opacity = (kh * (.3 + .7 * ko)).toFixed(3);
    }));
  }

  KIT.registerType('bpDash', (root, v, sc, tm, T) => {
    const t0 = T(v.printAt, .3), tT = T(v.tabsAt, 1.45), tP = T(v.planAt, 2.8), tL = T(v.lockAt, 3.5), tD = T(v.divAt, 3.95);
    const HD = pick({ crop: [0, 0, 1240, 200], s: 1.2, x: 216, y: 160 }, { crop: [40, 0, 690, 200], s: 1.34, x: 78, y: 300 });
    const head = makePrint(root, { src: v.header.src, iw: v.header.iw, ih: v.header.ih, crop: HD.crop, scale: HD.s, x: HD.x, y: HD.y });
    const PS = pick({ crop: [0, 0, 1002, 480], s: .8, x: 216, y: 576 }, { crop: [672, 86, 303, 384], s: 1.3, x: 70, y: 772 });
    const post = makePrint(root, { src: v.postur.src, iw: v.postur.iw, ih: v.postur.ih, crop: PS.crop, scale: PS.s, x: PS.x, y: PS.y });
    const svg = layer(root), defs = S('defs', null, svg), tl = Tl();
    title(svg, tl, v.title, .2);
    const A = S('g', null, svg);
    cornerMarks(A, tl, head.x, head.y, head.w, head.h, t0 + .2);
    cornerMarks(A, tl, post.x, post.y, post.w, post.h, t0 + .55);
    // anotasi tab Asesmen / Matrix / Tree (posisi piksel gambar asli → layar)
    v.tabs.forEach((tb, k) => {
      const p = head.at(tb.x, v.tabY), ly = head.y + head.h + pick(54 + k * 30, 56 + k * 36), tk = tT + k * .18;
      const dot = S('circle', { cx: r1(p[0]), cy: r1(p[1] - 4), r: pick(4.5, 6), class: 'bp-dot' }, A);
      dot.style.fill = AMB;
      tl.fade(dot, tk, .2);
      const ping = S('circle', { cx: r1(p[0]), cy: r1(p[1] - 4), r: 6, fill: 'none', stroke: AMB, 'stroke-width': 1.5 }, A);
      tl.add((lt) => { const q = lt < tk ? -1 : ((lt - tk) % 1.4) / 1.4; ping.setAttribute('r', r1(6 + 22 * E.out3(Math.max(0, q)))); ping.style.opacity = q < 0 ? 0 : (.8 * (1 - q)).toFixed(3); });
      tl.draw(S('path', { d: D([[p[0], p[1] - 4], [p[0], ly - pick(22, 28)]]), class: 'bp-e2 bp-amb' }, A), tk + .05, .35, E.out3);
      const t = TX(A, p[0], ly, tb.text, 'bp-a', 'middle');
      t.style.fill = AMB;
      tl.type(t, tk + .25, 30);
    });
    // judul tampilan + tanda amber pada skor (gambar asli dashboard-postur)
    tl.type(TX(A, post.x, post.y - pick(16, 18), v.scoreNote, 'bp-a2'), tT + .5, 44);
    const rc = post.at(v.scoreAt[0], v.scoreAt[1]), rr = 62 * post.s + pick(12, 14);
    tl.draw(S('circle', { cx: r1(rc[0]), cy: r1(rc[1]), r: r1(rr), class: 'bp-e bp-amb bp-glow', transform: `rotate(-90 ${r1(rc[0])} ${r1(rc[1])})` }, A), tT + .7, .7, E.io3);
    // denah akses per divisi
    const PL = pick({ x: 1084, y: 612, w: 620, h: 334, corr: 84, door: 56, pad1: 40, pad2: 0, lh: 28, ks: 26, ls: 30, double: false, furn: true },
      { x: 492, y: 812, w: 518, h: 468, corr: 100, door: 54, pad1: 40, pad2: 56, lh: 32, ks: 26, ls: 30, double: true });
    tl.type(TX(A, PL.x - 7, PL.y - pick(24, 26), v.planTitle, 'bp-a2'), tP - .15, 50);
    tl.type(TX(A, PL.x + PL.w + 7, PL.y + PL.h + pick(40, 44), v.planNote, 'bp-a2', 'end'), tP + .5, 50);
    floorPlan(S('g', null, A), tl, defs, PL, v.rooms, tP, tL, tD);
    tl.add((lt) => {
      head.reveal(E.io3(P(lt, t0, t0 + .75)), E.out3(P(lt, t0 + .25, t0 + 1.1)));
      post.reveal(E.io3(P(lt, t0 + .3, t0 + 1.05)), E.out3(P(lt, t0 + .55, t0 + 1.4)));
    });
    return (lt, d) => tl.run(lt, d);
  });

  /* =============================== S4 · LISENSI & SILO DATA =============================== */
  function cloudD(cx, cy, s) {
    const p = [[-104, 44], [-126, 10, -112, -30, -70, -24], [-60, -70, 10, -80, 30, -40], [50, -70, 110, -60, 108, -12], [140, -6, 142, 44, 104, 44]];
    let d = `M${r1(cx + p[0][0] * s)} ${r1(cy + p[0][1] * s)}`;
    for (let k = 1; k < p.length; k++) { const q = p[k]; d += `C${r1(cx + q[0] * s)} ${r1(cy + q[1] * s)} ${r1(cx + q[2] * s)} ${r1(cy + q[3] * s)} ${r1(cx + q[4] * s)} ${r1(cy + q[5] * s)}`; }
    return d + 'Z';
  }
  function infD(cx, cy, a) {
    const pts = [];
    for (let k = 0; k <= 96; k++) { const t = k / 96 * Math.PI * 2, den = 1 + Math.sin(t) ** 2; pts.push([cx + a * Math.cos(t) / den, cy + a * Math.sin(t) * Math.cos(t) / den]); }
    return D(pts);
  }
  KIT.registerType('bpLisensi', (root, v, sc, tm, T) => {
    const tl = Tl(), svg = layer(root), defs = S('defs', null, svg);
    const tB = T(v.shiftAt, 4.07), tS = T(v.siloAt, 4.3), tW = T(v.wallAt, 5.47), tLk = T(v.lockAt, 6.1);
    const blink = (el, t0, seed) => tl.add((lt) => { const on = hash(Math.floor(lt * 5) * 1.7 + seed * 13.3) > .28; el.style.opacity = lt < t0 ? 0 : (on ? 1 : .25) * P(lt, t0, t0 + .2); });
    title(svg, tl, v.title, .25);
    const wall = hatch(defs, 'h4-wall', 'cross', 'rgba(255,255,255,.55)', 1, 7);
    const earth = hatch(defs, 'h4-earth', 'd45', 'rgba(255,255,255,.4)', 1, 6);
    const std = hatch(defs, 'h4-std', 'hor', 'rgba(255,255,255,.35)', 1, 9);
    // --- tiga opsi lisensi sebagai gambar teknik
    const FR = pick([0, 1, 2].map((i) => ({ x: 150 + i * 550, y: 188, w: 520, h: 590 })), [0, 1, 2].map((i) => ({ x: 60, y: 300 + i * 352, w: 960, h: 330 })));
    const CHIP = pick([0, 1, 2].map((i) => ({ x: 960 + (i - 1) * 360 - 160, y: 168, w: 320, h: 64 })), [0, 1, 2].map((i) => ({ x: 60 + i * 330, y: 296, w: 300, h: 72 })));
    const opts = v.options.map((op, i) => {
      const f = FR[i], tOp = T(op.at, .8 + i), g = S('g', null, svg), art = S('g', null, g);
      const box = S('rect', { x: f.x, y: f.y, width: f.w, height: f.h, class: 'bp-e2' }, g);
      tl.draw(box, .3 + i * .1, .6, E.io3);
      const act = S('rect', { x: f.x, y: f.y, width: f.w, height: f.h, class: 'bp-e bp-amb bp-glow' }, g);
      // area gambar
      const ax = pick(f.x + f.w / 2, f.x + 200), ay = pick(f.y + 210, f.y + f.h / 2), s = pick(1, .82);
      if (i === 0) {
        const cl_ = S('path', { d: cloudD(ax, ay - 40 * s, 1.05 * s), class: 'bp-e' }, art); tl.draw(cl_, tOp, .8, E.io3);
        for (let k = 0; k < 3; k++) {
          const sv = S('rect', { x: r1(ax - 46 * s), y: r1(ay - 64 * s + k * 20 * s), width: r1(92 * s), height: r1(13 * s), rx: 3, class: 'bp-e2' }, art);
          tl.draw(sv, tOp + .35 + k * .06, .3);
          const led = S('circle', { cx: r1(ax + 36 * s), cy: r1(ay - 57.5 * s + k * 20 * s), r: 2.2, fill: AMB }, art); blink(led, tOp + .6 + k * .06, k);
        }
        [-120, 0, 120].forEach((dx, k) => {
          const bx = ax + dx * s, by = ay + (k === 1 ? 138 : 120) * s;
          drawMasked(tl, defs, S('path', { d: `M${r1(ax + dx * .45 * s)} ${r1(ay + 6 * s)}L${r1(bx)} ${r1(by - 44 * s)}`, class: 'bp-dash' }, art), tOp + .4 + k * .06, .35, E.out3);
          const pr_ = (x, y, z = 0) => [bx + (x - y) * .8 * s, by + (x + y) * .4 * s - z * .8 * s];
          isoBox(art, pr_, tl, { x: -18, y: -18, w: 36, d: 36, h: [40, 58, 46][k], floors: 2, mull: 2, t0: tOp + .5 + k * .07, speed: .8 });
        });
      } else if (i === 1) {
        // gedung sendiri digambar tembus pandang (x-ray): rak server di dalam terlihat
        const pr_ = (x, y, z = 0) => [ax + (x - y) * .95 * s, ay + 70 * s + (x + y) * .475 * s - z * .95 * s];
        tl.draw(S('path', { d: D([pr_(-104, -80), pr_(104, -80), pr_(104, 80), pr_(-104, 80)], true), class: 'bp-e3' }, art), tOp + .05, .5, E.io3);
        isoBox(art, pr_, tl, { x: -14, y: 4, w: 46, d: 40, h: 118, floors: 6, mull: 1, t0: tOp + .35, speed: .8 });
        for (let k = 0; k < 5; k++) { const p = pr_(9, 44, 12 + k * 20); const led = S('circle', { cx: r1(p[0] - 10), cy: r1(p[1] - 2), r: 2.2, fill: AMB }, art); blink(led, tOp + .75 + k * .04, k + 7); }
        isoBox(art, pr_, tl, { x: -80, y: -56, w: 160, d: 112, h: 150, floors: 1, mull: 1, t0: tOp, speed: 1.1, noBack: true });
      } else {
        const cw = 236 * s, chh = 160 * s, cx0 = ax - cw / 2, cy0 = ay - 150 * s;
        tl.draw(S('path', { d: rectD(cx0, cy0, cw, chh), class: 'bp-e' }, art), tOp, .6, E.io3);
        tl.draw(S('path', { d: rectD(cx0 + 8, cy0 + 8, cw - 16, chh - 16), class: 'bp-e2' }, art), tOp + .15, .6, E.io3);
        [.78, .62, .7].forEach((q, k) => tl.draw(S('path', { d: `M${r1(cx0 + 24)} ${r1(cy0 + 36 * s + k * 22 * s)}h${r1((cw - 48) * q)}`, class: 'bp-e3' }, art), tOp + .3 + k * .05, .3, E.out3));
        const sx = cx0 + cw - 44 * s, sy = cy0 + chh - 40 * s, seal = [];
        for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2, rr = (k % 2 ? 22 : 27) * s; seal.push([sx + Math.cos(a) * rr, sy + Math.sin(a) * rr]); }
        tl.draw(S('path', { d: D(seal, true), class: 'bp-e2 bp-amb' }, art), tOp + .4, .4);
        tl.draw(S('path', { d: infD(ax, ay + 95 * s, 118 * s), class: 'bp-e', style: 'stroke-width:3' }, art), tOp + .25, .9, E.io3);
      }
      // label opsi (judul gambar)
      const an = pick('middle', 'start'), lx = pick(f.x + f.w / 2, f.x + 440);
      const oy = pick(f.y + 468, f.y + 110), ny = pick(f.y + 522, f.y + 184), sy2 = pick(f.y + 558, f.y + 232);
      const lab = TX(g, lx, oy, `OPSI ${op.key}`, 'bp-a2', an);
      const name = TX(g, lx, ny, op.name, 'bp-big', an);
      const sub = TX(g, lx, sy2, op.sub, 'bp-sub', an);
      if (!V) tl.draw(S('path', { d: `M${f.x + 40} ${f.y + 432}H${f.x + f.w - 40}`, class: 'bp-e3' }, art), .6 + i * .1, .5, E.out3);
      tl.type(lab, tOp - .05, 40); tl.type(name, tOp + .05, 22); tl.type(sub, tOp + .3, 48);
      return { g, art, box, act, name, lab, sub, f, i, tOp, nx: lx, ny };
    });
    tl.add((lt) => {
      const kb = E.io3(P(lt, tB - .05, tB + .75));
      opts.forEach((o, i) => {
        const c = CHIP[i], f = o.f;
        const x = lerp(f.x, c.x, kb), y = lerp(f.y, c.y, kb), w = lerp(f.w, c.w, kb), h = lerp(f.h, c.h, kb);
        [o.box, o.act].forEach((r) => { r.setAttribute('x', r1(x)); r.setAttribute('y', r1(y)); r.setAttribute('width', r1(w)); r.setAttribute('height', r1(h)); });
        o.art.style.opacity = (1 - P(lt, tB - .05, tB + .3)).toFixed(3);
        o.lab.style.opacity = o.sub.style.opacity = (1 - P(lt, tB - .05, tB + .25)).toFixed(3);
        // nama opsi pindah ke dalam chip
        const tx = pick(c.x + c.w / 2, c.x + 22), ty = c.y + c.h / 2 + pick(9, 10), sc_ = pick(.6, .56);
        const dx = lerp(0, tx - o.nx, kb), dy = lerp(0, ty - o.ny, kb), ss = lerp(1, sc_, kb);
        o.name.setAttribute('transform', `translate(${r1(o.nx + dx)} ${r1(o.ny + dy)}) scale(${ss.toFixed(3)}) translate(${r1(-o.nx)} ${r1(-o.ny)})`);
        // sorot opsi aktif saat disebut; semua setara setelah pindah
        const tNext = (opts[i + 1] || { tOp: tB }).tOp;
        const ka = P(lt, o.tOp, o.tOp + .25) * (1 - P(lt, tNext, tNext + .3));
        o.act.style.opacity = ka.toFixed(3);
        o.box.style.opacity = (.5 + .5 * P(lt, o.tOp - .2, o.tOp + .2)).toFixed(3);
      });
    });
    // --- silo data tiap anak usaha
    const SL = pick({ cols: 6, rows: 1, x0: 380, dx: 232, top: [436], rx: 82, ry: 24, h: 318, lockY: .56 },
      { cols: 3, rows: 2, x0: 220, dx: 320, top: [566, 952], rx: 98, ry: 27, h: 222, lockY: .56 });
    const silo = S('g', null, svg);
    const sT = pick({ x: 298, y: 330 }, { x: 70, y: 470 });
    tl.type(TX(silo, sT.x, sT.y, v.silo.title, 'bp-a'), tS - .05, 40);
    tl.type(TX(silo, sT.x, sT.y + pick(26, 32), v.silo.sub, 'bp-a2'), tS + .2, 50);
    const LOCKS = [];
    for (let k = 0; k < 6; k++) {
      const col = k % SL.cols, row = Math.floor(k / SL.cols), cx = SL.x0 + col * SL.dx, top = SL.top[row], t0 = tS + .1 + k * .08, s = SUBS[k];
      const g = S('g', null, silo), bot = top + SL.h;
      tl.fade(S('path', { d: `M${cx - SL.rx} ${top}V${bot}A${SL.rx} ${SL.ry} 0 0 0 ${cx + SL.rx} ${bot}V${top}Z`, class: 'bp-back' }, g), t0 + .25, .3);
      tl.fade(S('path', { d: `M${cx - SL.rx} ${top}V${bot}A${SL.rx} ${SL.ry} 0 0 0 ${cx + SL.rx} ${bot}V${top}A${SL.rx} ${SL.ry} 0 0 1 ${cx - SL.rx} ${top}Z`, fill: std, class: 'bp-face' }, g), t0 + .45, .4, .6);
      tl.draw(S('path', { d: `M${cx - SL.rx} ${top}V${bot}A${SL.rx} ${SL.ry} 0 0 0 ${cx + SL.rx} ${bot}V${top}`, class: 'bp-e' }, g), t0, .55, E.io3);
      tl.draw(S('ellipse', { cx, cy: top, rx: SL.rx, ry: SL.ry, class: 'bp-e' }, g), t0 + .2, .45, E.io3);
      for (let b = 1; b < 4; b++) tl.draw(S('path', { d: `M${cx - SL.rx} ${r1(top + SL.h * b / 4)}A${SL.rx} ${SL.ry} 0 0 0 ${cx + SL.rx} ${r1(top + SL.h * b / 4)}`, class: 'bp-e3' }, g), t0 + .3 + b * .05, .35, E.out3);
      const ly = top + SL.h * SL.lockY + SL.ry * .6;
      const disc = S('circle', { cx, cy: r1(ly), r: pick(30, 32), class: 'bp-back' }, g);
      const ring = S('circle', { cx, cy: r1(ly), r: pick(30, 32), class: 'bp-e2' }, g);
      const lk = lockIcon(g, cx, ly, pick(40, 42));
      const code = TX(g, cx, bot + SL.ry + pick(34, 36), s.code, 'bp-a2', 'middle');
      const nm = TX(g, cx, bot + SL.ry + pick(60, 64), s.name, 'bp-a', 'middle');
      tl.type(code, t0 + .3, 30); tl.type(nm, t0 + .4, 30);
      LOCKS.push({ disc, ring, lk, k });
    }
    // dinding pemisah (potongan dinding berarsir)
    const WALLS = pick(
      [0, 1, 2, 3, 4].map((k) => ({ x: SL.x0 + SL.dx * (k + .5) - 10, y: 392, w: 20, h: 432 })),
      [{ x: 370, y: 506, w: 20, h: 792 }, { x: 690, y: 506, w: 20, h: 792 }, { x: 86, y: 890, w: 908, h: 18 }]);
    WALLS.forEach((wl, k) => {
      const t0 = tW + k * .06;
      const r = S('rect', { x: wl.x, y: wl.y, width: wl.w, height: wl.h, fill: wall, class: 'bp-face' }, silo);
      tl.fade(r, t0 + .15, .3);
      tl.draw(S('path', { d: rectD(wl.x, wl.y, wl.w, wl.h), class: 'bp-e' }, silo), t0, .4, E.io3);
    });
    const dy = pick(912, 1352);
    dimH(silo, tl, pick(298, 70), pick(1622, 1010), dy, v.silo.dim, tS + .8, { ext: 12 });
    tl.add((lt) => LOCKS.forEach((L) => {
      const ka = P(lt, tS + .45 + L.k * .08, tS + .75 + L.k * .08);
      [L.disc, L.ring, L.lk.g].forEach((e) => (e.style.opacity = ka.toFixed(3)));
      const kc = E.outBack(P(lt, tLk + L.k * .08, tLk + .28 + L.k * .08));
      L.lk.sh.setAttribute('transform', `translate(0 ${(-5 * (1 - kc)).toFixed(2)})`);
      const on = lt >= tLk + L.k * .08;
      L.ring.classList.toggle('bp-amb', on);
      L.ring.style.strokeWidth = on ? 2.2 : '';
    }));
    return (lt, d) => tl.run(lt, d);
  });

  /* =============================== S5 · CTA =============================== */
  KIT.registerType('bpCta', (root, v, sc, tm, T) => {
    const tLg = T(v.logoAt, .55), tH = T(v.hlAt, 3.35), tBt = T(v.btnAt, 5.2), tF = T(v.fillAt, 5.8), tBl = T(v.blockAt, 4.2);
    const L = pick({ cx: 960, cy: 336, w: 720, tag: 450, btn: 614, bh: 96, bw: 880, foot: 780 }, { cx: 540, cy: 560, w: 860, tag: 690, btn: 944, bh: 104, bw: 940, foot: 1114 });
    const lh = L.w * 180 / 1252, tl = Tl();
    // lapisan belakang: garis konstruksi (sumbu, lingkaran, kotak, dimensi)
    const back = layer(root), defs = S('defs', null, back);
    const ax = S('path', { d: `M${pick(140, 70)} ${L.cy}H${SW - pick(140, 70)}`, class: 'bp-dd' }, back);
    drawMasked(tl, defs, ax, .05, 1, E.io3);
    const ay = S('path', { d: `M${L.cx} ${pick(104, 330)}V${pick(430, 668)}`, class: 'bp-dd' }, back);
    drawMasked(tl, defs, ay, .15, .9, E.io3);
    ax.style.opacity = ay.style.opacity = .5;
    tl.draw(S('circle', { cx: L.cx, cy: L.cy, r: pick(300, 400), class: 'bp-e3', transform: `rotate(-90 ${L.cx} ${L.cy})` }, back), .2, 1.3, E.io3);
    const bx = L.cx - L.w / 2 - 26, by = L.cy - lh / 2 - 20, bw = L.w + 52, bh = lh + 40;
    cornerMarks(back, tl, bx + 14, by + 14, bw - 28, bh - 28, .35, 26, 14);
    dimH(back, tl, L.cx - L.w / 2, L.cx + L.w / 2, by - pick(24, 28), v.dimLabel, .7, { ext: 10 });
    // logo (PNG asli) + tagline HTML (reveal per kata sesuai VO, garis sorot amber di "satu standar")
    const lg = KIT.h(`<div class="bp-logo" style="top:${r1(L.cy - lh / 2)}px"><img src="../assets/privasimu_logo.png" alt="" style="width:${L.w}px"></div>`);
    root.appendChild(lg);
    const img = lg.firstChild;
    let html = '';
    v.tag.forEach((w, k) => {
      const prev = v.tag[k - 1], next = v.tag[k + 1];
      if (k) html += V && k === 2 ? '<br>' : ' ';
      if (w.hl && !(prev && prev.hl)) html += '<span class="hl">';
      html += `<span class="kw">${KIT.esc(w.w)}</span>`;
      if (w.hl && !(next && next.hl)) html += '</span>';
    });
    const tagEl = KIT.h(`<div class="bp-tag" style="top:${L.tag}px">${html}</div>`);
    root.appendChild(tagEl);
    const words = [...tagEl.querySelectorAll('.kw')].map((sp, k) => ({ sp, t: T(v.tag[k].at, 2 + k * .3) }));
    const hl = tagEl.querySelector('.hl');
    // lapisan depan: pindai logo, tombol, kontak, blok judul lembar
    const svg = layer(root), defs2 = S('defs', null, svg);
    const scan = S('path', { d: `M0 ${r1(by + 6)}V${r1(by + bh - 6)}`, class: 'bp-e bp-amb bp-glow' }, svg);
    const bX = L.cx - L.bw / 2, bY = L.btn;
    const btnFill = S('rect', { x: bX, y: bY, width: L.bw, height: L.bh, rx: 8, fill: '#ffffff', class: 'bp-face' }, svg);
    const btnLine = S('path', { d: `M${bX + 8} ${bY}H${bX + L.bw - 8}A8 8 0 0 1 ${bX + L.bw} ${bY + 8}V${bY + L.bh - 8}A8 8 0 0 1 ${bX + L.bw - 8} ${bY + L.bh}H${bX + 8}A8 8 0 0 1 ${bX} ${bY + L.bh - 8}V${bY + 8}A8 8 0 0 1 ${bX + 8} ${bY}Z`, class: 'bp-e' }, svg);
    tl.draw(btnLine, tBt - .05, .6, E.io3);
    const clipId = 'bpclip' + (MID++);
    S('rect', { x: bX, y: bY, width: L.bw, height: L.bh, rx: 8 }, S('clipPath', { id: clipId }, defs2));
    const shine = S('rect', { x: 0, y: bY - 30, width: 70, height: L.bh + 60, fill: 'rgba(255,255,255,.6)' }, S('g', { 'clip-path': `url(#${clipId})` }, svg));
    const btnT = TX(svg, L.cx, bY + L.bh / 2 + pick(14, 15), v.button, 'bp-dt', 'middle');
    btnT.style.fontSize = pick('40px', '42px');
    tl.type(btnT, tBt + .1, 44);
    [bX - 16, bX + L.bw + 16].forEach((x, k) => tl.draw(S('path', { d: `M${x} ${bY - 14}V${bY + L.bh + 14}`, class: 'bp-e3' }, svg), tBt + .1 + k * .05, .4));
    tl.type(TX(svg, L.cx, L.foot, v.foot, 'bp-a', 'middle'), tF + .35, 50);
    const BK = pick({ x: 1432, y: 858, w: 408, rh: 38, lc: 104 }, { x: 170, y: 1236, w: 740, rh: 50, lc: 180 });
    const blk = S('g', null, svg);
    tl.draw(S('path', { d: rectD(BK.x, BK.y, BK.w, BK.rh * 3), class: 'bp-e2' }, blk), tBl, .6, E.io3);
    for (let k = 1; k < 3; k++) tl.draw(S('path', { d: `M${BK.x} ${BK.y + BK.rh * k}H${BK.x + BK.w}`, class: 'bp-e3' }, blk), tBl + .1 + k * .05, .4, E.out3);
    tl.draw(S('path', { d: `M${BK.x + BK.lc} ${BK.y}V${BK.y + BK.rh * 3}`, class: 'bp-e3' }, blk), tBl + .15, .4, E.out3);
    v.block.forEach(([a, b], k) => {
      const yy = BK.y + BK.rh * (k + .5) + pick(5, 7);
      tl.type(TX(blk, BK.x + 12, yy, a, 'bp-k'), tBl + .2 + k * .1, 40);
      tl.type(TX(blk, BK.x + BK.lc + 14, yy, b, 'bp-a2'), tBl + .3 + k * .1, 40);
    });
    const fade = KIT.h('<div class="bp-fade"></div>');
    root.appendChild(fade);
    return (lt, d) => {
      tl.run(lt, d);
      const kl = E.io3(P(lt, tLg - .05, tLg + .85));
      img.style.clipPath = `inset(-10% ${(100 - kl * 100).toFixed(2)}% -10% 0)`;
      img.style.opacity = kl > 0 ? 1 : 0;
      scan.setAttribute('transform', `translate(${r1(L.cx - L.w / 2 + L.w * kl)} 0)`);
      scan.style.opacity = kl > 0 && kl < 1 ? 1 : 0;
      words.forEach(({ sp, t }) => {
        const k = 1 - Math.pow(1 - P(lt, t - .06, t + .5), 4);
        sp.style.transform = `translateY(${((1 - k) * .35).toFixed(3)}em)`;
        sp.style.opacity = k.toFixed(3);
        sp.style.filter = k < .99 ? `blur(${((1 - k) * 8).toFixed(2)}px)` : 'none';
      });
      if (hl) hl.style.setProperty('--k', E.io3(P(lt, tH + .05, tH + .6)).toFixed(3));
      const kf = E.io3(P(lt, tF, tF + .35));
      btnFill.style.opacity = kf.toFixed(3);
      btnT.style.fill = kf > .5 ? '#0A2A5C' : '#ffffff';
      const ks = P((lt - tF - .45) % 2.4, 0, .9);
      shine.setAttribute('transform', `translate(${r1(lerp(bX - 140, bX + L.bw + 60, ks))} 0) skewX(-20)`);
      shine.style.opacity = lt > tF + .45 ? 1 : 0;
      fade.style.opacity = P(lt, d - .7, d).toFixed(3);
    };
  });
})();
