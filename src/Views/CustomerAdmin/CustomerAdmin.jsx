// Admin.js
import React, { useEffect, useRef } from "react";
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

import "@ui5/webcomponents-icons/dist/end-user-experience-monitoring.js";



import "@ui5/webcomponents-icons/dist/customer-order-entry.js";

import "@ui5/webcomponents-icons/dist/role.js";
import "@ui5/webcomponents-icons/dist/employee.js";
import DashboardPage from "./Dashboard/CustomerDashboard";
import { useSelector } from "react-redux";
import CustomerDashboard from "./Dashboard/CustomerDashboard";

const CustomerAdmin = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const handleNavigationChange = (event) => {
    const key = event.detail.item.dataset.key;
    key && navigate(`/CustomerAdmin/${key}`);
  };

  useEffect(() => {
    if (user === "null" || user === null) {
      navigate("/login");
    }
  }, [user]);

  return (
    <FlexBox style={{ height: "100vh" }}>
      <FlexBox
        direction="Column"
        style={{ width: collapsed ? "66px" : "260px" }}
      >
        {!collapsed && (
          <Bar design="Header" style={{ width: "256px", boxShadow: "none" }}>
            <Title level="h2">Customer Admin</Title>
          </Bar>
        )}
        <SideNavigation
          onSelectionChange={handleNavigationChange}
          collapsed={collapsed}
        >
          <SideNavigationItem
            text="Dashboard"
            style={{ textAlign: "start" }}
            selected="true"
            icon="bbyd-dashboard"
            data-key="CustomerDashboard"
          />
          {/* <SideNavigationItem
            text="Employee Management"
            style={{ textAlign: "start" }}
            icon="role"
            
            
            data-key="AssignEmployees"
          > 
           
          </SideNavigationItem>
          <SideNavigationItem
            style={{ textAlign: "start" }}
            text="Menu Management"
            icon="end-user-experience-monitoring"
            data-key="MenuManagement"
            
          ></SideNavigationItem>*/}
          <SideNavigationItem
            style={{ textAlign: "start" }}
            text="Role Management"
            icon="end-user-experience-monitoring"
            data-key="RoleManagement"
            
          ></SideNavigationItem>
            
          <SideNavigationItem
            style={{ textAlign: "start" }}
            text="User Management"
            icon="user-edit"
            
            data-key="UserManagement"
          >
            
          </SideNavigationItem>
        </SideNavigation>
      </FlexBox>
      {/* Render routed content */}
      <FlexBox style={{ flex: 1, height: "90%" }}>
        <Outlet />
        {/* <CustomerDashboard /> */}
        {location.pathname === "/CustomerAdmin" && <DashboardPage />}
      </FlexBox>

    </FlexBox>
  );
};

export default CustomerAdmin;
