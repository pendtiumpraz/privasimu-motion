// Kit scene reusable: iklan dirakit dari konfigurasi `vis` tiap scene di scenes.js (16:9 & 9:16).
// Butuh: wordtime.js, engine.js (MG), kit-events.js (KE). Pakai: KIT.run(PRV)
(function () {
  const { width: SW, height: SH, V, cl, P, lerp, E, hash, tf, pick } = MG;
  const $ = (s, r = document) => r.querySelector(s);
  const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
  const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const rich = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
  const LOGO = '../assets/privasimu_logo.png';
  const pad2 = (n) => String(n).padStart(2, '0');

  const ICON = {
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    alert: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M22 20v-1a5 5 0 0 0-3.5-4.8"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9"/>',
    cloud: '<path d="M17.5 19H7a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10.5a4.3 4.3 0 0 1-1.5 8.5z"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    layers: '<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M17 6l3 3M14 9l2 2"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5-10-5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 8 5-3 5 3-1.5-8"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    sync: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
    spark: '<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    flag: '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
    form: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    baby: '<circle cx="12" cy="7" r="4"/><path d="M6 21a6 6 0 0 1 12 0"/><path d="M10 7h.01M14 7h.01"/>',
    access: '<circle cx="12" cy="4" r="2"/><path d="M5 8l7 1 7-1M12 9v5l-3 7M12 14l3 7"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/>',
    handshake: '<path d="M2 12l4-4 4 2 4-3 4 2 4 3"/><path d="M6 14l3 3a2 2 0 0 0 3 0l4-4"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    dot: '<circle cx="12" cy="12" r="4"/>',
  };
  const icon = (n, size = 48, sw = 1.8) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICON[n] || ICON.dot}</svg>`;
  const CHECK = '<svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
  const FILECOL = { xlsx: '#16a34a', docx: '#2563eb', pdf: '#dc2626', pptx: '#ea580c', csv: '#0d9488', txt: '#64748b' };

  // Pecah teks jadi span per kata (mempertahankan <em>) untuk reveal bertahap yang luwes
  function splitWords(el) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const sp = document.createElement('span'); sp.className = 'kw'; sp.textContent = part; frag.appendChild(sp); out.push(sp);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return out;
  }
  const outQuint = (k) => 1 - Math.pow(1 - k, 5);
  function revealWords(spans, t0, lt, { stagger = .06, dur = .6, dist = .5, blur = 8 } = {}) {
    spans.forEach((sp, i) => {
      const k = outQuint(P(lt, t0 + i * stagger, t0 + i * stagger + dur));
      sp.style.transform = `translateY(${(1 - k) * dist}em) rotate(${(1 - k) * 4}deg)`;
      sp.style.opacity = k;
      sp.style.filter = k < .99 ? `blur(${(1 - k) * blur}px)` : 'none';
    });
  }
  const float = (lt, i, amp = 5, sp = 1.1) => Math.sin(lt * sp + i * 1.7) * amp;

  // posisi tengah vertikal lazy (layout baru ada setelah scene tampil)
  function centerTop(el, area = SH, offset = 0) {
    if (!el._top && el.offsetHeight) el._top = Math.max(40, (area - el.offsetHeight) / 2) + offset;
    if (el._top) el.style.top = el._top + 'px';
  }

  const TYPES = {};

  // ---------- headline: baris teks kinetik ----------
  TYPES.headline = (root, v, sc, tm) => {
    const wrap = h('<div class="k-head"></div>');
    root.appendChild(wrap);
    const lines = v.lines.map((ln, i) => {
      const el = h(`<div class="k-line ${ln.size || 'lg'} ${ln.mono ? 'mono' : ''}">${rich(ln.text)}</div>`);
      if (ln.color) el.style.color = ln.color;
      wrap.appendChild(el);
      return { el, at: tm.lines[i], fx: ln.fx || 'up', words: ln.fx === 'punch' ? null : splitWords(el) };
    });
    return (lt) => lines.forEach((l, i) => {
      if (l.fx === 'punch') { const k = P(lt, l.at - .03, l.at + .25); tf(l.el, { s: lerp(1.7, 1, E.outExpo(k)), o: k > 0 ? 1 : 0, y: float(lt, i, 3) }); }
      else { revealWords(l.words, l.at, lt, l.fx === 'blur' ? { stagger: .08, dur: .8, dist: .2, blur: 16 } : {}); l.el.style.transform = `translateY(${float(lt, i, 3)}px)`; }
    });
  };

  // ---------- alert: HP + notifikasi ----------
  TYPES.alert = (root, v, sc, tm) => {
    const ph = h(`<div class="k-phone"><div class="clk">${esc(v.time)}</div><div class="dt">${esc(v.date || '')}</div></div>`);
    const nt = h(`<div class="k-notif"><div class="ap"><span>${esc(v.app || 'PERINGATAN')}</span><span>sekarang</span></div><div class="tt">${rich(v.title)}</div><div class="bd">${rich(v.body || '')}</div></div>`);
    ph.appendChild(nt);
    root.appendChild(ph);
    if (!V && !v.aside) ph.style.left = (SW - 480) / 2 + 'px';
    const aside = v.aside ? h(`<div class="k-aside">${v.aside.map((l) => `<div class="k-line ${l.size || 'lg'}" style="text-align:left">${rich(l.text)}</div>`).join('')}</div>`) : null;
    if (aside) root.appendChild(aside);
    return (lt) => {
      tf(ph, { y: (1 - E.out3(P(lt, 0, .6))) * 140, o: P(lt, 0, .35) });
      const k = E.outBack(P(lt, tm.notif, tm.notif + .45));
      const buzz = lt > tm.notif && lt < tm.notif + .7 ? Math.sin(lt * 95) * 7 * (1 - (lt - tm.notif) / .7) : 0;
      tf(nt, { y: (1 - k) * -90, x: buzz, s: .9 + .1 * k, o: cl(k * 2) });
      nt.style.boxShadow = lt > tm.notif ? `0 0 ${34 + 26 * Math.sin(lt * 6)}px rgba(239,68,68,.45)` : 'none';
      if (aside) [...aside.children].forEach((el, i) => { const ka = E.out3(P(lt, tm.aside[i], tm.aside[i] + .5)); tf(el, { x: (1 - ka) * 70, o: ka }); });
    };
  };

  // ---------- countdown ----------
  TYPES.countdown = (root, v, sc, tm) => {
    const R = V ? 400 : 440, S = R * 2 + 40;
    const box = h(`<div class="k-cd">
      <svg class="rg" width="${S}" height="${S}" style="margin-left:-${S / 2}px;margin-top:-${S / 2 + (V ? 120 : 0)}px">
        <circle cx="${S / 2}" cy="${S / 2}" r="${R}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="3"/>
        <circle class="pr" cx="${S / 2}" cy="${S / 2}" r="${R}" fill="none" stroke="var(--acc)" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0" transform="rotate(-90 ${S / 2} ${S / 2})"/>
      </svg>
      <div class="lb">${rich(v.label || '')}</div><div class="nm">00:00:00</div><div class="un"><span>JAM</span><span>MENIT</span><span>DETIK</span></div><div class="rf">${rich(v.ref || '')}</div></div>`);
    root.appendChild(box);
    const nm = $('.nm', box), pr = $('.pr', box), total = (v.hours || 72) * 3600, speed = v.speed || 1800;
    return (lt) => {
      const el = Math.max(0, lt - tm.start) * speed * (1 + Math.max(0, lt - tm.start) * .6);
      const rem = Math.max(0, total - el);
      nm.textContent = `${pad2(Math.floor(rem / 3600))}:${pad2(Math.floor(rem % 3600 / 60))}:${pad2(Math.floor(rem % 60))}`;
      pr.setAttribute('stroke-dashoffset', (100 * el / total).toFixed(2));
      const k = E.outExpo(P(lt, tm.start - .05, tm.start + .3));
      tf(nm, { s: lerp(1.4, 1, k), o: cl(k * 2) });
      tf($('.lb', box), { y: (1 - E.out3(P(lt, 0, .5))) * -20, o: P(lt, 0, .4) });
      tf($('.un', box), { o: P(lt, tm.start, tm.start + .4) });
      tf($('.rf', box), { o: P(lt, tm.start + .5, tm.start + 1) });
    };
  };

  // ---------- stack: tumpukan file / email / chat / catatan + kata besar + gabung ----------
  const ITEM_SIZE = { file: [440, 118], mail: [540, 150], chat: [470, 100], note: [250, 200] };
  function autoPos(i, n) {
    const cols = V ? [30, 530] : [110, 730, 1350], rows = V ? [150, 430, 710, 990, 1270] : [80, 420, 760];
    const cells = [];
    rows.forEach((y) => cols.forEach((x) => cells.push([x, y])));
    const order = cells.map((c, j) => [hash(j * 7.3 + 1), c]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
    const [x, y] = order[i % order.length];
    return [x + (hash(i + 11) - .5) * 60, y + (hash(i + 17) - .5) * 50];
  }
  TYPES.stack = (root, v, sc, tm) => {
    const items = v.items.map((it, i) => {
      let el;
      if (it.kind === 'file') {
        const ext = (it.text.split('.').pop() || 'txt').toLowerCase();
        el = h(`<div class="k-it file"><div class="fi" style="background:${FILECOL[ext] || '#64748b'}">${esc(ext.toUpperCase())}</div><div class="fn">${esc(it.text)}</div></div>`);
      } else if (it.kind === 'mail') el = h(`<div class="k-it mail"><div class="fr">${esc(it.from || '')}</div><div class="sj">${rich(it.text)}</div><div class="pv">${esc(it.sub || '')}</div></div>`);
      else if (it.kind === 'chat') el = h(`<div class="k-it chat"><div class="nmk">${esc(it.from || '')}</div><div class="tx">${rich(it.text)}</div></div>`);
      else el = h(`<div class="k-it note">${rich(it.text)}</div>`);
      root.appendChild(el);
      const [x, y] = it.pos ? (V ? it.pos.v : it.pos.h) : autoPos(i, v.items.length);
      const [w, hh] = ITEM_SIZE[it.kind] || [400, 120];
      return { el, x, y, w, h: hh, r: it.r ?? (hash(i + 3) - .5) * 12, at: tm.items[i] };
    });
    const dim = h('<div class="k-dim"></div>');
    root.appendChild(dim);
    const words = (v.words || []).map((w, i) => { const el = h(`<div class="k-word ${w.size || ''}">${rich(w.text)}</div>`); if (w.color) el.style.color = w.color; root.appendChild(el); return { el, at: tm.words[i], glitch: w.glitch }; });
    const n = words.length, small = (v.words || []).some((w) => w.size === 'sm'), wh = small ? (V ? 130 : 150) : (V ? 175 : 190);
    const top0 = ((V ? SH - 300 : SH) - n * wh) / 2;
    words.forEach((w, i) => (w.el.style.top = top0 + i * wh + 'px'));
    let mc = null;
    if (v.merge) { mc = h(`<div class="k-merge"><div class="mt">${rich(v.merge.title)}</div>${v.merge.sub ? `<div class="ms">${rich(v.merge.sub)}</div>` : ''}</div>`); root.appendChild(mc); }
    const CX = SW / 2, CY = V ? SH / 2 - 150 : SH / 2;
    return (lt, d) => {
      const suck = tm.merge != null ? E.in3(P(lt, tm.merge - .45, tm.merge)) : 0;
      items.forEach((it, i) => {
        const k = E.outBack(P(lt, it.at, it.at + .3));
        const jit = Math.sin(lt * (5 + i % 4) + i) * (1.2 + lt * .4);
        tf(it.el, {
          x: it.x + (CX - it.x - it.w / 2) * suck, y: it.y + (CY - it.y - it.h / 2) * suck + Math.sin(lt * 2 + i) * 5,
          r: it.r + jit + suck * 160 * (i % 2 ? 1 : -1), s: Math.max(0, k) * (1 - suck * .95), o: k > 0 ? 1 - suck * .6 : 0,
        });
      });
      if (n) dim.style.opacity = P(lt, words[0].at - .2, words[0].at) * .82 * (1 - suck);
      words.forEach((w) => {
        const k = P(lt, w.at, w.at + .22);
        tf(w.el, { s: lerp(1.6, 1, E.outExpo(k)) * (1 - suck), o: (k > 0 ? 1 : 0) * (1 - suck) });
        MG.glitch(w.el, lt, w.glitch && lt > w.at ? .5 * (1 - P(lt, w.at, w.at + .5)) + .08 : 0);
      });
      if (mc) {
        centerTop(mc, V ? SH - 300 : SH);
        const km = E.outBack(P(lt, tm.merge, tm.merge + .45));
        tf(mc, { s: .4 + .6 * Math.max(0, km), o: cl(km * 2) });
      }
    };
  };

  // ---------- checklist ----------
  TYPES.checklist = (root, v, sc, tm) => {
    const box = h(`<div class="k-list">${v.title ? `<div class="ttl">${rich(v.title)}</div>` : ''}</div>`);
    root.appendChild(box);
    const ttlW = v.title ? splitWords($('.ttl', box)) : [];
    const rows = v.rows.map((r) => {
      const el = h(`<div class="k-row"><div class="fl"></div><div class="k-box">${CHECK}</div><div class="tx">${rich(r.text)}</div>${r.tag ? `<div class="tg">${esc(r.tag)}</div>` : ''}${r.chip ? `<div class="ch"><small>${esc(r.chipLabel || 'MODUL')}</small>${esc(r.chip)}</div>` : ''}</div>`);
      box.appendChild(el);
      return el;
    });
    return (lt) => {
      revealWords(ttlW, .05, lt, { stagger: .04 });
      rows.forEach((el, i) => {
        const ta = tm.rows[i], k = P(lt, ta - .04, ta + .3);
        tf(el, { x: (1 - E.outBack(k)) * -90, y: k >= 1 ? float(lt, i, 2.5, .9) : 0, o: cl(k * 2.5) });
        $('.fl', el).style.opacity = .3 * (1 - P(lt, ta, ta + .45)) * (k > 0 ? 1 : 0);
        const tc = tm.checks[i], on = tc != null && lt >= tc, kc = tc != null ? P(lt, tc, tc + .25) : 0;
        const bx = $('.k-box', el);
        bx.classList.toggle('on', on);
        bx.style.transform = `scale(${on ? 1 + .25 * (1 - E.out3(kc)) : 1})`;
        $('path', bx).setAttribute('stroke-dashoffset', 1 - E.out3(kc));
        const blink = tm.alarm != null && lt >= tm.alarm && !on && Math.floor((lt - tm.alarm) / .25) % 2 === 0;
        bx.style.borderColor = on ? '' : blink ? '#ef4444' : '';
        bx.style.boxShadow = on ? '' : blink ? '0 0 24px rgba(239,68,68,.9)' : '';
        el.style.borderColor = on ? 'rgba(56,189,248,.7)' : tm.alarm != null && lt >= tm.alarm ? 'rgba(239,68,68,.45)' : '';
        const ch = $('.ch', el), tg = $('.tg', el);
        if (ch) { const kch = E.outBack(P(lt, tc ?? 99, (tc ?? 99) + .4)); tf(ch, { x: (1 - kch) * 60, s: .7 + .3 * kch, o: cl(kch * 1.5) }); }
        if (tg && ch) tg.style.opacity = 1 - P(lt, tc ?? 99, (tc ?? 99) + .2);
      });
    };
  };

  // ---------- flow: langkah bersambung ----------
  const ARROW_H = '<svg class="k-arrow" viewBox="0 0 64 24" height="24"><path d="M4 12H54M44 4l12 8-12 8" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
  const ARROW_V = '<svg class="k-arrow" viewBox="0 0 24 40" width="24"><path d="M12 2V34M4 26l8 10 8-10" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
  TYPES.flow = (root, v, sc, tm) => {
    const wrap = h(`<div class="k-flow">${v.title ? `<div class="ttl">${rich(v.title)}</div>` : ''}<div class="k-steps n${v.steps.length}"></div></div>`);
    root.appendChild(wrap);
    const steps = $('.k-steps', wrap), els = [], arrows = [];
    const ttlW = v.title ? splitWords($('.ttl', wrap)) : [];
    v.steps.forEach((s, i) => {
      if (i) { const a = h(V ? ARROW_V : ARROW_H); steps.appendChild(a); arrows.push(a); }
      const el = h(`<div class="k-step">${v.numbered ? `<div class="no">${pad2(i + 1)}</div>` : ''}<div class="ic">${icon(s.icon || 'dot', V ? 50 : 54)}</div><div><div class="t">${rich(s.title)}</div>${s.sub ? `<div class="s">${rich(s.sub)}</div>` : ''}</div></div>`);
      steps.appendChild(el);
      els.push(el);
    });
    return (lt) => {
      if (v.title) revealWords(ttlW, .05, lt);
      els.forEach((el, i) => {
        const ta = tm.steps[i], k = E.outBack(P(lt, ta, ta + .4));
        const active = lt >= ta && (i === els.length - 1 || lt < tm.steps[i + 1]);
        tf(el, { y: (1 - k) * 60 + (k >= 1 ? float(lt, i, 6) : 0), s: (.7 + .3 * Math.max(0, k)) * (active ? 1.04 : 1), o: cl(k * 1.6) });
        el.style.borderColor = active ? 'rgba(125,211,252,.9)' : '';
        el.style.boxShadow = active ? '0 0 50px rgba(56,189,248,.35)' : '';
        if (i) $('path', arrows[i - 1]).setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, ta - .3, ta)));
      });
    };
  };

  // ---------- card: email / form / log ----------
  const SIGN = '<svg class="k-sign" width="220" height="70" viewBox="0 0 220 70"><path d="M8 50c20-40 34-40 30-6-3 22 16-30 30-26s-6 30 8 30 18-34 34-30 2 24 18 24 22-20 40-18 20 10 36 6" fill="none" stroke="#1d4ed8" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>';
  TYPES.card = (root, v, sc, tm) => {
    const c = h(`<div class="k-card ${v.dark ? 'dark' : ''}"><div class="ap">${icon(v.icon || 'doc', 26, 2)}<span>${esc(v.app || '')}</span></div>${v.title ? `<div class="hd">${rich(v.title)}</div>` : ''}${v.sub ? `<div class="sb">${rich(v.sub)}</div>` : ''}</div>`);
    const fields = (v.fields || []).map((f) => {
      let right = '';
      if (f.kind === 'toggle') right = '<div class="k-tog"><i></i></div>';
      else if (f.kind === 'sign') right = SIGN;
      else if (f.kind === 'pill') right = `<div class="k-pill ${f.tone || 'blue'}">${esc(f.value)}</div>`;
      else if (f.value) right = `<div class="vl">${rich(f.value)}</div>`;
      const el = h(`<div class="k-f">${f.icon ? `<div class="ico">${icon(f.icon, 30, 2)}</div>` : ''}<div class="lb">${rich(f.label)}</div>${right}</div>`);
      c.appendChild(el);
      return el;
    });
    root.appendChild(c);
    return (lt) => {
      centerTop(c, V ? SH - 300 : SH);
      const kc = E.out3(P(lt, 0, .6));
      tf(c, { y: (1 - kc) * 160 + float(lt, 0, 5, .8), r: Math.sin(lt * .6) * .6, o: cl(kc * 1.6), s: lerp(.94, 1, kc) });
      fields.forEach((el, i) => {
        const k = E.out3(P(lt, tm.fields[i], tm.fields[i] + .35));
        tf(el, { x: (1 - k) * -40, o: k });
        const ton = tm.ons[i];
        const tog = $('.k-tog', el);
        if (tog) { const kt = E.io3(P(lt, ton ?? 99, (ton ?? 99) + .25)); tog.style.background = kt > .5 ? '#22c55e' : '#cbd5e1'; tog.firstChild.style.transform = `translateX(${kt * 34}px)`; }
        const sg = $('.k-sign path', el);
        if (sg) sg.setAttribute('stroke-dashoffset', 1 - E.io3(P(lt, ton ?? tm.fields[i], (ton ?? tm.fields[i]) + .8)));
        const pl = $('.k-pill', el);
        if (pl && ton != null) { const kp = E.outBack(P(lt, ton, ton + .3)); tf(pl, { s: .5 + .5 * Math.max(0, kp), o: cl(kp * 2) }); }
      });
    };
  };

  // ---------- dashboard ----------
  TYPES.dashboard = (root, v, sc, tm) => {
    const menu = v.menu || ['Dashboard', 'RoPA', 'DPIA', 'DSR', 'Insiden', 'Consent', 'Vendor'];
    const app = h(`<div class="k-app"><div class="k-side"><img src="${LOGO}" alt="">${menu.map((m) => `<div class="it ${m === v.active ? 'on' : ''}">${esc(m)}</div>`).join('')}</div><div class="k-main">${v.title ? `<div class="ttl">${rich(v.title)}${v.badge ? `<span class="k-pill ${v.badgeTone || 'red'}">${esc(v.badge)}</span>` : ''}</div>` : ''}</div></div>`);
    root.appendChild(app);
    const main = $('.k-main', app);
    const panels = v.panels.map((p, pi) => ({ p, pi })).filter(({ p }) => !(V && p.v === false)).map(({ p, pi }) => {
      let el;
      if (p.kind === 'kpis') el = h(`<div class="k-kpis">${p.items.map((k) => `<div class="k-kpi"><b data-to="${k.value}">${esc(k.value)}</b>${esc(k.label)}</div>`).join('')}</div>`);
      else {
        el = h(`<div class="k-pn ${p.wide ? 'wide' : ''}"><h4>${rich(p.title || '')}</h4></div>`);
        if (p.kind === 'timer') el.appendChild(h(`<div class="k-timer">72:00:00</div>`));
        if (p.kind === 'gauge') el.appendChild(h(`<div class="k-gauge"><svg width="150" height="150" viewBox="0 0 150 150"><circle cx="75" cy="75" r="62" fill="none" stroke="rgba(148,163,184,.15)" stroke-width="14"/><circle class="ga" cx="75" cy="75" r="62" fill="none" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 75 75)"/></svg><div><div class="gn">0%</div><div class="gl">${esc(p.label || '')}</div></div></div>`));
        if (p.kind === 'queue' || p.kind === 'log') p.items.forEach((q) => el.appendChild(h(`<div class="k-q"><div class="ico">${icon(q.icon || (p.kind === 'log' ? (q.who === 'ai' ? 'spark' : 'user') : 'dot'), 26, 2)}</div><div class="qt">${rich(q.text)}</div>${q.pill ? `<div class="k-pill ${q.tone || 'blue'}">${esc(q.pill)}</div>` : ''}</div>`)));
        if (p.kind === 'chat') p.msgs.forEach((m) => el.appendChild(h(`<div class="k-msg ${m.from === 'u' ? 'u' : 'a'}">${m.from !== 'u' ? `<span class="who">${esc(m.who || 'AI')}</span>` : ''}${rich(m.text)}</div>`)));
        if (p.kind === 'raci') {
          const cols = p.cols || ['R', 'A', 'C', 'I'];
          el.appendChild(h(`<div class="k-raci"><div class="h l"></div>${cols.map((c) => `<div class="h">${esc(c)}</div>`).join('')}${p.rows.map((r) => `<div class="l">${esc(r.task)}</div>${cols.map((c, ci) => `<div class="${r.on.includes(ci) ? 'x' : ''}">${r.on.includes(ci) ? esc(r.names?.[r.on.indexOf(ci)] || '●') : ''}</div>`).join('')}`).join('')}</div>`));
        }
      }
      main.appendChild(el);
      return { el, p, i: pi };
    });
    return (lt) => {
      const ka = E.out3(P(lt, 0, .7));
      tf(app, { y: (1 - ka) * 120 + float(lt, 0, 4, .7), s: lerp(.93, 1, ka), rx: (1 - ka) * 12, o: cl(ka * 1.5) });
      if (v.title) tf($('.ttl', main), { o: P(lt, .2, .6) });
      panels.forEach(({ el, p, i }) => {
        const t0 = tm.panels[i], k = E.out3(P(lt, t0, t0 + .45));
        tf(el, { y: (1 - k) * 30, o: k });
        if (p.kind === 'kpis') el.querySelectorAll('b').forEach((b) => { const to = parseFloat(b.dataset.to); if (Number.isFinite(to)) b.textContent = Math.round(to * E.out3(P(lt, t0, t0 + 1.2))); });
        if (p.kind === 'timer') {
          const el2 = $('.k-timer', el), total = (p.hours || 72) * 3600, e2 = Math.max(0, lt - t0) * (p.speed || 900), rem = Math.max(0, total - e2);
          el2.textContent = `${pad2(Math.floor(rem / 3600))}:${pad2(Math.floor(rem % 3600 / 60))}:${pad2(Math.floor(rem % 60))}`;
        }
        if (p.kind === 'gauge') {
          const tg = MG.cl((lt - (p.from ?? t0)) / (p.dur || 1.6)), val = lerp(p.start ?? 30, p.end ?? 90, E.io3(tg));
          $('.ga', el).setAttribute('stroke-dashoffset', 100 - val);
          $('.gn', el).textContent = Math.round(val) + '%';
        }
        if (p.kind === 'queue' || p.kind === 'log') el.querySelectorAll('.k-q').forEach((q, j) => { const tq = tm.items[i][j], kq = E.out3(P(lt, tq, tq + .35)); tf(q, { x: (1 - kq) * -30, o: kq }); });
        if (p.kind === 'chat') el.querySelectorAll('.k-msg').forEach((m, j) => { const tq = tm.msgs[i][j], kq = E.outBack(P(lt, tq, tq + .35)); tf(m, { y: (1 - kq) * 24, s: .9 + .1 * Math.max(0, kq), o: cl(kq * 2) }); });
        if (p.kind === 'raci') el.querySelectorAll('.k-raci div.x').forEach((c, j) => { const kr = E.outBack(P(lt, t0 + .3 + j * .08, t0 + .6 + j * .08)); tf(c, { s: Math.max(0, kr), o: cl(kr * 2) }); });
      });
    };
  };

  // ---------- badges ----------
  TYPES.badges = (root, v, sc, tm) => {
    const wrap = h(`<div class="k-badges"><div class="hl"></div><div class="k-bdrow"></div>${v.sub ? `<div class="sub">${rich(v.sub)}</div>` : ''}</div>`);
    root.appendChild(wrap);
    const hl = $('.hl', wrap), lines = (v.lines || []).map((l) => { const el = h(`<div class="k-line ${l.size || 'md'}">${rich(l.text)}</div>`); hl.appendChild(el); return el; });
    const row = $('.k-bdrow', wrap), bds = v.badges.map((b) => { const el = h(`<div class="k-bd"><b>${esc(b.text)}</b>${b.small ? `<small>${esc(b.small)}</small>` : ''}<div class="shine"></div></div>`); row.appendChild(el); return el; });
    return (lt) => {
      lines.forEach((el, i) => { const k = E.out3(P(lt, tm.lines[i], tm.lines[i] + .5)); tf(el, { y: (1 - k) * 30, o: k }); });
      bds.forEach((el, i) => {
        const k = E.outBack(P(lt, tm.badges[i], tm.badges[i] + .45));
        tf(el, { s: Math.max(0, k), r: (1 - Math.max(0, k)) * -30, y: k >= 1 ? float(lt, i, 8, .9) : 0, o: cl(k * 2) });
        $('.shine', el).style.left = lerp(-120, 320, P(lt, tm.badges[i] + .3, tm.badges[i] + 1)) + 'px';
      });
      if (v.sub) { const k = E.out3(P(lt, tm.sub, tm.sub + .5)); tf($('.sub', wrap), { y: (1 - k) * 20, o: k }); }
    };
  };

  // ---------- tree: holding & anak usaha ----------
  TYPES.tree = (root, v, sc, tm) => {
    const NS = 'http://www.w3.org/2000/svg', n = v.children.length;
    const RT = pick({ x: SW / 2, y: 330 }, { x: SW / 2, y: 560 });
    const pos = v.children.map((_, i) => {
      if (!V) { const perRow = n > 6 ? Math.ceil(n / 2) : n, row = Math.floor(i / perRow), idx = i % perRow, cnt = row ? n - perRow : perRow; return { x: SW / 2 + (idx - (cnt - 1) / 2) * (1500 / Math.max(cnt, 4)), y: 700 + row * 170 }; }
      return { x: [210, 540, 870][i % 3], y: 900 + Math.floor(i / 3) * 190 };
    });
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', SW); svg.setAttribute('height', SH); svg.style.position = 'absolute'; svg.style.left = '0'; svg.style.top = '0';
    root.appendChild(svg);
    if (v.title) { const t = h(`<div class="k-tree-ttl" style="top:${pick(120, 300)}px">${rich(v.title)}</div>`); root.appendChild(t); }
    const COLS = ['#f97316', '#a855f7', '#eab308', '#ec4899', '#14b8a6', '#ef4444', '#84cc16', '#06b6d4'];
    const lines = pos.map((p) => {
      const path = document.createElementNS(NS, 'path');
      const bend = V ? 110 : 150;
      path.setAttribute('d', `M${RT.x},${RT.y + 40} C${RT.x},${RT.y + bend} ${p.x},${p.y - bend} ${p.x},${p.y - 34}`);
      path.setAttribute('fill', 'none'); path.setAttribute('stroke-width', '3'); path.setAttribute('pathLength', '1'); path.setAttribute('stroke-dasharray', '1');
      svg.appendChild(path);
      return path;
    });
    const rootEl = h(`<div class="k-node root">${rich(v.root)}</div>`);
    root.appendChild(rootEl);
    const kids = v.children.map((c, i) => {
      const el = h(`<div class="k-node">${rich(c.name)}${c.score ? `<span class="sc">${esc(c.score)}</span>` : ''}</div>`);
      root.appendChild(el);
      return el;
    });
    const place = (el, x, y) => { if (el.offsetWidth) { el.style.left = x - el.offsetWidth / 2 + 'px'; el.style.top = y - el.offsetHeight / 2 + 'px'; } };
    return (lt) => {
      place(rootEl, RT.x, RT.y);
      const kr = E.outBack(P(lt, tm.root, tm.root + .45));
      tf(rootEl, { s: Math.max(0, kr), o: cl(kr * 2) });
      const unified = tm.unify != null && lt >= tm.unify, ku = tm.unify != null ? E.io3(P(lt, tm.unify, tm.unify + .6)) : 0;
      kids.forEach((el, i) => {
        place(el, pos[i].x, pos[i].y);
        const k = E.outBack(P(lt, tm.kids[i], tm.kids[i] + .4));
        tf(el, { s: Math.max(0, k) * (unified ? 1 + .06 * Math.sin(Math.PI * P(lt, tm.unify + i * .05, tm.unify + .4 + i * .05)) : 1), o: cl(k * 2) });
        const col = v.colorful ? COLS[i % COLS.length] : '#60a5fa';
        el.style.borderColor = ku > .5 ? '#38bdf8' : col;
        el.style.boxShadow = ku > .5 ? '0 0 30px rgba(56,189,248,.45)' : 'none';
        const scEl = $('.sc', el);
        if (scEl) {
          scEl.style.opacity = tm.scores != null ? P(lt, tm.scores + i * .1, tm.scores + .3 + i * .1) : 0;
          scEl.textContent = unified && ku > .5 ? '✓ selaras' : v.children[i].score;
          scEl.style.color = unified && ku > .5 ? '#86efac' : (v.children[i].tone === 'red' ? '#fca5a5' : v.children[i].tone === 'amber' ? '#fcd34d' : '#86efac');
        }
        const lk = E.io3(P(lt, tm.kids[i] - .3, tm.kids[i] + .1));
        lines[i].setAttribute('stroke-dashoffset', 1 - lk);
        lines[i].setAttribute('stroke', ku > .5 ? 'rgba(56,189,248,.8)' : v.colorful ? col + 'aa' : 'rgba(96,165,250,.6)');
      });
      const tt = $('.k-tree-ttl', root);
      if (tt) tf(tt, { o: P(lt, 0, .5) });
    };
  };

  // ---------- grid: peta pasal (merah / kuning / hijau) ----------
  TYPES.grid = (root, v, sc, tm) => {
    const N = V ? 18 * 12 : 30 * 8;
    const wrap = h(`<div class="k-grid">${v.title ? `<div class="ttl">${rich(v.title)}</div>` : ''}<div class="k-cells"></div><div class="k-legend">${(v.legend || ['Belum', 'Sebagian', 'Sudah']).map((l, i) => `<span style="--c:${['#ef4444', '#f59e0b', '#22c55e'][i]}">${esc(l)}</span>`).join('')}</div></div>`);
    root.appendChild(wrap);
    const cellsEl = $('.k-cells', wrap);
    const cells = Array.from({ length: N }, (_, i) => {
      const el = document.createElement('i'); cellsEl.appendChild(el);
      const r = hash(i * 1.37 + 3);
      return { el, st: r < (v.red ?? .32) ? 'r' : r < (v.red ?? .32) + (v.amber ?? .33) ? 'a' : 'g', fixK: hash(i * 2.11 + 9), scanK: (i % (V ? 18 : 30)) / (V ? 18 : 30) * .7 + hash(i + 5) * .3 };
    });
    return (lt, d) => {
      tf($('.ttl', wrap) || wrap, { o: P(lt, 0, .4) });
      const fixEnd = tm.fix != null ? Math.min(d - .3, tm.fix + (v.fixDur || 2.2)) : 0;
      cells.forEach((c) => {
        const shown = lt >= tm.scan + c.scanK * (v.scanDur || 1.4);
        const fixed = tm.fix != null && lt >= lerp(tm.fix, fixEnd, c.fixK);
        c.el.className = !shown ? '' : fixed ? 'g' : c.st;
      });
      tf($('.k-legend', wrap), { o: P(lt, tm.scan + .5, tm.scan + 1) });
    };
  };

  // ---------- doc: dokumen + stempel ----------
  TYPES.doc = (root, v, sc, tm) => {
    const d0 = h(`<div class="k-doc"><div class="k">${esc(v.kicker || '')}</div><div class="n"><i class="mk"></i><b>${rich(v.title)}</b></div><br>${v.sub ? `<div class="s"><i class="mk" style="background:#93c5fd"></i><span>${rich(v.sub)}</span></div>` : ''}
      <div class="lines"><i style="width:96%"></i><i style="width:88%"></i><i style="width:92%"></i><i style="width:70%"></i><i style="width:84%"></i><i class="vx" style="width:94%"></i><i class="vx" style="width:86%"></i><i class="vx" style="width:64%"></i></div>
      ${v.foot ? `<div class="f">${rich(v.foot)}</div>` : ''}${v.stamp ? `<div class="k-stamp ${v.stamp.color || ''}">${esc(v.stamp.text)}${v.stamp.big ? `<b>${esc(v.stamp.big)}</b>` : ''}</div>` : ''}</div>`);
    root.appendChild(d0);
    const marks = [$('.n .mk', d0), $('.s .mk', d0)];
    return (lt) => {
      const kd = E.out3(P(lt, 0, .7));
      tf(d0, { y: (1 - kd) * 500, rx: (1 - kd) * 35, s: .92 + .08 * kd, o: cl(kd * 2) });
      (v.marks || []).forEach((m, i) => { const mk = marks[m.target === 'sub' ? 1 : 0]; if (mk) mk.style.transform = `scaleX(${E.io3(P(lt, tm.marks[i], tm.marks[i] + .5))})`; });
      marks.forEach((mk, i) => { if (mk && !(v.marks || []).some((m) => (m.target === 'sub' ? 1 : 0) === i)) mk.style.transform = 'scaleX(0)'; });
      if (v.stamp) { const ks = P(lt, tm.stamp - .06, tm.stamp + .14); tf($('.k-stamp', d0), { s: lerp(2.6, 1, E.outExpo(ks)), r: -12, o: ks > 0 ? 1 : 0 }); }
    };
  };

  // ---------- logo (reveal di tengah iklan) ----------
  function rings(root, cx, cy) {
    const box = h(`<div class="abs" style="left:${cx}px;top:${cy}px"></div>`);
    root.appendChild(box);
    const rs = Array.from({ length: 4 }, () => { const r = h('<div class="k-ring"></div>'); box.appendChild(r); return r; });
    return (lt, t0 = 0) => rs.forEach((r, i) => {
      const k = P(lt, t0 + i * .25, t0 + i * .25 + 2.2), sz = 60 + E.out3(k) * (V ? 1900 : 1600);
      Object.assign(r.style, { width: sz + 'px', height: sz + 'px', left: -sz / 2 + 'px', top: -sz / 2 + 'px', opacity: (1 - k) * (k > 0 ? .8 : 0) });
    });
  }
  TYPES.logo = (root, v, sc, tm) => {
    const ring = rings(root, SW / 2, pick(470, 860));
    const lg = h(`<div class="k-logo" style="top:${pick(390, 780)}px"><div class="mw" style="position:relative"><img src="${LOGO}" alt=""></div>${v.nexus !== false ? '<div class="nx">NEXUS</div>' : ''}${v.tagline ? `<div class="tg">${rich(v.tagline)}</div>` : ''}</div>`);
    root.appendChild(lg);
    return (lt) => {
      ring(lt, 0);
      const kl = P(lt, tm.mark, tm.mark + .9);
      const mw = $('.mw', lg);
      mw.style.clipPath = `inset(0 ${100 - E.io3(kl) * 100}% 0 0)`;
      tf(mw, { s: lerp(1.08, 1, E.out3(kl)), o: kl > 0 ? 1 : 0 });
      const nx = $('.nx', lg);
      if (nx) { const kn = E.out3(P(lt, tm.nexus, tm.nexus + .5)); nx.style.letterSpacing = lerp(1.4, .6, kn) + 'em'; tf(nx, { o: kn, blur: (1 - kn) * 10 }); }
      const tg = $('.tg', lg);
      if (tg) { const kt = E.out3(P(lt, tm.tag, tm.tag + .5)); tf(tg, { y: (1 - kt) * 20, o: kt }); }
    };
  };

  // ---------- cta: penutup ----------
  TYPES.cta = (root, v, sc, tm) => {
    const ring = rings(root, SW / 2, pick(520, 880));
    const lg = h(`<div class="k-logo" style="top:${pick(v.nexus === false ? 170 : 130, 300)}px"><img src="${LOGO}" alt="" style="width:${pick(600, 800)}px">${v.nexus !== false ? `<div class="nx" style="font-size:${pick(38, 50)}px;margin-top:14px">NEXUS</div>` : ''}</div>`);
    root.appendChild(lg);
    const ln = h(`<div class="k-cta-lines" style="top:${pick(v.nexus === false ? 380 : 400, 690)}px">${(v.lines || []).map((l) => `<div class="cl ${l.size || ''}">${rich(l.text)}</div>`).join('')}</div>`);
    root.appendChild(ln);
    const lnW = [...ln.children].map((el) => splitWords(el));
    const btn = h(`<div class="k-btn" style="top:${pick(700, 1170)}px">${esc(v.button || 'privasimu.com')}<div class="shine"></div></div>`);
    root.appendChild(btn);
    const foot = v.foot ? h(`<div class="k-foot" style="top:${pick(850, 1330)}px">${rich(v.foot)}</div>`) : null;
    if (foot) root.appendChild(foot);
    const fade = h('<div class="k-fade"></div>');
    root.appendChild(fade);
    return (lt, d) => {
      ring(lt, 0);
      const kl = E.out3(P(lt, 0, .8));
      tf(lg, { s: lerp(1.2, 1, kl), o: kl, blur: (1 - kl) * 12 });
      lnW.forEach((ws, i) => revealWords(ws, tm.lines[i] - .05, lt, { stagger: .07, dur: .7 }));
      const kb = E.outBack(P(lt, tm.btn, tm.btn + .45));
      tf(btn, { s: .5 + .5 * Math.max(0, kb), o: cl(kb) });
      $('.shine', btn).style.left = lerp(-200, 800, P((lt - tm.btn - .5) % 2.2, 0, .8)) + 'px';
      if (foot) tf(foot, { o: E.out3(P(lt, tm.btn + .4, tm.btn + .9)) });
      fade.style.opacity = P(lt, d - .7, d);
    };
  };

  // ---------- meme (format dibuat ulang, orisinal) ----------
  TYPES.meme = (root, v, sc, tm) => {
    const W0 = h(`<div class="k-meme ${v.variant || 'pov'}"></div>`);
    root.appendChild(W0);
    const pop = (el, t, lt, i = 0) => { const k = E.outBack(P(lt, t, t + .4)); tf(el, { s: .6 + .4 * Math.max(0, k), y: k >= 1 ? float(lt, i, 4) : (1 - k) * 40, o: cl(k * 2) }); };
    if (v.variant === 'drake') {
      const rows = v.rows.map((r, i) => { const el = h(`<div class="mr ${i ? 'yes' : 'no'}"><div class="em">${r.emoji || (i ? '😎' : '🙅')}</div><div class="tx">${rich(r.text)}</div></div>`); W0.appendChild(el); return el; });
      return (lt) => rows.forEach((el, i) => {
        pop(el, tm.rows[i], lt, i);
        const em = $('.em', el), k = P(lt, tm.rows[i] + .1, tm.rows[i] + .5);
        em.style.transform = `rotate(${Math.sin(lt * 3 + i) * 6}deg) scale(${.6 + .4 * outQuint(k)})`;
        el.style.filter = i === 0 && lt > tm.rows[1] ? 'grayscale(1) brightness(.7)' : 'none';
      });
    }
    if (v.variant === 'expect') {
      const mk = (side, cls) => { const el = h(`<div class="ex ${cls}"><div class="lb">${esc(side.label)}</div><div class="em">${side.emoji || ''}</div><div class="tx">${rich(side.text)}</div></div>`); W0.appendChild(el); return el; };
      const L = mk(v.left, 'l'), Rr = mk(v.right, 'r');
      return (lt) => {
        pop(L, tm.left, lt, 0); pop(Rr, tm.right, lt, 1);
        const sh = lt > tm.right && lt < tm.right + .35 ? (1 - (lt - tm.right) / .35) * 16 : 0;
        Rr.style.translate = `${(hash(lt * 77) - .5) * sh}px ${(hash(lt * 55) - .5) * sh}px`;
      };
    }
    if (v.variant === 'nobody') {
      const lines = v.lines.map((l) => { const el = h(`<div class="nl">${rich(l.text)}</div>`); W0.appendChild(el); return el; });
      const em = h(`<div class="nem">${v.emoji || '👀'}</div>`); W0.appendChild(em);
      return (lt) => {
        lines.forEach((el, i) => { const k = outQuint(P(lt, tm.lines[i], tm.lines[i] + .5)); tf(el, { x: (1 - k) * -60, o: k }); });
        const k = P(lt, tm.emoji - .02, tm.emoji + .25);
        tf(em, { s: lerp(2.4, 1, E.outExpo(k)) * (1 + .03 * Math.sin(lt * 5)), r: Math.sin(lt * 2) * 4, o: k > 0 ? 1 : 0 });
      };
    }
    const tx = h(`<div class="pv">${rich(v.text)}</div>`), em = h(`<div class="nem">${v.emoji || '🙂'}</div>`);
    W0.appendChild(tx); W0.appendChild(em);
    const txW = splitWords(tx);
    return (lt) => {
      revealWords(txW, tm.text, lt, { stagger: .05 });
      const k = P(lt, tm.emoji - .02, tm.emoji + .25);
      tf(em, { s: lerp(2.4, 1, E.outExpo(k)), r: Math.sin(lt * 2) * 5, o: k > 0 ? 1 : 0 });
    };
  };

  // ---------- stiker emoji / gambar (bisa ditempel di scene mana pun lewat vis.stickers) ----------
  function stickers(root, v, T) {
    const times = KE.stickerTimes(v, T);
    const els = (v.stickers || []).map((s, i) => {
      const el = h(`<div class="k-stk">${s.img ? `<img src="${esc(s.img)}" alt="">` : esc(s.e || '✨')}</div>`);
      const pos = V && s.v ? s.v : s;
      el.style.left = (pos.x ?? .8) * SW + 'px'; el.style.top = (pos.y ?? .2) * SH + 'px';
      el.style.fontSize = (s.size || 150) + 'px';
      if (s.img) el.firstChild.style.width = (s.size || 150) * 1.4 + 'px';
      root.appendChild(el);
      return { el, rot: s.rot ?? (hash(i * 3.7 + 1) - .5) * 30 };
    });
    return (lt) => els.forEach(({ el, rot }, i) => {
      const k = P(lt, times[i], times[i] + .5);
      el.style.opacity = k > 0 ? 1 : 0;
      el.style.transform = `translate(-50%, -50%) scale(${Math.max(0, E.outElastic(k))}) rotate(${rot + Math.sin(lt * 2.2 + i) * 6}deg)`;
    });
  }

  // ---------- hook gaya per iklan (dipanggil dari <iklan>/style.js sebelum KIT.run) ----------
  const STYLE = { fonts: [], bg: null, frame: null, themes: {} };
  function style(opt) { Object.assign(STYLE, opt, { themes: Object.assign(STYLE.themes, opt.themes || {}) }); }
  function registerType(name, fn) { TYPES[name] = fn; }

  // ---------- latar ----------
  const THEMES = {
    danger: ['#5c0f18', '#1a0508', '#030204', 'rgba(248,113,113,.08)', 'rgba(254,202,202,.5)'],
    warn: ['#2a1d06', '#0b0906', '#030305', 'rgba(251,191,36,.07)', 'rgba(253,230,138,.5)'],
    brand: ['#12367f', '#071433', '#02050e', 'rgba(125,211,252,.10)', 'rgba(125,211,252,.6)'],
    calm: ['#0b4a52', '#062226', '#020709', 'rgba(94,234,212,.08)', 'rgba(153,246,228,.55)'],
    dark: ['#1b2340', '#0a0e1c', '#03040a', 'rgba(165,180,252,.08)', 'rgba(199,210,254,.5)'],
  };
  function makeBg(themeOf) {
    const bg = $('#bg'), cx = bg.getContext('2d'), grain = $('#grain'), gx = grain.getContext('2d');
    const DUST = Array.from({ length: 70 }, (_, i) => ({ x: hash(i + 1) * SW, y: hash(i + 101) * SH, s: .8 + hash(i + 201) * 2.2, v: 6 + hash(i + 301) * 22 }));
    const BLOBS = Array.from({ length: 4 }, (_, i) => ({ x: hash(i + 41), y: hash(i + 43), r: .45 + hash(i + 47) * .35, sx: .05 + hash(i + 51) * .06, sy: .04 + hash(i + 53) * .05, ph: hash(i + 57) * 6 }));
    return (t, id, lt) => {
      const themeName = themeOf[id];
      const th = STYLE.themes[themeName] || THEMES[themeName] || THEMES.brand;
      if (STYLE.bg) STYLE.bg(cx, t, id, themeName, SW, SH, lt);
      else {
        cx.fillStyle = th[2]; cx.fillRect(0, 0, SW, SH);
        // gradient blob organik yang bergerak pelan
        cx.globalCompositeOperation = 'lighter';
        BLOBS.forEach((b, i) => {
          const x = (b.x + Math.sin(t * b.sx * 6 + b.ph) * .18) * SW, y = (b.y + Math.cos(t * b.sy * 6 + b.ph) * .15) * SH, r = b.r * Math.max(SW, SH);
          const g = cx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, i % 2 ? th[1] : th[0]); g.addColorStop(1, 'rgba(0,0,0,0)');
          cx.globalAlpha = i % 2 ? .55 : .75;
          cx.fillStyle = g; cx.fillRect(0, 0, SW, SH);
        });
        cx.globalCompositeOperation = 'source-over'; cx.globalAlpha = 1;
      }
      cx.fillStyle = th[4];
      for (const p of DUST) {
        const y = ((p.y - t * p.v) % SH + SH) % SH;
        cx.globalAlpha = .2 + .3 * Math.sin(t * 1.7 + p.x);
        cx.beginPath(); cx.arc(p.x, y, p.s, 0, 7); cx.fill();
      }
      cx.globalAlpha = 1;
      const img = gx.createImageData(480, 270), seed = Math.floor(t * 30);
      for (let i = 0; i < img.data.length; i += 4) { const vv = hash(i * .37 + seed * 13.1) * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = vv; img.data[i + 3] = 255; }
      gx.putImageData(img, 0, 0);
    };
  }

  // ---------- rakit ----------
  // versi per sales: ganti kontak umum di data scene SEBELUM dirakit (teks yang nanti dipecah per huruf/kata ikut terganti)
  function deepKontak(o) {
    if (Array.isArray(o)) o.forEach((x, i) => { if (typeof x === 'string') o[i] = MG.kontak(x); else deepKontak(x); });
    else if (o && typeof o === 'object') for (const k in o) { if (typeof o[k] === 'string') o[k] = MG.kontak(o[k]); else deepKontak(o[k]); }
  }
  function run(PRV) {
    if (MG.KONTAK) PRV.SCENES.forEach((s) => deepKontak(s.vis));
    const TL = window.TIMELINE, stage = $('#stage');
    stage.innerHTML = '<canvas id="bg"></canvas>';
    const R = {}, themeOf = {}, fx = {};
    PRV.SCENES.forEach((s) => {
      const sc = TL.scenes.find((x) => x.id === s.id);
      const sec = h(`<section class="scene t-${s.theme || 'brand'}" id="s-${s.id}"></section>`);
      stage.appendChild(sec);
      themeOf[s.id] = s.theme || 'brand';
      const T = KE.resolver(sc, window.wordTime);
      const tm = KE.TIMING[s.vis.type] ? KE.TIMING[s.vis.type](s.vis, T) : {};
      if (!TYPES[s.vis.type]) throw new Error('Tipe scene tidak dikenal: ' + s.vis.type);
      const render = TYPES[s.vis.type](sec, s.vis, sc, tm, T);
      const stk = stickers(sec, s.vis, T);
      const hits = (s.vis.shake || []).map((x) => T(x, 0));
      fx[s.id] = { flash: s.vis.flash, blackEnd: s.vis.blackEnd };
      const last = s === PRV.SCENES[PRV.SCENES.length - 1];
      R[s.id] = (lt, d) => {
        render(lt, d);
        stk(lt);
        const sh = MG.shakeAmt(lt, hits, .3, 14), push = s.vis.push ?? .035;
        // transisi elegan: masuk lewat blur + skala, keluar lewat blur (dip-through-blur)
        const kin = s.vis.enter === 'none' ? 1 : outQuint(P(lt, 0, .5)), kout = last || s.vis.exit === 'none' ? 0 : E.in3(P(lt, d - .32, d));
        const bl = (1 - kin) * 10 + kout * 12;
        sec.style.transform = `translate(${(hash(lt * 91) - .5) * sh}px, ${(hash(lt * 71) - .5) * sh}px) scale(${(1 + push * (lt / d)) * (1 + (1 - kin) * .04 - kout * .03)})`;
        sec.style.filter = bl > .3 ? `blur(${bl.toFixed(1)}px)` : 'none';
        sec.style.opacity = Math.min(1, kin * 1.4) * (1 - kout);
        if (STYLE.frame) STYLE.frame(s.id, lt, d, sec);
      };
    });
    stage.insertAdjacentHTML('beforeend', '<canvas id="grain" width="480" height="270"></canvas><div id="vignette"></div><div id="flash"></div><div id="black"></div>');
    MG.boot({
      R,
      fonts: STYLE.fonts,
      drawBg: makeBg(themeOf),
      pre: (t, cur, lt) => {
        const f = fx[cur.id];
        $('#flash').style.opacity = f.flash ? Math.max(0, .9 - lt / .35) : 0;
        $('#black').style.opacity = f.blackEnd ? P(lt, cur.dur - .25, cur.dur - .08) : 0;
      },
    });
  }

  window.KIT = { run, TYPES, icon, style, registerType, splitWords, revealWords, float, h, esc, rich, $, pick, V, SW, SH };
})();
