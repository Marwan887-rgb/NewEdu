// ============================================================
// نظام اختبارات الوحدة - كود كامل ونظيف
// ============================================================
// التاريخ: 28 أكتوبر 2025
// للإضافة في index.html
// ============================================================

// تحميل اختبار الوحدة
async function loadUnitExam(lesson) {
  const content = document.getElementById('lesson-content');
  content.innerHTML = '<div class="flex justify-center py-16"><div class="loader"></div></div>';

  try {
    console.log('Loading unit exam for lesson:', lesson.id);
    
    // جلب اختبار الوحدة بناءً على lesson_id (50, 51, 52)
    const { data: unitExam, error: examError } = await supabase
      .from('unit_exams')
      .select('*')
      .eq('lesson_id', lesson.id)
      .single();

    console.log('Unit exam result:', { unitExam, examError });

    if (examError) {
      console.error('Error loading unit exam:', examError);
      content.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">❌</div>
          <p class="text-red-500 text-lg mb-2">خطأ في تحميل الاختبار</p>
          <p class="text-sm text-gray-600">${examError.message}</p>
          <p class="text-xs text-gray-500 mt-2">الرجاء التأكد من إنشاء الاختبار في صفحة "إدارة الوحدة"</p>
        </div>
      `;
      return;
    }

    if (!unitExam || !unitExam.questions || unitExam.questions.length === 0) {
      content.innerHTML = `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-gray-500 text-lg">لا يوجد اختبار لهذه الوحدة بعد</p>
          <p class="text-sm text-gray-400 mt-2">الرجاء إنشائه من صفحة "إدارة الوحدة الشاملة"</p>
        </div>
      `;
      return;
    }

    // التحقق من وجود تسليم سابق
    const { data: submission, error: fetchError } = await supabase
      .from('unit_exam_submissions')
      .select('*')
      .eq('student_mobile', currentStudent.mobile)
      .eq('lesson_id', lesson.id)
      .maybeSingle();

    if (submission) {
      // عرض النتيجة
      displayUnitExamResult(lesson, unitExam, submission);
    } else {
      // عرض الاختبار
      displayUnitExamForm(lesson, unitExam);
    }

  } catch (error) {
    console.error('Error:', error);
    content.innerHTML = `
      <div class="text-center py-16">
        <p class="text-red-500">❌ حدث خطأ</p>
      </div>
    `;
  }
}

// عرض نموذج الاختبار
function displayUnitExamForm(lesson, unitExam) {
  const content = document.getElementById('lesson-content');
  const questions = unitExam.questions;

  let questionsHtml = '';
  
  // التحقق من نوع البنية
  const isNewFormat = questions.length > 0 && questions[0].hasOwnProperty('question') && questions[0].hasOwnProperty('answer');

  questions.forEach((q, index) => {
    // صح/خطأ
    if (q.type === 'true_false') {
      questionsHtml += `
        <div class="bg-white border-2 border-blue-200 rounded-xl p-6 mb-4 hover:shadow-lg transition">
          <div class="flex items-start gap-3 mb-4">
            <span class="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              ${index + 1}
            </span>
            <p class="text-lg font-semibold text-gray-800 flex-1">${sanitize(q.question)}</p>
          </div>
          <div class="mr-13 flex gap-6">
            <label class="flex items-center gap-3 cursor-pointer bg-green-50 hover:bg-green-100 px-6 py-3 rounded-lg border-2 border-green-200 hover:border-green-400 transition flex-1">
              <input type="radio" name="q_${index}" value="true" class="w-5 h-5 text-green-600" required>
              <span class="text-green-700 font-bold text-lg">✓ صح</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer bg-red-50 hover:bg-red-100 px-6 py-3 rounded-lg border-2 border-red-200 hover:border-red-400 transition flex-1">
              <input type="radio" name="q_${index}" value="false" class="w-5 h-5 text-red-600" required>
              <span class="text-red-700 font-bold text-lg">✗ خطأ</span>
            </label>
          </div>
        </div>
      `;
    } 
    // اختيار متعدد
    else if (q.type === 'multiple_choice') {
      questionsHtml += `
        <div class="bg-white border-2 border-purple-200 rounded-xl p-6 mb-4 hover:shadow-lg transition">
          <div class="flex items-start gap-3 mb-4">
            <span class="flex-shrink-0 w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              ${index + 1}
            </span>
            <p class="text-lg font-semibold text-gray-800 flex-1">${sanitize(q.question)}</p>
          </div>
          <div class="mr-13 space-y-3">
            ${q.options.map((opt, optIndex) => `
              <label class="flex items-center gap-3 p-3 rounded-lg border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition">
                <input type="radio" name="q_${index}" value="${optIndex}" class="w-5 h-5 text-purple-600" required>
                <span class="text-gray-700 flex-1"><strong>${['أ', 'ب', 'ج', 'د'][optIndex]}.</strong> ${sanitize(opt)}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    } 
    // أسئلة متنوعة (تعريف، ترتيب، إكمال)
    else if (q.type === 'other' || q.type === 'definition') {
      questionsHtml += `
        <div class="bg-white border-2 border-green-200 rounded-xl p-6 mb-4 hover:shadow-lg transition">
          <div class="flex items-start gap-3 mb-4">
            <span class="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
              ${index + 1}
            </span>
            <p class="text-lg font-semibold text-gray-800 flex-1">${sanitize(q.question)}</p>
          </div>
          <div class="mr-13">
            <textarea name="q_${index}" 
                      rows="4" 
                      class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 resize-none text-gray-700" 
                      placeholder="اكتب إجابتك هنا..."
                      required></textarea>
          </div>
        </div>
      `;
    }
  });

  content.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
        <h2 class="text-2xl font-bold text-indigo-900 mb-2">${sanitize(lesson.title)}</h2>
        <p class="text-indigo-700">${sanitize(lesson.unit)}</p>
        <div class="mt-4 flex items-center gap-4 text-sm">
          <span class="bg-white px-3 py-1 rounded-full text-indigo-700">📝 ${unitExam.total_questions} سؤال</span>
          <span class="bg-white px-3 py-1 rounded-full text-indigo-700">🎯 ${unitExam.total_questions} درجات</span>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <p class="text-yellow-800 font-semibold mb-2">📌 تعليمات الاختبار:</p>
        <ul class="text-yellow-700 text-sm space-y-1 mr-4">
          <li>• أجب على جميع الأسئلة</li>
          <li>• كل سؤال = 1 درجة</li>
          <li>• الاختبار يُحفظ مرة واحدة فقط</li>
          <li>• لا يمكن تعديل الإجابات بعد التسليم</li>
        </ul>
      </div>

      <!-- Questions Form -->
      <form id="unit-exam-form" onsubmit="submitUnitExam(event, ${lesson.id}, ${unitExam.total_questions || questions.length})" class="space-y-4">
        ${questionsHtml}

        <!-- Submit Button -->
        <div class="sticky bottom-4 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-xl">
          <button type="submit" 
                  class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition">
            📤 تسليم الاختبار
          </button>
        </div>
      </form>
    </div>
  `;
}

// تسليم الاختبار
async function submitUnitExam(event, lessonId, totalQuestions) {
  event.preventDefault();

  if (!confirm('⚠️ هل أنت متأكد من تسليم الاختبار?\nلا يمكنك تعديل الإجابات بعد التسليم.')) {
    return;
  }

  const form = event.target;
  const formData = new FormData(form);
  
  // جمع الإجابات
  const answers = {};
  for (let [key, value] of formData.entries()) {
    answers[key] = value;
  }

  try {
    // جلب الاختبار للحصول على الإجابات الصحيحة
    const { data: unitExam, error: examError } = await supabase
      .from('unit_exams')
      .select('*')
      .eq('lesson_id', lessonId)
      .single();

    if (examError || !unitExam) {
      throw new Error('لم يتم العثور على الاختبار');
    }

    const questions = unitExam.questions;

    // حساب الدرجة بناءً على الإجابات الصحيحة
    let correctCount = 0;

    console.log('🔍 Checking exam answers...');

    questions.forEach((q, index) => {
      const studentAnswer = answers[`q_${index}`];
      
      if (q.type === 'true_false') {
        // صح/خطأ: المقارنة مع true/false
        const correctAnswer = q.answer; // true or false
        const isCorrect = studentAnswer === String(correctAnswer);
        
        console.log(`Q${index + 1} [T/F]: Student="${studentAnswer}" | Correct="${correctAnswer}" | Match=${isCorrect}`);
        
        if (isCorrect) {
          correctCount++;
        }
      } 
      else if (q.type === 'multiple_choice') {
        // اختيار متعدد: المقارنة مع index (0,1,2,3)
        const correctAnswer = q.answer; // 0, 1, 2, or 3
        const isCorrect = parseInt(studentAnswer) === correctAnswer;
        
        console.log(`Q${index + 1} [MC]: Student="${studentAnswer}" | Correct="${correctAnswer}" | Match=${isCorrect}`);
        
        if (isCorrect) {
          correctCount++;
        }
      } 
      else if (q.type === 'other' || q.type === 'definition') {
        // أسئلة متنوعة: مقارنة نصية ذكية
        const studentLower = studentAnswer?.toLowerCase().trim() || '';
        const correctLower = q.answer?.toLowerCase().trim() || '';
        
        // إذا كانت الإجابة تحتوي على 60% من الكلمات الصحيحة
        const correctWords = correctLower.split(/\s+/).filter(w => w.length > 2);
        const matchedWords = correctWords.filter(word => studentLower.includes(word));
        
        const isCorrect = matchedWords.length >= correctWords.length * 0.6;
        
        console.log(`Q${index + 1} [Other]: Student="${studentAnswer?.substring(0, 30)}..." | Matched=${matchedWords.length}/${correctWords.length} | Match=${isCorrect}`);
        
        if (isCorrect) {
          correctCount++;
        }
      }
    });

    console.log(`✅ Total correct: ${correctCount}/${totalQuestions}`);

    // الدرجة من 20 (حسب عدد الأسئلة)
    const score = correctCount;

    // حفظ الإجابة في unit_exam_submissions
    const { error: submissionError } = await supabase
      .from('unit_exam_submissions')
      .insert({
        student_mobile: currentStudent.mobile,
        lesson_id: lessonId,
        answers: answers,
        score: score,
        total_score: totalQuestions
      });

    if (submissionError) throw submissionError;

    // تسجيل المهمة في progress (نفس طريقة النشاط)
    // حذف السجل القديم أولاً
    await supabase
      .from('progress')
      .delete()
      .eq('student_mobile', currentStudent.mobile)
      .eq('lesson_id', lessonId)
      .eq('task', 'unit_exam');
    
    // ثم إدراج سجل جديد
    const { error: progressError } = await supabase
      .from('progress')
      .insert({
        student_mobile: currentStudent.mobile,
        lesson_id: lessonId,
        task: 'unit_exam',
        completed_at: new Date().toISOString()
      });

    if (progressError) {
      console.error('❌ خطأ في حفظ progress:', progressError);
    } else {
      console.log('✅ تم حفظ progress بنجاح');
    }

    alert(`✅ تم تسليم الاختبار بنجاح!\n🎯 درجتك: ${score}/${totalQuestions}\n📊 النسبة: ${Math.round((score/totalQuestions)*100)}%`);

    // إعادة تحميل الاختبار لعرض النتيجة
    await loadUnitExam(currentLesson);

    // تحديث عداد المهمات
    await loadStudentScore();

  } catch (error) {
    console.error('Error submitting unit exam:', error);
    alert('❌ خطأ في تسليم الاختبار: ' + error.message);
  }
}

// عرض نتيجة الاختبار
function displayUnitExamResult(lesson, unitExam, submission) {
  const content = document.getElementById('lesson-content');
  const totalQuestions = submission.total_score || unitExam.total_questions || 20;
  const percentage = Math.round((submission.score / totalQuestions) * 100);
  const date = new Date(submission.submitted_at).toLocaleString('ar-SA');
  
  let gradeColor = 'text-red-600';
  let gradeBg = 'bg-red-50 border-red-300';
  let gradeIcon = '😢';
  
  if (percentage >= 90) {
    gradeColor = 'text-green-600';
    gradeBg = 'bg-green-50 border-green-300';
    gradeIcon = '🎉';
  } else if (percentage >= 75) {
    gradeColor = 'text-blue-600';
    gradeBg = 'bg-blue-50 border-blue-300';
    gradeIcon = '😊';
  } else if (percentage >= 60) {
    gradeColor = 'text-yellow-600';
    gradeBg = 'bg-yellow-50 border-yellow-300';
    gradeIcon = '🙂';
  }

  content.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
        <h2 class="text-2xl font-bold text-indigo-900 mb-2">${sanitize(lesson.title)}</h2>
        <p class="text-indigo-700">${sanitize(lesson.unit)}</p>
      </div>

      <!-- Result -->
      <div class="${gradeBg} border-2 rounded-xl p-6 text-center">
        <p class="text-6xl mb-4">${gradeIcon}</p>
        <p class="text-2xl font-bold ${gradeColor} mb-2">درجتك: ${submission.score}/${totalQuestions}</p>
        <p class="text-xl ${gradeColor}">النسبة: ${percentage}%</p>
        <p class="text-sm text-gray-600 mt-4">📅 تاريخ التسليم: ${date}</p>
      </div>

      <!-- Info -->
      <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
        <p class="text-blue-800 text-sm">
          ℹ️ تم احتساب الاختبار في درجتك الإجمالية
        </p>
      </div>
    </div>
  `;
}

// Helper function
function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
