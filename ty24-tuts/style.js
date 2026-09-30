// Gaya TY24 · TUTS KEYBOARD: layar kecil + tuts di lapisan lintas scene. Tekanan = fungsi waktu (turun cepat, naik
// dengan pantulan). Tuts FIRE DRILL menggeser Ctrl+Z ke luar.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { tekan: [], undo: 9e9, bocor: 9e9, gagal: 9e9, drill: 9e9, tekanDrill: 9e9, tutup: 9e9 };
  let lapis = null, layar = null, ctrl = null, z = null, drill = null, tip = null, tekanEl = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kb-lapis');
    layar = h(`<div class="kb-layar" style="top:${pick(120, 330)}px"><div class="bar"><i></i><i></i><i></i></div><div class="isi"><span class="a">laporan bulanan final</span><span class="typo">l</span><span class="ext">.docx</span><i class="kursor"></i></div><div class="cek">✓ dibatalkan</div><div class="bocor">⚠ DATA PELANGGAN BOCOR</div></div>`);
    lapis.appendChild(layar);
    const ky = pick(590, 1120);
    ctrl = h(`<div class="kb-tuts lebar" style="left:${pick(560, 170)}px;top:${ky}px"><span>Ctrl</span></div>`);
    z = h(`<div class="kb-tuts" style="left:${pick(1060, 640)}px;top:${ky}px"><span>Z</span></div>`);
    drill = h(`<div class="kb-tuts drill" style="left:${pick(510, 140)}px;top:${ky}px"><span>FIRE DRILL</span></div>`);
    tip = h('<div class="kb-tip">✕ tidak bisa dibatalkan</div>');
    lapis.appendChild(ctrl); lapis.appendChild(z); lapis.appendChild(drill); lapis.appendChild(tip);
    lapis.appendChild(h(`<div class="kb-plus" style="left:${pick(985, 570)}px;top:${ky + 60}px">+</div>`));
  }
  const tekanan = (t, kapan, tahan = 0.22) => kapan.reduce((m, t0) => Math.max(m, t >= t0 && t < t0 + tahan ? (t < t0 + 0.06 ? (t - t0) / 0.06 : 1 - E.outBack(P(t, t0 + 0.1, t0 + tahan)) * 0.98) : 0), 0);
  function tekan(el, k) {
    el.style.transform = `translateY(${(k * 10).toFixed(1)}px)`;
    el.style.boxShadow = `0 ${(12 - k * 10).toFixed(1)}px 0 #1C2130, 0 ${(26 - k * 16).toFixed(0)}px 40px rgba(0,0,0,.45)`;
    el.classList.toggle('on', k > 0.5);
  }
  function gambar(t) {
    const k = tekanan(t, C.tekan);
    tekan(ctrl, k); tekan(z, k);
    tekan(drill, tekanan(t, [C.tekanDrill], 0.3));
    // layar: salah ketik hilang setelah undo pertama; teks bocor muncul; gagal → layar bergetar merah
    layar.classList.toggle('undo', t >= C.undo);
    layar.classList.toggle('bocor', t >= C.bocor);
    const g = t > C.gagal && t < C.gagal + 0.4 ? (1 - (t - C.gagal) / 0.4) * 12 : 0;
    layar.style.transform = `translateX(${((hash(Math.floor(t * 40)) - 0.5) * g).toFixed(1)}px)`;
    $('.kursor', layar).style.opacity = Math.floor(t * 2.5) % 2 === 0 ? 1 : 0;
    const kt = P(t, C.gagal, C.gagal + 0.3);
    tf(tip, { s: kt > 0 ? E.outBack(kt) : 0, o: cl(kt * 3) * (1 - P(t, C.drill, C.drill + 0.3)) });
    tip.style.left = pick(760, 300) + 'px'; tip.style.top = pick(510, 1040) + 'px';
    // tuts FIRE DRILL menggeser Ctrl+Z ke luar layar
    const kd = E.io3(P(t, C.drill, C.drill + 0.7));
    ctrl.style.left = pick(560, 170) - kd * 1400 + 'px'; z.style.left = pick(1060, 640) + kd * 1400 + 'px';
    $('.kb-plus', lapis).style.opacity = 1 - kd;
    drill.style.opacity = kd; drill.style.top = (pick(590, 1120) + (1 - kd) * 200) + 'px';
    ctrl.toggleAttribute('data-bebas', kd > 0.3); z.toggleAttribute('data-bebas', kd > 0.3);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Inter', '700 60px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#262B3A'); g.addColorStop(1, '#0F121B');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('kb', (root, v, sc, tm, T) => {
    ensure();
    (v.tekan || []).forEach(([c]) => C.tekan.push(sc.start + T(c, 1)));
    if (v.undoKetik != null) C.undo = sc.start + T(v.undoKetik, 1);
    if (v.bocor != null) C.bocor = sc.start + T(v.bocor, 0.3);
    if (v.gagal != null) C.gagal = sc.start + T(v.gagal, 2);
    if (v.drill != null) C.drill = sc.start + T(v.drill, 0.3);
    if (v.tekanDrill != null) C.tekanDrill = sc.start + T(v.tekanDrill, 2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="kb-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.tekanDrill != null) {
      const tD = T(v.tekanDrill, 2), W0 = pick(1100, 940);
      const kartu = PD.layar(root, 'fire-drill-header', { w: W0, potong: [0, 0, 1240, 260], judul: 'Privasimu Nexus · Fire Drill' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(110, 300) + 'px';
      const cips = (v.cip || []).map(([teks, at], i) => { const el = h(`<div class="kb-cip">${esc(teks)}</div>`); root.appendChild(el); el.style.left = pick(560 + i * 290, 150 + i * 280) + 'px'; el.style.top = pick(470, 720) + 'px'; return { el, t: T(at, 3 + i) }; });
      parts.push((lt) => {
        const k = E.outBack(P(lt, tD + 0.1, tD + 0.6));
        tf(kartu, { y: (1 - cl(k)) * -60, s: 0.9 + 0.1 * k, o: cl(k * 3) });
        layar.style.opacity = 1 - P(lt, tD, tD + 0.3);
        cips.forEach((c) => { const kc = P(lt, c.t, c.t + 0.35); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) }); });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
