// Gaya GB20 · VENN: tiga lingkaran (div bulat, mix-blend multiply) di lapisan lintas scene. Posisi = pusat + arah×jarak;
// jarak: masuk dari luar layar → jarak Venn normal → melebar (tarik) → 0 (berpusat sama). Label irisan dihitung dari
// posisi lingkaran tiap frame. Antrean kerja & kartu AI di scene 3.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const R = pick(330, 300), CX = SW / 2, CY = pick(500, 700), D0 = R * 0.56;
  const LING = [['Legal', '#2F6FD1', -90], ['IT', '#1FA971', 150], ['Bisnis', '#F2892A', 30]];
  const TUGAS = [['DPIA sistem baru', 0, 1], ['akses data pelanggan', 1, 2], ['kontrak pihak ketiga', 0, 2]];
  const C = { masuk: [9e9, 9e9, 9e9], tengah: 9e9, tugas: [9e9, 9e9, 9e9], tarik: 9e9, tumpuk: 9e9, pusat: 9e9, antrean: 9e9, tutup: 9e9 };
  let lapis = null, ling = [], nama = [], tengah = null, tugasEl = [], hitung = null, antrean = null, satu = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('vn-lapis');
    ling = LING.map(([n, w]) => { const el = h(`<div class="vn-ling" style="width:${R * 2}px;height:${R * 2}px;background:${w}"></div>`); lapis.appendChild(el); return el; });
    nama = LING.map(([n, w]) => { const el = h(`<div class="vn-nama" style="color:${w}">${n}</div>`); lapis.appendChild(el); return el; });
    tengah = h('<div class="vn-tengah"><b>KAMU</b><span>DPO</span></div>'); lapis.appendChild(tengah);
    tugasEl = TUGAS.map(([t]) => { const el = h(`<div class="vn-tugas">${t}</div>`); lapis.appendChild(el); return el; });
    hitung = h('<div class="vn-hitung"><b>0</b><span>tugas menumpuk*</span></div>'); lapis.appendChild(hitung);
    antrean = h(`<div class="vn-antrean"><div class="ah">ANTREAN KERJA<i>*ilustrasi</i></div>${['DPIA sistem baru · menunggu telaah', 'Akses data pelanggan · minta dasar hukum', 'Kontrak pihak ketiga · klausul DPA'].map((t) => `<div class="ai"><em></em>${t}</div>`).join('')}</div>`);
    lapis.appendChild(antrean);
    satu = h('<div class="vn-satu"><b>SATU RUANG KERJA</b><span>Privasimu Nexus</span></div>'); lapis.appendChild(satu);
  }
  function posisi(t) {
    const kp = E.io3(P(t, C.pusat, C.pusat + 1.1));
    const tarik = E.io3(P(t, C.tarik, C.tarik + 1.2)) * (1 - kp);
    return LING.map(([, , deg], i) => {
      const a = deg * Math.PI / 180, masuk = E.out3(P(t, C.masuk[i], C.masuk[i] + 0.8));
      const jauh = lerp(R * 3.2, D0, masuk) + tarik * R * 0.5;
      const d = lerp(jauh, 0, kp);
      return [CX + Math.cos(a) * d, CY + Math.sin(a) * d, masuk];
    });
  }
  function gambar(t) {
    const pos = posisi(t), kp = E.io3(P(t, C.pusat, C.pusat + 1.1));
    pos.forEach(([x, y, m], i) => { ling[i].style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${lerp(1, i === 0 ? 1.12 : 0.98, kp).toFixed(3)})`; ling[i].style.opacity = (m > 0 ? 0.82 : 0) * (i === 0 ? 1 : 1 - kp); if (i === 0) { ling[i].style.background = kp > 0.5 ? '#0B1B4D' : LING[0][1]; ling[i].style.mixBlendMode = kp > 0.5 ? 'normal' : 'multiply'; ling[i].style.opacity = m > 0 ? lerp(0.82, 1, kp).toFixed(3) : 0; }
      const a = LING[i][2] * Math.PI / 180, nx = x + Math.cos(a) * R * 0.62, ny = y + Math.sin(a) * R * 0.62; nama[i].style.transform = `translate(${nx.toFixed(1)}px, ${ny.toFixed(1)}px) translate(-50%, -50%)`; nama[i].style.opacity = (m >= 1 ? 1 : 0) * (1 - kp); });
    // irisan tengah = centroid
    const cx = (pos[0][0] + pos[1][0] + pos[2][0]) / 3, cy = (pos[0][1] + pos[1][1] + pos[2][1]) / 3;
    const kt = E.outBack(Math.max(0.001, P(t, C.tengah, C.tengah + 0.5))), tarik = P(t, C.tarik, C.tarik + 1.2);
    tengah.style.opacity = t >= C.tengah ? (1 - kp) : 0;
    tengah.style.transform = `translate(${cx.toFixed(1)}px, ${cy.toFixed(1)}px) translate(-50%, -50%) scale(${(kt * lerp(1, 0.6, tarik)).toFixed(3)})`;
    tengah.classList.toggle('terjepit', tarik > 0.5 && kp < 1);
    // label tugas di titik tengah pasangan
    TUGAS.forEach(([, a, b], i) => { const el = tugasEl[i], k = P(t, C.tugas[i], C.tugas[i] + 0.3); const mx = (pos[a][0] + pos[b][0]) / 2, my = (pos[a][1] + pos[b][1]) / 2; el.style.opacity = (k * (1 - kp)).toFixed(3); el.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px) translate(-50%, -50%) scale(${lerp(1.4, 1, E.out3(k)).toFixed(3)})`; });
    const n = Math.round(lerp(0, 14, E.out3(P(t, C.tumpuk, C.tumpuk + 1.2))));
    hitung.querySelector('b').textContent = String(n); hitung.style.opacity = t >= C.tumpuk ? (1 - kp) : 0;
    hitung.style.transform = `translate(${cx.toFixed(1)}px, ${(cy + 110).toFixed(1)}px) translate(-50%, -50%)`;
    const ka = E.out3(P(t, C.antrean, C.antrean + 0.5));
    antrean.style.opacity = ka.toFixed(3); antrean.style.transform = `translateY(${((1 - ka) * 40).toFixed(1)}px)`;
    antrean.querySelectorAll('.ai').forEach((el, i) => el.classList.toggle('on', t >= C.antrean + 0.4 + i * 0.35));
    const ks = E.outBack(Math.max(0.001, P(t, C.pusat + 1.0, C.pusat + 1.4)));
    satu.style.opacity = t >= C.pusat + 1.0 ? 1 : 0; satu.style.transform = `translate(${CX}px, ${(CY + pick(0, -190)).toFixed(0)}px) translate(-50%, -50%) scale(${ks.toFixed(3)})`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 60px Inter', '700 40px Inter'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#FBF8F2'; cx.fillRect(0, 0, W, H);
      cx.fillStyle = 'rgba(0,0,0,.05)';
      for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y += 40) cx.fillRect(x, y, 2, 2);
    },
  });

  KIT.registerType('vn', (root, v, sc, tm, T) => {
    ensure();
    if (v.masuk) v.masuk.forEach((c, i) => { C.masuk[i] = sc.start + T(c, 0.5 + i * 0.7); });
    if (v.tengah != null) C.tengah = sc.start + T(v.tengah, 3.5);
    if (v.tugas) v.tugas.forEach((c, i) => { C.tugas[i] = sc.start + T(c, 1 + i); });
    if (v.tarik != null) C.tarik = sc.start + T(v.tarik, 4);
    if (v.tumpuk != null) C.tumpuk = sc.start + T(v.tumpuk, 5);
    if (v.pusat != null) C.pusat = sc.start + T(v.pusat, 1);
    if (v.antrean != null) C.antrean = sc.start + T(v.antrean, 3);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.layar) {
      const L = v.layar, el = PD.layar(root, L.nama, { w: pick(560, 700), potong: L.potong, judul: L.judul });
      el.style.left = `${pick(1180, (SW - el._w) / 2)}px`; el.style.top = `${pick(280, 1080)}px`;
      const t0 = T(L.at, 4);
      parts.push((lt, d) => { const k = E.out3(P(lt, t0, t0 + 0.5)); el.style.opacity = k.toFixed(3); el.style.transform = `translateY(${((1 - k) * 50).toFixed(1)}px)`; });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
