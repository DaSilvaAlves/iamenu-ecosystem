# 📋 Tarefas de Frontend - Para o Claude Designer

Lista de funcionalidades backend já implementadas que precisam de UI/UX.

---

## 🎯 Sistema de Menções (@username)

**Status Backend:** ✅ Completo

**Tarefas Frontend:**

### 1. Componentes Já Criados ✅
- [x] `MentionInput.jsx` - Input com autocomplete de @mentions
- [x] `TextRenderer.jsx` - Renderiza @mentions como links azuis

### 2. Integrações Necessárias
- [x] CommunityView - posts com @mentions ✅
- [x] GroupDetailView - posts com @mentions ✅
- [ ] **Página de Perfil** - adicionar campo `username` editável
- [ ] **Configurações de Conta** - permitir escolher/mudar username
- [ ] **Validação de Username** - só alfanuméricos e underscore

### 3. UX Melhorias
- [ ] Mostrar preview de utilizador ao hover sobre @mention
- [ ] Link @mention vai para perfil do utilizador
- [ ] Indicador visual de mention inválida (username não existe)

**API Endpoints Disponíveis:**
- `GET /profiles/search?q=<query>` - Autocomplete (já usado)

---

## 🛡️ Sistema de Moderação

**Status Backend:** ✅ Completo e Testado

**Tarefas Frontend:**

### 1. Utilizadores Normais

#### Botão "Reportar" em Posts/Comentários
- [ ] Adicionar botão "🚩 Reportar" em cada post
- [ ] Adicionar botão "🚩 Reportar" em cada comentário
- [ ] Modal de report com:
  - Radio buttons: Spam, Ofensivo, Assédio, Inapropriado, Outro
  - Campo de texto opcional (detalhes)
  - Botão "Enviar Report"
  - Confirmação de sucesso

#### Notificações de Moderação
- [ ] Mostrar notificação quando conteúdo é removido
- [ ] Mostrar notificação quando conteúdo é restaurado
- [ ] Link na notificação vai para o post/comentário

### 2. Admins Only

#### Dashboard de Moderação (`/admin/reports`)
- [ ] Criar página de admin reports
- [ ] Lista de reports pendentes:
  - Card com: tipo, conteúdo reportado, razão, data
  - Preview do post/comentário
  - Informação do reporter
  - Botões: "Aprovar" / "Rejeitar"
- [ ] Filtros:
  - Status: Pendente, Resolvido, Rejeitado
  - Tipo: Post, Comentário
  - Razão: Spam, Ofensivo, etc
- [ ] Paginação
- [ ] Badge de contagem de reports pendentes no menu admin

#### Ações de Moderação Direta
- [ ] Botão "Remover Post" (apenas para admins)
- [ ] Botão "Restaurar Post" (apenas para admins removidos)
- [ ] Modal de confirmação com campo de razão
- [ ] Indicador visual de conteúdo removido (para admins apenas)

#### Controlo de Acesso
- [ ] Verificar `user.role === 'admin'` antes de mostrar opções admin
- [ ] Esconder funcionalidades admin para users normais
- [ ] Redirect para home se tentar aceder `/admin/*` sem ser admin

**API Endpoints Disponíveis:**
- `POST /reports` - Criar report (autenticado)
- `GET /reports` - Listar reports (admin only)
- `GET /reports/:id` - Ver report detalhado (admin only)
- `PATCH /reports/:id/review` - Aprovar/rejeitar (admin only)
- `DELETE /moderate/:type/:id` - Remover conteúdo (admin only)
- `POST /moderate/:type/:id/restore` - Restaurar (admin only)

**Token Admin:**
```bash
curl http://localhost:3001/api/v1/community/auth/test-token
# Retorna token com role='admin'
```

---

## 🎮 Sistema de Gamificação

**Status Backend:** ✅ Completo

**Tarefas Frontend:**

### ProfileView - Melhorias
- [x] Mostrar badges desbloqueados ✅
- [x] Mostrar nível e XP ✅
- [x] Barra de progresso XP ✅
- [ ] **Adicionar tooltip** nos badges (descrição ao hover)
- [ ] **Animação** quando desbloquear novo badge
- [ ] **Listagem de badges locked** com progresso

### Página de Conquistas (`/achievements`)
- [ ] Criar página dedicada a conquistas
- [ ] Grid de todos os badges:
  - Desbloqueados (coloridos)
  - Locked (cinzento com progresso)
- [ ] Barra de progresso para cada achievement locked
- [ ] Categorias: Primeiros Passos, Posts, Comentários, Popularidade, Especiais

### Notificações de Badges
- [ ] Mostrar notificação quando desbloquear badge
- [ ] Toast/popup celebratório com animação
- [ ] Som opcional de conquista

**API Endpoints Disponíveis:**
- `GET /gamification/achievements` - Todos os achievements
- `GET /gamification/:userId` - Dados de gamificação do user

---

## 🔔 Sistema de Notificações

**Status Backend:** ✅ Completo

**Tarefas Frontend:**

### Melhorias no NotificationsPanel
- [x] Mostrar lista de notificações ✅
- [x] Marcar como lida ✅
- [ ] **Agrupar por tipo** (menções, moderação, badges, etc)
- [ ] **Filtros** por tipo de notificação
- [ ] **Badge de contagem** de não lidas no ícone do sino
- [ ] **Som de notificação** (opcional, configurável)

### Página de Notificações (`/notifications`)
- [ ] Criar página dedicada (mais espaço que dropdown)
- [ ] Paginação de notificações antigas
- [ ] Botão "Marcar todas como lidas"
- [ ] Filtro por data (hoje, semana, mês)

### Preferências de Notificações
- [ ] Página de configurações (`/settings/notifications`)
- [ ] Toggles para cada tipo:
  - [ ] Menções
  - [ ] Comentários nos meus posts
  - [ ] Reações nos meus posts
  - [ ] Badges desbloqueados
  - [ ] Moderação
- [ ] Opção de email notifications (futuro)

**API Endpoints Disponíveis:**
- `GET /notifications` - Listar notificações
- `PATCH /notifications/:id/read` - Marcar como lida

---

## 🔍 Sistema de Pesquisa

**Status Backend:** ⚠️ Parcial (só posts)

**Tarefas Frontend:**

### SearchView - Melhorias
- [ ] Adicionar tabs: Posts, Grupos, Utilizadores
- [ ] Filtros avançados:
  - Data (hoje, semana, mês, ano)
  - Categoria
  - Grupo específico
  - Autor
- [ ] Pesquisa de utilizadores (por username/nome)
- [ ] Pesquisa de grupos (por nome/categoria)
- [ ] Resultados com highlight do termo pesquisado

**Melhorias Backend Necessárias:**
- [ ] Endpoint de pesquisa de utilizadores
- [ ] Endpoint de pesquisa de grupos
- [ ] Pesquisa full-text melhorada

---

## 👤 Sistema de Perfis

**Status Backend:** ✅ Completo

**Tarefas Frontend:**

### ProfileView - Funcionalidades Faltando
- [ ] **Editar Perfil:**
  - [ ] Modal/página de edição
  - [ ] Upload de foto de perfil
  - [ ] Upload de foto de capa
  - [ ] Editar bio
  - [ ] Editar username (único)
  - [ ] Editar informações do restaurante
- [ ] **Tabs de Conteúdo:**
  - [ ] Posts do utilizador
  - [ ] Comentários recentes
  - [ ] Badges
- [ ] **Estatísticas:**
  - [ ] Total de posts
  - [ ] Total de comentários
  - [ ] Total de reações recebidas
  - [ ] Membro desde (data)

### Ver Perfil de Outros Utilizadores
- [ ] Suportar `?user=<username>` na URL
- [ ] Mostrar perfil público de outros users
- [ ] Botão "Mencionar" (@username) ao ver perfil

**API Endpoints Disponíveis:**
- `GET /profiles/:userId` - Ver perfil
- `PUT /profiles/:userId` - Editar perfil
- `POST /profiles/:userId/photo` - Upload foto perfil
- `POST /profiles/:userId/cover` - Upload foto capa

---

## 🏘️ Sistema de Grupos

**Status Backend:** ✅ Completo

**Tarefas Frontend:**

### GroupsView - Melhorias
- [ ] Filtros por categoria
- [ ] Pesquisa de grupos
- [ ] Grid vs List view toggle
- [ ] Mostrar preview de últimos posts do grupo

### GroupDetailView - Melhorias
- [x] Ver posts do grupo ✅
- [x] Criar posts no grupo ✅
- [ ] **Página de Configurações do Grupo** (creator only):
  - [ ] Editar nome/descrição
  - [ ] Mudar foto de capa
  - [ ] Mudar categoria
  - [ ] Apagar grupo
- [ ] **Gestão de Membros** (creator/admin only):
  - [ ] Lista de membros
  - [ ] Promover a admin
  - [ ] Remover membro
- [ ] **Estatísticas do Grupo:**
  - [ ] Total de membros
  - [ ] Posts esta semana
  - [ ] Top contributors

### Criar Grupo - Melhorias
- [ ] Upload de cover image ao criar
- [ ] Escolher categoria (dropdown)
- [ ] Escolher tipo (público/privado)

**API Endpoints Disponíveis:**
- `GET /groups` - Listar grupos
- `POST /groups` - Criar grupo
- `PATCH /groups/:id` - Editar grupo (creator)
- `DELETE /groups/:id` - Apagar grupo (creator)
- `POST /groups/:id/join` - Entrar no grupo
- `DELETE /groups/:id/leave` - Sair do grupo
- `GET /groups/:id/members` - Listar membros
- `PATCH /groups/:id/members/:userId/role` - Mudar role (owner/admin)

---

## 📱 Layout e Navegação

**Tarefas Gerais:**

### Sidebar/Menu
- [ ] Adicionar link "Conquistas" (`/achievements`)
- [ ] Adicionar link "Admin" (`/admin/reports`) - apenas se `user.role === 'admin'`
- [ ] Badge de notificações não lidas no ícone do sino
- [ ] Badge de reports pendentes no link Admin (admins only)

### Responsividade
- [ ] Testar todos os componentes em mobile
- [ ] Ajustar MentionInput dropdown em mobile
- [ ] Ajustar modals em mobile
- [ ] Menu hamburguer em mobile

### Acessibilidade
- [ ] Adicionar labels ARIA nos botões
- [ ] Suporte a navegação por teclado (Tab)
- [ ] Contraste de cores adequado
- [ ] Screen reader friendly

---

## 🎨 Componentes Reutilizáveis Sugeridos

Para melhorar consistência e produtividade:

- [ ] **`<Button>`** - botão padrão com variantes (primary, secondary, danger)
- [ ] **`<Modal>`** - modal reutilizável
- [ ] **`<Card>`** - card container
- [ ] **`<Badge>`** - badge/tag
- [ ] **`<Avatar>`** - foto de perfil com fallback
- [ ] **`<Dropdown>`** - dropdown menu
- [ ] **`<Tabs>`** - componente de tabs
- [ ] **`<Toast>`** - notificações toast
- [ ] **`<ConfirmDialog>`** - diálogo de confirmação
- [ ] **`<EmptyState>`** - estado vazio com ícone e mensagem

---

## 🔐 Autenticação e Autorização

**Tarefas:**

- [ ] Guardar `user.role` no localStorage após login
- [ ] Helper: `isAdmin()` - verifica se user é admin
- [ ] Helper: `isModerator()` - verifica se user é moderador
- [ ] HOC/componente `<AdminOnly>` - só renderiza se admin
- [ ] Proteção de rotas admin (redirect se não admin)

---

## 📊 Prioridades Sugeridas

### Alta Prioridade 🔴
1. **Username editável** no perfil (sistema de menções precisa)
2. **Botão Reportar** em posts/comentários (moderação básica)
3. **Dashboard de Admin** para reports (moderação funcional)

### Média Prioridade 🟡
4. **Editar Perfil** completo (foto, bio, etc)
5. **Página de Conquistas** (gamificação mais visível)
6. **Notificações melhoradas** (badge de contagem)
7. **Gestão de Grupos** (editar, membros)

### Baixa Prioridade 🟢
8. **Pesquisa avançada** com filtros
9. **Preferências de notificações**
10. **Componentes reutilizáveis**
11. **Responsividade e a11y**

---

## 📝 Notas Técnicas

### Tokens e Autenticação
- Token JWT em `Authorization: Bearer <token>`
- Role vem no token: `user.role` ('user', 'moderator', 'admin')
- Token de teste: `GET /auth/test-token` (role='admin')

### API Base URL
```javascript
const API_BASE = 'http://localhost:3001/api/v1/community';
```

### Exemplo de Request Admin
```javascript
const response = await fetch(`${API_BASE}/reports`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Verificar Role
```javascript
// No frontend
const user = JSON.parse(localStorage.getItem('user'));
const isAdmin = user?.role === 'admin';

if (isAdmin) {
  // Mostrar opções admin
}
```

---

## 🚀 Como Começar

1. **Escolher uma tarefa** da lista de prioridades
2. **Ler documentação** do endpoint na pasta `services/community`
3. **Criar componente** ou adicionar feature
4. **Testar** com token de admin (se necessário)
5. **Commitar** quando funcionar

**Qualquer dúvida, consultar:**
- `services/community/TEST-MODERATION.md` - Guia de testes
- `services/community/src/routes/*.ts` - Endpoints disponíveis
- `services/community/src/controllers/*.ts` - Lógica dos endpoints

---

**Última atualização:** 27 Dez 2025
**Backend completo por:** Claude Sonnet 4.5 (Backend)
**Frontend a implementar por:** Claude (Designer/Frontend)
