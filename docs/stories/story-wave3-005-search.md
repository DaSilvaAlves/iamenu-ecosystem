# Story 3.5: Add Search Functionality

**ID:** STORY-003.5
**Type:** 🔍 Feature (Medium)
**Epic:** AIOS-PHASE3-ENHANCEMENT (Wave 3)
**Priority:** HIGH
**Assigned to:** @dev + @data-engineer
**Status:** 🟡 Ready for Development
**Created:** 2026-02-13
**Estimated Time:** 12 hours

---

## 📝 Story Description

Implement full-text search across posts, products, courses, and suppliers. Support filters, sorting, and relevance ranking. Start with PostgreSQL full-text search for simplicity, with upgrade path to Elasticsearch for future scale.

**Acceptance Criteria:**
- [ ] Full-text search working for posts (title + content)
- [ ] Full-text search working for products (name + description)
- [ ] Full-text search working for courses (title + description)
- [ ] Full-text search working for suppliers (name + description)
- [ ] Search results sorted by relevance
- [ ] Filters working (category, date range, price range)
- [ ] Search autocomplete/suggestions implemented
- [ ] Search analytics (popular searches tracked)
- [ ] Typo tolerance (fuzzy matching for close matches)
- [ ] Search response time < 200ms for 10k items
- [ ] Indexed content stays in sync with database
- [ ] RLS enforced (users only see accessible content)
- [ ] All tests passing
- [ ] CodeRabbit review passed

---

## 🔧 Technical Details

**Implementation Approach:**
```
Phase 1 (Wave 3 - PostgreSQL):
├─ Use tsvector + tsquery (PostgreSQL native)
├─ GIN indexes on searchable columns
├─ Response time target: < 200ms
└─ Supports: posts, products, courses, suppliers

Phase 2 (Wave 4+ - Elasticsearch):
├─ Add Elasticsearch cluster
├─ Index in real-time
├─ Fallback to PostgreSQL if ES down
└─ Response time target: < 100ms
```

**Search Scopes:**
- Posts: title, content, tags
- Products: name, description, category
- Courses: title, description, instructor
- Suppliers: name, description, tags

**Dependencies:** Story 2.1 (RLS), Story 3.2 (Query Optimization)
**Blocks:** None

---

## 📊 Timeline & Estimation

**Estimated Time:** 12 hours
**Complexity:** Medium-High

---

## 📋 File List (To be updated)

- [ ] `services/community/src/services/search.service.ts`
- [ ] `services/community/prisma/migrations/{date}_add_search_indexes/migration.sql`
- [ ] `services/community/tests/search.integration.test.ts`
- [ ] `docs/features/search.md`

---

**Created by:** River (Scrum Master) 🌊
