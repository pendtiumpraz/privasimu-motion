// Gaya TY29 · GEMA: kata inti + 7 gema (salinan stroke-only) di lapisan lintas scene. Tiap gema bergerak dari pusat ke
// arahnya dengan jeda; saat disebut, gema berubah jadi label sistem; saat "kembali", label berbalik menjadi centang.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const SISTEM = ['CRM', 'Email', 'Layanan pelanggan', 'Arsip', 'Cloud', 'Spreadsheet', 'Cadangan'];
  const N = SISTEM.length, R = pick(540, 430), CX = SW / 2, CY = pick(470, 760);
  const C = { denyut: 9e9, gema: 9e9, label: SISTEM.map(() => 9e9), kembali: 9e9, selesai: 9e9, tutup: 9e9 };
  let lapis = null, inti = null, gema = [], skor = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('gm-lapis');
    gema = SISTEM.map((nm, i) => {
      const el = h(`<div class="gm-gema"><span class="kt">HAPUS</span><span class="lb">${esc(nm)}</span><span class="ok">✓</span></div>`);
      lapis.appendChild(el);
      const a = -Math.PI / 2 + (i / N) * Math.PI * 2 + (V ? 0.22 : 0);
      return { el, a, rx: V ? 395 : R, ry: V ? 600 : R * 0.78 };
    });
    inti = h(`<div class="gm-inti">HAPUS</div>`);
    lapis.appendChild(inti);
    skor = h('<div class="gm-skor">0 / 7 sistem</div>');
    lapis.appendChild(skor);
  }
  function gambar(t) {
    const den = Math.sin(Math.PI * P(t, C.denyut, C.denyut + 0.5));
    let n = 0;
    gema.forEach((g, i) => {
      const t0 = C.gema + i * 0.08, k = E.out3(P(t, t0, t0 + 1.0));
      const kl = P(t, C.label[i], C.label[i] + 0.3), kk = E.io3(P(t, C.kembali + i * 0.12, C.kembali + i * 0.12 + 0.6));
      const ks = P(t, C.selesai + i * 0.06, C.selesai + i * 0.06 + 0.3);
      if (t >= C.selesai + i * 0.06) n++;
      const jar = k * (1 - kk * 0.08);
      const x = CX + Math.cos(g.a) * g.rx * jar, y = CY + Math.sin(g.a) * g.ry * jar;
      g.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      g.el.style.opacity = k > 0 ? (0.25 + 0.75 * (1 - i / N * 0.6)).toFixed(3) : 0;
      g.el.classList.toggle('label', kl > 0 && ks <= 0);
      g.el.classList.toggle('cek', ks > 0);
      $('.kt', g.el).style.opacity = kl > 0 ? 0 : 1;
      $('.lb', g.el).style.transform = `scale(${E.outBack(kl).toFixed(3)})`;
      $('.ok', g.el).style.transform = `scale(${E.outBack(ks).toFixed(3)})`;
    });
    inti.style.transform = `translate(-50%, -50%) scale(${(1 + 0.12 * den).toFixed(3)})`;
    inti.style.left = CX + 'px'; inti.style.top = CY + 'px';
    skor.textContent = t >= C.selesai + (N - 1) * 0.06 + 0.2 ? '7 / 7 selesai' : `${n} / 7 sistem`;
    skor.style.left = CX + 'px'; skor.style.top = CY + pick(140, 130) + 'px';
    skor.style.opacity = P(t, C.kembali, C.kembali + 0.4);
    skor.classList.toggle('selesai', n >= N);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 100px Unbounded', '700 60px Unbounded', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0A0D1A'; cx.fillRect(0, 0, W, H);
      // cincin gema samar di latar
      cx.strokeStyle = 'rgba(120,140,255,.08)'; cx.lineWidth = 2;
      for (let i = 1; i <= 5; i++) { cx.beginPath(); cx.arc(W / 2, pick(470, 760), i * 130 + (t * 40) % 130, 0, 7); cx.stroke(); }
    },
  });

  KIT.registerType('gm', (root, v, sc, tm, T) => {
    ensure();
    if (v.denyut != null) C.denyut = sc.start + T(v.denyut, 1);
    if (v.gema != null) C.gema = sc.start + T(v.gema, 0.3);
    if (v.label) v.label.forEach((c, i) => { C.label[i] = sc.start + T(c, 1 + i * 0.5); });
    if (v.kembali != null) C.kembali = sc.start + T(v.kembali, 0.5);
    if (v.selesai != null) C.selesai = sc.start + T(v.selesai, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="gm-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, v.teksAt ? { dari: T(v.teksAt, 0) - 0.05 } : {});
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.pil != null) {
      const tP = T(v.pil, 3), LW = pick(460, 480);
      const lensa = PD.layar(root, 'dsr-detail', { w: LW, potong: [852, 100, 126, 46], bar: false, kelas: 'gm-pil' });
      lensa.style.left = pick(SW - LW - 120, (SW - LW) / 2) + 'px'; lensa.style.top = pick(80, 260) + 'px';
      parts.push((lt) => { const k = P(lt, tP, tP + 0.5); tf(lensa, { s: k > 0 ? E.outBack(k) : 0, o: cl(k * 3) }); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
