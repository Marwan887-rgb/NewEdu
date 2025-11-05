# 🚀 خطوات النشر النهائية - EduActive

## ✅ الخطوة 1: تنظيف الملفات (اختياري)

إذا كنت تريد حذف الملفات القديمة:

```powershell
# شغّل السكريبت (سيطلب تأكيد)
powershell -ExecutionPolicy Bypass -File cleanup.ps1
```

**أو احذف يدوياً**: جميع ملفات `.txt` ما عدا:
- `cleanup-list.md`
- `FILES_TO_KEEP.md`
- أي ملفات أخرى مهمة

---

## ✅ الخطوة 2: التحقق من الأمان (مهم!)

### قبل النشر، تأكد من:

- [ ] ✅ RLS مفعل (تم التأكيد)
- [ ] ✅ المفاتيح تم تغييرها (تم التأكيد)
- [ ] ⚠️ **كلمة مرور المعلم**: يجب تغييرها قبل النشر!

---

## ✅ الخطوة 3: النشر على Netlify

### الطريقة الأولى: Netlify CLI

```bash
# 1. تثبيت Netlify CLI (إذا لم يكن مثبتاً)
npm install -g netlify-cli

# 2. تسجيل الدخول
netlify login

# 3. إذا كان المشروع جديداً - ربط المشروع
netlify init

# 4. النشر للإنتاج
netlify deploy --prod
```

### الطريقة الثانية: Netlify Dashboard

1. اذهب إلى [netlify.com](https://netlify.com)
2. سجّل دخولك
3. اضغط **"Add new site"** → **"Deploy manually"**
4. اسحب مجلد المشروع أو ارفعه
5. اضغط **"Deploy site"**

---

## ✅ الخطوة 4: إعداد Environment Variables

في Netlify Dashboard:

1. Settings → Environment Variables
2. أضف المتغيرات التالية:

```
TELEGRAM_BOT_TOKEN = <your-telegram-bot-token>
DEEPSEEK_API_KEY = <your-deepseek-api-key>
TEACHER_PASSWORD = <strong-password-here>
SUPABASE_URL = <your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY = <your-service-role-key>
```

**⚠️ مهم**: استخدم كلمة مرور قوية للمعلم!

---

## ✅ الخطوة 5: اختبار بعد النشر

1. ✅ افتح الرابط الذي حصلت عليه
2. ✅ جرّب تسجيل الدخول كطالب
3. ✅ جرّب لوحة المعلم
4. ✅ جرّب على الجوال

---

## ✅ الخطوة 6: إرسال الرابط للطلاب

بعد التأكد من أن كل شيء يعمل:

```
📱 رابط المنصة التعليمية:
https://your-app.netlify.app

استخدم رقم جوالك للدخول
```

---

## 📝 ملاحظات مهمة

1. **كلمة المرور**: تأكد من تغييرها قبل النشر!
2. **البيئة**: التطبيق في مرحلة التطوير المحلي حالياً
3. **النسخ الاحتياطي**: احتفظ بنسخة من قاعدة البيانات
4. **المراقبة**: راقب الاستخدام بعد النشر

---

## 🎉 مبروك!

بعد اكتمال النشر، سيكون التطبيق جاهزاً للاستخدام!

---

**تاريخ آخر تحديث**: 2025

