# Week 14: Checkout Flow

> **Phase:** Payments & Orders (Week 14 of 16)
> **Focus:** Build complete multi-step checkout process

---

## Week 14 Summary

Create a complete checkout flow: Cart → Shipping → Payment → Confirmation.

---

## Day 1 (Monday): Order Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create order service with methods: `create`, `getById`, `getByOrderNumber`, `getUserOrders`, `updateStatus` | ADD | `backend/src/services/order.service.ts` |
| 1.2 | Add `createFromCart()` - creates order from cart data with product snapshots | ADD | `backend/src/services/order.service.ts` |
| 1.3 | Add `generateOrderNumber()` - generates unique order number (ORD-XXXXXX) | ADD | `backend/src/services/order.service.ts` |
| 1.4 | Add `reserveInventory()` - decrements product stock on order creation | ADD | `backend/src/services/order.service.ts` |
| 1.5 | Add `releaseInventory()` - restores stock on order cancellation | ADD | `backend/src/services/order.service.ts` |

---

## Day 2 (Tuesday): Checkout Complete Endpoint

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add `completeCheckout()` to checkout controller | ADD | `backend/src/controllers/checkout.controller.ts` |
| 2.2 | Add route: `POST /api/v1/checkout/complete` - finalizes order after payment | ADD | `backend/src/routes/checkout.routes.ts` |
| 2.3 | Complete checkout flow: validate → create order → clear cart → return order | ADD | `backend/src/controllers/checkout.controller.ts` |
| 2.4 | Link order to Stripe payment intent ID | ADD | `backend/src/services/order.service.ts` |
| 2.5 | Update webhook to update order status when payment succeeds/fails | MODIFY | `backend/src/controllers/webhook.controller.ts` |

---

## Day 3 (Wednesday): Frontend - Checkout Pages

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create checkout layout with steps indicator | ADD | `frontend/app/checkout/layout.tsx` |
| 3.2 | Create Step 1: Shipping address page | ADD | `frontend/app/checkout/shipping/page.tsx` |
| 3.3 | Create Step 2: Shipping method page | ADD | `frontend/app/checkout/delivery/page.tsx` |
| 3.4 | Create Step 3: Payment page | ADD | `frontend/app/checkout/payment/page.tsx` |
| 3.5 | Create Step 4: Review & confirm page | ADD | `frontend/app/checkout/review/page.tsx` |
| 3.6 | Create CheckoutSteps component (progress indicator) | ADD | `frontend/components/CheckoutSteps.tsx` |

---

## Day 4 (Thursday): Frontend - Checkout Flow

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Add checkout navigation logic (next/back between steps) | MODIFY | `frontend/redux/features/checkoutSlice.ts` |
| 4.2 | Add step validation (can't proceed without completing previous step) | MODIFY | `frontend/app/checkout/` pages |
| 4.3 | Create OrderSummary sidebar component (shows items, totals) | ADD | `frontend/components/OrderSummary.tsx` |
| 4.4 | Add `completeCheckout` thunk - calls complete endpoint | ADD | `frontend/redux/features/checkoutSlice.ts` |
| 4.5 | Handle successful checkout - redirect to confirmation | MODIFY | `frontend/app/checkout/payment/page.tsx` |

---

## Day 5 (Friday): Order Confirmation & Guest Checkout

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create order confirmation page | ADD | `frontend/app/checkout/confirmation/page.tsx` |
| 5.2 | Show order number, items, totals on confirmation | ADD | `frontend/app/checkout/confirmation/page.tsx` |
| 5.3 | Add guest checkout option (email required, no account) | MODIFY | `frontend/app/checkout/shipping/page.tsx` |
| 5.4 | Store guest email in checkout state | MODIFY | `frontend/redux/features/checkoutSlice.ts` |
| 5.5 | Clear checkout state after successful order | MODIFY | `frontend/redux/features/checkoutSlice.ts` |
| 5.6 | Test: Complete checkout as logged-in user | TEST | - |
| 5.7 | Test: Complete checkout as guest | TEST | - |
| 5.8 | Test: Order created with correct data | TEST | - |

---

## Week 14 Checklist

- [ ] Order service created
- [ ] Order creation from cart working
- [ ] Inventory reserved on order
- [ ] Checkout complete endpoint working
- [ ] Checkout pages created (4 steps)
- [ ] Step navigation working
- [ ] Order summary sidebar
- [ ] Order confirmation page
- [ ] Guest checkout working
- [ ] End-to-end checkout tested

---

**Next Week:** Week 15 - Order Management
