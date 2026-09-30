// Gaya UI24 · URUTAN BOOT: layar POST penuh di lapisan lintas scene. Tiap baris punya waktu muncul (teks diketik cepat)
// dan waktu status ([ OK ]/[WARN]/[FAIL] berkedip 3× lalu tetap). Bilah progres = interpolasi ke target per cue.
// "panik" = overlay merah penuh bergetar (hash); "reboot" = layar dikosongkan (baris 0–5 disembunyikan) + kop baru.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  // [teks, status, kelas status, catatan]
  const BARIS = [
    ['KEPATUHAN-OS v2026.9 — POST kepatuhan', '', 'kop', ''],
    ['Memeriksa RoPA', '[ OK ]', 'ok', '12 kegiatan tercatat'],
    ['Memeriksa DPIA', '[WARN]', 'warn', 'masih draf'],
    ['Memeriksa bukti persetujuan', '[FAIL]', 'fail', 'TIDAK DITEMUKAN'],
    ['Memeriksa kebijakan retensi', '[FAIL]', 'fail', 'versi 2019*'],
    ['Memeriksa kontrak pihak ketiga', '[WARN]', 'warn', '3 belum ditelaah*'],
    ['PRIVASIMU NEXUS · GAP ASSESSMENT', '', 'kop nexus', ''],
    ['Kuesioner kepatuhan UU PDP', '[ OK ]', 'ok', 'dimuat'],
    ['Analisis bukti oleh AI per pertanyaan', '[ OK ]', 'ok', 'hasil dicache'],
    ['Rencana remediasi', '[ OK ]', 'ok', '11 rekomendasi'],
  ];
  const JEDA = 0.022;
  const C = { baris: BARIS.map(() => 9e9), status: BARIS.map(() => 9e9), progres: [], panik: 9e9, reboot: 9e9, tutup: 9e9 };
  let lapis = null, layar = null, barisEl = [], progres = null, progresTxt = null, panik = null, kursor = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('bt-lapis');
    layar = h(`<div class="bt-layar"><div class="bt-isi">${BARIS.map(([t, s, k, c]) => `<div class="bt-b ${k}"><span class="tx">${[...t].map((ch) => `<i>${ch === ' ' ? '&nbsp;' : esc(ch)}</i>`).join('')}</span>${s ? `<span class="dots"></span><span class="st ${k}">${s}</span><span class="ct">${esc(c)}</span>` : ''}</div>`).join('')}</div><div class="bt-prog"><div class="bar"><i></i></div><span class="pct">0%</span></div><div class="bt-scan"></div></div>`);
    lapis.appendChild(layar);
    barisEl = [...layar.querySelectorAll('.bt-b')];
    progres = layar.querySelector('.bt-prog .bar i'); progresTxt = layar.querySelector('.bt-prog .pct');
    kursor = h('<span class="bt-kursor">█</span>');
    panik = h('<div class="bt-panik"><div class="pk-j">PANIK KEPATUHAN</div><div class="pk-s">AUDIT MINGGU DEPAN — bukti tidak ditemukan</div><div class="pk-k">kode: 0x50505F33 · bukti_persetujuan=NULL · retensi=2019*</div><div class="pk-t">tekan tombol apa saja untuk panik lebih lanjut_</div></div>');
    lapis.appendChild(panik);
  }
  function nilaiProgres(t) {
    let v = 0; for (const [tt, target] of C.progres.slice().sort((a, b) => a[0] - b[0])) { if (t >= tt) v = lerp(v, target, E.out3(P(t, tt, tt + 1.4))); }
    return v;
  }
  function gambar(t) {
    const reboot = t >= C.reboot;
    let akhir = null;
    barisEl.forEach((el, i) => {
      const t0 = C.baris[i], tampak = t >= t0 && (i >= 6 ? reboot : !reboot);
      el.style.display = tampak ? '' : 'none';
      if (!tampak) return;
      const huruf = el.querySelectorAll('.tx i'); const m = Math.min(huruf.length, Math.floor((t - t0) / JEDA) + 1);
      huruf.forEach((c, j) => { c.style.visibility = j < m ? 'visible' : 'hidden'; });
      const st = el.querySelector('.st'), ct = el.querySelector('.ct'), dots = el.querySelector('.dots');
      if (st) {
        const ts = C.status[i], u = t - ts;
        const on = u >= 0 && (u > 0.45 || Math.floor(u * 12) % 2 === 0);
        st.style.visibility = on ? 'visible' : 'hidden'; ct.style.visibility = u > 0.45 ? 'visible' : 'hidden';
        dots.style.visibility = m >= huruf.length ? 'visible' : 'hidden';
      }
      akhir = el;
    });
    if (akhir) { akhir.appendChild(kursor); kursor.style.opacity = Math.floor(t * 3) % 2 ? 1 : 0; }
    const v = nilaiProgres(t); progres.style.width = `${(v * 100).toFixed(1)}%`; progresTxt.textContent = `${Math.round(v * 100)}%`;
    progres.classList.toggle('merah', !reboot && t >= C.status[3]);
    layar.classList.toggle('nexus', reboot);
    // panik
    const kp = t >= C.panik && !reboot;
    panik.style.opacity = kp ? 1 : 0;
    const g = kp && t < C.panik + 1.2 ? 10 * (1 - P(t, C.panik, C.panik + 1.2)) : 0;
    panik.style.transform = g ? `translate(${((hash(Math.floor(t * 30)) - 0.5) * g).toFixed(1)}px, ${((hash(Math.floor(t * 30) + 3) - 0.5) * g).toFixed(1)}px)` : '';
    panik.classList.toggle('kedip', kp && Math.floor(t * 2) % 2 === 0);
    // kilat putih sesaat saat reboot
    layar.style.filter = reboot && t < C.reboot + 0.12 ? 'brightness(3)' : '';
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "JetBrains Mono"', '700 60px "JetBrains Mono"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#050607'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('bt', (root, v, sc, tm, T) => {
    ensure();
    (v.baris || []).forEach(([i, c], n) => { C.baris[i] = sc.start + T(c, 0.3 + n * 0.9); });
    (v.status || []).forEach(([i, c], n) => { C.status[i] = sc.start + T(c, 0.8 + n * 0.9); });
    (v.progres || []).forEach(([c, target]) => { C.progres.push([sc.start + T(c, 0.5), target]); });
    if (v.panik != null) C.panik = sc.start + T(v.panik, 4);
    if (v.reboot != null) C.reboot = sc.start + T(v.reboot, 0.3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(700, 760), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(1120, (SW - el._w) / 2)}px`; el.style.top = `${pick(440, 880)}px`;
      const t0 = T(L.at, 4);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
