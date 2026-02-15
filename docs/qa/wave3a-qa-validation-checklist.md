# QA Validation Checklist - Wave 3.A
## Stories 3.1 (Redis), 3.3 (Rate Limiting), 3.4 (Notifications), 3.6 (Payments)

**Date:** 2026-02-14
**Status:** Ready for QA Team
**Expected Test Duration:** 8-10 hours total
**Target Coverage:** > 85% for all stories

---

## 📋 STORY 3.1: Implement Redis Caching Layer

### Acceptance Criteria Verification

- [ ] **Redis deployed and configured**
  - Redis instance running and accessible
  - Connection pool configured
  - Memory limits set (min 256MB)
  - Test: `redis-cli PING` returns PONG

- [ ] **Cache layer abstracted (pluggable strategy)**
  - CacheStrategy interface defined
  - RedisStrategy implemented
  - InMemoryStrategy fallback available
  - NoCache strategy for testing
  - Test: Can switch strategies without code changes

- [ ] **Posts/Profiles cached with 5-minute TTL**
  - Cache hit on repeated requests
  - Cache invalidated on updates
  - TTL verified: `redis-cli TTL <key>` shows ~300 seconds
  - Test: `npm run test:cache -- --testNamePattern="post"`

- [ ] **Products cached with 10-minute TTL**
  - Marketplace product cache working
  - TTL verified: `redis-cli TTL <key>` shows ~600 seconds
  - Test: `npm run test:cache -- --testNamePattern="product"`

- [ ] **Cache hit rate > 60%**
  - Metrics: Hits / (Hits + Misses) > 0.60
  - Verify with: `redis-cli INFO stats | grep hits`
  - Load test 100 concurrent users, measure cache ratio
  - Test: `npm run test:cache-performance`

- [ ] **Cache invalidation on create/update/delete**
  - [ ] Create post → cache cleared
  - [ ] Update post → cache cleared
  - [ ] Delete post → cache cleared
  - [ ] Like post → post cache invalidated
  - Test: `npm run test:cache-invalidation`

- [ ] **No stale data returned**
  - Cache expiry working
  - Data updated in DB = cache cleared
  - No race conditions
  - Test: Update data, verify fresh data on next request

- [ ] **Cache performance benchmarked**
  - With cache response time: [baseline]ms
  - Without cache response time: [baseline]ms
  - Improvement: > 50%
  - Test: `npm run test:cache-benchmark`

- [ ] **Monitoring/metrics for cache health**
  - Cache hit rate tracked
  - Cache miss rate tracked
  - Memory usage monitored
  - Eviction rate monitored

### Redis Infrastructure Testing

- [ ] **Redis Availability**
  - Graceful fallback if Redis down
  - App continues operating (without cache)
  - Alert triggered if Redis unavailable
  - Test: Stop Redis, verify app still works

- [ ] **Memory Management**
  - Maxmemory policy set to allkeys-lru
  - Old keys evicted when full
  - No out-of-memory errors
  - Test: Fill cache, verify eviction works

- [ ] **Connection Pooling**
  - Min/max connections configured
  - Connections recycled properly
  - No connection leaks
  - Test: Monitor active connections

- [ ] **Data Persistence** (optional)
  - Snapshot configured (if needed)
  - Recovery after restart works
  - No data loss scenarios

### Code Quality

- [ ] **CodeRabbit Review Passed**
  - Zero CRITICAL issues
  - All HIGH issues resolved
  - Cache strategy pattern correct

- [ ] **All Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - Coverage > 85%

### Performance Testing

- [ ] **Load Test: 100 Concurrent Users**
  - P95 response time < 200ms (with cache)
  - Cache hit rate > 60%
  - Error rate < 0.1%

- [ ] **Stress Test: Peak Load**
  - System stable with 200+ concurrent users
  - Memory usage stable
  - No connection pool exhaustion

### Sign-Off

- [ ] QA Lead approval
- [ ] Performance validated
- [ ] Ready for merge to main

---

## 📋 STORY 3.3: Implement API Rate Limiting

### Acceptance Criteria Verification

- [ ] **Rate limit middleware implemented**
  - Middleware applies to all endpoints
  - Configuration per route possible
  - Headers added to response (X-RateLimit-*)
  - Test: `npm run test:rate-limit`

- [ ] **Per-user limits enforced (100 req/min)**
  - Authenticated users tracked by user ID
  - Limit enforced: 100 requests per 60 seconds
  - Test: Send 101 requests, 101st returns 429

- [ ] **Per-IP limits enforced (10 req/min)**
  - Unauthenticated users tracked by IP
  - Limit enforced: 10 requests per 60 seconds
  - IP extraction handles proxies (X-Forwarded-For)
  - Test: Send 11 requests from same IP, 11th returns 429

- [ ] **Configurable limits per endpoint**
  - Some endpoints have higher/lower limits
  - Configuration in .env or config file
  - Reloadable without restart
  - Test: Verify different limits on different endpoints

- [ ] **429 (Too Many Requests) responses**
  - Status code: 429
  - Response body includes message
  - Standard error format
  - Test: Verify HTTP status code

- [ ] **Retry-After headers included**
  - Header present: `Retry-After: 45`
  - Value indicates seconds until retry
  - Test: Check response headers after 429

- [ ] **Rate limit status in response headers**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 42`
  - `X-RateLimit-Reset: 1645045234`
  - Helps clients track quota

- [ ] **Whitelist for critical operations**
  - Payment endpoints not rate limited
  - Admin endpoints not rate limited
  - Test: Verify whitelist working

- [ ] **Graceful degradation**
  - Cached responses returned if rate limited
  - Better UX than immediate 429
  - Test: Rate limit with cached data available

- [ ] **Monitoring/alerting**
  - Rate limit violations tracked
  - Alert if attack-like pattern
  - Metrics: requests_rate_limited counter

### Security Testing

- [ ] **DDoS Mitigation**
  - Single IP cannot flood API
  - Distributed attacks mitigated (per-user limit)
  - Test: Simulate DDoS from single IP

- [ ] **Bypass Prevention**
  - IP spoofing not possible
  - User ID can't be forged
  - Session hijacking won't bypass limit
  - Test: Attempt various bypass techniques

### Edge Cases

- [ ] **Reset Timing**
  - Limits reset exactly at window boundary
  - No off-by-one errors
  - Test: Request at exact reset time

- [ ] **Concurrent Requests**
  - Multiple simultaneous requests counted correctly
  - Race condition safe
  - Test: Send 10 concurrent requests

- [ ] **Multiple Auth Methods**
  - Works with JWT tokens
  - Works with session cookies
  - Consistent behavior

### Code Quality

- [ ] **All Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - Coverage > 85%

### Sign-Off

- [ ] QA Lead approval
- [ ] Security validated
- [ ] Ready for merge to main

---

## 📋 STORY 3.4: Implement User Notifications System

### Acceptance Criteria Verification

- [ ] **Real-time notifications via Socket.io**
  - Socket.io connection established
  - Notifications delivered in real-time (< 100ms)
  - Client receives notification immediately
  - Test: `npm run test:notifications -- --testNamePattern="socket"`

- [ ] **Email notifications sent asynchronously**
  - Email queued immediately (no wait)
  - Email sent within 5 minutes
  - Email delivered to correct address
  - Test: Trigger notification, verify email in inbox

- [ ] **In-app notification center**
  - Unread count visible
  - Notifications list paginated
  - Clear button removes notification
  - Test: `npm run test:notifications -- --testNamePattern="center"`

- [ ] **Notification preferences per user**
  - Users can disable email notifications
  - Users can disable in-app notifications
  - Users can disable by type (likes, follows, etc)
  - Test: Set preferences, verify notifications blocked

- [ ] **Unsubscribe links in emails**
  - Every email has unsubscribe link
  - Link works (disables notifications)
  - GDPR compliant
  - Test: Click unsubscribe, verify stopped

- [ ] **Notification history (last 30 days)**
  - History stored and retrievable
  - Pagination working
  - Older than 30 days deleted
  - Test: `npm run test:notifications -- --testNamePattern="history"`

- [ ] **Mark as read/unread functionality**
  - API endpoints working
  - UI shows read status
  - Unread count updates
  - Test: Mark notification, verify status changes

- [ ] **Batch notifications (digest emails)**
  - Digest emails sent (e.g., daily summary)
  - Contains list of notifications
  - Frequency configurable
  - Test: Check digest email content

- [ ] **No duplicate notifications**
  - Same event doesn't trigger duplicate
  - Idempotency working
  - Test: Trigger same event multiple times

- [ ] **Notification delivery rate > 99%**
  - Failed notifications retried
  - Retry logic working
  - Metrics tracked
  - Test: Measure delivery success rate

- [ ] **Frequency capping (max 3/hour)**
  - User receives max 3 notifications per hour
  - Excess notifications queued
  - Test: Trigger 5 notifications, verify only 3 sent

- [ ] **RLS enforced**
  - Users only see their notifications
  - Cannot access other user's notifications
  - Test: `npm run test:rls -- --testNamePattern="notification"`

### Notification Types Testing

- [ ] **Post Liked Notification**
  - User A likes User B's post
  - User B receives notification
  - Content includes: who liked, which post
  - Test: Like post, check notification

- [ ] **Comment Notification**
  - User A comments on User B's post
  - User B receives notification
  - Content includes: commenter, comment preview
  - Test: Add comment, check notification

- [ ] **Follow Notification**
  - User A follows User B
  - User B receives notification
  - Content includes: follower name
  - Test: Follow user, check notification

- [ ] **Order Status Notification**
  - Buyer receives order updates
  - Supplier receives new order
  - Notifications include order details

### Email Testing

- [ ] **Email Delivery**
  - Emails sent from correct sender
  - Subject line correct
  - HTML formatting correct
  - Test: Inspect email headers

- [ ] **Email Content**
  - Links work (not broken)
  - Images load (if included)
  - Text is readable
  - Call-to-action clear

- [ ] **Email Compliance**
  - Unsubscribe link present
  - Sender information clear
  - Privacy policy link present

### Load Testing

- [ ] **Socket.io Scalability**
  - 1000 concurrent connections stable
  - Message delivery < 100ms latency
  - No dropped messages
  - Test: `npm run test:socket-scale --users 1000`

- [ ] **Email Queue Performance**
  - 1000 emails queued without delay
  - Processing rate > 100 emails/minute
  - Test: Queue 1000 emails, measure throughput

### Code Quality

- [ ] **All Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - Coverage > 85%

### Sign-Off

- [ ] QA Lead approval
- [ ] Delivery rates verified
- [ ] Ready for merge to main

---

## 📋 STORY 3.6: Implement Payment Integration

### ⚠️ CRITICAL: Security Review Required

- [ ] **Security architect sign-off MANDATORY**
  - Code reviewed by security team
  - PCI compliance verified
  - All CRITICAL vulnerabilities resolved

### Acceptance Criteria Verification

- [ ] **Stripe account configured**
  - API keys configured (test mode)
  - Webhook endpoint registered
  - Test data created for testing
  - Test: `npm run test:stripe-connection`

- [ ] **Payment processor SDK integrated**
  - Stripe SDK imported and initialized
  - Error handling in place
  - Retry logic configured
  - Test: Create test payment intent

- [ ] **Credit card payments working end-to-end**
  - Payment form loads
  - Valid card accepted
  - Invalid card rejected
  - Test: Complete payment flow with test card

- [ ] **Multiple payment methods supported**
  - Cards supported
  - Digital wallets if applicable
  - Test: Various payment methods

- [ ] **Webhook handlers for payment events**
  - payment_intent.succeeded handled
  - payment_intent.payment_failed handled
  - customer.subscription.updated handled
  - Test: Send webhook test events

- [ ] **Idempotency for webhook retries**
  - Same webhook event processed once
  - Duplicate detection working
  - Test: Replay webhook, verify no double charge

- [ ] **Invoice generation (PDF)**
  - Invoice generated after payment
  - PDF contains all required info
  - Download link works
  - Test: Generate invoice, verify PDF

- [ ] **Refund processing implemented**
  - Full refunds work
  - Partial refunds work
  - Refund creates credit memo
  - Test: Process refund, verify status

- [ ] **PCI compliance checklist passed**
  - No card data stored
  - Encryption in transit (HTTPS)
  - All checklist items verified
  - Test: Security audit passed

- [ ] **Transaction logs complete and audit-ready**
  - All transactions logged
  - Sensitive data redacted
  - Logs immutable
  - Test: Audit log review

- [ ] **Payment reconciliation automated**
  - Daily reconciliation runs
  - Discrepancies identified
  - Alerts on reconciliation failures
  - Test: Reconciliation verification

- [ ] **Error scenarios handled gracefully**
  - Network timeout: user informed
  - Card declined: helpful message
  - API rate limit: retry logic
  - Test: Simulate error scenarios

- [ ] **Circuit breaker for Stripe API failures**
  - If Stripe API down, graceful degradation
  - Users informed (not allowed to pay)
  - Email alert sent to ops team
  - Test: Disable Stripe API, verify behavior

- [ ] **No payment data stored in application**
  - Card numbers not stored
  - CVV not stored
  - Only Stripe Payment Method IDs stored
  - Test: Database audit for card data

### Payment Flow Testing

- [ ] **Complete Payment Flow**
  1. Supplier creates quote
  2. Buyer approves quote
  3. Payment initiated
  4. Stripe processes payment
  5. Webhook received
  6. Order created
  7. Invoice generated
  8. Notification sent
  - Test: `npm run test:payment-flow`

- [ ] **Failed Payment Handling**
  1. Payment declined
  2. User informed with helpful message
  3. Quote remains valid
  4. Can retry payment
  - Test: Use declined test card

- [ ] **Refund Flow**
  1. User requests refund
  2. Refund processed via Stripe
  3. Webhook received
  4. Order status updated
  5. User notified
  - Test: Process refund in test mode

### Security Testing

- [ ] **PCI DSS Level 1 Requirements**
  - See: `payment-security-review-checklist.md`
  - All items in checklist verified
  - Security architect sign-off obtained

- [ ] **Webhook Signature Validation**
  - Invalid signatures rejected
  - Replayed webhooks detected
  - Test: Send invalid webhook

- [ ] **Error Messages Safe**
  - No card info in errors
  - No sensitive details exposed
  - Generic user-friendly messages
  - Test: Check error responses

- [ ] **Amount Validation**
  - Amount matches quote
  - Amount in correct currency
  - Fraud detection working
  - Test: Attempt amount mismatch

### Load Testing

- [ ] **Payment Processing Under Load**
  - 10 concurrent payments processed
  - All succeed without errors
  - Response time < 2s
  - Test: `npm run test:payment-load`

### Code Quality

- [ ] **All Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - Security tests: 100% pass
  - Coverage > 85%

### ⚠️ MANDATORY APPROVALS

- [ ] **Security Architect**: _________________ Date: _______
- [ ] **QA Lead**: _________________ Date: _______
- [ ] **Compliance Officer**: _________________ Date: _______

---

## 🎯 WAVE 3.A FINAL VALIDATION

### All Stories Combined

- [ ] No regressions in Wave 2 or 3.A
- [ ] Cache hit rates > 60% verified
- [ ] Rate limiting working without false positives
- [ ] Notifications delivering reliably
- [ ] Payments processing securely
- [ ] All coverage targets met (85%+)
- [ ] Security reviews completed

### Sign-Off Required From

- [ ] QA Lead (testing verification)
- [ ] Security Architect (payment/security)
- [ ] Performance Engineer (cache, rate limit)
- [ ] Engineering Manager (final approval)

---

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Next Review:** After Wave 3.A implementation
