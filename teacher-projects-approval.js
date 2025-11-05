// ============================================================
// نظام اعتماد المشاريع للمعلم
// ============================================================
// التاريخ: 28 أكتوبر 2025
// الوصف: واجهة للمعلم لاعتماد درجات المشاريع المرفوعة
// ============================================================

// عرض المشاريع المعلقة (pending) في الصفحة الرئيسية
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

// فتح صفحة اعتماد المشاريع
function openProjectsApprovalPage() {
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('projects-approval-screen').classList.remove('hidden');
  loadProjectsForApproval();
}

// العودة إلى الصفحة الرئيسية
function backToDashboardFromProjects() {
  document.getElementById('projects-approval-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
}

// تحميل المشاريع للاعتماد
async function loadProjectsForApproval(filterStatus = 'all') {
  const container = document.getElementById('projects-approval-list');
  container.innerHTML = '<div class="text-center py-16"><div class="loader"></div></div>';

  try {
    let query = supabase
      .from('project_submissions')
      .select(`
        *,
        students!inner(name, mobile),
        lessons!inner(title, unit)
      `)
      .order('submitted_at', { ascending: false });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data: projects, error } = await query;

    if (error) throw error;

    if (!projects || projects.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-gray-600 text-lg">لا توجد مشاريع ${filterStatus === 'pending' ? 'معلقة' : filterStatus === 'approved' ? 'معتمدة' : 'مرفوضة'}</p>
        </div>
      `;
      return;
    }

    // تصنيف حسب الحالة
    const pending = projects.filter(p => p.status === 'pending');
    const approved = projects.filter(p => p.status === 'approved');
    const rejected = projects.filter(p => p.status === 'rejected');

    let html = `
      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-wrap gap-3">
          <button onclick="loadProjectsForApproval('all')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            📚 الكل (${projects.length})
          </button>
          <button onclick="loadProjectsForApproval('pending')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ⏳ معلقة (${pending.length})
          </button>
          <button onclick="loadProjectsForApproval('approved')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ✅ معتمدة (${approved.length})
          </button>
          <button onclick="loadProjectsForApproval('rejected')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ❌ مرفوضة (${rejected.length})
          </button>
        </div>
      </div>

      <!-- Projects Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    const displayList = filterStatus === 'all' ? projects :
                       filterStatus === 'pending' ? pending :
                       filterStatus === 'approved' ? approved : rejected;

    displayList.forEach(project => {
      html += createProjectCard(project, project.status);
    });

    html += `</div>`;
    container.innerHTML = html;

  } catch (error) {
    console.error('Error loading projects:', error);
    container.innerHTML = `
      <div class="text-center py-16">
        <p class="text-red-500">❌ خطأ في تحميل المشاريع</p>
      </div>
    `;
  }
}

// إنشاء بطاقة مشروع
function createProjectCard(project, status) {
  const date = new Date(project.submitted_at).toLocaleString('ar-SA');
  const reviewedDate = project.reviewed_at ? new Date(project.reviewed_at).toLocaleString('ar-SA') : '';
  
  const borderColor = 'border-cyan-300';
  const bgColor = 'bg-gradient-to-br from-cyan-50 to-sky-50';

  const fileIcon = project.file_type?.startsWith('image/') ? '🖼️' :
                  project.file_type?.includes('pdf') ? '📄' :
                  project.file_type?.includes('zip') || project.file_type?.includes('rar') ? '🗜️' : '📎';

  const statusBadge = status === 'pending' ? 
    '<span class="inline-block px-3 py-1 bg-yellow-600 text-white rounded-full text-xs font-bold">⏳ معلق</span>' :
    status === 'approved' ?
    '<span class="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold">✅ معتمد</span>' :
    '<span class="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold">❌ مرفوض</span>';

  return `
    <div class="bg-white border-2 ${borderColor} ${bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-gray-900 mb-1">${sanitize(project.lessons?.title || 'المشروع')}</h3>
          <p class="text-sm text-gray-600">الدرس ${project.lesson_id}</p>
        </div>
        ${statusBadge}
      </div>

      <!-- Student Name -->
      <div class="bg-gradient-to-r from-cyan-50 to-sky-50 border-2 border-cyan-200 rounded-lg p-3 mb-3">
        <p class="text-sm text-cyan-900">
          <span class="font-bold">👤 الطالب:</span> ${sanitize(project.students?.name || project.student_mobile)}
        </p>
        ${project.students?.mobile ? `<p class="text-xs text-cyan-600 mt-1">📱 ${project.students.mobile}</p>` : ''}
      </div>

      <!-- Unit -->
      <p class="text-sm text-gray-700 mb-2">📚 ${sanitize(project.lessons?.unit || '')}</p>

      <!-- File Info -->
      <div class="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <p class="text-xs text-gray-600 mb-1">${fileIcon} ${sanitize(project.file_name)}</p>
        <p class="text-xs text-gray-500">📅 تاريخ الرفع: ${date}</p>
      </div>

      <!-- Grade Display (if approved) -->
      ${status === 'approved' ? `
        <div class="bg-green-100 border border-green-300 rounded-lg p-3 mb-3">
          <p class="text-sm font-bold text-green-900">🎯 الدرجة: ${project.grade}/5</p>
          ${project.feedback ? `<p class="text-xs text-green-700 mt-1">💬 ${sanitize(project.feedback)}</p>` : ''}
          <p class="text-xs text-green-600 mt-1">✅ تم الاعتماد في: ${reviewedDate}</p>
        </div>
      ` : status === 'rejected' ? `
        <div class="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
          <p class="text-sm font-bold text-red-900">❌ مرفوض</p>
          ${project.feedback ? `<p class="text-xs text-red-700 mt-1">💬 ${sanitize(project.feedback)}</p>` : ''}
        </div>
      ` : ''}

      <!-- Actions -->
      <div class="flex gap-2">
        <button onclick="openFileViewer('${project.file_url}', '${project.file_type || ''}', '${sanitize(project.file_name)}')" 
                class="flex-1 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition">
          👁️ عرض الملف
        </button>
        ${status === 'pending' ? `
          <button onclick="openApprovalModal(${project.id}, '${sanitize(project.students?.name || project.student_mobile)}', '${sanitize(project.lessons?.title || '')}')" 
                  class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition">
            ✅ اعتماد
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

// فتح نافذة اعتماد الدرجة
function openApprovalModal(projectId, studentMobile, lessonTitle) {
  const modal = document.getElementById('approval-modal');
  const form = document.getElementById('approval-form');
  
  form.dataset.projectId = projectId;
  form.dataset.studentMobile = studentMobile;
  
  document.getElementById('approval-student-name').textContent = studentMobile;
  document.getElementById('approval-lesson-title').textContent = lessonTitle;
  document.getElementById('approval-grade').value = '5';
  document.getElementById('approval-notes').value = '';
  
  modal.classList.remove('hidden');
}

// إغلاق نافذة الاعتماد
function closeApprovalModal() {
  document.getElementById('approval-modal').classList.add('hidden');
}

// حفظ الدرجة واعتمادها
async function saveProjectApproval() {
  const form = document.getElementById('approval-form');
  const projectId = parseInt(form.dataset.projectId);
  const studentMobile = form.dataset.studentMobile;
  const grade = parseFloat(document.getElementById('approval-grade').value);
  const notes = document.getElementById('approval-notes').value.trim();
  const action = document.querySelector('input[name="approval-action"]:checked').value;

  if (!grade && action === 'approve') {
    alert('⚠️ الرجاء إدخال الدرجة');
    return;
  }

  if (grade && (grade < 0 || grade > 5)) {
    alert('⚠️ الدرجة يجب أن تكون بين 0 و 5');
    return;
  }

  const saveBtn = document.getElementById('save-approval-btn');
  saveBtn.disabled = true;
  saveBtn.innerHTML = '<span class="loader-small"></span> جاري الحفظ...';

  try {
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      feedback: notes || ''
    };

    if (action === 'approve') {
      updateData.grade = grade;
    }

    // تحديث المشروع
    const { error } = await supabase
      .from('project_submissions')
      .update(updateData)
      .eq('id', projectId);

    if (error) throw error;

    alert(action === 'approve' ? '✅ تم اعتماد الدرجة بنجاح!' : '❌ تم رفض المشروع');
    
    closeApprovalModal();
    loadProjectsForApproval();
    displayPendingProjectsAlert(); // تحديث الإشعارات

  } catch (error) {
    console.error('Error saving approval:', error);
    alert('❌ خطأ في حفظ البيانات: ' + error.message);
    saveBtn.disabled = false;
    saveBtn.innerHTML = '💾 حفظ';
  }
}

// تحديث helper function sanitize إذا لم تكن موجودة
function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// استدعاء عند تحميل لوحة المعلم
document.addEventListener('DOMContentLoaded', () => {
  // إضافة الإشعار إلى الصفحة الرئيسية
  const dashboardContent = document.querySelector('#dashboard-screen .container');
  if (dashboardContent) {
    const alertDiv = document.createElement('div');
    alertDiv.id = 'pending-projects-alert';
    alertDiv.className = 'mb-6 hidden';
    dashboardContent.insertBefore(alertDiv, dashboardContent.firstChild);
  }
});
