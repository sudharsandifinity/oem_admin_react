import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

const API_URL = '/admin/form-sections';

export const fetchFormSection = createAsyncThunk('formsection/fetchFormSection', async(_, { rejectWithValue }) => {
    try{
        const response = await api.get(API_URL, {withCredentials: true});
        return response.data;
    }catch(err){
        return rejectWithValue(err.response?.data);
    }
})

const permissionSlice = createSlice({
    name: 'formsection',
    initialState: {
        formsection: [],
        authFormSection: localStorage.getItem('Authformsection') || [],
        hydrated: false,
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchFormSection.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchFormSection.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.formsection = action.payload;
        })
        .addCase(fetchFormSection.rejected, (state, action) => {
            state.error = action.error.message;
            state.loading = false;
            state.formsection = [];
        })
    }
});

export default permissionSlice.reducer;