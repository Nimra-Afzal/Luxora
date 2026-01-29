import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import toast from "react-hot-toast";

/**
 * GET PRODUCTS (PUBLIC)
 * Supports category filtering
 */
export const getProducts = createAsyncThunk(
  "products/get",
  async (
    params: { page?: number; limit?: number; category?: string } = {},
    thunkAPI
  ) => {
    try {
      const { page = 1, limit = 12, category } = params;

      let url = `/products/public?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }

      const res = await api.get(url);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch products"
      );
    }
  }
);

/**
 * ADMIN: CREATE PRODUCT
 */
export const createProduct = createAsyncThunk(
  "products/create",
  async (data: any, thunkAPI) => {
    try {
      const res = await api.post("/products", data);
      toast.success("Product created");
      return res.data.product;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create product");
      return thunkAPI.rejectWithValue("Failed");
    }
  }
);

/**
 * ADMIN: UPDATE PRODUCT
 */
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }: any, thunkAPI) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      toast.success("Product updated");
      return res.data.product;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update product");
      return thunkAPI.rejectWithValue("Failed");
    }
  }
);

/**
 * ADMIN: DELETE PRODUCT
 */
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      return id;
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete product");
      return thunkAPI.rejectWithValue("Failed");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    total: 0,
    loading: false,
    error: null,
  } as any,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products || [];
        state.total = action.payload.total || 0;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.list = state.list.map((p: any) =>
          p._id === action.payload._id ? action.payload : p
        );
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (p: any) => p._id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
