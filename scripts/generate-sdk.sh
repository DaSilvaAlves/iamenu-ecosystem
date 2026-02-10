#!/bin/bash

# iaMenu SDK Generator Script
# Generates TypeScript/JavaScript SDKs from OpenAPI specs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/docker-compose.sdk-generator.yml"
SDK_DIR="$PROJECT_ROOT/sdk"
GENERATED_DIR="$SDK_DIR/generated"
CONFIGS_DIR="$SDK_DIR/generator-configs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Create directories
mkdir -p "$GENERATED_DIR"/{community,marketplace,academy,business,web}
mkdir -p "$CONFIGS_DIR"

# Generate TypeScript SDK for Community API
generate_sdk_typescript_community() {
    print_header "Generating TypeScript SDK for Community API..."

    docker run --rm \
      -v "$PROJECT_ROOT/docs/api:/input:ro" \
      -v "$CONFIGS_DIR:/config:ro" \
      -v "$GENERATED_DIR/community:/output" \
      openapitools/openapi-generator-cli:latest generate \
      -i /input/openapi-community.yaml \
      -g typescript-axios \
      -o /output \
      -c /config/typescript-axios-config.json \
      --additional-properties "packageName=@iamenu/community-api" \
      --skip-validate-spec

    print_success "TypeScript SDK for Community generated"
}

# Generate TypeScript SDK for Marketplace API
generate_sdk_typescript_marketplace() {
    print_header "Generating TypeScript SDK for Marketplace API..."

    docker run --rm \
      -v "$PROJECT_ROOT/docs/api:/input:ro" \
      -v "$CONFIGS_DIR:/config:ro" \
      -v "$GENERATED_DIR/marketplace:/output" \
      openapitools/openapi-generator-cli:latest generate \
      -i /input/openapi-marketplace.yaml \
      -g typescript-axios \
      -o /output \
      -c /config/typescript-axios-config.json \
      --additional-properties "packageName=@iamenu/marketplace-api" \
      --skip-validate-spec

    print_success "TypeScript SDK for Marketplace generated"
}

# Generate TypeScript SDK for Academy API
generate_sdk_typescript_academy() {
    print_header "Generating TypeScript SDK for Academy API..."

    docker run --rm \
      -v "$PROJECT_ROOT/docs/api:/input:ro" \
      -v "$CONFIGS_DIR:/config:ro" \
      -v "$GENERATED_DIR/academy:/output" \
      openapitools/openapi-generator-cli:latest generate \
      -i /input/openapi-academy.yaml \
      -g typescript-axios \
      -o /output \
      -c /config/typescript-axios-config.json \
      --additional-properties "packageName=@iamenu/academy-api" \
      --skip-validate-spec

    print_success "TypeScript SDK for Academy generated"
}

# Generate TypeScript SDK for Business API
generate_sdk_typescript_business() {
    print_header "Generating TypeScript SDK for Business API..."

    docker run --rm \
      -v "$PROJECT_ROOT/docs/api:/input:ro" \
      -v "$CONFIGS_DIR:/config:ro" \
      -v "$GENERATED_DIR/business:/output" \
      openapitools/openapi-generator-cli:latest generate \
      -i /input/openapi-business.yaml \
      -g typescript-axios \
      -o /output \
      -c /config/typescript-axios-config.json \
      --additional-properties "packageName=@iamenu/business-api" \
      --skip-validate-spec

    print_success "TypeScript SDK for Business generated"
}

# Generate unified Web SDK (all APIs combined)
generate_sdk_web() {
    print_header "Generating unified Web SDK (all APIs combined)..."

    # This would require a combined spec or a custom template
    # For now, we'll create a wrapper SDK

    mkdir -p "$GENERATED_DIR/web/src"

    cat > "$GENERATED_DIR/web/package.json" << 'EOF'
{
  "name": "@iamenu/api-client",
  "version": "1.0.0",
  "description": "iaMenu Ecosystem API Client (unified)",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "author": "iaMenu Team",
  "license": "UNLICENSED"
}
EOF

    cat > "$GENERATED_DIR/web/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
EOF

    cat > "$GENERATED_DIR/web/src/index.ts" << 'EOF'
/**
 * iaMenu Ecosystem API Client
 * Unified client for all iaMenu APIs
 */

export * from './community/api';
export * from './marketplace/api';
export * from './academy/api';
export * from './business/api';

import axios, { AxiosInstance } from 'axios';

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  token?: string;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(config: ApiClientConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || 'http://localhost:9000/api/v1',
      timeout: config.timeout || 10000
    });

    // Add auth interceptor
    if (config.token) {
      this.setToken(config.token);
    }

    // Add request/response interceptors
    this.setupInterceptors();
  }

  setToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  private setupInterceptors() {
    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export default ApiClient;
EOF

    print_success "Web SDK wrapper created"
}

# Main command dispatcher
case "${1:-help}" in
    all)
        print_header "Generating all SDKs..."
        echo ""
        generate_sdk_typescript_community
        echo ""
        generate_sdk_typescript_marketplace
        echo ""
        generate_sdk_typescript_academy
        echo ""
        generate_sdk_typescript_business
        echo ""
        generate_sdk_web
        echo ""
        print_success "All SDKs generated!"
        print_info "Generated files are in: $GENERATED_DIR"
        ;;

    community)
        generate_sdk_typescript_community
        ;;

    marketplace)
        generate_sdk_typescript_marketplace
        ;;

    academy)
        generate_sdk_typescript_academy
        ;;

    business)
        generate_sdk_typescript_business
        ;;

    web)
        generate_sdk_web
        ;;

    clean)
        print_warning "Removing generated SDKs..."
        rm -rf "$GENERATED_DIR"/*
        print_success "Cleaned"
        ;;

    *)
        echo "🍽️  iaMenu SDK Generator"
        echo ""
        echo "Uso: $0 <comando>"
        echo ""
        echo "Comandos disponíveis:"
        echo "  all             - Gerar todos os SDKs"
        echo "  community       - Gerar SDK do Community API"
        echo "  marketplace     - Gerar SDK do Marketplace API"
        echo "  academy         - Gerar SDK do Academy API"
        echo "  business        - Gerar SDK do Business API"
        echo "  web             - Gerar SDK Web unificado"
        echo "  clean           - Remover SDKs gerados"
        echo "  help            - Mostrar esta mensagem"
        echo ""
        echo "Exemplos:"
        echo "  $0 all                  # Gera todos os SDKs"
        echo "  $0 community            # Gera apenas Community SDK"
        echo "  $0 clean                # Remove SDKs gerados"
        echo ""
        echo "SDKs serão gerados em: $GENERATED_DIR"
        echo ""
        ;;
esac
