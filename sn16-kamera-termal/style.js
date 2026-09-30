// Gaya SN16 · TERMAL: medan panas resolusi rendah (ImageData) = dasar + bercak gaussian berdenyut + "denah" (meja/server
// sebagai blok hangat), dipetakan ke palet besi lalu di-upscale; kamera bergeser pelan (offset noise). Pada "kotak" medan
// dirata-rata ke grid 5×5 (kuantisasi) dan pada "dingin" bercak meredup. HUD (bidik, label, penghitung) = DOM di lapisan.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const RW = V ? 72 : 128, RH = V ? 128 : 72; // resolusi medan
  // bercak panas [x, y (fraksi), radius, amplitudo, label, sub]
  const BERCAK = V
    ? [[0.62, 0.30, 0.10, 1.0, 'Penggajian karyawan', 'HR · 4 kategori data · HIGH'], [0.30, 0.56, 0.09, 0.9, 'Kesehatan pasien digital', 'Produk · 9 kategori data · HIGH'], [0.66, 0.66, 0.08, 0.85, 'Registrasi nasabah', 'Operasional · HIGH']]
    : [[0.66, 0.42, 0.11, 1.0, 'Penggajian karyawan', 'HR · 4 kategori data · HIGH'], [0.28, 0.62, 0.10, 0.9, 'Kesehatan pasien digital', 'Produk · 9 kategori data · HIGH'], [0.50, 0.24, 0.085, 0.85, 'Registrasi nasabah', 'Operasional · HIGH']];
  const C = { nyala: 9e9, bidik: [9e9, 9e9, 9e9], hitung: 9e9, kotak: 9e9, dingin: 9e9, tutup: 9e9 };
  let lapis = null, hud = null, retikel = null, label = null, hitung = null, off = null, ctx = null, img = null, PAL = null;

  function palet() { // palet besi 256 warna
    const stops = [[0, [0, 0, 8]], [0.18, [40, 0, 90]], [0.38, [150, 0, 120]], [0.58, [230, 60, 20]], [0.78, [255, 170, 0]], [0.92, [255, 240, 120]], [1, [255, 255, 255]]];
    const out = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) { const v = i / 255; let a = stops[0], b = stops[stops.length - 1]; for (let s = 0; s < stops.length - 1; s++) if (v >= stops[s][0] && v <= stops[s + 1][0]) { a = stops[s]; b = stops[s + 1]; break; } const k = (v - a[0]) / Math.max(1e-6, b[0] - a[0]); for (let c = 0; c < 3; c++) out[i * 3 + c] = a[1][c] + (b[1][c] - a[1][c]) * k; }
    return out;
  }
  function ensure() {
    if (lapis) return;
    PAL = palet();
    off = document.createElement('canvas'); off.width = RW; off.height = RH; ctx = off.getContext('2d'); img = ctx.createImageData(RW, RH);
    lapis = PD.lapis('tm-lapis', 3);
    hud = h(`<div class="tm-hud"><div class="sudut a"></div><div class="sudut b"></div><div class="sudut c"></div><div class="sudut d"></div><div class="tm-atas"><span>THERMAL · DPIA-CAM</span><span class="tm-jam"></span></div><div class="tm-skala"><i></i><b>PANAS</b><b class="bawah">DINGIN</b></div><div class="tm-hitung"><span>HIGH <b>0</b></span><span>MED <b>0</b></span><span>LOW <b>0</b></span><em>n = 30 RoPA</em></div></div>`);
    lapis.appendChild(hud);
    retikel = h('<div class="tm-retikel"><i></i><i></i><i></i><i></i><u></u></div>'); lapis.appendChild(retikel);
    label = h('<div class="tm-label"><b></b><span></span></div>'); lapis.appendChild(label);
    hitung = hud.querySelector('.tm-hitung');
  }
  function medan(t, kuant, dingin) {
    const ox = Math.sin(t * 0.21) * 0.04, oy = Math.cos(t * 0.17) * 0.03;
    const d = img.data;
    const nilai = (fx, fy) => {
      const x = fx + ox, y = fy + oy;
      let v = 0.22 + 0.06 * Math.sin(x * 9.1 + 1.3) * Math.cos(y * 7.3 + 0.4) + 0.05 * Math.sin((x + y) * 13.7);
      // blok "denah": meja/rak hangat lembut (deterministik)
      const meja = [[0.15, 0.35, 0.16, 0.10], [0.40, 0.72, 0.18, 0.09], [0.80, 0.70, 0.12, 0.12], [0.55, 0.50, 0.10, 0.20]];
      for (const [mx, my, mw, mh] of meja) if (Math.abs(x - mx) < mw && Math.abs(y - my) < mh) v += 0.10;
      for (const [bx, by, r, amp] of BERCAK) { const dx = (fx - bx) * (V ? 0.56 : 1), dy = (fy - by) * (V ? 1 : 0.56); const dd = (dx * dx + dy * dy) / (r * r); v += amp * (1 - dingin * 0.85) * (0.78 + 0.22 * Math.sin(t * 2.4 + bx * 20)) * Math.exp(-dd * 2.2); }
      return v;
    };
    if (kuant > 0) {
      // rata-rata per sel 5×5 (kuantisasi) dicampur dengan medan halus
      const sel = []; for (let gy = 0; gy < 5; gy++) for (let gx = 0; gx < 5; gx++) { let s = 0, n = 0; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { s += nilai((gx + (i + 0.5) / 4) / 5, (gy + (j + 0.5) / 4) / 5); n++; } sel.push(s / n); }
      for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { const fx = x / RW, fy = y / RH, gx = Math.min(4, Math.floor(fx * 5)), gy = Math.min(4, Math.floor(fy * 5)); const halus = nilai(fx, fy), q = sel[gy * 5 + gx]; const tepi = (fx * 5 - gx < 0.04 || fy * 5 - gy < 0.04) ? -0.15 : 0; const v = cl(lerp(halus, q + tepi * kuant, kuant)); const p = Math.floor(v * 255) * 3, o = (y * RW + x) * 4; d[o] = PAL[p]; d[o + 1] = PAL[p + 1]; d[o + 2] = PAL[p + 2]; d[o + 3] = 255; }
    } else {
      for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { const v = cl(nilai(x / RW, y / RH)); const p = Math.floor(v * 255) * 3, o = (y * RW + x) * 4; d[o] = PAL[p]; d[o + 1] = PAL[p + 1]; d[o + 2] = PAL[p + 2]; d[o + 3] = 255; }
    }
    ctx.putImageData(img, 0, 0);
  }
  function gambar(t) {
    const nyala = P(t, C.nyala, C.nyala + 0.6);
    hud.style.opacity = nyala.toFixed(3);
    hud.querySelector('.tm-jam').textContent = `REC ${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}:${String(Math.floor((t % 1) * 25)).padStart(2, '0')}`;
    // bidik: target aktif = indeks terakhir yang cue-nya lewat; posisi io3 dari target sebelumnya
    let aktif = -1; C.bidik.forEach((tb, i) => { if (t >= tb) aktif = i; });
    if (aktif >= 0 && t < C.kotak) {
      const prev = aktif > 0 ? BERCAK[aktif - 1] : [0.5, 0.5], cur = BERCAK[aktif], k = E.io3(P(t, C.bidik[aktif], C.bidik[aktif] + 0.6));
      const x = lerp(prev[0], cur[0], k) * SW, y = lerp(prev[1], cur[1], k) * SH, kunci = k >= 1;
      retikel.style.opacity = 1; retikel.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${(kunci ? 0 : (1 - k) * 90).toFixed(1)}deg) scale(${lerp(1.6, 1, k).toFixed(3)})`;
      retikel.classList.toggle('kunci', kunci);
      label.style.opacity = kunci ? 1 : 0; label.querySelector('b').textContent = cur[4]; label.querySelector('span').textContent = cur[5];
      const kiri = x > SW * 0.6; label.style.transform = `translate(${(kiri ? x - 60 : x + 60).toFixed(1)}px, ${(y + 70).toFixed(1)}px) translate(${kiri ? '-100%' : '0'}, 0)`;
    } else { retikel.style.opacity = 0; label.style.opacity = 0; }
    const kh = E.out3(P(t, C.hitung, C.hitung + 1.2));
    const [hi, me, lo] = [9, 2, 19].map((n) => Math.round(n * kh));
    hitung.querySelectorAll('b')[0].textContent = hi; hitung.querySelectorAll('b')[1].textContent = me; hitung.querySelectorAll('b')[2].textContent = lo;
    hitung.style.opacity = t >= C.hitung ? 1 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Share Tech Mono"', '800 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      ensure();
      const nyala = P(t, C.nyala, C.nyala + 0.6), kuant = E.io3(P(t, C.kotak, C.kotak + 0.9)), dingin = E.io3(P(t, C.dingin, C.dingin + 1.2));
      cx.fillStyle = '#05030A'; cx.fillRect(0, 0, W, H);
      if (nyala <= 0) return;
      medan(t, kuant, dingin);
      cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
      cx.globalAlpha = nyala * (0.9 + 0.1 * hash(Math.floor(t * 24)));
      cx.drawImage(off, 0, 0, W, H);
      cx.globalAlpha = 1;
      // garis pindai halus
      cx.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 1);
    },
  });

  KIT.registerType('tm', (root, v, sc, tm, T) => {
    ensure();
    if (v.nyala != null) C.nyala = sc.start + T(v.nyala, 0.1);
    (v.bidik || []).forEach(([i, c]) => { C.bidik[i] = sc.start + T(c, 1 + i); });
    if (v.hitung != null) C.hitung = sc.start + T(v.hitung, 4);
    if (v.kotak != null) C.kotak = sc.start + T(v.kotak, 1);
    if (v.dingin != null) C.dingin = sc.start + T(v.dingin, 5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(820, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(230, 560)}px`;
      const t0 = T(L.at, 2);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.6)); el.style.opacity = k.toFixed(3); el.style.transform = `scale(${lerp(0.85, 1, k).toFixed(3)})`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
