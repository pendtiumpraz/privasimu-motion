# Cetak ringkas katalog gaya (alat bantu produksi; tidak dipakai Excel).
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from data_gaya import G
kel = sys.argv[1].split(',') if len(sys.argv) > 1 else ['TY']
mode = sys.argv[2] if len(sys.argv) > 2 else 'ringkas'
def skor(r):
    return round(0.45 * r['wow'] + 0.35 * r['brand'] + 0.20 * (6 - r['upaya']) * 2, 2)
rows = [r for r in G if r['kel'] in kel]
from collections import Counter
print(Counter((r['kel'], r['status']) for r in rows))
rows = [r for r in rows if r['status'] == 'Bisa']
rows.sort(key=lambda r: (kel.index(r['kel']), -skor(r), r['kode']))
for r in rows:
    if mode == 'ringkas':
        print(f"{r['kode']} [{skor(r)}] u{r['upaya']} w{r['wow']} b{r['brand']} m{r['meme']} | {r['gaya']} | {r['judul']} | {r['jenis_hook']} | {r['modul']} | {r['durasi']}")
    else:
        print(f"\n## {r['kode']} [{skor(r)}] {r['gaya']}  (meme {r['meme']}%, {r['durasi']}, modul: {r['modul']}, aset: {r['aset']})")
        print(f"  tampilan: {r['tampilan']}")
        print(f"  teknik  : {r['teknik']}")
        print(f"  judul   : {r['judul']}  [{r['jenis_hook']}]")
        print(f"  hook    : {r['hook']}")
        print(f"  alur    : {r['alur']}")
        if r['catatan']: print(f"  catatan : {r['catatan']}")
