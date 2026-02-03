# TD-005: Verify Database Backup Procedures

**Priority:** P0 - CRITICAL
**Estimated Hours:** 4-6h
**Owner:** @devops
**Sprint:** Tech Debt P0
**Status:** Ready

---

## Story Statement

**As a** system administrator,
**I want** verified backup and restore procedures for the production database,
**So that** we can recover from data loss and safely deploy schema changes.

---

## Problem Description

Before making schema changes (TD-003, TD-004), we need to verify that:
1. Database backups are being created
2. Backups can be successfully restored
3. Restore procedures are documented and tested

This is a **critical safety net** for any production database changes.

---

## Acceptance Criteria

- [ ] **AC1:** Manual backup created successfully
- [ ] **AC2:** Backup restored to test environment
- [ ] **AC3:** All 4 schemas verified post-restore (community, marketplace, academy, business)
- [ ] **AC4:** Data integrity verified (record counts match)
- [ ] **AC5:** Restore time documented
- [ ] **AC6:** Backup schedule confirmed (minimum: daily)
- [ ] **AC7:** Backup retention policy documented
- [ ] **AC8:** Runbook created for restore procedure

---

## Technical Approach

### Railway PostgreSQL Backup

Railway provides automatic backups for PostgreSQL. We need to:
1. Verify automatic backups are enabled
2. Test manual backup creation
3. Test restore to a separate database

### Backup Methods

| Method | Tool | When to Use |
|--------|------|-------------|
| Railway Automatic | Railway Dashboard | Daily automated backups |
| Manual Snapshot | Railway CLI | Before major changes |
| pg_dump | PostgreSQL CLI | Full export for migration |

---

## Tasks

### Phase 1: Verify Current Backup Status (1h)
- [ ] **Task 1:** Login to Railway dashboard
- [ ] **Task 2:** Navigate to PostgreSQL service → Backups tab
- [ ] **Task 3:** Verify automatic backups are enabled
- [ ] **Task 4:** Document backup frequency and retention
- [ ] **Task 5:** Note the most recent backup timestamp

### Phase 2: Create Manual Backup (30min)
- [ ] **Task 6:** Create manual snapshot via Railway dashboard
- [ ] **Task 7:** Alternatively, use `pg_dump` for local backup:
```bash
pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE -F c -f iamenu_backup_$(date +%Y%m%d).dump
```
- [ ] **Task 8:** Verify backup file created and size is reasonable

### Phase 3: Test Restore (2-3h)
- [ ] **Task 9:** Create test database (local Docker or Railway dev environment)
- [ ] **Task 10:** Restore backup to test database:
```bash
pg_restore -h localhost -U postgres -d iamenu_test -F c iamenu_backup_YYYYMMDD.dump
```
- [ ] **Task 11:** Connect to restored database
- [ ] **Task 12:** Verify all 4 schemas exist:
```sql
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('community', 'marketplace', 'academy', 'business');
```
- [ ] **Task 13:** Verify table counts match production
- [ ] **Task 14:** Verify sample data integrity

### Phase 4: Documentation (1h)
- [ ] **Task 15:** Create backup runbook in `docs/operations/backup-restore.md`
- [ ] **Task 16:** Document restore procedure step-by-step
- [ ] **Task 17:** Document restore time (for RTO planning)
- [ ] **Task 18:** Document backup retention policy

---

## Test Plan

### Data Integrity Verification

```sql
-- Run on PRODUCTION
SELECT 'community.posts' as table_name, COUNT(*) as count FROM community.posts
UNION ALL
SELECT 'marketplace.suppliers', COUNT(*) FROM marketplace.suppliers
UNION ALL
SELECT 'academy.courses', COUNT(*) FROM academy.courses
UNION ALL
SELECT 'business.restaurants', COUNT(*) FROM business.restaurants;

-- Run on RESTORED DATABASE (should match)
-- Same query as above
```

### Schema Verification

```sql
-- Verify all tables exist
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_schema IN ('community', 'marketplace', 'academy', 'business')
ORDER BY table_schema, table_name;
```

---

## Runbook Template

```markdown
# Database Restore Procedure

## Prerequisites
- Railway CLI installed (`npm i -g @railway/cli`)
- PostgreSQL client (psql, pg_restore)
- Access to Railway dashboard

## Steps

### 1. Identify Backup to Restore
- Go to Railway Dashboard → PostgreSQL → Backups
- Note the backup ID or timestamp

### 2. Create Target Database
- Option A: Railway staging environment
- Option B: Local Docker PostgreSQL

### 3. Restore Backup
\`\`\`bash
# Railway restore (to same or different environment)
railway db restore <backup-id> --target <environment>

# Or using pg_restore
pg_restore -h $HOST -U $USER -d $DATABASE -F c backup_file.dump
\`\`\`

### 4. Verify Restore
\`\`\`sql
-- Check schemas
SELECT schema_name FROM information_schema.schemata;

-- Check table counts
SELECT COUNT(*) FROM community.posts;
\`\`\`

## Estimated Time
- Small DB (< 1GB): 5-10 minutes
- Medium DB (1-10GB): 15-30 minutes
```

---

## Definition of Done

- [ ] Automatic backups verified enabled
- [ ] Manual backup created successfully
- [ ] Restore tested on separate environment
- [ ] All 4 schemas restored correctly
- [ ] Data integrity verified
- [ ] Restore time documented
- [ ] Runbook created at `docs/operations/backup-restore.md`

---

## References

- **Source:** `docs/prd/technical-debt-FINAL.md` Section 11 (TECH-DEBT-005)
- **Railway Docs:** https://docs.railway.app/databases/postgresql
- **Production DB:** Railway PostgreSQL (iaMenu Ecosystem)

---

**Created:** 2026-02-03
**Workflow:** Brownfield Tech Debt Sprint
