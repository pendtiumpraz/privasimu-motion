// Gaya TY13 · MARQUEE BRUTALIST: tujuh pita di lapisan lintas scene. Posisi pita = kecepatan × jarak tempuh s(t);
// s(t) linear lalu melambat mulus sampai berhenti (fungsi murni waktu). Setelah berhenti, kata sasaran terdekat ke
// tengah tiap pita disorot, diberi kotak centang, lalu cap modul.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KEWAJIBAN = [['CATAT PEMROSESAN', 'RoPA'], ['NILAI RISIKO', 'DPIA'], ['JAWAB PERMOHONAN', 'DSR'], ['LAPOR INSIDEN 3×24 JAM', 'INSIDEN'],
    ['KELOLA PERSETUJUAN', 'CONSENT'], ['NILAI PIHAK KETIGA', 'PIHAK KETIGA'], ['CATAT TRANSFER', 'TRANSFER']];
  const N = KEWAJIBAN.length, RH = pick(SH, 1440) / N, F = pick(112, 74); // di 9:16 pita berhenti di y 1440, sisanya untuk pita teks
  const C = { stop: 9e9, kotak: 9e9, cap: KEWAJIBAN.map(() => 9e9), tutup: 9e9 };
  const D = 1.3; // lama pengereman
  let lapis = null, rows = [];

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('mq-lapis');
    rows = KEWAJIBAN.map(([kw, mod], i) => {
      const arah = i % 2 ? 1 : -1, v = (420 + hash(i * 3.3) * 260) * arah;
      const el = h(`<div class="mq-row ${i % 2 ? 'b' : 'a'}" data-bebas style="top:${i * RH}px;height:${RH}px;font-size:${F}px"><div class="mq-track"></div></div>`);
      lapis.appendChild(el);
      const track = $('.mq-track', el);
      // urutan kata di pita dimulai dari kewajiban baris ini supaya tiap baris berbeda
      const urut = KEWAJIBAN.map((_, j) => KEWAJIBAN[(i + j) % N][0]);
      const satuan = urut.map((k) => `<span class="w ${k === kw ? 'kw' : ''}">${esc(k)}</span><span class="dot">★</span>`).join('');
      track.innerHTML = satuan + satuan + satuan;
      return { el, track, v, i, kw, mod, w1: 0, awal: hash(i * 9.1 + 2) * 2000, sorot: null, kotak: null, cap: null };
    });
  }
  // jarak tempuh: linear, lalu rem mulus sampai berhenti pada C.stop + D
  function jarak(t) {
    if (t <= C.stop) return t;
    const dt = Math.min(t - C.stop, D);
    return C.stop + dt - dt * dt / (2 * D);
  }
  function siapkanSorot(r, x) {
    if (r.sorot) return;
    // kata sasaran yang pusatnya paling dekat ke tengah layar setelah berhenti
    const kws = [...r.track.querySelectorAll('.kw')];
    let best = null, bd = 1e9;
    for (const k of kws) { const cx = k.offsetLeft + k.offsetWidth / 2 + x; const d = Math.abs(cx - SW / 2); if (d < bd) { bd = d; best = k; } }
    r.sorot = best;
    r.kotak = h('<i class="mq-kotak"><b></b></i>');
    best.insertBefore(r.kotak, best.firstChild);
    r.cap = h(`<em class="mq-cap">${esc(r.mod)}</em>`);
    best.appendChild(r.cap);
  }
  function gambar(t) {
    const s = jarak(t);
    rows.forEach((r) => {
      if (!r.w1) {
        r.w1 = r.track.scrollWidth / 3 || 1;
        // titik awal dipilih supaya saat berhenti, kata sasaran (salinan kedua) tepat di tengah layar
        const kw = r.track.querySelectorAll('.kw')[1], kwc = kw.offsetLeft + kw.offsetWidth / 2;
        const sEnd = C.stop < 9e8 ? C.stop + D / 2 : 0;
        r.awal = -((SW / 2 - kwc) + r.v * sEnd);
      }
      let x = -(r.awal + r.v * s);
      x = ((x % r.w1) + r.w1) % r.w1 - r.w1; // selalu mulai di kiri (0 … -w1)
      r.track.style.transform = `translateX(${x.toFixed(2)}px)`;
      const berhenti = t >= C.stop + D;
      if (berhenti && !r.sorot) siapkanSorot(r, x);
      r.el.classList.toggle('redup', berhenti && t >= C.kotak);
      if (r.sorot) {
        const kk = P(t, C.kotak + r.i * 0.06, C.kotak + r.i * 0.06 + 0.3);
        r.sorot.classList.toggle('on', kk > 0);
        r.kotak.style.transform = `scale(${E.outBack(kk).toFixed(3)})`;
        const kc = P(t, C.cap[r.i], C.cap[r.i] + 0.28);
        r.kotak.classList.toggle('cek', kc > 0);
        tf(r.cap, { s: kc > 0 ? lerp(1.9, 1, E.outExpo(kc)) : 0, r: -6 + hash(r.i) * 12, o: kc > 0 ? 1 : 0 });
      }
    });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['900 100px Archivo', '700 60px Archivo'],
    bg: (cx, t, id, th, W, H) => { cx.fillStyle = '#0A0A0A'; cx.fillRect(0, 0, W, H); },
  });

  KIT.registerType('mq', (root, v, sc, tm, T) => {
    ensure();
    if (v.stop != null) C.stop = sc.start + T(v.stop, 1);
    if (v.kotak != null) C.kotak = sc.start + T(v.kotak, 2.5);
    (v.cap || []).forEach((c, i) => { C.cap[i] = sc.start + T(c, 1 + i * 0.6); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="mq-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'hantam'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
