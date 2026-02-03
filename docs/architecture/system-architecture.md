# iaMenu Ecosystem - System Architecture Document

**Architect:** @architect (Aria)
**Date:** 2026-02-02
**Workflow:** Brownfield Discovery Phase 1

---

## Executive Summary

The iaMenu Ecosystem is a comprehensive platform for Portuguese restaurants combining Community Hub, Marketplace, Academy, and Business Intelligence services. The system follows a **microservices architecture** implemented as a **hybrid monorepo** using npm workspaces, with a React SPA frontend and four independent Node.js backend services sharing a single PostgreSQL database via separate schemas.

---

## 1. High-Level Architecture

### 1.1 Architecture Overview

```
                                    ┌─────────────────────────────────────────┐
                                    │           USERS / CLIENTS               │
                                    │      (Web Browsers, Mobile Apps)        │
                                    └────────────────────┬────────────────────┘
                                                         │
                                                         ▼
                          ┌──────────────────────────────────────────────────────────┐
                          │                    VERCEL CDN                             │
                          │           Frontend: prototype-vision.vercel.app           │
                          │           React 18 + Vite + Tailwind CSS (SPA)           │
                          └───────────────┬─────────┬─────────┬─────────┬────────────┘
                                          │         │         │         │
          ┌───────────────────────────────┼─────────┼─────────┼─────────┼────────────────────┐
          │                               │         │         │         │       RAILWAY      │
          │   ┌───────────────────────────▼─────────▼─────────▼─────────▼─────────────────┐  │
          │   │                           API LAYER (Node.js + Express)                    │  │
          │   │                                                                            │  │
          │   │   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐   │  │
          │   │   │   COMMUNITY      │  │   MARKETPLACE    │  │      ACADEMY         │   │  │
          │   │   │   Port: 3001     │  │   Port: 3002     │  │      Port: 3003      │   │  │
          │   │   │   + Socket.io    │  │                  │  │                      │   │  │
          │   │   └────────┬─────────┘  └────────┬─────────┘  └──────────┬───────────┘   │  │
          │   │            │                     │                       │               │  │
          │   │   ┌────────┴─────────────────────┴───────────────────────┴─────────┐    │  │
          │   │   │                     BUSINESS INTELLIGENCE                       │    │  │
          │   │   │                        Port: 3004                               │    │  │
          │   │   └────────┬─────────────────────┬───────────────────────┬─────────┘    │  │
          │   └────────────┼─────────────────────┼───────────────────────┼──────────────┘  │
          │                │                     │                       │                 │
          │                └─────────────────────┼───────────────────────┘                 │
          │                                      │                                         │
          │                            ┌─────────▼─────────┐                               │
          │                            │  PostgreSQL 16    │                               │
          │                            │   (Multi-Schema)  │                               │
          │                            │                   │                               │
          │                            │  ├─ community     │                               │
          │                            │  ├─ marketplace   │                               │
          │                            │  ├─ academy       │                               │
          │                            │  └─ business      │                               │
          │                            └───────────────────┘                               │
          └────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Monorepo Structure

```
iamenu-ecosystem/
├── package.json                    # Root workspace configuration
├── docker-compose.yml              # Local development infrastructure
├── .env                            # Root environment variables
│
├── services/                       # Backend microservices
│   ├── community/                  # @iamenu/community-api (Port 3001)
│   ├── marketplace/                # @iamenu/marketplace-api (Port 3002)
│   ├── academy/                    # @iamenu/academy-api (Port 3003)
│   ├── business/                   # @iamenu/business-api (Port 3004)
│   └── takeway-proxy/              # External proxy service
│
├── frontend/
│   └── apps/
│       └── prototype-vision/       # React 18 SPA (Port 5173)
│
├── docs/                           # Documentation
│   ├── architecture/
│   ├── stories/
│   ├── prd/
│   └── handoffs/
│
└── .aios-core/                     # Synkra AIOS framework
```

---

## 2. Service Map

### 2.1 Community Service (`@iamenu/community-api`)

| Attribute | Value |
|-----------|-------|
| **Port** | 3001 |
| **Base URL** | `/api/v1/community` |
| **Production** | `https://iamenucommunity-api-production.up.railway.app` |
| **Unique Features** | Socket.io real-time, gamification, moderation |

**Responsibilities:**
- Forum & Discussions (Posts, Comments, Reactions)
- Groups & Membership Management
- User Profiles & Followers
- Real-time Notifications (Socket.io)
- Gamification System (Points, Streaks, Achievements)
- Moderation System (Reports, Warnings, Bans)
- Refresh Token Management

**Database Schema (16 models):**
`Post`, `Comment`, `Group`, `GroupMembership`, `Profile`, `Reaction`, `Notification`, `Report`, `Follower`, `RefreshToken`, `UserPoints`, `PointsHistory`, `UserStreak`, `UserWarning`, `ModerationLog`, `UserBan`

---

### 2.2 Marketplace Service (`@iamenu/marketplace-api`)

| Attribute | Value |
|-----------|-------|
| **Port** | 3002 |
| **Base URL** | `/api/v1/marketplace` |
| **Production** | `https://iamenumarketplace-api-production.up.railway.app` |
| **Unique Features** | Complex JSON fields for quotes, nested reviews |

**Responsibilities:**
- Supplier/Vendor Management
- Product Catalog
- Reviews & Ratings
- Request for Quote (RFQ) System
- Collective Bargaining
- Price History Tracking

**Database Schema (10 models):**
`Supplier`, `Review`, `Product`, `SupplierProduct`, `QuoteRequest`, `Quote`, `CollectiveBargain`, `BargainAdhesion`, `PriceHistory`

---

### 2.3 Academy Service (`@iamenu/academy-api`)

| Attribute | Value |
|-----------|-------|
| **Port** | 3003 |
| **Base URL** | `/api/v1/academy` |
| **Production** | `https://iamenuacademy-api-production.up.railway.app` |
| **Unique Features** | Hierarchical structure (Course > Module > Lesson) |

**Responsibilities:**
- Course Management
- Module/Lesson Structure
- Student Enrollments
- Certificate Generation & Verification
- Progress Tracking

**Database Schema (5 models):**
`Course`, `Module`, `Lesson`, `Enrollment`, `Certificate`

---

### 2.4 Business Service (`@iamenu/business-api`)

| Attribute | Value |
|-----------|-------|
| **Port** | 3004 |
| **Base URL** | `/api/v1/business` |
| **Production** | `https://iamenubusiness-api-production.up.railway.app` |
| **Unique Features** | Excel uploads, daily stats caching |

**Responsibilities:**
- Restaurant Onboarding Flow (4 steps)
- Dashboard & Analytics
- Revenue & Cost Tracking
- Daily Statistics Aggregation
- Product Performance Metrics

**Database Schema (6 models):**
`Restaurant`, `RestaurantSettings`, `Product`, `Order`, `OrderItem`, `DailyStats`

---

### 2.5 Frontend (`prototype-vision`)

| Attribute | Value |
|-----------|-------|
| **Port (Dev)** | 5173 |
| **Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS 3.4 |
| **Production** | `https://prototype-vision.vercel.app` |

**Key Dependencies:**
- React Router 7.11 (routing)
- Zustand 5.0 (state management)
- Framer Motion 11.0 (animations)
- Chart.js 4.5 (charts)
- Lucide React (icons)

**Main Views (41+ components):**
- Dashboard, Community, Marketplace, Academy, Business, AI Features

---

## 3. API Contracts

### 3.1 URL Patterns

```
Development:
  Community:   http://localhost:3001/api/v1/community
  Marketplace: http://localhost:3002/api/v1/marketplace
  Academy:     http://localhost:3003/api/v1/academy
  Business:    http://localhost:3004/api/v1/business

Production (Railway):
  Community:   https://iamenucommunity-api-production.up.railway.app/api/v1/community
  Marketplace: https://iamenumarketplace-api-production.up.railway.app/api/v1/marketplace
  Academy:     https://iamenuacademy-api-production.up.railway.app/api/v1/academy
  Business:    https://iamenubusiness-api-production.up.railway.app/api/v1/business
```

### 3.2 Authentication

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT Token Structure:
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "user|admin|moderator",
  "iat": 1706745600,
  "exp": 1706749200
}
```

---

## 4. Data Flow

### 4.1 Service Communication

**Current State:** Services do NOT communicate directly with each other. All cross-service data sharing happens via:
1. **Shared userId:** All services reference users by the same userId
2. **Frontend orchestration:** The React app fetches from multiple APIs and combines data
3. **Shared JWT secret:** Single sign-on via JWT tokens

### 4.2 Real-time Communication (Socket.io - Community Only)

Events:
- `notification:new` - User notifications
- `post:new` - New post in feed
- `comment:new` - New comment on post
- `user:online/offline` - Presence indicators
- `reaction:new` - New reaction received

---

## 5. External Dependencies

### 5.1 Infrastructure Services

| Service | Provider | Purpose |
|---------|----------|---------|
| **Database** | Railway PostgreSQL | Primary data store (4 schemas) |
| **Backend Hosting** | Railway | 4 Node.js services |
| **Frontend Hosting** | Vercel | React SPA + CDN |
| **Git Repository** | GitHub | Source control + CI/CD triggers |

### 5.2 Key Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4.18 | HTTP server framework |
| Prisma | 5.7 | Database ORM |
| jsonwebtoken | 9.0 | JWT authentication |
| socket.io | 4.8 | Real-time (Community only) |
| helmet | 7.1 | Security headers |
| winston | 3.11 | Logging |

---

## 6. Technical Debt & Architectural Issues

### 6.1 Identified Issues

| Priority | Issue | Impact | Recommendation |
|----------|-------|--------|----------------|
| **High** | No inter-service communication | Limited workflows | Implement event bus (Redis Pub/Sub) |
| **High** | Missing OpenAPI/Swagger specs | Developer onboarding friction | Generate from TypeScript types |
| **Medium** | Duplicated code across services | Maintenance overhead | Extract shared package |
| **Medium** | No centralized logging | Debugging difficulty | Add correlation IDs, ELK stack |
| **Medium** | Socket.io not horizontally scalable | Cannot scale Community | Add Redis adapter |
| **Low** | Frontend uses JavaScript (not TS) | Type safety gaps | Gradual migration |
| **Low** | File uploads stored locally | Not scalable | Migrate to S3/Cloudinary |

### 6.2 Missing Components

| Component | Current State | Recommended Solution |
|-----------|---------------|---------------------|
| API Gateway | None (4 separate URLs) | Kong or custom Express gateway |
| Event Bus | None | Redis Pub/Sub or RabbitMQ |
| Shared Library | Duplicated auth/errors | `@iamenu/shared` package |
| Monitoring | Basic platform metrics | Sentry, Datadog |
| API Documentation | None | Swagger/OpenAPI |

---

## 7. Summary Statistics

| Metric | Value |
|--------|-------|
| **Backend Services** | 4 |
| **Database Models** | 38 total |
| **REST Endpoints** | 100+ |
| **Frontend Components** | 41+ |
| **Backend Language** | TypeScript |
| **Frontend Language** | JavaScript (JSX) |
| **Development Ports** | 3001-3004, 5173, 5432 |

---

## Critical Files

- `package.json` - Root workspace configuration
- `services/community/src/middleware/auth.ts` - Shared JWT pattern
- `frontend/apps/prototype-vision/src/config/api.js` - API URLs
- `services/community/prisma/schema.prisma` - Largest schema
- `services/community/src/services/websocket.service.ts` - Real-time pattern
