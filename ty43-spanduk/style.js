// Gaya TY43 · SPANDUK WARUNG TENDA: spanduk di lapisan lintas scene; kain bergelombang = clip-path poligon bergelombang +
// tiap huruf naik-turun mengikuti gelombang; papan menu & lencana di scene.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { bentang: 9e9, menu: [], buka: 9e9, bungkus: 9e9, klik: 9e9, tutup: 9e9 };
  let lapis = null, spanduk = null, huruf = [];
  const BW = pick(1700, 1000), BH = pick(300, 300), BX = (SW - BW) / 2, BY = pick(70, 240);

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('wr-lapis');
    spanduk = h(`<div class="wr-spanduk" style="left:${BX}px;top:${BY}px;width:${BW}px;height:${BH}px"><div class="wr-judul">${V ? 'WARUNG<br>KEPATUHAN' : 'WARUNG KEPATUHAN'}</div><div class="wr-sub">SEDIA SEGALA URUSAN DATA PRIBADI</div><i class="tali a"></i><i class="tali b"></i></div>`);
    lapis.appendChild(spanduk);
    huruf = PD.huruf($('.wr-judul', spanduk));
  }
  function gambar(t) {
    const kb = E.outBack(P(t, C.bentang, C.bentang + 0.55));
    spanduk.style.transform = `scaleY(${Math.max(0.02, kb).toFixed(3)}) rotate(${(Math.sin(t * 0.9) * 0.6).toFixed(2)}deg)`;
    spanduk.style.opacity = t >= C.bentang ? 1 : 0;
    // tepi kain bergelombang
    const N = 24, pts = [];
    for (let i = 0; i <= N; i++) { const x = (i / N) * 100; pts.push(`${x}% ${(2 + Math.sin(i * 0.9 + t * 3) * 1.6).toFixed(2)}%`); }
    for (let i = N; i >= 0; i--) { const x = (i / N) * 100; pts.push(`${x}% ${(98 + Math.sin(i * 0.9 + t * 3 + 1.2) * 1.6).toFixed(2)}%`); }
    spanduk.style.clipPath = `polygon(${pts.join(',')})`;
    huruf.forEach((l, i) => { l.style.transform = `translateY(${(Math.sin(i * 0.55 + t * 3) * 6).toFixed(1)}px) rotate(${(Math.cos(i * 0.55 + t * 3) * 2).toFixed(2)}deg)`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 100px "Lilita One"', '800 40px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      // tenda biru garis-garis + trotoar
      cx.fillStyle = '#1B3A8C'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.12)';
      for (let x = -200; x < W + 200; x += 160) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x + 80, 0); cx.lineTo(x + 40 + 80, H); cx.lineTo(x + 40, H); cx.fill(); }
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('wr', (root, v, sc, tm, T) => {
    ensure();
    if (v.bentang != null) C.bentang = sc.start + T(v.bentang, 0.1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.menu) {
      const MENU = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden', 'Pihak Ketiga', 'Transfer'];
      const papan = h(`<div class="wr-papan"><div class="ph">SEDIA</div>${MENU.map((m) => `<div class="pm"><span>${esc(m)}</span><i>✓</i></div>`).join('')}</div>`);
      root.appendChild(papan);
      const items = [...papan.querySelectorAll('.pm')].map((el, i) => ({ el, t: T(v.menu[i], 1 + i * 0.5) }));
      const buka = h('<div class="wr-buka">BUKA<br>24 JAM</div>');
      root.appendChild(buka);
      const tB = T(v.buka, 5);
      parts.push((lt) => {
        items.forEach((it) => { const k = P(lt, it.t, it.t + 0.35); tf(it.el, { x: (1 - E.outBack(k)) * -40, o: cl(k * 3) }); });
        const kb = P(lt, tB, tB + 0.5);
        tf(buka, { s: kb > 0 ? E.outBack(kb) : 0, r: -12 + Math.sin(lt * 2) * 3, o: cl(kb * 3) });
      });
    }
    if (v.bungkus != null) {
      const tG = T(v.bungkus, 1), tK = T(v.klik, 2.5), W0 = pick(760, 720);
      const tag = h('<div class="wr-bungkus"><span>BISA DIBUNGKUS</span></div>');
      root.appendChild(tag);
      const kartu = PD.layar(root, 'dashboard', { w: W0, potong: [303, 252, 300, 46], bar: false, kelas: 'wr-kartu' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(640, 1120) + 'px';
      const sorot = h('<div class="wr-sorot"></div>'); kartu.appendChild(sorot);
      parts.push((lt) => {
        const kg = P(lt, tG, tG + 0.3);
        tf(tag, { s: kg > 0 ? lerp(1.8, 1, E.outExpo(kg)) : 0, r: -6, o: kg > 0 ? 1 : 0 });
        const k = E.out3(P(lt, tG + 0.4, tG + 0.9)), tekan = Math.sin(Math.PI * P(lt, tK, tK + 0.25));
        tf(kartu, { y: (1 - k) * 60, o: k, s: 1 - tekan * 0.05 });
        sorot.style.opacity = P(lt, tK, tK + 0.15);
      });
    }
    if (v.teks) {
      const el = h(`<div class="wr-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, v.teksAt ? { dari: T(v.teksAt, 0) - 0.05 } : {});
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
