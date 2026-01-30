# Week 21: SEO & Performance

> **Phase:** Polish & Launch (Week 21 of 24)
> **Focus:** Optimize for search engines and improve performance

---

## Week 21 Summary

Implement SEO best practices and optimize frontend performance for Core Web Vitals.

---

## Day 1 (Monday): SEO - Meta Tags & Structured Data

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Add dynamic meta tags to product pages (title, description from product data) | MODIFY | `frontend/app/products/[id]/page.tsx` |
| 1.2 | Add dynamic meta tags to category pages | MODIFY | `frontend/app/category/[name]/page.tsx` |
| 1.3 | Add Open Graph tags for social sharing | MODIFY | `frontend/app/layout.tsx` |
| 1.4 | Add Twitter Card meta tags | MODIFY | `frontend/app/layout.tsx` |
| 1.5 | Add JSON-LD structured data for products (Product schema) | ADD | `frontend/components/ProductSchema.tsx` |
| 1.6 | Add JSON-LD structured data for organization (Organization schema) | ADD | `frontend/app/layout.tsx` |
| 1.7 | Add JSON-LD breadcrumb schema | ADD | `frontend/components/BreadcrumbSchema.tsx` |

---

## Day 2 (Tuesday): SEO - Sitemap & Robots

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create dynamic sitemap.xml using Next.js sitemap feature | ADD | `frontend/app/sitemap.ts` |
| 2.2 | Include all products in sitemap | MODIFY | `frontend/app/sitemap.ts` |
| 2.3 | Include all categories in sitemap | MODIFY | `frontend/app/sitemap.ts` |
| 2.4 | Create robots.txt | ADD | `frontend/app/robots.ts` |
| 2.5 | Add canonical URLs to all pages | MODIFY | `frontend/app/` pages |
| 2.6 | Create API endpoint to return products/categories for sitemap | ADD | `backend/src/routes/sitemap.routes.ts` |

---

## Day 3 (Wednesday): Performance - Images & Assets

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Use Next.js Image component everywhere (already exists, verify usage) | VERIFY | `frontend/components/` |
| 3.2 | Add image blur placeholders for better loading UX | MODIFY | `frontend/components/ProductCard.tsx` |
| 3.3 | Configure image optimization sizes for different viewports | MODIFY | `frontend/next.config.js` |
| 3.4 | Add lazy loading to below-fold images | MODIFY | `frontend/components/` |
| 3.5 | Optimize CloudFront/S3 caching headers for images | MODIFY | AWS S3/CloudFront settings |
| 3.6 | Add WebP format support in image uploads | MODIFY | `backend/src/middlewares/upload.middleware.ts` |

---

## Day 4 (Thursday): Performance - Code & Loading

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Analyze bundle size with `@next/bundle-analyzer` | ADD | `frontend/package.json` |
| 4.2 | Add dynamic imports for heavy components (charts, editors) | MODIFY | `frontend/app/dashboard/` |
| 4.3 | Implement loading.tsx for route loading states | ADD | `frontend/app/loading.tsx` |
| 4.4 | Add Suspense boundaries for async components | MODIFY | `frontend/app/` pages |
| 4.5 | Optimize Redux store - avoid unnecessary re-renders | MODIFY | `frontend/redux/` |
| 4.6 | Add React.memo to frequently re-rendered components | MODIFY | `frontend/components/ProductCard.tsx` |

---

## Day 5 (Friday): Performance - Backend & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Add Redis caching for frequently accessed data (categories, featured products) | ADD | `backend/src/services/cache.service.ts` |
| 5.2 | Add database query optimization (select only needed fields) | MODIFY | `backend/src/services/` |
| 5.3 | Add API response compression (already have gzip via Express?) | VERIFY | `backend/src/app.ts` |
| 5.4 | Run Lighthouse audit on key pages | TEST | - |
| 5.5 | Fix any Lighthouse performance issues | FIX | - |
| 5.6 | Test Core Web Vitals (LCP, FID, CLS) | TEST | - |
| 5.7 | Document performance improvements | DOCUMENT | - |

---

## Week 21 Checklist

- [ ] Dynamic meta tags on product pages
- [ ] Dynamic meta tags on category pages
- [ ] Open Graph tags working
- [ ] JSON-LD structured data
- [ ] Dynamic sitemap generated
- [ ] robots.txt configured
- [ ] Canonical URLs added
- [ ] Images optimized (Next.js Image)
- [ ] Bundle size analyzed
- [ ] Loading states added
- [ ] Redis caching implemented
- [ ] Lighthouse score > 90

---

**Next Week:** Week 22 - Security & Testing
