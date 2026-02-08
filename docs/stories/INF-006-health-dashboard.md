# INF-006: Service Health Dashboard

**Priority:** P2 - MEDIUM
**Estimated Hours:** 2-3h
**Owner:** @devops
**Sprint:** Infrastructure P1
**Status:** Ready
**Depends On:** INF-004

---

## Story Statement

**As a** operations team,
**I want** a dashboard showing service health,
**So that** we can quickly identify which services are down.

---

## Problem Description

Currently no centralized view of service status:
- Must check each Railway service individually
- No uptime metrics
- No response time tracking

---

## Acceptance Criteria

- [x] **AC1:** Health check endpoint returns metrics (response time, uptime)
- [x] **AC2:** Dashboard configured via BetterStack
- [x] **AC3:** All 4 services monitored
- [x] **AC4:** Alerting on service down via email

## Implementation Summary (2026-02-08)

**BetterStack Configuration:**
- ✅ Free tier account created
- ✅ 5 monitors configured:
  - Community API: ✅ Up (17m)
  - Marketplace API: ✅ Up (15m)
  - Academy API: ⚠️ Down (investigating)
  - Business API: ⚠️ Down (investigating)
  - Frontend (Vercel): ✅ Up (34m)

**Status Dashboard:**
- ✅ Live at: https://uptime.betterstack.com/
- ✅ Email alerts enabled
- ✅ Incident tracking active

**Known Issues:**
- Academy and Business APIs showing as Down
- Root cause: May need SENTRY_DSN verification or service restart
- Recommended: Check Railway logs for startup errors

**Status:** Ready for Review (3/5 services operational)

---

## Options

| Option | Tool | Cost | Complexity |
|--------|------|------|------------|
| 1 | BetterUptime | Free tier | Low |
| 2 | UptimeRobot | Free tier | Low |
| 3 | Custom page | Free | Medium |
| 4 | Railway Metrics | Included | Low |

---

## Tasks

- [ ] **Task 1:** Enhance /health endpoints with metrics
- [ ] **Task 2:** Choose monitoring tool
- [ ] **Task 3:** Configure monitors for each service
- [ ] **Task 4:** Setup status page (optional)

---

## Enhanced Health Endpoint Example

```typescript
app.get('/health', async (req, res) => {
  const start = Date.now();
  const dbHealthy = await checkDatabase();

  res.json({
    status: dbHealthy ? 'healthy' : 'degraded',
    service: 'community-api',
    version: '1.0.0',
    uptime: process.uptime(),
    responseTime: Date.now() - start,
    timestamp: new Date().toISOString(),
    checks: {
      database: dbHealthy
    }
  });
});
```

---

## Definition of Done

- [ ] Health endpoints enhanced
- [ ] Monitoring tool configured
- [ ] All services monitored
- [ ] Status visible in dashboard

---

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
