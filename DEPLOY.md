# 🚀 دليل النشر - EduActive

## ✅ قبل النشر

### 1. التحقق من الأمان
- [ ] RLS مفعل على جميع الجداول
- [ ] تم تغيير جميع المفاتيح
- [ ] تم تغيير كلمة مرور المعلم
- [ ] `.env` في `.gitignore`

### 2. التحقق من الملفات
- [ ] جميع الملفات المهمة موجودة
- [ ] تم حذف الملفات الزائدة
- [ ] `README.md` محدث

### 3. الاختبار
- [ ] اختبار تسجيل الدخول
- [ ] اختبار واجهة الطالب
- [ ] اختبار لوحة المعلم
- [ ] اختبار على الجوال

## 📦 النشر على Netlify

### خطوات النشر:

```bash
# 1. تثبيت Netlify CLI
npm install -g netlify-cli

# 2. تسجيل الدخول
netlify login

# 3. ربط المشروع (أول مرة)
netlify init

# 4. النشر للإنتاج
netlify deploy --prod
```

### إعداد Environment Variables في Netlify:

1. اذهب إلى Netlify Dashboard
2. Settings → Environment Variables
3. أضف المتغيرات التالية:
   - `TELEGRAM_BOT_TOKEN`
   - `DEEPSEEK_API_KEY`
   - `TEACHER_PASSWORD`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🎉 بعد النشر

1. ✅ اختبر الرابط
2. ✅ تأكد من عمل جميع الوظائف
3. ✅ أرسل الرابط للطلاب

---

**ملاحظة**: تأكد من تغيير كلمة مرور المعلم قبل النشر!

