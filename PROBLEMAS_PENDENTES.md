# Problemas Pendentes - iaMenu Ecosystem

## 1. Upload de Imagens do Fornecedor (Marketplace) - NÃO RESOLVIDO

**Data:** 04/01/2026
**Prioridade:** Alta
**Status:** Investigação incompleta

### Descrição do Problema
O upload de imagens de perfil (logo) e capa (header) do fornecedor no Marketplace não está a guardar as imagens no banco de dados. O erro retornado é `500 Internal Server Error`.

### Endpoint Afetado
```
PATCH /api/v1/marketplace/suppliers/:id
```

### O Que Foi Feito
1. ✅ Adicionado campo `headerImageUrl` ao schema do Prisma (estava em falta)
2. ✅ Executado `prisma db push` para atualizar o banco de dados
3. ✅ Verificado que os arquivos estão a ser salvos no diretório `/uploads`
4. ✅ Confirmado que o código do frontend está correto (mesma implementação do perfil de usuário que funciona)

### O Que Ainda Não Foi Investigado
1. ❌ Logs específicos do servidor no momento do erro
2. ❌ Validação de todos os campos obrigatórios no Prisma
3. ❌ Possível problema com o tipo de dados `minOrder` (Decimal vs String)
4. ❌ Possível problema com parsing de JSON das categories/certifications
5. ❌ Verificação de permissões de escrita no banco de dados

### Arquivos Modificados
- `services/marketplace/prisma/schema.prisma` - Adicionado campo `headerImageUrl`
- Todos os outros arquivos já tinham a lógica de upload implementada

### Próximos Passos Sugeridos
1. Adicionar logging temporário no controller e service
2. Reiniciar o servidor marketplace em modo dev
3. Tentar upload e capturar logs específicos do erro
4. Verificar se todos os campos obrigatórios estão a ser enviados
5. Comparar com a implementação do Community Service (upload de usuário) que funciona

### Notas Técnicas
- O mesmo processo funciona perfeitamente no perfil de usuário (Community Service)
- Os arquivos são salvos em disco mas não são associados ao fornecedor no banco de dados
- O erro 500 sugere um problema no backend, provavelmente no Prisma update

### Referência de Código Funcional (Usuário)
- Frontend: `frontend/apps/prototype-vision/src/views/ProfileView.jsx`
- Backend Controller: `services/community/src/controllers/profiles.controller.ts`
- Backend Service: Não tem service, atualiza direto no controller
- API: `CommunityAPI.updateProfile()` em `frontend/apps/prototype-vision/src/services/api.js`

---

## Histórico de Alterações
- **04/01/2026:** Problema identificado, investigação inicial feita, campo adicionado ao schema
