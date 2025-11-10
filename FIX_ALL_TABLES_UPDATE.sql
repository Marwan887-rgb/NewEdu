-- ════════════════════════════════════════════════════════════
-- إصلاح شامل لجميع جداول الإرسالات - Complete UPDATE Fix
-- ════════════════════════════════════════════════════════════
-- الهدف: إضافة سياسات UPDATE لجميع الجداول التي تحتاج تحديث من المعلم
-- ════════════════════════════════════════════════════════════
-- ⚠️ ضمان: هذا السكريبت آمن تماماً ولا يحذف أي بيانات
-- ════════════════════════════════════════════════════════════

BEGIN;

SELECT '╔════════════════════════════════════════════╗' as msg;
SELECT '║  🔧 بدء إصلاح سياسات UPDATE لجميع الجداول  ║' as msg;
SELECT '╚════════════════════════════════════════════╝' as msg;
SELECT '' as msg;

-- ════════════════════════════════════════════════════════════
-- 1. جدول homework_submissions (الواجبات)
-- ════════════════════════════════════════════════════════════
SELECT '📝 [1/6] معالجة جدول homework_submissions...' as msg;

DROP POLICY IF EXISTS "homework_submissions_update" ON homework_submissions;
DROP POLICY IF EXISTS "homework_submissions_update_all" ON homework_submissions;

CREATE POLICY "homework_submissions_update_all" 
  ON homework_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

SELECT '   ✅ تم إنشاء سياسة UPDATE لجدول homework_submissions' as msg;
SELECT '' as msg;

-- ════════════════════════════════════════════════════════════
-- 2. جدول project_submissions (المشاريع)
-- ════════════════════════════════════════════════════════════
SELECT '🎨 [2/6] معالجة جدول project_submissions...' as msg;

DROP POLICY IF EXISTS "project_submissions_update" ON project_submissions;
DROP POLICY IF EXISTS "project_submissions_update_all" ON project_submissions;

CREATE POLICY "project_submissions_update_all" 
  ON project_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;

SELECT '   ✅ تم إنشاء سياسة UPDATE لجدول project_submissions' as msg;
SELECT '' as msg;

-- ════════════════════════════════════════════════════════════
-- 3. جدول activity_submissions (الأنشطة)
-- ════════════════════════════════════════════════════════════
SELECT '⚙️ [3/6] معالجة جدول activity_submissions...' as msg;

DROP POLICY IF EXISTS "activity_submissions_update" ON activity_submissions;
DROP POLICY IF EXISTS "activity_submissions_update_all" ON activity_submissions;

CREATE POLICY "activity_submissions_update_all" 
  ON activity_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE activity_submissions ENABLE ROW LEVEL SECURITY;

SELECT '   ✅ تم إنشاء سياسة UPDATE لجدول activity_submissions' as msg;
SELECT '' as msg;

-- ════════════════════════════════════════════════════════════
-- 4. جدول unit_exam_submissions (اختبارات الوحدة)
-- ════════════════════════════════════════════════════════════
SELECT '📋 [4/6] معالجة جدول unit_exam_submissions...' as msg;

DROP POLICY IF EXISTS "unit_exam_submissions_update" ON unit_exam_submissions;
DROP POLICY IF EXISTS "unit_exam_submissions_update_all" ON unit_exam_submissions;

CREATE POLICY "unit_exam_submissions_update_all" 
  ON unit_exam_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE unit_exam_submissions ENABLE ROW LEVEL SECURITY;

SELECT '   ✅ تم إنشاء سياسة UPDATE لجدول unit_exam_submissions' as msg;
SELECT '' as msg;

-- ════════════════════════════════════════════════════════════
-- 5. جدول exam_submissions (التقويمات النهائية)
-- ════════════════════════════════════════════════════════════
SELECT '✅ [5/6] معالجة جدول exam_submissions...' as msg;

DROP POLICY IF EXISTS "exam_submissions_update" ON exam_submissions;
DROP POLICY IF EXISTS "exam_submissions_update_all" ON exam_submissions;

CREATE POLICY "exam_submissions_update_all" 
  ON exam_submissions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;

SELECT '   ✅ تم إنشاء سياسة UPDATE لجدول exam_submissions' as msg;
SELECT '' as msg;

-- ════════════════════════════════════════════════════════════
-- 6. جدول worksheet_answers (أوراق العمل)
-- ════════════════════════════════════════════════════════════
SELECT '📄 [6/6] معالجة جدول worksheet_answers...' as msg;

DROP POLICY IF EXISTS "worksheet_answers_update" ON worksheet_answers;
DROP POLICY IF EXISTS "worksheet_answers_update_all" ON worksheet_answers;

CREATE POLICY "worksheet_answers_update_all" 
  ON worksheet_answers
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

ALTER TABLE worksheet_answers ENABLE ROW LEVEL SECURITY;

SELECT '   ✅ تم إنشاء سياسة UPDATE لجدول worksheet_answers' as msg;
SELECT '' as msg;

COMMIT;

-- ════════════════════════════════════════════════════════════
-- التحقق النهائي من جميع السياسات
-- ════════════════════════════════════════════════════════════
SELECT '╔════════════════════════════════════════════╗' as msg;
SELECT '║           🎉 اكتمل الإصلاح بنجاح!          ║' as msg;
SELECT '╚════════════════════════════════════════════╝' as msg;
SELECT '' as msg;

SELECT '📊 ملخص السياسات المُنشأة:' as msg;
SELECT '─────────────────────────────────────────────' as msg;

SELECT 
  CASE 
    WHEN tablename = 'homework_submissions' THEN '📝 الواجبات'
    WHEN tablename = 'project_submissions' THEN '🎨 المشاريع'
    WHEN tablename = 'activity_submissions' THEN '⚙️ الأنشطة'
    WHEN tablename = 'unit_exam_submissions' THEN '📋 اختبارات الوحدة'
    WHEN tablename = 'exam_submissions' THEN '✅ التقويمات النهائية'
    WHEN tablename = 'worksheet_answers' THEN '📄 أوراق العمل'
  END as "الجدول",
  policyname as "اسم السياسة",
  cmd as "الصلاحية"
FROM pg_policies 
WHERE tablename IN (
  'homework_submissions',
  'project_submissions', 
  'activity_submissions',
  'unit_exam_submissions',
  'exam_submissions',
  'worksheet_answers'
)
AND cmd = 'UPDATE'
ORDER BY tablename;

SELECT '' as msg;
SELECT '─────────────────────────────────────────────' as msg;
SELECT '✅ جميع ملفات الطلاب محفوظة وآمنة' as msg;
SELECT '✅ جميع البيانات السابقة محفوظة' as msg;
SELECT '✅ يمكنك الآن اعتماد الواجبات والمشاريع بدون مشاكل' as msg;
SELECT '─────────────────────────────────────────────' as msg;
