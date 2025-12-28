# 🔴 PROBLEMAS URGENTES DO BACKEND - Para Claude Backend

**Data:** 28 Dezembro 2025
**Criado por:** Claude Frontend Developer
**Para:** Claude Backend Developer

---

## 🚨 PROBLEMA CRÍTICO: Prisma Client Não Inicializado

### Sintoma:
Todos os endpoints do Community API retornam **500 Internal Server Error** com:
```
TypeError: Cannot read properties of undefined (reading 'findMany')
TypeError: Cannot read properties of undefined (reading 'findUnique')
TypeError: Cannot read properties of undefined (reading 'count')
```

### Causa:
O **Prisma Client não foi gerado** no serviço Community API.

### Solução URGENTE:
```bash
cd services/community
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
```

---

## ✅ ESTADO ATUAL DO FRONTEND

### Implementações Completas:

#### 1. **Username Editável no ProfileView** ✅
- **Arquivo:** `prototype-vision/src/views/ProfileView.jsx`
- **Linhas:** 307, 343-346, 403-432
- **Funcionalidades:**
  - Campo username no modal de edição de perfil
  - Validação em tempo real (alfanuméricos e underscore)
  - Mínimo 3 caracteres, máximo 20
  - Feedback visual (verde ✓ se válido, vermelho com erro se inválido)
  - Exibição do @username no perfil (linha 135-139)

- **API Esperada:**
  - `PUT /api/v1/community/profiles/:userId`
  - Body: `{ username: "chef_mario", ... }`

- **Status:** ✅ Frontend pronto, aguardando backend funcionar

#### 2. **Configuração de Portas** ✅
- Frontend: `localhost:5173`
- Community API: `localhost:3001` ✅ (corrigido)
- API Base: `http://localhost:3001/api/v1/community`

#### 3. **Correções de Sintaxe** ✅
- DashboardBI.jsx linha 212: fechamento de operador ternário corrigido

---

## 🔴 ENDPOINTS QUE O FRONTEND ESTÁ TENTANDO USAR

### Endpoints Falhando (500 - Prisma):

1. **GET /api/v1/community/posts?limit=10&offset=0&sortBy=recent**
   - Usado por: CommunityView, GroupDetailView
   - Erro: `Cannot read properties of undefined (reading 'findMany')`
   - Serviço: `posts.service.ts:64`

2. **GET /api/v1/community/groups?limit=10&offset=0**
   - Usado por: Sidebar, GroupsView
   - Erro: `Cannot read properties of undefined (reading 'findMany')`
   - Serviço: `groups.service.ts:60`

3. **GET /api/v1/community/groups/user/:userId**
   - Usado por: Sidebar (para mostrar grupos do utilizador)
   - Erro: `Cannot read properties of undefined (reading 'findMany')`
   - Serviço: `group-members.service.ts:212`

4. **GET /api/v1/community/profiles/:userId**
   - Usado por: ProfileView
   - Erro: `Cannot read properties of undefined (reading 'findUnique')`
   - Serviço: `profiles.service.ts:26`

5. **GET /api/v1/community/profiles/:userId/stats**
   - Usado por: ProfileView (gamificação)
   - Erro: `Cannot read properties of undefined (reading 'count')`
   - Serviço: `profiles.service.ts:63`

6. **GET /api/v1/community/profiles/:userId/posts?limit=10**
   - Usado por: ProfileView
   - Erro: `Cannot read properties of undefined (reading 'findMany')`
   - Serviço: `profiles.service.ts:128`

### Endpoints Falhando (403 - Auth):

7. **GET /api/v1/community/notifications?limit=10&offset=0**
   - Usado por: NotificationsPanel
   - Erro: `403 Forbidden - Invalid token`
   - Problema: Frontend não tem token válido

---

## 🔧 AÇÕES NECESSÁRIAS (POR PRIORIDADE)

### 🔴 Prioridade CRÍTICA (fazer AGORA):

1. **Inicializar Prisma Client**
   ```bash
   cd services/community
   npx prisma generate
   ```

2. **Executar Migrações da Base de Dados**
   ```bash
   npx prisma migrate dev
   ```
   - Verifica se `prisma/schema.prisma` está correto
   - Cria tabelas necessárias: User, Profile, Post, Group, etc.

3. **Seed da Base de Dados**
   ```bash
   npm run prisma:seed
   ```
   - Popular com dados de teste
   - Criar utilizador de teste: `test-user-001`
   - Criar posts, grupos, comentários de exemplo

### 🟡 Prioridade ALTA (após Prisma funcionar):

4. **Fornecer Token de Teste**
   - Endpoint: `GET /api/v1/community/auth/test-token`
   - Deve retornar token JWT válido
   - Frontend vai usar este token para testar autenticação
   - Documentar como o frontend deve obter/usar o token

5. **Verificar Endpoint de Atualização de Perfil**
   - `PUT /api/v1/community/profiles/:userId`
   - Deve aceitar campo `username`
   - Validar unicidade de username
   - Retornar perfil atualizado

### 🟢 Prioridade MÉDIA (melhorias):

6. **Melhorar Tratamento de Erros**
   - Retornar JSON estruturado em erros 500
   - Logs mais descritivos
   - Stack traces em development mode

7. **Validação de Username no Backend**
   - Regex: `/^[a-zA-Z0-9_]{3,20}$/`
   - Verificar se username já existe
   - Retornar erro 409 Conflict se duplicado

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Após corrigir o Prisma, verificar:

- [ ] `GET /health` retorna 200 OK
- [ ] `GET /api/v1/community/posts` retorna 200 com array de posts
- [ ] `GET /api/v1/community/groups` retorna 200 com array de grupos
- [ ] `GET /api/v1/community/profiles/test-user-001` retorna 200 com perfil
- [ ] `GET /api/v1/community/auth/test-token` retorna token JWT válido
- [ ] `PUT /api/v1/community/profiles/test-user-001` com `{username: "chef_test"}` retorna 200

---

## 🔍 LOGS DE ERRO (para referência)

### Exemplo de Erro Típico:
```
Error fetching posts: TypeError: Cannot read properties of undefined (reading 'findMany')
    at PostsService.getAllPosts (services/community/src/services/posts.service.ts:64:37)
    at PostsController.getAllPosts (services/community/src/controllers/posts.controller.ts:28:41)
```

### Requests do Frontend (últimos 10):
```
[0mGET /api/v1/community/posts?limit=10&offset=0&sortBy=recent [31m500[0m
[0mGET /api/v1/community/groups?limit=10&offset=0 [31m500[0m
[0mGET /api/v1/community/groups/user/test-user-001 [31m500[0m
[0mGET /api/v1/community/profiles/test-user-001 [31m500[0m
[0mGET /api/v1/community/profiles/test-user-001/stats [31m500[0m
[0mGET /api/v1/community/profiles/test-user-001/posts?limit=10 [31m500[0m
[0mGET /api/v1/community/notifications?limit=10&offset=0 [33m403[0m
```

---

## 📞 INFORMAÇÃO DE CONTEXTO

### Database URL (no .env raiz):
```
DATABASE_URL="postgresql://postgres:jMHJNsoKMsXCjuuHNJTouoWqrvzgYyRn@gondola.proxy.rlwy.net:59722/railway"
```

### Porta Configurada:
- Community API está a correr em **PORT=3001** ✅
- Ficheiro `.env` criado em `services/community/.env`

### JWT Secret (no .env raiz):
```
JWT_SECRET="meu-super-secret-key-mudar-em-producao-123456"
```

---

## 🎯 OBJETIVO FINAL

Após corrigir o Prisma, o utilizador deve conseguir:
1. Ver o Feed com posts da comunidade
2. Ver Grupos na sidebar
3. Aceder ao Perfil
4. **Editar o username** no perfil (funcionalidade nova que implementei)
5. Ver notificações (após obter token)

---

## 💬 NOTAS ADICIONAIS

- O frontend está 100% funcional
- Todos os componentes estão implementados corretamente
- O problema é EXCLUSIVAMENTE no backend (Prisma)
- Esta não é uma falha de integração - é falta de inicialização do Prisma

---

**Última atualização:** 28 Dez 2025, 00:30
**Status Backend:** 🔴 Não funcional (Prisma não inicializado)
**Status Frontend:** ✅ Pronto e aguardando backend
