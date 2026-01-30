# Week 9: Shopping Cart

> **Phase:** Shopping Experience (Week 9 of 12)
> **Focus:** Implement persistent shopping cart for guests and authenticated users

---

## Week 9 Summary

Build a complete shopping cart system that works for both guest users (session-based) and logged-in users (database-persisted).

---

## Day 1 (Monday): Cart Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create cart service with methods: `getCart`, `addItem`, `updateItemQuantity`, `removeItem`, `clearCart` | ADD | `backend/src/services/cart.service.ts` |
| 1.2 | Add `calculateTotals()` method - calculates subtotal, validates prices against current product prices | ADD | `backend/src/services/cart.service.ts` |
| 1.3 | Add `validateCart()` method - checks stock availability for all items | ADD | `backend/src/services/cart.service.ts` |
| 1.4 | Add `mergeGuestCart()` method - merges guest cart into user cart on login | ADD | `backend/src/services/cart.service.ts` |
| 1.5 | Add `getOrCreateCart()` - gets existing cart or creates new one (by userId or sessionId) | ADD | `backend/src/services/cart.service.ts` |

---

## Day 2 (Tuesday): Cart Controller & Routes

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create cart controller with handlers: `getCart`, `addItem`, `updateItem`, `removeItem`, `clearCart` | ADD | `backend/src/controllers/cart.controller.ts` |
| 2.2 | Add guest cart support - use sessionId from cookie if no user authenticated | ADD | `backend/src/controllers/cart.controller.ts` |
| 2.3 | Add route: `GET /api/v1/cart` - get current cart | ADD | `backend/src/routes/cart.routes.ts` |
| 2.4 | Add route: `POST /api/v1/cart/items` - add item to cart | ADD | `backend/src/routes/cart.routes.ts` |
| 2.5 | Add route: `PUT /api/v1/cart/items/:itemId` - update item quantity | ADD | `backend/src/routes/cart.routes.ts` |
| 2.6 | Add route: `DELETE /api/v1/cart/items/:itemId` - remove item from cart | ADD | `backend/src/routes/cart.routes.ts` |
| 2.7 | Add route: `DELETE /api/v1/cart` - clear cart | ADD | `backend/src/routes/cart.routes.ts` |
| 2.8 | Add route: `POST /api/v1/cart/merge` - merge guest cart on login | ADD | `backend/src/routes/cart.routes.ts` |
| 2.9 | Mount cart routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Cart Validation & Session

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Install cookie-parser if not installed: `npm install cookie-parser @types/cookie-parser` | ADD | `backend/package.json` |
| 3.2 | Add cookie-parser middleware to Express app | MODIFY | `backend/src/app.ts` or `server.ts` |
| 3.3 | Create middleware to generate/read sessionId cookie for guest users | ADD | `backend/src/middlewares/session.middleware.ts` |
| 3.4 | Add validation: check product exists and has sufficient stock before adding to cart | MODIFY | `backend/src/services/cart.service.ts` |
| 3.5 | Add validation: check quantity limits (max quantity per item) | MODIFY | `backend/src/services/cart.service.ts` |
| 3.6 | Add validation schemas for cart endpoints | ADD | `backend/src/validators/cart.validator.ts` |

---

## Day 4 (Thursday): Frontend - Cart State

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create cartSlice with state: items, subtotal, itemCount, loading, error | ADD | `frontend/redux/features/cartSlice.ts` |
| 4.2 | Add thunks: `fetchCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart` | ADD | `frontend/redux/features/cartSlice.ts` |
| 4.3 | Add cart merge on login (call merge endpoint after successful login) | MODIFY | `frontend/redux/features/authSlice.ts` |
| 4.4 | Store guest sessionId in cookie (handled by backend) | - | - |
| 4.5 | Add cart item count to Navbar (badge on cart icon) | MODIFY | `frontend/components/Navbar.tsx` |

---

## Day 5 (Friday): Frontend - Cart UI

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create CartItem component (product image, name, price, quantity selector, remove button) | ADD | `frontend/components/CartItem.tsx` |
| 5.2 | Create CartSummary component (subtotal, proceed to checkout button) | ADD | `frontend/components/CartSummary.tsx` |
| 5.3 | Create cart page | ADD | `frontend/app/cart/page.tsx` |
| 5.4 | Add "Add to Cart" button on ProductCard | MODIFY | `frontend/components/ProductCard.tsx` |
| 5.5 | Add "Add to Cart" button on product detail page with quantity selector | MODIFY | `frontend/app/products/[id]/page.tsx` |
| 5.6 | Create mini cart dropdown/drawer (shows cart preview in navbar) | ADD | `frontend/components/MiniCart.tsx` |
| 5.7 | Test: Add item to cart as guest | TEST | - |
| 5.8 | Test: Cart persists after page refresh | TEST | - |
| 5.9 | Test: Guest cart merges after login | TEST | - |

---

## Week 9 Checklist

- [ ] Cart model exists (from Week 2)
- [ ] Cart service created
- [ ] Cart CRUD endpoints working
- [ ] Guest cart (session-based) working
- [ ] User cart (database) working
- [ ] Cart merge on login working
- [ ] Stock validation on add
- [ ] Cart state in Redux
- [ ] Cart page UI
- [ ] Add to cart buttons
- [ ] Mini cart in navbar

---

**Next Week:** Week 10 - Wishlist & Addresses
