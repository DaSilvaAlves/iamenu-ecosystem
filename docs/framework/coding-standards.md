# Coding Standards - iaMenu Ecosystem

## Visão Geral

Este documento define os padrões de código para o projeto iaMenu Ecosystem.

## Estrutura de Código

### Backend (Node.js/TypeScript)

Cada serviço segue a estrutura:
```
src/
├── controllers/    # Request handling e validação
├── services/       # Lógica de negócio
├── routes/         # Definições de rotas Express
├── middleware/     # Auth (JWT), error handling, uploads
├── lib/            # Instâncias partilhadas (Prisma, logger)
├── config/         # Configurações
└── utils/          # Utilitários
```

### Frontend (React/JavaScript)

```
src/
├── components/     # Componentes React reutilizáveis
├── views/          # Vistas/páginas principais
├── config/         # Configurações (API, tokens)
├── hooks/          # Custom hooks
└── utils/          # Utilitários
```

## Convenções de Naming

### Ficheiros
- **Controllers:** `{resource}.controller.ts`
- **Services:** `{resource}.service.ts`
- **Routes:** `{resource}.routes.ts`
- **Middleware:** `{name}.middleware.ts`
- **React Components:** `{ComponentName}.jsx`

### Variáveis e Funções
- **JavaScript/TypeScript:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Classes:** PascalCase
- **Interfaces/Types:** PascalCase com prefixo I opcional

## Padrões de Código

### Tratamento de Erros
```typescript
class AppError extends Error {
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Uso
throw new AppError('Recurso não encontrado', 404);
```

### Async Handler
```typescript
const asyncHandler = (fn: Function) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Uso em routes
router.get('/', asyncHandler(controller.list));
```

### Validação
```typescript
import { body, validationResult } from 'express-validator';

const validationRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];
```

## Commits

Usar Conventional Commits:
```
feat: add gamification system [Story 2.3]
fix: correct RFQ status update
docs: update API documentation
refactor: extract shared auth middleware
test: add integration tests for posts
```

## Linting

```bash
npm run lint        # ESLint com auto-fix
npm run lint:check  # Apenas verificar
```

## Testes

```bash
npm test                 # Todos os serviços
npm run test:community   # Serviço específico
```
