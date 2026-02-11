# Story 1.3: Fix N+1 Query Patterns (Critical Endpoints)

**Story ID:** TECH-DEBT-001.3
**Epic:** TECH-DEBT-001 (Technical Debt Resolution)
**Type:** Application / Performance Optimization
**Points:** 21 (3 days estimated)
**Priority:** 🟡 HIGH
**Owner:** @dev
**Sprint:** Sprint 1 (Weeks 1-2)

---

## 📝 Story Description

Fix N+1 query patterns on critical API endpoints that cause excessive database round-trips. Currently, endpoints like "GET /community/posts" fetch posts, then loop through to fetch author details for each post (N+1 queries). This causes slow response times and excessive database load.

Strategic query optimization using Prisma's `include` and `select` will reduce database round-trips by 95%+, making endpoints responsive (<150ms target).

**Why High Priority:**
- 2+ critical endpoints identified with N+1 patterns
- Blocks Phase 2 (architecture changes)
- Quick wins with massive performance impact
- Complements Story 1.2 (database indexes)

---

## ✅ Acceptance Criteria

- [ ] N+1 patterns identified on 3+ critical endpoints
- [ ] Refactor GET /api/v1/community/posts (eliminate author N+1)
- [ ] Refactor GET /api/v1/community/posts/:id (eliminate comments N+1)
- [ ] Refactor GET /api/v1/marketplace/suppliers/:id (eliminate reviews N+1)
- [ ] Query optimization verified with profiling (<150ms target)
- [ ] No breaking changes to API responses
- [ ] Test coverage ≥80% for optimized endpoints
- [ ] CodeRabbit code quality: PASS (no HIGH issues)
- [ ] Performance benchmarks validated in staging

---

## 📋 Tasks

### Task 1.3.1: Identify N+1 Patterns
- [ ] Profile critical endpoints with Prisma query logs
- [ ] Identify N+1 bottlenecks (author lookups, comment counts, etc.)
- [ ] Document query patterns and their costs
- [ ] Estimate improvement potential for each endpoint

**Time Estimate:** 2h
**Subtasks:**
  - [ ] Enable Prisma query logging (0.5h)
  - [ ] Profile endpoints under load (0.75h)
  - [ ] Document N+1 patterns found (0.75h)

**Deliverable:** `docs/performance/n1-patterns-analysis.md`

---

### Task 1.3.2: Refactor Endpoint Queries
- [ ] Refactor GET /community/posts (add author includes)
- [ ] Refactor GET /community/posts/:id (eager load comments)
- [ ] Refactor GET /marketplace/suppliers/:id (eager load reviews)
- [ ] Test refactored queries locally
- [ ] Verify API responses unchanged

**Time Estimate:** 4h
**Subtasks:**
  - [ ] Analyze current queries (1h)
  - [ ] Refactor queries with includes (2h)
  - [ ] Test API responses (1h)

**Deliverable:** Code changes in `services/*/src/`

---

### Task 1.3.3: Testing & Validation
- [ ] Unit tests for optimized queries (positive cases)
- [ ] Integration tests for API endpoints
- [ ] Performance testing (verify <150ms)
- [ ] Regression testing (no breaking changes)
- [ ] Load testing (concurrent users)

**Time Estimate:** 3h
**Subtasks:**
  - [ ] Create unit tests (1.5h)
  - [ ] Integration tests (1h)
  - [ ] Performance validation (0.5h)

**Deliverable:** Test files and reports

---

### Task 1.3.4: Code Review & Deploy
- [ ] Run CodeRabbit on refactored code
- [ ] Code review with @architect
- [ ] Deploy to staging environment
- [ ] Monitor performance in staging (24h)
- [ ] Deploy to production

**Time Estimate:** 1h
**Subtasks:**
  - [ ] CodeRabbit review (0.2h)
  - [ ] Code review (0.4h)
  - [ ] Deploy and monitor (0.4h)

**Deliverable:** Code review report + deployment checklist

---

## 📊 QA Gate Requirements

**Before Merge:**
- [ ] All N+1 patterns fixed on target endpoints
- [ ] Query performance <150ms verified
- [ ] Test coverage ≥80%
- [ ] CodeRabbit: Zero HIGH/CRITICAL issues
- [ ] No breaking API changes
- [ ] @dev + @qa sign-off

**Before Production:**
- [ ] 24h staging monitoring passed
- [ ] No performance regressions
- [ ] Endpoint response times stable
- [ ] Error rates normal
- [ ] @architect approval

---

## 🧪 Testing Strategy

### N+1 Query Detection
```javascript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Profile endpoint
const posts = await prisma.post.findMany();
// Expected: 1 query for posts
// Bad: 1 query for posts + N queries for authors (N+1)
```

### Query Optimization Testing
```javascript
// Bad: N+1 pattern
const posts = await prisma.post.findMany();
const postsWithAuthors = posts.map(post => ({
  ...post,
  author: await prisma.profile.findUnique({
    where: { userId: post.authorId }
  })
}));
// Result: 1 + N queries

// Good: Eager loading
const posts = await prisma.post.findMany({
  include: { author: true }
});
// Result: 1 query with JOIN
```

### Performance Benchmark
```javascript
// Measure before/after
const start = Date.now();
const response = await api.get('/api/v1/community/posts');
const duration = Date.now() - start;
// Target: <150ms
```

---

## 📚 Dev Notes

### Common N+1 Patterns
1. **Loop with lookups:**
   ```javascript
   posts.forEach(post => {
     post.author = await db.profile.find(post.authorId);
   });
   ```

2. **Comments count:**
   ```javascript
   posts.map(post => ({
     ...post,
     commentCount: await db.comment.count({ postId: post.id })
   }));
   ```

3. **Aggregations:**
   ```javascript
   suppliers.map(s => ({
     ...s,
     reviewCount: await db.review.count({ supplierId: s.id })
   }));
   ```

### Prisma Solutions

**Option 1: Include (simplest)**
```javascript
await prisma.post.findMany({
  include: {
    author: true,
    comments: true
  }
});
```

**Option 2: Select (precise)**
```javascript
await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    author: {
      select: { userId: true, name: true }
    }
  }
});
```

**Option 3: Nested queries**
```javascript
await prisma.post.findMany({
  include: {
    author: {
      include: { followers: true }
    }
  }
});
```

---

## 📁 File List

**Task 1.3.1 Deliverables:**
- [ ] docs/performance/n1-patterns-analysis.md (TBD - created during task)

**Task 1.3.2 Deliverables:**
- [ ] services/community/src/services/post.service.ts (refactored)
- [ ] services/community/src/controllers/post.controller.ts (optimized)
- [ ] services/marketplace/src/services/supplier.service.ts (refactored)
- [ ] services/marketplace/src/controllers/supplier.controller.ts (optimized)

**Task 1.3.3 Deliverables:**
- [ ] services/*/tests/n1-queries.integration.test.ts
- [ ] Performance report (console output)

**Task 1.3.4 Deliverables:**
- [ ] Code review report (CodeRabbit + manual)
- [ ] Deployment checklist

---

## 🔄 Dev Agent Record

### Checkboxes Completed
- [ ] Task 1.3.1: N+1 Analysis (0/1)
- [ ] Task 1.3.2: Query Refactoring (0/1)
- [ ] Task 1.3.3: Testing & Validation (0/1)
- [ ] Task 1.3.4: Review & Deploy (0/1)

### Debug Log
- **2026-02-11**: Story 1.3 created and ready for development

### Completion Notes
- TBD: Will be updated as tasks progress

---

## 🚀 Definition of Done

Story completion status:
- [ ] All tasks marked [x] - IN PROGRESS
- [ ] All tests passing (performance targets met) - PENDING
- [ ] CodeRabbit: PASS (no HIGH issues) - PENDING
- [ ] Performance: <150ms verified on endpoints - PENDING
- [ ] Staging deployed & tested 24h - PENDING
- [ ] Production deployed successfully - PENDING
- [ ] File List complete - IN PROGRESS
- [ ] Status: "Ready for Dev" - ✅ CURRENT

**Final Status:** 📋 **READY FOR DEV**
**Owner:** @dev
**Next Step:** Activate @dev with `*develop TECH-DEBT-001.3`

---

**Ready to start: `*develop TECH-DEBT-001.3`**
