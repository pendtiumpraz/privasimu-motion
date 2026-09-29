// Waktu lokal (detik dari awal scene) untuk cue kata: 'w:<kata>[#n][+/-offset]'.
// Dipakai build (Node) dan halaman animasi (browser) agar visual, SFX, dan VO selalu sinkron.
(function (root) {
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '');
  function wordTime(scene, spec) {
    const m = /^w:(.+?)(?:#(\d+))?([+-]\d*\.?\d+)?$/.exec(spec);
    if (!m) throw new Error('cue kata tidak valid: ' + spec);
    const want = norm(m[1]), nth = +(m[2] || 1), off = +(m[3] || 0);
    let seen = 0;
    for (const w of scene.words || []) {
      if (norm(w.w).startsWith(want) && ++seen === nth) return (scene.voStart - scene.start) + w.t + off;
    }
    throw new Error(`kata "${want}" #${nth} tidak ditemukan di scene ${scene.id}`);
  }
  if (typeof module !== 'undefined') module.exports = { wordTime, norm }; else root.wordTime = wordTime;
})(this);
