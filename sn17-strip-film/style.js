// Gaya SN17 · STRIP FILM: 3 strip × 12 bingkai di lapisan lintas scene; strip bergeser horizontal (arah selang-seling)
// lalu berhenti (io3) pada "berhenti"; lingkaran spidol = ellipse SVG dengan dasharray yang terisi; bingkai terpilih
// diperbesar ke tengah pada "besar"; "susun" meredupkan lembar & menjajarkan tiga bingkai di atas.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const MOMEN = ['rapat', 'email', 'kopi', 'tab #47', 'form', 'telepon', 'CATAT', 'slide', 'lembur', 'chat', 'print', 'lift', 'notula', 'kalender', 'meeting', 'excel', 'kopi lagi', 'macet', 'TAHAN', 'zoom', 'revisi', 'ttd', 'antre', 'parkir', 'weekend', 'inbox', 'deadline', 'kopi ke-4', 'to-do', 'reply all', 'BERI TAHU', 'lembur lagi', 'senyum', 'pulang', 'tidur', 'ulang'];
  const PILIH = [6, 18, 30];
  const BESAR = [
    ['CATAT', 'BRC-2026-… kode otomatis', 'log linimasa langsung berjalan'],
    ['TAHAN', 'daftar periksa penahanan', 'dibuat otomatis saat dicatat'],
    ['BERI TAHU', 'templat pemberitahuan', 'subjek data & lembaga · 3×24 jam'],
  ];
  const KOL = 12, FW = pick(150, 176), FH = pick(112, 132), GAP = 10, SH_ = pick(190, 214); // lebar/tinggi bingkai, tinggi strip
  const C = { gulir: 9e9, berhenti: 9e9, lingkar: 9e9, besar: [9e9, 9e9, 9e9], susun: 9e9, tutup: 9e9 };
  let lapis = null, strip = [], bingkai = [], svg = null, ling = [], besarEl = [], meja = null;
  const TOP = pick(160, 420);

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('fs-lapis');
    meja = h('<div class="fs-meja"></div>'); lapis.appendChild(meja);
    for (let r = 0; r < 3; r++) {
      const s = h(`<div class="fs-strip" data-bebas="1" style="top:${TOP + r * (SH_ + 26)}px;height:${SH_}px"><div class="fs-lubang atas"></div><div class="fs-lubang bawah"></div><div class="fs-baris">${Array.from({ length: KOL }, (_, c) => { const i = r * KOL + c; return `<div class="fs-bingkai ${PILIH.includes(i) ? 'kunci' : ''}" style="width:${FW}px;height:${FH}px;--h:${Math.floor(hash(i * 1.7) * 40 + 20)}"><span>${MOMEN[i]}</span><i>${i + 1}</i></div>`; }).join('')}</div></div>`);
      lapis.appendChild(s); strip.push(s);
    }
    bingkai = [...lapis.querySelectorAll('.fs-bingkai')];
    svg = h(`<svg class="fs-svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}">${PILIH.map(() => '<ellipse class="fs-ling" rx="0" ry="0"/>').join('')}</svg>`);
    lapis.appendChild(svg); ling = [...svg.querySelectorAll('.fs-ling')];
    besarEl = BESAR.map(([j, a, b]) => { const el = h(`<div class="fs-besar"><div class="fs-lubang atas"></div><div class="fs-lubang bawah"></div><div class="in"><b>${j}</b><span>${a}</span><em>${b}</em></div></div>`); lapis.appendChild(el); return el; });
  }
  function posStrip(r, t) { // offset x strip r
    const arah = r % 2 ? 1 : -1, laju = 260, kb = E.io3(P(t, C.berhenti, C.berhenti + 0.9));
    const u = Math.max(0, t - C.gulir), jalan = arah * laju * u;
    const akhir = arah * laju * Math.max(0, C.berhenti - C.gulir); // posisi saat mulai berhenti
    const x0 = pick(SW / 2 - (KOL * (FW + GAP)) / 2, -60) + (arah > 0 ? -900 : 300);
    return x0 + lerp(jalan, akhir + arah * 70, kb);
  }
  function gambar(t) {
    const ks = E.io3(P(t, C.susun, C.susun + 0.8));
    strip.forEach((s, r) => { const x = posStrip(r, t); s.style.transform = `translateX(${x.toFixed(1)}px)`; s.style.opacity = (t >= C.gulir ? 1 : 0) * (1 - ks * 0.85); s.style.filter = ks > 0 ? `blur(${(ks * 5).toFixed(1)}px)` : ''; });
    // lingkaran spidol mengikuti bingkai
    PILIH.forEach((i, n) => {
      const r = Math.floor(i / KOL), b = bingkai[i], rect = b.getBoundingClientRect(), s = lapis.getBoundingClientRect(), sc = SW / s.width;
      const cx = (rect.left + rect.width / 2 - s.left) * sc, cy = (rect.top + rect.height / 2 - s.top) * sc;
      const k = P(t, C.lingkar + n * 0.25, C.lingkar + n * 0.25 + 0.4), L = 2 * Math.PI * (FW * 0.62);
      const el = ling[n]; el.setAttribute('cx', cx.toFixed(1)); el.setAttribute('cy', cy.toFixed(1)); el.setAttribute('rx', (FW * 0.62).toFixed(1)); el.setAttribute('ry', (FH * 0.66).toFixed(1));
      el.style.strokeDasharray = `${L}`; el.style.strokeDashoffset = `${(L * (1 - E.out3(k))).toFixed(1)}`; el.style.opacity = (k > 0 ? 1 : 0) * (1 - ks);
      b.classList.toggle('sorot', k >= 1);
    });
    // bingkai besar
    besarEl.forEach((el, n) => {
      const t0 = C.besar[n], k = E.outBack(Math.max(0.001, P(t, t0, t0 + 0.5))), aktif = t >= t0 && (n === 2 || t < C.besar[n + 1]);
      if (t < C.susun) { el.style.opacity = aktif ? 1 : 0; el.style.transform = `translate(${(SW / 2).toFixed(0)}px, ${(V ? 1330 : 880).toFixed(0)}px) translate(-50%, -50%) scale(${(k * (V ? 1 : 1)).toFixed(3)})`; }
      else { // tersusun berjajar di atas
        const x = SW / 2 + (n - 1) * (V ? 350 : 520), y = V ? 330 : 170; el.style.opacity = 1; el.style.transform = `translate(${x.toFixed(0)}px, ${y}px) translate(-50%, -50%) scale(${lerp(1, V ? 0.37 : 0.72, ks).toFixed(3)})`;
      }
    });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '400 60px "Permanent Marker"'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.75); g.addColorStop(0, '#FFF9EC'); g.addColorStop(1, '#E6DCC4');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('fs', (root, v, sc, tm, T) => {
    ensure();
    if (v.gulir != null) C.gulir = sc.start + T(v.gulir, 0.1);
    if (v.berhenti != null) C.berhenti = sc.start + T(v.berhenti, 2.5);
    if (v.lingkar != null) C.lingkar = sc.start + T(v.lingkar, 4);
    if (v.besar) v.besar.forEach((c, i) => { C.besar[i] = sc.start + T(c, 0.5 + i * 2); });
    if (v.susun != null) C.susun = sc.start + T(v.susun, 0.3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1000, 940), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(330, 560)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
