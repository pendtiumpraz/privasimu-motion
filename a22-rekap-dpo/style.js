// Gaya A22 · "Rekap Tahunan DPO 2026": slide cerita bergradasi cerah, angka raksasa, stiker, konfeti.
// Warna/font/istilah SENDIRI (tidak meniru layanan musik mana pun). Semua gerak dihitung dari waktu (deterministik).
(function () {
  const { V, SW, SH, h, esc, rich, $, pick, splitWords, revealWords, float } = KIT;
  const { P, cl, lerp, E, hash, tf, fmtNum } = MG;
  const popK = (lt, t0, dur = 0.45) => { const k = P(lt, t0, t0 + dur); return k <= 0 ? 0 : E.outBack(k); };
  const place = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; };
  document.body.insertAdjacentHTML('beforeend', '<div aria-hidden="true" style="position:absolute;left:-9999px;top:0;opacity:0">🎁🙏📝🤔☕👑🔁📅👇✨💬🗂️⭐⏰😵</div>');
  // stiker emoji: { e, at, x:[16x9, 9x16], y:[16x9, 9x16], size, r }
  function stickers(root, list) {
    const els = list.map((s) => { const el = h(`<div class="r-stk">${s.e}</div>`); if (s.size) el.style.fontSize = s.size + 'px'; root.appendChild(el); return el; });
    return (lt) => els.forEach((el, i) => {
      const s = list[i];
      place(el, pick(s.x[0], s.x[1]), pick(s.y[0], s.y[1]));
      tf(el, { s: popK(lt, s.at, 0.5), r: (s.r || 0) + Math.sin(lt * 2 + i) * 10, y: float(lt, i, 12, 1.4) });
    });
  }

  // ---------------- latar: gradasi per slide + blob + garis putar ----------------
  const GRAD = { s1: ['#4B1FE0', '#2F6BFF'], s2: ['#E6246E', '#FF7A3D'], s3: ['#0E9F7E', '#1D6FE0'], s4: ['#FF7A00', '#E23D3D'], s5: ['#8E2DE2', '#E0359A'], s6: ['#0B1B4D', '#2F6BFF'], s7: ['#141A3A', '#3B2DB8'] };
  function bg(cx, t, id, theme, W, H, lt) {
    const [a, b] = GRAD[id] || GRAD.s1, g = cx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, a); g.addColorStop(1, b);
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) {
      const x = W * (0.2 + 0.6 * hash(i + 1) + 0.08 * Math.sin(t * 0.5 + i)), y = H * (0.2 + 0.6 * hash(i + 7) + 0.06 * Math.cos(t * 0.4 + i * 2)), r = Math.max(W, H) * 0.35;
      const rg = cx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, 'rgba(255,255,255,.16)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = rg; cx.fillRect(0, 0, W, H);
    }
    cx.save(); cx.translate(W * 0.5, H * 0.5); cx.rotate(t * 0.12);
    cx.strokeStyle = 'rgba(255,255,255,.07)'; cx.lineWidth = 3;
    for (let r = 200; r < Math.max(W, H); r += 160) { cx.beginPath(); for (let k = 0; k <= 64; k++) { const a2 = k / 64 * Math.PI * 2, rr = r + Math.sin(a2 * 6 + t) * 18; cx.lineTo(Math.cos(a2) * rr, Math.sin(a2) * rr); } cx.stroke(); }
    cx.restore();
  }

  // ---------------- chrome: bar cerita + label + catatan ilustrasi; transisi geser ----------------
  let CH = null;
  const ILUS = new Set(['s2', 's3', 's4', 's5']);
  function chrome(id, lt, d, sec) {
    const TL = window.TIMELINE;
    if (!CH) {
      const stage = $('#stage'), before = $('#grain');
      const bars = h(`<div id="r-bars">${TL.scenes.map(() => '<i><b></b></i>').join('')}</div>`);
      const brand = h('<div id="r-brand"><b>PRIVASIMU</b> · Rekap Tahunan DPO 2026</div>');
      const note = h('<div id="r-note">*angka ilustrasi</div>');
      [bars, brand, note].forEach((e) => stage.insertBefore(e, before));
      CH = { segs: [...bars.querySelectorAll('b')], note };
    }
    const idx = TL.scenes.findIndex((s) => s.id === id);
    CH.segs.forEach((s, i) => { s.style.width = (i < idx ? 100 : i > idx ? 0 : 100 * cl(lt / d)) + '%'; });
    CH.note.style.opacity = ILUS.has(id) ? 1 : 0;
    if (idx > 0) { const k = E.out3(P(lt, 0, 0.38)); sec.style.transform += ` translateX(${((1 - k) * 160).toFixed(1)}px)`; sec.style.opacity = cl(k * 1.4); }
  }
  KIT.style({ fonts: ['800 20px "Bricolage Grotesque"', '700 20px "Bricolage Grotesque"'], bg, frame: chrome });

  // ---------------- konfeti (deterministik) ----------------
  const CONF = ['#FFE14D', '#FF6FB5', '#7CF2C8', '#FFFFFF', '#8FB6FF', '#FF9F43'];
  function confetti(root, { n = 60, x = SW / 2, y = SH / 2, t0 = 0, power = 1, seed = 3 }) {
    const box = h('<div class="r-conf"></div>');
    root.appendChild(box);
    const ps = Array.from({ length: n }, (_, i) => {
      const el = document.createElement('i');
      const w = 14 + hash(i * 2.3 + seed) * 16;
      Object.assign(el.style, { width: w + 'px', height: (hash(i + seed) < 0.4 ? w : w * 0.45) + 'px', background: CONF[i % CONF.length], borderRadius: hash(i * 1.7 + seed) < 0.3 ? '50%' : '3px' });
      box.appendChild(el);
      const a = -Math.PI / 2 + (hash(i * 3.7 + seed) - 0.5) * Math.PI * 1.5, v = (700 + hash(i * 5.3 + seed) * 900) * power;
      return { el, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: hash(i * 7.1 + seed) * 360, vr: (hash(i * 8.3 + seed) - 0.5) * 900, dl: hash(i * 9.9 + seed) * 0.08 };
    });
    return (lt) => ps.forEach((p) => {
      const t = lt - t0 - p.dl;
      if (t < 0 || t > 2.2) { p.el.style.opacity = 0; return; }
      const drag = (1 - Math.exp(-2.4 * t)) / 2.4;
      p.el.style.opacity = t > 1.7 ? 1 - (t - 1.7) / 0.5 : 1;
      p.el.style.transform = `translate(${x + p.vx * drag}px, ${y + p.vy * drag + 900 * t * t * 0.5}px) rotate(${p.r + p.vr * t}deg) scaleX(${Math.cos(t * 9 + p.r)})`;
    });
  }
  const label = (root, text, y) => { const el = h(`<div class="r-label">${esc(text)}</div>`); root.appendChild(el); if (y != null) el.style.top = y + 'px'; return el; };

  // ---------------- s1: kado dibuka ----------------
  KIT.registerType('r_buka', (root, v, sc, tm, T) => {
    const tO = T(v.openAt, 0.7), tT = T(v.titleAt, 0.9), tB = T(v.boomAt, 2.5);
    const title = h(`<div class="r-title"><div class="k">Rekap Tahunan</div><div class="big">DPO 2026</div><div class="s">punya kamu sudah siap ✨</div></div>`);
    root.appendChild(title);
    Object.assign(title.style, V ? { left: '0', right: '0', top: '300px', textAlign: 'center' } : { left: '130px', width: '900px', top: '300px' });
    const kW = splitWords(title.querySelector('.k')), sW = splitWords(title.querySelector('.s')), big = title.querySelector('.big');
    const GX = pick(1400, 540), GY = pick(640, 1080), GS = pick(1, 1.1);
    const gift = h(`<div class="r-gift" style="left:${GX - 170}px;top:${GY - 150}px;transform:scale(${GS})"><div class="base"><i></i></div><div class="lid"><i></i><b></b><b></b></div><div class="rays"></div></div>`);
    root.appendChild(gift);
    const lid = gift.querySelector('.lid'), rays = gift.querySelector('.rays'), base = gift.querySelector('.base');
    const conf = confetti(root, { x: GX, y: GY - 80, t0: tB, power: 1.1, seed: 5 });
    const conf0 = confetti(root, { n: 34, x: GX, y: GY - 100, t0: tO + 0.1, power: 0.7, seed: 9 });
    return (lt) => {
      const kg = popK(lt, 0.05, 0.5), wig = lt < tO ? Math.sin(lt * 30) * 4 * P(lt, 0.3, tO) : 0;
      tf(base, { s: kg, r: wig, o: cl(kg * 3) });
      const ko = P(lt, tO, tO + 0.55);
      lid.style.transform = `translate(${ko * pick(-180, -160)}px, ${-ko * 520 + ko * ko * 260}px) rotate(${-ko * 70 + wig}deg) scale(${kg})`;
      lid.style.opacity = cl(kg * 3) * (1 - P(lt, tO + 0.4, tO + 0.7));
      tf(rays, { s: E.out3(P(lt, tO, tO + 0.6)) * 1.1, r: lt * 20, o: P(lt, tO, tO + 0.2) * 0.9 });
      revealWords(kW, tT - 0.1, lt, { stagger: 0.06, dur: 0.5 });
      const kb = P(lt, tT + 0.25, tT + 0.6);
      tf(big, { s: lerp(1.5, 1, E.outExpo(kb)) * (1 + 0.04 * Math.sin(Math.PI * P(lt, tB, tB + 0.3))), o: kb > 0 ? 1 : 0 });
      revealWords(sW, tB - 0.1, lt, { stagger: 0.05, dur: 0.5 });
      conf0(lt); conf(lt);
    };
  });

  // ---------------- s2: kalimat paling sering diketik ----------------
  KIT.registerType('r_kalimat', (root, v, sc, tm, T) => {
    const tL = T(v.labelAt, 0.1), tT0 = T(v.typeAt, 1.4), tT1 = T(v.typeEnd, 2.6), tC = T(v.countAt, 2.8);
    const lab = label(root, 'Kalimat yang paling sering kamu ketik', pick(170, 290));
    const bub = h('<div class="r-bubble"><span class="tx"></span><span class="car">▏</span></div>');
    root.appendChild(bub);
    const TXT = 'Tolong isi form-nya ya 🙏';
    const cnt = h('<div class="r-count"><b>0</b><span>kali tahun ini</span></div>');
    root.appendChild(cnt);
    const stk = stickers(root, [{ e: '📝', at: 0.5, x: [1500, 820], y: [240, 900] }, { e: '💬', at: 0.8, x: [1680, 140], y: [640, 1120] }]);
    const tx = bub.querySelector('.tx'), car = bub.querySelector('.car'), num = cnt.querySelector('b');
    return (lt) => {
      tf(lab, { y: (1 - E.out3(P(lt, tL, tL + 0.4))) * 20, o: P(lt, tL, tL + 0.4) });
      const kb = popK(lt, 0.3, 0.5);
      place(bub, pick(160, 70), pick(360, 470));
      tf(bub, { s: kb, r: -2 + Math.sin(lt * 1.2), o: cl(kb * 3) });
      const chars = [...TXT], n = Math.round(chars.length * cl((lt - tT0) / Math.max(0.1, tT1 - tT0)));
      const s = chars.slice(0, n).join('');
      if (tx._s !== s) { tx.textContent = s; tx._s = s; }
      car.style.opacity = lt < tT1 + 0.6 && Math.floor(lt * 3) % 2 === 0 ? 1 : 0;
      const kc = P(lt, tC, tC + 1.1);
      num.textContent = fmtNum(1284 * E.out3(kc)) + '×';
      place(cnt, pick(160, 70), pick(640, 760));
      tf(cnt, { s: 0.8 + 0.2 * E.outBack(P(lt, tC, tC + 0.4)), o: P(lt, tC - 0.05, tC + 0.2) });
      stk(lt);
    };
  });

  // ---------------- s3: menit di rapat ----------------
  KIT.registerType('r_angka', (root, v, sc, tm, T) => {
    const tC = T(v.countAt, 0.25), tE = T(v.countEnd, 1.6), tQ = T(v.quoteAt, 2.2), tB = T(v.boomAt, 3.4);
    const lab = label(root, 'Menit kamu di rapat', pick(170, 290));
    const num = h('<div class="r-huge">0</div>');
    root.appendChild(num);
    const unit = h('<div class="r-unit">menit <span>≈ 208 jam ☕</span></div>');
    root.appendChild(unit);
    const q = h('<div class="r-quote">“Data pribadi itu apa, sih?” <span>🤔</span></div>');
    root.appendChild(q);
    const stk = stickers(root, [{ e: '⏰', at: 0.4, x: [1460, 170], y: [230, 1150], size: 170, r: -8 }, { e: '☕', at: tE, x: [1620, 760], y: [560, 1190], r: 6 }]);
    return (lt) => {
      tf(lab, { o: P(lt, 0, 0.3) });
      stk(lt);
      const k = P(lt, tC, tE);
      num.textContent = fmtNum(12480 * E.out3(k));
      place(num, pick(150, 0), pick(250, 400));
      if (V) { num.style.width = SW + 'px'; num.style.textAlign = 'center'; }
      tf(num, { s: 1 + 0.03 * Math.sin(lt * 4), o: P(lt, tC - 0.1, tC + 0.1) });
      place(unit, pick(160, 0), pick(560, 720));
      if (V) { unit.style.width = SW + 'px'; unit.style.textAlign = 'center'; }
      tf(unit, { y: (1 - E.out3(P(lt, tE - 0.2, tE + 0.3))) * 20, o: P(lt, tE - 0.2, tE + 0.2) });
      const kq = popK(lt, tQ, 0.45), sh = lt > tB && lt < tB + 0.4 ? (1 - (lt - tB) / 0.4) * 16 : 0;
      place(q, pick(160, 70), pick(700, 960));
      tf(q, { s: kq * (1 + 0.12 * Math.sin(Math.PI * P(lt, tB, tB + 0.3))), x: (hash(Math.floor(lt * 40)) - 0.5) * sh, r: -3, o: cl(kq * 3) });
    };
  });

  // ---------------- s4: file favorit ----------------
  KIT.registerType('r_file', (root, v, sc, tm, T) => {
    const ts = [T(v.f1At, 0.4), T(v.f2At, 2), T(v.f3At, 2.6)];
    const lab = label(root, 'File yang paling sering kamu buka', pick(170, 290));
    const F = [['RoPA_FINAL_final_v3.xlsx', '318'], ['RoPA_FINAL_final_v3 (1).xlsx', '207'], ['RoPA_FINAL_final_v3_revisiBos.xlsx', '96']];
    const rows = F.map(([n, c], i) => { const el = h(`<div class="r-file ${i ? '' : 'top'}"><div class="rk">#${i + 1}${i ? '' : ' 👑'}</div><div class="ic">XLSX</div><div class="nm">${esc(n)}<small>dibuka ${c}×</small></div></div>`); root.appendChild(el); return el; });
    const stk = stickers(root, [{ e: '🗂️', at: 0.3, x: [1480, 170], y: [220, 1170], size: 180, r: -6 }, { e: '😵', at: ts[2] + 0.3, x: [1600, 760], y: [620, 1200], r: 8 }]);
    return (lt) => {
      tf(lab, { o: P(lt, 0, 0.3) });
      stk(lt);
      rows.forEach((el, i) => {
        const k = popK(lt, ts[i], 0.45);
        place(el, pick(160, 60), pick(300 + i * 190, 420 + i * 230) + (i ? pick(40, 60) : 0));
        tf(el, { s: k, x: (1 - Math.min(1, k)) * 60, y: k >= 1 ? float(lt, i, 4, 1.2) : 0, o: cl(k * 3) });
      });
    };
  });

  // ---------------- s5: kepribadian DPO ----------------
  KIT.registerType('r_persona', (root, v, sc, tm, T) => {
    const tC = T(v.cardAt, 1.2), tR = T(v.traitAt, 2.2);
    const lab = label(root, 'Kepribadian DPO-mu 2026', pick(170, 290));
    // .r-flip: depan = hasil, belakang = kartu misteri. Jangan beri opacity pada .r-flip (memipihkan 3D → kartu terlihat terbalik).
    const fl = h(`<div class="r-flip"><div class="r-card"><div class="emo">🔁</div><div class="nm">Si Paling Revisi</div><div class="stars">★★★★☆ <small>langka</small></div>
      <div class="tr"><span>Hafal “3×24 jam”</span><span>Pahlawan grup chat</span><span>Kolektor versi file</span></div></div>
      <div class="r-back"><b>?</b><span>Kepribadian kamu…</span></div></div>`);
    root.appendChild(fl);
    const tr = [...fl.querySelectorAll('.tr span')];
    return (lt) => {
      tf(lab, { o: P(lt, 0, 0.3) });
      const k0 = popK(lt, 0.15, 0.55), k = E.out3(P(lt, tC - 0.3, tC + 0.5));
      place(fl, pick(610, 140), pick(250, 400));
      const tease = (1 - k) * Math.sin(lt * 3.2) * 9;
      fl.style.transform = `perspective(1600px) rotateY(${180 * (1 - k) + tease + Math.sin(lt * 1.2) * 5 * k}deg) rotateZ(${(1 - k) * Math.sin(lt * 2.1) * 2}deg) scale(${k0 * lerp(0.92, 1, k)})`;
      tr.forEach((e, i) => { const kt = popK(lt, tR + i * 0.18, 0.4); tf(e, { s: kt, o: cl(kt * 3) }); });
    };
  });

  // ---------------- s6: 2027, PP 33 berlaku ----------------
  KIT.registerType('r_2027', (root, v, sc, tm, T) => {
    const tY = T(v.yearAt, 0.8), tP = T(v.ppAt, 2), tS = T(v.shotAt, 3.2), tN = T(v.nexusAt, 5);
    const year = h('<div class="r-huge y">2027</div>');
    root.appendChild(year);
    const pp = h('<div class="r-pill">📅 PP 33/2026 berlaku <b>16 Januari 2027</b></div>');
    root.appendChild(pp);
    const W0 = pick(760, 900), H0 = W0 * 560 / 1002;
    const shot = h(`<div class="r-shot" style="width:${W0}px;height:${H0 + 50}px"><div class="tb"><i></i><i></i><i></i><span>Privasimu Nexus · Dashboard</span></div><div class="vp" style="height:${H0}px"><img src="../assets/app/dashboard.png" style="width:${W0 * 1264 / 1002}px;transform:translate(${-262 * W0 / 1002}px, ${-40 * W0 / 1002}px)" alt=""></div></div>`);
    root.appendChild(shot);
    const cap = h('<div class="r-cap">Rekap 2027 yang lebih rapi,<br>bareng <b>Privasimu Nexus</b></div>');
    root.appendChild(cap);
    return (lt) => {
      const ky = P(lt, tY - 0.05, tY + 0.5);
      place(year, pick(120, 0), pick(150, 330));
      if (V) { year.style.width = SW + 'px'; year.style.textAlign = 'center'; }
      tf(year, { y: (1 - E.outExpo(ky)) * 120 - E.io3(P(lt, tS - 0.3, tS + 0.4)) * pick(0, 90), s: 1 - E.io3(P(lt, tS - 0.3, tS + 0.4)) * pick(0.25, 0.35), o: ky > 0 ? 1 : 0 });
      const kp = popK(lt, tP, 0.45);
      place(pp, V ? (SW - pp.offsetWidth) / 2 : 140, pick(470, 610) - E.io3(P(lt, tS - 0.3, tS + 0.4)) * pick(0, 120));
      tf(pp, { s: kp, o: cl(kp * 3) });
      const ks = E.out3(P(lt, tS, tS + 0.7));
      place(shot, pick(1000, (SW - W0) / 2), pick(260, 700));
      shot.style.transform = `perspective(1600px) translateY(${(1 - ks) * 140}px) rotateY(${pick(-10, 0) * (1 - 0.5 * ks)}deg) rotateX(${pick(4, 10) * (1 - ks)}deg)`;
      shot.style.opacity = ks;
      const kc = E.out3(P(lt, tN - 0.3, tN + 0.3));
      place(cap, pick(140, 60), pick(640, 1300));
      if (V) { cap.style.width = '960px'; cap.style.textAlign = 'center'; }
      tf(cap, { y: (1 - kc) * 20, o: kc });
    };
  });

  // ---------------- s7: kartu bagikan + tag ----------------
  KIT.registerType('r_share', (root, v, sc, tm, T) => {
    const tC = T(v.cardAt, 0.1), tT = T(v.tagAt, 1.4);
    const card = h(`<div class="r-sum"><div class="hd">REKAP TAHUNAN DPO <b>2026</b></div>
      <div class="rw"><span>Kalimat favorit</span><b>“Tolong isi form-nya ya 🙏”</b></div>
      <div class="rw"><span>Menit di rapat</span><b>12.480</b></div>
      <div class="rw"><span>File favorit</span><b>RoPA_FINAL_final_v3.xlsx</b></div>
      <div class="rw"><span>Kepribadian</span><b>Si Paling Revisi 🔁</b></div>
      <div class="ft"><img src="../assets/privasimu_logo.png" alt=""><span>privasimu.com</span></div><div class="il">*angka ilustrasi</div></div>`);
    root.appendChild(card);
    const tag = h('<div class="r-tagline">Tag DPO kantormu <span>👇</span></div>');
    root.appendChild(tag);
    const conf = confetti(root, { x: SW / 2, y: pick(420, 700), t0: tT, power: 1, seed: 13 });
    const fade = h('<div style="position:absolute;inset:0;background:#000;opacity:0"></div>');
    root.appendChild(fade);
    return (lt, d) => {
      const kc = popK(lt, tC, 0.55);
      place(card, pick(160, 90), pick(170, 330));
      card.style.transform = `rotate(${-3 + Math.sin(lt * 1.1) * 1.2}deg) scale(${kc})`;
      card.style.opacity = cl(kc * 3);
      const kt = popK(lt, tT, 0.45);
      place(tag, pick(1080, 0), pick(460, 1250));
      if (V) { tag.style.width = SW + 'px'; tag.style.textAlign = 'center'; }
      tf(tag, { s: kt, y: kt >= 1 ? float(lt, 1, 6, 3) : 0, o: cl(kt * 3) });
      tag.querySelector('span').style.transform = `translateY(${Math.abs(Math.sin(lt * 5)) * -14}px)`;
      conf(lt);
      fade.style.opacity = P(lt, d - 0.35, d - 0.02);
    };
  });
})();
