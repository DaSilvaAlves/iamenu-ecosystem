# Wave 3.B Troubleshooting Guide
## Diagnosis and Resolution for Stories 3.2, 3.5, 3.7, 3.8, 3.9

**Version:** 1.0
**Status:** Ready for Operations Team
**Date:** 2026-02-14

---

## 🔍 QUICK DIAGNOSIS FLOWCHART

```
Is the system down completely?
├─ YES → Check: Infrastructure status
│        └─ PostgreSQL, Redis, API services running?
│
├─ NO → What's affected?
│  ├─ Search not working? → See: FULL-TEXT SEARCH section
│  ├─ Slow queries? → See: QUERY OPTIMIZATION section
│  ├─ No logs appearing? → See: LOGGING section
│  ├─ Analytics broken? → See: ANALYTICS section
│  └─ Alerts not firing? → See: MONITORING section
```

---

## 🔎 FULL-TEXT SEARCH ISSUES (Story 3.5)

### Problem: Search Returns No Results

**Diagnosis:**
```bash
# 1. Check index exists
SELECT * FROM pg_indexes WHERE tablename = 'Product' AND indexname LIKE '%search%';
# Should return: idx_products_search_gin

# 2. Check index health
REINDEX INDEX idx_products_search_gin;

# 3. Verify search query syntax
SELECT * FROM "marketplace"."Product"
WHERE to_tsvector('portuguese', name) @@ to_tsquery('portuguese', 'pasta');
```

**Resolution:**
```bash
# If no results:
# 1. Rebuild index
REINDEX INDEX idx_products_search_gin;

# 2. Analyze database
ANALYZE "marketplace"."Product";

# 3. Test again
curl "http://localhost:3002/api/v1/marketplace/search?q=pasta"
```

### Problem: Search Very Slow (> 500ms)

**Diagnosis:**
```bash
# Check query plan
EXPLAIN ANALYZE
SELECT * FROM "marketplace"."Product"
WHERE to_tsvector('portuguese', name || ' ' || description) @@ to_tsquery('portuguese', 'test');
# Look for: Seq Scan (bad) vs Index Scan (good)
```

**Resolution:**
```bash
# 1. If Seq Scan (no index):
REINDEX INDEX idx_products_search_gin;
ANALYZE "marketplace"."Product";

# 2. Check GIN index size
SELECT pg_size_pretty(pg_relation_size('idx_products_search_gin'));
# If > 50% of table size, consider archiving old data

# 3. Increase shared_buffers in PostgreSQL.conf
# postgresql.conf: shared_buffers = 256MB → 512MB (for VM)
# Restart PostgreSQL after change
```

### Problem: Search Timeout

**Diagnosis:**
```bash
# Check for locks
SELECT * FROM pg_locks WHERE relation::regclass::text LIKE '%Product%';
```

**Resolution:**
```bash
# 1. Cancel blocking query
SELECT pg_cancel_backend(pid) FROM pg_stat_activity
WHERE query LIKE '%Product%' AND pid != pg_backend_pid();

# 2. If still locked, terminate
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE query LIKE '%Product%' AND pid != pg_backend_pid();

# 3. Retry search
```

---

## ⚡ QUERY OPTIMIZATION ISSUES (Story 3.2)

### Problem: API Still Slow (> 500ms)

**Diagnosis:**
```bash
# Check if indexes were applied
SELECT * FROM pg_stat_user_indexes ORDER BY idx_scan DESC;

# Find slow queries
SELECT query, mean_exec_time, calls FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;
```

**Resolution:**
```bash
# 1. Ensure migration applied
npm run prisma:migrate status

# 2. If not applied, apply now
npm run prisma:migrate deploy

# 3. Analyze after index creation
ANALYZE;

# 4. Test performance
curl "http://localhost:3001/api/v1/community/posts?page=1" -w "Response time: %{time_total}s"
```

### Problem: High Database Load

**Diagnosis:**
```bash
# Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Check index usage
SELECT schemaname, tablename, indexname, idx_scan FROM pg_stat_user_indexes
WHERE idx_scan < 50 ORDER BY idx_scan;
# Low idx_scan = unused index
```

**Resolution:**
```bash
# 1. Identify N+1 patterns in logs
grep "N+1" logs/*.log

# 2. Check Prisma query includes
# Code review: Verify posts.include({ author: true }) used

# 3. Drop unused indexes if needed
DROP INDEX IF EXISTS idx_unused;

# 4. Increase connection pool
# .env: DATABASE_POOL_MAX=20 → 30
```

---

## 📝 LOGGING ISSUES (Story 3.8)

### Problem: No Logs in CloudWatch

**Diagnosis:**
```bash
# 1. Check CloudWatch configuration
echo $CLOUDWATCH_LOG_GROUP
# Should not be empty

# 2. Check AWS credentials
aws sts get-caller-identity
# Should return account info

# 3. Test CloudWatch connectivity
npm run scripts:test-cloudwatch
```

**Resolution:**
```bash
# 1. Verify credentials in .env
# Check: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are set

# 2. Restart services with logging
npm run dev

# 3. Check logs arriving
aws logs tail iamenu-ecosystem-logs --follow --since 1m
```

### Problem: PII Data in Logs (Security Issue)

**Diagnosis:**
```bash
# Search for sensitive patterns
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern "[password || email || token || card]"
```

**Resolution:**
```bash
# 1. Stop leaking immediately
# Find code leaking PII and fix

# 2. Example: Don't log user objects
// BAD
logger.info('User:', user); // Exposes password field

// GOOD
logger.info('User created', { userId: user.id, email: user.email });

# 3. Restart services
npm run dev

# 4. Old logs can't be deleted, but new logs will be clean
```

### Problem: Logs Delayed (> 10s)

**Diagnosis:**
```bash
# Check CloudWatch ingestion rate
aws logs describe-log-streams \
  --log-group-name iamenu-ecosystem-logs \
  --query 'logStreams[0].[lastEventTimestamp, firstEventTimestamp]'
# Difference should be < 10s
```

**Resolution:**
```bash
# 1. Check for network issues
ping -c 5 logs.eu-west-1.amazonaws.com

# 2. Reduce log volume if excessive
# .env: CLOUDWATCH_LOG_LEVEL=DEBUG → INFO

# 3. Batch logs instead of sending individually
# Winston configuration: batching enabled

# 4. Restart services
npm run dev
```

---

## 📊 ANALYTICS ISSUES (Story 3.7)

### Problem: Dashboard Shows No Data

**Diagnosis:**
```bash
# Check last calculation time
SELECT max("updatedAt") FROM "business"."DailyStats";
# Should be < 5 minutes ago

# Check for failed jobs
npm run scripts:check-analytics-jobs
```

**Resolution:**
```bash
# 1. Verify payment data exists
SELECT count(*) FROM "marketplace"."Order" WHERE "createdAt" > NOW() - INTERVAL '24 hours';
# Should be > 0 if sales happened

# 2. Manually trigger recalculation
npm run scripts:recalculate-analytics --force

# 3. Verify data flows
curl "http://localhost:3004/api/v1/business/analytics/dau"

# 4. Check for blocked queries
SELECT * FROM pg_stat_activity WHERE state != 'idle' AND query LIKE '%DailyStats%';
```

### Problem: Analytics Data Incorrect

**Diagnosis:**
```bash
# Manual verification
SELECT count(*) as dau FROM (
  SELECT DISTINCT "userId" FROM "community"."Post"
  WHERE DATE("createdAt") = CURRENT_DATE
) t;
# Compare with dashboard DAU value
```

**Resolution:**
```bash
# 1. Rebuild analytics from scratch
npm run scripts:rebuild-analytics --force --full
# Takes 10-30 minutes

# 2. Verify aggregation logic in code
# Check: services/business/src/services/analytics.service.ts

# 3. Run tests
npm run test:business -- --testNamePattern="analytics"

# 4. Restart service
npm run dev:business
```

---

## 📡 MONITORING ISSUES (Story 3.9)

### Problem: Alerts Not Firing

**Diagnosis:**
```bash
# Check Prometheus metrics
curl "http://prometheus:9090/api/prom/query?query=up"
# Should show: api=1, database=1, etc

# Check alert rules loaded
curl "http://prometheus:9090/api/v1/rules" | jq '.data.groups[].rules'
```

**Resolution:**
```bash
# 1. Verify metrics are being scraped
curl "http://localhost:9090/api/prom/query?query=http_request_total"
# Should return data points

# 2. Restart Prometheus
docker restart prometheus

# 3. Manually trigger test alert
npm run scripts:test-alert --severity critical

# 4. Check Slack integration
# Verify webhook URL in AlertManager config
```

### Problem: Alert Storm (Too Many Alerts)

**Diagnosis:**
```bash
# Check active alerts in Grafana
curl "http://grafana:3000/api/v1/alerts"

# Identify patterns in alerts
# Usually: Single root cause → many alerts
```

**Resolution:**
```bash
# 1. Quick silence (1 hour)
# Grafana UI: Alerts → Silences → New Silence
# Select alert group, set 1h duration

# 2. Find root cause
# Check logs: High CPU? High connections? Disk full?

# 3. Fix root cause
# Scale up resources, kill hanging queries, etc

# 4. Remove silence once fixed
# Grafana UI: Alerts → Silences → Delete
```

### Problem: Metrics Dashboard Blank

**Diagnosis:**
```bash
# Check Grafana datasource
curl "http://grafana:3000/api/datasources"
# Should show Prometheus datasource, status OK

# Verify Prometheus running
curl "http://prometheus:9090/-/healthy"
# Should return 200 OK
```

**Resolution:**
```bash
# 1. Restart Grafana
docker restart grafana

# 2. Reconnect datasource
# Grafana UI: Configuration → Data Sources → Prometheus
# Click Test

# 3. Restart Prometheus
docker restart prometheus

# 4. Wait 2-5 minutes for metrics to flow
```

---

## 🚨 EMERGENCY PROCEDURES

### Database Connection Pool Exhausted

**Symptoms:** "Timed out acquiring a new connection"

**Fix:**
```bash
# 1. Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state != 'idle';

# 2. Kill long-running queries
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 minutes';

# 3. Restart application
npm run dev
```

### Redis Memory Exhausted

**Symptoms:** "OOM command not allowed"

**Fix:**
```bash
# 1. Check memory usage
redis-cli INFO memory

# 2. Clear old cache
redis-cli FLUSHDB

# 3. Check eviction policy
redis-cli CONFIG GET maxmemory-policy
# Should be: allkeys-lru

# 4. Increase Redis memory if needed
# docker-compose.yml: memory: 512m → 1g
```

### PostgreSQL Disk Full

**Symptoms:** "Remaining connection slots reserved"

**Fix:**
```bash
# 1. Check disk space
df -h /var/lib/postgresql

# 2. Find largest tables
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables ORDER BY pg_total_relation_size DESC LIMIT 10;

# 3. Archive old data if needed
DELETE FROM "community"."Post" WHERE "createdAt" < NOW() - INTERVAL '1 year';
VACUUM ANALYZE;

# 4. Restart PostgreSQL
systemctl restart postgresql
```

---

## 📞 ESCALATION

| Issue | Severity | Action |
|-------|----------|--------|
| No search results | HIGH | Rebuild index → Restart → Escalate |
| Slow queries (> 1s) | MEDIUM | Check load → Scale → Escalate |
| No logs | CRITICAL | Check AWS creds → Restart → Escalate |
| Analytics stale | MEDIUM | Recalculate → Verify → Escalate |
| Alerts not firing | HIGH | Check Prometheus → Restart → Escalate |
| All services down | CRITICAL | Infrastructure check → Escalate immediately |

---

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Next Review:** After Wave 3.B launch
