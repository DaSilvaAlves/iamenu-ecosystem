# TD-006: Create Marketplace Test Suite

**Priority:** P0 - BLOCKER
**Estimated Hours:** 7-8h
**Owner:** @qa
**Sprint:** Tech Debt P0
**Status:** Ready

---

## Story Statement

**As a** development team making changes to Marketplace,
**I want** a comprehensive test suite for the Marketplace service,
**So that** we can safely make P0 database changes without breaking functionality.

---

## Problem Description

The Marketplace service currently has **0% test coverage**. This is a critical blocker for:
- TD-003 (Decimal Precision) - Need to verify price calculations
- TD-004 (Cascade Rules) - Need to verify delete behavior

Without tests, we cannot safely verify that schema changes don't break existing functionality.

### Current Test Coverage

| Service | Coverage | Status |
|---------|----------|--------|
| Community | ~40% | Adequate |
| **Marketplace** | **0%** | **CRITICAL** |
| Academy | ~15% | Low |
| Business | ~15% | Low |

---

## Acceptance Criteria

- [ ] **AC1:** Health check test passing
- [ ] **AC2:** Supplier CRUD tests passing
- [ ] **AC3:** RFQ/Quote flow tests passing
- [ ] **AC4:** Pricing calculation tests passing (for TD-003)
- [ ] **AC5:** Cascade delete tests passing (for TD-004)
- [ ] **AC6:** Tests run successfully in CI (`npm run test:marketplace`)
- [ ] **AC7:** Minimum 30% coverage on critical paths

---

## Technical Approach

### Test Framework

- **Framework:** Jest with ts-jest
- **Database:** Test database (separate from dev/prod)
- **Pattern:** Integration tests with Prisma

### Test Structure

```
services/marketplace/tests/
├── setup.ts              # Test database setup
├── health.test.ts        # Health check endpoint
├── suppliers.test.ts     # Supplier CRUD
├── rfq.test.ts           # RFQ/Quote workflow
├── pricing.test.ts       # Price calculations
└── cascades.test.ts      # Delete cascade behavior
```

---

## Tasks

### Phase 1: Test Infrastructure (1h)
- [ ] **Task 1:** Create `tests/` directory in marketplace service
- [ ] **Task 2:** Create `tests/setup.ts` with test database config
- [ ] **Task 3:** Add test script to `package.json`
- [ ] **Task 4:** Create test utilities (factory functions, cleanup)

### Phase 2: Health Check Test (30min)
- [ ] **Task 5:** Create `tests/health.test.ts`
- [ ] **Task 6:** Test `GET /health` returns 200
- [ ] **Task 7:** Test `GET /api/v1/marketplace` returns API info

### Phase 3: Supplier Tests (2h)
- [ ] **Task 8:** Create `tests/suppliers.test.ts`
- [ ] **Task 9:** Test: Create supplier
- [ ] **Task 10:** Test: Get supplier by ID
- [ ] **Task 11:** Test: Update supplier
- [ ] **Task 12:** Test: Delete supplier (no dependencies)
- [ ] **Task 13:** Test: List suppliers with pagination
- [ ] **Task 14:** Test: Filter suppliers by category

### Phase 4: RFQ/Quote Tests (2h)
- [ ] **Task 15:** Create `tests/rfq.test.ts`
- [ ] **Task 16:** Test: Create quote request
- [ ] **Task 17:** Test: Supplier submits quote
- [ ] **Task 18:** Test: Accept quote
- [ ] **Task 19:** Test: Reject quote
- [ ] **Task 20:** Test: RFQ with multiple suppliers

### Phase 5: Pricing Tests (1h)
- [ ] **Task 21:** Create `tests/pricing.test.ts`
- [ ] **Task 22:** Test: Price with 4 decimal precision
- [ ] **Task 23:** Test: Price calculation (sum, multiply)
- [ ] **Task 24:** Test: Price rounding behavior
- [ ] **Task 25:** Test: Price history creation

### Phase 6: Cascade Tests (1h)
- [ ] **Task 26:** Create `tests/cascades.test.ts`
- [ ] **Task 27:** Test: Delete supplier cascades price history
- [ ] **Task 28:** Test: Delete product cascades price history
- [ ] **Task 29:** Test: Delete collective bargain cascades adhesions
- [ ] **Task 30:** Verify no orphan records after delete

---

## Test Examples

### Health Check Test

```typescript
// tests/health.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Health Check', () => {
  it('GET /health should return 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
```

### Supplier CRUD Test

```typescript
// tests/suppliers.test.ts
describe('Supplier CRUD', () => {
  it('should create a supplier', async () => {
    const supplier = {
      name: 'Test Supplier',
      email: 'test@supplier.com',
      categories: ['vegetables', 'fruits'],
    };

    const response = await request(app)
      .post('/api/v1/marketplace/suppliers')
      .set('Authorization', `Bearer ${testToken}`)
      .send(supplier);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(supplier.name);
  });
});
```

### Pricing Precision Test

```typescript
// tests/pricing.test.ts
describe('Pricing Precision', () => {
  it('should maintain 4 decimal precision', async () => {
    const product = await createTestProduct({ price: 10.9999 });

    const fetched = await prisma.product.findUnique({
      where: { id: product.id }
    });

    expect(fetched.price.toString()).toBe('10.9999');
  });

  it('should calculate correctly', async () => {
    const price1 = new Decimal('10.999');
    const price2 = new Decimal('0.001');
    const sum = price1.plus(price2);

    expect(sum.toString()).toBe('11');
  });
});
```

### Cascade Test

```typescript
// tests/cascades.test.ts
describe('Delete Cascades', () => {
  it('should cascade delete price history when product deleted', async () => {
    const product = await createTestProduct();
    await createTestPriceHistory({ productId: product.id });

    // Verify price history exists
    let history = await prisma.priceHistory.findMany({
      where: { productId: product.id }
    });
    expect(history.length).toBeGreaterThan(0);

    // Delete product
    await prisma.product.delete({ where: { id: product.id } });

    // Verify price history cascaded
    history = await prisma.priceHistory.findMany({
      where: { productId: product.id }
    });
    expect(history.length).toBe(0);
  });
});
```

---

## Definition of Done

- [ ] All test files created in `services/marketplace/tests/`
- [ ] `npm run test:marketplace` passes
- [ ] Health check test passing
- [ ] Supplier CRUD tests passing
- [ ] RFQ flow tests passing
- [ ] Pricing tests passing
- [ ] Cascade tests passing
- [ ] Tests added to CI pipeline

---

## References

- **Source:** `docs/prd/technical-debt-FINAL.md` Section 11 (TECH-DEBT-006)
- **Service:** `services/marketplace/`
- **Existing Tests:** `services/community/tests/` (reference pattern)
- **Jest Config:** `services/marketplace/jest.config.js`

---

**Created:** 2026-02-03
**Workflow:** Brownfield Tech Debt Sprint
