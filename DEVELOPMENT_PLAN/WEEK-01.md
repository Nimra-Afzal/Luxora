# Week 1: Project Setup & Architecture

> **Phase:** Foundation (Week 1 of 4)
> **Focus:** Restructure codebase, add TypeScript, set up proper tooling

---

## Week 1 Summary

Upgrade the existing codebase to TypeScript with proper tooling while keeping all existing functionality working.

---

## Day 1 (Monday): Backend TypeScript Setup

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Install TypeScript dependencies: `typescript`, `ts-node`, `@types/node`, `@types/express`, `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/cors`, `@types/morgan`, `@types/multer` | ADD | `backend/package.json` |
| 1.2 | Create TypeScript config file | ADD | `backend/tsconfig.json` |
| 1.3 | Create `src/` folder and move all existing code into it (models/, controllers/, services/, middlewares/, routes/) | MODIFY | `backend/` structure |
| 1.4 | Rename `server.js` → `src/server.ts` and convert to TypeScript | MODIFY | `backend/server.js` |
| 1.5 | Create nodemon config for TypeScript | ADD | `backend/nodemon.json` |
| 1.6 | Update package.json scripts: add `dev`, `build`, `start` | MODIFY | `backend/package.json` |

---

## Day 2 (Tuesday): Convert Models to TypeScript

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Rename `User.js` → `User.model.ts`, add TypeScript interfaces for User document | MODIFY | `backend/models/User.js` |
| 2.2 | Rename `Blog.js` → `Blog.model.ts`, add TypeScript interfaces | MODIFY | `backend/models/Blog.js` |
| 2.3 | Rename `product.js` → `Product.model.ts`, add TypeScript interfaces | MODIFY | `backend/models/product.js` |
| 2.4 | Rename `category.js` → `Category.model.ts`, add TypeScript interfaces | MODIFY | `backend/models/category.js` |
| 2.5 | Create models index file to export all models | ADD | `backend/src/models/index.ts` |

---

## Day 3 (Wednesday): Convert Controllers & Services to TypeScript

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Rename `authController.js` → `auth.controller.ts`, add types | MODIFY | `backend/controllers/authController.js` |
| 3.2 | Rename `blogController.js` → `blog.controller.ts`, add types | MODIFY | `backend/controllers/blogController.js` |
| 3.3 | Rename `productController.js` → `product.controller.ts`, add types | MODIFY | `backend/controllers/productController.js` |
| 3.4 | Rename `categoryController.js` → `category.controller.ts`, add types | MODIFY | `backend/controllers/categoryController.js` |
| 3.5 | Rename `uploadController.js` → `upload.controller.ts`, add types | MODIFY | `backend/controllers/uploadController.js` |
| 3.6 | Rename `authService.js` → `auth.service.ts`, add types | MODIFY | `backend/services/authService.js` |
| 3.7 | Rename `blogService.js` → `blog.service.ts`, add types | MODIFY | `backend/services/blogService.js` |

---

## Day 4 (Thursday): Convert Middlewares & Routes + Fix Bug

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Rename `authMiddleware.js` → `auth.middleware.ts`, add types | MODIFY | `backend/middlewares/authMiddleware.js` |
| 4.2 | Rename `requireAdmin.js` → `requireAdmin.middleware.ts`, add types | MODIFY | `backend/middlewares/requireAdmin.js` |
| 4.3 | Rename `upload.js` → `upload.middleware.ts`, add types | MODIFY | `backend/middlewares/upload.js` |
| 4.4 | **FIX BUG**: `productRoutes.js` currently imports categoryController - change to import productController | FIX | `backend/routes/productRoutes.js` |
| 4.5 | Rename all route files to `.ts` and add types | MODIFY | `backend/routes/*.js` |
| 4.6 | Add product routes that use productController (currently missing) | ADD | `backend/routes/productRoutes.ts` |

---

## Day 5 (Friday): Tooling & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Install ESLint + Prettier: `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `prettier` | ADD | `backend/package.json` |
| 5.2 | Create ESLint config | ADD | `backend/.eslintrc.js` |
| 5.3 | Create Prettier config | ADD | `backend/.prettierrc` |
| 5.4 | Create environment example file | ADD | `backend/.env.example` |
| 5.5 | Update `.gitignore` to include `dist/`, `*.log` | MODIFY | `backend/.gitignore` |
| 5.6 | Test: Run `npm run build` - should compile without errors | TEST | - |
| 5.7 | Test: Run `npm run dev` - server should start | TEST | - |
| 5.8 | Test: All existing API endpoints should still work | TEST | - |

---

## Week 1 Checklist

- [ ] TypeScript installed and configured
- [ ] All `.js` files converted to `.ts`
- [ ] **BUG FIXED**: productRoutes using correct controller
- [ ] ESLint + Prettier configured
- [ ] `npm run build` works
- [ ] `npm run dev` works
- [ ] All existing endpoints still functional

---

**Next Week:** Week 2 - Database Schema Enhancement
