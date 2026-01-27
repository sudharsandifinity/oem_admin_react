import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// API Base URL
const API_URL = "/sap/purchase-orders";
const BUSINESS_PARTNER_API = "/sap/business-partners/vendors";

// ✅ Fetch Business Partners
export const fetchPurBusinessPartner = createAsyncThunk(
  "businessPartner/fetchPurBusinessPartner",
  async (_, thunkApi) => {
    try {
      const response = await api.get(BUSINESS_PARTNER_API, {
        withCredentials: true,
      });
      return response.data.value; // usually wrapped in { value: [...] }
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching business partners",
      );
    }
  },
);

// ✅ Fetch All Orders
export const fetchPurchaseOrder = createAsyncThunk(
  "purchaseorder/fetchAll",
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_URL, { withCredentials: true });
      return response.data.value;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching orders",
      );
    }
  },
);

// ✅ Fetch Order by ID
export const fetchPurchaseOrderById = createAsyncThunk(
  "purchaseorder/fetchById",
  async (id, thunkApi) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching order by ID",
      );
    }
  },
);

// ✅ Create Order
export const createPurchaseOrder = createAsyncThunk(
  "purchaseorder/create",

  async (purchaseOrderData, thunkApi) => {
    console.log("purchaseOrderData",purchaseOrderData)
    try {
      const response = await api.post(API_URL, purchaseOrderData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        timeout: 50000,
      });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
      return thunkApi.rejectWithValue(
        error.response?.data || "Error creating order",
      );
    }
  },
);

// ✅ Update Order
export const updatePurchaseOrder = createAsyncThunk(
  "purchaseorder/update",

  async ({ id, data }, thunkApi) => {
    try {
      console.log("🚀 Sending order to API:", data);
      const response = await api.patch(`${API_URL}/${id}`, data, {
        withCredentials: true,
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
      return thunkApi.rejectWithValue(
        error.response?.data || "Error updating order",
      );
    }
  },
);

// ✅ Delete Order
export const deletePurchaseOrder = createAsyncThunk(
  "purchaseorder/delete",
  async (id, thunkApi) => {
    try {
      await api.delete(`${API_URL}(${id})`, { withCredentials: true });
      return id;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error deleting order",
      );
    }
  },
);

// Slice
const PurchaseOrderSlice = createSlice({
  name: "purchaseorder",
  initialState: {
    purchaseorder: [],
    businessPartner: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseorder = action.payload;
      })
      .addCase(fetchPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Business Partners
      .addCase(fetchPurBusinessPartner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurBusinessPartner.fulfilled, (state, action) => {
        state.loading = false;
        state.businessPartner = action.payload;
      })
      .addCase(fetchPurBusinessPartner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Order
     
.addCase(createPurchaseOrder.fulfilled, (state, action) => {
        if (Array.isArray(state.purchaseorder)) {
          state.purchaseorder.push(action.payload);
        } else {
          state.purchaseorder = [action.payload];
        }
      })
      // Update Order
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        const index = state.purchaseorder.findIndex(
          (o) => o.DocEntry === action.payload.DocEntry,
        );
        if (index !== -1) state.purchaseorder[index] = action.payload;
      })

      // Delete Order
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.purchaseorder = state.purchaseorder.filter(
          (o) => o.DocEntry !== action.payload,
        );
      });
  },
});

export default PurchaseOrderSlice.reducer;
