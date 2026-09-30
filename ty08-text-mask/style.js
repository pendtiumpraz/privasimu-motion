// Gaya TY08 · TEXT MASK: tiap scene punya "dunia dalam" (latar terang + kartu layar aplikasi asli) yang dipotong oleh
// clip-path berbentuk teks (SVG <clipPath><text>). Kamera = transform pada teks itu: dari kata utuh, masuk ke badan satu
// huruf sampai hurufnya menutupi seluruh layar (saat itu clip-path dilepas).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const NS = 'http://www.w3.org/2000/svg';
  let svg = null, ukur = null, no = 0;

  function defs() {
    if (svg) return svg;
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', SW); svg.setAttribute('height', SH);
    svg.setAttribute('style', 'position:absolute;left:0;top:0;width:0;height:0;overflow:hidden');
    document.body.appendChild(svg);
    ukur = document.createElement('canvas').getContext('2d');
    return svg;
  }

  KIT.style({
    fonts: ['900 200px Archivo', '700 60px Archivo'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      g.addColorStop(0, '#16224F'); g.addColorStop(1, '#060A1E');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('tk', (root, v, sc, tm, T) => {
    defs();
    const id = 'tk-clip-' + (++no);
    const n = v.kata.length, F = Math.round(Math.min(pick(560, 400), (SW - pick(260, 150)) / (n * 0.68)));
    const CX = SW / 2, CY = pick(470, 760), BY = CY + F * 0.36; // BY = garis dasar teks
    const cp = document.createElementNS(NS, 'clipPath');
    cp.setAttribute('id', id); cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
    // catatan: <clipPath> tidak boleh berisi <g>, jadi transform kamera dipasang langsung di <text>
    const mk = (parent, cls) => {
      const tx = document.createElementNS(NS, 'text');
      tx.setAttribute('x', CX); tx.setAttribute('y', BY); tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('font-family', 'Archivo'); tx.setAttribute('font-weight', '900'); tx.setAttribute('font-size', F);
      tx.setAttribute('letter-spacing', '-0.02em');
      if (cls) tx.setAttribute('class', cls);
      tx.textContent = v.kata; parent.appendChild(tx);
      return tx;
    };
    const gClip = mk(cp);
    svg.appendChild(cp);

    // dunia dalam: latar terang + kartu layar asli
    // dua salinan dunia dalam: satu dipotong huruf (kamera), satu utuh yang muncul lembut di ujung zoom
    // (glyph SVG berukuran > ± 16.000 px tidak dirender, jadi zoom dibatasi lalu disambung dengan salinan utuh)
    const penuh = h('<div class="tk-dalam tk-penuh"><div class="tk-isi"></div></div>');
    const dalam = h('<div class="tk-dalam"><div class="tk-isi"></div></div>');
    root.appendChild(penuh); root.appendChild(dalam);
    const isi = $('.tk-isi', dalam), isi2 = $('.tk-isi', penuh), pt = pick(v.potong.h, v.potong.v);
    const W0 = Math.round(Math.min(pick(1560, 1000), pick(700, 900) * pt[2] / pt[3]));
    const tengah = pick(SH * 0.42, SH * 0.4) - (v.lensa ? pick(70, 120) : 0);
    for (const wadah of [isi, isi2]) {
      const kartu = PD.layar(wadah, v.layar, { w: W0, potong: pt, judul: 'Privasimu Nexus · ' + v.judul });
      kartu.style.left = (SW - W0) / 2 + 'px';
      kartu.style.top = Math.round(tengah - kartu._h / 2) + 'px';
      if (v.lensa) { // potongan kecil yang diperbesar (mis. pil tenggat)
        const LW = pick(560, 620), lensa = PD.layar(wadah, v.layar, { w: LW, potong: v.lensa, bar: false, kelas: 'tk-lensa' });
        lensa.style.left = (SW - LW) / 2 + 'px';
        lensa.style.top = Math.round(tengah + kartu._h / 2 + pick(40, 60)) + 'px';
      }
    }
    // garis tepi huruf (hiasan), ikut kamera
    const tepi = document.createElementNS(NS, 'svg');
    tepi.setAttribute('class', 'tk-tepi'); tepi.setAttribute('data-bebas', ''); tepi.setAttribute('width', SW); tepi.setAttribute('height', SH);
    const gTepi = mk(tepi, 'garis');
    root.appendChild(tepi);

    const bawah = v.bawah ? h(`<div class="tk-bawah" style="top:${BY + F * 0.16}px">${esc(v.bawah)}</div>`) : null;
    if (bawah) root.appendChild(bawah);
    const pita = h(`<div class="tk-pita">${rich(v.teks)}</div>`);
    root.appendChild(pita);
    const tM = T(v.masuk, 1.5), ws = PD.kata(pita, sc, { dari: tM - 0.1 });
    const tB = T(v.bawahAt, 0.8);
    let target = null;

    return (lt, d) => {
      if (!target) {
        ukur.font = `900 ${F}px Archivo`;
        const lsp = -0.02 * F, w = (s) => ukur.measureText(s).width + lsp * s.length;
        const kiri = CX - w(v.kata) / 2, [i, fx0, fy] = v.ke;
        // titik tujuan = tengah batang tegak huruf (dipindai dari raster glyph supaya persis, bukan kira-kira)
        let fx = fx0;
        const c = document.createElement('canvas'); c.width = 240; c.height = 240;
        const g = c.getContext('2d'); g.font = '900 200px Archivo'; g.textBaseline = 'alphabetic'; g.fillStyle = '#000';
        g.fillText(v.kata[i], 10, 200);
        const adv = g.measureText(v.kata[i]).width, row = g.getImageData(0, 200 - Math.round(200 * 0.72 * (1 - fy)), 240, 1).data;
        let a = -1, b = -1;
        for (let x = 0; x < 240; x++) { const on = row[x * 4 + 3] > 128; if (on && a < 0) a = x; if (!on && a >= 0 && b < 0) { b = x; break; } }
        if (a >= 0) fx = ((a + (b < 0 ? 240 : b)) / 2 - 10) / adv;
        target = { x: kiri + w(v.kata.slice(0, i)) + fx * w(v.kata[i]), y: BY - F * 0.72 * (1 - fy) };
      }
      const k = E.io3(P(lt, tM, tM + 1.15)), S = Math.exp(Math.log(11500 / F) * k); // ukuran glyph efektif dijaga < 11.500 px
      const px = lerp(target.x, CX, k), py = lerp(target.y, SH / 2, k);
      // kata masuk dengan sedikit hentakan di awal scene
      const s0 = lerp(1.07, 1, E.outExpo(P(lt, 0, 0.45))), ss = S * s0;
      const m = `translate(${(px - ss * target.x).toFixed(2)} ${(py - ss * target.y).toFixed(2)}) scale(${ss.toFixed(4)})`;
      gClip.setAttribute('transform', m); gTepi.setAttribute('transform', m);
      dalam.style.clipPath = `url(#${id})`;
      dalam.style.opacity = k >= 0.999 ? 0 : 1;
      penuh.style.opacity = P(k, 0.86, 1).toFixed(3);
      tepi.style.opacity = (1 - P(lt, tM + 0.1, tM + 0.7)).toFixed(3);
      // isi bergeser pelan supaya potongan layar di dalam huruf terasa hidup
      const geser = (1 - k) * Math.sin(lt * 0.9) * pick(26, 14);
      isi.style.transform = isi2.style.transform = `translate(${geser.toFixed(1)}px, 0) scale(${lerp(1.12, 1, k).toFixed(4)})`;
      if (bawah) tf(bawah, { y: (1 - E.out3(P(lt, tB, tB + 0.4))) * 24, o: P(lt, tB, tB + 0.3) * (1 - P(lt, tM, tM + 0.3)) });
      PD.tampil(ws, lt, 'pudar');
      tf(pita, { y: (1 - E.out3(P(lt, tM + 0.55, tM + 1.0))) * 40, o: P(lt, tM + 0.55, tM + 0.9) });
      root.style.opacity = 1 - P(lt, d - 0.16, d - 0.01) * (v.akhir ? 0 : 1);
    };
  });
})();
