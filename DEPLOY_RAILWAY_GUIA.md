# 🚀 Guia de Deploy do Takeway-Proxy no Railway

## ✅ Pré-requisitos Completos

✅ Código foi enviado para GitHub: https://github.com/DaSilvaAlves/iamenu-ecosystem
✅ Proxy preparado para produção em `services/takeway-proxy`
✅ Chave do Supabase disponível

---

## 📋 Passo a Passo - Deploy no Railway

### Passo 1: Criar Conta no Railway

1. Abra: https://railway.app
2. Clique em **"Login"** ou **"Start a New Project"**
3. Faça login com **GitHub** (recomendado)
   - Autorize Railway a acessar seus repositórios

### Passo 2: Criar Novo Projeto

1. No dashboard do Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Procure e selecione: **`DaSilvaAlves/iamenu-ecosystem`**
4. Railway vai detectar automaticamente o projeto

### Passo 3: Configurar o Serviço

Railway pode não detectar automaticamente a pasta `services/takeway-proxy`.

**Se Railway pedir configuração manual:**

1. Na dashboard, clique em **"Settings"** (do serviço criado)
2. Em **"Root Directory"**, defina: `services/takeway-proxy`
3. Em **"Build Command"**, confirme: `npm install && npm run build`
4. Em **"Start Command"**, confirme: `npm start`

**OU use a configuração automática:**

Railway lerá o arquivo `railway.json` que já criámos e usará essas configurações automaticamente.

### Passo 4: Adicionar Variáveis de Ambiente

1. No dashboard do Railway, clique no serviço
2. Vá para a aba **"Variables"**
3. Clique em **"New Variable"**
4. Adicione estas variáveis (uma de cada vez):

**Variável 1:**
- **Nome:** `SUPABASE_URL`
- **Valor:** `https://fssyygsbhvvqhvfecqub.supabase.co`

**Variável 2:**
- **Nome:** `SUPABASE_SERVICE_ROLE_KEY`
- **Valor:** (copie da sua conta Supabase)

#### Como Obter a Service Role Key do Supabase:

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto: **fssyygsbhvvqhvfecqub**
3. No menu lateral, clique em **"Settings" → "API"**
4. Role até **"Project API keys"**
5. Copie a chave **"service_role"** (não a "anon"!)
   - ⚠️ Tenha cuidado! Esta chave é sensível!

**Variável 3 (Opcional):**
- **Nome:** `PORT`
- **Valor:** `3006` (Railway pode usar outra porta automaticamente)

### Passo 5: Deploy!

1. Após adicionar as variáveis, Railway iniciará o deploy automaticamente
2. Você verá os logs na aba **"Deployments"**:
   ```
   Installing dependencies...
   Running build command...
   Compiling TypeScript...
   Starting server...
   ✓ Build successful
   ✓ Deployment live
   ```

3. Aguarde até aparecer **"Deployment successful"** (1-3 minutos)

### Passo 6: Obter a URL de Produção

1. No dashboard, clique no serviço
2. Vá para a aba **"Settings"**
3. Role até **"Domains"**
4. Clique em **"Generate Domain"**
5. Railway gerará uma URL tipo: `https://takeway-proxy-production.up.railway.app`

**Copie esta URL!** Você vai precisar dela para configurar o frontend.

---

## 🧪 Passo 7: Testar o Proxy em Produção

Abra o terminal e teste:

```bash
# Teste 1: Verificar se está online
curl https://SEU-DOMINIO.up.railway.app/api/test-proxy

# Deve retornar: {"message":"Proxy is working!"}

# Teste 2: Listar categorias
curl https://SEU-DOMINIO.up.railway.app/api/supabase/categories

# Deve retornar lista de categorias JSON

# Teste 3: Listar menu items
curl https://SEU-DOMINIO.up.railway.app/api/supabase/menu-items

# Deve retornar lista de pratos JSON
```

**Substitua `SEU-DOMINIO.up.railway.app` pela URL real que o Railway gerou!**

---

## ⚙️ Passo 8: Configurar CORS para Produção

Precisamos atualizar o proxy para aceitar requests do seu frontend em produção.

Vou fazer isso após você me confirmar a URL do Railway.

---

## 🔄 Passo 9: Atualizar Frontend para Usar Proxy de Produção

Depois de ter a URL do Railway, vou atualizar o frontend para usar:
- **Desenvolvimento:** `http://localhost:3006`
- **Produção:** `https://seu-dominio.up.railway.app`

---

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique os logs na aba "Deployments"
- Confirme que as variáveis de ambiente estão corretas

### Erro: "Cannot connect to Supabase"
- Verifique se `SUPABASE_SERVICE_ROLE_KEY` está correta
- Confirme que a URL do Supabase está certa

### Erro: "Application crashed"
- Verifique os logs para ver o erro específico
- Pode ser falta de variável de ambiente

### Railway não detecta o projeto
- Confirme que o **Root Directory** está setado para `services/takeway-proxy`
- Verifique que `package.json` existe na pasta

---

## 📊 Monitoramento

No Railway dashboard você pode:
- Ver logs em tempo real (aba "Logs")
- Monitorar uso de recursos (aba "Metrics")
- Ver histórico de deploys (aba "Deployments")

---

## 💰 Custos

Railway oferece:
- **$5 grátis/mês** de crédito
- **500 horas grátis** de execução
- Este proxy deve usar ~$0-2/mês (muito abaixo do limite gratuito)

---

## ✅ Checklist Final

- [ ] Conta Railway criada
- [ ] Repositório GitHub conectado
- [ ] Projeto criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] URL de produção gerada
- [ ] Testes de API funcionando
- [ ] Frontend atualizado para usar proxy de produção

---

**Quando tiver a URL do Railway, me avise e eu atualizo o frontend para usar essa URL em produção!**

🎉 **Boa sorte com o deploy!**
