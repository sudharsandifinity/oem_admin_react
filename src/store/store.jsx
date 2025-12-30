import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import authReducer from './slices/authSlice';
import userCompanyReducer from './slices/userCompanySlice';
import roleReducer from './slices/roleSlice';
import permissionReducer from './slices/permissionSlice';
import companyReducer from './slices/companiesSlice';
import branchReducer from './slices/branchesSlice';
import formReducer from './slices/formmasterSlice';
import companyformReducer from './slices/CompanyFormSlice';
import formfieldReducer from './slices/FormFieldSlice';
import formTabReducer from './slices/FormTabSlice'; 
import formsectionReducer from './slices/formsectionSlice'
import companyformfieldReducer from './slices/companyformfieldSlice'
import usermenusReducer from './slices/usermenusSlice';
import formfielddataReducer from './slices/companyformfielddata'
import customerorderReducer from './slices/CustomerOrderSlice';
import customerorderitemsReducer from './slices/CustomerOrderItemsSlice';
import purchaseorderReducer from './slices/PurchaseOrderSlice';
import vendororderitemsReducer from './slices/VendorOrderItemsSlice';
import customerorderserviceReducer from './slices/CustomerOrderServiceSlice';
import salesadddetailsReducer from './slices/salesAdditionalDetailsSlice';
import salesquotationReducer from './slices/SalesQuotationSlice';
import purQuotationReducer from './slices/PurchaseQuotation';
import purRequestReducer from './slices/PurchaseRequestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    usercompany: userCompanyReducer,
    users: usersReducer,
    roles: roleReducer,
    permissions: permissionReducer,
    companies: companyReducer, 
    branches: branchReducer,
    forms:formReducer,
    companyforms:companyformReducer,
    formField:formfieldReducer,
    formTabs:formTabReducer,
    formsection:formsectionReducer,
    companyformfield:companyformfieldReducer,
    usermenus:usermenusReducer,
    companyformfielddata:formfielddataReducer,
    customerorder:customerorderReducer,
    orderItems:customerorderitemsReducer,
    orderServices:customerorderserviceReducer,
    purchaseorder:purchaseorderReducer,
    vendororderItems:vendororderitemsReducer,
    salesadddetails:salesadddetailsReducer,
    salesquotation:salesquotationReducer,
    puradddetails:salesadddetailsReducer,
    purQuotation:purQuotationReducer,
    purRequest:purRequestReducer,
  },
});

export default store;