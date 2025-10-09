import {
  Card,
  CardHeader,
  FlexBox,
  FlexBoxDirection,
  Page,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import React from "react";
import { BulletChart } from "@ui5/webcomponents-react-charts";

const UserDashboard = () => {
  const cardData = [
    { title: "Sales", color: "#5b2c58ff" },
    { title: "Purchase", color: "#e35305ff" },
  ];
  const data = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 50 },
    { name: "May", value: 75 },
  ];

  return (
    <>
    <style>
        {`
          ui5-page::part(content) {
            padding: 0px;
          }
        `}
      </style>
    <Page style={{ padding: "1rem", overflowY: "auto" }} > 
      <div style={{ flex: 1, flexDirection: "column" }}>
        {/* ShellBar */}

        {/* Welcome Text */}
        {/* <div> */}
          {/* <Title level="H2" style={{marginBottom: '15px'}}>Welcome, Admin</Title> */}

          {/* Colored Cards - Single Row */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {cardData.map(({ title, color }) => (
              <div
                key={title}
                style={{
                  backgroundColor: color,
                  color: "white",
                  borderRadius: "10px",
                  padding: "1rem",
                  width: "150px",
                }}
              >
                <h3>{title}</h3>
                <p>{Math.floor(Math.random() * 100)}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <FlexBox
            direction={FlexBoxDirection.Row}
            style={{ marginTop: "1rem", gap: "2rem" }}
          >
            <Card
              header={<CardHeader titleText="User Distribution" />}
              style={{ width: "58%" }}
            >
              <div style={{ width: "100%", height: 300, marginTop: "2rem" }}>
                <ResponsiveContainer>
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0070f2"
                      strokeWidth={2}
                    />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card
              header={<CardHeader titleText="User Activity" />}
              style={{ width: "48%" }}
            >
              <div style={{ width: "100%", height: 350, marginTop: "2rem" }}>
                <ResponsiveContainer>
                  <BulletChart
                    dataset={[
                      {
                        name: "January",
                        sessions: 300,
                        users: 100,
                        volume: 350,
                      },
                      {
                        name: "February",
                        sessions: 330,
                        users: 90,
                        volume: 370,
                      },
                      {
                        name: "March",
                        sessions: 404,
                        users: 0,
                        volume: 446,
                      },
                      {
                        name: "April",
                        sessions: 80,
                        users: 0,
                        volume: 250,
                      },
                      {
                        name: "May",
                        sessions: 300,
                        users: 0,
                        volume: 450,
                      },
                      {
                        name: "June",
                        sessions: 330,
                        users: 0,
                        volume: 500,
                      },
                      {
                        name: "July",
                        sessions: 300,
                        users: 65,
                        volume: 300,
                      },
                      {
                        name: "August",
                        sessions: 180,
                        users: 12,
                        volume: 104,
                      },
                      {
                        name: "September",
                        sessions: 360,
                        users: 99,
                        volume: 300,
                      },
                      {
                        name: "October",
                        sessions: 500,
                        users: 120,
                        volume: 200,
                      },
                      {
                        name: "November",
                        sessions: 404,
                        users: 130,
                        volume: 600,
                      },
                      {
                        name: "December",
                        sessions: 80,
                        users: 100,
                        volume: 320,
                      },
                    ]}
                    dimensions={[
                      {
                        accessor: "name",
                        formatter: function _ie() {},
                        interval: 0,
                      },
                    ]}
                    layout="horizontal"
                    measures={[
                      {
                        accessor: "sessions",
                        label: "Active Sessions",
                        type: "primary",
                      },
                      {
                        accessor: "users",
                        label: "Users",
                        type: "additional",
                      },
                      {
                        accessor: "volume",
                        formatter: function _ie() {},
                        label: "Volume",
                        type: "comparison",
                      },
                    ]}
                    onClick={function _ie() {}}
                    onDataPointClick={function _ie() {}}
                    onLegendClick={function _ie() {}}
                  />
                </ResponsiveContainer>
              </div>
            </Card>
          </FlexBox>
        </div>
      {/* </div> */}
    </Page>
    </>
  );
};

export default UserDashboard;
