# iaMenu SDK Generator Script (PowerShell)
# Generates TypeScript/JavaScript SDKs from OpenAPI specs

param(
    [string]$Command = "help"
)

$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = Split-Path -Parent $SCRIPT_DIR
$DOCKER_COMPOSE_FILE = Join-Path $PROJECT_ROOT "docker-compose.sdk-generator.yml"
$SDK_DIR = Join-Path $PROJECT_ROOT "sdk"
$GENERATED_DIR = Join-Path $SDK_DIR "generated"
$CONFIGS_DIR = Join-Path $SDK_DIR "generator-configs"

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

# Create necessary directories
function Initialize-Directories {
    $dirs = @(
        "$GENERATED_DIR/community",
        "$GENERATED_DIR/marketplace",
        "$GENERATED_DIR/academy",
        "$GENERATED_DIR/business",
        "$GENERATED_DIR/web",
        $CONFIGS_DIR
    )

    foreach ($dir in $dirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
}

# Generate TypeScript SDK for Community API
function Generate-SDK-Community {
    Print-Header "Generating TypeScript SDK for Community API..."

    & docker run --rm `
      -v "$($PROJECT_ROOT)/docs/api:/input:ro" `
      -v "$($CONFIGS_DIR):/config:ro" `
      -v "$($GENERATED_DIR)/community:/output" `
      openapitools/openapi-generator-cli:latest generate `
      -i /input/openapi-community.yaml `
      -g typescript-axios `
      -o /output `
      -c /config/typescript-axios-config.json `
      --additional-properties "packageName=@iamenu/community-api" `
      --skip-validate-spec

    if ($LASTEXITCODE -eq 0) {
        Print-Success "TypeScript SDK for Community generated"
    }
    else {
        Print-Error "Failed to generate Community SDK"
        return $false
    }
    return $true
}

# Generate TypeScript SDK for Marketplace API
function Generate-SDK-Marketplace {
    Print-Header "Generating TypeScript SDK for Marketplace API..."

    & docker run --rm `
      -v "$($PROJECT_ROOT)/docs/api:/input:ro" `
      -v "$($CONFIGS_DIR):/config:ro" `
      -v "$($GENERATED_DIR)/marketplace:/output" `
      openapitools/openapi-generator-cli:latest generate `
      -i /input/openapi-marketplace.yaml `
      -g typescript-axios `
      -o /output `
      -c /config/typescript-axios-config.json `
      --additional-properties "packageName=@iamenu/marketplace-api" `
      --skip-validate-spec

    if ($LASTEXITCODE -eq 0) {
        Print-Success "TypeScript SDK for Marketplace generated"
    }
    else {
        Print-Error "Failed to generate Marketplace SDK"
        return $false
    }
    return $true
}

# Generate TypeScript SDK for Academy API
function Generate-SDK-Academy {
    Print-Header "Generating TypeScript SDK for Academy API..."

    & docker run --rm `
      -v "$($PROJECT_ROOT)/docs/api:/input:ro" `
      -v "$($CONFIGS_DIR):/config:ro" `
      -v "$($GENERATED_DIR)/academy:/output" `
      openapitools/openapi-generator-cli:latest generate `
      -i /input/openapi-academy.yaml `
      -g typescript-axios `
      -o /output `
      -c /config/typescript-axios-config.json `
      --additional-properties "packageName=@iamenu/academy-api" `
      --skip-validate-spec

    if ($LASTEXITCODE -eq 0) {
        Print-Success "TypeScript SDK for Academy generated"
    }
    else {
        Print-Error "Failed to generate Academy SDK"
        return $false
    }
    return $true
}

# Generate TypeScript SDK for Business API
function Generate-SDK-Business {
    Print-Header "Generating TypeScript SDK for Business API..."

    & docker run --rm `
      -v "$($PROJECT_ROOT)/docs/api:/input:ro" `
      -v "$($CONFIGS_DIR):/config:ro" `
      -v "$($GENERATED_DIR)/business:/output" `
      openapitools/openapi-generator-cli:latest generate `
      -i /input/openapi-business.yaml `
      -g typescript-axios `
      -o /output `
      -c /config/typescript-axios-config.json `
      --additional-properties "packageName=@iamenu/business-api" `
      --skip-validate-spec

    if ($LASTEXITCODE -eq 0) {
        Print-Success "TypeScript SDK for Business generated"
    }
    else {
        Print-Error "Failed to generate Business SDK"
        return $false
    }
    return $true
}

# Generate Web SDK wrapper
function Generate-SDK-Web {
    Print-Header "Generating unified Web SDK..."

    $webDir = Join-Path $GENERATED_DIR "web"
    $srcDir = Join-Path $webDir "src"

    # Create directories
    if (-not (Test-Path $srcDir)) {
        New-Item -ItemType Directory -Path $srcDir -Force | Out-Null
    }

    # Create package.json
    $packageJson = @"
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
"@
    $packageJson | Out-File -FilePath "$webDir\package.json" -Encoding UTF8

    # Create tsconfig.json
    $tsconfigJson = @"
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
"@
    $tsconfigJson | Out-File -FilePath "$webDir\tsconfig.json" -Encoding UTF8

    # Create index.ts
    $indexTs = @"
/**
 * iaMenu Ecosystem API Client
 * Unified client for all iaMenu APIs
 */

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

    if (config.token) {
      this.setToken(config.token);
    }

    this.setupInterceptors();
  }

  setToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer `$token``;
  }

  clearToken() {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
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
"@
    $indexTs | Out-File -FilePath "$srcDir\index.ts" -Encoding UTF8

    Print-Success "Web SDK wrapper created"
}

# Main command dispatcher
switch ($Command.ToLower()) {
    "all" {
        Print-Header "Generating all SDKs..."
        Write-Host ""
        Initialize-Directories

        $success = $true
        $success = Generate-SDK-Community -and $success
        Write-Host ""
        $success = Generate-SDK-Marketplace -and $success
        Write-Host ""
        $success = Generate-SDK-Academy -and $success
        Write-Host ""
        $success = Generate-SDK-Business -and $success
        Write-Host ""
        Generate-SDK-Web

        if ($success) {
            Write-Host ""
            Print-Success "All SDKs generated!"
            Print-Info "Generated files are in: $GENERATED_DIR"
        }
    }

    "community" {
        Initialize-Directories
        Generate-SDK-Community
    }

    "marketplace" {
        Initialize-Directories
        Generate-SDK-Marketplace
    }

    "academy" {
        Initialize-Directories
        Generate-SDK-Academy
    }

    "business" {
        Initialize-Directories
        Generate-SDK-Business
    }

    "web" {
        Initialize-Directories
        Generate-SDK-Web
    }

    "clean" {
        Print-Warning "Removing generated SDKs..."
        if (Test-Path $GENERATED_DIR) {
            Remove-Item "$GENERATED_DIR\*" -Recurse -Force
        }
        Print-Success "Cleaned"
    }

    default {
        Write-Host "🍽️  iaMenu SDK Generator" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Uso: .\generate-sdk.ps1 -Command <comando>"
        Write-Host ""
        Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
        Write-Host "  all             - Gerar todos os SDKs"
        Write-Host "  community       - Gerar SDK do Community API"
        Write-Host "  marketplace     - Gerar SDK do Marketplace API"
        Write-Host "  academy         - Gerar SDK do Academy API"
        Write-Host "  business        - Gerar SDK do Business API"
        Write-Host "  web             - Gerar SDK Web unificado"
        Write-Host "  clean           - Remover SDKs gerados"
        Write-Host "  help            - Mostrar esta mensagem"
        Write-Host ""
        Write-Host "Exemplos:" -ForegroundColor Yellow
        Write-Host "  .\generate-sdk.ps1 -Command all         # Gera todos os SDKs"
        Write-Host "  .\generate-sdk.ps1 -Command community   # Gera apenas Community SDK"
        Write-Host "  .\generate-sdk.ps1 -Command clean       # Remove SDKs gerados"
        Write-Host ""
        Write-Host "SDKs serão gerados em: $GENERATED_DIR" -ForegroundColor Cyan
        Write-Host ""
    }
}
