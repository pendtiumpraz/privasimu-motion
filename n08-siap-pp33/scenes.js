// N08 — "Siap PP 33, bersama ahlinya" (program pendampingan konsultasi + platform).
// Gaya: poster Swiss / kinetic typography brutalis (kertas #F2F0EB, tinta #0E0E0E, oranye #FF4F00).
// Semua visual = tipe kustom di style.js (sw*), jadi SFX ditulis manual di `sfx`.
// Potongan komposisi di dalam scene (CUT) & pan screenshot (VIEWS) dihitung di sini agar animasi (browser)
// dan SFX (build.js lewat CUE_EXPANDERS) memakai waktu yang persis sama, dibulatkan ke ketukan bila dekat.
(function (root) {
  const BPM = 124, B = 60 / BPM;
  const CONFIG = {
    title: 'N08 · Siap PP 33',
    naskah: 'N08',
    voice: 'id-ID-GadisNeural',
    voiceRate: '+15%',
    beat: B,
    tail: 0.45,
    music: { bpm: BPM, mode: 'minor', root: 48, lead: 'pluck', drums: 'full', clock: true },
  };

  const WT = () => (typeof module !== 'undefined' ? require('../lib/wordtime').wordTime : root.wordTime);
  const W = (sc, spec) => WT()(sc, spec);
  const snap = (t, tol = 0.16) => { const q = Math.round(t / B) * B; return Math.abs(q - t) <= tol ? q : t; };

  // waktu potong antar-komposisi (lokal scene)
  const CUT = {
    s1: (sc) => [snap(W(sc, 'w:Dari') - 0.16)],
    s2: (sc) => [snap(W(sc, 'w:kita') - 0.14), snap(W(sc, 'w:UU') - 0.16)],
    s3: (sc) => [snap(W(sc, 'w:RoPA') - 0.22)],
    s4: (sc) => [snap(W(sc, 'w:dan') - 0.14)],
    s5: (sc) => [snap(W(sc, 'w:Anda') - 0.14)],
  };
  // pergantian bidikan screenshot asli (pan/zoom tegas) — tepat di ketukan. Satu larik per bingkai.
  const VIEWS = {
    s2: (sc) => { const a = CUT.s2(sc)[0]; return [[a, a + B, a + B * 3]]; },
    s3: () => [[0, B * 2, B * 4]],
    s4: (sc) => { const a = CUT.s4(sc)[0]; return [[0, B * 2], [a, a + B * 2, a + B * 4, a + B * 6]]; },
  };
  const CUE_EXPANDERS = {
    cut: (sc) => CUT[sc.id](sc).slice(0, 1),
    cutW: (sc) => [CUT[sc.id](sc)[0] - 0.3],   // whoosh memuncak tepat di potongan
    cut2W: (sc) => [CUT[sc.id](sc)[1] - 0.3],
    views: (sc) => VIEWS[sc.id](sc).flatMap((f) => f.slice(1)),
  };

  const SCENES = [
    {
      id: 's1', min: 4, voDelay: 0.35, theme: 'paper', mus: 'hook',
      vo: 'Enam belas Januari dua ribu dua puluh tujuh semakin dekat. Dari mana organisasi Anda harus mulai?',
      sfx: [
        [0.05, 'sweep', 0.3],
        ['w:Enam', 'slam', 0.8], ['w:Januari', 'slam', 0.8],
        ['w:dua', 'key', 0.9], ['w:ribu', 'key', 0.9], ['w:dua#2', 'key', 0.9], ['w:tujuh', 'hit', 0.7],
        ['w:semakin-0.25', 'whoosh', 0.45], ['w:semakin+0.3', 'pop', 0.5], ['w:dekat+0.3', 'vineboom', 0.42],
        ['cutW', 'whoosh', 0.4],
        ['w:organisasi+0.13', 'slam', 0.35], ['w:organisasi+0.37', 'slam', 0.35], ['w:organisasi+0.61', 'slam', 0.35],
        ['w:organisasi+0.85', 'slam', 0.35], ['w:organisasi+1.09', 'slam', 0.35],
        ['w:mulai+0.24', 'hit', 0.8],
        ['end-0.42', 'whoosh', 0.45],
      ],
      vis: {
        type: 'swDate', push: 0, enter: 'none', exit: 'none',
        pov: 'tinggal hitungan minggu', povEmoji: '😬',
        tags: ['RoPA', 'DPIA', 'Kebijakan', 'Kontrak vendor', 'Prosedur insiden'],
      },
    },
    {
      id: 's2', min: 4, voDelay: 0.25, theme: 'paper', mus: 'tense',
      vo: 'Bersama konsultan Privasimu, kita mulai dari gap assessment terhadap UU PDP dan PP tiga puluh tiga, pasal demi pasal.',
      sfx: [
        ['w:Bersama', 'slam', 0.6], ['w:konsultan', 'slam', 0.7], ['w:Privasimu', 'impact', 0.55],
        ['cutW', 'whoosh', 0.4], ['views', 'flip', 0.5],
        ['w:gap', 'hit', 0.55], ['w:assessment', 'slam', 0.45],
        ['cut2W', 'whoosh', 0.4], ['w:UU', 'sweep', 0.4], ['w:PP', 'sweep', 0.4],
        ['w:pasal', 'hit', 0.75], ['w:demi', 'hit', 0.75], ['w:pasal#2', 'impact', 0.6],
        ['end-0.45', 'whoosh', 0.5],
      ],
      vis: {
        type: 'swGap', push: 0, enter: 'none', exit: 'none',
        // screenshot ASLI (1x): ditampilkan ≤ 1,4× ukuran asli; hl = kotak sorotan [x, y, w, h] relatif gambar
        shot: {
          tag: 'Privasimu Nexus · GAP Assessment',
          imgs: [{ src: '../assets/app/gap-hasil.png', w: 1002, h: 690 }],
          views: [
            { u: 0.5, v: 0.5, s: 'fit' },
            { u: 0.649, v: 0.25, s: 1.4, hl: [0.322, 0.094, 0.652, 0.325], label: 'Compliance score' },
            { u: 0.649, v: 0.25, s: 1.4, hl: [0.446, 0.325, 0.405, 0.054], label: 'Framework UU PDP' },
          ],
        },
        legend: ['Terpenuhi', 'Sebagian', 'Kesenjangan'],
      },
    },
    {
      id: 's3', min: 4, voDelay: 0.25, theme: 'ink', mus: 'tense',
      vo: 'Hasilnya jadi roadmap prioritas: RoPA, DPIA, kebijakan, kontrak vendor, sampai prosedur insiden.',
      sfx: [
        ['views', 'flip', 0.45], ['w:roadmap', 'slam', 0.6], ['w:prioritas', 'slam', 0.6],
        ['cutW', 'whoosh', 0.4], ['w:RoPA', 'slam', 0.6], ['w:DPIA', 'slam', 0.6], ['w:kebijakan', 'slam', 0.6], ['w:kontrak', 'slam', 0.6], ['w:prosedur', 'slam', 0.6],
        ['end-1.25', 'riser', 0.5], ['end-0.36', 'suck', 0.55],
      ],
      vis: {
        type: 'swRoad', push: 0, enter: 'none', exit: 'none',
        shot: {
          tag: 'Privasimu Nexus · Rekomendasi GAP',
          imgs: [{ src: '../assets/app/gap-rekomendasi.png', w: 1002, h: 900 }],
          views: [
            { u: 0.5, v: 0.42, s: 'cover' },
            { u: 0.649, v: 0.72, s: 1.4, hl: [0.345, 0.662, 0.607, 0.114], label: 'Prioritas perbaikan' },
            { u: 0.649, v: 0.9, s: 1.4, hl: [0.345, 0.806, 0.607, 0.194], label: 'Rekomendasi per pasal' },
          ],
        },
        prio: ['Critical', 'High', 'Medium'],
        items: [
          { text: 'RoPA', at: 'w:RoPA' },
          { text: 'DPIA', at: 'w:DPIA' },
          { text: 'Kebijakan', at: 'w:kebijakan' },
          { text: 'Kontrak vendor', at: 'w:kontrak' },
          { text: 'Prosedur insiden', at: 'w:prosedur' },
        ],
      },
    },
    {
      id: 's4', min: 4, voDelay: 0.25, theme: 'paper', mus: 'main',
      vo: 'Tim Anda kami latih, dan semua pekerjaan tercatat di Privasimu Nexus.',
      sfx: [
        [0, 'impact', 0.6],
        ['w:Tim', 'slam', 0.45], ['w:latih', 'ding', 0.45],
        ['cutW', 'whoosh', 0.45], ['views', 'flip', 0.5],
        ['w:Nexus', 'shimmer', 0.45],
        ['end-0.42', 'whoosh', 0.45],
      ],
      vis: {
        type: 'swNexus', push: 0, enter: 'none', exit: 'none',
        train: ['Pelatihan & sertifikasi', 'DPO + tim IT'],
        academy: {
          tag: 'Privasimu Learn · DPO Academy',
          imgs: [{ src: '../assets/app/dpo-academy.png', w: 1440, h: 900 }],
          views: [
            { u: 0.59, v: 0.3, s: ['cover', 0.84] },
            { u: 0.3, v: 0.33, s: 1.4, hl: [0.192, 0.182, 0.196, 0.302], label: 'Kursus DPO Academy' },
          ],
        },
        shot: {
          tag: 'Privasimu Nexus · Dasbor',
          imgs: [{ src: '../assets/app/dashboard.png', w: 1264, h: 790 }, { src: '../assets/app/dashboard-postur.png', w: 1002, h: 480 }],
          views: [
            { u: 0.5, v: 0.45, s: ['cover', 0.8] },
            { u: 0.45, v: 0.8, s: 1.4, hl: [0.222, 0.906, 0.458, 0.05], label: 'Semua tercatat' },
            { u: 0.15, v: 0.12, s: 1.4, hl: [0.054, 0.01, 0.101, 0.059], label: 'Privasimu Nexus' },
            { img: 1, u: 0.83, v: 0.55, s: 1.4, hl: [0.665, 0.168, 0.312, 0.815], label: 'Postur kepatuhan' },
          ],
        },
        notes: ['Jejak audit', 'Setiap perubahan tercatat'],
      },
    },
    {
      id: 's5', min: 4, voDelay: 0.25, theme: 'orange', mus: 'main',
      vo: 'Jadi saat PP tiga puluh tiga berlaku, Anda punya bukti kepatuhan, bukan sekadar niat.',
      sfx: [
        ['w:PP', 'slam', 0.7], ['w:tiga', 'slam', 0.7], ['w:berlaku', 'stamp', 1.0],
        ['cutW', 'whoosh', 0.4],
        ['w:bukti', 'hit', 0.7], ['w:kepatuhan', 'slam', 0.5],
        ['w:kepatuhan+0.3', 'paper', 0.4], ['w:kepatuhan+0.5', 'paper', 0.35],
        ['w:bukan', 'slam', 0.5], ['w:niat', 'scratch', 0.75],
        ['end-0.45', 'whoosh', 0.45],
      ],
      vis: {
        type: 'swBukti', push: 0, enter: 'none', exit: 'none',
        proofs: ['RoPA', 'DPIA', 'Log audit'],
      },
    },
    {
      id: 's6', min: 4, voDelay: 0.3, tail: 1.1, theme: 'paper', mus: 'outro',
      vo: 'Privasimu. Siap PP tiga puluh tiga bersama ahlinya. Konsultasi gratis di privasimu dot com.',
      sfx: [
        ['w:Privasimu-0.2', 'whoosh', 0.35], ['w:Siap', 'slam', 0.6], ['w:tiga', 'slam', 0.5], ['w:ahlinya', 'hit', 0.55],
        ['w:Konsultasi', 'pop', 0.6], ['w:privasimu#2', 'ding', 0.55],
      ],
      vis: {
        type: 'swCta', push: 0, enter: 'none', exit: 'none',
        buttons: ['Konsultasi gratis', 'privasimu.com'],  // naskah: pastikan penawaran konsultasi gratis masih berlaku
        contact: 'support@privasimu.com · 0851 8318 2722',
      },
    },
  ];

  const api = { CONFIG, SCENES, CUE_EXPANDERS, CUT, VIEWS, snap };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
