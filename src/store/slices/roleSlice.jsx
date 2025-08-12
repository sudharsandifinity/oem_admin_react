import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/roles';

// Thunks for API calls
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const createRole = createAsyncThunk('roles/createRole', async (userData, { rejectWithValue }) => {
    try{
        const response = await api.post(API_URL, userData, {withCredentials: true});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data);
    }
});

export const updateRole = createAsyncThunk('roles/updateRole', async ({ id, data }, { rejectWithValue }) => {
    try{
        const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data);
    }
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});

export const fetchRoleById = createAsyncThunk('roles/fetchById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
    return response.data;
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching role');
  }
});


const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    loading: false,
    error: null,
    currentRole: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.roles[index] = action.payload;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((u) => u.id !== action.payload);
      })
     .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentRole = null;
        })
        .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
        })
        .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        });
  }
});

export default roleSlice.reducer;