// Gaya TY42 · RAMBU JALAN: jalan berperspektif digambar di kanvas latar (marka bergerak dari waktu); tiap rambu punya
// waktu lewat: muncul kecil di cakrawala, membesar mendekat di sisi jalan, lalu lewat di tepi layar.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const HOR = pick(430, 760); // garis cakrawala
  const RAMBU = [
    { html: '<div class="rb-bulat"><b>WAJIB<br>CATAT</b><i>RoPA</i></div>', sisi: 1 },
    { html: '<div class="rb-segitiga"><svg viewBox="0 0 200 176"><path d="M100 8 L192 168 H8 Z" fill="#FFD400" stroke="#D91E1E" stroke-width="14" stroke-linejoin="round"/></svg><b>HATI-HATI<br>DATA<br>SPESIFIK</b></div>', sisi: -1 },
    { html: '<div class="rb-persegi"><b>LAPOR<br>INSIDEN</b><i>3×24 JAM</i></div>', sisi: 1 },
  ];
  const C = { rambu: [9e9, 9e9, 9e9], papan: 9e9, modul: [9e9, 9e9, 9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, els = [], papan = null, modulEl = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('rb-lapis');
    els = RAMBU.map((r) => { const el = h(`<div class="rb-rambu" data-bebas="1">${r.html}<div class="tiang"></div></div>`); lapis.appendChild(el); return el; });
    papan = h(`<div class="rb-papan"><div class="ph">PRIVASIMU NEXUS</div>${['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden'].map((m) => `<div class="pm"><span>${m}</span><b>➜</b></div>`).join('')}<div class="pk"></div><div class="pk kn"></div></div>`);
    lapis.appendChild(papan);
    modulEl = [...papan.querySelectorAll('.pm')];
  }
  // posisi rambu di sepanjang tepi jalan: z = 0 (titik cakrawala) … 1 (parkir besar di tepi) … >1 (lewat kamera)
  const XF = pick(720, 330), YF = HOR + 0.68 * (SH - HOR), SF = pick(1.3, 1.15);
  function tempatkan(el, z, sisi, a) {
    const s = lerp(0.05, SF, z), x = SW / 2 + sisi * lerp(22, XF, z), y = lerp(HOR, YF, z);
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%) scale(${s.toFixed(3)})`;
    el.style.opacity = a.toFixed(3);
    el.style.zIndex = Math.round(Math.min(z, 1) * 10);
  }
  function gambar(t) {
    els.forEach((el, i) => {
      const t0 = C.rambu[i], tx = Math.min(i < 2 ? C.rambu[i + 1] - 0.3 : 9e9, C.papan - 0.2); // datang 1.1 dtk sebelum cue, parkir, lalu lewat
      const masuk = E.io3(P(t, t0 - 1.1, t0)), keluar = P(t, tx, tx + 0.5);
      tempatkan(el, masuk + keluar * 1.2, RAMBU[i].sisi, (t > t0 - 1.1 ? 1 : 0) * (1 - keluar));
    });
    const kp = E.out3(P(t, C.papan, C.papan + 1.4));
    const z = kp, s = lerp(0.08, 1, z);
    papan.style.transform = `translate(${(SW / 2).toFixed(1)}px, ${(HOR + lerp(0, pick(300, 430), z)).toFixed(1)}px) translate(-50%, -100%) scale(${s.toFixed(3)})`;
    papan.style.opacity = kp > 0 ? 1 : 0;
    modulEl.forEach((m, i) => { m.classList.toggle('on', t >= C.modul[i]); });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Overpass', '800 60px Overpass'],
    bg: (cx, t, id, th, W, H) => {
      // langit → aspal berperspektif, marka tengah bergerak
      const g = cx.createLinearGradient(0, 0, 0, HOR); g.addColorStop(0, '#8FC3F0'); g.addColorStop(1, '#DDEFFB');
      cx.fillStyle = g; cx.fillRect(0, 0, W, HOR);
      cx.fillStyle = '#7BAE5B'; cx.fillRect(0, HOR - 6, W, H - HOR + 6);
      const jd = W * (W > H ? 1.05 : 0.8), kiri = (x) => W / 2 - (x) / 2, kanan = (x) => W / 2 + (x) / 2;
      cx.fillStyle = '#4A4B52'; cx.beginPath(); cx.moveTo(kiri(40), HOR); cx.lineTo(kanan(40), HOR); cx.lineTo(kanan(jd), H); cx.lineTo(kiri(jd), H); cx.fill();
      cx.strokeStyle = '#F5F5F5'; cx.lineWidth = 6; cx.beginPath(); cx.moveTo(kiri(40), HOR); cx.lineTo(kiri(jd), H); cx.moveTo(kanan(40), HOR); cx.lineTo(kanan(jd), H); cx.stroke();
      // marka putus-putus (garis tengah) — posisi dari waktu
      cx.fillStyle = '#FFD400';
      const fase = (t * 0.7) % 1;
      for (let i = 0; i < 12; i++) {
        const a = Math.pow((i + fase) / 12, 2.2), b = Math.pow((i + fase + 0.45) / 12, 2.2);
        const y0 = HOR + a * (H - HOR), y1 = HOR + b * (H - HOR), w0 = 6 + a * 60, w1 = 6 + b * 60;
        cx.beginPath(); cx.moveTo(W / 2 - w0 / 2, y0); cx.lineTo(W / 2 + w0 / 2, y0); cx.lineTo(W / 2 + w1 / 2, y1); cx.lineTo(W / 2 - w1 / 2, y1); cx.fill();
      }
    },
  });

  KIT.registerType('rb', (root, v, sc, tm, T) => {
    ensure();
    for (const [i, at] of v.rambu || []) C.rambu[i] = sc.start + T(at, 1);
    if (v.papan != null) C.papan = sc.start + T(v.papan, 0.3);
    if (v.modul) v.modul.forEach((c, i) => { C.modul[i] = sc.start + T(c, 1.5 + i * 0.4); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="rb-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
