// ════════════════════════════════════════════════════════════
// نظام اعتماد الواجبات للمعلم
// ════════════════════════════════════════════════════════════

let currentHomeworkId = null;
let currentHomeworkStudentMobile = null;
let currentHomeworkLessonId = null;

// ════════════════════════════════════════════════════════════
// عرض إشعار الواجبات المعلقة
// ════════════════════════════════════════════════════════════
async function displayPendingHomeworkAlert() {
  try {
    const { data: pendingHomework, error } = await supabase
      .from('homework_submissions')
      .select(`
        id,
        student_mobile,
        lesson_id,
        students!inner(name),
        lessons!inner(title, unit)
      `)
      .eq('status', 'pending');

    if (error) throw error;

    const count = pendingHomework?.length || 0;
    const alertDiv = document.getElementById('pending-homework-alert');
    
    if (!alertDiv) return;

    if (count > 0) {
      alertDiv.innerHTML = `
        <div class="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-xl p-6 shadow-lg">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl animate-bounce">
                📤
              </div>
              <div>
                <h3 class="text-xl font-bold text-rose-900">⚠️ واجبات بانتظار المراجعة</h3>
                <p class="text-rose-700 mt-1">يوجد <span class="font-bold">${count}</span> واجب بحاجة إلى اعتماد الدرجة</p>
              </div>
            </div>
            <button onclick="showHomeworkApprovalScreen()" 
                    class="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:scale-105">
              📋 مراجعة الواجبات
            </button>
          </div>
        </div>
      `;
      alertDiv.classList.remove('hidden');
    } else {
      alertDiv.innerHTML = '';
      alertDiv.classList.add('hidden');
    }
  } catch (error) {
    console.error('Error displaying pending homework alert:', error);
  }
}

// ════════════════════════════════════════════════════════════
// عرض شاشة اعتماد الواجبات
// ════════════════════════════════════════════════════════════
function showHomeworkApprovalScreen() {
  document.getElementById('dashboard-screen').classList.add('hidden');
  document.getElementById('homework-approval-screen').classList.remove('hidden');
  loadHomeworkForApproval();
}

function backToDashboardFromHomework() {
  document.getElementById('homework-approval-screen').classList.add('hidden');
  document.getElementById('dashboard-screen').classList.remove('hidden');
}

// ════════════════════════════════════════════════════════════
// تحميل الواجبات حسب الحالة
// ════════════════════════════════════════════════════════════
async function loadHomeworkForApproval(filterStatus = 'all') {
  const listContainer = document.getElementById('homework-approval-list');
  listContainer.innerHTML = '<div class="text-center py-16"><div class="loader"></div></div>';

  try {
    let query = supabase
      .from('homework_submissions')
      .select(`
        *,
        students!inner(name, mobile),
        lessons!inner(title, unit)
      `)
      .order('submitted_at', { ascending: false });

    if (filterStatus !== 'all') {
      query = query.eq('status', filterStatus);
    }

    const { data: homework, error } = await query;

    if (error) throw error;

    if (!homework || homework.length === 0) {
      listContainer.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-gray-600 text-lg">لا توجد واجبات ${filterStatus === 'pending' ? 'معلقة' : filterStatus === 'approved' ? 'معتمدة' : 'مرفوضة'}</p>
        </div>
      `;
      return;
    }

    // تصنيف حسب الحالة
    const pending = homework.filter(h => h.status === 'pending');
    const approved = homework.filter(h => h.status === 'approved');
    const rejected = homework.filter(h => h.status === 'rejected');

    let html = `
      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex flex-wrap gap-3">
          <button onclick="loadHomeworkForApproval('all')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            📚 الكل (${homework.length})
          </button>
          <button onclick="loadHomeworkForApproval('pending')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ⏳ معلقة (${pending.length})
          </button>
          <button onclick="loadHomeworkForApproval('approved')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ✅ معتمدة (${approved.length})
          </button>
          <button onclick="loadHomeworkForApproval('rejected')" 
                  class="px-6 py-3 rounded-lg font-bold transition ${filterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}">
            ❌ مرفوضة (${rejected.length})
          </button>
        </div>
      </div>

      <!-- Homework Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    `;

    const displayList = filterStatus === 'all' ? homework :
                       filterStatus === 'pending' ? pending :
                       filterStatus === 'approved' ? approved : rejected;

    displayList.forEach(hw => {
      html += createHomeworkCard(hw, hw.status);
    });

    html += `</div>`;
    listContainer.innerHTML = html;

  } catch (error) {
    console.error('Error loading homework:', error);
    listContainer.innerHTML = `
      <div class="text-center py-16">
        <p class="text-red-500">❌ خطأ في تحميل الواجبات</p>
      </div>
    `;
  }
}

// ════════════════════════════════════════════════════════════
// إنشاء بطاقة واجب
// ════════════════════════════════════════════════════════════
function createHomeworkCard(homework, status) {
  const date = new Date(homework.submitted_at).toLocaleString('ar-SA');
  const reviewedDate = homework.reviewed_at ? new Date(homework.reviewed_at).toLocaleString('ar-SA') : '';
  
  const borderColor = 'border-rose-300';
  const bgColor = 'bg-gradient-to-br from-rose-50 to-pink-50';

  const fileIcon = homework.file_type?.startsWith('image/') ? '🖼️' :
                  homework.file_type?.includes('pdf') ? '📄' : '📎';

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
          <h3 class="text-lg font-bold text-gray-900 mb-1">${sanitize(homework.lessons?.title || 'الواجب')}</h3>
          <p class="text-sm text-gray-600">الدرس ${homework.lesson_id}</p>
        </div>
        ${statusBadge}
      </div>

      <!-- Student Name -->
      <div class="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-lg p-3 mb-3">
        <p class="text-sm text-rose-900">
          <span class="font-bold">👤 الطالب:</span> ${sanitize(homework.students?.name || homework.student_mobile)}
        </p>
        ${homework.students?.mobile ? `<p class="text-xs text-rose-600 mt-1">📱 ${homework.students.mobile}</p>` : ''}
      </div>

      <!-- Unit -->
      <p class="text-sm text-gray-700 mb-2">📚 ${sanitize(homework.lessons?.unit || '')}</p>

      <!-- File Info -->
      <div class="bg-white border border-gray-200 rounded-lg p-3 mb-3">
        <p class="text-xs text-gray-600 mb-1">${fileIcon} ${sanitize(homework.file_name)}</p>
        <p class="text-xs text-gray-500">📅 تاريخ الرفع: ${date}</p>
      </div>

      <!-- Grade Display (if approved) -->
      ${status === 'approved' ? `
        <div class="bg-green-100 border border-green-300 rounded-lg p-3 mb-3">
          <p class="text-sm font-bold text-green-900">🎯 الدرجة: ${homework.grade}/5</p>
          ${homework.feedback ? `<p class="text-xs text-green-700 mt-1">💬 ${sanitize(homework.feedback)}</p>` : ''}
          <p class="text-xs text-green-600 mt-1">✅ تم الاعتماد في: ${reviewedDate}</p>
        </div>
      ` : status === 'rejected' ? `
        <div class="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
          <p class="text-sm font-bold text-red-900">❌ مرفوض</p>
          ${homework.feedback ? `<p class="text-xs text-red-700 mt-1">💬 ${sanitize(homework.feedback)}</p>` : ''}
        </div>
      ` : ''}

      <!-- Actions -->
      <div class="flex gap-2">
        <button onclick="openFileViewer('${homework.file_url}', '${homework.file_type || ''}', '${sanitize(homework.file_name)}')" 
                class="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition">
          👁️ عرض الملف
        </button>
        ${status === 'pending' ? `
          <button onclick="openHomeworkApprovalModal(${homework.id}, '${homework.student_mobile}', ${homework.lesson_id}, '${sanitize(homework.students?.name || homework.student_mobile)}', '${sanitize(homework.lessons?.title || '')}')" 
                  class="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-bold transition">
            ✅ اعتماد
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// فتح نافذة الاعتماد
// ════════════════════════════════════════════════════════════
function openHomeworkApprovalModal(homeworkId, studentMobile, lessonId, studentName, lessonTitle) {
  currentHomeworkId = homeworkId;
  currentHomeworkStudentMobile = studentMobile;
  currentHomeworkLessonId = lessonId;

  document.getElementById('homework-approval-student-name').textContent = studentName;
  document.getElementById('homework-approval-lesson-title').textContent = lessonTitle;
  document.getElementById('homework-approval-grade').value = '5';
  document.getElementById('homework-approval-notes').value = '';
  
  // إعادة تعيين زر الحفظ لحالته الأصلية
  const saveBtn = document.getElementById('save-homework-approval-btn');
  saveBtn.disabled = false;
  saveBtn.innerHTML = '💾 حفظ';
  
  // إعادة تعيين الاختيار إلى "اعتماد"
  document.querySelector('input[name="homework-approval-action"][value="approve"]').checked = true;

  document.getElementById('homework-approval-modal').classList.remove('hidden');
}

function closeHomeworkApprovalModal() {
  document.getElementById('homework-approval-modal').classList.add('hidden');
  currentHomeworkId = null;
  currentHomeworkStudentMobile = null;
  currentHomeworkLessonId = null;
}

// ════════════════════════════════════════════════════════════
// حفظ الاعتماد
// ════════════════════════════════════════════════════════════
async function saveHomeworkApproval() {
  const action = document.querySelector('input[name="homework-approval-action"]:checked')?.value;
  const grade = parseFloat(document.getElementById('homework-approval-grade').value);
  const notes = document.getElementById('homework-approval-notes').value.trim();

  if (!action) {
    alert('⚠️ الرجاء اختيار الإجراء (اعتماد أو رفض)');
    return;
  }

  if (action === 'approve' && (isNaN(grade) || grade < 0 || grade > 5)) {
    alert('⚠️ الرجاء إدخال درجة صحيحة من 0 إلى 5');
    return;
  }

  const saveBtn = document.getElementById('save-homework-approval-btn');
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

    // تحديث الواجب
    const { error } = await supabase
      .from('homework_submissions')
      .update(updateData)
      .eq('id', currentHomeworkId);

    if (error) throw error;

    // إعادة تعيين الزر بعد النجاح
    saveBtn.disabled = false;
    saveBtn.innerHTML = '💾 حفظ';

    alert(action === 'approve' ? '✅ تم اعتماد الدرجة بنجاح!' : '❌ تم رفض الواجب');
    
    closeHomeworkApprovalModal();
    loadHomeworkForApproval();
    displayPendingHomeworkAlert(); // تحديث الإشعارات

  } catch (error) {
    console.error('Error saving homework approval:', error);
    alert('❌ خطأ في حفظ البيانات: ' + error.message);
    saveBtn.disabled = false;
    saveBtn.innerHTML = '💾 حفظ';
  }
}

// Helper function
function sanitize(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ════════════════════════════════════════════════════════════
// عرض الملف
// ════════════════════════════════════════════════════════════
function openFileViewer(fileUrl, fileType, fileName) {
  const modal = document.getElementById('file-viewer-modal');
  const content = document.getElementById('file-viewer-content');
  
  let viewerHtml = '';
  
  if (fileType && fileType.startsWith('image/')) {
    // عرض الصور
    viewerHtml = `
      <div class="flex items-center justify-center h-full">
        <img src="${fileUrl}" alt="${fileName}" class="max-w-full max-h-full object-contain rounded-lg shadow-lg">
      </div>
    `;
  } else if (fileType && fileType.includes('pdf')) {
    // عرض PDF
    viewerHtml = `
      <iframe src="${fileUrl}" class="w-full h-full border-0 rounded-lg"></iframe>
    `;
  } else {
    // ملفات أخرى - عرض رابط تحميل
    viewerHtml = `
      <div class="flex flex-col items-center justify-center h-full gap-4">
        <div class="text-6xl">📎</div>
        <p class="text-lg font-bold text-gray-800">${fileName}</p>
        <p class="text-gray-600">لا يمكن معاينة هذا النوع من الملفات</p>
        <a href="${fileUrl}" download target="_blank" 
           class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition">
          📥 تحميل الملف
        </a>
      </div>
    `;
  }
  
  content.innerHTML = viewerHtml;
  modal.classList.remove('hidden');
}

function closeFileViewer() {
  const modal = document.getElementById('file-viewer-modal');
  modal.classList.add('hidden');
  document.getElementById('file-viewer-content').innerHTML = '';
}
