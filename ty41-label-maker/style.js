// Gaya TY41 · LABEL MAKER: meja + benda + alat label di lapisan lintas scene. Tiap label punya waktu cetak: keluar dari
// alat (scaleX), terbang melengkung ke bendanya, menempel miring dengan hentakan. Pemindaian mengganti label kacau
// dengan tanda rapi (umum/spesifik).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BENDA = [
    ['📁', 'Map', 'umum'], ['💻', 'Laptop', 'spesifik'], ['📊', 'Spreadsheet', 'umum'], ['🗄️', 'Arsip', 'spesifik'], ['✉️', 'Email', 'umum'],
    ['📹', 'CCTV', 'spesifik'], ['📝', 'Formulir', 'umum'], ['💬', 'Chat', 'umum'], ['☕', 'Kopi', null], ['🪴', 'Tanaman', null],
  ];
  const POS = V
    ? [[220, 400], [540, 400], [860, 400], [220, 660], [540, 660], [860, 660], [220, 920], [540, 920], [860, 920], [540, 1170]]
    : [[300, 300], [620, 280], [940, 300], [1260, 280], [1580, 300], [460, 580], [780, 580], [1100, 580], [1420, 580], [1720, 580]];
  const ALAT = V ? [150, 1560] : [190, 930];
  const C = { label: BENDA.map(() => 9e9), pindai: 9e9, umum: 9e9, spesifik: 9e9, ropa: 9e9, tutup: 9e9 };
  let lapis = null, benda = [], label = [], tanda = [], alat = null, sinar = null, ropa = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lm-lapis');
    BENDA.forEach(([e, nm, jenis], i) => {
      const [x, y] = POS[i];
      const el = h(`<div class="lm-benda" style="left:${x}px;top:${y}px"><span class="e">${e}</span><span class="nm">${nm}</span></div>`);
      lapis.appendChild(el); benda.push(el);
      const lb = h(`<div class="lm-label">DATA PRIBADI${jenis ? '' : '?'}</div>`);
      lapis.appendChild(lb); label.push(lb);
      const td = h(`<div class="lm-tanda ${jenis || ''}" style="left:${x}px;top:${y + pick(96, 88)}px">${jenis ? jenis.toUpperCase() : ''}</div>`);
      lapis.appendChild(td); tanda.push(td);
    });
    alat = h(`<div class="lm-alat" style="left:${ALAT[0]}px;top:${ALAT[1]}px"><div class="badan"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="mulut"></div></div>`);
    lapis.appendChild(alat);
    sinar = h('<div class="lm-sinar"></div>');
    lapis.appendChild(sinar);
    ropa = h('<div class="lm-ropa">→ dikaitkan ke RoPA</div>');
    lapis.appendChild(ropa);
  }
  function gambar(t) {
    const kp = E.io3(P(t, C.pindai, C.pindai + 1.2)); // sapuan pemindai kiri → kanan
    label.forEach((lb, i) => {
      const t0 = C.label[i], [x, y] = POS[i];
      const k1 = P(t, t0, t0 + 0.3), k2 = E.io3(P(t, t0 + 0.3, t0 + 0.65)), tempel = P(t, t0 + 0.65, t0 + 0.8);
      const ax = ALAT[0] + 150, ay = ALAT[1] - 6;
      const lw = lb.offsetWidth || 260, px = lerp(ax, x - lw / 2, k2), py = lerp(ay, y - pick(26, 24), k2) - Math.sin(Math.PI * k2) * 220;
      const rot = lerp(0, (hash(i * 7.3) - 0.5) * 34, k2);
      const punch = Math.sin(Math.PI * tempel) * 0.25;
      // lenyap saat sinar pemindai melewatinya
      const lewat = kp > 0 ? cl((lerp(-100, SW + 100, kp) - x) / 120) : 0;
      tf(lb, { x: px, y: py, r: rot, sx: (k1 >= 1 ? 1 : k1) * (1 + punch), sy: 1 + punch * 0.4, o: t >= t0 ? 1 - lewat : 0 });
      const s = benda[i], goyang = tempel > 0 && tempel < 1 ? Math.sin(tempel * Math.PI * 3) * 6 : 0;
      s.style.transform = `translate(-50%, -50%) rotate(${goyang.toFixed(1)}deg)`;
    });
    // alat: bergetar saat mencetak
    const cetak = C.label.some((t0) => t > t0 && t < t0 + 0.3);
    alat.style.transform = `translate(${cetak ? (hash(Math.floor(t * 40)) - 0.5) * 6 : 0}px, ${cetak ? (hash(Math.floor(t * 40) + 3) - 0.5) * 4 : 0}px)`;
    sinar.style.transform = `translateX(${(lerp(-140, SW + 40, kp)).toFixed(1)}px)`;
    sinar.style.opacity = kp > 0 && kp < 1 ? 1 : 0;
    tanda.forEach((td, i) => {
      const jenis = BENDA[i][2];
      if (!jenis) return;
      const t0 = (jenis === 'umum' ? C.umum : C.spesifik) + (i % 4) * 0.08, k = P(t, t0, t0 + 0.35);
      tf(td, { x: -td.offsetWidth / 2, s: k > 0 ? E.outBack(k) : 0, o: cl(k * 3) });
    });
    const kr = E.out3(P(t, C.ropa, C.ropa + 0.5));
    tf(ropa, { y: (1 - kr) * 30, o: kr });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Rubik Mono One"', '800 60px Nunito', '600 60px Nunito'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#E9DFCB'; cx.fillRect(0, 0, W, H);
      // serat meja kayu terang
      cx.strokeStyle = 'rgba(120,90,40,.08)'; cx.lineWidth = 3;
      for (let i = 0; i < 26; i++) { const y = (i / 26) * H + Math.sin(i * 3.1) * 12; cx.beginPath(); cx.moveTo(0, y); cx.bezierCurveTo(W * 0.3, y + 14, W * 0.7, y - 14, W, y); cx.stroke(); }
    },
  });

  KIT.registerType('lm', (root, v, sc, tm, T) => {
    ensure();
    for (const [i, at] of v.label || []) C.label[i] = sc.start + T(at, 1);
    for (const k of ['pindai', 'umum', 'spesifik', 'ropa']) if (v[k] != null) C[k] = sc.start + T(v[k], 1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="lm-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, v.teksAt ? { dari: T(v.teksAt, 0) - 0.05 } : {});
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
