# INF-004: Production Error Monitoring

**Priority:** P1 - HIGH
**Estimated Hours:** 3-4h
**Owner:** @devops
**Sprint:** Infrastructure P1
**Status:** Ready
**Depends On:** INF-001

---

## Story Statement

**As a** development team supporting production,
**I want** automatic error tracking and alerting,
**So that** we know about errors before users report them.

---

## Problem Description

Currently there's no visibility into production errors:
- No error aggregation
- No alerting
- No stack traces from production
- Users report bugs before we know about them

---

## Acceptance Criteria

- [ ] **AC1:** Error tracking service configured (Sentry recommended - free tier)
- [ ] **AC2:** All 4 backend services integrated
- [ ] **AC3:** Frontend (React) integrated
- [ ] **AC4:** Source maps uploaded for stack traces
- [ ] **AC5:** Alert notifications configured (email or Slack)
- [ ] **AC6:** Environment separation (dev vs prod)

---

## Tasks

### Setup
- [ ] **Task 1:** Create Sentry account and project
- [ ] **Task 2:** Add SENTRY_DSN to Railway environment variables

### Backend Integration
- [ ] **Task 3:** Install `@sentry/node` in each service
- [ ] **Task 4:** Configure Sentry in each service's index.ts
- [ ] **Task 5:** Add error boundary middleware

### Frontend Integration
- [ ] **Task 6:** Install `@sentry/react` in prototype-vision
- [ ] **Task 7:** Configure Sentry in main.jsx
- [ ] **Task 8:** Add ErrorBoundary component

### Alerts
- [ ] **Task 9:** Configure alert rules in Sentry dashboard
- [ ] **Task 10:** Test error reporting

---

## Technical Notes

### Backend Setup Example
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Frontend Setup Example
```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

---

## Definition of Done

- [ ] Sentry configured for all services
- [ ] Errors appearing in Sentry dashboard
- [ ] Alerts configured
- [ ] Source maps working

---

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
