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
import Admin from "../../Admin";
import {
  deleteFormFields,
  fetchFormFields,
} from "../../../../store/slices/FormFieldSlice";
const ViewFormFields = Loadable(lazy(() => import("./ViewFormFields")));

const FormFields = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { formField } = useSelector((state) => state.formField);

  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("OneColumn");
  const [ViewId, setViewId] = useState("");

  useEffect(() => {
    //dispatch(fetchFormFields());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchFormFields()).unwrap();
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
        const res = await dispatch(deleteFormFields(user.id)).unwrap();
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (formField) => {
    navigate(`/admin/FormFields/edit/${formField.id}`);
  };

  const handleView = (formField) => {
    //navigate(`/FormFields/${user.id}`);
    setViewId(formField.id);
  };
  const filteredRows = formField?.filter(
    (field) =>
      field.field_name.toLowerCase().includes(search.toLowerCase()) ||
      field.Form?.name.toLowerCase().includes(search.toLowerCase()) ||
      field.FormSection?.section_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      field.input_type.toLowerCase().includes(search.toLowerCase()) ||
      field.field_order.toLowerCase().includes(search.toLowerCase()) 
  );

  const columns = useMemo(
    () => [
      {
        Header: "Form Name",
        accessor: "name ",
        Cell: ({ row }) => row.original.Form?.name || "N/A",
      },
      {
        Header: "Form Section",
        accessor: "section_name",
        Cell: ({ row }) => row.original.FormSection?.section_name || "N/A",
      },
      {
        Header: "Field Name",
        accessor: "field_name",
      },
      {
        Header: "Field Display Name",
        accessor: "display_name",
        width: 180,
      },
      {
        Header: "Field Type",
        accessor: "input_type",
      },
      {
        Header: "Field Order",
        accessor: "field_order",
      },
      {
        Header: "Is visible",
        accessor: "is_visible",
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
                <BreadcrumbsItem data-route="/admin/FormFields">
                  FormFields
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
          endContent={
            <Button
              design="Emphasized"
              onClick={() => navigate("/admin/FormFields/create")}
            >
              Add Form Field
            </Button>
          }
        >
          <Title level="H4">Form Field List</Title>
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
                      data={filteredRows || []}
                      header={"  FormFields list(" + filteredRows.length + ")"}
                      visibleRows={10}
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
                    startContent={<Title level="H5">Preview FormFields</Title>}
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
                  {ViewId && <ViewFormFields id={ViewId} />}
                </div>
              </Page>
            }
          />
        </FlexBox>
      </Card>
    </Page>
  );
};

export default FormFields;
