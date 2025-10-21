import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = "/sap/services";

export const fetchOrderServices = createAsyncThunk(
  "orderServices/fetchOrderServices",
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching orderServices"
      );
    }
  }
);

export const createOrderServices = createAsyncThunk(
  "orderServices/createOrderServices",
  async (data, thunkApi) => {
    try {
      const response = await api.post(API_URL, data, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error creating orderServices" 
      );
    }
  }
);

export const updateOrderServices = createAsyncThunk(
  "orderServices/updateOrderServices",
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

export const deleteOrderServices = createAsyncThunk(
  "orderServices/deleteOrderServices",
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
export const fetchOrderServicesFormsById = createAsyncThunk(
  "orderServices/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching orderServices"
      );
    }
  }
);

const orderServicesSlice = createSlice({
  name: "orderServices",
  initialState: {
    orderServices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderServices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderServices = action.payload;
      })
      .addCase(fetchOrderServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(createOrderServices.fulfilled, (state, action) => {
        state.orderServices.push(action.payload);
      })
      .addCase(updateOrderServices.fulfilled, (state, action) => {
        const index = state.orderServices.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.orderServices[index] = action.payload;
        }
      })
      .addCase(deleteOrderServices.fulfilled, (state, action) => {
        state.orderServices = state.orderServices.filter((c) => c.id !== action.payload);
      });
  },
});

export default orderServicesSlice.reducer;
