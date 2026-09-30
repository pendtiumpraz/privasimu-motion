// Gaya PF08 · STRUK: kertas termal yang tingginya = jumlah baris tercetak (tumbuh ke bawah dari celah printer); baris
// dicetak per karakter (JEDA); struk pertama disobek (rotasi + jatuh) pada "sobek", struk kedua keluar dari celah yang
// sama. Cap merah menghantam pada "cap". Semua dari waktu global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.02;
  // [kiri, kanan, kelas, lembar]
  const BARIS = [
    ['TOKO KEPATUHAN', 'struk tagihan UU PDP', 'kop', 0],
    ['Tanpa dasar pemrosesan', 'peringatan tertulis', 'b', 0],
    ['Insiden dilapor terlambat', 'penghentian sementara', 'b', 0],
    ['- - - - - - - - - - - - -', '', 'garis', 0],
    ['Data spesifik tanpa DPIA', 'penghapusan data', 'b', 0],
    ['Persetujuan tanpa bukti', 'denda administratif', 'b', 0],
    ['= = = = = = = = = = = = =', '', 'garis', 0],
    ['TOTAL DENDA', 'hingga 2% pendapatan tahunan', 'total', 0],
    ['UU PDP Pasal 57 · terima kasih', '', 'kaki', 0],
    ['PAPARAN SANKSI', 'terpetakan · Privasimu Nexus', 'kop hijau', 1],
    ['Tanpa dasar pemrosesan', '→ RoPA', 'peta', 1],
    ['Insiden dilapor terlambat', '→ Insiden 3×24 jam', 'peta', 1],
    ['Data spesifik tanpa DPIA', '→ DPIA otomatis', 'peta', 1],
    ['Persetujuan tanpa bukti', '→ Consent + bukti', 'peta', 1],
    ['PAPARAN', 'kelihatan sebelum ditagih ✓', 'total hijau', 1],
  ];
  const C = { cetak: BARIS.map(() => 9e9), cap: 9e9, sobek: 9e9, tutup: 9e9 };
  let lapis = null, struk = [], barisEl = [], cap = null;
  const SLOT_Y = pick(150, 250), LH = pick(58, 62);

  function lembar(i) { return h(`<div class="sb-struk s${i}"><div class="sb-isi"></div><div class="sb-barcode"></div><div class="sb-zigzag"></div></div>`); }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sb-lapis');
    struk = [lembar(0), lembar(1)]; struk.forEach((k) => lapis.appendChild(k));
    BARIS.forEach(([kiri, kanan, kelas, l]) => {
      const el = h(`<div class="sb-baris ${kelas}"><span class="ki">${[...kiri].map((c) => `<i>${esc(c)}</i>`).join('')}</span><span class="ka">${[...kanan].map((c) => `<i>${esc(c)}</i>`).join('')}</span></div>`);
      struk[l].querySelector('.sb-isi').appendChild(el); barisEl.push(el);
    });
    cap = h('<div class="sb-cap">EMOTIONAL<br>DAMAGE</div>'); struk[0].appendChild(cap);
    lapis.insertAdjacentHTML('beforeend', `<div class="sb-celah" style="top:${SLOT_Y - 26}px"></div>`);
  }
  function gambar(t) {
    const ks = E.io3(P(t, C.sobek, C.sobek + 0.8));
    let n0 = 0, n1 = 0;
    barisEl.forEach((el, i) => {
      const t0 = C.cetak[i], huruf = [...el.querySelectorAll('i')], on = t >= t0;
      el.style.display = on ? '' : 'none';
      huruf.forEach((c, j) => { c.style.visibility = t >= t0 + j * JEDA ? 'visible' : 'hidden'; });
      if (on) { if (BARIS[i][3] === 0) n0++; else n1++; }
    });
    // kertas tumbuh dari celah: tinggi mengikuti isi (otomatis), muncul saat baris pertama tercetak
    struk[0].style.opacity = n0 > 0 && ks < 1 ? 1 : 0;
    struk[0].style.transform = `translate(-50%, ${(ks * (SH + 400)).toFixed(1)}px) rotate(${(ks * 14).toFixed(2)}deg)`;
    struk[0].classList.toggle('lengkap', t >= C.cetak[8] + 1.2);
    struk[1].style.opacity = n1 > 0 ? 1 : 0;
    struk[1].style.transform = 'translate(-50%, 0)';
    struk[1].classList.toggle('lengkap', t >= C.cetak[14] + 1.2);
    const kc = P(t, C.cap, C.cap + 0.25);
    cap.style.opacity = kc > 0 ? 1 : 0; cap.style.transform = `translate(-50%, -50%) rotate(-14deg) scale(${lerp(2.2, 1, E.outExpo(kc)).toFixed(3)})`;
    lapis.style.transform = t >= C.cap && t < C.cap + 0.3 ? `translate(${((hash(Math.floor(t * 40)) - 0.5) * 12).toFixed(1)}px, ${((hash(Math.floor(t * 40) + 5) - 0.5) * 12).toFixed(1)}px)` : '';
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['600 60px "IBM Plex Mono"', '900 60px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2B2F38'); g.addColorStop(1, '#14161C');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.04)'; for (let y = 0; y < H; y += 6) cx.fillRect(0, y, W, 1);
    },
  });

  KIT.registerType('sb', (root, v, sc, tm, T) => {
    ensure();
    (v.cetak || []).forEach(([i, c], n) => { C.cetak[i] = sc.start + T(c, 0.4 + n * 1.1); });
    if (v.cap != null) C.cap = sc.start + T(v.cap, 5);
    if (v.sobek != null) C.sobek = sc.start + T(v.sobek, 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
