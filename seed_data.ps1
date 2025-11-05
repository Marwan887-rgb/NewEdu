# Script to seed lessons to Firestore
$body = Get-Content "seed_lessons.json" -Raw
$headers = @{
    "x-teacher-password" = "7904"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Method POST -Uri "https://us-central1-edu2-740e0.cloudfunctions.net/seedLessons" -Headers $headers -Body $body
    Write-Host "Success: Lessons imported!" -ForegroundColor Green
    Write-Host $response
} catch {
    Write-Host "Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. Functions are deployed: firebase deploy --only functions"
    Write-Host "2. TEACHER_PASSWORD is set correctly"
}

Write-Host ""
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
