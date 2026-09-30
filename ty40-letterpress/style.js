// Gaya TY40 · LETTERPRESS: poster di lapisan lintas scene; tiap baris punya waktu cap (masuk dengan hentakan skala +
// tekstur tinta dari kanvas bintik yang dipasang sebagai mask). Baris "SIAPKAN" dicap per kata.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BARIS = [
    ['PENGUMUMAN', 'b0'], ['KEPADA SELURUH PENGENDALI DATA PRIBADI', 'b1'], ['MULAI 16 JANUARI 2027', 'b2'],
    ['“NANTI SAJA” TIDAK BERLAKU', 'b3'], ['SIAPKAN: <i>RoPA</i> · <i>DPIA</i> · <i>DSR</i> · <i>CONSENT</i> · <i>INSIDEN</i>', 'b4'], ['PROGRAM SIAP PP 33 — privasimu.com', 'b5'],
  ];
  const C = { baris: BARIS.map(() => 9e9), kata: [9e9, 9e9, 9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, poster = null, els = [], kataEl = [];

  function tinta(w, hh, seed) { // tekstur tinta tidak rata sebagai mask (data URL kanvas kecil, dibuat sekali)
    const c = document.createElement('canvas'); c.width = 160; c.height = 60; const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, 160, 60);
    g.globalCompositeOperation = 'destination-out'; // bintik = lubang alpha (mask-mode alpha bawaan)
    for (let i = 0; i < 700; i++) { const a = hash(seed + i * 1.3) * 0.75; g.fillStyle = `rgba(0,0,0,${a.toFixed(2)})`; g.fillRect(hash(seed + i * 2.1) * 160, hash(seed + i * 3.7) * 60, 1 + hash(i) * 3, 1 + hash(i + 9) * 2); }
    return c.toDataURL();
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lp-lapis');
    const W0 = pick(1180, 960);
    poster = h(`<div class="lp-poster" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(40, 400)}px"></div>`);
    lapis.appendChild(poster);
    BARIS.forEach(([t, k], i) => {
      const el = h(`<div class="lp-b ${k}">${t}</div>`);
      el.style.webkitMaskImage = `url(${tinta(0, 0, i * 17 + 3)})`; el.style.maskImage = el.style.webkitMaskImage;
      el.style.webkitMaskSize = '100% 100%'; el.style.maskSize = '100% 100%';
      poster.appendChild(el); els.push(el);
      if (i === 1 || i === 3) poster.appendChild(h('<div class="lp-garis"><i></i><span>✦</span><i></i></div>'));
    });
    kataEl = [...els[4].querySelectorAll('i')];
  }
  function gambar(t) {
    els.forEach((el, i) => {
      const t0 = C.baris[i], k = P(t, t0, t0 + 0.22);
      el.style.opacity = k > 0 ? 1 : 0;
      el.style.transform = `scale(${(k > 0 ? lerp(1.18, 1, E.outExpo(k)) : 1).toFixed(3)})`;
    });
    kataEl.forEach((el, i) => { const k = P(t, C.kata[i], C.kata[i] + 0.2); el.style.opacity = k > 0 ? 1 : 0.12; el.style.transform = `scale(${(k > 0 ? lerp(1.4, 1, E.outExpo(k)) : 1).toFixed(3)})`; });
    // poster bergetar sesaat tiap ada cap
    const cap = C.baris.concat(C.kata).some((t0) => t > t0 && t < t0 + 0.12);
    poster.style.transform = `translate(${cap ? (hash(Math.floor(t * 40)) - 0.5) * 6 : 0}px, ${cap ? (hash(Math.floor(t * 40) + 5) - 0.5) * 6 : 0}px) rotate(-0.4deg)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px Rye', '400 60px "Alfa Slab One"', '900 60px "Playfair Display"', 'italic 700 60px "Playfair Display"', '400 30px "Special Elite"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#3B3128'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.18)';
      for (let i = 0; i < 40; i++) cx.fillRect(0, (i / 40) * H + Math.sin(i) * 4, W, 2);
    },
  });

  KIT.registerType('lp', (root, v, sc, tm, T) => {
    ensure();
    for (const [i, at] of v.baris || []) C.baris[i] = sc.start + T(at, 0.5);
    if (v.kata) v.kata.forEach((c, i) => { C.kata[i] = sc.start + T(c, 1 + i * 0.6); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
