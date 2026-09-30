// Gaya GB11 · INFOGRAFIK: dua panel di lapisan lintas scene. Panel A: sakelar YA/TIDAK (bolak-balik, dicoret) → tangga
// 5 tingkat + batang per domain (lebar & angka dari fungsi waktu). Panel B: donat rata-rata, pil rekomendasi, garis tren.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const TINGKAT = ['Awal', 'Berkembang', 'Terdefinisi', 'Terkelola', 'Optimal'];
  const DOMAIN = [['Tata kelola', 3], ['Hak subjek data', 2], ['Insiden', 4], ['Pihak ketiga', 2], ['Pelatihan', 3]];
  const REKOM = ['Hak subjek: kanal permohonan + tenggat', 'Pihak ketiga: register & telaah kontrak', 'Pelatihan: modul wajib per peran'];
  const TREN = [2.1, 2.4, 2.8, 4.0];
  const C = { sakelar: 9e9, salah: 9e9, tangga: 9e9, domain: DOMAIN.map(() => 9e9), nexus: 9e9, donat: 9e9, rekom: 9e9, tren: 9e9, tutup: 9e9 };
  let lapis = null, A = null, B = null, sakelar = null, knob = null, silang = null, tangga = null, anak = [], bars = [], donatArc = null, donatNo = null, rekomEl = [], trenPath = null, trenDot = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ig-lapis');
    A = h(`<div class="ig-panel A">
      <div class="ig-sakelar"><div class="ig-tanya">PATUH?</div><div class="ig-pill"><span class="ya">YA</span><span class="tidak">TIDAK</span><i class="knob"></i></div><div class="ig-silang">✕</div></div>
      <div class="ig-tangga">${TINGKAT.map((n, i) => `<div class="ig-anak a${i}"><b>L${i + 1}</b><span>${n}</span></div>`).join('')}</div>
      <div class="ig-bars"><div class="ig-bars-judul">TINGKAT PER DOMAIN <i>*ilustrasi</i></div>${DOMAIN.map(([n]) => `<div class="ig-bar"><span class="nm">${n}</span><div class="trk"><div class="isi"></div></div><b class="no">0.0</b></div>`).join('')}</div>
    </div>`);
    B = h(`<div class="ig-panel B">
      <div class="ig-donat"><svg viewBox="0 0 200 200"><circle class="bg" cx="100" cy="100" r="82"/><circle class="target" cx="100" cy="100" r="82"/><circle class="arc" cx="100" cy="100" r="82"/></svg><div class="ig-dn"><b>0,0</b><span>rata-rata · target 4,0*</span></div></div>
      <div class="ig-rekom"><div class="ig-rk-judul">REKOMENDASI PENINGKATAN</div>${REKOM.map((r) => `<div class="ig-pil">${r}</div>`).join('')}</div>
      <div class="ig-tren"><div class="ig-tr-judul">TREN KEMATANGAN PER KUARTAL <i>*ilustrasi</i></div><svg viewBox="0 0 400 160"><line x1="20" y1="140" x2="380" y2="140"/><path class="garis" d=""/>${TREN.map((v, i) => `<circle class="dot" cx="${40 + i * 106}" cy="${140 - v * 26}" r="7"/><text x="${40 + i * 106}" y="158">Q${i + 1}</text>`).join('')}</svg></div>
    </div>`);
    lapis.appendChild(A); lapis.appendChild(B);
    sakelar = A.querySelector('.ig-sakelar'); knob = A.querySelector('.knob'); silang = A.querySelector('.ig-silang');
    tangga = A.querySelector('.ig-tangga'); anak = [...A.querySelectorAll('.ig-anak')]; bars = [...A.querySelectorAll('.ig-bar')];
    donatArc = B.querySelector('.arc'); donatNo = B.querySelector('.ig-dn b'); rekomEl = [...B.querySelectorAll('.ig-pil')];
    trenPath = B.querySelector('.garis'); trenDot = [...B.querySelectorAll('.dot')];
    trenPath.setAttribute('d', TREN.map((v, i) => `${i ? 'L' : 'M'}${40 + i * 106} ${140 - v * 26}`).join(' '));
    const Lt = trenPath.getTotalLength(); trenPath.style.strokeDasharray = `${Lt}`; trenPath.dataset.l = Lt;
    B.querySelector('.target').style.strokeDasharray = `${2 * Math.PI * 82 * 0.8} ${2 * Math.PI * 82}`;
  }
  function gambar(t) {
    // sakelar bolak-balik (2 Hz) sampai "salah", lalu bergetar & dicoret
    const u = t - C.sakelar, ada = t >= C.sakelar;
    const kt = P(t, C.tangga, C.tangga + 0.8);
    const fl = ada && t < C.salah ? (Math.floor(u * 2.2) % 2) : 1;
    const fr = ada ? E.io3(P((u * 2.2) % 1, 0, 0.35)) : 0;
    const pos = t < C.salah ? (fl ? 1 - fr : fr) : 1;
    knob.style.transform = `translateX(${(pos * (V ? 280 : 320)).toFixed(1)}px)`;
    sakelar.style.opacity = (ada ? 1 : 0) * (1 - kt);
    const getar = t >= C.salah && t < C.salah + 0.5 ? (hash(Math.floor(t * 40)) - 0.5) * 16 : 0;
    sakelar.style.transform = `translateX(${getar.toFixed(1)}px) scale(${lerp(1, 0.6, kt).toFixed(3)})`;
    sakelar.classList.toggle('salah', t >= C.salah);
    const ks = P(t, C.salah, C.salah + 0.25); silang.style.opacity = ks > 0 ? 1 : 0; silang.style.transform = `translate(-50%, -50%) scale(${lerp(2.2, 1, E.outExpo(ks)).toFixed(3)}) rotate(-8deg)`;
    // tangga
    tangga.style.opacity = kt > 0 ? 1 : 0;
    anak.forEach((el, i) => { const k = E.out3(P(t, C.tangga + i * 0.12, C.tangga + i * 0.12 + 0.4)); el.style.transform = `scaleY(${Math.max(0.001, k).toFixed(3)})`; el.style.opacity = k > 0 ? 1 : 0; });
    // batang domain
    bars.forEach((el, i) => { const t0 = C.domain[i], k = E.out3(P(t, t0, t0 + 0.7)), lv = DOMAIN[i][1]; el.style.opacity = t >= t0 - 0.05 ? 1 : 0; el.querySelector('.isi').style.width = `${(k * lv / 5 * 100).toFixed(1)}%`; el.querySelector('.no').textContent = (k * lv).toFixed(1).replace('.', ','); });
    A.querySelector('.ig-bars').style.opacity = t >= C.domain[0] - 0.3 ? 1 : 0;
    // ganti panel
    const kn = E.io3(P(t, C.nexus, C.nexus + 0.7));
    A.style.transform = `translateX(${(-kn * SW).toFixed(1)}px)`; A.style.opacity = (1 - kn).toFixed(3);
    B.style.transform = `translateX(${((1 - kn) * SW).toFixed(1)}px)`; B.style.opacity = kn > 0 ? 1 : 0;
    const kd = E.out3(P(t, C.donat, C.donat + 1.2)), avg = 2.8, circ = 2 * Math.PI * 82;
    donatArc.style.strokeDasharray = `${(circ * kd * avg / 5).toFixed(1)} ${circ}`; donatNo.textContent = (kd * avg).toFixed(1).replace('.', ',');
    rekomEl.forEach((el, i) => { const k = P(t, C.rekom + i * 0.35, C.rekom + i * 0.35 + 0.3); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translateX(${((1 - E.out3(k)) * 60).toFixed(1)}px)`; });
    const ktr = E.io3(P(t, C.tren, C.tren + 1.2)); trenPath.style.strokeDashoffset = `${(+trenPath.dataset.l * (1 - ktr)).toFixed(1)}`;
    trenDot.forEach((d, i) => { d.style.opacity = ktr >= (i + 0.5) / 4 ? 1 : 0; });
    B.querySelector('.ig-tren').style.opacity = t >= C.tren ? 1 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '700 60px "Space Grotesk"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F7F5EF'; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(20,30,60,.06)'; cx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { cx.beginPath(); cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); cx.stroke(); }
      for (let y = 0; y < H; y += 60) { cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
    },
  });

  KIT.registerType('ig', (root, v, sc, tm, T) => {
    ensure();
    if (v.sakelar != null) C.sakelar = sc.start + T(v.sakelar, 0.1);
    if (v.salah != null) C.salah = sc.start + T(v.salah, 3.5);
    if (v.tangga != null) C.tangga = sc.start + T(v.tangga, 0.8);
    if (v.domain) v.domain.forEach((c, i) => { C.domain[i] = sc.start + T(c, 3 + i * 0.6); });
    if (v.nexus != null) C.nexus = sc.start + T(v.nexus, 0.3);
    if (v.donat != null) C.donat = sc.start + T(v.donat, 1.2);
    if (v.rekom != null) C.rekom = sc.start + T(v.rekom, 3);
    if (v.tren != null) C.tren = sc.start + T(v.tren, 5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
