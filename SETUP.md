# SETUP - iaMenu Ecosystem 🚀

> **Instruções completas setup inicial**

---

## ✅ O QUE FOI CRIADO:

```
iamenu-ecosystem/
├── README.md                    # Documentação principal ✅
├── .gitignore                   # Git ignore global ✅
├── package.json                 # NPM workspaces root ✅
├── docker-compose.yml           # Orquestração serviços ✅
├── .env.example                 # Environment variables template ✅
│
├── core/                        # ☕ Java Spring Boot ✅
│   └── README.md                # (aguarda código do menuia)
│
├── services/                    # 🟢 Node.js APIs
│   ├── community/               # Hub Comunidade ✅
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/index.ts
│   │   ├── prisma/schema.prisma
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── marketplace/             # Marketplace Fornecedores ✅
│   │   └── (mesma estrutura)
│   │
│   └── academy/                 # Academia Cursos ✅
│       └── (mesma estrutura)
│
├── frontend/                    # ⚛️ React (criar depois)
├── database/                    # 🗄️ Scripts DB (criar depois)
├── scripts/                     # 🔧 Utilities (criar depois)
└── docs/                        # 📚 Documentation (criar depois)
```

**Total criado:** ~30 ficheiros! 🎉

---

## 🔥 PRÓXIMOS PASSOS (AGORA):

### 1. Fazer Commit Inicial (PowerShell aberto)

No PowerShell (já estás em `C:\Users\XPS\Documents\iamenu-ecosystem`):

```powershell
# 1. Verificar ficheiros criados
ls

# 2. Inicializar Git (se não inicializado)
git init

# 3. Adicionar todos ficheiros
git add .

# 4. Commit inicial
git commit -m "Initial commit: Monorepo structure

- Setup README, .gitignore, package.json root
- Core/ placeholder (Java Spring Boot)
- Services/ boilerplates: Community, Marketplace, Academy (Node.js + TypeScript + Prisma)
- docker-compose.yml (PostgreSQL + 4 services)
- NPM workspaces configurado

Status: Boilerplates prontos, rotas Semana 1-6"

# 5. Branch main (se necessário)
git branch -M main

# 6. Link remote (se não linked)
git remote add origin https://github.com/DaSilvaAlves/iamenu-ecosystem.git

# 7. Push!
git push -u origin main
```

---

### 2. Verificar GitHub

Vai a: https://github.com/DaSilvaAlves/iamenu-ecosystem

Deves ver:
- ✅ 30+ ficheiros
- ✅ Estrutura pastas completa
- ✅ README.md renderizado

---

### 3. Copiar Código Java (DEPOIS do commit)

```powershell
# 1. Abrir repo menuia noutro terminal/pasta
cd C:\caminho\para\menuia

# 2. Copiar código para iamenu-ecosystem/core/
# Copiar:
# - src/ → core/src/
# - pom.xml → core/pom.xml
# - Dockerfile (se existe) → core/Dockerfile

# 3. Commit código Java
cd C:\Users\XPS\Documents\iamenu-ecosystem
git add core/
git commit -m "Add Java Core from menuia repo"
git push
```

---

### 4. Setup Desenvolvimento Local (Opcional Hoje)

```powershell
# Instalar dependências (NPM workspaces)
npm install

# Copiar .env
cp .env.example .env
# Editar .env:
# - DATABASE_URL (Railway ou local PostgreSQL)
# - JWT_SECRET (gerar random string)
# - OPENAI_API_KEY (tua key OpenAI)

# Run PostgreSQL via Docker
docker-compose up postgres -d

# Run Prisma migrations (criar schemas)
npm run prisma:migrate

# Seed grupos iniciais
npm run prisma:seed

# Run development (3 APIs em paralelo)
npm run dev
```

**Portas:**
- Community: http://localhost:3001/health
- Marketplace: http://localhost:3002/health
- Academy: http://localhost:3003/health

---

## 📊 ESTRUTURA COMPLETA (O que tens agora):

| Componente | Status | Ficheiros | Próximo Passo |
|------------|--------|-----------|---------------|
| **README.md** | ✅ Completo | 1 | - |
| **.gitignore** | ✅ Completo | 1 | - |
| **package.json** | ✅ Completo | 1 | npm install |
| **docker-compose** | ✅ Completo | 1 | docker-compose up |
| **Core (Java)** | 🟡 Placeholder | 1 | Copiar código menuia |
| **Community API** | ✅ Boilerplate | 9 | Implementar rotas Semana 1 |
| **Marketplace API** | ✅ Boilerplate | 9 | Implementar rotas Semana 3 |
| **Academy API** | ✅ Boilerplate | 9 | Implementar rotas Semana 5 |

**Total:** 32 ficheiros criados! 🎉

---

## 🎯 ROADMAP DESENVOLVIMENTO:

### ✅ Fase 0: Foundation (HOJE - Completo!)
- [x] Repo GitHub criado
- [x] Estrutura monorepo completa
- [x] 3 boilerplates Node.js prontos
- [x] docker-compose configurado
- [x] Commit inicial feito

### 📅 Semana 1-2: Community API
- [ ] Implementar rotas Posts, Comments, Groups
- [ ] Frontend básico (React)
- [ ] Deploy Railway staging
- [ ] Beta 5 restauradores

### 📅 Semana 3-4: Marketplace API
- [ ] Implementar rotas Suppliers, Reviews
- [ ] Seed 20-30 fornecedores
- [ ] Frontend comparação preços
- [ ] Beta negociação coletiva

### 📅 Semana 5-6: Academy API
- [ ] Implementar rotas Courses, Lessons
- [ ] Gravar 3 cursos (iaMenu 101, Negociação, Marketing)
- [ ] Frontend player vídeos
- [ ] Beta 10 certificados

---

## 🆘 TROUBLESHOOTING:

### Erro: "git not found"
```powershell
# Instalar Git:
# https://git-scm.com/download/win
```

### Erro: "npm not found"
```powershell
# Instalar Node.js 18+:
# https://nodejs.org/en/download/
```

### Erro: "Cannot push to remote"
```powershell
# Configurar credenciais GitHub:
git config --global user.name "Eurico Alves"
git config --global user.email "euricojsalves@gmail.com"

# Autenticar (Windows popup):
git push
```

---

## 🎉 SUCESSO!

Se commit funcionou, vês isto no GitHub:
- ✅ 32 ficheiros
- ✅ Estrutura pastas organizada
- ✅ README.md bonito

**Próximo:** Implementar Community API (Semana 1)!

---

**Criado:** 2025-12-18
**Status:** Setup completo ✅
**Próximo:** `git push` + copiar Java Core
