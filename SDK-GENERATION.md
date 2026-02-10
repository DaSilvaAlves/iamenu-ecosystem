# SDK Generation Guide

**Fase D.3: SDK Generation Implementation**
**Data:** 2026-02-10
**Status:** ✅ Complete

## O que é SDK Generation?

SDK (Software Development Kit) = Cliente tipado para APIs.

**Sem SDK:**
```javascript
// Manual requests, fácil errar
fetch('http://localhost:9000/api/v1/community/posts')
  .then(r => r.json())
  .then(data => { /* types? */})
```

**Com SDK:**
```typescript
import { CommunityApi } from '@iamenu/community-api';

const api = new CommunityApi();
const posts = await api.getAllPosts(); // tipado + autocomplete!
```

## Início Rápido

### Gerar todos os SDKs

```bash
npm run sdk:generate:all
```

Output:
```
▶ Generating TypeScript SDK for Community API...
✅ SDK for community generated
▶ Generating TypeScript SDK for Marketplace API...
✅ SDK for marketplace generated
[...mais serviços...]
✅ Web SDK wrapper created

✅ All SDKs generated successfully!
```

### Gerar um SDK específico

```bash
npm run sdk:generate:community     # Apenas Community
npm run sdk:generate:marketplace   # Apenas Marketplace
npm run sdk:generate:academy       # Apenas Academy
npm run sdk:generate:business      # Apenas Business
npm run sdk:generate:web           # Web wrapper apenas
```

### Ver todos os comandos disponíveis

```bash
npm run sdk:generate help
```

## Estrutura Gerada

### Diretório `sdk/generated/`

```
sdk/generated/
├── community/          # Community API SDK
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── api/        # Generated API classes
│   │   ├── model/      # Generated models/schemas
│   │   └── index.ts
│   ├── docs/           # Generated documentation
│   └── dist/           # Compiled JavaScript
│
├── marketplace/        # Marketplace API SDK
│   └── [mesma estrutura]
│
├── academy/           # Academy API SDK
│   └── [mesma estrutura]
│
├── business/          # Business API SDK
│   └── [mesma estrutura]
│
└── web/               # Unified Web SDK
    ├── package.json
    ├── tsconfig.json
    ├── src/
    │   └── index.ts
    ├── README.md
    └── dist/
```

## Usar os SDKs

### 1. Instalar o SDK

```bash
cd sdk/generated/web
npm install
npm run build
```

Ou copiar para seu projeto:
```bash
cp -r sdk/generated/web node_modules/@iamenu/api-client
```

### 2. Usar em TypeScript

```typescript
import { ApiClient } from '@iamenu/api-client';

// Inicializar com mock server
const client = new ApiClient({
  baseURL: 'http://localhost:9000/api/v1',
  token: 'seu-jwt-token'
});

// Usar o axios instance para fazer requests
const response = await client.getAxiosInstance().get('/community/posts');
console.log(response.data);
```

### 3. Usar APIs Específicas

```typescript
import { CommunityApi } from '@iamenu/community-api';
import { MarketplaceApi } from '@iamenu/marketplace-api';
import { AcademyApi } from '@iamenu/academy-api';
import { BusinessApi } from '@iamenu/business-api';

// Community API
const communityApi = new CommunityApi();
const posts = await communityApi.getAllPosts();
const createPost = await communityApi.createPost({
  title: 'My Post',
  body: 'Content...'
});

// Marketplace API
const marketplaceApi = new MarketplaceApi();
const suppliers = await marketplaceApi.getAllSuppliers();

// Academy API
const academyApi = new AcademyApi();
const courses = await academyApi.getCourses();

// Business API
const businessApi = new BusinessApi();
const stats = await businessApi.getStats({ period: 'week' });
```

## Integração com Front-end

### React Project

```bash
# 1. Gerar SDKs
npm run sdk:generate:all

# 2. Copiar para src/
cp -r sdk/generated/web/src src/api-client

# 3. Usar em componente
```

```typescript
// src/api/client.ts
import { ApiClient } from '../api-client';

export const apiClient = new ApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9000/api/v1'
});
```

```typescript
// src/pages/Posts.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getAxiosInstance()
      .get('/community/posts')
      .then(res => setPosts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Vue Project

```bash
npm run sdk:generate:all
```

```typescript
// src/api/client.ts
import { ApiClient } from '@iamenu/api-client';

export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1'
});
```

```vue
<template>
  <div>
    <h1>Posts</h1>
    <div v-if="loading">Loading...</div>
    <ul v-else>
      <li v-for="post in posts" :key="post.id">
        {{ post.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient } from './api/client';

const posts = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await apiClient.getAxiosInstance().get('/community/posts');
    posts.value = response.data.data;
  } finally {
    loading.value = false;
  }
});
</script>
```

## Automatizar Regeneração

### GitHub Actions

```yaml
# .github/workflows/sdk-generation.yml
name: Generate SDKs

on:
  push:
    paths:
      - 'docs/api/openapi-*.yaml'
      - '.github/workflows/sdk-generation.yml'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm run sdk:generate:all

      - name: Commit and push
        run: |
          git config user.name "SDK Generator"
          git config user.email "sdk@iamenu.pt"
          git add sdk/generated/
          git commit -m "chore: regenerate SDKs from OpenAPI specs" || true
          git push
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Regenerate SDKs if OpenAPI specs changed
git diff --cached --name-only | grep -q 'docs/api/openapi-' && npm run sdk:generate:all
```

## Customizar Geração

### Mudar Base URL

Edite `sdk/generator-configs/typescript-axios-config.json`:

```json
{
  "baseUrl": "https://api.iamenu.com"
}
```

Depois regenere:
```bash
npm run sdk:generate:all
```

### Adicionar Headers Padrão

Edite `sdk/generated/web/src/index.ts`:

```typescript
constructor(config: ApiClientConfig = {}) {
  this.axiosInstance = axios.create({
    baseURL: config.baseURL || 'http://localhost:9000/api/v1',
    timeout: config.timeout || 10000,
    headers: {
      'X-Client-Version': '1.0.0',
      'X-API-Key': process.env.API_KEY
    }
  });
}
```

## Publicar no NPM

### 1. Preparar SDK

```bash
cd sdk/generated/web

# Update package.json
npm version patch

# Build
npm run build

# Test
npm test
```

### 2. Publicar (com autenticação GitHub Packages)

```bash
# 1. Criar .npmrc
echo "@iamenu:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# 2. Publicar
npm publish
```

### 3. Usar em Outro Projeto

```bash
npm install @iamenu/api-client
```

```typescript
import { ApiClient } from '@iamenu/api-client';

const client = new ApiClient({
  baseURL: 'https://api.iamenu.com',
  token: process.env.API_TOKEN
});
```

## Tipagem Completa

Os SDKs geram tipos TypeScript completos:

```typescript
// Tipos automáticos para todas as respostas
interface Post {
  id: string;
  authorId: string;
  title: string;
  body: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface ListResponse<T> {
  data: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
  };
}

// Usando:
const response = await api.getAllPosts();
// response.data é do tipo Post[]
```

## Troubleshooting

### "docker: not found"

Docker não está instalado. Instale:
- macOS: `brew install docker`
- Windows: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt-get install docker.io`

### "Permission denied while trying to connect"

Adicione seu user ao grupo docker:
```bash
sudo usermod -aG docker $USER
# Depois logout e login
```

### SDK não gera (timeout)

Docker está lento. Aumente timeout:
```bash
# ou

docker pull openapitools/openapi-generator-cli:latest
```

## Performance

### Timings

| Operação | Tempo |
|----------|-------|
| Gerar 1 SDK | 10-15s |
| Gerar todos 4 SDKs | 40-60s |
| Build TypeScript | 5-10s |

### Otimizações

1. Gerar apenas SDKs que mudaram
2. Usar cache do Docker
3. Build em paralelo (CI/CD)

## Roadmap (Fase E+)

- [ ] Python SDK generation
- [ ] Go SDK generation
- [ ] Java SDK generation
- [ ] OpenAPI spec validation
- [ ] SDK changelog generation
- [ ] Breaking change detection
- [ ] API documentation site generation

## Support

```bash
# Ver ajuda
npm run sdk:generate help

# Ver logs detalhados
npm run sdk:generate:all 2>&1 | tee sdk-generation.log

# Limpar e tentar novamente
npm run sdk:clean
npm run sdk:generate:all
```

## Documentação Relacionada

- 📖 [OpenAPI Specs](docs/api/README.md)
- 🌐 [Swagger UI](SWAGGER-UI-SETUP.md)
- 🎭 [Prism Mock Server](PRISM-SETUP.md)
- 🔗 [OpenAPI Generator Docs](https://openapi-generator.tech/)

---

**Created:** 2026-02-10
**Status:** ✅ Production Ready
**Próxima fase:** D.4 - API Testing Suite
