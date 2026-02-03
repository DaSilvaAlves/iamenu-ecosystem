# Procedimento de Backup e Restore - iaMenu Ecosystem

**Última atualização:** 2026-02-03
**Responsável:** @devops

---

## Resumo

| Item | Valor |
|------|-------|
| Base de Dados | PostgreSQL 16 |
| Hosting Dev | Docker Local (`iamenu-postgres`) |
| Hosting Prod | Railway (sem backups no plano gratuito) |
| Schemas | community, marketplace, academy, business |
| Método Backup | `pg_dump` via Docker |
| Scripts | `scripts/backup-database.ps1`, `scripts/restore-database.ps1` |

> **NOTA:** Railway só oferece backups automáticos no plano Pro ($20/mês).
> Para o plano gratuito, usamos backups manuais via pg_dump.

---

## 1. Verificar Backups Automáticos (Railway Dashboard)

### Passo a Passo:

1. Acede a [railway.app](https://railway.app) e faz login
2. Seleciona o projeto **believable-endurance** → **production**
3. Clica no serviço **Postgres** (ícone do elefante)
4. No painel direito, clica no separador **"Backups"**
5. Verifica:
   - [ ] Backups automáticos estão ativados
   - [ ] Data do último backup
   - [ ] Número de backups disponíveis

### O que deves ver:
```
Backups
├── Automatic backups: Enabled
├── Last backup: 2026-02-03 03:00 UTC
├── Retention: 7 days
└── Available backups: 7
```

---

## 2. Criar Backup Manual (Railway Dashboard)

### Quando usar:
- Antes de migrações de schema
- Antes de alterações em produção
- Antes de operações de DELETE em massa

### Passo a Passo:

1. No Railway Dashboard, vai ao serviço **Postgres**
2. Clica no separador **"Backups"**
3. Clica no botão **"Create Backup"** (canto superior direito)
4. Aguarda a mensagem de confirmação
5. O backup aparece na lista com timestamp atual

### Tempo estimado:
- BD pequena (< 100MB): ~30 segundos
- BD média (100MB - 1GB): 1-3 minutos

---

## 3. Restaurar Backup (Railway Dashboard)

### ATENÇÃO: Isto SUBSTITUI todos os dados atuais!

### Passo a Passo:

1. No Railway Dashboard, vai ao serviço **Postgres** → **Backups**
2. Encontra o backup que queres restaurar (pela data/hora)
3. Clica nos **"..."** (três pontos) ao lado do backup
4. Seleciona **"Restore"**
5. Confirma a operação (Railway pede confirmação)
6. Aguarda a conclusão (pode demorar alguns minutos)

### Verificação pós-restore:
```sql
-- Executa no Railway Query Editor ou psql
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('community', 'marketplace', 'academy', 'business');

-- Deve retornar 4 linhas
```

---

## 4. Backup Manual via pg_dump (Alternativa Local)

### Pré-requisitos:
- PostgreSQL client instalado (`psql`, `pg_dump`)
- Credenciais da BD (disponíveis no Railway)

### Obter credenciais do Railway:

1. Railway Dashboard → Postgres → **"Connect"** (separador)
2. Copia os valores:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### Criar backup local:

```bash
# Windows PowerShell
$env:PGPASSWORD="<password_do_railway>"
pg_dump -h <host> -p <port> -U <user> -d <database> -F c -f backup_iamenu_$(Get-Date -Format "yyyyMMdd_HHmm").dump

# Linux/Mac
export PGPASSWORD="<password_do_railway>"
pg_dump -h <host> -p <port> -U <user> -d <database> -F c -f backup_iamenu_$(date +%Y%m%d_%H%M).dump
```

### Restaurar backup local:

```bash
# Para uma BD local de teste
pg_restore -h localhost -p 5432 -U postgres -d iamenu_test -F c backup_iamenu_XXXXXXXX.dump
```

---

## 5. Verificação de Integridade

### Query para contar registos (executar antes e depois):

```sql
-- Contagem de registos por tabela principal
SELECT 'community.posts' as tabela, COUNT(*) as registos FROM community.posts
UNION ALL SELECT 'community.profiles', COUNT(*) FROM community.profiles
UNION ALL SELECT 'community.groups', COUNT(*) FROM community.groups
UNION ALL SELECT 'marketplace.suppliers', COUNT(*) FROM marketplace.suppliers
UNION ALL SELECT 'marketplace.products', COUNT(*) FROM marketplace.products
UNION ALL SELECT 'academy.courses', COUNT(*) FROM academy.courses
UNION ALL SELECT 'academy.enrollments', COUNT(*) FROM academy.enrollments
UNION ALL SELECT 'business.restaurants', COUNT(*) FROM business.restaurants
ORDER BY tabela;
```

### Guardar resultado antes de alterações:
```
| tabela                  | registos |
|-------------------------|----------|
| academy.courses         | XX       |
| academy.enrollments     | XX       |
| business.restaurants    | XX       |
| community.groups        | XX       |
| community.posts         | XX       |
| community.profiles      | XX       |
| marketplace.products    | XX       |
| marketplace.suppliers   | XX       |
```

---

## 6. Checklist Pré-Migração

Antes de qualquer alteração de schema em produção:

- [ ] Verificar último backup automático (< 24h)
- [ ] Criar backup manual
- [ ] Anotar contagem de registos
- [ ] Testar migração em ambiente local primeiro
- [ ] Ter plano de rollback pronto

---

## 7. Contactos de Emergência

| Situação | Ação |
|----------|------|
| Dados corrompidos | Restaurar último backup via Railway |
| Backup não disponível | Contactar suporte Railway |
| Migração falhou | Reverter com backup manual |

---

## 8. Histórico de Verificações

| Data | Verificado por | Resultado |
|------|----------------|-----------|
| 2026-02-03 | @devops | Documentação criada |
| | | |

---

**Próxima revisão:** 2026-03-03
