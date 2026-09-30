// Gaya TY10 · GLITCH: judul & penghitung di lapisan lintas scene, masing-masing tiga salinan (merah, biru-hijau, putih)
// yang digeser & diiris per frame dari hash; kekuatan glitch turun ke nol saat "tenang".
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { muncul: 9e9, hitung: 9e9, tenang: 9e9, tutup: 9e9 };
  let lapis = null, jam = null, judul = null, hitung = null, kode = null, KUAT = 1;

  function tigaLapis(kelas, teks) {
    const el = h(`<div class="gl-t ${kelas}"><span class="r">${esc(teks)}</span><span class="c">${esc(teks)}</span><span class="w">${esc(teks)}</span></div>`);
    return el;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('gl-lapis');
    jam = h(`<div class="gl-jam">03:00</div>`);
    judul = tigaLapis('judul', 'DUGAAN KEBOCORAN DATA');
    hitung = tigaLapis('hitung', '71:59:59');
    kode = h('<div class="gl-kode">BRC-2026-0xx · HIGH · wajib notifikasi</div>');
    lapis.appendChild(jam); lapis.appendChild(judul); lapis.appendChild(hitung); lapis.appendChild(kode);
  }
  const pad2 = (n) => String(n).padStart(2, '0');
  function glitch(el, t, amt, seed) {
    const f = Math.floor(t * 24), spans = el.children;
    const burst = hash(f * 0.37 + seed) < 0.55 * amt + 0.05 ? 1 : 0.25; // sesekali tenang
    const dx = (hash(f + seed) - 0.5) * 60 * amt * burst, dy = (hash(f + 7 + seed) - 0.5) * 14 * amt * burst;
    spans[0].style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    spans[1].style.transform = `translate(${(-dx).toFixed(1)}px, ${(-dy).toFixed(1)}px)`;
    // irisan horizontal pada salinan putih
    if (hash(f + 3 + seed) < 0.6 * amt) {
      const a = hash(f + 5 + seed) * 80, b = a + 6 + hash(f + 6 + seed) * 26, sx = (hash(f + 9 + seed) - 0.5) * 90 * amt;
      spans[2].style.clipPath = `polygon(0 0, 100% 0, 100% ${a}%, 0 ${a}%, 0 ${b}%, 100% ${b}%, 100% 100%, 0 100%)`;
      spans[2].style.transform = 'none';
      // potongan yang tergeser
      spans[0].style.clipPath = `inset(${a}% 0 ${100 - b}% 0)`; spans[0].style.transform = `translate(${sx.toFixed(1)}px, 0)`;
    } else { spans[2].style.clipPath = 'none'; spans[0].style.clipPath = 'none'; }
    spans[0].style.opacity = spans[1].style.opacity = (0.15 + 0.85 * amt).toFixed(2);
  }
  function gambar(t) {
    const amt = KUAT * (1 - E.io3(P(t, C.tenang, C.tenang + 1.2)));
    const km = P(t, C.muncul, C.muncul + 0.05);
    judul.style.opacity = km > 0 ? 1 : 0;
    glitch(judul, t, amt, 1);
    const kh = P(t, C.hitung, C.hitung + 0.05);
    hitung.style.opacity = kh > 0 ? 1 : 0;
    const sisa = Math.max(0, 72 * 3600 - Math.floor((t - C.hitung) * 1) - 1);
    const s = `${pad2(Math.floor(sisa / 3600))}:${pad2(Math.floor(sisa % 3600 / 60))}:${pad2(sisa % 60)}`;
    [...hitung.children].forEach((sp) => { if (sp.textContent !== s) sp.textContent = s; });
    glitch(hitung, t, amt * 0.7, 2);
    kode.style.opacity = kh > 0 ? (hash(Math.floor(t * 12)) < 0.15 * amt ? 0.2 : 1) : 0;
    jam.style.opacity = hash(Math.floor(t * 9)) < 0.12 * amt ? 0.3 : 1;
    // judul & penghitung mengecil ke atas saat layar tenang masuk
    const kt = E.io3(P(t, C.tenang, C.tenang + 0.9));
    judul.style.transform = `translateY(${(-kt * pick(140, 300)).toFixed(1)}px) scale(${lerp(1, 0.5, kt).toFixed(3)})`;
    judul.style.opacity = km > 0 ? (1 - kt).toFixed(3) : 0; // judul memudar saat layar tenang masuk
    hitung.style.transform = `translateY(${(-kt * pick(360, 620)).toFixed(1)}px) scale(${lerp(1, 0.5, kt).toFixed(3)})`;
    kode.style.transform = `translateY(${(-kt * pick(515, 735)).toFixed(1)}px)`;
    // jam: besar di tengah pada awal video, lalu pindah ke pojok saat judul muncul
    const kj = E.io3(P(t, C.muncul - 0.5, C.muncul + 0.1));
    jam.style.transform = `translate(${((1 - kj) * (SW / 2 - pick(80, 60) - 140)).toFixed(1)}px, ${((1 - kj) * (SH * 0.42 - pick(60, 220))).toFixed(1)}px) scale(${lerp(3.6, 1, kj).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px "Space Mono"', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#05070D'; cx.fillRect(0, 0, W, H);
      const amt = KUAT * (1 - E.io3(P(t, C.tenang, C.tenang + 1.2)));
      // garis pita glitch tipis di latar
      const f = Math.floor(t * 24);
      for (let i = 0; i < 6; i++) if (hash(f * 1.7 + i * 13) < 0.5 * amt) { cx.fillStyle = `rgba(${i % 2 ? '255,60,90' : '60,220,255'},${(0.12 * amt).toFixed(2)})`; cx.fillRect(0, hash(f + i * 5) * H, W, 2 + hash(f + i * 9) * 14); }
      cx.fillStyle = 'rgba(255,255,255,.03)';
      for (let y = 0; y < H; y += 4) cx.fillRect(0, y, W, 1);
    },
  });

  KIT.registerType('gl', (root, v, sc, tm, T) => {
    ensure();
    if (v.munculAt != null) C.muncul = sc.start + T(v.munculAt, 0.5);
    if (v.hitung != null) C.hitung = sc.start + T(v.hitung, 1);
    if (v.tenang != null) C.tenang = sc.start + T(v.tenang, 0.2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="gl-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar != null) {
      const tL = T(v.layar, 1), W0 = pick(1240, 960);
      const kartu = PD.layar(root, 'breach-detail', { w: W0, potong: pick([280, 90, 960, 400], [280, 90, 700, 400]), judul: 'Privasimu Nexus · Detail insiden' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(330, 720) + 'px';
      const cips = (v.cip || []).map(([teks, at], i) => { const el = h(`<div class="gl-cip">${esc(teks)}</div>`); root.appendChild(el); el.style.left = pick([110, 1420, 1380][i], [60, 560, 60][i]) + 'px'; el.style.top = pick([560, 380, 720][i], [1310, 1310, 1390][i]) + 'px'; return { el, t: T(at, 2 + i) }; });
      parts.push((lt) => {
        const k = E.out3(P(lt, tL, tL + 0.8));
        tf(kartu, { y: (1 - k) * 80, o: cl(k * 3) });
        cips.forEach((c) => { const kc = P(lt, c.t, c.t + 0.35); tf(c.el, { s: kc > 0 ? E.outBack(kc) : 0, o: cl(kc * 3) }); });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
