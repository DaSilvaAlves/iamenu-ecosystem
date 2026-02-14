# RECOVERY CHECKLIST - iaMenu Ecosystem

**Start Time:** 2026-02-14
**Estimated Duration:** 1.5 hours
**Risk Level:** LOW (configuration changes only)
**Backup Created:** [Mark when complete]

---

## PHASE 1: CRITICAL FIXES (30 minutes)

### Fix 1: Standardize CORS Configuration

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

**Files to Update:**

1. **Marketplace API** (`services/marketplace/src/app.ts`, line 22)
   ```diff
   - app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
   + app.use(cors({
   +   origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
   +   credentials: true
   + }));
   ```
   - [ ] File updated
   - [ ] Syntax verified
   - [ ] Matches Community pattern

2. **Academy API** (`services/academy/src/app.ts`, line 25)
   ```diff
   - app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
   + app.use(cors({
   +   origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
   +   credentials: true
   + }));
   ```
   - [ ] File updated
   - [ ] Removed permissive `*` default
   - [ ] Uses CORS_ORIGIN env var

3. **Business API** (`services/business/src/app.ts`, lines 29-32)
   ```diff
   - origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:5174'],
   + origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
   ```
   - [ ] File updated
   - [ ] Variable name standardized to CORS_ORIGIN
   - [ ] Fallback matches pattern

4. **Community API** (`services/community/src/app.ts`)
   - [ ] Already correct ✅
   - [ ] No changes needed

**Verification:**
```bash
# Verify syntax is correct
grep -n "CORS_ORIGIN" services/*/src/app.ts

# Expected output:
# services/community/src/app.ts: process.env.CORS_ORIGIN
# services/marketplace/src/app.ts: process.env.CORS_ORIGIN
# services/academy/src/app.ts: process.env.CORS_ORIGIN
# services/business/src/app.ts: process.env.CORS_ORIGIN
```

**Checklist:**
- [ ] All 4 services use consistent CORS pattern
- [ ] All services check `process.env.CORS_ORIGIN`
- [ ] All services have sensible fallbacks
- [ ] No hardcoded origins except dev defaults
- [ ] File syntax is valid TypeScript

---

### Fix 2: Update Environment Variables

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

**File to Update:** `.env` (root directory)

```bash
# Add/update these lines
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,https://prototype-vision.vercel.app
JWT_SECRET=dev-jwt-secret-change-in-production-12345678
```

**Create Docker-specific config** (optional but recommended):

Create `.env.docker`:
```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/iamenu?schema={service}
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Verification:**
```bash
# Check .env has CORS_ORIGIN
grep "CORS_ORIGIN" .env

# Expected:
# CORS_ORIGIN=http://localhost:5173,http://localhost:5174,...
```

**Checklist:**
- [ ] CORS_ORIGIN present in .env
- [ ] Multiple origins separated by comma
- [ ] Production URL included (prototype-vision.vercel.app)
- [ ] JWT_SECRET is strong (not hardcoded defaults)
- [ ] No sensitive keys exposed in git

---

### Fix 3: Secure Gemini API Key

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

**Step 1: Remove from Frontend**
```bash
# File: frontend/apps/prototype-vision/.env
# Remove these lines:
- GEMINI_API_KEY=...
- VITE_GEMINI_API_KEY=...
```

- [ ] Removed from frontend/.env
- [ ] Committed with message "security: remove exposed API keys from frontend"

**Step 2: Move to Backend**
```bash
# File: services/community/.env (or new backend .env)
+ GEMINI_API_KEY=AIzaSyD82Qll9NZwMKmbPUeMX6ifeNkKbuaNCTs
```

- [ ] Added to backend services/.env
- [ ] NOT committed to git (add to .gitignore)

**Step 3: Create Backend Endpoint** (Optional but recommended)
```typescript
// services/community/src/routes/ai.ts
POST /api/v1/community/ai/generate
{
  prompt: "user prompt"
}
// Backend calls Gemini with API key, returns response
```

- [ ] New route created (optional)
- [ ] Frontend calls backend instead of Gemini directly
- [ ] API key never exposed to client

**Verification:**
```bash
# Ensure Gemini key is not in frontend
grep -r "GEMINI_API_KEY" frontend/

# Expected: No output (or only .env.example if documented)

# Ensure Gemini key is in backend
grep -r "GEMINI_API_KEY" services/

# Expected: Only in .env files (not committed)
```

**Checklist:**
- [ ] Gemini API key removed from frontend/.env
- [ ] Gemini API key added to backend/.env
- [ ] .gitignore includes .env files
- [ ] Frontend doesn't directly call OpenAI/Gemini APIs
- [ ] Backend endpoint created for AI features (or documented for future)

---

### Fix 4: Update Documentation

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

**File: README.md**

Update port numbers section:

```diff
## Service Ports

- Community API: 3001 ← (was incorrectly 3004)
- Marketplace API: 3002 ← (was incorrectly 3005)
- Academy API: 3003
- Business API: 3004 ← (was incorrectly 3002)
- Frontend (Vite): 5173
```

**File: ARCHITECTURE.md**
- [ ] Already created with full documentation
- [ ] Commit to repository

**File: docs/SETUP.md** (Create if doesn't exist)
```bash
# Setup Instructions
1. Clone repo
2. npm install
3. cp .env.example .env
4. Edit .env with CORS_ORIGIN, JWT_SECRET
5. docker compose up postgres -d
6. npm run prisma:generate
7. npm run prisma:migrate
8. npm run dev
```

- [ ] Setup guide created
- [ ] Step-by-step instructions clear
- [ ] Screenshots or code examples included

**Checklist:**
- [ ] README.md corrected with right port numbers
- [ ] ARCHITECTURE.md created and committed
- [ ] Setup guide created
- [ ] Troubleshooting section added
- [ ] All docs reference correct ports and configs

---

## PHASE 2: VERIFY FIXES (15 minutes)

### Verification 1: Stop Old Services

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

```bash
# Kill any running npm processes
pkill -f "npm run dev"

# Or manually: Ctrl+C in terminal running npm

# Verify ports are free
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004
lsof -i :5173

# Expected: No output (ports free)
```

**Checklist:**
- [ ] All npm dev processes stopped
- [ ] All ports 3001-3004, 5173 are free
- [ ] No zombie processes remaining

---

### Verification 2: Restart Services Fresh

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

```bash
cd /path/to/iamenu-ecosystem

# Clear cache (optional but recommended)
npm run clean

# Reinstall dependencies
npm install

# Generate Prisma clients
npm run prisma:generate

# Start development
npm run dev
```

**Wait for startup messages:**
```
[0] Community API started (port 3001)
[1] Marketplace API started (port 3002)
[2] Academy API started (port 3003)
[3] Business API started (port 3004)
[4] Vite: ready in XXXms
```

**Checklist:**
- [ ] No EADDRINUSE errors
- [ ] All 5 processes started successfully
- [ ] Logs show "started" or "ready" messages
- [ ] No TypeScript compilation errors

---

### Verification 3: Test API Connectivity

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

**Test 1: Health Checks**
```bash
curl http://localhost:3001/health    # Should return 200 + status
curl http://localhost:3002/health    # Should return 200 + status
curl http://localhost:3003/health    # Should return 200 + status
curl http://localhost:3004/health    # Should return 200 + status
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "community-api",
  "version": "1.0.0"
}
```

- [ ] Community API responds to health check
- [ ] Marketplace API responds to health check
- [ ] Academy API responds to health check
- [ ] Business API responds to health check

**Test 2: CORS Preflight**
```bash
curl -X OPTIONS http://localhost:3001/api/v1/community/posts \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Expected: 204 No Content + Access-Control-Allow-Origin header
```

- [ ] OPTIONS request returns 204
- [ ] Response includes Access-Control-Allow-Origin header
- [ ] Origin matches CORS_ORIGIN config

**Test 3: Authentication**
```bash
# Get test token
curl http://localhost:3001/api/v1/community/auth/test-token

# Expected: { "token": "eyJ..." }

# Use token to access protected endpoint
TOKEN="<token from above>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/v1/community/notifications

# Expected: 200 + notification data (not 403 Forbidden)
```

- [ ] Test token endpoint returns valid JWT
- [ ] Protected endpoint returns 200 (not 403/401)
- [ ] No CORS errors in browser console

**Checklist:**
- [ ] All 4 services respond to health checks
- [ ] CORS preflight returns correct headers
- [ ] Authentication endpoints working
- [ ] Protected endpoints accessible with valid token
- [ ] No 403 CORS errors

---

### Verification 4: Test Frontend

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

Open browser: `http://localhost:5173` (or 5174 if 5173 in use)

**Check Console for:**

```javascript
✓ "API URLs -> {Community: 'http://localhost:300x/...", ...}"
✓ "🌐 Truth Seeker: Environment Detection -> {...}"
✓ "✅ Token de teste processado e pronto."
✓ No CORS policy errors
✓ No 403 Forbidden errors
✓ No 401 Unauthorized errors
```

**Checklist:**
- [ ] Frontend loads without JavaScript errors
- [ ] API URLs logged are correct (3001-3004)
- [ ] Authentication token obtained successfully
- [ ] DevTools Console clean (no red errors)
- [ ] Network tab shows 200 responses from APIs
- [ ] UI displays content (not blank/error screen)

---

## PHASE 3: COMMIT & DOCUMENT (20 minutes)

### Commit Changes

**Status:** ☐ Not Started | ☐ In Progress | ✅ Complete

```bash
git add services/*/src/app.ts
git add .env
git add ARCHITECTURE.md
git add README.md

git commit -m "fix: standardize CORS configuration across all services

- Marketplace API: Use CORS_ORIGIN env var + multiple origins
- Academy API: Remove permissive '*' default, require whitelist
- Business API: Standardize to CORS_ORIGIN (was ALLOWED_ORIGINS)
- Community API: Already correct, no changes

Also:
- Updated port numbers in README (3001-3004, not 3004-3006)
- Created ARCHITECTURE.md with complete system documentation
- Moved Gemini API key to backend (security fix)
- Added CORS troubleshooting guide

Fixes #403-errors #cors-issues"
```

**Verification:**
```bash
git status    # Should be clean
git log -1    # Should show commit
```

- [ ] All changed files staged
- [ ] Commit message clear and complete
- [ ] No unintended files included
- [ ] Commit successful

---

## FINAL VERIFICATION CHECKLIST

**All Items Completed:**

### Configuration
- [ ] CORS standardized across 4 services
- [ ] CORS_ORIGIN environment variable set
- [ ] JWT_SECRET configured
- [ ] Gemini API key secured (not in frontend)

### Services
- [ ] Community API running on 3001
- [ ] Marketplace API running on 3002
- [ ] Academy API running on 3003
- [ ] Business API running on 3004
- [ ] Frontend running on 5173 (or 5174/5175)
- [ ] PostgreSQL running on 5432

### Connectivity
- [ ] All services respond to health checks (200)
- [ ] CORS preflight returns correct headers
- [ ] Authentication working (test token)
- [ ] Protected endpoints accessible with token
- [ ] No 403 CORS errors in browser
- [ ] No 401/403 authentication errors

### Documentation
- [ ] ARCHITECTURE.md created and accurate
- [ ] README.md corrected with right ports
- [ ] Setup guide provided
- [ ] Troubleshooting section available

### Git
- [ ] Changes committed with clear message
- [ ] ARCHITECTURE.md tracked in git
- [ ] No uncommitted changes remaining

---

## TROUBLESHOOTING (If Issues Arise)

| Error | Cause | Fix |
|-------|-------|-----|
| EADDRINUSE 3001 | Old process still running | `pkill -f "npm run dev"` then restart |
| 403 Forbidden (CORS) | CORS_ORIGIN not updated | Update .env, restart service |
| 403 Forbidden (Auth) | Invalid/expired token | Get fresh token via /auth/test-token |
| Database connection failed | PostgreSQL not running | `docker compose up postgres -d` |
| Gemini API error | Key in wrong location | Move to backend/.env |
| Port 5173 in use | Vite using alternative | Check if using 5174 or 5175 |

---

## SIGN-OFF

**Completed By:** ________________
**Date:** ________________
**Time Spent:** ________________
**Issues Encountered:** ________________
**Next Steps:** ________________

---

**Checklist Status:** ☐ 0-25% Complete | ☐ 25-50% Complete | ☐ 50-75% Complete | ☐ 75-99% Complete | ☐ 100% COMPLETE ✅

