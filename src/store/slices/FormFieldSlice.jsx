import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/form-fields';

// Thunks for API calls
export const fetchFormFields = createAsyncThunk('formfield/fetchFormFields', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const fetchFormFieldsById = createAsyncThunk('formfield/fetchFormFields', async (id) => {
  const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
});

export const createFormFields = createAsyncThunk('formfield/createFormFields', async (formData) => {
  const response = await api.post(API_URL, formData, {withCredentials: true});
  return response.data;
});

export const updateFormFields = createAsyncThunk('formfield/updateFormFields', async ({ id, data }) => {
  const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
  return response.data;
});

export const deleteFormFields = createAsyncThunk('formfields/deleteFormFields', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});


const formFieldSlice = createSlice({
  name: 'formField',
  initialState: {
    formField: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFormFields.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormFields.fulfilled, (state, action) => {
        state.loading = false;
        state.formField = action.payload;
      })
      .addCase(fetchFormFields.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createFormFields.fulfilled, (state, action) => {
        state.formField.push(action.payload);
      })
      .addCase(updateFormFields.fulfilled, (state, action) => {
        const index = state.formField.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.formField[index] = action.payload;
      })
      .addCase(deleteFormFields.fulfilled, (state, action) => {
        state.formField = state.formField.filter((u) => u.id !== action.payload);
      });
  }
});

export default formFieldSlice.reducer;