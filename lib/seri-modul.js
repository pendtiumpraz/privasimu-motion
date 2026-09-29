// Kit seri "Nexus Explained": satu video per modul Privasimu Nexus (dipakai M01–M22).
// Muat SESUDAH kit.js. Di <folder>/style.js panggil:  SERI.init({ kode: 'M01', modul: 'Dasbor Kepatuhan' })
// lalu daftarkan tipe hook khusus modul dengan KIT.registerType. Tipe bersama:
//   nx_text  — kalimat kinetik (baris, emoji, coretan)
//   nx_shot  — screenshot ASLI melayang: kamera zoom/pan, sorotan & label per kata VO
//   nx_cta   — penutup: logo, tagline, tombol, chip, kontak
(function () {
  const { V, SW, SH, h, esc, rich, $, pick, splitWords, revealWords, float } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const FMT = V ? 'v' : 'h';
  const pk = (o) => (o && typeof o === 'object' && !Array.isArray(o) && ('h' in o || 'v' in o) ? o[FMT] : o);
  const popK = (lt, t0, dur = 0.45) => { const k = P(lt, t0, t0 + dur); return k <= 0 ? 0 : E.outBack(k); };
  const place = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };
  const TONE = { blue: ['#2F6BFF', 'rgba(47,107,255,.55)', '#0B1B4D'], amber: ['#F59E0B', 'rgba(245,158,11,.55)', '#92400E'], red: ['#E5484D', 'rgba(229,72,77,.5)', '#9F1239'], green: ['#16A34A', 'rgba(22,163,74,.5)', '#14532D'] };

  // ---------------- latar terang: gradasi es + titik halus + orb warna melayang ----------------
  const ORBS = [[0.12, 0.2, '47,107,255', 0.16], [0.88, 0.3, '109,76,255', 0.13], [0.7, 0.92, '56,189,248', 0.12], [0.2, 0.85, '47,107,255', 0.08]];
  function bg(cx, t, id, theme, W, H) {
    const g = cx.createLinearGradient(0, 0, W * 0.4, H);
    g.addColorStop(0, '#F8FAFF'); g.addColorStop(1, '#EDF2FF');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    ORBS.forEach(([x, y, c, a], i) => {
      const px = (x + Math.sin(t * 0.21 + i * 1.7) * 0.07) * W, py = (y + Math.cos(t * 0.17 + i * 2.3) * 0.06) * H, r = Math.max(W, H) * (0.42 + 0.06 * i);
      const rg = cx.createRadialGradient(px, py, 0, px, py, r);
      rg.addColorStop(0, `rgba(${c},${a})`); rg.addColorStop(1, `rgba(${c},0)`);
      cx.fillStyle = rg; cx.fillRect(0, 0, W, H);
    });
    cx.fillStyle = 'rgba(11,27,77,.07)';
    const off = (t * 6) % 34;
    for (let y = -34 + off; y < H; y += 34) for (let x = 17; x < W; x += 34) { cx.beginPath(); cx.arc(x, y, 1.6, 0, 7); cx.fill(); }
  }

  // ---------------- chrome: badge seri + bar progres ----------------
  let OPT = {}, CH = null;
  function chrome(id, lt) {
    if (!CH) {
      const stage = $('#stage'), before = $('#grain');
      const prog = h('<div id="nx-prog"><i></i></div>');
      const badge = h(`<div id="nx-badge"><span class="no">${esc(OPT.kode)}</span><span class="k">NEXUS EXPLAINED</span><span class="m">${esc(OPT.modul)}</span></div>`);
      stage.insertBefore(prog, before); stage.insertBefore(badge, before);
      place(badge, pick(70, 56), pick(44, 196));
      CH = { prog: $('i', prog), badge };
    }
    const TL = window.TIMELINE, sc = TL.scenes.find((s) => s.id === id), t = sc.start + lt;
    CH.prog.style.width = (100 * t / TL.total).toFixed(2) + '%';
    const first = TL.scenes[0].id === id, last = TL.scenes[TL.scenes.length - 1].id === id;
    const k = first ? E.out3(P(lt, 0.6, 1.2)) : last ? 1 - P(lt, 0, 0.4) : 1;
    tf(CH.badge, { y: (1 - k) * -30, o: k });
  }

  function init(opt) {
    OPT = opt;
    document.body.insertAdjacentHTML('beforeend', `<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">${opt.emoji || ''}✨📄⏱️🙂</div>`);
    KIT.style({
      fonts: ['800 20px "Plus Jakarta Sans"', '700 20px "Plus Jakarta Sans"', '600 20px "Plus Jakarta Sans"'].concat(opt.fonts || []),
      bg: opt.bg || bg,
      frame: (id, lt, d, sec) => { chrome(id, lt); if (opt.frame) opt.frame(id, lt, d, sec); },
    });
  }

  // ---------------- nx_text: kalimat kinetik ----------------
  // v: { lines: [{ text, at, size: xl|lg|md|sm, cls, fx: 'up'|'blur'|'punch' }], align, y, strike: { line, at, color },
  //      emoji: { e, at, size, pos: {h:[x,y], v:[x,y]} }, out: detik mulai keluar }
  KIT.registerType('nx_text', (root, v, sc, tm, T) => {
    const wrap = h(`<div class="nx-text ${v.align || 'center'}"></div>`);
    root.appendChild(wrap);
    if (v.align === 'left') Object.assign(wrap.style, { left: pick(120, 60) + 'px', right: pick(700, 60) + 'px' });
    const lines = v.lines.map((ln, i) => {
      const el = h(`<div class="nx-line ${ln.size || 'lg'} ${ln.cls || ''}">${rich(ln.text)}</div>`);
      wrap.appendChild(el);
      return { el, at: T(ln.at, 0.2 + i * 0.5), fx: ln.fx || 'up', words: ln.fx === 'punch' ? null : splitWords(el) };
    });
    let strike = null;
    if (v.strike) {
      strike = h(`<svg class="nx-svg" width="${SW}" height="${SH}"><path d="" fill="none" stroke="${v.strike.color || '#E5484D'}" stroke-width="${pick(12, 10)}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`);
      root.appendChild(strike);
    }
    const emo = v.emoji ? h(`<div class="nx-emo" style="font-size:${v.emoji.size || 200}px">${v.emoji.e}</div>`) : null;
    if (emo) root.appendChild(emo);
    const tStrike = v.strike ? T(v.strike.at, 1) : 0, tEmo = v.emoji ? T(v.emoji.at, 0.5) : 0, tOut = v.out != null ? T(v.out, 99) : 99;
    return (lt) => {
      if (!wrap._c && wrap.offsetHeight) wrap._c = 1;
      wrap.style.top = (pk(v.y) ?? (pick(SH / 2, SH / 2 - 120) - wrap.offsetHeight / 2)) + 'px';
      const ko = E.in3(P(lt, tOut, tOut + 0.35));
      lines.forEach((l, i) => {
        if (l.fx === 'punch') { const k = P(lt, l.at - 0.03, l.at + 0.28); tf(l.el, { s: lerp(1.6, 1, E.outExpo(k)), o: (k > 0 ? 1 : 0) * (1 - ko), y: float(lt, i, 3) }); }
        else { revealWords(l.words, l.at, lt, l.fx === 'blur' ? { stagger: 0.07, dur: 0.7, dist: 0.2, blur: 16 } : { stagger: 0.05, dur: 0.55 }); tf(l.el, { y: float(lt, i, 3) - ko * 30, o: 1 - ko }); }
      });
      if (strike) {
        const ln = lines[v.strike.line || 0].el;
        const sx = wrap.offsetLeft + ln.offsetLeft - 20, ex = sx + ln.offsetWidth + 40, y = wrap.offsetTop + ln.offsetTop + ln.offsetHeight * 0.55;
        strike.firstChild.setAttribute('d', `M${sx} ${y + 8} C ${sx + (ex - sx) * 0.3} ${y - 10}, ${sx + (ex - sx) * 0.7} ${y + 14}, ${ex} ${y - 6}`);
        strike.firstChild.setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, tStrike, tStrike + 0.35)));
      }
      if (emo) {
        const [x, y] = pk(v.emoji.pos) || [SW / 2, SH * 0.3];
        const k = P(lt, tEmo - 0.02, tEmo + 0.3);
        place(emo, x - (v.emoji.size || 200) / 2, y - (v.emoji.size || 200) / 2);
        tf(emo, { s: lerp(2.6, 1, E.outExpo(k)) * (1 + 0.03 * Math.sin(lt * 6)), r: Math.sin(lt * 2.5) * 5, o: (k > 0 ? 1 : 0) * (1 - ko) });
      }
    };
  });

  // ---------------- nx_shot: screenshot asli melayang ----------------
  // v: { eyebrow, title, sub, src, size:[w,h], view:[w,h], label, cam:[{at,x,y,w,dur}],
  //      marks:[{at,to,r:[x,y,w,h],tone,label,side:'top'|'bottom'}] } — koordinat = piksel gambar
  const BAR = 52;
  KIT.registerType('nx_shot', (root, v, sc, tm, T) => {
    const [iw, ih] = v.size, [vw, vh] = v.view || v.size;
    let FW = pick(1120, 960), FH = FW * vh / vw + BAR;
    const maxH = pick(860, 800);
    if (FH > maxH) { FW = (maxH - BAR) * vw / vh; FH = maxH; }
    const FX = pick(1860 - FW, (SW - FW) / 2), FY = pick((SH - FH) / 2 + 20, 640);
    const title = h(`<div class="nx-title">${v.eyebrow ? `<div class="eb">${esc(v.eyebrow)}</div>` : ''}<div class="tt">${rich(v.title || '')}</div>${v.sub ? `<div class="sb">${rich(v.sub)}</div>` : ''}</div>`);
    root.appendChild(title);
    Object.assign(title.style, V ? { left: '60px', width: '960px', top: '300px' } : { left: '110px', width: Math.max(420, FX - 190) + 'px' });
    const ttW = splitWords($('.tt', title)), sbW = v.sub ? splitWords($('.sb', title)) : [];
    const persp = h(`<div class="nx-persp" style="left:${FX}px;top:${FY}px;width:${FW}px;height:${FH}px"></div>`);
    root.appendChild(persp);
    const VW = FW, VH = FH - BAR;
    const frame = h(`<div class="nx-frame" style="width:${FW}px;height:${FH}px"><div class="tb"><i></i><i></i><i></i><div class="url">🔒 <b>Privasimu Nexus</b> · ${esc(v.label || '')}</div></div>
      <div class="vp" style="height:${VH}px"><div class="lay" style="width:${iw}px;height:${ih}px"><img src="${v.src}" width="${iw}" height="${ih}" style="width:${iw}px;height:${ih}px" alt=""></div></div></div>`);
    persp.appendChild(frame);
    const vp = $('.vp', frame), lay = $('.lay', frame);
    const cams = (pk(v.cam) || [{ at: 0, x: 0, y: 0, w: vw }]).map((c) => ({ ...c, t: T(c.at, 0) }));
    const marks = (v.marks || []).map((m) => {
      const [c, g, cc] = TONE[m.tone || 'blue'];
      const e = h(`<div class="nx-mark" style="--c:${c};--g:${g}"></div>`);
      vp.appendChild(e);
      const chip = m.label ? h(`<div class="nx-chip" style="--c:${cc}">${rich(m.label)}</div>`) : null;
      if (chip) vp.appendChild(chip);
      return { e, chip, m, t: T(m.at, 0), t1: m.to != null ? T(m.to, 99) : 99 };
    });
    const camAt = (lt) => {
      const c0 = cams[0], s0 = VW / c0.w;
      let st = { s: s0, x: -c0.x * s0, y: -c0.y * s0 };
      for (let i = 1; i < cams.length; i++) {
        const c = cams[i], k = E.io3(P(lt, c.t, c.t + (c.dur || 1.0)));
        if (k <= 0) break;
        const sb = VW / c.w;
        st = { s: lerp(st.s, sb, k), x: lerp(st.x, -c.x * sb, k), y: lerp(st.y, -c.y * sb, k) };
      }
      return st;
    };
    const tTitle = T(v.titleAt, 0.15);
    return (lt, d) => {
      // judul
      if (!V && !title._y && title.offsetHeight) title._y = (SH - title.offsetHeight) / 2;
      if (!V && title._y) title.style.top = title._y + 'px';
      revealWords(ttW, tTitle, lt, { stagger: 0.06, dur: 0.6, dist: 0.35, blur: 10 });
      revealWords(sbW, tTitle + 0.5, lt, { stagger: 0.03, dur: 0.5, dist: 0.2, blur: 6 });
      const eb = $('.eb', title);
      if (eb) tf(eb, { x: (1 - E.out3(P(lt, tTitle - 0.1, tTitle + 0.4))) * -30, o: P(lt, tTitle - 0.1, tTitle + 0.3) });
      // bingkai: masuk miring 3D lalu mendatar, melayang halus
      const ke = E.out3(P(lt, 0.05, 1.0));
      const ry = pick(lerp(-16, -4, ke) + Math.sin(lt * 0.5) * 1.2, 0), rx = pick(lerp(8, 2, ke), lerp(12, 3, ke) + Math.sin(lt * 0.6) * 1);
      frame.style.transform = `translateY(${(1 - ke) * 90 + float(lt, 1, 5, 0.7)}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${lerp(0.9, 1, ke)})`;
      frame.style.opacity = cl(ke * 1.6);
      // kamera
      const cur = camAt(lt);
      lay.style.transform = `translate(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px) scale(${cur.s.toFixed(4)})`;
      // sorotan + label
      marks.forEach(({ e, chip, m, t, t1 }) => {
        const k = P(lt, t, t + 0.4), ko = P(lt, t1, t1 + 0.3);
        if (k <= 0 || ko >= 1) { e.style.opacity = 0; if (chip) chip.style.opacity = 0; return; }
        const x = m.r[0] * cur.s + cur.x, y = m.r[1] * cur.s + cur.y, w = m.r[2] * cur.s, hh = m.r[3] * cur.s, pad = 8;
        Object.assign(e.style, { left: x - pad + 'px', top: y - pad + 'px', width: w + pad * 2 + 'px', height: hh + pad * 2 + 'px' });
        e.style.opacity = cl(k * 2) * (1 - ko);
        e.style.transform = `scale(${lerp(1.12, 1, E.outBack(k))})`;
        if (chip) {
          if (!chip._w && chip.offsetWidth) { chip._w = chip.offsetWidth; chip._h = chip.offsetHeight; }
          const cw = chip._w || 200, chh = chip._h || 44;
          let cx = Math.min(Math.max(10, x - pad), VW - cw - 10), cy = (m.side === 'bottom' || y - pad - chh - 12 < 8) ? y + hh + pad + 12 : y - pad - chh - 12;
          cy = Math.min(Math.max(8, cy), VH - chh - 8);
          place(chip, cx, cy);
          const kc = popK(lt, t + 0.15, 0.4);
          tf(chip, { s: kc, y: (1 - Math.min(1, kc)) * 10, o: cl(kc * 3) * (1 - ko) });
        }
      });
    };
  });

  // ---------------- nx_cta ----------------
  // v: { tag, tagAt, sub, subAt, btn, btnAt, chips: [], foot }
  KIT.registerType('nx_cta', (root, v, sc, tm, T) => {
    const top = pick(215, 470);
    const box = h(`<div class="nx-cta" style="top:${top}px">
      <div class="logo-w"><img class="logo" src="../assets/privasimu_logo.png" style="width:${pick(520, 640)}px" alt=""></div><div class="nx">NEXUS</div>
      <div class="tag" style="margin-top:${pick(46, 60)}px">${rich(v.tag)}</div>${v.sub ? `<div class="sub" style="margin-top:18px">${rich(v.sub)}</div>` : ''}
      <div style="margin-top:${pick(40, 56)}px"><span class="nx-btn">${esc(v.btn || 'privasimu.com')}<i class="shine"></i></span></div>
      ${v.chips ? `<div class="nx-chips" style="margin-top:34px">${v.chips.map((c) => `<span>${c.replace('gratis', '<b>gratis</b>')}</span>`).join('')}</div>` : ''}
      <div class="nx-foot" style="margin-top:28px">${esc(v.foot || '')}</div></div>`);
    root.appendChild(box);
    const logo = $('.logo-w', box), nx = $('.nx', box), tag = $('.tag', box), sub = $('.sub', box), btn = $('.nx-btn', box), chips = $('.nx-chips', box), foot = $('.nx-foot', box);
    const tagW = splitWords(tag), subW = sub ? splitWords(sub) : [];
    const tTag = T(v.tagAt, 0.8), tSub = T(v.subAt, tTag + 0.6), tBtn = T(v.btnAt, tSub + 0.8);
    const fade = h('<div style="position:absolute;inset:0;background:#fff;opacity:0"></div>');
    root.appendChild(fade);
    return (lt, d) => {
      const kl = E.out3(P(lt, 0, 0.8));
      tf(logo, { s: lerp(1.15, 1, kl), o: kl, blur: (1 - kl) * 10 });
      const kn = E.out3(P(lt, 0.3, 0.9));
      nx.style.letterSpacing = lerp(1.2, 0.6, kn) + 'em'; tf(nx, { o: kn });
      revealWords(tagW, tTag, lt, { stagger: 0.07, dur: 0.6 });
      revealWords(subW, tSub, lt, { stagger: 0.04, dur: 0.5 });
      const kb = popK(lt, tBtn, 0.5);
      tf(btn, { s: 0.6 + 0.4 * kb, o: cl(kb * 2) });
      $('.shine', btn).style.left = lerp(-120, 700, P((lt - tBtn - 0.5) % 2.4, 0, 0.9)) + 'px';
      if (chips) tf(chips, { y: (1 - E.out3(P(lt, tBtn + 0.3, tBtn + 0.8))) * 20, o: E.out3(P(lt, tBtn + 0.3, tBtn + 0.8)) });
      tf(foot, { o: E.out3(P(lt, tBtn + 0.5, tBtn + 1.0)) });
      fade.style.opacity = P(lt, d - 0.35, d - 0.02);
    };
  });

  window.SERI = { init, popK, place, pk, TONE };
})();
