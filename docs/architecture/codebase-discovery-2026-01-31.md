# Relatório de Descoberta do Codebase
## iaMenu Ecosystem - Análise de Arquitetura

**Data do Relatório:** 31 de Janeiro de 2026
**Âmbito da Análise:** Monorepo híbrido completo (Serviços Node.js + Frontend React)
**Estado:** Pronto para produção com desenvolvimento ativo

---

## 1. ARQUITETURA DE SERVIÇOS

### Visão Geral
O ecossistema iaMenu segue uma **arquitetura de microserviços** com 4 serviços Node.js independentes que partilham uma única base de dados PostgreSQL com schemas separados por serviço. Todos os serviços implementam os mesmos padrões arquiteturais (Express.js, Prisma ORM, autenticação JWT, tratamento de erros).

### Estrutura de Diretórios dos Serviços
```
services/
├── community/          # Porta 3001 - Hub da Comunidade
├── marketplace/        # Porta 3002 - Marketplace de Fornecedores
├── academy/            # Porta 3003 - Academia de Cursos
├── business/           # Porta 3004 - Business Intelligence
└── takeway-proxy/      # Serviço proxy (externo)
```

### Serviços Individuais

#### **Community API** (`@iamenu/community-api`)
- **Porta:** 3001
- **Responsabilidades:**
  - Fórum & Discussões (Posts, Comentários)
  - Gestão de Grupos & Membros
  - Perfis de Utilizadores & Seguidores
  - Notificações & Atualizações em tempo real (Socket.io)
  - Sistema de Gamificação (Pontos, Streaks, Badges)
  - Sistema de Moderação (Denúncias, Avisos, Bans)
  - Gestão de Refresh Tokens
- **Dependências Principais:** Express, Socket.io, Prisma, Multer (uploads), Winston (logging)
- **Base API:** `/api/v1/community`
- **Rotas:**
  - `/auth` - Autenticação & tokens de teste
  - `/posts` - CRUD + reações + comentários
  - `/groups` - Gestão de grupos + membros
  - `/profiles` - Perfis com upload de ficheiros
  - `/notifications` - Entrega de notificações
  - `/gamification` - Pontos, streaks, leaderboards
  - `/moderation` - Denúncias, avisos, bans
- **WebSocket:** Ativo na mesma porta para funcionalidades em tempo real
- **Características Únicas:** Único serviço com capacidades real-time (Socket.io)

#### **Marketplace API** (`@iamenu/marketplace-api`)
- **Porta:** 3002
- **Responsabilidades:**
  - Gestão de Fornecedores/Vendedores
  - Catálogo de Produtos
  - Reviews & Classificações
  - Sistema de Pedidos de Cotação (RFQ)
  - Negociação Coletiva
  - Histórico de Preços
  - Adesões a Negociações
- **Dependências Principais:** Express, Prisma, Multer (upload de imagens)
- **Base API:** `/api/v1/marketplace`
- **Rotas:**
  - `/suppliers` - CRUD de fornecedores + reviews aninhados
  - `/products` - Catálogo de produtos
  - `/collective-bargains` - Compras em grupo
  - `/quotes` - Gestão de RFQ & Cotações
  - `/reviews` - Reviews de produtos/fornecedores
- **Características Únicas:** Campos JSON complexos para itens de cotação

#### **Business Intelligence API** (`@iamenu/business-api`)
- **Porta:** 3004
- **Responsabilidades:**
  - Fluxo de onboarding de restaurantes
  - Dashboard & Analytics
  - Tracking de receitas & custos
  - Agregação de estatísticas diárias
  - Métricas de desempenho de produtos
  - Tracking de encomendas para analytics
- **Dependências Principais:** Express, Prisma, ExcelJS, XLSX (para imports)
- **Base API:** `/api/v1/business`
- **Rotas:**
  - `/onboarding` - Setup de restaurante em 4 passos
  - `/dashboard` - Analytics & métricas
- **Características Únicas:** Upload de ficheiros Excel, cache de stats diários pré-calculados

#### **Academy API** (`@iamenu/academy-api`)
- **Porta:** 3003
- **Responsabilidades:**
  - Gestão de Cursos
  - Estrutura de Módulos/Lições
  - Inscrições de Alunos
  - Geração & Verificação de Certificados
  - Tracking de Progresso
- **Dependências Principais:** Express, Prisma
- **Base API:** `/api/v1/academy`
- **Rotas:**
  - `/courses` - CRUD de cursos
  - `/enrollments` - Tracking de inscrições
  - `/certificates` - Emissão & verificação de certificados
- **Características Únicas:** Estrutura hierárquica (Curso → Módulo → Lição)

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React 18)                   │
│                  localhost:5173 / Vercel                 │
└────────────┬──────────┬──────────┬──────────┬───────────┘
             │          │          │          │
     ┌───────▼──┐ ┌─────▼────┐ ┌───▼───┐ ┌────▼────┐
     │Community │ │Marketplace│ │Academy│ │Business │
     │  :3001   │ │   :3002   │ │ :3003 │ │  :3004  │
     └────┬─────┘ └─────┬─────┘ └───┬───┘ └────┬────┘
          │             │           │          │
          └─────────────┴─────┬─────┴──────────┘
                              │
                    ┌─────────▼─────────┐
                    │  PostgreSQL 16    │
                    │ (4 schemas)       │
                    └───────────────────┘
```

### Interconexões entre Serviços
1. **Frontend → Todos os Serviços:** App React chama as 4 APIs diretamente
2. **Serviços → Serviços:** Sem comunicação direta inter-serviços encontrada
3. **Todos os Serviços → PostgreSQL:** Base de dados única com abordagem multi-schema
4. **Serviço Community:** Servidor WebSocket interno (Socket.io)
5. **Autenticação:** JWT secret partilhado entre todos os serviços (`JWT_SECRET`)

---

## 2. SCHEMAS DE BASE DE DADOS & ENTIDADES

### Arquitetura da Base de Dados
- **SGBD:** PostgreSQL 16 (imagem Docker Alpine)
- **Suporte Multi-Schema:** Usando feature `multiSchema` preview do Prisma
- **Abordagem:** Base de dados única (iamenu), schema separado por serviço
- **Padrão de Conexão:** `DATABASE_URL=postgresql://user:pass@host:port/db?schema=<service>`

### Detalhes dos Schemas

#### **Schema Community** (`community`) - 14 modelos

| Modelo | Propósito | Campos Chave |
|--------|-----------|--------------|
| `Post` | Posts do fórum | id, authorId, groupId, title, body, category, tags, status, views, likes |
| `Comment` | Comentários com aninhamento | postId, authorId, parentCommentId, body, status, likes |
| `Group` | Grupos de discussão | name, description, type (public/private), category, createdBy |
| `GroupMembership` | Tracking de membros | groupId, userId, joinedAt, role |
| `Profile` | Perfis de utilizadores | userId, username, restaurantName, location, bio, badges, role |
| `Reaction` | Reações emoji/like | userId, targetType, targetId, reactionType |
| `Notification` | Notificações | userId, type, title, body, link, read status |
| `Report` | Denúncias de moderação | reporterId, targetType, targetId, reason, status |
| `Follower` | Relação de seguir | followerId, followingId |
| `RefreshToken` | Tokens de rotação JWT | userId, token, expiresAt, revoked |
| `UserPoints` | Cache de pontos gamificação | userId, totalXP, level, currentStreak |
| `PointsHistory` | Log de transações de pontos | userId, points, reason, referenceId |
| `UserStreak` | Tracking de atividade diária | userId, date, actionsCount |
| `UserWarning` | Strikes de moderação | userId, issuedBy, reason, severity |
| `ModerationLog` | Audit trail | moderatorId, action, targetType, targetId |
| `UserBan` | Lookup de estado de ban | userId, bannedBy, reason, type, expiresAt |

#### **Schema Marketplace** (`marketplace`) - 10 modelos

| Modelo | Propósito | Campos Chave |
|--------|-----------|--------------|
| `Supplier` | Gestão de fornecedores | userId, companyName, logoUrl, categories, location, verified, rating |
| `Review` | Reviews de fornecedores | supplierId, reviewerId, ratings, comment, helpful counts |
| `Product` | Catálogo de produtos | name, category, subcategory, unit, imageUrl |
| `SupplierProduct` | Inventário/preços | supplierId, productId, price, minQuantity, available |
| `QuoteRequest` | RFQ de restaurantes | restaurantId, suppliers, items (JSON), status |
| `Quote` | Resposta do fornecedor | quoteRequestId, supplierId, items (JSON), validUntil, status |
| `CollectiveBargain` | Compras em grupo | creatorId, supplierId, productName, targetDiscount, deadline |
| `BargainAdhesion` | Participação em negociações | collectiveBargainId, userId, committedQuantity |
| `PriceHistory` | Histórico de preços | productId, supplierId, price, date |

#### **Schema Academy** (`academy`) - 5 modelos

| Modelo | Propósito | Campos Chave |
|--------|-----------|--------------|
| `Course` | Catálogo de cursos | title, slug, category, level, durationMinutes, price, published |
| `Module` | Secções do curso | courseId, title, order |
| `Lesson` | Conteúdo das lições | moduleId, title, videoUrl, order |
| `Enrollment` | Tracking de alunos | userId, courseId, enrolledAt, completedAt |
| `Certificate` | Prova de conclusão | userId, courseId, issuedAt, verificationCode |

#### **Schema Business** (`business`) - 6 modelos

| Modelo | Propósito | Campos Chave |
|--------|-----------|--------------|
| `Restaurant` | Perfil do restaurante | userId, name, address, cuisine, tables, hours, onboardingStatus |
| `RestaurantSettings` | Metas & targets | restaurantId, revenueGoal, foodCostTarget, tableRotation |
| `Product` | Items do menu | restaurantId, name, category, price, cost, popularity, sales |
| `Order` | Transações de vendas | restaurantId, customerId, total, status, orderDate |
| `OrderItem` | Line items da encomenda | orderId, productId, quantity, priceAtTime, costAtTime |
| `DailyStats` | Cache de analytics | restaurantId, date, revenue, customers, avgTicket, foodCostPct |

### Dependências Cross-Service
- **Sem foreign keys diretas entre schemas** (por design - bases de dados separadas)
- **Via campo userId:** Todos os serviços referenciam utilizadores por `userId`
- **Pontos de integração potenciais:**
  - Community `Profile.userId` ↔ Todos os outros serviços
  - Community `Group` ↔ Marketplace `CollectiveBargain.communityGroupId`

---

## 3. ESTRUTURA DO FRONTEND

### Visão Geral
- **Localização:** `frontend/apps/prototype-vision`
- **Framework:** React 18 + Vite + Tailwind CSS
- **Tipo:** Single Page Application (SPA)
- **Deploy:** Vercel (produção)
- **Linguagem:** JavaScript (JSX) - NÃO TypeScript

### Stack Tecnológica Frontend
```json
{
  "runtime": "React 18.2.0",
  "buildTool": "Vite 5.2.0",
  "routing": "React Router 7.11.0",
  "styling": "Tailwind CSS 3.4.1",
  "animações": "Framer Motion 11.0.0",
  "gráficos": "Chart.js 4.5.1 + react-chartjs-2",
  "ui": "Lucide React icons 0.300.0",
  "utilitários": {
    "datas": "date-fns 4.1.0",
    "pdf": "jsPDF 3.0.4 + jsPDF-autotable",
    "ai": "@google/generative-ai 0.24.1",
    "markdown": "react-markdown 10.1.0",
    "notificações": "react-hot-toast 2.6.0"
  }
}
```

### Principais Vistas (41+ componentes)

**Dashboard & Core:**
- `DashboardBI.jsx` - Hub principal de analytics
- `OnboardingView.jsx` - Fluxo de setup do restaurante
- `Marketplace.jsx` - Marketplace de fornecedores
- `CommunityView.jsx` - Hub da comunidade
- `Academy.jsx` - Cursos & inscrições

**Business Intelligence:**
- `GastroLens.jsx` - Insights com IA
- `FoodCostView.jsx` - Análise de custos
- `MenuEngineeringMatrix.jsx` - Matriz de engenharia de menu
- `DemandForecastChart.jsx` - Previsão de procura

**Componentes Reutilizáveis:**
- `TopBar.jsx`, `Sidebar.jsx` - Navegação
- `NotificationBadge.jsx`, `NotificationsPanel.jsx` - Notificações
- Gráficos: `SalesTrendChart.jsx`, `PeakHoursHeatmap.jsx`, `BenchmarkChart.jsx`

---

## 4. PADRÕES PARTILHADOS ENTRE SERVIÇOS

### Padrão de Autenticação
Todos os 4 serviços implementam **middleware JWT idêntico:**

```typescript
// Partilhado entre: community, marketplace, academy, business

export const authenticateJWT = (req, res, next) => {
  // Extrai token de "Authorization: Bearer <token>"
  // Verifica usando process.env.JWT_SECRET
  // Anexa user a req.user = { userId, email, role }
}

export const optionalAuth = (req, res, next) => {
  // Auth não-falhante (para rotas públicas com features opcionais)
}
```

### Padrão de Tratamento de Erros
```typescript
class AppError extends Error {
  constructor(message: string, statusCode: number = 500)
}

const errorHandler = (err, req, res, next) => {
  // Resposta JSON consistente com:
  // - error, message, service, timestamp, path
}
```

### Stack de Middleware (ordem)
1. Helmet (headers de segurança)
2. CORS (verificação de origem)
3. Morgan (logging de requests)
4. Express.json/urlencoded (parsing do body)
5. Compression (gzip)
6. File upload (multer) - se aplicável
7. Middlewares de auth específicos da rota

### Padrão de Acesso à Base de Dados
```typescript
// services/{service}/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Padrão singleton previne múltiplas instâncias do cliente
const prisma = globalForPrisma.prisma ?? new PrismaClient({...});
export default prisma;
```

### Padrão de Arquitetura de 3 Camadas
```
Route (Controller) → Service (Lógica de Negócio) → Prisma (Acesso a Dados)
```

---

## 5. CONTRATOS DE API & VERSIONAMENTO

### Esquema de Versionamento
- **Versão:** v1
- **Formato:** `/api/v1/{service}/{resource}`
- **Padrão:** RESTful com verbos HTTP

### Endpoints Base
```
Community:   http://localhost:3001/api/v1/community
Marketplace: http://localhost:3002/api/v1/marketplace
Academy:     http://localhost:3003/api/v1/academy
Business:    http://localhost:3004/api/v1/business
```

### Convenção de Verbos HTTP
- `GET /resource` - Listar
- `GET /resource/:id` - Obter único
- `POST /resource` - Criar
- `PATCH /resource/:id` - Atualizar (parcial)
- `DELETE /resource/:id` - Eliminar

### Formatos de Resposta

**Resposta de Sucesso:**
```json
{
  "data": { /* recurso */ },
  "message": "Operação bem sucedida",
  "timestamp": "2026-01-31T..."
}
```

**Resposta de Erro:**
```json
{
  "error": "Bad Request|Unauthorized|Forbidden|Not Found|Internal Server Error",
  "message": "Mensagem legível",
  "service": "community-api|marketplace-api|academy-api|business-api",
  "timestamp": "2026-01-31T...",
  "path": "/api/v1/community/posts"
}
```

---

## 6. GESTÃO DE CONFIGURAÇÃO

### Estrutura de Ficheiros de Ambiente
```
.env                          # Raiz - config do sistema AIOS
.env.example                  # Template
services/{service}/.env       # Configs individuais dos serviços
frontend/apps/prototype-vision/.env
```

### Variáveis por Serviço
```bash
PORT=3002|3003|3004|3005
NODE_ENV=development|production
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/iamenu?schema={service}
JWT_SECRET=dev-secret-change-in-production
CORS_ORIGIN=http://localhost:5173
```

### Hosts de Produção (Railway)
- Community: `https://iamenucommunity-api-production.up.railway.app`
- Marketplace: `https://iamenumarketplace-api-production.up.railway.app`
- Business: `https://iamenubusiness-api-production.up.railway.app`
- Academy: `https://iamenuacademy-api-production.up.railway.app`
- Frontend: `https://prototype-vision.vercel.app`

---

## 7. PROBLEMAS IDENTIFICADOS

| Prioridade | Problema | Impacto |
|------------|----------|---------|
| ✅ Resolvido | ~~Conflitos de portas na documentação vs código~~ | ~~Confusão no dev~~ |
| 🟡 Média | Sem comunicação inter-serviços | Workflows limitados |
| 🟡 Média | Falta specs Swagger/OpenAPI | Fricção no onboarding |
| 🟡 Média | Tokens de auth criados externamente | Dependência pouco clara |
| 🟢 Baixa | Padrões duplicados entre serviços | Overhead de manutenção |

---

## 8. PONTOS FORTES

- ✅ Separação clara de serviços com responsabilidades únicas
- ✅ Padrões consistentes (auth, erros, logging) em todos os serviços
- ✅ Stack moderna (Node 18, React 18, Prisma, Vite)
- ✅ Pronto para produção (Railway + Vercel)
- ✅ Suporte real-time via Socket.io (Community)

---

## 9. RECOMENDAÇÕES ARQUITETURAIS

1. **Implementar API Gateway**
   - Ponto de entrada único em vez de 4 URLs diferentes
   - Rate limiting centralizado
   - Routing de requests & versionamento

2. **Adicionar Event Bus**
   - Para comunicação assíncrona entre serviços
   - Ex: "utilizador ganhou pontos" → evento de gamificação

3. **Criar Package de Bibliotecas Partilhadas**
   - Consolidar código duplicado de auth, tratamento de erros
   - `frontend/packages/shared` para utilitários comuns

4. **Adicionar Logging Abrangente**
   - Agregação centralizada de logs (Sentry, ELK stack)
   - Logging estruturado com correlation IDs

5. **Implementar Documentação de API**
   - Specs Swagger/OpenAPI para cada serviço
   - Auto-gerar a partir de tipos TypeScript

---

## TABELA RESUMO

| Aspeto | Detalhe |
|--------|---------|
| **Arquitetura** | 4 microserviços + 1 frontend |
| **Runtime Backend** | Node.js 18+ com Express.js |
| **Runtime Frontend** | React 18 com Vite |
| **Base de Dados** | PostgreSQL 16 (multi-schema) |
| **ORM** | Prisma 5.7 |
| **Autenticação** | JWT (secret partilhado) |
| **Real-time** | Socket.io (apenas Community) |
| **Armazenamento de Ficheiros** | Diretório local /uploads |
| **Deploy** | Railway (backend), Vercel (frontend) |
| **Portas de Desenvolvimento** | 3001-3004 (serviços), 5173 (frontend), 5432 (DB) |
| **Total de Entidades** | 38 modelos de base de dados |
| **Total de Rotas** | 100+ endpoints REST |
| **Total de Vistas Frontend** | 41+ componentes |
| **Linguagens** | TypeScript (backend), JavaScript (frontend) |

---

**Relatório Gerado:** 31 de Janeiro de 2026
**Ferramenta de Análise:** Claude Code - AIOS Master
**Âmbito:** Análise completa do codebase (apenas leitura)
