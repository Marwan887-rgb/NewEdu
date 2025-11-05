// ════════════════════════════════════════════════════════════
// ملف التكوين - DeepSeek API Configuration
// ════════════════════════════════════════════════════════════
// يقرأ المفاتيح من ملف .env أو يستخدم القيم المحددة مباشرة
// ════════════════════════════════════════════════════════════

const DEEPSEEK_CONFIG = {
  // ⚠️ لا تضع المفتاح هنا! استخدم localStorage بدلاً من ذلك
  // المفتاح يجب إدخاله من واجهة المعلم ويُحفظ محلياً
  API_KEY: localStorage.getItem('deepseek_api_key') || '',
  
  // الإعدادات
  API_URL: 'https://api.deepseek.com/v1/chat/completions',
  MODEL: 'deepseek-chat',
  
  // معلمات الطلب
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000
};

// تصدير للاستخدام في الصفحات الأخرى
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DEEPSEEK_CONFIG;
}
