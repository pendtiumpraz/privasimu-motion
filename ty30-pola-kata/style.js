// Gaya TY30 · POLA KATA BERULANG: grid 12 sel di lapisan lintas scene; tiap sel punya gaya huruf sendiri (12 "definisi").
// Kamera mendekat ke sel ke-8 lalu mundur; sapuan diagonal menyeragamkan gaya semua sel.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const SEL = [
    ['PATUH', 'Archivo', '900', '#0B1B4D', '#fff'], ['patuh', 'Instrument Serif', '400', '#F4F0E6', '#0B1B4D'], ['P A T U H', 'JetBrains Mono', '700', '#1F2937', '#5BE39A'],
    ['Patuh', 'Caveat', '700', '#FFF3C4', '#7A5A00'], ['PATUH!!', 'Bebas Neue', '400', '#E5484D', '#fff'], ['patuh…', 'Abril Fatface', '400', '#6D4CFF', '#fff'],
    ['patuh (v2 FINAL)', 'Special Elite', '400', '#E6E1D6', '#2A2622'], ['patuh (nanti)', 'Permanent Marker', '400', '#FFD34E', '#0B1B4D'], ['PATUH', 'Fraunces', '900', '#0F766E', '#fff'],
    ['PATUH', 'Anton', '400', '#111', '#D6FF3A'], ['patuh?', 'Playfair Display', '700', '#FDE2E4', '#9F1239'], ['Patuh', 'Bricolage Grotesque', '800', '#2F6BFF', '#fff'],
  ];
  const COLS = pick(4, 3), ROWS = pick(3, 4), GW = pick(420, 320), GH = pick(300, 300), GAP = 18;
  const OX = (SW - (COLS * GW + (COLS - 1) * GAP)) / 2, OY = pick(60, 250);
  const ANEH = 7; // sel "patuh (nanti)"
  const C = { muncul: 9e9, denyut: 9e9, dekat: 9e9, jauh: 9e9, seragam: 9e9, layar: 9e9, tutup: 9e9 };
  let lapis = null, grid = null, sel = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('pk-lapis');
    grid = h('<div class="pk-grid"></div>');
    lapis.appendChild(grid);
    sel = SEL.map(([t, f, w, bg, ink], i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const el = h(`<div class="pk-sel" style="left:${OX + c * (GW + GAP)}px;top:${OY + r * (GH + GAP)}px;width:${GW}px;height:${GH}px;background:${bg};color:${ink}"><span style="font-family:'${f}';font-weight:${w}">${esc(t)}</span><b class="pk-ok">PATUH <i>✓</i></b></div>`);
      grid.appendChild(el);
      return { el, i, c, r, sp: $('span', el), ok: $('.pk-ok', el) };
    });
  }
  function gambar(t) {
    sel.forEach((s) => {
      const t0 = C.muncul + s.i * 0.12, k = E.outBack(P(t, t0, t0 + 0.4));
      const den = Math.sin(Math.PI * P(t, C.denyut + s.i * 0.14, C.denyut + s.i * 0.14 + 0.3));
      // penyeragaman: sapuan diagonal dari kiri atas
      const ts = C.seragam + (s.c + s.r) * 0.12, ks = E.io3(P(t, ts, ts + 0.4));
      s.el.style.transform = `scale(${(Math.max(0, k) * (1 + 0.08 * den)).toFixed(3)}) rotateY(${(ks * 180).toFixed(1)}deg)`;
      s.el.style.opacity = k > 0 ? 1 : 0;
      s.el.classList.toggle('seragam', ks > 0.5);
    });
    // kamera: mendekat ke sel aneh, lalu mundur
    const kd = E.io3(P(t, C.dekat, C.dekat + 0.9)) * (1 - E.io3(P(t, C.jauh, C.jauh + 0.8)));
    const kl = E.io3(P(t, C.layar, C.layar + 0.7)); // grid mengecil ke bawah memberi tempat untuk kartu layar
    const a = sel[ANEH], cx = OX + a.c * (GW + GAP) + GW / 2, cy = OY + a.r * (GH + GAP) + GH / 2;
    // titik fokus dunia F dan titik layar S: tanpa kamera F = S = pusat; mendekat: F = sel aneh, S = pusat; mengecil: F = S = jangkar bawah
    const jx = SW / 2, jy = pick(SH * 0.86, SH * 0.9);
    const Fx = lerp(lerp(SW / 2, cx, kd), jx, kl), Fy = lerp(lerp(SH / 2, cy, kd), jy, kl);
    const Sx = lerp(SW / 2, jx, kl), Sy = lerp(SH / 2, jy, kl), z = lerp(1, 2.4, kd) * lerp(1, pick(0.7, 0.8), kl);
    grid.style.transform = `translate(${(Sx - z * Fx).toFixed(1)}px, ${(Sy - z * Fy).toFixed(1)}px) scale(${z.toFixed(4)})`;
    grid.toggleAttribute('data-bebas', kd > 0.05);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: SEL.map(([t, f, w]) => `${w} 60px "${f}"`),
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#E9E6DF'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('pk', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['muncul', 'denyut', 'dekat', 'jauh', 'seragam', 'layar']) if (v[k] != null) C[k] = sc.start + T(v[k], 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="pk-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar != null) {
      const tL = T(v.layar, 3), W0 = pick(1100, 980);
      const kartu = PD.layar(root, 'holding-header', { w: W0, potong: pick([60, 50, 1180, 150], [60, 50, 700, 150]), judul: 'Privasimu Nexus · Holding Group Dashboard' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(40, 150) + 'px';
      parts.push((lt) => { const k = E.outBack(P(lt, tL, tL + 0.6)); tf(kartu, { s: 0.9 + 0.1 * cl(k), y: (1 - cl(k)) * 40, o: cl(k * 3) }); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
