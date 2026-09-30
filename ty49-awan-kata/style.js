// Gaya TY49 · AWAN KATA: kata diurutkan dari bobot terbesar; posisi dicari sekali di sepanjang spiral Archimedes sampai
// tidak tumpang tindih (ukuran diukur lewat kanvas). Tiap kata tumbuh pada waktunya (mulai + urutan × jeda); kata utama
// berdenyut; pada "baru" awan meredup dan kata "TERCATAT" membesar di pusat.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KATA = [['revisi', 10], ['rapat', 8], ['form', 7], ['tenggat', 7], ['audit', 6], ['RoPA', 6], ['draf', 6], ['FINAL', 5], ['lembur', 5], ['kopi', 5], ['urgent', 5], ['DPIA', 5], ['sebentar', 4], ['reply all', 4], ['excel', 4], ['deadline', 4], ['consent', 4], ['DSR', 4], ['insiden', 4], ['versi', 4], ['tolong', 4], ['nanti', 4], ['zoom', 3], ['notula', 3], ['tab', 3], ['bukti', 3], ['pihak ketiga', 3], ['approval', 3], ['screenshot', 3], ['minggu depan', 3]];
  const WARNA = ['#E63946', '#1D3557', '#457B9D', '#F4A261', '#2A9D8F', '#6D597A', '#B5838D', '#E9C46A'];
  const C = { mulai: 9e9, utama: 9e9, sorot: {}, baru: 9e9, tutup: 9e9 };
  let lapis = null, items = [], baru = null, catatan = null, diukur = false;
  const CX = SW / 2, CY = pick(520, 900);

  function ukuran(w) { return pick(30, 26) + w * pick(11, 10); }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ak-lapis');
    items = KATA.map(([k, w], i) => { const el = h(`<div class="ak-kata" style="font-size:${ukuran(w)}px;color:${WARNA[i % WARNA.length]}">${esc(k)}</div>`); lapis.appendChild(el); return { el, k, w, i }; });
    baru = h(`<div class="ak-baru"><b>TERCATAT</b><img src="${PD.LOGO}" alt=""></div>`); lapis.appendChild(baru);
    catatan = h('<div class="ak-catatan">*frekuensi ilustrasi</div>'); lapis.appendChild(catatan);
  }
  function tempatkan() { // spiral, sekali (setelah font siap)
    if (diukur) return; diukur = true;
    const cv = document.createElement('canvas').getContext('2d'), rects = [];
    const tabrak = (r) => rects.some((q) => !(r.x + r.w < q.x || q.x + q.w < r.x || r.y + r.h < q.y || q.y + q.h < r.y));
    const batasX = V ? [40, SW - 40] : [60, SW - 60], batasY = V ? [230, 1400] : [60, SH - 60];
    items.forEach((it) => {
      cv.font = `900 ${ukuran(it.w)}px Inter`; const w = cv.measureText(it.k).width + 14, hh = ukuran(it.w) * 1.05;
      let ditaruh = false;
      for (let s = 0; s < 4000 && !ditaruh; s++) {
        const a = s * 0.35, rad = s * (V ? 0.7 : 1.1), x = CX + Math.cos(a) * rad * (V ? 0.8 : 1.35) - w / 2, y = CY + Math.sin(a) * rad - hh / 2;
        const r = { x, y, w, h: hh };
        if (x < batasX[0] || x + w > batasX[1] || y < batasY[0] || y + hh > batasY[1]) continue;
        if (!tabrak(r)) { rects.push(r); it.x = x + w / 2; it.y = y + hh / 2; ditaruh = true; }
      }
      if (!ditaruh) { it.x = CX; it.y = -500; }
    });
  }
  function gambar(t) {
    tempatkan();
    const kb = E.io3(P(t, C.baru, C.baru + 0.9));
    items.forEach((it) => {
      const t0 = C.mulai + it.i * 0.11, k = E.outBack(Math.max(0.001, P(t, t0, t0 + 0.45)));
      const utama = it.k === 'revisi', ku = utama ? 1 + 0.08 * Math.sin((t - C.utama) * 6) * (t >= C.utama ? 1 : 0) : 1;
      const ts = C.sorot[it.k], nyala = ts != null && t >= ts && t < ts + 1.2;
      it.el.style.opacity = (t >= t0 ? 1 : 0) * lerp(1, 0.18, kb);
      it.el.style.transform = `translate(${it.x.toFixed(1)}px, ${it.y.toFixed(1)}px) translate(-50%, -50%) scale(${(k * ku * lerp(1, 0.86, kb) * (nyala ? 1.18 : 1)).toFixed(3)}) rotate(${(it.k === 'FINAL' && nyala ? (hash(Math.floor(t * 30)) - 0.5) * 8 : 0).toFixed(1)}deg)`;
      it.el.classList.toggle('nyala', nyala || (utama && t >= C.utama && kb < 1));
      it.el.style.filter = kb > 0 ? `blur(${(kb * 2).toFixed(1)}px)` : '';
    });
    const kn = E.outBack(Math.max(0.001, P(t, C.baru + 0.2, C.baru + 0.8)));
    baru.style.opacity = t >= C.baru + 0.2 ? 1 : 0; baru.style.transform = `translate(-50%, -50%) scale(${kn.toFixed(3)})`;
    catatan.style.opacity = t >= C.mulai + 2 ? 0.8 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '800 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F7F1E4'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.05)'; for (let x = 0; x < W; x += 44) for (let y = 0; y < H; y += 44) cx.fillRect(x, y, 2, 2);
    },
  });

  KIT.registerType('ak', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0.2);
    if (v.utama != null) C.utama = sc.start + T(v.utama, 3);
    (v.sorot || []).forEach(([k, c], i) => { C.sorot[k] = sc.start + T(c, 0.5 + i * 0.8); });
    if (v.baru != null) C.baru = sc.start + T(v.baru, 1.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
