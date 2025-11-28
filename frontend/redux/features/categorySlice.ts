import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export const getCategories = createAsyncThunk("categories/get", async (_, thunkAPI) => {
  try {
    const res = await api.get("/categories/public");
    return res.data.categories;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to fetch categories");
  }
});

export const createCategory = createAsyncThunk("categories/create", async (payload: { name: string }, thunkAPI) => {
  try {
    const res = await api.post("/categories", payload);
    return res.data.category;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to create category");
  }
});

export const deleteCategory = createAsyncThunk("categories/delete", async (id: string, thunkAPI) => {
  try {
    await api.delete(`/categories/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to delete category");
  }
});

const slice = createSlice({
  name: "categories",
  initialState: { list: [], loading: false, error: null } as any,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(getCategories.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(getCategories.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
     .addCase(getCategories.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

    b.addCase(createCategory.fulfilled, (s, a) => { s.list.unshift(a.payload); });
    b.addCase(deleteCategory.fulfilled, (s, a) => { s.list = s.list.filter((c:any) => c._id !== a.payload); });
  }
});

export default slice.reducer;
