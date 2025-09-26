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
const ViewFormMaster = Loadable(lazy(() => import("./ViewFormMaster")));

const FormMaster = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forms, loading } = useSelector((state) => state.forms);
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");

  useEffect(() => {
    //dispatch(fetchForm());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchForm()).unwrap();
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
  const handleDelete = async (form) => {
    if (window.confirm(`Are you sure to delete form: ${form.name}?`)) {
      try {
        const res = await dispatch(deleteForm(form.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
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
        form.display_name.toLowerCase().includes(search.toLowerCase())
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
                <BreadcrumbsItem data-route="/admin/FormMaster">
                  FormMaster
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
            <Button
              design="Emphasized"
              onClick={() => navigate("/admin/FormMaster/create")}
            >
              Add Form
            </Button>
          }
        >
          <Title level="H4">Form List</Title>
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
          {console.log("filteredRows", filteredRows)}
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
                      header={<Title level="H5" style={{ paddingLeft: 5 }}>  {
                        "FormMaster list(" + filteredRows.length + ")"}</Title>}
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
                    startContent={<Title level="H5">Preview FormMaster</Title>}
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
  );
};

export default FormMaster;
