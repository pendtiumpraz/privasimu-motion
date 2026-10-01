// Gaya TY12 · HURUF KARET: kata dibangun dari span per huruf (lebar diukur lewat kanvas); regang(k, s) menyusun ulang
// huruf dengan faktor regang yang membesar ke arah tarikan (Σ lebar ≈ total × s) + sedikit gepeng vertikal. Tarikan =
// naik (io3) → tahan → dilepas: pegas teredam exp(-4.5τ)·cos(15τ). Pegangan cincin mengikuti ujung kata; pada kata baja
// yang melar justru pegangannya (scaleX) lalu terpental. Penghitung mundur, kartu asli, chip, huruf SIAP jatuh dengan
// pantulan elastis (gepeng/memanjang). Semua gerak = fungsi waktu global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const F1 = pick(170, 112), F2 = pick(190, 150), F3 = pick(300, 240);
  const X1 = pick(160, 60), Y1 = pick(420, 640), Y1K = pick(190, 300);
  const X2 = pick(160, 60), Y2 = pick(560, 860);
  const S_MAX = [1.5, 1.7, pick(1.92, 1.78)], D = 0.45, HD = 0.2;
  const TAG = ['minggu depan', 'bulan depan', 'kuartal depan'];
  const CHIP = ['daftar periksa penahanan', 'log linimasa', 'templat pemberitahuan'];
  const C = { mulai: 9e9, tarik: [9e9, 9e9, 9e9], baja: 9e9, coba: [9e9, 9e9, 9e9], kunci: 9e9, mundur: 9e9, layar: 9e9, chip: [9e9, 9e9, 9e9], siap: 9e9, latih: 9e9, tutup: 9e9 };
  let lapis = null, el = null;

  function ukur(teks, font) { const cv = document.createElement('canvas').getContext('2d'); cv.font = font; return [...teks].map((c) => cv.measureText(c).width); }
  function kata(teks, font, kelas) {
    const wrap = h(`<div class="el-kata ${kelas}" style="height:${Math.round(parseInt(font.match(/(\d+)px/)[1]) * 1.1)}px"></div>`), ws = ukur(teks, font);
    const spans = [...teks].map((c) => { const s = h(`<span style="font:${font}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`); wrap.appendChild(s); return s; });
    return { el: wrap, spans, ws, total: ws.reduce((a, b) => a + b, 0), teks, font, pasti: false };
  }
  function regang(k, s) {
    if (!k.pasti) { k.ws = ukur(k.teks, k.font); k.total = k.ws.reduce((a, b) => a + b, 0); if (document.fonts && document.fonts.check(k.font)) k.pasti = true; }
    const n = k.spans.length, g = k.spans.map((_, i) => 0.35 + (n > 1 ? i / (n - 1) : 0)), gm = g.reduce((a, b) => a + b, 0) / n;
    let x = 0;
    k.spans.forEach((sp, i) => { const f = 1 + (s - 1) * g[i] / gm; sp.style.transform = `translateX(${x.toFixed(1)}px) scaleX(${f.toFixed(3)}) scaleY(${(1 - 0.22 * (f - 1)).toFixed(3)})`; x += k.ws[i] * f; });
    return x;
  }
  function lebar(k, s) { const n = k.spans.length, g = k.spans.map((_, i) => 0.35 + (n > 1 ? i / (n - 1) : 0)), gm = g.reduce((a, b) => a + b, 0) / n; return k.ws.reduce((a, w, i) => a + w * (1 + (s - 1) * g[i] / gm), 0); }
  const pegas = (tau, amp, w = 13, d = 4) => (tau < 0 ? 0 : amp * Math.exp(-d * tau) * Math.cos(w * tau));
  function regangTenggat(t) {
    let s = 1;
    for (let i = 0; i < 3; i++) {
      const t0 = C.tarik[i]; if (t < t0) continue; const S = S_MAX[i];
      if (t < t0 + D) s = 1 + (S - 1) * E.io3(P(t, t0, t0 + D)); else if (t < t0 + D + HD) s = S; else s = 1 + pegas(t - t0 - D - HD, S - 1);
    }
    return s;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('el-lapis');
    el = {};
    el.k1 = kata('TENGGAT', `900 ${F1}px Inter`, 'karet'); lapis.appendChild(el.k1.el);
    el.tag = TAG.map((s) => { const d = h(`<div class="el-tag" style="left:${X1}px;top:${Y1 - F1 * 0.55 - 80}px">${s}</div>`); lapis.appendChild(d); return d; });
    el.k2 = kata('3×24 JAM', `900 ${F2}px Inter`, 'baja'); lapis.appendChild(el.k2.el); regang(el.k2, 1);
    el.gembok = h(`<div class="el-gembok" style="left:${X2 + el.k2.total + 14}px;top:${Y2 - F2 * 0.55}px"><i></i></div>`); lapis.appendChild(el.gembok);
    el.pegang = h('<div class="el-pegang"><i></i><i></i></div>'); lapis.appendChild(el.pegang);
    el.mundur = h(`<div class="el-mundur" style="left:${X2}px;top:${Y2}px;font-size:${F2}px">71:59:59</div>`); lapis.appendChild(el.mundur);
    el.chip = CHIP.map((s, i) => { const [x, y] = V ? [[40, 1180], [560, 1180], [40, 1262]][i] : [X2 + [0, 430, 700][i], 900]; const d = h(`<div class="el-chip" style="left:${x}px;top:${y}px">✓ ${s}</div>`); lapis.appendChild(d); return d; });
    el.k3 = kata('SIAP', `900 ${F3}px Inter`, 'siap'); lapis.appendChild(el.k3.el); regang(el.k3, 1);
    el.latih = h('<div class="el-latih">Simulasi insiden · kuis · tabletop · walkthrough</div>'); lapis.appendChild(el.latih);
  }
  function gambar(t) {
    const km = E.outBack(Math.max(0.001, P(t, C.mulai, C.mulai + 0.5))), kb = E.io3(P(t, C.baja, C.baja + 0.6)), ksi = E.io3(P(t, C.siap, C.siap + 0.45));
    // TENGGAT (karet)
    const s1 = regangTenggat(t), w1 = regang(el.k1, s1);
    el.k1.el.style.opacity = (t >= C.mulai ? 1 : 0) * lerp(1, 0.7, kb) * (1 - ksi);
    el.k1.el.style.transform = `translate(${X1}px, ${lerp(Y1, Y1K, kb).toFixed(1)}px) translateY(-50%) scale(${(km * lerp(1, 0.55, kb)).toFixed(3)})`;
    // tag tarikan
    el.tag.forEach((d, i) => { const t0 = C.tarik[i], k = t >= t0 + D - 0.1 ? E.outBack(Math.max(0.001, P(t, t0 + D - 0.1, t0 + D + 0.2))) * (1 - P(t, t0 + D + HD + 0.5, t0 + D + HD + 0.8)) : 0; d.style.opacity = (k > 0.001 ? 1 : 0) * (1 - kb); d.style.transform = `scale(${k.toFixed(3)})`; });
    // 3×24 JAM (baja)
    let goyang = 0; C.coba.forEach((t0) => { if (t >= t0 + 0.2 && t < t0 + 0.42) goyang = (hash(Math.floor(t * 60)) - 0.5) * 5; });
    const kmd = E.io3(P(t, C.mundur, C.mundur + 0.4));
    regang(el.k2, 1); el.gembok.style.left = (X2 + el.k2.total + 14).toFixed(1) + 'px'; // lebar diukur ulang setelah font termuat
    el.k2.el.style.opacity = (t >= C.baja ? 1 : 0) * (1 - kmd);
    el.k2.el.style.transform = `translate(${(X2 + goyang).toFixed(1)}px, ${Y2}px) translateY(-50%) scale(${(t >= C.baja ? E.outBack(Math.max(0.001, P(t, C.baja, C.baja + 0.5))) : 0).toFixed(3)})`;
    const kg = t >= C.kunci ? E.outBack(Math.max(0.001, P(t, C.kunci, C.kunci + 0.4))) * (1 - kmd) : 0;
    el.gembok.style.opacity = kg > 0.001 ? 1 : 0; el.gembok.style.transform = `scale(${kg.toFixed(3)}) rotate(${((1 - kg) * -30).toFixed(1)}deg)`;
    // pegangan
    let px = 0, py = Y1, po = 0, psx = 1, prot = 0;
    for (let i = 0; i < 3; i++) { // tarikan karet
      const t0 = C.tarik[i]; if (t < t0 - 0.3 || t > t0 + D + HD + 0.4) continue;
      const total = el.k1.total; py = Y1;
      if (t < t0) { po = P(t, t0 - 0.3, t0 - 0.1); px = X1 + w1 + 50 + 220 * (1 - E.out3(P(t, t0 - 0.3, t0))); } // kejar ujung kata yang masih memantul
      else if (t <= t0 + D + HD) { po = 1; px = X1 + w1 + 50; }
      else { const tau = t - t0 - D - HD; po = 1 - P(tau, 0.08, 0.35); px = X1 + lebar(el.k1, S_MAX[i]) + 50 + 140 * E.out3(P(tau, 0, 0.3)); }
    }
    for (let i = 0; i < 3; i++) { // percobaan pada baja
      const t0 = C.coba[i]; if (t < t0 - 0.3 || t > t0 + 1.1) continue;
      const ujung = X2 + el.k2.total + 50; py = Y2;
      if (t < t0) { po = P(t, t0 - 0.3, t0 - 0.1); px = ujung + 220 * (1 - E.out3(P(t, t0 - 0.3, t0))); psx = 1; }
      else {
        const kp = E.io3(P(t, t0, t0 + 0.3)), tau = t - t0 - 0.3, melar = i === 0 ? 0.35 : 0.95;
        px = ujung + (tau < 0 ? 40 * kp : pegas(tau, 40, 18, 5)); psx = 1 + (tau < 0 ? melar * kp : pegas(tau, melar, 18, 5)); po = 1;
        if (i === 2 && tau > 0.15) { const kf = E.in2 ? E.in2(P(tau, 0.15, 0.6)) : P(tau, 0.15, 0.6) ** 2; px += 900 * kf; py = Y2 - 300 * kf; prot = 260 * kf; po = 1 - P(tau, 0.45, 0.6); }
      }
    }
    el.pegang.style.opacity = po.toFixed(3); el.pegang.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -50%) rotate(${prot.toFixed(1)}deg) scaleX(${psx.toFixed(3)})`;
    // penghitung mundur
    const dtk = Math.max(0, 72 * 3600 - 1 - Math.floor(Math.max(0, t - C.mundur)));
    const teks = [Math.floor(dtk / 3600), Math.floor(dtk / 60) % 60, dtk % 60].map((n) => String(n).padStart(2, '0')).join(':');
    if (el.mundur.textContent !== teks) el.mundur.textContent = teks;
    el.mundur.style.opacity = (kmd * (1 - ksi)).toFixed(3); el.mundur.style.transform = `translateY(-50%) translateY(${(ksi * 60).toFixed(1)}px) scale(${lerp(0.9, 1, kmd).toFixed(3)})`;
    if (el.layar) { const k = t >= C.layar ? E.outBack(Math.max(0.001, P(t, C.layar, C.layar + 0.5))) : 0; el.layar.style.opacity = (k > 0.001 ? 1 : 0) * (1 - ksi); el.layar.style.transform = `translateY(${((1 - k) * 40 + ksi * 60).toFixed(1)}px) scale(${lerp(0.94, 1, k).toFixed(3)})`; }
    el.chip.forEach((d, i) => { const k = t >= C.chip[i] ? E.outBack(Math.max(0.001, P(t, C.chip[i], C.chip[i] + 0.4))) : 0; d.style.opacity = (k > 0.001 ? 1 : 0) * (1 - ksi); d.style.transform = `translateY(${(ksi * 60).toFixed(1)}px) scale(${k.toFixed(3)})`; });
    // SIAP memantul
    regang(el.k3, 1);
    const cx = SW / 2 - el.k3.total / 2, cy = pick(560, 900);
    el.k3.el.style.opacity = t >= C.siap ? 1 : 0; el.k3.el.style.transform = `translate(${cx.toFixed(1)}px, ${cy}px) translateY(-50%)`;
    let x = 0;
    el.k3.spans.forEach((sp, i) => {
      const tau = t - C.siap - i * 0.14, ada = tau >= 0, e = ada ? Math.exp(-4.5 * tau) : 1, osc = ada ? Math.cos(11 * tau) : 1, sq = ada ? Math.abs(Math.sin(11 * tau)) * e : 0;
      sp.style.opacity = ada ? 1 : 0;
      sp.style.transform = `translate(${x.toFixed(1)}px, ${(-320 * e * osc).toFixed(1)}px) scaleX(${(1 + 0.35 * sq).toFixed(3)}) scaleY(${(1 - 0.35 * sq).toFixed(3)})`;
      x += el.k3.ws[i];
    });
    const kl = t >= C.latih ? E.outBack(Math.max(0.001, P(t, C.latih, C.latih + 0.45))) : 0;
    el.latih.style.opacity = kl > 0.001 ? 1 : 0; el.latih.style.transform = `translateX(-50%) scale(${kl.toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: [`900 ${F1}px Inter`, `900 ${F2}px Inter`, `900 ${F3}px Inter`, '700 30px Inter', '700 40px "JetBrains Mono"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0E1A3A'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W * 0.4, H * 0.45, 0, W * 0.4, H * 0.45, W * 0.7); g.addColorStop(0, 'rgba(47,111,209,.22)'); g.addColorStop(1, 'rgba(47,111,209,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('el', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0.1);
    (v.tarik || []).forEach((c, i) => { C.tarik[i] = sc.start + T(c, 1 + i * 1.3); });
    if (v.baja != null) C.baja = sc.start + T(v.baja, 1);
    (v.coba || []).forEach((c, i) => { C.coba[i] = sc.start + T(c, 2 + i * 0.9); });
    if (v.kunci != null) C.kunci = sc.start + T(v.kunci, 4.5);
    if (v.mundur != null) C.mundur = sc.start + T(v.mundur, 1.5);
    (v.chip || []).forEach((c, i) => { C.chip[i] = sc.start + T(c, 3 + i * 0.5); });
    if (v.siap != null) C.siap = sc.start + T(v.siap, 1.2);
    if (v.latih != null) C.latih = sc.start + T(v.latih, 3);
    if (v.cta) C.tutup = sc.start;
    if (v.layar && !el.layar) {
      const L = v.layar; C.layar = sc.start + T(L.at, 2);
      el.layar = PD.layar(lapis, L.nama, { w: pick(1100, 1000), potong: L.potong, judul: L.judul });
      el.layar.style.left = pick(X2, 40) + 'px'; el.layar.style.top = (Y2 + pick(150, 130)) + 'px'; el.layar.style.opacity = 0;
    }
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
