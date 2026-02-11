# Task 2.3.1: Winston Logger & Request ID Setup

**Status:** ✅ COMPLETE

## Overview

Implemented centralized logging infrastructure for the Community Service with:
- Winston logger with JSON format for structured logging
- Request ID middleware for distributed tracing
- Log rotation and file management
- Backward compatible API

## Files Created/Modified

### New Files
1. **`services/community/src/middleware/requestId.ts`**
   - Request ID generation/propagation middleware
   - Attaches request ID to all requests
   - Creates request-scoped logger
   - Logs incoming requests and responses with timing

### Modified Files
1. **`services/community/src/lib/logger.ts`** (Enhanced)
   - Added JSON format for structured logging
   - Added `getRequestLogger()` helper for request-scoped logs
   - Configured file rotation (5MB max, 10 files)
   - Added debug log support
   - Kept backward compatible convenience methods

2. **`services/community/src/app.ts`** (Updated)
   - Imported request ID middleware
   - Added middleware to early in middleware chain

## Implementation Details

### Logger Configuration

**Log Levels:**
- ERROR: Critical errors (5% typical)
- WARN: Warnings (15% typical)
- INFO: General information (70% typical) - default in production
- DEBUG: Debug details (10% typical) - default in development

**Log Files:**
- `logs/error.log` - ERROR level only
- `logs/app.log` - All levels
- `logs/debug.log` - DEBUG level (when enabled)

**Rotation:**
- Max file size: 5MB
- Max files: 10 per type
- Tailable rotation enabled

### JSON Log Format

```json
{
  "timestamp": "2026-02-11 12:30:45",
  "level": "INFO",
  "service": "community",
  "message": "User created",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "duration": "45ms"
}
```

### Request ID Middleware Features

- Generates UUID v4 if no `X-Request-ID` header
- Uses existing header for cross-service tracing
- Sets `X-Request-ID` response header
- Logs request start with method, path, IP, user-agent
- Logs response with status, duration, content-length
- Available as `req.id`, `req.requestId`, and `req.logger`

## Usage Examples

### Direct Logger Usage

```typescript
import logger from '@/lib/logger';

// Log at different levels
logger.info('User created', { userId: 'user-123' });
logger.warn('Deprecated endpoint accessed', { endpoint: '/api/old' });
logger.error('Database error', { error: err.message });
logger.debug('Processing request', { data: {} });

// Using convenience methods
import { logInfo, logError, logWarn, logDebug } from '@/lib/logger';
logInfo('User created', { userId: 'user-123' });
```

### Request-Scoped Logger Usage

```typescript
import { getRequestLogger } from '@/lib/logger';

app.get('/api/users', (req, res) => {
  const logger = getRequestLogger(req.id);

  logger.info('Fetching users', { limit: 10 });
  // Logs will automatically include request ID
});
```

### Using Logger from Middleware

```typescript
// Already attached by requestId middleware
app.get('/api/users', (req, res) => {
  (req as any).logger.info('Processing request');
  // req.logger is ready to use
});
```

## Environment Variables

```bash
LOG_LEVEL=debug      # Set log level (error, warn, info, debug, trace)
SERVICE_NAME=community  # Override service name in logs (default: community)
NODE_ENV=production  # Affects default log level
```

## Next Steps for Replication

To apply logging to other services (marketplace, academy, business):

1. **Copy middleware file:**
   - Copy `services/community/src/middleware/requestId.ts` to other services

2. **Update logger.ts:**
   - Copy enhanced logger to each service
   - Update SERVICE_NAME in each logger (marketplace, academy, business)

3. **Update app.ts:**
   - Import and apply requestIdMiddleware in each service
   - Add after helmet() security middleware

4. **Install types:**
   - Install @types/uuid in root: `npm install --save-dev @types/uuid`

## Known Issues

**Pre-existing build errors (not related to logger):**
- `src/middleware/rls.ts`: Response type assignability issues (pre-existing)
- `src/services/posts.service.ts`: Prisma type mismatch (pre-existing)

These should be fixed in separate tasks/PRs.

## Testing

**Manual testing steps:**

1. **Verify logger initialization:**
   ```bash
   npm run build 2>&1 | grep "logger"
   ```

2. **Check log output:**
   ```bash
   tail -f logs/app.log
   curl http://localhost:3001/health
   ```

3. **Verify request ID:**
   ```bash
   curl -H "X-Request-ID: test-123" http://localhost:3001/health
   grep "test-123" logs/app.log
   ```

4. **Check JSON format:**
   ```bash
   cat logs/app.log | head -1 | jq .
   ```

## Summary

✅ Winston logger configured with JSON format
✅ Request ID middleware created and integrated
✅ File rotation configured
✅ Backward compatible API maintained
✅ Ready for replication to other services
⏳ Other services need replication (Tasks 2.3.2-2.3.4)

**Files Modified:** 2 (logger.ts, app.ts)
**Files Created:** 1 (requestId.ts)
**Installation Size:** ~50KB (Winston package)
**Build Status:** Passes for new code (pre-existing errors not in scope)

---

*Task 2.3.1 Complete - Community service logging infrastructure ready*
