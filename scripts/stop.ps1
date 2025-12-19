# Stop Backend (Port 8000)
Write-Host "Stopping Backend (Port 8000)..." -ForegroundColor Cyan
$backendPort = 8000
$backendConnections = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 }
if ($backendConnections) {
    foreach ($conn in $backendConnections) {
        try {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "Backend process $($conn.OwningProcess) stopped." -ForegroundColor Green
        } catch {}
    }
} else {
    Write-Host "Backend not running on port $backendPort." -ForegroundColor Yellow
}

# Stop Frontend (Port 3000)
Write-Host "Stopping Frontend (Port 3000)..." -ForegroundColor Green
$frontendPort = 3000
$frontendConnections = Get-NetTCPConnection -LocalPort $frontendPort -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 }
if ($frontendConnections) {
    foreach ($conn in $frontendConnections) {
        try {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "Frontend process $($conn.OwningProcess) stopped." -ForegroundColor Green
        } catch {}
    }
} else {
    Write-Host "Frontend not running on port $frontendPort." -ForegroundColor Yellow
}
