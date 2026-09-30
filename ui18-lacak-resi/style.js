// Gaya UI18 · LACAK RESI: dua kartu (paket → permohonan) di lapisan lintas scene. Status menyala dari cue global,
// garis linimasa terisi sampai status aktif, titik aktif berdenyut (sin), pil tenggat berubah teks per status.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const PAKET = [['Pesanan diproses', 'Hari 1 · 08:10*'], ['Dalam pengiriman', 'Hari 2 · 11:42*'], ['Tiba di depan pintu', 'Hari 2 · 15:03*']];
  const DSR = [['Diterima', 'Jam ke-0*', '72h'], ['Identitas diverifikasi', 'Jam ke-2*', '70h'], ['Ditelaah (Handler)', 'Jam ke-26*', '46h'], ['Disetujui (Approver)', 'Jam ke-47*', '25h'], ['Selesai · data dihapus', 'Jam ke-64*', '8h']];
  const C = { paket: 9e9, ganti: 9e9, status: [9e9, 9e9, 9e9, 9e9, 9e9], tenggat: 9e9, tutup: 9e9 };
  let lapis = null, kPaket = null, kDsr = null, rPaket = [], rDsr = [], garisP = null, garisD = null, pil = null, tanya = null;

  const kartu = (kelas, judul, nomor, sub, baris, pilTxt) => `<div class="lk-kartu ${kelas}"><div class="lk-atas"><div><div class="lk-judul">${judul}</div><div class="lk-no">${nomor}</div><div class="lk-sub">${sub}</div></div><div class="lk-pil">${pilTxt}</div></div><div class="lk-tl"><i class="lk-garis"></i><i class="lk-isi"></i>${baris.map(([l, w]) => `<div class="lk-row"><span class="lk-dot"></span><div><div class="lk-l">${l}</div><div class="lk-w">${w}</div></div></div>`).join('')}</div><div class="lk-kaki">*cap waktu ilustrasi</div></div>`;
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lk-lapis');
    kPaket = h(kartu('paket', 'LACAK PAKET', 'PKT-8841-2201', 'Kurir · standar', PAKET, 'Estimasi hari ini'));
    kDsr = h(kartu('dsr', 'LACAK PERMOHONAN', 'DSR-2026-017', 'Hak subjek data · Hapus data', DSR, 'Tenggat 72 jam'));
    lapis.appendChild(kPaket); lapis.appendChild(kDsr);
    rPaket = [...kPaket.querySelectorAll('.lk-row')]; rDsr = [...kDsr.querySelectorAll('.lk-row')];
    garisP = kPaket.querySelector('.lk-isi'); garisD = kDsr.querySelector('.lk-isi'); pil = kDsr.querySelector('.lk-pil');
    tanya = h('<div class="lk-tanya">?</div>'); kDsr.querySelector('.lk-tl').appendChild(tanya);
  }
  function isiGaris(rows, garis, aktif) {
    if (aktif < 0) { garis.style.height = '0px'; return; }
    const a = rows[0], b = rows[aktif];
    garis.style.top = `${a.offsetTop + 18}px`; garis.style.height = `${Math.max(0, b.offsetTop - a.offsetTop)}px`;
  }
  function gambar(t) {
    const kg = E.io3(P(t, C.ganti, C.ganti + 0.7));
    const y0 = pick(90, 230);
    kPaket.style.transform = `translate(-50%, ${(-kg * 900).toFixed(1)}px)`; kPaket.style.top = `${y0}px`;
    kPaket.style.opacity = (1 - kg).toFixed(3);
    kDsr.style.transform = `translate(-50%, ${((1 - kg) * 900).toFixed(1)}px)`; kDsr.style.top = `${y0}px`;
    kDsr.style.opacity = kg > 0 ? 1 : 0;
    // paket: 3 status cepat
    let ap = -1; rPaket.forEach((r, i) => { const on = t >= C.paket + i * 0.4; r.classList.toggle('on', on); if (on) ap = i; r.classList.toggle('aktif', on && i === ap && i < 2); });
    rPaket.forEach((r, i) => r.classList.toggle('aktif', i === ap && ap >= 0));
    isiGaris(rPaket, garisP, ap);
    // dsr
    let ad = -1; rDsr.forEach((r, i) => { const on = t >= C.status[i]; r.classList.toggle('on', on); if (on) ad = i; });
    rDsr.forEach((r, i) => r.classList.toggle('aktif', i === ad));
    isiGaris(rDsr, garisD, ad);
    const denyut = 1 + 0.18 * Math.sin(t * 6);
    [...rPaket, ...rDsr].forEach((r) => { const d = r.querySelector('.lk-dot'); d.style.transform = r.classList.contains('aktif') ? `scale(${denyut.toFixed(3)})` : ''; });
    pil.textContent = t >= C.tenggat ? (ad >= 0 ? `Tenggat 72 jam · ${DSR[ad][2]} tersisa*` : 'Tenggat 72 jam') : 'Tenggat 72 jam';
    pil.classList.toggle('nyala', t >= C.tenggat);
    tanya.style.opacity = kg > 0.5 && ad < 0 ? 1 : 0;
    kDsr.classList.toggle('selesai', ad === 4);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Inter', '600 60px "JetBrains Mono"'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#DDF3E8'); g.addColorStop(1, '#BFE3D1');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,80,50,.05)';
      for (let x = 0; x < W; x += 48) for (let y = 0; y < H; y += 48) cx.fillRect(x, y, 3, 3);
    },
  });

  KIT.registerType('lk', (root, v, sc, tm, T) => {
    ensure();
    if (v.paket != null) C.paket = sc.start + T(v.paket, 0.8);
    if (v.ganti != null) C.ganti = sc.start + T(v.ganti, 3);
    if (v.status) v.status.forEach((c, i) => { C.status[i] = sc.start + T(c, 2 + i * 0.7); });
    if (v.tenggat != null) C.tenggat = sc.start + T(v.tenggat, 1.2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="lk-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(900, 940), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(830, 1080)}px`;
      const t0 = T(L.at, 0.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
