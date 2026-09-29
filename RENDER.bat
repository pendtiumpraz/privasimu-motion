@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Render video Privasimu
cd /d "%~dp0"

rem ================================================================
rem  RENDER.bat - antrean render video Privasimu (tanpa Claude)
rem
rem  Cara pakai:
rem    Klik dua kali RENDER.bat           : cek semua folder di antrian-render.txt, lalu render yang
rem                                         BELUM jadi atau BERUBAH. Yang sudah jadi dilewati otomatis.
rem    RENDER.bat t01-stomp t02-tipografi : cek/render folder tertentu saja
rem    Seret folder video ke RENDER.bat   : cek/render folder itu saja
rem    RENDER.bat --paksa                 : render ulang walau sudah jadi (bisa digabung nama folder)
rem    RENDER.bat --audio-only            : cepat, hanya timeline + audio (cek naskah/VN)
rem  Opsi lain diteruskan ke build.js:  --fmt=9x16   --tts   --workers=2
rem  "Berubah" = file di folder video (scenes.js, style, musik, dst.) atau rekaman VN tim
rem  (vn\KODE_S1 ...) berbeda dari saat render terakhir. Catatan: out\folder\render-info.json
rem  Hasil: out\folder\folder-16x9.mp4 dan -9x16.mp4    Ringkasan: out\log\antrian-*.txt
rem  PENTING: jangan mengedit file .bat ini saat sedang berjalan.
rem ================================================================

echo Memeriksa perangkat...
where node >nul 2>&1 || (echo [GAGAL] Node.js belum terpasang. & goto :akhir)
where ffmpeg >nul 2>&1 || (echo [GAGAL] FFmpeg belum ada di PATH. & goto :akhir)
where python >nul 2>&1 || (echo [GAGAL] Python belum terpasang. & goto :akhir)
python -c "import edge_tts" >nul 2>&1 || (echo [GAGAL] Paket edge-tts belum ada. Jalankan: pip install edge-tts & goto :akhir)

set "OPSI="
set "DAFTAR="
set "PAKSA="
set "AUDIOONLY="
for %%A in (%*) do (
  set "ARG=%%~A"
  if /i "!ARG!"=="--paksa" (
    set "PAKSA=1"
  ) else if "!ARG:~0,2!"=="--" (
    set "OPSI=!OPSI! %%~A"
    if /i "!ARG!"=="--audio-only" set "AUDIOONLY=1"
  ) else if exist "%%~A\scenes.js" (
    set "DAFTAR=!DAFTAR! %%~nxA"
  ) else (
    set "DAFTAR=!DAFTAR! %%~A"
  )
)
if not defined DAFTAR (
  if not exist "antrian-render.txt" (echo [GAGAL] antrian-render.txt tidak ditemukan. & goto :akhir)
  for /f "usebackq eol=# tokens=* delims=" %%F in ("antrian-render.txt") do set "DAFTAR=!DAFTAR! %%F"
)
if not defined DAFTAR (echo [GAGAL] Antrean kosong. & goto :akhir)

if not exist "out\log" mkdir "out\log"
for /f "tokens=1-3 delims=/-. " %%a in ("%date%") do set "TGL=%%a%%b%%c"
set "JAM=%time: =0%"
set "RINGKAS=out\log\antrian-!TGL!-!JAM:~0,2!!JAM:~3,2!.txt"
set /a TOTAL=0, OK=0, GAGAL=0, LEWAT=0, NO=0
for %%F in (!DAFTAR!) do set /a TOTAL+=1

echo.
echo ================= ANTRIAN RENDER: !TOTAL! video =================
if defined PAKSA (
  echo Mode --paksa: semua video di daftar dirender ulang.
) else if not defined AUDIOONLY (
  echo Video yang sudah jadi dan tidak berubah dilewati otomatis.
)
echo Opsi:!OPSI!
echo Antrian render dimulai %date% %time% > "!RINGKAS!"
for %%F in (!DAFTAR!) do (
  set /a NO+=1
  echo.
  echo ---------------------------------------------------------------
  echo [!NO!/!TOTAL!] %%F   !time:~0,8!
  echo ---------------------------------------------------------------
  if not exist "%%F\scenes.js" (
    echo [LEWAT] folder %%F tidak ditemukan
    echo [LEWAT] %%F: folder tidak ditemukan >> "!RINGKAS!"
    set /a GAGAL+=1
  ) else (
    set "PERLU=1"
    if not defined PAKSA if not defined AUDIOONLY (
      node lib\status-render.js %%F !OPSI!
      if errorlevel 10 set "PERLU="
    )
    if not defined PERLU (
      echo [LEWAT] %%F sudah jadi. Pakai --paksa untuk render ulang.
      echo [LEWAT] %%F: sudah dirender, tidak berubah >> "!RINGKAS!"
      set /a LEWAT+=1
    ) else (
      node build.js %%F !OPSI!
      if errorlevel 1 (
        echo [GAGAL] %%F
        echo [GAGAL] %%F, selesai !time:~0,8! >> "!RINGKAS!"
        set /a GAGAL+=1
      ) else (
        echo [OK] %%F: hasil di out\%%F\
        echo [OK] %%F, selesai !time:~0,8! >> "!RINGKAS!"
        set /a OK+=1
      )
    )
  )
)
echo.
echo ================================================================
echo Selesai: !OK! dirender, !LEWAT! dilewati karena sudah jadi, !GAGAL! gagal - dari !TOTAL! video.
echo Ringkasan: !RINGKAS!
echo ================================================================
type "!RINGKAS!"
echo Selesai: !OK! dirender, !LEWAT! dilewati, !GAGAL! gagal >> "!RINGKAS!"

:akhir
echo.
pause
endlocal
