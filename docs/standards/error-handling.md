# Unified Error Handling Standard

**Version:** 1.0
**Status:** ACTIVE
**Applies To:** All 4 backend services (Community, Marketplace, Academy, Business)
**Last Updated:** 2026-02-10

---

## Overview

All services MUST follow this unified error handling pattern for consistency, testability, and user experience.

---

## Error Response Format

### Standard Response Structure

```typescript
{
  error: string;              // Error code or message
  message: string;            // User-friendly description
  statusCode: number;         // HTTP status code
  timestamp: string;          // ISO 8601 timestamp
  requestId?: string;         // For debugging (optional)
  details?: Record<string, any>; // Additional context (optional)
}
```

### Example Responses

**400 Bad Request - Validation Error:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "statusCode": 400,
  "timestamp": "2026-02-10T15:30:00Z",
  "requestId": "req-abc123",
  "details": {
    "field": "email",
    "value": "invalid-email",
    "constraint": "email"
  }
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "error": "INVALID_TOKEN",
  "message": "JWT token is invalid or expired",
  "statusCode": 401,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

**403 Forbidden - RLS Violation:**
```json
{
  "error": "RLS_VIOLATION",
  "message": "Access denied: insufficient permissions for this resource",
  "statusCode": 403,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

**409 Conflict - Business Logic Error:**
```json
{
  "error": "RESOURCE_EXISTS",
  "message": "A supplier with this email already exists",
  "statusCode": 409,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

**500 Internal Server Error:**
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred. Please try again later.",
  "statusCode": 500,
  "timestamp": "2026-02-10T15:30:00Z",
  "requestId": "req-def456"
}
```

---

## Error Codes & HTTP Status Mapping

| Error Code | HTTP Status | Description | Example |
|-----------|------------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Input validation failed | Invalid email |
| `INVALID_TOKEN` | 401 | JWT token invalid/expired | Expired token |
| `FORBIDDEN` | 403 | User lacks permissions | RLS violation |
| `NOT_FOUND` | 404 | Resource not found | Unknown supplier ID |
| `CONFLICT` | 409 | Business logic violation | Duplicate entry |
| `RATE_LIMITED` | 429 | Too many requests | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error | Unhandled exception |

---

## Implementation Pattern

### Express Error Middleware

```typescript
// src/middleware/error-handler.ts

import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, any>;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  // Log error with request context
  logger.error({
    error: errorCode,
    message: err.message,
    statusCode,
    requestId: req.id,
    path: req.path,
    stack: err.stack
  });

  // Send response
  res.status(statusCode).json({
    error: errorCode,
    message: err.message,
    statusCode,
    timestamp: new Date().toISOString(),
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.details && { details: err.details })
  });
};
```

### Custom Error Classes

```typescript
// src/lib/errors.ts

export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';

  constructor(message: string, public details?: Record<string, any>) {
    super(message);
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  code = 'INVALID_TOKEN';

  constructor(message: string = 'Invalid or expired token') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  code = 'FORBIDDEN';

  constructor(message: string = 'Access denied') {
    super(message);
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';

  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  code = 'CONFLICT';

  constructor(message: string, public details?: Record<string, any>) {
    super(message);
  }
}
```

### Service Layer Pattern

```typescript
// src/services/supplier.service.ts

export class SupplierService {
  async getSupplier(id: string, userId: string) {
    // Validate input
    if (!id || !userId) {
      throw new ValidationError('Missing required parameters', {
        field: id ? 'userId' : 'id'
      });
    }

    // Query database
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    });

    // Handle not found
    if (!supplier) {
      throw new NotFoundError('Supplier', id);
    }

    // Check permissions (RLS-aware)
    if (supplier.userId !== userId) {
      throw new ForbiddenError('Cannot access supplier data');
    }

    return supplier;
  }

  async createSupplier(data: CreateSupplierInput, userId: string) {
    // Validate input
    if (!data.companyName) {
      throw new ValidationError('Company name is required', {
        field: 'companyName'
      });
    }

    // Check for duplicates
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

## Logging Pattern

**Every error MUST be logged with:**
- Error code & message
- Request ID (for tracing)
- User ID (if authenticated)
- HTTP method & path
- Response status code
- Timestamp

**Example Log:**
```
[2026-02-10T15:30:00Z] ERROR
  code: VALIDATION_ERROR
  message: Invalid email format
  requestId: req-abc123
  userId: user-123
  method: POST
  path: /api/v1/community/suppliers
  statusCode: 400
```

---

## Testing Pattern

```typescript
describe('Error Handling', () => {
  it('should return 400 for validation error', async () => {
    const res = await request(app)
      .post('/api/v1/marketplace/suppliers')
      .send({ companyName: '' }) // Invalid

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.details?.field).toBe('companyName');
  });

  it('should return 403 for RLS violation', async () => {
    const res = await request(app)
      .get('/api/v1/business/orders')
      .set('Authorization', 'Bearer token-user-1')
      // Trying to access user-2's data

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('FORBIDDEN');
  });
});
```

---

## Implementation Checklist

- [ ] Community: Error handler middleware ✅ DONE (already implemented)
- [ ] Marketplace: Apply error handler pattern
- [ ] Academy: Apply error handler pattern
- [ ] Business: Apply error handler pattern
- [ ] All services: Replace custom error handling with unified classes
- [ ] Add logging to all error paths
- [ ] Test all error scenarios
- [ ] Document in API reference

---

## References

- Related: RLS security patterns
- See also: Logging standards
- Testing: Error handling test templates

