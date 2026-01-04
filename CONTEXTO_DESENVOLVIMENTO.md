# iaMenu Ecosystem - Contexto de Desenvolvimento

**Diretório de Trabalho:** `C:\Users\XPS\Documents\iamenu-ecosystem\`

## Estrutura do Projeto

Este é o **iaMenu Ecosystem**, uma plataforma SaaS para restaurantes que integra múltiplos módulos:

### Serviços Backend (Node.js/Express/Prisma)
- **Community Service** (porta 3004) - Rede social, posts, grupos
- **Marketplace Service** (porta 3005) - Fornecedores, produtos, cotações
- **Business Intelligence** (porta 3002) - Dashboards e analytics
- **Academy** - Cursos e formação

### Frontend (React + Vite)
- **Localização:** `frontend/apps/prototype-vision/`
- **Porto:** 5173
- **Stack:** React, React Router, Tailwind CSS, Framer Motion

## Estado Atual do Projeto

### ✅ Módulos Implementados e Funcionais

1. **Community (Rede Social)**
   - Posts, comentários, likes
   - Grupos por região/tema
   - Perfis de utilizador com upload de fotos
   - Feed em tempo real

2. **Marketplace Fornecedores**
   - Listagem de fornecedores
   - Detalhes de fornecedor
   - Sistema de reviews
   - Cotações (RFQ)
   - **NOTA:** Upload de imagens do perfil do fornecedor tem problema (ver secção Problemas)

3. **Reputação Online** ⭐ NOVO - Recém Integrado
   - Inbox unificada de reviews (Google, TripAdvisor, Privado)
   - Geração automática de respostas com Gemini AI
   - 3 tons de resposta: Profissional, Amigável, Empático
   - Sistema de alertas configurável
   - Dashboard com métricas
   - **Localização:** `frontend/apps/prototype-vision/src/views/ReputacaoOnlineView.jsx`

4. **Outros Módulos**
   - Dashboard BI
   - Food Cost & Fichas Técnicas
   - Marketing Planner AI
   - GastroLens (Computer Vision)
   - Academia/Aulas

### 🚧 Problemas Pendentes

#### 1. Upload de Imagens do Fornecedor (Marketplace) - NÃO RESOLVIDO

**Descrição:** O upload de imagens de perfil (logo) e capa (header) do fornecedor não está a guardar no banco de dados. Retorna erro 500.

**Endpoint:** `PATCH /api/v1/marketplace/suppliers/:id`

**O que foi feito:**
- ✅ Adicionado campo `headerImageUrl` ao schema do Prisma
- ✅ Executado `prisma db push`
- ✅ Verificado que arquivos são salvos no diretório `/uploads`
- ✅ Código frontend está correto (mesmo padrão do Community que funciona)

**O que falta investigar:**
- Logs específicos do servidor no momento do erro
- Possível problema com tipo de dados `minOrder` (Decimal vs String)
- Possível problema com parsing de JSON das categories/certifications
- Verificação de todos os campos obrigatórios

**Ficheiros relevantes:**
- Backend: `services/marketplace/src/controllers/suppliers.controller.ts`
- Backend: `services/marketplace/src/services/suppliers.service.ts`
- Frontend: `frontend/apps/prototype-vision/src/views/ProfilesTab.jsx`
- Schema: `services/marketplace/prisma/schema.prisma`

**Referência funcional:** Upload de usuário em Community Service funciona perfeitamente
- `services/community/src/controllers/profiles.controller.ts`
- `frontend/apps/prototype-vision/src/views/ProfileView.jsx`

**Documentação:** Detalhes completos em `PROBLEMAS_PENDENTES.md`

## Últimos Commits (04/01/2026)

```
93dd2c6 - chore(deps): adicionar @google/genai para módulo Reputação Online
ee2b3ff - feat(reputacao-online): integrar módulo de Reputação Online no ecosystem
c053084 - feat(marketplace): adicionar campo headerImageUrl ao schema Supplier
```

## Configuração do Ambiente

### Variáveis de Ambiente
**Localização:** `frontend/apps/prototype-vision/.env`

```env
GEMINI_API_KEY=AIzaSyD82Qll9NZwMKmbPUeMX6ifeNkKbuaNCTs
VITE_GEMINI_API_KEY=AIzaSyD82Qll9NZwMKmbPUeMX6ifeNkKbuaNCTs
```

### Como Iniciar

```bash
# Frontend
cd C:\Users\XPS\Documents\iamenu-ecosystem\frontend\apps\prototype-vision
npm run dev

# Backend Marketplace (se necessário)
cd C:\Users\XPS\Documents\iamenu-ecosystem\services\marketplace
npm run dev

# Backend Community (se necessário)
cd C:\Users\XPS\Documents\iamenu-ecosystem\services\community
npm run dev
```

## Padrões e Convenções

### Estrutura de Views
```
src/views/
├── NomeDaView.jsx (componente principal)
└── nome-da-view/ (sub-componentes)
    ├── Componente1.jsx
    ├── Componente2.jsx
    ├── types.js
    └── constants.js
```

### Estilo Visual
- **Cores principais:**
  - Primary: `#F2542D` (laranja)
  - Background: `#0c0c0c` / `#1A1A1A`
  - Border: `border-white/5`
- **Tipografia:** Font-black, uppercase, tracking-tighter para títulos
- **Componentes:** Glass panels, rounded-xl, shadow-lg

### Commits
- Usar conventional commits: `feat:`, `fix:`, `chore:`
- Incluir footer: "🤖 Generated with [Claude Code](https://claude.com/claude-code)"
- Co-autor: "Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

## Próximas Tarefas Sugeridas

1. **URGENTE:** Resolver problema de upload de imagens do fornecedor
   - Adicionar logging temporário
   - Testar e capturar erro específico
   - Comparar linha a linha com Community Service

2. **Reputação Online - Melhorias:**
   - Conectar com APIs reais (Google Business, TripAdvisor)
   - Implementar backend para persistir reviews
   - Sistema de QR codes para feedback privado
   - Publicação automática de respostas nas plataformas

3. **Marketplace:**
   - Sistema de barganha coletiva
   - Histórico de preços
   - Comparação de fornecedores

4. **Geral:**
   - Integração entre módulos
   - Sistema de notificações unificado
   - Melhorar performance e UX

## Documentação Importante

- **PRDs:** `docs/02_PRD/`
- **Reputação Online PRD:** `docs/reputação-online/Gestor de Reputação Online (para restaurantes).pdf`
- **Problemas Pendentes:** `PROBLEMAS_PENDENTES.md`

## Stack Tecnológico

**Frontend:**
- React 19
- React Router
- Tailwind CSS
- Framer Motion
- Lucide Icons / Material Symbols

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer (upload de ficheiros)

**IA/ML:**
- Google Gemini AI (geração de respostas)
- OpenAI GPT (marketing, outros módulos)

---

## Como Usar Este Documento

Ao iniciar uma nova sessão de desenvolvimento, copia e cola o seguinte prompt:

**"Estou a trabalhar no iaMenu Ecosystem. Lê o ficheiro CONTEXTO_DESENVOLVIMENTO.md em C:\Users\XPS\Documents\iamenu-ecosystem\ para contexto completo do projeto. Estou pronto para continuar o desenvolvimento."**
