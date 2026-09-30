// Gaya GB39 · KALEIDOSKOP: 8 irisan (45°) di dalam lingkaran; irisan genap = rotate(i·45°), ganjil = rotate((i+1)·45°)
// scaleY(-1) sehingga tiap tepi irisan menjadi cermin. Semua irisan memuat gambar sumber yang sama dengan transform
// (geser + putar) fungsi waktu. Zoom keseluruhan 2.4× → 1× pada cue "jauh". Logo + cincin modul pada scene 3.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const N = 8, S = 1400, D = pick(900, 1000);
  const MODUL = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden', 'Pihak ketiga', 'Transfer'];
  const C = { mulai: 9e9, jauh: 9e9, logo: 9e9, modul: MODUL.map(() => 9e9), tutup: 9e9 };
  let lapis = null, kal = null, imgs = [], logo = null, pil = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('kd-lapis');
    kal = h(`<div class="kd-kal" style="width:${D}px;height:${D}px"><div class="kd-pusat">${Array.from({ length: N }, (_, i) => `<div class="kd-irisan" style="width:${S}px;height:${S}px;transform:${i % 2 ? `rotate(${(i + 1) * 45}deg) scaleY(-1)` : `rotate(${i * 45}deg)`}"><img src="../assets/app/gap-hasil.png" alt=""></div>`).join('')}</div></div>`);
    lapis.appendChild(kal);
    imgs = [...kal.querySelectorAll('img')];
    logo = h(`<div class="kd-logo"><img src="${PD.LOGO}" alt=""><div class="kd-nx">NEXUS</div></div>`);
    lapis.appendChild(logo);
    pil = MODUL.map((m, i) => { const a = -Math.PI / 2 + (i / MODUL.length) * Math.PI * 2, R = pick(430, 440); const el = h(`<div class="kd-pil" style="left:${(SW / 2 + Math.cos(a) * R).toFixed(1)}px;top:${(SH / 2 + Math.sin(a) * R + pick(0, -40)).toFixed(1)}px">${m}</div>`); lapis.appendChild(el); return el; });
  }
  function gambar(t) {
    const u = Math.max(0, t - C.mulai);
    const zoom = lerp(2.4, 1, E.io3(P(t, C.jauh, C.jauh + 1.6)));
    const redup = P(t, C.logo, C.logo + 0.8);
    kal.style.transform = `translate(-50%, -50%) scale(${(zoom * lerp(1, 1.18, redup)).toFixed(3)}) rotate(${(u * 6).toFixed(2)}deg)`;
    kal.style.opacity = (t >= C.mulai ? 1 : 0) * lerp(1, 0.22, redup);
    kal.style.filter = redup > 0 ? `blur(${(redup * 6).toFixed(1)}px) saturate(${(1 - redup * 0.4).toFixed(2)})` : '';
    // sumber bergeser & berputar pelan (fungsi waktu) — tiap irisan sama
    const dx = Math.sin(u * 0.35) * 130, dy = 40 + Math.cos(u * 0.27) * 90, r = u * 9; // pusat gambar tepat di puncak irisan
    const tr = `rotate(${r.toFixed(2)}deg) scale(2.4) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
    imgs.forEach((im) => { im.style.transform = tr; });
    const kl = E.outBack(Math.max(0.001, P(t, C.logo + 0.3, C.logo + 0.8)));
    logo.style.opacity = t >= C.logo + 0.3 ? 1 : 0; logo.style.transform = `translate(-50%, -50%) scale(${kl.toFixed(3)})`;
    pil.forEach((el, i) => { const k = P(t, C.modul[i], C.modul[i] + 0.3); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translate(-50%, -50%) scale(${lerp(1.5, 1, E.out3(k)).toFixed(3)})`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Unbounded', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.7); g.addColorStop(0, '#2A1F4D'); g.addColorStop(1, '#0E0A1E');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('kd', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0);
    if (v.jauh != null) C.jauh = sc.start + T(v.jauh, 0.8);
    if (v.logo != null) C.logo = sc.start + T(v.logo, 0.3);
    if (v.modul) { // dua cue = awal & akhir, sisanya disebar rata
      if (v.modul.length === 2) { const a = sc.start + T(v.modul[0], 2), b = sc.start + T(v.modul[1], 5); MODUL.forEach((_, i) => { C.modul[i] = lerp(a, b, i / (MODUL.length - 1)); }); }
      else v.modul.forEach((c, i) => { C.modul[i] = sc.start + T(c, 2 + i * 0.5); });
    }
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="kd-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pop'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
