# Swagger UI - iaMenu Ecosystem API

**Status:** ✅ Complete (Fase D.1)
**Port:** 8080 (UI), 8081 (API Server)
**Format:** OpenAPI 3.0.0

## Resumo

Este diretório contém a configuração Docker para executar uma instância de Swagger UI que integra todas as 4 especificações OpenAPI da iaMenu Ecosystem:

- 🔵 **Community API** (Posts, Grupos, Notificações)
- 🟢 **Marketplace API** (Fornecedores, Quotes, Reviews)
- 🟡 **Academy API** (Cursos, Matrículas, Certificados)
- 🔴 **Business API** (Dashboard, Analytics)

## Início Rápido

### Linux/macOS (Bash)

```bash
# Iniciar Swagger UI
./scripts/swagger.sh start

# Parar
./scripts/swagger.sh stop

# Ver logs
./scripts/swagger.sh logs
```

### Windows (PowerShell)

```powershell
# Iniciar Swagger UI
.\scripts\swagger.ps1 -Command start

# Parar
.\scripts\swagger.ps1 -Command stop

# Ver logs
.\scripts\swagger.ps1 -Command logs
```

### Docker Compose direto

```bash
# Iniciar
docker compose -f docker-compose.swagger.yml up -d

# Parar
docker compose -f docker-compose.swagger.yml down

# Ver logs
docker compose -f docker-compose.swagger.yml logs -f swagger-ui
```

## Acesso

Após iniciar, abra no navegador:

```
🌐 http://localhost:8080
```

### URLs Diretas por Serviço

- **Community:** http://localhost:8080?url=/api/openapi-community.yaml
- **Marketplace:** http://localhost:8080?url=/api/openapi-marketplace.yaml
- **Academy:** http://localhost:8080?url=/api/openapi-academy.yaml
- **Business:** http://localhost:8080?url=/api/openapi-business.yaml

## Componentes

### docker-compose.swagger.yml

Define dois containers:

#### `swagger-ui`
- **Imagem:** `swaggerapi/swagger-ui:latest`
- **Porto:** 8080
- **Função:** Interface gráfica para testar endpoints
- **Volumes:** Monta todos os ficheiros OpenAPI YAML

#### `swagger-api-server`
- **Imagem:** `nginx:alpine`
- **Porto:** 8081
- **Função:** Serve os ficheiros YAML com CORS headers
- **Volumes:** Configuração nginx customizada

### Ficheiros de Configuração

#### `nginx.conf`
Configuração do nginx que:
- Serve os ficheiros OpenAPI com CORS headers
- Ativa compressão gzip
- Implementa cache strategy
- Health check endpoints

#### `index.html`
Interface customizada do Swagger UI com:
- Seletor de serviços (dropdown)
- Input para JWT token
- Persistência de autenticação (localStorage)
- Styling customizado (tema iaMenu)
- Topbar com links úteis

#### `swagger-config.json`
Configuração padrão do Swagger UI (não utilizado, mas disponível para referência).

## Funcionalidades

### Seletor de Serviços
Dropdown na página principal para alternar entre as 4 APIs sem recarregar.

### Autenticação JWT
Campo de input para colar JWT token:
- Salva em `localStorage`
- Aplicado automaticamente a requests autenticados
- Persiste ao mudar entre serviços
- Keyboard shortcut: `Alt+A`

### Documentação Completa
Cada endpoint inclui:
- Descrição e operationId
- Parâmetros com validação
- Request/response schemas
- Exemplos de respostas
- Status codes esperados

### Testing Interativo
- Execute requests diretamente da UI
- Veja requests/responses em tempo real
- Copie cURL commands
- Teste com seus próprios dados

## Exemplos de Uso

### 1. Listar Posts (Public)

1. Abra http://localhost:8080
2. Selecione "Community API"
3. Procure "List all posts"
4. Clique "Try it out"
5. Clique "Execute"
6. Veja a resposta JSON

### 2. Criar Post (Autenticado)

1. Abra http://localhost:8080
2. Selecione "Community API"
3. Cole seu JWT token no campo "Autenticação"
4. Procure "Create new post"
5. Clique "Try it out"
6. Preencha:
   ```json
   {
     "title": "Meu primeiro post",
     "body": "Conteúdo do post com mais de 10 caracteres",
     "category": "gestão"
   }
   ```
7. Clique "Execute"
8. Código 201 = sucesso!

### 3. Teste com cURL (copiado do Swagger)

```bash
curl -X POST "http://localhost:3001/api/v1/community/posts" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{"title":"Teste","body":"Conteúdo de teste"}'
```

## Troubleshooting

### Porta 8080 já em uso

```bash
# Ver qual processo usa porta 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Mudar porta no docker-compose.swagger.yml
# Altere "8080:8080" para "8090:8080"
# Depois: docker compose -f docker-compose.swagger.yml up -d
```

### CORS error ao testar

Verifique se:
1. `swagger-api-server` está rodando (porto 8081)
2. Os ficheiros YAML estão em `docs/api/`
3. Nginx tem CORS headers (veja `nginx.conf`)

### Swagger UI não carrega

```bash
# Ver logs detalhados
docker compose -f docker-compose.swagger.yml logs swagger-ui

# Reiniciar container
docker compose -f docker-compose.swagger.yml restart swagger-ui
```

### JWT token não funciona

1. Verifique se o token é válido
2. Confirme que o token começou com "eyJ"
3. Cole completamente (sem espacos)
4. Tente `Alt+A` para focar no input
5. Clique botão "Definir Token"

## Variáveis de Ambiente

Edite `docker-compose.swagger.yml` para customizar:

```yaml
environment:
  SWAGGER_JSON: /specs/openapi-base.yaml  # Spec inicial
  SWAGGER_JSON_URL: http://localhost:8080/api/openapi-base.yaml
```

## Network

Os containers rodam na rede `iamenu`:

```bash
# Ver rede
docker network ls | grep iamenu

# Inspecionar rede
docker network inspect iamenu
```

## Volumes

Todos os volumes são read-only (`:ro`) para segurança:

```yaml
volumes:
  - ./docs/api/openapi-community.yaml:/specs/openapi-community.yaml:ro
```

## Health Checks

Ambos os containers têm health checks:

```bash
# Ver health status
docker compose -f docker-compose.swagger.yml ps

# Exemplo output:
# STATUS: Up 2 minutes (healthy)
```

## Performance

### Caching

- YAML files: 1 hora
- HTML/CSS/JS: 1 dia
- Health check: 10 segundos

### Compressão

- Gzip ativado para:
  - JSON, YAML, HTML
  - Reduz tamanho em ~70%

## Segurança

### Read-only volumes
- Specs não podem ser modificados via container
- Configuração protegida

### CORS restrito
- Apenas métodos GET, OPTIONS
- Headers validados
- Preflight requests em 204

### Health checks
- Monitora disponibilidade
- Reinicia automaticamente se falhar

## Extensões Futuras

- [ ] Swagger UI theme customizado
- [ ] Mock server (Prism)
- [ ] API change notifications
- [ ] Analytics dashboard
- [ ] Performance metrics

## Roadmap (Fase E+)

1. **Prism Mock Server** - Simulate APIs localmente
2. **API Change Detection** - GitHub Actions workflow
3. **SDK Generation** - OpenAPI Generator integration
4. **API Analytics** - Track usage patterns
5. **Deprecation Warnings** - Highlight deprecated endpoints

## Links Úteis

- [Swagger UI Docs](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- [iaMenu API Docs](../README.md)
- [Docker Compose Docs](https://docs.docker.com/compose/)

## Support

Para problemas ou sugestões:

1. Verifique logs: `./scripts/swagger.sh logs`
2. Verific docker setup: `docker compose -f docker-compose.swagger.yml ps`
3. Abra issue no GitHub

---

**Last Updated:** 2026-02-10
**Status:** ✅ Production Ready
**Maintainer:** AIOS (@architect)
