# =============================================================================
# SCRIPT DE BACKUP - iaMenu Ecosystem (Docker)
# =============================================================================
# Uso: .\scripts\backup-database.ps1
# Requisitos: Docker Desktop com container iamenu-postgres a correr
# =============================================================================

$ErrorActionPreference = "Stop"

# Configuracao
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $PSScriptRoot "..\backups"
$backupFile = Join-Path $backupDir "iamenu_backup_$timestamp.sql"
$containerName = "iamenu-postgres"

# Criar pasta de backups se nao existir
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    Write-Host "[OK] Pasta backups criada" -ForegroundColor Green
}

# Verificar se Docker esta a correr
$dockerCheck = docker ps --filter "name=$containerName" --format "{{.Names}}" 2>$null
if ($dockerCheck -ne $containerName) {
    Write-Host "[ERRO] Container '$containerName' nao esta a correr!" -ForegroundColor Red
    Write-Host "       Executa: docker compose up postgres -d" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== BACKUP DATABASE iaMenu ===" -ForegroundColor Cyan
Write-Host "Timestamp: $timestamp"
Write-Host "Container: $containerName"
Write-Host "Destino: $backupFile"
Write-Host ""

# Executar pg_dump dentro do container
try {
    Write-Host "[...] A criar backup..." -ForegroundColor Yellow

    docker exec $containerName pg_dump -U postgres -d iamenu > $backupFile

    if (Test-Path $backupFile) {
        $size = (Get-Item $backupFile).Length / 1KB
        Write-Host "[OK] Backup criado com sucesso!" -ForegroundColor Green
        Write-Host "     Tamanho: $([math]::Round($size, 2)) KB" -ForegroundColor Gray
        Write-Host "     Ficheiro: $backupFile" -ForegroundColor Gray
    }
} catch {
    Write-Host "[ERRO] Falha ao criar backup: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== BACKUP COMPLETO ===" -ForegroundColor Green
Write-Host ""

# Listar backups existentes
Write-Host "Backups existentes:" -ForegroundColor Cyan
Get-ChildItem $backupDir -Filter "*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | ForEach-Object {
    $size = [math]::Round($_.Length / 1KB, 2)
    Write-Host "  - $($_.Name) ($size KB)" -ForegroundColor Gray
}
