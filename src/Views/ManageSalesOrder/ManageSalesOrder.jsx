import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  FlexibleColumnLayout,
  Grid,
  Icon,
  Input,
  Label,
  MessageStrip,
  ObjectStatus,
  Option,
  Page,
  Select,
  Tag,
  Title,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { HeaderFilterBar } from "./HeaderFilterBar";
import ItemViewPage from "../SalesOrder/Contents/Item/ItemViewPage";
import ViewSalesOrder from "./ViewSalesOrder";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerOrder,
} from "../../store/slices/CustomerOrderSlice";
import TopNav from "../../Components/Header/TopNav";

const ManageSalesOrder = () => {
  const {
    ManageSalesOrderTableColumn,
    ManageSalesOrderTableData,
    ManageSalesOderHeaderField,
  } = useContext(FormConfigContext);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    FromDate: "",
    ToDate: "",
  });

  const [isClearFilter, setisClearFilter] = useState(false);
    const user = useSelector((state) => state.auth.user);
  
  const { companyformfield } = useSelector((state) => state.companyformfield);
  const { companyformfielddata } = useSelector(
    (state) => state.companyformfielddata
  );
  const { customerorder, businessPartner, loading, error } = useSelector(
    (state) => state.customerorder
  );
  const [tableData, settableData] = useState([]);
    const [formDetails, setFormDetails] = useState([]);
  
  const placeholderRows = Array(5).fill({
    CustomerCode: "Loading...",
    CustomerName: "Loading...",
    DocumentNo: "-",
    PostingDate: "-",
    Status: "-",
  });
  const settabledata = (customerorder) => {
    console.log("customerorderobject", customerorder);
    if (customerorder?.length > 0) {
      const tableconfig = customerorder.map((item) => ({
        DocEntry: item.DocEntry,
        CustomerCode: item.CardCode,
        CustomerName: item.CardName,
        DocumentNo: item.DocNum,
        PostingDate: item.CreationDate,
        Status: item.DocumentStatus,
        DocumentLines: item.DocumentLines,
      }));
      settableData(tableconfig);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await dispatch(
          fetchCustomerOrder({ top: pageSize, skip: 0 })
        ).unwrap();
        console.log("fetchinitial", res);
        const initialData = res.data.map((item) => ({
          DocEntry: item.DocEntry,
          CustomerCode: item.CardCode,
          CustomerName: item.CardName,
          DocumentNo: item.DocNum,
          DocumentLines: item.DocumentLines,
          PostingDate: item.CreationDate,
          Status: item.DocumentStatus,
        }));
        settableData(initialData);
        setPage(1);
      } catch (err) {
        console.error("Initial load failed", err);
      }
    };

    fetchInitial();
  }, []);

 
  const [viewItem, setViewItem] = useState([]);

  const navigate = useNavigate();
  const [layout, setLayout] = useState("OneColumn");
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const onRowSelect = (e) => {
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
  const ManageSalesOrderTableCols = [
    ...(ManageSalesOrderTableColumn &&
      ManageSalesOrderTableColumn.length &&
      ManageSalesOrderTableColumn.map((col) => {
        return {
          Header: col.Header,
          accessor: col.accessor,
        };
      })),
  ];
  const editRow = async (rowData) => {
    console.log("rowData", rowData);
    navigate("/SalesOrder/edit/" + formId + "/" + rowData.DocEntry);
  };
  const viewRow = async (rowData) => {
    console.log("rowData", rowData);
    navigate("/SalesOrder/view/" + formId + "/" + rowData.DocEntry);
  };

  const columns = useMemo(
    () => [
      ...ManageSalesOrderTableCols,
      {
        Header: "Actions",
        accessor: ".",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 200,

        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          const docLines = row.original?.DocumentLines;

          const isRowDisabled = Array.isArray(docLines)
            ? docLines.every((line) => Number(line?.Quantity) === 0)
            : Number(docLines?.Quantity) === 0;
          return (
            <FlexBox
              alignItems="Center"
              direction="Row"
              justifyContent="Center"
            >
              <Button
                icon="edit"
                disabled={isOverlay || isRowDisabled}
                design="Transparent"
                onClick={() => {
                  editRow(row.original);
                }}
                // onClick={() => editRow(row)}
              />
              {/* <Button
                icon="sap-icon://delete"
                disabled={isOverlay}
                design="Transparent"

                onClick={() => {
                  handleDelete(row.original)
                }}
              /> */}
              <Button
                icon="sap-icon://show"
                //disabled={isOverlay || isRowDisabled}
                design="Transparent"
                onClick={() => {
                  //setLayout("TwoColumnsMidExpanded");
                  viewRow(row.original);
                  //setViewItem(row.original);
                }}
                // onClick={() => editRow(row)}
              />
              <Button
                icon="sap-icon://navigation-right-arrow"
                //disabled={isOverlay || isRowDisabled}
                design="Transparent"
                onClick={() => {
                  setLayout("TwoColumnsMidExpanded");
                  //viewRow(row.original)
                  setViewItem(row.original);
                }}
                // onClick={() => editRow(row)}
              />
            </FlexBox>
          );
        },
      },
    ],
    [ManageSalesOrderTableCols]
  );

  const disabledCellStyle = {
    opacity: 0.5,
    pointerEvents: "none", // prevents clicks inside cell
    userSelect: "none",
  };
  const columnsWithRowWrap = useMemo(() => {
    return columns.map((col) => {
      const originalCell = col.Cell;

      return {
        ...col,
        // new Cell wrapper which calls the original renderer (if exists)
        Cell: (instance) => {
          const { row } = instance;
          const docLines = row.original?.DocumentLines || [];

          // disable if ALL Quantities are zero
          const isRowDisabled =
            Array.isArray(docLines) &&
            docLines.length > 0 &&
            docLines.every((line) => Number(line?.Quantity) === 0);

          // compute style for this row (apply only when disabled)
          const style = isRowDisabled ? disabledCellStyle : {};

          // if originalCell exists, render it and wrap its result
          if (typeof originalCell === "function") {
            // render original cell (it may return JSX)
            const originalRendered = originalCell(instance);

            // wrap it — keep layout (block-level wrapper)
            return <div style={style}>{originalRendered}</div>;
          }

          // otherwise fallback to showing the raw cell value
          const value = instance.value ?? row.original?.[col.accessor] ?? "";
          return <div style={style}>{String(value)}</div>;
        },
      };
    });
  }, [columns]);
  const handleChange = (e, fieldname) => {
    // Extract current value (from UI5 component)
    const value = e.detail?.item?.innerHTML || e.detail?.value || "";
    console.log("handledata", value);
    // If you're tracking both dates in state
    setFilters((prev) => {
      const updatedFilters = { ...prev, [fieldname]: value };
      console.log("updatedFilters", updatedFilters);
      // When both dates are available — filter tableData by CreationDate
      if (updatedFilters.FromDate && updatedFilters.ToDate) {
        const from = new Date(updatedFilters.FromDate);
        const to = new Date(updatedFilters.ToDate);

        const filteredList =
          tableData?.filter((item) => {
            const itemDate = new Date(item.PostingDate); // change field if needed
            console.log("itemDate", itemDate, item);
            return itemDate >= from && itemDate <= to;
          }) || [];

        settableData(filteredList);
        console.log("Filtered by date:", filteredList);
      }

      // For other (non-date) fields, run your text-based filter
      else if (fieldname !== "FromDate" && fieldname !== "ToDate") {
        const filteredList =
          tableData?.filter((item) =>
            item[fieldname]
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          ) || [];

        settableData(filteredList);
        console.log("Filtered by field:", filteredList);
      }

      return updatedFilters;
    });
  };

  const { formId, childId } = useParams();
  const [formConfig, setFormConfig] = useState(null);

  // if (!formConfig) return <div>Loading form...</div>;
    useEffect(() => {
      if (formId) {
        // Fetch form data based on formId
        const formDetails = user?.Roles?.flatMap((role) =>
          role.UserMenus.flatMap((menu) =>
            menu.children.filter((submenu) => submenu.Form.id === formId)
          )
        );
        //setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);
        setFormDetails(formDetails);
      } else {
        navigate("/");
      }
    }, [formId]);
  return (
    <div>
      <TopNav />
            {/* <Title onClick={() => navigate(`SalesOrder1`)}>sales</Title> */}
      
      <DynamicPage
        footerArea={
          <Bar
            style={{ padding: 0.5 }}
            design="FloatingFooter"
            endContent={
              <>
                <Button design="Positive">Accept</Button>
                <Button design="Negative">Reject</Button>
              </>
            }
          />
        }
        headerArea={
          <DynamicPageHeader>
            <FlexBox
              direction="Row"
              style={{
                display: "inline-flex",
                alignItems: "end",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              {console.log(
                "ManageSalesOderHeaderField",
                ManageSalesOderHeaderField
              )}
              {ManageSalesOderHeaderField.map((field) => {
                const filteredData = {
                  inputType: field.input_type,
                  DisplayName: field.display_name,
                  FieldName: field.field_name,
                };

                return (
                  <HeaderFilterBar
                    key={field.field_name}
                    field={filteredData}
                    tableData={tableData}
                    settableData={settableData}
                    handleChange={handleChange}
                    filters={filters}
                    setFilters={setFilters}
                    customerorder={customerorder}
                    isClearFilter={isClearFilter}
                    setisClearFilter={setisClearFilter}
                  />
                );
              })}
              <Button
                style={{ width: "100px", marginBottom: "2px" }}
                onClick={() => {
                  setisClearFilter(true);
                  settabledata(customerorder);
                  setFilters({
                    FromDate: "",
                    ToDate: "",
                  });
                }}
              >
                Clear Filter
              </Button>

            </FlexBox>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
        style={{
          height: "700px",
        }}
        titleArea={
          <DynamicPageTitle
            breadcrumbs={
              <Breadcrumbs
                design="Standard"
                separators="Slash"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
              >
                <BreadcrumbsItem data-route="/UserDashboard">
                  Home
                </BreadcrumbsItem>
                <BreadcrumbsItem>{formDetails&&formDetails[0]?.name?formDetails[0]?.name:"Sales order List"}</BreadcrumbsItem>
              </Breadcrumbs>
            }
            heading={<Title >{formDetails&&formDetails[0]?.name?formDetails[0]?.name:"Sales order List"}</Title>}
            snappedHeading={<Title>{formDetails&&formDetails[0]?.name?formDetails[0]?.name:"Sales order List"}</Title>}
          ></DynamicPageTitle>
        }
      >
        <div className="tab">
          <div>
            <FlexibleColumnLayout
              // style={{ height: "600px" }}
              layout={layout}
              startColumn={
                <FlexBox direction="Column">
                  <div>
                    <FlexBox direction="Column">
                      <AnalyticalTable
                        columns={columns}
                        data={tableData}
                        // header={`(Sales Order - ${tableData.length})`}
                        rowStyle={(row) => {
                          const docLines = row.original?.DocumentLines || [];
                          const allQtyZero =
                            Array.isArray(docLines) &&
                            docLines.length > 0 &&
                            docLines.every((l) => Number(l?.Quantity) === 1);
                          return allQtyZero
                            ? { backgroundColor: "#fafafa" }
                            : {};
                        }}
                        header={
                          <FlexBox
                            justifyContent="SpaceBetween"
                            alignItems="Center"
                            style={{ width: "100%", padding: "4px 10px" }}
                          >
                            <Title
                              style={{ minWidth: "150px" }}
                            >{`(Sales Order - ${tableData.length})`}</Title>
                            <Toolbar
                              design="Transparent"
                              style={{ border: "none" }}
                            >
                              <ToolbarButton
                                design="Default"
                                onClick={() =>
                                  navigate("/SalesOrder/create/" + formId)
                                }
                                text="Create"
                              />
                            </Toolbar>
                          </FlexBox>
                        }
                        loading={page === 0 && loading}
                        showOverlay={page === 0 && loading}
                        noDataText={
                          loading ? "Loading data..." : "No data found!"
                        }
                        sortable
                        filterable
                        visibleRows={10}
                        // visibleRowCountMode="Fixed"
                        minRows={6}
                        scaleWidthMode="Smart"
                        groupBy={[]}
                        groupable
                        // header="Table Title"
                        infiniteScroll
                        onGroup={() => {}}
                        onLoadMore={async () => {
                          if (isLoadingMore || allLoaded) return;

                          setIsLoadingMore(true);

                          try {
                            const res = await dispatch(
                              fetchCustomerOrder({
                                top: pageSize,
                                skip: page * pageSize,
                              })
                            ).unwrap();

                            if (res.length < pageSize) {
                              setAllLoaded(true);
                            }

                            const newRecords = res.map((item) => ({
                              DocEntry: item.DocEntry,
                              CustomerCode: item.CardCode,
                              CustomerName: item.CardName,
                              DocumentNo: item.DocNum,
                              PostingDate: item.CreationDate,
                              Status: item.DocumentStatus,
                            }));

                            settableData((prev) => [...prev, ...newRecords]);
                            setPage((prev) => prev + 1);
                          } catch (error) {
                            console.error("Load more failed", error);
                          } finally {
                            setIsLoadingMore(false);
                          }
                        }}
                        onRowClick={(event) => {
                          console.log("Row::", event.detail.row.original._id);
                          //previewFormInModal(event.detail.row.original._id);
                        }}
                        onRowExpandChange={() => {}}
                        onSort={() => {}}
                        onTableScroll={() => {}}
                        selectionMode="SingleSelect"
                        selectionBehavior="RowOnly"
                        // tableHooks={[AnalyticalTableHooks.useManualRowSelect("isSelected")]}
                        // markNavigatedRow={markNavigatedRow}
                        onRowSelect={onRowSelect}
                        // withRowHighlight
                        // adjustTableHeightOnPopIn
                        rowHeight={40}
                        headerRowHeight={50}
                        // retainColumnWidth
                        // alternateRowColor
                        withNavigationHighlight
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
                        <Title level="H5">Preview Sales Order</Title>
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
                    <ViewSalesOrder viewItem={viewItem} />
                    {/* <BusyIndicator active={formPreviewLoading}>
                      <PreviewForm
                        //open={openPreviewFormModal}
                        formDefinition={formDefinition}
                        // handleClose={handleClose}
                      />
                    </BusyIndicator> */}
                  </div>
                </Page>
              }
            />
          </div>
        </div>
      </DynamicPage>
    </div>
  );
};

export default ManageSalesOrder;
