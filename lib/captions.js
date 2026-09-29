// Subtitle otomatis dari timing kata TTS: baris karaoke (dibakar ke video 9:16) + berkas .srt.
const { norm } = require('./wordtime');

// Kata terucap -> tulisan (angka, singkatan). Dicocokkan berurutan, tanpa beda huruf besar/kecil.
const MERGE = [
  ['tiga kali dua puluh empat jam', '3×24 jam'],
  ['dua ribu dua puluh tujuh', '2027'],
  ['dua ribu dua puluh enam', '2026'],
  ['dua ribu dua puluh dua', '2022'],
  ['tujuh puluh dua', '72'],
  ['tiga puluh tiga', '33'],
  ['dua puluh tujuh', '27'],
  ['dua puluh', '20'],
  ['enam belas', '16'],
  ['dua persen', '2%'],
  ['privasimu dot com', 'privasimu.com'],
].map(([a, b]) => [a.split(' '), b]);

function mergeWords(words, extra = []) {
  const out = [];
  const merges = extra.map(([a, b]) => [a.split(' '), b]).concat(MERGE);
  for (let i = 0; i < words.length;) {
    let hit = null;
    for (const [seq, rep] of merges) {
      if (i + seq.length <= words.length && seq.every((s, k) => norm(words[i + k].w) === s)) { hit = [seq.length, rep]; break; }
    }
    if (hit) {
      const last = words[i + hit[0] - 1];
      out.push({ w: hit[1], t: words[i].t, end: last.t + last.d, n: hit[0] });
      i += hit[0];
    } else {
      out.push({ w: words[i].w.replace(/[.,?!]$/, ''), t: words[i].t, end: words[i].t + words[i].d, n: 1 });
      i++;
    }
  }
  return out;
}

// Pecah jadi baris <= maxChars, utamakan patah di tanda baca dari naskah asli
function buildCaptions(scenes, SCENES, maxChars, extra = []) {
  const lines = [];
  scenes.forEach((sc, si) => {
    if (!sc.words.length) return; // scene tanpa VO
    const words = mergeWords(sc.words, extra || []).map((w) => ({ ...w, t: sc.voStart + w.t, end: sc.voStart + w.end }));
    // sisipkan tanda baca dari naskah (edge-tts membuangnya): selaraskan kata TTS dengan token naskah secara berurutan
    const script = SCENES[si].vo.split(/\s+/);
    let j = 0;
    const toks = words.map((w, wi) => {
      const first = norm(sc.words[words.slice(0, wi).reduce((a, x) => a + x.n, 0)].w);
      for (let k = j; k < Math.min(script.length, j + 4); k++) if (norm(script[k]) === first) { j = k; break; }
      const tok = script[j + w.n - 1] || '';
      j += w.n;
      return { text: w.w + (/[.,?!:]$/.test(tok) ? tok.slice(-1) : ''), t: w.t, end: w.end };
    });
    // klausa (patah di tanda baca) -> dipecah seimbang bila terlalu panjang -> klausa pendek digabung
    const L = (ws) => ws.reduce((a, w) => a + w.text.length + 1, -1);
    const clauses = [];
    let cur = [];
    toks.forEach((w) => { cur.push(w); if (/[,.?!:]$/.test(w.text)) { clauses.push(cur); cur = []; } });
    if (cur.length) clauses.push(cur);
    const pieces = [];
    for (const c of clauses) {
      const k = Math.ceil(L(c) / maxChars), target = L(c) / k;
      let line = [];
      for (const w of c) {
        const next = L([...line, w]);
        if (line.length && (next > maxChars || (next > target + 3 && pieces.length < 1e9))) { pieces.push(line); line = []; }
        line.push(w);
      }
      if (line.length) {
        // cegah baris yatim (mis. "33,") — gabungkan ke baris sebelumnya bila masih muat
        const prev = pieces[pieces.length - 1];
        if (L(line) < 7 && prev && c.includes(prev[0]) && L([...prev, ...line]) <= maxChars + 4) prev.push(...line);
        else pieces.push(line);
      }
    }
    // jangan akhiri baris dengan kata sambung pendek — pindahkan ke baris berikutnya
    const SAMBUNG = new Set(['di', 'ke', 'dan', 'yang', 'untuk', 'dari', 'dengan', 'hingga', 'atau']);
    for (let i = 0; i < pieces.length - 1; i++) {
      const a = pieces[i], b = pieces[i + 1], w = a[a.length - 1];
      if (a.length > 1 && SAMBUNG.has(norm(w.text)) && !/[,.?!:]$/.test(w.text) && L([w, ...b]) <= maxChars) b.unshift(a.pop());
    }
    for (let i = 0; i < pieces.length; i++) {
      const a = pieces[i], b = pieces[i + 1];
      const aEndsSentence = /[.?!]$/.test(a[a.length - 1].text);
      if (b && !aEndsSentence && (L(a) < 12 || L(b) < 12) && L([...a, ...b]) <= maxChars) { a.push(...b); pieces.splice(i + 1, 1); i--; }
    }
    pieces.forEach((p) => lines.push({ words: p }));
  });
  lines.forEach((l, i) => {
    l.start = +(l.words[0].t - 0.08).toFixed(3);
    const next = lines[i + 1];
    const lastEnd = l.words[l.words.length - 1].end + 0.35;
    l.end = +Math.min(lastEnd, next ? next.words[0].t - 0.1 : lastEnd).toFixed(3);
    l.words = l.words.map((w) => ({ text: w.text, t: +w.t.toFixed(3) }));
  });
  return lines;
}

function toSrt(lines) {
  const ts = (s) => {
    const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
  };
  return lines.map((l, i) => `${i + 1}\n${ts(l.start)} --> ${ts(l.end)}\n${l.words.map((w) => w.text).join(' ')}\n`).join('\n');
}

module.exports = { buildCaptions, toSrt };
