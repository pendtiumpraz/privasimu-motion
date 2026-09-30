// Gaya TY15 · ODOMETER: 6 sel digit (HH:MM:SS), tiap sel berisi pita 0–9 yang digeser translateY dari nilai waktu.
// Sisa waktu = 72 jam − elapsed(t); elapsed berjalan 1× sejak cue "mulai", dipercepat (time-lapse) sejak "cepat",
// dan membeku pada "stop". Gulir per detik dianimasikan pada fase 1× (digit lama → baru), langsung lompat saat cepat.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const CELL_H = pick(220, 160), VMAX = 14000, RAMP = 1.5;
  const C = { mulai: 9e9, cepat: 9e9, stop: 9e9, tutup: 9e9 };
  let lapis = null, panel = null, strips = [], stempel = null, lampu = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('od-lapis');
    const sel = () => `<div class="od-c"><div class="od-s" data-bebas="1">${'0123456789'.split('').map((d) => `<span>${d}</span>`).join('')}</div></div>`;
    panel = h(`<div class="od-panel"><div class="od-baris">${sel()}${sel()}<i>:</i>${sel()}${sel()}<i>:</i>${sel()}${sel()}</div><div class="od-lbl"><span>JAM</span><span>MENIT</span><span>DETIK</span></div><div class="od-ket">BATAS PEMBERITAHUAN 3×24 JAM</div><div class="od-lampu"></div></div>`);
    lapis.appendChild(panel);
    strips = [...panel.querySelectorAll('.od-s')];
    lampu = panel.querySelector('.od-lampu');
    stempel = h('<div class="od-stempel">PEMBERITAHUAN<br>TERKIRIM<small>*ilustrasi</small></div>');
    lapis.appendChild(stempel);
  }
  function elapsed(t) {
    if (t <= C.mulai) return 0;
    const tEnd = Math.min(t, C.stop);
    let e = Math.min(tEnd, C.cepat) - C.mulai;
    if (tEnd > C.cepat) {
      const u = tEnd - C.cepat;
      e += u <= RAMP ? u + (VMAX - 1) * u * u / (2 * RAMP) : RAMP + (VMAX - 1) * RAMP / 2 + (u - RAMP) * VMAX;
    }
    return Math.max(0, e);
  }
  function digits(sisa) { // sisa detik (bulat) → [h1,h0,m1,m0,s1,s0]
    const s = Math.max(0, Math.round(sisa)), hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60), ss = s % 60;
    return [Math.floor(hh / 10), hh % 10, Math.floor(mm / 10), mm % 10, Math.floor(ss / 10), ss % 10];
  }
  function gambar(t) {
    const el = elapsed(t), sisa = 72 * 3600 - el;
    const cur = digits(Math.floor(sisa)), prev = digits(Math.floor(sisa) + 1);
    const fr = el - Math.floor(el), lambat = t < C.cepat + 0.25 && t < C.stop;
    const roll = lambat ? E.io3(P(fr, 0, 0.22)) : 1;
    strips.forEach((s, i) => {
      const v = t <= C.mulai ? cur[i] : cur[i] + (prev[i] - cur[i]) * (1 - roll); // prev → cur (menggulir ke bawah)
      s.style.transform = `translateY(${(-cl(v / 9.999) * 9.999 * CELL_H).toFixed(2)}px)`;
    });
    const nyala = P(t, C.mulai, C.mulai + 0.3);
    panel.classList.toggle('nyala', nyala > 0);
    lampu.style.opacity = (nyala * (t < C.stop ? 0.55 + 0.45 * Math.abs(Math.sin(t * 3.1)) : 1)).toFixed(3);
    panel.classList.toggle('cepat', t > C.cepat + 0.3 && t < C.stop);
    panel.classList.toggle('stop', t >= C.stop);
    const ks = P(t, C.stop + 0.1, C.stop + 0.4);
    stempel.style.opacity = ks > 0 ? 1 : 0;
    stempel.style.transform = `translate(-50%, -50%) rotate(-8deg) scale(${lerp(1.8, 1, E.outExpo(ks)).toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Share Tech Mono"', '700 60px Barlow', '800 60px Barlow'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H * 0.35, W * 0.8); g.addColorStop(0, '#1B2230'); g.addColorStop(1, '#070A10');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(255,255,255,.04)'; cx.lineWidth = 1;
      for (let x = 0; x < W; x += 60) { cx.beginPath(); cx.moveTo(x + 0.5, 0); cx.lineTo(x + 0.5, H); cx.stroke(); }
      for (let y = 0; y < H; y += 60) { cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
    },
  });

  KIT.registerType('od', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 2.5);
    if (v.cepat != null) C.cepat = sc.start + T(v.cepat, 1.5);
    if (v.stop != null) C.stop = sc.start + T(v.stop, 4.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="od-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1080, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(560, 700)}px`;
      const sk = el._w / L.potong[2], t0 = T(L.at, 1);
      const sorot = (v.sorot || []).map((c, i) => {
        const d = h(`<div class="od-sorot" style="top:${(46 + i * 52.5 * sk).toFixed(1)}px;height:${(52.5 * sk).toFixed(1)}px"></div>`);
        el.appendChild(d); return { d, t: T(c, 2 + i * 0.8) };
      });
      let cincin = null, tc = 0;
      if (L.cincin) { const [x, y, w, hh] = L.cincin; cincin = h(`<div class="od-cincin" style="left:${(x * sk - 8).toFixed(1)}px;top:${(46 + y * sk - 8).toFixed(1)}px;width:${(w * sk + 16).toFixed(1)}px;height:${(hh * sk + 16).toFixed(1)}px"></div>`); el.appendChild(cincin); tc = t0 + 0.6; }
      parts.push((lt, d) => {
        const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 40).toFixed(1)}px)`;
        sorot.forEach((s) => { const u = P(lt, s.t, s.t + 0.15); s.d.style.opacity = (u * (1 - 0.55 * P(lt, s.t + 0.6, s.t + 1))).toFixed(3); });
        if (cincin) { const u = P(lt, tc, tc + 0.3); cincin.style.opacity = u > 0 ? 1 : 0; cincin.style.transform = `scale(${lerp(1.4, 1, E.out3(u)).toFixed(3)})`; }
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
