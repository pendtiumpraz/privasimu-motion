// Gaya khas N11 · "Hidup DPO (2026)" — kompilasi meme ala TikTok.
// Tiap potongan punya "look" sendiri (freeze frame VHS, template meme neo-brutal, chat, slideshow gelap "Things to Say",
// layar kunci jam 3 pagi, polyester edit, editorial "Kinda chic", montase MLG 2016), disatukan oleh karakter DPO
// (badan vektor + kepala emoji), HUD AURA lintas scene, dan caption TikTok. Semua gerak dihitung dari waktu (deterministik).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick, splitWords, revealWords, float } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const popK = (lt, t0, dur = 0.42) => { const k = P(lt, t0, t0 + dur); return k <= 0 ? 0 : E.outBack(k); };
  const place = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };
  const FMT = V ? 'v' : 'h';
  const pk = (o) => (o && typeof o === 'object' && !Array.isArray(o) && ('h' in o || 'v' in o) ? o[FMT] : o);
  const TLs = () => window.TIMELINE.scenes;
  const scOf = (id) => TLs().find((s) => s.id === id);
  const shake = (lt, hits, dur = 0.35, amp = 16) => hits.reduce((a, t) => a + (lt > t && lt < t + dur ? (1 - (lt - t) / dur) * amp : 0), 0);
  const jit = (lt, amt, seed = 1) => [(hash(Math.floor(lt * 30) * 1.7 + seed) - 0.5) * amt, (hash(Math.floor(lt * 30) * 2.3 + seed + 5) - 0.5) * amt];

  // emoji yang baru dipasang saat animasi harus sudah ada di DOM saat boot (engine memuat subset Noto Color Emoji)
  document.body.insertAdjacentHTML('beforeend', '<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">😵😐😎🥲🫠😃😬😅💀🍳😰😱😌☕🪴🔥💯⚡📩⚠️📞📄📎💥❓❔🤔👔🙂✅😭🙏💦👆👈✨🧐📝⏱️🔒👉</div>');

  // ================= karakter DPO =================
  const BODY = `<svg class="bd" width="300" height="250" viewBox="0 0 300 250">
    <path d="M28 250 C28 152 76 112 150 112 C224 112 272 152 272 250 Z" fill="#2F6BFF"/>
    <path d="M28 250 C28 152 76 112 150 112 C162 112 172 113 181 115 C122 130 94 180 88 250 Z" fill="#6D97FF" opacity=".5"/>
    <path d="M110 115 L150 162 L190 115 Z" fill="#fff"/>
    <path d="M125 118 L150 190 L175 118" fill="none" stroke="#0B1220" stroke-width="7" stroke-linejoin="round"/>
    <g transform="rotate(-4 150 212)"><rect x="113" y="182" width="74" height="60" rx="9" fill="#fff" stroke="#0B1220" stroke-width="4"/>
      <rect x="113" y="182" width="74" height="17" rx="8" fill="#0B1220"/><text x="150" y="231" text-anchor="middle" font-family="Anton" font-size="27" fill="#0B1220">DPO</text></g></svg>`;
  const PIX = (() => {
    const G = ['########################', '##oo######....##oo######', '#oo#######....#oo#######', '##########....##########', '.########......########.', '..######........######..'];
    let r = '';
    G.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') r += `<rect x="${x}" y="${y}" width="1.03" height="1.03" fill="${c === 'o' ? '#fff' : '#000'}"/>`; }));
    return `<svg class="pix" viewBox="0 0 24 6" width="212" height="53" shape-rendering="crispEdges">${r}</svg>`;
  })();
  function dpo(root, { face = '😐', faces = [], hands = false, sticker = false, glasses = false } = {}) {
    const el = h(`<div class="d11-dpo ${hands ? 'with-hands' : ''} ${sticker ? 'd11-sticker' : ''}">${BODY}<div class="hands"><i></i><i></i></div><div class="hd"><span>${face}</span></div><div class="sweat">💦</div>${glasses ? PIX : ''}</div>`);
    root.appendChild(el);
    const hd = $('.hd', el), sp = $('.hd span', el), sw = $('.sweat', el);
    return {
      el, pix: $('.pix', el), hands: [...el.querySelectorAll('.hands i')],
      at(x, y) { place(el, x - 150, y - 330); }, // (x, y) = titik tengah-bawah badan
      face(lt, list = faces) {
        let f = face, t0 = -9;
        for (const [t, e] of list) if (lt >= t) { f = e; t0 = t; }
        if (sp._f !== f) { sp.textContent = f; sp._f = f; }
        const k = P(lt, t0, t0 + 0.3);
        hd.style.transform = k < 1 ? `scale(${1 + 0.3 * (1 - E.outBack(k))})` : `rotate(${Math.sin(lt * 2.1) * 2.5}deg)`;
      },
      sweat(lt, t0) {
        const k = P(lt, t0, t0 + 0.3);
        sw.style.opacity = k > 0 ? 1 : 0;
        sw.style.transform = `translate(${Math.sin(lt * 3) * 4}px, ${((lt - t0) * 70) % 50}px) scale(${Math.max(0, E.outBack(k))})`;
      },
    };
  }

  // ================= overlay global: HUD AURA, pita VHS, kilat =================
  let G = null;
  function globals() {
    if (G) return G;
    const stage = $('#stage'), before = $('#grain');
    const hud = h('<div id="d11-hud"><span class="ic">✨</span><span class="lb">AURA</span><span class="vl">0</span></div>');
    const vhs = h('<div id="d11-vhs"><i></i><i></i><i></i></div>');
    const flash = h('<div id="d11-flash"></div>');
    [vhs, flash, hud].forEach((e) => stage.insertBefore(e, before));
    const ev = (PRV.AURA || []).map(([id, at, d]) => ({ t: scOf(id).start + (typeof at === 'number' ? at : MG.wt(id, at.slice(2), 0)), d })).sort((a, b) => a.t - b.t);
    const dels = ev.map((e) => { const el = h(`<div class="d11-delta ${e.d < 0 ? 'neg' : 'pos'}">${e.d < 0 ? '−' : '+'}${MG.fmtNum(Math.abs(e.d))}</div>`); stage.insertBefore(el, before); return el; });
    G = { hud, vl: $('.vl', hud), vhs, bands: [...vhs.children], flash, ev, dels };
    return G;
  }
  function drawHud(t, id, lt) {
    const { hud, vl, ev, dels } = G;
    let total = 0, prev = 0, last = -9;
    for (const e of ev) if (t >= e.t) { prev = total; total += e.d; last = e.t; }
    const k = E.out3(P(t, last, last + 0.45)), shown = Math.round(lerp(prev, total, k));
    const max = id === 's9' && lt > 0.45;
    const txt = max ? 'MAX' : (shown < 0 ? '−' : shown > 0 ? '+' : '') + MG.fmtNum(Math.abs(shown));
    if (vl._t !== txt) { vl.textContent = txt; vl._t = txt; }
    hud.className = max ? 'max' : shown < 0 ? 'neg' : shown > 0 ? 'pos' : '';
    const kb = max ? P(lt, 0.45, 0.8) : P(t, last, last + 0.35);
    const sh = !max && total < prev && t < last + 0.4 ? jit(t, 14 * (1 - P(t, last, last + 0.4)), 3) : [0, 0];
    hud.style.transform = `translate(${sh[0]}px, ${sh[1]}px) scale(${1 + 0.2 * Math.sin(Math.PI * kb)})`;
    hud.style.opacity = P(t, 0.75, 1.0);
    const hx = SW - (V ? 44 : 60) - (hud.offsetWidth || 300) - 18, hy = (V ? 196 : 46) + 10;
    ev.forEach((e, i) => {
      const el = dels[i], kd = (t - e.t) / 1.1;
      if (kd < 0 || kd > 1) { el.style.opacity = 0; return; }
      if (!el._w && el.offsetWidth) el._w = el.offsetWidth;
      place(el, hx - (el._w || 160), hy);
      el.style.opacity = kd < 0.75 ? 1 : 1 - (kd - 0.75) / 0.25;
      el.style.transformOrigin = '100% 50%';
      el.style.transform = `translate(${-30 * E.out3(kd)}px, ${(e.d < 0 ? 26 : -26) * E.out3(kd)}px) scale(${lerp(1.6, 1, E.outBack(cl(kd * 4)))})`;
    });
  }

  // transisi potong (menimpa transform scene dari kit): punch / flash / vhs / soft
  let xFlash = 0; // kilat tambahan yang diminta tipe scene pada frame ini
  const CUTFX = { s2: 'vhs', s3: 'punch', s4: 'none', s5: 'flash', s6: 'punch', s7: 'flash', s8: 'soft', s9: 'flash' };
  const VIGN = { s2: 0.12, s3: 0.12, s4: 0.12, s8: 0.2 };
  function cutFx(id, lt, d, sec) {
    const fx = CUTFX[id];
    let s = 1, fl = 0, vh = 0;
    if (fx === 'punch' || fx === 'flash') s = 1 + 0.07 * (1 - E.out3(P(lt, 0, 0.22)));
    if (fx === 'flash') fl = 0.85 * (1 - P(lt, 0, 0.2));
    if (fx === 'soft') fl = 0.9 * (1 - E.out3(P(lt, 0, 0.45)));
    if (fx === 'vhs') vh = 1 - P(lt, 0.1, 0.4);
    if (id === 's1' && lt > d - 0.78) vh = 1; // rewind VHS di akhir s1 (sama dengan rewindAt tipe freeze)
    if (s !== 1) sec.style.transform += ` scale(${s.toFixed(4)})`;
    G.flash.style.opacity = Math.max(fl, xFlash);
    xFlash = 0;
    G.flash.style.background = fx === 'soft' ? '#FFF6EC' : '#fff';
    return vh;
  }
  function drawVhs(amt, t) {
    G.vhs.style.opacity = amt > 0 ? 1 : 0;
    if (amt <= 0) return;
    G.bands.forEach((b, i) => {
      const y = ((hash(Math.floor(t * 24) * 1.3 + i * 7) * 1.2 - 0.1) * SH), hh = 10 + hash(Math.floor(t * 24) + i * 3.1) * 70 * amt;
      Object.assign(b.style, { top: y + 'px', height: hh + 'px', opacity: (0.35 + 0.5 * hash(i + Math.floor(t * 30))) * amt });
    });
  }

  // ================= latar canvas per scene =================
  function bg(cx, t, id, theme, W, H, lt) {
    const lin = (a, b, x0 = 0, y0 = 0, x1 = 0, y1 = H) => { const g = cx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    const glow = (x, y, r, col) => { const g = cx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); };
    if (id === 's1') {
      const fz = lt >= 0.9;
      cx.fillStyle = fz ? lin('#D9D9D9', '#BDBDBD') : lin('#F6E7CF', '#E9D2B0'); cx.fillRect(0, 0, W, H);
      cx.fillStyle = fz ? 'rgba(0,0,0,.05)' : 'rgba(160,110,50,.08)';
      for (let x = 0; x < W; x += 90) cx.fillRect(x, 0, 36, H);
      cx.fillStyle = fz ? '#8E8E8E' : '#A86B3C'; cx.fillRect(0, H * (V ? 0.8 : 0.78), W, H);
      if (!fz) { const a = 0.35 + 0.35 * Math.sin(lt * 18); glow(W * 0.1, 0, W * 0.6, `rgba(255,40,40,${a})`); glow(W * 0.9, 0, W * 0.6, `rgba(255,40,40,${a})`); }
      return;
    }
    if (id === 's2') {
      cx.fillStyle = '#FFE14D'; cx.fillRect(0, 0, W, H);
      cx.save(); cx.translate(W / 2, H / 2); cx.rotate(-0.5); cx.fillStyle = 'rgba(255,190,0,.45)';
      const off = (t * 60) % 120;
      for (let x = -H * 1.5 - off; x < H * 1.5; x += 120) cx.fillRect(x, -H * 1.5, 50, H * 3);
      cx.restore();
      return;
    }
    if (id === 's3' || id === 's4') {
      cx.fillStyle = lin('#DCE4F5', '#F1F4FA'); cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(47,107,255,.08)';
      for (let y = 20; y < H; y += 56) for (let x = (y / 56) % 2 ? 48 : 20; x < W; x += 56) { cx.beginPath(); cx.arc(x, y, 4, 0, 7); cx.fill(); }
      const cook = id === 's4' ? P(lt, MG.wt('s4', 'bercanda+0.42', 5), MG.wt('s4', 'bercanda+0.42', 5) + 0.15) : 0;
      if (cook > 0) { cx.fillStyle = `rgba(20,20,24,${0.85 * cook})`; cx.fillRect(0, 0, W, H); }
      return;
    }
    if (id === 's5') {
      cx.fillStyle = '#08080A'; cx.fillRect(0, 0, W, H);
      glow(V ? W / 2 : W * 0.22, V ? H * 0.33 : H * 0.45, V ? 700 : 800, 'rgba(70,70,90,.55)');
      glow(W * (0.5 + 0.3 * Math.sin(t * 0.3)), H * 0.9, W * 0.8, 'rgba(120,30,50,.18)');
      const st = MG.wt('s5', 'Jangan', 8);
      if (lt > st && lt < st + 0.5) { cx.fillStyle = `rgba(255,30,50,${0.35 * (1 - (lt - st) / 0.5)})`; cx.fillRect(0, 0, W, H); }
      return;
    }
    if (id === 's6') {
      const calm = MG.wt('s6', 'Tenang', 6), kc = E.io3(P(lt, calm, calm + 0.8));
      cx.fillStyle = lin('#050A1C', '#02040B'); cx.fillRect(0, 0, W, H);
      glow(V ? W * 0.8 : W * 0.85, V ? H * 0.12 : H * 0.15, V ? 600 : 700, `rgba(120,150,255,${0.18 + 0.1 * kc})`);
      if (kc < 1) glow(W / 2, H * 0.6, W, `rgba(255,30,50,${(0.12 + 0.1 * Math.sin(lt * 7)) * (1 - kc)})`);
      if (kc > 0) glow(W / 2, H * 0.4, W * 0.9, `rgba(47,107,255,${0.35 * kc})`);
      return;
    }
    if (id === 's7') {
      cx.fillStyle = '#050505'; cx.fillRect(0, 0, W, H);
      cx.save(); cx.translate(W / 2, H * 0.45); cx.rotate(t * 0.8);
      for (let i = 0; i < 24; i++) { cx.rotate(Math.PI / 12); cx.fillStyle = i % 2 ? 'rgba(47,107,255,.22)' : 'rgba(255,225,77,.12)'; cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(2400, -140); cx.lineTo(2400, 140); cx.fill(); }
      cx.restore();
      return;
    }
    if (id === 's8') {
      cx.fillStyle = lin('#FBF4EC', '#F1E2D3'); cx.fillRect(0, 0, W, H);
      glow(W * (0.2 + 0.08 * Math.sin(t * 0.4)), H * 0.25, W * 0.7, 'rgba(255,190,170,.45)');
      glow(W * (0.85 + 0.05 * Math.cos(t * 0.3)), H * (0.7 + 0.05 * Math.sin(t * 0.5)), W * 0.6, 'rgba(255,214,160,.5)');
      glow(W * 0.05, H * 0.9, W * 0.5, 'rgba(240,160,190,.3)');
      return;
    }
    if (id === 's9') {
      const logo = MG.wt('s9', 'Privasimu', 1.4), kl = E.io3(P(lt, logo - 0.1, logo + 0.35));
      if (kl < 1) {
        const g = cx.createConicGradient(t * 2.2, W / 2, H * 0.45);
        ['#ff3d6e', '#ffd84d', '#3dff8f', '#3dc6ff', '#b86bff', '#ff3d6e'].forEach((c, i) => g.addColorStop(i / 5, c));
        cx.fillStyle = g; cx.fillRect(0, 0, W, H);
        cx.fillStyle = 'rgba(0,0,0,.25)'; cx.fillRect(0, 0, W, H);
      }
      if (kl > 0) {
        cx.globalAlpha = kl;
        cx.fillStyle = lin('#0A1F57', '#030A1F'); cx.fillRect(0, 0, W, H);
        glow(W / 2, V ? H * 0.3 : H * 0.35, V ? 900 : 1000, 'rgba(47,107,255,.55)');
        cx.globalAlpha = 1;
      }
    }
  }

  KIT.style({
    fonts: ['900 20px "TikTok Sans"', '800 20px "TikTok Sans"', '700 20px "TikTok Sans"', '20px Anton', 'italic 20px "Instrument Serif"', '20px "Instrument Serif"', '20px VT323', '20px "Permanent Marker"'],
    bg,
    frame: (id, lt, d, sec) => {
      globals();
      const t = scOf(id).start + lt;
      const vh = cutFx(id, lt, d, sec);
      drawVhs(vh, t);
      drawHud(t, id, lt);
      $('#vignette').style.opacity = VIGN[id] ?? 1;
    },
  });

  // ================= S1: kekacauan kantor -> record scratch, freeze frame -> rewind =================
  KIT.registerType('freeze', (root, v, sc, tm, T) => {
    const tF = v.freezeAt, tArrow = T(v.arrowAt, 1.9), tQ = T(v.wonderAt, 3.2), tRw = T(v.rewindAt, sc.dur - 0.78), tYep = T(v.yepAt, 1.3);
    const CX = SW / 2, BY = pick(930, 1330), S = pick(1.35, 1.6); // DPO: tengah, titik bawah
    const headY = BY - 330 * S + 120 * S;
    const world = h('<div class="abs" style="left:0;top:0;width:100%;height:100%;transform-origin:50% 55%"></div>');
    root.appendChild(world);
    const back = h('<div class="abs" style="inset:0"></div>'), front = h('<div class="abs" style="inset:0"></div>');
    world.appendChild(back);
    const COL = { xlsx: '#1D8A4E', docx: '#2563EB', pdf: '#DC2626', csv: '#0D9488' };
    const els = [];
    v.files.forEach((f) => { const ext = f.split('.').pop(); els.push(h(`<div class="d11-fly d11-file"><div class="fi" style="background:${COL[ext] || '#64748B'}">${esc(ext.toUpperCase())}</div>${esc(f)}</div>`)); });
    v.notifs.forEach((n) => els.push(h(`<div class="d11-fly d11-notif">${esc(n)}</div>`)));
    for (let i = 0; i < 4; i++) els.push(h(`<div class="d11-fly d11-paper">${[88, 70, 92, 60, 80, 50].map((w) => `<i style="width:${w}%"></i>`).join('')}</div>`));
    ['🔥', '📎', '☕', '💥', '📄', '📞'].forEach((e) => els.push(h(`<div class="d11-fly d11-emo">${e}</div>`)));
    const prm = els.map((el, i) => {
      const z = hash(i * 8.3 + 8) > 0.45;
      (z ? front : back).appendChild(el);
      return { el, a0: hash(i * 3.1 + 1) * 6.283, w: (0.8 + hash(i * 5.7 + 2) * 1.5) * (i % 2 ? 1 : -1), rx: pick(560, 330) + hash(i * 2.3 + 3) * pick(300, 150),
        ry: pick(300, 520) + hash(i * 1.9 + 4) * pick(140, 260), r0: (hash(i * 7.7 + 5) - 0.5) * 50, wr: (hash(i * 4.4 + 6) - 0.5) * 380, s: 0.8 + hash(i * 6.1 + 7) * 0.35 };
    });
    const guy = dpo(world, { face: '😵' });
    guy.at(CX, BY);
    world.appendChild(front);
    // anotasi spidol merah: lingkaran + panah + tulisan
    const R = 150 * S;
    const ann = h(`<svg class="d11-circ" width="${SW}" height="${SH}" style="left:0;top:0">
      <path class="c" d="M${CX - R * 1.05} ${headY} C${CX - R * 1.1} ${headY - R * 1.2}, ${CX + R * 1.15} ${headY - R * 1.25}, ${CX + R * 1.08} ${headY + 10} S${CX - R * 0.7} ${headY + R * 1.25}, ${CX - R * 1.12} ${headY - R * 0.2}" fill="none" stroke="#FF2D3D" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path class="a" d="${V ? `M${CX + 330} ${headY - 470} C${CX + 300} ${headY - 330}, ${CX + 250} ${headY - 260}, ${CX + R * 0.95} ${headY - R * 0.95}` : `M${CX + 560} ${headY - 250} C${CX + 470} ${headY - 240}, ${CX + 370} ${headY - 200}, ${CX + R * 1.1} ${headY - R * 0.7}`}" fill="none" stroke="#FF2D3D" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
    </svg>`);
    root.appendChild(ann);
    const cPath = $('.c', ann), aPath = $('.a', ann);
    const lab = h('<div class="d11-marker">itu aku!</div>');
    root.appendChild(lab);
    place(lab, V ? CX + 150 : CX + 480, V ? headY - 560 : headY - 330);
    const qs = ['❓', '❔', '🤔'].map((e, i) => { const el = h(`<div class="d11-emo" style="position:absolute;font-size:${pick(110, 120)}px">${e}</div>`); root.appendChild(el); return el; });
    const QP = pick([[-330, -250], [300, -300], [-260, 60]], [[-300, -330], [260, -380], [-330, 40]]);
    const osd = h('<div class="d11-osd">|| PAUSE<small>SP  00:03:00</small></div>');
    root.appendChild(osd);
    place(osd, pick(80, 60), pick(60, 300));
    return (lt, d) => {
      let tmo = Math.min(lt, tF);
      if (lt > tRw) tmo = Math.max(0, tF - (lt - tRw) * 2.4);
      const frozen = lt >= tF;
      prm.forEach((p, i) => {
        const a = p.a0 + p.w * tmo * 1.3;
        if (!p.el._w && p.el.offsetWidth) { p.el._w = p.el.offsetWidth; p.el._h = p.el.offsetHeight; }
        const x = CX + Math.cos(a) * p.rx - (p.el._w || 200) / 2, y = headY + Math.sin(a) * p.ry * 0.9 - (p.el._h || 80) / 2;
        const ent = E.out3(P(lt, i * 0.03, i * 0.03 + 0.35));
        p.el.style.transform = `translate(${x}px, ${y + (1 - ent) * -300}px) rotate(${p.r0 + p.wr * tmo * 0.25}deg) scale(${p.s})`;
        p.el.style.opacity = ent;
      });
      guy.face(lt);
      const wob = frozen && lt < tRw ? 0 : Math.sin(tmo * 22) * 6;
      guy.el.style.transform = `rotate(${wob}deg)`;
      // kamera: guncang saat kacau; zoom pelan saat beku; tersentak di record scratch
      const [jx, jy] = !frozen || lt > tRw ? jit(lt, lt > tRw ? 30 : 16, 2) : [0, 0];
      const zs = frozen ? 1.1 - 0.05 * E.out3(P(lt, tF, tF + 0.3)) + 0.04 * P(lt, tF, tRw) : 1;
      world.style.transform = `translate(${jx}px, ${jy + (lt > tRw ? Math.sin(lt * 90) * 8 : 0)}px) scale(${zs})`;
      world.style.filter = frozen ? `grayscale(.92) contrast(1.15) sepia(.12) brightness(${lt > tRw ? 1.15 : 1})` : 'none';
      root.style.filter = lt > tRw ? `blur(${(P(lt, tRw, d) * 3).toFixed(1)}px)` : 'none';
      // anotasi
      cPath.setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, tArrow - 0.25, tArrow + 0.2)));
      aPath.setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, tArrow - 0.05, tArrow + 0.3)));
      ann.style.opacity = lt < tRw ? 1 : 1 - P(lt, tRw, tRw + 0.15);
      const kl = popK(lt, tArrow + 0.15, 0.4);
      tf(lab, { s: kl, r: -8 + Math.sin(lt * 3) * 2, o: cl(kl * 3) * (lt < tRw ? 1 : 0) });
      qs.forEach((q, i) => {
        const kq = popK(lt, tQ + i * 0.12, 0.4);
        place(q, CX + QP[i][0] - 55, headY + QP[i][1] - 55);
        tf(q, { s: kq, r: Math.sin(lt * 4 + i) * 12, y: float(lt, i, 8, 2), o: cl(kq * 3) * (lt < tRw ? 1 : 0) });
      });
      // OSD VHS: PAUSE saat beku (berkedip), REWIND di akhir
      const rw = lt > tRw;
      const txt = rw ? '<< REWIND<small>SP  00:02:5' + (9 - Math.floor((lt - tRw) * 12) % 10) + '</small>' : '|| PAUSE<small>SP  00:03:00</small>';
      if (osd._t !== txt) { osd.innerHTML = txt; osd._t = txt; }
      osd.style.opacity = frozen ? (rw || Math.floor((lt - tF) * 2.2) % 2 === 0 ? 1 : 0.35) : 0;
    };
  });

  // ================= S2: "orang have / haven't / not yet" (template meme neo-brutal) =================
  KIT.registerType('have', (root, v, sc, tm, T) => {
    const tP1 = T(v.haveAt, 0.5), tC = [T(v.h1At, 1.2), T(v.h2At, 2.0)], tP2 = T(v.haventAt, 3.8), tFile = T(v.fileAt, 4.6), tScr = T(v.scribAt, 5.6), tP3 = T(v.notAt, 6.3), tFace = T(v.faceAt, 7.5);
    const BOX = pick([[100, 150, 540, 800], [690, 150, 540, 800], [1280, 150, 540, 800]], [[60, 296, 960, 340], [60, 668, 960, 340], [60, 1040, 960, 380]]);
    const ROT = [-1.6, 1.1, -0.6];
    const mk = (i, cls, e, lab) => {
      const [x, y, w, hh] = BOX[i];
      const el = h(`<div class="d11-pn ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px"><div class="lab"><span class="e">${e}</span><span>${lab}</span></div></div>`);
      root.appendChild(el);
      const lb = $('.lab', el);
      if (V) place(lb, 34, 28); else Object.assign(lb.style, { position: 'absolute', left: '0', right: '0', top: '44px' });
      if (V) lb.style.position = 'absolute';
      return el;
    };
    const p1 = mk(0, 'p1', '😎', 'Orang have'), p2 = mk(1, 'p2', '🥲', "Orang haven't"), p3 = mk(2, 'p3', '🫠', 'Orang not yet');
    const chips = ['RoPA lengkap', 'DPIA beres'].map((c, i) => { const el = h(`<div class="d11-chip ok">✅ ${esc(c)}</div>`); p1.appendChild(el); el.style.position = 'absolute'; return el; });
    if (V) { place(chips[0], 40, 186); place(chips[1], 440, 186); } else { place(chips[0], 60, 420); place(chips[1], 80, 540); }
    const xls = h(`<div class="d11-xls" style="position:absolute"><div class="fi">XLSX</div>${V ? 'RoPA_final_revisi3_FIX.xlsx' : 'RoPA_final_rev3.xlsx'}</div>`);
    p2.appendChild(xls);
    place(xls, pick(40, 36), pick(420, 160));
    const scr = h(`<svg style="position:absolute;left:0;top:0;overflow:visible" width="10" height="10"><path d="${V ? 'M20 170 C 10 96, 650 100, 690 160 S 380 300, 30 236 S 60 136, 120 146' : 'M20 400 C 10 330, 520 330, 520 410 S 300 520, 30 470 S 60 380, 120 380'}" fill="none" stroke="#FF2D3D" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`);
    p2.appendChild(scr);
    const note = h(`<div class="d11-marker" style="font-size:${pick(54, 46)}px">revisi ke-3?!</div>`);
    p2.appendChild(note);
    place(note, pick(150, 650), pick(560, 44));
    const load = h('<div class="d11-load"><i></i><b>loading… 3%</b></div>');
    p3.appendChild(load);
    Object.assign(load.style, V ? { left: '40px', top: '190px', width: '560px' } : { left: '50px', top: '330px', width: '440px' });
    const guy = dpo(p3, { face: '😐', faces: [[tFace, '🫠']] });
    if (V) guy.at(810, 400); else guy.at(270, 810);
    guy.el.style.transform = `scale(${pick(0.95, 0.62)})`;
    const aku = h(`<div class="d11-marker" style="font-size:60px">${V ? 'aku 👉' : 'aku 👇'}</div>`);
    p3.appendChild(aku);
    place(aku, pick(180, 380), pick(392, 280));
    const panels = [p1, p2, p3], tPs = [tP1, tP2, tP3];
    return (lt) => {
      panels.forEach((p, i) => {
        const k = popK(lt, tPs[i] - 0.05, 0.45), on3 = lt >= tP3;
        const punch = i === 2 ? 1 + 0.05 * Math.sin(Math.PI * P(lt, tP3, tP3 + 0.35)) : 1;
        const [sx, sy] = i === 2 && lt > tP3 && lt < tP3 + 0.45 ? jit(lt, 18, 4) : [0, 0];
        tf(p, { s: (0.6 + 0.4 * k) * punch, r: ROT[i] * k + (1 - k) * (i % 2 ? 10 : -10), x: sx, y: (1 - k) * 120 + sy + (k >= 1 ? float(lt, i, 3, 1.4) : 0), o: cl(k * 3) });
        p.style.filter = on3 && i < 2 ? `grayscale(${0.8 * P(lt, tP3, tP3 + 0.3)}) brightness(${1 - 0.12 * P(lt, tP3, tP3 + 0.3)})` : 'none';
      });
      chips.forEach((c, i) => { const k = popK(lt, tC[i], 0.4); tf(c, { s: k, r: (1 - k) * -12 + (i ? 2 : -2), o: cl(k * 3) }); });
      const kx = popK(lt, tFile, 0.4), shk = lt > tFile ? Math.sin(lt * 40) * 3 * (1 - P(lt, tFile + 0.4, tFile + 1.2)) : 0;
      tf(xls, { s: kx, x: shk, r: (1 - kx) * 10 + shk * 0.5, o: cl(kx * 3) });
      $('path', scr).setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, tScr, tScr + 0.45)));
      const kn = popK(lt, tScr + 0.35, 0.4);
      tf(note, { s: kn, r: -6, o: cl(kn * 3) });
      $('i', load).style.width = lerp(0, 3, P(lt, tP3, tP3 + 0.6)) + 1 + '%';
      guy.face(lt);
      const ka = popK(lt, tFace + 0.1, 0.4);
      tf(aku, { s: ka, r: -5, x: Math.sin(lt * 6) * 6 * (ka >= 1 ? 1 : 0), o: cl(ka * 3) });
    };
  });

  // ================= S3–S4: chat "Pak Bos" + facecam DPO =================
  function chatUI(root) {
    const [x, y, w, hh] = pick([150, 140, 980, 800], [40, 290, 1000, 1130]);
    const win = h(`<div class="d11-chat" style="left:${x}px;top:${y}px;width:${w}px;height:${hh}px"><div class="top"><div class="av">👔</div><div><div class="nm">Pak Bos</div><div class="st">online</div></div></div></div>`);
    root.appendChild(win);
    const st = $('.st', win);
    const bub = (cls, html, top) => { const el = h(`<div class="d11-bub ${cls}">${html}<span class="tm">03.12</span></div>`); win.appendChild(el); el.style.top = top + 'px'; if (cls === 'me') el.style.right = '34px'; else el.style.left = '34px'; return el; };
    const typing = (cls, top) => { const el = h(`<div class="d11-typing ${cls}"><i></i><i></i><i></i></div>`); win.appendChild(el); el.style.top = top + 'px'; if (cls === 'me') el.style.right = '34px'; else el.style.left = '34px'; return el; };
    const [cx, cy, r] = pick([1520, 560, 290], [540, 1175, 205]);
    const cam = h(`<div class="d11-cam"><div class="f">😃</div><div class="rec"><i></i>FACECAM DPO</div></div>`);
    root.appendChild(cam);
    const face = $('.f', cam);
    const setCam = (ccx, ccy, rr) => { Object.assign(cam.style, { left: ccx - rr + 'px', top: ccy - rr + 'px', width: rr * 2 + 'px', height: rr * 2 + 'px' }); face.style.fontSize = rr * 1.25 + 'px'; face.style.top = rr * 0.12 + 'px'; };
    setCam(cx, cy, r);
    const animTyping = (el, t0, t1, lt) => {
      const on = lt >= t0 && lt < t1;
      el.style.opacity = on ? 1 : 0;
      if (on) [...el.children].forEach((d, i) => { d.style.transform = `translateY(${-Math.max(0, Math.sin((lt - t0) * 9 - i * 0.9)) * 12}px)`; });
    };
    return { win, st, bub, typing, cam, face, setCam, animTyping, C: [cx, cy, r] };
  }
  const bubIn = (el, t0, lt, fromRight) => { const k = popK(lt, t0, 0.38); el.style.transformOrigin = fromRight ? '100% 100%' : '0% 100%'; tf(el, { s: 0.5 + 0.5 * k, y: (1 - k) * 30, o: cl(k * 3) }); };
  const faceSwap = (el, list, lt) => {
    let f = list[0][1], t0 = -9;
    for (const [t, e] of list) if (lt >= t) { f = e; t0 = t; }
    if (el._f !== f) { el.textContent = f; el._f = f; }
    const k = P(lt, t0, t0 + 0.3);
    el.style.transform = `scale(${k < 1 ? 1 + 0.3 * (1 - E.outBack(k)) : 1}) rotate(${Math.sin(lt * 2.4) * 3}deg)`;
  };
  KIT.registerType('bos', (root, v, sc, tm, T) => {
    const tTy = T(v.typingAt, 0.12), tMsg = T(v.msgAt, 0.9), tSw = T(v.sweatAt, 1.7);
    const C = chatUI(root);
    const ty = C.typing('them', 170), m = C.bub('them', 'Kita sudah patuh UU PDP, kan? 🙂', 170);
    const drops = h('<div class="d11-emo" style="position:absolute;font-size:90px">💦</div>');
    root.appendChild(drops);
    return (lt) => {
      tf(C.win, { s: 0.94 + 0.06 * E.out3(P(lt, 0, 0.3)), o: cl(P(lt, 0, 0.15) * 2) });
      C.animTyping(ty, tTy, tMsg, lt);
      C.st.textContent = lt >= tTy && lt < tMsg ? 'mengetik…' : 'online';
      bubIn(m, tMsg, lt, false);
      faceSwap(C.face, [[0, '😃'], [tSw, '😬']], lt);
      const kc = popK(lt, 0.05, 0.45);
      tf(C.cam, { s: kc, o: cl(kc * 3) });
      const kd = P(lt, tSw, tSw + 0.3);
      place(drops, C.C[0] + C.C[2] * 0.45, C.C[1] - C.C[2] * 0.85 + ((lt - tSw) * 90) % 60);
      drops.style.opacity = kd > 0 ? 1 : 0;
    };
  });
  KIT.registerType('balas', (root, v, sc, tm, T) => {
    const t1 = T(v.r1At, 0.5), tOk = T(v.okAt, 2.2), t2 = T(v.r2At, 3.7), tSk = T(v.skullAt, 5.1), tCk = T(v.cookedAt, 5.3);
    const C = chatUI(root);
    const m0 = C.bub('them', 'Kita sudah patuh UU PDP, kan? 🙂', 170);
    const ty = C.typing('me', 350);
    const r1 = C.bub('me', 'Sudah dong, Pak. <b class="ok">100%</b> ✅', 350);
    const r2 = C.bub('me', 'astaga, bercanda 😭🙏', 350);
    const ok = $('.ok', r1);
    const cooked = h('<div class="d11-cooked">Kita cooked <span class="e">🍳</span></div>');
    root.appendChild(cooked);
    const [cx, cy, r] = C.C;
    return (lt, d) => {
      const kS = E.io3(P(lt, tSk, tSk + 0.28));
      C.animTyping(ty, 0.02, t1, lt);
      C.st.textContent = lt >= t2 + 0.5 && lt < tSk ? 'mengetik…' : 'online';
      bubIn(r1, t1, lt, true);
      if (!r2._y && r1.offsetHeight) r2._y = 350 + r1.offsetHeight + 26;
      if (r2._y) r2.style.top = r2._y + 'px';
      bubIn(r2, t2, lt, true);
      ok.style.background = lt >= tOk ? `rgba(255,225,77,${0.9 * P(lt, tOk, tOk + 0.2)})` : 'transparent';
      ok.style.color = lt >= tOk ? '#0B1220' : '';
      ok.style.borderRadius = '10px'; ok.style.padding = '0 6px';
      faceSwap(C.face, [[0, '😬'], [t1, '😎'], [t2, '😅'], [tSk, '💀']], lt);
      // vine boom: facecam membesar menutup layar, chat jadi abu-abu
      const R2 = Math.hypot(SW, SH) * 0.62;
      C.setCam(lerp(cx, SW / 2, kS), lerp(cy, pick(SH * 0.42, SH * 0.4), kS), lerp(r, R2, kS));
      C.face.style.fontSize = lerp(r * 1.25, pick(560, 600), kS) + 'px';
      C.face.style.top = lerp(r * 0.12, (lerp(r, R2, kS) - pick(560, 600) / 2) - pick(40, 60), kS) + 'px';
      C.cam.style.borderWidth = lerp(10, 0, kS) + 'px';
      C.cam.style.background = kS > 0.5 ? '#111' : '';
      C.cam.style.borderRadius = kS > 0.95 ? '0' : '50%';
      $('.rec', C.cam).style.opacity = 1 - kS;
      C.win.style.filter = lt > tSk ? 'grayscale(1)' : 'none';
      const kc = P(lt, tCk, tCk + 0.22);
      place(cooked, 0, pick(760, 1100));
      const [sx, sy] = lt > tCk && lt < tCk + 0.5 ? jit(lt, 20, 7) : [0, 0];
      tf(cooked, { s: lerp(1.8, 1, E.outExpo(kc)), x: sx, y: sy, r: -3, o: kc > 0 ? 1 : 0 });
    };
  });

  // ================= S5: "Things to Say" (slideshow gelap, potret "sigma" hitam-putih) =================
  KIT.registerType('things', (root, v, sc, tm, T) => {
    const tT = T(v.titleAt, 0.4), tI = v.items.map((it, i) => T(it.at, 1.5 + i * 2)), tSt = T(v.stampAt, 8);
    const pr = pick([120, 150, 600, 800], [290, 440, 500, 500]);
    const por = h(`<div class="d11-portrait" style="left:${pr[0]}px;top:${pr[1]}px;width:${pr[2]}px;height:${pr[3]}px"><div class="rim"></div><div class="nm">DPO, 2026</div></div>`);
    root.appendChild(por);
    const guy = dpo(por, { face: '😎' });
    guy.at(pr[2] / 2, pr[3] + pick(40, 60));
    guy.el.style.transform = `scale(${pick(1.9, 1.35)})`;
    const title = h(`<div class="d11-ttl">Hal yang bisa kamu bilang ke <em style="color:var(--yel)">auditor</em>:</div>`);
    root.appendChild(title);
    Object.assign(title.style, V ? { left: '60px', top: '288px', width: '960px', fontSize: '60px', textAlign: 'center' } : { left: '800px', top: '150px', width: '1020px', fontSize: '64px' });
    const tW = splitWords(title);
    const L = pick({ x: 800, y: 370, w: 1000, fs: 50, gap: 46 }, { x: 60, y: 985, w: 960, fs: 44, gap: 30 });
    const items = v.items.map((it, i) => {
      const el = h(`<div class="d11-item" style="left:${L.x}px;width:${L.w}px;font-size:${L.fs}px"><span class="n">${i + 1}.</span><span class="tx">${rich(it.text)}</span></div>`);
      root.appendChild(el);
      const w = splitWords($('.tx', el)), pill = h('<span class="d11-temuan">+1 temuan 📝</span>');
      $('.tx', el).appendChild(pill);
      return { el, w, pill };
    });
    const stamp = h('<div class="d11-stamp">JANGAN DITIRU</div>');
    root.appendChild(stamp);
    return (lt, d) => {
      const kp = E.out3(P(lt, 0, 0.6));
      const [px, py] = lt > tSt && lt < tSt + 0.4 ? jit(lt, 24, 9) : [0, 0];
      tf(por, { s: lerp(0.92, 1, kp) * (1 + 0.03 * P(lt, 0, d)), x: px, y: py + (1 - kp) * 40, o: cl(kp * 2) });
      guy.face(lt);
      revealWords(tW, tT - 0.1, lt, { stagger: 0.05, dur: 0.45, blur: 6 });
      let y = L.y;
      items.forEach((it, i) => {
        if (!it.h && it.el.offsetHeight) it.h = it.el.offsetHeight;
        it.el.style.top = y + 'px';
        const k = E.out3(P(lt, tI[i] - 0.05, tI[i] + 0.3));
        tf(it.el, { x: (1 - k) * 60, o: k > 0 ? 1 : 0 });
        revealWords(it.w, tI[i] - 0.05, lt, { stagger: 0.035, dur: 0.35, dist: 0.3, blur: 4 });
        const kt = popK(lt, tI[i] + 0.75, 0.35);
        tf(it.pill, { s: kt, r: 4, o: cl(kt * 3) });
        y += (it.h || 110) + L.gap;
      });
      if (!stamp._w && stamp.offsetWidth) { stamp._w = stamp.offsetWidth; stamp._h = stamp.offsetHeight; }
      const cyS = pick(620, 1190);
      place(stamp, pick(1310, 540) - (stamp._w || 600) / 2, cyS - (stamp._h || 160) / 2);
      const ks = P(lt, tSt - 0.05, tSt + 0.13);
      tf(stamp, { s: lerp(2.6, 1, E.outExpo(ks)), r: -10, o: ks > 0 ? 1 : 0 });
    };
  });

  // ================= S6: jam 3 pagi + borgol kebesaran 3×24 jam -> melorot, alur Nexus =================
  const CUFFS = `<svg class="d11-cuffs" viewBox="-340 -150 680 300" width="680" height="300"><defs><linearGradient id="d11met" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F7F9FC"/><stop offset=".45" stop-color="#A3AEC0"/><stop offset=".55" stop-color="#697488"/><stop offset="1" stop-color="#DDE3EC"/></linearGradient></defs>
    <g fill="none" stroke-linecap="round">
      <path d="M-40 -92 Q-30 -118 -16 -112 M40 -92 Q30 -118 16 -112" stroke="#1F2937" stroke-width="14"/>
      <ellipse cx="-12" cy="-114" rx="15" ry="9" stroke="#1F2937" stroke-width="11"/><ellipse cx="12" cy="-114" rx="15" ry="9" stroke="#1F2937" stroke-width="11"/>
      <ellipse cx="-12" cy="-114" rx="15" ry="9" stroke="#B8C2D1" stroke-width="4"/><ellipse cx="12" cy="-114" rx="15" ry="9" stroke="#B8C2D1" stroke-width="4"/>
      <ellipse cx="-150" cy="14" rx="165" ry="96" stroke="#1F2937" stroke-width="34"/><ellipse cx="-150" cy="14" rx="165" ry="96" stroke="url(#d11met)" stroke-width="23"/>
      <ellipse cx="150" cy="14" rx="165" ry="96" stroke="#1F2937" stroke-width="34"/><ellipse cx="150" cy="14" rx="165" ry="96" stroke="url(#d11met)" stroke-width="23"/>
      <path d="M-280 -30 Q-220 -78 -140 -80" stroke="#fff" stroke-width="6" opacity=".8"/><path d="M20 -30 Q80 -78 160 -80" stroke="#fff" stroke-width="6" opacity=".8"/>
    </g></svg>`;
  KIT.registerType('borgol', (root, v, sc, tm, T) => {
    const tN = T(v.notifAt, 0.15), tCuff = T(v.cuffAt, 3.4), tCd = T(v.cdAt, 4.3), tSl = T(v.slideAt, 6.2), tShot = T(v.shotAt, 6.9), tMk = T(v.markAt, 7.4);
    // layar kunci (9:16: layar penuh; 16:9: HP di kiri)
    const ph = h(`<div class="${V ? 'd11-lock' : 'd11-phone'}" style="${V ? 'left:0;top:0;width:100%;height:100%' : 'left:200px;top:80px;width:500px;height:920px'}">
      <div class="clk">03.00</div><div class="dt">Selasa, dini hari</div>
      <div class="nt"><div class="ap"><span>⚠️ PERINGATAN KEAMANAN</span><span>sekarang</span></div><div class="tt">Dugaan kebocoran data</div><div class="bd">Sistem CRM · segera diperiksa</div></div></div>`);
    root.appendChild(ph);
    const ntc = $('.nt', ph);
    // DPO + tangan + borgol
    const S = pick(1.2, 1.18), BX = pick(1330, 540), BY = pick(1000, 1400);
    const guy = dpo(root, { face: '😴', hands: true });
    guy.at(BX, BY);
    guy.el.style.transform = `scale(${S})`;
    guy.hands[0].style.left = '30px'; guy.hands[1].style.left = '240px';
    const HX = [BX + (45 - 150) * S, BX + (255 - 150) * S], HY = BY - (330 - 277) * S;
    const cuffWrap = h(`<div class="abs" style="left:0;top:0;width:680px;height:300px;transform-origin:340px 164px">${CUFFS}</div>`);
    root.appendChild(cuffWrap);
    const csc = (HX[1] - HX[0]) / 300; // skala agar pusat cincin tepat di pergelangan (cincin sengaja kebesaran)
    const tag = h('<div class="d11-tag"><b>3 X 24 JAM</b><span>72:00:00</span></div>');
    root.appendChild(tag);
    const cdEl = $('span', tag);
    // screenshot insiden (Nexus)
    const box = pick([90, 120, 1080, 700], [60, 300, 960, 530]);
    const cam0 = { x: 262, y: 150, w: 1002 };
    const vpW = box[2], vpH = box[3] - 58, scl = vpW / cam0.w;
    const shot = h(`<div class="d11-shot" style="left:${box[0]}px;top:${box[1]}px;width:${box[2]}px;height:${box[3]}px"><div class="tb"><i></i><i></i><i></i><div class="url">${esc(v.shot.label)}</div></div>
      <div class="vp" style="height:${vpH}px"><div class="lay" style="width:${v.shot.size[0]}px;height:${v.shot.size[1]}px;transform:translate(${-cam0.x * scl}px, ${-cam0.y * scl}px) scale(${scl})"><img src="${v.shot.src}" width="${v.shot.size[0]}" height="${v.shot.size[1]}" alt=""></div></div></div>`);
    root.appendChild(shot);
    const vp = $('.vp', shot);
    const mark = (r, cls) => { const e = h(`<div class="d11-mark ${cls}"></div>`); vp.appendChild(e); Object.assign(e.style, { left: (r[0] - cam0.x) * scl - 8 + 'px', top: (r[1] - cam0.y) * scl - 8 + 'px', width: r[2] * scl + 16 + 'px', height: r[3] * scl + 16 + 'px' }); return e; };
    const mPill = mark([458, 175, 132, 32], 'red'), mStep = mark([335, 372, 858, 72], '');
    const calls = ['⏱️ hitung mundur 3×24 jam', '📝 templat pemberitahuan'].map((c) => { const e = h(`<div class="d11-call">${c}</div>`); root.appendChild(e); return e; });
    const CP = pick([[120, 860], [640, 860]], [[60, 860], [540, 860]]);
    return (lt, d) => {
      // layar kunci + notifikasi
      const kN = popK(lt, tN, 0.45), buzz = lt > tN && lt < tN + 0.6 ? Math.sin(lt * 90) * 8 * (1 - (lt - tN) / 0.6) : 0;
      tf(ntc, { y: (1 - kN) * -60, x: buzz, s: 0.9 + 0.1 * kN, o: cl(kN * 2) });
      ntc.style.boxShadow = lt > tN ? `0 0 ${30 + 20 * Math.sin(lt * 6)}px rgba(255,59,78,.5)` : 'none';
      const kOut = E.in3(P(lt, tShot - 0.3, tShot));
      tf(ph, { o: 1 - kOut, s: 1 - 0.06 * kOut, y: pick(0, -40 * kOut) });
      // DPO: tidur -> kaget -> panik -> lega
      guy.face(lt, [[0, '😴'], [tN + 0.25, '😰'], [tCuff, '😱'], [tSl + 0.25, '😌']]);
      const [gx, gy] = lt > tCuff && lt < tCuff + 0.4 ? jit(lt, 16, 5) : [0, 0];
      guy.el.style.transform = `translate(${gx}px, ${gy}px) scale(${S})`;
      // borgol jatuh (memantul) lalu melorot lepas
      const kd = P(lt, tCuff - 0.32, tCuff), kb = P(lt, tCuff, tCuff + 0.35);
      let cy = HY + (lt < tCuff ? -(1 - kd * kd) * SH * 0.9 : -Math.sin(Math.PI * kb) * 26 * (1 - kb));
      let rot = lt < tCuff ? (1 - kd) * -25 : Math.sin(lt * 3) * 1.5, co = lt >= tCuff - 0.32 ? 1 : 0;
      if (lt > tSl) { const s1 = lt - tSl; cy += 200 * s1 * s1 * 6 + 40 * s1; rot += s1 * 40; co = 1 - P(lt, tSl + 0.5, tSl + 0.9); }
      const cxm = (HX[0] + HX[1]) / 2;
      cuffWrap.style.transform = `translate(${cxm - 340}px, ${cy - 164}px) rotate(${rot}deg) scale(${csc})`;
      cuffWrap.style.opacity = co;
      // tag + hitung mundur
      if (!tag._w && tag.offsetWidth) { tag._w = tag.offsetWidth; tag._h = tag.offsetHeight; }
      const kT = popK(lt, tCuff + 0.08, 0.4);
      place(tag, pick(cxm + 330, cxm + 330) - (tag._w || 220) / 2, cy - pick(290, 300));
      tf(tag, { s: kT, r: 6 + Math.sin(lt * 4) * 3, o: cl(kT * 3) * co });
      const el = Math.max(0, lt - tCd) * 2600 * (1 + Math.max(0, lt - tCd) * 0.8), rem = Math.max(0, 72 * 3600 - el);
      const p2 = (n) => String(Math.floor(n)).padStart(2, '0');
      const txt = `${p2(rem / 3600)}:${p2(rem % 3600 / 60)}:${p2(rem % 60)}`;
      if (cdEl._t !== txt) { cdEl.textContent = txt; cdEl._t = txt; }
      // screenshot alur insiden Nexus
      const kS = popK(lt, tShot, 0.5);
      tf(shot, { s: 0.7 + 0.3 * kS, y: (1 - kS) * 80 + (kS >= 1 ? float(lt, 1, 4, 1.2) : 0), o: cl(kS * 3) });
      const km1 = P(lt, tShot + 0.35, tShot + 0.7), km2 = P(lt, tMk, tMk + 0.35);
      mPill.style.opacity = km1 * (1 - P(lt, tMk, tMk + 0.2)); mStep.style.opacity = km2;
      mStep.style.transform = `scale(${lerp(1.1, 1, E.out3(km2))})`;
      calls.forEach((c, i) => { const kc = popK(lt, tMk + 0.15 + i * 0.18, 0.4); place(c, CP[i][0], CP[i][1]); tf(c, { s: kc, r: i ? 2 : -2, o: cl(kc * 3) }); });
    };
  });

  // ================= S7: "Polyester Edit" — DPO diam di depan, klip layar Nexus berganti liar di belakang =================
  const SIZES = { dashboard: [1264, 790], 'dashboard-postur': [1002, 480], 'dashboard-risiko': [1002, 478], 'breach-fase': [1002, 840], 'breach-aksi': [1002, 150], 'ropa-baru': [1264, 569],
    'ropa-tersimpan': [1264, 569], 'dpia-list': [1264, 790], 'dpia-risiko': [1264, 790], 'dsr-form': [1264, 790], 'dsr-detail': [1002, 250], 'consent-detail': [1624, 1014], 'ai-agent-chat': [1264, 569],
    'gap-hasil': [1002, 690], 'children-pro': [1440, 900], 'dpo-academy': [1440, 900], 'ai-agent-home': [1440, 951], 'policy-review': [1440, 900], 'fire-drill-header': [1240, 260] };
  KIT.registerType('poly', (root, v, sc, tm, T) => {
    const tAll = T(v.allAt, 4.9);
    const mains = v.cuts.map((c) => ({ ...c, t: T(c.at, 1), main: true }));
    // sisipkan klip pengisi di antara potongan utama (± 0,2 dtk) supaya terasa "polyester"
    const cuts = [];
    let fi = 0;
    const bounds = [0.02, ...mains.map((m) => m.t)];
    for (let i = 0; i < mains.length; i++) {
      const a = bounds[i], b = mains[i].t;
      if (i > 0) cuts.push(mains[i - 1]);
      for (let t = (i > 0 ? mains[i - 1].t + 0.24 : a); t < b - 0.12; t += 0.2) cuts.push({ shot: v.fillers[fi++ % v.fillers.length], t, main: false });
    }
    cuts.push(mains[mains.length - 1]);
    const lay = h('<div class="abs" style="left:0;top:0;width:100%;height:100%"></div>');
    root.appendChild(lay);
    const imgs = {};
    [...new Set(cuts.map((c) => c.shot))].forEach((s) => {
      const [w, hh] = SIZES[s] || [1264, 790];
      const el = h(`<img class="d11-mont" src="../assets/app/${s}.png" width="${w}" height="${hh}" alt="">`);
      el.style.display = 'none';
      lay.appendChild(el);
      imgs[s] = { el, w, h: hh };
    });
    const speed = h(`<svg class="d11-speed" width="${SW}" height="${SH}"><g stroke="#fff" stroke-linecap="round">${Array.from({ length: 40 }, (_, i) => { const a = i / 40 * 6.283 + hash(i) * 0.1, r0 = 0.42 * Math.max(SW, SH), r1 = r0 + 300 + hash(i + 3) * 400; return `<line x1="${SW / 2 + Math.cos(a) * r0}" y1="${SH / 2 + Math.sin(a) * r0}" x2="${SW / 2 + Math.cos(a) * r1}" y2="${SH / 2 + Math.sin(a) * r1}" stroke-width="${3 + hash(i + 9) * 6}"/>`; }).join('')}</g></svg>`);
    root.appendChild(speed);
    const lbl = h('<div class="d11-lbl"></div>');
    root.appendChild(lbl);
    const title = h('<div class="d11-cap">Kalau DPO punya <em>polyester edit</em>:</div>');
    root.appendChild(title);
    Object.assign(title.style, V ? { left: '40px', right: '40px', top: '300px', fontSize: '70px' } : { left: '80px', top: '46px', fontSize: '64px', textAlign: 'left' });
    // kolase akhir: semua modul terhubung ke hub Nexus
    const hub = h('<div class="d11-hub"><img src="../assets/privasimu_logo.png" alt=""><div class="nx">NEXUS</div></div>');
    const HC = pick([900, 560], [540, 860]);
    const ring = mains.slice(0, 6).map((m, i) => {
      const [w, hh] = SIZES[m.shot] || [1264, 790], TW = pick(330, 300), TH = pick(206, 190), s = Math.max(TW / w, TH / hh);
      const el = h(`<div class="d11-thumb" style="width:${TW}px;height:${TH}px"><img src="../assets/app/${m.shot}.png" style="width:${w * s}px;height:${hh * s}px" alt=""><b>${esc(m.label)}</b></div>`);
      root.appendChild(el);
      const a = (-150 + i * 60) * Math.PI / 180, R = pick([560, 330], [330, 380]);
      return { el, x: HC[0] + Math.cos(a) * R[0], y: HC[1] + Math.sin(a) * R[1], TW, TH };
    });
    const lines = h(`<svg class="abs" style="left:0;top:0" width="${SW}" height="${SH}">${ring.map((r) => `<line x1="${HC[0]}" y1="${HC[1]}" x2="${r.x}" y2="${r.y}" stroke="#8FB6FF" stroke-width="6" stroke-linecap="round" stroke-dasharray="14 12" pathLength="1"/>`).join('')}</svg>`);
    root.insertBefore(lines, ring[0].el);
    root.appendChild(hub);
    const allL = h('<div class="d11-cap">SEMUA <em>NYAMBUNG</em> ✅</div>');
    root.appendChild(allL);
    Object.assign(allL.style, V ? { left: '0', right: '0', top: '300px', fontSize: '84px' } : { left: '0', right: '0', top: '40px', fontSize: '76px' });
    const guy = dpo(root, { face: '😎', sticker: true });
    const GP = pick([1640, 1085, 1.2], [790, 1445, 1.2]), GP2 = pick([1760, 1085, 0.95], [930, 1445, 0.7]);
    return (lt, d) => {
      const all = lt >= tAll, kA = E.io3(P(lt, tAll, tAll + 0.5));
      let cur = null;
      for (const c of cuts) if (lt >= c.t) cur = c;
      Object.values(imgs).forEach((o) => { o.el.style.display = 'none'; });
      if (cur && !all) {
        const o = imgs[cur.shot], i = cuts.indexOf(cur), age = lt - cur.t;
        const fitW = cur.main ? pick(1480, 1000) : pick(1900, 1500), s0 = Math.min(fitW / o.w, (cur.main ? pick(820, 760) : pick(1300, 1400)) / o.h);
        const cx0 = pick(850, 540) + (hash(i * 3.3) - 0.5) * (cur.main ? 80 : 360), cy0 = pick(560, 720) + (hash(i * 4.1) - 0.5) * (cur.main ? 60 : 500);
        const punch = 1 + 0.12 * (1 - E.out3(cl(age / 0.15)));
        const sc2 = s0 * punch * (1 + age * 0.08), rot = (hash(i * 5.9) - 0.5) * (cur.main ? 6 : 14);
        o.el.style.display = 'block';
        o.el.style.transform = `translate(${cx0 - o.w / 2}px, ${cy0 - o.h / 2}px) rotate(${rot}deg) scale(${sc2})`;
        o.el.style.filter = age < 0.12 ? 'drop-shadow(10px 0 0 rgba(255,0,90,.75)) drop-shadow(-10px 0 0 rgba(0,220,255,.75))' : 'none';
      }
      // label modul besar
      let m = null;
      for (const c of mains) if (lt >= c.t) m = c;
      if (m && !all) {
        if (lbl._t !== m.label) { lbl.textContent = m.label; lbl._t = m.label; lbl._w = 0; }
        if (!lbl._w && lbl.offsetWidth) lbl._w = lbl.offsetWidth;
        const k = P(lt, m.t, m.t + 0.14), i = mains.indexOf(m);
        place(lbl, pick(90, 60), pick(800, 1060));
        tf(lbl, { s: lerp(1.9, 1, E.outExpo(k)), r: i % 2 ? 4 : -5, o: k > 0 ? 1 : 0 });
      } else lbl.style.opacity = 0;
      speed.style.opacity = all ? 0 : 0.18 + 0.2 * (cur && lt - cur.t < 0.1 ? 1 : 0);
      tf(title, { o: (1 - kA) * cl(P(lt, 0, 0.2) * 2), y: (1 - E.out3(P(lt, 0, 0.3))) * -30 });
      xFlash = cur && cur.main && !all && lt - cur.t < 0.09 ? 0.55 * (1 - (lt - cur.t) / 0.09) : 0;
      // kolase "semua nyambung"
      if (!hub._w && hub.offsetWidth) { hub._w = hub.offsetWidth; hub._h = hub.offsetHeight; }
      place(hub, HC[0] - (hub._w || 400) / 2, HC[1] - (hub._h || 150) / 2);
      const kh = popK(lt, tAll + 0.05, 0.45);
      tf(hub, { s: kh, o: cl(kh * 3) });
      ring.forEach((r, i) => {
        const k = popK(lt, tAll + 0.1 + i * 0.07, 0.45);
        place(r.el, r.x - r.TW / 2, r.y - r.TH / 2);
        tf(r.el, { s: k, r: (i % 2 ? 3 : -3) + float(lt, i, 1.5, 2), x: (1 - E.out3(P(lt, tAll, tAll + 0.5))) * (HC[0] - r.x), y: (1 - E.out3(P(lt, tAll, tAll + 0.5))) * (HC[1] - r.y), o: cl(k * 3) });
      });
      lines.style.opacity = P(lt, tAll + 0.4, tAll + 0.7);
      lines.querySelectorAll('line').forEach((ln) => ln.setAttribute('stroke-dashoffset', (-lt * 1.2).toFixed(3)));
      const ka = popK(lt, tAll + 0.2, 0.45);
      tf(allL, { s: ka, o: cl(ka * 3) });
      guy.face(lt);
      guy.at(lerp(GP[0], GP2[0], kA), lerp(GP[1], GP2[1], kA));
      guy.el.style.transform = `translateY(${float(lt, 0, 5, 3)}px) scale(${lerp(GP[2], GP2[2], kA)})`;
    };
  });

  // ================= S8: "Kinda chic to…" (editorial hangat, serif) =================
  KIT.registerType('chic', (root, v, sc, tm, T) => {
    const tK = T(v.kickerAt, 0.3), tL = v.lines.map((l, i) => T(l.at, 1 + i * 1.5));
    const cam = h('<div class="abs" style="left:0;top:0;width:100%;height:100%;transform-origin:50% 50%"></div>');
    root.appendChild(cam);
    const kick = h('<div class="d11-kick">Kinda chic to…</div>');
    cam.appendChild(kick);
    Object.assign(kick.style, V ? { left: '70px', top: '300px', fontSize: '124px' } : { left: '140px', top: '200px', fontSize: '134px' });
    const kW = splitWords(kick);
    const lines = v.lines.map((l, i) => {
      const el = h(`<div class="d11-line"><span class="dash">—</span>${rich(l.text)}</div>`);
      cam.appendChild(el);
      Object.assign(el.style, V ? { left: '70px', top: 480 + i * 106 + 'px', fontSize: '64px', width: '950px' } : { left: '140px', top: 400 + i * 104 + 'px', fontSize: '62px', width: '860px' });
      return { el, w: splitWords(el) };
    });
    const LP = pick([1010, 260, 790], [150, 860, 780]);
    const lw = LP[2], sw = lw - 36, sh = sw * 790 / 1264;
    const lap = h(`<div class="d11-laptop" style="left:${LP[0]}px;top:${LP[1]}px;width:${lw}px;height:${sh + 36 + 34}px"><div class="scr"><div class="in" style="width:${sw}px;height:${sh}px"><img src="${v.shot.src}" style="width:${sw}px;height:${sh}px" alt=""></div></div><div class="base" style="top:${sh + 36}px"></div></div>`);
    cam.appendChild(lap);
    const cup = h(`<div class="d11-soft" style="font-size:${pick(120, 96)}px">☕</div>`), plant = h(`<div class="d11-soft" style="font-size:${pick(190, 150)}px">🪴</div>`);
    cam.appendChild(plant); cam.appendChild(cup);
    place(plant, pick(140, 930), pick(820, 1180)); place(cup, pick(930, 290), pick(800, 1330));
    const guy = dpo(cam, { face: '😌' });
    guy.at(pick(1745, 180), pick(1030, 1432));
    guy.el.style.transform = `scale(${pick(0.72, 0.62)})`;
    return (lt, d) => {
      cam.style.transform = `scale(${1.04 - 0.04 * E.out3(P(lt, 0, d))}) translate(${lerp(10, -10, P(lt, 0, d))}px, 0px)`;
      revealWords(kW, tK - 0.05, lt, { stagger: 0.09, dur: 0.9, dist: 0.25, blur: 14 });
      lines.forEach((l, i) => revealWords(l.w, tL[i] - 0.05, lt, { stagger: 0.07, dur: 0.8, dist: 0.3, blur: 12 }));
      const kl = E.out3(P(lt, 0.05, 0.9));
      tf(lap, { y: (1 - kl) * 90 + float(lt, 1, 4, 0.7), o: kl });
      tf(cup, { y: float(lt, 2, 5, 0.9), r: -6, o: kl });
      tf(plant, { y: float(lt, 3, 4, 0.8), r: 4, o: kl });
      guy.face(lt);
      guy.el.style.opacity = kl;
    };
  });

  // ================= S9: montase MLG 2016 ("deal with it", hitmarker, +1000 aura) -> CTA =================
  const HIT = '<svg class="d11-hit" viewBox="-45 -45 90 90"><path d="M-36 -36L-12 -12M36 -36L12 -12M-36 36L-12 12M36 36L12 12" stroke="#000" stroke-width="13" stroke-linecap="square"/><path d="M-36 -36L-12 -12M36 -36L12 -12M-36 36L-12 12M36 36L12 12" stroke="#fff" stroke-width="6" stroke-linecap="square"/></svg>';
  KIT.registerType('mlg', (root, v, sc, tm, T) => {
    const tG = T(v.glassesAt, 0.12), tH = v.hitAt.map((x) => T(x, 0.5)), tLogo = T(v.logoAt, 1.4), tTag = T(v.tagAt, 2.9), tBtn = T(v.btnAt, 3.9);
    const mlg = h('<div class="abs" style="left:0;top:0;width:100%;height:100%"></div>');
    root.appendChild(mlg);
    const flares = [0, 1, 2].map((i) => { const e = h(`<div class="d11-flare" style="width:${[420, 180, 90][i]}px;height:${[420, 180, 90][i]}px;background:radial-gradient(circle, rgba(255,255,255,.95), rgba(255,240,180,.35) 35%, transparent 70%)"></div>`); mlg.appendChild(e); return e; });
    const aura = h('<div class="d11-aura">+1000 AURA</div>');
    mlg.appendChild(aura);
    const hits = tH.map(() => { const e = h(HIT); mlg.appendChild(e); return e; });
    const guy = dpo(root, { face: '😐', glasses: true });
    const P0 = pick([960, 1000, 1.45], [540, 1260, 1.55]), P1 = pick([1640, 1040, 0.95], [540, 1440, 0.82]);
    const cta = h('<div class="abs" style="left:0;top:0;width:100%;height:100%"></div>');
    root.appendChild(cta);
    const logo = h(`<div class="d11-logo" style="top:${pick(120, 330)}px"><img src="../assets/privasimu_logo.png" style="width:${pick(620, 760)}px" alt=""><div class="nx">NEXUS</div></div>`);
    const tag = h(`<div class="d11-tagline" style="top:${pick(400, 640)}px;font-size:${pick(78, 76)}px">${rich('Biar DPO tetap *waras*.')}</div>`);
    const btn = h(`<div class="d11-btn">${esc(v.button)}<div class="shine"></div></div>`);
    const chips = h(`<div class="d11-chips" style="top:${pick(700, 940)}px">${v.chips.map((c) => `<span>${esc(c).replace('gratis', '<b>gratis</b>')}</span>`).join('')}</div>`);
    const foot = h(`<div class="d11-foot" style="top:${pick(800, 1040)}px">${esc(v.foot)}</div>`);
    [logo, tag, btn, chips, foot].forEach((e) => cta.appendChild(e));
    const tagW = splitWords(tag);
    const fade = h('<div class="d11-fade"></div>');
    root.appendChild(fade);
    const HP = [[-260, -120], [230, -60], [-120, 150]].map(([x, y]) => [x * pick(1, 0.9), y * pick(1, 1.1)]);
    return (lt, d) => {
      const kO = E.io3(P(lt, tLogo - 0.1, tLogo + 0.35)); // MLG -> CTA
      // DPO + kacamata piksel jatuh
      const kg = P(lt, tG, tG + 0.3), gl = kg < 1 ? -900 * (1 - kg * kg) : -Math.sin(Math.PI * P(lt, tG + 0.3, tG + 0.5)) * 18;
      guy.pix.style.opacity = lt >= tG ? 1 : 0;
      guy.pix.style.transform = `translateY(${gl}px)`;
      guy.face(lt);
      const gx = lerp(P0[0], P1[0], kO), gy = lerp(P0[1], P1[1], kO), gs = lerp(P0[2], P1[2], kO);
      guy.at(gx, gy);
      const [jx, jy] = tH.some((t) => lt > t && lt < t + 0.18) ? jit(lt, 22, 11) : [0, 0];
      guy.el.style.transform = `translate(${jx}px, ${jy}px) scale(${gs * (1 + 0.06 * Math.sin(Math.PI * P(lt, tG + 0.3, tG + 0.45)))})`;
      // efek MLG
      mlg.style.opacity = 1 - kO;
      const headX = P0[0], headY = P0[1] - 330 * P0[2] + 110 * P0[2];
      hits.forEach((e, i) => {
        const on = lt >= tH[i] && lt < tH[i] + 0.35;
        e.style.opacity = on ? 1 - P(lt, tH[i] + 0.2, tH[i] + 0.35) : 0;
        place(e, headX + HP[i][0], headY + HP[i][1]);
        e.style.transform = `scale(${on ? lerp(1.4, 1, E.out3(P(lt, tH[i], tH[i] + 0.08))) : 1})`;
      });
      const ka = P(lt, 0.5, 0.85);
      place(aura, 0, pick(70, 330));
      tf(aura, { s: lerp(3, 1, E.outExpo(ka)), r: lerp(360, -4, E.out3(ka)), o: ka > 0 ? 1 : 0 });
      aura.style.backgroundPosition = `${(lt * 180) % 200}% 0`;
      flares.forEach((f, i) => {
        const fx = pick(420, 240) + i * pick(260, 170) + Math.sin(lt * 1.5) * 30, fy = pick(230, 520) + i * pick(120, 150);
        place(f, fx - f.offsetWidth / 2, fy - f.offsetHeight / 2);
        f.style.opacity = 0.9 * P(lt, 0.3, 0.6);
      });
      // CTA
      cta.style.opacity = P(lt, tLogo - 0.05, tLogo + 0.2);
      const kl = E.out3(P(lt, tLogo, tLogo + 0.6));
      tf(logo, { s: lerp(1.25, 1, kl), o: kl, blur: (1 - kl) * 10 });
      revealWords(tagW, tTag - 0.05, lt, { stagger: 0.06, dur: 0.5 });
      if (!btn._w && btn.offsetWidth) btn._w = btn.offsetWidth;
      place(btn, SW / 2 - (btn._w || 500) / 2, pick(530, 780));
      const kb = popK(lt, tBtn, 0.45);
      tf(btn, { s: 0.5 + 0.5 * kb, o: cl(kb) });
      $('.shine', btn).style.left = lerp(-150, (btn._w || 500) + 100, P((lt - tBtn - 0.4) % 2, 0, 0.8)) + 'px';
      tf(chips, { y: (1 - E.out3(P(lt, tBtn + 0.3, tBtn + 0.7))) * 24, o: E.out3(P(lt, tBtn + 0.3, tBtn + 0.7)) });
      tf(foot, { o: E.out3(P(lt, tBtn + 0.5, tBtn + 0.9)) });
      fade.style.opacity = P(lt, d - 0.4, d - 0.02);
    };
  });
})();
