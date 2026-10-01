// Gaya GB40 · SPEEDOMETER: meter setengah lingkaran (cincin conic-gradient dipotong setengah, tanda skala, jarum
// rotasi -90°+nilai×1,8°, angka dari nilai) di lapisan lintas scene, tertutup dua panel baja (atas/bawah) yang membawa
// teks tantangan; bayangan jarum kabur "menari" di panel (nilai = jumlah sinus). Saat buka: jarum = 56 − 56·e^(−3,2τ)·
// cos(6,5τ) (berayun lewat, lalu berhenti di 56). Match-cut: meter di-translate+scale (titik pusat = poros) ke posisi
// meter pada kartu tangkapan asli, lalu kartu muncul. Semua gerak = fungsi waktu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const CX = SW / 2, CY = pick(600, 960), R = pick(300, 320), NILAI = 56;
  const KW = pick(1100, 1000), KS = KW / 970, KL = pick(410, 40), KT = pick(300, 760); // kartu asli & skala gambar
  const TX = KL + 120 * KS, TY = KT + 46 + 121 * KS, TS = 78 * KS / R;                // pusat & skala meter pada kartu
  const C = { mulai: 9e9, bayang: 9e9, sub: 9e9, masih: 9e9, serius: 9e9, hitung: [9e9, 9e9, 9e9], buka: 9e9, label: 9e9, asli: 9e9, tunjuk: 9e9, tutup: 9e9 };
  let lapis = null, el = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sp-lapis');
    el = {};
    el.meter = h(`<div class="sp-meter" style="left:${CX - R}px;top:${CY - R}px;width:${R * 2}px;height:${R * 2}px;transform-origin:${R}px ${R}px"><div class="busur"></div>${Array.from({ length: 11 }, (_, i) => `<i class="tanda ${i % 5 ? '' : 'besar'}" style="left:${R - 3}px;top:${R - R * 0.98}px;height:${R * 0.98}px;transform:rotate(${-90 + i * 18}deg)"></i>`).join('')}<div class="jarum" style="left:${R - 7}px;top:${R - R * 0.86}px;height:${R * 0.86}px"></div><div class="hub" style="left:${R - 22}px;top:${R - 22}px"></div><div class="angka" style="top:${R + 30}px">0</div><div class="label" style="top:${R + 150}px">CUKUP</div></div>`);
    lapis.appendChild(el.meter);
    el.jarum = el.meter.querySelector('.jarum'); el.angka = el.meter.querySelector('.angka'); el.label = el.meter.querySelector('.label');
    el.kartu = PD.layar(lapis, 'postur-privasi', { w: KW, potong: [20, 125, 970, 225], judul: 'Privacy Posture Score' });
    el.kartu.style.left = KL + 'px'; el.kartu.style.top = KT + 'px'; el.kartu.style.opacity = 0;
    el.tunjuk = h(`<div class="sp-tunjuk" style="left:${KL}px;top:${KT + el.kartu._h + 22}px">Privacy Posture Score · tangkapan asli Privasimu Nexus</div>`); lapis.appendChild(el.tunjuk);
    el.bayang = h(`<div class="sp-bayang" style="left:${CX - 16}px;top:${CY - R * 0.92}px;height:${R * 0.92}px"></div>`);
    el.atas = h(`<div class="sp-tutup atas" style="height:${CY}px"><div class="sp-teks" data-bebas="1" style="top:${CY - R - 130}px"><b></b><span></span></div></div>`); el.bawah = h(`<div class="sp-tutup bawah" style="top:${CY}px;height:${SH - CY}px"></div>`);
    lapis.appendChild(el.bawah); lapis.appendChild(el.atas); el.atas.appendChild(el.bayang);
    el.besar = el.atas.querySelector('b'); el.kecil = el.atas.querySelector('span');
    el.kilat = h('<div class="sp-kilat"></div>'); lapis.appendChild(el.kilat);
  }
  function teksTutup(t) {
    const urut = [[C.mulai, 'JANGAN LIHAT.', '', 0], [C.sub, 'JANGAN LIHAT.', 'kalau belum siap.', 0], [C.masih, 'Masih nonton?', '', 0], [C.serius, 'Oke. Siap?', '', 0], [C.hitung[0], '3', 'masih nonton?', 1], [C.hitung[1], '2', 'masih nonton?', 1], [C.hitung[2], '1', '', 1]];
    let pilih = null; urut.forEach((u) => { if (t >= u[0] && (!pilih || u[0] >= pilih[0])) pilih = u; });
    return pilih;
  }
  function gambar(t) {
    const tau = t - C.buka;
    // teks di penutup
    const u = teksTutup(t);
    if (u) {
      if (el.besar.textContent !== u[1]) el.besar.textContent = u[1]; if (el.kecil.textContent !== u[2]) el.kecil.textContent = u[2];
      el.besar.classList.toggle('digit', !!u[3]);
      const k = E.outBack(Math.max(0.001, P(t, u[0], u[0] + 0.3)));
      el.besar.style.transform = `scale(${k.toFixed(3)})`; el.besar.style.opacity = 1;
      el.kecil.style.opacity = u[2] ? P(t, u[0] + 0.15, u[0] + 0.4) : 0;
    } else el.besar.style.opacity = 0;
    // bayangan jarum di penutup
    const tt = t + Math.max(0, t - C.hitung[0]) * 1.6, vb = cl(50 + 40 * Math.sin(tt * 2.7) + 12 * Math.sin(tt * 9.1 + 1), 2, 98);
    const kb = P(t, C.bayang, C.bayang + 0.5);
    el.bayang.style.opacity = (0.6 * kb).toFixed(3); el.bayang.style.transform = `rotate(${(-90 + vb * 1.8).toFixed(2)}deg)`;
    // penutup terbelah
    const ko = E.io3(P(t, C.buka, C.buka + 0.55));
    el.atas.style.transform = `translateY(${(-ko * (CY + 60)).toFixed(1)}px)`; el.bawah.style.transform = `translateY(${(ko * (SH - CY + 60)).toFixed(1)}px)`;
    el.atas.style.opacity = 1; el.bawah.style.opacity = 1;
    const kk = P(t, C.buka, C.buka + 0.25); el.kilat.style.opacity = kk > 0 && kk < 1 ? (1 - kk) * 0.8 : 0;
    // jarum & angka
    const v = tau < 0 ? 0 : NILAI - NILAI * Math.exp(-3.2 * tau) * Math.cos(6.5 * tau);
    el.jarum.style.transform = `rotate(${(-90 + v * 1.8).toFixed(2)}deg)`;
    const n = String(Math.max(0, Math.round(v))); if (el.angka.textContent !== n) el.angka.textContent = n;
    const kl = t >= C.label ? E.outBack(Math.max(0.001, P(t, C.label, C.label + 0.4))) : 0;
    el.label.style.opacity = kl > 0.001 ? 1 : 0; el.label.style.transform = `translateX(-50%) scale(${kl.toFixed(3)})`;
    // match-cut ke kartu asli
    const km = E.io3(P(t, C.asli, C.asli + 0.8));
    el.meter.style.transform = `translate(${((TX - CX) * km).toFixed(1)}px, ${((TY - CY) * km).toFixed(1)}px) scale(${lerp(1, TS, km).toFixed(4)})`;
    el.meter.style.opacity = ((t >= C.buka - 0.2 ? 1 : 0) * (1 - P(t, C.asli + 0.7, C.asli + 1.0))).toFixed(3);
    el.kartu.style.opacity = P(t, C.asli + 0.5, C.asli + 0.85).toFixed(3);
    el.kartu.style.transform = `scale(${lerp(0.98, 1, E.out3(P(t, C.asli + 0.5, C.asli + 1))).toFixed(3)})`;
    const kt = t >= C.tunjuk ? E.out3(P(t, C.tunjuk, C.tunjuk + 0.4)) : 0;
    el.tunjuk.style.opacity = kt; el.tunjuk.style.transform = `translateY(${((1 - kt) * 10).toFixed(1)}px)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 120px Inter', '900 220px Inter', '700 30px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H * 0.55, W * 0.6); g.addColorStop(0, '#152552'); g.addColorStop(1, '#070D22');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('sp', (root, v, sc, tm, T) => {
    ensure();
    ['mulai', 'bayang', 'sub', 'masih', 'serius', 'buka', 'label', 'asli', 'tunjuk'].forEach((k) => { if (v[k] != null) C[k] = sc.start + T(v[k], 0.5); });
    (v.hitung || []).forEach((c, i) => { C.hitung[i] = sc.start + T(c, 1.5 + i * 0.6); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
