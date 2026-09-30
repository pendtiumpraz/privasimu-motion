// Gaya GB49 · STIKER DIE-CUT: 9 stiker di lapisan lintas scene; tiap stiker punya posisi/rotasi tetap dan waktu tempel
// dari cue global; masuk dengan efek tampar (skala 1.6→1 outBack + kilat bayangan), yang baru selalu di atas.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  // [html, kelas, xH, yH, rotH, xV, yV, rotV]
  const STIKER = [
    ['DPO STARTER PACK', 'judul', 960, 130, -3, 540, 300, -3],
    ['<i>☕</i> kopi ke-4', 'pil kopi', 560, 360, -9, 300, 520, -9],
    ['<b>47</b> tab', 'bulat', 1380, 330, 7, 830, 540, 7],
    ['📄 RoPA_final_final_v3.xlsx', 'pil file', 820, 540, 4, 470, 720, 4],
    ['grup chat <b>URGENT</b> <span class="badge">99+</span>', 'pil chat', 1260, 600, -6, 640, 900, -6],
    ['⏱ <b>72</b> jam', 'bulat jam', 600, 760, 8, 260, 1080, 8],
    ['📎 audit minggu depan', 'pil audit', 1160, 830, -4, 740, 1160, -4],
    [`<img src="${PD.LOGO}" alt=""><em>NEXUS</em>`, 'logo', 960, 560, -4, 540, 850, -4],
    ['satu tab 🙂', 'pil tab', 1230, 760, 6, 800, 1090, 6],
  ];
  const C = { tempel: STIKER.map(() => 9e9), tutup: 9e9 };
  let lapis = null, els = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sd-lapis');
    els = STIKER.map(([html, kelas]) => { const el = h(`<div class="sd-stiker ${kelas}"><div class="in">${html}</div></div>`); lapis.appendChild(el); return el; });
  }
  function gambar(t) {
    els.forEach((el, i) => {
      const [, , xH, yH, rH, xV, yV, rV] = STIKER[i], x = V ? xV : xH, y = V ? yV : yH, r = V ? rV : rH;
      const pk = P(t, C.tempel[i], C.tempel[i] + 0.4), k = pk > 0 ? E.outBack(pk) : 0;
      el.style.opacity = pk > 0 ? 1 : 0;
      el.style.zIndex = 10 + i;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${(r + (1 - k) * 12).toFixed(2)}deg) scale(${lerp(1.7, 1, k).toFixed(3)})`;
      el.style.filter = pk > 0 && pk < 1 ? `drop-shadow(0 ${((1 - pk) * 40).toFixed(0)}px ${((1 - pk) * 30).toFixed(0)}px rgba(0,0,0,.45))` : 'drop-shadow(0 10px 14px rgba(0,0,0,.32))';
    });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Fredoka', '800 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#173F35'); g.addColorStop(1, '#0E2A24');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      // tekstur tutup laptop halus
      cx.fillStyle = 'rgba(255,255,255,.025)';
      for (let i = 0; i < 300; i++) cx.fillRect(hash(i * 1.3) * W, hash(i * 2.7) * H, 2, 2);
    },
  });

  KIT.registerType('sd', (root, v, sc, tm, T) => {
    ensure();
    (v.tempel || []).forEach(([i, c], n) => { C.tempel[i] = sc.start + T(c, 0.5 + n * 0.9); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
