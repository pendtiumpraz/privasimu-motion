// Gaya PF11 · PETA CUACA: SVG peta divisi (blob deterministik) + ikon cuaca per wilayah yang muncul pada cue global.
// Matahari berputar, awan melayang, petir berkedip (hash), hujan & angin bergeser — semua fungsi waktu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const WIL = V
    ? { legal: [250, 160, 'LEGAL', 'sun'], it: [720, 190, 'IT', 'cloud'], marketing: [480, 420, 'MARKETING', 'storm'], hr: [220, 680, 'HR', 'rain'], finance: [740, 720, 'FINANCE', 'sun'], cs: [520, 960, 'CS', 'wind'] }
    : { legal: [170, 170, 'LEGAL', 'sun'], it: [820, 150, 'IT', 'cloud'], marketing: [500, 300, 'MARKETING', 'storm'], hr: [200, 470, 'HR', 'rain'], finance: [830, 440, 'FINANCE', 'sun'], cs: [520, 520, 'CS', 'wind'] };
  const VB = V ? [1000, 1100] : [1000, 640];
  const SKOR = [['Legal', 85], ['IT', 61], ['Marketing', 34], ['HR', 58], ['Finance', 77], ['CS', 49]];
  const C = { peta: 9e9, cuaca: {}, strip: 9e9, ticker: 9e9, redup: 9e9, tutup: 9e9 };
  let lapis = null, svg = null, ikon = {}, bar = null, strip = null, ticker = null;

  function blob(cx, cy, r, seed) { // poligon membulat deterministik
    const n = 9, pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (0.78 + hash(seed + i * 1.7) * 0.5); pts.push([cx + Math.cos(a) * rr * 1.25, cy + Math.sin(a) * rr]); }
    let d = '';
    for (let i = 0; i < n; i++) { const p0 = pts[i], p1 = pts[(i + 1) % n], m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]; d += i === 0 ? `M${m[0]} ${m[1]}` : ''; const p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n], m2 = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2]; d += ` Q${p1[0]} ${p1[1]} ${m2[0]} ${m2[1]}`; }
    return d + ' Z';
  }
  const IK = {
    sun: `<g class="cw-sun"><g class="ray">${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="-44" x2="0" y2="-58" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="30"/></g>`,
    cloud: `<g class="cw-cloud"><path d="M-46 14 a20 20 0 0 1 4 -40 a26 26 0 0 1 50 -10 a22 22 0 0 1 36 18 a18 18 0 0 1 -4 34 z"/></g>`,
    storm: `<g class="cw-storm"><g class="cw-cloud"><path d="M-46 4 a20 20 0 0 1 4 -40 a26 26 0 0 1 50 -10 a22 22 0 0 1 36 18 a18 18 0 0 1 -4 34 z"/></g><path class="bolt" d="M4 8 l-18 30 h14 l-8 30 l26 -38 h-14 l10 -22 z"/></g>`,
    rain: `<g class="cw-rain"><g class="cw-cloud"><path d="M-46 4 a20 20 0 0 1 4 -40 a26 26 0 0 1 50 -10 a22 22 0 0 1 36 18 a18 18 0 0 1 -4 34 z"/></g><g class="drops">${[-24, 0, 24].map((x) => `<line x1="${x}" y1="14" x2="${x - 6}" y2="34"/>`).join('')}</g></g>`,
    wind: `<g class="cw-wind">${[-14, 6, 26].map((y, i) => `<path d="M-50 ${y} h${60 + i * 14} a10 10 0 1 0 -10 -12" class="w${i}"/>`).join('')}</g>`,
  };
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('cw-lapis');
    const wil = Object.entries(WIL);
    svg = h(`<svg class="cw-peta" viewBox="0 0 ${VB[0]} ${VB[1]}">
      ${wil.map(([k, [x, y, nama]], i) => `<path class="cw-wil" d="${blob(x, y, V ? 150 : 120, i * 13 + 5)}"/>`).join('')}
      ${wil.map(([k, [x, y, nama]]) => `<text class="cw-nama" x="${x}" y="${y + (V ? 92 : 78)}">${nama}</text>`).join('')}
      ${wil.map(([k, [x, y, nama, jenis]]) => `<g class="cw-ikon" data-k="${k}" transform="translate(${x} ${y - 6})">${IK[jenis]}</g>`).join('')}
    </svg>`);
    lapis.appendChild(svg);
    svg.querySelectorAll('.cw-ikon').forEach((g) => { ikon[g.dataset.k] = g; });
    bar = h(`<div class="cw-bar"><div class="cw-judul"><b>PRAKIRAAN KEPATUHAN</b><span>HARI INI · PETA DIVISI</span></div><div class="cw-ticker" data-bebas="1"><span>PERINGATAN DINI · tenggat DSR 72 jam berjalan sejak permohonan dicatat · </span></div></div>`);
    lapis.appendChild(bar); ticker = bar.querySelector('.cw-ticker');
    strip = h(`<div class="cw-strip">${SKOR.map(([n, s]) => `<div class="cw-chip"><span>${n}</span><b>${s}%</b></div>`).join('')}<i>*skor divisi ilustrasi</i></div>`);
    lapis.appendChild(strip);
  }
  function gambar(t) {
    const kp = E.out3(P(t, C.peta, C.peta + 0.6));
    svg.style.opacity = kp.toFixed(3); svg.style.transform = `scale(${lerp(1.06, 1, kp).toFixed(3)})`;
    bar.style.opacity = kp > 0 ? 1 : 0; bar.style.transform = `translateY(${((1 - kp) * 80).toFixed(1)}px)`;
    Object.entries(ikon).forEach(([k, g]) => {
      const t0 = C.cuaca[k] ?? 9e9, kk = P(t, t0, t0 + 0.35);
      g.style.opacity = kk > 0 ? 1 : 0;
      const [x, y, , jenis] = WIL[k], u = t - t0;
      let ekstra = '';
      if (jenis === 'cloud' || jenis === 'rain' || jenis === 'storm') ekstra = ` translate(${(Math.sin(u * 0.9) * 8).toFixed(1)} 0)`;
      g.setAttribute('transform', `translate(${x} ${y - 6}) scale(${lerp(0.4, 1, E.outBack(Math.max(0.001, kk))).toFixed(3)})${ekstra}`);
      if (jenis === 'sun') g.querySelector('.ray').setAttribute('transform', `rotate(${(u * 20).toFixed(1)})`);
      if (jenis === 'storm') { const b = g.querySelector('.bolt'); const nyala = u > 0 && (hash(Math.floor(t * 12)) > 0.55); b.style.opacity = nyala ? 1 : 0.15; }
      if (jenis === 'rain') g.querySelector('.drops').setAttribute('transform', `translate(0 ${((u * 40) % 16).toFixed(1)})`);
      if (jenis === 'wind') [0, 1, 2].forEach((i) => { const p = g.querySelector(`.w${i}`); const L = 200; p.style.strokeDasharray = `${L * 0.55} ${L * 0.45}`; p.style.strokeDashoffset = `${(-(u * 90 + i * 40) % L).toFixed(1)}`; });
    });
    const ks = E.out3(P(t, C.strip, C.strip + 0.5));
    strip.style.opacity = ks.toFixed(3); strip.style.transform = `translateY(${((1 - ks) * 40).toFixed(1)}px)`;
    ticker.classList.toggle('on', t >= C.ticker);
    ticker.querySelector('span').style.transform = `translateX(${(-((t - C.ticker) * 120) % 1600).toFixed(1)}px)`;
    const kr = P(t, C.redup, C.redup + 0.6);
    svg.style.filter = kr > 0 ? `brightness(${(1 - kr * 0.55).toFixed(2)}) blur(${(kr * 3).toFixed(1)}px)` : '';
    strip.style.opacity = (ks * (1 - kr)).toFixed(3);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0B2A5B'); g.addColorStop(1, '#0A1836');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(255,255,255,.06)'; cx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) { cx.beginPath(); cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); cx.stroke(); }
      for (let y = 0; y < H; y += 80) { cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
    },
  });

  KIT.registerType('cw', (root, v, sc, tm, T) => {
    ensure();
    if (v.peta != null) C.peta = sc.start + T(v.peta, 0.1);
    (v.cuaca || []).forEach(([k, c], i) => { C.cuaca[k] = sc.start + T(c, 1 + i * 1.2); });
    if (v.strip != null) C.strip = sc.start + T(v.strip, 1);
    if (v.ticker != null) C.ticker = sc.start + T(v.ticker, 3);
    if (v.redup != null) C.redup = sc.start + T(v.redup, 1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(700, 840), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(170, 700)}px`;
      const t0 = T(L.at, 1) + 0.3;
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.6)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 80).toFixed(1)}px) scale(${lerp(0.92, 1, k).toFixed(3)})`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
