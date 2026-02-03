# TD-001: Fix Hardcoded Localhost URLs

**Priority:** P0 - CRITICAL
**Estimated Hours:** 1-2h
**Owner:** @dev
**Sprint:** Tech Debt P0
**Status:** Ready

---

## Story Statement

**As a** user accessing the Marketplace in production,
**I want** all API calls to use the correct production URLs,
**So that** Marketplace features work correctly on prototype-vision.vercel.app.

---

## Problem Description

Currently, 8 frontend files have hardcoded `localhost:300X` URLs that break Marketplace functionality in production. The `api.js` config file correctly detects the environment, but these files bypass it.

### Files Affected

| File | Line(s) | Current URL |
|------|---------|-------------|
| `ComparisonTab.jsx` | 199 | `http://localhost:3002` |
| `businessAPI.js` | 6 | `http://localhost:3004` |
| `IncomingRfqTab.jsx` | 30, 87 | `http://localhost:3002` |
| `Marketplace.jsx` | 47, 146 | `http://localhost:3002` |
| `ProfilesTab.jsx` | 49, 155 | `http://localhost:3002` |
| `RfqTab.jsx` | 29, 111 | `http://localhost:3002` |
| `RfqRequestsTab.jsx` | 22 | `http://localhost:3002` |

---

## Acceptance Criteria

- [ ] **AC1:** All 8 files updated to import from `API_CONFIG` in `src/config/api.js`
- [ ] **AC2:** `grep -r "localhost:300" frontend/` returns 0 results (excluding node_modules)
- [ ] **AC3:** Local development works correctly (localhost URLs used in dev)
- [ ] **AC4:** Production build works correctly (Railway URLs used in prod)
- [ ] **AC5:** All Marketplace pages load correctly in production

---

## Technical Approach

### Solution

Replace hardcoded URLs with imports from the centralized API config:

```javascript
// Before
const response = await fetch('http://localhost:3002/api/v1/marketplace/suppliers');

// After
import { API_CONFIG } from '../config/api';
const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/suppliers`);
```

### Reference File

`frontend/apps/prototype-vision/src/config/api.js` already handles environment detection:
- Development: `localhost:300X`
- Production: Railway URLs

---

## Tasks

- [ ] **Task 1:** Update `ComparisonTab.jsx` - import API_CONFIG and replace URLs
- [ ] **Task 2:** Update `businessAPI.js` - import API_CONFIG and replace URLs
- [ ] **Task 3:** Update `IncomingRfqTab.jsx` - import API_CONFIG and replace URLs
- [ ] **Task 4:** Update `Marketplace.jsx` - import API_CONFIG and replace URLs
- [ ] **Task 5:** Update `ProfilesTab.jsx` - import API_CONFIG and replace URLs
- [ ] **Task 6:** Update `RfqTab.jsx` - import API_CONFIG and replace URLs
- [ ] **Task 7:** Update `RfqRequestsTab.jsx` - import API_CONFIG and replace URLs
- [ ] **Task 8:** Run grep to verify no hardcoded URLs remain
- [ ] **Task 9:** Test locally - verify all Marketplace features work
- [ ] **Task 10:** Deploy to Vercel and verify production

---

## Test Plan

1. **Local Dev Test:**
   - Run `npm run dev:frontend`
   - Navigate to all Marketplace tabs
   - Verify API calls go to localhost:3002

2. **Production Test:**
   - Build: `npm run build`
   - Check bundle for correct Railway URLs
   - Deploy to Vercel staging
   - Test all Marketplace pages

---

## Definition of Done

- [ ] All code changes merged to main branch
- [ ] No linting errors
- [ ] Manual testing completed
- [ ] Deployed to production
- [ ] Verified working in production

---

## References

- **Source:** `docs/prd/technical-debt-FINAL.md` Section 11 (TECH-DEBT-001)
- **Config File:** `frontend/apps/prototype-vision/src/config/api.js`

---

**Created:** 2026-02-03
**Workflow:** Brownfield Tech Debt Sprint
