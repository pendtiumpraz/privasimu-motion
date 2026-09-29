// Gaya T01 · STOMP: kartu tipografi berganti keras di tiap ketukan, pita label miring, screenshot ASLI menghantam,
// kilat di tiap clap, denyut kamera mengikuti pola stomp global (sama dengan music.js). Semua gerak deterministik.
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BEAT = PRV.BEAT;
  const COL = { k: '#07080F', w: '#FFFFFF', y: '#FFE14D', b: '#2F6BFF', r: '#FF3B3B', n: '#0B1B4D', v: '#6D4CFF' };
  const FG = { k: '#FFFFFF', w: '#07080F', y: '#07080F', b: '#FFFFFF', r: '#FFFFFF', n: '#FFFFFF', v: '#FFFFFF' };
  const ACC = { k: 'y', w: 'b', y: 'k', b: 'y', r: 'k', n: 'y', v: 'y' }; // warna pita per latar
  const LOGO = '../assets/privasimu_logo.png';
  document.body.insertAdjacentHTML('beforeend', '<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">😵🗂️💬</div>');

  // ---------- denyut ketukan global ----------
  const HITS = [0, 0.5, 1, 2, 2.5, 3];
  function sinceHit(t) {
    const bp = t / BEAT + 1e-6, inBar = bp - Math.floor(bp / 4) * 4;
    let last = 0;
    for (const x of HITS) if (x <= inBar) last = x;
    return (inBar - last) * BEAT;
  }
  // ukur sekali (font sudah dimuat saat render pertama): skala font agar lebar <= maxW dan ukuran <= maxFont
  function fit(el, maxW, maxFont) {
    el.style.fontSize = '100px';
    const w = el.offsetWidth || 1;
    el.style.fontSize = (100 * Math.min(maxW / w, maxFont / 100)).toFixed(1) + 'px';
  }
  const place = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };

  // ---------- watermark kecil (hilang saat logo besar tampil) ----------
  let WM = null;
  KIT.style({
    fonts: ['400 100px Anton', '800 30px "Plus Jakarta Sans"'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = COL.k; cx.fillRect(0, 0, W, H); },
    frame: (id) => {
      if (!WM) { WM = h(`<img id="st-wm" src="${LOGO}" alt="">`); $('#stage').insertBefore(WM, $('#grain')); }
      WM.style.opacity = id === 's5' || id === 's7' ? 0 : 0.9;
    },
  });

  // ---------- dekorasi ----------
  function deco(c, card) {
    const d = c.deco || '';
    if (d === 'marquee' && c.big) {
      const rows = Array.from({ length: V ? 7 : 5 }, (_, i) => h(`<div class="st-mq" style="top:${(i + 0.1) * (SH / (V ? 7 : 5))}px">${(esc(c.big) + ' · ').repeat(14)}</div>`));
      rows.forEach((r) => card.appendChild(r));
      return (u, t) => rows.forEach((r, i) => { r.style.transform = `translateX(${(i % 2 ? -1 : 1) * ((t * 160) % 900) - 900}px)`; });
    }
    if (d === 'grid') {
      const g = h(`<div class="st-grid"><div class="hd">${'ABCDEFGHIJKL'.split('').map((x) => `<i>${x}</i>`).join('')}</div>
        ${['#REF!', '#N/A', '#VALUE!', 'FINAL_v3', '#REF!', '???'].map((x, i) => `<b style="left:${8 + 15 * i}%;top:${18 + ((i * 37) % 60)}%">${x}</b>`).join('')}</div>`);
      card.appendChild(g);
      const errs = [...g.querySelectorAll('b')];
      return (u) => errs.forEach((e, i) => tf(e, { s: MG.E.outBack(P(u, i * 0.04, i * 0.04 + 0.2)), r: (hash(i + 3) - 0.5) * 16 }));
    }
    if (d === 'chat') {
      const box = h(`<div class="st-chat">${[['Grup Kepatuhan', '99+'], ['Tim Legal & IT', '47'], ['Semua Divisi', '128']].map(([n, c2]) => `<div class="pill">💬 <span>${esc(n)}</span><b>${c2}</b></div>`).join('')}</div>`);
      card.appendChild(box);
      const ps = [...box.children];
      return (u) => ps.forEach((p, i) => tf(p, { x: (1 - E.outExpo(P(u, i * 0.05, i * 0.05 + 0.2))) * 500, o: P(u, i * 0.05, i * 0.05 + 0.05) }));
    }
    if (d.startsWith('emo:')) {
      const e = h(`<div class="st-emo2">${d.slice(4)}</div>`);
      card.appendChild(e);
      return (u, t) => tf(e, { s: E.outBack(P(u, 0, 0.3)), r: Math.sin(t * 7) * 8 });
    }
    if (d === 'rays') {
      const r = h('<div class="st-rays"></div>');
      card.appendChild(r);
      return (u, t) => { r.style.transform = `translate(-50%,-50%) rotate(${t * 18}deg)`; };
    }
    return null;
  }

  // ---------- kartu ----------
  function buildCard(c, prev, root) {
    const bg = COL[c.bg] || c.bg || COL.k, fg = FG[c.bg] || '#fff', acc = COL[ACC[c.bg] || 'y'];
    const card = h(`<div class="st-card" style="background:${bg};color:${fg};--fg:${fg};--acc:${acc};--accfg:${FG[ACC[c.bg] || 'y']}"></div>`);
    root.appendChild(card);
    const R = { card, c, fitted: false };
    R.deco = deco(c, card);
    const inn = h('<div class="st-in"></div>');
    card.appendChild(inn);
    R.inn = inn;
    if (c.num) { R.num = h(`<div class="st-num">${esc(c.num)}</div>`); inn.appendChild(R.num); }
    if (c.big) {
      R.bigBox = h(`<div class="st-bigbox">${c.kick ? `<div class="st-kick">${esc(c.kick)}</div>` : ''}<div class="st-big">${esc(c.big)}</div>${c.sub ? `<div class="st-sub">${esc(c.sub)}</div>` : ''}</div>`);
      inn.appendChild(R.bigBox);
      R.big = $('.st-big', R.bigBox); R.kick = $('.st-kick', R.bigBox); R.sub = $('.st-sub', R.bigBox);
    }
    if (c.emoji) { R.emo = h(`<div class="st-emo">${c.emoji}</div>`); inn.appendChild(R.emo); }
    if (c.logo) {
      R.logo = h(`<div class="st-logo"><img src="${LOGO}" alt=""><div class="nx">NEXUS</div></div>`);
      inn.appendChild(R.logo);
    }
    if (c.word) { R.band = h(`<div class="st-band"><span>${esc(c.word)}</span></div>`); card.appendChild(R.band); R.bandTx = $('span', R.band); }
    if (c.shot) {
      const [, , cw, ch] = c.shot.crop, W = pick(1180, 960);
      R.shot = h(`<div class="st-shot" style="width:${W}px"><div class="lb">${esc(c.shot.label)}</div><div class="vp" style="height:${(W * ch / cw).toFixed(0)}px"><img src="${c.shot.src}" alt=""></div>${c.tag ? `<div class="st-tag">${esc(c.tag)}</div>` : ''}</div>`);
      card.appendChild(R.shot);
      R.shotW = W; R.tag = $('.st-tag', R.shot);
    }
    if (c.chips && !c.ticker) {
      R.chips = c.chips.map((x, i) => { const el = h(`<div class="st-chip">${esc(x)}</div>`); card.appendChild(el); return el; });
    }
    if (c.ticker) {
      R.ticker = h(`<div class="st-ticker"><div>${(c.chips.map(esc).join('  ·  ') + '  ·  ').repeat(4)}</div></div>`);
      card.appendChild(R.ticker);
    }
    const fl = c.fx === 'flash';
    if (fl) { R.flash = h(`<div class="st-flash" style="background:${c.bg === 'w' || c.bg === 'y' ? COL.k : '#fff'}"></div>`); card.appendChild(R.flash); }
    // yang sudah ada di kartu sebelumnya tidak dianimasikan ulang (hanya elemen baru yang menghantam)
    R.newNum = c.num && (!prev || prev.num !== c.num);
    R.newBand = c.word && (!prev || prev.word !== c.word);
    R.newBig = c.big && (!prev || prev.big !== c.big || prev.kick !== c.kick);
    R.newShot = c.shot && (!prev || !prev.shot || prev.shot.src !== c.shot.src);
    R.newTag = c.tag && (!prev || prev.tag !== c.tag);
    return R;
  }

  function doFit(R) {
    if (R.fitted) return;
    R.fitted = true;
    if (R.num) fit(R.num, SW * pick(0.62, 0.84), pick(860, 820));
    if (R.big) {
      fit(R.big, SW * 0.88, pick(R.c.shot ? 520 : 600, R.c.shot ? 400 : 480));
      const f = parseFloat(R.big.style.fontSize);
      if (R.kick) R.kick.style.fontSize = Math.max(pick(54, 48), f * 0.26).toFixed(0) + 'px';
      if (R.sub) R.sub.style.fontSize = pick(56, 50) + 'px';
    }
    if (R.bandTx) fit(R.bandTx, SW * 0.86, pick(180, 132));
    if (R.shot) {
      const img = $('img', R.shot), [cx, cy, cw] = R.c.shot.crop, s = R.shotW / cw;
      img.style.width = (img.naturalWidth * s).toFixed(1) + 'px';
      img.style.transform = `translate(${-cx * s}px, ${-cy * s}px)`;
    }
  }

  // hantaman masuk untuk elemen baru; u = detik sejak kartu mulai
  function enter(el, fx, u, i) {
    if (!el) return;
    if (fx === 'cut' || fx === 'hold') { el.style.transform = fx === 'hold' ? `scale(${1 + u * 0.02})` : ''; el.style.filter = ''; return; }
    if (fx === 'slideL' || fx === 'slideR') {
      const k = E.outExpo(P(u, 0, 0.16)), dir = fx === 'slideL' ? -1 : 1;
      el.style.transform = `translateX(${(1 - k) * dir * SW * 0.7}px) skewX(${(1 - k) * dir * -14}deg)`;
      el.style.filter = k < 0.98 ? `blur(${((1 - k) * 12).toFixed(1)}px)` : '';
      return;
    }
    if (fx === 'zoom') {
      const k = E.outExpo(P(u, 0, 0.3));
      el.style.transform = `scale(${lerp(2.2, 1, k) * (1 + u * 0.03)})`;
      el.style.filter = k < 0.98 ? `blur(${((1 - k) * 10).toFixed(1)}px)` : '';
      return;
    }
    const k = E.outExpo(P(u, 0, fx === 'flash' ? 0.12 : 0.16)), s0 = fx === 'flash' ? 1.14 : 1.36;
    el.style.transform = `scale(${lerp(s0, 1, k)}) rotate(${((hash(i + 0.5) - 0.5) * 6 * (1 - k)).toFixed(2)}deg)`;
    el.style.filter = k < 0.95 && i > 0 ? `blur(${((1 - k) * 6).toFixed(1)}px)` : '';
  }

  KIT.registerType('stomp', (root, v, sc, tm, T) => {
    const cards = [];
    v.cards.forEach((c, i) => cards.push(Object.assign(buildCard(c, v.cards[i - 1], root), { t0: c.at != null ? T(c.at, 0) : c.b * BEAT, i })));
    const pulseEnd = v.pulse === true ? 1e9 : typeof v.pulse === 'number' ? v.pulse * BEAT : -1;
    return (lt) => {
      let k = 0;
      cards.forEach((R, i) => { if (lt >= R.t0 - 1e-6) k = i; });
      cards.forEach((R, i) => { R.card.style.display = i === k ? 'block' : 'none'; });
      const R = cards[k], c = R.c, u = lt - R.t0, t = sc.start + lt;
      doFit(R);
      const fx = c.fx || 'punch';
      if (R.newNum) enter(R.num, fx, u, R.i); else if (R.num) enter(R.num, 'cut', u, R.i);
      if (R.bigBox) {
        if (R.newBig) enter(R.bigBox, fx, u, R.i); else enter(R.bigBox, c.fx === 'hold' ? 'hold' : 'cut', u, R.i);
        R.bigBox.style.opacity = c.shot ? 0.22 : 1;
        if (R.sub) tf(R.sub, { y: (1 - E.outExpo(P(u, 0, 0.25))) * 40, o: P(u, 0, 0.12) });
      }
      if (R.emo) tf(R.emo, { s: E.outBack(P(u, 0, 0.3)), r: Math.sin(t * 6) * 6 });
      if (R.logo) { const kl = E.outExpo(P(u, 0, 0.25)); tf(R.logo, { s: c.fx === 'cut' ? 1 : lerp(1.4, 1, kl) }); }
      if (R.band) {
        const kb = R.newBand ? E.outExpo(P(u, 0, 0.14)) : 1;
        R.band.style.transform = `translateY(-50%) rotate(-4deg) translateX(${((1 - kb) * (R.i % 2 ? 1 : -1) * SW).toFixed(0)}px)`;
      }
      if (R.shot) {
        const ks = R.newShot ? E.outExpo(P(u, 0, 0.14)) : 1;
        R.shot.style.transform = `translate(-50%, -50%) rotate(${lerp(-9, -2.5, ks)}deg) scale(${lerp(1.7, 1, ks)})`;
        R.shot.style.filter = ks < 0.95 ? `blur(${((1 - ks) * 8).toFixed(1)}px)` : '';
        if (R.tag) tf(R.tag, { s: R.newTag ? E.outBack(P(u, 0, 0.22)) : 1 });
      }
      if (R.chips) {
        R.chips.forEach((el, i) => {
          const a = (i / R.chips.length) * Math.PI * 2 + 0.3, rad = pick(620, 440) * (0.78 + 0.35 * hash(i + 7));
          let x = Math.cos(a) * rad * pick(1.25, 0.95), y = Math.sin(a) * rad * pick(0.62, 1.25), s = E.outBack(P(u, i * 0.02, i * 0.02 + 0.25)), o = 1;
          if (c.converge) { const kc = E.in3(P(u, 0, 0.3)); x *= 1 - kc; y *= 1 - kc; s = 1 - kc; o = 1 - kc; }
          el.style.transform = `translate(-50%, -50%) translate(${(SW / 2 + x).toFixed(0)}px, ${(SH / 2 + y).toFixed(0)}px) scale(${s.toFixed(3)})`;
          el.style.opacity = o;
        });
      }
      if (R.ticker) $('div', R.ticker).style.transform = `translateX(${-((u * 260) % 2000)}px)`;
      if (R.deco) R.deco(u, t);
      if (R.flash) R.flash.style.opacity = 0.85 * (1 - P(u, 0, 0.16));
      // denyut kamera di tiap hentakan pola (termasuk yang tidak mengganti kartu)
      if (lt < pulseEnd) {
        const dh = sinceHit(t), p = Math.exp(-dh * 20);
        R.card.style.transform = `scale(${(1 + 0.045 * p).toFixed(4)}) translate(${((hash(Math.floor(t * 60)) - 0.5) * 14 * p).toFixed(1)}px, ${((hash(Math.floor(t * 60) + 9) - 0.5) * 14 * p).toFixed(1)}px)`;
      } else R.card.style.transform = '';
    };
  });

  // ---------- CTA ----------
  KIT.registerType('stomp_cta', (root, v, sc, tm, T) => {
    const card = h(`<div class="st-card st-cta" style="display:block;background:${COL.n};color:#fff"><div class="st-rays"></div></div>`);
    root.appendChild(card);
    const box = h(`<div class="st-ctabox">
      <div class="st-logo"><img src="${LOGO}" alt=""><div class="nx">NEXUS</div></div>
      <div class="l1">SATU PLATFORM</div><div class="l2">UNTUK SEMUA KEWAJIBAN UU PDP</div>
      <div class="btn">privasimu.com</div>
      <div class="chips"><span class="y">Start Pre Check · gratis</span><span>Schedule Demo</span></div>
      <div class="foot">support@privasimu.com · 0851 8318 2722</div></div>`);
    card.appendChild(box);
    const flash = h('<div class="st-flash" style="background:#fff"></div>'), fade = h(`<div class="st-flash" style="background:${COL.k}"></div>`);
    card.appendChild(flash); card.appendChild(fade);
    const rays = $('.st-rays', card), logo = $('.st-logo', box), l1 = $('.l1', box), l2 = $('.l2', box), btn = $('.btn', box), chips = $('.chips', box), foot = $('.foot', box);
    const tL1 = T(v.lineAt, 1.3), tL2 = T(v.line2At, 2.2), tB = T(v.btnAt, 4), tU = T(v.urlAt, 5.5);
    let voEnd = sc.dur - 3;
    try { voEnd = window.wordTime(sc, 'w:com') + 0.3; } catch (e) { /* perkiraan */ }
    const stop = Math.min(sc.dur - 2.8, Math.ceil(voEnd / (BEAT / 2)) * (BEAT / 2)); // sama dengan music.js
    let fitted = false;
    return (lt, d) => {
      if (!fitted) { fitted = true; fit(l1, pick(1500, 960), pick(190, 150)); fit(l2, pick(1500, 960), pick(96, 70)); }
      const t = sc.start + lt;
      rays.style.transform = `translate(-50%,-50%) rotate(${t * 14}deg)`;
      tf(logo, { s: lerp(1.5, 1, E.outExpo(P(lt, 0, 0.25))) });
      for (const [el, at] of [[l1, tL1], [l2, tL2]]) { const k = E.outExpo(P(lt, at - 0.02, at + 0.14)); el.style.transform = `scale(${lerp(1.5, 1, k)})`; el.style.opacity = k > 0 ? 1 : 0; el.style.filter = k > 0 && k < 0.95 ? `blur(${((1 - k) * 6).toFixed(1)}px)` : ''; }
      const kb = E.outBack(P(lt, tB, tB + 0.3));
      tf(btn, { s: kb * (1 + 0.08 * Math.exp(-Math.max(0, lt - tU) * 6) * (lt > tU ? 1 : 0)), o: cl(kb * 3) });
      tf(chips, { y: (1 - E.outExpo(P(lt, tB + 0.25, tB + 0.5))) * 30, o: P(lt, tB + 0.25, tB + 0.4) });
      tf(foot, { o: P(lt, tB + 0.5, tB + 0.8) });
      // denyut ketukan selama groove; hentakan akhir (stomp-stomp-clap) lalu diam
      const dh = lt < stop ? sinceHit(t) : lt < stop + BEAT * 1.2 ? (lt - stop) % (BEAT / 2) : 9;
      const p = Math.exp(-dh * 18) * (lt < stop ? 0.6 : 1);
      box.style.transform = `translate(-50%, -50%) scale(${(1 + 0.04 * p).toFixed(4)})`;
      flash.style.opacity = 0.9 * (1 - P(lt, 0, 0.16)) + (lt >= stop + BEAT ? 0.6 * (1 - P(lt, stop + BEAT, stop + BEAT + 0.2)) : 0);
      fade.style.opacity = P(lt, d - 0.45, d - 0.02);
    };
  });
})();
