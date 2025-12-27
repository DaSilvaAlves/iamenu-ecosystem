# Sistema de Moderação - Guia de Testes

## 1. Obter Token Admin

```bash
curl http://localhost:3001/api/v1/community/auth/test-token
```

**Resultado:**
- `role: "admin"`
- Token válido por 24h

**Guardar token:**
```bash
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY2ODA4MjA3LCJleHAiOjE3NjY4OTQ2MDd9.dyXNH46Zw1zN422Oj1IAK9aUD-btCEqnafLDlttxUAY"
```

---

## 2. Testar Criar Report (Utilizador Normal)

```bash
curl -X POST http://localhost:3001/api/v1/community/reports \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "targetType": "post",
    "targetId": "SUBSTITUIR_COM_POST_ID_REAL",
    "reason": "spam",
    "details": "Este post é spam promocional"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "reporterId": "test-user-001",
    "targetType": "post",
    "targetId": "...",
    "reason": "spam",
    "status": "pending",
    "createdAt": "..."
  }
}
```

---

## 3. Listar Reports (Admin Only)

```bash
curl http://localhost:3001/api/v1/community/reports?status=pending \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "reporterId": "...",
      "targetType": "post",
      "targetId": "...",
      "reason": "spam",
      "status": "pending",
      "createdAt": "..."
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

## 4. Ver Report Detalhado (Admin Only)

```bash
curl http://localhost:3001/api/v1/community/reports/REPORT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Resposta inclui:**
- Dados do report
- `targetContent` - conteúdo completo do post/comentário reportado

---

## 5. Revisar Report - Aprovar (Admin Only)

Aprovar report = Remove o conteúdo automaticamente

```bash
curl -X PATCH http://localhost:3001/api/v1/community/reports/REPORT_ID/review \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "approve",
    "notes": "Report válido, spam confirmado"
  }'
```

**Resultado:**
- Report status → `resolved`
- Conteúdo status → `removed`
- Autor recebe notificação

---

## 6. Revisar Report - Rejeitar (Admin Only)

```bash
curl -X PATCH http://localhost:3001/api/v1/community/reports/REPORT_ID/review \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject",
    "notes": "Report inválido, conteúdo ok"
  }'
```

**Resultado:**
- Report status → `rejected`
- Conteúdo permanece ativo

---

## 7. Remover Conteúdo Diretamente (Admin Only)

Sem criar report, remover diretamente:

```bash
curl -X DELETE http://localhost:3001/api/v1/community/moderate/post/POST_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Violação das regras da comunidade"
  }'
```

**Comentário:**
```bash
curl -X DELETE http://localhost:3001/api/v1/community/moderate/comment/COMMENT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Linguagem ofensiva"
  }'
```

---

## 8. Restaurar Conteúdo (Admin Only)

```bash
curl -X POST http://localhost:3001/api/v1/community/moderate/post/POST_ID/restore \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Resultado:**
- Post status → `active`
- Autor recebe notificação de restauro

---

## 9. Verificar Conteúdo Removido Não Aparece

```bash
# Listar posts - removidos NÃO aparecem
curl http://localhost:3001/api/v1/community/posts

# Ver post removido - retorna 404
curl http://localhost:3001/api/v1/community/posts/POST_REMOVIDO_ID
```

**Comportamento:**
- Posts com `status='removed'` são filtrados
- `getAllPosts()` → apenas `status='active'`
- `getPostById()` → null se removed

---

## 10. Testar Autorização

**Sem token:**
```bash
curl http://localhost:3001/api/v1/community/reports
# → 401 Unauthorized
```

**Com token user normal (role != admin):**
```bash
curl http://localhost:3001/api/v1/community/reports \
  -H "Authorization: Bearer USER_TOKEN"
# → 403 Forbidden (Admin access required)
```

---

## Fluxo Completo de Teste

1. ✅ Criar report de spam num post
2. ✅ Listar reports como admin
3. ✅ Ver detalhes do report
4. ✅ Aprovar report (remove post)
5. ✅ Verificar post não aparece na lista
6. ✅ Verificar autor recebeu notificação
7. ✅ Restaurar post
8. ✅ Verificar post volta a aparecer

---

## Criar Admin User

Se precisar de outro admin:

```bash
cd services/community
node create-admin.js outro-user-id
```

---

## Endpoints Disponíveis

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/reports` | User | Criar report |
| GET | `/reports` | Admin | Listar reports |
| GET | `/reports/:id` | Admin | Ver report |
| PATCH | `/reports/:id/review` | Admin | Aprovar/Rejeitar |
| DELETE | `/moderate/:type/:id` | Admin | Remover conteúdo |
| POST | `/moderate/:type/:id/restore` | Admin | Restaurar |

**Base URL:** `http://localhost:3001/api/v1/community`

---

## Notas

- Token expira em 24h
- Soft delete preserva dados (status='removed')
- Notificações criadas automaticamente
- Backward compatible (posts existentes status='active')
