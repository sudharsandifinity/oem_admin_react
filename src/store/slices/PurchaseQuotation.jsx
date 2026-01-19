import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_QUOTATION = '/sap/purchase-quotations';

export const fetchPurchaseQuotation = createAsyncThunk('quotations/fetchPurchaseQuotation', async () => {
  const response = await api.get(API_QUOTATION, { withCredentials: true });
  return response.data;
});

export const createPurchaseQuotation = createAsyncThunk(
  'quotations/createPurchaseQuotation',
  async (quotationData, thunkApi) => {
    try {
       const response = await api.post(API_QUOTATION, quotationData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 50000,
      });
      return response.data;
    } catch (err) {
         console.error("❌ API error:", err.response?.data || err.message);
      return thunkApi.rejectWithValue(
        err.response?.data || "Error creating quotation"
      );
    }
  }
 
);

export const updatePurchaseQuotation = createAsyncThunk(
  'quotations/updatePurchaseQuotation',
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
      return thunkApi.rejectWithValue(
        error.response?.data || "Error updating order"
      );
    }
  }
  
);

export const deletePurchaseQuotation = createAsyncThunk('quotations/deletePurchaseQuotation', async (id) => {
  await api.delete(`${API_QUOTATION}/${id}`, { withCredentials: true });
  return id;
});

export const fetchPurchaseQuotationById = createAsyncThunk(
  'quotations/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_QUOTATION}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching Purchase quotations');
    }
  }
);

const quotationsSlice = createSlice({
  name: 'quotations',
  initialState: {
    quotations: [],
    loading: false,
    error: null,
    currentQuotation: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        // Fetch Orders
        .addCase(fetchPurchaseQuotation.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPurchaseQuotation.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.quotations = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchPurchaseQuotation.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
  
        // Create Order
        .addCase(createPurchaseQuotation.fulfilled, (state, action) => {
          if (Array.isArray(state.quotations)) {
            state.quotations.push(action.payload);
          } else {
            state.quotations = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updatePurchaseQuotation.fulfilled, (state, action) => {
          if (Array.isArray(state.quotations)) {
            const index = state.quotations.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.quotations[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deletePurchaseQuotation.fulfilled, (state, action) => {
          if (Array.isArray(state.quotations)) {
            state.quotations = state.quotations.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });
    },
});

export default quotationsSlice.reducer;