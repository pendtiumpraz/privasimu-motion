// Gaya GB23 · LINIMASA/GANTT: sumbu 16 Jul 2026 → 16 Jan 2027 di lapisan lintas scene. Penanda HARI INI = tanggal saat
// build (dijepit ke sumbu) yang merayap ke kanan; pada "lari" ia melesat linear ke tenggat sehingga waktu lintas tiap
// batang bisa dihitung (centang). Batang: kosong → SESAK (antre berurutan dari DES, melewati tenggat) → RAPI (bertangga
// dari hari ini, diskalakan ke sisa waktu) lewat interpolasi geometri; isi batang scaleX per cue. Semua = fungsi waktu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const MULAI = Date.UTC(2026, 6, 16), AKHIR = Date.UTC(2027, 0, 16);
  const F = (y, m, d) => (Date.UTC(y, m, d) - MULAI) / (AKHIR - MULAI);
  const HARI = cl((Date.now() - MULAI) / (AKHIR - MULAI), 0.05, 0.6);
  const DES = F(2026, 11, 1);
  const BULAN = [['JUL', 0], ['AGU', F(2026, 7, 1)], ['SEP', F(2026, 8, 1)], ['OKT', F(2026, 9, 1)], ['NOV', F(2026, 10, 1)], ['DES', DES], ['JAN', F(2027, 0, 1)]];
  const X0 = pick(400, 250), X1 = pick(1800, 1000), Y0 = pick(300, 560), RH = pick(88, 100), TEPI = X1 + pick(100, 70);
  const X = (f) => X0 + (X1 - X0) * f;
  const YR = (i) => Y0 + 96 + i * RH;
  const TAHAP = [
    ['GAP Assessment', 'skor & rencana remediasi', '#2F6FD1', 'rgba(47,111,209,.18)'],
    ['RoPA', 'catatan pemrosesan', '#1FA971', 'rgba(31,169,113,.18)'],
    ['DPIA', 'risiko tinggi', '#7C5CE6', 'rgba(124,92,230,.18)'],
    ['Kebijakan & consent', 'dokumen & persetujuan', '#F2892A', 'rgba(242,137,42,.2)'],
    ['Latihan tim', 'simulasi insiden', '#D7263D', 'rgba(215,38,61,.16)'],
  ];
  const SISA = 0.93 - HARI - 0.02;
  const RAPI = [[0, 0.22], [0.14, 0.34], [0.3, 0.3], [0.48, 0.32], [0.7, 0.3]].map(([a, b]) => [HARI + 0.02 + a * SISA, HARI + 0.02 + (a + b) * SISA]);
  const SESAK = []; { let s = DES; RAPI.forEach(([a, b]) => { SESAK.push([s, s + (b - a)]); s += b - a; }); }
  const JUDUL = [['mulai', 'Hitung mundur sudah jalan.'], ['tanya', 'Rencanamu?'], ['sesak', 'Semua di Desember.'], ['rapi', 'Tahap demi tahap.'], ['lari', 'Tinggal centang.']];
  const C = { mulai: 9e9, garis: 9e9, tanya: 9e9, sesak: 9e9, lewat: 9e9, rapi: 9e9, isi: [9e9, 9e9, 9e9, 9e9, 9e9], lari: 9e9, tutup: 9e9 };
  const LARI = 1.7; // durasi penanda melesat ke tenggat
  const TEKS_TENGGAT = '16 JAN 2027 · PP 33 BERLAKU', TEKS_SIAP = 'SIAP ✓';
  let lapis = null, el = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('gt-lapis');
    el = {};
    el.kop = h('<div class="gt-kop"><small>PP 33/2026 · BERLAKU 16 JANUARI 2027</small><div class="gt-judul"></div></div>'); lapis.appendChild(el.kop);
    el.judul = el.kop.querySelector('.gt-judul');
    el.label = TAHAP.map(([n, s], i) => { const d = h(`<div class="gt-label" style="top:${YR(i) - 24}px"><b>${esc(n)}</b><span>${esc(s)}</span></div>`); lapis.appendChild(d); return d; });
    el.klip = h(`<div class="gt-klip" style="width:${TEPI}px"></div>`); lapis.appendChild(el.klip);
    el.sumbu = h(`<div class="gt-sumbu" style="left:${X0}px;top:${Y0}px;width:${X1 - X0}px"></div>`); el.klip.appendChild(el.sumbu);
    el.bulan = BULAN.map(([n, f]) => { const d = h(`<div class="gt-bulan" style="left:${X(f).toFixed(1)}px;top:${Y0 + 10}px"><i></i>${n}</div>`); el.klip.appendChild(d); return d; });
    el.zona = h(`<div class="gt-zona" data-bebas="1" style="left:${X1}px;width:${TEPI - X1}px;top:${Y0 + 50}px;height:${YR(4) + 40 - Y0 - 50}px"></div>`); el.klip.appendChild(el.zona);
    el.jalur = TAHAP.map((_, i) => { const d = h(`<div class="gt-jalur" style="left:${X0}px;top:${YR(i) - 23}px;width:${X1 - X0}px"></div>`); el.klip.appendChild(d); return d; });
    el.bar = TAHAP.map(([, , w, tr], i) => { const d = h(`<div class="gt-bar" data-bebas="1" style="top:${YR(i) - 23}px;background:${tr}"><i class="isi" style="background:${w}"></i><em class="cek">✓</em></div>`); el.klip.appendChild(d); return d; });
    el.tanya = TAHAP.map((_, i) => { const d = h(`<div class="gt-tanya" style="left:${X(HARI) + 30}px;top:${YR(i) - 21}px">?</div>`); el.klip.appendChild(d); return d; });
    el.lewat = h(`<div class="gt-lewat" style="left:${X1 - pick(560, 330)}px;top:${YR(2) - 46}px">LEWAT TENGGAT</div>`); el.klip.appendChild(el.lewat);
    el.kini = h(`<div class="gt-kini" style="top:${Y0 - 44}px;height:${YR(4) + 44 - (Y0 - 44)}px"><b>HARI INI</b></div>`); el.klip.appendChild(el.kini);
    el.ledak = h(`<div class="gt-ledak" style="left:${X1}px;top:${Y0}px"></div>`); el.klip.appendChild(el.ledak);
    el.tenggat = h(`<div class="gt-tenggat" style="left:${X1}px;top:${Y0}px"><b>${TEKS_TENGGAT}</b><i></i></div>`); el.klip.appendChild(el.tenggat);
    el.tenggatB = el.tenggat.querySelector('b');
    el.catatan = h('<div class="gt-catatan">*jadwal ilustrasi · posisi hari ini mengikuti tanggal render</div>'); lapis.appendChild(el.catatan);
  }
  function fm(t) { // posisi penanda (fraksi sumbu)
    const dasar = HARI + Math.max(0, t - C.mulai) * 0.0022;
    if (t < C.lari) return dasar;
    return lerp(HARI + Math.max(0, C.lari - C.mulai) * 0.0022, 1, P(t, C.lari, C.lari + LARI));
  }
  function gambar(t) {
    // kop & judul (teks = cue terakhir yang sudah lewat)
    let jud = null, tj = 0; JUDUL.forEach(([k, s]) => { if (t >= C[k] && C[k] >= tj) { jud = s; tj = C[k]; } });
    if (jud != null && el.judul.textContent !== jud) el.judul.textContent = jud;
    const kj = E.out3(P(t, tj, tj + 0.3)); el.judul.style.opacity = jud ? kj : 0; el.judul.style.transform = `translateY(${((1 - kj) * 14).toFixed(1)}px)`;
    el.kop.style.opacity = P(t, C.mulai, C.mulai + 0.4);
    // sumbu, bulan, tenggat
    el.sumbu.style.transform = `scaleX(${E.out3(P(t, C.garis, C.garis + 0.8)).toFixed(3)})`;
    el.bulan.forEach((b, i) => { const t0 = C.garis + 0.2 + i * 0.07, k = P(t, t0, t0 + 0.35); b.style.opacity = k > 0 ? 1 : 0; b.style.transform = `translate(-50%, ${((1 - E.out3(k)) * 12).toFixed(1)}px)`; });
    const tiba = C.lari + LARI, siap = t >= tiba - 0.02, kt = P(t, C.garis + 0.7, C.garis + 1.1);
    const goyang = t >= C.lewat && t < C.lewat + 0.7 ? (hash(Math.floor(t * 40)) - 0.5) * 10 : 0;
    const kp = siap ? E.outBack(Math.max(0.001, P(t, tiba, tiba + 0.5))) : 1;
    el.tenggat.style.opacity = kt > 0 ? 1 : 0;
    el.tenggat.style.transform = `translate(${goyang.toFixed(1)}px, ${((1 - E.out3(kt)) * -20).toFixed(1)}px) scale(${lerp(1, siap ? 1.12 : 1, kp).toFixed(3)})`;
    el.tenggat.classList.toggle('siap', siap);
    const teks = siap ? TEKS_SIAP : TEKS_TENGGAT; if (el.tenggatB.textContent !== teks) el.tenggatB.textContent = teks;
    const kl = P(t, tiba, tiba + 0.7); el.ledak.style.opacity = kl > 0 && kl < 1 ? (1 - kl) : 0; el.ledak.style.transform = `translate(-50%, -50%) scale(${(0.2 + E.out3(kl) * 3.2).toFixed(3)})`;
    // penanda hari ini
    const f = fm(t), kk = E.out3(P(t, C.garis + 0.5, C.garis + 1.2));
    el.kini.style.opacity = kk * (f > 0.985 ? 0 : 1);
    el.kini.style.transform = `translate(${(X(f) - 2).toFixed(1)}px, ${((1 - kk) * -24).toFixed(1)}px)`;
    el.kini.classList.toggle('lari', t >= C.lari && t < tiba);
    // baris: label, jalur, tanya, batang
    const kr = E.io3(P(t, C.rapi, C.rapi + 1.0)), dasarLari = HARI + Math.max(0, C.lari - C.mulai) * 0.0022;
    TAHAP.forEach((th, i) => {
      const t0 = C.tanya + i * 0.08, ka = P(t, t0, t0 + 0.4);
      el.label[i].style.opacity = ka; el.label[i].style.transform = `translateX(${((1 - E.out3(ka)) * -20).toFixed(1)}px)`;
      el.jalur[i].style.opacity = ka * lerp(1, 0.55, kr);
      const kq = t >= C.sesak ? 1 - P(t, C.sesak, C.sesak + 0.25) : (ka > 0 ? E.outBack(Math.max(0.001, P(t, t0 + 0.1, t0 + 0.5))) : 0);
      el.tanya[i].style.opacity = kq > 0.001 ? 1 : 0; el.tanya[i].style.transform = `scale(${kq.toFixed(3)}) rotate(${((1 - kq) * 40).toFixed(1)}deg)`;
      const tb = C.sesak + 0.05 + i * 0.18, kg = E.out3(P(t, tb, tb + 0.55)), b = el.bar[i];
      if (kg <= 0) { b.style.opacity = 0; return; }
      const [a0, b0] = SESAK[i], [a1, b1] = RAPI[i];
      const a = lerp(a0, a1, kr), z = lerp(a0 + (b0 - a0) * kg, b1, kr);
      b.style.opacity = (1 - 0.45 * Math.sin(Math.PI * kr)).toFixed(3);
      b.style.left = X(a).toFixed(1) + 'px'; b.style.width = Math.max(6, X(z) - X(a)).toFixed(1) + 'px';
      const merah = t >= C.lewat, isi = b.firstElementChild;
      isi.style.background = kr > 0.5 ? th[2] : (merah ? '#E63946' : '#8E9BB0');
      b.style.background = kr > 0.5 ? th[3] : 'rgba(142,155,176,.2)';
      isi.style.transform = `scaleX(${lerp(1, E.out3(P(t, C.isi[i], C.isi[i] + 0.6)), kr).toFixed(3)})`;
      const tc = C.lari + LARI * cl((b1 - dasarLari) / (1 - dasarLari), 0, 1), kc = P(t, tc, tc + 0.35);
      b.lastElementChild.style.transform = `scale(${(kc > 0 ? E.outBack(kc) : 0).toFixed(3)})`;
    });
    // zona lewat tenggat & stempel
    el.zona.style.opacity = (P(t, C.lewat, C.lewat + 0.4) * (1 - P(t, C.rapi, C.rapi + 0.5))).toFixed(3);
    const ks = P(t, C.lewat, C.lewat + 0.22);
    el.lewat.style.opacity = (ks > 0 ? 1 : 0) * (1 - P(t, C.rapi, C.rapi + 0.3));
    el.lewat.style.transform = `rotate(-9deg) scale(${lerp(2.3, 1, E.out3(ks)).toFixed(3)})`;
    el.catatan.style.opacity = t >= C.sesak + 0.5 ? 0.8 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '700 30px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F5F7FB'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(11,27,77,.06)'; for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y += 40) cx.fillRect(x, y, 2, 2);
    },
  });

  KIT.registerType('gt', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0.1);
    if (v.garis != null) C.garis = sc.start + T(v.garis, 0.15);
    if (v.tanya != null) C.tanya = sc.start + T(v.tanya, 2.5);
    if (v.sesak != null) C.sesak = sc.start + T(v.sesak, 0.8);
    if (v.lewat != null) C.lewat = sc.start + T(v.lewat, 3);
    if (v.rapi != null) C.rapi = sc.start + T(v.rapi, 0.6);
    (v.isi || []).forEach((c, i) => { C.isi[i] = sc.start + T(c, 1.5 + i * 0.8); });
    if (v.lari != null) C.lari = sc.start + T(v.lari, 0.4);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, at = T(L.at, 1.5);
      const k = PD.layar(root, L.nama, { w: pick(340, 620), potong: L.potong, judul: L.judul });
      k.style.left = pick(1440, 230) + 'px'; k.style.top = pick(800, 1130) + 'px';
      parts.push((lt) => { const p = P(lt, at, at + 0.6); k.style.opacity = p > 0 ? 1 : 0; k.style.transform = `translateY(${((1 - E.out3(p)) * 40).toFixed(1)}px) scale(${(p > 0 ? lerp(0.9, 1, E.outBack(p)) : 0.9).toFixed(3)})`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
