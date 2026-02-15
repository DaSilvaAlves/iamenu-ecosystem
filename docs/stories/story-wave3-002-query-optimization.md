# Story 3.2: Optimize Database Queries

**ID:** STORY-003.2
**Type:** ⚡ Performance (Medium)
**Epic:** AIOS-PHASE3-ENHANCEMENT (Wave 3)
**Priority:** HIGH
**Assigned to:** @data-engineer
**Status:** 🟡 Ready for Development
**Created:** 2026-02-13
**Estimated Time:** 6 hours

---

## 📝 Story Description

Identify and fix remaining N+1 query problems, add missing indexes on foreign keys and commonly filtered columns, and implement pagination where needed. This complements Story 3.1 (caching) to optimize database layer performance.

**Acceptance Criteria:**
- [ ] All N+1 patterns identified and fixed
- [ ] Indexes added on ALL foreign keys
- [ ] Indexes added on commonly filtered columns (created_at, status, etc.)
- [ ] Query performance benchmarked (before/after metrics)
- [ ] Slow query log analyzed and resolved
- [ ] Pagination implemented (default 20 items/page, max 100)
- [ ] No full table scans on large tables (> 10k rows)
- [ ] Query analysis reports generated and documented
- [ ] Performance improvement validated (response time reduction)
- [ ] All tests passing (> 85% coverage)
- [ ] CodeRabbit review passed

---

## 🔧 Technical Details

**Index Strategy (SQL):**
```sql
-- Community Schema
CREATE INDEX idx_posts_author_id ON community.posts(author_id);
CREATE INDEX idx_posts_created_at ON community.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON community.comments(post_id);
CREATE INDEX idx_comments_author_id ON community.comments(author_id);
CREATE INDEX idx_followers_user_id ON community.followers(user_id);
CREATE INDEX idx_followers_following_id ON community.followers(following_id);

-- Marketplace Schema
CREATE INDEX idx_quotes_supplier_id ON marketplace.quotes(supplier_id);
CREATE INDEX idx_quotes_request_id ON marketplace.quotes(quote_request_id);
CREATE INDEX idx_quote_requests_restaurant_id ON marketplace.quote_requests(restaurant_id);

-- Academy Schema
CREATE INDEX idx_enrollments_user_id ON academy.enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON academy.enrollments(course_id);

-- Business Schema
CREATE INDEX idx_orders_restaurant_id ON business.orders(restaurant_id);
CREATE INDEX idx_orders_created_at ON business.orders(created_at DESC);
```

**N+1 Pattern Fix Example:**
```typescript
// ❌ BEFORE (N+1)
const posts = await prisma.post.findMany({ take: 20 });
for (const post of posts) {
  post.author = await prisma.profile.findUnique({
    where: { userId: post.authorId }
  });
}

// ✅ AFTER (Single query)
const posts = await prisma.post.findMany({
  take: 20,
  include: { author: true }
});
```

---

## 📊 Timeline & Estimation

**Estimated Time:** 6 hours
**Complexity:** Medium
**Dependencies:** Story 2.1 (RLS), Story 3.1 (Caching)
**Blocks:** Story 3.7 (Analytics)

---

## 🎯 Acceptance Gate

1. ✅ All identified N+1 patterns fixed
2. ✅ All missing indexes created
3. ✅ Query performance benchmarks > 30% improvement
4. ✅ Slow query log cleared (0 queries > 1s)
5. ✅ CodeRabbit review: PASS

---

## 📋 File List (To be updated)

- [ ] `services/community/prisma/migrations/{date}_add_missing_indexes/migration.sql`
- [ ] `services/marketplace/prisma/migrations/{date}_add_missing_indexes/migration.sql`
- [ ] `services/academy/prisma/migrations/{date}_add_missing_indexes/migration.sql`
- [ ] `services/business/prisma/migrations/{date}_add_missing_indexes/migration.sql`
- [ ] `docs/architecture/query-optimization-report.md` - Performance metrics

---

## 🔄 Dev Agent Record

**Dev Agent:** @data-engineer
**Start Time:** [To be filled]
**Status Updates:** [To be filled]

---

**Created by:** River (Scrum Master) 🌊
**Ready for:** @data-engineer implementation
