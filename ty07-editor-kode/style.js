// Gaya TY07 · EDITOR KODE: baris kode = daftar token berwarna; tiap baris punya waktu mulai ketik (JEDA per karakter,
// disamakan dengan klik di music.js). Sorot baris & komentar dari cue global; panel log muncul pada "log".
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.03;
  // token: [teks, kelas]  kelas: tg (tag) at (atribut) fn (fungsi) kw (kata kunci) st (string) cm (komentar) pn (tanda baca) va (variabel) ob (objek)
  const KODE = [
    [['<', 'pn'], ['button', 'tg'], [' onClick', 'at'], ['=', 'pn'], ['{', 'pn'], ['setuju', 'fn'], ['}', 'pn'], ['>', 'pn'], ['Setuju', 'tx'], ['</', 'pn'], ['button', 'tg'], ['>', 'pn']],
    [],
    [['function ', 'kw'], ['setuju', 'fn'], ['() {', 'pn']],
    [['  ', 'pn'], ['simpanPilihan', 'fn'], ['(', 'pn'], ['true', 'kw'], [');', 'pn']],
    [['}', 'pn']],
    [['// versi Privasimu Nexus', 'cm']],
    [['await ', 'kw'], ['consent', 'ob'], ['.', 'pn'], ['record', 'fn'], ['({', 'pn']],
    [['  ', 'pn'], ['subjek', 'va'], [', ', 'pn'], ['tujuan', 'va'], [': ', 'pn'], ["'marketing'", 'st'], [', ', 'pn'], ['bukti', 'va'], [': ', 'pn'], ["'form-v3'", 'st'], [',', 'pn']],
    [['});', 'pn']],
    [['webhook', 'ob'], ['.', 'pn'], ['on', 'fn'], ['(', 'pn'], ["'consent.withdrawn'", 'st'], [', ', 'pn'], ['sinkronKeCRM', 'fn'], [');', 'pn']],
  ];
  const KOMENTAR = [['   ', 'pn'], ['// lalu buktinya?', 'cmr']];
  const C = { baris: KODE.map(() => 9e9), sorot: KODE.map(() => [9e9, '']), komentar: 9e9, log: 9e9, tutup: 9e9 };
  let lapis = null, editor = null, barisEl = [], hurufBaris = [], hurufKom = [], logEl = [], kursor = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ce-lapis');
    editor = h(`<div class="ce-editor"><div class="ce-tab"><span class="dot r"></span><span class="dot k"></span><span class="dot h"></span><i>setuju.jsx</i><b>bukti.log</b></div><div class="ce-body">${KODE.map((tok, i) => `<div class="ce-line"><span class="ln">${i + 1}</span><span class="code">${tok.map(([t, k]) => `<span class="tk ${k}">${[...t].map((ch) => `<span class="ch">${esc(ch)}</span>`).join('')}</span>`).join('')}${i === 3 ? `<span class="kom">${KOMENTAR.map(([t, k]) => `<span class="tk ${k}">${[...t].map((ch) => `<span class="ch">${esc(ch)}</span>`).join('')}</span>`).join('')}</span>` : ''}</span></div>`).join('')}<span class="ce-kursor"></span></div><div class="ce-log"><div class="lg"><span class="ok">✔</span> tercatat <b>CNT-2026-011</b> · bukti tersimpan (form-v3, 07:41) <i>*ilustrasi</i></div><div class="lg"><span class="ok">✔</span> webhook <b>consent.withdrawn</b> → CRM · 200 OK</div></div></div>`);
    lapis.appendChild(editor);
    barisEl = [...editor.querySelectorAll('.ce-line')];
    hurufBaris = barisEl.map((l) => [...l.querySelectorAll('.code > .tk .ch')]);
    hurufKom = [...editor.querySelectorAll('.kom .ch')];
    logEl = [...editor.querySelectorAll('.lg')];
    kursor = editor.querySelector('.ce-kursor');
  }
  function gambar(t) {
    let kx = null;
    barisEl.forEach((l, i) => {
      const t0 = C.baris[i], hs = hurufBaris[i];
      l.style.opacity = t >= t0 ? 1 : 0;
      let terakhir = null;
      hs.forEach((c, j) => { const on = t >= t0 + j * JEDA; c.style.visibility = on ? 'visible' : 'hidden'; if (on) terakhir = c; });
      if (t >= t0 && t < t0 + hs.length * JEDA + 0.4) kx = terakhir || l.querySelector('.code');
      const [ts, warna] = C.sorot[i];
      l.classList.toggle('sorot-kuning', warna === 'kuning' && t >= ts);
      l.classList.toggle('sorot-hijau', warna === 'hijau' && t >= ts);
    });
    hurufKom.forEach((c, j) => { c.style.visibility = t >= C.komentar + j * JEDA ? 'visible' : 'hidden'; });
    if (t >= C.komentar && t < C.komentar + hurufKom.length * JEDA + 0.6) { kx = null; hurufKom.forEach((c, j) => { if (t >= C.komentar + j * JEDA) kx = c; }); }
    barisEl[3].classList.toggle('sorot-merah', t >= C.komentar);
    if (kx) { const r = kx.getBoundingClientRect(), e = editor.querySelector('.ce-body').getBoundingClientRect(); const sc = e.width / editor.querySelector('.ce-body').offsetWidth || 1; kursor.style.left = `${((r.right - e.left) / sc).toFixed(1)}px`; kursor.style.top = `${((r.top - e.top) / sc).toFixed(1)}px`; kursor.style.opacity = Math.floor(t * 3) % 2 ? 1 : 0.15; } else kursor.style.opacity = 0;
    logEl.forEach((el, i) => { const k = P(t, C.log + i * 0.5, C.log + i * 0.5 + 0.25); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translateX(${((1 - E.out3(k)) * -20).toFixed(1)}px)`; });
    editor.classList.toggle('ada-log', t >= C.log);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "JetBrains Mono"', '700 60px "JetBrains Mono"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0D1117'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.03)';
      for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 1);
    },
  });

  KIT.registerType('ce', (root, v, sc, tm, T) => {
    ensure();
    (v.baris || []).forEach(([i, at]) => { C.baris[i] = sc.start + T(at, 0.5); });
    (v.sorot || []).forEach(([i, at, w]) => { C.sorot[i] = [sc.start + T(at, 1), w]; });
    if (v.komentar != null) C.komentar = sc.start + T(v.komentar, 3);
    if (v.log != null) C.log = sc.start + T(v.log, 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(900, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(770, 1150)}px`;
      const t0 = T(L.at, 3);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
