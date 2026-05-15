import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_MATERIALREQUEST = '/sap/mr';
const API_BOQLIST = '/sap/boq/active';
const API_USERS = '/sap/users';
const API_EMPLOYEES = '/sap/employees';
const API_DEPARTMENTS = '/sap/departments';
const API_GI='sap/gi'


export const createGoodsIssue = createAsyncThunk(
  'goodsIssue/createGoodsIssue',
  async (goodsIssueData, thunkApi ) => {
    try {
      const response = await api.post(API_GI, goodsIssueData, { withCredentials: true,timeout: 50000 });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response.data.error.error.message);
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.error?.error?.message|| error.response?.data?.message  ||"Login failed",
      });
      // return thunkApi.rejectWithValue(
      //   error.response?.data || "Error creating order"
      // );
    }
  }
);
export const fetchUsersList = createAsyncThunk(
  "userList/fetchUsersList",
  async (_, thunkApi) => {
    try { 
      const response = await api.get(`${API_USERS}`, {
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
export const fetchEmployeesList = createAsyncThunk(
  "employeeList/fetchEmployeesList",
  async (_, thunkApi) => {
    try { 
      const response = await api.get(`${API_EMPLOYEES}`, {
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
export const fetchDepartmentsList = createAsyncThunk(
  "departmentList/fetchDepartmentsList",
  async (_, thunkApi) => {
    try { 
      const response = await api.get(`${API_DEPARTMENTS}`, {
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
export const fetchBOQList = createAsyncThunk(
  "materialRequest/fetchBOQList",
  async (_, thunkApi) => {
    try { 
      const response = await api.get(`${API_BOQLIST}`, {
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
export const fetchMaterialRequest = createAsyncThunk(
  "materialRequest/fetchMaterialRequest",
  async ({ top = 20, skip = 0 }, thunkApi) => {
    try {
      
      const response = await api.get(`${API_MATERIALREQUEST}?top=${top}&skip=${skip}`, {
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


export const createMaterialRequest = createAsyncThunk(
  'materialRequest/createMaterialRequest',
  async (materialRequestData, thunkApi ) => {
    try {
      const response = await api.post(API_MATERIALREQUEST, materialRequestData, { withCredentials: true,timeout: 50000 });
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

export const updateMaterialRequest = createAsyncThunk(
  'materialRequest/updateMaterialRequest',
  async ({ id, data }, thunkApi) => { 
    try {
      console.log("🚀 Sending order to API:", data);
      const response = await api.patch(`${API_MATERIALREQUEST}/${id}`, data, {
        withCredentials: true,
        timeout: 60000,
      });
      return response.data;
    } catch (error) {
      console.error("❌ API error:", error.response?.data || error.message);
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
     
    }
  }
);

export const deleteMaterialRequest = createAsyncThunk('materialRequest/deleteMaterialRequest', async (id) => {
  await api.delete(`${API_MATERIALREQUEST}/${id}`, { withCredentials: true });
  return id;
});

export const fetchMaterialRequestById = createAsyncThunk(
  'materialRequest/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_MATERIALREQUEST}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      // return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching Sales materialRequest');
       console.log("error.response",error)
      return thunkApi.rejectWithValue({
        status: error.response?.status,
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

const materialRequestSlice = createSlice({
  name: 'materialRequest',
  initialState: {
    goodsIssue:[],
    materialRequest: [],
    userList: [],
    employeeList: [],
    departmentList: [],
    loading: false,
    error: null,
    currentQuotation: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        // Fetch Orders
        .addCase(fetchMaterialRequest.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchMaterialRequest.fulfilled, (state, action) => {
          state.loading = false;
          // If API returns { value: [...] }, handle that
          state.materialRequest = Array.isArray(action.payload)
            ? action.payload
            : action.payload?.value || [];
        })
        .addCase(fetchMaterialRequest.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
  //fetch users
    .addCase(fetchUsersList.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUsersList.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.userList = action.payload;
        })
        .addCase(fetchUsersList.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        })

         //fetch employees
    .addCase(fetchEmployeesList.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchEmployeesList.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.employeeList = action.payload;
        })
        .addCase(fetchEmployeesList.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        })

         //fetch departments
    .addCase(fetchDepartmentsList.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchDepartmentsList.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.departmentList = action.payload;
        })
        .addCase(fetchDepartmentsList.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error?.message;
        })
  //Create Goods Issue
  .addCase(createGoodsIssue.fulfilled, (state, action) => {
          if (Array.isArray(state.goodsIssue)) {
            state.goodsIssue.push(action.payload);
          } else {
            state.goodsIssue = [action.payload];
          }
        })

        // Create Order
        .addCase(createMaterialRequest.fulfilled, (state, action) => {
          if (Array.isArray(state.materialRequest)) {
            state.materialRequest.push(action.payload);
          } else {
            state.materialRequest = [action.payload];
          }
        })
  
        // Update Order
  
        .addCase(updateMaterialRequest.fulfilled, (state, action) => {
          if (Array.isArray(state.materialRequest)) {
            const index = state.materialRequest.findIndex(
              (o) => o.DocEntry === action.payload.DocEntry
            );
            if (index !== -1) state.materialRequest[index] = action.payload;
          }
        })
  
        // Delete Order
        .addCase(deleteMaterialRequest.fulfilled, (state, action) => {
          if (Array.isArray(state.materialRequest)) {
            state.materialRequest = state.materialRequest.filter(
              (o) => o.DocEntry !== action.payload
            );
          }
        });

    },
});

export default materialRequestSlice.reducer;