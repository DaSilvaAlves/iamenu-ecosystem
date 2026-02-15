# Payment Integration Security Review Checklist
## Story 3.6: Implement Payment Integration (Stripe)

**Date:** 2026-02-14
**Status:** Pre-Implementation Review Checklist
**Reviewer:** Security Team
**Priority:** CRITICAL (Revenue-blocking feature)

---

## 🔒 PCI DSS COMPLIANCE

### Level 1: Cardholder Data Security

- [ ] **No Raw Card Data Storage**
  - ✅ Using Stripe-hosted payment form (Payment Element)
  - ✅ Never storing credit card numbers in application
  - ✅ Using Stripe Payment Method IDs for recurring charges
  - Verification: Code review - grep for "cardNumber\|pan\|card_number" in codebase

- [ ] **Payment Data Isolation**
  - [ ] Application database does NOT contain card data
  - [ ] Card data only in Stripe (PCI Level 2 service)
  - [ ] Transaction logs redact sensitive card info
  - Verification: Schema audit - no card-related columns

- [ ] **Encryption in Transit**
  - [ ] All Stripe API calls over HTTPS
  - [ ] TLS 1.2+ enforced
  - [ ] Certificate pinning (optional, enhanced security)
  - Verification: Network traffic inspection

### Level 2: API Key Security

- [ ] **Secret Key Management**
  - [ ] Stripe secret key in environment variables ONLY
  - [ ] Secret key never logged or printed
  - [ ] Secret key not in code repository
  - [ ] Secret key rotated quarterly
  - Verification: `grep -r "sk_live\|sk_test" . --exclude-dir=node_modules`

- [ ] **Publishable Key Usage**
  - [ ] Publishable key used only for client-side operations
  - [ ] Publishable key exposed in frontend code is acceptable
  - [ ] Publishable key cannot charge accounts
  - Verification: Frontend code audit

- [ ] **Webhook Signing Keys**
  - [ ] Webhook signing keys stored securely
  - [ ] Webhook signing keys never exposed in logs
  - [ ] Signing keys rotated after compromise
  - Verification: Configuration audit

---

## 🔐 WEBHOOK SECURITY

### Signature Verification

- [ ] **Webhook Signature Validation**
  - [ ] All webhooks verified with Stripe signature
  - [ ] Signature verification uses webhook signing secret
  - [ ] Invalid signatures rejected with 401/403
  - [ ] Signature validation happens before processing
  - Code location: `services/marketplace/src/webhooks/stripe.webhook.ts`

```javascript
// MUST verify signature before processing
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
```

- [ ] **Timestamp Validation**
  - [ ] Webhook timestamp checked (not > 5 minutes old)
  - [ ] Protection against replay attacks
  - [ ] Configurable time tolerance
  - Verification: Code review - check webhook handler

### Idempotency & Retries

- [ ] **Idempotent Operations**
  - [ ] Payment processing idempotent (safe to retry)
  - [ ] Idempotency keys used for all API calls
  - [ ] Database transactions handle duplicate webhook events
  - [ ] Order creation is idempotent (payment_intent.succeeded retries)

```sql
-- Database must handle duplicate webhooks safely
-- Example: UNIQUE constraint on payment_intent_id
ALTER TABLE "marketplace"."Order"
  ADD CONSTRAINT unique_payment_intent
  UNIQUE ("stripePaymentIntentId");
```

- [ ] **Webhook Retry Handling**
  - [ ] Webhooks processed reliably on retry
  - [ ] Status updates are idempotent
  - [ ] No double-charging on webhook retries
  - Verification: Load testing with webhook simulation

---

## 💳 DATA VALIDATION & SANITIZATION

### Input Validation

- [ ] **Quote/Order Validation**
  - [ ] Quote amount validated before payment
  - [ ] Currency validation (must match config)
  - [ ] Amount sanity check (> 0, < daily limit)
  - [ ] User authorization verified before charging
  - Verification: Unit tests for validation

- [ ] **Stripe API Response Validation**
  - [ ] Payment intent status validated
  - [ ] Amount matches request (fraud check)
  - [ ] Customer ID matches request
  - [ ] Currency matches request
  - Verification: Integration tests

### Error Handling

- [ ] **Sensitive Error Information**
  - [ ] Card errors never exposed to frontend
  - [ ] Stripe error messages sanitized
  - [ ] Generic error messages to users
  - [ ] Detailed errors logged securely (not in response)
  - Code review point: Check error response formatting

```javascript
// BAD - exposes card information
res.status(400).json({ error: error.message }); // Could be "Your card was declined"

// GOOD - generic message
res.status(400).json({ error: "Payment failed. Please try again." });
// Detailed error logged to CloudWatch only
logger.error('Stripe error:', error);
```

---

## 🔄 PAYMENT FLOW SECURITY

### Quote to Payment

- [ ] **Quote Validation**
  - [ ] Quote not expired (timestamp check)
  - [ ] Quote amount not modified after creation
  - [ ] Quote currency matches payment intent
  - [ ] Supplier authorization validated
  - Verification: Data audit

- [ ] **Payment Intent Creation**
  - [ ] Amount in smallest currency unit (cents)
  - [ ] Customer metadata includes user ID
  - [ ] Idempotency key prevents duplicates
  - [ ] Metadata includes order reference
  - Verification: Code review

```javascript
// Create payment intent with safety checks
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(quote.amount * 100), // Convert to cents
  currency: quote.currency.toLowerCase(),
  customer: stripeCustomerId,
  metadata: {
    userId: userId,
    quoteId: quote.id,
    supplierId: supplierId
  },
  idempotency_key: `quote_${quote.id}_${Date.now()}`
});
```

- [ ] **Order Creation**
  - [ ] Order created ONLY after successful payment
  - [ ] Payment intent status = 'succeeded'
  - [ ] Order amount matches payment amount
  - [ ] Order timestamps recorded
  - Verification: Database audit

---

## 📊 LOGGING & MONITORING

### Payment Logging

- [ ] **Secure Logging**
  - [ ] Payment intent ID logged (not card data)
  - [ ] Amount logged
  - [ ] Status logged
  - [ ] Timestamp logged
  - [ ] Card data NEVER logged
  - Verification: Log audit - grep for card patterns

- [ ] **Audit Trail**
  - [ ] All payment state transitions logged
  - [ ] User who initiated payment logged
  - [ ] Timestamp of each action
  - [ ] Immutable audit log (cannot delete old logs)
  - Verification: CloudWatch query

### Monitoring & Alerts

- [ ] **Transaction Monitoring**
  - [ ] Alert on unusual payment patterns
  - [ ] Alert on failed payment spikes
  - [ ] Alert on refund requests
  - [ ] Daily payment summary report
  - Setup: CloudWatch alarms

- [ ] **Error Monitoring**
  - [ ] Alert on webhook failures
  - [ ] Alert on Stripe API errors
  - [ ] Alert on payment reconciliation failures
  - [ ] Alert on rate limiting
  - Setup: CloudWatch alarms + Slack integration

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests

- [ ] **Payment Intent Creation**
  - [ ] Valid payment creates intent
  - [ ] Invalid amount rejected
  - [ ] Missing user ID rejected
  - [ ] Duplicate payment detected
  - Coverage: 100% of payment creation logic

- [ ] **Webhook Processing**
  - [ ] Valid signature accepted
  - [ ] Invalid signature rejected
  - [ ] Expired webhook rejected
  - [ ] Duplicate webhook handled
  - Coverage: 100% of webhook logic

- [ ] **Error Handling**
  - [ ] Stripe API errors handled
  - [ ] Network timeouts handled
  - [ ] Invalid responses handled
  - [ ] Partial failure scenarios
  - Coverage: All error paths

### Integration Tests

- [ ] **End-to-End Payment Flow**
  - [ ] Quote → Payment Intent → Order (full flow)
  - [ ] Payment success notification
  - [ ] Order creation verification
  - [ ] Invoice generation
  - [ ] Email notification sent
  - Test against: Stripe test environment

- [ ] **Webhook Security**
  - [ ] Webhook signature validation works
  - [ ] Duplicate webhooks handled safely
  - [ ] Out-of-order webhooks handled
  - [ ] Missing webhooks trigger reconciliation
  - Test: Using Stripe test webhook events

- [ ] **Refund Flow**
  - [ ] Full refund processes
  - [ ] Partial refund processes
  - [ ] Refund webhook triggers order update
  - [ ] Refund reconciliation works
  - Test: Stripe refund test events

### Security Tests

- [ ] **Injection Testing**
  - [ ] SQL injection attempts blocked
  - [ ] No unvalidated user input in Stripe API calls
  - [ ] Metadata fields sanitized
  - Verification: OWASP A03:2021 testing

- [ ] **Authentication Testing**
  - [ ] Unauthenticated users cannot pay
  - [ ] Users cannot pay with other user's quote
  - [ ] Supplier cannot receive payment outside their account
  - Verification: Integration tests with multiple users

- [ ] **Data Exposure Testing**
  - [ ] Card data not in logs
  - [ ] Card data not in error messages
  - [ ] Card data not in metrics/traces
  - [ ] Payment intent ID safe to log
  - Verification: Log file inspection

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Security Architect Sign-Off

- [ ] Code review completed by security team
- [ ] All CRITICAL issues resolved
- [ ] All HIGH issues have mitigation
- [ ] Webhook implementation verified
- [ ] Error handling reviewed
- [ ] Logging reviewed (no sensitive data)
- [ ] Database schema reviewed (no card data)

### Compliance Verification

- [ ] PCI DSS Level 1 requirements met
- [ ] No raw card data in system
- [ ] All secrets in environment variables
- [ ] Encryption in transit verified
- [ ] Audit logging enabled
- [ ] Incident response plan prepared

### Testing Verification

- [ ] Unit tests passing (100% coverage)
- [ ] Integration tests passing
- [ ] Security tests passing
- [ ] End-to-end flow tested in Stripe sandbox
- [ ] Webhook processing tested
- [ ] Error scenarios tested

### Operational Readiness

- [ ] Monitoring/alerting configured
- [ ] Runbook for payment issues created
- [ ] Escalation procedures defined
- [ ] Incident response plan documented
- [ ] Team trained on payment handling
- [ ] Refund procedures documented

---

## 🚨 CRITICAL BLOCKERS (Must Pass Before Merge)

```
❌ No merge without:
  - Security architect sign-off
  - Zero CRITICAL vulnerabilities
  - All PCI requirements met
  - Complete test coverage
  - Webhook signature validation working
  - No card data in logs/errors
```

---

## ✅ SIGN-OFF

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Architect | __________ | ______ | __________ |
| QA Lead | __________ | ______ | __________ |
| DevOps Lead | __________ | ______ | __________ |

---

**Document Version:** 1.0
**Last Updated:** 2026-02-14
**Next Review:** After Story 3.6 implementation
