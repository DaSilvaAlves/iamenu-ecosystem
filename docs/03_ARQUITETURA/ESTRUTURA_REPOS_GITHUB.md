---
última_atualização: 2025-12-18 01:15
agent: Claude Code
versão: 1.0
status: Proposta (Aguardando Decisão Eurico)
---

# ESTRUTURA REPOS GITHUB - iaMenu Ecosystem

> **Objetivo:** Organizar codebase para arquitetura Híbrida (Java Core + Node Tools)
> **Decisão pendente:** Repo novo `iamenu-ecosystem` vs usar `menuia` existente

---

## 📊 OPÇÃO A: REPO NOVO (RECOMENDADO ⭐)

### Repo: `iamenu-ecosystem`

```
iamenu-ecosystem/
│
├── README.md                          # Documentação principal
├── .gitignore                         # Ignores globais
├── docker-compose.yml                 # Orquestração local dev
├── docker-compose.prod.yml            # Orquestração produção Railway
│
├── core/                              # ☕ Java Spring Boot (existente)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── pt/iamenu/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-prod.yml
│   │   └── test/
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
│
├── services/                          # 🟢 Node.js APIs (novos)
│   │
│   ├── community/                     # Hub Comunidade API
│   │   ├── src/
│   │   │   ├── index.ts               # Entry point
│   │   │   ├── routes/
│   │   │   │   ├── posts.ts
│   │   │   │   ├── comments.ts
│   │   │   │   ├── groups.ts
│   │   │   │   └── profiles.ts
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts           # JWT validation
│   │   │   ├── utils/
│   │   │   └── types/
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Schema community
│   │   │   ├── migrations/
│   │   │   └── seed.ts                # 15 grupos iniciais
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── README.md
│   │
│   ├── marketplace/                   # Marketplace API
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── routes/
│   │   │   │   ├── suppliers.ts
│   │   │   │   ├── reviews.ts
│   │   │   │   ├── products.ts
│   │   │   │   └── quotes.ts
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── middleware/
│   │   │   ├── utils/
│   │   │   └── types/
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Schema marketplace
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   ├── .env.example
│   │   └── README.md
│   │
│   └── academy/                       # Academia API
│       ├── src/
│       │   ├── index.ts
│       │   ├── routes/
│       │   │   ├── courses.ts
│       │   │   ├── enrollments.ts
│       │   │   ├── lessons.ts
│       │   │   └── certificates.ts
│       │   ├── controllers/
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── utils/
│       │   └── types/
│       ├── prisma/
│       │   ├── schema.prisma          # Schema academy
│       │   ├── migrations/
│       │   └── seed.ts                # 3 cursos iniciais
│       ├── tests/
│       ├── package.json
│       ├── tsconfig.json
│       ├── Dockerfile
│       ├── .env.example
│       └── README.md
│
├── frontend/                          # ⚛️ React Apps
│   ├── apps/
│   │   ├── menu/                      # iaMenu Core UI (existente)
│   │   │   ├── src/
│   │   │   ├── public/
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   │
│   │   ├── community/                 # Hub Comunidade UI
│   │   │   ├── src/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── PostDetail.tsx
│   │   │   │   │   ├── Groups.tsx
│   │   │   │   │   └── Profile.tsx
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── api/
│   │   │   │   └── utils/
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   │
│   │   ├── marketplace/               # Marketplace UI
│   │   │   ├── src/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── Home.tsx
│   │   │   │   │   ├── SupplierProfile.tsx
│   │   │   │   │   ├── Compare.tsx
│   │   │   │   │   └── Quotes.tsx
│   │   │   │   ├── components/
│   │   │   │   └── ...
│   │   │   └── package.json
│   │   │
│   │   └── academy/                   # Academia UI
│   │       ├── src/
│   │       │   ├── pages/
│   │       │   │   ├── CourseCatalog.tsx
│   │       │   │   ├── CourseDetail.tsx
│   │       │   │   ├── LessonPlayer.tsx
│   │       │   │   └── MyCourses.tsx
│   │       │   ├── components/
│   │       │   └── ...
│   │       └── package.json
│   │
│   └── packages/                      # Shared packages
│       ├── ui/                        # Componentes partilhados
│       │   ├── src/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   └── index.ts
│       │   └── package.json
│       │
│       ├── utils/                     # Utils partilhados
│       │   ├── src/
│       │   │   ├── date.ts
│       │   │   ├── format.ts
│       │   │   └── index.ts
│       │   └── package.json
│       │
│       └── types/                     # Types TypeScript partilhados
│           ├── src/
│           │   ├── user.ts
│           │   ├── api.ts
│           │   └── index.ts
│           └── package.json
│
├── database/                          # 🗄️ Database Scripts
│   ├── migrations/                    # Migrations SQL (se não Prisma)
│   ├── seeds/                         # Seed data
│   │   ├── users.sql
│   │   ├── community-groups.sql
│   │   ├── marketplace-suppliers.sql
│   │   └── academy-courses.sql
│   └── schema/                        # Schema docs
│       ├── core.sql
│       ├── community.sql
│       ├── marketplace.sql
│       └── academy.sql
│
├── scripts/                           # 🔧 Utility Scripts
│   ├── setup-dev.sh                   # Setup ambiente dev local
│   ├── deploy-railway.sh              # Deploy para Railway
│   ├── seed-all.sh                    # Seed todas databases
│   └── backup-db.sh                   # Backup PostgreSQL
│
├── docs/                              # 📚 Documentação Técnica
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── database-design.md
│   │   └── api-contracts.md
│   ├── deployment/
│   │   ├── railway-setup.md
│   │   └── domain-config.md
│   └── development/
│       ├── local-setup.md
│       └── contributing.md
│
└── .github/                           # 🤖 GitHub Workflows (CI/CD)
    └── workflows/
        ├── test-core.yml              # Tests Java
        ├── test-services.yml          # Tests Node.js
        ├── deploy-staging.yml         # Deploy staging
        └── deploy-production.yml      # Deploy prod

```

---

### ✅ **Vantagens Opção A (Repo Novo):**

1. **Organização limpa desde início** (não arrastar dívida técnica)
2. **Separação clara** Core vs Tools (fácil navegar)
3. **Monorepo moderno** (facilita CI/CD, dependências partilhadas)
4. **Deploy Railway simplificado** (cada serviço = pasta)
5. **Escalabilidade** (adicionar serviços novos = pasta nova)
6. **Histórico Git limpo** (novo começo)

---

### ❌ **Desvantagens Opção A:**

1. **Copiar código Java existente** (trabalho 1-2h, mas só 1x)
2. **Histórico Git perdido** (mas pode-se preservar via git subtree)

---

## 📊 OPÇÃO B: USAR REPO `menuia` EXISTENTE

### Repo: `menuia` (existente)

```
menuia/
│
├── [código Java Spring Boot existente]
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── services/ (NOVO)
│   ├── community/
│   ├── marketplace/
│   └── academy/
│
├── frontend/ (NOVO)
│   └── ...
│
├── database/ (NOVO)
│   └── ...
│
├── docker-compose.yml (ATUALIZAR)
└── README.md (ATUALIZAR)
```

---

### ✅ **Vantagens Opção B:**

1. **Zero trabalho copiar código** (está tudo lá)
2. **Histórico Git preservado** (commits antigos acessíveis)
3. **Menos repos gerir** (1 em vez de 2)

---

### ❌ **Desvantagens Opção B:**

1. **Estrutura confusa** (código antigo misturado com novo)
2. **Root desordenado** (ficheiros Java + Node + React todos juntos)
3. **Deploy Railway confuso** (root directory não óbvio)
4. **Dívida técnica acumula** (código antigo não usado fica lá)
5. **Naming inconsistente** (repo chama-se "menuia" mas projeto é "iaMenu")

---

## 🎯 **RECOMENDAÇÃO: OPÇÃO A (Repo Novo)**

### Razões:

1. **Fresh Start:** Projeto novo merece estrutura limpa
2. **6 semanas trabalho:** Investir 2h organizar bem vale a pena
3. **Railway deploy:** Muito mais fácil com estrutura clara
4. **Escalabilidade:** Adicionar Academy API = pasta nova (não confusão)
5. **Onboarding:** Se contratar dev futuro, repo organizado = produtivo D1

### Plano Migração (2h):

```bash
# 1. Criar repo novo
gh repo create iamenu-ecosystem --private

# 2. Clonar localmente
git clone https://github.com/DaSilvaAlves/iamenu-ecosystem
cd iamenu-ecosystem

# 3. Copiar código Java existente
# (Eurico faz: copiar pasta src/ + pom.xml do menuia para core/)

# 4. Commit inicial
git add .
git commit -m "Initial commit: Java Core migrated from menuia"
git push

# 5. Criar estrutura nova (Claude faz: services/, frontend/, etc)
```

---

## 📋 **DECISÃO EURICO:**

**Qual opção preferes?**

- [x] **Opção A:** Repo novo `iamenu-ecosystem` (limpo, organizado, recomendado)
- [ ] **Opção B:** Usar repo `menuia` existente (mais rápido, menos trabalho)

**Se Opção A:**
- Precisas copiar código Java do `menuia` para pasta `core/` (2h trabalho, faço contigo)

**Se Opção B:**
- Criar pastas `services/`, `frontend/`, `database/` dentro `menuia` (15min)

---

## 🚀 **PRÓXIMOS PASSOS (Após Decisão):**

### Passo 1: Estrutura Base
- [ ] Criar pastas (core, services, frontend, database)
- [ ] README.md em cada pasta
- [ ] .gitignore configurado
- [ ] docker-compose.yml base

### Passo 2: Boilerplate Node.js
- [ ] `services/community/` setup (Express + Prisma + TypeScript)
- [ ] `services/marketplace/` setup
- [ ] `services/academy/` setup
- [ ] package.json configurados
- [ ] Dockerfiles criados

### Passo 3: Database Schemas
- [ ] Prisma schema `community`
- [ ] Prisma schema `marketplace`
- [ ] Prisma schema `academy`
- [ ] Seeds iniciais (grupos, fornecedores, cursos)

### Passo 4: Deploy Railway
- [ ] Scripts deploy
- [ ] Environment variables
- [ ] Testar deploy staging

---

## 📎 **REFERÊNCIAS:**

- [[03_ARQUITETURA/DECISAO_ARQUITETURA]] - Opção 3 Híbrida aprovada
- [[03_ARQUITETURA/STACK_TECNICO]] - Stack completo
- [[02_PRD/PRD_Hub_Comunidade]] - Features Community
- [[02_PRD/PRD_Marketplace_Fornecedores]] - Features Marketplace
- [[02_PRD/PRD_Academia]] - Features Academy

---

**Status:** Aguardando Decisão Eurico (Opção A ou B)
**Urgência:** Alta (bloqueador para desenvolvimento)
**Tempo Decisão:** 1 minuto ⏱️
