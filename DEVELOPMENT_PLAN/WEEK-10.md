# Week 10: Wishlist & Addresses

> **Phase:** Shopping Experience (Week 10 of 12)
> **Focus:** Implement wishlist functionality and customer address management

---

## Week 10 Summary

Build wishlist feature for saving favorite products and address book for shipping/billing addresses.

---

## Day 1 (Monday): Wishlist Backend

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 1.1 | Create wishlist service with methods: `getWishlist`, `addProduct`, `removeProduct`, `clearWishlist`, `isInWishlist` | ADD | `backend/src/services/wishlist.service.ts` |
| 1.2 | Create wishlist controller | ADD | `backend/src/controllers/wishlist.controller.ts` |
| 1.3 | Add route: `GET /api/v1/wishlist` - get user's wishlist (auth required) | ADD | `backend/src/routes/wishlist.routes.ts` |
| 1.4 | Add route: `POST /api/v1/wishlist/:productId` - add product to wishlist | ADD | `backend/src/routes/wishlist.routes.ts` |
| 1.5 | Add route: `DELETE /api/v1/wishlist/:productId` - remove product from wishlist | ADD | `backend/src/routes/wishlist.routes.ts` |
| 1.6 | Add route: `POST /api/v1/wishlist/:productId/move-to-cart` - move item to cart | ADD | `backend/src/routes/wishlist.routes.ts` |
| 1.7 | Mount wishlist routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 2 (Tuesday): Address Backend

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 2.1 | Create address service with methods: `getAll`, `getById`, `create`, `update`, `delete`, `setDefault` | ADD | `backend/src/services/address.service.ts` |
| 2.2 | Create address controller | ADD | `backend/src/controllers/address.controller.ts` |
| 2.3 | Add route: `GET /api/v1/addresses` - get user's addresses (auth required) | ADD | `backend/src/routes/address.routes.ts` |
| 2.4 | Add route: `GET /api/v1/addresses/:id` - get single address | ADD | `backend/src/routes/address.routes.ts` |
| 2.5 | Add route: `POST /api/v1/addresses` - create new address | ADD | `backend/src/routes/address.routes.ts` |
| 2.6 | Add route: `PUT /api/v1/addresses/:id` - update address | ADD | `backend/src/routes/address.routes.ts` |
| 2.7 | Add route: `DELETE /api/v1/addresses/:id` - delete address | ADD | `backend/src/routes/address.routes.ts` |
| 2.8 | Add route: `PUT /api/v1/addresses/:id/default` - set as default address | ADD | `backend/src/routes/address.routes.ts` |
| 2.9 | Add validation schemas for address endpoints | ADD | `backend/src/validators/address.validator.ts` |
| 2.10 | Mount address routes | MODIFY | `backend/src/routes/index.ts` |

---

## Day 3 (Wednesday): Frontend - Wishlist

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 3.1 | Create wishlistSlice with state: items, loading, error | ADD | `frontend/redux/features/wishlistSlice.ts` |
| 3.2 | Add thunks: `fetchWishlist`, `addToWishlist`, `removeFromWishlist`, `moveToCart` | ADD | `frontend/redux/features/wishlistSlice.ts` |
| 3.3 | Create wishlist page showing all saved products | ADD | `frontend/app/wishlist/page.tsx` |
| 3.4 | Create WishlistButton component (heart icon, toggles wishlist status) | ADD | `frontend/components/WishlistButton.tsx` |
| 3.5 | Add WishlistButton to ProductCard | MODIFY | `frontend/components/ProductCard.tsx` |
| 3.6 | Add WishlistButton to product detail page | MODIFY | `frontend/app/products/[id]/page.tsx` |
| 3.7 | Add wishlist count/icon to Navbar | MODIFY | `frontend/components/Navbar.tsx` |

---

## Day 4 (Thursday): Frontend - Address Management

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 4.1 | Create addressSlice with state: addresses, defaultAddress, loading, error | ADD | `frontend/redux/features/addressSlice.ts` |
| 4.2 | Add thunks: `fetchAddresses`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefaultAddress` | ADD | `frontend/redux/features/addressSlice.ts` |
| 4.3 | Create AddressCard component (displays address with edit/delete buttons) | ADD | `frontend/components/AddressCard.tsx` |
| 4.4 | Create AddressForm component (form for creating/editing address) | ADD | `frontend/components/AddressForm.tsx` |
| 4.5 | Create addresses page in dashboard | ADD | `frontend/app/dashboard/addresses/page.tsx` |
| 4.6 | Add "Addresses" menu item in dashboard sidebar | MODIFY | `frontend/app/dashboard/page.tsx` |

---

## Day 5 (Friday): Address Selection & Testing

### Tasks

| # | Task | Type | File/Location |
|---|------|------|---------------|
| 5.1 | Create AddressSelector component (dropdown/radio to select from saved addresses) | ADD | `frontend/components/AddressSelector.tsx` |
| 5.2 | Add "Add New Address" option in AddressSelector that opens AddressForm | MODIFY | `frontend/components/AddressSelector.tsx` |
| 5.3 | Add country/state dropdown data (can use static list or API) | ADD | `frontend/lib/countries.ts` |
| 5.4 | Add address validation (required fields, postal code format) | MODIFY | `frontend/components/AddressForm.tsx` |
| 5.5 | Test: Add/remove products from wishlist | TEST | - |
| 5.6 | Test: Move wishlist item to cart | TEST | - |
| 5.7 | Test: CRUD operations on addresses | TEST | - |
| 5.8 | Test: Set default address | TEST | - |

---

## Week 10 Checklist

- [ ] Wishlist model exists (from Week 2)
- [ ] Address model exists (from Week 2)
- [ ] Wishlist service & endpoints working
- [ ] Address service & endpoints working
- [ ] Wishlist page in frontend
- [ ] Wishlist button on products
- [ ] Address management page
- [ ] Address form component
- [ ] Address selector component
- [ ] Default address feature working

---

**Next Week:** Week 11 - Shipping System
