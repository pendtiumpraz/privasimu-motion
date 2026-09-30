// Gaya TY06 · TERMINAL: satu jendela terminal di lapisan lintas scene; baris keluaran ditambahkan tiap scene dengan
// waktu global; baris 'ketik' muncul per karakter, baris lain muncul utuh. Kursor blok berkedip di baris terakhir aktif.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const BARIS = []; // { el, t, ketik, huruf[] }
  let lapis = null, term = null, isi = null, kursor = null, TUTUP = 9e9;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('tr-lapis');
    const W0 = pick(1560, 1000), H0 = pick(900, 1180);
    term = h(`<div class="tr-jendela" style="width:${W0}px;height:${H0}px;left:${(SW - W0) / 2}px;top:${pick(90, 300)}px"><div class="tr-bar"><i></i><i></i><i></i><span>data-discovery — bash</span></div><div class="tr-isi"></div><div class="tr-scan"></div></div>`);
    lapis.appendChild(term);
    isi = $('.tr-isi', term);
    kursor = h('<span class="tr-kursor"></span>');
  }
  function tambah(teks, t, kelas) {
    const el = h(`<div class="tr-b ${kelas || ''}"></div>`);
    if (kelas === 'ketik') { [...teks].forEach((ch) => el.appendChild(h(`<span class="c">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`))); }
    else el.textContent = teks;
    isi.appendChild(el);
    BARIS.push({ el, t, ketik: kelas === 'ketik', huruf: kelas === 'ketik' ? [...el.children] : null, kelas });
  }
  function gambar(t) {
    let akhir = null;
    for (const b of BARIS) {
      if (t < b.t) { b.el.style.display = 'none'; continue; }
      b.el.style.display = 'block';
      if (b.ketik) { const m = Math.min(b.huruf.length, Math.floor((t - b.t) / 0.055) + 1); b.huruf.forEach((c, j) => { c.style.visibility = j < m ? 'visible' : 'hidden'; }); }
      akhir = b;
    }
    // kursor setelah baris terakhir yang tampil
    if (akhir) { akhir.el.appendChild(kursor); kursor.style.opacity = Math.floor(t * 2.6) % 2 === 0 ? 1 : 0.15; }
    // gulir otomatis bila isi melebihi jendela
    const lebih = isi.scrollHeight - isi.clientHeight;
    isi.style.transform = `translateY(${(-Math.max(0, lebih)).toFixed(0)}px)`;
    $('.tr-scan', term).style.backgroundPositionY = ((t * 40) % 8).toFixed(1) + 'px';
    lapis.style.opacity = (1 - P(t, TUTUP, TUTUP + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['500 30px "IBM Plex Mono"', '700 30px "IBM Plex Mono"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0B0F14'; cx.fillRect(0, 0, W, H);
      const g = cx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      g.addColorStop(0, 'rgba(60,220,140,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    },
  });

  KIT.registerType('tr', (root, v, sc, tm, T) => {
    ensure();
    for (const [teks, at, kelas] of v.baris || []) tambah(teks, sc.start + T(at, 0.3), kelas);
    if (v.cta) TUTUP = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="tr-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
