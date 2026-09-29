// Gaya T03 · STOP MOTION TYPOGRAPHY: papan gabus + kertas/sticky/huruf guntingan/stempel. Semua waktu dikuantisasi ke
// 12 fps; tiap objek bergetar kecil per langkah (boil), eksposur berkedip, kamera "dipindah tangan" antar-fokus.
// Deterministik: tekstur gabus & tinta dibuat dari hash, gerak hanya bergantung pada waktu.
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const FPS = 12, stepOf = (t) => Math.floor(t * FPS + 1e-6), qt = (t) => stepOf(t) / FPS;
  const LOGO = '../assets/privasimu_logo.png';
  document.body.insertAdjacentHTML('beforeend', `<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">📎☕✓</div>
    <svg width="0" height="0" style="position:absolute"><filter id="sm-rough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`);

  // ---------- tata letak per format (koordinat papan = layar pada zoom 1) ----------
  const L16 = {
    rating: [110, 110, 0, 128], strip1: [120, 300, -2.5], jujur: [560, 360, 7, 250],
    mon: [860, 110, -1.5], pw: [1210, 70, 9, 270], st1: [980, 360, -14],
    bub: [1480, 140, 2], st2: [1560, 390, 12],
    fd: [150, 640, -4], st3: [470, 840, -10],
    cal: [820, 600, 3], rapat: [1300, 650, -8, 230], st4: [1080, 800, -16],
    card: [560, 150, -1.5], st10: [1170, 650, -12],
    strip2: [770, 150, -2], url: [745, 330, 0, 110], cek: [1280, 580, 6, 260], kontak: [900, 920, -1],
    cardTo: [60, 110, -4, 0.62],
  };
  const L9 = {
    rating: [90, 170, 0, 150], strip1: [90, 390, -2.5], jujur: [650, 380, 7, 250],
    mon: [50, 720, -1.5], pw: [330, 680, 9, 230], st1: [110, 990, -14],
    bub: [560, 720, 2], st2: [640, 1010, 12],
    fd: [60, 1270, -4], st3: [230, 1560, -10],
    cal: [580, 1250, 3], rapat: [360, 1690, -8, 220], st4: [700, 1500, -16],
    card: [90, 560, -1.5], st10: [560, 1270, -12],
    strip2: [90, 910, -2], url: [62, 1060, 0, 90], cek: [560, 1300, 6, 280], kontak: [90, 1700, -1],
    cardTo: [150, 130, -4, 0.8],
  };
  const LAY = V ? L9 : L16;
  const FOCUS = V
    ? { title: [60, 130, 960, 560], n1: [30, 650, 560, 520], n2: [540, 680, 520, 500], n3: [30, 1230, 540, 520], n4: [540, 1210, 520, 560], all: [0, 0, SW, SH], nexus: [60, 500, 960, 900], cta: [0, 0, SW, SH] }
    : { title: [80, 70, 760, 560], n1: [840, 40, 680, 560], n2: [1440, 90, 460, 470], n3: [110, 580, 640, 470], n4: [780, 560, 760, 500], all: [0, 0, SW, SH], nexus: [500, 110, 920, 860], cta: [0, 0, SW, SH] };
  const camOf = (f) => { const [x, y, w, hh] = FOCUS[f]; return { x: x + w / 2, y: y + hh / 2, z: cl(Math.min(SW * 0.9 / w, SH * 0.86 / hh), 1.015, 2.4) }; };

  // ---------- tekstur (sekali, deterministik) ----------
  const M = V ? 700 : 220, RES = V ? 1.25 : 1.5; // 9:16: margin gabus lebih lebar agar kamera bisa memusatkan judul
  const cork = document.createElement('canvas');
  cork.width = Math.round((SW + 2 * M) * RES); cork.height = Math.round((SH + 2 * M) * RES);
  (() => {
    const c = cork.getContext('2d'), W = cork.width, H = cork.height;
    c.fillStyle = '#C08F5A'; c.fillRect(0, 0, W, H);
    const N = Math.round(W * H / 55);
    for (let i = 0; i < N; i++) {
      const x = hash(i * 1.13 + 0.7) * W, y = hash(i * 2.71 + 1.9) * H, r = (0.6 + hash(i * 3.3) * 2.6) * RES, v = hash(i * 5.9 + 3);
      c.fillStyle = v < 0.45 ? `rgba(110,68,30,${0.25 + 0.5 * hash(i * 7.7)})` : v < 0.8 ? `rgba(226,180,120,${0.25 + 0.45 * hash(i * 9.1)})` : `rgba(80,48,20,${0.35 + 0.4 * hash(i * 4.3)})`;
      c.fillRect(x, y, r, r * (0.6 + hash(i * 6.1)));
    }
    const g = c.createRadialGradient(W * 0.3, H * 0.25, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    g.addColorStop(0, 'rgba(255,220,170,.18)'); g.addColorStop(1, 'rgba(40,20,5,.35)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  })();
  const ink = (() => { // masker bintik tinta untuk stempel
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), im = x.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = hash(i * 0.917 + 5); im.data[i * 4 + 3] = v < 0.16 ? 40 + v * 900 : 255; }
    x.putImageData(im, 0, 0);
    return c.toDataURL('image/png');
  })();
  document.documentElement.style.setProperty('--ink', `url(${ink})`);

  // ---------- papan & kamera ----------
  let board = null, flick = null;
  const OBJ = [], SCN = [];
  let SWEEP = null, CARDTO = null;
  function ensureBoard() {
    if (board) return;
    board = h('<div id="sm-board"></div>');
    $('#stage').insertBefore(board, $('#bg').nextSibling);
  }
  function clampCam(c) { // pandangan tidak boleh keluar dari tekstur gabus (papan + margin M)
    const hw = SW / (2 * c.z), hh = SH / (2 * c.z), m = M * 0.85;
    const cx = (lo, hi, v) => (lo > hi ? (lo + hi) / 2 : cl(v, lo, hi));
    return { x: cx(hw - m, SW - hw + m, c.x), y: cx(hh - m, SH - hh + m, c.y), z: c.z };
  }
  function camera(t) {
    const tq = qt(t);
    let k = 0;
    SCN.forEach((s, i) => { if (tq >= s.t0) k = i; });
    const cur = clampCam(camOf(SCN[k].focus));
    if (k === 0 || SCN[k].focus === SCN[k - 1].focus) return cur;
    const prev = clampCam(camOf(SCN[k - 1].focus)), p = E.io3(P(tq, SCN[k].t0, SCN[k].t0 + 0.58));
    return { x: lerp(prev.x, cur.x, p), y: lerp(prev.y, cur.y, p), z: lerp(prev.z, cur.z, p) };
  }
  function shakeAt(tq) { // hentakan stempel mengguncang papan 2 langkah
    let s = 0;
    for (const o of OBJ) if (o.k === 'stamp' && tq >= o.t0 && tq < o.t0 + 2 / FPS) s = o.big ? 14 : 9;
    return s;
  }
  function camCss(c, tq) {
    const st = stepOf(tq), sh = shakeAt(tq), jx = (hash(st * 1.7) - 0.5) * 2.2 + (hash(st * 3.1) - 0.5) * sh, jy = (hash(st * 2.3) - 0.5) * 2.2 + (hash(st * 4.7) - 0.5) * sh;
    return `translate(${(SW / 2 + jx).toFixed(1)}px, ${(SH / 2 + jy).toFixed(1)}px) scale(${c.z.toFixed(4)}) translate(${-c.x}px, ${-c.y}px)`;
  }

  // ---------- pembuat objek ----------
  const typed = (s) => [...s].map((ch) => `<span${/\p{Extended_Pictographic}/u.test(ch) ? ' class="emo"' : ''}>${esc(ch)}</span>`).join('');
  const RF = ['f0', 'f1', 'f2', 'f3', 'f4'], RC = [['#fff', '#111'], ['#111', '#fff'], ['#FFE14D', '#111'], ['#D7263D', '#fff'], ['#F4E9D8', '#1F3B8F'], ['#2F6BFF', '#fff']];
  function makeObj(o, sc, T) {
    const [x, y, r = 0, size] = LAY[o.id] || [0, 0, 0];
    const t0 = sc.start + T(o.at, 0);
    const el = h(`<div class="sm-obj sm-${o.k}" style="left:${x}px;top:${y}px"></div>`);
    const O = { id: o.id, k: o.k, el, x, y, r, t0, big: !!o.big, parts: [], seed: OBJ.length * 7.31 };
    if (o.k === 'ransom') {
      const fs = size || 110;
      let cx = 0;
      [...o.text].forEach((ch, i) => {
        const s = fs * (0.86 + 0.28 * hash(i * 3.1 + O.seed)), [bg, fg] = RC[Math.floor(hash(i * 5.7 + O.seed) * RC.length)];
        const le = h(`<div class="sm-rl ${RF[Math.floor(hash(i * 2.3 + O.seed) * RF.length)]}" style="left:${cx.toFixed(0)}px;top:${((hash(i * 4.1 + O.seed) - 0.5) * fs * 0.22).toFixed(0)}px;font-size:${s.toFixed(0)}px;background:${bg};color:${fg}">${esc(ch)}</div>`);
        el.appendChild(le);
        O.parts.push({ el: le, t0: t0 + i / FPS, r: (hash(i * 6.7 + O.seed) - 0.5) * 18 });
        cx += ch === '.' ? s * 0.42 : s * (o.small ? 0.8 : 0.84);
      });
    } else if (o.k === 'sticky') {
      const S = size || 250;
      el.innerHTML = `<div class="pad ${o.color || 'y'}" style="width:${S}px;height:${S}px"><div class="tx">${o.lines.map(([t, c]) => `<div class="${c}">${esc(t)}</div>`).join('')}</div></div>${o.pin === 'tape' ? '<i class="tape"></i>' : '<i class="pin"></i>'}`;
    } else if (o.k === 'strip') {
      el.innerHTML = `<div class="paper">${esc(o.text)}</div>`;
    } else if (o.k === 'monitor') {
      el.innerHTML = '<div class="frame"><div class="scr"><i></i><i></i><i></i><b></b></div></div><div class="neck"></div><div class="base"></div>';
    } else if (o.k === 'bubble') {
      el.innerHTML = `<div class="paper"><div class="hd">${esc(o.head)}</div><div class="msg">${typed(o.text)}</div><div class="sub">${esc(o.sub)}</div></div>`;
      O.type = { spans: [...el.querySelectorAll('.msg span')], t: sc.start + T(o.typeAt, 0.6) };
    } else if (o.k === 'flash') {
      el.innerHTML = `<div class="stick"><div class="plug"></div><div class="body"><b>32 GB</b></div></div><svg class="string" viewBox="0 0 120 140"><path d="M8 20 C 40 60, 70 40, 96 118"/></svg><div class="tag"><i></i><div class="ty">${typed(o.tag)}</div></div>`;
      O.type = { spans: [...el.querySelectorAll('.tag .ty span')], t: sc.start + T(o.tagAt, 0.6) };
    } else if (o.k === 'cal') {
      el.innerHTML = `<div class="paper"><div class="rings"><i></i><i></i><i></i></div><div class="top">INSIDEN</div><div class="big">${esc(o.big)}</div><div class="sub">${esc(o.sub)}</div>
        <svg class="scrib" viewBox="0 0 400 120" preserveAspectRatio="none"><path pathLength="1" d="M10 70 L60 30 L95 92 L140 28 L180 95 L225 30 L265 92 L305 32 L350 90 L392 40"/></svg>
        <div class="hwn">${typed(o.scribble)}</div></div>`;
      O.type = { spans: [...el.querySelectorAll('.hwn span')], t: sc.start + T(o.scribbleAt, 1) };
      O.scrib = { path: el.querySelector('.scrib path'), t: sc.start + T(o.scribbleAt, 1) };
    } else if (o.k === 'stamp') {
      el.innerHTML = `<div class="ink ${o.color || 'red'} ${o.big ? 'big' : ''}"><span>${esc(o.text)}</span></div>`;
    } else if (o.k === 'card') {
      el.innerHTML = `<div class="paper"><div class="clip"></div><img class="logo" src="${LOGO}" alt=""><div class="nx">NEXUS</div><div class="items">${o.items.map(([txt]) => `<div class="it"><i class="box"><svg viewBox="0 0 100 100"><path pathLength="1" d="M14 54 L40 80 L88 20"/></svg></i><span class="ty">${typed(txt)}</span></div>`).join('')}</div></div>`;
      O.items = o.items.map(([, at], i) => ({ t: sc.start + T(at, 1 + i), spans: [...el.querySelectorAll('.it')[i].querySelectorAll('.ty span')], path: el.querySelectorAll('.it')[i].querySelector('path') }));
    } else if (o.k === 'type') {
      el.innerHTML = `<div class="paper">${typed(o.text)}</div>`;
      O.type = { spans: [...el.querySelectorAll('span')], t: t0 };
    }
    board.appendChild(el);
    OBJ.push(O);
    return O;
  }

  // ---------- render papan ----------
  function place(O, tq) { // letakkan: melayang → menempel dalam 2-3 langkah; getar kecil per langkah
    const st = stepOf(tq), u = Math.round((tq - qt(O.t0)) * FPS);
    let s = 1, lift = 0;
    if (O.k === 'stamp') s = u <= 0 ? 1.5 : 1;
    else if (O.k === 'ransom') s = 1; // tiap huruf punya animasi tempel sendiri
    else if (u === 0) { s = 1.1; lift = 14; } else if (u === 1) { s = 1.04; lift = 5; }
    const jx = (hash(st * 1.31 + O.seed) - 0.5) * 2.4, jy = (hash(st * 2.17 + O.seed) - 0.5) * 2.4, jr = (hash(st * 3.93 + O.seed) - 0.5) * 0.7;
    let x = 0, y = -lift, r = O.r + jr, sc = s;
    if (CARDTO && (O.id === 'card' || O.id === 'st10') && tq >= CARDTO.t0) { // kartu Nexus (+ stempelnya) bergeser memberi ruang CTA
      const p = E.io3(P(tq, CARDTO.t0, CARDTO.t0 + 0.5)), [tx, ty, trot, tsc] = LAY.cardTo, C = OBJ.find((o) => o.id === 'card');
      const dx = tx - C.x, dy = ty - C.y;
      if (O === C) { x += dx * p; y += dy * p; r = lerp(O.r, trot, p) + jr; }
      else { // stempel ikut: pusatnya dipetakan dengan skala di sekitar pusat kartu
        const c0x = C.x + C.el.offsetWidth / 2, c0y = C.y + C.el.offsetHeight / 2, s0x = O.x + O.el.offsetWidth / 2, s0y = O.y + O.el.offsetHeight / 2;
        x += (c0x + dx + tsc * (s0x - c0x) - s0x) * p; y += (c0y + dy + tsc * (s0y - c0y) - s0y) * p; r = O.r + (trot - C.r) * p + jr;
      }
      sc *= lerp(1, tsc, p);
    }
    if (O.k === 'card' && u >= 0 && u < 6) y += (1 - E.outBack(u / 5)) * 700; // kartu masuk dari bawah
    if (SWEEP && tq >= SWEEP.t0 && O.t0 < SWEEP.t0) { // disapu keluar papan, bergiliran
      const i = OBJ.indexOf(O), p = cl((tq - SWEEP.t0 - (i * 0.5) / FPS) / (6 / FPS), 0, 1);
      if (p >= 1) { O.el.style.display = 'none'; return; }
      const dx = O.x - SW / 2, dy = O.y - SH / 2, dl = Math.hypot(dx, dy) || 1;
      x += (dx / dl) * 1500 * E.in3(p); y += (dy / dl) * 1500 * E.in3(p); r += 35 * p;
    }
    O.el.style.display = 'block';
    O.el.style.transform = `translate(${(x + jx).toFixed(1)}px, ${(y + jy).toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    O.el.style.setProperty('--lift', lift);
  }
  function renderBoard(t) {
    if (!flick) { flick = h('<div id="sm-flick"></div>'); $('#stage').insertBefore(flick, $('#grain')); $('#stage').insertBefore(h('<div id="sm-warm"></div>'), flick); }
    const tq = qt(t);
    board.style.transform = camCss(camera(t), tq);
    for (const O of OBJ) {
      if (tq < qt(O.t0) - 1e-6 && !(O.parts.length && tq >= qt(O.parts[0].t0))) { O.el.style.display = 'none'; continue; }
      place(O, tq);
      O.parts.forEach((p, i) => {
        const u = Math.round((tq - qt(p.t0)) * FPS);
        if (u < 0) { p.el.style.display = 'none'; return; }
        const st = stepOf(tq);
        p.el.style.display = 'block';
        p.el.style.transform = `translateY(${u === 0 ? -12 : 0}px) rotate(${(p.r + (hash(st * 1.7 + i + O.seed) - 0.5) * 1.6).toFixed(2)}deg) scale(${u === 0 ? 1.12 : 1})`;
      });
      if (O.type) { const n = tq < qt(O.type.t) ? 0 : Math.round((tq - qt(O.type.t)) * 24) + 2; O.type.spans.forEach((s, j) => { s.style.visibility = j < n ? 'visible' : 'hidden'; }); }
      if (O.scrib) O.scrib.path.style.strokeDashoffset = (1 - cl((tq - qt(O.scrib.t)) / 0.5, 0, 1)).toFixed(3);
      if (O.items) O.items.forEach((it) => {
        const n = tq < qt(it.t) ? 0 : Math.round((tq - qt(it.t)) * 30) + 2;
        it.spans.forEach((s, j) => { s.style.visibility = j < n ? 'visible' : 'hidden'; });
        it.path.style.strokeDashoffset = (1 - cl((tq - qt(it.t) - 0.25) / 0.34, 0, 1)).toFixed(3);
      });
    }
    flick.style.opacity = (0.015 + 0.05 * hash(stepOf(tq) * 1.37)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Permanent Marker"', '700 60px Caveat', '400 40px "Special Elite"', '400 60px "Abril Fatface"', '400 60px "Archivo Black"', '400 60px "Bebas Neue"', 'italic 900 60px "Playfair Display"', '400 60px Anton'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#5A3A1C'; cx.fillRect(0, 0, W, H);
      if (!SCN.length) return;
      const tq = qt(t), c = camera(t), st = stepOf(tq), sh = shakeAt(tq);
      const jx = (hash(st * 1.7) - 0.5) * 2.2 + (hash(st * 3.1) - 0.5) * sh, jy = (hash(st * 2.3) - 0.5) * 2.2 + (hash(st * 4.7) - 0.5) * sh;
      cx.save();
      cx.translate(W / 2 + jx, H / 2 + jy); cx.scale(c.z, c.z); cx.translate(-c.x, -c.y);
      cx.drawImage(cork, -M, -M, W + 2 * M, H + 2 * M);
      cx.restore();
    },
  });

  KIT.registerType('sm', (root, v, sc, tm, T) => {
    ensureBoard();
    SCN.push({ t0: sc.start, focus: v.focus });
    v.objs.forEach((o) => makeObj(o, sc, T));
    if (v.sweepAt) SWEEP = { t0: qt(sc.start + T(v.sweepAt, 1)) };
    if (v.cardTo) CARDTO = { t0: qt(sc.start) };
    const fade = v.focus === 'cta' ? h('<div class="sm-fade"></div>') : null;
    if (fade) root.appendChild(fade);
    return (lt, d) => {
      renderBoard(sc.start + lt);
      if (fade) fade.style.opacity = P(qt(lt), d - 0.5, d - 0.05);
    };
  });
})();
