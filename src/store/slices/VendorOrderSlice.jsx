import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/sap/purchase-orders';
const BUSINESS_PARTNER_API = '/sap/business-partners/vendors';

// ✅ Fetch Business Partners
export const fetchBusinessPartner = createAsyncThunk(
  'businessPartner/fetchBusinessPartner',
  async (_, thunkApi) => {
    try {
      const response = await api.get(BUSINESS_PARTNER_API, { withCredentials: true });
      return response.data.value; // usually wrapped in { value: [...] }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || 'Error fetching business partners');
    }
  }
);

// ✅ Fetch All Orders
export const fetchVendorOrder = createAsyncThunk(
  'vendororder/fetchAll',
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_URL, { withCredentials: true });
      return response.data.value;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  }
);

// ✅ Fetch Order by ID
export const fetchVendorOrderById = createAsyncThunk(
  'vendororder/fetchById',
  async (id, thunkApi) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || 'Error fetching order by ID');
    }
  }
);

// ✅ Create Order
export const createVendorOrder = createAsyncThunk(
  "vendororder/create",
  async (vendorOrderData, thunkApi) => {
    try {
      console.log("🚀 Sending order to API:", vendorOrderData);
      const response = await api.post(API_URL, vendorOrderData, { withCredentials: true, timeout: 40000 });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
      return thunkApi.rejectWithValue(error.response?.data || "Error creating order");
    }
  }
);


// ✅ Update Order
export const updateVendorOrder = createAsyncThunk(
  'vendororder/update',
  async ({ id, data }, thunkApi) => {
    try {
      console.log("🚀 Sending order to API:", data);
      const response = await api.patch(`${API_URL}/${id}`, data, { withCredentials: true, timeout: 60000 });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
      return thunkApi.rejectWithValue(error.response?.data || 'Error updating order');
    }
  }
);


// ✅ Delete Order
export const deleteVendorOrder = createAsyncThunk(
  'vendororder/delete',
  async (id, thunkApi) => {
    try {
      await api.delete(`${API_URL}(${id})`, { withCredentials: true });
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || 'Error deleting order');
    }
  }
);

// Slice
const vendororderSlice = createSlice({
  name: 'vendororder',
  initialState: {
    vendororder: [],
    businessPartner: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchVendorOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.vendororder = action.payload;
      })
      .addCase(fetchVendorOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Business Partners
      .addCase(fetchBusinessPartner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinessPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.businessPartner = action.payload;
      })
      .addCase(fetchBusinessPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Order
      .addCase(createVendorOrder.fulfilled, (state, action) => {
        state.vendororder.push(action.payload);
      })

      // Update Order
      .addCase(updateVendorOrder.fulfilled, (state, action) => {
        const index = state.vendororder.findIndex((o) => o.DocEntry === action.payload.DocEntry);
        if (index !== -1) state.vendororder[index] = action.payload;
      })

      // Delete Order
      .addCase(deleteVendorOrder.fulfilled, (state, action) => {
        state.vendororder = state.vendororder.filter((o) => o.DocEntry !== action.payload);
      });
  }
});

export default vendororderSlice.reducer;
