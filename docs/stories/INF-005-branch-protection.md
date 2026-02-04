# INF-005: GitHub Branch Protection Rules

**Priority:** P2 - MEDIUM
**Estimated Hours:** 1h
**Owner:** @devops
**Sprint:** Infrastructure P1
**Status:** Ready
**Depends On:** INF-001

---

## Story Statement

**As a** team lead,
**I want** branch protection rules on main,
**So that** code can't be pushed directly without PR review and CI passing.

---

## Acceptance Criteria

- [ ] **AC1:** Direct push to main blocked
- [ ] **AC2:** PRs require CI to pass
- [ ] **AC3:** PRs require at least 1 approval (optional for solo dev)
- [ ] **AC4:** Force push to main blocked
- [ ] **AC5:** Branch deletion of main blocked

---

## Tasks

- [ ] **Task 1:** Configure branch protection via GitHub UI or CLI
- [ ] **Task 2:** Enable required status checks (lint, test, build)
- [ ] **Task 3:** Document PR workflow

---

## GitHub CLI Commands

```bash
# Enable branch protection
gh api repos/{owner}/{repo}/branches/main/protection -X PUT -f required_status_checks='{"strict":true,"contexts":["lint","test","build"]}' -f enforce_admins=true -f required_pull_request_reviews='{"required_approving_review_count":1}'
```

---

## Definition of Done

- [ ] Branch protection enabled
- [ ] CI checks required for merge
- [ ] Team informed of new workflow

---

**Created:** 2026-02-04
**Sprint:** Infrastructure P1
