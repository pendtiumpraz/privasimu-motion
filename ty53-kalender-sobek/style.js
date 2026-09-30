// Gaya TY53 · KALENDER SOBEK: 24 tanggal (1 Okt 2026 → 16 Jan 2027, loncatan hari makin besar). Jadwal sobekan dibagi
// antara cue "mulai" dan "akhir" dengan jeda mengecil (0.85^i). Dua elemen lembar: yang menetap (tanggal sekarang) dan
// yang sedang disobek (rotateX di engsel atas + jatuh). Daftar centang muncul setelah "geser".
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const HARI = [0, 1, 2, 3, 4, 6, 8, 10, 13, 16, 20, 24, 29, 34, 40, 46, 53, 60, 68, 76, 85, 94, 100, 107];
  const BULAN = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
  const NAMA = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
  const T0 = Date.UTC(2026, 9, 1);
  const TGL = HARI.map((d) => { const x = new Date(T0 + d * 86400000); return { hari: x.getUTCDate(), bulan: BULAN[x.getUTCMonth()], thn: x.getUTCFullYear(), nama: NAMA[x.getUTCDay()] }; });
  const MODUL = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden'];
  const C = { mulai: 9e9, akhir: 9e9, geser: 9e9, centang: [9e9, 9e9, 9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, kal = null, tetap = null, sobek = null, daftar = null, itemEl = [], jadwal = null;

  function lembar(k) { return `<div class="kal-hal ${k}"><div class="kal-bulan"></div><div class="kal-angka"></div><div class="kal-nama"></div><div class="kal-kaki"></div></div>`; }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kal-lapis');
    kal = h(`<div class="kal"><div class="kal-ring"><i></i><i></i></div>${lembar('tetap')}${lembar('sobek')}</div>`);
    lapis.appendChild(kal);
    tetap = kal.querySelector('.kal-hal.tetap'); sobek = kal.querySelector('.kal-hal.sobek');
    daftar = h(`<div class="kal-daftar"><div class="kd-judul">SIAP PP 33</div>${MODUL.map((m) => `<div class="kd-item"><i></i><span>${m}</span></div>`).join('')}</div>`);
    lapis.appendChild(daftar); itemEl = [...daftar.querySelectorAll('.kd-item')];
  }
  function isi(el, d, akhir) {
    el.querySelector('.kal-bulan').textContent = `${d.bulan} ${d.thn}`;
    el.querySelector('.kal-angka').textContent = d.hari;
    el.querySelector('.kal-nama').textContent = d.nama;
    el.querySelector('.kal-kaki').textContent = akhir ? 'PP 33/2026 BERLAKU' : '';
    el.classList.toggle('merah', !!akhir);
  }
  function jadwalSobek() { // waktu sobekan ke-i (i = 1..N-1), jeda mengecil
    if (jadwal) return jadwal;
    const n = TGL.length - 1, w = []; let tot = 0;
    for (let i = 0; i < n; i++) { const x = Math.pow(0.86, i); w.push(x); tot += x; }
    const span = C.akhir - C.mulai; let acc = C.mulai; jadwal = [];
    for (let i = 0; i < n; i++) { jadwal.push(acc); acc += (w[i] / tot) * span; }
    return jadwal;
  }
  function gambar(t) {
    const J = jadwalSobek();
    let i = 0; while (i < J.length && t >= J[i]) i++; // i = jumlah sobekan selesai → lembar sekarang TGL[i]
    isi(tetap, TGL[i], i === TGL.length - 1);
    if (i > 0) {
      const ts = J[i - 1], k = P(t, ts, ts + Math.min(0.42, (i < J.length ? J[i] - ts : 0.42) * 1.6));
      isi(sobek, TGL[i - 1], false);
      sobek.style.opacity = k < 1 ? 1 : 0;
      sobek.style.transform = `perspective(1400px) rotateX(${(-E.io3(Math.min(1, k * 1.4)) * 95).toFixed(1)}deg) translateY(${(Math.max(0, k - 0.45) * 800).toFixed(1)}px) rotate(${(Math.max(0, k - 0.45) * 30).toFixed(1)}deg)`;
    } else sobek.style.opacity = 0;
    kal.classList.toggle('mendarat', t >= C.akhir && t < C.akhir + 0.3);
    const g = E.io3(P(t, C.geser, C.geser + 0.8));
    kal.style.transform = `translate(${lerp(SW / 2, pick(560, SW / 2), g).toFixed(1)}px, ${lerp(pick(540, 800), pick(540, 560), g).toFixed(1)}px) translate(-50%, -50%) scale(${lerp(1, pick(0.9, 0.72), g).toFixed(3)})`;
    daftar.style.opacity = g.toFixed(3);
    daftar.style.transform = `translate(${lerp(pick(SW + 200, SW / 2), pick(1330, SW / 2), g).toFixed(1)}px, ${pick(540, 1160)}px) translate(-50%, -50%)`;
    itemEl.forEach((el, n) => { const pk = P(t, C.centang[n], C.centang[n] + 0.25); el.classList.toggle('on', pk > 0); el.style.setProperty('--k', E.outBack(Math.max(0.001, pk)).toFixed(3)); });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px Anton', '800 60px Inter', '500 30px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#EEF1F4'); g.addColorStop(1, '#CFD6DE');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.06)'; cx.fillRect(0, H * 0.82, W, H); // lantai
    },
  });

  KIT.registerType('ks', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 2);
    if (v.akhir != null) C.akhir = sc.start + T(v.akhir, 3);
    if (v.geser != null) C.geser = sc.start + T(v.geser, 0.3);
    if (v.centang) v.centang.forEach((c, i) => { C.centang[i] = sc.start + T(c, 1.5 + i * 0.6); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="kal-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
