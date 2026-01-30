# Week 18: Returns & Refunds

> **Phase:** Advanced Features (Week 18 of 20)
> **Focus:** Implement return request system and Stripe refunds

---

## Week 18 Summary

Build return request workflow and integrate Stripe refunds for order cancellations and returns.

---

## Day 1 (Monday): Return Model & Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create Return model: `order` (ref), `items[]`, `reason`, `status` (pending/approved/rejected/completed), `refundAmount`, `refundId`, `customerNotes`, `adminNotes`, timestamps | ADD | `backend/src/models/Return.model.ts` |
| 1.2 | Create return service with methods: `create`, `getById`, `getUserReturns`, `updateStatus`, `approve`, `reject` | ADD | `backend/src/services/return.service.ts` |
| 1.3 | Add `calculateRefundAmount()` - calculates refund for returned items | ADD | `backend/src/services/return.service.ts` |
| 1.4 | Add return model to index | MODIFY | `backend/src/models/index.ts` |

---

## Day 2 (Tuesday): Return Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create return controller | ADD | `backend/src/controllers/return.controller.ts` |
| 2.2 | Add route: `POST /api/v1/orders/:orderNumber/return` - create return request (auth, owner) | ADD | `backend/src/routes/return.routes.ts` |
| 2.3 | Add route: `GET /api/v1/returns` - get user's returns (auth) | ADD | `backend/src/routes/return.routes.ts` |
| 2.4 | Add route: `GET /api/v1/returns/:id` - get return details (auth, owner) | ADD | `backend/src/routes/return.routes.ts` |
| 2.5 | Add validation: order must be delivered, within return window (e.g., 30 days) | ADD | `backend/src/services/return.service.ts` |
| 2.6 | Mount return routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Admin Returns & Stripe Refunds

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Add route: `GET /api/v1/admin/returns` - list all returns (admin) | ADD | `backend/src/routes/return.routes.ts` |
| 3.2 | Add route: `PUT /api/v1/admin/returns/:id/approve` - approve return (admin) | ADD | `backend/src/routes/return.routes.ts` |
| 3.3 | Add route: `PUT /api/v1/admin/returns/:id/reject` - reject return (admin) | ADD | `backend/src/routes/return.routes.ts` |
| 3.4 | Add route: `POST /api/v1/admin/returns/:id/refund` - process refund via Stripe (admin) | ADD | `backend/src/routes/return.routes.ts` |
| 3.5 | Integrate `createRefund()` from Stripe service when processing refund | MODIFY | `backend/src/services/return.service.ts` |
| 3.6 | Update order status to `refunded` or `partially_refunded` after refund | MODIFY | `backend/src/services/return.service.ts` |
| 3.7 | Restore inventory for returned items | MODIFY | `backend/src/services/return.service.ts` |

---

## Day 4 (Thursday): Frontend - Customer Returns

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create returnSlice with state: returns, currentReturn, loading, error | ADD | `frontend/redux/features/returnSlice.ts` |
| 4.2 | Add thunks: `createReturn`, `fetchReturns`, `fetchReturnById` | ADD | `frontend/redux/features/returnSlice.ts` |
| 4.3 | Create ReturnForm component (select items, reason, notes) | ADD | `frontend/components/ReturnForm.tsx` |
| 4.4 | Add "Request Return" button on delivered order detail page | MODIFY | `frontend/app/dashboard/orders/[orderNumber]/page.tsx` |
| 4.5 | Create returns list page | ADD | `frontend/app/dashboard/returns/page.tsx` |
| 4.6 | Create return detail page | ADD | `frontend/app/dashboard/returns/[id]/page.tsx` |

---

## Day 5 (Friday): Admin Returns UI & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create admin returns list page | ADD | `frontend/app/dashboard/admin/returns/page.tsx` |
| 5.2 | Create admin return detail page with approve/reject/refund buttons | ADD | `frontend/app/dashboard/admin/returns/[id]/page.tsx` |
| 5.3 | Add "Returns" menu item in admin sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |
| 5.4 | Add return status badge component | ADD | `frontend/components/ReturnStatusBadge.tsx` |
| 5.5 | Send email notification when return is approved/rejected | MODIFY | `backend/src/services/return.service.ts` |
| 5.6 | Test: Customer can request return | TEST | - |
| 5.7 | Test: Admin can approve/reject return | TEST | - |
| 5.8 | Test: Stripe refund processes correctly | TEST | - |
| 5.9 | Test: Inventory restored after return | TEST | - |

---

## Week 18 Checklist

- [ ] Return model created
- [ ] Return service created
- [ ] Return request endpoint working
- [ ] Return validation (delivery, window)
- [ ] Admin return management
- [ ] Stripe refund integration
- [ ] Order status updates on refund
- [ ] Inventory restoration
- [ ] Customer return UI
- [ ] Admin return UI
- [ ] Email notifications

---

**Next Week:** Week 19 - Customer Support
