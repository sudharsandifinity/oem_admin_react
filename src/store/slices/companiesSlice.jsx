import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const API_URL = '/admin/companies';

export const fetchCompanies = createAsyncThunk('companies/fetchCompanies', async () => {
  const response = await api.get(API_URL, { withCredentials: true });
  return response.data;
});

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      const response = await api.post(API_URL, companyData, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, data, { withCredentials: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (id) => {
  await api.delete(`${API_URL}/${id}`, { withCredentials: true });
  return id;
});

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`${API_URL}/${id}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching company');
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState: {
    companies: [],
    loading: false,
    error: null,
    currentCompany: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })

      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })

      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((c) => c.id !== action.payload);
      })

      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCompany = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCompany = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default companiesSlice.reducer;