// Gaya SN19 · SATU WARNA: semua elemen memakai palet abu (tanpa filter global) — hanya elemen ber-kelas .merah yang
// berwarna. Formulir generik + garis pindai; chip data spesifik menyala merah; benang merah = path SVG yang tergambar
// (stroke-dashoffset); stempel & kartu DPIA dari cue; tangkapan layar asli di-grayscale lewat filter pada <img>,
// centang merah = overlay di luar filter. Semua fungsi murni waktu.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const CHIP = ['Nama', 'Email', 'Alamat', 'No. HP', 'Riwayat kesehatan', 'Jabatan', 'Tanggal lahir', 'Foto profil'];
  const MERAH_IDX = 4;
  const C = { pindai: 9e9, merah: 9e9, benang1: 9e9, stempel: 9e9, benang2: 9e9, dpia: 9e9, singkir: 9e9, centang: [9e9, 9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, form = null, chips = [], pindai = null, svg = null, benang = [], stempel = null, dpia = null, diukur = false;
  const FW = pick(900, 940), FX = pick(140, (SW - 940) / 2), FY = pick(90, 250);

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sw-lapis');
    form = h(`<div class="sw-form" data-bebas="1" style="left:${FX}px;top:${FY}px;width:${FW}px"><div class="sw-kop"><span>FORMULIR</span><b>Pencatatan Kegiatan Pemrosesan</b><i>No. ___/RoPA/2026</i></div>
      <div class="sw-baris"><label>Tujuan pemrosesan</label><div class="sw-isi">Layanan pelanggan &amp; penagihan</div></div>
      <div class="sw-baris"><label>Dasar pemrosesan</label><div class="sw-isi">Perjanjian · Persetujuan</div></div>
      <div class="sw-baris"><label>Kategori data pribadi</label><div class="sw-chips">${CHIP.map((c, i) => `<span class="sw-chip c${i}">${c}</span>`).join('')}</div></div>
      <div class="sw-baris"><label>Penerima</label><div class="sw-isi">Internal · pihak ketiga (penagihan)</div></div>
      <div class="sw-baris"><label>Retensi</label><div class="sw-isi">5 tahun setelah kontrak berakhir</div></div>
      <div class="sw-pindai"></div></div>`);
    lapis.appendChild(form);
    chips = [...form.querySelectorAll('.sw-chip')]; pindai = form.querySelector('.sw-pindai');
    svg = h(`<svg class="sw-svg" viewBox="0 0 ${SW} ${SH}" width="${SW}" height="${SH}"><path class="merah b1" d=""/><path class="merah b2" d=""/></svg>`);
    lapis.appendChild(svg); benang = [svg.querySelector('.b1'), svg.querySelector('.b2')];
    stempel = h('<div class="sw-stempel merah">RISIKO<br>TINGGI</div>'); lapis.appendChild(stempel);
    dpia = h('<div class="sw-dpia"><div class="tag merah">DRAF OTOMATIS</div><b>DPIA</b><span>Penilaian Dampak Pelindungan Data</span><i>DPIA-2026-0__ · dibuat dari RoPA</i></div>'); lapis.appendChild(dpia);
  }
  let posChip = null, posStempel = null, posDpia = null;
  function ukur() {
    if (diukur) return; diukur = true;
    const r0 = lapis.getBoundingClientRect(), sc = SW / r0.width, r = chips[MERAH_IDX].getBoundingClientRect();
    posChip = [(r.right - r0.left) * sc, (r.top + r.height / 2 - r0.top) * sc];
    posStempel = V ? [SW / 2 + 250, FY + 810] : [FX + FW + 330, FY + 200];
    posDpia = V ? [SW / 2 - 240, FY + 850] : [FX + FW + 330, FY + 560];
    const [cx, cy] = posChip;
    benang[0].setAttribute('d', V ? `M${cx} ${cy} C${cx + 120} ${cy}, ${posStempel[0]} ${posStempel[1] - 260}, ${posStempel[0]} ${posStempel[1] - 120}` : `M${cx} ${cy} C${cx + 160} ${cy}, ${posStempel[0] - 260} ${posStempel[1]}, ${posStempel[0] - 150} ${posStempel[1]}`);
    benang[1].setAttribute('d', V ? `M${posStempel[0]} ${posStempel[1] + 110} C${posStempel[0]} ${posStempel[1] + 220}, ${posDpia[0] + 60} ${posDpia[1] - 220}, ${posDpia[0] + 40} ${posDpia[1] - 130}` : `M${posStempel[0]} ${posStempel[1] + 110} C${posStempel[0]} ${posStempel[1] + 250}, ${posDpia[0]} ${posDpia[1] - 260}, ${posDpia[0]} ${posDpia[1] - 120}`);
    benang.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; p.dataset.l = L; });
    stempel.style.left = `${posStempel[0]}px`; stempel.style.top = `${posStempel[1]}px`;
    dpia.style.left = `${posDpia[0]}px`; dpia.style.top = `${posDpia[1]}px`;
  }
  function gambar(t) {
    ukur();
    const ks = E.io3(P(t, C.singkir, C.singkir + 0.7));
    form.style.transform = `translateX(${(-ks * (FX + FW + 200)).toFixed(1)}px)`;
    // garis pindai
    const kp = P(t, C.pindai, C.pindai + 1.6);
    pindai.style.opacity = kp > 0 && kp < 1 ? 1 : 0; pindai.style.top = `${(kp * 100).toFixed(1)}%`;
    // chip merah
    const km = P(t, C.merah, C.merah + 0.35), denyut = 1 + 0.06 * Math.sin((t - C.merah) * 7) * (t >= C.merah ? 1 : 0);
    chips.forEach((c, i) => { if (i !== MERAH_IDX) return; c.classList.toggle('merah', km > 0); c.style.transform = `scale(${(lerp(1, 1.12, E.outBack(Math.max(0.001, km))) * denyut).toFixed(3)})`; });
    // benang & stempel & dpia
    const kb1 = E.io3(P(t, C.benang1, C.benang1 + 0.8)), kb2 = E.io3(P(t, C.benang2, C.benang2 + 0.8));
    benang[0].style.strokeDashoffset = `${(+benang[0].dataset.l || 0) * (1 - kb1)}`; benang[0].style.opacity = (kb1 > 0 ? 1 : 0) * (1 - ks);
    benang[1].style.strokeDashoffset = `${(+benang[1].dataset.l || 0) * (1 - kb2)}`; benang[1].style.opacity = (kb2 > 0 ? 1 : 0) * (1 - ks);
    const kst = P(t, C.stempel, C.stempel + 0.28);
    stempel.style.opacity = (kst > 0 ? 1 : 0) * (1 - ks); stempel.style.transform = `translate(-50%, -50%) rotate(-10deg) scale(${lerp(2.2, 1, E.outExpo(kst)).toFixed(3)})`;
    const kd = P(t, C.dpia, C.dpia + 0.5);
    dpia.style.opacity = (kd > 0 ? 1 : 0) * (1 - ks); dpia.style.transform = `translate(-50%, -50%) translateY(${((1 - E.outBack(Math.max(0.001, kd))) * 60).toFixed(1)}px)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 60px "Playfair Display"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#D9D9D9'); g.addColorStop(1, '#A9A9A9');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 900; i++) cx.fillRect(hash(i * 1.7) * W, hash(i * 2.9) * H, 2, 2);
    },
  });

  KIT.registerType('sw', (root, v, sc, tm, T) => {
    ensure();
    if (v.pindai != null) C.pindai = sc.start + T(v.pindai, 0.3);
    if (v.merah != null) C.merah = sc.start + T(v.merah, 3);
    if (v.benang1 != null) C.benang1 = sc.start + T(v.benang1, 0.8);
    if (v.stempel != null) C.stempel = sc.start + T(v.stempel, 1.8);
    if (v.benang2 != null) C.benang2 = sc.start + T(v.benang2, 2.6);
    if (v.dpia != null) C.dpia = sc.start + T(v.dpia, 3.6);
    if (v.singkir != null) C.singkir = sc.start + T(v.singkir, 0.3);
    if (v.centang) v.centang.forEach((c, i) => { C.centang[i] = sc.start + T(c, 1.5 + i * 0.6); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="sw-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1000, 940), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(260, 640)}px`;
      const img = el.querySelector('img'); if (img) img.style.filter = 'grayscale(1) contrast(1.05)';
      const sk = el._w / L.potong[2];
      // centang merah di atas kotak: kesehatan (30,52) biometrik (333,52) anak (30,146) keuangan (333,146) — koordinat relatif crop
      const kotak = [[42, 44], [345, 44], [42, 138], [345, 138]];
      const cek = kotak.map(([x, y]) => { const d = h(`<div class="sw-cek merah" style="left:${(x * sk - 6).toFixed(1)}px;top:${(46 + y * sk - 6).toFixed(1)}px;width:${(30 * sk).toFixed(1)}px;height:${(30 * sk).toFixed(1)}px">✓</div>`); el.appendChild(d); return d; });
      const t0 = T(L.at, 0.6);
      parts.push((lt, d) => {
        const k = E.out3(P(lt, t0, t0 + 0.6)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 70).toFixed(1)}px)`;
        cek.forEach((c, i) => { const kc = P(sc.start + lt, C.centang[i], C.centang[i] + 0.25); c.style.opacity = kc > 0 ? 1 : 0; c.style.transform = `scale(${lerp(2, 1, E.outBack(Math.max(0.001, kc))).toFixed(3)}) rotate(-8deg)`; });
      });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
