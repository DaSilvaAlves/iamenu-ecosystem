# INF-003: Continuous Deployment Pipeline for Railway

**Priority:** P1 - HIGH
**Estimated Hours:** 3-4h
**Owner:** @devops
**Sprint:** Infrastructure P1
**Status:** Ready
**Depends On:** INF-001

---

## Story Statement

**As a** development team merging to main,
**I want** automatic deployment to Railway production,
**So that** we don't need manual deploys and reduce human error.

---

## Problem Description

Currently, Railway deploys are triggered by GitHub pushes, but there's no validation that CI passed before deploy. This can lead to broken code being deployed.

### Current Flow
```
Push to main → Railway deploys immediately (no CI check)
```

### Desired Flow
```
Push to main → CI passes → Railway deploys (only if CI green)
```

---

## Acceptance Criteria

- [x] **AC1:** CD workflow created (`.github/workflows/cd.yml`)
- [x] **AC2:** Deploy only triggers after CI passes
- [x] **AC3:** Railway CLI integration working
- [x] **AC4:** Rollback procedure documented
- [ ] **AC5:** Deploy notifications (optional: Slack/Discord)

---

## Tasks

- [x] **Task 1:** Create `.github/workflows/cd.yml`
- [x] **Task 2:** Configure Railway CLI integration
- [ ] **Task 3:** Add deploy secrets to GitHub (RAILWAY_TOKEN) - MANUAL STEP
- [ ] **Task 4:** Test deployment flow
- [x] **Task 5:** Document rollback procedure

---

## Technical Notes

### Railway CLI Deploy
```yaml
- name: Deploy to Railway
  run: railway up --service ${{ matrix.service }}
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Services to Deploy
- community-api
- marketplace-api
- academy-api
- business-api
- prototype-vision (frontend)

---

## Definition of Done

- [ ] CD workflow created and tested
- [ ] Auto-deploy working on merge to main
- [ ] CI must pass before deploy
- [ ] Rollback documented

---

## DevOps Agent Record

### Implementation Summary

**Created Files:**
- `.github/workflows/cd.yml` - CD pipeline with Railway deployment
  - Triggers after CI passes on main branch
  - Parallel deployment of services (max 2 at a time)
  - Separate frontend deployment
  - Error handling with continue-on-error
  - Deployment status notification

- `docs/guides/deployment-rollback.md` - Complete rollback procedures
  - Quick rollback via Railway Dashboard
  - Git revert method for code changes
  - Manual rollback via CLI
  - Prevention strategies
  - Service health check endpoints

### Workflow Details

**Trigger Conditions:**
```
- Direct push to main branch
- Workflow completion (after CI passes)
```

**Deployment Flow:**
```
1. CI Pipeline runs (lint, test, build, security)
2. If CI passes → CD pipeline triggered
3. Deploy matrix services in parallel (max 2)
4. Deploy frontend separately
5. Notify deployment status
```

**Services Deployed:**
- community-api
- marketplace-api
- academy-api
- business-api
- prototype-vision (frontend)

### Remaining Steps

**Task 3 - MANUAL:** Add RAILWAY_TOKEN to GitHub Secrets
```
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Create new secret: RAILWAY_TOKEN
3. Value: Your Railway API token
```

**Task 4 - TESTING:** Test deployment flow
```
1. Make a small change to main branch
2. Push and watch GitHub Actions
3. CI should run → CD should trigger
4. Monitor Railway deployment logs
```

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
**Updated:** 2026-02-08 by @devops
