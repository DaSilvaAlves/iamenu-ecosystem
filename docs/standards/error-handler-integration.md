# Error Handler Integration Guide

**Status:** READY FOR IMPLEMENTATION
**Applies To:** All 4 services (Community, Marketplace, Academy, Business)
**Implementation Time:** 15-20 minutes per service

---

## Integration Steps

### Step 1: Import Error Classes

In your Express app file (e.g., `src/index.ts` or `src/app.ts`):

```typescript
import {
  errorHandler,
  asyncHandler,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ApiError
} from './lib/errors';
```

### Step 2: Register Error Middleware

**IMPORTANT:** Error middleware MUST be registered LAST, after all other middleware and routes:

```typescript
import express from 'express';
import { errorHandler } from './lib/errors';

const app = express();

// Step 1: Parse middleware
app.use(express.json());

// Step 2: Authentication middleware
app.use(rlsMiddleware);

// Step 3: Routes
app.use('/api/v1/community', communityRoutes);
// ... other routes

// Step 4: 404 handler (before error handler)
app.use((req, res) => {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: 'Endpoint not found',
    statusCode: 404,
    timestamp: new Date().toISOString()
  });
});

// Step 5: ERROR HANDLER (MUST BE LAST)
app.use(errorHandler);

export default app;
```

### Step 3: Update Routes to Use asyncHandler

Wrap all route handlers to catch async errors:

```typescript
import { asyncHandler, ValidationError } from '../lib/errors';

router.post(
  '/suppliers',
  asyncHandler(async (req, res) => {
    // Input validation
    if (!req.body.companyName) {
      throw new ValidationError('Company name is required', {
        field: 'companyName'
      });
    }

    // Business logic
    const supplier = await prisma.supplier.create({
      data: req.body
    });

    // Return response
    res.status(201).json({
      data: supplier,
      message: 'Supplier created successfully'
    });
  })
);
```

### Step 4: Use Custom Errors in Services

In your service layer:

```typescript
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError
} from '../lib/errors';

export class SupplierService {
  async getSupplier(id: string, userId: string) {
    // Validate
    if (!id) {
      throw new ValidationError('Supplier ID is required', { field: 'id' });
    }

    // Query
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    });

    // Handle not found
    if (!supplier) {
      throw new NotFoundError('Supplier', id);
    }

    // Check permissions (RLS-aware)
    if (supplier.userId !== userId) {
      throw new ForbiddenError('Cannot access this supplier');
    }

    return supplier;
  }

  async createSupplier(data: any, userId: string) {
    // Validate
    if (!data.companyName) {
      throw new ValidationError('Company name required', {
        field: 'companyName'
      });
    }

    // Check duplicate
    const existing = await prisma.supplier.findFirst({
      where: {
        companyName: data.companyName,
        userId
      }
    });

    if (existing) {
      throw new ConflictError('Supplier with this name already exists', {
        supplierId: existing.id
      });
    }

    // Create
    return prisma.supplier.create({
      data: {
        ...data,
        userId
      }
    });
  }
}
```

---

## Testing the Integration

### Test Happy Path

```typescript
describe('Error Handler - Happy Path', () => {
  it('should return 201 for successful creation', async () => {
    const res = await request(app)
      .post('/api/v1/marketplace/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyName: 'Supplier Inc',
        email: 'contact@supplier.com'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.message).toBe('Supplier created successfully');
  });
});
```

### Test Error Paths

```typescript
describe('Error Handler - Error Paths', () => {
  it('should return 400 for validation error', async () => {
    const res = await request(app)
      .post('/api/v1/marketplace/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'contact@supplier.com' }); // Missing companyName

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.details.field).toBe('companyName');
  });

  it('should return 404 for not found', async () => {
    const res = await request(app)
      .get('/api/v1/marketplace/suppliers/invalid-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
  });

  it('should return 403 for RLS violation', async () => {
    // Try to access supplier from different user
    const res = await request(app)
      .patch('/api/v1/marketplace/suppliers/other-user-supplier')
      .set('Authorization', `Bearer ${token}`)
      .send({ companyName: 'Hacked!' });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('FORBIDDEN');
  });

  it('should return 409 for conflict', async () => {
    // Try to create duplicate
    const res = await request(app)
      .post('/api/v1/marketplace/suppliers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyName: 'Existing Supplier',
        email: 'new@supplier.com'
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('CONFLICT');
  });
});
```

---

## Checklist for Each Service

### Community Service
- [x] Error handler already implemented
- [x] Uses unified format
- [x] Tests pass

### Marketplace Service
- [ ] Import error classes in app.ts
- [ ] Register errorHandler middleware (LAST)
- [ ] Wrap routes with asyncHandler
- [ ] Update services to throw custom errors
- [ ] Add error tests
- [ ] Test error responses match standard

### Academy Service
- [ ] Import error classes in app.ts
- [ ] Register errorHandler middleware (LAST)
- [ ] Wrap routes with asyncHandler
- [ ] Update services to throw custom errors
- [ ] Add error tests
- [ ] Test error responses match standard

### Business Service
- [ ] Import error classes in app.ts
- [ ] Register errorHandler middleware (LAST)
- [ ] Wrap routes with asyncHandler
- [ ] Update services to throw custom errors
- [ ] Add error tests
- [ ] Test error responses match standard

---

## Verification

After integration, verify with curl:

```bash
# Test validation error
curl -X POST http://localhost:3002/api/v1/marketplace/suppliers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{}'

# Expected response:
{
  "error": "VALIDATION_ERROR",
  "message": "Company name is required",
  "statusCode": 400,
  "timestamp": "2026-02-10T15:30:00Z",
  "details": {
    "field": "companyName"
  }
}
```

---

## Related Documentation

- `error-handling.md` - Full error handling specification
- `api-standards.md` - API design standards
- `api-validation-checklist.md` - Pre-deployment checklist

