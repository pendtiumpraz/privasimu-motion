// Gaya PF24 · SLIP GAJI: kertas dot-matrix (lubang tepi + garis hijau selang-seling) di lapisan lintas scene; baris
// tercetak per karakter (JEDA) dari cue global, kepala cetak mengikuti karakter terakhir; kertas bergulir naik supaya
// baris aktif tetap di zona cetak; "sobek" = lembar lama terangkat & terlepas, lembar baru menyusul.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.022;
  // [teks kiri, teks kanan, kelas, lembar]
  const BARIS = [
    ['SLIP GAJI · DPO-01', 'periode: AUDIT', 'kop', 0],
    ['Gaji pokok', '(dirahasiakan)', 'b', 0],
    ['Tunjangan sabar', 'Rp 0', 'b', 0],
    ['Lembur audit', 'TIDAK TERCATAT', 'merah', 0],
    ['Bonus "tolong isi form-nya"', 'Rp 0', 'b', 0],
    ['POTONGAN', '', 'sub', 0],
    ['Pulsa telepon ke IT', 'Rp 12.000*', 'merah', 0],
    ['Kopi 4 gelas/hari', 'Rp 48.000*', 'merah', 0],
    ['TOTAL KETENANGAN', '0', 'total', 0],
    ['BANTUAN (BUKAN TUNJANGAN)', 'PRIVASIMU NEXUS', 'kop hijau', 1],
    ['Antrean kerja', 'yang menunggu tindakan ✓', 'hijau', 1],
    ['Dasbor kepatuhan', 'lintas modul ✓', 'hijau', 1],
    ['Asisten AI Priva', 'jawab dari knowledge base ✓', 'hijau', 1],
    ['TOTAL KETENANGAN', 'NAIK ↑', 'total hijau', 1],
  ];
  const C = { cetak: BARIS.map(() => 9e9), stempel: 9e9, stempel2: 9e9, sobek: 9e9, tutup: 9e9 };
  let lapis = null, kertas = [], barisEl = [], kepala = null, stempel = null, stempel2 = null;
  const LH = pick(72, 70), ZONA = pick(560, 900); // tinggi baris; y zona cetak (posisi baris aktif)

  function lembar(i) { return h(`<div class="sg-kertas k${i}"><div class="sg-lubang kiri"></div><div class="sg-lubang kanan"></div><div class="sg-isi"></div></div>`); }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sg-lapis');
    kertas = [lembar(0), lembar(1)]; kertas.forEach((k) => lapis.appendChild(k));
    BARIS.forEach(([kiri, kanan, kelas, l]) => {
      const el = h(`<div class="sg-baris ${kelas}"><span class="ki">${[...kiri].map((c) => `<i>${esc(c)}</i>`).join('')}</span><span class="titik"></span><span class="ka">${[...kanan].map((c) => `<i>${esc(c)}</i>`).join('')}</span></div>`);
      kertas[l].querySelector('.sg-isi').appendChild(el); barisEl.push(el);
    });
    kepala = h('<div class="sg-kepala"></div>'); lapis.appendChild(kepala);
    stempel = h('<div class="sg-stempel merah">TIDAK TERCATAT</div>'); kertas[0].appendChild(stempel);
    stempel2 = h('<div class="sg-stempel hijau">DIBANTU</div>'); kertas[1].appendChild(stempel2);
  }
  function gambar(t) {
    const ks = E.io3(P(t, C.sobek, C.sobek + 0.8));
    // baris aktif (indeks terakhir yang mulai tercetak) per lembar → gulir
    let aktif = -1; C.cetak.forEach((tc, i) => { if (t >= tc) aktif = i; });
        const gulir0 = 0, gulir1 = 0; // semua baris muat di lembar, tak perlu gulir
    kertas[0].style.transform = `translate(-50%, ${(-gulir0 - ks * (SH + 600)).toFixed(1)}px) rotate(${(-ks * 8).toFixed(2)}deg)`;
    kertas[0].style.opacity = ks < 1 ? 1 : 0;
    kertas[1].style.transform = `translate(-50%, ${(lerp(SH + 100, 0, ks) - gulir1).toFixed(1)}px)`;
    kertas[1].style.opacity = t >= C.sobek ? 1 : 0;
    let kx = null, ky = null;
    barisEl.forEach((el, i) => {
      const t0 = C.cetak[i], huruf = [...el.querySelectorAll('i')];
      el.style.opacity = t >= t0 ? 1 : 0;
      let terakhir = null;
      huruf.forEach((c, j) => { const on = t >= t0 + j * JEDA; c.style.visibility = on ? 'visible' : 'hidden'; if (on) terakhir = c; });
      if (t >= t0 && t < t0 + huruf.length * JEDA + 0.25 && terakhir) { const r = terakhir.getBoundingClientRect(), s = lapis.getBoundingClientRect(); const sc = SW / s.width; kx = (r.right - s.left) * sc; ky = (r.top - s.top) * sc; }
    });
    kepala.style.opacity = kx != null ? 1 : 0; if (kx != null) kepala.style.transform = `translate(${kx.toFixed(1)}px, ${(ky - 6).toFixed(1)}px)`;
    const k1 = P(t, C.stempel, C.stempel + 0.3), k2 = P(t, C.stempel2, C.stempel2 + 0.3);
    stempel.style.opacity = k1 > 0 ? 1 : 0; stempel.style.transform = `rotate(-12deg) scale(${lerp(2, 1, E.outExpo(k1)).toFixed(3)})`;
    stempel2.style.opacity = k2 > 0 ? 1 : 0; stempel2.style.transform = `rotate(-10deg) scale(${lerp(2, 1, E.outExpo(k2)).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['600 60px "IBM Plex Mono"', '900 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5C6470'); g.addColorStop(1, '#2F343C');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      // celah printer di atas zona cetak
      cx.fillStyle = '#1B1F26'; cx.fillRect(W / 2 - (V ? 520 : 640), (V ? 900 : 560) - 150, V ? 1040 : 1280, 28);
    },
  });

  KIT.registerType('sg', (root, v, sc, tm, T) => {
    ensure();
    (v.cetak || []).forEach(([i, c], n) => { C.cetak[i] = sc.start + T(c, 0.4 + n * 1.1); });
    if (v.stempel != null) C.stempel = sc.start + T(v.stempel, 5);
    if (v.stempel2 != null) C.stempel2 = sc.start + T(v.stempel2, 5);
    if (v.sobek != null) C.sobek = sc.start + T(v.sobek, 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
