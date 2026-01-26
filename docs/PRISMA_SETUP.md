# 🗄️ Prisma Setup & Migration Guide

**Last Updated:** January 2026
**Status:** ✅ All migrations resolved and deployed

---

## Overview

This project uses **Prisma ORM** with **PostgreSQL** and **multi-schema architecture**:

- **Community API** → `schema=community`
- **Marketplace API** → `schema=marketplace`
- **Academy API** → `schema=academy`
- **Business API** → `schema=business`

Each service has its own isolated schema for data separation while sharing a single PostgreSQL database.

---

## Quick Start

### Prerequisites

1. **PostgreSQL 16** running on `localhost:5432`
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d postgres

   # Or install locally and verify:
   pg_isready -h localhost -p 5432
   ```

2. **Environment variables** configured
   - See `docs/SECURITY_AND_SETUP.md` for setup
   - Each service has `.env.example` template

### One-Time Setup

```bash
# From project root
npm install

# For each service (Community, Marketplace, Academy, Business):
# 1. Copy .env.example to .env
cp services/community/.env.example services/community/.env
cp services/marketplace/.env.example services/marketplace/.env
cp services/academy/.env.example services/academy/.env
cp services/business/.env.example services/business/.env

# 2. Verify database connection
cd services/community && npx prisma migrate status
# Output: "Database schema is up to date!"

# 3. (Optional) View database in Prisma Studio
npx prisma studio
```

---

## Database Connection

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?schema=[schema_name]
```

### Examples

**Community API (.env):**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu?schema=community"
```

**Marketplace API (.env):**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu?schema=marketplace"
```

### Connection Parameters

| Parameter | Default | Purpose |
|-----------|---------|---------|
| user | postgres | PostgreSQL user |
| password | postgres | PostgreSQL password |
| host | localhost | Database server address |
| port | 5432 | PostgreSQL port |
| database | iamenu | Database name |
| schema | {service} | Service-specific schema |

---

## Prisma Commands

### Daily Development

```bash
# From service directory

# Generate Prisma Client (required after schema changes)
npm run prisma:generate

# Check migration status
npm run prisma:migrate
# (Interactive - creates new migrations for schema changes)

# View database with GUI
npm run prisma:studio

# Run seed script (populate test data)
npm run prisma:seed
```

### Troubleshooting

```bash
# Reset entire database (⚠️ WARNING: Deletes all data)
npm run prisma:migrate reset

# Check migration status
npx prisma migrate status

# Mark migration as applied (if manually applied)
npx prisma migrate resolve --applied migration_name

# List all migrations
ls prisma/migrations/

# View raw migration SQL
cat prisma/migrations/[migration_id]/migration.sql
```

---

## Schema Management

### Current Schemas

#### Community Schema
```typescript
// models/entities
- Post (forums/discussions)
- Comment (post comments)
- Profile (user profiles)
- Group (community groups)
- GroupMember (group membership)
- Follower (follow relationships)
- Reaction (post reactions)
- Notification (user notifications)
- AchievementUnlock (gamification)
```

#### Marketplace Schema
```typescript
// e-commerce entities
- Supplier (vendor profiles)
- Product (marketplace products)
- ProductCategory (product classification)
- ProductImage (product images)
- Order (purchase orders)
- OrderItem (items in orders)
- Review (product reviews)
- BargainAdhesion (promotional offers)
- PriceHistory (price tracking)
```

#### Academy Schema
```typescript
// learning management
- Course (training courses)
- Module (course modules)
- Lesson (lesson content)
- Enrollment (student enrollments)
- Certificate (achievement certificates)
- Progress (learning progress)
- VerificationCode (identity verification)
```

#### Business Schema
```typescript
// business operations
- Restaurant (business profiles)
- Product (menu items)
- Order (business orders)
- DailyStats (daily metrics)
```

---

## Creating Migrations

### When to Create Migrations

You need a new migration when:
- Adding a new model/table
- Adding/removing model fields
- Changing field types
- Adding relationships
- Adding constraints

### Steps

```bash
# 1. Update schema.prisma
# Edit: services/{service}/prisma/schema.prisma

# 2. Create migration
cd services/{service}
npx prisma migrate dev --name descriptive_migration_name

# Example:
npx prisma migrate dev --name add_product_categories

# 3. Review generated SQL (optional)
cat prisma/migrations/[timestamp]_add_product_categories/migration.sql

# 4. Commit migration files
git add prisma/migrations/
git commit -m "feat: add product categories schema"
```

### Migration Files

Migrations are stored in: `services/{service}/prisma/migrations/`

Each migration contains:
```
[timestamp]_[description]/
├── migration.sql          # The SQL to apply
└── migration_lock.toml    # Lock file (do not edit)
```

---

## Syncing Schemas with Database

### After Pulling Code with Schema Changes

```bash
# From service directory

# Check what needs to be applied
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy

# (For development: interactive mode)
npx prisma migrate dev
```

### If Schema is Out of Sync

```bash
# 1. Check differences
npx prisma migrate status

# 2. If stuck in "pending" state:
npx prisma migrate resolve --applied migration_name

# 3. Verify status
npx prisma migrate status
# Should output: "Database schema is up to date!"
```

---

## Multi-Schema Architecture

### Why Multi-Schema?

✅ **Data Isolation**: Services cannot accidentally access other schemas
✅ **Independent Scaling**: Each schema can be optimized separately
✅ **Easier Backups**: Can backup single schema without others
✅ **Compliance**: Separate user data and business data
✅ **Single Database**: Reduced infrastructure complexity

### How It Works

1. **Schema Assignment** - Each service declares its schema in `schema.prisma`
   ```yaml
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     schemas  = ["community"]
   }
   ```

2. **Connection String** - DATABASE_URL includes the schema
   ```
   postgresql://user:pass@host:5432/db?schema=community
   ```

3. **Queries** - Prisma automatically targets the correct schema
   ```typescript
   const post = await prisma.post.findUnique({ where: { id: '123' } });
   // Translates to: SELECT ... FROM community.posts WHERE id = '123'
   ```

---

## Performance Optimization

### Indexes

Critical fields should have indexes:

```prisma
model Post {
  id        String   @id @default(uuid())
  authorId  String
  groupId   String?
  title     String
  body      String
  createdAt DateTime @default(now())

  // Add indexes for common queries
  @@index([authorId])
  @@index([groupId])
  @@index([createdAt])
}
```

### Relations

Optimize with select/include:

```typescript
// ❌ N+1 problem: Loads all posts then all authors separately
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.profile.findUnique({ where: { userId: post.authorId } });
}

// ✅ Efficient: Single query with JOIN
const posts = await prisma.post.findMany({
  include: {
    author: { select: { username: true, profilePhoto: true } }
  }
});
```

### Connection Pooling

PostgreSQL connection pooling (via Prisma):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["community"]

  // Prisma handles pooling automatically
  // For explicit control, use PgBouncer or similar
}
```

---

## Troubleshooting

### Error: "Cannot find module @prisma/client"

```bash
# Solution: Generate Prisma client
npm run prisma:generate
```

### Error: "ECONNREFUSED 127.0.0.1:5432"

```bash
# PostgreSQL is not running. Start it:
docker-compose up -d postgres

# Or verify it's running:
pg_isready -h localhost -p 5432
```

### Error: "The database schema is not empty"

```bash
# Migration baseline issue. Options:

# Option 1: Mark migrations as applied (recommended)
npx prisma migrate resolve --applied migration_name

# Option 2: Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Error: "Authentication failed"

```bash
# Check .env DATABASE_URL credentials
# Verify PostgreSQL user/password:
psql -U postgres -h localhost -W
# Enter password when prompted (default: postgres)
```

### Error: "EPERM: operation not permitted"

```bash
# File permission issue on Windows
# Solution: Clean and regenerate
rm -rf node_modules/.prisma
npm run prisma:generate
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All migrations committed to git
- [ ] `prisma migrate status` shows "up to date"
- [ ] Database backups are recent
- [ ] `.env` not committed to git
- [ ] DATABASE_URL points to production database
- [ ] JWT_SECRET rotated for production

### Deployment Steps

```bash
# 1. Deploy code with migrations included
git pull origin main

# 2. Install dependencies
npm install

# 3. Apply migrations
cd services/community && npx prisma migrate deploy
cd ../marketplace && npx prisma migrate deploy
cd ../academy && npx prisma migrate deploy
cd ../business && npx prisma migrate deploy

# 4. Restart services
npm run start

# 5. Verify health
curl http://localhost:3001/health
```

### Rollback

If migration causes issues:

```bash
# ⚠️ WARNING: This permanently removes recent data

# 1. Identify last good migration
npx prisma migrate status

# 2. Remove problematic migration from database
# (Requires manual SQL or database admin)

# 3. Re-apply from last known good state
npx prisma migrate deploy
```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Database Schemas Guide](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Migration Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Multi-Schema](https://www.postgresql.org/docs/current/ddl-schemas.html)

---

## Questions?

For Prisma-specific issues:
1. Check `.env` files are correct
2. Verify PostgreSQL is running: `docker-compose ps`
3. Check migration status: `npx prisma migrate status`
4. Review error messages carefully

For schema design questions:
- Ask project architect
- Review existing models in `prisma/schema.prisma`
- Follow established patterns
