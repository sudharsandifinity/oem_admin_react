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
  const { requests } = useSelector((state) => state.purRequest);
  const { deliveryNotes } = useSelector((state) => state.purDeliveryNote);
  const { materialRequest } = useSelector((state) => state.materialRequests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

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
      const fetchData = async () => {
        try {
          if (uniqueMenus.includes("Purchase Request")) {
          
           await dispatch(
              fetchPurchaseRequest({
                top: 100,
                skip: 0,
              }),
            ).unwrap();
          
        }
         
            await dispatch(
              fetchPurchaseDeliveryNotes({
                top: 100,
                skip: 0,
              }),
            ).unwrap();
       

         
            await dispatch(
              fetchMaterialRequest({
                top: 100,
                skip: 0,
              }),
            ).unwrap();
       
        } catch (err) {
          console.log("Failed to fetch user", err.message);
          //setApiError(err.message);
         // err.message && navigate("/");
        }
      };
      fetchData();
    }, [dispatch]);
useEffect(() => {
    const projectData = allProjects.map((project) => {
      const projectRequests = requests.filter(
        (req) => req.U_PrjCode === project.Code
      );
      const projectDeliveryNotes = deliveryNotes.filter(
        (note) => note.U_PrjCode === project.Code
      );
    const projectMaterialRequests = materialRequest.filter(
      (mr) => mr.U_PrjCode === project.Code
    ); // Replace with actual material requests when available
    console.log("materialRequest",projectRequests,projectDeliveryNotes,projectMaterialRequests);
      return {
        projectCode: project.Code,
        projectName: project.Name,
        "Purchase Request": projectRequests.length,
        GRPO: projectDeliveryNotes.length,
        "Material Request": projectMaterialRequests.length,
        monthly: [
          { month: "Jan", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 0).length },
          { month: "Feb", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 1).length },
          { month: "Mar", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 2).length },
          { month: "Apr", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 3).length },
          { month: "May", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 4).length },
          { month: "Jun", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 5).length },
          { month: "Jul", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 6).length },
          { month: "Aug", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 7).length },
          { month: "Sep", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 8).length },
          { month: "Oct", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 9).length },
          { month: "Nov", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 10).length },
          { month: "Dec", amount: projectRequests.filter(req => new Date(req.createdAt).getMonth() === 11).length },
        ],
      };
    });
    setDashboardData(projectData);
  }, [allProjects, requests, deliveryNotes,materialRequest]);
  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedProject(dashboardData[0]);
    }
  }, [dashboardData]);

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
        <Title level="H2">Projects</Title>

        {/* Project Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "1rem",
                paddingLeft: "20px",

          }}
        >
          {dashboardData.map((project, index) => (
            <Card
              key={project.projectCode}
              onClick={() => setSelectedProject(project)}
              style={{
                cursor: "pointer",
                maxWidth: "30%",
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
                  <div style={{maxHeight:"50px"}}>
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
           
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(450px,1fr))",
                gap: "1rem",
              }}
            >
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
