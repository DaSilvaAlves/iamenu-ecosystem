# Component Implementation Guide

Step-by-step guide for creating new components following design system standards.

---

## 📋 Overview

This guide provides a standardized process for creating new components that integrate seamlessly with the existing design system.

**Standards:**
- WCAG 2.1 Level AA accessibility
- Full TypeScript support
- Comprehensive Storybook documentation
- 80%+ test coverage

---

## 🚀 Quick Checklist

- [ ] **Step 1:** Design component in Figma (if applicable)
- [ ] **Step 2:** Create TypeScript types file
- [ ] **Step 3:** Implement component
- [ ] **Step 4:** Write unit tests
- [ ] **Step 5:** Create Storybook stories
- [ ] **Step 6:** Validate accessibility
- [ ] **Step 7:** Document usage
- [ ] **Step 8:** Code review

**Estimated Time:** 2-4 hours per component

---

## Step 1: Plan Your Component

### Define Purpose
- What problem does it solve?
- What's the primary use case?
- Does a similar component already exist?

### Design the API
```typescript
// What props should it accept?
interface YourComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'variant2';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: ReactNode;
}

// What should it render?
// Keep it simple and focused
```

### Check Design Tokens
Review [DESIGN_TOKENS.md](./DESIGN_TOKENS.md):
- Use existing colors (primary, secondary, error, success, etc.)
- Use spacing tokens (xs, sm, md, lg, xl)
- Use typography tokens (h1-h6, body)
- Ensure contrast ratios ≥4.5:1

---

## Step 2: Create Types File

Create `YourComponent.types.ts`:

```typescript
/**
 * YourComponent Types
 */

import React, { ReactNode } from 'react';

export type YourComponentVariant = 'default' | 'variant2';
export type YourComponentSize = 'sm' | 'md' | 'lg';

export interface YourComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant */
  variant?: YourComponentVariant;
  /** Size of the component */
  size?: YourComponentSize;
  /** Disable interaction */
  disabled?: boolean;
  /** Component content */
  children?: ReactNode;
}
```

**Best Practices:**
- Export all types for external use
- Use JSDoc comments on interfaces
- Keep props focused and minimal
- Extend native HTML attributes

---

## Step 3: Implement Component

Create `YourComponent.tsx`:

```typescript
/**
 * YourComponent
 *
 * [Brief description of what it does]
 */

import React, { FC } from 'react';
import { YourComponentProps, YourComponentVariant, YourComponentSize } from './YourComponent.types';

export type { YourComponentProps, YourComponentVariant, YourComponentSize } from './YourComponent.types';

// Style mappings using design tokens
const variants: Record<YourComponentVariant, string> = {
  default: 'bg-surface border border-border',
  variant2: 'bg-surface-card shadow-lg',
};

const sizes: Record<YourComponentSize, string> = {
  sm: 'p-3 text-sm',
  md: 'p-4 text-base', // default
  lg: 'p-6 text-lg',
};

const YourComponent = React.forwardRef<HTMLDivElement, YourComponentProps>(({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  const baseClasses = `
    rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses} ${sizeClasses}
  `;

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
});

YourComponent.displayName = 'YourComponent';

export default YourComponent;
```

**Best Practices:**
- Use TypeScript for type safety
- Style with Tailwind classes (not inline styles)
- Use design tokens for consistency
- Add `displayName` for debugging
- Support `ref` forwarding
- Include JSDoc comments
- Handle disabled state
- Add ARIA attributes

---

## Step 4: Write Unit Tests

Create `YourComponent.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<YourComponent>Content</YourComponent>);
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <YourComponent className="custom-class">Content</YourComponent>
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(
        <YourComponent variant="default">Content</YourComponent>
      );
      expect(container.firstChild).toHaveClass('bg-surface');
    });

    it('should render variant2', () => {
      const { container } = render(
        <YourComponent variant="variant2">Content</YourComponent>
      );
      expect(container.firstChild).toHaveClass('bg-surface-card');
    });
  });

  describe('Sizes', () => {
    it('should render all sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const;

      sizes.forEach(size => {
        const { container } = render(
          <YourComponent size={size}>Content</YourComponent>
        );
        expect(container.firstChild).toHaveClass(`p-${size === 'sm' ? '3' : size === 'md' ? '4' : '6'}`);
      });
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      const { container } = render(
        <YourComponent disabled>Content</YourComponent>
      );
      expect(container.firstChild).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should have focus indicator', () => {
      const { container } = render(
        <YourComponent>Content</YourComponent>
      );
      expect(container.firstChild).toHaveClass('focus:ring-2');
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<YourComponent ref={ref}>Content</YourComponent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
```

**Coverage Goals:**
- Rendering: ≥60%
- Variants: ≥80%
- States: ≥85%
- Accessibility: ≥90%
- **Overall: ≥80%**

---

## Step 5: Create Storybook Stories

Create `YourComponent.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import YourComponent from './YourComponent';

const meta = {
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'variant2'],
      description: 'Visual style',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the component',
    },
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Component',
    variant: 'default',
    size: 'md',
  },
};

export const Variant2: Story = {
  args: {
    children: 'Variant 2 Component',
    variant: 'variant2',
  },
};

export const Small: Story = {
  args: {
    children: 'Small Component',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Component',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Component',
    disabled: true,
  },
};
```

**Story Requirements:**
- At least one story per variant
- At least one story per size
- State stories (disabled, loading, etc.)
- Interactive examples
- Real-world use cases
- Edge cases

---

## Step 6: Validate Accessibility

### Manual Checks
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Focus indicators visible
- [ ] Screen reader announces content
- [ ] Color contrast ≥4.5:1
- [ ] Semantic HTML used
- [ ] ARIA attributes correct

### Test with Tools
```bash
# Run tests
npm test -- YourComponent.test.tsx

# Check in Storybook
npm run storybook
# Use accessibility panel (a11y addon)

# Manual screen reader test
# Windows: NVDA
# macOS: VoiceOver (Cmd+F5)
```

### Checklist from ACCESSIBILITY_GUIDELINES.md
- [ ] Keyboard accessible
- [ ] Focus visible
- [ ] Proper ARIA labels
- [ ] Semantic HTML structure
- [ ] Color contrast verified
- [ ] No keyboard traps
- [ ] Screen reader compatible

---

## Step 7: Document Usage

### Update [COMPONENT_USAGE_GUIDE.md](./COMPONENT_USAGE_GUIDE.md)

Add section:
```markdown
## YourComponent

### Basic Usage
\`\`\`typescript
import YourComponent from '@/components/ui/YourComponent';

<YourComponent>Content</YourComponent>
\`\`\`

### Variants
\`\`\`typescript
<YourComponent variant="default">Default</YourComponent>
<YourComponent variant="variant2">Variant 2</YourComponent>
\`\`\`

### Sizes
\`\`\`typescript
<YourComponent size="sm">Small</YourComponent>
<YourComponent size="md">Medium</YourComponent>
<YourComponent size="lg">Large</YourComponent>
\`\`\`

### Disabled State
\`\`\`typescript
<YourComponent disabled>Disabled</YourComponent>
\`\`\`
```

---

## Step 8: Code Review

### Self Review Checklist
- [ ] Files follow naming convention (ComponentName.tsx, ComponentName.types.ts, etc.)
- [ ] TypeScript: zero errors (`npm run typecheck`)
- [ ] Lint: passes (`npm run lint`)
- [ ] Tests: ≥80% coverage
- [ ] Accessibility: WCAG 2.1 AA compliant
- [ ] Documentation: complete
- [ ] Storybook: builds successfully (`npm run build-storybook`)
- [ ] No console warnings or errors

### Ready for Review
1. Commit changes
2. Create PR with:
   - Component description
   - Test results
   - Accessibility verification
   - Screenshots/GIFs of variants
3. Request review from:
   - @dev (code implementation)
   - @ux-design-expert (design & usability)
   - @qa (accessibility)

---

## 📁 File Structure Template

```
src/components/ui/
├── YourComponent.tsx         # Main component
├── YourComponent.types.ts    # TypeScript types
├── YourComponent.stories.tsx # Storybook stories
└── YourComponent.test.tsx    # Unit tests
```

---

## 🎯 Common Patterns

### Variant Components
```typescript
type Variant = 'primary' | 'secondary' | 'danger';
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  danger: 'bg-error text-white',
};
```

### Size Components
```typescript
type Size = 'sm' | 'md' | 'lg';
const sizes: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
```

### Conditional Classes
```typescript
const className = `
  ${baseClasses}
  ${variant && variants[variant]}
  ${size && sizes[size]}
  ${disabled && 'opacity-50 cursor-not-allowed'}
  ${error && 'border-red-500'}
`;
```

### Sub-Components
```typescript
const SubComponent: FC<Props> = ({ children }) => (
  <div>{children}</div>
);

Object.assign(MainComponent, {
  Sub: SubComponent,
});
```

---

## ⚠️ Common Mistakes

### ❌ Don't
- Use inline styles (`style={{color: 'red'}}`)
- Hardcode colors (use design tokens)
- Forget accessibility
- Skip testing
- Duplicate existing components
- Use `div` for buttons/links
- Skip TypeScript types
- Create overly complex components

### ✅ Do
- Use Tailwind classes
- Use design tokens
- Consider accessibility first
- Write comprehensive tests
- Reuse existing components
- Use semantic HTML
- Write complete types
- Keep components focused

---

## 🚀 Performance Tips

### Optimization
- Memoize components if they re-render frequently: `React.memo(Component)`
- Use `React.forwardRef` for ref support
- Lazy load heavy components: `React.lazy()`
- Avoid inline functions in render

### Bundle Size
- Tree-shake exports
- Keep dependencies minimal
- Use Tailwind for styling (already in project)
- Don't duplicate styling

---

## 📚 Resources

### Design System
- [Design Tokens](./DESIGN_TOKENS.md) - Token reference
- [Component Usage Guide](./COMPONENT_USAGE_GUIDE.md) - Usage examples
- [Accessibility Guidelines](./ACCESSIBILITY_GUIDELINES.md) - A11y standards

### Libraries
- [React Docs](https://react.dev) - React reference
- [TypeScript Docs](https://www.typescriptlang.org/) - TypeScript reference
- [Tailwind CSS](https://tailwindcss.com/) - Utility classes
- [Framer Motion](https://www.framer.com/motion/) - Animations

### Testing
- [Vitest](https://vitest.dev/) - Test runner
- [React Testing Library](https://testing-library.com/) - Component testing
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom) - Custom matchers

---

## 🔄 Review Feedback Loop

### If Review Feedback:
1. **Code Quality** - Fix linting/type issues
2. **Accessibility** - Test with screen reader, fix ARIA
3. **Testing** - Add missing test cases
4. **Documentation** - Update examples and guides
5. **Design** - Align with design tokens and specs

### Re-request Review
- Make requested changes
- Commit with `--amend` or new commit
- Re-request review

---

## ✅ Done Checklist

When you've completed implementation:
- [ ] Component implemented with TypeScript
- [ ] Types exported from component
- [ ] Unit tests written (≥80% coverage)
- [ ] Storybook stories created
- [ ] Accessibility verified (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Code review passed
- [ ] PR merged to main
- [ ] Component added to library exports

---

## 📞 Need Help?

- **Design Questions:** Check [DESIGN_TOKENS.md](./DESIGN_TOKENS.md)
- **Accessibility Issues:** See [ACCESSIBILITY_GUIDELINES.md](./ACCESSIBILITY_GUIDELINES.md)
- **Usage Examples:** Review existing components (Button, Input, Card)
- **Storybook Help:** Run `npm run storybook`
- **Testing Help:** Check test files in `/ui/` directory

---

*Component Implementation Guide - Last Updated: 2026-02-11*
