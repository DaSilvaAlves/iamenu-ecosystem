# RLS Design Matrix - iaMenu Ecosystem
**Technical Debt Resolution - Sprint 1, Task 1.1.1**

**Created:** 2026-02-08
**Author:** @dev (Dex)
**Status:** In Progress

---

## 📊 RLS Policy Matrix

### Community Schema

#### 1. posts table
| Aspecto | Detalhe |
|---------|---------|
| **Current State** | ❌ No RLS |
| **Access Pattern** | User owns posts + can see group posts |
| **RLS Policy** | `auth.uid() = author_id OR group_id in user's groups` |
| **Severity** | 🔴 CRITICAL - High volume public data |
| **Test Cases** | ✅ User sees own posts ✅ User doesn't see private posts ✅ Group members see group posts |

**SQL Policy:**
```sql
ALTER TABLE community.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY posts_user_owns_policy ON community.posts
  FOR ALL
  USING (auth.uid() = "authorId");

CREATE POLICY posts_group_access_policy ON community.posts
  FOR SELECT
  USING (
    "groupId" IS NULL OR
    "groupId" IN (
      SELECT "groupId" FROM community.group_memberships
      WHERE "userId" = auth.uid()
    )
  );
```

---

#### 2. comments table
| Aspecto | Detalhe |
|---------|---------|
| **Current State** | ❌ No RLS |
| **Access Pattern** | User owns comments + can see comments on visible posts |
| **RLS Policy** | `auth.uid() = author_id OR post_id visible to user` |
| **Severity** | 🔴 CRITICAL - Nested access |
| **Test Cases** | ✅ User sees own comments ✅ User doesn't see comments on hidden posts |

**SQL Policy:**
```sql
ALTER TABLE community.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY comments_user_owns_policy ON community.comments
  FOR ALL
  USING (auth.uid() = "authorId");

CREATE POLICY comments_post_visible_policy ON community.comments
  FOR SELECT
  USING (
    "postId" IN (
      SELECT id FROM community.posts WHERE
      "authorId" = auth.uid() OR
      "groupId" IN (
        SELECT "groupId" FROM community.group_memberships
        WHERE "userId" = auth.uid()
      )
    )
  );
```

---

#### 3. profiles table
| Aspecto | Detalhe |
|---------|---------|
| **Current State** | ⚠️ Partial RLS (public profiles) |
| **Access Pattern** | User owns profile + can see public profiles |
| **RLS Policy** | `auth.uid() = userId OR public profile` |
| **Severity** | 🟡 MEDIUM - Contains private restaurant info |
| **Test Cases** | ✅ User sees own full profile ✅ User sees partial public profile |

**SQL Policy:**
```sql
ALTER TABLE community.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_user_owns_policy ON community.profiles
  FOR ALL
  USING (auth.uid() = "userId");

CREATE POLICY profiles_public_policy ON community.profiles
  FOR SELECT
  USING ("isPublicProfile" = true);
```

---

### Marketplace Schema

#### 4. quotes table
| Aspecto | Detalhe |
|---------|---------|
| **Current State** | ❌ No RLS |
| **Access Pattern** | Supplier owns quotes + buyer sees own requests |
| **RLS Policy** | `auth.uid() = supplier_id OR auth.uid() = buyer_id` |
| **Severity** | 🔴 CRITICAL - Business confidential |
| **Test Cases** | ✅ Supplier A doesn't see Supplier B's quotes ✅ Buyer sees only own requests |

**SQL Policy:**
```sql
ALTER TABLE marketplace.quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY quotes_supplier_owns_policy ON marketplace.quotes
  FOR ALL
  USING (
    "supplierId" IN (
      SELECT id FROM marketplace.suppliers
      WHERE "userId" = auth.uid()
    )
  );

CREATE POLICY quotes_buyer_sees_own_policy ON marketplace.quotes
  FOR SELECT
  USING ("quoteRequestId" IN (
    SELECT id FROM marketplace.quote_requests
    WHERE "buyerId" = auth.uid()
  ));
```

---

#### 5. suppliers table
| Aspecto | Detalhe |
|---------|---------|
| **Current State** | ⚠️ Partial RLS (public profiles) |
| **Access Pattern** | Supplier owns profile + all can see public profile |
| **RLS Policy** | `auth.uid() owns OR public profile` |
| **Severity** | 🟡 MEDIUM - Contains private settings |
| **Test Cases** | ✅ Supplier sees own full profile ✅ Others see public profile only |

**SQL Policy:**
```sql
ALTER TABLE marketplace.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY suppliers_user_owns_policy ON marketplace.suppliers
  FOR ALL
  USING ("userId" = auth.uid());

CREATE POLICY suppliers_public_policy ON marketplace.suppliers
  FOR SELECT
  USING (true); -- All can see (but app filters private fields)
```

---

### Academy Schema

#### 6. enrollments table
| Aspecto | Detalhe |
|---------|---------|
| **Current State** | ❌ No RLS |
| **Access Pattern** | Student owns enrollment + instructor sees students |
| **RLS Policy** | `auth.uid() = student_id OR instructor of course` |
| **Severity** | 🟡 MEDIUM - Progress data |
| **Test Cases** | ✅ Student sees own enrollment ✅ Instructor sees students in course |

**SQL Policy:**
```sql
ALTER TABLE academy.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY enrollments_student_policy ON academy.enrollments
  FOR ALL
  USING (auth.uid() = "studentId");

CREATE POLICY enrollments_instructor_policy ON academy.enrollments
  FOR SELECT
  USING ("courseId" IN (
    SELECT id FROM academy.courses
    WHERE "instructorId" = auth.uid()
  ));
```

---

## 📋 Implementation Checklist

### Phase 1: Community Schema
- [ ] Audit current permissions
- [ ] Write posts RLS policy
- [ ] Write comments RLS policy
- [ ] Write profiles RLS policy
- [ ] Test community policies
- [ ] Deploy to staging

### Phase 2: Marketplace Schema
- [ ] Audit current permissions
- [ ] Write quotes RLS policy
- [ ] Write suppliers RLS policy
- [ ] Test marketplace policies
- [ ] Deploy to staging

### Phase 3: Academy Schema
- [ ] Audit current permissions
- [ ] Write enrollments RLS policy
- [ ] Test academy policies
- [ ] Deploy to staging

### Phase 4: Validation
- [ ] Run full test suite
- [ ] Load testing (1000 users)
- [ ] Performance benchmark
- [ ] Manual verification
- [ ] CodeRabbit review
- [ ] Deploy to production

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test 1: User sees own posts
async function testUserSeesOwnPosts() {
  const userId = 'test-user-123';
  const posts = await getPostsAsUser(userId);
  expect(posts.every(p => p.authorId === userId)).toBe(true);
}

// Test 2: User doesn't see other's posts
async function testUserDoesntSeeOthersPosts() {
  const userId = 'test-user-123';
  const otherId = 'other-user-456';
  const posts = await getPostsAsUser(userId);
  expect(posts.some(p => p.authorId === otherId)).toBe(false);
}

// Test 3: Group members see group posts
async function testGroupMembersSeeGroupPosts() {
  const userId = 'test-user-123';
  const groupId = 'test-group-789';

  // Add user to group
  await addUserToGroup(userId, groupId);

  // Create group post
  const post = await createPost({
    groupId,
    authorId: 'other-user'
  });

  // Verify user sees it
  const posts = await getPostsAsUser(userId);
  expect(posts.some(p => p.id === post.id)).toBe(true);
}
```

### Load Testing
```bash
# 1000 concurrent users querying posts
k6 run --vus 1000 --duration 30s rls-load-test.js

# Expected: <5% performance regression
# Monitor: CPU, Memory, Query time
```

### Manual Verification
1. Login as User A
2. Create a private post
3. Logout, login as User B
4. Verify User B cannot see User A's post
5. Create a group, add User B
6. Create group post as User A
7. Verify User B can see group post

---

## 📊 Current Status

| Table | RLS Status | Priority | Owner | ETA |
|-------|-----------|----------|-------|-----|
| posts | ❌ Not Started | 🔴 CRITICAL | @dev | Tue |
| comments | ❌ Not Started | 🔴 CRITICAL | @dev | Tue |
| profiles | ⚠️ Partial | 🟡 HIGH | @dev | Wed |
| quotes | ❌ Not Started | 🔴 CRITICAL | @dev | Wed |
| suppliers | ⚠️ Partial | 🟡 MEDIUM | @dev | Wed |
| enrollments | ❌ Not Started | 🟡 MEDIUM | @dev | Thu |

---

## 🎯 Next Steps

1. **Review this matrix** with @architect
2. **Implement policies** in order of priority
3. **Write tests** for each policy
4. **Run load tests** to verify performance
5. **CodeRabbit review** before deployment
6. **Deploy to staging** with 24h monitoring
7. **Production deployment** after validation

---

**Task 1.1.1 Status:** In Progress ✍️
**Next:** Implement policies (Task 1.1.2)
