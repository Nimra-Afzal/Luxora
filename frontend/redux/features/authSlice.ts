// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "../../lib/api";

// interface AuthState {
//   user: any;
//   token: string | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   loading: false,
//   error: null,
// };

// // Thunks
// export const signup = createAsyncThunk(
//   "auth/signup",
//   async (formData: { username: string; email: string; password: string }, thunkAPI) => {
//     try {
//       const res = await axios.post("/auth/register", formData);
//       return res.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Signup failed");
//     }
//   }
// );

// export const login = createAsyncThunk(
//   "auth/login",
//   async (formData: { email: string; password: string }, thunkAPI) => {
//     try {
//       const res = await axios.post("/auth/login", formData);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       return res.data;
//     } catch (err: any) {
//       return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.clear();
//     },
//     setUserFromStorage: (state) => {
//       const token = localStorage.getItem("token");
//       const user = localStorage.getItem("user");
//       if (token && user) {
//         state.token = token;
//         state.user = JSON.parse(user);
//         state.isAuthenticated = true;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signup.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signup.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(signup.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.user;
//         state.isAuthenticated = true;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logout, setUserFromStorage } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/api";

interface AuthState {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// -----------------------------
// SIGNUP THUNK
// -----------------------------
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    formData: { username: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("/auth/register", formData);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

// -----------------------------
// LOGIN THUNK
// -----------------------------
export const login = createAsyncThunk(
  "auth/login",
  async (formData: { email: string; password: string }, thunkAPI) => {
    try {
      const res = await axios.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

// -----------------------------
// AUTH SLICE
// -----------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },

    // LOAD USER FROM LOCAL STORAGE
    setUserFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },

    // ⭐ NEW: UPDATE USER AFTER PROFILE UPDATE
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      // Update localStorage so navbar/profile stay in sync
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },

  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// EXPORT ACTIONS
export const { logout, setUserFromStorage, setUser } = authSlice.actions;

// EXPORT REDUCER
export default authSlice.reducer;
