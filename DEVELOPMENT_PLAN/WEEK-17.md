# Week 17: Coupons & Promotions

> **Phase:** Advanced Features (Week 17 of 20)
> **Focus:** Implement coupon system and promotional discounts

---

## Week 17 Summary

Build a complete coupon and discount system with validation, usage limits, and automatic promotions.

---

## Day 1 (Monday): Coupon Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create coupon service with methods: `create`, `getByCode`, `validate`, `apply`, `incrementUsage` | ADD | `backend/src/services/coupon.service.ts` |
| 1.2 | Add `validateCoupon()` - checks: code exists, is active, not expired, usage limit not reached, min purchase met | ADD | `backend/src/services/coupon.service.ts` |
| 1.3 | Add `calculateDiscount()` - calculates discount amount based on type (percentage/fixed) | ADD | `backend/src/services/coupon.service.ts` |
| 1.4 | Add `checkProductEligibility()` - checks if coupon applies to cart items (if restricted to categories/products) | ADD | `backend/src/services/coupon.service.ts` |

---

## Day 2 (Tuesday): Coupon Endpoints

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create coupon controller | ADD | `backend/src/controllers/coupon.controller.ts` |
| 2.2 | Add route: `POST /api/v1/coupons/validate` - validate coupon code (public) | ADD | `backend/src/routes/coupon.routes.ts` |
| 2.3 | Add route: `POST /api/v1/cart/apply-coupon` - apply coupon to cart | ADD | `backend/src/routes/cart.routes.ts` |
| 2.4 | Add route: `DELETE /api/v1/cart/coupon` - remove coupon from cart | ADD | `backend/src/routes/cart.routes.ts` |
| 2.5 | Mount coupon routes | MODIFY | `backend/src/routes/index.ts` |
| 2.6 | Add coupon validation schemas | ADD | `backend/src/validators/coupon.validator.ts` |

---

## Day 3 (Wednesday): Admin Coupon Management

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Add route: `GET /api/v1/admin/coupons` - list all coupons (admin) | ADD | `backend/src/routes/coupon.routes.ts` |
| 3.2 | Add route: `GET /api/v1/admin/coupons/:id` - get coupon details (admin) | ADD | `backend/src/routes/coupon.routes.ts` |
| 3.3 | Add route: `POST /api/v1/admin/coupons` - create coupon (admin) | ADD | `backend/src/routes/coupon.routes.ts` |
| 3.4 | Add route: `PUT /api/v1/admin/coupons/:id` - update coupon (admin) | ADD | `backend/src/routes/coupon.routes.ts` |
| 3.5 | Add route: `DELETE /api/v1/admin/coupons/:id` - delete coupon (admin) | ADD | `backend/src/routes/coupon.routes.ts` |
| 3.6 | Add coupon usage tracking: `GET /api/v1/admin/coupons/:id/usage` - see who used coupon | ADD | `backend/src/routes/coupon.routes.ts` |

---

## Day 4 (Thursday): Frontend - Coupon Application

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create couponSlice with state: appliedCoupon, discount, error | ADD | `frontend/redux/features/couponSlice.ts` |
| 4.2 | Add thunks: `validateCoupon`, `applyCoupon`, `removeCoupon` | ADD | `frontend/redux/features/couponSlice.ts` |
| 4.3 | Create CouponInput component (input field + apply button) | ADD | `frontend/components/CouponInput.tsx` |
| 4.4 | Add CouponInput to cart page | MODIFY | `frontend/app/cart/page.tsx` |
| 4.5 | Show applied discount in CartSummary | MODIFY | `frontend/components/CartSummary.tsx` |
| 4.6 | Show coupon error messages (invalid, expired, min not met) | MODIFY | `frontend/components/CouponInput.tsx` |

---

## Day 5 (Friday): Admin Coupon UI & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create admin coupons list page | ADD | `frontend/app/dashboard/coupons/page.tsx` |
| 5.2 | Create CouponForm component (code, type, value, dates, limits) | ADD | `frontend/components/admin/CouponForm.tsx` |
| 5.3 | Create coupon create/edit page | ADD | `frontend/app/dashboard/coupons/create/page.tsx` |
| 5.4 | Add "Coupons" menu item in admin sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |
| 5.5 | Test: Apply valid coupon to cart | TEST | - |
| 5.6 | Test: Coupon validation errors work | TEST | - |
| 5.7 | Test: Coupon applies to checkout total | TEST | - |
| 5.8 | Test: Coupon usage increments after order | TEST | - |

---

## Week 17 Checklist

- [ ] Coupon model exists (from Week 2)
- [ ] Coupon service created
- [ ] Coupon validation endpoint
- [ ] Apply coupon to cart working
- [ ] Admin coupon CRUD
- [ ] CouponInput component
- [ ] Discount shows in cart
- [ ] Admin coupons page
- [ ] Usage tracking working

---

**Next Week:** Week 18 - Returns & Refunds
