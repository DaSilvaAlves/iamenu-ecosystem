# iaMenu Ecosystem API Documentation

**Generated:** 2026-02-10
**Status:** COMPLETE (Phase C - OpenAPI/Swagger Documentation)

## Overview

This directory contains comprehensive API documentation for the iaMenu Ecosystem, including OpenAPI (Swagger) specifications and reference guides for all microservices.

## Services Documentation

### 🔵 Community API (Port 3001)
**File:** `openapi-community.yaml`

Features:
- Posts, comments, and reactions
- Groups and memberships
- Notifications
- Follower system
- Gamification (points, streaks, badges)
- Moderation (reports, warnings, bans)

**Key Endpoints:**
- `GET /posts` - List all posts
- `POST /posts` - Create new post
- `GET /posts/{id}` - Get specific post
- `PATCH /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `POST /posts/{id}/react` - Toggle reaction
- `POST /posts/{postId}/comments` - Create comment
- `GET /groups` - List user's groups
- `GET /notifications` - List user's notifications

**Database Schema:** `community` schema (16 models)

---

### 🟢 Marketplace API (Port 3002)
**File:** `openapi-marketplace.yaml`

Features:
- Supplier management and verification
- Product catalog with bulk pricing
- Quote requests and responses
- Review system (verified purchases only)
- Collective bargains for restaurant groups

**Key Endpoints:**
- `GET /suppliers` - List suppliers (public)
- `POST /suppliers` - Create supplier profile
- `GET /suppliers/{id}` - Get supplier details
- `PATCH /suppliers/{id}` - Update supplier
- `GET /suppliers/{supplierId}/reviews` - Get supplier reviews
- `POST /suppliers/{supplierId}/reviews` - Create review
- `GET /quotes` - List quotes (RLS filtered)
- `POST /quotes` - Create new quote
- `GET /bargains` - List collective bargains
- `POST /bargains/{id}` - Join bargain

**Database Schema:** `marketplace` schema (10 models)

---

### 🟡 Academy API (Port 3003)
**File:** `openapi-academy.yaml`

Features:
- Course management with modules and lessons
- Student enrollment and progress tracking
- Certificate generation and verification
- Content access control based on enrollment

**Key Endpoints:**
- `GET /courses` - List courses (published visible to all)
- `POST /courses` - Create new course
- `GET /courses/{id}` - Get course details
- `PATCH /courses/{id}` - Update course
- `GET /enrollments` - List user's enrollments (STRICT)
- `POST /enrollments` - Enroll in course
- `DELETE /enrollments/{id}` - Unenroll
- `GET /certificates` - List user's certificates (STRICT)
- `GET /certificates/verify/{code}` - Verify certificate (PUBLIC)

**Database Schema:** `academy` schema (5 models)

---

### 🔴 Business API (Port 3004)
**File:** `openapi-business.yaml`

Features:
- Restaurant profile and settings
- Order management and tracking
- Advanced analytics and AI predictions
- Demand forecasting and menu engineering
- Performance benchmarking against market

**Key Endpoints:**
- `GET /dashboard/stats` - General statistics
- `GET /dashboard/top-products` - Top performing products
- `GET /dashboard/alerts` - Critical business alerts
- `GET /dashboard/opportunities` - Business improvement opportunities
- `GET /dashboard/sales-trends` - Sales trends over time
- `GET /dashboard/ai-prediction` - AI-powered forecast
- `GET /dashboard/menu-engineering` - Menu profitability matrix
- `GET /dashboard/demand-forecast` - 7-day demand forecast
- `GET /dashboard/peak-hours-heatmap` - Peak hours analytics
- `GET /dashboard/benchmark` - Performance vs sector

**Database Schema:** `business` schema (6 models)

---

## API Specifications

### OpenAPI 3.0.0 Format

All APIs follow OpenAPI 3.0.0 specification. You can:
- View specs directly in YAML files
- Import into Swagger UI, Insomnia, Postman, etc.
- Generate client SDKs using OpenAPI generators

### Base URLs

**Development (Local):**
```
Community:  http://localhost:3001/api/v1/community
Marketplace: http://localhost:3002/api/v1/marketplace
Academy:     http://localhost:3003/api/v1/academy
Business:    http://localhost:3004/api/v1/business
```

**Production (Railway):**
```
Community:  https://iamenucommunity-api-production.up.railway.app/api/v1/community
Marketplace: https://iamenumarketplace-api-production.up.railway.app/api/v1/marketplace
Academy:     https://iamenuacademy-api-production.up.railway.app/api/v1/academy
Business:    https://iamenubusiness-api-production.up.railway.app/api/v1/business
```

### Authentication

All endpoints (except public ones marked `security: []`) require JWT token:

```
Authorization: Bearer <JWT_TOKEN>
```

**JWT Payload:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user|admin|moderator",
  "exp": 1707062400
}
```

### Error Handling

All services return errors in unified format:

```json
{
  "error": "ERROR_CODE",
  "message": "User-friendly error message",
  "statusCode": 400,
  "timestamp": "2026-02-10T15:30:00Z",
  "details": {
    "field": "email",
    "constraint": "email"
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` (400) - Invalid request parameters
- `INVALID_TOKEN` (401) - JWT token is invalid or expired
- `FORBIDDEN` (403) - Access denied (insufficient permissions or RLS violation)
- `NOT_FOUND` (404) - Resource does not exist
- `CONFLICT` (409) - Business logic violation or duplicate resource
- `RATE_LIMITED` (429) - Rate limit exceeded
- `INTERNAL_SERVER_ERROR` (500) - Unexpected server error

### Pagination

List endpoints support pagination:

```
GET /endpoint?limit=20&offset=0
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 427,
    "hasMore": true
  }
}
```

**Parameters:**
- `limit` (int, 1-100, default: 20) - Items per page
- `offset` (int, default: 0) - Items to skip

### Rate Limiting

All endpoints subject to rate limits:
- **Authenticated:** 1000 requests/hour
- **Unauthenticated:** 100 requests/hour

**Response Headers:**
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

## Row-Level Security (RLS)

Some endpoints enforce strict RLS rules:

| Endpoint | RLS Rule |
|----------|----------|
| `GET /enrollments` | User can see ONLY their own enrollments |
| `GET /certificates` | User can see ONLY their own certificates |
| `GET /restaurants` | User can see ONLY their own restaurants |
| `GET /notifications` | User can see ONLY their own notifications |
| `GET /orders` | User can see ONLY their restaurant's orders |
| `GET /quotes` | User can see ONLY sent or received quotes |

Attempting to access other users' data returns `403 FORBIDDEN`.

---

## Unified Standards

### Implemented in Sprint 3
✅ Consistent error handling across all services
✅ JWT-based authentication
✅ Row-Level Security (RLS) enforcement
✅ Unified pagination format
✅ Rate limiting
✅ OpenAPI 3.0.0 documentation

See: `docs/standards/error-handling.md`, `docs/standards/api-standards.md`

---

## Testing the APIs

### Using cURL

```bash
# Get development token
TOKEN=$(curl -s http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' | jq -r .token)

# Make authenticated request
curl http://localhost:3001/api/v1/community/posts \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman / Insomnia

1. Import OpenAPI spec file (e.g., `openapi-community.yaml`)
2. Set `Authorization` header with Bearer token
3. Test individual endpoints

### Using cURL with Swagger UI

```bash
# Start local Swagger UI (if available)
docker run -p 8080:8080 -e SWAGGER_JSON=/mnt/openapi.yaml \
  -v $(pwd)/docs/api/openapi-community.yaml:/mnt/openapi.yaml \
  swaggerapi/swagger-ui
```

Then open: `http://localhost:8080`

---

## Related Documentation

- **API Standards:** `docs/standards/api-standards.md` - Implementation guidelines
- **Error Handling:** `docs/standards/error-handling.md` - Error code reference
- **Validation Checklist:** `.aios-core/checklists/api-validation-checklist.md` - Testing checklist
- **Database Architecture:** `docs/architecture/codebase-discovery-2026-01-31.md` - Schema details
- **Endpoints Reference:** `docs/api/endpoints-reference.md` - Quick endpoint summary

---

## Development Guidelines

### Adding New Endpoints

1. Create route in `services/<service>/src/routes/`
2. Implement controller in `services/<service>/src/controllers/`
3. Add to OpenAPI spec (e.g., `openapi-<service>.yaml`)
4. Update `endpoints-reference.md` if public-facing
5. Run tests: `npm test`
6. Verify lint: `npm run lint`

### Endpoint Checklist

Before marking endpoint as complete:
- [ ] Route defined in Express app
- [ ] Controller implemented with error handling
- [ ] OpenAPI spec documented
- [ ] Unit tests written
- [ ] Integration tests passing
- [ ] Authentication/RLS applied if needed
- [ ] Error responses tested
- [ ] Pagination implemented for list endpoints
- [ ] Rate limiting applied
- [ ] Documentation updated

---

## Changelog

### 2026-02-10 (Phase C)
- ✅ Created OpenAPI specs for all 4 services
- ✅ Documented 40+ endpoints total
- ✅ Added error handling documentation
- ✅ Created API README and reference guides
- ✅ Unified authentication and RLS patterns

---

**Last Updated:** 2026-02-10
**Maintained By:** AIOS - Architect Agent (@architect)
