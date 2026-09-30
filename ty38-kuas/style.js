// Gaya TY38 · KALIGRAFI KUAS: kata besar dibuka oleh masker sapuan (clip-path poligon bergerigi yang maju ke kanan),
// cipratan tinta muncul di sekitar ujung sapuan; stempel merah; baris kuas kecil dibuka dengan cara sama.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { gores: 9e9, stempel: 9e9, baris: [9e9, 9e9, 9e9], tanggal: 9e9, tutup: 9e9 };
  let lapis = null, kata = null, cipr = [], stempel = null, barisEl = [], kuas = null, tanggal = null, tetes = null;

  // poligon sapuan: tepi kanan bergerigi pada kemajuan k (0..1)
  function sapuan(k, seed) {
    const x = k * 118 - 9, pts = ['-10% -20%'];
    for (let i = 0; i <= 10; i++) pts.push(`${(x + (hash(seed + i * 3.3) - 0.5) * 7).toFixed(2)}% ${(i * 12 - 10).toFixed(0)}%`);
    pts.push('-10% 120%');
    return `polygon(${pts.join(',')})`;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ku-lapis');
    kata = h(`<div class="ku-kata" style="top:${pick(280, 560)}px"><span class="isi">RAPI.</span></div>`);
    lapis.appendChild(kata);
    for (let i = 0; i < 14; i++) {
      const el = h(`<i class="ku-cipr" style="width:${(6 + hash(i) * 22).toFixed(0)}px;height:${(6 + hash(i) * 22).toFixed(0)}px"></i>`);
      lapis.appendChild(el); cipr.push({ el, d: hash(i * 7), ang: hash(i * 3) * Math.PI * 2, jar: 60 + hash(i * 11) * 240 });
    }
    stempel = h('<div class="ku-stempel">SIAP<br>PP 33</div>');
    lapis.appendChild(stempel);
    kuas = h('<div class="ku-kuas" data-bebas>🖌️</div>');
    lapis.appendChild(kuas);
    tetes = h('<i class="ku-tetes"></i>');
    lapis.appendChild(tetes);
    tanggal = h('<div class="ku-tanggal">16 · 01 · 2027</div>');
    lapis.appendChild(tanggal);
  }
  function gambar(t) {
    const kg = P(t, C.gores, C.gores + 1.1);
    const isi = $('.isi', kata);
    isi.style.clipPath = kg <= 0 ? 'inset(0 100% 0 0)' : sapuan(E.io3(kg), 1);
    kata.style.opacity = kg > 0 ? 1 : 0;
    const kb0 = E.io3(P(t, C.baris[0] - 0.5, C.baris[0] + 0.2)); // kata mengecil ke atas saat baris kecil ditulis
    kata.style.transform = `translateY(${(-kb0 * pick(130, 200)).toFixed(1)}px) scale(${lerp(1, pick(0.62, 0.72), kb0).toFixed(3)})`;
    stempel.style.marginTop = `${(pick(-120, -330) - kb0 * pick(110, 120)).toFixed(0)}px`;
    const kw = $('.isi', kata).offsetWidth || 900, kx = SW / 2 - kw / 2 + E.io3(kg) * kw, ky = pick(280, 560) + 120;
    // kuas: melayang ragu sebelum menggores, bergerak bersama ujung sapuan saat menggores
    const sebelum = t < C.gores, selesai = kg >= 1;
    tf(kuas, { x: sebelum ? SW / 2 - 200 + Math.sin(t * 1.3) * 60 : kx + 30, y: sebelum ? ky - 120 + Math.sin(t * 2.1) * 20 : ky - 80, r: sebelum ? -35 : -20, o: selesai ? 1 - P(t, C.gores + 1.1, C.gores + 1.5) : 1 });
    kuas.style.opacity = t >= C.tutup - 0.3 ? 0 : kuas.style.opacity;
    // tetes tinta sebelum menggores (di "satu kata" -> C.gores - 0.6 sampai C.gores)
    const kt = P(t, C.gores - 1.4, C.gores - 0.9);
    tf(tetes, { x: SW / 2 - 200 + Math.sin((C.gores - 1.4) * 1.3) * 60 + 30, y: ky - 100 + kt * 260, s: 0.6 + kt * 0.6, o: kt > 0 && kt < 1 ? 1 : 0 });
    cipr.forEach((c) => {
      const t0 = C.gores + 0.15 + c.d * 0.95, k = P(t, t0, t0 + 0.25);
      const ox = SW / 2 - kw / 2 + E.io3(P(t0, C.gores, C.gores + 1.1)) * kw;
      tf(c.el, { x: ox + Math.cos(c.ang) * c.jar * E.out3(k), y: ky + Math.sin(c.ang) * c.jar * 0.5 * E.out3(k), s: k > 0 ? 1 : 0, o: k > 0 ? 0.9 : 0 });
    });
    const ks = P(t, C.stempel, C.stempel + 0.22);
    tf(stempel, { s: ks > 0 ? lerp(2.2, 1, E.outExpo(ks)) : 0, r: -12, o: ks > 0 ? 1 : 0 });
    barisEl.forEach((b, i) => { const k = P(t, C.baris[i], C.baris[i] + 0.7); b.style.clipPath = k <= 0 ? 'inset(0 100% 0 0)' : sapuan(E.io3(k), 10 + i); b.style.opacity = k > 0 ? 1 : 0; });
    const ktg = E.out3(P(t, C.tanggal, C.tanggal + 0.5));
    tf(tanggal, { y: (1 - ktg) * 20, o: ktg });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 100px "Caveat Brush"', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F1E9D6'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(120,90,40,.08)';
      for (let i = 0; i < 900; i++) cx.fillRect(hash(i) * W, hash(i + 1000) * H, 1 + hash(i + 2000) * 3, 1);
    },
  });

  KIT.registerType('ku', (root, v, sc, tm, T) => {
    ensure();
    if (v.gores != null) C.gores = sc.start + T(v.gores, 0.2);
    if (v.stempel != null) C.stempel = sc.start + T(v.stempel, 1.5);
    if (v.baris) {
      const box = h(`<div class="ku-baris" style="top:${pick(590, 1010)}px"></div>`);
      lapis.appendChild(box);
      v.baris.forEach(([teks, at], i) => { const el = h(`<div>${esc(teks)}</div>`); box.appendChild(el); barisEl.push(el); C.baris[i] = sc.start + T(at, 1 + i * 1.5); });
    }
    if (v.tanggal != null) C.tanggal = sc.start + T(v.tanggal, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="ku-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
