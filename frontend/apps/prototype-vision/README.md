# Prototype Vision - iaMenu Dashboard Frontend

Modern React 18 + TypeScript dashboard for iaMenu ecosystem analytics and business intelligence.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Install dependencies from project root
npm install

# Start development server
npm run dev:frontend

# Build for production
npm run build:frontend
```

### Access
- Development: `http://localhost:5173`
- Backend API: `http://localhost:3001-3004` (community, marketplace, academy, business)

---

## 📦 Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite 5** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Framer Motion** - Animations
- **Chart.js** - Data visualization
- **Socket.io** - Real-time updates (community events)

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── chat/           # Chat interface
│   ├── ui/             # Reusable UI components
│   └── [others]/       # Feature-specific components
├── lib/
│   ├── api/            # API client & hooks
│   ├── stores/         # Zustand state stores
│   └── utils/          # Utility functions
├── config/             # Configuration
├── styles/             # Global styles
├── types/              # Shared type definitions
├── App.tsx             # Root component
├── env.d.ts            # Environment variable types
└── main.tsx            # Entry point
```

---

## 🔧 TypeScript Setup

### Configuration
- **tsconfig.json**: Strict mode enabled
- **Type Coverage**: 99.79% (target: ≥95%)
- **Compiler**: Zero errors

### Checking Types
```bash
# Type check only (no compilation)
npx tsc --noEmit

# Check type coverage
npm install -g type-coverage
type-coverage --at-least 95

# View untyped code
type-coverage --at-least 95 --detail
```

### Style Guide
See [TYPESCRIPT_STYLE_GUIDE.md](./TYPESCRIPT_STYLE_GUIDE.md) for conventions:
- Component prop interfaces
- Hook typing patterns
- API response types
- Error handling
- And more...

---

## 📝 Development Guidelines

### Component Creation
1. Create `.tsx` file in appropriate `src/components/` subdirectory
2. Define props interface: `interface ComponentNameProps { ... }`
3. Export as `React.FC<ComponentNameProps>`
4. Add TypeScript type definitions for all props
5. Create corresponding `.test.tsx` if needed

### Example Component
```typescript
// components/Example.tsx
import { FC, ReactNode } from 'react';

interface ExampleProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
}

const Example: FC<ExampleProps> = ({ title, children, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default Example;
```

### API Calls
```typescript
// lib/api/hooks.ts
import { useState, useEffect } from 'react';
import type { User, ApiResponse } from '../../types';

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch logic
  }, [id]);

  return { user, error, isLoading };
}
```

### State Management
```typescript
// lib/stores/authStore.ts
import { create } from 'zustand';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

---

## 🧪 Testing

### Run Tests
```bash
npm test                        # All tests
npm run test:frontend          # Frontend only
npm run test:watch             # Watch mode
```

### Test Files
- Location: `tests/` directory
- Pattern: `*.test.ts` or `*.test.tsx`
- Framework: Jest + React Testing Library

---

## 📊 Linting & Type Checking

### Run All Checks
```bash
npm run lint                   # ESLint + auto-fix
npm run lint:check             # Check without fixing
npm run typecheck              # TypeScript type check
npm run build                  # Full build (all services)
```

### Before Committing
```bash
npm run lint                   # Fix lint issues
npm run typecheck              # Verify no TS errors
npm test                       # Run tests
npm run build:frontend         # Build frontend only
```

---

## 🔐 Authentication

### Development Token
- Location: `src/config/devToken.js`
- Automatically injected into requests as `Authorization: Bearer <token>`
- Headers: `X-Custom-User`, `X-Custom-Email` for development testing

### API Base URLs
| Service | URL |
|---------|-----|
| Community | `http://localhost:3001/api/v1/community` |
| Marketplace | `http://localhost:3002/api/v1/marketplace` |
| Academy | `http://localhost:3003/api/v1/academy` |
| Business | `http://localhost:3004/api/v1/business` |

---

## 🌍 Environment Variables

### Required
```env
# .env (in project root)
VITE_API_COMMUNITY=http://localhost:3001/api/v1/community
VITE_API_MARKETPLACE=http://localhost:3002/api/v1/marketplace
VITE_API_ACADEMY=http://localhost:3003/api/v1/academy
VITE_API_BUSINESS=http://localhost:3004/api/v1/business
```

### TypeScript Support
- Environment variables defined in `src/env.d.ts`
- Access via `import.meta.env.VITE_*`

---

## 📈 Performance

### Bundle Analysis
```bash
npm run build:frontend
# Check dist/ directory for bundle sizes
```

### Optimization Tips
- Use React.lazy() for code splitting
- Implement virtual scrolling for large lists
- Memoize expensive computations
- Profile with React DevTools

---

## 🐛 Debugging

### Browser DevTools
- React DevTools extension (components, state)
- Redux DevTools (Zustand state inspection)
- Network tab (API calls)
- Console (errors and logs)

### VSCode Debugging
```json
// .vscode/launch.json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}/frontend/apps/prototype-vision"
}
```

---

## 📚 Documentation

- [TYPESCRIPT_STYLE_GUIDE.md](./TYPESCRIPT_STYLE_GUIDE.md) - TypeScript conventions
- [Vite Documentation](https://vitejs.dev/) - Build tool docs
- [React Documentation](https://react.dev/) - React 18 docs
- [Zustand Documentation](https://github.com/pmndrs/zustand) - State management

---

## 🚢 Deployment

### Production Build
```bash
npm run build:frontend
# Output: dist/ directory

# Deploy dist/ to hosting service (Vercel, Netlify, etc.)
```

### Environment Variables (Production)
Update `VITE_*` variables in deployment platform:
```env
VITE_API_COMMUNITY=https://api.iamenu.com/community
VITE_API_MARKETPLACE=https://api.iamenu.com/marketplace
VITE_API_ACADEMY=https://api.iamenu.com/academy
VITE_API_BUSINESS=https://api.iamenu.com/business
```

---

## 📝 Contributing

1. Follow TypeScript Style Guide (see above)
2. Ensure type coverage ≥95%
3. Run linting: `npm run lint`
4. Run type check: `npm run typecheck`
5. Create pull request with changes

---

## ✅ Quality Checklist

Before merging:
- [ ] TypeScript: Zero errors
- [ ] Type Coverage: ≥95%
- [ ] ESLint: PASS
- [ ] Tests: All passing
- [ ] Build: Successful
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Accessibility checked

---

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Review TypeScript Style Guide
3. Check [TYPESCRIPT_STYLE_GUIDE.md](./TYPESCRIPT_STYLE_GUIDE.md)
4. Consult React/TypeScript documentation

---

**Last Updated:** 2026-02-24
**Tech Stack:** React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3
**Type Coverage:** 99.79%
