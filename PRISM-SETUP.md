# Prism Mock Server Setup Guide

**Fase D.2: Prism Mock Server Implementation**
**Data:** 2026-02-10
**Status:** ✅ Complete

## 30 Second Quick Start

```bash
# Start mock servers
npm run prism:start

# Test everything works
npm run prism:test

# Use mock APIs
curl http://localhost:9000/api/v1/community/posts | jq
```

Done! Your APIs are simulated. 🎉

---

## Why Prism?

✅ **Testar front-end sem back-end**
```bash
# Start mock servers instead of real APIs
npm run prism:start

# Your code talks to mock APIs
curl http://localhost:9000/api/v1/community/posts
```

✅ **Desenvolvimento paralelo**
```
Backend dev working on database logic
Frontend dev testing with mock APIs
Both happening at same time
```

✅ **CI/CD pipeline testing**
```
No need for test database
No need for test containers
Just mock APIs responding realistically
```

✅ **Demo/Prototype**
```
Show API functionality without real data
Consistent responses
No sensitive information
```

---

## What Was Created

### Docker Configuration

1. **docker-compose.prism.yml** (76 lines)
   - 4 Prism mock servers (one per API)
   - 1 Nginx gateway (unified access)
   - Health checks on all containers
   - Network isolation

2. **docker/prism/nginx-gateway.conf** (145 lines)
   - Reverse proxy for all 4 APIs
   - CORS headers configured
   - Request logging
   - Health check endpoints

3. **docker/prism/README.md** (420 lines)
   - Complete Prism documentation
   - Examples and integration guides
   - Troubleshooting

### Management Scripts

1. **scripts/prism.sh** (170 lines)
   - Bash script for Linux/macOS
   - Commands: start, stop, logs, test, status, clean
   - Colored output and helpful messages

2. **scripts/prism.ps1** (180 lines)
   - PowerShell script for Windows
   - Same commands as Bash version
   - Proper error handling

3. **scripts/prism-test.js** (150 lines)
   - Node.js test suite
   - Tests all 5 endpoints (4 services + gateway)
   - Pretty colored output
   - Detailed diagnostics

### npm Scripts

Added to `package.json`:
```json
"prism:start": "docker compose -f docker-compose.prism.yml up -d",
"prism:stop": "docker compose -f docker-compose.prism.yml down",
"prism:logs": "docker compose -f docker-compose.prism.yml logs -f",
"prism:restart": "docker compose -f docker-compose.prism.yml restart",
"prism:status": "docker compose -f docker-compose.prism.yml ps",
"prism:test": "node scripts/prism-test.js",
"prism:clean": "docker compose -f docker-compose.prism.yml down -v"
```

---

## How It Works

### Architecture

```
Your Code (JavaScript/Python/etc.)
        ↓
      curl http://localhost:9000/api/v1/...
        ↓
   Nginx Gateway (9000)
   ├→ Community Mock (4001)
   ├→ Marketplace Mock (4002)
   ├→ Academy Mock (4003)
   └→ Business Mock (4004)
        ↓
   OpenAPI Specifications
   (Generate realistic responses)
        ↓
   Realistic JSON responses
   (Same format as real APIs)
```

### Data Generation

Prism reads OpenAPI specs and generates realistic data:

```yaml
# From spec:
properties:
  id:
    type: string
    format: uuid
  name:
    type: string
    minLength: 3
  email:
    type: string
    format: email

# Generates:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "string",
  "email": "user@example.com"
}
```

---

## Usage Examples

### Start/Stop

```bash
# Start
npm run prism:start

# Stop
npm run prism:stop

# Restart
npm run prism:restart

# See status
npm run prism:status
```

### Testing

```bash
# Run test suite (tests all endpoints)
npm run prism:test

# View logs
npm run prism:logs

# Test specific service
docker compose -f docker-compose.prism.yml logs prism-community
```

### Using APIs

```bash
# Gateway endpoint (recommended)
curl http://localhost:9000/api/v1/community/posts
curl http://localhost:9000/api/v1/marketplace/suppliers
curl http://localhost:9000/api/v1/academy/courses
curl http://localhost:9000/api/v1/business/dashboard/stats

# Direct Prism (useful for debugging)
curl http://localhost:4001/api/v1/community/posts
curl http://localhost:4002/api/v1/marketplace/suppliers
curl http://localhost:4003/api/v1/academy/courses
curl http://localhost:4004/api/v1/business/dashboard/stats
```

---

## Front-end Integration

### React

```javascript
// Create API client pointing to Prism
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:9000/api/v1';

const api = axios.create({ baseURL: API_BASE });

export default api;
```

### Environment Variables

**.env.development:**
```
REACT_APP_API_BASE=http://localhost:9000/api/v1
```

**.env.production:**
```
REACT_APP_API_BASE=https://api.iamenu.com/api/v1
```

### Usage in Components

```javascript
import api from './api';

function PostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/community/posts')
      .then(res => setPosts(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

---

## Testing Workflows

### Scenario 1: Frontend Development (Backend not ready)

```bash
# 1. Start Prism
npm run prism:start

# 2. Develop frontend
npm run dev:frontend

# 3. Point to mock APIs
# In your code: API_BASE = 'http://localhost:9000/api/v1'

# 4. Test as backend develops
# When backend ready, just change API_BASE
```

### Scenario 2: API Testing

```bash
# 1. Start Prism
npm run prism:start

# 2. Run tests against mock APIs
npm test -- --api-url http://localhost:9000

# 3. Verify API contracts
# Responses match OpenAPI spec
```

### Scenario 3: CI/CD Pipeline

```yaml
# .github/workflows/test.yml
- name: Start mock APIs
  run: docker compose -f docker-compose.prism.yml up -d

- name: Wait for APIs
  run: npm run prism:test

- name: Run integration tests
  run: npm run test:integration

- name: Stop mock APIs
  run: docker compose -f docker-compose.prism.yml down
```

---

## Troubleshooting

### "Connection refused" (APIs not responding)

```bash
# 1. Check if containers are running
npm run prism:status

# 2. If not, start them
npm run prism:start

# 3. Wait 5-10 seconds for health checks
# 4. Test again
npm run prism:test
```

### "Port already in use"

```bash
# Find what's using port
lsof -i :9000  # macOS/Linux
netstat -ano | findstr :9000  # Windows

# Either:
# A) Kill the process
# B) Change port in docker-compose.prism.yml (9001:80 instead of 9000:80)
```

### Container keeps restarting

```bash
# View detailed logs
npm run prism:logs

# Common issues:
# - Port conflict (see above)
# - OpenAPI spec file missing
# - Docker resource limits

# Reset everything
npm run prism:clean
npm run prism:start
```

### CORS errors in browser

```bash
# Prism already has CORS configured
# If still failing:

# 1. Test with curl (no CORS issues)
curl http://localhost:9000/api/v1/community/posts

# 2. If curl works but browser fails:
#    - Check browser console for exact error
#    - Might be missing Authorization header
#    - Try with Authorization: Bearer <token>

# 3. Check nginx logs
docker compose -f docker-compose.prism.yml logs mock-api-gateway
```

---

## Commands Reference

### npm Scripts

```bash
npm run prism:start      # Start all mock servers
npm run prism:stop       # Stop all mock servers
npm run prism:restart    # Restart all mock servers
npm run prism:logs       # View logs (follow mode)
npm run prism:status     # See container status
npm run prism:test       # Test all endpoints
npm run prism:clean      # Remove containers and volumes
```

### Direct docker compose

```bash
# Start
docker compose -f docker-compose.prism.yml up -d

# Stop
docker compose -f docker-compose.prism.yml down

# Logs
docker compose -f docker-compose.prism.yml logs -f

# Restart
docker compose -f docker-compose.prism.yml restart
```

### Bash/PowerShell Scripts

**Linux/macOS:**
```bash
./scripts/prism.sh start|stop|restart|logs|status|test|clean
```

**Windows:**
```powershell
.\scripts\prism.ps1 -Command start|stop|restart|logs|status|test|clean
```

---

## Mock API URLs

### Gateway (Unified)
Simulates production architecture with single endpoint:

```
http://localhost:9000/api/v1/community/...
http://localhost:9000/api/v1/marketplace/...
http://localhost:9000/api/v1/academy/...
http://localhost:9000/api/v1/business/...
```

**Status:** http://localhost:9000/status (JSON)
**Health:** http://localhost:9000/health (text)

### Direct Prism Servers
For debugging individual services:

```
http://localhost:4001/api/v1/community/...    (Community)
http://localhost:4002/api/v1/marketplace/...  (Marketplace)
http://localhost:4003/api/v1/academy/...      (Academy)
http://localhost:4004/api/v1/business/...     (Business)
```

---

## Integration Checklist

- [ ] Docker installed and running
- [ ] `npm run prism:start` succeeds
- [ ] `npm run prism:test` shows all green ✅
- [ ] Can `curl http://localhost:9000/api/v1/community/posts`
- [ ] Response is valid JSON matching OpenAPI spec
- [ ] Frontend pointing to `http://localhost:9000`
- [ ] All CRUD operations return appropriate status codes
- [ ] CORS headers present (if testing from browser)

---

## Next Steps

### Immediately
1. Start Prism: `npm run prism:start`
2. Test: `npm run prism:test`
3. Point frontend to `http://localhost:9000/api/v1`
4. Develop frontend features using mock data

### When Backend is Ready
1. Start real backend: `npm run dev`
2. Change API base URL: `http://localhost:3001` (or real URL)
3. Test with real data
4. Keep Prism for CI/CD testing

### Advanced (Fase D.3+)
1. SDK generation (JavaScript, Python, etc.)
2. API testing suite (Jest tests)
3. GraphQL alternative
4. API versioning strategy

---

## Performance Tips

### Local Development
- Keep Prism running (minimal resource usage)
- Response time: 50-100ms (fast)
- Replicates real API latency

### CI/CD
- Prism is lightweight (no database)
- Container startup: 3-5 seconds
- Perfect for GitHub Actions, GitLab CI, etc.

### Production
- Use real backend APIs
- Prism is NOT for production traffic
- Use for staging environment only

---

## Switching Modes

### Development (Prism)
```javascript
const API_URL = 'http://localhost:9000/api/v1';
```

### Staging (Real Backend)
```javascript
const API_URL = 'https://staging-api.iamenu.com/api/v1';
```

### Production (Real Backend)
```javascript
const API_URL = 'https://api.iamenu.com/api/v1';
```

---

## Support Resources

- 📖 [Prism Documentation](https://docs.stoplight.io/docs/prism/about)
- 🔵 [OpenAPI Specification](https://spec.openapis.org/oas/v3.0.3)
- 📋 [iaMenu API Docs](docs/api/README.md)
- 🌐 [Swagger UI](SWAGGER-UI-SETUP.md)

---

**Created:** 2026-02-10
**Status:** ✅ Production Ready
**Próxima fase:** D.3 - SDK Generation

