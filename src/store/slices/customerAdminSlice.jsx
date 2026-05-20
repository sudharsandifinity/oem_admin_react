import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cusadminapi } from "../../api/axios";

// API Base URL
const USER_API_URL = "/users";
const MENU_API_URL = "/menus";
const COMPANY_API_URL = "/companies";
const CREATE_EMPLOYEE_URL = "/employees/sync";
const ROLE_API_URL = "/roles";

// ====================== THUNKS ======================

// Fetch Customer Menus
export const fetchCustomerMenus = createAsyncThunk(
  "customerAdmin/fetchCustomerMenus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.get(MENU_API_URL, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching menus");
    }
  },
);

// Fetch Users
export const fetchCustomerAdminUserList = createAsyncThunk(
  "customerAdmin/fetchCustomerAdminUserList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.get(USER_API_URL, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching users");
    }
  },
);
export const fetchCustomerAdminUserByID = createAsyncThunk(
  "customerAdmin/fetchCustomerAdminUserByID",
  async (id, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.get(`${USER_API_URL}/${id}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching role");
    }
  },
);
export const updateCustomeradminUser =createAsyncThunk(
  "customerAdmin/updateCustomeradminUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.put(`${USER_API_URL}/${id}`, data, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating user");
    }
  },
);
// Fetch Companies
export const fetchCustomerAdminCompanyList = createAsyncThunk(
  "customerAdmin/fetchCustomerAdminCompanyList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.get(COMPANY_API_URL, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching companies",
      );
    }
  },
);

// Fetch Roles
export const fetchCustomerAdminRoleList = createAsyncThunk(
  "customerAdmin/fetchCustomerAdminRoleList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.get(ROLE_API_URL, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching roles");
    }
  },
);

// Create Sync Employees
export const createSyncEmployees = createAsyncThunk(
  "customerAdmin/createSyncEmployees",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.post(CREATE_EMPLOYEE_URL, userData, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error syncing employees");
    }
  },
);

// Create Role
export const createCustomerAdminRole = createAsyncThunk(
  "customerAdmin/createCustomerAdminRole",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.post(ROLE_API_URL, userData, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating role");
    }
  },
);

// Update Role
export const updateCustomerAdminRole = createAsyncThunk(
  "customerAdmin/updateCustomerAdminRole",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.put(`${ROLE_API_URL}/${id}`, data, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating role");
    }
  },
);

// Delete Role
export const deleteCustomerAdminRole = createAsyncThunk(
  "customerAdmin/deleteCustomerAdminRole",
  async (id, { rejectWithValue }) => {
    try {
      await cusadminapi.delete(`${ROLE_API_URL}/${id}`, {
        withCredentials: true,
      });

      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting role");
    }
  },
);

// Fetch Role By Id
export const fetchCustomerAdminRoleById = createAsyncThunk(
  "customerAdmin/fetchCustomerAdminRoleById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await cusadminapi.get(`${ROLE_API_URL}/${id}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching role");
    }
  },
);

// ====================== SLICE ======================

const initialState = {
  customermenus: [],
  userList: [],
  companyList: [],
  roleList: [],
  syncemployee: [],
  currentCustomerAdminRole: null,
  loading: false,
  error: null,
};

const customerAdminSlice = createSlice({
  name: "customerAdmin",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= MENUS =================

      .addCase(fetchCustomerMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.customermenus = action.payload;
      })
      .addCase(fetchCustomerMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= USERS =================

      .addCase(fetchCustomerAdminUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAdminUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchCustomerAdminUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCustomerAdminUserByID.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCustomerAdminRole = null;
      })
      .addCase(fetchCustomerAdminUserByID.fulfilled, (state, action) => {
        state.loading = false;
        state.userList = action.payload;
      })
      .addCase(fetchCustomerAdminUserByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ================= COMPANIES =================

      .addCase(fetchCustomerAdminCompanyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAdminCompanyList.fulfilled, (state, action) => {
        state.loading = false;
        state.companyList = action.payload;
      })
      .addCase(fetchCustomerAdminCompanyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= ROLES =================

      .addCase(fetchCustomerAdminRoleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAdminRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.roleList = action.payload;
      })
      .addCase(fetchCustomerAdminRoleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE ROLE =================

      .addCase(createCustomerAdminRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomerAdminRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roleList.push(action.payload);
      })
      .addCase(createCustomerAdminRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE ROLE =================

      .addCase(updateCustomerAdminRole.fulfilled, (state, action) => {
        const index = state.roleList.findIndex(
          (role) => role.id === action.payload.id,
        );

        if (index !== -1) {
          state.roleList[index] = action.payload;
        }
      })

      // ================= DELETE ROLE =================

      .addCase(deleteCustomerAdminRole.fulfilled, (state, action) => {
        state.roleList = state.roleList.filter(
          (role) => role.id !== action.payload,
        );
      })

      // ================= FETCH ROLE BY ID =================

      .addCase(fetchCustomerAdminRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentCustomerAdminRole = null;
      })
      .addCase(fetchCustomerAdminRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomerAdminRole = action.payload;
      })
      .addCase(fetchCustomerAdminRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= SYNC EMPLOYEE =================

      .addCase(createSyncEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSyncEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.syncemployee.push(action.payload);
      })
      .addCase(createSyncEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerAdminSlice.reducer;
