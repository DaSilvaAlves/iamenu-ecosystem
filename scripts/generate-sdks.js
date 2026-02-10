#!/usr/bin/env node

/**
 * iaMenu SDK Generator
 * Generates TypeScript/JavaScript SDKs from OpenAPI specs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.dirname(SCRIPT_DIR);
const SDK_DIR = path.join(PROJECT_ROOT, 'sdk');
const GENERATED_DIR = path.join(SDK_DIR, 'generated');
const CONFIGS_DIR = path.join(SDK_DIR, 'generator-configs');
const API_DIR = path.join(PROJECT_ROOT, 'docs', 'api');

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

function log(message, color = colors.reset) {
  console.log(colorize(message, color));
}

function logHeader(message) {
  console.log('');
  log(`▶ ${message}`, colors.cyan);
  console.log('');
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Ensure directories exist
function ensureDirectories() {
  const dirs = [
    path.join(GENERATED_DIR, 'community'),
    path.join(GENERATED_DIR, 'marketplace'),
    path.join(GENERATED_DIR, 'academy'),
    path.join(GENERATED_DIR, 'business'),
    path.join(GENERATED_DIR, 'web'),
    CONFIGS_DIR
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Generate SDK for a service
function generateSDK(service, apiFile) {
  const outputDir = path.join(GENERATED_DIR, service);

  try {
    const cmd = [
      'docker run --rm',
      `-v "${API_DIR}:/input:ro"`,
      `-v "${CONFIGS_DIR}:/config:ro"`,
      `-v "${outputDir}:/output"`,
      'openapitools/openapi-generator-cli:latest generate',
      `-i /input/${apiFile}`,
      '-g typescript-axios',
      '-o /output',
      `-c /config/typescript-axios-config.json`,
      `--additional-properties "packageName=@iamenu/${service}-api"`,
      '--skip-validate-spec'
    ].join(' ');

    logHeader(`Generating TypeScript SDK for ${service}...`);

    execSync(cmd, {
      stdio: 'inherit',
      shell: true
    });

    logSuccess(`SDK for ${service} generated`);
    return true;
  } catch (error) {
    logError(`Failed to generate SDK for ${service}: ${error.message}`);
    return false;
  }
}

// Generate Web SDK wrapper
function generateWebSDK() {
  logHeader('Generating unified Web SDK wrapper...');

  const webDir = path.join(GENERATED_DIR, 'web');
  const srcDir = path.join(webDir, 'src');

  try {
    // Ensure directories
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

    // package.json
    const packageJson = {
      name: '@iamenu/api-client',
      version: '1.0.0',
      description: 'iaMenu Ecosystem API Client (unified)',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        build: 'tsc',
        test: 'jest',
        lint: 'eslint src/**/*.ts'
      },
      dependencies: {
        axios: '^1.6.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        typescript: '^5.0.0'
      },
      author: 'iaMenu Team',
      license: 'UNLICENSED'
    };

    fs.writeFileSync(
      path.join(webDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // tsconfig.json
    const tsconfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true
      },
      include: ['src'],
      exclude: ['node_modules', 'dist']
    };

    fs.writeFileSync(
      path.join(webDir, 'tsconfig.json'),
      JSON.stringify(tsconfig, null, 2)
    );

    // README
    const readme = `# @iamenu/api-client

Unified TypeScript client for iaMenu Ecosystem APIs.

## Installation

\`\`\`bash
npm install @iamenu/api-client
\`\`\`

## Usage

### With TypeScript

\`\`\`typescript
import { ApiClient } from '@iamenu/api-client';

const client = new ApiClient({
  baseURL: 'http://localhost:9000/api/v1',
  token: 'your-jwt-token'
});

// Use the client...
\`\`\`

### With JavaScript

\`\`\`javascript
const { ApiClient } = require('@iamenu/api-client');

const client = new ApiClient({
  baseURL: 'http://localhost:9000/api/v1',
  token: 'your-jwt-token'
});

// Use the client...
\`\`\`

## APIs

- Community: Posts, groups, notifications
- Marketplace: Suppliers, quotes, reviews
- Academy: Courses, enrollments, certificates
- Business: Dashboard, analytics, orders

## API Reference

See generated documentation in the \`docs/\` directory.

## Building

\`\`\`bash
npm install
npm run build
\`\`\`

Generated files will be in the \`dist/\` directory.
`;

    fs.writeFileSync(path.join(webDir, 'README.md'), readme);

    // index.ts
    const indexTs = `/**
 * iaMenu Ecosystem API Client
 * Unified client for all iaMenu APIs
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  token?: string;
}

export interface ApiResponse<T> extends AxiosResponse<T> {}

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

  /**
   * Set JWT token for authenticated requests
   */
  setToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;
  }

  /**
   * Clear JWT token
   */
  clearToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Get the underlying axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Setup interceptors for request/response handling
   */
  private setupInterceptors(): void {
    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          this.clearToken();
          // Could emit event here for app to handle logout
        }

        // Handle other errors
        if (error.response?.data?.error) {
          const apiError = new Error(error.response.data.message);
          (apiError as any).code = error.response.data.error;
          (apiError as any).statusCode = error.response.status;
          return Promise.reject(apiError);
        }

        return Promise.reject(error);
      }
    );
  }
}

export default ApiClient;
`;

    fs.writeFileSync(path.join(srcDir, 'index.ts'), indexTs);

    logSuccess('Web SDK wrapper created');
    return true;
  } catch (error) {
    logError(`Failed to generate Web SDK: ${error.message}`);
    return false;
  }
}

// Show usage
function showUsage() {
  log('🍽️  iaMenu SDK Generator', colors.cyan);
  console.log('');
  log('Uso: npm run sdk:generate [command]', colors.blue);
  console.log('');
  log('Comandos disponíveis:', colors.yellow);
  console.log('  all             - Gerar todos os SDKs');
  console.log('  community       - Gerar SDK do Community API');
  console.log('  marketplace     - Gerar SDK do Marketplace API');
  console.log('  academy         - Gerar SDK do Academy API');
  console.log('  business        - Gerar SDK do Business API');
  console.log('  web             - Gerar SDK Web unificado');
  console.log('  clean           - Remover SDKs gerados');
  console.log('  help            - Mostrar esta mensagem');
  console.log('');
  log('Exemplos:', colors.yellow);
  console.log('  npm run sdk:generate all         # Gera todos os SDKs');
  console.log('  npm run sdk:generate community   # Gera apenas Community SDK');
  console.log('');
  log(`SDKs gerados em: ${GENERATED_DIR}`, colors.cyan);
  console.log('');
}

// Main
function main() {
  const command = process.argv[2]?.toLowerCase() || 'help';

  try {
    switch (command) {
      case 'all':
        ensureDirectories();
        let success = true;
        success = generateSDK('community', 'openapi-community.yaml') && success;
        success = generateSDK('marketplace', 'openapi-marketplace.yaml') && success;
        success = generateSDK('academy', 'openapi-academy.yaml') && success;
        success = generateSDK('business', 'openapi-business.yaml') && success;
        generateWebSDK();

        console.log('');
        if (success) {
          logSuccess('All SDKs generated successfully!');
          logInfo(`Generated files are in: ${GENERATED_DIR}`);
        } else {
          logError('Some SDKs failed to generate. See errors above.');
        }
        break;

      case 'community':
        ensureDirectories();
        generateSDK('community', 'openapi-community.yaml');
        break;

      case 'marketplace':
        ensureDirectories();
        generateSDK('marketplace', 'openapi-marketplace.yaml');
        break;

      case 'academy':
        ensureDirectories();
        generateSDK('academy', 'openapi-academy.yaml');
        break;

      case 'business':
        ensureDirectories();
        generateSDK('business', 'openapi-business.yaml');
        break;

      case 'web':
        ensureDirectories();
        generateWebSDK();
        break;

      case 'clean':
        logWarning('Removing generated SDKs...');
        if (fs.existsSync(GENERATED_DIR)) {
          fs.rmSync(GENERATED_DIR, { recursive: true, force: true });
        }
        logSuccess('Cleaned');
        break;

      default:
        showUsage();
        break;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
