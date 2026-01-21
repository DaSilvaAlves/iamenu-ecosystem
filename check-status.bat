@echo off
chcp 65001 >nul
title iaMenu Ecosystem - Verificar Estado

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   iaMenu Ecosystem - Estado dos Serviços                      ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: ===================================================================
:: Verificar Docker
:: ===================================================================
echo [Docker]
docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ Docker Desktop está a correr
) else (
    echo    ❌ Docker Desktop NÃO está a correr
)

:: ===================================================================
:: Verificar PostgreSQL
:: ===================================================================
echo.
echo [PostgreSQL - Porta 5432]
docker ps --format "{{.Names}}" | findstr /i "postgres" | findstr /i "iamenu" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo    ✅ Container PostgreSQL iaMenu está a correr
) else (
    docker ps -a --format "{{.Names}}" | findstr /i "postgres" | findstr /i "iamenu" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo    ⏸️  Container PostgreSQL iaMenu existe mas está parado
    ) else (
        echo    ❌ Container PostgreSQL iaMenu não existe
    )
)

:: ===================================================================
:: Verificar serviços via HTTP
:: ===================================================================
echo.
echo [Backend Services]

:: Community
echo.
echo    Community API (http://localhost:3004):
curl -s -o nul -w "      HTTP Status: %%{http_code}" http://localhost:3004/health 2>nul
if %ERRORLEVEL% EQU 0 (
    curl -s http://localhost:3004/health 2>nul
    echo.
    echo    ✅ Community API está a correr
) else (
    echo       Não foi possível conectar
    echo    ❌ Community API NÃO está a correr
)

:: Marketplace
echo.
echo    Marketplace API (http://localhost:3005):
curl -s -o nul -w "      HTTP Status: %%{http_code}" http://localhost:3005/health 2>nul
if %ERRORLEVEL% EQU 0 (
    curl -s http://localhost:3005/health 2>nul
    echo.
    echo    ✅ Marketplace API está a correr
) else (
    echo       Não foi possível conectar
    echo    ❌ Marketplace API NÃO está a correr
)

:: ===================================================================
:: Verificar portas em uso
:: ===================================================================
echo.
echo [Portas em Uso]
echo.
echo    Porta 3004 (Community):
netstat -aon | findstr ":3004.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3004.*LISTENING"') do (
        echo       ✅ Em uso (PID: %%a)
    )
) else (
    echo       ❌ Livre
)

echo    Porta 3005 (Marketplace):
netstat -aon | findstr ":3005.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3005.*LISTENING"') do (
        echo       ✅ Em uso (PID: %%a)
    )
) else (
    echo       ❌ Livre
)

echo    Porta 5173 (Frontend):
netstat -aon | findstr ":5173.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173.*LISTENING"') do (
        echo       ✅ Em uso (PID: %%a)
    )
) else (
    echo       ❌ Livre
)

echo    Porta 5432 (PostgreSQL):
netstat -aon | findstr ":5432.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5432.*LISTENING"') do (
        echo       ✅ Em uso (PID: %%a)
    )
) else (
    echo       ❌ Livre
)

:: ===================================================================
:: Resumo
:: ===================================================================
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║   RESUMO DE PORTAS                                           ║
echo ╠═══════════════════════════════════════════════════════════════╣
echo ║   Frontend (Vite):     http://localhost:5173                 ║
echo ║   Community API:       http://localhost:3004                 ║
echo ║   Marketplace API:     http://localhost:3005                 ║
echo ║   Business API:        http://localhost:3002                 ║
echo ║   Academy API:         http://localhost:3003                 ║
echo ║   PostgreSQL:          localhost:5432                        ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
pause
