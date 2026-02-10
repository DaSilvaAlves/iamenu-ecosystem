# RLS Testing Strategy & Test Plan

**Created:** 2026-02-10
**Objective:** Ensure zero data leakage via RLS policies
**Scope:** All 4 services, 25+ RLS policies

---

## Testing Philosophy

**Goal:** Catch RLS bypass vulnerabilities before production

**Three-Layer Testing:**
1. **Unit Tests:** Each RLS policy in isolation
2. **Integration Tests:** Cross-policy interactions
3. **Security Tests:** Malicious attack scenarios

---

## Community Service Test Plan

### Test Suite 1: Posts RLS

```typescript
describe('RLS: Posts - Data Isolation', () => {
  const user1 = 'user-1';
  const user2 = 'user-2';
  const group1 = 'group-1';

  beforeEach(async () => {
    // Create test data
    await prisma.post.create({
      data: {
        id: 'post-user1',
        authorId: user1,
        title: 'User 1 Post',
        body: 'Private to user 1',
        groupId: null, // Private
        status: 'active'
      }
    });

    await prisma.post.create({
      data: {
        id: 'post-group1',
        authorId: user1,
        title: 'Group Post',
        body: 'Group 1 post',
        groupId: group1,
        status: 'active'
      }
    });
  });

  describe('User cannot see other users private posts', () => {
    it('SECURITY: user-2 cannot query user-1 private posts', async () => {
      await setRLSContext(user2);
      const posts = await prisma.post.findMany({
        where: { authorId: user1, groupId: null }
      });
      expect(posts).toHaveLength(0); // RLS blocked
    });
  });

  describe('User can see group posts', () => {
    it('user-2 CAN see posts in groups they joined', async () => {
      // Add user-2 to group-1
      await prisma.groupMembership.create({
        data: { groupId: group1, userId: user2 }
      });

      await setRLSContext(user2);
      const posts = await prisma.post.findMany({
        where: { groupId: group1 }
      });
      expect(posts.length).toBeGreaterThan(0); // RLS allows
    });
  });

  describe('User can edit only own posts', () => {
    it('user-2 CANNOT update user-1 post', async () => {
      await setRLSContext(user2);

      const result = await prisma.post.updateMany({
        where: { id: 'post-user1' },
        data: { title: 'Hacked!' }
      });
      expect(result.count).toBe(0); // RLS blocked update
    });
  });
});
```

### Test Suite 2: Notifications (STRICT isolation)

```typescript
describe('RLS: Notifications - STRICT User Isolation', () => {
  it('CRITICAL: user-1 cannot see user-2 notifications', async () => {
    // Create notifications for both users
    const notif1 = await prisma.notification.create({
      data: {
        userId: 'user-1',
        type: 'NEW_POST',
        title: 'New post from friend',
        read: false
      }
    });

    const notif2 = await prisma.notification.create({
      data: {
        userId: 'user-2',
        type: 'NEW_COMMENT',
        title: 'Comment on your post',
        read: false
      }
    });

    // user-1 queries
    await setRLSContext('user-1');
    let results = await prisma.notification.findMany();
    expect(results.map(n => n.id)).toContain(notif1.id);
    expect(results.map(n => n.id)).not.toContain(notif2.id);

    // user-2 queries
    await setRLSContext('user-2');
    results = await prisma.notification.findMany();
    expect(results.map(n => n.id)).toContain(notif2.id);
    expect(results.map(n => n.id)).not.toContain(notif1.id);
  });
});
```

---

## Marketplace Service Test Plan

### Test Suite 1: Supplier/Buyer Separation

```typescript
describe('RLS: Quotes - Supplier vs Buyer Visibility', () => {
  const supplier1 = 'supplier-1';
  const buyer1 = 'buyer-1';
  const buyer2 = 'buyer-2';

  it('SECURITY: Buyer1 cannot see quotes from Buyer2 requests', async () => {
    // Buyer2 makes a quote request
    const request2 = await prisma.quoteRequest.create({
      data: {
        id: 'req-buyer2',
        restaurantId: buyer2,
        items: { products: [] },
        status: 'pending'
      }
    });

    // Supplier sends quote to buyer2
    const quote2 = await prisma.quote.create({
      data: {
        quoteRequestId: 'req-buyer2',
        supplierId: 'supplier-1',
        items: { details: [] },
        status: 'sent'
      }
    });

    // Buyer1 tries to access buyer2's quotes
    await setRLSContext(buyer1);
    const quotes = await prisma.quote.findMany({
      where: { quoteRequestId: 'req-buyer2' }
    });
    expect(quotes).toHaveLength(0); // RLS blocked
  });

  it('Supplier CAN see all quotes they sent', async () => {
    const quote = await prisma.quote.create({
      data: {
        id: 'quote-1',
        quoteRequestId: 'req-buyer1',
        supplierId: 'supplier-1',
        items: {},
        status: 'sent'
      }
    });

    await setRLSContext('supplier-1');
    const quotes = await prisma.quote.findMany({
      where: { supplierId: 'supplier-1' }
    });
    expect(quotes.map(q => q.id)).toContain('quote-1');
  });
});
```

---

## Business Service Test Plan (CRITICAL)

### Test Suite 1: Restaurant Owner Isolation

```typescript
describe('RLS: Business - STRICT Restaurant Owner Isolation', () => {
  it('CRITICAL: Restaurant owner can ONLY see own restaurant', async () => {
    // Create 2 restaurants
    const rest1 = await prisma.restaurant.create({
      data: {
        userId: 'owner-1',
        name: 'Pizza Place',
        address: 'Street 1'
      }
    });

    const rest2 = await prisma.restaurant.create({
      data: {
        userId: 'owner-2',
        name: 'Burger Place',
        address: 'Street 2'
      }
    });

    // owner-1 queries
    await setRLSContext('owner-1');
    let restaurants = await prisma.restaurant.findMany();
    expect(restaurants.map(r => r.id)).toContain(rest1.id);
    expect(restaurants.map(r => r.id)).not.toContain(rest2.id);

    // owner-2 queries
    await setRLSContext('owner-2');
    restaurants = await prisma.restaurant.findMany();
    expect(restaurants.map(r => r.id)).not.toContain(rest1.id);
    expect(restaurants.map(r => r.id)).toContain(rest2.id);
  });
});

describe('RLS: Business - Orders Isolation', () => {
  it('CRITICAL: Owner1 cannot see owner2 orders', async () => {
    const order1 = await prisma.order.create({
      data: {
        restaurantId: 'rest-1',
        total: 100,
        status: 'completed'
      }
    });

    const order2 = await prisma.order.create({
      data: {
        restaurantId: 'rest-2',
        total: 200,
        status: 'completed'
      }
    });

    // Set up RLS context
    await setRLSContext('owner-1'); // owner of rest-1

    // Query orders
    const orders = await prisma.order.findMany({
      where: { restaurantId: 'rest-2' }
    });

    expect(orders).toHaveLength(0); // RLS blocked
  });
});
```

---

## Attack Scenarios (Security Tests)

### Scenario 1: Direct UUID Guessing

```typescript
it('SECURITY: Cannot guess other UUIDs in queries', async () => {
  const user1 = 'user-1';
  const user2 = 'user-2';

  // Create post as user2
  const post = await prisma.post.create({
    data: {
      authorId: user2,
      title: 'Secret',
      body: 'Should not be visible',
      status: 'active'
    }
  });

  // user1 tries direct UUID access
  await setRLSContext(user1);
  const found = await prisma.post.findUnique({
    where: { id: post.id }
  });

  // RLS should block this
  expect(found).toBeNull();
});
```

### Scenario 2: Cross-Service Data Access

```typescript
it('SECURITY: Cannot access data from wrong service context', async () => {
  // If using shared database but separate schemas:
  // user-1 in community schema cannot affect marketplace schema
  // (Handled by schema isolation, not RLS)
});
```

---

## Test Coverage Goals

| Service | Total Tables | RLS Policies | Unit Tests | Integration | Security |
|---------|-------------|--------------|-----------|------------|----------|
| Community | 6 | 8 | 16 | 6 | 4 |
| Marketplace | 5 | 5 | 10 | 4 | 3 |
| Academy | 5 | 4 | 8 | 3 | 2 |
| Business | 4 | 4 | 8 | 3 | 4 |
| **TOTAL** | **20** | **21** | **42** | **16** | **13** |

**Target:** 100% RLS policy coverage = **71 tests minimum**

---

## CI/CD Integration

```yaml
# .github/workflows/rls-test.yml
name: RLS Security Tests
on: [push, pull_request]

jobs:
  rls-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:rls -- --coverage
      - name: RLS Coverage Report
        if: always()
        run: npm run test:rls:report
```

---

## Success Criteria

✅ Zero data leakage in any test scenario
✅ All 71+ tests PASSING
✅ Code coverage >95% for RLS policies
✅ Performance overhead <50ms per query
✅ Team trained on RLS testing patterns
✅ Documentation complete

---

## Timeline

- **Week 1:** Setup testing infrastructure + Community tests
- **Week 2:** Marketplace + Academy tests
- **Week 3:** Business tests + Security scenarios
- **Week 4:** Performance validation + Training
