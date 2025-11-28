import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import toast from "react-hot-toast";

export const getProducts = createAsyncThunk("products/get", async (params: { page?: number; limit?: number } = {}, thunkAPI) => {
  try {
    const { page = 1, limit = 12 } = params;
    const res = await api.get(`/products/public?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk("products/create", async (data: any, thunkAPI) => {
  try {
    const res = await api.post("/products", data);
    toast.success("Product created");
    return res.data.product;
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Failed to create product");
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed");
  }
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, data }: any, thunkAPI) => {
  try {
    const res = await api.put(`/products/${id}`, data);
    toast.success("Product updated");
    return res.data.product;
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Failed to update product");
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed");
  }
});

export const deleteProduct = createAsyncThunk("products/delete", async (id: string, thunkAPI) => {
  try {
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    return id;
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Failed to delete product");
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed");
  }
});

const slice = createSlice({
  name: "products",
  initialState: { list: [], total: 0, loading: false, error: null } as any,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(getProducts.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(getProducts.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.products || []; s.total = a.payload.total || 0; })
     .addCase(getProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

    b.addCase(createProduct.fulfilled, (s, a) => { s.list.unshift(a.payload); });
    b.addCase(updateProduct.fulfilled, (s, a) => { s.list = s.list.map((p:any) => p._id === a.payload._id ? a.payload : p); });
    b.addCase(deleteProduct.fulfilled, (s, a) => { s.list = s.list.filter((p:any) => p._id !== a.payload); });
  }
});

export default slice.reducer;
