// Gaya SN13 · ROKET: adegan SVG di lapisan lintas scene (landasan, menara, roket, api, asap partikel). Semua posisi
// fungsi waktu: roket naik y = ½·a·u² sejak "luncur"; asap = 48 partikel dengan waktu lahir bertingkat; guncangan
// kamera dari hash(frame) dengan amplitudo meluruh. Hitung mundur / HOLD / GO / LIFT-OFF = DOM dari cue global.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const RX = pick(1420, 540), GY = pick(900, 1500); // posisi roket (x) & tanah (y)
  const C = { mulai: 9e9, hitung: [], hold: 9e9, go: 9e9, luncur: 9e9, tutup: 9e9 };
  let lapis = null, svg = null, roket = null, api = null, asap = [], lampu = [], count = null, hold = null, go = null, lift = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('rk-lapis');
    const S = V ? 1.25 : 1;
    svg = h(`<svg class="rk-svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}">
      <rect class="tanah" x="0" y="${GY}" width="${SW}" height="${SH - GY}"/>
      <g class="menara" transform="translate(${RX + 70 * S} ${GY}) scale(${S})"><rect x="0" y="-420" width="26" height="420"/><rect x="60" y="-420" width="26" height="420"/>${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${-60 - i * 55}" x2="86" y2="${-115 - i * 55}"/>`).join('')}<rect x="-70" y="-300" width="80" height="14"/></g>
      <g class="pad" transform="translate(${RX} ${GY}) scale(${S})"><rect x="-150" y="-16" width="300" height="16" rx="4"/>${[-120, -60, 0, 60, 120].map((x) => `<circle class="lampu" cx="${x}" cy="-24" r="6"/>`).join('')}</g>
      <g class="asap">${Array.from({ length: 48 }, () => '<circle r="10"/>').join('')}</g>
      <g class="roket" transform="translate(${RX} ${GY})"><g transform="scale(${S})">
        <g class="api"><path d="M-26 -14 q26 90 52 0 q-26 30 -52 0 z"/><path class="inti" d="M-14 -14 q14 56 28 0 q-14 18 -28 0 z"/></g>
        <path class="badan" d="M-40 -60 v-260 q0 -140 40 -200 q40 60 40 200 v260 z"/>
        <path class="sirip" d="M-40 -100 l-46 60 v50 l46 -30 z M40 -100 l46 60 v50 l-46 -30 z"/>
        <circle class="jendela" cx="0" cy="-360" r="22"/>
        <rect class="pita" x="-40" y="-190" width="80" height="18"/>
        <text class="label" transform="translate(-12 -240) rotate(-90)">PROYEK BARU</text>
      </g></g>
    </svg>`);
    lapis.appendChild(svg);
    roket = svg.querySelector('.roket'); api = svg.querySelector('.api'); asap = [...svg.querySelectorAll('.asap circle')]; lampu = [...svg.querySelectorAll('.lampu')];
    count = h('<div class="rk-count"></div>'); hold = h('<div class="rk-hold"><b>HOLD</b><span>DPIA?</span></div>'); go = h('<div class="rk-go">GO</div>'); lift = h('<div class="rk-lift">LIFT-OFF</div>');
    [count, hold, go, lift].forEach((el) => lapis.appendChild(el));
  }
  function gambar(t) {
    const u = t - C.luncur, naik = u > 0 ? 0.5 * 700 * u * u : 0;
    roket.setAttribute('transform', `translate(${RX} ${GY - naik})`);
    api.style.opacity = u > 0 ? (0.75 + 0.25 * hash(Math.floor(t * 30))) : 0;
    api.setAttribute('transform', u > 0 ? `scale(${(1 + 0.25 * hash(Math.floor(t * 40) + 3)).toFixed(2)} ${(1 + 0.6 * hash(Math.floor(t * 40) + 7)).toFixed(2)})` : 'scale(1 0)');
    lampu.forEach((l, i) => { l.style.opacity = t >= C.mulai && Math.floor(t * 4 + i) % 2 ? 1 : 0.25; });
    asap.forEach((c, i) => {
      const lahir = C.luncur - 0.2 + i * 0.045, age = t - lahir;
      if (age <= 0 || age > 2.8) { c.style.opacity = 0; return; }
      const arah = i % 2 ? 1 : -1, vx = arah * (90 + hash(i * 1.3) * 220), vy = -(40 + hash(i * 2.1) * 90);
      const x = RX + arah * 30 + vx * age, y = GY - 10 + vy * age + 30 * age * age, r = 14 + age * (40 + hash(i * 3.3) * 40);
      c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', Math.min(GY + 40, y).toFixed(1)); c.setAttribute('r', r.toFixed(1));
      c.style.opacity = (0.85 * (1 - P(age, 0.8, 2.8))).toFixed(3);
    });
    const guncang = u > 0 ? 16 * (1 - P(u, 0, 1.8)) : (t >= C.hold && t < C.hold + 0.5 ? 6 : 0);
    lapis.style.transform = guncang ? `translate(${((hash(Math.floor(t * 30)) - 0.5) * guncang).toFixed(1)}px, ${((hash(Math.floor(t * 30) + 9) - 0.5) * guncang).toFixed(1)}px)` : '';
    // hitung mundur
    const hit = C.hitung.filter(([tt]) => t >= tt).pop();
    const sedangHold = t >= C.hold && t < C.go, sesudahGo = t >= C.go;
    count.textContent = hit && !sedangHold && !sesudahGo ? hit[1] : (sesudahGo && u <= 0 ? '1' : '');
    if (hit && !sedangHold && !sesudahGo) { const k = P(t, hit[0], hit[0] + 0.3); count.style.opacity = 1; count.style.transform = `translate(-50%, -50%) scale(${lerp(1.6, 1, E.outExpo(k)).toFixed(3)})`; }
    else if (sesudahGo && u <= 0 && t >= C.go + 0.7) { count.style.opacity = 1; count.style.transform = 'translate(-50%, -50%) scale(1)'; }
    else count.style.opacity = 0;
    hold.style.opacity = sedangHold ? 1 : 0; hold.classList.toggle('kedip', sedangHold && Math.floor(t * 4) % 2 === 0);
    go.style.opacity = sesudahGo && t < C.go + 0.7 ? 1 : 0;
    lift.style.opacity = u > 0.3 ? 1 : 0; lift.style.transform = `translate(-50%, -50%) scale(${lerp(0.6, 1, E.outBack(Math.max(0.001, P(u, 0.3, 0.7)))).toFixed(3)})`;
    document.body.classList.toggle('hold', sedangHold);
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Orbitron', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1B1240'); g.addColorStop(0.55, '#5B2A6E'); g.addColorStop(0.85, '#E0743F'); g.addColorStop(1, '#F2B36A');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(255,255,255,.7)';
      for (let i = 0; i < 70; i++) { const y = hash(i * 2.7) * H * 0.5; cx.globalAlpha = 0.3 + 0.7 * hash(Math.floor(t * 2) + i); cx.fillRect(hash(i * 1.9) * W, y, 2, 2); }
      cx.globalAlpha = 1;
    },
  });

  KIT.registerType('rk', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0);
    (v.hitung || []).forEach(([c, d], i) => { C.hitung.push([sc.start + T(c, 0.5 + i), d]); });
    if (v.hold != null) C.hold = sc.start + T(v.hold, 3);
    if (v.go != null) C.go = sc.start + T(v.go, 5);
    if (v.luncur != null) C.luncur = sc.start + T(v.luncur, 6);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="rk-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(860, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(120, (SW - el._w) / 2)}px`; el.style.top = `${pick(160, 250)}px`;
      const t0 = T(L.at, 0.5), t1 = T(L.sampai, 5.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)) * (1 - P(lt, t1, t1 + 0.35)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
