# iaMenu Ecosystem - System Architecture

**Version:** 1.0.0
**Last Updated:** 2026-02-14
**Status:** Development Phase with Critical Configuration Issues Identified & Fixed

---

## Executive Summary

The **iamenu-ecosystem** is a hybrid monorepo platform for Portuguese restaurants featuring:
- **4 Microservices** (Node.js + Express + TypeScript)
- **React Frontend** with Vite build system
- **PostgreSQL Database** with multi-schema architecture
- **Modular Design** for independent service scaling
- **Real-time Capabilities** (Socket.io ready)

### Current Status
✅ **Functional:** Backend services, database, frontend
⚠️ **Issues Fixed:** CORS configuration, environment variables, port assignments
🔄 **In Progress:** Socket.io real-time implementation

---

## 1. SERVICE ARCHITECTURE

### 1.1 Microservices Overview

| Service | Port | Purpose | Technology | Database |
|---------|------|---------|-----------|----------|
| **Community API** | 3001 | Forums, groups, real-time notifications, gamification | Express + TypeScript + Prisma + Socket.io | `community` schema |
| **Marketplace API** | 3002 | Supplier management, price comparison, RFQ system | Express + TypeScript + Prisma | `marketplace` schema |
| **Academy API** | 3003 | Course management, enrollments, certificates | Express + TypeScript + Prisma | `academy` schema |
| **Business API** | 3004 | Dashboard, analytics, onboarding, Excel imports | Express + TypeScript + Prisma | `business` schema |
| **Frontend** | 5173 | React web application | React 18 + Vite + TypeScript | (Client-side) |

### 1.2 Service Dependencies

```
All Services → PostgreSQL (primary dependency)
Frontend → All 4 APIs (via HTTP + JWT)
Services → Do NOT depend on each other (independent)
```

### 1.3 Technology Stack

**Backend Services:**
- Runtime: Node.js 18+
- Framework: Express.js 4.18
- Language: TypeScript 5.3
- ORM: Prisma 5.7.1
- Authentication: JWT (custom implementation)
- Real-time: Socket.io 4.8
- Security: Helmet, CORS, Rate Limiting
- Database: PostgreSQL 16

**Frontend:**
- Framework: React 18.2
- Build Tool: Vite 5.2
- Language: JavaScript (no TypeScript)
- State Management: Zustand 5.0
- HTTP Client: Axios 1.13
- Styling: Tailwind CSS 3.4
- Routing: React Router 7.11

**Database:**
- Engine: PostgreSQL 16
- Strategy: Multi-schema per service
- Total Models: 38 across 4 schemas
- Connection: Prisma ORM

---

## 2. PORT ASSIGNMENTS (CORRECT)

### Development Environment

```
Frontend (Vite):      5173 (primary)
                      5174, 5175 (alternatives, not configured)

Community API:        3001
Marketplace API:      3002
Academy API:          3003
Business API:         3004

PostgreSQL:           5432
```

### Documentation Note
⚠️ **README.md contained incorrect port numbers:**
- Documented Community as 3004 (actually 3001)
- Documented Marketplace as 3005 (actually 3002)
- Documented Business as 3002 (actually 3004)

**Status:** Fixed in this version

---

## 3. CORS CONFIGURATION (Standardized)

All services now follow consistent pattern:

```typescript
// Standard CORS configuration (all services)
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));
```

### Allowed Origins

**Development:**
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`

**Production:**
- `https://prototype-vision.vercel.app`

**Configured Via:** `CORS_ORIGIN` environment variable

---

## 4. DATABASE ARCHITECTURE

### 4.1 Connection

```
Development (Local):  postgresql://postgres:postgres@localhost:5432/iamenu
Docker Containers:    postgresql://postgres:postgres@postgres:5432/iamenu
Production (Railway): [Railway PostgreSQL URL]
```

### 4.2 Schema Design

| Schema | Models | Purpose |
|--------|--------|---------|
| **community** | 16 | Posts, comments, groups, profiles, notifications, gamification, moderation |
| **marketplace** | 10 | Suppliers, products, quotes, reviews, price history |
| **academy** | 5 | Courses, modules, lessons, enrollments, certificates |
| **business** | 6 | Restaurants, settings, orders, analytics, daily stats |

### 4.3 Key Features

- **Multi-Schema Strategy:** Each service has isolated schema
- **Prisma ORM:** Typed database access, migrations per service
- **Shared Database:** Single `iamenu` database instance
- **Independent Migrations:** Each service manages its own schema evolution

---

## 5. AUTHENTICATION & AUTHORIZATION

### 5.1 JWT Token Flow

```
1. Frontend: GET /api/v1/community/auth/test-token
   ↓
2. Backend: Returns JWT token (dev mode)
   {
     "userId": "user-123",
     "email": "user@example.com",
     "role": "user",
     "iat": 1707922000,
     "exp": 1707925600
   }
   ↓
3. Frontend: Stores token in localStorage as 'auth_token'
   ↓
4. Subsequent requests: Include "Authorization: Bearer <token>" header
   ↓
5. Backend: Validates JWT signature against JWT_SECRET
   - Valid: Attach user to request, proceed
   - Invalid/Expired: Return 403 Forbidden
   - Missing: Return 401 Unauthorized
```

### 5.2 Token Management

**Storage:** localStorage (key: `auth_token`)

**Refresh Mechanism:**
- Endpoint: `POST /api/v1/community/auth/refresh`
- Requires: Refresh token in request body
- Returns: New access token + refresh token

**Auto-Retry Logic:**
1. Request fails with 401/403
2. Client calls refresh endpoint
3. Obtains new token
4. Retries original request
5. If refresh fails: Clear tokens, logout user

### 5.3 Security Status

⚠️ **Issues Fixed:**
- ✅ JWT_SECRET now environment variable (not hardcoded)
- ✅ CORS configured to prevent unauthorized origins
- ✅ Helmet security headers enabled
- ✅ Rate limiting on sensitive endpoints

🚨 **Outstanding Issues:**
- Token stored in localStorage (XSS-vulnerable) → Should use httpOnly cookies
- CSRF protection needed
- No token revocation mechanism
- No SameSite cookie attributes

---

## 6. API DESIGN PATTERNS

### 6.1 Endpoint Naming

```
GET    /api/v1/{service}/{resource}              # List
GET    /api/v1/{service}/{resource}/{id}         # Get one
POST   /api/v1/{service}/{resource}               # Create
PATCH  /api/v1/{service}/{resource}/{id}         # Update
DELETE /api/v1/{service}/{resource}/{id}         # Delete
POST   /api/v1/{service}/{resource}/{id}/action # Custom action
```

### 6.2 Error Response Format

```json
{
  "error": "ErrorType",
  "message": "Human-readable message",
  "details": "Optional technical details",
  "hint": "Development hint"
}
```

### 6.3 HTTP Status Codes

- **200 OK:** Success
- **201 Created:** Resource created
- **400 Bad Request:** Validation error
- **401 Unauthorized:** Missing or invalid token
- **403 Forbidden:** Token valid but insufficient permissions
- **404 Not Found:** Resource doesn't exist
- **500 Internal Server Error:** Server error

---

## 7. ENVIRONMENT VARIABLES

### 7.1 Required Configuration

```bash
# Backend Services (.env)
PORT=3001                    # Port number (service-specific)
NODE_ENV=development         # development | production
LOG_LEVEL=debug              # debug | info | warn | error

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/iamenu?schema={service}

# Authentication
JWT_SECRET=dev-secret-change-in-production   # Change in production!

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,https://prototype-vision.vercel.app

# Optional
SENTRY_DSN=                  # Error tracking (optional)
OPENAI_API_KEY=              # AI features
```

### 7.2 Frontend Configuration

```bash
# Frontend/.env
VITE_COMMUNITY_API_URL=http://localhost:3001/api/v1/community
VITE_MARKETPLACE_API_URL=http://localhost:3002/api/v1/marketplace
VITE_BUSINESS_API_URL=http://localhost:3004/api/v1/business
VITE_ACADEMY_API_URL=http://localhost:3003/api/v1/academy
```

⚠️ **Security Note:** API keys should NOT be in frontend .env. Use backend endpoints.

---

## 8. DEPLOYMENT ARCHITECTURE

### 8.1 Production Stack

| Component | Platform | URL |
|-----------|----------|-----|
| Community API | Railway | https://iamenucommunity-api-production.up.railway.app |
| Marketplace API | Railway | https://iamenumarketplace-api-production.up.railway.app |
| Academy API | Railway | https://iamenuacademy-api-production.up.railway.app |
| Business API | Railway | https://iamenubusiness-api-production.up.railway.app |
| Frontend | Vercel | https://prototype-vision.vercel.app |
| Database | Railway PostgreSQL | Managed by Railway |

### 8.2 Docker Deployment

```bash
# Build all services
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f community

# Stop services
docker compose down
```

**Note:** Docker uses `postgres:5432` (container network), not `localhost:5432`

---

## 9. DEVELOPMENT WORKFLOW

### 9.1 Local Setup

```bash
# 1. Clone and install
git clone <repo>
cd iamenu-ecosystem
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with API keys

# 3. Start PostgreSQL
docker compose up postgres -d

# 4. Run migrations (order matters)
npm run prisma:generate
npm run prisma:migrate

# 5. Start development
npm run dev

# 6. Access services
Frontend:     http://localhost:5173
Community:    http://localhost:3001
Marketplace:  http://localhost:3002
Academy:      http://localhost:3003
Business:     http://localhost:3004
```

### 9.2 Common Commands

```bash
# Development
npm run dev                    # All services + frontend
npm run dev:community         # Single service
npm run dev:marketplace       # Single service

# Database
npm run prisma:generate       # Regenerate Prisma client
npm run prisma:migrate        # Run migrations
npm run prisma:seed           # Seed database

# Testing
npm test                      # All tests
npm run test:community        # Single service tests
npm run lint                  # Check code style
npm run lint:fix              # Auto-fix style issues

# Docker
docker compose up postgres -d # Start PostgreSQL
docker compose down           # Stop all services
docker compose logs -f        # View logs
```

---

## 10. TROUBLESHOOTING

### Issue: CORS Error (403 Forbidden)

**Symptoms:** Browser shows "Access to fetch at [...] has been blocked by CORS policy"

**Solutions:**
1. Verify service is running: `curl http://localhost:300x/health`
2. Check CORS_ORIGIN in .env includes your origin
3. Restart service after .env changes
4. Check browser DevTools Network tab for OPTIONS request status

### Issue: Port Already in Use (EADDRINUSE)

**Symptoms:** Error "listen EADDRINUSE: address already in use :::3001"

**Solutions:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or restart npm
npm run dev  # Properly kills old processes
```

### Issue: Database Connection Refused

**Symptoms:** "connect ECONNREFUSED 127.0.0.1:5432"

**Solutions:**
1. Check PostgreSQL is running: `docker compose ps`
2. Check DATABASE_URL uses correct host (localhost for local, postgres for Docker)
3. Verify password is correct in .env
4. Restart PostgreSQL: `docker compose restart postgres`

### Issue: Authentication Failing (401/403)

**Symptoms:** All API calls return 401 Unauthorized or 403 Forbidden

**Solutions:**
1. Obtain fresh token: `curl http://localhost:3001/api/v1/community/auth/test-token`
2. Verify token in localStorage: Open DevTools > Application > localStorage > auth_token
3. Check JWT_SECRET in .env is correct
4. Verify token format in header: `Authorization: Bearer <token>`

---

## 11. MONITORING & LOGGING

### 11.1 Logging

**Backend:** Winston logger with levels:
- `debug` - Development details
- `info` - General information
- `warn` - Warnings (degraded state)
- `error` - Errors (operational failure)

**Frontend:** Console logs + Sentry (optional)

**Database:** Prisma query logs with `logLevel: 'query'` in schema.prisma

### 11.2 Health Checks

```bash
# Community API
curl http://localhost:3001/health

# Response:
{
  "status": "healthy",
  "service": "community-api",
  "version": "1.0.0",
  "uptime": 3600,
  "websocket": { "enabled": true }
}
```

---

## 12. SECURITY CONSIDERATIONS

### 12.1 Implemented

- ✅ JWT authentication on all protected endpoints
- ✅ CORS configured with explicit origin whitelist
- ✅ Helmet security headers
- ✅ Rate limiting (3 posts/24h on Community)
- ✅ Input validation via express-validator
- ✅ HTTPS enforced in production

### 12.2 Recommendations

- [ ] Implement httpOnly cookies for token storage
- [ ] Add CSRF protection
- [ ] Implement token revocation/blacklist
- [ ] Add request signing for service-to-service calls
- [ ] Implement secrets rotation strategy
- [ ] Add API key for external service access
- [ ] Implement audit logging
- [ ] Add rate limiting to all endpoints
- [ ] Implement feature flags for safe rollouts

---

## 13. PERFORMANCE CONSIDERATIONS

### 13.1 Current Optimizations

- ✅ Database indexes on frequently queried fields
- ✅ Prisma with proper relation loading
- ✅ Vite for fast frontend builds
- ✅ Compression middleware enabled
- ✅ Morgan HTTP logging

### 13.2 Future Optimizations

- [ ] Redis caching layer
- [ ] Database query optimization
- [ ] Frontend code splitting
- [ ] CDN for static assets
- [ ] Service worker for offline support
- [ ] Query pagination on all list endpoints
- [ ] GraphQL for efficient data fetching

---

## 14. DEPLOYMENT CHECKLIST

### Before Production

- [ ] Update JWT_SECRET with strong random value
- [ ] Configure CORS_ORIGIN for production URL only
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure SENTRY_DSN for error tracking
- [ ] Set up database backups
- [ ] Configure environment-specific .env files
- [ ] Run security audit (npm audit)
- [ ] Load test all APIs
- [ ] Document all API endpoints in Swagger/OpenAPI
- [ ] Set up monitoring and alerting
- [ ] Create runbooks for common issues
- [ ] Verify backup/restore procedures

---

## 15. CONTACTS & REFERENCES

**Repository:** https://github.com/DaSilvaAlves/iamenu-ecosystem
**Author:** Eurico Alves <euricojsalves@gmail.com>
**Team:** @dev (Dex), @qa (Quinn), @architect (Aria), @devops (Gage)

---

**Document Status:** ✅ Complete - Ready for Team Reference
