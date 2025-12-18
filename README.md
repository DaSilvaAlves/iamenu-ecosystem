# iaMenu Ecosystem 🍽️

> **Plataforma completa para restauração portuguesa**
> Menu Digital + Comunidade + Marketplace + Academia

[![Status](https://img.shields.io/badge/status-development-yellow)]()
[![Railway](https://img.shields.io/badge/deploy-railway-blueviolet)]()
[![License](https://img.shields.io/badge/license-private-red)]()

---

## 🎯 Visão

Transformar restaurantes portugueses através de tecnologia + comunidade + educação.

**Proposta Valor:**
- 💰 Poupar €200-400/mês (Marketplace fornecedores)
- 🤝 Rede apoio 50+ restauradores (Hub Comunidade)
- 🎓 Upskilling gratuito (Academia iaMenu)
- 📱 Menu Digital multilíngue IA (Core)

**Meta 6 meses:** €10k MRR | 100 restaurantes | Churn <3%

---

## 📦 Arquitetura

### Monorepo Híbrido:
```
iaMenu Ecosystem
├── Core (Java Spring Boot)      → Menu Digital, Auth, Orders
├── Services (Node.js)            → Comunidade, Marketplace, Academia
├── Frontend (React)              → UIs separadas por feature
└── Database (PostgreSQL 16)      → Schemas separados
```

### Stack:
| Componente | Tecnologia |
|------------|------------|
| **Backend Core** | Java 17, Spring Boot 3.x, Maven |
| **Backend Services** | Node.js 18, TypeScript, Express, Prisma |
| **Frontend** | React 18, Tailwind CSS, React Query |
| **Database** | PostgreSQL 16 (schemas: core, community, marketplace, academy) |
| **IA** | OpenAI GPT-4-Turbo |
| **Auth** | Custom JWT (partilhado) |
| **Payments** | Stripe |
| **Deploy** | Railway (Docker containers) |

---

## 🚀 Quick Start

### Pré-requisitos:
- Java 17+
- Node.js 18+
- PostgreSQL 16
- Docker & Docker Compose

### Setup Local:

```bash
# 1. Instalar dependências
npm install                        # Root (workspaces)
cd core && mvn install             # Java Core
cd services/community && npm install
cd services/marketplace && npm install
cd services/academy && npm install

# 2. Setup Database
docker-compose up postgres -d
npm run db:migrate                 # Prisma migrations
npm run db:seed                    # Seed data

# 3. Configurar .env
cp .env.example .env
# Preencher: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY

# 4. Run Development
npm run dev                        # Todos serviços (Turborepo)
# OU individual:
npm run dev:core                   # Java Core (8080)
npm run dev:community              # Community API (3001)
npm run dev:marketplace            # Marketplace API (3002)
npm run dev:academy                # Academy API (3003)
npm run dev:frontend               # React Apps (3000)
```

### Deploy Railway:

```bash
# Setup (1x)
railway login
railway link

# Deploy
npm run deploy:staging
npm run deploy:production
```

---

## 📂 Estrutura Projeto

```
iamenu-ecosystem/
│
├── core/                          # ☕ Java Spring Boot
│   ├── src/main/java/pt/iamenu/
│   ├── pom.xml
│   └── Dockerfile
│
├── services/                      # 🟢 Node.js APIs
│   ├── community/                 # Hub Comunidade
│   ├── marketplace/               # Marketplace Fornecedores
│   └── academy/                   # Academia Cursos
│
├── frontend/                      # ⚛️ React Apps
│   ├── apps/
│   │   ├── menu/                  # Menu Digital UI
│   │   ├── community/             # Hub UI
│   │   ├── marketplace/           # Marketplace UI
│   │   └── academy/               # Academia UI
│   └── packages/
│       ├── ui/                    # Shared components
│       └── utils/                 # Shared utilities
│
├── database/                      # 🗄️ Database
│   ├── migrations/
│   ├── seeds/
│   └── schema/
│
├── scripts/                       # 🔧 Utility scripts
│   ├── setup-dev.sh
│   ├── deploy-railway.sh
│   └── seed-all.sh
│
├── docs/                          # 📚 Documentation
│   ├── architecture/
│   ├── deployment/
│   └── development/
│
├── docker-compose.yml
├── package.json                   # Workspaces root
└── README.md
```

---

## 🎯 Roadmap

### ✅ Fase 0: Foundation (Semana 0)
- [x] Setup monorepo
- [x] Arquitetura Híbrida definida
- [x] 3 PRDs completos (54 páginas)
- [x] Railway account criado

### 🚧 Fase 1: Hub Comunidade (Semanas 1-2)
- [ ] Backend: Posts, Comentários, Grupos
- [ ] Frontend: Dashboard, Feed, Grupos
- [ ] Deploy staging Railway
- [ ] Beta: 5 restauradores

### 📅 Fase 2: Marketplace (Semanas 3-4)
- [ ] Backend: Fornecedores, Reviews, Comparação Preços
- [ ] Frontend: Search, Perfil Fornecedor, Compare
- [ ] Seed 20-30 fornecedores
- [ ] Beta: Negociação coletiva

### 📅 Fase 3: Academia (Semanas 5-6)
- [ ] Backend: Cursos, Progress Tracking, Certificados
- [ ] Frontend: Player, Dashboard Cursos
- [ ] Gravar 3 cursos (iaMenu 101, Negociação, Marketing)
- [ ] Beta: 10 certificados emitidos

### 🎉 Fase 4: Launch (Mês 2)
- [ ] Email 50 users iaMenu existentes
- [ ] Public launch redes sociais
- [ ] Primeiros 3 clientes pagam €88/mês
- [ ] Upgrade Railway Hobby Plan (€5-10/mês)

---

## 🧪 Testing

```bash
# Unit tests
npm run test                       # All services
npm run test:core                  # Java (JUnit)
npm run test:community             # Node.js (Jest)

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e                   # Playwright
```

---

## 📊 Métricas de Sucesso

| Métrica | Target 3 Meses | Status |
|---------|----------------|--------|
| **MRR** | €10k | €0 |
| **Restaurantes** | 100 | 0 |
| **Churn Rate** | <3% | - |
| **NPS** | >50 | - |
| **Community DAU** | 30% | - |
| **Marketplace Savings** | €20k/mês | €0 |
| **Certificados** | 50+ | 0 |

---

## 🛠️ Tecnologias

### Backend:
- Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security
- Node.js 18, TypeScript 5, Express.js, Prisma ORM
- PostgreSQL 16, Redis (futuro)

### Frontend:
- React 18, TypeScript, Tailwind CSS
- React Query, Zustand, React Router
- Vite, Turborepo

### DevOps:
- Docker, Docker Compose
- Railway (deploy)
- GitHub Actions (CI/CD - futuro)

### External:
- OpenAI API (GPT-4-Turbo)
- Stripe (payments)
- Vimeo ou YouTube (vídeos Academia)

---

## 📝 Documentação

- [Arquitetura Completa](./docs/architecture/overview.md)
- [Setup Local](./docs/development/local-setup.md)
- [Deploy Railway](./docs/deployment/railway-setup.md)
- [PRDs (Product Requirements)](./docs/prds/)
  - [Hub Comunidade](./docs/prds/hub-comunidade.md)
  - [Marketplace](./docs/prds/marketplace.md)
  - [Academia](./docs/prds/academia.md)

---

## 🤝 Contributing

Projeto privado. Apenas Eurico Alves + Claude Code.

---

## 📄 License

Proprietary - Todos direitos reservados © 2025 iaMenu

---

## 📞 Contacto

**Eurico Alves**
- Email: euricojsalves@gmail.com
- LinkedIn: [Eurico Alves](https://linkedin.com/in/euricoalves)
- Website: [iamenu.pt](https://iamenu.pt)

---

## 🎉 Acknowledgments

- Metodologia "Do Puxadinho à Mansão" (estruturação projeto)
- Claude Code (desenvolvimento IA)
- Comunidade restauração portuguesa (inspiração)

---

**Status:** 🚧 Development (Semana 0 - Setup)
**Última atualização:** 2025-12-18
**Próximo milestone:** Hub Comunidade MVP (Semana 1-2)
