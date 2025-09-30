import { useEffect } from "react";
import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  FlexBox,
  Icon,
  Title
} from "@ui5/webcomponents-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "@ui5/webcomponents/dist/SegmentedButtonItemTemplate.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/master-task-triangle.js";
import "@ui5/webcomponents-icons/dist/increase-line-height.js";
import "@ui5/webcomponents-icons/dist/bbyd-dashboard.js";
import "@ui5/webcomponents-icons/dist/user-edit.js";
import "@ui5/webcomponents-icons/dist/end-user-experience-monitoring.js";
import "@ui5/webcomponents-icons/dist/kpi-corporate-performance.js";
import "@ui5/webcomponents-icons/dist/kpi-managing-my-area.js";

import "@ui5/webcomponents-icons/dist/background.js";
import "@ui5/webcomponents-icons/dist/doc-attachment.js";
import "@ui5/webcomponents-icons/dist/order-status.js";
import "@ui5/webcomponents-icons/dist/customer-order-entry.js";
import "@ui5/webcomponents-icons/dist/product.js";
import "@ui5/webcomponents-icons/dist/project-definition-triangle-2.js";
import "@ui5/webcomponents-icons/dist/create-form.js";
import "@ui5/webcomponents-icons/dist/form.js";
import "@ui5/webcomponents-icons/dist/download-from-cloud.js";
import "@ui5/webcomponents-icons/dist/company-view.js";
import "@ui5/webcomponents-icons/dist/menu.js";
import "@ui5/webcomponents-icons/dist/menu2.js";
import "@ui5/webcomponents-icons/dist/role.js";
import DashboardPage from "../../Views/Admin/Dashboard/Default/Dashboard";
import { useSelector } from "react-redux";
import AppBar from "../../Components/Module/Appbar";

const AdminSideNav = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [collapsed, setCollapsed] = React.useState(false);
  const {user} = useSelector((state) => state.auth);
  const handleNavigationChange = (event) => {
    const key = event.detail.item.dataset.key;
    key&&navigate(`/admin/${key}`);
  };

useEffect(() => {
  console.log("user",typeof(user));
  if(user==="null"||user===null){
    navigate("/login");
  }
}, [user])


  return (
    <FlexBox style={{ height: "90vh" }}>
        <FlexBox direction="Column" style={{ width:collapsed ? "50px" : "250px" }}>
     <AppBar
  title="Admin"
  design="Header"
  startContent={
    <Icon name="menu2" onClick={() => setCollapsed(!collapsed)} />
  }
> {collapsed ? <></> : <Title level="h2">Admin</Title>}</AppBar>
          <SideNavigation
            onSelectionChange={handleNavigationChange}
            collapsed={collapsed}
          >
            <SideNavigationItem
              text="Dashboard"
              style={{ textAlign: "start" }}
              selected="true"
              icon="bbyd-dashboard"
              data-key="dashboard"
            />
            <SideNavigationItem
              text="Masters"
              style={{ textAlign: "start" }}
              icon="master-task-triangle"
              unselectable
              expanded
              //data-key="dashboard"
            >
     
              {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "companies")) && (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Companies"
                icon="kpi-corporate-performance"
                data-key="companies"
              />
            )}
            {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "branches") )&& (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Branches"
                icon="background"
                data-key="branches"
              />)}
               {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "forms") )&& (
               <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Form Master"
                icon="create-form"
                data-key="FormMaster"
              />)}
              {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "user_menu")) && (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Menu Master"
                icon="menu2"
                data-key="MenuMaster"
              />)}
              {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "roles") )&& (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Roles"
                icon="end-user-experience-monitoring"
                data-key="roles"
              />)}
              {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "users")) && (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Users"
                icon="user-edit"
                data-key="users"
              />)}
             
               
            </SideNavigationItem>
           <SideNavigationItem
              style={{ textAlign: "start" }}
              text="Menu"
              icon="menu"
              data-key="menu"
              unselectable
              expanded
            >
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Assign Form"
                icon="role"
                data-key="AssignFormToMenu"
              /> 
            </SideNavigationItem> 
            <SideNavigationItem
              style={{ textAlign: "start" }}
              text="Form Management"
              icon="form"
              unselectable
              expanded
            >
             
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Assign Form"
                icon="company-view"
                data-key="company-forms"
              />
              {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "form_fields")) && (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Form Field Master"
                icon="download-from-cloud"
                data-key="FormFields"
              />)}
              {user!==null&&user.Roles&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.module === "CompanyFormFields")) && (
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Company Form Fields"
                icon="create-form"
                data-key="CompanyFormFields"
              />)}
            </SideNavigationItem>
          </SideNavigation>
        </FlexBox>
      {/* Render routed content */}
      <FlexBox style={{ flex: 1, height: "100%" }}>
        <Outlet />
        {location.pathname === "/admin" && <DashboardPage />}
      </FlexBox>
    </FlexBox>
  );
};

export default AdminSideNav;
