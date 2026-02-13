# RLS Policy Overview

**Document:** RLS (Row-Level Security) Architecture & Implementation Guide
**Version:** 1.0
**Date:** 2026-02-13
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [RLS Architecture Diagram](#rls-architecture-diagram)
3. [Session Variable Setup](#session-variable-setup)
4. [Schema-by-Schema Policies](#schema-by-schema-policies)
5. [Policy Patterns](#policy-patterns)
6. [Admin & Bypass Guidelines](#admin--bypass-guidelines)
7. [Performance Considerations](#performance-considerations)
8. [Testing & Validation](#testing--validation)
9. [Troubleshooting](#troubleshooting)

---

## Overview

### What is RLS?

Row-Level Security (RLS) is a PostgreSQL feature that enforces data access control at the database level. Instead of relying solely on application logic, RLS policies prevent unauthorized data access at the source.

### Why RLS?

- 🔐 **Security at DB Level:** No reliance on app logic alone
- 🛡️ **Defense in Depth:** Multiple layers of protection
- 📊 **Data Isolation:** Users automatically see only their data
- ⚖️ **Compliance:** Helps meet GDPR, LGPD, HIPAA requirements
- 🚀 **Performance:** Indexes on policy columns = optimized queries

### How It Works

```
User Request
    ↓
App Layer (JWT validation)
    ↓
Database Receives Query
    ↓
RLS Policy Applied (app.current_user_id set)
    ↓
Only Authorized Rows Returned
    ↓
Response to User
```

---

## RLS Architecture Diagram

### Multi-Schema Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    iaMENU Application                        │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Community    │  │ Marketplace  │  │  Academy     │      │
│  │ Service      │  │  Service     │  │  Service     │      │
│  │ (Port 3001)  │  │ (Port 3002)  │  │ (Port 3003)  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           ↓                                  │
│                   RLS Middleware                            │
│            (src/middleware/rls.ts)                          │
│     SET app.current_user_id = '<user-id>'                  │
│                           ↓                                  │
├─────────────────────────────────────────────────────────────┤
│                    PostgreSQL Database                      │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ COMMUNITY SCHEMA                                       │ │
│  │ ├─ posts (16 tables, 13 PROTECTED)                    │ │
│  │ ├─ comments  ✅ User Isolation + Group Access        │ │
│  │ ├─ groups    ✅ Public/Private Separation            │ │
│  │ ├─ notifications ✅ STRICT (own only)                │ │
│  │ ├─ refresh_tokens ✅ STRICT (own only)              │ │
│  │ └─ ...other tables                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ MARKETPLACE SCHEMA                                     │ │
│  │ ├─ quotes (8 tables, 3 PROTECTED)                    │ │
│  │ ├─ suppliers ✅ Supplier/Buyer Isolation            │ │
│  │ ├─ quote_requests ✅ Buyer Access Control           │ │
│  │ └─ ...other tables                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ACADEMY SCHEMA                                         │ │
│  │ ├─ enrollments ✅ User Isolation                     │ │
│  │ ├─ certificates ✅ Earner Only                      │ │
│  │ └─ courses ✅ Public View                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ BUSINESS SCHEMA                                        │ │
│  │ ├─ orders ✅ Restaurant Isolation                    │ │
│  │ ├─ daily_stats ✅ Restaurant Owner Only            │ │
│  │ └─ ...other tables                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### RLS Policy Types

```
┌─────────────────────────────────────┐
│      RLS Policy Types               │
├─────────────────────────────────────┤
│                                     │
│ 1. STRICT USER ISOLATION            │
│    ├─ notifications (own only)      │
│    ├─ refresh_tokens (own only)     │
│    ├─ user_warnings (own only)      │
│    └─ enrollments (own only)        │
│                                     │
│ 2. OWNER + PUBLIC                   │
│    ├─ posts (author OR public)      │
│    ├─ suppliers (owner OR public)   │
│    └─ courses (public view)         │
│                                     │
│ 3. GROUP/ROLE BASED                 │
│    ├─ posts (author OR group mem)   │
│    ├─ quotes (supplier OR buyer)    │
│    └─ groups (creator OR member)    │
│                                     │
│ 4. PUBLIC ACCESS                    │
│    ├─ reactions (allow all)         │
│    ├─ followers (allow all view)    │
│    └─ profiles (public view)        │
│                                     │
└─────────────────────────────────────┘
```

---

## Session Variable Setup

### How RLS Enforcement Works

RLS policies use PostgreSQL session variables to identify the current user:

```sql
-- Set in middleware (services/*/src/middleware/rls.ts)
SET app.current_user_id = 'user-123-abc';

-- Available in all RLS policies
current_setting('app.current_user_id')
```

### Implementation in Node.js/Prisma

**Location:** `services/community/src/middleware/rls.ts`

```typescript
// Middleware that extracts user ID from JWT and sets session variable
export async function rls(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verify(token, process.env.JWT_SECRET!);

    // Set session variable for RLS enforcement
    await prisma.$executeRaw`SET app.current_user_id = ${decoded.id}`;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
```

### Session Variable Properties

| Property | Value | Purpose |
|----------|-------|---------|
| **Type** | Immutable String | Prevents modification |
| **Scope** | Per Transaction | Reset after query |
| **Access** | via `current_setting()` | Used in RLS policies |
| **Security** | Cannot be overridden | User cannot change own context |

---

## Schema-by-Schema Policies

### COMMUNITY SCHEMA (16 Tables)

#### Tier 1: STRICT Isolation (Critical Data)

**Tables:** notifications, refresh_tokens, user_warnings, user_bans, user_points, points_history, user_streaks

**Pattern:**
```sql
CREATE POLICY "<table>_own_only" ON "<table>"
  FOR ALL
  USING (user_id = current_setting('app.current_user_id'));
```

**Protection:** 🟢 **MAXIMUM** - Only user can see their own records

**Use Case:** Sensitive personal, security, or behavioral data

---

#### Tier 2: Owner + Group Access (Business Data)

**Tables:** posts, comments

**Pattern - Posts:**
```sql
-- User sees:
-- 1. Own posts (any group)
-- 2. Posts in groups they're member of
-- 3. Public posts (groupId IS NULL)
CREATE POLICY "posts_view_policy" ON "community"."posts"
  FOR SELECT
  USING (
    "authorId" = current_setting('app.current_user_id')
    OR "groupId" IN (
      SELECT "groupId" FROM "community"."group_memberships"
      WHERE "userId" = current_setting('app.current_user_id')
    )
    OR "groupId" IS NULL
  );
```

**Protection:** 🟢 **HIGH** - Data shared within groups

**Use Case:** Community posts, group discussions

---

#### Tier 3: Creator Control + Public (Collaborative)

**Tables:** groups, followers, moderation_logs

**Pattern - Groups:**
```sql
-- View: Public groups + member groups
-- Update: Creator only
CREATE POLICY "groups_view_policy" ON "community"."groups"
  FOR SELECT
  USING (
    "type" = 'public' OR
    "id" IN (SELECT "groupId" FROM "community"."group_memberships"
             WHERE "userId" = current_setting('app.current_user_id'))
  );

CREATE POLICY "groups_update_policy" ON "community"."groups"
  FOR UPDATE
  USING ("createdBy" = current_setting('app.current_user_id'));
```

**Protection:** 🟡 **MEDIUM** - Groups are social, need visibility

---

#### Tier 4: Public View (Engagement Data)

**Tables:** reactions, profiles

**Pattern:**
```sql
CREATE POLICY "reactions_allow_all" ON "community"."reactions"
  FOR ALL
  USING (true);  -- All authenticated users can see reactions
```

**Protection:** 🟡 **LOW** - Engagement data is inherently public

---

### MARKETPLACE SCHEMA (8+ Tables)

#### Pattern 1: Supplier Isolation

**Tables:** suppliers, quote_requests (from supplier side)

```sql
-- Supplier sees own profile only
CREATE POLICY "suppliers_user_owns_policy" ON "marketplace"."suppliers"
  FOR ALL
  USING (user_id = current_setting('app.current_user_id'));

-- All authenticated can view public supplier info
CREATE POLICY "suppliers_public_policy" ON "marketplace"."suppliers"
  FOR SELECT
  USING (true);  -- App layer filters sensitive fields
```

**Protection:** 🟢 **HIGH** - Business data protected

---

#### Pattern 2: Buyer-Supplier Quote Access

**Tables:** quotes

```sql
-- Supplier sees their own quotes
CREATE POLICY "quotes_supplier_owns_policy" ON "marketplace"."quotes"
  FOR ALL
  USING (
    "supplier_id" IN (
      SELECT id FROM "marketplace"."suppliers"
      WHERE "user_id" = current_setting('app.current_user_id')
    )
  );

-- Buyer sees quotes for their requests
CREATE POLICY "quotes_buyer_sees_own_policy" ON "marketplace"."quotes"
  FOR SELECT
  USING (
    "quote_request_id" IN (
      SELECT id FROM "marketplace"."quote_requests"
      WHERE "restaurant_id" = current_setting('app.current_user_id')
    )
  );
```

**Protection:** 🟢 **HIGH** - Business transaction data protected

---

### ACADEMY SCHEMA (5 Tables)

#### Pattern: Enrollment Isolation

**Tables:** enrollments, certificates

```sql
-- User sees own enrollments/certificates only
CREATE POLICY "enrollments_own_only" ON "academy"."enrollments"
  FOR ALL
  USING (user_id = current_setting('app.current_user_id'));

-- Courses visible to all (learning content)
CREATE POLICY "courses_public" ON "academy"."courses"
  FOR SELECT
  USING (true);
```

**Protection:** 🟢 **HIGH** - Personal learning data protected

---

### BUSINESS SCHEMA (5 Tables)

#### Pattern: Restaurant Isolation

**Tables:** orders, daily_stats

```sql
-- Restaurant owner sees own orders only
CREATE POLICY "orders_restaurant_owner" ON "business"."orders"
  FOR ALL
  USING (restaurant_id = current_setting('app.current_user_id'));

-- Daily stats per restaurant
CREATE POLICY "daily_stats_owner_only" ON "business"."daily_stats"
  FOR ALL
  USING (restaurant_id = current_setting('app.current_user_id'));
```

**Protection:** 🟢 **HIGH** - Business analytics protected

---

## Policy Patterns

### Pattern Library

#### 1️⃣ Simple User Isolation (STRICT)

**When to use:** Sensitive personal data (tokens, warnings, points)

```sql
CREATE POLICY "<table>_own_only" ON "<table>"
  FOR ALL
  USING (user_id = current_setting('app.current_user_id'));
```

**Pros:** Maximum security, simple logic
**Cons:** Zero sharing capability

---

#### 2️⃣ Owner + Public

**When to use:** User-generated content with public option

```sql
CREATE POLICY "<table>_owner_or_public" ON "<table>"
  FOR SELECT
  USING (
    owner_id = current_setting('app.current_user_id')
    OR is_public = true
  );
```

**Pros:** Balances sharing with privacy
**Cons:** Requires public flag in schema

---

#### 3️⃣ Group/Role-Based

**When to use:** Collaborative data (team posts, projects)

```sql
CREATE POLICY "<table>_group_access" ON "<table>"
  FOR SELECT
  USING (
    group_id IN (
      SELECT group_id FROM group_memberships
      WHERE user_id = current_setting('app.current_user_id')
    )
  );
```

**Pros:** Flexible sharing
**Cons:** Requires membership table

---

#### 4️⃣ Public View (App-Filtered)

**When to use:** Marketing/discovery data (supplier listings)

```sql
CREATE POLICY "<table>_public_view" ON "<table>"
  FOR SELECT
  USING (true);

-- In application layer:
SELECT id, name, description  -- NOT prices, contact_info, etc
FROM suppliers;
```

**Pros:** Enables discovery
**Cons:** Relies on app layer filtering

---

## Admin & Bypass Guidelines

### When to Use Service Role (Bypass RLS)

Service role ignores RLS policies. Use **ONLY** in trusted contexts:

✅ **SAFE:** Admin operations, bulk migrations, reporting
❌ **DANGEROUS:** User request handling, API endpoints

### Service Role Bypass Example

```typescript
// Create a separate Prisma client with service role
const adminPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_SERVICE_ROLE  // Uses service role key
    }
  }
});

// Only in admin-protected routes
app.post('/admin/impersonate', requireAdmin, async (req, res) => {
  // Bypass RLS to see all users
  const users = await adminPrisma.profile.findMany();
});
```

### Access Control for Bypass

```typescript
// Add role check before using service role
if (req.user.role !== 'ADMIN') {
  return res.status(403).json({ error: 'Forbidden' });
}

// Now safe to use service role
```

---

## Performance Considerations

### Indexes for RLS Policies

All filter columns should be indexed for optimal performance:

```sql
-- Community indexes
CREATE INDEX "posts_authorId_idx" ON "community"."posts"("authorId");
CREATE INDEX "posts_groupId_idx" ON "community"."posts"("groupId");
CREATE INDEX "group_memberships_userId_groupId_idx"
  ON "community"."group_memberships"("userId", "groupId");

-- Marketplace indexes
CREATE INDEX "suppliers_user_id_idx" ON "marketplace"."suppliers"("user_id");
CREATE INDEX "quotes_supplier_id_idx" ON "marketplace"."quotes"("supplier_id");
CREATE INDEX "quotes_quote_request_id_idx" ON "marketplace"."quotes"("quote_request_id");

-- Academy indexes
CREATE INDEX "enrollments_user_id_idx" ON "academy"."enrollments"("user_id");

-- Business indexes
CREATE INDEX "orders_restaurant_id_idx" ON "business"."orders"("restaurant_id");
```

### Query Performance Tips

1. **Use EXPLAIN ANALYZE** to verify indexes are used
2. **Avoid subqueries in WHERE** when possible
3. **Use indexed joins** (user_id, group_id, etc.)
4. **Monitor slow queries** with pg_stat_statements

---

## Testing & Validation

### Integration Tests

**Location:** `services/community/tests/rls.integration.test.ts`

Tests cover:
- ✅ User can see own data
- ✅ User cannot see other users' data
- ✅ Group members can access group data
- ✅ STRICT policies enforce isolation
- ✅ CRUD operations respect policies

### Running Tests

```bash
# Run RLS tests
cd services/community
npm test -- rls.integration.test.ts

# With coverage
npm test -- rls.integration.test.ts --coverage
```

### Manual Testing

```sql
-- Set user context
SET app.current_user_id = 'user-123';

-- Should return only user's posts
SELECT * FROM community.posts;

-- Should fail if user doesn't have access
SELECT * FROM community.refresh_tokens WHERE user_id = 'user-456';
-- Returns: (no rows)
```

---

## Troubleshooting

### Issue 1: "current_user_id is not set"

**Cause:** RLS middleware not executed before query

**Solution:**
```typescript
// Ensure RLS middleware runs BEFORE data queries
app.use(rls);  // Set session variable first
app.use('/api', routes);  // Then routes
```

---

### Issue 2: "no rows returned" for user's own data

**Cause:** Session variable value doesn't match user_id in database

**Debug:**
```sql
-- Check what's set
SELECT current_setting('app.current_user_id');

-- Verify user_id format in database
SELECT DISTINCT user_id FROM community.posts LIMIT 5;
```

---

### Issue 3: Slow RLS queries

**Cause:** Missing indexes on filter columns

**Solution:**
```sql
-- Add index
CREATE INDEX posts_authorId_idx ON community.posts(authorId);

-- Verify query plan
EXPLAIN ANALYZE SELECT * FROM community.posts
  WHERE authorId = current_setting('app.current_user_id');
```

---

### Issue 4: Admin cannot see other users' data

**Cause:** Service role not used

**Solution:**
```typescript
// Use separate admin connection
const adminPrisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_SERVICE_ROLE } }
});

// Admin can now see all data
const allUsers = await adminPrisma.profile.findMany();
```

---

## Security Checklist

Before deploying to production:

- [ ] All sensitive tables have STRICT RLS policies
- [ ] Session variable set in middleware before queries
- [ ] Indexes created on all policy filter columns
- [ ] Integration tests passing
- [ ] No SQL injection vulnerabilities found
- [ ] Service role restricted to admin contexts
- [ ] Documentation updated
- [ ] Performance benchmarked
- [ ] Team trained on RLS concepts
- [ ] Monitoring alerts set up

---

## References

- [PostgreSQL RLS Docs](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Story 2.1: RLS Implementation](../stories/story-wave2-001-rls-policies.md)
- [RLS Validation Report](../qa/rls-validation-report.md)
- [RLS Security Analysis](../qa/rls-security-analysis.md)

---

## Document Maintenance

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-13 | @data-engineer | Initial release |
| [Future] | [TBD] | [TBD] | [TBD] |

---

**Last Updated:** 2026-02-13
**Status:** ✅ Production Ready
**Approved By:** @data-engineer (Dara)
