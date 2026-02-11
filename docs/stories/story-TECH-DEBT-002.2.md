# Story 2.2: Design System Foundation (Core Components)

**Story ID:** TECH-DEBT-002.2
**Epic:** TECH-DEBT-001 (Technical Debt Resolution) → Phase 2: Architecture
**Type:** Frontend / Design System
**Points:** 34 (5 days estimated)
**Priority:** 🔴 HIGH
**Owner:** @dev
**Sprint:** Sprint 2 (Weeks 3-4)
**Dependencies:** ✅ TECH-DEBT-002.1 (TypeScript Migration) recommended but not blocking

---

## 📝 Story Description

Create foundational design system with 3 core atomic components (Button, Input, Card) that will:
- **Establish consistency** - Unified styling across all UI
- **Improve maintainability** - Single source of truth for components
- **Enable rapid development** - Reusable components for future features
- **Support accessibility** - WCAG AA compliance from the start

Currently, UI components are scattered across the app with inconsistent styling, making it hard to maintain and extend. A design system foundation enables Phase 2 architecture work by providing a solid component library for new features.

**Why High Priority:**
- Blocks Phase 2 feature development (need consistent components)
- Foundation for design consistency
- Accessibility compliance requirement
- Enables rapid UI development

---

## ✅ Acceptance Criteria

- [ ] Button component: 3+ variants (primary, secondary, tertiary)
- [ ] Input component: 3+ variants (text, password, email, textarea)
- [ ] Card component: 3+ variants (elevated, outlined, filled)
- [ ] All components have size variants (small, medium, large)
- [ ] All components support disabled state
- [ ] All components support loading/pending state
- [ ] Storybook documentation created for all components
- [ ] All components tested for WCAG AA accessibility
- [ ] TypeScript types for all props
- [ ] CSS-in-JS or Tailwind styling implemented
- [ ] No breaking changes to existing components

---

## 📋 Tasks

### Task 2.2.1: Setup Storybook & Component Library
- [ ] Install Storybook for React
- [ ] Configure Storybook for TypeScript
- [ ] Create component directory structure
- [ ] Setup shared styles/tokens (Tailwind theme)
- [ ] Create story template format

**Time Estimate:** 2h
**Subtasks:**
  - [ ] Install Storybook (0.5h)
  - [ ] Configure TypeScript (0.5h)
  - [ ] Create structure (0.5h)
  - [ ] Setup styling tokens (0.5h)

**Deliverable:** Storybook configured and running

---

### Task 2.2.2: Build Button Component
- [ ] Create Button component with variants (primary, secondary, tertiary)
- [ ] Add size variants (sm, md, lg)
- [ ] Add state variants (default, hover, active, disabled, loading)
- [ ] Type Button props (variant, size, disabled, onClick, etc.)
- [ ] Add Storybook stories for all variants
- [ ] Test accessibility (keyboard, screen reader, contrast)

**Time Estimate:** 3h
**Subtasks:**
  - [ ] Component implementation (1h)
  - [ ] Storybook stories (1h)
  - [ ] Accessibility testing (1h)

**Deliverable:** Button component in Storybook

---

### Task 2.2.3: Build Input Component
- [ ] Create Input component with types (text, email, password, number, textarea)
- [ ] Add size variants (sm, md, lg)
- [ ] Add state variants (default, focused, disabled, error)
- [ ] Add label, placeholder, helper text support
- [ ] Type Input props (type, value, onChange, disabled, etc.)
- [ ] Add Storybook stories for all variants
- [ ] Test accessibility (labels, ARIA, keyboard nav)

**Time Estimate:** 3h
**Subtasks:**
  - [ ] Component implementation (1h)
  - [ ] Storybook stories (1h)
  - [ ] Accessibility testing (1h)

**Deliverable:** Input component in Storybook

---

### Task 2.2.4: Build Card Component
- [ ] Create Card component with variants (elevated, outlined, filled)
- [ ] Add size variants (sm, md, lg)
- [ ] Support header, body, footer sections
- [ ] Add hover/interactive states
- [ ] Type Card props (variant, children, onClick, etc.)
- [ ] Add Storybook stories for all variants
- [ ] Test accessibility (semantic HTML, heading hierarchy)

**Time Estimate:** 2h
**Subtasks:**
  - [ ] Component implementation (0.75h)
  - [ ] Storybook stories (0.75h)
  - [ ] Accessibility testing (0.5h)

**Deliverable:** Card component in Storybook

---

### Task 2.2.5: Create Design Tokens & Documentation
- [ ] Define color palette (primary, secondary, error, success, warning)
- [ ] Define typography scale (h1-h6, body, caption)
- [ ] Define spacing scale (4px, 8px, 12px, 16px, etc.)
- [ ] Define border radius tokens
- [ ] Create design tokens documentation
- [ ] Add component usage guidelines
- [ ] Create accessibility guidelines

**Time Estimate:** 2h
**Subtasks:**
  - [ ] Design tokens definition (1h)
  - [ ] Documentation (1h)

**Deliverable:** Design tokens documentation

---

### Task 2.2.6: Testing & Accessibility Validation
- [ ] Run unit tests for components
- [ ] Run accessibility audit (axe-core or Pa11y)
- [ ] Manual WCAG AA compliance testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing
- [ ] Verify Storybook build

**Time Estimate:** 2h
**Subtasks:**
  - [ ] Unit tests (0.5h)
  - [ ] Accessibility audit (0.75h)
  - [ ] Manual testing (0.75h)

**Deliverable:** Accessibility audit report

---

### Task 2.2.7: Code Review & Documentation
- [ ] CodeRabbit review of component code
- [ ] Code review with @ux-design-expert
- [ ] Generate component documentation
- [ ] Update README with design system guidance
- [ ] Create component implementation guide

**Time Estimate:** 1.5h
**Subtasks:**
  - [ ] CodeRabbit review (0.3h)
  - [ ] Code review (0.5h)
  - [ ] Documentation (0.7h)

**Deliverable:** Code review report + component docs

---

## 📊 QA Gate Requirements

**Before Merge:**
- [ ] All 3 components created (Button, Input, Card)
- [ ] All variants implemented (3+ per component)
- [ ] Storybook documentation complete
- [ ] WCAG AA accessibility audit: PASS
- [ ] Unit tests: ≥80% coverage
- [ ] TypeScript: Zero errors
- [ ] CodeRabbit: Zero HIGH/CRITICAL issues

**Before Production:**
- [ ] Manual accessibility testing: PASS
- [ ] Cross-browser testing: PASS
- [ ] Mobile responsiveness: PASS
- [ ] Performance: No significant impact
- [ ] @ux-design-expert approval

---

## 🧪 Testing Strategy

### Component Unit Tests
```typescript
// Button component test
describe('Button', () => {
  it('renders with primary variant', () => {
    const { getByRole } = render(<Button variant="primary">Click me</Button>);
    expect(getByRole('button')).toHaveClass('button--primary');
  });

  it('handles click event', () => {
    const onClick = jest.fn();
    const { getByRole } = render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Click</Button>);
    expect(getByRole('button')).toBeDisabled();
  });
});
```

### Accessibility Testing
```bash
# Run accessibility audit
npm install --save-dev @axe-core/react
axe-core-react --file src/components/Button.tsx

# Check contrast ratios (WCAG AA = 4.5:1)
# Check keyboard navigation (tab, enter, space)
# Check screen reader compatibility
```

### Storybook Stories
```typescript
// Button.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Click me',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...',
  },
};
```

---

## 📚 Dev Notes

### Component Structure
```
src/components/
├── Button/
│   ├── Button.tsx          # Component
│   ├── Button.types.ts     # Types
│   ├── Button.module.css   # Styles (or use Tailwind)
│   ├── Button.test.tsx     # Tests
│   └── Button.stories.tsx  # Storybook
├── Input/
│   ├── Input.tsx
│   ├── Input.types.ts
│   ├── Input.module.css
│   ├── Input.test.tsx
│   └── Input.stories.tsx
├── Card/
│   ├── Card.tsx
│   ├── Card.types.ts
│   ├── Card.module.css
│   ├── Card.test.tsx
│   └── Card.stories.tsx
└── index.ts                # Export all components
```

### Design Tokens (Tailwind Config)
```typescript
// tailwind.config.ts
export default {
  theme: {
    colors: {
      primary: '#007AFF',
      secondary: '#5AC8FA',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
    },
    spacing: {
      'xs': '4px',
      'sm': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px',
    },
    borderRadius: {
      'none': '0',
      'sm': '4px',
      'md': '8px',
      'lg': '12px',
      'full': '9999px',
    },
  },
};
```

### Accessibility Best Practices
- Use semantic HTML (`<button>`, `<input>`, not `<div>` as button)
- Include ARIA labels for screen readers
- Ensure color contrast ≥4.5:1 for normal text (WCAG AA)
- Support keyboard navigation (Tab, Enter, Space, Arrow keys)
- Provide focus indicators (visible outline)
- Test with screen readers (NVDA, JAWS)

---

## 📁 File List

**Task 2.2.1 Deliverables:**
- [ ] `.storybook/` configuration directory
- [ ] `src/components/` directory structure
- [ ] Tailwind theme configuration

**Task 2.2.2 Deliverables:**
- [ ] `src/components/Button/Button.tsx`
- [ ] `src/components/Button/Button.types.ts`
- [ ] `src/components/Button/Button.stories.tsx`
- [ ] `src/components/Button/Button.test.tsx`

**Task 2.2.3 Deliverables:**
- [ ] `src/components/Input/Input.tsx`
- [ ] `src/components/Input/Input.types.ts`
- [ ] `src/components/Input/Input.stories.tsx`
- [ ] `src/components/Input/Input.test.tsx`

**Task 2.2.4 Deliverables:**
- [ ] `src/components/Card/Card.tsx`
- [ ] `src/components/Card/Card.types.ts`
- [ ] `src/components/Card/Card.stories.tsx`
- [ ] `src/components/Card/Card.test.tsx`

**Task 2.2.5 Deliverables:**
- [ ] Design tokens documentation
- [ ] Component usage guidelines
- [ ] `src/components/index.ts` (exports)

**Task 2.2.6 Deliverables:**
- [ ] Unit test results (coverage report)
- [ ] Accessibility audit report

**Task 2.2.7 Deliverables:**
- [ ] Code review report (CodeRabbit + manual)
- [ ] Updated documentation
- [ ] Component implementation guide

---

## 🔄 Dev Agent Record

### Checkboxes Completed
- [ ] Task 2.2.1: Storybook Setup (0/1)
- [ ] Task 2.2.2: Button Component (0/1)
- [ ] Task 2.2.3: Input Component (0/1)
- [ ] Task 2.2.4: Card Component (0/1)
- [ ] Task 2.2.5: Design Tokens (0/1)
- [ ] Task 2.2.6: Testing & Accessibility (0/1)
- [ ] Task 2.2.7: Review & Documentation (0/1)

### Debug Log
- **2026-02-11**: Story 2.2 created and ready for development

### Completion Notes
- TBD: Will be updated as tasks progress

---

## 🚀 Definition of Done

Story completion status:
- [ ] All tasks marked [x] - IN PROGRESS
- [ ] All 3 components created (Button, Input, Card) - PENDING
- [ ] Storybook documentation complete - PENDING
- [ ] WCAG AA accessibility audit: PASS - PENDING
- [ ] Unit tests: ≥80% coverage - PENDING
- [ ] TypeScript: Zero errors - PENDING
- [ ] CodeRabbit: PASS (no HIGH issues) - PENDING
- [ ] Manual accessibility testing: PASS - PENDING

**Final Status:** 📋 **READY FOR DEV**
**Owner:** @dev
**Next Step:** Activate @dev with `*develop TECH-DEBT-002.2`

---

**Ready to start: `*develop TECH-DEBT-002.2`**
