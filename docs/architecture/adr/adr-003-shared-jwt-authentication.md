# ADR-003: Autenticação JWT Partilhada

## Status

Aceite

## Data

2026-01-31

## Contexto

Com 4 microserviços e um frontend SPA, precisávamos de uma estratégia de autenticação que:
- Permita single sign-on entre serviços
- Seja stateless para facilitar escalabilidade
- Suporte refresh tokens para sessões longas
- Seja simples de implementar e manter

## Decisão

Adotamos **JWT (JSON Web Tokens)** com um **secret partilhado** entre todos os serviços:

```typescript
// Middleware idêntico em todos os serviços
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
  next();
};
```

**Estrutura do Token:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user|admin|moderator",
  "iat": 1706745600,
  "exp": 1706749200
}
```

**Refresh Tokens:**
- Armazenados no schema `community` (tabela RefreshToken)
- Rotação automática a cada uso
- Revogação em logout

## Consequências

### Positivas
- **Stateless**: Não requer sessões no servidor
- **Cross-service**: Um token funciona em todos os serviços
- **Escalável**: Não há estado partilhado entre instâncias
- **Simples**: Implementação straightforward
- **Refresh tokens**: Suporte a sessões longas com segurança

### Negativas
- **Secret management**: JWT_SECRET deve ser sincronizado entre serviços
- **Revogação limitada**: Tokens são válidos até expirar (mitigado com refresh tokens)
- **Payload fixo**: Alterações no user requerem novo token
- **Sem invalidação imediata**: Logout não invalida tokens existentes instantaneamente

### Neutras
- Tokens expiram em 1 hora (configurável)
- Refresh tokens expiram em 7 dias
- Frontend armazena tokens em memória (não localStorage)

## Alternativas Consideradas

### OAuth 2.0 / OpenID Connect
- **Descrição**: Servidor de autorização dedicado (Keycloak, Auth0)
- **Prós**: Standards completos, social login, gestão centralizada
- **Contras**: Complexidade, custo (Auth0), overhead operacional
- **Razão da rejeição**: Over-engineering para a escala atual

### Sessions com Redis
- **Descrição**: Sessões server-side partilhadas via Redis
- **Prós**: Revogação imediata, controlo total
- **Contras**: Estado partilhado, dependência de Redis, latência
- **Razão da rejeição**: Adiciona complexidade e ponto de falha

### API Keys
- **Descrição**: Chaves estáticas por utilizador
- **Prós**: Simples, sem expiração
- **Contras**: Sem expiração (risco), difícil revogar
- **Razão da rejeição**: Não adequado para utilizadores finais

## Segurança

**Medidas implementadas:**
1. JWT_SECRET com alta entropia (256 bits)
2. Tokens de curta duração (1h)
3. Refresh token rotation
4. HTTPS obrigatório em produção
5. Helmet.js para headers de segurança

**TODO futuro:**
- [ ] Blacklist de tokens revogados (Redis)
- [ ] Rate limiting por token
- [ ] Audit log de autenticação

## Referências

- [JWT.io](https://jwt.io/)
- [OWASP JWT Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Refresh Token Rotation](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation)
