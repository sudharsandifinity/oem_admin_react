import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_SALES_URL = "/sap/tax-code/sales-order";
const API_PURCHASE_URL = "/sap/tax-code/purchase-order";
const API_FREIGHT_URL = "/sap/others/freights";
const API_ATTACHMENTS_URL = "/sap/attachments";


export const fetchSalesOrderAddDetails = createAsyncThunk(
  "salesadddetails/fetchSalesOrderAddDetails", 
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_SALES_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching salesorderadddetails"
      );
    }
  }
);

export const fetchPurOrderAddDetails = createAsyncThunk(
  "salesadddetails/fetchPurOrderAddDetails",
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_PURCHASE_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching purchase order add details"
      );
    }
  }
);
export const fetchfreightDetails= createAsyncThunk(
  "freightdetails/fetchfreightDetails",
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_FREIGHT_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching freight details"
      );
    }
  }
);
export const fetchAttachmentDetailsById= createAsyncThunk(
  "attachmentdetails/fetchAttachmentDetailsById",
  async (id, thunkApi) => {
    try {
      const response = await api.get(`${API_ATTACHMENTS_URL}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching attachments details"
      );
    }
  }
);
const salesAdditionalDetailsSlice = createSlice({
  name: "salesadddetails",
  initialState: {
    salesadddetails: [],
    puradddetails:[],
    freightdetails:[],
    attachmentdetails:[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurOrderAddDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurOrderAddDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.puradddetails = action.payload;
      })
      .addCase(fetchPurOrderAddDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
    .addCase(fetchSalesOrderAddDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrderAddDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.salesadddetails = action.payload;
      })
      .addCase(fetchSalesOrderAddDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
       .addCase(fetchfreightDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchfreightDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.freightdetails = action.payload;
      })
      .addCase(fetchfreightDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })

    .addCase(fetchAttachmentDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttachmentDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.attachmentdetails = action.payload;
      })
      .addCase(fetchAttachmentDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
  },
});

export default salesAdditionalDetailsSlice.reducer;
