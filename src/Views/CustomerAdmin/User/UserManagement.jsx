import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  FlexBox,
  FlexibleColumnLayout,
  MessageStrip,
  Option,
  Page,
  Search,
  Select,
  Switch,
  Tag,
  Title,
} from "@ui5/webcomponents-react";
import { lazy } from "react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createEmployee,
  deleteUser,
  fetchUsers,
} from "../../../store/slices/usersSlice";
import AppBar from "../../../Components/Module/Appbar";
import Loadable from "../../../ui-component/Loadable";
import SyncEmployeedialog from "./SyncEmployeedialog";
import { set } from "react-hook-form";
import { fetchCompanies } from "../../../store/slices/companiesSlice";
import { fetchRoles } from "../../../store/slices/roleSlice";

// const ViewUser = Loadable(lazy(() => import("./ViewUser")));

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.companies);
  const { roles } = useSelector((state) => state.roles);

  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [apiError, setApiError] = useState(null);
  const [isEmployeeSyncing, setIsEmployeeSyncing] = useState(false);
  const [active, setActive] = useState(false);

  const openSyncEmployeesPopup = () => {
    // Implement the logic to open the Sync Employees popup
    console.log("Sync Employees Popup Opened:", open);
    setIsEmployeeSyncing(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchUsers()).unwrap();
        await dispatch(fetchCompanies()).unwrap();
        await dispatch(fetchRoles()).unwrap();
        console.log("resusers", res);
        if (res.message === "Please Login!") {
          // navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        setApiError(err.message);
        // err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  const handlesyncEmployees = async (company, roles) => {
    console.log("handlecreate", company, roles);
    try {
      const payload = {
        company_id: company,
        roleIds: roles,
      };
      console.log("handlecreate payload", payload);
      const res = await dispatch(createEmployee(payload)).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      } else {
        navigate("/admin/employees");
      }
    } catch (err) {
      console.log("err", err);
      setApiError(err?.message || "Failed to create Employee");
    }
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure to delete user: ${user.first_name} ${user.last_name}?`,
      )
    ) {
      try {
        const res = await dispatch(deleteUser(user.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    navigate(`/CustomerAdmin/UserManagement/edit/${user.id}`);
  };

  const handleView = (user) => {
    //navigate(`/users/${user.id}`);
   navigate(`/CustomerAdmin/UserManagement/view/${user.id}`);
  };
  console.log("users", users);
  const filteredRows =
    users !== null &&
    users.length > 0 &&
    users?.filter(
      (user) =>
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );
  const selectedUserList =
    selectedCompany !== ""
      ? filteredRows?.filter((user) =>
          user.Branches?.some((b) => b.Company.id === selectedCompany),
        )
      : filteredRows;
  console.log("selectedUserList", selectedUserList);
  const editRow = (row) => {
    console.log("Edit Row:", row);
  };
  const CompanyFilter = (rows, id, filterValues) => {
    console.log("rows", rows);
    const filteredRows = rows.filter((row) =>
      row.original.Branches?.some((branch) =>
        branch.Company?.name
          ?.toLowerCase()
          .includes(filterValues.toLowerCase()),
      ),
    );
    return filteredRows;
  };
  const roleFilter = (rows, id, filterValues) => {
    console.log("rowsrole", rows);
    const filteredRows = rows.filter((row) =>
      row.original.Roles?.some((branch) =>
        branch.name?.toLowerCase().includes(filterValues.toLowerCase()),
      ),
    );
    return filteredRows;
  };
  useEffect(() => {
    console.log("user", user);
    if (user === "null" || user.length === 0) {
      navigate("/login");
    }
  }, [user]);
  {
    apiError && (
      <MessageStrip
        design="Negative"
        hideCloseButton={false}
        hideIcon={false}
        style={{ marginBottom: "1rem" }}
      >
        {apiError}
      </MessageStrip>
    );
  }
  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "first_name",
        width: 200,

      },
      {
        Header: "Last Name",
        accessor: "last_name",
        filter: "text",
        width: 200,

      },
      {
        Header: "Email",
        accessor: "email",
        width: 250,

      },
      {
        Header: "User Category",
        accessor: "is_super_user",
        width: 200,

        Cell: ({ row }) =>
          row.original.is_super_user === 1 ? "Super User" : "User",
      },
      {
        Header: "Company",
        // accessor: "Company",
        width: 200,

        Cell: ({ row }) => {
          const companies =
            row.original.Branches?.map((b) => b.Company.name) || [];
          const uniqueCompanies = [...new Set(companies)];
          return uniqueCompanies.join(", ");
        },

        filter: CompanyFilter,
        filterable: true,
      },
      {
        Header: "Role",
        accessor: "Role",
        width: 200,

        Cell: ({ row }) =>
          row.original.Roles.map((role) => role.name).join(", ") || "N/A",
        filter: roleFilter,
        filterable: true,
      },
      {
        Header: "Status",
        accessor: "status",
        width: 200,

        Cell: ({ row }) =>
          // row.original.status === 1 ? (
          //   <Tag children="Active" design="Positive" size="S" />
          // ) : (
          //   <Tag children="Inactive" design="Negative" size="S" />
          // ),
          {const value = row.original.status === "1";

    const handleToggle = (checked) => {
      setitemTableData((prev) => {
        const updated = [...prev];
        updated[row.index] = {
          ...updated[row.index],
          status: checked ? "Active" : "Inactive",
        };
        return updated;
      });
    };

    return (
     <> <Switch checked={value} onChange={(e) => handleToggle(e.target.checked)} />

  <span style={{
    color: value ? "green" : "red",
    fontSize: "12px"
  }}>
    {value ? "Active" : "Inactive"}
  </span></>
    );
  }
      },
      {
        Header: "Actions",
        accessor: ".",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 300,
        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
      
              <Button
                icon="sap-icon://show"
                disabled={isOverlay}
                design="Transparent"
                //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                onClick={() => handleView(row.original)}
              />
              <Button
                icon="sap-icon://delete"
                disabled={isOverlay}
                design="Transparent"
                //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                onClick={() => handleDelete(row.original)}
              />
            
            </FlexBox>
          );
        },
      },
    ],
    [],
  );
  return (
    <>
      <style>
        {`
                              ui5-page::part(content) {
                                padding: 15px;
                              }
                            `}
      </style>
      <FlexBox direction="Column" style={{ width: "100%" }}>
        <AppBar
          design="Header"
          title={"Users List(" + filteredRows.length + ")"}
          startContent={
            <div style={{ width: "150px" }}>
              <Breadcrumbs
                design="Standard"
                separators="Slash"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/users">
                  Users
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        ></AppBar>
        <Page
          backgroundDesign="Solid"
          footer={<div></div>}
          // header={
          //   <AppBar
          //     design="Header"
          //     startContent={
          //       <div style={{ width: "100px" }}>
          //         <Breadcrumbs
          //           design="Standard"
          //           separators="Slash"
          //           onItemClick={(e) => {
          //             const route = e.detail.item.dataset.route;
          //             if (route) navigate(route);
          //           }}
          //         >
          //           <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
          //           <BreadcrumbsItem data-route="/admin/users">
          //             Users
          //           </BreadcrumbsItem>
          //         </Breadcrumbs>
          //       </div>
          //     }
          //     endContent={
          //       <Button
          //         design="Emphasized"
          //         onClick={() => navigate("/admin/users/create")}
          //       >
          //         Add User
          //       </Button>
          //     }
          //   >
          //     <Title level="H4">User List</Title>
          //   </AppBar>
          // }
        >
          <Card
            style={{
              height: "auto",
              width: "100%",
              //padding: "0.5rem",
              maxHeight: "560px",
            }}
          >
            <FlexBox direction="Column" style={{ padding: 0 }}>
              <FlexBox
                justifyContent="End"
                alignItems="Center"
                style={{ margin: "10px" }}
              >
                <Search
                  onClose={function Xs() {}}
                  onInput={(e) => setSearch(e.target.value)}
                  onOpen={function Xs() {}}
                  onScopeChange={function Xs() {}}
                  onSearch={(e) => setSearch(e.target.value)}
                />
                <Button
                  design="default"
                  style={{ marginLeft: "10px" }}
                  onClick={openSyncEmployeesPopup}
                >
                  Sync Employees
                </Button>
              </FlexBox>
              <FlexibleColumnLayout
                // style={{ height: "600px" }}
                layout={layout}
                startColumn={
                  <FlexBox direction="Column">
                    <div>
                      <FlexBox direction="Column">
                        <AnalyticalTable
                          columns={columns}
                          data={selectedUserList || []}
                          resizableColumns
                          style={{ padding: "10px" }}
                          // visibleRows={8}
                          filterable
                          sortable
                          groupable
                          onAutoResize={() => {}}
                          onColumnsReorder={() => {}}
                          onGroup={() => {}}
                          onLoadMore={() => {}}
                          onRowClick={() => {}}
                          onRowExpandChange={() => {}}
                          onRowSelect={() => {}}
                          onSort={() => {}}
                          onTableScroll={() => {}}
                        />
                      </FlexBox>
                    </div>
                  </FlexBox>
                }
                midColumn={
                  <Page
                    header={
                      <Bar
                        endContent={
                          <Button
                            icon="sap-icon://decline"
                            title="close"
                            onClick={() => setLayout("OneColumn")}
                          />
                        }
                        startContent={<Title level="H5">Preview Users</Title>}
                      ></Bar>
                    }
                  >
                    {/* <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "start",
                        //height: "90%",
                        verticalAlign: "middle",
                      }}
                    >
                      <ViewUser id={ViewId} />
                    </div> */}
                  </Page>
                }
              />
            </FlexBox>
          </Card>
        </Page>
      </FlexBox>
      <SyncEmployeedialog
        open={isEmployeeSyncing}
        setIsEmployeeSyncing={setIsEmployeeSyncing}
        companies={companies}
        roles={roles}
        handlesyncEmployees={handlesyncEmployees}
      />
    </>
  );
};

export default UserManagement;
