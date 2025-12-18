# Community API 🤝

> **Hub Comunidade iaMenu** - Forums, Groups, Networking

---

## 🎯 Features

- **Posts & Comments** (Reddit-style threading)
- **Groups** (Região, Tema, Tipo restaurante)
- **Profiles** (Perfis restauradores com badges)
- **Reactions** (👍 Like, ⭐ Útil, 🙏 Obrigado)
- **Notifications** (Email + in-app)
- **Moderation** (Report, hide posts)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
# Copy env
cp .env.example .env

# Edit .env com DATABASE_URL e JWT_SECRET corretos

# Run migrations
npm run prisma:migrate

# Seed grupos iniciais (15 grupos)
npm run prisma:seed
```

### 3. Run Development

```bash
npm run dev
```

**Porta:** `3001`
**Health:** `http://localhost:3001/health`
**API:** `http://localhost:3001/api/v1/community`

---

## 📂 Estrutura

```
services/community/
├── src/
│   ├── index.ts              # Entry point
│   ├── middleware/
│   │   ├── auth.ts           # JWT validation
│   │   └── errorHandler.ts  # Global error handler
│   ├── routes/               # (criar Semana 1)
│   │   ├── posts.ts
│   │   ├── comments.ts
│   │   ├── groups.ts
│   │   └── profiles.ts
│   ├── controllers/          # (criar Semana 1)
│   ├── services/             # (criar Semana 1)
│   └── types/
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/
│   └── seed.ts               # Seed 15 grupos
├── tests/
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md (este ficheiro)
```

---

## 🗄️ Database Schema

**Schema:** `community`

**Tables:**
- `posts` - Posts fórum
- `comments` - Comentários (threading até 3 níveis)
- `groups` - Grupos temáticos (Algarve, Turismo, etc)
- `group_memberships` - Users ↔ Groups
- `profiles` - Perfis restauradores
- `reactions` - Likes, úteis, obrigados
- `notifications` - Notificações users

---

## 📡 API Endpoints

### Public

```
GET  /health                              # Health check
GET  /api/v1/community/public/stats       # Estatísticas públicas
```

### Protected (JWT required)

```
# Posts
GET    /api/v1/community/posts            # Listar posts
POST   /api/v1/community/posts            # Criar post (rate limit: 3/dia)
GET    /api/v1/community/posts/:id        # Ver post
PATCH  /api/v1/community/posts/:id        # Editar (só autor)
DELETE /api/v1/community/posts/:id        # Apagar (autor ou mod)
POST   /api/v1/community/posts/:id/react  # Reagir (like/useful/thanks)

# Comments
GET    /api/v1/community/posts/:id/comments
POST   /api/v1/community/posts/:id/comments
PATCH  /api/v1/community/comments/:id
DELETE /api/v1/community/comments/:id

# Groups
GET    /api/v1/community/groups
POST   /api/v1/community/groups
GET    /api/v1/community/groups/:id
GET    /api/v1/community/groups/:id/posts
POST   /api/v1/community/groups/:id/join
DELETE /api/v1/community/groups/:id/leave

# Profiles
GET    /api/v1/community/profiles/:userId
PATCH  /api/v1/community/profiles/:userId
GET    /api/v1/community/profiles/:userId/activity

# Notifications
GET    /api/v1/community/notifications
PATCH  /api/v1/community/notifications/:id
POST   /api/v1/community/notifications/read-all
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test -- --coverage
```

---

## 🐳 Docker

```bash
# Build
docker build -t iamenu-community-api .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  iamenu-community-api
```

---

## 🚢 Deploy Railway

```bash
# Railway detecta automaticamente:
# - package.json → npm install
# - Dockerfile → Docker build

# Variables Railway:
# - DATABASE_URL
# - JWT_SECRET
# - PORT (Railway define automaticamente)
```

---

## 🔒 Auth

**JWT partilhado com Core Java:**
- Token gerado pelo Core (Spring Boot)
- Validado aqui via `JWT_SECRET` partilhado
- Header: `Authorization: Bearer <token>`

---

## 📊 Métricas

| Métrica | Target | Status |
|---------|--------|--------|
| **DAU** | 30% | 0 |
| **Posts/semana** | 20+ | 0 |
| **Respostas/post** | 3+ | 0 |
| **NPS** | >50 | - |

---

**Status:** 🚧 Boilerplate pronto, rotas Semana 1
**Owner:** Eurico + Claude
**Port:** 3001
