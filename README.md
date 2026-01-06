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
- Node.js 18+
- Docker & Docker Compose
- **Para utilizadores Windows:** O WSL (Windows Subsystem for Linux) tem que estar atualizado. Se encontrar problemas com o Docker, execute `wsl --update` num terminal de administrador e reinicie o computador.

### Setup Local:

#### 1. Instalar Dependências
Na raiz do projeto, instale todas as dependências dos workspaces (isto irá instalar as dependências para todos os serviços Node.js).
```bash
npm install
```

#### 2. Configurar Variáveis de Ambiente
Copie o ficheiro de exemplo `.env.example` para um novo ficheiro chamado `.env`.
```bash
cp .env.example .env
```
**Importante:** Verifique o ficheiro `.env` e preencha as variáveis necessárias, como `OPENAI_API_KEY`. O `DATABASE_URL` padrão deve funcionar com a configuração Docker abaixo.

#### 3. Iniciar a Base de Dados
Use o Docker Compose para iniciar o contentor da base de dados PostgreSQL em segundo plano.
```bash
docker compose up postgres -d
```
(Nota: as versões mais antigas do Docker podem usar `docker-compose` com um hífen).

#### 4. Aplicar as Migrações da Base de Dados (passo a passo)
Devido à arquitetura multi-esquema, cada serviço precisa de ter as suas migrações aplicadas individualmente. Execute os seguintes comandos pela ordem indicada, a partir da **raiz do projeto**:

```bash
# 1. Marketplace
cd services/marketplace
npx dotenv -e ../../.env npx prisma migrate dev --name initial_marketplace_schema
cd ../..

# 2. Academy
cd services/academy
npx dotenv -e ../../.env npx prisma migrate dev --name initial_academy_schema
# Se o Prisma perguntar "Do you want to continue?", digite 'y' e Enter.
cd ../..

# 3. Business
cd services/business
npx dotenv -e ../../.env npx prisma migrate dev --name initial_business_schema
# Se o Prisma perguntar "Do you want to continue?", digite 'y' e Enter.
cd ../..

# 4. Community
cd services/community
npx dotenv -e ../../.env npx prisma migrate dev --name initial_community_schema
# Se o Prisma perguntar "Do you want to continue?", digite 'y' e Enter.
cd ../..
```
Nota: Os serviços `business` e `community` têm scripts de "seed" que irão popular a base de dados com dados de exemplo automaticamente após a migração.

#### 5. Executar os Serviços
Depois de tudo configurado, pode iniciar todos os serviços de desenvolvimento com um único comando a partir da raiz do projeto:
```bash
npm run dev
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

### ✅ Fase 1: Hub Comunidade (COMPLETO)
- [x] Backend: Posts, Comentários, Grupos, Notificações
- [x] Frontend: Dashboard, Feed, Grupos, Perfis
- [x] Sistema de seguidores e reações
- [x] Upload de imagens em posts
- [x] Feed em tempo real

### ✅ Fase 2: Marketplace (COMPLETO)
- [x] Backend: Fornecedores, Reviews, RFQ System
- [x] Frontend: Search, Perfil Fornecedor, RFQ
- [x] Sistema de cotações (Request for Quote)
- [x] Perfis públicos de fornecedores
- [x] Upload de imagens (logo, header)

### 🚧 Fase 3: Business Intelligence (EM DESENVOLVIMENTO)
- [x] Backend: Dashboard, Analytics, Onboarding
- [x] Frontend: Dashboard BI, Onboarding
- [x] Métricas e insights de negócio
- [ ] Integração completa com módulos
- [ ] Relatórios avançados

### 📅 Fase 4: Academia (PLANEADO)
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

## 🔌 APIs Disponíveis

### Portas dos Serviços:
| Serviço | Porta | Base URL |
|---------|-------|----------|
| **Community API** | 3004 | http://localhost:3004/api/v1/community |
| **Marketplace API** | 3005 | http://localhost:3005/api/v1/marketplace |
| **Business API** | 3002 | http://localhost:3002/api/v1/business |
| **Frontend** | 5173 | http://localhost:5173 |

### Endpoints Principais:

#### Community API (Porta 3004)
```
GET    /api/v1/community/posts              # Listar posts
POST   /api/v1/community/posts              # Criar post
GET    /api/v1/community/posts/:id          # Detalhes do post
POST   /api/v1/community/posts/:id/like     # Dar like
GET    /api/v1/community/groups             # Listar grupos
GET    /api/v1/community/profiles/:userId   # Ver perfil
GET    /api/v1/community/notifications      # Notificações
```

#### Marketplace API (Porta 3005)
```
GET    /api/v1/marketplace/suppliers        # Listar fornecedores
GET    /api/v1/marketplace/suppliers/:id    # Detalhes fornecedor
POST   /api/v1/marketplace/quotes/request   # Criar RFQ
GET    /api/v1/marketplace/quotes/:id       # Detalhes cotação
GET    /api/v1/marketplace/products         # Pesquisar produtos
```

#### Business API (Porta 3002)
```
GET    /api/v1/business/onboarding/status   # Status onboarding
POST   /api/v1/business/onboarding/setup    # Configurar restaurante
GET    /api/v1/business/dashboard/stats     # Estatísticas
GET    /api/v1/business/dashboard/alerts    # Alertas
GET    /api/v1/business/dashboard/top-products  # Top produtos
```

### Autenticação:
Todos os endpoints protegidos requerem header:
```
Authorization: Bearer <token>
```

Token de desenvolvimento disponível em `frontend/apps/prototype-vision/src/config/devToken.js`

---

## 🧪 Testing

```bash
# Unit tests
npm run test                       # All services
npm run test:core                  # Java (JUnit)
npm run test:community             # Node.js (Jest)

# Integration tests
npm test                   # Runs all tests in all services

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

**Status:** 🚧 Development - Protótipo Funcional
**Última atualização:** 2025-01-06
**Próximo milestone:** Refinamento e Testes Beta
