# 🔐 Security & Environment Setup Guide

**Last Updated:** January 2025
**Status:** Critical Security Remediation Complete

---

## ⚠️ CRITICAL: Environment Variables

### NEVER Commit `.env` Files

- `.env` files contain **database passwords**, **API keys**, and **JWT secrets**
- These files are **AUTOMATICALLY IGNORED** by `.gitignore`
- If you accidentally commit secrets, they must be **rotated immediately**

### How to Set Up Local Development

#### Step 1: Generate JWT Secret

```bash
# Generate a secure random JWT secret (32 bytes = 64 hex chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

#### Step 2: Create Local `.env` Files

**At Project Root** (`.env`):
```bash
# Copy from .env.example and update values
cp .env.example .env

# Edit .env with your local database URL and secrets
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu"
JWT_SECRET="<PASTE_YOUR_GENERATED_SECRET_HERE>"
NODE_ENV="development"
LOG_LEVEL="debug"
CORS_ORIGIN="http://localhost:5173"
```

**Community API** (`services/community/.env`):
```bash
cp services/community/.env.example services/community/.env

# Update with same JWT_SECRET as root .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu?schema=community"
JWT_SECRET="<SAME_SECRET_AS_ROOT>"
PORT=3001
```

**Marketplace API** (`services/marketplace/.env`):
```bash
cp services/marketplace/.env.example services/marketplace/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu?schema=marketplace"
JWT_SECRET="<SAME_SECRET_AS_ROOT>"
PORT=3002
```

**Academy API** (`services/academy/.env`):
```bash
cp services/academy/.env.example services/academy/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu?schema=academy"
JWT_SECRET="<SAME_SECRET_AS_ROOT>"
PORT=3003
```

**Business API** (`services/business/.env`):
```bash
cp services/business/.env.example services/business/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/iamenu?schema=business"
JWT_SECRET="<SAME_SECRET_AS_ROOT>"
PORT=3004
```

#### Step 3: Verify Setup

```bash
# All .env files should NOT be in git
git status | grep ".env"
# Should show no results (all .env files ignored)

# Verify .env.example files ARE in git
git ls-files | grep ".env.example"
# Should show .env.example files
```

---

## 🔑 Managing Secrets in Production

### Environment Variables Management

For **production deployments**, use your hosting platform's secrets management:

- **Railway**: Use [Railway Variables](https://docs.railway.app/develop/variables)
- **Vercel**: Use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- **Docker**: Use secrets in `docker-compose.yml`:
  ```yaml
  services:
    community-api:
      environment:
        DATABASE_URL: ${DATABASE_URL}
        JWT_SECRET: ${JWT_SECRET}
  ```
- **Kubernetes**: Use [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

### Secret Rotation Policy

1. **Generate new JWT_SECRET every 6 months**
2. **Rotate database passwords after any security incident**
3. **Revoke leaked API keys immediately**
4. **Update all services simultaneously** to avoid inconsistencies

---

## 📋 Security Checklist

### Before Committing Code

- [ ] No `.env` files in `git status`
- [ ] No credentials in code or comments
- [ ] No API keys in logs
- [ ] No database passwords in error messages

### Before Deployment

- [ ] JWT_SECRET is unique (generate new one for each environment)
- [ ] DATABASE_URL points to correct environment database
- [ ] All services use same JWT_SECRET
- [ ] CORS_ORIGIN matches frontend URL
- [ ] No hardcoded API keys in source code

### Before Production Release

- [ ] All secrets stored in platform's secrets manager
- [ ] Database backups configured
- [ ] Rate limiting enabled
- [ ] Error handling doesn't expose credentials
- [ ] Logs don't contain sensitive data

---

## 🛑 What Was Fixed

### Removed Exposed Credentials

The following files contained production database credentials and have been **removed**:

```
❌ .env (with JWT_SECRET: "T9NTWid03o5sBTtL")
❌ services/community/.env.railway.backup
❌ .env files from all services
```

**Production Database Credentials Removed:**
```
❌ Database: gondola.proxy.rlwy.net:59722
❌ Password: jMHJNsoKMsXCjuuHNJTouoWqrvzgYyRn
❌ All backup files with credentials
```

### Added `.env` to `.gitignore`

All `.env*` backup files now ignored:
```gitignore
.env.*.backup
.env.*.bak
.env.local
.env.production
```

### Created Template Files

Safe `.env.example` files with **PLACEHOLDERS ONLY**:
```
✅ .env.example (root)
✅ services/community/.env.example
✅ services/marketplace/.env.example
✅ services/academy/.env.example
✅ services/business/.env.example
```

---

## 🚨 If You Accidentally Committed Secrets

### Immediate Actions

1. **Regenerate all secrets immediately**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Notify team members**
   - "Secret may be exposed in git history"
   - "Rotate JWT_SECRET and database password"

3. **Update deployed services**
   - Set new JWT_SECRET in all environments
   - Restart all services

4. **Remove from git history** (if still there):
   ```bash
   # Warning: This rewrites history. Coordinate with team!
   git filter-branch --tree-filter 'rm -f .env' HEAD
   git push origin main --force
   ```

### Prevention for Future

- Pre-commit hook to prevent `.env` commits (add to `.git/hooks/pre-commit`):
  ```bash
  #!/bin/bash
  if git diff --cached --name-only | grep -E '\.env$|\.env\.[a-z]+$'; then
    echo "❌ ERROR: Attempting to commit .env file!"
    echo "   .env files should NEVER be committed."
    exit 1
  fi
  ```

---

## 📚 Additional Resources

- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12-Factor App - Store config in environment](https://12factor.net/config)
- [Node.js dotenv Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## ✅ Verification

After completing setup, verify everything works:

```bash
# 1. Check that .env files are ignored
git status
# Result: .env files should NOT appear

# 2. Check database connection (from any service directory)
npm run prisma:generate
# Result: Prisma client should generate successfully

# 3. Start services
npm run dev
# Result: All services should start on correct ports
```

---

**🔒 This project is now configured for secure development and deployment.**

For questions about secrets management, ask your team lead or DevOps engineer.
