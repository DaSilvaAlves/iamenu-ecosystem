# Load Testing - Story 2.2: Fix API Response Performance

## Overview

This directory contains load testing configurations for the iaMenu Ecosystem API using **Artillery.io**.

## Test Scenarios

### Load Profile

- **Warm-up:** 10 users for 10 seconds
- **Ramp-up:** 50 users for 20 seconds
- **Peak Load:** 100 concurrent users for 30 seconds
- **Cool-down:** 10 users for 10 seconds

**Total Duration:** 70 seconds

### Success Criteria

- **P95 (95th percentile) Response Time:** < 150ms
- **P99 (99th percentile) Response Time:** < 200ms
- **Error Rate:** 0 errors
- **Throughput:** Minimum 500 requests/minute

## Files

- **artillery.yml** - Main load test configuration
- **load-test-processor.js** - Custom JavaScript processor for Artillery
- **README.md** - This file

## Installation

### Prerequisites

- Node.js 18+
- Artillery CLI installed globally

```bash
npm install -g artillery
```

### Local Setup

```bash
# Install dependencies (if needed)
npm install

# Verify Artillery is installed
artillery --version
```

## Running Tests

### 1. Test Local Development Environment

```bash
# Start all services
npm run dev

# In another terminal, run load tests
cd services/community/load-tests
artillery run artillery.yml
```

### 2. Test Specific Environment

```bash
# Test production environment
TARGET_URL=https://iamenucommunity-api-production.up.railway.app \
  artillery run artillery.yml

# Test staging
TARGET_URL=https://iamenucommunity-api-staging.up.railway.app \
  artillery run artillery.yml
```

### 3. With JWT Authentication

```bash
# If endpoints require authentication
JWT_TOKEN=your.jwt.token.here \
  artillery run artillery.yml
```

## Interpreting Results

Artillery provides real-time metrics during the test:

### Key Metrics

| Metric | Good | Acceptable | Poor |
|--------|------|-----------|------|
| P95 Response Time | <100ms | 100-150ms | >150ms |
| P99 Response Time | <150ms | 150-200ms | >200ms |
| Error Rate | 0% | <1% | >1% |
| Throughput | >600 req/min | 500-600 req/min | <500 req/min |

### Example Output

```
test_example/flow_1: 0.01s ago: 100 users  16.67 req/s

Summary report @ 12:34:56
  Scenarios launched: 500
  Scenarios completed: 450
  Requests completed: 4500
  RPS sent: 65
  Concurrency: 100
  Errors: 0

Response time (ms):
  min: 5
  max: 450
  p50: 45
  p95: 150
  p99: 200

Codes:
  200: 4500
```

## Troubleshooting

### Connection Refused

```bash
# Verify services are running
curl http://localhost:3001/api/v1/community/health

# Check port is correct
TARGET_URL=http://localhost:3001 artillery run artillery.yml
```

### Too Many Errors

- Check if services can handle the load
- Reduce `arrivalRate` in the config
- Check database connection limits
- Review application logs for bottlenecks

### Memory Issues

```bash
# Run with Node memory limit
NODE_OPTIONS=--max-old-space-size=2048 artillery run artillery.yml
```

## Results

Load test results are saved to:

```
docs/performance/artillery-results.json
```

View the results:

```bash
# Pretty print results
cat docs/performance/artillery-results.json | jq .

# Or open in a JSON viewer
# Results include: latency distribution, error rates, throughput metrics
```

## Optimization Tips

### If Performance is Poor

1. **Check Cache Hit Rate**
   - Monitor cache statistics in logs
   - Ensure cache TTL is appropriate

2. **Review Database Queries**
   - Run load test with query logging enabled
   - Identify slow queries with EXPLAIN ANALYZE

3. **Scale Horizontally**
   - Add more API server instances
   - Use load balancer to distribute traffic

4. **Optimize Endpoints**
   - Reduce payload size with projection
   - Implement pagination effectively
   - Use database indexes

## Performance Targets (Story 2.2)

### Community API

| Endpoint | Target | Actual |
|----------|--------|--------|
| GET /posts | <100ms | ⏳ Testing |
| GET /posts/:id | <100ms | ⏳ Testing |
| GET /posts?search= | <200ms | ⏳ Testing |

### Marketplace API

| Endpoint | Target | Actual |
|----------|--------|--------|
| GET /suppliers | <100ms | ⏳ Testing |
| GET /suppliers/:id | <100ms | ⏳ Testing |

### Academy API

| Endpoint | Target | Actual |
|----------|--------|--------|
| GET /courses | <100ms | ⏳ Testing |
| GET /courses/:id | <100ms | ⏳ Testing |

### Business API

| Endpoint | Target | Actual |
|----------|--------|--------|
| GET /stats/daily | <200ms | ⏳ Testing |
| GET /orders | <100ms | ⏳ Testing |

## Advanced Usage

### Custom Scenarios

Edit `artillery.yml` to add your own scenarios:

```yaml
- name: "Custom Scenario"
  flow:
    - post:
        url: "/api/v1/community/posts"
        json:
          title: "Test Post"
          body: "Content"
          category: "test"
        expect:
          - statusCode: 201
```

### Environment Variables

```bash
# Pass custom variables
TARGET_URL=http://custom-host:3001 \
JWT_TOKEN=my-token \
artillery run artillery.yml
```

### Continuous Integration

Add to your CI/CD pipeline:

```bash
# Fail if P95 > 150ms
artillery run artillery.yml --target <URL> --assertions ./assertions.json
```

## Related Documentation

- [Artillery Documentation](https://artillery.io/docs)
- [Story 2.2: Performance Optimization](../../docs/stories/story-wave2-002-api-performance.md)
- [Performance Tests](../src/services/__tests__/posts.performance.test.ts)
- [Cache Implementation](../src/lib/cache.ts)

## Contact

For questions or issues with load testing:
- Review test logs: `artillery run --log-level debug`
- Check application logs for performance insights
- Consult Story 2.2 documentation
