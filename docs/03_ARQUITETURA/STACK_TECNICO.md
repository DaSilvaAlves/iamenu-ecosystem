---
última_atualização: 2025-12-16 22:30
agent: Claude Code (análise automática + input Eurico)
versão: 1.0
status: Em Revisão
---

# STACK TÉCNICO - iaMenu Ecosystem

> **Fonte:** Análise de iamenu.pt + app.iamenu.pt + input de Eurico
> **Objetivo:** Documentar stack atual para guiar desenvolvimento de novas ferramentas

---

## 📊 VISÃO GERAL

| Componente | Tecnologia | Status |
|------------|------------|--------|
| **Site Marketing** | WordPress + Elementor | ✅ Produção |
| **App Frontend** | React + CoreUI | ✅ Produção |
| **Backend** | Java Spring Boot | ✅ Confirmado |
| **Base Dados** | PostgreSQL 16 | ✅ Confirmado |
| **IA** | OpenAI GPT-4-Turbo | ✅ Confirmado |
| **Autenticação** | Custom JWT | ✅ Confirmado |
| **Pagamentos** | Stripe | ✅ Confirmado |
| **Deployment** | Docker (compose) | ✅ Confirmado |

---

## 🌐 SITE DE MARKETING (iamenu.pt)

### Stack Identificado

**CMS & Builder:**
- ✅ **WordPress** (CMS)
- ✅ **Elementor** v3.32.4 (page builder)
- ✅ **Elementor Pro** (extensões premium)

**Performance:**
- ✅ **WP Rocket** v2.0.4 (caching, lazy loading)

**Frontend:**
- ✅ **JavaScript** vanilla
- ✅ **jQuery** (legacy support)
- ✅ **Lottie** animations

**Pagamentos:**
- ✅ **Stripe** (checkout links)
- ✅ **MB Way** (integração planeada PT)
- ✅ **Multibanco** (integração planeada PT)

**Comunicação:**
- ✅ **WhatsApp API** (`wa.me` links)

**Analytics:**
- ✅ **Google Analytics** (implied)

**Outros:**
- REST API endpoints (`wp-json/`)
- RGPD compliance
- Responsive design (mobile-first)

### Função
Landing page, pricing, ROI calculator, contacto, conversão de leads

---

## 📱 APP iaMenu CORE (app.iamenu.pt)

### Stack Identificado

**Frontend:**
- ✅ **React** (framework principal)
- ✅ **CoreUI** (UI library/design system)
- ✅ **Bootstrap** (base CSS)
- ✅ **Font Awesome 6** (ícones)

**Tipografia:**
- ✅ **Google Fonts:** Sora + Poppins

**Features Identificadas:**
- Dark mode support (CSS variables)
- Design responsivo (mobile/tablet/desktop)
- Aplicação SPA (Single Page Application)

### ✅ STACK CONFIRMADO (Resposta de Eurico)

**Backend:**
- ✅ **Linguagem:** Java
- ✅ **Framework:** Spring Boot
- ✅ **Build:** Maven (pom.xml confirmado)
- ✅ **Deployment:** Docker (iamenu-api image)

**Base de Dados:**
- ✅ **Tipo:** PostgreSQL
- ✅ **Versão:** 16-alpine (Docker)
- ✅ **ORM/JPA:** Spring Data JPA (assumido pelo Spring Boot)
- ❓ **Hosting:** A definir (local? AWS RDS? Railway?)

**IA:**
- ✅ **Provider:** OpenAI
- ✅ **Modelo Principal:** GPT-4-Turbo
- ✅ **Modelo Alternativo:** GPT-3.5-Turbo (fallback)
- ✅ **Config:** `openai.api-key` em application.yaml
- ✅ **Features IA:**
  - Recomendações pratos
  - Chat multilíngue (6 idiomas)
  - Análise comportamento
  - Geração descrições pratos

**Autenticação:**
- ✅ **Sistema:** Custom (JWT - JSON Web Tokens)
- ✅ **Biblioteca:** io.jsonwebtoken (confirmado pom.xml)
- ❓ **OAuth providers:** A confirmar
- ❓ **MFA:** A confirmar

**Pagamentos:**
- ✅ **Gateway:** Stripe
- ❓ **Integração:** Stripe Checkout / API / Webhooks?
- ❓ **Gestão subscrições:** Sim/Não?

**Deployment:**
- ✅ **Containerização:** Docker
- ✅ **Orchestração:** docker-compose (docker-compose-prod.yml.tmpl)
- ✅ **Images:**
  - Backend: `iamenu-api` (custom)
  - Database: `postgres:16-alpine` (oficial)

### ❓ AINDA A DEFINIR

**Hosting & Infra:**
- ❓ **Frontend:** Onde está hospedado?
- ❓ **Backend:** AWS / Google Cloud / Railway / DigitalOcean?
- ❓ **Database:** Mesma infra ou separado?
- ❓ **CDN:** Cloudflare? AWS CloudFront?

**Integrações:**
- ❓ **POS Systems:** Qual? API própria? Webhooks?
- ❓ **Email:** SendGrid / Mailgun / AWS SES / SMTP?
- ❓ **SMS:** Twilio / Outro?
- ❓ **Analytics:** Mixpanel / Amplitude / Google Analytics?

---

## 🔧 STACK RECOMENDADO PARA NOVAS FERRAMENTAS

### Opção A: Full JavaScript/TypeScript (Se backend é Node)

**Frontend:**
```
React (já usa) + TypeScript
Next.js 14 (App Router) para SSR/SEO
Tailwind CSS (mais moderno que Bootstrap/CoreUI?)
Shadcn/ui (componentes)
Zustand ou Jotai (state management leve)
```

**Backend:**
```
Node.js + TypeScript
NestJS (estruturado, escalável)
Prisma (ORM moderno)
PostgreSQL (via Supabase?)
```

**Vantagens:**
- ✅ Mesma linguagem (TS) em toda stack
- ✅ Partilha de types frontend-backend
- ✅ Equipa pequena (Eurico + IAs) = menos contexto switching

---

### Opção B: Python Backend (Se já usa Python)

**Frontend:**
```
React (manter atual)
+ Next.js para features novas
```

**Backend:**
```
Python
FastAPI (moderno, rápido, typing)
SQLAlchemy (ORM)
PostgreSQL
```

**Vantagens:**
- ✅ Python excelente para IA/ML
- ✅ FastAPI async por defeito
- ✅ Ecosistema rico (pandas, scikit-learn)

---

### Opção C: Supabase All-in (Se quer rapidez)

**Stack Completo:**
```
Frontend: React/Next.js
Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
IA: OpenAI API / Claude API
Payments: Stripe
Hosting: Vercel (frontend) + Supabase (backend)
```

**Vantagens:**
- ✅ Setup rápido (1 dia)
- ✅ Grátis até crescer
- ✅ Auth pronto
- ✅ Real-time out-of-box
- ✅ Postgres completo

**Desvantagens:**
- ❌ Vendor lock-in
- ❌ Menos controlo customização

---

## 🎯 DECISÕES A TOMAR (EURICO)

### CRÍTICAS (Bloqueiam PRDs):

1. **Backend atual do iaMenu Core é:**
   - [ ] Node.js
   - [ ] Python
   - [ ] PHP
   - [ ] Outro: _______

2. **Base de Dados atual é:**
   - [ ] PostgreSQL (onde? Supabase / AWS RDS / Outro)
   - [ ] MySQL
   - [ ] MongoDB
   - [ ] Outro: _______

3. **IA atual usa:**
   - [ ] OpenAI (qual modelo?)
   - [ ] Claude (qual modelo?)
   - [ ] Gemini (qual modelo?)
   - [ ] Outro: _______

4. **Autenticação atual:**
   - [ ] Supabase Auth
   - [ ] Auth0
   - [ ] Firebase Auth
   - [ ] JWT custom
   - [ ] Outro: _______

---

### IMPORTANTES (Ajudam planeamento):

5. **Hosting atual:**
   - Frontend: _________________
   - Backend: __________________
   - Database: _________________

6. **Custos mensais infra atual:**
   - €_______ /mês

7. **Código fonte:**
   - [ ] Tenho acesso (partilhar repo GitHub)
   - [ ] Posso partilhar screenshots arquitetura
   - [ ] Prefiro descrever verbalmente

---

## 📋 PRÓXIMOS PASSOS

### Assim que Eurico responder:

- [ ] Atualizar este documento com stack completo
- [ ] Criar diagrama arquitetura
- [ ] Definir stack para ferramentas novas (manter consistência)
- [ ] Atualizar PRDs com integrações específicas
- [ ] Documentar APIs/endpoints existentes

---

## 🔗 REFERÊNCIAS

- Site Marketing: https://iamenu.pt
- App iaMenu Core: https://app.iamenu.pt
- [[01_BRIEFING/PERGUNTAS_CRITICAS_PRDs]] - Perguntas relacionadas
- [[02_PRD/]] - PRDs aguardam esta informação

---

**Status:** 🟡 Parcialmente Documentado
**Bloqueador:** Falta input Eurico sobre backend/DB/IA
**Urgência:** 🔴 Alta (PRDs dependem disto)
