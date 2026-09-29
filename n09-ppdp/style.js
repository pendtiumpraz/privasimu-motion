// N09 · PPDP Baru — gaya ARCADE / RPG QUEST 8-bit. Semua sprite piksel & elemen game orisinal (SVG buatan sendiri).
// Layar aplikasi = screenshot ASLI (../assets/app/*.png) di dalam monitor piksel. Deterministik: semua gerak dihitung dari `lt`.
(function () {
  const { V, SW, SH, h, esc } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const pk = (a, b) => (V ? b : a);
  const snap = (v, g = 2) => Math.round(v / g) * g;
  const qz = (t, fps = 12) => Math.floor(t * fps) / fps;
  const blink = (t, hz = 2, duty = 0.5) => (((t * hz) % 1) + 1) % 1 < duty;
  const pop = (k) => Math.max(0, E.outBack(cl(k)));
  const APP = '../assets/app/';
  const LOGO = '../assets/privasimu_logo.png';
  const $ = (s, r) => r.querySelector(s);
  const $$ = (s, r) => [...r.querySelectorAll(s)];
  const put = (el, x, y, w, hh) => { el.style.left = x + 'px'; el.style.top = y + 'px'; if (w != null) el.style.width = w + 'px'; if (hh != null) el.style.height = hh + 'px'; };

  // ---------- sprite piksel (orisinal) ----------
  const PAL = {
    k: '#150b2e', w: '#f7f3ff', x: '#ffffff', s: '#f6c197', c: '#ff9bb0', h: '#3b2417', H: '#6b4630', e: '#150b2e', m: '#d9546e',
    b: '#3d6bff', B: '#2447b8', y: '#ffd23f', Y: '#d99a00', r: '#ff4d6d', p: '#2b2155', o: '#0f0822',
    j: '#2fd3c0', i: '#8ff5e8', t: '#8b5cf6', T: '#6334d1', n: '#b07442', N: '#7a4a1c', g: '#35d07f', G: '#239a5c', d: '#2a2350',
    a: '#a3abc2', A: '#6b7390', q: '#10224a', Q: '#5ce1ff', l: '#c8f6ff', u: '#cfc6ff', U: '#9d90e6', M: '#4dffa6', v: '#3a2a66',
  };
  const BODY = ['..kbwsswbk..', '.kbbrwwrbbk.', '.kbbbyybbbk.', '.ksbbyybbsk.', '..kBBBBBBk..', '..kppkkppk..', '.kook..kook.'];
  const SPR = {
    // PPDP (tokoh utama): rambut samping, kalung ID kuning
    hero: ['...kkkkkk...', '..khhhhhhk..', '.khhhHHhhhk.', '.khhhhhhhhk.', '.khssssshhk.', '.khsssssshk.', '.khsesseshk.', '.khcsssschk.', '..kssmmssk..', ...BODY],
    // konsultan: kerudung toska, kacamata bulat, papan klip
    kons: ['...kkkkkk...', '..kjjjjjjk..', '.kjjjiijjjk.', '.kjjjjjjjjk.', '.kjjssssjjk.', '.kjssssssjk.', '.kjAeAAeAjk.', '.kjcsssscjk.', '.kjjsmmsjjk.',
      '..kjjjjjjk..', '.kttjjjjttk.', '.ktnwwwwntk.', '.ksnwkkwnsk.', '..knnnnnnk..', '..kTTTTTTk..', '.kook..kook.'],
    // tim IT: headset, hoodie hijau, laptop
    it: ['...kkkkkk...', '..kaaaaaak..', '.kaddddddak.', '.kddddddddk.', '.AdssssssdA.', '.AssessessA.', '.kscsssscak.', '..kssmmaak..', '.kgGggggGgk.',
      '.kggwggwggk.', '.kggggggggk.', '.kgaaaaaagk.', '.ksaQQQQask.', '..kAAAAAAk..', '..kppkkppk..', '.kook..kook.'],
    // Priva (asisten AI): robot kecil
    bot: ['.....yy.....', '.....kk.....', '...kkkkkk...', '..kwwwwwwk..', '.kwqqqqqqwk.', '.kwqQqqQqwk.', '.kwqQqqQqwk.', '.kwqqQQqqwk.',
      '..kwwwwwwk..', '...kkkkkk...', '..kuuuuuuk..', '.kuuQuuQuuk.', '..kUUUUUUk..', '...kk..kk...'],
    heart: ['.rr.rr.', 'rxrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'],
    heart0: ['.vv.vv.', 'vvvvvvv', 'vvvvvvv', '.vvvvv.', '..vvv..', '...v...'],
    coin: ['..kkkk..', '.kyyyyk.', 'kyxyyYyk', 'kyxyyYyk', 'kyxyyYyk', 'kyyyyYyk', '.kyYYyk.', '..kkkk..'],
    trophy: ['kkkkkkkkkk', 'kyxyyyyyYk', 'kyxyywyyYk', '.kyyyyyYk.', '..kyyyYk..', '...kyYk...', '....kk....', '...kyYk...', '..kYYYYk..', '..kkkkkk..'],
    cursor: ['k.......', 'kk......', 'kwk.....', 'kwwk....', 'kwwwk...', 'kwwwwk..', 'kwwwwwk.', 'kwwwkkkk', 'kwkwk...', 'kk.kwk..', 'k...kk..'],
    spark: ['..y..', '..y..', 'yyxyy', '..y..', '..y..'],
    sparkC: ['..Q..', '..Q..', 'QQxQQ', '..Q..', '..Q..'],
    chart: ['w.........', 'w......yy.', 'w......yy.', 'w...MM.yy.', 'w...MM.yy.', 'w.QQMM.yy.', 'w.QQMM.yy.', 'w.QQMM.yy.', 'w.QQMM.yy.', 'wwwwwwwwww'],
    list: ['...kyyk...', '.kkkyykkk.', '.kwwwwwwk.', '.kwMwkkwk.', '.kwwwwwwk.', '.kwMwkkwk.', '.kwwwwwwk.', '.kwrwkkwk.', '.kwwwwwwk.', '.kkkkkkkk.'],
    seal: ['..kkkkkk..', '.kyyyyyyk.', 'kyyxyyyyYk', 'kyxyyyyyYk', 'kyyyyyyyYk', 'kyyyyyyyYk', '.kyyyyyYk.', '..kkkkkk..', '..krk.krk.', '.krk...krk', '.kk.....kk'],
    tri: ['y....', 'yy...', 'yyy..', 'yyyy.', 'yyy..', 'yy...', 'y....'],
    triD: ['yyyyyyy', '.yyyyy.', '..yyy..', '...y...'],
    check: ['......M', '.....MM', 'M...MM.', 'MM.MM..', '.MMM...', '..M....'],
    checkD: ['......k', '.....kk', 'k...kk.', 'kk.kk..', '.kkk...', '..k....'],
    desk: ['..kkkkkkkkkkkkkk..', '..kQQQQQQQQQQQQk..', '..kQlQQQQQQQQQQk..', '..kQQMMMMQQQQQQk..', '..kQQQQQQQyyQQQk..', '..kQQMMMQQQQQQQk..',
      '..kkkkkkkkkkkkkk..', '.......kAAk.......', '.....kkAAAAkk.....', 'kkkkkkkkkkkkkkkkkk', 'knnnnnnnnnnnnnnnnk', 'kNNNNNNNNNNNNNNNNk', '.kN............Nk.', '.kN............Nk.'],
  };
  SPR.heroQ = SPR.hero.map((r, i) => (i === 3 || i === 4 ? r.slice(0, 11) + 'l' : i === 8 ? '..ksskkssk..' : r)); // bingung: mulut "o" + keringat
  const RECTS = {};
  function spr(name, px, cls = '') {
    const m = SPR[name], W = m[0].length, H = m.length;
    if (!RECTS[name]) {
      let r = '';
      m.forEach((row, y) => {
        if (row.length !== W) console.warn('sprite', name, 'baris', y, 'lebar', row.length, '!=', W);
        for (let x = 0; x < W;) {
          const ch = row[x];
          let x2 = x + 1;
          while (x2 < W && row[x2] === ch) x2++;
          if (ch !== '.' && PAL[ch]) r += `<rect x="${x}" y="${y}" width="${x2 - x}" height="1" fill="${PAL[ch]}"/>`;
          x = x2;
        }
      });
      RECTS[name] = r;
    }
    return `<svg class="spr ${cls}" width="${W * px}" height="${H * px}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">${RECTS[name]}</svg>`;
  }

  // ---------- helper UI ----------
  // jendela piksel: `inner` di .in (terpotong sudut), `outer` di luar bingkai (mis. tab nama)
  const win = (cls, inner, outer = '') => h(`<div class="pw ${cls}"><div class="sh"></div><div class="bd"><div class="in">${inner}</div></div>${outer}</div>`);

  // Ketik per huruf; tiap kata mulai tepat di waktu kata VO-nya (times[i]). `*kata*` = aksen emas.
  function typer(el, text, times, cps = 42) {
    el.innerHTML = '';
    const chars = [];
    let t = times.find((x) => x != null) ?? 0;
    text.split(' ').forEach((w0, i, arr) => {
      const acc = w0.includes('*'), w = w0.replace(/\*/g, '');
      const wd = document.createElement('span');
      wd.className = 'wd' + (acc ? ' acc' : '');
      if (times[i] != null) t = Math.max(t, times[i]);
      [...w].forEach((c) => { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; wd.appendChild(s); chars.push({ s, t }); t += 1 / cps; });
      el.appendChild(wd);
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      t += 0.03;
    });
    return (lt) => { let n = 0; chars.forEach((c) => { const on = lt >= c.t; c.s.style.opacity = on ? 1 : 0; if (on) n++; }); return n / chars.length; };
  }

  // kilau piksel berkedip (stop-motion 10 fps)
  function sparkles(root, n, box, seed = 1, px = 6, name = 'spark') {
    const els = Array.from({ length: n }, (_, i) => {
      const el = h(`<div class="spk">${spr(i % 3 === 2 ? 'sparkC' : name, px)}</div>`);
      root.appendChild(el);
      put(el, snap(box.x + hash(seed * 13.1 + i * 7.3) * box.w, px), snap(box.y + hash(seed * 29.7 + i * 3.9) * box.h, px));
      return { el, ph: hash(seed * 5.3 + i * 1.9), sp: 0.7 + hash(seed * 3.3 + i * 2.7) * 0.8 };
    });
    return (lt, amt = 1) => els.forEach((s) => {
      const k = (((qz(lt, 10) * s.sp + s.ph) % 1.3) + 1.3) % 1.3;
      const sc = k < 0.1 ? 0.5 : k < 0.24 ? 1 : k < 0.34 ? 0.5 : 0;
      s.el.style.opacity = amt > 0.01 && sc > 0 ? Math.min(1, amt) : 0;
      s.el.style.transform = `translate(-50%, -50%) scale(${sc})`;
    });
  }

  // semburan kilau dari satu titik (sekali)
  function burst(root, n, cx, cy, seed = 2, rad = 260) {
    const els = Array.from({ length: n }, (_, i) => {
      const el = h(`<div class="spk">${spr(i % 2 ? 'sparkC' : 'spark', 6)}</div>`);
      root.appendChild(el);
      const a = (i / n) * Math.PI * 2 + hash(seed + i) * 0.5;
      return { el, a, r: rad * (0.6 + hash(seed * 3 + i * 1.7) * 0.6) };
    });
    return (lt, t0) => els.forEach((p) => {
      const k = P(lt, t0, t0 + 0.9);
      if (k <= 0 || k >= 1) { p.el.style.opacity = 0; return; }
      const d = E.outExpo(qz(k, 14)) * p.r;
      put(p.el, snap(cx + Math.cos(p.a) * d, 6), snap(cy + Math.sin(p.a) * d * 0.8, 6));
      p.el.style.opacity = 1;
      p.el.style.transform = `translate(-50%, -50%) scale(${k < 0.6 ? 1 : 0.5})`;
    });
  }

  // konfeti piksel: hujan dari atas layar + semburan kecil dari (x0, y0); berayun & berputar seperti kertas (stop-motion)
  function confetti(root, n, x0, y0, seed = 3) {
    const COLS = ['#ffd23f', '#ff5fa8', '#5ce1ff', '#4dffa6', '#b8a6ff', '#ff9f43'];
    const ps = Array.from({ length: n }, (_, i) => {
      const el = document.createElement('i');
      el.className = 'cf';
      const sz = [10, 12, 16][Math.floor(hash(seed + i * 2.3) * 3)];
      Object.assign(el.style, { width: sz + 'px', height: sz + 'px', background: COLS[i % COLS.length] });
      root.appendChild(el);
      const rain = i % 3 !== 0;
      const a = Math.PI + (hash(seed * 7 + i * 1.3) < 0.5 ? 0.25 : -Math.PI - 0.25) + (hash(seed * 9 + i) - 0.5) * 0.9;
      const vel = 380 + hash(seed * 5 + i * 3.1) * 520;
      return {
        el, rain, x: hash(seed * 11 + i * 1.7) * SW, y: -30 - hash(seed * 13 + i * 2.9) * pk(420, 700), vy: 230 + hash(seed * 3 + i) * 260,
        amp: 18 + hash(i * 4.1 + seed) * 40, f: 3 + hash(i * 5.3) * 4, ph: hash(i * 6.7) * 6, vx: Math.cos(a) * vel, bvy: Math.sin(a) * vel - 120, sp: 2 + hash(i + seed) * 5,
      };
    });
    return (lt, t0) => ps.forEach((p) => {
      const t = lt - t0;
      if (t < 0 || t > 3.4) { p.el.style.opacity = 0; return; }
      let x, y;
      if (p.rain) { x = p.x + Math.sin(t * p.f + p.ph) * p.amp; y = p.y + p.vy * t + 40 * t * t; }
      else { const tt = (1 - Math.exp(-t * 2)) / 2; x = x0 + p.vx * tt; y = y0 + p.bvy * tt + 420 * t * t; }
      const fl = Math.cos(qz(t, 12) * p.sp * 3);
      p.el.style.opacity = t > 2.7 ? 1 - (t - 2.7) / 0.7 : 1;
      p.el.style.transform = `translate(${snap(x, 4)}px, ${snap(y, 4)}px) scaleY(${Math.abs(fl) < 0.35 ? 0.25 : 1})`;
    });
  }

  // Monitor piksel berisi screenshot ASLI aplikasi: layar menyala (CRT), pan/zoom ke fokus, kotak sorot berkedip, kursor piksel.
  // o = { x, y, w, on, label, shots: [{ img, at, cap, views:[{ at, cx, cy, z, dur }], box:{ x, y, w, h, at }, cursor:{ at, x, y } }] }
  function monitor(root, o, T) {
    const IW = o.w - 44, IH = Math.round(IW * 0.625);
    const el = h(`<div class="mon"><div class="bz"><div class="scr" style="width:${IW}px;height:${IH}px"><div class="cnt" style="position:absolute;inset:0"></div>
      <div class="scan"></div><div class="glare"></div><div class="roll"></div><div class="off"><div class="boot"><div class="ps">MEMUAT ${esc(o.label || 'NEXUS')}<span class="cu">_</span></div><div class="bbar">${'<i></i>'.repeat(12)}</div></div></div><div class="line"></div></div>
      <div class="plate ps"><img src="${LOGO}" alt=""><span>${esc(o.label || 'NEXUS')}</span></div><div class="led"></div></div></div>`);
    root.appendChild(el);
    put(el, o.x, o.y, o.w);
    const cnt = $('.cnt', el), off = $('.off', el), line = $('.line', el), roll = $('.roll', el), led = $('.led', el), cu = $('.boot .cu', el), bsegs = $$('.bbar i', el);
    const tOn = T(o.on, 0.5), tBoot = T(o.at, tOn - 1.2);
    const shots = o.shots.map((s, i) => {
      const wrap = h(`<div style="position:absolute;inset:0;background:${s.bg || '#070312'}"></div>`);
      const im = h(`<img src="${APP + s.img}" alt="">`);
      im.style.width = IW + 'px';
      const ph = h(`<div class="ph ps">${esc(s.img)}<br>screenshot asli</div>`);
      wrap.append(im, ph);
      const t = i === 0 ? Math.max(tOn, T(s.at, tOn)) : T(s.at, 0);
      const boxes = (s.boxes || []).map((b) => {
        const el = h('<div class="brk"><div class="bl"></div><i></i><i></i><i></i><i></i></div>');
        wrap.appendChild(el);
        return { ...b, el, t: T(b.at, t + 0.3), until: b.until != null ? T(b.until, 99) : 99 };
      });
      let cur = null, ring = null;
      if (s.cursor) { cur = h(`<div class="cursor">${spr('cursor', 5)}</div>`); ring = h(`<div class="ring">${'<i></i>'.repeat(8)}</div>`); wrap.append(ring, cur); }
      const chan = s.cap ? h(`<div class="chan ps">${esc(s.cap)}</div>`) : null;
      if (chan) wrap.appendChild(chan);
      cnt.appendChild(wrap);
      const views = (s.views || [{ cx: 0.5, cy: 0.5, z: 1 }]).map((vw) => ({ ...vw, t: T(vw.at, t) }));
      return { s, wrap, im, ph, boxes, cur, ring, chan, views, t, ct: s.cursor ? T(s.cursor.at, t + 0.8) : 0 };
    });
    const update = (lt) => {
      const kOn = P(lt, tOn, tOn + 0.34);
      off.style.opacity = lt < tOn ? 1 : 0;
      cu.style.opacity = blink(lt, 2.5) ? 1 : 0;
      const kbt = P(lt, tBoot + 0.2, tOn - 0.1);
      bsegs.forEach((sg, i) => sg.classList.toggle('on', i < Math.floor(kbt * bsegs.length + 0.001)));
      line.style.opacity = lt >= tOn ? Math.max(0, 1 - kOn * 1.6) : 0;
      cnt.style.transform = `scale(${lerp(1.08, 1, E.outExpo(kOn))}, ${lerp(0.01, 1, E.outExpo(kOn))})`;
      cnt.style.filter = kOn < 1 ? `brightness(${lerp(3, 1, kOn).toFixed(2)})` : 'none';
      let act = 0;
      shots.forEach((sh, i) => { if (lt >= sh.t) act = i; });
      let rollK = 0;
      shots.forEach((sh, i) => {
        const vis = i === act;
        sh.wrap.style.display = vis ? 'block' : 'none';
        if (!vis) return;
        if (i > 0) rollK = 1 - P(lt, sh.t, sh.t + 0.28);
        const broken = sh.im.complete && !sh.im.naturalWidth;
        sh.im.style.display = broken ? 'none' : 'block';
        sh.ph.style.display = broken ? 'grid' : 'none';
        const ar = sh.im.naturalWidth ? sh.im.naturalHeight / sh.im.naturalWidth : 0.625;
        let c = { cx: sh.views[0].cx, cy: sh.views[0].cy, z: sh.views[0].z };
        sh.views.slice(1).forEach((vw) => { const k = E.io3(P(lt, vw.t, vw.t + (vw.dur || 0.85))); c = { cx: lerp(c.cx, vw.cx, k), cy: lerp(c.cy, vw.cy, k), z: lerp(c.z, vw.z, k) }; });
        // screenshot 1x: tampil maksimal ±1,4x ukuran asli agar tetap tajam
        const zMax = sh.im.naturalWidth ? (1.4 * sh.im.naturalWidth) / IW : 9;
        const z = Math.min(zMax, c.z * (1 + 0.018 * Math.max(0, lt - sh.t)));
        const iw = IW * z, ih = iw * ar;
        let left = IW / 2 - c.cx * iw, top = IH / 2 - c.cy * ih;
        left = Math.min(0, Math.max(IW - iw, left));
        top = ih > IH ? Math.min(0, Math.max(IH - ih, top)) : (IH - ih) / 2;
        const jit = rollK > 0 ? (hash(qz(lt, 30) * 7) - 0.5) * 26 * rollK : 0;
        sh.im.style.transform = `translate(${(left + jit).toFixed(1)}px, ${top.toFixed(1)}px) scale(${z.toFixed(4)})`;
        if (sh.chan) tf(sh.chan, { x: (1 - E.out3(P(lt, sh.t + 0.1, sh.t + 0.45))) * -30, o: P(lt, sh.t + 0.1, sh.t + 0.35) });
        sh.boxes.forEach((b) => {
          const kb = P(lt, b.t, b.t + 0.32), ku = P(lt, b.until, b.until + 0.2);
          put(b.el, left + b.x * iw, top + b.y * ih, b.w * iw, b.h * ih);
          b.el.style.opacity = kb > 0 ? 1 - ku : 0;
          b.el.style.transform = `scale(${lerp(1.3, 1, E.outBack(kb))})`;
          $('.bl', b.el).style.opacity = blink(lt - b.t, 3) ? 1 : 0.15;
        });
        if (sh.cur) {
          const tx = left + sh.s.cursor.x * iw, ty = top + sh.s.cursor.y * ih;
          const km = E.io3(P(lt, sh.ct - 0.75, sh.ct));
          const x = lerp(IW * 0.92, tx, km), y = lerp(IH * 1.05, ty, km);
          const click = lt > sh.ct && lt < sh.ct + 0.14;
          put(sh.cur, snap(x, 5), snap(y, 5));
          sh.cur.style.transform = `scale(${click ? 0.82 : 1})`;
          sh.cur.style.opacity = lt > sh.ct - 0.8 ? 1 : 0;
          const kr = P(lt, sh.ct, sh.ct + 0.4);
          put(sh.ring, tx, ty);
          $$('i', sh.ring).forEach((q, j) => {
            const a = (j / 8) * Math.PI * 2, d = snap(10 + E.out3(kr) * 46, 5);
            put(q, Math.cos(a) * d - 5, Math.sin(a) * d - 5);
            q.style.opacity = kr > 0 && kr < 1 ? 1 : 0;
          });
        }
      });
      roll.style.opacity = rollK;
      led.style.opacity = lt < tOn ? 0.25 : rollK > 0 ? (blink(lt, 12) ? 1 : 0.3) : 1;
    };
    return { el, update };
  }

  // ---------- HUD global + transisi "pixel dissolve" ----------
  let G = null;
  function gInit() {
    const stage = document.getElementById('stage'), grain = document.getElementById('grain');
    const cv = document.createElement('canvas');
    cv.id = 'pxd'; cv.width = SW; cv.height = SH;
    stage.insertBefore(cv, grain);
    const slots = ['hero', 'it', 'kons', 'bot'];
    const hud = h(`<div id="hud"><div class="strip"></div>
      <div class="grp gl"><div class="face">${spr('hero', 4)}</div><div class="who"><div class="nm ps">PPDP</div><div class="lv ps">LV 1</div></div>
        <div class="hearts">${[0, 1, 2].map(() => `<span class="hr">${spr('heart0', 4)}${spr('heart', 4)}</span>`).join('')}<div class="hpop ps"></div></div></div>
      <div class="grp gc"><span class="plbl ps">PARTY</span>${slots.map((n) => `<div class="slot"><span class="em">?</span><div class="mb">${spr(n, 3)}</div></div>`).join('')}</div>
      <div class="grp gr">${spr('coin', 5)}<div class="coins ps">x <b>00000</b></div></div></div>`);
    stage.insertBefore(hud, grain);
    const TLd = window.TIMELINE, SCN = window.PRV.SCENES;
    const scOf = (id) => TLd.scenes.find((x) => x.id === id);
    const at = (id, spec, fb) => { const sc = scOf(id); return sc.start + KE.resolver(sc, window.wordTime)(spec, fb); };
    const visOf = (id) => SCN.find((s) => s.id === id).vis;
    const PTS = { coin: 100, correct: 250, levelup: 500 };
    const coins = [];
    SCN.forEach((s) => {
      const sc = scOf(s.id), R = KE.resolver(sc, window.wordTime);
      (s.sfx || []).forEach(([w, n]) => { if (PTS[n]) coins.push({ t: sc.start + R(w, 0), p: PTS[n] }); });
    });
    G = {
      cv, cx: cv.getContext('2d'), hud, coins,
      hurt: at('s1', 'w:mana', 7), heal: at('s2', 'w:Tenang', 9), lvl: at('s2', visOf('s2').levelAt, 17),
      join: [-1, at('s2', 'w:IT', 13), at('s3', 'w:mendampingi', 21), at('s4', 'w:Priva#2', 34)],
      hide: scOf('s6').start,
      el: { hpop: $('.hpop', hud), gl: $('.gl', hud), gc: $('.gc', hud), gr: $('.gr', hud), lv: $('.lv', hud), hr: $$('.hr', hud), slot: $$('.slot', hud), coins: $('.coins b', hud), strip: $('.strip', hud) },
    };
    const top = pk(20, 64);
    put(G.el.gl, pk(80, 60), top);
    put(G.el.gc, SW / 2, top + pk(3, 3));
    G.el.gr.style.right = pk(80, 60) + 'px';
    G.el.gr.style.top = top + pk(10, 10) + 'px';
  }

  function hudUpdate(t) {
    const e = G.el;
    const kin = E.out3(P(t, 0.15, 0.65)), kout = E.in3(P(t, G.hide - 0.2, G.hide + 0.25));
    G.hud.style.transform = `translateY(${snap(-pk(130, 200) * (1 - kin) - pk(150, 220) * kout, 2)}px)`;
    G.hud.style.opacity = kin * (1 - kout);
    // HP: 3 → 1 saat bingung ("mulai dari mana?"), pulih saat "Tenang."
    e.hr.forEach((hr, i) => {
      let full = true;
      if (t >= G.hurt && i > 0) full = t < G.hurt + 0.6 ? blink(t - G.hurt, 8) : false;
      if (t >= G.heal + (i - 1) * 0.16 && i > 0) full = true;
      hr.lastChild.style.opacity = full ? 1 : 0;
      const kh = i > 0 ? P(t, G.heal + (i - 1) * 0.16, G.heal + (i - 1) * 0.16 + 0.3) : 0;
      hr.style.transform = `scale(${kh > 0 && kh < 1 ? 1 + 0.5 * Math.sin(Math.PI * kh) : 1})`;
    });
    // "-2 HP" saat bingung, "+2 HP" saat tenang
    const kh1 = P(t, G.hurt, G.hurt + 1.1), kh2 = P(t, G.heal, G.heal + 1.1);
    const hp = kh2 > 0 && kh2 < 1 ? ['+2 HP', '#4dffa6', kh2] : kh1 > 0 && kh1 < 1 ? ['-2 HP', '#ff4d6d', kh1] : null;
    e.hpop.style.opacity = hp ? (hp[2] > 0.75 ? (1 - hp[2]) / 0.25 : 1) : 0;
    if (hp) { e.hpop.textContent = hp[0]; e.hpop.style.color = hp[1]; e.hpop.style.transform = `translateY(${snap(E.out3(hp[2]) * 14, 2)}px)`; }
    const lv2 = t >= G.lvl, kl = P(t, G.lvl, G.lvl + 0.4);
    e.lv.textContent = lv2 ? 'LV 2' : 'LV 1';
    e.lv.style.transform = `scale(${kl > 0 && kl < 1 ? 1 + 0.5 * Math.sin(Math.PI * kl) : 1})`;
    e.lv.style.color = kl > 0 && kl < 1 && blink(t, 10) ? '#ffffff' : '';
    e.slot.forEach((sl, i) => {
      const tj = G.join[i], on = t >= tj, kj = P(t, tj, tj + 0.35);
      sl.classList.toggle('on', on);
      sl.firstElementChild.style.opacity = on ? 0 : 1;
      tf(sl.lastElementChild, { s: on ? pop(kj) : 0, o: on ? 1 : 0 });
    });
    let sc = 0;
    G.coins.forEach((c) => { if (t >= c.t) sc += c.p * Math.min(1, (t - c.t) / 0.35); });
    e.coins.textContent = String(Math.round(sc / 10) * 10).padStart(5, '0');
  }

  function dissolve(id, lt, d) {
    const cx = G.cx, TLd = window.TIMELINE;
    const idx = TLd.scenes.findIndex((s) => s.id === id), last = idx === TLd.scenes.length - 1;
    const cin = 1 - P(lt, 0.02, 0.34), cout = last ? 0 : P(lt, d - 0.3, d);
    cx.clearRect(0, 0, SW, SH);
    if (cin <= 0 && cout <= 0) { G.cv.style.display = 'none'; return; }
    G.cv.style.display = 'block';
    const B = pk(64, 60), cols = Math.ceil(SW / B), rows = Math.ceil(SH / B);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const th = ((c / cols) * 0.55 + (r / rows) * 0.45) * 0.62 + hash(i * 1.37 + 7) * 0.38;
        let fill = false, edge = false;
        if (cout > 0 && th < cout) { fill = true; edge = th > cout - 0.05; }
        if (cin > 0 && th >= 1 - cin) { fill = true; edge = edge || th < 1 - cin + 0.05; }
        if (!fill) continue;
        const hv = hash(i + 3.1);
        cx.fillStyle = edge ? (hv < 0.62 ? '#4b2a9e' : hv < 0.86 ? '#ff5fa8' : '#5ce1ff') : '#0b0520';
        cx.fillRect(c * B, r * B, B, B);
      }
    }
  }

  // ---------- latar: langit malam ungu berbintang piksel, bulan, awan, bukit, kota ----------
  let BG = null;
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, k) => a.map((v, i) => Math.round((v + (b[i] - v) * k) / 3) * 3);
  const rgb = (a) => `rgb(${a[0]},${a[1]},${a[2]})`;
  const NIGHT = ['#07031a', '#0d0628', '#150a39', '#1f0e4b', '#2a135e', '#381870', '#4a1e80', '#5a238c'].map(hex);
  const DAWN = ['#0c0830', '#1a0f4b', '#2e1664', '#4c1f7a', '#7a2a86', '#b8407f', '#ff6f7d', '#ffa56b'].map(hex);
  const band = (arr, y) => { const f = cl(y) * (arr.length - 1), i = Math.min(arr.length - 2, Math.floor(f)); return mix(arr[i], arr[i + 1], f - i); };
  function offCanvas(w, hh, draw) { const c = document.createElement('canvas'); c.width = w; c.height = hh; draw(c.getContext('2d'), w, hh); return c; }
  function bgInit(cx) {
    const pats = {};
    const checker = (col) => {
      if (!pats[col]) pats[col] = cx.createPattern(offCanvas(8, 8, (g) => { g.fillStyle = col; g.fillRect(0, 0, 4, 4); g.fillRect(4, 4, 4, 4); }), 'repeat');
      return pats[col];
    };
    const scan = cx.createPattern(offCanvas(4, 4, (g) => { g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(0, 2, 4, 2); }), 'repeat');
    const stars = Array.from({ length: V ? 170 : 150 }, (_, i) => ({
      x: snap(hash(i * 1.13 + 0.5) * SW, 4), y: snap(Math.pow(hash(i * 2.31 + 0.7), 1.25) * SH * (V ? 0.74 : 0.7), 4),
      s: [3, 3, 4, 4, 4, 6][Math.floor(hash(i * 3.7) * 6)], c: ['#f6f2ff', '#f6f2ff', '#f6f2ff', '#ffe28a', '#9feeff', '#ffb3dd'][Math.floor(hash(i * 5.1) * 6)], ph: hash(i * 7.7) * 5,
    }));
    const cross = Array.from({ length: 12 }, (_, i) => ({ x: snap(hash(i * 9.1 + 3) * SW, 6), y: snap(hash(i * 4.3 + 1) * SH * (V ? 0.6 : 0.62) + pk(110, 190), 6), ph: hash(i * 2.9) * 4 }));
    const moon = offCanvas(152, 152, (g) => {
      for (let y = 0; y < 152; y += 8) for (let x = 0; x < 152; x += 8) {
        const d1 = Math.hypot(x + 4 - 76, y + 4 - 76), d2 = Math.hypot(x + 4 - 98, y + 4 - 60);
        if (d1 < 70 && d1 >= 48) { g.fillStyle = `rgba(184,166,255,${d1 < 58 ? 0.14 : 0.07})`; g.fillRect(x, y, 8, 8); }
        if (d1 < 46 && d2 >= 40) {
          const crater = [[58, 66], [52, 92], [72, 102]].some(([a, b]) => Math.hypot(x + 4 - a, y + 4 - b) < 8);
          g.fillStyle = crater ? '#e3cf9b' : d1 > 38 ? '#fff1c4' : '#fff7de';
          g.fillRect(x, y, 8, 8);
        }
      }
    });
    const cloud = (seed) => offCanvas(320, 72, (g) => {
      const rowsW = [0.34, 0.62, 0.9, 1];
      rowsW.forEach((wk, r) => {
        const w = snap(320 * wk * (0.8 + hash(seed + r) * 0.2), 8), x = snap((320 - w) / 2 + (hash(seed * 3 + r) - 0.5) * 40, 8);
        g.fillStyle = r === 0 ? 'rgba(96,70,170,.55)' : 'rgba(58,36,120,.55)';
        g.fillRect(x, r * 16 + 8, w, 16);
      });
    });
    const clouds = [0, 1, 2, 3].map((i) => ({ c: cloud(i * 11 + 1), x: hash(i * 3.3) * SW, y: pk(170, 260) + hash(i * 5.7) * SH * pk(0.42, 0.4), v: 6 + hash(i) * 10 }));
    const HW = SW * 2;
    const hills = offCanvas(HW, 300, (g, w, hh) => {
      for (let x = 0; x < w; x += 8) {
        const u = (x / w) * Math.PI * 2;
        const y = snap(150 + Math.sin(u * 3) * 42 + Math.sin(u * 7 + 1) * 22 + Math.sin(u * 13 + 2) * 8, 8);
        g.fillStyle = '#261252'; g.fillRect(x, y, 8, hh - y);
        g.fillStyle = '#3a1f78'; g.fillRect(x, y, 8, 8);
      }
    });
    const city = offCanvas(HW, 320, (g, w, hh) => {
      let x = 0, i = 0;
      while (x < w) {
        const bw = snap(70 + hash(i * 1.7 + 2) * 110, 8), bh = snap(90 + Math.pow(hash(i * 2.9 + 1), 1.4) * 200, 8);
        const y = hh - bh;
        g.fillStyle = '#140a31'; g.fillRect(x, y, bw - 8, bh);
        g.fillStyle = '#23155a'; g.fillRect(x, y, bw - 8, 6);
        if (hash(i * 4.1) < 0.35) { g.fillStyle = '#140a31'; g.fillRect(x + snap(bw / 2 - 8, 8), y - 32, 6, 32); g.fillStyle = '#ff4d6d'; g.fillRect(x + snap(bw / 2 - 8, 8) - 1, y - 38, 8, 8); }
        for (let wy = y + 18; wy < hh - 14; wy += 24) for (let wx = x + 12; wx < x + bw - 24; wx += 20) {
          const r = hash(wx * 0.37 + wy * 1.91);
          if (r > 0.7) { g.fillStyle = r > 0.93 ? 'rgba(92,225,255,.75)' : 'rgba(255,210,63,.8)'; g.fillRect(wx, wy, 8, 10); }
        }
        x += bw; i++;
      }
    });
    BG = { checker, scan, stars, cross, moon, clouds, hills, city, HW };
  }
  function drawSun(cx, x0, y0, R) {
    for (let y = -R; y < R; y += 8) {
      const ky = (y + R) / (2 * R);
      if (ky > 0.5 && Math.floor((y + R) / 8) % 3 === 0) continue; // garis-garis horizontal
      const half = Math.sqrt(Math.max(0, R * R - (y + 4) * (y + 4)));
      const w = snap(half, 8);
      cx.fillStyle = rgb(mix(hex('#fff08a'), hex('#ff6f7d'), ky));
      cx.fillRect(x0 - w, y0 + y, w * 2, 8);
    }
  }
  function drawBg(cx, t, id, theme, W, H, lt) {
    if (!BG) bgInit(cx);
    const dawn = id === 's6' ? E.io3(P(lt, 0.2, 3.8)) : 0;
    const N = 16, bh = Math.ceil(H / N / 8) * 8;
    const cols = [];
    for (let i = 0; i < N; i++) { const f = i / (N - 1); cols.push(rgb(dawn > 0 ? mix(band(NIGHT, f), band(DAWN, f), qz(dawn, 12)) : band(NIGHT, f))); }
    for (let i = 0; i < N; i++) { cx.fillStyle = cols[i]; cx.fillRect(0, i * bh, W, bh); }
    for (let i = 0; i < N - 1; i++) { cx.fillStyle = BG.checker(cols[i + 1]); cx.fillRect(0, (i + 1) * bh - 8, W, 8); }
    // bintang (kelip 3 tingkat, stop-motion)
    const sa = 1 - dawn * 0.75;
    BG.stars.forEach((s, i) => {
      const lv = hash(i * 3.7 + Math.floor(t * 2.4 + s.ph));
      cx.globalAlpha = (lv < 0.2 ? 0.25 : lv < 0.6 ? 0.6 : 1) * sa;
      cx.fillStyle = s.c;
      cx.fillRect(s.x, s.y, s.s, s.s);
    });
    BG.cross.forEach((s, i) => {
      const k = ((qz(t, 8) * 0.55 + s.ph) % 2.2) / 2.2, a = k < 0.12 ? 1 : k < 0.24 ? 2 : k < 0.36 ? 1 : 0;
      cx.globalAlpha = 0.9 * sa;
      cx.fillStyle = i % 3 ? '#fff4c8' : '#bff4ff';
      cx.fillRect(s.x, s.y, 6, 6);
      if (a) { cx.fillRect(s.x - 6 * a, s.y, 6 * a, 6); cx.fillRect(s.x + 6, s.y, 6 * a, 6); cx.fillRect(s.x, s.y - 6 * a, 6, 6 * a); cx.fillRect(s.x, s.y + 6, 6, 6 * a); }
    });
    cx.globalAlpha = 1;
    // bintang jatuh sesekali
    const per = 5.3, k0 = Math.floor(t / per), kk = (t - k0 * per) / 0.6;
    if (kk < 1 && dawn < 0.5) {
      const sx = (0.3 + hash(k0 * 1.7) * 0.6) * W, sy = pk(140, 230) + hash(k0 * 2.3) * H * 0.2;
      for (let j = 0; j < 12; j++) {
        const kj = kk - j * 0.025;
        if (kj < 0 || kj > 1) continue;
        cx.globalAlpha = (1 - j / 12) * (1 - kj * 0.6);
        cx.fillStyle = j ? '#bfefff' : '#ffffff';
        cx.fillRect(snap(sx - kj * 520, 6), snap(sy + kj * 250, 6), 6, 6);
      }
      cx.globalAlpha = 1;
    }
    // bulan
    cx.globalAlpha = 1 - dawn * 0.5;
    cx.drawImage(BG.moon, pk(1690, 900), pk(104, 150) - dawn * 40);
    cx.globalAlpha = 1;
    // awan piksel
    BG.clouds.forEach((c) => { const x = ((c.x + t * c.v) % (W + 400)) - 360; cx.drawImage(c.c, snap(x, 4), c.y); });
    // matahari terbit (S6 · "hari pertama")
    if (dawn > 0) drawSun(cx, W / 2, snap(H - pk(150, 240) + (1 - dawn) * 260, 8), pk(170, 210));
    // bukit & kota (paralaks)
    const hx = -((t * 6) % W), cxo = -((t * 14) % W);
    cx.drawImage(BG.hills, hx, H - pk(300, 360));
    cx.drawImage(BG.city, cxo, H - 320);
    cx.fillStyle = BG.scan;
    cx.fillRect(0, 0, W, H);
  }

  KIT.style({
    fonts: ['400 20px "Press Start 2P"', '400 20px "VT323"'],
    themes: { arcade: ['#2a135e', '#150a39', '#07031a', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'] },
    bg: drawBg,
    frame: (id, lt, d) => {
      if (!G) gInit();
      const sc = window.TIMELINE.scenes.find((s) => s.id === id);
      hudUpdate(sc.start + lt);
      dissolve(id, lt, d);
    },
  });

  // ======================================================================
  // S1 · QUEST BARU: kartu PPDP + dialog "mulai dari mana?" + pilihan bimbang + "?" besar
  KIT.registerType('quest', (root, v, sc, tm, T) => {
    const L = pk({ ban: 140, fs: 60, x: 250, cy: 246, w: 1420, dy: 662, qx: 351, qy: 124, qs: 160 },
      { ban: 240, fs: 52, x: 70, cy: 336, w: 940, dy: 1046, qx: 706, qy: 300, qs: 190 });
    const ban = h(`<div class="banner ps" style="top:${L.ban}px;font-size:${L.fs}px"><span class="bt">${esc(v.banner.text)}</span></div>`);
    root.appendChild(ban);
    const bt = $('.bt', ban);
    const banSpk = sparkles(root, 9, { x: SW / 2 - pk(470, 420), y: L.ban - 40, w: pk(940, 840), h: 150 }, 3);
    const conf = confetti(root, 72, SW / 2, L.ban + 30, 5);
    const tBan = T(v.banner.at, 0.5), tConf = T(v.confettiAt, 0.6);
    // setelah kartu muncul, banner mengecil jadi "tab" di tepi atas kartu
    const tabDy = L.cy + 3 - (L.ban + L.fs * 0.65);

    const card = win('gold q-card', `<div class="q-por"><div class="glow"></div><div class="sp">${spr('hero', 13)}</div><div class="sq" style="display:none">${spr('heroQ', 13)}</div><div class="tag ps">${esc(v.card.tag)}</div></div>
      <div class="q-txt"><div class="q-lbl ps">${esc(v.card.label)}</div><div class="q-ttl vt"></div><div class="q-st ps">${v.card.status}</div></div>`);
    root.appendChild(card);
    put(card, L.x, L.cy, L.w);
    const tCard = T(v.card.at, 2);
    const typeTitle = typer($('.q-ttl', card), v.card.title, v.card.words.map((w) => T(w, null)));
    const tSt = T(v.card.statusAt, 4.8);
    const cardSpk = sparkles(root, 6, { x: L.x + 20, y: L.cy - 20, w: pk(320, 920), h: pk(360, 380) }, 7);

    const dlg = win('dlg', `<div class="say vt"></div><div class="opts">${v.dialog.choices.map((c) => `<div class="opt vt"><span class="cur">${spr('tri', 5)}</span>${esc(c)}</div>`).join('')}</div>
      <div class="more">${spr('triD', 5)}</div>`, `<div class="tab ps">${esc(v.dialog.who)}</div>`);
    root.appendChild(dlg);
    put(dlg, L.x, L.dy, L.w);
    const tDlg = T(v.dialog.at, 5.3);
    const typeSay = typer($('.say', dlg), v.dialog.text, v.dialog.words.map((w) => T(w, null)));
    const tOpt = T(v.dialog.choicesAt, 6.4);
    const moves = v.dialog.moves.map((m) => T(m, 99));
    const order = v.dialog.order || [1, 2, 1, 0, 2, 1];
    const opts = $$('.opt', dlg);

    const bigq = h(`<div class="bigq ps" style="font-size:${L.qs}px">?</div>`);
    root.appendChild(bigq);
    put(bigq, L.qx, L.qy);
    const tQ = T(v.q.at, 7);

    return (lt) => {
      // banner jatuh dengan pantulan stop-motion + kedip warna → lalu jadi tab kartu
      const kb = P(qz(lt, 15), tBan, tBan + 0.5), kt = E.io3(P(lt, tCard - 0.1, tCard + 0.35));
      tf(ban, { y: snap(-160 * (1 - pop(kb)) + tabDy * kt, 2), o: kb > 0 ? 1 : 0, s: (1 + 0.04 * Math.sin(lt * 3) * (1 - kt)) * lerp(1, 0.5, kt) });
      ban.style.color = lt > tBan && lt < tBan + 0.7 && blink(lt, 10) ? '#ffffff' : '';
      bt.style.background = `rgba(27,17,66,${(kt * 0.96).toFixed(2)})`;
      bt.style.boxShadow = kt > 0.5 ? 'inset 0 0 0 8px #ffd23f' : 'none';
      banSpk(lt, P(lt, tBan + 0.2, tBan + 0.5) * (1 - kt));
      conf(lt, tConf);
      // kartu peran
      const kc = P(lt, tCard, tCard + 0.45);
      tf(card, { y: snap((1 - E.out3(kc)) * 60 + KIT.float(lt, 0, 3, 1.3), 2), s: lerp(0.86, 1, pop(kc)), o: cl(kc * 3) });
      typeTitle(lt);
      tf($('.q-st', card), { o: P(lt, tSt, tSt + 0.3), x: (1 - E.out3(P(lt, tSt, tSt + 0.4))) * -20 });
      const confused = lt >= tQ;
      $('.sp', card).style.display = confused ? 'none' : 'block';
      $('.sq', card).style.display = confused ? 'block' : 'none';
      const bob = Math.floor(lt * 4) % 2 ? -4 : 0;
      $(confused ? '.sq' : '.sp', card).style.transform = `translateY(${confused ? (blink(lt, 6) ? -2 : 2) : bob}px)`;
      cardSpk(lt, P(lt, tCard + 0.3, tCard + 0.6) * (1 - P(lt, tDlg, tDlg + 0.4)));
      // dialog + pilihan yang bimbang
      const kd = P(lt, tDlg, tDlg + 0.38);
      tf(dlg, { y: snap((1 - E.out3(kd)) * 80, 2), o: cl(kd * 2.5) });
      typeSay(lt);
      let sel = 0;
      moves.forEach((m, i) => { if (lt >= m) sel = order[i % order.length]; });
      opts.forEach((o, i) => {
        const ko = P(lt, tOpt + i * 0.09, tOpt + i * 0.09 + 0.25);
        tf(o, { x: (1 - E.out3(ko)) * 30, o: ko });
        o.classList.toggle('on', i === sel);
        $('.cur', o).style.opacity = i === sel && lt >= tOpt ? 1 : 0;
        $('.cur', o).style.transform = `translateX(${i === sel && blink(lt, 4) ? 6 : 0}px)`;
      });
      $('.more', dlg).style.opacity = lt > tOpt + 0.3 && blink(lt, 2.5) ? 1 : 0;
      // "?" besar
      const kq = P(lt, tQ, tQ + 0.4);
      tf(bigq, { s: kq > 0 ? lerp(2.2, 1, E.outBack(kq)) : 0, r: Math.sin(lt * 5) * 6 * (kq > 0 ? 1 : 0), y: kq >= 1 ? (blink(lt, 3) ? -8 : 0) : 0, o: kq > 0 ? 1 : 0 });
    };
  });

  // ======================================================================
  // S2 · PELATIHAN: "Tenang." (HP pulih) → monitor DPO Academy (screenshot asli) + modul → XP penuh → LEVEL UP! + sertifikat
  KIT.registerType('train', (root, v, sc, tm, T) => {
    const L = pk({ mx: 96, my: 196, mw: 930, px: 1066, py: 196, pw: 744, calmY: 330, lvY: 250, subY: 400, certY: 470, certW: 900 },
      { mx: 70, my: 206, mw: 940, px: 70, py: 874, pw: 940, calmY: 660, lvY: 470, subY: 590, certY: 690, certW: 920 });
    // "Tenang."
    const calm = h(`<div class="calm" style="top:${L.calmY}px"></div>`);
    const bub = win('mint bub', `<div class="vt">${esc(v.calm.text)}</div>`);
    bub.style.position = 'relative';
    const hp = h(`<div class="hp ps">${spr('heart', 5)}<span>${esc(v.calm.hp)}</span>${spr('heart', 5)}</div>`);
    calm.append(bub, hp);
    root.appendChild(calm);
    const calmSpk = sparkles(root, 8, { x: SW / 2 - 330, y: L.calmY - 50, w: 660, h: 330 }, 11);
    const tCalm = T(v.calm.at, 0.4), tCalmOut = T(v.calm.out, 1.6);
    // monitor DPO Academy (screenshot asli)
    const mon = monitor(root, { x: L.mx, y: L.my, w: L.mw, at: v.screen.at, on: v.screen.on, label: v.screen.label, shots: [v.screen] }, T);
    const tMon = T(v.screen.at, 1.6);
    // panel pelatihan
    const panel = win('tr-panel', `<div class="tr-h ps">${esc(v.head.title)}</div>
      <div class="tr-party"><span class="ps" style="font-size:14px;color:var(--dim)">${esc(v.head.for)}</span>${v.party.map((p) => `<div class="chip"><div class="fc">${spr(p.spr, 4)}</div><span class="ps">${esc(p.name)}</span></div>`).join('')}</div>
      <div class="mods">${v.mods.map((m) => `<div class="mod"><div class="chk">${spr('checkD', 5)}</div><div class="vt">${esc(m.text)}</div><div class="xpv ps">+${m.xp} XP</div></div>`).join('')}</div>
      <div class="xpw"><div class="lb ps"><span>XP</span><b>LV 1 &gt;&gt; 2</b></div><div class="xp"><div class="fill">${'<i></i>'.repeat(16)}</div></div></div>`);
    root.appendChild(panel);
    put(panel, L.px, L.py, L.pw);
    const tHead = T(v.head.at, 2.8), tFor = T(v.head.forAt, 3.3);
    const chips = $$('.chip', panel), tChip = v.party.map((p) => T(p.at, 3.6));
    const mods = $$('.mod', panel), tMods = T(v.modsAt, 5), tMod = v.mods.map((m) => T(m.at, 6));
    const segs = $$('.xp .fill i', panel);
    const pops = v.mods.map((m) => { const el = h(`<div class="pop ps">+${m.xp} XP</div>`); panel.appendChild(el); return el; });
    // LEVEL UP + sertifikat
    const dim = h('<div class="dim"></div>');
    const rays = h(`<div class="rays" style="top:${L.lvY + pk(60, 44)}px">${'<i></i>'.repeat(14)}</div>`);
    const lv = h(`<div class="lvup ps" style="top:${L.lvY}px">LEVEL UP!</div>`);
    const lvs = h(`<div class="lvsub ps" style="top:${L.subY}px">${esc(v.level.sub)}</div>`);
    const flash = h('<div style="position:absolute;inset:0;background:#fff;opacity:0;z-index:12"></div>');
    const cert = win('cert', `<div>${spr('seal', 11)}</div><div><div class="k ps">${esc(v.cert.kicker)}</div><div class="t ps">${esc(v.cert.title)}</div><div class="s vt">${esc(v.cert.sub)}</div></div>`);
    root.append(dim, rays, lv, lvs);
    const lvBurst = burst(root, 16, SW / 2, L.lvY + pk(60, 44), 21, pk(520, 420));
    root.append(cert, flash);
    put(cert, (SW - L.certW) / 2, L.certY, L.certW);
    const tLv = T(v.levelAt, 8.4), tCert = T(v.certAt, 9);
    const CYC = ['#ffd23f', '#ffffff', '#5ce1ff', '#ff5fa8'];
    return (lt) => {
      // Tenang
      const kc = P(lt, tCalm - 0.05, tCalm + 0.35), ko = P(lt, tCalmOut, tCalmOut + 0.35);
      tf(calm, { s: lerp(0.6, 1, pop(kc)) * (1 - 0.3 * E.in3(ko)) * (1 + 0.018 * Math.sin(lt * 2.6)), y: -E.in3(ko) * 120, o: cl(kc * 3) * (1 - ko) });
      tf(hp, { y: snap((1 - E.out3(P(lt, tCalm + 0.3, tCalm + 0.7))) * 20, 2) + (blink(lt, 3) ? -3 : 0), o: P(lt, tCalm + 0.3, tCalm + 0.5) });
      calmSpk(lt, P(lt, tCalm, tCalm + 0.3) * (1 - ko));
      // monitor & panel masuk
      const km = E.out3(P(lt, tMon, tMon + 0.55));
      tf(mon.el, { x: snap((1 - km) * pk(-120, 0), 2), y: snap((1 - km) * pk(0, -60), 2), o: cl(km * 2) });
      mon.update(lt);
      const kp = E.out3(P(lt, tHead - 0.25, tHead + 0.3));
      tf(panel, { x: snap((1 - kp) * pk(120, 0), 2), y: snap((1 - kp) * pk(0, 80), 2), o: cl(kp * 2) });
      tf($('.tr-h', panel), { o: P(lt, tHead, tHead + 0.2) });
      tf($('.tr-party > span', panel), { o: P(lt, tFor, tFor + 0.25) });
      chips.forEach((c, i) => { const k = P(lt, tChip[i], tChip[i] + 0.35); tf(c, { s: lerp(0.5, 1, pop(k)), o: cl(k * 3) }); });
      let xp = 0;
      mods.forEach((m, i) => {
        const ka = P(lt, tMods + i * 0.1, tMods + i * 0.1 + 0.3);
        tf(m, { x: (1 - E.out3(ka)) * -40, o: ka });
        const done = lt >= tMod[i], kd = P(lt, tMod[i], tMod[i] + 0.3);
        m.classList.toggle('done', done);
        const ck = $('.chk', m);
        ck.classList.toggle('on', done);
        ck.style.transform = `scale(${done ? 1 + 0.35 * (1 - E.out3(kd)) : 1})`;
        xp += v.mods[i].xp / 100 * E.out3(kd);
        // "+XP" melayang naik dari baris yang baru selesai
        const pk2 = P(lt, tMod[i], tMod[i] + 0.9);
        put(pops[i], L.pw - pk(230, 250), snap(6 + m.offsetTop - 18 - E.out3(pk2) * 46, 2));
        pops[i].style.opacity = pk2 > 0 && pk2 < 1 ? (pk2 > 0.7 ? (1 - pk2) / 0.3 : 1) : 0;
        $('.xpv', m).style.opacity = done ? 1 : 0.4;
      });
      const nOn = Math.floor(xp * segs.length + 1e-6);
      segs.forEach((s, i) => { s.classList.toggle('on', i < nOn); s.classList.toggle('hot', i === nOn - 1 && lt < tLv && blink(lt, 8)); });
      // LEVEL UP
      const kl = P(lt, tLv, tLv + 0.35);
      dim.style.opacity = 0.78 * E.out3(P(lt, tLv - 0.1, tLv + 0.3));
      flash.style.opacity = lt >= tLv ? Math.max(0, 0.75 - (lt - tLv) / 0.28) : 0;
      tf(lv, { s: kl > 0 ? lerp(2.4, 1, E.outBack(kl)) * (1 + 0.03 * Math.sin(lt * 9)) : 0, o: kl > 0 ? 1 : 0, y: kl >= 1 ? (blink(lt, 4) ? -4 : 0) : 0 });
      lv.style.color = CYC[Math.floor(lt * 10) % CYC.length];
      tf(lvs, { o: P(lt, tLv + 0.25, tLv + 0.45), y: (1 - E.out3(P(lt, tLv + 0.25, tLv + 0.55))) * 20 });
      rays.style.opacity = 0.9 * P(lt, tLv, tLv + 0.3);
      $$('i', rays).forEach((r, i) => {
        const a = (i / 14) * 360 + qz(lt, 8) * 24;
        r.style.height = pk(760, 700) * E.out3(P(lt, tLv, tLv + 0.5)) + 'px';
        r.style.transform = `rotate(${a}deg)`;
      });
      lvBurst(lt, tLv);
      const kce = P(lt, tCert, tCert + 0.45);
      tf(cert, { y: snap((1 - E.out3(kce)) * 140, 2) + (kce >= 1 ? KIT.float(lt, 1, 4, 1.4) : 0), s: lerp(0.7, 1, pop(kce)), r: lerp(-8, -1.5, E.out3(kce)), o: cl(kce * 3) });
    };
  });

  // ======================================================================
  // S3 · PARTY MEMBER JOINED: kartu konsultan (CIPP/E · CIPM · FIP) → berdampingan di depan layar → misi RoPA/DPIA/kebijakan
  KIT.registerType('party', (root, v, sc, tm, T) => {
    const L = pk({ ban: 128, cx: 100, cy: 262, cw: 790, sx: 950, sy: 206, sw: 860, sh: 300, qx: 950, qy: 548, qw: 860, spx: 10 },
      { ban: 234, cx: 70, cy: 312, cw: 940, sx: 70, sy: 836, sw: 940, sh: 180, qx: 70, qy: 1030, qw: 940, spx: 8 });
    const ban = h(`<div class="join ps" style="top:${L.ban}px">${esc(v.banner.text)}</div>`);
    root.appendChild(ban);
    const banSpk = sparkles(root, 8, { x: SW / 2 - pk(520, 420), y: L.ban - 30, w: pk(1040, 840), h: 120 }, 13);
    const tBan = T(v.banner.at, 0.15);
    const c = v.card;
    const card = win('mint p-card', `<div class="p-top"><div class="p-por">${spr('kons', pk(14, 12))}</div><div><div class="p-cls ps">${esc(c.cls)}</div><div class="p-nm vt">${esc(c.name)}</div>
      <div class="p-stat ps"><span>${esc(c.stat)}</span><div class="bar"><i></i></div><b>MAX</b></div></div></div>
      <div class="p-certl ps">${esc(c.certLabel)}</div><div class="p-certs">${c.certs.map((b) => `<div class="bdg ps">${spr('seal', 4)}<span>${esc(b.text)}</span></div>`).join('')}</div>`);
    root.appendChild(card);
    put(card, L.cx, L.cy, L.cw);
    const tCard = T(c.at, 0.5), tStat = T(c.statAt, 1.2), tCl = T(c.certLabelAt, 1.4), tB = c.certs.map((b) => T(b.at, 1.6));
    const certW = [...$('.p-certl', card).textContent];
    // panggung: PPDP & konsultan bekerja berdampingan di depan layar
    const stage = h(`<div class="p-stage"><div class="gnd"></div>
      <div class="who wA">${spr('hero', L.spx)}<span class="ps">PPDP</span></div>
      <div class="deskw" style="position:absolute;bottom:26px">${spr('desk', L.spx)}</div>
      <div class="who wB">${spr('kons', L.spx)}<span class="ps">KONSULTAN</span></div>
      <div class="heart">${spr('heart', 6)}</div></div>`);
    root.appendChild(stage);
    put(stage, L.sx, L.sy, L.sw, L.sh);
    const wA = $('.wA', stage), wB = $('.wB', stage), desk = $('.deskw', stage), heart = $('.heart', stage);
    const DW = 18 * L.spx, CW = 12 * L.spx;
    const deskX = (L.sw - DW) / 2;
    desk.style.left = deskX + 'px';
    const posA = deskX - CW - pk(40, 30), posB = deskX + DW + pk(40, 30);
    const tStage = T(v.stageAt, 2.8), tJoin = T(v.joinAt, 3.2);
    const joinSpk = burst(root, 12, L.sx + posB + CW / 2, L.sy + L.sh - 26 - 8 * L.spx, 31, pk(200, 160));
    // misi
    const qst = win('gold qst', `<div class="hd ps">${esc(v.quests.title)}</div><div class="rows">${v.quests.items.map((q) => `<div class="qrow"><div class="chk">${spr('checkD', 5)}</div><div class="vt">${esc(q.text)}</div><div class="ok ps">SELESAI!</div></div>`).join('')}</div>`);
    root.appendChild(qst);
    put(qst, L.qx, L.qy, L.qw);
    const tQ = T(v.quests.at, 4.2), tQi = v.quests.items.map((q) => T(q.at, 5));
    const rows = $$('.qrow', qst);
    return (lt) => {
      const kb = P(lt, tBan, tBan + 0.45);
      tf(ban, { x: snap((1 - E.outBack(kb)) * -SW * 0.6, 4), o: kb > 0 ? 1 : 0 });
      ban.style.color = lt > tBan && lt < tBan + 0.8 && blink(lt, 10) ? '#ffffff' : '';
      banSpk(lt, P(lt, tBan + 0.3, tBan + 0.6));
      // kartu berputar masuk (stop-motion 15 fps)
      const kc = P(qz(lt, 15), tCard, tCard + 0.5);
      card.style.transform = `perspective(1600px) translateY(${kc >= 1 ? snap(KIT.float(lt, 2, 3, 1.1), 2) : 0}px) rotateY(${lerp(88, 0, E.out3(kc)).toFixed(1)}deg) scale(${lerp(0.9, 1, E.out3(kc)).toFixed(3)})`;
      card.style.opacity = kc > 0 ? 1 : 0;
      $('.p-stat .bar i', card).style.width = 100 * E.out3(P(lt, tStat, tStat + 0.6)) + '%';
      tf($('.p-stat', card), { o: P(lt, tStat - 0.1, tStat + 0.15) });
      tf($('.p-certl', card), { o: P(lt, tCl, tCl + 0.2) });
      $('.p-certl', card).style.color = lt > tCl && lt < tCl + 0.8 && blink(lt, 8) ? '#ffd23f' : '';
      $$('.bdg', card).forEach((b, i) => { const k = P(lt, tB[i], tB[i] + 0.35); tf(b, { s: lerp(0.3, 1, pop(k)), r: (1 - E.out3(k)) * -14, o: cl(k * 3), y: k >= 1 ? (blink(lt + i * 0.2, 2) ? -2 : 0) : 0 }); });
      // panggung
      const ks = E.out3(P(lt, tStage, tStage + 0.4));
      tf(stage, { y: snap((1 - ks) * 40, 2), o: ks });
      const bob = (i) => (Math.floor(lt * 4 + i) % 2 ? -L.spx / 2 : 0);
      const kw = P(lt, tJoin - 0.55, tJoin);
      const walkB = kw > 0 && kw < 1;
      wA.style.left = posA + 'px';
      wB.style.left = snap(lerp(L.sw + 40, posB, E.out3(qz(kw, 12))), L.spx / 2) + 'px';
      wA.style.transform = `translateY(${bob(0)}px)`;
      wB.style.transform = `translateY(${walkB ? (Math.floor(lt * 10) % 2 ? -L.spx : 0) : lt > tJoin && lt < tJoin + 0.3 ? -L.spx * 3 * Math.sin(Math.PI * P(lt, tJoin, tJoin + 0.3)) : bob(1)}px)`;
      wB.style.opacity = kw > 0 ? 1 : 0;
      const kh = P(lt, tJoin + 0.1, tJoin + 0.45);
      put(heart, snap(L.sw / 2 - 21, 2), snap(L.sh - 26 - 14 * L.spx - 46 - E.out3(kh) * 14 + (blink(lt, 2) ? -4 : 0), 2));
      tf(heart, { s: pop(kh), o: kh > 0 ? 1 : 0 });
      joinSpk(lt, tJoin);
      // misi bersama
      const kq = E.out3(P(lt, tQ, tQ + 0.4));
      tf(qst, { y: snap((1 - kq) * 60, 2), o: kq });
      rows.forEach((r, i) => {
        const done = lt >= tQi[i], kd = P(lt, tQi[i], tQi[i] + 0.3);
        r.classList.toggle('done', done);
        const ck = $('.chk', r);
        ck.classList.toggle('on', done);
        ck.style.transform = `scale(${done ? 1 + 0.35 * (1 - E.out3(kd)) : 1})`;
        tf($('.ok', r), { o: done ? 1 : 0, s: done ? lerp(1.6, 1, E.outBack(kd)) : 1 });
      });
    };
  });

  // ======================================================================
  // S4 · INVENTORI HARIAN: monitor Privasimu Nexus (screenshot ASLI: dasbor, antrean, asisten AI) + slot inventori
  KIT.registerType('hud', (root, v, sc, tm, T) => {
    const L = pk({ mx: 96, my: 150, mw: 1190, ix: 1322, iy: 238, iw: 490 }, { mx: 70, my: 206, mw: 940, ix: 70, iy: 896, iw: 940 });
    const mon = monitor(root, { x: L.mx, y: L.my, w: L.mw, at: v.monitor.at, on: v.monitor.on, label: v.monitor.label, shots: v.shots }, T);
    const tMon = T(v.monitor.at, 0.4);
    const inv = win('cyan inv', `<div class="hd ps">${esc(v.inv.title)}</div><div class="slots">${v.slots.map((s, i) => `<div class="islot"><div class="sel">${spr('tri', 5)}</div><div class="ic">${spr(s.icon, s.icon === 'bot' ? 6 : 7)}</div>
      <div><div class="k ps">SLOT ${i + 1}</div><div class="t vt">${esc(s.text)}</div></div><div class="nw ps">BARU</div></div>`).join('')}</div>`);
    root.appendChild(inv);
    put(inv, L.ix, L.iy, L.iw);
    const tInv = T(v.inv.at, 1.4);
    const slots = $$('.islot', inv), tS = v.slots.map((s) => T(s.at, 4));
    const pri = h(`<div class="pop ps" style="color:var(--mint)">${esc(v.join.text)}</div>`);
    root.appendChild(pri);
    const tJ = T(v.join.at, 7.4);
    const joinB = burst(root, 10, L.ix + L.iw / 2, L.iy + pk(560, 470), 41, 170);
    return (lt) => {
      const km = E.out3(P(lt, tMon, tMon + 0.55));
      tf(mon.el, { y: snap((1 - km) * 90, 2), s: lerp(0.94, 1, km), o: cl(km * 2) });
      mon.update(lt);
      const ki = E.out3(P(lt, tInv, tInv + 0.45));
      tf(inv, { x: snap((1 - ki) * pk(100, 0), 2), y: snap((1 - ki) * pk(0, 80), 2), o: ki });
      let act = -1;
      tS.forEach((t, i) => { if (lt >= t) act = i; });
      slots.forEach((s, i) => {
        const on = i === act, k = P(lt, tS[i], tS[i] + 0.3);
        s.classList.toggle('on', on);
        tf(s, { s: on ? 1 + 0.05 * Math.sin(Math.PI * cl(k)) : 1 });
        $('.sel', s).style.opacity = on ? 1 : 0;
        $('.sel', s).style.transform = `translateX(${blink(lt, 4) ? 4 : 0}px)`;
        tf($('.nw', s), { o: lt >= tS[i] ? (blink(lt - tS[i], 3) || lt > tS[i] + 1 ? 1 : 0.2) : 0, s: pop(k) });
        tf($('.ic', s), { y: on && blink(lt, 3) ? -4 : 0 });
      });
      // Priva bergabung ke party
      const bx = L.ix + (L.iw - pri.offsetWidth) / 2, by = L.iy + inv.offsetHeight + 22;
      const kj = P(lt, tJ, tJ + 1.3);
      put(pri, snap(bx, 2), snap(by - E.out3(kj) * 18, 2));
      pri.style.opacity = kj > 0 ? (blink(lt - tJ, 5) || kj > 0.4 ? 1 : 0.3) : 0;
      joinB(lt, tJ);
    };
  });

  // ======================================================================
  // S5 · LOG AUDIT (log petualangan): tindakan manusia & AI tercatat → toast ACHIEVEMENT UNLOCKED
  KIT.registerType('achieve', (root, v, sc, tm, T) => {
    const L = pk({ lx: 250, ly: 150, lw: 1420, tx: 330, ty: 736, tw: 1260 }, { lx: 70, ly: 330, lw: 940, tx: 70, ty: 1010, tw: 940 });
    const lg = win('cyan lg', `<div class="hd ps"><span>${esc(v.log.title)}</span><span class="sp"></span><span class="rec"><i></i>REC</span><span>${esc(v.log.sub)}</span></div><div class="rows">${v.log.rows.map((r) => `<div class="lrow">
      <div class="av ${r.ai ? 'a' : 'u'}">${spr(r.spr, 5)}</div><div class="tm vt">${esc(r.time)}</div><div class="tx vt"><b class="${r.ai ? 'ai' : ''}">${esc(r.who)}</b> ${esc(r.text)}</div><div class="rc ps">TERCATAT</div></div>`).join('')}</div>`);
    root.appendChild(lg);
    put(lg, L.lx, L.ly, L.lw);
    const tLg = T(v.log.at, 0.2), tR = v.log.rows.map((r) => T(r.at, 1)), tRec = T(v.log.recAt, 3.6);
    const rows = $$('.lrow', lg);
    const toast = win('gold toast', `<div class="tro">${spr('trophy', 8)}</div><div><div class="k ps">${esc(v.toast.kicker)}</div><div class="t vt">${esc(v.toast.title)}</div><div class="s vt">${esc(v.toast.sub)}</div></div>`);
    root.appendChild(toast);
    put(toast, L.tx, L.ty, L.tw);
    const tT = T(v.toast.at, 4.2);
    const tSpk = sparkles(root, 10, { x: L.tx - 20, y: L.ty - 40, w: L.tw + 40, h: pk(230, 280) }, 17);
    const tBurst = burst(root, 14, L.tx + pk(80, 70), L.ty + pk(80, 80), 51, 220);
    const recDot = $('.rec i', lg);
    return (lt) => {
      recDot.style.opacity = blink(lt, 1.6) ? 1 : 0.15;
      const kl = E.out3(P(lt, tLg, tLg + 0.45));
      tf(lg, { y: snap((1 - kl) * 60 + (kl >= 1 ? KIT.float(lt, 3, 3, 1.2) : 0), 2), o: kl });
      rows.forEach((r, i) => {
        const k = P(lt, tR[i], tR[i] + 0.3);
        tf(r, { x: snap((1 - E.out3(k)) * -50, 2), o: k });
        r.style.background = k > 0 && k < 1 ? 'rgba(92,225,255,.18)' : '';
        const kr = P(lt, tRec + i * 0.09, tRec + i * 0.09 + 0.25);
        tf($('.rc', r), { s: kr > 0 ? lerp(1.8, 1, E.outBack(kr)) : 0, o: kr > 0 ? 1 : 0, r: -4 });
      });
      const kt = P(lt, tT, tT + 0.45);
      tf(toast, { y: snap((1 - E.outBack(kt)) * 220, 2), s: lerp(0.9, 1, E.out3(kt)), o: cl(kt * 3) });
      $('.k', toast).style.color = kt > 0 && lt < tT + 0.9 && blink(lt, 8) ? '#ffffff' : '';
      tf($('.tro', toast), { y: kt >= 1 && blink(lt, 2.5) ? -4 : 0 });
      tSpk(lt, P(lt, tT + 0.2, tT + 0.5));
      tBurst(lt, tT + 0.1);
    };
  });

  // ======================================================================
  // S6 · LAYAR JUDUL: fajar "hari pertama", logo, "Anda tidak sendirian." + party lengkap berjalan masuk, PRESS START, privasimu.com
  KIT.registerType('title', (root, v, sc, tm, T) => {
    const L = pk({ lgY: 132, lgW: 700, l1: 300, l2: 372, fs: 46, pr: 486, btn: 540, ft: 690, gy: 1000, px: 8, gw: 1000 },
      { lgY: 300, lgW: 820, l1: 500, l2: 566, fs: 40, pr: 700, btn: 758, ft: 916, gy: 1420, px: 10, gw: 980 });
    const lg = h(`<div class="ttl-logo" style="top:${L.lgY}px"><img src="${LOGO}" alt="" style="width:${L.lgW}px"></div>`);
    root.appendChild(lg);
    const lgSpk = sparkles(root, 10, { x: (SW - L.lgW) / 2 - 40, y: L.lgY - 50, w: L.lgW + 80, h: L.lgW / 7 + 100 }, 23);
    const tLg = T(v.logoAt, 0.5);
    const lines = v.lines.map((l, i) => {
      const el = h(`<div class="ttl-line ps" style="top:${i ? L.l2 : L.l1}px;font-size:${L.fs}px"></div>`);
      root.appendChild(el);
      return typer(el, l.text, l.words.map((w) => T(w, null)), 30);
    });
    const press = h(`<div class="press ps" style="top:${L.pr}px">${esc(v.press.text)}</div>`);
    const btn = win('pbtn', `${spr('coin', 5)}<span class="ps">${esc(v.button.text)}</span><div class="shine"></div>`);
    const foot = h(`<div class="tfoot vt" style="top:${L.ft}px"><div class="a">${v.foot.a}</div><div class="b">${esc(v.foot.b)}</div></div>`); // kontak di panel gelap agar kontras
    root.append(press, btn);
    btn.style.top = L.btn + 'px';
    root.appendChild(foot);
    const tPr = T(v.press.at, 5.4), tBtn = T(v.button.at, 5.7), tFt = T(v.foot.at, 6.2);
    // party lengkap berjalan masuk ke panggung
    const gnd = h(`<div class="p-stage" style="left:${(SW - L.gw) / 2}px;top:${L.gy - 26}px;width:${L.gw}px;height:26px"><div class="gnd"></div></div>`);
    root.appendChild(gnd);
    const CW = 12 * L.px, gap = pk(70, 60);
    const names = ['it', 'hero', 'kons', 'bot'];
    const tot = names.length * CW + (names.length - 1) * gap;
    const walkers = names.map((n, i) => {
      const el = h(`<div class="walk">${spr(n, L.px)}</div>`);
      root.appendChild(el);
      const hh = SPR[n].length * L.px;
      return { el, x: (SW - tot) / 2 + i * (CW + gap), y: L.gy - 26 - hh, from: i < 2 ? -CW - 40 - (1 - i) * 160 : SW + 40 + (i - 2) * 160 };
    });
    const tWalk = T(v.walkAt, 3.4), tJump = T(v.jumpAt, 4.3);
    const hearts = [0, 1, 2].map(() => { const el = h(`<div class="spk">${spr('heart', 6)}</div>`); root.appendChild(el); return el; });
    const fade = h('<div class="kfade"></div>');
    root.appendChild(fade);
    return (lt, d) => {
      const kl = P(lt, tLg, tLg + 0.6);
      lg.style.clipPath = `inset(0 ${100 - qz(kl, 12) * 100}% 0 0)`;
      tf(lg, { s: lerp(1.08, 1, E.out3(kl)), o: kl > 0 ? 1 : 0, y: snap(KIT.float(lt, 4, 3, 1), 2) });
      lgSpk(lt, P(lt, tLg + 0.4, tLg + 0.8));
      lines.forEach((f) => f(lt));
      press.style.opacity = lt >= tPr && blink(lt - tPr, 2.2, 0.62) ? 1 : 0;
      const kb = P(lt, tBtn, tBtn + 0.45);
      tf(btn, { s: lerp(0.4, 1, pop(kb)) * (kb >= 1 ? 1 + 0.025 * Math.sin(lt * 6) : 1), o: cl(kb * 3) });
      $('.shine', btn).style.left = lerp(-120, 700, P(((lt - tBtn - 0.5) % 1.8 + 1.8) % 1.8, 0, 0.7)) + 'px';
      tf(foot, { o: P(lt, tFt, tFt + 0.4), y: (1 - E.out3(P(lt, tFt, tFt + 0.5))) * 16 });
      tf(gnd, { o: P(lt, tWalk - 0.4, tWalk) });
      walkers.forEach((w, i) => {
        const k = P(lt, tWalk + i * 0.08, tWalk + 0.9 + i * 0.08);
        const x = lerp(w.from, w.x, E.out3(qz(k, 12)));
        const walking = k > 0 && k < 1;
        const kj = P(lt, tJump + i * 0.06, tJump + 0.45 + i * 0.06);
        const jump = kj > 0 && kj < 1 ? -L.px * 7 * Math.sin(Math.PI * kj) : 0;
        const bob = walking ? (Math.floor(lt * 10 + i) % 2 ? -L.px : 0) : (Math.floor(lt * 3 + i) % 2 ? -L.px / 2 : 0);
        put(w.el, snap(x, 2), snap(w.y + jump + bob, 2));
        w.el.style.opacity = k > 0 ? 1 : 0;
      });
      hearts.forEach((el, i) => {
        const k = P(lt, tJump + 0.2 + i * 0.12, tJump + 1.5 + i * 0.12);
        put(el, snap((SW - tot) / 2 + (i + 1) * (CW + gap) - gap / 2, 2), snap(L.gy - 26 - 16 * L.px + 26 - E.out3(k) * 34, 2));
        el.style.opacity = k > 0 && k < 1 ? (k > 0.7 ? (1 - k) / 0.3 : 1) : 0;
        el.style.transform = `translate(-50%, -50%) scale(${k > 0 ? 1 : 0})`;
      });
      fade.style.opacity = P(lt, d - 0.6, d);
    };
  });
})();
