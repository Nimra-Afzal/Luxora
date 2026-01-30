# Luxora E-Commerce Platform - Master Development Plan

> **Project:** Transform Promptopia into Professional E-Commerce Platform
> **Duration:** 24 Weeks (6 Months)
> **Developer:** Solo Full-Stack Engineer

---

## Current State (What Exists)

### Backend (`/backend/`)
| File | Purpose |
|------|---------|
| `models/User.js` | User with username, email, password, role (user/admin) |
| `models/Blog.js` | Blog with title, content, image, author |
| `models/product.js` | Product with name, description, price, image, category |
| `models/category.js` | Category with name, slug, parent |
| `controllers/authController.js` | register, login |
| `controllers/blogController.js` | CRUD for blogs |
| `controllers/productController.js` | CRUD for products |
| `controllers/categoryController.js` | CRUD for categories |
| `services/authService.js` | Auth business logic |
| `services/blogService.js` | Blog business logic |
| `middlewares/authMiddleware.js` | JWT verification |
| `middlewares/requireAdmin.js` | Admin role check |
| `middlewares/upload.js` | Multer file upload |
| `routes/*.js` | API routes |
| `server.js` | Express app entry |

### Frontend (`/frontend/`)
- Next.js 15 with App Router
- Redux Toolkit for state
- Tailwind CSS + Radix UI
- Pages: Home, Login, Signup, About, Contact, Products, Categories, Dashboard

### Known Bug
- `routes/productRoutes.js` imports categoryController instead of productController

---

## Target State (What We're Building)

### User Roles
1. **Super Admin** - Full system access
2. **Admin** - Store management
3. **Inventory Manager** - Stock management
4. **Order Manager** - Order processing
5. **Content Manager** - Products & content
6. **Support Agent** - Customer support
7. **Customer** - Shopping

### New Features
- Enhanced auth (refresh tokens, email verification, password reset)
- Enhanced products (multiple images, inventory, variants)
- Shopping cart (guest + authenticated)
- Wishlist
- Address book
- Stripe payments
- Order management
- Reviews & ratings
- Coupons & promotions
- Returns & refunds
- Customer support tickets
- Admin analytics
- Email notifications
- PDF invoices

---

## 24-Week Timeline

### Phase 1: Foundation (Weeks 1-4)
| Week | Focus | Key Changes |
|------|-------|-------------|
| [Week 1](./WEEK-01.md) | TypeScript Setup | Convert all `.js` to `.ts`, add ESLint, fix productRoutes bug |
| [Week 2](./WEEK-02.md) | Database Models | Enhance User/Product models, add Order, Cart, Review, Coupon, etc. |
| [Week 3](./WEEK-03.md) | Auth Enhancement | Add refresh tokens, email verification, password reset |
| [Week 4](./WEEK-04.md) | Admin Dashboard | User management API, role-based navigation |

### Phase 2: Catalog (Weeks 5-8)
| Week | Focus | Key Changes |
|------|-------|-------------|
| [Week 5](./WEEK-05.md) | Product Enhancement | Product service layer, multiple images, inventory |
| [Week 6](./WEEK-06.md) | Categories & S3 | Category tree, AWS S3 for images |
| [Week 7](./WEEK-07.md) | Search & Filters | Text search, price/category filters, sorting |
| [Week 8](./WEEK-08.md) | Reviews | Review system, ratings, moderation |

### Phase 3: Shopping (Weeks 9-12)
| Week | Focus | Key Changes |
|------|-------|-------------|
| [Week 9](./WEEK-09.md) | Shopping Cart | Cart API, guest cart, cart merge |
| [Week 10](./WEEK-10.md) | Wishlist & Addresses | Wishlist, address book |
| [Week 11](./WEEK-11.md) | Shipping | Shipping zones, methods, rate calculation |
| [Week 12](./WEEK-12.md) | Tax | Tax rates, checkout validation |

### Phase 4: Payments (Weeks 13-16)
| Week | Focus | Key Changes |
|------|-------|-------------|
| [Week 13](./WEEK-13.md) | Stripe Integration | Payment intents, webhooks |
| [Week 14](./WEEK-14.md) | Checkout Flow | Multi-step checkout, order creation |
| [Week 15](./WEEK-15.md) | Order Management | Order status, admin management |
| [Week 16](./WEEK-16.md) | Emails & Invoices | Transactional emails, PDF invoices |

### Phase 5: Advanced (Weeks 17-20)
| Week | Focus | Key Changes |
|------|-------|-------------|
| [Week 17](./WEEK-17.md) | Coupons | Coupon system, discount application |
| [Week 18](./WEEK-18.md) | Returns | Return requests, Stripe refunds |
| [Week 19](./WEEK-19.md) | Support | Ticket system, help center |
| [Week 20](./WEEK-20.md) | Analytics | Dashboard, reports, exports |

### Phase 6: Launch (Weeks 21-24)
| Week | Focus | Key Changes |
|------|-------|-------------|
| [Week 21](./WEEK-21.md) | SEO & Performance | Meta tags, sitemap, optimization |
| [Week 22](./WEEK-22.md) | Security & Testing | Security audit, automated tests |
| [Week 23](./WEEK-23.md) | Deployment | Vercel, AWS, CI/CD |
| [Week 24](./WEEK-24.md) | Launch | Final QA, soft launch, go live |

---

## New Models to Add

| Model | Purpose |
|-------|---------|
| RefreshToken | JWT refresh tokens |
| PasswordReset | Password reset tokens |
| Order | Customer orders |
| Payment | Payment records |
| Refund | Refund records |
| Cart | Shopping cart |
| Wishlist | Saved products |
| Address | Customer addresses |
| Review | Product reviews |
| Coupon | Discount coupons |
| ShippingZone | Shipping regions |
| ShippingMethod | Shipping options |
| TaxRate | Tax configuration |
| Return | Return requests |
| Ticket | Support tickets |
| Notification | User notifications |

---

## New API Endpoints Summary

### Auth (Enhance existing)
- `POST /auth/logout` - Logout
- `POST /auth/refresh-token` - Refresh JWT
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Request reset
- `POST /auth/reset-password` - Reset password

### Cart (New)
- `GET /cart` - Get cart
- `POST /cart/items` - Add item
- `PUT /cart/items/:id` - Update item
- `DELETE /cart/items/:id` - Remove item
- `POST /cart/apply-coupon` - Apply coupon

### Orders (New)
- `GET /orders` - User's orders
- `GET /orders/:orderNumber` - Order detail
- `POST /checkout/complete` - Create order

### Admin (New)
- `GET /admin/orders` - All orders
- `GET /admin/analytics/*` - Analytics
- `GET /admin/users` - User management

---

## Tech Stack Additions

### Backend
- TypeScript
- Redis (caching, sessions)
- Stripe SDK
- Nodemailer
- AWS S3 SDK
- Winston (logging)
- Zod (validation)

### Frontend
- @stripe/react-stripe-js
- recharts (already have)

### Infrastructure
- Vercel (frontend)
- AWS ECS/EC2 (backend)
- AWS S3 + CloudFront (images)
- MongoDB Atlas
- Redis Cloud
- GitHub Actions (CI/CD)

---

## Quick Reference

### Task Types
- **MODIFY** - Change existing file
- **ADD** - Create new file
- **FIX** - Fix bug
- **TEST** - Test functionality
- **VERIFY** - Verify existing
- **SETUP** - Configure service

### File Naming Convention
- Models: `Name.model.ts`
- Controllers: `name.controller.ts`
- Services: `name.service.ts`
- Routes: `name.routes.ts`
- Validators: `name.validator.ts`
- Middlewares: `name.middleware.ts`

---

## Getting Started

1. Read [WEEK-01.md](./WEEK-01.md) - TypeScript setup
2. Follow day-by-day tasks
3. Mark completed tasks
4. Test after each day
5. Move to next week when complete

**Start Date:** _______________

**Good luck!**
