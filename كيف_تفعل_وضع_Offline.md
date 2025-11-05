# 🔌 كيفية تفعيل وضع Offline - بالتفصيل

## 📍 أين تجد خيار Offline؟

### في تبويب Network في DevTools:

---

## 🎯 الخطوات التفصيلية:

### 1️⃣ افتح DevTools
- اضغط `F12` على لوحة المفاتيح
- أو: اضغط بزر الماوس الأيمن → **Inspect**

### 2️⃣ اذهب إلى تبويب Network
- في DevTools، ابحث عن تبويب **"Network"**
- اضغط عليه

### 3️⃣ ابحث عن خيار Offline
- في **أعلى تبويب Network**، ستجد شريط أدوات
- ابحث عن **checkbox** أو **toggle switch** أو **dropdown**

### 4️⃣ الموقع الدقيق:

```
┌─────────────────────────────────────────────┐
│ Network                                     │
├─────────────────────────────────────────────┤
│ [☐] Offline  ← هنا بالضبط                  │
│                                             │
│ [☐] Disable cache                          │
│                                             │
│ [Filter: All] [Preserve log]               │
└─────────────────────────────────────────────┘
```

---

## 🔍 إذا لم تجد Checkbox:

### الحل 1: تحقق من شريط الأدوات
- في بعض إصدارات Chrome، قد يكون في **قائمة منسدلة**
- ابحث عن **أيقونة إعدادات** (⚙️) أو **ثلاث نقاط** (⋮)
- اضغط عليها → اختر **"Offline"**

### الحل 2: استخدم قائمة Throttling
1. في تبويب Network، ابحث عن **"Throttling"** أو **"No throttling"**
2. اضغط على القائمة المنسدلة
3. اختر **"Offline"**

```
┌─────────────────────────────────────────────┐
│ Network                                     │
├─────────────────────────────────────────────┤
│ Throttling: [No throttling ▼]              │
│              ├─ No throttling              │
│              ├─ Slow 3G                    │
│              ├─ Fast 3G                    │
│              └─ Offline  ← هنا!            │
└─────────────────────────────────────────────┘
```

---

## 🎯 طريقة بديلة (الأسهل):

### استخدم Command Menu:

1. **في DevTools**، اضغط `Ctrl+Shift+P` (أو `Cmd+Shift+P` على Mac)
2. **اكتب**: `offline`
3. **اختر**: `Network: Toggle offline mode`
4. **اضغط Enter**

---

## ✅ كيف تعرف أن Offline مفعل؟

### علامات مرئية:

1. **في تبويب Network:**
   - ستظهر **أيقونة تحذير** 🔴 أو ⚠️
   - ستظهر رسالة: "Offline" أو "No internet connection"

2. **في شريط العنوان:**
   - ستظهر **أيقونة عدم وجود إنترنت** في المتصفح

3. **في Console:**
   - قد تظهر رسائل خطأ: "Failed to fetch" أو "Network error"

---

## 🔄 طريقة أخرى: استخدام Command Line

### في Console:
1. افتح تبويب **Console** في DevTools
2. اكتب:
```javascript
// تفعيل Offline
navigator.onLine = false;
window.dispatchEvent(new Event('offline'));

// إعادة تفعيل Online
navigator.onLine = true;
window.dispatchEvent(new Event('online'));
```

---

## 📸 صورة توضيحية (نصية):

```
DevTools
├── Elements
├── Console
├── Sources
├── Network  ← هنا!
│   ├── Toolbar (أعلى)
│   │   ├── [☐] Offline  ← هنا!
│   │   ├── [☐] Disable cache
│   │   └── Throttling: [No throttling ▼]
│   │                       └─ Offline  ← أو هنا!
│   └── Requests list (أسفل)
├── Application
└── ...
```

---

## 🎯 الخطوات السريعة (ملخص):

### الطريقة 1: Checkbox
```
1. F12
2. تبويب Network
3. ابحث عن ☐ Offline في الأعلى
4. اضغط عليه
```

### الطريقة 2: Throttling Menu
```
1. F12
2. تبويب Network
3. Throttling: [No throttling ▼]
4. اختر: Offline
```

### الطريقة 3: Command Menu
```
1. F12
2. Ctrl+Shift+P
3. اكتب: offline
4. اختر: Toggle offline mode
```

---

## 🔍 إذا لم يعمل أي شيء:

### تحقق من إصدار Chrome:
- يجب أن يكون Chrome محدثاً
- Service Workers تحتاج Chrome 51+

### استخدم طريقة بديلة:
- **افصل الإنترنت فعلياً** من جهازك
- أو استخدم **Mode Offline** من Chrome Settings

---

## ✅ بعد تفعيل Offline:

1. **عد إلى صفحة التطبيق**
2. **حاول التنقل** بين الصفحات
3. **يجب أن تعمل الصفحة الأساسية** (من Cache)
4. **المحتوى الجديد لن يعمل** (هذا طبيعي)

---

## 🆘 حل المشاكل:

### المشكلة: لا أرى خيار Offline
**الحل:**
- تأكد من أنك في تبويب **Network** (ليس Console)
- جرب **Command Menu** (Ctrl+Shift+P)
- أو استخدم **Throttling menu**

### المشكلة: Offline مفعل لكن الصفحة لا تعمل
**الحل:**
- تأكد من أن Service Worker يعمل (Application → Service Workers)
- تأكد من أن الملفات مخزنة في Cache
- افتح Application → Cache Storage للتحقق

---

## 📝 ملاحظة:

في بعض إصدارات Chrome الحديثة، قد يكون خيار Offline في:
- **قائمة الإعدادات** (⚙️) في تبويب Network
- **أيقونة منفصلة** في شريط الأدوات
- **قائمة Throttling** فقط

---

**جرب الطرق الثلاثة وأخبرني أيهما نجح معك!** 🎉

