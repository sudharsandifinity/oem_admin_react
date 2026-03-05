// NOTE: this version of UserDashboard lives under Views and is an older
// implementation. The newer, component-based dashboard is located at
// src/Components/Dashboard/UserDashboard.jsx and is wired through routing.
// You can remove this file once you're sure the app no longer imports it.

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
  Select,
  Option,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMenus } from "../../store/slices/usermenusSlice";

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
  BarChart,
} from "recharts";
import RecentActivities from "./RecentActivities";

function buildMenuTree(menus) {
  const grouped = {};

  menus.forEach((menu) => {
    const parentId = menu.parentUserMenuId;

    if (!grouped[parentId]) {
      grouped[parentId] = [];
    }

    grouped[parentId].push(menu);
  });

  return grouped;
}

const UserDashboard = () => {
  const { Menuitems } = useContext(FormConfigContext);
  const { usermenus } = useSelector((state) => state.usermenus);
  const { user } = useSelector((state) => state.auth);
  const companies = user && user.Branches;
  const authUserMenus = user
    ? user.Roles.map((role) => role.UserMenus).flat()
    : [];

  const buttonRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // responsive toggle
  const [chartData, setChartData] = useState({ positions: [], views: [] });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menulist = selectedBranch
    ? authUserMenus.filter((menu) => menu.branchId === selectedBranch)
    : authUserMenus;
  const menuTree = buildMenuTree(
    menulist.length > 0 ? menulist : authUserMenus,
  );
  useEffect(() => {
    if (authUserMenus.length === 0) {
      navigate("/");
    }
  }, [authUserMenus]);

  // Fetch data for charts
  useEffect(() => {
    const loadChartData = async () => {
      try {
        // Fetch data based on selected branch
        const res = await dispatch(
          fetchUserMenus({ top: 100, skip: 0 }),
        ).unwrap();

        const orders = res?.data?.value ?? res?.data ?? res;
        const list = Array.isArray(orders) ? orders : orders ? [orders] : [];

        // Transform for "open positions" chart (monthly trend)
        const monthlyData = {};
        list.forEach((order) => {
          const month = new Date(order.CreatedDate || order.DocDate || Date.now()).toLocaleString("default", { month: "short" });
          if (!monthlyData[month]) {
            monthlyData[month] = 0;
          }
          monthlyData[month] += 1;
        });

        const positionsData = Object.entries(monthlyData).map(([month, count], idx) => ({
          name: month,
          value: count * 100 + (idx * 50),
        }));

        // Transform for "views" chart (daily data from last 5 records)
        const dailyData = {};
        list.slice(0, 5).forEach((order, idx) => {
          const date = new Date(order.CreatedDate || order.DocDate || Date.now());
          const dateStr = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
          dailyData[dateStr] = (idx + 1) * 200 + (idx * 100);
        });

        const viewsData = Object.entries(dailyData).map(([date, views]) => ({
          date,
          views,
        }));

        setChartData({ positions: positionsData, views: viewsData });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    loadChartData();
  }, [selectedBranch, dispatch]);
  console.log("authUserMenus", authUserMenus, menulist, menuTree);
  // const chartData = [
  //   { name: "Product A", users: 30 },
  //   { name: "Product B", users: 45 },
  //   { name: "Product C", users: 20 },
  //   { name: "Product D", users: 60 },
  // ];
  const handleCompanyClick = (companyName) => {
    console.log("Selected company:", companyName);
    setSelectedCompany(companyName);
  };
  const handleBranchClick = (branchname) => {
    console.log("Selected branch:", branchname);
    setSelectedBranch(branchname);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = ""; //await dispatch(fetchauth()).unwrap();

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

  const userdata =
    authUserMenus.length > 0 &&
    authUserMenus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      display_name: menu.display_name,
      parent:
        authUserMenus.find((item) => item.id === menu.parentUserMenuId)
          ?.display_name || null,

      order_number: menu.order_number,
    }));

  const topLevelItems =
    userdata && userdata.filter((item) => item.parentUserMenuId === null);
  const childItems =
    userdata && userdata.filter((item) => item.parentUserMenuId !== null);

  // Group children by parent
  const groupedChildren =
    childItems &&
    childItems.reduce((acc, item) => {
      if (!acc[item.parentUserMenuId]) acc[item.parentUserMenuId] = [];
      acc[item.parentUserMenuId].push(item);
      return acc;
    }, {});

  // Enhanced icon mapping
  const iconMap = {
    0: { name: "product", color: "var(--brand)" },
    1: { name: "employee", color: "var(--success)" },
    2: { name: "email", color: "var(--warning)" },
    3: { name: "alert", color: "var(--danger)" },
  };

  const cardData = [
    {
      title: "open positions",
      color: "var(--brand)",
      icon: "product",
      value: 122,
      delta: "+5.00%",
    },
    {
      title: "calls",
      color: "var(--success)",
      icon: "employee",
      value: 44,
      delta: "+15.00%",
    },
    {
      title: "unread messages",
      color: "var(--warning)",
      icon: "email",
      value: 22,
      delta: "-17.00%",
    },
    {
      title: "interviews",
      color: "var(--danger)",
      icon: "alert",
      value: 5,
      delta: "+25.00%",
    },
  ];

  // Chart data - distribution over months
  const userDistributionData = [
    { name: "Jan", value: 340 },
    { name: "Feb", value: 420 },
    { name: "Mar", value: 510 },
    { name: "Apr", value: 680 },
    { name: "May", value: 750 },
    { name: "Jun", value: 890 },
  ];

  // Views data for bar chart
  const viewsData = [
    { date: "20 Jun", views: 390 },
    { date: "21 Jun", views: 560 },
    { date: "22 Jun", views: 870 },
    { date: "23 Jun", views: 920 },
    { date: "24 Jun", views: 710 },
  ];

  // Last week reference
  const lastWeekMessages = [
    {
      name: "Dustin Perry",
      label: "Fernando Gellner",
      avatar: "https://via.placeholder.com/32?text=DP",
    },
    {
      name: "Adelaide Klein",
      label: "North Gladstone",
      avatar: "https://via.placeholder.com/32?text=AK",
    },
    {
      name: "Bess Keller",
      label: "Fernando Gellner",
      avatar: "https://via.placeholder.com/32?text=BK",
    },
    {
      name: "Marvin Wolfe",
      label: "East Suni",
      avatar: "https://via.placeholder.com/32?text=MW",
    },
  ];

  const data = userDistributionData;
  const COLORS = [
    "var(--brand)",
    "var(--success)",
    "var(--warning)",
    "var(--danger)",
  ];
  return (
    <div className={`dashboard-layout app-container${sidebarOpen ? " sidebar-open" : ""}`}>
      {/* decorative background shapes */}
      <div className="decor-top" />
      <div className="decor-bottom" />
      {/* responsive toggle */}
      <button
        className="toggle-sidebar"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Icon name="menu2" />
      </button>

      {/* Side Navigation */}

      <div
        className={"sidebar" + (sidebarOpen ? " open" : "")}
        style={{ width: "240px" }}
      >
        <div className="profile">
          <img src="https://via.placeholder.com/48" alt="User avatar" />
          <div>
            <div
              style={{ fontWeight: 600 }}
            >{`Hello, ${user?.first_name || "Guest"}`}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {user?.email || "guest@example.com"}
            </div>
          </div>
        </div>
        <nav>
          <a href="#" className="active">
            <Icon name="home" /> dashboard
          </a>
          <a href="#">
            <Icon name="email" /> inbox
          </a>
          <a href="#">
            <Icon name="employee" /> positions
          </a>
          <a href="#">
            <Icon name="map" /> matches
          </a>
          <a href="#">
            <Icon name="world" /> market
          </a>
        </nav>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingTop: "1rem",
          }}
        >
          <div>
            <Text>Company</Text>
            <Select
              style={{ width: "100%" }}
              onChange={(e) =>
                handleCompanyClick(e.detail.selectedOption.value)
              }
            >
              <Option key="" value="">
                Select
              </Option>
              {companies &&
                companies.map((branch) => (
                  <Option key={branch.Company.id} value={branch.Company.id}>
                    {branch.Company.name}
                  </Option>
                ))}
            </Select>
          </div>
          <div>
            <Text>Branches</Text>
            <Select
              style={{ width: "100%" }}
              disabled={!selectedCompany}
              onChange={(e) => handleBranchClick(e.detail.selectedOption.value)}
            >
              <Option>Select</Option>
              {companies &&
                companies.map((branch) => (
                  <Option key={branch.id} value={branch.id}>
                    {branch.name}
                  </Option>
                ))}
            </Select>
          </div>
        </div>
      </div>

      {/* 
          {topLevelItems&&topLevelItems
            .sort((a, b) => a.order_number - b.order_number)
            .map((item) => (
              <SideNavigationItem key={item.id} text={item.display_name} />
            ))} */}

      {/* {Object.entries(groupedChildren).map(([parent, children]) => (
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
          ))} */}
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
        {/* <Button
          endIcon="navigation-down-arrow"
          ref={buttonRef}
          onClick={() => {
            setMenuIsOpen(true);
          }}
        >
          Companies
        </Button> */}
        {/* <Menu
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
                  {topLevelItems &&
                    topLevelItems
                      .sort((a, b) => a.order_number - b.order_number)
                      .map((item) => (
                        <MenuItem key={item.id} text={item.display_name} />
                      ))}

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
        </Menu> */}
        {/* Welcome Text */}
        {/* shellbar */}
        <div className="shellbar">
          <span style={{ fontWeight: 600, color: "#fff" }}>OEM Dashboard</span>
        </div>
        <div style={{ padding: "2rem" }}>
          <Title level="H2">overview</Title>
          <Text style={{ color: "var(--muted)", paddingBottom: "2rem" }}>
            Below you can find small summary of all your actions
          </Text>

          {/* Key stats */}
          <div className="dashboard-grid" style={{ marginTop: "1rem" }}>
            {cardData.map(({ title, color, icon, value, delta }) => (
              <div className="overview-card" key={title}>
                <div className="icon-container" style={{ background: color }}>
                  <Icon name={icon} style={{ fontSize: "1.5rem" }} />
                </div>
                <div className="count">{value}</div>
                <div className="label">{title}</div>
                <div
                  className="delta"
                  style={{
                    color: delta.includes("-")
                      ? "var(--danger)"
                      : "var(--success)",
                  }}
                >
                  {delta}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section - 2 column layout */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="title">open positions</h3>
              <p className="subtitle">
                The graph shows how your sellings of your positions are changing
              </p>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData.positions.length > 0 ? chartData.positions : userDistributionData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--brand)"
                      strokeWidth={2}
                      dot={{ fill: "var(--brand)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                <span>last 3 weeks</span>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="title">views</h3>
              <p className="subtitle">
                Summary number of views of your positions
              </p>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.views.length > 0 ? chartData.views : viewsData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="views"
                      fill="var(--brand)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                <span>last week</span>
              </div>
            </div>
          </div>

          {/* Last Messages Section */}
          <div className="section-header">
            <h4>last messages</h4>
            <p>This is some of your last conversations</p>
          </div>
          <div className="messages-section">
            {lastWeekMessages.map((person) => (
              <div key={person.name} className="message-item">
                <img src={person.avatar} alt={person.name} />
                <div className="info">
                  <p className="name">{person.name}</p>
                  <p className="label">{person.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Business logic - recent activities */}
          <div className="section-header">
            <h4>recent activities</h4>
            <p>see the latest events relevant to your account</p>
          </div>
          <RecentActivities />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
