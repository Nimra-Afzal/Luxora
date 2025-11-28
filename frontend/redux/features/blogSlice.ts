import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import { toast } from "sonner";

// Fetch my blogs
export const getMyBlogs = createAsyncThunk("blogs/getMyBlogs", async (_, thunkAPI) => {
  try {
    const res = await api.get("/blogs/my");
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to fetch blogs");
  }
});

// Create blog
export const createBlog = createAsyncThunk("blogs/createBlog", async (data: any, thunkAPI) => {
  try {
    const res = await api.post("/blogs", data);
    toast.success("Blog created successfully!");
    return res.data.blog;
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Failed to create blog");
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to create blog");
  }
});

// Update blog
export const updateBlog = createAsyncThunk("blogs/updateBlog", async ({ id, data }: any, thunkAPI) => {
  try {
    const res = await api.put(`/blogs/${id}`, data);
    toast.success("Blog updated successfully!");
    return res.data.blog;
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Failed to update blog");
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to update blog");
  }
});

// Delete blog
export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id: string, thunkAPI) => {
  try {
    await api.delete(`/blogs/${id}`);
    toast.success("Blog deleted successfully!");
    return id;
  } catch (err: any) {
    toast.error(err.response?.data?.error || "Failed to delete blog");
    return thunkAPI.rejectWithValue(err.response?.data?.error || "Failed to delete blog");
  }
});

interface BlogState {
  mine: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  mine: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get My Blogs
      .addCase(getMyBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = action.payload.blogs || [];
      })
      .addCase(getMyBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.mine.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Blog
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = state.mine.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.mine = state.mine.filter((b) => b._id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default blogSlice.reducer;
