// Gaya TY55 · TABEL PERIODIK: 12 kotak unsur di lapisan lintas scene; posisi grid ala tabel periodik. Kotak jatuh ke
// tempatnya (outBack) sejak "mulai"; menyala & membesar pada cue; reaksi Ro→Dp (panah + label); In bergetar (hash);
// pada "senyawa" 7 unsur terpilih meluncur ke baris rumus, sisanya memudar; lencana NEXUS pada "nexus".
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  // [lambang, nama, golongan, kolom, baris]
  const UNSUR = [
    ['Ro', 'RoPA', 'catatan', 0, 0], ['Pp', 'PPDP', 'kelola', 7, 0],
    ['Dp', 'DPIA', 'nilai', 0, 1], ['Ga', 'GAP', 'nilai', 1, 1], ['Ma', 'Maturity', 'nilai', 2, 1], ['Ds', 'DSR', 'hak', 5, 1], ['Cs', 'Consent', 'hak', 6, 1], ['In', 'Insiden', 'insiden', 7, 1],
    ['Pk', 'Pihak ketiga', 'pihak', 0, 2], ['Tr', 'Transfer', 'pihak', 1, 2], ['Tk', 'Telaah kontrak', 'pihak', 2, 2], ['Sm', 'Simulasi', 'insiden', 7, 2],
  ];
  const RUMUS = ['Ro', 'Dp', 'Ds', 'Cs', 'In', 'Pk', 'Tr'];
  const CW = pick(168, 118), GAP = pick(14, 10), COLS = 8, ROWS = 3;
  const GX = (SW - (COLS * CW + (COLS - 1) * GAP)) / 2, GY = pick(250, 560);
  const FY = pick(470, 800); // baris rumus
  const C = { mulai: 9e9, nyala: {}, reaksi: 9e9, picu: 9e9, reaktif: 9e9, senyawa: 9e9, nexus: 9e9, tutup: 9e9 };
  let lapis = null, sel = {}, tag = {}, panah = null, nexus = null, titik = [];

  const posGrid = (k, b) => [GX + k * (CW + GAP) + CW / 2, GY + b * (CW + GAP) + CW / 2];
  const posRumus = (i) => { const n = RUMUS.length, lebar = n * CW + (n - 1) * (V ? 16 : 34); return [SW / 2 - lebar / 2 + i * (CW + (V ? 16 : 34)) + CW / 2, FY]; };
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('tp-lapis');
    UNSUR.forEach(([lb, nm, gol], i) => {
      const el = h(`<div class="tp-sel g-${gol}" style="width:${CW}px;height:${CW}px"><i>${i + 1}</i><b>${lb}</b><span>${esc(nm)}</span></div>`);
      lapis.appendChild(el); sel[lb] = el;
    });
    tag.Ro = h('<div class="tp-tag merah">data spesifik → TINGGI</div>'); tag.Dp = h('<div class="tp-tag ungu" style="z-index:30">draf otomatis</div>'); tag.In = h('<div class="tp-tag merah">3×24 jam</div>');
    Object.values(tag).forEach((t) => lapis.appendChild(t));
    panah = h('<svg class="tp-panah" viewBox="0 0 200 40"><path d="M4 20 H176 M158 6 L180 20 L158 34"/></svg>'); lapis.appendChild(panah);
    for (let i = 0; i < RUMUS.length - 1; i++) { const d = h('<div class="tp-titik">·</div>'); lapis.appendChild(d); titik.push(d); }
    nexus = h(`<div class="tp-nexus"><span>→</span><div class="nx"><img src="${PD.LOGO}" alt=""><em>NEXUS</em></div></div>`); lapis.appendChild(nexus);
  }
  function gambar(t) {
    const ks = E.io3(P(t, C.senyawa, C.senyawa + 0.9));
    const getar = t >= C.reaktif && t < C.senyawa ? (hash(Math.floor(t * 40)) - 0.5) * 10 : 0;
    UNSUR.forEach(([lb, , gol, k, b], i) => {
      const el = sel[lb], [gx, gy] = posGrid(k, b);
      const pj = P(t, C.mulai + i * 0.07, C.mulai + i * 0.07 + 0.5), jatuh = pj > 0 ? E.outBack(pj) : 0;
      const ri = RUMUS.indexOf(lb);
      let x = gx, y = gy, sk = 1, op = pj > 0 ? 1 : 0;
      if (ri >= 0) { const [fx, fy] = posRumus(ri); x = lerp(gx, fx, ks); y = lerp(gy, fy, ks); }
      else op *= 1 - ks;
      const tn = C.nyala[lb] ?? 9e9, ny = P(t, tn, tn + 0.25) * (1 - P(t, tn + 1.6, tn + 2.2));
      sk *= 1 + ny * 0.22;
      const reaksi = lb === 'Ro' && t >= C.reaksi, picu = lb === 'Dp' && t >= C.picu, reaktif = lb === 'In' && t >= C.reaktif && t < C.senyawa;
      el.classList.toggle('nyala', ny > 0.5 || (reaksi && t < C.senyawa) || (picu && t < C.senyawa));
      el.classList.toggle('merah', (reaksi || reaktif) && t < C.senyawa);
      if (reaktif) { x += getar; y += getar * 0.6; sk *= 1 + 0.06 * hash(Math.floor(t * 30)); }
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translate(${x.toFixed(1)}px, ${(y - (1 - jatuh) * 320).toFixed(1)}px) translate(-50%, -50%) scale(${sk.toFixed(3)}) rotate(${((1 - jatuh) * -12).toFixed(1)}deg)`;
      el.style.zIndex = ny > 0 || reaksi || picu || reaktif ? 20 : 10;
    });
    // label & panah reaksi
    const [rx, ry] = posGrid(0, 0), [dx, dy] = posGrid(0, 1), [ix, iy] = posGrid(7, 1);
    const kr = P(t, C.reaksi, C.reaksi + 0.3) * (1 - ks), kp = P(t, C.picu, C.picu + 0.3) * (1 - ks), kk = P(t, C.reaktif, C.reaktif + 0.3) * (1 - ks);
    tag.Ro.style.opacity = kr.toFixed(3); tag.Ro.style.transform = `translate(${(rx + CW / 2 + 14).toFixed(0)}px, ${ry.toFixed(0)}px) translate(0, -50%) scale(${lerp(0.8, 1, kr).toFixed(3)})`;
    tag.Dp.style.opacity = kp.toFixed(3); tag.Dp.style.transform = V ? `translate(${(dx + CW / 2 + 10).toFixed(0)}px, ${(dy + CW / 2 - 6).toFixed(0)}px) translate(0, -100%) scale(${lerp(0.8, 1, kp).toFixed(3)})` : `translate(${(dx - CW / 2 - 14).toFixed(0)}px, ${dy.toFixed(0)}px) translate(-100%, -50%) scale(${lerp(0.8, 1, kp).toFixed(3)})`;
    tag.In.style.opacity = kk.toFixed(3); tag.In.style.transform = `translate(${(ix + getar).toFixed(0)}px, ${(iy + CW / 2 + 16).toFixed(0)}px) translate(-50%, 0) scale(${lerp(0.8, 1, kk).toFixed(3)})`;
    panah.style.opacity = kp.toFixed(3); panah.style.transform = `translate(${(rx - 6).toFixed(0)}px, ${((ry + dy) / 2).toFixed(0)}px) translate(-50%, -50%) rotate(90deg) scale(${(0.55 * lerp(0.6, 1, kp)).toFixed(3)})`;
    // titik pemisah rumus & lencana nexus
    titik.forEach((d, i) => { const [a] = posRumus(i), [b] = posRumus(i + 1); d.style.opacity = (ks >= 1 ? 1 : 0); d.style.transform = `translate(${((a + b) / 2).toFixed(0)}px, ${FY}px) translate(-50%, -50%)`; });
    const kn = P(t, C.nexus, C.nexus + 0.4), nyk = kn > 0 ? E.outBack(kn) : 0;
    nexus.style.opacity = kn > 0 ? 1 : 0;
    nexus.style.transform = `translate(${(SW / 2).toFixed(0)}px, ${(FY + CW / 2 + pick(150, 190)).toFixed(0)}px) translate(-50%, -50%) scale(${nyk.toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px "Space Grotesk"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0F172A'); g.addColorStop(1, '#1E293B');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(255,255,255,.05)'; cx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { cx.beginPath(); cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); cx.stroke(); }
      for (let y = 0; y < H; y += 40) { cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
    },
  });

  KIT.registerType('tp', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0);
    (v.nyala || []).forEach(([lb, c], i) => { C.nyala[lb] = sc.start + T(c, 0.8 + i * 0.7); });
    if (v.reaksi != null) C.reaksi = sc.start + T(v.reaksi, 1.2);
    if (v.picu != null) C.picu = sc.start + T(v.picu, 2.6);
    if (v.reaktif != null) C.reaktif = sc.start + T(v.reaktif, 4);
    if (v.senyawa != null) C.senyawa = sc.start + T(v.senyawa, 1);
    if (v.nexus != null) C.nexus = sc.start + T(v.nexus, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="tp-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
