# 🔗 ربط Netlify مع GitHub للتحديث التلقائي

## 🎯 الهدف:
- أي تعديل ترفعه على GitHub → Netlify يحدث تلقائياً ✅

---

## 📋 الخطوات:

### الخطوة 1: فتح Netlify Dashboard
1. افتح: https://app.netlify.com
2. اختر موقعك

---

### الخطوة 2: ربط GitHub
1. اضغط على **"Site settings"** (الإعدادات)
2. من القائمة الجانبية → **"Build & deploy"**
3. في قسم **"Continuous Deployment"**:
   - اضغط **"Link repository"** أو **"Connect to Git"**
   - اختر **GitHub**
   - سجّل دخول GitHub (إذا طُلب)
   - اختر المستودع: **NewEdu**
   - اضغط **"Save"**

---

### الخطوة 3: إعدادات النشر
بعد الربط، سيطلب منك:

#### Build settings:
- **Build command:** اتركه فارغاً (لأننا لا نستخدم build)
- **Publish directory:** `.` (نقطة واحدة - يعني المجلد الرئيسي)
- **Functions directory:** `netlify/functions`

#### اضغط **"Deploy site"**

---

## ✅ بعد الربط:

### الآن:
1. تعدل الملفات محلياً
2. شغّل `تحديث_GitHub.bat`
3. Netlify يحدث تلقائياً خلال دقائق ✅

---

## 🔄 للتحديثات المستقبلية:

### شغّل الملف:
```
تحديث_GitHub.bat
```

### أو يدوياً:
```bash
"C:\Program Files\Git\bin\git.exe" add .
"C:\Program Files\Git\bin\git.exe" commit -m "وصف التعديل"
"C:\Program Files\Git\bin\git.exe" push
```

---

## 📊 كيف تعمل:

```
تعديل محلي → git push → GitHub → Netlify يحدث تلقائياً
```

---

## ✅ النتيجة:

- ✅ ربط Netlify مع GitHub
- ✅ التحديث التلقائي مفعّل
- ✅ أي تعديل → تحديث تلقائي

---

**🚀 جاهز! الآن أي تعديل ترفعه → Netlify يحدث تلقائياً!**

