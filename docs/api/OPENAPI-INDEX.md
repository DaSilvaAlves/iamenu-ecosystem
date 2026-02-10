# OpenAPI Specifications Index

**Version:** 3.0.0
**Generated:** 2026-02-10
**Total Services:** 4
**Total Endpoints:** 40+

## Quick Navigation

| Service | File | Port | Status |
|---------|------|------|--------|
| **Community** | `openapi-community.yaml` | 3001 | ✅ Complete |
| **Marketplace** | `openapi-marketplace.yaml` | 3002 | ✅ Complete |
| **Academy** | `openapi-academy.yaml` | 3003 | ✅ Complete |
| **Business** | `openapi-business.yaml` | 3004 | ✅ Complete |

---

## Community API (openapi-community.yaml)

**Base URL:** `http://localhost:3001/api/v1/community`

### Endpoints by Category

#### Posts (8 endpoints)
- `GET /posts` - List all posts (public)
- `POST /posts` - Create new post
- `GET /posts/{id}` - Get specific post (public)
- `PATCH /posts/{id}` - Update post
- `DELETE /posts/{id}` - Delete post
- `GET /posts/{id}/reactions` - Get reactions (public)
- `POST /posts/{id}/react` - Toggle reaction
- `POST /posts/{id}/comments` - Create comment

#### Comments (5 endpoints)
- `GET /posts/{postId}/comments` - Get comments (public)
- `DELETE /posts/{postId}/comments/{id}` - Delete comment
- `GET /posts/{postId}/comments/{id}/reactions` - Get reactions (public)
- `POST /posts/{postId}/comments/{id}/react` - Toggle reaction

#### Groups (6 endpoints)
- `GET /groups` - List user's groups
- `POST /groups` - Create group
- `GET /groups/{id}` - Get group details
- `PATCH /groups/{id}` - Update group
- `DELETE /groups/{id}` - Delete group

#### Notifications (3 endpoints)
- `GET /notifications` - List notifications (STRICT: own only)
- `POST /notifications/{id}/read` - Mark as read
- `DELETE /notifications/{id}` - Delete notification

**Total Community Endpoints:** 22

---

## Marketplace API (openapi-marketplace.yaml)

**Base URL:** `http://localhost:3002/api/v1/marketplace`

### Endpoints by Category

#### Suppliers (6 endpoints)
- `GET /suppliers` - List suppliers (public, RLS filtered)
- `POST /suppliers` - Create supplier
- `GET /suppliers/{id}` - Get supplier (public, RLS filtered)
- `PATCH /suppliers/{id}` - Update supplier
- `DELETE /suppliers/{id}` - Delete supplier

#### Reviews (5 endpoints)
- `GET /suppliers/{supplierId}/reviews` - List reviews (public)
- `POST /suppliers/{supplierId}/reviews` - Create review
- `PATCH /suppliers/{supplierId}/reviews/{id}` - Update review (owner)
- `DELETE /suppliers/{supplierId}/reviews/{id}` - Delete review (owner)

#### Quotes (4 endpoints)
- `GET /quotes` - List quotes (RLS filtered)
- `POST /quotes` - Create quote
- `GET /quotes/{id}` - Get quote (RLS filtered)
- `PATCH /quotes/{id}` - Update quote status

#### Collective Bargains (3 endpoints)
- `GET /bargains` - List bargains (public)
- `GET /bargains/{id}` - Get bargain (public)
- `POST /bargains/{id}` - Join bargain

**Total Marketplace Endpoints:** 18

---

## Academy API (openapi-academy.yaml)

**Base URL:** `http://localhost:3003/api/v1/academy`

### Endpoints by Category

#### Courses (6 endpoints)
- `GET /courses` - List courses (published visible to all)
- `POST /courses` - Create course
- `GET /courses/{id}` - Get course (public access rules)
- `PATCH /courses/{id}` - Update course (instructor)
- `DELETE /courses/{id}` - Delete course (instructor)

#### Enrollments (4 endpoints)
- `GET /enrollments` - List user's enrollments (STRICT: own only)
- `POST /enrollments` - Enroll in course
- `DELETE /enrollments/{id}` - Unenroll from course
- `PATCH /enrollments/{id}` - Update progress

#### Certificates (2 endpoints)
- `GET /certificates` - List user's certificates (STRICT: own only)
- `GET /certificates/verify/{code}` - Verify certificate (PUBLIC)

**Total Academy Endpoints:** 12

---

## Business API (openapi-business.yaml)

**Base URL:** `http://localhost:3004/api/v1/business`

### Endpoints by Category

#### Dashboard Analytics (10 endpoints)
- `GET /dashboard/stats` - General statistics
- `GET /dashboard/top-products` - Top products
- `GET /dashboard/alerts` - Critical alerts
- `GET /dashboard/opportunities` - Business opportunities
- `GET /dashboard/sales-trends` - Sales trends
- `GET /dashboard/ai-prediction` - AI forecast
- `GET /dashboard/menu-engineering` - Menu profitability matrix
- `GET /dashboard/demand-forecast` - 7-day forecast
- `GET /dashboard/peak-hours-heatmap` - Peak hours
- `GET /dashboard/benchmark` - Sector benchmark

**Total Business Endpoints:** 10

---

## Common Response Schemas

All services share these schemas:

### Error Response
```yaml
type: object
properties:
  error:
    type: string
    enum:
      - VALIDATION_ERROR
      - INVALID_TOKEN
      - FORBIDDEN
      - NOT_FOUND
      - CONFLICT
      - RATE_LIMITED
      - INTERNAL_SERVER_ERROR
  message:
    type: string
  statusCode:
    type: integer
  timestamp:
    type: string
    format: date-time
  details:
    type: object
    nullable: true
```

### Pagination
```yaml
type: object
properties:
  limit:
    type: integer
    minimum: 1
    maximum: 100
    default: 20
  offset:
    type: integer
    minimum: 0
    default: 0
  total:
    type: integer
  hasMore:
    type: boolean
```

### List Response
```yaml
type: object
properties:
  data:
    type: array
  pagination:
    $ref: '#/components/schemas/Pagination'
```

---

## Authentication

All services use JWT Bearer authentication:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Public Endpoints** (no auth required):
- Community: `GET /posts`, `GET /posts/{id}`, reactions
- Marketplace: `GET /suppliers`, `GET /reviews`
- Academy: `GET /courses`, `GET /certificates/verify/{code}`
- Business: (All endpoints require auth)

---

## HTTP Status Codes

| Code | Meaning | Examples |
|------|---------|----------|
| 200 | Success | GET, PATCH successful |
| 201 | Created | POST successful |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | RLS violation or insufficient perms |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource or business rule |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Unexpected error |

---

## Testing Each Service

### Community API
```bash
# List posts
curl http://localhost:3001/api/v1/community/posts

# Create post (requires auth)
curl -X POST http://localhost:3001/api/v1/community/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","body":"Hello world"}'
```

### Marketplace API
```bash
# List suppliers
curl http://localhost:3002/api/v1/marketplace/suppliers

# Create supplier (requires auth)
curl -X POST http://localhost:3002/api/v1/marketplace/suppliers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Fresh Foods"}'
```

### Academy API
```bash
# List courses
curl http://localhost:3003/api/v1/academy/courses?published=true

# Enroll in course (requires auth)
curl -X POST http://localhost:3003/api/v1/academy/enrollments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"<uuid>"}'
```

### Business API
```bash
# Get dashboard stats (requires auth)
curl http://localhost:3004/api/v1/business/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"

# Get demand forecast
curl http://localhost:3004/api/v1/business/dashboard/demand-forecast \
  -H "Authorization: Bearer $TOKEN"
```

---

## Integration Tools

### Postman
1. Click "Import" in Postman
2. Select "Link" tab
3. Paste: `http://localhost:3001/api/v1/community`
4. Click "Import"

### Insomnia
1. File → Import → From URL
2. Paste OpenAPI spec file path
3. Generate requests automatically

### Swagger UI (Local)
```bash
docker run -p 8080:8080 \
  -e SWAGGER_JSON=/mnt/openapi.yaml \
  -v $(pwd)/docs/api/openapi-community.yaml:/mnt/openapi.yaml \
  swaggerapi/swagger-ui
```

Open: `http://localhost:8080`

---

## Row-Level Security (RLS) Enforcement

### STRICT Access Control
These endpoints enforce strict RLS (user can ONLY see their own data):

| Service | Endpoint | Rule |
|---------|----------|------|
| Community | `GET /notifications` | See own notifications only |
| Academy | `GET /enrollments` | See own enrollments only |
| Academy | `GET /certificates` | See own certificates only |
| Business | All endpoints | See own restaurant data |

### Filtering
These endpoints filter results by RLS but allow visibility:

| Service | Endpoint | Rule |
|---------|----------|------|
| Community | `GET /posts` | See published posts (RLS for private) |
| Marketplace | `GET /suppliers` | See verified, non-verified for owner |
| Marketplace | `GET /quotes` | See own sent or received |

---

## Phase C Deliverables

✅ **openapi-community.yaml** - 22 endpoints, complete schemas
✅ **openapi-marketplace.yaml** - 18 endpoints, RLS patterns
✅ **openapi-academy.yaml** - 12 endpoints, enrollment flow
✅ **openapi-business.yaml** - 10 endpoints, analytics
✅ **README.md** - Comprehensive guide
✅ **OPENAPI-INDEX.md** - This file
✅ **endpoints-reference.md** - Updated with links

**Total Deliverables:** 6 files
**Total Endpoints:** 62 fully documented

---

## Next Steps (Phase D)

- [ ] Create Swagger UI instance in Docker
- [ ] Add API request examples (cURL, JavaScript, Python)
- [ ] Generate client SDKs (OpenAPI Generator)
- [ ] Create API testing suite
- [ ] Add GraphQL schema (alternative to REST)
- [ ] Implement API versioning strategy

---

**Last Updated:** 2026-02-10
**Format:** OpenAPI 3.0.0
**Status:** Complete (Phase C)
