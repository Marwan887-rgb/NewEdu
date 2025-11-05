# إضافة رقم جوال و Chat ID يدويًا إلى Firestore
# استخدم هذا السكربت إذا كنت تعرف Chat ID مسبقًا

$mobile = Read-Host "أدخل رقم الجوال (مثال: 966501234567)"
$chatId = Read-Host "أدخل Chat ID (رقم)"

$body = @{
    mobile = $mobile
    chatId = $chatId
} | ConvertTo-Json

Write-Host "جارٍ إضافة الرقم..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Method POST `
        -Uri "https://us-central1-edu2-740e0.cloudfunctions.net/registerTelegramChat" `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $body
    
    if ($response.ok) {
        Write-Host "✅ تم إضافة رقم $mobile بنجاح!" -ForegroundColor Green
    } else {
        Write-Host "❌ فشل: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ حدث خطأ: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "اضغط أي مفتاح للإغلاق..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
