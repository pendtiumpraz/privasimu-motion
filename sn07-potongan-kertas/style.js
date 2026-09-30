// Gaya SN07 · POTONGAN KERTAS: tiga lapisan paralaks (belakang/tengah/depan) berisi bentuk kertas bertepi kasar;
// kamera = pergeseran lapisan dengan kecepatan berbeda (fungsi waktu). Kartu kredit & kartu modul "dipotong": muncul
// lewat clip-path yang membuka dari sudut + rotasi kaku. Payoff: kartu modul meluncur ke pusat menumpuk jadi perisai.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const MODUL = ['RoPA', 'DPIA', 'DSR', 'Consent', 'Insiden', 'Pihak ketiga', 'Transfer'];
  const KREDIT = ['DIPERSEMBAHKAN OLEH', 'TENGGAT YANG TIDAK MENUNGGU', 'MENAMPILKAN'];
  // posisi kartu modul saat "terbuka" (H / V) + rotasi kaku
  const POS = V
    ? [[300, 560, -6], [760, 640, 5], [330, 880, 4], [780, 960, -5], [340, 1180, -4], [760, 1270, 6], [540, 1500, -3]]
    : [[300, 300, -6], [960, 250, 4], [1620, 320, -5], [420, 640, 5], [1500, 660, -4], [760, 880, -3], [1200, 900, 6]];
  const C = { buka: 9e9, kredit: [9e9, 9e9, 9e9], modul: MODUL.map(() => 9e9), satu: 9e9, logo: 9e9, sub: 9e9, tutup: 9e9 };
  let lapis = null, L = [], kreditEl = [], modulEl = [], perisai = null, logo = null, sub = null, tirai = [];

  // tepi kasar deterministik: poligon dengan sedikit gerigi
  function kasar(seed, n = 14) {
    const pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * 4; const sisi = Math.floor(a), f = a - sisi, j = (hash(seed + i * 1.7) - 0.5) * 2.2; let x, y;
      if (sisi === 0) { x = f * 100; y = 0 + j; } else if (sisi === 1) { x = 100 - j; y = f * 100; } else if (sisi === 2) { x = 100 - f * 100; y = 100 - j; } else { x = 0 + j; y = 100 - f * 100; }
      pts.push(`${cl(x, -3, 103).toFixed(1)}% ${cl(y, -3, 103).toFixed(1)}%`); }
    return `polygon(${pts.join(',')})`;
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('pk-lapis');
    L = [0, 1, 2].map((i) => { const el = h(`<div class="pk-lapisan l${i}"></div>`); lapis.appendChild(el); return el; });
    // bentuk geometris latar (lapisan belakang & tengah)
    const bentuk = V
      ? [[0, 'segitiga bata', -40, 300, 520], [0, 'bulat biru', 700, 1500, 420], [1, 'garis krem', 200, 1000, 900], [1, 'segitiga biru', 720, 260, 380], [0, 'bulat bata', 60, 1650, 300]]
      : [[0, 'segitiga bata', -80, 120, 620], [0, 'bulat biru', 1500, 700, 520], [1, 'garis krem', 500, 560, 1100], [1, 'segitiga biru', 1400, -60, 420], [0, 'bulat bata', 100, 820, 300]];
    bentuk.forEach(([li, kelas, x, y, s], i) => { L[li].appendChild(h(`<div class="pk-bentuk ${kelas}" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;clip-path:${kelas.startsWith('segitiga') ? 'polygon(2% 98%, 50% 3%, 98% 98%)' : kelas.startsWith('bulat') ? 'circle(48% at 50% 50%)' : kasar(i * 7, 10)}"></div>`)); });
    // tirai kertas (dua daun, terbuka di awal)
    tirai = [0, 1].map((i) => { const el = h(`<div class="pk-tirai t${i}" style="clip-path:${kasar(30 + i, 12)}"></div>`); lapis.appendChild(el); return el; });
    // kartu kredit
    kreditEl = KREDIT.map((k, i) => { const el = h(`<div class="pk-kredit k${i}" style="clip-path:${kasar(50 + i * 3, 12)}"><span>${k}</span></div>`); L[2].appendChild(el); return el; });
    // kartu modul
    modulEl = MODUL.map((m, i) => { const el = h(`<div class="pk-modul m${i}" style="clip-path:${kasar(80 + i * 5, 12)}"><span>${esc(m)}</span></div>`); L[2].appendChild(el); return el; });
    perisai = h(`<div class="pk-perisai"><svg viewBox="0 0 200 240"><path class="p0" d="M100 8 L188 40 V120 C188 178 148 214 100 232 C52 214 12 178 12 120 V40 Z"/><path class="p1" d="M100 30 L170 56 V120 C170 168 138 196 100 210 C62 196 30 168 30 120 V56 Z"/><path class="p2" d="M100 54 L152 72 V120 C152 156 128 176 100 188 C72 176 48 156 48 120 V72 Z"/></svg></div>`);
    lapis.appendChild(perisai);
    logo = h(`<div class="pk-logo"><img src="${PD.LOGO}" alt=""><em>NEXUS</em></div>`); lapis.appendChild(logo);
    sub = h('<div class="pk-sub">7 modul saling terhubung · SaaS maupun on-premise</div>'); lapis.appendChild(sub);
  }
  function gambar(t) {
    // paralaks kamera: lapisan belakang pelan, depan cepat (gerak kaku: dibulatkan ke langkah 12 fps)
    const q = Math.floor(t * 12) / 12;
    const kx = Math.sin(q * 0.35) * 40, ky = Math.cos(q * 0.27) * 24;
    L.forEach((el, i) => { const f = [0.3, 0.6, 1][i]; el.style.transform = `translate(${(kx * f).toFixed(1)}px, ${(ky * f).toFixed(1)}px)`; });
    // tirai terbuka
    const kb = E.io3(P(t, C.buka, C.buka + 0.9));
    tirai[0].style.transform = `translateX(${(-kb * SW * 0.62).toFixed(1)}px) rotate(${(-kb * 4).toFixed(2)}deg)`;
    tirai[1].style.transform = `translateX(${(kb * SW * 0.62).toFixed(1)}px) rotate(${(kb * 4).toFixed(2)}deg)`;
    // kredit: terbuka dari sudut (clip inset) + rotasi kaku; menghilang saat kredit berikutnya / modul mulai
    kreditEl.forEach((el, i) => {
      const t0 = C.kredit[i], t1 = i === 2 ? C.modul[0] + 0.8 : (i === 0 ? C.kredit[1] : C.kredit[2]);
      const kin = E.out3(P(t, t0, t0 + 0.45)), kout = P(t, t1 - 0.3, t1);
      el.style.opacity = t >= t0 && kout < 1 ? 1 : 0;
      el.style.setProperty('--buka', `${((1 - kin) * 100).toFixed(1)}%`);
      el.style.transform = `translate(-50%, -50%) rotate(${lerp(i === 1 ? -7 : 2, i === 1 ? -3 : -1, kin).toFixed(2)}deg) scale(${lerp(1.15, 1, kin).toFixed(3)}) translateY(${(kout * -40).toFixed(1)}px)`;
    });
    // modul: terbuka di posisinya; pada "satu" meluncur ke pusat & menumpuk (rotasi kipas kecil)
    const ks = E.io3(P(t, C.satu, C.satu + 0.9));
    const cx = SW / 2, cy = pick(560, 900);
    modulEl.forEach((el, i) => {
      const t0 = C.modul[i], kin = E.out3(P(t, t0, t0 + 0.4));
      const [x, y, r] = POS[i];
      const tx = lerp(x, cx, ks), ty = lerp(y, cy - 40 + i * 6, ks), rr = lerp(r, (i - 3) * 4, ks), sc = lerp(1, 0.86, ks);
      el.style.opacity = t >= t0 ? 1 : 0;
      el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) translate(-50%, -50%) rotate(${rr.toFixed(2)}deg) scale(${(lerp(1.25, 1, kin) * sc).toFixed(3)})`;
      el.style.zIndex = 10 + i;
    });
    // perisai muncul dari tumpukan; kartu modul memudar ke dalamnya
    const kp = ks >= 1 ? E.outBack(Math.max(0.001, P(t, C.satu + 0.9, C.satu + 1.4))) : 0;
    perisai.style.opacity = kp > 0 ? 1 : 0;
    perisai.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${kp.toFixed(3)})`;
    modulEl.forEach((el) => { el.style.opacity = t >= C.satu + 0.9 ? (1 - P(t, C.satu + 0.9, C.satu + 1.3)).toFixed(3) : el.style.opacity; });
    const kl = P(t, C.logo, C.logo + 0.4);
    logo.style.opacity = kl > 0 ? 1 : 0; logo.style.transform = `translate(${cx}px, ${cy - 10}px) translate(-50%, -50%) scale(${lerp(0.7, 1, E.out3(kl)).toFixed(3)})`;
    const ksub = P(t, C.sub, C.sub + 0.35);
    sub.style.opacity = ksub.toFixed(3); sub.style.transform = `translate(-50%, ${((1 - ksub) * 20).toFixed(1)}px)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Fraunces', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F1E4C8'; cx.fillRect(0, 0, W, H);
      // serat kertas halus
      cx.fillStyle = 'rgba(90,60,20,.05)';
      for (let i = 0; i < 500; i++) cx.fillRect(hash(i * 1.3) * W, hash(i * 2.9) * H, 2 + hash(i) * 3, 1);
    },
  });

  KIT.registerType('pk', (root, v, sc, tm, T) => {
    ensure();
    if (v.buka != null) C.buka = sc.start + T(v.buka, 0);
    (v.kredit || []).forEach(([i, c]) => { C.kredit[i] = sc.start + T(c, 0.6 + i); });
    if (v.modul) v.modul.forEach((c, i) => { C.modul[i] = sc.start + T(c, 1 + i * 0.7); });
    if (v.satu != null) C.satu = sc.start + T(v.satu, 0.8);
    if (v.logo != null) C.logo = sc.start + T(v.logo, 2.6);
    if (v.sub != null) C.sub = sc.start + T(v.sub, 3.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
