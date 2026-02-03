# iaMenu Ecosystem Frontend Specification

**Auditor:** @ux-design-expert
**Date:** 2026-02-02
**Workflow:** Brownfield Discovery Phase 3

---

## Executive Summary

The iaMenu frontend is a React 18 application built with Vite, using JavaScript (not TypeScript). It serves as the primary interface for Portuguese restaurant owners, providing access to Community, Marketplace, Academy, and Business Intelligence features. The codebase contains **69 React component files** with significant technical debt and UX issues that need addressing.

---

## 1. Component Inventory

### 1.1 Total Component Count: 82+ Components

**Core Layout Components (4)**
| Component | Path | Purpose |
|-----------|------|---------|
| `App.jsx` | `/src/App.jsx` | Main app shell with routing |
| `Sidebar.jsx` | `/src/components/Sidebar.jsx` | Navigation sidebar (280px fixed) |
| `TopBar.jsx` | `/src/components/TopBar.jsx` | Header with search, notifications, profile |
| `ErrorBoundary.jsx` | `/src/components/ErrorBoundary.jsx` | Error catching (class component) |

**UI Component Library (6)** - Located at `/src/components/ui/`
| Component | Variants | Notes |
|-----------|----------|-------|
| `Button.jsx` | primary, secondary, danger, ghost, link | Uses framer-motion |
| `Card.jsx` | default, elevated, outlined, interactive | Has sub-components |
| `Modal.jsx` | sm, md, lg, xl, full | Portal-based |
| `Input.jsx` | text, email, password, search, textarea | With validation |
| `Loading.jsx` | Spinner, Skeleton, SkeletonCard, LoadingOverlay, LoadingDots | Multiple exports |
| `Badge.jsx` | default, primary, success, warning, danger, info, outline | Includes StatusBadge, CountBadge |

**Business Intelligence Components (5)**
- `SalesTrendChart.jsx` - Chart.js line chart
- `DemandForecastChart.jsx` - AI prediction visualization
- `PeakHoursHeatmap.jsx` - Heatmap grid
- `BenchmarkChart.jsx` - Comparison chart
- `MenuEngineeringMatrix.jsx` - Star/Dog/Gem/Popular matrix

### 1.2 View Components (46 total)

**Main Views (24)**
| View | Route | Purpose |
|------|-------|---------|
| `CommunityView.jsx` | `/`, `/comunidade` | Social feed |
| `DashboardBI.jsx` | `/dashboard` | Business intelligence |
| `Marketplace.jsx` | `/marketplace` | Supplier directory |
| `Academy.jsx` | `/aulas` | Learning platform |
| `ProfileView.jsx` | `/perfil` | User profile |
| `GroupsView.jsx` | `/grupos` | Community groups |
| `GastroLens.jsx` | `/gastrolens` | AI photo analysis |
| `OnboardingView.jsx` | `/onboarding` | Setup wizard |
| `FoodCostView.jsx` | `/foodcost` | Cost management |
| `StaffAIView.jsx` | `/equipas` | Staff management |
| `ReputacaoOnlineView.jsx` | `/reputacao` | Reviews management |
| `HubsRegionaisView.jsx` | `/hubs` | Regional hubs |

**Marketplace Sub-views (6)**
- `ComparisonTab.jsx`, `RfqTab.jsx`, `RfqRequestsTab.jsx`
- `IncomingRfqTab.jsx`, `ResponsesTab.jsx`, `ProfilesTab.jsx`

**Unused/Legacy Views (2)**
- `ProductsView.jsx` - No route configured
- `OrdersView.jsx` - No route configured

---

## 2. Design System

### 2.1 Tailwind Configuration

```javascript
colors: {
  primary: "#ff4d00",        // Brand orange
  "primary-hover": "#e64500",
  "bg-dark": "#0a0a0a",
  "bg-card": "#141414",
  "bg-sidebar": "#0f0f0f",
  "text-muted": "#a0a0a0",
  "border": "#222222",
}
```

### 2.2 Typography
- **Font Family:** `Outfit` (Google Fonts)
- **Icon Font:** Material Symbols Outlined
- **Icon Library:** Lucide React

### 2.3 Theme
- Dark theme only (no light mode implemented)
- Glass effect: `.glass-panel`, `.glass-effect`

---

## 3. Page Structure & Routing

### 3.1 Layout Structure

```
+--------------------------------------------------+
|                    TopBar (64px)                  |
+--------------------------------------------------+
|  Sidebar   |                                     |
|   (280px)  |         Main Content                |
|            |        (max-width: 1200px)          |
|   sticky   |                                     |
+------------+-------------------------------------+
```

### 3.2 Route Configuration

**Router:** React Router v7.11.0

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | `CommunityView` | No |
| `/dashboard` | `DashboardBI` | Yes |
| `/marketplace` | `Marketplace` | No |
| `/aulas` | `Academy` | No |
| `/perfil` | `ProfileView` | Yes |
| `/onboarding` | `OnboardingView` | Yes |
| `/gastrolens` | `GastroLens` | Yes |

---

## 4. State Management

### 4.1 Architecture

**Primary:** Zustand v5.0.11 with persistence

**Stores:**
| Store | Purpose |
|-------|---------|
| `authStore.js` | User auth, tokens |
| `uiStore.js` | Theme, sidebar, modals, toasts |
| `notificationStore.js` | Notifications, WebSocket state |

### 4.2 Local State Pattern

Most views use `useState` + `useEffect` directly:
- 40 components have `useEffect(() => {` patterns
- No global data caching beyond auth/notifications

---

## 5. API Integration

### 5.1 Two Parallel Implementations (TECHNICAL DEBT)

1. **Legacy API** (`/src/services/api.js`)
   - Uses native `fetch()`
   - 839 lines, manual token management

2. **Modern API** (`/src/lib/api/client.js`)
   - Uses Axios
   - Token refresh interceptors
   - 272 lines

### 5.2 API Configuration

**File:** `/src/config/api.js`

```javascript
API_CONFIG = {
  COMMUNITY_API: 'http://localhost:3001/api/v1/community',
  MARKETPLACE_API: 'http://localhost:3002/api/v1/marketplace',
  BUSINESS_API: 'http://localhost:3004/api/v1/business',
  ACADEMY_API: 'http://localhost:3003/api/v1/academy',
}
```

---

## 6. UX Issues Identified

### 6.1 Critical UX Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| **No auth protection on routes** | HIGH | Users access protected pages without login |
| **Hardcoded localhost URLs** | HIGH | Production broken for some features |
| **No mobile responsiveness** | HIGH | Fixed 280px sidebar fails on mobile |
| **No loading states on navigation** | MEDIUM | Abrupt transitions |
| **Duplicate onboarding components** | MEDIUM | Confusing flow |

### 6.2 Accessibility Issues

| Issue | Impact |
|-------|--------|
| Missing ARIA labels (99%+ components) | Screen readers fail |
| No keyboard navigation | Keyboard users blocked |
| Color contrast issues | WCAG AA fail |
| No focus indicators | Focus invisible |

### 6.3 Navigation Issues

1. Group navigation broken (uses state, not URL)
2. Back button doesn't work for group detail
3. No breadcrumbs for deep navigation
4. Active state only shows on exact path match

---

## 7. Technical Debt

### 7.1 Critical Technical Debt

| Issue | Files Affected | Priority |
|-------|----------------|----------|
| **Hardcoded localhost URLs** | 12+ files | P0 |
| **Duplicate StandardPlaceholder** | App.jsx, Marketplace.jsx | P1 |
| **Duplicate API implementations** | api.js, client.js, businessAPI.js | P1 |
| **No TypeScript** | All 69 files | P2 |
| **No unit tests** | 0 test files | P2 |

### 7.2 Hardcoded URLs Found

```
ComparisonTab.jsx:199   - http://localhost:3002
businessAPI.js:6        - http://localhost:3004
IncomingRfqTab.jsx:30   - http://localhost:3002
Marketplace.jsx:47      - http://localhost:3002
ProfilesTab.jsx:49      - http://localhost:3002
RfqTab.jsx:29           - http://localhost:3002
RfqRequestsTab.jsx:22   - http://localhost:3002
```

### 7.3 Code Duplication

| Pattern | Occurrences | Resolution |
|---------|-------------|------------|
| `StandardPlaceholder` component | 2 definitions | Extract to shared |
| Loading skeleton inline | 10+ views | Use `Loading.Skeleton` |
| Token management | 3 implementations | Consolidate to authStore |
| API fetch helpers | 3 implementations | Use lib/api/client.js only |

### 7.4 Missing Patterns

1. No error boundaries per route
2. No suspense/lazy loading
3. No data prefetching
4. No optimistic updates
5. No form validation library

---

## 8. Dependencies

### 8.1 Key Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-router-dom | ^7.11.0 | Routing |
| zustand | ^5.0.11 | State management |
| axios | ^1.13.4 | HTTP client |
| framer-motion | ^11.0.0 | Animations |
| chart.js | ^4.5.1 | Charts |
| tailwindcss | ^3.4.1 | CSS framework |
| lucide-react | ^0.300.0 | Icons |

---

## 9. Recommendations

### 9.1 Immediate Fixes (P0)

1. **Fix hardcoded URLs:** Replace all `localhost:300x` with `API_CONFIG.*`
2. **Add route protection:** Implement auth guards for protected routes
3. **Add mobile breakpoints:** Make sidebar collapsible/drawer on mobile

### 9.2 Short-term Improvements (P1)

1. **Consolidate API layer:** Use only `/lib/api/client.js`
2. **Add accessibility:** ARIA labels, focus management, keyboard nav
3. **Extract shared components:** StandardPlaceholder, loading states
4. **Add error boundaries:** Per-route error handling

### 9.3 Long-term Improvements (P2)

1. **Migrate to TypeScript:** Type safety for props, API responses
2. **Add test coverage:** Jest + React Testing Library
3. **Implement code splitting:** Route-based lazy loading
4. **Add Storybook:** Component documentation

---

## Critical Files

- `src/config/api.js` - Central API configuration
- `src/lib/api/client.js` - Modern API client (use this one)
- `src/App.jsx` - Main routing (add auth guards here)
- `src/components/Sidebar.jsx` - Needs mobile responsiveness
- `src/services/api.js` - Legacy API (deprecate this)
