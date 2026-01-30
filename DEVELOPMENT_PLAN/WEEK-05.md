# Week 5: Product Enhancement

> **Phase:** Product & Catalog (Week 5 of 8)
> **Focus:** Enhance product system with variants, inventory, better image handling

---

## Week 5 Summary

Upgrade the existing product system to support multiple images, inventory tracking, and product variants.

---

## Day 1 (Monday): Product Service Layer

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create product service (currently controller has direct DB calls) | ADD | `backend/src/services/product.service.ts` |
| 1.2 | Move all DB logic from `productController` to new service | MODIFY | `backend/src/controllers/product.controller.ts` |
| 1.3 | Add `getBySlug()` method to service (currently only getById exists) | ADD | `backend/src/services/product.service.ts` |
| 1.4 | Add `updateInventory()` method - update stock quantity | ADD | `backend/src/services/product.service.ts` |
| 1.5 | Add `checkLowStock()` method - returns products below threshold | ADD | `backend/src/services/product.service.ts` |

---

## Day 2 (Tuesday): Product Controller Updates

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add `getProductBySlug()` handler - public endpoint | ADD | `backend/src/controllers/product.controller.ts` |
| 2.2 | Modify `createProduct()` to handle multiple images array instead of single image | MODIFY | `backend/src/controllers/product.controller.ts` |
| 2.3 | Modify `updateProduct()` to handle adding/removing images from array | MODIFY | `backend/src/controllers/product.controller.ts` |
| 2.4 | Add `updateProductInventory()` handler - update stock only (inventory manager role) | ADD | `backend/src/controllers/product.controller.ts` |
| 2.5 | Add `getLowStockProducts()` handler - admin/inventory manager | ADD | `backend/src/controllers/product.controller.ts` |
| 2.6 | Add Zod validation schemas for product endpoints | ADD | `backend/src/validators/product.validator.ts` |

---

## Day 3 (Wednesday): Product Routes & Image Upload

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Add route: `GET /api/v1/products/:slug` - get by slug (public) | ADD | `backend/src/routes/product.routes.ts` |
| 3.2 | Add route: `PUT /api/v1/products/:id/inventory` - update stock (admin/inventory_manager) | ADD | `backend/src/routes/product.routes.ts` |
| 3.3 | Add route: `GET /api/v1/products/low-stock` - get low stock products (admin) | ADD | `backend/src/routes/product.routes.ts` |
| 3.4 | Add route: `POST /api/v1/products/:id/images` - add images to product | ADD | `backend/src/routes/product.routes.ts` |
| 3.5 | Add route: `DELETE /api/v1/products/:id/images/:imageId` - remove image | ADD | `backend/src/routes/product.routes.ts` |
| 3.6 | Modify upload middleware to handle multiple files (array) | MODIFY | `backend/src/middlewares/upload.middleware.ts` |

---

## Day 4 (Thursday): Frontend - Product Display Updates

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Modify ProductCard to display first image from images array (handle both old `image` and new `images[]`) | MODIFY | `frontend/components/ProductCard.tsx` |
| 4.2 | Modify product detail page to show image gallery (multiple images) | MODIFY | `frontend/app/products/[id]/page.tsx` |
| 4.3 | Add image carousel/gallery component for product images | ADD | `frontend/components/ProductImageGallery.tsx` |
| 4.4 | Update productSlice to handle new product structure | MODIFY | `frontend/redux/features/productSlice.ts` |
| 4.5 | Display stock status on product card (In Stock / Low Stock / Out of Stock) | MODIFY | `frontend/components/ProductCard.tsx` |

---

## Day 5 (Friday): Frontend - Admin Product Management

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Modify product create form to allow multiple image uploads | MODIFY | `frontend/app/dashboard/products/create/page.tsx` |
| 5.2 | Add drag-and-drop image reordering in product form | MODIFY | `frontend/app/dashboard/products/create/page.tsx` |
| 5.3 | Modify product edit form to handle images array | MODIFY | `frontend/app/dashboard/products/[id]/edit/page.tsx` |
| 5.4 | Add inventory management fields in product form (quantity, lowStockThreshold) | MODIFY | `frontend/app/dashboard/products/create/page.tsx` |
| 5.5 | Add low stock alert page/section in dashboard | ADD | `frontend/app/dashboard/inventory/page.tsx` |
| 5.6 | Test: Product CRUD with multiple images | TEST | - |
| 5.7 | Test: Inventory tracking and low stock alerts | TEST | - |

---

## Week 5 Checklist

- [ ] Product service layer created
- [ ] Get product by slug working
- [ ] Multiple images support (backend)
- [ ] Multiple images support (frontend)
- [ ] Image gallery on product page
- [ ] Inventory tracking fields working
- [ ] Low stock alerts working
- [ ] Admin can upload multiple images
- [ ] Admin can reorder images

---

**Next Week:** Week 6 - Categories & AWS S3
