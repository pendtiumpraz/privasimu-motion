// Gaya TY14 · PAPAN LED: teks dirasterkan sekali ke kanvas kecil (bitmap huruf), lalu tiap frame digambar sebagai kisi
// titik LED yang menyala/padam; kolom bergeser dari waktu global. Baris kedua = hitung mundur digit.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const COLS = pick(148, 84), ROWS = 11, DOT = pick(10, 10), GAPD = 2, PITCH = DOT + GAPD;
  const BW = COLS * PITCH + 40, BH = (ROWS * 2 + 3) * PITCH + 40;
  const C = { hitung: 9e9, layar: 9e9, tutup: 9e9 };
  let lapis = null, papan = null, cv = null, cx = null, bitmap = null, bmW = 0;

  // rasterkan teks ke bitmap 11 baris (1 = LED nyala)
  function raster(teks) {
    const c = document.createElement('canvas'); c.width = 4000; c.height = ROWS; const g = c.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
    g.font = '800 11px Rubik'; g.textBaseline = 'alphabetic'; g.fillStyle = '#fff';
    g.fillText(teks, 0, 9);
    const w = Math.ceil(g.measureText(teks).width) + 8, d = g.getImageData(0, 0, w, ROWS).data, out = [];
    for (let x = 0; x < w; x++) { const col = []; for (let y = 0; y < ROWS; y++) col.push(d[(y * w + x) * 4] > 110 ? 1 : 0); out.push(col); }
    return out;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('led-lapis');
    papan = h(`<div class="led-papan" style="width:${BW}px;height:${BH}px;left:${(SW - BW) / 2}px;top:${pick(150, 440)}px"><canvas width="${BW}" height="${BH}"></canvas></div>`);
    lapis.appendChild(papan);
    cv = $('canvas', papan); cx = cv.getContext('2d');
  }
  const pad2 = (n) => String(n).padStart(2, '0');
  function gambar(t, teksJalan) {
    if (!bitmap) { bitmap = raster(teksJalan); bmW = bitmap.length; }
    cx.fillStyle = '#0A0A0C'; cx.fillRect(0, 0, BW, BH);
    // titik padam
    const geser = Math.floor(t * 26); // kolom per detik
    const nyala = (x, y, warna, kuat) => {
      const px = 20 + x * PITCH + DOT / 2, py = 20 + y * PITCH + DOT / 2;
      cx.fillStyle = warna; cx.globalAlpha = kuat; cx.beginPath(); cx.arc(px, py, DOT / 2, 0, 7); cx.fill();
    };
    for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS * 2 + 3; y++) nyala(x, y, '#3A1212', 0.55);
    // baris 1: teks berjalan
    for (let x = 0; x < COLS; x++) {
      const bx = (x + geser) % bmW, col = bitmap[bx];
      for (let y = 0; y < ROWS; y++) if (col[y]) { nyala(x, y, '#FF3B2F', 1); }
    }
    // baris 2: hitung mundur (setelah C.hitung) atau teks pendukung
    const sisa = Math.max(0, 72 * 3600 - Math.floor((t - C.hitung) * 1800)); // dipercepat
    const jam = `${pad2(Math.floor(sisa / 3600))}:${pad2(Math.floor(sisa % 3600 / 60))}:${pad2(sisa % 60)}`;
    const teks2 = t >= C.hitung ? (V ? `TENGGAT ${jam}` : `TENGGAT  ${jam}  ★  72 JAM`) : '';
    if (teks2) {
      if (!gambar._b2 || gambar._b2t !== teks2) { gambar._b2 = raster(teks2); gambar._b2t = teks2; }
      const b2 = gambar._b2, off = Math.floor((COLS - b2.length) / 2);
      for (let x = 0; x < b2.length; x++) for (let y = 0; y < ROWS; y++) if (b2[x][y] && x + off >= 0 && x + off < COLS) nyala(x + off, y + ROWS + 3, '#FFC23A', 1);
    }
    cx.globalAlpha = 1;
    // pendar
    papan.style.boxShadow = `0 0 ${60 + 10 * Math.sin(t * 3)}px rgba(255,60,40,.35), 0 30px 80px rgba(0,0,0,.6)`;
    const kl = E.io3(P(t, C.layar, C.layar + 0.8));
    papan.style.transform = `translate(${(-kl * pick(560, 0)).toFixed(1)}px, ${(-kl * pick(40, 260)).toFixed(1)}px) scale(${lerp(1, pick(0.6, 0.86), kl).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 11px Rubik', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#07070A'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H * 0.3, Math.max(W, H) * 0.6);
      g.addColorStop(0, 'rgba(255,60,40,.16)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  let TEKS_JALAN = 'BUKA 24 JAM  ★  ';
  KIT.registerType('led', (root, v, sc, tm, T) => {
    ensure();
    if (v.jalan) TEKS_JALAN = v.jalan;
    if (v.hitung != null) C.hitung = sc.start + T(v.hitung, 0.5);
    if (v.layar != null) C.layar = sc.start + T(v.layar, 0.3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="led-teks ${v.layar != null ? 'kiri' : ''}">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar != null) {
      const tL = T(v.layar, 0.3), W0 = pick(640, 640);
      const kartu = PD.layar(root, 'dsr-form', { w: W0, potong: [352, 44, 560, 470], judul: 'Privasimu Nexus · Buat DSR Baru' });
      kartu.style.left = pick(1100, (SW - W0) / 2) + 'px'; kartu.style.top = pick(220, 760) + 'px';
      const cips = (v.cip || []).map(([teks, at], i) => { const el = h(`<div class="led-cip">${esc(teks)}</div>`); root.appendChild(el); el.style.left = pick([1080, 1440, 1080][i], [70, 620, 70][i]) + 'px'; el.style.top = pick([840, 840, 910][i], [1370, 1370, 1440][i]) + 'px'; return { el, t: T(at, 2 + i) }; });
      parts.push((lt) => {
        const k = E.out3(P(lt, tL + 0.3, tL + 1.0));
        tf(kartu, { y: (1 - k) * 500, o: cl(k * 3) });
        cips.forEach((c) => { const kc = P(lt, c.t, c.t + 0.35); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) }); });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt, TEKS_JALAN); parts.forEach((f) => f(lt, d)); };
  });
})();
