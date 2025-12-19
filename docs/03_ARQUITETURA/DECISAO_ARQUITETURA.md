---
última_atualização: 2025-12-16 23:00
agent: Claude Code
versão: 1.0
status: Proposta (Aguardando Decisão Eurico)
---

# DECISÃO DE ARQUITETURA - Novas Ferramentas iaMenu

> **Contexto:** Stack atual é Java Spring Boot. Como desenvolver novas ferramentas?
> **Impacto:** Define velocidade desenvolvimento, custos, manutenibilidade

---

## 🎯 CONTEXTO

### Stack Atual (iaMenu Core)
```
Frontend:  React + CoreUI
Backend:   Java Spring Boot
Database:  PostgreSQL 16
IA:        OpenAI GPT-4-Turbo
Auth:      Custom JWT
Deploy:    Docker Compose
```

### Novas Ferramentas a Desenvolver (Fase 1)
1. **Hub Comunidade** (fórum, grupos, webinars)
2. **Marketplace Fornecedores** (diretório, reviews, comparação)
3. **Academia** (cursos vídeo, microlearning)

---

## 🔀 OPÇÃO 1: MONOLITO (Tudo em Java Spring Boot)

### Descrição
Adicionar todas as features novas ao projeto Spring Boot existente.

```
┌─────────────────────────────────────┐
│      iaMenu Spring Boot App         │
│                                     │
│  ┌──────────┐  ┌──────────────┐   │
│  │  Menu    │  │  Comunidade  │   │
│  │  Digital │  │     Hub      │   │
│  └──────────┘  └──────────────┘   │
│                                     │
│  ┌──────────┐  ┌──────────────┐   │
│  │Marketplace│  │   Academia   │   │
│  └──────────┘  └──────────────┘   │
│                                     │
│         PostgreSQL 16               │
└─────────────────────────────────────┘
```

### ✅ Vantagens
- **Consistência total:** Mesma linguagem, padrões, estrutura
- **Partilha código:** Entidades, services, utils reutilizados
- **Deploy simples:** 1 Docker container, 1 aplicação
- **Performance:** Comunicação interna (sem HTTP overhead)
- **Transações:** ACID cross-features (ex: criar user + adicionar comunidade)

### ❌ Desvantagens
- **Desenvolvimento LENTO com IAs:** Claude/Gemini são melhores em Node/Python que Java
- **Complexidade crescente:** Codebase fica enorme
- **Deploy arriscado:** Bug numa feature afeta todas
- **Escalabilidade limitada:** Não podes escalar features independentemente
- **Lock-in tecnológico:** Sempre preso a Java
- **Curva aprendizagem:** Se contratar dev, precisa saber Java

### 💰 Custos
- **Infra:** Baixo (1 servidor)
- **Desenvolvimento:** Alto (Java é verbose, IAs menos eficientes)
- **Manutenção:** Médio

### ⏱️ Timeline
- **Setup:** 1 dia (já existe)
- **Feature nova:** 3-4 semanas cada

---

## 🌐 OPÇÃO 2: MICROSERVICES (Serviços Independentes)

### Descrição
Cada ferramenta é um serviço separado que comunica via API REST.

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  iaMenu Core │  │ Hub Comunidad│  │  Marketplace │
│ (Spring Boot)│◄─┤ (Node/Python)│◄─┤ (Node/Python)│
│              │  │              │  │              │
│  PostgreSQL  │  │  PostgreSQL  │  │  PostgreSQL  │
└──────────────┘  └──────────────┘  └──────────────┘
       ▲                  ▲                 ▲
       └──────────────────┴─────────────────┘
              API Gateway / Nginx
```

### ✅ Vantagens
- **Desenvolvimento RÁPIDO:** Novas features em Node/Python (IAs são experts)
- **Escalabilidade independente:** Marketplace popular? Escala só ele
- **Deploy seguro:** Bug no Marketplace não afeta Menu Digital
- **Stack flexível:** Melhor tech para cada problema
- **Paralelização:** Equipas (ou IAs) trabalham em paralelo
- **Manutenção isolada:** Código pequeno, focado

### ❌ Desvantagens
- **Complexidade infra:** Múltiplos containers, orquestração
- **Comunicação lenta:** HTTP entre serviços (latência)
- **Duplicação código:** Auth, logging, utils repetidos
- **Transações distribuídas:** Difícil garantir consistência
- **Deploy complexo:** Kubernetes? Docker Swarm? Múltiplos deploys
- **Debugging difícil:** Erro pode estar em qualquer serviço
- **Custos infra:** Mais servidores

### 💰 Custos
- **Infra:** Alto (múltiplos servidores/containers)
- **Desenvolvimento:** Baixo (IAs eficientes em Node/Python)
- **Manutenção:** Alto (muitos serviços)

### ⏱️ Timeline
- **Setup:** 1 semana (API Gateway, networking, auth partilhada)
- **Feature nova:** 1-2 semanas cada

---

## ⚡ OPÇÃO 3: HÍBRIDO MODULAR (Recomendado)

### Descrição
**Core em Java** (iaMenu Digital - já existe)
**Ferramentas em Node.js** (Comunidade, Marketplace, Academia)
**Comunicação via API REST + PostgreSQL partilhada**

```
┌────────────────────────────────────────────────┐
│           Frontend React (Monorepo)            │
│  Menu │ Comunidade │ Marketplace │ Academia    │
└─────┬──────────┬────────────┬──────────┬───────┘
      │          │            │          │
┌─────▼──────┐  │            │          │
│ iaMenu Core│  │            │          │
│(Spring Boot)│  │            │          │
│  - Menu    │  │            │          │
│  - IA Chat │  │            │          │
│  - Orders  │  │            │          │
│  - Auth    │◄─┼────────────┼──────────┤
└─────┬──────┘  │            │          │
      │   ┌─────▼──────┐┌────▼────┐┌───▼──────┐
      │   │ Hub Service││Marketplace││Academia  │
      │   │  (Node.js) ││ (Node.js)││(Node.js) │
      │   └─────┬──────┘└────┬────┘└───┬──────┘
      │         │            │          │
┌─────▼─────────▼────────────▼──────────▼───────┐
│           PostgreSQL 16 (Partilhada)          │
│  Schema: core │ community │ market │ academy  │
└───────────────────────────────────────────────┘
```

### ✅ Vantagens
**Melhor dos 2 mundos:**
- ✅ **Core estável** em Java (já funciona, não mexer)
- ✅ **Features novas rápidas** em Node (IAs eficientes)
- ✅ **BD partilhada** (dados consistentes, joins possíveis)
- ✅ **Auth centralizada** (Java Core faz JWT, outros validam)
- ✅ **Deploy moderado** (3-4 containers, não centenas)
- ✅ **Escalabilidade seletiva** (Comunidade popular? Escala só ela)
- ✅ **Risco controlado** (Core intocável, features isoladas)

### ❌ Desvantagens
- **Duas linguagens:** Java + Node (mas Eurico não programa, IAs sim)
- **Coordenação:** APIs entre serviços precisam contrato claro
- **BD partilhada:** Risco de schema conflicts (mitigável com schemas separados)

### 💰 Custos
- **Infra:** Médio (4 containers: core + 3 tools)
- **Desenvolvimento:** Baixo (IAs muito eficientes Node)
- **Manutenção:** Médio (razoável)

### ⏱️ Timeline
- **Setup:** 2-3 dias (estruturar repos, API contracts)
- **Feature nova:** 1-2 semanas cada

---

## 🎯 RECOMENDAÇÃO: OPÇÃO 3 (HÍBRIDO)

### Por Quê?

**Para o Contexto do iaMenu:**

1. **€0 Capital** → Velocidade é crítica
   - Node.js = desenvolvimento 2-3x mais rápido (Claude/Gemini experts)

2. **Solo Founder** → Manutenibilidade importa
   - Core intocável (Java funciona, não quebra)
   - Features novas isoladas (bug não afeta core)

3. **Comunidade = Prioridade #1** → Stack certa para o problema
   - Fórum/grupos = Node.js tem libs excelentes (Socket.io, Express)
   - Real-time = Node é nativo (Java é complexo)

4. **Escalabilidade futura**
   - Comunidade cresce → escala só ela
   - Core mantém-se leve

5. **IAs como "equipa"**
   - Claude/Gemini são 10x melhores em Node que Java
   - Menos debug, mais features

---

## 📋 IMPLEMENTAÇÃO PROPOSTA (Opção 3)

### Estrutura de Repos

```
iamenu-monorepo/
├── core/                    # Java Spring Boot (existente)
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── services/
│   ├── community/           # Node.js + Express
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   ├── marketplace/         # Node.js + Express
│   │   └── ...
│   │
│   └── academy/             # Node.js + Express
│       └── ...
│
├── frontend/                # React (pode ser monorepo)
│   ├── apps/
│   │   ├── menu/           # iaMenu Core UI
│   │   ├── community/      # Hub UI
│   │   └── marketplace/    # Marketplace UI
│   └── packages/
│       └── shared-ui/      # Componentes partilhados
│
├── database/
│   ├── migrations/
│   └── seeds/
│
└── docker-compose.yml      # Orquestração completa
```

### Stack Novas Ferramentas (Node.js)

```
Framework:     Express.js (ou NestJS se quiseres estrutura)
Linguagem:     TypeScript (types partilhados com frontend)
ORM:           Prisma (moderno, type-safe, migrações fáceis)
Validation:    Zod (runtime type checking)
Testing:       Jest + Supertest
Real-time:     Socket.io (para chat/notificações)
```

### Comunicação

**1. Frontend → Backend:**
```
API REST + WebSockets (onde necessário)
```

**2. Service ↔ Service:**
```
HTTP REST (JSON)
Autenticação: JWT validado contra Core
```

**3. Todos → Database:**
```
PostgreSQL schemas separados:
- public.* (core - Java)
- community.* (hub - Node)
- marketplace.* (market - Node)
- academy.* (cursos - Node)
```

### Deployment (Docker Compose)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine

  core:
    build: ./core
    image: iamenu-api
    depends_on: [postgres]

  community:
    build: ./services/community
    depends_on: [postgres, core]

  marketplace:
    build: ./services/marketplace
    depends_on: [postgres, core]

  academy:
    build: ./services/academy
    depends_on: [postgres, core]

  frontend:
    build: ./frontend
    depends_on: [core, community, marketplace, academy]

  nginx:
    image: nginx:alpine
    # Reverse proxy para todos os serviços
```

---

## ⚠️ RISCOS E MITIGAÇÃO

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Services não comunicam bem | Média | Alto | API contracts claros (OpenAPI spec) |
| BD schema conflicts | Baixa | Médio | Schemas PostgreSQL separados |
| Auth complexo | Média | Alto | Core faz JWT, outros só validam |
| Deploy complicado | Baixa | Médio | Docker Compose (depois migrar K8s) |
| Dois stacks = confusão | Baixa | Baixo | Core intocável, só Node nas features |

---

## 🚀 PRÓXIMOS PASSOS (Se Aprovar Opção 3)

### Semana 1: Setup Infra
- [ ] Criar estrutura monorepo
- [ ] Setup PostgreSQL schemas
- [ ] Configurar Node.js boilerplate (Express + Prisma)
- [ ] Configurar autenticação (validar JWT do Core)
- [ ] Docker Compose para dev

### Semana 2-3: Hub Comunidade (MVP)
- [ ] Backend: Fórum + Grupos API
- [ ] Frontend: UI básica
- [ ] Deploy staging

### Semana 4-5: Marketplace (MVP)
- [ ] Backend: Fornecedores + Reviews API
- [ ] Frontend: UI básica
- [ ] Deploy staging

### Semana 6: Academia (MVP)
- [ ] Backend: Cursos + Progress API
- [ ] Frontend: Player vídeos
- [ ] Deploy staging

---

## 🤔 DECISÃO FINAL

**Eurico, qual opção preferes?**

- [ ] **Opção 1:** Monolito Java (tudo Spring Boot)
- [ ] **Opção 2:** Microservices (tudo separado)
- [ ] **Opção 3:** Híbrido (Core Java + Tools Node) ⭐ **Recomendado**

**Razão da escolha:** _________________

---

## 📎 REFERÊNCIAS

- [[03_ARQUITETURA/STACK_TECNICO]] - Stack atual
- [[02_PRD/SUMARIO_FERRAMENTAS]] - Ferramentas a desenvolver
- Spring Boot Best Practices: https://spring.io/guides
- Node.js Microservices: https://nodejs.org/en/docs/guides/

---

**Status:** Aguardando Decisão de Eurico
**Urgência:** Alta (PRDs dependem desta decisão)
**Impacto:** Define próximos 6-12 meses de desenvolvimento
