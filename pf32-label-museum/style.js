// Gaya PF32 · LABEL MUSEUM: "dunia" selebar tiga layar (dinding berpanel, lantai, rel lampu) berisi tiga grup vitrin
// (lampu sorot kerucut, kaca, alas, kartu keterangan serif). Kamera = transform dunia: pusat cx + zoom z, dirantai dari
// keyframe cue (setiap keyframe menginterpolasi dari nilai sebelumnya, io3). Vitrin redup (brightness) sampai lampunya
// menyala; baris kartu muncul per cue; cap MASIH DIPAKAI* lalu plakat DIPENSIUNKAN ✓. 9:16: kartu di atas vitrin.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const X = (i) => SW / 2 + i * SW;
  const LANTAI = pick(890, 1500);
  const VIT = pick({ l: -470, t: 220, w: 620, h: 430 }, { l: -380, t: 690, w: 760, h: 470 });
  const ALAS = pick({ l: -440, t: 650, w: 560, h: 250 }, { l: -340, t: 1160, w: 680, h: 340 });
  const KARTU = pick({ l: 220, t: 300, w: 420 }, { l: -420, t: 230, w: 840 });
  const SOROT = pick({ cx: -160, w: 1000, h: LANTAI }, { cx: 0, w: 1040, h: LANTAI });
  const TAB = ['Sheet1', 'Sheet1 (2)', 'RoPA_FINAL', 'FINAL_v2', 'JANGAN DIUBAH', 'copy of copy', 'rev Pak B*', '2019 (lama)', 'baru', 'baru (2)', 'HR?', 'IT', 'cek lagi', '…'];
  const KART = [
    ['No. 014 · Sayap Spreadsheet', 'Spreadsheet RoPA', '<i>ca. 2019*</i>', 'Bahan: 14 tab, 1 orang yang paham*'],
    ['No. 015 · Sayap Spreadsheet', 'Surel “RE: FW: data pelanggan”', '<i>ca. 2021*</i>', '37 balasan, 0 keputusan*'],
    ['No. 016 · Koleksi Terbaru', 'Register RoPA terpusat', 'Privasimu Nexus · kode ROPA-TAHUN-NOMOR', 'riwayat perubahan &amp; log audit<em>Status: dipakai setiap hari</em>'],
  ];
  const C = { mulai: 9e9, geser: [9e9, 9e9, 9e9], label: [[9e9, 9e9, 9e9], [9e9, 9e9, 9e9], [9e9, 9e9, 9e9]], mundur: 9e9, cap: 9e9, semua: 9e9, pensiun: 9e9, tutup: 9e9 };
  let lapis = null, el = null;

  function artefak(i) {
    if (i === 0) return `<div class="mu-sheet"><div class="judul">RoPA_2019_FINAL(2).xlsx*</div><div class="grid">${['Tujuan: ???', 'lihat tab 7', 'tanya Pak B*', 'Dasar: —', 'Retensi: ?', 'HR (lama)'].map((s, k) => `<span style="left:${8 + (k % 3) * 31}%;top:${16 + Math.floor(k / 3) * 30}%">${s}</span>`).join('')}<b style="left:40%;top:10%"></b><b class="kuning" style="left:8%;top:62%"></b><b class="merah" style="left:70%;top:44%"></b></div><div class="tab">${TAB.map((t, k) => `<u${k === 4 ? ' class="aktif"' : ''}>${esc(t)}</u>`).join('')}</div></div>`;
    if (i === 1) return `<div class="mu-surel"><div class="kop"><b>Subjek: RE: FW: RE: FW: data pelanggan</b><span>Dari: … · Kepada: semua · Cc: semua</span></div>${[96, 88, 80, 72, 64, 56, 48].map((w, k) => `<i style="width:${w}%;margin-left:${k * 2}%"></i>`).join('')}<em>37 balasan*</em></div>`;
    return '';
  }
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('mu-lapis');
    el = { kasus: [] };
    el.dunia = h(`<div class="mu-dunia" data-bebas="1" style="width:${SW * 3}px;height:${SH}px"></div>`); lapis.appendChild(el.dunia);
    el.dunia.appendChild(h(`<div class="mu-dinding" style="left:${-SW * 2}px;top:${-SH * 2}px;width:${SW * 7}px;height:${LANTAI + SH * 2}px"></div>`));
    el.dunia.appendChild(h(`<div class="mu-lantai" style="left:${-SW * 2}px;top:${LANTAI}px;width:${SW * 7}px;height:${SH * 3}px"></div>`));
    el.dunia.appendChild(h(`<div class="mu-rel" style="left:${-SW * 2}px;width:${SW * 7}px"></div>`));
    for (let i = 0; i < 3; i++) {
      const g = h(`<div class="mu-kasus" style="left:${X(i)}px"></div>`); el.dunia.appendChild(g);
      const k = { g };
      k.sorot = h(`<div class="mu-sorot" style="left:${SOROT.cx - SOROT.w / 2}px;width:${SOROT.w}px;height:${SOROT.h}px"></div>`); g.appendChild(k.sorot);
      k.isi = h('<div class="mu-isi"></div>'); g.appendChild(k.isi);
      k.alas = h(`<div class="mu-alas" style="left:${ALAS.l}px;top:${ALAS.t}px;width:${ALAS.w}px;height:${ALAS.h}px">${i === 2 ? '<span class="pakai"><i></i>SEDANG DIPAKAI</span>' : ''}</div>`); k.isi.appendChild(k.alas);
      k.art = h(`<div class="mu-art" style="left:${VIT.l}px;top:${VIT.t}px;width:${VIT.w}px;height:${VIT.h}px">${artefak(i)}</div>`); k.isi.appendChild(k.art);
      k.kaca = h(`<div class="mu-kaca" style="left:${VIT.l}px;top:${VIT.t}px;width:${VIT.w}px;height:${VIT.h}px"></div>`); k.isi.appendChild(k.kaca);
      const [no, judul, b1, b2] = KART[i];
      k.kartu = h(`<div class="mu-kartu${i === 2 ? ' baru' : ''}" style="left:${KARTU.l}px;top:${KARTU.t}px;width:${KARTU.w}px"><div class="no">${esc(no)}</div><h3>${esc(judul)}</h3><div class="b1">${b1}</div><div class="b2">${b2}</div></div>`); k.isi.appendChild(k.kartu);
      k.baris = [k.kartu.querySelector('h3'), k.kartu.querySelector('.b1'), k.kartu.querySelector('.b2')];
      if (i < 2) {
        k.cap = h('<div class="mu-cap">MASIH DIPAKAI*</div>'); k.kartu.appendChild(k.cap);
        k.plakat = h(`<div class="mu-plakat" style="left:${VIT.l + VIT.w / 2}px;top:${VIT.t + VIT.h / 2}px">DIPENSIUNKAN ✓</div>`); k.isi.appendChild(k.plakat); // di depan kaca
      }
      el.kasus.push(k);
    }
    el.papan = h('<div class="mu-papan"><b>MUSEUM KEPATUHAN</b><span></span></div>'); lapis.appendChild(el.papan); el.papanSub = el.papan.querySelector('span');
    el.catatan = h('<div class="mu-catatan">*pameran & angka ilustrasi</div>'); lapis.appendChild(el.catatan);
  }
  function kamera(t) {
    const zMid = pick(0.55, 0.5);
    let cx = X(0), z = 1;
    const kf = [[C.geser[1], X(1), 1, 1.0], [C.mundur, (X(0) + X(1)) / 2, zMid, 0.9], [C.geser[2], X(2), 1, 1.1], [C.semua, (X(0) + X(1)) / 2, zMid, 1.1]]; // penutup mencerminkan bidikan twist: merah → hijau
    kf.forEach(([tk, x, zz, d]) => { const k = E.io3(P(t, tk, tk + d)); cx = lerp(cx, x, k); z = lerp(z, zz, k); });
    return [cx, z];
  }
  function gambar(t) {
    const [cx, z] = kamera(t);
    el.dunia.style.transform = `translate(${SW / 2}px, ${SH / 2}px) scale(${z.toFixed(4)}) translate(${(-cx).toFixed(1)}px, ${(-SH / 2).toFixed(1)}px)`;
    const nyala = [C.mulai, C.geser[1] + 0.45, C.geser[2] + 0.6];
    el.kasus.forEach((k, i) => {
      const tn = nyala[i], kn = P(t, tn, tn + 0.25), kedip = t >= tn && t < tn + 0.35 ? 0.55 + 0.45 * hash(Math.floor(t * 30) + i) : 1;
      k.sorot.style.opacity = (kn * kedip).toFixed(3);
      k.isi.style.filter = `brightness(${lerp(0.32, 1, kn * kedip).toFixed(3)})`;
      // kartu: judul membawa kartu masuk, baris lain menyusul
      const [t0, t1, t2] = C.label[i], kk = E.out3(P(t, t0, t0 + 0.45));
      k.kartu.style.opacity = kk.toFixed(3); k.kartu.style.transform = `translateY(${((1 - kk) * 24).toFixed(1)}px)`;
      [t0, t1, t2].forEach((tb, b) => { const kb = P(t, tb, tb + 0.35); k.baris[b].style.opacity = kb.toFixed(3); k.baris[b].style.transform = `translateX(${((1 - E.out3(kb)) * -14).toFixed(1)}px)`; });
      if (i === 2) { const ka = E.io3(P(t, C.geser[2] + 0.9, C.geser[2] + 1.5)); k.kaca.style.transform = `translateY(${(-ka * VIT.h * 0.55).toFixed(1)}px)`; k.kaca.style.opacity = (1 - 0.8 * ka).toFixed(3); }
      if (k.cap) {
        const tc = C.cap + i * 0.25, kc = P(t, tc, tc + 0.22), tp = C.pensiun + i * 0.2, kp = P(t, tp, tp + 0.3);
        k.cap.style.opacity = ((kc > 0 ? 1 : 0) * (1 - kp)).toFixed(3); k.cap.style.transform = `translate(-50%, -50%) rotate(-12deg) scale(${lerp(2.2, 1, E.out3(kc)).toFixed(3)})`;
        k.plakat.style.opacity = kp.toFixed(3); k.plakat.style.transform = `translate(-50%, -50%) rotate(-6deg) scale(${(kp > 0 ? lerp(1.6, 1, E.outBack(kp)) : 1.6).toFixed(3)})`;
      }
    });
    if (el.layar) { const kl = P(t, C.geser[2] + 0.7, C.geser[2] + 1.1); el.layar.style.opacity = kl.toFixed(3); }
    const sub = t >= C.semua + 0.4 ? 'Sayap Arsip' : t >= C.geser[2] + 0.5 ? 'Koleksi Terbaru' : 'Sayap Spreadsheet'; if (el.papanSub.textContent !== sub) el.papanSub.textContent = sub;
    el.papan.style.opacity = P(t, C.mulai + 0.4, C.mulai + 1).toFixed(3);
    el.catatan.style.opacity = t >= C.mulai + 1.5 ? 0.75 : 0;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 40px "EB Garamond"', 'italic 400 26px "EB Garamond"', '800 30px Inter', '600 24px Inter'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#16120F'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('mu', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0.15);
    if (v.geser) C.geser[v.geser[0]] = sc.start + T(v.geser[1], 0.05);
    if (v.label) { const [i, ...cs] = v.label; cs.forEach((c, b) => { C.label[i][b] = sc.start + T(c, 0.6 + b * 0.8); }); }
    ['mundur', 'cap', 'semua', 'pensiun'].forEach((k) => { if (v[k] != null) C[k] = sc.start + T(v[k], 0.5); });
    if (v.cta) C.tutup = sc.start;
    if (v.layar && !el.layar) {
      const L = v.layar, w = VIT.w - pick(60, 60);
      el.layar = PD.layar(el.kasus[2].isi, L.nama, { w, potong: L.potong, judul: L.judul });
      el.layar.style.left = (VIT.l + (VIT.w - w) / 2) + 'px'; el.layar.style.top = (VIT.t + (VIT.h - el.layar._h) / 2) + 'px'; el.layar.style.opacity = 0;
    }
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
