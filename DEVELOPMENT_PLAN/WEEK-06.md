# Week 6: Categories & AWS S3 Storage

> **Phase:** Product & Catalog (Week 6 of 8)
> **Focus:** Enhance category system, migrate file storage to AWS S3

---

## Week 6 Summary

Improve category hierarchy features and migrate from local file storage to AWS S3 for production-ready image hosting.

---

## Day 1 (Monday): Category Service & Hierarchy

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create category service (move DB logic from controller) | ADD | `backend/src/services/category.service.ts` |
| 1.2 | Add `getCategoryTree()` method - returns nested category structure | ADD | `backend/src/services/category.service.ts` |
| 1.3 | Add `getCategoryWithChildren()` method - get category with all subcategories | ADD | `backend/src/services/category.service.ts` |
| 1.4 | Add `getCategoryBreadcrumb()` method - returns path from root to category | ADD | `backend/src/services/category.service.ts` |
| 1.5 | Add `getProductCount()` method - count products in category and subcategories | ADD | `backend/src/services/category.service.ts` |

---

## Day 2 (Tuesday): Category Controller & Routes

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Add `getCategoryTree()` handler - returns full nested tree | ADD | `backend/src/controllers/category.controller.ts` |
| 2.2 | Add `getCategoryBySlug()` handler - get by slug instead of ID (public) | ADD | `backend/src/controllers/category.controller.ts` |
| 2.3 | Add `reorderCategories()` handler - update display order (admin) | ADD | `backend/src/controllers/category.controller.ts` |
| 2.4 | Add route: `GET /api/v1/categories/tree` - nested tree structure | ADD | `backend/src/routes/category.routes.ts` |
| 2.5 | Add route: `GET /api/v1/categories/slug/:slug` - get by slug | ADD | `backend/src/routes/category.routes.ts` |
| 2.6 | Add route: `PUT /api/v1/categories/reorder` - reorder categories (admin) | ADD | `backend/src/routes/category.routes.ts` |
| 2.7 | Add validation schemas for category endpoints | ADD | `backend/src/validators/category.validator.ts` |

---

## Day 3 (Wednesday): AWS S3 Setup

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Install AWS SDK: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner` | ADD | `backend/package.json` |
| 3.2 | Create S3 service with methods: `uploadFile`, `deleteFile`, `getSignedUrl` | ADD | `backend/src/services/s3.service.ts` |
| 3.3 | Add AWS config: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` | MODIFY | `backend/.env` |
| 3.4 | Create S3 config file | ADD | `backend/src/config/s3.config.ts` |
| 3.5 | Modify upload controller to upload to S3 instead of local storage | MODIFY | `backend/src/controllers/upload.controller.ts` |
| 3.6 | Add file deletion from S3 when product image is removed | MODIFY | `backend/src/controllers/product.controller.ts` |

---

## Day 4 (Thursday): S3 Integration & Migration

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Modify upload middleware to use memory storage (for S3 upload) instead of disk | MODIFY | `backend/src/middlewares/upload.middleware.ts` |
| 4.2 | Update product create/update to save S3 URLs in images array | MODIFY | `backend/src/controllers/product.controller.ts` |
| 4.3 | Update user avatar upload to use S3 | MODIFY | `backend/src/controllers/auth.controller.ts` |
| 4.4 | Create migration script to move existing local images to S3 | ADD | `backend/src/scripts/migrateToS3.ts` |
| 4.5 | Add environment flag `USE_S3` to allow local storage in development | MODIFY | `backend/.env` |
| 4.6 | Update upload service to check flag and use local or S3 accordingly | MODIFY | `backend/src/controllers/upload.controller.ts` |

---

## Day 5 (Friday): Frontend - Category Navigation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Add categorySlice action to fetch category tree | MODIFY | `frontend/redux/features/categorySlice.ts` |
| 5.2 | Create category navigation component (mega menu or sidebar) | ADD | `frontend/components/CategoryNav.tsx` |
| 5.3 | Modify Navbar to include category navigation/dropdown | MODIFY | `frontend/components/Navbar.tsx` |
| 5.4 | Add breadcrumb component for category pages | ADD | `frontend/components/Breadcrumb.tsx` |
| 5.5 | Modify category page to show breadcrumb path | MODIFY | `frontend/app/category/[name]/page.tsx` |
| 5.6 | Modify category page to show subcategories | MODIFY | `frontend/app/category/[name]/page.tsx` |
| 5.7 | Test: Category tree displays correctly | TEST | - |
| 5.8 | Test: S3 uploads working (create product with image) | TEST | - |

---

## Week 6 Checklist

- [ ] Category service created
- [ ] Category tree endpoint working
- [ ] Category breadcrumb working
- [ ] AWS S3 configured
- [ ] Upload to S3 working
- [ ] Delete from S3 working
- [ ] Existing images migrated (optional)
- [ ] Frontend category navigation
- [ ] Breadcrumb component working

---

**Next Week:** Week 7 - Search & Filtering
