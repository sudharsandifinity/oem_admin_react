import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_QUOTATION = '/sap/quotations';

export const fetchSalesQuotations = createAsyncThunk('quotations/fetchSalesQuotations', async () => {
  const response = await api.get(API_QUOTATION, { withCredentials: true });
  return response.data;
});

export const createSalesQuotation = createAsyncThunk(
  'quotations/createSalesQuotation',
  async (quotationData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_QUOTATION, quotationData, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateSalesQuotation = createAsyncThunk(
  'quotations/updateSalesQuotation',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_QUOTATION}/${id}`, data, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteSalesQuotation = createAsyncThunk('quotations/deleteSalesQuotation', async (id) => {
  await api.delete(`${API_QUOTATION}/${id}`, { withCredentials: true });
  return id;
});

export const fetchSalesQuotationById = createAsyncThunk(
  'quotations/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_QUOTATION}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching Sales quotations');
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
        .addCase(fetchSalesQuotations.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchSalesQuotations.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.quotations = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchSalesQuotations.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
  
        // Create Order
        .addCase(createSalesQuotation.fulfilled, (state, action) => {
          if (Array.isArray(state.quotations)) {
            state.quotations.push(action.payload);
          } else {
            state.quotations = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updateSalesQuotation.fulfilled, (state, action) => {
          if (Array.isArray(state.quotations)) {
            const index = state.quotations.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.quotations[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deleteSalesQuotation.fulfilled, (state, action) => {
          if (Array.isArray(state.quotations)) {
            state.quotations = state.quotations.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });
    },
});

export default quotationsSlice.reducer;