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
  deleteForm,
  fetchForm,
} from "../../../../store/slices/formmasterSlice";
import {
  deleteUserMenus,
  fetchUserMenus,
} from "../../../../store/slices/usermenusSlice";
import AppBar from "../../../../Components/Module/Appbar";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";
import { set } from "react-hook-form";
const ViewMenuMaster = Loadable(lazy(() => import("./ViewMenuMaster")));

const MenuMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { usermenus, loading } = useSelector((state) => state.usermenus);
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { companies } = useSelector((state) => state.companies);
  const { branches } = useSelector((state) => state.branches);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    //dispatch(fetchForm());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchUserMenus()).unwrap();
        dispatch(fetchCompanies()).unwrap();
        dispatch(fetchBranch()).unwrap();
        console.log("resusers", res);

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        setApiError(err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);
  const handleDelete = async (menu) => {
    if (window.confirm(`Are you sure to delete menu: ${menu.name}?`)) {
      try {
        const res = await dispatch(deleteUserMenus(menu.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting menu:", error);
        setApiError(error?.message || "Failed to delete menu");
      }
    }
  };

  const handleEdit = (menu) => {
    navigate(`/admin/MenuMaster/edit/${menu.id}`);
  };

  const handleView = (menu) => {
    //navigate(`/MenuMaster/${menu.id}`);
    console.log("menu", menu);
    setSelectedMenu(menu.name);
    setViewId(menu.id);
  };

  const filteredRows =
    usermenus &&
    usermenus?.filter(
      (menu) =>
        menu.name.toLowerCase().includes(search.toLowerCase()) ||
        menu.display_name.toLowerCase().includes(search.toLowerCase()) ||
        menu.order_number.toString().includes(search) ||
        (menu.scope && menu.scope.toLowerCase().includes(search.toLowerCase())),
    );

  const columns = useMemo(
    () => [
      {
        Header: "Display Name",
        accessor: "display_name",
      },
      // {
      //   Header: "Parent",
      //   accessor: "parent",
      //   Cell: ({ row }) => {
      //     const parent = usermenus.find((item) => item.id === row.original.parentUserMenuId);
      //     return parent ? parent.display_name : "";
      //   },
      // },
      {
        Header: "Company Name ",
        accessor: "Company.name",
        Cell: ({ row }) => {
          let company;
          if (!row.original.companyId && row.original.branchId) {
            const companyId = branches.find(
              (b) => b.id === row.original.branchId,
            )?.companyId;
             company = companies.find((item) => item.id === companyId);
            console.log("company:::->", companyId, company);
          } else {
            company = companies.find(
              (item) => item.id === row.original.companyId,
            );
          }
          return company ? company.name : "";
        },
      },
      {
        Header: "Branch Name ",
        accessor: "Branch.name",
        Cell: ({ row }) => {
          const branch = branches.find(
            (item) => item.id === row.original.branchId,
          );
          return branch ? branch.name : "";
        },
      },
      {
        Header: "Scope",
        accessor: "scope",
      },

      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) =>
          row.original.status === 1 || row.original.status === "1" ? (
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
    [usermenus],
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
          title={"Menu list(" + filteredRows.length + ")"}
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
                <BreadcrumbsItem data-route="/admin/MenuMaster">
                  MenuMaster
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
            <Button
              design="Emphasized"
              onClick={() => navigate("/admin/MenuMaster/create")}
            >
              Add Menu
            </Button>
          }
        ></AppBar>
        <Page
          backgroundDesign="Solid"
          footer={<div></div>}
          // header={
          //   <AppBar
          //     design="Header"
          //     startContent={
          //       <div style={{ width: "150px" }}>
          //         <Breadcrumbs
          //           design="Standard"
          //           separators="Slash"
          //           onItemClick={(e) => {
          //             const route = e.detail.item.dataset.route;
          //             if (route) navigate(route);
          //           }}
          //         >
          //           <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
          //           <BreadcrumbsItem data-route="/admin/MenuMaster">
          //             MenuMaster
          //           </BreadcrumbsItem>
          //         </Breadcrumbs>
          //       </div>
          //     }
          //     endContent={
          //       <Button
          //         design="Emphasized"
          //         onClick={() => navigate("/admin/MenuMaster/create")}
          //       >
          //         Add Menu
          //       </Button>
          //     }
          //   >
          //     <Title level="H4">Menu List</Title>
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
              </FlexBox>
              {console.log("filteredRows", filteredRows)}
              {apiError && (
                      <MessageStrip
                        design="Negative"
                        hideCloseButton={false}
                        hideIcon={false}
                        style={{ marginBottom: "1rem" }}
                      >
                        {apiError}
                      </MessageStrip>
                    )}
              <FlexibleColumnLayout
                // style={{ height: "600px" }}
                layout={layout}
                startColumn={
                  <FlexBox direction="Column">
                    <div>
                      <FlexBox direction="Column">
                        {console.log("filteredRows", filteredRows)}
                        <AnalyticalTable
                          columns={columns}
                          data={filteredRows || []}
                          // header={<Title level="H5" style={{ paddingLeft: 5 }}>  {
                          //   "Menu list(" + filteredRows.length + ")"}</Title>}
                          style={{ padding: "10px" }}
                          // visibleRows={8}
                          subRowsKey="children" // 👈 enables tree structure
                          filterable
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
                        startContent={
                          <Title level="H5">
                            {selectedMenu + " Menu List"}
                          </Title>
                        }
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
                      <ViewMenuMaster id={ViewId} />
                    </div>
                  </Page>
                }
              />
            </FlexBox>
          </Card>
        </Page>
      </FlexBox>
    </>
  );
};

export default MenuMaster;
