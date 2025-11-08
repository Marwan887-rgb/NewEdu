// دوال عرض البيانات في الواجهة

// عرض بطاقات الطلاب مع نسبة الإنجاز والدرجات
async function displayStudentsCards(students) {
  const container = document.getElementById('students-cards-container');
  
  if (!students || students.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-2">لا يوجد طلاب في هذا الفصل</p>';
    return;
  }
  
  // عرض شاشة تحميل
  container.innerHTML = '<div class="col-span-2 text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div><p class="mt-2 text-gray-600 text-sm">جارٍ حساب الدرجات...</p></div>';
  
  // حساب الدرجات لكل طالب
  const studentsWithScores = await Promise.all(
    students.map(async (student, index) => {
      const score = await calculateStudentScore(student.mobile);
      return { ...student, ...score, index };
    })
  );
  
  // عرض البطاقات
  container.innerHTML = studentsWithScores.map((student) => `
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 hover:shadow-lg transition">
      <!-- رأس البطاقة -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            ${student.index + 1}
          </div>
          <div>
            <h4 class="font-bold text-gray-800 text-sm">${student.name}</h4>
            <p class="text-xs text-gray-600" dir="ltr">${student.mobile}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold ${student.totalScore >= 160 ? 'text-green-600' : student.totalScore >= 100 ? 'text-yellow-600' : 'text-red-600'}">
            ${student.totalScore}/200
          </p>
          <p class="text-xs text-gray-600">الدرجة</p>
        </div>
      </div>
      
      <!-- شريط التقدم -->
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold text-gray-700">نسبة الإنجاز</span>
          <span class="text-xs font-bold ${student.completionPercentage >= 80 ? 'text-green-600' : student.completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'}">
            ${student.completionPercentage}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div class="h-3 rounded-full transition-all ${student.completionPercentage >= 80 ? 'bg-green-500' : student.completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}" 
               style="width: ${student.completionPercentage}%"></div>
        </div>
      </div>
      
      <!-- تفاصيل الدرجات -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-white rounded-lg p-2">
          <p class="text-gray-600">مهام أدائية</p>
          <p class="font-bold text-indigo-700">${student.performanceScore}/95</p>
        </div>
        <div class="bg-white rounded-lg p-2">
          <p class="text-gray-600">أنشطة</p>
          <p class="font-bold text-purple-700">${student.activitiesScore}/15</p>
          <p class="text-gray-500 text-xs">(${student.activitiesCount || 0}/3)</p>
        </div>
        <div class="bg-white rounded-lg p-2">
          <p class="text-gray-600">مشاريع</p>
          <p class="font-bold text-pink-700">${student.projectsScore}/30</p>
          <p class="text-gray-500 text-xs">(${student.projectsCount || 0}/3)</p>
        </div>
        <div class="bg-white rounded-lg p-2">
          <p class="text-gray-600">اختبارات وحدة</p>
          <p class="font-bold text-cyan-700">${student.unitExamsScore}/60</p>
          <p class="text-gray-500 text-xs">(${student.examsCount || 0}/3)</p>
        </div>
      </div>
      
      <!-- معلومات إضافية -->
      <div class="flex items-center justify-between text-xs pt-3 border-t border-indigo-200 mt-3">
        <span class="text-gray-600">مهام مكتملة: <span class="font-bold text-indigo-700">${student.completedTasks}/45</span></span>
        ${student.hasTelegram ? 
          '<span class="text-green-700 bg-green-100 px-2 py-1 rounded">📱</span>' : 
          '<span class="text-gray-600 bg-gray-100 px-2 py-1 rounded">❌</span>'}
      </div>
    </div>
  `).join('');
}

// عرض ملخص الدرجات
function displayGradesSummary(students, examsData) {
  const container = document.getElementById('grades-summary-container');
  
  if (!students || students.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">لا يوجد بيانات</p>';
    return;
  }
  
  // حساب الإحصائيات
  const totalStudents = students.length;
  const studentsWithExams = new Set(examsData.map(e => e.student_mobile)).size;
  const totalExams = examsData.length;
  const averageScore = totalExams > 0 ? 
    (examsData.reduce((sum, e) => sum + (e.score || 0), 0) / totalExams).toFixed(1) : 0;
  
  container.innerHTML = `
    <div class="space-y-3">
      <div class="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-purple-900">إجمالي الطلاب</span>
          <span class="text-2xl font-bold text-purple-600">${totalStudents}</span>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-green-900">اختبروا</span>
          <span class="text-2xl font-bold text-green-600">${studentsWithExams}</span>
        </div>
        <div class="mt-2 bg-green-200 rounded-full h-2">
          <div class="bg-green-600 h-2 rounded-full transition-all" 
               style="width: ${totalStudents > 0 ? (studentsWithExams / totalStudents * 100) : 0}%"></div>
        </div>
      </div>
      
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-blue-900">المعدل</span>
          <span class="text-2xl font-bold text-blue-600">${averageScore}</span>
        </div>
        <p class="text-xs text-blue-700 mt-1">من 10 درجات</p>
      </div>
      
      <div class="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-amber-900">الاختبارات</span>
          <span class="text-2xl font-bold text-amber-600">${totalExams}</span>
        </div>
        <p class="text-xs text-amber-700 mt-1">إجمالي المحاولات</p>
      </div>
    </div>
  `;
}

// عرض المهام الأدائية
function displayPerformanceTasks(students, lessons, progressData) {
  const container = document.getElementById('performance-tasks-container');
  
  if (!students || students.length === 0 || !lessons || lessons.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">لا يوجد بيانات</p>';
    return;
  }
  
  const tasks = [
    { id: 'lesson', name: 'عرض الدرس', icon: '👁️', 
      bgClass: 'from-blue-50 to-blue-100', borderClass: 'border-blue-300', 
      iconBg: 'bg-blue-200', textClass: 'text-blue-900', labelClass: 'text-blue-700',
      progressBg: 'bg-blue-200', progressFill: 'bg-blue-600', btnClass: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'video', name: 'مشاهدة الفيديو', icon: '🎬',
      bgClass: 'from-purple-50 to-purple-100', borderClass: 'border-purple-300',
      iconBg: 'bg-purple-200', textClass: 'text-purple-900', labelClass: 'text-purple-700',
      progressBg: 'bg-purple-200', progressFill: 'bg-purple-600', btnClass: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'worksheet', name: 'ورقة العمل', icon: '📝',
      bgClass: 'from-amber-50 to-amber-100', borderClass: 'border-amber-300',
      iconBg: 'bg-amber-200', textClass: 'text-amber-900', labelClass: 'text-amber-700',
      progressBg: 'bg-amber-200', progressFill: 'bg-amber-600', btnClass: 'bg-amber-600 hover:bg-amber-700' },
    { id: 'assignment', name: 'الواجب', icon: '📤',
      bgClass: 'from-rose-50 to-rose-100', borderClass: 'border-rose-300',
      iconBg: 'bg-rose-200', textClass: 'text-rose-900', labelClass: 'text-rose-700',
      progressBg: 'bg-rose-200', progressFill: 'bg-rose-600', btnClass: 'bg-rose-600 hover:bg-rose-700' },
    { id: 'final', name: 'التقويم النهائي', icon: '🎯',
      bgClass: 'from-emerald-50 to-emerald-100', borderClass: 'border-emerald-300',
      iconBg: 'bg-emerald-200', textClass: 'text-emerald-900', labelClass: 'text-emerald-700',
      progressBg: 'bg-emerald-200', progressFill: 'bg-emerald-600', btnClass: 'bg-emerald-600 hover:bg-emerald-700' }
  ];
  
  const tasksHTML = tasks.map(task => {
    // حساب عدد الطلاب الذين أكملوا المهمة
    const completedStudents = new Set(
      progressData
        .filter(p => p.task === task.id)
        .map(p => p.student_mobile)
    );
    
    const completed = completedStudents.size;
    const total = students.length;
    const percentage = total > 0 ? (completed / total * 100).toFixed(0) : 0;
    
    return `
      <div class="bg-gradient-to-r ${task.bgClass} border-2 ${task.borderClass} rounded-xl p-6 hover:shadow-lg transition">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="${task.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              ${task.icon}
            </div>
            <div>
              <h4 class="font-bold ${task.textClass}">${task.name}</h4>
              <p class="text-xs ${task.labelClass}">المهمة: ${task.id}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold ${task.labelClass}">${completed}</div>
            <p class="text-xs ${task.labelClass}">من ${total}</p>
          </div>
        </div>
        
        <div class="${task.progressBg} rounded-full h-3 mb-2">
          <div class="${task.progressFill} h-3 rounded-full transition-all" style="width: ${percentage}%"></div>
        </div>
        <p class="text-xs ${task.textClass} text-center font-semibold">${percentage}% مكتمل</p>
        
        <div class="mt-4 pt-4 border-t ${task.borderClass}">
          <button onclick="showTaskDetails('${task.id}', '${task.name}')" 
                  class="w-full ${task.btnClass} text-white py-2 rounded-lg text-sm font-semibold transition">
            عرض التفاصيل
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${tasksHTML}</div>`;
}

// عرض مهام الوحدات
function displayUnitTasks(students, projectsData, activitiesData, unitExamsData) {
  const container = document.getElementById('unit-tasks-container');
  
  if (!students || students.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">لا يوجد بيانات</p>';
    return;
  }
  
  const total = students.length;
  
  // حساب الإحصائيات
  const projectsCompleted = new Set(projectsData.map(p => p.student_mobile)).size;
  const activitiesCompleted = new Set(activitiesData.map(a => a.mobile)).size;
  const examsCompleted = new Set(unitExamsData.map(e => e.student_mobile)).size;
  
  const projectsPercentage = total > 0 ? (projectsCompleted / total * 100).toFixed(0) : 0;
  const activitiesPercentage = total > 0 ? (activitiesCompleted / total * 100).toFixed(0) : 0;
  const examsPercentage = total > 0 ? (examsCompleted / total * 100).toFixed(0) : 0;
  
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- مشروع الوحدة -->
      <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-cyan-200 p-4 rounded-full">
            <span class="text-3xl">🎨</span>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-cyan-600">${projectsCompleted}</div>
            <p class="text-xs text-cyan-700">من ${total}</p>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-cyan-900 mb-3">مشروع الوحدة</h3>
        
        <div class="bg-cyan-200 rounded-full h-3 mb-2">
          <div class="bg-cyan-600 h-3 rounded-full transition-all" style="width: ${projectsPercentage}%"></div>
        </div>
        <p class="text-sm text-cyan-800 text-center font-semibold mb-4">${projectsPercentage}% مكتمل</p>
        
        <div class="bg-white rounded-lg p-3 text-xs text-cyan-800 space-y-1 mb-4">
          <p>• ${projectsCompleted} مشروع مسلّم</p>
          <p>• ${total - projectsCompleted} لم يسلم</p>
          <p>• الملفات المرفوعة: ${projectsData.length}</p>
        </div>
        
        <button onclick="showUnitTaskDetails('project')" 
                class="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg text-sm font-semibold transition">
          عرض التفاصيل
        </button>
      </div>

      <!-- النشاط -->
      <div class="bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-violet-200 p-4 rounded-full">
            <span class="text-3xl">⚡</span>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-violet-600">${activitiesCompleted}</div>
            <p class="text-xs text-violet-700">من ${total}</p>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-violet-900 mb-3">النشاط</h3>
        
        <div class="bg-violet-200 rounded-full h-3 mb-2">
          <div class="bg-violet-600 h-3 rounded-full transition-all" style="width: ${activitiesPercentage}%"></div>
        </div>
        <p class="text-sm text-violet-800 text-center font-semibold mb-4">${activitiesPercentage}% مكتمل</p>
        
        <div class="bg-white rounded-lg p-3 text-xs text-violet-800 space-y-1 mb-4">
          <p>• ${activitiesCompleted} نشاط مكتمل</p>
          <p>• ${total - activitiesCompleted} لم يكمل</p>
          <p>• إجمالي الأنشطة: ${activitiesData.length}</p>
        </div>
        
        <button onclick="showUnitTaskDetails('activity')" 
                class="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg text-sm font-semibold transition">
          عرض التفاصيل
        </button>
      </div>

      <!-- اختبار الوحدة -->
      <div class="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="bg-orange-200 p-4 rounded-full">
            <span class="text-3xl">📝</span>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold text-orange-600">${examsCompleted}</div>
            <p class="text-xs text-orange-700">من ${total}</p>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-orange-900 mb-3">اختبار الوحدة</h3>
        
        <div class="bg-orange-200 rounded-full h-3 mb-2">
          <div class="bg-orange-600 h-3 rounded-full transition-all" style="width: ${examsPercentage}%"></div>
        </div>
        <p class="text-sm text-orange-800 text-center font-semibold mb-4">${examsPercentage}% مكتمل</p>
        
        <div class="bg-white rounded-lg p-3 text-xs text-orange-800 space-y-1 mb-4">
          <p>• ${examsCompleted} اختبار مكتمل</p>
          <p>• ${total - examsCompleted} لم يختبر</p>
          <p>• إجمالي المحاولات: ${unitExamsData.length}</p>
        </div>
        
        <button onclick="showUnitTaskDetails('exam')" 
                class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg text-sm font-semibold transition">
          عرض التفاصيل
        </button>
      </div>
      
    </div>
  `;
}

// متغيرات عامة لتخزين البيانات الحالية
let currentTaskData = {
  taskId: null,
  taskName: null,
  lessonId: null,
  isPerformanceTask: false // true للمهام الأدائية، false لمهام الوحدات
};

// عرض تفاصيل مهمة معينة (يعرض قائمة الدروس أولاً)
async function showTaskDetails(taskId, taskName) {
  // حفظ بيانات المهمة الحالية
  currentTaskData.taskId = taskId;
  currentTaskData.taskName = taskName;
  currentTaskData.isPerformanceTask = true; // هذه مهمة أدائية
  
  // إخفاء محتوى الفصل
  document.getElementById('class-details-container').classList.add('hidden');
  
  // إظهار قسم اختيار الدرس
  document.getElementById('lesson-selection-container').classList.remove('hidden');
  
  // تعيين العنوان
  document.getElementById('lesson-selection-title').innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-2xl">${getTaskIcon(taskId)}</span>
      <span>${taskName} - الفصل ${selectedClass}</span>
      <span class="text-sm text-gray-600">(اختر الدرس)</span>
    </div>
  `;
  
  // عرض شاشة تحميل
  document.getElementById('lessons-list').innerHTML = 
    '<div class="col-span-3 text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div><p class="mt-2 text-gray-600 text-sm">جارٍ تحميل الدروس...</p></div>';
  
  try {
    // جلب الدروس
    const lessons = await getLessons();
    
    // عرض قائمة الدروس
    displayLessonsList(lessons, taskId, taskName);
    
    // بدون تمرير تلقائي
    
  } catch (error) {
    console.error('Error loading lessons:', error);
    document.getElementById('lessons-list').innerHTML = 
      '<div class="col-span-3 text-center py-8 text-red-500"><p>❌ حدث خطأ في تحميل الدروس</p></div>';
  }
}

// عرض قائمة الدروس
function displayLessonsList(lessons, taskId, taskName) {
  const container = document.getElementById('lessons-list');
  
  if (!lessons || lessons.length === 0) {
    container.innerHTML = '<p class="col-span-3 text-gray-500 text-center py-8">لا توجد دروس</p>';
    return;
  }
  
  container.innerHTML = lessons.map((lesson, index) => `
    <div onclick="showLessonTaskDetails('${lesson.id}', '${escapeHtml(lesson.title)}')" 
         class="group bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-5 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
      <div class="flex items-center gap-3 mb-3">
        <div class="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
          ${index + 1}
        </div>
        <div class="flex-1">
          <h4 class="font-bold text-gray-800 text-sm mb-1">${lesson.title}</h4>
          <p class="text-xs text-indigo-700">الوحدة: ${lesson.unit || 'غير محدد'}</p>
        </div>
      </div>
      
      <div class="pt-3 border-t border-indigo-200">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-600">اضغط للعرض</span>
          <span class="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">←</span>
        </div>
      </div>
    </div>
  `).join('');
}

// عرض تفاصيل الطلاب لدرس ومهمة محددة
async function showLessonTaskDetails(lessonId, lessonName) {
  // حفظ بيانات الدرس
  currentTaskData.lessonId = lessonId;
  
  // إخفاء قسم اختيار الدرس
  document.getElementById('lesson-selection-container').classList.add('hidden');
  
  // إظهار قسم التفاصيل
  document.getElementById('task-details-container').classList.remove('hidden');
  
  // تعيين العنوان
  document.getElementById('task-detail-title').innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-2xl">${getTaskIcon(currentTaskData.taskId)}</span>
      <span>${currentTaskData.taskName} - ${lessonName} - الفصل ${selectedClass}</span>
    </div>
  `;
  
  // عرض شاشة تحميل
  document.getElementById('task-students-list').innerHTML = 
    '<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div><p class="mt-2 text-gray-600 text-sm">جارٍ التحميل...</p></div>';
  
  try {
    // جلب بيانات الطلاب والتقدم
    const students = await getClassStudents(selectedClass);
    const progressData = await getClassProgress(selectedClass);
    
    // فلترة التقدم حسب المهمة والدرس
    const taskProgress = progressData.filter(p => 
      p.task === currentTaskData.taskId && 
      (p.lesson_id == lessonId || p.lesson_title === lessonName)
    );
    const completedMobiles = new Set(taskProgress.map(p => p.student_mobile));
    
    // حساب الإحصائيات
    const completed = completedMobiles.size;
    const notCompleted = students.length - completed;
    const percentage = students.length > 0 ? ((completed / students.length) * 100).toFixed(0) : 0;
    
    // تحديث الإحصائيات
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('not-completed-count').textContent = notCompleted;
    document.getElementById('completion-percentage').textContent = `${percentage}%`;
    
    // عرض قائمة الطلاب
    displayStudentsList(students, completedMobiles, taskProgress);
    
    // بدون تمرير تلقائي
    
  } catch (error) {
    console.error('Error loading task details:', error);
    document.getElementById('task-students-list').innerHTML = 
      '<div class="text-center py-8 text-red-500"><p>❌ حدث خطأ في تحميل البيانات</p></div>';
  }
}

// عرض تفاصيل مهمة وحدة
async function showUnitTaskDetails(taskType) {
  const taskNames = {
    'project': 'مشروع الوحدة',
    'activity': 'النشاط',
    'exam': 'اختبار الوحدة'
  };
  
  const taskIcons = {
    'project': '🎨',
    'activity': '⚡',
    'exam': '📝'
  };
  
  // تعيين أن هذه مهمة وحدة وليست مهمة أدائية
  currentTaskData.isPerformanceTask = false;
  
  // إخفاء محتوى الفصل
  document.getElementById('class-details-container').classList.add('hidden');
  
  // إظهار قسم التفاصيل
  document.getElementById('task-details-container').classList.remove('hidden');
  
  // تعيين العنوان
  document.getElementById('task-detail-title').innerHTML = `
    <div class="flex items-center gap-3">
      <span class="text-2xl">${taskIcons[taskType]}</span>
      <span>${taskNames[taskType]} - الفصل ${selectedClass}</span>
    </div>
  `;
  
  // عرض شاشة تحميل
  document.getElementById('task-students-list').innerHTML = 
    '<div class="text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div><p class="mt-2 text-gray-600 text-sm">جارٍ التحميل...</p></div>';
  
  try {
    // جلب بيانات الطلاب
    const students = await getClassStudents(selectedClass);
    
    // جلب البيانات حسب نوع المهمة
    let submissionsData;
    if (taskType === 'project') {
      submissionsData = await getProjectSubmissions(selectedClass);
    } else if (taskType === 'activity') {
      submissionsData = await getActivitySubmissions(selectedClass);
    } else if (taskType === 'exam') {
      submissionsData = await getUnitExamSubmissions(selectedClass);
    }
    
    // استخراج الطلاب الذين أكملوا
    const completedMobiles = new Set(submissionsData.map(s => s.student_mobile || s.mobile));
    
    // حساب الإحصائيات
    const completed = completedMobiles.size;
    const notCompleted = students.length - completed;
    const percentage = students.length > 0 ? ((completed / students.length) * 100).toFixed(0) : 0;
    
    // تحديث الإحصائيات
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('not-completed-count').textContent = notCompleted;
    document.getElementById('completion-percentage').textContent = `${percentage}%`;
    
    // عرض قائمة الطلاب
    displayStudentsList(students, completedMobiles, submissionsData);
    
    // بدون تمرير تلقائي
    
  } catch (error) {
    console.error('Error loading unit task details:', error);
    document.getElementById('task-students-list').innerHTML = 
      '<div class="text-center py-8 text-red-500"><p>❌ حدث خطأ في تحميل البيانات</p></div>';
  }
}

// عرض قائمة الطلاب مع حالة الإنجاز
function displayStudentsList(students, completedMobiles, submissionsData) {
  const container = document.getElementById('task-students-list');
  
  if (!students || students.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">لا يوجد طلاب</p>';
    return;
  }
  
  // ترتيب: الذين أكملوا أولاً
  const sortedStudents = [...students].sort((a, b) => {
    const aCompleted = completedMobiles.has(a.mobile);
    const bCompleted = completedMobiles.has(b.mobile);
    if (aCompleted && !bCompleted) return -1;
    if (!aCompleted && bCompleted) return 1;
    return a.name.localeCompare(b.name, 'ar');
  });
  
  container.innerHTML = sortedStudents.map((student, index) => {
    const isCompleted = completedMobiles.has(student.mobile);
    const submission = submissionsData ? submissionsData.find(s => 
      (s.student_mobile === student.mobile || s.mobile === student.mobile)
    ) : null;
    
    return `
      <div class="flex items-center justify-between p-4 rounded-xl border-2 ${
        isCompleted 
          ? 'bg-green-50 border-green-300' 
          : 'bg-red-50 border-red-300'
      } hover:shadow-md transition">
        
        <!-- معلومات الطالب -->
        <div class="flex items-center gap-3 flex-1">
          <div class="${isCompleted ? 'bg-green-600' : 'bg-red-600'} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
            ${index + 1}
          </div>
          <div>
            <h4 class="font-bold text-gray-800">${student.name}</h4>
            <p class="text-xs text-gray-600" dir="ltr">${student.mobile}</p>
          </div>
        </div>
        
        <!-- حالة الإنجاز -->
        <div class="flex items-center gap-4">
          ${submission && submission.submitted_at ? `
            <div class="text-right hidden md:block">
              <p class="text-xs text-gray-600">التاريخ:</p>
              <p class="text-xs font-semibold text-gray-800">${formatDate(submission.submitted_at)}</p>
            </div>
          ` : ''}
          
          ${submission && (submission.score !== undefined || submission.grade !== undefined) ? `
            <div class="bg-white px-3 py-2 rounded-lg border border-gray-300">
              <p class="text-xs text-gray-600">الدرجة</p>
              <p class="text-lg font-bold text-indigo-600">${submission.score || submission.grade || 0}</p>
            </div>
          ` : ''}
          
          <div class="flex items-center gap-2">
            ${isCompleted ? `
              <span class="text-3xl">✅</span>
              <span class="font-bold text-green-700">أكمل</span>
            ` : `
              <span class="text-3xl">❌</span>
              <span class="font-bold text-red-700">لم يكمل</span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// إخفاء تفاصيل المهمة والرجوع للصفحة الصحيحة
function hideTaskDetails() {
  document.getElementById('task-details-container').classList.add('hidden');
  
  // إذا كانت مهمة أدائية → ارجع لاختيار الدرس
  // إذا كانت مهمة وحدة → ارجع للفصل مباشرة
  if (currentTaskData.isPerformanceTask) {
    document.getElementById('lesson-selection-container').classList.remove('hidden');
  } else {
    document.getElementById('class-details-container').classList.remove('hidden');
  }
  
  // بدون تمرير تلقائي
}

// إخفاء اختيار الدرس والرجوع للفصل
function hideLessonSelection() {
  document.getElementById('lesson-selection-container').classList.add('hidden');
  document.getElementById('class-details-container').classList.remove('hidden');
  
  // بدون تمرير تلقائي
}

// الحصول على أيقونة المهمة
function getTaskIcon(taskId) {
  const icons = {
    'lesson': '👁️',
    'video': '🎬',
    'worksheet': '📝',
    'assignment': '📤',
    'final': '🎯'
  };
  return icons[taskId] || '📊';
}

// تنسيق التاريخ
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// تنظيف النص من HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
