# iaMenu Prism Mock Server Manager Script (PowerShell)
# Gerencia containers Docker com Prism Mock Servers

param(
    [string]$Command = "help",
    [string]$Service = ""
)

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = Split-Path -Parent $SCRIPT_DIR
$DOCKER_COMPOSE_FILE = Join-Path $PROJECT_ROOT "docker-compose.prism.yml"

# Function to print colored output
function Print-Header {
    param([string]$Message)
    Write-Host "▶ $Message" -ForegroundColor Cyan
}

function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Print-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Cyan
}

# Main command dispatcher
switch ($Command.ToLower()) {
    "start" {
        Print-Header "Iniciando Prism Mock Servers..."

        # Check if Docker is installed
        if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
            Print-Error "Docker não está instalado"
            exit 1
        }

        # Start containers
        & docker compose -f $DOCKER_COMPOSE_FILE up -d

        if ($LASTEXITCODE -eq 0) {
            Print-Success "Prism Mock Servers iniciados!"
            Write-Host ""
            Write-Host "📍 URLs dos Mock Servers:" -ForegroundColor Green
            Write-Host "   Gateway (unified): http://localhost:9000"
            Write-Host ""
            Write-Host "APIs individuais:" -ForegroundColor Yellow
            Write-Host "   🔵 Community:   http://localhost:4001/api/v1/community"
            Write-Host "   🟢 Marketplace: http://localhost:4002/api/v1/marketplace"
            Write-Host "   🟡 Academy:     http://localhost:4003/api/v1/academy"
            Write-Host "   🔴 Business:    http://localhost:4004/api/v1/business"
            Write-Host ""
            Write-Host "Gateway endpoints:" -ForegroundColor Yellow
            Write-Host "   🔵 Community:   http://localhost:9000/api/v1/community"
            Write-Host "   🟢 Marketplace: http://localhost:9000/api/v1/marketplace"
            Write-Host "   🟡 Academy:     http://localhost:9000/api/v1/academy"
            Write-Host "   🔴 Business:    http://localhost:9000/api/v1/business"
            Write-Host ""
            Write-Host "📊 Status: http://localhost:9000/status" -ForegroundColor Cyan
            Write-Host ""
        }
        else {
            Print-Error "Falha ao iniciar Prism Mock Servers"
            exit 1
        }
    }

    "stop" {
        Print-Header "Parando Prism Mock Servers..."
        & docker compose -f $DOCKER_COMPOSE_FILE down
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Prism Mock Servers parados"
        }
    }

    "restart" {
        Print-Header "Reiniciando Prism Mock Servers..."
        & docker compose -f $DOCKER_COMPOSE_FILE restart
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Prism Mock Servers reiniciados"
        }
    }

    "logs" {
        if ($Service) {
            Print-Header "Mostrando logs do serviço: $Service"
            & docker compose -f $DOCKER_COMPOSE_FILE logs -f "prism-$Service"
        }
        else {
            Print-Header "Mostrando logs de todos os containers..."
            & docker compose -f $DOCKER_COMPOSE_FILE logs -f
        }
    }

    "status" {
        Print-Header "Status dos containers Prism..."
        & docker compose -f $DOCKER_COMPOSE_FILE ps
        Write-Host ""
        Print-Info "URLs dos Mock Servers:"
        Write-Host "  Gateway: http://localhost:9000/status"
        Write-Host "  Community: http://localhost:4001 (health check: /api/v1/community/posts)"
        Write-Host "  Marketplace: http://localhost:4002 (health check: /api/v1/marketplace/suppliers)"
        Write-Host "  Academy: http://localhost:4003 (health check: /api/v1/academy/courses)"
        Write-Host "  Business: http://localhost:4004 (health check: /api/v1/business/dashboard/stats)"
    }

    "clean" {
        Print-Warning "Limpando containers e volumes..."
        & docker compose -f $DOCKER_COMPOSE_FILE down -v
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Limpeza concluída"
        }
    }

    "build" {
        Print-Header "Construindo imagens..."
        & docker compose -f $DOCKER_COMPOSE_FILE build --no-cache
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Imagens construídas"
        }
    }

    "test" {
        Print-Header "Testando conectividade dos Mock Servers..."
        Write-Host ""

        # Test Community
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:4001/api/v1/community/posts" -TimeoutSec 5 -ErrorAction Stop
            Print-Success "Community Mock Server respondendo (http://localhost:4001)"
        }
        catch {
            Print-Error "Community Mock Server não respondendo"
        }

        # Test Marketplace
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:4002/api/v1/marketplace/suppliers" -TimeoutSec 5 -ErrorAction Stop
            Print-Success "Marketplace Mock Server respondendo (http://localhost:4002)"
        }
        catch {
            Print-Error "Marketplace Mock Server não respondendo"
        }

        # Test Academy
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:4003/api/v1/academy/courses" -TimeoutSec 5 -ErrorAction Stop
            Print-Success "Academy Mock Server respondendo (http://localhost:4003)"
        }
        catch {
            Print-Error "Academy Mock Server não respondendo"
        }

        # Test Business
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:4004/api/v1/business/dashboard/stats" -TimeoutSec 5 -ErrorAction Stop
            Print-Success "Business Mock Server respondendo (http://localhost:4004)"
        }
        catch {
            Print-Error "Business Mock Server não respondendo"
        }

        # Test Gateway
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:9000/status" -TimeoutSec 5 -ErrorAction Stop
            Print-Success "Mock API Gateway respondendo (http://localhost:9000)"
        }
        catch {
            Print-Error "Mock API Gateway não respondendo"
        }

        Write-Host ""
    }

    default {
        Write-Host "🍽️  iaMenu Prism Mock Server Manager" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Uso: .\prism.ps1 -Command <comando> -Service [service]"
        Write-Host ""
        Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
        Write-Host "  start              - Iniciar Prism Mock Servers"
        Write-Host "  stop               - Parar Prism Mock Servers"
        Write-Host "  restart            - Reiniciar Prism Mock Servers"
        Write-Host "  logs               - Mostrar logs (add -Service community|marketplace|academy|business)"
        Write-Host "  status             - Verificar status dos containers"
        Write-Host "  test               - Testar conectividade de todos os serviços"
        Write-Host "  clean              - Remover containers e volumes"
        Write-Host "  build              - Construir imagens Docker"
        Write-Host "  help               - Mostrar esta mensagem"
        Write-Host ""
        Write-Host "Exemplos:" -ForegroundColor Yellow
        Write-Host "  .\prism.ps1 -Command start                  # Inicia todos os Mock Servers"
        Write-Host "  .\prism.ps1 -Command logs -Service community # Mostra logs do Community"
        Write-Host "  .\prism.ps1 -Command test                   # Testa todos os endpoints"
        Write-Host "  .\prism.ps1 -Command status                 # Verifica status"
        Write-Host ""
        Write-Host "📍 URLs dos Mock Servers:" -ForegroundColor Green
        Write-Host "  Gateway (unified):     http://localhost:9000"
        Write-Host "  Community API:         http://localhost:4001"
        Write-Host "  Marketplace API:       http://localhost:4002"
        Write-Host "  Academy API:           http://localhost:4003"
        Write-Host "  Business API:          http://localhost:4004"
        Write-Host ""
    }
}
