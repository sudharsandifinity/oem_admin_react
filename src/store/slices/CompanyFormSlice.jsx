import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/assign-form';

// Thunks for API calls
export const fetchCompanyForms = createAsyncThunk('companyforms/fetchCompanyForms', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const fetchCompanyFormsById = createAsyncThunk('companyforms/fetchCompanyForms', async (id) => {
  const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
});

export const createCompanyForms = createAsyncThunk('companyforms/createCompanyForms', async (formData) => {
  const response = await api.post(API_URL, formData, {withCredentials: true});
  return response.data;
});

export const updateCompanyForms = createAsyncThunk('companyforms/updateCompanyForms', async ({ id, data }) => {
  const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
  return response.data;
});

export const deleteCompanyForms = createAsyncThunk('companyforms/deleteCompanyForms', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});


const companyFormsSlice = createSlice({
  name: 'companyforms',
  initialState: {
    companyforms: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyForms.fulfilled, (state, action) => {
        state.loading = false;
        state.companyforms = action.payload;
      })
      .addCase(fetchCompanyForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCompanyForms.fulfilled, (state, action) => {
        state.companyforms.push(action.payload);
      })
      .addCase(updateCompanyForms.fulfilled, (state, action) => {
        const index = state.companyforms.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.companyforms[index] = action.payload;
      })
      .addCase(deleteCompanyForms.fulfilled, (state, action) => {
        state.companyforms = state.companyforms.filter((u) => u.id !== action.payload);
      });
  }
});

export default companyFormsSlice.reducer;