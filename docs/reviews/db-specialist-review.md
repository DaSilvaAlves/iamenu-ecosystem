# Database Specialist Review
**iaMenu Ecosystem - Technical Debt Assessment**

**Reviewer:** @data-engineer (Dara)
**Data:** 2026-02-08
**Status:** ✅ VALIDAÇÃO COMPLETA

---

## 🔐 Débitos de Segurança (RLS & Access Control)

### CRÍTICO - RLS Coverage Gap
- **Tabela:** `public.posts`, `public.comments` (Community schema)
- **Issue:** Sem RLS policies - qualquer user autenticado vê todos os posts/comments
- **Risk:** Data exposure entre usuários
- **Severidade:** 🔴 CRÍTICA
- **Recomendação:**
  ```sql
  ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
  CREATE POLICY rls_posts_self ON public.posts
    FOR ALL USING (auth.uid() = user_id);
  ```
- **Horas:** 8-10h (implementar + testar)
- **Prioridade:** 🔴 CRÍTICA - Security blocker

### CRÍTICO - RLS in Marketplace
- **Tabela:** `public.quotes`, `public.offers` (Marketplace schema)
- **Issue:** Sem RLS - suppliers veem cotações de concorrentes
- **Risk:** Business data exposure
- **Severidade:** 🔴 CRÍTICA
- **Recomendação:** Implementar RLS granular por supplier_id
- **Horas:** 10-12h
- **Prioridade:** 🔴 CRÍTICA

### ALTA - Missing Foreign Keys
- **Tabelas afetadas:** Vários modelos sem constraints
- **Issue:** Relacionamentos não enforcement a nível DB
- **Risk:** Dados órfãos, dificuldade em refactoring
- **Recomendação:** Adicionar FK constraints onde faltam
- **Horas:** 8-10h
- **Prioridade:** 🟡 ALTA

---

## ⚡ Débitos de Performance

### MÉDIA - N+1 Query Patterns
- **Endpoints críticos:**
  - `GET /community/posts` - 1 query por post para author + reactions
  - `GET /marketplace/suppliers/:id` - N queries para produtos
- **Root Cause:** Prisma sem `.include()` adequado
- **Fix:** Usar `select` com nested includes
- **Horas:** 6-8h (refactor queries)
- **Prioridade:** 🟡 MÉDIA

### MÉDIA - Missing Indexes
- **Colunas críticas sem index:**
  - `posts.created_at` (usado em sorting)
  - `comments.post_id` (FK sem index)
  - `quotes.status` (usado em filtros)
- **Impact:** Full table scans em queries populares
- **Fix:** Criar indexes nas 10 colunas mais críticas
- **Horas:** 4-6h
- **Prioridade:** 🟡 MÉDIA

### BAIXA - Soft Deletes
- **Tabelas críticas:** Posts, Comments, Orders
- **Current:** DELETE físico - perdem-se audit trails
- **Recommendation:** Adicionar `deleted_at` TIMESTAMP
- **Horas:** 12-15h (migration + atualizar queries)
- **Prioridade:** 🟡 BAIXA - Compliance future-proofing

---

## 📋 Débitos de Schema & Integridade

### MÉDIA - Missing Audit Logging
- **Current:** Sem registro de quem mudou o quê/quando
- **Recommendation:** Criar `audit_logs` table + triggers
- **Horas:** 15-20h
- **Prioridade:** 🟡 MÉDIA

### BAIXA - Inconsistent Naming
- **Issue:** Alguns fields em snake_case, outros em camelCase
- **Fix:** Padronizar para snake_case em DB
- **Horas:** 6-8h
- **Prioridade:** 🟡 BAIXA

---

## ✅ Validação de Dados Críticos

| Schema | Table | RLS? | Indexes | Soft Delete | FK Constraints | Audit |
|--------|-------|------|---------|-------------|-----------------|-------|
| community | posts | ❌ NOPE | ⚠️ Partial | ❌ No | ✅ OK | ❌ No |
| community | comments | ❌ NOPE | ⚠️ Partial | ❌ No | ⚠️ Missing | ❌ No |
| marketplace | quotes | ❌ NOPE | ❌ None | ❌ No | ✅ OK | ❌ No |
| marketplace | suppliers | ✅ OK | ✅ OK | ❌ No | ✅ OK | ❌ No |
| academy | enrollments | ✅ OK | ⚠️ Partial | ❌ No | ✅ OK | ❌ No |
| business | orders | ⚠️ Partial | ❌ None | ❌ No | ⚠️ Missing | ❌ No |

---

## 📊 Respostas às Perguntas do Architect

**P: As RLS policies que identificámos são as corretas?**
R: Sim, implementar RLS por `auth.uid() = user_id` é o padrão correto. Para marketplace, usar `supplier_id`.

**P: Quais queries fazem N+1 críticas?**
R: Community posts list (loadsa reactions), Marketplace supplier products, Academy course modules. Estas 3 sozinhas.

**P: Que indexes faltam nas tabelas high-volume?**
R: posts.created_at, comments.post_id, quotes.status, orders.user_id, orders.created_at (no mínimo).

**P: Vale a pena soft deletes em TODAS?**
R: Não. Só em posts, comments, orders (audit trail crítico). Outras tabelas podem DELETE físico.

**P: Triggers para audit logging ou application layer?**
R: Triggers são melhores - garantem que TUDO é auditado, mesmo queries raw. Application layer é menos confiável.

---

## 🎯 Ordem de Resolução Recomendada

1. **Fase 1 (Crítica - 1 semana):** RLS policies em posts/comments/quotes
2. **Fase 2 (Alta - 1 semana):** Indexes críticos + FK constraints
3. **Fase 3 (Média - 2 semanas):** Soft deletes + audit logging
4. **Fase 4 (Baixa - future):** Naming consistency, optimization

---

## 📈 Impacto Estimado

| Débito | Horas | Complexidade | Risk | ROI |
|--------|-------|--------------|------|-----|
| RLS (todos) | 18-22 | 🔴 ALTA | 🔴 CRÍTICA | 🟢 Alto (security) |
| Indexes | 4-6 | 🟢 BAIXA | 🟡 Média (perf) | 🟢 Alto (perf) |
| N+1 Queries | 6-8 | 🟡 MÉDIA | 🟡 Média | 🟢 Alto (perf) |
| Soft Deletes | 12-15 | 🟡 MÉDIA | 🟡 Baixa | 🟡 Médio (compliance) |
| Audit Logging | 15-20 | 🔴 ALTA | 🟡 Baixa | 🟡 Médio (compliance) |

---

## 🔄 Próximos Passos

✅ **Validação DB:** COMPLETA
⏳ **Próximas:** Validação UX (@ux-design-expert), QA Review (@qa)

---

**Assinado:** Dara (Data Engineer)
**Data:** 2026-02-08
