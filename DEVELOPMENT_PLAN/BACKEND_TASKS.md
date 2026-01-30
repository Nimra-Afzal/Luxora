# Backend Development Tasks - Luxora E-commerce Platform

**Project Duration:** 4 Weeks (20 Working Days)
**Current State:** Basic CRUD app with User, Product, Category, Blog models
**Target:** Professional single-vendor e-commerce platform

---

## Existing Code Reference

Before starting, note what already exists in `/backend/`:

| What Exists | Location | What It Does |
|-------------|----------|--------------|
| User Model | `models/User.js` | Basic user with username, email, password, role (user/admin) |
| Product Model | `models/product.js` | Basic product with name, description, price, image, category |
| Category Model | `models/category.js` | Category with name, slug, parent reference |
| Blog Model | `models/Blog.js` | Blog posts (can keep or remove) |
| Auth Controller | `controllers/authController.js` | Register and login only |
| Auth Service | `services/authService.js` | Token generation (7 days), password validation |
| Auth Middleware | `middlewares/authMiddleware.js` | JWT verification |
| Admin Middleware | `middlewares/requireAdmin.js` | Checks if role is admin |
| Upload Middleware | `middlewares/upload.js` | Multer for single image upload |

**Known Bug:** `routes/productRoutes.js` imports categoryController instead of productController - FIX THIS FIRST!

---

## WEEK 1: User Management & Authentication

### Day 1-2: Enhanced User Management System

#### Enhance User Model
The current User model is too basic. Enhance it to support a professional e-commerce system.

**Current User Model has:**
- username, email, password, role (user/admin)

**Add these fields to User Model:**

```
Profile Information:
- firstName (String) - User's first name
- lastName (String) - User's last name
- phone (String) - Contact phone number
- avatar (String) - Profile picture URL

Account Status:
- status (String: active/inactive/suspended) - Default: active
- emailVerified (Boolean) - Default: false
- emailVerifiedAt (Date) - When email was verified

Security Tracking:
- lastLogin (Date) - Last successful login time
- lastLoginIP (String) - IP address of last login
- failedLoginAttempts (Number) - Count of failed logins, default: 0
- lockedUntil (Date) - Account locked until this time

User Preferences:
- preferences.newsletter (Boolean) - Subscribed to newsletter
- preferences.orderUpdates (Boolean) - Receive order emails
- preferences.promotions (Boolean) - Receive promotional emails

Expanded Roles:
- Change role enum to include: super_admin, admin, customer, inventory_manager, order_manager, content_manager, support_agent
- Default role: customer
```

**Add indexes:**
- email (unique) - already exists
- status
- role
- createdAt (descending for recent users first)

#### User Management Features

**Admin Features - Build these endpoints:**

1. **GET /api/v1/admin/users** - List all users
   - Search by name or email (query param: ?search=john)
   - Filter by role (query param: ?role=customer)
   - Filter by status (query param: ?status=active)
   - Pagination (query params: ?page=1&limit=20)
   - Sort by: createdAt, name, email (query param: ?sort=createdAt&order=desc)
   - Return: users array with pagination meta

2. **GET /api/v1/admin/users/stats** - User statistics
   - Total users count
   - New users this month
   - Users by role (count per role)
   - Users by status (count per status)

3. **GET /api/v1/admin/users/:id** - Get single user details
   - Return full user profile (exclude password)
   - Include: order count, total spent, last order date

4. **PUT /api/v1/admin/users/:id** - Update user (admin)
   - Update: firstName, lastName, phone, role, status
   - Cannot update: email, password (user does that themselves)
   - Log who made the change

5. **DELETE /api/v1/admin/users/:id** - Delete user
   - Check if user has pending orders first
   - If has pending orders: return error "Cannot delete user with pending orders"
   - Soft delete preferred (set status to 'deleted') or hard delete

**Customer Features - Build these endpoints:**

1. **GET /api/v1/auth/me** - Already exists, enhance it
   - Return full profile with preferences
   - Exclude: password, security fields

2. **PUT /api/v1/auth/me** - Update own profile
   - Can update: firstName, lastName, phone, avatar, preferences
   - Cannot update: email, role, status

3. **PUT /api/v1/auth/me/avatar** - Upload avatar
   - Accept image file
   - Save to uploads or S3
   - Update user.avatar with URL

---

### Day 2-3: Authentication System Enhancement

#### Enhance Token System
Current system uses single token with 7-day expiry. Change to:
- Access token: 15 minutes expiry (for API requests)
- Refresh token: 7 days expiry (to get new access tokens)

**Create RefreshToken Model:**
```
RefreshToken:
- token (String, unique) - The refresh token value
- user (ObjectId, ref: User) - Who owns this token
- expiresAt (Date) - When token expires
- isRevoked (Boolean) - Has token been revoked, default: false
- createdAt (Date) - When token was created
- userAgent (String) - Browser/device info
- ipAddress (String) - IP where token was created
```

**Modify Auth Service (`services/authService.js`):**

1. **generateAccessToken(user)** - Modify existing generateToken
   - Payload: { id, email, role }
   - Expiry: 15 minutes (from JWT_EXPIRES_IN env var)

2. **generateRefreshToken(user, req)** - NEW
   - Generate random token (use crypto.randomBytes)
   - Save to RefreshToken model with user reference
   - Include userAgent and IP from request
   - Expiry: 7 days
   - Return the token string

3. **refreshAccessToken(refreshToken)** - NEW
   - Find refresh token in database
   - Check: exists, not expired, not revoked
   - If valid: generate new access token, return it
   - If invalid: throw error

4. **revokeRefreshToken(token)** - NEW
   - Find token and set isRevoked = true
   - Used for logout

5. **revokeAllUserTokens(userId)** - NEW
   - Set isRevoked = true for all user's refresh tokens
   - Used when password changes

#### Enhanced Registration Flow

**Modify register() in auth controller:**

1. Validate input (email format, password strength)
2. Check if email already exists
3. Create user with emailVerified: false
4. Generate email verification token (random string, 24 hour expiry)
5. Send verification email with link: {FRONTEND_URL}/verify-email?token={token}
6. Return success message: "Registration successful. Please check your email to verify your account."

**Create EmailVerification Model:**
```
EmailVerification:
- user (ObjectId, ref: User)
- token (String, unique)
- expiresAt (Date) - 24 hours from creation
- used (Boolean) - default: false
```

**New endpoints for email verification:**

1. **POST /api/v1/auth/verify-email** - Verify email
   - Body: { token }
   - Find token, check not expired, not used
   - Update user: emailVerified = true, emailVerifiedAt = now
   - Mark token as used
   - Send welcome email
   - Return success

2. **POST /api/v1/auth/resend-verification** - Resend verification email
   - Body: { email }
   - Find user by email
   - Check: user exists, not already verified
   - Delete old verification tokens for this user
   - Create new token, send email
   - Rate limit: max 3 requests per hour per email

#### Enhanced Login Flow

**Modify login() in auth controller:**

1. Find user by email
2. Check if user exists → if not: "Invalid credentials"
3. Check if account is locked (lockedUntil > now) → if locked: "Account locked. Try again in X minutes"
4. Check if email is verified → if not: "Please verify your email first"
5. Check if account status is active → if not: "Your account has been suspended"
6. Validate password
7. If password wrong:
   - Increment failedLoginAttempts
   - If failedLoginAttempts >= 5: set lockedUntil = now + 15 minutes
   - Return: "Invalid credentials"
8. If password correct:
   - Reset failedLoginAttempts to 0
   - Clear lockedUntil
   - Update lastLogin and lastLoginIP
   - Generate access token and refresh token
   - Return: { accessToken, refreshToken, user }

**New endpoints:**

1. **POST /api/v1/auth/refresh-token** - Get new access token
   - Body: { refreshToken }
   - Validate refresh token
   - Return: { accessToken }

2. **POST /api/v1/auth/logout** - Logout
   - Body: { refreshToken }
   - Revoke the refresh token
   - Return: success

#### Password Reset Flow

**Create PasswordReset Model:**
```
PasswordReset:
- user (ObjectId, ref: User)
- token (String, unique)
- expiresAt (Date) - 1 hour from creation
- used (Boolean) - default: false
```

**New endpoints:**

1. **POST /api/v1/auth/forgot-password** - Request password reset
   - Body: { email }
   - Find user by email
   - If user exists: create reset token, send email with link
   - Always return: "If an account exists with this email, you will receive a password reset link"
   - Rate limit: max 3 requests per hour per email

2. **POST /api/v1/auth/reset-password** - Reset password with token
   - Body: { token, newPassword }
   - Find token, check not expired, not used
   - Validate password strength
   - Update user password
   - Mark token as used
   - Revoke all user's refresh tokens (log out everywhere)
   - Send "password changed" notification email
   - Return: success

3. **PUT /api/v1/auth/change-password** - Change password (logged in)
   - Requires authentication
   - Body: { currentPassword, newPassword }
   - Validate current password
   - Validate new password strength
   - Update password
   - Revoke all refresh tokens except current
   - Send "password changed" notification email
   - Return: success

#### Email Service Setup

**Create email service (`services/email.service.js`):**

Install: `npm install nodemailer`

Configure with environment variables:
```
SMTP_HOST=smtp.gmail.com (or your provider)
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@luxora.com
FRONTEND_URL=http://localhost:3000
```

**Email methods to create:**

1. **sendVerificationEmail(user, token)** - Send email verification link
2. **sendWelcomeEmail(user)** - Send after email verified
3. **sendPasswordResetEmail(user, token)** - Send password reset link
4. **sendPasswordChangedEmail(user)** - Notify password was changed
5. **sendOrderConfirmationEmail(user, order)** - Will use later

#### Middleware Updates

**Update auth middleware (`middlewares/authMiddleware.js`):**
- Verify access token (not refresh token)
- If token expired: return 401 with code "TOKEN_EXPIRED" (frontend will use refresh token)
- If token invalid: return 401 with code "TOKEN_INVALID"
- If valid: attach user to request

**Update requireAdmin middleware → rename to role.middleware.js:**
- Change from checking single role to checking array of roles
- Example: `requireRole(['admin', 'super_admin', 'inventory_manager'])`
- Check if user's role is in allowed roles array

**Create rate limiting middleware:**

Install: `npm install express-rate-limit`

Create limiters for:
- Login: 5 attempts per 15 minutes per IP
- Password reset: 3 attempts per hour per IP
- Email verification resend: 3 attempts per hour per email

#### Testing Requirements - Day 1-3

Test these flows in Postman:

1. **Registration → Email Verification → Login:**
   - Register new user
   - Try to login (should fail - email not verified)
   - Verify email with token
   - Login (should succeed, get two tokens)

2. **Token Refresh:**
   - Login, get tokens
   - Wait for access token to expire (or use short expiry for testing)
   - Use refresh token to get new access token
   - Use new access token successfully

3. **Account Lockout:**
   - Try wrong password 5 times
   - 6th attempt should say "account locked"
   - Wait 15 minutes (or manually unlock for testing)
   - Login with correct password

4. **Password Reset:**
   - Request password reset
   - Check email received
   - Reset password with token
   - Old sessions should be logged out
   - Login with new password

5. **Role-based Access:**
   - Login as customer
   - Try to access admin endpoint (should fail)
   - Login as admin
   - Access admin endpoint (should succeed)

---

### Day 4-5: Product & Category Enhancement

#### Enhance Category Model

**Current Category Model has:**
- name, slug, parent

**Add these fields:**
```
- description (String) - Category description
- image (String) - Category image URL
- status (String: active/inactive) - Default: active
- order (Number) - Display order for sorting
- productCount (Number) - Cached count of products, default: 0
```

**Add methods to Category:**
- Auto-generate slug from name on save
- Prevent circular parent references
- Update productCount when products added/removed

#### Enhance Product Model

**Current Product Model has:**
- name, description, price, image, category

**Enhance with these fields:**
```
Basic Information:
- name (String, required)
- slug (String, unique) - Auto-generated from name
- description (String) - Full description
- shortDescription (String) - For cards/lists
- category (ObjectId, ref: Category, required)
- status (String: draft/active/inactive/archived) - Default: draft

Images:
- images (Array of Objects):
  - url (String) - Image URL
  - alt (String) - Alt text
  - isPrimary (Boolean) - Is this the main image
  - order (Number) - Display order

Pricing:
- price (Number, required) - Selling price
- compareAtPrice (Number) - Original price for showing discount
- costPrice (Number) - Cost for profit calculation

Inventory:
- sku (String, unique, sparse) - Stock keeping unit
- barcode (String) - Product barcode
- quantity (Number, default: 0) - Stock quantity
- lowStockThreshold (Number, default: 10) - Alert when below this
- trackInventory (Boolean, default: true) - Whether to track stock

Details:
- brand (String) - Product brand
- tags (Array of Strings) - For filtering
- weight (Number) - Product weight
- weightUnit (String: g/kg/lb/oz) - Weight unit
- dimensions.length (Number)
- dimensions.width (Number)
- dimensions.height (Number)
- dimensions.unit (String: cm/in)

SEO:
- seo.metaTitle (String)
- seo.metaDescription (String)
- seo.metaKeywords (Array of Strings)

Reviews (denormalized for performance):
- reviewStats.averageRating (Number, default: 0)
- reviewStats.totalReviews (Number, default: 0)

Timestamps:
- createdAt, updatedAt (automatic)
- createdBy (ObjectId, ref: User) - Who created this product
```

**Add indexes:**
- slug (unique)
- sku (unique, sparse - allows null)
- category
- status
- price
- Text index on: name, description, tags

#### Category Service & Endpoints

**Create category service (`services/category.service.js`):**

1. **createCategory(data)** - Create new category
   - Auto-generate slug from name
   - If parent provided, verify parent exists
   - Prevent circular references

2. **getCategoryTree()** - Get nested category structure
   - Return categories as tree with children nested

3. **getCategoryBySlug(slug)** - Get by URL slug

4. **updateCategory(id, data)** - Update category
   - Regenerate slug if name changes

5. **deleteCategory(id)** - Delete category
   - Check if has products first
   - Check if has child categories

**Category Endpoints:**

Public:
- GET /api/v1/categories - List all active categories (flat)
- GET /api/v1/categories/tree - Get category tree (nested)
- GET /api/v1/categories/:slug - Get by slug
- GET /api/v1/categories/:id/products - Get products in category

Admin:
- POST /api/v1/admin/categories - Create category
- PUT /api/v1/admin/categories/:id - Update category
- DELETE /api/v1/admin/categories/:id - Delete category
- PUT /api/v1/admin/categories/reorder - Update display order

#### Product Service & Endpoints

**Create product service (`services/product.service.js`):**

Note: Currently productController has direct DB calls. Move logic to service layer.

1. **createProduct(data, userId)** - Create product
   - Auto-generate slug from name
   - Validate category exists
   - Set createdBy to userId

2. **updateProduct(id, data)** - Update product
   - Regenerate slug if name changes

3. **deleteProduct(id)** - Delete product
   - Also delete associated images from storage

4. **getProductBySlug(slug)** - Get by URL slug

5. **getProducts(filters, pagination, sort)** - List with filters
   - Filters: category, brand, tags, status, priceMin, priceMax, inStock
   - Search: text search on name, description
   - Pagination: page, limit
   - Sort: price, createdAt, name, rating

6. **updateInventory(id, quantity)** - Update stock

7. **getLowStockProducts()** - Products below threshold

8. **searchProducts(query)** - Text search

**Product Endpoints:**

Public:
- GET /api/v1/products - List products with filters
- GET /api/v1/products/:slug - Get by slug
- GET /api/v1/products/search?q=keyword - Search products
- GET /api/v1/products/:id/reviews - Get product reviews

Admin:
- GET /api/v1/admin/products - List all products (including drafts)
- POST /api/v1/admin/products - Create product
- PUT /api/v1/admin/products/:id - Update product
- DELETE /api/v1/admin/products/:id - Delete product
- PUT /api/v1/admin/products/:id/inventory - Update stock
- GET /api/v1/admin/products/low-stock - Get low stock alerts
- POST /api/v1/admin/products/:id/images - Add images
- DELETE /api/v1/admin/products/:id/images/:imageId - Remove image

#### Testing Requirements - Day 4-5

1. **Category Management:**
   - Create parent category
   - Create child category under parent
   - Get category tree (verify nesting)
   - Update category
   - Try to delete category with products (should fail)

2. **Product Management:**
   - Create product with multiple images
   - Verify slug auto-generated
   - Update product
   - Test all filters (category, price range, brand)
   - Test search functionality
   - Test pagination

3. **Inventory:**
   - Set low stock threshold
   - Reduce quantity below threshold
   - Get low stock alerts

---

## WEEK 2: Shopping Features

### Day 6-7: Shopping Cart & Wishlist

#### Cart Model

```
Cart:
- user (ObjectId, ref: User, optional) - For logged-in users
- sessionId (String) - For guest users
- items (Array):
  - product (ObjectId, ref: Product)
  - quantity (Number, min: 1)
  - price (Number) - Price at time of adding
  - addedAt (Date)
- coupon:
  - code (String)
  - discountType (String: percentage/fixed)
  - discountValue (Number)
  - discountAmount (Number) - Calculated discount
- subtotal (Number) - Auto-calculated
- expiresAt (Date) - For guest carts, 7 days TTL
- createdAt, updatedAt
```

**Add TTL index on expiresAt for auto-deletion of guest carts**

#### Cart Service (`services/cart.service.js`)

1. **getCart(userId or sessionId)** - Get user's cart
   - Return cart with populated product details
   - Recalculate totals in case prices changed

2. **addItem(cartId, productId, quantity)** - Add item
   - Check product exists and is active
   - Check stock availability
   - If product already in cart: update quantity
   - If new product: add to items array
   - Recalculate subtotal

3. **updateItemQuantity(cartId, itemId, quantity)** - Update quantity
   - Validate stock availability
   - If quantity is 0: remove item
   - Recalculate subtotal

4. **removeItem(cartId, itemId)** - Remove item
   - Recalculate subtotal

5. **clearCart(cartId)** - Clear all items

6. **applyCoupon(cartId, couponCode)** - Apply coupon
   - Validate coupon (exists, active, not expired, usage limit)
   - Check minimum purchase requirement
   - Calculate discount amount
   - Save coupon info to cart

7. **removeCoupon(cartId)** - Remove applied coupon

8. **mergeGuestCart(sessionId, userId)** - Merge on login
   - Find guest cart by sessionId
   - Find or create user cart
   - Merge items (combine quantities if same product)
   - Delete guest cart

9. **calculateTotals(cart)** - Recalculate subtotal
   - Sum all (item.price * item.quantity)
   - Apply coupon discount if exists

#### Cart Endpoints

All cart endpoints work for both guest and authenticated:
- If user is authenticated: use user ID
- If guest: use sessionId from cookie

- GET /api/v1/cart - Get current cart
- POST /api/v1/cart/items - Add item to cart
  - Body: { productId, quantity }
- PUT /api/v1/cart/items/:itemId - Update item quantity
  - Body: { quantity }
- DELETE /api/v1/cart/items/:itemId - Remove item
- DELETE /api/v1/cart - Clear cart
- POST /api/v1/cart/apply-coupon - Apply coupon
  - Body: { code }
- DELETE /api/v1/cart/coupon - Remove coupon
- POST /api/v1/cart/merge - Merge guest cart (after login)

#### Session Middleware for Guest Cart

Create middleware that:
- Checks for sessionId cookie
- If not exists: generate UUID, set cookie (httpOnly, 7 days)
- Attach sessionId to request

#### Wishlist Model

```
Wishlist:
- user (ObjectId, ref: User, required, unique)
- products (Array of ObjectIds, ref: Product)
- createdAt, updatedAt
```

#### Wishlist Service (`services/wishlist.service.js`)

1. **getWishlist(userId)** - Get user's wishlist with product details
2. **addProduct(userId, productId)** - Add product (prevent duplicates)
3. **removeProduct(userId, productId)** - Remove product
4. **isInWishlist(userId, productId)** - Check if product in wishlist
5. **moveToCart(userId, productId)** - Move item to cart and remove from wishlist

#### Wishlist Endpoints

All require authentication:
- GET /api/v1/wishlist - Get wishlist
- POST /api/v1/wishlist/:productId - Add product
- DELETE /api/v1/wishlist/:productId - Remove product
- POST /api/v1/wishlist/:productId/move-to-cart - Move to cart

#### Testing Requirements - Day 6-7

1. **Guest Cart:**
   - Add items without logging in
   - Verify sessionId cookie set
   - Update quantities
   - Clear cart
   - Verify cart deleted after 7 days (or test TTL)

2. **User Cart:**
   - Login, add items
   - Verify cart persists across sessions

3. **Cart Merge:**
   - Add items as guest
   - Login
   - Verify guest cart merged with user cart

4. **Coupon:**
   - Create coupon (via admin)
   - Apply to cart
   - Verify discount calculated correctly
   - Try invalid/expired coupon

5. **Wishlist:**
   - Add products to wishlist
   - View wishlist
   - Move item to cart
   - Verify removed from wishlist after moving

---

### Day 8-9: Order System

#### Address Model

```
Address:
- user (ObjectId, ref: User, required)
- type (String: shipping/billing)
- isDefault (Boolean, default: false)
- firstName (String, required)
- lastName (String, required)
- company (String)
- address1 (String, required)
- address2 (String)
- city (String, required)
- state (String, required)
- postalCode (String, required)
- country (String, required)
- phone (String, required)
- createdAt, updatedAt
```

#### Order Model

```
Order:
- orderNumber (String, unique) - Auto-generated: ORD-20231215-0001
- user (ObjectId, ref: User)
- customerEmail (String) - Denormalized for quick access
- customerName (String) - Denormalized
- isGuest (Boolean) - Was this a guest checkout

Items (snapshot at order time):
- items (Array):
  - product (ObjectId, ref: Product)
  - name (String) - Product name at order time
  - sku (String)
  - price (Number) - Price at order time
  - quantity (Number)
  - total (Number) - price * quantity
  - image (String) - Product image URL

Pricing:
- subtotal (Number)
- discount:
  - code (String) - Coupon code used
  - type (String)
  - amount (Number)
- shipping:
  - method (String)
  - cost (Number)
- tax:
  - rate (Number)
  - amount (Number)
- total (Number) - Final total

Addresses (snapshot at order time):
- shippingAddress (embedded document with all address fields)
- billingAddress (embedded document)

Status:
- status (String): pending, confirmed, processing, shipped, delivered, cancelled, refunded
- paymentStatus (String): pending, paid, failed, refunded, partially_refunded
- paymentMethod (String)
- stripePaymentIntentId (String)

Shipping:
- trackingNumber (String)
- trackingUrl (String)
- shippedAt (Date)
- deliveredAt (Date)

Notes:
- customerNotes (String) - Notes from customer
- adminNotes (String) - Internal notes

Status History:
- statusHistory (Array):
  - status (String)
  - timestamp (Date)
  - note (String)
  - updatedBy (ObjectId, ref: User)

Timestamps:
- createdAt, updatedAt
```

#### Order Service (`services/order.service.js`)

1. **createOrder(userId, cartId, shippingAddressId, billingAddressId, paymentMethod):**
   - Validate cart exists and has items
   - Validate addresses
   - Check stock availability for all items
   - Calculate totals (subtotal, discount, shipping, tax)
   - Create order with product snapshots
   - Reserve inventory (decrease stock)
   - Clear user's cart
   - Send order confirmation email
   - Return order

2. **generateOrderNumber():**
   - Format: ORD-YYYYMMDD-XXXX
   - Example: ORD-20231215-0001
   - Ensure unique

3. **getOrderByNumber(orderNumber, userId):**
   - Get order, verify user owns it (or is admin)

4. **getUserOrders(userId, pagination):**
   - Get user's orders with pagination
   - Sort by createdAt descending

5. **updateOrderStatus(orderId, status, note, adminId):**
   - Update status
   - Add to statusHistory
   - Send status update email to customer
   - If cancelled: restore inventory

6. **cancelOrder(orderId, userId):**
   - Verify user owns order
   - Verify order can be cancelled (only pending/confirmed)
   - Update status to cancelled
   - Restore inventory

7. **addTrackingInfo(orderId, trackingNumber, trackingUrl):**
   - Update tracking info
   - Update status to shipped
   - Send shipping notification email

#### Address Service (`services/address.service.js`)

1. **getUserAddresses(userId)** - Get all user's addresses
2. **createAddress(userId, data)** - Create new address
   - If isDefault: unset other defaults of same type
3. **updateAddress(addressId, userId, data)** - Update address
4. **deleteAddress(addressId, userId)** - Delete address
5. **setDefault(addressId, userId)** - Set as default

#### Order Endpoints

Customer:
- GET /api/v1/orders - Get my orders (paginated)
- GET /api/v1/orders/:orderNumber - Get order details
- POST /api/v1/orders - Create order (from cart)
  - Body: { shippingAddressId, billingAddressId, paymentMethod, customerNotes }
- POST /api/v1/orders/:orderNumber/cancel - Cancel order

Admin:
- GET /api/v1/admin/orders - List all orders with filters
  - Filters: status, paymentStatus, dateFrom, dateTo, customer
- GET /api/v1/admin/orders/:id - Get order details
- PUT /api/v1/admin/orders/:id/status - Update status
  - Body: { status, note }
- POST /api/v1/admin/orders/:id/ship - Add tracking and mark shipped
  - Body: { trackingNumber, trackingUrl }
- POST /api/v1/admin/orders/:id/refund - Process refund
  - Body: { amount, reason }

Address Endpoints:
- GET /api/v1/addresses - Get my addresses
- GET /api/v1/addresses/:id - Get single address
- POST /api/v1/addresses - Create address
- PUT /api/v1/addresses/:id - Update address
- DELETE /api/v1/addresses/:id - Delete address
- PUT /api/v1/addresses/:id/default - Set as default

#### Testing Requirements - Day 8-9

1. **Address Management:**
   - Create multiple addresses
   - Set default address
   - Verify old default unset when new default set
   - Update and delete addresses

2. **Order Creation:**
   - Add items to cart
   - Create order
   - Verify stock decreased
   - Verify cart cleared
   - Verify order number generated
   - Verify email sent (check logs or mock)

3. **Order Lifecycle:**
   - Create order (status: pending)
   - Admin confirms (status: confirmed)
   - Admin processes (status: processing)
   - Admin ships with tracking (status: shipped)
   - Admin delivers (status: delivered)
   - Verify status history recorded

4. **Order Cancellation:**
   - Create order
   - Cancel as customer
   - Verify stock restored
   - Try to cancel shipped order (should fail)

---

### Day 10: Reviews & Coupons

#### Review Model

```
Review:
- product (ObjectId, ref: Product, required)
- user (ObjectId, ref: User, required)
- rating (Number, 1-5, required)
- title (String, required)
- comment (String, required)
- images (Array of Strings) - Review image URLs
- isVerifiedPurchase (Boolean) - Did user buy this product
- status (String: pending/approved/rejected) - Default: pending
- helpfulCount (Number, default: 0) - Users who found helpful
- createdAt, updatedAt
```

**Add unique compound index on (product, user) - one review per user per product**

#### Coupon Model

```
Coupon:
- code (String, unique, uppercase)
- type (String: percentage/fixed)
- value (Number) - Discount value (10 for 10% or $10)
- minPurchase (Number) - Minimum cart total required
- maxDiscount (Number) - Maximum discount cap (for percentage)
- usageLimit (Number) - How many times can be used total
- usedCount (Number, default: 0)
- startDate (Date)
- endDate (Date)
- isActive (Boolean, default: true)
- createdAt, updatedAt
```

#### Review Service (`services/review.service.js`)

1. **createReview(userId, productId, data):**
   - Check user hasn't already reviewed this product
   - Check if user purchased this product (for verified badge)
   - Create review with status: pending
   - Return review

2. **getProductReviews(productId, pagination):**
   - Get only approved reviews
   - Populate user (name, avatar)
   - Sort by: createdAt, rating, helpfulCount

3. **updateReview(reviewId, userId, data):**
   - Verify user owns review
   - Update review, reset status to pending

4. **deleteReview(reviewId, userId):**
   - Verify user owns review (or is admin)
   - Delete review
   - Update product rating stats

5. **approveReview(reviewId, adminId):**
   - Update status to approved
   - Update product rating stats

6. **rejectReview(reviewId, adminId, reason):**
   - Update status to rejected

7. **markHelpful(reviewId, userId):**
   - Increment helpfulCount
   - (Optional: track who marked helpful to prevent duplicates)

8. **updateProductRatingStats(productId):**
   - Calculate average rating from approved reviews
   - Update product.reviewStats

#### Coupon Service (`services/coupon.service.js`)

1. **createCoupon(data):**
   - Convert code to uppercase
   - Validate dates (end > start)
   - Create coupon

2. **validateCoupon(code, cartTotal):**
   - Find coupon by code
   - Check: exists, isActive, within date range, usage limit not exceeded
   - Check: cart meets minimum purchase
   - Calculate discount amount (respect maxDiscount for percentage)
   - Return coupon details and calculated discount

3. **incrementUsage(couponId):**
   - Increment usedCount

4. **getCoupons(filters):**
   - Filters: active, expired, all

#### Review Endpoints

Customer:
- GET /api/v1/products/:productId/reviews - Get product reviews
- POST /api/v1/products/:productId/reviews - Create review
  - Body: { rating, title, comment, images }
- PUT /api/v1/reviews/:id - Update own review
- DELETE /api/v1/reviews/:id - Delete own review
- POST /api/v1/reviews/:id/helpful - Mark as helpful

Admin:
- GET /api/v1/admin/reviews - List all reviews with filters
- GET /api/v1/admin/reviews/pending - List pending reviews
- PUT /api/v1/admin/reviews/:id/approve - Approve review
- PUT /api/v1/admin/reviews/:id/reject - Reject review
  - Body: { reason }
- DELETE /api/v1/admin/reviews/:id - Delete any review

#### Coupon Endpoints

- POST /api/v1/coupons/validate - Validate coupon (public)
  - Body: { code, cartTotal }

Admin:
- GET /api/v1/admin/coupons - List all coupons
- POST /api/v1/admin/coupons - Create coupon
- PUT /api/v1/admin/coupons/:id - Update coupon
- DELETE /api/v1/admin/coupons/:id - Delete coupon

#### Testing Requirements - Day 10

1. **Reviews:**
   - Create review for purchased product
   - Verify isVerifiedPurchase set correctly
   - Try to create duplicate review (should fail)
   - Admin approves review
   - Verify product rating updated
   - Mark review as helpful

2. **Coupons:**
   - Create percentage coupon (20% off)
   - Create fixed coupon ($10 off)
   - Test minimum purchase requirement
   - Test maximum discount cap
   - Test usage limit
   - Test date validation (expired coupon)
   - Apply to cart, verify calculation

---

## WEEK 3: Admin Dashboard & Advanced Features

### Day 11-12: Admin Dashboard & Analytics

#### Analytics Service (`services/analytics.service.js`)

1. **getDashboardOverview():**
   ```
   Return:
   - totalOrders (all time)
   - totalRevenue (all time)
   - totalUsers
   - newUsersThisMonth
   - averageOrderValue
   - ordersToday
   - revenueToday
   ```

2. **getSalesByPeriod(startDate, endDate, groupBy):**
   ```
   groupBy: day, week, month
   Return array:
   - date
   - orders count
   - revenue
   ```

3. **getOrdersByStatus():**
   ```
   Return counts for each status:
   - pending, confirmed, processing, shipped, delivered, cancelled
   ```

4. **getTopProducts(limit):**
   ```
   Return top selling products:
   - product info
   - totalQuantitySold
   - totalRevenue
   ```

5. **getTopCategories(limit):**
   ```
   Return top categories by revenue:
   - category info
   - totalProducts
   - totalRevenue
   ```

6. **getCustomerStats():**
   ```
   Return:
   - totalCustomers
   - newThisMonth
   - returningCustomers (ordered more than once)
   - averageOrdersPerCustomer
   ```

7. **getLowStockProducts():**
   ```
   Return products where quantity <= lowStockThreshold
   ```

8. **getRecentOrders(limit):**
   ```
   Return recent orders with customer info
   ```

#### Analytics Endpoints

All require admin role:
- GET /api/v1/admin/analytics/overview - Dashboard summary
- GET /api/v1/admin/analytics/sales?startDate=&endDate=&groupBy= - Sales data
- GET /api/v1/admin/analytics/orders-by-status - Order status breakdown
- GET /api/v1/admin/analytics/top-products?limit=10 - Top products
- GET /api/v1/admin/analytics/top-categories?limit=10 - Top categories
- GET /api/v1/admin/analytics/customers - Customer stats
- GET /api/v1/admin/analytics/low-stock - Low stock alerts
- GET /api/v1/admin/analytics/recent-orders - Recent orders

#### Report Export

- GET /api/v1/admin/reports/sales/export?startDate=&endDate=&format=csv
- GET /api/v1/admin/reports/orders/export?startDate=&endDate=&format=csv
- GET /api/v1/admin/reports/products/export?format=csv

Install: `npm install json2csv`

Create CSV from data and return as downloadable file.

---

### Day 13: File Upload & Stripe Integration

#### File Upload System

**Enhance existing upload middleware:**

Current: Single image upload with multer to local storage

Enhance to support:
1. Multiple images per request (for products)
2. Image validation (type, size)
3. Image processing (resize, compress)
4. Option to upload to AWS S3 or keep local

**Install:**
```
npm install sharp (for image processing)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner (for S3)
```

**Create upload service (`services/upload.service.js`):**

1. **uploadImage(file, folder):**
   - Validate file type (jpg, png, webp only)
   - Validate file size (max 5MB)
   - Process image: resize, compress
   - Upload to S3 or save locally (based on config)
   - Return URL

2. **uploadImages(files, folder):**
   - Same as above, for multiple files

3. **deleteImage(url):**
   - Delete from S3 or local storage

**Upload Endpoints:**

- POST /api/v1/upload/image - Upload single image
- POST /api/v1/upload/images - Upload multiple images (max 10)
- DELETE /api/v1/upload/image - Delete image
  - Body: { url }

**Environment Variables for S3:**
```
USE_S3=true (or false for local)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=luxora-images
AWS_CLOUDFRONT_URL= (optional, for CDN)
```

#### Stripe Integration

**Install:** `npm install stripe`

**Environment Variables:**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Create Stripe service (`services/stripe.service.js`):**

1. **createPaymentIntent(amount, currency, metadata):**
   - Create Stripe PaymentIntent
   - Return clientSecret (for frontend)

2. **confirmPayment(paymentIntentId):**
   - Retrieve and return payment intent status

3. **createRefund(paymentIntentId, amount, reason):**
   - Create refund in Stripe
   - Return refund details

**Payment Model:**

```
Payment:
- order (ObjectId, ref: Order)
- amount (Number)
- currency (String, default: USD)
- method (String: card, etc.)
- status (String: pending/succeeded/failed)
- stripePaymentIntentId (String)
- stripeChargeId (String)
- createdAt, updatedAt
```

**Refund Model:**

```
Refund:
- order (ObjectId, ref: Order)
- payment (ObjectId, ref: Payment)
- amount (Number)
- reason (String)
- status (String: pending/succeeded/failed)
- stripeRefundId (String)
- processedBy (ObjectId, ref: User)
- createdAt, updatedAt
```

**Checkout Service Updates:**

Update order creation to:
1. Create PaymentIntent before order
2. Return clientSecret to frontend
3. Frontend completes payment with Stripe.js
4. Webhook confirms payment → order confirmed

**Webhook Controller:**

Create: POST /api/v1/webhooks/stripe

Handle events:
- payment_intent.succeeded → Update order paymentStatus to paid, status to confirmed
- payment_intent.payment_failed → Update order paymentStatus to failed
- charge.refunded → Update order paymentStatus

**Important:** Webhook route needs raw body for signature verification.

**Checkout Endpoints:**

- POST /api/v1/checkout/create-payment-intent
  - Body: { cartId, shippingAddressId, billingAddressId }
  - Returns: { clientSecret, orderId }

- POST /api/v1/checkout/confirm
  - Body: { orderId, paymentIntentId }
  - Verifies payment succeeded, confirms order

---

### Day 14: Final Features & Validation

#### Data Validation

**Install:** `npm install zod`

**Create validators for all endpoints:**

`validators/auth.validator.js`:
```javascript
- registerSchema: email, password (min 8, uppercase, number), firstName, lastName
- loginSchema: email, password
- forgotPasswordSchema: email
- resetPasswordSchema: token, newPassword
- changePasswordSchema: currentPassword, newPassword
```

`validators/product.validator.js`:
```javascript
- createProductSchema: name, description, price (positive), category, etc.
- updateProductSchema: same but all optional
- updateInventorySchema: quantity (non-negative)
```

`validators/order.validator.js`:
```javascript
- createOrderSchema: shippingAddressId, billingAddressId
- updateStatusSchema: status (valid enum)
```

`validators/review.validator.js`:
```javascript
- createReviewSchema: rating (1-5), title, comment
```

`validators/coupon.validator.js`:
```javascript
- createCouponSchema: code, type, value, dates
- validateCouponSchema: code
```

**Create validation middleware:**

```javascript
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
```

Apply to all routes.

#### Error Handling

**Create centralized error handler:**

```javascript
// utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Log unexpected errors
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

#### Seed Script

**Create `scripts/seed.js`:**

Creates:
1. Admin user: admin@luxora.com / Admin@123 (email verified)
2. Test customer: customer@test.com / Test@123
3. 10 categories (Electronics, Clothing, Books, etc.)
4. 30 products with images
5. Sample coupons: WELCOME20 (20% off), SAVE10 ($10 off $50+)

Run: `node scripts/seed.js`

---

## WEEK 4: Testing & Deployment

### Day 15-16: Complete Testing

#### Test All Flows in Postman

Create Postman collection with folders:
1. Auth
2. Users
3. Products
4. Categories
5. Cart
6. Wishlist
7. Orders
8. Reviews
9. Coupons
10. Admin

**Test Cases:**

Authentication:
- [ ] Register new user
- [ ] Verify email
- [ ] Login (get tokens)
- [ ] Refresh token
- [ ] Logout
- [ ] Forgot password
- [ ] Reset password
- [ ] Change password
- [ ] Account lockout

Products:
- [ ] List products
- [ ] Search products
- [ ] Filter by category, price, brand
- [ ] Get single product
- [ ] Create product (admin)
- [ ] Update product (admin)
- [ ] Delete product (admin)
- [ ] Upload images

Cart:
- [ ] Add item
- [ ] Update quantity
- [ ] Remove item
- [ ] Apply coupon
- [ ] Clear cart
- [ ] Guest cart
- [ ] Merge on login

Orders:
- [ ] Create order
- [ ] View orders
- [ ] Cancel order
- [ ] Admin update status
- [ ] Add tracking
- [ ] Process refund

Reviews:
- [ ] Create review
- [ ] List reviews
- [ ] Admin approve/reject
- [ ] Product rating updates

---

### Day 17-18: Security & Performance

#### Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT secrets are strong
- [ ] Rate limiting on auth endpoints
- [ ] Input validation on all endpoints
- [ ] File upload validation
- [ ] CORS configured properly
- [ ] Helmet security headers
- [ ] No sensitive data in responses
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention

#### Performance Checklist

- [ ] Database indexes on frequently queried fields
- [ ] Pagination on all list endpoints
- [ ] Image compression
- [ ] Efficient queries (avoid N+1)
- [ ] Response caching headers

---

### Day 19-20: Documentation & Deployment

#### Documentation

Create README.md with:
- Project overview
- Tech stack
- Installation steps
- Environment variables
- API endpoints summary
- Database schema

Create API documentation (Postman collection export or Swagger)

#### Deployment Prep

**Environment Variables for Production:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-long-random-string
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.com
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=noreply@luxora.com
FRONTEND_URL=https://your-frontend.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

**Pre-deployment:**
- Remove console.logs
- Test with production database
- Configure CORS for production URL
- Set up error logging (Sentry)
- Set up monitoring

---

## Required Packages Summary

```json
{
  "dependencies": {
    "express": "^5.0.0",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "nodemailer": "^6.9.0",
    "express-rate-limit": "^7.0.0",
    "multer": "^1.4.5",
    "sharp": "^0.33.0",
    "@aws-sdk/client-s3": "^3.0.0",
    "stripe": "^14.0.0",
    "zod": "^3.22.0",
    "slugify": "^1.6.0",
    "json2csv": "^6.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

---

## Final Checklist

### Functional Features
- [ ] User registration with email verification
- [ ] Login with access + refresh tokens
- [ ] Password reset flow
- [ ] Account lockout after failed attempts
- [ ] User profile management
- [ ] Category CRUD with hierarchy
- [ ] Product CRUD with images
- [ ] Product search and filters
- [ ] Shopping cart (guest + user)
- [ ] Wishlist
- [ ] Address management
- [ ] Order creation and tracking
- [ ] Payment integration (Stripe)
- [ ] Review system with moderation
- [ ] Coupon system
- [ ] Admin dashboard analytics
- [ ] File uploads

### Security
- [ ] Password hashing
- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Input validation
- [ ] File upload validation
- [ ] CORS configuration
- [ ] Security headers

### Quality
- [ ] Error handling
- [ ] Logging
- [ ] API documentation
- [ ] Code comments
- [ ] Environment configuration

---

**Project Complete!** 🎉
