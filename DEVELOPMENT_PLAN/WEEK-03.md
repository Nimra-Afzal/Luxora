# Week 3: Authentication Enhancement

> **Phase:** Foundation (Week 3 of 4)
> **Focus:** Enhance existing auth system with refresh tokens, email verification, password reset

---

## Week 3 Summary

Upgrade the existing basic JWT auth to a production-ready system with refresh tokens, email verification, and proper security features.

---

## Day 1 (Monday): Enhance Auth Service

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Modify `generateToken()` to create short-lived access token (15 min instead of 7 days) | MODIFY | `backend/src/services/auth.service.ts` |
| 1.2 | Add `generateRefreshToken()` method - creates refresh token (7 days), saves to RefreshToken model | ADD | `backend/src/services/auth.service.ts` |
| 1.3 | Add `refreshAccessToken()` method - validates refresh token, returns new access token | ADD | `backend/src/services/auth.service.ts` |
| 1.4 | Add `revokeRefreshToken()` method - marks token as revoked (for logout) | ADD | `backend/src/services/auth.service.ts` |
| 1.5 | Add `revokeAllUserTokens()` method - revokes all user's refresh tokens (for password change) | ADD | `backend/src/services/auth.service.ts` |
| 1.6 | Add environment variables: `JWT_EXPIRES_IN=15m`, `REFRESH_TOKEN_EXPIRES_IN=7d` | MODIFY | `backend/.env` |

---

## Day 2 (Tuesday): Update Auth Controller & Routes

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Modify `login()` to return both accessToken and refreshToken | MODIFY | `backend/src/controllers/auth.controller.ts` |
| 2.2 | Add `logout()` handler - revokes refresh token | ADD | `backend/src/controllers/auth.controller.ts` |
| 2.3 | Add `refreshToken()` handler - exchanges refresh token for new access token | ADD | `backend/src/controllers/auth.controller.ts` |
| 2.4 | Update `register()` to set `emailVerified: false` for new users | MODIFY | `backend/src/controllers/auth.controller.ts` |
| 2.5 | Add route: `POST /api/v1/auth/logout` | ADD | `backend/src/routes/auth.routes.ts` |
| 2.6 | Add route: `POST /api/v1/auth/refresh-token` | ADD | `backend/src/routes/auth.routes.ts` |
| 2.7 | Add rate limiting middleware to login route (5 attempts per 15 min) | ADD | `backend/src/routes/auth.routes.ts` |

---

## Day 3 (Wednesday): Email Verification System

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Install nodemailer: `npm install nodemailer @types/nodemailer` | ADD | `backend/package.json` |
| 3.2 | Create email service with `sendEmail()` method | ADD | `backend/src/services/email.service.ts` |
| 3.3 | Add `generateVerificationToken()` to auth service | ADD | `backend/src/services/auth.service.ts` |
| 3.4 | Add `verifyEmail()` handler - verifies token, updates user `emailVerified` to true | ADD | `backend/src/controllers/auth.controller.ts` |
| 3.5 | Add `resendVerification()` handler - generates new token, sends email | ADD | `backend/src/controllers/auth.controller.ts` |
| 3.6 | Modify `register()` to send verification email after creating user | MODIFY | `backend/src/controllers/auth.controller.ts` |
| 3.7 | Add route: `POST /api/v1/auth/verify-email` | ADD | `backend/src/routes/auth.routes.ts` |
| 3.8 | Add route: `POST /api/v1/auth/resend-verification` | ADD | `backend/src/routes/auth.routes.ts` |
| 3.9 | Add email config to environment: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | MODIFY | `backend/.env` |

---

## Day 4 (Thursday): Password Reset System

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create PasswordReset model if not created: `user`, `token`, `expiresAt`, `used` | ADD | `backend/src/models/PasswordReset.model.ts` |
| 4.2 | Add `forgotPassword()` handler - generates reset token, sends email | ADD | `backend/src/controllers/auth.controller.ts` |
| 4.3 | Add `resetPassword()` handler - verifies token, updates password, revokes all refresh tokens | ADD | `backend/src/controllers/auth.controller.ts` |
| 4.4 | Add `changePassword()` handler - for logged-in users to change password | ADD | `backend/src/controllers/auth.controller.ts` |
| 4.5 | Add route: `POST /api/v1/auth/forgot-password` | ADD | `backend/src/routes/auth.routes.ts` |
| 4.6 | Add route: `POST /api/v1/auth/reset-password` | ADD | `backend/src/routes/auth.routes.ts` |
| 4.7 | Add route: `PUT /api/v1/auth/change-password` (auth required) | ADD | `backend/src/routes/auth.routes.ts` |
| 4.8 | Add rate limiting to forgot-password route (3 attempts per hour) | ADD | `backend/src/routes/auth.routes.ts` |

---

## Day 5 (Friday): Role Middleware & Validation

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Modify existing `authMiddleware` to handle expired tokens gracefully (return specific error code) | MODIFY | `backend/src/middlewares/auth.middleware.ts` |
| 5.2 | Modify `requireAdmin` to `requireRole(roles[])` - accepts array of allowed roles | MODIFY | `backend/src/middlewares/requireAdmin.middleware.ts` → rename to `role.middleware.ts` |
| 5.3 | Add Zod validation schemas for all auth endpoints | ADD | `backend/src/validators/auth.validator.ts` |
| 5.4 | Add validation middleware to all auth routes | MODIFY | `backend/src/routes/auth.routes.ts` |
| 5.5 | Add account lockout logic: lock account after 5 failed login attempts for 15 min | MODIFY | `backend/src/services/auth.service.ts` |
| 5.6 | Update user `lastLogin` and `lastLoginIP` on successful login | MODIFY | `backend/src/services/auth.service.ts` |
| 5.7 | Test: Complete auth flow (register → verify → login → refresh → logout) | TEST | - |
| 5.8 | Test: Password reset flow (forgot → email → reset → login) | TEST | - |

---

## Week 3 Checklist

- [ ] Access token shortened to 15 min
- [ ] Refresh token system working
- [ ] Logout revokes refresh token
- [ ] Email verification working
- [ ] Resend verification working
- [ ] Password reset working
- [ ] Change password working
- [ ] Account lockout after failed attempts
- [ ] Rate limiting on sensitive endpoints
- [ ] Role middleware accepts array of roles
- [ ] All auth endpoints validated with Zod

---

**Next Week:** Week 4 - Admin Dashboard Foundation
