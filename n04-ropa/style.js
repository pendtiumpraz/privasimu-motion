// N04 · "RoPA final revisi dua" — parodi GENRE iklan obat TV jadul 90-an (bukan produk nyata).
// Semua isi scene dirancang di bingkai logis 4:3 (1440×1080): 16:9 = pillarbox, 9:16 = bingkai di tengah + teks iklan atas/bawah.
// Efek VHS global (chroma bleed, scanline, tracking noise, OSD "PLAY ▶", jam siaran) + transisi "lompatan pita" antar scene.
// Tampilan aplikasi = screenshot ASLI (motion/assets/app/*.png, resolusi 1x → ditampilkan ≤ 1,4x).
(function () {
  const { V, h, esc, $, icon } = KIT;
  const { P, cl, lerp, E, hash } = MG;
  const pick = (a, b) => (V ? b : a);
  const LOGO = '../assets/privasimu_logo.png';
  const pad2 = (n) => String(n).padStart(2, '0');
  const ob = (k) => E.outBack(cl(k));
  const TLS = () => window.TIMELINE.scenes;
  let UID = 0;

  // ---------- font: Archivo (lebar variabel), VT323 (OSD VCR), Noto Color Emoji (emoji konsisten, termasuk 😵‍💫) ----------
  const EMOJI = '😐😬😰🤯😵‍💫💦🤚✋😩😖😌👉✨🗑📂⚡🧬💫😅🙂';
  const emojiReady = document.fonts.load('80px "Noto Color Emoji"', EMOJI).catch(() => null);
  const boot0 = MG.boot;
  MG.boot = (o) => { emojiReady.then(() => boot0(o)); }; // renderer baru mulai setelah emoji termuat

  // ---------- filter chroma bleed VHS (kanal merah & biru bergeser + blur horizontal) ----------
  document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="n4vhs" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.7 0.1" result="s"/>
      <feColorMatrix in="s" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
      <feOffset id="n4oR" in="r" dx="2.5" dy="0" result="r2"/>
      <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
      <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>
      <feOffset id="n4oB" in="b" dx="-2.5" dy="0" result="b2"/>
      <feBlend in="r2" in2="g" mode="screen" result="rg"/>
      <feBlend in="rg" in2="b2" mode="screen"/>
    </filter></defs></svg>`);
  const offR = document.getElementById('n4oR'), offB = document.getElementById('n4oB');

  // ---------- kerangka scene: bingkai TV + kamera + lapisan depan + zona 9:16 ----------
  function tvScene(root) {
    const tv = h('<div class="tv"><div class="jit"><div class="cam"></div><div class="fg"></div></div></div>');
    root.appendChild(tv);
    const zt = h('<div class="zone zt"></div>'), zb = h('<div class="zone zb"></div>');
    root.appendChild(zt); root.appendChild(zb);
    const jit = tv.firstChild;
    return { tv, jit, cam: jit.children[0], fg: jit.children[1], zt, zb, sec: root };
  }
  const add = (parent, html) => { const el = typeof html === 'string' ? h(html) : html; parent.appendChild(el); return el; };
  const at = (el, x, y) => { el.style.left = (+x).toFixed(1) + 'px'; el.style.top = (+y).toFixed(1) + 'px'; return el; };
  const tfs = (el, s) => { el.style.transform = s; };
  const op = (el, o) => { el.style.opacity = o; };
  function centerX(el, W, x0 = 0) { if (!el._cx && el.offsetWidth) { el._cx = 1; el.style.left = x0 + (W - el.offsetWidth) / 2 + 'px'; } }
  const wOf = (el, fb) => { if (!el._w && el.offsetWidth) el._w = el.offsetWidth; return el._w || fb; };
  // screenshot asli: <img> ukuran 1x di dalam .view yang di-crop/zoom (r = [x, y, lebar] dalam px gambar)
  const shotImg = (s) => `<img src="${esc(s.src)}" width="${s.w}" height="${s.h}" style="width:${s.w}px;height:${s.h}px" alt="">`;
  const viewTf = (r, W) => { const k = W / r[2]; return { k, tf: `translate(${(-r[0] * k).toFixed(2)}px, ${(-r[1] * k).toFixed(2)}px) scale(${k.toFixed(4)})` }; };

  // ---------- WordArt 90-an ----------
  function WA(text, { size = 120, stretch = 125, cls = '' } = {}) {
    const el = h(`<div class="wa ${cls}" style="font-size:${size}px;font-stretch:${stretch}%"><div class="bk"></div><div class="fr"></div><div class="sh"></div></div>`);
    const [bk, fr, sh] = el.children, L = [];
    String(text).split('\n').forEach((line) => {
      const a = h('<div class="ln"></div>'), b = h('<div class="ln"></div>'), c = h('<div class="ln"></div>');
      [...line].forEach((ch) => {
        const t = ch === ' ' ? ' ' : ch, s1 = document.createElement('span'), s2 = document.createElement('span');
        s1.textContent = t; s2.textContent = t; a.appendChild(s1); b.appendChild(s2); L.push([s1, s2]);
      });
      c.textContent = line.replace(/ /g, ' ');
      bk.appendChild(a); fr.appendChild(b); sh.appendChild(c);
    });
    return { el, L, sh };
  }
  // huruf "pop" bertahap, lalu kilau berkala
  function waIn(w, lt, t0, { stagger = .045, dur = .42, drop = .55, spin = 16, every = 2.4 } = {}) {
    w.L.forEach(([a, b], i) => {
      const k = P(lt, t0 + i * stagger, t0 + i * stagger + dur), kb = E.outBack(k);
      const tr = k >= 1 ? '' : `translateY(${((1 - kb) * -drop).toFixed(3)}em) rotate(${((1 - kb) * spin * (i % 2 ? 1 : -1)).toFixed(2)}deg) scale(${Math.max(0, kb).toFixed(3)})`;
      a.style.transform = b.style.transform = tr;
      a.style.opacity = b.style.opacity = k > 0 ? 1 : 0;
    });
    const tEnd = t0 + w.L.length * stagger + dur;
    const ph = lt - tEnd - .05, ks = ph > 0 ? P(ph % every, 0, .75) : 0;
    w.sh.style.opacity = ph > 0 && ks > 0 && ks < 1 ? 1 : 0;
    w.sh.style.setProperty('--shx', (100 - 100 * E.io3(ks)).toFixed(1) + '%');
    return tEnd;
  }

  // ---------- ornamen ----------
  const SPK = '<svg viewBox="-50 -50 100 100"><path d="M0-50C5-10 10-5 50 0C10 5 5 10 0 50C-5 10-10 5-50 0C-10-5-5-10 0-50Z" fill="#fff"/></svg>';
  function sparkles(parent, pts) {
    const els = pts.map((p) => at(add(parent, `<div class="spk">${SPK}</div>`), p[0], p[1]));
    return (lt, amt = 1) => els.forEach((e, i) => {
      const p = pts[i], per = p[3] || 1.5, ph = ((lt + (p[4] ?? hash(i * 3.1) * per)) % per) / per;
      const k = Math.pow(Math.max(0, Math.sin(ph * Math.PI)), 3) * amt;
      e.style.transform = `scale(${(k * (p[2] || 1)).toFixed(3)}) rotate(${(ph * 90).toFixed(1)}deg)`;
      e.style.opacity = k > .01 ? 1 : 0;
    });
  }
  function burst(text) {
    const n = 20, pts = [], id = 'bg' + (++UID);
    for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 77 : 100; pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`); }
    return h(`<div class="burst"><svg viewBox="-110 -110 220 220"><defs><radialGradient id="${id}"><stop offset="0" stop-color="#fffbd6"/><stop offset=".55" stop-color="#ffe14d"/><stop offset="1" stop-color="#ff9a1f"/></radialGradient></defs><polygon points="${pts.join(' ')}" fill="url(#${id})" stroke="#c1121f" stroke-width="6" stroke-linejoin="round"/></svg><b>${esc(text)}</b></div>`);
  }
  const fileCard = (name) => h(`<div class="fcard"><i class="xls"></i><span>${esc(name)}</span></div>`);
  const win = (title, body, cls = '') => h(`<div class="win ${cls}"><div class="tb"><span>${esc(title)}</span><span class="x"><i></i><i></i><i></i></span></div>${body}</div>`);
  const BOLT = '<svg width="34" height="40" viewBox="-12 -32 24 32"><path d="M3-31L-9-12H-1L-4 0L9-19H1Z" fill="#fff" stroke="#7a0010" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  const WARN = '<svg width="86" height="78" viewBox="0 0 86 78"><path d="M43 4L82 72H4Z" fill="#ffd23f" stroke="#1a1a1a" stroke-width="5" stroke-linejoin="round"/><path d="M43 26v24M43 58v3" stroke="#1a1a1a" stroke-width="8" stroke-linecap="round"/></svg>';

  // ---------- kotak obat 3D (packshot; konsep, bukan layar aplikasi) ----------
  function box3d() {
    const el = h(`<div class="p3"><div class="cube">
      <div class="fc front">
        <div class="bx-top"><div class="bx-kick">RoPA · DPIA · AUDIT</div><img class="bx-logo" src="${LOGO}" alt=""><div class="bx-nx">NEXUS</div><i class="bx-caps"></i></div>
        <svg class="bx-sw" viewBox="0 0 400 70" preserveAspectRatio="none"><path d="M0,40 C120,-10 260,80 400,18 L400,70 L0,70 Z" fill="#fff"/><path d="M0,33 C120,-17 260,73 400,11" stroke="#ff9a1f" stroke-width="12" fill="none"/><path d="M0,45 C120,-5 260,85 400,23" stroke="#ffe14d" stroke-width="7" fill="none"/></svg>
        <div class="bx-bot"><div class="bx-ind">Meredakan pusing</div><div class="bx-ind2">RoPA, DPIA &amp; audit</div><div class="bx-feat">Wizard bertahap · Dibantu AI<br>Maker–Reviewer–Approver</div></div>
        <div class="bx-strip">ISI: 1 REGISTER TERPUSAT</div>
        <i class="bx-gloss"></i><i class="shd"></i>
      </div>
      <div class="fc back"><div class="bx-backttl"><img src="${LOGO}" alt=""></div><div class="bx-back-tx">Satu register RoPA terpusat.<br>Setiap perubahan tercatat<br>di log audit.<br><br>privasimu.com</div><div class="bx-bar"></div><i class="shd"></i></div>
      <div class="fc right"><div class="bx-side"><h6>KOMPOSISI</h6><p>Wizard bertahap<br>Pengisian dibantu AI<br>Maker–Reviewer–<br>Approver<br>Log audit</p></div><div class="bx-side lo" style="top:290px"><h6>ATURAN PAKAI</h6><p>Kunjungi<br>privasimu.com</p></div><i class="shd"></i></div>
      <div class="fc left"><div class="bx-side"><h6>INDIKASI</h6><p>Pusing RoPA,<br>DPIA &amp; audit</p></div><div class="bx-side lo" style="top:290px"><h6>PERHATIAN</h6><p>Bukan obat.<br>Jangan diminum.</p></div><i class="shd"></i></div>
      <div class="fc top"><img class="bx-toplogo" src="${LOGO}" alt=""><i class="shd"></i></div>
      <div class="fc bottom"><i class="shd"></i></div>
    </div></div>`);
    const cube = $('.cube', el), gloss = $('.bx-gloss', el);
    const shd = {}; ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach((f) => (shd[f] = $(`.${f} .shd`, el)));
    const N = { front: [0, 0, 1], back: [0, 0, -1], right: [1, 0, 0], left: [-1, 0, 0], top: [0, -1, 0], bottom: [0, 1, 0] };
    const L = (() => { const v = [.18, -.45, .88], m = Math.hypot(...v); return v.map((x) => x / m); })();
    return {
      el,
      set(x, y, s, ry, rx, glossK = -1) {
        el.style.left = x.toFixed(1) + 'px'; el.style.top = y.toFixed(1) + 'px';
        cube.style.transform = `scale(${s.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        const a = ry * Math.PI / 180, b = rx * Math.PI / 180;
        for (const k in N) {
          const [nx, ny, nz] = N[k], x1 = nx * Math.cos(a) + nz * Math.sin(a), z1 = -nx * Math.sin(a) + nz * Math.cos(a);
          const y2 = ny * Math.cos(b) - z1 * Math.sin(b), z2 = ny * Math.sin(b) + z1 * Math.cos(b);
          const d = Math.max(0, x1 * L[0] + y2 * L[1] + z2 * L[2]);
          shd[k].style.opacity = (.6 * (1 - d)).toFixed(3);
        }
        gloss.style.left = (glossK < 0 ? -300 : lerp(-180, 520, glossK)).toFixed(1) + 'px';
      },
    };
  }

  // ---------- layar demo: screenshot ASLI di monitor tabung + pan/zoom + kotak sorotan + ganti layar ----------
  const SCR_W = 788;
  function demoScreen(cfg, T) {
    const el = h(`<div class="demo"><div class="bd"><div class="scr"><div class="view">${cfg.shots.map(shotImg).join('')}</div><div class="hl"></div><div class="snow"></div><div class="glass"></div></div>
      <div class="tag"><b>●</b> DEMO</div><i class="knob"></i><i class="led"></i></div><div class="nk"></div><div class="ft"></div></div>`);
    const view = $('.view', el), hl = $('.hl', el), snow = $('.snow', el), imgs = [...view.querySelectorAll('img')];
    const shots = cfg.shots.map((s) => ({
      t: T(s.at, 0),
      keys: s.keys.map((k) => ({ t: T(k.at, 0), r: k.r, d: k.dur || .8 })),
      marks: (s.marks || []).map((m) => ({ t: T(m.at, 0), t2: m.to != null ? T(m.to, 99) : 99, r: m.r, dir: m.dir || 'up' })),
    }));
    return {
      el,
      update(lt) {
        let si = 0; shots.forEach((s, i) => { if (lt >= s.t) si = i; });
        const s = shots[si];
        imgs.forEach((im, i) => { im.style.display = i === si ? '' : 'none'; });
        let r = s.keys[0].r;
        for (let i = 1; i < s.keys.length; i++) { const k = s.keys[i]; if (lt >= k.t) { const e = E.io3(P(lt, k.t, k.t + k.d)); r = r.map((v, j) => lerp(v, k.r[j], e)); } }
        const { k, tf } = viewTf(r, SCR_W);
        view.style.transform = tf;
        // "ganti saluran": salju VHS singkat saat layar berganti
        const ks = si > 0 ? 1 - P(lt, s.t, s.t + .2) : 0;
        snow.style.opacity = ks > 0 ? (.85 * ks).toFixed(2) : 0;
        if (ks > 0) snow.style.backgroundPosition = `0 ${Math.floor(hash(Math.floor(lt * 30)) * 40)}px`;
        let cur = null;
        s.marks.forEach((m) => { if (lt >= m.t && lt < m.t2) cur = m; });
        if (!cur) { hl.style.opacity = 0; return null; }
        const x = (cur.r[0] - r[0]) * k, y = (cur.r[1] - r[1]) * k, w = cur.r[2] * k, hh = cur.r[3] * k;
        const kp = ob(P(lt, cur.t + .12, cur.t + .45)), pulse = 1 + .025 * Math.sin((lt - cur.t) * 9);
        Object.assign(hl.style, { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', width: w.toFixed(1) + 'px', height: hh.toFixed(1) + 'px',
          opacity: cl(kp * 2), transform: `scale(${(lerp(1.3, 1, kp) * pulse).toFixed(3)})` });
        return { x, y, w, h: hh, t: cur.t, dir: cur.dir };
      },
    };
  }
  // panah tebal "LIHAT!" — dir: 'up' (dari bawah menunjuk ke atas), 'down', 'left' (dari kanan menunjuk ke kiri), 'right'
  function lihat(parent) {
    const id = 'la' + (++UID);
    const el = add(parent, `<div class="lihat"><svg class="arr" viewBox="0 0 190 120"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#ffe14d"/><stop offset="1" stop-color="#f2361d"/></linearGradient></defs>
      <path d="M6 38H112V8L184 60L112 112V82H6Z" fill="url(#${id})" stroke="#22093f" stroke-width="9" stroke-linejoin="round"/></svg></div>`);
    const arr = $('.arr', el), txt = WA('LIHAT!', { size: 60, stretch: 110, cls: 'sm' });
    el.appendChild(txt.el);
    const ROT = { right: 0, down: 90, left: 180, up: -90 };
    return (lt, mk, xOff, yOff, scale = 1) => {
      if (!mk) { el.style.opacity = 0; return; }
      const dir = mk.dir, bob = Math.sin(lt * 9) * 9;
      let tx, ty;
      if (dir === 'up') { tx = mk.x + mk.w / 2; ty = mk.y + mk.h + 10 + bob; }
      else if (dir === 'down') { tx = mk.x + mk.w / 2; ty = mk.y - 10 - bob; }
      else if (dir === 'left') { tx = mk.x + mk.w + 10 + bob; ty = mk.y + mk.h / 2; }
      else { tx = mk.x - 10 - bob; ty = mk.y + mk.h / 2; }
      const ka = ob(P(lt, mk.t + .3, mk.t + .62));
      at(el, xOff + tx * scale, yOff + ty * scale);
      el.style.opacity = cl(ka * 2);
      el.style.transform = `scale(${(Math.max(0, ka) * .9).toFixed(3)})`;
      arr.style.transform = `rotate(${ROT[dir]}deg)`;
      const tw = wOf(txt.el, 230);
      const pos = { up: [-tw / 2, 196], down: [-tw / 2, -262], left: [200, -34], right: [-200 - tw, -34] }[dir];
      at(txt.el, pos[0], pos[1]);
      waIn(txt, lt, mk.t + .34, { stagger: .03, dur: .3 });
    };
  }

  // ---------- overlay VHS global ----------
  let OV = null;
  function overlay() {
    if (OV) return OV;
    const el = h(`<div id="n4ov"><div class="ov-in"><canvas class="trk" width="480" height="360"></canvas><div class="roll"></div><div class="crtv"></div>
      <div class="osd play">PLAY ▶</div><div class="osd rec"><i></i>REC</div><div class="osd ctr"><b>SP</b><span>0:00:00</span></div><div class="bug"><b>20:14</b><small>WIB</small></div></div><div class="scan"></div></div>`);
    document.getElementById('stage').insertBefore(el, document.getElementById('grain'));
    const trk = $('.trk', el);
    OV = { el, cx: trk.getContext('2d'), play: $('.play', el), rec: $('.rec', el), dot: $('.rec i', el), ctr: $('.ctr span', el), ctrBox: $('.ctr', el), bug: $('.bug b', el), roll: $('.roll', el) };
    return OV;
  }
  function drawTrack(cx, t, amt) {
    const W = 480, H = 360, f = Math.floor(t * 30);
    cx.clearRect(0, 0, W, H);
    const by = ((t * 24) % (H + 160)) - 80, bh = 9 + 16 * Math.min(1, amt), a0 = Math.min(1, .3 + amt);
    for (let y = 0; y < bh; y++) {
      const yy = Math.floor(by + y);
      if (yy < 0 || yy >= H) continue;
      const e = Math.sin(Math.PI * y / bh);
      for (let x = -20; x < W;) {
        const r = hash(f * 13.1 + yy * 7.7 + x * .37), len = 3 + r * 46;
        if (r < .22 + .5 * e) { cx.fillStyle = `rgba(255,255,255,${((.18 + .7 * hash(x * 1.3 + yy * 2.1 + f)) * e * a0).toFixed(3)})`; cx.fillRect(x, yy, len, 1); }
        x += len + 4 + hash(f * 3.3 + x + yy * .5) * 36;
      }
    }
    const nd = Math.floor(hash(f * 7.7) * (1.25 + 7 * amt));
    for (let i = 0; i < nd; i++) { cx.fillStyle = `rgba(255,255,255,${(.22 + .4 * hash(f + i * 3)).toFixed(2)})`; cx.fillRect(hash(f * 5.3 + i) * W, hash(f * 3.1 + i * 1.7) * H, 8 + hash(f + i * 9) * 70, 1); }
    if (amt > .55) {
      const y2 = Math.floor(hash(f * 9.1) * H), hh = 6 + Math.floor(hash(f * 4.4) * 26), s = Math.min(1, (amt - .55) * 2.2);
      for (let y = 0; y < hh; y++) for (let x = 0; x < W; x += 3) {
        const v = hash(x * .9 + (y2 + y) * 3.3 + f * 17);
        if (v > .45) { cx.fillStyle = `rgba(255,255,255,${((v - .45) * 1.5 * s).toFixed(3)})`; cx.fillRect(x, y2 + y, 3, 1); }
      }
    }
  }

  // ---------- latar kanvas (pillarbox / poster 9:16) ----------
  const GLOW = {};
  function drawBg(cx, t, id, theme, W, H) {
    cx.fillStyle = '#060409'; cx.fillRect(0, 0, W, H);
    const c = GLOW[id] || '70,130,255';
    if (!V) {
      const g = cx.createRadialGradient(960, 540, 600, 960, 540, 1150);
      g.addColorStop(0, `rgba(${c},.17)`); g.addColorStop(1, `rgba(${c},0)`);
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      return;
    }
    let g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1d0f33'); g.addColorStop(.45, '#0e0819'); g.addColorStop(1, '#08050d');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    cx.save(); cx.translate(540, 330); cx.rotate(t * .1);
    for (let i = 0; i < 18; i++) { cx.rotate(Math.PI * 2 / 18); cx.beginPath(); cx.moveTo(0, 0); cx.arc(0, 0, 1000, -.075, .075); cx.closePath(); cx.fillStyle = 'rgba(255,190,90,.045)'; cx.fill(); }
    cx.restore();
    g = cx.createRadialGradient(540, 880, 320, 540, 880, 820);
    g.addColorStop(0, `rgba(${c},.26)`); g.addColorStop(1, `rgba(${c},0)`);
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    cx.fillStyle = 'rgba(0,0,0,.2)';
    for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 1);
  }

  // ---------- hook per frame: transisi "lompatan pita", chroma, tracking, OSD ----------
  const INFO = {};
  function frame(id, lt, d, sec) {
    const o = overlay();
    const list = TLS(), info = INFO[id] || (INFO[id] = list.find((s) => s.id === id)), t = info.start + lt;
    const idx = list.indexOf(info), first = idx === 0, last = idx === list.length - 1;
    let g = first ? 1 - P(lt, 0, .55) : 1 - P(lt, 0, .24);
    if (!last) g = Math.max(g, P(lt, d - .1, d));
    g = cl(Math.max(g, sec._g || 0));
    const f = Math.floor(t * 30), jit = sec._jit || (sec._jit = sec.querySelector('.jit'));
    let tr = '', fl = '';
    if (g > .03) {
      const jy = (hash(f * 1.7) - .5) * 84 * g, jx = (hash(f * 2.3) - .5) * 30 * g, sk = (hash(f * 3.1) - .5) * 6 * g;
      tr = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) skewX(${sk.toFixed(2)}deg)`;
      fl = `brightness(${(1 + .35 * g).toFixed(3)}) saturate(${(1 + .5 * g).toFixed(3)})`;
    }
    const off = sec._off || 0; // TV dimatikan (0..1): gambar menyusut jadi garis lalu titik
    if (off > 0) {
      const k1 = E.in3(P(off, 0, .55)), k2 = E.in3(P(off, .55, 1));
      tr += ` scale(${(1 - .995 * k2).toFixed(4)}, ${(1 - .993 * k1).toFixed(4)})`;
      fl = `brightness(${(1 + 3 * k1).toFixed(2)})`;
    }
    if (jit) { jit.style.transform = tr; jit.style.filter = fl; }
    const ch = 2.3 + 12 * g + (sec._ch || 0);
    offR.setAttribute('dx', ch.toFixed(2)); offB.setAttribute('dx', (-ch).toFixed(2));
    drawTrack(o.cx, t, .12 + g * .95);
    o.roll.style.top = (((t * 130) % 1500) - 300).toFixed(1) + 'px';
    const s = Math.floor(t);
    o.ctr.textContent = `0:${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
    const cs = 20 * 3600 + 14 * 60 + 38 + t;
    o.bug.innerHTML = `${Math.floor(cs / 3600)}<i style="opacity:${Math.floor(t * 2) % 2 ? .3 : 1}">:</i>${pad2(Math.floor(cs % 3600 / 60))}`;
    const rec = !!sec._rec;
    o.play.style.display = rec ? 'none' : ''; o.rec.style.display = rec ? 'block' : 'none';
    o.dot.style.opacity = Math.floor(t * 2.4) % 2 ? .2 : 1;
    o.el.style.opacity = (1 - P(off, .15, .5)).toFixed(3);
    o.ctrBox.style.opacity = (1 - (sec._noCtr || 0)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 italic 20px Archivo', '800 italic 20px Archivo', '700 italic 20px Archivo', '600 italic 20px Archivo', '900 20px Archivo', '800 20px Archivo', '700 20px Archivo', '20px VT323'],
    themes: { vhs: ['#000', '#000', '#000', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'] },
    bg: drawBg,
    frame,
  });

  // =====================================================================================
  // Set kantor 90-an (S1 stres, S5 lega)
  // =====================================================================================
  function office(parent, bright) {
    const ticks = Array.from({ length: 12 }, (_, i) => `<i class="tk" style="transform:rotate(${i * 30}deg)"></i>`).join('');
    const leaves = [[-38, 0], [-18, 1], [4, 2], [26, 3], [44, 4]];
    const set = add(parent, `<div class="set">
      <div class="off-wall"></div>
      <div class="off-win"><i class="sun"></i><i class="cloud" style="left:28px;top:150px"></i><i class="cloud" style="left:170px;top:236px;transform:scale(.7)"></i>
        <div class="blinds" style="height:${bright ? 62 : 176}px"></div><i class="cord" style="height:${bright ? 110 : 250}px"></i></div>
      ${bright ? '' : `<div class="off-cal"><b>NOV</b><span>14</span><small>2026</small></div><div class="off-clock">${ticks}<i class="hh"></i><i class="mm"></i><i class="dot"></i></div>`}
      <div class="off-rail"></div>
      <div class="chr" style="z-index:5"><div class="torso"><i class="col l"></i><i class="col r"></i><i class="tie"></i></div><div class="neck"></div>
        <div class="head emo">${bright ? '😌' : '😐'}</div><div class="hand l emo">🤚</div><div class="hand r emo">🤚</div>
        <div class="sw emo" style="left:-190px;top:300px">💦</div><div class="sw emo" style="left:120px;top:290px">💦</div><div class="stars"></div></div>
      <div class="orbit"></div>
      <div class="off-desk" style="z-index:8"></div>
      <div class="off-papers" style="z-index:9"><i style="top:0;transform:rotate(-3deg)"></i><i style="top:9px;transform:rotate(2deg)"></i><i style="top:18px;transform:rotate(-1deg)"></i><i style="top:27px"></i></div>
      <div class="off-mug" style="z-index:9"><i class="stm"></i><i class="stm" style="left:52px"></i></div>
      <div class="off-mon" style="z-index:9"><div class="bd"><div class="scr"><div class="sheet"><b style="left:74px;top:50px">#REF!</b><b style="left:202px;top:122px">#REF!</b><b style="left:10px;top:170px">#N/A</b><i class="cur"></i></div></div><i class="led"></i></div><i class="neck"></i><i class="ft"></i></div>
      <div class="off-plant" style="z-index:9">${leaves.map(([r], i) => `<i class="lf" data-r="${r}" style="height:${100 + (i % 3) * 22}px"></i>`).join('')}<div class="pot"></div></div>
    </div>`);
    const q = (s) => $(s, set);
    return {
      set, head: q('.chr .head'), chr: q('.chr'), hands: [q('.hand.l'), q('.hand.r')], sweat: [...set.querySelectorAll('.chr .sw')], stars: q('.chr .stars'),
      orbit: q('.orbit'), mm: q('.off-clock .mm'), hh: q('.off-clock .hh'), cur: q('.off-mon .cur'), steam: [...set.querySelectorAll('.stm')],
      leaves: [...set.querySelectorAll('.lf')], scr: q('.off-mon .scr'), sheet: q('.off-mon .sheet'),
    };
  }
  function officeTick(O, lt, stress, bright) {
    if (O.mm) { const a = lt * (bright ? 20 : 140 + 260 * stress); O.mm.style.transform = `rotate(${a.toFixed(1)}deg)`; O.hh.style.transform = `rotate(${(a / 12 + 40).toFixed(1)}deg)`; }
    if (O.cur) { const s = Math.floor(lt * (2 + 6 * stress)); at(O.cur, 10 + Math.floor(hash(s * 1.3) * 5) * 64, 10 + Math.floor(hash(s * 2.9) * 8) * 24); }
    O.steam.forEach((e, i) => { const ph = (lt * .8 + i * .5) % 1; tfs(e, `translate(${(Math.sin(lt * 3 + i) * 6).toFixed(1)}px, ${(-ph * 40).toFixed(1)}px) scaleY(${(.7 + ph * .6).toFixed(2)})`); op(e, (Math.sin(ph * Math.PI) * .9).toFixed(2)); });
    O.leaves.forEach((e, i) => {
      const r0 = +e.dataset.r, droop = bright ? 0 : 1;
      const r = r0 * (1 + droop * .9) + (droop ? (i < 2 ? -40 : i > 2 ? 40 : 18) : 0) + Math.sin(lt * 1.6 + i) * (bright ? 4 : 2);
      tfs(e, `rotate(${r.toFixed(1)}deg)`);
    });
  }
  const pillEl = (n, text, emo) => h(`<div class="pill"><span class="no">${n}</span><span>${esc(text)}</span>${emo ? `<span class="emo sp">${emo}</span>` : ''}</div>`);
  const counterEl = (html, color = '#7dffb0') => h(`<div class="ab" style="left:0;right:0;top:18px;text-align:center"><span style="display:inline-block;padding:12px 34px 14px;border-radius:18px;background:rgba(0,0,0,.55);border:3px solid ${color}88;font:400 64px/1 VT323,monospace;color:${color};letter-spacing:.04em;text-shadow:0 0 14px ${color}99,3px 0 0 rgba(255,50,70,.45),-3px 0 0 rgba(40,190,255,.45)">${html}</span></div>`);

  // =====================================================================================
  // S1 · karakter stres dikelilingi file RoPA_final...
  // =====================================================================================
  KIT.registerType('n4kantor', (root, v, sc, tm, T) => {
    GLOW[sc.id] = '110,220,200';
    const S = tvScene(root), O = office(S.cam, false);
    const tF = T(v.familiarAt, 6.9);
    const omega = (t) => .55 * t + .075 * t * t + 1.6 * Math.pow(Math.max(0, t - tF), 2);
    const files = v.files.map((f, i) => {
      const el = fileCard(f.text); O.orbit.appendChild(el);
      return { el, t: T(f.at, .5 + i * .6), c: (f.slot ?? i) * Math.PI / 4 };
    });
    const faces = v.faces.map((f) => ({ t: T(f.at, 0), e: f.e }));
    const tHands = T(v.handsAt, 4.5), tSweat = T(v.sweatAt, 5.7);
    const dz = [0, 1, 2].map(() => add(O.stars, '<div class="emo" style="position:absolute;font-size:70px;width:80px;height:80px;margin:-40px 0 0 -40px;text-align:center;line-height:80px">💫</div>'));
    const fam = WA(v.familiar || 'FAMILIAR?', { size: 150, stretch: 118 });
    at(fam.el, 0, 818); S.fg.appendChild(fam.el);
    const z1 = WA(v.top || 'SERING\nMENGALAMI INI?', { size: 96, stretch: 100 });
    at(z1.el, 0, 30); S.zt.appendChild(z1.el);
    const cnt = add(S.zb, counterEl('<span class="emo" style="font-size:50px;vertical-align:4px;margin-right:14px">📂</span>FILE RoPA: <b style="font-weight:400;color:#fff">0</b>'));
    const cntB = $('b', cnt);
    return (lt, d) => {
      const stress = E.io3(P(lt, .4, tF));
      officeTick(O, lt, stress, false);
      let fi = 0; faces.forEach((f, i) => { if (lt >= f.t) fi = i; });
      const fc = faces[fi];
      if (O.head.textContent !== fc.e) O.head.textContent = fc.e;
      const ks = P(lt, fc.t, fc.t + .28), sq = fi ? 1 - E.outBack(ks) : 0;
      const qt = Math.floor(lt * 15) / 15, A = 1.2 + 9 * stress;
      const jx = (hash(qt * 33.1) - .5) * 2 * A, jy = (hash(qt * 17.7) - .5) * 2 * A;
      O.head.style.transform = `translate(${jx.toFixed(1)}px, ${(jy + Math.sin(lt * 2.2) * 4).toFixed(1)}px) rotate(${(Math.sin(lt * 1.4) * 3 * (1 + stress)).toFixed(2)}deg) scale(${(1 + .22 * sq).toFixed(3)}, ${(1 - .14 * sq).toFixed(3)})`;
      O.hands.forEach((e, i) => {
        const k = ob(P(lt, tHands + i * .08, tHands + i * .08 + .4)), wig = Math.sin(lt * 18 + i * 2) * 5 * stress;
        e.style.opacity = k > 0 ? 1 : 0;
        e.style.transform = `translate(${(jx * .6).toFixed(1)}px, ${((1 - k) * 120 + jy * .6).toFixed(1)}px) rotate(${((i ? -1 : 1) * (22 + wig)).toFixed(1)}deg) scale(${((i ? -1 : 1) * Math.max(0, k)).toFixed(3)}, ${Math.max(0, k).toFixed(3)})`;
      });
      O.sweat.forEach((e, i) => {
        const per = .7, ph = lt < tSweat ? -1 : ((lt - tSweat + i * .35) % per) / per;
        if (ph < 0 || lt > tF + .4) { e.style.opacity = 0; return; }
        const dir = i ? 1 : -1;
        e.style.opacity = (1 - ph).toFixed(2);
        e.style.transform = `translate(${(dir * ph * 120).toFixed(1)}px, ${(-60 * Math.sin(ph * Math.PI) + ph * 60).toFixed(1)}px) rotate(${(dir * ph * 40).toFixed(1)}deg) scale(${(.7 + .5 * ph).toFixed(2)})`;
      });
      dz.forEach((e, i) => {
        const k = P(lt, tF + .1, tF + .4), a = lt * 5 + i * 2.09;
        e.style.opacity = k;
        e.style.transform = `translate(${(Math.cos(a) * 150).toFixed(1)}px, ${(Math.sin(a) * 34 - 60).toFixed(1)}px) scale(${((.6 + .4 * k) * (.8 + .2 * Math.sin(a))).toFixed(3)})`;
      });
      // file mengorbit kepala (depan/belakang), makin lama makin cepat
      let n = 0, lastT = 0;
      files.forEach((f) => {
        const k = P(lt, f.t, f.t + .35);
        if (k <= 0) { f.el.style.opacity = 0; return; }
        n++; lastT = f.t;
        const w = wOf(f.el, 300); if (!f.h && f.el.offsetHeight) f.h = f.el.offsetHeight;
        const phi = omega(lt) + f.c, dep = Math.sin(phi);
        const x = 720 + Math.cos(phi) * 545 - w / 2, y = 405 + dep * 138 - (f.h || 70) / 2;
        const s = (.78 + .22 * (dep + 1) / 2) * Math.max(0, E.outBack(k));
        f.el.style.zIndex = dep > 0 ? 6 : 4;
        f.el.style.opacity = dep > 0 ? 1 : .88;
        f.el.style.filter = dep > 0 ? 'none' : `brightness(${(.85 + .15 * (dep + 1)).toFixed(2)})`;
        f.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(Math.cos(phi) * -7).toFixed(2)}deg) scale(${s.toFixed(3)})`;
      });
      cntB.textContent = n;
      // kamera: dorong pelan, lalu "zoom punch" ke wajah saat "Familiar?"
      const kz = E.outBack(P(lt, tF - .04, tF + .34));
      const z = lerp(1 + .045 * P(lt, 0, tF), 1.34, kz), ty = lerp(0, 64, kz);
      const shk = lt > tF && lt < tF + .35 ? (1 - (lt - tF) / .35) * 12 : 0;
      S.cam.style.transform = `translate(${((hash(lt * 91) - .5) * shk).toFixed(1)}px, ${(ty + (hash(lt * 71) - .5) * shk).toFixed(1)}px) scale(${z.toFixed(4)})`;
      S.sec._g = files.reduce((a, f) => Math.max(a, lt >= f.t ? .3 * (1 - P(lt, f.t, f.t + .12)) : 0), 0);
      centerX(fam.el, 1440);
      waIn(fam, lt, tF + .06, { stagger: .035, dur: .38 });
      fam.el.style.transform = `translateY(${(Math.sin(lt * 4.2) * 6).toFixed(1)}px) rotate(${(-3 + Math.sin(lt * 2.6) * 1.5).toFixed(2)}deg)`;
      centerX(z1.el, 1080);
      waIn(z1, lt, .15, { stagger: .03 });
      z1.el.style.transform = `translateY(${(Math.sin(lt * 1.8) * 4).toFixed(1)}px)`;
      tfs(cnt, `scale(${(1 + .12 * (n ? 1 - P(lt, lastT, lastT + .25) : 0)).toFixed(3)})`);
    };
  });

  // =====================================================================================
  // S2 · "PUSING?" + isi minimal RoPA (PP 33/2026 Ps. 74) sebagai "gejala"
  // =====================================================================================
  const HEAD_PATH = 'M300,470 L300,392 C318,352 350,300 352,236 C356,150 300,62 204,52 C124,44 70,96 62,160 C58,188 60,200 54,214 C46,230 30,246 34,258 C38,268 54,266 58,272 C54,282 50,290 58,296 C52,304 56,314 62,318 C60,330 62,346 70,356 C80,368 110,370 140,372 C164,374 180,384 186,400 L190,470 Z';
  const meter = (cls) => h(`<div class="pz-meter ${cls}"><div class="lb"><span>TINGKAT PUSING</span><b></b></div><div class="bar">${'<i></i>'.repeat(10)}</div></div>`);
  function meterTick(m, lt, t0, t1) {
    const lvl = lt < t0 ? 0 : Math.min(10, 1 + Math.floor(9.999 * E.io3(P(lt, t0, t1)))), max = lvl >= 10;
    const blink = max && Math.floor((lt - t1) * 5) % 2 === 0;
    m.querySelectorAll('.bar i').forEach((e, i) => {
      const col = i < 4 ? '#3ee79b' : i < 7 ? '#ffe14d' : '#ff3b3b';
      e.style.background = i < lvl ? (max && !blink ? '#fff' : col) : 'rgba(255,255,255,.12)';
      e.style.boxShadow = i < lvl ? `0 0 12px ${col}` : 'none';
    });
    const b = $('.lb b', m);
    b.textContent = max ? 'MAX!' : lvl ? `${lvl * 10}%` : '';
    b.style.opacity = max && blink ? .25 : 1;
  }
  KIT.registerType('n4pusing', (root, v, sc, tm, T) => {
    GLOW[sc.id] = '60,110,255';
    const S = tvScene(root);
    add(S.cam, '<div class="set"><div class="pz-bg"></div><div class="pz-rays"></div></div>');
    const ttl = WA('PUSING?', { size: 172, stretch: 112, cls: 'hot pz-ttl' });
    S.cam.appendChild(ttl.el);
    ttl.el.style.transformOrigin = '6% 80%';
    const pp = add(S.cam, `<div class="pz-pp"><i>§</i>${esc(v.pp)}<small>${esc(v.ppSmall || '')}</small></div>`);
    const list = add(S.cam, '<div class="pz-list"></div>');
    const rows = v.rows.map((r) => ({ el: add(list, `<div class="pz-row"><div class="bl">${BOLT}</div><div class="tx">${esc(r.text)}</div></div>`), t: T(r.at, 1) }));
    const foot = add(S.cam, `<div class="pz-foot">${esc(v.foot || '')}</div>`);
    const gid = 'hg' + (++UID);
    const head = add(S.cam, `<div class="pz-head"><svg viewBox="0 0 400 470"><defs>
        <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9f2ff" stop-opacity=".55"/><stop offset="1" stop-color="#5aa9ff" stop-opacity=".25"/></linearGradient>
        <radialGradient id="${gid}r"><stop offset="0" stop-color="#fff2b0"/><stop offset=".25" stop-color="#ff5a3a"/><stop offset=".7" stop-color="#e3001b" stop-opacity=".55"/><stop offset="1" stop-color="#e3001b" stop-opacity="0"/></radialGradient>
        <clipPath id="${gid}c"><path d="${HEAD_PATH}"/></clipPath></defs>
      <path d="${HEAD_PATH}" fill="url(#${gid})" stroke="#e6f6ff" stroke-width="6" stroke-linejoin="round" style="filter:drop-shadow(0 0 14px rgba(160,220,255,.9))"/>
      <g clip-path="url(#${gid}c)"><circle class="pain" cx="150" cy="170" r="120" fill="url(#${gid}r)"/></g>
      <circle class="ring" cx="150" cy="170" r="60" fill="none" stroke="#ff5a3a" stroke-width="6"/>
      <circle class="ring" cx="150" cy="170" r="60" fill="none" stroke="#ffd23f" stroke-width="4"/>
      ${[[40, 60, -20], [8, 150, -60], [150, 10, 10], [250, 30, 30]].map(([x, y, r]) => `<g class="bolt" transform="translate(${x} ${y}) rotate(${r}) scale(1.7)"><path d="M3-31L-9-12H-1L-4 0L9-19H1Z" fill="#ffe14d" stroke="#c1121f" stroke-width="2.2" stroke-linejoin="round"/></g>`).join('')}
    </svg></div>`);
    const pain = $('.pain', head), rings = [...head.querySelectorAll('.ring')], bolts = [...head.querySelectorAll('.bolt')];
    const mIn = add(S.cam, meter('in'));
    const wins = v.wins.map((w) => {
      const el = add(S.cam, win(w.title, `<div class="grid"><div class="hdr"></div>${(w.errs || []).map((e) => `<b style="left:${e[0]}px;top:${e[1]}px">${esc(e[2])}</b>`).join('')}</div>`));
      const p = V ? w.v : w.h; at(el, p[0], p[1]);
      return { el, t: T(w.at, 6), r: p[2] || 0 };
    });
    const dlg = add(S.cam, win(v.dlg.title, `<div class="msg"><div class="wi">${WARN}</div><div>${esc(v.dlg.text)}</div></div><div class="btns"><i>OK</i></div>`, 'pz-dlg'));
    at(dlg, 340, pick(560, 470));
    const zt = WA('PUSING?', { size: 162, stretch: 112, cls: 'hot' });
    at(zt.el, 0, 40); S.zt.appendChild(zt.el);
    zt.el.style.transformOrigin = '8% 80%';
    const mZ = add(S.zb, meter('zm'));
    const tS = T(v.scatterAt, 5.6), tDlg = T(v.dlg.at, 7.8), tR = T(v.droopAt, 8.4), tPP = T(v.ppAt, .5);
    return (lt, d) => {
      // "PUSING?" berdenyut seperti sakit kepala; di "repot" judul melorot (engsel kiri)
      const beat = Math.exp(-((lt % .8) / .11)) + .6 * Math.exp(-(((lt + .2) % .8) / .1));
      const droop = lt < tR ? 0 : E.outElastic(P(lt, tR, tR + 1.3));
      [ttl, zt].forEach((w, i) => {
        if (i) centerX(w.el, 1080);
        waIn(w, lt, .06, { stagger: .05, dur: .4, drop: .8, spin: 24 });
        w.el.style.transform = `rotate(${(droop * 13).toFixed(2)}deg) scale(${(1 + .025 * beat * (lt < tR ? 1 : 0)).toFixed(4)})`;
      });
      const kp = ob(P(lt, tPP, tPP + .4));
      pp.style.opacity = cl(kp * 2); pp.style.transform = `translateX(${((1 - kp) * -60).toFixed(1)}px)`;
      rows.forEach((r, i) => {
        const k = P(lt, r.t - .04, r.t + .34), kb = E.outBack(k);
        const ks = ob(P(lt, tS + i * .045, tS + i * .045 + .5));
        const dx = (hash(i * 3.3 + 1) - .5) * 110 * ks, dy = (hash(i * 5.1 + 2) - .5) * 26 * ks, rr = (hash(i * 7.7 + 3) - .5) * 13 * ks;
        const wob = k >= 1 ? Math.sin(lt * 7 + i) * .6 : 0;
        r.el.style.opacity = cl(k * 2.5);
        r.el.style.transform = `translate(${((1 - kb) * -120 + dx).toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${(rr + wob * (lt > tS ? 1 : .3)).toFixed(2)}deg)`;
        r.el.style.filter = lt > tS ? `saturate(${(1 - .5 * ks).toFixed(2)})` : 'none';
        const kf = 1 - P(lt, r.t, r.t + .5);
        r.el.firstChild.style.transform = `scale(${(1 + .35 * kf + .08 * beat).toFixed(3)})`;
      });
      const tl = rows[rows.length - 1].t;
      foot.style.opacity = P(lt, tl + .2, tl + .6);
      const kh = E.out3(P(lt, .1, .7));
      head.style.opacity = kh; head.style.transform = `translateX(${((1 - kh) * 80).toFixed(1)}px) scale(${(1 + .015 * beat).toFixed(4)})`;
      pain.setAttribute('r', (95 + 40 * beat).toFixed(1));
      rings.forEach((rg, i) => { const ph = ((lt + i * .4) % .8) / .8; rg.setAttribute('r', (50 + 150 * ph).toFixed(1)); rg.style.opacity = ((1 - ph) * .9).toFixed(2); });
      const qf = Math.floor(lt * 10);
      bolts.forEach((b, i) => { b.style.opacity = hash(qf * 1.3 + i * 7) > .38 ? 1 : 0; });
      meterTick(mIn, lt, .5, tR);
      meterTick(mZ, lt, .5, tR);
      wins.forEach((w) => {
        const k = P(lt, w.t, w.t + .4), kb = E.outBack(k);
        w.el.style.opacity = k > 0 ? 1 : 0;
        w.el.style.transform = `rotate(${(w.r + (1 - kb) * 10).toFixed(2)}deg) scale(${Math.max(0, lerp(.4, 1, kb)).toFixed(3)})`;
      });
      const kd = P(lt, tDlg, tDlg + .3), shk = lt > tDlg && lt < tDlg + .45 ? Math.sin((lt - tDlg) * 70) * 14 * (1 - (lt - tDlg) / .45) : 0;
      dlg.style.opacity = kd > 0 ? 1 : 0;
      dlg.style.transform = `translateX(${shk.toFixed(1)}px) scale(${Math.max(0, lerp(.5, 1, E.outBack(kd))).toFixed(3)})`;
      S.cam.style.transform = `scale(${(1 + .03 * P(lt, 0, d)).toFixed(4)})`;
      S.sec._g = lt >= tDlg ? .5 * (1 - P(lt, tDlg, tDlg + .14)) : 0;
    };
  });

  // =====================================================================================
  // S3 · PACKSHOT kotak obat 3D → layar demo (screenshot asli) + callout
  // =====================================================================================
  function studio(parent) {
    add(parent, '<div class="set"><div class="ps-bg"></div></div>');
    const rays = add(parent, '<div class="ps-rays"></div>');
    add(parent, '<div class="ps-floor"></div>');
    const glow = add(parent, '<div class="ps-glow"></div>');
    const shadow = add(parent, '<div class="ps-shadow"></div>');
    return {
      rays, glow, shadow,
      place(x, y, s, lt, g = 1) {
        at(shadow, x, y + 285 * s); shadow.style.transform = `scale(${(s * (.9 + .05 * Math.sin(lt * 1.6))).toFixed(3)})`;
        at(glow, x, y); glow.style.transform = `scale(${(s * (1 + .06 * Math.sin(lt * 3))).toFixed(3)})`; glow.style.opacity = g.toFixed(2);
        at(rays, x, y); rays.style.transform = `rotate(${(lt * 9).toFixed(2)}deg)`;
      },
    };
  }
  KIT.registerType('n4packshot', (root, v, sc, tm, T) => {
    GLOW[sc.id] = '80,140,255';
    const S = tvScene(root), st = studio(S.cam);
    const D = demoScreen(v.demo, T); S.cam.appendChild(D.el);
    const B = box3d(); S.cam.appendChild(B.el);
    const bu = add(S.cam, burst(v.burst || 'BARU!'));
    const spk = sparkles(S.cam, [[430, 250, 1.1], [1040, 300, .8], [980, 700, 1], [420, 760, .7], [560, 140, .6], [880, 180, .9]]);
    const LH = lihat(S.fg);
    const fl = add(S.fg, '<div class="flare"><i class="streak"></i><i class="core"></i><i class="gh" style="width:90px;height:90px;margin:-45px"></i><i class="gh" style="width:150px;height:150px;margin:-75px"></i></div>');
    const ghosts = [...fl.querySelectorAll('.gh')];
    // callout: 16:9 bertumpuk di kolom kiri; 9:16 bergantian di zona bawah
    const pills = v.pills.map((p, i) => ({ el: V ? add(S.zb, pillEl(i + 1, p.text, p.emo)) : add(S.cam, pillEl(i + 1, p.text, p.emo)), t: T(p.at, 3 + i), p }));
    const mra = add(V ? S.zb : S.cam, `<div class="mra">${v.mra.map((m, i) => `${i ? '<svg class="ar" viewBox="0 0 44 30"><path d="M4 15H36M26 5l10 10-10 10" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}<div class="st"><span class="ic">${icon(m.icon, 34, 2.4)}</span>${esc(m.text)}</div>`).join('')}</div>`);
    const mst = [...mra.querySelectorAll('.st')], mar = [...mra.querySelectorAll('.ar')], mt = v.mra.map((m) => T(m.at, 7));
    const tIn = T(v.boxAt, .05), tBurst = T(v.burstAt, 1.3), tDemo = T(v.demoAt, 2.1);
    const z1 = WA(v.top || 'KINI HADIR!', { size: 118, stretch: 112 });
    at(z1.el, 0, 64); S.zt.appendChild(z1.el);
    const zsub = V ? add(S.zb, `<div class="ab" style="left:40px;right:40px;top:14px;text-align:center;font-family:Archivo;font-weight:800;font-style:italic;font-stretch:92%;font-size:44px;line-height:1.12;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.4)">${v.bottom || ''}</div>`) : null;
    // posisi: [x, y, skala] kotak saat hero & saat demo; monitor [x, y, skala]
    const L = V ? v.layout.v : v.layout.h;
    return (lt, d) => {
      const kin = E.outExpo(P(lt, tIn, tIn + 1.25)), kd = E.io3(P(lt, tDemo, tDemo + .75));
      const ry = lerp(-560, -24, kin) + Math.sin(lt * .9) * 8 * kin, rx = -11 + Math.sin(lt * .7) * 2.5;
      const bx = lerp(L.hero[0], L.box[0], kd), by = lerp(L.hero[1], L.box[1], kd) + Math.sin(lt * 1.6) * 8;
      const bs = lerp(lerp(.25, L.hero[2], kin), L.box[2], kd);
      const gk = ((lt - tIn - 1.1) % 3.2) / 1.1;
      B.set(bx, by, bs, ry, rx, lt > tIn + 1.1 && gk < 1 ? gk : -1);
      st.place(bx, by, bs, lt, .9 - .4 * kd);
      spk(lt, 1 - kd * .6);
      // lens flare melintas saat kotak mendarat
      const kf = P(lt, tIn + .55, tIn + 1.5), fxp = lerp(360, 1100, E.io3(kf)), fyp = lerp(300, 380, kf);
      at(fl, fxp, fyp); fl.style.opacity = (Math.sin(kf * Math.PI) * .95).toFixed(3);
      ghosts.forEach((g, i) => { at(g, (720 - fxp) * (i ? 1.1 : .55), (470 - fyp) * (i ? 1.1 : .55)); });
      const kb = P(lt, tBurst, tBurst + .45);
      at(bu, bx + 175 * bs, by - 235 * bs);
      bu.style.opacity = kb > 0 ? 1 : 0;
      bu.style.transform = `rotate(${(lt * 20).toFixed(1)}deg) scale(${(Math.max(0, E.outElastic(kb)) * lerp(1, L.burst, kd) * (1 + .05 * Math.sin(lt * 7))).toFixed(3)})`;
      $('b', bu).style.transform = `rotate(${(-14 - lt * 20).toFixed(1)}deg)`;
      // monitor demo meluncur masuk
      const km = E.out3(P(lt, tDemo, tDemo + .7));
      const mx = lerp(1500, L.mon[0], km), my = L.mon[1];
      at(D.el, mx, my);
      D.el.style.opacity = km > 0 ? 1 : 0;
      D.el.style.transformOrigin = '0 0';
      D.el.style.transform = `scale(${L.mon[2]}) rotate(${((1 - km) * 8).toFixed(2)}deg)`;
      const mk = D.update(lt);
      if (mk && km >= 1) LH(lt, mk, mx + 46 * L.mon[2], my + 44 * L.mon[2], L.mon[2]); else LH(lt, null);
      pills.forEach((p, i) => {
        const k = ob(P(lt, p.t, p.t + .45));
        const next = V ? (pills[i + 1] ? pills[i + 1].t : mt[0] - .35) : 99, kx = V ? E.in3(P(lt, next - .15, next + .1)) : 0;
        if (V) at(p.el, (1080 - wOf(p.el, 500)) / 2, 22); else at(p.el, p.p.h[0], p.p.h[1]);
        p.el.style.opacity = cl(k * 2) * (1 - kx);
        p.el.style.transform = `translateX(${((1 - k) * -80 - kx * 80).toFixed(1)}px) rotate(${((V ? 0 : p.p.h[2] || 0) + Math.sin(lt * 2 + i) * .8).toFixed(2)}deg) scale(${(.6 + .4 * Math.max(0, k)).toFixed(3)})`;
      });
      if (V) at(mra, (1080 - wOf(mra, 930)) / 2, 26); else at(mra, v.mraPos[0], v.mraPos[1]);
      const k0 = E.out3(P(lt, mt[0] - .35, mt[0]));
      mra.style.opacity = k0; mra.style.transform = `translateY(${((1 - k0) * 40).toFixed(1)}px)`;
      mst.forEach((e, i) => {
        const on = lt >= mt[i]; e.classList.toggle('on', on);
        const kk = P(lt, mt[i], mt[i] + .3);
        e.style.transform = `scale(${on ? (1 + .12 * (1 - E.outBack(kk))).toFixed(3) : 1})`;
        if (i) mar[i - 1].classList.toggle('on', on);
      });
      S.cam.style.transform = `scale(${(1.02 + .03 * P(lt, 0, d)).toFixed(4)})`;
      S.sec._g = lt >= tDemo ? .8 * (1 - P(lt, tDemo, tDemo + .22)) : 0;
      S.sec._ch = -.9 * km;
      centerX(z1.el, 1080);
      waIn(z1, lt, .2, { stagger: .04 });
      z1.el.style.transform = `scale(${(1 + .03 * Math.sin(lt * 5)).toFixed(4)})`;
      if (zsub) { const kz = E.out3(P(lt, tBurst, tBurst + .5)) * (1 - E.in3(P(lt, pills[0].t - .3, pills[0].t))); zsub.style.opacity = kz; zsub.style.transform = `translateY(${((1 - kz) * 20).toFixed(1)}px)`; }
    };
  });

  // =====================================================================================
  // S4 · "CARA KERJA" ala animasi medis: lensa pada Data Spesifik (asli) → Risiko TINGGI → Draf DPIA (asli)
  // =====================================================================================
  KIT.registerType('n4cara', (root, v, sc, tm, T) => {
    GLOW[sc.id] = '40,160,255';
    const S = tvScene(root);
    add(S.cam, '<div class="set"><div class="ck-bg"></div></div>');
    const grid = add(S.cam, '<div class="ck-grid"></div>');
    const ttl = WA(v.title || 'CARA KERJA', { size: 100, stretch: 118, cls: 'chrome ck-ttl' });
    S.cam.appendChild(ttl.el);
    const sub = add(S.cam, `<div class="ck-sub">${esc(v.sub || '')}</div>`);
    const Y = pick(620, 530), X = [300, 745, 1188];
    const NS = 'http://www.w3.org/2000/svg';
    const svg = add(S.cam, `<svg class="ck-svg" viewBox="0 0 1440 1080"><defs><filter id="ckg${++UID}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs></svg>`);
    const gf = `url(#ckg${UID})`;
    const ends = [[X[0] + 200, X[1] - 128], [X[1] + 128, X[2] - 176]];
    const tubes = ends.map(([x0, x1], i) => {
      const mx = (x0 + x1) / 2, d = `M${x0},${Y - 20} C${x0 + 40},${Y - 190} ${x1 - 40},${Y - 190} ${x1},${Y - 20}`;
      const mk = (w, c, o, extra) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); p.style.opacity = o; if (extra) p.setAttribute('filter', extra); svg.appendChild(p); return p; };
      const glass = [mk(40, 'rgba(160,230,255,.3)', 1), mk(30, 'rgba(10,40,90,.55)', 1)];
      const dash = (p) => { p.setAttribute('pathLength', '1'); p.setAttribute('stroke-dasharray', '1'); p.setAttribute('stroke-dashoffset', '1'); return p; };
      const glow = dash(mk(24, i ? '#ff4040' : '#3cc8ff', .75, gf)), fill = dash(mk(12, i ? '#ff7b7b' : '#8ae9ff', 1));
      const parts = Array.from({ length: 6 }, () => { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 9); c.setAttribute('fill', '#fff'); c.style.filter = `drop-shadow(0 0 10px ${i ? '#ff5050' : '#5fd8ff'})`; svg.appendChild(c); return c; });
      return { fill, glow, parts, glass, t: T(v.tubes[i].at, 1.3 + i * 2.3), mx };
    });
    // lensa pembesar pada daftar Data Pribadi Spesifik (screenshot asli)
    const n1 = v.n1, LS = 430;
    const lens = at(add(S.cam, `<div class="ck-lens"><div class="view">${shotImg(n1)}</div><div class="hl"></div><i class="cx"></i><i class="cy"></i><i class="gl"></i></div>`), X[0], Y);
    const handle = at(add(S.cam, '<div class="ck-handle"></div>'), X[0] + 150, Y + 150);
    S.cam.insertBefore(handle, lens);
    const lview = $('.view', lens), lhl = $('.hl', lens);
    const n2 = at(add(S.cam, '<div class="ck-node"><div class="ring"></div><div class="ck-tinggi"><small>RISIKO</small>TINGGI</div></div>'), X[1], Y);
    const n3 = at(add(S.cam, `<div class="ck-doc"><div class="cap">${esc(v.n3.cap || 'DPIA')}</div><div class="win2"><div class="view">${shotImg(v.n3)}</div></div><div class="stp">DRAF</div></div>`), X[2], Y);
    { const r = v.n3.r; $('.view', n3).style.transform = viewTf(r, 320).tf; }
    const lbls = [v.n1, v.n2, v.n3].map((n, i) => at(add(S.cam, `<div class="ck-lbl">${esc(n.label)}${n.small ? `<small>${esc(n.small)}</small>` : ''}</div>`), X[i], Y + [236, 150, 262][i]));
    const chips = v.tubes.map((tb) => add(S.cam, `<div class="ck-chip">${tb.emo ? `<span class="emo">${tb.emo}</span>` : ''}${esc(tb.chip)}</div>`));
    const note = add(S.cam, `<div class="ck-note">${esc(v.note || '*Ilustrasi')}</div>`);
    const tN = [T(n1.at, .4), T(v.n2.at, 1.9), T(v.n3.at, 4.4)], tRed = T(v.n2.redAt, 2.3), tStamp = T(v.n3.stampAt, 4.8), tMark = T(n1.markAt, .9);
    const z1 = WA(v.title || 'CARA KERJA', { size: 126, stretch: 118, cls: 'chrome' });
    at(z1.el, 0, 70); S.zt.appendChild(z1.el);
    const z2 = WA(v.zb || 'OTOMATIS!', { size: 104, stretch: 118 });
    at(z2.el, 0, 14); S.zb.appendChild(z2.el);
    const tZ2 = T(v.zbAt, 1.2);
    return (lt, d) => {
      grid.style.transform = `translate(${((lt * 22) % 80).toFixed(1)}px, ${((lt * 14) % 80).toFixed(1)}px)`;
      waIn(ttl, lt, .05, { stagger: .04 });
      sub.style.opacity = E.out3(P(lt, .35, .8)).toFixed(3);
      // lensa: pindai pelan daftar data spesifik, lalu sorot "kesehatan"
      const r0 = n1.r0, r1 = n1.r1, e = E.io3(P(lt, tN[0], tMark + .2)), r = r0.map((x, j) => lerp(x, r1[j], e));
      const { k, tf } = viewTf(r, LS - 18);
      lview.style.transform = tf;
      const m = n1.mark, km = ob(P(lt, tMark, tMark + .35));
      Object.assign(lhl.style, { left: ((m[0] - r[0]) * k).toFixed(1) + 'px', top: ((m[1] - r[1]) * k).toFixed(1) + 'px', width: (m[2] * k).toFixed(1) + 'px', height: (m[3] * k).toFixed(1) + 'px',
        opacity: cl(km * 2), transform: `scale(${(lerp(1.3, 1, km) * (1 + .03 * Math.sin(lt * 9))).toFixed(3)})` });
      [lens, n2, n3].forEach((n, i) => {
        const kk = P(lt, tN[i], tN[i] + .45), kb = E.outBack(kk), bob = Math.sin(lt * 2 + i * 1.3) * 6;
        n.style.opacity = kk > 0 ? 1 : 0;
        n.style.transform = `translateY(${bob.toFixed(1)}px) scale(${Math.max(0, kb).toFixed(3)})`;
        const kl = E.out3(P(lt, tN[i] + .15, tN[i] + .6));
        lbls[i].style.opacity = kl; lbls[i].style.transform = `translateY(${((1 - kl) * 24).toFixed(1)}px)`;
      });
      const kh = P(lt, tN[0], tN[0] + .45);
      handle.style.opacity = kh > 0 ? 1 : 0;
      handle.style.transform = `translateY(${(Math.sin(lt * 2) * 6).toFixed(1)}px) rotate(45deg) scaleX(${Math.max(0, E.outBack(kh)).toFixed(3)})`;
      const red = lt >= tRed; n2.classList.toggle('red', red);
      const siren = red ? .5 + .5 * Math.sin((lt - tRed) * 14) : 0, rp = ((lt - tRed) * 1.6) % 1;
      $('.ring', n2).style.transform = `scale(${(1 + .35 * (red ? rp : 0)).toFixed(3)})`;
      $('.ring', n2).style.opacity = red ? (1 - rp).toFixed(2) : .5;
      $('.ck-tinggi', n2).style.opacity = red ? 1 : .3;
      $('.ck-tinggi', n2).style.transform = `scale(${red ? (1 + .12 * (1 - E.outBack(P(lt, tRed, tRed + .3))) + .03 * siren).toFixed(3) : .9})`;
      n2.style.boxShadow = red ? `0 0 ${(40 + 50 * siren).toFixed(0)}px rgba(255,60,60,${(.5 + .4 * siren).toFixed(2)}), inset 0 0 44px rgba(255,80,80,.45)` : '';
      const kst = P(lt, tStamp - .05, tStamp + .15);
      $('.stp', n3).style.opacity = kst > 0 ? 1 : 0;
      $('.stp', n3).style.transform = `rotate(-10deg) scale(${lerp(2.4, 1, E.outExpo(kst)).toFixed(3)})`;
      tubes.forEach((tb, i) => {
        const kf = E.io3(P(lt, tb.t, tb.t + .6)), kg = E.out3(P(lt, tN[i] + .25, tN[i] + .7));
        tb.glass.forEach((g) => { g.style.opacity = kg.toFixed(3); });
        tb.fill.setAttribute('stroke-dashoffset', (1 - kf).toFixed(3)); tb.glow.setAttribute('stroke-dashoffset', (1 - kf).toFixed(3));
        const Ln = tb.fill.getTotalLength();
        tb.parts.forEach((c, j) => {
          const ph = ((lt - tb.t) * 1.1 + j / tb.parts.length) % 1;
          if (lt < tb.t + .15 || !Ln) { c.style.opacity = 0; return; }
          const pt = tb.fill.getPointAtLength(ph * Ln * kf);
          c.setAttribute('cx', pt.x.toFixed(1)); c.setAttribute('cy', pt.y.toFixed(1));
          c.style.opacity = (Math.sin(ph * Math.PI) * cl((lt - tb.t - .15) * 3)).toFixed(2);
        });
        const kc = ob(P(lt, tb.t, tb.t + .4)), ch = chips[i];
        at(ch, tb.mx - (i ? 34 : 0) - wOf(ch, 220) / 2, Y - 284 + Math.sin(lt * 3 + i) * 5);
        ch.style.opacity = cl(kc * 2); ch.style.transform = `scale(${Math.max(0, kc).toFixed(3)})`;
      });
      note.style.opacity = P(lt, .6, 1);
      S.cam.style.transform = `translateX(${lerp(30, -30, E.io3(P(lt, 0, d))).toFixed(1)}px) scale(${(1.01 + .03 * P(lt, 0, d)).toFixed(4)})`;
      S.sec._g = lt >= tRed ? .35 * (1 - P(lt, tRed, tRed + .12)) : 0;
      centerX(z1.el, 1080); waIn(z1, lt, .1, { stagger: .04 });
      centerX(z2.el, 1080); waIn(z2, lt, tZ2, { stagger: .035 });
      z2.el.style.transform = `scale(${(1 + .04 * Math.sin(lt * 8)).toFixed(4)})`;
    };
  });

  // =====================================================================================
  // S5 · LEGA 😌 + log audit ("● REC") → meme Drake: puluhan file ❌ / satu register ✅ (screenshot asli)
  // =====================================================================================
  KIT.registerType('n4lega', (root, v, sc, tm, T) => {
    GLOW[sc.id] = '255,200,110';
    const S = tvScene(root);
    const A = add(S.cam, '<div class="set"></div>');
    const O = office(A, true);
    const sun = h('<div class="lg-sun"></div>');
    O.set.insertBefore(sun, O.set.children[2]);
    if (v.monitor) {
      O.sheet.style.display = 'none';
      add(O.scr, `<div style="position:absolute;inset:0;background:#fff;overflow:hidden"><div class="mview" style="position:absolute;left:0;top:0;transform-origin:0 0">${shotImg(v.monitor)}</div></div>`);
      $('.mview', O.scr).style.transform = viewTf(v.monitor.r, 340).tf;
    }
    const log = add(O.set, `<div class="lg-log" style="z-index:12"><div class="hd"><i></i><span>LOG AUDIT</span></div>${v.log.map((l) => `<div class="ln"><b>${esc(l.time)}</b><u>${esc(l.who)}</u>${esc(l.what)}</div>`).join('')}</div>`);
    const lines = [...log.querySelectorAll('.ln')], tl = v.log.map((l) => T(l.at, 1));
    const spk = sparkles(O.set, [[430, 250, 1.1, 1.3], [1010, 470, .7, 1.7], [520, 180, .6, 1.2], [860, 560, .9, 1.5], [360, 420, .7, 1.1]]);
    const B = add(S.cam, '<div class="set" style="background:radial-gradient(ellipse at 50% 40%,#3f7bff,#1238a8 60%,#0b2376)"></div>');
    const dk = add(B, `<div class="drk">
      <div class="row no"><div class="pn"><div class="face emo">😖</div><div class="hnd emo" style="left:214px;top:170px">✋</div></div><div class="tx"><div class="wr">${v.no.text}<small>${esc(v.no.small)}</small></div><div class="pile"></div></div><div class="mk">✕</div></div>
      <div class="row yes"><div class="pn"><div class="face emo">😌</div><div class="hnd emo" style="left:222px;top:196px">👉</div></div><div class="tx"><div class="wr">${v.yes.text}<small>${esc(v.yes.small)}</small></div><div class="shot"><div class="view">${shotImg(v.yes)}</div></div></div><div class="mk">✓</div></div></div>`);
    const [rowNo, rowYes] = dk.querySelectorAll('.row');
    const pile = $('.pile', rowNo);
    ['RoPA_final.xlsx', 'RoPA_final_REVISI(2).xlsx', 'RoPA_HR_v7.xlsx', 'RoPA_IT_JANGAN_DIUBAH.xlsx'].forEach((n, i) => { const c = fileCard(n); c.style.transform = `translate(${-20 + i * 14}px, ${i * 38}px) rotate(${((hash(i * 3.3) - .5) * 14).toFixed(1)}deg)`; pile.appendChild(c); });
    $('.view', rowYes).style.transform = viewTf(v.yes.r, 392).tf;
    const stamp = add(rowNo, `<div class="stampx">${esc(v.stamp || 'BUKAN!')}</div>`);
    const tRec = T(v.recAt, 1.3), tB = T(v.drakeAt, 2.8), tYes = T(v.yesAt, 3.35), tStamp = T(v.stampAt, 4.6);
    const z1 = WA(v.top || 'LEGA!', { size: 150, stretch: 120, cls: 'mint' });
    at(z1.el, 0, 50); S.zt.appendChild(z1.el);
    const cnt = add(S.zb, counterEl(esc(v.zb || 'REGISTER RoPA: 1')));
    return (lt, d) => {
      const inA = lt < tB;
      A.style.display = inA ? '' : 'none'; B.style.display = inA ? 'none' : '';
      if (inA) {
        officeTick(O, lt, 0, true);
        const br = Math.sin(lt * 2.2);
        O.head.style.transform = `translateY(${(br * 5).toFixed(1)}px) rotate(${(-6 + br * 2).toFixed(2)}deg)`;
        sun.style.transform = `rotate(${(lt * 10).toFixed(1)}deg)`;
        spk(lt);
        lines.forEach((e, i) => { const k = E.out3(P(lt, tl[i], tl[i] + .3)); e.style.opacity = k; e.style.transform = `translateX(${((1 - k) * 30).toFixed(1)}px)`; });
        log.style.opacity = E.out3(P(lt, tl[0] - .3, tl[0]));
        S.cam.style.transform = `scale(${(1.03 + .03 * P(lt, 0, tB)).toFixed(4)})`;
      } else {
        const kn = ob(P(lt, tB + .02, tB + .45)), ky = ob(P(lt, tYes, tYes + .45));
        rowNo.style.transform = `translateX(${((1 - kn) * -120).toFixed(1)}px) scale(${(.85 + .15 * Math.max(0, kn)).toFixed(3)})`; rowNo.style.opacity = cl(kn * 2);
        rowYes.style.transform = `translateX(${((1 - ky) * 120).toFixed(1)}px) scale(${(.85 + .15 * Math.max(0, ky)).toFixed(3)})`; rowYes.style.opacity = cl(ky * 2);
        rowNo.style.filter = lt > tYes ? `grayscale(${(.85 * P(lt, tYes, tYes + .3)).toFixed(2)}) brightness(.92)` : 'none';
        $('.face', rowNo).style.transform = `rotate(${(Math.sin(lt * 9) * 6).toFixed(1)}deg)`;
        $('.face', rowYes).style.transform = `translateY(${(Math.abs(Math.sin(lt * 5)) * -10).toFixed(1)}px) rotate(${(Math.sin(lt * 3) * 4).toFixed(1)}deg)`;
        const kst = P(lt, tStamp - .05, tStamp + .15);
        stamp.style.opacity = kst > 0 ? 1 : 0;
        stamp.style.transform = `rotate(-12deg) scale(${lerp(2.6, 1, E.outExpo(kst)).toFixed(3)})`;
        const shk = lt > tStamp && lt < tStamp + .3 ? (1 - (lt - tStamp) / .3) * 12 : 0;
        S.cam.style.transform = `translate(${((hash(lt * 91) - .5) * shk).toFixed(1)}px, ${((hash(lt * 71) - .5) * shk).toFixed(1)}px) scale(${(1 + .02 * P(lt, tB, d)).toFixed(4)})`;
      }
      S.sec._rec = lt >= tRec && inA;
      S.sec._g = lt >= tB ? .9 * (1 - P(lt, tB, tB + .22)) : 0;
      centerX(z1.el, 1080); waIn(z1, lt, .12, { stagger: .05 });
      z1.el.style.transform = `translateY(${(Math.sin(lt * 2) * 5).toFixed(1)}px) rotate(${(Math.sin(lt * 1.3) * 1.5).toFixed(2)}deg)`;
      const kc = ob(P(lt, tYes, tYes + .4));
      cnt.style.opacity = cl(kc * 2); cnt.style.transform = `scale(${(.6 + .4 * Math.max(0, kc)).toFixed(3)})`;
    };
  });

  // =====================================================================================
  // S6 · packshot penutup + "pensiunkan" file ke tempat sampah + CTA + disclaimer ala iklan obat + TV mati
  // =====================================================================================
  KIT.registerType('n4tutup', (root, v, sc, tm, T) => {
    GLOW[sc.id] = '80,140,255';
    const S = tvScene(root), st = studio(S.cam);
    const Bx = box3d(); S.cam.appendChild(Bx.el);
    const spk = sparkles(S.cam, [[140, 230, .8], [560, 260, .7], [520, 820, .9], [1320, 260, .6], [700, 170, .5]]);
    const lg = add(S.cam, `<div class="en-logo"><img src="${LOGO}" alt=""></div>`);
    const nx = WA('NEXUS', { size: 82, stretch: 125, cls: 'chrome en-nx' });
    lg.appendChild(nx.el); Object.assign(nx.el.style, { position: 'relative', display: 'inline-block', marginTop: '14px' });
    const P6 = V ? v.pos.v : v.pos.h;
    const tag = at(add(S.cam, `<div class="en-tag">${esc(v.tag)}</div>`), P6.tag[0], P6.tag[1]);
    const tagW = KIT.splitWords(tag);
    const fileW = add(S.cam, '<div class="en-file"></div>'); fileW.appendChild(fileCard(v.file));
    const bin = at(add(S.cam, `<div class="en-bin"><div class="bn"></div><div class="ld"></div><div class="lbl">${esc(v.binLbl || '')}</div></div>`), P6.bin[0], P6.bin[1]);
    const lid = $('.ld', bin), binLbl = $('.lbl', bin);
    const rip = add(S.cam, `<div class="en-rip"><div class="fn">${esc(v.file)}<i></i></div>${v.rip ? `<div class="ty"><span class="emo">🫡</span>${esc(v.rip)}</div>` : ''}</div>`);
    const ripLine = $('.fn i', rip);
    const btn = add(S.cam, `<div class="en-btn">${esc(v.button || 'privasimu.com')}<i class="sh"></i></div>`);
    const cta2 = add(S.cam, `<div class="en-cta2">${v.cta2 || ''}</div>`);
    const disc = add(S.fg, `<div class="en-disc"><div class="d1">${esc(v.disc1)}</div><div class="d2">${v.disc2}${v.contact ? ` · ${esc(v.contact)}` : ''}</div></div>`);
    const contact = V && v.contact ? add(S.cam, `<div class="en-cta2" style="font-size:30px;color:#dbe7ff">${esc(v.contact)}</div>`) : null;
    const zl = add(S.zt, `<div class="en-logo2"><img src="${LOGO}" alt=""></div>`);
    const znx = WA('NEXUS', { size: 104, stretch: 125, cls: 'chrome' });
    at(znx.el, 0, 132); S.zt.appendChild(znx.el);
    const zd = add(S.zb, `<div class="en-disc2"><div class="d1">${esc(v.disc1)}</div><div class="d2">${v.disc2}</div></div>`);
    const tLogo = T(v.logoAt, .2), tNx = T(v.nexusAt, 1), tTag = T(v.tagAt, 2.5), tFly = T(v.flyAt, 3.1), tLand = tFly + .85, tBtn = T(v.btnAt, 6), tDisc = T(v.discAt, 4);
    return (lt, d) => {
      const bxy = P6.box, kbx = E.out3(P(lt, 0, .8));
      const gl = lt > 1 && ((lt - 1) % 3.4) / 1.1 < 1 ? ((lt - 1) % 3.4) / 1.1 : -1;
      Bx.set(bxy[0], bxy[1] + (1 - kbx) * 60 + Math.sin(lt * 1.5) * 7, bxy[2] * lerp(.8, 1, kbx), -26 + Math.sin(lt * .9) * 9 - (1 - kbx) * 90, -10 + Math.sin(lt * .7) * 2, gl);
      st.place(bxy[0], bxy[1], bxy[2], lt, .85);
      spk(lt);
      const kl = E.out3(P(lt, tLogo, tLogo + .6)), clip = `inset(0 ${(100 - 100 * E.io3(P(lt, tLogo, tLogo + .7))).toFixed(1)}% 0 0)`;
      lg.style.opacity = kl; lg.style.transform = `translateY(${((1 - kl) * -30).toFixed(1)}px)`;
      $('img', lg).style.clipPath = clip;
      waIn(nx, lt, tNx, { stagger: .05 });
      zl.style.opacity = kl; $('img', zl).style.clipPath = clip;
      centerX(znx.el, 1080); waIn(znx, lt, tNx, { stagger: .05 });
      KIT.revealWords(tagW, tTag, lt, { stagger: .07, dur: .6 });
      // RoPA_final_REVISI(2).xlsx dipensiunkan: terbang melengkung ke tempat sampah
      const f0 = P6.file, kf0 = ob(P(lt, tTag + .15, tTag + .5)), kfl = P(lt, tFly, tLand), e = E.io3(kfl);
      const fx = lerp(f0[0], P6.bin[0], e), fy = lerp(f0[1], P6.bin[1] - 40, e) - Math.sin(Math.PI * e) * 240;
      const fs = lerp(1, .2, E.in3(kfl)) * Math.max(0, kf0), fw = wOf(fileW, 440);
      at(fileW, fx - fw / 2, fy - 40);
      fileW.style.opacity = lt < tLand - .04 ? cl(kf0 * 2) : 0;
      fileW.style.transform = `rotate(${(e * 540).toFixed(1)}deg) scale(${fs.toFixed(3)})`;
      const kb = ob(P(lt, tTag, tTag + .4));
      bin.style.opacity = cl(kb * 2); bin.style.transform = `scale(${Math.max(0, kb).toFixed(3)})`;
      const open = lt > tFly + .3 && lt < tLand ? E.out3(P(lt, tFly + .3, tFly + .55)) : 0;
      const bounce = lt >= tLand ? Math.exp(-(lt - tLand) * 5) * Math.sin((lt - tLand) * 24) : 0;
      lid.style.transform = `rotate(${(-open * 60 - bounce * 16).toFixed(1)}deg)`;
      $('.bn', bin).style.transform = `scaleY(${(1 - .08 * bounce).toFixed(3)})`;
      const kr = E.out3(P(lt, tLand + .1, tLand + .5)), ks2 = E.io3(P(lt, tLand + .35, tLand + .75));
      at(rip, P6.file[0] - wOf(rip, 440) / 2, P6.file[1] - 30);
      rip.style.opacity = kr; rip.style.transform = `translateY(${((1 - kr) * 16).toFixed(1)}px)`;
      ripLine.style.transform = `scaleX(${ks2.toFixed(3)})`;
      const kL = ob(P(lt, tLand + .1, tLand + .45));
      binLbl.style.opacity = cl(kL * 2); binLbl.style.transform = `scale(${Math.max(0, kL).toFixed(3)})`;
      const kB = ob(P(lt, tBtn, tBtn + .45));
      at(btn, P6.btn[0] - wOf(btn, 560) / 2, P6.btn[1]);
      btn.style.opacity = cl(kB * 2); btn.style.transform = `scale(${(Math.max(0, kB) * (1 + .025 * Math.sin((lt - tBtn) * 6))).toFixed(3)})`;
      $('.sh', btn).style.left = lerp(-200, 760, P((((lt - tBtn - .4) % 2.2) + 2.2) % 2.2, 0, .8)).toFixed(1) + 'px';
      at(cta2, P6.cta2[0] - wOf(cta2, 600) / 2, P6.cta2[1]);
      cta2.style.opacity = E.out3(P(lt, tBtn + .35, tBtn + .8)).toFixed(3);
      if (contact) { at(contact, P6.contact[0] - wOf(contact, 600) / 2, P6.contact[1]); contact.style.opacity = E.out3(P(lt, tBtn + .5, tBtn + 1)).toFixed(3); }
      const kd = E.out3(P(lt, tDisc, tDisc + .5));
      disc.style.opacity = kd; disc.style.transform = `translateY(${((1 - kd) * 40).toFixed(1)}px)`;
      zd.style.opacity = kd;
      S.sec._noCtr = kd;
      // TV dimatikan di akhir
      const off = P(lt, d - .55, d - .08);
      S.sec._off = off;
      [S.zt, S.zb].forEach((z) => { z.style.opacity = (1 - P(off, .2, .6)).toFixed(3); });
      S.cam.style.transform = `scale(${(1 + .025 * P(lt, 0, d)).toFixed(4)})`;
      S.sec._g = lt >= tLand ? .3 * (1 - P(lt, tLand, tLand + .1)) : 0;
    };
  });
})();
