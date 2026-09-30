// Gaya TY33 · ANAGRAM: empat kartu huruf hidup di satu lapisan (di bawah semua scene) dan posisinya dihitung dari waktu
// global, jadi perpindahan antarscene mulus: NAMA → AMAN → berhamburan → rapi → jadi kepala di atas layar RoPA.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const S = pick(340, 226), GAP = pick(36, 22), CX = SW / 2, CY = pick(440, 840);
  const slotX = (i) => CX + (i - 1.5) * (S + GAP);
  const HURUF = ['N', 'A', 'M', 'A'], WARNA = ['n', 'b', 'u', 'k'];
  const AMAN = [3, 0, 1, 2]; // slot tiap kartu saat membentuk AMAN
  const ACAK = pick([[-1.55, -0.3, -17], [0.55, 0.16, 13], [-0.5, 0.2, -8], [1.6, -0.34, 21]], [[-1.2, -0.95, -17], [0.35, 0.12, 13], [-0.85, 0.1, -8], [1.05, -0.9, 21]]); // (dx, dy) × S dari pusat + rotasi
  const HS = pick(0.3, 0.42), HY = pick(112, 290), HG = pick(14, 12);
  const C = { tukar: 9e9, hitung: 9e9, acak: 9e9, rapi: 9e9, kepala: 9e9, tutup: 9e9 };
  let dunia = null, kartu = [], garis = null, centang = null;

  function ensure() {
    if (dunia) return;
    dunia = h('<div id="an-dunia"></div>');
    $('#stage').insertBefore(dunia, $('#bg').nextSibling);
    kartu = HURUF.map((ch, k) => {
      const el = h(`<div class="an-k ${WARNA[k]}" style="width:${S}px;height:${S}px;font-size:${Math.round(S * 0.8)}px;margin:${-S / 2}px 0 0 ${-S / 2}px"><span>${ch}</span></div>`);
      dunia.appendChild(el);
      return el;
    });
    const w = 4 * S + 3 * GAP;
    garis = h(`<div class="an-garis" style="left:${CX - w / 2}px;top:${CY + S / 2 + pick(34, 26)}px;width:${w}px"></div>`);
    centang = h(`<svg class="an-cek" viewBox="0 0 100 100" style="left:${CX + w / 2 - pick(30, 24)}px;top:${CY - S / 2 - pick(52, 44)}px"><circle cx="50" cy="50" r="46"/><path pathLength="1" d="M27 52 L44 69 L75 33"/></svg>`);
    dunia.appendChild(garis); dunia.appendChild(centang);
  }

  const mix = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), r: lerp(a.r, b.r, k), s: lerp(a.s, b.s, k) });
  function pose(k, t) {
    const slot = AMAN[k];
    const a = { x: slotX(k), y: CY, r: 0, s: 1 }, b = { x: slotX(slot), y: CY, r: 0, s: 1 };
    // 1) NAMA → AMAN: N melompat lewat atas sambil berputar, yang lain bergeser lewat bawah
    const d1 = slot * 0.05, k1 = E.io3(P(t, C.tukar + d1, C.tukar + d1 + 0.7)), arc = Math.sin(Math.PI * k1);
    let p = mix(a, b, k1);
    p.y += k === 0 ? -arc * S * 1.1 : arc * S * 0.17;
    p.r += k === 0 ? 360 * k1 : -arc * 5;
    // 2) hitung 1-2-3-4: denyut bergantian sesuai urutan slot
    const tp = C.hitung + slot * 0.16, pu = Math.sin(Math.PI * P(t, tp, tp + 0.36));
    p.s += 0.12 * pu; p.y -= 20 * pu;
    // 3) berhamburan
    const k3 = P(t, C.acak + k * 0.05, C.acak + k * 0.05 + 0.55), e3 = E.outBack(k3);
    const c = { x: CX + ACAK[k][0] * S, y: CY + ACAK[k][1] * S, r: ACAK[k][2], s: 0.94 };
    if (k3 > 0) p = mix(p, c, e3);
    // 4) rapi kembali
    const k4 = P(t, C.rapi + slot * 0.07, C.rapi + slot * 0.07 + 0.5), e4 = E.outBack(k4);
    const goyang = k3 > 0 ? (1 - cl(k4 * 1.5)) : 0;
    p.y += Math.sin(t * 2.3 + k * 1.9) * 9 * goyang; p.r += Math.sin(t * 1.7 + k) * 2.2 * goyang;
    if (k4 > 0) p = mix(p, b, e4);
    // 5) jadi kepala kecil di atas
    const k5 = E.io3(P(t, C.kepala + slot * 0.04, C.kepala + slot * 0.04 + 0.7));
    if (k5 > 0) p = mix(p, { x: CX + (slot - 1.5) * (S * HS + HG), y: HY, r: 0, s: HS }, k5);
    p.angkat = Math.max(k === 0 ? arc : 0, pu, k3 > 0 ? goyang * 0.5 : 0);
    return p;
  }

  function gambar(t) {
    kartu.forEach((el, k) => {
      const p = pose(k, t);
      el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${p.r.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
      el.style.boxShadow = `0 ${(S * 0.045).toFixed(0)}px 0 rgba(8,15,40,.22), 0 ${(18 + 46 * p.angkat).toFixed(0)}px ${(34 + 60 * p.angkat).toFixed(0)}px rgba(8,15,40,${(0.2 - 0.06 * p.angkat).toFixed(3)})`;
      el.style.zIndex = k === 0 ? 3 : 2;
    });
    const kg = E.out3(P(t, C.rapi + 0.42, C.rapi + 0.85)) * (1 - P(t, C.kepala, C.kepala + 0.25));
    garis.style.transform = `scaleX(${kg.toFixed(3)})`;
    garis.style.opacity = kg > 0 ? 1 : 0;
    const kc = P(t, C.rapi + 0.5, C.rapi + 0.85), vis = 1 - P(t, C.kepala, C.kepala + 0.25);
    tf(centang, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) * vis });
    $('path', centang).style.strokeDashoffset = (1 - E.out3(P(t, C.rapi + 0.62, C.rapi + 0.95))).toFixed(3);
    dunia.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 100px Archivo', '700 100px Archivo', 'italic 400 100px "Instrument Serif"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F4F0E6'; cx.fillRect(0, 0, W, H);
      // titik-titik kertas grafik halus + dua noda warna yang bergerak pelan
      for (const [x0, y0, r, col, sp] of [[0.18, 0.2, 0.5, 'rgba(47,107,255,.10)', 0.11], [0.85, 0.85, 0.55, 'rgba(255,201,60,.16)', 0.09]]) {
        const x = (x0 + Math.sin(t * sp * 3) * 0.05) * W, y = (y0 + Math.cos(t * sp * 3) * 0.05) * H, g = cx.createRadialGradient(x, y, 0, x, y, r * Math.max(W, H));
        g.addColorStop(0, col); g.addColorStop(1, 'rgba(244,240,230,0)');
        cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      }
      cx.fillStyle = 'rgba(11,27,77,.10)';
      for (let y = 60; y < H; y += 60) for (let x = 60; x < W; x += 60) cx.fillRect(x - 1.5, y - 1.5, 3, 3);
    },
  });

  KIT.registerType('an', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['tukar', 'hitung', 'acak', 'rapi', 'kepala']) if (v[k] != null) C[k] = sc.start + T(v[k], 0);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.label) {
      const lb = h(`<div class="an-label" style="top:${CY - S / 2 - pick(118, 128)}px">${esc(v.label)}</div>`);
      root.appendChild(lb);
      parts.push((lt, d) => tf(lb, { o: 1 - P(lt, d - 0.3, d) }));
    }
    if (v.teks && !v.layar) {
      const tx = h(`<div class="an-teks" style="top:${CY + S / 2 + pick(96, 110)}px">${rich(v.teks)}</div>`);
      root.appendChild(tx);
      const ws = PD.kata(tx, sc);
      ws.forEach((w) => w.el.classList.add('klip'));
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); tx.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const tL = T(v.layar, 1), W0 = pick(1500, 980);
      const tx = h(`<div class="an-teks atas" style="top:${pick(196, 392)}px">${rich(v.teks)}</div>`);
      root.appendChild(tx);
      const ws = PD.kata(tx, sc, { dari: T(v.teksAt, 0.5) - 0.05 });
      ws.forEach((w) => w.el.classList.add('klip'));
      const kartuL = PD.layar(root, 'ropa-list-baru', { w: W0, potong: pick([280, 60, 1140, 470], [280, 60, 770, 470]), judul: 'Privasimu Nexus · Register RoPA' });
      kartuL.style.left = (SW - W0) / 2 + 'px'; kartuL.style.top = pick(300, 590) + 'px';
      const cips = (v.cip || []).map(([teks, at], i) => {
        const el = h(`<div class="an-cip c${i}">${esc(teks)}</div>`);
        root.appendChild(el);
        const pos = pick([[150, 430], [1430, 640], [230, 850]], [[40, 1150], [560, 1255], [150, 1350]])[i];
        el.style.left = pos[0] + 'px'; el.style.top = pos[1] + 'px';
        return { el, at: T(at, 2 + i * 0.5), r: [-5, 4, -3][i] };
      });
      parts.push((lt, d) => {
        PD.tampil(ws, lt, 'naik');
        const k = E.out3(P(lt, tL, tL + 0.75));
        tf(kartuL, { y: (1 - k) * pick(520, 700), o: cl(k * 3), s: lerp(0.94, 1, k), r: (1 - k) * 2 });
        cips.forEach((c) => { const kc = P(lt, c.at, c.at + 0.4); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 4), r: c.r + Math.sin(lt * 1.6 + c.r) * 1.2 }); });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
