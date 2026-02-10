# Swagger UI Setup Guide

**Fase D.1: Docker Swagger UI Implementation**
**Data:** 2026-02-10
**Status:** ✅ Complete

## Quick Start

### Opção 1: NPM Scripts (Recomendado)

```bash
# Iniciar Swagger UI
npm run swagger:start

# Parar
npm run swagger:stop

# Ver logs
npm run swagger:logs

# Verificar status
npm run swagger:status
```

Depois abra: **http://localhost:8080** 🎉

### Opção 2: Docker Compose Direto

```bash
# Iniciar
docker compose -f docker-compose.swagger.yml up -d

# Parar
docker compose -f docker-compose.swagger.yml down

# Ver logs
docker compose -f docker-compose.swagger.yml logs -f swagger-ui
```

### Opção 3: Scripts Bash/PowerShell

**Linux/macOS:**
```bash
chmod +x scripts/swagger.sh
./scripts/swagger.sh start
```

**Windows (PowerShell):**
```powershell
.\scripts\swagger.ps1 -Command start
```

---

## Arquitetura

```
┌─────────────────────────────────────────────────┐
│         Seu Navegador (http://localhost:8080)   │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │         Swagger UI Container               │ │
│  │  - Interface gráfica para testar APIs      │ │
│  │  - Seletor de serviços (dropdown)          │ │
│  │  - JWT token input                         │ │
│  │  - Try it out functionality                │ │
│  │  swaggerapi/swagger-ui:latest              │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │      Nginx API Server (porta 8081)         │ │
│  │  - Serve OpenAPI specs (YAML files)        │ │
│  │  - Adiciona CORS headers                   │ │
│  │  - Compressão gzip                         │ │
│  │  nginx:alpine                              │ │
│  └────────────────────────────────────────────┘ │
│                  ↓                               │
└──────────────────┼──────────────────────────────┘
                   │
              ┌────┴────┐
              │          │
    ┌─────────▼──┐  ┌───▼──────────┐
    │ Community  │  │ Marketplace  │
    │   API      │  │    API       │
    │ :3001      │  │   :3002      │
    └────────────┘  └──────────────┘
              │          │
    ┌─────────▼──┐  ┌───▼──────────┐
    │  Academy   │  │  Business    │
    │   API      │  │    API       │
    │ :3003      │  │   :3004      │
    └────────────┘  └──────────────┘
```

---

## Ficheiros Criados

### Configuração Docker

#### `docker-compose.swagger.yml`
- Define 2 containers (Swagger UI + Nginx)
- Monta todos os ficheiros OpenAPI
- Configura health checks
- Define rede `iamenu`

#### `docker/swagger/nginx.conf`
- Servidor nginx para servir YAML files
- CORS headers configurados
- Compressão gzip
- Cache strategies

#### `docker/swagger/index.html`
- Interface customizada do Swagger UI
- Seletor dropdown para 4 APIs
- JWT token input com localStorage
- Styling tema iaMenu

#### `docker/swagger/swagger-config.json`
- Configuração padrão (referência)

### Scripts

#### `scripts/swagger.sh` (Bash)
```bash
./scripts/swagger.sh start|stop|restart|logs|status|clean|build
```

#### `scripts/swagger.ps1` (PowerShell)
```powershell
.\scripts\swagger.ps1 -Command start|stop|restart|logs|status|clean|build
```

### Documentação

#### `docker/swagger/README.md`
- Guia detalhado do Swagger UI
- Troubleshooting
- Exemplos de uso

#### Este ficheiro
- Setup guide
- Quick start
- Arquitetura

---

## Acesso

### URL Principal
```
http://localhost:8080
```

### URLs Diretas por Serviço

**Community (Posts, Grupos, Notificações):**
```
http://localhost:8080?url=/api/openapi-community.yaml
```

**Marketplace (Fornecedores, Quotes):**
```
http://localhost:8080?url=/api/openapi-marketplace.yaml
```

**Academy (Cursos, Certificados):**
```
http://localhost:8080?url=/api/openapi-academy.yaml
```

**Business (Dashboard, Analytics):**
```
http://localhost:8080?url=/api/openapi-business.yaml
```

---

## Recursos da Interface

### 1. Seletor de Serviços

Na página inicial, dropdown com as 4 APIs:
- Muda spec sem recarregar página
- Salva seleção na URL

### 2. Autenticação JWT

Campo "Autenticação" para colar token:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Features:**
- Salva em localStorage
- Aplica a todos os requests autenticados
- Persiste ao mudar APIs
- Atalho: `Alt+A`

### 3. Try It Out

Para cada endpoint:
1. Clique "Try it out"
2. Preencha parâmetros/body
3. Clique "Execute"
4. Veja response em tempo real

### 4. Copy cURL

Cada request gerado pode ser copiado como comando cURL:
```bash
curl -X GET "http://localhost:3001/api/v1/community/posts" \
  -H "accept: application/json"
```

---

## Exemplos de Uso

### Listar Posts (sem autenticação)

1. Abra http://localhost:8080
2. Selecione "Community API"
3. Procure endpoint `GET /posts`
4. Clique "Try it out"
5. Clique "Execute"
6. Veja JSON response

### Criar Post (com autenticação)

1. Cole seu JWT no campo "Autenticação"
2. Procure `POST /posts`
3. Clique "Try it out"
4. Body exemplo:
   ```json
   {
     "title": "Novo post",
     "body": "Conteúdo do post com mais de 10 caracteres",
     "category": "gestão"
   }
   ```
5. Clique "Execute"
6. Código 201 = sucesso!

---

## Troubleshooting

### Container não inicia

```bash
# Ver erro detalhado
docker compose -f docker-compose.swagger.yml logs swagger-ui

# Verificar se docker está rodando
docker ps

# Reiniciar Docker daemon
# macOS: Clique no Docker icon → Restart
# Windows: Services → Docker → Restart
```

### Porta 8080 em uso

```bash
# Ver processo que usa porta
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Parar processo ou mudar porta:
# Edite docker-compose.swagger.yml:
# "8090:8080" em vez de "8080:8080"
```

### Specs não carregam

Verifique:
1. Ficheiros existem em `docs/api/`
   ```bash
   ls -la docs/api/openapi-*.yaml
   ```

2. Nginx está rodando
   ```bash
   docker compose -f docker-compose.swagger.yml ps
   ```

3. CORS headers estão correctos
   ```bash
   curl -I http://localhost:8081/api/openapi-community.yaml
   ```

### JWT não funciona

1. Confirme token é válido (começa com `eyJ`)
2. Cole completamente (sem espaços)
3. Clique botão "Definir Token"
4. Tente Alt+A para focar input

---

## Requisitos

### Necessário
- Docker (versão 20.10+)
- Docker Compose (versão 1.29+)

### Verificar Instalação
```bash
docker --version
docker compose version
```

### Instalação

**macOS (Homebrew):**
```bash
brew install docker
brew install docker-compose
```

**Windows:**
- Instale Docker Desktop: https://www.docker.com/products/docker-desktop

**Linux (Ubuntu):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

---

## Performance

### Timings Típicos

| Operação | Tempo |
|----------|-------|
| Start container | 3-5s |
| Load Swagger UI | 2-3s |
| Load spec | 1-2s |
| Execute request | 500ms-2s |

### Recursos

- **RAM:** ~200MB por container
- **Disk:** ~500MB (images)
- **CPU:** Mínimo durante idle

---

## Segurança

### Proteções Implementadas

✅ Volumes read-only (specs não podem ser modificados)
✅ CORS restrito (apenas GET, OPTIONS)
✅ Health checks automáticos
✅ JWT token em localStorage (não em URL)
✅ No external network exposure (local only)

### Não Expor Publicamente

⚠️ **Aviso:** Swagger UI em produção requer autenticação

Para produção:
```yaml
# docker-compose.swagger.yml
ports:
  - "127.0.0.1:8080:8080"  # Apenas localhost
```

---

## Monitoramento

### Health Checks

Ambos containers têm health checks:

```bash
# Ver status
docker compose -f docker-compose.swagger.yml ps

# Exemplo:
# STATUS: Up 5 minutes (healthy)
```

### Logs

```bash
# Swagger UI
npm run swagger:logs

# Nginx
docker compose -f docker-compose.swagger.yml logs swagger-api-server

# Ambos com follow
docker compose -f docker-compose.swagger.yml logs -f
```

---

## Próximas Etapas (Fase D.2+)

### Imediatamente Após

1. **Prism Mock Server** (D.2)
   - Simular respostas das APIs
   - Testar sem back-end real

2. **SDK Generation** (D.3)
   - Cliente JavaScript/TypeScript
   - Cliente Python
   - Publish no NPM

3. **API Testing Suite** (D.4)
   - Testes de integração Jest
   - Coverage para todos endpoints
   - CI/CD pipeline

### Roadmap (E+)

- [ ] GraphQL schema alternativo
- [ ] API versioning strategy
- [ ] Deprecation warnings
- [ ] Analytics dashboard
- [ ] Rate limiting dashboard

---

## Comandos Rápidos

```bash
# Start everything
npm run dev & npm run swagger:start

# Stop everything
npm run swagger:stop

# Restart services
npm run swagger:restart

# Check health
npm run swagger:status

# View logs
npm run swagger:logs

# Clean up
npm run swagger:clean
```

---

## Links Úteis

- 📖 [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- 📋 [OpenAPI Specification](https://spec.openapis.org/)
- 🐳 [Docker Compose Docs](https://docs.docker.com/compose/)
- 📚 [iaMenu API Docs](docs/api/README.md)
- 🔗 [OpenAPI Index](docs/api/OPENAPI-INDEX.md)

---

## Suporte

### Verificação Básica

```bash
# 1. Docker rodando?
docker ps

# 2. Containers existem?
docker ps -a | grep swagger

# 3. Conectividade?
curl http://localhost:8080

# 4. Specs acessíveis?
curl http://localhost:8081/api/openapi-community.yaml
```

### Logs de Debug

```bash
# Detalhes do container
docker inspect iamenu-swagger-ui

# Network inspection
docker network inspect iamenu

# Volume inspection
docker volume ls
```

---

## Checklist Pós-Setup

- [ ] Docker está instalado
- [ ] `npm run swagger:start` funciona
- [ ] http://localhost:8080 abre
- [ ] Seletor de APIs funciona
- [ ] JWT token field está visível
- [ ] Consegue fazer GET /posts sem erro
- [ ] Network tab mostra requests

---

## Feedback

Se encontrar problemas:

1. **Veja logs:** `npm run swagger:logs`
2. **Tente reiniciar:** `npm run swagger:restart`
3. **Limpe e comece de novo:** `npm run swagger:clean && npm run swagger:start`
4. **Abra issue** com logs anexados

---

**Última atualização:** 2026-02-10
**Status:** ✅ Production Ready
**Próxima fase:** D.2 - Prism Mock Server
