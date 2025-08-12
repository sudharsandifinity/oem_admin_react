// Admin.js
import React, { useRef } from "react";
import {
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  FlexBox,
  Button,
  Icon,
  Menu,
  MenuItem,
  MenuSeparator,
  Title,
  Bar,
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

import Dashboard from "./Dashboard/Default/Dashboard";
import DashboardPage from "./Dashboard/Default/DashboardPage";

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(true);
  const handleNavigationChange = (event) => {
    const key = event.detail.item.dataset.key;
    navigate(`/admin/${key}`);
  };

 

  return (
    <FlexBox style={{ height: "90vh" }}>
      <FlexBox style={{ height: "100%" }}>
        <FlexBox direction="Column" style={{ width:collapsed ? "50px" : "240px", height: "100%" }}>
          <Bar
            design="Header"
            startContent={
              <Icon
                name="menu2"
                onClick={() => setCollapsed(!collapsed)}
              ></Icon>
            }
          >
            {collapsed ? <></> : <Title level="h2">Admin</Title>}
          </Bar>
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
              data-key="dashboard"
            >
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Companies"
                icon="kpi-corporate-performance"
                data-key="companies"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Branches"
                icon="background"
                data-key="branches"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Roles"
                icon="end-user-experience-monitoring"
                data-key="roles"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Users"
                icon="user-edit"
                data-key="users"
              />
            </SideNavigationItem>
            <SideNavigationItem
              style={{ textAlign: "start" }}
              text="Menu"
              icon="menu"
              data-key="menu"
            >
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Menu Master"
                icon="menu2"
                data-key="MenuMaster"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="User Role Menus"
                icon="role"
                data-key="UserRoleMenus"
              />
            </SideNavigationItem>
            <SideNavigationItem
              style={{ textAlign: "start" }}
              text="Setup"
              icon="doc-attachment"
              data-key="dashboard"
            >
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Sales Orders"
                icon="order-status"
                data-key="sales-orders"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Sales Invoices"
                icon="customer-order-entry"
                data-key="sales-invoices"
              />
            </SideNavigationItem>
            <SideNavigationItem
              style={{ textAlign: "start" }}
              text="Form Management"
              icon="form"
              data-key="dashboard"
            >
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Form Master"
                icon="create-form"
                data-key="FormMaster"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Assign Form To Company"
                icon="company-view"
                data-key="company-forms"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Form Field Master"
                icon="download-from-cloud"
                data-key="FormFields"
              />
              <SideNavigationSubItem
                style={{ marginLeft: "1rem", textAlign: "start" }}
                text="Company Form Fields"
                icon="create-form"
                data-key="CompanyFormFields"
              />
            </SideNavigationItem>
          </SideNavigation>
        </FlexBox>
      </FlexBox>
      {/* Render routed content */}
      <flexibleColumnLayout
        style={{ flex: 1, height: "100%" }}
        layout="TwoColumnsMidExpanded"
        onLayoutChange={(e) => {
          console.log("Layout changed:", e);
        }}
      >
        <Outlet />
        {location.pathname === "/admin" && <DashboardPage />}
      </flexibleColumnLayout>
    </FlexBox>
  );
};

export default Admin;
