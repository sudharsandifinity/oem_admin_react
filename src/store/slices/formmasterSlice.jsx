import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/forms';

const GLOBAL_FORMS_API = '/admin/forms/global-forms';

export const fetchGlobalForms = createAsyncThunk(
  'forms/fetchGlobalForms',
  async () => {
    const response = await api.get(GLOBAL_FORMS_API, { withCredentials: true });
    return response.data;
  }
);

// Thunks for API calls
export const fetchForm = createAsyncThunk('forms/fetchForms', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});



export const fetchFormById = createAsyncThunk('forms/fetchForms', async (id) => {
  const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
});

export const createForm = createAsyncThunk('forms/createForms', async (formData) => {
  const response = await api.post(API_URL, formData, {withCredentials: true});
  return response.data;
});

export const updateForm = createAsyncThunk('forms/updateForms', async ({ id, data }) => {
  const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
  return response.data;
});

export const deleteForm = createAsyncThunk('forms/deleteForms', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});


const formsSlice = createSlice({
  name: 'forms',
  initialState: {
    forms: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
       .addCase(fetchGlobalForms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGlobalForms.fulfilled, (state, action) => {
        state.loading = false;
        state.globalForms = action.payload;
      })
      .addCase(fetchGlobalForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
      })
      .addCase(fetchForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.forms.push(action.payload);
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        const index = state.forms.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.forms[index] = action.payload;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.forms = state.forms.filter((u) => u.id !== action.payload);
      });
  }
});

export default formsSlice.reducer;