// ════════════════════════════════════════════════════════════
// حساب الدرجات بنظام الفترتين - Terms Calculator
// ════════════════════════════════════════════════════════════
// يستخدم إعدادات من config-terms.js
// ════════════════════════════════════════════════════════════

/**
 * حساب درجات فترة معينة للطالب
 * @param {string} studentMobile - رقم جوال الطالب
 * @param {number} termNumber - رقم الفترة (1 أو 2)
 * @param {object} supabase - عميل Supabase
 * @returns {Promise<object>} نتيجة الحساب
 */
async function calculateTermScore(studentMobile, termNumber, supabase) {
  console.log(`\n🔄 حساب درجات الفترة ${termNumber} للطالب:`, studentMobile);
  
  // الحصول على إعدادات الفترة
  const termConfig = getTermConfig(termNumber);
  console.log('📋 إعدادات الفترة:', termConfig);
  
  try {
    // ════════════════════════════════════════════════════════
    // 1. المهام الأدائية
    // ════════════════════════════════════════════════════════
    const lessonIds = termConfig.lessonIds;
    console.log('📚 الدروس المطلوبة:', lessonIds);
    
    const { data: performanceTasks, error: progressError } = await supabase
      .from('progress')
      .select('lesson_id, task')
      .eq('student_mobile', studentMobile)
      .in('lesson_id', lessonIds);
    
    if (progressError) {
      console.error('❌ خطأ في جلب المهام:', progressError);
    }
    
    // حساب المهام الفريدة
    const uniqueTasks = new Set();
    if (performanceTasks) {
      performanceTasks.forEach(t => {
        uniqueTasks.add(`${t.lesson_id}_${t.task}`);
      });
    }
    
    const completedTasks = uniqueTasks.size;
    const totalTasks = termConfig.breakdown.performanceTasks.totalTasks;
    const scorePerTask = termConfig.breakdown.performanceTasks.scorePerTask;
    let performanceScore = Math.min(completedTasks * scorePerTask, termConfig.breakdown.performanceTasks.totalScore);
    
    // إضافة الدرجات الإضافية لأوراق العمل (إذا كانت موجودة في الفترة الثانية)
    if (termConfig.breakdown.performanceTasks.worksheetsBonus) {
      // حساب درجات أوراق العمل حسب التوزيع المخصص لكل درس
      const worksheetsScore = termConfig.breakdown.performanceTasks.worksheetsScore || {};
      let worksheetsBonusScore = 0;
      
      // حساب الدرجات لكل ورقة عمل مكتملة
      if (performanceTasks) {
        performanceTasks.forEach(task => {
          if (task.task === 'worksheet' && worksheetsScore[task.lesson_id]) {
            worksheetsBonusScore += worksheetsScore[task.lesson_id];
          }
        });
      }
      
      // التأكد من عدم تجاوز الحد الأقصى
      const maxWorksheetsBonus = termConfig.breakdown.performanceTasks.worksheetsBonus;
      worksheetsBonusScore = Math.min(worksheetsBonusScore, maxWorksheetsBonus);
      performanceScore += worksheetsBonusScore;
      
      console.log(`📝 أوراق العمل: +${worksheetsBonusScore}/${maxWorksheetsBonus}`);
    }
    
    // التأكد من عدم تجاوز الحد الأقصى (40 + 5 = 45)
    const maxPerformanceScore = termConfig.breakdown.performanceTasks.totalScore + 
                                (termConfig.breakdown.performanceTasks.worksheetsBonus || 0);
    performanceScore = Math.min(performanceScore, maxPerformanceScore);
    performanceScore = Math.round(performanceScore * 100) / 100; // تقريب لرقمين عشريين
    
    console.log(`✅ المهام: ${completedTasks}/${totalTasks} × ${scorePerTask} = ${performanceScore}/${maxPerformanceScore}`);
    
    // ════════════════════════════════════════════════════════
    // 2. الأنشطة
    // ════════════════════════════════════════════════════════
    const activityIds = termConfig.activityIds;
    const { data: activities } = await supabase
      .from('activity_submissions')
      .select('activity_id, score')
      .eq('student_mobile', studentMobile)
      .in('activity_id', activityIds);
    
    let activitiesScore = 0;
    if (activities && activities.length > 0) {
      // كل نشاط من 5 درجات في النظام، لكن في التوزيع كل نشاط = 5 درجات
      // نحسب: (درجة الطالب في النشاط / 5) × 5 = درجة الطالب مباشرة
      // لكن نحصرها في الحد الأقصى لكل نشاط
      const scorePerActivity = termConfig.breakdown.activities.scorePerActivity; // 5 درجات
      const maxActivityScore = 5; // كل نشاط من 5 نقاط في النظام
      
      activities.forEach(activity => {
        const activityScore = parseFloat(activity.score) || 0;
        // تحويل: (درجة الطالب / 5) × 5 = درجة الطالب مباشرة
        // لكن نحصرها في scorePerActivity
        const convertedScore = Math.min((activityScore / maxActivityScore) * scorePerActivity, scorePerActivity);
        activitiesScore += convertedScore;
      });
      
      // التأكد من عدم تجاوز الحد الأقصى
      activitiesScore = Math.min(activitiesScore, termConfig.breakdown.activities.totalScore);
      activitiesScore = Math.round(activitiesScore * 100) / 100; // تقريب لرقمين عشريين
    }
    
    console.log(`✅ الأنشطة: ${activitiesScore}/${termConfig.breakdown.activities.totalScore}`);
    
    // ════════════════════════════════════════════════════════
    // 3. المشاريع
    // ════════════════════════════════════════════════════════
    const projectIds = termConfig.projectIds;
    const { data: projects } = await supabase
      .from('project_submissions')
      .select('project_id, grade, status')
      .eq('student_mobile', studentMobile)
      .eq('status', 'approved')
      .in('project_id', projectIds);
    
    let projectsScore = 0;
    if (projects && projects.length > 0) {
      projectsScore = projects.reduce((sum, p) => sum + (parseFloat(p.grade) || 0), 0);
      projectsScore = Math.min(projectsScore, termConfig.breakdown.projects.totalScore);
    }
    
    console.log(`✅ المشاريع: ${projectsScore}/${termConfig.breakdown.projects.totalScore}`);
    
    // ════════════════════════════════════════════════════════
    // 4. اختبارات الوحدة
    // ════════════════════════════════════════════════════════
    const examIds = termConfig.examIds;
    const { data: unitExams } = await supabase
      .from('unit_exam_submissions')
      .select('exam_id, score')
      .eq('student_mobile', studentMobile)
      .in('exam_id', examIds);
    
    let examsScore = 0;
    if (unitExams && unitExams.length > 0) {
      // ✅ حساب كل اختبار على حدة بدقة
      const scorePerExam = termConfig.breakdown.unitExams.scorePerExam;
      const examMaxScore = 10; // كل اختبار من 10 درجات
      
      unitExams.forEach(exam => {
        const examScore = parseFloat(exam.score) || 0;
        // تحويل الدرجة: (درجة الطالب / 10) × الدرجة المخصصة
        examsScore += (examScore / examMaxScore) * scorePerExam;
      });
      
      // التأكد من عدم تجاوز الحد الأقصى
      examsScore = Math.min(examsScore, termConfig.breakdown.unitExams.totalScore);
      examsScore = Math.round(examsScore * 100) / 100; // تقريب لرقمين عشريين
    }
    
    console.log(`✅ الاختبارات: ${examsScore}/${termConfig.breakdown.unitExams.totalScore}`);
    
    // ════════════════════════════════════════════════════════
    // الإجمالي
    // ════════════════════════════════════════════════════════
    const totalScore = performanceScore + activitiesScore + projectsScore + examsScore;
    const percentage = Math.round((totalScore / termConfig.totalScore) * 100);
    
    console.log(`🎯 إجمالي الفترة ${termNumber}: ${totalScore}/${termConfig.totalScore} (${percentage}%)`);
    
    return {
      termNumber,
      termName: termConfig.name,
      performance: {
        completed: completedTasks,
        total: totalTasks,
        score: performanceScore,
        maxScore: termConfig.breakdown.performanceTasks.totalScore
      },
      activities: {
        score: activitiesScore,
        maxScore: termConfig.breakdown.activities.totalScore
      },
      projects: {
        score: projectsScore,
        maxScore: termConfig.breakdown.projects.totalScore
      },
      exams: {
        score: examsScore,
        maxScore: termConfig.breakdown.unitExams.totalScore
      },
      totalScore,
      maxScore: termConfig.totalScore,
      percentage
    };
    
  } catch (error) {
    console.error(`❌ خطأ في حساب الفترة ${termNumber}:`, error);
    throw error;
  }
}

/**
 * حساب درجات جميع الفترات للطالب
 * @param {string} studentMobile - رقم جوال الطالب
 * @param {object} supabase - عميل Supabase
 * @returns {Promise<object>} نتيجة الحساب الكامل
 */
async function calculateAllTermsScores(studentMobile, supabase) {
  console.log('\n═══════════════════════════════════════════════');
  console.log('🎓 بدء حساب درجات جميع الفترات');
  console.log('═══════════════════════════════════════════════');
  
  try {
    // حساب الفترة الأولى
    const term1 = await calculateTermScore(studentMobile, 1, supabase);
    
    // حساب الفترة الثانية
    const term2 = await calculateTermScore(studentMobile, 2, supabase);
    
    // الإجمالي الكلي
    const grandTotal = term1.totalScore + term2.totalScore;
    const grandPercentage = Math.round((grandTotal / TERMS_CONFIG.grandTotal) * 100);
    
    console.log('\n═══════════════════════════════════════════════');
    console.log(`🏆 الإجمالي الكلي: ${grandTotal}/${TERMS_CONFIG.grandTotal} (${grandPercentage}%)`);
    console.log('═══════════════════════════════════════════════\n');
    
    return {
      term1,
      term2,
      grandTotal,
      grandMaxTotal: TERMS_CONFIG.grandTotal,
      grandPercentage,
      success: true
    };
    
  } catch (error) {
    console.error('❌ خطأ في حساب الدرجات:', error);
    return {
      term1: null,
      term2: null,
      grandTotal: 0,
      grandMaxTotal: TERMS_CONFIG.grandTotal,
      grandPercentage: 0,
      success: false,
      error: error.message
    };
  }
}

/**
 * تحديث عناصر الواجهة بالدرجات
 * @param {object} scoresData - بيانات الدرجات
 */
function updateScoresUI(scoresData) {
  if (!scoresData || !scoresData.success) {
    console.error('❌ لا توجد بيانات لتحديث الواجهة');
    return;
  }
  
  console.log('🖥️ تحديث واجهة الطالب...');
  
  const { term1, term2, grandTotal, grandPercentage } = scoresData;
  
  // ════════════════════════════════════════════════════════
  // تحديث نسبة الإنجاز الإجمالية (شريط التقدم)
  // ════════════════════════════════════════════════════════
  const percentageEl = document.getElementById('student-completion-percentage');
  if (percentageEl) percentageEl.textContent = `${grandPercentage}%`;
  
  const progressBar = document.getElementById('student-progress-bar');
  const progressText = document.getElementById('progress-text');
  if (progressBar) {
    setTimeout(() => {
      progressBar.style.width = `${grandPercentage}%`;
      if (progressText) progressText.textContent = `${grandPercentage}%`;
    }, 200);
  }
  
  // ════════════════════════════════════════════════════════
  // تحديث دائرة الفترة الأولى
  // ════════════════════════════════════════════════════════
  if (term1) {
    const term1ScoreEl = document.getElementById('term1-score');
    if (term1ScoreEl) term1ScoreEl.textContent = term1.totalScore;
    
    const term1Circle = document.getElementById('term1-circle-progress');
    if (term1Circle) {
      const term1Offset = 238.76 - (238.76 * term1.percentage / 100);
      setTimeout(() => {
        term1Circle.style.strokeDashoffset = term1Offset;
      }, 200);
    }
  }
  
  // ════════════════════════════════════════════════════════
  // تحديث دائرة الفترة الثانية
  // ════════════════════════════════════════════════════════
  if (term2) {
    const term2ScoreEl = document.getElementById('term2-score');
    if (term2ScoreEl) term2ScoreEl.textContent = term2.totalScore;
    
    const term2Circle = document.getElementById('term2-circle-progress');
    if (term2Circle) {
      const term2Offset = 238.76 - (238.76 * term2.percentage / 100);
      setTimeout(() => {
        term2Circle.style.strokeDashoffset = term2Offset;
      }, 300);
    }
  }
  
  // ════════════════════════════════════════════════════════
  // تحديث تفاصيل الفترة الأولى
  // ════════════════════════════════════════════════════════
  if (term1) {
    updateElement('term1-performance-score', `${term1.performance.score}/${term1.performance.maxScore}`);
    updateElement('term1-performance-tasks', `${term1.performance.completed}/${term1.performance.total}`);
    updateElement('term1-activities-score', `${term1.activities.score}/${term1.activities.maxScore}`);
    updateElement('term1-projects-score', `${term1.projects.score}/${term1.projects.maxScore}`);
    updateElement('term1-exams-score', `${term1.exams.score}/${term1.exams.maxScore}`);
    updateElement('term1-total-score', `${term1.totalScore}/${term1.maxScore}`);
    updateElement('term1-percentage', `${term1.percentage}%`);
  }
  
  // ════════════════════════════════════════════════════════
  // تحديث تفاصيل الفترة الثانية
  // ════════════════════════════════════════════════════════
  if (term2) {
    updateElement('term2-performance-score', `${term2.performance.score}/${term2.performance.maxScore}`);
    updateElement('term2-performance-tasks', `${term2.performance.completed}/${term2.performance.total}`);
    updateElement('term2-activities-score', `${term2.activities.score}/${term2.activities.maxScore}`);
    updateElement('term2-projects-score', `${term2.projects.score}/${term2.projects.maxScore}`);
    updateElement('term2-exams-score', `${term2.exams.score}/${term2.exams.maxScore}`);
    updateElement('term2-total-score', `${term2.totalScore}/${term2.maxScore}`);
    updateElement('term2-percentage', `${term2.percentage}%`);
  }
  
  console.log('✅ تم تحديث الواجهة بنجاح');
}

/**
 * دالة مساعدة لتحديث عنصر في الواجهة
 */
function updateElement(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}
