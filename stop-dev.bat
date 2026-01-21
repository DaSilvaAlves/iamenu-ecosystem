@echo off
chcp 65001 >nul
title iaMenu Ecosystem - Parar Serviços

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   iaMenu Ecosystem - Parar Ambiente de Desenvolvimento        ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: ===================================================================
:: Parar processos Node.js nas portas específicas
:: ===================================================================

echo [1/3] Parando serviços nas portas 3004, 3005, 5173...
echo.

:: Encontrar e matar processo na porta 3004 (Community)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3004.*LISTENING"') do (
    echo      Parando Community API (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Encontrar e matar processo na porta 3005 (Marketplace)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3005.*LISTENING"') do (
    echo      Parando Marketplace API (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

:: Encontrar e matar processo na porta 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173.*LISTENING"') do (
    echo      Parando Frontend (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)

echo      ✅ Serviços Node.js parados

:: ===================================================================
:: Perguntar sobre PostgreSQL
:: ===================================================================
echo.
echo [2/3] PostgreSQL (Docker)...
echo.
set /p STOP_PG="      Deseja parar o PostgreSQL também? (s/N): "
if /i "%STOP_PG%"=="s" (
    echo      Parando PostgreSQL...
    docker stop postgres-iamenu >nul 2>&1
    echo      ✅ PostgreSQL parado
) else (
    echo      PostgreSQL continua a correr
)

:: ===================================================================
:: Verificação final
:: ===================================================================
echo.
echo [3/3] Verificação final...
echo.

netstat -aon | findstr ":3004.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      ⚠️  Porta 3004 ainda em uso
) else (
    echo      ✅ Porta 3004 livre
)

netstat -aon | findstr ":3005.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      ⚠️  Porta 3005 ainda em uso
) else (
    echo      ✅ Porta 3005 livre
)

netstat -aon | findstr ":5173.*LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      ⚠️  Porta 5173 ainda em uso
) else (
    echo      ✅ Porta 5173 livre
)

:: ===================================================================
:: Concluído
:: ===================================================================
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   ✅ AMBIENTE PARADO                                         ║
echo ║                                                               ║
echo ║   Para iniciar novamente: execute start-dev.bat              ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
pause
