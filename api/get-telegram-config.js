// Vercel Serverless Function
// يقرأ التوكن من Environment Variables ويرسله للمتصفح

export default function handler(req, res) {
  // السماح بـ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // إرسال التوكن من Environment Variable
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  
  res.status(200).json({
    success: true,
    botToken: botToken,
    hasToken: botToken !== ''
  });
}
