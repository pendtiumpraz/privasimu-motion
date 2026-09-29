// N06 · "Pengguna termuda Anda" — gaya paper-craft cut-out + krayon.
// Latar kertas bertekstur (deterministik), potongan kertas bertepi sobek + bayangan tempel, gerak stop-motion 12 fps,
// coretan krayon (SVG + filter feTurbulence yang "mendidih"), transisi kertas sobek antar-scene.
// Layar produk = screenshot ASLI (assets/app/*.png) yang ditempel sebagai foto scrapbook; formulir, lini waktu,
// dan benang ke sistem adalah ilustrasi konsep dari kertas (bukan tiruan layar aplikasi).
(function () {
  const { V, SW, SH } = KIT;
  const { cl, P, lerp, E, hash } = MG;
  const mk = KIT.h, esc = KIT.esc;
  const pk = (a, b) => (V ? b : a);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FPS = 12;
  const Q = (t) => Math.round(t * FPS) / FPS;                  // waktu stop-motion (12 fps, dibulatkan agar sinkron dgn SFX)
  const ss = (k) => k * k * (3 - 2 * k);                      // smoothstep
  const oB = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : E.outBack(k));  // outBack aman: tepat 0 di awal
  const NS = 'http://www.w3.org/2000/svg';

  // ---------- palet ----------
  const INK = '#2F2B45', MUTE = '#7B7391';
  const C = {
    coral: '#EF8A6C', coralD: '#D5694D', butter: '#F6CF63', mint: '#95CFAE', mintD: '#3F9A6B', sky: '#96BFE6', skyD: '#3E68B0',
    lilac: '#BFA8E4', lilacD: '#7457B0', pink: '#F3A9BA', kraft: '#D8B98E', cream: '#FFFBF3', yellow: '#FFC83D',
  };
  const CRAY = { blue: '#2F55B0', red: '#DD5B3F', green: '#3E9A6B', ink: '#2F2B45', purple: '#6E4FB0', orange: '#E5862C' };
  const PAPER = { s1: '#F7E4D2', s2: '#F5EBCD', s3: '#E1EDDA', s4: '#E9E2F1', s5: '#DDE9F4', s6: '#F7E5D6', open: '#F2E9D9' };

  // ---------- tekstur kertas (dibuat sekali, deterministik) ----------
  function vnoise(size, cells, seed) {
    const g = [];
    for (let i = 0; i < cells * cells; i++) g.push(hash(i * 1.37 + seed));
    const at = (i, j) => g[(((j % cells) + cells) % cells) * cells + (((i % cells) + cells) % cells)];
    return (x, y) => {
      const fx = (x / size) * cells, fy = (y / size) * cells, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = ss(fx - x0), ty = ss(fy - y0);
      return lerp(lerp(at(x0, y0), at(x0 + 1, y0), tx), lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), tx), ty);
    };
  }
  function paperTile(size, seed, { dark = 20, light = 30, fibers = 90 } = {}) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const x = c.getContext('2d'), img = x.createImageData(size, size), d = img.data;
    const n1 = vnoise(size, 6, seed), n2 = vnoise(size, 24, seed + 5);
    for (let y = 0; y < size; y++) {
      for (let xx = 0; xx < size; xx++) {
        const i = y * size + xx, o = i * 4;
        const m = (n1(xx, y) - 0.5) * 1.1 + (n2(xx, y) - 0.5) * 0.7 + (hash(i * 0.7131 + seed) - 0.5) * 1.0;
        if (m > 0) { d[o] = 255; d[o + 1] = 253; d[o + 2] = 246; d[o + 3] = Math.min(255, m * light); }
        else { d[o] = 104; d[o + 1] = 76; d[o + 2] = 48; d[o + 3] = Math.min(255, -m * dark); }
      }
    }
    x.putImageData(img, 0, 0);
    x.lineCap = 'round';
    for (let k = 0; k < fibers; k++) {
      const px = hash(k * 3.1 + seed) * size, py = hash(k * 5.7 + seed) * size, a = hash(k * 7.3 + seed) * Math.PI * 2;
      const len = 5 + hash(k * 9.1 + seed) * 20, bend = (hash(k * 2.3 + seed) - 0.5) * 9, drk = hash(k * 4.4 + seed) > 0.6;
      x.strokeStyle = drk ? 'rgba(118,88,56,.10)' : 'rgba(255,255,255,.45)';
      x.lineWidth = 0.5 + hash(k * 6.6 + seed) * 0.8;
      for (const ox of [-size, 0, size]) for (const oy of [-size, 0, size]) {
        const sx = px + ox, sy = py + oy;
        if (sx < -30 || sx > size + 30 || sy < -30 || sy > size + 30) continue;
        x.beginPath();
        x.moveTo(sx, sy);
        x.quadraticCurveTo(sx + (Math.cos(a) * len) / 2 - Math.sin(a) * bend, sy + (Math.sin(a) * len) / 2 + Math.cos(a) * bend, sx + Math.cos(a) * len, sy + Math.sin(a) * len);
        x.stroke();
      }
    }
    return c;
  }
  document.documentElement.style.setProperty('--ptex', `url(${paperTile(256, 17, { dark: 16, light: 24, fibers: 70 }).toDataURL()})`);

  let BGTEX = null;
  function backdrop() {
    const c = document.createElement('canvas');
    c.width = SW; c.height = SH;
    const x = c.getContext('2d');
    x.fillStyle = x.createPattern(paperTile(512, 71, { dark: 18, light: 26, fibers: 240 }), 'repeat');
    x.fillRect(0, 0, SW, SH);
    for (let k = 0; k < 30; k++) { // bercak besar (tidak berulang)
      const px = hash(k * 1.9 + 3) * SW, py = hash(k * 2.7 + 9) * SH, r = 160 + hash(k * 3.3 + 1) * 460, lt = hash(k * 5.1) > 0.45;
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      g.addColorStop(0, lt ? 'rgba(255,253,246,.20)' : 'rgba(150,108,66,.07)');
      g.addColorStop(1, lt ? 'rgba(255,253,246,0)' : 'rgba(150,108,66,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, SW, SH);
    }
    return c;
  }

  // ---------- filter krayon (SVG) ----------
  document.body.insertAdjacentHTML('beforeend', `<svg id="n06defs" width="0" height="0" style="position:absolute;left:0;top:0" aria-hidden="true"><defs>
    <filter id="crayon" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
      <feTurbulence id="crT1" type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="2" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feTurbulence id="crT2" type="fractalNoise" baseFrequency="1.5" numOctaves="1" seed="9" result="g"/>
      <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -2.4 0 0 0 1.95" result="m"/>
      <feComposite in="d" in2="m" operator="in"/>
    </filter>
    <filter id="crayonSoft" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
      <feTurbulence id="crT3" type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs></svg>`);
  const TURB = [$('#crT1'), $('#crT2'), $('#crT3')];

  // ---------- util transform / waktu ----------
  function put(el, { x = 0, y = 0, s = 1, sx, sy, r = 0, rx = 0, ry = 0, o, p = 0 } = {}, j) {
    if (j) { x += j.x; y += j.y; r += j.r; }
    el.style.transform = `${p ? `perspective(${p}px) ` : ''}translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg)${rx ? ` rotateX(${rx.toFixed(2)}deg)` : ''}${ry ? ` rotateY(${ry.toFixed(2)}deg)` : ''} scale(${(sx ?? s).toFixed(4)},${(sy ?? s).toFixed(4)})`;
    if (o != null) el.style.opacity = o;
  }
  // "boil" stop-motion: getaran kecil yang berganti tiap 2 frame (6 fps)
  const jit = (q, seed, amp = 1) => {
    const f = Math.floor(q * 6 + 1e-6);
    return { x: (hash(f * 1.31 + seed * 7.7) - 0.5) * 2 * amp, y: (hash(f * 2.17 + seed * 3.3) - 0.5) * 2 * amp, r: (hash(f * 3.71 + seed * 1.9) - 0.5) * 0.5 * amp };
  };
  const show = (el, on) => { el.style.opacity = on ? 1 : 0; };
  function writeOn(el, q, t0, dur) { // tulisan tangan: terungkap kiri -> kanan, patah-patah 12 fps
    const k = P(q, t0, t0 + dur);
    el.style.opacity = k > 0 ? 1 : 0;
    el.style.clipPath = k >= 1 ? 'none' : `inset(-40% ${((1 - k) * 100).toFixed(1)}% -40% -6%)`;
  }
  function popWords(spans, times, q, { dur = 0.22, rot = 7, dy = 22 } = {}) {
    spans.forEach((sp, i) => {
      const k = P(q, times[i] - 0.05, times[i] - 0.05 + dur), kb = oB(k);
      sp.style.opacity = k > 0 ? 1 : 0;
      sp.style.transform = `translateY(${((1 - kb) * dy).toFixed(1)}px) rotate(${((1 - k) * (hash(i * 3.1 + 1) - 0.5) * rot * 2).toFixed(2)}deg) scale(${(0.55 + 0.45 * kb).toFixed(3)})`;
    });
  }
  // kata tampilan -> waktu kata VO (berurutan)
  function wordTimes(sc, text, fb = 0.4) {
    const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
    const words = sc.words || [], off = sc.voStart - sc.start;
    let j = 0, last = fb;
    return text.split(/\s+/).filter(Boolean).map((w) => {
      const n = norm(w);
      for (let k = j; k < words.length; k++) {
        const vw = norm(words[k].w);
        if (n && (vw === n || vw.startsWith(n) || (n.length > 3 && n.startsWith(vw) && vw.length > 3))) { j = k + 1; last = off + words[k].t; return last; }
      }
      last += 0.14;
      return last;
    });
  }

  // ---------- potongan kertas ----------
  function tornPts(w, h, seed, { torn = '', amp = 3, step = 9, inset = 0 } = {}) {
    const pts = [];
    const side = (x0, y0, x1, y1, key, sd) => {
      const L = Math.hypot(x1 - x0, y1 - y0), isT = torn.includes(key);
      const n = Math.max(2, Math.round(L / (isT ? step : 80)));
      const nx = (y1 - y0) / L, ny = -(x1 - x0) / L;
      for (let i = 0; i < n; i++) {
        const k = i / n;
        const j = isT
          ? (hash(sd + i * 1.618) - 0.5) * 2 * amp - amp * 0.9 - (hash(sd + i * 7.1) > 0.86 ? amp * 1.3 : 0) - inset
          : (hash(sd + i * 3.3) - 0.5) * 1.8 - (inset ? inset * 0.4 : 0);
        pts.push([x0 + (x1 - x0) * k + nx * j, y0 + (y1 - y0) * k + ny * j]);
      }
    };
    side(0, 0, w, 0, 't', seed); side(w, 0, w, h, 'r', seed + 11); side(w, h, 0, h, 'b', seed + 23); side(0, h, 0, 0, 'l', seed + 37);
    return pts;
  }
  const poly = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
  // paper({ w, h, color, seed, torn: 'tlbr', amp, radius, shadow, cls }) -> .pc (el.in = wadah isi)
  function paper(o) {
    const { w, h, color = C.cream, seed = 1, torn = '', amp = 3, radius, shadow = 'md', cls = '', tex = true, rim = !!torn } = o;
    const el = mk(`<div class="pc sh-${shadow} ${cls}" style="width:${w}px;height:${h}px"></div>`);
    if (rim) { const r = mk('<div class="pc-rim"></div>'); r.style.clipPath = poly(tornPts(w, h, seed, { torn, amp: amp * 0.55 })); el.appendChild(r); }
    const f = mk(`<div class="pc-face ${tex ? 'tex' : ''}"></div>`);
    f.style.backgroundColor = color;
    if (radius != null) f.style.borderRadius = typeof radius === 'number' ? radius + 'px' : radius;
    else f.style.clipPath = poly(tornPts(w, h, seed + 5, { torn, amp, inset: rim ? 3.5 : 0 }));
    el.appendChild(f);
    const inn = mk('<div class="pc-in"></div>');
    el.appendChild(inn);
    el.face = f; el.in = inn;
    return el;
  }
  // selotip washi dengan ujung bergerigi
  function tape(w, h, color, seed = 1, cls = '') {
    const el = mk(`<div class="tape ${cls}" style="width:${w}px;height:${h}px;background-color:${color}"></div>`);
    const pts = [];
    const n = 5;
    for (let i = 0; i <= n; i++) pts.push([(hash(seed + i) * 5).toFixed(1), (i / n) * h]);
    const pr = [];
    for (let i = n; i >= 0; i--) pr.push([w - hash(seed + 20 + i) * 5, (i / n) * h]);
    el.style.clipPath = `polygon(${[...pts.map(([x, y]) => `${x}px ${y}px`), ...pr.map(([x, y]) => `${x.toFixed(1)}px ${y}px`)].reverse().join(',')})`;
    return el;
  }
  // stiker emoji die-cut (tepi putih)
  function emo(ch, size, o = 5, cls = '') {
    return mk(`<div class="stk emo ${cls}" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.8)}px;--o:${o}px;--no:${-o}px">${ch}</div>`);
  }
  function lazy(el, fn) { if (!el._lz && el.offsetWidth) { el._lz = 1; fn(el.offsetWidth, el.offsetHeight); } }

  // ---------- coretan krayon ----------
  function svg(w, h, cls = '', soft = false) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    s.setAttribute('class', `cr ${soft ? 'soft' : ''} ${cls}`);
    return s;
  }
  function stroke(s, d, color, width = 6, draw = true) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', width);
    p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    if (draw) { p.setAttribute('pathLength', '1'); p.setAttribute('stroke-dasharray', '1 1'); p.setAttribute('stroke-dashoffset', '1'); p.style.opacity = 0; }
    s.appendChild(p);
    return p;
  }
  function drawK(p, k) { p.setAttribute('stroke-dashoffset', (1 - cl(k)).toFixed(4)); p.style.opacity = k > 0 ? 1 : 0; }
  function smooth(pts) {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function loopD(cx, cy, rx, ry, seed, turns = 1.18, n = 30) { // lingkaran coretan tangan
    const pts = [];
    const N = Math.round(n * turns);
    for (let i = 0; i <= N; i++) {
      const a = -Math.PI * 0.62 + (i / n) * Math.PI * 2, j = 1 + (hash(seed + i * 1.3) - 0.5) * 0.09 + (i / N) * 0.07;
      pts.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]);
    }
    return smooth(pts);
  }
  function underD(x0, x1, y, seed, back = true) {
    const pts = [], n = 7;
    for (let i = 0; i <= n; i++) pts.push([lerp(x0, x1, i / n), y + (hash(seed + i) - 0.5) * 6]);
    if (back) for (let i = n; i >= 2; i--) pts.push([lerp(x0, x1, i / n) - 10, y + 10 + (hash(seed + 20 + i) - 0.5) * 6]);
    return smooth(pts);
  }
  const tickD = (x, y, s) => `M${x} ${y + s * 0.52} Q${x + s * 0.22} ${y + s * 0.72} ${x + s * 0.38} ${y + s * 0.98} Q${x + s * 0.62} ${y + s * 0.42} ${x + s * 1.08} ${y - s * 0.06}`;
  function arrowD(x0, y0, x1, y1, bend = 0.25) {
    const mx = (x0 + x1) / 2 - (y1 - y0) * bend, my = (y0 + y1) / 2 + (x1 - x0) * bend;
    const a = Math.atan2(y1 - my, x1 - mx), L = 22;
    return {
      shaft: `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      head: `M${(x1 - Math.cos(a - 0.5) * L).toFixed(1)} ${(y1 - Math.sin(a - 0.5) * L).toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${(x1 - Math.cos(a + 0.5) * L).toFixed(1)} ${(y1 - Math.sin(a + 0.5) * L).toFixed(1)}`,
    };
  }
  const heartD = (x, y, s) => `M${x} ${y - s * 0.28} C${x - s * 0.18} ${y - s * 0.8} ${x - s * 0.95} ${y - s * 0.6} ${x - s * 0.72} ${y} C${x - s * 0.55} ${y + s * 0.38} ${x - s * 0.1} ${y + s * 0.62} ${x} ${y + s * 0.9} C${x + s * 0.1} ${y + s * 0.62} ${x + s * 0.55} ${y + s * 0.38} ${x + s * 0.72} ${y} C${x + s * 0.95} ${y - s * 0.6} ${x + s * 0.18} ${y - s * 0.8} ${x} ${y - s * 0.28}`;
  // tanda tangan wali (kursif) & coretan flourish — dirancang pada kotak 300x110, diskalakan
  const SIGN = 'M10 74 C18 38 34 14 46 26 C58 38 36 74 30 88 C48 58 64 36 78 48 C86 56 76 76 86 80 C98 84 106 50 118 48 C128 46 122 78 134 80 C146 82 154 42 166 44 C176 46 170 80 182 82 C198 84 208 38 226 32 C240 28 244 58 230 68 C218 76 242 84 256 70 C266 60 274 56 286 58';
  const SIGN2 = 'M36 100 C100 92 190 90 292 82';

  // ---------- foto scrapbook dari screenshot ASLI ----------
  // photo(root, { src, iw, ih, x, y, w, h, border, seed }) -> .pc foto; view(z, fx, fy) = pan/zoom halus (skala <= 1,4x asli);
  // map(fx, fy) -> koordinat lokal foto; ov = lapisan sorotan (transform disalin lewat sync()).
  function photo(root, o) {
    const B = o.border ?? 16, IW = o.iw, IH = o.ih;
    // bayangan tempel di pelat terpisah (box-shadow statis): foto tak perlu filter drop-shadow yang dihitung ulang tiap frame saat di-pan
    const el = paper({ w: o.w, h: o.h, color: '#FFFEFA', seed: o.seed || 5, shadow: 'none', cls: 'photo' });
    const shd = mk(`<div class="ph-shadow" style="width:${o.w}px;height:${o.h}px"></div>`);
    const ww = o.w - 2 * B, wh = o.h - 2 * B;
    const win = mk(`<div class="ph-win" style="left:${B}px;top:${B}px;width:${ww}px;height:${wh}px"><img src="${esc(o.src)}" alt="" style="width:${IW}px;height:${IH}px"></div>`);
    el.in.appendChild(win);
    const ov = mk(`<div class="ph-ov" style="width:${o.w}px;height:${o.h}px"></div>`);
    el.style.left = ov.style.left = shd.style.left = o.x + 'px';
    el.style.top = ov.style.top = shd.style.top = o.y + 'px';
    root.appendChild(shd);
    root.appendChild(el);
    root.appendChild(ov);
    const img = $('img', win), s0 = Math.max(ww / IW, wh / IH), zMax = Math.max(1, 1.4 / s0);
    let cur = { s: s0, tx: 0, ty: 0 };
    el.view = (z, fx, fy) => {
      const s = s0 * Math.min(z, zMax);
      const tx = cl(ww / 2 - fx * IW * s, ww - IW * s, 0), ty = cl(wh / 2 - fy * IH * s, wh - IH * s, 0);
      cur = { s, tx, ty };
      img.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${s.toFixed(5)})`;
    };
    el.map = (fx, fy) => [B + cur.tx + fx * IW * cur.s, B + cur.ty + fy * IH * cur.s];
    el.sync = () => { for (const x of [ov, shd]) { x.style.transform = el.style.transform; x.style.transformOrigin = el.style.transformOrigin; x.style.opacity = el.style.opacity; } };
    el.ov = ov;
    return el;
  }
  // keyframe pan/zoom: [{ t, z, fx, fy }] -> nilai halus (tidak dikuantisasi: gerak kamera halus)
  function viewAt(keys, lt) {
    if (lt <= keys[0].t) return keys[0];
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (lt < b.t) { const k = ss(P(lt, a.t, b.t)); return { z: lerp(a.z, b.z, k), fx: lerp(a.fx, b.fx, k), fy: lerp(a.fy, b.fy, k) }; }
    }
    return keys[keys.length - 1];
  }
  const panKeys = (pan, T) => (pan && pan.h ? pk(pan.h, pan.v) : pan || [{ at: 0, z: 1, fx: 0.5, fy: 0.5 }]).map((k) => ({ ...k, t: T(k.at, 0) }));
  // sorotan krayon + catatan tempel di atas foto
  // m: { at, off, fx, fy, fw, fh (pecahan gambar), kind: 'loop'|'under', color, note, n: { h: [dx, dy], v: [dx, dy] }, nr }
  function photoMarks(ph, list, T, fb = 2) {
    return (list || []).map((m, i) => {
      const s = svg(10, 10, 'ph-mark');
      const p = stroke(s, 'M0 0', m.color || CRAY.red, m.sw || 6);
      ph.ov.appendChild(s);
      let note = null;
      if (m.note) {
        note = mk(`<div class="ph-note sh-sm"><div class="pc-face tex" style="background-color:${m.noteBg || C.butter}"></div><span class="hw">${esc(m.note)}</span></div>`);
        ph.ov.appendChild(note);
      }
      return { m, s, p, note, at: T(m.at, fb + i), off: m.off != null ? T(m.off, 99) : 99, seed: 11 + i * 7 };
    });
  }
  function drawMarks(ph, list, q) {
    list.forEach((h) => {
      const m = h.m, k = P(q, h.at, h.at + 0.4), ko = P(q, h.off, h.off + 0.25);
      const [x0, y0] = ph.map(m.fx - m.fw / 2, m.fy - m.fh / 2), [x1, y1] = ph.map(m.fx + m.fw / 2, m.fy + m.fh / 2);
      const pad = 24, w = Math.max(20, x1 - x0) + pad * 2, hh = Math.max(14, y1 - y0) + pad * 2;
      if (k > 0) {
        h.s.setAttribute('width', w.toFixed(0)); h.s.setAttribute('height', hh.toFixed(0)); h.s.setAttribute('viewBox', `0 0 ${w.toFixed(0)} ${hh.toFixed(0)}`);
        h.s.style.left = (x0 - pad).toFixed(1) + 'px'; h.s.style.top = (y0 - pad).toFixed(1) + 'px';
        h.p.setAttribute('d', m.kind === 'under' ? underD(pad - 6, w - pad + 6, hh - pad + 8, h.seed) : loopD(w / 2, hh / 2, w / 2 - 6, hh / 2 - 5, h.seed));
      }
      drawK(h.p, k);
      h.s.style.opacity = 1 - ko;
      if (h.note) {
        const [dx, dy] = m.n ? pk(m.n.h, m.n.v) : [0, 40];
        const cx = (x0 + x1) / 2 + dx, cy = (dy >= 0 ? y1 : y0) + dy;
        const kn = oB(P(q, h.at + 0.18, h.at + 0.46));
        h.note.style.left = cx.toFixed(1) + 'px'; h.note.style.top = cy.toFixed(1) + 'px';
        put(h.note, { x: -h.note.offsetWidth / 2, y: -h.note.offsetHeight / 2, s: Math.max(0, kn), r: m.nr ?? -4, o: kn > 0 ? 1 - ko : 0 });
      }
    });
  }

  // ---------- overlay: kertas sobek + kedip cahaya stop-motion ----------
  let TEAR = null, tctx = null, tearDirty = false, FLICK = null, lastBoil = -1;
  const EDGES = {};
  function ensureOverlay() {
    if (TEAR) return;
    const stage = $('#stage'), grain = $('#grain');
    TEAR = document.createElement('canvas');
    TEAR.id = 'tear'; TEAR.width = SW; TEAR.height = SH;
    stage.insertBefore(TEAR, grain);
    tctx = TEAR.getContext('2d');
    FLICK = mk('<div id="flick"></div>');
    stage.insertBefore(FLICK, grain);
  }
  function tearLine(len, seed, amp = 16, step = 14) {
    const pts = [], n = Math.ceil(len / step);
    let drift = 0;
    for (let i = 0; i <= n; i++) {
      drift = drift * 0.8 + (hash(seed + i * 0.91) - 0.5) * amp * 0.7;
      pts.push([i * step, drift + (hash(seed + i * 2.37) - 0.5) * amp * 0.75 + (hash(seed + i * 5.3) > 0.88 ? amp * 0.55 : 0)]);
    }
    return pts;
  }
  function pathPts(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
  const WIPE = { s1: 'left', s2: 'up', s3: 'right', s4: 'up', s5: 'left' };
  function wipePoly(dir, e, seed, extra) {
    const horiz = dir === 'left' || dir === 'right', len = horiz ? SH : SW;
    const M = (s, p) => (dir === 'left' ? [SW - p, s] : dir === 'right' ? [p, s] : dir === 'up' ? [s, SH - p] : [s, p]);
    const L = EDGES[seed] || (EDGES[seed] = tearLine(len + 120, seed));
    const pts = [M(-60, -120), M(len + 60, -120)];
    for (let k = L.length - 1; k >= 0; k--) pts.push(M(L[k][0] - 60, e + L[k][1] + extra(k)));
    return pts;
  }
  function drawWipe(color, dir, k, seed) {
    const span = dir === 'left' || dir === 'right' ? SW : SH;
    const e = lerp(-60, span + 60, k);
    const rim = wipePoly(dir, e, seed, (i) => 6 + hash(seed + i * 3.3) * 10), face = wipePoly(dir, e, seed, () => 0);
    const sh = { left: [-14, 8], right: [14, 8], up: [4, -14], down: [4, 14] }[dir];
    tctx.save();
    tctx.shadowColor = 'rgba(84,52,26,.32)'; tctx.shadowBlur = 30; tctx.shadowOffsetX = sh[0]; tctx.shadowOffsetY = sh[1];
    pathPts(tctx, rim); tctx.fillStyle = '#FFFBF1'; tctx.fill();
    tctx.restore();
    pathPts(tctx, face); tctx.fillStyle = color; tctx.fill();
    tctx.save(); pathPts(tctx, face); tctx.clip(); tctx.drawImage(BGTEX, 0, 0); tctx.restore();
  }
  function drawOpen(q) {
    const crack = E.out3(P(q, 0.06, 0.22)), fly = E.in3(P(q, 0.22, 0.62));
    const L = EDGES.open || (EDGES.open = tearLine(SH + 240, 9, 22, 15));
    const edgeX = (i) => lerp(SW * 0.54, SW * 0.45, L[i][0] / (SH + 240)) + L[i][1];
    const edgeY = (i) => L[i][0] - 120;
    const left = [[-300, -200], ...L.map((_, i) => [edgeX(i), edgeY(i)]), [-300, SH + 200]];
    const right = [...L.map((_, i) => [edgeX(i), edgeY(i)]).reverse(), [SW + 300, -200], [SW + 300, SH + 200]].reverse();
    const pieces = [
      { pts: right, dx: 8 * crack + fly * SW * 0.7, dy: -fly * 40, r: fly * 7, ox: SW, rimSide: -1 },
      { pts: left, dx: -8 * crack - fly * SW * 0.7, dy: fly * 50, r: -fly * 9, ox: 0, rimSide: 1 },
    ];
    for (const pc of pieces) {
      tctx.save();
      tctx.translate(pc.ox + pc.dx, SH / 2 + pc.dy); tctx.rotate((pc.r * Math.PI) / 180); tctx.translate(-pc.ox, -SH / 2);
      if (crack > 0) { // tepi putih berserat di sepanjang sobekan
        const rimPts = pc.pts.map(([x, y], i) => {
          const onEdge = x > -290 && x < SW + 290;
          return onEdge ? [x + pc.rimSide * (5 + hash(i * 3.7 + 1) * 11) * crack, y] : [x, y];
        });
        tctx.save();
        tctx.shadowColor = 'rgba(84,52,26,.34)'; tctx.shadowBlur = 30; tctx.shadowOffsetX = pc.rimSide * 10; tctx.shadowOffsetY = 10;
        pathPts(tctx, rimPts); tctx.fillStyle = '#FFFBF1'; tctx.fill();
        tctx.restore();
      }
      pathPts(tctx, pc.pts); tctx.fillStyle = PAPER.open; tctx.fill();
      tctx.save(); pathPts(tctx, pc.pts); tctx.clip(); tctx.drawImage(BGTEX, 0, 0); tctx.restore();
      tctx.restore();
    }
  }
  function drawTear(id, i, lt, d, TL) {
    const q = Q(lt), next = TL.scenes[i + 1];
    let mode = null;
    if (i === 0 && q < 0.68) mode = 'open';
    if (next && WIPE[id] && lt >= d - 0.62) mode = 'wipe';
    if (!mode) { if (tearDirty) { tctx.clearRect(0, 0, SW, SH); tearDirty = false; } return; }
    tctx.clearRect(0, 0, SW, SH);
    tearDirty = true;
    if (mode === 'open') drawOpen(q);
    else drawWipe(PAPER[next.id] || PAPER.open, WIPE[id], ss(P(q, d - 0.6, d - 0.22)), 40 + i * 17);
  }

  KIT.style({
    fonts: ['600 20px "Baloo 2"', '700 20px "Baloo 2"', '800 20px "Baloo 2"', '600 20px "Caveat"', '700 20px "Caveat"', '400 20px "Patrick Hand"', '700 20px "Gaegu"'],
    themes: Object.fromEntries(Object.keys(PAPER).map((k) => ['p-' + k, [PAPER[k], PAPER[k], PAPER[k], 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']])),
    bg: (cx, t, id) => {
      if (!BGTEX) BGTEX = backdrop();
      cx.fillStyle = PAPER[id] || PAPER.open;
      cx.fillRect(0, 0, SW, SH);
      cx.drawImage(BGTEX, 0, 0);
    },
    frame: (id, lt, d, sec) => {
      ensureOverlay();
      const TL = window.TIMELINE, i = TL.scenes.findIndex((s) => s.id === id), t = TL.scenes[i].start + lt, q = Q(lt);
      // kamera stop-motion: dorongan pelan bertangga + "punch" pada kata kunci
      const pu = (sec._punch || []).reduce((a, tp) => a + (q >= tp && q < tp + 0.34 ? (1 - (q - tp) / 0.34) * 0.03 : 0), 0);
      sec.style.transform = `scale(${(1 + (0.018 * q) / d + pu).toFixed(4)})`;
      // krayon "mendidih" (ganti tekstur tiap 2 frame stop-motion)
      const f6 = Math.floor(t * 6 + 1e-6);
      if (f6 !== lastBoil) { lastBoil = f6; TURB[0].setAttribute('seed', 2 + (f6 % 3)); TURB[1].setAttribute('seed', 9 + (f6 % 3)); TURB[2].setAttribute('seed', 4 + (f6 % 3)); }
      FLICK.style.opacity = (hash(Math.floor(t * FPS + 1e-6) * 1.37) * 0.045).toFixed(3);
      drawTear(id, i, lt, d, TL);
    },
  });

  // =====================================================================================
  // S1 — anak memegang tablet (ilustrasi aplikasi belajar milik pelanggan) + pertanyaan
  // =====================================================================================
  KIT.registerType('pcKid', (root, v, sc, tm, T) => {
    const L = pk({ kx: 560, ky: 700, ks: 1.12, qx: 1000, qy: 345, qw: 880 }, { kx: 540, ky: 1150, ks: 1.12, qx: 40, qy: 250, qw: 1000 });
    root.classList.add('s1');
    const kid = mk(`<div class="s1-kid" style="left:${L.kx}px;top:${L.ky}px;transform:scale(${L.ks})"></div>`);
    root.appendChild(kid);
    const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; kid.appendChild(el); return el; };
    const body = at(paper({ w: 330, h: 250, color: C.coral, seed: 3, radius: '165px 165px 46px 46px' }), -165, -300);
    body.in.innerHTML = '<div class="s1-collar"></div>';
    const head = at(emo('🧒', 236, 6), -118, -468);
    const tab = at(paper({ w: 560, h: 380, color: '#3B4068', seed: 9, radius: 42, shadow: 'lg' }), -280, -190);
    tab.in.innerHTML = `<div class="s1-cam"></div><div class="s1-scr tex">
        <div class="s1-hd bl">${esc(v.app)}<span class="st"><span class="emo">⭐</span> 120</span></div>
        <div class="s1-blk bl" style="left:30px;background-color:${C.coral}">A</div>
        <div class="s1-blk bl" style="left:146px;background-color:${C.mint}">B</div>
        <div class="s1-blk bl" style="left:262px;background-color:${C.sky}">C</div>
        <div class="s1-bar"><i></i></div>
        <div class="s1-masc emo">🐣</div>
        <div class="s1-dim"></div>
        <div class="s1-pop"><div class="t ph">${esc(v.popText)}</div><div class="b bl">${esc(v.btnText)}</div><div class="n ph">${esc(v.laterText)}</div></div>
      </div>`;
    const blocks = $$('.s1-blk', tab), dim = $('.s1-dim', tab), pop = $('.s1-pop', tab), btn = $('.s1-pop .b', tab), masc = $('.s1-masc', tab), bar = $('.s1-bar i', tab);
    const burst = svg(150, 120, 's1-burst');
    const bursts = [[20, 40, 2, 10], [75, 30, 75, 2], [130, 40, 148, 10]].map(([a, b, c, d2]) => stroke(burst, `M${a} ${b} L${c} ${d2}`, CRAY.red, 7));
    tab.in.appendChild(burst);
    const age = mk(`<div class="s1-age"><div class="pc-face tex"></div><span class="bl">${esc(v.age)}</span></div>`);
    tab.in.appendChild(age);
    const ring = svg(150, 150, 's1-agering');
    const ringP = stroke(ring, loopD(75, 75, 60, 58, 5, 1.12), CRAY.red, 5);
    age.appendChild(ring);
    const hands = [-1, 1].map((s, i) => { const hd = at(paper({ w: 84, h: 100, color: C.yellow, seed: 21 + i, radius: '46% 46% 50% 50%', shadow: 'sm' }), s * 282 - 42, -55); hd.in.innerHTML = `<i class="thumb tex ${i ? 'l' : 'r'}"></i>`; return hd; });
    // teks pertanyaan
    const qb = mk(`<div class="s1-q" style="left:${L.qx}px;top:${L.qy}px;width:${L.qw}px"></div>`);
    root.appendChild(qb);
    const lines = v.lines.map((t) => { const e = mk(`<div class="s1-l bl">${esc(t)}</div>`); qb.appendChild(e); return e; });
    const spans = lines.flatMap((e) => KIT.splitWords(e));
    const times = wordTimes(sc, v.lines.join(' '), 0.8);
    const strip = mk(`<div class="s1-strip"><div class="pc-face tex"></div><span class="bl">${esc(v.strip)}</span></div>`);
    qb.appendChild(strip);
    const stripFace = $('.pc-face', strip);
    const tp = tape(130, 42, 'rgba(150,191,230,.82)', 5, 's1-tape');
    strip.appendChild(tp);
    const star = emo('⭐', pk(96, 92), 4);
    root.appendChild(star);
    const tPop = T(v.popAt, 1.7), tTap = T(v.tapAt, 2.5), tAge = T(v.ageAt, 3.3), tStrip = T(v.stripAt, 3.3);
    root._punch = [tStrip];
    const BTN = [-65, 62]; // posisi tombol "Setuju" relatif pusat tablet
    return (lt) => {
      const q = Q(lt);
      lazy(strip, (w, h) => { stripFace.style.clipPath = poly(tornPts(w, h, 12, { torn: 'lr', amp: 5, step: 8 })); });
      if (!star._p && strip.offsetWidth) {
        star._p = 1;
        const sx = L.qx + strip.offsetLeft + strip.offsetWidth - 10, sy = L.qy + strip.offsetTop - 6;
        star.style.left = sx - star.offsetWidth / 2 + 'px'; star.style.top = sy - star.offsetHeight / 2 + 'px';
      }
      // badan, kepala, tablet, tangan
      const kb = ss(P(q, 0.3, 0.62));
      put(body, { y: (1 - kb) * 150, o: q >= 0.3 ? 1 : 0 }, jit(q, 1, 0.5));
      const kh = oB(P(q, 0.42, 0.84));
      put(head, { y: (1 - kh) * 180 + Math.sin(q * 2.6) * 5, r: (1 - kh) * -16 + Math.sin(q * 1.9) * 3.2, o: q >= 0.42 ? 1 : 0 }, jit(q, 2, 0.6));
      const kt = oB(P(q, 0.34, 0.76)), ty = (1 - kt) * 440, ta = -3 + Math.sin(q * 1.3) * 0.9 - (1 - kt) * 12;
      put(tab, { y: ty, r: ta, o: q >= 0.34 ? 1 : 0 }, jit(q, 3, 0.4));
      const rad = (ta * Math.PI) / 180, cs = Math.cos(rad), sn = Math.sin(rad);
      const kTap = P(q, tTap - 0.34, tTap), kBack = P(q, tTap + 0.26, tTap + 0.6);
      hands.forEach((hd, i) => {
        const hx0 = i ? 282 : -282, hy0 = -5;
        let hx = hx0 * cs - hy0 * sn, hy = hx0 * sn + hy0 * cs + ty;
        let dx = hx - hx0, dy = hy - hy0, r = i ? 12 : -12;
        if (i === 1) { // tangan kanan menekan "Setuju" (gag: anak langsung setuju)
          const tx = BTN[0] + 30, tyy = BTN[1] + 50, kk = ss(kTap) * (1 - ss(kBack));
          dx = lerp(dx, tx - hx0, kk); dy = lerp(dy, tyy - hy0 + ty, kk); r = lerp(r, -24, kk);
        }
        const press = i === 1 && q >= tTap && q < tTap + 0.17 ? 0.9 : 1;
        put(hd, { x: dx, y: dy, r, s: press, o: q >= 0.5 ? 1 : 0 }, jit(q, 5 + i, 0.4));
      });
      // layar aplikasi belajar
      blocks.forEach((b, i) => {
        const k = oB(P(q, 0.9 + i * 0.12, 1.2 + i * 0.12));
        put(b, { y: (1 - k) * 40 - Math.abs(Math.sin((q + i * 0.35) * 3.4)) * 7 * (q > 1.5 ? 1 : 0), s: 0.5 + 0.5 * Math.max(0, k), r: [-6, 5, -3][i], o: k > 0 ? 1 : 0 });
      });
      const km = oB(P(q, 1.25, 1.55));
      put(masc, { s: 0.4 + 0.6 * Math.max(0, km), r: Math.sin(q * 3) * 6, o: km > 0 ? 1 : 0 });
      bar.style.width = (62 * ss(P(q, 1.3, 1.9))).toFixed(1) + '%';
      const kp = oB(P(q, tPop, tPop + 0.3)), kx = ss(P(q, tTap + 0.34, tTap + 0.6));
      put(pop, { s: (0.6 + 0.4 * Math.max(0, kp)) * (1 - 0.35 * kx), r: kx * 9, y: kx * 30, o: kp > 0 ? 1 - kx : 0 });
      dim.style.opacity = (P(q, tPop, tPop + 0.2) * (1 - kx) * 0.55).toFixed(3);
      btn.classList.toggle('on', q >= tTap);
      put(btn, { s: q >= tTap && q < tTap + 0.17 ? 0.9 : 1 });
      bursts.forEach((b) => drawK(b, P(q, tTap, tTap + 0.17) * (1 - P(q, tTap + 0.42, tTap + 0.5))));
      const ka = P(q, tAge - 0.04, tAge + 0.25);
      put(age, { s: lerp(1.9, 1, oB(ka)), r: lerp(24, -8, ka), o: ka > 0 ? 1 : 0 });
      drawK(ringP, P(q, tAge + 0.12, tAge + 0.46));
      // pertanyaan: kata ditempel satu per satu (stop-motion)
      popWords(spans, times, q);
      lines.forEach((e, i) => put(e, {}, jit(q, 30 + i, 0.5)));
      const ks = P(q, tStrip - 0.04, tStrip + 0.3);
      put(strip, { sx: oB(ks), sy: 1, r: -2.5, o: ks > 0 ? 1 : 0 }, jit(q, 40, 0.5));
      const kT = oB(P(q, tStrip + 0.16, tStrip + 0.4));
      put(tp, { s: lerp(1.5, 1, Math.max(0, kT)), r: -32, o: kT > 0 ? 1 : 0 });
      const kS = oB(P(q, tStrip + 0.3, tStrip + 0.62));
      put(star, { s: Math.max(0, kS), r: 14 + Math.sin(q * 2.2) * 8, o: kS > 0 ? 1 : 0 });
    };
  });

  // =====================================================================================
  // S2 — formulir persetujuan kertas + tanda tangan krayon anak & wali (+ PP 33/2026 Ps. 38)
  // =====================================================================================
  KIT.registerType('pcForm', (root, v, sc, tm, T) => {
    const L = pk({ x: 420, y: 150, w: 900, h: 790 }, { x: 70, y: 330, w: 940, h: 1010 });
    root.classList.add('s2');
    const sheet = paper({ w: L.w, h: L.h, color: '#FFFCF4', seed: 31, torn: 't', amp: 4, shadow: 'lg' });
    sheet.style.left = L.x + 'px'; sheet.style.top = L.y + 'px';
    root.appendChild(sheet);
    sheet.in.innerHTML = `<div class="s2-in">
        <div class="s2-k bl">${esc(v.kicker)}</div>
        <div class="s2-t bl">${esc(v.title)}</div>
        ${v.rows.map((r) => `<div class="s2-row"><div class="lb ph">${esc(r.label)}</div><div class="vl"><span class="hw">${esc(r.value)}</span></div></div>`).join('')}
        <div class="s2-chk"><div class="bx"></div><div class="tx ph">${esc(v.checkText)}</div></div>
        <div class="s2-sigs">
          <div class="sg kid"><div class="area"><span class="gg nm">${esc(v.kidName)}</span></div><div class="ln"></div><div class="lb ph">${esc(v.kidLabel)}</div></div>
          <div class="sg wali"><div class="area"></div><div class="ln"></div><div class="lb ph">${esc(v.guardLabel)}</div>
            <div class="note hw">${esc(v.note)}</div></div>
        </div>
      </div>`;
    const kick = $('.s2-k', sheet), ttl = $('.s2-t', sheet), vals = $$('.s2-row .vl span', sheet), rowsEl = $$('.s2-row', sheet);
    const bx = $('.s2-chk .bx', sheet), chkTx = $('.s2-chk .tx', sheet), kidNm = $('.sg.kid .nm', sheet), kidArea = $('.sg.kid .area', sheet);
    const wali = $('.sg.wali', sheet), waliArea = $('.sg.wali .area', sheet), note = $('.sg.wali .note', sheet);
    const bs = pk(46, 52);
    const bsv = svg(bs + 20, bs + 20, 's2-box');
    const boxP = stroke(bsv, smooth([[10, 12], [bs + 8, 9], [bs + 11, bs + 10], [9, bs + 11], [11, 10]]), CRAY.ink, 4);
    const tickP = stroke(bsv, tickD(12, 10, bs - 4), CRAY.green, 7);
    bx.appendChild(bsv);
    const heart = svg(70, 70, 's2-heart');
    const heartP = stroke(heart, heartD(35, 30, 26), CRAY.red, 5);
    kidArea.appendChild(heart);
    const sgW = pk(360, 400), sgH = pk(130, 150);
    const sig = svg(sgW, sgH, 's2-sig');
    const sigS = (sgW - 20) / 300;
    const sigP = stroke(sig, SIGN, CRAY.blue, 5.5 / sigS), sigP2 = stroke(sig, SIGN2, CRAY.blue, 4.5 / sigS);
    sigP.setAttribute('transform', `translate(10 ${sgH / 2 - 60 * sigS}) scale(${sigS})`); sigP2.setAttribute('transform', sigP.getAttribute('transform'));
    waliArea.appendChild(sig);
    const circ = svg(sgW + 80, sgH + 110, 's2-circ');
    const circP = stroke(circ, loopD((sgW + 80) / 2, (sgH + 110) / 2, (sgW + 40) / 2, (sgH + 70) / 2, 7, 1.15), CRAY.red, 6);
    wali.appendChild(circ);
    const arr = svg(170, 130, 's2-arr');
    const ad = arrowD(150, 20, 40, 112, -0.25), arrS = stroke(arr, ad.shaft, CRAY.red, 5), arrH = stroke(arr, ad.head, CRAY.red, 5);
    wali.appendChild(arr);
    const tapes = [[-30, -18, -38], [L.w - 110, -18, 36]].map(([x, y, r], i) => {
      const t = tape(150, 44, i ? 'rgba(246,207,99,.78)' : 'rgba(149,207,174,.8)', 60 + i);
      t.style.left = L.x + x + 'px'; t.style.top = L.y + y + 'px'; t._r = r;
      root.appendChild(t);
      return t;
    });
    // label PP (tag kertas bertali)
    const TG = pk({ x: 1216, y: 128, w: 380, h: 184, r: 7 }, { x: 670, y: 186, w: 340, h: 160, r: 6 });
    const tag = paper({ w: TG.w, h: TG.h, color: C.butter, seed: 44, shadow: 'md', cls: 's2-tag' });
    tag.face.style.clipPath = `polygon(0 22%, 12% 0, 100% 0, 100% 100%, 12% 100%, 0 78%)`;
    tag.in.innerHTML = `<div class="hole"></div><div class="tt bl">${esc(v.tag.title)}</div><div class="ts bl">${esc(v.tag.sub)}</div>`;
    tag.style.left = TG.x + 'px'; tag.style.top = TG.y + 'px';
    const tagSub = $('.ts', tag);
    const tagUl = svg(TG.w, 40, 's2-tagul');
    const tagUlP = stroke(tagUl, underD(TG.w * 0.2, TG.w * 0.86, 18, 3, false), CRAY.red, 5);
    tag.in.appendChild(tagUl);
    // tali dari lubang tag ke selotip lembar
    const holeX = TG.x + 30, holeY = TG.y + TG.h / 2, anchor = pk([L.x + L.w - 40, L.y + 6], [L.x + L.w - 60, L.y + 4]);
    const sx0 = Math.min(holeX, anchor[0]) - 40, sy0 = Math.min(holeY, anchor[1]) - 40;
    const str = svg(Math.abs(holeX - anchor[0]) + 80, Math.abs(holeY - anchor[1]) + 80, 's2-str');
    str.style.left = sx0 + 'px'; str.style.top = sy0 + 'px';
    const strP = stroke(str, `M${holeX - sx0} ${holeY - sy0} C${holeX - sx0 - 60} ${holeY - sy0 + 50} ${anchor[0] - sx0 + 40} ${anchor[1] - sy0 + 60} ${anchor[0] - sx0} ${anchor[1] - sy0}`, '#B08A5A', 4);
    root.appendChild(str);
    root.appendChild(tag);
    const tRow = v.rows.map((r, i) => T(r.at, 0.8 + i * 0.6));
    const tNote = T(v.noteAt, 1.8), tKid = T(v.kidAt, 2.2), tChk = T(v.checkAt, 2.6), tSig = T(v.sigAt, 3.2), tSigE = T(v.sigEnd, 4.5);
    const tCirc = T(v.circleAt, 4.1), tTag = T(v.tag.at, 5.2), tTagL = T(v.tag.lineAt, 6.4);
    root._punch = [tTag];
    return (lt) => {
      const q = Q(lt);
      const k = ss(P(q, 0.04, 0.46));
      put(sheet, { y: (1 - k) * SH * 0.85 + Math.sin(q * 0.9) * 2, r: (1 - k) * 7 - 0.6, o: q >= 0.04 ? 1 : 0 }, jit(q, 1, 0.35));
      tapes.forEach((t, i) => { const kt = oB(P(q, 0.46 + i * 0.1, 0.7 + i * 0.1)); put(t, { s: lerp(1.5, 1, Math.max(0, kt)), r: t._r, o: kt > 0 ? 1 : 0 }); });
      writeOn(kick, q, 0.34, 0.4);
      writeOn(ttl, q, 0.5, 0.5);
      rowsEl.forEach((r) => show(r, q >= 0.4));
      vals.forEach((e, i) => writeOn(e, q, tRow[i], 0.55));
      show($('.s2-chk', sheet), q >= 0.5);
      drawK(boxP, P(q, 0.75, 1.05));
      writeOn(chkTx, q, 0.8, 0.5);
      drawK(tickP, P(q, tChk, tChk + 0.22));
      put(bx, { s: q >= tChk && q < tChk + 0.25 ? 1.18 : 1 });
      show($('.s2-sigs', sheet), q >= 0.55);
      writeOn(kidNm, q, tKid, 0.5);
      drawK(heartP, P(q, tKid + 0.5, tKid + 0.75));
      const kS = P(q, tSig, tSigE);
      drawK(sigP, P(kS, 0, 0.8)); drawK(sigP2, P(kS, 0.82, 1));
      drawK(circP, P(q, tCirc, tCirc + 0.4));
      writeOn(note, q, tNote, 0.34);
      drawK(arrS, P(q, tNote + 0.2, tNote + 0.45)); drawK(arrH, P(q, tNote + 0.45, tNote + 0.55));
      const kg = P(q, tTag - 0.04, tTag + 0.3);
      put(tag, { y: (1 - oB(kg)) * -80, s: lerp(1.4, 1, oB(kg)), r: lerp(22, TG.r, kg) + Math.sin(q * 1.6) * 1.2, o: kg > 0 ? 1 : 0 }, jit(q, 4, 0.5));
      drawK(strP, P(q, tTag + 0.12, tTag + 0.45));
      put(tagSub, { s: q >= tTagL && q < tTagL + 0.25 ? 1.08 : 1 });
      drawK(tagUlP, P(q, tTagL, tTagL + 0.3));
    };
  });

  // =====================================================================================
  // S3 — Children Pro: foto screenshot ASLI (children-pro.png) + lini waktu tumbuh 🧒 → 🧑 (ilustrasi konsep)
  // =====================================================================================
  function banner(root, { text, color, dark, cx, y, w, h, fs, seed }) {
    const tails = [-1, 1].map((sg) => {
      const t = mk(`<div class="bn-tail tex" style="width:${Math.round(h * 1.05)}px;height:${Math.round(h * 0.78)}px;background-color:${dark}"></div>`);
      t.style.clipPath = sg < 0 ? 'polygon(0 0,100% 0,100% 100%,0 100%,26% 50%)' : 'polygon(0 0,100% 0,74% 50%,100% 100%,0 100%)';
      t.style.left = (sg < 0 ? cx - w / 2 - h * 0.7 : cx + w / 2 - h * 0.35) + 'px';
      t.style.top = y + h * 0.36 + 'px';
      root.appendChild(t);
      return t;
    });
    const main = paper({ w, h, color, seed, shadow: 'md' });
    main.style.left = cx - w / 2 + 'px'; main.style.top = y + 'px';
    main.in.innerHTML = `<div class="bn-tx bl" style="font-size:${fs}px">${esc(text)}</div>`;
    root.appendChild(main);
    return { main, tails };
  }
  function photoTapes(ph, W, specs) {
    return specs.map(([x, y, r, col], i) => {
      const t = tape(140, 42, col, 90 + i * 3);
      t.style.left = (typeof x === 'string' ? W - parseFloat(x.slice(1)) : x) + 'px'; t.style.top = y + 'px'; t._r = r;
      ph.in.appendChild(t);
      return t;
    });
  }
  KIT.registerType('pcGrow', (root, v, sc, tm, T) => {
    root.classList.add('s3');
    const B = pk({ cx: 960, y: 40, w: 560, h: 104, fs: 64 }, { cx: 540, y: 206, w: 560, h: 100, fs: 60 });
    const bn = banner(root, { text: v.title, color: C.mint, dark: '#6DB48E', cx: B.cx, y: B.y, w: B.w, h: B.h, fs: B.fs, seed: 71 });
    const sub = mk(`<div class="s3-sub hw" style="left:${B.cx}px;top:${B.y + B.h + 2}px">${esc(v.sub)}</div>`);
    root.appendChild(sub);
    // foto screenshot asli
    const PH = pk({ x: 250, y: 222, w: 1300, h: 654, r: -0.8 }, { x: 62, y: 388, w: 956, h: 742, r: -0.8 });
    const ph = photo(root, { ...PH, src: v.shot, iw: v.iw || 1440, ih: v.ih || 900, border: 18, seed: 81 });
    const tps = photoTapes(ph, PH.w, [[-40, -18, -32, 'rgba(149,207,174,.84)'], ['R104', -18, 30, 'rgba(243,169,186,.82)']]);
    const marks = photoMarks(ph, v.marks, T);
    const keys = panKeys(v.pan, T);
    // lini waktu tumbuh (ilustrasi konsep): pita kertas + boneka kertas + kalender sobek
    const RB = pk({ x: 170, y: 896, w: 1580, h: 80 }, { x: 60, y: 1340, w: 960, h: 74 });
    const rib = paper({ w: RB.w, h: RB.h, color: C.butter, seed: 55, torn: 'lr', amp: 5, shadow: 'md' });
    rib.style.left = RB.x + 'px'; rib.style.top = RB.y + 'px';
    const FR = [0.07, 0.37, 0.66, 0.91];
    rib.in.innerHTML = v.ages.map((a, i) => `<div class="rb-l bl" style="left:${(FR[i] * 100).toFixed(1)}%">${esc(a)}</div>`).join('');
    const ticks = svg(RB.w, RB.h, 's3-ticks plain');
    for (let i = 0; i <= 44; i++) {
      const x = (RB.w * (i + 0.5)) / 45, big = FR.some((f) => Math.abs(f * RB.w - x) < RB.w / 90);
      stroke(ticks, `M${x.toFixed(1)} 5 L${(x + 1).toFixed(1)} ${big ? 22 : 13}`, 'rgba(47,43,69,.5)', big ? 4 : 2.5, false);
    }
    rib.in.appendChild(ticks);
    root.appendChild(rib);
    const WK = pk({ d: 150, st: 84 }, { d: 124, st: 66 });
    const walk = mk(`<div class="s3-walk" style="width:${WK.d}px;height:${WK.d + WK.st}px"><div class="stick tex" style="height:${WK.st + 12}px"></div></div>`);
    const disc = paper({ w: WK.d, h: WK.d, color: '#FFFDF7', seed: 5, radius: '50%', shadow: 'md' });
    disc.in.innerHTML = `<div class="face" style="font-size:${Math.round(WK.d * 0.64)}px"><span class="kid emo">🧒</span><span class="adult emo">🧑</span></div>`;
    walk.appendChild(disc);
    root.appendChild(walk);
    const fKid = $('.kid', disc), fAd = $('.adult', disc);
    const CAL = pk({ x: 1596, y: 420, w: 210, h: 200 }, { x: 822, y: 948, w: 188, h: 176 });
    const cal = paper({ w: CAL.w, h: CAL.h, color: C.kraft, seed: 61, shadow: 'md' });
    cal.style.left = CAL.x + 'px'; cal.style.top = CAL.y + 'px';
    cal.in.innerHTML = `<div class="cal-bind tex"></div><div class="cal-pg under tex"><div class="lb ph">${esc(v.calLabel)}</div><div class="yr bl"></div></div><div class="cal-pg top tex"><div class="lb ph">${esc(v.calLabel)}</div><div class="yr bl"></div></div><i class="ring" style="left:24%"></i><i class="ring" style="left:68%"></i>`;
    root.appendChild(cal);
    const pgTop = $('.cal-pg.top', cal), yrTop = $('.cal-pg.top .yr', cal), yrUnder = $('.cal-pg.under .yr', cal);
    const balloon = emo('🎈', pk(120, 104), 4);
    root.appendChild(balloon);
    const tTitle = T(v.titleAt, 0.4), tSub = T(v.subAt, 1.2), tPh = T(v.photoAt, 0.8);
    const tTl = T(v.timelineAt, 5.2), hops = v.hops.map((h, i) => T(h, 6 + i * 0.6)), tAdult = T(v.adultAt, 7.6);
    root._punch = [tAdult];
    return (lt) => {
      const q = Q(lt);
      const kb = oB(P(q, tTitle, tTitle + 0.34));
      put(bn.main, { sx: Math.max(0.02, kb), sy: 1, r: -1, o: kb > 0 ? 1 : 0 }, jit(q, 1, 0.4));
      bn.tails.forEach((t, i) => { const kt = ss(P(q, tTitle + 0.2, tTitle + 0.45)); put(t, { x: (1 - kt) * (i ? -60 : 60), r: i ? 3 : -3, o: kt > 0 ? 1 : 0 }); });
      writeOn(sub, q, tSub, 0.5);
      // foto: masuk dari bawah (stop-motion), isi di-pan/zoom halus
      const kp = ss(P(q, tPh, tPh + 0.42));
      put(ph, { x: (1 - kp) * -60, y: (1 - kp) * 420, r: PH.r + (1 - kp) * -7, o: kp > 0 ? 1 : 0 }, jit(q, 3, 0.3));
      ph.sync();
      const vw = viewAt(keys, lt);
      ph.view(vw.z, vw.fx, vw.fy);
      tps.forEach((t, i) => { const kt = oB(P(q, tPh + 0.36 + i * 0.08, tPh + 0.58 + i * 0.08)); put(t, { s: lerp(1.5, 1, Math.max(0, kt)), r: t._r, o: kt > 0 ? 1 : 0 }); });
      drawMarks(ph, marks, q);
      // lini waktu (pita dibentangkan)
      const kr = P(q, tTl, tTl + 0.42);
      rib.style.clipPath = kr >= 1 ? 'none' : `inset(-60% ${((1 - ss(kr)) * 100).toFixed(1)}% -60% -2%)`;
      put(rib, { r: -0.5, o: kr > 0 ? 1 : 0 }, jit(q, 6, 0.3));
      const kc = oB(P(q, tTl + 0.2, tTl + 0.5));
      put(cal, { s: Math.max(0.01, kc), r: pk(4, -4) + Math.sin(q * 1.4) * 1, o: kc > 0 ? 1 : 0 }, jit(q, 7, 0.4));
      let idx = 0;
      hops.forEach((h) => { if (q >= h) idx++; });
      const hop = idx > 0 ? P(q, hops[idx - 1], hops[idx - 1] + 0.34) : 1;
      const fx = idx === 0 ? FR[0] : lerp(FR[idx - 1], FR[idx], ss(hop));
      const kw = oB(P(q, tTl + 0.3, tTl + 0.6));
      walk.style.left = (RB.x + fx * RB.w - WK.d / 2).toFixed(1) + 'px';
      walk.style.top = (RB.y - (WK.d + WK.st) + 8).toFixed(1) + 'px';
      const land = idx > 0 && hop >= 1 && q < hops[idx - 1] + 0.43;
      put(walk, { y: -Math.sin(Math.PI * (idx > 0 ? hop : 0)) * 70 + (1 - Math.max(0, kw)) * 60, sy: land ? 0.9 : 1, sx: land ? 1.06 : 1, r: idx > 0 && hop < 1 ? 8 * Math.sin(Math.PI * hop) : Math.sin(q * 2) * 2, o: kw > 0 ? 1 : 0 });
      const kf = P(q, tAdult, tAdult + 0.34), flip = kf * 180;
      put(disc, { ry: flip > 90 ? flip - 180 : flip, p: 700 });
      fKid.style.display = flip > 90 ? 'none' : 'inline'; fAd.style.display = flip > 90 ? 'inline' : 'none';
      // kalender: halaman lepas ke atas setiap loncatan
      const yrs = v.years, flipping = idx > 0 && q < hops[idx - 1] + 0.3;
      if (flipping) {
        const kk = P(q, hops[idx - 1], hops[idx - 1] + 0.3);
        yrTop.textContent = yrs[idx - 1]; yrUnder.textContent = yrs[idx];
        put(pgTop, { rx: -kk * 170, p: 600, o: 1 - P(kk, 0.6, 1) });
      } else {
        yrTop.textContent = yrs[idx]; yrUnder.textContent = yrs[Math.min(yrs.length - 1, idx + 1)];
        put(pgTop, { o: 1 });
      }
      const kB = oB(P(q, tAdult + 0.3, tAdult + 0.6));
      balloon.style.left = RB.x + FR[FR.length - 1] * RB.w + pk(-190, -170) + 'px';
      balloon.style.top = RB.y - pk(290, 300) + 'px';
      put(balloon, { y: -P(q, tAdult + 0.3, tAdult + 2.5) * 30 + Math.sin(q * 2) * 6, r: Math.sin(q * 1.7) * 7, s: Math.max(0, kB), o: kB > 0 ? 1 : 0 });
    };
  });

  // =====================================================================================
  // S4 — Inclusive Privacy: foto screenshot ASLI (inclusive-privacy.png) + stiker kertas format aksesibel + ♿
  // =====================================================================================
  KIT.registerType('pcAccess', (root, v, sc, tm, T) => {
    root.classList.add('s4');
    const LB = pk({ cx: 470, y: 176, w: 640, h: 118, fs: 68 }, { cx: 540, y: 206, w: 660, h: 108, fs: 62 });
    const label = paper({ w: LB.w, h: LB.h, color: C.lilac, seed: 91, torn: 'lr', amp: 5, shadow: 'md' });
    label.style.left = LB.cx - LB.w / 2 + 'px'; label.style.top = LB.y + 'px';
    label.in.innerHTML = `<div class="bn-tx bl" style="font-size:${LB.fs}px">${esc(v.title)}</div>`;
    label.style.transformOrigin = '50% 100%';
    root.appendChild(label);
    const sub = mk(`<div class="s4-sub hw" style="left:${LB.cx}px;top:${LB.y + LB.h + 8}px">${esc(v.sub)}</div>`);
    root.appendChild(sub);
    const PH = pk({ x: 880, y: 140, w: 920, h: 800, r: 1.2 }, { x: 72, y: 396, w: 936, h: 652, r: 1 });
    const ph = photo(root, { ...PH, src: v.shot, iw: v.iw || 1440, ih: v.ih || 900, border: 18, seed: 93 });
    const corners = [0, 1, 2, 3].map((i) => { const c = mk(`<div class="ph-corner tex c${i}"></div>`); ph.in.appendChild(c); return c; });
    const marks = photoMarks(ph, v.marks, T);
    const keys = panKeys(v.pan, T);
    // format aksesibel sebagai label kertas (ilustrasi, bukan tiruan layar)
    const CH = pk({ x: 190, y: 430, gap: 116, w: 560, h: 96 }, { x: 230, y: 1080, gap: 92, w: 620, h: 80 });
    const chips = v.chips.map((c, i) => {
      const el = paper({ w: CH.w, h: CH.h, color: [C.sky, C.butter, '#34304F'][i], seed: 101 + i, shadow: 'md', cls: 's4-chip' + (i === 2 ? ' dark' : '') });
      const icon = c.icon === 'contrast'
        ? '<svg viewBox="0 0 40 40" width="46" height="46"><circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" stroke-width="4"/><path d="M20 5 A15 15 0 0 1 20 35 Z" fill="currentColor"/></svg>'
        : c.icon === 'aa' ? '<span class="bl aa">Aa</span>' : `<span class="em emo">${c.icon}</span>`;
      el.in.innerHTML = `<div class="ic">${icon}</div><div class="tx bl">${esc(c.text)}</div>`;
      el.style.left = CH.x + 'px'; el.style.top = CH.y + i * CH.gap + 'px';
      el.style.transformOrigin = '0 50%';
      root.appendChild(el);
      return { el, at: T(c.at, 3 + i * 0.8) };
    });
    const wv = svg(90, 90, 's4-wave');
    const waves = [0, 1, 2].map((i) => stroke(wv, `M${20 + i * 18} ${28 - i * 10} Q${38 + i * 24} 45 ${20 + i * 18} ${62 + i * 10}`, CRAY.blue, 5, false));
    chips[0].el.in.appendChild(wv);
    const aa = $('.aa', chips[1].el);
    const wheel = emo('♿️', pk(128, 116), 5);
    root.appendChild(wheel);
    const tTitle = T(v.titleAt, 1.2), tSub = T(v.subAt, 2.2), tPh = T(v.photoAt, 0.2), tWheel = T(v.wheelAt, 5.6);
    root._punch = [tTitle];
    return (lt) => {
      const q = Q(lt);
      const kl = P(q, tTitle - 0.04, tTitle + 0.34);
      put(label, { rx: lerp(84, 0, oB(kl)), p: 900, r: -1.5, o: kl > 0 ? 1 : 0 }, jit(q, 1, 0.4));
      writeOn(sub, q, tSub, 0.55);
      const kp = ss(P(q, tPh, tPh + 0.42));
      put(ph, { x: (1 - kp) * pk(360, 0), y: (1 - kp) * pk(30, 520), r: PH.r + (1 - kp) * 8, o: kp > 0 ? 1 : 0 }, jit(q, 2, 0.3));
      ph.sync();
      const vw = viewAt(keys, lt);
      ph.view(vw.z, vw.fx, vw.fy);
      corners.forEach((c, i) => { const kc = oB(P(q, tPh + 0.36 + i * 0.05, tPh + 0.56 + i * 0.05)); put(c, { s: Math.max(0, kc), o: kc > 0 ? 1 : 0 }); });
      drawMarks(ph, marks, q);
      chips.forEach(({ el, at }, i) => {
        const k = oB(P(q, at - 0.04, at + 0.3));
        put(el, { sx: Math.max(0.02, k), sy: 1, r: [-1.5, 1.2, -0.8][i] + Math.sin(q * 1.3 + i) * 0.6, o: k > 0 ? 1 : 0 }, jit(q, 10 + i, 0.4));
      });
      const ta = chips[0].at, fw = Math.floor(q * 6 + 1e-6);
      waves.forEach((w, i) => { w.style.opacity = q >= ta + 0.2 && (fw + 3 - i) % 4 !== 0 ? 1 : 0; });
      const tb = chips[1].at, st = q < tb + 0.1 ? 0 : q < tb + 0.2 ? 1 : q < tb + 0.3 ? 2 : 3;
      aa.style.fontSize = [30, 36, 46, 42][st] + 'px';
      const kw = P(q, tWheel - 0.04, tWheel + 0.3);
      const wp = pk([PH.x + PH.w - 30, PH.y + 34], [PH.x + PH.w - 56, PH.y + 26]);
      wheel.style.left = wp[0] - wheel.offsetWidth / 2 + 'px'; wheel.style.top = wp[1] - wheel.offsetHeight / 2 + 'px';
      put(wheel, { s: lerp(1.8, 1, oB(kw)), r: lerp(30, 8, kw) + Math.sin(q * 2) * 3, o: kw > 0 ? 1 : 0 });
    };
  });

  // =====================================================================================
  // S5 — tombol kertas "Tarik persetujuan" -> benang krayon ke 3 sistem lewat API (ilustrasi konsep)
  //      + potongan foto screenshot ASLI (consent-detail.png): Preference Center "ubah preferensi kapan saja"
  // =====================================================================================
  KIT.registerType('pcThread', (root, v, sc, tm, T) => {
    root.classList.add('s5');
    const G = pk({
      ph: { x: 100, y: 104, w: 1040, h: 300, r: -1.2 }, btn: [430, 660], knot: [1040, 650],
      sys: [[1300, 250], [1300, 520], [1300, 790]], sysW: 500, sysH: 150,
    }, {
      ph: { x: 60, y: 232, w: 960, h: 300, r: -1 }, btn: [540, 700], knot: [540, 912],
      sys: [[70, 1100], [390, 1100], [710, 1100]], sysW: 300, sysH: 250,
    });
    const ph = photo(root, { ...G.ph, src: v.shot, iw: v.iw || 1624, ih: v.ih || 1014, border: 14, seed: 111 });
    const tps = photoTapes(ph, G.ph.w, [[-40, -18, -34, 'rgba(150,191,230,.84)'], ['R104', -18, 32, 'rgba(246,207,99,.82)']]);
    const marks = photoMarks(ph, v.marks, T);
    const keys = panKeys(v.pan, T);
    // tombol kertas
    const BW = pk(470, 560), BH = pk(104, 110);
    const btn = mk(`<div class="s5-btn bl" style="width:${BW}px;height:${BH}px;left:${G.btn[0] - BW / 2}px;top:${G.btn[1] - BH / 2}px"><div class="pc-face tex"></div><span class="a">${esc(v.button)}</span><span class="b">${esc(v.buttonDone)}</span></div>`);
    root.appendChild(btn);
    $('.pc-face', btn).style.clipPath = poly(tornPts(BW, BH, 131, {}));
    const lblA = $('.a', btn), lblB = $('.b', btn);
    const fing = emo('👆', pk(128, 122), 5);
    root.appendChild(fing);
    // sistem
    const syss = v.systems.map((s, i) => {
      const el = paper({ w: G.sysW, h: G.sysH, color: [C.mint, C.butter, C.pink][i], seed: 141 + i, shadow: 'md', cls: 's5-sys' });
      el.in.innerHTML = `<div class="ic emo">${s.icon}</div><div class="tx"><div class="nm bl">${esc(s.name)}</div><div class="st ph">${esc(v.syncText)}</div></div>`;
      el.style.left = G.sys[i][0] + 'px'; el.style.top = G.sys[i][1] + 'px';
      el.style.transformOrigin = '50% 100%';
      root.appendChild(el);
      return el;
    });
    // benang: tombol -> simpul API -> tiap sistem
    const ends = syss.map((_, i) => (V ? [G.sys[i][0] + G.sysW / 2, G.sys[i][1] + 8] : [G.sys[i][0] + 8, G.sys[i][1] + G.sysH / 2]));
    const start = V ? [G.btn[0], G.btn[1] + BH / 2 - 4] : [G.btn[0] + BW / 2 - 6, G.btn[1]];
    const xs = [start[0], G.knot[0], ...ends.map((e) => e[0])], ys = [start[1], G.knot[1], ...ends.map((e) => e[1])];
    const bx0 = Math.min(...xs) - 70, by0 = Math.min(...ys) - 70, bw = Math.max(...xs) - bx0 + 70, bh = Math.max(...ys) - by0 + 70;
    const th = svg(bw, bh, 's5-threads');
    th.style.left = bx0 + 'px'; th.style.top = by0 + 'px';
    root.insertBefore(th, syss[0]);
    const [sx, sy] = [start[0] - bx0, start[1] - by0], [kx, ky] = [G.knot[0] - bx0, G.knot[1] - by0];
    const trunk = V ? `M${sx} ${sy} C${sx + 40} ${sy + 70} ${kx - 40} ${ky - 90} ${kx} ${ky}` : `M${sx} ${sy} C${sx + 150} ${sy + 10} ${kx - 170} ${ky + 50} ${kx} ${ky}`;
    const trunkP = stroke(th, trunk, CRAY.red, 7);
    const branches = ends.map(([ex, ey]) => {
      const x = ex - bx0, y = ey - by0;
      return stroke(th, V ? `M${kx} ${ky} C${kx} ${ky + 90} ${x} ${y - 110} ${x} ${y}` : `M${kx} ${ky} C${kx + 120} ${ky} ${x - 150} ${y} ${x} ${y}`, CRAY.red, 6);
    });
    const beads = branches.map(() => { const b = mk('<div class="s5-bead"></div>'); root.appendChild(b); return b; });
    const TGw = pk(210, 220), TGh = pk(120, 116);
    const tag = paper({ w: TGw, h: TGh, color: C.butter, seed: 151, shadow: 'md', cls: 's5-tag' });
    tag.in.innerHTML = `<div class="tt bl">${esc(v.api)}</div><div class="ts ph">${esc(v.apiSub)}</div>`;
    tag.style.left = G.knot[0] - TGw / 2 + 'px'; tag.style.top = G.knot[1] - TGh / 2 + 'px';
    root.appendChild(tag);
    const tagC = svg(TGw + 90, TGh + 90, 's5-tagc');
    const tagCP = stroke(tagC, loopD((TGw + 90) / 2, (TGh + 90) / 2, TGw / 2 + 28, TGh / 2 + 26, 9, 1.15), CRAY.blue, 6);
    tag.in.appendChild(tagC);
    const checks = syss.map((el) => { const s = svg(70, 70, 's5-chk'); const p = stroke(s, tickD(10, 12, 46), CRAY.green, 8); el.in.appendChild(s); return p; });
    const tPh = T(v.photoAt, 0.3), tPress = T(v.pressAt, 1.5), tThread = T(v.threadAt, 3.4), tSync = T(v.syncAt, 4.1), tApi = T(v.apiAt, 6);
    const arrive = syss.map((_, i) => tSync + 0.12 + i * 0.18);
    root._punch = [tPress, tApi];
    return (lt) => {
      const q = Q(lt);
      const kp = ss(P(q, tPh, tPh + 0.4));
      put(ph, { x: (1 - kp) * pk(-500, 0), y: (1 - kp) * pk(-60, -420), r: G.ph.r + (1 - kp) * -6, o: kp > 0 ? 1 : 0 }, jit(q, 3, 0.3));
      ph.sync();
      const vw = viewAt(keys, lt);
      ph.view(vw.z, vw.fx, vw.fy);
      tps.forEach((t, i) => { const kt = oB(P(q, tPh + 0.34 + i * 0.08, tPh + 0.56 + i * 0.08)); put(t, { s: lerp(1.5, 1, Math.max(0, kt)), r: t._r, o: kt > 0 ? 1 : 0 }); });
      drawMarks(ph, marks, q);
      const kb = oB(P(q, 0.08, 0.4)), pressed = q >= tPress && q < tPress + 0.25;
      put(btn, { s: Math.max(0.02, kb) * (pressed ? 0.93 : 1), y: pressed ? 6 : 0, r: -1.2, o: kb > 0 ? 1 : 0 }, jit(q, 2, 0.35));
      btn.classList.toggle('down', q >= tPress);
      const kf = P(q, tPress + 0.08, tPress + 0.3), done = kf >= 0.5;
      put(done ? lblB : lblA, { sy: done ? (kf - 0.5) * 2 : 1 - kf * 2 });
      lblA.style.display = done ? 'none' : 'grid'; lblB.style.display = done ? 'grid' : 'none';
      // jari menekan
      const fin = ss(P(q, tPress - 0.5, tPress - 0.05)), fout = ss(P(q, tPress + 0.3, tPress + 0.7));
      const fx0 = G.btn[0] + pk(330, 360), fy0 = G.btn[1] + pk(330, 380);
      const fx = lerp(fx0, G.btn[0] + 50, fin * (1 - fout)), fy = lerp(fy0, G.btn[1] + 62, fin * (1 - fout)) + (pressed ? 8 : 0);
      fing.style.left = (fx - fing.offsetWidth / 2).toFixed(1) + 'px'; fing.style.top = (fy - fing.offsetHeight / 2).toFixed(1) + 'px';
      put(fing, { r: -18, o: fin > 0 && fout < 1 ? 1 : 0 });
      syss.forEach((el, i) => {
        const k = oB(P(q, 0.55 + i * 0.12, 0.9 + i * 0.12));
        put(el, { rx: lerp(80, 0, k), p: 900, r: [1, -1, 1.5][i], o: k > 0 ? 1 : 0 }, jit(q, 20 + i, 0.35));
        el.classList.toggle('synced', q >= arrive[i]);
        drawK(checks[i], P(q, arrive[i], arrive[i] + 0.2));
      });
      drawK(trunkP, P(q, tThread, tThread + 0.34));
      branches.forEach((b, i) => drawK(b, P(q, tThread + 0.3, arrive[i])));
      beads.forEach((b, i) => {
        const on = q >= tThread + 0.3 && q < arrive[i] + 1.4;
        const kk = q < arrive[i] ? P(q, tThread + 0.3, arrive[i]) : ((q - arrive[i]) * 1.2) % 1;
        const L0 = branches[i].getTotalLength(), pt = branches[i].getPointAtLength(L0 * kk);
        b.style.left = (bx0 + pt.x - 13).toFixed(1) + 'px'; b.style.top = (by0 + pt.y - 13).toFixed(1) + 'px';
        b.style.opacity = on ? 1 : 0;
      });
      const kt = oB(P(q, tThread + 0.2, tThread + 0.5)), hit = q >= tApi && q < tApi + 0.34;
      put(tag, { s: Math.max(0.02, kt) * (hit ? 1.1 : 1), r: -3 + (hit ? Math.sin((q - tApi) * 40) * 5 : 0), o: kt > 0 ? 1 : 0 }, jit(q, 30, 0.4));
      drawK(tagCP, P(q, tApi, tApi + 0.35));
    };
  });

  // =====================================================================================
  // S6 — CTA kertas hangat: logo + NEXUS, tagline krayon, tombol kertas privasimu.com, CTA situs & kontak resmi
  // =====================================================================================
  KIT.registerType('pcCta', (root, v, sc, tm, T) => {
    root.classList.add('s6');
    const G = pk({ card: { x: 330, y: 150, w: 1260, h: 400 }, logoW: 540, btnY: 598, ctaY: 756, footY: 848 },
      { card: { x: 60, y: 250, w: 960, h: 590 }, logoW: 680, btnY: 888, ctaY: 1052, footY: 1226 });
    const conf = Array.from({ length: 34 }, (_, i) => {
      const el = mk(`<div class="s6-cf tex" style="background-color:${[C.coral, C.butter, C.mint, C.sky, C.lilac, C.pink][i % 6]};width:${12 + Math.round(hash(i * 3.3) * 14)}px;height:${9 + Math.round(hash(i * 5.1) * 10)}px;border-radius:${hash(i * 7.7) > 0.6 ? '50%' : '2px'}"></div>`);
      root.appendChild(el);
      return { el, x: hash(i * 1.9 + 4) * SW, sp: 150 + hash(i * 2.3) * 200, dl: hash(i * 4.1) * 1.4, r0: hash(i * 6.2) * 360, rs: (hash(i * 8.3) - 0.5) * 600, sw: 20 + hash(i * 9.9) * 40 };
    });
    const card = paper({ w: G.card.w, h: G.card.h, color: '#FFFCF4', seed: 171, torn: 'tlbr', amp: 4, shadow: 'lg' });
    card.style.left = G.card.x + 'px'; card.style.top = G.card.y + 'px';
    card.style.transformOrigin = '50% 100%';
    const TLN = Array.isArray(v.tagline) ? v.tagline : pk(v.tagline.h, v.tagline.v);
    card.in.innerHTML = `<div class="s6-in">
        <div class="lg"><img src="../assets/privasimu_logo.png" alt="" style="width:${G.logoW}px"></div>
        ${v.nexus !== false ? `<div class="nx bl">${'NEXUS'.split('').map((c) => `<span>${c}</span>`).join('')}</div>` : ''}
        <div class="tl hw">${TLN.map((l) => `<div class="tln">${esc(l)}</div>`).join('')}</div>
      </div>`;
    root.appendChild(card);
    const logo = $('.lg', card), nx = $$('.nx span', card), tl = $('.tl', card);
    const tlW = $$('.tln', card).flatMap((e) => KIT.splitWords(e));
    const times = wordTimes(sc, TLN.join(' '), 2.6);
    const tapes = [[-34, -16, -36, 'rgba(149,207,174,.82)'], [G.card.w - 116, -16, 34, 'rgba(243,169,186,.82)']].map(([x, y, r, c], i) => {
      const t = tape(150, 44, c, 180 + i);
      t.style.left = x + 'px'; t.style.top = y + 'px'; t._r = r;
      card.in.appendChild(t);
      return t;
    });
    const deco = svg(G.card.w, G.card.h, 's6-deco');
    const ulP = stroke(deco, 'M0 0', CRAY.red, 6), hrP = stroke(deco, 'M0 0', CRAY.red, 6);
    card.in.appendChild(deco);
    const btn = mk(`<div class="s6-btn bl" style="top:${G.btnY}px"><div class="pc-face tex"></div><span>${esc(v.button)}</span></div>`);
    root.appendChild(btn);
    const btnFace = $('.pc-face', btn);
    const ctas = mk(`<div class="s6-ctas" style="top:${G.ctaY}px">${v.ctas.map((c, i) => `<div class="c c${i}"><div class="pc-face tex"></div><b class="bl">${esc(c.text)}</b>${c.sub ? `<span class="ph">${esc(c.sub)}</span>` : ''}</div>`).join('')}</div>`);
    root.appendChild(ctas);
    const ctaEls = $$('.c', ctas);
    const foot = mk(`<div class="s6-foot ph" style="top:${G.footY}px">${v.foot.map((f) => `<span>${esc(f)}</span>`).join('<i>·</i>')}</div>`);
    root.appendChild(foot);
    const stk = v.decals.map((s) => { const e = emo(s.e, s.size, 5); root.appendChild(e); return { e, s, at: T(s.at, 1.5) }; });
    const fade = mk('<div class="s6-fade"></div>');
    root.appendChild(fade);
    const tNx = T(v.nexusAt, 1.2), tBtn = T(v.btnAt, 5.8), tPress = T(v.pressAt, 6.9), tHeart = T(v.heartAt, 4.8), tUl = T(v.underAt, 4.2), tLogo = T(v.logoAt, 0.45);
    root._punch = [tBtn];
    return (lt, d) => {
      const q = Q(lt);
      lazy(btn, (w, h) => { btnFace.style.clipPath = poly(tornPts(w, h, 191, {})); btn.style.left = (SW - w) / 2 + 'px'; });
      lazy(ctas, () => { ctaEls.forEach((c, i) => { $('.pc-face', c).style.clipPath = poly(tornPts(c.offsetWidth, c.offsetHeight, 200 + i, { torn: 'lr', amp: 3.5, step: 7 })); }); });
      if (!deco._p && tl.offsetWidth) { // garis bawah "termuda" + hati krayon setelah "Anda."
        deco._p = 1;
        const rel = (el) => { let x = 0, y = 0, e = el; while (e && e !== card) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return [x, y]; };
        const wEl = tlW.find((w) => /termuda/i.test(w.textContent)), last = tlW[tlW.length - 1];
        if (wEl) { const [x, y] = rel(wEl); ulP.setAttribute('d', underD(x + 6, x + wEl.offsetWidth - 2, y + wEl.offsetHeight * 0.9, 5)); }
        if (last) { const [x, y] = rel(last); const s = pk(30, 34); hrP.setAttribute('d', heartD(x + last.offsetWidth + s * 1.3, y + last.offsetHeight * 0.42, s)); }
      }
      const kc = P(q, 0.02, 0.4);
      put(card, { rx: lerp(78, 0, oB(kc)), p: 1400, o: kc > 0 ? 1 : 0 }, jit(q, 1, 0.3));
      tapes.forEach((t, i) => { const kt = oB(P(q, 0.4 + i * 0.08, 0.62 + i * 0.08)); put(t, { s: lerp(1.5, 1, Math.max(0, kt)), r: t._r, o: kt > 0 ? 1 : 0 }); });
      const kl = P(q, tLogo, tLogo + 0.5);
      logo.style.clipPath = kl >= 1 ? 'none' : `inset(-10% ${((1 - kl) * 100).toFixed(1)}% -10% 0)`;
      logo.style.opacity = kl > 0 ? 1 : 0;
      nx.forEach((s, i) => { const k = oB(P(q, tNx + i * 0.08, tNx + 0.25 + i * 0.08)); s.style.opacity = k > 0 ? 1 : 0; s.style.transform = `translateY(${((1 - k) * 26).toFixed(1)}px) rotate(${((1 - k) * (i % 2 ? 14 : -14)).toFixed(1)}deg)`; });
      popWords(tlW, times, q, { dur: 0.26, dy: 16 });
      drawK(ulP, P(q, tUl, tUl + 0.3));
      drawK(hrP, P(q, tHeart, tHeart + 0.35));
      const kb = oB(P(q, tBtn - 0.04, tBtn + 0.3)), pressed = q >= tPress && q < tPress + 0.25;
      put(btn, { s: Math.max(0.02, kb) * (pressed ? 0.94 : 1), y: pressed ? 6 : 0, r: -1, o: kb > 0 ? 1 : 0 }, jit(q, 2, 0.35));
      btn.classList.toggle('down', pressed);
      ctaEls.forEach((c, i) => { const k = oB(P(q, tBtn + 0.3 + i * 0.14, tBtn + 0.6 + i * 0.14)); put(c, { s: Math.max(0.02, k), r: i ? 1.4 : -1.4, o: k > 0 ? 1 : 0 }, jit(q, 5 + i, 0.3)); });
      writeOn(foot, q, tBtn + 0.6, 0.55);
      stk.forEach(({ e, s, at }, i) => {
        const pos = V ? s.v : s.h;
        e.style.left = pos[0] - s.size / 2 + 'px'; e.style.top = pos[1] - s.size / 2 + 'px';
        const k = oB(P(q, at, at + 0.32));
        put(e, { s: Math.max(0, k), y: s.float ? -P(q, at, d) * 40 + Math.sin(q * 1.8 + i) * 6 : Math.sin(q * 1.6 + i) * 4, r: (s.rot || 0) + Math.sin(q * 1.4 + i) * 6, o: k > 0 ? 1 : 0 });
      });
      const t0c = times[0] ?? 2.6;
      conf.forEach((c) => {
        const tt = q - t0c - c.dl, on = tt > 0;
        const y = -40 + tt * c.sp, x = c.x + Math.sin(tt * 2 + c.x) * c.sw;
        c.el.style.opacity = on && y < SH + 40 ? 0.95 : 0;
        c.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(c.r0 + tt * c.rs).toFixed(1)}deg)`;
      });
      fade.style.opacity = P(lt, d - 0.6, d).toFixed(3);
    };
  });
})();
