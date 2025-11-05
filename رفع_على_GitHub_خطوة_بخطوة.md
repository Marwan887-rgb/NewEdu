# 🚀 رفع المشروع على GitHub - خطوة بخطوة

## 📋 المتطلبات:

### 1. تثبيت Git:
```
حمّل من: https://git-scm.com/download/win
ثبتّه (Next → Next → Install)
أعد فتح Terminal/PowerShell
```

---

## 🔧 الخطوات:

### الخطوة 1: التحقق من Git
افتح PowerShell أو Terminal واكتب:
```bash
git --version
```

**إذا ظهر رقم إصدار** → جيد ✅  
**إذا ظهر خطأ** → ثبت Git أولاً

---

### الخطوة 2: فتح Terminal في مجلد المشروع

#### الطريقة 1: من File Explorer
1. افتح مجلد `EduActive`
2. اضغط Shift + Right Click (زر الماوس الأيمن)
3. اختر **"Open PowerShell window here"**

#### الطريقة 2: من PowerShell
```powershell
cd "C:\Users\mrn88\OneDrive\المستندات\EduActive"
```

---

### الخطوة 3: تنفيذ الأوامر

#### 1. ابدأ Git:
```bash
git init
```

#### 2. أضف الملفات:
```bash
git add .
```

#### 3. احفظ التغييرات:
```bash
git commit -m "رفع المشروع الأولي"
```

#### 4. اربط مع GitHub:
```bash
git remote add origin https://github.com/Marwan887-rgb/NewEdu.git
```

#### 5. ارفع الملفات:
```bash
git push -u origin main
```

---

## ⚠️ ملاحظات مهمة:

### عند `git push`:
- قد يطلب اسم المستخدم: `Marwan887-rgb`
- قد يطلب كلمة المرور: استخدم **Personal Access Token**

### إنشاء Personal Access Token:

1. اذهب إلى: https://github.com/settings/tokens
2. اضغط **"Generate new token"** → **"Generate new token (classic)"**
3. **Note:** اكتب أي اسم (مثل: "EduActive")
4. **Expiration:** اختر المدة (90 يوم أو No expiration)
5. **Select scopes:** حدد **`repo`** (كل الصلاحيات)
6. اضغط **"Generate token"**
7. **انسخ التوكن** (سيظهر مرة واحدة فقط!)
8. استخدمه ككلمة مرور عند `git push`

---

## 🎯 الأوامر الكاملة (انسخ والصق):

```bash
git init
git add .
git commit -m "رفع المشروع الأولي"
git remote add origin https://github.com/Marwan887-rgb/NewEdu.git
git push -u origin main
```

---

## ✅ التحقق:

بعد التنفيذ، افتح:
```
https://github.com/Marwan887-rgb/NewEdu
```

يجب أن ترى جميع الملفات! ✅

---

## 🔄 للتحديثات المستقبلية:

بعد أي تعديل:
```bash
git add .
git commit -m "وصف التعديل"
git push
```

---

## ❓ مشاكل شائعة:

### 1. "git is not recognized"
**الحل:** ثبت Git من: https://git-scm.com/download/win

### 2. "authentication failed"
**الحل:** استخدم Personal Access Token ككلمة مرور

### 3. "remote origin already exists"
**الحل:**
```bash
git remote remove origin
git remote add origin https://github.com/Marwan887-rgb/NewEdu.git
```

### 4. "failed to push some refs"
**الحل:**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 📝 ملخص:

1. ✅ ثبت Git
2. ✅ افتح Terminal في مجلد المشروع
3. ✅ نفّذ الأوامر الخمسة
4. ✅ استخدم Personal Access Token عند الطلب
5. ✅ تحقق من الملفات على GitHub

---

**🚀 جاهز للرفع!**

