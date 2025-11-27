// customerDetailsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = "/sap/business-partners/customers";

// ✅ Fetch all customers (CardType = 'C')
export const loginToSap = createAsyncThunk(
  "sap/login",
  async (_, thunkApi) => {
    try {
      const response = await api.post("/Login", {
        UserName: "manager",
        Password: "Sap@12345",
        CompanyDB: "GLD_Demo",
      });
      return response.data; // will contain SessionId etc.
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Login failed"
      );
    }
  }
);
export const fetchCustomerDetails = createAsyncThunk(
  "customerDetails/fetchCustomerDetails",
  async (_, thunkApi) => {
    try {
      const response = await api.get(
        API_URL,
        {
          withCredentials: true,
        }
      );

      return response.data.value; // SAP SL usually wraps in { value: [...] }
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching CustomerDetails"
      );
    }
  }
);



// ✅ Create customer
export const createCustomerDetails = createAsyncThunk(
  "customerdetails/create",
  async (data, thunkApi) => {
    try {
      const response = await api.post(API_URL, data, {
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
      const response = await api.patch(`${API_URL}('${cardCode}')`, data, {
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
      await api.delete(`${API_URL}('${cardCode}')`, {
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
      const response = await api.get(`${API_URL}('${cardCode}')`, {
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
