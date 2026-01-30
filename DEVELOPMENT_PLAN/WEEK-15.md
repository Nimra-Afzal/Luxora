# Week 15: Order Management

> **Phase:** Payments & Orders (Week 15 of 16)
> **Focus:** Build order management for customers and admin

---

## Week 15 Summary

Create order history for customers and order management dashboard for admin with status updates and shipping.

---

## Day 1 (Monday): Customer Order Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create order controller | ADD | `backend/src/controllers/order.controller.ts` |
| 1.2 | Add route: `GET /api/v1/orders` - get user's orders (auth required) | ADD | `backend/src/routes/order.routes.ts` |
| 1.3 | Add route: `GET /api/v1/orders/:orderNumber` - get single order (auth required, owner only) | ADD | `backend/src/routes/order.routes.ts` |
| 1.4 | Add route: `POST /api/v1/orders/:orderNumber/cancel` - cancel order (if status allows) | ADD | `backend/src/routes/order.routes.ts` |
| 1.5 | Add order filtering: by status, date range | ADD | `backend/src/services/order.service.ts` |
| 1.6 | Mount order routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 2 (Tuesday): Admin Order Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add route: `GET /api/v1/admin/orders` - list all orders (admin) | ADD | `backend/src/routes/order.routes.ts` |
| 2.2 | Add route: `GET /api/v1/admin/orders/:id` - get any order (admin) | ADD | `backend/src/routes/order.routes.ts` |
| 2.3 | Add route: `PUT /api/v1/admin/orders/:id/status` - update order status (admin) | ADD | `backend/src/routes/order.routes.ts` |
| 2.4 | Add route: `POST /api/v1/admin/orders/:id/ship` - mark as shipped, add tracking (admin) | ADD | `backend/src/routes/order.routes.ts` |
| 2.5 | Add route: `POST /api/v1/admin/orders/:id/deliver` - mark as delivered (admin) | ADD | `backend/src/routes/order.routes.ts` |
| 2.6 | Add `updateOrderStatus()` with status transition validation | ADD | `backend/src/services/order.service.ts` |

---

## Day 3 (Wednesday): Frontend - Customer Orders

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create orderSlice with state: orders, currentOrder, loading, error | ADD | `frontend/redux/features/orderSlice.ts` |
| 3.2 | Add thunks: `fetchOrders`, `fetchOrderByNumber`, `cancelOrder` | ADD | `frontend/redux/features/orderSlice.ts` |
| 3.3 | Create orders list page in dashboard | ADD | `frontend/app/dashboard/orders/page.tsx` |
| 3.4 | Create OrderCard component (shows order summary, status badge) | ADD | `frontend/components/OrderCard.tsx` |
| 3.5 | Create order detail page | ADD | `frontend/app/dashboard/orders/[orderNumber]/page.tsx` |
| 3.6 | Add "Orders" menu item in dashboard sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |

---

## Day 4 (Thursday): Frontend - Admin Orders

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create admin orders page with filters (status, date) | ADD | `frontend/app/dashboard/admin/orders/page.tsx` |
| 4.2 | Create admin order detail page | ADD | `frontend/app/dashboard/admin/orders/[id]/page.tsx` |
| 4.3 | Add status update dropdown in admin order detail | ADD | `frontend/app/dashboard/admin/orders/[id]/page.tsx` |
| 4.4 | Add shipping form (tracking number, carrier) | ADD | `frontend/components/admin/ShippingForm.tsx` |
| 4.5 | Add "Manage Orders" menu item in admin sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |

---

## Day 5 (Friday): Order Status & Timeline

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create OrderStatusBadge component (colored badge based on status) | ADD | `frontend/components/OrderStatusBadge.tsx` |
| 5.2 | Create OrderTimeline component (shows status history) | ADD | `frontend/components/OrderTimeline.tsx` |
| 5.3 | Add status history tracking to Order model: `statusHistory[]` with status, date, note | MODIFY | `backend/src/models/Order.model.ts` |
| 5.4 | Update status change to add entry to history | MODIFY | `backend/src/services/order.service.ts` |
| 5.5 | Add tracking link in order detail (if shipped) | MODIFY | `frontend/app/dashboard/orders/[orderNumber]/page.tsx` |
| 5.6 | Test: Customer can view orders | TEST | - |
| 5.7 | Test: Admin can update order status | TEST | - |
| 5.8 | Test: Order timeline shows history | TEST | - |

---

## Week 15 Checklist

- [ ] Customer order list endpoint
- [ ] Customer order detail endpoint
- [ ] Order cancellation working
- [ ] Admin order list with filters
- [ ] Admin can update status
- [ ] Admin can add tracking
- [ ] Customer orders page
- [ ] Admin orders page
- [ ] Order status badges
- [ ] Order timeline component

---

**Next Week:** Week 16 - Emails & Invoices
