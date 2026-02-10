# API Standards & Conventions

**Version:** 1.0
**Status:** ACTIVE
**Applies To:** All REST API endpoints (100+ endpoints across 4 services)

---

## 1. URL Structure

### Base URLs

```
Development:
  Community:   http://localhost:3001/api/v1/community
  Marketplace: http://localhost:3002/api/v1/marketplace
  Academy:     http://localhost:3003/api/v1/academy
  Business:    http://localhost:3004/api/v1/business

Production:
  Community:   https://iamenucommunity-api-production.up.railway.app/api/v1/community
  Marketplace: https://iamenumarketplace-api-production.up.railway.app/api/v1/marketplace
  Academy:     https://iamenuacademy-api-production.up.railway.app/api/v1/academy
  Business:    https://iamenubusiness-api-production.up.railway.app/api/v1/business
```

### Resource Naming

**Collections (plural):**
```
GET    /api/v1/community/posts          # List all posts
POST   /api/v1/community/posts          # Create new post
```

**Specific Resources (by ID):**
```
GET    /api/v1/community/posts/{id}     # Get specific post
PATCH  /api/v1/community/posts/{id}     # Update post
DELETE /api/v1/community/posts/{id}     # Delete post
```

**Nested Resources:**
```
GET    /api/v1/community/posts/{id}/comments           # Comments on post
POST   /api/v1/community/posts/{id}/comments           # Add comment
DELETE /api/v1/community/posts/{id}/comments/{commentId} # Delete comment
```

---

## 2. Request/Response Format

### Request Headers (Required)

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Request Body - List/Search

```typescript
GET /api/v1/marketplace/suppliers?limit=10&offset=0&search=organic

Query Parameters:
  limit:  number    (1-100, default: 20) - Items per page
  offset: number    (default: 0) - Skip N items
  search: string    (optional) - Full-text search
  sort:   string    (optional) - "name:asc" or "created_at:desc"
  filter: string    (optional) - "verified=true&status=active"
```

### Response - List

```json
{
  "data": [
    { "id": "1", "name": "Supplier 1", ... },
    { "id": "2", "name": "Supplier 2", ... }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 42,
    "hasMore": true
  }
}
```

### Response - Single Resource

```json
{
  "data": {
    "id": "supplier-123",
    "name": "Organic Supplies Co",
    "verified": true,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-02-10T15:30:00Z"
  }
}
```

### Response - Success (POST/PATCH)

```json
{
  "data": { "id": "new-id", ... },
  "message": "Resource created successfully",
  "statusCode": 201
}
```

---

## 3. HTTP Methods

| Method | Purpose | Returns | Use When |
|--------|---------|---------|----------|
| `GET` | Read resource | 200 (OK) | Fetching data |
| `POST` | Create resource | 201 (Created) | Creating new |
| `PATCH` | Update resource | 200 (OK) | Partial update |
| `PUT` | Replace resource | 200 (OK) | Full replacement |
| `DELETE` | Delete resource | 204 (No Content) | Deleting |

**Rules:**
- Never use GET for mutations (data-changing operations)
- PATCH for partial updates, PUT for full replacement
- DELETE should return 204 with no body (or 200 with deletion confirmation)

---

## 4. Authentication & Authorization

### JWT Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Token Payload:
{
  "userId": "user-123",
  "email": "user@example.com",
  "role": "user|admin|moderator",
  "iat": 1706745600,
  "exp": 1706749200
}
```

### RLS Integration

All queries automatically filtered by `app.current_user_id` (set by RLS middleware).

Example: User can only see own notifications
```typescript
await prisma.notification.findMany()
// RLS policy ensures: WHERE userId = current_user_id
```

---

## 5. Pagination

**Standard Pagination Response:**

```json
{
  "data": [ ... ],
  "pagination": {
    "limit": 20,
    "offset": 40,
    "total": 427,
    "hasMore": true
  }
}
```

**Defaults:**
- limit: 20 items
- offset: 0
- max limit: 100

---

## 6. Data Types & Formatting

### Timestamps

Always ISO 8601 format:
```
"2026-02-10T15:30:00Z"
```

### Money/Decimals

Always decimal with 2 decimal places:
```json
{
  "price": "19.99",
  "discount": "3.50",
  "total": "16.49"
}
```

### IDs

Always UUID v4:
```
"550e8400-e29b-41d4-a716-446655440000"
```

### Booleans

Always lowercase:
```json
{
  "verified": true,
  "isActive": false
}
```

---

## 7. Validation Rules

### Required Fields Validation

```typescript
// ✅ GOOD
if (!email || !email.includes('@')) {
  throw new ValidationError('Invalid email', { field: 'email' });
}

// ❌ BAD
if (!email) {
  throw new Error('Email required'); // Wrong error format
}
```

### Response on Validation Error

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "statusCode": 400,
  "details": {
    "field": "email",
    "constraint": "email"
  }
}
```

---

## 8. Rate Limiting

**Standard Rate Limits:**
- Authenticated users: 1000 requests/hour
- Unauthenticated: 100 requests/hour

**Response Header:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1707062400
```

**On Limit Exceeded:**
```json
{
  "error": "RATE_LIMITED",
  "message": "Rate limit exceeded. Try again later.",
  "statusCode": 429,
  "retryAfter": 3600
}
```

---

## 9. API Documentation

Every endpoint MUST document:
- Purpose
- Authentication required
- Request parameters
- Response format
- Error scenarios
- Example curl/code

---

## 10. Testing Template

```typescript
describe('Supplier API', () => {
  describe('GET /api/v1/marketplace/suppliers', () => {
    it('should return list with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/marketplace/suppliers')
        .set('Authorization', `Bearer ${token}`)
        .query({ limit: 10, offset: 0 })

      expect(res.status).toBe(200);
      expect(res.body.data).toBeArray();
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should filter by search term', async () => {
      const res = await request(app)
        .get('/api/v1/marketplace/suppliers')
        .query({ search: 'organic' })

      expect(res.body.data.every(s => s.name.includes('organic'))).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .get('/api/v1/marketplace/suppliers')

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('INVALID_TOKEN');
    });
  });
});
```

---

## Checklist for New Endpoints

- [ ] Use correct HTTP method (GET/POST/PATCH/DELETE)
- [ ] Follow resource naming convention (plural collections)
- [ ] Add authentication middleware
- [ ] Validate input with consistent error format
- [ ] Return standard response structure
- [ ] Add pagination for list endpoints
- [ ] Document endpoint in API reference
- [ ] Write tests (happy path + error paths)
- [ ] Test RLS permissions
- [ ] Add to API monitoring

