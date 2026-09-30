// Gaya TY25 · ENTRI KAMUS: satu halaman kamus di lapisan lintas scene; tiap scene "menyalakan" satu arti (kata per kata
// mengikuti VO). Nomor arti dan garis pemisah ikut muncul. Gambar ilustrasi kamus = kartu layar asli.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const ARTI = [
    'orang yang ditanya semua hal tentang data, termasuk yang bukan urusannya.',
    '<i>(jujur)</i> orang yang membuka enam spreadsheet<sup>*</sup> dulu sebelum menjawab: “sebentar, saya cek.”',
    '<i>(dengan Privasimu Nexus)</i> orang dengan satu <b>dasbor kepatuhan</b>, <b>antrean kerja</b>, dan <b>asisten AI</b> bernama Priva.',
  ];
  let lapis = null, hal = null, artiEl = [], C = { gambar: 9e9, tutup: 9e9 };
  const ARTIS = []; // { li, no, ws, start, fx } per arti, diisi saat scene dirakit

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('km-lapis');
    const W0 = pick(1180, 960);
    hal = h(`<div class="km-hal" style="width:${W0}px;left:${pick(150, (SW - W0) / 2)}px;top:${pick(70, 250)}px">
      <div class="km-run"><span>D</span><span>dpo · dpia</span><span>hlm. 412</span></div>
      <div class="km-kepala"><span class="kw">DPO</span><span class="ucap">/de·pe·o/</span><span class="kelas">n.</span><span class="asal">sing. <i>Data Protection Officer</i>; Pejabat Pelindungan Data Pribadi (PPDP)</span></div>
      <ol class="km-arti">${ARTI.map((a, i) => `<li><b class="no">${i + 1}</b><span class="isi">${a}</span></li>`).join('')}</ol>
      <div class="km-cat">*angka ilustrasi</div>
    </div>`);
    lapis.appendChild(hal);
    artiEl = [...hal.querySelectorAll('.km-arti li')];
  }

  KIT.style({
    fonts: ['700 100px Newsreader', '400 60px Newsreader', 'italic 400 60px Newsreader', '600 60px Newsreader'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#E8E1D3'; cx.fillRect(0, 0, W, H);
      const g = cx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(0,0,0,.10)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.10)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('km', (root, v, sc, tm, T) => {
    ensure();
    const parts = [];
    if (v.arti != null) {
      const li = artiEl[v.arti], isi = $('.isi', li);
      ARTIS.push({ li, no: $('.no', li), ws: PD.kata(isi, sc, { dari: 0 }), start: sc.start, fx: v.karaoke ? 'karaoke' : 'pudar' });
    }
    if (v.gambarAt != null) {
      const tG = T(v.gambarAt, 3), GW = pick(470, 640);
      const fig = h('<figure class="km-fig"></figure>');
      root.appendChild(fig);
      PD.layar(fig, 'ai-agent-home', { w: GW, potong: [540, 140, 620, 480], bar: false });
      fig.appendChild(h('<figcaption>Gambar 1. Priva, asisten AI di Privasimu Nexus.</figcaption>'));
      parts.push((lt) => { const k = E.out3(P(lt, tG, tG + 0.6)); tf(fig, { y: (1 - k) * 30, o: k, r: -1.5 }); });
    }
    if (v.cta) { C.tutup = sc.start + T(v.cta.at, 0.5) - 0.3; parts.push(PD.cta(root, v.cta, T)); }
    return (lt, d) => {
      const t = sc.start + lt;
      // semua arti digambar dari waktu global (arti lama tetap menyala penuh, arti berikutnya masih tersembunyi)
      for (const A of ARTIS) {
        const la = t - A.start;
        A.li.style.visibility = la >= 0 ? 'visible' : 'hidden';
        PD.tampil(A.ws, la, A.fx);
        const t1 = A.ws[0].t;
        tf(A.no, { s: lerp(1.6, 1, E.outBack(P(la, t1 - 0.3, t1 + 0.1))), o: P(la, t1 - 0.35, t1 - 0.15) });
      }
      lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
      parts.forEach((f) => f(lt, d));
    };
  });
})();
