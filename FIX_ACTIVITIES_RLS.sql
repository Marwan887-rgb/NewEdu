-- ════════════════════════════════════════════════════════════
-- إصلاح سياسات RLS للجداول: activities, reviews, projects, unit_exams
-- ════════════════════════════════════════════════════════════
-- ⚠️ نفّذ هذا في Supabase SQL Editor
-- ════════════════════════════════════════════════════════════

BEGIN;

SELECT '🔧 إضافة سياسات INSERT/UPDATE للجداول...' as msg;

-- ════════════════════════════════════════════════════════════
-- 1. جدول activities
-- ════════════════════════════════════════════════════════════

-- سياسة INSERT للأنشطة
DROP POLICY IF EXISTS "activities_insert_all" ON activities;
CREATE POLICY "activities_insert_all" ON activities
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- سياسة UPDATE للأنشطة
DROP POLICY IF EXISTS "activities_update_all" ON activities;
CREATE POLICY "activities_update_all" ON activities
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

SELECT '✅ تم إضافة سياسات INSERT/UPDATE لجدول activities' as msg;

-- ════════════════════════════════════════════════════════════
-- 2. جدول reviews (إذا كان موجوداً)
-- ════════════════════════════════════════════════════════════

-- التحقق من وجود الجدول أولاً
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews') THEN
    -- سياسة INSERT للمراجعات
    DROP POLICY IF EXISTS "reviews_insert_all" ON reviews;
    CREATE POLICY "reviews_insert_all" ON reviews
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);

    -- سياسة UPDATE للمراجعات
    DROP POLICY IF EXISTS "reviews_update_all" ON reviews;
    CREATE POLICY "reviews_update_all" ON reviews
      FOR UPDATE
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
    
    RAISE NOTICE '✅ تم إضافة سياسات INSERT/UPDATE لجدول reviews';
  ELSE
    RAISE NOTICE '⚠️ جدول reviews غير موجود - تم تخطيه';
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════
-- 3. جدول projects
-- ════════════════════════════════════════════════════════════

-- سياسة INSERT للمشاريع
DROP POLICY IF EXISTS "projects_insert_all" ON projects;
CREATE POLICY "projects_insert_all" ON projects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- سياسة UPDATE للمشاريع
DROP POLICY IF EXISTS "projects_update_all" ON projects;
CREATE POLICY "projects_update_all" ON projects
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

SELECT '✅ تم إضافة سياسات INSERT/UPDATE لجدول projects' as msg;

-- ════════════════════════════════════════════════════════════
-- 4. جدول unit_exams
-- ════════════════════════════════════════════════════════════

-- سياسة INSERT لاختبارات الوحدة
DROP POLICY IF EXISTS "unit_exams_insert_all" ON unit_exams;
CREATE POLICY "unit_exams_insert_all" ON unit_exams
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- سياسة UPDATE لاختبارات الوحدة
DROP POLICY IF EXISTS "unit_exams_update_all" ON unit_exams;
CREATE POLICY "unit_exams_update_all" ON unit_exams
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

SELECT '✅ تم إضافة سياسات INSERT/UPDATE لجدول unit_exams' as msg;

-- ════════════════════════════════════════════════════════════
-- 5. التحقق من السياسات الموجودة
-- ════════════════════════════════════════════════════════════

SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE tablename IN ('activities', 'reviews', 'projects', 'unit_exams')
ORDER BY tablename, policyname;

SELECT '✅ تم إضافة جميع السياسات بنجاح!' as msg;

COMMIT;

