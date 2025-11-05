-- ════════════════════════════════════════════════════════════
-- تفعيل Row Level Security (RLS) - أمان قاعدة البيانات
-- ════════════════════════════════════════════════════════════
-- ⚠️ هام: نفّذ هذا الملف في Supabase SQL Editor
-- الهدف: حماية البيانات من الوصول غير المصرح به
-- ════════════════════════════════════════════════════════════

BEGIN;

SELECT '════════════════════════════════════════════' as msg;
SELECT '🔐 تفعيل Row Level Security...' as msg;
SELECT '════════════════════════════════════════════' as msg;

-- ════════════════════════════════════════════════════════════
-- 1. تفعيل RLS على جميع الجداول
-- ════════════════════════════════════════════════════════════

ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheet_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homeworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_chats ENABLE ROW LEVEL SECURITY;
SELECT '✅ تم تفعيل RLS على جميع الجداول' as msg;

-- ════════════════════════════════════════════════════════════
-- 2. سياسات القراءة (SELECT)
-- ════════════════════════════════════════════════════════════

-- جدول students: الطلاب يرون بياناتهم فقط
CREATE POLICY "students_view_own" ON students
  FOR SELECT
  USING (
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول lessons: الكل يمكنه القراءة
CREATE POLICY "lessons_read_all" ON lessons
  FOR SELECT
  USING (true);

-- جدول progress: الطلاب يرون تقدمهم فقط
CREATE POLICY "progress_view_own" ON progress
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول activities: الكل يمكنه القراءة
CREATE POLICY "activities_read_all" ON activities
  FOR SELECT
  USING (true);

-- جدول activity_submissions: الطلاب يرون إجاباتهم فقط
CREATE POLICY "activity_submissions_view_own" ON activity_submissions
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول unit_exams: الكل يمكنه القراءة
CREATE POLICY "unit_exams_read_all" ON unit_exams
  FOR SELECT
  USING (true);

-- جدول unit_exam_submissions: الطلاب يرون إجاباتهم فقط
CREATE POLICY "unit_exam_submissions_view_own" ON unit_exam_submissions
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول projects: الكل يمكنه القراءة
CREATE POLICY "projects_read_all" ON projects
  FOR SELECT
  USING (true);

-- جدول project_submissions: الطلاب يرون مشاريعهم فقط
CREATE POLICY "project_submissions_view_own" ON project_submissions
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول worksheets: الكل يمكنه القراءة
CREATE POLICY "worksheets_read_all" ON worksheets
  FOR SELECT
  USING (true);

-- جدول worksheet_answers: الطلاب يرون إجاباتهم فقط
CREATE POLICY "worksheet_answers_view_own" ON worksheet_answers
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول final_exams: الكل يمكنه القراءة
CREATE POLICY "final_exams_read_all" ON final_exams
  FOR SELECT
  USING (true);

-- جدول exam_submissions: الطلاب يرون إجاباتهم فقط
CREATE POLICY "exam_submissions_view_own" ON exam_submissions
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول homeworks: الكل يمكنه القراءة
CREATE POLICY "homeworks_read_all" ON homeworks
  FOR SELECT
  USING (true);

-- جدول homework_submissions: الطلاب يرون واجباتهم فقط
CREATE POLICY "homework_submissions_view_own" ON homework_submissions
  FOR SELECT
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
  );

-- جدول otp_codes: الطلاب يرون رموزهم فقط
CREATE POLICY "otp_codes_view_own" ON otp_codes
  FOR SELECT
  USING (
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

-- جدول telegram_chats: الكل يمكنه القراءة (للبوت)
CREATE POLICY "telegram_chats_read_all" ON telegram_chats
  FOR SELECT
  USING (true);

SELECT '✅ تم إنشاء سياسات القراءة' as msg;

-- ════════════════════════════════════════════════════════════
-- 3. سياسات الإضافة (INSERT)
-- ════════════════════════════════════════════════════════════

-- الطلاب يمكنهم إضافة إجاباتهم فقط
CREATE POLICY "progress_insert_own" ON progress
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

CREATE POLICY "activity_submissions_insert_own" ON activity_submissions
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

CREATE POLICY "unit_exam_submissions_insert_own" ON unit_exam_submissions
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

CREATE POLICY "project_submissions_insert_own" ON project_submissions
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

CREATE POLICY "worksheet_answers_insert_own" ON worksheet_answers
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

CREATE POLICY "exam_submissions_insert_own" ON exam_submissions
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

CREATE POLICY "homework_submissions_insert_own" ON homework_submissions
  FOR INSERT
  WITH CHECK (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

SELECT '✅ تم إنشاء سياسات الإضافة' as msg;

-- ════════════════════════════════════════════════════════════
-- 4. سياسات التحديث (UPDATE)
-- ════════════════════════════════════════════════════════════

-- الطلاب يمكنهم تحديث بياناتهم الأساسية فقط
CREATE POLICY "students_update_own" ON students
  FOR UPDATE
  USING (
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  )
  WITH CHECK (
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
  );

SELECT '✅ تم إنشاء سياسات التحديث' as msg;

-- ════════════════════════════════════════════════════════════
-- 5. سياسات الحذف (DELETE)
-- ════════════════════════════════════════════════════════════

-- لا يمكن للطلاب حذف أي شيء (الحذف للمعلم فقط)
-- المعلم يستخدم Service Role Key الذي يتجاوز RLS

SELECT '✅ سياسات الحذف: المعلم فقط' as msg;

-- ════════════════════════════════════════════════════════════
-- 6. التحقق من النتائج
-- ════════════════════════════════════════════════════════════

SELECT '════════════════════════════════════════════' as msg;
SELECT '📊 ملخص السياسات:' as msg;
SELECT '════════════════════════════════════════════' as msg;

SELECT 
  schemaname as "Schema",
  tablename as "Table",
  policyname as "Policy",
  cmd as "Command"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT '════════════════════════════════════════════' as msg;
SELECT '✅ تم تفعيل Row Level Security بنجاح!' as msg;
SELECT '════════════════════════════════════════════' as msg;

COMMIT;

-- ════════════════════════════════════════════════════════════
-- ملاحظات مهمة
-- ════════════════════════════════════════════════════════════
-- 
-- 1. هذه السياسات تفترض استخدام Supabase Auth
--    إذا كنت تستخدم نظام مخصص، عدّل الشروط
--
-- 2. المعلم يجب استخدام Service Role Key من backend
--    لا تستخدم Service Role Key في frontend!
--
-- 3. للطلاب: يجب تمرير JWT token مع كل طلب
--    يحتوي على: mobile و role
--
-- 4. لاختبار السياسات:
--    - سجل دخول كطالب
--    - حاول قراءة بيانات طالب آخر
--    - يجب أن ترى خطأ أو صفحة فارغة
--
-- 5. إذا واجهت مشاكل، يمكنك تعطيل RLS مؤقتاً:
--    ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
--
-- ════════════════════════════════════════════════════════════
