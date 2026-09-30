// PF24 — SLIP GAJI "Slip Gaji DPO": kertas printer dot-matrix berlubang tepi mencetak slip baris demi baris (kepala
// cetak bergerak): PENDAPATAN lelucon (tunjangan sabar Rp0) → POTONGAN (lembur audit: tidak tercatat) → total "Tenang: 0"
// → kertas disobek di perforasi, lembar baru: BANTUAN (bukan tunjangan) dari Nexus tercetak hijau → CTA.
// Hook (relate): "Tunjangan sabar: Rp0. Lembur audit: tidak tercatat."
// Komposisi: 10% edukasi · 90% meme. Satu gaya: slip gaji cetak (tabel, baris mengetik, total). Nominal = lelucon.
(function (root) {
  const CONFIG = {
    title: 'PF24 · Slip Gaji DPO (slip gaji)',
    naskah: 'PF24',
    voice: 'id-ID-ArdiNeural',
    voiceRate: '+11%',
    maxPause: 0.4,
    beat: 60 / 108 / 2,
    tail: 0.35,
    burnCaptions: false,
    music: { bpm: 108, mode: 'major', root: 57, lead: 'chip', drums: 'light', sonic: true },
    mix: { duckTo: 0.42, musicGain: 0.7 },
    meta: {
      judul: 'Slip Gaji DPO',
      gaya: 'Slip gaji',
      tampilan: 'meja abu; kertas printer dot-matrix bergaris hijau muda dengan lubang perforasi di kedua tepi bergulir naik saat baris tercetak; kepala cetak hitam bergerak; huruf mono; baris merah untuk potongan; sobekan perforasi; lembar BANTUAN hijau; stempel',
      jenisHook: 'Relate',
      hook: '"Tunjangan sabar: Rp0. Lembur audit: tidak tercatat."',
      komposisi: '10% edukasi · 90% meme',
      fakta: [
        'Dukungan PPDP (fakta_produk.json): antrean pekerjaan yang menunggu tindakan, dasbor kepatuhan lintas modul, asisten AI Priva, log audit aktor manusia & AI.',
        'Semua nominal & baris slip = lelucon (ditandai *); tidak ada data gaji nyata; nama karyawan fiktif "DPO-01".',
        '"Cek kesiapan gratis" = Start Pre Check: pastikan penawaran masih berlaku sebelum tayang.',
      ],
    },
  };
  const S = (o) => ({ type: 'sg', enter: 'none', exit: 'none', push: 0, ...o });

  const SCENES = [
    {
      id: 's1', min: 5.5, voDelay: 0.5, mus: 'hook',
      vo: 'Slip gaji DPO. Tunjangan sabar: nol rupiah. Lembur audit: tidak tercatat.',
      layar: 'Printer mencetak kop "SLIP GAJI · DPO-01 · periode: audit" lalu baris PENDAPATAN: Gaji pokok (dirahasiakan) · Tunjangan sabar Rp 0 · Lembur audit: tidak tercatat (merah).',
      sfx: [[0.1, 'tick', 0.25], ['w:Slip', 'tick', 0.3], ['w:Tunjangan', 'tick', 0.3], ['w:Lembur', 'hit', 0.3]],
      vis: S({ cetak: [[0, 0.1], [1, 'w:Slip'], [2, 'w:Tunjangan'], [3, 'w:Lembur']] }),
    },
    {
      id: 's2', min: 5, voDelay: 0.3, mus: 'tense',
      vo: 'Bonus "tolong isi form-nya": nol. Potongan: pulsa ke IT, kopi empat gelas. Total ketenangan: nol.',
      layar: 'Baris terus tercetak: Bonus "tolong isi form-nya" Rp 0 · POTONGAN: pulsa ke IT Rp 12.000* · kopi 4 gelas/hari* · TOTAL KETENANGAN: 0 (dicetak besar); stempel merah "TIDAK TERCATAT".',
      sfx: [['w:Bonus', 'tick', 0.3], ['w:pulsa', 'tick', 0.3], ['w:kopi', 'tick', 0.3], ['w:Total', 'hit', 0.4]],
      vis: S({ cetak: [[4, 'w:Bonus'], [5, 'w:Potongan'], [6, 'w:pulsa'], [7, 'w:kopi'], [8, 'w:Total']], stempel: 'w:nol#2' }),
    },
    {
      id: 's3', min: 5, voDelay: 0.3, mus: 'main',
      vo: 'Yang bisa ditambah bukan tunjangannya, tapi bantuannya: Privasimu Nexus. Antrean kerja, dasbor lintas modul, asisten AI Priva. Ketenangan: naik.',
      layar: 'Kertas disobek di perforasi dan lembar baru tercetak hijau: BANTUAN (BUKAN TUNJANGAN) — antrean kerja · dasbor lintas modul · asisten AI Priva · log audit; TOTAL KETENANGAN: naik ↑; stempel hijau "DIBANTU".',
      sfx: [['w:bantuannya', 'whoosh', 0.45], ['w:antrean', 'tick', 0.3], ['w:dasbor', 'tick', 0.3], ['w:asisten', 'tick', 0.3], ['w:naik', 'ding', 0.4]],
      vis: S({ sobek: 'w:bantuannya-0.2', cetak: [[9, 'w:Nexus'], [10, 'w:antrean'], [11, 'w:dasbor'], [12, 'w:asisten'], [13, 'w:naik-0.2']], stempel2: 'w:naik+0.3' }),
    },
    {
      id: 's4', min: 4.5, voDelay: 0.3, mus: 'outro', free: true, tail: 1.2,
      vo: 'Tunjangan sabar boleh nol, bantuannya jangan. Cek kesiapanmu gratis di privasimu dot com.',
      layar: 'Kartu penutup: logo, "Tunjangan sabar boleh nol, bantuannya jangan.", tombol privasimu.com, kontak.',
      sfx: [['w:Cek', 'pop', 0.4]],
      vis: S({ cta: { tag: 'Tunjangan sabar boleh nol,|*bantuannya jangan*.', at: 0.15, btnAt: 'w:Cek' } }),
    },
  ];

  const api = { CONFIG, SCENES };
  if (typeof module !== 'undefined') module.exports = api; else root.PRV = api;
})(this);
