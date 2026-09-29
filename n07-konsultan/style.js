// N07 · Konsultan PDP — gaya "editorial premium / majalah bisnis mewah".
// Latar kertas ivory bertekstur (digambar deterministik sekali), teks navy, aksen emas.
// Transisi khas: garis emas (wipe) dan balik halaman (page curl) memakai halaman scene sebelumnya pada keadaan akhirnya.
// Semua gerak dihitung dari `lt`; acak memakai MG.hash.
(function () {
  const { SW, SH, V, h, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const LOGO = '../assets/privasimu_logo.png';
  const SHOT = '../assets/app/dashboard.png';          // screenshot asli Privasimu Nexus (lihat assets/app/manifest.json)
  const NAVY = '#0F1B33';
  const oq = (k) => 1 - Math.pow(1 - k, 5);             // outQuint
  const ios = (k) => 0.5 - 0.5 * Math.cos(Math.PI * k); // inOutSine (morph lembut)
  const ED = (window.ED = { R: {}, dur: {}, push: {}, fx: null });
  (window.PRV ? PRV.SCENES : []).forEach((s) => { ED.push[s.id] = s.vis.push ?? 0.035; });

  // gambar logo sumber (ikut ditunggu engine sebelum READY)
  const LOGO_IMG = document.createElement('img');
  LOGO_IMG.src = LOGO; LOGO_IMG.alt = ''; LOGO_IMG.style.display = 'none';
  document.body.appendChild(LOGO_IMG);

  // ---------- util teks: mask reveal per kata ----------
  function maskWords(el) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const m = document.createElement('span'); m.className = 'mw';
            const w = document.createElement('span'); w.className = 'wi'; w.textContent = part;
            m.appendChild(w); frag.appendChild(m); out.push(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return out;
  }
  // times: angka (mulai + stagger) atau array waktu per kata
  function revealMask(ws, times, lt, { stagger = 0.07, dur = 0.8, out = null } = {}) {
    ws.forEach((w, i) => {
      const t0 = Array.isArray(times) ? times[Math.min(i, times.length - 1)] : times + i * stagger;
      const k = oq(P(lt, t0, t0 + dur));
      let y = (1 - k) * 140;
      if (out != null) y -= 140 * E.in3(P(lt, out + i * 0.03, out + i * 0.03 + 0.45));
      w.style.transform = Math.abs(y) < 0.05 ? 'none' : `translateY(${y.toFixed(2)}%)`;
    });
  }
  function kicker(root, text, cls) {
    const el = h(`<div class="ed-kick ${cls}"><i class="rl"></i><span>${text}</span></div>`);
    root.appendChild(el);
    const ws = maskWords($('span', el));
    return (t0, lt, tOut = 99) => {
      $('.rl', el).style.transform = `scaleX(${E.io3(P(lt, t0, t0 + 0.7))})`;
      revealMask(ws, t0 + 0.12, lt, { stagger: 0.05, dur: 0.7 });
      const ko = E.in3(P(lt, tOut, tOut + 0.45));
      el.style.opacity = 1 - ko;
      el.style.transform = `translateY(${-14 * ko}px)`;
    };
  }

  // ---------- logo navy (canvas; logo asli putih) ----------
  function logoCanvas(w) {
    const hh = Math.round(w * 180 / 1252), cv = document.createElement('canvas');
    cv.width = w * 2; cv.height = hh * 2; cv.style.width = w + 'px'; cv.style.height = hh + 'px';
    return cv;
  }
  function paintLogo(cv, color, sweep = null) {
    const x = cv.getContext('2d'), W = cv.width, H = cv.height;
    x.globalCompositeOperation = 'source-over';
    x.clearRect(0, 0, W, H);
    if (!LOGO_IMG.complete || !LOGO_IMG.naturalWidth) return false;
    x.drawImage(LOGO_IMG, 0, 0, W, H);
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = color; x.fillRect(0, 0, W, H);
    if (sweep != null && sweep > 0 && sweep < 1) {
      x.globalCompositeOperation = 'source-atop';
      const c = lerp(-0.25, 1.25, sweep) * W, g = x.createLinearGradient(c - W * 0.14, 0, c + W * 0.14, H * 0.9);
      g.addColorStop(0, 'rgba(190,152,94,0)'); g.addColorStop(0.4, 'rgba(190,152,94,.9)'); g.addColorStop(0.5, 'rgba(248,232,192,1)');
      g.addColorStop(0.6, 'rgba(190,152,94,.9)'); g.addColorStop(1, 'rgba(190,152,94,0)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
    x.globalCompositeOperation = 'source-over';
    return true;
  }

  // ---------- kepala & kaki halaman majalah (tidak ikut zoom kamera) ----------
  function chrome(root, n, { anim = false, id } = {}) {
    const el = h(`<div class="ed-chrome"><div class="ch-top"><span class="lg"></span><span class="ch-ed">Edisi Pelindungan Data Pribadi</span><span class="ch-no"><b>${String(n).padStart(2, '0')}</b> / 06</span></div>
      <i class="ch-rl t"></i>${V ? '' : '<i class="ch-rl b"></i><div class="ch-bot"><span>Konsultan Pelindungan Data Pribadi</span><span>privasimu.com</span></div>'}</div>`);
    root.appendChild(el);
    const cv = logoCanvas(V ? 176 : 150);
    cv.className = 'ch-logo';
    $('.lg', el).replaceWith(cv);
    let drawn = false;
    const push = ED.push[id] ?? 0.035;
    const tops = [...el.querySelectorAll('.ch-top > *, .ch-bot')], rules = [...el.querySelectorAll('.ch-rl')];
    return (lt, d, fadeTop = 0) => {
      if (!drawn) drawn = paintLogo(cv, NAVY);
      el.style.transform = `scale(${1 / (1 + push * (lt / d))})`;
      if (anim) {
        rules.forEach((r, i) => { r.style.transform = `scaleX(${E.io3(P(lt, 0.05 + i * 0.1, 1.05 + i * 0.1))})`; });
        tops.forEach((t, i) => { const k = E.out3(P(lt, 0.35 + i * 0.1, 1.0 + i * 0.1)); t.style.opacity = k * (1 - fadeTop); t.style.transform = `translateY(${(1 - k) * 8}px)`; });
      } else tops.forEach((t) => { t.style.opacity = 1 - fadeTop; });
    };
  }

  // ---------- kertas ivory bertekstur (sekali, deterministik) ----------
  let PAPER = null;
  function makePaper(W, H) {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.fillStyle = '#F4EFE6'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) {
      const cx = hash(i * 3.1 + 1) * W, cy = hash(i * 5.7 + 2) * H, r = (0.18 + hash(i * 7.3 + 3) * 0.45) * Math.max(W, H);
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r), light = hash(i * 9.1 + 4) > 0.45;
      g.addColorStop(0, light ? 'rgba(255,252,244,.32)' : 'rgba(206,188,158,.13)'); g.addColorStop(1, 'rgba(244,239,230,0)');
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
    x.lineCap = 'round';
    const NF = Math.round(W * H / 700);
    for (let i = 0; i < NF; i++) {
      const px = hash(i * 1.71 + 11) * W, py = hash(i * 2.37 + 13) * H, len = 5 + hash(i * 3.13 + 17) * 24, a = hash(i * 4.7 + 19) * Math.PI * 2;
      const dark = hash(i * 5.3 + 23) > 0.5;
      x.strokeStyle = dark ? `rgba(128,100,60,${0.025 + hash(i * 6.1 + 29) * 0.045})` : `rgba(255,255,250,${0.08 + hash(i * 7.9 + 31) * 0.14})`;
      x.lineWidth = 0.5 + hash(i * 8.3 + 37) * 0.8;
      x.beginPath(); x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a + 0.5) * len * 0.5, py + Math.sin(a + 0.5) * len * 0.5, px + Math.cos(a) * len, py + Math.sin(a) * len);
      x.stroke();
    }
    const img = x.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const nz = (hash(i * 0.0131 + 0.7) - 0.5) * 8; d[i] += nz; d[i + 1] += nz; d[i + 2] += nz * 0.9; }
    x.putImageData(img, 0, 0);
    return c;
  }

  // ---------- transisi: wipe garis emas & balik halaman ----------
  const TRANS = { s2: 'wipe', s3: 'turn', s4: 'wipe', s5: 'wipe', s6: 'turn' };
  const TDUR = { wipe: 0.8, turn: 1.1 };
  function fxEls() {
    if (ED.fx) return ED.fx;
    const w = h('<div id="ed-fx"><div class="fshadow"></div><div class="flapw"><div class="flap"></div></div><div class="wsh"></div><div class="wl"></div></div>');
    document.getElementById('stage').insertBefore(w, document.getElementById('grain'));
    ED.fx = { w, line: $('.wl', w), wsh: $('.wsh', w), sh: $('.fshadow', w), fw: $('.flapw', w), flap: $('.flap', w) };
    return ED.fx;
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
    const order = window.TIMELINE.scenes.map((s) => s.id), prev = order[order.indexOf(id) - 1], kind = TRANS[id];
    const active = prev && kind && lt < TDUR[kind];
    // halaman aktif tidak pernah membawa status "halaman yang dibalik" (aman untuk seek mundur / pratinjau)
    const cur = document.getElementById('s-' + id);
    if (cur.classList.contains('ed-carry')) cur.classList.remove('ed-carry');
    cur.style.clipPath = 'none';
    order.forEach((sid) => {
      if (sid === id || (active && sid === prev)) return;
      const el = document.getElementById('s-' + sid);
      if (el && el.classList.contains('ed-carry')) { el.classList.remove('ed-carry'); el.style.clipPath = 'none'; el.style.display = 'none'; }
    });
    if (!active) return;
    const ps = document.getElementById('s-' + prev), pd = ED.dur[prev] ?? 5;
    ps.style.display = 'block';
    ps.classList.add('ed-carry');
    if (ED.R[prev]) ED.R[prev](pd, pd);
    const sc = 1 + (ED.push[prev] ?? 0.035);
    ps.style.transform = `scale(${sc})`; ps.style.opacity = 1; ps.style.filter = 'none';
    const toL = (p) => [SW / 2 + (p[0] - SW / 2) / sc, SH / 2 + (p[1] - SH / 2) / sc];
    const k = P(lt, 0, TDUR[kind]);
    if (kind === 'wipe') {
      const X = lerp(-8, SW + 8, E.io3(k));
      ps.style.clipPath = `inset(0 0 0 ${toL([X, 0])[0].toFixed(1)}px)`;
      const o = P(k, 0, 0.05) * (1 - P(k, 0.95, 1));
      f.line.style.opacity = o; f.line.style.transform = `translateX(${X.toFixed(1)}px)`;
      f.wsh.style.opacity = o; f.wsh.style.transform = `translateX(${(X - 90).toFixed(1)}px)`;
      return;
    }
    // balik halaman: sudut kanan-bawah terangkat, lipatan bergerak ke kiri-atas
    const e = E.io3(k), n = [0.958, 0.287];
    const C = [[0, 0], [SW, 0], [SW, SH], [0, SH]], dots = C.map((c) => c[0] * n[0] + c[1] * n[1]);
    const smax = Math.max(...dots), smin = Math.min(...dots), s = lerp(smax + 4, smin - 80, e);
    const A = clipHalf(C, n, s, -1), B = clipHalf(C, n, s, 1), F = B.map((p) => reflect(p, n, s));
    ps.style.clipPath = polyCss(A.map(toL));
    if (F.length > 2) {
      f.fw.style.display = 'block';
      f.flap.style.clipPath = polyCss(F);
      const g = [-n[0], -n[1]], ang = Math.atan2(g[0], -g[1]) * 180 / Math.PI, gmin = Math.min(...C.map((c) => c[0] * g[0] + c[1] * g[1]));
      const f0 = -s - gmin, wB = smax - s;
      f.flap.style.background = `linear-gradient(${ang.toFixed(2)}deg, #FFFDF8 ${f0.toFixed(1)}px, #F3ECDF ${(f0 + 16).toFixed(1)}px, #E6DBC7 ${(f0 + 44).toFixed(1)}px, #F1E9DB ${(f0 + 120).toFixed(1)}px, #ECE2CF ${(f0 + Math.max(170, wB * 0.7)).toFixed(1)}px, #DFD2B8 ${(f0 + Math.max(210, wB)).toFixed(1)}px)`;
      const an = Math.atan2(n[0], -n[1]) * 180 / Math.PI, f1 = s - smin;
      f.sh.style.clipPath = polyCss(B);
      f.sh.style.background = `linear-gradient(${an.toFixed(2)}deg, rgba(48,32,10,.30) ${f1.toFixed(1)}px, rgba(48,32,10,.10) ${(f1 + 60).toFixed(1)}px, rgba(48,32,10,0) ${(f1 + 190).toFixed(1)}px)`;
      f.sh.style.opacity = 1 - P(e, 0.8, 1);
    }
  }

  KIT.style({
    fonts: ['400 20px "Playfair Display"', '500 20px "Playfair Display"', '600 20px "Playfair Display"', 'italic 400 20px "Playfair Display"',
      'italic 500 20px "Playfair Display"', '400 20px "Inter"', '500 20px "Inter"', '600 20px "Inter"', 'italic 500 20px "Cormorant Garamond"'],
    themes: { ivory: ['#F4EFE6', '#F4EFE6', '#F4EFE6', 'rgba(0,0,0,0)', 'rgba(176,141,87,0)'] },
    bg: (cx, t, id, theme, W, H) => {
      if (!PAPER) {
        PAPER = makePaper(W, H);
        document.getElementById('stage').style.setProperty('--paper', `url(${PAPER.toDataURL('image/jpeg', 0.92)})`);
      }
      cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over';
      cx.drawImage(PAPER, 0, 0);
      // cahaya hangat yang bergeser sangat pelan (jendela kantor)
      const lx = W * (0.3 + 0.35 * Math.sin(t * 0.045)), ly = H * (0.05 + 0.08 * Math.cos(t * 0.06));
      const g = cx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(W, H) * 0.95);
      g.addColorStop(0, 'rgba(255,251,242,.50)'); g.addColorStop(0.45, 'rgba(255,249,238,.10)'); g.addColorStop(1, 'rgba(150,118,70,.08)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
    frame: (id, lt) => transitions(id, lt),
  });
  const reg = (sc, render) => { ED.R[sc.id] = render; ED.dur[sc.id] = sc.dur; return render; };

  // =====================================================================
  // S1 · 16.01.2027 + "Siapa yang mendampingi organisasi Anda?" + ruang rapat dengan satu kursi kosong
  // =====================================================================
  const CHAIR = (() => {
    const P0 = [], f = (n) => n.toFixed(1);
    const ln = (d, o, cls = '') => P0.push(`<path class="dr ${cls}" data-o="${o}" pathLength="1" d="${d}"/>`);
    ln('M22 172H578', 0, 'faint');
    ln('M150 172L40 460M450 172L560 460', 0.3, 'faint');
    [[64, 176], [424, 536]].forEach(([x0, x1], i) => {
      ln(`M${x0} 150V34H${x1}V150Z`, 0.2 + i * 0.2, 'faint');
      ln(`M${(x0 + x1) / 2} 34V150M${x0} 92H${x1}`, 0.5 + i * 0.2, 'faint');
    });
    ln('M300 0V38', 1); ln('M268 38H332L348 60H252Z', 1.3);
    ln('M236 206H364L528 420H72Z', 2); ln('M72 420V434H528V420', 2.6);
    [0.2, 0.5, 0.8].forEach((t, i) => {
      const ex = 236 - 164 * t, ey = 206 + 214 * t, k = 0.55 + 0.62 * t;
      [1, -1].forEach((dir, side) => {
        const X = (x) => (dir === 1 ? x : 600 - x);
        const bx = ex - 40 * k, top = ey - 58 * k, seat = ey + 6 * k, floor = ey + 40 * k, fx = ex - 7 * k;
        ln(`M${f(X(bx + 5 * k))} ${f(top)}Q${f(X(bx - 3 * k))} ${f((top + seat) / 2)} ${f(X(bx))} ${f(seat)}L${f(X(fx))} ${f(seat)}` +
          `M${f(X(bx + 2 * k))} ${f(seat)}L${f(X(bx - 3 * k))} ${f(floor)}M${f(X(fx - 2 * k))} ${f(seat)}L${f(X(fx))} ${f(floor)}`, 3.2 + i * 0.45 + side * 0.15, 'ch');
        const px = ex + 16 + 10 * t, pw = 18 + 18 * t, ph = 7 + 8 * t, py = ey - ph - 3;
        ln(`M${f(X(px))} ${f(py)}L${f(X(px + pw))} ${f(py)}L${f(X(px + pw + 3))} ${f(py + ph)}L${f(X(px + 3))} ${f(py + ph)}Z`, 5 + i * 0.3, 'paper');
      });
    });
    ln('M268 206V158Q268 128 296 128H304Q332 128 332 158V206', 6.2, 'gold');
    ln('M280 150H320M280 166H320', 6.6, 'gold thin');
    ln('M268 186H256V206M332 186H344V206', 6.8, 'gold');
    return `<svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid meet"><defs>
      <linearGradient id="s1cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8CF9B" stop-opacity=".6"/><stop offset="1" stop-color="#E8CF9B" stop-opacity="0"/></linearGradient>
      <radialGradient id="s1glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F3DEB0" stop-opacity=".95"/><stop offset="1" stop-color="#F3DEB0" stop-opacity="0"/></radialGradient></defs>
      <g class="par"><polygon class="cone" points="258,60 342,60 452,300 148,300" fill="url(#s1cone)"/><ellipse class="glow" cx="300" cy="170" rx="82" ry="66" fill="url(#s1glow)"/>
      <path class="tbl" d="M236 206H364L528 420H72Z" fill="#FBF8F2"/>${P0.join('')}</g></svg>`;
  })();

  KIT.registerType('ed-date', (root, v, sc, tm, T) => {
    const ch = chrome(root, 1, { anim: true, id: sc.id });
    const kick = kicker(root, 'PP No. 33 Tahun 2026 · mulai berlaku', 's1k');
    // hook pembuka: "PP 33" besar, naik keluar tepat saat tanggal naik masuk
    const pp = h('<div class="s1-pp">PP <em>33</em></div>');
    root.appendChild(pp);
    const ppw = maskWords(pp), ppt = [T('w:PP', 0.8) - 0.14, T('w:tiga', 1.1) - 0.06], ppOut = T('w:berlaku', 1.75) - 0.12;
    const lines = V ? ['16.01.', '2027'] : ['16.01.2027'];
    const date = h(`<div class="s1-date">${lines.map((s) => `<div class="dl">${[...s].map((c) => `<span class="mc"><span class="ci${c === '.' ? ' dot' : ''}">${c}</span></span>`).join('')}</div>`).join('')}</div>`);
    root.appendChild(date);
    const cis = [...date.querySelectorAll('.ci')];
    const tE = T('w:enam', 2.1), tJ = T('w:Januari', 2.5), tD = T('w:dua', 2.9), tR = T('w:ribu', 3.1), tD2 = T('w:dua#2', 3.3), tT = T('w:tujuh', 3.6);
    const at = [tE - 0.1, tE + 0.02, tE + 0.14, tJ - 0.1, tJ + 0.02, tJ + 0.14, tD - 0.08, tR - 0.08, tD2 - 0.08, tT - 0.06];
    const rule = h('<div class="s1-rule"><i></i><small>Mulai berlaku</small><span>— Pasal 225</span></div>');
    root.appendChild(rule);
    const cal = h(`<div class="s1-cal"><div class="ct">Januari 2027</div><div class="cg">${['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((x) => `<b>${x}</b>`).join('')}${Array.from({ length: 35 }, (_, i) => {
      const n = i - 3;
      return n >= 1 && n <= 31 ? (n === 16 ? '<i class="on">16<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" pathLength="1" transform="rotate(-90 30 30)"/></svg></i>' : `<i>${n}</i>`) : '<i></i>';
    }).join('')}</div></div>`);
    root.appendChild(cal);
    const calRows = [...cal.querySelectorAll('.cg > *')], ring = $('circle', cal), c16 = $('.on', cal);
    const dl2 = h('<div class="ed-kick s1k2"><i class="rl"></i><span>PP 33/2026 · mulai berlaku</span></div>');
    const q = h('<div class="ed-h s1-q"><span class="ln">Siapa yang</span><span class="ln">mendampingi</span><span class="ln">organisasi <em>Anda?</em></span></div>');
    root.appendChild(q);
    const qw = maskWords(q);
    const qt = ['w:Siapa', 'w:yang', 'w:mendampingi', 'w:organisasi', 'w:Anda'].map((s, i) => T(s, 4.9 + i * 0.35) - 0.08);
    const fig = h(`<figure class="s1-fig"><div class="plate">${CHAIR}</div><figcaption><b>Fig. 1</b><span>Ruang rapat direksi. Satu kursi masih kosong.</span></figcaption></figure>`);
    root.appendChild(fig);
    const plate = $('.plate', fig), cap = $('figcaption', fig), paths = [...fig.querySelectorAll('.dr')];
    const cone = $('.cone', fig), glow = $('.glow', fig), tbl = $('.tbl', fig), par = $('.par', fig);
    const tF = T('w:Siapa', 4.9) - 0.45, tFig = T('w:mendampingi', 5.4) - 0.35, tA = T('w:Anda', 6.4);
    // posisi kecil tanggal (FLIP): 16:9 -> baris tanggal di atas; 9:16 -> blok kecil kiri atas
    const FL = pick({ x: 14, y: -128, s: 0.32 }, { x: 14, y: -164, s: 0.3 });
    root.appendChild(dl2);
    const dl2w = maskWords($('span', dl2));
    let meas = null;
    return reg(sc, (lt, d) => {
      ch(lt, d);
      kick(T('w:PP', 0.8) - 0.3, lt, tF - 0.1);
      revealMask(ppw, ppt, lt, { dur: 0.85 });
      const kpo = E.io3(P(lt, ppOut, ppOut + 0.45));
      pp.style.clipPath = kpo > 0 ? `inset(-30% 0 -30% ${(kpo * 100).toFixed(2)}%)` : 'none';
      pp.style.transform = `translateY(${(-6 * P(lt, 0, ppOut) - 10 * kpo).toFixed(2)}px)`;
      pp.style.opacity = 1 - 0.4 * kpo;
      // angka tanggal: naik dari balik mask, satu per satu mengikuti VO
      cis.forEach((c, i) => {
        const k = oq(P(lt, at[i], at[i] + 0.85));
        c.style.transform = k >= 1 ? 'none' : `translateY(${((1 - k) * 130).toFixed(2)}%)`;
      });
      // kilau emas melintas setelah tahun lengkap
      if (!meas && date.offsetWidth) meas = { W: date.offsetWidth, x: cis.map((c) => c.offsetLeft) };
      const sw = P(lt, tT + 0.32, tT + 1.02);
      if (meas) {
        const bx = lerp(-0.25, 1.25, E.io3(sw)) * meas.W, BW = meas.W * 3;
        cis.forEach((c, i) => {
          const dot = c.classList.contains('dot');
          const base = dot ? '#B08D57' : NAVY;
          c.style.backgroundImage = `linear-gradient(100deg, ${base} 0%, ${base} 45%, #C4A064 47.5%, #F6E6BF 50%, #C4A064 52.5%, ${base} 55%, ${base} 100%)`;
          c.style.backgroundSize = `${BW}px 100%`;
          c.style.backgroundPosition = `${(bx - meas.x[i] - BW / 2).toFixed(1)}px 0`;
        });
      }
      // garis emas + keterangan pasal
      const kr = E.io3(P(lt, tT - 0.15, tT + 0.75)), kro = E.in3(P(lt, tF - 0.1, tF + 0.35));
      $('i', rule).style.transform = `scaleX(${kr})`;
      [...rule.querySelectorAll('small, span')].forEach((s, i) => { const kk = E.out3(P(lt, tT + 0.2 + i * 0.12, tT + 0.8 + i * 0.12)); s.style.opacity = kk; s.style.transform = `translateY(${(1 - kk) * 10}px)`; });
      rule.style.opacity = 1 - kro;
      // kalender kecil: muncul pelan, tanggal 16 dilingkari emas saat "enam belas Januari"
      const kcal = 1 - E.in3(P(lt, tF - 0.15, tF + 0.35));
      cal.style.opacity = E.out3(P(lt, 0.7, 1.3)) * kcal;
      cal.style.transform = `translateY(${((1 - kcal) * -16 + Math.sin(lt * 0.7) * 2).toFixed(2)}px)`;
      calRows.forEach((c, i) => { const kk = E.out3(P(lt, 0.8 + (i / 7 | 0) * 0.07, 1.4 + (i / 7 | 0) * 0.07)); c.style.opacity = kk; c.style.transform = `translateY(${((1 - kk) * 8).toFixed(2)}px)`; });
      ring.style.strokeDashoffset = 1 - E.io3(P(lt, tE - 0.05, tE + 0.75));
      const k16 = E.out3(P(lt, tJ - 0.1, tJ + 0.4));
      c16.style.color = k16 > 0.5 ? '#0F1B33' : '';
      c16.style.transform = `scale(${(1 + 0.12 * Math.sin(Math.PI * P(lt, tJ - 0.1, tJ + 0.5))).toFixed(4)})`;
      // FLIP: tanggal besar menyusut jadi baris tanggal
      const kf = E.io3(P(lt, tF, tF + 0.8));
      date.style.transform = `translate(${(FL.x * kf).toFixed(2)}px, ${(FL.y * kf).toFixed(2)}px) scale(${lerp(1, FL.s, kf).toFixed(4)})`;
      $('.rl', dl2).style.transform = `scaleX(${E.io3(P(lt, tF + 0.45, tF + 1.1))})`;
      revealMask(dl2w, tF + 0.55, lt, { stagger: 0.05, dur: 0.7 });
      // pertanyaan, kata per kata mengikuti VO
      revealMask(qw, qt, lt, { dur: 0.85 });
      q.style.transform = `translateY(${(-4 * P(lt, tF, d)).toFixed(2)}px)`;
      // ilustrasi: pelat terbuka dari bawah, garis tergambar, kursi emas menyala di "Anda"
      const kp = E.io3(P(lt, tFig, tFig + 0.9));
      plate.style.clipPath = `inset(${((1 - kp) * 100).toFixed(2)}% 0 0 0)`;
      fig.style.transform = `translateY(${((1 - kp) * 30 + lerp(6, -6, P(lt, tFig, d))).toFixed(2)}px)`;
      par.setAttribute('transform', `translate(0 ${lerp(10, -4, E.out3(P(lt, tFig, d))).toFixed(2)})`);
      paths.forEach((p) => {
        const o = +p.dataset.o, t0 = tFig + 0.15 + o * 0.11;
        p.style.strokeDashoffset = 1 - E.io3(P(lt, t0, t0 + 0.75));
      });
      tbl.style.opacity = E.out3(P(lt, tFig + 0.5, tFig + 1.1));
      const kg = E.out3(P(lt, tA - 0.15, tA + 0.6));
      cone.style.opacity = 0.25 * P(lt, tFig + 0.3, tFig + 1) + 0.75 * kg;
      glow.style.opacity = kg * (0.85 + 0.15 * Math.sin(lt * 3));
      const kc = E.out3(P(lt, tA + 0.05, tA + 0.75));
      cap.style.opacity = kc; cap.style.transform = `translateY(${(1 - kc) * 12}px)`;
    });
  });

  // =====================================================================
  // S2 · kredensial: segel foil emas CIPP/E · CIPM · FIP + "berpengalaman lintas industri"
  // =====================================================================
  // lebar glyph Inter SemiBold (diukur di Chromium renderer, per em)
  const GW = { B: 0.659, E: 0.605, R: 0.652, S: 0.65, T: 0.66, I: 0.277, F: 0.588, K: 0.703, A: 0.728, N: 0.759, O: 0.769, L: 0.565 };
  function arcText(str, r, fs, ls, top) {
    const ch = [...str], gw = ch.map((c) => (GW[c] ?? 0.62) * fs);
    const total = gw.reduce((a, b) => a + b, 0) + ls * (ch.length - 1);
    let acc = -total / 2;
    return ch.map((c, i) => {
      const th = (acc + gw[i] / 2) / r;
      acc += gw[i] + ls;
      const a = top ? -Math.PI / 2 + th : Math.PI / 2 - th, rot = (a * 180 / Math.PI) + (top ? 90 : -90);
      return `<text transform="translate(${(150 + r * Math.cos(a)).toFixed(2)} ${(150 + r * Math.sin(a)).toFixed(2)}) rotate(${rot.toFixed(2)})">${c}</text>`;
    }).join('');
  }
  function sealSVG(label, uid, fs) {
    let d = '';
    const N = 60;
    for (let i = 0; i < N * 2; i++) {
      const a = (i / (N * 2)) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 139.5 : 147;
      d += (i ? 'L' : 'M') + (150 + Math.cos(a) * r).toFixed(2) + ',' + (150 + Math.sin(a) * r).toFixed(2);
    }
    d += 'Z';
    return `<svg viewBox="0 0 300 300"><defs>
      <linearGradient id="f${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9D29E"/><stop offset=".26" stop-color="#B08A4F"/><stop offset=".5" stop-color="#F3E3B7"/><stop offset=".74" stop-color="#A27B41"/><stop offset="1" stop-color="#D9BB82"/></linearGradient>
      <radialGradient id="i${uid}" cx=".36" cy=".3" r=".85"><stop offset="0" stop-color="#F8ECCF"/><stop offset=".55" stop-color="#DABC86"/><stop offset="1" stop-color="#B38F57"/></radialGradient>
      <linearGradient id="s${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF7E2" stop-opacity="0"/><stop offset=".5" stop-color="#FFFBEF" stop-opacity=".95"/><stop offset="1" stop-color="#FFF7E2" stop-opacity="0"/></linearGradient>
      <clipPath id="c${uid}"><path d="${d}"/></clipPath></defs>
      <path d="${d}" fill="url(#f${uid})"/>
      <circle cx="150" cy="150" r="129" fill="none" stroke="#8C6A38" stroke-width="1.2" opacity=".7"/>
      <circle cx="150" cy="150" r="124" fill="url(#i${uid})"/>
      <circle cx="150" cy="151.2" r="123" fill="none" stroke="#FFF6DC" stroke-width="1" opacity=".7"/>
      <circle cx="150" cy="150" r="84" fill="none" stroke="#7B5B2B" stroke-width="1.1" opacity=".55"/>
      <circle cx="150" cy="150" r="79" fill="none" stroke="#7B5B2B" stroke-width=".6" opacity=".4"/>
      <g font-family="Inter" font-weight="600" font-size="14" fill="#684A1D" text-anchor="middle">${arcText('BERSERTIFIKASI', 97, 14, 2.6, true)}${arcText('INTERNASIONAL', 107.5, 14, 2.6, false)}</g>
      <circle cx="47" cy="150" r="2.6" fill="#684A1D" opacity=".75"/><circle cx="253" cy="150" r="2.6" fill="#684A1D" opacity=".75"/>
      <path d="M150 99l4.5 6.5-4.5 6.5-4.5-6.5z" fill="#684A1D" opacity=".7"/>
      <text x="150" y="${(150 + fs * 0.35).toFixed(1)}" text-anchor="middle" font-family="Playfair Display" font-weight="600" font-size="${fs}" fill="#16213A" letter-spacing="-.4">${label}</text>
      <path d="M126 ${(166 + fs * 0.35).toFixed(1)}H174" stroke="#684A1D" stroke-width="1" opacity=".55"/>
      <g clip-path="url(#c${uid})"><rect class="sh" x="-100" y="-80" width="96" height="460" fill="url(#s${uid})"/></g></svg>`;
  }

  KIT.registerType('ed-seal', (root, v, sc, tm, T) => {
    const ch = chrome(root, 2, { id: sc.id });
    const kick = kicker(root, 'Profil · Tim konsultan', 's2k');
    const main = V ? ['tim konsultan', 'pelindungan', 'data pribadi.'] : ['tim konsultan pelindungan', 'data pribadi.'];
    const hd = h(`<div class="ed-h s2-h"><span class="pre"><em>Privasimu</em> adalah</span>${main.map((l) => `<span class="ln">${l}</span>`).join('')}</div>`);
    root.appendChild(hd);
    const hw = maskWords(hd);
    const ht = ['w:Privasimu', 'w:adalah', 'w:tim', 'w:konsultan', 'w:pelindungan', 'w:data', 'w:pribadi'].map((s, i) => T(s, 0.5 + i * 0.3) - 0.1);
    const xp = h(`<div class="s2-xp"><div class="xt"><span class="ln"><em>Berpengalaman</em></span><span class="ln">lintas industri</span></div>
      <div class="tk"><i></i><i class="g"></i>${Array.from({ length: 13 }, (_, i) => `<b style="left:${(i / 12 * 100).toFixed(2)}%"></b>`).join('')}<u></u></div></div>`);
    root.appendChild(xp);
    const xw = maskWords($('.xt', xp));
    const xt = [T('w:berpengalaman', 3.4) - 0.1, T('w:lintas', 3.9) - 0.1, T('w:industri', 4.1) - 0.1];
    const tk = $('.tk', xp), tkBase = tk.children[0], tkGold = tk.children[1], ticks = [...tk.querySelectorAll('b')], dot = $('u', tk);
    const slbl = kicker(root, 'Bersertifikasi internasional', 's2-sl');
    const tB = T('w:bersertifikasi', 5.2);
    const LBL = [['CIPP/E', 44], ['CIPM', 52], ['FIP', 58]];
    const pos = pick([[900, 648], [1195, 648], [1490, 648]], [[80, 990], [395, 990], [710, 990]]);
    const seals = LBL.map(([lb, fs], i) => {
      const el = h(`<div class="s2-seal"><div class="ph"></div><div class="sw">${sealSVG(lb, `${sc.id}${i}`, fs)}</div></div>`);
      el.style.left = pos[i][0] + 'px'; el.style.top = pos[i][1] + 'px';
      root.appendChild(el);
      const sw = $('.sw', el);
      sw.style.position = 'absolute'; sw.style.inset = '0';
      sw.firstChild.style.filter = 'drop-shadow(0 16px 18px rgba(64,44,16,.26)) drop-shadow(0 3px 4px rgba(64,44,16,.18))';
      return { el, sw, ph: $('.ph', el), sh: $('.sh', el) };
    });
    const st = ['w:CIPP', 'w:CIPM', 'w:FIP'].map((s, i) => T(s, 6.5 + i) - 0.08);
    return reg(sc, (lt, d) => {
      ch(lt, d);
      kick(0.25, lt);
      revealMask(hw, ht, lt, { dur: 0.85 });
      revealMask(xw, xt, lt, { dur: 0.8 });
      const t1 = xt[0];
      tkBase.style.transform = `scaleX(${E.io3(P(lt, t1, t1 + 0.7))})`;
      const kg = E.io3(P(lt, xt[1], T('w:industri', 4.1) + 0.75));
      tkGold.style.transform = `scaleX(${kg})`;
      dot.style.left = (kg * 100).toFixed(2) + '%';
      dot.style.opacity = P(lt, xt[1] - 0.1, xt[1] + 0.1) * (1 - 0.6 * P(lt, xt[2] + 0.9, xt[2] + 1.4));
      ticks.forEach((b, i) => { const on = kg >= i / 12 - 0.001 && kg > 0; b.style.background = on ? '#B08D57' : ''; b.style.transform = `scaleY(${on ? 1.35 : P(lt, t1 + i * 0.03, t1 + 0.3 + i * 0.03)})`; });
      slbl(tB - 0.25, lt);
      seals.forEach((s, i) => {
        const kp = E.out3(P(lt, tB + i * 0.12, tB + 0.6 + i * 0.12));
        const t0 = st[i], k = P(lt, t0, t0 + 0.7), ke = E.outExpo(k);
        s.ph.style.opacity = kp * (1 - P(lt, t0, t0 + 0.2));
        s.ph.style.transform = `scale(${lerp(0.85, 1, kp)}) rotate(${lt * 6}deg)`;
        const fl = lt > t0 + 0.7 ? Math.sin((lt - t0) * 1.3 + i * 1.9) * 4 : 0;
        tf(s.sw, { s: k > 0 ? lerp(1.28, 1, ke) : 0.001, r: lerp(-16, 0, ke) + (lt > t0 + 0.7 ? Math.sin((lt - t0) * 0.9 + i) * 0.8 : 0), y: fl, o: cl(k * 4) });
        const ks = P(lt, t0 + 0.28, t0 + 1.25), ks2 = P(lt, st[2] + 1.1 + i * 0.12, st[2] + 2.0 + i * 0.12);
        const x = ks2 > 0 ? lerp(-110, 420, E.io3(ks2)) : lerp(-110, 420, E.io3(ks));
        s.sh.setAttribute('transform', `rotate(22 150 150) translate(${x.toFixed(1)} 0)`);
      });
    });
  });

  // =====================================================================
  // S3 · kontribusi penyusunan SKKNI & RPP PDP (kartu dokumen)
  // =====================================================================
  KIT.registerType('ed-docs', (root, v, sc, tm, T) => {
    const ch = chrome(root, 3, { id: sc.id });
    const kick = kicker(root, 'Kontribusi', 's3k');
    const lines = V ? ['Kami turut', 'berkontribusi', 'dalam <em>penyusunan.</em>'] : ['Kami turut', 'berkontribusi dalam', '<em>penyusunan.</em>'];
    const hd = h(`<div class="ed-h s3-h">${lines.map((l) => `<span class="ln">${l}</span>`).join('')}</div>`);
    root.appendChild(hd);
    const hw = maskWords(hd);
    const ht = ['w:Kami', 'w:turut', 'w:berkontribusi', 'w:dalam', 'w:penyusunan'].map((s, i) => T(s, 0.6 + i * 0.3) - 0.1);
    const note = h('<div class="s3-note">Dari standar kompetensi hingga rancangan regulasi.</div>');
    root.appendChild(note);
    const DOCS = [
      { k: 'Dokumen · Standar', t: 'SKKNI', s: 'Standar Kompetensi Kerja Nasional Indonesia', w: 'w:SKKNI', pos: pick([944, 190, -4.5], [60, 640, -4]) },
      { k: 'Dokumen · Regulasi', t: 'RPP PDP', s: 'Rancangan Peraturan Pemerintah — Pelindungan Data Pribadi', w: 'w:RPP', pos: pick([1350, 292, 3.5], [556, 770, 3.5]) },
    ];
    const docs = DOCS.map((D, i) => {
      const el = h(`<div class="s3-doc"><div class="rib"></div><div class="dk">${D.k}</div><div class="dt">${D.t}<i></i></div><div class="ds">${D.s}</div>
        <div class="dl">${[96, 88, 92, 74, 90, 62].map((w) => `<i style="width:${w}%"></i>`).join('')}</div><div class="df"><span>Kontribusi penyusunan</span><b><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></b></div></div>`);
      el.style.left = D.pos[0] + 'px'; el.style.top = D.pos[1] + 'px';
      root.appendChild(el);
      return { el, D, u: $('.dt i', el), rib: $('.rib', el), ok: $('.df b', el), tIn: 0.4 + i * 0.32, tHi: T(D.w, 2.3 + i * 0.5) - 0.12 };
    });
    return reg(sc, (lt, d) => {
      ch(lt, d);
      kick(0.55, lt);
      revealMask(hw, ht, lt, { dur: 0.85 });
      const kn = E.out3(P(lt, T('w:penyusunan', 1.9) + 0.25, T('w:penyusunan', 1.9) + 1.0));
      note.style.opacity = kn; note.style.transform = `translateY(${(1 - kn) * 12}px)`;
      docs.forEach((o, i) => {
        const k = E.out3(P(lt, o.tIn, o.tIn + 1.0));
        const nextHi = docs[i + 1] ? docs[i + 1].tHi : 99;
        const up = E.io3(P(lt, o.tHi, o.tHi + 0.45)) * (1 - E.io3(P(lt, nextHi, nextHi + 0.5)) * 0.65);
        const fl = Math.sin(lt * 0.9 + i * 2.1) * 3;
        tf(o.el, { x: (1 - k) * 60, y: (1 - k) * 170 + fl - up * 16, r: o.D.pos[2] - (1 - k) * 7 + up * (i ? -1.2 : 1.2), s: 1 + up * 0.035, o: cl(k * 1.6) });
        o.el.style.boxShadow = `0 1px 0 rgba(255,255,255,.7) inset, inset 0 0 0 1px rgba(15,27,51,.06), 0 ${34 + up * 26}px ${60 + up * 30}px -26px rgba(64,44,16,${(0.34 + up * 0.12).toFixed(3)}), 0 10px 22px -10px rgba(64,44,16,.22)`;
        o.u.style.transform = `scaleX(${E.io3(P(lt, o.tHi, o.tHi + 0.6))})`;
        o.rib.style.transform = `scaleY(${E.out3(P(lt, o.tIn + 0.5, o.tIn + 1.1))}) rotate(${Math.sin(lt * 1.6 + i) * 1.5}deg)`;
        const kok = E.outBack(P(lt, o.tHi + 0.25, o.tHi + 0.65));
        o.ok.style.transform = `scale(${Math.max(0, kok)})`;
      });
    });
  });

  // =====================================================================
  // S4 · daftar bernomor editorial ("daftar isi" majalah) + garis emas memanjang + halaman kecil (screenshot asli)
  // =====================================================================
  const APP = '../assets/app/';
  // crop: [x, y, w, h] dalam piksel asli screenshot (rasio 16:10); ditampilkan <= 0,6x ukuran asli
  const S4ROWS = [
    { t: 'Gap assessment', s: 'Mengukur posisi kepatuhan terhadap UU PDP', w: 'w:gap', img: 'gap-hasil', crop: [322, 52, 656, 410] },
    { t: 'Roadmap', s: 'Rekomendasi & prioritas perbaikan per pasal', w: 'w:roadmap', img: 'gap-rekomendasi', crop: [326, 494, 648, 405] },
    { t: 'Telaah kebijakan', s: 'Kebijakan internal ditelaah terhadap UU PDP & PP 33/2026', w: 'w:telaah', img: 'policy-review', crop: [282, 62, 718, 449] },
    { t: 'Pelatihan tim', s: 'Membekali tim menjalankan kewajiban PDP', w: 'w:pelatihan', img: 'dpo-academy', crop: [274, 62, 870, 544] },
  ];
  KIT.registerType('ed-list', (root, v, sc, tm, T) => {
    const ch = chrome(root, 4, { id: sc.id });
    const kick = kicker(root, 'Layanan pendampingan', 's4k');
    const deck = h(`<div class="s4-deck">${V ? '<span class="ln">Empat layanan,</span><span class="ln">satu pendamping.</span>' : '<span class="ln">Empat layanan, satu pendamping.</span>'}</div>`);
    root.appendChild(deck);
    const dw = maskWords(deck);
    const fin = h(`<div class="ed-h s4-fin">${V ? '<span class="ln">Dari awal</span><span class="ln">hingga <em>akhir.</em></span>' : '<span class="ln">Dari awal hingga <em>akhir.</em></span>'}</div>`);
    root.appendChild(fin);
    const fw = maskWords(fin);
    const tl = h('<div class="s4-tl"><i class="b"></i><i class="g"></i><u></u></div>');
    root.appendChild(tl);
    const tlB = tl.children[0], tlG = tl.children[1], pulse = $('u', tl);
    const PW = V ? 280 : 380, PH = PW * 10 / 16;
    const cols = S4ROWS.map((r, i) => {
      const el = h(`<div class="s4-col"><i class="dt"></i><div class="no">0${i + 1}</div><div class="pl"><img src="${APP}${r.img}.png" alt=""><div class="gl"></div></div><div class="tt">${r.t}</div><div class="ds">${r.s}</div>${V ? '<i class="sep"></i>' : ''}</div>`);
      root.appendChild(el);
      if (V) { el.style.top = 540 + i * 196 + 'px'; } else { el.style.left = 160 + i * 406 + 'px'; }
      const pl = $('.pl', el), img = $('img', el);
      pl.style.width = PW + 'px'; pl.style.height = PH + 'px';
      return { el, pl, img, gl: $('.gl', el), dt: $('.dt', el), no: $('.no', el), ds: $('.ds', el), sep: $('.sep', el), tw: maskWords($('.tt', el)), r, t: T(r.w, 0.8 + i * 1.05) - 0.12 };
    });
    const tK = T('w:kami', 5.1), ft = ['w:dari#2', 'w:awal', 'w:hingga', 'w:akhir'].map((s, i) => T(s, 5.6 + i * 0.25) - 0.1);
    // panjang garis emas: sampai kolom/baris yang sudah disebut
    const seg = (i) => (V ? (i + 1) / 4 : Math.min(1, ((i + 1) * 406 - 26) / 1600));
    return reg(sc, (lt, d) => {
      ch(lt, d);
      kick(0.2, lt);
      revealMask(dw, 0.35, lt, { stagger: 0.07, dur: 0.8, out: tK - 0.35 });
      revealMask(fw, ft, lt, { dur: 0.9 });
      tlB.style.transform = `scale${V ? 'Y' : 'X'}(${E.io3(P(lt, 0.3, 1.3))})`;
      let g = 0;
      cols.forEach((c, i) => { g = Math.max(g, seg(i) * E.io3(P(lt, c.t - 0.05, c.t + 0.85))); });
      tlG.style.transform = `scale${V ? 'Y' : 'X'}(${g.toFixed(4)})`;
      const kp = P(lt, ft[0], ft[3] + 0.45);
      pulse.style.opacity = kp > 0 && kp < 1 ? Math.sin(kp * Math.PI) : 0;
      pulse.style[V ? 'top' : 'left'] = (E.io3(kp) * 100).toFixed(2) + '%';
      cols.forEach((c, i) => {
        const on = g >= (V ? i / 4 : (i * 406) / 1600) - 0.001 && lt >= c.t - 0.05;
        const kd = E.outBack(P(lt, c.t - 0.05, c.t + 0.35));
        const lit = P(lt, ft[0] + i * 0.12, ft[0] + 0.3 + i * 0.12);
        c.dt.style.transform = `scale(${on ? Math.max(0, kd) * (1 + 0.35 * Math.sin(lit * Math.PI)) : 0.001})`;
        const kn = E.out3(P(lt, c.t, c.t + 0.55));
        c.no.style.opacity = kn; c.no.style.transform = `translateY(${((1 - kn) * 14).toFixed(2)}px)`;
        // halaman kecil: terbuka dari atas (mask), zoom mengendap, pan sangat pelan
        const kr = E.io3(P(lt, c.t + 0.05, c.t + 0.9));
        c.pl.style.clipPath = `inset(0 0 ${((1 - kr) * 100).toFixed(2)}% 0)`;
        c.pl.style.transform = `translateY(${((1 - kr) * 18 + Math.sin(lt * 0.7 + i * 1.4) * 2).toFixed(2)}px)`;
        c.pl.style.opacity = kr > 0 ? 1 : 0;
        const [cx, cy, cw] = c.r.crop, sc2 = PW / cw, z = lerp(1.1, 1, E.out3(P(lt, c.t + 0.05, c.t + 1.4))) * (1 + 0.025 * P(lt, c.t, d));
        const drift = P(lt, c.t, d) * 14;
        c.img.style.transform = `translate(${(-cx * sc2).toFixed(2)}px, ${(-(cy + drift) * sc2).toFixed(2)}px) scale(${(sc2 * z).toFixed(4)})`;
        const ks = P(lt, c.t + 0.6, c.t + 1.5);
        c.gl.style.opacity = ks > 0 && ks < 1 ? 1 : 0;
        c.gl.style.backgroundPosition = `${lerp(95, 5, E.io3(ks)).toFixed(2)}% 0`;
        revealMask(c.tw, c.t + 0.08, lt, { stagger: 0.07, dur: 0.8 });
        const kt = E.out3(P(lt, c.t + 0.25, c.t + 0.9));
        c.ds.style.opacity = kt; c.ds.style.transform = `translateY(${((1 - kt) * 12).toFixed(2)}px)`;
        if (c.sep) c.sep.style.transform = `scaleX(${E.io3(P(lt, c.t + 0.2, c.t + 1))})`;
      });
    });
  });

  // =====================================================================
  // S5 · laporan kertas berubah menjadi layar Privasimu Nexus (screenshot asli)
  // =====================================================================
  KIT.registerType('ed-morph', (root, v, sc, tm, T) => {
    const ch = chrome(root, 5, { id: sc.id });
    const kick = kicker(root, 'Hasil pendampingan', 's5k');
    const lines = V ? ['Langsung dijalankan', 'di <em>Privasimu Nexus.</em>'] : ['Langsung', 'dijalankan di', '<em>Privasimu Nexus.</em>'];
    const hd = h(`<div class="ed-h s5-h">${lines.map((l) => `<span class="ln">${l}</span>`).join('')}</div>`);
    root.appendChild(hd);
    const hw = maskWords(hd);
    const ht = ['w:langsung', 'w:dijalankan', 'w:di#2', 'w:Privasimu', 'w:Nexus'].map((s, i) => T(s, 1 + i * 0.4) - 0.1);
    const h2 = h(`<div class="s5-h2"><div class="rl"></div><div class="ed-h">${V ? 'Bukan berhenti di <em>laporan.</em>' : '<span class="ln">Bukan berhenti</span><span class="ln">di <em>laporan.</em></span>'}</div></div>`);
    root.appendChild(h2);
    const h2w = maskWords($('.ed-h', h2)), h2t = ['w:bukan', 'w:berhenti', 'w:di#3', 'w:laporan'].map((s, i) => T(s, 3.4 + i * 0.3) - 0.1);
    // geometri: kertas (potret) -> monitor (16:10)
    const PR = pick({ x: 1055, y: 204, w: 470, h: 620 }, { x: 330, y: 548, w: 420, h: 560 });
    const BZ = 14, CHIN = 40;
    const SCR = pick({ x: 800, y: 172, w: 976, h: 610 }, { x: 70, y: 540, w: 940, h: 588 });
    const MR = { x: SCR.x - BZ, y: SCR.y - BZ, w: SCR.w + 2 * BZ, h: SCR.h + BZ + CHIN };
    const box = h(`<div class="s5-box"><div class="scr"><div class="cam"><img src="${SHOT}" alt=""><div class="hl"></div></div><div class="glass"></div></div><div class="pp"><div class="pk">Laporan pendampingan</div><div class="pt">Kepatuhan<br>PDP 2026</div>
      <div class="ps">Gap assessment · Roadmap · Telaah kebijakan</div><div class="pl">${[94, 86, 90, 70].map((w) => `<i style="width:${w}%"></i>`).join('')}</div>
      <div class="pc">${[38, 62, 86, 54, 72].map((v2) => `<b style="height:${v2}%"></b>`).join('')}</div><div class="pf">Rekomendasi &amp; rencana tindak lanjut</div></div>
      
      <div class="chin"><img src="${LOGO}" alt=""></div></div>`);
    root.appendChild(box);
    const pp = $('.pp', box), scr = $('.scr', box), cam = $('.cam', box), shot = $('.cam > img', box), glass = $('.glass', box), hl = $('.hl', box), chin = $('.chin', box);
    $('.chin img', box).style.width = pick(92, 96) + 'px';
    pp.style.width = PR.w + 'px'; pp.style.height = PR.h + 'px';
    const stand = h('<div class="s5-stand"><i class="nk"></i><i class="bs"></i></div>');
    root.insertBefore(stand, box);
    stand.style.left = (MR.x + MR.w / 2 - 200) + 'px'; stand.style.width = '400px';
    stand.style.top = (MR.y + MR.h - 4) + 'px'; stand.style.height = pick(84, 56) + 'px';
    // kotak sorotan tipis di area layar (pecahan lebar/tinggi screenshot)
    // kartu "81% GAP Score" pada dashboard.png (1264x790): x 283-596, y 459-573
    const HL = { x: 0.224, y: 0.581, w: 0.248, h: 0.144 };
    const tM = T('w:dijalankan', 1.3) - 0.2, tN = T('w:Nexus', 2.7);
    const mix = (a, b, k) => a.map((x, i) => Math.round(lerp(x, b[i], k)));
    return reg(sc, (lt, d) => {
      ch(lt, d);
      kick(0.3, lt);
      revealMask(hw, ht, lt, { dur: 0.85 });
      h2.querySelector('.rl').style.transform = `scaleX(${E.io3(P(lt, h2t[0] - 0.2, h2t[0] + 0.5))})`;
      revealMask(h2w, h2t, lt, { dur: 0.85 });
      // masuk: kertas terangkat pelan
      const ki = E.out3(P(lt, 0.25, 1.2));
      const e = ios(P(lt, tM, tM + 1.35));
      const R = { x: lerp(PR.x, MR.x, e), y: lerp(PR.y, MR.y, e), w: lerp(PR.w, MR.w, e), h: lerp(PR.h, MR.h, e) };
      const fl = Math.sin(lt * 0.9) * 3 * (1 - e);
      box.style.left = R.x + 'px'; box.style.top = R.y + 'px'; box.style.width = R.w + 'px'; box.style.height = R.h + 'px';
      box.style.transform = `translateY(${((1 - ki) * 120 + fl).toFixed(2)}px) rotate(${((1 - e) * (-2.5 + (1 - ki) * -4)).toFixed(3)}deg)`;
      box.style.opacity = cl(ki * 1.5);
      box.style.borderRadius = lerp(3, 18, e) + 'px';
      const c = mix([251, 248, 242], [18, 25, 42], P(e, 0.08, 0.55));
      box.style.background = `linear-gradient(180deg, rgb(${mix(c, [34, 44, 66], P(e, 0.5, 1))}) 0%, rgb(${c}) 100%)`;
      box.style.boxShadow = `0 1px 0 rgba(255,255,255,${0.7 * (1 - e)}) inset, 0 0 0 1px rgba(15,27,51,${0.06 + 0.3 * e}), 0 ${lerp(34, 46, e)}px ${lerp(60, 90, e)}px -${lerp(26, 30, e)}px rgba(40,28,10,${lerp(0.34, 0.5, e)}), 0 10px 22px -10px rgba(64,44,16,.22)`;
      // isi kertas memudar, layar menyala
      const kp = P(e, 0, 0.45);
      pp.style.opacity = 1 - kp; pp.style.transform = `scale(${lerp(1, 0.92, kp)})`;
      const e2 = E.out3(P(e, 0.3, 1));
      scr.style.left = BZ * e2 + 'px'; scr.style.top = BZ * e2 + 'px';
      scr.style.width = (R.w - 2 * BZ * e2) + 'px'; scr.style.height = (R.h - (BZ + CHIN) * e2) + 'px';
      scr.style.borderRadius = lerp(3, 6, e) + 'px';
      cam.style.opacity = E.io3(P(e, 0.3, 0.85));
      const on = P(e, 0.45, 1);
      cam.style.filter = on < 1 ? `brightness(${lerp(1.3, 1, on).toFixed(3)}) saturate(${lerp(0.5, 1, on).toFixed(3)})` : 'none';
      chin.style.height = CHIN + 'px'; chin.style.opacity = P(e, 0.7, 1);
      // pan/zoom halus setelah menyala
      const kz = E.io3(P(lt, tM + 1.2, d));
      cam.style.transformOrigin = `${((HL.x + HL.w / 2) * 100).toFixed(1)}% ${((HL.y + HL.h / 2) * 100).toFixed(1)}%`;
      cam.style.transform = `scale(${lerp(1, 1.12, kz).toFixed(4)})`;
      // kilau emas di kaca & kotak sorotan tipis
      const kg = P(lt, tN - 0.35, tN + 0.8);
      glass.style.opacity = kg > 0 && kg < 1 ? 1 : 0;
      glass.style.backgroundPosition = `${lerp(92, 8, E.io3(kg)).toFixed(2)}% 0`;
      const kh = E.out3(P(lt, tN + 0.05, tN + 0.6));
      const W2 = R.w - 2 * BZ * e2, H2 = R.h - (BZ + CHIN) * e2;
      hl.style.left = (HL.x * W2) + 'px'; hl.style.top = (HL.y * H2) + 'px'; hl.style.width = (HL.w * W2) + 'px'; hl.style.height = (HL.h * H2) + 'px';
      hl.style.opacity = kh; hl.style.transform = `scale(${lerp(1.08, 1, kh).toFixed(4)})`;
      const ks = E.out3(P(e, 0.75, 1));
      stand.style.opacity = ks; stand.style.transform = `translateY(${((1 - ks) * -30).toFixed(2)}px)`;
      stand.style.clipPath = `inset(0 0 ${((1 - ks) * 100).toFixed(2)}% 0)`;
    });
  });

  // =====================================================================
  // S6 · CTA editorial
  // =====================================================================
  KIT.registerType('ed-cta', (root, v, sc, tm, T) => {
    const ch = chrome(root, 6, { id: sc.id });
    const LW = pick(640, 800), LH = Math.round(LW * 180 / 1252);
    const lg = logoCanvas(LW);
    lg.className = 's6-logo';
    lg.style.left = (SW - LW) / 2 + 'px'; lg.style.top = pick(236, 372) + 'px';
    root.appendChild(lg);
    const orn = h('<div class="s6-orn"><i></i><b></b><i></i></div>');
    orn.style.top = pick(236 + LH + 44, 372 + LH + 50) + 'px';
    root.appendChild(orn);
    const tag = h(`<div class="ed-h s6-tag">${V ? '<span class="ln">Konsultan PDP</span><span class="ln"><em>Anda.</em></span>' : '<span class="ln">Konsultan PDP <em>Anda.</em></span>'}</div>`);
    tag.style.top = pick(236 + LH + 84, 372 + LH + 96) + 'px';
    root.appendChild(tag);
    const tw = maskWords(tag), tt = ['w:Konsultan', 'w:PDP', 'w:Anda'].map((s, i) => T(s, 2.3 + i * 0.4) - 0.1);
    const btn = h('<div class="s6-btn">Konsultasi gratis<span class="sep">·</span>privasimu.com<div class="shine"></div></div>');
    btn.style.top = pick(640, 1000) + 'px';
    root.appendChild(btn);
    const col = h(`<div class="s6-col">${V ? '<b>privasimu.com</b><br>support@privasimu.com · 0851 8318 2722' : '<b>privasimu.com</b> · support@privasimu.com · 0851 8318 2722'}</div>`);
    col.style.top = pick(800, 1160) + 'px';
    root.appendChild(col);
    const fade = h('<div class="s6-fade"></div>');
    root.appendChild(fade);
    const tL = T('w:Privasimu', 0.64) - 0.2, tB = T('w:Jadwalkan', 4.45) - 0.1;
    return reg(sc, (lt, d) => {
      const kc = E.io3(P(lt, 1.15, 1.8));
      ch(lt, d, kc);
      const kl = E.io3(P(lt, tL, tL + 1.0));
      const sweep = P(lt, tL + 0.9, tL + 2.2), sweep2 = P(lt, tB + 1.6, tB + 2.8);
      paintLogo(lg, NAVY, sweep > 0 && sweep < 1 ? E.io3(sweep) : sweep2 > 0 && sweep2 < 1 ? E.io3(sweep2) : null);
      lg.style.clipPath = `inset(-10% ${((1 - kl) * 100).toFixed(2)}% -10% 0)`;
      lg.style.transform = `translateY(${((1 - E.out3(P(lt, tL, tL + 1.1))) * 18 + Math.sin(lt * 0.8) * 2).toFixed(2)}px)`;
      const ko = E.io3(P(lt, tL + 0.5, tL + 1.3));
      orn.children[0].style.transform = `scaleX(${ko})`; orn.children[2].style.transform = `scaleX(${ko})`;
      orn.children[1].style.transform = `rotate(45deg) scale(${E.outBack(P(lt, tL + 0.8, tL + 1.2)).toFixed(3)})`;
      revealMask(tw, tt, lt, { dur: 0.9 });
      const kb = E.out3(P(lt, tB, tB + 0.8));
      btn.style.opacity = cl(kb * 1.4);
      btn.style.transform = `translateY(${((1 - kb) * 26).toFixed(2)}px) scale(${lerp(0.94, 1, kb).toFixed(4)})`;
      btn.style.clipPath = `inset(0 ${((1 - E.io3(P(lt, tB, tB + 0.7))) * 50).toFixed(2)}% 0 ${((1 - E.io3(P(lt, tB, tB + 0.7))) * 50).toFixed(2)}% round 999px)`;
      const cyc = (lt - tB - 0.7) / 2.4, ph = cyc - Math.floor(cyc);
      $('.shine', btn).style.left = (cyc > 0 ? lerp(-180, btn.offsetWidth + 60, E.io3(P(ph, 0, 0.45))) : -300) + 'px';
      const kk = E.out3(P(lt, tB + 0.55, tB + 1.2));
      col.style.opacity = kk; col.style.transform = `translateY(${((1 - kk) * 12).toFixed(2)}px)`;
      fade.style.opacity = E.in3(P(lt, d - 0.75, d - 0.05));
    });
  });
})();
