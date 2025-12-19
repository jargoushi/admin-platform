# Resolve Project Root
$ScriptDir = $PSScriptRoot
$ProjectRoot = Split-Path -Parent $ScriptDir

# Start Backend in a new window
Write-Host "Starting Backend..." -ForegroundColor Cyan
Start-Process powershell -WorkingDirectory "$ProjectRoot\backend" -ArgumentList "-NoExit", "-Command", "uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Start Frontend in a new window
Write-Host "Starting Frontend..." -ForegroundColor Green
Start-Process powershell -WorkingDirectory "$ProjectRoot\frontend" -ArgumentList "-NoExit", "-Command", "pnpm dev"

Write-Host "Both services are starting in separate windows." -ForegroundColor Yellow
