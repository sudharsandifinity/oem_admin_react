import {
  Button,
  Card,
  CardHeader,
  FlexBox,
  FlexBoxDirection,
  Icon,
  List,
  Menu,
  MenuItem,
  MenuSeparator,
  Page,
  SideNavigation,
  SideNavigationItem,
  SideNavigationSubItem,
  Text,
  Title,
  Toolbar,
  ToolbarButton,
  ToolbarSelect,
  ToolbarSelectOption,
  ToolbarSeparator,
  ToolbarSpacer,
  UserMenu,
  UserMenuAccount,
  UserMenuItem,
  Grid,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMenus } from "../../store/slices/usermenusSlice";

import { BarChart, PieChart } from "@ui5/webcomponents-react-charts";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { Bar } from "recharts";

const UserDashboard = () => {
  const { Menuitems } = useContext(FormConfigContext);
  const { usermenus } = useSelector((state) => state.usermenus);

  const navigate = useNavigate();
  const dispatch = useDispatch();



  const cardStyles = [
    { background: "#f8d7da", color: "#721c24" }, // red
    { background: "#d4edda", color: "#155724" }, // green
    { background: "#d1ecf1", color: "#0c5460" }, // blue
    { background: "#fff3cd", color: "#856404" }, // yellow
  ];

  const chartData = [
    { name: "Product A", users: 30 },
    { name: "Product B", users: 45 },
    { name: "Product C", users: 20 },
    { name: "Product D", users: 60 },
  ];

  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchUserMenus()).unwrap();
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch, navigate]);


  const userdata = usermenus.map((menu) => ({
    id: menu.id,
    name: menu.name,
    display_name: menu.display_name,
    parent: usermenus.find((item) => item.id === menu.parent)?.display_name || null,

    order_number: menu.order_number,
  }));

  const topLevelItems = userdata.filter((item) => item.parent === null);
  const childItems = userdata.filter((item) => item.parent !== null);

  // Group children by parent
  const groupedChildren = childItems.reduce((acc, item) => {
    if (!acc[item.parent]) acc[item.parent] = [];
    acc[item.parent].push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex"}}>
      {/* Side Navigation */}
      <FlexBox direction="Column" style={{ width: "240px" }}>
        <SideNavigation>{console.log("topLevelItems",topLevelItems,childItems,groupedChildren)}
         
          {topLevelItems
            .sort((a, b) => a.order_number - b.order_number)
            .map((item) => (
              <SideNavigationItem key={item.id} text={item.display_name} />
            ))}

          {/* Render grouped sub-items under their parent */}
          {Object.entries(groupedChildren).map(([parent, children]) => (
            <SideNavigationItem key={parent} text={parent}>
              {children
                .sort((a, b) => a.order_number - b.order_number)
                .map((child) => (
                  <SideNavigationSubItem
                    key={child.id}
                    text={child.display_name}
                    href="/ManageSalesOrder"
                  />
                ))}
            </SideNavigationItem>
          ))}
        </SideNavigation>
        {/* {usermenus
              .filter((item) => item.order_number === 1)
              .map((parent) => {
                const children = usermenus.filter(
                  (child) => child.order_number === 2
                  // &&child.parent_id === parent.id
                );

                return (
                  <SideNavigationItem
                    key={parent.id}
                    icon={iconMap[parent.name] || "question-mark"} // fallback icon
                    text={parent.display_name}
                    //href={parent.name}
                  >
                    {children.map((child) => (
                      <SideNavigationSubItem
                        key={child.id}
                        text={child.display_name}
                        href={"/" + child.name}
                        icon={iconMap[child.name] || "question-mark"} // fallback icon
                      />
                    ))}
                  </SideNavigationItem>
                );
              })} */}
      </FlexBox>

      {/* <SideNavigation
            onSelectionChange={handleNavigationChange}
            collapsed={collapsed}
          >
            <SideNavigationItem icon="home" text="Dashboard" selected />
            <SideNavigationItem icon="employee" text="Users" />
            <SideNavigationItem icon="settings" text="Settings" />
          </SideNavigation> */}

      <div style={{ flex: 1,flexDirection: "column" }}>
        {/* ShellBar */}

        {/* Welcome Text */}
        <div style={{ padding: "2rem" }} >
          <Title level="H2">Welcome, Vidhya</Title>

          {/* Colored Cards - Single Row */}
          <Grid defaultSpan="XL3 L3 M6 S12" style={{ marginTop: "2rem" }}>
            {["Users", "Tasks", "Messages", "Alerts"].map((label, i) => (
              <Card
                key={label}
                header={<CardHeader titleText={label} />}
                style={{ ...cardStyles[i], color: cardStyles[i].color }}
              >
                <Text style={{ padding: "1rem", fontSize: "1.5rem" }}>
                  {Math.floor(Math.random() * 100)}
                </Text>
              </Card>
            ))}
          </Grid>

          {/* Charts Row */}
          <FlexBox
            direction={FlexBoxDirection.Row}
            style={{ marginTop: "2rem", gap: "2rem" }}
          >
            <Card
              header={<CardHeader titleText="User Distribution" />}
              style={{ width: "48%" }}
            >
              <PieChart
                dimensions={[{ accessor: "name" }]}
                measures={[
                  { accessor: "users", formatter: (val) => `${val} users` },
                ]}
                dataset={chartData}
              />
            </Card>

            <Card
              header={<CardHeader titleText="User Activity" />}
              style={{ width: "48%" }}
            >
              {/* <BarChart
                  dimensions={[{ accessor: "name" }]}
                  measures={[{ accessor: "users", label: "Users" }]}
                  dataset={chartData}
                /> */}
              <PieChart
                dimensions={[{ accessor: "name" }]}
                measures={[
                  { accessor: "users", formatter: (val) => `${val} users` },
                ]}
                dataset={chartData}
              />
            </Card>
          </FlexBox>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
