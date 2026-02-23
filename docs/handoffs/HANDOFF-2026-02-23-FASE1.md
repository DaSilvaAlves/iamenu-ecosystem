# HANDOFF - Sessão 2026-02-23 - Cenário C: Produto Pronto

**Data:** 2026-02-23
**Contexto:** Plano de 5 fases para terminar o iaMenu Ecosystem (Cenário C ~184h)
**Estado:** Fase 1 em curso, activar @dev imediatamente

---

## ACÇÃO IMEDIATA NA NOVA SESSÃO

```
1. Cola este handoff inteiro como primeira mensagem
2. Activa @dev: /AIOS:agents:dev
3. Diz: "Continua a Fase 1 - Task 12: Migrar 61 ficheiros .jsx para .tsx"
```

---

## ESTADO ACTUAL DO PROJECTO

### Fase 0: COMPLETA ✅
Commits pushed para origin/main:
- `9f4f631` fix: stabilize project (CI build, error handling, suppliers refactor, Railway configs)
- `9dc21be` chore: configure GitHub DevOps infrastructure (repo público, branch protection, CodeRabbit)
- `9cae3df` fix: add prisma migrate deploy to academy Railway build
- `44de272` fix: add requestId middleware to business, body-parser limits to academy
- `5122e55` feat: standardize error handling across all 4 services [Story 2.4]

### Fase 1: EM CURSO 🟡

| # | Tarefa | Estado | Agente |
|---|--------|--------|--------|
| 1.8 | requestIdMiddleware no Business | ✅ DONE | @dev |
| 1.9 | body-parser limits no Academy | ✅ DONE | @dev |
| 1.3 | Error Handling standardization (4 serviços) | ✅ DONE | @dev |
| 1.1 | **TS Migration - Migrar 61 .jsx → .tsx** | 🟡 **NEXT** | @dev |
| 1.7 | Marketplace multiSchema fix | ⬜ PENDING | @dev |
| 1.4 | Test Coverage expansion 85% | ⬜ PENDING | @dev |
| 1.5 | INF-004: Sentry monitoring | ⬜ PENDING (user sem conta) | @devops |
| 1.6 | INF-006: Health Dashboard | 🟡 Academy/Business 502 | @devops |

### TAREFA ACTUAL → Migrar 61 .jsx para .tsx

**Story:** TECH-DEBT-002.1 (docs/stories/story-TECH-DEBT-002.1.md)
**O que já foi feito:** Tasks 2.1.1-2.1.5 completas (setup TS, 30 ficheiros .tsx criados, utilities migradas, config migrada, validação OK)
**O que falta:** 61 ficheiros .jsx no frontend/apps/prototype-vision/src/ precisam ser convertidos para .tsx

**Ficheiros .jsx a migrar (61 total):**
- `App.jsx`, `main.jsx` (root)
- `components/` (13 ficheiros): BenchmarkChart, DemandForecastChart, ErrorBoundary, MentionInput, MenuEngineeringMatrix, NotificationBadge, NotificationsPanel, PeakHoursHeatmap, SalesTrendChart, Sidebar, TextRenderer, TopBar
- `views/` (42 ficheiros): Academy, AlertsView, ChatView, CommunityView, ComparisonTab, CopyStudioView, DashboardBI, FoodCostView, GastroLens, GroupDetailView, GroupsView, HubsRegionaisView, IncomingRfqTab, MarketingPlanner, Marketplace, OnboardingView, OrdersView, PaymentsAutomationView, ProductsView, ProfilesTab, ProfileView, ResponsesTab, RfqRequestsTab, RfqTab, SearchView, StaffAIView, SupplierDetail, TakewayLandingView, TokenLogin, TourRapidoView, UpgradePROView, VisaoEcossistemaView
- `views/hubs-regionais/` (4): CreatePostModal, HubFeed, HubFeedback, HubResources
- `views/reputacao-online/` (5): AlertSettings, Dashboard, Inbox, ReviewCard, ReviewDetail
- `views/staff-ai/` (5): StaffAnnouncements, StaffDashboard, StaffOnboarding, StaffSchedule, StaffTeam

**Abordagem recomendada:**
1. Renomear todos os .jsx → .tsx em batch (git mv)
2. Correr tsc --noEmit para ver erros
3. Corrigir erros de tipo por directório (components/ primeiro, depois views/)
4. Validar build no final

---

## PLANO COMPLETO (Cenário C - 5 Fases)

### Fase 0: Estabilização ✅ DONE (6h)
### Fase 1: Completar Tech Debt 🟡 EM CURSO (~38h)
### Fase 2: Infraestrutura de Suporte (~34h)
- 3.8 Logging estruturado, 3.1 Redis Caching, 3.2 Query Optimization, 3.3 Rate Limiting, 3.9 Monitoring
### Fase 3: Features Core (~46h)
- 3.4 Notifications, 3.5 Search, 3.6 Payments (Stripe), 3.7 Analytics
### Fase 4: Admin + Quality (~60h)
- 3.10 Admin Dashboard, Soft Deletes, Audit Logging, Storybook, WCAG, E2E Tests

---

## CONFIGURAÇÕES JÁ FEITAS

| Item | Estado |
|------|--------|
| Repo público | ✅ github.com/DaSilvaAlves/iamenu-ecosystem |
| Branch protection (main) | ✅ Lint, Test, Build required |
| CodeRabbit (.coderabbit.yaml) | ✅ Criado (instalar GitHub App pendente) |
| RAILWAY_TOKEN | ✅ Configurado |
| CI build re-enabled | ✅ |
| Error handling standardizado | ✅ 4 serviços com ApiError + requestId |
| SENTRY_DSN | ⬜ User sem conta Sentry |
| CODECOV_TOKEN | ⬜ User sem conta Codecov |

## PRODUÇÃO

| Serviço | URL | Status |
|---------|-----|--------|
| Community | iamenucommunity-api-production.up.railway.app | ✅ 200 |
| Marketplace | iamenumarketplace-api-production.up.railway.app | ✅ 200 |
| Academy | iamenuacademy-api-production.up.railway.app | ❌ 502 (investigar) |
| Business | iamenubusiness-api-production.up.railway.app | ❌ 502 (investigar) |
| Frontend | prototype-vision.vercel.app | ✅ 200 |

## BUGS CONHECIDOS

1. **Frontend tests falham** - `@testing-library/dom` não instalado (pré-existente)
2. **Business RLS test** falha - precisa DB com RLS policies (pré-existente)
3. **Academy/Business 502** em produção - user a investigar Railway dashboard
4. **61 .jsx ficheiros** no frontend - migração TS incompleta (a resolver AGORA)

## COMMITS NÃO PUSHED (se houver)

Nenhum — tudo foi pushed para origin/main.

---

**Criado por:** Dex (@dev) + Gage (@devops) — Sessão 2026-02-23
