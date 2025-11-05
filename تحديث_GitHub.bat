@echo off
chcp 65001 >nul
echo ========================================
echo تحديث المشروع على GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] إضافة التغييرات...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo [2/4] حفظ التغييرات...
"C:\Program Files\Git\bin\git.exe" commit -m "تحسين تصميم الجوال - البنر العلوي"

echo.
echo [3/4] رفع التغييرات...
"C:\Program Files\Git\bin\git.exe" push

echo.
echo ========================================
echo تم! ✅
echo.
echo سيتم تحديث Netlify تلقائياً خلال دقائق
echo تحقق من: https://github.com/Marwan887-rgb/NewEdu
echo ========================================
pause

