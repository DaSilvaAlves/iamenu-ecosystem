# HANDOFF COMPLETO - Sessão 2026-02-23

## INSTRUÇÕES PARA A NOVA SESSÃO

**Cola este documento inteiro como primeira mensagem na nova janela do Claude Code.**

Depois escreve exactamente:

```
Lê o handoff acima. Activa /AIOS:agents:dev e continua a Fase 1, tarefa actual:
Migrar os 61 ficheiros .jsx restantes para .tsx no frontend (TECH-DEBT-002.1).
Depois da migração TS, continua com as restantes tarefas da Fase 1 e Fases 2-4 do Cenário C.
```

---

## 1. O QUE É ESTE PROJECTO

**iaMenu Ecosystem** — Plataforma para restaurantes portugueses com 4 serviços backend (Node.js/Express/Prisma/PostgreSQL) + 1 frontend (React 18 + Vite).

| Serviço | Port Local | Produção Railway |
|---------|-----------|-----------------|
| Community | 3001 | iamenucommunity-api-production.up.railway.app ✅ |
| Marketplace | 3002 | iamenumarketplace-api-production.up.railway.app ✅ |
| Academy | 3003 | iamenuacademy-api-production.up.railway.app ❌ 502 |
| Business | 3004 | iamenubusiness-api-production.up.railway.app ❌ 502 |
| Frontend | 5173 | prototype-vision.vercel.app ✅ |

**Repo:** github.com/DaSilvaAlves/iamenu-ecosystem (público, branch protection activa em main)

---

## 2. PLANO GLOBAL: CENÁRIO C — PRODUTO PRONTO (~184h, 3-4 semanas)

Plano de 5 fases para terminar o projecto. Aprovado pelo user na sessão de hoje.

### Fase 0: Estabilização ✅ COMPLETA
- CI build re-enabled, error handler order corrigido, suppliers refactored
- Repo tornado público, branch protection (Lint/Test/Build), CodeRabbit config
- Railway configs actualizados, requestId middleware, body-parser limits

### Fase 1: Completar Tech Debt 🟡 EM CURSO (~38h)
- **Concluído:** Error handling standardizado (4 serviços), requestId no business, body-parser no academy
- **EM CURSO:** Migração TypeScript frontend (61 .jsx → .tsx) ← RETOMAR AQUI
- **Pendente:** Marketplace multiSchema fix (3h), Test Coverage 85% (12h)

### Fase 2: Infraestrutura de Suporte (~34h)
- Story 3.8: Logging estruturado Winston JSON (8h)
- Story 3.1: Redis Caching layer (8h)
- Story 3.2: Database Query Optimization + indexes (6h)
- Story 3.3: API Rate Limiting com tiers (5h)
- Story 3.9: Monitoring e alertas Grafana (7h)

### Fase 3: Features Core (~46h)
- Story 3.4: Real-time Notifications via Socket.io + BullMQ (10h)
- Story 3.5: PostgreSQL Full-Text Search com GIN indexes (12h)
- Story 3.6: Stripe Payment Integration (14h) — CRITICAL PATH revenue
- Story 3.7: Analytics e Reporting DAU/MAU/revenue (10h)

### Fase 4: Admin + Quality (~60h)
- Story 3.10: Admin Dashboard com RBAC (12h)
- Soft Deletes em posts/comments/orders (12-15h)
- Audit Logging system (15h)
- Storybook deploy (3h)
- WCAG AA audit + fixes (10h)
- E2E tests Playwright (8h)

---

## 3. O QUE FOI FEITO NESTA SESSÃO (6 commits)

```
00877a5 docs: create handoff for session continuation - Fase 1 TS migration
5122e55 feat: standardize error handling across all 4 services [Story 2.4]
44de272 fix: add requestId middleware to business, body-parser limits to academy
9cae3df fix: add prisma migrate deploy to academy Railway build
9dc21be chore: configure GitHub DevOps infrastructure [Story 5.10]
9f4f631 fix: stabilize project - CI build, error handling, suppliers refactor, Railway configs
```

**Tudo pushed para origin/main. Working tree LIMPA. Nada pendente.**

### Detalhe das alterações:

**Commit 9f4f631 — Estabilização:**
- `.github/workflows/ci.yml` — Re-enabled build job, removidos TODOs obsoletos
- `docker-compose.yml` — PostgreSQL port 5432→5433 (evitar conflito local)
- `services/business/src/app.ts` — Corrigida ordem 404/errorHandler (404 era unreachable)
- `services/marketplace/src/` — Suppliers refactor com parseJsonArray(), deliveryZones, file upload
- `services/*/package.json` — Split prisma:migrate em migrate:deploy + migrate:dev
- `services/*/railway.json` — Adicionado prisma migrate deploy ao buildCommand
- `start-dev.bat` — PostgreSQL port actualizado

**Commit 9dc21be — DevOps Infrastructure:**
- `.coderabbit.yaml` — CodeRabbit config (balanced, pt-BR, path instructions)
- `.aios/devops-setup-report.yaml` — Setup report completo
- Repo tornado público via `gh repo edit --visibility public`
- Branch protection via GitHub API (required: Lint, Test, Build)

**Commit 9cae3df — Academy Railway fix:**
- `services/academy/railway.json` — Adicionado prisma migrate deploy

**Commit 44de272 — Quick fixes:**
- `services/business/src/app.ts` — Import + uso de requestIdMiddleware
- `services/academy/src/app.ts` — express.json({ limit: '10mb' })

**Commit 5122e55 — Error Handling Standardization:**
- `services/*/src/lib/errors.ts` — Ficheiro IDÊNTICO nos 4 serviços com:
  - ApiError (base), ValidationError, AuthenticationError, ForbiddenError, NotFoundError, ConflictError, RateLimitError
  - errorHandler middleware com requestId correlation
  - asyncHandler wrapper
  - Response format: `{status, error, message, requestId, timestamp, details}`
- `services/*/src/middleware/errorHandler.ts` — Re-exports de lib/errors.ts (backward compat, AppError alias)
- `services/business/src/middleware/errorHandler.ts` — CRIADO (não existia)
- `services/business/tests/health.test.ts` — Actualizado para novo formato 404

---

## 4. TAREFA ACTUAL: MIGRAR 61 .JSX → .TSX

**Story:** docs/stories/story-TECH-DEBT-002.1.md
**Task:** 2.1.2 (expansão) + 2.1.6 (finalização)

### O que já está migrado (.tsx — 30 ficheiros):
```
components/Button/    Button.tsx, Button.test.tsx, Button.stories.tsx
components/Card/      Card.tsx, Card.test.tsx, Card.stories.tsx
components/chat/      ChatWindow.tsx, ConversationList.tsx
components/Checkbox/  Checkbox.tsx, Checkbox.test.tsx, Checkbox.stories.tsx
components/Input/     Input.tsx, Input.test.tsx, Input.stories.tsx
components/Select/    Select.tsx, Select.test.tsx, Select.stories.tsx
components/ui/        Badge.tsx, Button.tsx, Card.tsx, Input.tsx, Loading.tsx, Modal.tsx
                      + test files + stories
```

### O que já está migrado (.ts — 18 ficheiros):
```
components/*/types.ts   (Button, Card, Checkbox, Input, Select + common.ts, index.ts)
components/tokens/      index.ts
config/                 api.ts
utils/                  DataManager.ts, GeminiService.ts, imageUtils.ts, devToken.ts, chatConstants.ts
```

### FICHEIROS .JSX A MIGRAR (61 total, ordenados por tamanho):

**TOP 10 maiores (prioridade — mais complexos):**
```
1825 linhas  views/DashboardBI.jsx          — Dashboard BI com charts Chart.js
1433 linhas  views/GroupDetailView.jsx       — Detalhe de grupo community
1062 linhas  views/CommunityView.jsx         — Feed principal community
1024 linhas  views/ProfilesTab.jsx           — Tab de perfis
1015 linhas  views/FoodCostView.jsx          — Calculadora food cost
 716 linhas  views/GroupsView.jsx            — Lista de grupos
 700 linhas  views/ProfileView.jsx           — Perfil individual
 625 linhas  views/OnboardingView.jsx        — Onboarding wizard
 601 linhas  views/SupplierDetail.jsx        — Detalhe supplier
 574 linhas  views/GastroLens.jsx            — AI gastro lens
```

**Root (2 ficheiros):**
```
 151 linhas  App.jsx                         — Root component com React Router
  37 linhas  main.jsx                        — Entry point
```

**Components (13 ficheiros):**
```
 413 linhas  components/Sidebar.jsx
 256 linhas  components/NotificationsPanel.jsx
 239 linhas  components/MentionInput.jsx
 208 linhas  components/MenuEngineeringMatrix.jsx
 175 linhas  components/PeakHoursHeatmap.jsx
 163 linhas  components/TopBar.jsx
 161 linhas  components/SalesTrendChart.jsx
 140 linhas  components/BenchmarkChart.jsx
 108 linhas  components/DemandForecastChart.jsx
  76 linhas  components/ErrorBoundary.jsx
  53 linhas  components/NotificationBadge.jsx
  42 linhas  components/TextRenderer.jsx
```

**Views (42 ficheiros):**
```
views/Academy.jsx, AlertsView.jsx, ChatView.jsx, CommunityView.jsx,
ComparisonTab.jsx, CopyStudioView.jsx, DashboardBI.jsx, FoodCostView.jsx,
GastroLens.jsx, GroupDetailView.jsx, GroupsView.jsx, HubsRegionaisView.jsx,
IncomingRfqTab.jsx, MarketingPlanner.jsx, Marketplace.jsx, OnboardingView.jsx,
OrdersView.jsx, PaymentsAutomationView.jsx, ProductsView.jsx, ProfilesTab.jsx,
ProfileView.jsx, ResponsesTab.jsx, RfqRequestsTab.jsx, RfqTab.jsx,
SearchView.jsx, StaffAIView.jsx, SupplierDetail.jsx, TakewayLandingView.jsx,
TokenLogin.jsx, TourRapidoView.jsx, UpgradePROView.jsx, VisaoEcossistemaView.jsx

views/hubs-regionais/ (4): CreatePostModal, HubFeed, HubFeedback, HubResources
views/reputacao-online/ (5): AlertSettings, Dashboard, Inbox, ReviewCard, ReviewDetail
views/staff-ai/ (5): StaffAnnouncements, StaffDashboard, StaffOnboarding, StaffSchedule, StaffTeam
```

### Abordagem recomendada para a migração:

```
PASSO 1: Renomear todos os .jsx → .tsx em batch (git mv)
PASSO 2: Correr build (npx tsc --noEmit ou npm run build) — vai dar MUITOS erros
PASSO 3: Corrigir erros por directório:
  a) main.tsx + App.tsx (root, poucos erros)
  b) components/*.tsx (13 ficheiros, médio)
  c) views/*.tsx (42 ficheiros, bulk do trabalho)
PASSO 4: Para cada ficheiro:
  - Adicionar tipos aos props (interface XxxProps { ... })
  - Tipar event handlers (React.ChangeEvent, React.MouseEvent, etc.)
  - Tipar useState<T>, useRef<T>
  - Usar 'as any' APENAS como último recurso temporário
PASSO 5: Validar: tsc --noEmit zero errors + npm run build SUCCESS
PASSO 6: Commit
```

### Configuração TypeScript (já configurada):
- `tsconfig.json` com strict: true, noImplicitAny: true
- Vite já suporta .tsx
- `allowJs` NÃO está no tsconfig (apenas "include": ["src"])
- Framework: React 18.2.0, TypeScript 5.9.3, Vite 5.2.0

### Dependências que os .jsx usam (para saber os tipos necessários):
- `react-router-dom` v7 (useNavigate, useParams, useSearchParams, Link)
- `framer-motion` v11 (motion.div, AnimatePresence)
- `chart.js` + `react-chartjs-2` (Line, Bar, Doughnut, Radar)
- `axios` (API calls)
- `react-hot-toast` (toast notifications)
- `lucide-react` (icons)
- `date-fns` (date formatting)
- `jspdf` + `jspdf-autotable` (PDF generation)
- `zustand` v5 (state stores)
- Custom hooks em `src/lib/stores/` e `src/services/`

---

## 5. TAREFAS RESTANTES APÓS A MIGRAÇÃO TS

### Fase 1 restante (após TS migration):

**1.7 — Marketplace multiSchema fix (3h):**
- `services/marketplace/prisma/schema.prisma` não tem `previewFeatures = ["multiSchema"]` nem `@@schema("marketplace")`
- Tabelas vão para schema `public` em vez de `marketplace`
- Precisa: adicionar multiSchema, anotar todos os 10 modelos, criar migration

**1.4 — Test Coverage expansion para 85% (12h):**
- Backend actual: ~40% cobertura estimada
- Frontend: testes existem para design system components mas `@testing-library/dom` NÃO está instalado
- Fix frontend: `npm install --save-dev @testing-library/dom` no workspace do frontend
- Adicionar testes para: controllers, services, middleware de cada serviço

### Depois da Fase 1 → Fases 2, 3, 4 (ver secção 2 acima)

---

## 6. BUGS E PROBLEMAS CONHECIDOS

| # | Bug | Severidade | Serviço | Nota |
|---|-----|-----------|---------|------|
| 1 | Academy 502 em produção | HIGH | academy | User a investigar Railway dashboard |
| 2 | Business 502 em produção | HIGH | business | User a investigar Railway dashboard |
| 3 | Frontend tests falham (`@testing-library/dom` missing) | MEDIUM | frontend | Pré-existente, fix: `npm install -D @testing-library/dom` |
| 4 | Business RLS test falha | LOW | business | Precisa DB com RLS policies, pré-existente |
| 5 | 497 ESLint warnings | LOW | all | Maioria `@typescript-eslint/no-explicit-any` |
| 6 | Marketplace sem multiSchema | MEDIUM | marketplace | Tabelas no schema `public` em vez de `marketplace` |
| 7 | CodeRabbit GitHub App não instalado | LOW | infra | User precisa instalar: github.com/apps/coderabbitai |
| 8 | SENTRY_DSN não configurado | LOW | all | User sem conta Sentry.io |
| 9 | CODECOV_TOKEN não configurado | LOW | CI | User sem conta Codecov.io |

---

## 7. ESTRUTURA DO PROJECTO (referência rápida)

```
iamenu-ecosystem/
├── services/
│   ├── community/     (port 3001) — Posts, Groups, Followers, Gamification, Socket.io
│   ├── marketplace/   (port 3002) — Suppliers, Reviews, RFQ, Products
│   ├── academy/       (port 3003) — Courses, Modules, Lessons, Certificates
│   ├── business/      (port 3004) — Dashboard BI, Onboarding, Analytics
│   └── takeway-proxy/ — External proxy
├── frontend/apps/prototype-vision/  (port 5173) — React 18 + Vite + Tailwind
├── .github/workflows/ — ci.yml, cd.yml, sync-aios-templates.yml
├── .coderabbit.yaml — CodeRabbit config
├── docker-compose.yml — PostgreSQL (port 5433)
└── docs/stories/ — 37 story files
```

### Padrão de cada serviço backend:
```
services/{name}/
├── src/
│   ├── controllers/  — Request handling
│   ├── services/     — Business logic
│   ├── routes/       — Express routes
│   ├── middleware/    — auth.ts, errorHandler.ts, requestId.ts, rls.ts
│   ├── lib/          — prisma.ts, logger.ts, errors.ts, cache.ts
│   └── index.ts      — Entry point (Sentry, server start)
├── prisma/schema.prisma
├── tests/
├── package.json
└── railway.json
```

### Padrão de error handling (STANDARD — mesmo nos 4 serviços):
```typescript
// lib/errors.ts — Classes
ApiError (base), ValidationError (400), AuthenticationError (401),
ForbiddenError (403), NotFoundError (404), ConflictError (409), RateLimitError (429)

// Response format
{ status: number, error: string, message: string, requestId?: string, timestamp: string, details?: object }

// middleware/errorHandler.ts — Re-exports de lib/errors.ts
export { ApiError, ApiError as AppError, ValidationError, ..., errorHandler, asyncHandler } from '../lib/errors';
```

---

## 8. COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev                    # Start all services + frontend
npm run dev:community          # Single service

# Database
docker compose up postgres -d  # PostgreSQL (port 5433)
cd services/<service> && npx dotenv -e ../../.env npx prisma studio

# Testing
npm test                       # All services
npm run test:community         # Single service
cd services/<service> && npx tsc --noEmit  # Typecheck

# Frontend
cd frontend/apps/prototype-vision && npm run build  # Build
cd frontend/apps/prototype-vision && npm run dev     # Dev server

# Lint
npm run lint:check             # Check only (no fix)
npm run lint                   # Auto-fix

# Git (via @devops APENAS para push)
git status && git diff --stat  # Check state
```

---

## 9. AGENTES AIOS — QUEM FAZ O QUÊ

| Agente | Skill | Responsabilidade | Quando usar |
|--------|-------|-----------------|-------------|
| **@dev (Dex)** | `/AIOS:agents:dev` | Implementação de código, refactoring, testes | Migração TS, features, bug fixes |
| **@devops (Gage)** | `/AIOS:agents:devops` | Git push, PRs, CI/CD, Railway, GitHub config | Push, deploy, release, secrets |
| **@qa (Quinn)** | `/AIOS:agents:qa` | Code review, test validation | Review antes de merge |
| **@architect (Aria)** | `/AIOS:agents:architect` | Design decisions, ADRs | Decisões arquiteturais |

**REGRA:** @dev NÃO pode fazer git push. Apenas @devops pode.

---

## 10. SECRETS E ACESSOS

| Secret | Onde | Estado |
|--------|------|--------|
| RAILWAY_TOKEN | GitHub Secrets | ✅ Configurado |
| GitHub CLI | Local (keyring) | ✅ DaSilvaAlves autenticado |
| Railway CLI | Local | ✅ euricojsalves@gmail.com |
| SENTRY_DSN | Não configurado | ⬜ User sem conta |
| CODECOV_TOKEN | Não configurado | ⬜ User sem conta |

---

**FIM DO HANDOFF — Sessão 2026-02-23**
**Criado por:** Dex (@dev) + Gage (@devops)
**Working tree:** LIMPA (tudo commitado e pushed)
**Branch:** main
**Último commit:** 00877a5
