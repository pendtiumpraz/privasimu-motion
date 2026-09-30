// Gaya GB27 · LABIRIN: labirin dibangkitkan deterministik (DFS dengan LCG berbenih) → dinding SVG. "Walk" = urutan sel
// yang dilalui DFS termasuk mundur (jalan buntu alami). Pencari menyusuri walk dengan kecepatan tetap sejak "mulai";
// tiga jalan buntu pertama dilabeli pada cue "buntu". Pada "lurus": dinding memudar, jalur BFS terpendek tergambar
// dan pencari meluncur ke dokumen.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const COLS = V ? 9 : 16, ROWS = V ? 10 : 7, CELL = V ? 100 : 70;
  const OX = (SW - COLS * CELL) / 2, OY = pick(50, 210);
  const LABEL = ['Folder tim', 'Email 2023', 'Laptop lama'];
  const C = { mulai: 9e9, buntu: [9e9, 9e9, 9e9], lurus: 9e9, tutup: 9e9 };
  let lapis = null, svg = null, jejak = null, kepala = null, solusi = null, dinding = null, buntuEl = [], walk = [], sol = [], deadIdx = [], goal = null;

  function bangun() {
    let s = 20260930; const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
    const N = COLS * ROWS, W = Array.from({ length: N }, () => ({ n: 1, e: 1, s: 1, w: 1 })), seen = new Uint8Array(N);
    const id = (x, y) => y * COLS + x;
    const stack = [0]; seen[0] = 1; walk = [0];
    while (stack.length) {
      const cur = stack[stack.length - 1], x = cur % COLS, y = (cur / COLS) | 0;
      const nb = [];
      if (y > 0 && !seen[id(x, y - 1)]) nb.push([id(x, y - 1), 'n', 's']);
      if (x < COLS - 1 && !seen[id(x + 1, y)]) nb.push([id(x + 1, y), 'e', 'w']);
      if (y < ROWS - 1 && !seen[id(x, y + 1)]) nb.push([id(x, y + 1), 's', 'n']);
      if (x > 0 && !seen[id(x - 1, y)]) nb.push([id(x - 1, y), 'w', 'e']);
      if (nb.length) { const [nx, a, b] = nb[(rnd() * nb.length) | 0]; W[cur][a] = 0; W[nx][b] = 0; seen[nx] = 1; stack.push(nx); walk.push(nx); }
      else { stack.pop(); if (stack.length) walk.push(stack[stack.length - 1]); }
    }
    goal = id(COLS - 1, ROWS - 1);
    // jalan buntu: sel di walk yang langkah berikutnya mundur ke sel sebelumnya
    deadIdx = []; for (let i = 1; i < walk.length - 1; i++) if (walk[i + 1] === walk[i - 1] && walk[i] !== goal) deadIdx.push(i);
    // BFS jalur terpendek 0 → goal
    const prev = new Int32Array(N).fill(-1), q = [0]; prev[0] = 0;
    while (q.length) { const c = q.shift(); if (c === goal) break; const x = c % COLS, y = (c / COLS) | 0, w = W[c];
      const cand = [[!w.n, id(x, y - 1)], [!w.e, id(x + 1, y)], [!w.s, id(x, y + 1)], [!w.w, id(x - 1, y)]];
      for (const [ok, n] of cand) if (ok && prev[n] < 0) { prev[n] = c; q.push(n); } }
    sol = []; for (let c = goal; c !== 0; c = prev[c]) sol.unshift(c); sol.unshift(0);
    // dinding → path d
    let d = `M${OX} ${OY} H${OX + COLS * CELL} V${OY + ROWS * CELL} H${OX} Z`;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const w = W[id(x, y)], X = OX + x * CELL, Y = OY + y * CELL; if (w.e && x < COLS - 1) d += ` M${X + CELL} ${Y} V${Y + CELL}`; if (w.s && y < ROWS - 1) d += ` M${X} ${Y + CELL} H${X + CELL}`; }
    return d;
  }
  const pusat = (c) => [OX + (c % COLS) * CELL + CELL / 2, OY + ((c / COLS) | 0) * CELL + CELL / 2];
  const pts = (arr) => arr.map((c) => pusat(c).join(',')).join(' ');
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lb-lapis');
    const d = bangun();
    const [gx, gy] = pusat(goal), [sx, sy] = pusat(0);
    svg = h(`<svg class="lb-svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}">
      <path class="lb-dinding" d="${d}"/>
      <polyline class="lb-solusi" points="${pts(sol)}"/>
      <polyline class="lb-jejak" points="${pts(walk)}"/>
      <g class="lb-awal" transform="translate(${sx},${sy})"><circle r="${CELL * 0.2}"/><text y="${-CELL * 0.62}">MULAI</text></g>
      <g class="lb-dok" transform="translate(${gx},${gy})"><rect x="${-CELL * 0.2}" y="${-CELL * 0.26}" width="${CELL * 0.4}" height="${CELL * 0.52}" rx="4"/><path d="M${-CELL * 0.1} ${-CELL * 0.08} h${CELL * 0.2} M${-CELL * 0.1} ${0} h${CELL * 0.2} M${-CELL * 0.1} ${CELL * 0.08} h${CELL * 0.14}"/><text y="${CELL * 0.62}">BUKTI</text></g>
      <circle class="lb-kepala" r="${CELL * 0.17}"/>
    </svg>`);
    lapis.appendChild(svg);
    dinding = svg.querySelector('.lb-dinding'); jejak = svg.querySelector('.lb-jejak'); solusi = svg.querySelector('.lb-solusi'); kepala = svg.querySelector('.lb-kepala');
    buntuEl = LABEL.map((l, i) => { const c = walk[deadIdx[Math.min(deadIdx.length - 1, i)]], [x, y] = pusat(c); const el = h(`<div class="lb-buntu" style="left:${x}px;top:${y}px"><b>✕</b><span>${l}</span></div>`); lapis.appendChild(el); return el; });
  }
  const jarak = (arr) => (arr.length - 1) * CELL;
  function gambar(t) {
    const kl = E.io3(P(t, C.lurus, C.lurus + 0.9));
    const speed = 3.2; // sel per detik
    const prog = cl((t - C.mulai) * speed / (walk.length - 1), 0, 1) * (walk.length - 1);
    const Ltot = jarak(walk);
    jejak.style.strokeDasharray = `${Ltot}`; jejak.style.strokeDashoffset = `${Math.max(0, Ltot - prog * CELL)}`;
    jejak.style.opacity = (t >= C.mulai ? 1 : 0) * (1 - kl * 0.85);
    let hx, hy;
    if (kl <= 0) { const i = Math.floor(prog), f = prog - i, a = pusat(walk[i]), b = pusat(walk[Math.min(walk.length - 1, i + 1)]); hx = lerp(a[0], b[0], f); hy = lerp(a[1], b[1], f); }
    else { const Ls = jarak(sol), p = kl * (sol.length - 1), i = Math.floor(p), f = p - i, a = pusat(sol[i]), b = pusat(sol[Math.min(sol.length - 1, i + 1)]); hx = lerp(a[0], b[0], f); hy = lerp(a[1], b[1], f); solusi.style.strokeDasharray = `${Ls}`; solusi.style.strokeDashoffset = `${Ls * (1 - kl)}`; }
    kepala.setAttribute('cx', hx.toFixed(1)); kepala.setAttribute('cy', hy.toFixed(1));
    kepala.style.opacity = t >= C.mulai ? 1 : 0;
    solusi.style.opacity = kl > 0 ? 1 : 0;
    dinding.style.opacity = (1 - kl * 0.88).toFixed(3);
    buntuEl.forEach((el, i) => { const k = P(t, C.buntu[i], C.buntu[i] + 0.2), kedip = t >= C.buntu[i] && t < C.buntu[i] + 0.9 && Math.floor((t - C.buntu[i]) * 8) % 2 === 0; el.style.opacity = (k * (1 - kl)).toFixed(3); el.classList.toggle('kedip', kedip); el.style.transform = `translate(-50%, -50%) scale(${lerp(1.6, 1, E.out3(k)).toFixed(3)})`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Inter', '700 60px "Space Grotesk"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0F1B33'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.035)';
      for (let x = 0; x < W; x += 30) for (let y = 0; y < H; y += 30) cx.fillRect(x, y, 2, 2);
    },
  });

  KIT.registerType('lb', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 1.2);
    if (v.buntu) v.buntu.forEach((c, i) => { C.buntu[i] = sc.start + T(c, 0.5 + i * 1.3); });
    if (v.lurus != null) C.lurus = sc.start + T(v.lurus, 0.3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="lb-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(720, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(540, 700)}px`;
      const t0 = T(L.at, 2.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
