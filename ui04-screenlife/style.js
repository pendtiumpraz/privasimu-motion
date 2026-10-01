// Gaya UI04 · SCREENLIFE: desktop fiktif di lapisan lintas scene (bilah atas + jam), jendela chat & alat blast, kursor
// dengan lintasan io3 antar titik jangkar (posisi dihitung dari elemen tujuan), keraguan = getar kecil dari hash,
// notifikasi masuk dari kanan. Hitungan penerima berubah dengan animasi angka.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { chat: 9e9, pesan: 9e9, alat: 9e9, kursorKirim: 9e9, ragu: 9e9, notif: 9e9, filter: 9e9, kirim: 9e9, tutup: 9e9 };
  let lapis = null, chat = null, pesan = null, alat = null, kirim = null, filter = null, hitung = null, notif = null, kursor = null, jam = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sl-lapis');
    lapis.appendChild(h('<div class="sl-bar"><span>●  Obrolan Tim  ·  Blast SMS  ·  Kalender</span><span class="sl-jam">16.58</span></div>'));
    jam = lapis.querySelector('.sl-jam');
    chat = h(`<div class="sl-win chat"><div class="sl-judul"><i></i>Obrolan Tim — #marketing</div><div class="sl-body"><div class="sl-gelembung lama">Rekap penjualan minggu ini sudah masuk ya 👍</div><div class="sl-gelembung lama">siap, kak</div><div class="sl-gelembung baru"><b>Marketing</b>blast promo ke <u>semua nomor di database</u> ya! sekarang 🙏</div></div></div>`);
    alat = h(`<div class="sl-win alat"><div class="sl-judul"><i></i>Blast SMS — Kampanye Promo</div><div class="sl-body"><div class="sl-baris"><span>Penerima</span><b class="sl-hitung">12.480</b><em>nomor*</em></div><div class="sl-baris kecil"><span>Sumber</span><b>seluruh database pelanggan</b></div><div class="sl-filter"><i></i>Filter: hanya yang <b>setuju promo</b> (Consent · kanal SMS)</div><div class="sl-kirim">KIRIM</div></div></div>`);
    lapis.appendChild(chat); lapis.appendChild(alat);
    pesan = chat.querySelector('.sl-gelembung.baru'); kirim = alat.querySelector('.sl-kirim'); filter = alat.querySelector('.sl-filter'); hitung = alat.querySelector('.sl-hitung');
    notif = h(`<div class="sl-notif"><img src="${PD.LOGO}" alt=""><div><b>Privasimu Nexus · Consent</b><span><strong>4.120 nomor*</strong> belum menyetujui kanal SMS promo. Penarikan persetujuan dihormati di semua kanal.</span></div></div>`);
    lapis.appendChild(notif);
    kursor = h('<svg class="sl-kursor" viewBox="0 0 24 32"><path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 19 L20 19 Z"/></svg>'); lapis.appendChild(kursor);
  }
  function pusatEl(el, fx = 0.5, fy = 0.5) { const r = el.getBoundingClientRect(), s = lapis.getBoundingClientRect(), sc = SW / s.width; return [(r.left - s.left + r.width * fx) * sc, (r.top - s.top + r.height * fy) * sc]; }
  function gambar(t) {
    const kc = E.out3(P(t, C.chat, C.chat + 0.4)), ka = E.out3(P(t, C.alat, C.alat + 0.4));
    chat.style.opacity = kc > 0 ? 1 : 0; chat.style.transform = `scale(${lerp(0.9, 1, kc).toFixed(3)})`;
    const kp = E.outBack(Math.max(0.001, P(t, C.pesan, C.pesan + 0.4)));
    pesan.style.opacity = t >= C.pesan ? 1 : 0; pesan.style.transform = `scale(${kp.toFixed(3)})`;
    alat.style.opacity = ka > 0 ? 1 : 0; alat.style.transform = `scale(${lerp(0.9, 1, ka).toFixed(3)})`;
    // kursor: jangkar → KIRIM → filter → KIRIM
    const awal = [SW * 0.55, SH * 0.75];
    const pKirim = ka > 0 ? pusatEl(kirim, 0.5, 0.55) : awal, pFilter = ka > 0 ? pusatEl(filter, 0.06, 0.5) : awal;
    let x = awal[0], y = awal[1];
    const k1 = E.io3(P(t, C.kursorKirim, C.kursorKirim + 0.9)); x = lerp(x, pKirim[0], k1); y = lerp(y, pKirim[1], k1);
    const k2 = E.io3(P(t, C.filter - 0.6, C.filter)); x = lerp(x, pFilter[0], k2); y = lerp(y, pFilter[1], k2);
    const k3 = E.io3(P(t, C.kirim - 0.6, C.kirim)); x = lerp(x, pKirim[0], k3); y = lerp(y, pKirim[1], k3);
    const ragu = t >= C.ragu && t < C.filter - 0.6 ? 1 : 0;
    x += ragu * (hash(Math.floor(t * 18)) - 0.5) * 10; y += ragu * (hash(Math.floor(t * 18) + 7) - 0.5) * 8;
    kursor.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    kirim.classList.toggle('hover', k1 >= 1 && t < C.filter - 0.6);
    filter.classList.toggle('on', t >= C.filter);
    kirim.classList.toggle('siap', t >= C.filter + 0.6);
    kirim.classList.toggle('tekan', t >= C.kirim && t < C.kirim + 0.25);
    kirim.textContent = t >= C.kirim ? 'TERKIRIM ✓' : 'KIRIM';
    const n = Math.round(lerp(12480, 8360, E.io3(P(t, C.filter + 0.1, C.filter + 1.0))));
    hitung.textContent = n.toLocaleString('id-ID');
    hitung.classList.toggle('hijau', t >= C.filter + 0.6);
    const kn = E.outBack(Math.max(0.001, P(t, C.notif, C.notif + 0.5)));
    notif.style.opacity = t >= C.notif ? 1 : 0; notif.style.transform = `translateX(${((1 - kn) * 480).toFixed(1)}px)`;
    jam.textContent = t >= C.kirim ? '17.00' : (t >= C.filter ? '16.59' : '16.58');
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Inter', '600 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#5D7AA6'); g.addColorStop(1, '#2F4A73');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 6; i++) { cx.beginPath(); cx.arc(W * 0.15 + i * W * 0.16, H * 0.6 + Math.sin(i) * 120, 140 + i * 30, 0, Math.PI * 2); cx.fill(); }
    },
  });

  KIT.registerType('sl', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['chat', 'pesan', 'alat', 'kursorKirim', 'ragu', 'notif', 'filter', 'kirim']) if (v[k] != null) C[k] = sc.start + T(v[k], 1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(760, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(1120, (SW - el._w) / 2)}px`; el.style.top = `${pick(760, 1330)}px`;
      const t0 = T(L.at, 1.2);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
