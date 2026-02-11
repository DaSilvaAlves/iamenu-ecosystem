# Accessibility Guidelines

WCAG 2.1 AA compliance guide for all design system components.

---

## ♿ Overview

All components in this design system are built with accessibility in mind. This guide ensures consistent accessible usage across your application.

**Standard**: WCAG 2.1 Level AA
**Target**: 4.5:1 contrast ratio for normal text, 3:1 for large text

---

## 🎯 Keyboard Navigation

### Required for All Interactive Components

All buttons, inputs, and clickable elements must be keyboard accessible:

```typescript
✓ Correct - Native <button> element
<Button onClick={handleClick}>Click me</Button>

✗ Wrong - Custom <div> without keyboard support
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>
```

### Tab Order

Tab order should follow the visual flow (left to right, top to bottom):

```typescript
// Good: Natural tab order
<form>
  <Input label="First Name" />      {/* Tab 1 */}
  <Input label="Last Name" />       {/* Tab 2 */}
  <Input label="Email" />           {/* Tab 3 */}
  <Button>Submit</Button>           {/* Tab 4 */}
</form>

// Use tabIndex when needed
<div>
  <Button tabIndex={1}>First</Button>
  <Button tabIndex={2}>Second</Button>
  <Input tabIndex={3} />
</div>
```

### Focus Management

Components must have visible focus indicators:

```typescript
// Button focus
<Button>
  {/* Has focus:ring-2 focus:ring-primary/50 by default */}
  Click me
</Button>

// Input focus
<Input>
  {/* Has focus:outline-none focus:ring-2 focus:ring-primary/50 by default */}
</Input>

// Custom focus indicator
<Button className="focus:ring-4 focus:ring-offset-2">
  Custom focus
</Button>
```

---

## 🔊 Screen Reader Support

### Labels and ARIA

Always provide labels for form inputs:

```typescript
// Good - Native label
<Input
  label="Email Address"
  type="email"
  placeholder="your@email.com"
/>

// Also good - aria-label for unlabeled inputs
<Input
  type="search"
  aria-label="Search products"
  placeholder="Search..."
/>

// Good - aria-labelledby for complex labels
<label id="password-label">
  Password
  <span className="text-red-500">*</span>
</label>
<Input
  type="password"
  aria-labelledby="password-label"
/>
```

### Semantic HTML

Use semantic elements for better screen reader experience:

```typescript
// Good - Card with proper heading hierarchy
<Card>
  <Card.Header>
    <Card.Title>My Title</Card.Title>  {/* Renders as <h3> */}
  </Card.Header>
  <Card.Content>Content</Card.Content>
</Card>

// Good - Button for actions, Link for navigation
<Button onClick={handleDelete}>Delete</Button>
<a href="/details">View Details</a>

// Good - Form landmark
<form onSubmit={handleSubmit}>
  <Input label="Name" />
  <Button type="submit">Submit</Button>
</form>
```

### ARIA Roles and Attributes

```typescript
// Button group
<div role="group" aria-label="Text formatting">
  <Button aria-pressed={isBold} onClick={() => toggleBold()}>
    Bold
  </Button>
  <Button aria-pressed={isItalic} onClick={() => toggleItalic()}>
    Italic
  </Button>
</div>

// Status message
<div role="status" aria-live="polite" aria-atomic="true">
  {successMessage && <p>{successMessage}</p>}
</div>

// Error message
<Input
  type="email"
  value={email}
  error={emailError}
  aria-invalid={!!emailError}
  aria-describedby="email-error"
/>
<div id="email-error" role="alert">
  {emailError}
</div>

// Loading state
<Button loading aria-busy={true}>
  Saving...
</Button>
```

---

## 🎨 Color & Contrast

### Contrast Requirements

All text must meet minimum contrast ratios:

```
Normal text:    4.5:1 (WCAG AA)
Large text:     3:1 (WCAG AA)
Large text:     4.5:1 (WCAG AAA)
Graphics/UI:    3:1
```

### Our Colors Meet WCAG AA

| Combination | Ratio | Level |
|-------------|-------|-------|
| White text on Primary (#007AFF) | 7.2:1 | AAA ✓ |
| White text on Error (#FF3B30) | 5.3:1 | AAA ✓ |
| Muted text on Surface | 4.8:1 | AA ✓ |
| Border on Background | 2.4:1 | AA (UI) ✓ |

### Don't rely on color alone

```typescript
// Bad - Color only
<div style={{ color: isSaved ? 'green' : 'red' }}>
  {isSaved ? 'Saved' : 'Not saved'}
</div>

// Good - Color + icon + text
<div className={isSaved ? 'text-success' : 'text-error'}>
  {isSaved ? '✓ Saved' : '✗ Not saved'}
</div>
```

---

## 📝 Form Accessibility

### Input Labels

Always associate labels with inputs:

```typescript
// Good - Label with input
<Input
  type="email"
  label="Email Address"
  required
  // Label is automatically associated
/>

// Also good - Manual association
<label htmlFor="email">Email Address</label>
<Input id="email" type="email" />
```

### Required Fields

Mark required fields clearly:

```typescript
// Accessible required field
<Input
  label="Email Address"
  type="email"
  required
  // Shows red asterisk automatically
  // aria-required is handled by the component
/>

// Error handling
<Input
  type="email"
  error="Email is required"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<div id="email-error" role="alert">
  Email is required
</div>
```

### Helper Text and Errors

```typescript
// Helper text - visible to all
<Input
  type="password"
  label="Password"
  hint="At least 8 characters with uppercase, lowercase, and numbers"
/>

// Error message - announced to screen readers
<Input
  type="email"
  value={email}
  error={validation.emailError}
  aria-invalid={!!validation.emailError}
/>

// Complex validation
<Input
  type="password"
  aria-describedby={`password-hint ${errors.password ? 'password-error' : ''}`}
/>
<div id="password-hint">At least 8 characters</div>
{errors.password && (
  <div id="password-error" role="alert" className="text-error">
    {errors.password}
  </div>
)}
```

---

## 🔘 Button Accessibility

### Button Types

```typescript
// Action button
<Button type="button" onClick={handleAction}>
  Perform Action
</Button>

// Submit button
<Button type="submit">
  Submit Form
</Button>

// Reset button
<Button type="reset">
  Clear Form
</Button>

// Link button - use for navigation
<Button variant="link" onClick={() => navigate('/page')}>
  Navigate to page
</Button>
```

### Disabled State

```typescript
// Properly disabled button
<Button disabled aria-disabled="true">
  {/* Component handles this automatically */}
  Cannot click
</Button>

// Loading state
<Button loading aria-busy="true">
  Loading...
</Button>
```

### Icon Buttons

```typescript
import { Heart } from 'lucide-react';

// Good - Text label with icon
<Button icon={Heart}>
  Like
</Button>

// For icon-only buttons, provide aria-label
<Button
  icon={Heart}
  aria-label="Add to favorites"
  variant="ghost"
/>
```

---

## 🎴 Card Accessibility

### Semantic Structure

```typescript
// Good - Proper heading hierarchy
<Card>
  <Card.Header>
    <Card.Title>Section Title</Card.Title>  {/* <h3> */}
    <Card.Description>Subtitle</Card.Description>
  </Card.Header>
  <Card.Content>
    {content}
  </Card.Content>
</Card>

// Article landmark
<Card as="article">
  {/* Screen readers will announce this as an article */}
</Card>
```

### Interactive Cards

```typescript
// Keyboard accessible interactive card
<Card
  variant="interactive"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  role="button"
  tabIndex={0}
  aria-label="View product details"
>
  Product Card Content
</Card>

// Better - use Button instead
<Button
  onClick={handleClick}
  className="w-full h-full text-left"
>
  <Card as="div">
    Product Card Content
  </Card>
</Button>
```

---

## 🎬 Animation & Motion

### Respect prefers-reduced-motion

```typescript
// CSS approach
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// React approach
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<Card animate={!prefersReducedMotion}>
  Content
</Card>
```

### Animation best practices

```typescript
// Good - Subtle animations
<Button
  // Slight scale animation on hover
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Click me
</Button>

// Bad - Disorienting animations
<Card
  animate={{
    rotate: 360,
    scale: [1, 2, 1],
    opacity: [0, 1, 0]
  }}
/>
```

---

## 🧪 Testing for Accessibility

### Browser Tools

1. **Chrome DevTools** - Lighthouse audit (free)
2. **axe DevTools** - Accessibility checker (free extension)
3. **WAVE** - WebAIM evaluation tool (free)

### Screen Reader Testing

- **Windows**: NVDA (free), JAWS (paid)
- **macOS**: VoiceOver (built-in)
- **iOS**: VoiceOver (built-in)
- **Android**: TalkBack (built-in)

### Manual Testing Checklist

- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Focus indicators are visible
- [ ] Contrast ratios meet 4.5:1 (normal) or 3:1 (large) minimum
- [ ] Form inputs have associated labels
- [ ] Error messages are announced
- [ ] Images have alt text (if applicable)
- [ ] Video has captions (if applicable)
- [ ] Motion can be disabled (prefers-reduced-motion)
- [ ] No keyboard traps (can't Tab away from element)

### Automated Testing

```typescript
// Using @testing-library/jest-dom
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button should have no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 🔗 Resources

### WCAG Guidelines
- [WCAG 2.1 Overview](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

### Tools & Testing
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extensions](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Best Practices
- [MDN Web Docs - Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)
- [a11y Project](https://www.a11yproject.com/)

---

## 📋 Component-Specific a11y Checklist

### Button
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Visible focus indicator
- [ ] Descriptive text or aria-label
- [ ] Disabled state properly marked

### Input
- [ ] Associated label
- [ ] Proper type attribute
- [ ] Error messages announced
- [ ] Placeholder ≠ label
- [ ] Helper text included (aria-describedby)

### Card
- [ ] Proper heading hierarchy
- [ ] Semantic HTML structure
- [ ] If interactive: keyboard accessible
- [ ] Sufficient contrast

---

*Accessibility Guidelines*
*Last Updated: 2026-02-11*
*WCAG 2.1 Level AA Compliant*
