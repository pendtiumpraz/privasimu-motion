// Gaya GB13 · ORIGAMI: kertas = 4 panel vertikal bersarang; panel ke-i berputar di engsel kirinya (rotateY ±sudut,
// zig-zag) → lipatan akordeon 3D dengan bayangan per panel. Lipatan penuh disilangpudarkan ke pesawat kertas (SVG) yang
// terbang; dibuka lagi; stempel temuan; lipatan kedua disilangpudarkan ke perisai kertas (SVG).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const N = 4, PW = pick(180, 190), PH = pick(760, 900); // lebar panel, tinggi kertas
  const KX = SW / 2 - (N * PW) / 2, KY = pick(120, 380);
  const TEMUAN = [['Pasal 4 · Sub-prosesor', 'izin tertulis belum diatur', 0.29], ['Pasal 7 · Insiden', 'pemberitahuan 3×24 jam belum ada', 0.52], ['Pasal 9 · Transfer', 'mekanisme lintas negara belum disebut', 0.74]];
  const C = { lipat: 9e9, terbang: 9e9, buka: 9e9, temuan: [9e9, 9e9, 9e9], perbaiki: 9e9, perisai: 9e9, tutup: 9e9 };
  let lapis = null, kertas = null, panel = [], pesawat = null, perisai = null, stempel = [], panahEl = [], kilat = null;

  const ISI = `<div class="or-isi"><div class="or-judul">PERJANJIAN PEMROSESAN DATA (DPA)</div>${Array.from({ length: 12 }, (_, i) => `<div class="or-pasal"><b>Pasal ${i + 1}</b>${'<i></i>'.repeat(2 + (i % 3))}</div>`).join('')}<div class="or-ttd"><span>Pihak Pertama</span><em>✍</em><span>Pihak Kedua</span><em>✍</em></div></div>`;
  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('or-lapis');
    kertas = h(`<div class="or-kertas" style="left:${KX}px;top:${KY}px;height:${PH}px"></div>`);
    let parent = kertas;
    for (let i = 0; i < N; i++) {
      const p = h(`<div class="or-panel p${i}" style="width:${PW}px;height:${PH}px;${i ? `left:${PW}px` : 'left:0'}"><div class="or-klip"><div class="or-potong" style="width:${N * PW}px;left:${-i * PW}px">${ISI}</div></div><div class="or-bayang"></div></div>`);
      parent.appendChild(p); panel.push(p); parent = p;
    }
    lapis.appendChild(kertas);
    TEMUAN.forEach(([j, d, fy], i) => { const el = h(`<div class="or-stempel" style="left:${(KX + N * PW * (i % 2 ? 0.62 : 0.05)).toFixed(0)}px;top:${(KY + PH * fy).toFixed(0)}px"><b>${j}</b><span>${d}*</span><i>rekomendasi klausul ✓</i></div>`); lapis.appendChild(el); stempel.push(el); });
    pesawat = h(`<svg class="or-pesawat" viewBox="0 0 200 120"><path d="M2 60 L198 6 L120 116 L96 72 Z"/><path d="M2 60 L96 72 L198 6 Z" class="sayap"/><path d="M96 72 L110 110 L120 116" class="lipat"/></svg>`);
    perisai = h(`<svg class="or-perisai" viewBox="0 0 200 240"><path d="M100 8 L188 40 V120 C188 178 148 214 100 232 C52 214 12 178 12 120 V40 Z"/><path d="M100 8 V232 M12 40 L100 120 L188 40 M12 120 L100 120 L188 120" class="lipat"/><text x="100" y="140">DPA</text></svg>`);
    lapis.appendChild(pesawat); lapis.appendChild(perisai);
    panahEl = [0, 1, 2].map(() => { const el = h('<svg class="or-panah" viewBox="0 0 120 40"><path d="M0 20 H88 M72 6 L92 20 L72 34"/></svg>'); lapis.appendChild(el); return el; });
    kilat = h('<div class="or-kilat"></div>'); lapis.appendChild(kilat);
  }
  function lipatan(f) { // f = 0 terbuka … 1 terlipat penuh
    const sudut = E.io3(f) * 178;
    panel.forEach((p, i) => { if (i === 0) { p.style.transform = ''; return; } p.style.transform = `rotateY(${(i % 2 ? -sudut : sudut).toFixed(2)}deg)`; p.querySelector('.or-bayang').style.opacity = (E.io3(f) * (i % 2 ? 0.45 : 0.25)).toFixed(3); });
  }
  function gambar(t) {
    // fase: lipat (s1) → terbang → buka (s2) → lipat lagi jadi perisai (s3)
    const f1 = P(t, C.lipat, C.lipat + 1.1), fb = P(t, C.buka, C.buka + 1.1), f2 = P(t, C.perisai, C.perisai + 1.1);
    let f = f1; if (t >= C.buka) f = 1 - fb; if (t >= C.perisai) f = f2;
    lipatan(f);
    const tf1 = P(t, C.terbang, C.terbang + 1.4), kembali = P(t, C.buka - 0.9, C.buka);
    const jadiPesawat = f1 >= 1 && t < C.buka;
    kertas.style.opacity = (jadiPesawat || f2 >= 1) ? 0 : 1;
    // pesawat: muncul di posisi kertas terlipat, terbang ke pojok, kembali
    let px = KX + PW / 2, py = KY + PH * 0.35, rot = 0, sk = 1;
    if (tf1 > 0) { const e = E.io3(tf1); px = lerp(KX + PW / 2, SW - 160, e); py = lerp(KY + PH * 0.35, 90, e); rot = lerp(-8, -30, e); sk = lerp(1, 0.6, e); }
    if (kembali > 0) { const e = E.io3(kembali); px = lerp(SW - 160, KX + PW / 2, e); py = lerp(90, KY + PH * 0.35, e); rot = lerp(150, 180, e); sk = lerp(0.6, 1, e); }
    pesawat.style.opacity = jadiPesawat ? 1 : 0;
    pesawat.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) translate(-50%, -50%) rotate(${rot.toFixed(1)}deg) scale(${sk.toFixed(3)})`;
    // stempel temuan
    stempel.forEach((el, i) => { const k = P(t, C.temuan[i], C.temuan[i] + 0.3); el.style.opacity = (k * (1 - f2)).toFixed(3); el.style.transform = `rotate(${(i % 2 ? 3 : -3)}deg) scale(${lerp(1.5, 1, E.out3(k)).toFixed(3)})`; el.classList.toggle('hijau', t >= C.perbaiki); });
    // perisai
    const kp = f2 >= 1 ? E.outBack(Math.max(0.001, P(t, C.perisai + 1.1, C.perisai + 1.5))) : 0;
    perisai.style.opacity = kp > 0 ? 1 : 0;
    // serangan: tiga panah merah menghantam perisai lalu terpental (payoff)
    const PX0 = SW / 2, PY0 = KY + PH * 0.45; let hantam = 0;
    panahEl.forEach((el, i) => {
      const ta = C.perisai + 1.7 + i * 0.3, u = t - ta;
      if (u < 0 || u > 0.9) { el.style.opacity = 0; return; }
      const dy = (i - 1) * 90;
      let x, y, r, o = 1;
      if (u < 0.3) { const e = u / 0.3; x = lerp(SW + 80, PX0 + 190, e); y = PY0 + dy; r = 180; }
      else { const e = (u - 0.3) / 0.6; x = PX0 + 190 + e * 420; y = PY0 + dy - e * 320 - e * e * 200; r = 180 + e * 240; o = 1 - e; hantam = Math.max(hantam, 1 - Math.min(1, e * 4)); }
      el.style.opacity = o.toFixed(3); el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) rotate(${r.toFixed(1)}deg)`;
    });
    kilat.style.opacity = (hantam * 0.9).toFixed(3); kilat.style.transform = `translate(${(PX0 + 150).toFixed(0)}px, ${PY0.toFixed(0)}px) translate(-50%, -50%) scale(${(1 + (1 - hantam) * 1.5).toFixed(2)})`;
    perisai.style.transform = `translate(${(SW / 2).toFixed(0)}px, ${(KY + PH * 0.45).toFixed(0)}px) translate(-50%, -50%) scale(${(kp * (1 + hantam * 0.06)).toFixed(3)}) rotate(${(-hantam * 3).toFixed(1)}deg)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['700 60px Fraunces', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#E8DCC8'); g.addColorStop(1, '#CBB894');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(90,60,20,.06)';
      for (let i = 0; i < 24; i++) cx.fillRect(0, (i / 24) * H + Math.sin(i * 2.1) * 6, W, 3 + (i % 2));
    },
  });

  KIT.registerType('or', (root, v, sc, tm, T) => {
    ensure();
    if (v.lipat != null) C.lipat = sc.start + T(v.lipat, 1.5);
    if (v.terbang != null) C.terbang = sc.start + T(v.terbang, 3.5);
    if (v.buka != null) C.buka = sc.start + T(v.buka, 1);
    if (v.temuan) v.temuan.forEach((c, i) => { C.temuan[i] = sc.start + T(c, 2.5 + i * 0.8); });
    if (v.perbaiki != null) C.perbaiki = sc.start + T(v.perbaiki, 0.8);
    if (v.perisai != null) C.perisai = sc.start + T(v.perisai, 2.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="or-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'naik'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
