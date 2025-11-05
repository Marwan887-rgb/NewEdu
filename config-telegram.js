// ════════════════════════════════════════════════════════════
// إعدادات بوت التلجرام - Telegram Bot Configuration
// ════════════════════════════════════════════════════════════
// ⚠️ مهم: لا ترفع هذا الملف على GitHub
// أضف هذا الملف إلى .gitignore
// ════════════════════════════════════════════════════════════

const TELEGRAM_CONFIG = {
  // ضع توكن البوت الجديد هنا
  BOT_TOKEN: localStorage.getItem('telegram_bot_token') || '',
  
  // رسائل النظام
  MESSAGES: {
    OTP_TEMPLATE: (studentName, code) => `🔐 مرحباً ${studentName}!\n\nرمز التحقق الخاص بك:\n\n${code}\n\n⏰ صالح لمدة 10 دقائق\n\n⚠️ لا تشارك هذا الرمز مع أي شخص`,
    
    WELCOME: (studentName) => `مرحباً ${studentName}! 👋\n\nأهلاً بك في منصة EduActive التعليمية`,
    
    HOMEWORK_SUBMITTED: (lessonTitle) => `✅ تم استلام واجب: ${lessonTitle}\n\nسيتم مراجعته قريباً`,
    
    GRADE_NOTIFICATION: (lessonTitle, grade, maxGrade) => `📊 تم تقييم واجبك!\n\nالدرس: ${lessonTitle}\nالدرجة: ${grade}/${maxGrade}`
  }
};

// دالة للتحقق من وجود التوكن
function hasTelegramToken() {
  return TELEGRAM_CONFIG.BOT_TOKEN && TELEGRAM_CONFIG.BOT_TOKEN !== '';
}

// دالة لحفظ التوكن في localStorage
function setTelegramToken(token) {
  if (!token || token.trim() === '') {
    console.error('❌ التوكن فارغ!');
    return false;
  }
  
  localStorage.setItem('telegram_bot_token', token.trim());
  TELEGRAM_CONFIG.BOT_TOKEN = token.trim();
  console.log('✅ تم حفظ توكن التلجرام');
  return true;
}

// دالة للحصول على التوكن
function getTelegramToken() {
  return TELEGRAM_CONFIG.BOT_TOKEN;
}

// دالة لحذف التوكن
function clearTelegramToken() {
  localStorage.removeItem('telegram_bot_token');
  TELEGRAM_CONFIG.BOT_TOKEN = '';
  console.log('✅ تم حذف توكن التلجرام');
}

// دالة لإرسال رسالة عبر التلجرام
async function sendTelegramMessage(chatId, message, botToken = null) {
  const token = botToken || getTelegramToken();
  
  if (!token) {
    throw new Error('لم يتم تعيين توكن التلجرام. استخدم setTelegramToken() أولاً.');
  }
  
  try {
    const apiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.description || 'فشل إرسال الرسالة');
    }
    
    return data;
  } catch (error) {
    console.error('❌ خطأ في إرسال رسالة التلجرام:', error);
    throw error;
  }
}

// دالة لإرسال OTP
async function sendTelegramOTP(chatId, code, studentName) {
  const message = TELEGRAM_CONFIG.MESSAGES.OTP_TEMPLATE(studentName, code);
  return await sendTelegramMessage(chatId, message);
}

// دالة للتحقق من صحة التوكن
async function validateTelegramToken(token = null) {
  const tokenToTest = token || getTelegramToken();
  
  if (!tokenToTest) {
    return { valid: false, error: 'التوكن فارغ' };
  }
  
  try {
    const apiUrl = `https://api.telegram.org/bot${tokenToTest}/getMe`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.ok) {
      return { 
        valid: true, 
        botInfo: data.result,
        message: `✅ البوت نشط: ${data.result.first_name} (@${data.result.username})`
      };
    } else {
      return { 
        valid: false, 
        error: data.description || 'التوكن غير صحيح'
      };
    }
  } catch (error) {
    return { 
      valid: false, 
      error: error.message 
    };
  }
}

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TELEGRAM_CONFIG,
    hasTelegramToken,
    setTelegramToken,
    getTelegramToken,
    clearTelegramToken,
    sendTelegramMessage,
    sendTelegramOTP,
    validateTelegramToken
  };
}

// عرض معلومات عند التحميل
if (typeof console !== 'undefined') {
  if (hasTelegramToken()) {
    console.log('✅ تم تحميل إعدادات التلجرام');
  } else {
    console.warn('⚠️ لم يتم تعيين توكن التلجرام. استخدم setTelegramToken("YOUR_TOKEN") في Console');
  }
}
