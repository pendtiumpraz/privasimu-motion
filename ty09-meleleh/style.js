// Gaya TY09 · LIQUID: teks "72 JAM" di lapisan lintas scene dengan filter SVG (turbulence + displacement) yang skalanya
// naik saat meleleh dan turun ke nol saat membeku; tetesan = elemen bulat panjang yang memanjang ke bawah.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const NS = 'http://www.w3.org/2000/svg';
  const C = { leleh: 9e9, beku: 9e9, surel: [], pil: 9e9, tutup: 9e9 };
  let lapis = null, kata = null, tetes = [], disp = null, turb = null, surelEl = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lq-lapis');
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('style', 'position:absolute;width:0;height:0');
    svg.innerHTML = `<filter id="lq-leleh" x="-20%" y="-20%" width="140%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    lapis.appendChild(svg);
    disp = svg.querySelector('feDisplacementMap'); turb = svg.querySelector('feTurbulence');
    kata = h(`<div class="lq-kata" style="top:${pick(300, 620)}px"><span>72 JAM</span></div>`);
    lapis.appendChild(kata);
    for (let i = 0; i < 9; i++) {
      const el = h(`<i class="lq-tetes" style="left:${(pick(300, 60) + i * pick(150, 118) + hash(i) * 40).toFixed(0)}px;width:${(26 + hash(i * 3) * 30).toFixed(0)}px"></i>`);
      kata.appendChild(el); tetes.push({ el, d: hash(i * 7), v: 0.6 + hash(i * 11) * 0.8 });
    }
    surelEl = [0, 1, 2].map((i) => { const el = h('<div class="lq-surel">✉️</div>'); lapis.appendChild(el); return el; });
  }
  function gambar(t) {
    const kl = E.io3(P(t, C.leleh, C.leleh + 3.2)), kb = E.outExpo(P(t, C.beku, C.beku + 0.35));
    const skala = lerp(lerp(4, 70, kl), 0, kb);
    disp.setAttribute('scale', skala.toFixed(1));
    turb.setAttribute('baseFrequency', `${(0.012 + 0.004 * Math.sin(t * 0.7)).toFixed(4)} ${(0.03 + 0.01 * Math.cos(t * 0.5)).toFixed(4)}`);
    turb.setAttribute('seed', String(7 + Math.floor(t * 2) % 5)); // gelombang lambat bergeser
    kata.classList.toggle('beku', kb > 0.2);
    const sp = $('span', kata);
    sp.style.transform = `scaleY(${lerp(1, 1.12, kl * (1 - kb)).toFixed(3)}) translateY(${(kl * (1 - kb) * 30).toFixed(1)}px)`;
    tetes.forEach((d) => {
      const hgt = lerp(0, pick(260, 200) + d.v * pick(260, 200), cl((kl - d.d * 0.5) / 0.5)) * (1 - kb);
      d.el.style.height = hgt.toFixed(0) + 'px'; d.el.style.opacity = hgt > 4 ? 1 : 0;
    });
    surelEl.forEach((el, i) => {
      const t0 = C.surel[i] ?? 9e9, u = t - t0, on = u > 0 && u < 1.6;
      const dir = i % 2 ? -1 : 1, x = SW / 2 + dir * lerp(-SW * 0.6, SW * 0.6, u / 1.6), y = pick(560, 1000) + Math.sin(u * 6 + i) * 40 - i * 60;
      tf(el, { x, y, r: dir * 12 + Math.sin(u * 9) * 8, o: on ? 1 : 0 });
    });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 100px "Archivo Black"', '800 60px Rubik'],
    bg: (cx, t, id, th, W, H) => {
      const kb = E.io3(P(t, C.beku, C.beku + 0.8));
      const g = cx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, kb > 0 ? `rgb(${lerp(48, 16, kb)},${lerp(20, 40, kb)},${lerp(16, 90, kb)})` : '#301410'); g.addColorStop(1, kb > 0 ? `rgb(${lerp(20, 6, kb)},${lerp(8, 18, kb)},${lerp(8, 44, kb)})` : '#140808');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('lq', (root, v, sc, tm, T) => {
    ensure();
    if (v.leleh != null) C.leleh = sc.start + T(v.leleh, 0.3);
    if (v.beku != null) C.beku = sc.start + T(v.beku, 2);
    if (v.surel) C.surel = v.surel.map((c, i) => sc.start + T(c, 1 + i));
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="lq-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.pil != null) {
      const tP = T(v.pil, 3), LW = pick(560, 620);
      const lensa = PD.layar(root, 'dsr-detail', { w: LW, potong: [852, 100, 126, 46], bar: false, kelas: 'lq-pil' });
      lensa.style.left = (SW - LW) / 2 + 'px'; lensa.style.top = pick(640, 1080) + 'px';
      const ket = h('<div class="lq-ket">tenggat otomatis · dari layar permohonan DSR</div>');
      root.appendChild(ket);
      parts.push((lt) => { const k = P(lt, tP, tP + 0.5); tf(lensa, { s: k > 0 ? E.outBack(k) : 0, o: cl(k * 3) }); tf(ket, { o: P(lt, tP + 0.4, tP + 0.8) }); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
