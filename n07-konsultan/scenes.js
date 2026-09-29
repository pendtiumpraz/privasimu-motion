// N07 — "Siapa yang mendampingi Anda?" (jasa konsultan PDP). Gaya: editorial premium / majalah bisnis mewah.
// Visual: tipe kustom di style.js (ed-*); transisi halaman (wipe garis emas & balik halaman) juga di style.js,
// jadi transisi bawaan kit dimatikan (enter/exit: 'none'). SFX ditulis manual (tipe kustom tidak punya SFX otomatis).
(function (root) {
  const CONFIG = {
    title: 'N07 · Konsultan PDP',
    naskah: 'N07',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+8%',
    beat: 60 / 92,
    tail: 0.5,
    music: { bpm: 92, mode: 'major', root: 51, lead: 'keys', drums: 'light', sonic: true },
    mix: { duckTo: 0.38 },
  };

  const ED = { enter: 'none', exit: 'none' };

  const SCENES = [
    {
      id: 's1', min: 6.5, voDelay: 0.6, theme: 'ivory', mus: 'calm',
      vo: 'PP tiga puluh tiga berlaku enam belas Januari dua ribu dua puluh tujuh. Siapa yang mendampingi organisasi Anda?',
      sfx: [[0.1, 'shimmer', 0.16], ['w:PP-0.12', 'tick', 0.22], ['w:tiga-0.06', 'tick', 0.22], ['w:berlaku-0.12', 'sweep', 0.12],
        ['w:enam-0.08', 'tick', 0.28], ['w:Januari-0.08', 'tick', 0.28], ['w:dua-0.06', 'tick', 0.26],
        ['w:tujuh', 'ding', 0.26], ['w:tujuh+0.3', 'shimmer', 0.3], ['w:Siapa-0.45', 'whoosh', 0.2], ['w:mendampingi-0.3', 'paper', 0.3],
        ['w:Anda', 'shimmer', 0.2]],
      vis: { type: 'ed-date', ...ED, push: 0.04 },
    },
    {
      id: 's2', min: 7, voDelay: 0.35, theme: 'ivory', mus: 'calm',
      vo: 'Privasimu adalah tim konsultan pelindungan data pribadi, berpengalaman lintas industri, dan bersertifikasi internasional CIPP/E, CIPM, dan FIP.',
      sfx: [[0, 'sweep', 0.26], ['w:lintas', 'sweep', 0.14], ['w:CIPP-0.08', 'stamp', 0.3], ['w:CIPP+0.25', 'shimmer', 0.24],
        ['w:CIPM-0.08', 'stamp', 0.28], ['w:FIP-0.08', 'stamp', 0.32], ['w:FIP+0.3', 'ding', 0.26]],
      vis: { type: 'ed-seal', ...ED, push: 0.03 },
    },
    {
      id: 's3', min: 4, voDelay: 0.45, theme: 'ivory', mus: 'calm',
      vo: 'Kami turut berkontribusi dalam penyusunan SKKNI dan RPP PDP.',
      sfx: [[0, 'paper', 0.75], [0.45, 'paper', 0.3], ['w:SKKNI-0.12', 'tick', 0.26], ['w:RPP-0.12', 'tick', 0.26], ['w:PDP+0.2', 'shimmer', 0.18]],
      vis: { type: 'ed-docs', ...ED, push: 0.03 },
    },
    {
      id: 's4', min: 6.5, voDelay: 0.35, theme: 'ivory', mus: 'calm',
      vo: 'Dari gap assessment, roadmap, telaah kebijakan, sampai pelatihan tim, kami dampingi dari awal hingga akhir.',
      sfx: [[0, 'sweep', 0.26], ['w:gap-0.12', 'tick', 0.3], ['w:roadmap-0.12', 'tick', 0.3], ['w:telaah-0.12', 'tick', 0.3],
        ['w:pelatihan-0.12', 'tick', 0.3], ['w:dari#2', 'shimmer', 0.3], ['w:akhir', 'ding', 0.24]],
      vis: { type: 'ed-list', ...ED, push: 0.025 },
    },
    {
      id: 's5', min: 5, voDelay: 0.35, theme: 'ivory', mus: 'calm',
      vo: 'Hasilnya langsung dijalankan di platform Privasimu Nexus, bukan berhenti di laporan.',
      sfx: [[0, 'sweep', 0.26], ['w:dijalankan-0.2', 'whoosh', 0.34], ['w:Nexus', 'ding', 0.28], ['w:Nexus-0.3', 'shimmer', 0.26],
        ['w:laporan', 'paper', 0.2]],
      vis: { type: 'ed-morph', ...ED, push: 0.03 },
    },
    {
      id: 's6', min: 5.5, voDelay: 0.45, tail: 1.2, theme: 'ivory', mus: 'outro',
      vo: 'Privasimu. Konsultan PDP Anda. Jadwalkan konsultasi gratis di privasimu dot com.',
      sfx: [[0, 'paper', 0.75], ['w:Privasimu+0.6', 'shimmer', 0.36], ['w:Jadwalkan-0.1', 'ding', 0.32]],
      vis: { type: 'ed-cta', ...ED, push: 0.03 },
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
