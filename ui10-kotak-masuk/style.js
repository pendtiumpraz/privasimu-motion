// Gaya UI10 · KOTAK MASUK: aplikasi email fiktif di lapisan lintas scene. Baris diposisikan absolut per slot (slot
// bergeser +1 saat email "takut" masuk, -1 saat diarsipkan); baris takut punya keadaan: masuk → sorot → prefiks
// Re:/Fwd: menumpuk → tersedot ke formulir → kembali berlabel hijau → keluar (arsip). Chip Fwd terbang ke 4 avatar,
// gelembung balasan, chip hitung mundur (72:00:00 → 13:07:22), layar asli formulir & bar tiket, rantai alur. Semua = f(t).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BARIS = [
    ['NP', 'Newsletter Produk', 'Fitur baru bulan ini', 'Lihat pembaruan terbaru dan tips penggunaan…', '07.41'],
    ['TI', 'Tim Internal', 'Re: Re: Re: rapat Senin', 'Jadi jam berapa? Ruangan yang mana ya…', '07.48'],
    ['NS', 'Notifikasi Sistem', 'Backup malam selesai', 'Semua berkas tersimpan tanpa galat…', '07.50'],
    ['HR', 'HRD', 'Pengingat: isi timesheet', 'Batas pengisian hari ini pukul lima sore…', '07.52'],
    ['KE', 'Keuangan', 'Reimburse Agustus', 'Mohon lengkapi bukti transaksi sebelum…', '07.55'],
    ['MK', 'Marketing', 'Draf caption minggu ini', 'Tolong dicek sebelum tayang, terutama…', '07.58'],
    ['PC', 'Percetakan', 'Penawaran spanduk', 'Harga khusus untuk pesanan di atas…', '08.00'],
  ];
  const TAKUT = ['?', 'Pelanggan · p•••@•••.id', 'Tolong hapus semua data saya.', 'Saya ingin seluruh data pribadi saya dihapus dari sistem Anda. Mohon konfirmasi…', '08.02'];
  const PRE = ['Re: ', 'Fwd: ', 'Re: ', 'Fwd: '], ORANG = ['CS', 'Legal', 'IT', 'DPO'], BALAS = ['sudah ditangani?', 'belum, kamu?', 'cc DPO ya', '…'];
  const LX = pick(300, 40), LW = pick(1160, 1000), TOP = pick(140, 180), RH = pick(104, 118);
  const AV = ORANG.map((_, i) => V ? [180 + i * 240, 1330] : [1700, 250 + i * 150]);
  const FC = V ? [540, 760] : [880, 540]; // pusat formulir/bar
  const C = { mulai: 9e9, takut: 9e9, sorot: 9e9, fwd: 9e9, balas: 9e9, mundur: 9e9, tiket: 9e9, detail: 9e9, alur: 9e9, kembali: 9e9, arsip: 9e9, tutup: 9e9 };
  let lapis = null, el = null;

  const baris = (d, kelas) => h(`<div class="em-baris ${kelas || ''}" style="left:${LX}px;width:${LW}px"><i class="av">${esc(d[0])}</i><div class="isi"><b>${esc(d[1])}</b><span class="subjek">${esc(d[2])}</span><span class="pra">${esc(d[3])}</span></div><em>${esc(d[4])}</em><u class="tag">DSR-2026-017 · 71h tersisa</u></div>`);
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('em-lapis');
    el = {};
    el.app = h(`<div class="em-app">${V ? '' : '<div class="em-sisi"><b>Kotak Masuk</b><span>Berbintang</span><span>Terkirim</span><span>Draf</span><span>Arsip</span></div>'}<div class="em-kepala"><span class="cari">Cari email…</span><b class="jam">Senin · 08.02</b></div></div>`); lapis.appendChild(el.app);
    el.jam = el.app.querySelector('.jam');
    el.list = h('<div class="em-list"></div>'); lapis.appendChild(el.list);
    el.baris = BARIS.map((d) => { const b = baris(d); el.list.appendChild(b); return b; });
    el.takut = baris(TAKUT, 'takut'); el.list.appendChild(el.takut); el.subjek = el.takut.querySelector('.subjek');
    el.avatar = ORANG.map((n, i) => { const d = h(`<div class="em-avatar" style="left:${AV[i][0]}px;top:${AV[i][1]}px"><i>${n.slice(0, 2).toUpperCase()}</i><span>${n}</span><b>1</b></div>`); lapis.appendChild(d); return d; });
    el.fwd = ORANG.map(() => { const d = h('<div class="em-fwd">Fwd:</div>'); lapis.appendChild(d); return d; });
    el.balas = BALAS.map((s, i) => { const d = h(`<div class="em-balas" style="left:${AV[i][0]}px;top:${AV[i][1]}px">${esc(s)}</div>`); lapis.appendChild(d); return d; });
    el.tenggat = h('<div class="em-tenggat">TENGGAT <b>72:00:00</b></div>'); lapis.appendChild(el.tenggat); el.tenggatB = el.tenggat.querySelector('b');
    el.selesai = h('<div class="em-selesai">✓ tercatat · 1 menit*</div>'); lapis.appendChild(el.selesai);
    el.alur = h(`<div class="em-alur" style="left:${V ? 540 : 880}px;top:${V ? 1330 : 740}px"><span>Handler</span><i>→</i><span>Reviewer</span><i>→</i><span>Approver</span></div>`); lapis.appendChild(el.alur);
  }
  const jam = (s) => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
  function gambar(t) {
    const ka = E.out3(P(t, C.mulai, C.mulai + 0.5));
    el.app.style.opacity = ka;
    const geser = P(t, C.takut, C.takut + 0.5) - P(t, C.arsip + 0.2, C.arsip + 0.7);
    const redup = P(t, C.sorot, C.sorot + 0.4) * (1 - P(t, C.kembali, C.kembali + 0.4));
    const kabur = P(t, C.tiket, C.tiket + 0.4) * (1 - P(t, C.kembali, C.kembali + 0.4));
    el.baris.forEach((b, i) => {
      const t0 = C.mulai + 0.15 + i * 0.12, k = E.out3(P(t, t0, t0 + 0.45));
      b.style.opacity = (k * lerp(1, 0.35, redup)).toFixed(3);
      b.style.transform = `translateY(${(TOP + (i + geser) * RH - (1 - k) * 120).toFixed(1)}px)`;
      b.style.filter = kabur > 0 ? `blur(${(kabur * 3).toFixed(1)}px)` : '';
    });
    // baris takut
    const km = E.outBack(Math.max(0.001, P(t, C.takut, C.takut + 0.55))), ks = E.io3(P(t, C.sorot, C.sorot + 0.4));
    const sedot = P(t, C.tiket + 0.2, C.tiket + 0.8), balik = E.outBack(Math.max(0.001, P(t, C.kembali, C.kembali + 0.5))), keluar = E.io3(P(t, C.arsip, C.arsip + 0.5));
    let tx = 0, ty = TOP - (1 - km) * 140, sc = 1 + 0.05 * ks, op = t >= C.takut ? 1 : 0;
    if (t >= C.tiket + 0.2 && t < C.kembali) { const e = E.io3(sedot); tx = (FC[0] - (LX + LW / 2)) * e; ty = TOP + (FC[1] - TOP - RH / 2) * e; sc = lerp(sc, 0.12, e); op = 1 - P(t, C.tiket + 0.65, C.tiket + 0.8); }
    else if (t >= C.kembali) { sc = lerp(0.9, 1, balik); op = 1 - keluar; tx = keluar * 1400; }
    el.takut.style.opacity = op; el.takut.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
    el.takut.classList.toggle('sorot', t >= C.sorot && t < C.kembali); el.takut.classList.toggle('hijau', t >= C.kembali);
    const n = t >= C.kembali ? 0 : [0, 1, 2, 3].filter((i) => t >= C.balas + i * 0.35).length;
    const sub = PRE.slice(0, n).reverse().join('') + TAKUT[2]; if (el.subjek.textContent !== sub) el.subjek.textContent = sub;
    // jam
    const jm = t >= C.kembali ? 'Senin · 08.03' : 'Senin · 08.02'; if (el.jam.textContent !== jm) el.jam.textContent = jm;
    // avatar, fwd, balasan
    const kolaps = E.io3(P(t, C.alur, C.alur + 0.5));
    el.avatar.forEach((a, i) => {
      const t0 = C.fwd + 0.1 + i * 0.15, k = E.outBack(Math.max(0.001, P(t, t0, t0 + 0.4)));
      const dx = V ? (540 - AV[i][0]) * kolaps : 0, dy = V ? 0 : (560 - AV[i][1]) * kolaps;
      a.style.opacity = (t >= t0 ? 1 : 0) * (1 - P(t, C.alur + 0.3, C.alur + 0.5));
      a.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) translate(-50%, -50%) scale(${(k * (1 - 0.5 * kolaps)).toFixed(3)})`;
      a.classList.toggle('dapat', t >= t0 + 0.7);
      const kf = P(t, t0, t0 + 0.7), f = el.fwd[i];
      f.style.opacity = kf > 0 && kf < 1 ? 1 : 0;
      f.style.transform = `translate(${lerp(LX + LW - 80, AV[i][0], E.io3(kf)).toFixed(1)}px, ${lerp(TOP + RH / 2, AV[i][1], E.io3(kf)).toFixed(1)}px) translate(-50%, -50%) rotate(${((1 - kf) * -12).toFixed(1)}deg)`;
      const tb = C.balas + i * 0.35, kb = t >= tb && t < C.alur ? E.outBack(Math.max(0.001, P(t, tb, tb + 0.35))) : 0;
      el.balas[i].style.opacity = kb > 0.001 ? 1 : 0; el.balas[i].style.transform = `translate(${V ? '-50%, -250%' : '-112%, -50%'}) scale(${kb.toFixed(3)})`;
    });
    // hitung mundur
    const kt = t >= C.mundur && t < C.tiket ? E.outBack(Math.max(0.001, P(t, C.mundur, C.mundur + 0.35))) : 0;
    const sisa = Math.round(72 * 3600 - P(t, C.mundur, C.mundur + 2.2) * (72 * 3600 - (13 * 3600 + 7 * 60 + 22)));
    if (el.tenggatB.textContent !== jam(sisa)) el.tenggatB.textContent = jam(sisa);
    el.tenggat.style.opacity = kt > 0.001 ? 1 : 0; el.tenggat.style.transform = `scale(${kt.toFixed(3)})`; el.tenggat.classList.toggle('merah', sisa < 24 * 3600);
    const kse = t >= C.kembali + 0.3 ? E.outBack(Math.max(0.001, P(t, C.kembali + 0.3, C.kembali + 0.7))) : 0;
    el.selesai.style.opacity = kse > 0.001 ? 1 : 0; el.selesai.style.transform = `scale(${kse.toFixed(3)})`;
    // formulir & bar tiket
    if (el.form) {
      const kf = t >= C.tiket ? E.outBack(Math.max(0.001, P(t, C.tiket, C.tiket + 0.5))) * (1 - P(t, C.detail, C.detail + 0.3)) : 0;
      el.form.style.opacity = kf > 0.001 ? 1 : 0; el.form.style.transform = `translate(-50%, -50%) scale(${lerp(0.85, 1, kf).toFixed(3)})`;
    }
    if (el.bar) {
      const kb = t >= C.detail + 0.15 ? E.outBack(Math.max(0.001, P(t, C.detail + 0.15, C.detail + 0.6))) * (1 - P(t, C.kembali, C.kembali + 0.3)) : 0;
      el.bar.style.opacity = kb > 0.001 ? 1 : 0; el.bar.style.transform = `translate(-50%, -50%) scale(${lerp(0.9, 1, kb).toFixed(3)})`;
    }
    const kal = t >= C.alur + 0.3 ? E.outBack(Math.max(0.001, P(t, C.alur + 0.3, C.alur + 0.7))) * (1 - P(t, C.kembali, C.kembali + 0.3)) : 0;
    el.alur.style.opacity = kal > 0.001 ? 1 : 0; el.alur.style.transform = `translate(-50%, -50%) scale(${kal.toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['800 40px Inter', '600 24px Inter'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#E9EDF4'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('em', (root, v, sc, tm, T) => {
    ensure();
    ['mulai', 'takut', 'sorot', 'fwd', 'balas', 'mundur', 'tiket', 'detail', 'alur', 'kembali', 'arsip'].forEach((k) => { if (v[k] != null) C[k] = sc.start + T(v[k], 0.5); });
    if (v.cta) C.tutup = sc.start;
    if (v.form && !el.form) {
      el.form = PD.layar(lapis, v.form.nama, { w: pick(560, 760), potong: v.form.potong, judul: v.form.judul });
      el.form.style.left = FC[0] + 'px'; el.form.style.top = FC[1] + 'px'; el.form.style.opacity = 0;
    }
    if (v.bar && !el.bar) {
      el.bar = PD.layar(lapis, v.bar.nama, { w: pick(900, 1000), potong: v.bar.potong, judul: v.bar.judul });
      el.bar.style.left = FC[0] + 'px'; el.bar.style.top = FC[1] + 'px'; el.bar.style.opacity = 0;
    }
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
