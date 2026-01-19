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
import { deleteRole, fetchRoles } from "../../../../store/slices/roleSlice";
import AppBar from "../../../../Components/Module/Appbar";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
const ViewRole = Loadable(lazy(() => import("./ViewRole")));

const RolesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles } = useSelector((state) => state.roles);
    const { user } = useSelector((state) => state.auth);
        const { branches } = useSelector((state) => state.branches);
  const { companies } = useSelector((state) => state.companies);
    
  
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");

  useEffect(() => {
    //dispatch(fetchRoles());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchRoles()).unwrap();
        await dispatch(fetchCompanies()).unwrap();
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
    navigate(`/admin/roles/edit/${role.id}`);
  };

  const handleView = (role) => {
    //navigate(`/roles/${user.id}`);
    setViewId(role.id);
  };

  const filteredRows = roles?.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = useMemo(
    () => [
      {
        Header: "Role Name",
        accessor: "name",
      },
      
 {
        Header: "Scope",
        accessor: "scope",
      },
      {
        Header:"Company",
         accessor: "company",
           Cell: ({ row }) => {
          const company = companies.find((company) =>
  company.Branches?.some((branch) => branch.id === row.original.branchId)
);
          return company ? company.name : "";
        },
      },
      {
        Header:"Branche",
         accessor: "Branch.name",
           Cell: ({ row }) => {
          const branch = branches.find((item) => item.id === row.original.branchId);
          return branch ? branch.name : "";
        },
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

        Cell: (instance) => {
          const { row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
               {user!==null&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "role_get")
                    
              ) && (
              <Button
                icon="sap-icon://edit"
                disabled={isOverlay}
                design="Transparent"
                //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                onClick={() => handleEdit(row.original)}
              />)}
               {user!==null&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "role_delete")
                    
              ) && (
              <Button
                icon="sap-icon://delete"
                disabled={isOverlay}
                design="Transparent"
                //onClick={() => { setLayout("TwoColumnsMidExpanded");setViewItem(row.original)}}
                onClick={() => handleDelete(row.original)}
              />)}
               {user!==null&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "role_get")
                    
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
     <>
                <style>
                    {`
                      ui5-page::part(content) {
                        padding: 15px;
                      }
                    `}
                  </style>
                <FlexBox direction="Column" style={{width: '100%'}}>
                 <AppBar
          design="Header"
              title={"Roles list(" + filteredRows.length + ")"}

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
                <BreadcrumbsItem data-route="/admin/roles">
                  Roles
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
             user!==null&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "role_create")
                    
              ) && (<Button
              design="Emphasized"
              onClick={() => navigate("/admin/roles/create")}
            >
              Add Role
            </Button>)
          }
        >
          
        </AppBar>
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
      //           <BreadcrumbsItem data-route="/admin/roles">
      //             Roles
      //           </BreadcrumbsItem>
      //         </Breadcrumbs>
      //       </div>
      //     }
      //     endContent={
      //        user!==null&&user.Roles.some(
      //           (role) =>
      //             role.Permissions.some((f) => f.name === "role_create")
                    
      //         ) && (<Button
      //         design="Emphasized"
      //         onClick={() => navigate("/admin/roles/create")}
      //       >
      //         Add Role
      //       </Button>)
      //     }
      //   >
      //     <Title level="H4">Role List</Title>
      //   </AppBar>
      // }
    >
      <Card
         style={{
          height: "auto",
          width: "100%",
          //padding: "0.5rem",
          maxHeight: '560px'
        }}
      >
        <FlexBox direction="Column" style={{padding: 0}}>
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
          </FlexBox>
          {console.log("filteredRows", filteredRows)}
          <FlexibleColumnLayout
            // style={{ height: "600px" }}
            layout={layout}
            startColumn={
              <FlexBox direction="Column">
                <div>
                  <FlexBox direction="Column">
                     {user!==null&&user.Roles.some(
                (role) =>
                  role.Permissions.some((f) => f.name === "role_list")
                    
              ) && (
                    <AnalyticalTable
                      columns={columns}
                      data={filteredRows || []}
                      // header={<Title level="H5" style={{ paddingLeft: 5 }}>  {
                      //   "Roles list(" + filteredRows.length + ")"}</Title>}
                      filterable
                      style={{padding: '10px'}}
                         // visibleRows={8}
                      rowHeight={50}
                      onAutoResize={() => {}}
                      onColumnsReorder={() => {}}
                      onGroup={() => {}}
                      onLoadMore={() => {}}
                      onRowClick={() => {}}
                      onRowExpandChange={() => {}}
                      onRowSelect={() => {}}
                      onSort={() => {}}
                      onTableScroll={() => {}}
                    />)}
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
                    startContent={<Title level="H5">Preview Roles</Title>}
                  ></Bar>
                }
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "start",
                    //height: "90%",
                    verticalAlign: "middle",
                  }}
                >
                  <ViewRole id={ViewId} />
                </div>
              </Page>
            }
          />
        </FlexBox>
      </Card>
    </Page></FlexBox>
    </>
  );
};

export default RolesList;
