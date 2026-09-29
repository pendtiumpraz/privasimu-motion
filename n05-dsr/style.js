// Gaya khas N05 · "Tolong hapus data saya" — meme chat-app pastel.
// Latar pastel ber-blob, transisi gelembung, tipe scene kustom: inbox (s1), rights (s2), dsr (s3), flowai (s4), discovery (s5).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick, splitWords, revealWords, float } = KIT;
  const { P, cl, lerp, E, hash, tf } = MG;
  const outQuint = (k) => 1 - Math.pow(1 - k, 5);
  const place = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };
  // pop memantul (0 sebelum mulai)
  const popK = (lt, t0, dur = 0.45) => { const k = P(lt, t0, t0 + dur); return k <= 0 ? 0 : E.outBack(k); };
  // squash & stretch kecil setelah mendarat
  function squash(lt, t0, amt = 0.1) {
    const k = P(lt, t0, t0 + 0.55);
    if (k <= 0 || k >= 1) return [1, 1];
    const w = Math.sin(k * Math.PI * 3) * (1 - k) * amt;
    return [1 + w, 1 - w];
  }
  // posisi tengah lazy (ukuran baru ada setelah scene tampil)
  function centerAt(el, cx, cy) {
    if (!el._c && el.offsetWidth) el._c = [el.offsetWidth, el.offsetHeight];
    if (el._c) place(el, cx - el._c[0] / 2, cy - el._c[1] / 2);
  }
  // hujan emoji singkat (deterministik)
  function rain(root, { n = 22, emoji = ['👀'], t0 = 0, span = 0.8, fall = 1.5, size = [70, 130], seed = 1 }) {
    const box = h('<div class="n5-rain"></div>');
    root.appendChild(box);
    const ps = Array.from({ length: n }, (_, i) => {
      const el = document.createElement('span');
      el.textContent = emoji[i % emoji.length];
      const s = lerp(size[0], size[1], hash(i * 3.1 + seed));
      el.style.fontSize = s + 'px';
      box.appendChild(el);
      return { el, s, x: ((i * 0.618034 + hash(seed * 9.1)) % 1) * (SW + 100) - 50, t: t0 + hash(i * 41.3 + seed * 17.7 + 5) * span, f: fall * lerp(0.8, 1.25, hash(i * 2.7 + seed)), r: (hash(i * 5.5 + seed) - 0.5) * 60, sp: (hash(i * 4.1 + seed) - 0.5) * 240 };
    });
    return (lt) => ps.forEach((p) => {
      const k = (lt - p.t) / p.f;
      if (k < 0 || k > 1) { p.el.style.opacity = 0; return; }
      const y = lerp(-p.s * 1.4, SH + p.s * 0.4, k * k * 0.55 + k * 0.45);
      p.el.style.opacity = 1;
      p.el.style.transform = `translate(${p.x + Math.sin(k * 6 + p.r) * 30}px, ${y}px) rotate(${p.r + p.sp * k}deg)`;
    });
  }
  // confetti kecil (kertas warna pastel), meledak dari satu titik
  const CONF = ['#7C5CFF', '#FF7EB6', '#FFD45C', '#1FB57E', '#FF8A65', '#6FB7FF', '#A48CFF'];
  function confetti(root, { n = 46, x = SW / 2, y = SH / 2, t0 = 0, power = 1, seed = 3 }) {
    const box = h('<div class="n5-conf"></div>');
    root.appendChild(box);
    const ps = Array.from({ length: n }, (_, i) => {
      const el = document.createElement('i');
      const w = 12 + hash(i * 2.3 + seed) * 14, hh = hash(i * 1.1 + seed) < 0.4 ? w : w * 0.5;
      Object.assign(el.style, { width: w + 'px', height: hh + 'px', background: CONF[i % CONF.length], borderRadius: hash(i + seed) < 0.3 ? '50%' : '3px' });
      box.appendChild(el);
      const a = -Math.PI / 2 + (hash(i * 3.7 + seed) - 0.5) * Math.PI * 1.35, v = (620 + hash(i * 5.3 + seed) * 760) * power;
      return { el, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: hash(i * 7.1 + seed) * 360, vr: (hash(i * 8.3 + seed) - 0.5) * 900, d: 0.03 + hash(i * 9.9 + seed) * 0.1 };
    });
    return (lt) => ps.forEach((p) => {
      const t = lt - t0 - p.d;
      if (t < 0 || t > 1.6) { p.el.style.opacity = 0; return; }
      const drag = (1 - Math.exp(-2.6 * t)) / 2.6; // hambatan udara
      const ox = typeof x === 'function' ? x() : x, oy = typeof y === 'function' ? y() : y;
      const px = ox + p.vx * drag, py = oy + p.vy * drag + 900 * t * t * 0.5;
      p.el.style.opacity = t > 1.2 ? 1 - (t - 1.2) / 0.4 : 1;
      p.el.style.transform = `translate(${px}px, ${py}px) rotate(${p.r + p.vr * t}deg) scaleX(${Math.cos(t * 9 + p.r)})`;
    });
  }
  // ketik teks (dengan kursor kedip opsional)
  function typeInto(el, text, t0, t1, lt, caret = true) {
    const n = Math.round(text.length * cl((lt - t0) / Math.max(0.01, t1 - t0)));
    const on = caret && lt >= t0 - 0.2 && (lt < t1 + 0.4 ? true : Math.floor(lt * 2.5) % 2 === 0) && lt < t1 + 1.2;
    const s = text.slice(0, n) + (on ? '▏' : '');
    if (el._s !== s) { el.textContent = s; el._s = s; }
  }
  // kilat putih lokal
  function flashAt(root) {
    const el = h('<div class="n5-flash"></div>');
    root.appendChild(el);
    return (lt, ts, amt = 0.65, dur = 0.28) => { let o = 0; ts.forEach((t) => { if (lt >= t && lt < t + dur) o = Math.max(o, amt * (1 - (lt - t) / dur)); }); el.style.opacity = o; };
  }
  const H = { popK, squash, centerAt, rain, confetti, typeInto, flashAt, place, outQuint };
  document.body.insertAdjacentHTML('beforeend', '<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">📅✅🙏💜</div>');
  KIT.N5 = H;

  // ================= tambalan caption 9:16 (akali lib/captions.js) =================
  // lib/captions.js belum mengubah "tujuh puluh dua" -> "72" sehingga baris terpotong "...dua / jam...".
  // Ditambal di halaman sebelum boot: angka digabung, dan satuan "jam" ditarik ke baris angkanya. (.srt tidak terpengaruh.)
  const CAP_NUM = [[['tujuh', 'puluh', 'dua'], '72']];
  function patchCaptions(TL) {
    const nm = (x) => x.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    Object.values((TL && TL.captions) || {}).forEach((lines) => {
      lines.forEach((l) => CAP_NUM.forEach(([seq, rep]) => {
        for (let i = 0; i + seq.length <= l.words.length; i++) {
          if (!seq.every((w, k) => nm(l.words[i + k].text) === w)) continue;
          const last = l.words[i + seq.length - 1].text, pn = /[.,?!:]$/.test(last) ? last.slice(-1) : '';
          l.words.splice(i, seq.length, { text: rep + pn, t: l.words[i].t });
        }
      }));
      for (let i = 0; i < lines.length - 1; i++) {
        const a = lines[i], b = lines[i + 1], la = a.words[a.words.length - 1];
        if (/^\d+$/.test(la.text) && b.words.length > 1 && nm(b.words[0].text) === 'jam') {
          a.words.push(b.words.shift());
          b.start = +(b.words[0].t - 0.08).toFixed(3);
          a.end = +(b.start - 0.02).toFixed(3);
        }
      }
    });
  }
  const run0 = KIT.run;
  KIT.run = (prv) => { try { patchCaptions(window.TIMELINE); } catch (e) { /* caption asli tetap dipakai */ } return run0(prv); };

  // ================= latar pastel =================
  const PAL = {
    lav: { a: '#ECE6FF', b: '#FAF7FF', blobs: ['#D6CBFF', '#FFE0CF', '#D2F4E6', '#FFD5E8', '#D2E4FF'] },
    mint: { a: '#DBF6EA', b: '#F4FFFA', blobs: ['#C3EFDC', '#E6E0FF', '#FFE2D2', '#CFEAFF', '#FFF2C6'] },
    peach: { a: '#FFE6D8', b: '#FFF7F0', blobs: ['#FFD2BC', '#E6E0FF', '#D2F4E6', '#FFD5E8', '#FFF0C0'] },
  };
  const BL = Array.from({ length: 5 }, (_, i) => ({ x: [0.12, 0.85, 0.3, 0.72, 0.5][i], y: [0.2, 0.25, 0.85, 0.78, 0.5][i], r: 0.34 + hash(i + 9.9) * 0.16, sp: 0.14 + hash(i + 4.4) * 0.14, ph: hash(i + 1.3) * 6.28 }));
  const DOOD = Array.from({ length: 30 }, (_, i) => ({ x: hash(i * 3.3 + 1), y: hash(i * 5.1 + 2), s: 12 + hash(i * 7.7 + 3) * 18, k: i % 4, v: 10 + hash(i * 1.7 + 5) * 18, r: hash(i + 6) * 6.28 }));
  function doodle(cx, k, s) {
    cx.beginPath();
    if (k === 0) { cx.arc(0, 0, s * 0.6, 0, Math.PI * 2); cx.stroke(); }
    else if (k === 1) { cx.moveTo(-s * 0.6, 0); cx.lineTo(s * 0.6, 0); cx.moveTo(0, -s * 0.6); cx.lineTo(0, s * 0.6); cx.stroke(); }
    else if (k === 2) { // kilau 4 sudut
      for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4, r = j % 2 ? s * 0.22 : s * 0.75; cx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      cx.closePath(); cx.fill();
    } else { // gelembung chat mini
      const w = s * 1.5, hh = s * 1.05;
      cx.roundRect(-w / 2, -hh / 2, w, hh, hh * 0.45); cx.moveTo(-w * 0.25, hh / 2); cx.lineTo(-w * 0.38, hh * 0.85); cx.lineTo(-w * 0.05, hh / 2); cx.stroke();
    }
  }
  function bg(cx, t, id, theme, W, Hh) {
    const p = PAL[theme] || PAL.lav;
    const g = cx.createLinearGradient(0, 0, W * 0.5, Hh);
    g.addColorStop(0, p.a); g.addColorStop(1, p.b);
    cx.fillStyle = g; cx.fillRect(0, 0, W, Hh);
    const M = Math.max(W, Hh);
    BL.forEach((b, i) => {
      const x = (b.x + Math.sin(t * b.sp + b.ph) * 0.14) * W, y = (b.y + Math.cos(t * b.sp * 0.8 + b.ph) * 0.12) * Hh, r = b.r * M;
      const rg = cx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, p.blobs[i] + 'F0'); rg.addColorStop(0.5, p.blobs[i] + '70'); rg.addColorStop(1, p.blobs[i] + '00');
      cx.fillStyle = rg; cx.fillRect(0, 0, W, Hh);
    });
    cx.lineWidth = 3; cx.lineCap = 'round'; cx.strokeStyle = 'rgba(255,255,255,.8)'; cx.fillStyle = 'rgba(255,255,255,.75)';
    DOOD.forEach((d) => {
      const span = Hh + 160, x = d.x * W + Math.sin(t * 0.5 + d.r) * 18, y = ((d.y * span - t * d.v) % span + span) % span - 80;
      cx.save(); cx.translate(x, y); cx.rotate(d.r + t * 0.25); cx.globalAlpha = 0.55 + 0.35 * Math.sin(t * 1.3 + d.r * 3);
      doodle(cx, d.k, d.s); cx.restore();
    });
    cx.globalAlpha = 1;
  }

  // ================= transisi gelembung antar-scene =================
  const ORDER = PRV.SCENES.map((s) => s.id);
  // [asal tutup, asal buka] (0..1 dari layar)
  const WIPES = [[[0.08, 0.92], [0.92, 0.08]], [[0.95, 0.5], [0.05, 0.5]], [[0.5, 1.05], [0.5, -0.05]], [[0.05, 0.1], [0.95, 0.9]], [[0.5, 0.5], [0.5, 0.5]]];
  const WCOL = ['#C9BAFF', '#FFD0BC', '#FBF9FF'];
  let wipe = null;
  const farR = (o) => Math.max(...[[0, 0], [SW, 0], [0, SH], [SW, SH]].map(([x, y]) => Math.hypot(x - o[0] * SW, y - o[1] * SH))) + 24;
  function drawWipe(id, lt, d) {
    if (!wipe) { wipe = h(`<div class="n5-wipe">${WCOL.map((c) => `<i style="background:${c}"></i>`).join('')}</div>`); $('#stage').insertBefore(wipe, $('#grain')); }
    const idx = ORDER.indexOf(id);
    const kc = idx < ORDER.length - 1 ? P(lt, d - 0.36, d - 0.02) : 0; // menutup: lingkaran berlapis tumbuh
    const kr = idx > 0 ? P(lt, 0, 0.46) : 1; // membuka: lubang berlapis membesar (iris)
    [...wipe.children].forEach((c, j) => {
      if (kc > 0) {
        const o = WIPES[idx][0], R = farR(o), r = R * E.io3(P(kc, j * 0.15, j * 0.15 + 0.7));
        if (r < 1) { c.style.display = 'none'; return; }
        Object.assign(c.style, { display: 'block', borderRadius: '50%', width: 2 * r + 'px', height: 2 * r + 'px', left: o[0] * SW - r + 'px', top: o[1] * SH - r + 'px', maskImage: 'none', webkitMaskImage: 'none' });
      } else if (kr < 1) {
        const o = WIPES[idx - 1][1], R = farR(o), lag = (2 - j) * 0.13, r = R * E.out3(P(kr, lag, lag + 0.74));
        if (r >= R) { c.style.display = 'none'; return; }
        const m = `radial-gradient(circle at ${(o[0] * SW).toFixed(1)}px ${(o[1] * SH).toFixed(1)}px, transparent ${r.toFixed(1)}px, #000 ${(r + 1.5).toFixed(1)}px)`;
        Object.assign(c.style, { display: 'block', borderRadius: '0', width: SW + 'px', height: SH + 'px', left: '0px', top: '0px', maskImage: m, webkitMaskImage: m });
      } else c.style.display = 'none';
    });
  }

  // ================= S6: CTA gelembung chat + kontak =================
  let cta = null;
  function ctaExtras(lt, d, sec) {
    if (!cta) {
      const lines = sec.querySelectorAll('.k-cta-lines .cl');
      const ch = h(`<div class="n5-ctas"><span>📅 Schedule Demo</span><span>✅ Start Pre Check <small>gratis</small></span></div>`);
      sec.insertBefore(ch, sec.querySelector('.k-fade'));
      cta = { lines, ch, btn: sec.querySelector('.k-btn'), foot: sec.querySelector('.k-foot') };
      cta.rx = h('<div class="n5-reac cta"><span>🙏</span><span>💜</span></div>');
      if (lines[1]) lines[1].appendChild(cta.rx);
      cta.ch.style.top = pick(842, 1290) + 'px';
      if (cta.foot) cta.foot.style.top = pick(930, 1370) + 'px';
      sec.querySelector('.k-cta-lines').style.top = pick(372, 660) + 'px';
      cta.btn.style.top = pick(690, 1140) + 'px';
    }
    const t1 = MG.wt('s6', 'Setiap', 2.4) - 0.12, t2 = MG.wt('s6', 'dijawab', 3.6) - 0.12, tb = MG.wt('s6', 'privasimu#2', 5.6);
    const k1 = popK(lt, t1, 0.5), k2 = popK(lt, t2, 0.5);
    if (cta.lines[0]) tf(cta.lines[0], { s: k1, x: pick(-70, -36), y: float(lt, 0, 4), o: cl(k1 * 3) });
    if (cta.lines[1]) { const [sx, sy] = squash(lt, t2 + 0.3, 0.06); tf(cta.lines[1], { sx: k2 * sx, sy: k2 * sy, x: pick(70, 36), y: float(lt, 1, 4), o: cl(k2 * 3) }); }
    const kc = E.out3(P(lt, tb + 0.35, tb + 0.8));
    tf(cta.ch, { y: (1 - kc) * 24, o: kc });
    const kx = popK(lt, MG.wt('s6', 'waktu', 4.35) + 0.4, 0.4);
    tf(cta.rx, { s: kx, r: (1 - kx) * -25 - 4, o: cl(kx * 3) });
  }

  KIT.style({
    fonts: ['600 20px Nunito', '700 20px Nunito', '800 20px Nunito', '900 20px Nunito'],
    themes: {
      lav: ['#ECE6FF', '#FAF7FF', '#F1EDFF', 'rgba(124,92,255,.08)', 'rgba(255,255,255,.95)'],
      mint: ['#DBF6EA', '#F4FFFA', '#EAFBF3', 'rgba(31,181,126,.08)', 'rgba(255,255,255,.95)'],
      peach: ['#FFE6D8', '#FFF7F0', '#FFF0E7', 'rgba(255,138,101,.08)', 'rgba(255,255,255,.95)'],
    },
    bg,
    frame: (id, lt, d, sec) => {
      drawWipe(id, lt, d);
      if (id === 's6') ctaExtras(lt, d, sec);
    },
  });

  // ================= S1: kotak masuk -> gelembung -> meme "Nobody:" =================
  KIT.registerType('inbox', (root, v, sc, tm, T) => {
    const tNew = T(v.newAt, 0.7), tOpen = T(v.openAt, 1.6), tW = v.words.map((w, i) => T(w, 1.9 + i * 0.3)), tRead = T(v.readAt, 2.9);
    const tMeme = T(v.memeAt, 3.1), tL1 = T(v.l1At, 3.2), tL2 = T(v.l2At, 3.4), tEyes = T(v.eyesAt, 3.8), tAv = T(v.avAt, 4.4), tQ = T(v.qAt, 5.0);
    const RH = pick(160, 168), WW = pick(1280, 960), WX = (SW - WW) / 2, WY = pick(178, 380), NR = 4;
    const cam = h('<div class="n5-cam"></div>');
    root.appendChild(cam);
    const win = h(`<div class="n5-mail" style="left:${WX}px;top:${WY}px;width:${WW}px">
      <div class="bar"><div class="ic">📬</div><div class="ttl">Kotak Masuk</div><div class="cnt">1</div><div class="srch">🔍 Cari email</div></div>
      <div class="list" style="height:${NR * RH}px"></div></div>`);
    cam.appendChild(win);
    const list = $('.list', win), cnt = $('.cnt', win);
    const row = (r, cls) => {
      const el = h(`<div class="n5-row ${cls}" style="height:${RH}px"><div class="av" style="background:${r.col}">${esc(r.av)}</div>
        <div class="mid"><div class="fr">${esc(r.fr)}${r.flag ? `<span class="flag">${esc(r.flag)}</span>` : ''}</div><div class="sj">${esc(r.sj)}</div><div class="pv">${esc(r.pv)}</div></div>
        ${r.dot ? '<div class="dot"></div>' : ''}<div class="tm">${esc(r.tm)}</div>${r.dot ? '<div class="glow"></div>' : ''}</div>`);
      list.appendChild(el);
      return el;
    };
    const olds = v.rows.map((r) => row(r, 'read'));
    const nw = row(v.mail, 'new');
    const toast = h(`<div class="n5-toast"><b>📩</b>1 email baru masuk</div>`);
    root.appendChild(toast);
    // gelembung besar
    const m = v.mail;
    const bub = h(`<div class="n5-bub" style="max-width:${pick(1320, 960)}px"><div class="who"><div class="av">${esc(m.av)}</div>${esc(m.fr)}<span class="tag">Pelanggan</span></div>
      <div class="tx">Halo, ${v.quote.map((w) => `<span class="n5-hw"><i></i><b>${esc(w)}</b></span>`).join(' ')} 🙏</div>
      <div class="meta">${esc(m.tm)}<span class="tk">✓✓</span> <span class="rd"></span></div></div>`);
    root.appendChild(bub);
    const marks = [...bub.querySelectorAll('.n5-hw i')], tk = $('.tk', bub), rd = $('.rd', bub);
    // meme
    const rainU = rain(root, { n: 24, emoji: ['👀'], t0: tEyes + 0.05, span: 1.0, fall: 1.35, size: pick([80, 150], [90, 160]), seed: 5 });
    const meme = h(`<div class="n5-meme" style="width:${pick(1280, 960)}px;left:${(SW - pick(1280, 960)) / 2}px">
      <div class="hd"><div class="av">🤭</div><b>meme kantor</b> · barusan</div>
      <div class="l1">${rich(v.l1)}</div><div class="l2">${rich(v.l2)}</div><div class="eyes">👀</div>
      <div class="avs">${v.team.map((a) => `<div class="n5-av2"><div class="c" style="background:${a.bg}">${a.e}</div><div class="lb">${esc(a.lb)}</div><div class="q">?</div></div>`).join('')}</div>
      <div class="n5-reac"><span>😂</span><span>👀</span><span>😱</span><b>99+</b></div><div class="n5-reac r"><span>💬</span><b>0 balasan</b></div></div>`);
    root.appendChild(meme);
    const l1W = splitWords($('.l1', meme)), l2W = splitWords($('.l2', meme)), eyes = $('.eyes', meme), avs = [...meme.querySelectorAll('.n5-av2')];
    const reacs = [...meme.querySelectorAll('.n5-reac')], tRc = T(v.reacAt, tQ + 0.15);
    const flash = flashAt(root);
    const st = {};
    return (lt, d) => {
      // jendela masuk
      const kw = popK(lt, 0, 0.55);
      tf(win, { s: 0.86 + 0.14 * kw, y: (1 - kw) * 60, o: cl(kw * 2) });
      // email baru menyelip di atas
      const ks = E.outBack(P(lt, tNew, tNew + 0.42));
      olds.forEach((el, i) => { el.style.top = (i + Math.max(0, ks)) * RH + 'px'; });
      const kn = P(lt, tNew + 0.04, tNew + 0.46);
      nw.style.top = '0px';
      tf(nw, { x: (1 - E.outBack(kn)) * -90, o: kn > 0 ? cl(kn * 3) : 0, s: 1 });
      $('.glow', nw).style.opacity = lt > tNew ? 0.55 + 0.45 * Math.sin((lt - tNew) * 8) : 0;
      cnt.textContent = lt >= tNew ? '1' : '0';
      tf(cnt, { s: lt >= tNew ? 1 + 0.5 * (1 - E.out3(P(lt, tNew, tNew + 0.35))) : 0.001, o: lt >= tNew ? 1 : 0 });
      // toast
      const kt = popK(lt, tNew + 0.02, 0.4), kto = E.in3(P(lt, tOpen - 0.3, tOpen));
      centerAt(toast, SW / 2, pick(124, 280));
      tf(toast, { y: (1 - kt) * -40 - kto * 40, s: 0.7 + 0.3 * kt, o: cl(kt * 2) * (1 - kto) });
      // zoom kamera ke baris email
      if (!st.cy && nw.offsetHeight) st.cy = WY + 124 + RH / 2;
      const cy = st.cy || WY + 190, cxr = SW / 2;
      const kz = E.io3(P(lt, tOpen - 0.4, tOpen + 0.15)), kz2 = P(lt, tOpen + 0.15, tMeme);
      const z = 1 + kz * pick(0.32, 0.26) + kz2 * 0.05;
      const ty = (pick(SH * 0.38, SH * 0.3) - cy) * kz;
      const kout = E.in3(P(lt, tMeme - 0.08, tMeme + 0.22));
      cam.style.transformOrigin = `${cxr}px ${cy}px`;
      cam.style.transform = `translate(0px, ${ty - kout * SH * 1.1}px) scale(${z})`;
      const kbl = E.out3(P(lt, tOpen, tOpen + 0.4));
      cam.style.filter = kbl > 0.02 || kout > 0 ? `blur(${(kbl * 6 + kout * 12).toFixed(1)}px)` : 'none';
      cam.style.opacity = 1 - kbl * 0.35;
      // gelembung "Tolong hapus data saya"
      const kb = P(lt, tOpen, tOpen + 0.5), kbo = E.in3(P(lt, tMeme - 0.08, tMeme + 0.2));
      centerAt(bub, SW / 2, pick(500, 780));
      const bs = kb <= 0 ? 0 : E.outBack(kb);
      const [sx, sy] = squash(lt, tOpen + 0.35, 0.06);
      tf(bub, { sx: (0.25 + 0.75 * bs) * sx, sy: (0.25 + 0.75 * bs) * sy, y: (1 - E.out3(kb)) * (cy - pick(500, 780)) + float(lt, 0, 5) - kbo * SH * 1.1, o: cl(kb * 4), blur: kbo * 12 });
      marks.forEach((mk, i) => { mk.style.transform = `scaleX(${E.out3(P(lt, tW[i] - 0.02, tW[i] + 0.22))})`; });
      const read = lt >= tRead;
      tk.style.color = read ? 'var(--tick)' : '#B9B4D6';
      rd.textContent = read ? 'Dibaca' : '';
      rd.style.color = 'var(--tick)';
      // meme
      const km = P(lt, tMeme - 0.02, tMeme + 0.5);
      centerAt(meme, SW / 2, pick(SH / 2, 800));
      if (meme._c) meme.style.left = (SW - meme._c[0]) / 2 + 'px';
      tf(meme, { y: (1 - (km <= 0 ? 0 : E.outBack(km))) * SH * 0.9 + (km >= 1 ? float(lt, 2, 4, 0.9) : 0), r: (1 - E.out3(km)) * 4, o: km > 0 ? 1 : 0 });
      revealWords(l1W, tL1, lt, { stagger: 0.05, dur: 0.4 });
      revealWords(l2W, tL2, lt, { stagger: 0.045, dur: 0.4 });
      const ke = P(lt, tEyes - 0.02, tEyes + 0.26);
      tf(eyes, { s: lerp(2.8, 1, E.outExpo(ke)) * (1 + 0.035 * Math.sin(lt * 7)), r: Math.sin(lt * 3) * 5, o: ke > 0 ? 1 : 0 });
      avs.forEach((a, i) => {
        const ka = popK(lt, tAv + i * 0.07, 0.4), look = lt > tQ ? Math.sin((lt - tQ) * 7 + i * 1.3) : 0;
        tf(a, { s: ka, y: (1 - ka) * 30, r: look * 7, o: cl(ka * 3) });
        const kq = popK(lt, tQ + i * 0.07, 0.35);
        tf($('.q', a), { s: kq, r: Math.sin(lt * 5 + i) * 12, o: cl(kq * 3) });
      });
      reacs.forEach((r, i) => { const k = popK(lt, tRc + i * 0.28, 0.4); tf(r, { s: k, r: (1 - k) * (i ? 20 : -20) + (i ? 2 : -2), o: cl(k * 3) }); });
      rainU(lt);
      flash(lt, [tEyes], 0.55, 0.3);
    };
  });

  // ================= S2: kartu stiker hak + jam pasir 3×24 jam =================
  const GLASS = `<svg viewBox="0 0 200 280" width="100%" height="100%">
    <defs><clipPath id="n5gl"><path d="M40 36 C40 110 93 118 93 140 C93 162 40 170 40 244 L160 244 C160 170 107 162 107 140 C107 118 160 110 160 36 Z"/></clipPath>
    <linearGradient id="n5cap" x1="0" x2="1"><stop offset="0" stop-color="#9B7BFF"/><stop offset="1" stop-color="#6A4DF0"/></linearGradient></defs>
    <g class="rot">
      <path d="M40 36 C40 110 93 118 93 140 C93 162 40 170 40 244 L160 244 C160 170 107 162 107 140 C107 118 160 110 160 36 Z" fill="rgba(255,255,255,.82)"/>
      <g clip-path="url(#n5gl)"><rect class="sT" x="30" y="60" width="140" height="80" fill="#FFB08A"/><rect class="sB" x="30" y="200" width="140" height="50" fill="#FF9A73"/>
        <rect class="sS" x="97" y="140" width="6" height="100" fill="#FF9A73"/></g>
      <path d="M40 36 C40 110 93 118 93 140 C93 162 40 170 40 244 M160 244 C160 170 107 162 107 140 C107 118 160 110 160 36" fill="none" stroke="#C4B5FF" stroke-width="6" stroke-linecap="round"/>
      <path d="M58 62 C60 96 78 108 86 118" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/>
      <rect x="18" y="12" width="164" height="30" rx="15" fill="url(#n5cap)"/><rect x="18" y="238" width="164" height="30" rx="15" fill="url(#n5cap)"/>
    </g></svg>`;
  KIT.registerType('rights', (root, v, sc, tm, T) => {
    const tHead = T(v.headAt, 0.45), tC = v.cards.map((c, i) => T(c.at, 1.3 + i)), tShift = T(v.shiftAt, 5), tGlass = T(v.glassAt, 5.1), tTag = T(v.tagAt, 5.4);
    const tFlip = T(v.flipAt, 6.3), tN = v.num.map((n, i) => T(n, 6.7 + i * 0.3)), tEq = T(v.eqAt, 8.1);
    const head = h(`<div class="n5-chip"><b>🙋</b>${rich(v.head)}</div>`);
    root.appendChild(head);
    const CW = pick(440, 420), CH = pick(490, 460);
    const cards = v.cards.map((c, i) => {
      const el = h(`<div class="n5-card c${i}" style="width:${CW}px;height:${CH}px"><div class="em">${c.e}</div><div class="t">${esc(c.t)}</div><div class="s">${esc(c.s)}</div></div>`);
      root.appendChild(el);
      return el;
    });
    // posisi pusat [fase1, fase2]
    const A = pick([[450, 600], [960, 600], [1470, 600]], [[300, 650], [780, 650], [540, 1140]]);
    const B = pick([[690, 236], [960, 236], [1230, 236]], [[290, 340], [540, 340], [790, 340]]);
    const R0 = [-6, 4, -3], SC2 = pick(0.5, 0.48);
    const GW = pick(250, 240), GH = GW * 1.4, GC = pick([520, 690], [540, 740]);
    const glass = h(`<div class="n5-glass" style="width:${GW}px;height:${GH}px">${GLASS}</div>`);
    root.appendChild(glass);
    place(glass, GC[0] - GW / 2, GC[1] - GH / 2);
    const rot = $('.rot', glass), sT = $('.sT', glass), sB = $('.sB', glass), sS = $('.sS', glass);
    const num = h(`<div class="n5-num" style="font-size:${pick(200, 170)}px"><span>3</span><span class="x">×</span><span>24</span><span class="j">jam</span></div>`);
    root.appendChild(num);
    const nums = [...num.children];
    const tag = h(`<div class="n5-tag">📌 ${esc(v.tag)}</div>`);
    root.appendChild(tag);
    const eq = h(`<div class="n5-eq">= 72 jam ⏱️</div>`);
    root.appendChild(eq);
    const NC = pick([1150, 650], [540, 1040]), TC = pick([1150, 818], [540, 1200]), QC = pick([1520, 480], [800, 905]);
    return (lt) => {
      const k2 = E.io3(P(lt, tShift, tShift + 0.55));
      const kh = popK(lt, tHead, 0.45);
      centerAt(head, SW / 2, pick(170, 300));
      tf(head, { s: kh * (1 - k2 * 0.3), y: -k2 * 200 + float(lt, 5, 3), o: cl(kh * 3) * (1 - k2) });
      cards.forEach((el, i) => {
        const k = popK(lt, tC[i], 0.5), [sx, sy] = squash(lt, tC[i] + 0.3, 0.08);
        const x = lerp(A[i][0], B[i][0], k2), y = lerp(A[i][1], B[i][1], k2), s = lerp(1, SC2, k2);
        place(el, x - CW / 2, y - CH / 2);
        const r = R0[i] + (1 - E.out3(P(lt, tC[i], tC[i] + 0.6))) * -24 + Math.sin(lt * 1.3 + i * 2) * 1.5;
        tf(el, { sx: k * s * sx, sy: k * s * sy, r, y: k >= 1 ? float(lt, i, 6, 1.2) * (1 - k2 * 0.5) : (1 - k) * 60, o: cl(k * 3) });
        if (i === 2) el.style.boxShadow = lt > tC[2] && k2 < 1 ? `0 26px 60px rgba(76,54,160,.22), 0 0 0 ${6 + 4 * Math.sin(lt * 6)}px rgba(255,126,182,.35)` : '';
      });
      // jam pasir: jatuh memantul, lalu dibalik dan pasir mengalir
      const kg = P(lt, tGlass, tGlass + 0.6), [gx, gy] = squash(lt, tGlass + 0.4, 0.1);
      tf(glass, { y: (1 - (kg <= 0 ? 0 : E.outBack(kg))) * -700 + (kg >= 1 ? float(lt, 3, 5) : 0), sx: gx, sy: gy, r: (1 - E.out3(kg)) * 18 + Math.sin(lt * 1.6) * 2, o: kg > 0 ? 1 : 0 });
      const kf = P(lt, tFlip, tFlip + 0.42);
      const flipping = kf > 0 && kf < 1;
      rot.setAttribute('transform', `rotate(${flipping ? 180 * E.io3(kf) : 0} 100 140)`);
      const drain = lt < tFlip + 0.42 ? 1 : P(lt, tFlip + 0.45, tFlip + 7.5);
      sT.setAttribute('y', lerp(62, 140, drain)); sT.setAttribute('height', lerp(78, 0, drain));
      sB.setAttribute('y', lerp(244, 176, drain)); sB.setAttribute('height', lerp(0, 68, drain) + 6);
      const flowing = lt > tFlip + 0.45 && drain < 1;
      sS.setAttribute('height', flowing ? lerp(104, 36, drain) : 0);
      sS.style.opacity = flowing ? 0.75 + 0.25 * Math.sin(lt * 30) : 0;
      // 3×24 jam
      centerAt(num, NC[0], NC[1]);
      nums.forEach((el, i) => {
        const k = popK(lt, tN[i], 0.4);
        tf(el, { s: k, y: (1 - k) * 50 + (k >= 1 ? float(lt, i + 7, 4, 1.6) : 0), r: (1 - k) * (i % 2 ? 20 : -20), o: cl(k * 3) });
      });
      centerAt(tag, TC[0], TC[1]);
      const kt = popK(lt, tTag, 0.45);
      tf(tag, { s: kt, r: -2 + Math.sin(lt * 1.4) * 1.2, o: cl(kt * 3) });
      centerAt(eq, QC[0], QC[1]);
      const kq = popK(lt, tEq, 0.45);
      tf(eq, { s: kq, r: 7 + Math.sin(lt * 2) * 2, o: cl(kq * 3) });
    };
  });
  // ================= bingkai screenshot ASLI aplikasi (assets/app/*.png, resolusi 1× — tampil ≤ ±1,4×) =================
  // cfg: { src, size:[w,h], label, box:{h:[x,y,w,h],v:[..]}, cam:{h:[{at,x,y,w,dur}]}, marks:{h:[{at,to,r:[x,y,w,h],spot,tone}]}, taps:{h:[{at,p:[x,y]}]} }
  // cam/marks/taps memakai koordinat piksel gambar asli; skala kamera = lebar bingkai / w.
  const FMT = V ? 'v' : 'h';
  const byFmt = (x) => (x && typeof x === 'object' && !Array.isArray(x) && ('h' in x || 'v' in x) ? x[FMT] : x);
  function shot(root, cfg, T) {
    const [iw, ih] = cfg.size || [1600, 1000];
    const [bx, by, bw, bh] = byFmt(cfg.box), BAR = 64, VW = bw, VH = bh - BAR;
    const el = h(`<div class="n5-shot" style="left:${bx}px;top:${by}px;width:${bw}px;height:${bh}px">
      <div class="tb"><i></i><i></i><i></i><div class="url">${esc(cfg.label || 'Privasimu Nexus')}</div></div>
      <div class="vp" style="height:${VH}px"><div class="lay" style="width:${iw}px;height:${ih}px"><img src="${cfg.src}" alt="" style="width:${iw}px;height:${ih}px"></div></div></div>`);
    root.appendChild(el);
    const vp = $('.vp', el), lay = $('.lay', el);
    const cams = (byFmt(cfg.cam) || [{ at: 0, x: 0, y: 0, w: iw }]).map((c) => ({ ...c, t: T(c.at, 0) }));
    const marks = (byFmt(cfg.marks) || []).map((m) => {
      const e = h(`<div class="n5-mark ${m.spot ? 'spot' : ''} ${m.tone || ''}"></div>`);
      vp.appendChild(e);
      return { e, m, t: T(m.at, 0), t1: m.to != null ? T(m.to, 99) : 99 };
    });
    const tapEl = h('<div class="n5-tap"><i></i><b>👆</b></div>');
    vp.appendChild(tapEl);
    const taps = (byFmt(cfg.taps) || []).map((p) => ({ ...p, t: T(p.at, 0) }));
    let cur = { s: VW / iw, x: 0, y: 0 };
    const camAt = (lt) => {
      const c0 = cams[0], s0 = VW / c0.w;
      let st = { s: s0, x: -c0.x * s0, y: -c0.y * s0 };
      for (let i = 1; i < cams.length; i++) {
        const c = cams[i], k = E.io3(P(lt, c.t, c.t + (c.dur || 0.9)));
        if (k <= 0) break;
        const sb = VW / c.w;
        st = { s: lerp(st.s, sb, k), x: lerp(st.x, -c.x * sb, k), y: lerp(st.y, -c.y * sb, k) };
      }
      return st;
    };
    const toVp = (x, y) => [x * cur.s + cur.x, y * cur.s + cur.y];
    function update(lt) {
      cur = camAt(lt);
      lay.style.transform = `translate(${cur.x.toFixed(2)}px, ${cur.y.toFixed(2)}px) scale(${cur.s.toFixed(4)})`;
      marks.forEach(({ e, m, t, t1 }) => {
        const k = P(lt, t, t + 0.4), ko = P(lt, t1, t1 + 0.3);
        if (k <= 0 || ko >= 1) { e.style.opacity = 0; return; }
        const [x, y] = toVp(m.r[0], m.r[1]), w = m.r[2] * cur.s, hh = m.r[3] * cur.s, pad = 7;
        Object.assign(e.style, { left: x - pad + 'px', top: y - pad + 'px', width: w + pad * 2 + 'px', height: hh + pad * 2 + 'px' });
        e.style.opacity = cl(k * 2) * (1 - ko);
        e.style.transform = `scale(${lerp(1.16, 1, E.outBack(k))})`;
        e.style.setProperty('--gl', (12 + 9 * Math.sin((lt - t) * 5)).toFixed(1) + 'px');
      });
      let tv = null;
      taps.forEach((p) => { if (lt > p.t - 0.75 && lt < p.t + 0.75) tv = p; });
      tapAnim(tapEl, tv, lt, tv ? toVp(tv.p[0], tv.p[1]) : null);
    }
    return { el, vp, update, toVp, box: [bx, by, bw, bh], BAR, VW, VH };
  }
  // jari mengetuk + riak
  function tapAnim(el, tv, lt, pt) {
    if (!tv || !pt) { el.style.opacity = 0; return; }
    const kIn = E.out3(P(lt, tv.t - 0.75, tv.t - 0.18)), kOut = P(lt, tv.t + 0.35, tv.t + 0.75);
    const press = lt > tv.t - 0.06 && lt < tv.t + 0.14 ? 0.8 : 1;
    el.style.opacity = kIn * (1 - kOut);
    el.style.transform = `translate(${pt[0] + (1 - kIn) * 130}px, ${pt[1] + (1 - kIn) * 110}px)`;
    el.lastChild.style.transform = `scale(${press})`;
    const kr = P(lt, tv.t, tv.t + 0.5);
    el.firstChild.style.transform = `translate(-50%, -50%) scale(${0.3 + kr * 1.9})`;
    el.firstChild.style.opacity = kr > 0 && kr < 1 ? 1 - kr : 0;
  }
  // posisi tengah-atas lazy sesuai lebar elemen
  const centerX = (el, cx, top) => { if (!el._w && el.offsetWidth) el._w = el.offsetWidth; if (el._w) place(el, cx - el._w / 2, top); };
  const callout = (root, ic, title, sub, cls = '', extra = '') => { const e = h(`<div class="n5-call ${cls}"><div class="ic">${ic}</div><div>${rich(title)}${sub ? `<small>${rich(sub)}</small>` : ''}</div>${extra}</div>`); root.appendChild(e); return e; };

  // ================= S3: formulir DSR (asli) -> detail DSR 71h tersisa (asli) -> meme Drake tenggat =================
  KIT.registerType('dsr', (root, v, sc, tm, T) => {
    const tEmb = T(v.embAt, 2.75), tSend = T(v.sendAt, 3.4), tB = T(v.detailAt, 3.75), tI = T(v.idAt, 4.12), tOk = T(v.okAt, 4.9);
    const tD = T(v.drakeAt, 5.8), tNo = T(v.noAt, 6.0), tYes = T(v.yesAt, 6.86), tLive = T(v.liveAt, 7.25);
    const A = shot(root, v.form, T), B = shot(root, v.detail, T);
    const cEmb = callout(root, '🌐', v.emb, v.embSub);
    const cSent = callout(root, '📥', v.sent, v.sentSub, 'ok');
    const cId = callout(root, '🆔', v.idTxt, v.idSub, 'ok', '<div class="ck">✅</div>');
    const cLive = h(`<div class="n5-live"><i></i>${esc(v.live)}</div>`);
    root.appendChild(cLive);
    const SP = byFmt(v.sentPos), EP = byFmt(v.embPos), IP = byFmt(v.idPos), LP = byFmt(v.livePos), BY = byFmt(v.detailY);
    const conf = confetti(root, { n: 50, x: SP[0], y: SP[1] + 50, t0: tSend + 0.02, power: 0.85, seed: 7 });
    const DW = pick(1480, 960);
    const dk = h(`<div class="n5-drake" style="width:${DW}px">
      <div class="n5-dr no"><div class="em">🙅</div><div class="tx"><b>${rich(v.no)}</b><div class="doodle">${esc(v.noSub)}</div></div><div class="mk">✕</div></div>
      <div class="n5-dr yes"><div class="em">😎</div><div class="tx"><b>${rich(v.yes)}</b><div class="doodle ok">${esc(v.yesSub)}</div></div><div class="mk">✓</div></div></div>`);
    root.appendChild(dk);
    const [rNo, rYes] = dk.querySelectorAll('.n5-dr');
    place(dk, (SW - DW) / 2, pick(500, 630));
    const box0 = byFmt(v.detail.box)[1];
    return (lt, d) => {
      // A: formulir asli — masuk, zoom halus, keluar setelah terkirim
      const ka = popK(lt, 0.05, 0.6), kaOut = E.in3(P(lt, tSend + 0.12, tB + 0.12));
      A.update(lt);
      tf(A.el, { x: pick(-kaOut * 1900, 0), y: (1 - ka) * 140 + pick(0, -kaOut * 1500) + float(lt, 0, 3, 0.8), s: (0.9 + 0.1 * ka) * (1 - kaOut * 0.12), r: (1 - ka) * 2.5 - kaOut * pick(6, 0), o: cl(ka * 2) * (1 - kaOut), blur: kaOut * 8 });
      // B: detail DSR — masuk memantul, lalu naik saat meme
      const kb = P(lt, tB, tB + 0.55), kbb = kb <= 0 ? 0 : E.outBack(kb), kup = E.io3(P(lt, tD - 0.1, tD + 0.45));
      B.update(lt);
      tf(B.el, { x: pick((1 - kbb) * 1500, 0), y: lerp(BY[0], BY[1], kup) - box0 + pick(0, (1 - kbb) * 1300) + float(lt, 1, 3, 0.8), o: kb > 0 ? 1 : 0 });
      // callout
      centerX(cEmb, EP[0], EP[1]); centerX(cSent, SP[0], SP[1]); centerX(cId, IP[0], IP[1]); centerX(cLive, LP[0], LP[1]);
      const ke = popK(lt, tEmb, 0.45), keo = E.in3(P(lt, tSend + 0.12, tSend + 0.4));
      tf(cEmb, { s: ke * (1 - keo), r: -2 + Math.sin(lt * 1.5), y: float(lt, 3, 4), o: cl(ke * 3) * (1 - keo) });
      const ks = popK(lt, tSend + 0.02, 0.45), kso = E.in3(P(lt, tI - 0.15, tI + 0.15));
      tf(cSent, { s: ks * (1 - kso * 0.4), r: 2 + Math.sin(lt * 1.7), y: float(lt, 4, 4) - kso * 80, o: cl(ks * 3) * (1 - kso) });
      const ki = popK(lt, tI, 0.45), kio = E.in3(P(lt, tD - 0.15, tD + 0.15));
      tf(cId, { s: ki * (1 - kio * 0.4), r: -1.5 + Math.sin(lt * 1.3), y: float(lt, 5, 4) + kio * 60, o: cl(ki * 3) * (1 - kio) });
      const kk = popK(lt, tOk, 0.4);
      tf($('.ck', cId), { s: kk * (1 + 0.3 * (1 - P(lt, tOk, tOk + 0.3))), r: (1 - kk) * -40, o: cl(kk * 3) });
      conf(lt);
      // meme Drake
      const k1 = popK(lt, tNo, 0.45), k2 = popK(lt, tYes, 0.45);
      tf(rNo, { x: (1 - E.out3(P(lt, tNo, tNo + 0.45))) * -160, s: 0.75 + 0.25 * k1, y: k1 >= 1 ? float(lt, 0, 3) : 0, o: cl(k1 * 3) });
      rNo.style.filter = lt > tYes + 0.1 ? `grayscale(${P(lt, tYes + 0.1, tYes + 0.5)}) opacity(${1 - 0.3 * P(lt, tYes + 0.1, tYes + 0.5)})` : 'none';
      const [sx, sy] = squash(lt, tYes + 0.3, 0.05);
      tf(rYes, { x: (1 - E.out3(P(lt, tYes, tYes + 0.45))) * 160, sx: (0.75 + 0.25 * k2) * sx, sy: (0.75 + 0.25 * k2) * sy, y: k2 >= 1 ? float(lt, 1, 3) : 0, o: cl(k2 * 3) });
      [rNo, rYes].forEach((r, i) => { const km = popK(lt, (i ? tYes : tNo) + 0.2, 0.4); tf($('.mk', r), { s: km, r: (1 - km) * 90, o: cl(km * 3) }); });
      const kl = popK(lt, tLive, 0.45);
      tf(cLive, { s: kl, r: 3 + Math.sin(lt * 2) * 2, o: cl(kl * 3) });
      $('i', cLive).style.opacity = 0.4 + 0.6 * (Math.floor(lt * 2.5) % 2);
    };
  });

  // ================= S4: alur Handler -> Reviewer -> Approver (detail DSR asli) + draf jawaban dibantu AI (AI Agent asli) =================
  KIT.registerType('flowai', (root, v, sc, tm, T) => {
    const tSt = v.steps.map((s, i) => T(s.at, 0.7 + i * 0.8)), tLog = T(v.logAt, 2.9), tAi = T(v.aiAt, 3.9), tTy = T(v.typeAt, 4.4), tEnd = T(v.typeEnd, 5.8), tSp = T(v.sparkAt, 5.55);
    const D = shot(root, v.detail, T), C = shot(root, v.chat, T);
    const strip = h(`<div class="n5-strip">${v.steps.map((s, i) => `${i ? '<div class="ar"><span>➜</span></div>' : ''}<div class="n5-st"><div class="av" style="background:${s.bg}">${s.e}</div><div><b>${esc(s.t)}</b><small>${esc(s.s)}</small></div><div class="ck">✓</div></div>`).join('')}</div>`);
    root.appendChild(strip);
    const sts = [...strip.querySelectorAll('.n5-st')], ars = [...strip.querySelectorAll('.ar')];
    const log = h(`<div class="n5-stamp">🧾 ${esc(v.log)}</div>`);
    root.appendChild(log);
    const AW = pick(660, 960);
    const ai = h(`<div class="n5-ai" style="width:${AW}px"><div class="hd"><b>✨</b><div>${esc(v.aiTitle)}<small>${esc(v.aiSub)}</small></div></div>
      <div class="dots"><i></i><i></i><i></i></div><div class="tx"></div><div class="ft">${esc(v.aiFoot)}</div></div>`);
    root.appendChild(ai);
    const dots = [...ai.querySelectorAll('.dots i')], dotsBox = $('.dots', ai), atx = $('.tx', ai), aft = $('.ft', ai);
    const spark = rain(root, { n: 12, emoji: ['✨', '💜', '✨'], t0: tSp, span: 0.35, fall: 1.2, size: [50, 90], seed: 11 });
    const SPp = byFmt(v.stripAt), LG = byFmt(v.logPos), AP = byFmt(v.aiPos);
    return (lt, d) => {
      const kd = popK(lt, 0.02, 0.6), kdo = E.in3(P(lt, tAi - 0.3, tAi + 0.12));
      D.update(lt);
      tf(D.el, { y: (1 - kd) * 110 - kdo * pick(1100, 1300) + float(lt, 0, 3, 0.8), s: 0.9 + 0.1 * kd, o: cl(kd * 2) * (1 - kdo), blur: kdo * 8 });
      // strip alur
      centerX(strip, SPp[0], SPp[1]);
      tf(strip, { y: float(lt, 1, 3) - kdo * pick(1100, 1300), o: 1 - kdo });
      sts.forEach((el, i) => {
        const k = popK(lt, tSt[i], 0.45), act = lt >= tSt[i] && (i === sts.length - 1 || lt < tSt[i + 1]);
        tf(el, { s: k * (act && lt < tLog + 0.3 ? 1.06 : 1), y: (1 - k) * 40, r: (1 - k) * 10, o: cl(k * 3) });
        el.classList.toggle('act', act && lt < tLog + 0.3);
        const kc = popK(lt, tSt[i] + 0.38, 0.35);
        tf($('.ck', el), { s: kc, r: (1 - kc) * -60, o: cl(kc * 3) });
      });
      ars.forEach((el, i) => { const k = E.out3(P(lt, tSt[i + 1] - 0.3, tSt[i + 1])); tf(el, { x: pick((1 - k) * -24, 0), y: pick(0, (1 - k) * -20), o: k }); });
      centerX(log, LG[0], LG[1]);
      const kl = P(lt, tLog - 0.04, tLog + 0.2);
      tf(log, { s: lerp(2.2, 1, E.outExpo(kl)), r: -5, y: -kdo * pick(1100, 1300), o: (kl > 0 ? 1 : 0) * (1 - kdo) });
      // AI Agent asli + gelembung draf
      const kc = P(lt, tAi - 0.1, tAi + 0.5), kcb = kc <= 0 ? 0 : E.outBack(kc);
      C.update(lt);
      tf(C.el, { y: (1 - kcb) * pick(900, 1200) + float(lt, 2, 3, 0.8), r: (1 - kcb) * -3, o: kc > 0 ? 1 : 0 });
      place(ai, AP[0], AP[1]);
      const ka = P(lt, tAi + 0.15, tAi + 0.6), kab = ka <= 0 ? 0 : E.outBack(ka);
      const [ax, ay] = squash(lt, tAi + 0.45, 0.05);
      tf(ai, { sx: kab * ax, sy: kab * ay, y: float(lt, 3, 4), o: cl(ka * 3) });
      const typing = lt < tTy;
      dotsBox.style.display = typing ? 'flex' : 'none';
      dots.forEach((dd, i) => { dd.style.transform = `translateY(${Math.sin(lt * 12 - i * 0.9) * 7}px)`; });
      typeInto(atx, v.draft, tTy, tEnd, lt, true);
      atx.style.display = typing ? 'none' : 'block';
      tf(aft, { o: E.out3(P(lt, tEnd - 0.1, tEnd + 0.3)) });
      spark(lt);
    };
  });

  // ================= S5: Data Discovery — ILUSTRASI KONSEP (bukan layar aplikasi): satu nama dilacak di berbagai sistem =================
  KIT.registerType('discovery', (root, v, sc, tm, T) => {
    const tH = T(v.headAt, 0.3), tQ = T(v.qAt, 0.45), tQe = T(v.qEnd, 1.2), tScan = T(v.scanAt, 1.55), tHit = v.systems.map((s, i) => T(s.at, 1.9 + i * 0.3)), tRes = T(v.resAt, 3.2);
    const head = h(`<div class="n5-chip sm"><b>🔎</b>${esc(v.head)}</div>`);
    root.appendChild(head);
    const q = h(`<div class="n5-search"><div class="ic">🔍</div><span class="qv"></span><div class="go">Lacak</div></div>`);
    root.appendChild(q);
    const qv = $('.qv', q);
    const CWd = pick(372, 450), CHd = pick(440, 390);
    const pos = V ? [[65, 450], [565, 450], [65, 875], [565, 875]] : [[160, 330], [572, 330], [984, 330], [1396, 330]];
    const cards = v.systems.map((s, i) => {
      const rows = [0, 1, 2, 3].map((r) => (r === s.m
        ? `<div class="rw m"><i class="a"></i><span class="nm"><i class="hl"></i><b>${esc(v.q)}</b></span></div>`
        : `<div class="rw"><i class="a"></i><i class="ln" style="width:${40 + hash(i * 7 + r * 3) * 45}%"></i></div>`)).join('');
      const el = h(`<div class="n5-db" style="width:${CWd}px;height:${CHd}px"><div class="hd"><b style="background:${s.bg}">${s.e}</b><div>${esc(s.n)}<small>${esc(s.sub)}</small></div></div>
        <div class="rows">${rows}</div><div class="fd">✓ ${esc(s.f)}</div></div>`);
      root.appendChild(el);
      place(el, pos[i][0], pos[i][1]);
      return el;
    });
    const beam = h(`<div class="n5-beam ${V ? 'vv' : ''}"></div>`);
    root.appendChild(beam);
    const res = h(`<div class="n5-res">🎯 ${rich(v.res)}</div>`);
    root.appendChild(res);
    const HP = byFmt(v.headPos), QP = byFmt(v.qPos), RP = byFmt(v.resPos);
    return (lt, d) => {
      centerX(head, HP[0], HP[1]);
      const kh = popK(lt, tH, 0.4);
      tf(head, { s: kh, o: cl(kh * 3), y: float(lt, 6, 3) });
      centerX(q, QP[0], QP[1]);
      const kq = popK(lt, tQ - 0.2, 0.45);
      tf(q, { s: kq, y: float(lt, 2, 3), o: cl(kq * 3) });
      typeInto(qv, v.q, tQ, tQe, lt, true);
      $('.go', q).style.transform = `scale(${lt > tScan - 0.08 && lt < tScan + 0.1 ? 0.9 : 1})`;
      cards.forEach((el, i) => {
        const k = popK(lt, 0.25 + i * 0.1, 0.5), hit = lt >= tHit[i], kh2 = popK(lt, tHit[i], 0.4);
        const [sx, sy] = squash(lt, tHit[i], 0.05);
        tf(el, { sx: k * sx, sy: k * sy, y: (1 - k) * 60 + float(lt, i, 5, 1.1), r: [-2, 1.5, -1, 2][i], o: cl(k * 3) });
        el.classList.toggle('hit', hit);
        const nm = $('.nm', el), hl = $('.hl', el);
        tf(nm, { s: 0.6 + 0.4 * kh2, o: cl(kh2 * 3) });
        hl.style.transform = `scaleX(${E.out3(P(lt, tHit[i] + 0.1, tHit[i] + 0.4))})`;
        const kf = popK(lt, tHit[i] + 0.15, 0.4);
        tf($('.fd', el), { s: kf, r: 8 * (1 - kf) - 4, o: cl(kf * 3) });
      });
      const kb = P(lt, tScan, tScan + 1.5);
      beam.style.opacity = kb > 0 && kb < 1 ? 1 : 0;
      beam.style.transform = V ? `translateY(${lerp(400, 1300, E.io3(kb))}px)` : `translateX(${lerp(60, 1860, E.io3(kb))}px)`;
      centerX(res, RP[0], RP[1]);
      const kr = popK(lt, tRes, 0.45);
      tf(res, { s: kr, r: -1.5 + Math.sin(lt * 1.5), o: cl(kr * 3) });
    };
  });
})();
