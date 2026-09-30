// Gaya TY27 · HURUF 3D: tiap huruf = tumpukan N lapisan teks (sisi) + satu lapisan muka; jumlah lapisan yang tampil naik
// dari 0 ke N (dibangun lantai demi lantai). Seluruh kota di-skew isometrik dan berputar sedikit (orbit).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const N = 34, DX = -1.6, DY = 1.6; // lapisan ekstrusi & arah
  const HURUF = ['P', 'P', '3', '3'];
  const C = { bangun: 9e9, tanggal: 9e9, kunci: 9e9, nyala: 9e9, tutup: 9e9 };
  let lapis = null, kota = null, huruf = [], tanggal = null, kunci = null, jendela = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('k3-lapis');
    kota = h(`<div class="k3-kota" style="top:${pick(700, 1215)}px"></div>`);
    lapis.appendChild(kota);
    const F = pick(360, 250), lebar = pick(300, 210), mulai = SW / 2 - (HURUF.length * lebar + 40) / 2;
    HURUF.forEach((ch, i) => {
      const x = mulai + i * lebar + (i >= 2 ? 40 : 0);
      const el = h(`<div class="k3-huruf" style="left:${x}px;font-size:${F}px"></div>`);
      const sisi = [];
      for (let k = N; k >= 1; k--) { const s = h(`<span class="sisi" style="transform:translate(${(DX * k).toFixed(1)}px,${(DY * k).toFixed(1)}px)">${ch}</span>`); el.appendChild(s); sisi.push(s); }
      const muka = h(`<span class="muka">${ch}</span>`); el.appendChild(muka);
      // jendela: kotak kecil kuning di muka huruf
      const jw = [];
      for (let j = 0; j < 6; j++) { const w = h(`<i class="jendela" style="left:${(30 + hash(i * 9 + j) * 55).toFixed(0)}%;top:${(18 + j * 12 + hash(j * 3 + i) * 6).toFixed(0)}%"></i>`); muka.appendChild(w); jw.push(w); }
      jendela.push(...jw);
      kota.appendChild(el);
      huruf.push({ el, sisi: sisi.reverse(), muka, d: i * 0.35 });
    });
    tanggal = h('<div class="k3-tanggal">16 · 01 · 2027</div>');
    kunci = h('<div class="k3-kunci">🔑<b>?</b></div>');
    lapis.appendChild(tanggal); lapis.appendChild(kunci);
  }
  function gambar(t) {
    huruf.forEach((hf) => {
      const k = E.out3(P(t, C.bangun + hf.d, C.bangun + hf.d + 1.4)), m = Math.floor(k * N + 0.001);
      hf.sisi.forEach((s, j) => { s.style.opacity = j < m ? 1 : 0; });
      // muka naik mengikuti lantai tertinggi
      hf.muka.style.transform = `translate(${(DX * (N - m)).toFixed(1)}px, ${(DY * (N - m)).toFixed(1)}px)`;
      hf.muka.style.opacity = m > 0 ? 1 : 0;
      const getar = t > C.bangun + hf.d && t < C.bangun + hf.d + 1.4 ? (hash(Math.floor(t * 30) + hf.d) - 0.5) * 3 : 0;
      hf.el.style.transform = `translateY(${getar.toFixed(1)}px)`;
    });
    kota.style.transform = `skewY(${(-6 + Math.sin(t * 0.35) * 1.5).toFixed(2)}deg) rotate(${(Math.sin(t * 0.25) * 1.2).toFixed(2)}deg)`;
    const kt = E.outBack(P(t, C.tanggal, C.tanggal + 0.5));
    tf(tanggal, { y: (1 - cl(kt)) * 80, s: 0.8 + 0.2 * kt, o: cl(kt * 3) });
    tanggal.style.left = SW / 2 + 'px'; tanggal.style.top = pick(900, 1420) + 'px';
    const kk = P(t, C.kunci, C.kunci + 0.6);
    tf(kunci, { s: kk > 0 ? E.outBack(kk) : 0, r: Math.sin(t * 3) * 10, o: cl(kk * 3) * (1 - P(t, C.nyala, C.nyala + 0.3)) });
    kunci.style.left = SW / 2 + 'px'; kunci.style.top = pick(430, 720) + 'px';
    jendela.forEach((w, i) => { w.style.opacity = t >= C.nyala + i * 0.05 ? 0.95 : 0; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 100px "Archivo Black"', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#DCE8F7'); g.addColorStop(0.62, '#EEF3FA'); g.addColorStop(0.621, '#C9D6EA'); g.addColorStop(1, '#AEBFDA');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      // kisi tanah isometrik
      cx.strokeStyle = 'rgba(11,27,77,.12)'; cx.lineWidth = 2;
      const y0 = H * 0.62;
      cx.beginPath();
      for (let i = -20; i < 40; i++) { cx.moveTo(i * 120 - 600, y0); cx.lineTo(i * 120 + 600, H + 200); cx.moveTo(i * 120 + 600, y0); cx.lineTo(i * 120 - 600, H + 200); }
      cx.stroke();
    },
  });

  KIT.registerType('k3', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['bangun', 'tanggal', 'kunci', 'nyala']) if (v[k] != null) C[k] = sc.start + T(v[k], 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="k3-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cip) {
      const cips = v.cip.map(([teks, at], i) => { const el = h(`<div class="k3-cip">${esc(teks)}</div>`); root.appendChild(el); el.style.left = pick([150, 1380, 150][i], [60, 560, 60][i]) + 'px'; el.style.top = pick([300, 300, 420][i], [300, 300, 400][i]) + 'px'; return { el, t: T(at, 2 + i) }; });
      parts.push((lt) => cips.forEach((c) => { const kc = P(lt, c.t, c.t + 0.35); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) }); }));
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
