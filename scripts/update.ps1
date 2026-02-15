# ==============================================================================
# BSWS - Aktualizace projektu (Windows PowerShell)
#
# Pouziti: .\scripts\update.ps1
# ==============================================================================

Write-Host "========================================" -ForegroundColor Blue
Write-Host "   BSWS - Aktualizace projektu" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host ""

# Prejdi do root slozky
Set-Location $PSScriptRoot\..

# 1. Uloz hash pred pullem
$oldHash = git rev-parse HEAD 2>$null
if (-not $oldHash) { $oldHash = "none" }

# 2. Pull
Write-Host ">>> Stahuji zmeny z gitu..." -ForegroundColor Yellow
git pull origin main

# 3. Novy hash
$newHash = git rev-parse HEAD

# Pokud se nic nezmenilo
if ($oldHash -eq $newHash) {
    Write-Host "Zadne nove zmeny." -ForegroundColor Green
    Write-Host ">>> Spoustim kontejnery..." -ForegroundColor Yellow
    docker compose up -d
    Write-Host "Hotovo!" -ForegroundColor Green
    exit 0
}

# 4. Zjisti zmeny
Write-Host ">>> Analyzuji zmeny..." -ForegroundColor Yellow
$changedFiles = git diff --name-only $oldHash $newHash

$dbChanged = $false
$backendChanged = $false
$webChanged = $false
$composeChanged = $false

foreach ($file in $changedFiles) {
    if ($file -like "db/*") { $dbChanged = $true }
    if ($file -like "backend/*") { $backendChanged = $true }
    if ($file -like "web/*") { $webChanged = $true }
    if ($file -like "docker-compose.yml" -or $file -like ".env.example") { $composeChanged = $true }
}

# 5. Proved akce
if ($dbChanged -or $composeChanged) {
    Write-Host ">>> Zmeny v DB/compose - RESET databaze..." -ForegroundColor Red
    docker compose down -v
    docker compose up -d --build
}
elseif ($backendChanged) {
    Write-Host ">>> Zmeny v backendu - rebuild..." -ForegroundColor Yellow
    docker compose up -d --build backend
    Start-Sleep -Seconds 5
    docker compose restart web
}
elseif ($webChanged) {
    Write-Host ">>> Zmeny v Apache - restart..." -ForegroundColor Yellow
    docker compose restart web
}
else {
    docker compose up -d
}

# 6. Pockej
Write-Host ">>> Cekam na spusteni..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 7. Stav
Write-Host ""
Write-Host ">>> Stav kontejneru:" -ForegroundColor Blue
docker compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Aktualizace dokoncena!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
