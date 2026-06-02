import {
  Card,
  CardHeader,
  FlexBox,
  FlexBoxDirection,
  Icon,
  Page,
  Text,
  Title,
} from "@ui5/webcomponents-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMaterialRequest } from "../../store/slices/materialRequestSlice";
import { fetchPurchaseRequest } from "../../store/slices/PurchaseRequestSlice";
import { fetchPurchaseDeliveryNotes } from "../../store/slices/purDeliveryNoteSlice";
import { number } from "framer-motion";

const COLORS = ["#5b2c58", "#1b4965", "#e35305", "#2a9d8f", "#6a4c93"];

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const allProjects = user?.Projects || [];
  const allMenus =
    user?.Roles?.flatMap(
      (role) =>
        role.UserMenus?.filter((r) => r.status === 1).flatMap((menu) => [
          ...(menu.children
            ?.filter((r) => r.status === 1)
            .map((child) => child.name) || []),
        ]) || [],
    ) || [];
  const [selectedProject, setSelectedProject] = useState(null);

  // Example data
  const [dashboardData, setDashboardData] = useState([]);

  const uniqueMenus = useMemo(() => {
    return [...new Set(allMenus)];
  }, [allMenus]);
 useEffect(() => {
  const loadDashboardData = async () => {
    const mockData = await Promise.all(
      allProjects.map(async (project) => {
        const dynamicMenus = {};

        for (const menu of uniqueMenus) {
          let res = [];

          if (menu === "Purchase Request") {
            res = await dispatch(
              fetchPurchaseRequest({
                top: 100,
                skip: 0,
              })
            ).unwrap();
          } else if (menu === "GRPO") {
            res = await dispatch(
              fetchPurchaseDeliveryNotes({
                top: 100,
                skip: 0,
              })
            ).unwrap();
          } else if (
            menu ===
            "Material Request"
          ) {
            res = await dispatch(
              fetchMaterialRequest({
                top: 100,
                skip: 0,
              })
            ).unwrap();
          }

          console.log(
            "uniqueMenus",
            menu,
            res
          );

          const raw =
            res?.data?.value ??
            res?.data ??
            res?.value ??
            res;

          const list = Array.isArray(raw)
            ? raw
            : raw
              ? [raw]
              : [];

          // TAKE COUNT VALUE
          dynamicMenus[menu] =
            list.length;
        }

        return {
          projectCode:
            project.Code,

          projectName:
            project.Name,

          ...dynamicMenus,

          monthly: [
            {
              month: "Jan",
              amount:
                Math.floor(
                  Math.random() *
                    10000
                ),
            },
            {
              month: "Feb",
              amount:
                Math.floor(
                  Math.random() *
                    10000
                ),
            },
          ],
        };
      })
    );

    setDashboardData(mockData);

    if (mockData.length > 0) {
      setSelectedProject(
        mockData[0]
      );
    }
  };

  if (
    allProjects.length > 0 &&
    uniqueMenus.length > 0
  ) {
    loadDashboardData();
  }
}, [
  allProjects,
  uniqueMenus,
  dispatch,
]);

  const menuCountData = useMemo(() => {
    if (!selectedProject) return [];


    return [
      {
        name: "Material Request",
        value: selectedProject["Material Request"] || 0,
      },

      {
        name: "Purchase Request",
        value: selectedProject["Purchase Request"] || 0,
      },

      {
        name: "GRPO",
        value: selectedProject["GRPO"] || 0,
      },
    ];
  }, [selectedProject]);

  return (
    <Page style={{ overflowY: "auto" }}>
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Header */}
        <Title level="H2">Project Analytics Dashboard</Title>

        {/* Project Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "1rem",
          }}
        >
          {dashboardData.map((project, index) => (
            <Card
              key={project.projectCode}
              onClick={() => setSelectedProject(project)}
              style={{
                cursor: "pointer",
                width: "30%",
                borderRadius: "14px",
                border:
                  selectedProject?.projectCode === project.projectCode
                    ? `3px solid ${COLORS[index % COLORS.length]}`
                    : "1px solid #ddd",
              }}
            >
              <div
                style={{
                  background: COLORS[index % COLORS.length],
                  color: "white",
                  padding: "1rem",
                }}
              >
                <FlexBox justifyContent="SpaceBetween" alignItems="Center">
                  <div>
                    <Title level="H4" style={{ color: "white" }}>
                      {project.projectName}
                    </Title>

                    <Text style={{ color: "white" }}>
                      {project.projectCode}
                    </Text>
                  </div>

                  <Icon
                    name="business-suite"
                    style={{ fontSize: "2rem", color: "white" }}
                  />
                </FlexBox>
              </div>

              <div style={{ padding: "1rem" }}>
                <Text>
                  Total Documents :{" "}
                  {project["Purchase Request"] +
                    project.GRPO +
                    project["Material Request"]}
                </Text>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        {selectedProject && (
          <>
            {/* KPI Cards */}

            {/* Charts Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(450px,1fr))",
                gap: "1rem",
              }}
            >
              {/* Bar Chart */}
              <Card style={{ padding: "1rem" }}>
                <Title level="H5" style={{ padding: "1rem" }}>
                  Documents by Menu
                </Title>

                <div style={{ height: "350px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={menuCountData}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="name" />

                      <YAxis />

                      <Tooltip />

                      <Bar dataKey="value" fill="#1b4965" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Pie Chart */}
              <Card style={{ padding: "1rem" }}>
                <Title level="H5" style={{ padding: "1rem" }}>
                  Project Distribution
                </Title>

                <div style={{ height: "350px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={menuCountData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                      >
                        {menuCountData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Monthly Trend */}
              <Card style={{ padding: "1rem" }}>
                <Title level="H5" style={{ padding: "1rem" }}>
                  Monthly Performance
                </Title>

                <div style={{ height: "350px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedProject.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="month" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#e35305"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default UserDashboard;
