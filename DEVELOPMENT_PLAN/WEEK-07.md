# Week 7: Search & Filtering

> **Phase:** Product & Catalog (Week 7 of 8)
> **Focus:** Implement product search, filters, and sorting

---

## Week 7 Summary

Build a comprehensive search and filter system for products with text search, price filters, category filters, and sorting options.

---

## Day 1 (Monday): Backend - Search Implementation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Ensure text index exists on Product model (name, description, tags) | MODIFY | `backend/src/models/Product.model.ts` |
| 1.2 | Add `searchProducts()` method to product service - uses MongoDB text search | ADD | `backend/src/services/product.service.ts` |
| 1.3 | Add `search()` handler to product controller | ADD | `backend/src/controllers/product.controller.ts` |
| 1.4 | Add route: `GET /api/v1/products/search?q=keyword` | ADD | `backend/src/routes/product.routes.ts` |
| 1.5 | Add search suggestions endpoint (returns product names matching prefix) | ADD | `backend/src/controllers/product.controller.ts` |
| 1.6 | Add route: `GET /api/v1/products/suggestions?q=prefix` | ADD | `backend/src/routes/product.routes.ts` |

---

## Day 2 (Tuesday): Backend - Filter Implementation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Modify `getProductsPublic()` to accept filter params: category, minPrice, maxPrice, brand, tags, status | MODIFY | `backend/src/controllers/product.controller.ts` |
| 2.2 | Add dynamic query builder in product service for filters | ADD | `backend/src/services/product.service.ts` |
| 2.3 | Add sorting options: price-asc, price-desc, newest, rating, bestselling | MODIFY | `backend/src/services/product.service.ts` |
| 2.4 | Add `getFilterOptions()` - returns available brands, price range, tags for current category | ADD | `backend/src/services/product.service.ts` |
| 2.5 | Add route: `GET /api/v1/products/filters?category=slug` - get available filter options | ADD | `backend/src/routes/product.routes.ts` |

---

## Day 3 (Wednesday): Backend - Pagination Enhancement

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Standardize pagination across all list endpoints (products, users, orders, etc.) | MODIFY | All list endpoints |
| 3.2 | Add pagination helper utility if not exists | ADD | `backend/src/utils/pagination.ts` |
| 3.3 | Modify product list to return pagination meta: totalItems, totalPages, currentPage, hasNext, hasPrev | MODIFY | `backend/src/controllers/product.controller.ts` |
| 3.4 | Add cursor-based pagination option for better performance (optional) | ADD | `backend/src/services/product.service.ts` |
| 3.5 | Add items per page options: 12, 24, 48 | MODIFY | `backend/src/controllers/product.controller.ts` |

---

## Day 4 (Thursday): Frontend - Search UI

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create search input component with autocomplete suggestions | ADD | `frontend/components/SearchBar.tsx` |
| 4.2 | Add search bar to Navbar | MODIFY | `frontend/components/Navbar.tsx` |
| 4.3 | Create search results page | ADD | `frontend/app/search/page.tsx` |
| 4.4 | Add search thunks to productSlice | MODIFY | `frontend/redux/features/productSlice.ts` |
| 4.5 | Show search suggestions dropdown as user types | MODIFY | `frontend/components/SearchBar.tsx` |
| 4.6 | Add recent searches (store in localStorage) | ADD | `frontend/components/SearchBar.tsx` |

---

## Day 5 (Friday): Frontend - Filter & Sort UI

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create filter sidebar component (price range, brand, category) | ADD | `frontend/components/ProductFilters.tsx` |
| 5.2 | Create sort dropdown component | ADD | `frontend/components/SortDropdown.tsx` |
| 5.3 | Add filters and sort to category page | MODIFY | `frontend/app/category/[name]/page.tsx` |
| 5.4 | Add filters and sort to search results page | MODIFY | `frontend/app/search/page.tsx` |
| 5.5 | Add URL query params for filters (shareable filter URLs) | MODIFY | `frontend/app/category/[name]/page.tsx` |
| 5.6 | Add pagination component to product listings | ADD | `frontend/components/Pagination.tsx` |
| 5.7 | Test: Search with various keywords | TEST | - |
| 5.8 | Test: Filters work correctly (combine multiple filters) | TEST | - |

---

## Week 7 Checklist

- [ ] Text search working
- [ ] Search suggestions working
- [ ] Price filter working
- [ ] Category filter working
- [ ] Brand filter working
- [ ] Sorting working (price, date, rating)
- [ ] Pagination with meta info
- [ ] Search bar in navbar
- [ ] Search results page
- [ ] Filter sidebar on category page
- [ ] URL params for filters

---

**Next Week:** Week 8 - Reviews & Ratings
