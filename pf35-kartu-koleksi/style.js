// Gaya PF35 · KARTU KOLEKSI: 3 kartu utama (punggung → depan lewat rotateY, preserve-3d) + 4 kartu set di belakang
// (kipas). Kilau = gradien diagonal yang bergeser sesuai waktu sejak dibuka; angka kekuatan menghitung 0 → nilai.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KARTU = [
    { nama: 'RoPA', gelar: 'Pencatat Kegiatan', langka: 'KARTU AWAL', ikon: '📒', mampu: 'Wizard 7 langkah · kode otomatis · data spesifik → risiko TINGGI', kuat: 7, sat: 'langkah', warna: '#2F6FD1' },
    { nama: 'DPIA', gelar: 'Penilai Dampak', langka: 'SANGAT LANGKA', ikon: '🛡️', mampu: 'Matriks 5×5 · register risiko · draf otomatis dari RoPA TINGGI', kuat: 25, sat: 'sel matriks', warna: '#7C3AED' },
    { nama: 'DSR', gelar: 'Penjaga Hak', langka: 'KARTU PENJAGA', ikon: '⏳', mampu: 'Tenggat 72 jam otomatis · verifikasi identitas · Handler–Reviewer–Approver', kuat: 72, sat: 'jam', warna: '#0E9F6E' },
  ];
  const SET = [['Consent', '✅', '#F59E0B'], ['Insiden', '🚨', '#DC2626'], ['Pihak ketiga', '🤝', '#0891B2'], ['Transfer', '🌏', '#4F46E5']];
  const C = { buka: [9e9, 9e9, 9e9], set: [9e9, 9e9, 9e9, 9e9], lencana: 9e9, tutup: 9e9 };
  let lapis = null, kartu = [], setEl = [], lencana = null;
  const CW = pick(400, 340), CH = pick(580, 500), GAP = pick(70, 22);
  const CY = pick(560, 800);

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kk-lapis');
    SET.forEach(([n, ik, w], i) => { const el = h(`<div class="kk-set" style="--w:${w}"><div class="ik">${ik}</div><div class="nm">${n}</div></div>`); lapis.appendChild(el); setEl.push(el); });
    KARTU.forEach((k, i) => {
      const x = SW / 2 + (i - 1) * (CW + GAP);
      const el = h(`<div class="kk-kartu" style="width:${CW}px;height:${CH}px;left:${x}px;top:${CY}px;--w:${k.warna}"><div class="kk-3d"><div class="kk-belakang"><img src="${PD.LOGO}" alt=""><span>MODUL</span></div><div class="kk-depan"><div class="kk-atas"><b>${k.nama}</b><i>${k.langka}</i></div><div class="kk-gambar"><span>${k.ikon}</span></div><div class="kk-gelar">${k.gelar}</div><div class="kk-mampu">${esc(k.mampu)}</div><div class="kk-kuat"><em>0</em><small>${k.sat}</small></div><div class="kk-kilau"></div></div></div></div>`);
      lapis.appendChild(el); kartu.push(el);
    });
    lencana = h('<div class="kk-lencana">SET LENGKAP · 7/7</div>'); lapis.appendChild(lencana);
  }
  function gambar(t) {
    kartu.forEach((el, i) => {
      const t0 = C.buka[i], k = P(t, t0, t0 + 0.8), rot = lerp(180, 0, E.io3(k));
      el.querySelector('.kk-3d').style.transform = `rotateY(${rot.toFixed(2)}deg) translateZ(0)`;
      el.style.transform = `translate(-50%, -50%) translateY(${(-Math.sin(k * Math.PI) * 60).toFixed(1)}px) scale(${(1 + Math.sin(k * Math.PI) * 0.06).toFixed(3)})`;
      const u = t - t0 - 0.6;
      const kilau = el.querySelector('.kk-kilau'); kilau.style.opacity = u > 0 && u < 1.2 ? 1 : 0; kilau.style.transform = `translateX(${lerp(-140, 140, cl(u / 1.2)).toFixed(1)}%) skewX(-20deg)`;
      const n = Math.round(lerp(0, KARTU[i].kuat, E.out3(P(t, t0 + 0.5, t0 + 1.6)))); el.querySelector('.kk-kuat em').textContent = t >= t0 + 0.5 ? String(n) : '0';
    });
    setEl.forEach((el, i) => {
      const t0 = C.set[i], k = P(t, t0, t0 + 0.5), ang = [-34, -12, 12, 34][i];
      el.style.opacity = k > 0 ? 1 : 0;
      el.style.transform = `translate(-50%, -50%) rotate(${ang}deg) translateY(${(-CH * 0.62 - (1 - E.outBack(Math.max(0.001, k))) * 200).toFixed(1)}px)`;
    });
    const kl = P(t, C.lencana, C.lencana + 0.4);
    lencana.style.opacity = kl > 0 ? 1 : 0; lencana.style.transform = `translate(-50%, -50%) scale(${lerp(1.6, 1, E.outBack(Math.max(0.001, kl))).toFixed(3)}) rotate(-4deg)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Cinzel', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H * 0.55, 100, W / 2, H * 0.55, W * 0.75); g.addColorStop(0, '#3B1E6B'); g.addColorStop(1, '#150A2E');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.04)';
      for (let i = 0; i < 400; i++) cx.fillRect(hash(i * 1.7) * W, hash(i * 2.3) * H, 2, 2);
    },
  });

  KIT.registerType('kk', (root, v, sc, tm, T) => {
    ensure();
    (v.buka || []).forEach(([i, c], n) => { C.buka[i] = sc.start + T(c, 0.8 + n * 1.5); });
    if (v.set) v.set.forEach((c, i) => { C.set[i] = sc.start + T(c, 0.6 + i * 0.7); });
    if (v.lencana != null) C.lencana = sc.start + T(v.lencana, 3.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
