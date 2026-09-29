// Cek semua cue kata 'w:' (vis + sfx) tiap scene: kata apa yang benar-benar kena dan di detik berapa.
// Jalankan setelah build (timeline.js sudah ada):  node lib/cek-cue.js <folder...>
//   '  ' = tepat · '~ ' = hanya cocok awalan, PERIKSA (mis. 'w:ya' kena "yang" → pakai 'w:ya#2')
//   '!!' = tidak ketemu (SFX membuat build gagal; animasi diam-diam memakai waktu cadangan)
// Keluar dengan kode 1 bila ada cue yang tidak ketemu.
const fs = require('fs');
const path = require('path');
const { norm } = require('./wordtime');

const ROOT = path.join(__dirname, '..');
let missing = 0;
for (const f of process.argv.slice(2)) {
  const { SCENES } = require(path.join(ROOT, f, 'scenes.js'));
  const tlFile = path.join(ROOT, f, 'timeline.js');
  if (!fs.existsSync(tlFile)) { console.log(`${f}: timeline.js belum ada — jalankan dulu: node build.js ${f} --audio-only`); missing++; continue; }
  const TL = JSON.parse(fs.readFileSync(tlFile, 'utf8').replace(/^window\.TIMELINE\s*=\s*/, '').replace(/;\s*$/, ''));
  console.log(`\n=== ${f} (${TL.total.toFixed(2)} dtk)`);
  for (const s of SCENES) {
    const sc = TL.scenes.find((x) => x.id === s.id);
    const cues = [];
    const walk = (o, p) => {
      if (typeof o === 'string' && o.startsWith('w:')) cues.push([p, o]);
      else if (Array.isArray(o)) o.forEach((x, i) => walk(x, `${p}[${i}]`));
      else if (o && typeof o === 'object') for (const k in o) walk(o[k], p ? `${p}.${k}` : k);
    };
    walk(s.vis, 'vis'); walk(s.sfx || [], 'sfx');
    const offset = sc.voStart - sc.start;
    console.log(`-- ${s.id} dur ${sc.dur.toFixed(2)} | vo mulai ${offset.toFixed(2)} | ${(sc.words || []).map((w) => w.w).join(' ') || '(tanpa VO)'}`);
    for (const [p, spec] of cues) {
      const m = /^w:(.+?)(?:#(\d+))?([+-]\d*\.?\d+)?$/.exec(spec);
      const want = norm(m[1]), nth = +(m[2] || 1), off = +(m[3] || 0);
      let seen = 0, hit = null;
      for (const w of sc.words || []) if (norm(w.w).startsWith(want) && ++seen === nth) { hit = w; break; }
      if (!hit) missing++;
      const tag = !hit ? '!!' : norm(hit.w) === want ? '  ' : '~ ';
      console.log(`   ${tag} ${spec.padEnd(22)} -> ${hit ? `"${hit.w}" @ ${(offset + hit.t + off).toFixed(2)}` : 'TIDAK KETEMU'}   (${p})`);
    }
  }
}
process.exit(missing ? 1 : 0);
