# Windows Build Issue: Prisma DLL Lock

**Date:** 2026-02-16
**Status:** ⚠️ KNOWN ISSUE - Workaround Available
**Affects:** `npm run build` in Community, potentially other services
**Root Cause:** Windows file permission issue with Prisma query engine DLL

---

## Problem Description

When running `npm run build` on Windows, the script fails during Prisma code generation:

```
Error: EPERM: operation not permitted, rename
'C:\Users\...\generated\prisma\query_engine-windows.dll.node.tmp25488'
-> 'C:\Users\...\generated\prisma\query_engine-windows.dll.node'
```

This happens because Prisma tries to rename a temporary DLL file after generation, but Windows blocks the operation.

---

## Root Causes (Investigated)

### 1. ✅ FIXED: Orphaned .tmp files
**Status:** Resolved in 2026-02-16
- Multiple `.tmp` files from failed previous attempts
- Solution: Delete all `*.tmp*` files and regenerate

### 2. ⚠️ PERSISTENT: DLL file locking
**Status:** Not fully resolved - likely Windows/Antivirus related
- Windows or Antivirus (Windows Defender) may be locking the DLL
- File permissions issue on file rename operation
- Intermittent - sometimes works, sometimes fails

### 3. ⚠️ POSSIBLE: Prisma version mismatch
- Current: v5.22.0
- Available: v7.4.0 (major upgrade)
- May indicate incompatibility or known issue in v5.22.0

---

## Workaround (Tested & Working)

Instead of running `npm run build` which includes `prisma generate && tsc`:

```bash
# WORKAROUND: Generate once, compile after
npx prisma generate
npx tsc

# OR: Skip Prisma regen if already generated
npx tsc

# Result: dist/ is created successfully
```

**Why this works:**
- Prisma cache persists after first successful `prisma generate`
- TypeScript only needs the generated Prisma client (`generated/prisma/`)
- Subsequent builds can skip `prisma generate` if schema hasn't changed

---

## Solutions to Try (Priority Order)

### 1. Disable Windows Defender for this directory (Not recommended)
```powershell
# Add exclusion (as Admin)
Add-MpPreference -ExclusionPath "C:\Users\XPS\Documents\iamenu-ecosystem\services\community\generated"
```

### 2. Upgrade Prisma to latest version
```bash
npm install -D prisma@latest
npm install @prisma/client@latest
```

### 3. Update package.json build script (Workaround)
```json
{
  "scripts": {
    "build": "npx tsc",
    "prisma:generate": "prisma generate",
    "build:full": "npm run prisma:generate && npm run build"
  }
}
```

Then require developers to run:
```bash
npm run prisma:generate  # Once per schema change
npm run build            # Regular builds
```

### 4. Run in WSL (Windows Subsystem for Linux)
```bash
# Inside WSL Ubuntu
cd /mnt/c/Users/XPS/Documents/iamenu-ecosystem
npm run build  # Often works better in Linux environment
```

### 5. Use Docker for builds (Most reliable)
```bash
docker run -it -v $(pwd):/app node:18 bash
cd /app/services/community
npm run build
```

---

## Impact Assessment

| Component | Impact | Severity |
|-----------|--------|----------|
| Local development | Can work around with `npx tsc` | 🟡 Medium |
| Railway CI/CD | Build failed 19 min ago (2026-02-16 02:07) | 🔴 High |
| `npm run dev` | Still works (doesn't call build) | 🟢 Low |
| TypeScript compilation | Works fine with `npx tsc` | 🟢 Low |

---

## Investigation Timeline

- **2026-02-12:** Prisma DLL .tmp files start accumulating
- **2026-02-15:** Build errors cascade on Railway
- **2026-02-16 02:07:** Railway shows "Build failed 19 minutes ago"
- **2026-02-16 02:09:** Root cause identified (Prisma Windows lock issue)
- **2026-02-16 02:10:** TypeScript compilation validated as working

---

## Permanent Fix Needed (Future)

This requires one of:
1. **Upgrade Prisma** to v7.4.0+ (may fix in newer version)
2. **Switch to Docker-based builds** for CI/CD reliability
3. **Modify build pipeline** to use WSL for Windows machines
4. **Investigate Antivirus** interaction with Prisma

---

## Related

- Commit: `95cee68` - TypeScript type error fix
- Commit: `57976e5` - Governance protocol implementation (predecessor)
- Investigated: Decimal type issues, RLS issues (not related to build)

---

## Next Steps

1. Monitor if issue recurs in next build
2. Test Prisma v7 upgrade in feature branch
3. Consider Docker-based CI/CD for Windows compatibility
4. Document in team wiki if persistent

---

**Last Updated:** 2026-02-16 02:10 UTC
**Status:** Workaround available, permanent fix pending
**Priority:** Medium (development continues with workaround)
