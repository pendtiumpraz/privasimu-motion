// Gaya TY48 · KREDIT AKHIR FILM: satu gulungan kredit di lapisan lintas scene. Posisi gulir = fungsi waktu global yang
// melewati titik (waktu cue, posisi baris), jadi baris yang sedang diucapkan selalu tepat di garis baca.
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, hash } = MG;
  const BACA = pick(600, 930); // garis baca (y layar)
  const R = [];                // baris: { el, t (global | null), y }
  let lapis = null, gulung = null, KF = null, TUTUP = 9e9;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kr-lapis');
    gulung = h('<div class="kr-gulung" data-bebas></div>'); // gulungan memang lebih panjang dari layar
    lapis.appendChild(gulung);
    lapis.appendChild(h('<div class="kr-tepi"></div>'));
  }

  function susun() {
    // posisi tengah tiap baris di dalam gulungan
    R.forEach((r) => { r.y = r.el.offsetTop + r.el.offsetHeight / 2; });
    const kunci = R.filter((r) => r.t != null);
    // baris tanpa cue: waktunya disisipkan merata (menurut posisi) di antara dua baris ber-cue
    R.forEach((r, i) => {
      if (r.t != null) return;
      let a = null, b = null;
      for (let j = i - 1; j >= 0; j--) if (R[j].t0 != null) { a = R[j]; break; }
      for (let j = i + 1; j < R.length; j++) if (R[j].t0 != null) { b = R[j]; break; }
      r.t = a && b ? lerp(a.t0, b.t0, (r.y - a.y) / (b.y - a.y)) : a ? a.t0 + (r.y - a.y) / 160 : 0;
    });
    KF = R.map((r) => [r.t, r.y]).sort((x, y) => x[0] - y[0]);
    // jaga agar gulungan tidak pernah mundur
    for (let i = 1; i < KF.length; i++) if (KF[i][1] < KF[i - 1][1]) KF[i][1] = KF[i - 1][1];
    return kunci.length;
  }
  function posisi(t) {
    const n = KF.length;
    if (t <= KF[0][0]) return KF[0][1] - (KF[0][0] - t) * 150;
    if (t >= KF[n - 1][0]) return KF[n - 1][1] + (t - KF[n - 1][0]) * 150;
    let i = 0;
    while (i < n - 2 && t > KF[i + 1][0]) i++;
    const [t0, y0] = KF[i], [t1, y1] = KF[i + 1], k = (t - t0) / Math.max(1e-3, t1 - t0);
    return lerp(y0, y1, k * k * (3 - 2 * k) * 0.5 + k * 0.5); // setengah linear, setengah halus
  }

  function gambar(t) {
    if (!KF) susun();
    const f = Math.floor(t * 12);
    const goyang = (hash(f * 1.3) - 0.5) * 1.6;
    gulung.style.transform = `translate(${goyang.toFixed(2)}px, ${(BACA - posisi(t)).toFixed(2)}px)`;
    lapis.style.opacity = ((0.93 + 0.07 * hash(f * 3.1)) * (1 - P(t, TUTUP, TUTUP + 0.5))).toFixed(3);
    for (const r of R) {
      const dy = Math.abs(r.y - posisi(t));
      r.el.style.opacity = lerp(1, 0.62, cl((dy - 60) / 260)).toFixed(3);
    }
  }

  KIT.style({
    fonts: ['600 60px "Cormorant Garamond"', '500 60px "Cormorant Garamond"', 'italic 500 60px "Cormorant Garamond"', '600 30px Jost'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#050403'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H * 0.5, Math.max(W, H) * 0.7);
      g.addColorStop(0, 'rgba(60,44,24,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      // goresan film tipis yang berpindah tiap beberapa frame
      const f = Math.floor(t * 8);
      cx.fillStyle = 'rgba(255,240,210,.10)';
      for (let i = 0; i < 2; i++) if (hash(f * 7.7 + i) > 0.55) cx.fillRect(hash(f + i * 9.1) * W, 0, 1.5, H);
    },
  });

  KIT.registerType('kr', (root, v, sc, tm, T) => {
    ensure();
    root.appendChild(h('<div class="kr-hitam"></div>'));
    for (const [peran, nama, kapan] of v.baris || []) {
      let el;
      if (peran === '#') el = h(`<div class="kr-judul">${esc(nama)}</div>`);
      else if (peran === 'logo') el = h(`<div class="kr-logo"><img src="${PD.LOGO}" alt=""><span>NEXUS</span></div>`);
      else if (!nama) el = h(`<div class="kr-satu">${esc(peran)}</div>`);
      else el = h(`<div class="kr-baris"><span class="p">${esc(peran)}</span><i></i><span class="n">${esc(nama)}</span></div>`);
      gulung.appendChild(el);
      const t = kapan != null ? sc.start + T(kapan, 0) : null;
      R.push({ el, t, t0: t });
    }
    const cta = v.cta ? PD.cta(root, v.cta, T) : null;
    if (cta) TUTUP = sc.start - 0.3;
    return (lt) => { gambar(sc.start + lt); if (cta) cta(lt); };
  });
})();
