# Week 12: Tax & Pre-Checkout

> **Phase:** Shopping Experience (Week 12 of 12)
> **Focus:** Implement tax calculation and prepare checkout validation

---

## Week 12 Summary

Build tax calculation system and checkout validation to prepare for payment integration.

---

## Day 1 (Monday): Tax Configuration

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create TaxRate model: `name`, `country`, `state` (optional), `rate` (percentage), `isDefault`, `isActive` | ADD | `backend/src/models/TaxRate.model.ts` |
| 1.2 | Create tax service with methods: `getTaxRates`, `getTaxRateForAddress`, `calculateTax` | ADD | `backend/src/services/tax.service.ts` |
| 1.3 | Add `calculateTax()` - calculates tax based on address and subtotal | ADD | `backend/src/services/tax.service.ts` |
| 1.4 | Add tax model to index | MODIFY | `backend/src/models/index.ts` |

---

## Day 2 (Tuesday): Tax Endpoints & Admin

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create tax controller | ADD | `backend/src/controllers/tax.controller.ts` |
| 2.2 | Add route: `POST /api/v1/tax/calculate` - calculate tax for address + amount | ADD | `backend/src/routes/tax.routes.ts` |
| 2.3 | Add route: `GET /api/v1/admin/tax-rates` - list all tax rates (admin) | ADD | `backend/src/routes/tax.routes.ts` |
| 2.4 | Add route: `POST /api/v1/admin/tax-rates` - create tax rate (admin) | ADD | `backend/src/routes/tax.routes.ts` |
| 2.5 | Add route: `PUT /api/v1/admin/tax-rates/:id` - update tax rate (admin) | ADD | `backend/src/routes/tax.routes.ts` |
| 2.6 | Add route: `DELETE /api/v1/admin/tax-rates/:id` - delete tax rate (admin) | ADD | `backend/src/routes/tax.routes.ts` |
| 2.7 | Mount tax routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Checkout Validation Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create checkout service with method: `validateCheckout` | ADD | `backend/src/services/checkout.service.ts` |
| 3.2 | Add validation: cart is not empty | ADD | `backend/src/services/checkout.service.ts` |
| 3.3 | Add validation: all products are in stock | ADD | `backend/src/services/checkout.service.ts` |
| 3.4 | Add validation: prices haven't changed since added to cart | ADD | `backend/src/services/checkout.service.ts` |
| 3.5 | Add validation: shipping address is provided | ADD | `backend/src/services/checkout.service.ts` |
| 3.6 | Add validation: shipping method is selected | ADD | `backend/src/services/checkout.service.ts` |
| 3.7 | Add `calculateOrderTotals()` - returns subtotal, shipping, tax, total | ADD | `backend/src/services/checkout.service.ts` |

---

## Day 4 (Thursday): Checkout Validation Endpoint

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create checkout controller | ADD | `backend/src/controllers/checkout.controller.ts` |
| 4.2 | Add route: `POST /api/v1/checkout/validate` - validate cart and return totals | ADD | `backend/src/routes/checkout.routes.ts` |
| 4.3 | Validate endpoint returns: isValid, errors[], totals{} | ADD | `backend/src/controllers/checkout.controller.ts` |
| 4.4 | Mount checkout routes | MODIFY | `backend/src/routes/index.ts` |
| 4.5 | Add validation schemas for checkout | ADD | `backend/src/validators/checkout.validator.ts` |

---

## Day 5 (Friday): Frontend - Cart Summary Enhancement

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create tax settings page in admin dashboard | ADD | `frontend/app/dashboard/settings/tax/page.tsx` |
| 5.2 | Create TaxRateForm component | ADD | `frontend/components/admin/TaxRateForm.tsx` |
| 5.3 | Modify CartSummary to show: subtotal, shipping, tax, total | MODIFY | `frontend/components/CartSummary.tsx` |
| 5.4 | Create checkoutSlice with state: shippingAddress, billingAddress, shippingMethod, totals, validation | ADD | `frontend/redux/features/checkoutSlice.ts` |
| 5.5 | Add thunk: `validateCheckout` - calls validate endpoint | ADD | `frontend/redux/features/checkoutSlice.ts` |
| 5.6 | Create seed data for default tax rates | ADD | `backend/src/scripts/seedTax.ts` |
| 5.7 | Test: Tax calculates correctly for different addresses | TEST | - |
| 5.8 | Test: Checkout validation catches all error cases | TEST | - |

---

## Week 12 Checklist

- [ ] TaxRate model created
- [ ] Tax service created
- [ ] Tax calculation endpoint working
- [ ] Admin can manage tax rates
- [ ] Checkout validation service created
- [ ] Checkout validate endpoint working
- [ ] Cart summary shows all totals
- [ ] Checkout state in Redux

---

**Phase 3 Complete!**

**Next Week:** Week 13 - Stripe Integration
