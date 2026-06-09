import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_QUOTATION = '/sap/sales-invoices';


export const fetchARInvoices = createAsyncThunk(
  "ARInvoices/fetchARInvoices",
  async ({ top = 20, skip = 0 }, thunkApi) => {
    try {
      const response = await api.get(`/sap/sales-invoices?top=${top}&skip=${skip}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);
export const createARInvoice = createAsyncThunk(
  'ARInvoices/createARInvoice',
  async (quotationData, thunkApi ) => {
    try {
      const response = await api.post(API_QUOTATION, quotationData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true,timeout: 50000 });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
      // return thunkApi.rejectWithValue(
      //   error.response?.data || "Error creating order"
      // );
    }
  }
);

export const updateARInvoice = createAsyncThunk(
  'ARInvoices/updateARInvoice',
  

  async ({ id, data }, thunkApi) => { 
    try {
      console.log("🚀 Sending order to API:", data);
      const response = await api.patch(`${API_QUOTATION}/${id}`, data, {
        withCredentials: true,
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.error?.error?.message||error.response?.data?.message || "Login failed",
      });
     
    }
  }
);

export const deleteARInvoice = createAsyncThunk('ARInvoices/deleteARInvoice', async (id) => {
  await api.delete(`${API_QUOTATION}/${id}`, { withCredentials: true });
  return id;
});

export const fetchARInvoiceById = createAsyncThunk(
  'ARInvoices/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_QUOTATION}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      // return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching  ARInvoices');
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

const ARInvoicesSlice = createSlice({
  name: 'ARInvoices',
  initialState: {
    ARInvoices: [],
    loading: false,
    error: null,
    currentQuotation: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        // Fetch Orders
        .addCase(fetchARInvoices.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchARInvoices.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.ARInvoices = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchARInvoices.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
  
        // Create Order
        .addCase(createARInvoice.fulfilled, (state, action) => {
          if (Array.isArray(state.ARInvoices)) {
            state.ARInvoices.push(action.payload);
          } else {
            state.ARInvoices = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updateARInvoice.fulfilled, (state, action) => {
          if (Array.isArray(state.ARInvoices)) {
            const index = state.ARInvoices.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.ARInvoices[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deleteARInvoice.fulfilled, (state, action) => {
          if (Array.isArray(state.ARInvoices)) {
            state.ARInvoices = state.ARInvoices.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });
    },
});

export default ARInvoicesSlice.reducer;