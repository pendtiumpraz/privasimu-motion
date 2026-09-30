// Gaya GB45 · EXPLODED: panggung 3D (perspective) berisi grup isometrik (rotateX·rotateZ) dengan tiga panel yang
// digeser di sumbu Z sejauh d(t) (0 = menumpuk, 1 = terurai). Ubin skor "56" = panel atas saat menumpuk. Label 2D di
// samping mengikuti ketinggian panel (dihitung dari d). Lapis terlemah berdenyut; "satu" menyatukan kembali.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const LAPIS = [
    { nama: 'Response Layer', skor: 38, bobot: '20%', ket: 'Breach · DSR · Maturity', warna: '#F59E0B' },
    { nama: 'Process Layer', skor: 80, bobot: '30%', ket: 'RoPA · DPIA · RTP · Pihak Ketiga · CBDT', warna: '#7C3AED' },
    { nama: 'Data Layer', skor: 49, bobot: '50%', ket: 'discovery · klasifikasi · proteksi', warna: '#2F80ED' },
  ]; // urutan atas → bawah
  const C = { muncul: 9e9, urai: 9e9, sorot: [9e9, 9e9, 9e9], lemah: 9e9, satu: 9e9, prioritas: 9e9, tutup: 9e9 };
  let lapis = null, panggung = null, panel = [], label = [], skor = null, prior = null;
  const PX = pick(700, 540), PY = pick(560, 760), JARAK = pick(150, 170);

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('ex-lapis');
    panggung = h(`<div class="ex-panggung" style="left:${PX}px;top:${PY}px"><div class="ex-iso">${LAPIS.map((l, i) => `<div class="ex-panel p${i}" style="--w:${l.warna}"><div class="ex-grid"></div><b>${l.skor}</b><span>${l.nama}</span></div>`).join('')}<div class="ex-skor"><b>56</b><span>Cukup</span><i>skor agregat 0–100 · 3 layer</i></div></div></div>`);
    lapis.appendChild(panggung);
    panel = [...panggung.querySelectorAll('.ex-panel')]; skor = panggung.querySelector('.ex-skor');
    label = LAPIS.map((l, i) => { const el = h(`<div class="ex-label" style="--w:${l.warna}"><i></i><div class="in"><b>${l.nama}</b><em>${l.bobot}</em><span>${l.ket}</span><u>${l.skor}</u></div></div>`); lapis.appendChild(el); return el; });
    prior = h('<div class="ex-prior">prioritas perbaikan: <b>Response Layer</b> · 38</div>'); lapis.appendChild(prior);
  }
  function gambar(t) {
    const km = E.outBack(Math.max(0.001, P(t, C.muncul, C.muncul + 0.6)));
    const d = E.io3(P(t, C.urai, C.urai + 1.1)) * (1 - E.io3(P(t, C.satu, C.satu + 0.9)));
    panggung.style.opacity = t >= C.muncul ? 1 : 0;
    panggung.style.transform = `scale(${km.toFixed(3)})`;
    panel.forEach((el, i) => {
      const z = (1 - i) * JARAK * d; // atas +, bawah −
      const si = P(t, C.sorot[2 - i], C.sorot[2 - i] + 0.3); // urutan sebut: data(2), proses(1), respons(0)
      el.style.transform = `translateZ(${z.toFixed(1)}px)`;
      el.classList.toggle('nyala', si > 0);
      el.classList.toggle('lemah', i === 0 && t >= C.lemah && d > 0.2 && Math.floor(t * 4) % 2 === 0);
      el.style.opacity = d > 0.02 ? 1 : (i === 2 ? 1 : 0.0);
    });
    skor.style.opacity = (1 - P(d, 0.05, 0.3)).toFixed(3);
    // label 2D: ketinggian mengikuti panel (proyeksi kasar: z → −z·0.62 px di layar)
    label.forEach((el, i) => {
      const z = (1 - i) * JARAK * d, y = PY - z * 0.62 + (V ? 0 : 0), si = P(t, C.sorot[2 - i], C.sorot[2 - i] + 0.3);
      el.style.opacity = (d * si).toFixed(3);
      el.style.transform = `translate(${pick(1120, 60)}px, ${(V ? PY + 380 + i * 120 : y).toFixed(1)}px) translate(0, -50%)`;
      el.classList.toggle('lemah', i === 0 && t >= C.lemah);
    });
    const kp = P(t, C.prioritas, C.prioritas + 0.3);
    prior.style.opacity = kp > 0 ? 1 : 0; prior.style.transform = `translate(-50%, 0) scale(${lerp(1.3, 1, E.out3(kp)).toFixed(3)})`;
    panggung.style.opacity = (t >= C.muncul ? 1 : 0) * (1 - P(t, C.satu + 0.9, C.satu + 1.3));
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '700 60px "Space Grotesk"'],
    bg: (cx, t, id, th, W, H) => {
      const g = cx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#E9EEF6'); g.addColorStop(1, '#C9D4E5');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(20,40,80,.08)'; cx.lineWidth = 1;
      for (let x = -H; x < W + H; x += 60) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x + H * 0.58, H); cx.stroke(); cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x - H * 0.58, H); cx.stroke(); }
    },
  });

  KIT.registerType('ex', (root, v, sc, tm, T) => {
    ensure();
    if (v.muncul != null) C.muncul = sc.start + T(v.muncul, 0.1);
    if (v.urai != null) C.urai = sc.start + T(v.urai, 2.5);
    if (v.sorot) v.sorot.forEach((c, i) => { C.sorot[i] = sc.start + T(c, 0.5 + i * 1.5); });
    if (v.lemah != null) C.lemah = sc.start + T(v.lemah, 5);
    if (v.satu != null) C.satu = sc.start + T(v.satu, 0.5);
    if (v.prioritas != null) C.prioritas = sc.start + T(v.prioritas, 4.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(1180, 980), potong: L.potong, judul: L.judul });
      el.style.left = `${(SW - el._w) / 2}px`; el.style.top = `${pick(330, 660)}px`;
      const t0 = T(L.at, 1.5);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.6)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 60).toFixed(1)}px) scale(${lerp(0.9, 1, k).toFixed(3)})`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
