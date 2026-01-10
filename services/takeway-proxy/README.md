# iaMenu Takeway Proxy Backend

Este serviço de backend atua como um proxy para as interações do frontend com o Supabase e futuramente com gateways de pagamento, garantindo a segurança das chaves de API e a conformidade com as diretrizes de segurança militar.

## Funcionalidades (MVP)

*   Proxy seguro para operações CRUD básicas no Supabase.
*   Intermediação de chamadas para APIs externas que exigem autenticação.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz deste projeto com base no `.env.example`:

```
PORT=3006
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# PAYMENT_GATEWAY_API_KEY=your_payment_gateway_api_key
```

*   `PORT`: Porta onde o servidor Express será executado. (Padrão: 3006)
*   `SUPABASE_URL`: A URL da sua instância Supabase.
*   `SUPABASE_SERVICE_ROLE_KEY`: A chave `service_role` do Supabase. **Esta chave é altamente privilegiada e NUNCA deve ser exposta no frontend.**

### 2. Instalação

```bash
npm install
```

### 3. Execução

Para iniciar o servidor em modo de desenvolvimento (com `nodemon` para reinício automático):

```bash
npm run dev
```

Para iniciar o servidor em modo de produção (após compilação, se aplicável, ou via `ts-node`):

```bash
npm run start
```

## Endpoints de Teste

*   `GET /`: Retorna uma mensagem de status do backend.
*   `GET /api/test-proxy`: Retorna um JSON de teste.

## Próximos Passos

*   Implementar a lógica de proxy para as operações CRUD do Supabase.
*   Implementar a integração com gateways de pagamento.
*   Adicionar validação e tratamento de erros robustos.