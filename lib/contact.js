// Contact sheet untuk cek visual: node lib/contact.js <keluaran.jpg> <kolom> <lebar> <gambar...>
const { execFileSync } = require('child_process');
const [out, cols, width, ...imgs] = process.argv.slice(2);
const c = +cols, pos = imgs.map((_, i) => {
  const col = i % c, row = Math.floor(i / c);
  const x = col ? Array.from({ length: col }, () => 'w0').join('+') : '0';
  const y = row ? Array.from({ length: row }, () => 'h0').join('+') : '0';
  return `${x}_${y}`;
});
const args = ['-v', 'error', '-y', ...imgs.flatMap((f) => ['-i', f]),
  '-filter_complex', `xstack=inputs=${imgs.length}:layout=${pos.join('|')}:fill=black,scale=${width}:-1`, out];
execFileSync('ffmpeg', args, { stdio: 'inherit' });
console.log(out);
