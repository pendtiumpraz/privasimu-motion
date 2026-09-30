// Gaya TY56 · DAFTAR ISI: halaman di lapisan lintas scene; 12 entri, masing-masing punya waktu muncul (bab 1 & 12 dari
// cue, bab 2–11 disebar di antaranya). Titik penuntun tumbuh (lebar 0→100%) lalu nomor halaman menghitung naik.
// Penanda merah di bab 1 pada cue "penanda"; sorot pada cue "sorot"; halaman terlipat (rotateX) pada "lipat".
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BAB = [
    ['Pendahuluan', 3], ['Ruang Lingkup & Istilah', 9], ['Inventaris Pemrosesan (RoPA)', 21], ['Dasar Pemrosesan', 58],
    ['Persetujuan (Consent)', 96], ['Penilaian Dampak (DPIA)', 141], ['Hak Subjek Data (DSR)', 203], ['Pihak Ketiga', 267],
    ['Transfer Lintas Negara', 318], ['Insiden & Pemberitahuan', 371], ['Pelatihan & Kesadaran', 433], ['Lampiran', 482],
  ];
  const SOROT = [2, 5, 9]; // indeks bab yang disorot: RoPA, DPIA, Insiden
  const C = { bab: BAB.map(() => 9e9), penanda: 9e9, sorot: [9e9, 9e9, 9e9], lipat: 9e9, tutup: 9e9 };
  let lapis = null, hal = null, entri = [], penanda = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('di-lapis');
    hal = h(`<div class="di-hal"><div class="di-kop">LAPORAN KEPATUHAN 2026</div><div class="di-judul">DAFTAR ISI</div>${BAB.map(([j], i) => `<div class="di-e"><span class="di-b">Bab ${i + 1}</span><span class="di-j">${esc(j)}</span><span class="di-d"><i></i></span><span class="di-n">0</span></div>`).join('')}<div class="di-kaki">*nomor halaman ilustrasi</div><div class="di-penanda">direksi berhenti di sini · hlm. 2</div></div>`);
    lapis.appendChild(hal);
    entri = [...hal.querySelectorAll('.di-e')].map((el) => ({ el, d: el.querySelector('.di-d i'), n: el.querySelector('.di-n') }));
    penanda = hal.querySelector('.di-penanda');
  }
  function gambar(t) {
    entri.forEach((e, i) => {
      const t0 = C.bab[i], k1 = P(t, t0, t0 + 0.25), k2 = E.out3(P(t, t0 + 0.2, t0 + 0.75));
      e.el.style.opacity = k1 > 0 ? 1 : 0;
      e.el.style.transform = `translateX(${((1 - E.out3(k1)) * 30).toFixed(1)}px)`;
      e.d.style.width = `${(E.out3(P(t, t0 + 0.1, t0 + 0.55)) * 100).toFixed(1)}%`;
      const awal = i ? BAB[i - 1][1] : 0, target = BAB[i][1];
      e.n.textContent = k2 > 0 ? String(Math.round(lerp(awal, target, k2))) + (i === BAB.length - 1 && k2 >= 1 ? '*' : '') : '';
      const si = SOROT.indexOf(i);
      e.el.classList.toggle('sorot', si >= 0 && t >= C.sorot[si]);
    });
    const kp = P(t, C.penanda, C.penanda + 0.3);
    penanda.style.opacity = kp > 0 ? 1 : 0;
    penanda.style.transform = `translateX(${((1 - E.outBack(Math.max(0.001, kp))) * -80).toFixed(1)}px) rotate(-2deg)`;
    const kl = E.io3(P(t, C.lipat, C.lipat + 0.9));
    hal.style.transform = `perspective(1800px) rotateX(${(kl * 88).toFixed(2)}deg) translateY(${(kl * -40).toFixed(1)}px)`;
    hal.style.opacity = (1 - P(kl, 0.75, 1)).toFixed(3);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Libre Baskerville"', '700 60px "Libre Baskerville"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#2E3A4A'); g.addColorStop(1, '#141B24');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('di', (root, v, sc, tm, T) => {
    ensure();
    if (v.bab) {
      const a = sc.start + T(v.bab[0], 0.6), m = sc.start + T(v.bab[1], 2.2), z = sc.start + T(v.bab[2], 4);
      C.bab[0] = a; C.bab[BAB.length - 1] = z;
      for (let i = 1; i < BAB.length - 1; i++) C.bab[i] = lerp(m, z - 0.35, (i - 1) / (BAB.length - 3));
    }
    if (v.penanda != null) C.penanda = sc.start + T(v.penanda, 5.5);
    if (v.sorot) v.sorot.forEach((c, i) => { C.sorot[i] = sc.start + T(c, 2 + i * 0.7); });
    if (v.lipat != null) C.lipat = sc.start + T(v.lipat, 0.8);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="di-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1080, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(230, 560)}px`;
      const t0 = T(L.at, 2);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.6)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 120).toFixed(1)}px) scale(${lerp(0.9, 1, k).toFixed(3)})`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
