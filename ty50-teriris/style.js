// Gaya TY50 · TEKS TERIRIS: blok kalimat di lapisan lintas scene; 4 salinan, masing-masing dipotong clip-path inset
// menjadi pita horizontal dan digeser translateX (label divisi ikut bergeser). Saat cue "satu", offset → 0.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const KALIMAT = V ? 'KAMI TAHU<br>DATA APA,<br>DI MANA,<br>UNTUK APA.' : 'KAMI TAHU DATA APA,<br>DI MANA, UNTUK APA.';
  const DIVISI = ['LEGAL', 'IT', 'CS', 'MARKETING'];
  const OFF = V ? [-96, 70, -54, 110] : [-110, 80, -60, 120];
  const MODUL = ['RoPA', 'Consent', 'DSR', 'Insiden'];
  const C = { mulai: 9e9, divisi: [9e9, 9e9, 9e9, 9e9], satu: 9e9, modul: [9e9, 9e9, 9e9, 9e9], tutup: 9e9 };
  let lapis = null, blok = null, irisan = [], tags = [], pil = [], pilWrap = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('sl-lapis');
    blok = h('<div class="sl-blok"></div>'); lapis.appendChild(blok);
    const PITA = V ? [15, 30, 27, 28] : [22, 30, 26, 22]; // tinggi pita (%) sengaja tak rata supaya irisan jatuh di tengah huruf
    let acc = 0;
    DIVISI.forEach((d, i) => {
      const a = acc, b = 100 - (acc + PITA[i]); acc += PITA[i];
      const el = h(`<div class="sl-irisan" data-bebas="1" style="clip-path:inset(calc(${a}% + 1px) -400px calc(${b}% + 1px) -400px)"><div class="sl-teks">${KALIMAT}</div><div class="sl-tag" style="top:${(a + PITA[i] / 2).toFixed(1)}%">${d}</div></div>`);
      blok.appendChild(el); irisan.push(el); tags.push(el.querySelector('.sl-tag'));
    });
    pilWrap = h(`<div class="sl-pil">${MODUL.map((m) => `<span>${m}</span>`).join('')}</div>`);
    lapis.appendChild(pilWrap); pil = [...pilWrap.querySelectorAll('span')];
  }
  function gambar(t) {
    const masuk = E.out3(P(t, C.mulai, C.mulai + 0.5));
    const satu = E.io3(P(t, C.satu, C.satu + 0.9));
    blok.style.opacity = masuk.toFixed(3);
    blok.style.transform = `scale(${lerp(1.12, 1, masuk).toFixed(3)})`;
    irisan.forEach((el, i) => {
      const nyala = P(t, C.divisi[i], C.divisi[i] + 0.12) * (1 - P(t, C.divisi[i] + 0.7, C.divisi[i] + 1.1));
      const goyang = Math.sin(t * 1.4 + i * 1.9) * (V ? 8 : 12) * (1 - satu);
      const x = OFF[i] * (1 - satu) + goyang + nyala * (i % 2 ? 26 : -26);
      el.style.transform = `translateX(${x.toFixed(1)}px)`;
      tags[i].style.transform = `translateX(${(-x).toFixed(1)}px)`; // label diam di tepi layar
      el.style.filter = nyala > 0 ? `brightness(${(1 + nyala * 0.9).toFixed(2)})` : '';
      tags[i].style.opacity = (masuk * (1 - satu) * (0.55 + 0.45 * nyala)).toFixed(3);
      tags[i].style.background = nyala > 0.5 ? '#FFD166' : '';
      tags[i].style.color = nyala > 0.5 ? '#111' : '';
    });
    blok.classList.toggle('utuh', t >= C.satu + 0.8);
    pil.forEach((p, i) => { const pk = P(t, C.modul[i], C.modul[i] + 0.3), k = pk > 0 ? E.outBack(pk) : 0; p.style.opacity = k > 0 ? 1 : 0; p.style.transform = `scale(${Math.max(0.01, k).toFixed(3)})`; });
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Archivo Black"', '700 60px "Space Grotesk"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#0E1116'; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(255,255,255,.05)'; cx.lineWidth = 1;
      for (let y = 0; y < H; y += 40) { cx.beginPath(); cx.moveTo(0, y + 0.5); cx.lineTo(W, y + 0.5); cx.stroke(); }
    },
  });

  KIT.registerType('sl', (root, v, sc, tm, T) => {
    ensure();
    if (v.mulai != null) C.mulai = sc.start + T(v.mulai, 0);
    if (v.divisi) v.divisi.forEach((c, i) => { C.divisi[i] = sc.start + T(c, 0.5 + i * 1.1); });
    if (v.satu != null) C.satu = sc.start + T(v.satu, 1.2);
    if (v.modul) v.modul.forEach((c, i) => { C.modul[i] = sc.start + T(c, 2.5 + i * 0.5); });
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
