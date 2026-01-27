# 🔌 Port Configuration Guide

**Last Updated:** January 2026
**Status:** ✅ All port conflicts resolved

---

## Port Allocation

Each service has a dedicated port to prevent conflicts:

| Service | Port | Endpoint | Status |
|---------|------|----------|--------|
| **Community API** | 3001 | http://localhost:3001 | ✅ Fixed |
| **Marketplace API** | 3002 | http://localhost:3002 | ✅ Fixed |
| **Academy API** | 3003 | http://localhost:3003 | ✅ Fixed |
| **Business API** | 3004 | http://localhost:3004 | ✅ Fixed |
| **Core API** (Java) | 8080 | http://localhost:8080 | Configured |
| **Frontend** (React) | 5173 | http://localhost:5173 | Configured |

---

## Configuration Sources

### 1. Source Code Defaults (`.ts` files)

Located in `services/{service}/src/index.ts`:

```typescript
const PORT = process.env.PORT || 3001;  // Community
const PORT = process.env.PORT || 3002;  // Marketplace
const PORT = process.env.PORT || 3003;  // Academy
const PORT = process.env.PORT || 3004;  // Business
```

### 2. Environment Variables (`.env` files)

Each service has:

```bash
# services/community/.env
PORT=3001

# services/marketplace/.env
PORT=3002

# services/academy/.env
PORT=3003

# services/business/.env
PORT=3004
```

### 3. Docker Compose (`docker-compose.yml`)

```yaml
services:
  community:
    ports:
      - '3001:3001'
  marketplace:
    ports:
      - '3002:3002'
  academy:
    ports:
      - '3003:3003'
  business:
    ports:
      - '3004:3004'
```

---

## Running All Services Simultaneously

### Prerequisites

- PostgreSQL running on port 5432
- All ports 3001-3004 available (not in use)

### Start All Services

```bash
# From project root
npm run dev

# Or with Docker Compose
docker-compose up postgres community marketplace academy business

# Or start individually
cd services/community && npm run dev      # Port 3001
cd services/marketplace && npm run dev    # Port 3002
cd services/academy && npm run dev        # Port 3003
cd services/business && npm run dev       # Port 3004
```

### Verify All Services Running

```bash
# Test all endpoints
curl http://localhost:3001/health    # Community API
curl http://localhost:3002/health    # Marketplace API
curl http://localhost:3003/health    # Academy API
curl http://localhost:3004/health    # Business API

# All should return 200 OK with:
# { "status": "ok", "service": "...", ... }
```

---

## Checking Port Usage

### Find Which Process Uses a Port

```bash
# Linux/Mac
lsof -i :3001

# Windows (PowerShell)
netstat -ano | findstr :3001

# Windows (Command Prompt)
netstat -ano | find ":3001"
```

### Kill Process on Port

```bash
# Linux/Mac
kill -9 <PID>

# Windows (PowerShell as Admin)
Stop-Process -Id <PID> -Force

# Windows (Command Prompt as Admin)
taskkill /PID <PID> /F
```

---

## Custom Port Configuration

If you need to use different ports:

### Option 1: Environment Variables (Recommended)

```bash
# Override default port
export PORT=4001  # Linux/Mac
set PORT=4001     # Windows

# Or in .env file
PORT=4001

npm run dev
```

### Option 2: Docker Compose Override

```bash
# Change host port (container still uses 3001)
docker-compose.yml:
  community:
    ports:
      - '4001:3001'  # Host:Container
```

### Option 3: One-Time Override

```bash
# Run with custom port
PORT=4001 npm run dev
```

---

## Troubleshooting

### Error: "Port already in use"

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

```bash
# 1. Find process using the port
lsof -i :3001

# 2. Kill the process
kill -9 <PID>

# 3. Restart service
npm run dev
```

### Error: "Cannot connect to service"

```
Error: ECONNREFUSED 127.0.0.1:3001
```

**Solution:**

```bash
# 1. Verify service is running
curl http://localhost:3001/health

# 2. If not running, start it
cd services/community && npm run dev

# 3. If error persists, check .env file
cat services/community/.env | grep PORT
# Should show: PORT=3001
```

### Multiple Services on Same Port

If this happens, it means:

1. **`.env` file not set correctly**
   - Verify each service has correct PORT in .env

2. **Source code default wrong**
   - Check `src/index.ts` has correct default port

3. **Old process still running**
   - Kill old processes: `pkill -f "node.*src/index.ts"`

---

## Port Allocation History

### What Changed (Fixed)

**Before (Broken):**
- Community API: 3001 ❌ (was 3004 in code)
- Marketplace API: 3002 ✓
- Academy API: 3003 ✓
- Business API: 3002 ❌ (SAME as Marketplace!)

**After (Fixed):**
- Community API: 3001 ✅
- Marketplace API: 3002 ✅
- Academy API: 3003 ✅
- Business API: 3004 ✅

### Commits

- **ce7a8e9**: Security - Removed exposed credentials
- **820131e**: Prisma - Database initialization
- **[NEW]**: Port conflicts - Fixed hardcoded ports

---

## Verification Checklist

- [ ] All `.env` files have correct PORT
- [ ] All `src/index.ts` have correct PORT defaults
- [ ] `docker-compose.yml` has all 4 services with correct ports
- [ ] Can start all services: `npm run dev`
- [ ] All health checks return 200: `curl http://localhost:300X/health`
- [ ] No port conflicts: `netstat` shows no duplicates
- [ ] PostgreSQL on 5432: `pg_isready`

---

## Quick Reference

```bash
# Verify port allocation
grep "PORT\|3001\|3002\|3003\|3004" services/*/src/index.ts | grep "||"

# Check Docker Compose ports
grep -A2 "ports:" docker-compose.yml

# Test all services
for port in 3001 3002 3003 3004; do
  echo "Port $port: $(curl -s http://localhost:$port/health | jq .status)"
done
```

---

**All services now have dedicated, conflict-free ports ready for simultaneous execution! 🎉**
