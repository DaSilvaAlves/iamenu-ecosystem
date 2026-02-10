#!/bin/bash

# iaMenu Prism Mock Server Manager Script
# Gerencia containers Docker com Prism Mock Servers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.prism.yml"

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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Main command dispatcher
case "${1:-help}" in
    start)
        print_header "Iniciando Prism Mock Servers..."

        if ! command -v docker &> /dev/null; then
            print_error "Docker não está instalado"
            exit 1
        fi

        docker compose -f "$DOCKER_COMPOSE_FILE" up -d

        print_success "Prism Mock Servers iniciados!"
        echo ""
        echo -e "${GREEN}📍 URLs dos Mock Servers:${NC}"
        echo "   Gateway (unified): http://localhost:9000"
        echo ""
        echo -e "${YELLOW}APIs individuais:${NC}"
        echo "   🔵 Community:   http://localhost:4001/api/v1/community"
        echo "   🟢 Marketplace: http://localhost:4002/api/v1/marketplace"
        echo "   🟡 Academy:     http://localhost:4003/api/v1/academy"
        echo "   🔴 Business:    http://localhost:4004/api/v1/business"
        echo ""
        echo -e "${YELLOW}Gateway endpoints:${NC}"
        echo "   🔵 Community:   http://localhost:9000/api/v1/community"
        echo "   🟢 Marketplace: http://localhost:9000/api/v1/marketplace"
        echo "   🟡 Academy:     http://localhost:9000/api/v1/academy"
        echo "   🔴 Business:    http://localhost:9000/api/v1/business"
        echo ""
        echo -e "${BLUE}📊 Status: http://localhost:9000/status${NC}"
        echo ""
        ;;

    stop)
        print_header "Parando Prism Mock Servers..."
        docker compose -f "$DOCKER_COMPOSE_FILE" down
        print_success "Prism Mock Servers parados"
        ;;

    restart)
        print_header "Reiniciando Prism Mock Servers..."
        docker compose -f "$DOCKER_COMPOSE_FILE" restart
        print_success "Prism Mock Servers reiniciados"
        ;;

    logs)
        if [ -z "$2" ]; then
            print_header "Mostrando logs de todos os containers..."
            docker compose -f "$DOCKER_COMPOSE_FILE" logs -f
        else
            SERVICE=$2
            print_header "Mostrando logs do serviço: $SERVICE"
            docker compose -f "$DOCKER_COMPOSE_FILE" logs -f "prism-$SERVICE"
        fi
        ;;

    status)
        print_header "Status dos containers Prism..."
        docker compose -f "$DOCKER_COMPOSE_FILE" ps
        echo ""
        print_info "URLs dos Mock Servers:"
        echo "  Gateway: http://localhost:9000/status"
        echo "  Community: http://localhost:4001 (health check: /api/v1/community/posts)"
        echo "  Marketplace: http://localhost:4002 (health check: /api/v1/marketplace/suppliers)"
        echo "  Academy: http://localhost:4003 (health check: /api/v1/academy/courses)"
        echo "  Business: http://localhost:4004 (health check: /api/v1/business/dashboard/stats)"
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

    test)
        print_header "Testando conectividade dos Mock Servers..."
        echo ""

        # Test Community
        if curl -s http://localhost:4001/api/v1/community/posts | jq . > /dev/null 2>&1; then
            print_success "Community Mock Server respondendo (http://localhost:4001)"
        else
            print_error "Community Mock Server não respondendo"
        fi

        # Test Marketplace
        if curl -s http://localhost:4002/api/v1/marketplace/suppliers | jq . > /dev/null 2>&1; then
            print_success "Marketplace Mock Server respondendo (http://localhost:4002)"
        else
            print_error "Marketplace Mock Server não respondendo"
        fi

        # Test Academy
        if curl -s http://localhost:4003/api/v1/academy/courses | jq . > /dev/null 2>&1; then
            print_success "Academy Mock Server respondendo (http://localhost:4003)"
        else
            print_error "Academy Mock Server não respondendo"
        fi

        # Test Business
        if curl -s http://localhost:4004/api/v1/business/dashboard/stats | jq . > /dev/null 2>&1; then
            print_success "Business Mock Server respondendo (http://localhost:4004)"
        else
            print_error "Business Mock Server não respondendo"
        fi

        # Test Gateway
        if curl -s http://localhost:9000/status | jq . > /dev/null 2>&1; then
            print_success "Mock API Gateway respondendo (http://localhost:9000)"
        else
            print_error "Mock API Gateway não respondendo"
        fi

        echo ""
        ;;

    *)
        echo "🍽️  iaMenu Prism Mock Server Manager"
        echo ""
        echo "Uso: $0 <comando> [opção]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  start              - Iniciar Prism Mock Servers"
        echo "  stop               - Parar Prism Mock Servers"
        echo "  restart            - Reiniciar Prism Mock Servers"
        echo "  logs [service]     - Mostrar logs (community|marketplace|academy|business)"
        echo "  status             - Verificar status dos containers"
        echo "  test               - Testar conectividade de todos os serviços"
        echo "  clean              - Remover containers e volumes"
        echo "  build              - Construir imagens Docker"
        echo "  help               - Mostrar esta mensagem"
        echo ""
        echo "Exemplos:"
        echo "  $0 start                    # Inicia todos os Mock Servers"
        echo "  $0 logs community           # Mostra logs do Community"
        echo "  $0 test                     # Testa todos os endpoints"
        echo "  $0 status                   # Verifica status"
        echo ""
        echo "📍 URLs dos Mock Servers:"
        echo "  Gateway (unified):     http://localhost:9000"
        echo "  Community API:         http://localhost:4001"
        echo "  Marketplace API:       http://localhost:4002"
        echo "  Academy API:           http://localhost:4003"
        echo "  Business API:          http://localhost:4004"
        echo ""
        ;;
esac
