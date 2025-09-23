import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  FlexBox,
  FlexibleColumnLayout,
  Option,
  Page,
  Search,
  Select,
  Tag,
  Title,
} from "@ui5/webcomponents-react";
import { lazy } from "react";
import Loadable from "../../../../ui-component/Loadable";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../../../../store/slices/usersSlice";
import { useNavigate } from "react-router-dom";
import Admin from "../../Admin";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
const ViewUser = Loadable(lazy(() => import("./ViewUser")));

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.users);
  const { companies } = useSelector((state) => state.companies);

  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchUsers()).unwrap();
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
  }, [dispatch]);

  const handleDelete = async (user) => {
    if (
      window.confirm(
        `Are you sure to delete user: ${user.first_name} ${user.last_name}?`
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
    navigate(`/admin/users/edit/${user.id}`);
  };

  const handleView = (user) => {
    //navigate(`/users/${user.id}`);
    setViewId(user.id);
  };
  console.log("users", users);
  const filteredRows =
    users !== null &&
    users.length > 0 &&
    users?.filter(
      (user) =>
        user.first_name.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );
  const selectedUserList =
    selectedCompany !== ""
      ? filteredRows?.filter((user) =>
          user.Branches?.some((b) => b.Company.id === selectedCompany)
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
        branch.Company?.name?.toLowerCase().includes(filterValues.toLowerCase())
      )
    );
    return filteredRows;
  };
  const roleFilter = (rows, id, filterValues) => {
    console.log("rowsrole", rows);
    const filteredRows = rows.filter((row) =>
      row.original.Roles?.some((branch) =>
        branch.name?.toLowerCase().includes(filterValues.toLowerCase())
      )
    );
    return filteredRows;
  };
  useEffect(() => {
    console.log("user",users);
    if(users==="null"||users.length===0){
      navigate("/login");
    }
  }, [users])
  const columns = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
        filter: "text",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "User Category",
        accessor: "is_super_user",
        Cell:({row})=>row.original.is_super_user===1?"Super User":"User"
      },
      {
        Header: "Company",
        accessor: "Company",
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
        Cell: ({ row }) =>
          row.original.Roles.map((role) => role.name).join(", ") || "N/A",
        filter: roleFilter,
        filterable: true,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) =>
          row.original.status === 1 ? (
            <Tag children="Active" design="Positive" size="S" />
          ) : (
            <Tag children="Inactive" design="Negative" size="S" />
          ),
      },
      {
        Header: "Actions",
        accessor: ".",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 120,

        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
              <Button
                icon="sap-icon://edit"
                disabled={isOverlay}
                design="Transparent"
                //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                onClick={() => handleEdit(row.original)}
              />
              <Button
                icon="sap-icon://delete"
                disabled={isOverlay}
                design="Transparent"
                //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                onClick={() => handleDelete(row.original)}
              />
              <Button
                icon="sap-icon://navigation-right-arrow"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {
                  setLayout("TwoColumnsMidExpanded");
                  handleView(row.original);
                }}
              />
            </FlexBox>
          );
        },
      },
    ],
    []
  );
  return (
    <Page
      backgroundDesign="Solid"
      footer={<div></div>}
      header={
        <Bar
          design="Header"
          startContent={
            <div style={{ width: "100px" }}>
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
          endContent={
            <Button
              design="Emphasized"
              onClick={() => navigate("/admin/users/create")}
            >
              Add User
            </Button>
          }
        >
          <Title level="H4">User List</Title>
        </Bar>
      }
    >
      <Card
        style={{
          height: "100%",
          width: "100%",
          padding: "0.5rem",
          paddingTop: "2rem",
        }}
      >
        <FlexBox direction="Column">
          <FlexBox
            justifyContent="SpaceBetween"
            direction="Row"
            alignItems="Center"
            style={{ margin: "1rem" }}
          >
            <Search
              onClose={function Xs() {}}
              onInput={function Xs() {}}
              onOpen={function Xs() {}}
              onScopeChange={function Xs() {}}
              onSearch={(e) => setSearch(e.target.value)}
            />
            <Select
              name="formId"
              value={selectedCompany ?? ""}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <Option key="" value="">
                Select
              </Option>
              {companies
                .filter((r) => r.status) /* active roles only    */
                .map((r) => (
                  <Option key={r.id} value={r.id}>
                    {r.name}
                  </Option>
                ))}
            </Select>
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
                      header={"  Users list(" + users.length + ")"}
                      visibleRows={8}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "start",
                    height: "90%",
                    verticalAlign: "middle",
                  }}
                >
                  <ViewUser id={ViewId} />
                </div>
              </Page>
            }
          />
        </FlexBox>
      </Card>
    </Page>
  );
};

export default Users;
