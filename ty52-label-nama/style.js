// Gaya TY52 · LABEL NAMA: stiker utama + 6 stiker tugas di lapisan lintas scene, semua digambar dari waktu global.
// Tulisan spidol = span per huruf yang muncul berurutan (JEDA), sedikit miring/melompat seperti goresan tangan.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.11;
  const TUGAS = ['RoPA', 'DPIA', 'DSR 72 jam', 'Insiden 3×24 jam', 'Consent', 'Pihak ketiga'];
  const POS = V
    ? [[300, 270, -8], [790, 285, 6], [260, 1000, 5], [810, 990, -7], [330, 1240, -4], [770, 1255, 8]]
    : [[300, 250, -8], [1620, 235, 6], [250, 620, 5], [1660, 640, -7], [520, 900, -4], [1400, 900, 8]];
  const C = { tempel: 9e9, tulis: 9e9, sub: 9e9, tugas: [9e9, 9e9, 9e9, 9e9, 9e9, 9e9], bersih: 9e9, siap: 9e9, tutup: 9e9 };
  let lapis = null, utama = null, hurufDpo = [], hurufSub = [], hurufSiap = [], coret = null, tugasEl = [];

  function spidol(el) { const t = el.textContent; el.textContent = ''; return [...t].map((ch) => { const s = h(`<span class="nt-h">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`); el.appendChild(s); return s; }); }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('nt-lapis');
    utama = h(`<div class="nt-stiker utama"><div class="nt-atas"><b>HALO</b><span>nama saya:</span></div><div class="nt-isi"><div class="nt-nama">DPO</div><div class="nt-sub"><span class="nt-lama">(sejak kemarin sore)<i class="nt-coret"></i></span><span class="nt-siap">siap ✓</span></div></div></div>`);
    lapis.appendChild(utama);
    hurufDpo = spidol(utama.querySelector('.nt-nama'));
    const lama = utama.querySelector('.nt-lama'); coret = lama.querySelector('.nt-coret'); lama.removeChild(coret);
    hurufSub = spidol(lama); lama.appendChild(coret);
    hurufSiap = spidol(utama.querySelector('.nt-siap'));
    tugasEl = TUGAS.map((t, i) => {
      const el = h(`<div class="nt-stiker kecil" data-bebas="1"><div class="nt-atas"><b>HALO</b><span>tugas saya:</span></div><div class="nt-isi"><div class="nt-nama">${esc(t)}</div></div></div>`);
      lapis.appendChild(el); return el;
    });
  }
  function tulisan(spans, t0, t) { spans.forEach((s, j) => { const k = P(t, t0 + j * JEDA, t0 + j * JEDA + 0.08); s.style.opacity = k > 0 ? 1 : 0; s.style.transform = `translateY(${((1 - k) * 6).toFixed(1)}px) rotate(${((hash(j * 3.3) - 0.5) * 5).toFixed(2)}deg)`; }); }
  function gambar(t) {
    const pm = P(t, C.tempel, C.tempel + 0.45), masuk = pm > 0 ? E.outBack(pm) : 0;
    const pindah = E.io3(P(t, C.bersih, C.bersih + 0.8));
    // stiker utama: tengah (s1–s2) → atas mengecil (s3)
    const cx = SW / 2, cy = lerp(pick(480, 640), pick(235, 440), pindah), s = lerp(1, pick(0.62, 0.8), pindah) * lerp(1.25, 1, masuk), rot = lerp(-3, -2, pindah);
    utama.style.opacity = masuk > 0 ? 1 : 0;
    utama.style.transform = `translate(${cx}px, ${cy.toFixed(1)}px) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;
    tulisan(hurufDpo, C.tulis, t);
    tulisan(hurufSub, C.sub, t);
    const kc = P(t, C.siap, C.siap + 0.35);
    coret.style.width = `${(kc * 104).toFixed(1)}%`;
    tulisan(hurufSiap, C.siap + 0.4, t);
    // stiker tugas: ditampar masuk pada cue, berjatuhan saat "bersih"
    tugasEl.forEach((el, i) => {
      const [x, y, r] = POS[i], pk = P(t, C.tugas[i], C.tugas[i] + 0.3), k = pk > 0 ? E.outBack(pk) : 0, jatuh = P(t, C.bersih + i * 0.06, C.bersih + i * 0.06 + 0.7);
      const dy = jatuh * jatuh * (SH + 400), dr = jatuh * (i % 2 ? 60 : -50);
      el.style.opacity = k > 0 && jatuh < 1 ? 1 : 0;
      el.style.transform = `translate(${x}px, ${(y + dy).toFixed(1)}px) translate(-50%, -50%) rotate(${(r + dr).toFixed(2)}deg) scale(${lerp(1.6, 1, Math.max(0, k)).toFixed(3)})`;
    });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Permanent Marker"', '700 60px Caveat', '700 60px Inter', '500 30px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F3EEE4'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.05)';
      for (let i = 0; i < 400; i++) cx.fillRect(hash(i * 1.7) * W, hash(i * 2.9) * H, 2, 2); // serat kertas
    },
  });

  KIT.registerType('nt', (root, v, sc, tm, T) => {
    ensure();
    if (v.tempel != null) C.tempel = sc.start + T(v.tempel, 0);
    if (v.tulis != null) C.tulis = sc.start + T(v.tulis, 0.9);
    if (v.sub != null) C.sub = sc.start + T(v.sub, 2.2);
    if (v.tugas) v.tugas.forEach((c, i) => { C.tugas[i] = sc.start + T(c, 0.6 + i * 0.8); });
    if (v.bersih != null) C.bersih = sc.start + T(v.bersih, 0.3);
    if (v.siap != null) C.siap = sc.start + T(v.siap, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1100, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(430, 780)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
