# iaMenu Swagger UI Manager Script (PowerShell)
# Gerencia o container Docker com Swagger UI

param(
    [string]$Command = "help"
)

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = Split-Path -Parent $SCRIPT_DIR
$DOCKER_COMPOSE_FILE = Join-Path $PROJECT_ROOT "docker-compose.swagger.yml"

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

# Main command dispatcher
switch ($Command.ToLower()) {
    "start" {
        Print-Header "Iniciando Swagger UI..."

        # Check if Docker is installed
        if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
            Print-Error "Docker não está instalado"
            exit 1
        }

        # Start containers
        & docker compose -f $DOCKER_COMPOSE_FILE up -d

        if ($LASTEXITCODE -eq 0) {
            Print-Success "Swagger UI iniciado!"
            Write-Host ""
            Write-Host "📖 Abra no navegador:" -ForegroundColor Green
            Write-Host "   🌐 http://localhost:8080"
            Write-Host ""
            Write-Host "Specs disponíveis:" -ForegroundColor Yellow
            Write-Host "   🔵 Community:   http://localhost:8080?url=/api/openapi-community.yaml"
            Write-Host "   🟢 Marketplace: http://localhost:8080?url=/api/openapi-marketplace.yaml"
            Write-Host "   🟡 Academy:     http://localhost:8080?url=/api/openapi-academy.yaml"
            Write-Host "   🔴 Business:    http://localhost:8080?url=/api/openapi-business.yaml"
            Write-Host ""
        }
        else {
            Print-Error "Falha ao iniciar Swagger UI"
            exit 1
        }
    }

    "stop" {
        Print-Header "Parando Swagger UI..."
        & docker compose -f $DOCKER_COMPOSE_FILE down
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Swagger UI parado"
        }
    }

    "restart" {
        Print-Header "Reiniciando Swagger UI..."
        & docker compose -f $DOCKER_COMPOSE_FILE restart
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Swagger UI reiniciado"
        }
    }

    "logs" {
        Print-Header "Mostrando logs..."
        & docker compose -f $DOCKER_COMPOSE_FILE logs -f swagger-ui
    }

    "status" {
        Print-Header "Status dos containers..."
        & docker compose -f $DOCKER_COMPOSE_FILE ps
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

    default {
        Write-Host "🍽️  iaMenu Swagger UI Manager" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Uso: .\swagger.ps1 -Command <comando>"
        Write-Host ""
        Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
        Write-Host "  start       - Iniciar Swagger UI (http://localhost:8080)"
        Write-Host "  stop        - Parar Swagger UI"
        Write-Host "  restart     - Reiniciar Swagger UI"
        Write-Host "  logs        - Mostrar logs em tempo real"
        Write-Host "  status      - Verificar status dos containers"
        Write-Host "  clean       - Remover containers e volumes"
        Write-Host "  build       - Construir imagens Docker"
        Write-Host "  help        - Mostrar esta mensagem"
        Write-Host ""
        Write-Host "Exemplos:" -ForegroundColor Yellow
        Write-Host "  .\swagger.ps1 -Command start      # Inicia o Swagger UI"
        Write-Host "  .\swagger.ps1 -Command logs       # Mostra logs em tempo real"
        Write-Host "  .\swagger.ps1 -Command stop       # Para o Swagger UI"
        Write-Host ""
        Write-Host "🌐 Swagger UI: http://localhost:8080" -ForegroundColor Green
        Write-Host "📊 API Server: http://localhost:8081" -ForegroundColor Green
        Write-Host ""
    }
}
