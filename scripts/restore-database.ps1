# =============================================================================
# SCRIPT DE RESTORE - iaMenu Ecosystem (Docker)
# =============================================================================
# Uso: .\scripts\restore-database.ps1 -BackupFile "backups\iamenu_backup_XXXX.sql"
# ATENCAO: Isto SUBSTITUI todos os dados da BD!
# =============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

$ErrorActionPreference = "Stop"
$containerName = "iamenu-postgres"

# Verificar se ficheiro existe
$fullPath = if ([System.IO.Path]::IsPathRooted($BackupFile)) {
    $BackupFile
} else {
    Join-Path (Get-Location) $BackupFile
}

if (-not (Test-Path $fullPath)) {
    Write-Host "[ERRO] Ficheiro de backup nao encontrado: $fullPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Backups disponiveis:" -ForegroundColor Cyan
    $backupDir = Join-Path $PSScriptRoot "..\backups"
    if (Test-Path $backupDir) {
        Get-ChildItem $backupDir -Filter "*.sql" | ForEach-Object {
            Write-Host "  - backups\$($_.Name)" -ForegroundColor Gray
        }
    }
    exit 1
}

# Verificar Docker
$dockerCheck = docker ps --filter "name=$containerName" --format "{{.Names}}" 2>$null
if ($dockerCheck -ne $containerName) {
    Write-Host "[ERRO] Container '$containerName' nao esta a correr!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== RESTORE DATABASE iaMenu ===" -ForegroundColor Cyan
Write-Host "Ficheiro: $fullPath" -ForegroundColor Yellow
Write-Host "Container: $containerName"
Write-Host ""
Write-Host "ATENCAO: Isto vai SUBSTITUIR todos os dados atuais!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Escreve 'RESTAURAR' para continuar"
if ($confirm -ne "RESTAURAR") {
    Write-Host "Operacao cancelada." -ForegroundColor Yellow
    exit 0
}

try {
    Write-Host "[...] A restaurar backup..." -ForegroundColor Yellow

    # Copiar ficheiro para o container e executar
    docker cp $fullPath "${containerName}:/tmp/restore.sql"
    docker exec $containerName psql -U postgres -d iamenu -f /tmp/restore.sql
    docker exec $containerName rm /tmp/restore.sql

    Write-Host "[OK] Restore completo!" -ForegroundColor Green
} catch {
    Write-Host "[ERRO] Falha no restore: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== RESTORE COMPLETO ===" -ForegroundColor Green
