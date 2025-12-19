---
última_atualização: 2025-12-17 00:00
agent: Claude Code
versão: 1.0
status: Pronto para Usar
---

# SETUP RAILWAY - iaMenu Ecosystem (€0/mês)

> **Objetivo:** Deploy completo do iaMenu Ecosystem sem custos iniciais
> **Tempo:** 2-3 horas setup inicial
> **Custo:** €0/mês (500h grátis) → €5-10/mês quando crescer

---

## 🎯 O QUE VAMOS CRIAR:

```
Railway (Free Tier - €0/mês)
├── PostgreSQL (Database)
├── iaMenu Core API (Java Spring Boot)
├── Community API (Node.js)
├── Marketplace API (Node.js)
├── Academy API (Node.js)
└── Frontend React (Todas as apps)

URLs:
- iamenu-app.up.railway.app → Frontend
- iamenu-api.up.railway.app → Java Core
- community-api.up.railway.app → Hub
- marketplace-api.up.railway.app → Fornecedores
- academy-api.up.railway.app → Academia
```

**Depois migrar para domínios próprios:**
- app.iamenu.pt
- api.iamenu.pt
- comunidade.iamenu.pt
- etc.

---

## 📋 PRÉ-REQUISITOS:

### 1. Conta Railway
- [x] Criar conta: https://railway.app/
- [x] Usar GitHub para login (recomendado)
- [x] Verificar email

### 2. Conta GitHub
- [x] Ter conta GitHub (se não tens, criar)
- [ ] Repositório com código iaMenu Core (Java)
- [ ] Ou podemos criar repositórios novos

### 3. Ferramentas Locais (Opcional)
- [ ] Git instalado
- [ ] Railway CLI (opcional): `npm i -g @railway/cli`

---

## 🚀 PASSO-A-PASSO SETUP:

### FASE 1: Setup Inicial (30 min)

#### 1.1 Criar Projeto Railway

```
1. Aceder: https://railway.app/new

2. Clicar: "New Project"

3. Escolher: "Deploy PostgreSQL"
   - Nome: iamenu-database
   - Região: Europe West (Holanda - mais perto PT)

4. PostgreSQL criado automaticamente!
   ✅ URL de conexão gerada
   ✅ Credenciais automáticas
   ✅ Backup automático
```

**Copiar credenciais:**
```
DATABASE_URL=postgresql://postgres:...@....railway.app:5432/railway
```

---

#### 1.2 Deploy Java Core API

**Opção A: Via GitHub (Recomendado)**

```
1. No Railway: "+ New Service" → "GitHub Repo"

2. Conectar repositório do iaMenu Core

3. Railway detecta automaticamente:
   - Dockerfile (se existe)
   - Ou pom.xml (Maven)

4. Configurar variáveis ambiente:
   Variables → Add:
   - DATABASE_URL: [copiar do PostgreSQL]
   - OPENAI_API_KEY: [tua key OpenAI]
   - JWT_SECRET: [gerar random string]
   - PORT: 8080

5. Deploy automático!
```

**Opção B: Via CLI**

```bash
# No terminal, dentro do projeto Java:
railway login
railway init
railway up

# Configurar vars:
railway variables set DATABASE_URL="postgresql://..."
railway variables set OPENAI_API_KEY="sk-..."
```

**URL gerada:**
```
https://iamenu-api.up.railway.app
```

---

#### 1.3 Testar Java API

```bash
# Verificar health:
curl https://iamenu-api.up.railway.app/actuator/health

# Testar endpoint:
curl https://iamenu-api.up.railway.app/api/menu
```

**Deve retornar:** 200 OK ✅

---

### FASE 2: Deploy APIs Node.js (1 hora)

#### 2.1 Criar Estrutura Node.js

**Localmente, criar:**

```
services/
├── community/
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── marketplace/
│   └── ...
│
└── academy/
    └── ...
```

---

#### 2.2 Community API (Exemplo)

**`services/community/package.json`:**
```json
{
  "name": "iamenu-community-api",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.0.2"
  }
}
```

**`services/community/src/index.js`:**
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'community' });
});

// API Routes
app.get('/api/v1/community/forums', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM community.forums');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/community/forums', async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO community.forums (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Community API running on port ${PORT}`);
});
```

**`services/community/Dockerfile`:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

#### 2.3 Deploy no Railway

```
1. Push para GitHub:
   git add services/community
   git commit -m "Add community API"
   git push

2. Railway Dashboard:
   - "+ New Service"
   - Escolher mesmo repo
   - Root Directory: services/community

3. Variables:
   - DATABASE_URL: [mesmo do PostgreSQL]
   - JWT_SECRET: [mesmo do Core]
   - NODE_ENV: production

4. Deploy automático!
```

**URL:**
```
https://community-api.up.railway.app
```

**Testar:**
```bash
curl https://community-api.up.railway.app/health
```

---

#### 2.4 Repetir para Marketplace e Academy

```
Marketplace API:
- Root Directory: services/marketplace
- URL: https://marketplace-api.up.railway.app

Academy API:
- Root Directory: services/academy
- URL: https://academy-api.up.railway.app
```

---

### FASE 3: Deploy Frontend React (30 min)

#### 3.1 Configurar Build

**`frontend/package.json` adicionar:**
```json
{
  "scripts": {
    "build": "react-scripts build",
    "start": "serve -s build -l $PORT"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

#### 3.2 Deploy Railway

```
1. "+ New Service" → GitHub Repo
2. Root Directory: frontend
3. Build Command: npm run build
4. Start Command: npm start
5. Variables:
   - REACT_APP_API_URL: https://iamenu-api.up.railway.app
   - REACT_APP_COMMUNITY_URL: https://community-api.up.railway.app
   - REACT_APP_MARKETPLACE_URL: https://marketplace-api.up.railway.app
```

**URL:**
```
https://iamenu-app.up.railway.app
```

---

### FASE 4: Domínios Próprios (Quando Crescer)

#### 4.1 Configurar DNS

**No registador iamenu.pt (OVH?):**

```
Tipo  | Nome        | Valor
------|-------------|---------------------------
CNAME | app         | iamenu-app.up.railway.app
CNAME | api         | iamenu-api.up.railway.app
CNAME | comunidade  | community-api.up.railway.app
CNAME | marketplace | marketplace-api.up.railway.app
CNAME | academia    | academy-api.up.railway.app
```

#### 4.2 Configurar Railway

```
1. Cada serviço → Settings → Domains
2. "+ Custom Domain"
3. Adicionar: app.iamenu.pt
4. Railway gera SSL automático (Let's Encrypt)
5. Pronto! ✅
```

---

## 💰 GESTÃO DE CUSTOS:

### Free Tier (€0/mês)
```
Limite: 500h/mês execução
      = ~16h/dia ativo

Suficiente para:
- Desenvolvimento
- 2-3 restaurantes piloto
- Testes iniciais

Quando atingir limite:
→ Serviços pausam
→ Upgrade para Hobby Plan
```

### Hobby Plan (€5-10/mês)
```
Limite: Ilimitado
Recursos: 8GB RAM / 8 vCPU partilhados

Suficiente para:
- 10-50 restaurantes
- Produção inicial
- Crescimento

Trigger: 1º cliente pagar €88
```

### Pro Plan (€20+/mês)
```
Depois de 50+ restaurantes
Ou migrar para VPS OVH
```

---

## 📊 MONITORIZAÇÃO:

### Railway Dashboard

```
1. Métricas automáticas:
   - CPU usage
   - Memory
   - Network
   - Requests/min

2. Logs em tempo real:
   - Click no serviço → "Logs"
   - Ver erros, requests, etc.

3. Alertas:
   - Email quando crash
   - Webhook Discord/Slack
```

### Observability (Opcional)

```
Adicionar:
- Sentry (erros): sentry.io (grátis até 5k events)
- LogTail (logs): logtail.com (grátis 1GB)
- Uptime: uptimerobot.com (grátis 50 monitors)
```

---

## 🔐 SEGURANÇA:

### Variáveis Sensíveis

```
NUNCA commitar no Git:
- DATABASE_URL
- OPENAI_API_KEY
- JWT_SECRET
- Stripe keys

Railway guarda encriptado! ✅
```

### Secrets Management

```
Railway → Service → Variables
→ Tudo encriptado automaticamente
→ Não aparecem em logs
```

---

## 🚨 TROUBLESHOOTING:

### Deploy Falhou

```
1. Check logs:
   Service → Logs → Ver erro

2. Problemas comuns:
   - Port errado (usar $PORT, não hardcoded)
   - DATABASE_URL errado
   - Build command incorreto
   - Dependências faltam

3. Redeploy:
   Service → Deployments → Redeploy
```

### Out of Memory

```
Erro: "Killed" ou "OOM"

Solução:
1. Otimizar código (queries, memory leaks)
2. Upgrade Hobby Plan
3. Ou migrar VPS OVH
```

### 500h Limit Atingido

```
Solução:
1. Upgrade Hobby Plan (€5/mês)
2. Ou pausar serviços não críticos
3. Ou otimizar (reduzir replicas)
```

---

## 📋 CHECKLIST DEPLOY:

### Antes de Começar:
- [ ] Conta Railway criada
- [ ] Conta GitHub conectada
- [ ] Código no GitHub (ou pronto para push)
- [ ] OpenAI API Key disponível

### Deploy:
- [ ] PostgreSQL criado
- [ ] Java Core deployed
- [ ] Community API deployed
- [ ] Marketplace API deployed
- [ ] Academy API deployed
- [ ] Frontend deployed
- [ ] Todos serviços healthy

### Configuração:
- [ ] Variáveis ambiente configuradas
- [ ] DATABASE_URL em todos serviços
- [ ] JWT_SECRET partilhado
- [ ] CORS configurado
- [ ] SSL ativo (automático Railway)

### Testes:
- [ ] Health checks passam
- [ ] Menu Digital funciona
- [ ] APIs respondem
- [ ] Frontend carrega
- [ ] Auth funciona
- [ ] IA responde (GPT-4)

### Produção:
- [ ] Domínios configurados (quando crescer)
- [ ] Monitorização ativa
- [ ] Backups automáticos PostgreSQL
- [ ] Logs acessíveis

---

## 🔗 RECURSOS:

- **Railway Docs:** https://docs.railway.app/
- **Railway CLI:** https://docs.railway.app/develop/cli
- **Community:** https://discord.gg/railway
- **Status:** https://status.railway.app/

---

## 📞 SUPORTE:

**Se problemas:**
1. Railway Discord (resposta rápida)
2. Railway Docs (muito completos)
3. Perguntar-me (Claude Code) 🤖

---

**Status:** Pronto para usar
**Custo Inicial:** €0
**Timeline:** 2-3 horas setup
**Próximo Passo:** [[README_PRIMEIROS_PASSOS]]
