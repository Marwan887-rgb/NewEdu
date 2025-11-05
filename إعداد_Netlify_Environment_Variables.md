# 🔐 إعداد Environment Variables في Netlify

## 📋 المتغيرات المطلوبة:

### 1. **TELEGRAM_BOT_TOKEN** (مطلوب)
- توكن بوت التلجرام
- يستخدم في Netlify Function (`send-otp.js`)

### 2. **TEACHER_PASSWORD** (مطلوب)
- كلمة مرور قوية للمعلم
- يجب أن تكون 12+ حرف، أرقام، رموز

### 3. **DEEPSEEK_API_KEY** (اختياري)
- مفتاح DeepSeek API
- فقط إذا كنت تستخدمه في Functions

---

## 🚀 الخطوات:

### الخطوة 1: فتح Netlify Dashboard
1. اذهب إلى: https://app.netlify.com
2. سجّل دخولك
3. اختر موقعك (أو أنشئ موقع جديد)

---

### الخطوة 2: فتح Environment Variables
1. اضغط على اسم الموقع
2. اضغط على **"Site settings"** (أو الإعدادات)
3. من القائمة الجانبية، اضغط على **"Environment variables"**

---

### الخطوة 3: إضافة المتغيرات

#### أ. إضافة TELEGRAM_BOT_TOKEN:
1. اضغط **"Add a variable"**
2. **Key:** `TELEGRAM_BOT_TOKEN`
3. **Value:** ضع توكن البوت (من @BotFather)
4. **Scope:** اختر **"All scopes"** أو **"Functions"**
5. اضغط **"Save"**

#### ب. إضافة TEACHER_PASSWORD:
1. اضغط **"Add a variable"** مرة أخرى
2. **Key:** `TEACHER_PASSWORD`
3. **Value:** ضع كلمة مرور قوية (مثال: `MyStr0ngP@ssw0rd!2025`)
4. **Scope:** اختر **"All scopes"**
5. اضغط **"Save"**

#### ج. إضافة DEEPSEEK_API_KEY (اختياري):
1. اضغط **"Add a variable"**
2. **Key:** `DEEPSEEK_API_KEY`
3. **Value:** ضع مفتاح DeepSeek API
4. **Scope:** اختر **"All scopes"** أو **"Functions"**
5. اضغط **"Save"**

---

## ⚠️ ملاحظات مهمة:

### 1. Scope (النطاق):
- **All scopes:** متاح في جميع البيئات (Build + Functions)
- **Functions:** متاح فقط في Netlify Functions (أكثر أماناً)

### 2. كلمة مرور المعلم:
- يجب أن تكون قوية (12+ حرف)
- أرقام + حروف + رموز
- لا تستخدم كلمات مرور بسيطة

### 3. التوكن:
- تأكد من صحة التوكن
- لا تضع مسافات زائدة
- لا تضع علامات اقتباس

---

## ✅ التحقق:

### بعد إضافة المتغيرات:
1. تأكد من ظهور جميع المتغيرات في القائمة
2. تحقق من أن **Scope** صحيح
3. **لا تشارك** هذه القيم مع أي شخص

---

## 🔄 بعد التعديل:

### إذا عدّلت متغير:
1. اضغط على المتغير
2. عدّل القيمة
3. اضغط **"Save"**
4. **Redeploy** الموقع (اختياري - لكن موصى به)

---

## 🧪 اختبار:

### بعد النشر:
1. افتح الموقع المنشور
2. جرب إرسال OTP
3. يجب أن يعمل عبر Telegram ✅

---

## 📸 مثال:

```
Environment Variables:
├── TELEGRAM_BOT_TOKEN = 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
├── TEACHER_PASSWORD = MyStr0ngP@ssw0rd!2025
└── DEEPSEEK_API_KEY = sk-1234567890abcdef (اختياري)
```

---

## ❓ مشاكل شائعة:

### 1. المتغير لا يعمل:
- تحقق من الاسم (حساس لحالة الأحرف)
- تحقق من Scope
- Redeploy الموقع

### 2. OTP لا يعمل:
- تحقق من TELEGRAM_BOT_TOKEN
- تحقق من Console في المتصفح (F12)
- راجع Netlify Functions Logs

---

## ✅ النتيجة:

بعد إكمال هذه الخطوات:
- ✅ Environment Variables جاهزة
- ✅ Netlify Functions يمكنها الوصول للمتغيرات
- ✅ النظام آمن ومحمي

---

**🎯 جاهز للنشر!**

