# Week 20: Analytics Dashboard

> **Phase:** Advanced Features (Week 20 of 20)
> **Focus:** Build analytics and reporting dashboard for admin

---

## Week 20 Summary

Create admin analytics dashboard with sales reports, product performance, and customer insights.

---

## Day 1 (Monday): Analytics Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create analytics service with methods for aggregating data | ADD | `backend/src/services/analytics.service.ts` |
| 1.2 | Add `getSalesOverview()` - total revenue, orders, average order value | ADD | `backend/src/services/analytics.service.ts` |
| 1.3 | Add `getSalesByPeriod()` - daily/weekly/monthly sales data for charts | ADD | `backend/src/services/analytics.service.ts` |
| 1.4 | Add `getTopProducts()` - best selling products by quantity/revenue | ADD | `backend/src/services/analytics.service.ts` |
| 1.5 | Add `getTopCategories()` - best performing categories | ADD | `backend/src/services/analytics.service.ts` |
| 1.6 | Add `getCustomerStats()` - new customers, returning customers | ADD | `backend/src/services/analytics.service.ts` |

---

## Day 2 (Tuesday): Analytics Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create analytics controller | ADD | `backend/src/controllers/analytics.controller.ts` |
| 2.2 | Add route: `GET /api/v1/admin/analytics/overview` - dashboard summary stats | ADD | `backend/src/routes/analytics.routes.ts` |
| 2.3 | Add route: `GET /api/v1/admin/analytics/sales` - sales data with date range | ADD | `backend/src/routes/analytics.routes.ts` |
| 2.4 | Add route: `GET /api/v1/admin/analytics/products` - product performance | ADD | `backend/src/routes/analytics.routes.ts` |
| 2.5 | Add route: `GET /api/v1/admin/analytics/customers` - customer metrics | ADD | `backend/src/routes/analytics.routes.ts` |
| 2.6 | Add route: `GET /api/v1/admin/analytics/orders` - order metrics by status | ADD | `backend/src/routes/analytics.routes.ts` |
| 2.7 | Mount analytics routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Report Export

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Install CSV export: `npm install json2csv` | ADD | `backend/package.json` |
| 3.2 | Create report service with export methods | ADD | `backend/src/services/report.service.ts` |
| 3.3 | Add route: `GET /api/v1/admin/reports/sales/export` - export sales as CSV | ADD | `backend/src/routes/analytics.routes.ts` |
| 3.4 | Add route: `GET /api/v1/admin/reports/orders/export` - export orders as CSV | ADD | `backend/src/routes/analytics.routes.ts` |
| 3.5 | Add route: `GET /api/v1/admin/reports/customers/export` - export customers as CSV | ADD | `backend/src/routes/analytics.routes.ts` |
| 3.6 | Add date range filter to all export endpoints | MODIFY | `backend/src/controllers/analytics.controller.ts` |

---

## Day 4 (Thursday): Frontend - Dashboard Overview

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create analyticsSlice with state for all metrics | ADD | `frontend/redux/features/analyticsSlice.ts` |
| 4.2 | Add thunks: `fetchOverview`, `fetchSales`, `fetchProductPerformance`, `fetchCustomerStats` | ADD | `frontend/redux/features/analyticsSlice.ts` |
| 4.3 | Modify admin dashboard home to show overview stats (cards) | MODIFY | `frontend/app/dashboard/page.tsx` |
| 4.4 | Create StatCard component (icon, label, value, trend) | ADD | `frontend/components/StatCard.tsx` |
| 4.5 | Add recent orders list to dashboard | MODIFY | `frontend/app/dashboard/page.tsx` |
| 4.6 | Add low stock alerts widget to dashboard | MODIFY | `frontend/app/dashboard/page.tsx` |

---

## Day 5 (Friday): Frontend - Charts & Reports

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create analytics page with charts | ADD | `frontend/app/dashboard/analytics/page.tsx` |
| 5.2 | Add sales line chart (using recharts - already installed) | ADD | `frontend/app/dashboard/analytics/page.tsx` |
| 5.3 | Add orders by status pie chart | ADD | `frontend/app/dashboard/analytics/page.tsx` |
| 5.4 | Add top products bar chart | ADD | `frontend/app/dashboard/analytics/page.tsx` |
| 5.5 | Add date range picker for filtering | ADD | `frontend/components/DateRangePicker.tsx` |
| 5.6 | Add export buttons (CSV download) | ADD | `frontend/app/dashboard/analytics/page.tsx` |
| 5.7 | Add "Analytics" menu item in admin sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |
| 5.8 | Test: All metrics display correctly | TEST | - |
| 5.9 | Test: CSV exports work | TEST | - |

---

## Week 20 Checklist

- [ ] Analytics service created
- [ ] Sales overview endpoint
- [ ] Sales by period endpoint
- [ ] Top products endpoint
- [ ] Customer stats endpoint
- [ ] CSV export working
- [ ] Dashboard overview cards
- [ ] Sales chart
- [ ] Orders pie chart
- [ ] Top products chart
- [ ] Date range filtering
- [ ] Export functionality

---

**Phase 5 Complete!**

**Next Week:** Week 21 - SEO & Performance
