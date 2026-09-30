// Gaya TY51 · ZOOM TANPA AKHIR: tiap tingkat = layar penuh. Titik huruf i (huruf sasaran ditulis "ı" tanpa titik) diganti
// wadah bundar berisi tingkat berikutnya yang diperkecil dengan faktor r. Kamera membesarkan tingkat luar sampai wadah
// bundar itu memenuhi layar; lalu tingkat dalam menjadi tingkat luar (hanya dua tingkat yang dirakit pada satu waktu,
// supaya skala tetap kecil dan glyph tidak melebihi batas render).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const F = pick(200, 150); // ukuran huruf baris sasaran
  const DOT = { dy: 0.2, d: 0.22 }; // pusat titik i: dy × F dari atas kotak baris; diameter d × F
  // Tingkat: { bg, ink, baris: [[teks, kelas]], sasaran: 'kata dengan ı sebagai huruf sasaran' }
  const LEVEL = [
    { bg: '#0B1B4D', ink: '#FFFFFF', acc: '#FFD34E', baris: [['Di dalam', 'k'], ['titik huruf ı', 'b']] },
    { bg: '#2F6BFF', ink: '#FFFFFF', acc: '#FFD34E', baris: [['RoPA mencatat kegiatannya.', 'k'], ['risiko tinggı', 'b']] },
    { bg: '#6D4CFF', ink: '#FFFFFF', acc: '#FFD34E', baris: [['draf DPIA', 'k'], ['dibuat otomatıs', 'b']] },
    { bg: '#F4F0E6', ink: '#0B1B4D', acc: '#2F6BFF', baris: [['rencana penanganan', 'k'], ['risıko', 'b']] },
    { bg: '#0B1B4D', ink: '#FFFFFF', acc: '#FFD34E', logo: true },
  ];
  const DW = Math.max(SW, SH) * 1.5, DH = DW; // kotak wadah titik: persegi (lingkaran) lebih besar dari layar supaya sudut tertutup
  let lapis = null, rakit = -1, luar = null, dalam = null, dot = null, pusat = null, ratio = null;

  function buatTingkat(n) {
    const L = LEVEL[n];
    const el = h(`<div class="zi-lv" style="background:${L.bg};color:${L.ink};--acc:${L.acc}"></div>`);
    if (L.logo) el.appendChild(h(`<div class="zi-logo"><img src="${PD.LOGO}" alt=""><span>NEXUS</span></div>`));
    else {
      const box = h('<div class="zi-teks"></div>');
      for (const [t, k] of L.baris) box.appendChild(h(`<div class="zi-b ${k}" style="${k === 'b' ? `font-size:${F}px` : ''}">${esc(t).replace('ı', '<span class="zi-i">ı</span>')}</div>`));
      el.appendChild(box);
    }
    return el;
  }
  // rakit pasangan (tingkat n luar, n+1 di dalam titik i-nya)
  function siapkan(n) {
    if (rakit === n) return;
    rakit = n;
    lapis.innerHTML = '';
    luar = buatTingkat(n);
    lapis.appendChild(luar);
    const i = $('.zi-i', luar);
    if (i && n + 1 < LEVEL.length) {
      const bx = luar.querySelector('.zi-teks');
      // posisi titik i: tengah glyph ı, sedikit di atas kotak barisnya
      const b = i.parentElement;
      pusat = { x: bx.offsetLeft + b.offsetLeft + i.offsetLeft + i.offsetWidth / 2, y: bx.offsetTop + b.offsetTop + DOT.dy * F };
      ratio = (DOT.d * F) / DW;
      dot = h(`<div class="zi-dot" style="width:${DW}px;height:${DH}px;left:${pusat.x - DW / 2}px;top:${pusat.y - DH / 2}px;transform:scale(${ratio.toFixed(6)});background:${LEVEL[n + 1].bg}"></div>`);
      dalam = buatTingkat(n + 1);
      dalam.style.left = (DW - SW) / 2 + 'px'; dalam.style.top = (DH - SH) / 2 + 'px';
      dot.appendChild(dalam);
      luar.appendChild(dot);
    } else { pusat = null; dot = null; dalam = null; }
  }
  // kamera: skala S tentang pusat titik, dan pusat titik digeser ke tengah layar
  function kamera(k) {
    if (!pusat) { luar.style.transform = ''; return; }
    const S = Math.pow(1 / ratio, k), cx = lerp(pusat.x, SW / 2, k), cy = lerp(pusat.y, SH / 2, k);
    luar.style.transform = `translate(${(cx - S * pusat.x).toFixed(3)}px, ${(cy - S * pusat.y).toFixed(3)}px) scale(${S.toFixed(6)})`;
    // saat sudah dekat, teks tingkat luar (glyph raksasa) disembunyikan; latar & titik tetap
    const tk = luar.querySelector('.zi-teks');
    if (tk) tk.style.visibility = S > 40 ? 'hidden' : 'visible';
    luar.toggleAttribute('data-bebas', S > 1.05); // teks luar memang keluar layar saat kamera masuk
  }

  KIT.style({
    fonts: ['700 100px Fraunces', '400 60px Fraunces', '900 100px Fraunces'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#0B1B4D'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('zi', (root, v, sc, tm, T) => {
    if (!lapis) lapis = PD.lapis('zi-lapis');
    const n = v.tingkat, tM = v.masuk != null ? T(v.masuk, 2) : null;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="zi-sub">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, { dari: T(v.teksAt, 1) - 0.05 });
      parts.push((lt) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, tM + 0.5, tM + 0.9); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => {
      const k = tM == null ? 0 : E.io3(P(lt, tM, tM + 1.3));
      if (k >= 1 && n + 1 < LEVEL.length) { siapkan(n + 1); kamera(0); } else { siapkan(n); kamera(k); }
      parts.forEach((f) => f(lt, d));
    };
  });
})();
