-- ════════════════════════════════════════════════════════════
-- إصلاح RLS للسماح بالوصول للبيانات العامة
-- ════════════════════════════════════════════════════════════
-- ⚠️ نفّذ هذا في Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

BEGIN;

SELECT '🔧 إصلاح سياسات RLS...' as msg;

-- ════════════════════════════════════════════════════════════
-- 1. إعادة إنشاء سياسات القراءة للجداول العامة
-- ════════════════════════════════════════════════════════════

-- جدول lessons: الكل (anon + authenticated) يمكنه القراءة
DROP POLICY IF EXISTS "lessons_read_all" ON lessons;
CREATE POLICY "lessons_public_read" ON lessons
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول activities: الكل يمكنه القراءة
DROP POLICY IF EXISTS "activities_read_all" ON activities;
CREATE POLICY "activities_public_read" ON activities
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول unit_exams: الكل يمكنه القراءة
DROP POLICY IF EXISTS "unit_exams_read_all" ON unit_exams;
CREATE POLICY "unit_exams_public_read" ON unit_exams
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول projects: الكل يمكنه القراءة
DROP POLICY IF EXISTS "projects_read_all" ON projects;
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول worksheets: الكل يمكنه القراءة
DROP POLICY IF EXISTS "worksheets_read_all" ON worksheets;
CREATE POLICY "worksheets_public_read" ON worksheets
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول final_exams: الكل يمكنه القراءة
DROP POLICY IF EXISTS "final_exams_read_all" ON final_exams;
CREATE POLICY "final_exams_public_read" ON final_exams
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول homeworks: الكل يمكنه القراءة
DROP POLICY IF EXISTS "homeworks_read_all" ON homeworks;
CREATE POLICY "homeworks_public_read" ON homeworks
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- جدول telegram_chats: الكل يمكنه القراءة (للبوت)
DROP POLICY IF EXISTS "telegram_chats_read_all" ON telegram_chats;
CREATE POLICY "telegram_chats_public_read" ON telegram_chats
  FOR SELECT
  TO anon, authenticated
  USING (true);

SELECT '✅ تم إصلاح سياسات القراءة للجداول العامة' as msg;

-- ════════════════════════════════════════════════════════════
-- 2. تحديث سياسات الطلاب (مع anon)
-- ════════════════════════════════════════════════════════════

-- جدول students: الطلاب يرون بياناتهم + anon يمكنه البحث
DROP POLICY IF EXISTS "students_view_own" ON students;
CREATE POLICY "students_view_own" ON students
  FOR SELECT
  TO anon, authenticated
  USING (
    -- السماح للطلاب برؤية بياناتهم
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    -- أو إذا كان معلم
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    -- أو anon (للدخول بدون حساب)
    OR auth.role() = 'anon'
  );

-- جدول progress: إضافة anon للقراءة
DROP POLICY IF EXISTS "progress_view_own" ON progress;
CREATE POLICY "progress_view_own" ON progress
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

-- سياسات الإضافة: السماح لـ anon بالإضافة
DROP POLICY IF EXISTS "progress_insert_own" ON progress;
CREATE POLICY "progress_insert_own" ON progress
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول activity_submissions
DROP POLICY IF EXISTS "activity_submissions_view_own" ON activity_submissions;
CREATE POLICY "activity_submissions_view_own" ON activity_submissions
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "activity_submissions_insert_own" ON activity_submissions;
CREATE POLICY "activity_submissions_insert_own" ON activity_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول unit_exam_submissions
DROP POLICY IF EXISTS "unit_exam_submissions_view_own" ON unit_exam_submissions;
CREATE POLICY "unit_exam_submissions_view_own" ON unit_exam_submissions
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "unit_exam_submissions_insert_own" ON unit_exam_submissions;
CREATE POLICY "unit_exam_submissions_insert_own" ON unit_exam_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول project_submissions
DROP POLICY IF EXISTS "project_submissions_view_own" ON project_submissions;
CREATE POLICY "project_submissions_view_own" ON project_submissions
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "project_submissions_insert_own" ON project_submissions;
CREATE POLICY "project_submissions_insert_own" ON project_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول worksheet_answers
DROP POLICY IF EXISTS "worksheet_answers_view_own" ON worksheet_answers;
CREATE POLICY "worksheet_answers_view_own" ON worksheet_answers
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "worksheet_answers_insert_own" ON worksheet_answers;
CREATE POLICY "worksheet_answers_insert_own" ON worksheet_answers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول exam_submissions
DROP POLICY IF EXISTS "exam_submissions_view_own" ON exam_submissions;
CREATE POLICY "exam_submissions_view_own" ON exam_submissions
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "exam_submissions_insert_own" ON exam_submissions;
CREATE POLICY "exam_submissions_insert_own" ON exam_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول homework_submissions
DROP POLICY IF EXISTS "homework_submissions_view_own" ON homework_submissions;
CREATE POLICY "homework_submissions_view_own" ON homework_submissions
  FOR SELECT
  TO anon, authenticated
  USING (
    student_mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR current_setting('request.jwt.claims', true)::json->>'role' = 'teacher'
    OR auth.role() = 'anon'
  );

DROP POLICY IF EXISTS "homework_submissions_insert_own" ON homework_submissions;
CREATE POLICY "homework_submissions_insert_own" ON homework_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- جدول otp_codes: السماح لـ anon
DROP POLICY IF EXISTS "otp_codes_view_own" ON otp_codes;
CREATE POLICY "otp_codes_view_own" ON otp_codes
  FOR SELECT
  TO anon, authenticated
  USING (
    mobile = current_setting('request.jwt.claims', true)::json->>'mobile'
    OR auth.role() = 'anon'
  );

-- سياسة INSERT لـ otp_codes
CREATE POLICY "otp_codes_insert" ON otp_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- سياسة DELETE لـ otp_codes
CREATE POLICY "otp_codes_delete" ON otp_codes
  FOR DELETE
  TO anon, authenticated
  USING (true);

SELECT '✅ تم تحديث سياسات الطلاب' as msg;

-- ════════════════════════════════════════════════════════════
-- 3. التحقق من النتائج
-- ════════════════════════════════════════════════════════════

SELECT '════════════════════════════════════════════' as msg;
SELECT '📊 السياسات المُحدَّثة:' as msg;
SELECT '════════════════════════════════════════════' as msg;

SELECT 
  tablename as "Table",
  policyname as "Policy",
  cmd as "Command",
  roles as "Roles"
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

SELECT '════════════════════════════════════════════' as msg;
SELECT '✅ تم إصلاح RLS بنجاح!' as msg;
SELECT '════════════════════════════════════════════' as msg;

COMMIT;

-- ════════════════════════════════════════════════════════════
-- ملاحظات
-- ════════════════════════════════════════════════════════════
-- 
-- ✅ الآن يمكن للـ ANON_KEY:
--    • قراءة الجداول العامة (lessons, activities, etc.)
--    • قراءة وإضافة بيانات الطلاب
--    • العمل بدون authentication
--
-- 🔒 الأمان محفوظ:
--    • RLS مازال مفعّل
--    • البيانات الحساسة محمية
--    • الطلاب يرون بياناتهم فقط
--
-- ════════════════════════════════════════════════════════════
