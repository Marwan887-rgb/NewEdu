# ✅ قائمة التحقق الأمني قبل النشر على Netlify

> **📅 آخر تحديث:** 3 نوفمبر 2025  
> **🎯 الهدف:** التأكد من جاهزية النظام أمنياً قبل الرفع على الإنتاج

---

## 🚨 **المرحلة 0: تعطيل وضع التطوير (حرج جداً!)**

### ⚠️ **يجب القيام بهذا أولاً قبل أي شيء!**

في ملف `index.html` - ابحث عن:

```javascript
const DEV_MODE = true; // غيّر إلى false قبل النشر
const DEV_OTP_CODE = '000000'; // كود OTP ثابت للتطوير
```

**غيّره إلى:**
```javascript
const DEV_MODE = false; // تم التعطيل للإنتاج
```

**أو احذف القسم كاملاً:**
- [ ] **حذف/تعطيل DEV_MODE** في `index.html` (السطر ~721)
- [ ] **حذف زر الدخول المباشر** (السطر ~425: `<button id="devLoginBtn">`)
- [ ] **حذف معالج الزر** (السطر ~880-913)

### 🔍 البحث السريع:
```bash
# ابحث عن "DEV_MODE" في index.html
# يجب أن يكون false أو محذوف تماماً
```

---

## 🔐 **المرحلة 1: التحقق من المفاتيح**

### ✅ البيئة المحلية (للتطوير)
- [x] المفاتيح الجديدة محفوظة في `functions/.env`
- [x] ملف `.env` محمي في `.gitignore`
- [x] المفاتيح القديمة تم إلغاؤها
- [x] المفاتيح القديمة حُذفت من ملفات التوثيق

### ⏳ البيئة الإنتاجية (Netlify)
- [ ] **TELEGRAM_BOT_TOKEN** - أضف في Netlify Environment Variables
- [ ] **DEEPSEEK_API_KEY** - أضف في Netlify Environment Variables (اختياري)
- [ ] **TEACHER_PASSWORD** - غيّر لكلمة مرور قوية
- [ ] **SUPABASE_URL** - أضف في Netlify
- [ ] **SUPABASE_ANON_KEY** - أضف في Netlify
- [ ] **SUPABASE_SERVICE_ROLE_KEY** - أضف في Netlify (للـ Functions فقط)

---

## 🗄️ **المرحلة 2: تأمين قاعدة البيانات**

### ⚠️ Row Level Security (RLS)
- [ ] تشغيل ملف `ENABLE_ROW_LEVEL_SECURITY.sql` في Supabase SQL Editor
- [ ] التحقق من تفعيل RLS على جميع الجداول (15+ جدول)
- [ ] اختبار الصلاحيات: الطالب يرى بياناته فقط
- [ ] اختبار صلاحيات المعلم: الوصول الكامل

### 📊 نسخ احتياطي
- [ ] عمل Backup للـ Database من Supabase Dashboard
- [ ] حفظ نسخة من جداول الطلاب والدروس
- [ ] توثيق إعدادات قاعدة البيانات

---

## 🌐 **المرحلة 3: إعدادات Netlify**

### 🔧 الإعدادات الأساسية
- [ ] إنشاء موقع جديد أو استخدام موقع موجود
- [ ] تحديد اسم النطاق (مثل: `eduactive-app.netlify.app`)
- [ ] التحقق من `netlify.toml` موجود في الجذر

### 🔐 Environment Variables
```bash
# في Netlify Dashboard → Site configuration → Environment variables

TELEGRAM_BOT_TOKEN=your_new_token_here
DEEPSEEK_API_KEY=your_new_key_here
TEACHER_PASSWORD=YourStrongPassword123!
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUz...
```

- [ ] تمت إضافة جميع المتغيرات
- [ ] التحقق من صحة القيم (لا مسافات زائدة)
- [ ] اختيار Scope: **Functions** للمفاتيح الحساسة

---

## 🧪 **المرحلة 4: الاختبارات قبل النشر**

### 🖥️ اختبار محلي
```bash
# تشغيل Netlify Dev محلياً
netlify dev
```

- [ ] OTP يعمل محلياً
- [ ] تسجيل الدخول يعمل
- [ ] عرض الدروس يعمل
- [ ] حساب الدرجات يعمل
- [ ] لوحة المعلم تعمل

### ☁️ اختبار Deploy Preview
```bash
# رفع تجريبي (Draft)
netlify deploy
```

- [ ] فتح الرابط التجريبي
- [ ] اختبار OTP عبر Telegram
- [ ] اختبار تسجيل دخول طالب
- [ ] اختبار تسجيل دخول معلم
- [ ] فحص Console للأخطاء (F12)

---

## 🚀 **المرحلة 5: النشر النهائي**

### 📤 رفع الإنتاج
```bash
# النشر على Production
netlify deploy --prod
```

### ✅ التحقق النهائي
- [ ] فتح الرابط الرسمي: `https://your-app.netlify.app`
- [ ] اختبار من جوال حقيقي
- [ ] اختبار OTP مع طالب حقيقي
- [ ] التحقق من Telegram Bot يرسل الرسائل
- [ ] التحقق من RLS يعمل (الطالب لا يرى بيانات غيره)

### 📱 اختبار الأمان
```bash
# جرب الدخول كطالب آخر
# حاول الوصول لبيانات طالب آخر عبر Console
# يجب أن يفشل بسبب RLS
```

- [ ] الطالب A لا يرى بيانات الطالب B
- [ ] الطالب لا يستطيع تعديل درجات غيره
- [ ] المعلم يستطيع رؤية كل شيء

---

## 🔒 **المرحلة 6: الأمان الإضافي**

### 🛡️ إعدادات إضافية
- [ ] تفعيل **Password Protection** على موقع Netlify (اختياري)
- [ ] إضافة **Custom Domain** مع SSL (اختياري)
- [ ] تفعيل **Branch Deploys** للتطوير (اختياري)

### 📊 المراقبة
- [ ] تفعيل Netlify Analytics (اختياري)
- [ ] مراقبة Supabase Usage Dashboard
- [ ] إعداد تنبيهات لاستخدام API

---

## 📝 **سجل النشر**

```
□ [____/__/__] - أول نشر تجريبي (Draft)
□ [____/__/__] - تفعيل RLS
□ [____/__/__] - النشر الإنتاجي الأول
□ [____/__/__] - اختبار مع طلاب حقيقيين
□ [____/__/__] - التأكد من جميع الوظائف
```

---

## ⚠️ **تحذيرات مهمة**

### 🚫 لا تفعل أبداً:
- ❌ رفع ملف `.env` على GitHub أو Netlify
- ❌ نشر المفاتيح في Issues أو Comments
- ❌ مشاركة `SUPABASE_SERVICE_ROLE_KEY` مع الطلاب
- ❌ تعطيل RLS في الإنتاج

### ✅ افعل دائماً:
- ✅ استخدم Environment Variables في Netlify
- ✅ فعّل RLS قبل النشر
- ✅ اختبر جيداً قبل إطلاق النظام
- ✅ احتفظ بنسخة احتياطية

---

## 🎯 **الخطوة التالية**

عند الانتهاء من جميع النقاط أعلاه:

```bash
# تهانينا! 🎉 نظامك آمن وجاهز
netlify deploy --prod

# شارك الرابط مع طلابك:
https://your-app.netlify.app
```

---

## 📞 **للمساعدة**

إذا واجهت مشاكل:
1. راجع Netlify Functions Logs
2. راجع Supabase Logs
3. افتح Console في المتصفح (F12)
4. راجع ملف `TROUBLESHOOTING.md`

---

**🔐 الأمان أولاً. النجاح ثانياً. استمتع بتجربة آمنة! ✅**
