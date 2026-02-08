# Deployment Rollback Procedure

## Overview

This guide explains how to rollback a failed deployment on Railway.

---

## Quick Rollback (Emergency)

If a deployment breaks production immediately:

### 1. **Stop Current Deployment** (via Railway Dashboard)
```
1. Go to https://railway.app/dashboard
2. Select the service that failed
3. Click "Stop" or "Rollback"
4. Railway will restore the previous working version
```

### 2. **Verify Rollback**
```bash
# Check service status
curl https://<service-api-url>/health

# Should return: { "status": "ok" }
```

---

## Rollback via Git (Clean Method)

If you need to rollback to a specific commit:

### 1. **Identify Failed Commit**
```bash
# View recent deployments
git log --oneline -10 main

# Example output:
# a1b2c3d fix: bug in user service
# b2c3d4e feat: new feature (← THIS BROKE PROD)
# c3d4e5f fix: earlier fix
```

### 2. **Revert the Commit**
```bash
# Create a new commit that reverts the failed one
git revert b2c3d4e

# Or if you want to go back multiple commits:
git revert b2c3d4e..HEAD
```

### 3. **Push to Trigger CD**
```bash
git push origin main
```

The CD pipeline will:
1. ✅ Run CI tests
2. ✅ If CI passes → Auto-deploy to Railway
3. ✅ Services restore to previous working state

---

## Manual Rollback (Advanced)

If you need to rollback without code changes:

### 1. **Via Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# List available service versions
railway logs --service community-api

# Rollback to specific deployment
railway redeploy --service community-api --deployment <deployment-id>
```

### 2. **Via Railway Dashboard**
```
1. Go to Railway Dashboard
2. Select Service → Deployments
3. Find the working deployment
4. Click "Redeploy"
```

---

## Prevention Strategies

### 1. **Pre-Deployment Testing**
```bash
# Always run full test suite before merge
npm test
npm run lint
npm run typecheck
npm run build
```

### 2. **Staging Deployment**
```bash
# Deploy to staging first (if configured)
git push origin main:develop
# CD will deploy to staging Railway environment
# Verify in staging before promoting to production
```

### 3. **Monitor Deployment**
```bash
# Monitor logs after deployment
railway logs --service <service-name> --follow

# Check for errors
curl https://<service-url>/health
```

---

## Rollback Checklist

- [ ] Identify which commit/deployment failed
- [ ] Decide: Revert code or redeploy previous version?
- [ ] If reverting: `git revert <commit>` and `git push origin main`
- [ ] If redeploying: Use Railway Dashboard → Deployments → Redeploy
- [ ] Wait for CD pipeline to complete (5-10 minutes)
- [ ] Verify services are healthy: `curl /health`
- [ ] Monitor logs for 5 minutes
- [ ] Notify team of rollback

---

## Emergency Contacts

**If deployment is broken in production:**

1. **Immediate:** Rollback via Railway Dashboard (< 2 min)
2. **Follow-up:** Create GitHub issue with error details
3. **Post-mortem:** Team review of what went wrong
4. **Prevention:** Add test case to prevent regression

---

## CI/CD Status Checks

All deployments MUST pass CI before Railway deployment:

- ✅ Lint (`npm run lint:check`)
- ✅ Test (`npm test`)
- ✅ Typecheck (`npm run typecheck`)
- ✅ Build (`npm run build`)

If ANY check fails → **NO deployment** → Fix issues first

---

## Service Health Endpoints

Test service availability after rollback:

```bash
# Community API
curl https://iamenucommunity-api-production.up.railway.app/health

# Marketplace API
curl https://iamenumarketplace-api-production.up.railway.app/health

# Academy API
curl https://iamenuacademy-api-production.up.railway.app/health

# Business API
curl https://iamenubusiness-api-production.up.railway.app/health

# Frontend
curl https://prototype-vision.vercel.app
```

All should return `{ "status": "ok" }` or HTTP 200.

---

**Last Updated:** 2026-02-08
**Owner:** DevOps Team (@devops)
