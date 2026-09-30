// Gaya TY44 · PAPAN HURUF: papan di lapisan lintas scene dengan 3 baris. Tiap baris punya urutan keadaan (cue, teks);
// huruf keadaan baru dipasang satu-satu (JEDA per huruf, disamakan dengan klik di music.js), huruf lama dicopot
// sesaat sebelumnya. Beberapa huruf sengaja miring.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const JEDA = 0.07;
  const STATE = [[], [], []]; // per baris: [{t, teks, els:[]}]
  let lapis = null, papan = null, rows = [], tutup = 9e9;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lb-lapis');
    papan = h(`<div class="lb-papan"><div class="lb-kain"><div class="lb-row r0"></div><div class="lb-row r1"></div><div class="lb-row r2"></div></div></div>`);
    lapis.appendChild(papan);
    rows = [...papan.querySelectorAll('.lb-row')];
  }
  function tambah(bi, t, teks) {
    const wrap = h('<div class="lb-set"></div>');
    const els = [...teks].map((ch, j) => {
      const el = h(`<span class="lb-h${ch === ' ' ? ' sp' : ''}">${esc(ch)}</span>`);
      const miring = hash(bi * 31 + j * 7 + teks.length) < 0.22 ? (hash(j * 3 + bi) - 0.5) * 12 : (hash(j + bi * 5) - 0.5) * 2;
      el._rot = miring; wrap.appendChild(el); return el;
    });
    rows[bi].appendChild(wrap);
    STATE[bi].push({ t, teks, els, wrap });
    STATE[bi].sort((a, b) => a.t - b.t);
  }
  function gambar(t) {
    STATE.forEach((sts) => {
      sts.forEach((st, k) => {
        const tNext = k + 1 < sts.length ? sts[k + 1].t : 9e9;
        let j = 0;
        st.els.forEach((el) => {
          if (el.classList.contains('sp')) return;
          const tIn = st.t + j * JEDA, tOut = tNext - 0.45 + j * 0.02; j++;
          const kin = P(t, tIn, tIn + 0.14), kout = P(t, tOut, tOut + 0.22);
          const vis = kin > 0 && kout < 1;
          el.style.opacity = vis ? (1 - kout).toFixed(3) : 0;
          const s = lerp(1.6, 1, E.outBack ? E.outBack(kin) : kin), y = kout * 60, r = el._rot + (kin < 1 ? (1 - kin) * -14 : 0) + kout * 25;
          el.style.transform = `translateY(${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(3)})`;
        });
        st.wrap.style.display = (t >= st.t - 0.01 && t < tNext - 0.2 + st.els.length * 0.02) ? '' : 'none';
      });
    });
    lapis.style.opacity = (1 - P(t, tutup, tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px Anton', '500 60px Oswald', '700 60px Oswald'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5A4636'); g.addColorStop(1, '#2B211A');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.035)';
      for (let i = 0; i < 60; i++) cx.fillRect((i / 60) * W + Math.sin(i * 3) * 6, 0, 3 + (i % 3), H); // serat kayu dinding
    },
  });

  KIT.registerType('lb', (root, v, sc, tm, T) => {
    ensure();
    (v.baris || []).forEach(([bi, at, teks], n) => tambah(bi, sc.start + T(at, 0.2 + n * 0.8), teks));
    if (v.cta) tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1100, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(700, 800)}px`;
      const t0 = T(L.at, 2.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 40).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
