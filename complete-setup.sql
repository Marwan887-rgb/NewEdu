-- =====================================================
-- إعداد كامل لجدول الطلاب
-- =====================================================

-- 1. إضافة عمود chat_id إذا لم يكن موجوداً
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS chat_id TEXT;

-- 2. إضافة جميع الطلاب (سيتخطى الموجودين إذا كان mobile هو Primary Key)
INSERT INTO students (name, mobile, class) VALUES
('زياد مروان المورعي', '966566403439', '302'),
('مروان', '966545578855', '302'),
('اشواق', '966566997366', '301'),
('عدي حاتم كرعلي', '966580568189', '302'),
('ياسر ماجد الحربي', '966545294720', '302'),
('حمزه خالد الفريدي', '966568770913', '302'),
('عبدالله محمد المطيري', '966582089536', '302'),
('عمر سليمان العبدلي', '966550943475', '302'),
('ايمن ناهض الجابري', '966591317212', '302'),
('حاتم نادر الحربي', '966567225805', '302'),
('حازم بن عبدالحميد بن الجابري', '966554928584', '302'),
('عبدالرحيم معيض الحسيني', '966533790093', '302'),
('عبدالعزيز محمد السحيمي', '966530661060', '302'),
('عبدالله بن عيسى بن العوفي', '966550540154', '302'),
('محمد لافي الحربي', '966593434286', '302'),
('مصعب حسن', '966509619686', '302'),
('هاشم عبدالصمد الجابري', '966595811476', '302'),
('وليد عصام النفيعي', '966560567029', '302'),
('يزن زهير كمل', '966547787536', '302'),
('يزيد فهد المطيري', '966554724746', '302'),
('عبدالله عبيدالله الحربي', '966560456534', '302'),
('اسامة', '966561459322', '302'),
('عماد عائض الحربي', '966557311820', '302'),
('ياسر رابح الحربي', '966552293823', '302'),
('عمار عادل الحربي', '966541149047', '302'),
('حسام فهد الحربي', '966557539744', '301'),
('عامر عبدالرحمن العمري', '966557369209', '301'),
('عبدالله مشعل الحربي', '966539465084', '301'),
('معتز عبدالحميد الحربي', '966501089805', '301'),
('عصام محمود الضاني', '966508259941', '301'),
('سلطان تحسين محمد', '966542759414', '301'),
('عناد عامر الجابري', '966569786714', '301'),
('مهند حسان المصعبي', '966578017401', '301'),
('باسل عواض المطيري', '966559059606', '301'),
('مؤيد عبدالله شقرون', '966546594418', '301'),
('وليد فايز الصيعري', '966510096530', '301'),
('عبدالملك ماجد اللهيبي', '966538956068', '301'),
('عبدالله ممدوح البلوي', '966553573073', '301'),
('عبدالرحمن البلوي', '966550753772', '301'),
('علي عبدالفتاح الحسيني', '966563155356', '301'),
('يزن تركي البلادي', '966538842856', '301')
ON CONFLICT (mobile) DO NOTHING;

-- 3. تحديث chat_id لجميع الطلاب
UPDATE students SET chat_id = '2139820763' WHERE mobile = '966566403439';
UPDATE students SET chat_id = '759260546' WHERE mobile = '966566997366';
UPDATE students SET chat_id = '6075063788' WHERE mobile = '966599502562';
UPDATE students SET chat_id = '5604802409' WHERE mobile = '966559059606';
UPDATE students SET chat_id = '1753052980' WHERE mobile = '966567225805';
UPDATE students SET chat_id = '1677979983' WHERE mobile = '966554928584';
UPDATE students SET chat_id = '5109287601' WHERE mobile = '966560567029';
UPDATE students SET chat_id = '7119758686' WHERE mobile = '966593434286';
UPDATE students SET chat_id = '1933024299' WHERE mobile = '966561459322';
UPDATE students SET chat_id = '5861430849' WHERE mobile = '966552293823';
UPDATE students SET chat_id = '5992990975' WHERE mobile = '966560456534';
UPDATE students SET chat_id = '1425123428' WHERE mobile = '966568770913';
UPDATE students SET chat_id = '1961479064' WHERE mobile = '966582089536';
UPDATE students SET chat_id = '818146509' WHERE mobile = '966545294720';
UPDATE students SET chat_id = '6398668631' WHERE mobile = '966557311820';
UPDATE students SET chat_id = '7176088223' WHERE mobile = '966550943475';
UPDATE students SET chat_id = '7140601555' WHERE mobile = '966595811476';
UPDATE students SET chat_id = '6022506706' WHERE mobile = '966539465084';
UPDATE students SET chat_id = '7694623882' WHERE mobile = '966553573073';
UPDATE students SET chat_id = '2008825646' WHERE mobile = '966546594418';
UPDATE students SET chat_id = '8104049714' WHERE mobile = '966503829744';
UPDATE students SET chat_id = '6861223204' WHERE mobile = '966510096530';
UPDATE students SET chat_id = '6907011727' WHERE mobile = '966578017401';
UPDATE students SET chat_id = '1373652703' WHERE mobile = '966542759414';
UPDATE students SET chat_id = '1876085396' WHERE mobile = '966557539744';
UPDATE students SET chat_id = '1533321379' WHERE mobile = '966557369209';
UPDATE students SET chat_id = '7631597726' WHERE mobile = '966541149047';
UPDATE students SET chat_id = '5462122904' WHERE mobile = '966591317212';
UPDATE students SET chat_id = '6565188331' WHERE mobile = '966538956068';
UPDATE students SET chat_id = '5615590742' WHERE mobile = '966580568189';
UPDATE students SET chat_id = '6407502380' WHERE mobile = '966501089805';
UPDATE students SET chat_id = '1879612050' WHERE mobile = '966538842856';
UPDATE students SET chat_id = '6931167496' WHERE mobile = '966569786714';
UPDATE students SET chat_id = '660483058' WHERE mobile = '966545578855';

-- 4. التحقق من النتائج
SELECT 
    name AS "الاسم",
    mobile AS "رقم الجوال",
    class AS "الصف",
    chat_id AS "Chat ID",
    CASE 
        WHEN chat_id IS NOT NULL THEN '✓ مربوط'
        ELSE '✗ غير مربوط'
    END AS "الحالة"
FROM students
ORDER BY class, name;

-- 5. إحصائيات
SELECT 
    '301' AS "الصف",
    COUNT(*) AS "عدد الطلاب",
    COUNT(chat_id) AS "مربوط بتليجرام",
    COUNT(*) - COUNT(chat_id) AS "غير مربوط"
FROM students 
WHERE class = '301'
UNION ALL
SELECT 
    '302' AS "الصف",
    COUNT(*) AS "عدد الطلاب",
    COUNT(chat_id) AS "مربوط بتليجرام",
    COUNT(*) - COUNT(chat_id) AS "غير مربوط"
FROM students 
WHERE class = '302';
