// Gaya TY17 · SATU KATA PER LAYAR: kata berganti dengan potongan keras tepat di cue; huruf tengah berwarna; latar
// (dari KIT bg) mengikuti kata aktif berdasarkan waktu global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const WARNA = { navy: ['#0B1B4D', '#FFFFFF', '#FFD34E'], putih: ['#F4F1EA', '#0B1B4D', '#E5484D'], kuning: ['#FFD34E', '#0B1B4D', '#2F6BFF'], biru: ['#2F6BFF', '#FFFFFF', '#FFD34E'] };
  const KATA = []; // { t, teks, warna } urut waktu global
  let lapis = null, el = null, huruf = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sk-lapis');
    el = h('<div class="sk-kata"></div>');
    lapis.appendChild(el);
  }
  function aktif(t) { let a = null; for (const k of KATA) if (t >= k.t) a = k; return a; }
  function gambar(t) {
    const a = aktif(t);
    if (!a) { el.style.opacity = 0; return; }
    if (el._k !== a) {
      el._k = a;
      const m = Math.floor((a.teks.length - 1) / 2);
      el.innerHTML = [...a.teks].map((ch, i) => `<span class="${i === m ? 'f' : ''}">${esc(ch)}</span>`).join('');
      el.style.color = WARNA[a.warna][1];
      $('.f', el).style.color = WARNA[a.warna][2];
      el.style.fontSize = Math.min(pick(420, 300), (SW - 140) / (a.teks.length * 0.8)) + 'px';
      el._fit = null;
    }
    if (el._fit == null) el._fit = Math.min(1, (SW - 100) / (el.offsetWidth || 1)); // jaga agar kata selalu muat
    const u = t - a.t, s = lerp(1.12, 1, E.outExpo(P(u, 0, 0.35))) * el._fit;
    el.style.opacity = a.mati != null && t >= a.mati ? 1 - P(t, a.mati, a.mati + 0.25) : 1;
    el.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
    lapis.style.opacity = (1 - P(t, KATA.tutup || 9e9, (KATA.tutup || 9e9) + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 100px Syne'],
    bg: (cx, t, id, th, W, H) => {
      const a = aktif(t);
      cx.fillStyle = a ? WARNA[a.warna][0] : '#0B1B4D'; cx.fillRect(0, 0, W, H);
      if (a && a.mati != null && t >= a.mati) { cx.fillStyle = `rgba(244,241,234,${P(t, a.mati, a.mati + 0.3).toFixed(3)})`; cx.fillRect(0, 0, W, H); }
    },
  });

  KIT.registerType('sk', (root, v, sc, tm, T) => {
    ensure();
    (v.kata || []).forEach(([teks, at, warna], i) => KATA.push({ t: i === 0 && !KATA.length ? sc.start : sc.start + T(at, 0.3), teks, warna })); // kata pertama sudah tampil sejak frame pertama
    KATA.sort((a, b) => a.t - b.t);
    const parts = [];
    if (v.layar != null) {
      const tL = T(v.layar, 1.5), W0 = pick(1240, 960);
      KATA[KATA.length - 1].mati = sc.start + tL; // kata terakhir memudar saat layar masuk
      const kartu = PD.layar(root, 'gap-hasil', { w: W0, potong: pick([0, 62, 1002, 458], [340, 62, 662, 458]), judul: 'Privasimu Nexus · Hasil GAP Assessment' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(120, 420) + 'px';
      const tx = h(`<div class="sk-teks">${rich(v.teks || '')}</div>`);
      root.appendChild(tx);
      const ws = PD.kata(tx, sc, { dari: T(v.teksAt, 2) - 0.05 });
      parts.push((lt) => {
        const k = E.outBack(P(lt, tL, tL + 0.55));
        tf(kartu, { s: 0.85 + 0.15 * cl(k), y: (1 - cl(k)) * 40, o: cl(k * 3) });
        PD.tampil(ws, lt, 'pop');
      });
    }
    if (v.cta) { KATA.tutup = sc.start; parts.push(PD.cta(root, v.cta, T)); }
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
