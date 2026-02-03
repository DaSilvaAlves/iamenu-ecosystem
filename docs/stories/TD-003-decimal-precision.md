# TD-003: Add Decimal Precision to Marketplace

**Priority:** P0 - CRITICAL
**Estimated Hours:** 2-3h
**Owner:** @data-engineer
**Sprint:** Tech Debt P0
**Status:** In Progress (Schema ready, migration pending)

---

## Story Statement

**As a** Marketplace user calculating prices and totals,
**I want** proper decimal precision in all financial fields,
**So that** price calculations are accurate and don't cause rounding errors.

---

## Problem Description

The Marketplace Prisma schema uses `Decimal` type without explicit precision, which can cause floating-point errors in financial calculations. This is a critical issue for any e-commerce functionality.

### Current State

```prisma
// Current (problematic)
model Supplier {
  minOrder   Decimal?
  ratingAvg  Decimal?
}

model SupplierProduct {
  price      Decimal
}
```

### Fields Affected

| Model | Field | Current | Should Be |
|-------|-------|---------|-----------|
| Supplier | minOrder | `Decimal` | `Decimal @db.Decimal(12,4)` |
| Supplier | ratingAvg | `Decimal` | `Decimal @db.Decimal(3,2)` |
| SupplierProduct | price | `Decimal` | `Decimal @db.Decimal(12,4)` |
| CollectiveBargain | targetPrice | `Decimal` | `Decimal @db.Decimal(12,4)` |
| BargainAdhesion | committedQuantity | `Decimal` | `Decimal @db.Decimal(12,4)` |
| PriceHistory | price | `Decimal` | `Decimal @db.Decimal(12,4)` |

---

## Acceptance Criteria

- [x] **AC1:** All price fields use `@db.Decimal(12,4)` precision
- [x] **AC2:** Rating field uses `@db.Decimal(3,2)` precision (0.00 - 5.00)
- [ ] **AC3:** Prisma client regenerated (`npx prisma generate`)
- [ ] **AC4:** Migration applied successfully without data loss
- [ ] **AC5:** Existing price data preserved correctly
- [ ] **AC6:** Price calculations verified:
  - `10.999 + 0.001 = 11.000`
  - `99.99 * 0.08 (tax) = 7.9992`

---

## Technical Approach

### Schema Changes

```prisma
// services/marketplace/prisma/schema.prisma

model Supplier {
  // ... other fields
  minOrder      Decimal?  @db.Decimal(12,4)
  ratingAvg     Decimal?  @db.Decimal(3,2)
}

model SupplierProduct {
  // ... other fields
  price         Decimal   @db.Decimal(12,4)
}

model CollectiveBargain {
  // ... other fields
  targetPrice   Decimal?  @db.Decimal(12,4)
}

model BargainAdhesion {
  // ... other fields
  committedQuantity Decimal @db.Decimal(12,4)
}

model PriceHistory {
  // ... other fields
  price         Decimal   @db.Decimal(12,4)
}
```

### Precision Choices

| Type | Precision | Range | Use Case |
|------|-----------|-------|----------|
| `Decimal(12,4)` | 12 digits, 4 decimal | Up to 99,999,999.9999 | Prices, quantities |
| `Decimal(3,2)` | 3 digits, 2 decimal | 0.00 - 9.99 | Ratings (1.00-5.00) |

---

## Tasks

- [x] **Task 1:** Backup current price data (query existing values)
- [x] **Task 2:** Update `services/marketplace/prisma/schema.prisma` with precision annotations
- [ ] **Task 3:** Create migration: `npx prisma migrate dev --name add_decimal_precision`
- [ ] **Task 4:** Regenerate Prisma client: `npx prisma generate`
- [ ] **Task 5:** Verify migration applied without errors
- [ ] **Task 6:** Query price data to verify no data loss
- [ ] **Task 7:** Test price calculations in API
- [ ] **Task 8:** Run existing Marketplace tests (if any)

---

## Test Plan

### Pre-Migration

```sql
-- Document current values
SELECT id, price FROM marketplace.supplier_products LIMIT 10;
SELECT id, minOrder, ratingAvg FROM marketplace.suppliers LIMIT 10;
```

### Post-Migration

```sql
-- Verify same values
SELECT id, price FROM marketplace.supplier_products LIMIT 10;
SELECT id, minOrder, ratingAvg FROM marketplace.suppliers LIMIT 10;

-- Verify precision
SELECT price, price + 0.0001 as test FROM marketplace.supplier_products LIMIT 1;
```

### API Test

```javascript
// Test calculation precision
const price = 10.999;
const addition = 0.001;
const result = price + addition;
console.assert(result === 11.000, 'Precision test failed');
```

---

## Rollback Plan

This migration is **additive** (only adds precision to existing columns). No rollback needed unless data corruption occurs.

If issues arise:
1. Check PostgreSQL logs for migration errors
2. Verify column types: `\d+ marketplace.supplier_products`
3. Precision can be increased but not decreased without data loss

---

## Definition of Done

- [x] Schema updated with precision annotations
- [ ] Migration created and applied
- [ ] Prisma client regenerated
- [ ] Existing data verified intact
- [ ] Price calculations tested
- [ ] No errors in service logs

---

## References

- **Source:** `docs/prd/technical-debt-FINAL.md` Section 11 (TECH-DEBT-003)
- **Schema:** `services/marketplace/prisma/schema.prisma`
- **Audit:** `docs/architecture/database-schema.md` Section 3

---

**Created:** 2026-02-03
**Workflow:** Brownfield Tech Debt Sprint
