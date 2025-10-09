import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = "/sap/items";

export const fetchVendorOrderItems = createAsyncThunk(
  "vendorOrderItems/fetchVendorOrderItems",
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching vendorOrderItems"
      );
    }
  }
);

export const createVendorOrderItems = createAsyncThunk(
  "vendorOrderItems/createVendorOrderItems",
  async (data, thunkApi) => {
    try {
      const response = await api.post(API_URL, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error creating vendorOrderItems" 
      );
    }
  }
);

export const updateVendorOrderItems = createAsyncThunk(
  "vendorOrderItems/updateVendorOrderItems",
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

export const deleteOrderItems = createAsyncThunk(
  "vendorOrderItems/deleteVendorOrderItems",
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
export const fetchVendorOrderItemsFormsById = createAsyncThunk(
  "vendorOrderItems/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching vendorOrderItems"
      );
    }
  }
);

const vendorOrderItemsSlice = createSlice({
  name: "vendorOrderItems",
  initialState: {
    vendororderItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.vendororderItems = action.payload;
      })
      .addCase(fetchVendorOrderItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(createVendorOrderItems.fulfilled, (state, action) => {
        state.vendororderItems.push(action.payload);
      })
      .addCase(updateVendorOrderItems.fulfilled, (state, action) => {
        const index = state.vendorOrderItemses.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.vendororderItems[index] = action.payload;
        }
      })
      .addCase(deleteOrderItems.fulfilled, (state, action) => {
        state.vendororderItems = state.vendorOrderItemses.filter((c) => c.id !== action.payload);
      });
  },
});

export default vendorOrderItemsSlice.reducer;
