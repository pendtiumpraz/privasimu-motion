// Gaya TY19 · REDAKSI: kertas arsip di lapisan lintas scene; balok hitam = elemen di atas teks yang bergeser terbuka
// (scaleX menuju kanan) pada waktunya; stempel merah; baris log audit + rantai hash.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { stempel: 9e9, buka: [9e9, 9e9, 9e9], log: 9e9, ai: 9e9, rantai: 9e9, tutup: 9e9 };
  let lapis = null, kertas = null, balok = [], stempel = null, logEl = null, rows = [], rantaiEl = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('rd-lapis');
    const W0 = pick(1500, 980);
    kertas = h(`<div class="rd-kertas" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(70, 300)}px">
      <div class="rd-kop">ARSIP AKSES · DATA PELANGGAN <span>No. 0417/IX/2026</span></div>
      <p>Berkas: <b>R••• P••••• (pelanggan)</b></p>
      <p>Terakhir dibuka oleh <span class="rd-r"><u>Peran: Admin TI</u><i></i></span> pada <span class="rd-r"><u>14 Sep 2026, 09.41</u><i></i></span> lewat <span class="rd-r"><u>aplikasi web</u><i></i></span>.</p>
      <p class="rd-kecil">Catatan ini seharusnya ada. Di banyak kantor, halaman ini kosong.</p>
    </div>`);
    lapis.appendChild(kertas);
    balok = [...kertas.querySelectorAll('.rd-r i')];
    stempel = h('<div class="rd-stempel">TIDAK<br>TERCATAT</div>');
    kertas.appendChild(stempel);
    logEl = h(`<div class="rd-log" style="width:${W0}px;left:${(SW - W0) / 2}px;top:${pick(560, 860)}px">
      <div class="rd-lh">LOG AUDIT</div>
      ${[['M', 'Admin TI', 'membuka data pelanggan', '09.41', 'a91f'], ['AI', 'Priva (asisten AI)', 'merangkum RoPA terkait', '09.45', 'c07d'], ['M', 'Reviewer', 'menyetujui permohonan DSR', '10.02', 'e3b2']]
        .map((r) => `<div class="rd-row ${r[0] === 'AI' ? 'ai' : ''}"><b class="ak">${r[0] === 'AI' ? 'AI' : 'M'}</b><span class="siapa">${esc(r[1])}</span><span class="apa">${esc(r[2])}</span><span class="kapan">${r[3]}</span><span class="hash">#${r[4]}…</span><em class="rt"></em></div>`).join('')}
    </div>`);
    lapis.appendChild(logEl);
    rows = [...logEl.querySelectorAll('.rd-row')];
    rantaiEl = [...logEl.querySelectorAll('.rt')];
  }
  function gambar(t) {
    balok.forEach((b, i) => { b.style.transform = `scaleX(${(1 - E.io3(P(t, C.buka[i], C.buka[i] + 0.55))).toFixed(3)})`; });
    const ks = P(t, C.stempel, C.stempel + 0.22);
    tf(stempel, { s: ks > 0 ? lerp(1.9, 1, E.outExpo(ks)) : 0, r: -12, o: ks > 0 ? 1 : 0 });
    stempel.style.opacity = ks > 0 ? (1 - P(t, C.buka[0], C.buka[0] + 0.4) * 0.85).toFixed(3) : 0;
    rows.forEach((r, i) => {
      const t0 = r.classList.contains('ai') ? C.ai : C.log + (i === 0 ? 0 : 0.6), k = E.out3(P(t, t0, t0 + 0.45));
      tf(r, { x: (1 - k) * -40, o: k });
    });
    tf($('.rd-lh', logEl), { o: P(t, C.log - 0.2, C.log + 0.2) });
    rantaiEl.forEach((e, i) => { e.style.transform = `scaleY(${E.out3(P(t, C.rantai + i * 0.15, C.rantai + i * 0.15 + 0.35)).toFixed(3)})`; });
    logEl.classList.toggle('rantai', t >= C.rantai);
    // kertas sedikit bergoyang seperti dipegang
    kertas.style.transform = `rotate(${(-0.6 + Math.sin(t * 0.7) * 0.3).toFixed(2)}deg)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Special Elite"', '700 30px "IBM Plex Mono"', '500 30px "IBM Plex Mono"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#3E3A33'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, Math.max(W, H) * 0.8);
      g.addColorStop(0, 'rgba(255,240,210,.16)'); g.addColorStop(1, 'rgba(0,0,0,.25)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('rd', (root, v, sc, tm, T) => {
    ensure();
    if (v.stempel != null) C.stempel = sc.start + T(v.stempel, 1);
    (v.buka || []).forEach((c, i) => { C.buka[i] = sc.start + T(c, 1 + i); });
    if (v.logAt != null) C.log = sc.start + T(v.logAt, 3);
    if (v.aiAt != null) C.ai = sc.start + T(v.aiAt, 4);
    if (v.rantai != null) C.rantai = sc.start + T(v.rantai, 0.5);
    if (v.cta) C.tutup = sc.start + T(v.cta.at, 0.5) - 0.3;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="rd-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
