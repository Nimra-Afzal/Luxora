import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import themeReducer from "./features/themeSlice";
import blogReducer from "./features/blogSlice";
import productReducer from "./features/productSlice";
import categoryReducer from "./features/categorySlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    blogs: blogReducer,
    products: productReducer,
    categories: categoryReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
