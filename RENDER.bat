@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
title Render video Privasimu
cd /d "%~dp0"

rem ================================================================
rem  RENDER.bat - antrean render video Privasimu (tanpa Claude)
rem
rem  Cara pakai:
rem    Klik dua kali RENDER.bat           : cek SEMUA folder video (yang baru ikut otomatis),       
rem                                         render yang BELUM jadi/BERUBAH, lewati yang sudah jadi.    
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
if not defined DAFTAR call :otomatis
rem  :otomatis (di akhir file) = urutan dari antrian-render.txt + semua folder lain yang punya scenes.js
rem -----------------------------------------------------------------------------------
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
exit /b

rem ================================================================
rem  :otomatis - menyusun antrean bila RENDER.bat dijalankan tanpa nama folder
rem    1. folder di antrian-render.txt lebih dulu (urutan prioritas; file ini boleh tidak ada)
rem    2. lalu SEMUA folder lain yang punya scenes.js, jadi video baru ikut otomatis
rem    Baris "-nama-folder" di antrian-render.txt = jangan dirender.
rem ================================================================
:otomatis
set "KECUALI= "
set "URUT="
if exist "antrian-render.txt" (
  for /f "usebackq eol=# tokens=* delims=" %%F in ("antrian-render.txt") do (
    set "BARIS=%%F"
    if "!BARIS:~0,1!"=="-" (set "KECUALI=!KECUALI!!BARIS:~1! ") else (set "URUT=!URUT! %%F")
  )
)
for /d %%D in (*) do if exist "%%D\scenes.js" (
  set "ADA="
  for %%X in (!URUT!) do if /i "%%X"=="%%D" set "ADA=1"
  if not defined ADA set "URUT=!URUT! %%D"
)
for %%F in (!URUT!) do (
  set "ADA="
  for %%X in (!KECUALI!) do if /i "%%X"=="%%F" set "ADA=1"
  if not defined ADA set "DAFTAR=!DAFTAR! %%F"
)
exit /b
