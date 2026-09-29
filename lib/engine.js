// Engine bersama untuk halaman animasi: format (16:9 / 9:16), util animasi, subtitle karaoke, boot & pratinjau ber-audio.
// Query: ?fmt=16x9|9x16  &cap=0|1 (subtitle; bawaan: aktif di 9:16)  &render=1 (dipakai renderer, tanpa UI pratinjau)
(function () {
  const q = new URLSearchParams(location.search);
  const FORMATS = { '16x9': [1920, 1080], '9x16': [1080, 1920] };
  const fmt = FORMATS[q.get('fmt')] ? q.get('fmt') : '16x9';
  const [width, height] = FORMATS[fmt];
  const V = height > width;
  const RENDER = q.get('render') === '1';
  const CAP = q.has('cap') ? q.get('cap') === '1' : V;
  const root = document.documentElement;
  root.classList.add('f-' + fmt, V ? 'v' : 'h');
  root.style.setProperty('--W', width + 'px');
  root.style.setProperty('--H', height + 'px');

  // ---------- util ----------
  const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const P = (t, a, b) => cl((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const E = {
    out3: (k) => 1 - Math.pow(1 - k, 3),
    in3: (k) => k * k * k,
    io3: (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    outExpo: (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k)),
    inExpo: (k) => (k === 0 ? 0 : Math.pow(2, 10 * k - 10)),
    outBack: (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    outElastic: (k) => (k === 0 || k === 1 ? k : Math.pow(2, -10 * k) * Math.sin((k * 10 - .75) * (2 * Math.PI / 3)) + 1),
  };
  function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function tf(el, o) {
    const { x = 0, y = 0, s = 1, r = 0, o: op = 1, blur = 0, rx = 0, ry = 0, sx, sy } = o;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) rotateX(${rx}deg) rotateY(${ry}deg) scale(${sx ?? s}, ${sy ?? s})`;
    el.style.opacity = op;
    el.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
  }
  const fmtNum = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  function glitch(el, t, amt, color = true) {
    if (amt <= 0.01) { el.style.textShadow = 'none'; el.style.clipPath = 'none'; return; }
    const f = Math.floor(t * 30), dx = (hash(f) - .5) * 40 * amt, dy = (hash(f + 7) - .5) * 10 * amt;
    el.style.textShadow = color ? `${dx}px ${dy}px 0 rgba(239,68,68,.9), ${-dx}px ${-dy}px 0 rgba(56,189,248,.8)` : 'none';
    if (hash(f + 3) < .35 * amt) { const a = hash(f + 5) * 80, b = a + 10 + hash(f + 6) * 30; el.style.clipPath = `polygon(0 ${a}%, 100% ${a}%, 100% ${b}%, 0 ${b}%)`; }
    else el.style.clipPath = 'none';
  }
  // Guncangan kamera singkat setelah tiap waktu hit
  function shakeAmt(lt, hits, dur = .3, amp = 14) {
    return hits.reduce((a, th) => a + (lt > th && lt < th + dur ? (1 - (lt - th) / dur) * amp : 0), 0);
  }
  function shake(el, amt, seed) {
    el.style.transform = amt > 0.05 ? `translate(${(hash(seed * 91) - .5) * amt}px, ${(hash(seed * 71) - .5) * amt}px)` : '';
  }
  const pick = (h, v) => (V ? v : h);

  // ---------- subtitle karaoke ----------
  let capEl = null, capLines = [];
  function setupCaptions(TL) {
    capLines = (TL.captions || {})[fmt] || [];
    const css = document.createElement('style');
    css.textContent = `
      #mg-cap { position: absolute; left: 0; right: 0; bottom: ${V ? 330 : 64}px; text-align: center; pointer-events: none; z-index: 50; }
      #mg-cap .ln { display: inline-block; max-width: ${V ? 940 : 1500}px; padding: ${V ? '14px 26px' : '10px 24px'}; border-radius: 18px;
        background: rgba(2, 6, 23, .62); font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: ${V ? 52 : 38}px; line-height: 1.22;
        color: #fff; letter-spacing: -.01em; box-shadow: 0 10px 30px rgba(0,0,0,.35); }
      #mg-cap span { opacity: .55; }
      #mg-cap span.on { opacity: 1; }
      #mg-cap span.cur { color: #fde047; }`;
    document.head.appendChild(css);
    capEl = document.createElement('div');
    capEl.id = 'mg-cap';
    const stage = document.getElementById('stage'), flash = document.getElementById('flash');
    if (flash && flash.parentNode === stage) stage.insertBefore(capEl, flash); else stage.appendChild(capEl);
  }
  function renderCaptions(t) {
    if (!capEl) return;
    const line = capLines.find((l) => t >= l.start && t < l.end);
    if (!line) { capEl.style.opacity = 0; return; }
    if (capEl.dataset.k !== String(line.start)) {
      capEl.dataset.k = String(line.start);
      capEl.innerHTML = `<div class="ln">${line.words.map((w) => `<span>${w.text}</span>`).join(' ')}</div>`;
    }
    const k = E.out3(P(t, line.start, line.start + .14));
    capEl.style.opacity = k;
    capEl.firstChild.style.transform = `translateY(${(1 - k) * 14}px)`;
    let cur = -1;
    line.words.forEach((w, i) => { if (t >= w.t) cur = i; });
    capEl.querySelectorAll('span').forEach((s, i) => { s.className = i < cur ? 'on' : i === cur ? 'on cur' : ''; });
  }

  // ---------- pratinjau interaktif (di luar renderer) ----------
  function setupPreview(TL) {
    const ad = decodeURIComponent(location.pathname).split('/').slice(-2)[0];
    const audio = new Audio(`../out/${ad}/mix.wav`);
    const ui = document.createElement('div');
    ui.innerHTML = `<button id="mg-play" style="position:fixed;z-index:999;left:50%;top:50%;transform:translate(-50%,-50%);font:800 34px 'Plus Jakarta Sans',sans-serif;
      padding:26px 48px;border-radius:999px;border:0;background:#2563eb;color:#fff;cursor:pointer;box-shadow:0 20px 60px rgba(0,0,0,.5)">▶ Putar pratinjau (dengan audio)</button>`;
    document.body.appendChild(ui);
    const btn = ui.firstChild;
    let raf = 0;
    const loop = () => { window.seek(audio.currentTime); if (!audio.paused) raf = requestAnimationFrame(loop); };
    btn.onclick = () => {
      btn.style.display = 'none';
      audio.currentTime = 0;
      audio.play().then(() => { raf = requestAnimationFrame(loop); }).catch(() => { btn.textContent = 'Audio belum dibuat — jalankan build dulu'; btn.style.display = 'block'; });
    };
    audio.onended = () => { cancelAnimationFrame(raf); btn.textContent = '↻ Putar ulang'; btn.style.display = 'block'; };
    document.addEventListener('keydown', (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (audio.paused) { btn.style.display = 'none'; audio.play(); raf = requestAnimationFrame(loop); } else audio.pause();
    });
  }

  // ---------- boot ----------
  const FONT_LOADS = ['400 20px "Plus Jakarta Sans"', '500 20px "Plus Jakarta Sans"', '600 20px "Plus Jakarta Sans"',
    '700 20px "Plus Jakarta Sans"', '800 20px "Plus Jakarta Sans"', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'];
  function boot({ R, drawBg, pre, post, fonts = [] }) {
    const TL = window.TIMELINE;
    const bg = document.getElementById('bg');
    if (bg) { bg.width = width; bg.height = height; }
    let last = null;
    window.seek = function (t) {
      t = cl(t, 0, TL.total - 1e-4);
      let cur = TL.scenes[0];
      for (const s of TL.scenes) if (t >= s.start) cur = s;
      const lt = t - cur.start;
      if (cur !== last) {
        document.querySelectorAll('.scene').forEach((el) => (el.style.display = el.id === 's-' + cur.id ? 'block' : 'none'));
        last = cur;
      }
      if (pre) pre(t, cur, lt);
      if (drawBg) drawBg(t, cur.id, lt);
      R[cur.id](lt, cur.dur, t);
      if (post) post(t, cur, lt);
      renderCaptions(t);
    };
    // emoji yang dipakai halaman -> muat subset Noto Color Emoji-nya dulu (hindari fallback ke emoji sistem)
    const emoji = [...new Set([...document.body.textContent].filter((c) => /\p{Extended_Pictographic}/u.test(c)))].join('');
    const emojiLoad = emoji ? [document.fonts.load('40px "Noto Color Emoji"', emoji).catch(() => null)] : [];
    Promise.all(FONT_LOADS.concat(fonts).map((f) => document.fonts.load(f).catch(() => null)).concat(emojiLoad))
      .then(() => document.fonts.ready)
      .then(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r))))))
      .then(() => {
        if (CAP) setupCaptions(TL);
        window.seek(0);
        window.READY = true;
        if (!RENDER) setupPreview(TL);
      });
  }

  // Waktu kata untuk scene tertentu (fallback bila kata tidak ada)
  function wt(sceneId, spec, fb = 0) {
    const sc = window.TIMELINE.scenes.find((s) => s.id === sceneId);
    try { return window.wordTime(sc, 'w:' + spec); } catch (e) { return fb; }
  }

  window.MG = { fmt, width, height, V, CAP, RENDER, cl, P, lerp, E, hash, tf, fmtNum, glitch, shakeAmt, shake, pick, boot, wt };
})();
