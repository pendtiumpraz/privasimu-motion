// Gaya GB52 · RANTAI: mata pipih (cincin berongga) & mata samping (kapsul) berselang-seling di dua grup (kiri/kanan
// dari mata lemah). Tegangan = jarak antar mata × (1 + reg) + getar hash. Retakan = path SVG zigzag dengan dashoffset
// dari panjang → 0. Putus: mata lemah dibelah dua (clip-path) dan tiap grup terpental (translate + rotate teredam);
// dokumen jatuh dengan gravitasi. Tempa: grup kembali, pijar las (box-shadow) lalu utuh; tarik ulang → TAHAN.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const N = 7, LEMAH = 3, PITCH = pick(200, 170), LW = pick(220, 192), LH = pick(100, 94), Y = pick(520, 880);
  const X0 = SW / 2 - (N - 1) * PITCH / 2;
  const PIHAK = ['kamu', 'payroll*', 'cloud*', 'call center*', 'logistik*', 'percetakan*', 'pelanggan'];
  const SKOR = [null, 82, 76, 41, 88, 79, null];
  const JUDUL = [['mulai', 'Sekuat yang terlemah.'], ['putus', 'Putus di pihak ketiga.'], ['tautan', 'Ukur sebelum ditarik.'], ['tempa', 'Tempa dulu, baru tarik.']];
  const LX = (i) => (V ? cl(X0 + i * PITCH, 90, SW - 90) : X0 + i * PITCH); // 9:16: rantai lebih besar, ujungnya keluar layar
  const C = { mulai: 9e9, tarik: 9e9, retak: 9e9, catat: 9e9, putus: 9e9, tautan: 9e9, kuesioner: 9e9, skor: 9e9, tempa: 9e9, las: 9e9, tarik2: 9e9, tahan: 9e9, tutup: 9e9 };
  let lapis = null, el = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('rt-lapis');
    el = {};
    el.kop = h('<div class="rt-kop"></div>'); lapis.appendChild(el.kop);
    el.brankas = h(`<div class="rt-blok kiri" style="left:${X0 - PITCH * pick(1, 0.9) - pick(40, 10)}px;top:${Y}px"><i></i>DATAMU</div>`); lapis.appendChild(el.brankas);
    el.beban = h(`<div class="rt-blok kanan" style="left:${X0 + (N - 1) * PITCH + PITCH * pick(1, 0.9) + pick(40, 10)}px;top:${Y}px">TARIK<b>→</b></div>`); lapis.appendChild(el.beban);
    el.kiri = h('<div class="rt-grup"></div>'); el.kanan = h('<div class="rt-grup"></div>'); lapis.appendChild(el.kiri); lapis.appendChild(el.kanan);
    el.mata = []; el.label = []; el.skor = [];
    for (let i = 0; i < N; i++) {
      const grup = i < LEMAH ? el.kiri : (i > LEMAH ? el.kanan : null);
      const buat = (klip) => {
        const m = h(`<div class="rt-mata ${i % 2 ? '' : 'samping'} ${klip ? 'lemah ' + klip : ''}" style="width:${i % 2 ? LW : LW * 0.5}px;height:${i % 2 ? LH : LH * 0.38}px"><svg class="retak" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M52 0 L44 22 L58 38 L46 56 L56 74 L48 100" pathLength="100"/></svg></div>`);
        (klip === 'kiriPotong' ? el.kiri : klip === 'kananPotong' ? el.kanan : grup).appendChild(m); return m;
      };
      if (i === LEMAH) el.mata.push([buat('kiriPotong'), buat('kananPotong')]); else el.mata.push(buat());
      const lb = h(`<div class="rt-label${i === N - 1 ? ' ujung' : ''}" style="left:${LX(i)}px;top:${Y + LH / 2 + 26}px">${esc(PIHAK[i])}</div>`); lapis.appendChild(lb); el.label.push(lb);
      const sk = h(`<div class="rt-skor" style="left:${LX(i)}px;top:${Y - LH / 2 - 30}px">${SKOR[i] == null ? '' : SKOR[i]}</div>`); lapis.appendChild(sk); el.skor.push(sk);
    }
    el.dok = Array.from({ length: 7 }, (_, i) => { const d = h('<div class="rt-dok"><i></i><i></i><i></i></div>'); lapis.appendChild(d); return d; });
    el.tautan = h(`<div class="rt-tautan" style="left:${X0 + LEMAH * PITCH}px;top:${Y - LH / 2 - pick(120, 150)}px"><i></i>tautan asesmen publik · tanpa akun</div>`); lapis.appendChild(el.tautan);
    el.kartu = h(`<div class="rt-kartu"><b>Asesmen Pihak Ketiga · 12 pertanyaan*</b>${['Kebijakan pelindungan data', 'Enkripsi & kontrol akses', 'Sub-pemroses & transfer', 'Penanganan insiden'].map((s) => `<div class="baris"><i></i><span>${s}</span><em>bukti · AI</em></div>`).join('')}</div>`); lapis.appendChild(el.kartu);
    el.barisK = Array.from(el.kartu.querySelectorAll('.baris'));
    el.tahan = h('<div class="rt-tahan">TAHAN ✓</div>'); lapis.appendChild(el.tahan);
    el.catatan = h('<div class="rt-catatan">*nama pihak & skor ilustrasi</div>'); lapis.appendChild(el.catatan);
  }
  function gambar(t) {
    const km = E.out3(P(t, C.mulai, C.mulai + 0.6));
    const putus = t >= C.putus && t < C.tempa, kp = putus ? P(t, C.putus, C.putus + 1.2) : 0, kt = E.io3(P(t, C.tempa, C.tempa + 0.7));
    // tegangan & getar
    let reg = 0, getar = 0;
    if (t >= C.tarik && t < C.putus) { const k = P(t, C.tarik, C.tarik + 0.8); reg = 0.05 * k + 0.05 * P(t, C.catat, C.putus); getar = 2 + 5 * P(t, C.catat, C.putus); }
    if (t >= C.tarik2 && t < C.tarik2 + 1.6) { const k = P(t, C.tarik2, C.tarik2 + 0.5); reg = 0.06 * k * (1 - P(t, C.tarik2 + 1.1, C.tarik2 + 1.6)); getar = 7 * k * (1 - P(t, C.tarik2 + 1.1, C.tarik2 + 1.6)); }
    const gx = (hash(Math.floor(t * 50)) - 0.5) * getar, gy = (hash(Math.floor(t * 50) + 3) - 0.5) * getar;
    // grup kiri/kanan (terpental saat putus, kembali saat tempa)
    const pental = putus ? (1 - kt) : 0, lempar = putus ? Math.min(1, kp * 2) : 0;
    const eL = E.out3(lempar), rec = 1 - kt;
    el.kiri.style.transform = `translate(${(gx - 90 * eL * rec).toFixed(1)}px, ${(gy + 30 * eL * rec).toFixed(1)}px) rotate(${(-9 * eL * rec + Math.sin(t * 6) * 2 * eL * rec).toFixed(2)}deg)`;
    el.kanan.style.transform = `translate(${(gx + 110 * eL * rec).toFixed(1)}px, ${(gy - 24 * eL * rec).toFixed(1)}px) rotate(${(7 * eL * rec + Math.sin(t * 7 + 1) * 2 * eL * rec).toFixed(2)}deg)`;
    el.kiri.style.transformOrigin = `${X0}px ${Y}px`; el.kanan.style.transformOrigin = `${X0 + (N - 1) * PITCH}px ${Y}px`;
    // mata
    const kr = P(t, C.retak, C.retak + 0.6), las = t >= C.las ? P(t, C.las, C.las + 0.4) * (1 - P(t, C.las + 0.8, C.las + 1.3)) : 0, utuh = t >= C.las + 0.9;
    for (let i = 0; i < N; i++) {
      const x = X0 + i * PITCH * (1 + reg) - (N - 1) * PITCH * reg / 2, k = E.outBack(Math.max(0.001, P(t, C.mulai + 0.1 + i * 0.06, C.mulai + 0.5 + i * 0.06)));
      const tr = `translate(${x.toFixed(1)}px, ${Y}px) translate(-50%, -50%) scale(${k.toFixed(3)})`;
      if (i !== LEMAH) { el.mata[i].style.transform = tr; el.mata[i].style.opacity = t >= C.mulai + 0.1 + i * 0.06 ? 1 : 0; continue; }
      const [a, b] = el.mata[i], belah = putus ? 26 * Math.min(1, kp * 3) * (1 - kt) : 0;
      a.style.transform = `translate(${(x - belah).toFixed(1)}px, ${Y}px) translate(-50%, -50%) scale(${k.toFixed(3)})`; b.style.transform = `translate(${(x + belah).toFixed(1)}px, ${Y}px) translate(-50%, -50%) scale(${k.toFixed(3)})`;
      [a, b].forEach((m) => {
        m.style.opacity = t >= C.mulai + 0.1 + i * 0.06 ? 1 : 0;
        m.classList.toggle('merah', t >= C.retak && !utuh); m.classList.toggle('las', las > 0); m.classList.toggle('utuh', utuh);
        m.querySelector('.retak').style.visibility = t >= C.retak && !utuh ? 'visible' : 'hidden';
        m.querySelector('path').style.strokeDashoffset = utuh ? 100 : (100 - 100 * E.out3(kr)).toFixed(1);
        m.style.boxShadow = las > 0 ? `0 0 ${(40 * las).toFixed(0)}px ${(12 * las).toFixed(0)}px rgba(255,140,40,${(0.9 * las).toFixed(2)})` : '';
      });
      el.label[i].textContent = t >= C.catat && t < C.tautan ? 'surel, tahun lalu*' : PIHAK[i];
      el.label[i].classList.toggle('merah', t >= C.retak && !utuh);
    }
    el.label.forEach((l, i) => { const k = P(t, C.mulai + 0.5 + i * 0.06, C.mulai + 0.8 + i * 0.06); l.style.opacity = k; });
    el.brankas.style.opacity = km; el.beban.style.opacity = km; el.beban.style.transform = `translate(-50%, -50%) translateX(${(reg * pick(260, 90)).toFixed(1)}px)`; el.brankas.style.transform = 'translate(-50%, -50%)';
    // dokumen jatuh
    el.dok.forEach((d, i) => {
      const tau = t - C.putus - 0.05 - i * 0.07;
      if (tau < 0 || tau > 1.6) { d.style.opacity = 0; return; }
      const vx = (hash(i * 3.3) - 0.5) * 320, x = X0 + LEMAH * PITCH + vx * tau, y = Y + 40 * tau + 950 * tau * tau;
      d.style.opacity = y < SH + 60 ? 1 : 0; d.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(tau * (hash(i) - 0.5) * 400).toFixed(1)}deg)`;
    });
    // tautan, kartu, skor
    const ktl = t >= C.tautan ? E.outBack(Math.max(0.001, P(t, C.tautan, C.tautan + 0.4))) * (1 - P(t, C.tempa, C.tempa + 0.3)) : 0;
    el.tautan.style.opacity = ktl > 0.001 ? 1 : 0; el.tautan.style.transform = `translate(-50%, 0) scale(${ktl.toFixed(3)})`;
    const kk = t >= C.kuesioner ? E.out3(P(t, C.kuesioner, C.kuesioner + 0.5)) * (1 - P(t, C.tempa, C.tempa + 0.3)) : 0;
    el.kartu.style.opacity = kk; el.kartu.style.transform = `translate(-50%, ${((1 - kk) * 40).toFixed(1)}px)`;
    el.barisK.forEach((b, i) => b.classList.toggle('cek', t >= C.kuesioner + 0.5 + i * 0.25));
    el.skor.forEach((s, i) => {
      if (SKOR[i] == null) return;
      const t0 = C.skor + i * 0.12, k = t >= t0 ? E.outBack(Math.max(0.001, P(t, t0, t0 + 0.4))) : 0;
      const teks = i === LEMAH && t >= C.tahan ? 'asesmen ulang*' : String(SKOR[i]); if (s.textContent !== teks) s.textContent = teks;
      s.classList.toggle('merah', SKOR[i] < 60 && t < C.tahan); s.classList.toggle('hijau', SKOR[i] >= 80 || (i === LEMAH && t >= C.tahan));
      s.style.opacity = k > 0.001 ? 1 : 0; s.style.transform = `translate(-50%, -100%) scale(${k.toFixed(3)})`;
    });
    const kth = t >= C.tahan ? E.outBack(Math.max(0.001, P(t, C.tahan, C.tahan + 0.4))) : 0;
    el.tahan.style.opacity = kth > 0.001 ? 1 : 0; el.tahan.style.transform = `translate(-50%, -50%) rotate(-8deg) scale(${kth.toFixed(3)})`;
    let jud = null, tj = 0; JUDUL.forEach(([k, s]) => { if (t >= C[k] && C[k] >= tj) { jud = s; tj = C[k]; } });
    if (jud != null && el.kop.textContent !== jud) el.kop.textContent = jud;
    const kj = E.out3(P(t, tj, tj + 0.35)); el.kop.style.opacity = jud ? kj : 0; el.kop.style.transform = `translateX(-50%) translateY(${((1 - kj) * 16).toFixed(1)}px)`;
    el.catatan.style.opacity = t >= C.mulai + 1 ? 0.8 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 40px Inter', '600 24px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7); g.addColorStop(0, '#2B3140'); g.addColorStop(1, '#141821');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('rt', (root, v, sc, tm, T) => {
    ensure();
    ['mulai', 'tarik', 'retak', 'catat', 'putus', 'tautan', 'kuesioner', 'skor', 'tempa', 'las', 'tarik2', 'tahan'].forEach((k) => { if (v[k] != null) C[k] = sc.start + T(v[k], 0.5); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
