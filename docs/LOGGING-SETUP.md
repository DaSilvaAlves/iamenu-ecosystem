# Centralized Logging Setup Guide
## iaMenu Ecosystem - All Backend Services

**Last Updated:** 2026-02-11
**Status:** ✅ Production Ready
**Coverage:** Community, Marketplace, Academy, Business Services

---

## 🚀 Quick Start

### For Developers

The logging system is **automatically configured**. Just use the logger in your code:

```typescript
import logger from './lib/logger';

// Log at different levels
logger.info('User created', { userId: 'user-123' });
logger.warn('High memory usage', { memoryMB: 512 });
logger.error('Database connection failed', { error: error.message });
logger.debug('Processing item', { itemId: '456' });
```

### Request-Scoped Logging

In Express route handlers, use the request-scoped logger with automatic request ID:

```typescript
app.get('/api/resource', (req: Request, res: Response) => {
  const requestLogger = (req as any).logger;

  requestLogger.info('Fetching resource', { resourceId: '123' });
  // ... your code ...
});
```

The request logger automatically includes:
- ✅ Request ID (UUID)
- ✅ Service name
- ✅ Timestamp
- ✅ Log level

---

## 📋 Setup Overview

### What's Configured

Each service has:
1. **lib/logger.ts** - Winston logger configuration
2. **lib/redact.ts** - Sensitive data redaction utility
3. **middleware/requestId.ts** - Request ID generation and propagation
4. **lib/logger.validation.ts** - Validation test suite

### What's Automatic

- ✅ Log directory creation
- ✅ File rotation (5MB max, 10 files)
- ✅ Request ID generation (UUID v4)
- ✅ Sensitive data redaction
- ✅ Console + file output
- ✅ Structured JSON format

---

## 🔧 Configuration

### Environment Variables

```bash
# Set log level (default: 'debug' in dev, 'info' in production)
LOG_LEVEL=debug

# Set service name (auto-detected from package.json)
SERVICE_NAME=marketplace

# Node environment
NODE_ENV=development  # or production
```

### Log Levels

| Level | Use Case | Color |
|-------|----------|-------|
| **ERROR** | Critical failures | Red 🔴 |
| **WARN** | Warnings, non-critical issues | Yellow 🟡 |
| **INFO** | Important events, user actions | Green 🟢 |
| **DEBUG** | Detailed debugging info | Blue 🔵 |
| **TRACE** | Very detailed tracing | Gray ⚪ |

### File Locations

```
services/{SERVICE}/logs/
├── app.log         # All logs (rotated daily, 5MB max)
└── error.log       # Only ERROR logs (rotated, 5MB max)
```

---

## 📝 Usage Examples

### Basic Logging

```typescript
import logger from './lib/logger';

// Info level
logger.info('Order created', {
  orderId: 'ORDER-123',
  amount: 99.99,
  customerId: 'CUST-456'
});

// Warning level
logger.warn('Low inventory', {
  productId: 'PROD-789',
  remaining: 5
});

// Error level
logger.error('Payment failed', {
  error: error.message,
  stack: error.stack,
  orderId: 'ORDER-123'
});

// Debug level (development only)
logger.debug('Processing request', {
  requestId: req.id,
  payload: req.body
});
```

### In Express Controllers

```typescript
import { Request, Response } from 'express';
import logger from '../lib/logger';

export const createUser = async (req: Request, res: Response) => {
  const requestLogger = (req as any).logger;

  try {
    requestLogger.info('Creating user', { email: req.body.email });

    const user = await userService.create(req.body);

    requestLogger.info('User created successfully', { userId: user.id });
    res.json(user);
  } catch (error) {
    requestLogger.error('Failed to create user', {
      error: error instanceof Error ? error.message : String(error),
      email: req.body.email
    });
    res.status(500).json({ error: 'Failed to create user' });
  }
};
```

### In Service Classes

```typescript
import logger from '../lib/logger';

export class UserService {
  async createUser(data: UserData) {
    logger.info('Creating user in database', { email: data.email });

    try {
      const user = await prisma.user.create({ data });
      logger.info('User created in database', { userId: user.id });
      return user;
    } catch (error) {
      logger.error('Database error creating user', {
        error: error instanceof Error ? error.message : String(error),
        email: data.email
      });
      throw error;
    }
  }
}
```

### With Request Context

```typescript
// All logs automatically include request ID from middleware
logger.info('Processing order', {
  orderId: 'ORD-123',
  customerId: 'CUST-456'
});

// Result in logs:
// {
//   "timestamp": "2026-02-11 15:30:45",
//   "level": "INFO",
//   "service": "marketplace",
//   "message": "Processing order",
//   "requestId": "550e8400-e29b-41d4-a716-446655440000",
//   "orderId": "ORD-123",
//   "customerId": "CUST-456"
// }
```

---

## 🔒 Security: Sensitive Data Protection

### Automatic Redaction

The following data is **automatically redacted** in logs:
- ✅ Passwords
- ✅ Authentication tokens (JWT, Bearer, etc.)
- ✅ API keys and secrets
- ✅ Database connection strings
- ✅ AWS credentials
- ✅ Credit card numbers

### Example: Passwords Redacted

**Code:**
```typescript
logger.info('User login attempt', {
  email: 'user@example.com',
  password: 'secret123'  // ❌ DON'T do this!
});
```

**Result in logs:**
```json
{
  "message": "User login attempt",
  "email": "user@example.com",
  "password": "***REDACTED***"
}
```

### Best Practices

✅ **DO:**
```typescript
// Log with safe data
logger.info('User authentication', { userId: 'user-123' });

// Log success/failure
logger.info('User login successful', { userId: 'user-123' });
logger.warn('Login attempt with invalid credentials', { email: 'user@example.com' });
```

❌ **DON'T:**
```typescript
// Don't log passwords
logger.info('User login', { password: 'secret123' });

// Don't log tokens directly
logger.info('Token generated', { token: jwt_token_value });

// Don't log API keys
logger.info('API call', { apiKey: 'sk-12345' });
```

---

## 📊 Log Format

### JSON Structure

All logs are output as JSON with the following structure:

```json
{
  "timestamp": "2026-02-11 15:30:45",
  "level": "INFO",
  "service": "marketplace",
  "message": "User created",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "email": "user@example.com"
}
```

### Required Fields

| Field | Purpose | Example |
|-------|---------|---------|
| **timestamp** | When log was created | "2026-02-11 15:30:45" |
| **level** | Log severity | "INFO", "ERROR", "WARN" |
| **service** | Which service | "marketplace", "community" |
| **message** | Main log message | "User created" |
| **requestId** | Unique request ID | "550e8400-e29b-41d4..." |

### Additional Fields

Any metadata you pass to the logger is included:

```typescript
logger.info('Order created', {
  orderId: 'ORD-123',      // Included in log
  amount: 99.99,           // Included in log
  customerId: 'CUST-456'   // Included in log
});

// Result:
// {
//   "timestamp": "...",
//   "level": "INFO",
//   "service": "marketplace",
//   "message": "Order created",
//   "requestId": "...",
//   "orderId": "ORD-123",
//   "amount": 99.99,
//   "customerId": "CUST-456"
// }
```

---

## 🚀 Request ID Propagation

### How It Works

1. **Middleware** generates UUID v4 for each request
2. **Logger** attaches request ID to every log
3. **Response header** includes request ID for client tracking
4. **Cross-service calls** can pass request ID for distributed tracing

### Usage

```typescript
app.get('/api/order/:id', (req: Request, res: Response) => {
  // Request ID automatically available in middleware
  const requestId = req.id;  // UUID v4

  // Logger automatically includes it
  logger.info('Fetching order', { orderId: req.params.id });

  // Response includes request ID header
  // X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
});
```

### For Distributed Tracing

When calling other services, pass the request ID:

```typescript
// In a service that calls another service
const response = await fetch('http://localhost:3002/api/resource', {
  headers: {
    'X-Request-ID': req.id  // Pass request ID to other service
  }
});
```

---

## 📈 Monitoring & Analysis

### Log Files Location

```bash
# Marketplace
services/marketplace/logs/app.log
services/marketplace/logs/error.log

# Community
services/community/logs/app.log
services/community/logs/error.log

# Academy
services/academy/logs/app.log
services/academy/logs/error.log

# Business
services/business/logs/app.log
services/business/logs/error.log
```

### Viewing Logs

```bash
# View recent logs
tail -f services/marketplace/logs/app.log

# View last 100 lines
tail -100 services/marketplace/logs/app.log

# Search for specific message
grep "User created" services/marketplace/logs/app.log

# Parse JSON logs
cat services/marketplace/logs/app.log | jq '.message'
```

### Log Analysis

```bash
# Count logs by level
grep -o '"level":"[^"]*"' services/marketplace/logs/app.log | sort | uniq -c

# Find slow requests (high duration)
grep "duration" services/marketplace/logs/app.log | jq 'select(.duration > 1000)'

# Find errors with specific service
grep '"level":"ERROR"' services/marketplace/logs/app.log | jq '.message'
```

---

## ✅ Validation & Testing

### Run Validation Tests

```bash
# Validate Marketplace service
cd services/marketplace
npx tsx src/lib/validate.ts

# Validate Community service
cd services/community
npx tsx src/lib/validate.ts

# Validate Academy service
cd services/academy
npx tsx src/lib/validate.ts
```

### Expected Output

```
📋 Starting Logger Validation for marketplace Service

✅ 1. Logs Directory Exists
   ✅ Logs directory found at: .../services/marketplace/logs

✅ 2. Log Files Created
   ✅ Log files created: app.log, error.log

✅ 3. Log Format Consistency
   ✅ Log format valid: 26 properly formatted JSON logs

✅ 4. Request ID Present
   ✅ Request IDs found in logs: 25 entries with requestId

✅ 5. Sensitive Data Redaction
   ✅ Sensitive data properly redacted

✅ 6. Log Rotation Configuration
   ✅ Log file size within limits: 0.01MB (max 5MB)

✅ 7. Performance Impact
   ✅ Logging performance acceptable: 0.032ms per log

🎉 ALL VALIDATION TESTS PASSED!
```

---

## 🐛 Troubleshooting

### Logs Not Being Created

**Problem:** Log files not appearing in `services/{SERVICE}/logs/`

**Solution:**
1. Check directory permissions
2. Verify `logs/` directory exists
3. Check `LOG_LEVEL` environment variable
4. Run validation tests: `npx tsx src/lib/validate.ts`

### Request IDs Not Appearing

**Problem:** Logs missing `requestId` field

**Solution:**
1. Verify middleware is attached: Check `app.ts` for `app.use(requestIdMiddleware)`
2. Ensure request goes through middleware (not skipped)
3. Check that logger is accessed via `(req as any).logger`

### Sensitive Data Not Redacted

**Problem:** Passwords or tokens visible in logs

**Solution:**
1. Check that fields match redaction list (see Security section)
2. Run validation: `npx tsx src/lib/validate.ts`
3. Verify `lib/redact.ts` is imported in logger
4. Check log file directly: `cat services/*/logs/app.log | grep password`

### Performance Issues

**Problem:** Logging causing slow API responses

**Solution:**
1. Check log level - DEBUG level logs more data
2. Reduce metadata being logged
3. Verify log rotation is working (files should be <5MB)
4. Run performance test: Check validation report metrics

---

## 📚 Additional Resources

- **Validation Report:** `docs/LOGGING-VALIDATION-REPORT.md`
- **Code Examples:** See above usage examples
- **Winston Documentation:** https://github.com/winstonjs/winston
- **Best Practices:** See LOGGING-GUIDELINES.md

---

## 🎯 Key Takeaways

✅ **Simple to use** - Import logger and call functions
✅ **Automatic** - Request IDs and redaction handled
✅ **Secure** - Sensitive data protected
✅ **Performant** - Minimal overhead (30,000+ logs/sec)
✅ **Consistent** - JSON format across all services
✅ **Reliable** - File rotation and error handling

---

**Questions?** Check docs/LOGGING-GUIDELINES.md for more best practices!
