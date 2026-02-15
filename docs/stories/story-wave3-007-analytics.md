# Story 3.7: Add Analytics & Reporting

**ID:** STORY-003.7
**Type:** 📊 Analytics (Medium)
**Epic:** AIOS-PHASE3-ENHANCEMENT (Wave 3)
**Priority:** HIGH
**Assigned to:** @dev + @architect
**Status:** 🟡 Ready for Development
**Created:** 2026-02-13
**Estimated Time:** 10 hours

---

## 📝 Story Description

Implement analytics dashboard with key business metrics (DAU, MAU, revenue, engagement, retention). Support data export (CSV/PDF) and scheduled reports. This provides visibility into product health and business metrics.

**Acceptance Criteria:**
- [ ] Daily Active Users (DAU) metric calculated
- [ ] Monthly Active Users (MAU) metric calculated
- [ ] Total Revenue tracked and aggregated
- [ ] Revenue by service/supplier tracked
- [ ] User Acquisition metrics available
- [ ] Engagement metrics (posts, likes, comments)
- [ ] Retention cohorts calculated
- [ ] Churn rate analysis available
- [ ] CSV export working for all reports
- [ ] PDF report generation working
- [ ] Scheduled reports sent (daily/weekly/monthly)
- [ ] All data accurate (within 5 minutes)
- [ ] Dashboard accessible to admins only
- [ ] RLS enforced (each supplier sees own data)
- [ ] All tests passing
- [ ] CodeRabbit review passed

---

## 🔧 Technical Details

**Key Reports:**
1. Executive Dashboard - KPIs at a glance
2. User Growth - DAU, MAU, acquisition
3. Revenue Report - Total, by service, by supplier
4. Engagement Report - Posts, likes, comments, follows
5. Retention Cohorts - User retention over time

**Data Sources:**
- DAU/MAU from user sessions
- Revenue from orders table
- Engagement from posts, comments, likes
- Retention from enrollment dates

**Dependencies:** Story 2.1 (RLS), Story 3.1 (Caching), Story 3.6 (Payments), Story 3.4 (Notifications)
**Blocks:** Story 3.10 (Admin Dashboard - includes analytics display)

---

## 📊 Timeline & Estimation

**Estimated Time:** 10 hours
**Complexity:** Medium

---

## 📋 File List (To be updated)

- [ ] `services/business/src/services/analytics.service.ts`
- [ ] `services/business/src/routes/analytics.routes.ts`
- [ ] `services/business/src/lib/report-generator.ts`
- [ ] `services/business/tests/analytics.integration.test.ts`
- [ ] `docs/features/analytics.md`

---

**Created by:** River (Scrum Master) 🌊
