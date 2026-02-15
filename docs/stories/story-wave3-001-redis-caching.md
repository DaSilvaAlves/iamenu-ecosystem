# Story 3.1: Implement Redis Caching Layer

**ID:** STORY-003.1
**Type:** ⚡ Performance (Medium)
**Epic:** AIOS-PHASE3-ENHANCEMENT (Wave 3)
**Priority:** HIGH
**Assigned to:** @dev + @architect
**Status:** 🟡 Ready for Development
**Created:** 2026-02-13
**Estimated Time:** 8 hours

---

## 📝 Story Description

Implement Redis caching layer to reduce database load and improve API response times. Cache frequently accessed data (posts, profiles, supplier products, courses) with appropriate TTLs and cache invalidation strategies. This is the foundation for Wave 3 performance improvements.

**Current Symptom:**
- Database hit for every read query
- High database load during peak traffic
- Slower response times than target (150ms P95)

**Root Cause:**
- No caching layer implemented
- All reads go directly to database
- Database connections strained

**Impact:**
- 🟢 Reduce database load by 60%+
- 🟢 Improve API response times (estimated 2.5x faster)
- 🟢 Enable higher concurrent users

---

## ✅ Acceptance Criteria

- [ ] Redis deployed and configured (Redis 7.0+)
- [ ] Cache layer abstracted (pluggable strategy pattern)
- [ ] Posts cached with 5-minute TTL
- [ ] Profiles cached with 5-minute TTL
- [ ] Products cached with 10-minute TTL
- [ ] Courses cached with 10-minute TTL
- [ ] Cache invalidation on create/update/delete operations
- [ ] No stale data returned to users
- [ ] Cache hit rate > 60% for read-heavy endpoints
- [ ] Cache performance benchmarked (baseline established)
- [ ] Monitoring/metrics for cache health
- [ ] Graceful fallback if Redis unavailable
- [ ] Cache circuit breaker implemented
- [ ] All tests passing (> 85% coverage)
- [ ] CodeRabbit pre-commit review passed

---

## 🔧 Technical Details

**Cache Architecture:**
```typescript
// CacheStrategy interface (pluggable)
interface CacheStrategy {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Implementations
class RedisCache implements CacheStrategy { ... }
class InMemoryCache implements CacheStrategy { ... }
class NoCache implements CacheStrategy { ... }
```

**Cache Keys Convention:**
```
posts:{postId}
profiles:{userId}
products:{productId}
courses:{courseId}
{service}:list:{filter}:{page}
```

**TTL Strategy:**
- Posts: 5 minutes (frequently updated)
- Profiles: 5 minutes (user info changes)
- Products: 10 minutes (less frequent changes)
- Courses: 10 minutes (static content)
- Lists: 1 minute (for pagination)

**Invalidation Triggers:**
```
POST create → cache.delete('posts:list:*')
POST update → cache.delete('posts:{id}') + 'posts:list:*'
POST delete → cache.delete('posts:{id}') + 'posts:list:*'
```

**Dependencies:**
- Story 2.1 (RLS - ensure RLS works with cache)
- Story 2.2 (API Performance - validates cache benefit)

**Blocks:**
- Story 3.2 (Query Optimization - benefits from caching foundation)
- Story 3.7 (Analytics - uses cache for metrics)

---

## 📊 Timeline & Estimation

**Estimated Time:** 8 hours
**Complexity:** Medium-High
**Dependencies:** Story 2.1, Story 2.2 ✅

**Breakdown:**
- Setup Redis & Ioredis client: 1h
- Implement cache abstraction layer: 2h
- Cache posts, profiles, products, courses: 2h
- Implement invalidation strategy: 1.5h
- Add monitoring/metrics: 1h
- Testing & benchmarking: 0.5h

---

## 🎯 Acceptance Gate

**Definition of Done:**
1. ✅ Redis deployed locally and in test environment
2. ✅ Cache layer passes all unit tests (> 85% coverage)
3. ✅ Integration tests verify cache behavior
4. ✅ Load test shows 60%+ cache hit rate
5. ✅ No data consistency issues (stale data)
6. ✅ Graceful fallback when Redis down
7. ✅ CodeRabbit review: 0 CRITICAL, < 5 HIGH issues
8. ✅ Performance benchmarks documented

---

## 📋 File List (To be updated)

- [ ] `services/community/src/lib/cache/CacheStrategy.ts` - Cache interface
- [ ] `services/community/src/lib/cache/RedisCache.ts` - Redis implementation
- [ ] `services/community/src/lib/cache/InMemoryCache.ts` - In-memory implementation
- [ ] `services/community/src/lib/cache/NoCache.ts` - No-op implementation
- [ ] `services/community/src/lib/cache/cache.ts` - Cache factory
- [ ] `services/community/src/middleware/cacheMiddleware.ts` - Cache invalidation
- [ ] `services/community/tests/cache.integration.test.ts` - Integration tests
- [ ] `docs/architecture/caching-strategy.md` - Caching documentation
- [ ] `docker-compose.yml` - Redis service (updated)

---

## 🔄 Dev Agent Record

**Dev Agent:** @dev + @architect
**Mode:** Interactive Development
**Start Time:** [To be filled]
**Status Updates:**
  - [ ] Redis setup complete
  - [ ] Cache abstraction implemented
  - [ ] Cache invalidation working
  - [ ] Monitoring metrics added
  - [ ] All tests passing
  - [ ] CodeRabbit review passed
  - [ ] Performance benchmarks documented

**Completion Checklist:**
- [ ] All acceptance criteria met
- [ ] File List complete and accurate
- [ ] Tests passing (> 85% coverage)
- [ ] CodeRabbit pre-commit review: PASS
- [ ] Story marked "Ready for Review"

---

## 📝 CodeRabbit Integration

**Pre-Commit Review Focus:**
- Caching patterns and best practices
- Thread safety (Redis is single-threaded)
- Cache invalidation logic correctness
- No hardcoded cache keys
- Proper error handling for cache misses
- Memory leak prevention (event listener cleanup)

**Quality Gates:**
- Zero CRITICAL issues (blocking)
- High issues documented in Dev Notes
- Performance assumptions validated

---

## 🔗 Related Stories

- Story 3.2: Query Optimization (uses cache foundation)
- Story 3.7: Analytics (benefits from cached metrics)
- Story 2.2: API Performance (validates cache impact)

---

**Created by:** River (Scrum Master) 🌊
**Ready for:** @dev implementation

---

*Next: Create Story 3.2 (Query Optimization)*
