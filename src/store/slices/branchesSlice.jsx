import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = "/admin/branches";

export const fetchBranch = createAsyncThunk(
  "branches/fetchBranches",
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching branch"
      );
    }
  }
);

export const createBranch = createAsyncThunk(
  "branch/createBranch",
  async (data, thunkApi) => {
    try {
      const response = await api.post(API_URL, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error creating branch" 
      );
    }
  }
);

export const updateBranch = createAsyncThunk(
  "branch/updateBranch",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteBranch = createAsyncThunk(
  "branch/deleteBranch",
  async (id, thunkAPI) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  }
);
export const fetchBranchFormsById = createAsyncThunk(
  "branch/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching branch"
      );
    }
  }
);

const branchSlice = createSlice({
  name: "branch",
  initialState: {
    branches: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.branches = action.payload;
      })
      .addCase(fetchBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        const index = state.branches.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.branches = state.branches.filter((c) => c.id !== action.payload);
      });
  },
});

export default branchSlice.reducer;
