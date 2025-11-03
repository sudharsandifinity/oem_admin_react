import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/sap/orders';
const BUSINESS_PARTNER_API = '/sap/business-partners/customers';

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
export const fetchCustomerOrder = createAsyncThunk(
  'customerorder/fetchAll',
  async ({ top = 20, skip = 0 }, thunkApi) => {
    try {
      const response = await api.get(`/sap/orders?top=${top}&skip=${skip}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  }
);

// ✅ Fetch Order by ID
export const fetchCustomerOrderById = createAsyncThunk(
  'customerorder/fetchById',
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
export const createCustomerOrder = createAsyncThunk(
  "customerorder/create",
  async (customerOrderData, thunkApi) => {
    try {
      console.log("🚀 Sending order to API:", customerOrderData);
      const response = await api.post(API_URL, customerOrderData, { withCredentials: true, timeout: 50000 });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
      return thunkApi.rejectWithValue(error.response?.data || "Error creating order");
    }
  }
);


// ✅ Update Order
export const updateCustomerOrder = createAsyncThunk(
  'customerorder/update',
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
export const deleteCustomerOrder = createAsyncThunk(
  'customerorder/delete',
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
const customerorderSlice = createSlice({
  name: 'customerorder',
  initialState: {
    customerorder: [],
    businessPartner: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchCustomerOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.customerorder = action.payload;
      })
      .addCase(fetchCustomerOrder.rejected, (state, action) => {
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
      .addCase(createCustomerOrder.fulfilled, (state, action) => {
        state.customerorder.push(action.payload);
      })

      // Update Order
      .addCase(updateCustomerOrder.fulfilled, (state, action) => {
        const index = state.customerorder.findIndex((o) => o.DocEntry === action.payload.DocEntry);
        if (index !== -1) state.customerorder[index] = action.payload;
      })

      // Delete Order
      .addCase(deleteCustomerOrder.fulfilled, (state, action) => {
        state.customerorder = state.customerorder.filter((o) => o.DocEntry !== action.payload);
      });
  }
});

export default customerorderSlice.reducer;
