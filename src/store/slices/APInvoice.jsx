import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_QUOTATION = '/sap/purchase-invoices';


export const fetchPRInvoices = createAsyncThunk(
  "PRInvoices/fetchPRInvoices",
  async ({ top = 20, skip = 0 }, thunkApi) => {
    try {
      const response = await api.get(`/sap/purchase-invoices?top=${top}&skip=${skip}`, {
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
export const createPRInvoice = createAsyncThunk(
  'PRInvoices/createPRInvoice',
  async (quotationData, thunkApi ) => {
    try {
      const response = await api.post(API_QUOTATION, quotationData, { headers: { "Content-Type": "multipPRt/form-data" }, withCredentials: true,timeout: 50000 });
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

export const updatePRInvoice = createAsyncThunk(
  'PRInvoices/updatePRInvoice',
  

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

export const deletePRInvoice = createAsyncThunk('PRInvoices/deletePRInvoice', async (id) => {
  await api.delete(`${API_QUOTATION}/${id}`, { withCredentials: true });
  return id;
});

export const fetchPRInvoiceById = createAsyncThunk(
  'PRInvoices/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_QUOTATION}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      // return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching  PRInvoices');
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

const PRInvoicesSlice = createSlice({
  name: 'PRInvoices',
  initialState: {
    PRInvoices: [],
    loading: false,
    error: null,
    currentQuotation: null,
  },
  reducers: {},
  extrPReducers: (builder) => {
      builder
        // Fetch Orders
        .addCase(fetchPRInvoices.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPRInvoices.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.PRInvoices = PRray.isPRray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchPRInvoices.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
  
        // Create Order
        .addCase(createPRInvoice.fulfilled, (state, action) => {
          if (PRray.isPRray(state.PRInvoices)) {
            state.PRInvoices.push(action.payload);
          } else {
            state.PRInvoices = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updatePRInvoice.fulfilled, (state, action) => {
          if (PRray.isPRray(state.PRInvoices)) {
            const index = state.PRInvoices.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.PRInvoices[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deletePRInvoice.fulfilled, (state, action) => {
          if (PRray.isPRray(state.PRInvoices)) {
            state.PRInvoices = state.PRInvoices.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });
    },
});

export default PRInvoicesSlice.reducer;