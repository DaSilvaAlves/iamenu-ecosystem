# Sprint 2 Plan - Architecture Phase
**iaMenu Ecosystem - Technical Debt Resolution**

**Sprint:** 2 of 3
**Duration:** 2 weeks (Weeks 3-4)
**Team:** 4-5 developers
**Goal:** Build modern architecture foundation (TypeScript + Design System)
**Budget:** R$ 9.0k - 11.2k
**Hours:** 60-75h total

---

## 🎯 Sprint Goal

**Establish modern development foundation: TypeScript frontend + Design system base for Phase 3 scaling.**

**Success Criteria:**
- [ ] Frontend 100% TypeScript migration complete
- [ ] Design system foundation (3+ core components)
- [ ] Logging standardized across all services
- [ ] Error handling patterns unified
- [ ] Staging tests passed (all new code)
- [ ] Zero breaking changes to API

---

## 📊 Sprint Breakdown

| Story | Hours | Priority | Owner | Status |
|-------|-------|----------|-------|--------|
| **2.1: TypeScript Frontend** | 15-20h | 🔴 CRITICAL | @dev | 📋 PLANNING |
| **2.2: Design System Core** | 15-20h | 🔴 HIGH | @ux-design-expert | 📋 PLANNING |
| **2.3: Logging Centralization** | 8-10h | 🟡 HIGH | @dev | 📋 PLANNING |
| **2.4: Error Handling** | 10-12h | 🟡 HIGH | @dev | 📋 PLANNING |
| **QA & Testing** | 12-15h | 🟡 MEDIUM | @qa | 📋 PLANNING |

**Total:** 60-77h

---

## 📖 Story 2.1: TypeScript Frontend Migration

**Story ID:** TECH-DEBT-001.2.1
**Type:** Architecture / Developer Experience
**Points:** 21 (3 days estimated)
**Priority:** 🔴 CRITICAL
**Owner:** @dev (implementation) + @architect (review)
**Status:** 📋 PLANNING

### 📝 Description

Migrate entire React frontend from JavaScript to TypeScript. Currently, the frontend is JavaScript which lacks type safety and causes runtime errors that could be caught at compile time.

### ✅ Acceptance Criteria

- [ ] TypeScript config (`tsconfig.json`) created and configured
- [ ] All React components converted to `.tsx`
- [ ] All utilities/helpers converted to `.ts`
- [ ] Type definitions for all props and state
- [ ] Zero TypeScript compilation errors
- [ ] Type coverage >95%
- [ ] All tests passing
- [ ] CodeRabbit: PASS (no issues)
- [ ] No breaking changes to API contracts

### 📋 Tasks

#### Task 2.1.1: Setup TypeScript (2h)
- [ ] Create `tsconfig.json` with appropriate settings
- [ ] Install TypeScript dependencies
- [ ] Configure build pipeline
- [ ] Setup IDE support

**Deliverable:** TypeScript configuration

#### Task 2.1.2: Convert Components (8h)
- [ ] Convert all `.jsx` to `.tsx`
- [ ] Add prop types to all components
- [ ] Add state types
- [ ] Fix type errors as they arise

**Deliverable:** TypeScript components

#### Task 2.1.3: Convert Utils & Helpers (4h)
- [ ] Convert utilities to `.ts`
- [ ] Add types to functions
- [ ] Export types for external use

**Deliverable:** TypeScript utilities

#### Task 2.1.4: Testing & Validation (4h)
- [ ] Run TypeScript compiler check
- [ ] Verify all tests pass
- [ ] Update test files to TypeScript
- [ ] Load testing

**Deliverable:** Type check report + test results

#### Task 2.1.5: Code Review & Deploy (2h)
- [ ] CodeRabbit review
- [ ] Architecture review
- [ ] Staging deployment
- [ ] Production deployment

**Deliverable:** Code review + deployment report

### 🎯 Success Metrics

- Type coverage: >95%
- Compilation errors: 0
- Test passing: 100%
- No API breaking changes
- Bundle size: No increase >10%

---

## 📖 Story 2.2: Design System Foundation (3 Core Components)

**Story ID:** TECH-DEBT-001.2.2
**Type:** Frontend / Design System
**Points:** 21 (3 days estimated)
**Priority:** 🔴 HIGH
**Owner:** @ux-design-expert (Uma)
**Status:** 📋 PLANNING

### 📝 Description

Create design system foundation with 3 core atomic components (Button, Input, Card) serving as building blocks for all other components. Extract design tokens (colors, spacing, typography).

### ✅ Acceptance Criteria

- [ ] Design tokens extracted (25 colors, 6 typography sizes, 8 spacing units)
- [ ] Button component (Primary, Secondary, Tertiary variants)
- [ ] Input component (Text, Checkbox, Select variants)
- [ ] Card component (with variants)
- [ ] All components WCAG AA compliant
- [ ] Storybook setup with all components documented
- [ ] Design tokens in Tailwind config
- [ ] CodeRabbit: PASS

### 📋 Tasks

#### Task 2.2.1: Extract Design Tokens (3h)
- [ ] Audit existing colors (47 → 25)
- [ ] Define typography scale (6 sizes)
- [ ] Define spacing scale (8 sizes)
- [ ] Create `tokens.yaml`

**Deliverable:** Design tokens file

#### Task 2.2.2: Build Atomic Components (8h)
- [ ] Button: Primary/Secondary/Tertiary + sizes
- [ ] Input: Text/Checkbox/Select + sizes
- [ ] Card: Base + variants (elevated, outlined)
- [ ] TypeScript types for all props

**Deliverable:** React components

#### Task 2.2.3: Accessibility & Storybook (4h)
- [ ] WCAG AA audit for each component
- [ ] Setup Storybook
- [ ] Document all component variants
- [ ] Create usage guidelines

**Deliverable:** Storybook + accessibility audit

#### Task 2.2.4: Testing (3h)
- [ ] Visual regression tests
- [ ] Accessibility tests
- [ ] Component interaction tests
- [ ] Performance tests

**Deliverable:** Test suite

#### Task 2.2.5: Integration (2h)
- [ ] Update Tailwind config with tokens
- [ ] Create component library export
- [ ] Code review + Storybook review

**Deliverable:** Integrated design system

### 🎯 Success Metrics

- Design tokens: 25 colors + 6 typography + 8 spacing
- Component variants: 15+ total
- WCAG compliance: 100% AA
- Test coverage: >90%
- Storybook: Deployed and accessible

---

## 📖 Story 2.3: Logging Centralization

**Story ID:** TECH-DEBT-001.2.3
**Type:** Infrastructure / Observability
**Points:** 9 (1.5 days estimated)
**Priority:** 🟡 HIGH
**Owner:** @dev (implementation)
**Status:** 📋 PLANNING

### 📝 Description

Centralize logging across all services using Winston, with consistent format and request ID tracking for better debugging.

### ✅ Acceptance Criteria

- [ ] Winston logger configured in all services
- [ ] Request ID middleware in all services
- [ ] Consistent log format across services
- [ ] Log levels: ERROR, WARN, INFO, DEBUG
- [ ] Structured logging (JSON format)
- [ ] No sensitive data in logs
- [ ] Logs aggregated in central location

### 📋 Tasks

#### Task 2.3.1: Setup Winston (2h)
- [ ] Configure Winston in each service
- [ ] Setup transport (file + console)
- [ ] Create logging middleware

**Deliverable:** Winston configuration

#### Task 2.3.2: Request ID Tracking (2h)
- [ ] Add request ID middleware
- [ ] Inject request ID into all logs
- [ ] Track request lifecycle

**Deliverable:** Middleware

#### Task 2.3.3: Migrate Existing Logs (3h)
- [ ] Replace console.log with Winston
- [ ] Standardize log messages
- [ ] Verify log format consistency

**Deliverable:** Migrated logging

#### Task 2.3.4: Testing & Deploy (2h)
- [ ] Verify logs working
- [ ] Deploy to staging
- [ ] Deploy to production

**Deliverable:** Deployment report

### 🎯 Success Metrics

- All services using Winston
- Request IDs tracked in 100% of logs
- Log format consistent
- No console.log in production code

---

## 📖 Story 2.4: Error Handling Standardization

**Story ID:** TECH-DEBT-001.2.4
**Type:** Architecture / Reliability
**Points:** 11 (1.5 days estimated)
**Priority:** 🟡 HIGH
**Owner:** @dev (implementation) + @architect (review)
**Status:** 📋 PLANNING

### 📝 Description

Standardize error handling across all services. Currently, different services return different error formats, confusing clients.

### ✅ Acceptance Criteria

- [ ] Standard error response format defined
- [ ] Error codes documented (400, 401, 403, 404, 500, etc.)
- [ ] All services return consistent format
- [ ] Error messages are user-friendly
- [ ] Errors logged consistently
- [ ] No sensitive data in error responses

### 📋 Tasks

#### Task 2.4.1: Define Error Format (2h)
- [ ] Create error schema
- [ ] Define error codes + messages
- [ ] Create documentation

**Deliverable:** Error handling guide

#### Task 2.4.2: Implement Error Handler (4h)
- [ ] Create error middleware for each service
- [ ] Implement error formatting
- [ ] Add error logging

**Deliverable:** Error middleware

#### Task 2.4.3: Migrate Error Handling (3h)
- [ ] Update error throws across services
- [ ] Standardize error responses
- [ ] Test error scenarios

**Deliverable:** Error handling implementation

#### Task 2.4.4: Deploy & Test (2h)
- [ ] Deploy to staging
- [ ] Test error scenarios
- [ ] Deploy to production

**Deliverable:** Deployment report

### 🎯 Success Metrics

- All services return consistent error format
- Error documentation complete
- Error logging working
- Zero format inconsistencies

---

## 🧪 Testing Across All Stories

### Unit Tests (8h)
- TypeScript type tests (4h)
- Component tests (4h)

### Integration Tests (4h)
- Component + design system tests
- API error handling tests

### Performance Tests (3h)
- Bundle size (TypeScript impact)
- Component render performance

### Security Tests (2h)
- No sensitive data in logs/errors
- CodeRabbit automated scans

**Total Testing:** 17-19h

---

## 📅 Sprint Schedule

### Week 3
- **Day 1-2:** TypeScript setup + component conversion
- **Day 3-4:** Design system core components
- **Day 5:** Logging + error handling setup

### Week 4
- **Day 6-7:** Component testing + Storybook
- **Day 8-9:** Logging migration + error handling refinement
- **Day 10:** Testing + deploy + sprint review

---

## 🎯 Team Allocation

| Role | Hours | Tasks |
|------|-------|-------|
| **@dev (James)** | 35-40h | TypeScript, Logging, Error handling |
| **@ux-design-expert (Uma)** | 15-20h | Design system core |
| **@qa (Quinn)** | 12-14h | Testing, accessibility audit |
| **@architect (Aria)** | 6-8h | Code review, guidance |

---

## 🚀 Definition of Done

- [ ] All code TypeScript compiled
- [ ] All components WCAG AA compliant
- [ ] All tests passing (>80% coverage)
- [ ] CodeRabbit: PASS (no CRITICAL/HIGH)
- [ ] Staging tested 24h
- [ ] Production deployment successful
- [ ] Documentation updated

---

## 📊 Success Metrics

By end of Sprint 2:
- ✅ TypeScript: 100% frontend
- ✅ Design system: 3 core components
- ✅ Logging: Standardized across all services
- ✅ Error handling: Unified format
- ✅ Type coverage: >95%
- ✅ WCAG compliance: 100% AA

---

**Sprint 2 Ready to Follow Sprint 1!**

---

Created by: Morgan (PM)
Date: 2026-02-08
Status: 📋 READY FOR SPRINT 1 COMPLETION
