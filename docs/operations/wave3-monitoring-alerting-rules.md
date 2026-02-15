# Wave 3 Monitoring & Alerting Rules

## CloudWatch, Prometheus, Grafana, AlertManager Configuration

**Version:** 1.0
**Status:** Production Configuration
**Date:** 2026-02-14
**Target Metrics:** POST-WAVE 3 PRODUCTION

---

## 📊 PERFORMANCE BASELINES

### Established After Wave 3 Deployment (T+72h Post-Launch)

| Metric | Target | Alert Threshold | Critical Threshold |
|--------|--------|-----------------|-------------------|
| **API Response Time (P95)** | < 200ms | > 500ms | > 1000ms |
| **API Response Time (P99)** | < 500ms | > 1000ms | > 2000ms |
| **Search Response Time** | < 200ms | > 500ms | > 1000ms |
| **Cache Hit Rate** | > 60% | < 40% | < 20% |
| **Database Connection Pool** | < 80% utilization | > 80% | > 95% |
| **Error Rate (Overall)** | < 0.1% | > 0.5% | > 1% |
| **Payment Success Rate** | > 99.5% | < 99% | < 95% |
| **Notification Delivery Rate** | > 99% | < 98% | < 95% |
| **Log Processing Latency** | < 10s | > 30s | > 60s |
| **Redis Memory Usage** | < 60% of max | > 80% | > 95% |
| **Disk I/O (Read/Write)** | Stable | Spike > 2x baseline | Spike > 5x baseline |

---

## 🎯 ALERTING STRATEGY

### Alert Severity Levels

| Severity | Response Time | Action | Example |
|----------|---------------|--------|---------|
| **🔴 CRITICAL** | < 5 min | Page on-call engineer immediately | Payment processing down, all services red |
| **🟠 HIGH** | < 30 min | Alert engineering team | API response time > 1s, error rate > 1% |
| **🟡 MEDIUM** | < 2 hours | Notify team lead | Cache hit rate < 40%, slow search queries |
| **🟢 LOW** | < 8 hours | Ticket in backlog | Non-critical warnings, info-only alerts |

### Alert Routing

```yaml
# AlertManager routing (alertmanager.yml)
global:
  resolve_timeout: 5m

route:
  receiver: 'default'
  group_by: ['alertname', 'cluster']

  routes:
    # Critical alerts → Page on-call via PagerDuty + Slack
    - match:
        severity: critical
      receiver: 'critical-alert'
      continue: true
      group_wait: 0s          # Send immediately
      group_interval: 5m
      repeat_interval: 5m

    # High severity → Slack #alerts channel
    - match:
        severity: high
      receiver: 'high-alert'
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 1h

    # Medium severity → #ops channel
    - match:
        severity: medium
      receiver: 'medium-alert'
      group_wait: 5m
      group_interval: 30m
      repeat_interval: 4h

receivers:
  - name: 'default'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#monitoring'

  - name: 'critical-alert'
    pagerduty_configs:
      - service_key: 'PAGERDUTY_SERVICE_KEY'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#critical-alerts'
        title: '🚨 CRITICAL ALERT'

  - name: 'high-alert'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#alerts'

  - name: 'medium-alert'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#ops'
```

---

## 📈 PROMETHEUS ALERT RULES

### API Performance Alerts

```yaml
# prometheus-rules.yml

groups:
  - name: api_performance
    interval: 30s
    rules:
      # API Response Time High (P95)
      - alert: APIResponseTimeMedium
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: high
          service: api
        annotations:
          summary: "API response time high ({{ $value | humanizeDuration }})"
          description: "API P95 response time exceeded 500ms on {{ $labels.instance }}"

      - alert: APIResponseTimeCritical
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1.0
        for: 2m
        labels:
          severity: critical
          service: api
        annotations:
          summary: "API response time critical ({{ $value | humanizeDuration }})"
          description: "API P95 response time exceeded 1000ms - immediate action required"

      # Error Rate
      - alert: ErrorRateHigh
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.005
        for: 5m
        labels:
          severity: high
          service: api
        annotations:
          summary: "High error rate ({{ $value | humanizePercentage }})"
          description: "Error rate exceeded 0.5% on {{ $labels.instance }}"

      - alert: ErrorRateCritical
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
          service: api
        annotations:
          summary: "Critical error rate ({{ $value | humanizePercentage }})"
          description: "Error rate exceeded 1% - potential outage"

  - name: cache_performance
    interval: 30s
    rules:
      # Cache Hit Rate Low
      - alert: CacheHitRateLow
        expr: rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m])) < 0.4
        for: 10m
        labels:
          severity: medium
          service: cache
        annotations:
          summary: "Cache hit rate low ({{ $value | humanizePercentage }})"
          description: "Cache hit rate dropped below 40% - consider cache strategy adjustment"

      # Redis Memory High
      - alert: RedisMemoryHigh
        expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.8
        for: 5m
        labels:
          severity: high
          service: cache
        annotations:
          summary: "Redis memory usage high ({{ $value | humanizePercentage }})"
          description: "Redis memory usage exceeded 80% - evictions may occur"

      - alert: RedisMemoryCritical
        expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.95
        for: 2m
        labels:
          severity: critical
          service: cache
        annotations:
          summary: "Redis memory critical ({{ $value | humanizePercentage }})"
          description: "Redis memory usage exceeded 95% - immediate action required"

      # Redis Connection Pool
      - alert: RedisConnectionPoolExhausted
        expr: redis_connected_clients >= redis_max_clients
        for: 1m
        labels:
          severity: critical
          service: cache
        annotations:
          summary: "Redis connection pool exhausted"
          description: "Redis has reached max connection limit - requests will fail"

  - name: database
    interval: 30s
    rules:
      # Database Connection Pool
      - alert: DatabaseConnectionPoolHigh
        expr: pg_stat_activity_count{state="active"} / pg_settings_max_connections > 0.8
        for: 5m
        labels:
          severity: high
          service: database
        annotations:
          summary: "Database connection pool high ({{ $value | humanizePercentage }})"
          description: "Active database connections exceeded 80% of max"

      - alert: DatabaseConnectionPoolCritical
        expr: pg_stat_activity_count{state="active"} / pg_settings_max_connections > 0.95
        for: 2m
        labels:
          severity: critical
          service: database
        annotations:
          summary: "Database connection pool critical ({{ $value | humanizePercentage }})"
          description: "Active connections at 95%+ - new connections will be rejected"

      # Query Performance
      - alert: SlowQueryDetected
        expr: rate(pg_stat_statements_calls[5m]) > 0 and rate(pg_stat_statements_total_time[5m]) / rate(pg_stat_statements_calls[5m]) > 1.0
        for: 10m
        labels:
          severity: medium
          service: database
        annotations:
          summary: "Slow query detected ({{ $value | humanizeDuration }})"
          description: "Query average execution time exceeded 1 second"

      # Disk Space
      - alert: DiskSpaceRunningOut
        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.2
        for: 10m
        labels:
          severity: high
          service: database
        annotations:
          summary: "Disk space low ({{ $value | humanizePercentage }} free)"
          description: "Disk space is below 20% - may affect database operations"

  - name: payments
    interval: 1m
    rules:
      # Payment Processing Failure Rate
      - alert: PaymentFailureRateHigh
        expr: rate(payments_failed_total[5m]) / rate(payments_total[5m]) > 0.005
        for: 5m
        labels:
          severity: high
          service: payments
        annotations:
          summary: "Payment failure rate high ({{ $value | humanizePercentage }})"
          description: "Payment failure rate exceeded 0.5% - check Stripe connectivity"

      - alert: PaymentFailureRateCritical
        expr: rate(payments_failed_total[5m]) / rate(payments_total[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
          service: payments
        annotations:
          summary: "Payment processing critical ({{ $value | humanizePercentage }} failing)"
          description: "Payment failure rate exceeded 5% - potential Stripe outage"

      # Webhook Delivery Failure
      - alert: PaymentWebhookFailure
        expr: rate(stripe_webhook_failures_total[5m]) > 0.1
        for: 5m
        labels:
          severity: high
          service: payments
        annotations:
          summary: "Payment webhook failures"
          description: "Stripe webhook delivery is failing - transactions may not be recorded"

  - name: notifications
    interval: 1m
    rules:
      # Notification Delivery Failure
      - alert: NotificationDeliveryLow
        expr: rate(notifications_delivered_total[5m]) / rate(notifications_sent_total[5m]) < 0.98
        for: 5m
        labels:
          severity: medium
          service: notifications
        annotations:
          summary: "Notification delivery rate low ({{ $value | humanizePercentage }})"
          description: "Notification delivery rate dropped below 98%"

      - alert: NotificationDeliveryFailure
        expr: rate(notifications_delivered_total[5m]) / rate(notifications_sent_total[5m]) < 0.95
        for: 2m
        labels:
          severity: high
          service: notifications
        annotations:
          summary: "Notification delivery failure ({{ $value | humanizePercentage }})"
          description: "Notification delivery rate below 95% - email service may be down"

  - name: logging
    interval: 1m
    rules:
      # CloudWatch Ingestion Latency
      - alert: LogIngestionLatencyHigh
        expr: cloudwatch_log_ingestion_latency_seconds > 30
        for: 5m
        labels:
          severity: medium
          service: logging
        annotations:
          summary: "Log ingestion latency high ({{ $value | humanizeDuration }})"
          description: "Logs taking over 30 seconds to appear in CloudWatch"

      # CloudWatch Processing Failure
      - alert: LogProcessingFailure
        expr: rate(cloudwatch_failed_requests_total[5m]) > 0.1
        for: 5m
        labels:
          severity: high
          service: logging
        annotations:
          summary: "Log processing failures detected"
          description: "CloudWatch logging experiencing failures - audit trail may have gaps"

  - name: search
    interval: 1m
    rules:
      # Search Response Time
      - alert: SearchResponseTimeHigh
        expr: histogram_quantile(0.95, rate(search_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: high
          service: search
        annotations:
          summary: "Search response time high ({{ $value | humanizeDuration }})"
          description: "Full-text search P95 response time exceeded 500ms"

      # Search Index Health
      - alert: SearchIndexStale
        expr: (time() - search_index_last_update_timestamp) / 60 > 60
        for: 5m
        labels:
          severity: medium
          service: search
        annotations:
          summary: "Search index not updated for {{ $value | humanizeDuration }}"
          description: "Search index may be stale - rebuild may be needed"
```

---

## 📊 GRAFANA DASHBOARDS

### Main Monitoring Dashboard

```yaml
# Dashboard: iaMenu Platform Overview
# Refresh: 10 seconds
# Time range: Last 1 hour

Panels:
  1. Status Indicator
     - Green: All systems healthy
     - Yellow: Warning (1+ medium alerts)
     - Red: Critical (1+ critical alerts)

  2. API Performance (Line Chart)
     - P50, P95, P99 response times
     - Target: P95 < 200ms

  3. Error Rate (Line Chart)
     - % of 5xx errors over time
     - Target: < 0.1%

  4. Cache Hit Rate (Gauge)
     - % of cache hits vs misses
     - Target: > 60%
     - Red zone: < 40%

  5. Database Connections (Gauge)
     - Active connections / Max connections
     - Target: < 80%
     - Red zone: > 95%

  6. Payment Success Rate (Gauge)
     - % successful transactions
     - Target: > 99.5%

  7. Notification Delivery (Gauge)
     - % notifications delivered
     - Target: > 99%

  8. System Health (Table)
     - Component | Status | Last Alert
     - API | 🟢 Healthy | N/A
     - Cache | 🟢 Healthy | N/A
     - Database | 🟢 Healthy | N/A
     - Payments | 🟢 Healthy | N/A
```

### Per-Service Dashboards

**Community Service Dashboard**
- API response times by endpoint
- Error rate by endpoint
- Cache hit rate for posts/profiles
- Real-time notifications delivered
- User activity (posts/comments/follows)

**Marketplace Service Dashboard**
- Search response times
- Search queries per second
- Product cache hit rate
- Quote request processing time
- Supplier product updates

**Business Service Dashboard**
- Analytics calculation time
- DAU/MAU trends
- Revenue aggregation
- Order processing time
- Report generation

**Academy Service Dashboard**
- Course enrollment rate
- Lesson completion rate
- Certificate generation time
- Course search performance
- Student engagement

---

## 🔔 SLACK NOTIFICATIONS

### Alert Message Template

```
🚨 CRITICAL ALERT

Service: {{ service }}
Severity: CRITICAL 🔴
Alert: {{ alert_name }}
Time: {{ timestamp }}

Description:
{{ description }}

Value: {{ value }}
Threshold: {{ threshold }}

Affected Instance: {{ instance }}
Duration: {{ duration }}

Action Required:
1. Open Grafana: https://grafana.iamenu.local/
2. Check logs: https://console.aws.amazon.com/cloudwatch/
3. Run diagnostics in runbook: docs/operations/wave3-operations-runbook.md
4. Escalate if needed: @on-call-engineer

---
[View Alert Details](https://prometheus.local:9090/graph)
```

### Escalation Chain

```
Critical Alert Triggered (T+0)
├─ PagerDuty page sent to on-call engineer
├─ Slack #critical-alerts notification
├─ SMS alert (if PagerDuty configured)
│
├─ T+5 min: No acknowledgment
│  └─ Page team lead
│
├─ T+15 min: Still unresolved
│  └─ Page engineering manager
│
└─ T+30 min: Escalate to CTO
```

---

## 📋 OPERATIONAL RUNBOOKS BY ALERT

### When Alert Fires: "API Response Time Critical"

```bash
# Step 1: Verify alert (30 seconds)
curl https://api.iamenu.local/health
# Expected: { "status": "ok", "responseTime": "XXms" }

# Step 2: Check current load
curl http://prometheus:9090/api/prom/query?query=http_requests_total
# If > 2x normal load, implement rate limiting

# Step 3: Check database connections
SELECT count(*) FROM pg_stat_activity WHERE state != 'idle';
# If > 80% of max_connections, kill long-running queries

# Step 4: Check cache hit rate
redis-cli INFO stats | grep hits
# If < 40%, warm cache or increase Redis memory

# Step 5: Restart if needed
npm run dev:community  # Restart community service
npm run dev:marketplace  # Restart marketplace service

# Step 6: Monitor recovery
# Watch Grafana for 5 minutes
# If not recovered, escalate to engineering manager
```

### When Alert Fires: "Payment Failure Rate Critical"

```bash
# Step 1: Check Stripe status
# Visit https://status.stripe.com/ in browser
# If Stripe is down, notify customers of temporary issue

# Step 2: Check webhook health
curl https://api.iamenu.local/api/v1/payments/webhook/health
# Expected: { "status": "ok", "lastWebhook": "XXs ago" }

# Step 3: Verify database has payment records
SELECT count(*) FROM "marketplace"."Order"
WHERE "createdAt" > NOW() - INTERVAL '1 hour'
AND "paymentStatus" = 'pending';
# If high, payments aren't being processed

# Step 4: Check error logs
aws logs filter-log-events \
  --log-group-name iamenu-ecosystem-logs \
  --filter-pattern '[level = "ERROR", service = "payments"]' \
  --start-time $(($(date +%s) - 600))000

# Step 5: If Stripe is up, check webhook signatures
npm run scripts:validate-webhook-signatures

# Step 6: Manually retry failed payments
npm run scripts:retry-failed-payments --limit 100

# Step 7: If still failing, escalate to Security Architect
```

### When Alert Fires: "Redis Memory Critical"

```bash
# Step 1: Check current memory
redis-cli INFO memory
# Look for: used_memory_human and maxmemory

# Step 2: Check eviction rate
redis-cli INFO stats | grep evicted_keys
# If evicting keys, old data is being deleted

# Step 3: Clear old cache
redis-cli
> SELECT 0
> FLUSHDB
> QUIT

# Step 4: Increase Redis memory
# Edit docker-compose.yml
# command: redis-server --maxmemory 1024m --maxmemory-policy allkeys-lru
# docker-compose up -d redis

# Step 5: Warm cache back up
npm run scripts:warm-cache

# Step 6: Monitor memory usage
redis-cli INFO memory
# Should be < 60% after warmup
```

---

## 🎯 MAINTENANCE TASKS

### Daily (Automated)

```bash
# Runs at 02:00 UTC daily
0 2 * * * npm run scripts:backup-database
0 2 * * * npm run scripts:analyze-slow-queries
0 2 * * * npm run scripts:vacuum-database
0 2 * * * npm run scripts:check-disk-space
```

### Weekly (Manual Review)

Every Sunday 10:00 UTC:
1. Review alert history
2. Adjust alert thresholds if needed
3. Check for new slow queries
4. Review CloudWatch logs for patterns

### Monthly (Incident Review)

First Tuesday of month:
1. Analyze all critical alerts
2. Update runbooks with learnings
3. Review error budgets
4. Plan capacity upgrades if needed

---

## 📊 METRICS COLLECTION

### Application Metrics (Prometheus)

```typescript
// lib/metrics.ts
import promClient from 'prom-client';

// HTTP metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

// Custom business metrics
const paymentsTotal = new promClient.Counter({
  name: 'payments_total',
  help: 'Total payments processed',
  labelNames: ['status']
});

const notificationsDelivered = new promClient.Counter({
  name: 'notifications_delivered_total',
  help: 'Total notifications delivered',
  labelNames: ['type']
});

export function collectMetrics(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(duration);
  });

  next();
}

// Expose metrics at /metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-14
**Owner:** DevOps & Monitoring Team
**Next Review:** 48 hours post Wave 3 production launch
