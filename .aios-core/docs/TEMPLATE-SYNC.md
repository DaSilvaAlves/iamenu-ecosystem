# 🔄 Sincronização Automática de Templates AIOS

Guia completo para sincronização automática de templates AIOS com o repositório remoto.

## 📋 Resumo

Este sistema garante que mudanças em templates AIOS são automaticamente sincronizadas com o repositório remoto **sem necessidade de intervenção manual**.

### Características

- ✅ **Sincronização automática** - Detecta mudanças e faz push automaticamente
- ✅ **Modo Watch** - Monitora mudanças em tempo real
- ✅ **GitHub Actions** - Sincronização contínua via CI/CD
- ✅ **Zero configuração** - Funciona out-of-the-box
- ✅ **Debouncing** - Agrupa mudanças múltiplas em um commit

---

## 🚀 Começar Rapidamente

### 1. Sincronização Manual Única

```bash
# Sincronizar imediatamente
npm run sync:templates

# Output esperado:
# 🔄 Iniciando sincronização de templates...
# 📝 2 ficheiro(s) modificado(s):
#    • brownfield-architecture-tmpl.yaml
#    • front-end-spec-tmpl.yaml
# ✅ Commit automático realizado
# ✅ Push para remoto realizado
```

### 2. Modo Watch (Contínuo)

```bash
# Iniciar monitor em tempo real
npm run sync:templates:watch

# A partir de agora, qualquer mudança é sincronizada automaticamente!
# Para parar: Ctrl+C
```

### 3. Ver Status

```bash
# Ver status da sincronização
npm run sync:templates:status

# Output:
# 📊 STATUS DA SINCRONIZAÇÃO DE TEMPLATES
#
# Configuração:
#   ✓ Auto-sync: ativado
#   ✓ Watch mode: desativado
#   ✓ Dry run: desativado
#   ✓ Debounce: 5000ms
#
# Templates monitorados:
#   • brownfield-architecture-tmpl.yaml
#   • front-end-spec-tmpl.yaml
#   • architecture-tmpl.yaml
#   • fullstack-architecture-tmpl.yaml
```

---

## 🔧 Configuração

### Ficheiro de Configuração

**Localização**: `.aios-core/config/templates-sync.yaml`

```yaml
# Ativar/desativar sincronização automática
enabled: true

# Auto-sync quando templates são modificados
auto_sync: true

# Modo watch (monitora mudanças em tempo real)
watch_mode: false

# Tempo de espera antes de fazer sync (ms)
# Útil para agrupar mudanças múltiplas
debounce_ms: 5000

# Templates para monitorar
templates:
  - brownfield-architecture-tmpl.yaml
  - front-end-spec-tmpl.yaml
  - architecture-tmpl.yaml
  - fullstack-architecture-tmpl.yaml

# Padrões a ignorar
excluded_patterns:
  - node_modules
  - .git
  - '*.tmp'

# Teste (não faz push real)
dry_run: false

# GitHub Actions
github_actions:
  enabled: true
  frequency: 'push'
```

### Modificar Configuração

```bash
# Editar configuração
nano .aios-core/config/templates-sync.yaml

# Depois:
npm run sync:templates:status
```

---

## 🤖 GitHub Actions (CI/CD)

A sincronização também ocorre automaticamente via GitHub Actions!

### Workflow Automático

**Ficheiro**: `.github/workflows/sync-aios-templates.yml`

**Dispara automaticamente quando:**
- 📝 Mudanças em `.aios-core/development/templates/`
- 📝 Mudanças em `.aios-core/config/templates-sync.yaml`
- 🕐 Diariamente às 00:00 UTC
- ⚙️ Via `workflow_dispatch` manual

### Ver Execuções

```
GitHub > Seu Repositório > Actions > 🔄 Auto-Sync AIOS Templates
```

---

## 📚 Casos de Uso

### Caso 1: Modificar um Template Localmente

```bash
# 1. Editar template
nano .aios-core/development/templates/brownfield-architecture-tmpl.yaml

# 2. Salvar (Ctrl+S)

# 3. Sincronizar
npm run sync:templates

# ✅ Automaticamente:
#    • Detecta mudança
#    • Faz commit automático
#    • Faz push para remoto
```

### Caso 2: Desenvolvimento Contínuo

```bash
# Início do dia
npm run sync:templates:watch

# Trabalhar normalmente
# Editar templates conforme necessário
# Tudo é sincronizado automaticamente!

# Final do dia
# Ctrl+C para parar o watch
```

### Caso 3: Sincronização Programada

```bash
# Colocar em cron (Linux/Mac)
# A cada 30 minutos:
*/30 * * * * npm run sync:templates

# Ou usar GitHub Actions (já configurado!)
# Ver: .github/workflows/sync-aios-templates.yml
```

---

## 🔍 Troubleshooting

### Problema: "Git not found"

```bash
# Solução: Instalar Git
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt-get install git
```

### Problema: "Nothing to sync"

```bash
# Significa que não há mudanças
# Verificar status:
git status

# Se há mudanças, forçar sync:
npm run sync:templates
```

### Problema: "Push rejected"

```bash
# Pode ser merge conflicts
# Solução:
git pull origin main
npm run sync:templates
```

### Problema: "Config file not found"

```bash
# A configuração será criada automaticamente
# Ou criar manualmente:
mkdir -p .aios-core/config
cp .aios-core/config/templates-sync.yaml.default .aios-core/config/templates-sync.yaml
```

---

## 📊 Monitoramento

### Ver últimas sincronizações

```bash
# Ver commit log de templates
git log --oneline -- .aios-core/development/templates/

# Output:
# 8394003 chore(aios): auto-sync templates [2026-02-12T00:35:00Z]
# 7263748 feat(aios): add brownfield architecture template
# ...
```

### Ver logs de sincronização

```bash
# Ver logs do script
tail -f .aios/logs/template-sync.log

# Ver logs do GitHub Actions
# GitHub > Actions > Workflow > View Details
```

---

## 🎯 Best Practices

### 1. Usar Watch Mode Durante Desenvolvimento

```bash
# Terminal 1: Watch templates
npm run sync:templates:watch

# Terminal 2: Fazer desenvolvimento normal
# Tudo é sincronizado automaticamente
```

### 2. Revisar Commits Automáticos

```bash
# Ver o que foi sincronizado
git log --name-status -5

# Se não gostou, reverter:
git revert HEAD
```

### 3. Configurar CI/CD Localmente

```bash
# Testar workflow localmente (requer Act)
act push -j sync-templates
```

### 4. Documentar Mudanças

```yaml
# Ao modificar template, adicionar:
# metadata:
#   updated_by: your-name
#   date: 2026-02-12
#   reason: "Adicionado novo campo para Phase 5"
```

---

## 🔐 Segurança

### Autenticação Git

```bash
# GitHub com SSH (recomendado)
ssh -T git@github.com

# Ou HTTPS com token
git config --global credential.helper store
```

### Proteger Secrets

```bash
# NÃO adicionar secrets em templates
# Usar variáveis de ambiente em vez disso:
# ${SUPABASE_URL}  ← Será substituído em runtime
```

---

## 📖 Referência Completa

### Scripts Disponíveis

| Script | Descrição | Uso |
|--------|-----------|-----|
| `sync:templates` | Sincronização única | `npm run sync:templates` |
| `sync:templates:watch` | Modo watch contínuo | `npm run sync:templates:watch` |
| `sync:templates:status` | Ver status | `npm run sync:templates:status` |

### Ficheiros Relacionados

```
.aios-core/
├── config/
│   └── templates-sync.yaml         ← Configuração
├── development/
│   ├── scripts/
│   │   └── sync-templates.js       ← Script principal
│   └── templates/
│       ├── brownfield-architecture-tmpl.yaml
│       └── front-end-spec-tmpl.yaml
└── docs/
    └── TEMPLATE-SYNC.md            ← Este documento

.github/
└── workflows/
    └── sync-aios-templates.yml     ← GitHub Actions
```

---

## 🆘 Suporte

### Reportar Problemas

1. Verificar logs: `tail -f .aios/logs/template-sync.log`
2. Correr em dry-run: Editar `templates-sync.yaml` com `dry_run: true`
3. Reportar em GitHub Issues com output do log

### Desabilitar Sincronização

```bash
# Se precisar desabilitar temporariamente:
# Editar .aios-core/config/templates-sync.yaml:
enabled: false

# Depois re-ativar:
enabled: true
npm run sync:templates
```

---

## 📞 Contacto

- **Issues**: GitHub Issues
- **Documentação**: `.aios-core/docs/`
- **Configuração**: `.aios-core/config/templates-sync.yaml`

---

**Última atualização**: 2026-02-12
**Status**: ✅ Operacional
**Conformidade AIOS**: 100%
