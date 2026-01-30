# Week 4: Admin Dashboard & User Management

> **Phase:** Foundation (Week 4 of 4)
> **Focus:** Enhance admin dashboard, add user management APIs

---

## Week 4 Summary

Build user management APIs for admin, enhance existing dashboard pages, add proper navigation based on user roles.

---

## Day 1 (Monday): User Management API

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create user service with methods: `getAll`, `getById`, `update`, `delete`, `updateRole`, `updateStatus` | ADD | `backend/src/services/user.service.ts` |
| 1.2 | Create user controller with handlers for all CRUD operations | ADD | `backend/src/controllers/user.controller.ts` |
| 1.3 | Create user routes file | ADD | `backend/src/routes/user.routes.ts` |
| 1.4 | Add route: `GET /api/v1/users` (admin only) - list all users with pagination | ADD | `backend/src/routes/user.routes.ts` |
| 1.5 | Add route: `GET /api/v1/users/:id` (admin only) - get user details | ADD | `backend/src/routes/user.routes.ts` |
| 1.6 | Add route: `PUT /api/v1/users/:id` (admin only) - update user | ADD | `backend/src/routes/user.routes.ts` |
| 1.7 | Add route: `DELETE /api/v1/users/:id` (admin only) - soft delete user | ADD | `backend/src/routes/user.routes.ts` |
| 1.8 | Mount user routes in main router | MODIFY | `backend/src/routes/index.ts` or `backend/server.ts` |

---

## Day 2 (Tuesday): User Profile API

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Modify existing `GET /api/v1/auth/me` to return full user profile with new fields | MODIFY | `backend/src/controllers/auth.controller.ts` |
| 2.2 | Add route: `PUT /api/v1/auth/me` - update own profile (firstName, lastName, phone, avatar) | ADD | `backend/src/routes/auth.routes.ts` |
| 2.3 | Add route: `PUT /api/v1/auth/me/preferences` - update notification preferences | ADD | `backend/src/routes/auth.routes.ts` |
| 2.4 | Add Zod validation schemas for profile update | ADD | `backend/src/validators/user.validator.ts` |
| 2.5 | Add avatar upload endpoint using existing upload middleware | ADD | `backend/src/routes/auth.routes.ts` |

---

## Day 3 (Wednesday): Frontend - Auth State Enhancement

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Modify authSlice to store both accessToken and refreshToken | MODIFY | `frontend/redux/features/authSlice.ts` |
| 3.2 | Add `refreshToken` async thunk that calls refresh endpoint | ADD | `frontend/redux/features/authSlice.ts` |
| 3.3 | Modify API interceptor to auto-refresh token on 401 error | MODIFY | `frontend/lib/api.ts` |
| 3.4 | Add `logout` thunk that calls logout endpoint before clearing state | MODIFY | `frontend/redux/features/authSlice.ts` |
| 3.5 | Store refreshToken in localStorage alongside accessToken | MODIFY | `frontend/redux/features/authSlice.ts` |
| 3.6 | Add user role to auth state for conditional rendering | MODIFY | `frontend/redux/features/authSlice.ts` |

---

## Day 4 (Thursday): Frontend - Dashboard Navigation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Modify dashboard sidebar to show/hide menu items based on user role | MODIFY | `frontend/app/dashboard/page.tsx` |
| 4.2 | Add "Users" menu item in sidebar (visible only to admin/super_admin) | MODIFY | `frontend/app/dashboard/page.tsx` |
| 4.3 | Create users list page | ADD | `frontend/app/dashboard/users/page.tsx` |
| 4.4 | Create user detail/edit page | ADD | `frontend/app/dashboard/users/[id]/page.tsx` |
| 4.5 | Add userSlice for admin user management | ADD | `frontend/redux/features/userSlice.ts` |
| 4.6 | Add protected route wrapper that redirects based on role | ADD | `frontend/components/ProtectedRoute.tsx` |

---

## Day 5 (Friday): Frontend - Profile Page & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create profile settings page | ADD | `frontend/app/dashboard/settings/page.tsx` |
| 5.2 | Add profile edit form (firstName, lastName, phone) | ADD | `frontend/app/dashboard/settings/page.tsx` |
| 5.3 | Add change password form | ADD | `frontend/app/dashboard/settings/page.tsx` |
| 5.4 | Add avatar upload functionality | ADD | `frontend/app/dashboard/settings/page.tsx` |
| 5.5 | Modify Navbar to show user name/avatar when logged in | MODIFY | `frontend/components/Navbar.tsx` |
| 5.6 | Test: Admin can view/edit/delete users | TEST | - |
| 5.7 | Test: User can edit own profile | TEST | - |
| 5.8 | Test: Role-based navigation works correctly | TEST | - |

---

## Week 4 Checklist

- [ ] User CRUD API for admin
- [ ] Profile update API for users
- [ ] Preferences update API
- [ ] Avatar upload working
- [ ] Frontend token refresh working
- [ ] Dashboard shows role-based menu
- [ ] Users management page (admin)
- [ ] Profile settings page
- [ ] Change password working in UI
- [ ] Protected routes by role

---

**Phase 1 Complete!**

**Next Week:** Week 5 - Product Enhancement
