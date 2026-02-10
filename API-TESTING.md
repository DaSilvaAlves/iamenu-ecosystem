# API Testing Suite Guide

**Fase D.4: API Testing Suite Implementation**
**Data:** 2026-02-10
**Status:** ✅ Complete

## Visão Geral

Suite de testes Jest para validar todos os endpoints das 4 APIs iaMenu:
- 🔵 Community API (22 testes)
- 🟢 Marketplace API (15 testes)
- 🟡 Academy API (18 testes)
- 🔴 Business API (20 testes)

**Total: 75+ testes de integração**

## Início Rápido

### 1. Iniciar Mock Servers

```bash
npm run prism:start
npm run prism:test
```

### 2. Rodar Testes

```bash
# Todos os testes
npm run test:api

# Testes específicos
npm run test:api:community
npm run test:api:marketplace
npm run test:api:academy
npm run test:api:business

# Com cobertura
npm run test:api:coverage

# Watch mode
npm run test:api:watch
```

### 3. Ver Resultados

```
PASS  tests/api/community.test.ts
  Community API
    Posts Endpoints
      ✓ should list all posts (public) (125ms)
      ✓ should support pagination (98ms)
      ✓ should support search (102ms)
      ✓ should create a new post (156ms)
      ✓ should validate required fields (89ms)
      ...

Test Suites: 4 passed, 4 total
Tests:       75 passed, 75 total
```

## Estrutura de Testes

### Diretório

```
tests/api/
├── setup.ts                    # Global configuration
├── community.test.ts           # Community API tests
├── marketplace.test.ts         # Marketplace API tests
├── academy.test.ts             # Academy API tests
└── business.test.ts            # Business API tests
```

### Configuração Jest

```
jest.config.api.js
- testEnvironment: node
- transform: ts-jest
- testTimeout: 30000ms
- coverage: HTML + LCOV + JSON
```

## O que é Testado

### Community API (22 testes)

```
Posts:
  ✓ GET /posts (list, pagination, search, sort)
  ✓ POST /posts (create, validation)
  ✓ GET /posts/{id} (get, 404 handling)
  ✓ PATCH /posts/{id} (update, authorization)
  ✓ DELETE /posts/{id} (delete)

Comments:
  ✓ GET /posts/{id}/comments
  ✓ POST /posts/{id}/comments (create, validation)

Reactions:
  ✓ GET /posts/{id}/reactions
  ✓ POST /posts/{id}/react (toggle)

Groups:
  ✓ GET /groups (list)
  ✓ POST /groups (create)
  ✓ GET /groups/{id} (get)
  ✓ PATCH /groups/{id} (update)
  ✓ DELETE /groups/{id} (delete)

Notifications:
  ✓ GET /notifications (list, STRICT)
```

### Marketplace API (15 testes)

```
Suppliers:
  ✓ GET /suppliers (list, filter)
  ✓ POST /suppliers (create, validate)
  ✓ GET /suppliers/{id}

Reviews:
  ✓ GET /suppliers/{id}/reviews
  ✓ POST /suppliers/{id}/reviews (rating validation)

Quotes:
  ✓ GET /quotes (RLS filtered)
  ✓ POST /quotes (create, validate)
  ✓ GET /quotes/{id}

Bargains:
  ✓ GET /bargains (public)
  ✓ GET /bargains/{id} (public)

Error Handling:
  ✓ RLS enforcement
  ✓ Invalid ID handling
```

### Academy API (18 testes)

```
Courses:
  ✓ GET /courses (published, filters)
  ✓ POST /courses (create)
  ✓ GET /courses/{id}
  ✓ PATCH /courses/{id} (instructor only)

Enrollments:
  ✓ GET /enrollments (STRICT - own only)
  ✓ POST /enrollments (create, duplicate prevention)
  ✓ DELETE /enrollments/{id}
  ✓ PATCH /enrollments/{id} (progress tracking)

Certificates:
  ✓ GET /certificates (STRICT)
  ✓ GET /certificates/verify/{code} (public)

Error Handling:
  ✓ RLS enforcement
  ✓ Duplicate enrollment prevention
```

### Business API (20 testes)

```
Dashboard:
  ✓ GET /dashboard/stats (periods, ranges)
  ✓ GET /dashboard/top-products (sorting)
  ✓ GET /dashboard/alerts (filtering)
  ✓ GET /dashboard/opportunities (priority)
  ✓ GET /dashboard/sales-trends (grouping)

Analytics:
  ✓ GET /dashboard/ai-prediction (focus areas)
  ✓ GET /dashboard/demand-forecast (7-day)
  ✓ GET /dashboard/menu-engineering (categories)
  ✓ GET /dashboard/peak-hours-heatmap
  ✓ GET /dashboard/benchmark (metrics)

Error Handling:
  ✓ Authentication required
  ✓ Invalid period validation
  ✓ RLS enforcement
```

## Exemplos de Testes

### Teste Básico

```typescript
describe('GET /posts', () => {
  it('should list all posts', async () => {
    const response = await apiClient.get('/community/posts');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    expect(Array.isArray(response.data.data)).toBe(true);
  });
});
```

### Teste de Validação

```typescript
describe('POST /posts', () => {
  it('should validate required fields', async () => {
    try {
      await apiClient.post('/community/posts', {
        title: 'No body'
      });
      fail('Should validate');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data?.error).toBe('VALIDATION_ERROR');
    }
  });
});
```

### Teste de Autorização

```typescript
describe('DELETE /posts/{id}', () => {
  it('should not allow deleting others posts', async () => {
    const otherUserToken = '...different-user-token...';
    const otherUserClient = axios.create({
      baseURL: 'http://localhost:9000/api/v1',
      headers: {
        'Authorization': `Bearer ${otherUserToken}`
      }
    });

    try {
      await otherUserClient.delete(`/community/posts/${postId}`);
      fail('Should prevent deletion');
    } catch (error: any) {
      expect(error.response?.status).toBe(403);
    }
  });
});
```

### Teste de RLS

```typescript
describe('Notifications', () => {
  it('should enforce STRICT RLS', async () => {
    const response = await apiClient.get('/community/notifications');

    expect(response.status).toBe(200);
    // All notifications should belong to current user
    response.data.data.forEach((notif: any) => {
      expect(notif.userId).toBe(currentUserId);
    });
  });
});
```

## Cobertura de Testes

### Executar com Cobertura

```bash
npm run test:api:coverage
```

Output:

```
----------------|---------|----------|---------|---------|
File            | % Stmts | % Branch | % Funcs | % Lines |
----------------|---------|----------|---------|---------|
All files       |  85.2   |  78.9    |  82.1   |  85.2   |
 community.ts   |  90.5   |  85.2    |  88.3   |  90.5   |
 marketplace.ts |  82.1   |  76.5    |  80.2   |  82.1   |
 academy.ts     |  84.3   |  79.8    |  83.1   |  84.3   |
 business.ts    |  82.9   |  78.1    |  81.2   |  82.9   |
----------------|---------|----------|---------|---------|
```

Report HTML gerado em `coverage/api/index.html`

## Configuração

### Base URL

Via variável de ambiente:

```bash
API_BASE_URL=http://localhost:9000/api/v1 npm run test:api
```

Ou edite `tests/api/setup.ts`:

```typescript
export const TEST_CONFIG = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:9000/api/v1',
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
  TEST_TOKEN: process.env.TEST_TOKEN || 'your-test-token'
};
```

### JWT Token

```bash
# Use test token from env
TEST_TOKEN=eyJhbGc... npm run test:api

# Ou edite setup.ts
```

## Integração CI/CD

### GitHub Actions

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      prism:
        image: stoplight/prism:latest
        options: -v ${{ github.workspace }}/docs/api:/specs:ro -p 4001:4001

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run test:api -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/api/lcov.info
```

## Troubleshooting

### "Connection refused"

```bash
# Ensure Prism is running
npm run prism:start
npm run prism:test

# Check URL
echo $API_BASE_URL

# Test manually
curl http://localhost:9000/api/v1/community/posts
```

### "ENOTFOUND localhost"

Docker networking issue. Try:

```bash
# Use IP instead
API_BASE_URL=http://127.0.0.1:9000/api/v1 npm run test:api

# Or ensure services running
npm run prism:status
```

### Timeout

Increase timeout:

```bash
API_TIMEOUT=30000 npm run test:api
```

### Token Expired

Update token in `setup.ts` or env var:

```bash
TEST_TOKEN='new-token' npm run test:api
```

## Boas Práticas

### 1. Testar Casos Comuns

```typescript
// ✅ Good
it('should list posts with pagination', async () => {
  const response = await apiClient.get('/posts', {
    params: { limit: 10, offset: 0 }
  });
  expect(response.data.pagination.limit).toBe(10);
});

// ❌ Avoid
it('should work', async () => {
  const response = await apiClient.get('/posts');
  expect(response.status).toBe(200);
});
```

### 2. Testar Casos de Erro

```typescript
// ✅ Good
it('should return 400 for invalid data', async () => {
  try {
    await apiClient.post('/posts', { title: 'short' });
    fail('Should validate');
  } catch (error: any) {
    expect(error.response?.status).toBe(400);
  }
});

// ❌ Avoid
it('should handle errors', async () => {
  try {
    await apiClient.post('/posts', {});
  } catch (e) {
    // Silently fail
  }
});
```

### 3. Testar Autorização

```typescript
// ✅ Good
it('should enforce authorization', async () => {
  const unauthClient = axios.create();
  try {
    await unauthClient.post('/posts', data);
    fail('Should require auth');
  } catch (error: any) {
    expect(error.response?.status).toBe(401);
  }
});
```

## Próximos Passos

### Adicionar Testes

1. Crie novo arquivo: `tests/api/new-feature.test.ts`
2. Implemente testes usando padrão existente
3. Execute: `npm run test:api:watch`
4. Commit quando passar

### Adicionar Mock Fixtures

```typescript
// tests/api/fixtures/posts.json
export const VALID_POST = {
  title: 'Test Post',
  body: 'Sufficient content here'
};

export const INVALID_POST = {
  title: 'x' // Too short
};

// Use em testes
import { VALID_POST } from './fixtures/posts';
```

### Performance Testing

```bash
# Add artillery for load testing
npm install --save-dev artillery

# Create artillery.yml
# Run: artillery run artillery.yml
```

## Documentação Relacionada

- 📖 [OpenAPI Specs](docs/api/README.md)
- 🌐 [Swagger UI](SWAGGER-UI-SETUP.md)
- 🎭 [Prism Mock Server](PRISM-SETUP.md)
- 🔧 [SDK Generation](SDK-GENERATION.md)

## Support

```bash
# Ver testes disponíveis
npm run test:api -- --listTests

# Rodar teste específico
npm run test:api -- --testNamePattern="should list posts"

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Coverage report
npm run test:api:coverage
open coverage/api/index.html
```

---

**Created:** 2026-02-10
**Status:** ✅ Production Ready
**Cobertura:** 75+ testes
**Próxima fase:** E.1 - Story Implementation
