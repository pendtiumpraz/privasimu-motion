// Gaya GB05 · ONE-LINE ART: satu garis tinta tanpa putus. Seluruh garis = deretan potongan path SVG yang saling
// menyambung (ujung potongan = awal potongan berikutnya); tiap potongan dibuka dengan stroke-dashoffset sesuai jadwal.
// Rute besar mengikuti siluet gembok, jadi saat kamera mundur seluruh perjalanan terbaca sebagai satu gembok.
// Semua gerak = fungsi murni dari waktu (deterministik untuk render paralel).
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const LOGO = '../assets/privasimu_logo.png';
  const D2R = Math.PI / 180, NS = 'http://www.w3.org/2000/svg';
  const r1 = (n) => Math.round(n * 10) / 10;
  const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const TINTA = '#14213D', BIRU = '#2F6BFF', KERTAS = '#FAF6EE';
  document.body.insertAdjacentHTML('beforeend', '<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">✓</div>');

  // ---------------------------------------------------------------- pena (pembangun path)
  class Pen {
    constructor(x, y) { this.x = x; this.y = y; this.d = `M${r1(x)} ${r1(y)}`; }
    L(...pts) { for (const [x, y] of pts) { this.d += ` L${r1(x)} ${r1(y)}`; this.x = x; this.y = y; } return this; }
    C(a, b, p) { this.d += ` C${r1(a[0])} ${r1(a[1])} ${r1(b[0])} ${r1(b[1])} ${r1(p[0])} ${r1(p[1])}`; this.x = p[0]; this.y = p[1]; return this; }
    // spline halus (Catmull-Rom) melewati titik-titik, mulai dari posisi pena
    S(pts) {
      const p = [[this.x, this.y], ...pts];
      for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
        this.C([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2);
      }
      return this;
    }
    // busur elips, sudut derajat (0 = kanan, 90 = bawah; a1 > a0 = searah jarum jam di layar)
    arc(cx, cy, rx, ry, a0, a1) {
      const s = [cx + rx * Math.cos(a0 * D2R), cy + ry * Math.sin(a0 * D2R)];
      if (Math.hypot(s[0] - this.x, s[1] - this.y) > 0.5) this.L(s);
      const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / 60));
      for (let i = 0; i < n; i++) {
        const a = (a0 + ((a1 - a0) * i) / n) * D2R, b = (a0 + ((a1 - a0) * (i + 1)) / n) * D2R, k = (4 / 3) * Math.tan((b - a) / 4);
        const p0 = [cx + rx * Math.cos(a), cy + ry * Math.sin(a)], p3 = [cx + rx * Math.cos(b), cy + ry * Math.sin(b)];
        this.C([p0[0] - k * rx * Math.sin(a), p0[1] + k * ry * Math.cos(a)], [p3[0] + k * rx * Math.sin(b), p3[1] - k * ry * Math.cos(b)], p3);
      }
      return this;
    }
  }

  // ---------------------------------------------------------------- geometri gembok (satuan dunia)
  const WW = 6200, WH = 7000;
  const XL = 1500, XR = 4500, YT = 3600, YB = 5900, RC = 240; // badan
  const LX = 2150, RX = 3850, AY = 2550, AR = 850, ACX = 3000; // sengkang
  const KX = 3000, KY = 4450, KR = 230; // lubang kunci
  const busur = (deg) => [ACX + AR * Math.cos(deg * D2R), AY + AR * Math.sin(deg * D2R)];
  const BIRU_MUDA = '#DCE7FF';

  // stasiun: c = pusat ikon, p/q = titik lepas/kembali di rute gembok, n = arah keluar, s/e = pintu masuk/keluar ikon (relatif c)
  const ST = {
    rina: { c: [2620, 2980], label: 'Rina', sub: 'tokoh ilustrasi', lab: [0, 252], blob: '#FFD9C7', bebas: true, s: [-170, 170], e: [170, 170],
      draw(pen, x, y) {
        pen.C([x - 172, y + 70], [x - 112, y + 22], [x - 42, y + 6]).L([x - 36, y - 15]).arc(x, y - 96, 82, 90, 116, 424).L([x + 42, y + 6])
          .C([x + 112, y + 22], [x + 172, y + 70], [x + 170, y + 170]);
      } },
    form: { c: [3400, 2980], label: 'Setuju', sub: 'formulir pendaftaran', lab: [0, 252], blob: '#FFE7A3', bebas: true, s: [-130, 120], e: [-130, 170],
      draw(pen, x, y) {
        pen.L([x - 130, y - 60], [x + 70, y - 60], [x - 130, y - 60], [x - 130, y - 115], [x + 70, y - 115], [x - 130, y - 115], [x - 130, y - 170], [x + 130, y - 170], [x + 130, y - 20],
          [x + 40, y + 92], [x - 12, y + 40], [x + 40, y + 92], [x + 130, y - 20], [x + 130, y + 170], [x - 130, y + 170]);
      } },
    marketing: { c: [1050, 4200], p: [XL, 4145], q: [XL, 4255], n: [-1, 0], label: 'Marketing', lab: [0, -285], blob: '#FFD3DF', s: [150, -45], e: [150, 45],
      draw(pen, x, y) {
        pen.L([x + 90, y - 45], [x - 150, y - 150]).C([x - 218, y - 150], [x - 218, y + 150], [x - 150, y + 150]).L([x + 90, y + 45], [x + 150, y + 45]);
      } },
    cs: { c: [1050, 5200], p: [XL, 5145], q: [XL, 5255], n: [-1, 0], label: 'Layanan pelanggan', lab: [0, -300], blob: '#CDE8D3', s: [150, -30], e: [150, 50],
      draw(pen, x, y) {
        pen.L([x + 125, y - 30]).arc(x, y - 30, 125, 140, 0, -180)
          .L([x - 100, y - 30], [x - 100, y + 80], [x - 150, y + 80], [x - 150, y - 30], [x - 125, y - 30], [x - 150, y - 30], [x - 150, y + 80], [x - 125, y + 80])
          .S([[x - 120, y + 126], [x - 76, y + 160], [x - 22, y + 152]]).arc(x, y + 152, 22, 22, 180, 540)
          .S([[x + 60, y + 152], [x + 108, y + 126], [x + 125, y + 80]])
          .L([x + 150, y + 80], [x + 125, y + 80], [x + 100, y + 80], [x + 100, y - 30], [x + 150, y - 30], [x + 150, y + 50]);
      } },
    pihak3: { c: [2300, 6350], p: [2245, YB], q: [2355, YB], n: [0, 1], label: 'Pihak ketiga', lab: [0, 250], blob: '#E2D8FF', s: [-55, -150], e: [70, -20],
      draw(pen, x, y) {
        pen.L([x - 120, y - 150], [x - 120, y + 170], [x - 85, y + 170], [x - 85, y + 95], [x - 30, y + 95], [x - 30, y + 170], [x + 130, y + 170], [x + 130, y - 20],
          [x + 10, y - 20], [x + 10, y - 150], [x - 55, y - 150], [x + 10, y - 150], [x + 10, y - 20], [x + 70, y - 20]);
      } },
    cloud: { c: [3700, 6350], p: [3645, YB], q: [3755, YB], n: [0, 1], label: 'Cloud', lab: [0, 235], blob: '#CFE0FF', s: [-44.2, -124], e: [24.2, -124],
      draw(pen, x, y) {
        pen.arc(x - 10, y - 30, 100, 100, 250, 188.5).arc(x - 115, y + 25, 70, 70, 275, 90).L([x + 105, y + 95]).arc(x + 105, y + 15, 80, 80, 90, -104.8)
          .arc(x - 10, y - 30, 100, 100, 341.15, 250).arc(x - 10, y - 30, 100, 100, 250, 290);
      } },
    surat: { c: [4950, 5200], p: [XR, 5255], q: [XR, 5145], n: [1, 0], label: '“Tolong hapus data saya.”', lab: [10, 245], blob: '#FFE7A3', s: [-170, 50], e: [170, -110],
      draw(pen, x, y) {
        pen.L([x - 170, y - 110], [x + 170, y - 110], [x + 170, y + 110], [x - 170, y + 110], [x - 170, y - 110], [x, y + 18], [x + 170, y - 110]);
      },
      pulang(pen, x, y, q) { pen.C([x + 200, y - 300], [x - 330, y - 270], q); } },
    kusut: { c: [5020, 4200], p: [XR, 4255], q: [XR, 4145], n: [1, 0], label: 'Kusut', label2: 'Rapi', sub2: 'Privasimu Nexus', lab: [20, 330], blob: '#FFD9C7', blob2: BIRU_MUDA, z: 0.86, kusut: true },
    bukti: { c: [4300, 3050], p: [RX, 3105], q: [RX, 2995], n: [1, 0], label: 'Bukti persetujuan', sub: 'Consent', lab: [0, 235], blob: '#CDE8D3', biru: true, s: [-150, 55], e: [-150, -55],
      draw(pen, x, y) {
        pen.L([x - 150, y + 120], [x + 40, y + 120]).arc(x + 85, y + 120, 45, 45, 180, 540).L([x + 150, y + 120], [x + 150, y - 120], [x + 100, y - 120], [x + 100, y - 78],
          [x + 10, y + 38], [x - 42, y - 12], [x + 10, y + 38], [x + 100, y - 78], [x + 100, y - 120], [x - 150, y - 120], [x - 150, y - 55]);
      } },
    ropa: { c: [3919, 1631], p: busur(-41.3), q: busur(-48.7), n: [0.707, -0.707], label: 'RoPA', sub: 'catatan pemrosesan', lab: [0, -290], blob: '#CFE0FF', biru: true, s: [-60, 150], e: [-130, 80],
      draw(pen, x, y) {
        pen.L([x - 130, y + 150], [x - 130, y + 35], [x + 70, y + 35], [x - 130, y + 35], [x - 130, y - 25], [x + 70, y - 25], [x - 130, y - 25],
          [x - 130, y - 85], [x + 30, y - 85], [x - 130, y - 85], [x - 130, y - 150], [x + 80, y - 150], [x + 80, y - 100], [x + 130, y - 100], [x + 80, y - 150], [x + 130, y - 100],
          [x + 130, y + 150], [x - 60, y + 150], [x - 130, y + 150], [x - 130, y + 80]);
      } },
    dpia: { c: [2081, 1631], p: busur(-131.3), q: busur(-138.7), n: [-0.707, -0.707], label: 'DPIA', sub: 'penilaian risiko', lab: [0, -285], blob: '#FFD3DF', biru: true, s: [140, 80], e: [60, 140],
      draw(pen, x, y) {
        const X = [x - 140, x - 46.7, x + 46.7, x + 140], Y = [y - 140, y - 46.7, y + 46.7, y + 140];
        pen.L([X[3], Y[3]], [x + 60, Y[3]], [X[3], Y[3]], [X[3], Y[2]], [X[0], Y[2]], [X[0], Y[1]], [X[3], Y[1]], [X[3], Y[0]], [X[2], Y[0]], [X[2], Y[3]], [X[1], Y[3]], [X[1], Y[0]],
          [X[0], Y[0]], [X[0], Y[3]], [x + 60, Y[3]]);
      } },
    dsr: { c: [1700, 3050], p: [LX, 2995], q: [LX, 3105], n: [-1, 0], label: 'DSR', sub: 'permintaan terlacak', lab: [0, 250], blob: '#FFE7A3', biru: true, s: [150, -60], e: [150, 60],
      draw(pen, x, y) {
        const nx = x - 70;
        pen.L([x + 110, y - 110], [nx + 26, y - 110]).arc(nx, y - 110, 26, 26, 0, -360).arc(nx, y - 110, 26, 26, 0, 90).L([nx, y - 26])
          .arc(nx, y, 26, 26, 270, 630).arc(nx, y, 26, 26, 270, 360).L([x + 110, y], [nx + 26, y]).arc(nx, y, 26, 26, 0, 90).L([nx, y + 84])
          .arc(nx, y + 110, 26, 26, 270, 630).arc(nx, y + 110, 26, 26, 270, 360).L([x + 50, y + 110], [x + 82, y + 145], [x + 150, y + 60]);
      } },
  };
  const VIEW_PEMBUKA = { x: 2990, y: 2340, z: pick(1.0, 0.84) };
  const Z_ST = pick(1.02, 1.1);

  // titik kusut & rapi (jumlah titik sama → bisa diinterpolasi)
  const NK = 260;
  function titikKusut(st) {
    const [cx, cy] = st.c, s = st.p, e = st.q, A = [], B = [];
    const sm = (a, b, u) => { const k = cl((u - a) / (b - a)); return k * k * (3 - 2 * k); };
    for (let i = 0; i <= NK; i++) {
      const u = i / NK;
      // kusut: coretan kacau
      let x = cx + 30 + 250 * Math.sin(2 * Math.PI * (3.2 * u + 0.1)) * (0.55 + 0.45 * Math.sin(2 * Math.PI * 1.3 * u)) + 60 * Math.sin(2 * Math.PI * 7.1 * u);
      let y = cy + 235 * Math.sin(2 * Math.PI * (4.3 * u + 0.35)) * (0.6 + 0.4 * Math.cos(2 * Math.PI * 0.9 * u)) + 50 * Math.cos(2 * Math.PI * 6.3 * u);
      const ka = sm(0, 0.07, u), kb = 1 - sm(0.93, 1, u);
      x = lerp(s[0], x, ka); y = lerp(s[1], y, ka);
      x = lerp(e[0], x, kb); y = lerp(e[1], y, kb);
      A.push([x, y]);
      // rapi: gulungan spiral ganda (masuk ke pusat, keluar lagi, lalu setengah putaran pulang)
      const C0 = [cx + 40, cy], R = 225, N = 2, SP = 2 * Math.PI * N + 0.5, TA = Math.PI - 0.5;
      let th, rr;
      if (u < 0.426) { const v = u / 0.426; th = TA + SP * v; rr = R * (1 - v); }
      else if (u < 0.852) { const v = (u - 0.426) / 0.426; th = TA + SP * (1 - v) + Math.PI; rr = R * v; }
      else { const v = (u - 0.852) / 0.148; th = lerp(2 * Math.PI - 0.5, Math.PI + 0.6, v); rr = R + 55 * v; }
      let nx = C0[0] + rr * Math.cos(th), ny = C0[1] + rr * Math.sin(th);
      const ka2 = sm(0, 0.035, u), kb2 = 1 - sm(0.965, 1, u);
      nx = lerp(s[0], nx, ka2); ny = lerp(s[1], ny, ka2);
      nx = lerp(e[0], nx, kb2); ny = lerp(e[1], ny, kb2);
      B.push([nx, ny]);
    }
    return [A, B];
  }
  const dPoli = (pts) => 'M' + pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L');

  // ---------------------------------------------------------------- dunia
  let world = null, gLine = null, tipEl = null, isiGembok = null, KUSUT = null, pita = null;
  const PIECES = [], WAKTU = {}, NAR = [];
  let URAI = null, MUNDUR = null, LOGO_AT = null, siap = false, TOTAL = 0;

  function el(tag, attr, parent) { const e = document.createElementNS(NS, tag); for (const k in attr) e.setAttribute(k, attr[k]); if (parent) parent.appendChild(e); return e; }

  function bangun() {
    world = h('<div id="ol-world"></div>');
    $('#stage').insertBefore(world, $('#bg').nextSibling);
    pita = h('<div id="ol-pita"></div>');
    $('#stage').insertBefore(pita, world.nextSibling);
    const svg = el('svg', { width: WW, height: WH, viewBox: `0 0 ${WW} ${WH}`, style: 'position:absolute;left:0;top:0;overflow:visible' }, world);
    const gBlob = el('g', {}, svg);
    // isi gembok (muncul di akhir)
    const body = new Pen(XL + RC, YT).L([XR - RC, YT]).arc(XR - RC, YT + RC, RC, RC, -90, 0).L([XR, YB - RC]).arc(XR - RC, YB - RC, RC, RC, 0, 90).L([XL + RC, YB])
      .arc(XL + RC, YB - RC, RC, RC, 90, 180).L([XL, YT + RC]).arc(XL + RC, YT + RC, RC, RC, 180, 270);
    isiGembok = el('path', { d: body.d + ' Z', fill: BIRU_MUDA, opacity: 0 }, gBlob);
    gLine = el('g', { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);

    let cur = [2560, 2080];
    const add = (id, kind, draw, extra = {}) => {
      const pen = new Pen(cur[0], cur[1]);
      draw(pen);
      const path = el('path', { d: pen.d, stroke: extra.biru ? BIRU : TINTA }, gLine);
      const pc = Object.assign({ id, kind, el: path, len: path.getTotalLength(), biru: !!extra.biru }, extra);
      PIECES.push(pc);
      cur = [pen.x, pen.y];
      return pc;
    };
    const stasiun = (id) => {
      const st = ST[id], [cx, cy] = st.c;
      const blob = el('ellipse', { cx: cx + (st.lab[0] > 0 ? 20 : -20), cy: cy + 14, rx: st.kusut ? 330 : 236, ry: st.kusut ? 290 : 212, fill: st.blob, opacity: 0,
        transform: `rotate(${st.kusut ? -8 : ((cx * 7 + cy * 3) % 40) - 20} ${cx} ${cy})` }, gBlob);
      const lab = h(`<div class="ol-lab" style="left:${cx + st.lab[0]}px;top:${cy + st.lab[1]}px"><b>${esc(st.label)}</b>${st.sub ? `<small>${esc(st.sub)}</small>` : ''}</div>`);
      world.appendChild(lab);
      let lab2 = null, blob2 = null;
      if (st.label2) {
        lab2 = h(`<div class="ol-lab dua" style="left:${cx + st.lab[0]}px;top:${cy + st.lab[1]}px"><b>${esc(st.label2)}</b><small>${esc(st.sub2 || '')}</small></div>`);
        world.appendChild(lab2);
        blob2 = el('ellipse', { cx: cx + 20, cy: cy + 14, rx: 330, ry: 290, fill: st.blob2, opacity: 0, transform: `rotate(-8 ${cx} ${cy})` }, gBlob);
      }
      const view = { x: cx + st.lab[0] * 0.3, y: cy + st.lab[1] * 0.36, z: (st.z || 1) * Z_ST };
      const n = st.n || [0, 0];
      let pc;
      if (st.kusut) {
        const [A, B] = titikKusut(st);
        pc = add(id, 'stasiun', (pen) => { pen.d = dPoli(A); pen.x = st.q[0]; pen.y = st.q[1]; }, { view, st, A, B });
        KUSUT = pc;
      } else if (st.bebas) {
        pc = add(id, 'stasiun', (pen) => st.draw(pen, cx, cy), { view, st });
      } else {
        const s = [cx + st.s[0], cy + st.s[1]], e = [cx + st.e[0], cy + st.e[1]];
        pc = add(id, 'stasiun', (pen) => {
          const d1 = Math.hypot(s[0] - st.p[0], s[1] - st.p[1]) * 0.45;
          pen.C([st.p[0] + n[0] * d1, st.p[1] + n[1] * d1], [s[0] - n[0] * d1, s[1] - n[1] * d1], s);
          st.draw(pen, cx, cy);
          if (st.pulang) st.pulang(pen, cx, cy, st.q);
          else { const d2 = Math.hypot(e[0] - st.q[0], e[1] - st.q[1]) * 0.45; pen.C([e[0] - n[0] * 0.5 * d2, e[1] - n[1] * 0.5 * d2], [st.q[0] + n[0] * d2, st.q[1] + n[1] * d2], st.q); }
        }, { view, st, biru: st.biru });
      }
      Object.assign(pc, { blob, lab, lab2, blob2 });
      return pc;
    };
    const link = (id, draw, extra) => add(id, 'link', draw, extra);

    // ---- urutan garis (satu tarikan)
    add('pembuka', 'stasiun', (pen) => pen.S([[2700, 1990], [2860, 2060], [2900, 2200], [2780, 2280], [2700, 2180], [2820, 2080], [3000, 2040], [3200, 2100], [3400, 2050],
      [3520, 2180], [3420, 2330], [3200, 2400], [2900, 2460], [2600, 2520], [2440, 2700]]), { view: VIEW_PEMBUKA });
    link('ke-rina', (pen) => pen.S([[2340, 2900], [2320, 3090], [2380, 3190], [2450, 3150]]));
    stasiun('rina');
    link('ke-form', (pen) => pen.S([[2950, 3235], [3150, 3190], [3270, 3100]]));
    stasiun('form');
    link('ke-A', (pen) => pen.S([[3060, 3330], [2700, 3430], [2420, 3530]]).C([2330, 3585], [2240, YT], [LX, YT]));
    link('o1', (pen) => pen.L([XL + RC, YT]).arc(XL + RC, YT + RC, RC, RC, 270, 180).L(ST.marketing.p));
    stasiun('marketing');
    link('o2', (pen) => pen.L(ST.cs.p));
    stasiun('cs');
    link('o3', (pen) => pen.L([XL, YB - RC]).arc(XL + RC, YB - RC, RC, RC, 180, 90).L(ST.pihak3.p));
    stasiun('pihak3');
    link('o4', (pen) => pen.L(ST.cloud.p));
    stasiun('cloud');
    link('o5', (pen) => pen.L([XR - RC, YB]).arc(XR - RC, YB - RC, RC, RC, 90, 0).L(ST.surat.p));
    stasiun('surat');
    link('o6', (pen) => pen.L(ST.kusut.p));
    stasiun('kusut');
    link('o7', (pen) => pen.L([XR, YT + RC]).arc(XR - RC, YT + RC, RC, RC, 0, -90).L([RX + 60, YT]).arc(RX + 60, YT - 60, 60, 60, 90, 180).L(ST.bukti.p), { biru: true });
    stasiun('bukti');
    link('o8', (pen) => pen.L([RX, AY]).arc(ACX, AY, AR, AR, 0, -41.3), { biru: true });
    stasiun('ropa');
    link('o9', (pen) => pen.arc(ACX, AY, AR, AR, -48.7, -131.3), { biru: true });
    stasiun('dpia');
    link('o10', (pen) => pen.arc(ACX, AY, AR, AR, -138.7, -180).L(ST.dsr.p), { biru: true });
    stasiun('dsr');
    link('pulang', (pen) => pen.L([LX, YT - 60]).arc(LX + 60, YT - 60, 60, 60, 180, 90).L([RX, YT]), { biru: true });
    add('kunci', 'stasiun', (pen) => pen.S([[4010, 3690], [3960, 3880], [3620, 4040], [3300, 4110], [KX + KR * Math.cos(300 * D2R), KY + KR * Math.sin(300 * D2R)]])
      .arc(KX, KY, KR, KR, 300, 120).L([KX - 145, 5150], [KX + 145, 5150]).arc(KX, KY, KR, KR, 60, -60), { view: { x: KX, y: KY + 200, z: pick(0.7, 0.75) }, biru: true });

    tipEl = el('circle', { r: 10, fill: TINTA }, svg);
    for (const p of PIECES) { p.el.style.strokeDasharray = `${p.len} ${p.len + 40}`; p.el.style.visibility = 'hidden'; }
  }

  // ---------------------------------------------------------------- jadwal
  function jadwal() {
    const n = PIECES.length;
    for (const p of PIECES) if (WAKTU[p.id]) { p.ts = WAKTU[p.id][0]; p.te = Math.max(WAKTU[p.id][1], WAKTU[p.id][0] + 0.3); }
    let i = 0;
    while (i < n) {
      if (PIECES[i].ts != null) { i++; continue; }
      let j = i;
      while (j < n && PIECES[j].ts == null) j++;
      let t0 = i > 0 ? PIECES[i - 1].te : 0;
      const t1 = j < n ? PIECES[j].ts : TOTAL, min = 0.32 * (j - i);
      if (t1 - t0 < min) { t0 = t1 - min; if (i > 0) PIECES[i - 1].te = Math.max(PIECES[i - 1].ts + 0.3, Math.min(PIECES[i - 1].te, t0)); }
      const L = PIECES.slice(i, j).reduce((s, p) => s + p.len, 0);
      let acc = 0;
      for (let k = i; k < j; k++) { const p = PIECES[k]; p.seq = { t0, t1, L0: acc, L1: acc + p.len, L }; p.ts = t0 + ((t1 - t0) * acc) / L; acc += p.len; p.te = t0 + ((t1 - t0) * acc) / L; }
      i = j;
    }
    siap = true;
  }
  window.OL_DEBUG = () => { if (!siap) jadwal(); return PIECES.map((p) => [p.id, p.kind, +p.ts.toFixed(2), +p.te.toFixed(2), Math.round(p.len)]); };
  const halus = (k) => lerp(k, E.io3(k), 0.55);
  function maju(p, t) {
    if (p.seq) { const s = p.seq, g = halus(P(t, s.t0, s.t1)) * s.L; return cl((g - s.L0) / (s.L1 - s.L0)); }
    return t <= p.ts ? 0 : t >= p.te ? 1 : halus(P(t, p.ts, p.te));
  }
  const kUrai = (t) => (URAI ? E.io3(P(t, URAI[0], URAI[1])) : 0);
  function aktif(t) { let k = 0; for (let i = 0; i < PIECES.length; i++) if (maju(PIECES[i], t) > 0) k = i; return k; }
  function ujung(t) {
    const k = aktif(t), p = PIECES[k], g = maju(p, t);
    const pt = p.el.getPointAtLength(p.len * g);
    return [pt.x, pt.y, k, g];
  }

  // ---------------------------------------------------------------- kamera
  const PENUH = { x: 3060, y: 4000, z: pick(0.179, 0.172) };
  const JANGKAR = pick([960, 470], [540, 1090]), JANGKAR_AKHIR = pick([510, 540], [540, 660]);
  function kamera(t) {
    let k = 0;
    for (let i = 0; i < PIECES.length; i++) if (t >= PIECES[i].ts) k = i;
    const p = PIECES[k];
    let c;
    if (p.view) c = { x: p.view.x, y: p.view.y, z: p.view.z * (1 + 0.035 * P(t, p.ts, p.te + 0.6)) };
    else {
      let a = k, b = k;
      while (a > 0 && !PIECES[a].view) a--;
      while (b < PIECES.length - 1 && !PIECES[b].view) b++;
      const va = PIECES[a].view, vb = PIECES[b].view, t0 = PIECES[a + 1].ts, t1 = PIECES[b - 1].te, u = E.io3(P(t, t0, t1)), tp = ujung(t);
      const w = 0.42 * Math.sin(Math.PI * P(t, t0, t1)), dip = cl(Math.hypot(vb.x - va.x, vb.y - va.y) / 5200, 0.04, 0.26);
      c = { x: lerp(lerp(va.x, vb.x, u), tp[0], w), y: lerp(lerp(va.y, vb.y, u), tp[1], w), z: lerp(va.z * 1.035, vb.z, u) * (1 - dip * Math.sin(Math.PI * u)) };
    }
    let ax = JANGKAR[0], ay = JANGKAR[1];
    if (MUNDUR != null && t >= MUNDUR) {
      const m = E.io3(P(t, MUNDUR, MUNDUR + 2.6));
      c = { x: lerp(c.x, PENUH.x, m), y: lerp(c.y, PENUH.y, m), z: Math.exp(lerp(Math.log(c.z), Math.log(PENUH.z * (1 + 0.03 * P(t, MUNDUR + 2.6, MUNDUR + 12))), m)) };
      ax = lerp(ax, JANGKAR_AKHIR[0], m); ay = lerp(ay, JANGKAR_AKHIR[1], m);
    }
    return { x: c.x, y: c.y, z: c.z, ax, ay };
  }

  // ---------------------------------------------------------------- render dunia
  let dKusut = -1;
  function render(t) {
    if (!siap) jadwal();
    const c = kamera(t);
    world.style.transform = `translate(${c.ax.toFixed(2)}px, ${c.ay.toFixed(2)}px) scale(${c.z.toFixed(5)}) translate(${(-c.x).toFixed(2)}px, ${(-c.y).toFixed(2)}px)`;
    const px = 4.2 + 3.3 * cl((c.z - 0.2) / 0.8); // tebal garis di layar
    gLine.setAttribute('stroke-width', (px / c.z).toFixed(2));
    const kAkhir = LOGO_AT != null ? E.io3(P(t, LOGO_AT - 0.2, LOGO_AT + 0.9)) : 0;
    const kLabel = MUNDUR != null ? 1 - P(t, MUNDUR, MUNDUR + 0.7) : 1;
    const ku = kUrai(t);
    for (const p of PIECES) {
      const g = maju(p, t);
      if (g <= 0) { p.el.style.visibility = 'hidden'; } else {
        p.el.style.visibility = 'visible';
        p.el.style.strokeDashoffset = g >= 1 ? 0 : (p.len * (1 - g)).toFixed(1);
      }
      if (!p.biru) p.el.setAttribute('stroke', kAkhir > 0 ? campur(TINTA, BIRU, kAkhir) : TINTA);
      if (p.blob) {
        const kb = E.out3(P(t, p.ts + 0.1, p.ts + 0.9));
        p.blob.setAttribute('opacity', (0.9 * kb * (p.blob2 ? 1 - ku : 1) * (1 - 0.45 * kAkhir)).toFixed(3));
        if (p.blob2) p.blob2.setAttribute('opacity', (0.95 * ku * (1 - 0.45 * kAkhir)).toFixed(3));
        const kl = P(t, lerp(p.ts, p.te, 0.35), lerp(p.ts, p.te, 0.35) + 0.45) * kLabel;
        p.lab.style.opacity = (kl * (p.lab2 ? 1 - P(ku, 0, 0.5) : 1)).toFixed(3);
        p.lab.style.transform = `translate(-50%, ${((1 - E.out3(kl)) * 14).toFixed(1)}px)`;
        if (p.lab2) { p.lab2.style.opacity = (P(ku, 0.5, 1) * kLabel).toFixed(3); p.lab2.style.transform = 'translate(-50%, 0)'; }
      }
    }
    // kusut → rapi
    if (KUSUT) {
      const q = Math.round(ku * 400) / 400;
      if (q !== dKusut) {
        dKusut = q;
        KUSUT.el.setAttribute('d', q <= 0 ? dPoli(KUSUT.A) : dPoli(KUSUT.A.map((a, i) => [lerp(a[0], KUSUT.B[i][0], q), lerp(a[1], KUSUT.B[i][1], q)])));
        if (q > 0) KUSUT.el.style.strokeDasharray = 'none';
      }
      if (q <= 0) KUSUT.el.style.strokeDasharray = `${KUSUT.len} ${KUSUT.len + 40}`;
      KUSUT.el.setAttribute('stroke', campur(TINTA, BIRU, Math.max(ku, kAkhir)));
    }
    isiGembok.setAttribute('opacity', (0.85 * kAkhir).toFixed(3));
    pita.style.opacity = kLabel.toFixed(3);
    // ujung pena
    const u = ujung(t), akhir = PIECES[PIECES.length - 1];
    tipEl.setAttribute('cx', u[0].toFixed(1)); tipEl.setAttribute('cy', u[1].toFixed(1));
    tipEl.setAttribute('r', ((px * 1.45) / c.z).toFixed(2));
    tipEl.setAttribute('fill', PIECES[u[2]].biru ? BIRU : campur(TINTA, BIRU, kAkhir));
    tipEl.setAttribute('opacity', (P(t, PIECES[0].ts - 0.12, PIECES[0].ts) * (1 - P(t, akhir.te + 0.1, akhir.te + 0.5))).toFixed(3));
  }
  function campur(a, b, k) {
    const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
    return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, '0')).join('');
  }

  // ---------------------------------------------------------------- latar kertas
  KIT.style({
    fonts: ['400 60px "Instrument Serif"', 'italic 400 60px "Instrument Serif"', '600 24px "Plus Jakarta Sans"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = KERTAS; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      g.addColorStop(0, 'rgba(255,255,255,.65)'); g.addColorStop(1, 'rgba(226,214,190,.38)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  // ---------------------------------------------------------------- narasi (kata muncul saat diucapkan)
  function narasi(root, lines, sc, box, awal = 0) {
    const W = (sc.words || []).map((w) => ({ n: norm(w.w), t: sc.voStart - sc.start + w.t }));
    let cur = 0, last = 0.2;
    const cari = (word) => {
      const n = norm(word);
      for (let j = cur; n && j < W.length; j++) {
        const m = W[j].n;
        if (m === n || (n.length > 2 && m.startsWith(n)) || (m.length > 2 && n.startsWith(m))) { cur = j + 1; last = W[j].t; return last; }
      }
      last += 0.12;
      return last;
    };
    if (!box) { box = h('<div class="ol-nar"></div>'); root.appendChild(box); }
    const ws = [];
    lines.forEach((ln, li) => {
      const le = h('<div class="ln"></div>');
      box.appendChild(le);
      let aksen = false;
      for (const tok of ln.split(' ')) {
        let w = tok, buka = false, tutup = false;
        if (w.startsWith('*')) { buka = true; w = w.slice(1); }
        if (w.endsWith('*')) { tutup = true; w = w.slice(0, -1); }
        if (buka) aksen = true;
        const we = h(`<span class="w ${aksen ? 'ak' : ''}">${esc(w)}</span>`);
        le.appendChild(we); le.appendChild(document.createTextNode(' '));
        const tw = cari(w);
        ws.push({ el: we, t: li < awal ? -1 : tw });
        if (tutup) aksen = false;
      }
    });
    return (lt, d, keluar = d - 0.3) => {
      box.style.opacity = (1 - P(lt, keluar, keluar + 0.3)).toFixed(3);
      for (const w of ws) { const k = E.out3(P(lt, w.t - 0.06, w.t + 0.3)); w.el.style.opacity = k.toFixed(3); w.el.style.transform = `translateY(${((1 - k) * 16).toFixed(1)}px)`; }
    };
  }

  // ---------------------------------------------------------------- tipe scene
  KIT.registerType('ol', (root, v, sc, tm, T) => {
    if (!world) bangun();
    TOTAL = Math.max(TOTAL, sc.start + sc.dur);
    for (const [id, a, b] of v.gambar || []) WAKTU[id] = [sc.start + T(a, 0), sc.start + T(b, 1)];
    if (v.urai) URAI = [sc.start + T(v.urai[0], 1), sc.start + T(v.urai[1], 2)];
    if (v.mundur) MUNDUR = sc.start + T(v.mundur, 0.5);
    const nar = v.logoAt ? null : narasi(root, v.teks || [], sc, null, v.teksAwal || 0);
    let cta = null;
    if (v.logoAt) {
      LOGO_AT = sc.start + T(v.logoAt, 3);
      const tL = T(v.logoAt, 3), tC = T(v.ctaAt, 4.5), tU = T(v.urlAt, 6);
      const box = h(`<div class="ol-cta"><div class="logo-w"><img class="logo" src="${LOGO}" alt=""></div><div class="nx">NEXUS</div>
        <div class="tag"></div>
        <div class="btn">privasimu.com</div><div class="chips"><span>Cek kesiapan · <b>gratis</b></span><span>Schedule Demo</span></div>
        <div class="foot">support@privasimu.com · 0851 8318 2722</div></div>`);
      root.appendChild(box);
      const fade = h('<div class="ol-fade"></div>');
      root.appendChild(fade);
      const lg = $('.logo-w', box), nx = $('.nx', box), tag = $('.tag', box), btn = $('.btn', box), chips = $('.chips', box), foot = $('.foot', box);
      const kataTag = narasi(root, v.teks || [], sc, tag);
      cta = (lt, d) => {
        const kl = E.out3(P(lt, tL - 0.1, tL + 0.6));
        tf(lg, { y: (1 - kl) * 24, o: kl }); tf(nx, { o: E.out3(P(lt, tL + 0.15, tL + 0.8)) });
        kataTag(lt, d, 1e9);
        const kb = P(lt, tC, tC + 0.4);
        tf(btn, { s: 0.7 + 0.3 * E.outBack(kb), o: cl(kb * 2.5) });
        btn.style.boxShadow = `0 ${(14 + 10 * Math.exp(-Math.max(0, lt - tU) * 5) * (lt > tU ? 1 : 0)).toFixed(0)}px 40px rgba(47,107,255,.32)`;
        tf(chips, { y: (1 - E.out3(P(lt, tC + 0.3, tC + 0.8))) * 16, o: P(lt, tC + 0.3, tC + 0.7) });
        tf(foot, { o: P(lt, tC + 0.6, tC + 1.0) });
        fade.style.opacity = P(lt, d - 0.5, d - 0.03).toFixed(3);
      };
    }
    return (lt, d) => {
      render(sc.start + lt);
      if (nar) nar(lt, d);
      if (cta) cta(lt, d);
    };
  });
})();
