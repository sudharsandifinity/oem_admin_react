import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = "/auth/login";
const ChangePasswordURL = "/auth/change-password";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post(API_URL, credentials, {
        withCredentials: true,
      });
      console.log("data", response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.response?.data?.message || "Login failed",
      });
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/change-password",
  async (data, thunkAPI) => {
    try {
      const response = await api.post(ChangePasswordURL, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong",
      );
    }
  },
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, confirmPassword }, thunkAPI) => {
    try {
      const response = await api.post(`/auth/reset-password?token=${token}`, {
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Something went wrong",
      );
    }
  },
);

export const fetchAuthUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      console.log("fetchAuthUserres",res)
      return res.data;
    } catch (err) {
      // return thunkAPI.rejectWithValue(
      //   err.response?.data || "Not authenticated",
      // );
      console.error("❌ API error:", err.response?.data || err.message);
       console.log("error.response",err)
      return thunkAPI.rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || "Not authenticated",
    }   );
  }
}
);
export const fetchAuthUsercheck = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/profile", { withCredentials: true });
      console.log("fetchAuthUserres",res)
      return localStorage.getItem("user") ? JSON.parse(storedUser) : res.data;
    } catch (err) {
      // return thunkAPI.rejectWithValue(
      //   err.response?.data || "Not authenticated",
      // );
      console.error("❌ API error:", err.response?.data || err.message);
       console.log("error.response",err)
      return thunkAPI.rejectWithValue({
        status: err.response?.status,
        message: err.response?.data?.message || "Not authenticated",
    }   );
  }
}
);
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("user") ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    permissions: [],
    status: "idle",
    error: null,
    loading: false,
    forgotStatus: "idle",
    forgotMessage: null,
    resetStatus: "idle",
    resetMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null; 
      state.permissions = [];
      state.loading = false;
      localStorage.removeItem("token");
  localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
  state.loading = false;
  state.status = "succeeded";
  state.user = action.payload.user;
  state.token = action.payload.token; // <-- add this
  state.permissions = action.payload?.user?.Role?.Permissions.map(
    (permission) => permission.name
  );
  localStorage.setItem("token", action.payload.token); // optional
})
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.forgotStatus = "loading";
        state.forgotMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotStatus = "succeeded";
        state.forgotMessage = action.payload.message || "Reset link sent!";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotStatus = "failed";
        state.forgotMessage = action.payload || "Something went wrong";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetStatus = "loading";
        state.resetMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetStatus = "succeeded";
        state.resetMessage =
          action.payload.message || "Password has been reset";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetStatus = "failed";
        state.resetMessage = action.payload || "Something went wrong";
      })

      // fetchauthUser
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.permissions = action.payload?.Role?.Permissions.map(
          (permission) => {
            return permission.name;
          },
        );
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
