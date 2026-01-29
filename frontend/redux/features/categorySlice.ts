import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* =======================
   EXISTING THUNKS
======================= */

export const getCategories = createAsyncThunk(
  "categories/get",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories/public");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch categories"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (payload: { name: string }, thunkAPI) => {
    try {
      const res = await api.post("/categories", payload);
      return res.data.category;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to create category"
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: string, thunkAPI) => {
    try {
      await api.delete(`/categories/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to delete category"
      );
    }
  }
);

/* =======================
   LINE 8 – CATEGORY TREE
======================= */

export const fetchCategoryTree = createAsyncThunk(
  "categories/fetchTree",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories/public/tree");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch category tree"
      );
    }
  }
);

/* =======================
   LINE 9 – BREADCRUMB
======================= */

export const fetchCategoryBreadcrumb = createAsyncThunk(
  "categories/fetchBreadcrumb",
  async (slug: string, thunkAPI) => {
    try {
      const res = await api.get(`/categories/breadcrumb/${slug}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch breadcrumb"
      );
    }
  }
);

/* =======================
   SLICE
======================= */

const slice = createSlice({
  name: "categories",
  initialState: {
    list: [],                // flat categories
    tree: [],                // 🌳 category tree (Line 8)
    breadcrumb: [],          // 🧭 breadcrumb (Line 9)
    loading: false,
    treeLoading: false,
    breadcrumbLoading: false,
    error: null,
  } as any,

  reducers: {},

  extraReducers: (b) => {
    /* ---------- FLAT CATEGORIES ---------- */
    b.addCase(getCategories.pending, (s) => {
      s.loading = true;
      s.error = null;
    });

    b.addCase(getCategories.fulfilled, (s, a) => {
      s.loading = false;
      s.list = a.payload;
    });

    b.addCase(getCategories.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload as string;
    });

    /* ---------- CREATE / DELETE ---------- */
    b.addCase(createCategory.fulfilled, (s, a) => {
      s.list.unshift(a.payload);
    });

    b.addCase(deleteCategory.fulfilled, (s, a) => {
      s.list = s.list.filter((c: any) => c._id !== a.payload);
    });

    /* ---------- CATEGORY TREE (LINE 8) ---------- */
    b.addCase(fetchCategoryTree.pending, (s) => {
      s.treeLoading = true;
    });

    b.addCase(fetchCategoryTree.fulfilled, (s, a) => {
      s.treeLoading = false;
      s.tree = a.payload;
    });

    b.addCase(fetchCategoryTree.rejected, (s, a) => {
      s.treeLoading = false;
      s.error = a.payload as string;
    });

    /* ---------- BREADCRUMB (LINE 9) ---------- */
    b.addCase(fetchCategoryBreadcrumb.pending, (s) => {
      s.breadcrumbLoading = true;
    });

    b.addCase(fetchCategoryBreadcrumb.fulfilled, (s, a) => {
      s.breadcrumbLoading = false;
      s.breadcrumb = a.payload;
    });

    b.addCase(fetchCategoryBreadcrumb.rejected, (s, a) => {
      s.breadcrumbLoading = false;
      s.error = a.payload as string;
    });
  },
});

export default slice.reducer;


