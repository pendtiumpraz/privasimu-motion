# Pilih acak satu gaya yang belum dibuat dari kelompok tertentu (giliran rata antar kelompok).
#   python rancangan/sumber/_acak.py GB          -> satu kode acak + detailnya
import io, random, re, subprocess, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
kel = sys.argv[1] if len(sys.argv) > 1 else 'GB'
out = subprocess.run([sys.executable, 'rancangan/sumber/_daftar.py', kel, 'ringkas'], capture_output=True, text=True, encoding='utf-8').stdout
kode = re.findall(r'^(' + kel + r'\d+) \[', out, flags=re.M)
if not kode: print('habis'); sys.exit(0)
pilih = random.choice(kode)
det = subprocess.run([sys.executable, 'rancangan/sumber/_daftar.py', kel, 'detail'], capture_output=True, text=True, encoding='utf-8').stdout
m = re.search(r'^## ' + pilih + r' .*?(?=^## |\Z)', det, flags=re.M | re.S)
print(f'sisa {len(kode)} di {kel}; terpilih: {pilih}\n' + (m.group(0) if m else pilih))
