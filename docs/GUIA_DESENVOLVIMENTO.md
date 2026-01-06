# Guia de Desenvolvimento - iaMenu Ecosystem

> Guia rápido para desenvolvedores que trabalham no projeto

## 🚀 Início Rápido

### 1. Clonar e Instalar
```bash
git clone https://github.com/DaSilvaAlves/iamenu-ecosystem.git
cd iamenu-ecosystem
npm install
```

### 2. Configurar Ambiente
```bash
cp .env.example .env
# Editar .env e adicionar variáveis necessárias
```

### 3. Iniciar Base de Dados
```bash
docker compose up postgres -d
```

### 4. Executar Migrações
```bash
# Community
cd services/community
npx dotenv -e ../../.env npx prisma migrate dev
cd ../..

# Marketplace
cd services/marketplace
npx dotenv -e ../../.env npx prisma migrate dev
cd ../..

# Business
cd services/business
npx dotenv -e ../../.env npx prisma migrate dev
cd ../..
```

### 5. Seed de Dados (Opcional)
```bash
# Business (cria restaurante de teste)
cd services/business
npm run prisma:seed
cd ../..

# Community (cria posts e grupos de teste)
cd services/community
npm run prisma:seed
cd ../..
```

### 6. Iniciar Serviços
```bash
npm run dev
```

Aceder a: http://localhost:5173

---

## 📁 Estrutura do Código

### Services (Backend)
```
services/
├── community/          # API Comunidade (porta 3004)
│   ├── src/
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Definição de rotas
│   │   └── middleware/      # Auth, validação, etc
│   └── prisma/
│       ├── schema.prisma    # Schema da BD
│       └── migrations/      # Migrações
│
├── marketplace/        # API Marketplace (porta 3005)
│   └── [mesma estrutura]
│
└── business/          # API Business (porta 3002)
    └── [mesma estrutura]
```

### Frontend
```
frontend/apps/prototype-vision/
├── src/
│   ├── views/              # Páginas principais
│   │   ├── CommunityView.jsx
│   │   ├── Marketplace.jsx
│   │   └── DashboardBI.jsx
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Sidebar.jsx
│   │   └── TopBar.jsx
│   ├── services/           # Clientes API
│   │   ├── api.js          # Community API
│   │   ├── marketplaceAPI.js
│   │   └── businessAPI.js
│   └── config/             # Configurações
│       └── devToken.js     # Token de dev
```

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev                    # Iniciar todos os serviços
npm run dev:frontend           # Apenas frontend
npm run dev:community          # Apenas community API
npm run dev:marketplace        # Apenas marketplace API
npm run dev:business           # Apenas business API
```

### Base de Dados
```bash
# Prisma Studio (visualizar dados)
cd services/[service-name]
npx prisma studio

# Criar migração
npx prisma migrate dev --name [nome-da-migracao]

# Reset BD (CUIDADO!)
npx prisma migrate reset

# Gerar Prisma Client
npx prisma generate
```

### Git
```bash
git status                     # Ver alterações
git add .                      # Adicionar todos ficheiros
git commit -m "mensagem"       # Commit
git push origin main           # Push para GitHub
```

---

## 🎨 Convenções de Código

### Commits
Usar formato conventional commits:
```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
refactor: refatorar código
style: alterações de estilo
test: adicionar testes
chore: tarefas de manutenção
```

Exemplos:
```bash
git commit -m "feat(community): adicionar sistema de reações"
git commit -m "fix(marketplace): corrigir erro ao criar RFQ"
git commit -m "docs: atualizar README com APIs"
```

### Nomes de Ficheiros
- **Components React**: PascalCase (`CommunityView.jsx`, `Sidebar.jsx`)
- **Services/Utils**: camelCase (`api.js`, `auth.service.ts`)
- **Routes**: kebab-case (`auth.routes.ts`, `posts.routes.ts`)

### Código TypeScript/JavaScript
```typescript
// ✅ Bom
const getUserProfile = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId }
  });
  return profile;
};

// ❌ Evitar
const get_user_profile = async (userId) => {
  return await prisma.profile.findUnique({
    where: { userId }
  });
};
```

---

## 🐛 Debug

### Logs
```bash
# Ver logs de serviço específico
npm run dev:community 2>&1 | grep "Error"

# Logs do Docker
docker compose logs postgres
```

### Problemas Comuns

#### "Port already in use"
```bash
# Linux/Mac
lsof -ti:3004 | xargs kill -9

# Windows
netstat -ano | findstr :3004
taskkill /PID [PID] /F
```

#### "Database connection failed"
```bash
# Verificar se PostgreSQL está a correr
docker compose ps

# Reiniciar base de dados
docker compose restart postgres
```

#### "Prisma Client not generated"
```bash
cd services/[service-name]
npx prisma generate
```

---

## 📚 Recursos

### Documentação Técnica
- [Prisma Docs](https://www.prisma.io/docs)
- [React Docs](https://react.dev)
- [Express.js](https://expressjs.com)
- [TypeScript](https://www.typescriptlang.org/docs)

### Tutoriais Internos
- [Como adicionar novo endpoint](./tutorials/add-endpoint.md)
- [Como criar nova página](./tutorials/add-page.md)
- [Como fazer deploy](./tutorials/deploy.md)

---

## 🔐 Segurança

### Token de Desenvolvimento
Token JWT pré-configurado em `devToken.js`:
- **User ID**: test-user-001
- **Email**: eurico@iamenu.pt
- **Role**: admin
- **Validade**: 24h

⚠️ **NUNCA** usar em produção!

### Variáveis de Ambiente
Nunca commitar ficheiro `.env`:
```bash
# .gitignore já inclui
.env
.env.local
.env.*.local
```

---

## 📊 Testes

### Testar Endpoints com cURL

#### Community API
```bash
# Listar posts
curl http://localhost:3004/api/v1/community/posts

# Criar post
curl -X POST http://localhost:3004/api/v1/community/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{"title":"Test","content":"Hello"}'
```

#### Marketplace API
```bash
# Listar fornecedores
curl http://localhost:3005/api/v1/marketplace/suppliers

# Criar RFQ
curl -X POST http://localhost:3005/api/v1/marketplace/quotes/request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TOKEN]" \
  -d '{"restaurantId":"xxx","items":[...]}'
```

---

## 🚀 Deploy

### Railway (Staging/Production)
```bash
# Login
railway login

# Link projeto
railway link

# Deploy
railway up
```

Ver mais em [docs/deployment/railway-setup.md](./deployment/railway-setup.md)

---

## 💡 Dicas

1. **Use Prisma Studio** para visualizar dados rapidamente
2. **Hot reload** está ativado - alterações refletem automaticamente
3. **Console do browser** (F12) mostra erros do frontend
4. **Logs dos serviços** aparecem no terminal onde executou `npm run dev`
5. **Git commit frequente** - pequenos commits são melhores que grandes

---

## 🆘 Ajuda

Se encontrares problemas:
1. Verificar logs no terminal
2. Verificar console do browser (F12)
3. Confirmar que todos os serviços estão a correr
4. Verificar `.env` está configurado corretamente
5. Tentar `npm install` novamente

---

**Última atualização:** 2025-01-06
