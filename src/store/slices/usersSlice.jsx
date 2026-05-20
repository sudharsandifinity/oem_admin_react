import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// API Base URL
const API_URL = '/admin/users';
const EMPL_API_URL = '/admin/users/sync';
const PROJECT_API_URL = '/admin/projects'
const SYNCPROJECT_API_URL = '/admin/projects/sync'

// Thunks for API calls
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await api.get(PROJECT_API_URL, {withCredentials: true});
  return response.data;
});

export const syncProjects = createAsyncThunk(
  "syncproject/syncProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        SYNCPROJECT_API_URL,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      console.log("SYNC PROJECT ERROR", err.response);

      return rejectWithValue(
        err.response?.data?.message || "Error syncing projects"
      );
    }
  }
);
export const createEmployee = createAsyncThunk('Employees/createEmployee', async (userData) => {
  const response = await api.post(EMPL_API_URL, userData, {withCredentials: true});
  return response.data;
});
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await api.get(API_URL, {withCredentials: true});
  return response.data;
});

export const fetchUserById = createAsyncThunk('users/fetchUsers', async (id) => {
  const response = await api.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData) => {
  const response = await api.post(API_URL, userData, {withCredentials: true});
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }) => {
  const response = await api.put(`${API_URL}/${id}`, data, {withCredentials: true});
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await api.delete(`${API_URL}/${id}`, {withCredentials: true});
  return id;
});


const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    Employees: [],
    projects:[],
  syncproject: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.Employees.push(action.payload);
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
       .addCase(syncProjects.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(syncProjects.fulfilled, (state, action) => {
  state.loading = false;

  // if response is array
  state.syncproject = action.payload;

  // OR if you want to append single item use:
  // state.syncproject.push(action.payload);
})

.addCase(syncProjects.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  }
});

export default usersSlice.reducer;