import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../api/axios';

export const switchCompany = createAsyncThunk(
  "company/switchCompany",
  async ({ companyId }, thunkAPI) => {
    try {
      const res = await api.post("auth/sap-login", {
        company_id: companyId
      }, { withCredentials: true });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const companySlice = createSlice({
  name: "usercompany",
  initialState: {
    activeCompany: null,
    sapSession: null,
    loading: false,
    error: null
  },
  reducers: {
    setActiveCompany(state, action) {
      state.activeCompany = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(switchCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(switchCompany.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(switchCompany.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { setActiveCompany } = companySlice.actions;
export default companySlice.reducer;
