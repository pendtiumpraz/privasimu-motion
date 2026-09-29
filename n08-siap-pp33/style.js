// N08 · Siap PP 33 — gaya "poster Swiss / kinetic typography brutalis".
// Palet: kertas #F2F0EB · tinta #0E0E0E · oranye internasional #FF4F00. Font: Archivo Black, Inter Tight, Inter.
// Grid 12 kolom (16:9) / 6 kolom (9:16) tampil di latar; kamera (zoom punch sinkron ketukan) berlaku untuk konten + grid.
// Tampilan aplikasi = screenshot ASLI (assets/app) dalam bingkai Swiss, crop/zoom via CSS (≤ 1,4× ukuran asli).
// Semua gerak dihitung dari waktu lokal `lt` (deterministik).
(function () {
  const { V, SW, SH, h, esc, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const B = PRV.CONFIG.beat, CUT = PRV.CUT || {}, VIEWS = PRV.VIEWS || {};
  const C = { paper: '#F2F0EB', ink: '#0E0E0E', org: '#FF4F00' };
  const BGC = { paper: C.paper, ink: C.ink, orange: C.org };
  const THEME = {}, ORDER = PRV.SCENES.map((s) => { THEME[s.id] = s.theme; return s.id; });
  const LAST = ORDER[ORDER.length - 1];
  const X0 = pick(80, 60), CW = SW - 2 * X0, X1 = X0 + CW;
  const LOGO = '../assets/privasimu_logo.png';
  const BW = 5, MAXS = 1.4; // tebal bingkai screenshot, skala tampil maksimum
  const oX = E.outExpo, o3 = E.out3, io = E.io3, oB = E.outBack;
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="square"><path d="M5 12.5l4.2 4.2L19 7"/></svg>';
  const ARROW = '<svg class="arw" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="square"><path d="M7 24h31M25 11l13 13-13 13"/></svg>';

  // ---------- util ----------
  const add = (p, html) => { const e = h(html); p.appendChild(e); return e; };
  const at = (el, x, y, w) => { el.style.left = x + 'px'; el.style.top = y + 'px'; if (w != null) el.style.width = w + 'px'; return el; };
  const fit = (el, w, max = 3000) => {
    if (el._fit || !el.offsetWidth) return;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = Math.min(max, fs * w / el.scrollWidth).toFixed(2) + 'px';
    el._fit = 1;
  };
  const bot = (el) => el.offsetTop + el.offsetHeight;
  const $$ = (r, s) => [...r.querySelectorAll(s)];
  const bp = (lt) => Math.exp(-((((lt % B) + B) % B) / B) * 4.5); // denyut per ketukan
  const punch = (lt, ts, amp, dec = 6) => ts.reduce((a, t) => { const d = lt - t; return d < 0 ? a : a + amp * (1 - Math.exp(-d * 45)) * Math.exp(-d * dec); }, 0);
  const shk = (lt, ts, amp, dur = .3) => {
    let a = 0; ts.forEach((t) => { if (lt > t && lt < t + dur) a += (1 - (lt - t) / dur) * amp; });
    const f = Math.floor(lt * 30); return [(hash(f * 1.31 + 7) - .5) * 2 * a, (hash(f * 2.17 + 3) - .5) * 2 * a];
  };
  // teks bermasker: naik dari balik garis
  const mkUp = (el, lt, t0, dur = .34) => { const k = P(lt, t0, t0 + dur); el.style.transform = `translateY(${((1 - oX(k)) * 112).toFixed(2)}%)`; el.style.opacity = k > 0 ? 1 : 0; };
  // text slam: skala besar -> 1
  const slam = (el, lt, t0, { from = 1.8, dur = .3, x = 0, y = 0, r = 0 } = {}) => {
    const k = P(lt, t0 - .01, t0 + dur), e = oX(k);
    tf(el, { s: lerp(from, 1, e), x: x * (1 - e), y: y * (1 - e), r: r * (1 - e), o: k > 0 ? 1 : 0 });
  };
  // blok warna geser
  const grow = (el, lt, t0, dur = .32, axis = 'X') => { el.style.transform = `scale${axis}(${oX(P(lt, t0, t0 + dur)).toFixed(4)})`; };

  // wipe antar-komposisi di dalam scene: batang bergerak, A tinggal di depan batang, B muncul di belakangnya
  function phaseWipe(A, Bn, bar, lt, tc, dir = 'x', dur = .4) {
    const k = io(P(lt, tc - dur / 2, tc + dur / 2));
    if (k <= 0 || k >= 1) {
      A.style.visibility = k >= 1 ? 'hidden' : 'visible'; Bn.style.visibility = k >= 1 ? 'visible' : 'hidden';
      A.style.clipPath = Bn.style.clipPath = 'none'; bar.style.display = 'none';
      return;
    }
    A.style.visibility = Bn.style.visibility = 'visible'; bar.style.display = 'block';
    if (dir === 'x') {
      const bw = pick(110, 90), X = lerp(-bw, SW + bw, k), a = X - bw / 2, b = X + bw / 2;
      A.style.clipPath = `inset(0 0 0 ${b.toFixed(1)}px)`; Bn.style.clipPath = `inset(0 ${(SW - a).toFixed(1)}px 0 0)`;
      bar.style.transform = `translateX(${a.toFixed(1)}px)`;
    } else {
      const bw = pick(90, 110), Y = lerp(-bw, SH + bw, k), a = Y - bw / 2, b = Y + bw / 2;
      A.style.clipPath = `inset(${b.toFixed(1)}px 0 0 0)`; Bn.style.clipPath = `inset(0 0 ${(SH - a).toFixed(1)}px 0)`;
      bar.style.transform = `translateY(${a.toFixed(1)}px)`;
    }
  }

  // ---------- bingkai Swiss untuk screenshot ASLI: crop CSS, pan/zoom tegas per ketukan, kotak sorotan oranye ----------
  function shotFrame(parent, spec, { x, y, w, h: hh, inv }) {
    const fr = at(add(parent, `<div class="x shot ${inv ? 'inv' : ''}" style="width:${w}px;height:${hh}px">${spec.tag ? `<div class="sh-tag lb">${esc(spec.tag)}</div>` : ''}<div class="sh-vp">${spec.imgs.map((m) => `<img src="${m.src}" alt="" style="width:${m.w}px;height:${m.h}px">`).join('')}<i class="sh-hl"><b class="lb"></b></i></div></div>`), x, y);
    const vp = fr.querySelector('.sh-vp'), hl = vp.querySelector('.sh-hl');
    return { fr, vp, ims: $$(vp, 'img'), spec, hl, hlLb: hl.querySelector('.lb'), VW: w - 2 * BW, VH: hh - 2 * BW };
  }
  function scaleOf(F, vw) {
    const m = F.spec.imgs[vw.img || 0];
    let s = Array.isArray(vw.s) ? pick(vw.s[0], vw.s[1]) : vw.s;
    if (s === 'fit') s = Math.min(F.VW / m.w, F.VH / m.h);
    if (s === 'cover') s = Math.max(F.VW / m.w, F.VH / m.h);
    return Math.min(MAXS, s || 1);
  }
  function applyView(F, lt, times) {
    const VS = F.spec.views;
    let i = 0; times.forEach((t, j) => { if (lt >= t && VS[j]) i = j; });
    const cur = VS[i], prv = VS[Math.max(0, i - 1)], t0 = times[i], mi = cur.img || 0, m = F.spec.imgs[mi];
    const same = (prv.img || 0) === mi, k = i === 0 || !same ? 1 : io(P(lt, t0, t0 + .3));
    const S = lerp(same ? scaleOf(F, prv) : scaleOf(F, cur), scaleOf(F, cur), k);
    const u = lerp(same ? prv.u : cur.u, cur.u, k), v = lerp(same ? prv.v : cur.v, cur.v, k);
    const dw = m.w * S, dh = m.h * S;
    const tx = dw >= F.VW ? cl(F.VW / 2 - u * dw, F.VW - dw, 0) : (F.VW - dw) / 2;
    const ty = dh >= F.VH ? cl(F.VH / 2 - v * dh, F.VH - dh, 0) : (F.VH - dh) / 2;
    F.ims.forEach((im, j) => (im.style.display = j === mi ? 'block' : 'none'));
    F.ims[mi].style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${S.toFixed(5)})`;
    const on = cur.hl && lt >= t0 + .15;
    F.hl.style.display = on ? 'block' : 'none';
    if (on) {
      const kh = P(lt, t0 + .15, t0 + .33), [hx, hy, hw, hh] = cur.hl;
      const X = tx + hx * dw, Y = ty + hy * dh, W = hw * dw, H = hh * dh;
      Object.assign(F.hl.style, { left: X.toFixed(1) + 'px', top: Y.toFixed(1) + 'px', width: W.toFixed(1) + 'px', height: H.toFixed(1) + 'px' });
      F.hl.style.transform = `scale(${lerp(1.16, 1, oX(kh)).toFixed(4)})`;
      F.hl.style.opacity = kh;
      F.hlLb.textContent = cur.label || '';
      F.hl.className = 'sh-hl ' + (Y >= 46 ? 'up' : Y + H + 46 <= F.VH ? 'dn' : 'in');
    }
    return i;
  }
  const frameIn = (F, lt, t0, dist = 100) => tf(F.fr, { y: (1 - oX(P(lt, t0, t0 + .55))) * dist, o: lt >= t0 ? 1 : 0 });

  // ---------- kamera per scene (konten + grid latar bergerak bersama) ----------
  const CAM = {};
  const camOf = (id, lt) => (CAM[id] ? CAM[id](lt) : { s: 1, x: 0, y: 0 });
  const PULSE = { s4: 1, s5: 1 }; // kolom grid menyala per ketukan di bagian musik "main"

  // ---------- latar: kertas + grid Swiss + tanda registrasi ----------
  const GRID = V
    ? { xs: Array.from({ length: 7 }, (_, i) => 60 + i * 160), ys: Array.from({ length: 9 }, (_, j) => 200 + j * 155) }
    : { xs: Array.from({ length: 13 }, (_, i) => 80 + i * 1760 / 12), ys: Array.from({ length: 7 }, (_, j) => 80 + j * 920 / 6) };
  function drawBg(cx, t, id, theme, W, H, lt) {
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.globalAlpha = 1;
    cx.fillStyle = BGC[theme] || C.paper;
    cx.fillRect(0, 0, W, H);
    const c = camOf(id, lt);
    cx.setTransform(c.s, 0, 0, c.s, W / 2 * (1 - c.s) + c.x, H / 2 * (1 - c.s) + c.y);
    const ink = theme === 'ink', orng = theme === 'orange', rgb = ink ? '242,240,235' : '14,14,14';
    if (PULSE[id]) {
      const bi = Math.floor(lt / B), j = Math.floor(hash(bi * 3.1 + 17) * (GRID.xs.length - 1));
      const a = .085 * Math.exp(-((lt - bi * B) / B) * 3.2);
      cx.fillStyle = orng ? `rgba(14,14,14,${a.toFixed(3)})` : `rgba(255,79,0,${(a * 1.3).toFixed(3)})`;
      cx.fillRect(GRID.xs[j], -80, GRID.xs[j + 1] - GRID.xs[j], H + 160);
    }
    const alpha = (ink ? .14 : orng ? .18 : .11) + .12 * Math.exp(-lt * 3.5);
    cx.lineWidth = 1.5;
    cx.strokeStyle = `rgba(${rgb},${alpha.toFixed(3)})`;
    cx.beginPath();
    GRID.xs.forEach((x, i) => { const k = io(cl((t - .04 - i * .035) / .6)); if (k > 0) { cx.moveTo(x, -80); cx.lineTo(x, -80 + (H + 160) * k); } });
    GRID.ys.forEach((y, j) => { const k = io(cl((t - .12 - j * .04) / .6)); if (k > 0) { cx.moveTo(-80, y); cx.lineTo(-80 + (W + 160) * k, y); } });
    cx.stroke();
    const kr = cl((t - .55) / .3);
    if (kr > 0) {
      cx.strokeStyle = `rgba(${rgb},${(.6 * kr).toFixed(3)})`;
      cx.lineWidth = 2;
      const xs = GRID.xs, ys = GRID.ys, r = 16;
      [[xs[0], ys[0]], [xs[xs.length - 1], ys[0]], [xs[0], ys[ys.length - 1]], [xs[xs.length - 1], ys[ys.length - 1]]].forEach(([x, y]) => {
        cx.beginPath(); cx.moveTo(x - r, y); cx.lineTo(x + r, y); cx.moveTo(x, y - r); cx.lineTo(x, y + r); cx.stroke();
        cx.beginPath(); cx.arc(x, y, r * .55, 0, Math.PI * 2); cx.stroke();
      });
    }
    cx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ---------- transisi antar-scene (overlay di atas konten) ----------
  const TR = {
    s1: { kind: 'strips', dir: 'x', n: pick(6, 8), cols: [C.org, C.ink], win: .3, wout: .36 },
    s2: { kind: 'panel', from: pick('r', 'b'), col: C.ink, edge: C.org, win: .34 },
    s3: { kind: 'split', col: C.org, win: B / 2 + .02, wout: .34 },
    s4: { kind: 'strips', dir: 'y', n: pick(8, 6), cols: [C.ink, C.paper], win: .3, wout: .36 },
    s5: { kind: 'panel', from: pick('l', 't'), col: C.paper, edge: C.ink, win: .34 },
  };
  let hud = null, ov = null;
  const OV = {};
  function ensure() {
    if (hud) return;
    const stage = document.getElementById('stage'), grain = document.getElementById('grain');
    hud = h(`<div id="sw-hud"><div class="tl">Program pendampingan<span> · Siap PP 33/2026</span></div><div class="tr"><b class="no">01</b> / 06</div>${V ? '' : '<div class="bl">privasimu.com</div><div class="br">UU PDP × PP 33/2026</div>'}<div class="pg"><i></i></div></div>`);
    stage.insertBefore(hud, grain);
    ov = h(`<div id="sw-ov">${'<i class="st"></i>'.repeat(8)}<i class="pa"></i><i class="pb"></i><i class="ed"></i></div>`);
    stage.insertBefore(ov, grain);
    Object.assign(OV, { st: $$(ov, '.st'), pa: ov.querySelector('.pa'), pb: ov.querySelector('.pb'), ed: ov.querySelector('.ed'), no: hud.querySelector('.no'), pg: hud.querySelector('.pg i') });
  }
  const box = (el, x, y, w, hh, col) => { Object.assign(el.style, { display: 'block', left: x + 'px', top: y + 'px', width: w + 'px', height: hh + 'px', background: col }); };
  function drawTR(tr, k, phase) {
    ov.style.display = 'block';
    if (tr.kind === 'strips') {
      const n = tr.n, st = .45 / n;
      for (let j = 0; j < n; j++) {
        const s = OV.st[j], kj = cl((k - j * st) / (1 - (n - 1) * st));
        if (tr.dir === 'x') {
          const hh = SH / n; box(s, 0, Math.floor(j * hh), SW, Math.ceil(hh) + 1, tr.cols[j % tr.cols.length]);
          s.style.transform = `translateX(${(phase === 'in' ? (1 - oX(kj)) * SW : -E.in3(kj) * SW).toFixed(1)}px)`;
        } else {
          const ww = SW / n; box(s, Math.floor(j * ww), 0, Math.ceil(ww) + 1, SH, tr.cols[j % tr.cols.length]);
          s.style.transform = `translateY(${(phase === 'in' ? -(1 - oX(kj)) * SH : E.in3(kj) * SH).toFixed(1)}px)`;
        }
      }
    } else if (tr.kind === 'panel') {
      const kk = oX(k), ew = pick(26, 22);
      box(OV.pa, 0, 0, SW, SH, tr.col);
      if (tr.from === 'l' || tr.from === 'r') box(OV.ed, 0, 0, ew, SH, tr.edge); else box(OV.ed, 0, 0, SW, ew, tr.edge);
      if (tr.from === 'r') { const x = (1 - kk) * SW; OV.pa.style.transform = `translateX(${x.toFixed(1)}px)`; OV.ed.style.transform = `translateX(${(x - ew).toFixed(1)}px)`; }
      if (tr.from === 'l') { const x = -(1 - kk) * SW; OV.pa.style.transform = `translateX(${x.toFixed(1)}px)`; OV.ed.style.transform = `translateX(${(x + SW).toFixed(1)}px)`; }
      if (tr.from === 'b') { const y = (1 - kk) * SH; OV.pa.style.transform = `translateY(${y.toFixed(1)}px)`; OV.ed.style.transform = `translateY(${(y - ew).toFixed(1)}px)`; }
      if (tr.from === 't') { const y = -(1 - kk) * SH; OV.pa.style.transform = `translateY(${y.toFixed(1)}px)`; OV.ed.style.transform = `translateY(${(y + SH).toFixed(1)}px)`; }
    } else if (tr.kind === 'split') {
      const kk = phase === 'in' ? 1 - oX(k) : oX(k); // 0 = tertutup
      if (!V) {
        box(OV.pa, 0, 0, SW / 2 + 1, SH, tr.col); box(OV.pb, SW / 2, 0, SW / 2, SH, tr.col);
        OV.pa.style.transform = `translateX(${(-kk * SW / 2).toFixed(1)}px)`; OV.pb.style.transform = `translateX(${(kk * SW / 2).toFixed(1)}px)`;
      } else {
        box(OV.pa, 0, 0, SW, SH / 2 + 1, tr.col); box(OV.pb, 0, SH / 2, SW, SH / 2, tr.col);
        OV.pa.style.transform = `translateY(${(-kk * SH / 2).toFixed(1)}px)`; OV.pb.style.transform = `translateY(${(kk * SH / 2).toFixed(1)}px)`;
      }
    }
  }
  function wipeFrame(id, lt, d) {
    OV.st.forEach((s) => (s.style.display = 'none'));
    OV.pa.style.display = OV.pb.style.display = OV.ed.style.display = 'none';
    ov.style.display = 'none';
    const i = ORDER.indexOf(id), out = TR[id], inn = i > 0 ? TR[ORDER[i - 1]] : null;
    if (out && lt >= d - out.win) drawTR(out, P(lt, d - out.win, d), 'in');
    else if (inn && inn.wout && lt < inn.wout) drawTR(inn, P(lt, 0, inn.wout), 'out');
  }

  KIT.style({
    fonts: ['400 20px "Archivo Black"', '900 20px "Inter Tight"', '800 20px "Inter Tight"', '700 20px "Inter Tight"',
      '400 20px "Inter"', '500 20px "Inter"', '600 20px "Inter"', '700 20px "Inter"', '800 20px "Inter"'],
    themes: {
      paper: [C.paper, C.paper, C.paper, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
      ink: [C.ink, C.ink, C.ink, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
      orange: [C.org, C.org, C.org, 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
    },
    bg: drawBg,
    frame: (id, lt, d, sec) => {
      ensure();
      const c = camOf(id, lt);
      sec.style.transform = `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px) scale(${c.s.toFixed(4)})`;
      const th = THEME[id], i = ORDER.indexOf(id), TL = window.TIMELINE, t = TL.scenes[i].start + lt;
      document.documentElement.dataset.th = th;
      hud.className = 'th-' + th + (id === LAST ? ' end' : '');
      OV.no.textContent = String(i + 1).padStart(2, '0');
      OV.pg.style.transform = `scaleX(${(t / TL.total).toFixed(4)})`;
      hud.style.opacity = io(cl((t - .35) / .5)).toFixed(3);
      wipeFrame(id, lt, d);
    },
  });

  // =====================================================================
  // s1 · 16.01.2027 raksasa, detik berdetak, "semakin dekat" → "dari mana harus mulai?" + tumpukan tugas
  // =====================================================================
  KIT.registerType('swDate', (root, v, sc, tm, T) => {
    const t16 = T('w:Enam', .5), t01 = T('w:Januari', 1.1);
    const tY = ['w:dua', 'w:ribu', 'w:dua#2', 'w:tujuh'].map((s, i) => T(s, 1.6 + i * .3));
    const tNear = T('w:semakin', 3.05), tDekat = T('w:dekat', 3.55);
    const tDari = T('w:Dari', 4.6), tMana = T('w:mana', 4.9), tOrg = T('w:organisasi', 5.25), tHarus = T('w:harus', 6.35), tMulai = T('w:mulai', 6.7);
    const tc = CUT.s1 ? CUT.s1(sc)[0] : tDari - .16;
    const tPov = tNear + .3, tEmo = tDekat + .3, tQ = tMulai + .24;
    const tags = v.tags || [];
    const tTag = tags.map((_, j) => tOrg + .05 + j * B / 2);

    const A = add(root, '<div class="ph"></div>'), Q = add(root, '<div class="ph"></div>');
    // --- A: tanggal raksasa + penggaris detik + blok "SEMAKIN DEKAT"
    const date = at(add(A, `<div class="x s1-date ar"><span class="g"><b class="n">16</b><b class="dot">.</b></span><span class="g"><b class="n">01</b><b class="dot">.</b></span><span class="g">${[...'2027'].map((c) => `<b class="mk"><i>${c}</i></b>`).join('')}</span></div>`), X0, pick(196, 236));
    const ghost = at(add(A, '<div class="x s1-date s1-ghost ar"><span class="g"><b>16</b><b class="dot">.</b></span><span class="g"><b>01</b><b class="dot">.</b></span><span class="g"><b>2027</b></span></div>'), X0, pick(196, 236));
    A.insertBefore(ghost, date);
    const nums = $$(date, '.n'), dots = $$(date, '.dot'), yd = $$(date, '.mk > i');
    const rul = at(add(A, `<div class="x s1-rul">${Array.from({ length: 61 }, (_, j) => `<i class="${j % 15 === 0 ? 'q' : j % 5 === 0 ? 'f' : ''}" style="left:${(j / 60 * 100).toFixed(3)}%"></i>`).join('')}${[0, 15, 30, 45, 60].map((n) => `<span class="rn" style="left:${(n / 60 * 100).toFixed(3)}%">${String(n).padStart(2, '0')}</span>`).join('')}<b class="phd"></b></div>`), X0, 0, CW);
    const ticks = $$(rul, 'i'), rns = $$(rul, '.rn'), phd = rul.querySelector('.phd');
    const near = at(add(A, '<div class="x s1-near"><i class="bk"></i><b class="mk ar"><i>SEMAKIN DEKAT</i></b></div>'), X0, 0);
    const nearBk = near.querySelector('.bk'), nearTx = near.querySelector('.mk > i');
    // jam detik & stiker POV (hidup di kedua komposisi)
    const clk = add(root, '<div class="x s1-clk"><div class="lb">15.01.2027</div><div class="it">23:59:<b>40</b></div></div>');
    const clkS = clk.querySelector('b');
    const pov = add(root, `<div class="x s1-pov"><div class="pt"><b>POV:</b> ${esc(v.pov || 'tinggal hitungan minggu')}</div><div class="pe emo">${v.povEmoji || '😬'}</div></div>`);
    const pe = pov.querySelector('.pe');
    // --- Q: pertanyaan + tumpukan tugas yang belum tersentuh
    const mini = at(add(Q, '<div class="x s1-mini ar">16<i>.</i>01<i>.</i>2027</div>'), X0, pick(92, 202));
    const qline = (html, y) => at(add(Q, `<div class="x s1-q it">${html}</div>`), X0, y);
    const q1 = qline('<b class="mk"><i>DARI</i></b> <b class="mk"><i>MANA</i></b>', pick(250, 352));
    const q2 = at(add(Q, '<div class="x s1-q2 lb">organisasi Anda</div>'), X0 + 6, pick(412, 494));
    const q3 = qline('<b class="mk"><i>HARUS</i></b>', pick(456, 546));
    const q4 = qline('<b class="mk"><i>MULAI</i></b><b class="qm">?</b>', pick(612, 686));
    const qw = [...$$(q1, '.mk > i'), ...$$(q3, '.mk > i'), ...$$(q4, '.mk > i')], qm = q4.querySelector('.qm');
    const qT = [tDari, tMana, tHarus, tMulai];
    const TP = pick([[1160, 250, -3], [1300, 362, 2.5], [1140, 474, -1.5], [1260, 586, 3], [1170, 698, -2.5]],
      [[66, 884, -3], [390, 986, 2.5], [104, 1088, -2], [300, 1190, 3], [80, 1292, -2]]);
    const tg = tags.map((t, j) => at(add(Q, `<div class="x s1-tag"><b class="it">${esc(t)}</b><span class="lb">Belum</span></div>`), TP[j][0], TP[j][1]));
    const wb = add(root, '<div class="x wbar"></div>');
    let L = null;

    CAM[sc.id] = (lt) => {
      let s = 1 + punch(lt, [t16, t01], .05) + punch(lt, tY, .014) + punch(lt, [tY[3]], .02) + punch(lt, [tNear], .025) + punch(lt, [tQ], .045) + .0035 * bp(lt);
      s += .07 * io(P(lt, tNear, tc - .1)) * (1 - io(P(lt, tc - .2, tc + .22)));
      return { s, x: 0, y: 0 };
    };

    return (lt) => {
      if (!L && date.offsetWidth) {
        fit(date, CW);
        ghost.style.fontSize = date.style.fontSize;
        const db = bot(date);
        L = V ? { rul: db + 22, near: db + 104 } : { rul: db + 40, near: db + 138 };
        rul.style.top = L.rul + 'px'; near.style.top = L.near + 'px';
        const nb = L.near + near.offsetHeight;
        // jam: rata bawah dengan garis dasar "16." (9:16) / dengan blok "SEMAKIN DEKAT" (16:9)
        L.cA = V ? { y: date.offsetTop + 20, s: 1 } : { y: nb - clk.offsetHeight, s: 1 };
        L.cB = V ? { y: 206, s: .62 } : { y: 92, s: .62 };
      }
      if (!L) return;
      // --- A
      ghost.style.opacity = (1 - P(lt, tY[3] + .2, tY[3] + .5)).toFixed(3);
      slam(nums[0], lt, t16, { from: 1.9 }); slam(nums[1], lt, t01, { from: 1.9 });
      dots.forEach((el, i) => { const t = (i ? t01 : t16) + .1, k = oB(P(lt, t, t + .26)); tf(el, { s: Math.max(0, k), o: k > 0 ? 1 : 0 }); });
      yd.forEach((el, i) => mkUp(el, lt, tY[i], .28));
      const bi = Math.max(0, Math.floor(lt / B)), fr = lt - bi * B, sec = Math.min(59, 40 + bi);
      const xs = lerp(Math.max(40, sec - (bi ? 1 : 0)), sec, oB(P(fr, 0, .16)));
      phd.style.transform = `translateX(${(xs / 60 * CW).toFixed(1)}px)`;
      phd.style.opacity = P(lt, .25, .4);
      ticks.forEach((tk, j) => { tk.style.transform = `scaleY(${o3(P(lt, .1 + j * .007, .32 + j * .007)).toFixed(3)})`; tk.classList.toggle('on', j <= sec); });
      rns.forEach((r, j) => (r.style.opacity = P(lt, .3 + j * .05, .5 + j * .05)));
      grow(nearBk, lt, tNear - .05, .32); mkUp(nearTx, lt, tNear + .04, .34);
      nearBk.style.opacity = lt >= tNear - .05 ? 1 : 0;
      const kd = lt >= tDekat ? Math.exp(-(lt - tDekat) * 9) : 0;
      near.style.transform = `scale(${(1 + .045 * kd).toFixed(4)})`;
      // --- jam: tiap ketukan = satu detik
      clkS.textContent = String(sec).padStart(2, '0');
      clkS.style.transform = `scaleY(${lerp(.45, 1, o3(P(fr, 0, .1))).toFixed(3)})`;
      const kc = io(P(lt, tc - .2, tc + .22));
      clk.style.transform = `translateY(${lerp(L.cA.y, L.cB.y, kc).toFixed(1)}px) scale(${lerp(L.cA.s, L.cB.s, kc).toFixed(4)})`;
      clk.style.opacity = P(lt, 0, .25);
      // --- POV
      const kp = oB(P(lt, tPov, tPov + .42));
      pov.style.transform = `rotate(${pick(-2.5, 3)}deg) scale(${Math.max(0, kp).toFixed(4)})`;
      pov.style.opacity = kp > 0 ? 1 : 0;
      const ke = P(lt, tEmo, tEmo + .8);
      pe.style.transform = `scale(${Math.max(0, E.outElastic(ke)).toFixed(4)}) rotate(${(Math.sin(lt * 6.5) * 9).toFixed(2)}deg)`;
      pe.style.opacity = ke > 0 ? 1 : 0;
      // --- wipe ke komposisi pertanyaan
      phaseWipe(A, Q, wb, lt, tc);
      tf(mini, { o: 1 });
      qw.forEach((el, i) => mkUp(el, lt, qT[i], .32));
      const k2 = o3(P(lt, tOrg, tOrg + .5));
      q2.style.letterSpacing = lerp(.6, .16, k2).toFixed(3) + 'em'; q2.style.opacity = k2;
      slam(qm, lt, tQ, { from: 2.6, r: -18 });
      tg.forEach((el, j) => {
        const k = P(lt, tTag[j], tTag[j] + .34), e = oX(k);
        tf(el, { y: -(1 - e) * 560, r: TP[j][2] + (1 - e) * (j % 2 ? 16 : -16), o: k > 0 ? 1 : 0 });
      });
    };
  });

  // =====================================================================
  // s2 · bersama konsultan → GAP Assessment (screenshot asli) → peta pasal UU PDP × PP 33 → "pasal demi pasal"
  // =====================================================================
  KIT.registerType('swGap', (root, v, sc, tm, T) => {
    const tBer = T('w:Bersama', .43), tKon = T('w:konsultan', .95), tPri = T('w:Privasimu', 1.48);
    const [tcA, tcB] = CUT.s2 ? CUT.s2(sc) : [2.42, 4.36];
    const [vt] = VIEWS.s2 ? VIEWS.s2(sc) : [[tcA, tcA + 2 * B, tcA + 3 * B]];
    const tGap = T('w:gap', 3.29), tAss = T('w:assessment', 3.52), tPDP = T('w:PDP', 4.65), tPP = T('w:PP', 5.34), tTiga = T('w:tiga#2', 6.17);
    const tP1 = T('w:pasal', 6.91), tDemi = T('w:demi', 7.35), tP2 = T('w:pasal#2', 7.63);
    const A = add(root, '<div class="ph"></div>'), B1 = add(root, '<div class="ph"></div>'), B2 = add(root, '<div class="ph"></div>');
    const wb1 = add(root, '<div class="x wbar ink"></div>'), wb2 = add(root, '<div class="x wbar"></div>');
    // --- A: BERSAMA / KONSULTAN / logo
    const a1 = at(add(A, '<div class="x g-a1 it"><b class="mk"><i>BERSAMA</i></b></div>'), X0, pick(214, 512));
    const a2 = at(add(A, '<div class="x g-a2"><i class="bk"></i><b class="mk ar"><i>KONSULTAN</i></b></div>'), X0, pick(372, 668));
    const a3 = at(add(A, `<div class="x g-a3"><img src="${LOGO}" alt=""><i class="bk"></i></div>`), X0, pick(662, 900));
    const a2mk = a2.querySelector('.mk'), a2bk = a2.querySelector('.bk'), a3img = a3.querySelector('img'), a3bk = a3.querySelector('.bk');
    // --- B1: judul + screenshot GAP Assessment asli dalam bingkai Swiss
    const im = v.shot.imgs[0];
    const fw = pick(1050, CW), fh = Math.round((fw - 2 * BW) * im.h / im.w) + 2 * BW;
    const F = shotFrame(B1, v.shot, { x: pick(790, X0), y: pick(186, 548), w: fw, h: fh });
    const kick = at(add(B1, '<div class="x lb g-kick">Bersama konsultan Privasimu</div>'), X0, pick(300, 204));
    const gap = at(add(B1, '<div class="x g-gap ar"><b class="mk"><i>GAP</i></b></div>'), X0, pick(338, 240));
    const ass = at(add(B1, '<div class="x g-ass ar"><b class="mk"><i>ASSESSMENT</i></b></div>'), X0, 0);
    const lab = at(add(B1, '<div class="x g-lab it"><i class="bk"></i><span>UU PDP × PP 33/2026</span></div>'), X0, 0);
    const labBk = lab.querySelector('.bk'), labTx = lab.querySelector('span');
    // --- B2: peta pasal
    const hd2 = at(add(B2, `<div class="x g-hd2 ar">${V ? '<b class="mk"><i>UU PDP</i></b> <b class="mk org"><i>×</i></b><br><b class="mk"><i>PP 33/2026</i></b>' : '<b class="mk"><i>UU PDP</i></b> <b class="mk org"><i>×</i></b> <b class="mk"><i>PP 33/2026</i></b>'}</div>`), X0, pick(96, 204));
    const hdw = $$(hd2, '.mk > i');
    const G = pick({ p: 46, c: 40, uu: { x: X0, y: 292, cols: 11 }, pp: { x: X0 + 11 * 46 + 70, y: 292, cols: 25 } },
      { p: 44, c: 38, uu: { x: X0, y: 548, cols: 21 }, pp: { x: X0, y: 788, cols: 21 } });
    const grid = (n, g, name, seed, pr) => {
      const wpx = g.cols * G.p - (G.p - G.c);
      const hd = at(add(B2, `<div class="x g-ghd" style="width:${wpx}px"><b class="it">${name}</b><span class="lb">Pasal <span class="c">000</span></span></div>`), g.x, g.y - 46);
      const bx = at(add(B2, `<div class="x g-cells" style="grid-template-columns:repeat(${g.cols}, ${G.c}px);gap:${G.p - G.c}px"></div>`), g.x, g.y);
      const cells = Array.from({ length: n }, (_, i) => {
        const el = document.createElement('i'); bx.appendChild(el);
        const r = hash(i * 1.93 + seed);
        return { el, st: r < pr[0] ? 'b' : r < pr[0] + pr[1] ? 's' : 'o', row: Math.floor(i / g.cols), cls: '-' };
      });
      return { g, hd, bx, cells, cnt: hd.querySelector('.c'), n, rows: Math.ceil(n / g.cols) };
    };
    const UU = grid(76, G.uu, 'UU PDP', 11, [.44, .3]), PPg = grid(225, G.pp, 'PP 33/2026', 29, [.32, .32]);
    const leg = at(add(B2, `<div class="x g-leg lb">${(v.legend || ['Terpenuhi', 'Sebagian', 'Kesenjangan']).map((l, i) => `<span><i class="${['b', 's', 'o'][i]}"></i>${esc(l)}</span>`).join('')}</div>`), X0, pick(736, 1290));
    const foc = add(B2, '<i class="x g-foc"></i>');
    const band = at(add(B2, '<div class="x g-band"><i class="bk"></i><b class="mk ar"><i>PASAL</i></b><b class="mk ar org"><i>DEMI</i></b><b class="mk ar"><i>PASAL</i></b></div>'), X0, pick(836, 1000), CW);
    const bandBk = band.querySelector('.bk'), bandW = $$(band, '.mk > i');
    const scans = [[UU, tcB + .12, tPDP + .42], [PPg, tPP - .1, tTiga + .45]];
    let L = null;

    CAM[sc.id] = (lt) => ({ s: 1 + punch(lt, [tBer], .015) + punch(lt, [tKon], .025) + punch(lt, [tPri], .03) + punch(lt, vt.slice(1), .018) + punch(lt, [tGap], .015) + punch(lt, [tP1, tDemi], .028) + punch(lt, [tP2], .04) + .003 * bp(lt), x: 0, y: 0 });

    return (lt) => {
      if (!L && a1.offsetWidth) {
        if (V) { fit(a1, CW * .8); fit(a2mk, CW - 56); fit(ass, CW); gap.style.fontSize = ass.style.fontSize; fit(hd2, CW); }
        else fit(ass, gap.offsetWidth);
        ass.style.top = (bot(gap) + pick(12, 10)) + 'px';
        lab.style.top = (V ? bot(F.fr) + 34 : bot(ass) + 40) + 'px';
        L = 1;
      }
      // --- A
      mkUp(a1.querySelector('i'), lt, tBer, .34);
      grow(a2bk, lt, tKon - .06, .3); a2bk.style.opacity = lt >= tKon - .06 ? 1 : 0;
      mkUp(a2mk.querySelector('i'), lt, tKon + .02, .34);
      const kl = io(P(lt, tPri - .04, tPri + .5));
      a3img.style.clipPath = `inset(0 ${((1 - kl) * 100).toFixed(2)}% 0 0)`;
      a3bk.style.display = kl > 0 && kl < 1 ? 'block' : 'none';
      a3bk.style.transform = `translateX(${(kl * a3.offsetWidth - 14).toFixed(1)}px)`;
      phaseWipe(A, B1, wb1, lt, tcA);
      // --- B1
      kick.style.opacity = 1;
      mkUp(gap.querySelector('i'), lt, tGap, .3); mkUp(ass.querySelector('i'), lt, tAss, .34);
      grow(labBk, lt, tcA + .25, .34); mkUp(labTx, lt, tcA + .32, .34);
      frameIn(F, lt, tcA - .12);
      applyView(F, lt, vt);
      // --- B1 → B2
      if (lt >= tcA + .25) phaseWipe(B1, B2, wb2, lt, tcB);
      else { B2.style.visibility = 'hidden'; wb2.style.display = 'none'; }
      hdw.forEach((el, i) => mkUp(el, lt, tcB + .05 + i * .12, .34));
      scans.forEach(([gr, a, b]) => {
        const k = P(lt, a, b), front = Math.floor(k * gr.n);
        gr.cells.forEach((c, i) => {
          const shown = lt >= tcB + .02 + c.row / gr.rows * .28;
          const cls = !shown ? 'h' : i < front ? c.st : i === front && k > 0 && k < 1 ? 'cur' : '';
          if (c.cls !== cls) { c.el.className = cls; c.cls = cls; }
        });
        gr.cnt.textContent = String(Math.min(gr.n, Math.max(0, front))).padStart(3, '0');
        gr.hd.style.opacity = P(lt, tcB, tcB + .3);
      });
      leg.style.opacity = P(lt, tcB + .5, tcB + .9);
      // --- "pasal demi pasal": fokus melangkah per setengah ketukan + pita tipografi
      if (lt >= tP1) {
        const idx = Math.min(UU.n - 1, Math.floor((lt - tP1) / (B / 2)));
        const g = UU.g, x = g.x + (idx % g.cols) * G.p, y = g.y + Math.floor(idx / g.cols) * G.p;
        Object.assign(foc.style, { display: 'block', left: (x - 7) + 'px', top: (y - 7) + 'px', width: (G.c + 14) + 'px', height: (G.c + 14) + 'px' });
        foc.style.transform = `scale(${(1 + .25 * Math.exp(-((lt - tP1) % (B / 2)) * 18)).toFixed(3)})`;
        UU.cnt.textContent = String(idx + 1).padStart(3, '0');
      } else foc.style.display = 'none';
      grow(bandBk, lt, tP1 - .08, .28); bandBk.style.opacity = lt >= tP1 - .08 ? 1 : 0;
      [tP1, tDemi, tP2].forEach((t, i) => mkUp(bandW[i], lt, t, .28));
    };
  });

  // =====================================================================
  // s3 · rekomendasi GAP (screenshot asli) → roadmap prioritas: 5 blok meluncur menuju 16.01.2027
  // =====================================================================
  KIT.registerType('swRoad', (root, v, sc, tm, T) => {
    const tHas = T('w:Hasilnya', .43), tRoad = T('w:roadmap', 1.33), tPrio = T('w:prioritas', 1.76), tIns = T('w:insiden', 7.93);
    const items = v.items, ti = items.map((it, i) => T(it.at, 2.9 + i));
    const tc = CUT.s3 ? CUT.s3(sc)[0] : ti[0] - .22;
    const [vt] = VIEWS.s3 ? VIEWS.s3(sc) : [[0, 2 * B, 4 * B]];
    const tEnd = tIns + .55;
    const kick = at(add(root, '<div class="x lb r-kick">Hasilnya jadi</div>'), X0, pick(96, 204));
    const ttl = at(add(root, `<div class="x r-ttl ar"><b class="mk"><i>ROADMAP</i></b>${V ? '<br>' : ' '}<b class="mk org"><i>PRIORITAS</i></b></div>`), X0, pick(134, 242));
    const ttlW = $$(ttl, '.mk > i');
    const A = add(root, '<div class="ph"></div>'), Bq = add(root, '<div class="ph"></div>'), wb = add(root, '<div class="x wbar"></div>');
    // --- A: rekomendasi per pasal (sumber prioritas)
    const F = shotFrame(A, v.shot, pick({ x: X0, y: 330, w: 1100, h: 620, inv: 1 }, { x: X0, y: 580, w: CW, h: 660, inv: 1 }));
    const prio = add(A, `<div class="x r-prio">${V ? '' : '<div class="lb pk">Urutan prioritas</div>'}${(v.prio || []).map((p, i) => `<div class="pc p${i}"><i class="bk"></i><span class="it">${esc(p)}</span></div>`).join('')}${V ? '' : '<div class="lb pf">dari rekomendasi per pasal</div>'}</div>`);
    if (V) at(prio, X0, 1280, CW); else at(prio, 1240, 348, 600);
    const pcs = $$(prio, '.pc'), pk = $$(prio, '.lb');
    // --- B: garis waktu
    let bars, nums = [], axis, ticks, dl, dlLb, now, nodes = [], dlk = null;
    if (!V) {
      const AX0 = 300, AX1 = 1730, RY = 372, RH = 92, RG = 20, U = (AX1 - AX0) / 10;
      const S0 = [0, 1.2, 2.4, 3.6, 4.8], LN = [4, 4.2, 4.4, 4.6, 4.8];
      axis = at(add(Bq, '<i class="x r-axis"></i>'), AX0, 332, AX1 - AX0);
      ticks = Array.from({ length: 11 }, (_, j) => at(add(Bq, `<i class="x r-tk ${j % 5 === 0 ? 'q' : ''}"></i>`), AX0 + j * U - 1.5, 332));
      now = at(add(Bq, '<div class="x lb r-now">Sekarang</div>'), AX0, 294);
      dl = at(add(Bq, '<i class="x r-dl"></i>'), AX1 - 4, 300); dl.style.height = (RY + 5 * (RH + RG) - 300) + 'px';
      dlLb = add(Bq, '<div class="x r-dlb ar">16.01.2027</div>'); dlLb.style.right = '80px'; dlLb.style.top = '252px';
      nums = items.map((it, i) => at(add(Bq, `<div class="x r-no ar">${String(i + 1).padStart(2, '0')}</div>`), X0, RY + i * (RH + RG) + 12));
      bars = items.map((it, i) => at(add(Bq, `<div class="x r-bar"><i class="sp"></i><span class="it">${esc(it.text)}</span></div>`), AX0 + S0[i] * U, RY + i * (RH + RG), LN[i] * U));
    } else {
      const AXX = 92, CY = 596, CH = 122, CG = 24;
      axis = at(add(Bq, '<i class="x r-axis vv"></i>'), AXX, 572); axis.style.height = (5 * (CH + CG) + 14) + 'px';
      ticks = [];
      now = at(add(Bq, '<div class="x lb r-now">Sekarang</div>'), X0, 530);
      dl = at(add(Bq, '<i class="x r-dl hz"></i>'), X0, 1330, CW);
      dlLb = add(Bq, '<div class="x r-dlb ar">16.01.2027</div>'); dlLb.style.right = '60px'; dlLb.style.top = '1356px';
      dlk = at(add(Bq, '<div class="x lb r-dlk">Batas kesiapan</div>'), X0, 1366);
      bars = items.map((it, i) => { const x = 146 + i * 34; return at(add(Bq, `<div class="x r-bar vv"><i class="sp"></i><b class="ar">${String(i + 1).padStart(2, '0')}</b><span class="it">${esc(it.text)}</span></div>`), x, CY + i * (CH + CG), X1 - x); });
      nodes = items.map((it, i) => at(add(Bq, '<i class="x r-node"></i>'), AXX - 9, CY + i * (CH + CG) + CH / 2 - 11));
    }
    let L = null;
    CAM[sc.id] = (lt) => ({ s: 1 + punch(lt, vt.slice(1), .018) + punch(lt, [tRoad, tPrio], .016) + punch(lt, ti, .022) + punch(lt, [tEnd], .02) + .003 * bp(lt), x: 0, y: 0 });

    return (lt) => {
      if (!L && ttl.offsetWidth) { if (V) fit(ttl, CW); L = 1; }
      kick.style.opacity = P(lt, tHas, tHas + .3);
      mkUp(ttlW[0], lt, tRoad, .34); mkUp(ttlW[1], lt, tPrio, .36);
      // --- A
      frameIn(F, lt, .08, 120);
      applyView(F, lt, vt);
      pcs.forEach((el, i) => {
        const t0 = vt[1] + .1 + i * .1, k = P(lt, t0, t0 + .32);
        grow(el.querySelector('.bk'), lt, t0, .3); el.querySelector('.bk').style.opacity = k > 0 ? 1 : 0;
        mkUp(el.querySelector('span'), lt, t0 + .06, .3);
      });
      pk.forEach((el) => (el.style.opacity = P(lt, vt[1], vt[1] + .3)));
      phaseWipe(A, Bq, wb, lt, tc);
      // --- B
      const ta = tc + .1;
      const ka = io(P(lt, ta, ta + .5));
      axis.style.transform = V ? `scaleY(${ka.toFixed(4)})` : `scaleX(${ka.toFixed(4)})`;
      ticks.forEach((tk, j) => (tk.style.opacity = P(lt, ta + j * .04, ta + .1 + j * .04)));
      now.style.opacity = P(lt, ta + .1, ta + .4);
      const kdl = io(P(lt, ta + .2, ta + .7));
      dl.style.transform = V ? `scaleX(${kdl.toFixed(4)})` : `scaleY(${kdl.toFixed(4)})`;
      const kdb = P(lt, ta + .45, ta + .8);
      const pulse = lt > tEnd ? 1 + .08 * Math.exp(-(lt - tEnd) * 5) : 1;
      tf(dlLb, { y: (1 - oX(kdb)) * -24, o: kdb, s: pulse });
      if (dlk) dlk.style.opacity = kdb;
      bars.forEach((el, i) => {
        const t0 = ti[i], k = P(lt, t0 - .06, t0 + .44), e = oX(k);
        if (!V) tf(el, { x: -(1 - e) * (parseFloat(el.style.left) + parseFloat(el.style.width) + 60), o: k > 0 ? 1 : 0 });
        else tf(el, { y: -(1 - e) * 360, o: k > 0 ? 1 : 0 });
        const sp = el.querySelector('.sp'); sp.style.opacity = k > 0 && k < 1 ? Math.min(1, (1 - e) * 2.2).toFixed(3) : 0; sp.style.transform = V ? `scaleY(${(.3 + (1 - e) * .7).toFixed(3)})` : `scaleX(${(.3 + (1 - e) * .7).toFixed(3)})`;
        const act = lt >= t0 && (i === bars.length - 1 ? lt < tEnd : lt < ti[i + 1]);
        const flash = lt >= tEnd + i * .07 && lt < tEnd + i * .07 + .16;
        el.classList.toggle('on', act || flash);
        if (nums[i]) { slam(nums[i], lt, t0 + .12, { from: 1.5 }); nums[i].classList.toggle('on', act); }
        if (nodes[i]) { const kn = oB(P(lt, t0, t0 + .3)); tf(nodes[i], { s: Math.max(0, kn), o: kn > 0 ? 1 : 0 }); nodes[i].classList.toggle('on', act || flash); }
      });
    };
  });

  // =====================================================================
  // s4 · "Tim Anda kami latih" (DPO Academy asli) → "tercatat di Privasimu Nexus" (dasbor asli)
  // =====================================================================
  KIT.registerType('swNexus', (root, v, sc, tm, T) => {
    const tTim = T('w:Tim', .43), tAnda = T('w:Anda', .69), tKami = T('w:kami', .98), tLatih = T('w:latih', 1.23);
    const tc = CUT.s4 ? CUT.s4(sc)[0] : 1.94;
    const [va, vb] = VIEWS.s4 ? VIEWS.s4(sc) : [[0, 2 * B], [tc, tc + 2 * B, tc + 4 * B, tc + 6 * B]];
    const tSemua = T('w:semua', 2.27), tTer = T('w:tercatat', 3.12), tPri = T('w:Privasimu', 3.74), tNex = T('w:Nexus', 4.36);
    const A = add(root, '<div class="ph"></div>'), Bn = add(root, '<div class="ph"></div>'), wb = add(root, '<div class="x wbar"></div>');
    // --- A: pelatihan
    const l1 = at(add(A, '<div class="x n-l it"><b class="mk"><i>TIM</i></b> <b class="mk"><i>ANDA</i></b></div>'), X0, pick(108, 280));
    const l2 = at(add(A, '<div class="x n-l it"><b class="mk"><i>KAMI</i></b> <b class="mk org"><i>LATIH</i></b></div>'), X0, pick(244, 424));
    const lab = add(A, `<div class="x lb n-lab">${(v.train || []).map((s) => `<div>${esc(s)}</div>`).join('')}</div>`);
    const lw = [...$$(l1, '.mk > i'), ...$$(l2, '.mk > i')], lT = [tTim, tAnda, tKami, tLatih];
    const FA = shotFrame(A, v.academy, pick({ x: X0, y: 470, w: CW, h: 510 }, { x: X0, y: 716, w: CW, h: 520 }));
    // --- B: dasbor asli
    const cap = at(add(Bn, `<div class="x n-cap ar"><b class="mk"><i>SEMUA</i></b>${V ? '<br>' : ' '}<b class="mk"><i>TERCATAT</i></b><b class="mk org"><i>.</i></b></div>`), X0, pick(96, 204));
    const capW = $$(cap, '.mk > i');
    const FB = shotFrame(Bn, v.shot, pick({ x: X0, y: 250, w: 1274, h: 710 }, { x: X0, y: 548, w: CW, h: 640 }));
    const side = add(Bn, `<div class="x n-side"><div class="lgw"><img src="${LOGO}" alt=""></div><b class="nx it">NEXUS</b><i class="rl"></i><div class="nt"><b class="it">${esc((v.notes || [])[0] || '')}</b><span class="lb"><i></i>${esc((v.notes || [])[1] || '')}</span></div></div>`);
    if (V) at(side, X0, 1226, CW); else at(side, 1414, 330, 426);
    const sLg = side.querySelector('.lgw img'), sNx = side.querySelector('.nx'), sRl = side.querySelector('.rl'), sNt = side.querySelector('.nt'), sDot = side.querySelector('.nt i');
    let L = null;
    CAM[sc.id] = (lt) => ({ s: 1 + punch(lt, [0.02], .05) + punch(lt, [tLatih], .02) + punch(lt, [va[1], ...vb.slice(1)], .022) + punch(lt, [tNex], .025) + .006 * bp(lt), x: 0, y: 0 });

    return (lt) => {
      if (!L && l1.offsetWidth) {
        if (V) { fit(l2, CW); l1.style.fontSize = l2.style.fontSize; fit(cap, CW); at(lab, X0, bot(l2) + 30); }
        else { lab.style.right = '80px'; lab.style.top = (bot(l2) - lab.offsetHeight - 6) + 'px'; }
        L = 1;
      }
      // --- A
      lw.forEach((el, i) => mkUp(el, lt, lT[i], .32));
      lab.style.opacity = P(lt, tLatih + .1, tLatih + .4);
      frameIn(FA, lt, .1, 110);
      applyView(FA, lt, va);
      phaseWipe(A, Bn, wb, lt, tc);
      // --- B
      mkUp(capW[0], lt, tSemua, .32); mkUp(capW[1], lt, tTer, .34); mkUp(capW[2], lt, tTer + .2, .3);
      frameIn(FB, lt, tc - .1, 110);
      applyView(FB, lt, vb);
      const kl = io(P(lt, tPri - .04, tPri + .45));
      sLg.style.clipPath = `inset(0 ${((1 - kl) * 100).toFixed(2)}% 0 0)`;
      const kn = oX(P(lt, tNex - .05, tNex + .45));
      sNx.style.letterSpacing = lerp(1.1, .32, kn).toFixed(3) + 'em'; sNx.style.opacity = P(lt, tNex - .05, tNex + .15);
      grow(sRl, lt, tTer, .4);
      tf(sNt, { y: (1 - oX(P(lt, tTer + .1, tTer + .5))) * 24, o: P(lt, tTer + .1, tTer + .35) });
      sDot.style.opacity = .3 + .7 * bp(lt);
    };
  });

  // =====================================================================
  // s5 · "PP 33 berlaku" + stempel → BUKTI KEPATUHAN, bukan sekadar ~~niat~~
  // =====================================================================
  KIT.registerType('swBukti', (root, v, sc, tm, T) => {
    const tJadi = T('w:Jadi', .43), tSaat = T('w:saat', .89), tPP = T('w:PP', 1.17), tTiga = T('w:tiga', 1.48), tBer = T('w:berlaku', 2.35);
    const tc = CUT.s5 ? CUT.s5(sc)[0] : 3.14;
    const tAnda = T('w:Anda', 3.28), tBukti = T('w:bukti', 3.83), tKep = T('w:kepatuhan', 4.14), tBukan = T('w:bukan', 5.04), tSek = T('w:sekadar', 5.45), tNiat = T('w:niat', 5.89);
    const A = add(root, '<div class="ph"></div>'), Bb = add(root, '<div class="ph"></div>'), wb = add(root, '<div class="x wbar ink hz"></div>');
    // --- A
    const k1 = at(add(A, '<div class="x b-k1 it"><b class="mk"><i>JADI,</i></b> <b class="mk"><i>SAAT</i></b></div>'), X0, pick(112, 330));
    const k1w = $$(k1, '.mk > i');
    const pp = at(add(A, '<div class="x b-pp ar"><b class="n">PP</b> <b class="n">33</b></div>'), X0, pick(206, 432));
    const ppN = $$(pp, '.n');
    const sub = at(add(A, '<div class="x lb b-sub">Peraturan Pemerintah No. 33 Tahun 2026</div>'), X0 + 4, 0);
    const stamp = add(A, '<div class="x b-stamp"><span class="it">BERLAKU</span><b class="ar">16.01.2027</b></div>');
    // --- B
    const k2 = at(add(Bb, '<div class="x lb b-k">Anda punya</div>'), X0, pick(100, 222));
    const bukti = at(add(Bb, '<div class="x b-big ar"><b class="mk"><i>BUKTI</i></b></div>'), X0, pick(140, 262));
    const kep = at(add(Bb, '<div class="x b-big ar"><b class="mk"><i>KEPATUHAN</i></b></div>'), X0, 0);
    const proofs = (v.proofs || []).map((p) => add(Bb, `<div class="x b-card"><i class="tab"></i><b class="it">${esc(p)}</b><i class="ok">${CHECK}</i></div>`));
    const not = add(Bb, '<div class="x b-not"><span class="it bs"><b class="mk"><i>BUKAN</i></b> <b class="mk"><i>SEKADAR</i></b></span><span class="ar niat"><b class="mk"><i>NIAT</i></b><i class="strike"></i></span></div>');
    const notW = $$(not, '.mk > i'), niatW = not.querySelector('.niat .mk'), strike = not.querySelector('.strike');
    let L = null;
    CAM[sc.id] = (lt) => {
      const [sx, sy] = shk(lt, [tBer], 14, .32), [nx, ny] = shk(lt, [tNiat], 9, .26);
      return { s: 1 + punch(lt, [tPP, tTiga], .025) + punch(lt, [tBer], .05) + punch(lt, [tBukti], .03) + punch(lt, [tNiat], .04) + .006 * bp(lt), x: sx + nx, y: sy + ny };
    };

    return (lt) => {
      if (!L && pp.offsetWidth) {
        if (V) { fit(pp, CW); fit(bukti, CW); fit(kep, CW); fit(not.querySelector('.bs'), CW); }
        else fit(kep, CW);
        const pb = bot(pp);
        sub.style.top = (pb + pick(18, 22)) + 'px';
        if (V) at(stamp, 150, pb + 150); else at(stamp, 1222, 226);
        kep.style.top = (bot(bukti) + pick(14, 16)) + 'px';
        const kpB = bot(kep);
        const cw = pick(236, 296), cg = pick(28, 36), ch = pick(186, 200);
        proofs.forEach((el, i) => { el.style.width = cw + 'px'; el.style.height = ch + 'px'; at(el, V ? X0 + i * (cw + cg) : X1 - (3 - i) * cw - (2 - i) * cg, V ? kpB + 44 : bukti.offsetTop + 8); });
        at(not, X0, V ? kpB + 44 + ch + 60 : kpB + 64);
        L = 1;
      }
      if (!L) return;
      // --- A
      mkUp(k1w[0], lt, tJadi, .3); mkUp(k1w[1], lt, tSaat, .3);
      slam(ppN[0], lt, tPP, { from: 1.9 }); slam(ppN[1], lt, tTiga, { from: 1.9 });
      sub.style.opacity = P(lt, tTiga + .25, tTiga + .6);
      const ks = P(lt, tBer - .04, tBer + .16);
      tf(stamp, { s: lerp(2.8, 1, oX(ks)), r: pick(-7, -6), o: ks > 0 ? 1 : 0 });
      phaseWipe(A, Bb, wb, lt, tc, 'y');
      // --- B
      k2.style.opacity = P(lt, tAnda, tAnda + .3);
      mkUp(bukti.querySelector('i'), lt, tBukti, .32); mkUp(kep.querySelector('i'), lt, tKep, .34);
      proofs.forEach((el, i) => {
        const t0 = tKep + .28 + i * .16, k = P(lt, t0, t0 + .4);
        tf(el, { y: (1 - oX(k)) * 140, r: (1 - oX(k)) * (i - 1) * 8, o: k > 0 ? 1 : 0 });
        const kk = oB(P(lt, t0 + .25, t0 + .5)); tf(el.querySelector('.ok'), { s: Math.max(0, kk), o: kk > 0 ? 1 : 0 });
      });
      mkUp(notW[0], lt, tBukan, .3); mkUp(notW[1], lt, tSek, .3); mkUp(notW[2], lt, tSek + .22, .32);
      const kst = P(lt, tNiat, tNiat + .2);
      strike.style.transform = `rotate(-4deg) scaleX(${oX(kst).toFixed(4)})`;
      strike.style.opacity = kst > 0 ? 1 : 0;
      niatW.style.opacity = lt > tNiat + .25 ? lerp(1, .5, o3(P(lt, tNiat + .25, tNiat + .7))).toFixed(3) : 1;
    };
  });

  // =====================================================================
  // s6 · CTA Swiss: logo, "Siap PP 33 bersama ahlinya", Konsultasi gratis · privasimu.com
  // =====================================================================
  KIT.registerType('swCta', (root, v, sc, tm, T) => {
    const tPri = T('w:Privasimu', .48), tSiap = T('w:Siap', 2.21), tPP = T('w:PP', 2.56), tTiga = T('w:tiga', 2.9), tBer = T('w:bersama', 3.8), tAhli = T('w:ahlinya', 4.33);
    const tKons = T('w:Konsultasi', 5.75), tUrl = T('w:privasimu#2', 7.06);
    const lg = at(add(root, `<div class="x c-logo"><img src="${LOGO}" alt=""><i class="bk"></i></div>`), X0, pick(146, 230));
    const lgImg = lg.querySelector('img'), lgBk = lg.querySelector('.bk');
    const rule = at(add(root, '<i class="x c-rule"></i>'), X0, pick(338, 400), pick(1300, CW));
    const l1 = at(add(root, `<div class="x c-l1 ar"><b class="mk"><i>SIAP</i></b>${V ? '<br>' : ' '}<b class="mk"><i>PP</i></b> <b class="mk"><i>33</i></b></div>`), X0, pick(384, 436));
    const l2 = at(add(root, `<div class="x c-l2 it"><b class="mk"><i>BERSAMA</i></b>${V ? '<br>' : ' '}<b class="mk org"><i>AHLINYA</i></b></div>`), X0, 0);
    const l1w = $$(l1, '.mk > i'), l2w = $$(l2, '.mk > i');
    const col = add(root, '<div class="x c-col"><i class="bk"></i><b class="ar">16.01.2027</b></div>');
    const colBk = col.querySelector('.bk'), colTx = col.querySelector('b');
    const [bt1, bt2] = v.buttons || ['Konsultasi gratis', 'privasimu.com'];
    const row = add(root, `<div class="x c-row"><div class="c-btn k"><i class="bk"></i><span class="it">${esc(bt1)}</span></div><div class="c-btn o"><i class="bk"></i><span class="it">${esc(bt2)}</span>${ARROW}</div></div>`);
    const [b1, b2] = $$(row, '.c-btn'), arw = row.querySelector('.arw');
    const ct = add(root, `<div class="x lb c-ct">${esc(v.contact || '')}</div>`);
    let L = null;
    CAM[sc.id] = (lt) => ({ s: 1 + punch(lt, [tPri], .03) + punch(lt, [tSiap, tTiga], .018) + punch(lt, [tAhli], .025) + punch(lt, [tKons, tUrl], .02), x: 0, y: 0 });

    return (lt) => {
      if (!L && l1.offsetWidth) {
        if (V) { fit(l1, CW - 130, 220); fit(l2, CW - 130, 120); }
        l2.style.top = (bot(l1) + pick(22, 26)) + 'px';
        const b2y = bot(l2);
        if (V) { at(col, X1 - 104, l1.offsetTop, 104); col.style.height = (b2y - l1.offsetTop) + 'px'; }
        else { at(col, 1452, 146, 388); col.style.height = (b2y - 146) + 'px'; }
        at(row, X0, b2y + pick(88, 50)); if (V) row.style.width = CW + 'px';
        at(ct, X0 + 4, bot(row) + pick(30, 22));
        L = 1;
      }
      if (!L) return;
      const kl = io(P(lt, tPri - .06, tPri + .5));
      lgImg.style.clipPath = `inset(0 ${((1 - kl) * 100).toFixed(2)}% 0 0)`;
      lgBk.style.display = kl > 0 && kl < 1 ? 'block' : 'none';
      lgBk.style.transform = `translateX(${(kl * lg.offsetWidth - 14).toFixed(1)}px)`;
      grow(rule, lt, tPri + .3, .5);
      [tSiap, tPP, tTiga].forEach((t, i) => mkUp(l1w[i], lt, t, .3));
      mkUp(l2w[0], lt, tBer, .32); mkUp(l2w[1], lt, tAhli, .34);
      grow(colBk, lt, .06, .55, 'Y');
      colTx.style.opacity = P(lt, .4, .7);
      [[b1, tKons - .04], [b2, tUrl - .08]].forEach(([el, t]) => {
        const bk = el.querySelector('.bk'), sp = el.querySelector('.it');
        grow(bk, lt, t, .3); bk.style.opacity = lt >= t ? 1 : 0;
        const k = P(lt, t + .08, t + .4); tf(sp, { y: (1 - oX(k)) * 40, o: k > 0 ? 1 : 0 });
      });
      tf(arw, { x: lt > tUrl + .3 ? 8 * bp(lt) : 0, o: P(lt, tUrl + .15, tUrl + .35) });
      ct.style.opacity = P(lt, tUrl + .35, tUrl + .7);
    };
  });
})();
