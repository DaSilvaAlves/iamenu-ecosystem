# RLS Policies Design & Implementation Guide

**Created:** 2026-02-10
**Status:** READY FOR IMPLEMENTATION
**Audience:** Backend developers, DBAs

---

## Community Service RLS Policies

### 1. Posts Table

**Status:** Posts are semi-public (visible within groups/communities)

```sql
-- Policy 1: SELECT - User sees own posts + group posts they're in
CREATE POLICY "posts_view_policy" ON community.posts
  FOR SELECT
  USING (
    -- User owns the post
    authorId = current_setting('app.current_user_id')
    OR
    -- Post is in a group user is member of
    groupId IN (
      SELECT groupId FROM community.group_memberships
      WHERE userId = current_setting('app.current_user_id')
    )
    OR
    -- Post is public (no group)
    groupId IS NULL
  );

-- Policy 2: INSERT - User can only create posts
CREATE POLICY "posts_create_policy" ON community.posts
  FOR INSERT
  WITH CHECK (
    authorId = current_setting('app.current_user_id')
  );

-- Policy 3: UPDATE - User can only edit own posts
CREATE POLICY "posts_update_policy" ON community.posts
  FOR UPDATE
  USING (
    authorId = current_setting('app.current_user_id')
  );

-- Policy 4: DELETE - User can only delete own posts
CREATE POLICY "posts_delete_policy" ON community.posts
  FOR DELETE
  USING (
    authorId = current_setting('app.current_user_id')
  );
```

### 2. Groups Table

```sql
-- Policy 1: SELECT - User sees groups they're in + public groups
CREATE POLICY "groups_view_policy" ON community.groups
  FOR SELECT
  USING (
    type = 'public'
    OR id IN (
      SELECT groupId FROM community.group_memberships
      WHERE userId = current_setting('app.current_user_id')
    )
  );

-- Policy 2: INSERT - Only admins can create groups (application-enforced)
-- (Require role check in application code)

-- Policy 3: UPDATE - Only group creators can update
CREATE POLICY "groups_update_policy" ON community.groups
  FOR UPDATE
  USING (
    createdBy = current_setting('app.current_user_id')
  );
```

### 3. Notifications Table

```sql
-- Policy (STRICT): User sees ONLY own notifications
CREATE POLICY "notifications_own_only" ON community.notifications
  FOR ALL
  USING (
    userId = current_setting('app.current_user_id')
  );
```

### 4. Comments Table

```sql
-- Policy 1: SELECT - User sees comments on posts they can see
CREATE POLICY "comments_view_policy" ON community.comments
  FOR SELECT
  USING (
    postId IN (
      SELECT id FROM community.posts
      WHERE
        authorId = current_setting('app.current_user_id')
        OR groupId IN (
          SELECT groupId FROM community.group_memberships
          WHERE userId = current_setting('app.current_user_id')
        )
        OR groupId IS NULL
    )
  );

-- Policy 2: INSERT/UPDATE/DELETE - User can only manage own comments
CREATE POLICY "comments_own_only" ON community.comments
  FOR INSERT
  WITH CHECK (
    authorId = current_setting('app.current_user_id')
  );

CREATE POLICY "comments_update_policy" ON community.comments
  FOR UPDATE
  USING (
    authorId = current_setting('app.current_user_id')
  );

CREATE POLICY "comments_delete_policy" ON community.comments
  FOR DELETE
  USING (
    authorId = current_setting('app.current_user_id')
  );
```

---

## Marketplace Service RLS Policies

### 1. Suppliers Table

```sql
-- Policy 1: SELECT - Supplier sees own profile, others see only public
CREATE POLICY "suppliers_view_policy" ON marketplace.suppliers
  FOR SELECT
  USING (
    -- Supplier sees own
    user_id = current_setting('app.current_user_id')
    OR
    -- Others see public suppliers only
    verified = true
  );

-- Policy 2: INSERT/UPDATE - Only owner can create/edit
CREATE POLICY "suppliers_manage_policy" ON marketplace.suppliers
  FOR INSERT
  WITH CHECK (
    user_id = current_setting('app.current_user_id')
  );

CREATE POLICY "suppliers_update_policy" ON marketplace.suppliers
  FOR UPDATE
  USING (
    user_id = current_setting('app.current_user_id')
  );
```

### 2. Quotes Table

```sql
-- Policy 1: SELECT - Supplier sees quotes FOR them, Buyer sees FROM their requests
CREATE POLICY "quotes_view_policy" ON marketplace.quotes
  FOR SELECT
  USING (
    -- Supplier sees quotes they sent
    supplier_id IN (
      SELECT id FROM marketplace.suppliers
      WHERE user_id = current_setting('app.current_user_id')
    )
    OR
    -- Buyer sees quotes for their requests
    quote_request_id IN (
      SELECT id FROM marketplace.quote_requests
      WHERE restaurant_id = current_setting('app.current_user_id')
    )
  );
```

### 3. Reviews Table

```sql
-- Policy 1: SELECT - All users can see reviews (public data)
CREATE POLICY "reviews_view_all" ON marketplace.reviews
  FOR SELECT
  USING (true);

-- Policy 2: INSERT - Any authenticated user can leave review
CREATE POLICY "reviews_create_policy" ON marketplace.reviews
  FOR INSERT
  WITH CHECK (
    reviewer_id = current_setting('app.current_user_id')
  );
```

---

## Academy Service RLS Policies

### 1. Courses Table

```sql
-- Policy 1: SELECT - Student sees published, Instructor sees own
CREATE POLICY "courses_view_policy" ON academy.courses
  FOR SELECT
  USING (
    published = true
    OR
    -- Instructor can see own courses (check via enrollments logic)
    id IN (
      SELECT courseId FROM academy.enrollments
      WHERE userId = current_setting('app.current_user_id')
    )
  );
```

### 2. Enrollments Table

```sql
-- Policy (STRICT): User sees ONLY own enrollments
CREATE POLICY "enrollments_own_only" ON academy.enrollments
  FOR ALL
  USING (
    user_id = current_setting('app.current_user_id')
  );
```

### 3. Certificates Table

```sql
-- Policy 1: SELECT - User sees own, Public can verify
CREATE POLICY "certificates_view_policy" ON academy.certificates
  FOR SELECT
  USING (
    user_id = current_setting('app.current_user_id')
    -- Verification endpoint doesn't use RLS (uses verification_code)
  );
```

---

## Business Service RLS Policies

### 1. Restaurants Table

```sql
-- Policy (STRICT): Owner sees ONLY own restaurant
CREATE POLICY "restaurants_owner_only" ON business.restaurants
  FOR ALL
  USING (
    user_id = current_setting('app.current_user_id')
  );
```

### 2. Orders Table

```sql
-- Policy (STRICT): Owner sees ONLY own orders
CREATE POLICY "orders_owner_only" ON business.orders
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM business.restaurants
      WHERE user_id = current_setting('app.current_user_id')
    )
  );
```

### 3. Products Table

```sql
-- Policy (STRICT): Owner sees ONLY own products
CREATE POLICY "products_owner_only" ON business.products
  FOR ALL
  USING (
    restaurant_id IN (
      SELECT id FROM business.restaurants
      WHERE user_id = current_setting('app.current_user_id')
    )
  );
```

---

## Implementation Checklist

**Community Service:**
- [ ] Enable RLS on posts, comments, groups, notifications
- [ ] Create 8 policies
- [ ] Test group access logic
- [ ] Run regression tests

**Marketplace Service:**
- [ ] Enable RLS on suppliers, quotes, reviews
- [ ] Create 5 policies
- [ ] Test supplier/buyer separation
- [ ] Test quote visibility

**Academy Service:**
- [ ] Enable RLS on courses, enrollments, certificates
- [ ] Create 4 policies
- [ ] Test student/public visibility

**Business Service:**
- [ ] Enable RLS on restaurants, orders, products, daily_stats
- [ ] Create 4 policies
- [ ] Test owner isolation (CRITICAL)

---

## Testing Template

```typescript
describe('RLS: Restaurants', () => {
  it('should NOT allow user_1 to see user_2 restaurants', async () => {
    // Set session as user_1
    await setRLSContext('user-1');

    // Try to query user_2's restaurants
    const restaurants = await prisma.restaurant.findMany({
      where: { userId: 'user-2' }
    });

    // RLS should block this
    expect(restaurants).toHaveLength(0);
  });

  it('should allow user_1 to see own restaurants', async () => {
    // Set session as user_1
    await setRLSContext('user-1');

    // Query own restaurants (already created in setup)
    const restaurants = await prisma.restaurant.findMany({
      where: { userId: 'user-1' }
    });

    // Should return own restaurants
    expect(restaurants.length).toBeGreaterThan(0);
  });
});
```

