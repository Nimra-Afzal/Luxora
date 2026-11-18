import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const getInitialState = (): WishlistState => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      return { items: JSON.parse(stored) };
    }
  }
  return { items: [] };
};

const initialState: WishlistState = getInitialState();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },

    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => item.productId !== action.payload.productId
        );
      } else {
        state.items.push(action.payload);
      }

      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
