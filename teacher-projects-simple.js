// ============================================================
// نظام اعتماد المشاريع المبسط - في نفس الصفحة
// ============================================================
// التاريخ: 28 أكتوبر 2025
// الوصف: عرض الملفات واعتمادها في modal واحد
// ============================================================

// عرض إشعار المشاريع المعلقة
async function displayPendingProjectsAlert() {
  try {
    // جلب المشاريع المعلقة
    const { data: pendingProjects, error } = await supabase
      .from('project_submissions')
      .select(`
        *,
        lessons (
          title,
          unit
        )
      `)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true });

    if (error) throw error;

    const count = pendingProjects ? pendingProjects.length : 0;

    // عرض إشعار إذا كان هناك مشاريع معلقة
    if (count > 0) {
      const alertDiv = document.getElementById('pending-projects-alert');
      if (alertDiv) {
        alertDiv.innerHTML = `
          <div class="bg-gradient-to-r from-cyan-50 to-sky-50 border-2 border-cyan-300 rounded-xl p-6 shadow-lg">
            <div class="flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-xl flex items-center justify-center text-2xl animate-bounce">
                  🎨
                </div>
                <div>
                  <h3 class="text-xl font-bold text-cyan-900">⚠️ مشاريع بانتظار المراجعة</h3>
                  <p class="text-cyan-700 mt-1">يوجد <span class="font-bold">${count}</span> مشروع بحاجة إلى اعتماد الدرجة</p>
                </div>
              </div>
              <button onclick="openProjectsApprovalPage()" 
                      class="bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-105">
                📋 مراجعة المشاريع
              </button>
            </div>
          </div>
        `;
        alertDiv.classList.remove('hidden');
      }
    } else {
      const alertDiv = document.getElementById('pending-projects-alert');
      if (alertDiv) {
        alertDiv.innerHTML = '';
        alertDiv.classList.add('hidden');
      }
    }

    return count;
  } catch (error) {
    console.error('Error fetching pending projects:', error);
    return 0;
  }
}

// عرض أول مشروع معلق
async function showNextPendingProject() {
  try {
    const { data: pendingProjects, error } = await supabase
      .from('project_submissions')
      .select(`
        *,
        lessons (
          title,
          unit
        )
      `)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true })
      .limit(1);

    if (error) throw error;

    if (pendingProjects && pendingProjects.length > 0) {
      // جلب اسم الطالب من جدول students
      const project = pendingProjects[0];
      const { data: student } = await supabase
        .from('students')
        .select('name')
        .eq('mobile', project.student_mobile)
        .single();
      
      project.student_name = student?.name || 'غير معروف';
      openProjectReviewModal(project);
    } else {
      alert('✅ لا توجد مشاريع معلقة!');
      displayPendingProjectsAlert(); // تحديث الإشعار
    }
  } catch (error) {
    console.error('Error loading pending project:', error);
    alert('❌ خطأ في تحميل المشروع');
  }
}

// فتح modal المراجعة
function openProjectReviewModal(project) {
  const modal = document.getElementById('project-review-modal');
  const date = new Date(project.submitted_at).toLocaleString('ar-SA');
  
  // تحديد نوع الملف
  const isPdf = project.file_type?.includes('pdf');
  const isImage = project.file_type?.startsWith('image/');
  const isZip = project.file_type?.includes('zip') || project.file_type?.includes('rar');

  // بناء عارض الملف
  let fileViewer = '';
  if (isPdf) {
    fileViewer = `
      <iframe src="${project.file_url}" 
              class="w-full h-[500px] rounded-lg border-2 border-gray-300"
              frameborder="0">
      </iframe>
      <p class="text-xs text-gray-500 mt-2 text-center">
        إذا لم يظهر الملف، <a href="${project.file_url}" target="_blank" class="text-blue-600 underline">اضغط هنا لفتحه في نافذة جديدة</a>
      </p>
    `;
  } else if (isImage) {
    fileViewer = `
      <div class="text-center">
        <img src="${project.file_url}" 
             alt="Project Image" 
             class="max-w-full max-h-[500px] mx-auto rounded-lg border-2 border-gray-300">
      </div>
    `;
  } else if (isZip) {
    fileViewer = `
      <div class="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 text-center">
        <p class="text-4xl mb-4">🗜️</p>
        <p class="text-lg font-bold text-gray-700 mb-2">ملف مضغوط</p>
        <p class="text-sm text-gray-600 mb-4">${sanitize(project.file_name)}</p>
        <a href="${project.file_url}" 
           target="_blank"
           class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition">
          📥 تحميل الملف
        </a>
      </div>
    `;
  } else {
    fileViewer = `
      <div class="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 text-center">
        <p class="text-4xl mb-4">📄</p>
        <p class="text-lg font-bold text-gray-700 mb-2">ملف</p>
        <p class="text-sm text-gray-600 mb-4">${sanitize(project.file_name)}</p>
        <a href="${project.file_url}" 
           target="_blank"
           class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition">
          📥 تحميل الملف
        </a>
      </div>
    `;
  }

  // ملء Modal
  document.getElementById('review-modal-content').innerHTML = `
    <!-- Project Info -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-600 mb-1">👤 الطالب:</p>
          <p class="text-lg font-bold text-gray-900">${sanitize(project.student_name || 'غير معروف')}</p>
          <p class="text-xs text-gray-500 mt-1">📱 ${sanitize(project.student_mobile)}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">📅 تاريخ الرفع:</p>
          <p class="text-sm font-bold text-gray-700">${date}</p>
        </div>
      </div>
      <div class="mt-3">
        <p class="text-xs text-gray-600 mb-1">📚 المشروع:</p>
        <p class="text-lg font-bold text-gray-900">${sanitize(project.lessons?.title || 'مشروع')}</p>
        <p class="text-sm text-gray-600">${sanitize(project.lessons?.unit || '')}</p>
      </div>
      ${project.project_notes ? `
        <div class="mt-3 bg-white rounded-lg p-3">
          <p class="text-xs text-gray-600 mb-1">💬 ملاحظات الطالب:</p>
          <p class="text-sm text-gray-700">${sanitize(project.project_notes)}</p>
        </div>
      ` : ''}
    </div>

    <!-- File Viewer -->
    <div class="mb-6">
      <h3 class="text-lg font-bold text-gray-900 mb-3">📎 الملف المرفق:</h3>
      ${fileViewer}
    </div>

    <!-- Grade Input -->
    <div class="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4">
      <h3 class="text-lg font-bold text-green-900 mb-4">✅ اعتماد الدرجة</h3>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">🎯 الدرجة (من 5):</label>
          <input type="number" 
                 id="review-grade" 
                 min="0" 
                 max="5" 
                 step="0.5"
                 value="5"
                 class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg font-bold text-center">
        </div>
        <div class="flex items-end">
          <button onclick="setQuickGrade(5)" class="flex-1 bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-bold mx-1">5/5</button>
          <button onclick="setQuickGrade(4)" class="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded-lg text-sm font-bold mx-1">4/5</button>
          <button onclick="setQuickGrade(3)" class="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-bold mx-1">3/5</button>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-bold text-gray-700 mb-2">💬 ملاحظات (اختياري):</label>
        <textarea id="review-notes" 
                  rows="3" 
                  class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="أضف ملاحظاتك هنا..."></textarea>
      </div>

      <div class="flex gap-3">
        <button onclick="approveProject(${project.id}, '${sanitize(project.student_mobile)}')" 
                id="approve-btn"
                class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition">
          ✅ اعتماد المشروع
        </button>
        <button onclick="rejectProject(${project.id})" 
                class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition">
          ❌ رفض
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

// إغلاق modal
function closeProjectReviewModal() {
  document.getElementById('project-review-modal').classList.add('hidden');
}

// تعيين درجة سريعة
function setQuickGrade(grade) {
  document.getElementById('review-grade').value = grade;
}

// اعتماد المشروع
async function approveProject(projectId, studentMobile) {
  const grade = parseFloat(document.getElementById('review-grade').value);
  const notes = document.getElementById('review-notes').value.trim();

  if (!grade || grade < 0 || grade > 5) {
    alert('⚠️ الرجاء إدخال درجة صحيحة (0-5)');
    return;
  }

  const approveBtn = document.getElementById('approve-btn');
  approveBtn.disabled = true;
  approveBtn.innerHTML = '<span class="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin ml-2"></span> جاري الحفظ...';

  try {
    const { error } = await supabase
      .from('project_submissions')
      .update({
        status: 'approved',
        grade: grade,
        feedback: notes || '',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (error) throw error;

    alert(`✅ تم اعتماد المشروع بنجاح!\n🎯 الدرجة: ${grade}/5\n👤 الطالب: ${studentMobile}`);
    
    closeProjectReviewModal();
    await displayPendingProjectsAlert(); // تحديث الإشعار
    
    // عرض المشروع التالي إذا وجد
    setTimeout(() => {
      showNextPendingProject();
    }, 500);

  } catch (error) {
    console.error('Error approving project:', error);
    alert('❌ خطأ في حفظ البيانات: ' + error.message);
    approveBtn.disabled = false;
    approveBtn.innerHTML = '✅ اعتماد المشروع';
  }
}

// رفض المشروع
async function rejectProject(projectId) {
  const notes = document.getElementById('review-notes').value.trim();
  
  if (!confirm('⚠️ هل أنت متأكد من رفض هذا المشروع؟')) {
    return;
  }

  try {
    const { error } = await supabase
      .from('project_submissions')
      .update({
        status: 'rejected',
        feedback: notes || 'تم رفض المشروع',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', projectId);

    if (error) throw error;

    alert('❌ تم رفض المشروع');
    
    closeProjectReviewModal();
    await displayPendingProjectsAlert();
    
    // عرض المشروع التالي
    setTimeout(() => {
      showNextPendingProject();
    }, 500);

  } catch (error) {
    console.error('Error rejecting project:', error);
    alert('❌ خطأ في حفظ البيانات: ' + error.message);
  }
}

// helper function
function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// إضافة الإشعار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  const dashboardContent = document.querySelector('#dashboard-screen .container');
  if (dashboardContent && !document.getElementById('pending-projects-alert')) {
    const alertDiv = document.createElement('div');
    alertDiv.id = 'pending-projects-alert';
    alertDiv.className = 'mb-6 hidden';
    dashboardContent.insertBefore(alertDiv, dashboardContent.firstChild);
  }
});
