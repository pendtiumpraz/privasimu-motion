// Gaya PF34 · ULAR TANGGA: papan 8×8 (nomor bolak-balik), ular = path SVG berkelok, tangga = dua rel + anak tangga.
// Gerak bidak = daftar segmen [t0, dur, jenis, dari, ke] yang diisi dari cue; posisi pada waktu t = segmen aktif
// (lompat per kotak dengan busur / meluncur sepanjang path ular / memanjat tangga). Konfeti = partikel deterministik.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const N = 8, CELL = pick(100, 118), BX = pick(150, (SW - 8 * 118) / 2), BY = pick(SH - 60 - 8 * 100, 400);
  const ULAR = [{ dari: 47, ke: 12, label: 'lupa mencatat pihak ketiga' }, { dari: 58, ke: 30, label: 'insiden tak dilapor 3×24 jam' }];
  const TANGGA = [{ dari: 14, ke: 35, label: 'RoPA' }, { dari: 38, ke: 51, label: 'DPIA' }, { dari: 30, ke: 64, label: 'PRIVASIMU NEXUS', emas: true }];
  const C = { dadu: [9e9, 3], nexus: 9e9, konfeti: 9e9, tutup: 9e9 };
  const SEG = []; // {t0, dur, jenis, dari, ke, idx}
  let lapis = null, svg = null, bidak = null, dadu = null, ularPath = [], tanggaG = [], konf = [], skorNo = null, skorEv = null;

  function pusat(n) { // nomor kotak 1..64 → titik tengah (bolak-balik dari kiri bawah)
    const i = n - 1, row = Math.floor(i / N), col = row % 2 ? N - 1 - (i % N) : i % N;
    return [BX + col * CELL + CELL / 2, BY + (N - 1 - row) * CELL + CELL / 2];
  }
  function ularD(a, b) { const [x1, y1] = pusat(a), [x2, y2] = pusat(b), mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = (y2 - y1) * 0.35, dy = (x1 - x2) * 0.35; return `M${x1} ${y1} C${x1 + dx} ${y1 + dy}, ${mx - dx} ${my - dy}, ${mx} ${my} S${x2 - dx} ${y2 - dy}, ${x2} ${y2}`; }
  function tanggaSvg(a, b, emas) {
    const [x1, y1] = pusat(a), [x2, y2] = pusat(b), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy * 22, ny = ux * 22, n = Math.max(3, Math.round(L / 46));
    let d = `M${x1 + nx} ${y1 + ny} L${x2 + nx} ${y2 + ny} M${x1 - nx} ${y1 - ny} L${x2 - nx} ${y2 - ny}`;
    for (let i = 1; i < n; i++) { const k = i / n, px = x1 + (x2 - x1) * k, py = y1 + (y2 - y1) * k; d += ` M${px + nx} ${py + ny} L${px - nx} ${py - ny}`; }
    return `<path class="tg ${emas ? 'emas' : ''}" d="${d}"/>`;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ut-lapis');
    const papan = h(`<div class="ut-papan" style="left:${BX}px;top:${BY}px;width:${N * CELL}px;height:${N * CELL}px">${Array.from({ length: 64 }, (_, i) => { const n = i + 1, [x, y] = pusat(n); return `<div class="ut-kotak k${n % 2 ? 'a' : 'b'} ${n === 64 ? 'akhir' : ''}" style="left:${x - BX - CELL / 2}px;top:${y - BY - CELL / 2}px;width:${CELL}px;height:${CELL}px"><span>${n === 64 ? 'PATUH' : n}</span></div>`; }).join('')}</div>`);
    lapis.appendChild(papan);
    svg = h(`<svg class="ut-svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}">${ULAR.map((u, i) => `<g class="ular u${i}"><path class="badan" d="${ularD(u.dari, u.ke)}"/><circle class="kepala" cx="${pusat(u.dari)[0]}" cy="${pusat(u.dari)[1]}" r="20"/></g>`).join('')}${TANGGA.map((t, i) => `<g class="tangga t${i}">${tanggaSvg(t.dari, t.ke, t.emas)}</g>`).join('')}</svg>`);
    lapis.appendChild(svg);
    ularPath = [...svg.querySelectorAll('.ular .badan')];
    tanggaG = [...svg.querySelectorAll('.tangga')];
    // label ular & tangga
    ULAR.forEach((u, i) => { const [x, y] = pusat(u.dari); lapis.appendChild(h(`<div class="ut-label merah" style="left:${x}px;top:${y - 44}px">${u.label}</div>`)); });
    TANGGA.forEach((t, i) => { const [x1, y1] = pusat(t.dari), [x2, y2] = pusat(t.ke); lapis.appendChild(h(`<div class="ut-label ${t.emas ? 'emas' : 'hijau'} lt${i}" style="left:${(x1 + x2) / 2 + (i === 2 ? 0 : 60)}px;top:${(y1 + y2) / 2}px">${t.label}</div>`)); });
    bidak = h('<div class="ut-bidak"><span>DPO</span></div>'); lapis.appendChild(bidak);
    const skor = h('<div class="ut-skor"><div class="sk-l">KOTAK</div><div class="sk-no">44</div><div class="sk-ev">giliran DPO</div></div>'); lapis.appendChild(skor); skorNo = skor.querySelector('.sk-no'); skorEv = skor.querySelector('.sk-ev');
    dadu = h('<div class="ut-dadu">3</div>'); skor.appendChild(dadu);
    konf = Array.from({ length: 40 }, (_, i) => { const el = h(`<i class="ut-konf" style="background:${['#FF6B6B', '#FFD166', '#06D6A0', '#4D96FF', '#C77DFF'][i % 5]}"></i>`); lapis.appendChild(el); return el; });
  }
  let evAktif = null, kotakKini = 44;
  function posisi(t) { // posisi bidak (x,y) & apakah sedang bergerak
    let cur = 44, pos = null; evAktif = null;
    const segs = SEG.slice().sort((a, b) => a.t0 - b.t0);
    for (const s of segs) {
      if (t < s.t0) break;
      const k = cl((t - s.t0) / s.dur);
      if (s.jenis === 'lompat') {
        const n = Math.abs(s.ke - s.dari), step = k * n, i = Math.floor(step), f = step - i, a = pusat(s.dari + i), b = pusat(Math.min(s.ke, s.dari + i + 1));
        pos = [lerp(a[0], b[0], f), lerp(a[1], b[1], f) - Math.sin(f * Math.PI) * 46, k < 1];
      } else if (s.jenis === 'ular') {
        const p = ularPath[s.idx], L = p.getTotalLength(), pt = p.getPointAtLength(L * E.io3(k)); pos = [pt.x, pt.y, k < 1];
      } else { const a = pusat(s.dari), b = pusat(s.ke), e = E.io3(k); pos = [lerp(a[0], b[0], e), lerp(a[1], b[1], e) - Math.sin(e * Math.PI) * 10, k < 1]; }
      cur = s.ke; evAktif = s; kotakKini = k < 1 && s.jenis === 'lompat' ? s.dari + Math.floor(k * Math.abs(s.ke - s.dari)) : s.ke;
    }
    if (!pos) { const [x, y] = pusat(cur); pos = [x, y, false]; kotakKini = cur; }
    return pos;
  }
  function gambar(t) {
    const [x, y, gerak] = posisi(t);
    bidak.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${gerak ? 1.08 : 1})`;
    skorNo.textContent = kotakKini === 64 ? 'PATUH' : String(kotakKini);
    skorNo.classList.toggle('kecil', kotakKini === 64);
    const ev = !evAktif ? 'giliran DPO' : evAktif.jenis === 'ular' ? `ULAR ↓ ${ULAR[evAktif.idx].label}` : evAktif.jenis === 'tangga' ? `TANGGA ↑ ${TANGGA[evAktif.idx].label}` : `maju ${Math.abs(evAktif.ke - evAktif.dari)} kotak`;
    skorEv.textContent = ev; skorEv.classList.toggle('merah', ev.startsWith('ULAR')); skorEv.classList.toggle('hijau', ev.startsWith('TANGGA'));
    // dadu
    const [td, nilai] = C.dadu, kd = P(t, td, td + 0.6);
    dadu.style.opacity = t >= td && t < td + 2.4 ? 1 : 0;
    dadu.textContent = kd < 1 ? String(1 + Math.floor(hash(Math.floor(t * 20)) * 6)) : String(nilai);
    dadu.style.transform = `translate(-50%, -50%) rotate(${(kd < 1 ? (1 - kd) * 720 : 0).toFixed(0)}deg) scale(${lerp(1.4, 1, kd).toFixed(3)})`;
    // tangga Nexus tergambar
    const kn = P(t, C.nexus, C.nexus + 0.9);
    const tg = tanggaG[2].querySelector('path'); const L = 3000; tg.style.strokeDasharray = `${L}`; tg.style.strokeDashoffset = `${L * (1 - E.out3(kn))}`; tanggaG[2].style.opacity = kn > 0 ? 1 : 0;
    lapis.querySelector('.lt2').style.opacity = kn >= 1 ? 1 : 0;
    // konfeti
    const [fx, fy] = pusat(64);
    konf.forEach((el, i) => { const u = t - C.konfeti; if (u < 0 || u > 1.8) { el.style.opacity = 0; return; } const a = hash(i * 1.3) * Math.PI * 2, v = 200 + hash(i * 2.1) * 260; el.style.opacity = (1 - P(u, 1.1, 1.8)).toFixed(3); el.style.transform = `translate(${(fx + Math.cos(a) * v * u).toFixed(1)}px, ${(fy + Math.sin(a) * v * u * 0.6 + 380 * u * u).toFixed(1)}px) rotate(${(u * 720 * (i % 2 ? 1 : -1)).toFixed(0)}deg)`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Luckiest Guy"', '800 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#F2E4CF'); g.addColorStop(1, '#D9C4A0');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(90,60,20,.06)'; for (let i = 0; i < 20; i++) cx.fillRect(0, (i / 20) * H + Math.sin(i * 1.3) * 5, W, 3);
    },
  });

  KIT.registerType('ut', (root, v, sc, tm, T) => {
    ensure();
    if (v.dadu) C.dadu = [sc.start + T(v.dadu[0], 0.3), v.dadu[1]];
    (v.lompat || []).forEach(([a, b, c]) => { SEG.push({ t0: sc.start + T(c, 1), dur: Math.abs(b - a) * 0.24, jenis: 'lompat', dari: a, ke: b }); });
    (v.ular || []).forEach(([i, c]) => { SEG.push({ t0: sc.start + T(c, 3), dur: 1.3, jenis: 'ular', dari: ULAR[i].dari, ke: ULAR[i].ke, idx: i }); });
    (v.tangga || []).forEach(([i, c]) => { SEG.push({ t0: sc.start + T(c, 1.5), dur: i === 2 ? 1.6 : 0.9, jenis: 'tangga', dari: TANGGA[i].dari, ke: TANGGA[i].ke, idx: i }); });
    if (v.nexus != null) C.nexus = sc.start + T(v.nexus, 0.5);
    if (v.konfeti != null) C.konfeti = sc.start + T(v.konfeti, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
