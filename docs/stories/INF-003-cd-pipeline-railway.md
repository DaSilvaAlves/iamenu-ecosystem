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

- [ ] **AC1:** CD workflow created (`.github/workflows/cd.yml`)
- [ ] **AC2:** Deploy only triggers after CI passes
- [ ] **AC3:** Railway webhook or CLI integration working
- [ ] **AC4:** Rollback procedure documented
- [ ] **AC5:** Deploy notifications (optional: Slack/Discord)

---

## Tasks

- [ ] **Task 1:** Create `.github/workflows/cd.yml`
- [ ] **Task 2:** Configure Railway deploy hooks or CLI
- [ ] **Task 3:** Add deploy secrets to GitHub (RAILWAY_TOKEN)
- [ ] **Task 4:** Test deployment flow
- [ ] **Task 5:** Document rollback procedure

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

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
