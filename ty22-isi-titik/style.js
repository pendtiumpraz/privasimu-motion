// Gaya TY22 · ISI TITIK-TITIK: lembar soal di lapisan lintas scene. Jawaban = huruf pensil yang muncul per karakter,
// lalu "dihapus" (memudar dengan noda) sebelum jawaban berikutnya. Kunci jawaban = kartu katalog yang meluncur masuk.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { jawab: [], kunci: 9e9, centang: 9e9, ropa: 9e9, tutup: 9e9 };
  let lapis = null, kertas = null, jawabEl = [], pensil = null, kunci = null, rows = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('it-lapis');
    const W0 = pick(1400, 980);
    kertas = h(`<div class="it-kertas" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(250, 250)}px">
      <div class="it-kop"><span>LEMBAR SOAL · KEPATUHAN DATA</span><span>Nama: ____________</span></div>
      <p class="it-soal"><b>1.</b> Data pelanggan kami disimpan di <span class="it-blank"><span class="it-jwb"></span></span>.</p>
      <p class="it-soal redup"><b>2.</b> Siapa saja pihak ketiga yang menerimanya? <span class="it-blank kecil"></span></p>
      <p class="it-soal redup"><b>3.</b> Berapa lama disimpan? <span class="it-blank kecil"></span></p>
    </div>`);
    lapis.appendChild(kertas);
    pensil = h('<div class="it-pensil">✏️</div>');
    lapis.appendChild(pensil);
    kunci = h(`<div class="it-kunci" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(600, 1000)}px">
      <div class="kh">KUNCI JAWABAN · Katalog sistem &amp; sumber data <span>*ilustrasi tampilan</span></div>
      ${[['CRM pelanggan', 'nama, email, no. HP'], ['Server email', 'korespondensi'], ['Spreadsheet HR', 'NIK, gaji'], ['Penyedia cloud (pihak ketiga)', 'cadangan basis data']]
        .map((r) => `<div class="kr"><i class="cek"></i><b>${esc(r[0])}</b><span>${esc(r[1])}</span><em>→ RoPA</em></div>`).join('')}
    </div>`);
    lapis.appendChild(kunci);
    rows = [...kunci.querySelectorAll('.kr')];
  }
  function jawabanAktif(t) {
    let a = null;
    C.jawab.forEach((j) => { if (t >= j.t) a = j; });
    return a;
  }
  function gambar(t) {
    const jw = $('.it-jwb', kertas), a = jawabanAktif(t);
    if (a) {
      if (jw._a !== a) { jw._a = a; jw.innerHTML = [...a.teks].map((ch) => `<span>${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join(''); }
      const u = t - a.t, n = a.teks.length, tampil = Math.min(n, Math.floor(u / 0.05) + 1);
      const hapus = a.akhir ? P(t, a.akhir - 0.35, a.akhir - 0.05) : 0;
      [...jw.children].forEach((sp, j) => { sp.style.opacity = j < tampil ? (1 - hapus) : 0; });
      jw.style.transform = a.goyang && u > n * 0.05 ? `rotate(${(Math.sin(t * 14) * 3).toFixed(2)}deg)` : '';
      jw.style.filter = hapus > 0 ? `blur(${(hapus * 3).toFixed(1)}px)` : 'none';
    } else jw.innerHTML = '';
    // pensil melayang ragu di atas garis, mengetik saat jawaban muncul
    const bx = $('.it-blank', kertas), bl = kertas.offsetLeft + bx.offsetLeft + $('.it-soal', kertas).offsetLeft, bt = kertas.offsetTop + bx.offsetTop + $('.it-soal', kertas).offsetTop;
    const nulis = a && t < a.t + a.teks.length * 0.05;
    const px = bl + (nulis ? Math.min(bx.offsetWidth, (t - a.t) / 0.05 * 26) : bx.offsetWidth * 0.4 + Math.sin(t * 1.3) * 40);
    tf(pensil, { x: px, y: bt - 70 + (nulis ? 0 : Math.sin(t * 2.1) * 10), r: nulis ? -20 : -30 + Math.sin(t * 1.7) * 6, o: 1 - P(t, C.kunci, C.kunci + 0.3) });
    const kk = E.out3(P(t, C.kunci, C.kunci + 0.7));
    tf(kunci, { y: (1 - kk) * 400, o: kk, r: 1 });
    kertas.style.transform = `translateY(${(-kk * pick(200, 330)).toFixed(1)}px) rotate(-0.6deg)`;
    rows.forEach((r, i) => {
      const kc = P(t, C.centang + i * 0.3, C.centang + i * 0.3 + 0.3);
      $('.cek', r).style.transform = `scale(${E.outBack(kc).toFixed(3)})`;
      const kr = P(t, C.ropa + i * 0.08, C.ropa + i * 0.08 + 0.3);
      tf($('em', r), { s: kr > 0 ? E.outBack(kr) : 0, o: cl(kr * 3) });
    });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Patrick Hand"', '800 60px Nunito'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#7B8A6A'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.08)';
      for (let i = 0; i < 40; i++) cx.fillRect(hash(i) * W, hash(i + 40) * H, 2 + hash(i + 80) * 3, 2 + hash(i + 120) * 3);
    },
  });

  KIT.registerType('it', (root, v, sc, tm, T) => {
    ensure();
    if (v.jawab) {
      const js = v.jawab.map(([teks, at], i) => ({ teks, t: sc.start + T(at, 0.5 + i), goyang: /\?/.test(teks) }));
      js.forEach((j, i) => { j.akhir = js[i + 1] ? js[i + 1].t : null; });
      C.jawab.push(...js);
    }
    if (v.kunci != null) C.kunci = sc.start + T(v.kunci, 0.5);
    if (v.centang != null) C.centang = sc.start + T(v.centang, 1.5);
    if (v.ropa != null) C.ropa = sc.start + T(v.ropa, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="it-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
