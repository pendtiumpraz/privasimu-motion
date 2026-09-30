// Gaya UI05 · RETRO OS: desktop + jendela + dialog di lapisan lintas scene. Kursor bergerak (io3) ke ikon, klik dua kali
// (denyut), jendela terbuka; dialog error ke-i muncul pada C.error + jeda(i) dengan offset diagonal; "banjir" mempercepat;
// FAAAH menghantam; "akhiri" → dialog akhiri tugas → semuanya lenyap; pil fakta muncul di scene 3.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const ERR = ['Simpan sebagai RoPA_final_revisi3_FIX2.xlsx?', 'Versi ini bukan versi terbaru.', 'Makro dinonaktifkan. Rumus retensi hilang.', 'Memori kepatuhan penuh.', 'Berkas sedang diedit di 3 laptop lain.', 'Tab "Sheet1 (2)" tidak ditemukan.', 'Kolom "dasar pemrosesan" kosong.', 'Auditor menunggu… (00:14:52)', 'Kesalahan 0x0000R0PA', 'Simpan sebagai FIX3?', 'Sungguh ingin keluar tanpa menyimpan?', 'Koneksi ke shared drive terputus.', 'Tidak merespons.', 'Versi FIX2 telah menimpa FIX.', 'Makro dinonaktifkan (lagi).', 'Memori kepatuhan penuh (lagi).', 'Auditor menunggu… (00:21:08)', 'Kesalahan 0x0000R0PA (2)'];
  const C = { kursor: 9e9, klik: 9e9, jendela: 9e9, kunci: 9e9, beku: 9e9, error: 9e9, banjir: 9e9, faaah: 9e9, akhiri: 9e9, bersih: 9e9, pil: [9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, kursor = null, ikon = null, jendela = null, kunci = null, dialogs = [], faaah = null, akhiri = null, pil = [];
  const IX = pick(300, 200), IY = pick(230, 420), JX = pick(560, 60), JY = pick(150, 330), JW = pick(1100, 960), JH = pick(680, 900);

  const dialog = (judul, isi, kelas = '') => `<div class="ro-dlg ${kelas}"><div class="ro-bar"><span>${judul}</span><i>×</i></div><div class="ro-isi"><b>✕</b><span>${esc(isi)}</span></div><div class="ro-tombol"><u>OK</u><u>Batal</u></div></div>`;
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ro-lapis');
    ikon = h(`<div class="ro-ikon" style="left:${IX}px;top:${IY}px"><i>▦</i><span>RoPA_final_revisi3_FIX.xlsx</span></div>`); lapis.appendChild(ikon);
    ['RoPA_final.xlsx', 'RoPA_final_v2.xlsx', 'Recycle'].forEach((n, i) => lapis.appendChild(h(`<div class="ro-ikon redup" style="left:${IX}px;top:${IY + 150 + i * 150}px"><i>${i === 2 ? '🗑' : '▦'}</i><span>${n}</span></div>`)));
    jendela = h(`<div class="ro-win" style="left:${JX}px;top:${JY}px;width:${JW}px;height:${JH}px"><div class="ro-bar"><span>RoPA_final_revisi3_FIX.xlsx — Lembar Kerja</span><i>_ □ ×</i></div><div class="ro-menu">Berkas · Sunting · Lihat · Sisipkan · Rumus · Bantuan</div><div class="ro-sheet">${Array.from({ length: 12 }, (_, r) => `<div class="baris">${Array.from({ length: 7 }, (_, c) => `<div class="sel">${r === 0 ? ['No', 'Aktivitas', 'Tujuan', 'Dasar', 'Kategori', 'Retensi', 'Pemilik'][c] : (c === 0 ? r : (hash(r * 7 + c) > 0.55 ? '…' : ''))}</div>`).join('')}</div>`).join('')}</div><div class="ro-beku"><span>(Tidak merespons)</span></div></div>`);
    lapis.appendChild(jendela);
    kunci = h(dialog('Berkas terkunci', 'Berkas dikunci oleh pengguna lain. Buka hanya-baca?', 'kunci')); lapis.appendChild(kunci);
    dialogs = ERR.map((e, i) => { const el = h(dialog('Kesalahan', e)); lapis.appendChild(el); return el; });
    faaah = h('<div class="ro-faaah">FAAAH</div>'); lapis.appendChild(faaah);
    akhiri = h(dialog('Pengelola Tugas', 'Program tidak merespons. Akhiri tugas sekarang?', 'akhiri')); lapis.appendChild(akhiri);
    kursor = h('<div class="ro-kursor"><svg viewBox="0 0 24 32"><path d="M2 2 L2 26 L8 20 L12 30 L16 28 L12 19 L20 19 Z"/></svg><div class="jam">⌛</div></div>'); lapis.appendChild(kursor);
    pil = ['1 versi', 'kode otomatis ROPA-TAHUN-NOMOR', 'Maker → Reviewer → Approver'].map((t) => { const el = h(`<div class="ro-pil">${t}</div>`); lapis.appendChild(el); return el; });
  }
  function waktuDialog(i) { // dialog ke-i muncul: 4 pertama per cue-kata (jeda 0.9), sisanya banjir cepat
    if (i < 4) return C.error + i * 0.95;
    return C.banjir + (i - 4) * 0.13;
  }
  function gambar(t) {
    const bersih = t >= C.bersih;
    // kursor
    const kk = E.io3(P(t, C.kursor, C.kursor + 0.7)), k2 = P(t, C.klik, C.klik + 0.3);
    const kx = lerp(SW * 0.62, IX + 40, kk), ky = lerp(SH * 0.7, IY + 30, kk);
    kursor.style.transform = `translate(${kx.toFixed(1)}px, ${ky.toFixed(1)}px) scale(${(k2 > 0 && k2 < 1 ? (Math.floor(t * 12) % 2 ? 0.85 : 1) : 1).toFixed(2)})`;
    kursor.style.opacity = bersih ? 0 : 1;
    kursor.classList.toggle('sibuk', t >= C.klik + 0.3 && t < C.jendela + 0.6);
    ikon.classList.toggle('pilih', t >= C.klik);
    lapis.querySelectorAll('.ro-ikon').forEach((el) => { el.style.opacity = bersih ? 0 : 1; });
    // jendela
    const kj = E.out3(P(t, C.jendela, C.jendela + 0.35));
    jendela.style.opacity = kj > 0 && !bersih ? 1 : 0; jendela.style.transform = `scale(${lerp(0.6, 1, kj).toFixed(3)})`;
    jendela.classList.toggle('beku', t >= C.beku);
    const ku = P(t, C.kunci, C.kunci + 0.2);
    kunci.style.opacity = ku > 0 && !bersih ? 1 : 0; kunci.style.transform = `translate(${(JX + JW / 2).toFixed(0)}px, ${(JY + JH / 2).toFixed(0)}px) translate(-50%, -50%) scale(${lerp(0.8, 1, ku).toFixed(3)})`;
    dialogs.forEach((el, i) => {
      const t0 = waktuDialog(i), k = P(t, t0, t0 + 0.15);
      el.style.opacity = k > 0 && !bersih ? 1 : 0;
      const ox = pick(420, 40) + (i % 9) * pick(60, 34) + Math.floor(i / 9) * pick(300, 60), oy = pick(120, 260) + (i % 9) * pick(56, 62) + Math.floor(i / 9) * pick(40, 380);
      el.style.transform = `translate(${ox}px, ${oy}px) scale(${lerp(0.9, 1, k).toFixed(3)})`;
      el.style.zIndex = 10 + i;
    });
    const kf = P(t, C.faaah, C.faaah + 0.25);
    faaah.style.opacity = kf > 0 && !bersih ? 1 : 0; faaah.style.transform = `translate(-50%, -50%) rotate(-6deg) scale(${lerp(2.4, 1, E.outExpo(kf)).toFixed(3)})`;
    const ka = P(t, C.akhiri, C.akhiri + 0.2);
    akhiri.style.opacity = ka > 0 && !bersih ? 1 : 0; akhiri.style.transform = `translate(${(SW / 2).toFixed(0)}px, ${(SH / 2).toFixed(0)}px) translate(-50%, -50%) scale(${lerp(0.8, 1, ka).toFixed(3)})`;
    lapis.style.transform = t >= C.faaah && t < C.faaah + 0.4 ? `translate(${((hash(Math.floor(t * 40)) - 0.5) * 14).toFixed(1)}px, ${((hash(Math.floor(t * 40) + 3) - 0.5) * 14).toFixed(1)}px)` : '';
    document.body.classList.toggle('bersih', bersih);
    pil.forEach((el, i) => { const k = P(t, C.pil[i], C.pil[i] + 0.3); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translate(${pick(370, 60)}px, ${(pick(720, 1230) + i * 62).toFixed(0)}px) scale(${lerp(1.3, 1, E.out3(k)).toFixed(3)})`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['600 60px "Pixelify Sans"', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const bersih = t >= C.bersih;
      cx.fillStyle = bersih ? '#EEF2F7' : '#0E7C7B'; cx.fillRect(0, 0, W, H);
      if (bersih) return;
      cx.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < H; y += 3) cx.fillRect(0, y, W, 1); // scanline
      cx.fillStyle = '#C0C0C0'; cx.fillRect(0, H - 56, W, 56); cx.fillStyle = '#808080'; cx.fillRect(0, H - 56, W, 3); // taskbar
      cx.fillStyle = '#000'; cx.font = '600 28px "Pixelify Sans"'; cx.textAlign = 'left'; cx.fillText('▣ Mulai', 24, H - 18);
      cx.textAlign = 'right'; cx.fillText('03:00', W - 30, H - 18);
    },
  });

  KIT.registerType('ro', (root, v, sc, tm, T) => {
    ensure();
    for (const k of ['kursor', 'klik', 'jendela', 'kunci', 'beku', 'error', 'banjir', 'faaah', 'akhiri', 'bersih']) if (v[k] != null) C[k] = sc.start + T(v[k], 1);
    if (v.pil) v.pil.forEach((c, i) => { C.pil[i] = sc.start + T(c, 2.5 + i * 0.6); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1180, 980), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(300, 620)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
