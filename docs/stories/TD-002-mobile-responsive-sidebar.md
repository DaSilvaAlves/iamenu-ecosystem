# TD-002: Implement Mobile Responsive Sidebar

**Priority:** P0 - CRITICAL
**Estimated Hours:** 20-30h
**Owner:** @dev + @ux
**Sprint:** Tech Debt P0
**Status:** In Progress

---

## Story Statement

**As a** Portuguese restaurant owner accessing iaMenu on mobile,
**I want** a responsive sidebar that collapses on small screens,
**So that** I can use the application on my smartphone (70%+ of target users).

---

## Problem Description

The current sidebar has a fixed 280px width that blocks content on mobile devices. Portuguese restaurant owners primarily access the platform via smartphones, making this a critical blocker for user adoption.

### Current State

- Sidebar: 280px fixed width
- No mobile breakpoints
- Content hidden on screens < 560px
- No hamburger menu or drawer

---

## Acceptance Criteria

- [x] **AC1:** Sidebar collapses to hamburger menu on mobile (< 768px viewport)
- [x] **AC2:** Content is fully visible on iPhone SE (375px viewport)
- [x] **AC3:** Touch gestures work (swipe to close sidebar)
- [x] **AC4:** Desktop layout unchanged (> 1024px)
- [x] **AC5:** No horizontal scroll on any viewport
- [ ] **AC6:** Tested at breakpoints: 375px, 768px, 1024px, 1920px

---

## Technical Approach

### Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| < 768px | Sidebar hidden, hamburger menu visible |
| 768px - 1024px | Sidebar collapsed (icons only, 64px) |
| > 1024px | Sidebar expanded (full 280px) |

### Components to Modify

1. **Sidebar.jsx** - Add responsive states
2. **TopBar.jsx** - Add hamburger menu button
3. **App.jsx** - Add sidebar state management
4. **tailwind.config.js** - Verify breakpoints

### Implementation Pattern

```javascript
// Use Zustand for sidebar state
const useSidebarStore = create((set) => ({
  isOpen: false,
  isMobile: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setMobile: (value) => set({ isMobile: value, isOpen: false }),
}));

// Detect mobile on mount and resize
useEffect(() => {
  const checkMobile = () => setMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

---

## Tasks

### Phase 1: State Management (2-3h)
- [x] **Task 1:** Add sidebar state to uiStore.js (isOpen, isMobile, toggle)
- [x] **Task 2:** Add useEffect for viewport detection
- [x] **Task 3:** Test state changes on resize

### Phase 2: Sidebar Component (8-12h)
- [x] **Task 4:** Create mobile sidebar variant (drawer overlay)
- [x] **Task 5:** Add slide-in animation with Framer Motion
- [x] **Task 6:** Add backdrop overlay when open on mobile
- [x] **Task 7:** Implement swipe gesture to close (custom touch handlers)
- [x] **Task 8:** Add collapsed state for tablet (icons only)

### Phase 3: TopBar Integration (3-4h)
- [x] **Task 9:** Add hamburger menu button (visible < 768px)
- [x] **Task 10:** Connect button to sidebar toggle
- [x] **Task 11:** Add menu icon from Lucide

### Phase 4: Layout Adjustments (4-6h)
- [x] **Task 12:** Update App.jsx main content area margins
- [ ] **Task 13:** Test all pages at each breakpoint
- [x] **Task 14:** Fix any overflow/scroll issues
- [x] **Task 15:** Verify no content clipping

### Phase 5: Testing (3-5h)
- [ ] **Task 16:** Test on Chrome DevTools device emulator
- [ ] **Task 17:** Test on real mobile device (if available)
- [ ] **Task 18:** Test touch gestures
- [ ] **Task 19:** Verify desktop layout unchanged

---

## Test Plan

| Viewport | Expected Behavior | Test |
|----------|-------------------|------|
| 375px (iPhone SE) | Hamburger menu, drawer sidebar | Manual |
| 768px (iPad) | Collapsed sidebar (icons) | Manual |
| 1024px | Expanded sidebar | Manual |
| 1920px | Expanded sidebar | Manual |

### Test Cases

1. Open sidebar via hamburger menu
2. Close sidebar via backdrop tap
3. Close sidebar via swipe left
4. Navigate while sidebar open (should close on mobile)
5. Resize from desktop to mobile (sidebar should hide)

---

## Design Reference

```
Mobile (< 768px):
┌─────────────────────────┐
│ ☰  iaMenu    🔔  👤    │  ← Hamburger + TopBar
├─────────────────────────┤
│                         │
│     Main Content        │
│     (full width)        │
│                         │
└─────────────────────────┘

Tablet (768px - 1024px):
┌───┬──────────────────────┐
│ ☰ │       TopBar         │
├───┼──────────────────────┤
│📊 │                      │
│🏪 │    Main Content      │
│📚 │                      │
│📈 │                      │
└───┴──────────────────────┘
(64px collapsed icons)

Desktop (> 1024px):
┌──────────┬───────────────┐
│          │    TopBar     │
├──────────┼───────────────┤
│ Dashboard│               │
│ Community│  Main Content │
│ Market...│               │
│ Academy  │               │
└──────────┴───────────────┘
(280px expanded)
```

---

## Definition of Done

- [ ] All code changes merged to main branch
- [x] No linting errors (build succeeds)
- [ ] Tested at all 4 breakpoints
- [x] Touch gestures working (swipe to close)
- [x] Desktop layout unchanged
- [ ] Deployed to production

---

## References

- **Source:** `docs/prd/technical-debt-FINAL.md` Section 11 (TECH-DEBT-002)
- **Sidebar:** `frontend/apps/prototype-vision/src/components/Sidebar.jsx`
- **TopBar:** `frontend/apps/prototype-vision/src/components/TopBar.jsx`
- **UI Store:** `frontend/apps/prototype-vision/src/stores/uiStore.js`

---

**Created:** 2026-02-03
**Workflow:** Brownfield Tech Debt Sprint
