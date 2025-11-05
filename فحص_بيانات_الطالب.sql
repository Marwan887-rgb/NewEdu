-- فحص بيانات الطالب: 966545578855
-- ═══════════════════════════════════════════════════════

-- 1️⃣ عرض جميع المهام الأدائية للطالب
SELECT 
    id,
    lesson_id,
    lesson_title,
    task,
    status,
    created_at
FROM progress
WHERE student_mobile = '966545578855'
ORDER BY created_at DESC;

-- 2️⃣ عدد السجلات الكلي
SELECT COUNT(*) as total_records
FROM progress
WHERE student_mobile = '966545578855';

-- 3️⃣ عدد المهام الفريدة (lesson_id + task)
SELECT COUNT(DISTINCT (lesson_id || '_' || task)) as unique_tasks
FROM progress
WHERE student_mobile = '966545578855';

-- 4️⃣ تفاصيل المهام الفريدة
SELECT 
    lesson_id,
    task,
    COUNT(*) as count,
    STRING_AGG(id, ', ') as record_ids
FROM progress
WHERE student_mobile = '966545578855'
GROUP BY lesson_id, task
ORDER BY lesson_id, task;

-- 5️⃣ المهام المكررة (نفس الدرس + نفس المهمة أكثر من مرة)
SELECT 
    lesson_id,
    lesson_title,
    task,
    COUNT(*) as repetitions,
    STRING_AGG(id, ', ') as duplicate_ids
FROM progress
WHERE student_mobile = '966545578855'
GROUP BY lesson_id, lesson_title, task
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- 6️⃣ أنواع المهام المختلفة
SELECT 
    task,
    COUNT(*) as count
FROM progress
WHERE student_mobile = '966545578855'
GROUP BY task
ORDER BY count DESC;

-- 7️⃣ الدروس المختلفة
SELECT 
    lesson_id,
    lesson_title,
    COUNT(*) as tasks_count
FROM progress
WHERE student_mobile = '966545578855'
GROUP BY lesson_id, lesson_title
ORDER BY lesson_id;

-- 8️⃣ الأنشطة
SELECT 
    id,
    grade,
    created_at
FROM activities
WHERE mobile = '966545578855'
ORDER BY created_at DESC;

-- 9️⃣ المشاريع
SELECT 
    id,
    grade,
    created_at
FROM project_submissions
WHERE student_mobile = '966545578855'
ORDER BY created_at DESC;

-- 🔟 اختبارات الوحدة
SELECT 
    id,
    score,
    created_at
FROM unit_exam_submissions
WHERE student_mobile = '966545578855'
ORDER BY created_at DESC;

-- ═══════════════════════════════════════════════════════
-- ملخص الحساب المتوقع:
-- ═══════════════════════════════════════════════════════

-- الحساب النهائي
WITH student_data AS (
    -- المهام الأدائية
    SELECT 
        COUNT(DISTINCT (lesson_id || '_' || task)) as unique_performance_tasks,
        ROUND(COUNT(DISTINCT (lesson_id || '_' || task)) * (20.0 / 45.0)) as performance_score
    FROM progress
    WHERE student_mobile = '966545578855'
),
activities_data AS (
    -- الأنشطة
    SELECT 
        COUNT(*) as activities_count,
        LEAST(ROUND(COALESCE(SUM(grade), 0)), 5) as activities_score
    FROM activities
    WHERE mobile = '966545578855'
),
projects_data AS (
    -- المشاريع
    SELECT 
        COUNT(*) as projects_count,
        LEAST(ROUND(COALESCE(SUM(grade), 0)), 5) as projects_score
    FROM project_submissions
    WHERE student_mobile = '966545578855'
),
exams_data AS (
    -- الاختبارات
    SELECT 
        COUNT(*) as exams_count,
        LEAST(ROUND(COALESCE(SUM(score), 0)), 10) as exams_score
    FROM unit_exam_submissions
    WHERE student_mobile = '966545578855'
)
SELECT 
    -- المهام الأدائية
    s.unique_performance_tasks as 'مهام فريدة (من 45)',
    s.performance_score as 'درجة المهام (من 20)',
    
    -- الأنشطة
    a.activities_count as 'عدد الأنشطة (من 3)',
    a.activities_score as 'درجة الأنشطة (من 5)',
    
    -- المشاريع
    p.projects_count as 'عدد المشاريع (من 3)',
    p.projects_score as 'درجة المشاريع (من 5)',
    
    -- الاختبارات
    e.exams_count as 'عدد الاختبارات (من 3)',
    e.exams_score as 'درجة الاختبارات (من 10)',
    
    -- الإجمالي
    (s.performance_score + a.activities_score + p.projects_score + e.exams_score) as 'الدرجة الإجمالية (من 40)',
    ROUND(((s.performance_score + a.activities_score + p.projects_score + e.exams_score) / 40.0) * 100) as 'نسبة الإنجاز %'
FROM student_data s, activities_data a, projects_data p, exams_data e;
