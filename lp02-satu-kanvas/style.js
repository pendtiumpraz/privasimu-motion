// Gaya LP02 · SATU KANVAS: satu kanvas dunia (#kv-world) berisi semua stasiun teks; kamera (pan + zoom + sedikit
// miring) meluncur antarstasiun lewat lintasan melengkung, lalu mundur memperlihatkan seluruh kanvas sebagai poster.
// Grid hairline, tanda bidik, dan garis-garis penghubung ke pusat digambar di kanvas latar dengan transformasi kamera
// yang sama, jadi ikut bergerak bersama dunia. Kamera = fungsi murni waktu global → deterministik (render paralel).
// Diadaptasi dari t02-tipografi/style.js (dunia + kamera + latar grid), ditulis ulang untuk video tanpa VO:
// setiap baris punya waktu sendiri (detik lokal scene), tanpa pencocok kata VO.
(function () {
  const { V, SW, SH, h, esc, $ } = KIT;
  const { P, cl, lerp, E } = MG;
  const LOGO = '../assets/privasimu_logo.png', LOGO_AR = 1252 / 180;

  // ---------- geometri per format ----------
  // kisi dunia: kolom × baris sel (cincin 12 sel mengelilingi pusat); bingkai aman tempat stasiun aktif dibingkai
  const G = V ? { cols: 3, rows: 5, cw: 1200, ch: 1300, pad: 100 } : { cols: 4, rows: 4, cw: 2100, ch: 1200, pad: 240 };
  const WW = G.cols * G.cw, WH = G.rows * G.ch;
  const FR = V ? { x: 60, y: 200, w: 960, h: 1230 } : { x: 80, y: 80, w: 1760, h: 920 };
  const FCY = V ? 860 : FR.y + FR.h / 2; // pusat bingkai (x selalu SW/2); 9:16 sedikit di atas tengah, di dalam area aman
  const FILL = V ? [0.86, 0.5] : [0.6, 0.58];
  const ZMAX = 1.25;
  const HUB = { x: WW / 2, y: WH / 2, rx: V ? 560 : 1500, ry: V ? 780 : 760 };
  const LOGO_W = V ? 1000 : 2250;
  const CTA_LOGO = V ? { w: 760, y: 700 } : { w: 620, y: 395 }; // lebar & posisi y logo di layar saat CTA
  const DIM = 0.16; // blok yang sudah ditinggalkan kamera: jejak samar
  const ZST = V ? 0.86 : 0.84; // zoom tetap untuk sembilan stasiun (skala konsisten antarstasiun)
  const IVORY = [242, 237, 227], ACC = [47, 107, 255];
  const mixc = (a, b, k) => `rgb(${a.map((x, i) => Math.round(lerp(x, b[i], k))).join(',')})`;
  const smooth = (k) => k * k * (3 - 2 * k);

  // ---------- dunia ----------
  let view = null, world = null, logoEl = null, laid = false, SHOTS = null;
  const BL = []; // blok teks (urut sesuai scene)
  let REV = null, CTA = null;

  function ensureWorld() {
    if (world) return;
    view = h('<div id="kv-view"></div>'); // pembungkus layar: blur gerak dihitung dalam piksel layar
    world = h(`<div id="kv-world" style="width:${WW}px;height:${WH}px"></div>`);
    view.appendChild(world);
    $('#stage').insertBefore(view, $('#bg').nextSibling);
    logoEl = h(`<div class="kv-logo" style="width:${LOGO_W}px"><img src="${LOGO}" alt=""></div>`);
    world.appendChild(logoEl);
  }

  // teks kaya: *kata* = penekanan serif miring beraksen (warna mengikuti --hot blok), _kata_ = serif miring gading
  function tokens(row) {
    const out = [];
    let mode = '';
    row.split(/([*_])/).forEach((part) => {
      if (part === '*' || part === '_') { mode = mode === part ? '' : part; return; }
      part.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, cls: mode === '*' ? 'em' : mode === '_' ? 'it' : '' }));
    });
    return out;
  }
  const richHtml = (s) => esc(s).replace(/\*(.+?)\*/g, '<span class="em">$1</span>').replace(/_(.+?)_/g, '<span class="it">$1</span>');
  function letters(el, txt) {
    el.innerHTML = [...txt].map((ch) => `<span class="ch">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');
    return [...el.children];
  }

  // satu baris → elemen + keadaan animasi (waktu global)
  function buildLine(ln, sc) {
    const txt = V && ln.tv != null ? ln.tv : (ln.t || '');
    const fx = ln.fx || 'rise';
    const el = h(`<div class="ln ${ln.c || ''}"></div>`);
    const L = { el, fx, t0: sc.start + (ln.at || 0), ws: [], c: ln.c || '' };
    if (fx === 'kick') {
      el.innerHTML = '<span class="no"></span><i class="rule"></i><span class="lb"></span>';
      L.no = letters($('.no', el), ln.no || ''); L.rule = $('.rule', el); L.lb = letters($('.lb', el), txt.toUpperCase());
    } else if (fx === 'rule') {
      el.innerHTML = '<i class="rule"></i>'; L.rule = $('.rule', el);
    } else if (fx === 'type') {
      L.lt = letters(el, txt.toUpperCase());
    } else if (fx === 'wipe' || fx === 'slam' || fx === 'fade') {
      el.innerHTML = `<span class="i">${richHtml(txt)}</span>`; L.i = $('.i', el);
    } else { // rise: kata per kata naik dari balik garis dasar; '|' = patah baris
      let wi = 0;
      txt.split('|').forEach((row) => {
        const r = h('<div class="row"></div>');
        el.appendChild(r);
        tokens(row).forEach((tk) => {
          const cross = ln.cross && tk.w.replace(/[^\p{L}]/gu, '') === ln.cross;
          const we = h(`<span class="w ${tk.cls}${cross ? ' cross' : ''}"><span class="i">${esc(tk.w)}</span></span>`);
          r.appendChild(we);
          L.ws.push({ el: we, i: we.firstChild, t: L.t0 + wi * 0.075, cross });
          wi++;
        });
      });
    }
    if (/\bnote\b/.test(L.c)) { L.mk = h('<i class="mk"></i>'); el.insertBefore(L.mk, el.firstChild); }
    if (ln.bar) { L.bar = h('<i class="bar"><b></b></i>'); el.appendChild(L.bar); L.barT = ln.bar.map((x) => sc.start + x); L.barB = L.bar.firstChild; }
    return L;
  }

  // keadaan baris pada detik global t (z = zoom kamera, untuk blur dalam piksel layar)
  function lineState(L, t, z) {
    const u = t - L.t0;
    if (L.fx === 'kick') {
      L.no.forEach((c, j) => { c.style.opacity = u >= j * 0.05 ? 1 : 0; });
      L.rule.style.transform = `scaleX(${E.out3(P(u, 0.08, 0.8)).toFixed(4)})`;
      L.lb.forEach((c, j) => { c.style.opacity = u >= 0.3 + j * 0.022 ? 1 : 0; });
    } else if (L.fx === 'rule') {
      L.rule.style.transform = `scaleX(${E.io3(P(u, 0, 0.9)).toFixed(4)})`;
    } else if (L.fx === 'type') {
      L.lt.forEach((c, j) => { c.style.opacity = u >= j * 0.018 ? 1 : 0; });
    } else if (L.fx === 'wipe') {
      if (u <= 0) { L.el.style.opacity = 0; } else {
        L.el.style.opacity = 1;
        const k = P(u, 0, 0.95), e = E.out3(k);
        if (k >= 1) { L.i.style.webkitMaskImage = L.i.style.maskImage = 'none'; L.i.style.transform = 'none'; }
        else {
          const x = lerp(-25, 112, e).toFixed(2);
          const m = `linear-gradient(100deg, #000 ${(x - 22).toFixed(2)}%, rgba(0,0,0,.35) ${(x - 8).toFixed(2)}%, transparent ${x}%)`;
          L.i.style.webkitMaskImage = m; L.i.style.maskImage = m;
          L.i.style.transform = `translateX(${((1 - E.out3(P(u, 0, 1.2))) * -0.035).toFixed(4)}em)`;
        }
      }
    } else if (L.fx === 'slam') {
      if (u <= 0) { L.el.style.opacity = 0; } else {
        const k = E.outExpo(P(u, 0, 0.7));
        L.el.style.opacity = P(u, 0, 0.12).toFixed(3);
        L.i.style.transform = `scale(${lerp(1.22, 1, k).toFixed(4)})`;
        const bl = (1 - k) * 18 / Math.max(z, 0.05);
        L.i.style.filter = bl > 0.2 ? `blur(${bl.toFixed(2)}px)` : 'none';
      }
    } else if (L.fx === 'fade') {
      L.el.style.opacity = E.out3(P(u, 0, 0.8)).toFixed(3);
    } else {
      for (const w of L.ws) {
        const v = t - w.t;
        if (v <= 0) { w.el.style.opacity = 0; continue; }
        w.el.style.opacity = 1;
        const k = 1 - Math.pow(1 - P(v, 0, 0.72), 4);
        if (k >= 1) { w.el.style.clipPath = 'none'; w.i.style.transform = 'none'; continue; }
        w.el.style.clipPath = 'inset(-60% -40% -0.16em -40%)';
        w.i.style.transform = w.cross
          ? `translate(${((1 - E.out3(P(v, 0, 1.1))) * -0.9).toFixed(4)}em, ${((1 - k) * 112).toFixed(2)}%)`
          : `translateY(${((1 - k) * 112).toFixed(2)}%)`;
      }
    }
    if (L.mk) { const k = P(u, -0.12, 0.3); L.mk.style.opacity = k > 0 ? 1 : 0; L.mk.style.transform = `scale(${Math.max(0, E.outBack(k)).toFixed(3)})`; }
    if (L.bar) {
      const k = P(t, L.barT[0], L.barT[1]);
      L.bar.style.opacity = P(t, L.barT[0] - 0.2, L.barT[0] + 0.2).toFixed(3);
      L.barB.style.transform = `scaleX(${k.toFixed(4)})`;
    }
  }

  // ---------- tata letak (malas: setelah font dimuat) ----------
  function layout() {
    laid = true;
    for (const B of BL) {
      const w = B.el.offsetWidth, hh = B.el.offsetHeight;
      let x, y;
      if (B.v.hub) { // pusat kanvas: di bawah logo
        const lh = LOGO_W / LOGO_AR, gap = V ? 120 : 150, top = HUB.y - (lh + gap + hh) / 2;
        B.logoTop = top;
        x = HUB.x - w / 2; y = top + lh + gap;
        logoEl.style.left = (HUB.x - LOGO_W / 2) + 'px'; logoEl.style.top = top + 'px';
        HUB.logo = { x: HUB.x, y: top + lh / 2, w: LOGO_W, h: lh };
      } else {
        const [c, r] = V ? B.v.cell.v : B.v.cell.h;
        x = c * G.cw + G.pad; y = r * G.ch + (G.ch - hh) / 2;
      }
      B.el.style.left = x.toFixed(1) + 'px'; B.el.style.top = y.toFixed(1) + 'px';
      Object.assign(B, { x, y, w, h: hh });
      B.lines.forEach((L) => { L.x = L.el.offsetLeft; L.y = L.el.offsetTop; L.w = L.el.offsetWidth; L.h = L.el.offsetHeight; });
    }
    if (!HUB.logo) { const lh = LOGO_W / LOGO_AR; HUB.logo = { x: HUB.x, y: HUB.y, w: LOGO_W, h: lh }; logoEl.style.left = (HUB.x - LOGO_W / 2) + 'px'; logoEl.style.top = (HUB.y - lh / 2) + 'px'; }
    buildShots();
  }

  // bingkai kamera untuk baris [a..b] sebuah blok
  function frameOf(B, a = 0, b = B.lines.length - 1) {
    const ls = B.lines.slice(a, b + 1).filter((L) => L.w > 2 && L.h > 2);
    const x0 = B.x + Math.min(...ls.map((L) => L.x)), x1 = B.x + Math.max(...ls.map((L) => L.x + L.w));
    const y0 = B.y + Math.min(...ls.map((L) => L.y)), y1 = B.y + Math.max(...ls.map((L) => L.y + L.h));
    const f = B.v.fill ? (V ? B.v.fill.v : B.v.fill.h) : FILL;
    const z = /\bst\b/.test(B.v.blk) ? Math.min(ZST, FR.w * 0.92 / (x1 - x0), FR.h * 0.82 / (y1 - y0))
      : Math.min(FR.w * f[0] / (x1 - x0), FR.h * f[1] / (y1 - y0), ZMAX);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z, r: 0, ay: FCY };
  }
  const FULL = () => ({ x: WW / 2, y: WH / 2, z: Math.min(SW * 0.93 / WW, SH * 0.93 / WH), r: 0, ay: SH / 2 });

  // ---------- kamera ----------
  // SHOTS: { a, b: jendela perjalanan (detik global), c: sasaran, kind: 'travel'|'frame'|'pull'|'push', B: blok }
  function buildShots() {
    SHOTS = [];
    let side = 1;
    for (const B of BL) {
      const sc = B.sc, mv = B.v.move || [0, 1.5];
      const mA = mv[0] < 0 ? -1 : sc.start + mv[0], mB = mv[1] < 0 ? -1 : sc.start + mv[1];
      const fr = B.v.frames;
      if (fr === 'lines') {
        B.lines.forEach((L, j) => {
          const c = frameOf(B, 0, j);
          if (!j) SHOTS.push({ a: mA, b: mB, c, kind: 'travel', B });
          else SHOTS.push({ a: L.t0 - 0.12, b: L.t0 + 0.95, c, kind: 'frame', B });
        });
      } else if (Array.isArray(fr)) {
        fr.forEach(([a, b, at], k) => {
          const c = frameOf(B, a, b);
          if (!k) SHOTS.push({ a: mA, b: mB, c, kind: 'travel', B });
          else SHOTS.push({ a: sc.start + at, b: sc.start + at + 1.2, c, kind: 'frame', B });
        });
      } else SHOTS.push({ a: mA, b: mB, c: frameOf(B), kind: 'travel', B });
      B.shotEnd = SHOTS.length; // indeks shot berikutnya = saat blok ditinggalkan
    }
    if (REV) SHOTS.push({ a: REV.pull[0], b: REV.pull[1], c: FULL(), kind: 'pull' });
    if (CTA) {
      const z = CTA_LOGO.w / LOGO_W;
      SHOTS.push({ a: CTA.move[0], b: CTA.move[1], c: { x: HUB.logo.x, y: HUB.logo.y, z, r: 0, ay: CTA_LOGO.y }, kind: 'push' });
    }
    // asal tiap perjalanan = keadaan kamera sebenarnya saat perjalanan dimulai (tanpa lompatan)
    SHOTS.forEach((S, i) => {
      if (!i) { S.from = S.c; return; }
      S.from = evalShot(i - 1, S.a);
      const dx = S.c.x - S.from.x, dy = S.c.y - S.from.y, d = Math.hypot(dx, dy) * Math.sqrt(S.c.z * S.from.z);
      if (S.kind === 'travel') {
        side = -side;
        S.bow = 0.22 * side; S.bank = 1.6 * side * Math.sign(dx || 1); S.dip = cl(0.05 + 0.13 * d / SW, 0, 0.22);
      } else { S.bow = 0; S.bank = 0; S.dip = S.kind === 'pull' ? 0 : 0; }
      // arah lanjutan (drift lateral pelan searah perjalanan, dalam piksel layar per detik)
      const n = Math.hypot(dx, dy) || 1;
      S.vx = S.kind === 'travel' ? (dx / n) * 7 : 0; S.vy = S.kind === 'travel' ? (dy / n) * 7 : 0;
      S.zk = S.kind === 'pull' ? -0.0075 : S.kind === 'push' ? 0.006 : 0.011;
    });
    SHOTS[0].vx = SHOTS[0].vy = 0; SHOTS[0].zk = 0.012;
  }

  function travel(S, p) {
    const A = S.from, B = S.c;
    const e = E.io3(p);
    const mx = (A.x + B.x) / 2 - (B.y - A.y) * S.bow, my = (A.y + B.y) / 2 + (B.x - A.x) * S.bow;
    const x = (1 - e) * (1 - e) * A.x + 2 * (1 - e) * e * mx + e * e * B.x;
    const y = (1 - e) * (1 - e) * A.y + 2 * (1 - e) * e * my + e * e * B.y;
    const z = Math.exp(lerp(Math.log(A.z), Math.log(B.z), e)) * (1 - S.dip * Math.sin(Math.PI * e));
    return { x, y, z, r: lerp(A.r, B.r, e) + S.bank * Math.sin(Math.PI * e), ay: lerp(A.ay, B.ay, e) };
  }
  function hold(S, u) {
    const g = u - 0.7 * (1 - Math.exp(-u / 0.7)); // mulai halus (kecepatan 0), lalu konstan
    const z = S.c.z * (1 + S.zk * g);
    return { x: S.c.x + S.vx * g / z, y: S.c.y + S.vy * g / z, z, r: S.c.r, ay: S.c.ay };
  }
  function evalShot(i, t) {
    const S = SHOTS[i];
    if (S.b > S.a && t < S.b) return travel(S, P(t, S.a, S.b));
    return hold(S, Math.max(0, t - Math.max(S.b, S.a)));
  }
  function camera(t) {
    if (!laid) layout();
    let i = 0;
    for (let j = 0; j < SHOTS.length; j++) if (t >= SHOTS[j].a) i = j;
    return evalShot(i, t);
  }
  // kecepatan layar kamera (px/dtk) → blur gerak halus
  function camSpeed(t) {
    const a = camera(t - 1 / 60), b = camera(t + 1 / 60), z = (a.z + b.z) / 2;
    return Math.hypot(b.x - a.x, b.y - a.y) * z * 30 + Math.abs(Math.log(b.z / a.z)) * 30 * 900;
  }
  const camCss = (c) => `translate(${(SW / 2).toFixed(2)}px, ${c.ay.toFixed(2)}px) rotate(${(-c.r).toFixed(4)}deg) scale(${c.z.toFixed(6)}) translate(${(-c.x).toFixed(3)}px, ${(-c.y).toFixed(3)}px)`;
  function toScreen(c, x, y) { // titik dunia → layar
    const rad = (-c.r * Math.PI) / 180, dx = (x - c.x) * c.z, dy = (y - c.y) * c.z;
    return { x: SW / 2 + dx * Math.cos(rad) - dy * Math.sin(rad), y: c.ay + dx * Math.sin(rad) + dy * Math.cos(rad) };
  }

  // kotak teks yang sudah tampil (dunia): blok bertahap tumbuh halus mengikuti baris baru; stasiun = seluruh blok
  function shownBox(B, t) {
    if (!B.v.frames) return { x0: B.x, y0: B.y, x1: B.x + B.w, y1: B.y + B.h };
    let bx = null;
    for (const L of B.lines) {
      if (L.w < 2 || L.h < 2) continue;
      const r = { x0: B.x + L.x, y0: B.y + L.y, x1: B.x + L.x + L.w, y1: B.y + L.y + L.h };
      if (!bx) { bx = r; continue; }
      const a = E.io3(P(t, L.t0 - 0.12, L.t0 + 0.7));
      if (a <= 0) break;
      bx = { x0: lerp(bx.x0, Math.min(bx.x0, r.x0), a), y0: lerp(bx.y0, Math.min(bx.y0, r.y0), a), x1: lerp(bx.x1, Math.max(bx.x1, r.x1), a), y1: lerp(bx.y1, Math.max(bx.y1, r.y1), a) };
    }
    return bx;
  }

  // riak saat poster utuh: tiap stasiun (urut 01 → 09) menyala sebentar, denyut cahaya mengalir ke pusat
  const RSTEP = 0.17;
  function stIndex(B) { return BL.filter((x) => /\bst\b/.test(x.v.blk)).indexOf(B); }
  function ripple(B, t) {
    const i = stIndex(B);
    if (i < 0 || !REV) return 0;
    const t0 = REV.ripple + i * RSTEP;
    return P(t, t0 - 0.05, t0 + 0.25) * (1 - P(t, t0 + 0.7, t0 + 1.6));
  }

  // ---------- keadaan blok ----------
  // aktif: naik saat kamera tiba, turun saat kamera berangkat ke blok berikutnya
  function activity(B, t) {
    if (B.v.hub && REV && t >= REV.pull[0]) return 1; // pusat tetap menyala saat kamera mundur
    const S0 = SHOTS.find((S) => S.B === B);
    const up = S0.a < 0 ? 1 : P(t, S0.a, S0.a + Math.max(0.3, (S0.b - S0.a) * 0.7));
    const nx = SHOTS[B.shotEnd];
    const down = nx ? P(t, nx.a, nx.a + 0.9) : 0;
    return cl(up - down);
  }
  function blockOpacity(B, t, act) {
    // jejak blok yang ditinggalkan makin samar seiring waktu (sampai poster dibuka lagi saat kamera mundur)
    const nx = SHOTS[B.shotEnd], age = nx && t > nx.a ? t - nx.a : 0;
    let o = lerp(lerp(0.05, DIM, Math.exp(-age / 14)), 1, act);
    if (REV && t >= REV.pull[0]) o = lerp(o, B.v.hub ? 1 : 0.92, E.io3(P(t, REV.pull[0], REV.pull[0] + 1.6)));
    if (CTA && t >= CTA.start) o = lerp(o, 0.05, E.io3(P(t, CTA.start, CTA.start + 1.1)));
    if (CTA && B.v.hub && t >= CTA.start) o *= 1 - P(t, CTA.start, CTA.start + 0.6);
    return o;
  }

  function renderWorld(t) {
    const c = camera(t);
    world.style.transform = camCss(c);
    const sp = camSpeed(t), mb = cl((sp - 900) / 2600) * 2.2; // blur gerak hanya saat meluncur cepat
    view.style.filter = mb > 0.15 ? `blur(${mb.toFixed(2)}px)` : 'none';
    for (const B of BL) {
      if (t < B.t0 - 0.05) { B.el.style.visibility = 'hidden'; continue; }
      // culling: blok di luar layar tidak digambar
      const pts = [[B.x, B.y], [B.x + B.w, B.y], [B.x, B.y + B.h], [B.x + B.w, B.y + B.h]].map(([x, y]) => toScreen(c, x, y));
      const off = Math.max(...pts.map((p) => p.x)) < -60 || Math.min(...pts.map((p) => p.x)) > SW + 60 || Math.max(...pts.map((p) => p.y)) < -60 || Math.min(...pts.map((p) => p.y)) > SH + 60;
      if (off) { B.el.style.visibility = 'hidden'; continue; }
      B.el.style.visibility = 'visible';
      const act = activity(B, t);
      const hot = B.v.hub ? Math.max(act, REV && t >= REV.pull[0] ? 1 : 0) : (REV && t >= REV.pull[0] ? Math.max(act * (1 - P(t, REV.pull[0], REV.pull[0] + 1)), ripple(B, t)) : act);
      B.el.style.setProperty('--hot', mixc(IVORY, ACC, hot));
      B.el.style.opacity = blockOpacity(B, t, act).toFixed(3);
      const cb = CTA && t >= CTA.start ? E.io3(P(t, CTA.start, CTA.start + 1.4)) * 3 / Math.max(c.z, 0.05) : 0;
      B.el.style.filter = cb > 0.2 ? `blur(${cb.toFixed(2)}px)` : 'none';
      // cek teks QA hanya untuk blok yang sedang dibingkai (blok lain memang boleh terpotong tepi layar)
      const focus = act > 0.5 && !(REV && t >= REV.pull[0]);
      if (focus) B.el.removeAttribute('data-bebas'); else B.el.setAttribute('data-bebas', '');
      for (const L of B.lines) lineState(L, t, c.z);
    }
    // logo pusat
    if (REV) {
      const k = E.out3(P(t, REV.logo - 0.15, REV.logo + 1.1));
      logoEl.style.opacity = k.toFixed(3);
      const bl = (1 - k) * 16 / Math.max(c.z, 0.05);
      logoEl.style.filter = bl > 0.3 ? `blur(${bl.toFixed(2)}px)` : 'none';
      logoEl.style.transform = `scale(${lerp(1.08, 1, E.out3(P(t, REV.logo - 0.15, REV.logo + 1.6))).toFixed(4)})`;
      logoEl.style.visibility = t < REV.logo - 0.2 ? 'hidden' : 'visible';
    } else logoEl.style.visibility = 'hidden';
  }

  // ---------- latar: tinta + grid hairline dunia + tanda bidik + garis penghubung ----------
  function drawBg(cx, t, id, th, W, H) {
    cx.fillStyle = '#0B1020'; cx.fillRect(0, 0, W, H);
    const g = cx.createRadialGradient(W * 0.5, H * 0.46, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.72);
    g.addColorStop(0, 'rgba(36,48,86,.34)'); g.addColorStop(1, 'rgba(4,6,14,.55)');
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    if (!BL.length) return;
    const c = camera(t);
    cx.save();
    cx.translate(W / 2, c.ay); cx.rotate((-c.r * Math.PI) / 180); cx.scale(c.z, c.z); cx.translate(-c.x, -c.y);
    const reach = Math.hypot(W, H) / c.z / 1.6, X0 = Math.max(0, c.x - reach), X1 = Math.min(WW, c.x + reach), Y0 = Math.max(0, c.y - reach), Y1 = Math.min(WH, c.y + reach);
    const px = 1 / c.z; // 1 piksel layar dalam satuan dunia
    // grid kecil 100 satuan (memudar saat kamera jauh), grid sel, bingkai poster
    const minorA = 0.042 * cl((100 * c.z - 12) / 18);
    const lines = (step, a, lw) => {
      if (a <= 0.002) return;
      cx.strokeStyle = `rgba(242,237,227,${a.toFixed(4)})`; cx.lineWidth = lw * px;
      cx.beginPath();
      for (let x = Math.ceil(X0 / step) * step; x <= X1; x += step) { cx.moveTo(x, Y0); cx.lineTo(x, Y1); }
      for (let y = Math.ceil(Y0 / step) * step; y <= Y1; y += step) { cx.moveTo(X0, y); cx.lineTo(X1, y); }
      cx.stroke();
    };
    lines(100, minorA, 1);
    cx.strokeStyle = 'rgba(242,237,227,.1)'; cx.lineWidth = px;
    cx.beginPath();
    for (let i = 0; i <= G.cols; i++) { cx.moveTo(i * G.cw, 0); cx.lineTo(i * G.cw, WH); }
    for (let j = 0; j <= G.rows; j++) { cx.moveTo(0, j * G.ch); cx.lineTo(WW, j * G.ch); }
    cx.stroke();
    // tanda registrasi "+" di persilangan sel
    cx.strokeStyle = 'rgba(242,237,227,.34)'; cx.lineWidth = 1.2 * px;
    const m = 9 * px;
    cx.beginPath();
    for (let i = 0; i <= G.cols; i++) for (let j = 0; j <= G.rows; j++) { const x = i * G.cw, y = j * G.ch; cx.moveTo(x - m, y); cx.lineTo(x + m, y); cx.moveTo(x, y - m); cx.lineTo(x, y + m); }
    cx.stroke();
    // tanda bidik di sudut blok yang sedang dibingkai
    for (const B of BL) {
      if (t < B.t0 - 0.05 || (REV && t >= REV.pull[0])) continue;
      const act = activity(B, t);
      if (act < 0.02) continue;
      const S0 = SHOTS.find((S) => S.B === B), k = E.out3(S0.a < 0 ? P(t, B.t0 - 0.1, B.t0 + 0.6) : P(t, S0.b - 0.5, S0.b + 0.4));
      const o = (34 + (1 - k) * 40) * px, L = 30 * px, bx = shownBox(B, t);
      const x0 = bx.x0 - o, y0 = bx.y0 - o, x1 = bx.x1 + o, y1 = bx.y1 + o;
      cx.strokeStyle = `rgba(242,237,227,${(0.42 * act * k).toFixed(3)})`; cx.lineWidth = 1.4 * px;
      cx.beginPath();
      [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(([x, y, sx, sy]) => { cx.moveTo(x + sx * L, y); cx.lineTo(x, y); cx.lineTo(x, y + sy * L); });
      cx.stroke();
    }
    // garis penghubung: tiap stasiun → pusat (Privasimu)
    if (REV && t >= REV.spokes[0] - 0.05) {
      const fade = CTA && t >= CTA.start ? lerp(1, 0.14, E.io3(P(t, CTA.start, CTA.start + 1.1))) : 1;
      const st = BL.filter((B) => /\bst\b/.test(B.v.blk));
      const dur = (REV.spokes[1] - REV.spokes[0]) * 0.62;
      st.forEach((B, i) => {
        const t0 = REV.spokes[0] + i * (REV.spokes[1] - REV.spokes[0] - dur) / Math.max(1, st.length - 1);
        const k = E.io3(P(t, t0, t0 + dur));
        if (k <= 0) return;
        const mg = 46;
        const sx = cl(HUB.x, B.x - mg, B.x + B.w + mg), sy = cl(HUB.y, B.y - mg, B.y + B.h + mg);
        const dx = sx - HUB.x, dy = sy - HUB.y, s = 1 / Math.hypot(dx / HUB.rx, dy / HUB.ry);
        if (s >= 1) return;
        const ex = HUB.x + dx * s, ey = HUB.y + dy * s;
        const qx = lerp(sx, ex, k), qy = lerp(sy, ey, k);
        cx.strokeStyle = `rgba(47,107,255,${(0.9 * fade).toFixed(3)})`; cx.lineWidth = 1.7 * px;
        cx.beginPath(); cx.moveTo(sx, sy); cx.lineTo(qx, qy); cx.stroke();
        cx.fillStyle = `rgba(47,107,255,${fade.toFixed(3)})`;
        cx.beginPath(); cx.arc(sx, sy, 4.2 * px, 0, Math.PI * 2); cx.fill();
        if (k >= 1) { cx.beginPath(); cx.arc(ex, ey, 3.2 * px, 0, Math.PI * 2); cx.fill(); }
        // denyut: titik cahaya mengalir dari stasiun ke pusat
        const tp = REV.ripple + i * RSTEP, q = P(t, tp, tp + 1.15);
        if (q > 0 && q < 1) {
          const e = E.io3(q), dx2 = lerp(sx, ex, e), dy2 = lerp(sy, ey, e), a = Math.sin(Math.PI * q) * fade;
          const gr = cx.createRadialGradient(dx2, dy2, 0, dx2, dy2, 16 * px);
          gr.addColorStop(0, `rgba(160,190,255,${(0.9 * a).toFixed(3)})`); gr.addColorStop(0.35, `rgba(47,107,255,${(0.45 * a).toFixed(3)})`); gr.addColorStop(1, 'rgba(47,107,255,0)');
          cx.fillStyle = gr; cx.beginPath(); cx.arc(dx2, dy2, 16 * px, 0, Math.PI * 2); cx.fill();
        }
      });
      // cincin pusat
      const kr = E.io3(P(t, REV.spokes[1] - 0.5, REV.spokes[1] + 1.2));
      if (kr > 0) {
        cx.strokeStyle = `rgba(242,237,227,${(0.22 * fade).toFixed(3)})`; cx.lineWidth = 1.1 * px;
        cx.beginPath(); cx.ellipse(HUB.x, HUB.y, HUB.rx, HUB.ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * kr); cx.stroke();
      }
    }
    // bingkai poster (tepi kanvas)
    cx.strokeStyle = 'rgba(242,237,227,.16)'; cx.lineWidth = px;
    cx.strokeRect(0, 0, WW, WH);
    cx.restore();
  }

  KIT.style({
    fonts: ['400 100px "Instrument Serif"', 'italic 400 100px "Instrument Serif"', '300 100px "Inter Tight"', '400 100px "Inter Tight"',
      '500 100px "Inter Tight"', '600 100px "Inter Tight"', '500 30px "JetBrains Mono"'],
    themes: { ink: ['#11182c', '#0B1020', '#0B1020', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'] },
    bg: drawBg,
  });

  // ---------- tipe scene ----------
  KIT.registerType('kv', (root, v, sc) => {
    ensureWorld();
    if (v.reveal) {
      REV = { start: sc.start, pull: v.pull.map((x) => sc.start + x), spokes: v.spokes.map((x) => sc.start + x), logo: sc.start + v.logo, ripple: sc.start + v.ripple };
      return (lt) => renderWorld(sc.start + lt);
    }
    const el = h(`<div class="kv-blk ${v.blk}"></div>`);
    world.appendChild(el);
    const lines = v.lines.map((ln) => buildLine(ln, sc));
    lines.forEach((L) => el.appendChild(L.el));
    BL.push({ el, lines, sc, v, t0: Math.min(...lines.map((L) => L.t0)) });
    return (lt) => renderWorld(sc.start + lt);
  });

  KIT.registerType('kv_cta', (root, v, sc) => {
    ensureWorld();
    CTA = { start: sc.start, move: v.move.map((x) => sc.start + x) };
    const box = h(`<div class="kv-cta">
      <div class="tagline">${esc(v.tag)}</div>
      <div class="btn"><span class="b1">${esc(v.btn)}</span><span class="dash">—</span><span class="b2">${esc(v.url)}</span></div>
      <div class="foot">${esc(v.foot)}</div></div>`);
    root.appendChild(box);
    const tg = $('.tagline', box), btn = $('.btn', box), foot = $('.foot', box);
    box.style.top = (CTA_LOGO.y + (CTA_LOGO.w / LOGO_AR) / 2 + (V ? 92 : 70)) + 'px';
    return (lt) => {
      const t = sc.start + lt;
      renderWorld(t);
      const k1 = E.out3(P(lt, v.tagAt, v.tagAt + 0.9));
      tg.style.opacity = k1.toFixed(3); tg.style.transform = `translateY(${((1 - k1) * 26).toFixed(2)}px)`;
      const k2 = E.out3(P(lt, v.btnAt, v.btnAt + 0.8));
      btn.style.opacity = k2.toFixed(3); btn.style.transform = `translateY(${((1 - k2) * 22).toFixed(2)}px)`;
      const k3 = E.out3(P(lt, v.footAt, v.footAt + 0.8));
      foot.style.opacity = k3.toFixed(3);
    };
  });

  window.KV_DEBUG = () => ({ WW, WH, blocks: BL.map((B) => ({ blk: B.v.blk, x: B.x, y: B.y, w: B.w, h: B.h })), shots: SHOTS && SHOTS.map((S) => ({ a: S.a, b: S.b, kind: S.kind, c: S.c })) });
})();
