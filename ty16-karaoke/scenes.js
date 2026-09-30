// TY16 — KARAOKE / LYRIC VIDEO "Lagu Wajib Rapat Kepatuhan": lirik orisinal di layar, kata terisi warna mengikuti
// waktu VO, bola pantul melompat dari kata ke kata; latar berdenyut ikut beat. Bait 1 "Di cloud" → bait 2
// "Cloud-nya di negara mana?" (hening, bola berhenti) → reff Privasimu Nexus (register transfer + TIA) → CTA.
// Hook (relate): "Nyanyikan bersama: 'Datanya di mana? Di cloud.'"
// Komposisi: 30% edukasi · 70% meme. Melodi & lirik ORISINAL (musik synth music-kit, lirik dibaca TTS berirama).
(function (root) {
  const CONFIG = {
    title: 'TY16 · Lagu Wajib Rapat Kepatuhan (karaoke lyric video)',
    naskah: 'TY16',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+10%',
    maxPause: 0.35,
    beat: 60 / 112 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 112, mode: 'major', root: 57, lead: 'bell', drums: 'full', sonic: true },
    mix: { duckTo: 0.5, musicGain: 0.85 },
    meta: {
      judul: 'Lagu Wajib Rapat Kepatuhan',
      gaya: 'Karaoke / lyric video',
      tampilan: 'layar karaoke: latar gradien ungu-magenta berdenyut ikut beat, bintik cahaya; baris lirik besar putih yang terisi kuning per kata; bola kuning memantul parabola dari kata ke kata; judul lagu di pojok dengan ikon mikrofon; hening dramatis di pertanyaan; reff dengan logo',
      jenisHook: 'Relate',
      hook: '"Nyanyikan bersama: \'Datanya di mana? Di cloud.\'"',
      komposisi: '30% edukasi · 70% meme',
      rekam: [],
      fakta: [
        'Transfer Data Lintas Negara (fakta_produk.json, kunci cross-border): register transfer lintas negara; Transfer Impact Assessment (TIA); pemetaan pelindungan yang setara atau memadai.',
        'Lirik & melodi orisinal (musik disintesis music-kit, lead bell); tidak meniru lagu apa pun; tanpa merek layanan cloud.',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const K = (o) => ({ type: 'kr', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5, voDelay: 0.6, mus: 'hook',
      vo: 'Datanya di mana? Di cloud. Datanya aman? Katanya.',
      layar: 'Layar karaoke; judul "LAGU WAJIB RAPAT KEPATUHAN"; bait 1 dua baris, kata terisi kuning, bola memantul per kata.',
      sfx: [[0.1, 'whoosh', 0.25], ['w:Datanya', 'ding', 0.3]],
      vis: K({ judul: 0.1, bait: 'Datanya di mana? *Di cloud*.|Datanya aman? *Katanya*.', mulai: 'w:Datanya' }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Cloud-nya di negara mana? … … Hening. Semua lihat DPO.',
      layar: 'Bait 2: "Cloud-nya di negara mana?" — bola berhenti di udara, musik menipis, teks "(hening)" berkedip, lalu "semua lihat DPO 👀".',
      sfx: [['w:Cloud-nya', 'tick', 0.25], ['w:mana', 'hit', 0.35], ['w:Hening', 'tick', 0.2]],
      vis: K({ bait: 'Cloud-nya di *negara mana*?|(hening)', mulai: 'w:Cloud-nya', hening: 'w:mana+0.3', lihat: 'w:Semua' }),
    },
    {
      id: 's3', min: 6, voDelay: 0.3, mus: 'main',
      vo: 'Data pergi ke luar negeri, TIA dulu jangan nanti. Register transfer tercatat rapi, di Privasimu Nexus, pasti.',
      layar: 'Reff: empat baris lirik terisi cepat; bola memantul makin semangat; kata terakhir "pasti" → bola mendarat di logo Privasimu Nexus yang muncul dengan denyut & kilau.',
      sfx: [['w:Data', 'ding', 0.35], ['w:TIA', 'pop', 0.3], ['w:Register', 'pop', 0.3], ['w:pasti', 'hit', 0.45], ['w:pasti+0.3', 'ding', 0.4]],
      vis: K({ bait: 'Data pergi ke luar negeri,|*TIA* dulu, jangan nanti.|*Register transfer* tercatat rapi,|di Privasimu Nexus, *pasti*.', mulai: 'w:Data', logo: 'w:pasti' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Cloud-nya di mana pun, transfernya tercatat. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Cloud-nya di mana pun, transfernya tercatat.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: K({ cta: { tag: 'Cloud-nya di mana pun,|*transfernya tercatat*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
