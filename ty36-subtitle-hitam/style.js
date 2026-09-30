// Gaya TY36 · SUBTITLE DI LAYAR HITAM: tidak ada gambar; teks berganti dengan potongan keras seperti subtitle film.
// Satu-satunya gambar = dasbor asli yang "menyala" seperti monitor di ruang gelap (scene s4).
(function () {
  const { V, SW, SH, h, esc, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;

  KIT.style({
    fonts: ['600 60px Inter', '500 60px Inter', 'italic 500 60px Inter'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#000'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('sub', (root, v, sc, tm, T) => {
    const parts = [];
    root.appendChild(h('<div class="sb-hitam"></div>')); // menutup debu latar bawaan kit: hitam harus benar-benar kosong
    if (v.nyala != null) {
      const t0 = T(v.nyala, 0.3), W0 = pick(1240, 960);
      const sinar = h('<div class="sb-sinar"></div>');
      root.appendChild(sinar);
      const kartu = PD.layar(root, 'dashboard', { w: W0, potong: pick([275, 85, 975, 490], [275, 85, 640, 490]), bar: false, kelas: 'sb-monitor' });
      kartu.style.left = (SW - W0) / 2 + 'px'; kartu.style.top = pick(70, 250) + 'px';
      const kilat = h('<div class="sb-kilat"></div>');
      kartu.appendChild(kilat);
      parts.push((lt) => {
        const k = P(lt, t0, t0 + 0.4), on = k > 0;
        // monitor tabung/LED menyala: garis tipis melebar → membuka vertikal → kilat memudar
        const sx = E.out3(P(lt, t0, t0 + 0.14)), sy = lerp(0.008, 1, E.outExpo(P(lt, t0 + 0.1, t0 + 0.42)));
        kartu.style.transform = `scale(${lerp(0.2, 1, sx).toFixed(4)}, ${sy.toFixed(4)})`;
        kartu.style.opacity = on ? 1 : 0;
        kilat.style.opacity = (1 - P(lt, t0 + 0.12, t0 + 0.9)).toFixed(3);
        sinar.style.opacity = (E.out3(P(lt, t0 + 0.1, t0 + 1.0)) * (0.8 + 0.06 * Math.sin(lt * 5))).toFixed(3);
      });
    }
    if (v.subs) {
      const box = h('<div class="sb-sub"></div>');
      root.appendChild(box);
      const lines = v.subs.map(([teks, a, b, jenis]) => {
        const el = h(`<div class="ln ${jenis}">${esc(teks).replace(/\|/g, '<br>')}</div>`);
        box.appendChild(el);
        return { el, a: T(a, 0), b: T(b, 99) };
      });
      parts.push((lt) => lines.forEach((l) => { l.el.style.display = lt >= l.a && lt < l.b ? 'block' : 'none'; }));
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => parts.forEach((f) => f(lt, d));
  });
})();
