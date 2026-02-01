# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites

- **Node.js 18+** and **npm 9+**
- **Docker & Docker Compose** (para PostgreSQL)
- **Windows:** WSL deve estar atualizado (`wsl --update` como admin, reiniciar PC)

## Development Guidelines

### NEVER
- Implement without showing options first (always present choices as 1, 2, 3 format)
- Delete or remove content without asking first
- Delete anything created in the last 7 days without explicit approval
- Change something that was already working without justification
- Pretend work is done when it isn't — be honest about blockers and incomplete tasks
- Process a batch without validating one item first
- Add features that weren't requested
- Modify database schemas without showing the migration plan first
- Push to remote without explicit user request
- Skip tests to "save time"

### ALWAYS
- Show options before implementing (1, 2, 3 format with pros/cons)
- Validate with a single item before batch processing
- Run tests after changes: `npm test`
- Confirm destructive operations (DELETE, DROP, file removal)
- Update story checkboxes when completing tasks
- Preserve existing functionality when adding new features

---

## Project Overview

iaMenu Ecosystem is a platform for Portuguese restaurants combining: Community Hub, Marketplace (suppliers), Academy (courses), and Business Intelligence. It uses a **hybrid monorepo** with Java Spring Boot (core) and Node.js (services).

## Build & Development Commands

```bash
# Install all dependencies (npm workspaces)
npm install

# Start all services (community:3001, marketplace:3002, academy:3003, business:3004, frontend:5173)
npm run dev

# Run individual services
npm run dev:community
npm run dev:marketplace
npm run dev:business
npm run dev:academy
npm run dev:frontend

# Database (Docker required)
docker compose up postgres -d

# Prisma (run from each service directory)
cd services/<service>
npx dotenv -e ../../.env npx prisma generate        # Regenerar cliente após pull
npx dotenv -e ../../.env npx prisma migrate dev --name <migration_name>
npx prisma studio  # GUI for database

# Regenerar todos os clientes Prisma (após git pull)
npm run prisma:generate

# Testing
npm test                      # All services
npm run test:community        # Single service
npm run test:marketplace
npm run test:academy
npm run test:business

# Linting & Type Checking
npm run lint                  # ESLint with auto-fix
npm run lint:check            # Check only (no fix)
```

## Architecture

### Service Structure
```
services/
├── community/     # Port 3001 - Posts, Groups, Followers, Gamification, Moderation
├── marketplace/   # Port 3002 - Suppliers, Reviews, RFQ (Request for Quote), Price History
├── academy/       # Port 3003 - Courses, Progress Tracking, Certificates
├── business/      # Port 3004 - Dashboard, Analytics, Onboarding
└── takeway-proxy/ # External proxy service

frontend/apps/prototype-vision/  # React 18 + Vite + Tailwind (JavaScript, não TypeScript)
```

### Service Features

| Serviço | Característica Única |
|---------|---------------------|
| Community | **Socket.io** para real-time (notificações, feed) |
| Marketplace | Campos JSON complexos (quotes, offers) |
| Academy | Estrutura hierárquica (Course → Module → Lesson) |
| Business | Upload Excel, cache de stats diários |

### Architecture Stats
- **38 database models** across 4 schemas
- **100+ REST endpoints**
- **41+ frontend components**

### Backend Pattern (Node.js Services)
Each service follows: `src/{controllers, services, routes, middleware, lib}/`
- **Controllers**: Request handling and validation
- **Services**: Business logic
- **Routes**: Express route definitions
- **Middleware**: Auth (JWT), error handling, file upload (multer)
- **lib/prisma.ts**: Prisma client instance

### Database
PostgreSQL 16 with **separate schemas** per service (community, marketplace, academy, business). Each service has its own `prisma/schema.prisma` with `multiSchema` preview feature.

### Database Schemas (38 models total)

| Schema | Models | Key Entities |
|--------|--------|--------------|
| `community` | 16 | Post, Comment, Group, Profile, Notification, Reaction, Follower, RefreshToken, UserPoints, PointsHistory, UserStreak, UserWarning, UserBan, ModerationLog, Report, GroupMembership |
| `marketplace` | 10 | Supplier, Review, Product, SupplierProduct, QuoteRequest, Quote, CollectiveBargain, BargainAdhesion, PriceHistory |
| `academy` | 5 | Course, Module, Lesson, Enrollment, Certificate |
| `business` | 6 | Restaurant, RestaurantSettings, Product, Order, OrderItem, DailyStats |

### Authentication
Custom JWT shared across services. Development token available in `frontend/apps/prototype-vision/src/config/devToken.js`. All protected endpoints require `Authorization: Bearer <token>` header.

### API Base URLs (Development)
- Community: `http://localhost:3001/api/v1/community`
- Marketplace: `http://localhost:3002/api/v1/marketplace`
- Academy: `http://localhost:3003/api/v1/academy`
- Business: `http://localhost:3004/api/v1/business`

### Production URLs (Railway + Vercel)
- Community: `https://iamenucommunity-api-production.up.railway.app`
- Marketplace: `https://iamenumarketplace-api-production.up.railway.app`
- Business: `https://iamenubusiness-api-production.up.railway.app`
- Academy: `https://iamenuacademy-api-production.up.railway.app`
- Frontend: `https://prototype-vision.vercel.app`

## Testing

Tests use Jest with ts-jest. Test files in `services/<service>/tests/`.

```bash
# Run single test file
cd services/community
npx jest tests/posts.integration.test.ts

# Watch mode
npm run test:watch
```

## AIOS Agent System

This project uses Synkra AIOS with specialized AI agents activated via skills:
- **@dev** (James): Code implementation
- **@qa** (Quinn): Testing and quality
- **@architect** (Aria): System design
- **@devops** (Gage): CI/CD and deployments
- **@pm** (Morgan): Project management
- **@po** (Sarah): Product ownership
- **@aios-master** (Orion): Orchestration

Agent commands use `*` prefix: `*help`, `*create-story`, `*task`

## Story-Driven Development

Development follows stories in `docs/stories/`. When implementing:
1. Read the story file for requirements
2. Mark checkboxes as tasks complete: `[ ]` → `[x]`
3. Maintain the File List section in the story
4. Run tests before marking complete

## Git Conventions

Use conventional commits with story reference:
```
feat: implement gamification system [Story 2.3]
fix: correct RFQ status update
```

## Key Dependencies

**Backend**: Express, Prisma ORM, jsonwebtoken, socket.io (community real-time), express-validator, multer (uploads), winston (logging)

**Frontend**: React 18, React Router, Framer Motion, Chart.js, Tailwind CSS, Lucide icons, date-fns, jsPDF

## Architecture Documentation

Para detalhes completos da arquitetura, consultar:
- `docs/architecture/codebase-discovery-2026-01-31.md` - Relatório completo do codebase
- `docs/handoffs/` - Handoffs de sessões anteriores
