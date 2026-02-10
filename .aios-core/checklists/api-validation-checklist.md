# API Validation Checklist

**Purpose:** Ensure every API endpoint meets quality standards before deployment
**Used By:** @qa (Quinn) - before approving endpoints
**Scope:** All new/modified endpoints across Community, Marketplace, Academy, Business

---

## Pre-Deployment Checklist

### Code Quality

- [ ] **Error Handling**
  - [ ] Uses unified error classes (ValidationError, ForbiddenError, etc.)
  - [ ] Returns correct HTTP status codes (400, 401, 403, 409, 500)
  - [ ] Includes error code and descriptive message
  - [ ] Logs errors with requestId for tracing
  - [ ] Never exposes sensitive data in error messages

- [ ] **Input Validation**
  - [ ] All required fields validated
  - [ ] Email format validated
  - [ ] UUID format validated where applicable
  - [ ] String length limits enforced
  - [ ] Number ranges validated
  - [ ] Returns VALIDATION_ERROR on failure

- [ ] **Response Format**
  - [ ] Wraps response in `{ data: {...} }` structure
  - [ ] Timestamps in ISO 8601 format
  - [ ] Money fields as strings with 2 decimals
  - [ ] IDs are UUIDs (not auto-increment integers)
  - [ ] Booleans are lowercase
  - [ ] List endpoints include pagination object

- [ ] **Authentication & Authorization**
  - [ ] RLS middleware applied
  - [ ] JWT validation on protected endpoints
  - [ ] Returns 401 for missing/invalid tokens
  - [ ] Returns 403 for insufficient permissions
  - [ ] Tests for cross-user access attempts

---

### Database & RLS

- [ ] **RLS Policies**
  - [ ] Appropriate RLS policy exists for table
  - [ ] User can only see own data (if applicable)
  - [ ] RLS session variable set by middleware
  - [ ] Query respects RLS filters
  - [ ] No way to bypass RLS via API

- [ ] **Data Integrity**
  - [ ] Foreign keys have correct onDelete rules
  - [ ] Unique constraints prevent duplicates
  - [ ] Decimal precision used for money fields
  - [ ] No orphaned records possible

---

### API Design

- [ ] **HTTP Methods**
  - [ ] GET used for reads only
  - [ ] POST used for creation (returns 201)
  - [ ] PATCH used for partial updates
  - [ ] DELETE used for deletion (returns 204)

- [ ] **URL Structure**
  - [ ] Resource names plural (✅ `/posts`, ❌ `/post`)
  - [ ] IDs in path for specific resources
  - [ ] Nested resources for logical hierarchy
  - [ ] Query params for filtering/search/pagination

- [ ] **Pagination (for list endpoints)**
  - [ ] Supports `limit` parameter (1-100, default 20)
  - [ ] Supports `offset` parameter (default 0)
  - [ ] Returns `total` count
  - [ ] Returns `hasMore` flag
  - [ ] Pagination object in response

---

### Testing

- [ ] **Happy Path Tests**
  - [ ] Basic success scenario passes
  - [ ] Correct status code returned
  - [ ] Response format matches specification
  - [ ] Data is persisted correctly

- [ ] **Error Path Tests**
  - [ ] Missing required field → 400 VALIDATION_ERROR
  - [ ] Invalid auth token → 401 INVALID_TOKEN
  - [ ] Insufficient permissions → 403 FORBIDDEN
  - [ ] Resource not found → 404 NOT_FOUND
  - [ ] Duplicate resource → 409 CONFLICT
  - [ ] Server error → 500 INTERNAL_ERROR

- [ ] **RLS Tests**
  - [ ] User cannot see other users' data
  - [ ] Cross-user access returns 403 or empty result
  - [ ] Admin can see data (if applicable)
  - [ ] RLS bypass attempts all fail

- [ ] **Code Coverage**
  - [ ] Happy path covered
  - [ ] All error scenarios covered
  - [ ] Edge cases tested (empty strings, large numbers, etc.)
  - [ ] Concurrent requests handled safely

---

### Documentation

- [ ] **Inline Comments**
  - [ ] Complex logic documented
  - [ ] Business rules explained
  - [ ] Non-obvious validations justified

- [ ] **API Reference**
  - [ ] Endpoint documented in OpenAPI/Swagger
  - [ ] Purpose described clearly
  - [ ] Request/response format documented
  - [ ] Error scenarios listed
  - [ ] Example curl request provided

- [ ] **README**
  - [ ] New endpoint mentioned if user-facing
  - [ ] Breaking changes documented
  - [ ] Migration guide provided if needed

---

### Performance

- [ ] **Query Optimization**
  - [ ] Indexes used for common queries
  - [ ] No N+1 query problems
  - [ ] Pagination prevents large result sets
  - [ ] Query plan reviewed (EXPLAIN)

- [ ] **Response Size**
  - [ ] Large responses paginated
  - [ ] Unnecessary fields excluded
  - [ ] Nested data limited (max 2 levels)

---

### Security

- [ ] **Input Sanitization**
  - [ ] SQL injection prevented (Prisma used)
  - [ ] XSS prevention (JSON responses)
  - [ ] No command injection risks

- [ ] **Rate Limiting**
  - [ ] Applied to public endpoints
  - [ ] Applied to resource-intensive operations
  - [ ] Returns 429 when exceeded

- [ ] **Data Privacy**
  - [ ] Sensitive fields not exposed unnecessarily
  - [ ] Error messages don't leak data
  - [ ] No passwords/tokens in response
  - [ ] Audit trails created for sensitive operations

---

## Approval Process

### QA Review

1. **Run automated checks:**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```

2. **Manual review:**
   - [ ] Read implementation code
   - [ ] Verify checklist items above
   - [ ] Check for common mistakes

3. **Integration test:**
   ```bash
   # Test against staging database
   npm run test:integration
   ```

4. **Security scan:**
   - [ ] OWASP top 10 review
   - [ ] RLS bypass attempts
   - [ ] Rate limiting verification

### Sign-off

QA approves by:
- [ ] All checklist items marked ✅
- [ ] Test coverage >90%
- [ ] No security issues found
- [ ] Documented for API reference

---

## Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Missing error handling | Crashes on invalid input | Add validation, catch errors |
| Wrong error code | Tests fail | Use unified error classes |
| RLS bypass | User sees other users' data | Add RLS policy, test thoroughly |
| No pagination | API slow with large datasets | Add limit/offset/pagination |
| Wrong HTTP method | Endpoint semantics wrong | Use POST for mutations, GET for reads |

---

## Related Standards

- See: `error-handling.md` - Unified error responses
- See: `api-standards.md` - API design conventions
- See: `rls-policies-design.md` - RLS implementation
- See: `rls-test-plan.md` - RLS testing strategy

