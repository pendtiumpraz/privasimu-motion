// Gaya TY11 · FONT VARIABEL: kata AUDIT di lapisan lintas scene. Tingkat "sesak" (0–1) naik bertahap per langkah hari,
// lalu turun saat klik. Tebal (wght), lebar (wdth), warna, getar, dan napas dihitung dari tingkat itu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { tegang: 9e9, langkah: [], klik: 9e9, lega: 9e9, tutup: 9e9 };
  let lapis = null, kata = null, pil = null;
  const HARI = ['H-7', 'H-6', 'H-5', 'H-4', 'H-3', 'H-2', 'H-1'];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('fv-lapis');
    kata = h(`<div class="fv-kata" style="top:${pick(440, 720)}px">AUDIT</div>`);
    pil = h(`<div class="fv-pil" style="top:${pick(130, 420)}px">H-7</div>`);
    lapis.appendChild(kata); lapis.appendChild(pil);
  }
  // tingkat sesak 0..1
  function sesak(t) {
    let s = 0.1 * E.io3(P(t, C.tegang, C.tegang + 0.6));
    C.langkah.forEach((tl, i) => { s += (0.9 / 6) * E.outBack(P(t, tl, tl + 0.35)); });
    return s * (1 - E.io3(P(t, C.lega, C.lega + 1.2)));
  }
  function gambar(t) {
    const s = cl(sesak(t)), lega = E.io3(P(t, C.lega, C.lega + 1.2));
    const napas = Math.sin(t * lerp(1.6, 6, s)) * 0.5 + 0.5;
    const wght = lerp(lerp(260, 900, s), 300, lega) + napas * lerp(40, 0, s) * (1 - s);
    const wdth = lerp(lerp(120, 62, s), 118, lega) + napas * 4 * (1 - s);
    const r = Math.round(lerp(lerp(245, 255, s), 120, lega)), g = Math.round(lerp(lerp(240, 60, s), 220, lega)), b = Math.round(lerp(lerp(235, 60, s), 170, lega));
    const getar = s * s * 14, f = Math.floor(t * 30);
    kata.style.fontVariationSettings = `"wght" ${wght.toFixed(0)}, "wdth" ${wdth.toFixed(1)}`;
    kata.style.color = `rgb(${r},${g},${b})`;
    kata.style.letterSpacing = lerp(0.06, -0.04, s).toFixed(3) + 'em';
    kata.style.transform = `translate(${((hash(f) - 0.5) * getar).toFixed(1)}px, ${((hash(f + 9) - 0.5) * getar).toFixed(1)}px) scale(${(1 + napas * 0.02 * (1 - s) + s * 0.08).toFixed(4)})`;
    let hari = 0; C.langkah.forEach((tl) => { if (t >= tl) hari++; });
    pil.textContent = HARI[Math.min(6, hari)];
    pil.style.opacity = t >= C.lega + 0.3 ? 0 : 1;
    const kp = Math.max(...C.langkah.map((tl) => (t > tl && t < tl + 0.3 ? 1 - (t - tl) / 0.3 : 0)), 0);
    pil.style.transform = `translateX(-50%) scale(${(1 + kp * 0.25).toFixed(3)})`;
    pil.classList.toggle('merah', s > 0.5);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['200 100px Archivo', '900 100px Archivo'],
    bg: (cx, t, id, th, W, H) => {
      const s = cl(sesak(t)), lega = E.io3(P(t, C.lega, C.lega + 1.2)); // dihitung dari waktu, bukan dari frame sebelumnya
      const top = [Math.round(lerp(lerp(24, 60, s), 10, lega)), Math.round(lerp(lerp(34, 10, s), 60, lega)), Math.round(lerp(lerp(70, 14, s), 50, lega))];
      cx.fillStyle = `rgb(${top.join(',')})`; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.7);
      g.addColorStop(0, `rgba(${lerp(80, 255, s)},${lerp(120, 40, s)},${lerp(255, 40, s)},${lerp(0.16, 0.22, s)})`); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('fv', (root, v, sc, tm, T) => {
    ensure();
    if (v.tegang != null) C.tegang = sc.start + T(v.tegang, 2);
    if (v.langkah) C.langkah = v.langkah.map((c, i) => sc.start + T(c, 0.5 + i * 0.7));
    if (v.klik != null) C.klik = sc.start + T(v.klik, 1);
    if (v.lega != null) C.lega = sc.start + T(v.lega, 1.4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="fv-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.klik != null) {
      const tK = T(v.klik, 1), W0 = pick(720, 700);
      const kartu = PD.layar(root, 'dashboard', { w: W0, potong: [303, 252, 300, 46], bar: false, kelas: 'fv-kartu' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(700, 1120) + 'px';
      const kursor = h('<div class="fv-kursor"><svg viewBox="0 0 24 24" width="54" height="54"><path d="M5 3l14 8-6 1.5L16 20l-3 1.5-3-7.5L5 18z" fill="#fff" stroke="#0B1B4D" stroke-width="1.6" stroke-linejoin="round"/></svg></div>');
      kartu.appendChild(kursor);
      const sorot = h('<div class="fv-sorot"></div>');
      kartu.appendChild(sorot);
      parts.push((lt) => {
        const k = E.out3(P(lt, tK - 0.5, tK - 0.05));
        tf(kartu, { y: (1 - k) * 60, o: k });
        const kk = P(lt, tK - 0.4, tK), tekan = Math.sin(Math.PI * P(lt, tK, tK + 0.25));
        kursor.style.transform = `translate(${lerp(W0 * 0.9, W0 * 0.5, E.io3(kk)).toFixed(1)}px, ${lerp(150, 50, E.io3(kk)).toFixed(1)}px) scale(${(1 - tekan * 0.15).toFixed(3)})`;
        sorot.style.opacity = P(lt, tK, tK + 0.15);
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
