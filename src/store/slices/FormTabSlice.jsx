        import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
        import api from '../../api/axios';
        
        // API Base URL
        const API_URL = '/admin/form-tabs';
        
        // Thunks for API calls
        export const fetchFormTabs = createAsyncThunk('formtab/fetchFormTabs', async () => {
          const response = await api.get(API_URL, {withCredentials: true});
          return response.data;
        });
        
        export const fetchFormTabsById = createAsyncThunk('formtab/fetchFormTabs', async (id) => {
          const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
          return response.data;
        });
        
        export const createFormTabs = createAsyncThunk('formtab/createFormTabs', async (formData) => {
          const response = await api.post(API_URL, formData, {withCredentials: true});
          return response.data;
        });
        
        export const updateFormTabs = createAsyncThunk('formtab/updateFormTabs', async ({ id, data }) => {
          const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
          return response.data;
        });
        
        export const deleteFormTabs = createAsyncThunk('formtabs/deleteFormTabs', async (id) => {
          await api.delete(`${API_URL}/${id}`, {withCredentials: true});
          return id;
        });
        
        
        const formTabSlice = createSlice({
          name: 'formTab',
          initialState: {
            formTab: [],
            loading: false,
            error: null
          },
          reducers: {},
          extraReducers: (builder) => {
            builder
              .addCase(fetchFormTabs.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(fetchFormTabs.fulfilled, (state, action) => {
                state.loading = false;
                state.formTab = action.payload;
              })
              .addCase(fetchFormTabs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
              })
              .addCase(createFormTabs.fulfilled, (state, action) => {
                state.formTab.push(action.payload);
              })
              .addCase(updateFormTabs.fulfilled, (state, action) => {
                const index = state.formTab.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) state.formTab[index] = action.payload;
              })
              .addCase(deleteFormTabs.fulfilled, (state, action) => {
                state.formTab = state.formTab.filter((u) => u.id !== action.payload);
              });
          }
        });
        
        export default formTabSlice.reducer;