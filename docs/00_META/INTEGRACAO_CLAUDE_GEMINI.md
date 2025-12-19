---
última_atualização: 2025-12-19 18:30
agent: Claude Code + Eurico Alves
versão: 1.0
status: Ativo
---

# 🔗 Integração Claude + Gemini Agentes

> **Sistema Híbrido de IA para o Projeto iaMenu**
> Claude (Execução) + Gemini Agentes (Estratégia) = Máquina Completa

---

## ⚠️ REGRA OFICIAL DO PROJETO - "SALA DE CONSELHO"

**📜 PROTOCOLO DE COORDENAÇÃO (NÃO MUDA O ESTILO DE TRABALHO):**

Este documento (`INTEGRACAO_CLAUDE_GEMINI.md`) + `CHANGELOG.md` são a **SALA DE CONSELHO** do projeto.

### **🎯 IMPORTANTE - CADA AGENTE MANTÉM SEU ESTILO:**

**Estes documentos SÃO:**
- 📍 **Ponto de encontro** virtual entre Claude Code e Gemini LCI
- 🔍 **Visibilidade** do que cada agente está a fazer
- 🚫 **Evitar duplicação** de trabalho e sistemas paralelos
- 🔄 **Continuidade** entre sessões (não perder contexto)

**Estes documentos NÃO SÃO:**
- ❌ Mudança de processo de trabalho de cada agente
- ❌ Obrigação de mudar estilo de execução
- ❌ Burocracia que atrasa desenvolvimento

### **INÍCIO DE CADA SESSÃO:**
1. ✅ **CONSULTAR** `INTEGRACAO_CLAUDE_GEMINI.md` → Ver o que o outro agente fez
2. ✅ **CONSULTAR** `CHANGELOG.md` → Últimas alterações
3. ✅ **ENTENDER** contexto para evitar refazer trabalho já feito

### **DURANTE A SESSÃO:**
- **Claude Code:** Continua implementando código hands-on como sempre
- **Gemini LCI:** Continua planejamento estratégico como sempre
- **Eurico Alves:** Coordena e valida para evitar 2 sistemas paralelos

### **FIM DE CADA SESSÃO:**
1. ✅ **ATUALIZAR** `CHANGELOG.md` com alterações feitas
2. ✅ **ATUALIZAR** `INTEGRACAO_CLAUDE_GEMINI.md`:
   - Estado atual (o que completei)
   - Próximos passos (backlog atualizado)
   - Histórico da sessão (resumo rápido)
3. ✅ **COMMIT + PUSH** GitHub (se código foi alterado)

**🎯 Objetivo:** Coordenação sem burocracia. Cada agente trabalha do seu jeito, mas todos sabem o que os outros fizeram.

---

## 🎯 Visão Geral

Tens dois sistemas de IA complementares trabalhando no projeto iaMenu:

**Equipa:**
- **Eurico Alves** - Founder & Product Owner
- **Gemini LCI** - Agente Estratégico (Planeamento, Análise, Decisões)
- **Claude Code** - Agente de Execução (Implementação, Código, Deploy)

---

## 🤝 Especialidades e Autonomia (Ambos Podem Fazer Tudo!)

**⚠️ IMPORTANTE:** Esta divisão mostra **especialidades**, NÃO restrições. Ambos os agentes têm autonomia total para planear E executar!

### **Gemini LCI**
**Especialidade:** Estratégia e planeamento
**Pode fazer:**
- ✅ Planeamento de alto nível e análise de requisitos
- ✅ Decisões arquiteturais estratégicas e PRDs
- ✅ Análise de mercado e validação de conceitos
- ✅ **Implementação de código quando fizer sentido**
- ✅ **Prototipagem rápida e testes**
- ✅ **Executar features completas autonomamente**

### **Claude Code**
**Especialidade:** Execução e implementação
**Pode fazer:**
- ✅ Implementação de código (TypeScript, Node.js, React, Java)
- ✅ Setup de infraestrutura (Railway, PostgreSQL, Docker)
- ✅ Debugging e resolução de problemas técnicos
- ✅ **Análise estratégica e decisões arquiteturais**
- ✅ **Planeamento de features e PRDs**
- ✅ **Research e validação técnica**

### **Eurico Alves (Product Owner)**
- ✅ Aprovação de PRDs e decisões estratégicas
- 🎯 Definição de prioridades
- 📣 Feedback e validação de features
- 🔄 Coordenação Claude ↔ Gemini (evitar duplicação)
- 💼 Visão de negócio e produto

---

**🎯 Regra de Ouro:** Documentos servem para **coordenação**, NÃO para restringir. Ambos têm liberdade total!

---

## 📊 Estado Atual do Projeto

**Última Atualização:** 2025-12-19 18:30
**Responsável:** Claude Code + Eurico Alves

### **Fase Atual:** Desenvolvimento MVP Community Hub

**Milestones Completados (Hoje 2025-12-19):**

#### **Milestone 1 - GET /posts (14:30)**
- ✅ Railway PostgreSQL configurado (production database)
- ✅ Prisma migrations executadas (7 tabelas criadas)
- ✅ Endpoint GET /posts funcionando
- ✅ Seed: 3 posts exemplo

#### **Milestone 2 - POST /posts (17:25)**
- ✅ JWT authentication end-to-end
- ✅ Endpoint /auth/test-token (development only)
- ✅ POST /posts criando posts autenticados
- ✅ Database insert validado (4 posts total)

#### **Milestone 3 - GET /groups (18:10)**
- ✅ Groups Service/Controller/Router completo
- ✅ 15 grupos seeded (5 regionais + 10 temáticos)
- ✅ GET /groups funcionando com pagination
- ✅ Filter by category implementado

---

## 🏗️ Arquitetura Atual

### **Stack Técnico:**
- **Backend Core:** Java Spring Boot (menuia existente - não tocado)
- **Backend Services:** Node.js 18 + TypeScript + Express.js
- **Database:** PostgreSQL 16 (Railway)
- **ORM:** Prisma 5.22.0 (multiSchema)
- **Authentication:** JWT (shared secret entre Java Core e Node Services)
- **Deployment:** Railway (PostgreSQL + Services)

### **Estrutura Repositórios:**
- **GitHub:** https://github.com/DaSilvaAlves/iamenu-ecosystem
- **Último Commit:** `2a2ebfa` (2025-12-19 18:30)
- **Commits Hoje:** 2 (inicial `6012737` + milestones `2a2ebfa`)

---

## 📦 Community API - Estado Detalhado

### **Endpoints Implementados (11 total):**

**Health:**
- GET /health → Status API

**Auth (Development):**
- GET /auth/test-token → Gera JWT válido 24h (dev only)

**Posts:**
- GET /posts → Listar posts (paginado)
- GET /posts/:id → Detalhes post
- POST /posts → Criar post (autenticado)
- PATCH /posts/:id → Atualizar post (apenas autor)
- DELETE /posts/:id → Apagar post (apenas autor)

**Groups:**
- GET /groups → Listar grupos (paginado)
- GET /groups/:id → Detalhes grupo + últimos 10 posts
- GET /groups/category/:category → Filtrar por region/theme
- POST /groups → Criar grupo (autenticado)
- PATCH /groups/:id → Atualizar grupo (apenas criador)
- DELETE /groups/:id → Apagar grupo (apenas criador)

### **Database State:**
- **Posts:** 4 (3 seed + 1 teste POST)
- **Grupos:** 15 (5 regionais + 10 temáticos)
- **Tabelas:** 7 (posts, comments, groups, group_memberships, profiles, reactions, notifications)

**Grupos Regionais (5):**
1. Algarve - Turismo, praias, gastronomia
2. Lisboa - Capital, turismo urbano
3. Porto - Tradição, inovação, vinhos
4. Açores - Insularidade, produtos locais
5. Madeira - Turismo, espetada, hospitalidade

**Grupos Temáticos (10):**
1. Turismo & Hotelaria
2. Restauração Rápida
3. Fine Dining
4. Cafés & Pastelarias
5. Vegetariano & Vegano
6. Gestão & Finanças
7. Marketing Digital
8. Recursos Humanos
9. Sustentabilidade
10. Tecnologia & IA

### **Ficheiros Implementados:**

**Services (Business Logic):**
- `src/services/posts.service.ts` → CRUD posts + pagination
- `src/services/groups.service.ts` → CRUD groups + filter by category

**Controllers (HTTP Handlers):**
- `src/controllers/auth.controller.ts` → JWT test token generator
- `src/controllers/posts.controller.ts` → Posts endpoints
- `src/controllers/groups.controller.ts` → Groups endpoints

**Routes (Express Routers):**
- `src/routes/auth.ts` → Auth routes
- `src/routes/posts.ts` → Posts routes (public + protected)
- `src/routes/groups.ts` → Groups routes (public + protected)

**Database:**
- `prisma/schema.prisma` → Schema multiSchema (community)
- `prisma/seed.ts` → 3 posts + 15 grupos
- `prisma/migrations/20251219140234_init/` → Initial migration

**Config:**
- `package.json` → Prisma.seed configurado
- `.env` → DATABASE_URL + JWT_SECRET

---

## 🎯 Próximos Passos (Backlog)

**Prioridade ALTA (Semana 1-2):**
- [ ] GET /posts/:id/comments → Listar comentários de um post
- [ ] POST /posts/:id/comments → Criar comentário
- [ ] POST /groups/:id/join → User join grupo (membership)
- [ ] GET /groups/:id/members → Listar membros de um grupo
- [ ] Associar posts existentes a grupos

**Prioridade MÉDIA (Semana 3-4):**
- [ ] Marketplace API (Service/Controller/Router)
- [ ] Marketplace seed (fornecedores exemplo)
- [ ] Academy API (Service/Controller/Router)
- [ ] Academy seed (3 cursos piloto)

**Prioridade BAIXA (Semana 5+):**
- [ ] Frontend React (Community Hub básico)
- [ ] Deploy Railway staging (ambiente público)
- [ ] Notifications system (real-time)
- [ ] Profile management

---

## 🔄 Workflow de Colaboração

### **Quando Eurico pede análise estratégica:**
```
Eurico → Gemini LCI
         ↓ (Análise + Recomendações)
Gemini → Eurico
         ↓ (Aprovação)
Eurico → Claude Code (Implementação)
```

### **Quando Eurico pede implementação:**
```
Eurico → Claude Code
         ↓ (Se precisar decisão arquitetural)
Claude → Eurico → Gemini LCI
         ↓ (Depois de decisão)
Claude → Código + Commit + Push
```

### **Workflow Ideal:**
1. **Gemini:** Planeia feature (PRD, arquitetura, decisões)
2. **Eurico:** Aprova plano
3. **Claude:** Implementa código seguindo plano
4. **Claude:** Commit + Push GitHub
5. **Claude:** Atualiza CHANGELOG.md + este documento (INTEGRACAO_CLAUDE_GEMINI.md)
6. **Eurico:** Testa e valida

---

## 📋 Checklist Fim de Sessão (Claude Code)

Ao final de cada sessão de desenvolvimento, Claude deve:

- [ ] Código commitado e pushed para GitHub
- [ ] CHANGELOG.md atualizado com milestone
- [ ] INTEGRACAO_CLAUDE_GEMINI.md atualizado (Estado Atual + Próximos Passos)
- [ ] Ficheiros .env seguros (não commitados)
- [ ] API rodando localmente (se aplicável)
- [ ] Database seeded (se novos dados)
- [ ] README atualizado (se nova feature significativa)

---

## 📝 Histórico de Sessões

### **2025-12-19 (14:30 - 18:30) - Claude Code + Eurico**
**Duração:** 4 horas
**Objetivo:** Implementar Community API - Posts + Groups endpoints

**Resultados:**
- ✅ 3 Milestones completos (GET /posts, POST /posts, GET /groups)
- ✅ 11 endpoints funcionando
- ✅ 15 grupos + 4 posts seeded
- ✅ JWT authentication validada end-to-end
- ✅ Arquitetura Service → Controller → Router implementada
- ✅ Commit `2a2ebfa` pushed para GitHub
- ✅ CHANGELOG.md atualizado com 3 milestones

**Ficheiros Criados:** 11 novos + 4 modificados = 15 alterações
**Linhas Código:** +1265 / -18
**Database:** Railway PostgreSQL production-ready

**Decisões Técnicas:**
- Escolhido Railway PostgreSQL (€0 Free Tier) vs VPS OVH
- Prisma multiSchema preview feature ativada
- JWT shared entre Java Core e Node Services
- Seed configurado em package.json (prisma.seed)
- GPG signing desativado para commits (--no-gpg-sign)

**Próxima Sessão:**
- Implementar comentários (GET/POST /posts/:id/comments)
- Ou membership (POST /groups/:id/join)
- Ou deploy Railway staging

---

## 🔗 Links Úteis

**GitHub:**
- Repo: https://github.com/DaSilvaAlves/iamenu-ecosystem
- Último commit: https://github.com/DaSilvaAlves/iamenu-ecosystem/commit/2a2ebfa

**Railway:**
- Database: gondola.proxy.rlwy.net:59722
- Project: grateful-amazement

**Obsidian:**
- CHANGELOG: `00_META/CHANGELOG.md`
- PRDs: `02_PRD/PRD_Hub_Comunidade.md`, `PRD_Marketplace_Fornecedores.md`, `PRD_Academia.md`
- Stack Técnico: `03_ARQUITETURA/STACK_TECNICO.md`

---

**Última atualização:** 2025-12-19 18:30
**Próxima revisão:** Ao final da próxima sessão de desenvolvimento
