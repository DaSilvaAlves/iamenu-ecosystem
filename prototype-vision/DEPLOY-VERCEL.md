# 🚀 DEPLOY DO IAMENU ECOSYSTEM NA VERCEL

Este guia explica como fazer deploy do iaMenu Ecosystem (com GastroLens AI serverless) na Vercel.

---

## 📋 PRÉ-REQUISITOS

1. **Conta Vercel (Grátis)**: https://vercel.com/signup
2. **Gemini API Key**: https://aistudio.google.com/app/apikey
3. **Repositório Git** (GitHub, GitLab, ou Bitbucket)

---

## 🔥 PASSO 1: OBTER GEMINI API KEY

1. Acede a: https://aistudio.google.com/app/apikey
2. Clica em **"Create API Key"**
3. Seleciona **"Create API key in new project"**
4. **COPIA** a chave gerada (vais precisar no Passo 3)

⚠️ **IMPORTANTE**: Guarda esta chave num local seguro! Só é mostrada uma vez.

---

## 🔥 PASSO 2: FAZER PUSH PARA O GIT

```bash
# Navega para a pasta do projeto
cd C:\Users\XPS\Documents\iamenu-ecosystem\prototype-vision

# Adiciona todos os ficheiros
git add .

# Commit com mensagem
git commit -m "feat: Add serverless GastroLens AI - No API key required for users

🚀 Implementação de serverless function para GastroLens
- API key agora fica segura no servidor (Vercel)
- Users NÃO precisam mais de criar conta no Google AI Studio
- Melhor UX: just works out of the box!
- /api/analyze-dish endpoint criado
- GastroLens.jsx atualizado para usar serverless function

🎯 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push para o repositório remoto
git push origin main
```

---

## 🔥 PASSO 3: DEPLOY NA VERCEL

### Opção A: Deploy via Dashboard Web (RECOMENDADO)

1. Acede a: https://vercel.com/new
2. **Importa** o teu repositório Git
3. Clica em **"Import"** ao lado do repositório `iamenu-ecosystem`
4. Na secção **"Configure Project"**:
   - **Framework Preset**: Vite
   - **Root Directory**: `prototype-vision` (se aplicável)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Clica em **"Environment Variables"** e adiciona:
   ```
   Key: GEMINI_API_KEY
   Value: [COLA AQUI A TUA API KEY DO PASSO 1]
   ```

6. Clica em **"Deploy"**

7. Aguarda 2-3 minutos... 🎉 **DONE!**

---

### Opção B: Deploy via CLI

```bash
# Instala Vercel CLI (só precisas fazer isto uma vez)
npm i -g vercel

# Navega para a pasta do projeto
cd C:\Users\XPS\Documents\iamenu-ecosystem\prototype-vision

# Login na Vercel
vercel login

# Deploy
vercel

# Quando perguntado:
# ? Set up and deploy "prototype-vision"? [Y/n] Y
# ? Which scope? [Seleciona o teu username]
# ? Link to existing project? [N]
# ? What's your project's name? iamenu-ecosystem
# ? In which directory is your code located? ./

# Após deploy inicial, adiciona a API key:
vercel env add GEMINI_API_KEY

# Cole a tua Gemini API key quando perguntado
# Seleciona: Production, Preview, Development (todas)

# Re-deploy para aplicar a variável:
vercel --prod
```

---

## 🧪 PASSO 4: TESTAR LOCALMENTE (OPCIONAL)

Antes de fazer deploy, podes testar localmente:

```bash
# 1. Cria ficheiro .env na raiz do projeto
# Copia o conteúdo de .env.example e substitui a API key

# 2. Instala Vercel CLI (se ainda não instalaste)
npm i -g vercel

# 3. Roda o servidor local da Vercel
vercel dev

# 4. Abre o browser em:
# http://localhost:3000
```

---

## ✅ VERIFICAR SE ESTÁ A FUNCIONAR

Após o deploy:

1. Acede ao URL da Vercel (ex: `https://iamenu-ecosystem.vercel.app`)
2. Navega para **GastroLens**
3. Faz upload de uma foto de comida
4. Preenche o nome do prato
5. Clica em **"Transformar Menu"**
6. **Verifica se a análise aparece SEM pedir API key!** ✨

---

## 🔧 TROUBLESHOOTING

### Erro: "API key not configured"

**Causa**: A variável de ambiente `GEMINI_API_KEY` não foi configurada corretamente.

**Solução**:
```bash
vercel env add GEMINI_API_KEY
# Cola a tua API key
vercel --prod
```

### Erro: "Failed to analyze image"

**Causa**: A API key pode estar inválida ou sem créditos.

**Solução**:
1. Verifica se a API key está correta
2. Testa a API key em: https://aistudio.google.com/
3. Verifica se tens quota disponível

### Erro 404 em /api/analyze-dish

**Causa**: O Vercel não reconheceu a pasta /api como serverless functions.

**Solução**:
1. Certifica-te que `vercel.json` existe na raiz do projeto
2. Certifica-te que a pasta `/api` está no mesmo nível que `package.json`
3. Re-deploy: `vercel --prod --force`

---

## 🎯 ESTRUTURA FINAL DO PROJETO

```
iamenu-ecosystem/
├── prototype-vision/
│   ├── api/
│   │   └── analyze-dish.js     ← Serverless function
│   ├── src/
│   │   └── views/
│   │       └── GastroLens.jsx  ← Frontend atualizado
│   ├── .env                    ← Local only (NÃO committar!)
│   ├── .env.example            ← Template
│   ├── .gitignore              ← Ignora .env
│   ├── vercel.json             ← Configuração Vercel
│   └── package.json
```

---

## 🔐 SEGURANÇA

✅ **O QUE ESTÁ SEGURO:**
- API key fica APENAS no servidor Vercel
- Users NÃO têm acesso à API key
- Requests passam pelo teu backend primeiro

⚠️ **RECOMENDAÇÕES:**
- Adiciona rate limiting no futuro (limitar chamadas por IP)
- Monitoriza uso da API no Google AI Studio
- Considera adicionar autenticação se o uso crescer muito

---

## 📊 MONITORIZAR USO

### No Google AI Studio:
https://aistudio.google.com/app/apikey
- Vê quantas chamadas foram feitas
- Quota disponível

### No Vercel Dashboard:
https://vercel.com/dashboard
- Vê analytics
- Logs de erros
- Performance

---

## 🆘 SUPORTE

- **Vercel Docs**: https://vercel.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Issues**: [link do repositório]

---

**🎉 PARABÉNS! O teu iaMenu Ecosystem está agora 100% funcional para TODOS os users, sem necessidade de API keys! 🚀**
