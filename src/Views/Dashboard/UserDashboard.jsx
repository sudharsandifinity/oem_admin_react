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
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMenus } from "../../store/slices/usermenusSlice";

import { BarChart, PieChart } from "@ui5/webcomponents-react-charts";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import {
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomerSelection from "../SalesOrder/Header/CustomerSelection";
import { fetchCompanies } from "../../store/slices/companiesSlice";

const UserDashboard = () => {
  const { Menuitems } = useContext(FormConfigContext);
  const { usermenus } = useSelector((state) => state.usermenus);
  const { companies } = useSelector((state) => state.companies);

  const buttonRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const chartData = [
  //   { name: "Product A", users: 30 },
  //   { name: "Product B", users: 45 },
  //   { name: "Product C", users: 20 },
  //   { name: "Product D", users: 60 },
  // ];

  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchUserMenus()).unwrap();
        dispatch(fetchCompanies());
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
    parent:
      usermenus.find((item) => item.id === menu.parent)?.display_name || null,

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
  const cardData = [
    { title: "Users", color: "#0070f2" },
    { title: "Tasks", color: "#2ecc71" },
    { title: "Messages", color: "#e67e22" },
    { title: "Alerts", color: "#e74c3c" },
  ];
  const data = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 50 },
    { name: "May", value: 75 },
  ];
  const COLORS = ["#0070f2", "#2ecc71", "#e67e22", "#e74c3c"];
  return (
    <div style={{ display: "flex" }}>
      {/* Side Navigation */}

      <FlexBox direction="Column" style={{ width: "240px" }}>
        
        <SideNavigation>
          {console.log(
            "topLevelItems",
            topLevelItems,
            childItems,
            groupedChildren
          )}

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
          

      <div style={{ flex: 2, flexDirection: "column" }}>
        {/* ShellBar */}
<Button
          endIcon="navigation-down-arrow"
          ref={buttonRef}
          onClick={() => {
            setMenuIsOpen(true);
          }}
        >
          Companies
        </Button>
        <Menu
          opener={buttonRef.current}
          open={menuIsOpen}
          onClose={() => {
            setMenuIsOpen(false);
          }}
        >
          {companies.map((company) => (
            <MenuItem key={company.id} text={company.name}>
              {company.Branches.map((branch) => (
                <MenuItem key={branch.id} text={branch.name}>
                  {topLevelItems
                    .sort((a, b) => a.order_number - b.order_number)
                    .map((item) => (
                      <MenuItem key={item.id} text={item.display_name} />
                    ))}

                  {/* Render grouped sub-items under their parent */}
                  {Object.entries(groupedChildren).map(([parent, children]) => (
                    <MenuItem key={parent} text={parent}>
                      {children
                        .sort((a, b) => a.order_number - b.order_number)
                        .map((child) => (
                          <MenuItem
                            key={child.id}
                            text={child.display_name}
                            href="/ManageSalesOrder"
                          />
                        ))}
                    </MenuItem>
                  ))}
                </MenuItem>
              ))}
            </MenuItem>
          ))}
        </Menu>
        {/* Welcome Text */}
        <div style={{ padding: "2rem" }}>
          <Title level="H2">Welcome, Vidhya</Title>

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
            style={{ marginTop: "2rem", gap: "2rem" }}
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
                  <PieChart
                    dataset={[
                      {
                        name: "January",
                        users: 100,
                      },
                      {
                        name: "February",
                        users: 230,
                      },
                      {
                        name: "March",
                        users: 240,
                      },
                      {
                        name: "April",
                        users: 280,
                      },
                      {
                        name: "May",
                        users: 100,
                      },
                      {
                        name: "June",
                        users: 230,
                      },
                      {
                        name: "July",
                        users: 20,
                      },
                    ]}
                    dimension={{
                      accessor: "name",
                    }}
                    measure={{
                      accessor: "users",
                    }}
                    onClick={function _ie() {}}
                    onDataPointClick={function _ie() {}}
                    onLegendClick={function _ie() {}}
                    tooltipConfig={{
                      contentStyle: {
                        background: "black",
                      },
                      cursor: {
                        fill: "transparent",
                        stroke: "red",
                        strokeWidth: 2,
                      },
                      formatter: function _ie() {},
                      itemSorter: function _ie() {},
                      itemStyle: {
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                        marginBlockStart: "2px",
                        padding: "10px",
                      },
                      labelFormatter: function _ie() {},
                      labelStyle: {
                        color: "white",
                        fontFamily: "var(--sapFontBoldFamily)",
                      },
                      separator: ":~:",
                      wrapperStyle: {
                        border: "5px solid",
                        borderImage:
                          "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet) 1",
                        borderRadius: "8px",
                        padding: "5px",
                      },
                    }}
                  />
                </ResponsiveContainer>
              </div>
            </Card>
          </FlexBox>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
