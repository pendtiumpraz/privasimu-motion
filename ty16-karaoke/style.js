// Gaya TY16 · KARAOKE: tiap scene punya bait (baris dipisah '|'); kata dipecah PD.kata (waktu dari VO) lalu terisi
// kuning dengan PD.tampil 'karaoke'. Bola pantul: posisi = parabola antara pusat kata ke-i dan ke-(i+1) berdasarkan
// waktu kata (diukur sekali saat render pertama). "hening" menghentikan bola di udara; "logo" = bola mendarat di logo.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { judul: 9e9, hening: 9e9, lihat: 9e9, logo: 9e9, tutup: 9e9 };
  let lapis = null, judul = null, logo = null, bola = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kr-lapis', 3);
    judul = h('<div class="kr-judul"><i>🎤</i><span>LAGU WAJIB RAPAT KEPATUHAN</span><em>lirik & melodi orisinal</em></div>');
    lapis.appendChild(judul);
    logo = h(`<div class="kr-logo"><img src="${PD.LOGO}" alt=""><b>NEXUS</b></div>`); lapis.appendChild(logo);
    bola = h('<div class="kr-bola"></div>'); lapis.appendChild(bola);
  }
  function gambarGlobal(t) {
    const kj = E.out3(P(t, C.judul, C.judul + 0.5)); judul.style.opacity = kj.toFixed(3); judul.style.transform = `translateY(${((1 - kj) * -30).toFixed(1)}px)`;
    const kl = P(t, C.logo, C.logo + 0.5), pop = kl > 0 ? E.outBack(kl) : 0;
    logo.style.opacity = kl > 0 ? 1 : 0;
    logo.style.transform = `translate(-50%, -50%) scale(${(pop * (1 + 0.04 * Math.sin((t - C.logo) * 9))).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px "Baloo 2"', '800 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const beat = 60 / 112 / 2, ph = (t % beat) / beat, denyut = 1 - E.out3(ph);
      const g = cx.createRadialGradient(W / 2, H * 0.45, 60, W / 2, H * 0.45, W * (0.62 + denyut * 0.06));
      g.addColorStop(0, `hsl(${(292 + denyut * 8).toFixed(0)}, 70%, ${(34 + denyut * 8).toFixed(0)}%)`); g.addColorStop(1, '#170A2E');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      for (let i = 0; i < 70; i++) { const x = hash(i * 1.7) * W, y = (hash(i * 2.9) * H + t * (10 + hash(i) * 20)) % H, r = 2 + hash(i * 3.3) * 4; cx.fillStyle = `rgba(255,220,120,${(0.15 + 0.35 * hash(Math.floor(t * 3) + i)).toFixed(2)})`; cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill(); }
    },
  });

  KIT.registerType('kr', (root, v, sc, tm, T) => {
    ensure();
    if (v.judul != null) C.judul = sc.start + T(v.judul, 0);
    if (v.hening != null) C.hening = sc.start + T(v.hening, 2);
    if (v.lihat != null) C.lihat = sc.start + T(v.lihat, 3.5);
    if (v.logo != null) C.logo = sc.start + T(v.logo, 5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.bait) {
      const el = h(`<div class="kr-bait">${v.bait.split('|').map((b) => `<div class="kr-baris">${rich(b)}</div>`).join('')}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      const tHen = v.hening != null ? T(v.hening, 2) : 9e9, tLihat = v.lihat != null ? T(v.lihat, 3.5) : 9e9, tLogo = v.logo != null ? T(v.logo, 5) : 9e9;
      const lihat = v.lihat != null ? h('<div class="kr-lihat">semua lihat DPO 👀</div>') : null; if (lihat) root.appendChild(lihat);
      let pusat = null; // pusat tiap kata (diukur sekali)
      parts.push((lt, d) => {
        PD.tampil(ws, lt, 'karaoke');
        ws.forEach((w) => w.el.classList.toggle('pd-on', lt >= w.t));
        el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02);
        if (!pusat) { const r0 = root.getBoundingClientRect(), sc2 = SW / r0.width; pusat = ws.map((w) => { const r = w.el.getBoundingClientRect(); return [(r.left + r.width / 2 - r0.left) * sc2, (r.top - r0.top) * sc2]; }); }
        // bola: dari kata ke kata; tinggi lompatan sinus
        let i = 0; while (i + 1 < ws.length && lt >= ws[i + 1].t) i++;
        const tA = ws[i].t, tB = i + 1 < ws.length ? ws[i + 1].t : tA + 0.6, f = cl((lt - tA) / Math.max(0.12, tB - tA));
        const a = pusat[i], b = i + 1 < ws.length ? pusat[i + 1] : pusat[i];
        let x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f) - 34 - Math.sin(f * Math.PI) * 110;
        let tampil = lt >= ws[0].t - 0.3 && lt < d - 0.2;
        if (lt >= tHen && lt < d) { x = b[0]; y = b[1] - 34 - 110; } // hening: bola tergantung di udara
        if (lt >= tLogo) { const k = E.io3(P(lt, tLogo, tLogo + 0.4)); x = lerp(x, SW / 2, k); y = lerp(y, pick(190, 560), k); }
        if (lt >= tLogo + 0.4) tampil = false;
        bola.style.opacity = tampil ? 1 : 0;
        bola.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${(1 + 0.25 * Math.sin(f * Math.PI)).toFixed(3)})`;
        if (lihat) { const k = P(lt, tLihat, tLihat + 0.3); lihat.style.opacity = k > 0 ? 1 : 0; lihat.style.transform = `translate(-50%, 0) scale(${lerp(1.3, 1, E.out3(k)).toFixed(3)})`; }
        el.classList.toggle('hening', lt >= tHen && lt < tLihat);
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambarGlobal(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
