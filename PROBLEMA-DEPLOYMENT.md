# 🚨 PROBLEMA: Deployment Vercel vs Localhost - Dados Diferentes

## Contexto do Projeto

**Projeto:** iaMenu Ecosystem - Plataforma para restauração portuguesa  
**Arquitetura:** Monorepo com backend Node.js (Express + Prisma) e frontend React  
**Deployment:**
- Frontend: Vercel (`https://prototype-vision.vercel.app`)
- Backend API: Railway (`https://iamenucommunity-api-production.up.railway.app`)
- Base de Dados: PostgreSQL (local via Docker + Railway PostgreSQL)

## Problema Atual

O projeto funciona **perfeitamente em localhost** mas mostra **dados completamente diferentes** em produção (Vercel).

### Localhost (✅ Funciona Corretamente)
- URL: `http://localhost:5173/perfil`
- Backend: `http://localhost:3004` (API local)
- Base de Dados: PostgreSQL local (Docker)
- **Dados:** Utilizador "ResTest" com 2 Posts, 32 XP, 1 Comentário, 2 Reações
- **Status:** Tudo funciona, dados corretos

### Produção Vercel (❌ Dados Errados)
- URL: `https://prototype-vision.vercel.app/perfil`
- Backend: `https://iamenucommunity-api-production.up.railway.app`
- Base de Dados: PostgreSQL Railway
- **Dados:** Utilizador "Restaurador" com 0 Posts, 0 XP, "Membro desde Invalid Date"
- **Status:** Sem erros CORS, API responde, mas dados completamente diferentes

## O Que Já Foi Feito

1. ✅ **CORS corrigido** - API Railway aceita requests do Vercel
2. ✅ **API online** - Endpoint `/health` responde corretamente
3. ✅ **Frontend configurado** - Usa URL Railway em produção
4. ✅ **Deployments bem-sucedidos** - Railway e Vercel sem erros

## Diagnóstico

O problema é que **Railway PostgreSQL tem dados diferentes** da base de dados local:

- **BD Local (Docker):** Tem dados de teste/desenvolvimento
- **BD Railway:** Vazia ou com dados diferentes/antigos

## Estrutura do Projeto

```
iamenu-ecosystem/
├── services/
│   └── community/
│       ├── src/index.ts          # API Express
│       ├── prisma/
│       │   ├── schema.prisma     # Schema BD
│       │   └── seed.ts           # Script seed dados
│       └── .env                  # Variáveis locais
│
├── frontend/apps/prototype-vision/
│   └── src/config/api.js         # Configuração API URLs
│
└── .env                          # Variáveis raiz (local)
```

## Configuração Atual

### Railway Variables
```
DATABASE_URL = postgresql://postgres:jMHJNsoKMsXCjuuHNJTouoWqrvzgYyRn@gondola.proxy.rlwy.net:59722/railway
JWT_SECRET = T9NTWid03o5sBTtL
CORS_ORIGIN = https://prototype-vision.vercel.app
NODE_ENV = production
PORT = ${{PORT}}
```

### Frontend (api.js)
```javascript
COMMUNITY_API: import.meta.env.PROD 
  ? 'https://iamenucommunity-api-production.up.railway.app/api/v1/community' 
  : 'http://localhost:3004/api/v1/community'
```

## Objetivo

**Fazer o site Vercel mostrar os mesmos dados que localhost.**

Opções consideradas:
1. Popular BD Railway com seed scripts (dados de teste)
2. Migrar dados locais para Railway (dump/restore)
3. Verificar se migrações Prisma foram aplicadas no Railway

## Ficheiros Relevantes

- `services/community/src/index.ts` - Servidor Express
- `services/community/prisma/schema.prisma` - Schema BD
- `services/community/prisma/seed.ts` - Seed dados teste
- `frontend/apps/prototype-vision/src/config/api.js` - Config API
- `services/community/.env.railway.backup` - Backup vars Railway

## Questão Principal

**Como sincronizar a base de dados Railway com os dados locais para que o site Vercel mostre os mesmos dados que localhost?**

---

**Nota:** O utilizador quer uma solução clara e direta, não mais planos. Precisa que o site em produção funcione exatamente como localhost para apresentar numa imersão.
