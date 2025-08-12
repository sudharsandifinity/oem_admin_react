import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/company-form-fields';

// Thunks for API calls
export const fetchCompanyFormfields = createAsyncThunk('companyformfield/fetchCompanyFormsFields', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const fetchCompanyFormsFieldsById = createAsyncThunk('companyformfield/fetchCompanyFormsFields', async (id) => {
  const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
});

export const createCompanyFormsFields = createAsyncThunk('companyformfield/createCompanyFormsFields', async (formData) => {
  const response = await api.post(API_URL, formData, {withCredentials: true});
  return response.data;
});

export const updateCompanyFormsField = createAsyncThunk('companyformfield/updateCompanyFormsField', async ({ id, data }) => {
  console.log("object", id, data);
  const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
  return response.data;
});

export const deleteCompanyFormsFields = createAsyncThunk('companyformfield/deleteCompanyFormsFields', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});


const companyformfieldSlice = createSlice({
  name: 'companyformfield',
  initialState: {
    companyformfield: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyFormfields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyFormfields.fulfilled, (state, action) => {
        state.loading = false;
        state.companyformfield = action.payload;
      })
      .addCase(fetchCompanyFormfields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCompanyFormsFields.fulfilled, (state, action) => {
        state.companyformfield.push(action.payload);
      })
      .addCase(updateCompanyFormsField.fulfilled, (state, action) => {
        console.log("updatecompanyformfieldSlice", action.payload,action);
        const index = state.companyformfield.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.companyformfield[index] = action.payload;
      })
      .addCase(deleteCompanyFormsFields.fulfilled, (state, action) => {
        state.companyformfield = state.companyformfield.filter((u) => u.id !== action.payload);
      });
  }
});

export default companyformfieldSlice.reducer;