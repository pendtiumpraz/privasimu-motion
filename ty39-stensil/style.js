// Gaya TY39 · STENSIL: tiap kata/baris = elemen teks stensil yang "disemprot": muncul per huruf (opacity + halo
// overspray lewat text-shadow), tepi kasar lewat filter SVG turbulensi, tetesan = garis yang tumbuh dari dasar huruf
// (posisi dari hash, diukur sekali). Semua dari waktu global; "bersih" memudarkan semua semprotan.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KATA = ['DILARANG', 'PATUH', 'SETENGAH-SETENGAH'];
  const DAFTAR = ['RoPA ADA — BUKTI TIDAK', 'KEBIJAKAN ADA — PELATIHAN TIDAK', 'DPIA ADA — MITIGASI TIDAK'];
  const JEDA = 0.045;
  const C = { semprot: [9e9, 9e9, 9e9], panah: 9e9, daftar: [9e9, 9e9, 9e9], bersih: 9e9, label: 9e9, tutup: 9e9 };
  let lapis = null, kataEl = [], daftarEl = [], panah = null, label = null, tetes = [], diukur = false;

  function pecah(el) { const t = el.textContent; el.textContent = ''; return [...t].map((ch) => { const s = document.createElement('span'); s.className = 'st-h'; s.textContent = ch === ' ' ? ' ' : ch; el.appendChild(s); return s; }); }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('st-lapis');
    lapis.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute"><filter id="st-kasar"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter></svg>`);
    const blok = h(`<div class="st-blok">${KATA.map((k, i) => `<div class="st-kata k${i}">${k}</div>`).join('')}</div>`);
    lapis.appendChild(blok);
    kataEl = [...blok.querySelectorAll('.st-kata')].map((el) => ({ el, huruf: pecah(el) }));
    panah = h('<div class="st-panah">↓</div>'); lapis.appendChild(panah);
    const dl = h(`<div class="st-daftar">${DAFTAR.map((d) => `<div class="st-baris">${esc(d)}</div>`).join('')}</div>`);
    lapis.appendChild(dl);
    daftarEl = [...dl.querySelectorAll('.st-baris')].map((el) => ({ el, huruf: pecah(el) }));
    label = h('<div class="st-label">GAP ASSESSMENT ↓</div>'); lapis.appendChild(label);
  }
  function ukurTetes() { // tetesan cat di bawah beberapa huruf kata besar (diukur sekali setelah font siap)
    if (diukur) return; diukur = true;
    const r0 = lapis.getBoundingClientRect(), sc = SW / r0.width;
    kataEl.forEach(({ huruf }, i) => huruf.forEach((s, j) => {
      if (hash(i * 17 + j * 3.1) < 0.74) return;
      const r = s.getBoundingClientRect(), x = (r.left - r0.left) * sc + (0.3 + 0.4 * hash(j * 5.7 + i)) * r.width * sc, y = (r.bottom - r0.top) * sc - 14;
      const el = h(`<div class="st-tetes" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${(6 + hash(j + i * 9) * 6).toFixed(1)}px"></div>`);
      lapis.appendChild(el); tetes.push({ el, i, j, max: 40 + hash(j * 2.2 + i) * 110 });
    }));
  }
  function semprot(item, t0, t) {
    item.huruf.forEach((s, j) => { const k = P(t, t0 + j * JEDA, t0 + j * JEDA + 0.22); s.style.opacity = k.toFixed(3); s.style.transform = `scale(${lerp(1.12, 1, k).toFixed(3)})`; });
  }
  function gambar(t) {
    ukurTetes();
    const kb = P(t, C.bersih, C.bersih + 0.5);
    kataEl.forEach((item, i) => { semprot(item, C.semprot[i], t); item.el.style.opacity = (1 - kb).toFixed(3); });
    tetes.forEach(({ el, i, j, max }) => { const t0 = C.semprot[i] + j * JEDA + 0.3, u = t - t0; el.style.height = u > 0 ? `${Math.min(max, u * 90).toFixed(1)}px` : '0px'; el.style.opacity = (u > 0 ? 1 : 0) * (1 - kb); });
    const kp = P(t, C.panah, C.panah + 0.3); panah.style.opacity = (kp * (1 - kb)).toFixed(3); panah.style.transform = `translate(-50%, 0) scale(${lerp(1.3, 1, kp).toFixed(3)})`;
    daftarEl.forEach((item, i) => { semprot(item, C.daftar[i], t); item.el.style.opacity = (1 - kb).toFixed(3); });
    const kl = P(t, C.label, C.label + 0.3); label.style.opacity = kl.toFixed(3); label.style.transform = `translate(-50%, 0) rotate(-3deg) scale(${lerp(1.3, 1, kl).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Black Ops One"', '800 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#8E8B85'; cx.fillRect(0, 0, W, H);
      // tekstur beton (statis dari hash)
      for (let i = 0; i < 2600; i++) { const g = 120 + hash(i * 1.9) * 60; cx.fillStyle = `rgba(${g},${g},${g - 4},${(0.15 + hash(i * 2.3) * 0.25).toFixed(2)})`; const s = 1 + hash(i * 0.7) * 5; cx.fillRect(hash(i * 3.1) * W, hash(i * 4.7) * H, s, s); }
      cx.fillStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 6; i++) cx.fillRect(0, (i / 6) * H + 30, W, 2); // garis cetakan beton
    },
  });

  KIT.registerType('st', (root, v, sc, tm, T) => {
    ensure();
    (v.semprot || []).forEach(([i, c]) => { C.semprot[i] = sc.start + T(c, 0.5 + i); });
    if (v.panah != null) C.panah = sc.start + T(v.panah, 0.1);
    if (v.daftar) v.daftar.forEach((c, i) => { C.daftar[i] = sc.start + T(c, 0.5 + i * 1.5); });
    if (v.bersih != null) C.bersih = sc.start + T(v.bersih, 0.2);
    if (v.label != null) C.label = sc.start + T(v.label, 0.4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(760, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(300, 560)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px) rotate(-1.5deg)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
