import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import authReducer from './slices/authSlice';
import roleReducer from './slices/roleSlice';
import permissionReducer from './slices/permissionSlice';
import companyReducer from './slices/companiesSlice';
import branchReducer from './slices/branchesSlice';
import formReducer from './slices/formmasterSlice';
import companyformReducer from './slices/CompanyFormSlice';
import formfieldReducer from './slices/FormFieldSlice';
import formsectionReducer from './slices/formsectionSlice'
import companyformfieldReducer from './slices/companyformfieldSlice'
import usermenusReducer from './slices/usermenusSlice';
import formfielddataReducer from './slices/companyformfielddata'
const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    companies: companyReducer, 
    branches: branchReducer,
    forms:formReducer,
    companyforms:companyformReducer,
    formField:formfieldReducer,
    formsection:formsectionReducer,
    companyformfield:companyformfieldReducer,
    usermenus:usermenusReducer,
    companyformfielddata:formfielddataReducer
  },
});

export default store;