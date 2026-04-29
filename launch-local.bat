@echo off
cd /d "%~dp0"
echo.
echo ========================================
echo   BNI 서초 메이저 챕터 PR · 로컬 서버
echo ========================================
echo.
echo http://localhost:8765 에서 확인하세요
echo Ctrl+C 누르면 서버가 종료됩니다.
echo.
start "" http://localhost:8765
python -m http.server 8765
