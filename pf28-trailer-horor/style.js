// Gaya PF28 · TRAILER HOROR: lapisan lintas scene berisi kartu-kartu teks trailer (jendela waktu), meja gelap dengan
// jendela spreadsheet + tab beranak-pinak, jam & notifikasi, senter (radial gradient) yang menyapu; dentuman = getar
// kamera + kilat putih (hash). "terang" mengganti seluruh mood (kelas body.terang + kanvas latar).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KARTU = ['DI SEBUAH KANTOR…', 'MUSIM INI', 'RoPA YANG<br>TAK PERNAH FINAL', 'KECUALI…'];
  const TAB = ['Sheet1', 'Sheet1 (2)', 'rev', 'rev_final', 'FIX', 'FIX (2)', 'baru', 'baru2', 'jgn dihapus', 'final', 'final_v2', 'FINAL_final', 'v7', 'v7 (1)'];
  const LABEL = ['Impor Dokumen', 'AI membantu mengisi RoPA', 'Kode otomatis ROPA-2026-…', 'Maker → Reviewer → Approver'];
  const C = { kartu: KARTU.map(() => [9e9, 9e9]), senter: 9e9, file: 9e9, tab: 9e9, jam: 9e9, notif: 9e9, terang: 9e9, coret: 9e9, label: [9e9, 9e9, 9e9, 9e9], dentum: [], tutup: 9e9 };
  let lapis = null, kartuEl = [], meja = null, senter = null, fileEl = null, jendela = null, tabEl = [], jam = null, notif = null, kilat = null, coret = null, labelEl = [], namaBaru = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('hr-lapis');
    meja = h(`<div class="hr-meja"><div class="hr-file"><div class="ik">▦</div><div class="nm">RoPA_FINAL_final_v7.xlsx<b class="hr-namabaru">ROPA-IT-2026-002</b></div></div><div class="hr-jendela"><div class="hr-bar"><span></span><span></span><span></span><i>RoPA_FINAL_final_v7.xlsx — 14 tab</i></div><div class="hr-grid"></div><div class="hr-tabs">${TAB.map((t) => `<em>${t}</em>`).join('')}</div></div><div class="hr-jam">03:00</div><div class="hr-notif"><b>Kalender</b>Audit — <span>besok 09:00</span></div></div>`);
    lapis.appendChild(meja);
    fileEl = meja.querySelector('.hr-file'); jendela = meja.querySelector('.hr-jendela'); tabEl = [...meja.querySelectorAll('.hr-tabs em')]; jam = meja.querySelector('.hr-jam'); notif = meja.querySelector('.hr-notif'); namaBaru = meja.querySelector('.hr-namabaru');
    senter = h('<div class="hr-senter"></div>'); lapis.appendChild(senter);
    kartuEl = KARTU.map((k) => { const el = h(`<div class="hr-kartu">${k}</div>`); lapis.appendChild(el); return el; });
    kilat = h('<div class="hr-kilat"></div>'); lapis.appendChild(kilat);
    labelEl = LABEL.map((l) => { const el = h(`<div class="hr-label">${l}</div>`); lapis.appendChild(el); return el; });
    // posisi label di bawah (kolom)
    labelEl.forEach((el, i) => { el.style.left = `${pick(120, 60)}px`; el.style.top = `${pick(150 + i * 78, 250 + i * 84)}px`; });
  }
  function gambar(t) {
    const kedip = hash(Math.floor(t * 18));
    // kartu teks trailer: fade-in lambat + kedip sesekali
    kartuEl.forEach((el, i) => { const [a, b] = C.kartu[i]; const k = P(t, a, a + 0.9) * (1 - P(t, b - 0.2, b)); el.style.opacity = (k * (kedip > 0.92 ? 0.35 : 1)).toFixed(3); el.style.letterSpacing = `${lerp(0.5, 0.18, P(t, a, a + 1.5)).toFixed(3)}em`; });
    // dentuman: getar + kilat
    let g = 0; for (const td of C.dentum) { const u = t - td; if (u >= 0 && u < 0.35) g = Math.max(g, 1 - u / 0.35); }
    lapis.style.transform = g ? `translate(${((hash(Math.floor(t * 40)) - 0.5) * 22 * g).toFixed(1)}px, ${((hash(Math.floor(t * 40) + 3) - 0.5) * 16 * g).toFixed(1)}px)` : '';
    kilat.style.opacity = (g > 0.8 ? (g - 0.8) * 3 : 0).toFixed(3);
    // senter menyapu meja lalu berhenti di file
    const ks = P(t, C.senter, C.senter + 1.6), terang = P(t, C.terang, C.terang + 0.6);
    const fx = pick(560, 540), fy = pick(430, 700);
    const sx = lerp(SW * 0.8, fx, E.io3(ks)) + Math.sin(t * 2.3) * 12 * (1 - ks), sy = lerp(SH * 0.25, fy, E.io3(ks)) + Math.cos(t * 1.7) * 10 * (1 - ks);
    senter.style.opacity = (t >= C.senter ? 1 - terang : 0).toFixed(3);
    senter.style.background = `radial-gradient(circle at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(255,244,214,.38) 0, rgba(255,244,214,.2) 180px, rgba(0,0,0,0) 460px)`;
    meja.style.opacity = (t >= C.senter ? 1 : 0);
    meja.style.filter = terang < 1 ? `brightness(${lerp(0.8, 1, terang).toFixed(2)})` : '';
    // file muncul & bergetar; jendela terbuka; tab beranak-pinak
    const kf = P(t, C.file, C.file + 0.3); fileEl.style.opacity = kf > 0 ? 1 : 0; fileEl.style.transform = `scale(${lerp(1.3, 1, E.out3(kf)).toFixed(3)}) translate(${((hash(Math.floor(t * 30)) - 0.5) * 3 * (1 - terang)).toFixed(1)}px, 0)`;
    const kj = P(t, C.tab, C.tab + 0.4); jendela.style.opacity = kj > 0 ? 1 : 0; jendela.style.transform = `scale(${lerp(0.7, 1, E.outBack(Math.max(0.001, kj))).toFixed(3)})`;
    tabEl.forEach((el, i) => { const k = P(t, C.tab + 0.4 + i * 0.13, C.tab + 0.55 + i * 0.13); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translateY(${((1 - k) * 12).toFixed(1)}px) rotate(${((hash(i) - 0.5) * 3).toFixed(2)}deg)`; });
    jam.style.opacity = t >= C.jam ? (kedip > 0.9 ? 0.4 : 1) * (1 - terang) : 0;
    const kn = P(t, C.notif, C.notif + 0.3); notif.style.opacity = kn > 0 ? (1 - terang) : 0; notif.style.transform = `translateX(${((1 - E.outBack(Math.max(0.001, kn))) * 300).toFixed(1)}px)`;
    // terang: lampu menyala
    document.body.classList.toggle('terang', terang > 0.5);
    const kc = P(t, C.coret, C.coret + 0.5); fileEl.classList.toggle('coret', kc > 0); namaBaru.style.opacity = P(t, C.coret + 0.3, C.coret + 0.6).toFixed(3);
    jendela.style.opacity = t >= C.terang ? (1 - P(t, C.terang, C.terang + 0.5)).toFixed(3) : jendela.style.opacity;
    labelEl.forEach((el, i) => { const k = P(t, C.label[i], C.label[i] + 0.3); el.style.opacity = k > 0 ? 1 : 0; el.style.transform = `translateX(${((1 - E.out3(k)) * -40).toFixed(1)}px)`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Cinzel', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const terang = P(t, C.terang, C.terang + 0.6);
      if (terang > 0) { const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#EAF2FF'); g.addColorStop(1, '#CFE0FA'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); if (terang >= 1) return; cx.fillStyle = `rgba(0,0,0,${(1 - terang).toFixed(2)})`; cx.fillRect(0, 0, W, H); return; }
      cx.fillStyle = '#050507'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.6); g.addColorStop(0, 'rgba(40,30,45,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('hr', (root, v, sc, tm, T) => {
    ensure();
    (v.kartu || []).forEach(([i, a, b]) => { C.kartu[i] = [sc.start + T(a, 0.2), sc.start + T(b, 3)]; });
    if (v.senter != null) C.senter = sc.start + T(v.senter, 2);
    if (v.file != null) C.file = sc.start + T(v.file, 4);
    if (v.tab != null) C.tab = sc.start + T(v.tab, 2.5);
    if (v.jam != null) C.jam = sc.start + T(v.jam, 4);
    if (v.notif != null) C.notif = sc.start + T(v.notif, 5);
    if (v.terang != null) C.terang = sc.start + T(v.terang, 1.5);
    if (v.coret != null) C.coret = sc.start + T(v.coret, 2.5);
    if (v.label) v.label.forEach((c, i) => { C.label[i] = sc.start + T(c, 3 + i * 0.7); });
    (v.dentum || []).forEach((c) => C.dentum.push(sc.start + T(c, 0.2)));
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1000, 960), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(760, 60)}px`; el.style.top = `${pick(560, 720)}px`;
      const t0 = T(L.at, 3);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
