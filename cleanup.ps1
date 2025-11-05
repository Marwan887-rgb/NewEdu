# Cleanup script for old .txt files
# Run: powershell -ExecutionPolicy Bypass -File cleanup.ps1

$filesToDelete = Get-ChildItem -Path . -Filter "*.txt" | Where-Object {
    $_.Name -notlike "cleanup*" -and
    $_.Name -notlike "README*"
}

$count = $filesToDelete.Count
Write-Host "Found $count .txt files to delete" -ForegroundColor Yellow

if ($count -eq 0) {
    Write-Host "No files to delete!" -ForegroundColor Green
    exit
}

$confirm = Read-Host "Delete $count files? (y/n)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled" -ForegroundColor Red
    exit
}

$deleted = 0
foreach ($file in $filesToDelete) {
    try {
        Remove-Item $file.FullName -Force
        Write-Host "Deleted: $($file.Name)" -ForegroundColor Green
        $deleted++
    } catch {
        Write-Host "Error deleting: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "`nDone! Deleted $deleted files" -ForegroundColor Cyan

