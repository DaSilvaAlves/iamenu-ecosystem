# API Endpoints Reference

**Generated:** 2026-02-10
**Total Endpoints:** 40+ (across 4 services)
**Status:** COMPLETE (Phase C - OpenAPI Documentation)
**Format:** OpenAPI 3.0.0 YAML files

---

## Community Service (Port 3001)

### Posts

**GET** `/posts` - List all posts
```
Query Parameters:
  limit: integer (1-100, default: 20)
  offset: integer (default: 0)
  search: string (optional)
  sort: string (optional, "created_at:desc")

Response:
{
  "data": [
    {
      "id": "uuid",
      "authorId": "uuid",
      "title": "string",
      "body": "string",
      "status": "active|archived",
      "createdAt": "2026-02-10T15:30:00Z",
      "views": 42,
      "likes": 5
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 127,
    "hasMore": true
  }
}

Status Codes:
  200 - Success
  401 - Missing/invalid auth
  500 - Server error
```

**POST** `/posts` - Create new post
```
Request:
{
  "title": "string",
  "body": "string",
  "category": "string",
  "tags": "string (comma-separated)",
  "groupId": "uuid (optional)"
}

Response:
{
  "data": {
    "id": "uuid",
    "authorId": "uuid",
    "title": "string",
    ...
  },
  "message": "Post created successfully"
}

Status Codes:
  201 - Created
  400 - Validation error
  401 - Unauthorized
  500 - Server error
```

**GET** `/posts/{id}` - Get specific post
```
Response:
{
  "data": { ... post object ... }
}

Status Codes:
  200 - Success
  404 - Post not found
  403 - Access denied
```

**PATCH** `/posts/{id}` - Update post
```
Request:
{
  "title": "string (optional)",
  "body": "string (optional)",
  "status": "active|archived (optional)"
}

Response:
{
  "data": { ... updated post ... }
}

Status Codes:
  200 - Success
  400 - Validation error
  403 - Cannot edit other users' posts
  404 - Not found
```

**DELETE** `/posts/{id}` - Delete post
```
Status Codes:
  204 - Deleted (no content)
  403 - Cannot delete other users' posts
  404 - Not found
```

### Groups

**GET** `/groups` - List user's groups
**POST** `/groups` - Create new group
**GET** `/groups/{id}` - Get specific group
**PATCH** `/groups/{id}` - Update group
**DELETE** `/groups/{id}` - Delete group

### Notifications

**GET** `/notifications` - List user's notifications (STRICT: own only)
**POST** `/notifications/{id}/read` - Mark as read
**DELETE** `/notifications/{id}` - Delete notification

---

## Marketplace Service (Port 3002)

### Suppliers

**GET** `/suppliers` - List suppliers
```
Query Parameters:
  limit: integer (1-100, default: 20)
  offset: integer (default: 0)
  search: string (full-text search)
  filter: string (e.g., "verified=true")

Response:
{
  "data": [
    {
      "id": "uuid",
      "companyName": "string",
      "verified": boolean,
      "ratingAvg": "19.99",
      "reviewCount": 42,
      ...
    }
  ],
  "pagination": { ... }
}

Notes:
- Non-verified suppliers only visible to owner
- RLS filters to owner's full profile, others see public fields
```

**POST** `/suppliers` - Create supplier profile
**GET** `/suppliers/{id}` - Get supplier details
**PATCH** `/suppliers/{id}` - Update supplier
**DELETE** `/suppliers/{id}` - Delete supplier (soft delete recommended)

### Quotes

**GET** `/quotes` - List quotes (RLS: own sent or from own requests)
**POST** `/quotes` - Create new quote
**GET** `/quotes/{id}` - Get specific quote
**PATCH** `/quotes/{id}` - Update quote status
**DELETE** `/quotes/{id}` - Delete quote

### Reviews

**GET** `/reviews` - List all reviews (public data)
**POST** `/reviews` - Create new review
**PATCH** `/reviews/{id}` - Update review (owner only)
**DELETE** `/reviews/{id}` - Delete review (owner only)

---

## Academy Service (Port 3003)

### Courses

**GET** `/courses` - List courses
```
Query Parameters:
  published: boolean (default: true)
  category: string (optional)
  level: string (optional: beginner|intermediate|advanced)

Response:
- Published courses visible to all
- Unpublished visible only to instructor
```

**POST** `/courses` - Create new course
**GET** `/courses/{id}` - Get course details
**PATCH** `/courses/{id}` - Update course
**DELETE** `/courses/{id}` - Delete course

### Enrollments

**GET** `/enrollments` - List user's enrollments (STRICT: own only)
**POST** `/enrollments` - Enroll in course
**DELETE** `/enrollments/{id}` - Unenroll from course

### Certificates

**GET** `/certificates` - List user's certificates (STRICT: own only)
**GET** `/certificates/verify/{code}` - Verify certificate by code (public)

---

## Business Service (Port 3004)

### Restaurants

**GET** `/restaurants` - List user's restaurants (STRICT: own only)
```
Response:
- User can ONLY see their own restaurants
- RLS prevents access to other owner data
```

**POST** `/restaurants` - Create new restaurant
**GET** `/restaurants/{id}` - Get restaurant details
**PATCH** `/restaurants/{id}` - Update restaurant
**DELETE** `/restaurants/{id}` - Delete restaurant

### Orders

**GET** `/orders` - List user's orders (RLS filtered)
```
Query Parameters:
  limit, offset, status, sort, date_from, date_to

Response:
- User can only see own restaurant orders
```

**POST** `/orders` - Create new order
**GET** `/orders/{id}` - Get order details
**PATCH** `/orders/{id}` - Update order status
**DELETE** `/orders/{id}` - Cancel order

### Daily Stats

**GET** `/stats/daily` - Get daily statistics
```
Query Parameters:
  date_from: string (YYYY-MM-DD)
  date_to: string (YYYY-MM-DD)

Response:
- User can only see own restaurant stats
- Includes: revenue, orders count, avg ticket, food cost %
```

---

## Common Error Responses

### 400 - Validation Error
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "statusCode": 400,
  "timestamp": "2026-02-10T15:30:00Z",
  "details": {
    "field": "email",
    "constraint": "email"
  }
}
```

### 401 - Unauthorized
```json
{
  "error": "INVALID_TOKEN",
  "message": "JWT token is invalid or expired",
  "statusCode": 401,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

### 403 - Forbidden (RLS Violation)
```json
{
  "error": "FORBIDDEN",
  "message": "Access denied - insufficient permissions",
  "statusCode": 403,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

### 404 - Not Found
```json
{
  "error": "NOT_FOUND",
  "message": "Post with ID not found",
  "statusCode": 404,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

### 409 - Conflict
```json
{
  "error": "CONFLICT",
  "message": "Supplier with this name already exists",
  "statusCode": 409,
  "timestamp": "2026-02-10T15:30:00Z"
}
```

---

## Pagination Examples

### List with Pagination
```bash
# Get first 20 posts
curl http://localhost:3001/api/v1/community/posts?limit=20&offset=0

# Get next page
curl http://localhost:3001/api/v1/community/posts?limit=20&offset=20

# Get with search
curl http://localhost:3001/api/v1/community/posts?search=RLS&limit=10
```

### Response Structure
```json
{
  "data": [ ... ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 427,
    "hasMore": true
  }
}
```

---

## Rate Limiting

All endpoints subject to:
- **Authenticated:** 1000 requests/hour
- **Unauthenticated:** 100 requests/hour

Response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1707062400
```

On limit exceeded:
```
HTTP 429 Too Many Requests

{
  "error": "RATE_LIMITED",
  "message": "Rate limit exceeded",
  "statusCode": 429,
  "retryAfter": 3600
}
```

---

## Documentation Links

- OpenAPI Spec: `docs/api/openapi-base.yaml`
- Error Handling: `docs/standards/error-handling.md`
- API Standards: `docs/standards/api-standards.md`
- Validation Checklist: `.aios-core/checklists/api-validation-checklist.md`

