# Sprint Backlog - iaMenu Ecosystem
## 90 Dias | 3 Sprints | Janeiro - Abril 2026

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Sprints** | 3 |
| **Total Duration** | 7 semanas |
| **Total Story Points** | 144 pts |
| **Current Completion** | 54% |
| **Target Completion** | 95% |

---

# SPRINT 1: Backend Feature Complete
**Duração:** 2 semanas (10 dias úteis)
**Story Points:** 55 pts
**Objetivo:** Completar todas as APIs backend e atingir 70%+ test coverage

---

## Epic 1.1: Critical Fixes (13 pts)
> Resolver bloqueadores que impedem o desenvolvimento

### US-1.1.1: Business API Database Schema
**Story Points:** 5 | **Prioridade:** P0-Critical | **Owner:** Backend Dev

**User Story:**
> Como developer, preciso de um schema Prisma para o Business API para que os dados sejam persistidos em vez de mock data.

**Tasks:**
- [ ] Criar `services/business/prisma/schema.prisma`
- [ ] Definir modelos: Restaurant, Dashboard, MenuAnalysis, SalesTrend, Alert
- [ ] Configurar multi-schema PostgreSQL (`schema = "business"`)
- [ ] Executar `npx prisma migrate dev --name init`
- [ ] Gerar Prisma Client
- [ ] Criar seed data para testes

**Acceptance Criteria:**
```gherkin
GIVEN Business API service
WHEN I run prisma migrate
THEN schema "business" is created with all tables
AND Prisma Client is generated without errors
```

**Schema Proposto:**
```prisma
model Restaurant {
  id              String   @id @default(cuid())
  name            String
  cnpj            String   @unique
  segment         String
  seats           Int
  monthlyRevenue  Decimal
  createdAt       DateTime @default(now())
  dashboards      Dashboard[]
}

model Dashboard {
  id            String   @id @default(cuid())
  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id])
  salesData     Json
  alertsData    Json
  forecastData  Json
  updatedAt     DateTime @updatedAt
}
```

---

### US-1.1.2: Prisma Client Generation Pipeline
**Story Points:** 3 | **Prioridade:** P0-Critical | **Owner:** Backend Dev

**User Story:**
> Como developer, preciso que todos os Prisma Clients sejam gerados automaticamente para evitar erros 500.

**Tasks:**
- [ ] Criar script `scripts/generate-prisma.sh`
- [ ] Adicionar npm script: `"prisma:generate": "npm run prisma:generate --workspaces"`
- [ ] Verificar cada serviço: Community, Marketplace, Academy, Business
- [ ] Documentar processo no README

**Acceptance Criteria:**
```gherkin
GIVEN all 4 Node.js services
WHEN I run npm run prisma:generate from root
THEN all Prisma Clients are generated
AND no service returns 500 errors on startup
```

---

### US-1.1.3: Port Mapping Standardization
**Story Points:** 2 | **Prioridade:** P1-High | **Owner:** DevOps

**User Story:**
> Como developer, preciso de port mappings consistentes entre docker-compose e código para evitar conflitos.

**Tasks:**
- [ ] Definir standard: Community=3001, Marketplace=3002, Academy=3003, Business=3004
- [ ] Atualizar `docker-compose.yml`
- [ ] Atualizar cada `.env.example`
- [ ] Atualizar `README.md` principal
- [ ] Verificar CORS origins em cada serviço

**Acceptance Criteria:**
```gherkin
GIVEN docker-compose.yml AND all .env files
WHEN I compare port configurations
THEN all ports match the standard mapping
AND services start without port conflicts
```

---

### US-1.1.4: JWT Refresh Token Implementation
**Story Points:** 3 | **Prioridade:** P1-High | **Owner:** Backend Dev

**User Story:**
> Como utilizador, preciso de refresh tokens para manter sessão ativa sem re-login constante.

**Tasks:**
- [ ] Criar middleware `refreshToken.ts` em shared utils
- [ ] Implementar endpoint `POST /api/v1/auth/refresh`
- [ ] Definir TTL: Access Token = 15min, Refresh Token = 7 dias
- [ ] Armazenar refresh tokens em database (não localStorage)
- [ ] Implementar logout que invalida refresh token

**Acceptance Criteria:**
```gherkin
GIVEN an expired access token AND valid refresh token
WHEN I call POST /api/v1/auth/refresh
THEN I receive a new access token
AND the old refresh token is invalidated (rotation)
```

---

## Epic 1.2: Community API Completion (12 pts)
> Completar features de gamification e moderation

### US-1.2.1: Gamification System Enhancement
**Story Points:** 5 | **Prioridade:** P2-Medium | **Owner:** Backend Dev

**User Story:**
> Como membro da comunidade, quero ganhar badges e pontos por participação para me sentir motivado.

**Endpoints Existentes:** `/api/v1/community/gamification`

**Tasks:**
- [ ] Implementar sistema de pontos:
  - Post criado: +10 pts
  - Comentário: +5 pts
  - Reação recebida: +2 pts
  - Post destacado: +50 pts
- [ ] Criar badges:
  - "Primeiro Post" - 1º post criado
  - "Contribuidor Ativo" - 10 posts
  - "Mentor" - 50 respostas úteis
  - "Chef Expert" - 100 interações
- [ ] Implementar leaderboard semanal/mensal
- [ ] Criar notificações de conquista

**Acceptance Criteria:**
```gherkin
GIVEN a user who creates a post
WHEN the post is published
THEN user gains 10 points
AND if it's their first post, they earn "Primeiro Post" badge
AND they receive a notification
```

---

### US-1.2.2: Moderation Queue System
**Story Points:** 4 | **Prioridade:** P2-Medium | **Owner:** Backend Dev

**User Story:**
> Como moderador, preciso de uma fila de reports para revisar conteúdo reportado eficientemente.

**Endpoints Existentes:** `/api/v1/community/moderation`

**Tasks:**
- [ ] Implementar fila de moderação com estados: pending, reviewing, resolved, dismissed
- [ ] Adicionar bulk actions: approve/reject múltiplos
- [ ] Criar auto-moderation para spam (links suspeitos, palavras proibidas)
- [ ] Implementar shadowban para reincidentes
- [ ] Log de ações de moderação (audit trail)

**Acceptance Criteria:**
```gherkin
GIVEN 10 pending reports in moderation queue
WHEN moderator selects 5 and clicks "Approve All"
THEN all 5 posts are approved
AND audit log records moderator ID and timestamp
```

---

### US-1.2.3: Real-time Notifications via WebSocket
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** Backend Dev

**User Story:**
> Como utilizador, quero receber notificações em tempo real sem refresh da página.

**Tasks:**
- [ ] Instalar Socket.io no Community API
- [ ] Criar namespace `/notifications`
- [ ] Emitir eventos: new_comment, new_reaction, new_follower, badge_earned
- [ ] Implementar room por userId para notificações privadas
- [ ] Criar fallback polling para browsers sem WebSocket

**Acceptance Criteria:**
```gherkin
GIVEN user A is connected via WebSocket
WHEN user B comments on user A's post
THEN user A receives real-time notification within 500ms
AND notification count badge updates automatically
```

---

## Epic 1.3: Business API Real Data (15 pts)
> Substituir mock data por dados reais do database

### US-1.3.1: Dashboard Stats from Real Data
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** Backend Dev

**User Story:**
> Como dono de restaurante, quero ver estatísticas reais do meu negócio no dashboard.

**Endpoints Afetados:**
- `GET /api/v1/business/dashboard/stats`
- `GET /api/v1/business/dashboard/top-products`
- `GET /api/v1/business/dashboard/sales-trends`

**Tasks:**
- [ ] Criar service layer `DashboardService.ts`
- [ ] Implementar queries Prisma para:
  - Total vendas (período)
  - Ticket médio
  - Produtos mais vendidos
  - Tendência de vendas (7/30/90 dias)
- [ ] Criar agregações por período (dia/semana/mês)
- [ ] Implementar cache com TTL de 5 minutos

**Acceptance Criteria:**
```gherkin
GIVEN restaurant with 100 orders in database
WHEN I call GET /dashboard/stats
THEN response contains real calculated metrics
AND response time is < 200ms (cached)
```

---

### US-1.3.2: AI-Powered Demand Forecast
**Story Points:** 5 | **Prioridade:** P2-Medium | **Owner:** Backend Dev + ML

**User Story:**
> Como dono de restaurante, quero previsões de demanda baseadas em dados históricos para gerir stock.

**Endpoint:** `GET /api/v1/business/dashboard/demand-forecast`

**Tasks:**
- [ ] Coletar dados históricos: vendas, dia da semana, feriados, clima
- [ ] Implementar modelo de previsão (Prophet ou ARIMA via OpenAI)
- [ ] Criar endpoint com previsão 7-14 dias
- [ ] Adicionar confidence interval
- [ ] Visualização de accuracy (MAE, MAPE)

**Acceptance Criteria:**
```gherkin
GIVEN 90 days of historical sales data
WHEN I call GET /dashboard/demand-forecast
THEN I receive 14-day forecast with confidence intervals
AND forecast accuracy is displayed (e.g., "85% accurate")
```

---

### US-1.3.3: Menu Engineering Matrix
**Story Points:** 5 | **Prioridade:** P2-Medium | **Owner:** Backend Dev

**User Story:**
> Como dono de restaurante, quero classificar produtos por popularidade e rentabilidade.

**Endpoint:** `GET /api/v1/business/dashboard/menu-engineering`

**Tasks:**
- [ ] Implementar classificação BCG:
  - Stars: Alta popularidade, alta margem
  - Plowhorses: Alta popularidade, baixa margem
  - Puzzles: Baixa popularidade, alta margem
  - Dogs: Baixa popularidade, baixa margem
- [ ] Calcular métricas por produto
- [ ] Sugerir ações (promover, remover, ajustar preço)
- [ ] Visualização matrix 2x2

**Acceptance Criteria:**
```gherkin
GIVEN menu with 20 products and sales data
WHEN I call GET /dashboard/menu-engineering
THEN each product is classified in one quadrant
AND suggestions are provided for each category
```

---

## Epic 1.4: Academy API Completion (8 pts)
> Implementar tracking de progresso e video player

### US-1.4.1: Lesson Progress Tracking
**Story Points:** 3 | **Prioridade:** P1-High | **Owner:** Backend Dev

**User Story:**
> Como aluno, quero que meu progresso seja salvo para continuar de onde parei.

**Tasks:**
- [ ] Adicionar modelo `LessonProgress` ao schema
- [ ] Criar endpoint `POST /api/v1/academy/lessons/:id/progress`
- [ ] Salvar: lessonId, userId, percentWatched, completedAt
- [ ] Calcular progresso do curso (% módulos completos)
- [ ] Trigger certificado quando curso 100% completo

**Schema Addition:**
```prisma
model LessonProgress {
  id            String   @id @default(cuid())
  lessonId      String
  lesson        Lesson   @relation(fields: [lessonId], references: [id])
  userId        String
  percentWatched Int     @default(0)
  completedAt   DateTime?
  updatedAt     DateTime @updatedAt

  @@unique([lessonId, userId])
}
```

**Acceptance Criteria:**
```gherkin
GIVEN user watching lesson at 75%
WHEN user closes browser and returns
THEN video resumes at 75%
AND course progress shows updated percentage
```

---

### US-1.4.2: Video Player Integration
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** Frontend Dev

**User Story:**
> Como aluno, quero assistir vídeos com player responsivo e controles avançados.

**Tasks:**
- [ ] Integrar Video.js ou Plyr player
- [ ] Suportar Vimeo e YouTube embeds
- [ ] Implementar playback speed control (0.5x - 2x)
- [ ] Adicionar keyboard shortcuts (space=pause, arrows=seek)
- [ ] Tracking de watch time para analytics

**Acceptance Criteria:**
```gherkin
GIVEN a lesson with Vimeo video
WHEN I open the lesson page
THEN video loads with custom player
AND I can change playback speed
AND progress is tracked every 30 seconds
```

---

### US-1.4.3: Certificate Verification
**Story Points:** 2 | **Prioridade:** P3-Low | **Owner:** Backend Dev

**User Story:**
> Como empregador, quero verificar se um certificado é válido.

**Endpoint:** `GET /api/v1/academy/certificates/verify/:code`

**Tasks:**
- [ ] Implementar endpoint público de verificação
- [ ] Retornar: nome do curso, data, nome do aluno
- [ ] Gerar QR code no certificado PDF
- [ ] Rate limiting para prevenir brute force

**Acceptance Criteria:**
```gherkin
GIVEN a valid certificate code "CERT-ABC123"
WHEN I call GET /certificates/verify/CERT-ABC123
THEN I receive certificate details
AND response does not require authentication
```

---

## Epic 1.5: Test Coverage (7 pts)
> Atingir 70%+ coverage em todos os serviços

### US-1.5.1: Unit Tests Foundation
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** QA/Backend

**User Story:**
> Como developer, preciso de test suite completo para garantir qualidade do código.

**Tasks:**
- [ ] Configurar Jest com TypeScript em todos os serviços
- [ ] Criar test utilities: mock Prisma, mock JWT
- [ ] Implementar testes para:
  - [ ] Community: Posts CRUD, Comments, Reactions (20 tests)
  - [ ] Marketplace: Suppliers CRUD, Reviews (15 tests)
  - [ ] Academy: Courses, Enrollments, Certificates (15 tests)
  - [ ] Business: Dashboard, Onboarding (10 tests)
- [ ] Configurar coverage threshold: 70%

**Test Structure:**
```
services/community/tests/
├── unit/
│   ├── posts.test.ts
│   ├── comments.test.ts
│   └── gamification.test.ts
├── integration/
│   └── api.test.ts
└── setup.ts
```

**Acceptance Criteria:**
```gherkin
GIVEN all test files created
WHEN I run npm test
THEN all tests pass
AND coverage report shows >= 70%
```

---

### US-1.5.2: Integration Tests
**Story Points:** 2 | **Prioridade:** P2-Medium | **Owner:** QA

**User Story:**
> Como developer, preciso de testes de integração para validar fluxos completos.

**Tasks:**
- [ ] Criar test database separado
- [ ] Implementar testes de fluxo:
  - User cria post -> recebe notificação -> ganha pontos
  - User inscreve em curso -> completa -> recebe certificado
  - Supplier recebe review -> rating atualiza
- [ ] Usar Supertest para HTTP assertions

**Acceptance Criteria:**
```gherkin
GIVEN integration test environment
WHEN I run npm run test:integration
THEN all cross-service flows are validated
AND database is reset between tests
```

---

# SPRINT 2: Frontend Integration
**Duração:** 3 semanas (15 dias úteis)
**Story Points:** 52 pts
**Objetivo:** MVP React conectado a todas as APIs

---

## Epic 2.1: Frontend Architecture (15 pts)

### US-2.1.1: API Client Configuration
**Story Points:** 3 | **Prioridade:** P0-Critical | **Owner:** Frontend Dev

**User Story:**
> Como developer frontend, preciso de um cliente API centralizado para todas as chamadas.

**Tasks:**
- [ ] Criar `src/lib/api/client.ts` com Axios
- [ ] Configurar interceptors para JWT
- [ ] Implementar refresh token automático
- [ ] Criar hooks: `useApi`, `useMutation`
- [ ] Definir types para todas as responses

**Structure:**
```typescript
// src/lib/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(addAuthHeader);
apiClient.interceptors.response.use(handleSuccess, handleRefreshToken);

export const communityApi = {
  posts: {
    list: (params) => apiClient.get('/community/posts', { params }),
    create: (data) => apiClient.post('/community/posts', data),
    // ...
  }
};
```

**Acceptance Criteria:**
```gherkin
GIVEN frontend app
WHEN JWT expires during request
THEN refresh token is called automatically
AND original request is retried
AND user remains logged in
```

---

### US-2.1.2: State Management Setup
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**User Story:**
> Como developer, preciso de state management organizado para dados globais.

**Tasks:**
- [ ] Escolher: Zustand (recomendado) ou Redux Toolkit
- [ ] Criar stores:
  - `authStore`: user, tokens, login/logout
  - `uiStore`: theme, sidebar, modals
  - `notificationStore`: real-time notifications
- [ ] Implementar persistence (localStorage)
- [ ] Criar hooks: `useAuth`, `useUser`

**Acceptance Criteria:**
```gherkin
GIVEN user logged in
WHEN user refreshes page
THEN auth state is restored from localStorage
AND user remains authenticated
```

---

### US-2.1.3: Shared Component Library
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**User Story:**
> Como developer, preciso de componentes reutilizáveis para consistência visual.

**Tasks:**
- [ ] Criar `src/components/ui/`:
  - Button, Input, Select, Textarea
  - Card, Modal, Drawer
  - Table, Pagination
  - Avatar, Badge, Chip
  - Loading, Skeleton, Error
- [ ] Implementar variantes (primary, secondary, danger)
- [ ] Adicionar Storybook para documentação
- [ ] Garantir acessibilidade (ARIA)

**Acceptance Criteria:**
```gherkin
GIVEN shared components
WHEN I run Storybook
THEN all components are documented
AND variants are visible
AND accessibility tests pass
```

---

### US-2.1.4: Routing & Navigation
**Story Points:** 2 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**User Story:**
> Como utilizador, quero navegar entre módulos de forma intuitiva.

**Tasks:**
- [ ] Configurar React Router v6
- [ ] Implementar rotas:
  - `/` - Dashboard
  - `/community/*` - Feed, Groups, Profile
  - `/marketplace/*` - Suppliers, Products, Quotes
  - `/academy/*` - Courses, My Learning
  - `/business/*` - Analytics, Settings
- [ ] Criar ProtectedRoute component
- [ ] Implementar breadcrumbs

**Acceptance Criteria:**
```gherkin
GIVEN unauthenticated user
WHEN user tries to access /business
THEN user is redirected to /login
AND after login, redirected back to /business
```

---

## Epic 2.2: Community Module Frontend (12 pts)

### US-2.2.1: Feed & Posts
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**Tasks:**
- [ ] Feed infinito com virtual scroll
- [ ] Post card: avatar, content, images, reactions
- [ ] Create post modal com image upload
- [ ] Edit/Delete post (owner only)
- [ ] Reaction buttons com animations

**Acceptance Criteria:**
```gherkin
GIVEN community feed
WHEN I scroll down
THEN more posts load automatically
AND performance remains smooth (60fps)
```

---

### US-2.2.2: Comments & Interactions
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** Frontend Dev

**Tasks:**
- [ ] Comment thread com nested replies
- [ ] Inline reply form
- [ ] Reaction picker (emoji)
- [ ] Report button com modal

---

### US-2.2.3: Groups & Profiles
**Story Points:** 4 | **Prioridade:** P2-Medium | **Owner:** Frontend Dev

**Tasks:**
- [ ] Groups listing com search
- [ ] Group detail page
- [ ] User profile page
- [ ] Follow/Unfollow button
- [ ] Edit profile form

---

## Epic 2.3: Marketplace Module Frontend (10 pts)

### US-2.3.1: Supplier Directory
**Story Points:** 4 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**Tasks:**
- [ ] Supplier cards grid
- [ ] Advanced filters: category, location, rating
- [ ] Search com autocomplete
- [ ] Supplier detail page com reviews

---

### US-2.3.2: Quote System
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** Frontend Dev

**Tasks:**
- [ ] Request quote form
- [ ] My quotes list
- [ ] Quote detail com status timeline
- [ ] Accept/Reject quote actions

---

### US-2.3.3: Collective Bargains
**Story Points:** 3 | **Prioridade:** P3-Low | **Owner:** Frontend Dev

**Tasks:**
- [ ] Active bargains list
- [ ] Join bargain flow
- [ ] Progress bar (participants)
- [ ] Bargain detail page

---

## Epic 2.4: Academy Module Frontend (8 pts)

### US-2.4.1: Course Catalog
**Story Points:** 3 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**Tasks:**
- [ ] Course cards com thumbnails
- [ ] Filter by category, level
- [ ] Course detail page
- [ ] Enroll button flow

---

### US-2.4.2: Learning Experience
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**Tasks:**
- [ ] Video player integration
- [ ] Lesson sidebar navigation
- [ ] Progress indicators
- [ ] Mark as complete button
- [ ] Certificate download (PDF)

---

## Epic 2.5: Business Module Frontend (7 pts)

### US-2.5.1: Dashboard Analytics
**Story Points:** 4 | **Prioridade:** P1-High | **Owner:** Frontend Dev

**Tasks:**
- [ ] KPI cards (vendas, ticket médio)
- [ ] Sales trend chart (Chart.js)
- [ ] Top products table
- [ ] Alerts sidebar

---

### US-2.5.2: Menu Engineering Visualization
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** Frontend Dev

**Tasks:**
- [ ] 2x2 Matrix visualization
- [ ] Product dots com tooltips
- [ ] Quadrant labels
- [ ] Drill-down to product detail

---

# SPRINT 3: DevOps & Production
**Duração:** 2 semanas (10 dias úteis)
**Story Points:** 37 pts
**Objetivo:** Production-ready deployment com CI/CD

---

## Epic 3.1: CI/CD Pipeline (15 pts)

### US-3.1.1: GitHub Actions - Build & Test
**Story Points:** 5 | **Prioridade:** P0-Critical | **Owner:** DevOps

**User Story:**
> Como developer, quero CI automático para validar PRs antes de merge.

**Tasks:**
- [ ] Criar `.github/workflows/ci.yml`
- [ ] Jobs:
  - lint: ESLint + Prettier check
  - test: Jest com coverage
  - build: TypeScript compile
  - security: npm audit
- [ ] Branch protection: require CI pass
- [ ] Cache node_modules

**Workflow:**
```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
```

**Acceptance Criteria:**
```gherkin
GIVEN a pull request
WHEN CI runs
THEN lint, test, build jobs execute
AND PR shows status checks
AND merge is blocked if any fail
```

---

### US-3.1.2: GitHub Actions - Deploy
**Story Points:** 5 | **Prioridade:** P1-High | **Owner:** DevOps

**Tasks:**
- [ ] Criar `.github/workflows/deploy.yml`
- [ ] Deploy to Railway on merge to main
- [ ] Environment secrets management
- [ ] Slack notification on deploy

---

### US-3.1.3: Docker Optimization
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** DevOps

**Tasks:**
- [ ] Multi-stage Dockerfile
- [ ] Layer caching
- [ ] Image size < 200MB
- [ ] Health checks

---

### US-3.1.4: Database Migrations Pipeline
**Story Points:** 2 | **Prioridade:** P1-High | **Owner:** DevOps

**Tasks:**
- [ ] Prisma migrate in CI
- [ ] Backup before migration
- [ ] Rollback strategy

---

## Epic 3.2: Monitoring & Observability (12 pts)

### US-3.2.1: Error Tracking (Sentry)
**Story Points:** 3 | **Prioridade:** P0-Critical | **Owner:** DevOps

**Tasks:**
- [ ] Sentry project setup
- [ ] SDK integration (Node + React)
- [ ] Source maps upload
- [ ] Alert rules configuration

---

### US-3.2.2: Logging Infrastructure
**Story Points:** 3 | **Prioridade:** P1-High | **Owner:** DevOps

**Tasks:**
- [ ] Winston structured logging
- [ ] Log levels per environment
- [ ] Log aggregation (Papertrail/LogDNA)
- [ ] Request ID tracing

---

### US-3.2.3: Performance Monitoring
**Story Points:** 3 | **Prioridade:** P2-Medium | **Owner:** DevOps

**Tasks:**
- [ ] Response time tracking
- [ ] Database query monitoring
- [ ] Memory/CPU alerts
- [ ] Uptime monitoring (Better Uptime)

---

### US-3.2.4: Health Checks
**Story Points:** 3 | **Prioridade:** P1-High | **Owner:** Backend Dev

**Tasks:**
- [ ] `/health` endpoint em cada serviço
- [ ] Check database connection
- [ ] Check Redis (se aplicável)
- [ ] Kubernetes-ready probes

---

## Epic 3.3: Security Hardening (7 pts)

### US-3.3.1: Security Headers & CORS
**Story Points:** 2 | **Prioridade:** P1-High | **Owner:** Backend Dev

**Tasks:**
- [ ] Helmet.js configuration review
- [ ] CORS whitelist por environment
- [ ] Rate limiting em todas as rotas
- [ ] Input sanitization

---

### US-3.3.2: Secrets Management
**Story Points:** 3 | **Prioridade:** P0-Critical | **Owner:** DevOps

**Tasks:**
- [ ] Railway environment variables
- [ ] No secrets in code/commits
- [ ] Rotate JWT secret
- [ ] API key encryption

---

### US-3.3.3: API Security Audit
**Story Points:** 2 | **Prioridade:** P2-Medium | **Owner:** Security

**Tasks:**
- [ ] OWASP checklist review
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

---

## Epic 3.4: Production Readiness (3 pts)

### US-3.4.1: Documentation
**Story Points:** 2 | **Prioridade:** P2-Medium | **Owner:** Tech Lead

**Tasks:**
- [ ] API documentation (Swagger)
- [ ] Deployment runbook
- [ ] Troubleshooting guide
- [ ] Architecture diagrams

---

### US-3.4.2: Performance Testing
**Story Points:** 1 | **Prioridade:** P3-Low | **Owner:** QA

**Tasks:**
- [ ] k6 load tests
- [ ] Identify bottlenecks
- [ ] Optimization recommendations

---

# Definition of Done (DoD)

Uma user story só está "Done" quando:

- [ ] Código implementado e funcional
- [ ] Testes unitários escritos (coverage >= 70%)
- [ ] Code review aprovado (1 reviewer)
- [ ] CI pipeline passa
- [ ] Documentação atualizada (se aplicável)
- [ ] Deploy em staging sem erros
- [ ] QA validation (se crítico)

---

# Sprint Ceremonies

| Ceremony | Frequência | Duração | Participantes |
|----------|------------|---------|---------------|
| Daily Standup | Diário | 15 min | Todos |
| Sprint Planning | Início Sprint | 2h | Todos |
| Sprint Review | Fim Sprint | 1h | Todos + Stakeholders |
| Retrospective | Fim Sprint | 1h | Todos |
| Backlog Refinement | Semanal | 1h | PO + Devs |

---

# Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Core API (Java) delay | High | High | Parallel development, mock endpoints |
| Test coverage < 70% | Medium | Medium | Dedicated QA sprint time |
| Frontend complexity | Medium | Medium | Phased rollout, feature flags |
| Railway deploy issues | Low | High | Local Docker testing first |

---

# Metrics & KPIs

| Metric | Sprint 1 Target | Sprint 2 Target | Sprint 3 Target |
|--------|-----------------|-----------------|-----------------|
| Test Coverage | 70% | 75% | 80% |
| Build Time | < 5 min | < 5 min | < 3 min |
| Deploy Frequency | 2/week | 3/week | Daily |
| Bug Escape Rate | < 10% | < 5% | < 3% |
| Velocity | 55 pts | 52 pts | 37 pts |

---

# Appendix: Story Point Reference

| Points | Complexity | Example |
|--------|------------|---------|
| 1 | Trivial | Config change, typo fix |
| 2 | Simple | Add endpoint, small component |
| 3 | Medium | CRUD feature, form with validation |
| 5 | Complex | New module, integration |
| 8 | Very Complex | Major feature, architecture change |
| 13 | Epic-level | Full system, major refactor |

---

**Documento gerado por:** Morgan (PM Agent)
**Data:** 27 Janeiro 2026
**Versão:** 1.0
