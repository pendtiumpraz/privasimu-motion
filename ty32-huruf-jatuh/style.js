// Gaya TY32 · HURUF JATUH: paragraf dipecah per huruf (posisi diukur sekali saat render pertama). Sejak cue "runtuh"
// tiap huruf lepas pada waktunya (hash), jatuh dengan gravitasi, memantul sekali, lalu diam di tumpukan dasar
// (tinggi tumpukan dari hash). Pada "susun" huruf tumpukan memudar dan huruf daftar temuan naik dari dasar ke posisinya.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const PARAGRAF = 'Dengan mengakses dan/atau menggunakan Layanan, Pengguna dinyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan pemrosesan Data Pribadi sebagaimana diuraikan dalam Bagian 4.2.1 sampai dengan Bagian 17.9, termasuk namun tidak terbatas pada pengumpulan, penyimpanan, pengalihan, dan pengungkapan kepada mitra, afiliasi, serta pihak ketiga yang bekerja sama dengan kami dari waktu ke waktu, sesuai kebijakan yang dapat diubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.';
  const TEMUAN = [['TEMUAN PER BAB', 'k'], ['Bab 4 · Dasar pemrosesan — belum disebut', 'b'], ['Bab 9 · Hak subjek data — kanal tidak ada', 'b'], ['Bab 12 · Pihak ketiga — tanpa klausul', 'b'], ['*contoh temuan · rujukan pasal dari knowledge base', 'c']];
  const G = 2600; // px/dtk²
  const C = { runtuh: 9e9, susun: 9e9, tutup: 9e9 };
  let lapis = null, hal = null, huruf = null, temuanEl = null, temuanHuruf = null, DASAR = 0;

  function pecah(el) { // teks → span per huruf (spasi dibiarkan sebagai teks)
    const out = [];
    const jalan = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) { const f = document.createDocumentFragment(); [...c.textContent].forEach((ch) => { if (ch === ' ') { f.appendChild(document.createTextNode(' ')); return; } const s = document.createElement('span'); s.className = 'hj-h'; s.dataset.bebas = '1'; s.textContent = ch; f.appendChild(s); out.push(s); }); node.replaceChild(f, c); }
        else jalan(c);
      });
    };
    jalan(el); return out;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('hj-lapis');
    hal = h(`<div class="hj-hal"><div class="hj-kop">KEBIJAKAN PRIVASI · hlm. 17 dari 40<i>*ilustrasi</i></div><p class="hj-p">${esc(PARAGRAF)}</p></div>`);
    lapis.appendChild(hal);
    temuanEl = h(`<div class="hj-temuan">${TEMUAN.map(([t, k]) => `<div class="hj-t ${k}">${esc(t)}</div>`).join('')}</div>`);
    lapis.appendChild(temuanEl);
    DASAR = pick(SH - 120, 1500);
  }
  function ukur() { // posisi awal huruf (sekali, setelah font siap)
    if (huruf) return;
    const spans = pecah(hal.querySelector('.hj-p'));
    const r0 = hal.getBoundingClientRect();
    huruf = spans.map((s, j) => { const r = s.getBoundingClientRect(); return { s, x: r.left - r0.left, y: r.top - r0.top, w: r.width, hh: r.height, j }; });
    huruf.forEach((o) => { o.s.style.position = 'absolute'; o.s.style.left = `${o.x}px`; o.s.style.top = `${o.y}px`; });
    hal.querySelector('.hj-p').style.height = `${hal.querySelector('.hj-p').offsetHeight}px`;
    temuanHuruf = [...temuanEl.querySelectorAll('.hj-t')].flatMap((b) => pecah(b));
    const rt = temuanEl.getBoundingClientRect();
    temuanHuruf.forEach((s, j) => { const r = s.getBoundingClientRect(); s._x = r.left - rt.left; s._y = r.top - rt.top; s._j = j; });
    temuanHuruf.forEach((s) => { s.style.position = 'absolute'; s.style.left = `${s._x}px`; s.style.top = `${s._y}px`; });
    temuanEl.style.height = `${temuanEl.offsetHeight}px`;
  }
  function jatuh(o, t, halTop) {
    const tau = C.runtuh + hash(o.j * 1.7) * 1.6 + (o.y / 600) * 0.4, u = t - tau;
    if (u <= 0) { o.s.style.transform = ''; o.s.style.opacity = 1; return; }
    const lantai = DASAR - halTop - hash(o.j * 3.1) * 110 - o.hh; // y akhir relatif halaman
    const jarak = Math.max(1, lantai - o.y), u1 = Math.sqrt(2 * jarak / G), vb = 0.35 * G * u1, u2 = 2 * vb / G;
    let dy;
    if (u < u1) dy = 0.5 * G * u * u;
    else if (u < u1 + u2) { const w = u - u1; dy = jarak - vb * w + 0.5 * G * w * w; }
    else dy = jarak;
    const dx = (hash(o.j * 5.3) - 0.5) * 160 * Math.min(1, u / (u1 + u2));
    const rot = (hash(o.j * 7.9) - 0.5) * 540 * Math.min(1, u / (u1 + u2));
    o.s.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
  }
  function gambar(t) {
    ukur();
    const halTop = hal.offsetTop;
    const ks = P(t, C.susun, C.susun + 0.5);
    huruf.forEach((o) => { jatuh(o, t, halTop); if (ks > 0) o.s.style.opacity = (1 - ks).toFixed(3); });
    hal.classList.toggle('runtuh', t >= C.runtuh);
    hal.style.opacity = (1 - P(t, C.susun + 0.2, C.susun + 0.8)).toFixed(3);
    // huruf temuan: naik dari dasar (posisi acak) ke tempatnya
    const tTop = temuanEl.offsetTop;
    temuanHuruf.forEach((s) => {
      const t0 = C.susun + 0.1 + (s._j / temuanHuruf.length) * 0.9, k = E.io3(P(t, t0, t0 + 0.7));
      s.style.opacity = k > 0 ? 1 : 0;
      const y0 = DASAR - tTop - hash(s._j * 2.3) * 100 - s._y, x0 = (hash(s._j * 4.1) - 0.5) * 700;
      s.style.transform = `translate(${(x0 * (1 - k)).toFixed(1)}px, ${(y0 * (1 - k)).toFixed(1)}px) rotate(${((hash(s._j) - 0.5) * 360 * (1 - k)).toFixed(1)}deg)`;
    });
    temuanEl.style.opacity = t >= C.susun ? 1 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px Newsreader', '600 60px Newsreader', '800 60px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F4EFE6'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(70,50,20,.08)'; cx.fillRect(0, (W > H ? H - 120 : 1500), W, H); // dasar tempat huruf menumpuk
      cx.fillStyle = 'rgba(70,50,20,.18)'; cx.fillRect(0, (W > H ? H - 120 : 1500), W, 3);
    },
  });

  KIT.registerType('hj', (root, v, sc, tm, T) => {
    ensure();
    if (v.runtuh != null) C.runtuh = sc.start + T(v.runtuh, 2.4);
    if (v.susun != null) C.susun = sc.start + T(v.susun, 1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="hj-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1000, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(480, 900)}px`;
      const t0 = T(L.at, 1);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
