# Frontend Development Tasks - Luxora E-commerce Platform

**Project Duration:** 4 Weeks (20 Working Days)
**Current State:** Next.js 15 app with basic auth, product listing, blog CRUD, and admin dashboard
**Target:** Professional single-vendor e-commerce frontend

---

## Existing Code Reference

Before starting, note what already exists in `/frontend/`:

| What Exists | Location | What It Does |
|-------------|----------|--------------|
| Auth Pages | `app/login/page.tsx`, `app/signup/page.tsx` | Basic login/signup forms |
| Dashboard | `app/dashboard/page.tsx` | Role-based sidebar, blogs section |
| Product Pages | `app/products/[id]/page.tsx`, `app/dashboard/products/` | Product detail and admin CRUD |
| Category Pages | `app/dashboard/categories/` | Admin category management |
| Redux Store | `redux/store.ts` | Configured with auth, theme, products, categories, blogs |
| Auth Slice | `redux/features/authSlice.ts` | Login, signup, logout actions |
| Product Slice | `redux/features/productSlice.ts` | CRUD operations |
| API Client | `lib/api.ts` | Axios instance with auth interceptor |
| UI Components | `components/ui/` | 30+ shadcn/ui components ready |
| Theme System | Redux + ThemeWatcher | Dark/light mode working |

**What's Missing:**
- Cart system (no cart slice, no cart UI)
- Wishlist functionality
- Checkout flow
- Order management pages
- User profile/settings pages
- Address management
- Review/rating components
- Proper product filtering/search
- Payment integration (Stripe)
- Email verification UI
- Password reset UI

---

## WEEK 1: Authentication Enhancement & User Features

### Day 1-2: Enhanced Authentication UI

#### Email Verification Flow

The backend now supports email verification. Build the frontend for it.

**Create Verify Email Page (`app/verify-email/page.tsx`):**

What it should do:
- Extract token from URL query parameter: `/verify-email?token=xxx`
- On load, call API: POST `/api/v1/auth/verify-email` with { token }
- Show loading spinner while verifying
- On success: Show "Email verified successfully!" with confetti or check icon
- Provide button to "Continue to Login"
- On error: Show friendly error message
- If token expired: Show "Link expired" with "Resend Verification Email" button

**Create Resend Verification Page (`app/resend-verification/page.tsx`):**

What it should do:
- Simple form with email input
- On submit, call API: POST `/api/v1/auth/resend-verification` with { email }
- Show success message: "If an account exists, we've sent a new verification email"
- Rate limit hint: "Please wait 60 seconds before requesting again"

#### Password Reset Flow

**Create Forgot Password Page (`app/forgot-password/page.tsx`):**

What it should do:
- Form with email input
- Validate email format (use Zod schema)
- On submit, call API: POST `/api/v1/auth/forgot-password` with { email }
- Always show: "If an account exists with this email, you will receive a password reset link"
- Provide link back to login page
- Show loading state during API call

**Create Reset Password Page (`app/reset-password/page.tsx`):**

What it should do:
- Extract token from URL: `/reset-password?token=xxx`
- Form with:
  - New password input
  - Confirm password input
- Password requirements display:
  - At least 8 characters
  - One uppercase letter
  - One number
- Real-time validation as user types
- On submit, call API: POST `/api/v1/auth/reset-password` with { token, newPassword }
- On success: Redirect to login with toast "Password reset successfully"
- On error: Show appropriate message (token expired, etc.)

#### Update Login Page

**Modify `app/login/page.tsx`:**

Current: Basic email/password form
Add:
- "Forgot Password?" link below password field → links to `/forgot-password`
- Handle new API responses:
  - "Please verify your email first" → Show message with link to resend verification
  - "Account locked" → Show lockout message with remaining time
- Store both accessToken AND refreshToken from new API response
- Update auth slice to handle refresh tokens

#### Update Signup Page

**Modify `app/signup/page.tsx`:**

Current: Basic username/email/password form
Add:
- First name and Last name fields (required)
- Phone number field (optional)
- Password strength indicator
- Terms of service checkbox with link
- After successful signup: Show "Check your email to verify your account" message
- Don't auto-redirect to login (email not verified yet)

#### Update Auth Slice

**Modify `redux/features/authSlice.ts`:**

Current: Stores single token
Change to:
```
State:
- user (object with all user fields)
- accessToken (short-lived)
- refreshToken (long-lived)
- isAuthenticated
- loading
- error
```

Add new thunks:
- `refreshAccessToken()` - Call POST `/api/v1/auth/refresh-token`
- `logout()` - Call POST `/api/v1/auth/logout` with refresh token, then clear state
- `verifyEmail(token)` - For email verification
- `forgotPassword(email)` - For password reset request
- `resetPassword({ token, newPassword })` - For password reset

Add new reducers:
- Handle token expiry gracefully
- Clear tokens on 401 response

#### Update API Interceptor

**Modify `lib/api.ts`:**

Current: Adds access token to requests
Add:
- Response interceptor that checks for 401 errors
- If 401 with "TOKEN_EXPIRED" code:
  - Automatically call refresh token endpoint
  - Retry original request with new access token
  - If refresh fails: logout user, redirect to login
- Store new access token after refresh

#### Testing Requirements - Day 1-2

Test these flows in browser:

1. **Sign Up → Email Verification:**
   - Create new account
   - Check console/email for verification link
   - Click link, verify email verified
   - Now login works

2. **Password Reset:**
   - Click forgot password
   - Enter email
   - Check for reset link
   - Reset password
   - Login with new password

3. **Token Refresh:**
   - Login, get tokens
   - Wait for access token to expire (or modify expiry for testing)
   - Make API request
   - Verify token refreshed automatically
   - Request succeeds

4. **Account Lockout:**
   - Try wrong password 5 times
   - See lockout message
   - Wait or clear lockout
   - Login successfully

---

### Day 3-4: User Profile & Settings

#### Create Profile Page

**Create User Profile Page (`app/profile/page.tsx`):**

What it should do:
- Display user's current information:
  - Avatar (clickable to change)
  - First Name, Last Name
  - Email (non-editable, show verified badge if verified)
  - Phone
  - Member since date
- Edit mode toggle
- Form for updating profile:
  - First name, Last name (required)
  - Phone (optional)
- Save changes button
- Show loading/success states

**Create Profile Components:**

1. **`components/profile/ProfileHeader.tsx`:**
   - Avatar with upload overlay on hover
   - User name and email display
   - "Verified" badge if email verified

2. **`components/profile/ProfileForm.tsx`:**
   - Form fields for editable user data
   - Uses react-hook-form + Zod validation
   - Save/Cancel buttons

3. **`components/profile/AvatarUpload.tsx`:**
   - Avatar display with edit overlay
   - File input (hidden, triggered by click)
   - Preview before upload
   - Call API: PUT `/api/v1/auth/me/avatar`
   - Update Redux user state after upload

#### Create Settings Page

**Create Settings Page (`app/settings/page.tsx`):**

Tabs/sections:
1. **Account Settings**
   - Change password section
   - Current password, new password, confirm password
   - Password strength requirements
   - Call API: PUT `/api/v1/auth/change-password`

2. **Notification Preferences**
   - Toggle switches:
     - Email for order updates
     - Email for promotions
     - Newsletter subscription
   - Auto-save on toggle change
   - Call API: PUT `/api/v1/auth/me` with preferences

3. **Security**
   - Show active sessions (future feature)
   - Last login date and IP
   - "Log out of all devices" button

#### User Slice Update

**Create or update `redux/features/userSlice.ts`:**

Add thunks:
- `getProfile()` - GET `/api/v1/auth/me`
- `updateProfile(data)` - PUT `/api/v1/auth/me`
- `updateAvatar(file)` - PUT `/api/v1/auth/me/avatar`
- `changePassword(data)` - PUT `/api/v1/auth/change-password`
- `updatePreferences(preferences)` - PUT `/api/v1/auth/me`

State:
```
{
  profile: null | UserProfile,
  loading: false,
  error: null
}
```

#### Address Management

**Create Address Book Page (`app/addresses/page.tsx`):**

What it should do:
- List all user's addresses (shipping and billing)
- Show default address with badge
- Add new address button
- Edit/delete each address
- Set as default button

**Create Address Components:**

1. **`components/address/AddressList.tsx`:**
   - Grid/list of AddressCard components
   - Empty state: "No addresses yet. Add your first address."

2. **`components/address/AddressCard.tsx`:**
   - Display address info formatted nicely
   - Name, address lines, city, state, zip, country, phone
   - "Default" badge if default
   - Edit and Delete buttons
   - "Set as Default" button if not default

3. **`components/address/AddressForm.tsx`:**
   - Form fields:
     - First name, Last name
     - Company (optional)
     - Address line 1 (required)
     - Address line 2 (optional)
     - City (required)
     - State/Province (required)
     - Postal code (required)
     - Country dropdown (required)
     - Phone (required)
   - Type selection: Shipping / Billing
   - "Set as default" checkbox
   - Uses Zod validation

**Create Address Modal (`components/address/AddressModal.tsx`):**
- Modal wrapper for AddressForm
- Used for both create and edit
- Title changes based on mode

#### Address Slice

**Create `redux/features/addressSlice.ts`:**

State:
```
{
  addresses: [],
  loading: false,
  error: null
}
```

Thunks:
- `getAddresses()` - GET `/api/v1/addresses`
- `createAddress(data)` - POST `/api/v1/addresses`
- `updateAddress({ id, data })` - PUT `/api/v1/addresses/{id}`
- `deleteAddress(id)` - DELETE `/api/v1/addresses/{id}`
- `setDefaultAddress(id)` - PUT `/api/v1/addresses/{id}/default`

#### Testing Requirements - Day 3-4

1. **Profile Management:**
   - View profile
   - Edit profile fields
   - Upload new avatar
   - Verify changes persist

2. **Change Password:**
   - Enter current password
   - Enter new password
   - Verify strength requirements
   - Confirm password change works
   - Login with new password

3. **Address Book:**
   - Add new shipping address
   - Add new billing address
   - Edit address
   - Set as default
   - Delete address

---

### Day 5: Dashboard Enhancement

#### Restructure Dashboard

**Modify Dashboard Layout:**

Current: Single page with sidebar and blogs section
Change to: Proper dashboard layout with multiple sections

**Create Dashboard Layout (`app/dashboard/layout.tsx`):**
- Sidebar navigation (already exists, enhance it)
- Main content area with outlet
- Header with user avatar and quick actions

**Update Sidebar Navigation:**

For Customers (role: customer):
- Dashboard Home
- My Orders
- Wishlist
- Addresses
- Profile
- Settings

For Admins (role: admin, super_admin):
All customer items PLUS:
- Products
- Categories
- Orders (admin view)
- Customers
- Coupons
- Reviews
- Analytics
- Settings

**Create Dashboard Home Page (`app/dashboard/page.tsx`):**

For Customers:
- Welcome message with name
- Quick stats cards:
  - Total Orders
  - Pending Orders
  - Wishlist Items
  - Total Spent
- Recent Orders table (last 5)
- Quick actions: "Browse Products", "View Wishlist"

For Admins:
- Quick stats cards:
  - Today's Revenue
  - Total Orders
  - Pending Orders
  - Low Stock Products
- Recent orders table
- Quick actions for common tasks

**Create Stats Card Component (`components/dashboard/StatsCard.tsx`):**
- Icon (from Lucide)
- Title
- Value (large number)
- Trend indicator (optional: +5% vs last month)
- Color-coded based on type

**Create Recent Orders Table (`components/dashboard/RecentOrders.tsx`):**
- Table columns: Order #, Date, Status, Total
- Status badge (color-coded)
- Click row to view order details
- "View All" link

#### Testing Requirements - Day 5

1. **Customer Dashboard:**
   - Login as customer
   - See welcome message
   - Stats cards show correct numbers
   - Recent orders display
   - Quick actions work

2. **Admin Dashboard:**
   - Login as admin
   - See admin stats
   - All navigation items visible
   - Can access admin sections

---

## WEEK 2: Shopping Features

### Day 6-7: Product Browsing & Search

#### Enhanced Product List Page

**Create Products Page (`app/products/page.tsx`):**

Current: Basic product grid exists
Enhance with:

1. **Search Bar:**
   - Text input with search icon
   - Debounced search (300ms)
   - Call API: GET `/api/v1/products/search?q=keyword`
   - Clear button when has text

2. **Filter Sidebar (`components/products/ProductFilters.tsx`):**
   - Category filter (checkboxes for each category)
   - Price range slider (min-max)
   - Brand filter (if applicable)
   - Rating filter (stars)
   - In Stock only toggle
   - "Clear All Filters" button

3. **Sort Dropdown:**
   - Options:
     - Newest First (default)
     - Price: Low to High
     - Price: High to Low
     - Best Rated
     - Most Popular
   - Updates URL query params

4. **Product Grid:**
   - Responsive grid (4 cols desktop, 3 tablet, 2 mobile, 1 small mobile)
   - ProductCard components
   - Loading skeletons while fetching

5. **Pagination:**
   - Page numbers with prev/next
   - "Showing X-Y of Z products"
   - URL-based pagination (?page=2)

6. **Mobile Filter Drawer:**
   - On mobile, filters in slide-out drawer
   - Filter button shows active filter count

#### Enhanced Product Card

**Modify `components/ProductCard.tsx`:**

Current: Shows image, name, price, category
Add:
- Wishlist button (heart icon, top right)
- Quick add to cart button (on hover)
- Rating stars display
- "Out of Stock" badge when quantity = 0
- Compare price strikethrough if on sale
- Category badge

#### Product Detail Page Enhancement

**Modify `app/products/[id]/page.tsx`:**

Current: Basic product info display
Enhance with:

1. **Image Gallery:**
   - Main large image
   - Thumbnail strip below
   - Click thumbnail to change main
   - Zoom on hover (optional)
   - Lightbox on click (optional)

2. **Product Info:**
   - Name (h1)
   - Rating with review count
   - Price (with compare price if sale)
   - Short description
   - Category breadcrumb
   - SKU display
   - Stock status (In Stock / Only X left / Out of Stock)

3. **Actions:**
   - Quantity selector (+/-)
   - Add to Cart button (large, primary)
   - Add to Wishlist button
   - Share button (copy link)

4. **Tabs Section:**
   - Description tab (full description)
   - Reviews tab (list of reviews + add review form)
   - Shipping info tab (static info)

5. **Related Products:**
   - "You might also like" section
   - 4 products from same category

#### Product Slice Enhancement

**Modify `redux/features/productSlice.ts`:**

Current thunks:
- `getProducts(params)` - basic list

Add:
- `searchProducts(query)` - search with text
- `getProductBySlug(slug)` - for detail page
- `getProductsByCategory(categorySlug)` - for category pages
- `getRelatedProducts(productId)` - for detail page

Add filters to getProducts:
```
params: {
  page, limit,
  category,
  minPrice, maxPrice,
  brand,
  inStock,
  sort,
  search
}
```

#### Category Navigation

**Create Category Page (`app/categories/[slug]/page.tsx`):**

What it should do:
- Display category name as title
- Show category description (if any)
- Show child categories (if parent category)
- Product grid filtered by this category
- Reuse ProductFilters component

**Create Category Navigation Component (`components/CategoryNav.tsx`):**
- Horizontal scrollable list of top-level categories
- Dropdown for subcategories on hover
- Use on products page and homepage

#### Testing Requirements - Day 6-7

1. **Product Search:**
   - Search for product
   - Results update as you type
   - Clear search works

2. **Filters:**
   - Filter by category
   - Filter by price range
   - Combine multiple filters
   - Clear all filters
   - URL reflects filters

3. **Sort:**
   - Sort by price low to high
   - Sort by price high to low
   - Sort by newest

4. **Pagination:**
   - Navigate pages
   - URL updates with page number
   - Back button works

5. **Product Detail:**
   - View product
   - Image gallery works
   - Quantity selector works
   - Add to cart (after cart implemented)

---

### Day 8-9: Shopping Cart

#### Cart Slice

**Create `redux/features/cartSlice.ts`:**

State:
```
{
  items: [
    {
      id: string,
      product: {
        _id, name, slug, price, images, quantity (stock)
      },
      quantity: number,
      price: number (price at time of adding)
    }
  ],
  coupon: {
    code: string,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
    discountAmount: number (calculated)
  } | null,
  subtotal: number,
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getCart()` - GET `/api/v1/cart`
- `addToCart({ productId, quantity })` - POST `/api/v1/cart/items`
- `updateCartItem({ itemId, quantity })` - PUT `/api/v1/cart/items/{itemId}`
- `removeCartItem(itemId)` - DELETE `/api/v1/cart/items/{itemId}`
- `clearCart()` - DELETE `/api/v1/cart`
- `applyCoupon(code)` - POST `/api/v1/cart/apply-coupon`
- `removeCoupon()` - DELETE `/api/v1/cart/coupon`
- `mergeCart()` - POST `/api/v1/cart/merge` (call after login)

#### Cart Page

**Create Cart Page (`app/cart/page.tsx`):**

Layout:
- Left side (larger): Cart items list
- Right side: Order summary

**Create Cart Components:**

1. **`components/cart/CartItemList.tsx`:**
   - List of CartItem components
   - Empty state: "Your cart is empty" with "Continue Shopping" button
   - "Clear Cart" button at bottom

2. **`components/cart/CartItem.tsx`:**
   - Product image (thumbnail)
   - Product name (link to product page)
   - Unit price
   - Quantity selector (+/-)
   - Line total (price x quantity)
   - Remove button (X or trash icon)
   - "Out of stock" warning if product stock changed
   - Disable + button if quantity = stock

3. **`components/cart/OrderSummary.tsx`:**
   - Subtotal
   - Coupon section:
     - Input field + "Apply" button
     - If coupon applied: show code, discount amount, remove button
   - Shipping estimate (if configured)
   - Tax estimate (if configured)
   - Total
   - "Proceed to Checkout" button
   - Accepted payment icons (Visa, MC, etc.)

#### Mini Cart (Header)

**Create Mini Cart Component (`components/cart/MiniCart.tsx`):**

What it should do:
- Shopping cart icon in navbar
- Badge showing item count
- Dropdown on click/hover:
  - List of items (image, name, qty, price)
  - Subtotal
  - "View Cart" button
  - "Checkout" button
- If empty: "Your cart is empty"

#### Cart Icon in Navbar

**Modify `components/Navbar.tsx`:**

Add:
- MiniCart component
- Cart icon with badge showing item count
- Fetch cart on app load if user logged in

#### Guest Cart Support

The backend supports guest carts via sessionId cookie. Handle this:

**Create Cart Context or Hook (`hooks/useCart.ts`):**
- Check if user logged in
- If not: ensure sessionId cookie set
- Merge cart after login:
  - When user logs in, call `mergeCart()` thunk
  - This combines guest cart with user cart

**Modify login flow in auth slice:**
- After successful login, dispatch `getCart()` and `mergeCart()`

#### Testing Requirements - Day 8-9

1. **Add to Cart:**
   - Add product from product page
   - Add product from product card
   - Quantity updates correctly
   - Cart badge updates

2. **Cart Page:**
   - View all items
   - Update quantities
   - Remove items
   - Clear cart
   - Continue shopping link works

3. **Mini Cart:**
   - Shows items
   - Updates when cart changes
   - Links work

4. **Coupon:**
   - Apply valid coupon
   - See discount applied
   - Remove coupon
   - Try invalid coupon (error message)

5. **Guest Cart:**
   - Add items without logging in
   - Login
   - Cart items still there (merged)

---

### Day 10: Wishlist

#### Wishlist Slice

**Create `redux/features/wishlistSlice.ts`:**

State:
```
{
  products: [
    {
      _id, name, slug, price, images, inStock
    }
  ],
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getWishlist()` - GET `/api/v1/wishlist`
- `addToWishlist(productId)` - POST `/api/v1/wishlist/{productId}`
- `removeFromWishlist(productId)` - DELETE `/api/v1/wishlist/{productId}`
- `moveToCart(productId)` - POST `/api/v1/wishlist/{productId}/move-to-cart`

#### Wishlist Page

**Create Wishlist Page (`app/wishlist/page.tsx`):**

What it should do:
- Grid of wishlist items
- Each item shows:
  - Product image
  - Product name
  - Price
  - Stock status
  - "Add to Cart" button
  - "Remove" button
- Empty state: "Your wishlist is empty"
- Login required (redirect to login if not authenticated)

**Create Wishlist Components:**

1. **`components/wishlist/WishlistItem.tsx`:**
   - Product card variant for wishlist
   - Add to Cart button
   - Remove from wishlist button
   - Link to product page

2. **`components/wishlist/WishlistButton.tsx`:**
   - Heart icon button
   - Filled heart if in wishlist, outline if not
   - Toggle on click
   - Shows toast on add/remove
   - Used in ProductCard and ProductDetail

#### Update Product Components

**Modify `components/ProductCard.tsx`:**
- Add WishlistButton in top right corner
- Requires wishlist slice to check if product is in wishlist

**Modify Product Detail Page:**
- Add WishlistButton next to Add to Cart

#### Testing Requirements - Day 10

1. **Add to Wishlist:**
   - Click heart on product card
   - Heart fills in
   - Toast confirms "Added to wishlist"

2. **Remove from Wishlist:**
   - Click filled heart
   - Heart becomes outline
   - Toast confirms "Removed from wishlist"

3. **Wishlist Page:**
   - View all wishlist items
   - Add item to cart from wishlist
   - Item removed from wishlist after adding to cart
   - Remove individual items

4. **Persistence:**
   - Add items to wishlist
   - Logout and login
   - Wishlist items still there

---

## WEEK 3: Checkout & Orders

### Day 11-12: Checkout Flow

#### Checkout Page

**Create Checkout Page (`app/checkout/page.tsx`):**

Multi-step checkout process:

1. **Step 1: Shipping Address**
   - Select from saved addresses
   - Or add new address form
   - "Use same for billing" checkbox

2. **Step 2: Billing Address (if different)**
   - Select from saved addresses
   - Or add new address form

3. **Step 3: Shipping Method**
   - List available shipping methods
   - Show price and estimated delivery
   - Radio button selection

4. **Step 4: Payment**
   - Stripe card input
   - Order summary
   - "Place Order" button

5. **Step 5: Confirmation (separate page)**
   - Order confirmed message
   - Order number
   - Email confirmation sent
   - "Continue Shopping" and "View Order" buttons

**Create Checkout Components:**

1. **`components/checkout/CheckoutSteps.tsx`:**
   - Step indicator (1 → 2 → 3 → 4)
   - Shows current step highlighted
   - Past steps clickable to go back

2. **`components/checkout/AddressStep.tsx`:**
   - Address selection radio list
   - "Add New Address" button
   - Selected address details display

3. **`components/checkout/ShippingStep.tsx`:**
   - Shipping method radio list
   - Each shows: name, price, delivery estimate

4. **`components/checkout/PaymentStep.tsx`:**
   - Stripe CardElement
   - Order total display
   - Terms acceptance checkbox
   - "Place Order" button

5. **`components/checkout/OrderReview.tsx`:**
   - Order items summary (collapsed, expandable)
   - Shipping address
   - Shipping method
   - Payment method (last 4 digits)
   - Price breakdown

#### Stripe Integration

**Install Stripe packages:**
```
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Create Stripe wrapper (`components/checkout/StripeWrapper.tsx`):**
- Loads Stripe with publishable key
- Provides Elements wrapper

**Create Payment Form (`components/checkout/PaymentForm.tsx`):**
- CardElement from Stripe
- Handles card input styling
- Error display for card errors
- Submits to backend for payment intent

**Create Checkout Slice (`redux/features/checkoutSlice.ts`):**

State:
```
{
  step: 1 | 2 | 3 | 4,
  shippingAddressId: string | null,
  billingAddressId: string | null,
  shippingMethodId: string | null,
  clientSecret: string | null,
  orderId: string | null,
  loading: boolean,
  error: string | null
}
```

Thunks:
- `createPaymentIntent({ cartId, shippingAddressId, billingAddressId })` - POST `/api/v1/checkout/create-payment-intent`
- `confirmOrder({ orderId, paymentIntentId })` - POST `/api/v1/checkout/confirm`

#### Order Confirmation Page

**Create Order Confirmation Page (`app/checkout/confirmation/page.tsx`):**

What it should do:
- Large checkmark/success icon
- "Thank you for your order!"
- Order number prominently displayed
- "We've sent a confirmation email to your-email@example.com"
- Order details summary
- "Continue Shopping" button
- "View Order" button

#### Testing Requirements - Day 11-12

1. **Checkout Flow:**
   - Add items to cart
   - Go to checkout
   - Select shipping address
   - Select billing address
   - Select shipping method
   - Enter card (use Stripe test card: 4242 4242 4242 4242)
   - Place order
   - See confirmation page

2. **Address Selection:**
   - Use saved address
   - Add new address during checkout
   - "Same as shipping" works

3. **Payment:**
   - Card validation works
   - Declined card shows error
   - Successful payment creates order

4. **Order Created:**
   - Order appears in My Orders
   - Stock reduced on products
   - Cart cleared after order

---

### Day 13-14: Order Management

#### Orders Slice

**Create `redux/features/orderSlice.ts`:**

State:
```
{
  orders: [],
  currentOrder: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  },
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getOrders(page)` - GET `/api/v1/orders?page=X`
- `getOrderByNumber(orderNumber)` - GET `/api/v1/orders/{orderNumber}`
- `cancelOrder(orderNumber)` - POST `/api/v1/orders/{orderNumber}/cancel`

#### Orders List Page

**Create My Orders Page (`app/orders/page.tsx`):**

What it should do:
- Table/list of orders
- Columns: Order #, Date, Status, Total, Actions
- Status badge (color coded):
  - Pending: gray
  - Confirmed: blue
  - Processing: yellow
  - Shipped: purple
  - Delivered: green
  - Cancelled: red
- "View" button for each order
- Pagination
- Empty state: "No orders yet"

**Create Order Components:**

1. **`components/orders/OrderList.tsx`:**
   - Table of orders
   - Sortable columns
   - Status filter dropdown

2. **`components/orders/OrderRow.tsx`:**
   - Single order row
   - Order number, date, status, total
   - View button

3. **`components/orders/OrderStatusBadge.tsx`:**
   - Colored badge based on status
   - Reusable across pages

#### Order Detail Page

**Create Order Detail Page (`app/orders/[orderNumber]/page.tsx`):**

Sections:

1. **Order Header:**
   - Order number
   - Order date
   - Status badge
   - "Cancel Order" button (if cancellable)

2. **Order Items:**
   - List of items with image, name, qty, price
   - Item total for each
   - Link to product page

3. **Order Summary:**
   - Subtotal
   - Discount (if coupon used)
   - Shipping cost
   - Tax
   - Total

4. **Shipping Information:**
   - Shipping address
   - Shipping method used
   - Tracking number (if shipped)
   - Tracking link (if available)

5. **Status Timeline:**
   - Visual timeline of order status changes
   - Each status with timestamp
   - Current status highlighted

**Create Order Components:**

1. **`components/orders/OrderDetail.tsx`:**
   - Main order detail layout

2. **`components/orders/OrderItems.tsx`:**
   - List of order items

3. **`components/orders/OrderTimeline.tsx`:**
   - Vertical timeline of status history

4. **`components/orders/TrackingInfo.tsx`:**
   - Tracking number display
   - "Track Package" button/link

#### Order Cancellation

**Create Cancel Order Modal (`components/orders/CancelOrderModal.tsx`):**
- Confirmation dialog
- Warning: "Are you sure you want to cancel this order?"
- Cancel/Confirm buttons
- After cancel: redirect to orders list

#### Testing Requirements - Day 13-14

1. **View Orders:**
   - See list of orders
   - Pagination works
   - Filter by status works

2. **View Order Detail:**
   - Click order to see details
   - All order info displays
   - Items link to products
   - Status timeline shows correctly

3. **Cancel Order:**
   - Cancel pending order
   - Status updates
   - Stock restored (verify on products)
   - Can't cancel shipped order

4. **Track Order:**
   - Order with tracking shows tracking info
   - Tracking link opens

---

### Day 15: Reviews & Ratings

#### Reviews Slice

**Create `redux/features/reviewSlice.ts`:**

State:
```
{
  productReviews: {
    [productId]: {
      reviews: [],
      pagination: { page, limit, total }
    }
  },
  userReviews: [],
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getProductReviews({ productId, page })` - GET `/api/v1/products/{productId}/reviews`
- `createReview({ productId, data })` - POST `/api/v1/products/{productId}/reviews`
- `updateReview({ reviewId, data })` - PUT `/api/v1/reviews/{reviewId}`
- `deleteReview(reviewId)` - DELETE `/api/v1/reviews/{reviewId}`
- `markHelpful(reviewId)` - POST `/api/v1/reviews/{reviewId}/helpful`

#### Review Components

**Create Review Components:**

1. **`components/reviews/ReviewList.tsx`:**
   - List of reviews
   - Sort dropdown (newest, highest rated, most helpful)
   - Load more pagination

2. **`components/reviews/ReviewItem.tsx`:**
   - User avatar and name
   - Star rating
   - "Verified Purchase" badge
   - Review date
   - Review title
   - Review text
   - Helpful count and "Mark Helpful" button
   - Edit/delete buttons (if own review)

3. **`components/reviews/ReviewForm.tsx`:**
   - Star rating selector (click to rate)
   - Title input
   - Comment textarea
   - Image upload (optional)
   - Submit button
   - Form validation

4. **`components/reviews/StarRating.tsx`:**
   - Display stars (filled/empty/half)
   - Interactive mode for input
   - Display-only mode for showing ratings

5. **`components/reviews/RatingSummary.tsx`:**
   - Overall rating (large number + stars)
   - Rating distribution bars (5 star: XX%, etc.)
   - Total review count

#### Update Product Detail Page

**Add to Product Detail Page:**
- Rating summary in product info
- Reviews tab in tabs section
- ReviewList component
- "Write a Review" button (requires login)
- ReviewForm (after clicking write review)
- Check if user already reviewed (show edit instead)
- Check if user purchased product (for verified badge)

#### Testing Requirements - Day 15

1. **View Reviews:**
   - See reviews on product page
   - Sort reviews works
   - Pagination works

2. **Write Review:**
   - Login as customer
   - Write review for purchased product
   - Shows "Verified Purchase" badge
   - Review pending admin approval

3. **Edit/Delete Review:**
   - Edit own review
   - Delete own review

4. **Mark Helpful:**
   - Mark review as helpful
   - Count increases

5. **Rating Display:**
   - Product shows average rating
   - Rating updates after review approved

---

## WEEK 4: Admin Features & Polish

### Day 16-17: Admin Dashboard & Analytics

#### Admin Dashboard

**Enhance Admin Dashboard (`app/dashboard/page.tsx` for admins):**

Stats Cards:
- Today's Revenue
- Orders Today
- New Customers Today
- Low Stock Products

Charts (use recharts - already installed):
- Revenue over time (line chart)
- Orders by status (pie chart)
- Top selling products (bar chart)
- Sales by category (bar chart)

Tables:
- Recent orders (last 10)
- Low stock alerts

#### Analytics Slice

**Create `redux/features/analyticsSlice.ts`:**

State:
```
{
  overview: {
    totalRevenue, totalOrders, totalUsers,
    ordersToday, revenueToday, newUsersThisMonth
  },
  salesByPeriod: [],
  ordersByStatus: {},
  topProducts: [],
  topCategories: [],
  customerStats: {},
  lowStockProducts: [],
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getDashboardOverview()` - GET `/api/v1/admin/analytics/overview`
- `getSalesByPeriod(params)` - GET `/api/v1/admin/analytics/sales`
- `getOrdersByStatus()` - GET `/api/v1/admin/analytics/orders-by-status`
- `getTopProducts(limit)` - GET `/api/v1/admin/analytics/top-products`
- `getTopCategories(limit)` - GET `/api/v1/admin/analytics/top-categories`
- `getCustomerStats()` - GET `/api/v1/admin/analytics/customers`
- `getLowStockProducts()` - GET `/api/v1/admin/analytics/low-stock`

#### Admin Analytics Page

**Create Analytics Page (`app/dashboard/analytics/page.tsx`):**

Sections:
1. Date range picker
2. Key metrics cards
3. Revenue chart (line)
4. Orders by status (pie)
5. Top products table
6. Top categories table
7. Export buttons (CSV)

**Create Chart Components:**

1. **`components/admin/charts/RevenueChart.tsx`:**
   - Line chart with revenue over time
   - Selectable period (7 days, 30 days, 12 months)

2. **`components/admin/charts/OrdersStatusChart.tsx`:**
   - Pie/donut chart
   - Status breakdown

3. **`components/admin/charts/TopProductsChart.tsx`:**
   - Horizontal bar chart
   - Top 10 products by revenue

4. **`components/admin/charts/SalesByCategoryChart.tsx`:**
   - Bar chart
   - Sales per category

#### Testing Requirements - Day 16-17

1. **Dashboard Stats:**
   - Stats show correct numbers
   - Update when orders/users change

2. **Charts:**
   - Revenue chart displays
   - Date range changes data
   - All chart types render

3. **Export:**
   - Export sales CSV
   - Export orders CSV
   - Files download correctly

---

### Day 18-19: Admin Order Management

#### Admin Orders Page

**Create Admin Orders Page (`app/dashboard/orders/page.tsx`):**

Features:
- Searchable orders table
- Filter by status
- Filter by date range
- Filter by payment status
- Bulk actions (mark as processing, etc.)
- Pagination

**Create Admin Order Components:**

1. **`components/admin/orders/AdminOrderList.tsx`:**
   - Data table with sorting
   - Checkbox selection for bulk actions
   - Status dropdown filter
   - Search by order number or customer

2. **`components/admin/orders/AdminOrderRow.tsx`:**
   - Order number, customer, date, status, payment status, total
   - Quick actions: View, Update Status

3. **`components/admin/orders/BulkActions.tsx`:**
   - Dropdown with bulk actions
   - Mark as processing
   - Mark as shipped
   - Export selected

#### Admin Order Detail Page

**Create Admin Order Detail (`app/dashboard/orders/[id]/page.tsx`):**

Sections:
1. Order header with status update dropdown
2. Customer info (name, email, phone)
3. Order items
4. Price breakdown
5. Shipping address
6. Billing address
7. Status timeline
8. Admin notes section
9. Tracking info input
10. Refund section (if applicable)

**Create Status Update Components:**

1. **`components/admin/orders/StatusUpdateModal.tsx`:**
   - Status dropdown
   - Optional note
   - Confirm button

2. **`components/admin/orders/ShippingInfoForm.tsx`:**
   - Tracking number input
   - Tracking URL input
   - "Mark as Shipped" button

3. **`components/admin/orders/RefundForm.tsx`:**
   - Refund amount input
   - Reason dropdown/input
   - "Process Refund" button

#### Admin Orders Slice

**Create `redux/features/adminOrderSlice.ts`:**

State:
```
{
  orders: [],
  currentOrder: null,
  pagination: { page, limit, total },
  filters: { status, paymentStatus, dateFrom, dateTo },
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getAdminOrders(params)` - GET `/api/v1/admin/orders`
- `getAdminOrderById(id)` - GET `/api/v1/admin/orders/{id}`
- `updateOrderStatus({ id, status, note })` - PUT `/api/v1/admin/orders/{id}/status`
- `shipOrder({ id, trackingNumber, trackingUrl })` - POST `/api/v1/admin/orders/{id}/ship`
- `refundOrder({ id, amount, reason })` - POST `/api/v1/admin/orders/{id}/refund`

#### Testing Requirements - Day 18-19

1. **View Orders:**
   - List all orders
   - Search works
   - Filters work
   - Pagination works

2. **Update Order:**
   - Change status
   - Add admin note
   - Status history updates

3. **Ship Order:**
   - Add tracking info
   - Customer notified (check emails)
   - Status changes to shipped

4. **Refund Order:**
   - Process full refund
   - Process partial refund
   - Stripe refund created
   - Order status updates

---

### Day 20: Admin Coupon Management & Final Polish

#### Coupon Management

**Create Coupon Page (`app/dashboard/coupons/page.tsx`):**

Features:
- List all coupons
- Create new coupon
- Edit coupon
- Delete coupon
- Toggle active status

**Create Coupon Components:**

1. **`components/admin/coupons/CouponList.tsx`:**
   - Table of coupons
   - Columns: Code, Type, Value, Usage, Valid Until, Status
   - Actions: Edit, Delete, Toggle Active

2. **`components/admin/coupons/CouponForm.tsx`:**
   - Code input (uppercase)
   - Type dropdown (percentage/fixed)
   - Value input
   - Minimum purchase input
   - Maximum discount input (for percentage)
   - Usage limit input
   - Start date picker
   - End date picker
   - Active toggle

3. **`components/admin/coupons/CouponStats.tsx`:**
   - Times used
   - Total discount given

#### Coupon Slice

**Create `redux/features/couponSlice.ts`:**

State:
```
{
  coupons: [],
  loading: boolean,
  error: string | null
}
```

Thunks:
- `getCoupons()` - GET `/api/v1/admin/coupons`
- `createCoupon(data)` - POST `/api/v1/admin/coupons`
- `updateCoupon({ id, data })` - PUT `/api/v1/admin/coupons/{id}`
- `deleteCoupon(id)` - DELETE `/api/v1/admin/coupons/{id}`

#### Review Moderation

**Create Review Moderation Page (`app/dashboard/reviews/page.tsx`):**

Features:
- List pending reviews (default tab)
- List all reviews
- Approve/Reject buttons
- Filter by product
- Filter by status

**Create Review Moderation Components:**

1. **`components/admin/reviews/ReviewModerationList.tsx`:**
   - Table of reviews
   - Product name, customer, rating, preview
   - Approve/Reject buttons

2. **`components/admin/reviews/ReviewModerationItem.tsx`:**
   - Full review display
   - Action buttons

#### Admin Review Slice

**Add to reviewSlice or create adminReviewSlice:**

Thunks:
- `getPendingReviews()` - GET `/api/v1/admin/reviews/pending`
- `getAllReviews(params)` - GET `/api/v1/admin/reviews`
- `approveReview(id)` - PUT `/api/v1/admin/reviews/{id}/approve`
- `rejectReview({ id, reason })` - PUT `/api/v1/admin/reviews/{id}/reject`

#### Final Polish Tasks

1. **Loading States:**
   - Add skeleton loaders to all list pages
   - Add loading spinners to buttons during actions

2. **Error Handling:**
   - Toast notifications for errors
   - Error boundaries for sections
   - Friendly error messages

3. **Empty States:**
   - Design empty states for all list pages
   - Helpful call-to-action in empty states

4. **Responsive Design:**
   - Test all pages on mobile
   - Adjust layouts for tablets
   - Ensure touch-friendly interactions

5. **Accessibility:**
   - Keyboard navigation works
   - ARIA labels on interactive elements
   - Focus states visible

6. **Performance:**
   - Add React.memo to list items
   - Lazy load below-fold content
   - Image optimization

#### Testing Requirements - Day 20

1. **Coupons:**
   - Create coupon
   - Edit coupon
   - Toggle active
   - Delete coupon
   - Coupon works in checkout

2. **Reviews:**
   - View pending reviews
   - Approve review
   - Reject review
   - Review appears on product after approval

3. **Overall:**
   - All pages load correctly
   - Navigation works
   - Forms submit correctly
   - Errors handled gracefully
   - Mobile responsive

---

## Required Packages Summary

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "@stripe/stripe-js": "^2.2.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "lucide-react": "^0.300.0",
    "recharts": "^2.10.0",
    "date-fns": "^3.0.0",
    "sonner": "^1.3.0",
    "react-hot-toast": "^2.4.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "@radix-ui/react-*": "*"
  }
}
```

Most packages already installed. Add:
```
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## Final Checklist

### Pages Complete
- [ ] Login (enhanced with new error handling)
- [ ] Signup (enhanced with more fields)
- [ ] Verify Email
- [ ] Forgot Password
- [ ] Reset Password
- [ ] Profile
- [ ] Settings
- [ ] Addresses
- [ ] Products (enhanced with search/filters)
- [ ] Product Detail (enhanced with gallery/reviews)
- [ ] Cart
- [ ] Checkout (multi-step)
- [ ] Order Confirmation
- [ ] My Orders
- [ ] Order Detail
- [ ] Wishlist
- [ ] Dashboard (role-based)
- [ ] Admin: Analytics
- [ ] Admin: Orders
- [ ] Admin: Coupons
- [ ] Admin: Reviews

### Features Complete
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Token refresh flow
- [ ] Profile management
- [ ] Address management
- [ ] Product search and filters
- [ ] Product image gallery
- [ ] Shopping cart (guest + user)
- [ ] Wishlist
- [ ] Multi-step checkout
- [ ] Stripe payment integration
- [ ] Order tracking
- [ ] Review system
- [ ] Admin analytics dashboard
- [ ] Admin order management
- [ ] Coupon management
- [ ] Review moderation

### Quality
- [ ] All forms have validation
- [ ] Loading states everywhere
- [ ] Error handling everywhere
- [ ] Empty states designed
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Accessibility checked

---

**Frontend Development Complete!**
