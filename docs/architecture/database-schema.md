# Database Schema Audit Report - iaMenu Ecosystem

**Auditor:** @data-engineer
**Date:** 2026-02-02
**Workflow:** Brownfield Discovery Phase 2

---

## Executive Summary

The iaMenu Ecosystem uses PostgreSQL 16 with a multi-schema architecture, containing **37 models** across 4 schemas (community, marketplace, academy, business). This audit identifies several issues requiring attention including missing indexes, absent enums, cross-service referential integrity concerns, and normalization problems.

---

## 1. Schema Overview - All 37 Models Mapped

### Community Schema (16 models)
| Model | Table Name | Purpose | Primary Key |
|-------|------------|---------|-------------|
| `Post` | `posts` | Forum posts | UUID |
| `Comment` | `comments` | Nested comments | UUID |
| `Group` | `groups` | Discussion groups | UUID |
| `GroupMembership` | `group_memberships` | Member tracking | Composite (groupId, userId) |
| `Profile` | `profiles` | User profiles | userId (external) |
| `Reaction` | `reactions` | Emoji/likes | UUID |
| `Notification` | `notifications` | User notifications | UUID |
| `Report` | `reports` | Moderation reports | UUID |
| `Follower` | `followers` | Follow relationships | UUID |
| `RefreshToken` | `refresh_tokens` | JWT rotation | UUID |
| `UserPoints` | `user_points` | Gamification XP cache | userId |
| `PointsHistory` | `points_history` | XP transaction log | UUID |
| `UserStreak` | `user_streaks` | Daily activity | UUID |
| `UserWarning` | `user_warnings` | Moderation strikes | UUID |
| `ModerationLog` | `moderation_logs` | Audit trail | UUID |
| `UserBan` | `user_bans` | Ban status | userId |

### Marketplace Schema (10 models)
| Model | Table Name | Purpose | Primary Key |
|-------|------------|---------|-------------|
| `Supplier` | `suppliers` | Vendor management | UUID |
| `Review` | `reviews` | Supplier reviews | UUID |
| `Product` | `products` | Product catalog | UUID |
| `SupplierProduct` | `supplier_products` | Inventory/pricing | UUID |
| `QuoteRequest` | `quote_requests` | RFQ from restaurants | UUID |
| `Quote` | `quotes` | Supplier responses | UUID |
| `CollectiveBargain` | `collective_bargains` | Group purchasing | UUID |
| `BargainAdhesion` | `bargain_adhesions` | Bargain participation | Custom ID |
| `PriceHistory` | `price_history` | Price tracking | UUID |

### Academy Schema (5 models)
| Model | Table Name | Purpose | Primary Key |
|-------|------------|---------|-------------|
| `Course` | `courses` | Course catalog | UUID |
| `Module` | `modules` | Course sections | UUID |
| `Lesson` | `lessons` | Lesson content | UUID |
| `Enrollment` | `enrollments` | Student tracking | UUID |
| `Certificate` | `certificates` | Completion proof | UUID |

### Business Schema (6 models)
| Model | Table Name | Purpose | Primary Key |
|-------|------------|---------|-------------|
| `Restaurant` | `restaurants` | Restaurant profile | UUID |
| `RestaurantSettings` | `restaurant_settings` | Goals & targets | UUID |
| `Product` | `products` | Menu items | UUID |
| `Order` | `orders` | Sales transactions | UUID |
| `OrderItem` | `order_items` | Order line items | UUID |
| `DailyStats` | `daily_stats` | Analytics cache | UUID |

---

## 2. Relationships Analysis

### Internal Relations (Within Schema)

**Community Schema:**
```
Post -> Profile (authorId) [CASCADE]
Post -> Group (groupId) [SET NULL]
Comment -> Post (postId) [CASCADE]
Comment -> Comment (parentCommentId) [CASCADE - self-reference]
GroupMembership -> Group (groupId) [CASCADE]
```

**Marketplace Schema:**
```
Review -> Supplier (supplierId) [RESTRICT - should be CASCADE]
SupplierProduct -> Supplier (supplierId) [RESTRICT]
SupplierProduct -> Product (productId) [RESTRICT]
Quote -> QuoteRequest (quoteRequestId) [RESTRICT - should be CASCADE]
Quote -> Supplier (supplierId) [RESTRICT]
CollectiveBargain -> Supplier (supplierId) [SET NULL]
BargainAdhesion -> CollectiveBargain (collectiveBargainId) [No onDelete specified!]
PriceHistory -> Product (productId) [No onDelete specified!]
PriceHistory -> Supplier (supplierId) [No onDelete specified!]
```

**Academy Schema:**
```
Module -> Course (courseId) [CASCADE]
Lesson -> Module (moduleId) [CASCADE]
Enrollment -> Course (courseId) [No onDelete specified!]
```

**Business Schema:**
```
RestaurantSettings -> Restaurant (restaurantId) [CASCADE]
Product -> Restaurant (restaurantId) [CASCADE]
Order -> Restaurant (restaurantId) [CASCADE]
OrderItem -> Order (orderId) [CASCADE]
OrderItem -> Product (productId) [No onDelete specified!]
```

### Cross-Service References (Soft References via userId)
| Service | Model | References | External Service |
|---------|-------|------------|------------------|
| All | Multiple | userId | Community (Profile) |
| Marketplace | CollectiveBargain.communityGroupId | groupId | Community (Group) |
| Marketplace | QuoteRequest.restaurantId | restaurantId | Business (Restaurant) |

**CRITICAL ISSUE:** No database-level foreign key constraints exist between schemas - all cross-service references are "soft" (application-level only).

---

## 3. Data Types Analysis

### JSON Fields (JSONB)
| Schema | Model | Field | Purpose | Risk |
|--------|-------|-------|---------|------|
| Marketplace | QuoteRequest | items | Item requests | High - no validation |
| Marketplace | Quote | items | Quoted items | High - no validation |
| Marketplace | CollectiveBargain | supplierOffer | Offer details | Medium |

**Issue:** JSON fields lack schema validation. The structure is defined only by application code, creating risk of data inconsistency.

### Decimal Fields
| Schema | Model | Field | Precision | Notes |
|--------|-------|-------|-----------|-------|
| Academy | Course | price | @db.Decimal(10,2) | Correct |
| Marketplace | Supplier | minOrder | Decimal (no precision) | **Missing precision** |
| Marketplace | Supplier | ratingAvg | Decimal (no precision) | **Missing precision** |
| Marketplace | SupplierProduct | price | Decimal (no precision) | **Missing precision** |
| Marketplace | CollectiveBargain | targetPrice | Decimal (no precision) | **Missing precision** |
| Marketplace | BargainAdhesion | committedQuantity | Decimal (no precision) | **Missing precision** |
| Marketplace | PriceHistory | price | Decimal (no precision) | **Missing precision** |

### Array Fields (PostgreSQL arrays)
| Schema | Model | Field | Type | Index |
|--------|-------|-------|------|-------|
| Marketplace | Supplier | categories | String[] | @@index (GIN) |
| Marketplace | Supplier | deliveryZones | String[] | **Missing** |
| Marketplace | Supplier | certifications | String[] | **Missing** |
| Marketplace | QuoteRequest | suppliers | String[] | **Missing** |
| Marketplace | CollectiveBargain | participants | String[] | **Missing** |

---

## 4. Index Analysis

### Existing Indexes (Well-Designed)

**Community Schema (21 indexes):** Best-indexed schema, pattern to follow for others.

**Marketplace Schema (5 indexes):** Basic coverage only.

### Missing Indexes (Performance Issues)

| Schema | Model | Field(s) | Query Pattern | Priority |
|--------|-------|----------|---------------|----------|
| Business | Restaurant | userId | findUnique by userId | **HIGH** |
| Business | Order | restaurantId, orderDate | Date range queries | **HIGH** |
| Business | Order | status | Status filtering | MEDIUM |
| Business | Product | restaurantId | Products by restaurant | **HIGH** |
| Business | DailyStats | restaurantId | Stats lookups | **HIGH** |
| Academy | Enrollment | userId | User enrollments | **HIGH** |
| Academy | Enrollment | courseId | Course enrollments | **HIGH** |
| Academy | Certificate | userId | User certificates | **HIGH** |
| Academy | Certificate | courseId | Course certificates | MEDIUM |
| Academy | Course | category | Category filtering | MEDIUM |
| Academy | Course | level | Level filtering | MEDIUM |
| Academy | Course | published | Published filter | MEDIUM |
| Marketplace | Quote | quoteRequestId | Quotes by request | MEDIUM |
| Marketplace | Quote | supplierId | Quotes by supplier | MEDIUM |
| Marketplace | QuoteRequest | restaurantId | Requests by restaurant | MEDIUM |
| Marketplace | QuoteRequest | status | Status filtering | MEDIUM |

---

## 5. Security & Data Integrity

### Row-Level Security (RLS)
**Status:** NOT IMPLEMENTED

PostgreSQL RLS is not configured in any schema. All access control is application-level only.

### Missing Constraints

1. **No Check Constraints:** Rating bounds (1-5), status validation, positive prices
2. **Soft Delete Pattern Missing:** All schemas use hard delete, no `deletedAt`

### Referential Integrity Gaps

| Schema | Model | Relation | Current | Should Be |
|--------|-------|----------|---------|-----------|
| Marketplace | Review | supplierId | RESTRICT | CASCADE |
| Marketplace | Quote | quoteRequestId | RESTRICT | CASCADE |
| Marketplace | BargainAdhesion | collectiveBargainId | None | CASCADE |
| Marketplace | PriceHistory | productId | None | CASCADE |
| Marketplace | PriceHistory | supplierId | None | CASCADE |
| Academy | Enrollment | courseId | None | RESTRICT |
| Business | OrderItem | productId | None | RESTRICT |

---

## 6. Technical Debt Summary

### Critical Issues (Must Fix)
1. **Missing `onDelete` Cascades** - Orphaned records risk
2. **Missing Primary Indexes** - Business/Academy schemas
3. **Inconsistent Field Naming** - camelCase vs snake_case

### High Priority Issues
4. **String-Based Enums** - Should use PostgreSQL Enums
5. **Missing Decimal Precision** - Financial calculation risks
6. **Schema Drift** - `review_helpfuls` table mismatch

### Medium Priority Issues
7. **Denormalization Problems** - Cached counts need sync
8. **JSON Schema Validation** - No structure validation
9. **Cross-Service Integrity** - No FK constraints between schemas

---

## Implementation Plan

### Phase 1: Critical Fixes (Week 1)
1. Add missing `onDelete` clauses to all foreign keys
2. Add indexes to Business and Academy schemas
3. Create migrations for missing indexes

### Phase 2: Data Integrity (Week 2)
1. Convert String fields to PostgreSQL Enums
2. Add Decimal precision to Marketplace fields
3. Add check constraints for ratings and status values

### Phase 3: Schema Cleanup (Week 3)
1. Resolve naming inconsistencies
2. Add soft delete pattern (`deletedAt` field)
3. Document JSON field structures with TypeScript interfaces

### Phase 4: Performance & Security (Week 4)
1. Evaluate and implement RLS policies
2. Add remaining performance indexes
3. Create database monitoring/alerting

---

**Files Requiring Changes:**
- `services/business/prisma/schema.prisma` - Needs indexes
- `services/academy/prisma/schema.prisma` - Needs indexes + onDelete
- `services/marketplace/prisma/schema.prisma` - Needs Decimal precision + cascades
- `services/community/prisma/schema.prisma` - Reference pattern for others
