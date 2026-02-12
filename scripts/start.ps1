# ==============================================================================
# BSWS - Prvni spusteni (Windows PowerShell)
#
# Pouziti: .\scripts\start.ps1
# ==============================================================================

Write-Host "========================================" -ForegroundColor Blue
Write-Host "   BSWS - Prvni spusteni" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

Set-Location $PSScriptRoot\..

# Zkontroluj Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "CHYBA: Docker neni nainstalovany!" -ForegroundColor Red
    Write-Host "Stahnete z: https://docs.docker.com/get-docker/"
    exit 1
}

# Vytvor .env
if (-not (Test-Path .env)) {
    Write-Host ">>> Vytvarim .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

# Spust
Write-Host ">>> Spoustim kontejnery..." -ForegroundColor Yellow
docker compose up -d --build

Write-Host ">>> Cekam na spusteni..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
docker compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Hotovo! Otevri http://localhost" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
