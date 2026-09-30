// Gaya TY46 · FINE PRINT ZOOM: dunia formulir di lapisan lintas scene. Kamera = skala eksponensial tentang tanda bintang;
// tanda bintang diganti wadah bundar kecil berisi dunia kedua (log persetujuan) yang memenuhi layar di ujung zoom.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const DW = Math.max(SW, SH) * 1.5;
  const R = 0.0045;               // skala wadah tanda bintang (diameter = DW × R ≈ 13 px)
  const Z1 = pick(6, 3.6);        // zoom akhir fase 1 (catatan kaki terbaca)
  const C = { klik: 9e9, z1: 9e9, z2: 9e9, kolom: [9e9, 9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, form = null, tombol = null, centang = null, dot = null, pusat = null, kolomEl = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('fp-lapis');
    const W0 = pick(1060, 920);
    form = h(`<div class="fp-form" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(150, 420)}px">
      <div class="fp-judul">Buat akun</div>
      <div class="fp-field"><label>Nama lengkap</label><div class="in">R••• P•••••</div></div>
      <div class="fp-field"><label>Email</label><div class="in">r•••@•••••.id</div></div>
      <div class="fp-cb"><i></i><span>Saya setuju dengan syarat &amp; ketentuan<b>*</b></span></div>
      <div class="fp-btn">Setuju</div>
      <div class="fp-kaki"><b class="fp-bintang">*</b>bukti persetujuan: ada / tidak ada?</div>
    </div>`);
    lapis.appendChild(form);
    tombol = $('.fp-btn', form); centang = $('.fp-cb', form);
    // dunia kedua di dalam tanda bintang catatan kaki (posisinya diukur malas di render pertama, setelah font siap)
    dot = h(`<div class="fp-dot" style="width:${DW}px;height:${DW}px;transform:scale(${R})"></div>`);
    const LW = pick(1500, 980);
    const log = h(`<div class="fp-log" style="width:${LW}px;left:${(DW - LW) / 2}px;top:${(DW - pick(700, 900)) / 2}px">
      <div class="fp-lh">Log persetujuan · per subjek <span>*ilustrasi tampilan</span></div>
      <div class="fp-row h"><span>Subjek</span><span>Waktu</span><span>Kanal</span><span>Versi teks</span><span>Bukti</span></div>
      ${[['R••• P•••••', '12 Sep 2026 · 09.14', 'Web', 'v3.2', '✓'], ['D••• A••••', '12 Sep 2026 · 10.02', 'Aplikasi', 'v3.2', '✓'], ['S••• W•••', '11 Sep 2026 · 16.40', 'Loket', 'v3.1', '✓'], ['M•• F•••••', '11 Sep 2026 · 15.05', 'Web', 'v3.1', '✓']]
        .map((r) => `<div class="fp-row">${r.map((c, i) => `<span class="c${i}">${esc(c)}</span>`).join('')}</div>`).join('')}
    </div>`);
    dot.appendChild(log);
    form.appendChild(dot);
    kolomEl = [1, 2, 3, 4].map((i) => [...log.querySelectorAll(`.fp-row .c${i - 1}`)]);
    // kolom yang disorot: 0 subjek(siapa) 1 waktu(kapan) 2 kanal 3 versi
    kolomEl = [0, 1, 2, 3].map((i) => [...log.querySelectorAll(`.fp-row .c${i}`)]);
  }
  let tengahKaki = null;
  function ukur() {
    const b = $('.fp-bintang', form), kaki = $('.fp-kaki', form);
    pusat = { x: kaki.offsetLeft + b.offsetLeft + b.offsetWidth / 2, y: kaki.offsetTop + b.offsetTop + b.offsetHeight * 0.42 };
    tengahKaki = { x: kaki.offsetLeft + kaki.offsetWidth / 2, y: kaki.offsetTop + kaki.offsetHeight / 2 };
    dot.style.left = pusat.x - DW / 2 + 'px'; dot.style.top = pusat.y - DW / 2 + 'px';
  }
  // fase 1 membidik tengah catatan kaki, fase 2 bergeser ke tanda bintang (k2 = kemajuan fase 2)
  function kamera(S, k2) {
    if (!pusat) ukur();
    const k = cl((S - 1) / (Z1 - 1));
    const px = lerp(tengahKaki.x, pusat.x, k2) + form.offsetLeft, py = lerp(tengahKaki.y, pusat.y, k2) + form.offsetTop;
    const cx = lerp(px, SW / 2, Math.min(1, k * 1.2)), cy = lerp(py, SH / 2, Math.min(1, k * 1.2));
    lapis.style.transform = `translate(${(cx - S * px).toFixed(3)}px, ${(cy - S * py).toFixed(3)}px) scale(${S.toFixed(6)})`;
    lapis.toggleAttribute('data-bebas', S > 1.05);
    // teks formulir yang sudah raksasa disembunyikan (di luar layar), latar tetap
    form.classList.toggle('jauh', S > 60);
  }
  function gambar(t) {
    const kk = P(t, C.klik, C.klik + 0.25), tekan = Math.sin(Math.PI * kk);
    tombol.style.transform = `scale(${(1 - 0.06 * tekan).toFixed(3)})`;
    tombol.classList.toggle('on', t >= C.klik + 0.12);
    centang.classList.toggle('on', t >= C.klik + 0.05);
    const k1 = E.io3(P(t, C.z1, C.z1 + 1.6)), k2 = E.io3(P(t, C.z2, C.z2 + 1.7));
    const S = Math.exp(lerp(0, Math.log(Z1), k1) + lerp(0, Math.log(1 / (R * Z1)) , k2) * (k1 >= 1 ? 1 : 0));
    kamera(S, E.io3(cl(k2 * 1.6)));
    kolomEl.forEach((els, i) => { const on = t >= C.kolom[i]; els.forEach((e) => e.classList.toggle('sorot', on)); });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Manrope', '700 60px Manrope', '500 60px Manrope'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#E9EEF9'); g.addColorStop(1, '#D6DFF4');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('fp', (root, v, sc, tm, T) => {
    ensure();
    if (v.klik != null) C.klik = sc.start + T(v.klik, 1);
    if (v.zoom1 != null) C.z1 = sc.start + T(v.zoom1, 0.3);
    if (v.zoom2 != null) C.z2 = sc.start + T(v.zoom2, 0.3);
    if (v.kolom) v.kolom.forEach((c, i) => { C.kolom[i] = sc.start + T(c, 2 + i * 0.5); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="fp-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, v.teksAt ? { dari: T(v.teksAt, 0) - 0.05 } : {});
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = (1 - P(lt, d - 0.25, d - 0.02)); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
