import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cusapi } from "../../api/axios";

// Base URL for BusinessPartners
const API_URL = `/BusinessPartners?$filter=CardType eq 'C'`;


// ✅ Fetch all customers (CardType = 'C')
export const fetchCustomerDetails = createAsyncThunk(
  "customerdetails/fetchAll",
  async (_, thunkApi) => {
    try {
      const response = await cusapi.get(`${API_URL}?$filter=CardType eq 'C'`, {
        withCredentials: true,
      });
      return response.data.value; // SAP SL wraps results in { value: [...] }
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching customers"
      );
    }
  }
);

// ✅ Create customer
export const createCustomerDetails = createAsyncThunk(
  "customerdetails/create",
  async (data, thunkApi) => {
    try {
      const response = await cusapi.post(API_URL, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error creating customer"
      );
    }
  }
);

// ✅ Update customer by CardCode
export const updateCustomerDetails = createAsyncThunk(
  "customerdetails/update",
  async ({ cardCode, data }, thunkApi) => {
    try {
      const response = await cusapi.patch(`${API_URL}('${cardCode}')`, data, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error updating customer"
      );
    }
  }
);

// ✅ Delete customer by CardCode
export const deleteCustomerDetails = createAsyncThunk(
  "customerdetails/delete",
  async (cardCode, thunkApi) => {
    try {
      await cusapi.delete(`${API_URL}('${cardCode}')`, {
        withCredentials: true,
      });
      return cardCode; // return deleted key
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error deleting customer"
      );
    }
  }
);

// ✅ Fetch single customer by CardCode
export const fetchCustomerDetailsById = createAsyncThunk(
  "customerdetails/fetchById",
  async (cardCode, thunkApi) => {
    try {
      const response = await cusapi.get(`${API_URL}('${cardCode}')`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching customer"
      );
    }
  }
);

const customerdetailsSlice = createSlice({
  name: "customerdetails",
  initialState: {
    customerdetails: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.customerdetails = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createCustomerDetails.fulfilled, (state, action) => {
        state.customerdetails.push(action.payload);
      })

      // Update
      .addCase(updateCustomerDetails.fulfilled, (state, action) => {
        const index = state.customerdetails.findIndex(
          (c) => c.CardCode === action.payload.CardCode
        );
        if (index !== -1) {
          state.customerdetails[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteCustomerDetails.fulfilled, (state, action) => {
        state.customerdetails = state.customerdetails.filter(
          (c) => c.CardCode !== action.payload
        );
      })

      // Fetch by ID
      .addCase(fetchCustomerDetailsById.fulfilled, (state, action) => {
        // Optional: store separately or merge into customerdetails
      });
  },
});

export default customerdetailsSlice.reducer;
