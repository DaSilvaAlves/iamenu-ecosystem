# INF-002: Expand Test Coverage to Academy & Business

**Priority:** P1 - HIGH
**Estimated Hours:** 4-6h
**Owner:** @qa
**Sprint:** Infrastructure P1
**Status:** Ready
**Depends On:** INF-001

---

## Story Statement

**As a** development team making changes to Academy and Business services,
**I want** test suites for these services,
**So that** we can safely make changes without breaking functionality.

---

## Problem Description

Current test coverage is incomplete:

| Service | Tests | Coverage |
|---------|-------|----------|
| Community | 5 files | ~40% |
| Marketplace | 4 files | ~30% |
| Academy | 0 files | 0% |
| Business | 0 files | 0% |

---

## Acceptance Criteria

- [ ] **AC1:** Academy service has health check tests
- [ ] **AC2:** Academy service has course CRUD tests
- [ ] **AC3:** Business service has health check tests
- [ ] **AC4:** Business service has restaurant CRUD tests
- [ ] **AC5:** All tests pass in CI
- [ ] **AC6:** Minimum 20% coverage per service

---

## Tasks

### Academy Tests
- [ ] **Task 1:** Create `services/academy/tests/health.test.ts`
- [ ] **Task 2:** Create `services/academy/tests/courses.test.ts`
- [ ] **Task 3:** Create `services/academy/tests/enrollments.test.ts`

### Business Tests
- [ ] **Task 4:** Create `services/business/tests/health.test.ts`
- [ ] **Task 5:** Create `services/business/tests/restaurants.test.ts`
- [ ] **Task 6:** Create `services/business/tests/products.test.ts`

---

## Definition of Done

- [ ] Academy tests created and passing
- [ ] Business tests created and passing
- [ ] CI runs all tests successfully
- [ ] Coverage reports generated

---

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
