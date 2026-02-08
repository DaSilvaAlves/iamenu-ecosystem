# Sprint 1 Plan - Technical Debt Resolution
**iaMenu Ecosystem - Foundation Phase**

**Sprint:** 1 of 3
**Duration:** 2 weeks (Weeks 1-2)
**Team:** 4-5 developers
**Goal:** Resolve critical security & performance gaps (Foundation for Architecture Phase)
**Budget:** R$ 7.2k - 9.3k
**Hours:** 48-62h total

---

## 🎯 Sprint Goal

**Eliminate critical security gaps and establish performance baseline for Phase 2 architecture work.**

**Success Criteria:**
- [ ] RLS policies 100% coverage (zero security gaps)
- [ ] Critical database indexes implemented
- [ ] N+1 query patterns fixed on 3+ high-volume endpoints
- [ ] All code reviews passed (CodeRabbit clean)
- [ ] Zero production incidents post-deployment
- [ ] Performance baseline: API response time <200ms

---

## 📊 Sprint Breakdown

| Story | Hours | Priority | Owner | Status |
|-------|-------|----------|-------|--------|
| **1.1: RLS Policies** | 18-22h | 🔴 CRITICAL | @data-engineer | 📋 PLANNING |
| **1.2: Database Indexes** | 4-6h | 🔴 HIGH | @data-engineer | 📋 PLANNING |
| **1.3: N+1 Query Fixes** | 6-8h | 🔴 HIGH | @dev | 📋 PLANNING |
| **QA & Testing** | 12-15h | 🟡 MEDIUM | @qa | 📋 PLANNING |
| **Code Review & Deploy** | 8-10h | 🟡 MEDIUM | @architect | 📋 PLANNING |

**Total:** 48-61h

---

## 📖 Story 1.1: Implement RLS Policies (All Tables)

**Story ID:** TECH-DEBT-001.1
**Type:** Infrastructure / Security
**Points:** 21 (3 days estimated)
**Priority:** 🔴 CRITICAL
**Owner:** @data-engineer (Dara)
**Status:** 📋 PLANNING

### 📝 Description

Implement Row-Level Security (RLS) policies across all tables in the iaMenu Ecosystem database to prevent unauthorized data access. Currently, any authenticated user can potentially see all posts, comments, quotes, and other sensitive data. This is a critical security vulnerability.

**Why Critical:**
- 2 RLS gaps identified in discovery (posts, comments, quotes)
- Blocks Phase 2 (architecture changes)
- Security blocker for production stability

### ✅ Acceptance Criteria

- [ ] RLS policy implemented on `community.posts` table
  - Users see only their own posts + public community posts
  - Test case: User A cannot see User B's private posts

- [ ] RLS policy implemented on `community.comments` table
  - Users see only comments on posts they have access to
  - Test case: User A cannot see comments on User B's private posts

- [ ] RLS policy implemented on `marketplace.quotes` table
  - Suppliers see only their own quotes
  - Buyers see quotes from suppliers they requested from
  - Test case: Supplier A cannot see Supplier B's quotes

- [ ] RLS policy implemented on `marketplace.suppliers` table
  - Suppliers see full profile + settings
  - Other users see public profile only

- [ ] RLS policy implemented on `academy.enrollments` table
  - Students see only their own enrollments
  - Instructors see student enrollments in their courses
  - Test case: Student A cannot see Student B's enrollments

- [ ] All policies tested with positive + negative test cases
- [ ] CodeRabbit security scan: PASS (no CRITICAL/HIGH issues)
- [ ] Performance impact: <5% regression on queries
- [ ] Deployed to staging environment with 24h monitoring

### 📋 Tasks

#### Task 1.1.1: Audit & Design (2h)
- [ ] Review all tables in all schemas (community, marketplace, academy, business)
- [ ] Create RLS matrix (table → who should see what)
- [ ] Document policy logic for each table
- [ ] Review with @architect for alignment

**Deliverable:** `docs/security/rls-design-matrix.md`

#### Task 1.1.2: Implement RLS Policies (8h)
- [ ] Write SQL for `community.posts` RLS policy
- [ ] Write SQL for `community.comments` RLS policy
- [ ] Write SQL for `marketplace.quotes` RLS policy
- [ ] Write SQL for `marketplace.suppliers` RLS policy
- [ ] Write SQL for `academy.enrollments` RLS policy
- [ ] Test locally on development database
- [ ] Review SQL with @architect for security

**Deliverable:** Migration files in `supabase/migrations/`

#### Task 1.1.3: Testing & Validation (6h)
- [ ] Unit tests: Positive cases (user sees own data)
- [ ] Unit tests: Negative cases (user cannot see other's data)
- [ ] Load testing with RLS enabled
- [ ] Manual testing in staging environment
- [ ] Verify with @qa that test coverage >80%

**Deliverable:** Test files + test report

#### Task 1.1.4: Review & Deploy (4h)
- [ ] Run CodeRabbit security scan (automated)
- [ ] Code review with @architect + @qa
- [ ] Address any issues found
- [ ] Deploy to staging
- [ ] Monitor for 24h (error rate, performance)
- [ ] Deploy to production

**Deliverable:** Deployment checklist + post-deployment report

### 🔬 Testing Strategy

**Unit Tests:**
```javascript
// Positive case
test('User can see their own posts', () => {
  // Verify user_id = auth.uid() filter works
  // Assert user sees only own posts
})

// Negative case
test('User cannot see other users posts', () => {
  // Verify different user_id is filtered out
  // Assert user gets zero results for other's posts
})
```

**Load Test:**
- 1000 concurrent users
- Verify RLS doesn't cause >5% response time regression
- Monitor CPU/memory impact

**Manual Testing:**
- Login as different users
- Verify data isolation at application layer
- Check admin/super-admin access patterns

### 📊 QA Gate

**Before Merge:**
- [ ] All tests passing (>80% coverage)
- [ ] CodeRabbit: Zero CRITICAL/HIGH security issues
- [ ] Performance: <5% regression
- [ ] Documentation: Updated in security guide
- [ ] @qa sign-off

**Before Production Deployment:**
- [ ] 24h staging monitoring passed
- [ ] No error rate spike
- [ ] Performance stable
- [ ] @data-engineer + @architect approval

### 🚀 Deployment Plan

**Staging (Day 3-4):**
1. Create snapshot of production database (backup)
2. Apply migration to staging
3. Run full test suite
4. Manual testing by team
5. Monitor for 24h

**Production (Day 5-6):**
1. Maintenance window: 2am-4am (low traffic)
2. Create snapshot of production database
3. Apply migration
4. Run smoke tests
5. Monitor closely for 24h
6. Rollback ready if issues

**Rollback Plan:**
- If error rate > 2%: immediate rollback
- If query timeout > 1s: immediate rollback
- If data access issues detected: immediate rollback
- Rollback script ready in `supabase/rollback/`

### 📞 Communication

- **Daily standup:** 10am (sync progress)
- **Mid-sprint review:** Day 3 (check on track)
- **Pre-deployment:** Team alignment on production timing
- **Post-deployment:** 24h monitoring briefing

---

## 📖 Story 1.2: Create Database Indexes (High-Volume Tables)

**Story ID:** TECH-DEBT-001.2
**Type:** Performance
**Points:** 5 (1 day estimated)
**Priority:** 🔴 HIGH
**Owner:** @data-engineer (Dara)
**Status:** 📋 PLANNING

### 📝 Description

Create database indexes on frequently queried columns to improve query performance. Currently, several high-volume queries are doing full table scans, causing latency.

**Why High Priority:**
- Quick win (+30% query performance)
- Independent from RLS policies
- High ROI (easy to implement, big impact)

### ✅ Acceptance Criteria

- [ ] Index created on `posts.created_at` (sorting queries)
- [ ] Index created on `comments.post_id` (foreign key lookup)
- [ ] Index created on `quotes.status` (filtering by status)
- [ ] Index created on `orders.user_id` (user history queries)
- [ ] Index created on `orders.created_at` (recent orders)
- [ ] All indexes verified in production
- [ ] Performance improvement measured: >30% on indexed queries
- [ ] CodeRabbit review: PASS (no issues)

### 📋 Tasks

#### Task 1.2.1: Analyze Query Patterns (1h)
- [ ] Review slow query log (last 7 days)
- [ ] Identify most expensive queries
- [ ] Create index priority list
- [ ] Verify columns are good index candidates

**Deliverable:** Query analysis report

#### Task 1.2.2: Create Indexes (2h)
- [ ] Write migration for all 5 indexes
- [ ] Test locally
- [ ] Verify index helps queries
- [ ] Check for index bloat

**Deliverable:** Migration file

#### Task 1.2.3: Testing & Validation (1h)
- [ ] Verify indexes are being used (EXPLAIN plans)
- [ ] Load testing with indexes
- [ ] Measure performance improvement
- [ ] No regression on write performance

**Deliverable:** Performance benchmark report

#### Task 1.2.4: Deploy & Monitor (1h)
- [ ] Deploy to staging
- [ ] Verify no issues
- [ ] Deploy to production
- [ ] Monitor for 24h

**Deliverable:** Deployment report

### 🎯 Success Metrics

- **Query performance:** >30% improvement on indexed columns
- **No regressions:** Write performance unchanged
- **Error rate:** <0.1%
- **Index size:** <100MB total

---

## 📖 Story 1.3: Fix N+1 Query Patterns (Critical Endpoints)

**Story ID:** TECH-DEBT-001.3
**Type:** Performance
**Points:** 7 (1 day estimated)
**Priority:** 🔴 HIGH
**Owner:** @dev (implementation)
**Reviewers:** @data-engineer (query optimization), @architect (architecture)
**Status:** 📋 PLANNING

### 📝 Description

Refactor endpoints that make N+1 queries (one query per result) into single efficient queries using Prisma `.include()` or `.select()` patterns.

**Identified Issues:**
- `GET /community/posts` - 1 post query + N queries for author + N queries for reactions
- `GET /marketplace/suppliers/:id` - 1 supplier query + N queries for products
- `GET /academy/courses/:id/modules` - 1 course query + N queries for modules + N*M queries for lessons

### ✅ Acceptance Criteria

- [ ] `GET /community/posts` refactored
  - Single query with `.include({ author: true, reactions: true })`
  - Response time <100ms (was ~250ms)

- [ ] `GET /marketplace/suppliers/:id` refactored
  - Single query with `.include({ products: true })`
  - Response time <100ms

- [ ] `GET /academy/courses/:id/modules` refactored
  - Single query with nested includes
  - Response time <150ms

- [ ] All endpoints tested with load testing
- [ ] No regression on other endpoints
- [ ] Code reviewed by @architect
- [ ] CodeRabbit: PASS

### 📋 Tasks

#### Task 1.3.1: Identify & Analyze (1h)
- [ ] Profile endpoints with debugging tools
- [ ] Measure current response times
- [ ] Create query plan for fixes
- [ ] Review with @data-engineer

**Deliverable:** Query optimization plan

#### Task 1.3.2: Refactor Queries (3h)
- [ ] Update `GET /community/posts` controller
- [ ] Update `GET /marketplace/suppliers/:id` controller
- [ ] Update `GET /academy/courses/:id/modules` controller
- [ ] Test locally
- [ ] Verify queries are optimized

**Deliverable:** Refactored code

#### Task 1.3.3: Testing & Performance (2h)
- [ ] Unit tests for each endpoint
- [ ] Load testing (1000 concurrent requests)
- [ ] Measure response time improvement
- [ ] Verify accuracy of data
- [ ] No regression on other endpoints

**Deliverable:** Performance benchmark + test report

#### Task 1.3.4: Code Review & Deploy (1h)
- [ ] Review with @architect
- [ ] CodeRabbit scan
- [ ] Deploy to staging (24h test)
- [ ] Deploy to production

**Deliverable:** Code review + deployment report

### 🎯 Success Metrics

- **API response time:** <150ms (was 250-500ms)
- **Database queries:** 3 queries (was 50+)
- **Accuracy:** 100% data fidelity
- **Error rate:** <0.1%

---

## 🧪 Testing Across All Stories

### Unit Tests (12h)
- RLS policy tests (8h) - positive/negative cases
- Query optimization tests (4h) - accuracy + performance

### Integration Tests (4h)
- End-to-end flows with RLS enabled
- Cross-endpoint data consistency
- Auth + RLS interaction

### Performance Tests (4h)
- Load testing (1000 concurrent users)
- Baseline benchmarking
- Regression detection

### Security Tests (4h)
- CodeRabbit automated scans
- Manual security review
- RLS bypass attempts

**Total Testing:** 24-28h (included in story hours)

---

## 📅 Sprint Schedule

### Week 1
- **Day 1-2:** Task 1.1.1 (RLS Design) + Task 1.2.1 (Index Analysis)
- **Day 3-4:** Task 1.1.2 (RLS Implementation) + Task 1.2.2 (Index Creation)
- **Day 5:** Task 1.3.1-1.3.2 (N+1 Query Fixes) + Testing prep

### Week 2
- **Day 6-7:** Task 1.1.3 (RLS Testing) + Task 1.3.3 (Performance Testing)
- **Day 8-9:** Task 1.1.4 (Deploy RLS) + Task 1.2.3-1.2.4 (Deploy Indexes)
- **Day 10:** Task 1.3.4 (Deploy Queries) + Wrap-up + Sprint Review

---

## 🎯 Team Allocation

| Role | Hours | Tasks |
|------|-------|-------|
| **@data-engineer (Dara)** | 22-24h | Stories 1.1 + 1.2, Query review |
| **@dev (James)** | 15-18h | Story 1.3, Testing support |
| **@qa (Quinn)** | 12-14h | Testing, CodeRabbit review, QA gates |
| **@architect (Aria)** | 6-8h | Code review, guidance |
| **DevOps/Deploy** | 4-6h | Staging/prod deployment |

---

## 🚀 Definition of Done

All stories must meet:
- [ ] Code reviewed and approved by @architect
- [ ] Tests passing (>80% coverage)
- [ ] CodeRabbit scan: PASS (no CRITICAL/HIGH)
- [ ] Performance benchmarked (before/after)
- [ ] Documentation updated
- [ ] Staged tested for 24h
- [ ] Production deployed successfully
- [ ] Monitored for 24h with no incidents

---

## 🔄 Dependent Phases

**This Sprint (Phase 1) must complete before:**
- Phase 2: TypeScript + Design System migration
- Phase 3: Full test coverage + component library

**Blocker:** If any critical story fails, pause Phase 2 until resolved.

---

## 📊 Success Metrics

**By End of Sprint 1:**
- ✅ RLS coverage: 0% → 100%
- ✅ Query performance: +30% improvement
- ✅ API response time: 250ms → <150ms
- ✅ Security vulnerabilities: 2 → 0
- ✅ Code quality: CodeRabbit green
- ✅ Zero production incidents

---

## 📞 Communication Plan

### Daily
- 10am: 15-min standup (blockers, progress)
- Slack: async updates in #tech-debt-resolution

### Weekly
- Monday 9am: Sprint planning + kickoff
- Friday 4pm: Sprint review + retrospective

### Pre-Deployment
- Thursday: Staging validation meeting
- Saturday 1am: Production deployment window (if approved)

---

## 📎 Dependencies & Risks

### Dependencies
- RLS policies don't depend on anything
- Indexes don't depend on RLS
- N+1 fixes don't depend on indexes
- **All 3 can be done in parallel**

### Risks
- **RLS policy bugs:** High impact, medium probability
  - Mitigation: Extensive testing + staged rollout

- **Index performance:** Low probability
  - Mitigation: Load testing before production

- **Query refactoring regressions:** Medium probability
  - Mitigation: Comprehensive testing + rollback ready

---

**Sprint 1 Ready to Kick Off!**

Próximo passo: Team kickoff meeting & task assignment

---

**Created by:** Morgan (PM)
**Date:** 2026-02-08
**Status:** 📋 READY FOR KICKOFF
