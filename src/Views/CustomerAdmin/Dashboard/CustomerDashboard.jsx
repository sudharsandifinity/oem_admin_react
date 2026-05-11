import {
  Card,
  CardHeader,
  FlexBox,
  FlexBoxDirection,
  Page,
  Title,
  Text
} from "@ui5/webcomponents-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import React from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const cardData = [
    { title: "Masters", value: 24, color: "#6c6da5" },
    { title: "Menu", value: 12, color: "#aa8c77" },
    { title: "Setup", value: 8, color: "#648a7d" },
    { title: "Forms", value: 15, color: "#675e7e" }
  ];

  const trendData = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 50 },
    { name: "May", value: 75 }
  ];

  const pieData = [
    { name: "Active Users", value: 400 },
    { name: "Inactive Users", value: 120 }
  ];

  const COLORS = ["#0070f2", "#d1d5db"];

  return (
    <>
      <style>
        {`
          ui5-page::part(content) {
            padding: 0;
          }
        `}
      </style>

      <Page style={{ padding: "1.5rem", overflowY: "auto" }}>
        <Title level="H2" style={{ marginBottom: "1.5rem" }}>
          Admin Dashboard
        </Title>

        <FlexBox
        wrap="Wrap"
        style={{ padding: "20px", gap: "20px" }}
      >

        <Card
          style={{ width: "250px", cursor: "pointer" }}
          onClick={() => navigate("/CustomerAdmin")}
        >
          <CardHeader titleText="Customer Admin" subtitleText="Admin Settings" />
          <div style={{ padding: "1rem" }}>
            Assign employees, manage roles and permissions
          </div>
        </Card>

        <Card 
          style={{ width: "250px", cursor: "pointer" }}
          onClick={() => navigate("/CustomerUsers")}
        >
          <CardHeader titleText="Manage Users" subtitleText="User Management" />
          <div style={{ padding: "1rem" }}>
            Create and manage customer users
          </div>
        </Card>

        {/* <Card
          style={{ width: "250px", cursor: "pointer" }}
          onClick={() => navigate("/AssignEmployees")}
        >
          <CardHeader titleText="Assign Employees" subtitleText="Employee Allocation" />
          <div style={{ padding: "1rem" }}>
            Assign employees to customers
          </div>
        </Card> */}

        <Card
          style={{ width: "250px", cursor: "pointer" }}
          onClick={() => navigate("/RolePermissions")}
        >
          <CardHeader titleText="Role Permissions" subtitleText="Access Control" />
          <div style={{ padding: "1rem" }}>
            Configure role based permissions
          </div>
        </Card>

      </FlexBox>

        


      </Page>
    </>
  );
};

export default CustomerDashboard
