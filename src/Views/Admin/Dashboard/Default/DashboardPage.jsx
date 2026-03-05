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

const DashboardPage = () => {
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

        {/* ===== KPI CARDS ===== */}
        <FlexBox wrap style={{ gap: "1.5rem", marginBottom: "2rem" }}>
          {cardData.map((card) => (
            <div
              key={card.title}
              style={{
                flex: "1 1 220px",
                minWidth: "200px",
                background: card.color,
                color: "white",
                borderRadius: "14px",
                padding: "1.5rem",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease"
              }}
            >
              <Text style={{ opacity: 0.85 }}>{card.title}</Text>
              <Title level="H3" style={{ color: "white" }}>
                {card.value}
              </Title>
            </div>
          ))}
        </FlexBox>

        {/* ===== CHART SECTION ===== */}
        <FlexBox
          wrap
          direction={FlexBoxDirection.Row}
          style={{ gap: "2rem" }}
        >
          {/* Area Chart */}
          <Card
            header={<CardHeader titleText="User Growth Trend" />}
            style={{ flex: "1 1 500px", minWidth: "350px" }}
          >
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0070f2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0070f2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0070f2"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Donut Chart */}
          <Card
            header={<CardHeader titleText="User Distribution" />}
            style={{ flex: "1 1 350px", minWidth: "300px" }}
          >
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </FlexBox>
        {/* Bottom Section - Fill Remaining Screen */}
<FlexBox
  direction={FlexBoxDirection.Row}
  style={{ marginTop: "2rem", gap: "2rem" }}
>
  {/* Recent Users */}
  <Card
    header={<CardHeader titleText="Recent Users" />}
    style={{ width: "48%" }}
  >
    <div style={{ padding: "1rem", maxHeight: "250px", overflowY: "auto" }}>
      {[
        { name: "John Doe", role: "Admin" },
        { name: "Priya Sharma", role: "Manager" },
        { name: "Ahmed Ali", role: "User" },
        { name: "Sneha Reddy", role: "User" },
      ].map((user, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <Text>{user.name}</Text>
          <Text style={{ color: "#0070f2" }}>{user.role}</Text>
        </div>
      ))}
    </div>
  </Card>

  {/* Recent Forms */}
  <Card
    header={<CardHeader titleText="Recent Forms" />}
    style={{ width: "48%" }}
  >
    <div style={{ padding: "1rem", maxHeight: "250px", overflowY: "auto" }}>
      {[
        { form: "Purchase Order", status: "Approved" },
        { form: "Leave Request", status: "Pending" },
        { form: "Expense Claim", status: "Rejected" },
        { form: "Vendor Setup", status: "Approved" },
      ].map((form, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem 0",
            borderBottom: "1px solid #eee",
          }}
        >
          <Text>{form.form}</Text>
          <Text
            style={{
              color:
                form.status === "Approved"
                  ? "green"
                  : form.status === "Pending"
                  ? "orange"
                  : "red",
            }}
          >
            {form.status}
          </Text>
        </div>
      ))}
    </div>
  </Card>
</FlexBox>

{/* Quick Actions + Activity */}
<FlexBox
  direction={FlexBoxDirection.Row}
  style={{ marginTop: "2rem", gap: "2rem" }}
>
  {/* Quick Actions */}
  <Card
    header={<CardHeader titleText="Quick Actions" />}
    style={{ width: "48%" }}
  >
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <button className="sap-button">Create Company</button>
      <button className="sap-button">Create User</button>
      <button className="sap-button">Create Role</button>
      <button className="sap-button">Create Form</button>
    </div>
  </Card>

  {/* Activity Timeline */}
  <Card
    header={<CardHeader titleText="Recent Activity" />}
    style={{ width: "48%" }}
  >
    <div style={{ padding: "1rem" }}>
      {[
        "Admin created new Company",
        "User John updated profile",
        "Role Manager assigned to Priya",
        "Form Purchase Order approved",
      ].map((activity, index) => (
        <div
          key={index}
          style={{
            padding: "0.5rem 0",
            borderLeft: "3px solid #0070f2",
            paddingLeft: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <Text>{activity}</Text>
        </div>
      ))}
    </div>
  </Card>
</FlexBox>
      </Page>
    </>
  );
};

export default DashboardPage;