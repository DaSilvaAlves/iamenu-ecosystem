#!/bin/bash

# iaMenu Swagger UI Manager Script
# Gerencia o container Docker com Swagger UI

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.swagger.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Main command dispatcher
case "${1:-help}" in
    start)
        print_header "Iniciando Swagger UI..."

        if ! command -v docker &> /dev/null; then
            print_error "Docker não está instalado"
            exit 1
        fi

        docker compose -f "$DOCKER_COMPOSE_FILE" up -d

        print_success "Swagger UI iniciado!"
        echo ""
        echo -e "${GREEN}📖 Abra no navegador:${NC}"
        echo "   🌐 http://localhost:8080"
        echo ""
        echo -e "${YELLOW}Specs disponíveis:${NC}"
        echo "   🔵 Community:   http://localhost:8080?url=/api/openapi-community.yaml"
        echo "   🟢 Marketplace: http://localhost:8080?url=/api/openapi-marketplace.yaml"
        echo "   🟡 Academy:     http://localhost:8080?url=/api/openapi-academy.yaml"
        echo "   🔴 Business:    http://localhost:8080?url=/api/openapi-business.yaml"
        echo ""
        ;;

    stop)
        print_header "Parando Swagger UI..."
        docker compose -f "$DOCKER_COMPOSE_FILE" down
        print_success "Swagger UI parado"
        ;;

    restart)
        print_header "Reiniciando Swagger UI..."
        docker compose -f "$DOCKER_COMPOSE_FILE" restart
        print_success "Swagger UI reiniciado"
        ;;

    logs)
        print_header "Mostrando logs..."
        docker compose -f "$DOCKER_COMPOSE_FILE" logs -f swagger-ui
        ;;

    status)
        print_header "Status dos containers..."
        docker compose -f "$DOCKER_COMPOSE_FILE" ps
        ;;

    clean)
        print_warning "Limpando containers e volumes..."
        docker compose -f "$DOCKER_COMPOSE_FILE" down -v
        print_success "Limpeza concluída"
        ;;

    build)
        print_header "Construindo imagens..."
        docker compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
        print_success "Imagens construídas"
        ;;

    *)
        echo "🍽️  iaMenu Swagger UI Manager"
        echo ""
        echo "Uso: $0 <comando>"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start       - Iniciar Swagger UI (http://localhost:8080)"
        echo "  stop        - Parar Swagger UI"
        echo "  restart     - Reiniciar Swagger UI"
        echo "  logs        - Mostrar logs em tempo real"
        echo "  status      - Verificar status dos containers"
        echo "  clean       - Remover containers e volumes"
        echo "  build       - Construir imagens Docker"
        echo "  help        - Mostrar esta mensagem"
        echo ""
        echo "Exemplos:"
        echo "  $0 start      # Inicia o Swagger UI"
        echo "  $0 logs       # Mostra logs em tempo real"
        echo "  $0 stop       # Para o Swagger UI"
        echo ""
        echo "🌐 Swagger UI: http://localhost:8080"
        echo "📊 API Server: http://localhost:8081"
        echo ""
        ;;
esac
