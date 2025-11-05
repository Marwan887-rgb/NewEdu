// ════════════════════════════════════════════════════════════
// Netlify Function: إرسال OTP عبر التلجرام
// ════════════════════════════════════════════════════════════
// هذه الدالة تعمل على سيرفر Netlify
// التوكن محفوظ بشكل آمن في Environment Variables
// ════════════════════════════════════════════════════════════

exports.handler = async (event, context) => {
  // فقط POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // قراءة البيانات من الطلب
    const { chatId, code, studentName } = JSON.parse(event.body);

    // التحقق من البيانات
    if (!chatId || !code || !studentName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['chatId', 'code', 'studentName']
        })
      };
    }

    // الحصول على التوكن من Environment Variables (آمن!)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

    if (!TELEGRAM_BOT_TOKEN) {
      console.error('❌ TELEGRAM_BOT_TOKEN not configured in Netlify');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Bot token not configured'
        })
      };
    }

    // إنشاء رسالة OTP
    const message = `🔐 مرحباً ${studentName}!\n\nرمز التحقق الخاص بك:\n\n${code}\n\n⏰ صالح لمدة 10 دقائق\n\n⚠️ لا تشارك هذا الرمز مع أي شخص`;

    // إرسال عبر Telegram API
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('❌ Telegram API error:', data);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to send OTP',
          details: data.description
        })
      };
    }

    // نجح الإرسال
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'OTP sent successfully',
        messageId: data.result.message_id
      })
    };

  } catch (error) {
    // تسجيل الخطأ بدون تفاصيل حساسة
    console.error('❌ Error in send-otp function:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to send OTP. Please try again or contact support.'
      })
    };
  }
};
