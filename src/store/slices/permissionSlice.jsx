import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = '/admin/permissions';

export const fetchPermissions = createAsyncThunk('permissions/fetchPermissions', async(_, { rejectWithValue }) => {
    try{
        const response = await api.get(API_URL, {withCredentials: true});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data);
    }
})

const permissionSlice = createSlice({
    name: 'permissions',
    initialState: {
        permissions: [],
        authPermissions: localStorage.getItem('Authpermissions') || [],
        hydrated: false,
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPermissions.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchPermissions.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.permissions = action.payload;
        })
        .addCase(fetchPermissions.rejected, (state, action) => {
            state.error = action.error.message;
            state.loading = false;
            state.permissions = [];
        })
    }
});

export default permissionSlice.reducer;