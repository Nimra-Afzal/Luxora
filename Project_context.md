# Luxora E-Commerce Platform - Project Context

## Overview

Luxora is a full-stack e-commerce platform built with modern technologies. This document provides comprehensive context for the entire system to help new developers or AI assistants understand the codebase quickly.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **React:** Version 19
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Form Handling:** React Hook Form
- **Notifications:** Sonner (toast notifications)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access + Refresh Tokens)
- **File Upload:** Multer + Cloudinary
- **Password Hashing:** bcrypt

---

## Project Structure

```
promptopia/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   ├── redux/                # Redux store and slices
│   ├── lib/                  # Utilities and API client
│   └── public/               # Static assets
├── backend/                  # Express.js backend API
│   ├── controllers/          # Route handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── middleware/           # Custom middleware
│   └── utils/                # Utility functions
└── Project_context.md        # This file
```

---

## Frontend Architecture

### Pages (App Router)

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page with Hero, Categories, Featured Products |
| `/login` | `app/login/page.tsx` | User login with email/password |
| `/signup` | `app/signup/page.tsx` | User registration |
| `/products` | `app/products/page.tsx` | Product listing with filters |
| `/products/[id]` | `app/products/[id]/page.tsx` | Single product details |
| `/cart` | `app/cart/page.tsx` | Shopping cart |
| `/checkout` | `app/checkout/page.tsx` | Multi-step checkout flow |
| `/order-success` | `app/order-success/page.tsx` | Order confirmation |
| `/dashboard` | `app/dashboard/page.tsx` | User dashboard |
| `/dashboard/orders` | `app/dashboard/orders/page.tsx` | User order history |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | User profile settings |
| `/admin/*` | `app/admin/*` | Admin panel routes |

### Key Components

#### Layout Components
- `Navbar.tsx` - Main navigation with categories mega menu, cart, user menu
- `Footer.tsx` - Site footer
- `DashboardSidebar.tsx` - User dashboard navigation
- `AdminSidebar.tsx` - Admin panel navigation

#### Feature Components
- `Hero.tsx` - Landing page hero section with search
- `CategorySection.tsx` - Category grid display
- `FeaturedProducts.tsx` - Product showcase
- `ProductCard.tsx` - Individual product card
- `CartItem.tsx` - Cart item with quantity controls

#### UI Components (shadcn/ui)
Located in `components/ui/`:
- `button.tsx`, `input.tsx`, `checkbox.tsx`
- `dialog.tsx`, `dropdown-menu.tsx`
- `select.tsx`, `tabs.tsx`, `table.tsx`
- `card.tsx`, `badge.tsx`, `avatar.tsx`
- `skeleton.tsx`, `toast.tsx`, `sonner.tsx`

### Redux Store

Located in `redux/`:

```typescript
// Store structure
{
  auth: AuthState,      // User authentication
  theme: ThemeState,    // Dark/light mode
  products: ProductsState,
  categories: CategoriesState,
  cart: CartState
}
```

#### Slices

**authSlice.ts**
- State: `user`, `token`, `loading`, `error`
- Actions: `login`, `register`, `logout`, `setUserFromStorage`, `updateProfile`
- Persists to localStorage

**themeSlice.ts**
- State: `theme` ('light' | 'dark' | 'system')
- Actions: `setTheme`, `initializeTheme`
- Persists to localStorage

**productsSlice.ts**
- State: `items`, `loading`, `error`, `pagination`
- Actions: `fetchProducts`, `fetchProductById`, `createProduct`, `updateProduct`, `deleteProduct`

**categoriesSlice.ts**
- State: `items`, `loading`, `error`
- Actions: `fetchCategories`, `createCategory`, `updateCategory`, `deleteCategory`

**cartSlice.ts**
- State: `items`, `loading`
- Actions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `loadCart`
- Persists to localStorage

### API Client

Located in `lib/api.ts`:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

// Interceptors handle:
// - Adding Authorization header
// - Token refresh on 401
// - Automatic retry after refresh
```

---

## Backend Architecture

### Database Models

**User Model** (`models/User.js`)
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Product Model** (`models/Product.js`)
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: ObjectId (ref: Category),
  subcategory: String,
  images: [String] (Cloudinary URLs),
  stock: Number,
  rating: Number,
  reviewCount: Number,
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Category Model** (`models/Category.js`)
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  image: String,
  parent: ObjectId (ref: Category, nullable),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Order Model** (`models/Order.js`)
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,
  subtotal: Number,
  shippingCost: Number,
  tax: Number,
  total: Number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

### API Routes

**Authentication** (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |
| POST | `/refresh` | Refresh access token |
| GET | `/me` | Get current user |
| PUT | `/profile` | Update profile |

**Products** (`/api/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List products (with filters, pagination) |
| GET | `/:id` | Get single product |
| POST | `/` | Create product (admin) |
| PUT | `/:id` | Update product (admin) |
| DELETE | `/:id` | Delete product (admin) |

**Categories** (`/api/categories`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all categories |
| GET | `/:id` | Get single category |
| POST | `/` | Create category (admin) |
| PUT | `/:id` | Update category (admin) |
| DELETE | `/:id` | Delete category (admin) |

**Orders** (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user orders |
| GET | `/:id` | Get single order |
| POST | `/` | Create order |
| PUT | `/:id/status` | Update order status (admin) |

**Upload** (`/api/upload`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Upload image to Cloudinary |
| DELETE | `/:publicId` | Delete image from Cloudinary |

### Middleware

**authMiddleware.js**
- `protect` - Verifies JWT access token
- `admin` - Checks if user has admin role

**errorMiddleware.js**
- Global error handler
- Formats error responses

### Authentication Flow

1. **Registration:**
   - User submits name, email, password
   - Password hashed with bcrypt
   - User created in database
   - Access token (15min) + Refresh token (7d) generated
   - Refresh token stored in DB and httpOnly cookie

2. **Login:**
   - User submits email, password
   - Password verified with bcrypt
   - Tokens generated and returned

3. **Token Refresh:**
   - Client sends refresh token
   - Server verifies against stored token
   - New access token issued

4. **Protected Routes:**
   - Client sends `Authorization: Bearer <token>`
   - Middleware verifies token
   - User attached to request

---

## Key Features

### Shopping Cart
- Persisted to localStorage
- Quantity controls with stock validation
- Coupon codes: `SAVE10` (10% off), `SAVE20` (20% off)
- Shipping calculation based on subtotal
- Real-time total calculation

### Checkout Flow
1. **Shipping Step:** Address form with validation
2. **Payment Step:** Payment method selection (Credit Card, PayPal, Apple Pay)
3. **Review Step:** Order summary and confirmation
4. Order created and user redirected to success page

### Category System
- Two-level hierarchy: Parent categories → Subcategories
- Mega menu dropdown in Navbar
- Filter products by category/subcategory

### Product Features
- Image gallery
- Stock tracking
- Featured products flag
- Rating and reviews display
- Price with discount support

### Admin Panel
- Dashboard with stats
- Product management (CRUD)
- Category management (CRUD)
- Order management
- User management

### User Dashboard
- Order history
- Profile settings
- Address management

---

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/luxora
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Running the Project

### Backend
```bash
cd backend
npm install
npm run dev    # Development with nodemon
npm start      # Production
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # Development server
npm run build  # Production build
npm start      # Production server
```

---

## Common Patterns

### API Calls from Frontend
```typescript
// Using Redux thunk
dispatch(fetchProducts({ page: 1, limit: 10, category: 'electronics' }));

// Direct API call
const response = await api.get('/products', { params: { search: 'phone' } });
```

### Protected Routes
```typescript
// Frontend - check auth
const { user } = useSelector((state: RootState) => state.auth);
if (!user) router.push('/login');

// Backend - middleware
router.get('/orders', protect, getOrders);
router.post('/products', protect, admin, createProduct);
```

### Form Handling
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<FormType>();

<Input {...register("email", { required: "Email is required" })} />
{errors.email && <p className="text-red-500">{errors.email.message}</p>}
```

### Toast Notifications
```typescript
import { toast } from "sonner";

toast.success("Product added to cart!");
toast.error("Something went wrong");
toast.info("Processing your order...");
```

---

## File Upload Flow

1. Frontend sends file via FormData to `/api/upload`
2. Multer middleware handles multipart data
3. File uploaded to Cloudinary
4. Cloudinary URL returned
5. URL stored in product/category record

---

## Styling Conventions

- Tailwind CSS utility classes
- Dark mode support via `dark:` prefix
- Responsive design: `sm:`, `md:`, `lg:`, `xl:` breakpoints
- Component variants via `class-variance-authority`
- Consistent color scheme: blue-600 primary, gray-900 text

---

## Known Issues & Notes

1. Social login (Google, GitHub) shows "coming soon" toast
2. Payment processing is simulated (no real gateway)
3. Email notifications are not implemented
4. Review/rating submission not implemented

---

## Useful Commands

```bash
# Check for TypeScript errors
cd frontend && npx tsc --noEmit

# Run linting
cd frontend && npm run lint

# Database operations (if using MongoDB CLI)
mongosh luxora
db.products.find()
db.users.find()
```

---

This document should provide sufficient context for continuing development or troubleshooting the Luxora e-commerce platform.
