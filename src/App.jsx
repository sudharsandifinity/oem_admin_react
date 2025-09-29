
//import "./App.css";
import {
  Button,
  Popover,
  Select,
  Option,
  ThemeProvider,
} from "@ui5/webcomponents-react";
import Header from "./Components/Header/Header";
// import {
//   getTheme,
//   setTheme,
//   getDefaultTheme,
// } from "@ui5/webcomponents-base/dist/config/Theme";
import { ThemingParameters } from "@ui5/webcomponents-react-base";
import SalesOrder from "./Views/SalesOrder/SalesOrder";
import FormConfigProvider from "./Components/Context/FormConfigContext";
import { BrowserRouter as Router, Routes, Route,useLocation  } from "react-router-dom";
import ManageSalesOrder from "./Views/ManageSalesOrder/ManageSalesOrder";
// Example: Import CSS for sap_horizon_dark and others you want to support
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import Admin from "./Views/Admin/Admin";
import { Provider } from "react-redux";
import store from "./store/store";
import CreateUser from "./Views/Admin/Masters/Users/CreateUser";
import Dashboard from "./Views/Admin/Dashboard/Default/Dashboard";
import Users from "./Views/Admin/Masters/Users/Users";
import Companies from "./Views/Admin/Masters/Companies/Companies";
import Branches from "./Views/Admin/Masters/Branches/Branches";
import SalesOrders from "./Views/Admin/Sales/SalesOrder/SalesOrder";
import SalesInvoices from "./Views/Admin/Sales/SalesInvoices/SalesInvoices";
import PurchaseOrders from "./Views/Admin/Purchase/PurchaseOrders/PurchaseOrders";
import PurchaseInvoice from "./Views/Admin/Purchase/PurchaseInvoices/PurchaseInvoices";
import EditUser from "./Views/Admin/Masters/Users/EditUser";
import RolesList from "./Views/Admin/Masters/Roles/RolesList";
import FormFields from "./Views/Admin/FormManagement/FormFieldMaster/FormFields";
import FormMaster from "./Views/Admin/FormManagement/FormMaster/FormMaster";
import CreateForm from "./Views/Admin/FormManagement/FormMaster/CreateForm";
import CreateFormField from "./Views/Admin/FormManagement/FormFieldMaster/CreateFormField";
import CreateRole from "./Views/Admin/Masters/Roles/CreateRole";
import UserDashboard from "./Views/Dashboard/UserDashboard";
import PublicRoute from "./PublicRoute";
import AuthLogin from "./Views/pages/auth-forms/AuthLogin";
import ForgotPassword from "./Views/pages/authentication/ForgotPassword";
import CreateCompany from "./Views/Admin/Masters/Companies/CreateCompany";
import CreateBranch from "./Views/Admin/Masters/Branches/CreateBranch";
import Menu from "./Views/Admin/Menu/Menu";
import MenuMaster from "./Views/Admin/Menu/MenuMaster/MenuMaster";
import CreateMenu from "./Views/Admin/Menu/MenuMaster/CreateMenu";
import EditFormMaster from "./Views/Admin/FormManagement/FormMaster/EditFormMaster";
import EditCompanyForm from "./Views/Admin/FormManagement/CompanyFormMaster/EditCompanyForm";
import CreateCompanyForm from "./Views/Admin/FormManagement/CompanyFormMaster/CreateCompanyForm";
import CompanyMaster from "./Views/Admin/FormManagement/CompanyFormMaster/CompanyMaster";
import EditFormField from "./Views/Admin/FormManagement/FormFieldMaster/EditFormField";
import EditCompany from "./Views/Admin/Masters/Companies/EditCompany";
import EditBranches from "./Views/Admin/Masters/Branches/EditBranches";
import EditRole from "./Views/Admin/Masters/Roles/EditRole";
import CompanyFormFieldMaster from "./Views/Admin/FormManagement/CompanyFormFieldMaster/CompanyFormFieldMaster";
import CreateCompanyFormField from "./Views/Admin/FormManagement/CompanyFormFieldMaster/CreateCompanyFormField";
import AddFormField from "./Views/Admin/FormManagement/CompanyFormFieldMaster/AddFormField";
import FilterCompanyFormField from "./Views/Admin/FormManagement/CompanyFormFieldMaster/EditCompanyFormField";
import EditUserMenu from "./Views/Admin/Menu/MenuMaster/EditUserMenu";
import UserRoleMenuMaster from "./Views/Admin/Menu/UserRoleMenus/UserRoleMenuMaster";
import CreateUserRoleMenu from "./Views/Admin/Menu/UserRoleMenus/CreateUserRoleMenu";
import { useEffect, useState } from "react";
import CompanyRoleList from "./Views/Admin/Masters/CompanyRole/CompanyRoleList";
import CreateCompanyROle from "./Views/Admin/Masters/CompanyRole/CreateCompanyROle";
import CreateCompanyRole from "./Views/Admin/Masters/CompanyRole/CreateCompanyROle";
import EditCompanyRole from "./Views/Admin/Masters/CompanyRole/EditCompanyRole";
import EditUserChildMenu from "./Views/Admin/Menu/MenuMaster/EditUserChildMenu";
import AssignFormMenuMaster from "./Views/Admin/Menu/AssignFormToMenu/AssignFormMenuMaster";
import CreateAssignFormMenu from "./Views/Admin/Menu/AssignFormToMenu/CreateAssignFormMenu";
import EditSalesOrder from "./Views/SalesOrder/editSalesOrder";
//import { useEffect, useState } from "react";

// const AuthLogin = Loadable(lazy(() => import('Views/pages/auth-forms/AuthLogin')));

function App() {
  const [fioriTheme, setFioriTheme] = useState("sap_fiori_3");
   useEffect(() => {
    setFioriTheme(fioriTheme);
    document.body.style.setProperty(
      "background-color",
      ThemingParameters.sapBackgroundColor
    );
  }, [fioriTheme]);
   const location = useLocation();
  const hideHeaderRoutes = ["/", "/Login","/login", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
 
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="App">
          {!shouldHideHeader && <Header />}
          <main >
            <div >
              <FormConfigProvider>
                <Routes>
                  
                  <Route
                    path="/"
                    element={
                      <PublicRoute>
                        <AuthLogin />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/Login"
                    element={
                      <PublicRoute>
                        <AuthLogin />
                      </PublicRoute>
                    }
                  />
                  <Route path="/forgot-password" element={ <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>} />
                  {/* <Route path="/register" element={<Register />} /> */}

                  <Route path="/UserDashboard" element={<UserDashboard />} />

                  <Route path="/SalesOrder/create/:formId" element={<SalesOrder />} />
                  <Route path="/SalesOrder/edit/:formId/:id" element={<EditSalesOrder />} />
                  <Route
                    path="/ManageSalesOrder"
                    element={<ManageSalesOrder />}
                  />
                     <Route path="/form/:formId" element={<ManageSalesOrder />} />
            {/* <Route path="/form/:formId/:childId" element={<ManageSalesOrder />} /> */}
                  <Route path="/Admin" element={<Admin />} />
                  <Route path="/admin" element={<Admin />}>
                    <Route path="dashboard" element={<Dashboard />} />

                    <Route path="users" element={<Users />} />
                    <Route path="users/create" element={<CreateUser />} />
                    <Route path="users/edit/:id" element={<EditUser />} />

                    <Route path="roles" element={<RolesList />} />
                    <Route path="roles/create" element={<CreateRole />} />
                    <Route path="roles/edit/:id" element={<EditRole />} />

                    <Route path="CompanyRole" element={<CompanyRoleList/>}/>
                    <Route path="CompanyRole/create" element={<CreateCompanyRole/>}/>
                     <Route path="CompanyRole/edit/:id" element={<EditCompanyRole />} />

                    <Route path="companies" element={<Companies />} />
                    <Route
                      path="companies/create"
                      element={<CreateCompany />}
                    />
                    <Route
                      path="companies/edit/:id"
                      element={<EditCompany />}
                    />

                    <Route path="branches" element={<Branches />} />
                    <Route path="branches/create" element={<CreateBranch />} />
                    <Route
                      path="branches/edit/:id"
                      element={<EditBranches />}
                    />

                    <Route path="menu" element={<Menu />} />
                    <Route path="MenuMaster" element={<MenuMaster />} />
                    <Route path="AssignFormToMenu" element={<AssignFormMenuMaster />} />
                    <Route path="AssignFormToMenu/create" element={<CreateAssignFormMenu />} />

                    <Route path="UserRoleMenus" element={<UserRoleMenuMaster />} />
                    <Route
                      path="UserRoleMenus/create"
                      element={<CreateUserRoleMenu />}
                    />

                    <Route path="MenuMaster/create" element={<CreateMenu />} />
                    <Route
                      path="MenuMaster/edit/:id"
                      element={<EditUserMenu />}
                    />

                     <Route
                      path="MenuMasterChild/:edit/:id"
                      element={<EditUserChildMenu />}
                    /> <Route
                      path="MenuMasterChild/:view/:id"
                      element={<EditUserChildMenu />}
                    />

                    <Route path="sales-orders" element={<SalesOrders />} />
                    <Route path="sales-invoices" element={<SalesInvoices />} />

                    <Route
                      path="purchase-orders"
                      element={<PurchaseOrders />}
                    />
                    <Route path="FormMaster" element={<FormMaster />} />
                    <Route path="FormMaster/create" element={<CreateForm />} />
                    <Route
                      path="FormMaster/edit/:id"
                      element={<EditFormMaster />}
                    />

                    <Route path="company-forms" element={<CompanyMaster />} />
                    <Route
                      path="company-forms/create"
                      element={<CreateCompanyForm />}
                    />
                    <Route
                      path="company-forms/edit/:id"
                      element={<EditCompanyForm />}
                    />

                    <Route path="FormFields" element={<FormFields />} />
                    <Route
                      path="FormFields/create"
                      element={<CreateFormField />}
                    />
                    <Route
                      path="FormFields/edit/:id"
                      element={<EditFormField />}
                    />

                    <Route
                      path="CompanyFormFields"
                      element={<CompanyFormFieldMaster />}
                    />
                    <Route
                      path="CompanyFormFields/create"
                      element={<CreateCompanyFormField />}
                    />
                    <Route
                      path="CompanyFormFields/filter/:id"
                      element={<FilterCompanyFormField />}
                    />
                    <Route
                      path="CompanyFormFields/create/addFormField"
                      element={<AddFormField />}
                    />

                    {/* Add other nested routes similarly */}
                  </Route>
                </Routes>
              </FormConfigProvider>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
