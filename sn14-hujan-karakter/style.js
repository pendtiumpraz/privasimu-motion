// Gaya SN14 · HUJAN KARAKTER: hujan digambar di kanvas latar (KIT.style bg) — tiap kolom = aliran siklik (PER baris)
// dengan kecepatan dari hash; karakter dari hash (angka dominan). Kolom KOL menyimpan 16 digit NIK palsu sejak awal;
// fasenya dihitung agar deretan itu tepat di YT saat pemindai lewat (C.nyala), lalu kolom membeku & digit memerah.
// Setelah C.deras waktu hujan dipercepat (kontinu). Pada C.banyak kanvas "menjauh": panel utama menuju sel 0, tiga
// panel sistem lain (seed 1–3, kolom merah statis) muncul. Elemen DOM (teks hook, kaca pembesar, chip, garis pemindai,
// kurung/label, chip sistem, kartu peta) di lapisan lintas scene. Semua gerak = fungsi waktu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const LH = 26, CW = 32, PER = 120, YT = pick(300, 560), NIK = '3200009900990000', PN = 40, SCAN = 1.2, SKALA = 0.45, CELAH = 40;
  const COLS = Math.ceil(SW / CW), KOL = Math.floor(COLS * 0.62);
  const SISTEM = [['Basis data pelanggan*', 3], ['HRIS*', 6], ['Gudang data*', 4], ['Spreadsheet keuangan*', 5]];
  const C = { mulai: 9e9, temukan: 9e9, mata: 9e9, deras: 9e9, pindai: 9e9, nyala: 9e9, label: 9e9, banyak: 9e9, peta: 9e9, tutup: 9e9 };
  const MERAH = [1, 2, 3].map((s) => { const set = new Set(); for (let k = 0; k < SISTEM[s][1]; k++) { const col = Math.floor(hash(s * 11 + k * 3.3) * COLS), p0 = Math.floor(hash(s * 17 + k * 5.1) * (PER - 20)), len = 8 + Math.floor(hash(s * 23 + k * 7.7) * 9); for (let q = 0; q < len; q++) set.add(col + ':' + (p0 + q)); } return set; });
  const MERAH0 = new Set(); [0, 1].forEach((k) => { let col = Math.floor(hash(41 + k * 3.7) * COLS); if (Math.abs(col - KOL) < 3) col = (col + 5) % COLS; const p0 = Math.floor(hash(43 + k * 5.3) * (PER - 20)), len = 8 + Math.floor(hash(47 + k * 7.1) * 9); for (let q = 0; q < len; q++) MERAH0.add(col + ':' + (p0 + q)); }); // 2 kolom lagi di panel utama setelah menjauh
  const spd = (i, seed) => 110 + hash(i * 7.13 + seed * 31.7) * 240;
  const HURUF = 'ABCDEFXKZ#%&<>';
  const ch = (i, p, seed) => hash(i * 131.7 + p * 17.3 + seed * 977.1) < 0.74 ? String(Math.floor(hash(i * 3.1 + p * 7.7 + seed * 1.3) * 10)) : HURUF[Math.floor(hash(i * 5.5 + p * 9.9 + seed * 2.1) * HURUF.length)];
  const cells = [0, 1, 2, 3].map((i) => { const cw = SW * SKALA, chh = SH * SKALA, x0 = (SW - (2 * cw + CELAH)) / 2, y0 = (SH - (2 * chh + CELAH)) / 2; return [x0 + (i % 2) * (cw + CELAH), y0 + Math.floor(i / 2) * (chh + CELAH), cw, chh]; });
  const waktuHujan = (t) => t + 0.8 * Math.max(0, t - C.deras);
  const kaPanel = (t, i) => P(t, C.banyak + 0.35 + i * 0.15, C.banyak + 0.7 + i * 0.15);
  let lapis = null, el = null;

  function hujan(cx, t, seed, W, H) {
    const tt = waktuHujan(t), tBeku = waktuHujan(C.nyala);
    cx.font = '600 24px "JetBrains Mono", monospace'; cx.textBaseline = 'top';
    for (let i = 0; i < COLS; i++) {
      const v = spd(i, seed), utama = seed === 0 && i === KOL;
      const off = v * (utama ? Math.min(tt, tBeku) : tt);
      const ph = utama ? YT + LH + v * tBeku - PN * LH : hash(i * 1.7 + seed) * PER * LH;
      const redup = seed === 0 && !utama ? 1 - 0.65 * P(t, C.nyala, C.nyala + 0.5) : 1;
      for (let p = 0; p < PER; p++) {
        let y = (p * LH - off + ph) % (PER * LH); if (y < 0) y += PER * LH; y -= LH;
        if (y > H || y < -LH) continue;
        const nik = utama && p >= PN && p < PN + 16, merah = (nik && t >= C.nyala) || (seed > 0 && MERAH[seed - 1].has(i + ':' + p)) || (seed === 0 && t >= C.banyak + 0.9 && MERAH0.has(i + ':' + p));
        const a = 0.16 + 0.6 * hash(i * 2.3 + p * 4.7 + Math.floor(t * 6) * 0.37 + seed);
        cx.fillStyle = merah ? `rgba(255,70,86,${(0.85 + 0.15 * a).toFixed(2)})` : `rgba(150,196,255,${(a * redup).toFixed(2)})`;
        cx.shadowBlur = merah ? 14 : 0; if (merah) cx.shadowColor = 'rgba(255,60,80,.9)';
        cx.fillText(nik ? NIK[p - PN] : ch(i, p, seed), i * CW + 4, y);
      }
    }
    cx.shadowBlur = 0;
  }

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('hj-lapis');
    el = {};
    el.hook = h('<div class="hj-hook"><span>Di antara hujan ini ada 1 NIK.</span><b>TEMUKAN.</b></div>'); lapis.appendChild(el.hook);
    el.hookB = el.hook.querySelector('b'); el.hookS = el.hook.querySelector('span');
    el.kaca = h('<div class="hj-kaca"><i></i></div>'); lapis.appendChild(el.kaca);
    el.hitung = h('<div class="hj-hitung">MATA MANUSIA · <b>00:00:00</b>* · 0 temuan</div>'); lapis.appendChild(el.hitung);
    el.hitungB = el.hitung.querySelector('b');
    el.pindai = h('<div class="hj-pindai"></div>'); lapis.appendChild(el.pindai);
    el.kurung = h(`<div class="hj-kurung" style="left:${KOL * CW - 6}px;top:${YT - 6}px;height:${16 * LH + 8}px"></div>`); lapis.appendChild(el.kurung);
    el.label = h(`<div class="hj-label" style="left:${V ? KOL * CW - 40 : KOL * CW + 64}px;top:${YT + 110}px"><b>NIK terdeteksi</b><span>kolom no_identitas*</span><em>→ dikaitkan ke RoPA</em></div>`); lapis.appendChild(el.label);
    el.sistem = SISTEM.map(([n, k], i) => { const [x, y] = cells[i]; const d = h(`<div class="hj-sistem" style="left:${(x + 16).toFixed(0)}px;top:${(y + 16).toFixed(0)}px"><b>${esc(n)}</b><span>${k} kolom</span></div>`); lapis.appendChild(d); return d; });
    el.peta = h('<div class="hj-peta"><b>4 sistem · 18 kolom data pribadi*</b><span>semuanya dikaitkan ke RoPA</span></div>'); lapis.appendChild(el.peta);
  }
  const jam = (s) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
  function gambar(t) {
    // teks hook
    const kh = E.out3(P(t, C.mulai + 0.3, C.mulai + 0.8)), kt = E.outBack(Math.max(0.001, P(t, C.temukan, C.temukan + 0.45)));
    el.hook.style.opacity = kh * (1 - P(t, C.mata, C.mata + 0.3));
    el.hookS.style.transform = `translateY(${((1 - kh) * 20).toFixed(1)}px)`;
    el.hookB.style.opacity = t >= C.temukan ? 1 : 0; el.hookB.style.transform = `scale(${kt.toFixed(3)})`;
    // kaca pembesar
    const kk = P(t, C.temukan + 0.2, C.temukan + 0.6) * (1 - P(t, C.pindai - 0.3, C.pindai)), gelisah = t >= C.mata ? 1 : 0;
    const kx = SW / 2 + Math.sin(t * 0.9) * SW * 0.3 + Math.sin(t * 2.3 + 1) * 120 + gelisah * (hash(Math.floor(t * 20)) - 0.5) * 30;
    const ky = SH / 2 + Math.cos(t * 1.3) * SH * 0.26 + Math.sin(t * 3.1) * 60 + gelisah * (hash(Math.floor(t * 20) + 7) - 0.5) * 30;
    el.kaca.style.opacity = kk; el.kaca.style.transform = `translate(${kx.toFixed(1)}px, ${ky.toFixed(1)}px) translate(-50%, -50%) scale(${lerp(0.6, 1, E.out3(kk)).toFixed(3)})`;
    // chip penghitung
    const km = t >= C.mata && t < C.pindai ? E.outBack(Math.max(0.001, P(t, C.mata, C.mata + 0.35))) : 0;
    el.hitung.style.opacity = km > 0.001 ? 1 : 0; el.hitung.style.transform = `scale(${km.toFixed(3)})`;
    const dtk = Math.floor(P(t, C.mata, C.mata + 2.2) * 10800); if (el.hitungB.textContent !== jam(dtk)) el.hitungB.textContent = jam(dtk);
    // garis pemindai
    const kp = P(t, C.pindai, C.pindai + SCAN);
    el.pindai.style.opacity = kp > 0 && kp < 1 ? 1 : 0; el.pindai.style.transform = `translateY(${(kp * SH).toFixed(1)}px)`;
    // kurung & label NIK
    const kn = t >= C.nyala ? E.outBack(Math.max(0.001, P(t, C.nyala, C.nyala + 0.4))) : 0, hilang = 1 - P(t, C.banyak, C.banyak + 0.3);
    el.kurung.style.opacity = (kn > 0.001 ? 1 : 0) * hilang; el.kurung.style.transform = `scaleY(${kn.toFixed(3)})`;
    const kl = t >= C.label ? E.out3(P(t, C.label, C.label + 0.4)) : 0;
    el.label.style.opacity = kl * hilang; el.label.style.transform = `${V ? 'translateX(-100%) ' : ''}translateX(${((1 - kl) * (V ? 20 : -20)).toFixed(1)}px)`;
    // chip sistem & kartu peta
    el.sistem.forEach((d, i) => { const k = i === 0 ? P(t, C.banyak + 0.9, C.banyak + 1.2) : kaPanel(t, i); d.style.opacity = k; d.style.transform = `translateY(${((1 - E.out3(k)) * 12).toFixed(1)}px)`; });
    const kpt = t >= C.peta ? E.outBack(Math.max(0.001, P(t, C.peta, C.peta + 0.5))) : 0;
    el.peta.style.opacity = kpt > 0.001 ? 1 : 0; el.peta.style.transform = `translate(-50%, -50%) scale(${kpt.toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['600 24px "JetBrains Mono"', '900 60px Inter', '700 30px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#070B1E'; cx.fillRect(0, 0, W, H);
      const kz = E.io3(P(t, C.banyak, C.banyak + 1.2));
      if (kz <= 0) { hujan(cx, t, 0, W, H); return; }
      const [x0, y0, cw, chh] = cells[0], s = lerp(1, SKALA, kz);
      cx.save(); cx.translate(lerp(0, x0, kz), lerp(0, y0, kz)); cx.scale(s, s); cx.beginPath(); cx.rect(0, 0, W, H); cx.clip(); hujan(cx, t, 0, W, H); cx.restore();
      for (let i = 1; i < 4; i++) {
        const ka = kaPanel(t, i); if (ka <= 0) continue;
        const [x, y] = cells[i];
        cx.save(); cx.globalAlpha = ka; cx.translate(x, y); cx.scale(SKALA, SKALA); cx.beginPath(); cx.rect(0, 0, W, H); cx.clip(); hujan(cx, t, i, W, H); cx.restore();
      }
      cx.strokeStyle = 'rgba(150,196,255,.4)'; cx.lineWidth = 2;
      cells.forEach(([x, y, w, hh], i) => {
        const ka = i === 0 ? kz : kaPanel(t, i); if (ka <= 0) return;
        cx.globalAlpha = ka; cx.strokeRect(i === 0 ? lerp(0, x, kz) : x, i === 0 ? lerp(0, y, kz) : y, i === 0 ? lerp(W, w, kz) : w, i === 0 ? lerp(H, hh, kz) : hh);
      });
      cx.globalAlpha = 1;
    },
  });

  KIT.registerType('hj', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0.1);
    if (v.temukan != null) C.temukan = sc.start + T(v.temukan, 2.5);
    if (v.mata != null) C.mata = sc.start + T(v.mata, 0.3);
    if (v.deras != null) C.deras = sc.start + T(v.deras, 3);
    if (v.pindai != null) { C.pindai = sc.start + T(v.pindai, 0.5); C.nyala = C.pindai + SCAN * ((YT + 8 * LH) / SH); }
    if (v.label != null) C.label = Math.max(sc.start + T(v.label, 2.5), C.nyala + 0.15);
    if (v.banyak != null) C.banyak = sc.start + T(v.banyak, 0.4);
    if (v.peta != null) C.peta = sc.start + T(v.peta, 3.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
