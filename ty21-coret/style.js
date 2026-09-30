// Gaya TY21 · CORET & TULIS ULANG: halaman kebijakan di lapisan lintas scene. Koreksi = SVG path (lingkaran tangan,
// garis coret bergelombang, caret) yang digambar lewat stroke-dashoffset + tulisan tangan yang muncul per huruf.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { lingkar: 9e9, coret: [[9e9, 9e9], [9e9, 9e9]], layar: 9e9, tutup: 9e9 };
  let lapis = null, hal = null, edits = [], lingkar = null, tulisTahun = null;

  // path coret bergelombang selebar w (koordinat lokal)
  const coretPath = (w) => { let d = `M0 6`; for (let x = 0; x <= w; x += 18) d += ` L${x} ${6 + Math.sin(x * 0.35) * 3 + (hash(x) - 0.5) * 3}`; return d; };
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kr-lapis');
    const W0 = pick(1180, 980);
    hal = h(`<div class="kr-hal" style="width:${W0}px;left:${pick(120, (SW - W0) / 2)}px;top:${pick(70, 250)}px">
      <div class="kr-url"><i></i><i></i><i></i><span>www.contoh-toko.example/kebijakan-privasi</span></div>
      <h1>Kebijakan Privasi</h1>
      <div class="kr-meta">Terakhir diperbarui: <span class="thn">12 Maret 2019</span><svg class="kr-ling" viewBox="0 0 260 90"><path pathLength="1" d="M20 45 C 30 5, 240 0, 245 40 C 250 80, 60 92, 25 62 C 5 45, 40 18, 90 14"/></svg><span class="kr-tangan tahun">UU PDP: 2022!</span></div>
      <h2>Bab 2 · Persetujuan</h2>
      <p>Dengan menggunakan situs ini, <span class="kr-e e0">Anda dianggap setuju</span> terhadap pengumpulan data pribadi Anda.</p>
      <h2>Bab 5 · Hak pengguna</h2>
      <p>Untuk mengakses atau menghapus data Anda, silakan <span class="kr-e e1">hubungi kami via email</span>.</p>
      <h2>Bab 7 · Insiden</h2>
      <p class="kosong">(belum ada ketentuan)</p>
    </div>`);
    lapis.appendChild(hal);
    lingkar = $('.kr-ling path', hal); tulisTahun = $('.kr-tangan.tahun', hal);
    const GANTI = V ? ['persetujuan eksplisit (Ps. 20)', 'formulir DSR · tenggat 72 jam'] : ['persetujuan eksplisit (UU PDP Ps. 20)', 'formulir permohonan · tenggat 72 jam'];
    edits = [0, 1].map((i) => {
      const e = $('.e' + i, hal);
      const svg = h(`<svg class="kr-coret" viewBox="0 0 400 12" preserveAspectRatio="none"><path pathLength="1" d="${coretPath(400)}"/></svg>`); // lebar mengikuti span (CSS)
      e.appendChild(svg);
      const caret = h('<svg class="kr-caret" viewBox="0 0 30 24"><path pathLength="1" d="M3 22 L15 4 L27 22"/></svg>');
      e.appendChild(caret);
      const tulis = h(`<span class="kr-tangan ganti">${esc(GANTI[i])}</span>`);
      e.appendChild(tulis);
      const huruf = PD.huruf(tulis);
      return { e, garis: $('path', svg), caret: $('path', caret), tulis, huruf };
    });
  }
  function gambar(t) {
    lingkar.style.strokeDashoffset = (1 - E.io3(P(t, C.lingkar, C.lingkar + 0.7))).toFixed(3);
    const kt = P(t, C.lingkar + 0.6, C.lingkar + 1.3);
    tulisTahun.style.opacity = kt > 0 ? 1 : 0;
    tulisTahun.style.clipPath = `inset(0 ${((1 - kt) * 100).toFixed(1)}% 0 0)`;
    edits.forEach((ed, i) => {
      const [tc, tg] = C.coret[i];
      ed.garis.style.strokeDashoffset = (1 - E.out3(P(t, tc, tc + 0.45))).toFixed(3);
      ed.e.classList.toggle('mati', t >= tc + 0.3);
      ed.caret.style.strokeDashoffset = (1 - E.out3(P(t, tg - 0.25, tg))).toFixed(3);
      ed.huruf.forEach((l, j) => { l.style.opacity = t >= tg + j * 0.035 ? 1 : 0; });
    });
    const kl = E.io3(P(t, C.layar, C.layar + 0.8));
    hal.style.transform = `translate(${(kl * pick(-70, 0)).toFixed(1)}px, ${(kl * pick(0, -170)).toFixed(1)}px) scale(${lerp(1, pick(0.76, 0.8), kl).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Caveat', '400 40px Lora', '600 40px Lora'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#D9D4C7'; cx.fillRect(0, 0, W, H); cx.fillStyle = 'rgba(0,0,0,.05)'; for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 1); },
  });

  KIT.registerType('kr', (root, v, sc, tm, T) => {
    ensure();
    if (v.lingkar != null) C.lingkar = sc.start + T(v.lingkar, 1.5);
    (v.coret || []).forEach(([a, b], i) => { C.coret[i] = [sc.start + T(a, 1 + i * 3), sc.start + T(b, 2 + i * 3)]; });
    if (v.layar != null) C.layar = sc.start + T(v.layar, 0.3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="kr-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, v.teksAt ? { dari: T(v.teksAt, 0) - 0.05 } : {});
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar != null) {
      const tL = T(v.layar, 0.3), W0 = pick(880, 960);
      const kartu = PD.layar(root, 'policy-review', { w: W0, potong: pick([280, 65, 1140, 195], [280, 65, 700, 195]), judul: 'Privasimu Nexus · Telaah Kebijakan' });
      kartu.style.left = pick(980, (SW - W0) / 2) + 'px'; kartu.style.top = pick(300, 1000) + 'px';
      const cips = (v.cip || []).map(([teks, at], i) => { const el = h(`<div class="kr-cip">${esc(teks)}</div>`); root.appendChild(el); el.style.left = pick(1000 + i * 30, 80 + i * 300) + 'px'; el.style.top = pick(560 + i * 70, 1250) + 'px'; return { el, t: T(at, 2 + i) }; });
      parts.push((lt) => {
        const k = E.out3(P(lt, tL + 0.3, tL + 1.0));
        tf(kartu, { x: (1 - k) * pick(500, 0), y: (1 - k) * pick(0, 500), o: cl(k * 3), r: (1 - k) * 2 });
        cips.forEach((c) => { const kc = P(lt, c.t, c.t + 0.35); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) }); });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
