# Technical Debt Assessment - FINAL

**Projeto:** iaMenu Ecosystem
**Data:** 2026-02-03
**Workflow:** Brownfield Discovery - Phase 8 (Final Consolidation)
**Autor:** @architect (Aria)
**Status:** FINAL
**Versao:** 1.0

---

## Executive Summary

This document consolidates all technical debt identified during the Brownfield Discovery process (Phases 1-7) and provides a definitive action plan for remediation. All specialist reviews have been incorporated and conflicts resolved.

| Metrica | Valor Original | Valor Validado |
|---------|----------------|----------------|
| Total de Debitos Identificados | 35 | **41** (+6 new from reviews) |
| Debitos Criticos (P0) | 8 | **6** (refined scope) |
| Debitos Altos (P1) | 12 | **11** (adjusted priorities) |
| Debitos Medios (P2) | 15 | **14** |
| Debitos Baixos (P3) | - | **10** |
| Esforco Total Estimado | 180-240h | **210-295h** (refined estimates) |

### Key Changes from Draft

1. **DB-002 (Missing indexes):** Downgraded P0 -> P1 (low data volume, not yet impacting performance)
2. **DB-005 (Decimal precision):** Upgraded P1 -> P0 (financial calculation risk)
3. **FE-002 (Auth protection):** Downgraded P0 -> P1 (dev token mitigates immediate risk)
4. **FE-003 (Mobile responsiveness):** Upgraded P1 -> P0 (blocks 70%+ of target users)
5. **5 new database concerns identified** (DB-012 through DB-016)
6. **Test coverage gap identified as critical blocker** (0% Marketplace, 0% Frontend)

---

## 1. Debitos de Sistema (Arquitetura)

**Fonte:** @architect - Phase 1 - system-architecture.md

| ID | Debito | Severidade | Impacto | Esforco Est. |
|----|--------|------------|---------|--------------|
| SYS-001 | No inter-service communication | CRITICO | Workflows limitados, frontend overloaded | 24-32h |
| SYS-002 | Missing OpenAPI/Swagger specs | ALTO | Developer onboarding dificil | 16-24h |
| SYS-003 | Duplicated code across services | MEDIO | Manutencao overhead | 16-20h |
| SYS-004 | No centralized logging | MEDIO | Debugging distribuido dificil | 12-16h |
| SYS-005 | Socket.io not horizontally scalable | MEDIO | Cannot scale Community service | 8-12h |
| SYS-006 | Frontend uses JavaScript (not TS) | BAIXO | Type safety gaps | 40-60h |
| SYS-007 | File uploads stored locally | BAIXO | Not scalable, lost on redeploy | 8-12h |

### Missing Components (Arquitetura)

| Componente | Estado Atual | Solucao Recomendada |
|------------|--------------|---------------------|
| API Gateway | None (4 URLs separados) | Kong ou custom Express gateway |
| Event Bus | None | Redis Pub/Sub ou RabbitMQ |
| Shared Library | Codigo duplicado | `@iamenu/shared` package |
| Monitoring | Apenas metricas de plataforma | Sentry, Datadog |
| API Documentation | None | Swagger/OpenAPI |

---

## 2. Debitos de Database

**Fonte:** @data-engineer - Phase 2 & 7 (Validated)

| ID | Debito | Severidade | Impacto | Esforco Est. |
|----|--------|------------|---------|--------------|
| DB-001 | Missing `onDelete` cascades | CRITICO | Orphaned records risk | 3-4h |
| DB-002 | Missing indexes (Business/Academy) | ALTO | Query performance (future) | 2-3h |
| DB-003 | Inconsistent field naming | MEDIO | Developer confusion | 16-24h |
| DB-004 | String-based enums (should be PG enums) | ALTO | Data integrity risk | 8-12h |
| DB-005 | Missing Decimal precision (Marketplace) | **CRITICO** | Financial calculation errors | 2-3h |
| DB-006 | Schema drift (review_helpfuls) | BAIXO | Migration inconsistency | 1h |
| DB-007 | Denormalization problems (cached counts) | MEDIO | Data sync issues | 12-16h |
| DB-008 | JSON schema validation missing | MEDIO | Data inconsistency risk | 4-6h |
| DB-009 | Cross-service FK constraints missing | MEDIO | Referential integrity | 4h (docs) |
| DB-010 | No RLS policies | BAIXO | Security layer missing | 24-32h |
| DB-011 | No soft delete pattern | BAIXO | Audit trail gaps | 8-10h |
| DB-012 | No database connection pooling config | MEDIO | Connection exhaustion | 2-4h |
| DB-013 | No query timeout settings | MEDIO | Runaway queries | 1-2h |
| DB-014 | DailyStats lacks index on date | ALTO | Time-range queries slow | 1h |
| DB-015 | Certificate lacks courseId index | MEDIO | Course completion reports slow | 1h |
| DB-016 | No database backup verification | **CRITICO** | Data loss risk | 4-6h |

---

## 3. Debitos de Frontend/UX

**Fonte:** @ux-design-expert - Phase 3 & 8 (Validated)

| ID | Debito | Severidade | Impacto | Esforco Est. |
|----|--------|------------|---------|--------------|
| FE-001 | Hardcoded localhost URLs (8 files) | **CRITICO** | Marketplace broken in prod | 1-2h |
| FE-002 | No auth protection on routes | ALTO | Security vulnerability | 6-8h |
| FE-003 | No mobile responsiveness | **CRITICO** | 70%+ users blocked | 20-30h |
| FE-004 | Duplicate API implementations | ALTO | Maintenance overhead | 8-10h |
| FE-005 | Duplicate StandardPlaceholder component | MEDIO | Code duplication | 1h |
| FE-006 | Missing ARIA labels (99% components) | ALTO | Accessibility fail | 12-16h |
| FE-007 | No keyboard navigation | ALTO | Accessibility fail | 16-20h |
| FE-008 | Color contrast issues | MEDIO | WCAG AA fail | 4-6h |
| FE-009 | No error boundaries per route | MEDIO | Poor error UX | 4-6h |
| FE-010 | No lazy loading/code splitting | MEDIO | Initial load slow | 6-8h |
| FE-011 | No form validation library | BAIXO | Inconsistent validation | 8-12h |
| FE-012 | No unit tests | ALTO | Quality assurance gap | 40-60h |

---

## 4. Final Priority Matrix (Consolidated)

### P0 - Critico (Must resolve before launch)

| ID | Debito | Area | Esforco | Owner |
|----|--------|------|---------|-------|
| FE-001 | Hardcoded localhost URLs | Frontend | 1-2h | @dev |
| FE-003 | No mobile responsiveness | Frontend | 20-30h | @dev + @ux |
| DB-005 | Missing Decimal precision | Database | 2-3h | @data-engineer |
| DB-001 | Missing onDelete cascades | Database | 3-4h | @data-engineer |
| DB-016 | Backup verification | Database | 4-6h | @devops |
| TEST-001 | Marketplace test suite (blocker) | QA | 7-8h | @qa |

**Subtotal P0:** 37-53 horas

### P1 - Alto (Resolve in 2 weeks)

| ID | Debito | Area | Esforco | Owner |
|----|--------|------|---------|-------|
| DB-002 | Missing indexes | Database | 2-3h | @data-engineer |
| DB-004 | String-based enums | Database | 8-12h | @data-engineer |
| DB-014 | DailyStats index | Database | 1h | @data-engineer |
| FE-002 | No auth protection | Frontend | 6-8h | @dev |
| FE-004 | Duplicate API implementations | Frontend | 8-10h | @dev |
| FE-006 | Missing ARIA labels | Frontend | 12-16h | @dev |
| FE-007 | No keyboard navigation | Frontend | 16-20h | @dev |
| FE-012 | Frontend unit tests | QA | 40-60h | @qa + @dev |
| SYS-002 | Missing OpenAPI specs | Sistema | 16-24h | @architect |

**Subtotal P1:** 109-153 horas

### P2 - Medio (Resolve in 1 month)

| ID | Debito | Area | Esforco | Owner |
|----|--------|------|---------|-------|
| SYS-001 | No inter-service comm | Sistema | 24-32h | @architect |
| SYS-003 | Duplicated code | Sistema | 16-20h | @dev |
| SYS-004 | No centralized logging | Sistema | 12-16h | @devops |
| FE-005 | Duplicate StandardPlaceholder | Frontend | 1h | @dev |
| FE-008 | Color contrast issues | Frontend | 4-6h | @ux |
| FE-009 | No error boundaries | Frontend | 4-6h | @dev |
| FE-010 | No lazy loading | Frontend | 6-8h | @dev |
| DB-007 | Denormalization sync | Database | 12-16h | @data-engineer |
| DB-008 | JSON validation | Database | 4-6h | @dev |
| DB-012 | Connection pooling | Database | 2-4h | @devops |
| DB-013 | Query timeout | Database | 1-2h | @devops |
| DB-015 | Certificate index | Database | 1h | @data-engineer |

**Subtotal P2:** 87-117 horas

### P3 - Baixo (Backlog)

| ID | Debito | Area | Esforco | Owner |
|----|--------|------|---------|-------|
| DB-003 | Inconsistent field naming | Database | 16-24h | @data-engineer |
| DB-006 | Schema drift cleanup | Database | 1h | @dev |
| DB-009 | Cross-service FK docs | Database | 4h | @architect |
| DB-010 | RLS policies | Database | 24-32h | @data-engineer |
| DB-011 | Soft delete pattern | Database | 8-10h | @dev |
| SYS-005 | Socket.io scaling | Sistema | 8-12h | @devops |
| SYS-006 | TypeScript migration | Frontend | 40-60h | @dev |
| SYS-007 | Cloud file storage | Sistema | 8-12h | @devops |
| FE-011 | Form validation lib | Frontend | 8-12h | @dev |

**Subtotal P3:** 117-166 horas

---

## 5. Quality Gates (From QA Review)

### Pre-Implementation Gate (Before P0 Sprint)

- [ ] Marketplace integration tests created and passing
- [ ] Production database backup verified
- [ ] Current orphan record count documented
- [ ] Staging environment available for testing
- [ ] Rollback procedure documented for each fix

### Definition of Done - P0 Sprint

1. **Code Complete**
   - All code changes merged to main branch
   - No linting errors (`npm run lint:check` passes)
   - TypeScript compiles without errors (backend)

2. **Tests Pass**
   - All existing tests pass (`npm test`)
   - New tests added for changed functionality
   - Manual testing completed per checklist

3. **Production Verified**
   - Changes deployed to Railway/Vercel
   - Production smoke test passed
   - No errors in production logs (first 30 minutes)

4. **Documentation Updated**
   - Story checkbox marked complete `[x]`
   - Technical debt item marked resolved
   - Any new known issues documented

5. **Rollback Ready**
   - Previous version tagged in git
   - Rollback procedure tested
   - Database backup verified

---

## 6. Risk Assessment Matrix

| Fix | Complexity | Regression Risk | Rollback Difficulty | Safe to Parallelize |
|----|------------|-----------------|---------------------|---------------------|
| FE-001 (URLs) | LOW | LOW | EASY | YES |
| FE-003 (Mobile) | MEDIUM | MEDIUM | MEDIUM | YES |
| DB-001 (cascades) | LOW | MEDIUM | MEDIUM | YES (after DB-005) |
| DB-005 (decimal) | LOW | LOW | EASY | YES |
| DB-016 (backup) | LOW | NONE | N/A | YES |
| TEST-001 (tests) | MEDIUM | NONE | N/A | YES |

---

## 7. Database Review Summary (@data-engineer)

**Status:** VALIDATED with refinements (2026-02-03)

### Key Findings

1. **DB-002 Downgraded:** Missing indexes not causing visible performance issues with current data volume (<1000 records per table)
2. **DB-005 Upgraded:** Decimal precision is critical for Marketplace financial calculations
3. **5 New Concerns Identified:** Connection pooling, query timeouts, additional indexes, backup verification
4. **Cascade Migration:** Can be done without downtime using proper strategy

### Recommended Database Execution Order

1. DB-005 - Decimal precision (financial risk mitigation)
2. DB-001 - Missing cascades (after orphan check)
3. DB-016 - Backup verification
4. DB-002 + DB-014 + DB-015 - All indexes (single sprint)
5. DB-004 - String to enum migration

---

## 8. Frontend/UX Review Summary (@ux-design-expert)

**Status:** VALIDATED with corrections (2026-02-03)

### Key Findings

1. **FE-001 Confirmed P0:** Marketplace features completely broken in production
2. **FE-003 Upgraded to P0:** 70%+ of target users (Portuguese restaurant owners) access via mobile
3. **FE-002 Downgraded:** Dev token provides temporary mitigation
4. **TypeScript Migration Deferred:** Wait for test coverage to mitigate regression risk

### UX Impact Assessment

| Issue | Users Affected | Business Impact |
|-------|---------------|-----------------|
| Hardcoded URLs | 100% Marketplace | Features non-functional |
| No mobile | 70%+ restauradores | Expected high churn |
| No ARIA | 10-15% | User exclusion |

---

## 9. QA Review Summary (@qa)

**Status:** REVIEWED - Ready for execution (2026-02-03)

### Critical Test Coverage Gaps

| Service | Coverage | Status |
|---------|----------|--------|
| Community | ~40% | Adequate |
| Marketplace | **0%** | CRITICAL BLOCKER |
| Academy | ~15% | Low |
| Business | ~15% | Low |
| Frontend | **0%** | CRITICAL |

### Execution Validation

- **Parallel Safe:** FE-001, FE-003, DB-005
- **Sequential Required:** DB-005 -> DB-001 -> DB-016
- **Sprint Duration:** 5 working days recommended

---

## 10. Final Consolidation & Action Plan (@architect)

### 10.1 Week-by-Week Execution Plan

#### Week 1: P0 Sprint (Critical Fixes)

**Day 1-2: Setup & Parallel Fixes**

| Task | Owner | Hours | Parallel? |
|------|-------|-------|-----------|
| Create Marketplace test suite (TEST-001) | @qa | 7-8h | YES |
| Fix hardcoded URLs (FE-001) | @dev-frontend | 1-2h | YES |
| Start mobile responsiveness (FE-003) | @dev-frontend + @ux | 10-15h | YES |
| Add Decimal precision (DB-005) | @data-engineer | 2-3h | YES |

**Day 3: Database Cascade Fix**

| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| Check for orphan records | @data-engineer | 0.5h | None |
| Add onDelete cascades (DB-001) | @data-engineer | 3-4h | DB-005 complete |
| Run cascade tests | @qa | 1h | DB-001 complete |

**Day 4: Complete Mobile + Integration**

| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| Complete mobile responsiveness | @dev-frontend | 10-15h | None |
| Test all P0 fixes in staging | @qa | 2-3h | All P0 fixes |
| Deploy to production | @devops | 1h | Tests pass |

**Day 5: Verification & Documentation**

| Task | Owner | Hours | Dependencies |
|------|-------|-------|--------------|
| Verify backup/restore (DB-016) | @devops | 4-6h | Production deployed |
| Production smoke testing | @qa | 1-2h | Deployment complete |
| Update documentation | @architect | 2h | All verified |

**Week 1 Total: 37-53 hours**

---

#### Week 2: P1 Sprint Part 1 (High Priority)

| Task | Owner | Hours | Notes |
|------|-------|-------|-------|
| Add missing indexes (DB-002, DB-014) | @data-engineer | 3-4h | Single migration |
| Auth route protection (FE-002) | @dev-frontend | 6-8h | ProtectedRoute wrapper |
| Consolidate API layer (FE-004) | @dev-frontend | 8-10h | Create lib/api/client.js |
| ARIA labels (FE-006) | @dev-frontend | 12-16h | Start with ui components |

**Week 2 Total: 29-38 hours**

---

#### Week 3: P1 Sprint Part 2

| Task | Owner | Hours | Notes |
|------|-------|-------|-------|
| Keyboard navigation (FE-007) | @dev-frontend | 16-20h | Focus trap in modals |
| String to enum migration (DB-004) | @data-engineer | 8-12h | Zero-downtime approach |
| Frontend unit tests (FE-012 - start) | @qa + @dev | 20h | Target 40% coverage |

**Week 3 Total: 44-52 hours**

---

#### Week 4: P1 Sprint Part 3 + P2 Start

| Task | Owner | Hours | Notes |
|------|-------|-------|-------|
| OpenAPI specs (SYS-002) | @architect | 16-24h | All 4 services |
| Frontend tests continued (FE-012) | @qa + @dev | 20-40h | Target 70% coverage |
| Connection pooling (DB-012) | @devops | 2-4h | PgBouncer config |

**Week 4 Total: 38-68 hours**

---

### 10.2 Dependency Graph

```
Week 1 (P0)
============
TEST-001 ─────────────────────────────────────────┐
                                                   │
FE-001 (URLs) ────────────────────────────────────┤
                                                   │ ALL PARALLEL
FE-003 (Mobile) ──────────────────────────────────┤
                                                   │
DB-005 (Decimal) ─────┐                           │
                      │                           │
                      ▼                           │
              DB-001 (Cascades) ──────────────────┤
                      │                           │
                      ▼                           │
              DB-016 (Backup) ────────────────────┘
                      │
                      ▼
              PRODUCTION DEPLOY

Week 2-3 (P1)
=============
FE-002 ───────────────┐
                      │
FE-004 ───────────────┤
                      │ PARALLEL (Frontend focus)
FE-006 ───────────────┤
                      │
FE-007 ───────────────┘

DB-002 + DB-014 ──────┐
                      │ PARALLEL (Database focus)
DB-004 ───────────────┘

FE-012 (Tests) ──────── CONTINUOUS (throughout sprint)
```

### 10.3 Resource Allocation

| Role | Week 1 | Week 2 | Week 3 | Week 4 |
|------|--------|--------|--------|--------|
| @dev-frontend | FE-001, FE-003 | FE-002, FE-004 | FE-007, FE-012 | FE-012 |
| @data-engineer | DB-005, DB-001 | DB-002, DB-014 | DB-004 | Support |
| @qa | TEST-001, Testing | Testing | FE-012, Testing | FE-012 |
| @devops | Deployment | DB-012 | Support | Support |
| @architect | Documentation | Support | Support | SYS-002 |
| @ux | FE-003 support | FE-006 review | FE-007 review | Review |

### 10.4 Success Metrics

| Metric | Current | Week 1 Target | Week 4 Target |
|--------|---------|---------------|---------------|
| Marketplace prod working | NO | YES | YES |
| Mobile usability | 0% | 80% | 100% |
| Test coverage (Marketplace) | 0% | 30% | 70% |
| Test coverage (Frontend) | 0% | 20% | 50% |
| P0 items remaining | 6 | 0 | 0 |
| P1 items remaining | 11 | 11 | 0 |

### 10.5 Risk Mitigation Plan

| Risk | Mitigation | Owner |
|------|------------|-------|
| Mobile fix delays launch | Define minimum viable (768px only) | @ux |
| Cascade deletes unintended data | Run on staging first, verify counts | @data-engineer |
| API consolidation breaks features | Test each endpoint after refactor | @qa |
| Test creation takes longer | Focus on cascade tests first | @qa |

### 10.6 Rollback Procedures

**For each P0 fix:**

| Fix | Rollback Procedure | Time to Rollback |
|-----|-------------------|------------------|
| FE-001 | `git revert <commit>`, redeploy | 5 minutes |
| FE-003 | `git revert <commit>`, redeploy | 5 minutes |
| DB-005 | No rollback needed (additive change) | N/A |
| DB-001 | Remove cascade via new migration | 15 minutes |
| DB-016 | N/A (verification only) | N/A |

---

## 11. Sprint Backlog Preview (P0 Items Ready for Implementation)

### TECH-DEBT-001: Fix Hardcoded Localhost URLs

**Priority:** P0 - CRITICAL
**Estimated Hours:** 1-2h
**Owner:** @dev-frontend

**Description:**
Replace all hardcoded `localhost:300X` URLs in frontend files with `API_CONFIG` imports from `src/config/api.js`.

**Files to Update:**
- `ComparisonTab.jsx` (line 199)
- `businessAPI.js` (line 6)
- `IncomingRfqTab.jsx` (lines 30, 87)
- `Marketplace.jsx` (lines 47, 146)
- `ProfilesTab.jsx` (lines 49, 155)
- `RfqTab.jsx` (lines 29, 111)
- `RfqRequestsTab.jsx` (line 22)

**Acceptance Criteria:**
- [ ] All 8 files updated to import from `API_CONFIG`
- [ ] `grep -r "localhost:300" frontend/` returns 0 results
- [ ] Local development works (localhost URLs used)
- [ ] Production build works (Railway URLs used)
- [ ] Marketplace pages load correctly in production

**Test Plan:**
1. Run local dev server, verify Marketplace features work
2. Build production bundle, verify API_CONFIG values
3. Deploy to staging, test all Marketplace pages

---

### TECH-DEBT-002: Implement Mobile Responsive Sidebar

**Priority:** P0 - CRITICAL
**Estimated Hours:** 20-30h
**Owner:** @dev-frontend + @ux

**Description:**
Implement a collapsible/drawer sidebar that works on mobile devices (< 768px viewport). Current 280px fixed sidebar blocks content on mobile.

**Acceptance Criteria:**
- [ ] Sidebar collapses to hamburger menu on mobile (< 768px)
- [ ] Content is visible on iPhone SE (375px viewport)
- [ ] Touch gestures work (swipe to open/close)
- [ ] Desktop layout unchanged (> 1024px)
- [ ] No horizontal scroll on any viewport
- [ ] Tested at breakpoints: 375px, 768px, 1024px, 1920px

**Test Plan:**
1. Test on Chrome DevTools device emulator
2. Test on real mobile device if available
3. Test all pages at each breakpoint
4. Verify no desktop regressions

---

### TECH-DEBT-003: Add Decimal Precision to Marketplace

**Priority:** P0 - CRITICAL
**Estimated Hours:** 2-3h
**Owner:** @data-engineer

**Description:**
Update Marketplace Prisma schema to use proper Decimal precision for financial fields (prices, totals).

**Files to Update:**
- `services/marketplace/prisma/schema.prisma`

**Acceptance Criteria:**
- [ ] All price fields use `@db.Decimal(12,4)` or equivalent
- [ ] Prisma client regenerated (`npx prisma generate`)
- [ ] Migration applied successfully
- [ ] Existing price data preserved correctly
- [ ] Price calculations verified:
  - `10.999` + `0.001` = `11.000`
  - `99.99` * `0.08` (tax) = `7.9992`

**Test Plan:**
1. Check existing price data before migration
2. Run migration on staging
3. Verify price data integrity
4. Test price calculations in API

---

### TECH-DEBT-004: Add Missing onDelete Cascades

**Priority:** P0 - CRITICAL
**Estimated Hours:** 3-4h
**Owner:** @data-engineer

**Description:**
Add proper `onDelete` cascade rules to Prisma relations to prevent orphaned records.

**Relations to Update:**
| Schema | Model | Relation | Action |
|--------|-------|----------|--------|
| Marketplace | BargainAdhesion | collectiveBargainId | CASCADE |
| Marketplace | PriceHistory | productId | CASCADE |
| Marketplace | PriceHistory | supplierId | CASCADE |
| Academy | Enrollment | courseId | RESTRICT |
| Business | OrderItem | productId | RESTRICT |

**Pre-requisites:**
- [ ] Check for orphan records before migration
- [ ] DB-005 (Decimal precision) completed

**Acceptance Criteria:**
- [ ] Migration script created with proper onDelete actions
- [ ] No orphan records exist pre-migration
- [ ] Delete operations tested:
  - Delete supplier with reviews (should fail or cascade)
  - Delete collective bargain (adhesions cascade deleted)
  - Delete product (price history cascade deleted)
  - Delete course (should fail if enrollments exist)
- [ ] No data loss for unrelated records

**Test Plan:**
1. Document orphan record count before migration
2. Apply migration to staging
3. Test all delete scenarios
4. Verify no unintended data loss

---

### TECH-DEBT-005: Verify Database Backup Procedures

**Priority:** P0 - CRITICAL
**Estimated Hours:** 4-6h
**Owner:** @devops

**Description:**
Verify that database backup and restore procedures work correctly. This is a critical safety net before making schema changes.

**Acceptance Criteria:**
- [ ] Backup created after all P0 fixes
- [ ] Backup restored to test environment successfully
- [ ] Data integrity verified post-restore
- [ ] Restore time documented
- [ ] Backup schedule confirmed (daily minimum)
- [ ] Backup retention policy documented

**Test Plan:**
1. Create manual backup of production database
2. Restore backup to test environment
3. Verify all tables and data present
4. Document restore procedure and time

---

### TECH-DEBT-006: Create Marketplace Test Suite (Blocker)

**Priority:** P0 - BLOCKER
**Estimated Hours:** 7-8h
**Owner:** @qa

**Description:**
Create minimum viable test suite for Marketplace service before making P0 database changes. This is a blocker for DB-001 and DB-005.

**Files to Create:**
- `services/marketplace/tests/health.test.ts`
- `services/marketplace/tests/supplier.test.ts`
- `services/marketplace/tests/rfq.test.ts`
- `services/marketplace/tests/pricing.test.ts`

**Acceptance Criteria:**
- [ ] Health check test passing
- [ ] Supplier CRUD tests passing
- [ ] RFQ/Quote flow tests passing
- [ ] Pricing calculation tests passing
- [ ] Tests run successfully in CI (`npm run test:marketplace`)

**Test Coverage Targets:**
- Supplier CRUD operations
- Supplier deletion with reviews (cascade behavior)
- Quote request with quotes (cascade behavior)
- Price calculation with decimals

---

## 12. Document Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Architect | @architect (Aria) | 2026-02-03 | APPROVED |
| Data Engineer | @data-engineer | 2026-02-03 | REVIEWED |
| UX Expert | @ux-design-expert | 2026-02-03 | REVIEWED |
| QA Lead | @qa (Quinn) | 2026-02-03 | REVIEWED |
| Product Owner | Pending | | |
| Tech Lead | Pending | | |

---

## Reference Documents

- `docs/architecture/system-architecture.md` - Phase 1
- `docs/architecture/database-schema.md` - Phase 2
- `docs/frontend/frontend-spec.md` - Phase 3
- `docs/prd/technical-debt-DRAFT.md` - Original draft with all reviews

---

**Status:** FINAL - Ready for Execution
**Version:** 1.0
**Created:** 2026-02-03
**Last Updated:** 2026-02-03

---

*Document prepared by @architect (Aria) as part of Synkra AIOS Brownfield Discovery Workflow*
