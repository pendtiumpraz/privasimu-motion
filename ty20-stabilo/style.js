// Gaya TY20 · STABILO: panel obrolan (kiri/atas) + kertas pasal (kanan/bawah) di lapisan lintas scene. Sapuan stabilo =
// background-size <mark> dari 0% → 100% pada waktu cue, dengan sedikit kemiringan supaya terasa tangan.
(function () {
  const { V, SW, SH, h, esc, rich, $, pick } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const C = { coret: 9e9, priva: 9e9, kertas: 9e9, sorot: [9e9, 9e9, 9e9], sunting: 9e9, tutup: 9e9 };
  let lapis = null, chat = null, jwbSalah = null, stempel = null, jwbPriva = null, kertas = null, marks = [], temuan = null, kursor = null;

  function ensure() {
    if (lapis) return;
    lapis = PD.lapis('st-lapis');
    const CW = pick(760, 940);
    chat = h(`<div class="st-chat" style="width:${CW}px;left:${pick(90, (SW - CW) / 2)}px;top:${pick(110, 220)}px">
      <div class="st-b u">Batas pemberitahuan kebocoran data berapa lama?</div>
      <div class="st-b a salah"><span class="ai">AI kreatif</span><span class="tx">Kira-kira seminggu, mungkin? 🤷</span><i class="coret"></i></div>
      <div class="st-b a priva"><span class="ai">Priva · Privasimu Nexus</span><span class="tx">Paling lambat <b>3 × 24 jam</b>, secara tertulis, kepada subjek data dan lembaga. <u>UU PDP Pasal 46 ayat (1)</u></span><em class="kb">dari knowledge base</em></div>
    </div>`);
    lapis.appendChild(chat);
    jwbSalah = $('.salah', chat); jwbPriva = $('.priva', chat);
    stempel = h('<div class="st-stempel">MENGARANG</div>');
    jwbSalah.appendChild(stempel);
    const KW = pick(900, 940);
    kertas = h(`<div class="st-kertas" style="width:${KW}px;left:${pick(930, (SW - KW) / 2)}px;top:${pick(120, 860)}px">
      <div class="st-kop">UNDANG-UNDANG NOMOR 27 TAHUN 2022 · PELINDUNGAN DATA PRIBADI</div>
      <div class="st-pasal">Pasal 46</div>
      <p>(1) Dalam hal terjadi kegagalan Pelindungan Data Pribadi, Pengendali Data Pribadi wajib menyampaikan pemberitahuan <mark class="m1">secara tertulis</mark> <mark class="m0">paling lambat 3 x 24 (tiga kali dua puluh empat) jam</mark> kepada <mark class="m2">Subjek Data Pribadi dan lembaga</mark>.</p>
      <div class="st-sumber">knowledge base regulasi · kutipan verbatim</div>
    </div>`);
    lapis.appendChild(kertas);
    marks = [$('.m0', kertas), $('.m1', kertas), $('.m2', kertas)];
    temuan = h(`<div class="st-temuan" style="width:${KW}px;left:${pick(930, (SW - KW) / 2)}px;top:${pick(120, 860)}px">
      <div class="th"><span>Telaah Kebijakan · Bab 4 · Insiden</span><i class="pensil">✎ disunting konsultan</i></div>
      <div class="tr"><b>Temuan</b><span>Prosedur belum menyebut batas pemberitahuan 3 × 24 jam (UU PDP Pasal 46).</span></div>
      <div class="tr"><b>Rekomendasi</b><span class="edit">Tambahkan tenggat 3 × 24 jam dan format pemberitahuan tertulis<i class="kursor"></i></span></div>
    </div>`);
    lapis.appendChild(temuan);
    kursor = $('.kursor', temuan);
  }
  function gambar(t) {
    const kc = E.out3(P(t, C.coret, C.coret + 0.35));
    $('.coret', jwbSalah).style.transform = `scaleX(${kc.toFixed(3)})`;
    jwbSalah.style.opacity = t >= C.priva ? 0.45 : 1;
    const ks = P(t, C.coret + 0.25, C.coret + 0.45);
    tf(stempel, { s: ks > 0 ? lerp(1.8, 1, E.outExpo(ks)) : 0, r: -10, o: ks > 0 ? 1 : 0 });
    const kp = E.outBack(P(t, C.priva, C.priva + 0.5));
    tf(jwbPriva, { y: (1 - cl(kp)) * 40, s: 0.9 + 0.1 * kp, o: cl(kp * 2) });
    const kk = E.out3(P(t, C.kertas, C.kertas + 0.6)), ksu = E.io3(P(t, C.sunting, C.sunting + 0.6));
    tf(kertas, { y: (1 - kk) * 60, o: kk * (1 - ksu), r: -1.2 });
    marks.forEach((m, i) => { const k = E.out3(P(t, C.sorot[i], C.sorot[i] + 0.55)); m.style.backgroundSize = `${(k * 100).toFixed(1)}% 100%`; });
    tf(temuan, { y: (1 - ksu) * 60, o: ksu, r: 0 });
    kursor.style.opacity = t >= C.sunting && Math.floor(t * 2.4) % 2 === 0 ? 1 : 0;
    // di 9:16 obrolan bergeser ke atas saat kertas masuk supaya tidak bertumpuk
    if (V) chat.style.transform = `translateY(${(-E.io3(P(t, C.kertas, C.kertas + 0.6)) * 120).toFixed(1)}px)`;
    lapis.style.opacity = (1 - P(t, C.tutup, C.tutup + 0.3)).toFixed(3);
  }

  KIT.style({
    fonts: ['400 60px "Source Serif 4"', '600 60px "Source Serif 4"', 'italic 400 60px "Source Serif 4"'],
    bg: (cx, t, id, th, W, H) => {
      cx.fillStyle = '#F1EDE4'; cx.fillRect(0, 0, W, H);
      cx.strokeStyle = 'rgba(11,27,77,.07)'; cx.lineWidth = 2;
      cx.beginPath();
      for (let y = 40; y < H; y += 56) { cx.moveTo(0, y); cx.lineTo(W, y); }
      cx.stroke();
    },
  });

  KIT.registerType('st', (root, v, sc, tm, T) => {
    ensure();
    if (v.coret != null) C.coret = sc.start + T(v.coret, 2);
    if (v.privaAt != null) C.priva = sc.start + T(v.privaAt, 0.3);
    if (v.kertasAt != null) C.kertas = sc.start + T(v.kertasAt, 0.3);
    (v.sorot || []).forEach((c, i) => { C.sorot[i] = sc.start + T(c, 2 + i); });
    if (v.suntingAt != null) C.sunting = sc.start + T(v.suntingAt, 0.5);
    if (v.cta) C.tutup = sc.start;
    const parts = [];
    if (v.teks) {
      const el = h(`<div class="st-teks">${rich(v.teks)}</div>`);
      root.appendChild(el);
      const ws = PD.kata(el, sc);
      parts.push((lt, d) => { PD.tampil(ws, lt, 'pudar'); el.style.opacity = 1 - P(lt, d - 0.25, d - 0.02); });
    }
    if (v.cta) parts.push(PD.cta(root, v.cta, T));
    return (lt, d) => { gambar(sc.start + lt); parts.forEach((f) => f(lt, d)); };
  });
})();
