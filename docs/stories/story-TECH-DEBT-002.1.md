# Story 2.1: TypeScript Migration (Frontend)

**Story ID:** TECH-DEBT-002.1
**Epic:** TECH-DEBT-001 (Technical Debt Resolution) → Phase 2: Architecture
**Type:** Frontend / Code Quality
**Points:** 34 (5 days estimated)
**Priority:** 🔴 HIGH
**Owner:** @dev
**Sprint:** Sprint 2 (Weeks 3-4)
**Dependencies:** ✅ Sprint 1 Complete (TECH-DEBT-001.1, 001.2, 001.3)

---

## 📝 Story Description

Migrate the entire frontend codebase from JavaScript to TypeScript to achieve:
- **Type safety** - Catch errors at compile-time instead of runtime
- **Better IDE support** - Autocomplete, refactoring, navigation
- **Improved maintainability** - Self-documenting code via types
- **Developer experience** - Faster development with fewer bugs

Currently `frontend/apps/prototype-vision/` is pure JavaScript (React 18 + Vite), which lacks type safety benefits and makes refactoring risky. TypeScript migration will provide foundation for Phase 2 architecture work.

**Why High Priority:**
- Blocks Phase 2 architecture changes (need type-safe foundation)
- Reduces future bugs and maintenance costs
- Enables better tooling and code analysis
- Quick win with immediate value

---

## ✅ Acceptance Criteria

- [ ] All `.js` files converted to `.ts` or `.tsx` (React components)
- [ ] `tsconfig.json` configured with strict mode enabled
- [ ] TypeScript compiler passes with **zero errors**
- [ ] Type coverage ≥95% across codebase
- [ ] No runtime type errors in development
- [ ] React components properly typed (props, state, refs)
- [ ] All imports/exports type-checked
- [ ] Build pipeline works with TypeScript (Vite + tsc)
- [ ] No breaking changes to existing functionality
- [ ] Test coverage ≥80% for TypeScript code

---

## 📋 Tasks

### Task 2.1.1: Setup TypeScript Infrastructure
- [ ] Install TypeScript and type definitions (@types/react, @types/node, etc.)
- [ ] Create `tsconfig.json` with strict mode
- [ ] Configure Vite for TypeScript
- [ ] Setup build pipeline (tsc + Vite)
- [ ] Create TypeScript linting rules (ESLint + TS plugin)

**Time Estimate:** 1.5h
**Subtasks:**
  - [ ] Install dependencies (0.5h)
  - [ ] Create tsconfig.json (0.5h)
  - [ ] Configure Vite + linting (0.5h)

**Deliverable:** TypeScript configuration files

---

### Task 2.1.2: Migrate Component Files
- [ ] Rename `.jsx` files to `.tsx`
- [ ] Add React.FC<Props> types to components
- [ ] Type component props (interfaces)
- [ ] Type component state and hooks
- [ ] Type event handlers and callbacks

**Time Estimate:** 8h
**Subtasks:**
  - [ ] Audit components (1h)
  - [ ] Create prop interfaces (2h)
  - [ ] Convert components (3h)
  - [ ] Fix type errors (2h)

**Deliverable:** All `.tsx` components with types

---

### Task 2.1.3: Migrate Utility/Service Files
- [ ] Rename `.js` utilities to `.ts`
- [ ] Type function parameters and return values
- [ ] Type object shapes (interfaces for config, API responses)
- [ ] Type arrays and collections
- [ ] Add type guards where needed

**Time Estimate:** 4h
**Subtasks:**
  - [ ] Audit utilities (0.5h)
  - [ ] Create type definitions (1.5h)
  - [ ] Convert files (1.5h)
  - [ ] Fix errors (0.5h)

**Deliverable:** All `.ts` utility files with types

---

### Task 2.1.4: Migrate Configuration Files
- [ ] Convert `vite.config.ts` (already TypeScript-friendly)
- [ ] Convert `tailwind.config.ts`
- [ ] Create `.env.d.ts` for environment variables
- [ ] Type React Router configuration
- [ ] Type Framer Motion configs

**Time Estimate:** 1h
**Subtasks:**
  - [ ] Identify config files (0.2h)
  - [ ] Add types (0.5h)
  - [ ] Test configs (0.3h)

**Deliverable:** Typed configuration files

---

### Task 2.1.5: Testing & Validation
- [ ] Run TypeScript compiler (zero errors target)
- [ ] Run ESLint with TypeScript plugin
- [ ] Run type coverage analysis (target: ≥95%)
- [ ] Run existing tests (ensure no breakage)
- [ ] Manual testing in browser

**Time Estimate:** 2h
**Subtasks:**
  - [ ] Compiler validation (0.5h)
  - [ ] Type coverage analysis (0.5h)
  - [ ] Run tests (0.5h)
  - [ ] Manual testing (0.5h)

**Deliverable:** Type coverage report

---

### Task 2.1.6: Code Review & Documentation
- [ ] Run CodeRabbit on TypeScript changes
- [ ] Code review with @architect
- [ ] Update development documentation
- [ ] Create TypeScript style guide
- [ ] Update README with TS setup

**Time Estimate:** 1h
**Subtasks:**
  - [ ] CodeRabbit review (0.3h)
  - [ ] Code review (0.3h)
  - [ ] Documentation (0.4h)

**Deliverable:** Code review report + updated docs

---

## 📊 QA Gate Requirements

**Before Merge:**
- [ ] TypeScript compiler: Zero errors
- [ ] Type coverage: ≥95%
- [ ] ESLint + TS rules: PASS
- [ ] All existing tests: PASS
- [ ] No breaking changes
- [ ] CodeRabbit: Zero HIGH/CRITICAL issues

**Before Production:**
- [ ] Build pipeline: Successful
- [ ] Manual testing: PASS in browser
- [ ] Performance: No regression vs JavaScript
- [ ] Bundle size: No significant increase
- [ ] @architect approval

---

## 🧪 Testing Strategy

### TypeScript Compiler Validation
```bash
npm run build  # Should pass without errors
tsc --noEmit   # Type check only
```

### Type Coverage Analysis
```bash
npm install --save-dev type-coverage
type-coverage --at-least 95  # Check coverage
```

### ESLint with TypeScript
```bash
npm run lint   # Should pass with TS rules
```

### Manual Testing
- Load app in browser
- Verify all pages work
- Check console for errors
- Test interactions

---

## 📚 Dev Notes

### File Conversion Pattern

**Before (JavaScript):**
```javascript
// src/components/Header.jsx
import React from 'react';

export function Header({ title, onClose }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

**After (TypeScript):**
```typescript
// src/components/Header.tsx
import React, { FC } from 'react';

interface HeaderProps {
  title: string;
  onClose: () => void;
}

export const Header: FC<HeaderProps> = ({ title, onClose }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
```

### Key Type Patterns

**React Components:**
```typescript
import { FC, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<Props> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};
```

**Hooks:**
```typescript
import { useState } from 'react';

interface User {
  id: string;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
```

**Event Handlers:**
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // submit logic
};
```

---

## 📁 File List

**Task 2.1.1 Deliverables:**
- [ ] `tsconfig.json` (created)
- [ ] `frontend/apps/prototype-vision/vite.config.ts` (updated)
- [ ] ESLint TypeScript config (created/updated)

**Task 2.1.2 Deliverables:**
- [ ] `src/components/**/*.tsx` (converted from .jsx)
- [ ] Component interfaces (*.types.ts or inline)

**Task 2.1.3 Deliverables:**
- [ ] `src/utils/**/*.ts` (converted from .js)
- [ ] `src/services/**/*.ts` (converted from .js)
- [ ] `src/config/**/*.ts` (converted from .js)
- [ ] `src/types/**/*.ts` (type definitions)

**Task 2.1.4 Deliverables:**
- [ ] Configuration files (TypeScript versions)
- [ ] `.env.d.ts` (environment types)

**Task 2.1.5 Deliverables:**
- [ ] Type coverage report
- [ ] Build output (no errors)

**Task 2.1.6 Deliverables:**
- [ ] Code review report (CodeRabbit)
- [ ] Updated documentation
- [ ] TypeScript style guide

---

## 🔄 Dev Agent Record

### Checkboxes Completed
- [ ] Task 2.1.1: TypeScript Setup (0/1)
- [ ] Task 2.1.2: Component Migration (0/1)
- [ ] Task 2.1.3: Utility Migration (0/1)
- [ ] Task 2.1.4: Config Migration (0/1)
- [ ] Task 2.1.5: Testing & Validation (0/1)
- [ ] Task 2.1.6: Review & Documentation (0/1)

### Debug Log
- **2026-02-11**: Story 2.1 created and ready for development

### Completion Notes
- TBD: Will be updated as tasks progress

---

## 🚀 Definition of Done

Story completion status:
- [ ] All tasks marked [x] - IN PROGRESS
- [ ] TypeScript compiler: Zero errors - PENDING
- [ ] Type coverage: ≥95% verified - PENDING
- [ ] All tests passing - PENDING
- [ ] No breaking changes verified - PENDING
- [ ] CodeRabbit: PASS (no HIGH issues) - PENDING
- [ ] Staging deployed & tested - PENDING
- [ ] Production deployed successfully - PENDING
- [ ] File List complete - IN PROGRESS

**Final Status:** 📋 **READY FOR DEV**
**Owner:** @dev
**Next Step:** Activate @dev with `*develop TECH-DEBT-002.1`

---

**Ready to start: `*develop TECH-DEBT-002.1`**
