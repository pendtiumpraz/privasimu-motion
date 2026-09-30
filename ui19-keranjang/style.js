// Gaya UI19 · KERANJANG: kartu halaman keranjang di lapisan lintas scene; baris barang masuk (geser dari kanan) pada
// waktunya; baris "aneh" menyelip di antara (baris di bawahnya bergeser turun); total menghitung ulang; lencana &
// banner peringatan dari cue; "redup" meredupkan keranjang untuk kartu Fire Drill.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BARANG = [['👟', 'Sepatu lari Nimbus', 'Rp 1.290.000', 'Rp 129.000'], ['🎧', 'Headset Kabut', 'Rp 890.000', 'Rp 89.000'], ['🧴', 'Serum Pagi 30ml', 'Rp 240.000', 'Rp 24.000']];
  const C = { barang: [9e9, 9e9, 9e9], aneh: 9e9, lencana: [9e9, 9e9], peringatan: 9e9, redup: 9e9, tombol: 9e9, tutup: 9e9 };
  let lapis = null, kartu = null, baris = [], aneh = null, total = null, lencana = [], peringatan = null, tombol = null;
  const RH = pick(104, 118), ANEH_IDX = 2; // baris aneh menyelip sebelum barang ke-3

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kb-lapis');
    kartu = h(`<div class="kb-kartu"><div class="kb-atas"><div class="kb-logo">🛒 TokoKita</div><div class="kb-promo">12.12 · DISKON s.d. 90%</div></div><div class="kb-peringatan">⚠ Insiden suka datang saat semua sibuk · tenggat lapor 3×24 jam</div><div class="kb-judul">Keranjang <span>(4)</span></div><div class="kb-daftar">${BARANG.map(([ik, n, h0, h1], i) => `<div class="kb-baris b${i}"><div class="ik">${ik}</div><div class="nm"><b>${n}</b><span>Diskon 90%*</span></div><div class="hg"><s>${h0}</s><b>${h1}</b></div></div>`).join('')}<div class="kb-baris aneh"><div class="ik">🗂️</div><div class="nm"><b>Data pelanggan</b><span>1,2 juta baris* · nama, HP, alamat</span></div><div class="hg"><em>RISIKO INSIDEN</em></div></div></div><div class="kb-total"><div class="lbl">Total</div><div class="lencana"><span class="l0">trafik 10×*</span><span class="l1">tim lembur</span></div><div class="val">Rp 0</div></div><div class="kb-tombol">Latihan sekarang · Fire Drill</div><div class="kb-kaki">*toko & angka fiktif</div></div>`);
    lapis.appendChild(kartu);
    baris = [...kartu.querySelectorAll('.kb-baris:not(.aneh)')]; aneh = kartu.querySelector('.kb-baris.aneh');
    total = kartu.querySelector('.kb-total .val'); lencana = [kartu.querySelector('.l0'), kartu.querySelector('.l1')];
    peringatan = kartu.querySelector('.kb-peringatan'); tombol = kartu.querySelector('.kb-tombol');
  }
  const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  function gambar(t) {
    const ka = E.outBack(Math.max(0.001, P(t, C.aneh, C.aneh + 0.45))), adaAneh = t >= C.aneh;
    baris.forEach((el, i) => {
      const k = P(t, C.barang[i], C.barang[i] + 0.4);
      el.style.opacity = k > 0 ? 1 : 0;
      const geser = i >= ANEH_IDX && adaAneh ? RH * E.io3(P(t, C.aneh, C.aneh + 0.4)) : 0;
      el.style.transform = `translate(${((1 - E.out3(k)) * 120).toFixed(1)}px, ${(i * RH + geser).toFixed(1)}px)`;
    });
    aneh.style.opacity = adaAneh ? 1 : 0;
    aneh.style.transform = `translate(${((1 - ka) * -160).toFixed(1)}px, ${(ANEH_IDX * RH).toFixed(1)}px) scale(${lerp(1.08, 1, ka).toFixed(3)})`;
    aneh.classList.toggle('kedip', adaAneh && t < C.aneh + 1.2 && Math.floor(t * 6) % 2 === 0);
    // total: jumlah harga barang yang sudah masuk; saat baris aneh masuk, total berubah jadi "?"
    let sum = 0; [129000, 89000, 24000].forEach((v, i) => { if (t >= C.barang[i]) sum += v * E.out3(P(t, C.barang[i], C.barang[i] + 0.5)); });
    total.textContent = adaAneh ? (Math.floor(t * 4) % 2 ? rupiah(sum) + ' + ???' : rupiah(sum) + ' + risiko') : rupiah(sum);
    total.classList.toggle('merah', adaAneh);
    lencana.forEach((el, i) => { const k = P(t, C.lencana[i], C.lencana[i] + 0.3); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `scale(${lerp(1.4, 1, E.out3(k)).toFixed(3)})`; });
    const kp = P(t, C.peringatan, C.peringatan + 0.35);
    peringatan.style.maxHeight = `${(kp * 70).toFixed(1)}px`; peringatan.style.opacity = kp.toFixed(3);
    const kr = P(t, C.redup, C.redup + 0.6);
    kartu.style.filter = kr > 0 ? `brightness(${(1 - kr * 0.55).toFixed(2)}) blur(${(kr * 3).toFixed(1)}px)` : '';
    kartu.style.transform = `translate(-50%, 0) scale(${lerp(1, 0.96, kr).toFixed(3)})`;
    const kt = P(t, C.tombol, C.tombol + 0.3);
    tombol.style.opacity = kt > 0 ? 1 : 0; tombol.style.transform = `scale(${(lerp(0.8, 1, E.outBack(Math.max(0.001, kt))) * (1 + 0.03 * Math.sin(t * 8))).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Inter', '600 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#FF7A1A'); g.addColorStop(1, '#E3411B');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.08)';
      for (let i = 0; i < 14; i++) { const x = (i / 14) * W + Math.sin(t * 0.3 + i) * 30, y = ((i * 137) % H); cx.beginPath(); cx.arc(x, y, 60 + (i % 4) * 30, 0, Math.PI * 2); cx.fill(); }
    },
  });

  KIT.registerType('kb', (root, v, sc, tm, T) => {
    ensure();
    (v.barang || []).forEach((c, i) => { C.barang[i] = sc.start + T(c, 0.3 + i * 0.3); });
    if (v.aneh != null) C.aneh = sc.start + T(v.aneh, 3);
    if (v.lencana) v.lencana.forEach((c, i) => { C.lencana[i] = sc.start + T(c, 0.5 + i); });
    if (v.peringatan != null) C.peringatan = sc.start + T(v.peringatan, 3);
    if (v.redup != null) C.redup = sc.start + T(v.redup, 0.3);
    if (v.tombol != null) C.tombol = sc.start + T(v.tombol, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1000, 940), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(440, 760)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
