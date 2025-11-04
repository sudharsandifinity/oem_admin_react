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
import Moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { HeaderFilterBar } from "./HeaderFilterBar";
import ItemViewPage from "../PurchaseOrder/Contents/Item/ItemViewPage";
import ViewPurchaseOrder from "./ViewPurchaseOrder";
import { useDispatch, useSelector } from "react-redux";
import TopNav from "../../Components/Header/TopNav";
import {
  fetchBusinessPartner,
  fetchVendorOrder,
} from "../../store/slices/VendorOrderSlice";

const ManagePurchaseOrder = () => {
  const {
    ManageSalesOrderTableColumn,
    ManagePurchaseOrderTableColumn,
    ManageSalesOrderTableData,
    ManageSalesOderHeaderField,
  } = useContext(FormConfigContext);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    FromDate: "",
    ToDate: "",
  });

  const [isClearFilter, setisClearFilter] = useState(false);

  const { companyformfield } = useSelector((state) => state.companyformfield);
  const user = useSelector((state) => state.auth.user);

  const { companyformfielddata } = useSelector(
    (state) => state.companyformfielddata
  );
  const { vendororder, businessPartner, loading, error } = useSelector(
    (state) => state.vendororder
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

  const [tabList, setTabList] = useState([]);

  const settabledata = (vendororder) => {
    console.log("vendororderobject", vendororder);
    if (vendororder?.length > 0) {
      const tableconfig = vendororder.map((item) => ({
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
    settabledata(vendororder);
  }, [vendororder]);
  console.log("fetchVendorOrder", vendororder);
  useEffect(() => {
    //dispatch(fetchBranch());
    //dispatch(fetchCompanies());
    const fetchInitial = async () => {
      try {
        const res = await dispatch(fetchVendorOrder()).unwrap();
        dispatch(fetchBusinessPartner()).unwrap();
        const initialData = res.map((item) => ({
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
        console.log("resusers", res);
        setFormConfig(res);

        // setTableConfig(res);
        //dispatch(fetchcompanyformfielddata())
        //

        // setTableConfig(res);
        //dispatch(fetchcompanyformfielddata())
        //

        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchInitial();
  }, [dispatch]);
  // const ManageSalesOderHeaderField = companyformfield.filter(
  //   (c) => c.Form?.name === "M_SO"
  // );

  // useEffect(() => {
  //   //dispatch(fetchCompanyFormfields());
  //   const fetchData = async () => {
  //     try {
  //       const res = await dispatch(fetchCompanyFormfields()).unwrap();
  //       //dispatch(fetchcompanyformfielddata())
  //       console.log("resusers", res);

  //       if (res.message === "Please Login!") {
  //         navigate("/");
  //       }
  //     } catch (err) {
  //       console.log("Failed to fetch user", err.message);
  //       err.message && navigate("/");
  //     }
  //   };
  //   fetchData();
  // }, [dispatch]);
  // console.log("ManageSalesOderHeaderField", ManageSalesOderHeaderField);
  // const [tableData, settableData] = useState(ManageSalesOderHeaderField);
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
    ...(ManagePurchaseOrderTableColumn &&
      ManagePurchaseOrderTableColumn.length &&
      ManagePurchaseOrderTableColumn.map((col) => {
        return {
          Header: col.Header,
          accessor: col.accessor,
        };
      })),
  ];
  const editRow = async (rowData) => {
    console.log("rowData", rowData);
    navigate("/PurchaseOrder/edit/" + formId + "/" + rowData.DocEntry);
  };
  const viewRow = async (rowData) => {
    console.log("rowData", rowData);
    navigate("/PurchaseOrder/view/" + formId + "/" + rowData.DocEntry);
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
                design="Transparent"
                disabled={isOverlay || isRowDisabled}
                onClick={() => {
                  editRow(row.original);
                }}
                // onClick={() => editRow(row)}
              />
              <Button
                icon="sap-icon://show"
                disabled={isOverlay}
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
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {
                  setLayout("TwoColumnsMidExpanded");
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

  useEffect(() => {
    if (formId) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter((submenu) => submenu.Form.id === formId)
        )
      );
      setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);
      setFormDetails(formDetails);
    } else {
      navigate("/");
    }
  }, [formId]);

  // if (!formConfig) return <div>Loading form...</div>;
  return (
    <div>
      <TopNav />
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
                    customerorder={vendororder}
                    isClearFilter={isClearFilter}
                    setisClearFilter={setisClearFilter}
                  />
                );
              })}
              <Button
                style={{ width: "100px", marginBottom: "2px" }}
                onClick={() => {
                  setisClearFilter(true);
                  settabledata(vendororder);
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
                <BreadcrumbsItem>
                  {" "}
                  {formDetails[0]?.name
                    ? formDetails[0]?.name
                    : "Purchase Order"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            }
            heading={
              <Title
                style={{ fontSize: "var(--sapObjectHeader_Title_FontSize)" }}
              >
                {/* {formConfig && formConfig.display_name} */}
                {formDetails[0]?.name
                  ? formDetails[0]?.name + " List"
                  : "Purchase Order List"}
              </Title>
            }
            snappedHeading={
              <Title
                style={{
                  fontSize: "var(--sapObjectHeader_Title_SnappedFontSize)",
                }}
              >
                {/* {formConfig && formConfig.display_name} */}
                {formDetails[0]?.name
                  ? formDetails[0]?.name + " List"
                  : "Purchase Order List"}
              </Title>
            }
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
                      {console.log("tableDataanaly", tableData)}
                      <AnalyticalTable
                        columns={columns.length > 0 ? columns : []}
                        data={tableData}
                        //header={`(Purchase Order - ${tableData.length})`}
                        header={
                          <FlexBox
                            justifyContent="SpaceBetween"
                            alignItems="Center"
                            style={{ width: "100%", padding: "4px 10px" }}
                          >
                            <Title
                              style={{ minWidth: "200px" }}
                            >{`(Purchase Order - ${tableData.length})`}</Title>
                            <Toolbar
                              design="Transparent"
                              style={{ border: "none" }}
                            >
                              <ToolbarButton
                                design="Default"
                                onClick={() =>
                                  navigate("/PurchaseOrder/create/" + formId) 
                                }
                                text="Create"
                              />
                            </Toolbar>
                          </FlexBox>
                        }
                        loading={page === 0 && loading}
                        showOverlay={page === 0 && loading}
                        noDataText={
                          loading
                            ? "Loading Purchase orders..."
                            : "No Purchase orders found"
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
                              fetchVendorOrder({
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
                              DocumentLines: item.DocumentLines,
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
                        // selectedRowIds={{
                        //     3: true,
                        // }}
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
                        <Title level="H5">Preview Purchase Order</Title>
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
                    <ViewPurchaseOrder viewItem={viewItem} />
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

export default ManagePurchaseOrder;
