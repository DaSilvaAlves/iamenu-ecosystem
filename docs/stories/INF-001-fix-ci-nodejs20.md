# INF-001: Fix CI Pipeline for Node.js 20

**Priority:** P0 - BLOCKER
**Estimated Hours:** 1h
**Owner:** @devops
**Sprint:** Infrastructure P1
**Status:** Done

---

## Story Statement

**As a** development team pushing code to main,
**I want** the CI pipeline to use Node.js 20,
**So that** builds don't fail due to engine incompatibility with react-router and @google/genai.

---

## Problem Description

The CI workflow (`.github/workflows/ci.yml`) uses Node.js 18, but the frontend requires Node.js >= 20.0.0. This causes CI to fail when building the frontend.

### Current State

```yaml
env:
  NODE_VERSION: '18'  # ❌ Incompatible
```

### Required State

```yaml
env:
  NODE_VERSION: '20'  # ✅ Compatible
```

---

## Acceptance Criteria

- [x] **AC1:** CI workflow uses Node.js 20
- [ ] **AC2:** All CI jobs pass (lint, test, build, security)
- [ ] **AC3:** Frontend build succeeds in CI
- [ ] **AC4:** No EBADENGINE warnings in CI logs

---

## Tasks

- [x] **Task 1:** Update `NODE_VERSION` in `.github/workflows/ci.yml` to '20'
- [x] **Task 2:** Push changes and verify CI passes
- [ ] **Task 3:** Verify all 4 jobs complete successfully

---

## Definition of Done

- [ ] CI workflow updated
- [ ] All CI jobs passing
- [ ] No engine compatibility warnings

---

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
