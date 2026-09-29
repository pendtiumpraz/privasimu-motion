// N03 · 3×24 Jam — gaya "cyber-noir thriller / CCTV control room".
//   Krisis (s1–s3): feed CCTV lorong rak server (canvas), log terminal hijau, timer bom 7-segmen, kekacauan notifikasi + meme.
//   Solusi (s4–s6): "system reboot" (garis CRT → layar bersih) ke ruang kendali teal/cyan: screenshot ASLI aplikasi di
//   monitor kaca (Ken Burns maks 1,4x + sorotan + kursor), kartu mission briefing, CTA tenang.
// Semua gerak dihitung dari waktu (deterministik): tanpa transition/animation CSS, tanpa Math.random/Date.now.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick, splitWords, revealWords, float, icon } = KIT;
  const { cl, P, lerp, E, hash, tf } = MG;
  const LOGO = '../assets/privasimu_logo.png';
  const B = 0.5; // 1 ketukan @120 bpm (durasi scene dibulatkan ke ketukan)
  const CRISIS = new Set(['s1', 's2', 's3']);
  const pad2 = (n) => String(n).padStart(2, '0');
  const hms = (s) => { s = Math.max(0, Math.floor(s)); return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor(s % 3600 / 60))}:${pad2(s % 60)}`; };
  const scTL = (id) => window.TIMELINE.scenes.find((s) => s.id === id);
  const scCF = (id) => PRV.SCENES.find((s) => s.id === id);
  const RES = {};
  const Tof = (id) => RES[id] || (RES[id] = KE.resolver(scTL(id), window.wordTime));
  const decay = (lt, t0, dur) => (lt >= t0 && lt < t0 + dur ? 1 - (lt - t0) / dur : 0);
  const spike = (lt, t0, dur = 0.32) => (lt >= t0 ? 1 - E.out3(P(lt, t0, t0 + dur)) : 0);
  const fr = (t) => Math.floor(t * 30);
  const blinkOn = (lt) => Math.floor(lt * 3.3) % 2 === 0;
  // emoji selalu memakai Noto Color Emoji (OFL) lewat kelas .emo dari kit.css
  const emo = (html) => html.replace(/(\p{Extended_Pictographic}️?)/gu, '<span class="emo">$1</span>');
  const CHECK = '<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".35"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
  const CURSOR = '<svg width="34" height="44" viewBox="0 0 34 44"><path d="M3 2l26 24-12 2 7 13-6 3-7-13-8 8z" fill="#fff" stroke="#08202a" stroke-width="2.6" stroke-linejoin="round"/></svg>';

  // =====================================================================================================
  // LATAR
  // =====================================================================================================
  // Krisis: rekaman CCTV lorong rak server (perspektif 3D sederhana), LED berkedip; alarm → lampu merah berputar
  const RACK = [];
  [-1, 1].forEach((sd) => { for (let k = 0; k < 14; k++) RACK.push({ sd, z0: 0.85 + k * 0.95 }); });
  function crisisBg(cx, t, id, lt) {
    const d = scTL(id).dur;
    const tb = id === 's1' ? Tof('s1')('w:bocor', 4.3) : -9;
    const alarm = id === 's1' ? P(lt, tb, tb + 0.12) : 1, red = alarm > 0.5;
    cx.fillStyle = '#010203'; cx.fillRect(0, 0, SW, SH);
    const pan = Math.sin(t * 0.21 + 0.5) * (V ? 34 : 60);
    const vx = SW / 2 + pan, vy = SH * (V ? 0.42 : 0.46), f = V ? 760 : 900;
    const pr = (X, Y, Z) => [vx + f * X / Z, vy + f * Y / Z];
    const col = (a) => (red ? `rgba(255,50,70,${a})` : `rgba(90,255,160,${a})`);
    const quad = (a, b, c, e) => { cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.lineTo(c[0], c[1]); cx.lineTo(e[0], e[1]); cx.closePath(); };
    cx.lineWidth = 1.2;
    // lantai
    cx.strokeStyle = col(0.075); cx.beginPath();
    for (let i = -4; i <= 4; i++) { const a = pr(i * 0.35, 1, 0.7), b = pr(i * 0.35, 1, 40); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); }
    for (let z = 0.8; z < 40; z *= 1.3) { const a = pr(-1.4, 1, z), b = pr(1.4, 1, z); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); }
    cx.stroke();
    // lampu langit-langit
    for (let z = 1.2; z < 26; z += 1.9) {
      const fog = cl(1.3 - z / 20), dim = red && hash(fr(t) * 0.7 + z) < 0.25 ? 0.25 : 1;
      cx.fillStyle = red ? `rgba(255,70,90,${0.16 * fog * dim})` : `rgba(210,255,230,${0.2 * fog})`;
      quad(pr(-0.22, -1.08, z), pr(0.22, -1.08, z), pr(0.22, -1.08, z + 0.5), pr(-0.22, -1.08, z + 0.5)); cx.fill();
    }
    // rak + LED
    RACK.forEach(({ sd, z0 }, ri) => {
      const z1 = z0 + 0.82, X = sd * 1.4, fog = cl(1.35 - z0 / 11);
      if (fog <= 0) return;
      quad(pr(X, -0.98, z0), pr(X, -0.98, z1), pr(X, 1, z1), pr(X, 1, z0));
      cx.fillStyle = 'rgba(7,13,11,.96)'; cx.fill();
      cx.strokeStyle = col(0.13 * fog); cx.stroke();
      cx.strokeStyle = col(0.05 * fog); cx.beginPath();
      for (let j = 1; j < 10; j++) { const Y = -0.98 + j * 0.198, a = pr(X, Y, z0 + 0.03), b = pr(X, Y, z1 - 0.03); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); }
      cx.stroke();
      for (let j = 0; j < 9; j++) for (let c2 = 0; c2 < 2; c2++) {
        const seed = ri * 31 + j * 7 + c2 * 3 + 1, rate = 1.2 + hash(seed) * (red ? 9 : 4);
        if (hash(seed * 1.37 + Math.floor(t * rate)) < (red ? 0.35 : 0.5)) continue;
        const [x, y] = pr(X, -0.88 + j * 0.198, z0 + 0.1 + c2 * 0.09), r = Math.max(0.9, 5 / z0);
        const isRed = red ? hash(seed + 9) < 0.85 : hash(seed + 9) < 0.06;
        cx.fillStyle = isRed ? `rgba(255,40,60,${0.16 * fog})` : `rgba(80,255,150,${0.14 * fog})`;
        cx.beginPath(); cx.arc(x, y, r * 3.2, 0, 7); cx.fill();
        cx.fillStyle = isRed ? `rgba(255,80,96,${0.95 * fog})` : `rgba(130,255,180,${0.9 * fog})`;
        cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill();
      }
    });
    // lampu darurat berputar
    if (alarm > 0) {
      cx.globalCompositeOperation = 'lighter';
      const bx = vx + Math.sin(t * 3.4) * SW * 0.42, by = vy - SH * 0.32;
      const g = cx.createRadialGradient(bx, by, 0, bx, by, SH * 0.85);
      g.addColorStop(0, `rgba(255,20,40,${0.24 * alarm})`); g.addColorStop(1, 'rgba(255,20,40,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, SW, SH);
      cx.globalCompositeOperation = 'source-over';
    }
    cx.fillStyle = `rgba(0,0,0,${id === 's1' ? 0.1 : 0.5})`; cx.fillRect(0, 0, SW, SH);
    if (id === 's3') {
      const f0 = fr(t);
      for (let i = 0; i < 6; i++) if (hash(f0 * 3.7 + i * 1.9) < 0.3) {
        cx.fillStyle = i % 2 ? 'rgba(255,40,60,.14)' : 'rgba(61,255,138,.1)';
        cx.fillRect(0, hash(f0 * 1.3 + i * 7.7) * SH, SW, 2 + hash(f0 + i * 3.3) * 36);
      }
      const k = P(lt, d - 0.55, d - 0.45);
      if (k > 0) { cx.fillStyle = `rgba(0,0,0,${k})`; cx.fillRect(0, 0, SW, SH); }
    }
  }

  // Solusi: ruang kendali teal/cyan — aurora lembut, berkas cahaya, grid titik halus
  const AUR = [[0.18, 0.22, '20,184,166', 0.8, 0.5], [0.82, 0.3, '34,211,238', 0.6, 0.45], [0.5, 1.02, '13,148,136', 0.7, 0.6], [0.95, 0.9, '56,189,248', 0.35, 0.4]];
  function calmBg(cx, t) {
    const g = cx.createLinearGradient(0, 0, 0, SH);
    g.addColorStop(0, '#04191e'); g.addColorStop(0.6, '#021116'); g.addColorStop(1, '#01080b');
    cx.fillStyle = g; cx.fillRect(0, 0, SW, SH);
    cx.globalCompositeOperation = 'lighter';
    AUR.forEach(([bx, by, c, a, r], i) => {
      const x = (bx + Math.sin(t * 0.11 + i * 1.7) * 0.07) * SW, y = (by + Math.cos(t * 0.09 + i * 2.3) * 0.05) * SH, rr = r * Math.max(SW, SH);
      const gr = cx.createRadialGradient(x, y, 0, x, y, rr);
      gr.addColorStop(0, `rgba(${c},${0.2 * a})`); gr.addColorStop(1, `rgba(${c},0)`);
      cx.fillStyle = gr; cx.fillRect(0, 0, SW, SH);
    });
    for (let i = 0; i < 3; i++) {
      const x0 = (0.12 + i * 0.3 + Math.sin(t * 0.07 + i) * 0.03) * SW, w = (0.06 + 0.03 * i) * SW;
      const lg = cx.createLinearGradient(0, 0, 0, SH);
      lg.addColorStop(0, `rgba(153,246,228,${0.045 - i * 0.01})`); lg.addColorStop(1, 'rgba(153,246,228,0)');
      cx.fillStyle = lg; cx.beginPath(); cx.moveTo(x0, 0); cx.lineTo(x0 + w, 0); cx.lineTo(x0 + w + SH * 0.35, SH); cx.lineTo(x0 + SH * 0.35, SH); cx.closePath(); cx.fill();
    }
    cx.globalCompositeOperation = 'source-over';
    cx.fillStyle = 'rgba(153,246,228,.06)';
    const st = 48, off = (t * 5) % st;
    for (let y = -st + off; y < SH; y += st) for (let x = 0; x < SW; x += st) cx.fillRect(x, y, 2, 2);
  }

  // =====================================================================================================
  // OVERLAY GLOBAL: HUD CCTV, glitch bar, tint kilat, rana CRT (mati/nyala)
  // =====================================================================================================
  let OV = null;
  function overlay() {
    if (OV) return OV;
    const el = h(`<div id="n3-ov">
      <div class="n3-cctv"><div class="scan"></div><div class="roll"></div>
        <i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i>
        <div class="rec"><b></b>REC</div><div class="cam">CAM 04 · SERVER ROOM</div>
        <div class="ts"><span class="dt">12/04/2027</span><span class="tm">02:00:13</span></div><div class="meta">IR · 1080P</div></div>
      <div class="n3-gl"></div><div class="n3-tint"></div>
      <div class="n3-shut t"></div><div class="n3-shut b"></div><div class="n3-line"></div></div>`);
    document.getElementById('stage').insertBefore(el, document.getElementById('grain'));
    const gl = $('.n3-gl', el);
    OV = {
      cctv: $('.n3-cctv', el), rec: $('.rec b', el), tm: $('.tm', el), roll: $('.roll', el),
      bars: Array.from({ length: 12 }, () => gl.appendChild(document.createElement('i'))),
      tint: $('.n3-tint', el), st: $('.n3-shut.t', el), sb: $('.n3-shut.b', el), line: $('.n3-line', el),
      grain: document.getElementById('grain'), vig: document.getElementById('vignette'),
    };
    return OV;
  }
  const VIG_NOIR = 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 32%, rgba(0,0,0,.55) 72%, rgba(0,0,0,.93) 100%)';
  const VIG_CALM = 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,8,10,.55) 100%)';

  const FX = {};
  const fxOf = (id) => FX[id] || (FX[id] = (scCF(id).vis.fx || []).map((x) => ({ ...x, t: Tof(id)(x.at, 0) })));

  function onFrame(id, lt, d, sec) {
    const o = overlay(), t = scTL(id).start + lt, crisis = CRISIS.has(id), f = fr(t);
    o.cctv.style.display = crisis ? 'block' : 'none';
    if (crisis) {
      o.rec.style.opacity = Math.floor(t * 1.6) % 2 ? 0.15 : 1;
      o.tm.textContent = hms(2 * 3600 + 13 + t);
      o.roll.style.transform = `translateY(${(((t * 0.45) % 1.4) - 0.2) * SH}px)`;
    }
    o.grain.style.opacity = crisis ? 0.16 : 0.05;
    o.vig.style.background = crisis ? VIG_NOIR : VIG_CALM;

    let G = 0, punch = 0, tint = 0, tintCol = '255,255,255', flick = 1;
    for (const x of fxOf(id)) {
      if (x.kind === 'glitch') G += (x.amt ?? 1) * decay(lt, x.t, x.dur ?? 0.4);
      else if (x.kind === 'glitchIn') G += (x.amt ?? 1) * E.in3(P(lt, x.t, x.t + (x.dur ?? 0.25)));
      else if (x.kind === 'punch') punch += (x.amt ?? 0.1) * spike(lt, x.t, x.dur ?? 0.35);
      else if (x.kind === 'flash') { const k = (x.amt ?? 0.8) * decay(lt, x.t, x.dur ?? 0.3); if (k > tint) { tint = k; tintCol = x.color || '255,255,255'; } }
      else if (x.kind === 'flicker' && lt >= x.t && lt < x.t + (x.dur ?? 0.4) && hash(f * 1.7 + 3) < 0.45) flick = 0.3;
    }
    let extra = '';
    if (punch > 0.001) extra += ` scale(${(1 + punch).toFixed(4)})`;
    if (G > 0.01) {
      extra += ` translate(${((hash(f * 3.1) - 0.5) * 80 * G).toFixed(1)}px, ${((hash(f * 1.7) - 0.5) * 16 * G).toFixed(1)}px) skewX(${((hash(f * 5.3) - 0.5) * 8 * G).toFixed(2)}deg)`;
      const a = (6 + 26 * G).toFixed(1);
      sec.style.filter = `drop-shadow(${a}px 0 0 rgba(255,0,60,.75)) drop-shadow(-${a}px 0 0 rgba(0,255,220,.6))`;
    }
    if (extra) sec.style.transform += extra;
    if (flick < 1) sec.style.opacity = String(+sec.style.opacity * flick);
    o.bars.forEach((b, i) => {
      const on = G > 0.01 && hash(f * 7.7 + i * 1.3) < G * 0.8;
      b.style.opacity = on ? (0.25 + hash(f + i * 2.9) * 0.5).toFixed(2) : 0;
      if (!on) return;
      b.style.top = (hash(f * 3.3 + i * 9.1) * SH).toFixed(0) + 'px';
      b.style.height = (3 + Math.pow(hash(f * 1.1 + i * 4.7), 2) * 80).toFixed(0) + 'px';
      b.style.transform = `translateX(${((hash(f * 2.3 + i) - 0.5) * 160).toFixed(0)}px)`;
      b.style.background = ['#ff1f3d', '#12ffe0', '#ffffff'][i % 3];
    });
    o.cctv.style.transform = G > 0.01 ? `translateX(${((hash(f * 4.1) - 0.5) * 30 * G).toFixed(1)}px)` : 'none';
    o.tint.style.opacity = tint.toFixed(3);
    o.tint.style.background = `rgb(${tintCol})`;
    crt(id, lt, d, sec, o);
  }

  // CRT mati di akhir s3 (gambar memipih jadi garis → titik), "system reboot" di awal s4 (garis → layar bersih)
  function crt(id, lt, d, sec, o) {
    let shut = 0, lineW = 0, lineO = 0, edge = 0;
    if (id === 's3') {
      const t0 = d - 0.5, k = P(lt, t0, t0 + 0.28), k2 = P(lt, t0 + 0.28, t0 + 0.42);
      if (k > 0) {
        const sy = lerp(1, 0.006, E.in3(k)), sx = lerp(1, 1.06, k);
        sec.style.transform += ` scale(${sx.toFixed(3)}, ${sy.toFixed(4)})`;
        sec.style.filter = `brightness(${(1 + 3 * k).toFixed(2)}) contrast(${(1 + k).toFixed(2)})`;
        o.cctv.style.transform = `scale(${sx.toFixed(3)}, ${sy.toFixed(4)})`;
        shut = E.in3(k) * 0.5;
        lineO = k > 0.75 ? 1 - P(lt, t0 + 0.42, t0 + 0.47) : 0;
        lineW = lerp(SW, 0, E.in3(k2));
      }
      if (lt > t0 + 0.44) shut = 0.5;
    }
    if (id === 's4') {
      const k1 = P(lt, 0, 0.16), k2 = P(lt, 0.14, 0.52);
      shut = 0.5 * (1 - E.out3(k2));
      lineW = lerp(0, SW, E.out3(k1)); lineO = 1 - k2;
      edge = k2 > 0 && k2 < 1 ? 1 - k2 * 0.7 : 0;
      if (lt < 0.9) { const kb = P(lt, 0.14, 0.9); sec.style.filter = `brightness(${lerp(1.8, 1, E.out3(kb)).toFixed(3)}) saturate(${lerp(0.4, 1, kb).toFixed(3)})`; }
    }
    o.st.style.height = o.sb.style.height = (shut * SH).toFixed(1) + 'px';
    o.st.style.setProperty('--edge', edge.toFixed(3)); o.sb.style.setProperty('--edge', edge.toFixed(3));
    o.line.style.width = lineW.toFixed(0) + 'px'; o.line.style.opacity = lineO.toFixed(3);
  }

  KIT.style({
    fonts: ['400 20px "VT323"', '500 20px "Chakra Petch"', '600 20px "Chakra Petch"', '700 20px "Chakra Petch"'],
    themes: {
      noir: ['#3a0a10', '#120305', '#020203', 'rgba(255,60,80,.06)', 'rgba(220,255,235,.2)'],
      calm: ['#0b4a52', '#062226', '#020709', 'rgba(94,234,212,.08)', 'rgba(153,246,228,.4)'],
    },
    bg: (cx, t, id, theme, W, H, lt) => (CRISIS.has(id) ? crisisBg(cx, t, id, lt) : calmBg(cx, t)),
    frame: onFrame,
  });

  // =====================================================================================================
  // s1 · TERMINAL — log hijau mengetik baris demi baris, lalu layar pecah (irisan bergeser + RGB split)
  // =====================================================================================================
  KIT.registerType('terminal', (root, v, sc, tm, T) => {
    const CPS = v.cps || 78, tBreak = T(v.breakAt, 4.3);
    const seg = (l) => [['ts', `[${l.ts}] `], ['tg ' + (l.tone || ''), l.tag], ['sp', ' '], ['tx', l.text]];
    const lines = v.lines.map((l) => { const s = seg(l); return { ...l, t: T(l.at, 0), s, n: s.reduce((a, x) => a + x[1].length, 0) }; });
    const fin = v.final ? seg({ ...v.final, tone: 'red' }) : null;
    const typed = (s, c) => { let rem = c, out = ''; for (const [cls, str] of s) { if (rem <= 0) break; const p = str.slice(0, rem); rem -= p.length; out += `<span class="${cls}">${esc(p)}</span>`; } return out; };
    const preHTML = (v.pre || []).map((l) => `<div class="ln old">${typed(seg({ ...l, tone: 'dim' }), 999)}</div>`).join('');
    const wrap = h('<div class="n3-termw"></div>');
    root.appendChild(wrap);
    const mk = () => wrap.appendChild(h(`<div class="n3-term"><div class="ttl"><i></i><i></i><i></i><span>${esc(v.title)}</span><em>● LIVE</em></div><div class="bd"></div></div>`));
    const base = mk(), NSL = 9;
    const cut = [0];
    for (let i = 1; i < NSL; i++) cut.push(i * 100 / NSL + (hash(i * 3.7) - 0.5) * 6);
    cut.push(100);
    const sl = cut.slice(0, -1).map((a, i) => { const el = mk(); el.style.clipPath = `inset(${a.toFixed(2)}% 0 ${(100 - cut[i + 1]).toFixed(2)}% 0)`; el.style.display = 'none'; return el; });
    const all = [base, ...sl], bds = all.map((el) => $('.bd', el));
    // 9:16: jam dinding digital besar "02:00" mengisi ruang di bawah terminal (tertutup kotak peringatan saat bocor)
    const clk = h('<div class="n3-clk"><div class="lb">WAKTU SERVER · WIB</div><div class="hm"><span>02</span><i>:</i><span>00</span><small></small></div></div>');
    root.appendChild(clk);
    const clkS = $('small', clk), clkC = $('i', clk), tClk = T(v.clockAt, 0.6);
    const al = h(`<div class="n3-alert"><div class="k">${esc(v.alert.k)}</div><div class="t">${esc(v.alert.title)}</div><div class="s">${esc(v.alert.sub)}</div></div>`);
    root.appendChild(al);
    const alT = $('.t', al);
    let last = '';
    return (lt) => {
      const f = fr(lt), broke = lt >= tBreak, blink = Math.floor(lt * 3.3) % 2 === 0;
      let html = `<div class="ln"><span class="pr">${esc(v.prompt)}</span> ${esc(v.cmd)}</div>${preHTML}`, active = -1;
      lines.forEach((l, i) => { if (lt >= l.t) active = i; });
      lines.forEach((l, i) => {
        if (lt < l.t) return;
        const c = Math.min(l.n, Math.floor((lt - l.t) * CPS)), done = c >= l.n;
        let s = typed(l.s, c);
        if (l.bar && done) {
          const pct = Math.round(lerp(l.bar[0], l.bar[1], E.in3(P(lt, l.t + l.n / CPS, tBreak))));
          s += ` <span class="bar"><i style="width:${pct}%"></i></span> <span class="pc">${pct}%</span>`;
        }
        if (i === active && !broke) s += `<span class="cur" style="opacity:${!done || blink ? 1 : 0}"></span>`;
        html += `<div class="ln">${s}</div>`;
      });
      if (active < 0) html += `<div class="ln"><span class="cur" style="opacity:${blink ? 1 : 0}"></span></div>`;
      if (fin && broke) html += `<div class="ln fin">${typed(fin, 999)}<span class="cur"></span></div>`;
      if (html !== last) { last = html; bds.forEach((b) => (b.innerHTML = html)); }
      all.forEach((el) => el.classList.toggle('alarm', broke));
      const ki = E.out3(P(lt, 0, 0.35));
      wrap.style.transform = `translateY(${((1 - ki) * 24 + float(lt, 0, 3, 0.8)).toFixed(2)}px) scale(${lerp(0.97, 1, ki).toFixed(4)})`;
      wrap.style.opacity = ki;
      if (V) {
        const kc = P(lt, tClk - 0.05, tClk + 0.35), on = kc > 0 && !(kc < 1 && hash(f * 2.3 + 1) < 0.45);
        clk.style.opacity = on ? 1 : kc > 0 ? 0.15 : 0;
        clk.classList.toggle('alarm', broke);
        clkS.textContent = ':' + pad2(13 + Math.floor(scTL(sc.id).start + lt));
        clkC.style.opacity = (lt % 1) < 0.5 ? 1 : 0.2;
        clk.style.transform = `translateY(${float(lt, 2, 4, 0.7).toFixed(2)}px)`;
      }
      // layar pecah: 9 irisan bergeser acak (deterministik) + RGB split, lalu tersisa getaran kecil
      const G = broke ? 0.1 + 0.95 * (1 - E.out3(P(lt, tBreak, tBreak + 0.6))) + (hash(f * 1.3 + 5) < 0.1 ? 0.5 : 0) : 0;
      base.style.display = G > 0.02 ? 'none' : 'block';
      sl.forEach((el, i) => {
        el.style.display = G > 0.02 ? 'block' : 'none';
        if (G <= 0.02) return;
        const mv = hash(f * 7.3 + i * 3.1) < 0.75 ? (hash(f * 2.9 + i * 5.7) - 0.5) * 2 * 150 * G : 0;
        el.style.transform = `translateX(${mv.toFixed(1)}px)`;
        const a = (6 * G).toFixed(1);
        el.style.filter = i % 2 ? `drop-shadow(${a}px 0 0 rgba(255,0,60,.8)) drop-shadow(-${a}px 0 0 rgba(0,255,220,.7))` : 'none';
      });
      const ka = P(lt, tBreak + 0.05, tBreak + 0.32);
      tf(al, { s: lerp(1.4, 1, E.outExpo(ka)), o: ka > 0 ? 1 : 0, y: ka >= 1 ? float(lt, 1, 3) : 0 });
      MG.glitch(alT, lt, ka > 0 ? 0.85 * (1 - P(lt, tBreak, tBreak + 0.6)) + 0.04 + (hash(f * 2.1) < 0.035 ? 0.35 : 0) : 0);
    };
  });

  // =====================================================================================================
  // s2 · BOMB — timer 7-segmen merah (berdetak tiap ketukan musik) + kewajiban & rujukan pasal
  // =====================================================================================================
  const SEG = (() => {
    const t = 16, g = 3;
    const Hs = (x0, x1, y) => `${x0 + g},${y} ${x0 + g + t / 2},${y - t / 2} ${x1 - g - t / 2},${y - t / 2} ${x1 - g},${y} ${x1 - g - t / 2},${y + t / 2} ${x0 + g + t / 2},${y + t / 2}`;
    const Vs = (x, y0, y1) => `${x},${y0 + g} ${x + t / 2},${y0 + g + t / 2} ${x + t / 2},${y1 - g - t / 2} ${x},${y1 - g} ${x - t / 2},${y1 - g - t / 2} ${x - t / 2},${y0 + g + t / 2}`;
    return { a: Hs(8, 92, 8), b: Vs(92, 8, 90), c: Vs(92, 90, 172), d: Hs(8, 92, 172), e: Vs(8, 90, 172), f: Vs(8, 8, 90), g: Hs(8, 92, 90) };
  })();
  const DIG = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg'];
  KIT.registerType('bomb', (root, v, sc, tm, T) => {
    const XS = [0, 118, 262, 380, 524, 642], CXS = [240, 502];
    const svg = `<svg class="seg" viewBox="-6 -6 790 252">${XS.map((x) => `<g class="dg" transform="translate(${x + 24} 0) skewX(-7)">${'abcdefg'.split('').map((s) => `<polygon data-s="${s}" points="${SEG[s]}"/>`).join('')}</g>`).join('')}${CXS.map((x) => `<g class="cln" transform="translate(${x + 24} 0) skewX(-7)"><circle cx="0" cy="58" r="10"/><circle cx="0" cy="122" r="10"/></g>`).join('')}${[['JAM', 109], ['MENIT', 371], ['DETIK', 633]].map(([s, x]) => `<text x="${x + 13}" y="236" text-anchor="middle">${s}</text>`).join('')}</svg>`;
    // kabel keluar dari atas casing, melengkung ke kiri lalu keluar bingkai
    const WIRES = [['#d8203a', 120, 60], ['#26d672', 170, 92], ['#8d949c', 220, 124]];
    const dev = h(`<div class="n3-bomb"><svg class="wires" viewBox="0 0 940 160">${WIRES.map(() => '<path class="wo"/><path class="w"/>').join('')}${WIRES.map(([, a]) => `<rect x="${a - 16}" y="146" width="32" height="18" rx="3"/>`).join('')}</svg>
      <div class="case"><i class="sc a"></i><i class="sc b"></i><i class="sc c"></i><i class="sc d"></i>
        <div class="hdr"><b class="led"></b><span>${esc(v.label)}</span><em>${esc(v.state || 'AKTIF')}</em></div>
        <div class="win">${svg}<div class="glass"></div></div></div></div>`);
    root.appendChild(dev);
    const col = h(`<div class="n3-obl"><div class="k">${esc(v.kicker)}</div><div class="t">${rich(v.title)}</div>
      <div class="to">${v.to.map((x) => `<span class="chip">${icon(x.icon, 30, 2.2)}<b>${esc(x.text)}</b></span>`).join('')}</div>
      <div class="pl"><span>${esc(v.stamp.text)}</span></div>
      <div class="big">${v.big.map((b) => `<span>${esc(b.text)}</span>`).join('')}</div>
      <div class="rf"></div></div>`);
    root.appendChild(col);
    const digits = [...dev.querySelectorAll('.dg')].map((g) => ({ polys: [...g.querySelectorAll('polygon')], n: -1 }));
    const segEl = $('.seg', dev), led = $('.led', dev), wo = [...dev.querySelectorAll('.wires .wo')], wi = [...dev.querySelectorAll('.wires .w')];
    const kEl = $('.k', col), tEl = $('.t', col), titleW = splitWords(tEl), chips = [...col.querySelectorAll('.chip')];
    const plEl = $('.pl', col), plS = $('.pl span', col), bigs = [...col.querySelectorAll('.big span')], rfEl = $('.rf', col);
    const tOn = T(v.on, 0.12), tStart = T(v.start, 2.8), tTitle = T(v.titleAt, 0.4), tRef = T(v.refAt, 2.4), tStamp = T(v.stamp.at, 3.1);
    const tTo = v.to.map((x, i) => T(x.at, 1.4 + i * 0.7)), tBig = v.big.map((b, i) => T(b.at, 3.6 + i * 0.3));
    const tb0 = Math.ceil((tStart - 1e-6) / B) * B; // detak pertama jatuh di ketukan musik (sinkron dengan detak jam)
    return (lt) => {
      const f = fr(lt);
      const on = lt >= tOn && !(lt < tOn + 0.4 && hash(f * 1.3 + 2) < 0.5); // kedip lampu saat menyala
      segEl.classList.toggle('off', !on);
      const ticks = lt < tb0 ? 0 : 1 + Math.floor((lt - tb0) / B);
      const str = hms((v.hours || 72) * 3600 - ticks).replace(/:/g, '');
      digits.forEach((dg, i) => { const n = +str[i]; if (dg.n !== n) { dg.n = n; dg.polys.forEach((p) => p.classList.toggle('on', DIG[n].includes(p.getAttribute('data-s')))); } });
      const pulse = ticks ? decay(lt, tb0 + (ticks - 1) * B, 0.2) : 0;
      segEl.style.filter = `drop-shadow(0 0 5px rgba(255,36,54,.95)) drop-shadow(0 0 ${(16 + 18 * pulse).toFixed(1)}px rgba(255,20,40,${(0.5 + 0.4 * pulse).toFixed(2)})) brightness(${(1 + 0.45 * pulse).toFixed(2)})`;
      segEl.classList.toggle('lit', on && (lt < tb0 || Math.floor(lt / (B / 2)) % 2 === 0));
      led.style.opacity = Math.floor(lt * 4) % 2 ? 0.25 : 1;
      tf(dev, { y: float(lt, 0, 4, 0.9) + pulse * 3, s: 1 + 0.006 * pulse });
      WIRES.forEach(([c, a, ey], i) => {
        const sw = Math.sin(lt * 1.3 + i * 1.9) * 8;
        const d = `M${a},156 C${(a + sw).toFixed(1)},${40 + i * 14} ${(a - 170 + sw).toFixed(1)},${ey - 40} -300,${(ey + sw * 0.6).toFixed(1)}`;
        wo[i].setAttribute('d', d); wi[i].setAttribute('d', d); wi[i].setAttribute('stroke', c);
      });
      // kolom kewajiban
      const kk = E.out3(P(lt, tTitle - 0.2, tTitle + 0.2));
      tf(kEl, { x: (1 - kk) * -30, o: kk });
      revealWords(titleW, tTitle, lt, { stagger: 0.08, dur: 0.5 });
      chips.forEach((c, i) => { const k = E.outBack(P(lt, tTo[i], tTo[i] + 0.35)); tf(c, { s: 0.6 + 0.4 * Math.max(0, k), o: cl(k * 2), y: (1 - Math.min(1, k)) * 18 }); });
      const ks = P(lt, tStamp - 0.03, tStamp + 0.22);
      tf(plEl, { s: lerp(2.3, 1, E.outExpo(ks)), o: ks > 0 ? 1 : 0 });
      MG.glitch(plS, lt, ks > 0 ? 0.6 * (1 - P(lt, tStamp, tStamp + 0.5)) : 0);
      bigs.forEach((b, i) => { const k = P(lt, tBig[i] - 0.02, tBig[i] + 0.2); tf(b, { s: lerp(1.7, 1, E.outExpo(k)), o: k > 0 ? 1 : 0, y: k >= 1 ? float(lt, i, 3) : 0 }); });
      const nref = Math.floor(cl((lt - tRef) * 55, 0, v.ref.length));
      rfEl.textContent = lt < tRef ? '' : v.ref.slice(0, nref) + (nref < v.ref.length || blinkOn(lt) ? '▌' : ' ');
    };
  });

  // =====================================================================================================
  // s3 · CHAOS — notifikasi bertubi-tubi, "SIAPA PEGANG APA?", dibaca doang + jangkrik, "TEMPLATNYA DI MANA?"
  // =====================================================================================================
  const ISZ = { chat: [540, 150], mail: [580, 170], file: [520, 112], call: [500, 110], note: [280, 230] };
  function chaosItem(it) {
    if (it.kind === 'chat') return `<div class="n3-it chat"><div class="nm">${esc(it.from)}</div><div class="tx">${emo(rich(it.text))}</div><div class="tm">${esc(it.time || '02:03')} ✓✓</div></div>`;
    if (it.kind === 'mail') return `<div class="n3-it mail"><div class="hd">${icon('mail', 24, 2)}<span>${esc(it.from)}</span><em>URGENT</em></div><div class="sj">${emo(rich(it.text))}</div><div class="pv">${emo(rich(it.sub || ''))}</div></div>`;
    if (it.kind === 'file') { const ext = it.text.split('.').pop().toUpperCase(); return `<div class="n3-it file"><div class="fi ${ext === 'XLSX' ? 'x' : ''}">${esc(ext)}</div><div class="fn">${esc(it.text)}</div></div>`; }
    if (it.kind === 'call') return `<div class="n3-it call"><div class="ic emo">📞</div><div><b>${esc(it.text)}</b><span>${esc(it.from || '')}</span></div></div>`;
    return `<div class="n3-it note">${emo(rich(it.text))}</div>`;
  }
  KIT.registerType('chaos', (root, v, sc, tm, T) => {
    const items = v.items.map((it, i) => {
      const el = h(chaosItem(it));
      root.appendChild(el);
      const [x, y] = V ? it.pos.v : it.pos.h, [w, hh] = ISZ[it.kind];
      const dx = x + w / 2 - SW / 2, dy = y + hh / 2 - SH / 2, len = Math.hypot(dx, dy) || 1;
      return { el, x, y, ux: dx / len, uy: dy / len, r: it.r ?? (hash(i + 3) - 0.5) * 10, t: T(it.at, 0.03 + i * 0.07) };
    });
    const dim = h('<div class="n3-dim"></div>');
    root.appendChild(dim);
    const words = h(`<div class="n3-words">${v.words.map((w) => `<span>${esc(w.text)}</span>`).join('')}</div>`);
    root.appendChild(words);
    const wEls = [...words.children], wT = v.words.map((w, i) => T(w.at, 0.6 + i * 0.25));
    const seen = h(`<div class="n3-seen"><span class="pill">${rich(v.seen.text)}</span>${v.seen.emoji ? `<span class="bug emo">${v.seen.emoji}</span>` : ''}</div>`);
    root.appendChild(seen);
    const tSeen = T(v.seen.at, 1.5), bug = $('.bug', seen);
    const ask = h(`<div class="n3-ask">${v.ask.map((a) => `<div>${esc(a.text)}</div>`).join('')}</div>`);
    root.appendChild(ask);
    const aEls = [...ask.children], aT = v.ask.map((a, i) => T(a.at, 2.3 + i * 0.45));
    const srch = h(`<div class="n3-srch"><div class="q"><span class="ic">${icon('search', 34, 2.4)}</span><span class="qt"></span><em></em></div>${v.search.files.map((fl) => `<div class="r"><i></i><span>${esc(fl)}</span></div>`).join('')}</div>`);
    root.appendChild(srch);
    const tS = T(v.search.at, 2.6), rows = [...srch.querySelectorAll('.r')], qt = $('.qt', srch), qn = $('.q em', srch), step = v.search.step || 0.12;
    const pov = h(`<div class="n3-pov">${rich(v.pov.text)} <span class="em emo">${v.pov.emoji || ''}</span></div>`);
    root.appendChild(pov);
    const tPov = T(v.pov.at, 0.1);
    return (lt) => {
      const tAsk = aT[0], blow = E.out3(P(lt, tAsk - 0.06, tAsk + 0.45));
      items.forEach((it, i) => {
        const k = E.outBack(P(lt, it.t, it.t + 0.28));
        const jit = Math.sin(lt * (8 + (i % 5)) + i * 1.3) * 1.4;
        tf(it.el, {
          x: it.x + it.ux * 460 * blow, y: it.y + it.uy * 460 * blow + Math.sin(lt * 2.2 + i) * 5, r: it.r + jit + blow * it.ux * 10,
          s: Math.max(0, k) * (1 + 0.12 * blow), o: k > 0 ? 1 - 0.7 * blow : 0, blur: blow * 6,
        });
      });
      dim.style.opacity = (0.8 * P(lt, wT[0] - 0.12, wT[0] + 0.05)).toFixed(3);
      const wOut = E.in3(P(lt, tAsk - 0.16, tAsk));
      wEls.forEach((el, i) => {
        const k = P(lt, wT[i] - 0.02, wT[i] + 0.2);
        tf(el, { s: lerp(1.9, 1, E.outExpo(k)) * (1 - 0.3 * wOut), o: (k > 0 ? 1 : 0) * (1 - wOut), y: k >= 1 ? float(lt, i, 3) : 0 });
        MG.glitch(el, lt, k > 0 && wOut < 1 ? 0.7 * (1 - P(lt, wT[i], wT[i] + 0.4)) + 0.04 : 0);
      });
      const ks = E.out3(P(lt, tSeen, tSeen + 0.3));
      tf(seen, { y: (1 - ks) * 20, o: ks * (1 - wOut) });
      if (bug) { const kb = P(lt, tSeen + 0.08, tSeen + 0.5); bug.style.transform = `scale(${Math.max(0, E.outElastic(kb)).toFixed(3)}) rotate(${(-12 + Math.sin(lt * 9) * 6).toFixed(1)}deg) translateY(${(Math.abs(Math.sin(lt * 7)) * -6).toFixed(1)}px)`; }
      aEls.forEach((el, i) => {
        const k = P(lt, aT[i] - 0.02, aT[i] + 0.22);
        tf(el, { s: lerp(2, 1, E.outExpo(k)), o: k > 0 ? 1 : 0, y: k >= 1 ? float(lt, i + 3, 3) : 0 });
        MG.glitch(el, lt, k > 0 ? 0.8 * (1 - P(lt, aT[i], aT[i] + 0.45)) + 0.05 : 0);
      });
      const kq = E.out3(P(lt, tS, tS + 0.3));
      tf(srch, { y: (1 - kq) * 40, o: kq, s: lerp(0.96, 1, kq) });
      const nq = Math.floor(cl((lt - tS) * 30, 0, v.search.q.length));
      qt.textContent = `"${v.search.q.slice(0, nq)}"`;
      qn.textContent = lt > tS + 0.25 ? `${v.search.files.length} hasil` : '';
      rows.forEach((r, i) => { const k = E.outBack(P(lt, tS + 0.15 + i * step, tS + 0.45 + i * step)); tf(r, { x: (1 - k) * -30, o: cl(k * 2) }); });
      const kp = E.outBack(P(lt, tPov, tPov + 0.4));
      tf(pov, { s: 0.7 + 0.3 * Math.max(0, kp), o: cl(kp * 2), y: float(lt, 0, 3), r: -1.2 });
    };
  });

  // =====================================================================================================
  // s4 · MONITOR — boot "Privasimu Nexus", monitor kaca berisi screenshot ASLI (Ken Burns ≤1,4x + sorotan),
  //   kartu aksi asli + kursor, HUD samping: hitung mundur 3×24 jam (grafis) + daftar fitur
  // =====================================================================================================
  // bidang pandang untuk region [x,y,w,h] (px gambar) di viewport VW×VH; zoom dibatasi ≤ 1,4x agar screenshot 1x tetap tajam
  function viewOf(r, VW, VH, im) {
    const [x, y, w, hh] = r, maxW = Math.min(im.w, im.h * VW / VH);
    const vw = Math.min(maxW, Math.max(w, hh * VW / VH, VW / 1.4)), vh = vw * VH / VW;
    return { cx: cl(x + w / 2, vw / 2, im.w - vw / 2), cy: cl(y + hh / 2, vh / 2, im.h - vh / 2), vw };
  }
  const camOf = (vv, VW, VH) => { const z = VW / vv.vw; return { z, tx: VW / 2 - vv.cx * z, ty: VH / 2 - vv.cy * z }; };
  function placeHl(el, lab, box, c, VW) {
    const pad = 8, x = c.tx + box[0] * c.z - pad, y = c.ty + box[1] * c.z - pad, w = box[2] * c.z + pad * 2, hh = box[3] * c.z + pad * 2;
    el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px'; el.style.width = w.toFixed(1) + 'px'; el.style.height = hh.toFixed(1) + 'px';
    if (lab) { lab.classList.toggle('below', y < 52); lab.classList.toggle('right', x + 40 > VW * 0.62 && x > VW * 0.5); }
  }

  KIT.registerType('monitor', (root, v, sc, tm, T) => {
    const VW = pick(1300, 960), VH = pick(812, 560);
    const keys = Object.keys(v.imgs);
    const shots = v.shots.map((s) => {
      const im = v.imgs[s.img], r = V && s.rv ? s.rv : s.region;
      const t = T(s.at, 0);
      return { ...s, t, hlT: s.hlAt != null ? T(s.hlAt, t + 0.3) : t + 0.3, hlb: V && s.hlv ? s.hlv : s.hl, view: viewOf(r, VW, VH, im) };
    });
    const mon = h(`<div class="n3-mon"><div class="bar"><i></i><i></i><i></i><span>${esc(v.title)}</span><em>● ${esc(v.status || '')}</em></div>
      <div class="vp">${keys.map((k) => `<img class="n3-shot" src="${esc(v.imgs[k].src)}" style="width:${v.imgs[k].w}px;height:${v.imgs[k].h}px" alt="">`).join('')}<div class="n3-hl"><b></b></div></div></div>`);
    root.appendChild(mon);
    const imgs = [...mon.querySelectorAll('.n3-shot')], hl = $('.n3-hl', mon), hlb = $('b', hl);
    // kartu aksi (screenshot asli) + kursor
    const pv = v.pop, PS = pick(1.2, 960 / pv.crop[2]);
    const pop = h(`<div class="n3-pop" style="width:${(pv.crop[2] * PS).toFixed(0)}px;height:${(pv.crop[3] * PS).toFixed(0)}px"><img src="${esc(pv.src)}" alt="" style="width:${(pv.w * PS).toFixed(1)}px;height:${(pv.h * PS).toFixed(1)}px;transform:translate(${(-pv.crop[0] * PS).toFixed(1)}px,${(-pv.crop[1] * PS).toFixed(1)}px)"><div class="n3-hl"><b></b></div><div class="n3-cur">${CURSOR}<i></i></div></div>`);
    root.appendChild(pop);
    const phl = $('.n3-hl', pop), phlb = $('b', phl), cur = $('.n3-cur', pop), ripple = $('.n3-cur i', pop);
    const tPop = T(pv.at, 4.6), phls = pv.hls.map((x) => ({ ...x, t: T(x.at, 5) }));
    // HUD samping (grafis, bukan UI aplikasi): cincin hitung mundur + daftar fitur
    const RR = pick(104, 138);
    const ring = h(`<div class="n3-ring"><svg viewBox="-150 -150 300 300"><circle class="tr" r="${RR}"/>${Array.from({ length: 60 }, (_, i) => { const a = i * 6 * Math.PI / 180, r0 = i % 5 ? RR + 10 : RR + 5, r1 = RR + 18; return `<line x1="${(Math.sin(a) * r0).toFixed(1)}" y1="${(-Math.cos(a) * r0).toFixed(1)}" x2="${(Math.sin(a) * r1).toFixed(1)}" y2="${(-Math.cos(a) * r1).toFixed(1)}"/>`; }).join('')}<circle class="pr" r="${RR}" pathLength="100" stroke-dasharray="100" transform="rotate(-90)"/><circle class="dot" r="6"/></svg><div class="dg">72:00:00</div><div class="lb">${esc(v.ring.label)}</div></div>`);
    root.appendChild(ring);
    const ticksEl = [...ring.querySelectorAll('line')], rdg = $('.dg', ring), rpr = $('.pr', ring), rdot = $('.dot', ring);
    const tRing = T(v.ring.at, 6.7);
    const side = h(`<div class="n3-side">${v.feats.map((ft, i) => `<div class="row"><span class="no">${pad2(i + 1)}</span><span class="tx">${rich(ft.text)}</span><span class="ck">${CHECK}</span></div>`).join('')}</div>`);
    root.appendChild(side);
    const rowsEl = [...side.querySelectorAll('.row')], feats = v.feats.map((ft, i) => ({ t: T(ft.at, 2.6 + i) }));
    // merek: splash di tengah → mengecil ke kepala HUD
    const BR = { x: SW / 2, y: pick(470, 860) }, HD = pick({ x: 1630, y: 168 }, { x: 540, y: 236 }), sEnd = pick(0.34, 0.36);
    const brand = h(`<div class="n3-brand" style="left:${BR.x}px;top:${BR.y}px"><img src="${LOGO}" alt=""><div class="nx">NEXUS</div><div class="ld"><i></i></div></div>`);
    root.appendChild(brand);
    const nx = $('.nx', brand), ld = $('.ld', brand), ldi = $('.ld i', brand);
    const tDock = T(v.dockAt, 2);
    let lastI = -1;
    return (lt) => {
      // splash → dok
      const kb = E.out3(P(lt, 0.32, 1.1)), kd = E.io3(P(lt, tDock - 0.1, tDock + 0.7));
      brand.style.transform = `translate(-50%,-50%) translate(${((HD.x - BR.x) * kd).toFixed(1)}px, ${((HD.y - BR.y) * kd).toFixed(1)}px) scale(${(lerp(1, sEnd, kd) * lerp(1.1, 1, kb)).toFixed(4)})`;
      brand.style.opacity = kb.toFixed(3);
      brand.style.filter = kb < 0.99 ? `blur(${((1 - kb) * 14).toFixed(1)}px)` : 'none';
      nx.style.letterSpacing = lerp(1.3, 0.6, E.out3(P(lt, 0.45, 1.4))).toFixed(3) + 'em';
      ldi.style.width = (100 * E.io3(P(lt, 0.5, tDock - 0.15))).toFixed(1) + '%';
      ld.style.opacity = (1 - P(lt, tDock - 0.15, tDock + 0.15)).toFixed(3);
      // monitor muncul
      const km = E.out3(P(lt, tDock, tDock + 0.85));
      mon.style.transform = `perspective(2000px) translateY(${((1 - km) * 110).toFixed(1)}px) rotateX(${((1 - km) * 16).toFixed(2)}deg) scale(${lerp(0.93, 1, km).toFixed(4)})`;
      mon.style.opacity = cl(km * 1.6).toFixed(3);
      // kamera Ken Burns (dalam 1 gambar: bergerak halus; ganti gambar: crossfade seperti pindah halaman)
      let i = 0;
      shots.forEach((s, j) => { if (lt >= s.t - 0.12) i = j; });
      const S = shots[i], Pv = shots[i - 1];
      let vv = { ...S.view };
      if (Pv && Pv.img === S.img) {
        const k = E.io3(P(lt, S.t - 0.12, S.t + 0.62));
        vv = { cx: lerp(Pv.view.cx, S.view.cx, k), cy: lerp(Pv.view.cy, S.view.cy, k), vw: Math.exp(lerp(Math.log(Pv.view.vw), Math.log(S.view.vw), k)) };
      }
      vv.vw = Math.max(VW / 1.4, vv.vw * (1 - 0.015 * Math.sin(lt * 0.6))); // "napas" kamera
      const c = camOf(vv, VW, VH), kx = P(lt, S.t - 0.12, S.t + 0.28), swap = Pv && Pv.img !== S.img;
      imgs.forEach((im, j) => {
        const key = keys[j];
        if (key === S.img) { im.style.transform = `translate(${c.tx.toFixed(1)}px, ${(c.ty + (swap ? (1 - E.out3(kx)) * 26 : 0)).toFixed(1)}px) scale(${c.z.toFixed(4)})`; im.style.opacity = swap ? E.out3(kx).toFixed(3) : 1; }
        else if (swap && key === Pv.img) { const cp = camOf(Pv.view, VW, VH); im.style.transform = `translate(${cp.tx.toFixed(1)}px, ${cp.ty.toFixed(1)}px) scale(${cp.z.toFixed(4)})`; im.style.opacity = (1 - kx).toFixed(3); }
        else im.style.opacity = 0;
      });
      const nextT = shots[i + 1] ? shots[i + 1].t : 99;
      if (S.hlb) { placeHl(hl, hlb, S.hlb, c, VW); if (i !== lastI) hlb.textContent = S.label || ''; }
      hl.style.opacity = S.hlb ? (P(lt, S.hlT, S.hlT + 0.3) * (1 - P(lt, nextT - 0.22, nextT - 0.1))).toFixed(3) : 0;
      lastI = i;
      // kartu aksi + kursor
      const kp = E.out3(P(lt, tPop - 0.12, tPop + 0.4));
      tf(pop, { y: (1 - kp) * 70, s: lerp(0.94, 1, kp), o: cl(kp * 1.5), blur: (1 - kp) * 8 });
      let pi = -1;
      phls.forEach((x, j) => { if (lt >= x.t - 0.35) pi = j; });
      const PH = phls[pi], PP = phls[pi - 1];
      if (PH && PH.box) {
        const pc = { z: PS, tx: -pv.crop[0] * PS, ty: -pv.crop[1] * PS };
        placeHl(phl, phlb, PH.box, pc, pv.crop[2] * PS);
        phlb.textContent = PH.label || '';
        phl.style.opacity = (P(lt, PH.t, PH.t + 0.2) * (phls[pi + 1] ? 1 - P(lt, phls[pi + 1].t - 0.4, phls[pi + 1].t - 0.28) : 1)).toFixed(3);
      } else phl.style.opacity = 0;
      // kursor meluncur ke tombol aktif lalu klik (riak); saat sorotan kosong kursor memudar
      const tgt = (x) => (x && x.box ? [(x.box[0] - pv.crop[0] + x.box[2] * 0.62) * PS, (x.box[1] - pv.crop[1] + x.box[3] * 0.62) * PS] : null);
      const lastBox = (j) => { for (let q = j; q >= 0; q--) if (phls[q].box) return tgt(phls[q]); return tgt(phls.find((x) => x.box)) || [0, 0]; };
      const pA = lastBox(pi - 1), pB = tgt(PH) || pA;
      const km2 = PH ? E.io3(P(lt, PH.t - 0.35, PH.t - 0.02)) : 0;
      const kc = PH && PH.box ? decay(lt, PH.t, 0.35) : 0;
      const visA = PP ? (PP.box ? 1 : 0) : 1, visB = PH && PH.box ? 1 : 0;
      cur.style.transform = `translate(${lerp(pA[0], pB[0], km2).toFixed(1)}px, ${lerp(pA[1], pB[1], km2).toFixed(1)}px) scale(${(1 - 0.12 * kc).toFixed(3)})`;
      cur.style.opacity = (kp * lerp(visA, visB, PH ? P(lt, PH.t - 0.35, PH.t - 0.1) : 0)).toFixed(3);
      ripple.style.transform = `scale(${(0.3 + (1 - kc) * 1.4).toFixed(3)})`;
      ripple.style.opacity = (kc * 0.9).toFixed(3);
      // HUD: cincin hitung mundur (siaga → berjalan) + daftar fitur
      const kr = E.out3(P(lt, tDock + 0.2, tDock + 0.9)), run = lt >= tRing, kg = E.out3(P(lt, tRing, tRing + 0.5));
      tf(ring, { s: lerp(0.9, 1, kr) * (1 + 0.05 * spike(lt, tRing, 0.4)), o: kr * (0.45 + 0.55 * kg) });
      const secs = run ? Math.floor(lt - tRing) : 0;
      rdg.textContent = hms(v.ring.hours * 3600 - secs);
      rpr.setAttribute('stroke-dashoffset', run ? (((lt - tRing) / 5) * 1.2).toFixed(2) : '0');
      const ang = run ? (lt - tRing) * 180 : 0;
      rdot.setAttribute('cx', (Math.sin(ang * Math.PI / 180) * RR).toFixed(1));
      rdot.setAttribute('cy', (-Math.cos(ang * Math.PI / 180) * RR).toFixed(1));
      rdot.style.opacity = kg;
      const lit = run ? Math.floor(((ang % 360) + 360) % 360 / 6) : -1;
      ticksEl.forEach((ln, j) => ln.classList.toggle('on', run && (j === lit || j === (lit + 59) % 60)));
      ring.classList.toggle('run', run);
      rowsEl.forEach((el, j) => {
        const ft = feats[j], k = E.out3(P(lt, ft.t - 0.12, ft.t + 0.28));
        tf(el, { x: (1 - k) * 34, o: k });
        el.classList.toggle('on', lt >= ft.t - 0.12 && lt < (feats[j + 1] ? feats[j + 1].t - 0.12 : 99));
        $('path', el).setAttribute('stroke-dashoffset', (1 - E.out3(P(lt, ft.t + 0.25, ft.t + 0.55))).toFixed(3));
      });
    };
  });

  // =====================================================================================================
  // s5 · BRIEFING — kartu "mission briefing" dengan spanduk ASLI halaman Fire Drill + berkas latihan (grafis)
  // =====================================================================================================
  KIT.registerType('briefing', (root, v, sc, tm, T) => {
    const bn = v.banner, cr = V && bn.cropV ? bn.cropV : bn.crop, BW = pick(1380, 900), s0 = BW / cr[2], BH = cr[3] * s0;
    const rowHTML = (r) => `<div class="rw"><div class="k">${esc(r.k)}</div>${r.tags ? `<div class="tags">${r.tags.map((g) => `<span class="tag">${esc(g.text)}</span>`).join('')}</div>` : `<div class="v">${rich(r.v)}</div>`}</div>`;
    const card = h(`<div class="n3-brief"><i class="bk tl"></i><i class="bk tr"></i><i class="bk bl"></i><i class="bk br"></i>
      <div class="hd"><span class="k"><b></b>${esc(v.kicker)}</span><span class="m">${esc(v.mode)}</span></div>
      <div class="bn" style="width:${BW}px;height:${BH.toFixed(0)}px"><img src="${esc(bn.src)}" alt="" style="width:${bn.w}px;height:${bn.h}px"></div>
      <div class="bd"><div class="rows">${v.rows.map(rowHTML).join('')}</div>
        <div class="team"><div class="k">TIM LATIHAN</div>${v.team.map((m) => `<div class="mb"><span class="av">${esc(m.n)}</span><span class="nm">${esc(m.r)}</span><span class="ck">${CHECK}</span></div>`).join('')}</div></div>
      <div class="stamp"><b>${esc(v.stamp.text)}</b><small>${esc(v.stamp.sub)}</small></div></div>`);
    root.appendChild(card);
    const img = $('.bn img', card), rws = [...card.querySelectorAll('.rw')], mbs = [...card.querySelectorAll('.mb')], stamp = $('.stamp', card);
    const tagEls = [...card.querySelectorAll('.tag')], tagT = [].concat(...v.rows.filter((r) => r.tags).map((r) => r.tags.map((g) => T(g.at, 1))));
    const rowT = v.rows.map((r, i) => (r.tags ? tagT[0] - 0.15 : T(r.at, 0.4 + i * 0.9)));
    const tTeam = T(v.teamAt, 2.4), tStamp = T(v.stamp.at, 3.1), dotEl = $('.hd .k b', card);
    return (lt, d) => {
      const kc = E.out3(P(lt, 0, 0.6));
      tf(card, { y: (1 - kc) * 60 + float(lt, 0, 3, 0.8), s: lerp(0.96, 1, kc), o: cl(kc * 1.5) });
      // Ken Burns pelan pada spanduk asli (≤ 1,4x): mendekat ke judul, tepi kiri spanduk tetap terlihat
      const kk = E.io3(P(lt, 0, d)), z = lerp(s0, Math.min(1.4, s0 * 1.12), kk);
      const cxv = Math.max(cr[0] + BW / z / 2, lerp(cr[0] + cr[2] / 2, cr[0] + BW / z / 2, kk)), cyv = cr[1] + cr[3] / 2;
      img.style.transform = `translate(${(BW / 2 - cxv * z).toFixed(1)}px, ${(BH / 2 - cyv * z).toFixed(1)}px) scale(${z.toFixed(4)})`;
      dotEl.style.opacity = 0.35 + 0.65 * Math.abs(Math.sin(lt * 3));
      rws.forEach((el, i) => { const k = E.out3(P(lt, rowT[i], rowT[i] + 0.35)); tf(el, { x: (1 - k) * -26, o: k }); });
      tagEls.forEach((el, i) => { const k = E.outBack(P(lt, tagT[i], tagT[i] + 0.32)); tf(el, { s: 0.6 + 0.4 * Math.max(0, k), o: cl(k * 2) }); el.classList.toggle('on', lt >= tagT[i] && (i === tagEls.length - 1 || lt < tagT[i + 1])); });
      mbs.forEach((el, i) => {
        const t0 = tTeam - 0.5 + i * 0.1, k = E.out3(P(lt, t0, t0 + 0.35));
        tf(el, { y: (1 - k) * 16, o: 0.25 + 0.75 * k });
        $('path', el).setAttribute('stroke-dashoffset', (1 - E.out3(P(lt, tTeam + i * 0.15, tTeam + i * 0.15 + 0.3))).toFixed(3));
        el.classList.toggle('ok', lt >= tTeam + i * 0.15);
      });
      const ks = P(lt, tStamp - 0.04, tStamp + 0.2);
      tf(stamp, { s: lerp(2.4, 1, E.outExpo(ks)), r: -9, o: ks > 0 ? 0.95 : 0 });
    };
  });

  // =====================================================================================================
  // s6 · CTA kit (nexus) + jam siaga yang baru "berdetak" di kata berdetak + tombol situs & kontak resmi
  // =====================================================================================================
  const baseCta = KIT.TYPES.cta;
  KIT.registerType('cta', (root, v, sc, tm, T) => {
    // stopwatch siaga di celah antara "NEXUS" dan tagline: jarum diam, lalu mulai berdetak tepat di kata "berdetak"
    const R = 40, ticks = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, r0 = i % 3 ? R - 7 : R - 12; return `<line x1="${(Math.sin(a) * r0).toFixed(1)}" y1="${(-Math.cos(a) * r0).toFixed(1)}" x2="${(Math.sin(a) * (R - 2)).toFixed(1)}" y2="${(-Math.cos(a) * (R - 2)).toFixed(1)}"/>`; }).join('');
    const clock = h(`<svg class="n3-clock" viewBox="-60 -66 120 120" style="left:${SW / 2 - pick(52, 64)}px;top:${pick(262, 536)}px;width:${pick(104, 128)}px;height:${pick(104, 128)}px">
      <rect class="crown" x="-7" y="-62" width="14" height="10" rx="3"/><line class="stem" x1="0" y1="-52" x2="0" y2="-${R + 2}"/><line class="btn" x1="26" y1="-44" x2="33" y2="-51"/>
      <circle r="${R + 4}" class="glow"/><circle r="${R}" class="rim"/>${ticks}<circle r="${R - 4}" class="arc" pathLength="60" stroke-dasharray="0 60" transform="rotate(-90)"/>
      <g class="hand"><line x1="0" y1="7" x2="0" y2="${-R + 9}"/></g><circle r="4.5" class="hub"/></svg>`);
    root.appendChild(clock);
    const r = baseCta(root, v, sc, tm, T);
    const P0 = pick({ logo: 118, lines: 372, btn: 626, chips: 772, foot: 866 }, { logo: 330, lines: 712, btn: 968, chips: 1118, foot: 1214 });
    $('.k-logo', root).style.top = P0.logo + 'px';
    $('.k-cta-lines', root).style.top = P0.lines + 'px';
    $('.k-btn', root).style.top = P0.btn + 'px';
    const foot = $('.k-foot', root);
    if (foot) foot.style.top = P0.foot + 'px';
    const chips = v.chips ? h(`<div class="n3-chips" style="top:${P0.chips}px">${v.chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>`) : null;
    if (chips) root.insertBefore(chips, $('.k-fade', root));
    const chipEls = chips ? [...chips.children] : [], tChips = T(v.chipsAt, tm.btn + 0.5), tTick = T(v.tickAt, 99);
    const hand = $('.hand', clock), arc = $('.arc', clock), tClock = tm.lines && tm.lines.length ? tm.lines[0] - 0.35 : 1.5;
    return (lt, d) => {
      r(lt, d);
      const ko = E.outBack(P(lt, tClock, tClock + 0.45));
      // jarum diam (siaga) → berdetak tepat di kata "berdetak", lalu tiap ketukan (5 "detik" per detak agar terbaca)
      const n = lt < tTick ? 0 : 1 + Math.floor((lt - tTick) / B), tn = tTick + (n - 1) * B;
      const step = n ? n - 1 + E.outBack(P(lt, tn, tn + 0.16)) : 0, pulse = n ? decay(lt, tn, 0.3) : 0;
      tf(clock, { s: Math.max(0, ko) * (1 + 0.12 * pulse), o: cl(ko * 1.5), y: float(lt, 3, 3, 0.9) });
      hand.setAttribute('transform', `rotate(${(step * 30).toFixed(2)})`);
      arc.setAttribute('stroke-dasharray', `${Math.min(60, Math.max(0, step * 5)).toFixed(3)} 60`);
      clock.classList.toggle('run', n > 0);
      chipEls.forEach((el, i) => { const k = E.outBack(P(lt, tChips + i * 0.12, tChips + 0.4 + i * 0.12)); tf(el, { y: (1 - Math.min(1, k)) * 16, s: 0.8 + 0.2 * Math.max(0, k), o: cl(k * 2) }); });
    };
  });
})();
