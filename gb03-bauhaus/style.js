// Gaya GB03 · BAUHAUS: 3 bentuk utama + 9 salinan kacau di lapisan lintas scene. Tiap bentuk punya posisi per fase
// (hook / kacau / poster); posisi pada waktu t = interpolasi antar fase dengan E.io3 dari cue global. Fase kacau =
// lintasan Lissajous deterministik. Poster = kotak krem berbingkai hitam dengan tiga baris alur + judul vertikal.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const S = pick(230, 210); // ukuran bentuk utama
  const CY = pick(470, 0);
  // fase hook
  const HOOK = V ? [[540, 520], [540, 920], [540, 1320]] : [[SW * 0.25, CY], [SW * 0.5, CY], [SW * 0.75, CY]];
  // poster
  const PW = pick(1240, 940), PH = pick(820, 1360), PX = SW / 2 - PW / 2, PY = pick(120, 260);
  const KOL = V ? 0.34 : 0.28; // kolom bentuk kiri (fraksi lebar poster)
  const ROW = (i) => PY + PH * (V ? [0.2, 0.5, 0.8][i] : [0.22, 0.5, 0.78][i]);
  const POSTER = { // slot: lingkaran A, persegi A (RoPA); segitiga (DPIA); persegi B, lingkaran B (DSR)
    l1: [PX + PW * (KOL - 0.14), ROW(0)], k1: [PX + PW * (KOL + 0.14), ROW(0)],
    s: [PX + PW * KOL, ROW(1)],
    k2: [PX + PW * (KOL - 0.14), ROW(2)], l2: [PX + PW * (KOL + 0.14), ROW(2)],
  };
  const C = { masuk: [9e9, 9e9, 9e9], label: [9e9, 9e9, 9e9], kacau: 9e9, tanya: 9e9, susun: 9e9, baris: [9e9, 9e9, 9e9], judul: 9e9, tutup: 9e9 };
  let lapis = null, bentuk = [], salinan = [], label = [], poster = null, tanya = null, barisEl = [], judul = null, panah = [];

  const svgBentuk = (jenis, warna) => jenis === 'l' ? `<circle cx="50" cy="50" r="48" fill="${warna}"/>` : jenis === 'k' ? `<rect x="3" y="3" width="94" height="94" fill="${warna}"/>` : `<path d="M50 4 L97 94 H3 Z" fill="${warna}"/>`;
  function el(jenis, warna, kelas = '') { return h(`<div class="bh ${kelas}"><svg viewBox="0 0 100 100">${svgBentuk(jenis, warna)}</svg></div>`); }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('bh-lapis');
    poster = h(`<div class="bh-poster" style="left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px"><div class="bh-garis g1"></div><div class="bh-garis g2"></div><div class="bh-judul">PRIVASIMU<br>NEXUS</div><div class="bh-kaki">RoPA · DPIA · DSR</div></div>`);
    lapis.appendChild(poster);
    judul = poster.querySelector('.bh-judul');
    // bentuk utama (lingkaran, persegi, segitiga) + duplikat untuk baris DSR (persegi B, lingkaran B)
    bentuk = [el('l', '#D7262E', 'utama'), el('k', '#1F4FBF', 'utama'), el('s', '#F2B705', 'utama'), el('k', '#1F4FBF', 'utama dua'), el('l', '#D7262E', 'utama dua')];
    bentuk.forEach((b) => lapis.appendChild(b));
    salinan = Array.from({ length: 9 }, (_, i) => { const j = ['l', 'k', 's'][i % 3], w = ['#D7262E', '#1F4FBF', '#F2B705'][i % 3]; const e = el(j, w, 'salinan'); lapis.appendChild(e); return e; });
    label = ['ORANG', 'SISTEM', 'RISIKO'].map((t, i) => { const e = h(`<div class="bh-label">${t}</div>`); lapis.appendChild(e); return e; });
    tanya = h('<div class="bh-tanya">?</div>'); lapis.appendChild(tanya);
    barisEl = [['RoPA', 'mencatat orang & sistem'], ['DPIA', 'menilai risiko'], ['DSR', 'menjawab orang · 72 jam']].map(([a, b], i) => { const e = h(`<div class="bh-baris" style="left:${PX + PW * (V ? 0.58 : 0.5)}px;top:${ROW(i)}px"><b>${a}</b><span>${b}</span></div>`); lapis.appendChild(e); return e; });
    panah = [0, 2].map((i) => { const e = h(`<div class="bh-panah" style="left:${PX + PW * KOL}px;top:${ROW(i)}px"></div>`); lapis.appendChild(e); return e; });
  }
  function letak(e, x, y, rot, sk, op) { e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${rot.toFixed(1)}deg) scale(${sk.toFixed(3)})`; e.style.opacity = op.toFixed(3); }
  function kacauPos(i, t) { const u = t - C.kacau, a = 0.7 + (i % 4) * 0.23, b = 0.9 + ((i * 7) % 5) * 0.17, ph = hash(i * 1.7) * 6.28; return [SW / 2 + Math.sin(u * a + ph) * SW * 0.36, (V ? 900 : 520) + Math.cos(u * b + ph * 0.7) * (V ? 560 : 330)]; }
  function gambar(t) {
    const kk = E.io3(P(t, C.kacau, C.kacau + 0.8)), ks = E.io3(P(t, C.susun, C.susun + 0.9));
    const beat = Math.floor(t / (60 / 108 / 2));
    // bentuk utama
    const slot = ['l1', 'k1', 's', 'k2', 'l2'];
    bentuk.forEach((e, i) => {
      const dua = i >= 3, base = dua ? i - 2 : i; // dua = salinan untuk baris DSR (persegi B = base 1, lingkaran B = base 0)
      const idxHook = dua ? (i === 3 ? 1 : 0) : i;
      const pm = P(t, C.masuk[idxHook], C.masuk[idxHook] + 0.5), km = pm > 0 ? E.outBack(pm) : 0;
      const [hx, hy] = HOOK[idxHook];
      const masukX = idxHook === 0 ? hx - (1 - km) * 500 : idxHook === 1 ? hx + (1 - km) * 500 : hx, masukY = idxHook === 2 ? hy - (1 - km) * 400 : hy;
      const [cx, cy] = kacauPos(i + 3, t), [px, py] = POSTER[slot[i]];
      let x = lerp(masukX, cx, kk), y = lerp(masukY, cy, kk), rot = lerp(idxHook === 0 ? (1 - km) * -360 : idxHook === 2 ? (1 - km) * 180 : 0, (t - C.kacau) * 90 * (i % 2 ? 1 : -1), kk);
      x = lerp(x, px, ks); y = lerp(y, py, ks); rot = lerp(rot, 0, ks);
      const sk = lerp(1, V ? 0.62 : 0.6, ks) * (ks >= 1 ? 1 + 0.03 * (beat % 2) : 1);
      const op = dua ? (kk > 0 ? 1 : 0) : (pm > 0 ? 1 : 0);
      letak(e, x, y, rot, sk, op);
    });
    label.forEach((e, i) => { const [hx, hy] = HOOK[i]; const pm = P(t, C.label[i], C.label[i] + 0.3); e.style.opacity = (pm * (1 - kk)).toFixed(3); e.style.transform = `translate(${hx}px, ${hy + S * 0.78}px) translate(-50%, -50%)`; });
    salinan.forEach((e, i) => { const [cx, cy] = kacauPos(i, t); const op = kk * (1 - ks); letak(e, cx, cy, (t - C.kacau) * 120 * (i % 2 ? -1 : 1), lerp(0.4, 0.75, hash(i)) * (0.6 + 0.4 * kk), op); });
    const kt = P(t, C.tanya, C.tanya + 0.3);
    tanya.style.opacity = (kt * (1 - ks)).toFixed(3); tanya.style.transform = `translate(-50%, -50%) scale(${(lerp(2, 1, kt) * (1 + 0.06 * Math.sin(t * 9))).toFixed(3)})`;
    poster.style.opacity = ks.toFixed(3); poster.style.transform = `scale(${lerp(0.94, 1, ks).toFixed(3)})`;
    barisEl.forEach((e, i) => { const k = P(t, C.baris[i], C.baris[i] + 0.3); e.style.opacity = k.toFixed(3); e.style.transform = `translate(0, -50%) translateX(${((1 - E.out3(k)) * 40).toFixed(1)}px)`; });
    panah.forEach((e, i) => { const k = P(t, C.baris[i ? 2 : 0], C.baris[i ? 2 : 0] + 0.4); e.style.opacity = k > 0 ? 1 : 0; e.style.transform = `translate(-50%, -50%) scaleX(${E.out3(k).toFixed(3)}) ${i ? 'rotate(180deg)' : ''}`; });
    const kj = P(t, C.judul, C.judul + 0.4); judul.style.opacity = kj.toFixed(3); judul.style.transform = `translateY(${((1 - E.out3(kj)) * 30).toFixed(1)}px)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Poppins', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F2EBDD'; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(20,20,20,.08)'; cx.lineWidth = 2;
      for (let x = 0; x <= W; x += 120) { cx.beginPath(); cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); cx.stroke(); }
      for (let y = 0; y <= H; y += 120) { cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
    },
  });

  KIT.registerType('bh', (root, v, sc, tm, T) => {
    ensure();
    if (v.masuk) v.masuk.forEach((c, i) => { C.masuk[i] = sc.start + T(c, 0.4 + i * 0.4); });
    if (v.label) v.label.forEach((c, i) => { C.label[i] = sc.start + T(c, 1.5 + i * 0.8); });
    if (v.kacau != null) C.kacau = sc.start + T(v.kacau, 0.3);
    if (v.tanya != null) C.tanya = sc.start + T(v.tanya, 3);
    if (v.susun != null) C.susun = sc.start + T(v.susun, 0.3);
    if (v.baris) v.baris.forEach((c, i) => { C.baris[i] = sc.start + T(c, 1.5 + i); });
    if (v.judul != null) C.judul = sc.start + T(v.judul, 5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
