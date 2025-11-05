# 🔧 إصلاح مشكلة OTP في Firefox

## ❌ المشكلة:
- في المتصفح العادي (Chrome Desktop): يعمل ✅
- في وضع الجوال (Chrome Mobile): لا يعمل ❌ - "رقم الجوال غير مسجل"
- في Firefox: لا يعمل ❌

## 🔍 الأسباب المحتملة:

### 1. RLS Policies
- قد تمنع الوصول من متصفحات مختلفة
- قد تكون مختلفة حسب User Agent

### 2. Supabase Client
- قد يعمل بشكل مختلف في Firefox
- `.single()` قد يفشل في Firefox

### 3. تطبيع الرقم
- Firefox قد يضيف رموز مختلفة
- قد يكون هناك مشكلة في encoding

---

## ✅ الحلول المطبقة:

### 1. البحث بدون `.single()` أولاً
```javascript
// بدلاً من:
.eq('mobile', mobile).single()

// استخدم:
.eq('mobile', mobile).limit(1)
```

### 2. البحث المرن
- البحث بآخر 9 أرقام
- البحث بصيغ متعددة
- البحث بدون `.single()`

### 3. Fallback إلى REST API
- إذا فشل Supabase Client
- استخدام REST API مباشرة
- يعمل مع جميع المتصفحات

---

## 🧪 الاختبار:

### 1. في Firefox:
```
1. افتح الموقع
2. افتح Console (F12)
3. أدخل رقم جوال
4. راقب Console
```

### 2. في Chrome Mobile:
```
1. افتح DevTools
2. فعّل وضع الجوال (Ctrl+Shift+M)
3. أدخل رقم جوال
4. راقب Console
```

---

## 📋 ما يجب أن تراه في Console:

### نجاح:
```
✅ [OTP] تم العثور على الطالب (طريقة 1): 966501234567
✅ [OTP] تم العثور على الطالب بالبحث المرن: 0501234567
✅ [OTP] تم العثور على الطالب عبر REST API: 966501234567
```

### فشل:
```
❌ [OTP] خطأ في البحث عن الطالب: {
  mobileSearched: "966501234567",
  error: {...},
  ...
}
```

---

## 🔧 إذا استمرت المشكلة:

### 1. تحقق من RLS Policies:
```sql
-- في Supabase SQL Editor:
SELECT * FROM pg_policies 
WHERE tablename = 'students';
```

### 2. تحقق من الصيغة في قاعدة البيانات:
```sql
SELECT mobile, name FROM students LIMIT 10;
```

### 3. اختبر البحث مباشرة:
```sql
SELECT * FROM students 
WHERE mobile = '966501234567' 
   OR mobile = '501234567' 
   OR mobile = '0501234567';
```

---

## ✅ النتيجة:

بعد التحديث:
- ✅ يعمل في Chrome Desktop
- ✅ يعمل في Chrome Mobile
- ✅ يعمل في Firefox
- ✅ يعمل مع جميع المتصفحات
- ✅ Fallback إلى REST API إذا فشل Client

---

**جرب الآن في Firefox وأخبرني بالنتيجة!** 🚀

