// Gaya TY18 · TEXT SCRAMBLE: tabel 4 kolom hidup di lapisan lintas scene. Tiap sel punya teks tujuan dan waktu kunci;
// karakter ke-i terkunci pada waktu kunci + i × jeda, sebelum itu menampilkan glyph acak dari hash (deterministik).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const ACAK = '#%&@!?01234567890ABCDEFXYZ<>/\\|=+*';
  const KOL = [
    { nama: 'kol_17', jadi: 'NIK', isi: ['3174••••••••01', '3201••••••••42', '3578••••••••19'], tanda: 'umum' },
    { nama: 'kol_18', jadi: 'No. HP', isi: ['0812-••••-3491', '0857-••••-0026', '0813-••••-7718'], tanda: 'umum' },
    { nama: 'kol_19', jadi: 'Email', isi: ['r•••@••••••.id', 'd•••••@•••••.com', 'a••@•••••••.co.id'], tanda: 'umum' },
    { nama: 'kol_20', jadi: 'Riwayat kesehatan', isi: ['hipertensi', 'asma', 'diabetes tipe 2'], tanda: 'spesifik' },
  ];
  const C = { muncul: 9e9, kunci: [9e9, 9e9, 9e9, 9e9], tanda: 9e9, spesifik: 9e9, ropa: 9e9, tutup: 9e9 };
  let lapis = null, sel = [], kolEl = [], tandaEl = [], ropa = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sc-lapis');
    const tabel = h('<div class="sc-tabel"></div>');
    lapis.appendChild(tabel);
    KOL.forEach((k, ci) => {
      const col = h(`<div class="sc-kol k${ci}"><div class="sc-h"></div>${k.isi.map(() => '<div class="sc-c"></div>').join('')}<div class="sc-tanda ${k.tanda}">${k.tanda === 'spesifik' ? 'data pribadi SPESIFIK' : 'data pribadi umum'}</div></div>`);
      tabel.appendChild(col);
      kolEl.push(col);
      const cells = [...col.querySelectorAll('.sc-h, .sc-c')];
      cells.forEach((el, ri) => sel.push({ el, ci, ri, teks: ri === 0 ? k.jadi : k.isi[ri - 1], awal: ri === 0 ? k.nama : null, seed: ci * 31 + ri * 7 }));
      tandaEl.push($('.sc-tanda', col));
    });
    ropa = h('<div class="sc-ropa"><span class="pil"><i></i><b>ROPA-IT-2026-002</b> · Layanan pelanggan<span class="ket"> (call center)</span></span></div>');
    lapis.appendChild(ropa);
    lapis.appendChild(h('<div class="sc-cat">*nama kolom & isi = ilustrasi, disamarkan</div>'));
  }
  // teks sel pada waktu t: sebelum kunci → acak (nama kolom asli tetap tampil untuk header); setelah kunci → terkunci per karakter
  function isiSel(s, t) {
    const tk = C.kunci[s.ci], f = Math.floor(t * 15);
    if (t < tk) {
      if (s.awal) return { html: esc(s.awal), locked: 0 };
      let out = '';
      for (let i = 0; i < s.teks.length; i++) out += ACAK[Math.floor(hash(f * 3.1 + s.seed * 17 + i * 5.3) * ACAK.length)];
      return { html: `<span class="acak">${esc(out)}</span>`, locked: 0 };
    }
    const n = s.teks.length, jeda = 0.045;
    let html = '', locked = 0;
    for (let i = 0; i < n; i++) {
      const ch = s.teks[i];
      if (t >= tk + 0.12 + i * jeda) { html += esc(ch); locked++; }
      else if (ch === ' ') html += ' ';
      else html += `<span class="acak">${esc(ACAK[Math.floor(hash(f * 3.1 + s.seed * 17 + i * 5.3) * ACAK.length)])}</span>`;
    }
    return { html, locked, done: locked === n };
  }
  function gambar(t) {
    // kolom pertama mulai di tengah layar, lalu bergeser ke slotnya saat kolom lain muncul
    const c0 = kolEl[0], tb = c0.parentElement;
    if (c0._dx == null) c0._dx = SW / 2 - (tb.offsetLeft + c0.offsetLeft + c0.offsetWidth / 2);
    const kg = E.io3(P(t, C.muncul - 0.05, C.muncul + 0.45));
    kolEl.forEach((col, ci) => {
      const k = ci === 0 ? 1 : E.out3(P(t, C.muncul + (ci - 1) * 0.12, C.muncul + (ci - 1) * 0.12 + 0.4));
      tf(col, { x: ci === 0 ? c0._dx * (1 - kg) : 0, y: (1 - k) * 40, o: k, s: ci === 0 ? lerp(1.18, 1, kg) : 1 });
      col.style.visibility = k > 0 ? 'visible' : 'hidden';
    });
    for (const s of sel) {
      const r = isiSel(s, t);
      s.el.innerHTML = r.html;
      s.el.classList.toggle('kunci', !!r.done);
      if (s.ri === 0) s.el.classList.toggle('jadi', t >= C.kunci[s.ci]);
    }
    tandaEl.forEach((el, ci) => {
      const t0 = ci === 3 ? C.spesifik : C.tanda + ci * 0.15, k = P(t, t0, t0 + 0.35);
      tf(el, { s: k > 0 ? E.outBack(k) : 0, o: cl(k * 3) });
    });
    const kr = E.out3(P(t, C.ropa, C.ropa + 0.5));
    tf(ropa, { y: (1 - kr) * 30, o: kr });
    $('i', ropa).style.transform = `scaleX(${E.out3(P(t, C.ropa + 0.2, C.ropa + 0.6)).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px "Space Grotesk"', '500 40px "Space Grotesk"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0B1220'; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(120,150,220,.10)'; cx.lineWidth = 1;
      cx.beginPath();
      for (let x = 0; x < W; x += 80) { cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); }
      for (let y = 0; y < H; y += 80) { cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); }
      cx.stroke();
      const g = cx.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.4, Math.max(W, H) * 0.7);
      g.addColorStop(0, 'rgba(47,107,255,.14)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('sc', (root, v, sc, tm, T) => {
    ensure();
    if (v.munculAt != null) C.muncul = sc.start + T(v.munculAt, 0.5);
    for (const [ci, at] of v.kunci || []) C.kunci[ci] = sc.start + T(at, 1);
    if (v.tandaAt != null) C.tanda = sc.start + T(v.tandaAt, 1);
    if (v.spesifikAt != null) C.spesifik = sc.start + T(v.spesifikAt, 2);
    if (v.ropaAt != null) C.ropa = sc.start + T(v.ropaAt, 3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="sc-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
