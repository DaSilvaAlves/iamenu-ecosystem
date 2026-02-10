# ADR-001: Row-Level Security (RLS) Architecture

**Date:** 2026-02-10
**Status:** PROPOSED
**Deciders:** @architect (Aria), @dev (James), @qa (Quinn)
**Affects:** Community, Marketplace, Academy, Business services

---

## 1. Problem Statement

**Current State:**
- No Row-Level Security implemented at database level
- All access control is application-level only
- If JWT is compromised, attacker can access any user's data via UUID guessing
- Multi-tenant data isolation is NOT guaranteed

**Example Vulnerability:**
```sql
-- Attacker with valid JWT can query:
SELECT * FROM community.posts WHERE authorId = 'any-uuid-here';
-- No database constraint prevents this
```

**Impact:**
- 🔴 CRITICAL: Data breach risk for restaurant owners
- 🔴 CRITICAL: Supplier quotes exposed to competitors
- 🔴 CRITICAL: Student course progress visible to others
- 🟡 HIGH: Regulatory compliance issues (GDPR, etc.)

---

## 2. Decision: Multi-Layer RLS Strategy

Implement **Defense in Depth** with RLS at database + middleware at application level.

### 2.1 PostgreSQL RLS Policies

**Architecture:**
```
User Request
    ↓
JWT Middleware (extract user_id)
    ↓
SET app.current_user_id = 'user-123'
    ↓
Database Query
    ↓
RLS Policy checks: app.current_user_id vs table.user_id
    ↓
Return only matching rows
```

**Key Design:**
- Use PostgreSQL session variable: `app.current_user_id`
- ONE policy per access pattern (SELECT, INSERT, UPDATE, DELETE)
- Whitelist approach: explicit permissions, deny by default

### 2.2 Implementation per Service

#### Community Service
```
Table: posts
  Policy 1: User sees own posts + public posts + group posts
  Policy 2: User can only edit own posts

Table: groups
  Policy 1: User sees groups they're member of + public groups

Table: notifications
  Policy 1: User sees own notifications only (strict)
```

#### Marketplace Service
```
Table: suppliers
  Policy 1: Supplier sees own full profile
  Policy 2: Public sees only public fields (approved by Supplier)

Table: quotes
  Policy 1: Supplier sees quotes FOR their supplies
  Policy 2: Buyer sees quotes FROM their requests

Table: reviews
  Policy 1: User sees all reviews (public data)
  Policy 2: Supplier can only modify own response
```

#### Academy Service
```
Table: courses
  Policy 1: Instructor sees own courses
  Policy 2: Students see only published courses they're enrolled in

Table: enrollments
  Policy 1: Student sees own enrollments only
  Policy 2: Instructor sees enrollments for their courses

Table: certificates
  Policy 1: Student sees own certificates
  Policy 2: Public can verify certificates
```

#### Business Service
```
Table: restaurants
  Policy 1: Owner sees own restaurant only

Table: orders
  Policy 1: Restaurant owner sees own orders only

Table: products
  Policy 1: Restaurant owner sees own products only

Table: daily_stats
  Policy 1: Owner sees own stats only
```

---

## 3. Implementation Timeline

### Phase A: Infrastructure (Week 1)
- Create RLS middleware (extracts JWT, sets session variable)
- Create template policies (reusable patterns)
- Setup testing harness

### Phase B: Community Service (Week 1-2)
- Enable RLS on posts, comments, groups, notifications
- 8 RLS policies total
- Comprehensive testing

### Phase C: Marketplace Service (Week 2-3)
- Enable RLS on suppliers, quotes, reviews
- 7 RLS policies total
- Integration testing with complex policies

### Phase D: Academy Service (Week 3)
- Enable RLS on courses, enrollments, certificates
- 6 RLS policies total
- Test instructor/student separation

### Phase E: Business Service (Week 4)
- Enable RLS on restaurants, orders, products, daily_stats
- 4 RLS policies total
- Ensure restaurant data isolation

---

## 4. Technical Requirements

### 4.1 Session Variables
```typescript
// src/middleware/rls.middleware.ts
app.use((req, res, next) => {
  const userId = extractUserIdFromJWT(req);

  // Set PostgreSQL session variable
  prisma.$executeRawUnsafe(
    `SET app.current_user_id = '${userId}'`
  );

  next();
});
```

### 4.2 RLS Policy Template

```sql
-- Template Pattern
CREATE POLICY "policy_name" ON schema.table_name
  FOR SELECT
  USING (
    -- Condition: does this user own this row?
    user_id = current_setting('app.current_user_id')
    OR is_public = true
    OR EXISTS (
      SELECT 1 FROM schema.related_table
      WHERE related_table.user_id = current_setting('app.current_user_id')
      AND related_table.id = table_name.related_id
    )
  );
```

### 4.3 Testing Strategy

```typescript
// Test pattern: RLS bypass check
describe('RLS: Posts', () => {
  it('should NOT allow user_1 to see user_2 private posts', async () => {
    // Set session as user_1
    await prisma.$executeRawUnsafe(
      `SET app.current_user_id = 'user-1'`
    );

    // Try to query user_2's private post
    const posts = await prisma.post.findMany({
      where: { authorId: 'user-2' }
    });

    // Should be empty (RLS blocked it)
    expect(posts).toHaveLength(0);
  });
});
```

---

## 5. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Performance: RLS adds policy evaluation overhead | 🟡 HIGH | Index all RLS-checked columns |
| Prisma limitations: RLS + Prisma may conflict | 🟡 HIGH | Test extensively, may need raw SQL fallback |
| Session variable reset issues | 🟡 MEDIUM | Middleware ensures set before every query |
| Complex multi-tenant policies | 🟡 MEDIUM | Start simple, iterate on complexity |
| Audit trail missing | 🟡 MEDIUM | Add database triggers for sensitive operations |

---

## 6. Acceptance Criteria

✅ All 4 services have RLS enabled
✅ 25+ RLS policies created and tested
✅ Zero data leakage in test suite (0 bypasses)
✅ Performance baseline: <50ms overhead per query
✅ Middleware handles session variables correctly
✅ Team trained on RLS concepts
✅ Documentation complete with examples

---

## 7. References

- PostgreSQL RLS Documentation: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Prisma RLS Example: https://www.prisma.io/docs/orm/prisma-client/queries/raw-database-access
- OWASP Multi-Tenancy: https://owasp.org/www-community/attacks/Insecure_Direct_Object_References

---

**Decision:** APPROVED ✅
**Next Step:** Create RLS middleware + policy templates

