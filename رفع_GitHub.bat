@echo off
chcp 65001 >nul
echo ========================================
echo رفع المشروع على GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] تهيئة Git...
"C:\Program Files\Git\bin\git.exe" init

echo.
echo [2/6] إعداد Git (اسم المستخدم والبريد)...
"C:\Program Files\Git\bin\git.exe" config user.name "Marwan887-rgb" 2>nul
"C:\Program Files\Git\bin\git.exe" config user.email "marwan@example.com" 2>nul

echo.
echo [3/6] إضافة الملفات...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo [4/6] حفظ التغييرات...
"C:\Program Files\Git\bin\git.exe" commit -m "رفع المشروع الأولي"
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ تحذير: قد لا توجد ملفات جديدة أو تم commit مسبقاً
    echo.
)

echo.
echo [5/6] إنشاء branch main...
"C:\Program Files\Git\bin\git.exe" branch -M main 2>nul

echo.
echo [6/6] ربط مع GitHub...
"C:\Program Files\Git\bin\git.exe" remote remove origin 2>nul
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/Marwan887-rgb/NewEdu.git

echo.
echo [7/7] رفع الملفات...
echo.
echo ⚠️ سيطلب منك اسم المستخدم وكلمة المرور
echo اسم المستخدم: Marwan887-rgb
echo كلمة المرور: استخدم Personal Access Token
echo.
pause
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
echo ========================================
echo تم! تحقق من: https://github.com/Marwan887-rgb/NewEdu
echo ========================================
pause

