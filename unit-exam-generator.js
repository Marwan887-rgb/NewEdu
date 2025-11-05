const SUPABASE_URL = 'https://vtvewxxokrrwrwlubpkr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dmV3eHhva3Jyd3J3bHVicGtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDMxNDUsImV4cCI6MjA3Njg3OTE0NX0.rp9ip1WjNK70Bc0eN218Yo_goSlcxWerTQFBnV0iRFQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let deepseekApiKey = localStorage.getItem('deepseek_api_key') || '';
let currentUnitData = null;

function saveApiKey() {
  const key = document.getElementById('deepseek-api-key').value.trim();
  if (!key) {
    showStatus('⚠️ الرجاء إدخال مفتاح API', 'error');
    return;
  }
  localStorage.setItem('deepseek_api_key', key);
  deepseekApiKey = key;
  showStatus('✅ تم حفظ المفتاح بنجاح', 'success');
  document.getElementById('deepseek-api-key').value = '';
}

async function loadUnits() {
  try {
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('type', 'lesson')
      .order('id');

    if (lessonsError) throw lessonsError;

    const unitsMap = {};
    lessons.forEach(lesson => {
      const unitName = lesson.unit || 'وحدة غير محددة';
      if (!unitsMap[unitName]) {
        unitsMap[unitName] = [];
      }
      unitsMap[unitName].push(lesson);
    });

    const { data: exams } = await supabase.from('unit_exams').select('unit_name');
    const existingExamUnits = new Set(exams?.map(e => e.unit_name) || []);
    
    const totalUnits = Object.keys(unitsMap).length;
    document.getElementById('total-units').textContent = totalUnits;
    document.getElementById('exams-generated').textContent = existingExamUnits.size;
    document.getElementById('remaining-units').textContent = totalUnits - existingExamUnits.size;
    document.getElementById('stats-section').classList.remove('hidden');

    const container = document.getElementById('units-container');
    container.innerHTML = Object.entries(unitsMap).map(([unitName, unitLessons]) => {
      const hasExam = existingExamUnits.has(unitName);
      const lessonIds = unitLessons.map(l => l.id).join(', ');
      
      return `
      <div class="border-2 ${hasExam ? 'border-green-300 bg-green-50' : 'border-gray-200'} rounded-xl p-5">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-xl font-bold text-gray-900">${unitName}</h3>
              ${hasExam ? '<span class="text-xs bg-green-600 text-white px-2 py-1 rounded-full">✓ تم التوليد</span>' : ''}
            </div>
            <p class="text-sm text-gray-600 mb-3">
              <strong>${unitLessons.length} دروس:</strong> ${unitLessons.map(l => l.title).join(' • ')}
            </p>
            <p class="text-xs text-gray-500">أرقام الدروس: ${lessonIds}</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              📝 الصق محتوى جميع دروس ${unitName}:
            </label>
            <textarea 
              id="content-${unitName.replace(/\s+/g, '-')}" 
              rows="6"
              placeholder="الصق هنا محتوى جميع الدروس في الوحدة مع فواصل واضحة..."
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none resize-none text-sm"></textarea>
            <p class="text-xs text-gray-500 mt-1">💡 نصيحة: اجمع محتوى جميع الدروس مع عنوان كل درس كفاصل</p>
          </div>
          
          <button onclick="generateUnitExam('${unitName}', [${unitLessons.map(l => l.id).join(',')}])" 
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-[1.02]">
            ${hasExam ? '🔄 إعادة توليد الاختبار' : '🧾 توليد اختبار الوحدة'}
          </button>
        </div>
      </div>
      `;
    }).join('');

  } catch (error) {
    showStatus('❌ خطأ في تحميل الوحدات: ' + error.message, 'error');
  }
}

async function generateUnitExam(unitName, lessonIds) {
  if (!deepseekApiKey) {
    showStatus('⚠️ الرجاء إدخال مفتاح DeepSeek API أولاً', 'error');
    return;
  }

  const content = document.getElementById(`content-${unitName.replace(/\s+/g, '-')}`).value.trim();

  if (!content) {
    showStatus('⚠️ الرجاء لصق محتوى دروس الوحدة', 'error');
    return;
  }

  if (content.length < 100) {
    showStatus('⚠️ المحتوى قصير جداً (100 حرف على الأقل)', 'error');
    return;
  }

  showStatus('⏳ جاري توليد اختبار الوحدة باستخدام DeepSeek AI...', 'info');

  try {
    const questions = await generateQuestionsWithDeepSeek(content, unitName);
    currentUnitData = { unitName, lessonIds, questions };
    showPreview(unitName, lessonIds, questions);
  } catch (error) {
    showStatus('❌ خطأ: ' + error.message, 'error');
  }
}

async function generateQuestionsWithDeepSeek(content, unitName) {
  const prompt = `بناءً على محتوى دروس ${unitName} التالية، أنشئ اختبار شامل للوحدة يحتوي على 10 أسئلة بمستوى متوسط:

- 4 أسئلة صح أو خطأ (true_false)
- 4 أسئلة اختيار من متعدد (multiple_choice)
- 2 أسئلة تعريفات (definition)

محتوى الوحدة:
${content}

مهم: الأسئلة يجب أن تغطي جميع الدروس في الوحدة بشكل متوازن.

أعد الأسئلة بصيغة JSON فقط:
[
  {"number": 1, "type": "true_false", "question": "...", "correct_answer": "true"},
  {"number": 5, "type": "multiple_choice", "question": "...", "options": ["أ", "ب", "ج", "د"], "correct_answer": "ب"},
  {"number": 9, "type": "definition", "question": "...", "correct_answer": "..."}
]`;

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${deepseekApiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'أنت خبير في إعداد الاختبارات الشاملة. أجب فقط بصيغة JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 3000
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`DeepSeek API Error: ${errorData.error?.message || 'خطأ غير معروف'}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;
  
  let jsonText = text.trim();
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonText = codeBlockMatch[1].trim();
  
  const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('لم يتم العثور على JSON');
  
  const questions = JSON.parse(jsonMatch[0]);
  
  if (!Array.isArray(questions) || questions.length !== 10) {
    throw new Error(`عدد الأسئلة ${questions.length} بدلاً من 10`);
  }
  
  const trueFalseCount = questions.filter(q => q.type === 'true_false').length;
  const multipleChoiceCount = questions.filter(q => q.type === 'multiple_choice').length;
  const definitionCount = questions.filter(q => q.type === 'definition').length;
  
  if (trueFalseCount !== 4 || multipleChoiceCount !== 4 || definitionCount !== 2) {
    throw new Error(`توزيع خاطئ: ${trueFalseCount} صح/خطأ، ${multipleChoiceCount} اختيار، ${definitionCount} تعريفات`);
  }
  
  return questions;
}

function showPreview(unitName, lessonIds, questions) {
  const modal = document.getElementById('preview-modal');
  const content = document.getElementById('preview-content');
  
  content.innerHTML = `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
        <h3 class="text-2xl font-bold text-indigo-900 mb-2">${unitName}</h3>
        <p class="text-gray-700"><strong>الدروس:</strong> ${lessonIds.join(', ')}</p>
        <p class="text-sm text-gray-600 mt-2">عدد الأسئلة: ${questions.length}</p>
      </div>
      <div class="space-y-4">
        ${questions.map(q => `
          <div class="bg-white border-2 border-gray-200 rounded-xl p-5">
            <div class="flex items-start gap-3">
              <span class="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">${q.number}</span>
              <div class="flex-1">
                <p class="font-semibold text-gray-900 mb-2">${q.question}</p>
                ${q.type === 'true_false' ? `
                  <span class="px-3 py-1 rounded-full ${q.correct_answer === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                    ✓ ${q.correct_answer === 'true' ? 'صح' : 'خطأ'}
                  </span>
                ` : q.type === 'multiple_choice' ? `
                  <div class="space-y-1 text-sm">
                    ${q.options.map((opt, i) => `
                      <div class="${opt === q.correct_answer ? 'font-bold text-green-700' : 'text-gray-600'}">
                        ${['أ', 'ب', 'ج', 'د'][i]}. ${opt} ${opt === q.correct_answer ? '✓' : ''}
                      </div>
                    `).join('')}
                  </div>
                ` : `
                  <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p class="text-xs font-semibold text-green-700">✓ التعريف:</p>
                    <p class="text-sm text-gray-900">${q.correct_answer}</p>
                  </div>
                `}
                <div class="mt-2 text-xs text-gray-500">
                  ${q.type === 'true_false' ? '📋 صح/خطأ' : q.type === 'multiple_choice' ? '🔘 اختيار' : '📝 تعريف'}
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.getElementById('confirm-save-btn').onclick = confirmSave;
}

function closePreview() {
  document.getElementById('preview-modal').classList.add('hidden');
  document.getElementById('preview-modal').classList.remove('flex');
  currentUnitData = null;
}

async function confirmSave() {
  if (!currentUnitData) {
    alert('❌ خطأ: لا توجد بيانات للحفظ');
    return;
  }

  const msg = `هل أنت متأكد من حفظ اختبار ${currentUnitData.unitName}؟\n\n` +
              `الدروس: ${currentUnitData.lessonIds.join(', ')}\n` +
              `الأسئلة: ${currentUnitData.questions.length} سؤال\n\n` +
              `سيتم الحفظ في جدول unit_exams (منفصل عن final_exams)`;

  if (!confirm(msg)) return;

  showStatus('⏳ جاري الحفظ...', 'info');

  try {
    const { error } = await supabase
      .from('unit_exams')
      .upsert({
        unit_name: currentUnitData.unitName,
        lesson_ids: currentUnitData.lessonIds,
        questions: currentUnitData.questions,
        total_marks: 10,
        updated_at: new Date().toISOString()
      }, { onConflict: 'unit_name' });

    if (error) throw error;

    showStatus('✅ تم حفظ اختبار الوحدة بنجاح!', 'success');
    closePreview();
    setTimeout(() => loadUnits(), 1000);
  } catch (error) {
    showStatus('❌ خطأ في الحفظ: ' + error.message, 'error');
  }
}

async function checkExistingExams() {
  try {
    const { data: exams, error } = await supabase
      .from('unit_exams')
      .select('*')
      .order('unit_name');
    
    if (error) throw error;
    
    if (!exams || exams.length === 0) {
      alert('⚠️ لا توجد اختبارات وحدات مولدة بعد');
      return;
    }
    
    let message = `📊 اختبارات الوحدات (${exams.length}):\n\n`;
    exams.forEach(exam => {
      const qCount = Array.isArray(exam.questions) ? exam.questions.length : 0;
      const lCount = Array.isArray(exam.lesson_ids) ? exam.lesson_ids.length : 0;
      message += `📚 ${exam.unit_name}\n   - الدروس: ${lCount} (${exam.lesson_ids?.join(', ')})\n   - الأسئلة: ${qCount}\n\n`;
    });
    
    alert(message);
  } catch (error) {
    alert('❌ خطأ: ' + error.message);
  }
}

function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  const colors = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  statusDiv.className = `mt-6 p-4 rounded-lg border-2 ${colors[type]}`;
  statusDiv.textContent = message;
  statusDiv.classList.remove('hidden');
  
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.opacity = '0';
      setTimeout(() => {
        statusDiv.classList.add('hidden');
        statusDiv.style.opacity = '1';
      }, 300);
    }, 5000);
  }
}

if (deepseekApiKey) {
  document.getElementById('deepseek-api-key').placeholder = '✓ المفتاح محفوظ';
}

document.getElementById('status').style.transition = 'opacity 0.3s ease';
loadUnits();
