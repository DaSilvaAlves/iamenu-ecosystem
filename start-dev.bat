@echo off
chcp 65001 >nul
title iaMenu Ecosystem - Development Server

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   iaMenu Ecosystem - Iniciar Ambiente de Desenvolvimento      ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: ===================================================================
:: CONFIGURAÇÃO DE PORTAS
:: ===================================================================
:: Frontend:    5173
:: Community:   3004
:: Marketplace: 3005
:: Business:    3002
:: Academy:     3003
:: PostgreSQL:  5433 (Docker)
:: ===================================================================

set PROJECT_ROOT=C:\Users\XPS\Documents\iamenu-ecosystem

:: ===================================================================
:: PASSO 1: Verificar se Docker está a correr
:: ===================================================================
echo [1/5] Verificando Docker...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERRO: Docker não está a correr!
    echo.
    echo    Por favor, inicie o Docker Desktop primeiro.
    echo    Depois execute este script novamente.
    echo.
    pause
    exit /b 1
)
echo      ✅ Docker está a correr

:: ===================================================================
:: PASSO 2: Iniciar PostgreSQL (Docker)
:: ===================================================================
echo.
echo [2/5] Iniciando PostgreSQL (Docker)...

:: Verificar se o container existe (pode ser postgres-iamenu ou iamenu-postgres)
docker ps -a --format "{{.Names}}" | findstr /i "postgres" | findstr /i "iamenu" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo      Criando container PostgreSQL...
    docker run -d ^
        --name iamenu-postgres ^
        -e POSTGRES_USER=postgres ^
        -e POSTGRES_PASSWORD=postgres ^
        -e POSTGRES_DB=iamenu ^
        -p 5433:5432 ^
        -v iamenu-postgres-data:/var/lib/postgresql/data ^
        postgres:15
) else (
    :: Container existe, verificar se está a correr
    docker ps --format "{{.Names}}" | findstr /i "postgres" | findstr /i "iamenu" >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo      Iniciando container existente...
        for /f "tokens=*" %%a in ('docker ps -a --format "{{.Names}}" ^| findstr /i "postgres" ^| findstr /i "iamenu"') do (
            docker start %%a
        )
    ) else (
        echo      Container já está a correr
    )
)

:: Aguardar PostgreSQL ficar pronto
echo      Aguardando PostgreSQL ficar pronto...
timeout /t 3 /nobreak >nul
echo      ✅ PostgreSQL iniciado (porta 5433)

:: ===================================================================
:: PASSO 3: Iniciar Backend Services
:: ===================================================================
echo.
echo [3/5] Iniciando Backend Services...
echo.

:: Iniciar Community (porta 3004)
echo      Iniciando Community API (porta 3004)...
start "Community API - 3004" cmd /k "cd /d %PROJECT_ROOT%\services\community && title Community API - 3004 && color 0A && npm run dev"
timeout /t 2 /nobreak >nul

:: Iniciar Marketplace (porta 3005)
echo      Iniciando Marketplace API (porta 3005)...
start "Marketplace API - 3005" cmd /k "cd /d %PROJECT_ROOT%\services\marketplace && title Marketplace API - 3005 && color 0B && npm run dev"
timeout /t 2 /nobreak >nul

echo      ✅ Backend services iniciados

:: ===================================================================
:: PASSO 4: Aguardar serviços ficarem prontos
:: ===================================================================
echo.
echo [4/5] Aguardando serviços ficarem prontos...
echo      (isto pode demorar alguns segundos)
timeout /t 8 /nobreak >nul

:: Verificar se os serviços estão a responder
echo.
echo      Verificando serviços...

curl -s http://localhost:3004/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      ✅ Community API (3004) - OK
) else (
    echo      ⏳ Community API (3004) - A iniciar...
)

curl -s http://localhost:3005/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      ✅ Marketplace API (3005) - OK
) else (
    echo      ⏳ Marketplace API (3005) - A iniciar...
)

:: ===================================================================
:: PASSO 5: Iniciar Frontend
:: ===================================================================
echo.
echo [5/5] Iniciando Frontend (porta 5173)...
start "Frontend - 5173" cmd /k "cd /d %PROJECT_ROOT%\frontend\apps\prototype-vision && title Frontend - 5173 && color 0E && npm run dev"

:: ===================================================================
:: CONCLUÍDO
:: ===================================================================
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   ✅ AMBIENTE INICIADO COM SUCESSO!                          ║
echo ║                                                               ║
echo ║   URLs:                                                       ║
echo ║   • Frontend:    http://localhost:5173                       ║
echo ║   • Community:   http://localhost:3004/health                ║
echo ║   • Marketplace: http://localhost:3005/health                ║
echo ║                                                               ║
echo ║   Janelas abertas:                                           ║
echo ║   • Community API - 3004 (verde)                             ║
echo ║   • Marketplace API - 3005 (azul)                            ║
echo ║   • Frontend - 5173 (amarelo)                                ║
echo ║                                                               ║
echo ║   Para parar: feche as janelas ou pressione Ctrl+C           ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: Abrir browser automaticamente após 5 segundos
echo Abrindo browser em 5 segundos...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo Esta janela pode ser fechada.
echo.
pause
