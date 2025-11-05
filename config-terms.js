// ════════════════════════════════════════════════════════════
// إعدادات الفترات الدراسية - Terms Configuration
// ════════════════════════════════════════════════════════════
// نظام الدرجات: فترتان × 100 = 200 درجة إجمالي
// ════════════════════════════════════════════════════════════

const TERMS_CONFIG = {
  // إعدادات عامة
  totalWeeks: 16,
  totalTerms: 2,
  grandTotal: 200,
  
  // ════════════════════════════════════════════════════════════
  // 📘 الفترة الأولى (أسابيع 1-8)
  // ════════════════════════════════════════════════════════════
  term1: {
    id: 1,
    name: "الفترة الأولى",
    nameEn: "Term 1",
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    totalScore: 100,
    
    // توزيع الدرجات
    breakdown: {
      // المهام الأدائية: 5 دروس × 5 مهام = 25 مهمة
      performanceTasks: {
        totalTasks: 25,        // إجمالي المهام
        scorePerTask: 2,       // درجة كل مهمة
        totalScore: 50,        // الإجمالي: 25 × 2 = 50
        lessons: [
          { id: 1, title: "أساسيات تخطيط المشروع", tasks: 5 },
          { id: 2, title: "بناء وأتمتة خطة المشروع", tasks: 5 },
          { id: 3, title: "إدارة المهام", tasks: 5 },
          { id: 4, title: "دورة حياة النظام", tasks: 5 },
          { id: 5, title: "إنشاء المخطط", tasks: 5 }
        ]
      },
      
      // الأنشطة: 2 نشاط (كل نشاط = 5 درجات) - نقل نشاط 31 من الفترة الثانية
      activities: {
        count: 2,
        totalScore: 10,
        scorePerActivity: 5,
        list: [
          { id: 30, title: "نشاط الوحدة الأولى", score: 5 },
          { id: 31, title: "نشاط الوحدة الثانية", score: 5 }
        ]
      },
      
      // درجات إضافية محفوظة للاستخدام لاحقاً
      reserved: {
        totalScore: 0,  // تم استخدام 15 درجة للنقل (نشاط 31 + مشروع 21)
        description: "تم استخدام 15 درجة لنقل نشاط 31 ومشروع 21 من الفترة الثانية"
      },
      
      // المشاريع: 2 مشروع (كل مشروع = 10 درجات) - نقل مشروع 21 من الفترة الثانية
      projects: {
        count: 2,
        totalScore: 20,
        scorePerProject: 10,
        list: [
          { id: 20, title: "مشروع الوحدة الأولى", score: 10 },
          { id: 21, title: "مشروع الوحدة الثانية", score: 10 }
        ]
      },
      
      // اختبارات الوحدة: 1 اختبار (كل اختبار = 20 درجة)
      unitExams: {
        count: 1,
        totalScore: 20,
        scorePerExam: 20,
        list: [
          { id: 50, title: "اختبار نهاية الوحدة الأولى", score: 20 }
        ]
      }
    },
    
    // الدروس المرتبطة بهذه الفترة
    lessonIds: [1, 2, 3, 4, 5],
    activityIds: [30, 31],  // نقل نشاط 31 من الفترة الثانية
    projectIds: [20, 21],   // نقل مشروع 21 من الفترة الثانية
    examIds: [50]
  },
  
  // ════════════════════════════════════════════════════════════
  // 📗 الفترة الثانية (أسابيع 9-16)
  // ════════════════════════════════════════════════════════════
  term2: {
    id: 2,
    name: "الفترة الثانية",
    nameEn: "Term 2",
    weeks: [9, 10, 11, 12, 13, 14, 15, 16],
    totalScore: 100,
    
    // توزيع الدرجات
    breakdown: {
      // المهام الأدائية: 4 دروس × 5 مهام = 20 مهمة
      // ملاحظة: أوراق العمل (worksheets) تحصل على 5 درجات إضافية
      performanceTasks: {
        totalTasks: 20,        // إجمالي المهام
        scorePerTask: 2,       // درجة كل مهمة (باستثناء worksheets)
        totalScore: 40,        // الإجمالي: 20 × 2 = 40
        worksheetsBonus: 5,    // درجات إضافية لأوراق العمل (درس 6: 2 + دروس 7-9: 1+1+1 = 5)
        worksheetsScore: {
          // توزيع درجات أوراق العمل لكل درس (بدون فواصل)
          6: 2,  // درس 6: 2 درجات
          7: 1,  // درس 7: 1 درجة
          8: 1,  // درس 8: 1 درجة
          9: 1   // درس 9: 1 درجة
        },
        lessons: [
          { id: 6, title: "الأمن السيبراني", tasks: 5 },
          { id: 7, title: "مقدمة عن تطبيقات الهواتف الذكية", tasks: 5 },
          { id: 8, title: "بناء تطبيقات الهاتف الذكي", tasks: 5 },
          { id: 9, title: "برمجة التطبيق", tasks: 5 }
        ]
      },
      
      // الأنشطة: 1 نشاط (كل نشاط = 5 درجات) - نقل نشاط 31 للفترة الأولى
      activities: {
        count: 1,
        totalScore: 5,
        scorePerActivity: 5,
        list: [
          { id: 32, title: "نشاط الوحدة الثالثة", score: 5 }
        ]
      },
      
      // درجات إضافية محفوظة للاستخدام لاحقاً
      reserved: {
        totalScore: 0,  // تم استخدام الـ 5 درجات في أوراق العمل
        description: "تم استخدام 5 درجات في أوراق العمل لدروس الفترة الثانية"
      },
      
      // المشاريع: 1 مشروع (كل مشروع = 10 درجات) - نقل مشروع 21 للفترة الأولى
      projects: {
        count: 1,
        totalScore: 10,
        scorePerProject: 10,
        list: [
          { id: 22, title: "مشروع الوحدة الثالثة", score: 10 }
        ]
      },
      
      // اختبارات الوحدة: 2 اختبار (كل اختبار = 20 درجة)
      unitExams: {
        count: 2,
        totalScore: 40,
        scorePerExam: 20,
        list: [
          { id: 51, title: "اختبار نهاية الوحدة الثانية", score: 20 },
          { id: 52, title: "اختبار نهاية الوحدة الثالثة", score: 20 }
        ]
      }
    },
    
    // الدروس المرتبطة بهذه الفترة
    lessonIds: [6, 7, 8, 9],
    activityIds: [32],  // نقل نشاط 31 للفترة الأولى
    projectIds: [22],   // نقل مشروع 21 للفترة الأولى
    examIds: [51, 52]
  }
};

// ════════════════════════════════════════════════════════════
// دوال مساعدة
// ════════════════════════════════════════════════════════════

/**
 * الحصول على معلومات فترة معينة
 * @param {number} termNumber - رقم الفترة (1 أو 2)
 * @returns {object} معلومات الفترة
 */
function getTermConfig(termNumber) {
  return termNumber === 1 ? TERMS_CONFIG.term1 : TERMS_CONFIG.term2;
}

/**
 * الحصول على رقم الفترة من رقم الأسبوع
 * @param {number} weekNumber - رقم الأسبوع
 * @returns {number} رقم الفترة (1 أو 2)
 */
function getTermFromWeek(weekNumber) {
  if (weekNumber >= 1 && weekNumber <= 8) {
    return 1;
  } else if (weekNumber >= 9 && weekNumber <= 16) {
    return 2;
  }
  return null;
}

/**
 * الحصول على معلومات الفترة من رقم الأسبوع
 * @param {number} weekNumber - رقم الأسبوع
 * @returns {object} معلومات الفترة
 */
function getTermConfigFromWeek(weekNumber) {
  const termNumber = getTermFromWeek(weekNumber);
  return getTermConfig(termNumber);
}

/**
 * الحصول على رقم الفترة من lesson_id
 * @param {number} lessonId - رقم الدرس
 * @returns {number} رقم الفترة (1 أو 2)
 */
function getTermFromLessonId(lessonId) {
  if (TERMS_CONFIG.term1.lessonIds.includes(lessonId)) {
    return 1;
  } else if (TERMS_CONFIG.term2.lessonIds.includes(lessonId)) {
    return 2;
  }
  return null;
}

/**
 * التحقق من صحة التوزيع (مجموع كل فترة = 100)
 * @returns {object} نتيجة التحقق
 */
function validateTermsConfig() {
  const results = {
    term1: {
      performance: TERMS_CONFIG.term1.breakdown.performanceTasks.totalScore + 
                   (TERMS_CONFIG.term1.breakdown.performanceTasks.worksheetsBonus || 0),
      activities: TERMS_CONFIG.term1.breakdown.activities.totalScore,
      projects: TERMS_CONFIG.term1.breakdown.projects.totalScore,
      exams: TERMS_CONFIG.term1.breakdown.unitExams.totalScore,
      total: 0,
      isValid: false
    },
    term2: {
      performance: TERMS_CONFIG.term2.breakdown.performanceTasks.totalScore + 
                   (TERMS_CONFIG.term2.breakdown.performanceTasks.worksheetsBonus || 0),
      activities: TERMS_CONFIG.term2.breakdown.activities.totalScore,
      projects: TERMS_CONFIG.term2.breakdown.projects.totalScore,
      exams: TERMS_CONFIG.term2.breakdown.unitExams.totalScore,
      total: 0,
      isValid: false
    }
  };
  
  // حساب الإجماليات (شامل الدرجات المحفوظة)
  const term1Reserved = TERMS_CONFIG.term1.breakdown.reserved?.totalScore || 0;
  const term2Reserved = TERMS_CONFIG.term2.breakdown.reserved?.totalScore || 0;
  
  results.term1.total = results.term1.performance + results.term1.activities + 
                        results.term1.projects + results.term1.exams + term1Reserved;
  results.term2.total = results.term2.performance + results.term2.activities + 
                        results.term2.projects + results.term2.exams + term2Reserved;
  
  // التحقق من صحة الإجماليات (100 درجة لكل فترة)
  results.term1.isValid = (results.term1.total === 100);
  results.term2.isValid = (results.term2.total === 100);
  results.grandTotal = results.term1.total + results.term2.total;
  results.isValid = results.term1.isValid && results.term2.isValid;
  
  return results;
}

// ════════════════════════════════════════════════════════════
// اختبار التوزيع عند التحميل
// ════════════════════════════════════════════════════════════
if (typeof console !== 'undefined') {
  const validation = validateTermsConfig();
  console.log('🔍 التحقق من إعدادات الفترات:');
  console.log('الفترة الأولى:', validation.term1.total, 'درجة', validation.term1.isValid ? '✅' : '❌');
  console.log('الفترة الثانية:', validation.term2.total, 'درجة', validation.term2.isValid ? '✅' : '❌');
  console.log('الإجمالي الكلي:', validation.grandTotal, 'درجة');
  console.log('الحالة:', validation.isValid ? '✅ صحيح' : '❌ خطأ في التوزيع');
}

// ════════════════════════════════════════════════════════════
// تصدير للاستخدام في الملفات الأخرى
// ════════════════════════════════════════════════════════════
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TERMS_CONFIG,
    getTermConfig,
    getTermFromWeek,
    getTermConfigFromWeek,
    getTermFromLessonId,
    validateTermsConfig
  };
}
