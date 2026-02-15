# QA Validation Checklist - Wave 2
## Stories 2.2 (API Performance), 2.3 (Test Coverage), 2.4 (Error Handling)

**Date:** 2026-02-14
**Status:** Ready for QA Team
**Expected Test Duration:** 4-6 hours per story
**Target Coverage:** > 85% for all stories

---

## 📋 STORY 2.2: Fix API Response Performance

### Acceptance Criteria Verification

- [ ] **All N+1 queries identified and fixed**
  - Query audit report generated
  - Before/after query plans documented
  - Expected queries reduced by 60%+
  - Test: `npm run test:community -- --testNamePattern="n-plus-one"`

- [ ] **Database indexes added on all foreign keys**
  - All FK relationships indexed
  - Index creation completed successfully
  - Verify with: `SELECT * FROM pg_indexes WHERE indexname LIKE '%_id%'`
  - Test: `npm run test:community -- --testNamePattern="index"`

- [ ] **Indexes on commonly filtered columns**
  - created_at, status, deleted_at indexed
  - Composite indexes for complex queries
  - Test: Performance improvement > 40%

- [ ] **Query performance benchmarked**
  - Response time reduction documented
  - Before metrics: [baseline]
  - After metrics: [current]
  - Target: API response < 300ms (P95)

- [ ] **Slow query log analyzed and resolved**
  - Queries > 1s identified
  - Optimization applied
  - Slow query log should be empty

- [ ] **Pagination implemented**
  - Default 20 items/page
  - Max 100 items/page enforced
  - Test: `npm run test:marketplace -- --testNamePattern="pagination"`

- [ ] **No full table scans on large tables**
  - Verify with EXPLAIN ANALYZE
  - All large table queries use indexes
  - Test: Performance under load (100 concurrent users)

### Performance Testing

- [ ] **Load Test: 100 Concurrent Users**
  ```bash
  npm run test:load -- --users 100 --duration 5m
  ```
  Target metrics:
  - ✅ P50 response time < 100ms
  - ✅ P95 response time < 300ms
  - ✅ P99 response time < 1000ms
  - ✅ Error rate < 0.1%

- [ ] **Stress Test: Gradual Load Increase**
  ```bash
  npm run test:stress -- --rampUp 5m --peak 500users
  ```
  Target: System stable until 300+ users

- [ ] **Endurance Test: 30 minute sustained load**
  ```bash
  npm run test:endurance -- --users 100 --duration 30m
  ```
  Target: No memory leaks, consistent response times

### Code Quality

- [ ] **CodeRabbit Review Passed**
  - Zero CRITICAL issues
  - All HIGH issues resolved or mitigated
  - SQL efficiency validated
  - Test: `npm run coderabbit -- --base main`

- [ ] **All Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - Coverage > 85%
  - Test: `npm run test:community`

- [ ] **Linting & Type Checking**
  - Zero ESLint errors
  - Zero TypeScript errors
  - Test: `npm run lint && npm run typecheck`

### Business Validation

- [ ] **Critical User Journeys Tested**
  - [ ] Create post (API calls traced)
  - [ ] Browse feed (pagination verified)
  - [ ] Search posts (performance < 200ms)
  - [ ] Follow user (cache hit verified)

- [ ] **Performance Verified in Staging**
  - Staging environment mirrors production
  - Real data volume tested (> 1M posts)
  - Performance targets met
  - No regressions from previous version

### Sign-Off

- [ ] QA Lead approval
- [ ] Performance metrics documented
- [ ] Ready for merge to main

---

## 📋 STORY 2.3: Add Missing Test Coverage

### Acceptance Criteria Verification

- [ ] **Test coverage increased to 85%+**
  - Coverage report: [coverage_percent]%
  - Test: `npm run test:community -- --coverage`
  - Critical paths at 100% coverage

- [ ] **Unit Tests for Services**
  - [ ] PostService: Create, update, delete, publish
  - [ ] CommentService: Create, update, delete, moderate
  - [ ] FollowerService: Follow, unfollow, list
  - [ ] ReactionService: React, remove reaction
  - All edge cases covered
  - Test: `npm run test:unit -- --testPathPattern="service"`

- [ ] **Integration Tests for API Endpoints**
  - [ ] POST /posts (create, validation, auth)
  - [ ] GET /posts (pagination, filtering)
  - [ ] GET /posts/:id (authorization checks)
  - [ ] PUT /posts/:id (ownership verification)
  - [ ] DELETE /posts/:id (soft delete)
  - [ ] POST /comments
  - [ ] POST /follow
  - [ ] POST /reactions
  - All endpoints tested with valid/invalid inputs
  - Test: `npm run test:integration -- --testPathPattern="routes"`

- [ ] **E2E Tests for Critical User Flows**
  - [ ] Create post → Get feed → Like post
  - [ ] Follow user → See their posts
  - [ ] Comment on post → Receive notification
  - [ ] Search posts → Filter results
  - Test: `npm run test:e2e`

- [ ] **RLS Policy Tests**
  - [ ] User cannot see posts they shouldn't access
  - [ ] User can only modify their own posts
  - [ ] Soft deleted posts not visible to regular users
  - [ ] Admin can see all posts
  - Test: `npm run test:integration -- --testNamePattern="rls|policy"`

### Error Scenario Testing

- [ ] **Input Validation**
  - [ ] Empty title rejected
  - [ ] Title > 500 chars rejected
  - [ ] Missing required fields rejected
  - [ ] Invalid user ID rejected
  - Test: All return 400 Bad Request

- [ ] **Authorization Errors**
  - [ ] Unauthenticated users get 401
  - [ ] Non-owners get 403 on edit
  - [ ] Non-admins cannot moderate
  - Test: All return proper HTTP status

- [ ] **Edge Cases**
  - [ ] Concurrent post creates (race condition safe)
  - [ ] Create post with max content length
  - [ ] Follow/unfollow rapid succession
  - [ ] Like same post multiple times

### Code Quality

- [ ] **Test Code Quality**
  - Zero code smells in tests
  - No hardcoded test data (use factories)
  - Tests are isolated (no side effects)
  - Test: `npm run lint:tests`

- [ ] **Test Organization**
  - Tests grouped logically by feature
  - Clear test names (describe what's being tested)
  - Setup/teardown is clean
  - Test: `npm run test:community -- --listTests`

### Continuous Integration

- [ ] **CI Pipeline Passes**
  - All tests pass on CI
  - Coverage reports generated
  - No flaky tests
  - Test: Check GitHub Actions/CI logs

- [ ] **Performance Impact**
  - Test suite runs in < 5 minutes
  - No significant test slowdown
  - Parallel execution works

### Sign-Off

- [ ] QA Lead approval
- [ ] Coverage report documented
- [ ] Ready for merge to main

---

## 📋 STORY 2.4: Update Error Handling

### Acceptance Criteria Verification

- [ ] **Consistent Error Response Format**
  - All errors follow same structure
  - Expected format:
    ```json
    {
      "error": "error_code",
      "message": "User-friendly error message",
      "details": { "field": "description" }
    }
    ```
  - Test: `npm run test:integration -- --testNamePattern="error"`

- [ ] **Proper HTTP Status Codes**
  - 400: Bad request (validation errors)
  - 401: Unauthorized (auth required)
  - 403: Forbidden (authorization failed)
  - 404: Not found (resource doesn't exist)
  - 409: Conflict (duplicate, state conflict)
  - 500: Server error (unexpected)
  - Test: Verify each endpoint returns correct status

- [ ] **User-Friendly Error Messages**
  - [ ] No technical jargon exposed
  - [ ] No SQL errors in responses
  - [ ] No stack traces in responses
  - [ ] Clear guidance on how to fix
  - Example: ❌ "Syntax error in query" → ✅ "Invalid search term"

- [ ] **Detailed Logging for Debugging**
  - Error details logged (not exposed to user)
  - Stack traces recorded
  - Request context included
  - Error severity tracked
  - Test: Check CloudWatch logs for details

- [ ] **Standardized Error Handling**
  - All services use ErrorHandler middleware
  - No unhandled promise rejections
  - Async/await try-catch in place
  - Test: `npm run test:error-handling`

### Error Scenario Validation

- [ ] **Validation Errors**
  - [ ] Empty strings: "Field cannot be empty"
  - [ ] Invalid email: "Invalid email format"
  - [ ] Too long: "Field exceeds maximum length"
  - [ ] Invalid enum: "Invalid value for field"

- [ ] **Authorization Errors**
  - [ ] Missing token: "Authentication required"
  - [ ] Invalid token: "Invalid or expired token"
  - [ ] Insufficient permissions: "You don't have permission"

- [ ] **Resource Errors**
  - [ ] Not found: "Resource not found"
  - [ ] Already exists: "Resource already exists"
  - [ ] Conflict: "Cannot perform action (conflict)"

- [ ] **Server Errors**
  - [ ] Database connection: "Service temporarily unavailable"
  - [ ] External API: "External service error (try again)"
  - [ ] Internal error: "An unexpected error occurred"

### Security Validation

- [ ] **No Information Disclosure**
  - [ ] Database errors not exposed
  - [ ] File paths not exposed
  - [ ] Internal URLs not exposed
  - [ ] Version numbers not exposed
  - Test: `npm run test:security -- --testNamePattern="error"`

- [ ] **Error Logging Doesn't Expose Secrets**
  - [ ] API keys not logged
  - [ ] Passwords not logged
  - [ ] User PII not logged
  - [ ] Token values not logged
  - Test: `grep -r "password\|token\|key" logs/ | grep -v "KEY_ROTATION"`

### Code Quality

- [ ] **Error Handling Middleware**
  - Centralized error handling
  - Consistent across all services
  - Test: `npm run test:unit -- --testPathPattern="middleware"`

- [ ] **All Tests Passing**
  - Unit tests: 100% pass
  - Integration tests: 100% pass
  - Coverage > 85%
  - Test: `npm run test:community`

### Integration Testing

- [ ] **End-to-End Error Flows**
  - [ ] Create invalid post → 400 response
  - [ ] Access unauthorized resource → 403 response
  - [ ] Server error scenario → 500 response + logging
  - [ ] Retry mechanism works for transient errors

- [ ] **Error Recovery**
  - Circuit breaker functioning
  - Graceful degradation working
  - Retry logic operational
  - Fallback mechanisms in place

### Sign-Off

- [ ] QA Lead approval
- [ ] Error handling validated
- [ ] Security review passed
- [ ] Ready for merge to main

---

## 🎯 WAVE 2 FINAL VALIDATION

### All Stories Combined

- [ ] No regressions in existing features
- [ ] Performance baseline established
- [ ] Coverage target 85%+ met
- [ ] Error handling standardized
- [ ] Monitoring/alerting working
- [ ] Ready for production deployment

### Sign-Off Required From

- [ ] QA Lead (testing verification)
- [ ] Performance Engineer (benchmark validation)
- [ ] Security Team (error exposure check)
- [ ] Engineering Manager (final approval)

---

**Created:** 2026-02-14
**Last Updated:** 2026-02-14
**Next Review:** After Wave 2 implementation
