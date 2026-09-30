// Gaya TY31 · TEKS DI JALUR: spiral SVG (Archimedes) dengan textPath berisi kata data pribadi berulang; startOffset naik
// dari waktu (mengalir ke pusat). Setelah "keluar", baris RoPA muncul dari pusat dan spiral memudar.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const NS = 'http://www.w3.org/2000/svg';
  const CX = SW / 2, CY = pick(560, 860), R0 = pick(620, 500), PUTAR = 3.2;
  const C = { tekan: 9e9, alir: 9e9, cepat: 9e9, keluar: 9e9, tutup: 9e9 };
  let lapis = null, svg = null, tp = null, pathLen = 1, tombol = null, pusaran = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('jl-lapis');
    svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'jl-svg'); svg.setAttribute('data-bebas', ''); svg.setAttribute('width', SW); svg.setAttribute('height', SH);
    // spiral dari luar ke dalam (arah aliran = arah teks)
    let d = '';
    const N = 520;
    for (let i = 0; i <= N; i++) { const u = i / N, a = u * PUTAR * Math.PI * 2, r = R0 * (1 - u) + 30; d += (i ? ' L' : 'M') + (CX + Math.cos(a) * r).toFixed(1) + ' ' + (CY + Math.sin(a) * r * pick(0.78, 1)).toFixed(1); }
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('id', 'jl-path'); path.setAttribute('d', d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', 'rgba(127,178,255,.18)'); path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
    pathLen = path.getTotalLength ? 1 : 1;
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('class', 'jl-teks');
    tp = document.createElementNS(NS, 'textPath');
    tp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#jl-path'); tp.setAttribute('href', '#jl-path');
    tp.textContent = Array.from({ length: 14 }, () => 'nama  ·  email  ·  no. HP  ·  NIK  ·  alamat  ·  tanggal lahir  ·  ').join('');
    text.appendChild(tp); svg.appendChild(text);
    lapis.appendChild(svg);
    pusaran = h(`<div class="jl-pusaran" style="left:${CX}px;top:${CY}px"></div>`);
    lapis.appendChild(pusaran);
    tombol = h(`<div class="jl-tombol" style="left:${CX}px;top:${pick(150, 300)}px">KIRIM</div>`);
    lapis.appendChild(tombol);
  }
  function gambar(t) {
    if (svg && !svg._len) { const p = $('#jl-path', svg); svg._len = p.getTotalLength(); }
    const L = svg._len || 5000;
    // kemajuan aliran: pelan lalu makin cepat; textPath bergerak ke arah dalam = startOffset negatif bertambah
    const dt = Math.max(0, t - C.alir), cepat = Math.max(0, t - C.cepat);
    const jarak = dt * 140 + cepat * cepat * 90;
    tp.setAttribute('startOffset', (-(jarak % L)).toFixed(1));
    const kt = P(t, C.tekan, C.tekan + 0.25), tekan = Math.sin(Math.PI * kt);
    tombol.style.transform = `translate(-50%, -50%) scale(${(1 - tekan * 0.08).toFixed(3)})`;
    tombol.classList.toggle('on', t >= C.tekan + 0.12);
    const kk = E.io3(P(t, C.keluar, C.keluar + 0.8));
    svg.style.opacity = (t >= C.alir ? 1 : 0) * (1 - kk * 0.85);
    pusaran.style.transform = `translate(-50%, -50%) rotate(${(t * 90).toFixed(1)}deg) scale(${lerp(0.6, 1.2, cl(cepat / 3)) * (1 - kk * 0.5)})`;
    pusaran.style.opacity = (t >= C.alir ? 0.9 : 0.35).toFixed(2);
    tombol.style.opacity = 1 - P(t, C.keluar, C.keluar + 0.4);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Sora', '600 60px Sora'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, pick(560, 860), 0, W / 2, pick(560, 860), Math.max(W, H) * 0.7);
      g.addColorStop(0, '#0B1230'); g.addColorStop(1, '#03050F');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('jl', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['tekan', 'alir', 'cepat', 'keluar']) if (v[k] != null) C[k] = sc.start + T(v[k], 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="jl-kalimat">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.baris) {
      const tK = T(v.keluar, 1), W0 = pick(1100, 940);
      const kartu = h(`<div class="jl-ropa" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(260, 560)}px"><div class="jh">Catatan RoPA · ROPA-CS-2026-0xx <span>*isi ilustrasi</span></div>${v.baris.map(([k, val]) => `<div class="jr"><b>${esc(k)}</b><span>${esc(val)}</span></div>`).join('')}</div>`);
      root.appendChild(kartu);
      const rows = [...kartu.querySelectorAll('.jr')].map((el, i) => ({ el, t: T(v.baris[i][2], tK + 1 + i) }));
      const tS = T(v.simpan, tK + 4), LW = pick(560, 600);
      const toast = PD.layar(root, 'ropa-tersimpan', { w: LW, potong: [914, 14, 340, 58], bar: false, kelas: 'jl-toast' });
      toast.style.left = pick(SW - LW - 100, (SW - LW) / 2) + 'px'; toast.style.top = pick(70, 1290) + 'px';
      parts.push((lt) => {
        const k = E.outBack(P(lt, tK, tK + 0.7));
        tf(kartu, { s: 0.6 + 0.4 * cl(k), y: (1 - cl(k)) * pick(300, 300), o: cl(k * 3) });
        rows.forEach((r) => { const kr = E.out3(P(lt, r.t, r.t + 0.4)); tf(r.el, { x: (1 - kr) * -40, o: kr }); });
        const ks = P(lt, tS, tS + 0.5);
        tf(toast, { y: (1 - E.outBack(ks)) * -40, o: cl(ks * 3) });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
