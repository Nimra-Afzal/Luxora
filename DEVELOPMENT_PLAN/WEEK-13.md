# Week 13: Stripe Integration

> **Phase:** Payments & Orders (Week 13 of 16)
> **Focus:** Integrate Stripe for payment processing

---

## Week 13 Summary

Set up Stripe payment integration with Payment Intents API for secure checkout.

---

## Day 1 (Monday): Stripe Setup

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Install Stripe: `npm install stripe` | ADD | `backend/package.json` |
| 1.2 | Create Stripe config with API keys | ADD | `backend/src/config/stripe.config.ts` |
| 1.3 | Add Stripe environment variables: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | MODIFY | `backend/.env` |
| 1.4 | Create Stripe service with method: `createPaymentIntent` | ADD | `backend/src/services/stripe.service.ts` |
| 1.5 | Add `confirmPayment()` method - updates payment intent status | ADD | `backend/src/services/stripe.service.ts` |
| 1.6 | Add `createRefund()` method - processes refund via Stripe | ADD | `backend/src/services/stripe.service.ts` |

---

## Day 2 (Tuesday): Payment Intent Endpoint

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add payment service method: `createPaymentIntent` - creates intent with order amount | ADD | `backend/src/services/payment.service.ts` |
| 2.2 | Add payment controller | ADD | `backend/src/controllers/payment.controller.ts` |
| 2.3 | Add route: `POST /api/v1/checkout/create-payment-intent` - creates Stripe payment intent | ADD | `backend/src/routes/checkout.routes.ts` |
| 2.4 | Return `clientSecret` for frontend Stripe Elements | ADD | `backend/src/controllers/payment.controller.ts` |
| 2.5 | Store payment intent ID in session/cart for reference | MODIFY | `backend/src/services/payment.service.ts` |

---

## Day 3 (Wednesday): Stripe Webhooks

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create webhook controller | ADD | `backend/src/controllers/webhook.controller.ts` |
| 3.2 | Add route: `POST /api/v1/webhooks/stripe` - Stripe webhook endpoint | ADD | `backend/src/routes/webhook.routes.ts` |
| 3.3 | Add webhook signature verification | ADD | `backend/src/controllers/webhook.controller.ts` |
| 3.4 | Handle `payment_intent.succeeded` event - mark payment as completed | ADD | `backend/src/controllers/webhook.controller.ts` |
| 3.5 | Handle `payment_intent.payment_failed` event - mark payment as failed | ADD | `backend/src/controllers/webhook.controller.ts` |
| 3.6 | Add raw body parser for webhook route (required for signature verification) | MODIFY | `backend/src/app.ts` or `server.ts` |
| 3.7 | Mount webhook routes (before JSON parser) | MODIFY | `backend/src/routes/index.ts` |

---

## Day 4 (Thursday): Frontend Stripe Setup

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Install Stripe React: `npm install @stripe/stripe-js @stripe/react-stripe-js` | ADD | `frontend/package.json` |
| 4.2 | Create Stripe provider wrapper | ADD | `frontend/components/StripeProvider.tsx` |
| 4.3 | Add Stripe publishable key to frontend env: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ADD | `frontend/.env.local` |
| 4.4 | Create PaymentForm component with Stripe Elements (CardElement) | ADD | `frontend/components/PaymentForm.tsx` |
| 4.5 | Add payment thunk: `createPaymentIntent` - calls backend to get clientSecret | ADD | `frontend/redux/features/checkoutSlice.ts` |

---

## Day 5 (Friday): Payment Flow Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create test payment page (temporary) for testing Stripe integration | ADD | `frontend/app/test-payment/page.tsx` |
| 5.2 | Test payment flow with Stripe test cards | TEST | - |
| 5.3 | Test webhook receives events (use Stripe CLI: `stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe`) | TEST | - |
| 5.4 | Test failed payment handling | TEST | - |
| 5.5 | Add error handling for card declines | MODIFY | `frontend/components/PaymentForm.tsx` |
| 5.6 | Add loading states during payment processing | MODIFY | `frontend/components/PaymentForm.tsx` |

---

## Week 13 Checklist

- [ ] Stripe SDK installed
- [ ] Stripe config created
- [ ] Payment intent endpoint working
- [ ] Webhook endpoint working
- [ ] Webhook signature verification
- [ ] payment_intent.succeeded handled
- [ ] payment_intent.payment_failed handled
- [ ] Frontend Stripe Elements working
- [ ] Test payments successful

---

**Next Week:** Week 14 - Checkout Flow
