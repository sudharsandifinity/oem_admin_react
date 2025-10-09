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

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menulist = selectedBranch
    ? authUserMenus.filter((menu) => menu.branchId === selectedBranch)
    : authUserMenus;
  const menuTree = buildMenuTree(
    menulist.length > 0 ? menulist : authUserMenus
  );
  useEffect(()=>{
    if(authUserMenus.length===0){
      navigate("/")
    }

  },[authUserMenus])
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
        {/* {companies && companies.length > 0 && (
          <>
            <Button
              endIcon="navigation-down-arrow"
              style={{
                background: "#0688f6",
                //borderRadius: "20px", // rounded corners
              }}
              ref={buttonRef}
              onClick={() => {
                setMenuIsOpen(true);
              }}
            >
              <span style={{ color: "black" }}>Companies</span>
            </Button>

            <Menu
              opener={buttonRef.current}
              open={menuIsOpen}
              onClose={() => {
                setMenuIsOpen(false);
              }}
            >
              {companies &&
                companies.map((branch) => (
                  <MenuItem
                    key={branch.Company.id}
                    text={branch.Company.name}
                    onClick={() => handleCompanyClick(branch.Company.id)}
                  >
                    <MenuItem
                      onClick={() => handleBranchClick(branch.id)}
                      key={branch.id}
                      text={branch.name}
                    />
                  </MenuItem>
                ))}
            </Menu>
          </>
        )} */}
        <div style={{ display: "flex", gap: "0.5rem",padding: "1rem" }}>
          <div style={{ width: "270px" }}>
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
              {companies&&companies.map((branch) => (
                <Option key={branch.Company.id} value={branch.Company.id}>
                  {branch.Company.name}
                </Option>
              ))}
            </Select>
          </div>

          <div style={{ width: "270px" }}>
            <Text>Branches</Text>
            <Select
              style={{ width: "100%" }}
              disabled={!selectedCompany}
              onChange={(e) =>
                handleBranchClick(e.detail.selectedOption.value)
              }
            >
              <Option>Select</Option>
              {companies&&companies.map((branch) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <Text style={{ paddingBottom: "1rem" }}>Menu List</Text>
        <SideNavigation>{console.log("menulist",menulist)}
          {menulist.length > 0 &&
            menulist.map((menu) =>
              !menu.RoleMenu.can_list_view ? null : (
                <SideNavigationItem key={menu.id} text={menu.display_name}>
                  {menu.children?.length > 0 &&
                    menu.children.map((child) => (
                      <SideNavigationSubItem
                        key={child.id}
                        text={child.display_name}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${menu.display_name}/${child.formId}`);
                        }}
                      />
                    ))}
                </SideNavigationItem>
              )
            )}
        </SideNavigation>

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
        <div style={{ padding: "2rem" }}>
          <Title level="H2">{`Welcome, ${user?.first_name || "Guest"}`}</Title>

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
