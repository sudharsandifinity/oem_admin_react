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
} from "@ui5/webcomponents-react";
import { lazy } from "react";
import Loadable from "../../../../ui-component/Loadable";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteBranch,
  fetchBranch,
} from "../../../../store/slices/branchesSlice";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import AppBar from "../../../../Components/Module/Appbar";

const ViewBranch = Loadable(lazy(() => import("./ViewBranch")));

const Branches = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [layout, setLayout] = useState("OneColumn");

  const { branches } = useSelector((state) => state.branches);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState("");
  const [ViewId, setViewId] = useState("");

  useEffect(() => {
    //dispatch(fetchBranch());
    //dispatch(fetchCompanies());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchCompanies()).unwrap();
        console.log("resusers", res);
        dispatch(fetchBranch());
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

  const handleDelete = async (branch) => {
    if (
      window.confirm(`Are you sure you want to delete Branch: ${branch.name}?`)
    ) {
      try {
        const res = await dispatch(deleteBranch(branch.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting branch:", error);
      }
    }
  };
  const handleEdit = (user) => {
    navigate(`/admin/branches/edit/${user.id}`);
  };

  const handleView = (user) => {
    //navigate(`/company-forms/${user.id}`);
    setViewId(user.id);
  };

  const filtered = useMemo(() => {
    if (!search) return branches;
    return branches.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())||
    b.branch_code.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
    );
  }, [branches, search]);

  const columns = useMemo(
    () => [
      {
        Header: "Branch Name",
        accessor: "name",
      },
      {
        Header: "Company",
        accessor: "Company",
        Cell: ({ row }) => row.original.Company?.name || "N/A",
      },
      {
        Header: "City",
        accessor: "city",
      },
      {
        Header: "Address",
        accessor: "address",
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
          const { row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
              {user.Roles.some((role) =>
                role.Permissions.some((f) => f.name === "branch_update")
              ) && (
                <Button
                  icon="sap-icon://edit"
                  disabled={isOverlay}
                  design="Transparent"
                  //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                  onClick={() => handleEdit(row.original)}
                />
              )}
              {user.Roles.some((role) =>
                role.Permissions.some((f) => f.name === "branch_delete")
              ) && (
                <Button
                  icon="sap-icon://delete"
                  disabled={isOverlay}
                  design="Transparent"
                  //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                  onClick={() => handleDelete(row.original)}
                />
              )}
              {user.Roles.some((role) =>
                role.Permissions.some((f) => f.name === "branch_get")
              ) && (
                <Button
                  icon="sap-icon://navigation-right-arrow"
                  disabled={isOverlay}
                  design="Transparent"
                  onClick={() => {
                    setLayout("TwoColumnsMidExpanded");
                    handleView(row.original);
                  }}
                />
              )}
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
                <BreadcrumbsItem data-route="/admin/branches">
                  Branch
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
            user?.Roles?.some((role) =>
              role.Permissions.some((f) => f.name === "branch_create")
            ) && (
              <Button
                design="Emphasized"
                onClick={() => navigate("/admin/branches/create")}
              >
                Add Branch
              </Button>
            )
          }
        >
          <Title level="H4">Branch List</Title>
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
              onInput={function Xs() {}}
              onOpen={function Xs() {}}
              onScopeChange={function Xs() {}}
              onSearch={(e) => setSearch(e.target.value)}
            />
          </FlexBox>
          {console.log("filteredRows", filtered)}
          <FlexibleColumnLayout
            // style={{ height: "600px" }}
            layout={layout}
            startColumn={
              <FlexBox direction="Column">
                <div>
                  <FlexBox direction="Column">
                    {user?.Roles?.some((role) =>
                      role.Permissions.some((f) => f.name === "branch_list")
                    ) && (
                      <AnalyticalTable
                        columns={columns}
                        data={filtered || []}
                        header={<Title level="H5" style={{ paddingLeft: 5 }}>  {
                          "Branches list(" + filtered.length + ")"}</Title>}
                        visibleRows={8}
                        filterable
                        pagination
                        // visibleRows={10}
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
                    )}
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
                    startContent={<Title level="H5">Preview Branch</Title>}
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
                  <ViewBranch id={ViewId} />
                </div>
              </Page>
            }
          />
        </FlexBox>
      </Card>
    </Page>
  );
};

export default Branches;
