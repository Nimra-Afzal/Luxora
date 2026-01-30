# Week 11: Shipping System

> **Phase:** Shopping Experience (Week 11 of 12)
> **Focus:** Implement shipping zones, methods, and rate calculation

---

## Week 11 Summary

Build shipping configuration system with zones, methods, and rate calculation for checkout.

---

## Day 1 (Monday): Shipping Models

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create ShippingZone model: `name`, `countries[]`, `states[]`, `isDefault` | ADD | `backend/src/models/ShippingZone.model.ts` |
| 1.2 | Create ShippingMethod model: `name`, `zone` (ref), `type` (flat/weight-based/free), `cost`, `minOrderAmount` (for free shipping), `estimatedDays`, `isActive` | ADD | `backend/src/models/ShippingMethod.model.ts` |
| 1.3 | Add to models index | MODIFY | `backend/src/models/index.ts` |

---

## Day 2 (Tuesday): Shipping Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create shipping service with methods: `getZones`, `getMethodsByZone`, `calculateShippingRates` | ADD | `backend/src/services/shipping.service.ts` |
| 2.2 | Add `getZoneForAddress()` - finds matching zone for country/state | ADD | `backend/src/services/shipping.service.ts` |
| 2.3 | Add `getAvailableMethods()` - returns methods for given address and cart | ADD | `backend/src/services/shipping.service.ts` |
| 2.4 | Add weight-based calculation logic (uses product weights from cart) | ADD | `backend/src/services/shipping.service.ts` |
| 2.5 | Add free shipping threshold check | ADD | `backend/src/services/shipping.service.ts` |

---

## Day 3 (Wednesday): Shipping Controller & Routes

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create shipping controller | ADD | `backend/src/controllers/shipping.controller.ts` |
| 3.2 | Add route: `POST /api/v1/shipping/rates` - calculate rates for address + cart (public) | ADD | `backend/src/routes/shipping.routes.ts` |
| 3.3 | Add route: `GET /api/v1/admin/shipping/zones` - list all zones (admin) | ADD | `backend/src/routes/shipping.routes.ts` |
| 3.4 | Add route: `POST /api/v1/admin/shipping/zones` - create zone (admin) | ADD | `backend/src/routes/shipping.routes.ts` |
| 3.5 | Add route: `PUT /api/v1/admin/shipping/zones/:id` - update zone (admin) | ADD | `backend/src/routes/shipping.routes.ts` |
| 3.6 | Add route: `DELETE /api/v1/admin/shipping/zones/:id` - delete zone (admin) | ADD | `backend/src/routes/shipping.routes.ts` |
| 3.7 | Add routes for shipping methods CRUD (admin) | ADD | `backend/src/routes/shipping.routes.ts` |
| 3.8 | Mount shipping routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 4 (Thursday): Admin Shipping Configuration

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create shipping settings page in admin dashboard | ADD | `frontend/app/dashboard/settings/shipping/page.tsx` |
| 4.2 | Create ShippingZoneForm component | ADD | `frontend/components/admin/ShippingZoneForm.tsx` |
| 4.3 | Create ShippingMethodForm component | ADD | `frontend/components/admin/ShippingMethodForm.tsx` |
| 4.4 | Create country/state multi-select for zone configuration | ADD | `frontend/components/admin/CountrySelector.tsx` |
| 4.5 | Add "Shipping" menu item under Settings in admin sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |

---

## Day 5 (Friday): Frontend Shipping Selection

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create shippingSlice with state: availableMethods, selectedMethod, loading | ADD | `frontend/redux/features/shippingSlice.ts` |
| 5.2 | Add thunk: `fetchShippingRates` - calls rates endpoint with address | ADD | `frontend/redux/features/shippingSlice.ts` |
| 5.3 | Create ShippingMethodSelector component (radio buttons with prices) | ADD | `frontend/components/ShippingMethodSelector.tsx` |
| 5.4 | Show estimated delivery date for each method | MODIFY | `frontend/components/ShippingMethodSelector.tsx` |
| 5.5 | Add shipping to CartSummary (show selected method cost) | MODIFY | `frontend/components/CartSummary.tsx` |
| 5.6 | Create seed data for default shipping zones and methods | ADD | `backend/src/scripts/seedShipping.ts` |
| 5.7 | Test: Shipping rates calculate correctly | TEST | - |
| 5.8 | Test: Admin can configure zones and methods | TEST | - |

---

## Week 11 Checklist

- [ ] ShippingZone model created
- [ ] ShippingMethod model created
- [ ] Shipping service created
- [ ] Shipping rates endpoint working
- [ ] Admin can manage zones
- [ ] Admin can manage methods
- [ ] Shipping method selector component
- [ ] Cart shows shipping cost
- [ ] Free shipping threshold working

---

**Next Week:** Week 12 - Tax & Pre-Checkout
