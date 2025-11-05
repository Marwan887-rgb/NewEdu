// طبقة محاكاة عامة لاستخدامها محليًا عندما لا يتوفر google.script.run
// تتوافق مع أساليب GAS: withSuccessHandler, withFailureHandler, ثم استدعاء الدالة
(function attachMockRunGlobal() {
  if (typeof window === 'undefined') return;
  if (window.google && window.google.script && window.google.script.run) return; // GAS موجود

  const mock = {
    _success: null,
    _failure: null,
    withSuccessHandler(fn) { this._success = fn; return this; },
    withFailureHandler(fn) { this._failure = fn; return this; },
    startLoginTelegram(mobile) { setTimeout(() => this._success && this._success({ ok: true }), 200); return this; },
    requestOtpTelegram(mobile) { setTimeout(() => this._success && this._success({ ok: true }), 150); return this; },
    verifyOtpAndGetStudent(mobile, code) { setTimeout(() => this._success && this._success({ ok: true, student: { name: 'طالب تجريبي', class: '1/أ', mobile } }), 200); return this; },
    getLessons() {
      const payload = { success: true, lessons: [
        { unit: 'الوحدة 1', title: 'الدرس 1', powerpointLink: 'https://example.com/ppt1', videoLink: 'https://example.com/video1', id: 1 },
        { unit: 'الوحدة 1', title: 'الدرس 2', powerpointLink: 'https://example.com/ppt2', videoLink: 'https://example.com/video2', id: 2 },
        { unit: 'الوحدة 2', title: 'الدرس 3', powerpointLink: 'https://example.com/ppt3', videoLink: 'https://example.com/video3', id: 3 }
      ]};
      setTimeout(() => this._success && this._success(payload), 250); return this;
    },
    getOrGenerateWorksheet(lesson, student) {
      const html = `<div class="space-y-6">
        <h3 class="text-xl font-bold text-gray-800">📄 ورقة عمل: ${lesson.title || ''}</h3>
        <input type="hidden" id="lessonId" value="${lesson.id || 1}">
        <input type="hidden" id="studentId" value="${(student && student.mobile) || ''}">
        <ol class="list-decimal list-inside space-y-2 text-gray-700">
          <li>سؤال 1 <input type="text" class="w-full border rounded p-2 mt-1" /></li>
          <li>سؤال 2 <input type="text" class="w-full border rounded p-2 mt-1" /></li>
          <li>سؤال 3 <input type="text" class="w-full border rounded p-2 mt-1" /></li>
        </ol>
        <div class="mt-6"><button id="saveBtn" class="px-4 py-2 bg-blue-600 text-white rounded">💾 حفظ ورقة العمل</button></div>
      </div>`;
      setTimeout(() => this._success && this._success(html), 200); return this;
    },
    saveStudentWorksheet() { setTimeout(() => this._success && this._success('✅ تم الحفظ (محاكاة).'), 200); return this; },
    getAssignmentLink() { setTimeout(() => this._success && this._success(''), 150); return this; },
    uploadHomeworkFile() { setTimeout(() => this._success && this._success('https://example.com/file.pdf'), 300); return this; },
    getOrGenerateFinalExam(lesson, student) {
      const html = `<div class="space-y-6">
        <h3 class="text-xl font-bold text-gray-800">🧾 التقويم النهائي: ${lesson.title || ''}</h3>
        <input type="hidden" id="lessonId" value="${lesson.id || 1}">
        <input type="hidden" id="studentId" value="${(student && student.mobile) || ''}">
        <div><p class="font-semibold">1. سؤال اختيار</p>
          <label><input type="radio" name="q1" value="أ"> أ</label><br>
          <label><input type="radio" name="q1" value="ب"> ب</label><br>
          <label><input type="radio" name="q1" value="ج"> ج</label><br>
          <label><input type="radio" name="q1" value="د"> د</label><br>
        </div>
        <div class="mt-6"><button id="saveFinalBtn" class="px-4 py-2 bg-green-600 text-white rounded">💾 حفظ التقويم النهائي</button></div>
      </div>`;
      setTimeout(() => this._success && this._success(html), 220); return this;
    },
    saveFinalExam() { setTimeout(() => this._success && this._success({ success: true, score: 10, lockedHtml: '<p>✅ تم الحفظ (محاكاة)</p>' }), 250); return this; }
  };

  // تعريض ككائن عالمي لاستخدامه في صفحات أخرى إن لزم
  window.mockRun = mock;
})();
