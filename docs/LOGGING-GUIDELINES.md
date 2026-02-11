# Logging Guidelines for Developers
## iaMenu Ecosystem Backend Services

**Purpose:** Best practices for using the centralized logging system
**Audience:** All backend developers
**Last Updated:** 2026-02-11

---

## 🎯 Core Principles

1. **Log for humans** - Write messages that are clear and actionable
2. **Include context** - Add relevant metadata to help debugging
3. **Use appropriate levels** - Match severity to log level
4. **Protect sensitive data** - Never log passwords, tokens, API keys
5. **Keep performance in mind** - Don't log in tight loops
6. **Be consistent** - Follow patterns established in the codebase

---

## 📋 Logging Levels

Choose the right level for each log:

### ERROR 🔴
**Use for:** Critical failures that need immediate attention

```typescript
// ✅ GOOD
logger.error('Database connection failed', {
  error: error.message,
  host: 'db.example.com',
  port: 5432
});

// ✅ GOOD
logger.error('Payment processing failed', {
  orderId: 'ORD-123',
  error: 'Card declined',
  attemptNumber: 3
});
```

**When to use:**
- Unrecoverable errors
- Critical failures
- Data loss risks
- Security violations

---

### WARN 🟡
**Use for:** Problems that need attention but don't prevent operation

```typescript
// ✅ GOOD
logger.warn('High memory usage detected', {
  percentageUsed: 85,
  thresholdPercent: 80
});

// ✅ GOOD
logger.warn('Slow API response', {
  endpoint: '/api/orders',
  durationMs: 5000,
  thresholdMs: 1000
});
```

**When to use:**
- Degraded performance
- Recoverable errors
- Unusual conditions
- Resource warnings

---

### INFO 🟢
**Use for:** Important business events and state changes

```typescript
// ✅ GOOD
logger.info('User registered', {
  userId: 'user-123',
  email: 'user@example.com'
});

// ✅ GOOD
logger.info('Order status changed', {
  orderId: 'ORD-456',
  oldStatus: 'pending',
  newStatus: 'shipped'
});

// ✅ GOOD
logger.info('Incoming request', {
  method: 'POST',
  path: '/api/orders',
  userId: 'user-789'
});
```

**When to use:**
- User actions (login, register, purchase)
- State changes (status updates, transitions)
- Important business events
- Request/response tracking

---

### DEBUG 🔵
**Use for:** Detailed information for debugging

```typescript
// ✅ GOOD
logger.debug('Processing payment', {
  orderId: 'ORD-123',
  amount: 99.99,
  currency: 'USD'
});

// ✅ GOOD
logger.debug('Validating user input', {
  email: 'user@example.com',
  passwordLength: 12
});
```

**When to use:**
- Development and testing
- Detailed flow information
- Variable values and state
- Function entry/exit points

**Note:** DEBUG logs are disabled in production by default.

---

## ✅ Do's and Don'ts

### ✅ DO: Log Meaningful Context

```typescript
// ✅ GOOD - Clear context
logger.info('Order created', {
  orderId: 'ORD-123',
  customerId: 'CUST-456',
  amount: 99.99,
  itemCount: 3
});

// ❌ BAD - Not enough context
logger.info('Order created');
```

### ✅ DO: Use Consistent Field Names

```typescript
// ✅ GOOD - Consistent naming
logger.info('User action', {
  userId: 'user-123',
  email: 'user@example.com',
  action: 'login'
});

// ❌ BAD - Inconsistent naming
logger.info('User action', {
  id: 'user-123',
  userEmail: 'user@example.com',
  operation: 'login'
});
```

### ✅ DO: Log Errors with Details

```typescript
// ✅ GOOD - Full error context
logger.error('Database query failed', {
  error: error.message,
  stack: error.stack,
  query: 'SELECT * FROM users',
  timeout: 30000
});

// ❌ BAD - No error details
logger.error('Database query failed');
```

### ✅ DO: Include Request ID in Service Calls

```typescript
// ✅ GOOD - Request ID included
logger.info('Calling payment service', {
  requestId: req.id,
  orderId: 'ORD-123'
});

// ❌ BAD - No request context
logger.info('Calling payment service', {
  orderId: 'ORD-123'
});
```

### ❌ DON'T: Log Sensitive Data

```typescript
// ❌ BAD - Logging password
logger.info('User login', {
  email: 'user@example.com',
  password: 'secret123'
});

// ❌ BAD - Logging token
logger.info('Token generated', {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
});

// ❌ BAD - Logging API key
logger.info('API call', {
  apiKey: 'sk-1234567890abcdef'
});
```

**Note:** Even though redaction is automatic, don't rely on it - avoid logging sensitive data entirely.

### ❌ DON'T: Log in Tight Loops

```typescript
// ❌ BAD - Logging in loop
for (let i = 0; i < 10000; i++) {
  logger.debug(`Processing item ${i}`);
}

// ✅ GOOD - Log once per batch
logger.info('Processing batch', {
  itemCount: 10000,
  startTime: new Date(),
  batchId: 'BATCH-123'
});
```

### ❌ DON'T: Log Large Objects Unfiltered

```typescript
// ❌ BAD - Logging entire user object
logger.info('User created', req.body);

// ✅ GOOD - Log specific fields
logger.info('User created', {
  userId: user.id,
  email: user.email,
  role: user.role
});
```

### ❌ DON'T: Use String Concatenation

```typescript
// ❌ BAD - Hard to parse
logger.info('User ' + userId + ' logged in from ' + ipAddress);

// ✅ GOOD - Structured data
logger.info('User logged in', {
  userId: userId,
  ipAddress: ipAddress
});
```

---

## 🏗️ Common Patterns

### API Endpoint Pattern

```typescript
export const createOrder = async (req: Request, res: Response) => {
  const requestLogger = (req as any).logger;

  try {
    // Log input
    requestLogger.info('Creating order', {
      customerId: req.body.customerId,
      itemCount: req.body.items.length
    });

    // Validate
    if (!req.body.customerId) {
      requestLogger.warn('Order creation rejected', {
        reason: 'Missing customerId'
      });
      return res.status(400).json({ error: 'customerId required' });
    }

    // Process
    const order = await orderService.create(req.body);

    // Log success
    requestLogger.info('Order created successfully', {
      orderId: order.id,
      amount: order.total
    });

    res.json(order);
  } catch (error) {
    // Log error
    requestLogger.error('Failed to create order', {
      error: error instanceof Error ? error.message : String(error),
      customerId: req.body.customerId
    });

    res.status(500).json({ error: 'Failed to create order' });
  }
};
```

### Service Method Pattern

```typescript
export class OrderService {
  async processPayment(orderId: string, amount: number) {
    logger.info('Processing payment', {
      orderId,
      amount
    });

    try {
      const payment = await this.paymentGateway.charge(amount);

      logger.info('Payment processed successfully', {
        orderId,
        paymentId: payment.id,
        amount
      });

      return payment;
    } catch (error) {
      logger.error('Payment processing failed', {
        orderId,
        amount,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
```

### Middleware Pattern

```typescript
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestLogger = (req as any).logger;

  try {
    requestLogger.debug('Authenticating request', {
      path: req.path,
      method: req.method
    });

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      requestLogger.warn('Missing authentication token', {
        path: req.path
      });
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;

    requestLogger.debug('User authenticated', {
      userId: decoded.userId
    });

    next();
  } catch (error) {
    requestLogger.error('Authentication failed', {
      error: error instanceof Error ? error.message : String(error)
    });
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

---

## 📊 Field Naming Convention

Use consistent field names across all logs:

```typescript
// User-related
userId: string
email: string
role: string

// Order-related
orderId: string
amount: number
currency: string
status: string

// Request-related
path: string
method: string
statusCode: number
durationMs: number

// Error-related
error: string           // Error message
stack?: string          // Stack trace
errorCode?: string      // Error code

// Pagination
page: number
limit: number
total: number

// Filtering
filters: object
sortBy: string
sortDirection: 'asc' | 'desc'
```

---

## 🔍 Example: Complete Flow

```typescript
// 1. Controller receives request
export const getOrders = async (req: Request, res: Response) => {
  const requestLogger = (req as any).logger;

  try {
    requestLogger.info('Fetching orders', {
      userId: req.user?.userId,
      page: req.query.page,
      limit: req.query.limit
    });

    // 2. Service processes request
    const orders = await orderService.getOrders(
      req.user?.userId,
      {
        page: parseInt(req.query.page as string),
        limit: parseInt(req.query.limit as string)
      }
    );

    // 3. Controller returns response
    requestLogger.info('Orders fetched successfully', {
      userId: req.user?.userId,
      orderCount: orders.length
    });

    res.json(orders);
  } catch (error) {
    requestLogger.error('Failed to fetch orders', {
      userId: req.user?.userId,
      error: error instanceof Error ? error.message : String(error)
    });

    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Service method
async getOrders(userId: string, options: PaginationOptions) {
  logger.debug('Fetching orders from database', {
    userId,
    page: options.page,
    limit: options.limit
  });

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      orderBy: { createdAt: 'desc' }
    });

    logger.debug('Orders fetched from database', {
      userId,
      count: orders.length
    });

    return orders;
  } catch (error) {
    logger.error('Database error fetching orders', {
      userId,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
```

---

## 🎓 Learning Resources

### Key Concepts
1. **Structured Logging** - JSON format for machine parsing
2. **Request ID Propagation** - Track requests across services
3. **Log Levels** - Appropriate severity for events
4. **Sensitive Data** - Never log credentials or secrets
5. **Performance** - Keep logging overhead minimal

### Best Practices
- ✅ Log business events (user actions, state changes)
- ✅ Include context (IDs, amounts, status values)
- ✅ Use appropriate levels (ERROR/WARN/INFO/DEBUG)
- ✅ Protect sensitive data (passwords, tokens, keys)
- ✅ Keep messages clear and actionable

### Anti-Patterns
- ❌ Logging in tight loops
- ❌ Large unfiltered objects
- ❌ String concatenation for context
- ❌ Generic error messages
- ❌ Logging sensitive data

---

## ❓ Quick Reference

| Scenario | Level | Example |
|----------|-------|---------|
| User login | INFO | `logger.info('User login', {userId})` |
| Login failed | WARN | `logger.warn('Login failed', {email, reason})` |
| Database error | ERROR | `logger.error('Query failed', {query, error})` |
| Processing item | DEBUG | `logger.debug('Processing', {itemId, status})` |
| API response time | INFO | `logger.info('Request completed', {path, durationMs})` |

---

## 📞 Need Help?

- Check **LOGGING-SETUP.md** for configuration details
- Review **LOGGING-VALIDATION-REPORT.md** for performance metrics
- Ask in #backend-logging Slack channel
- Check recent code examples in the codebase

---

**Happy logging!** 🚀
