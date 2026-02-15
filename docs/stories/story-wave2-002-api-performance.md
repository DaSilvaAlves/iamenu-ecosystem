# Story 2.2: Fix API Response Performance

**ID:** STORY-002.2
**Type:** ⚡ Performance (High)
**Epic:** AIOS-DESBLOQUEIO-COMPLETO (Phase 2 - Wave 2)
**Priority:** HIGH
**Assigned to:** @dev
**Status:** 🟡 Ready for Development
**Created:** 2026-02-13
**Estimated Time:** 8 hours

---

## 📝 Story Description

Optimize API response times by identifying and fixing N+1 queries, adding database indexes, and implementing query caching. Current response times are > 500ms for some endpoints, impacting user experience.

**Current Symptom:**
- Community API endpoints: 300-500ms response time
- Marketplace API endpoints: 200-800ms response time
- User complaints about slow page loads

**Root Cause:**
- N+1 queries (loading related entities inefficiently)
- Missing database indexes on foreign keys
- No caching layer for read-heavy queries
- Inefficient query patterns in services

**Impact:**
- 🔴 Poor user experience (slow loads)
- High database load
- Scalability concerns

---

## ✅ Acceptance Criteria

- [ ] All API endpoints respond in < 150ms (P95)
- [ ] N+1 queries identified and fixed
- [ ] Missing indexes added (foreign keys, commonly filtered columns)
- [ ] Query caching implemented for GET endpoints
- [ ] Performance tests created (baseline established)
- [ ] No functionality regression
- [ ] Response times documented per endpoint
- [ ] Load testing passed (100 concurrent users)

---

## 🔧 Technical Details

**Performance Targets:**
- GET endpoints: < 100ms
- POST/PUT endpoints: < 150ms
- Search endpoints: < 200ms
- Pagination default: 20 items/page

**Common N+1 Patterns to Fix:**
```javascript
// ❌ BAD (N+1 queries)
const posts = await prisma.post.findMany();
for (const post of posts) {
  post.author = await prisma.profile.findUnique({
    where: { userId: post.authorId }
  });
}

// ✅ GOOD (Single query with include)
const posts = await prisma.post.findMany({
  include: { author: true }
});
```

**Index Strategy:**
```sql
CREATE INDEX idx_posts_author_id ON community.posts(author_id);
CREATE INDEX idx_comments_post_id ON community.comments(post_id);
CREATE INDEX idx_followers_following_id ON community.followers(following_id);
```

---

## 📊 Timeline & Estimation

**Estimated Time:** 8 hours
**Complexity:** Medium
**Dependencies:** STORY-001 (completed ✅)

---

## 🎯 Acceptance Gate

**Definition of Done:**
1. ✅ All endpoints < 150ms P95
2. ✅ Load test passed (100 users)
3. ✅ No N+1 queries
4. ✅ Performance benchmarks documented

---

## 📋 File List

- [ ] `services/community/src/services/*.ts` - Query optimizations
- [ ] `services/community/prisma/migrations/` - Index creation
- [ ] `docs/performance/api-benchmarks.md` - Performance report

---

## 🔄 Dev Agent Record

**Dev Agent:** @dev
**Start Time:** [To be filled]
**Status Updates:** [To be filled]

---

**Created by:** Orion (AIOS Master) 👑

