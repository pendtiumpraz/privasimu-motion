// Gaya SN08 · FILM BISU: lapisan lintas scene berisi 4 kartu teks + 2 adegan siluet (SVG). Semua jendela waktu global.
// Flicker & goyangan bingkai dari hash(frame); gerak adegan dipatahkan ke 12 fps. Setelah cue "warna" film jadi berwarna
// (kelas .warna: latar krem, siluet memudar) dan kartu produk asli tampil di scene.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KARTU = ['Pada suatu pagi<br>yang tenang…', '— Auditor datang. —', 'RoPA-nya mana?!', 'Untung…<br>sudah tercatat.'];
  const C = { kartu: KARTU.map(() => [9e9, 9e9]), adegan: [[9e9, 9e9], [9e9, 9e9]], pintu: 9e9, warna: 9e9, tutup: 9e9 };
  let lapis = null, kartuEl = [], adeganEl = [], jamJarum = null, pintuEl = null, auditor = null, pelari = null, kertas = [], laci = null, seru = null;

  const ORN = (w, hh) => `<svg class="fb-orn" viewBox="0 0 ${w} ${hh}" preserveAspectRatio="none"><rect x="10" y="10" width="${w - 20}" height="${hh - 20}" rx="4"/><rect x="22" y="22" width="${w - 44}" height="${hh - 44}" rx="2"/>${[[30, 30], [w - 30, 30], [30, hh - 30], [w - 30, hh - 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}<path d="M${w / 2 - 70} 34 q70 -18 140 0 M${w / 2 - 70} ${hh - 34} q70 18 140 0"/></svg>`;
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('fb-lapis');
    const KW = pick(1240, 940), KH = pick(520, 560);
    kartuEl = KARTU.map((t) => { const el = h(`<div class="fb-kartu" style="width:${KW}px;height:${KH}px">${ORN(KW, KH)}<div class="fb-teks">${t}</div></div>`); lapis.appendChild(el); return el; });
    // adegan 0: kantor tenang → pintu terbuka, auditor masuk
    const a0 = h(`<svg class="fb-adegan" viewBox="0 0 1000 560"><line x1="0" y1="470" x2="1000" y2="470" class="lantai"/>
      <g class="jam"><circle cx="150" cy="120" r="52"/><line class="jarum" x1="150" y1="120" x2="150" y2="84"/><line class="jarum2" x1="150" y1="120" x2="178" y2="120"/></g>
      <rect x="290" y="350" width="260" height="120"/><rect x="300" y="310" width="90" height="40"/>
      <circle cx="420" cy="278" r="30"/><path d="M370 350 q50 -60 100 0 z"/>
      <rect x="770" y="190" width="120" height="280" class="kusen"/><rect class="pintu" x="776" y="196" width="108" height="274"/>
      <g class="auditor"><rect x="812" y="300" width="60" height="170"/><circle cx="842" cy="266" r="26"/><rect x="806" y="228" width="72" height="16"/><rect x="826" y="208" width="32" height="22"/><rect x="876" y="392" width="34" height="46" rx="3"/></g>
    </svg>`);
    // adegan 1: panik
    const a1 = h(`<svg class="fb-adegan" viewBox="0 0 1000 560"><line x1="0" y1="470" x2="1000" y2="470" class="lantai"/>
      <rect x="120" y="330" width="220" height="140"/><rect class="laci" x="130" y="345" width="200" height="40"/>
      <g class="pelari"><circle cx="0" cy="-190" r="28"/><path d="M-30 -160 h60 l-10 110 h-40 z"/><path class="kaki" d="M-20 -50 l-30 50 M20 -50 l30 50"/><text class="seru" x="0" y="-240">!!</text></g>
      ${Array.from({ length: 9 }, (_, i) => `<rect class="kertas" width="44" height="60" rx="2"/>`).join('')}
    </svg>`);
    adeganEl = [a0, a1]; adeganEl.forEach((a) => lapis.appendChild(a));
    jamJarum = [a0.querySelector('.jarum'), a0.querySelector('.jarum2')]; pintuEl = a0.querySelector('.pintu'); auditor = a0.querySelector('.auditor');
    pelari = a1.querySelector('.pelari'); kertas = [...a1.querySelectorAll('.kertas')]; laci = a1.querySelector('.laci'); seru = a1.querySelector('.seru');
  }
  function gambar(t) {
    const q = Math.floor(t * 12) / 12; // gerak patah-patah 12 fps
    const kedip = 0.82 + 0.18 * hash(Math.floor(t * 24));
    const gx = (hash(Math.floor(t * 24) + 7) - 0.5) * 4, gy = (hash(Math.floor(t * 24) + 13) - 0.5) * 3;
    const warna = P(t, C.warna, C.warna + 0.6);
    lapis.style.opacity = (lerp(kedip, 1, warna) * (1 - P(t, C.tutup, C.tutup + 0.3))).toFixed(3);
    lapis.style.transform = warna < 1 ? `translate(${gx.toFixed(1)}px, ${gy.toFixed(1)}px)` : '';
    document.body.classList.toggle('warna', warna > 0.5);
    kartuEl.forEach((el, i) => { const [t0, t1] = C.kartu[i]; const on = t >= t0 && t < t1; el.style.opacity = on ? (0.9 + 0.1 * hash(Math.floor(t * 30) + i)).toFixed(3) : 0; });
    adeganEl.forEach((el, i) => { const [t0, t1] = C.adegan[i]; el.style.opacity = t >= t0 && t < t1 ? 1 : 0; });
    // adegan 0
    jamJarum[0].setAttribute('transform', `rotate(${(q * 60) % 360} 150 120)`); jamJarum[1].setAttribute('transform', `rotate(${(q * 720) % 360} 150 120)`);
    const kp = E.io3(P(q, C.pintu, C.pintu + 0.5));
    pintuEl.setAttribute('transform', `translate(776 0) scale(${(1 - kp * 0.9).toFixed(3)} 1) translate(-776 0)`);
    const ka = P(q, C.pintu + 0.3, C.pintu + 1.3);
    auditor.setAttribute('transform', `translate(${(lerp(140, -180, ka)).toFixed(1)} ${(Math.abs(Math.sin(q * 18)) * -6 * (ka > 0 && ka < 1 ? 1 : 0)).toFixed(1)})`);
    auditor.style.opacity = kp > 0 ? 1 : 0;
    // adegan 1: panik
    const u = q - C.adegan[1][0];
    if (u >= 0) {
      const tri = Math.abs(((u * 0.9) % 2) - 1); // bolak-balik
      pelari.setAttribute('transform', `translate(${(lerp(300, 760, tri)).toFixed(1)} 470) scale(${tri > 0.5 ? -1 : 1} 1)`);
      pelari.querySelector('.kaki').setAttribute('transform', `rotate(${(Math.floor(u * 12) % 2 ? 18 : -18)} 0 -50)`);
      seru.style.opacity = Math.floor(u * 6) % 2 ? 1 : 0;
      laci.setAttribute('transform', `translate(0 ${(Math.floor(u * 4) % 2 ? 22 : 0)})`);
      kertas.forEach((k, i) => { const p = ((u * 0.55 + i * 0.13) % 1), x = 150 + i * 90 + Math.sin(i * 3.1) * 30 + p * 120 * (i % 2 ? 1 : -1), y = 420 - Math.sin(p * Math.PI) * (260 + (i % 3) * 60); k.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(p * 360 * (i % 2 ? 1 : -1)).toFixed(0)} 22 30)`); });
    }
  }

  KIT.style({
    fonts: ['italic 600 60px "Playfair Display"', '700 60px Cinzel', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const warna = t >= C.warna;
      cx.fillStyle = warna ? '#F1E9DA' : '#1A1A1A'; cx.fillRect(0, 0, W, H);
      if (warna) return;
      // goresan film vertikal (berpindah tiap frame) + bintik
      const f = Math.floor(t * 24);
      cx.strokeStyle = 'rgba(255,255,255,.18)'; cx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) { if (hash(f * 3 + i) < 0.55) continue; const x = hash(f + i * 11) * W; cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x + (hash(i) - 0.5) * 6, H); cx.stroke(); }
      cx.fillStyle = 'rgba(255,255,255,.35)';
      for (let i = 0; i < 12; i++) { if (hash(f * 7 + i) < 0.7) continue; cx.fillRect(hash(f + i * 5) * W, hash(f + i * 9) * H, 3, 3); }
    },
  });

  KIT.registerType('fb', (root, v, sc, tm, T) => {
    ensure();
    (v.kartu || []).forEach(([i, a, b]) => { C.kartu[i] = [sc.start + T(a, 0.2), sc.start + T(b, 2)]; });
    (v.adeganMulai || []).forEach(([i, a]) => { C.adegan[i][0] = sc.start + T(a, 1); });
    (v.adeganAkhir || []).forEach(([i, b]) => { C.adegan[i][1] = sc.start + T(b, 5); });
    if (v.pintu != null) C.pintu = sc.start + T(v.pintu, 3);
    if (v.warna != null) C.warna = sc.start + T(v.warna, 2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1180, 980), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(330, 700)}px`;
      const t0 = T(L.at, 3);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.6)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
