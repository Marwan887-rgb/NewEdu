-- =====================================================
-- إنشاء جدول OTP للتحقق من رموز الدخول
-- =====================================================

-- حذف الجدول القديم إذا كان موجوداً (اختياري)
-- DROP TABLE IF EXISTS otp_codes;

-- إنشاء الجدول
CREATE TABLE IF NOT EXISTS otp_codes (
  mobile TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- إضافة index للبحث السريع
CREATE INDEX IF NOT EXISTS idx_otp_mobile ON otp_codes(mobile);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_codes(expires_at);

-- تنظيف الرموز المنتهية (اختياري - يمكن تشغيله يدوياً)
-- DELETE FROM otp_codes WHERE expires_at < NOW();

-- عرض الجدول للتأكد
SELECT * FROM otp_codes ORDER BY created_at DESC LIMIT 10;
