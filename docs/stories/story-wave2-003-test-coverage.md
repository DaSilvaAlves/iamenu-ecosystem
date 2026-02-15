# Story 2.3: Add Missing Test Coverage

**ID:** STORY-002.3
**Type:** 🧪 Testing (High)
**Epic:** AIOS-DESBLOQUEIO-COMPLETO (Phase 2 - Wave 2)
**Priority:** HIGH
**Assigned to:** @qa
**Status:** 🟡 Ready for Development
**Created:** 2026-02-13
**Estimated Time:** 12 hours

---

## 📝 Story Description

Increase test coverage from current ~60% to 85%+ by adding unit tests for services, integration tests for API endpoints, and end-to-end tests for critical user flows.

**Current Symptom:**
- Test coverage: ~60%
- Missing tests for critical business logic
- No E2E tests for user flows
- RLS policy tests incomplete

**Root Cause:**
- Focus was on getting features working, not testing
- Time pressure in early sprints
- No test strategy defined

**Impact:**
- 🔴 High risk of regressions
- Hard to refactor safely
- Quality gate failures

---

## ✅ Acceptance Criteria

- [ ] Test coverage increased to 85%+
- [ ] All service layer methods tested
- [ ] All API endpoints have integration tests
- [ ] Critical user flows E2E tested
- [ ] RLS policies fully tested
- [ ] Error scenarios covered
- [ ] Coverage report generated
- [ ] All tests passing

---

## 🔧 Technical Details

**Test Strategy:**
1. **Unit Tests** (30% of tests)
   - Service methods
   - Utility functions
   - Data transformers

2. **Integration Tests** (50% of tests)
   - API endpoints with real DB
   - Database constraints
   - Error handling

3. **E2E Tests** (20% of tests)
   - User creation → post creation → comment
   - Login → view community → follow user
   - Create supplier → list products

**Test Structure:**
```
services/community/tests/
├── unit/
│  ├── services/posts.service.test.ts
│  ├── services/groups.service.test.ts
│  └── ...
├── integration/
│  ├── posts.integration.test.ts
│  ├── groups.integration.test.ts
│  └── rls.integration.test.ts
└── e2e/
   ├── user-flow.e2e.test.ts
   └── community-flow.e2e.test.ts
```

---

## 📊 Timeline & Estimation

**Estimated Time:** 12 hours
**Complexity:** Medium-High
**Dependencies:** STORY-001 (completed ✅)

---

## 🎯 Acceptance Gate

**Definition of Done:**
1. ✅ Coverage > 85%
2. ✅ All critical paths tested
3. ✅ All tests passing
4. ✅ Coverage report public

---

## 📋 File List

- [ ] `services/community/tests/unit/` - Unit tests
- [ ] `services/community/tests/integration/` - Integration tests
- [ ] `services/community/tests/e2e/` - E2E tests
- [ ] `coverage/` - Coverage report

---

## 🔄 Dev Agent Record

**Dev Agent:** @qa
**Start Time:** [To be filled]
**Status Updates:** [To be filled]

---

**Created by:** Orion (AIOS Master) 👑

