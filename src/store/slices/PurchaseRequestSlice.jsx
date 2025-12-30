import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_REQUEST = '/sap/purchase-requests';

export const fetchPurchaseRequest = createAsyncThunk('requests/fetchPurchaseRequest', async () => {
  const response = await api.get(API_REQUEST, { withCredentials: true });
  return response.data;
});

export const createPurchaseRequest = createAsyncThunk(
  'requests/createPurchaseRequest',
  async (requestData, thunkApi) => {
    try {
       const response = await api.post(API_REQUEST, requestData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 50000,
      });
      return response.data;
    } catch (err) {
  console.error("❌ API error:", err.response?.data || err.message);
      return thunkApi.rejectWithValue(
        err.response?.data || "Error creating request"
      );
    }
  }
);

export const updatePurchaseRequest = createAsyncThunk(
  'requests/updatePurchaseRequest',
  async ({ id, data }, thunkApi) => {
    try {
      const response = await api.patch(`${API_REQUEST}/${id}`, data, {
       headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 60000,
      });
      return response.data;
    } catch (err) {
       console.error("❌ API error:", err.response?.data || err.message);
      return thunkApi.rejectWithValue(
        err.response?.data || "Error creating request"
      );
    }
  }
);

export const deletePurchaseRequest = createAsyncThunk('requests/deletePurchaseRequest', async (id) => {
  await api.delete(`${API_REQUEST}/${id}`, { withCredentials: true });
  return id;
});

export const fetchPurchaseRequestById = createAsyncThunk(
  'requests/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_REQUEST}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching Purchase requests');
    }
  }
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    loading: false,
    error: null,
    currentRequest: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        // Fetch Orders
        .addCase(fetchPurchaseRequest.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPurchaseRequest.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.requests = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchPurchaseRequest.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
  
        // Create Order
        .addCase(createPurchaseRequest.fulfilled, (state, action) => {
          if (Array.isArray(state.requests)) {
            state.requests.push(action.payload);
          } else {
            state.requests = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updatePurchaseRequest.fulfilled, (state, action) => {
          if (Array.isArray(state.requests)) {
            const index = state.requests.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.requests[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deletePurchaseRequest.fulfilled, (state, action) => {
          if (Array.isArray(state.requests)) {
            state.requests = state.requests.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });
    },
});

export default requestsSlice.reducer;