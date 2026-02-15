# Wave 3 Operations Runbook
## Post-Launch Operational Procedures

**Version:** 1.0
**Status:** Ready for Review
**Date:** 2026-02-14
**Audience:** DevOps, On-Call Engineers

---

## 📖 QUICK START

### Most Common Operations

#### 1. Restart Redis Cache
```bash
# If cache is experiencing issues
docker restart iamenu-redis
# OR via CLI
redis-cli SHUTDOWN SAVE
redis-server /path/to/redis.conf

# Verify cache is working
redis-cli ping
# Expected response: PONG
```

#### 2. Clear Redis Cache (Debugging)
```bash
redis-cli
> SELECT 0
> FLUSHDB  # Clear current database
> FLUSHALL # Clear all databases (if needed)
> EXIT
```

#### 3. Check CloudWatch Logs
```bash
# View recent logs (last 100 lines)
aws logs tail /aws/lambda/iamenu-logs --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/iamenu-logs \
  --filter-pattern "ERROR"

# Search for specific service
aws logs filter-log-events \
  --log-group-name /aws/lambda/iamenu-logs \
  --filter-pattern "[service = \"community\"]"
```

#### 4. Rebuild Search Index
```bash
# Full search index rebuild (0-downtime)
npm run scripts:rebuild-search-index

# Expected output:
# ✅ Rebuilt 45,234 posts
# ✅ Rebuilt 12,456 products
# ✅ Rebuilt 234 courses
# ✅ Rebuilt 567 suppliers
# Completed in 5m 42s
```

#### 5. View Monitoring Alerts
```bash
# Access Grafana dashboard
https://grafana.iamenu.local/

# Quick health check
curl https://api.iamenu.local/health
# Expected: { "status": "ok", "timestamp": "..." }
```

---

## 🚀 WAVE 3.A OPERATIONS (Redis, Notifications, Payments)

### Redis Caching (Story 3.1)

#### Health Check
```bash
# Check Redis availability
redis-cli PING
# Response: PONG (✅ healthy) or connection refused (❌ down)

# Check cache stats
redis-cli INFO stats
# Look for: total_connections_received, total_commands_processed

# Monitor cache hit rate
redis-cli INFO stats | grep hits
# Formula: hits / (hits + misses) = hit ratio (target: > 60%)
```

#### Troubleshooting: Low Cache Hit Rate

```bash
# 1. Check cache configuration
redis-cli CONFIG GET maxmemory
redis-cli CONFIG GET maxmemory-policy

# 2. View memory usage
redis-cli INFO memory | grep used_memory_human
# If > 90% of maxmemory, eviction happening

# 3. Check TTL on keys
redis-cli TTL <key>
# -1 = no expiry, -2 = key doesn't exist, >0 = seconds remaining

# 4. Clear cache if corrupted
redis-cli FLUSHDB
# Services will auto-regenerate on first request (slight latency spike)

# 5. Restart if persistent issues
docker restart iamenu-redis
```

#### Increasing Cache Performance

```sql
-- Run on database to identify cacheable data
SELECT COUNT(*) FROM "community"."Post" WHERE "createdAt" > NOW() - INTERVAL '7 days';
SELECT COUNT(*) FROM "marketplace"."Product";

-- If large result sets, consider:
-- 1. Increase Redis memory: redis.conf maxmemory 512mb → 1gb
-- 2. Adjust TTL: shorter for volatile data, longer for stable
-- 3. Add composite caching: cache aggregations not just raw data
```

### Notifications (Story 3.4)

#### Health Check
```bash
# Check Socket.io connectivity
# In browser console:
io.readyState === 'open' // should be true

# Check email queue
npm run scripts:check-email-queue
# Expected: X emails queued, Y emails sent

# Check notification delivery rate (should be > 99%)
aws logs filter-log-events \
  --log-group-name /aws/lambda/iamenu-logs \
  --filter-pattern "[service = \"community\", event_type = \"notification_sent\"]" \
  --start-time $(date -d '1 hour ago' +%s)000
```

#### Troubleshooting: Notifications Not Sending

```bash
# 1. Check email service health
npm run scripts:test-email-service
# Expected: "✅ Email service responding"

# 2. Check notification queue (BullMQ)
npm run scripts:check-job-queue

# 3. Review logs for specific errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/iamenu-logs \
  --filter-pattern "notification_error"

# 4. Restart notification worker if stuck
docker restart iamenu-notification-worker

# 5. Manual retry for stuck notifications
npm run scripts:retry-failed-notifications --limit 100
```

### Payments (Story 3.6)

#### Health Check
```bash
# Check Stripe connectivity
npm run scripts:test-stripe-connection
# Expected: "✅ Connected to Stripe"

# Check recent transactions
npm run scripts:check-payments --last-hour
# Expected: List of successful/failed payments

# Verify webhook health
npm run scripts:verify-stripe-webhooks
# Expected: All webhooks delivering successfully
```

#### Troubleshooting: Payment Processing Issues

```bash
# 1. Check Stripe API status
# Visit https://status.stripe.com/

# 2. Verify webhook signatures
npm run scripts:validate-webhook-signatures

# 3. Check for duplicate charges
SELECT "stripePaymentIntentId", COUNT(*) as count
FROM "marketplace"."Order"
GROUP BY "stripePaymentIntentId"
HAVING count > 1;
# If results exist: investigate & potentially refund duplicates

# 4. Reconcile orders with Stripe
npm run scripts:reconcile-stripe-payments
# Checks all orders have corresponding Stripe records

# 5. Manual payment verification
curl https://api.stripe.com/v1/payment_intents/<intent-id> \
  -H "Authorization: Bearer sk_live_..."
# Verify status is 'succeeded', amount matches
```

#### Emergency: Payment Service Down

```bash
# 1. Stop accepting new payments
# Set in database:
UPDATE "marketplace"."configuration"
SET "payments_enabled" = false
WHERE "key" = 'PAYMENTS_ENABLED';

# 2. Display maintenance message to users
# Check frontend env: REACT_APP_PAYMENT_MAINTENANCE=true

# 3. Monitor Stripe status
# Watch https://status.stripe.com/ for resolution

# 4. When Stripe is back:
UPDATE "marketplace"."configuration"
SET "payments_enabled" = true
WHERE "key" = 'PAYMENTS_ENABLED';

# 5. Reconcile any missed transactions
npm run scripts:reconcile-stripe-payments --full
```

---

## 🔍 WAVE 3.B OPERATIONS (Search, Logging, Analytics, Monitoring)

### Full-Text Search (Story 3.5)

#### Health Check
```bash
# Test search API
curl "http://localhost:3002/api/v1/marketplace/search?q=pasta"
# Expected: Array of matching products with relevance scores

# Check index size
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_indexes
WHERE indexname LIKE '%search%';
```

#### Troubleshooting: Slow Search

```bash
# 1. Check PostgreSQL query plan
EXPLAIN ANALYZE
SELECT * FROM "marketplace"."Product"
WHERE to_tsvector('portuguese', name || ' ' || description) @@ to_tsquery('portuguese', 'pasta');
# Look for: Index Scan (good) vs Seq Scan (bad)

# 2. Rebuild index if fragmented
REINDEX INDEX idx_products_search_gin;

# 3. Update statistics
ANALYZE "marketplace"."Product";

# 4. Check for locked tables
SELECT pid, usename, application_name, state, query
FROM pg_stat_activity
WHERE state NOT IN ('idle', 'idle in transaction');
# Long locks indicate blocking queries
```

#### Rebuilding Search Index

```bash
# Full rebuild (zero-downtime via dual-index strategy)
npm run scripts:rebuild-search-index --service all

# Rebuild specific service
npm run scripts:rebuild-search-index --service marketplace

# Monitor progress
tail -f logs/search-rebuild.log
```

### Comprehensive Logging (Story 3.8)

#### Health Check
```bash
# Check CloudWatch log stream
aws logs describe-log-streams \
  --log-group-name iamenu-ecosystem-logs \
  --order-by LastEventTime --descending

# Verify logs arriving (should be < 10s delay)
aws logs get-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --log-stream-name app-stream \
  --limit 10

# Check for PII in logs (should be none)
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern "[password || creditCard || ssn || cardNumber]"
# Expected: No results
```

#### Troubleshooting: Missing Logs

```bash
# 1. Check CloudWatch configuration
# In .env:
echo $CLOUDWATCH_LOG_GROUP
echo $CLOUDWATCH_REGION
echo $CLOUDWATCH_LOG_LEVEL

# 2. Verify AWS credentials
aws sts get-caller-identity
# Should return account info, not error

# 3. Check service logs directly (if CloudWatch down)
docker logs iamenu-community-api | tail -100

# 4. Test CloudWatch connectivity
npm run scripts:test-cloudwatch-connection

# 5. Restart logging service
npm run dev
# Services will reconnect to CloudWatch
```

#### Retrieving Specific Logs

```bash
# Find all errors from community service in last hour
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern '[service = "community", level = "ERROR"]' \
  --start-time $(($(date +%s) - 3600))000

# Search for specific user activity
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern '[userId = "user_12345"]'

# Trend analysis: Error rate over time
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern '[level = "ERROR"]' \
  --start-time $(($(date +%s) - 86400))000 | jq '.events | length'
```

### Analytics & Reporting (Story 3.7)

#### Health Check
```bash
# Verify analytics engine is running
curl http://localhost:3004/api/v1/business/analytics/health
# Expected: { "status": "ok" }

# Check DAU/MAU calculation
npm run scripts:check-analytics --metric dau
# Expected: Timestamp of last update < 5 minutes ago

# Verify revenue calculations
npm run scripts:verify-revenue-accuracy
# Expected: "✅ Revenue data consistent with orders"
```

#### Troubleshooting: Analytics Data Stale

```bash
# 1. Force recalculation
npm run scripts:recalculate-analytics --force

# 2. Check for failed jobs
npm run scripts:check-analytics-jobs
# Look for failed ETL jobs

# 3. Verify payment data is flowing
SELECT COUNT(*) FROM "marketplace"."Order" WHERE "createdAt" > NOW() - INTERVAL '1 hour';
# Should be > 0 if payments happening

# 4. Rebuild analytics from scratch (slow)
npm run scripts:rebuild-analytics --force --full
# This may take 10-30 minutes depending on data volume
```

### Monitoring & Alerts (Story 3.9)

#### Health Check
```bash
# Access Grafana
https://grafana.iamenu.local/

# Verify metrics are flowing
curl http://localhost:9090/api/prom/query?query=up
# Should show: {"status":"success","data":{"resultType":"instant",...}}

# Check alert status
curl http://alertmanager.local:9093/api/v1/alerts
# Should show active alerts (if any)
```

#### Troubleshooting: Alerts Not Firing

```bash
# 1. Check Prometheus scrape status
curl http://prometheus.local:9090/api/v1/targets
# Look for: endpoint should be "UP"

# 2. Verify metrics are being scraped
curl http://localhost:9090/api/prom/query?query=node_up
# Should return data points

# 3. Check AlertManager config
cat /etc/alertmanager/config.yml | grep -A 5 "routes:"

# 4. Test alert routing
npm run scripts:test-alert --channel slack --severity critical

# 5. Restart monitoring stack if needed
docker restart prometheus grafana alertmanager
```

#### Handling Alert Storm (Too Many Alerts)

```bash
# 1. Identify the issue
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern '[level = "ERROR"]' | head -50
# Look for common error pattern

# 2. Temporarily silence noisy alerts
# In Grafana: Alerts → Silences → New Silence
# Set duration to 1 hour while investigating

# 3. Fix root cause (e.g., if high CPU)
# Scale up resources, optimize queries, clear cache

# 4. Adjust alert thresholds if legitimate
# Edit alert rules in Prometheus config
# Increase threshold by 10-20% for stability

# 5. Remove silence once resolved
# In Grafana: Alerts → Silences → Delete
```

---

## 🧪 TESTING PROCEDURES

### Pre-Incident Testing

#### Monthly: Full System Test
```bash
# Run comprehensive health check
npm run scripts:system-health-check

# Test all critical paths
npm run scripts:test-critical-paths

# Expected: All tests passing ✅
```

#### Weekly: Chaos Engineering
```bash
# Test graceful degradation if Redis down
redis-cli SHUTDOWN SAVE

# Services should:
# ✅ Continue operating
# ✅ Display "cache unavailable" to users
# ✅ Performance degraded but functional

# Restart Redis
docker restart iamenu-redis

# Services should:
# ✅ Reconnect automatically
# ✅ Rebuild cache on first request
```

---

## 📞 ESCALATION PROCEDURES

### Severity Levels

| Severity | Response Time | Escalation |
|----------|---------------|----|
| 🔴 CRITICAL | < 5 min | On-call engineer → Engineering manager → CTO |
| 🟠 HIGH | < 30 min | On-call engineer → Engineering manager |
| 🟡 MEDIUM | < 2 hours | Engineering team lead |
| 🟢 LOW | < 8 hours | Regular sprint work |

### Critical Issue Response

```bash
# 1. Initial assessment (< 1 min)
curl https://api.iamenu.local/health

# 2. Determine impact
# - Payment processing down? (🔴 CRITICAL)
# - Search not working? (🟠 HIGH)
# - Analytics delayed? (🟡 MEDIUM)

# 3. Escalate immediately
# Slack: @on-call-engineer "CRITICAL: Payments down, investigating"

# 4. Begin mitigation
# See "Emergency" sections above for specific services

# 5. Document incident
# Create incident log: incidents/2026-02-14-payment-outage.md
```

---

## 📊 PERFORMANCE BASELINES

**Target Metrics (After Wave 3 Deployment):**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time (P95) | < 200ms | > 500ms |
| Search Response Time | < 200ms | > 500ms |
| Cache Hit Rate | > 60% | < 40% |
| Error Rate | < 0.1% | > 1% |
| Log Processing Latency | < 10s | > 30s |
| Alert Firing (False Positive) | < 5% | > 10% |

**Establishment:**
1. Run system for 24h post-launch
2. Collect baseline metrics
3. Set alert thresholds ±20% of baseline
4. Update this document with actual baselines

---

## 📝 LOGGING & DOCUMENTATION

### Incident Log Template
```markdown
# Incident: [YYYY-MM-DD] [Service] [Issue]

**Start Time:** HH:MM UTC
**Resolution Time:** HH:MM UTC
**Duration:** X minutes
**Impact:** [Describe impact]
**Root Cause:** [What went wrong]
**Fix Applied:** [How was it resolved]
**Prevention:** [How to prevent next time]
```

### Change Log Template
```bash
# When making operational changes:
# 1. Create branch: operational-change-date
# 2. Document change in OPERATIONAL_CHANGELOG.md
# 3. Commit and create PR
# 4. Require review before applying to production
```

---

## 🔗 USEFUL LINKS & REFERENCES

- **Grafana Dashboard:** https://grafana.iamenu.local/
- **Prometheus:** http://prometheus.local:9090/
- **AlertManager:** http://alertmanager.local:9093/
- **CloudWatch:** https://console.aws.amazon.com/cloudwatch/
- **Stripe Dashboard:** https://dashboard.stripe.com/
- **Redis Commander:** http://redis-commander.local:8081/ (for cache inspection)

---

**Last Updated:** 2026-02-14
**Next Review:** After Wave 3 deployment
**Maintainer:** DevOps Team
