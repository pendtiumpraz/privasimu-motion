// Gaya TY45 · TES MATA: satu papan tes mata hidup di lapisan lintas scene. Penunjuk, kamera (zoom ke baris terkecil),
// dan perubahan ukuran huruf (semua baris jadi sama besar) dihitung dari waktu global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const K = pick(1, 1.24); // skala huruf papan per format
  const BARIS = [
    ['SAYA', 160, 0.16], ['SETUJU', 104, 0.18], ['DATA SAYA', 72, 0.18], ['BOLEH DIPAKAI', 49, 0.2], ['DAN DIBAGIKAN', 34, 0.2],
    ['KE PIHAK KETIGA', 23, 0.2], ['untuk pemasaran,', 14, 0.12], ['pemrofilan, dan tujuan lain', 14, 0.12],
  ];
  const N = BARIS.length, RATA = pick(34, 44); // ukuran huruf setelah dibuat terbaca
  const PW = pick(640, 840), PX = SW / 2, PY = pick(452, 700);
  const C = { turun: 9e9, zoom: 9e9, jelas: 9e9, layar: 9e9, tutup: 9e9 };
  let lapis = null, papan = null, rows = [], tunjuk = null, cek = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('tm-lapis');
    papan = h(`<div class="tm-papan" style="width:${PW}px;left:${PX - PW / 2}px">
      <div class="tm-kepala"><span>TES KETELITIAN MEMBACA</span><span>jarak baca: sejauh layar</span></div>
      ${BARIS.map(([t], i) => `<div class="tm-baris b${i}"><i>${i + 1}</i><span>${esc(t)}</span>${i === 3 ? '<u class="hijau"></u>' : i === 5 ? '<u class="merah"></u>' : ''}</div>`).join('')}
    </div>`);
    lapis.appendChild(papan);
    rows = [...papan.querySelectorAll('.tm-baris')].map((el, i) => ({ el, sp: $('span', el), f0: BARIS[i][1] * K, ls0: BARIS[i][2] }));
    tunjuk = h('<div class="tm-tunjuk"><b></b></div>');
    cek = h('<svg class="tm-cek" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46"/><path pathLength="1" d="M27 52 L44 69 L75 33"/></svg>');
    papan.appendChild(tunjuk); papan.appendChild(cek);
  }

  function gambar(t) {
    const kj = E.io3(P(t, C.jelas, C.jelas + 0.9));
    rows.forEach((r, i) => {
      r.sp.style.fontSize = lerp(r.f0, RATA, kj).toFixed(2) + 'px';
      r.sp.style.letterSpacing = lerp(r.ls0, 0.02, kj).toFixed(3) + 'em';
      const kabur = i >= N - 2 ? lerp(1.5, 0, P(t, C.zoom + 0.55, C.zoom + 1.5)) : 0;
      r.sp.style.filter = kabur > 0.05 ? `blur(${kabur.toFixed(2)}px)` : 'none';
      r.el.style.padding = `${lerp(pick(11, 14), pick(7, 9), kj).toFixed(1)}px 0`;
    });
    const ph = papan.offsetHeight;
    papan.style.top = PY - ph / 2 + 'px';
    // penunjuk: baris 1 → baris terbawah
    const kt = E.io3(P(t, C.turun, C.turun + 0.95));
    const y0 = rows[0].el.offsetTop + rows[0].el.offsetHeight / 2, y1 = rows[N - 1].el.offsetTop + rows[N - 1].el.offsetHeight / 2;
    const goyang = Math.sin(t * 9) * 3 * P(t, C.turun + 0.95, C.turun + 1.2) * (1 - P(t, C.zoom, C.zoom + 0.3));
    tunjuk.style.transform = `translate(${goyang.toFixed(1)}px, ${(lerp(y0, y1, kt) + goyang * 0.4).toFixed(1)}px)`;
    tunjuk.style.opacity = (1 - P(t, C.jelas, C.jelas + 0.3)).toFixed(3);
    const kc = P(t, C.jelas + 0.6, C.jelas + 1.0);
    tf(cek, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) });
    $('path', cek).style.strokeDashoffset = (1 - E.out3(P(t, C.jelas + 0.75, C.jelas + 1.1))).toFixed(3);
    // kamera: mendekat ke dua baris terkecil, lalu mundur; setelah itu papan bergeser memberi tempat untuk layar aplikasi
    const kz = E.io3(P(t, C.zoom, C.zoom + 1.2)) * (1 - E.io3(P(t, C.jelas - 0.15, C.jelas + 0.75)));
    const fy = (rows[N - 2].el.offsetTop + rows[N - 1].el.offsetTop + rows[N - 1].el.offsetHeight) / 2 - ph / 2; // fokus relatif pusat papan
    const z = lerp(1, pick(4.6, 3.6), kz);
    const kl = E.io3(P(t, C.layar, C.layar + 0.8));
    const gx = lerp(0, pick(-570, 0), kl), gy = lerp(0, pick(-30, -280), kl), gs = lerp(1, pick(0.86, 0.72), kl);
    papan.toggleAttribute('data-bebas', kz > 0.02); // saat kamera mendekat, bagian atas papan memang keluar layar
    papan.style.transformOrigin = '50% 50%';
    papan.style.transform = `translate(${gx.toFixed(1)}px, ${(gy - fy * z * kz + kz * pick(40, 0)).toFixed(1)}px) scale(${(z * gs).toFixed(4)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 100px "Roboto Slab"', '700 100px "Roboto Slab"', '500 100px "Roboto Slab"'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#DDEEE7'); g.addColorStop(0.72, '#CFE5DC'); g.addColorStop(0.721, '#B9D3C9'); g.addColorStop(1, '#A9C6BB');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      const x = W * (0.5 + 0.06 * Math.sin(t * 0.3)), r = cx.createRadialGradient(x, H * 0.3, 0, x, H * 0.3, Math.max(W, H) * 0.7);
      r.addColorStop(0, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = r; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('tm', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['turun', 'zoom', 'jelas', 'layar']) if (v[k] != null) C[k] = sc.start + T(v[k], 0);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const pita = h(`<div class="tm-pita"><div class="a">${rich(v.teks)}</div>${v.teks2 ? `<div class="b">${rich(v.teks2)}</div>` : ''}</div>`);
      root.appendChild(pita);
      const a = $('.a', pita), b = $('.b', pita), wa = PD.kata(a, sc), t2 = v.teks2 ? T(v.teks2At, 3) : 9e9;
      const wb = b ? PD.kata(b, sc, { dari: t2 - 0.05 }) : [];
      parts.push((lt, d) => {
        PD.tampil(wa, lt, v.karaoke ? 'karaoke' : 'pudar'); PD.tampil(wb, lt, 'pudar');
        const k2 = P(lt, t2 - 0.35, t2 - 0.05);
        a.style.display = k2 >= 1 ? 'none' : 'block';
        a.style.opacity = 1 - k2;
        if (b) b.style.display = k2 >= 1 ? 'block' : 'none';
        const masuk = v.karaoke ? 1 : P(lt, 0.02, 0.3);
        tf(pita, { y: v.karaoke ? 0 : (1 - E.out3(P(lt, 0, 0.4))) * 30, o: masuk * (1 - P(lt, d - 0.25, d - 0.02)) });
      });
    }
    if (v.layar != null) {
      const tL = T(v.layar, 3), W0 = pick(1060, 940);
      const kartu = PD.layar(root, 'inclusive-privacy', { w: W0, potong: pick([270, 55, 960, 235], [270, 55, 720, 235]), judul: 'Privasimu Nexus · Inclusive Privacy' });
      kartu.style.left = pick(780, (SW - W0) / 2) + 'px'; kartu.style.top = pick(270, 730) + 'px';
      const cat = h(`<div class="tm-cat">${esc(v.catatan || '')}</div>`);
      root.appendChild(cat);
      parts.push((lt) => {
        const k = E.out3(P(lt, tL, tL + 0.8));
        tf(kartu, { x: (1 - k) * pick(700, 0), y: (1 - k) * pick(0, 600), o: cl(k * 3), r: (1 - k) * 2 });
        tf(cat, { o: P(lt, tL + 0.6, tL + 1.1) });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
