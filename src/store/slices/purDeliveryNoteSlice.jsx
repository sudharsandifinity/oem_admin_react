import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_REQUEST = '/sap/purchase-delivery-notes';

export const fetchPurchaseDeliveryNotes = createAsyncThunk('requests/fetchPurchaseDeliveryNotes', async () => {
  const response = await api.get(API_REQUEST, { withCredentials: true });
  return response.data;
});

export const createPurchaseDeliveryNotes = createAsyncThunk(
  'requests/createPurchaseDeliveryNotes',
  
   async (requestData, thunkApi) => {
    try {
      const response = await api.post(API_REQUEST, requestData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true,timeout: 50000 });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
       return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

export const updatePurchaseDeliveryNotes = createAsyncThunk(
  'requests/updatePurchaseDeliveryNotes',
  
    async ({ id, data }, thunkApi) => { 
    try {
      console.log("🚀 Sending order to API:", data);
      const response = await api.patch(`${API_REQUEST}/${id}`, data, {
        withCredentials: true,
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
       return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

export const deletePurchaseDeliveryNotes = createAsyncThunk('requests/deletePurchaseDeliveryNotes', async (id) => {
  await api.delete(`${API_REQUEST}/${id}`, { withCredentials: true });
  return id;
});

export const fetchPurchaseDeliveryNotesById = createAsyncThunk(
  'requests/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_REQUEST}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

const purDeliveryNoteSlice = createSlice({
  name: 'requests',
  initialState: {
    deliveryNotes: [],
    loading: false,
    error: null,
    currentRequest: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        // Fetch Orders
        .addCase(fetchPurchaseDeliveryNotes.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPurchaseDeliveryNotes.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.deliveryNotes = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchPurchaseDeliveryNotes.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  
  
        // Create Order
        .addCase(createPurchaseDeliveryNotes.fulfilled, (state, action) => {
          if (Array.isArray(state.deliveryNotes)) {
            state.deliveryNotes.push(action.payload);
          } else {
            state.deliveryNotes = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updatePurchaseDeliveryNotes.fulfilled, (state, action) => {
          if (Array.isArray(state.deliveryNotes)) {
            const index = state.deliveryNotes.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.deliveryNotes[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deletePurchaseDeliveryNotes.fulfilled, (state, action) => {
          if (Array.isArray(state.deliveryNotes)) {
            state.deliveryNotes = state.deliveryNotes.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });
    },
});

export default purDeliveryNoteSlice.reducer;