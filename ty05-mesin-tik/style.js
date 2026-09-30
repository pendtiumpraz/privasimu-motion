// Gaya TY05 · MESIN TIK: satu lembar kertas di lapisan lintas scene. Tiap baris punya waktu mulai (cue kata); huruf ke-j
// muncul pada mulai + j × JEDA (sama dengan perhitungan bunyi tuts di music.js). Salah ketik ditimpa X.
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.055; // detik per huruf (harus sama dengan music.js)
  const C = { timpa: 9e9, layar: 9e9, tutup: 9e9 };
  let lapis = null, kertas = null, isi = null, BARIS = [], kursor = null, timpaEl = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('tw-lapis');
    const W0 = pick(1040, 940);
    kertas = h(`<div class="tw-kertas" style="width:${W0}px;left:${pick(140, (SW - W0) / 2)}px;top:${pick(90, 250)}px"><div class="tw-isi"></div><i class="tw-kursor"></i></div>`);
    lapis.appendChild(kertas);
    isi = $('.tw-isi', kertas); kursor = $('.tw-kursor', kertas);
    lapis.appendChild(h(`<div class="tw-mesin" style="left:${pick(60, (SW - 1100) / 2)}px;top:${pick(740, 1330)}px"></div>`));
  }
  function tambahBaris(teks, t0, kelas) {
    const el = h(`<div class="tw-b ${kelas || ''}"></div>`);
    isi.appendChild(el);
    const huruf = [...teks].map((ch, j) => {
      const sp = h(`<span class="tw-h" style="opacity:0;transform:translateY(${((hash(BARIS.length * 31 + j) - 0.5) * 2.2).toFixed(1)}px) rotate(${((hash(j * 7 + 3) - 0.5) * 2).toFixed(1)}deg)">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`);
      el.appendChild(sp);
      return sp;
    });
    const b = { el, huruf, t0, n: huruf.length };
    BARIS.push(b);
    return b;
  }
  function gambar(t) {
    let akhir = null;
    for (const b of BARIS) {
      const m = t < b.t0 ? 0 : Math.min(b.n, Math.floor((t - b.t0) / JEDA) + 1);
      b.huruf.forEach((sp, j) => { sp.style.opacity = j < m ? (0.82 + 0.18 * hash(j * 3.3 + b.t0)).toFixed(2) : 0; });
      if (m > 0) akhir = { b, m };
    }
    // kursor setelah huruf terakhir yang tampil
    if (akhir) {
      const sp = akhir.b.huruf[akhir.m - 1];
      kursor.style.left = (akhir.b.el.offsetLeft + sp.offsetLeft + sp.offsetWidth + 2) + 'px';
      kursor.style.top = (akhir.b.el.offsetTop + isi.offsetTop) + 'px';
      kursor.style.opacity = Math.floor(t * 3) % 2 === 0 ? 1 : 0;
    }
    // XXXX menimpa "mengundurkan diri" (baris ke-2, huruf 5..21)
    if (timpaEl) {
      const m = t < C.timpa ? 0 : Math.min(timpaEl.length, Math.floor((t - C.timpa) / (JEDA * 0.7)) + 1);
      timpaEl.forEach((x, j) => { x.style.opacity = j < m ? 1 : 0; });
    }
    // kertas sedikit naik saat baris baru dimulai (gulungan mesin tik)
    const barisAktif = BARIS.filter((b) => t >= b.t0).length;
    const naik = BARIS.length && barisAktif ? E.out3(P(t, BARIS[barisAktif - 1].t0 - 0.25, BARIS[barisAktif - 1].t0)) : 0;
    kertas.style.transform = `translateY(${(-(barisAktif - 1) * 0 + (1 - naik) * 8).toFixed(1)}px) rotate(-0.4deg)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Special Elite"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#2B2B30'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W * 0.45, H * 0.3, 0, W * 0.45, H * 0.3, Math.max(W, H) * 0.8);
      g.addColorStop(0, 'rgba(255,230,190,.18)'); g.addColorStop(1, 'rgba(0,0,0,.3)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('tw', (root, v, sc, tm, T) => {
    ensure();
    if (v.kepala) tambahBaris(v.kepala, sc.start + 0.05, 'kepala');
    for (const [teks, at] of v.baris || []) tambahBaris(teks, sc.start + T(at, 0.5));
    if (v.timpa != null) {
      C.timpa = sc.start + T(v.timpa, 0.5);
      // huruf X di atas "mengundurkan diri" pada baris ke-2 (indeks 5..21 termasuk spasi)
      const b = BARIS[2], mulai = 5, n = 'mengundurkan diri'.length;
      timpaEl = [];
      for (let j = mulai; j < mulai + n; j++) {
        const sp = b.huruf[j], x = h('<span class="tw-x" style="opacity:0">X</span>');
        sp.appendChild(x); timpaEl.push(x);
      }
    }
    const parts = [];
    if (v.layar != null) {
      const tL = T(v.layar, 1), W0 = pick(760, 960);
      const kartu = PD.layar(root, 'dashboard', { w: W0, potong: pick([275, 85, 975, 640], [275, 385, 640, 340]), judul: 'Privasimu Nexus · Dasbor kepatuhan' });
      kartu.style.left = pick(1150, (SW - W0) / 2) + 'px'; kartu.style.top = pick(140, 1040) + 'px';
      const cips = (v.cip || []).map(([teks, at], i) => { const el = h(`<div class="tw-cip">${esc(teks)}</div>`); root.appendChild(el); el.style.left = pick(1150 + i * 40, 90 + i * 60) + 'px'; el.style.top = pick(720 + i * 62, 1500 + i * 0) + 'px'; if (V) el.style.left = 90 + i * 330 + 'px'; return { el, t: T(at, 2 + i) }; });
      parts.push((lt) => {
        const k = E.out3(P(lt, tL, tL + 0.7));
        tf(kartu, { x: (1 - k) * pick(500, 0), y: (1 - k) * pick(0, 400), o: cl(k * 3), r: (1 - k) * 3 + 1.2 });
        cips.forEach((c) => { const kc = P(lt, c.t, c.t + 0.35); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) }); });
      });
    }
    if (v.cta) { C.tutup = sc.start + T(v.cta.at, 1) - 0.3; parts.push(PD.cta(root, v.cta, T)); }
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
