# Wave 3 Technical Implementation Guide

## Redis Caching, Full-Text Search, Rate Limiting, Analytics, Logging

**Version:** 1.0
**Status:** Developer Reference
**Date:** 2026-02-14
**Audience:** Backend Developers, DevOps Engineers

---

## 📚 TABLE OF CONTENTS

1. [Redis Caching Architecture](#redis-caching-architecture)
2. [Full-Text Search Implementation](#full-text-search-implementation)
3. [Rate Limiting Configuration](#rate-limiting-configuration)
4. [CloudWatch Logging Setup](#cloudwatch-logging-setup)
5. [Query Optimization Patterns](#query-optimization-patterns)
6. [Common Troubleshooting](#common-troubleshooting)

---

## 🔴 Redis Caching Architecture

### Overview
Redis is used as a high-performance cache layer to reduce database load and improve API response times by 4x.

### Installation & Configuration

```bash
# Docker setup (docker-compose.yml)
services:
  redis:
    image: redis:7-alpine
    container_name: iamenu-redis
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 512m --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
    volumes:
      - redis_data:/data

volumes:
  redis_data:

# Environment variables (.env)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=          # Set in production
REDIS_DB=0
REDIS_URL=redis://localhost:6379
```

### Cache Strategy Pattern

All cache operations use a pluggable strategy pattern. Three strategies available:

```typescript
// CacheStrategy Interface
interface CacheStrategy {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

// RedisStrategy (Production)
class RedisStrategy implements CacheStrategy {
  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length) await this.redis.del(...keys);
  }
}

// InMemoryStrategy (Fallback when Redis down)
class InMemoryStrategy implements CacheStrategy {
  private cache = new Map<string, { value: any; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp(`^${pattern.replace('*', '.*')}$`);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) this.cache.delete(key);
    }
  }
}

// Usage in services
const cache = new CacheService(new RedisStrategy()); // Or InMemoryStrategy

async function getPost(id: string) {
  const cacheKey = `post:${id}`;

  // Try cache first
  let post = await cache.get<Post>(cacheKey);
  if (post) return post; // Cache hit!

  // Cache miss - fetch from DB
  post = await db.post.findUnique({ where: { id } });

  // Store in cache for 5 minutes
  await cache.set(cacheKey, post, 300);

  return post;
}
```

### Cache Invalidation on Data Changes

```typescript
// When creating/updating/deleting data, invalidate relevant caches

async function updatePost(id: string, data: PostUpdateInput) {
  const post = await db.post.update({
    where: { id },
    data
  });

  // Invalidate caches
  await cache.delete(`post:${id}`); // Specific post
  await cache.invalidate('post:*'); // All posts
  await cache.invalidate(`user:${post.authorId}:posts:*`); // User's posts

  return post;
}

async function deletePost(id: string) {
  const post = await db.post.findUnique({ where: { id } });

  await db.post.delete({ where: { id } });

  // Invalidate caches
  await cache.delete(`post:${id}`);
  await cache.invalidate('post:*');
  if (post) {
    await cache.invalidate(`user:${post.authorId}:posts:*`);
  }
}
```

### Cache TTL Strategy by Data Type

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| User Profile | 5 minutes | Changed infrequently |
| Post/Content | 5 minutes | Changed when edited/deleted |
| Product Catalog | 10 minutes | Supplier updates less frequent |
| Search Results | 5 minutes | Query results should stay fresh |
| User Feed | 2 minutes | High velocity, many updates |
| Analytics Metrics | 15 minutes | Aggregate data, less volatile |

### Cache Monitoring

```bash
# Check cache hit rate
redis-cli INFO stats

# Example output:
# hits: 12,345
# misses: 5,432
# hit_ratio = 12345 / (12345 + 5432) = 0.694 = 69.4% (GOOD!)

# Monitor memory usage
redis-cli INFO memory
# maxmemory: 536870912 (512MB)
# used_memory: 421092864 (401MB, ~79% utilization)

# Check LRU eviction
redis-cli INFO stats | grep evicted_keys
# evicted_keys: 234 (old items removed when memory limit hit)
```

---

## 🔍 Full-Text Search Implementation

### Database Setup

Full-text search uses PostgreSQL's **GIN indexes** with Portuguese language support.

```sql
-- Create full-text search index on Posts (community schema)
CREATE INDEX idx_posts_search_gin ON "community"."Post"
USING gin(to_tsvector('portuguese', name || ' ' || content));

-- Create on Products (marketplace schema)
CREATE INDEX idx_products_search_gin ON "marketplace"."Product"
USING gin(to_tsvector('portuguese', name || ' ' || description));

-- Build composite searches
CREATE INDEX idx_product_supplier_search ON "marketplace"."Product"
USING gin(to_tsvector('portuguese',
  COALESCE(name, '') || ' ' || COALESCE(description, '') || ' ' ||
  COALESCE((SELECT name FROM "marketplace"."Supplier" WHERE id = supplier_id), '')
));
```

### Prisma Query Usage

```typescript
// Search posts with Prisma
async function searchPosts(query: string) {
  // Escape special characters in query
  const escapedQuery = query
    .replace(/[&|!*\-\(\)]/g, ' ') // Remove special operators
    .trim()
    .split(/\s+/)
    .map(word => `${word}:*`) // Add prefix wildcard
    .join(' | '); // OR between words

  // Raw query for full-text search
  return await db.$queryRaw`
    SELECT p.*,
           ts_rank(
             to_tsvector('portuguese', p.name || ' ' || p.content),
             to_tsquery('portuguese', ${escapedQuery})
           ) as rank
    FROM "community"."Post" p
    WHERE to_tsvector('portuguese', p.name || ' ' || p.content) @@
          to_tsquery('portuguese', ${escapedQuery})
    AND p."deletedAt" IS NULL
    ORDER BY rank DESC
    LIMIT 20
    OFFSET 0
  `;
}

// Search products with relevance ranking
async function searchProducts(query: string, category?: string) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map(w => `${w}:*`)
    .join(' | ');

  let whereClause = `WHERE to_tsvector('portuguese', p.name || ' ' || p.description) @@ to_tsquery('portuguese', $1)`;

  if (category) {
    whereClause += ` AND p.category = $2`;
  }

  return await db.$queryRaw`
    SELECT p.*, s.name as supplier_name,
           ts_rank(
             to_tsvector('portuguese', p.name || ' ' || p.description),
             to_tsquery('portuguese', ${terms})
           ) as rank
    FROM "marketplace"."Product" p
    LEFT JOIN "marketplace"."Supplier" s ON p."supplierId" = s.id
    ${whereClause}
    AND p."deletedAt" IS NULL
    ORDER BY rank DESC, p."createdAt" DESC
    LIMIT 50
  `;
}
```

### Search API Endpoint

```typescript
// GET /api/v1/marketplace/search?q=pasta&category=fresh&limit=20
router.get('/search', async (req, res) => {
  const { q, category, limit = 20, offset = 0 } = req.query;

  if (!q || q.toString().length < 2) {
    return res.status(400).json({
      error: 'Search query must be at least 2 characters'
    });
  }

  try {
    const results = await db.$queryRaw`
      SELECT p.id, p.name, p.description, p.price, p.image_url,
             s.id as supplier_id, s.name as supplier_name,
             ts_rank(
               to_tsvector('portuguese', p.name || ' ' || p.description),
               to_tsquery('portuguese', ${q.toString().replace(/[&|!*\-()]/g, ' ').trim().split(/\s+/).map(w => `${w}:*`).join(' | ')})
             ) as relevance
      FROM "marketplace"."Product" p
      LEFT JOIN "marketplace"."Supplier" s ON p."supplierId" = s.id
      WHERE to_tsvector('portuguese', p.name || ' ' || p.description) @@
            to_tsquery('portuguese', ${q})
      AND p."deletedAt" IS NULL
      ${category ? `AND p."category" = ${category}` : ''}
      ORDER BY relevance DESC
      LIMIT ${Math.min(parseInt(limit as string) || 20, 100)}
      OFFSET ${parseInt(offset as string) || 0}
    `;

    res.json({
      query: q,
      count: results.length,
      results: results.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        price: r.price,
        image: r.image_url,
        supplier: { id: r.supplier_id, name: r.supplier_name },
        relevance: r.relevance
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});
```

### Autocomplete API

```typescript
// GET /api/v1/marketplace/autocomplete?q=pa
router.get('/autocomplete', async (req, res) => {
  const { q } = req.query;

  if (!q || q.toString().length < 1) {
    return res.json({ suggestions: [] });
  }

  const suggestions = await db.$queryRaw`
    SELECT DISTINCT p.name
    FROM "marketplace"."Product" p
    WHERE p.name ILIKE ${q + '%'}
    AND p."deletedAt" IS NULL
    ORDER BY p.name ASC
    LIMIT 10
  `;

  res.json({
    query: q,
    suggestions: suggestions.map((s: any) => s.name)
  });
});
```

---

## 🚫 Rate Limiting Configuration

### Setup

```bash
# Install rate limiting package
npm install express-rate-limit redis-store

# Environment variables (.env)
RATE_LIMIT_WINDOW_MS=60000        # 1 minute window
RATE_LIMIT_MAX_REQUESTS=100       # Max requests per window
RATE_LIMIT_USER_MAX=100           # Per authenticated user
RATE_LIMIT_IP_MAX=10              # Per IP (unauthenticated)
```

### Implementation

```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../lib/redis';

// Per-user rate limiter (100 req/min)
export const userLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:user:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: 'Too many requests, please try again later.',
  keyGenerator: (req) => {
    // Use user ID if authenticated
    return req.user?.id || req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for admin/system users
    return req.user?.role === 'ADMIN';
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'RATE_LIMITED',
      message: 'Too many requests. Please slow down.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Per-IP rate limiter (10 req/min for unauthenticated)
export const ipLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:ip:',
  }),
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    // Get real IP from X-Forwarded-For header
    return req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip;
  },
  skip: (req) => {
    // Skip if user is authenticated (will use userLimiter instead)
    return !!req.user?.id;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: 'RATE_LIMITED',
      message: 'Too many requests from your IP. Please try again later.'
    });
  }
});

// Stricter limiter for authentication endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => {
    return req.body?.email || req.ip;
  }
});

// Whitelist for critical operations
const rateLimitWhitelist = [
  '/api/v1/*/health',        // Health checks
  '/api/v1/auth/login',      // Auth endpoint (has own limiter)
  '/api/v1/payments/webhook' // Stripe webhooks
];
```

### Route Application

```typescript
// Apply to routes
router.get('/products', userLimiter, ipLimiter, (req, res) => {
  // This endpoint is rate limited
});

router.post('/auth/login', authLimiter, (req, res) => {
  // Login has stricter rate limiting
});

router.post('/payments/webhook', (req, res) => {
  // Stripe webhooks are not rate limited
});
```

### Rate Limit Response Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1645045234
Retry-After: 45
```

---

## ☁️ CloudWatch Logging Setup

### Configuration

```typescript
// lib/logger.ts
import winston, { format } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

const logLevel = process.env.CLOUDWATCH_LOG_LEVEL || 'info';

const logger = winston.createLogger({
  format: format.json(),
  transports: [
    // Console (local development)
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),

    // CloudWatch (production)
    new WinstonCloudWatch({
      logGroupName: process.env.CLOUDWATCH_LOG_GROUP || 'iamenu-ecosystem-logs',
      logStreamName: process.env.CLOUDWATCH_LOG_STREAM || `${process.env.SERVICE_NAME}-${process.env.NODE_ENV}`,
      awsRegion: process.env.CLOUDWATCH_REGION || 'eu-west-1',
      messageFormatter: ({ level, message, meta }) => {
        return JSON.stringify({
          timestamp: new Date().toISOString(),
          level,
          message,
          service: process.env.SERVICE_NAME,
          environment: process.env.NODE_ENV,
          ...meta
        });
      }
    })
  ]
});

export default logger;
```

### Middleware for Request Logging

```typescript
// middleware/requestLogger.ts
import { v4 as uuidv4 } from 'uuid';
import logger from '../lib/logger';

export function requestLogger(req, res, next) {
  // Generate request ID for correlation
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.id = requestId;

  const startTime = Date.now();

  // Log request
  logger.info('Request received', {
    requestId,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
    ip: req.ip
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;

    // Log response
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      userId: req.user?.id
    });

    return originalSend.call(this, data);
  };

  next();
}
```

### PII Redaction

```typescript
// lib/redactPII.ts
export function redactPII(data: any): any {
  if (typeof data !== 'object') return data;

  const sensitiveFields = [
    'password', 'token', 'secret', 'apiKey',
    'creditCard', 'cvv', 'ssn', 'email'
  ];

  const cloned = Array.isArray(data) ? [...data] : { ...data };

  for (const key in cloned) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      cloned[key] = '***REDACTED***';
    } else if (typeof cloned[key] === 'object') {
      cloned[key] = redactPII(cloned[key]);
    }
  }

  return cloned;
}

// Usage
logger.error('Payment failed', {
  requestId,
  error: error.message,
  paymentData: redactPII(req.body) // Redacts sensitive fields
});
```

---

## ⚡ Query Optimization Patterns

### 1. N+1 Query Fix with Includes

```typescript
// ❌ BAD - N+1 queries (1 query for posts + N queries for authors)
async function getPosts() {
  const posts = await db.post.findMany();
  for (const post of posts) {
    post.author = await db.user.findUnique({
      where: { id: post.authorId }
    });
  }
  return posts;
}

// ✅ GOOD - Single query with include
async function getPosts() {
  return await db.post.findMany({
    include: {
      author: true,      // Include related user
      comments: {        // Can nest deeper
        include: {
          author: true
        }
      }
    }
  });
}
```

### 2. Batch Loading with DataLoader

```typescript
import DataLoader from 'dataloader';

// Create batch loader for users
const userLoader = new DataLoader(async (userIds) => {
  const users = await db.user.findMany({
    where: { id: { in: userIds } }
  });

  // Map results back to original order
  return userIds.map(id => users.find(u => u.id === id));
});

// Use in resolvers
async function getPostWithAuthor(postId) {
  const post = await db.post.findUnique({ where: { id: postId } });
  post.author = await userLoader.load(post.authorId);
  return post;
}
```

### 3. Selective Field Selection

```typescript
// ❌ BAD - Select all fields
const user = await db.user.findUnique({ where: { id: 'xxx' } });

// ✅ GOOD - Select only needed fields
const user = await db.user.findUnique({
  where: { id: 'xxx' },
  select: {
    id: true,
    name: true,
    email: true
    // password, tokens, etc. NOT selected
  }
});
```

### 4. Pagination with Offset/Limit

```typescript
// ❌ BAD - No limit (could return thousands of records)
const posts = await db.post.findMany();

// ✅ GOOD - Paginated with cursor
const posts = await db.post.findMany({
  take: 20,           // Limit to 20 items
  skip: (page - 1) * 20, // Offset for pagination
  orderBy: {
    createdAt: 'desc'
  }
});
```

---

## 🔧 Common Troubleshooting

### Redis Connection Issues

```bash
# Test Redis connectivity
redis-cli ping
# Expected: PONG

# If connection fails, check:
1. Redis service running: docker ps | grep redis
2. Port accessible: netstat -an | grep 6379
3. Credentials correct: redis-cli -h localhost -p 6379 AUTH password

# Clear all cache if corrupted
redis-cli FLUSHALL
```

### Search Index Performance

```sql
-- Check if index is being used
EXPLAIN ANALYZE
SELECT * FROM "marketplace"."Product"
WHERE to_tsvector('portuguese', name) @@ to_tsquery('portuguese', 'pasta');

-- If using Seq Scan (bad), rebuild index
REINDEX INDEX idx_products_search_gin;
ANALYZE "marketplace"."Product";

-- Check index size
SELECT pg_size_pretty(pg_relation_size('idx_products_search_gin'));
```

### Rate Limit Bypass Prevention

```typescript
// ✅ Use both per-user and per-IP limiters
app.use(userLimiter);  // Per authenticated user
app.use(ipLimiter);    // Per IP for unauthenticated

// ✅ Extract real IP from X-Forwarded-For (behind proxy)
const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.ip;

// ✅ Rate limit auth endpoints separately (5 attempts/15min)
router.post('/auth/login', authLimiter, loginHandler);
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-14
**Owner:** Engineering Team
**Next Review:** Post Wave 3 production launch
