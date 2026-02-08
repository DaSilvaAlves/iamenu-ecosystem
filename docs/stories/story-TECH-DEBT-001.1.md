# Story 1.1: Implement RLS Policies (All Tables)

**Story ID:** TECH-DEBT-001.1
**Epic:** TECH-DEBT-001 (Technical Debt Resolution)
**Type:** Infrastructure / Security
**Points:** 21 (3 days estimated)
**Priority:** 🔴 CRITICAL
**Status:** 📋 Ready for Dev
**Owner:** @dev
**Sprint:** Sprint 1 (Weeks 1-2)

---

## 📝 Story Description

Implement Row-Level Security (RLS) policies across all tables in the iaMenu Ecosystem database to prevent unauthorized data access. Currently, any authenticated user can potentially see all posts, comments, quotes, and other sensitive data. This is a critical security vulnerability that blocks Phase 2 work.

**Why Critical:**
- 2 RLS gaps identified in discovery (posts, comments, quotes)
- Blocks Phase 2 (architecture changes)
- Security blocker for production stability

---

## ✅ Acceptance Criteria

- [ ] RLS policy on `community.posts` - users see only own posts
- [ ] RLS policy on `community.comments` - users see only own comments
- [ ] RLS policy on `marketplace.quotes` - suppliers see only own quotes
- [ ] RLS policy on `marketplace.suppliers` - public/private access
- [ ] RLS policy on `academy.enrollments` - students see only own
- [ ] All policies tested (positive + negative cases)
- [ ] CodeRabbit security scan: PASS
- [ ] Performance impact: <5% regression
- [ ] Deployed to staging environment

---

## 📋 Tasks

### Task 1.1.1: Audit & Design RLS Policies
- [x] Review all tables in all schemas
- [x] Create RLS matrix (table → access patterns)
- [x] Document policy logic for each table
- [ ] Review with @architect for alignment

**Time Estimate:** 2h
**Subtasks:**
  - [x] Audit community schema tables
  - [x] Audit marketplace schema tables
  - [x] Audit academy schema tables
  - [x] Create `docs/security/rls-design-matrix.md`

**Completed:** 2026-02-08 (1.5h)

---

### Task 1.1.2: Implement RLS Policies
- [ ] Write SQL for community.posts policy
- [ ] Write SQL for community.comments policy
- [ ] Write SQL for marketplace.quotes policy
- [ ] Write SQL for marketplace.suppliers policy
- [ ] Write SQL for academy.enrollments policy
- [ ] Test locally on dev database
- [ ] Review SQL with @architect

**Time Estimate:** 8h
**Subtasks:**
  - [ ] Implement posts policy (2h)
  - [ ] Implement comments policy (1.5h)
  - [ ] Implement quotes policy (1.5h)
  - [ ] Implement suppliers policy (1.5h)
  - [ ] Implement enrollments policy (1.5h)

---

### Task 1.1.3: Testing & Validation
- [ ] Unit tests: positive cases (user sees own data)
- [ ] Unit tests: negative cases (user can't see others)
- [ ] Load testing with RLS enabled
- [ ] Manual testing in staging
- [ ] Verify >80% test coverage

**Time Estimate:** 6h
**Subtasks:**
  - [ ] Create unit tests (3h)
  - [ ] Load testing (2h)
  - [ ] Manual testing (1h)

---

### Task 1.1.4: Code Review & Deploy
- [ ] Run CodeRabbit security scan
- [ ] Code review with @architect + @qa
- [ ] Address any issues found
- [ ] Deploy to staging (24h monitoring)
- [ ] Monitor and verify success
- [ ] Deploy to production

**Time Estimate:** 4h
**Subtasks:**
  - [ ] CodeRabbit scan (1h)
  - [ ] Code review (1h)
  - [ ] Staging deployment (1h)
  - [ ] Production deployment (1h)

---

## 📊 QA Gate Requirements

**Before Merge:**
- [ ] All tests passing (>80% coverage)
- [ ] CodeRabbit: Zero CRITICAL/HIGH security issues
- [ ] Performance: <5% regression
- [ ] Documentation: Updated in security guide
- [ ] @qa sign-off

**Before Production:**
- [ ] 24h staging monitoring passed
- [ ] No error rate spike
- [ ] Performance stable
- [ ] @data-engineer + @architect approval

---

## 📚 Dev Notes

- Use Supabase RLS syntax
- Each policy should be granular (not broad WHERE clauses)
- Consider auth.uid() for user identification
- Handle supplier_id for marketplace tables
- Test edge cases (anonymous users, admin access)

---

## 🧪 Testing Strategy

### Unit Tests
```sql
-- Positive case: user sees own data
SELECT * FROM posts WHERE auth.uid() = user_id;

-- Negative case: user doesn't see others
SELECT * FROM posts WHERE user_id != auth.uid();
```

### Load Test
- 1000 concurrent users
- Verify no >5% response time regression
- Monitor CPU/memory impact

### Manual Testing
- Login as different users
- Verify data isolation at app layer
- Check admin/super-admin access

---

## 📁 File List

**Will be updated as development progresses:**
- [ ] supabase/migrations/[timestamp]_add_rls_policies.sql
- [x] docs/security/rls-design-matrix.md (Created)
- [ ] tests/rls-policies.test.ts
- [ ] docs/security/rls-guide.md

---

## 🔄 Dev Agent Record

### Checkboxes Completed
- [x] Task 1.1.1: Audit & Design
- [ ] Task 1.1.2: Implementation
- [ ] Task 1.1.3: Testing
- [ ] Task 1.1.4: Review & Deploy

### Debug Log
- **2026-02-08 14:30**: Task 1.1.1 completed - RLS matrix design document created
- **Findings**: 6 tables need RLS policies, 2 CRITICAL (posts, comments, quotes), 3 MEDIUM/HIGH (profiles, suppliers, enrollments)
- **Next**: Start Task 1.1.2 - SQL policy implementation

### Completion Notes
- Created comprehensive RLS design matrix with SQL policies for all 6 tables
- Identified access patterns for each table based on business logic
- Ready for @architect review before implementation

### Change Log
- **2026-02-08 14:30**: Task 1.1.1 completed - Design matrix created
- **2026-02-08**: Story created and ready for dev

---

## 🚀 Definition of Done

Story is complete when:
- [ ] All tasks marked [x]
- [ ] All tests passing (>80% coverage)
- [ ] CodeRabbit: PASS (no CRITICAL/HIGH)
- [ ] Performance: <5% regression verified
- [ ] Staging deployed & tested 24h
- [ ] Production deployed successfully
- [ ] File List complete
- [ ] Status: "Ready for Review"

---

**Ready to start: `*develop TECH-DEBT-001.1`**
