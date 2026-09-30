// Gaya UI12 · POHON FOLDER: jendela penjelajah di lapisan lintas scene. Tingkat folder dibuka dari cue global (kursor
// bergerak ke baris lalu "klik"); breadcrumb menyusul; daftar berkas muncul berurutan; kotak cari diketik per huruf;
// seret-lepas = seluruh baris terpilih meluncur ke panel Nexus, progres per berkas terisi, lalu kartu asli.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const TINGKAT = ['Shared Drive', 'Kepatuhan', 'Baru', 'Baru (2)', 'FIX banget', 'FINAL_beneran'];
  const BERKAS = [['📊', 'RoPA_final.xlsx'], ['📊', 'RoPA_final_v2.xlsx'], ['📊', 'RoPA_FINAL_fix.xlsx'], ['📊', 'RoPA_FINAL_fix (1).xlsx'], ['📄', 'kontrak_pihak_ketiga_2019.pdf'], ['📝', 'formulir_consent_lama.docx'], ['📁', 'scan_ktp_karyawan/']];
  const CARI = 'RoPA final';
  const C = { buka: TINGKAT.map(() => 9e9), berkas: 9e9, peringatan: 9e9, cari: 9e9, hasil: 9e9, pilih: 9e9, seret: 9e9, impor: 9e9, tutup: 9e9 };
  let lapis = null, win = null, pohon = [], crumb = null, baris = [], kursor = null, cariEl = null, hasilEl = null, nexus = null, progres = [], peringatanEl = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('pf-lapis');
    win = h(`<div class="pf-win"><div class="pf-bar"><span class="d r"></span><span class="d k"></span><span class="d h"></span><div class="pf-crumb"></div><div class="pf-cari"><i>🔍</i><span class="q"></span><b class="n"></b></div></div><div class="pf-body"><div class="pf-pohon">${TINGKAT.map((n, i) => `<div class="pf-node n${i}" style="padding-left:${18 + i * 34}px"><i class="seg">▸</i><i class="ik">📁</i><span>${esc(n)}</span></div>`).join('')}</div><div class="pf-list"><div class="pf-kosong">Pilih folder…</div>${BERKAS.map(([ik, n], i) => `<div class="pf-file f${i}"><i>${ik}</i><span>${esc(n)}</span><em>${i === 6 ? '⚠ data pribadi spesifik?' : ['12 KB', '14 KB', '14 KB', '15 KB', '2,1 MB', '48 KB'][i] + '*'}</em></div>`).join('')}</div></div></div>`);
    lapis.appendChild(win);
    pohon = [...win.querySelectorAll('.pf-node')]; crumb = win.querySelector('.pf-crumb'); baris = [...win.querySelectorAll('.pf-file')];
    cariEl = win.querySelector('.pf-cari .q'); hasilEl = win.querySelector('.pf-cari .n'); peringatanEl = baris[6];
    nexus = h(`<div class="pf-nexus"><div class="nx-kop"><img src="${PD.LOGO}" alt=""><span>Impor Dokumen</span></div><div class="nx-drop">Lepas berkas di sini</div>${BERKAS.map(([ik, n]) => `<div class="nx-row"><span>${esc(n)}</span><i><b></b></i><em>✓</em></div>`).join('')}</div>`);
    lapis.appendChild(nexus); progres = [...nexus.querySelectorAll('.nx-row')];
    kursor = h('<div class="pf-kursor"><svg viewBox="0 0 24 24"><path d="M4 2 L20 12 L12 13 L9 21 Z"/></svg><i class="klik"></i></div>'); lapis.appendChild(kursor);
  }
  function posNode(i) { const r = pohon[i].getBoundingClientRect(), w = lapis.getBoundingClientRect(), sc = SW / w.width; return [(r.left - w.left) * sc + 40, (r.top - w.top) * sc + r.height * sc / 2]; }
  function gambar(t) {
    // pohon: tingkat i terbuka pada C.buka[i]; kursor menuju node berikutnya lalu klik
    let terbuka = -1; TINGKAT.forEach((_, i) => { if (t >= C.buka[i]) terbuka = i; });
    pohon.forEach((n, i) => { const k = P(t, C.buka[i] - 0.35, C.buka[i]); n.style.opacity = i === 0 || t >= C.buka[i - 1] - 0.3 ? 1 : 0; n.classList.toggle('aktif', i === terbuka); n.querySelector('.seg').style.transform = `rotate(${t >= C.buka[i] ? 90 : 0}deg)`; n.querySelector('.ik').textContent = t >= C.buka[i] ? '📂' : '📁'; });
    crumb.innerHTML = t >= C.seret + 0.6 ? '<b>Nexus</b> › RoPA' : TINGKAT.slice(0, Math.max(1, terbuka + 1)).map((n, i) => (i === terbuka ? `<b>${esc(n)}</b>` : esc(n))).join(' › ');
    // kursor: menuju node yang akan diklik
    let kx = pick(300, 200), ky = pick(700, 1300), klik = 0;
    const berikut = TINGKAT.findIndex((_, i) => t < C.buka[i]);
    if (terbuka >= 0 && berikut > 0 && berikut < TINGKAT.length && t >= C.buka[berikut] - 0.6) { const a = posNode(berikut - 1), b = posNode(berikut); const e = E.io3(P(t, C.buka[berikut] - 0.6, C.buka[berikut] - 0.08)); kx = lerp(a[0], b[0], e) + 16; ky = lerp(a[1], b[1], e) + 10; klik = t >= C.buka[berikut] - 0.1 ? 1 - P(t, C.buka[berikut] - 0.1, C.buka[berikut] + 0.25) : 0; }
    else if (terbuka >= 0 && berikut === -1 && t < C.seret) { const a = posNode(TINGKAT.length - 1); kx = a[0] + 16; ky = a[1] + 10; }
    if (t >= C.seret) { const e = E.io3(P(t, C.seret, C.seret + 0.9)); const a = posNode(TINGKAT.length - 1); kx = lerp(a[0] + 420, pick(1560, 540), e); ky = lerp(a[1], pick(420, 1180), e); }
    kursor.style.transform = `translate(${kx.toFixed(1)}px, ${ky.toFixed(1)}px)`; kursor.style.opacity = terbuka >= 0 && t < C.impor ? 1 : 0;
    kursor.querySelector('.klik').style.transform = `scale(${(1 + (1 - klik) * 1.6).toFixed(2)})`; kursor.querySelector('.klik').style.opacity = klik.toFixed(2);
    // daftar berkas
    win.querySelector('.pf-kosong').style.opacity = t >= C.berkas ? 0 : 1;
    const kd = E.io3(P(t, C.seret, C.seret + 0.9));
    baris.forEach((b, i) => { const k = P(t, C.berkas + i * 0.18, C.berkas + i * 0.18 + 0.25); b.style.opacity = (k * (1 - P(t, C.seret + 0.7, C.seret + 0.9))).toFixed(3); b.classList.toggle('pilih', t >= C.pilih); b.classList.toggle('cocok', t >= C.cari + CARI.length * 0.07 && i < 4 && t < C.pilih); b.style.transform = `translate(${(kd * (pick(700, 0))).toFixed(1)}px, ${(kd * (pick(-60, 620) - i * 44)).toFixed(1)}px) scale(${lerp(1, 0.7, kd).toFixed(3)})`; });
    peringatanEl.classList.toggle('bahaya', t >= C.peringatan);
    const nc = Math.floor(cl((t - C.cari) / 0.07, 0, CARI.length)); cariEl.textContent = t >= C.cari ? CARI.slice(0, nc) + (nc < CARI.length && Math.floor(t * 4) % 2 ? '|' : '') : ''; hasilEl.textContent = t >= C.hasil ? '7 hasil*' : '';
    // panel nexus
    const kn = E.out3(P(t, C.seret - 0.3, C.seret + 0.3)) * (V ? 1 - P(t, C.impor + 2.9, C.impor + 3.3) : 1); nexus.style.opacity = kn.toFixed(3); // di 9:16 panel memberi tempat untuk kartu register nexus.style.transform = `translate(${((1 - kn) * 200).toFixed(1)}px, 0)`;
    nexus.classList.toggle('terima', t >= C.seret + 0.9);
    progres.forEach((r, i) => { const k = P(t, C.impor + i * 0.28, C.impor + i * 0.28 + 0.7); r.style.opacity = t >= C.seret + 0.9 ? 1 : 0; r.querySelector('b').style.width = `${(k * 100).toFixed(1)}%`; r.classList.toggle('ok', k >= 1); });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Inter', '500 40px "JetBrains Mono"'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#DCE6F2'); g.addColorStop(1, '#B9C9DD');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('pf', (root, v, sc, tm, T) => {
    ensure();
    (v.buka || []).forEach(([i, c], n) => { C.buka[i] = sc.start + T(c, 0.5 + n * 0.8); });
    if (v.berkas != null) C.berkas = sc.start + T(v.berkas, 1);
    if (v.peringatan != null) C.peringatan = sc.start + T(v.peringatan, 3);
    if (v.cari != null) C.cari = sc.start + T(v.cari, 4);
    if (v.hasil != null) C.hasil = sc.start + T(v.hasil, 5);
    if (v.pilih != null) C.pilih = sc.start + T(v.pilih, 0.3);
    if (v.seret != null) C.seret = sc.start + T(v.seret, 0.6);
    if (v.impor != null) C.impor = sc.start + T(v.impor, 2);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(900, 940), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(80, (SW - el._w) / 2)}px`; el.style.top = `${pick(560, 1180)}px`;
      const t0 = T(L.at, 4);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
