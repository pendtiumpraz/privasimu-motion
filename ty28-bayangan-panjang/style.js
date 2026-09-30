// Gaya TY28 · LONG SHADOW: semuanya digambar di kanvas latar (bg) — ikon meja datar, lalu bayangan = teks digambar
// berulang dengan offset diagonal (langkah 2 px) sepanjang L(t), lalu teks putih di atasnya. L(t) = interpolasi antar
// titik kunci (waktu, panjang) yang diisi dari cue scene. Panel Siap PP 33 & label bulan = DOM di lapisan.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KUNCI = []; // [t, L] terurut
  const C = { muncul: 9e9, bulan: [], panel: 9e9, centang: [9e9, 9e9, 9e9, 9e9, 9e9], pendek: 9e9, tutup: 9e9 };
  const MODUL = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden'];
  let lapis = null, bulanEl = null, panel = null, itemEl = [];
  const TX = pick(120, 70), TY = pick(330, 470), FS = pick(300, 250);

  function panjang(t) {
    const k = KUNCI.slice().sort((a, b) => a[0] - b[0]);
    if (!k.length || t <= k[0][0]) return k.length ? k[0][1] : 40;
    for (let i = 1; i < k.length; i++) if (t <= k[i][0]) { const [t0, l0] = k[i - 1], [t1, l1] = k[i]; return lerp(l0, l1, E.io3(P(t, t1 - Math.min(1.2, t1 - t0), t1))); } // transisi berakhir tepat di cue
    return k[k.length - 1][1];
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ls-lapis', 2);
    bulanEl = h('<div class="ls-bulan"></div>'); lapis.appendChild(bulanEl);
    panel = h(`<div class="ls-panel"><div class="lp-j">SIAP PP 33</div>${MODUL.map((m) => `<div class="lp-i"><i></i><span>${m}</span></div>`).join('')}</div>`);
    lapis.appendChild(panel); itemEl = [...panel.querySelectorAll('.lp-i')];
  }
  function meja(cx, W, H) { // ikon meja datar (digambar sebelum bayangan supaya tertutup)
    const ob = V ? [[140, 1180, 'kertas', 'RoPA'], [420, 1260, 'kertas', 'DPIA'], [700, 1150, 'kertas', 'DSR'], [120, 1560, 'keyboard'], [760, 1520, 'cangkir']]
      : [[820, 560, 'kertas', 'RoPA'], [1080, 620, 'kertas', 'DPIA'], [1340, 540, 'kertas', 'DSR'], [900, 820, 'keyboard'], [1600, 760, 'cangkir']];
    for (const [x, y, jenis, lbl] of ob) {
      if (jenis === 'kertas') { cx.fillStyle = '#FFF8E7'; cx.fillRect(x, y, 200, 260); cx.fillStyle = '#E4D3AE'; for (let i = 0; i < 6; i++) cx.fillRect(x + 24, y + 70 + i * 28, 150 - (i % 3) * 30, 8); cx.fillStyle = '#1B1B1B'; cx.font = `900 34px Montserrat`; cx.textAlign = 'left'; cx.fillText(lbl, x + 24, y + 48); }
      if (jenis === 'keyboard') { cx.fillStyle = '#FFF8E7'; cx.fillRect(x, y, 560, 170); cx.fillStyle = '#E4D3AE'; for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) cx.fillRect(x + 20 + c * 41, y + 18 + r * 36, 32, 26); }
      if (jenis === 'cangkir') { cx.fillStyle = '#FFF8E7'; cx.beginPath(); cx.arc(x, y, 90, 0, Math.PI * 2); cx.fill(); cx.strokeStyle = '#FFF8E7'; cx.lineWidth = 22; cx.beginPath(); cx.arc(x + 110, y, 44, -1.2, 1.2); cx.stroke(); cx.fillStyle = '#7A4A1D'; cx.beginPath(); cx.arc(x, y, 66, 0, Math.PI * 2); cx.fill(); }
    }
  }
  function gambar(t) {
    const b = C.bulan.filter((x) => t >= x[0]).pop();
    bulanEl.textContent = b ? b[1] : '';
    bulanEl.style.opacity = b ? 1 : 0;
    const kp = E.out3(P(t, C.panel, C.panel + 0.5));
    panel.style.opacity = kp.toFixed(3); panel.style.transform = `translateY(${((1 - kp) * 60).toFixed(1)}px)`;
    itemEl.forEach((el, i) => el.classList.toggle('on', t >= C.centang[i]));
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Montserrat', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F2B632'; cx.fillRect(0, 0, W, H);
      meja(cx, W, H);
      if (t < C.muncul) return;
      const L = panjang(t), n = Math.floor(L / 2);
      cx.font = `900 ${FS}px Montserrat`; cx.textAlign = 'left'; cx.textBaseline = 'alphabetic';
      const baris = V ? [['16', 0], ['JAN', FS * 0.95]] : [['16 JAN', 0]];
      cx.fillStyle = 'rgba(30,20,0,0.06)';
      for (let i = n; i >= 1; i--) for (const [s, dy] of baris) cx.fillText(s, TX + i * 2, TY + dy + i * 2);
      const km = E.outBack(Math.max(0.001, P(t, C.muncul, C.muncul + 0.5)));
      cx.save(); cx.translate(TX, TY); cx.scale(km, km); cx.translate(-TX, -TY);
      cx.fillStyle = '#FFFFFF'; for (const [s, dy] of baris) cx.fillText(s, TX, TY + dy);
      const sub = '2027 · PP 33/2026 berlaku', sy = TY + (V ? FS * 0.95 : 0) + pick(70, 64), sf = pick(40, 36);
      cx.font = `700 ${sf}px Inter`; const sw = cx.measureText(sub).width;
      cx.fillStyle = '#1B1B1B'; cx.beginPath(); cx.roundRect(TX, sy - sf * 0.95, sw + 36, sf * 1.5, 10); cx.fill();
      cx.fillStyle = '#F2B632'; cx.fillText(sub, TX + 18, sy);
      cx.restore();
    },
  });

  KIT.registerType('ls', (root, v, sc, tm, T) => {
    ensure();
    if (v.muncul != null) { C.muncul = sc.start + T(v.muncul, 0.1); KUNCI.push([C.muncul, 40]); }
    if (v.panjang) KUNCI.push([sc.start + T(v.panjang[0], 2), v.panjang[1]]);
    if (v.bulan) v.bulan.forEach(([c, nama, L], i) => { const tt = sc.start + T(c, 0.5 + i * 1.5); C.bulan.push([tt, nama]); KUNCI.push([tt, L]); });
    if (v.panel != null) C.panel = sc.start + T(v.panel, 0.3);
    if (v.centang) v.centang.forEach((c, i) => { C.centang[i] = sc.start + T(c, 1.5 + i * 0.5); });
    if (v.pendek != null) { C.pendek = sc.start + T(v.pendek, 4.5); KUNCI.push([C.pendek, 40]); }
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="ls-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
