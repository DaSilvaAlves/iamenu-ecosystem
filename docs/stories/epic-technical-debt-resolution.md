# Epic: Technical Debt Resolution - iaMenu Ecosystem
**iaMenu Ecosystem - Infrastructure & Quality Excellence Sprint**

**Epic ID:** TECH-DEBT-001
**Status:** 📋 PLANNING
**Timeline:** 6-8 weeks (Phases 1-3)
**Priority:** 🔴 CRITICAL
**Owner:** @pm (Morgan)
**Team:** @architect, @dev, @data-engineer, @ux-design-expert, @qa

---

## 🎯 Epic Goal

Resolve critical technical debt blocking velocity and security, enabling the team to deliver **2x features** in **half the time** with **60% fewer bugs**.

**Success Criteria:**
- [ ] Zero critical security gaps (RLS coverage 100%)
- [ ] TypeScript frontend migration complete
- [ ] Design system foundation (3 core variants)
- [ ] Test coverage >= 80%
- [ ] API performance +40% (250ms → <150ms)
- [ ] Team velocity +40%

---

## 📊 Epic Summary

| Aspecto | Detalhe |
|---------|---------|
| **Total Débitos** | 35 identificados, 2 críticos |
| **Esforço** | 236-322 horas |
| **Budget** | R$ 35.4k - 48.3k |
| **Timeline** | 6-8 semanas |
| **Team** | 4-5 developers |
| **Risk** | Médio (RLS é crítico, resto é manageable) |
| **ROI** | 8:1 to 15:1 |

---

## 🔄 Phase Breakdown

### PHASE 1: FOUNDATION (Semanas 1-2) - CRÍTICO
**Goal:** Resolve security + build performance baseline
**Budget:** R$ 7.2k-9.3k | **Hours:** 48-62h

#### Stories Incluídas

**Story 1.1: Implement RLS Policies (All Tables)**
- Severity: 🔴 CRITICAL
- Hours: 18-22h
- Tasks:
  - [ ] Audit all tables for RLS coverage
  - [ ] Design RLS policy structure
  - [ ] Implement RLS on posts, comments, quotes
  - [ ] Test RLS policies (positive + negative cases)
  - [ ] Deploy to production
- AC: Zero RLS gaps, all queries respect row-level security
- QA Gate: Security audit passed

**Story 1.2: Create Database Indexes (High-Volume Tables)**
- Severity: 🟡 HIGH
- Hours: 4-6h
- Tables: posts.created_at, comments.post_id, quotes.status, orders.user_id
- AC: Query performance +30% on indexed columns
- QA Gate: Performance benchmarks passed

**Story 1.3: Fix N+1 Query Patterns (Critical Endpoints)**
- Severity: 🟡 HIGH
- Hours: 6-8h
- Endpoints: GET /community/posts, GET /marketplace/suppliers/:id
- AC: API response time <200ms on heavy endpoints
- QA Gate: Load testing passed

---

### PHASE 2: ARCHITECTURE (Semanas 3-4) - ALTA
**Goal:** Modern foundation for scalability
**Budget:** R$ 9.0k-11.2k | **Hours:** 60-75h

#### Stories Incluídas

**Story 2.1: TypeScript Migration (Frontend)**
- Severity: 🔴 HIGH
- Hours: 15-20h
- Scope: Convert JavaScript to TypeScript, setup tsconfig
- AC: 100% of frontend code is TypeScript, zero runtime type errors
- QA Gate: TypeScript compiler clean, type coverage >95%

**Story 2.2: Design System Foundation (Core Components)**
- Severity: 🔴 HIGH
- Hours: 15-20h
- Components: Button, Input, Card (3 core atoms)
- AC: All components have 3+ variants, documented in Storybook
- QA Gate: Accessibility audit passed (WCAG AA)

**Story 2.3: Logging Centralization**
- Severity: 🟡 MEDIUM
- Hours: 8-10h
- Implementation: Winston across all services, request ID tracking
- AC: Centralized logging working, queries debuggable
- QA Gate: Logging format consistent

**Story 2.4: Error Handling Standardization**
- Severity: 🟡 MEDIUM
- Hours: 10-12h
- AC: All services return consistent error format
- QA Gate: Error format validated across services

---

### PHASE 3: SCALE (Semanas 5-8) - MÉDIA
**Goal:** Full design system + comprehensive testing
**Budget:** R$ 19.2k-27.7k | **Hours:** 128-185h

#### Stories Incluídas

**Story 3.1: Design System Migration (All Components)**
- Severity: 🟡 MEDIUM
- Hours: 20-25h
- AC: 90% of components using design system
- QA Gate: Visual regression tests passed

**Story 3.2: Test Coverage Expansion**
- Severity: 🟡 MEDIUM
- Hours: 30-40h
- Target: 80% coverage on all services
- AC: Unit + integration tests for all critical paths
- QA Gate: Coverage report >80%

**Story 3.3: Component Library Setup (Storybook)**
- Severity: 🟡 MEDIUM
- Hours: 15-20h
- AC: All components documented in Storybook
- QA Gate: Storybook deployed + accessible

**Story 3.4: Accessibility Audit & Fixes**
- Severity: 🟡 MEDIUM
- Hours: 15-20h
- AC: WCAG AA compliance (95%+ pass rate)
- QA Gate: Axe audit passed

**Story 3.5: Soft Deletes Implementation (Critical Tables)**
- Severity: 🟡 MEDIUM
- Hours: 12-15h
- Tables: posts, comments, orders
- AC: Audit trail preserved, deleted items not shown
- QA Gate: Data integrity verified

**Story 3.6: Audit Logging System**
- Severity: 🟡 MEDIUM
- Hours: 15-20h
- AC: All mutations logged with user + timestamp
- QA Gate: Audit log queries working

---

## 📋 Detailed Story Template (Example: Story 1.1)

### Story 1.1: Implement RLS Policies (All Tables)
**Epic:** TECH-DEBT-001
**Status:** 📋 PLANNING
**Priority:** 🔴 CRITICAL
**Points:** 21 (3 days)
**Owner:** @data-engineer

#### Acceptance Criteria
- [ ] RLS policy on `community.posts` - users see only own posts
- [ ] RLS policy on `community.comments` - users see only own comments
- [ ] RLS policy on `marketplace.quotes` - suppliers see only own quotes
- [ ] RLS policy on `marketplace.suppliers` - granular supplier access
- [ ] RLS policy on `academy.enrollments` - students see only own enrollments
- [ ] All policies tested with positive + negative cases
- [ ] Zero security warnings from CodeRabbit
- [ ] Deployed to staging environment

#### Tasks
1. [ ] **Audit Phase** - Map all tables, identify RLS needs (2h)
   - Review each schema
   - Identify who should see what
   - Create RLS matrix

2. [ ] **Policy Design** - Design RLS policies (3h)
   - Write SQL for each policy
   - Test in local environment
   - Validate with security checklist

3. [ ] **Implementation** - Deploy RLS (8h)
   - Apply policies to all tables
   - Create migration scripts
   - Verify in staging

4. [ ] **Testing** - Comprehensive test coverage (6h)
   - Unit tests (positive cases)
   - Negative tests (user can't access other's data)
   - Load testing with RLS
   - Manual testing in staging

5. [ ] **Review & Deploy** - Final QA + production (2h)
   - CodeRabbit security scan
   - @qa approval
   - Production deployment
   - Monitoring

#### Definition of Done
- [ ] Code reviewed and approved
- [ ] Tests passing (80%+ coverage)
- [ ] CodeRabbit scan passed (no CRITICAL/HIGH issues)
- [ ] Performance benchmark accepted (<5% regression)
- [ ] Deployed to production
- [ ] Monitored for 24h

---

## 📈 Dependencies & Blockers

### Dependency Graph
```
PHASE 1 (Foundation)
├── Story 1.1: RLS Policies ✓ (no dependencies)
├── Story 1.2: Indexes ✓ (no dependencies)
└── Story 1.3: N+1 Fixes ✓ (no dependencies)

↓ (All Phase 1 must complete before Phase 2)

PHASE 2 (Architecture)
├── Story 2.1: TypeScript ✓ (depends: Phase 1 complete)
├── Story 2.2: Design System ✓ (depends: Phase 1 complete)
├── Story 2.3: Logging (depends: Phase 1 complete)
└── Story 2.4: Error Handling (depends: Phase 1 complete)

↓ (Phase 1+2 must complete before Phase 3)

PHASE 3 (Scale)
├── Story 3.1: Component Migration (depends: 2.2 complete)
├── Story 3.2: Test Coverage (depends: Phase 2 complete)
├── Story 3.3: Storybook (depends: 3.1 in progress)
├── Story 3.4: Accessibility (depends: 2.2 complete)
├── Story 3.5: Soft Deletes (depends: Phase 1 complete)
└── Story 3.6: Audit Logging (depends: 2.3 complete)
```

### Critical Path
1. Phase 1 (RLS + Indexes) - MUST COMPLETE FIRST (2 weeks)
2. Phase 2 (TypeScript + Design System) - MUST FOLLOW Phase 1 (2 weeks)
3. Phase 3 (Full Scale) - AFTER Phase 2 (4 weeks)

**No shortcuts possible.** Each phase builds on previous.

---

## 🎯 Success Metrics

### Security Metrics
- [ ] RLS coverage: 0% → 100%
- [ ] Security vulnerabilities: 2 critical → 0
- [ ] CodeRabbit scan: FAIL → PASS (no CRITICAL/HIGH)

### Performance Metrics
- [ ] API response time: 250ms → <150ms (-40%)
- [ ] Query performance: N+1 → optimized (-60%)
- [ ] CSS bundle size: 500KB → 300KB (-40%)

### Quality Metrics
- [ ] Test coverage: 40% → 80% (+100%)
- [ ] Bug escape rate: 12% → 5% (-58%)
- [ ] Code review cycle: 4h → 1h (-75%)

### User Metrics
- [ ] User satisfaction: +25% (accessibility, performance)
- [ ] Feature delivery speed: +40% (velocity)
- [ ] Bounce rate: -30% (performance)

---

## 💰 Budget & Resource Allocation

### Team Structure
- **@data-engineer:** 40h (RLS, indexes, soft deletes)
- **@dev:** 100h (TypeScript, refactoring, implementations)
- **@ux-design-expert:** 40h (design system, components)
- **@qa:** 25h (testing, coverage, audit)
- **@architect:** 15h (review, guidance)

### Weekly Burn Rate
- **Weeks 1-2 (Phase 1):** R$ 7.2k-9.3k/week
- **Weeks 3-4 (Phase 2):** R$ 9.0k-11.2k/week
- **Weeks 5-8 (Phase 3):** R$ 4.8k-6.9k/week (spreads across longer)

**Total:** R$ 35.4k-48.3k for 6-8 weeks

---

## 🚀 Rollout & Monitoring

### Pre-Launch Checklist
- [ ] All Phase 1 stories complete + QA approved
- [ ] Performance benchmarks validated
- [ ] Security audit passed (zero gaps)
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured

### Deployment Strategy
- **Staged rollout:** 10% → 25% → 50% → 100%
- **Rollback window:** 24h if issues detected
- **Monitoring:** Real-time alerting on errors, performance

### Post-Launch Monitoring
- [ ] Error rate: <0.1% (acceptable)
- [ ] Performance: No regression >5%
- [ ] Security: Zero unauthorized data access
- [ ] User feedback: Positive sentiment >85%

---

## 📞 Stakeholder Communication

### Weekly Status Reports
- Progress against timeline
- Budget burn rate
- Risks & mitigations
- User impact metrics

### Approval Gates
- [ ] Week 2: Phase 1 complete → Go/No-Go for Phase 2
- [ ] Week 4: Phase 2 complete → Go/No-Go for Phase 3
- [ ] Week 8: All phases complete → Production release

---

## 🎓 Learnings & Documentation

### Knowledge Base (Post-Epic)
- [ ] RLS patterns (what worked, what didn't)
- [ ] TypeScript migration lessons
- [ ] Design system maintenance guide
- [ ] Testing best practices

### Team Training
- [ ] New frontend devs trained on design system
- [ ] Backend devs trained on RLS patterns
- [ ] QA trained on new testing procedures

---

## 📎 Referências

- **Business Case:** `/docs/reports/TECHNICAL-DEBT-REPORT.md`
- **Technical Assessment:** `/docs/prd/technical-debt-FINAL.md`
- **Specialist Reviews:**
  - Database: `/docs/reviews/db-specialist-review.md`
  - UX/Design: `/docs/reviews/ux-specialist-review.md`
  - QA: `/docs/reviews/qa-review.md`

---

**Epic Created:** 2026-02-08
**Next Step:** Story breakdown by sprint + team assignment
