# Component Usage Guide

Complete guide for using design system components in your application.

---

## 📦 Importing Components

All components are exported from the UI components directory:

```typescript
// Individual imports (recommended)
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

// Or import from a centralized index (if created)
import { Button, Input, Card } from '@/components/ui';
```

---

## 🔘 Button Component

### Basic Usage

```typescript
import Button from '@/components/ui/Button';

export function MyComponent() {
  return (
    <Button onClick={() => alert('Clicked!')}>
      Click me
    </Button>
  );
}
```

### Variants

Choose the visual style that matches your use case:

```typescript
// Primary (default) - Use for main actions
<Button variant="primary">Save</Button>

// Secondary - Use for alternative actions
<Button variant="secondary">Cancel</Button>

// Danger - Use for destructive actions
<Button variant="danger">Delete</Button>

// Ghost - Use for subtle actions or links
<Button variant="ghost">View Details</Button>

// Link - Use for inline links styled as buttons
<Button variant="link">Learn More</Button>
```

### Sizes

```typescript
<Button size="sm">Small</Button>     {/* 8px vert, 12px horiz */}
<Button size="md">Medium</Button>   {/* 10px vert, 16px horiz - default */}
<Button size="lg">Large</Button>    {/* 12px vert, 24px horiz */}
```

### States

```typescript
// Disabled state
<Button disabled>Cannot click</Button>

// Loading state
<Button loading>Saving...</Button>

// Full width
<Button fullWidth>Full Width Button</Button>

// Required attribute
<Button required>Submit</Button>
```

### With Icons

```typescript
import { Heart, Share2 } from 'lucide-react';

// Icon on the left (default)
<Button icon={Heart}>
  Like
</Button>

// Icon on the right
<Button icon={Share2} iconPosition="right">
  Share
</Button>
```

### Button Combinations

```typescript
// Action group
<div className="flex gap-2">
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Cancel</Button>
</div>

// Toolbar
<div className="flex gap-1">
  <Button variant="ghost" size="sm">Bold</Button>
  <Button variant="ghost" size="sm">Italic</Button>
  <Button variant="ghost" size="sm">Underline</Button>
</div>
```

---

## 📝 Input Component

### Basic Usage

```typescript
import Input from '@/components/ui/Input';
import { useState } from 'react';

export function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Input
      type="text"
      placeholder="Enter text..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### Input Types

```typescript
// Text input (default)
<Input type="text" placeholder="Name" />

// Email input
<Input type="email" placeholder="example@email.com" />

// Password input (with toggle visibility)
<Input type="password" placeholder="Enter password" />

// Number input
<Input type="number" placeholder="Enter amount" min={0} max={100} />

// Search input (with search icon)
<Input type="search" placeholder="Search products..." />

// Textarea
<Input type="textarea" placeholder="Enter your message..." />
```

### Labels and Validation

```typescript
// With label
<Input
  type="text"
  label="Full Name"
  placeholder="John Doe"
  required
/>

// With helper text
<Input
  type="email"
  label="Email Address"
  hint="We'll never share your email"
/>

// With error state
<Input
  type="email"
  label="Email"
  value="invalid"
  error="Please enter a valid email address"
/>

// With both hint and error (error takes precedence)
<Input
  type="password"
  label="Password"
  hint="At least 8 characters"
  error={!isValid ? "Password must contain uppercase, lowercase, and numbers" : undefined}
/>
```

### Icons

```typescript
import { Mail, Lock, Search } from 'lucide-react';

// Email input with icon
<Input
  type="email"
  label="Email"
  icon={Mail}
  placeholder="your@email.com"
/>

// Password with icon
<Input
  type="password"
  label="Password"
  icon={Lock}
  placeholder="Enter password"
/>

// Custom icon
const CustomIcon = ({ className }) => (
  <svg className={className} {...} />
);
<Input icon={CustomIcon} />
```

### Special Features

```typescript
// Clearable - Shows X button when has value
<Input
  type="text"
  clearable
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onClear={() => setValue('')}
/>

// Disabled
<Input
  type="text"
  disabled
  value="Cannot edit this"
/>

// Read-only
<Input
  type="text"
  readOnly
  value="Read only content"
/>
```

### Form Integration

```typescript
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        hint="At least 8 characters with uppercase, lowercase, and numbers"
        required
      />
      <Button type="submit" fullWidth>
        Register
      </Button>
    </form>
  );
}
```

---

## 🎴 Card Component

### Basic Usage

```typescript
import Card from '@/components/ui/Card';

export function MyComponent() {
  return (
    <Card>
      <p>Card content goes here</p>
    </Card>
  );
}
```

### Variants

```typescript
// Default - Standard styling
<Card variant="default">
  Default card
</Card>

// Elevated - With shadow for emphasis
<Card variant="elevated">
  Elevated card
</Card>

// Outlined - Transparent with border
<Card variant="outlined">
  Outlined card
</Card>

// Interactive - Clickable with hover effects
<Card variant="interactive" onClick={() => alert('Clicked!')}>
  Click me
</Card>
```

### Padding Options

```typescript
<Card padding="none">No padding</Card>
<Card padding="sm">Compact (12px)</Card>
<Card padding="md">Standard (20px) - default</Card>
<Card padding="lg">Spacious (24px)</Card>
```

### Structured Content

Use sub-components for better organization:

```typescript
import Card from '@/components/ui/Card';

<Card variant="elevated">
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Optional description</Card.Description>
  </Card.Header>

  <Card.Content>
    Main content area with your data
  </Card.Content>

  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

### Sub-component Details

```typescript
// Card.Header - Container for title and description
<Card.Header>
  {children}
</Card.Header>

// Card.Title - Main heading (renders as <h3>)
<Card.Title>My Title</Card.Title>

// Card.Description - Subtitle (optional, renders as <p>)
<Card.Description>My subtitle</Card.Description>

// Card.Content - Main content area
<Card.Content>
  <p>Your content here</p>
</Card.Content>

// Card.Footer - Bottom section with border-top (optional)
<Card.Footer>
  <Button>Action</Button>
</Card.Footer>
```

### Real-World Examples

**User Profile Card**
```typescript
<Card variant="elevated">
  <Card.Header>
    <Card.Title>John Doe</Card.Title>
    <Card.Description>Premium Member</Card.Description>
  </Card.Header>

  <Card.Content>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/20"></div>
      <div>
        <p className="text-white font-semibold">john@example.com</p>
        <p className="text-sm text-text-muted">Member since 2024</p>
      </div>
    </div>
  </Card.Content>

  <Card.Footer>
    <Button variant="primary" size="sm">View Profile</Button>
  </Card.Footer>
</Card>
```

**Product Card (Interactive)**
```typescript
<Card
  variant="interactive"
  onClick={() => navigate(`/products/${id}`)}
>
  <div className="aspect-video bg-surface/50 rounded-lg mb-4"></div>
  <Card.Title>Product Name</Card.Title>
  <Card.Description>$99.99</Card.Description>
</Card>
```

**Feature Card Grid**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {features.map((feature) => (
    <Card key={feature.id} variant="outlined">
      <Card.Header>
        <Card.Title>{feature.name}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="text-sm text-text-muted">{feature.description}</p>
      </Card.Content>
    </Card>
  ))}
</div>
```

### Animation

```typescript
// Entrance animation
<Card animate variant="elevated">
  Animates in when component mounts
</Card>

// Manual animation trigger
const [animate, setAnimate] = useState(false);
<Card animate={animate}>Content</Card>
<Button onClick={() => setAnimate(true)}>Trigger</Button>
```

---

## 🎯 Best Practices

### 1. Consistency
- Always use consistent spacing: use `gap-2`, `gap-4`, `gap-6` (multiples of 8px)
- Reuse color tokens: `bg-primary`, `text-text-muted`, not custom colors
- Follow the same button/input patterns across your app

### 2. Accessibility
- All interactive elements are keyboard accessible
- Always provide labels for inputs (visible or via `aria-label`)
- Use semantic HTML (buttons for actions, links for navigation)
- Test color contrast ratios (provided in DESIGN_TOKENS.md)

### 3. Responsiveness
- Use Tailwind's responsive classes: `md:`, `lg:`, `sm:`
- Test at mobile (320px), tablet (768px), desktop (1024px)
- Use flexible layouts: `grid`, `flex` with proper `gap` values

### 4. Performance
- Lazy load components when possible
- Memoize expensive components with `React.memo`
- Use proper key props for lists

### 5. Type Safety
- Always import types from components
- Use TypeScript for prop validation
- Extend component types when needed

```typescript
import Button, { ButtonProps } from '@/components/ui/Button';

interface MyButtonProps extends ButtonProps {
  customProp?: string;
}

export function MyCustomButton({ customProp, ...props }: MyButtonProps) {
  return <Button {...props} />;
}
```

---

## 🔄 Common Patterns

### Form with validation
```typescript
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }
};

return (
  <form>
    <Input
      type="email"
      value={formData.email}
      onChange={(e) => handleChange('email', e.target.value)}
      error={errors.email}
    />
  </form>
);
```

### Loading states
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await submitForm();
  } finally {
    setIsLoading(false);
  }
};

return <Button loading={isLoading} onClick={handleSubmit}>Save</Button>;
```

### Responsive grid
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id} variant="elevated">
      {/* Card content */}
    </Card>
  ))}
</div>
```

---

## 📚 Additional Resources

- **Storybook**: Run `npm run storybook` to see interactive component examples
- **Design Tokens**: See `DESIGN_TOKENS.md` for complete token reference
- **Accessibility**: See `ACCESSIBILITY_GUIDELINES.md` for a11y standards
- **Tailwind Docs**: https://tailwindcss.com/docs

---

*Component Usage Guide*
*Last Updated: 2026-02-11*
*Version: 1.0*
