import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

/* =======================
   TYPES
======================= */

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  status: "active" | "inactive";
  displayOrder: number;
  parent: {
    _id: string;
    name: string;
    slug: string;
  } | null;
}

export interface CategoryTree extends Omit<Category, "parent"> {
  parent: string | null;
  children: CategoryTree[];
}

export interface CategoryFormData {
  name: string;
  parent?: string | null;
  description?: string;
  image?: string | null;
  status?: "active" | "inactive";
  displayOrder?: number;
}

interface CategoryState {
  list: Category[];
  parents: Category[];
  subcategories: Category[];
  tree: CategoryTree[];
  breadcrumb: { _id: string; name: string; slug: string }[];
  loading: boolean;
  parentsLoading: boolean;
  subcategoriesLoading: boolean;
  treeLoading: boolean;
  breadcrumbLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  list: [],
  parents: [],
  subcategories: [],
  tree: [],
  breadcrumb: [],
  loading: false,
  parentsLoading: false,
  subcategoriesLoading: false,
  treeLoading: false,
  breadcrumbLoading: false,
  error: null,
};

/* =======================
   PUBLIC THUNKS
======================= */

export const getCategories = createAsyncThunk(
  "categories/getAll",
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

export const getParentCategories = createAsyncThunk(
  "categories/getParents",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories/public/parents");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch parent categories"
      );
    }
  }
);

export const getSubcategories = createAsyncThunk(
  "categories/getSubcategories",
  async (parentId: string, thunkAPI) => {
    try {
      const res = await api.get(`/categories/public/subcategories/${parentId}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch subcategories"
      );
    }
  }
);

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
   ADMIN THUNKS
======================= */

export const getAdminCategories = createAsyncThunk(
  "categories/getAdmin",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories/admin");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch categories"
      );
    }
  }
);

export const getAdminParentCategories = createAsyncThunk(
  "categories/getAdminParents",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/categories/admin/parents");
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch parent categories"
      );
    }
  }
);

export const getAdminSubcategories = createAsyncThunk(
  "categories/getAdminSubcategories",
  async (parentId: string, thunkAPI) => {
    try {
      const res = await api.get(`/categories/admin/subcategories/${parentId}`);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to fetch subcategories"
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (data: CategoryFormData, thunkAPI) => {
    try {
      const res = await api.post("/categories", data);
      return res.data.category;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to create category"
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }: { id: string; data: CategoryFormData }, thunkAPI) => {
    try {
      const res = await api.put(`/categories/${id}`, data);
      return res.data.category;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to update category"
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
   SLICE
======================= */

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSubcategories: (state) => {
      state.subcategories = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ---------- GET ALL CATEGORIES ---------- */
    builder.addCase(getCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(getCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ---------- GET PARENT CATEGORIES ---------- */
    builder.addCase(getParentCategories.pending, (state) => {
      state.parentsLoading = true;
      state.error = null;
    });
    builder.addCase(getParentCategories.fulfilled, (state, action) => {
      state.parentsLoading = false;
      state.parents = action.payload;
    });
    builder.addCase(getParentCategories.rejected, (state, action) => {
      state.parentsLoading = false;
      state.error = action.payload as string;
    });

    /* ---------- GET SUBCATEGORIES ---------- */
    builder.addCase(getSubcategories.pending, (state) => {
      state.subcategoriesLoading = true;
      state.error = null;
    });
    builder.addCase(getSubcategories.fulfilled, (state, action) => {
      state.subcategoriesLoading = false;
      state.subcategories = action.payload;
    });
    builder.addCase(getSubcategories.rejected, (state, action) => {
      state.subcategoriesLoading = false;
      state.error = action.payload as string;
    });

    /* ---------- ADMIN GET ALL ---------- */
    builder.addCase(getAdminCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAdminCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(getAdminCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ---------- ADMIN GET PARENTS ---------- */
    builder.addCase(getAdminParentCategories.pending, (state) => {
      state.parentsLoading = true;
    });
    builder.addCase(getAdminParentCategories.fulfilled, (state, action) => {
      state.parentsLoading = false;
      state.parents = action.payload;
    });
    builder.addCase(getAdminParentCategories.rejected, (state, action) => {
      state.parentsLoading = false;
      state.error = action.payload as string;
    });

    /* ---------- ADMIN GET SUBCATEGORIES ---------- */
    builder.addCase(getAdminSubcategories.pending, (state) => {
      state.subcategoriesLoading = true;
    });
    builder.addCase(getAdminSubcategories.fulfilled, (state, action) => {
      state.subcategoriesLoading = false;
      state.subcategories = action.payload;
    });
    builder.addCase(getAdminSubcategories.rejected, (state, action) => {
      state.subcategoriesLoading = false;
      state.error = action.payload as string;
    });

    /* ---------- CREATE ---------- */
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.list.unshift(action.payload);
      // Update parents list if it's a parent category
      if (!action.payload.parent) {
        state.parents.unshift(action.payload);
      }
    });

    /* ---------- UPDATE ---------- */
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      const index = state.list.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      // Update parents list
      const parentIndex = state.parents.findIndex((c) => c._id === action.payload._id);
      if (!action.payload.parent && parentIndex === -1) {
        state.parents.push(action.payload);
      } else if (action.payload.parent && parentIndex !== -1) {
        state.parents.splice(parentIndex, 1);
      } else if (!action.payload.parent && parentIndex !== -1) {
        state.parents[parentIndex] = action.payload;
      }
    });

    /* ---------- DELETE ---------- */
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.list = state.list.filter((c) => c._id !== action.payload);
      state.parents = state.parents.filter((c) => c._id !== action.payload);
      state.subcategories = state.subcategories.filter((c) => c._id !== action.payload);
    });

    /* ---------- CATEGORY TREE ---------- */
    builder.addCase(fetchCategoryTree.pending, (state) => {
      state.treeLoading = true;
    });
    builder.addCase(fetchCategoryTree.fulfilled, (state, action) => {
      state.treeLoading = false;
      state.tree = action.payload;
    });
    builder.addCase(fetchCategoryTree.rejected, (state, action) => {
      state.treeLoading = false;
      state.error = action.payload as string;
    });

    /* ---------- BREADCRUMB ---------- */
    builder.addCase(fetchCategoryBreadcrumb.pending, (state) => {
      state.breadcrumbLoading = true;
    });
    builder.addCase(fetchCategoryBreadcrumb.fulfilled, (state, action) => {
      state.breadcrumbLoading = false;
      state.breadcrumb = action.payload;
    });
    builder.addCase(fetchCategoryBreadcrumb.rejected, (state, action) => {
      state.breadcrumbLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSubcategories, clearError } = categorySlice.actions;
export default categorySlice.reducer;
