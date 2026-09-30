// Gaya SN02 · NEON: elemen neon = teks dengan text-shadow berlapis; "nyala" = intensitas 0–1 yang mengatur warna & glow
// lewat variabel CSS --n. Merah: nyala tersendat (hash per frame + dropout); biru: nyala mulus. Pantulan lantai =
// salinan terbalik dengan mask & blur. Semua dari waktu global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const MERAH = ['nomor siapa?', 'templat?', 'lapor ke mana?'], BIRU = ['checklist ✓', 'timeline ✓', 'templat ✓'];
  const C = { jam: 9e9, cooked: 9e9, chill: 9e9, merah: [9e9, 9e9, 9e9], biru: [9e9, 9e9, 9e9], padam: 9e9, tutup: 9e9 };
  let lapis = null, jam = null, kiri = null, kanan = null, cooked = null, chill = null, merahEl = [], biruEl = [], pantul = [];

  function neon(kelas, teks, sub) { return `<div class="ne ${kelas}"><div class="ne-t">${teks}</div>${sub ? `<div class="ne-sub">${sub}</div>` : ''}<div class="ne-r"><div class="ne-t">${teks}</div></div></div>`; }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ne-lapis');
    jam = h(neon('jam', '03:00 · INSIDEN')); lapis.appendChild(jam);
    kiri = h(`<div class="ne-sisi kiri">${neon('besar merah', 'COOKED', 'DPO A')}<div class="ne-baris">${MERAH.map((m) => `<div class="ne kecil merah"><div class="ne-t">${m}</div></div>`).join('')}</div></div>`);
    kanan = h(`<div class="ne-sisi kanan">${neon('besar biru', 'CHILL', 'DPO B')}<div class="ne-baris">${BIRU.map((m) => `<div class="ne kecil biru"><div class="ne-t">${m}</div></div>`).join('')}</div></div>`);
    lapis.appendChild(kiri); lapis.appendChild(kanan);
    cooked = kiri.querySelector('.ne.besar'); chill = kanan.querySelector('.ne.besar');
    merahEl = [...kiri.querySelectorAll('.ne.kecil')]; biruEl = [...kanan.querySelectorAll('.ne.kecil')];
  }
  const nyala = (el, n) => { el.style.setProperty('--n', n.toFixed(3)); el.style.opacity = n > 0.02 ? 1 : 0; };
  function kedip(t, t0, seed, stabil) { // intensitas neon
    if (t < t0) return 0;
    const u = t - t0;
    if (stabil) return Math.min(1, u / 0.5) * (0.97 + 0.03 * Math.sin(t * 40));
    const f = Math.floor(t * 30);
    const start = u < 0.9 ? (hash(f + seed) > 0.45 ? 1 : 0.15) : 1; // menyala tersendat di awal
    const drop = hash(f * 0.37 + seed * 3) > 0.93 ? 0.2 : 1; // dropout sesekali
    return start * drop * (0.9 + 0.1 * hash(f + seed * 7));
  }
  function gambar(t) {
    const pd = P(t, C.padam, C.padam + 0.5);
    nyala(jam, kedip(t, C.jam, 1, true) * (1 - pd * 0.6));
    nyala(cooked, kedip(t, C.cooked, 11, false) * (1 - pd));
    nyala(chill, kedip(t, C.chill, 21, true));
    merahEl.forEach((el, i) => nyala(el, kedip(t, C.merah[i], 31 + i, false) * (1 - pd)));
    biruEl.forEach((el, i) => nyala(el, kedip(t, C.biru[i], 41 + i, true)));
    // saat padam, sisi kanan bergeser ke tengah? tidak — tetap; kartu produk muncul di tengah bawah
    kiri.style.opacity = (1 - pd).toFixed(3);
    kanan.style.transform = pd > 0 ? `translateX(${(-pd * (V ? 0 : 0)).toFixed(1)}px)` : '';
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Tilt Neon"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      // dinding bata gelap + lantai basah
      cx.fillStyle = '#0B0A10'; cx.fillRect(0, 0, W, H);
      const lantai = H * 0.74;
      cx.fillStyle = '#17131C';
      const bw = 96, bh = 40;
      for (let y = 0; y < lantai; y += bh) for (let x = ((y / bh) % 2) * -48; x < W; x += bw) { cx.fillStyle = `rgba(60,44,50,${(0.5 + 0.3 * hash(x * 0.13 + y * 0.71)).toFixed(2)})`; cx.fillRect(x + 2, y + 2, bw - 4, bh - 4); }
      const g = cx.createLinearGradient(0, lantai, 0, H); g.addColorStop(0, '#0E0D14'); g.addColorStop(1, '#060509');
      cx.fillStyle = g; cx.fillRect(0, lantai, W, H - lantai);
      cx.fillStyle = 'rgba(255,255,255,.04)'; cx.fillRect(0, lantai, W, 2);
    },
  });

  KIT.registerType('ne', (root, v, sc, tm, T) => {
    ensure();
    if (v.jam != null) C.jam = sc.start + T(v.jam, 0.1);
    if (v.cooked != null) C.cooked = sc.start + T(v.cooked, 2);
    if (v.chill != null) C.chill = sc.start + T(v.chill, 3.2);
    if (v.merah) v.merah.forEach((c, i) => { C.merah[i] = sc.start + T(c, 0.5 + i * 0.8); });
    if (v.biru) v.biru.forEach((c, i) => { C.biru[i] = sc.start + T(c, 3.5 + i * 0.8); });
    if (v.padam != null) C.padam = sc.start + T(v.padam, 0.3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1000, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(720, 1250)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
