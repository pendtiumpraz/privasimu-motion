// Gaya TY37 · WRITE-ON: tiga kertas tempel di lapisan lintas scene. Tiap baris punya cue tulis; huruf dibuka satu-satu
// dengan clip-path inset dari kiri (JEDA per huruf), pena (elemen di dalam kertas) mengikuti huruf yang sedang ditulis.
// Kertas berpindah (tengah → tumpukan laporan → tersingkir) dari cue "tempel" dan "dasbor".
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.06;
  const NOTA = [
    { baris: ['Pak, laporannya', '482 halaman<small>*ilustrasi</small>.', 'Ringkasannya:', 'satu layar.'], w: pick(720, 780), kelas: 'n1' },
    { baris: ['Yang perlu direksi tahu:', '• skor kepatuhan', '• permintaan tertunda', '• insiden aktif'], w: pick(720, 780), kelas: 'n2' },
    { baris: ['satu layar ✓'], w: pick(300, 300), kelas: 'n3' },
  ];
  const C = { tulis: NOTA.map((n) => n.baris.map(() => 9e9)), tempel: 9e9, dasbor: 9e9, tutup: 9e9 };
  let lapis = null, atas = null, kertas = [], hurufs = [], penas = [], tumpuk = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('wo-lapis');
    atas = PD.lapis('wo-atas', 5); // catatan kecil di atas kartu dasbor
    tumpuk = h(`<div class="wo-tumpuk" data-bebas="1"><div class="wo-lap l3"></div><div class="wo-lap l2"></div><div class="wo-lap l1"><span>LAPORAN AUDIT<br><b>482 hlm</b><i>*ilustrasi</i></span></div></div>`);
    lapis.appendChild(tumpuk);
    NOTA.forEach((n, i) => {
      const el = h(`<div class="wo-kertas ${n.kelas}" data-bebas="1" style="width:${n.w}px"><i class="wo-selotip"></i><div class="wo-isi">${n.baris.map((b) => `<div class="wo-b">${b}</div>`).join('')}</div><div class="wo-pena"><svg viewBox="0 0 40 160"><path d="M14 0h12l4 110H10z" fill="#2B3A67"/><path d="M10 110h20l-10 40z" fill="#E8C39E"/><path d="M18 138h4l-2 12z" fill="#111"/></svg></div></div>`);
      (i === 2 ? atas : lapis).appendChild(el); kertas.push(el);
      // pecah per huruf (pertahankan <small>)
      hurufs.push([...el.querySelectorAll('.wo-b')].map((b) => {
        const sp = [];
        const pecah = (node) => {
          [...node.childNodes].forEach((c) => {
            if (c.nodeType === 3) { const frag = document.createDocumentFragment(); [...c.textContent].forEach((ch) => { const s = document.createElement('span'); s.className = 'wo-h'; s.textContent = ch; frag.appendChild(s); sp.push(s); }); node.replaceChild(frag, c); }
            else pecah(c);
          });
        };
        pecah(b); return sp;
      }));
      penas.push(el.querySelector('.wo-pena'));
    });
  }
  function tulis(i, t) { // kembalikan posisi pena {x,y} bila sedang menulis
    let pena = null, terakhir = null;
    hurufs[i].forEach((sp, bi) => {
      const t0 = C.tulis[i][bi];
      sp.forEach((s, j) => {
        const a = t0 + j * JEDA, k = P(t, a, a + JEDA * 1.4);
        s.style.clipPath = k >= 1 ? 'none' : `inset(0 ${((1 - k) * 100).toFixed(1)}% 0 0)`;
        s.style.opacity = k > 0 ? 1 : 0;
        if (k > 0 && k < 1) pena = { x: s.offsetLeft + k * s.offsetWidth, y: s.offsetTop + s.offsetHeight * 0.78 };
        if (k >= 1) terakhir = { x: s.offsetLeft + s.offsetWidth, y: s.offsetTop + s.offsetHeight * 0.78, t: a + JEDA * 1.4 };
      });
    });
    const p = pena || (terakhir && t < terakhir.t + 0.35 ? terakhir : null);
    penas[i].style.opacity = p ? 1 : 0;
    if (p) penas[i].style.transform = `translate(${p.x.toFixed(1)}px, ${(p.y - 150).toFixed(1)}px)`;
  }
  function gambar(t) {
    const tp = E.io3(P(t, C.tempel, C.tempel + 0.9)), td = E.io3(P(t, C.dasbor, C.dasbor + 0.7));
    // kertas 1: tengah → tumpukan (kecil) → keluar kiri
    const p1 = { x: lerp(lerp(SW / 2, pick(330, 300), tp), -700, td), y: lerp(lerp(pick(470, 640), pick(700, 1330), tp), pick(700, 1330), td), s: lerp(1, 0.5, tp), r: lerp(-2, -7, tp) };
    kertas[0].style.transform = `translate(${p1.x.toFixed(1)}px, ${p1.y.toFixed(1)}px) translate(-50%, -50%) rotate(${p1.r.toFixed(2)}deg) scale(${p1.s.toFixed(3)})`;
    kertas[0].style.opacity = 1;
    // kertas 2: masuk dari kanan saat tempel → keluar kanan saat dasbor
    const p2 = { x: lerp(SW + 600, pick(1250, 540), tp) + td * 1400, y: pick(480, 560), r: lerp(6, 2, tp) };
    kertas[1].style.transform = `translate(${p2.x.toFixed(1)}px, ${p2.y}px) translate(-50%, -50%) rotate(${p2.r.toFixed(2)}deg)`;
    kertas[1].style.opacity = tp > 0 ? 1 : 0;
    // kertas 3: kecil di sudut kartu dasbor
    const k3 = t >= C.tulis[2][0] - 0.3 ? E.outBack(P(t, C.tulis[2][0] - 0.3, C.tulis[2][0])) : 0;
    kertas[2].style.transform = `translate(${pick(1400, 900)}px, ${pick(262, 572)}px) translate(-50%, -50%) rotate(8deg) scale(${Math.max(0.01, k3).toFixed(3)})`;
    kertas[2].style.opacity = k3 > 0 ? 1 : 0;
    // tumpukan laporan: naik dari bawah saat tempel, turun saat dasbor
    const ty = lerp(SH + 200, pick(700, 1330), tp) + td * 900;
    tumpuk.style.transform = `translate(${pick(330, 300)}px, ${ty.toFixed(1)}px) translate(-50%, -50%)`;
    tumpuk.style.opacity = tp > 0 && td < 1 ? 1 : 0;
    NOTA.forEach((n, i) => tulis(i, t));
    lapis.style.opacity = atas.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Caveat', '400 60px "Patrick Hand"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#E9D9BF'); g.addColorStop(1, '#CDB694');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(90,60,20,.07)';
      for (let i = 0; i < 26; i++) cx.fillRect(0, (i / 26) * H + Math.sin(i * 1.7) * 8, W, 3 + (i % 3)); // serat kayu meja
    },
  });

  KIT.registerType('wo', (root, v, sc, tm, T) => {
    ensure();
    (v.nota || []).forEach(([ni, bi, at], n) => { C.tulis[ni][bi] = sc.start + T(at, 0.5 + n * 1.1); });
    if (v.tempel != null) C.tempel = sc.start + T(v.tempel, 0.2);
    if (v.dasbor != null) C.dasbor = sc.start + T(v.dasbor, 0.2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(880, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(250, 560)}px`;
      const t0 = T(v.dasbor, 0.2) + 0.4;
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
