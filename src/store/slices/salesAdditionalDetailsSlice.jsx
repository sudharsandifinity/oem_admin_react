import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { cusapi } from "../../api/axios";

const API_WAREHOUSE_URL = "/sap/warehouses";
const API_PROJECTS_URL = "/sap/projects";
const API_SALES_URL = "/sap/tax-code/sales-order";
const API_PURCHASE_URL = "/sap/tax-code/purchase-order";
const API_FREIGHT_URL = "/sap/others/freights";
const API_ATTACHMENTS_URL = "/sap/attachments";
const API_PROFITCENTER_URL = "/sap/profit-centers";
const API_DIMENSION_URL = "/sap/dimensions";
const API_ITEMPRICE_URL = "/sap/SpecialPrices";


export const fetchitemprices = createAsyncThunk(
  "itemprices/fetchitemprices", 
  async ({ cardCode, itemCode }, thunkApi) => {
    try {
      const response = await api.get(`${API_ITEMPRICE_URL}?cardCode=${cardCode}&itemCode=${itemCode}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching item price details"
      );
    }
  }
);
export const fetchProfitCenterDetails = createAsyncThunk(
  "profitcenterdetails/fetchProfitCenterDetails", 
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_PROFITCENTER_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching profit center details"
      );
    }
  }
);
export const fetchDimensionDetails = createAsyncThunk(
  "dimensiondetails/fetchDimensionDetails", 
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_DIMENSION_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching dimension details"
      );
    }
  }
);
export const fetchProjectsDetails = createAsyncThunk(
  "projectsdetails/fetchProjectsDetails", 
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_PROJECTS_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching projects details"
      );
    }
  }
);

export const fetchWarehousesDetails = createAsyncThunk(
  "warehousesdetails/fetchWarehousesDetails", 
  async (_, thunkApi) => {
    try {
      const response = await api.get(API_WAREHOUSE_URL, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data || "Error fetching warehouses details"
      );
    }
  }
);

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
    profitcenterdetail:[],
    dimensiondetails:[],
    projectsdetails:[],
    warehousesdetails:[],
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
      .addCase(fetchWarehousesDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWarehousesDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.warehousesdetails = action.payload;
      })
      .addCase(fetchWarehousesDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(fetchDimensionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDimensionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.dimensiondetails = action.payload;
      })
      .addCase(fetchDimensionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
      .addCase(fetchProfitCenterDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfitCenterDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.profitcenterdetail = action.payload;
      })
      .addCase(fetchProfitCenterDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      })
       .addCase(fetchProjectsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.projectsdetails = action.payload;
      })
      .addCase(fetchProjectsDetails.rejected, (state, action) => {
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
