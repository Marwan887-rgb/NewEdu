@echo off
echo ====================================
echo   تشغيل خادم محلي لـ EduActive
echo ====================================
echo.
echo سيتم تشغيل الخادم على:
echo http://localhost:8000
echo.
echo لإيقاف الخادم: اضغط Ctrl+C
echo ====================================
echo.

cd /d "%~dp0"
python -m http.server 8000

pause
