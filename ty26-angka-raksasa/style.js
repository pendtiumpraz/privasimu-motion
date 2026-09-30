// Gaya TY26 · ANGKA RAKSASA: angka "2%" hidup di lapisan lintas scene (hentakan, napas lewat sumbu lebar font variabel,
// getar, denyut, lalu mengecil ke atas). Peta kewajiban → modul digambar di scene s3.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const F = pick(880, 600), CX = SW / 2, CY = pick(430, 720);
  const C = { hantam: 9e9, getar: 9e9, denyut: 9e9, kecil: 9e9, tutup: 9e9 };
  let lapis = null, angka = null, persen = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('bn-lapis');
    angka = h(`<div class="bn-angka" data-bebas style="font-size:${F}px;top:${CY}px"><span class="d">2</span><span class="p">%</span></div>`);
    lapis.appendChild(angka);
    persen = $('.p', angka);
  }
  function gambar(t) {
    const kh = E.outExpo(P(t, C.hantam, C.hantam + 0.32));
    const den = Math.sin(Math.PI * P(t, C.denyut, C.denyut + 0.55));
    const g = t > C.getar && t < C.getar + 0.4 ? (1 - (t - C.getar) / 0.4) * 16 : 0;
    const kk = E.io3(P(t, C.kecil, C.kecil + 0.8));
    const napas = 0.5 + 0.5 * Math.sin(t * 1.4);
    const wdth = lerp(lerp(88, 100, kh), 100, kk) + den * 0 + napas * 0 ;
    const s = lerp(1.35, 1, kh) * (1 + 0.06 * den);
    const x = (hash(Math.floor(t * 30)) - 0.5) * g, y = (hash(Math.floor(t * 30) + 7) - 0.5) * g;
    const tx = lerp(0, 0, kk), ty = lerp(0, pick(-290, -530), kk), ss = lerp(s, pick(0.26, 0.3), kk);
    angka.style.transform = `translate(${(tx + x).toFixed(1)}px, ${(ty + y).toFixed(1)}px) scale(${ss.toFixed(4)})`;
    angka.style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}, "opsz" 96`;
    angka.style.opacity = kh > 0 ? 1 : 0;
    angka.style.filter = kh < 0.98 ? `blur(${((1 - kh) * 8).toFixed(1)}px)` : 'none';
    persen.style.color = den > 0.02 || (t > C.getar && t < C.getar + 1.2) ? '#FF4D2E' : '';
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 100px "Bricolage Grotesque"', '600 60px "Bricolage Grotesque"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0C0C0F'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, Math.max(W, H) * 0.6);
      g.addColorStop(0, 'rgba(255,77,46,.10)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('bn', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['hantam', 'getar', 'denyut', 'kecil']) if (v[k] != null) C[k] = sc.start + T(v[k], 0);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="bn-teks ${v.baris ? 'atas' : ''}">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc, { dari: T(v.teksAt, 0.3) - 0.05 });
      ws.forEach((w) => w.el.classList.add('klip'));
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.catatan) {
      const el = h(`<div class="bn-cat">${esc(v.catatan)}</div>`);
      root.appendChild(el);
      parts.push((lt, d) => tf(el, { o: P(lt, 1.2, 1.7) * (1 - P(lt, d - 0.25, d - 0.02)) }));
    }
    if (v.baris) {
      const tP = T(v.peta, 1.5), tMod = T(v.modulAt, tP + 2);
      const box = h('<div class="bn-peta"></div>');
      root.appendChild(box);
      const rows = v.baris.map(([kw, mod], i) => {
        const el = h(`<div class="bn-row"><span class="kw">${esc(kw)}</span><svg class="ar" viewBox="0 0 120 40"><path pathLength="1" d="M4 20 H108 M90 6 L110 20 L90 34"/></svg><span class="mod">${esc(mod)}</span></div>`);
        box.appendChild(el);
        return { el, kw: $('.kw', el), ar: $('path', el), mod: $('.mod', el), t: tP + i * 0.5 };
      });
      parts.push((lt) => rows.forEach((r, i) => {
        const k = E.out3(P(lt, r.t, r.t + 0.45));
        tf(r.el, { x: (1 - k) * -60, o: k });
        const km = P(lt, tMod + i * 0.12, tMod + i * 0.12 + 0.4);
        r.ar.style.strokeDashoffset = (1 - E.out3(km)).toFixed(3);
        tf(r.mod, { s: km > 0 ? E.outBack(km) : 0, o: cl(km * 4) });
      }));
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
