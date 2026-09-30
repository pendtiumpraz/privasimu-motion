#!/bin/bash
# Uji satu video tanpa render penuh: bangun audio (prioritas rendah) -> cek cue kata -> still QA kedua format.
#   bash lib/uji.sh <folder> [opsi qa.js, mis. --t=0.04,3.2 --fmt=9x16]
#   cue yang tercetak hanya yang bermasalah: "~" = cocok awalan saja, "!!" = tidak ketemu
cd "$(dirname "$0")/.." || exit 1
F=$1; shift
if command -v cmd >/dev/null 2>&1; then
  cmd //c "start /belownormal /wait /b node build.js $F --audio-only" 2>&1 | grep -E "timeline\]|rror|gagal|tidak dikenal|tidak ditemukan"
else
  nice -n 10 node build.js "$F" --audio-only 2>&1 | grep -E "timeline\]|rror|gagal|tidak dikenal|tidak ditemukan"
fi
node lib/cek-cue.js "$F" | grep -E "^   (~ |!!)"
node lib/qa.js "$F" "$@" 2>&1 | grep -v "^$"
