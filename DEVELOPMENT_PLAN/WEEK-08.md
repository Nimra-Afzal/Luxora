# Week 8: Reviews & Ratings

> **Phase:** Product & Catalog (Week 8 of 8)
> **Focus:** Implement product review and rating system

---

## Week 8 Summary

Build a complete review system allowing customers to rate products, with moderation capabilities for admin.

---

## Day 1 (Monday): Review Service & Controller

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create review service with methods: `create`, `getByProduct`, `getByUser`, `update`, `delete`, `approve`, `reject` | ADD | `backend/src/services/review.service.ts` |
| 1.2 | Add `updateProductRatingStats()` helper - recalculates product's averageRating and totalReviews | ADD | `backend/src/services/review.service.ts` |
| 1.3 | Create review controller with all handlers | ADD | `backend/src/controllers/review.controller.ts` |
| 1.4 | Add check in `create()` - user can only review if they purchased the product (optional) | ADD | `backend/src/services/review.service.ts` |
| 1.5 | Add `markHelpful()` method - increment helpfulCount when user marks review helpful | ADD | `backend/src/services/review.service.ts` |

---

## Day 2 (Tuesday): Review Routes & Validation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add route: `GET /api/v1/products/:productId/reviews` - get reviews for product (public) | ADD | `backend/src/routes/review.routes.ts` |
| 2.2 | Add route: `POST /api/v1/products/:productId/reviews` - create review (auth required) | ADD | `backend/src/routes/review.routes.ts` |
| 2.3 | Add route: `PUT /api/v1/reviews/:id` - update own review | ADD | `backend/src/routes/review.routes.ts` |
| 2.4 | Add route: `DELETE /api/v1/reviews/:id` - delete own review | ADD | `backend/src/routes/review.routes.ts` |
| 2.5 | Add route: `POST /api/v1/reviews/:id/helpful` - mark review as helpful | ADD | `backend/src/routes/review.routes.ts` |
| 2.6 | Add validation schemas for review endpoints | ADD | `backend/src/validators/review.validator.ts` |
| 2.7 | Mount review routes in main router | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Admin Review Moderation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Add route: `GET /api/v1/admin/reviews` - list all reviews with filters (admin) | ADD | `backend/src/routes/review.routes.ts` |
| 3.2 | Add route: `GET /api/v1/admin/reviews/pending` - list pending reviews (admin) | ADD | `backend/src/routes/review.routes.ts` |
| 3.3 | Add route: `PUT /api/v1/admin/reviews/:id/approve` - approve review (admin) | ADD | `backend/src/routes/review.routes.ts` |
| 3.4 | Add route: `PUT /api/v1/admin/reviews/:id/reject` - reject review (admin) | ADD | `backend/src/routes/review.routes.ts` |
| 3.5 | Add route: `DELETE /api/v1/admin/reviews/:id` - delete any review (admin) | ADD | `backend/src/routes/review.routes.ts` |
| 3.6 | Add filter by status (pending, approved, rejected) in admin list | ADD | `backend/src/services/review.service.ts` |

---

## Day 4 (Thursday): Frontend - Review Display

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create ReviewCard component (shows rating stars, title, comment, user, date) | ADD | `frontend/components/ReviewCard.tsx` |
| 4.2 | Create ReviewList component with pagination | ADD | `frontend/components/ReviewList.tsx` |
| 4.3 | Create StarRating component (display and input) | ADD | `frontend/components/StarRating.tsx` |
| 4.4 | Create ReviewSummary component (average rating, distribution bar chart) | ADD | `frontend/components/ReviewSummary.tsx` |
| 4.5 | Add reviews section to product detail page | MODIFY | `frontend/app/products/[id]/page.tsx` |
| 4.6 | Create reviewSlice for state management | ADD | `frontend/redux/features/reviewSlice.ts` |

---

## Day 5 (Friday): Frontend - Review Form & Admin

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create ReviewForm component (rating, title, comment, image upload) | ADD | `frontend/components/ReviewForm.tsx` |
| 5.2 | Add "Write a Review" button on product page (only for logged-in users) | MODIFY | `frontend/app/products/[id]/page.tsx` |
| 5.3 | Show "Edit" button on user's own reviews | MODIFY | `frontend/components/ReviewCard.tsx` |
| 5.4 | Create admin reviews moderation page | ADD | `frontend/app/dashboard/reviews/page.tsx` |
| 5.5 | Add approve/reject buttons in admin review list | ADD | `frontend/app/dashboard/reviews/page.tsx` |
| 5.6 | Add "Reviews" menu item in admin sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |
| 5.7 | Test: Customer can submit review | TEST | - |
| 5.8 | Test: Admin can moderate reviews | TEST | - |
| 5.9 | Test: Product rating updates after review approval | TEST | - |

---

## Week 8 Checklist

- [ ] Review model exists (from Week 2)
- [ ] Review service created
- [ ] Review CRUD endpoints working
- [ ] Review moderation endpoints working
- [ ] Product rating stats auto-update
- [ ] Star rating component
- [ ] Review list on product page
- [ ] Review form for customers
- [ ] Admin moderation page
- [ ] Mark review as helpful working

---

**Phase 2 Complete!**

**Next Week:** Week 9 - Shopping Cart
