// Gaya TY54 · TIPOGRAFI AKSESIBEL: satu kalimat di lapisan lintas scene; ukuran, jarak huruf, tebal, tinggi baris, dan
// kontras diinterpolasi dari waktu (tahap: morph awal → ukuran → jarak → kontras), lalu mengecil ke atas saat layar masuk.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const KAL = 'Dengan ini saya menyetujui pemrosesan data pribadi saya untuk tujuan yang tercantum, dan saya dapat menarik persetujuan ini kapan saja.';
  const C = { morph: 9e9, tahap: [9e9, 9e9, 9e9], suara: 9e9, layar: 9e9, tutup: 9e9 };
  let lapis = null, kal = null, spk = null, bars = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ak-lapis');
    kal = h(`<div class="ak-kal"><p>${esc(KAL)}</p></div>`);
    lapis.appendChild(kal);
    spk = h(`<div class="ak-spk"><svg viewBox="0 0 24 24" width="64" height="64"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><div class="bar">${Array.from({ length: 22 }, () => '<i></i>').join('')}</div><span>dibacakan</span></div>`);
    lapis.appendChild(spk);
    bars = [...spk.querySelectorAll('.bar i')];
  }
  const S = (x) => x;
  function gambar(t) {
    const k0 = E.io3(P(t, C.morph, C.morph + 1.4));               // pudar → mulai terbaca
    const k1 = E.io3(P(t, C.tahap[0], C.tahap[0] + 0.7));          // ukuran
    const k2 = E.io3(P(t, C.tahap[1], C.tahap[1] + 0.7));          // jarak
    const k3 = E.io3(P(t, C.tahap[2], C.tahap[2] + 0.7));          // kontras
    const kl = E.io3(P(t, C.layar, C.layar + 0.8));                // mengecil ke atas
    const fs = lerp(lerp(lerp(pick(20, 18), pick(38, 34), k0), pick(54, 50), k1), pick(34, 32), kl);
    const ls = lerp(lerp(lerp(-0.02, 0, k0), 0.035, k2), 0.02, kl);
    const lh = lerp(lerp(1.05, 1.25, k0), 1.5, k2);
    const wg = lerp(lerp(300, 450, k0), 700, k3);
    const ink = Math.round(lerp(lerp(170, 110, k0), 10, k3));
    const w = lerp(lerp(pick(760, 560), pick(1400, 900), k0), pick(1500, 960), k1);
    const p = $('p', kal);
    p.style.fontSize = fs.toFixed(2) + 'px'; p.style.letterSpacing = ls.toFixed(4) + 'em'; p.style.lineHeight = lh.toFixed(3);
    p.style.fontWeight = Math.round(wg); p.style.color = `rgb(${ink},${ink + 2},${ink + 6})`;
    kal.style.width = w.toFixed(0) + 'px';
    const top = lerp(lerp(pick(380, 760), pick(300, 560), k0), pick(70, 200), kl);
    kal.style.top = top.toFixed(1) + 'px';
    kal.style.left = ((SW - w) / 2).toFixed(1) + 'px';
    kal.style.background = k3 > 0 ? `rgba(255,255,255,${(k3 * 0.95).toFixed(3)})` : 'transparent';
    kal.style.boxShadow = k3 > 0.05 ? `0 30px 80px rgba(20,30,60,${(0.14 * k3).toFixed(3)})` : 'none';
    // pembaca layar
    const ks = P(t, C.suara, C.suara + 0.4), on = t >= C.suara && t < C.layar + 0.3;
    tf(spk, { y: (1 - E.out3(ks)) * 20, o: cl(ks * 3) * (1 - P(t, C.layar, C.layar + 0.3)) });
    spk.style.top = (top + kal.offsetHeight + pick(34, 40)) + 'px';
    bars.forEach((b, i) => { const a = on ? 0.25 + 0.75 * Math.abs(Math.sin(t * 9 + i * 0.9) * Math.sin(t * 2.3 + i * 0.4)) : 0.15; b.style.transform = `scaleY(${a.toFixed(3)})`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['300 60px Inter', '700 60px Inter', '500 60px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const k = E.io3(P(t, C.tahap[2], C.tahap[2] + 0.7));
      cx.fillStyle = `rgb(${Math.round(lerp(226, 246, k))},${Math.round(lerp(228, 247, k))},${Math.round(lerp(232, 250, k))})`;
      cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('ak', (root, v, sc, tm, T) => {
    ensure();
    if (v.morph != null) C.morph = sc.start + T(v.morph, 1);
    (v.tahap || []).forEach((c, i) => { C.tahap[i] = sc.start + T(c, 0.5 + i); });
    if (v.suara != null) C.suara = sc.start + T(v.suara, 3);
    if (v.layar != null) C.layar = sc.start + T(v.layar, 1);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="ak-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar != null) {
      const tL = T(v.layar, 1), W0 = pick(1240, 960);
      const kartu = PD.layar(root, 'inclusive-privacy', { w: W0, potong: pick([280, 60, 1150, 300], [280, 60, 760, 300]), judul: 'Privasimu Nexus · Inclusive Privacy' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(330, 720) + 'px';
      const cat = h(`<div class="ak-cat">${esc(v.catatan || '')}</div>`);
      root.appendChild(cat);
      parts.push((lt) => { const k = E.out3(P(lt, tL, tL + 0.8)); tf(kartu, { y: (1 - k) * 300, o: cl(k * 3) }); tf(cat, { o: P(lt, tL + 0.6, tL + 1.1) }); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
