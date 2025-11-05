# 🔧 حل مشكلة: src refspec main does not match any

## ❌ المشكلة:
```
error: src refspec main does not match any
error: failed to push some refs
```

## 🔍 السبب:
- `git commit` لم يتم بنجاح
- لا يوجد branch لأن commit فشل
- Git يحتاج إعداد اسم المستخدم والبريد أولاً

---

## ✅ الحل اليدوي (إذا فشل الملف):

### 1. افتح PowerShell في مجلد المشروع

### 2. نفّذ الأوامر بالترتيب:

```bash
# إعداد Git
"C:\Program Files\Git\bin\git.exe" config user.name "Marwan887-rgb"
"C:\Program Files\Git\bin\git.exe" config user.email "your-email@example.com"

# تهيئة
"C:\Program Files\Git\bin\git.exe" init

# إضافة الملفات
"C:\Program Files\Git\bin\git.exe" add .

# حفظ التغييرات
"C:\Program Files\Git\bin\git.exe" commit -m "رفع المشروع الأولي"

# إنشاء branch main
"C:\Program Files\Git\bin\git.exe" branch -M main

# ربط مع GitHub
"C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/Marwan887-rgb/NewEdu.git

# رفع
"C:\Program Files\Git\bin\git.exe" push -u origin main
```

---

## 🔍 التحقق:

### تحقق من وجود commit:
```bash
"C:\Program Files\Git\bin\git.exe" log
```

**يجب أن ترى commit واحد على الأقل**

### تحقق من branch:
```bash
"C:\Program Files\Git\bin\git.exe" branch
```

**يجب أن ترى `* main`**

---

## ✅ الملف المحدّث:

تم تحديث `رفع_GitHub.bat` ليتضمن:
- ✅ إعداد Git (اسم المستخدم والبريد)
- ✅ التحقق من commit
- ✅ إنشاء branch main

**شغّل الملف مرة أخرى!**

---

## 📝 ملاحظة:

إذا استمرت المشكلة:
1. تأكد من وجود ملفات في المجلد
2. تأكد من أن `.gitignore` لا يمنع جميع الملفات
3. جرب الأوامر اليدوية أعلاه

---

**🔧 تم التحديث - جرب مرة أخرى!**

