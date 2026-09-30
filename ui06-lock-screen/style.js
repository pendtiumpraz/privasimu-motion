// Gaya UI06 · LOCK SCREEN: ponsel (bingkai di 16:9, penuh layar di 9:16). Jam = keadaan terakhir dari cue global.
// Notifikasi: tiap kartu punya waktu tiba; posisi = jumlah kartu yang tiba sesudahnya (yang terbaru di atas), dengan
// animasi geser saat kartu baru tiba. "sapu" menyingkirkan semua; "rapi" memunculkan satu kartu Nexus.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const NOTIF = [
    ['chat', 'Chat tim', 'Pagi, bisa minta RoPA terbaru?', '07.00'],
    ['mail', 'Email', 'Audit internal minggu depan — dokumennya sudah?', '09.30'],
    ['cal', 'Kalender', 'Rapat pihak ketiga · kontrak belum ditelaah', '12.15'],
    ['dsr', 'Portal DSR', 'Permohonan hapus data baru — tenggat 72 jam', '17.40'],
    ['chat', 'Chat tim', 'Consent: 3 penarikan hari ini, sudah diproses?', '23.00'],
    ['sec', 'Keamanan', 'Dugaan insiden: laptop berisi data pelanggan hilang', '03.12'],
  ];
  const IKON = { chat: '💬', mail: '✉️', cal: '📅', dsr: '🗂️', sec: '⚠️' };
  const C = { jam: [], tiba: NOTIF.map(() => 9e9), getar: 9e9, sapu: 9e9, rapi: 9e9, priva: 9e9, tutup: 9e9 };
  let lapis = null, phone = null, jamEl = null, tglEl = null, kartu = [], nexus = null, priva = null;
  const PW = pick(480, SW), PH = pick(1000, SH), PX = pick((SW - 480) / 2, 0), PY = pick(40, 0);
  const SLOT = pick(118, 176), TOP = pick(330, 640);

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('lsc-lapis');
    phone = h(`<div class="lsc-phone" style="left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px"><div class="lsc-wall"></div><div class="lsc-status"><span>●●●</span><span>100%</span></div><div class="lsc-tgl"></div><div class="lsc-jam"></div><div class="lsc-tumpuk"></div><div class="lsc-bawah"><i></i></div></div>`);
    lapis.appendChild(phone);
    jamEl = phone.querySelector('.lsc-jam'); tglEl = phone.querySelector('.lsc-tgl');
    const tumpuk = phone.querySelector('.lsc-tumpuk');
    kartu = NOTIF.map(([ik, app, isi, jam]) => { const el = h(`<div class="lsc-kartu ${ik}"><div class="ik">${IKON[ik]}</div><div class="tx"><div class="ap"><b>${app}</b><span>${jam}</span></div><div class="isi">${esc(isi)}</div></div></div>`); tumpuk.appendChild(el); return el; });
    nexus = h(`<div class="lsc-kartu nexus"><div class="ik"><img src="${PD.LOGO}" alt=""></div><div class="tx"><div class="ap"><b>Privasimu Nexus</b><span>sekarang</span></div><div class="isi"><strong>Antrean kerja PPDP:</strong> 5 tugas menunggu · 1 insiden aktif · tenggat terdekat 71 jam<em>*ilustrasi</em></div></div></div>`);
    tumpuk.appendChild(nexus);
    priva = h(`<div class="lsc-kartu priva"><div class="ik">✦</div><div class="tx"><div class="ap"><b>Asisten AI Priva</b><span>siap</span></div><div class="isi">"Mau saya siapkan ringkasan untuk rapat pagi ini?"</div></div></div>`);
    tumpuk.appendChild(priva);
  }
  function gambar(t) {
    const j = C.jam.filter(([, tt]) => t >= tt).pop();
    jamEl.textContent = j ? j[0] : '07.00';
    tglEl.textContent = j && j[0] === '03.12' ? 'Selasa, 3 pagi' : (t >= C.sapu ? 'Selasa · hari baru' : 'Senin');
    phone.classList.toggle('malam', !!(j && (j[0] === '23.00' || j[0] === '03.12')));
    const sapu = E.io3(P(t, C.sapu, C.sapu + 0.6));
    const tibaUrut = C.tiba.map((tt, i) => [tt, i]).filter(([tt]) => t >= tt).sort((a, b) => a[0] - b[0]);
    const terakhir = tibaUrut.length ? tibaUrut[tibaUrut.length - 1][0] : 9e9;
    kartu.forEach((el, i) => {
      const tt = C.tiba[i];
      if (t < tt) { el.style.opacity = 0; el.style.transform = 'translateY(-160px)'; return; }
      const sesudah = C.tiba.filter((x) => x > tt && x <= t).length;
      let idx;
      if (sesudah === 0) idx = 0; else idx = (sesudah - 1) + E.io3(P(t, terakhir, terakhir + 0.35));
      const masuk = E.outBack(Math.max(0.001, P(t, tt, tt + 0.45)));
      const y = idx * SLOT + (1 - masuk) * -160 - sapu * (PH + 200) * (1 + i * 0.08);
      el.style.opacity = (Math.min(1, masuk * 1.5) * (1 - sapu) * (idx > 4.5 ? 0.35 : 1)).toFixed(3);
      el.style.transform = `translateY(${y.toFixed(1)}px) scale(${lerp(1, 0.94, cl(idx / 6)).toFixed(3)})`;
      el.style.zIndex = 20 - Math.round(idx);
    });
    const kr = E.outBack(Math.max(0.001, P(t, C.rapi, C.rapi + 0.5)));
    nexus.style.opacity = t >= C.rapi ? 1 : 0; nexus.style.transform = `translateY(${((1 - kr) * -160).toFixed(1)}px)`;
    const kp = E.outBack(Math.max(0.001, P(t, C.priva, C.priva + 0.5)));
    priva.style.opacity = t >= C.priva ? 1 : 0; priva.style.transform = `translateY(${(SLOT * 1.45 + (1 - kp) * -60).toFixed(1)}px)`;
    const g = t >= C.getar && t < C.getar + 0.8 ? 7 : 0;
    phone.style.translate = g ? `${((hash(Math.floor(t * 40)) - 0.5) * g * 2).toFixed(1)}px 0` : '';
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px Inter', '500 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#111827'); g.addColorStop(1, '#1F2937');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('lsc', (root, v, sc, tm, T) => {
    ensure();
    (v.jam || []).forEach(([txt, c]) => { C.jam.push([txt, sc.start + T(c, 0)]); });
    (v.notif || []).forEach(([i, c], n) => { C.tiba[i] = sc.start + T(c, 0.6 + n * 1.3); });
    if (v.getar != null) C.getar = sc.start + T(v.getar, 0.6);
    if (v.sapu != null) C.sapu = sc.start + T(v.sapu, 0.3);
    if (v.rapi != null) C.rapi = sc.start + T(v.rapi, 1.2);
    if (v.priva != null) C.priva = sc.start + T(v.priva, 4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
