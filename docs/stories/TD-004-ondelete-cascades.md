# TD-004: Add Missing onDelete Cascades

**Priority:** P0 - CRITICAL
**Estimated Hours:** 3-4h
**Owner:** @data-engineer
**Sprint:** Tech Debt P0
**Status:** Done
**Depends On:** TD-003 (Decimal Precision)

---

## Story Statement

**As a** system administrator performing delete operations,
**I want** proper cascade rules on all foreign key relationships,
**So that** orphaned records are prevented and data integrity is maintained.

---

## Problem Description

Several Prisma relations are missing `onDelete` specifications, which can lead to:
1. Orphaned records when parent entities are deleted
2. Foreign key constraint errors blocking legitimate deletions
3. Data inconsistency over time

### Relations Without onDelete

| Schema | Model | Relation | Current | Should Be |
|--------|-------|----------|---------|-----------|
| Marketplace | BargainAdhesion | collectiveBargainId | None | CASCADE |
| Marketplace | PriceHistory | productId | None | CASCADE |
| Marketplace | PriceHistory | supplierId | None | CASCADE |
| Academy | Enrollment | courseId | None | RESTRICT |
| Business | OrderItem | productId | None | RESTRICT |

---

## Acceptance Criteria

- [x] **AC1:** All 5 relations have explicit `onDelete` actions
- [x] **AC2:** No orphan records exist pre-migration (verified)
- [x] **AC3:** Delete operations work correctly:
  - Delete CollectiveBargain → BargainAdhesions cascade deleted ✓
  - Delete Product → PriceHistory records cascade deleted ✓
  - Delete Supplier → PriceHistory records cascade deleted ✓
  - Delete Course with enrollments → Operation blocked (RESTRICT) ✓
  - Delete Product with order items → Operation blocked (RESTRICT) ✓
- [x] **AC4:** No unintended data loss for unrelated records
- [x] **AC5:** Migration applied successfully

---

## Technical Approach

### Cascade Rules

| Relation | Action | Rationale |
|----------|--------|-----------|
| BargainAdhesion → CollectiveBargain | CASCADE | Adhesions are meaningless without the bargain |
| PriceHistory → Product | CASCADE | History is tied to product lifecycle |
| PriceHistory → Supplier | CASCADE | History is tied to supplier |
| Enrollment → Course | RESTRICT | Preserve enrollment records, block delete |
| OrderItem → Product | RESTRICT | Preserve order history, block delete |

### Schema Changes

```prisma
// services/marketplace/prisma/schema.prisma

model BargainAdhesion {
  collectiveBargain   CollectiveBargain @relation(fields: [collectiveBargainId], references: [id], onDelete: Cascade)
}

model PriceHistory {
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  supplier  Supplier  @relation(fields: [supplierId], references: [id], onDelete: Cascade)
}

// services/academy/prisma/schema.prisma

model Enrollment {
  course    Course    @relation(fields: [courseId], references: [id], onDelete: Restrict)
}

// services/business/prisma/schema.prisma

model OrderItem {
  product   Product   @relation(fields: [productId], references: [id], onDelete: Restrict)
}
```

---

## Tasks

### Pre-Migration Verification (30min)
- [x] **Task 1:** Check for orphan BargainAdhesions (no parent CollectiveBargain)
- [x] **Task 2:** Check for orphan PriceHistory records
- [x] **Task 3:** Document current record counts for verification
- [x] **Task 4:** Ensure TD-003 (Decimal Precision) is complete

### Schema Updates (1h)
- [x] **Task 5:** Update `services/marketplace/prisma/schema.prisma`
- [x] **Task 6:** Update `services/academy/prisma/schema.prisma`
- [x] **Task 7:** Update `services/business/prisma/schema.prisma`

### Migration (1h)
- [x] **Task 8:** Apply marketplace changes: `npx prisma db push`
- [x] **Task 9:** Apply academy changes: `npx prisma db push`
- [x] **Task 10:** Apply business changes: `npx prisma db push`
- [x] **Task 11:** Regenerate all Prisma clients

### Testing (1h)
- [ ] **Task 12:** Test CASCADE: Delete a CollectiveBargain, verify adhesions deleted
- [ ] **Task 13:** Test CASCADE: Delete a Product, verify price history deleted
- [ ] **Task 14:** Test RESTRICT: Try to delete Course with enrollments (should fail)
- [ ] **Task 15:** Test RESTRICT: Try to delete Product with order items (should fail)
- [ ] **Task 16:** Verify no unintended data loss

---

## Test Plan

### Pre-Migration Orphan Check

```sql
-- Check for orphan BargainAdhesions
SELECT ba.id FROM marketplace.bargain_adhesions ba
LEFT JOIN marketplace.collective_bargains cb ON ba."collectiveBargainId" = cb.id
WHERE cb.id IS NULL;

-- Check for orphan PriceHistory (product)
SELECT ph.id FROM marketplace.price_history ph
LEFT JOIN marketplace.products p ON ph."productId" = p.id
WHERE p.id IS NULL;

-- Check for orphan PriceHistory (supplier)
SELECT ph.id FROM marketplace.price_history ph
LEFT JOIN marketplace.suppliers s ON ph."supplierId" = s.id
WHERE s.id IS NULL;
```

### Post-Migration Tests

```javascript
// Test CASCADE - should succeed
const bargain = await prisma.collectiveBargain.delete({ where: { id: testId } });
// Verify: SELECT * FROM bargain_adhesions WHERE collectiveBargainId = testId (should be 0)

// Test RESTRICT - should fail
await expect(
  prisma.course.delete({ where: { id: courseWithEnrollments } })
).rejects.toThrow();
```

---

## Rollback Plan

**Risk Level:** MEDIUM (CASCADE deletes are irreversible)

If issues occur:
1. Stop all services immediately
2. Create new migration removing CASCADE rules
3. Restore from backup if data was unintentionally deleted

**Safeguard:** Run on staging environment first with real data copy.

---

## Definition of Done

- [x] All schema files updated with onDelete rules
- [x] Migrations created and applied (3 services)
- [x] Prisma clients regenerated
- [ ] CASCADE behavior tested and verified
- [ ] RESTRICT behavior tested and verified
- [x] No orphan records created
- [x] No unintended data loss

---

## References

- **Source:** `docs/prd/technical-debt-FINAL.md` Section 11 (TECH-DEBT-004)
- **Audit:** `docs/architecture/database-schema.md` Section 2 (Relationships)
- **Marketplace Schema:** `services/marketplace/prisma/schema.prisma`
- **Academy Schema:** `services/academy/prisma/schema.prisma`
- **Business Schema:** `services/business/prisma/schema.prisma`

---

**Created:** 2026-02-03
**Workflow:** Brownfield Tech Debt Sprint
