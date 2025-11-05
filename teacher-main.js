// إعدادات Supabase
const SUPABASE_URL = 'https://vtvewxxokrrwrwlubpkr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dmV3eHhva3Jyd3J3bHVicGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDMxNDUsImV4cCI6MjA3Njg3OTE0NX0.rp9ip1WjNK70Bc0eN218Yo_goSlcxWerTQFBnV0iRFQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let selectedClass = null;

// تحميل جميع البيانات عند فتح الصفحة
window.addEventListener('DOMContentLoaded', () => {
  loadAllData();
});

async function loadAllData() {
  try {
    await Promise.all([
      loadClassesData(),
      loadStatistics(),
      loadLessonsCount(),
      loadExamsCount()
    ]);
    
    // إذا كان هناك فصل مختار، حدّث بياناته
    if (selectedClass) {
      updateClassStats(selectedClass);
    }
    
    // عرض إشعار المشاريع المعلقة
    if (typeof displayPendingProjectsAlert === 'function') {
      await displayPendingProjectsAlert();
    }
    
    // عرض إشعار الواجبات المعلقة
    if (typeof displayPendingHomeworkAlert === 'function') {
      await displayPendingHomeworkAlert();
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

async function loadClassesData() {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('class')
      .order('class');

    if (error) throw error;

    // حساب عدد الطلاب لكل فصل
    const class301 = students.filter(s => s.class === '301').length;
    const class302 = students.filter(s => s.class === '302').length;

    // تحديث الأعداد في جميع الأماكن
    const count301Elements = [
      document.getElementById('count-301-inline'),
      document.getElementById('count-301-mobile'),
      document.getElementById('count-301')
    ];
    const count302Elements = [
      document.getElementById('count-302-inline'),
      document.getElementById('count-302-mobile'),
      document.getElementById('count-302')
    ];
    
    count301Elements.forEach(el => {
      if (el) el.textContent = class301;
    });
    count302Elements.forEach(el => {
      if (el) el.textContent = class302;
    });

    // حساب نسبة الإنجاز (يتم تحديثها عند اختيار الفصل)
    await calculateClassProgress('301');
    await calculateClassProgress('302');

  } catch (error) {
    console.error('Error loading classes:', error);
  }
}

async function calculateClassProgress(className) {
  try {
    // جلب طلاب الفصل
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('mobile')
      .eq('class', className);

    if (studentsError) throw studentsError;
    
    if (!students || students.length === 0) {
      document.getElementById(`progress-${className}`).style.width = '0%';
      return;
    }

    // جلب عدد المهام المكتملة لطلاب هذا الفصل
    const mobiles = students.map(s => s.mobile);
    const { count, error: progressError } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .in('student_mobile', mobiles);

    if (progressError) throw progressError;

    // حساب النسبة (افتراض 5 مهام لكل درس × عدد الدروس × عدد الطلاب)
    const { count: lessonsCount } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'lesson');

    const totalExpectedTasks = students.length * (lessonsCount || 0) * 5;
    const percentage = totalExpectedTasks > 0 ? Math.round((count / totalExpectedTasks) * 100) : 0;

    document.getElementById(`progress-${className}`).style.width = `${Math.min(percentage, 100)}%`;

  } catch (error) {
    console.error(`Error calculating progress for ${className}:`, error);
  }
}

async function loadStatistics() {
  try {
    // إجمالي الطلاب
    const { count: studentsCount } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true });
    document.getElementById('total-students').textContent = studentsCount || 0;

    // مرتبطون بتليجرام
    const { count: telegramCount } = await supabase
      .from('telegram_chats')
      .select('*', { count: 'exact', head: true });
    document.getElementById('total-telegram').textContent = telegramCount || 0;

    // المهام المكتملة
    const { count: progressCount } = await supabase
      .from('progress')
      .select('*', { count: 'exact', head: true });
    document.getElementById('total-progress').textContent = progressCount || 0;

    // حساب معدل الإنجاز
    if (studentsCount > 0) {
      const avgCompletion = Math.round((progressCount / (studentsCount * 5 * 10)) * 100); // افتراض 10 دروس × 5 مهام
      document.getElementById('avg-completion').textContent = `${Math.min(avgCompletion, 100)}%`;
    }

  } catch (error) {
    console.error('Error loading statistics:', error);
  }
}

async function loadLessonsCount() {
  try {
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });
    document.getElementById('total-lessons').textContent = count || 0;
  } catch (error) {
    console.error('Error loading lessons count:', error);
  }
}

async function loadExamsCount() {
  try {
    const { count } = await supabase
      .from('final_exams')
      .select('*', { count: 'exact', head: true });
    document.getElementById('total-exams').textContent = count || 0;
  } catch (error) {
    console.error('Error loading exams count:', error);
  }
}

function selectClass(className) {
  selectedClass = className;
  
  // تمييز الفصل المختار - إعادة تعيين الجميع أولاً
  document.querySelectorAll('[id^="class-"]').forEach(card => {
    card.style.border = '3px solid rgba(255, 255, 255, 0.5)';
    card.style.background = 'rgba(255, 255, 255, 0.15)';
    card.style.boxShadow = '';
  });
  
  // تمييز الدائرة المختارة بـ border سميك ملون و glow
  const selectedCard = document.getElementById(`class-card-${className}`);
  if (selectedCard) {
    selectedCard.style.border = '4px solid rgba(255, 255, 255, 0.9)';
    selectedCard.style.background = 'rgba(255, 255, 255, 0.25)';
    selectedCard.style.boxShadow = '0 0 25px rgba(255, 255, 255, 0.6), 0 0 50px rgba(148, 163, 184, 0.4)';
  }
  
  // إظهار بطاقات التنقل في sidebar
  const navigationCards = document.getElementById('navigation-cards');
  if (navigationCards) {
    navigationCards.classList.remove('hidden');
  }
  
  // لا نفعل شيء في منطقة المحتوى عند اختيار الفصل
  // المحتوى سيتغير فقط عند الضغط على الأيقونات
  
  // تحديث الإحصائيات
  updateClassStats(className);
}

async function updateClassStats(className) {
  try {
    // جلب طلاب الفصل
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('mobile')
      .eq('class', className);

    if (studentsError) throw studentsError;
    
    if (!students || students.length === 0) {
      // إعادة تعيين كل الإحصائيات إلى صفر
      ['lesson', 'video', 'worksheet', 'assignment', 'final'].forEach(task => {
        document.getElementById(`stat-${task}`).textContent = '0';
      });
      ['project', 'activity', 'exam'].forEach(task => {
        document.getElementById(`stat-${task}`).textContent = '0';
      });
      return;
    }

    const mobiles = students.map(s => s.mobile);

    // تحديث المهام الأدائية (5 مهام)
    const tasks = ['lesson', 'video', 'worksheet', 'assignment', 'final'];
    for (const task of tasks) {
      const { data, error } = await supabase
        .from('progress')
        .select('student_mobile', { count: 'exact' })
        .in('student_mobile', mobiles)
        .eq('task', task);

      if (!error && data) {
        // عد الطلاب الفريدين الذين أكملوا هذه المهمة
        const uniqueStudents = new Set(data.map(p => p.student_mobile));
        document.getElementById(`stat-${task}`).textContent = uniqueStudents.size;
      }
    }

    // تحديث مشروع الوحدة
    const { count: projectCount } = await supabase
      .from('unit_projects')
      .select('*', { count: 'exact', head: true })
      .in('mobile', mobiles);
    document.getElementById('stat-project').textContent = projectCount || 0;

    // تحديث النشاط
    const { count: activityCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .in('mobile', mobiles);
    document.getElementById('stat-activity').textContent = activityCount || 0;

    // تحديث اختبار الوحدة
    const { count: examCount } = await supabase
      .from('unit_exams')
      .select('*', { count: 'exact', head: true })
      .in('mobile', mobiles);
    document.getElementById('stat-exam').textContent = examCount || 0;

  } catch (error) {
    console.error('Error updating class stats:', error);
  }
}

function openTask(taskType) {
  if (!selectedClass) {
    alert('⚠️ الرجاء اختيار فصل أولاً من الأعلى');
    return;
  }

  const taskNames = {
    'lesson': 'عرض الدرس',
    'video': 'مشاهدة الفيديو',
    'worksheet': 'ورقة العمل',
    'assignment': 'الواجب',
    'final': 'التقويم النهائي'
  };

  // الانتقال لصفحة كشف المهام الأدائية (سيتم تطويرها لاحقاً)
  alert(`📊 كشف ${taskNames[taskType]} للفصل ${selectedClass}\n\nسيتم فتح صفحة التفاصيل قريباً...`);
  
  // يمكن الانتقال إلى صفحة teacher-performance-report.html مع المعاملات
  // window.location.href = `teacher-performance-report.html?class=${selectedClass}&task=${taskType}`;
}

function openUnitTask(taskType) {
  if (!selectedClass) {
    alert('⚠️ الرجاء اختيار فصل أولاً من الأعلى');
    return;
  }

  const taskNames = {
    'project': 'مشروع الوحدة',
    'activity': 'النشاط',
    'exam': 'اختبار الوحدة'
  };

  alert(`📋 كشف ${taskNames[taskType]} للفصل ${selectedClass}\n\nسيتم فتح صفحة التفاصيل قريباً...`);
  
  // يمكن تطوير صفحات خاصة لكل نوع
  // window.location.href = `unit-${taskType}-report.html?class=${selectedClass}`;
}

function openGradesReport() {
  if (!selectedClass) {
    alert('⚠️ الرجاء اختيار فصل أولاً من الأعلى');
    return;
  }

  alert(`💯 كشف الدرجات للفصل ${selectedClass}\n\nسيتم فتح صفحة التفاصيل قريباً...`);
  
  // الانتقال لصفحة كشف الدرجات
  // window.location.href = `grades-report.html?class=${selectedClass}`;
}

// ===== وظائف المحتوى الديناميكي =====

async function loadClassDetails(className) {
  try {
    // عرض شاشة تحميل
    showLoadingInContainers();
    
    // جلب جميع البيانات بالتوازي
    const [studentsData, lessonsData, progressData, examsData, projectsData, activitiesData, unitExamsData] = await Promise.all([
      getClassStudents(className),
      getLessons(),
      getClassProgress(className),
      getExamSubmissions(className),
      getProjectSubmissions(className),
      getActivitySubmissions(className),
      getUnitExamSubmissions(className)
    ]);

    // عرض البيانات
    await displayStudentsCards(studentsData); // async function
    displayGradesSummary(studentsData, examsData);
    displayPerformanceTasks(studentsData, lessonsData, progressData);
    displayUnitTasks(studentsData, projectsData, activitiesData, unitExamsData);
    
  } catch (error) {
    console.error('Error loading class details:', error);
    showErrorInContainers(error.message);
  }
}

function showLoadingInContainers() {
  const loadingHTML = '<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div><p class="mt-2 text-gray-600 text-sm">جارٍ التحميل...</p></div>';
  document.getElementById('students-cards-container').innerHTML = loadingHTML;
  document.getElementById('grades-summary-container').innerHTML = loadingHTML;
  document.getElementById('performance-tasks-container').innerHTML = loadingHTML;
  document.getElementById('unit-tasks-container').innerHTML = loadingHTML;
}

function showErrorInContainers(message) {
  const errorHTML = `<div class="text-center py-8 text-red-500"><p>❌ ${message}</p></div>`;
  document.getElementById('students-cards-container').innerHTML = errorHTML;
  document.getElementById('grades-summary-container').innerHTML = errorHTML;
  document.getElementById('performance-tasks-container').innerHTML = errorHTML;
  document.getElementById('unit-tasks-container').innerHTML = errorHTML;
}

// حساب درجة الطالب ونسبة الإنجاز (نظام الفترتين - من 200 درجة)
async function calculateStudentScore(studentMobile) {
  try {
    // استخدام نظام حساب الفترتين الجديد
    const scoresData = await calculateAllTermsScores(studentMobile, supabase);
    
    if (!scoresData.success) {
      throw new Error(scoresData.error || 'فشل حساب الدرجات');
    }
    
    const { term1, term2, grandTotal, grandPercentage } = scoresData;
    
    // إرجاع التفاصيل بتنسيق متوافق مع الكود القديم + البيانات الجديدة
    return {
      // البيانات الجديدة (الفترتين)
      term1,
      term2,
      grandTotal,              // من 200
      grandPercentage,         // النسبة المئوية الكلية
      
      // التوافق مع الكود القديم (اختياري للتوافق)
      performanceScore: term1.performance.score + term2.performance.score,
      activitiesScore: term1.activities.score + term2.activities.score,
      projectsScore: term1.projects.score + term2.projects.score,
      unitExamsScore: term1.exams.score + term2.exams.score,
      totalScore: grandTotal,
      completionPercentage: grandPercentage,
      completedTasks: term1.performance.completed + term2.performance.completed,
      
      // معلومات إضافية
      success: true
    };
    
  } catch (error) {
    console.error('Error calculating student score:', error);
    return {
      term1: null,
      term2: null,
      grandTotal: 0,
      grandPercentage: 0,
      performanceScore: 0,
      activitiesScore: 0,
      projectsScore: 0,
      unitExamsScore: 0,
      totalScore: 0,
      completionPercentage: 0,
      completedTasks: 0,
      success: false,
      error: error.message
    };
  }
}

// جلب طلاب الفصل
async function getClassStudents(className) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('class', className)
    .order('name');
  
  if (error) throw error;
  
  // جلب معلومات التليجرام
  const { data: telegramData } = await supabase
    .from('telegram_chats')
    .select('mobile, chat_id');
  
  const telegramMap = {};
  (telegramData || []).forEach(t => telegramMap[t.mobile] = true);
  
  return (data || []).map(student => ({
    ...student,
    hasTelegram: telegramMap[student.mobile] || false
  }));
}

// جلب الدروس
async function getLessons() {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('type', 'lesson')
    .order('id');
  
  if (error) throw error;
  return data || [];
}

// جلب تقدم الفصل
async function getClassProgress(className) {
  const { data: students } = await supabase
    .from('students')
    .select('mobile')
    .eq('class', className);
  
  if (!students || students.length === 0) return [];
  
  const mobiles = students.map(s => s.mobile);
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .in('student_mobile', mobiles);
  
  if (error) throw error;
  return data || [];
}

// جلب إجابات الاختبارات
async function getExamSubmissions(className) {
  const { data: students } = await supabase
    .from('students')
    .select('mobile')
    .eq('class', className);
  
  if (!students || students.length === 0) return [];
  
  const mobiles = students.map(s => s.mobile);
  const { data, error } = await supabase
    .from('exam_submissions')
    .select('*')
    .in('student_mobile', mobiles);
  
  if (error) throw error;
  return data || [];
}

// جلب المشاريع المسلمة
async function getProjectSubmissions(className) {
  const { data: students } = await supabase
    .from('students')
    .select('mobile')
    .eq('class', className);
  
  if (!students || students.length === 0) return [];
  
  const mobiles = students.map(s => s.mobile);
  const { data, error } = await supabase
    .from('project_submissions')
    .select('*')
    .in('student_mobile', mobiles);
  
  if (error) {
    console.log('No project_submissions table or error:', error);
    return [];
  }
  return data || [];
}

// جلب الأنشطة المسلمة
async function getActivitySubmissions(className) {
  const { data: students } = await supabase
    .from('students')
    .select('mobile')
    .eq('class', className);
  
  if (!students || students.length === 0) return [];
  
  const mobiles = students.map(s => s.mobile);
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .in('mobile', mobiles);
  
  if (error) {
    console.log('No activities table or error:', error);
    return [];
  }
  return data || [];
}

// جلب اختبارات الوحدة
async function getUnitExamSubmissions(className) {
  const { data: students } = await supabase
    .from('students')
    .select('mobile')
    .eq('class', className);
  
  if (!students || students.length === 0) return [];
  
  const mobiles = students.map(s => s.mobile);
  const { data, error } = await supabase
    .from('unit_exam_submissions')
    .select('*')
    .in('student_mobile', mobiles);
  
  if (error) {
    console.log('No unit_exam_submissions table or error:', error);
    return [];
  }
  return data || [];
}
