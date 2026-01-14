import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  FlexBox,
  FlexibleColumnLayout,
  Page,
  Search,
  Tag,
  Title,
  Token,
} from "@ui5/webcomponents-react";
import { lazy } from "react";
import Loadable from "../../../../ui-component/Loadable";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Admin from "../../Admin";
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import { deleteRole } from "../../../../store/slices/roleSlice";
import AppBar from "../../../../Components/Module/Appbar";
const ViewCompanyRole = Loadable(lazy(() => import("./ViewCompanyRole")));

const CompanyRoleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");
  const {roles} =useSelector((state)=>state.roles)

  useEffect(() => {
    //dispatch(fetchCompanyRole());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchBranch()).unwrap();
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
  const handleDelete = async (role) => {
    if (
      window.confirm(
        `Are you sure to delete role: ${role.name}?`
      )
    ) {
      try {
        const res = await dispatch(deleteRole(role.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const handleEdit = (role) => {
    navigate(`/admin/companyroles/edit/${role.id}`);
  };

  const handleView = (role) => {
    //navigate(`/companyroles/${user.id}`);
    setViewId(role.id);
  };

  const filteredRows = roles?.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );
 
  const columns = useMemo(
    () => [
      {
        Header: "Company Role Name",
        accessor: "name",
        width: 250,
      },
      {
        Header: "Permissions",
        accessor: "Permissions",
        width: 500,
        height: 500,
        Cell: ({ row }) =>
          row.original.Permissions ? (
            <FlexBox
              style={{
                overflowX: "auto", // vertical scroll only
                padding: "1rem", // optional
                border: "1px solid #ccc", // just for visual debugging
              }}
            >
              {row.original.Permissions.map((perm) => (
                <Token text={perm.name} />
              ))}
            </FlexBox>
          ) : (
            "No Permissions"
          ),
      },

      {
        Header: "Status",
        accessor: "status",
        width: 250,

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
        width: 250,

        Cell: (instance) => {
          const {  row, webComponentsReactProperties } = instance;
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
        <AppBar
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
                <BreadcrumbsItem data-route="/admin/CompanyRole">
                  CompanyRole
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
            <Button
              design="Emphasized"
              onClick={() => navigate("/admin/CompanyRole/create")}
            >
              Add Company Role
            </Button>
          }
        >
          <Title level="H4">Company Role List</Title>
        </AppBar>
      }
    >
      <Card
        style={{
          height: "100%",
          width: "100%",
          //padding: "0.5rem",
                    paddingTop: "0.5rem",

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
              onInput={(e) => setSearch(e.target.value)}
              onOpen={function Xs() {}}
              onScopeChange={function Xs() {}}
              onSearch={(e) => setSearch(e.target.value)}
            />
          </FlexBox>
          {console.log("filteredRows", filteredRows)}
          <FlexibleColumnLayout
            // style={{ height: "600px" }}
            layout={layout}
            startColumn={
              <FlexBox direction="Column">
                <div>
                  <FlexBox direction="Column">
                    <AnalyticalTable
                      columns={columns}
                      data={filteredRows || []}
                      header={<Title level="H5" style={{ paddingLeft: 5 }}>  {
                        "Company Role List(" + filteredRows.length + ")"}</Title>}
                      visibleRows={10}
                      rowHeight={60}
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
                    startContent={<Title level="H5">Preview Company Role</Title>}
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
                  <ViewCompanyRole id={ViewId} />
                </div>
              </Page>
            }
          />
        </FlexBox>
      </Card>
    </Page>
  );
};

export default CompanyRoleList;


