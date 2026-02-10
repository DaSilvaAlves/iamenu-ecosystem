# Prism Mock Server - iaMenu Ecosystem

**Status:** ✅ Complete (Fase D.2)
**Ports:** 4001-4004 (individual), 9000 (gateway)
**Format:** OpenAPI 3.0.0

## Resumo

Prism é um mock server que simula as APIs baseado nas especificações OpenAPI. Permite:

✅ Testar clientes sem o back-end real
✅ Desenvolvimento paralelo (frontend + backend)
✅ CI/CD testing sem infraestrutura
✅ Demo purposes (sem dados sensíveis)
✅ Respostas realistas baseadas em schemas

## Início Rápido

### NPM Scripts (Recomendado)

```bash
# Iniciar Mock Servers
npm run prism:start

# Parar
npm run prism:stop

# Ver logs
npm run prism:logs

# Testar conectividade
npm run prism:test

# Status
npm run prism:status
```

Depois, teste:
```bash
curl http://localhost:9000/api/v1/community/posts
```

### Docker Compose Direto

```bash
# Iniciar
docker compose -f docker-compose.prism.yml up -d

# Parar
docker compose -f docker-compose.prism.yml down

# Ver logs
docker compose -f docker-compose.prism.yml logs -f
```

### Scripts Bash/PowerShell

**Linux/macOS:**
```bash
chmod +x scripts/prism.sh
./scripts/prism.sh start
./scripts/prism.sh test
```

**Windows (PowerShell):**
```powershell
.\scripts\prism.ps1 -Command start
.\scripts\prism.ps1 -Command test
```

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│           Seu Código (Client/Tests)                 │
│                                                     │
│  curl http://localhost:9000/api/v1/community/posts │
└────────────────────┬────────────────────────────────┘
                     │
           ┌─────────▼─────────┐
           │  Nginx Gateway    │
           │  (porto 9000)     │
           │                   │
           │ Proxy Reverso +   │
           │ CORS Headers      │
           └────┬─────┬─────┬──┘
                 │     │     │
      ┌──────────┘     │     └─────────┐
      │                │               │
┌─────▼────────┐  ┌────▼─────┐  ┌─────▼─────┐
│  Prism Mock  │  │  Prism    │  │  Prism    │
│  Community   │  │  Marketplace
│  (4001)      │  │  (4002)   │  │  Academy  │
└──────────────┘  └───────────┘  │  (4003)   │
                                  │           │
                            ┌─────▼─────┐    │
                            │  Prism    │    │
                            │  Business │    │
                            │  (4004)   │    │
                            └───────────┘    │
                                             │
                            [OpenAPI Specs]--┘
                            - openapi-community.yaml
                            - openapi-marketplace.yaml
                            - openapi-academy.yaml
                            - openapi-business.yaml
```

## URLs

### Gateway (Recomendado)

Usa um nginx reverse proxy para acessar todos os serviços:

```
http://localhost:9000/api/v1/community/posts
http://localhost:9000/api/v1/marketplace/suppliers
http://localhost:9000/api/v1/academy/courses
http://localhost:9000/api/v1/business/dashboard/stats
```

**Vantagem:** Simula o cenário real de produção com um único endpoint

### Individual Services (Direto)

Acesso direto aos Prism servers:

```
http://localhost:4001/api/v1/community/posts
http://localhost:4002/api/v1/marketplace/suppliers
http://localhost:4003/api/v1/academy/courses
http://localhost:4004/api/v1/business/dashboard/stats
```

**Vantagem:** Útil para debugging individual de serviços

## Exemplos de Uso

### Listar Posts

```bash
curl http://localhost:9000/api/v1/community/posts | jq
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "authorId": "550e8400-e29b-41d4-a716-446655440001",
      "title": "string",
      "body": "string",
      "status": "active",
      "views": 0,
      "likes": 0,
      "createdAt": "2026-02-10T15:30:00Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1,
    "hasMore": false
  }
}
```

### Listar Fornecedores

```bash
curl http://localhost:9000/api/v1/marketplace/suppliers | jq
```

### Listar Cursos

```bash
curl http://localhost:9000/api/v1/academy/courses | jq
```

### Listar Dashboard Stats

```bash
curl http://localhost:9000/api/v1/business/dashboard/stats | jq
```

## Testar Conectividade

### npm Test

```bash
npm run prism:test
```

Output exemplo:
```
✅ Community Mock Server respondendo (http://localhost:4001)
✅ Marketplace Mock Server respondendo (http://localhost:4002)
✅ Academy Mock Server respondendo (http://localhost:4003)
✅ Business Mock Server respondendo (http://localhost:4004)
✅ Mock API Gateway respondendo (http://localhost:9000)
```

### Script Bash/PowerShell

```bash
./scripts/prism.sh test
# ou
.\scripts\prism.ps1 -Command test
```

### Manual (cURL)

```bash
# Community
curl http://localhost:4001/api/v1/community/posts

# Marketplace
curl http://localhost:4002/api/v1/marketplace/suppliers

# Academy
curl http://localhost:4003/api/v1/academy/courses

# Business
curl http://localhost:4004/api/v1/business/dashboard/stats

# Gateway
curl http://localhost:9000/status
```

## Monitoramento

### Ver Logs

```bash
# Todos os containers
npm run prism:logs

# Specific service
./scripts/prism.sh logs community
.\scripts\prism.ps1 -Command logs -Service community

# Nginx gateway
docker compose -f docker-compose.prism.yml logs mock-api-gateway
```

### Status

```bash
npm run prism:status

# Output:
# CONTAINER ID   STATUS                PORTS
# ...            Up 2 minutes (healthy) 0.0.0.0:4001->4001/tcp ...
# ...            Up 2 minutes (healthy) 0.0.0.0:4002->4001/tcp ...
```

## Integração com Front-end

### JavaScript/Fetch

```javascript
// Trocar base URL para Prism mock
const API_BASE = 'http://localhost:9000/api/v1';

// Depois do desenvolvimento, mudar para:
// const API_BASE = 'http://localhost:3001/api/v1'; (real backend)

async function getPosts() {
  const response = await fetch(`${API_BASE}/community/posts`);
  return response.json();
}
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000/api/v1'
});

// Mock interceptor (optional)
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Mock API error:', error);
    return Promise.reject(error);
  }
);

export default api;
```

### React Component

```javascript
import { useEffect, useState } from 'react';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9000/api/v1/community/posts')
      .then(r => r.json())
      .then(data => {
        setPosts(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
```

## Respostas Realistas

Prism gera dados realistas baseado na especificação OpenAPI:

### Tipos de Dados
- **UUIDs:** `550e8400-e29b-41d4-a716-446655440000`
- **Strings:** Lorem ipsum realista
- **Numbers:** Valores razoáveis dentro de ranges
- **Dates:** ISO 8601 format
- **Enums:** Valores válidos da spec

### Exemplos por tipo

```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "date": "2026-02-10T15:30:00Z",
  "number": 42,
  "boolean": true,
  "enum": "active",
  "array": [1, 2, 3],
  "object": {
    "nested": "value"
  }
}
```

## Dinâmica vs Estática

### Modo Dinâmico (default)

```bash
# Gera novos dados a cada request
docker compose -f docker-compose.prism.yml up -d

# Flag usado: --dynamic
```

Vantagens:
- Cada request tem dados diferentes
- Simula variabilidade real
- Testa handlemente de dados múltiplos

### Modo Estático (alternativa)

Para respostas consistentes, edite `docker-compose.prism.yml`:

```yaml
command: mock -h 0.0.0.0 /specs/openapi-community.yaml
# Remove: --dynamic
```

## Troubleshooting

### Porta já em uso

```bash
# Ver qual processo usa porta
lsof -i :9000  # macOS/Linux
netstat -ano | findstr :9000  # Windows

# Matar processo ou mudar porta no docker-compose.prism.yml
```

### Container não inicia

```bash
# Ver erro detalhado
docker compose -f docker-compose.prism.yml logs prism-community

# Verificar Docker status
docker ps
docker system df

# Reiniciar Docker
# macOS: Click Docker icon → Restart
# Windows: Services → Docker Desktop → Restart
```

### Gateway não responde

```bash
# Verificar se todos os Prism servers estão healthy
docker compose -f docker-compose.prism.yml ps

# Ver nginx logs
docker compose -f docker-compose.prism.yml logs mock-api-gateway

# Testar direto ao Prism (sem gateway)
curl http://localhost:4001/api/v1/community/posts
```

### CORS error

Gateway tem CORS headers configurados. Se ainda houver problema:

1. Verifique se browser suporta CORS
2. Teste com `curl` primeiro (não tem CORS)
3. Verifique nginx config: `docker/prism/nginx-gateway.conf`

## Performance

### Timings

| Operação | Tempo |
|----------|-------|
| Start containers | 3-5s |
| Response time | 50-100ms |
| Mock data generation | <10ms |

### Recursos

- **RAM:** ~300MB total (5 containers)
- **CPU:** Minimal during requests
- **Disk:** ~2GB (images)

## Recursos Avançados

### Validação

Prism valida requests contra spec:
```bash
# Invalid request (wrong content-type)
curl -X POST http://localhost:9000/api/v1/community/posts \
  -H "Content-Type: text/plain" \
  -d '{"title":"test"}'

# Response: 400 (validation error)
```

### Status Codes

Prism retorna status codes apropriados:
- `200` - GET success
- `201` - POST success
- `400` - Validation error
- `401` - Missing auth
- `404` - Not found
- `500` - Server error (random)

### Headers

Responses incluem headers realistas:
```
Content-Type: application/json
X-Request-ID: uuid
Cache-Control: no-cache
```

## Integração com CI/CD

### GitHub Actions Example

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      prism:
        image: stoplight/prism:latest
        options: >-
          -v ${{ github.workspace }}/docs/api:/specs:ro
          -p 4001:4001
        env:
          PRISM_SPEC: /specs/openapi-community.yaml

    steps:
      - uses: actions/checkout@v2
      - name: Test API
        run: |
          curl http://localhost:4001/api/v1/community/posts
```

## Switching para Backend Real

Quando estiver pronto para usar o back-end real:

### 1. Parar Prism

```bash
npm run prism:stop
```

### 2. Iniciar Back-end Real

```bash
npm run dev
```

### 3. Mudar URLs no Código

```javascript
// De:
const API_BASE = 'http://localhost:9000/api/v1';

// Para:
const API_BASE = 'http://localhost:3000/api/v1'; // ou portas reais
```

## Roadmap (Fase E+)

- [ ] Postman/Insomnia collections export
- [ ] Custom mock data fixtures
- [ ] Response time simulation
- [ ] Error scenario testing
- [ ] Performance benchmarking against real API

## Documentação Relacionada

- 📖 [OpenAPI Spec Index](../api/OPENAPI-INDEX.md)
- 🔵 [Community API Spec](../api/openapi-community.yaml)
- 🟢 [Marketplace API Spec](../api/openapi-marketplace.yaml)
- 🟡 [Academy API Spec](../api/openapi-academy.yaml)
- 🔴 [Business API Spec](../api/openapi-business.yaml)
- 🌐 [Swagger UI Setup](../SWAGGER-UI-SETUP.md)

## Support

```bash
# Quick diagnostics
npm run prism:test

# Detailed logs
npm run prism:logs

# Check status
npm run prism:status

# Restart everything
npm run prism:restart && npm run prism:test
```

---

**Last Updated:** 2026-02-10
**Status:** ✅ Production Ready
**Maintainer:** AIOS (@architect)
