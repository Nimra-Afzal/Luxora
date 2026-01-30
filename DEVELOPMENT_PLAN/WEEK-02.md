# Week 2: Database Schema Enhancement

> **Phase:** Foundation (Week 2 of 4)
> **Focus:** Enhance existing models and add new models for e-commerce

---

## Week 2 Summary

Enhance existing User, Product, Category models with e-commerce fields. Add new models for Cart, Order, Address, Wishlist, Review, Coupon.

---

## Day 1 (Monday): Enhance User Model

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Add fields to User model: `firstName`, `lastName`, `phone`, `avatar` | MODIFY | `backend/src/models/User.model.ts` |
| 1.2 | Add field: `status` (enum: active, inactive, suspended) with default 'active' | MODIFY | `backend/src/models/User.model.ts` |
| 1.3 | Add fields: `emailVerified` (Boolean), `emailVerifiedAt` (Date) | MODIFY | `backend/src/models/User.model.ts` |
| 1.4 | Add fields: `lastLogin`, `lastLoginIP`, `failedLoginAttempts`, `lockedUntil` | MODIFY | `backend/src/models/User.model.ts` |
| 1.5 | Change `role` field from string enum to ObjectId reference (for future Role model) OR expand enum to include: `super_admin`, `admin`, `customer`, `inventory_manager`, `order_manager`, `content_manager`, `support_agent` | MODIFY | `backend/src/models/User.model.ts` |
| 1.6 | Add `preferences` object: `{ newsletter: Boolean, orderUpdates: Boolean, promotions: Boolean }` | MODIFY | `backend/src/models/User.model.ts` |
| 1.7 | Add indexes: `{ email: 1 }` (already exists), `{ status: 1 }`, `{ role: 1 }` | MODIFY | `backend/src/models/User.model.ts` |

---

## Day 2 (Tuesday): Enhance Product Model

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add field: `slug` (String, unique) with auto-generation from name | MODIFY | `backend/src/models/Product.model.ts` |
| 2.2 | Add fields: `shortDescription`, `compareAtPrice` (original price for sales), `costPrice` (for profit calc) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.3 | Change `image` (String) to `images` (Array of objects: `{ url, alt, isPrimary, order }`) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.4 | Add fields: `sku` (unique), `barcode`, `quantity`, `lowStockThreshold`, `trackInventory` (Boolean) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.5 | Add fields: `tags` (Array of Strings), `brand` (String) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.6 | Add fields: `weight`, `weightUnit`, `dimensions` (object: length, width, height, unit) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.7 | Add field: `status` (enum: draft, active, inactive, archived) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.8 | Add field: `seo` object: `{ metaTitle, metaDescription, metaKeywords }` | MODIFY | `backend/src/models/Product.model.ts` |
| 2.9 | Add field: `reviewStats` object: `{ averageRating, totalReviews }` (denormalized) | MODIFY | `backend/src/models/Product.model.ts` |
| 2.10 | Add indexes: `{ slug: 1 }` unique, `{ sku: 1 }` unique sparse, `{ status: 1 }`, text index on name+description | MODIFY | `backend/src/models/Product.model.ts` |

---

## Day 3 (Wednesday): Add Order & Payment Models

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create Order model with fields: `orderNumber` (unique, auto-gen), `customer` (ref User), `items[]` (product snapshots), `subtotal`, `discount{}`, `shipping{}`, `tax{}`, `total` | ADD | `backend/src/models/Order.model.ts` |
| 3.2 | Add to Order: `shippingAddress{}`, `billingAddress{}` (embedded, snapshot at order time) | ADD | `backend/src/models/Order.model.ts` |
| 3.3 | Add to Order: `status` (enum: pending, confirmed, processing, shipped, delivered, cancelled, refunded) | ADD | `backend/src/models/Order.model.ts` |
| 3.4 | Add to Order: `paymentStatus` (enum: pending, paid, failed, refunded), `paymentMethod`, `stripePaymentIntentId` | ADD | `backend/src/models/Order.model.ts` |
| 3.5 | Add to Order: `trackingNumber`, `shippedAt`, `deliveredAt`, `customerNotes`, `adminNotes` | ADD | `backend/src/models/Order.model.ts` |
| 3.6 | Add Order indexes: `{ orderNumber: 1 }` unique, `{ customer: 1 }`, `{ status: 1 }`, `{ createdAt: -1 }` | ADD | `backend/src/models/Order.model.ts` |
| 3.7 | Create Payment model with fields: `order` (ref), `amount`, `currency`, `method`, `status`, `stripePaymentIntentId`, `stripeChargeId` | ADD | `backend/src/models/Payment.model.ts` |
| 3.8 | Create Refund model with fields: `order` (ref), `payment` (ref), `amount`, `reason`, `status`, `stripeRefundId`, `processedBy` | ADD | `backend/src/models/Refund.model.ts` |

---

## Day 4 (Thursday): Add Cart, Wishlist, Address Models

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create Cart model with fields: `user` (ref, optional), `sessionId` (for guests), `items[]`, `coupon{}`, `subtotal`, `expiresAt` | ADD | `backend/src/models/Cart.model.ts` |
| 4.2 | Define cart item subdocument: `{ product (ref), variant (ref), quantity, price, total }` | ADD | `backend/src/models/Cart.model.ts` |
| 4.3 | Add Cart TTL index on `expiresAt` for auto-cleanup of guest carts after 7 days | ADD | `backend/src/models/Cart.model.ts` |
| 4.4 | Create Wishlist model with fields: `user` (ref, unique), `products[]` (ref array) | ADD | `backend/src/models/Wishlist.model.ts` |
| 4.5 | Create Address model with fields: `user` (ref), `type` (shipping/billing), `isDefault`, `firstName`, `lastName`, `company`, `address1`, `address2`, `city`, `state`, `postalCode`, `country`, `phone` | ADD | `backend/src/models/Address.model.ts` |
| 4.6 | Add Address index: `{ user: 1, isDefault: 1 }` | ADD | `backend/src/models/Address.model.ts` |

---

## Day 5 (Friday): Add Review, Coupon Models & Update Exports

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create Review model with fields: `product` (ref), `user` (ref), `rating` (1-5), `title`, `comment`, `images[]`, `isVerifiedPurchase`, `status` (pending/approved/rejected), `helpfulCount` | ADD | `backend/src/models/Review.model.ts` |
| 5.2 | Add Review index: `{ product: 1, user: 1 }` unique (one review per user per product) | ADD | `backend/src/models/Review.model.ts` |
| 5.3 | Create Coupon model with fields: `code` (unique), `type` (percentage/fixed), `value`, `minPurchase`, `maxDiscount`, `usageLimit`, `usedCount`, `startDate`, `endDate`, `isActive` | ADD | `backend/src/models/Coupon.model.ts` |
| 5.4 | Create RefreshToken model with fields: `token`, `user` (ref), `expiresAt`, `isRevoked` | ADD | `backend/src/models/RefreshToken.model.ts` |
| 5.5 | Update models index file to export all new models | MODIFY | `backend/src/models/index.ts` |
| 5.6 | Create seed script for: default admin user, sample categories, sample products | ADD | `backend/src/scripts/seed.ts` |
| 5.7 | Test: Create sample data using seed script | TEST | - |
| 5.8 | Test: Verify all model validations work correctly | TEST | - |

---

## Week 2 Checklist

- [ ] User model enhanced with new fields
- [ ] Product model enhanced with e-commerce fields
- [ ] Category model unchanged (already sufficient)
- [ ] Order model created
- [ ] Payment model created
- [ ] Refund model created
- [ ] Cart model created with TTL
- [ ] Wishlist model created
- [ ] Address model created
- [ ] Review model created
- [ ] Coupon model created
- [ ] RefreshToken model created
- [ ] Seed script working
- [ ] All models exported from index

---

**Next Week:** Week 3 - Authentication Enhancement
