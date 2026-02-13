# RLS Testing Checklist

**Status:** 🟡 In Progress
**Last Updated:** 2026-02-13
**Tester:** @data-engineer (Dara)

---

## 📋 Phase 1: Baseline & Setup

### Snapshots & Backups
- [x] Create baseline snapshot (rls-baseline-20260213.sql)
- [x] Document RLS policies in place
- [x] Create rollback procedures
- [ ] Test rollback (in disaster scenario only)

### Validator Setup
- [x] Create RLSValidator class (rls-validator.ts)
- [x] Implement policy enumeration
- [x] Implement RLS enforcement tests
- [ ] Run validator on all schemas
- [ ] Generate validation report

---

## 📋 Phase 2: Positive Tests (User CAN access data)

### Community Schema - Posts
- [ ] User can see own posts
- [ ] User can see public posts (groupId IS NULL)
- [ ] User can see posts from groups they're in
- [ ] User can create posts (authorId = current user)
- [ ] User can update own posts
- [ ] User can delete own posts

### Community Schema - Comments
- [ ] User can see comments on posts they can view
- [ ] User can create comments (authorId = current user)
- [ ] User can update own comments
- [ ] User can delete own comments

### Community Schema - Notifications (STRICT)
- [ ] User can only see own notifications
- [ ] User cannot see other users' notifications

### Marketplace Schema - Quotes
- [ ] Supplier can see own quotes
- [ ] Buyer can see quotes for own requests
- [ ] Both can create/update/delete within policy

### Marketplace Schema - Suppliers
- [ ] Supplier can see own full profile
- [ ] All authenticated users can see public supplier info

### Academy Schema - Enrollments
- [ ] User can see own enrollments
- [ ] User can see own certificates

### Business Schema - Orders
- [ ] Restaurant owner can see own orders
- [ ] Staff can see orders for their restaurant

---

## 📋 Phase 3: Negative Tests (User CANNOT access data)

### Community Schema - Posts
- [ ] Alice cannot see Bob's private posts
- [ ] Alice cannot see Bob's group posts (unless in group)
- [ ] Bob cannot update Alice's posts (RLS blocks)
- [ ] Bob cannot delete Alice's posts (RLS blocks)

### Community Schema - Notifications (STRICT)
- [ ] Bob cannot access Alice's notifications
- [ ] Database enforces isolation

### Community Schema - RefreshTokens (STRICT)
- [ ] Bob cannot see Alice's refresh tokens
- [ ] Critical security test - must pass

### Marketplace Schema - Quotes
- [ ] Different supplier cannot see other supplier's quotes
- [ ] Different buyer cannot see other buyer's requests

### Marketplace Schema - Suppliers
- [ ] Supplier cannot access sensitive data of other suppliers
- [ ] Application filters additional sensitive fields

---

## 📋 Phase 4: Group & Access Control Tests

### Group Membership
- [ ] User in group can see group posts
- [ ] User NOT in group cannot see private group posts
- [ ] Group creation - only creator can update
- [ ] Group membership - users can only join (can't add others)

### Public vs Private
- [ ] Public posts visible to all
- [ ] Private posts only to members
- [ ] Public groups appear in search
- [ ] Private groups hidden from non-members

---

## 📋 Phase 5: Performance Tests

### Query Performance
- [ ] RLS doesn't cause N+1 queries
- [ ] Indexes used: user_id, group_id, etc.
- [ ] Join on group_memberships is efficient
- [ ] No full table scans with RLS

### Load Test
- [ ] Query time < 100ms for typical user (< 500 posts)
- [ ] Query time < 500ms for power user (1000+ posts)
- [ ] Bulk operations don't timeout

---

## 📋 Phase 6: Security Edge Cases

### Admin/System Operations
- [ ] Service role can bypass RLS (when needed)
- [ ] Admin operations use service role appropriately
- [ ] Audit logs capture operations

### Token & Session Handling
- [ ] Refresh tokens properly isolated
- [ ] Session timeout doesn't leave app.current_user_id set
- [ ] Multiple concurrent sessions per user work correctly

### Data Type Handling
- [ ] UUIDs in RLS conditions work correctly
- [ ] String user IDs match properly
- [ ] NULL values handled (groupId IS NULL for public)

---

## 📋 Phase 7: Schema-Specific Tests

### Community Schema (16 tables with RLS)
- [ ] posts (4 policies)
- [ ] comments (4 policies)
- [ ] groups (2 policies)
- [ ] group_memberships (2 policies)
- [ ] notifications (1 STRICT policy)
- [ ] reactions (allow all)
- [ ] followers (2 policies)
- [ ] refresh_tokens (1 STRICT policy)
- [ ] profiles (public view)
- [ ] user_points (own only)
- [ ] points_history (own only)
- [ ] user_streaks (own only)
- [ ] user_warnings (own only)
- [ ] moderation_logs (admin only)
- [ ] user_bans (own only)
- [ ] reports (owner or admin)

### Marketplace Schema
- [ ] quotes (2 policies)
- [ ] suppliers (2 policies)
- [ ] quote_requests
- [ ] reviews
- [ ] products

### Academy Schema
- [ ] enrollments (user isolation)
- [ ] certificates (user isolation)
- [ ] courses (public view)

### Business Schema
- [ ] orders (restaurant isolation)
- [ ] order_items
- [ ] daily_stats (restaurant isolation)

---

## 📋 Phase 8: Documentation & Validation

### Documentation
- [ ] RLS policies documented in rls-policy-overview.md
- [ ] Policies linked to acceptance criteria
- [ ] Admin guide for RLS bypass (when needed)

### CodeRabbit Review
- [ ] SQL injection risks reviewed
- [ ] RLS bypass risks assessed
- [ ] Performance implications checked
- [ ] 0 CRITICAL issues
- [ ] All HIGH issues resolved

### Final Validation
- [ ] All tests passing
- [ ] Performance metrics acceptable
- [ ] Security sign-off
- [ ] Ready for deployment

---

## Test Execution Log

### Run 1: Initial Setup
- **Date:** 2026-02-13
- **Status:** ✅ Created test files and validator
- **Next:** Execute tests

### Run 2: [Pending]
- **Date:** [TBD]
- **Status:** [TBD]
- **Notes:** [TBD]

---

## 🎯 Definition of Done

**All boxes must be ☑️ checked:**
- [ ] All positive tests passing
- [ ] All negative tests passing
- [ ] No performance regression
- [ ] Security audit passed
- [ ] CodeRabbit review: 0 CRITICAL, 0 HIGH
- [ ] Documentation complete
- [ ] Story marked Ready for Review

---

## 🚀 Next Steps

1. **Execute RLS Validator** on all schemas
2. **Run Integration Tests** (rls.integration.test.ts)
3. **Performance Profiling** with actual queries
4. **CodeRabbit Review** of RLS migrations
5. **Final Security Audit** before deployment

**Owner:** @data-engineer (Dara)
**Timeline:** Target completion within 16h (Story 2.1 estimate)
