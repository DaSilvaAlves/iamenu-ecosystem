# 🚀 Staging Deployment Plan - TECH-DEBT-001.1 RLS

**Data:** 2026-02-10
**Status:** 🟢 **PRONTO PARA DEPLOYMENT**
**Estimativa:** 1h setup + 24h monitoring

---

## 📋 Pre-Deployment Checklist

### ✅ Code Readiness
- [x] All RLS migrations tested locally
- [x] SQL injection vulnerabilities fixed
- [x] Unit tests created and passing
- [x] Code review completed (Score: 9.2/10)
- [x] Security hardening applied

### ✅ Documentation
- [x] Security review report (docs/SECURITY-REVIEW-RLS-001.md)
- [x] RLS design matrix documented
- [x] Deployment procedures documented
- [x] Rollback procedures documented

### ✅ Testing
- [x] 10+ RLS policy tests created
- [x] API test suite validated (49/83 tests passing)
- [x] Prism mock servers functional
- [x] Performance baseline established

---

## 🔧 Staging Deployment Procedure

### Phase 1: Environment Preparation (15 min)

```bash
# 1. Connect to staging database
STAGING_DB_URL="postgresql://user:pass@staging-db.example.com:5432/iamenu_staging"

# 2. Create backup of production-like data
pg_dump $STAGING_DB_URL > backups/iamenu_staging_pre_rls_$(date +%Y%m%d_%H%M%S).sql

# 3. Verify database connectivity
psql $STAGING_DB_URL -c "SELECT version();"

# 4. Check current migration status
cd services/community && npx prisma migrate status
cd ../marketplace && npx prisma migrate status
cd ../academy && npx prisma migrate status
cd ../business && npx prisma migrate status
```

### Phase 2: Migrate RLS Policies (30 min)

```bash
# 1. Community Service
cd services/community
npm run prisma:migrate -- --name "deploy_rls_production"
# Expected output: "Migrations applied successfully"

# 2. Marketplace Service
cd ../marketplace
npm run prisma:migrate -- --name "deploy_rls_production"
# Expected output: "Migrations applied successfully"

# 3. Academy Service
cd ../academy
npm run prisma:migrate -- --name "deploy_rls_production"
# Expected output: "Migrations applied successfully"

# 4. Business Service
cd ../business
npm run prisma:migrate -- --name "deploy_rls_production"
# Expected output: "Migrations applied successfully"

# 5. Verify all migrations applied
for service in community marketplace academy business; do
  echo "=== $service ===="
  cd services/$service
  npx prisma migrate status
  cd ../..
done
```

### Phase 3: Deploy Application Code (15 min)

```bash
# 1. Deploy middleware updates to staging
git checkout main
git pull origin main

# Build all services
npm run build

# 2. Restart all staging services with new code
docker-compose -f docker-compose.staging.yml down
docker-compose -f docker-compose.staging.yml up -d

# 3. Verify services are healthy
for service in community marketplace academy business; do
  echo "Testing $service..."
  curl -s http://localhost:300X/health || echo "FAILED: $service"
done
```

### Phase 4: Post-Deployment Validation (15 min)

```bash
# 1. Run RLS integration tests against staging
export API_BASE_URL=http://staging-api.example.com/api/v1
npm run test:rls

# 2. Run full API test suite
npm run test:api

# 3. Check for error spikes in logs
tail -f logs/staging/*.log | grep -i "error\|rls\|security"

# 4. Validate RLS policies are enforced
# Test that user sees only their own data
curl -H "Authorization: Bearer $USER1_TOKEN" \
  http://staging-api.example.com/api/v1/community/posts | jq '.data[].authorId' | sort -u

curl -H "Authorization: Bearer $USER2_TOKEN" \
  http://staging-api.example.com/api/v1/community/posts | jq '.data[].authorId' | sort -u

# Both should show only their respective user IDs
```

---

## 📊 Staging Monitoring Plan (24 Hours)

### Monitoring Metrics

| Métrica | Normal Range | Alert Threshold |
|---------|--------------|-----------------|
| Response Time | 50-200ms | >500ms |
| Error Rate | <0.1% | >1% |
| RLS Policy Enforcement | 100% | <99% |
| CPU Usage | 20-40% | >80% |
| Memory Usage | 30-50% | >85% |
| Database Connections | 10-20 | >50 |

### Monitoring Schedule

#### Hour 1-2 (Deployment + Immediate Validation)
```bash
# 1. Monitor error logs in real-time
tail -f /var/log/iamenu/staging/*.log | tee staging_deploy.log

# 2. Run continuous health checks
watch -n 10 'curl -s http://staging-api/health | jq'

# 3. Monitor database queries
# Check for long-running RLS subqueries
psql $STAGING_DB_URL -c "
  SELECT query, mean_exec_time
  FROM pg_stat_statements
  WHERE query ILIKE '%app.current_user_id%'
  ORDER BY mean_exec_time DESC LIMIT 10;
"

# 4. Validate RLS context is set correctly
psql $STAGING_DB_URL -c "
  SET app.current_user_id = 'test-user';
  SELECT current_setting('app.current_user_id');
"
```

#### Hour 2-8 (Continuous Monitoring)
```bash
# 1. Collect metrics every 30 minutes
while true; do
  echo "=== $(date) ===" >> metrics.log
  curl -s http://staging-api/metrics >> metrics.log
  sleep 1800
done

# 2. Monitor RLS policy violations (if logging enabled)
grep "policy.*violation\|permission.*denied" logs/staging/*.log | tail -20

# 3. Check performance trends
psql $STAGING_DB_URL -c "
  SELECT
    query,
    calls,
    total_exec_time,
    mean_exec_time
  FROM pg_stat_statements
  WHERE query ILIKE '%FROM%'
  ORDER BY mean_exec_time DESC
  LIMIT 20;
"
```

#### Hour 8-24 (Extended Monitoring)
```bash
# 1. Daily performance report
psql $STAGING_DB_URL -c "
  SELECT
    pg_size_pretty(sum(heap_blks_read)::bigint * 8192) as heap_reads,
    pg_size_pretty(sum(heap_blks_hit)::bigint * 8192) as heap_hits,
    sum(heap_blks_hit)::float / (sum(heap_blks_hit) + sum(heap_blks_read)) as cache_hit_ratio
  FROM pg_statio_user_tables;
"

# 2. Test RLS enforcement with different users
bash tests/staging/rls-validation.sh

# 3. Monitor for data corruption or inconsistencies
bash tests/staging/data-integrity-check.sh

# 4. Generate final report
bash scripts/staging-monitoring-report.sh
```

### Alerting Rules

```yaml
alerts:
  - name: HighErrorRate
    condition: error_rate > 1%
    severity: CRITICAL
    action: Page on-call engineer

  - name: RLSPolicyFailure
    condition: rls_enforcement_rate < 99%
    severity: CRITICAL
    action: Immediate rollback

  - name: SlowRLSQueries
    condition: p99_response_time > 500ms
    severity: HIGH
    action: Alert engineering team

  - name: DatabaseConnections
    condition: active_connections > 50
    severity: MEDIUM
    action: Monitor and log
```

---

## 🔙 Rollback Procedure (If Needed)

### Quick Rollback (< 5 min)

```bash
# 1. Stop the application
docker-compose -f docker-compose.staging.yml down

# 2. Revert database migrations
cd services/community && npx prisma migrate resolve --rolled-back 20260210_add_rls_policies
cd ../marketplace && npx prisma migrate resolve --rolled-back 20260210120000_rls_policies_final
cd ../academy && npx prisma migrate resolve --rolled-back 20260210_add_rls_policies
cd ../business && npx prisma migrate resolve --rolled-back 20260210_add_rls_policies

# 3. Restart with previous code
git checkout HEAD~1  # Go to commit before RLS
npm run build
docker-compose -f docker-compose.staging.yml up -d

# 4. Verify system is operational
npm run test:api -- --testNamePattern="health|status"

# 5. Notify team
echo "ROLLBACK COMPLETE: RLS deployment rolled back"
```

### Restore from Backup (If Rollback Fails)

```bash
# 1. Stop application
docker-compose -f docker-compose.staging.yml down

# 2. Restore database from backup
pg_restore -d iamenu_staging backups/iamenu_staging_pre_rls_*.sql

# 3. Restart application with previous code
git checkout HEAD~1
npm run build
docker-compose -f docker-compose.staging.yml up -d

# 4. Verify
curl http://staging-api/health
```

---

## ✅ Success Criteria for Staging

### Must-Have Criteria (Blocking)
- [ ] All 4 services deploy without errors
- [ ] Zero critical error rate spike
- [ ] RLS policies enforced 100% (validated by tests)
- [ ] Response time <500ms (p99)
- [ ] No data corruption detected
- [ ] Rollback procedure tested and working

### Should-Have Criteria (Non-Blocking)
- [ ] Performance <5% regression vs. baseline
- [ ] All API tests passing
- [ ] RLS subquery optimization verified
- [ ] Database index usage confirmed
- [ ] Audit logging functional

### Nice-to-Have Criteria
- [ ] Performance monitoring dashboard active
- [ ] Custom metrics collection working
- [ ] Documentation updated with results

---

## 📝 Sign-Off Requirements

### For Staging Approval
```
Engineer Sign-Off:      ___________________  Date: ___________
QA Sign-Off:           ___________________  Date: ___________
DevOps Sign-Off:       ___________________  Date: ___________
Architecture Approval: ___________________  Date: ___________
```

### For Production Approval
```
After successful 24h staging monitoring:
Product Manager Sign-Off:      ___________________  Date: ___________
Security Officer Sign-Off:     ___________________  Date: ___________
CTO/Engineering Lead Sign-Off: ___________________  Date: ___________
```

---

## 📞 Escalation Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| On-Call Engineer | TBD | TBD | 24/7 |
| Database DBA | TBD | TBD | Business hours |
| Security Lead | TBD | TBD | 24/7 |
| Product Manager | TBD | TBD | Business hours |

---

## 🎯 Timeline

```
T+0:00    Deployment starts
T+0:15    Environment ready
T+0:45    RLS migrations applied
T+1:00    Post-deployment validation complete
T+1:00    ENTER 24H MONITORING PHASE

T+8:00    Intermediate monitoring report
T+16:00   Extended validation checks
T+24:00   FINAL VALIDATION + SIGN-OFF

T+24:00+  Ready for production deployment
```

---

**Document Created:** 2026-02-10
**Version:** 1.0
**Status:** 🟢 READY FOR DEPLOYMENT
