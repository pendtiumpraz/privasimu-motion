// Gaya TY34 · KALIGRAM: siluet gembok dirasterkan ke kanvas kecil sekali, lalu titik-titik di dalamnya diisi kata.
// Tiap kata: posisi awal acak (hash) di luar layar → terbang ke titiknya; kata yang disebut menyala; sengkang turun.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KATA = [['RoPA', 'ropa'], ['DPIA', 'dpia'], ['DSR', 'dsr'], ['bukti persetujuan', 'bukti'], ['log audit', 'log'], ['tenggat', 'tenggat'], ['insiden', 'insiden'],
    ['3×24 jam', 'tenggat'], ['pihak ketiga', 'pihak'], ['transfer', 'transfer'], ['TIA', 'tia'], ['LIA', 'lia'], ['retensi', 'retensi'], ['dasar hukum', 'dasar'],
    ['penerima', 'penerima'], ['kategori data', 'kategori'], ['risiko', 'risiko'], ['mitigasi', 'mitigasi'], ['notifikasi', 'notif'], ['verifikasi', 'verif'],
    ['pemindaian', 'pindai'], ['katalog', 'katalog'], ['kebijakan', 'kebijakan'], ['kontrak', 'kontrak'], ['simulasi', 'simulasi'], ['skor', 'skor'], ['persetujuan', 'bukti'], ['Priva', 'priva']];
  // geometri gembok (koordinat layar)
  const S = pick(1.12, 0.95), CX = SW / 2, CY = pick(500, 800);
  const BW = 640 * S, BH = 500 * S, BY0 = CY - 60 * S, R0 = 215 * S, RT = 96 * S, AY = BY0 - 10 * S; // badan & sengkang
  const CELL = pick(30, 28);
  const C = { kumpul: 9e9, dekat: 9e9, jauh: 9e9, kunci: 9e9, logo: 9e9, tutup: 9e9, nyala: {} };
  let lapis = null, kata = [], logo = null;

  function dalam(x, y) {
    const dx = x - CX, dy = y - BY0;
    // badan bersudut bulat
    const rb = 44 * S, bx = Math.abs(dx) - (BW / 2 - rb), by = Math.abs(y - (BY0 + BH / 2)) - (BH / 2 - rb);
    const dBadan = Math.hypot(Math.max(bx, 0), Math.max(by, 0)) + Math.min(Math.max(bx, by), 0);
    if (dBadan <= 0) {
      // lubang kunci: lingkaran + celah
      const ky = BY0 + BH * 0.42, rk = 62 * S;
      if (Math.hypot(dx, y - ky) < rk) return false;
      if (Math.abs(dx) < 30 * S && y > ky && y < ky + 165 * S) return false;
      return true;
    }
    // sengkang: cincin setengah atas + dua kaki
    if (y <= AY) { const d = Math.hypot(dx, y - AY); return d <= R0 + RT / 2 && d >= R0 - RT / 2; }
    return false;
  }

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kg-lapis');
    const dunia = h('<div class="kg-dunia"></div>');
    lapis.appendChild(dunia);
    // kata dialirkan baris demi baris (rapat seperti kaligram sungguhan); hanya kata yang seluruhnya di dalam siluet dipakai
    let n = 0, baris = 0;
    for (let y = AY - R0 - RT; y < BY0 + BH + CELL; y += CELL * 0.9, baris++) {
      let x = CX - BW / 2 - 30 + hash(baris * 4.7) * CELL;
      const xEnd = CX + BW / 2 + 30;
      while (x < xEnd) {
        let ok = false;
        for (let coba = 0; coba < 4 && !ok; coba++) {
          const [t, key] = KATA[Math.floor(hash(n * 3.1 + coba * 17) * KATA.length)];
          const fs = CELL * (0.6 + hash(n * 5.3) * 0.4), w = t.length * fs * 0.56;
          if (dalam(x + 3, y) && dalam(x + w - 3, y) && dalam(x + w / 2, y)) {
            const jx = x + w / 2;
            const el = h(`<span class="kg-k ${key}" style="left:${jx.toFixed(1)}px;top:${y.toFixed(1)}px;font-size:${fs.toFixed(1)}px">${esc(t)}</span>`);
            dunia.appendChild(el);
            const ang = hash(n * 7.7) * Math.PI * 2, jar = Math.max(SW, SH) * (0.7 + hash(n * 9.1) * 0.5);
            kata.push({ el, x: jx, y, x0: CX + Math.cos(ang) * jar, y0: CY + Math.sin(ang) * jar, d: hash(n * 11.3), sengkang: y < AY + 4, key });
            x += w + CELL * 0.4; ok = true;
          }
        }
        if (!ok) x += CELL * 0.5;
        n++;
      }
    }
    logo = h(`<div class="kg-logo" style="top:${BY0 + BH + pick(70, 90)}px"><img src="${PD.LOGO}" alt=""><span>NEXUS</span></div>`);
    lapis.appendChild(logo);
    lapis._dunia = dunia;
  }
  function gambar(t) {
    const kk = E.io3(P(t, C.kunci, C.kunci + 0.35)), turun = kk * 46 * S;
    for (const w of kata) {
      const t0 = C.kumpul + w.d * 0.9, k = E.outExpo(P(t, t0, t0 + 0.9));
      const x = lerp(w.x0, w.x, k), y = lerp(w.y0, w.y, k) + (w.sengkang ? turun : 0);
      const ny = C.nyala[w.key], on = ny != null && t >= ny;
      w.el.style.transform = `translate(calc(-50% + ${(x - w.x).toFixed(1)}px), calc(-50% + ${(y - w.y).toFixed(1)}px))`;
      w.el.style.opacity = k > 0 ? (0.72 + 0.28 * k).toFixed(3) : 0;
      w.el.classList.toggle('on', on);
    }
    // kamera: mendekat ke badan gembok lalu mundur
    const kd = E.io3(P(t, C.dekat, C.dekat + 1.1)) * (1 - E.io3(P(t, C.jauh, C.jauh + 1.0)));
    const z = lerp(1, pick(2.6, 2.2), kd), fx = CX, fy = BY0 + BH * 0.62;
    lapis._dunia.style.transform = `translate(${(SW / 2 - z * fx + (fx - SW / 2) * (1 - kd)).toFixed(1)}px, ${(SH / 2 - z * fy + (fy - SH / 2) * (1 - kd)).toFixed(1)}px) scale(${z.toFixed(4)})`;
    lapis._dunia.style.transformOrigin = '0 0';
    lapis._dunia.toggleAttribute('data-bebas', kd > 0.05);
    const kl = E.out3(P(t, C.logo, C.logo + 0.6));
    tf(logo, { y: (1 - kl) * 30, o: kl });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 40px Archivo', '900 40px Archivo'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.7);
      g.addColorStop(0, '#132456'); g.addColorStop(1, '#060B1F');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('kg', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['kumpul', 'dekat', 'jauh', 'kunci']) if (v[k] != null) C[k] = sc.start + T(v[k], 0);
    if (v.logoAt != null) C.logo = sc.start + T(v.logoAt, 1);
    for (const [key, at] of v.nyala || []) C.nyala[key] = sc.start + T(at, 1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="kg-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
