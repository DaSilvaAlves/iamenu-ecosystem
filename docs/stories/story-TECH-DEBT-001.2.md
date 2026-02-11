# Story 1.2: Create Database Indexes (High-Volume Tables)

**Story ID:** TECH-DEBT-001.2
**Epic:** TECH-DEBT-001 (Technical Debt Resolution)
**Type:** Infrastructure / Performance
**Points:** 13 (2 days estimated)
**Priority:** 🟡 HIGH
**Owner:** @data-engineer
**Sprint:** Sprint 1 (Weeks 1-2)

---

## 📝 Story Description

Create database indexes on high-volume tables to improve query performance. Current queries on large tables (posts, comments, quotes, orders) suffer from full table scans, causing slow response times. Strategic indexing will reduce query time by 30%+ with minimal storage overhead.

**Why High Priority:**
- 4 critical tables identified for indexing
- Query performance bottleneck on API endpoints
- Enables Phase 2 architecture work
- Quick win with measurable impact

---

## ✅ Acceptance Criteria

- [ ] Index on `community.posts` (created_at) - for timeline queries
- [ ] Index on `community.comments` (post_id, created_at) - for comment fetching
- [ ] Index on `marketplace.quotes` (status, created_at) - for quote filtering
- [ ] Index on `business.orders` (user_id, created_at) - for order history
- [ ] Query performance improved by ≥30% on indexed columns
- [ ] No negative performance impact on writes (<5% regression)
- [ ] Database size impact documented (<2% growth)
- [ ] CodeRabbit performance review: PASS
- [ ] Performance benchmarks validated in staging

---

## 📋 Tasks

### Task 1.2.1: Analyze Current Performance
- [ ] Profile queries on high-volume endpoints
- [ ] Identify slow queries (response time >200ms)
- [ ] Document baseline metrics (query time, table scans)
- [ ] Create performance analysis report

**Time Estimate:** 1.5h
**Subtasks:**
  - [ ] Use EXPLAIN ANALYZE to profile queries (0.5h)
  - [ ] Document baseline metrics (0.5h)
  - [ ] Create performance baseline report (0.5h)

**Deliverable:** `docs/performance/indexing-baseline.md`

---

### Task 1.2.2: Design Indexing Strategy
- [ ] Determine optimal indexes for each table
- [ ] Evaluate composite vs single-column indexes
- [ ] Consider query patterns and WHERE clauses
- [ ] Document index strategy with rationale

**Time Estimate:** 1h
**Subtasks:**
  - [ ] Analyze query patterns (0.3h)
  - [ ] Design composite index strategy (0.4h)
  - [ ] Document rationale (0.3h)

**Deliverable:** `docs/database/indexing-strategy.md`

---

### Task 1.2.3: Implement Indexes
- [ ] Write migration for community.posts index (created_at)
- [ ] Write migration for community.comments index (post_id, created_at)
- [ ] Write migration for marketplace.quotes index (status, created_at)
- [ ] Write migration for business.orders index (user_id, created_at)
- [ ] Apply migrations to development database
- [ ] Verify index creation in dev

**Time Estimate:** 1h
**Subtasks:**
  - [ ] Create index migrations (0.5h)
  - [ ] Apply migrations to dev (0.3h)
  - [ ] Verify indexes created (0.2h)

**Deliverable:** Migration files in `services/*/prisma/migrations/`

---

### Task 1.2.4: Performance Validation
- [ ] Re-profile queries after indexing
- [ ] Measure query time improvement (target: 30%+)
- [ ] Test write performance (INSERT, UPDATE, DELETE)
- [ ] Verify no regression on unindexed columns
- [ ] Create performance comparison report

**Time Estimate:** 1h
**Subtasks:**
  - [ ] Re-profile with indexes (0.4h)
  - [ ] Validate 30% improvement (0.3h)
  - [ ] Create comparison report (0.3h)

**Deliverable:** `docs/performance/indexing-results.md`

---

### Task 1.2.5: Code Review & Deployment
- [ ] Run CodeRabbit performance analysis
- [ ] Code review with @architect
- [ ] Deploy to staging environment
- [ ] Monitor index usage in staging (24h)
- [ ] Deploy to production

**Time Estimate:** 0.5h
**Subtasks:**
  - [ ] CodeRabbit review (0.2h)
  - [ ] Code review (0.2h)
  - [ ] Deploy and monitor (0.1h)

**Deliverable:** Performance report + deployment checklist

---

## 📊 QA Gate Requirements

**Before Merge:**
- [ ] All indexes successfully created
- [ ] Query performance improved ≥30%
- [ ] Write performance regression <5%
- [ ] CodeRabbit: Zero performance issues
- [ ] @data-engineer + @architect sign-off

**Before Production:**
- [ ] 24h staging monitoring passed
- [ ] No index fragmentation issues
- [ ] Query plans using indexes confirmed
- [ ] Database size growth acceptable (<2%)
- [ ] @qa validation passed

---

## 🧪 Testing Strategy

### Performance Baseline
```sql
-- Before indexing
EXPLAIN ANALYZE
SELECT * FROM community.posts
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;
-- Expected: Sequential Scan, high cost
```

### Performance After Indexing
```sql
-- After indexing
EXPLAIN ANALYZE
SELECT * FROM community.posts
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;
-- Expected: Index Scan, 30%+ cost reduction
```

### Write Performance Test
```javascript
// Test INSERT performance with indexes present
const start = Date.now();
for (let i = 0; i < 1000; i++) {
  await db.posts.create({ /* data */ });
}
const duration = Date.now() - start;
// Verify <5% slowdown
```

### Index Fragmentation Check
```sql
-- Monitor index efficiency
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname IN ('community', 'marketplace', 'business');
```

---

## 📚 Dev Notes

### Index Selection Criteria
- **created_at indexes:** For sorting and range queries (timeline, recent items)
- **post_id, status indexes:** For filtering and joining operations
- **Composite indexes:** For queries filtering on multiple columns
- **Avoid over-indexing:** Each index costs storage and write performance

### PostgreSQL Best Practices
- Use BTREE indexes for equality and range comparisons (default)
- Use BRIN for large sequential tables (optional optimization)
- Monitor index bloat with `ANALYZE` regularly
- Drop unused indexes after 30 days of monitoring

### Monitoring
- Track index usage: `pg_stat_user_indexes`
- Monitor table size growth: `pg_total_relation_size()`
- Set up alerts for missing indexes (pgAdmin or DataGrip)

---

## 📁 File List

**Task 1.2.1 Deliverables:**
- [ ] docs/performance/indexing-baseline.md (TBD - created during task)

**Task 1.2.2 Deliverables:**
- [ ] docs/database/indexing-strategy.md (TBD - created during task)

**Task 1.2.3 Deliverables:**
- [ ] services/community/prisma/migrations/[date]_add_performance_indexes.sql
- [ ] services/marketplace/prisma/migrations/[date]_add_performance_indexes.sql
- [ ] services/business/prisma/migrations/[date]_add_performance_indexes.sql

**Task 1.2.4 Deliverables:**
- [ ] docs/performance/indexing-results.md (TBD - created during task)

**Task 1.2.5 Deliverables:**
- [ ] Performance report (console output)
- [ ] Deployment checklist (docs/deployment/indexing-deployment.md)

---

## 🔄 Dev Agent Record

### Checkboxes Completed
- [ ] Task 1.2.1: Performance Analysis (0/1)
- [ ] Task 1.2.2: Indexing Strategy (0/1)
- [ ] Task 1.2.3: Implementation (0/1)
- [ ] Task 1.2.4: Validation (0/1)
- [ ] Task 1.2.5: Review & Deploy (0/1)

### Debug Log
- **2026-02-11**: Story 1.2 created and ready for development

### Completion Notes
- TBD: Will be updated as tasks progress

---

## 🚀 Definition of Done

Story completion status:
- [ ] All tasks marked [x] - IN PROGRESS
- [ ] All tests passing (performance benchmarks met) - PENDING
- [ ] CodeRabbit: PASS (no HIGH issues) - PENDING
- [ ] Performance: 30%+ improvement verified - PENDING
- [ ] Staging deployed & tested 24h - PENDING
- [ ] Production deployed successfully - PENDING
- [ ] File List complete - IN PROGRESS
- [ ] Status: "Ready for Dev" - ✅ CURRENT

**Final Status:** 📋 **READY FOR DEV**
**Owner:** @data-engineer
**Next Step:** Activate @data-engineer with `*develop TECH-DEBT-001.2`

---

**Ready to start: `*develop TECH-DEBT-001.2`**
