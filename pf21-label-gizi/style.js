// Gaya PF21 · LABEL GIZI: label di lapisan lintas scene; tiap baris punya waktu muncul (cue global) dan angka % yang
// menghitung 0 → nilai; baris spesifik/persetujuan berkelas merah. Pada "nexus" label berubah hijau, kartu RoPA asli
// tampil di scene, stempel & baris persetujuan menghitung ke 100%.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  // [label, nilai(%), kelas, catatan]
  const BARIS = [
    ['Takaran saji', null, 'saji', '1 formulir pendaftaran'],
    ['Nama lengkap', 100, '', ''],
    ['Email', 100, '', ''],
    ['Nomor HP', 100, '', ''],
    ['Data kesehatan', 12, 'merah', 'SPESIFIK'],
    ['Lokasi presisi', 8, 'merah', ''],
    ['PERSETUJUAN', 0, 'merah besar', 'bukti: —'],
  ];
  const C = { label: 9e9, baris: BARIS.map(() => 9e9), kaki: 9e9, nexus: 9e9, stempel: 9e9, penuh: 9e9, bukti: 9e9, tutup: 9e9 };
  let lapis = null, label = null, rows = [], kaki = null, stempel = null, judul = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lg-lapis');
    label = h(`<div class="lg-label"><div class="lg-judul">INFORMASI NILAI DATA</div><div class="lg-sub">Per 1 formulir pendaftaran* · dibaca sebelum mengisi</div><div class="lg-garis tebal"></div><div class="lg-baris-head"><span>Kandungan data pribadi</span><span>%AKG*</span></div><div class="lg-garis"></div>${BARIS.map(([n, v, k, c], i) => `<div class="lg-baris ${k}" data-i="${i}"><div class="kiri"><b>${n}</b>${c ? `<i>${c}</i>` : ''}</div><div class="kanan">${v === null ? '' : '<em>0</em>%'}</div></div>`).join('')}<div class="lg-garis tebal"></div><div class="lg-kaki">*%AKG di sini = % dari yang benar-benar diperlukan (minimalisasi data). Angka ilustrasi.</div></div>`);
    lapis.appendChild(label);
    rows = [...label.querySelectorAll('.lg-baris')]; kaki = label.querySelector('.lg-kaki'); judul = label.querySelector('.lg-judul');
    stempel = h('<div class="lg-stempel">RISIKO TINGGI<small>→ draf DPIA otomatis</small></div>'); lapis.appendChild(stempel);
  }
  function gambar(t) {
    const kl = E.out3(P(t, C.label, C.label + 0.5));
    label.style.opacity = kl.toFixed(3); label.style.transform = `translate(-50%, 0) scale(${lerp(0.96, 1, kl).toFixed(3)})`;
    const nexus = t >= C.nexus;
    label.classList.toggle('nexus', nexus);
    judul.textContent = nexus ? 'NILAI DATA · TERCATAT DI RoPA' : 'INFORMASI NILAI DATA';
    rows.forEach((el, i) => {
      const t0 = C.baris[i], k = P(t, t0, t0 + 0.35);
      el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translateX(${((1 - E.out3(k)) * -30).toFixed(1)}px)`;
      const em = el.querySelector('em'); if (!em) return;
      let target = BARIS[i][1], kn = E.out3(P(t, t0 + 0.1, t0 + 1.0));
      if (i === 6 && t >= C.penuh) { target = 100; kn = E.out3(P(t, C.penuh, C.penuh + 1.0)); }
      em.textContent = String(Math.round(target * kn));
      if (i === 6) { const cat = el.querySelector('i'); if (cat) cat.textContent = t >= C.bukti ? 'bukti tersimpan ✓' : (t >= C.penuh ? 'bukti: sedang dicatat…' : 'bukti: —'); el.classList.toggle('hijau', t >= C.penuh); el.classList.toggle('merah', t < C.penuh); }
      if ((i === 4 || i === 5) && nexus) el.classList.add('tercatat');
    });
    kaki.classList.toggle('kedip', t >= C.kaki && t < C.kaki + 1.6 && Math.floor(t * 5) % 2 === 0);
    const ks = P(t, C.stempel, C.stempel + 0.3);
    stempel.style.opacity = ks > 0 ? 1 : 0; stempel.style.transform = `translate(-50%, -50%) rotate(-8deg) scale(${lerp(2, 1, E.outExpo(ks)).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Archivo', '700 60px Archivo', '500 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#EFE6D6'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.035)';
      for (let i = 0; i < 40; i++) cx.fillRect((i / 40) * W, 0, 2, H); // tekstur karton kemasan
    },
  });

  KIT.registerType('lg', (root, v, sc, tm, T) => {
    ensure();
    if (v.label != null) C.label = sc.start + T(v.label, 0.1);
    (v.baris || []).forEach(([i, c], n) => { C.baris[i] = sc.start + T(c, 0.8 + n * 0.9); });
    if (v.kaki != null) C.kaki = sc.start + T(v.kaki, 4);
    if (v.nexus != null) C.nexus = sc.start + T(v.nexus, 0.3);
    if (v.stempel != null) C.stempel = sc.start + T(v.stempel, 2.5);
    if (v.penuh != null) C.penuh = sc.start + T(v.penuh, 4);
    if (v.bukti != null) C.bukti = sc.start + T(v.bukti, 5.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(640, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(1220, (SW - el._w) / 2)}px`; el.style.top = `${pick(160, 1150)}px`;
      const t0 = T(L.at, 1);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
