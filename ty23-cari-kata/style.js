// Gaya TY23 · CARI KATA: grid huruf di lapisan lintas scene; lima kata ditanam pada koordinat tetap, sisanya huruf hash.
// Kapsul (SVG rounded rect) digambar lewat stroke-dashoffset saat kata ditemukan; timer = fungsi waktu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const COLS = 12, ROWS = 9, CELL = pick(76, 84);
  const GX = (SW - COLS * CELL) / 2, GY = pick(150, 380);
  // kata: [teks, kolom awal, baris awal, dx, dy]
  const KATA = [['ROPA', 1, 1, 1, 0], ['DPIA', 9, 1, 0, 1], ['DSR', 4, 3, 1, 1], ['CONSENT', 2, 7, 1, 0], ['INSIDEN', 0, 1, 0, 1]];
  const C = { timer: 9e9, stop: 9e9, temu: [9e9, 9e9, 9e9, 9e9, 9e9], menu: 9e9, tutup: 9e9 };
  let lapis = null, grid = null, svg = null, kapsul = [], timer = null, skor = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ck-lapis');
    const huruf = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    KATA.forEach(([w, c0, r0, dx, dy]) => { [...w].forEach((ch, i) => { huruf[r0 + i * dy][c0 + i * dx] = ch; }); });
    const ABJ = 'ABCDEFGHIJKLMNOPRSTUVWY';
    grid = h(`<div class="ck-grid" style="left:${GX}px;top:${GY}px;width:${COLS * CELL}px;height:${ROWS * CELL}px"></div>`);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const ch = huruf[r][c] || ABJ[Math.floor(hash(r * 31 + c * 7 + 3) * ABJ.length)];
      grid.appendChild(h(`<span class="ck-h" style="left:${c * CELL}px;top:${r * CELL}px;width:${CELL}px;height:${CELL}px;font-size:${Math.round(CELL * 0.56)}px">${ch}</span>`));
    }
    lapis.appendChild(grid);
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ck-svg'); svg.setAttribute('width', COLS * CELL); svg.setAttribute('height', ROWS * CELL);
    svg.style.left = GX + 'px'; svg.style.top = GY + 'px';
    KATA.forEach(([w, c0, r0, dx, dy]) => {
      const n = w.length, x0 = (c0 + 0.5) * CELL, y0 = (r0 + 0.5) * CELL, x1 = (c0 + (n - 1) * dx + 0.5) * CELL, y1 = (r0 + (n - 1) * dy + 0.5) * CELL;
      const len = Math.hypot(x1 - x0, y1 - y0), ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, rw = len + CELL * 0.86, rh = CELL * 0.86;
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', -CELL * 0.43); rect.setAttribute('y', -rh / 2); rect.setAttribute('width', rw); rect.setAttribute('height', rh);
      rect.setAttribute('rx', rh / 2); rect.setAttribute('pathLength', '1');
      rect.setAttribute('transform', `translate(${x0} ${y0}) rotate(${ang.toFixed(2)})`);
      svg.appendChild(rect); kapsul.push(rect);
    });
    lapis.appendChild(svg);
    timer = h(`<div class="ck-timer" style="left:${GX}px;top:${GY - pick(96, 100)}px">⏱ 10,0</div>`);
    skor = h(`<div class="ck-skor" style="left:${GX + COLS * CELL}px;top:${GY - pick(96, 100)}px">0 / 5</div>`);
    lapis.appendChild(timer); lapis.appendChild(skor);
  }
  function gambar(t) {
    const berhenti = Math.min(t, C.stop), sisa = Math.max(0, 10 - (berhenti - C.timer));
    timer.textContent = t < C.timer ? '⏱ 10,0' : `⏱ ${sisa.toFixed(1).replace('.', ',')}`;
    timer.classList.toggle('merah', sisa < 3 && t >= C.timer);
    let n = 0;
    kapsul.forEach((r, i) => { const k = E.out3(P(t, C.temu[i], C.temu[i] + 0.5)); r.style.strokeDashoffset = (1 - k).toFixed(3); if (t >= C.temu[i]) n++; r.style.fillOpacity = (0.18 * k).toFixed(3); });
    skor.textContent = `${n} / 5`;
    const km = E.io3(P(t, C.menu, C.menu + 0.6));
    lapis.style.opacity = ((1 - km * 0.92) * (1 - P(t, C.tutup, C.tutup + 0.3))).toFixed(3);
    grid.style.transform = `scale(${lerp(1, 0.94, km).toFixed(3)})`;
  }

  KIT.style({
    fonts: ['700 60px "Chivo Mono"', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#DCE8F5'; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(11,27,77,.08)'; cx.lineWidth = 1;
      cx.beginPath(); for (let x = 0; x < W; x += 40) { cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); } for (let y = 0; y < H; y += 40) { cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); } cx.stroke();
    },
  });

  KIT.registerType('ck', (root, v, sc, tm, T) => {
    ensure();
    if (v.timer != null) C.timer = sc.start + T(v.timer, 2);
    if (v.temu) v.temu.forEach((c, i) => { C.temu[i] = sc.start + T(c, 1 + i); });
    if (v.stopAt != null) C.stop = sc.start + T(v.stopAt, 5);
    if (v.menu != null) C.menu = sc.start + T(v.menu, 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="ck-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.menu != null) {
      const tM = T(v.menu, 0.5), W0 = pick(400, 480);
      const kartu = PD.layar(root, 'dashboard', { w: W0, potong: [0, 78, 262, 400], judul: 'Menu Privasimu Nexus' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(120, 380) + 'px';
      const sorot = h('<div class="ck-sorot"></div>'); kartu.appendChild(sorot);
      parts.push((lt) => {
        const k = E.outBack(P(lt, tM + 0.3, tM + 0.9));
        tf(kartu, { s: 0.85 + 0.15 * cl(k), y: (1 - cl(k)) * 60, o: cl(k * 3) });
        const sh = kartu._h - 46, yy = 46 + (0.42 + 0.5 * (0.5 + 0.5 * Math.sin((lt - tM) * 1.6))) * sh * 0.9;
        sorot.style.top = yy.toFixed(0) + 'px'; sorot.style.opacity = P(lt, tM + 0.9, tM + 1.2);
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
