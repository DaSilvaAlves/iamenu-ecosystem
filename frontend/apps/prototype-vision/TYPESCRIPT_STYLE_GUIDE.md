# TypeScript Style Guide - iaMenu Prototype Vision

## Overview

This guide establishes TypeScript conventions and best practices for the iaMenu Prototype Vision frontend. All code should follow these standards for consistency and maintainability.

---

## 1. File Organization

### Structure
```
src/
├── components/          # React components (.tsx)
├── lib/
│   ├── api/            # API client and hooks
│   ├── stores/         # State management (Zustand)
│   └── utils/          # Utility functions (.ts)
├── config/             # Configuration files
├── types/              # Shared type definitions
└── styles/             # Global styles
```

### Naming Conventions
- **Components**: PascalCase (e.g., `DashboardBI.tsx`, `ErrorBoundary.tsx`)
- **Utilities/Functions**: camelCase (e.g., `formatCurrency.ts`, `api.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT = 3`)

### File Extensions
- React components: `.tsx`
- Type definitions: `.ts` or co-located in component file
- Utilities: `.ts`
- Config files: `.ts` (using TypeScript for type-safe config)

---

## 2. Type Definitions

### Component Props
```typescript
// ✅ GOOD: Explicit props interface
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, size = 'md', ...props }) => {
  // implementation
};

// ❌ BAD: Using 'any'
const Button: React.FC<any> = (props) => {
  // implementation
};
```

### Typing Hooks
```typescript
// ✅ GOOD: Type hooks explicitly
const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState<number>(0);
const queryRef = useRef<HTMLInputElement>(null);

// ❌ BAD: Letting TypeScript infer (can be imprecise)
const [user, setUser] = useState(null);  // Type is 'null' not 'User | null'
```

### API Response Types
```typescript
// ✅ GOOD: Define response types
interface ApiResponse<T> {
  data: T;
  status: number;
  timestamp: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<ApiResponse<User>> => {
  // implementation
};

// ❌ BAD: Using 'any' for API responses
const getUser = async (id: string): Promise<any> => {
  // implementation
};
```

### Event Types
```typescript
// ✅ GOOD: Use React event types
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
};

// ❌ BAD: Using generic 'Event'
const handleChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  setValue(input.value);
};
```

---

## 3. React Components

### Functional Components
```typescript
// ✅ GOOD: Explicit FC type
import { FC, ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
}

const Card: FC<CardProps> = ({ title, children, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Card;

// ❌ BAD: Implicit return type
const Card = ({ title, children, onClick }) => {
  // implementation
};
```

### Typing Children
```typescript
// ✅ GOOD: Use ReactNode for maximum flexibility
interface WrapperProps {
  children: React.ReactNode;
}

// ✅ ALSO GOOD: Use specific types when needed
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

// ❌ BAD: Using 'any'
interface WrapperProps {
  children: any;
}
```

### State Management
```typescript
// ✅ GOOD: Zustand with proper typing
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
```

---

## 4. Utility Functions

### Typing Parameters and Returns
```typescript
// ✅ GOOD: Explicit parameter and return types
function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
  }).format(amount);
}

// ✅ GOOD: Generic utilities
function isEmpty<T>(array: T[]): boolean {
  return array.length === 0;
}

// ❌ BAD: Missing types
function formatCurrency(amount, currency = 'EUR') {
  return amount.toLocaleString();
}
```

### Error Handling
```typescript
// ✅ GOOD: Type errors properly
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

try {
  // operation
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error [${error.code}]:`, error.message);
  } else if (error instanceof Error) {
    console.error('Error:', error.message);
  }
}

// ❌ BAD: Catching as 'any'
try {
  // operation
} catch (error: any) {
  console.error(error.message);  // Unsafe - error might not have message
}
```

### Async Operations
```typescript
// ✅ GOOD: Properly typed async functions
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json() as Promise<User>;
}

// ✅ GOOD: Using type guards
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// ❌ BAD: Using 'any' with async
async function fetchUser(id: string): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

---

## 5. Imports and Exports

### Consistent Import Style
```typescript
// ✅ GOOD: Explicit imports
import { FC, ReactNode, useState } from 'react';
import { create } from 'zustand';
import type { User, ApiResponse } from '../types';

// ✅ GOOD: Type-only imports (separate)
import type { ButtonProps } from './Button';

// ❌ BAD: Default imports for utilities
import * as utils from '../utils';
utils.formatCurrency(100);

// ❌ BAD: Circular imports (reorganize code)
// components/A.tsx imports from B.tsx
// B.tsx imports from A.tsx
```

### Named Exports vs Default
```typescript
// ✅ PREFERRED: Named exports for components
export const Button: FC<ButtonProps> = () => {
  // implementation
};

export const Card: FC<CardProps> = () => {
  // implementation
};

// Then import:
import { Button, Card } from './components/ui';

// ✅ OK: Default export for default component
export default ErrorBoundary;

// Then import:
import ErrorBoundary from './components/ErrorBoundary';
```

---

## 6. Common Patterns

### API Client Pattern
```typescript
// ✅ GOOD: Typed API client
interface ClientConfig {
  baseUrl: string;
  timeout?: number;
}

class ApiClient {
  constructor(private config: ClientConfig) {}

  async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${path}`, options);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }
}
```

### Custom Hooks Pattern
```typescript
// ✅ GOOD: Typed custom hooks
interface UseFetchOptions {
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
}

function useFetch<T>(url: string, options?: UseFetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // implementation
  }, [url]);

  return { data, error, isLoading };
}
```

### Conditional Rendering
```typescript
// ✅ GOOD: Type-safe conditionals
interface LoadingProps {
  isLoading: boolean;
  children: ReactNode;
  fallback: ReactNode;
}

const Conditional: FC<LoadingProps> = ({ isLoading, children, fallback }) => {
  return isLoading ? fallback : children;
};

// Usage
<Conditional isLoading={loading} fallback={<Spinner />}>
  <Content />
</Conditional>
```

---

## 7. Type Coverage Goals

**Target:** ≥95% type coverage

Check current coverage:
```bash
npm install --save-dev type-coverage
type-coverage --at-least 95
```

Identify untyped files:
```bash
type-coverage --at-least 95 --detail
```

---

## 8. Strict Mode Configuration

All TypeScript code must compile with `strict: true` in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

---

## 9. Common Mistakes to Avoid

| ❌ Don't | ✅ Do | Why |
|----------|-------|-----|
| `any` everywhere | Explicit types | Defeats type safety purpose |
| `Promise<any>` | `Promise<User>` | Know what data you're working with |
| `(e: any) =>` | `(e: React.ChangeEvent<...>) =>` | Type safety for event handlers |
| No return types | `(): User =>` | Self-documenting, catches errors |
| `useState(null)` | `useState<User \| null>(null)` | Proper type inference |
| `as any` casts | Type guards | Safer type narrowing |
| Mixed quotes | Single or double consistently | Linting should enforce |

---

## 10. Review Checklist

Before submitting code:

- [ ] All files have `.ts` or `.tsx` extension
- [ ] All components have `FC<Props>` type
- [ ] All props interfaces are defined
- [ ] Event handlers have proper types
- [ ] Async functions return `Promise<T>`
- [ ] No `any` types (except in legacy code)
- [ ] Type coverage ≥95%
- [ ] No TypeScript errors on build
- [ ] ESLint passes with TS rules
- [ ] Imports use named exports where appropriate
- [ ] No circular dependencies

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Zustand TypeScript Guide](https://github.com/pmndrs/zustand)
- [ESLint + TypeScript](https://typescript-eslint.io/)

---

**Last Updated:** 2026-02-24
**Owner:** @dev
