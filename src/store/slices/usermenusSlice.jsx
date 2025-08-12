import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/user-menus';

// Thunks for API calls
export const fetchUserMenus = createAsyncThunk('usermenus/fetchUserMenus', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const createUserMenus = createAsyncThunk('usermenus/createUserMenus', async (userData, { rejectWithValue }) => {
    try{
        const response = await api.post(API_URL, userData, {withCredentials: true});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data);
    }
});

export const updateUserMenus = createAsyncThunk('usermenus/updateUserMenus', async ({ id, data }, { rejectWithValue }) => {
    try{
        const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data);
    }
});

export const deleteUserMenus = createAsyncThunk('usermenus/deleteUserMenus', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});

export const fetchUserMenusById = createAsyncThunk('usermenus/fetchById', async (id, thunkAPI) => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
    return response.data;
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching role');
  }
});


const usermenusSlice = createSlice({
  name: 'usermenu',
  initialState: {
    usermenus: [],
    loading: false,
    error: null,
    currentUserMenus: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.usermenus = action.payload;
      })
      .addCase(fetchUserMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUserMenus.fulfilled, (state, action) => {
        state.usermenus.push(action.payload);
      })
      .addCase(updateUserMenus.fulfilled, (state, action) => {
        const index = state.usermenus.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.usermenus[index] = action.payload;
      })
      .addCase(deleteUserMenus.fulfilled, (state, action) => {
        state.usermenus = state.usermenus.filter((u) => u.id !== action.payload);
      })
     .addCase(fetchUserMenusById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUserMenus = null;
        })
        .addCase(fetchUserMenusById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserMenus = action.payload;
        })
        .addCase(fetchUserMenusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        });
  }
});

export default usermenusSlice.reducer;