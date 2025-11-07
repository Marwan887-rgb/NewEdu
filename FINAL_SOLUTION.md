# الحل النهائي - بطاقة واحدة مع 3 views

## البنية:

```
┌──────────────────────────────────────┐
│  البطاقة (ارتفاع شاشة الجوال)       │
│                                      │
│  [View 1 - ظاهرة]                   │
│  • الفترة 1                          │
│  • الفترة 2                          │
│  • المهام                            │
│  • الإنجاز                           │
│  • زر عرض الدروس                    │
│                                      │
│  [View 2 - مخفية]                   │
│  • زر العودة                         │
│  • الوحدات (أفقياً)                 │
│                                      │
│  [View 3 - مخفية]                   │
│  • زر العودة                         │
│  • دروس الوحدة                      │
└──────────────────────────────────────┘
```

## التنفيذ:

### HTML:
```html
<div class="main-card" style="height: 100vh; max-height: 650px;">
  
  <!-- View 1: الفترات -->
  <div id="view-terms">
    <!-- 5 بطاقات الفترات -->
    <!-- زر عرض الدروس -->
  </div>
  
  <!-- View 2: الوحدات -->
  <div id="view-units" class="hidden">
    <button onclick="backToTerms()">← العودة</button>
    <!-- الوحدات أفقياً -->
  </div>
  
  <!-- View 3: الدروس -->
  <div id="view-lessons" class="hidden">
    <button onclick="backToUnits()">← العودة</button>
    <!-- الدروس -->
  </div>
  
</div>
```

### JavaScript:
```javascript
// عرض الوحدات
function showUnitsView() {
  document.getElementById('view-terms').classList.add('hidden');
  document.getElementById('view-units').classList.remove('hidden');
  loadUnits();
}

// العودة للفترات
function backToTerms() {
  document.getElementById('view-units').classList.add('hidden');
  document.getElementById('view-terms').classList.remove('hidden');
}

// عرض دروس وحدة
function showUnitLessons(unitName) {
  document.getElementById('view-units').classList.add('hidden');
  document.getElementById('view-lessons').classList.remove('hidden');
  loadLessons(unitName);
}

// العودة للوحدات
function backToUnits() {
  document.getElementById('view-lessons').classList.add('hidden');
  document.getElementById('view-units').classList.remove('hidden');
}
```

## هل تريد مني تطبيق هذا؟
