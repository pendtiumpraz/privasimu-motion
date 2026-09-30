// Gaya PF14 · VISUAL NOVEL: ruangan digambar di kanvas latar (dinding, jendela, lantai); siluet & kotak dialog di lapisan
// lintas scene. Dialog aktif = cue terakhir yang lewat (teks diketik 30 huruf/dtk); setelah rewind, dialog kembali ke
// pertanyaan auditor sampai jawaban B. Menu pilihan satu elemen dengan keadaan per waktu (menu1 → A, menu2 → B,
// menu3 → A mati). Overlay BAD END / GOOD END / rewind, jendela spreadsheet acak (hash), kartu ITEM berisi layar asli.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const DIALOG = [['AUDITOR', 'RoPA-nya mana?'], ['KAMU', 'Sebentar… (membuka 12 spreadsheet*)'], ['KAMU', 'Ini.'], ['AUDITOR', 'Lengkap. Terima kasih.'], ['AUDITOR', 'DPIA-nya?']];
  const LANTAI = pick(800, 1400);
  const C = { mulai: 9e9, dialog: [9e9, 9e9, 9e9, 9e9, 9e9], menu1: 9e9, pilihA: 9e9, sheet: 9e9, hari: 9e9, buruk: 9e9, ulang: 9e9, menu2: 9e9, pilihB: 9e9, item: 9e9, baik: 9e9, tanya2: 9e9, menu3: 9e9, satu: 9e9, tutup: 9e9 };
  let lapis = null, el = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('vn-lapis');
    el = {};
    const tokoh = (k, x) => { const d = h(`<div class="vn-tokoh ${k}" style="left:${x}px;top:${LANTAI}px"><i class="kepala"></i><i class="badan"></i>${k === 'auditor' ? '<i class="papan"></i>' : ''}</div>`); lapis.appendChild(d); return d; };
    el.auditor = tokoh('auditor', pick(430, 300)); el.kamu = tokoh('kamu', pick(1490, 780));
    el.sheet = Array.from({ length: 12 }, (_, i) => {
      const x = pick(200 + hash(i * 7 + 1) * 1300, 40 + hash(i * 7 + 1) * 720), y = pick(110 + hash(i * 13 + 2) * 520, 260 + hash(i * 13 + 2) * 900), r = (hash(i * 3 + 5) - 0.5) * 18;
      const d = h(`<div class="vn-sheet" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;--r:${r.toFixed(1)}deg"><b>Sheet${i + 1} (${2020 + (i % 7)})*</b><i></i><i></i><i></i></div>`); lapis.appendChild(d); return d;
    });
    el.hari = h('<div class="vn-hari">HARI <b>1</b></div>'); lapis.appendChild(el.hari);
    el.item = h('<div class="vn-item"><div class="vi-kop">★ ITEM DIPEROLEH</div><div class="vi-nama">RoPA · kode ROPA-TAHUN-NOMOR · riwayat perubahan lengkap</div><div class="vi-layar"></div></div>'); lapis.appendChild(el.item);
    el.kotak = h('<div class="vn-kotak"><div class="vn-nama"></div><div class="vn-teks"></div><i class="vn-lanjut">▼</i></div>'); lapis.appendChild(el.kotak);
    el.nama = el.kotak.querySelector('.vn-nama'); el.teks = el.kotak.querySelector('.vn-teks'); el.lanjut = el.kotak.querySelector('.vn-lanjut');
    el.menu = h('<div class="vn-menu"><div class="vn-opsi"><i class="kursor">▶</i><span>A. "Sebentar…"</span><em>tidak tersedia</em></div><div class="vn-opsi"><i class="kursor">▶</i><span>B. "Ini."</span></div><div class="vn-catat">draf DPIA sudah dibuat otomatis dari RoPA berisiko tinggi</div></div>'); lapis.appendChild(el.menu);
    el.opsi = Array.from(el.menu.querySelectorAll('.vn-opsi')); el.catat = el.menu.querySelector('.vn-catat');
    el.akhir = h('<div class="vn-akhir"><div class="judul"></div><div class="sub"></div><div class="stat"><span></span><span></span></div><div class="prompt">▶ Muat ulang?</div></div>'); lapis.appendChild(el.akhir);
    el.akhirJudul = el.akhir.querySelector('.judul'); el.akhirSub = el.akhir.querySelector('.sub'); el.stat = Array.from(el.akhir.querySelectorAll('.stat span')); el.prompt = el.akhir.querySelector('.prompt');
    el.ulang = h('<div class="vn-ulang"><b>◀◀ MUAT ULANG</b></div>'); lapis.appendChild(el.ulang);
  }
  function dialogAktif(t) {
    if (t >= C.ulang && t < C.dialog[2]) return { i: 0, t0: -1e9 };
    let i = -1, t0 = 9e9; C.dialog.forEach((c, k) => { if (t >= c && (i < 0 || c >= t0)) { i = k; t0 = c; } });
    return { i, t0 };
  }
  function menuState(t) {
    if (t >= C.menu3) return { on: true, kursor: t >= C.satu ? 1 : -1, mati: true, pilih: t >= C.satu ? 1 : -1, tp: C.satu, t0: C.menu3 };
    if (t >= C.menu2) return { on: t < C.pilihB + 0.6, kursor: t >= C.pilihB - 0.35 ? 1 : 0, mati: false, pilih: t >= C.pilihB ? 1 : -1, tp: C.pilihB, t0: C.menu2 };
    if (t >= C.menu1) return { on: t < C.pilihA + 0.6, kursor: 0, mati: false, pilih: t >= C.pilihA ? 0 : -1, tp: C.pilihA, t0: C.menu1 };
    return { on: false };
  }
  function gambar(t) {
    const km = E.out3(P(t, C.mulai, C.mulai + 0.6));
    // tokoh: bicara = cerah & sedikit membesar
    const d = dialogAktif(t), bicara = d.i >= 0 ? DIALOG[d.i][0] : '';
    [['AUDITOR', el.auditor, 0], ['KAMU', el.kamu, 1.7]].forEach(([n, e, ph]) => {
      const aktif = bicara === n, k = E.out3(P(t, C.mulai + (n === 'KAMU' ? 0.15 : 0), C.mulai + 0.6 + (n === 'KAMU' ? 0.15 : 0)));
      e.style.opacity = k * (aktif || !bicara ? 1 : 0.62);
      e.style.transform = `translate(-50%, -100%) translateY(${((1 - k) * 40 + Math.sin(t * 2 + ph) * 3).toFixed(1)}px) scale(${(aktif ? 1.03 : 1).toFixed(3)})`;
    });
    // kotak dialog
    const kb = E.out3(P(t, C.mulai + 0.3, C.mulai + 0.8));
    el.kotak.style.opacity = kb; el.kotak.style.transform = `translateY(${((1 - kb) * 60).toFixed(1)}px)`;
    if (d.i >= 0) {
      const [nm, tx] = DIALOG[d.i], n = Math.min(tx.length, Math.floor((t - d.t0) * 30));
      if (el.nama.textContent !== nm) el.nama.textContent = nm;
      const s = tx.slice(0, n); if (el.teks.textContent !== s) el.teks.textContent = s;
      el.lanjut.style.opacity = n >= tx.length && Math.floor(t * 3) % 2 === 0 ? 1 : 0;
    } else { if (el.teks.textContent !== '') el.teks.textContent = ''; el.lanjut.style.opacity = 0; }
    // menu pilihan
    const m = menuState(t);
    if (m.on) {
      const k = E.outBack(Math.max(0.001, P(t, m.t0, m.t0 + 0.4)));
      el.menu.style.opacity = 1; el.menu.style.transform = `translateX(-50%) scale(${k.toFixed(3)})`;
      el.opsi.forEach((o, i) => {
        const dipilih = m.pilih === i, kp = dipilih ? P(t, m.tp, m.tp + 0.5) : 0;
        o.classList.toggle('aktif', m.kursor === i); o.classList.toggle('pilih', dipilih); o.classList.toggle('mati', !!m.mati && i === 0);
        o.style.transform = `scale(${(1 + 0.06 * Math.sin(Math.PI * kp)).toFixed(3)})`;
      });
      const kc = m.mati && t >= C.satu ? E.out3(P(t, C.satu + 0.2, C.satu + 0.6)) : 0;
      el.catat.style.opacity = kc; el.catat.style.transform = `translateY(${((1 - kc) * 10).toFixed(1)}px)`;
    } else el.menu.style.opacity = 0;
    // spreadsheet & hari
    const sheetOn = t >= C.sheet && t < C.ulang;
    el.sheet.forEach((s, i) => {
      const t0 = C.sheet + i * 0.07, k = sheetOn ? E.outBack(Math.max(0.001, P(t, t0, t0 + 0.35))) : 0;
      s.style.opacity = k > 0.001 ? 1 : 0; s.style.transform = `rotate(var(--r)) scale(${k.toFixed(3)}) translateY(${(Math.sin(t * 5 + i) * 2).toFixed(1)}px)`;
    });
    const hariOn = t >= C.hari && t < C.ulang, nh = 1 + Math.floor(P(t, C.hari, C.hari + 0.9) * 2.999), kh = hariOn ? E.outBack(Math.max(0.001, P(t, C.hari, C.hari + 0.3))) : 0;
    if (el.hari.firstElementChild.textContent !== String(nh)) el.hari.firstElementChild.textContent = String(nh);
    el.hari.style.opacity = kh > 0.001 ? 1 : 0; el.hari.style.transform = `scale(${(kh * (1 + 0.12 * (1 - P(t, C.hari + (nh - 1) * 0.45, C.hari + (nh - 1) * 0.45 + 0.2)))).toFixed(3)})`;
    // kartu item
    const ki = t >= C.item && t < C.baik ? E.outBack(Math.max(0.001, P(t, C.item, C.item + 0.6))) : 0;
    el.item.style.opacity = ki > 0.001 ? 1 : 0; el.item.style.transform = `translateX(-50%) translateY(${((1 - ki) * 60).toFixed(1)}px) scale(${lerp(0.85, 1, ki).toFixed(3)})`;
    // overlay akhir (buruk / baik)
    const buruk = t >= C.buruk && t < C.ulang, baik = t >= C.baik && t < C.tanya2 + 0.3;
    if (buruk || baik) {
      const t0 = buruk ? C.buruk : C.baik, ko = P(t, t0, t0 + 0.3) * (baik ? 1 - P(t, C.tanya2, C.tanya2 + 0.3) : 1);
      el.akhir.classList.toggle('baik', baik); el.akhir.style.opacity = ko;
      const jd = buruk ? 'BAD END' : 'GOOD END', sb = buruk ? 'Temuan: RoPA tidak dapat ditunjukkan*' : 'Tamat — rute Privasimu Nexus';
      if (el.akhirJudul.textContent !== jd) el.akhirJudul.textContent = jd; if (el.akhirSub.textContent !== sb) el.akhirSub.textContent = sb;
      const kj = E.out3(P(t, t0 + 0.1, t0 + 0.6)); el.akhirJudul.style.transform = `scale(${lerp(1.5, 1, kj).toFixed(3)})`; el.akhirJudul.style.opacity = kj;
      el.akhirSub.style.opacity = P(t, t0 + 0.4, t0 + 0.7);
      const st = buruk ? ['Spreadsheet dibuka · 12*', 'Hari berlalu · 3*'] : ['Spreadsheet dibuka · 0*', 'Riwayat perubahan · lengkap'];
      el.stat.forEach((s, i) => { if (s.textContent !== st[i]) s.textContent = st[i]; s.style.opacity = P(t, t0 + 0.6 + i * 0.2, t0 + 0.9 + i * 0.2); });
      el.prompt.style.opacity = buruk && t >= t0 + 1 && Math.floor(t * 2.5) % 2 === 0 ? 1 : 0;
    } else el.akhir.style.opacity = 0;
    // rewind
    const rew = t >= C.ulang && t < C.ulang + 0.55;
    el.ulang.style.opacity = rew ? 1 : 0; el.ulang.style.backgroundPosition = `0 ${(-(t - C.ulang) * 900).toFixed(0)}px`;
    lapis.style.transform = rew ? `translateX(${((hash(Math.floor(t * 30)) - 0.5) * 16).toFixed(1)}px)` : '';
    lapis.style.opacity = (km * (1 - P(t, C.tutup, C.tutup + 0.3))).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '700 30px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, 0, LANTAI); g.addColorStop(0, '#DAD6F4'); g.addColorStop(1, '#C9C4E6');
      cx.fillStyle = g; cx.fillRect(0, 0, W, LANTAI);
      cx.fillStyle = '#B9A78E'; cx.fillRect(0, LANTAI, W, H - LANTAI); cx.fillStyle = '#8E7C64'; cx.fillRect(0, LANTAI, W, 14);
      const jx = V ? 340 : 760, jy = V ? 380 : 130, jw = 400, jh = 420; // jendela
      cx.fillStyle = 'rgba(255,240,200,.35)'; cx.beginPath(); cx.moveTo(jx, jy + jh); cx.lineTo(jx + jw, jy + jh); cx.lineTo(jx + jw + 260, LANTAI); cx.lineTo(jx - 140, LANTAI); cx.closePath(); cx.fill();
      cx.fillStyle = '#F6F1E8'; cx.fillRect(jx - 14, jy - 14, jw + 28, jh + 28);
      cx.fillStyle = '#BFE3F5'; cx.fillRect(jx, jy, jw, jh);
      cx.fillStyle = 'rgba(255,255,255,.55)'; cx.beginPath(); cx.moveTo(jx + 40, jy + jh); cx.lineTo(jx + 180, jy); cx.lineTo(jx + 260, jy); cx.lineTo(jx + 120, jy + jh); cx.closePath(); cx.fill();
      cx.fillStyle = '#F6F1E8'; cx.fillRect(jx + jw / 2 - 7, jy, 14, jh); cx.fillRect(jx, jy + jh / 2 - 7, jw, 14);
      cx.fillStyle = '#2F6F4E'; cx.beginPath(); cx.arc(V ? 120 : 200, LANTAI - 150, 70, 0, Math.PI * 2); cx.fill(); // tanaman
      cx.fillStyle = '#7A5B3A'; cx.fillRect((V ? 120 : 200) - 34, LANTAI - 90, 68, 90);
    },
  });

  KIT.registerType('vn', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0.1);
    (v.dialog || []).forEach(([i, c]) => { C.dialog[i] = sc.start + T(c, 0.5); });
    ['menu1', 'pilihA', 'sheet', 'hari', 'buruk', 'ulang', 'menu2', 'pilihB', 'item', 'baik', 'tanya2', 'menu3', 'satu'].forEach((k) => { if (v[k] != null) C[k] = sc.start + T(v[k], 1); });
    if (v.cta) C.tutup = sc.start;
    if (v.layar && !el.item.querySelector('.pd-layar')) {
      const L = v.layar, wadah = el.item.querySelector('.vi-layar');
      const k = PD.layar(wadah, L.nama, { w: pick(920, 900), potong: L.potong, judul: L.judul });
      k.style.position = 'relative'; k.style.opacity = 1; k.style.borderRadius = '14px';
    }
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
