import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/company-form-data';

// Thunks for API calls
export const fetchcompanyformfielddata = createAsyncThunk('companyformfielddata/fetchCompanyFormfieldData', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const fetchCompanyFormfieldDataById = createAsyncThunk('companyformfielddata/fetchCompanyFormfieldData', async (id) => {
  const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
});

export const createCompanyFormfieldData = createAsyncThunk('companyformfielddata/createCompanyFormfieldData', async (formData) => {
  const response = await api.post(API_URL, formData, {withCredentials: true});
  return response.data;
});

export const updateCompanyFormsField = createAsyncThunk('companyformfielddata/updateCompanyFormsField', async ({ id, data }) => {
  console.log("object", id, data);
  const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
  return response.data;
});

export const deleteCompanyFormfieldData = createAsyncThunk('companyformfielddata/deleteCompanyFormfieldData', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});


const companyformfielddataSlice = createSlice({
  name: 'companyformfielddata',
  initialState: {
    companyformfielddata: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcompanyformfielddata.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcompanyformfielddata.fulfilled, (state, action) => {
        state.loading = false;
        state.companyformfielddata = action.payload;
      })
      .addCase(fetchcompanyformfielddata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCompanyFormfieldData.fulfilled, (state, action) => {
        state.companyformfielddata.push(action.payload);
      })
      .addCase(updateCompanyFormsField.fulfilled, (state, action) => {
        console.log("updatecompanyformfielddataSlice", action.payload,action);
        const index = state.companyformfielddata.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.companyformfielddata[index] = action.payload;
      })
      .addCase(deleteCompanyFormfieldData.fulfilled, (state, action) => {
        state.companyformfielddata = state.companyformfielddata.filter((u) => u.id !== action.payload);
      });
  }
});

export default companyformfielddataSlice.reducer;