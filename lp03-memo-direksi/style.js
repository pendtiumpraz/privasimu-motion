// LP03 · Memo untuk Dewan Direksi — gaya "editorial mewah / memo direksi cetak premium".
// Formula n07-konsultan: kertas ivory bertekstur digambar SEKALI di `bg`, satu tipe scene kustom per halaman (mm-*),
// transisi balik halaman / garis tinta / lembar diangkat di `frame` (halaman sebelumnya dibawa pada keadaan akhirnya),
// logo diwarnai ulang navy lewat canvas. Tinta navy = cetakan; biru #2F6BFF HANYA untuk tanda pena & stempel.
// Tinta muncul sebagai sapuan masker lembut sepanjang baris (seperti tinta mengalir), angka besar naik dari balik
// masker, rujukan pasal diketik (mono). Semua gerak = fungsi murni dari `lt`; acak memakai MG.hash.
(function () {
  const { SW, SH, V, h, $, pick, esc } = KIT;
  const { P, cl, lerp, E, hash } = MG;
  const NAVY = '#0B1B4D', BLUE = '#2F6BFF';
  const ios = (k) => 0.5 - 0.5 * Math.cos(Math.PI * k); // inOutSine: kecepatan pena merata
  const oq = (k) => 1 - Math.pow(1 - k, 5); // outQuint
  const MM = (window.MM = { R: {}, dur: {}, push: {}, trans: {}, fx: null });
  const SCN = window.PRV ? PRV.SCENES : [];
  SCN.forEach((s) => { MM.push[s.id] = s.vis.push ?? 0.018; MM.trans[s.id] = s.vis.trans || null; });
  const PAGES = 9, pad2 = (n) => String(n).padStart(2, '0');
  const L = (x) => (Array.isArray(x) ? x : pick(x.h, x.v || x.h));
  // *miring* → <em>, [kata] → sasaran tanda pena biru
  const md = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>').replace(/\[(.+?)\]/g, '<span class="pw">$1</span>');

  // gambar logo sumber (ikut ditunggu engine sebelum READY)
  const LOGO_IMG = document.createElement('img');
  LOGO_IMG.src = '../assets/privasimu_logo.png'; LOGO_IMG.alt = ''; LOGO_IMG.style.display = 'none';
  document.body.appendChild(LOGO_IMG);

  // ================= util gerak =================
  // tinta: tepi masker lembut menyapu dari kiri ke kanan (k 0..1)
  function ink(el, k, soft = 18) {
    if (k <= 0) { el.style.visibility = 'hidden'; return; }
    el.style.visibility = '';
    if (k >= 1) { el.style.webkitMaskImage = 'none'; el.style.maskImage = 'none'; return; }
    const e = lerp(-soft, 100, k);
    const g = `linear-gradient(97deg, #000 ${e.toFixed(2)}%, rgba(0,0,0,.42) ${(e + soft * 0.5).toFixed(2)}%, transparent ${(e + soft).toFixed(2)}%)`;
    el.style.webkitMaskImage = g; el.style.maskImage = g;
  }
  const inkAt = (el, t0, lt, dur = 0.95, soft) => ink(el, ios(P(lt, t0, t0 + dur)), soft);
  function inkLines(lns, times, lt, dur = 0.95, soft) {
    lns.forEach((l, i) => inkAt(l, Array.isArray(times) ? times[Math.min(i, times.length - 1)] + (i >= times.length ? (i - times.length + 1) * 0.6 : 0) : times + i * 0.6, lt, dur, soft));
  }
  function rise(el, k, dist = 10) {
    el.style.opacity = k.toFixed(3);
    el.style.transform = k >= 1 ? 'none' : `translateY(${((1 - k) * dist).toFixed(2)}px)`;
  }
  const riseAt = (el, t0, lt, dur = 0.7, dist = 10) => rise(el, E.out3(P(lt, t0, t0 + dur)), dist);
  const draw = (el, k, ax = 'X') => { el.style.transform = `scale${ax}(${Math.max(0, k).toFixed(4)})`; };
  const drawAt = (el, t0, lt, dur = 0.8, ax) => draw(el, E.io3(P(lt, t0, t0 + dur)), ax);
  // angka besar: tiap huruf naik dari balik masker
  function chars(el) {
    const s = el.textContent; el.textContent = '';
    return [...s].map((c) => {
      const m = document.createElement('span'); m.className = 'mc';
      const i = document.createElement('span'); i.className = 'ci'; i.textContent = c;
      m.appendChild(i); el.appendChild(m); return i;
    });
  }
  function riseChars(cs, t0, lt, { gap = 0.1, dur = 1.0 } = {}) {
    cs.forEach((c, i) => {
      const k = oq(P(lt, t0 + i * gap, t0 + i * gap + dur));
      c.style.transform = k >= 1 ? 'none' : `translateY(${((1 - k) * 118).toFixed(2)}%)`;
    });
  }
  // rujukan pasal: diketik huruf demi huruf (mono)
  function typeSplit(el) {
    const s = el.textContent; el.textContent = '';
    return [...s].map((c) => { const sp = document.createElement('span'); sp.textContent = c; el.appendChild(sp); return sp; });
  }
  function typeOn(cs, t0, lt, cps = 48) {
    const n = lt < t0 ? 0 : Math.floor((lt - t0) * cps) + 1;
    cs.forEach((c, i) => { c.style.opacity = i < n ? 1 : 0; });
  }

  // ================= tanda pena biru =================
  function penSvg(parent, d, w, hh, cls = '') {
    const svg = h(`<svg class="pen ${cls}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}" viewBox="0 0 ${w.toFixed(1)} ${hh.toFixed(1)}"><path d="${d}" pathLength="1"/></svg>`);
    parent.appendChild(svg);
    return svg;
  }
  function penK(svg, k) {
    if (!svg) return;
    svg.firstChild.style.strokeDashoffset = (1 - cl(k)).toFixed(4);
    svg.style.visibility = k > 0 ? 'visible' : 'hidden';
  }
  const jit = (seed, k, a) => (hash(seed * 13.7 + k * 3.1) - 0.5) * a;
  // garis bawah: satu goresan sedikit melengkung, naik ke kanan
  function underD(w, seed) {
    const x0 = 10 + jit(seed, 1, 6), x1 = 10 + w + jit(seed, 2, 8), y0 = 17 + jit(seed, 3, 3), y1 = 11 + jit(seed, 4, 3);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} C${(10 + w * 0.32).toFixed(1)} ${(y0 + 4.5 + jit(seed, 5, 2)).toFixed(1)} ${(10 + w * 0.7).toFixed(1)} ${(y1 + 1 + jit(seed, 6, 2)).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}` +
      ` q${(-w * 0.12).toFixed(1)} ${(4 + jit(seed, 7, 2)).toFixed(1)} ${(-w * 0.3).toFixed(1)} ${(9 + jit(seed, 8, 2)).toFixed(1)}`;
  }
  // lingkaran tangan: ± 1,08 putaran, sedikit melebar sehingga ujungnya tidak menumpuk
  function ovalD(w, hh, seed) {
    const cx = w / 2, cy = hh / 2, rx = w / 2 - 8, ry = hh / 2 - 8, N = 150, a0 = -2.35, turns = 1.09;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const t = i / N, a = a0 + t * turns * Math.PI * 2;
      const r = 0.94 + 0.03 * Math.sin(t * 5.3 + seed) + 0.06 * t;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * r).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * r - 5 * t).toFixed(1);
    }
    return d;
  }
  // garis bawah di bawah kata .pw sebuah blok teks (ukur malas: font sudah dimuat saat render pertama)
  function penUnder(block, seed, { dy = 0.16, ext = 0.05 } = {}) {
    const w = block.querySelector('.pw');
    if (!w) return () => {};
    let svg = null;
    return (k) => {
      if (!svg && w.offsetWidth) {
        let x = 0, y = 0;
        for (let n = w; n && n !== block; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        const fs = parseFloat(getComputedStyle(w).fontSize), ww = w.offsetWidth * (1 + ext * 2);
        svg = penSvg(block, underD(ww, seed), ww + 20, 30, 'pen-u');
        svg.style.left = (x - w.offsetWidth * ext - 10).toFixed(1) + 'px';
        svg.style.top = (y + fs * (0.924 + dy) - 14).toFixed(1) + 'px';
      }
      penK(svg, k);
    };
  }

  // ================= kepala & kaki halaman (tidak ikut dorongan kamera) =================
  function chrome(root, id, page) {
    const head = page > 1 ? `<div class="mm-rh"><span>Memo · Dewan Direksi</span><span class="cls">Rahasia</span><span class="pg">Hal. <b>${pad2(page)}</b> / ${pad2(PAGES)}</span></div><i class="mm-rl rl-t"></i>` : '';
    const el = h(`<div class="mm-chrome">${head}<i class="mm-rl rl-b"></i><div class="mm-rf"><span>Kantor Pejabat Pelindungan Data</span><span class="cls">Rahasia</span><span class="dt">Oktober 2026</span></div></div>`);
    root.appendChild(el);
    const push = MM.push[id] ?? 0.018;
    return (lt, d, fade = 0) => {
      el.style.transform = `scale(${(1 / (1 + push * (lt / d))).toFixed(5)})`;
      el.style.opacity = (1 - fade).toFixed(3);
    };
  }
  // label bagian: "01 — Landasan hukum"
  function secLabel(root, text, cls = '') {
    const [no, lab] = text.split(' — ');
    const el = h(`<div class="mm-sec ${cls}"><b>${esc(no)}</b><i></i><span>${esc(lab)}</span></div>`);
    root.appendChild(el);
    const nb = $('b', el), rl = $('i', el), sp = $('span', el);
    return (t0, lt) => { riseAt(nb, t0, lt, 0.6, 8); drawAt(rl, t0 + 0.1, lt, 0.7); inkAt(sp, t0 + 0.25, lt, 0.8, 30); };
  }
  function block(root, cls, lines, tag = 'div') {
    const el = h(`<${tag} class="${cls}">${lines.map((l) => `<span class="ln">${md(l)}</span>`).join('')}</${tag}>`);
    root.appendChild(el);
    return { el, lns: [...el.querySelectorAll('.ln')] };
  }
  // catatan kaki: garis pendek + teks mono diketik
  function footnote(root, text, cls) {
    const el = h(`<div class="mm-fn ${cls}"><i></i><span></span></div>`);
    $('span', el).textContent = text;
    root.appendChild(el);
    const rl = $('i', el), cs = typeSplit($('span', el));
    return (t0, lt) => { drawAt(rl, t0, lt, 0.5); typeOn(cs, t0 + 0.2, lt, 60); };
  }
  const reg = (sc, render) => { MM.R[sc.id] = render; MM.dur[sc.id] = sc.dur; return render; };

  // ================= logo navy (canvas; logo asli putih) =================
  function logoCanvas(w) {
    const hh = Math.round(w * 180 / 1252), cv = document.createElement('canvas');
    cv.width = w * 2; cv.height = hh * 2; cv.style.width = w + 'px'; cv.style.height = hh + 'px';
    return cv;
  }
  function paintLogo(cv, color) {
    const x = cv.getContext('2d'), W = cv.width, H = cv.height;
    x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, W, H);
    if (!LOGO_IMG.complete || !LOGO_IMG.naturalWidth) return false;
    x.drawImage(LOGO_IMG, 0, 0, W, H);
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = color; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'source-over';
    return true;
  }

  // ================= kertas ivory bertekstur (sekali, deterministik) =================
  let PAPER = null;
  function makePaper(W, H) {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#F5F1E8'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 18; i++) { // awan serat (tidak rata, seperti kertas tebal)
      const cx = hash(i * 3.1 + 1) * W, cy = hash(i * 5.7 + 2) * H, r = (0.16 + hash(i * 7.3 + 3) * 0.42) * Math.max(W, H);
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r), light = hash(i * 9.1 + 4) > 0.42;
      g.addColorStop(0, light ? 'rgba(255,253,247,.34)' : 'rgba(208,194,166,.11)'); g.addColorStop(1, 'rgba(245,241,232,0)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
    x.lineCap = 'round';
    const NF = Math.round(W * H / 760);
    for (let i = 0; i < NF; i++) { // serat halus
      const px = hash(i * 1.71 + 11) * W, py = hash(i * 2.37 + 13) * H, len = 4 + hash(i * 3.13 + 17) * 22, a = hash(i * 4.7 + 19) * Math.PI * 2;
      const dark = hash(i * 5.3 + 23) > 0.55;
      x.strokeStyle = dark ? `rgba(120,98,64,${(0.02 + hash(i * 6.1 + 29) * 0.04).toFixed(3)})` : `rgba(255,255,251,${(0.08 + hash(i * 7.9 + 31) * 0.14).toFixed(3)})`;
      x.lineWidth = 0.5 + hash(i * 8.3 + 37) * 0.7;
      x.beginPath(); x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a + 0.5) * len * 0.5, py + Math.sin(a + 0.5) * len * 0.5, px + Math.cos(a) * len, py + Math.sin(a) * len);
      x.stroke();
    }
    const img = x.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const nz = (hash(i * 0.0131 + 0.7) - 0.5) * 7; d[i] += nz; d[i + 1] += nz; d[i + 2] += nz * 0.9; }
    x.putImageData(img, 0, 0);
    return c;
  }

  // ================= transisi halaman =================
  const TDUR = { turn: 1.15, wipe: 0.85, lift: 1.05 };
  function fxEls() {
    if (MM.fx) return MM.fx;
    const w = h('<div id="mm-fx"><div class="fshadow"></div><div class="flapw"><div class="flap"></div></div><div class="wsh"></div><div class="wl"></div></div>');
    document.getElementById('stage').insertBefore(w, document.getElementById('grain'));
    MM.fx = { w, line: $('.wl', w), wsh: $('.wsh', w), sh: $('.fshadow', w), fw: $('.flapw', w), flap: $('.flap', w) };
    return MM.fx;
  }
  function clipHalf(poly, n, s, sign) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const da = sign * (a[0] * n[0] + a[1] * n[1] - s), db = sign * (b[0] * n[0] + b[1] * n[1] - s);
      if (da >= 0) out.push(a);
      if ((da >= 0) !== (db >= 0)) { const t = da / (da - db); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  const reflect = (p, n, s) => { const dd = p[0] * n[0] + p[1] * n[1] - s; return [p[0] - 2 * dd * n[0], p[1] - 2 * dd * n[1]]; };
  const polyCss = (pts) => (pts.length > 2 ? `polygon(${pts.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',')})` : 'polygon(0 0,0 0,0 0)');

  function transitions(id, lt) {
    const f = fxEls();
    f.line.style.opacity = 0; f.wsh.style.opacity = 0; f.sh.style.opacity = 0; f.fw.style.display = 'none';
    const order = window.TIMELINE.scenes.map((s) => s.id), prev = order[order.indexOf(id) - 1], kind = MM.trans[id];
    const active = prev && kind && lt < TDUR[kind];
    // halaman aktif tidak pernah membawa status "halaman yang dibalik" (aman untuk seek mundur / pratinjau)
    const cur = document.getElementById('s-' + id);
    if (cur.classList.contains('mm-carry')) { cur.classList.remove('mm-carry'); cur.style.boxShadow = ''; }
    cur.style.clipPath = 'none';
    order.forEach((sid) => {
      if (sid === id || (active && sid === prev)) return;
      const el = document.getElementById('s-' + sid);
      if (el && el.classList.contains('mm-carry')) { el.classList.remove('mm-carry'); el.style.clipPath = 'none'; el.style.boxShadow = ''; el.style.display = 'none'; }
    });
    if (!active) return;
    const ps = document.getElementById('s-' + prev), pd = MM.dur[prev] ?? 5;
    ps.style.display = 'block';
    ps.classList.add('mm-carry');
    if (MM.R[prev]) MM.R[prev](pd, pd);
    const sc = 1 + (MM.push[prev] ?? 0.018);
    ps.style.transform = `scale(${sc})`; ps.style.opacity = 1; ps.style.filter = 'none'; ps.style.boxShadow = '';
    const toL = (p) => [SW / 2 + (p[0] - SW / 2) / sc, SH / 2 + (p[1] - SH / 2) / sc];
    const k = P(lt, 0, TDUR[kind]);
    if (kind === 'wipe') { // garis tinta tipis menyapu halaman
      const X = lerp(-8, SW + 8, E.io3(k));
      ps.style.clipPath = `inset(0 0 0 ${toL([X, 0])[0].toFixed(1)}px)`;
      const o = P(k, 0, 0.05) * (1 - P(k, 0.95, 1));
      f.line.style.opacity = o; f.line.style.transform = `translateX(${X.toFixed(1)}px)`;
      f.wsh.style.opacity = o; f.wsh.style.transform = `translateX(${(X - 70).toFixed(1)}px)`;
      return;
    }
    if (kind === 'lift') { // lembar atas diangkat lalu digeser keluar, bayangannya jatuh di halaman baru
      const e = E.io3(k), up = Math.sin(Math.PI * Math.min(1, k * 1.25));
      ps.style.clipPath = 'none';
      ps.style.transform = `translate(${(SW * 0.035 * e).toFixed(1)}px, ${(-SH * 1.1 * e).toFixed(1)}px) rotate(${(-2.2 * e).toFixed(3)}deg) scale(${(sc * (1 + 0.012 * up)).toFixed(5)})`;
      ps.style.boxShadow = `0 ${(24 + 40 * e).toFixed(0)}px ${(50 + 60 * e).toFixed(0)}px rgba(48,36,14,${(0.34 * up).toFixed(3)})`;
      return;
    }
    // balik halaman: sudut kanan-bawah terangkat, lipatan bergerak ke kiri-atas
    const e = E.io3(k), n = V ? [0.86, 0.51] : [0.958, 0.287];
    const C = [[0, 0], [SW, 0], [SW, SH], [0, SH]], dots = C.map((c) => c[0] * n[0] + c[1] * n[1]);
    const smax = Math.max(...dots), smin = Math.min(...dots), s = lerp(smax + 4, smin - 80, e);
    const A = clipHalf(C, n, s, -1), B = clipHalf(C, n, s, 1), F = B.map((p) => reflect(p, n, s));
    ps.style.clipPath = polyCss(A.map(toL));
    if (F.length > 2) {
      f.fw.style.display = 'block';
      f.flap.style.clipPath = polyCss(F);
      const g = [-n[0], -n[1]], ang = Math.atan2(g[0], -g[1]) * 180 / Math.PI, gmin = Math.min(...C.map((c) => c[0] * g[0] + c[1] * g[1]));
      const f0 = -s - gmin, wB = smax - s;
      f.flap.style.background = `linear-gradient(${ang.toFixed(2)}deg, #FFFDF8 ${f0.toFixed(1)}px, #F4EEE3 ${(f0 + 16).toFixed(1)}px, #E7DECD ${(f0 + 44).toFixed(1)}px, #F2EBDF ${(f0 + 120).toFixed(1)}px, #ECE4D4 ${(f0 + Math.max(170, wB * 0.7)).toFixed(1)}px, #E0D5C0 ${(f0 + Math.max(210, wB)).toFixed(1)}px)`;
      const an = Math.atan2(n[0], -n[1]) * 180 / Math.PI, f1 = s - smin;
      f.sh.style.clipPath = polyCss(B);
      f.sh.style.background = `linear-gradient(${an.toFixed(2)}deg, rgba(40,30,12,.28) ${f1.toFixed(1)}px, rgba(40,30,12,.09) ${(f1 + 60).toFixed(1)}px, rgba(40,30,12,0) ${(f1 + 190).toFixed(1)}px)`;
      f.sh.style.opacity = 1 - P(e, 0.8, 1);
    }
  }

  KIT.style({
    fonts: ['400 20px "Cormorant Garamond"', '500 20px "Cormorant Garamond"', '600 20px "Cormorant Garamond"',
      'italic 400 20px "Cormorant Garamond"', 'italic 500 20px "Cormorant Garamond"', 'italic 600 20px "Cormorant Garamond"'],
    // warna ke-5 (debu kit) transparan: kertas tanpa partikel
    themes: { ivory: ['#F5F1E8', '#F5F1E8', '#F5F1E8', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'] },
    bg: (cx, t, id, theme, W, H) => {
      if (!PAPER) {
        PAPER = makePaper(W, H);
        document.getElementById('stage').style.setProperty('--paper', `url(${PAPER.toDataURL('image/jpeg', 0.92)})`);
      }
      cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
      cx.drawImage(PAPER, 0, 0);
      // cahaya hangat jendela yang bergeser sangat pelan
      const lx = W * (0.62 + 0.3 * Math.sin(t * 0.04)), ly = H * (0.02 + 0.06 * Math.cos(t * 0.05));
      const g = cx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(W, H) * 1.0);
      g.addColorStop(0, 'rgba(255,252,244,.46)'); g.addColorStop(0.5, 'rgba(255,250,240,.08)'); g.addColorStop(1, 'rgba(140,112,66,.07)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
    frame: (id, lt) => transitions(id, lt),
  });

  // =====================================================================
  // S1 · sampul: kop "MEMO — RAHASIA", "Memo." raksasa, tabel Kepada / Dari / Perihal / Tanggal
  // =====================================================================
  KIT.registerType('mm-cover', (root, v, sc) => {
    const ch = chrome(root, sc.id, 1);
    const lh = h(`<div class="c1-lh"><i></i><span>${esc(v.letterhead)}</span><i></i></div>`);
    root.appendChild(lh);
    const [lr1, lr2] = lh.querySelectorAll('i'), lhs = $('span', lh);
    const big = h(`<div class="c1-big"><div class="drift"><span class="ln">${esc(v.title)}</span></div></div>`);
    root.appendChild(big);
    const bigLn = $('.ln', big), drift = $('.drift', big);
    const tbl = h(`<div class="c1-tbl"><i class="rl0"></i>${v.rows.map(([k, val]) => `<div class="row"><span class="lb">${esc(k)}</span><span class="vl">${md(val)}</span><i class="rl"></i></div>`).join('')}<i class="rl2"></i></div>`);
    root.appendChild(tbl);
    const rows = [...tbl.querySelectorAll('.row')].map((r) => ({ lb: $('.lb', r), vl: $('.vl', r), rl: $('.rl', r) }));
    const rl0 = $('.rl0', tbl), rl2 = $('.rl2', tbl), A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      const kl = E.io3(P(lt, A.lh, A.lh + 1.2));
      draw(lr1, kl); draw(lr2, kl);
      inkAt(lhs, A.lh + 0.3, lt, 0.9, 30);
      inkAt(bigLn, A.title, lt, 1.7, 24);
      drift.style.transform = `translateY(${lerp(6, -8, P(lt, 0, d)).toFixed(2)}px)`;
      drawAt(rl0, A.rows[0] - 0.35, lt, 0.9);
      rows.forEach((r, i) => {
        const t0 = A.rows[i];
        riseAt(r.lb, t0, lt, 0.6, 8);
        inkAt(r.vl, t0 + 0.1, lt, 0.95);
        drawAt(r.rl, t0 + 0.2, lt, 0.9);
      });
      drawAt(rl2, A.rows[3] + 0.6, lt, 1.0);
    });
  });

  // =====================================================================
  // S2 · UU PDP berlaku penuh sejak Oktober 2024 + garis waktu
  // =====================================================================
  function timeline(root, cfg) {
    const X0 = pick(160, 80), X1 = pick(1760, 1000), Y = pick(842, 1062);
    const mon = (d) => (d[0] - cfg.from[0]) * 12 + (d[1] - cfg.from[1]);
    const total = mon(cfg.to), X = (d) => X0 + (X1 - X0) * mon(d) / total;
    const el = h('<div class="tl"></div>');
    root.appendChild(el);
    const add = (html, css) => { const e = h(html); Object.assign(e.style, css); el.appendChild(e); return e; };
    const base = add('<i class="tl-base"></i>', { left: X0 + 'px', top: Y + 'px', width: (X1 - X0) + 'px' });
    const years = cfg.years.map((y) => {
      const x = X([y, 1]);
      return { tk: add('<i class="tl-tk"></i>', { left: x + 'px', top: (Y - 6) + 'px' }), lb: add(`<span class="tl-yr">${y}</span>`, { left: x + 'px', top: (Y + 18) + 'px' }) };
    });
    const seg = add('<i class="tl-seg"></i>', { left: X(cfg.seg[0]) + 'px', top: (Y - 1) + 'px', width: (X(cfg.seg[1]) - X(cfg.seg[0])) + 'px' });
    const dash = add('<i class="tl-dash"></i>', { left: X(cfg.dash[0]) + 'px', top: Y + 'px', width: (X(cfg.dash[1]) - X(cfg.dash[0])) + 'px' });
    const marks = cfg.marks.map((m) => {
      const x = X(m.d), right = x > X1 - 140;
      const dot = add(`<i class="tl-dot${m.future ? ' fut' : ''}${m.strong ? ' str' : ''}"></i>`, { left: x + 'px', top: Y + 'px' });
      const lb = add(`<div class="tl-lb ${m.pos}${m.strong ? ' str' : ''}${right ? ' rt' : ''}"><b>${esc(m.t)}</b><span>${esc(m.s)}</span></div>`, right ? { right: (SW - x - 8) + 'px', top: Y + 'px' } : { left: x + 'px', top: Y + 'px' });
      return { dot, lb };
    });
    return (lt, A) => {
      drawAt(base, A.base, lt, 1.4);
      years.forEach((y, i) => { const t0 = A.base + 0.25 + i * 0.15; riseAt(y.tk, t0, lt, 0.4, 0); riseAt(y.lb, t0 + 0.05, lt, 0.6, 6); });
      drawAt(seg, A.seg, lt, 1.3);
      drawAt(dash, A.dash, lt, 1.1);
      const mt = [A.seg - 0.1, A.seg + 1.15, A.dash + 1.0];
      marks.forEach((m, i) => {
        const k = E.outBack(P(lt, mt[i], mt[i] + 0.45));
        m.dot.style.transform = `translate(-50%, -50%) scale(${Math.max(0, k).toFixed(3)})`;
        riseAt(m.lb, mt[i] + 0.1, lt, 0.6, m.lb.classList.contains('dn') ? -8 : 8);
      });
    };
  }
  KIT.registerType('mm-law', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's2-sec');
    const hd = block(root, 'mm-h s2-h', L(v.lines));
    const pu = penUnder(hd.el, 3);
    const tl = timeline(root, v.tl);
    const fn = footnote(root, v.note, 's2-fn');
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      inkLines(hd.lns, A.lines, lt, 1.0);
      pu(ios(P(lt, A.pen, A.pen + 0.55)));
      tl(lt, A.tl);
      fn(A.note, lt);
    });
  });

  // =====================================================================
  // S3 · PP 33/2026 berlaku 16 Januari 2027 — angka besar ala laporan tahunan, dilingkari pena biru
  // =====================================================================
  KIT.registerType('mm-date', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's3-sec');
    const lead = block(root, 'mm-h s3-lead', [v.lead]);
    const fig = h(`<div class="s3-fig"><div class="d16">${esc(v.day)}</div><div class="dmy"><div class="mo"><span class="ln">${esc(v.month)}</span></div><div class="yr">${esc(v.year)}</div></div></div>`);
    root.appendChild(fig);
    const d16 = $('.d16', fig), dc = chars(d16), mo = $('.mo .ln', fig), yc = chars($('.yr', fig));
    const cap = h(`<div class="s3-cap"><i class="rl"></i><div class="ct">${L(v.cap).map((l) => `<span class="ln">${md(l)}</span>`).join('')}</div></div>`);
    root.appendChild(cap);
    const capRl = $('.rl', cap), capLns = [...cap.querySelectorAll('.ln')];
    const fn = footnote(root, v.note, 's3-fn');
    let oval = null;
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      inkLines(lead.lns, A.lead, lt, 1.0);
      riseChars(dc, A.day, lt, { gap: 0.14, dur: 1.1 });
      inkAt(mo, A.month, lt, 0.9);
      riseChars(yc, A.year, lt, { gap: 0.1, dur: 1.0 });
      fig.style.transform = `translateY(${lerp(4, -6, P(lt, 0, d)).toFixed(2)}px)`;
      if (!oval && d16.offsetWidth) { // lingkaran pena di sekeliling "16"
        const w = d16.offsetWidth * 1.12, hh = d16.offsetHeight * 0.76;
        oval = penSvg(fig, ovalD(w, hh, 2.1), w, hh, 'pen-o');
        oval.style.left = (d16.offsetLeft + d16.offsetWidth / 2 - w / 2).toFixed(1) + 'px';
        oval.style.top = (d16.offsetTop + d16.offsetHeight * 0.53 - hh / 2).toFixed(1) + 'px';
      }
      penK(oval, ios(P(lt, A.pen, A.pen + 0.9)));
      drawAt(capRl, A.cap - 0.2, lt, 0.8);
      inkLines(capLns, A.cap, lt, 1.0);
      fn(A.note, lt);
    });
  });

  // =====================================================================
  // S4 · bukan lagi urusan satu divisi → nasabah, karyawan, pihak ketiga (triptik)
  // =====================================================================
  KIT.registerType('mm-scope', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's4-sec');
    const hd = block(root, 'mm-h s4-h', L(v.lines));
    const rule = h('<i class="s4-rule"></i>');
    root.appendChild(rule);
    const lead = block(root, 'mm-h s4-lead', [v.lead]);
    const cols = v.cols.map(([ix, w], i) => {
      const el = h(`<div class="s4-col c${i}"><i class="rl"></i><b>(${esc(ix)})</b><div class="w"><span class="ln">${md(w)}</span></div></div>`);
      root.appendChild(el);
      return { el, rl: $('.rl', el), ix: $('b', el), w: $('.ln', el) };
    });
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      inkLines(hd.lns, A.lines, lt, 1.1);
      drawAt(rule, A.rule, lt, 1.0);
      inkLines(lead.lns, A.lead, lt, 0.9);
      cols.forEach((c, i) => {
        const t0 = A.cols[i];
        drawAt(c.rl, t0 - 0.15, lt, 0.7);
        riseAt(c.ix, t0, lt, 0.6, 6);
        inkAt(c.w, t0 + 0.1, lt, 1.0);
        c.el.style.transform = `translateY(${lerp(3, -4, P(lt, t0, d)).toFixed(2)}px)`;
      });
    });
  });

  // =====================================================================
  // S5 · taruhan: "2%" raksasa · cincin 72 jam (3 × 24 garis) yang terisi
  // =====================================================================
  function ringSvg(R, r1, r2) {
    let s = '';
    for (let i = 0; i < 72; i++) {
      const a = -Math.PI / 2 + (i + 0.5) / 72 * Math.PI * 2, day = i % 24 === 0;
      const ra = day ? r1 - 10 : r1, c = Math.cos(a), sn = Math.sin(a);
      s += `<line class="tk${day ? ' day' : ''}" x1="${(R + c * ra).toFixed(2)}" y1="${(R + sn * ra).toFixed(2)}" x2="${(R + c * r2).toFixed(2)}" y2="${(R + sn * r2).toFixed(2)}"/>`;
    }
    return `<svg class="ring" width="${R * 2}" height="${R * 2}" viewBox="0 0 ${R * 2} ${R * 2}">${s}</svg>`;
  }
  KIT.registerType('mm-stakes', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's5-sec');
    const lns = (x) => L(x).map((l) => `<span class="ln">${md(l)}</span>`).join('');
    const left = h(`<div class="s5-l"><div class="pct">${esc(v.pct)}</div><i class="rl"></i><div class="cap">${lns(v.cap1)}</div><div class="ref"></div></div>`);
    root.appendChild(left);
    const pc = chars($('.pct', left)), lrl = $('.rl', left), lcap = [...left.querySelectorAll('.cap .ln')];
    $('.ref', left).textContent = v.ref1;
    const lref = typeSplit($('.ref', left));
    const div = h('<i class="s5-div"></i>');
    root.appendChild(div);
    const R = pick(232, 172);
    const right = h(`<div class="s5-r"><div class="dial">${ringSvg(R, R - 24, R - 4)}<div class="fig"><div class="n">${esc(v.big2)}</div><div class="u"><span class="ln">${esc(v.unit2)}</span></div></div></div>
      <div class="txt"><div class="cap">${lns(v.cap2)}</div><div class="ref"></div></div></div>`);
    root.appendChild(right);
    const ticks = [...right.querySelectorAll('.tk')], nc = chars($('.n', right)), un = $('.u .ln', right), rcap = [...right.querySelectorAll('.cap .ln')], dial = $('.dial', right);
    $('.ref', right).textContent = v.ref2;
    const rref = typeSplit($('.ref', right));
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      riseChars(pc, A.pct, lt, { gap: 0.16, dur: 1.2 });
      $('.pct', left).style.transform = `translateY(${lerp(4, -6, P(lt, 0, d)).toFixed(2)}px)`;
      drawAt(lrl, A.cap1 - 0.3, lt, 0.8);
      inkLines(lcap, A.cap1, lt, 1.0);
      typeOn(lref, A.ref1, lt, 40);
      drawAt(div, A.div, lt, 1.0, pick('Y', 'X'));
      // cincin: garis muncul berurutan, lalu terisi searah jarum jam (72 jam)
      const kf = P(lt, A.fill[0], A.fill[1]), filled = Math.floor(kf * 72 + 1e-6);
      ticks.forEach((tk, i) => {
        const ka = P(lt, A.ring + i * 0.012, A.ring + i * 0.012 + 0.25);
        tk.style.opacity = (ka * (i < filled ? 1 : 0.22)).toFixed(3);
        tk.classList.toggle('on', i < filled);
      });
      dial.style.transform = `rotate(${lerp(-4, 0, E.out3(P(lt, A.ring, A.ring + 1.5))).toFixed(3)}deg)`;
      riseChars(nc, A.big2, lt, { gap: 0.09, dur: 1.0 });
      inkAt(un, A.big2 + 0.5, lt, 0.7);
      inkLines(rcap, A.cap2, lt, 1.0);
      typeOn(rref, A.ref2, lt, 40);
    });
  });

  // =====================================================================
  // S6 · kutipan: “Tunjukkan buktinya.” (tanda kutip menggantung + garis bawah pena)
  // =====================================================================
  KIT.registerType('mm-quote', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's6-sec');
    const qm = h('<div class="s6-qm">”</div>');
    root.appendChild(qm);
    const ls = v.lines.map((l, i) => (i === 0 ? `<span class="hang">“</span>${md(l)}` : md(l) + (i === v.lines.length - 1 ? '”' : '')));
    const q = h(`<div class="mm-h s6-q">${ls.map((l) => `<span class="ln">${l}</span>`).join('')}</div>`);
    root.appendChild(q);
    const qlns = [...q.querySelectorAll('.ln')];
    const pu = penUnder(q, 7, { dy: 0.2, ext: 0.03 });
    const attr = h(`<div class="s6-attr"><i></i><span>${esc(v.attr)}</span></div>`);
    root.appendChild(attr);
    const fn = footnote(root, v.note, 's6-fn');
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      const kq = E.out3(P(lt, A.qm, A.qm + 1.6));
      qm.style.opacity = (kq * 0.05).toFixed(3);
      qm.style.transform = `translate(${lerp(-10, 6, P(lt, 0, d)).toFixed(2)}px, ${((1 - kq) * 30 + lerp(0, -10, P(lt, 0, d))).toFixed(2)}px)`;
      inkLines(qlns, A.lines, lt, 1.25, 22);
      q.style.transform = `translateY(${lerp(3, -5, P(lt, 0, d)).toFixed(2)}px)`;
      pu(ios(P(lt, A.pen, A.pen + 0.6)));
      drawAt($('i', attr), A.attr, lt, 0.6);
      inkAt($('span', attr), A.attr + 0.2, lt, 0.9, 30);
      fn(A.note, lt);
    });
  });

  // =====================================================================
  // S7 · usulan: daftar bernomor 01–07 (kapabilitas dari fakta_produk.json) + rujukan pasal UU PDP
  // =====================================================================
  KIT.registerType('mm-list', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's7-sec');
    const hd = block(root, 'mm-h s7-h', L(v.lines));
    const cap = h(`<div class="s7-cap">${esc(v.caption)}</div>`);
    root.appendChild(cap);
    const hdr = h(`<div class="s7-hdr"><span>${esc(v.hdr[0])}</span><span>${esc(v.hdr[1])}</span><i></i></div>`);
    root.appendChild(hdr);
    const list = h('<div class="s7-list"></div>');
    root.appendChild(list);
    const rows = v.rows.map((r, i) => {
      const el = h(`<div class="s7-row"><b class="no">${pad2(i + 1)}</b><div class="tt"><span class="ln">${md(r.t)}</span>${r.tag ? `<span class="tag">${esc(r.tag)}</span>` : ''}</div><div class="sb">${md(r.s)}</div><span class="ref">${esc(r.r)}</span><i class="rl"></i></div>`);
      list.appendChild(el);
      return { el, no: $('.no', el), tt: $('.tt .ln', el), tag: $('.tag', el), sb: $('.sb', el), rf: typeSplit($('.ref', el)), rl: $('.rl', el) };
    });
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      inkLines(hd.lns, A.lines, lt, 0.95);
      riseAt(cap, A.caption, lt, 0.8, 8);
      $('span', hdr).style.opacity = E.out3(P(lt, A.hdr, A.hdr + 0.6));
      hdr.children[1].style.opacity = E.out3(P(lt, A.hdr + 0.15, A.hdr + 0.75));
      drawAt($('i', hdr), A.hdr - 0.1, lt, 1.0);
      rows.forEach((r, i) => {
        const t0 = A.rows[i];
        drawAt(r.rl, t0, lt, 0.9);
        riseAt(r.no, t0 + 0.05, lt, 0.6, 10);
        inkAt(r.tt, t0 + 0.1, lt, 0.9);
        if (r.tag) riseAt(r.tag, t0 + 0.65, lt, 0.5, 4);
        riseAt(r.sb, t0 + 0.45, lt, 0.7, 6);
        typeOn(r.rf, t0 + 0.7, lt, 30);
      });
    });
  });

  // =====================================================================
  // S8 · arsitektur: tiga fakta platform dengan ikon garis tipis
  // =====================================================================
  const ICONS = {
    deploy: ['M14 30a10 10 0 0 1 2-19.8A13 13 0 0 1 41 13a9 9 0 0 1 1 17.9H14z', 'M30 38h22a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H30a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z', 'M30 52h22a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H30a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3z', 'M33 44h2M33 57h2M20 31v12h7'],
    db: ['M12 14c0-4 9-7 20-7s20 3 20 7-9 7-20 7-20-3-20-7z', 'M12 14v34c0 4 9 7 20 7s20-3 20-7V14', 'M12 26c0 4 9 7 20 7s20-3 20-7', 'M12 37c0 4 9 7 20 7s20-3 20-7'],
    chain: ['M26 38l-6 6a8 8 0 0 1-11.3-11.3l8-8A8 8 0 0 1 28 24.5', 'M38 26l6-6a8 8 0 0 1 11.3 11.3l-8 8A8 8 0 0 1 36 39.5', 'M25 39l14-14', 'M49 46l-2 12M55 46l-2 12M45 50h12M44 55h12'],
  };
  const icon = (n) => `<svg class="ico" width="64" height="64" viewBox="0 0 64 64">${ICONS[n].map((d) => `<path d="${d}" pathLength="1"/>`).join('')}</svg>`;
  KIT.registerType('mm-arch', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's8-sec');
    const hd = block(root, 'mm-h s8-h', L(v.lines));
    const cols = v.cols.map((c, i) => {
      const el = h(`<div class="s8-col c${i}"><i class="rl"></i>${icon(c.ic)}<b class="ix">${esc(c.ix)}</b><div class="tt"><span class="ln">${md(c.t)}</span></div><div class="sb">${md(c.s)}</div></div>`);
      root.appendChild(el);
      return { el, rl: $('.rl', el), paths: [...el.querySelectorAll('.ico path')], ix: $('.ix', el), tt: $('.tt .ln', el), sb: $('.sb', el) };
    });
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      inkLines(hd.lns, A.lines, lt, 1.0);
      cols.forEach((c, i) => {
        const t0 = A.cols[i];
        drawAt(c.rl, t0 - 0.2, lt, 0.8);
        c.paths.forEach((p, j) => { p.style.strokeDashoffset = (1 - ios(P(lt, t0 + j * 0.12, t0 + j * 0.12 + 0.8))).toFixed(4); });
        riseAt(c.ix, t0 + 0.2, lt, 0.6, 6);
        inkAt(c.tt, t0 + 0.3, lt, 0.95);
        riseAt(c.sb, t0 + 0.75, lt, 0.7, 6);
        c.el.style.transform = `translateY(${lerp(3, -4, P(lt, t0, d)).toFixed(2)}px)`;
      });
    });
  });

  // =====================================================================
  // S9 · rekomendasi + paraf pena biru "Kantor DPO" + stempel DISETUJUI
  // =====================================================================
  // paraf: goresan tunggal berliku (bukan tanda tangan orang nyata) + garis ayun di bawahnya
  const SIGN = 'M20 96C28 70 40 34 58 16c10-10 22-8 18 10-5 24-30 58-46 70-9 7-16 4-10-6 14-22 52-34 78-34'
    + 'M88 58c-8 2-14 14-8 22 6 7 18-2 22-12 2 8 4 18 12 16 8-2 12-18 18-26-2 10-2 24 6 24 9 0 14-20 22-30 0 12 0 26 9 26 12 0 18-40 30-66 6-13 16-14 13 2-4 22-16 46-22 64-3 9 3 12 10 6 10-8 18-16 28-16 9 0 6 12 16 12 12 0 22-8 34-12'
    + 'M30 120c50-10 120-14 196-12 46 1 90 6 128-2 6-1 10-4 8-8';
  function stampCanvas(W, Hh, txt) {
    const c = document.createElement('canvas'), S = 2;
    c.width = W * S; c.height = Hh * S; c.style.width = W + 'px'; c.style.height = Hh + 'px';
    c._paint = () => {
      const x = c.getContext('2d');
      x.setTransform(S, 0, 0, S, 0, 0);
      x.clearRect(0, 0, W, Hh);
      x.fillStyle = BLUE; x.strokeStyle = BLUE;
      const rr = (X, Y, w, hh, r) => { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + hh, r); x.arcTo(X + w, Y + hh, X, Y + hh, r); x.arcTo(X, Y + hh, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); };
      x.lineWidth = 6; rr(5, 5, W - 10, Hh - 10, 14); x.stroke();
      x.lineWidth = 2; rr(16, 16, W - 32, Hh - 32, 8); x.stroke();
      x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      const sp = (px) => { try { x.letterSpacing = px + 'px'; } catch (e) { /* abaikan */ } };
      x.font = `700 ${Math.round(Hh * 0.1)}px "Plus Jakarta Sans"`; sp(Hh * 0.04);
      x.fillText(txt.top, W / 2 + Hh * 0.02, Hh * 0.27);
      x.fillText(txt.bot, W / 2 + Hh * 0.02, Hh * 0.86);
      x.lineWidth = 1.6;
      [Hh * 0.335, Hh * 0.735].forEach((yy) => { x.beginPath(); x.moveTo(W * 0.12, yy); x.lineTo(W * 0.88, yy); x.stroke(); });
      x.font = `800 ${Math.round(Hh * 0.3)}px "Plus Jakarta Sans"`; sp(Hh * 0.035);
      x.fillText(txt.main, W / 2 + Hh * 0.017, Hh * 0.645);
      sp(0);
      // tinta tidak rata: bintik & goresan terang (deterministik)
      x.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < 3200; i++) {
        const px = hash(i * 1.37 + 3) * W, py = hash(i * 2.11 + 5) * Hh, r = 0.3 + Math.pow(hash(i * 3.3 + 7), 3) * 1.7;
        x.globalAlpha = 0.3 + 0.7 * hash(i * 4.1 + 9);
        x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
      }
      for (let k = 0; k < 8; k++) {
        x.globalAlpha = 0.05 + 0.07 * hash(k * 5.1 + 2);
        const yy = hash(k * 7.7 + 1) * Hh, th = 2 + hash(k * 3.9 + 4) * 6;
        x.save(); x.translate(W / 2, yy); x.rotate((hash(k * 2.3) - 0.5) * 0.14); x.fillRect(-W, -th / 2, W * 2, th); x.restore();
      }
      const g = x.createLinearGradient(0, 0, W, Hh); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.55, 'rgba(0,0,0,.06)'); g.addColorStop(1, 'rgba(0,0,0,.34)');
      x.globalAlpha = 1; x.fillStyle = g; x.fillRect(0, 0, W, Hh);
      x.globalCompositeOperation = 'source-over';
      return true;
    };
    return c;
  }
  KIT.registerType('mm-close', (root, v, sc) => {
    const ch = chrome(root, sc.id, v.page);
    const sl = secLabel(root, v.sec, 's9-sec');
    const lead = block(root, 'mm-h s9-lead', [v.lead]);
    const hd = block(root, 'mm-h s9-h', L(v.lines));
    const sub = h(`<div class="s9-sub">${esc(v.sub)}</div>`);
    root.appendChild(sub);
    const sg = h(`<div class="s9-sign"><div class="rg"><span class="ln">${esc(v.regards)}</span></div><svg class="pen pen-s" width="380" height="132" viewBox="0 0 380 132"><path d="${SIGN}" pathLength="1"/></svg><i class="rl"></i><b>${esc(v.signer)}</b><span>${esc(v.signer2)}</span></div>`);
    root.appendChild(sg);
    const rg = $('.rg .ln', sg), sig = $('.pen-s', sg), srl = $('.rl', sg), sb = $('b', sg), ss = $('span:not(.ln)', sg);
    const SWp = pick(500, 470), SHp = Math.round(SWp * 0.42);
    const st = h('<div class="s9-stamp"></div>');
    const scv = stampCanvas(SWp, SHp, v.stamp);
    st.appendChild(scv);
    root.appendChild(st);
    let painted = false;
    const A = v.at;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      sl(A.sec, lt);
      inkLines(lead.lns, A.lead, lt, 0.8);
      inkLines(hd.lns, A.lines, lt, 1.2, 22);
      riseAt(sub, A.sub, lt, 0.8, 8);
      inkAt(rg, A.regards, lt, 0.8);
      penK(sig, P(lt, A.sign, A.sign + A.signDur)); // pena: kecepatan tetap (linear) seperti tangan
      drawAt(srl, A.name - 0.2, lt, 0.8);
      riseAt(sb, A.name, lt, 0.6, 6);
      riseAt(ss, A.name + 0.15, lt, 0.6, 6);
      // stempel: turun cepat, menghantam, tinta menempel (sedikit "memantul" lalu diam)
      if (!painted) painted = scv._paint();
      const k = P(lt, A.stamp - 0.12, A.stamp), k2 = P(lt, A.stamp, A.stamp + 0.35);
      const s = lt < A.stamp ? lerp(1.5, 1.04, E.in3(k)) : lerp(1.04, 1, E.out3(k2));
      st.style.opacity = lt < A.stamp ? (0.25 * k).toFixed(3) : (0.94 - 0.06 * P(lt, A.stamp + 0.3, A.stamp + 2)).toFixed(3);
      st.style.transform = `rotate(${lt < A.stamp ? -11 + 3 * k : -8}deg) scale(${s.toFixed(4)})`;
      st.style.filter = lt < A.stamp ? `blur(${(4 * (1 - k)).toFixed(2)}px)` : 'none';
      // getar kecil halaman saat stempel menghantam (deterministik)
      const sh = lt > A.stamp && lt < A.stamp + 0.22 ? (1 - (lt - A.stamp) / 0.22) * 3 : 0;
      root.style.translate = sh > 0.05 ? `${((hash(lt * 91) - 0.5) * sh).toFixed(2)}px ${((hash(lt * 71) - 0.5) * sh).toFixed(2)}px` : '';
    });
  });

  // =====================================================================
  // S10 · CTA: logo navy, tagline, ornamen, ajakan, alamat situs, kontak
  // =====================================================================
  KIT.registerType('mm-cta', (root, v, sc) => {
    const LW = pick(700, 780), LH = Math.round(LW * 180 / 1252);
    const lw = h('<div class="s10-logo"></div>');
    const lg = logoCanvas(LW);
    lw.appendChild(lg);
    root.appendChild(lw);
    const tag = h(`<div class="s10-tag">${esc(v.tag)}</div>`);
    root.appendChild(tag);
    const orn = h('<div class="s10-orn"><i></i><b></b><i></i></div>');
    root.appendChild(orn);
    const hd = block(root, 'mm-h s10-h', L(v.lines));
    const url = h(`<div class="s10-url"><span>${esc(v.url)}</span></div>`);
    root.appendChild(url);
    const foot = h(`<div class="s10-foot">${esc(v.foot)}</div>`);
    root.appendChild(foot);
    let drawn = false;
    const A = v.at;
    return reg(sc, (lt, d) => {
      if (!drawn) drawn = paintLogo(lg, NAVY);
      inkAt(lg, A.logo, lt, 1.4, 20);
      lw.style.transform = `translateY(${lerp(6, -4, E.out3(P(lt, A.logo, d))).toFixed(2)}px)`;
      riseAt(tag, A.tag, lt, 0.8, 8);
      const ko = E.io3(P(lt, A.orn, A.orn + 0.8));
      draw(orn.children[0], ko); draw(orn.children[2], ko);
      orn.children[1].style.transform = `rotate(45deg) scale(${Math.max(0, E.outBack(P(lt, A.orn + 0.3, A.orn + 0.7))).toFixed(3)})`;
      inkLines(hd.lns, A.lines, lt, 1.0);
      const ku = E.out3(P(lt, A.url, A.url + 0.8));
      url.style.opacity = ku.toFixed(3);
      url.style.transform = `translateY(${((1 - ku) * 10).toFixed(2)}px)`;
      url.style.clipPath = `inset(0 ${((1 - E.io3(P(lt, A.url, A.url + 0.7))) * 50).toFixed(2)}% 0 ${((1 - E.io3(P(lt, A.url, A.url + 0.7))) * 50).toFixed(2)}%)`;
      riseAt(foot, A.foot, lt, 0.8, 8);
    });
  });
})();
