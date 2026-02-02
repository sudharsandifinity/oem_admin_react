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
import {
  fetchForm,
  deleteForm,
} from "../../../../store/slices/formmasterSlice";
import { useNavigate } from "react-router-dom";
import Admin from "../../Admin";
import AppBar from "../../../../Components/Module/Appbar";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { set } from "react-hook-form";
const ViewFormMaster = Loadable(lazy(() => import("./ViewFormMaster")));

const FormMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, loading } = useSelector((state) => state.forms);
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.companies);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    //dispatch(fetchForm());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchForm()).unwrap();
        await dispatch(fetchCompanies()).unwrap();
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
  const handleDelete = async (form) => {
    if (window.confirm(`Are you sure to delete form: ${form.name}?`)) {
      try {
        const res = await dispatch(deleteForm(form.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        setApiError(error?.message || "Failed to delete form");
        console.error("Error deleting form:", error);
      }
    }
  };

  const handleEdit = (form) => {
    navigate(`/admin/FormMaster/edit/${form.id}`);
  };

  const handleView = (form) => {
    //navigate(`/FormMaster/${form.id}`);
    console.log("form", form);
    setViewId(form.id);
  };

  const filteredRows =
    forms &&
    forms?.filter(
      (form) =>
        form.name.toLowerCase().includes(search.toLowerCase()) ||
        form.display_name.toLowerCase().includes(search.toLowerCase()),
    );

  const columns = useMemo(
    () => [
      {
        Header: "Form Name",
        accessor: "name",
      },
      {
        Header: "Display Name",
        accessor: "display_name",
      },
      {
        Header: "Company",
        accessor: "company",
        Cell: ({ row }) => {
          const company = companies.find(
            (c) => c.id === row.original.Branch?.companyId,
          );
          return company ? company.name : "N/A";
        },

        filterable: true,
      },
      {
        Header: "Branch",
        accessor: "branch",
        Cell: ({ row }) => row.original.Branch?.name || "N/A",

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
    [],
  );
  useEffect(() => {
    if (user === "null") {
      navigate("/login");
    }
  }, [user]);
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
          title={"Form List (" + filteredRows.length + ")"}
          startContent={
            <div style={{ width: "150px" }}>
              <Breadcrumbs separators="Slash">
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/FormMaster">
                  Form
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
            user &&
            user.Roles.some((role) =>
              role.Permissions.some((f) => f.name === "form_create"),
            ) && (
              <Button
                //design="Default"
                size="Small"
                onClick={() => navigate("/admin/FormMaster/create")}
              >
                Add Form
              </Button>
            )
          }
        ></AppBar>
        <Page backgroundDesign="Solid" footer={<div></div>}>
          <Card
            style={{
              height: "auto",
              width: "100%",
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
              {console.log("filteredRows", filteredRows, user)}
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
                        {user &&
                          user.Roles.some((role) =>
                            role.Permissions.some(
                              (f) => f.name === "form_list",
                            ),
                          ) && (
                            <AnalyticalTable
                              columns={columns}
                              data={filteredRows || []}
                              // header={<Title level="H5" style={{ paddingLeft: 5 }}>  {
                              //   "FormMaster list(" + filteredRows.length + ")"}</Title>}
                              style={{ padding: "10px" }}
                              // visibleRows={8}
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
                        startContent={
                          <Title level="H5">Preview FormMaster</Title>
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
                        height: "90%",
                        verticalAlign: "middle",
                      }}
                    >
                      <ViewFormMaster id={ViewId} />
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

export default FormMaster;
