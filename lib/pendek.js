// Pustaka kecil untuk video pendek satu gaya (seri katalog gaya: TY.., GB.., PF.., SN.., UI..).
// Dimuat setelah kit.js dan sebelum style.js. Isinya hanya hal yang sama di semua video:
//   PD.sync(sc)            pencocok kata VO berurutan → waktu lokal scene
//   PD.kata(el, sc, o)     pecah teks elemen jadi kata; tiap kata diberi waktu muncul (dari VO atau manual)
//   PD.tampil(ws, lt, fx)  keadaan kata pada detik lt: 'naik' | 'pop' | 'hantam' | 'pudar' | 'ketik' | 'karaoke'
//                          ('karaoke': kalimat sudah terlihat redup sejak awal, tiap kata menyala saat diucapkan)
//   PD.huruf(el)           pecah teks jadi span per huruf
//   PD.muat(el, w, h)      skala supaya elemen muat di kotak w × h (ukur malas di render pertama)
//   PD.cta(root, v, T)     kartu penutup: logo, kalimat penutup, tombol alamat situs, kontak
//   PD.layar(root, nama, o) kartu berisi layar aplikasi ASLI (assets/app/<nama>.png), dipotong ke bagian yang penting
//   PD.lapis(id, z)        lapisan yang hidup lintas scene (z = 0: di bawah semua scene; z > 0: di atasnya)
// Tampilan kartu penutup diatur tiap video lewat variabel CSS (lihat pendek.css), jadi tetap mengikuti gayanya.
// JANGAN mengubah perilaku fungsi yang sudah ada: video yang sudah dirender bergantung padanya.
(function () {
  const { V, SW, SH, h, esc, rich, $ } = KIT;
  const { P, cl, lerp, E, tf } = MG;
  const LOGO = '../assets/privasimu_logo.png';
  const norm = (s) => String(s).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

  // ---------- waktu kata dari VO ----------
  function sync(sc) {
    const off = sc.voStart - sc.start;
    const W = (sc.words || []).map((w) => ({ n: norm(w.w), t: off + w.t }));
    let cur = 0, last = off;
    return {
      next(word) {
        const n = norm(word);
        for (let j = cur; n && j < W.length; j++) {
          const m = W[j].n;
          if (m === n || (n.length > 2 && m.startsWith(n)) || (m.length > 2 && n.startsWith(m))) { cur = j + 1; last = W[j].t; return last; }
        }
        last += 0.1;
        return last;
      },
      seek(t) { while (cur < W.length && W[cur].t <= t + 1e-3) cur++; last = t; },
      akhir: () => (W.length ? W[W.length - 1].t : off),
    };
  }

  // Pecah teks (boleh berisi <em>) menjadi kata. o: { m: pencocok, dari: cocokkan VO sejak detik ini, at: detik manual,
  //   step: jeda antarkata bila manual, huruf: true }
  function kata(el, sc, o = {}) {
    const m = o.m || sync(sc), out = [];
    if (o.at != null) m.seek(o.at);
    if (o.dari != null) m.seek(o.dari); // mulai mencocokkan kata VO sejak detik ini
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'pd-w';
            const inner = document.createElement('span'); inner.className = 'pd-i';
            if (o.huruf) [...part].forEach((ch) => { const l = document.createElement('span'); l.className = 'pd-l'; l.textContent = ch; inner.appendChild(l); });
            else inner.textContent = part;
            w.appendChild(inner); frag.appendChild(w);
            const t = o.at != null ? o.at + i * (o.step ?? 0.07) : m.next(part);
            out.push({ el: w, i: inner, l: o.huruf ? [...inner.children] : null, t, teks: part });
            i++;
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return out;
  }

  function tampil(ws, lt, fx = 'naik') {
    for (const w of ws) {
      const u = lt - w.t;
      if (fx === 'karaoke') { w.el.style.opacity = lerp(0.38, 1, P(u, -0.04, 0.12)).toFixed(3); continue; }
      if (u < 0) { w.el.style.opacity = 0; continue; }
      w.el.style.opacity = 1;
      if (fx === 'naik') w.i.style.transform = `translateY(${((1 - E.out3(P(u, 0, 0.3))) * 105).toFixed(1)}%)`;
      else if (fx === 'pop') w.i.style.transform = `scale(${E.outBack(P(u, 0, 0.32)).toFixed(3)})`;
      else if (fx === 'hantam') { w.i.style.transform = `scale(${lerp(2.4, 1, E.outExpo(P(u, 0, 0.2))).toFixed(3)})`; w.el.style.opacity = P(u, 0, 0.04); }
      else if (fx === 'ketik' && w.l) w.l.forEach((l, j) => { l.style.opacity = u >= j * 0.035 ? 1 : 0; });
      else w.el.style.opacity = P(u, 0, 0.3);
    }
  }

  function huruf(el) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach((ch) => {
            if (/\s/.test(ch)) { frag.appendChild(document.createTextNode(ch)); return; }
            const l = document.createElement('span'); l.className = 'pd-l'; l.textContent = ch; frag.appendChild(l); out.push(l);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    return out;
  }

  // skala supaya muat; hasil ukur disimpan di elemen (font sudah dimuat saat render pertama)
  function muat(el, w, hh, maks = 1) {
    if (el._pd == null) {
      const ew = el.offsetWidth, eh = el.offsetHeight;
      if (!ew || !eh) return 1;
      el._pd = Math.min(maks, w / ew, hh ? hh / eh : Infinity);
    }
    return el._pd;
  }

  // ---------- kartu penutup ----------
  // v: { tag, btn, sub, foot, terang, tirai, at, tagAt, btnAt, footAt, nexus }
  function cta(root, v = {}, T = (x, fb) => (typeof x === 'number' ? x : fb)) {
    const box = h(`<div class="pd-cta ${v.terang ? 'terang' : ''} ${v.kelas || ''}">
      ${v.tirai === false ? '' : '<div class="pd-tirai"></div>'}
      <div class="pd-kol">
        <div class="pd-logo"><img src="${LOGO}" alt="">${v.nexus === false ? '' : '<div class="pd-nx">NEXUS</div>'}</div>
        ${v.tag ? `<div class="pd-tag">${rich(v.tag).replace(/\|/g, '<br>')}</div>` : ''}
        <div class="pd-btn">${esc(v.btn || 'privasimu.com')}</div>
        ${v.sub === false ? '' : `<div class="pd-sub">${rich(v.sub || 'Cek kesiapanmu · *gratis*')}</div>`}
        <div class="pd-foot">${esc(v.foot || 'support@privasimu.com · 0851 8318 2722')}</div>
      </div></div>`);
    root.appendChild(box);
    const tirai = $('.pd-tirai', box), logo = $('.pd-logo', box), tag = $('.pd-tag', box), btn = $('.pd-btn', box), sub = $('.pd-sub', box), foot = $('.pd-foot', box);
    const t0 = T(v.at, 0.15), tTag = T(v.tagAt, t0 + 0.35), tBtn = T(v.btnAt, tTag + 0.7), tFoot = T(v.footAt, tBtn + 0.45);
    return (lt) => {
      const k0 = P(lt, t0 - 0.25, t0 + 0.2);
      box.style.visibility = k0 > 0 ? 'visible' : 'hidden';
      if (tirai) tirai.style.opacity = E.io3(k0);
      const kl = E.out3(P(lt, t0, t0 + 0.5));
      tf(logo, { y: (1 - kl) * 34, o: kl });
      if (tag) { const k = E.out3(P(lt, tTag, tTag + 0.5)); tf(tag, { y: (1 - k) * 26, o: k }); }
      const kb = P(lt, tBtn, tBtn + 0.4);
      tf(btn, { s: kb > 0 ? E.outBack(kb) : 0, o: cl(kb * 4) });
      if (sub) tf(sub, { o: P(lt, tBtn + 0.25, tBtn + 0.6) });
      tf(foot, { o: P(lt, tFoot, tFoot + 0.4) });
    };
  }

  // ---------- layar aplikasi asli ----------
  // o: { w: lebar kartu (px), potong: [x, y, w, h] piksel gambar sumber, judul, bar: false, kelas }
  function layar(root, nama, o = {}) {
    const [px, py, pw, ph] = o.potong, w = o.w, s = w / pw, hh = Math.round(ph * s);
    const bar = o.bar === false ? '' : `<div class="pd-bar"><i></i><i></i><i></i><span>${esc(o.judul || 'Privasimu Nexus')}</span></div>`;
    const el = h(`<div class="pd-layar ${o.kelas || ''}" style="width:${w}px">${bar}<div class="pd-shot" style="height:${hh}px">
      <img src="../assets/app/${nama}.png" alt="" style="transform: scale(${s.toFixed(5)}) translate(${-px}px, ${-py}px)"></div></div>`);
    root.appendChild(el);
    el._w = w; el._h = hh + (o.bar === false ? 0 : 46);
    return el;
  }

  // ---------- lapisan lintas scene ----------
  // Elemen yang harus menyambung antarscene (kartu huruf, kanvas, dsb.) ditaruh di sini dan digambar dari waktu global.
  function lapis(id, z = 0) {
    let el = document.getElementById(id);
    if (el) return el;
    el = h(`<div id="${id}" class="pd-lapis"></div>`);
    const stage = $('#stage');
    if (z > 0) { el.style.zIndex = z; stage.appendChild(el); } else stage.insertBefore(el, $('#bg').nextSibling);
    return el;
  }

  KIT.registerType('pd_cta', (root, v, sc, tm, T) => cta(root, v, T));

  window.PD = { norm, sync, kata, tampil, huruf, muat, cta, layar, lapis, LOGO };
})();
