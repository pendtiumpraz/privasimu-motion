// Gaya TY35 · ASCII: satu <pre> berisi "bagian" (kelompok baris) yang masing-masing punya waktu muncul; tiap baris
// muncul berurutan (jeda per baris), dan tiap karakter menampilkan glyph acak (#/|\-+) sebelum menetap pada waktunya.
// Gembok = bagian tersendiri di kanan (16:9) / bawah (9:16). Semua dari waktu global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const FONT5 = { // huruf blok 5×5 (# = isi)
    P: ['####.', '#...#', '####.', '#....', '#....'], R: ['####.', '#...#', '####.', '#..#.', '#...#'], I: ['#####', '..#..', '..#..', '..#..', '#####'],
    V: ['#...#', '#...#', '#...#', '.#.#.', '..#..'], A: ['.###.', '#...#', '#####', '#...#', '#...#'], S: ['.####', '#....', '.###.', '....#', '####.'],
    M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], U: ['#...#', '#...#', '#...#', '#...#', '.###.'],
  };
  function banner(kata) { const rows = ['', '', '', '', '']; for (const ch of kata) for (let r = 0; r < 5; r++) rows[r] += FONT5[ch][r].replace(/\./g, ' ') + '  '; return rows; }
  const BAGIAN = [
    ['$ cat README.md'],
    banner('PRIVASIMU'),
    ['', '> JANGAN BACA README ini kalau bukti', '> persetujuan sudah tercatat di integrasimu.'],
    ['', '## 3 langkah integrasi'],
    ['1. sematkan  [ browser ] --consent-form.js--> [ Nexus ]'],
    ['2. API       [ aplikasi ] --POST /consent-----> [ Nexus ]'],
    ['3. webhook   [ Nexus ] --consent.withdrawn--> [ CRM ]'],
    ['', '## bukti', '[✓] subjek   [✓] waktu   [✓] versi formulir'],
    ['[✓] penarikan dihormati di semua kanal'],
  ];
  const GEMBOK = ['      .------.      ', '     /  .--.  \\     ', '    |  /    \\  |    ', '    |  |    |  |    ', '  .-+--+----+--+-.  ', '  |              |  ', '  |    BUKTI     |  ', '  |  TERSIMPAN   |  ', '  |     (o)      |  ', '  |      |       |  ', "  '--------------'  "];
  const ACAK = '#/|\\-+=*';
  const C = { bagian: BAGIAN.map(() => 9e9), gembok: 9e9, tutup: 9e9 };
  let lapis = null, pre = null, sel = [], preG = null, selG = [];

  function bangunPre(el, blok, kelasBaris) { // → daftar {span, ch, bi, li, ci}
    const out = [];
    blok.forEach((baris, li) => {
      const div = document.createElement('div'); div.className = 'as-baris ' + (kelasBaris ? kelasBaris(li) : '');
      [...baris].forEach((ch, ci) => { const s = document.createElement('span'); s.textContent = ch; div.appendChild(s); out.push({ s, ch, li, ci }); });
      el.appendChild(div);
    });
    return out;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('as-lapis');
    const term = h('<div class="as-term"><div class="as-bar"><i></i><i></i><i></i><span>readme — bash</span></div><pre class="as-pre"></pre></div>');
    lapis.appendChild(term); pre = term.querySelector('.as-pre');
    sel = [];
    BAGIAN.forEach((blok, bi) => { const items = bangunPre(pre, blok, (li) => (bi === 1 ? 'banner' : bi === 2 ? 'warn' : bi === 0 ? 'cmd' : '')); items.forEach((it) => { it.bi = bi; }); sel.push(...items); });
    const g = h('<div class="as-gembok"><pre class="as-pre-g"></pre></div>'); lapis.appendChild(g); preG = g.querySelector('.as-pre-g');
    selG = bangunPre(preG, GEMBOK);
  }
  function gambar(t) {
    sel.forEach(({ s, ch, li, ci, bi }) => {
      const t0 = C.bagian[bi] + li * 0.18 + ci * (bi === 1 ? 0.006 : 0.012), u = t - t0;
      if (ch === ' ') { s.textContent = ' '; return; }
      if (u < -0.4) { s.textContent = ' '; s.style.opacity = 0; }
      else if (u < 0) { s.textContent = ACAK[Math.floor(hash(li * 97 + ci * 13 + bi * 7 + Math.floor(t * 30)) * ACAK.length)]; s.style.opacity = 0.45; }
      else { s.textContent = ch; s.style.opacity = 1; }
    });
    // kursor blok di akhir baris terakhir yang aktif
    const kg = t >= C.gembok;
    selG.forEach(({ s, ch, li, ci }) => { const t0 = C.gembok + li * 0.09 + ci * 0.004, u = t - t0; if (ch === ' ') { s.textContent = ' '; return; } if (u < -0.5) { s.textContent = ' '; s.style.opacity = 0; } else if (u < 0) { s.textContent = ACAK[Math.floor(hash(li * 31 + ci * 17 + Math.floor(t * 30)) * ACAK.length)]; s.style.opacity = 0.45; } else { s.textContent = ch; s.style.opacity = 1; } });
    preG.parentElement.style.opacity = kg ? 1 : 0;
    preG.parentElement.classList.toggle('kunci', t >= C.gembok + 1.6);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "JetBrains Mono"', '700 60px "JetBrains Mono"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#050907'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 2);
      const g = cx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.7); g.addColorStop(0, 'rgba(60,255,140,.06)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('as', (root, v, sc, tm, T) => {
    ensure();
    (v.bagian || []).forEach(([i, c], n) => { C.bagian[i] = sc.start + T(c, 0.4 + n * 1.2); });
    if (v.gembok != null) C.gembok = sc.start + T(v.gembok, 2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(600, 760), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(1300, (SW - el._w) / 2)}px`; el.style.top = `${pick(700, 1230)}px`;
      const t0 = T(L.at, 3);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 40).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
