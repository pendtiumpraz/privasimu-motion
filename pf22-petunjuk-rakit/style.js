// Gaya PF22 · PETUNJUK PERAKITAN: satu lembar SVG (viewBox 1000×620) berisi beberapa "langkah" (grup) yang bergantian;
// garis tiap langkah tergambar sendiri (stroke-dasharray) sejak waktunya. Langkah terakhir = versi rapi (wizard 7 langkah).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const C = { langkah: [9e9, 9e9, 9e9, 9e9], rapi: 9e9, centang: [9e9, 9e9, 9e9, 9e9, 9e9, 9e9, 9e9], nol: 9e9, tutup: 9e9 };
  let lapis = null, lembar = null, grup = [], garis = [], centangEl = [], nolEl = null, nomor = null, judul = null;

  // --- kosakata gambar garis ---
  const orang = (x, y, tanya) => `<circle cx="${x}" cy="${y}" r="18"/><path d="M${x} ${y + 18} v70 M${x} ${y + 40} l-32 26 M${x} ${y + 40} l32 -22 M${x} ${y + 88} l-24 50 M${x} ${y + 88} l24 50"/>${tanya ? `<path d="M${x + 30} ${y - 40} q0 -22 20 -22 q20 0 20 18 q0 14 -18 20 v10 M${x + 52} ${y - 2} v3" stroke-width="4"/>` : ''}`;
  const keping = (x, y, w, hh, t, rot = 0) => `<g transform="rotate(${rot} ${x + w / 2} ${y + hh / 2})"><rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6"/><text x="${x + w / 2}" y="${y + hh / 2 + 7}" class="lbl">${t}</text></g>`;
  const baut = (x, y) => `<path d="M${x - 12} ${y - 7} l12 -7 l12 7 v14 l-12 7 l-12 -7 z M${x} ${y + 14} v40 M${x - 6} ${y + 26} h12 M${x - 6} ${y + 38} h12"/>`;
  const panah = (x1, y1, x2, y2, cx, cy) => { const a = Math.atan2(y2 - cy, x2 - cx); const p = (d) => `${(x2 - 16 * Math.cos(a - d)).toFixed(1)} ${(y2 - 16 * Math.sin(a - d)).toFixed(1)}`; return `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}"/><path d="M${p(0.45)} L${x2} ${y2} L${p(-0.45)}"/>`; };
  const silang = (x, y) => `<path class="merah" d="M${x - 16} ${y - 16} l32 32 M${x + 16} ${y - 16} l-32 32" stroke-width="6"/>`;
  const bautSisa = (x, y, n) => `<text x="${x}" y="${y}" class="lbl kiri">SISA BAUT: ${n}</text>${Array.from({ length: n }, (_, i) => baut(x + 12 + i * 34, y + 26)).join('')}`;

  const LANGKAH = [
    { no: '1/48', isi: `${orang(120, 200, true)}${keping(300, 300, 120, 56, 'RoPA', -8)}${keping(420, 250, 120, 56, 'DPIA', 12)}${keping(470, 340, 110, 56, 'DSR', -4)}${keping(340, 400, 140, 56, 'CONSENT', 6)}${keping(560, 410, 130, 56, 'INSIDEN', -10)}${panah(175, 250, 290, 300, 240, 240)}${bautSisa(760, 260, 3)}` },
    { no: '2/48', isi: `${keping(120, 260, 200, 80, 'PANEL A', 0)}${panah(330, 300, 560, 300, 445, 250)}<rect x="580" y="200" width="300" height="220" rx="8"/><circle cx="730" cy="310" r="14"/><text x="730" y="360" class="lbl">LUBANG B</text><text x="730" y="470" class="lbl kecil">(lihat hlm. 31)</text>${bautSisa(120, 440, 3)}` },
    { no: '17/48', isi: `${keping(380, 240, 240, 90, 'RoPA', 180)}${panah(660, 250, 700, 330, 740, 260)}${silang(520, 200)}<text x="500" y="420" class="lbl">TERBALIK</text>${orang(150, 220, true)}${bautSisa(720, 440, 4)}` },
    { no: '31/48', isi: `<text x="500" y="250" class="lbl besar">ULANGI DARI LANGKAH 2</text>${panah(700, 300, 300, 300, 500, 480)}${keping(240, 380, 120, 56, 'DSR', 30)}${keping(620, 380, 120, 56, 'DPIA', -25)}${orang(500, 380, true)}${bautSisa(720, 500, 5)}` },
  ];
  const WIZ = ['Tujuan', 'Dasar', 'Kategori', 'Subjek', 'Penerima', 'Retensi', 'Pengamanan'];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('pr-lapis');
    const rapi = WIZ.map((w, i) => { const x = 95 + i * 135; return `<g class="wz"><circle cx="${x}" cy="300" r="34"/><text x="${x}" y="311" class="lbl">${i + 1}</text><path class="cek" d="M${x - 14} ${y0(300)} l10 10 l20 -22"/><text x="${x}" y="380" class="lbl kecil">${w}</text>${i < 6 ? `<path d="M${x + 42} 300 h50 l-10 -8 m10 8 l-10 8"/>` : ''}</g>`; }).join('');
    function y0(y) { return y + 2; }
    lembar = h(`<div class="pr-lembar"><svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet">
      <text x="40" y="52" class="lbl kiri kop">PETUNJUK PERAKITAN · KEPATUHAN PDP</text>
      <g class="pr-no"><rect x="820" y="22" width="140" height="48" rx="8"/><text x="890" y="55" class="lbl">1/48</text></g>
      ${LANGKAH.map((L, i) => `<g class="pr-langkah" data-i="${i}">${L.isi}</g>`).join('')}
      <g class="pr-langkah rapi"><text x="500" y="150" class="lbl besar">WIZARD RoPA · 7 LANGKAH</text>${rapi}<text x="500" y="500" class="lbl nol">SISA BAUT: 0 ✓</text></g>
    </svg></div>`);
    lapis.appendChild(lembar);
    grup = [...lembar.querySelectorAll('.pr-langkah')];
    nomor = lembar.querySelector('.pr-no text'); judul = lembar.querySelector('.kop');
    // panjang goresan tiap elemen (untuk animasi menggambar)
    garis = grup.map((g) => [...g.querySelectorAll('path, circle, rect')].map((el, j) => { let L = 300; try { L = el.getTotalLength ? el.getTotalLength() : 300; } catch (e) { /* rect/circle tanpa getTotalLength */ } if (el.tagName === 'circle') L = 2 * Math.PI * (+el.getAttribute('r')); if (el.tagName === 'rect') L = 2 * ((+el.getAttribute('width')) + (+el.getAttribute('height'))); el.style.strokeDasharray = `${L}`; return { el, L, j }; }));
    centangEl = [...lembar.querySelectorAll('.wz .cek')];
    nolEl = lembar.querySelector('.nol');
  }
  function gambar(t) {
    const waktu = [...C.langkah, C.rapi];
    let aktif = -1; waktu.forEach((w, i) => { if (t >= w) aktif = i; });
    grup.forEach((g, i) => {
      const on = i === aktif;
      g.style.opacity = on ? 1 : 0;
      if (!on) return;
      const t0 = waktu[i];
      garis[i].forEach(({ el, L, j }) => { const k = E.out3(P(t, t0 + j * 0.05, t0 + j * 0.05 + 0.45)); el.style.strokeDashoffset = `${L * (1 - k)}`; });
    });
    const no = ['1/48', '2/48', '17/48', '31/48', '7/7'];
    nomor.textContent = aktif >= 0 ? no[aktif] : '1/48';
    judul.textContent = aktif === 4 ? 'PETUNJUK PERAKITAN · PRIVASIMU NEXUS' : 'PETUNJUK PERAKITAN · KEPATUHAN PDP';
    lembar.classList.toggle('rapi', aktif === 4);
    centangEl.forEach((c, i) => { const k = P(t, C.centang[i], C.centang[i] + 0.25); c.style.strokeDashoffset = `${44 * (1 - E.out3(k))}`; c.style.opacity = k > 0 ? 1 : 0; });
    nolEl.style.opacity = t >= C.nol ? 1 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Inter', '900 60px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#E8E4DC'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.04)';
      for (let i = 0; i < 30; i++) cx.fillRect((i / 30) * W, 0, 1, H);
    },
  });

  KIT.registerType('pr', (root, v, sc, tm, T) => {
    ensure();
    (v.langkah || []).forEach(([i, at], n) => { C.langkah[i] = sc.start + T(at, 0.5 + n * 1.5); });
    if (v.rapi != null) C.rapi = sc.start + T(v.rapi, 0.3);
    if (v.centang) { // dua cue = awal & akhir, sisanya disebar rata
      if (v.centang.length === 2) { const a = sc.start + T(v.centang[0], 1.5), b = sc.start + T(v.centang[1], 4); for (let i = 0; i < 7; i++) C.centang[i] = lerp(a, b, i / 6); }
      else v.centang.forEach((c, i) => { C.centang[i] = sc.start + T(c, 1.5 + i * 0.5); });
    }
    if (v.nol != null) C.nol = sc.start + T(v.nol, 6);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="pr-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(760, 900), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(760, 880)}px`;
      const t0 = T(L.at, 1);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
