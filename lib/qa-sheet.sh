#!/bin/bash
# QA visual: render beberapa still lalu gabungkan jadi satu lembar kontak (untuk dicek sebelum render penuh).
#   bash lib/qa-sheet.sh <folder> <16x9|9x16> <kolom> <nama> <detik...>
#   contoh: bash lib/qa-sheet.sh t01-stomp 9x16 6 qa9 0.05 1.9 5.4 8.0 18.05 34.2
#   hasil : out/<folder>/<nama>.jpg (still satuan di out/<folder>/stills/)
# Di Windows (Git Bash) Chromium dijalankan dengan prioritas BelowNormal supaya tidak mengganggu render yang sedang jalan.
cd "$(dirname "$0")/.." || exit 1
F=$1; FMT=$2; COLS=$3; NAME=$4; shift 4
if command -v cmd >/dev/null 2>&1; then
  cmd //c "start /belownormal /wait /b node lib/render.js still $F $FMT $*" > /dev/null || exit 1
else
  nice -n 10 node lib/render.js still "$F" "$FMT" "$@" > /dev/null || exit 1
fi
D="out/$F/stills"; L="$D/list-$NAME.txt"
: > "$L"
for t in "$@"; do echo "file '$FMT-$t.jpg'" >> "$L"; done
if [ "$FMT" = 16x9 ]; then SC=480:270; else SC=360:640; fi
N=$#; ROWS=$(( (N + COLS - 1) / COLS ))
ffmpeg -y -loglevel error -f concat -safe 0 -i "$L" -vf "scale=$SC,tile=${COLS}x${ROWS}:padding=6:color=white" -frames:v 1 "out/$F/$NAME.jpg" && echo "out/$F/$NAME.jpg"
