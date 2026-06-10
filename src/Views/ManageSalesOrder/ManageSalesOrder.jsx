import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  BusyIndicator,
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
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { HeaderFilterBar } from "./HeaderFilterBar";
import ItemViewPage from "../SalesOrder/Contents/Item/ItemViewPage";
import ViewSalesOrder from "./ViewSalesOrder";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import "@ui5/webcomponents-icons/dist/show.js";
import { fetchSalesQuotations } from "../../store/slices/SalesQuotationSlice";
import { fetchPurchaseOrder } from "../../store/slices/purchaseorderSlice";
import { fetchPurchaseQuotation } from "../../store/slices/PurchaseQuotation";
import { fetchPurchaseRequest } from "../../store/slices/PurchaseRequestSlice";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { fetchPurchaseDeliveryNotes } from "../../store/slices/purDeliveryNoteSlice";
import { fetchMaterialRequest } from "../../store/slices/materialRequestSlice";
import { fetchARInvoices } from "../../store/slices/ARInvoice";
import { fetchPRInvoices } from "../../store/slices/APInvoice";

const ManageSalesOrder = () => {
  const {
    ManageSalesOrderTableColumn,
    ManageSalesOrderTableData,
    ManageSalesOderHeaderField,
    ManagePurchaseOrderTableColumn,
  } = useContext(FormConfigContext);
  const dispatch = useDispatch();
  const location = useLocation().pathname.split("/")[1];
  const { formId, childId } = useParams();

  const [filters, setFilters] = useState({
    FromDate: "",
    ToDate: "",
  });
  const [tableLoading, setTableLoading] = useState(true);
  const [isClearFilter, setisClearFilter] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [apiError, setApiError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const { companyformfield } = useSelector((state) => state.companyformfield);
  const { companyformfielddata } = useSelector(
    (state) => state.companyformfielddata,
  );
  const { customerorder, businessPartner, loading, error } = useSelector(
    (state) => state.customerorder,
  );
  const [tableData, settableData] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const [originalCustomerData, setOriginalCustomerData] = useState([]); // to store original data for reset/clear filter
  const title = formDetails?.[0]?.name || formId || "Sales order List";
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
        ProjectCode: item.U_PrjCode,
        ProjectName: item.U_PrjDesc,
        DocumentNo: item.DocNum,
        PostingDate: item.CreationDate,
        Status: item.DocumentStatus,
        DocumentLines: item.DocumentLines,
      }));
      settableData(tableconfig);
    }
  };
  const fetchLoadMoreData = async () => {
    console.log(" formDetails[0]?.name", formDetails[0]?.name);
    try {
      let res = "";
      if (formDetails[0]?.name === "Sales Order") {
        await dispatch(
          fetchCustomerOrder({ top: pageSize, skip: page * pageSize }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Sales Quotation") {
        res = await dispatch(
          fetchSalesQuotations({ top: pageSize, skip: page * pageSize }),
        ).unwrap();
      } else if (
        formDetails[0]?.name === "Purchase Order" ||
        formDetails[0]?.name === "Purchase Orders"
      ) {
        res = await dispatch(
          fetchPurchaseOrder({ top: pageSize, skip: page * pageSize }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Quotation") {
        const purRes = await dispatch(
          fetchPurchaseQuotation({ top: pageSize, skip: page * pageSize }),
        ).unwrap();

        const data = purRes?.data?.value ?? purRes?.data ?? purRes ?? [];

        res =
          location === "Contracting-Management"
            ? data.filter((item) => item.U_MRNo !== null && item.U_MRNo !== "")
            : data.filter((item) => item.U_MRNo === null || item.U_MRNo === "");
      } else if (formDetails[0]?.name === "GRPO") {
        res = await dispatch(
          fetchPurchaseDeliveryNotes({ top: pageSize, skip: page * pageSize }),
        ).unwrap();
      } else if (formDetails[0]?.name === "BOQ") {
        // res = await dispatch(
        //   fetchPurchaseDeliveryNotes({ top: pageSize, skip: 0 }),
        // ).unwrap();
        res = [];
      } else if (formDetails[0]?.name === "Material Request") {
        res;
        await dispatch(
          fetchMaterialRequest({ top: pageSize, skip: page * pageSize }),
        ).unwrap();
      }
      console.log("materialrequestres", res, formDetails[0]?.name);
      if (res.length < pageSize) {
        setAllLoaded(true);
      }
      const raw = res?.data?.value ?? res?.data ?? res?.value ?? res;

      // Ensure it's an array
      const list = Array.isArray(raw)
        ? raw
        : raw
          ? [raw] // if it's single object
          : []; // if null or undefined
      const newRecords = list.map((item) => ({
        DocEntry: item.DocEntry,
        CustomerCode: item.CardCode || item.Requester || item.Creator,
        CustomerName: item.CardName || item.RequesterName || item.Creator,
        ProjectCode: item.U_PrjCode,
        ProjectName: item.U_PrjDesc,
        MRNO: item.U_MRNo || null,
        DocumentNo: item.DocNum,
        MRNO: item.U_MRNo || "",
        DocumentLines: item.DocumentLines,
        PostingDate:
          item.CreationDate || item.CreateDate
            ? new Date(
                item.CreationDate || item.CreateDate,
              ).toLocaleDateString()
            : "-",
        Status:
          item.DocumentStatus === "so_Open"
            ? "Open"
            : "Closed" || item.Status === "O"
              ? "Open"
              : "Closed",
      }));

      settableData((prev) => [...prev, ...newRecords]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Load more failed", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    console.log("formdetails", formDetails);
    setTableLoading(true);
    const fetchInitial = async () => {
      try {
        let res = "";
        if (formDetails[0]?.name === "Sales Order") {
          res = await dispatch(
            fetchCustomerOrder({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (formDetails[0]?.name === "Sales Quotation") {
          res = await dispatch(
            fetchSalesQuotations({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (
          formDetails[0]?.name === "Purchase Order" ||
          formDetails[0]?.name === "Purchase Orders"
        ) {
          res = await dispatch(
            fetchPurchaseOrder({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (formDetails[0]?.name === "Purchase Quotation") {
          res = await dispatch(
            fetchPurchaseQuotation({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (formDetails[0]?.name === "Purchase Request") {
          const purRes = await dispatch(
            fetchPurchaseRequest({
              top: pageSize,
              skip: 0,
            }),
          ).unwrap();

          const data =
            purRes?.data?.value ?? purRes?.data ?? purRes.value ?? purRes ?? [];

          res =
            location === "Contracting-Management"
              ? data.filter(
                  (item) => item.U_MRNo !== null && item.U_MRNo !== "",
                )
              : data.filter(
                  (item) => item.U_MRNo === null || item.U_MRNo === "",
                );
        } else if (formDetails[0]?.name === "GRPO") {
          res = await dispatch(
            fetchPurchaseDeliveryNotes({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (formDetails[0]?.name === "BOQ") {
          // res = await dispatch(
          //   fetchPurchaseDeliveryNotes({ top: pageSize, skip: 0 }),
          // ).unwrap();
          res = "";
        } else if (formDetails[0]?.name === "Material Request") {
          res = await dispatch(
            fetchMaterialRequest({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (formDetails[0]?.name === "A/R Invoice") {
          res = await dispatch(
            fetchARInvoices({ top: pageSize, skip: 0 }),
          ).unwrap();
        } else if (formDetails[0]?.name === "A/P Invoice") {
          res = await dispatch(
            fetchPRInvoices({ top: pageSize, skip: 0 }),
          ).unwrap();
        }

        console.log(
          "quotationdatasales",
          res,
          "customerorder",
          customerorder,
          formDetails[0]?.name,
        );
        const raw = res?.data?.value ?? res?.data ?? res?.value ?? res;
        setTotalRecords(res?.["@odata.count"]);
        // Ensure it's an array
        const list = Array.isArray(raw)
          ? raw
          : raw
            ? [raw] // if it's single object
            : []; // if null or undefined

        const initialData = list.map((item) => ({
          DocEntry: item.DocEntry,
          CustomerCode: item.CardCode || item.Requester || item.Creator,
          CustomerName: item.CardName || item.RequesterName || item.Creator,
          ProjectCode: item.U_PrjCode,
          ProjectName: item.U_PrjDesc,
          MRNO: item.U_MRNo || null,
          DocumentNo: item.DocNum,
          MRNO: item.U_MRNo || null,
          DocumentLines: item.DocumentLines,
          PostingDate:
            item.CreationDate || item.CreateDate
              ? new Date(
                  item.CreationDate || item.CreateDate,
                ).toLocaleDateString()
              : "-",
          Status:
            item.DocumentStatus === "so_Open"
              ? "Open"
              : "Closed" || item.Status === "O"
                ? "Open"
                : "Closed",
        }));

        settableData(initialData);
        setOriginalCustomerData(initialData); // store original data for reset
        setPage(1);
        if (res.message === "Please Login!") {
          navigate("/login");
        }
      } catch (err) {
        console.log("Err object:", err);

        // Safely read status
        const statusCode = err?.status || err?.response?.status || 0;
        const message = err?.message || "Failed to load data";

        console.error("c    :", statusCode, "Message:", message);
        setApiError(message);

        // If 401, redirect to login
        if (statusCode === 401) {
          navigate("/login");
        }
        setApiError(err.message || "Failed to load data");
      } finally {
        setTableLoading(false);
      }
    };

    fetchInitial();
  }, [formDetails]);

  const [viewItem, setViewItem] = useState([]);

  const navigate = useNavigate();
  const [layout, setLayout] = useState("OneColumn");
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [allLoaded, setAllLoaded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (e) => {
    console.log("first", e.detail);
    const { selectedRowIds, rowsById } = e.detail;

    const selectedRows = Object.keys(selectedRowIds).map(
      (rowId) => rowsById[rowId].original,
    );

    setSelectedRows(selectedRows);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Data to export
    const exportData = selectedRows.length > 0 ? selectedRows : tableData; // fallback to full table

    const tableColumnHeaders = [
      "CustomerCode",
      "CustomerName",
      "DocEntry",
      "DocumentNo",
      "PostingDate",
      "Status",
    ];

    const tableRows = exportData.map((row) => [
      row.CustomerCode,
      row.CustomerName,
      row.DocEntry,
      row.DocumentNo,
      row.PostingDate,
      row.Status,
    ]);

    doc.text(formDetails[0]?.name + " Export", 14, 15);

    // ✅ Correct call using imported autoTable
    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableRows,
      startY: 20,
    });

    doc.save(formDetails[0]?.name + ".pdf");
  };
  // const ManageSalesOrderTableCols = [
  //   ...(ManageSalesOrderTableColumn &
  //     ManageSalesOrderTableColumn.length &&
  //     ManageSalesOrderTableColumn.map((col) => {
  //       return {
  //         Header: col.Header,
  //         accessor: col.accessor,
  //       };
  //     })),
  // ];
  const menuChildMap = user?.Roles?.flatMap((role) =>
    role.UserMenus?.map((menu) => {
      const matched = menu.children?.filter(
        (child) => child.formId || "o3p6JX1K8q" === formId,
      );

      if (matched?.length) {
        return {
          menuName: menu.name,
          childNames: matched.map((c) => c.name),
        };
      }

      return null;
    }).filter(Boolean),
  );
  {
    console.log(
      " menuChildMap[0] && menuChildMap[0].menuName",
      menuChildMap,
      location,
      formId,
    );
  }
  const currentMenuName = location;

  const matchedMenu = menuChildMap.find(
    (menu) => menu.menuName.replace(/\s+/g, "-") === currentMenuName,
  );
  const ManageProjectOrderTableColumn = [
    {
      Header: "Document Entry",
      accessor: "DocumentNo",
      type: "text",
    },

    {
      Header: "Project Code",
      accessor: "ProjectCode",
      type: "text",
    },

    {
      Header: "Project Name",
      accessor: "ProjectName",
      type: "text",
    },

    ...(formDetails[0]?.name !== "Material Request"
      ? [
          {
            Header: "MR NO",
            accessor: "MRNO",
            type: "text",
          },
        ]
      : []),

    {
      Header: "Posting Date",
      accessor: "PostingDate",
      type: "text",
    },
  ];
  const columnConfig = {
    Sales: ManageSalesOrderTableColumn,
    Purchase: ManagePurchaseOrderTableColumn,
    "Contracting Management": ManageProjectOrderTableColumn,
  };
  console.log(
    "ManagePurchaseOrderTableColumn",
    ManagePurchaseOrderTableColumn,
    columnConfig,
    "matchedMenu",
    matchedMenu,
  );
  const ManageSalesOrderTableCols = (
    columnConfig[matchedMenu?.menuName] || []
  ).map((col) => ({
    Header: col.Header,
    accessor: col.accessor,
  }));
  // const ManageSalesOrderTableCols =
  //   menuChildMap[0] && menuChildMap[0].menuName === "Purchase"
  //     ? ManagePurchaseOrderTableColumn?.map((col) => ({
  //         Header: col.Header,
  //         accessor: col.accessor,
  //       })) || []
  //     :( menuChildMap[0] && menuChildMap[0].menuName === "Contracting-Management"
  //       ? ManageProjectOrderTableColumn?.map((col) => ({
  //           Header: col.Header,
  //           accessor: col.accessor,
  //         })) || []
  //       : ManageSalesOrderTableColumn?.map((col) => ({
  //           Header: col.Header,
  //           accessor: col.accessor,
  //         })) || [])

  const editRow = async (rowData) => {
    console.log("rowData", rowData);
    title === "Material Request"
      ? navigate("/MaterialRequest/edit/" + formId + "/" + rowData.DocEntry)
      : navigate("/Order/edit/" + formId + "/" + rowData.DocEntry);
  };
  const viewRow = async (rowData) => {
    console.log("rowData", rowData);
    title === "Material Request" || title === "GRPO"
      ? navigate("/MaterialRequest/view/" + formId + "/" + rowData.DocEntry)
      : rowData.MRNO
        ? navigate("/MaterialRequest/view/" + formId + "/" + rowData.DocEntry)
        : navigate("/Order/view/" + formId + "/" + rowData.DocEntry);
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
              {formDetails[0]?.name !== "GRPO" &&
                row.original.MRNO === null && (
                  <Button
                    icon="edit"
                    //disabled={isOverlay || isRowDisabled}
                    design="Transparent"
                    onClick={() => {
                      editRow(row.original);
                    }}
                    // onClick={() => editRow(row)}
                  />
                )}
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
                design="Transparent"
                onClick={() => viewRow(row.original)}
              />
              <Button
                icon="sap-icon://navigation-right-arrow"
                //disabled={isOverlay || isRowDisabled}
                design="Transparent"
                onClick={() => {
                  setLayout("TwoColumnsMidExpanded");
                  //viewRow(row.original)

                  const viewitem = {
                    ...row.original,
                    ManageOrderTableCols: ManageSalesOrderTableCols.filter(
                      (col) => col.accessor !== "DocumentLines",
                    ).reduce((acc, col) => {
                      acc[col.Header] = row.original[col.accessor];
                      return acc;
                    }, {}),
                  };
                  console.log(
                    "viewRow",
                    viewitem,
                    ManageSalesOrderTableCols,
                    row.original,
                  );
                  setViewItem(viewitem.ManageOrderTableCols);
                }}
                // onClick={() => editRow(row)}
              />
            </FlexBox>
          );
        },
      },
    ],
    [ManageSalesOrderTableCols],
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
              .includes(value.toLowerCase()),
          ) || [];

        settableData(filteredList);
        console.log("Filtered by field:", filteredList);
      }

      return updatedFilters;
    });
  };

  const [formConfig, setFormConfig] = useState(null);

  // if (!formConfig) return <div>Loading form...</div>;
  useEffect(() => {
    if (!user) return;
    if (formId) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter(
            (submenu) => submenu.Form && submenu.Form.id === formId,
          ),
        ),
      );
      //setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);

      setFormDetails(formDetails);
    } else {
      navigate("/");
    }
  }, [user, formId]);
  const [showNoData, setShowNoData] = useState(false);

  useEffect(() => {
    let timer;

    if (!loading && tableData.length === 0) {
      timer = setTimeout(() => {
        setShowNoData(true);
      }, 2000);
    } else {
      setShowNoData(false);
    }

    return () => clearTimeout(timer);
  }, [loading, tableData]);

  return (
    <div style={{ width: "100%" }}>
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
          <DynamicPageHeader
            className="custom-header"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              //backgroundColor: "#354a5f", // SAP Blue
              // color: "white",
            }}
          >
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
                ManageSalesOderHeaderField,
                customerorder,
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
                    menuChildMap={menuChildMap}
                    setFilters={setFilters}
                    customerorder={customerorder}
                    isClearFilter={isClearFilter}
                    setisClearFilter={setisClearFilter}
                    formDetails={formDetails}
                    originalCustomerData={originalCustomerData}
                    setOriginalCustomerData={setOriginalCustomerData}
                  />
                );
              })}
              {console.log("originalCustomerData", originalCustomerData)}
              <Button
                design="Default"
                className="clear-filter-btn"
                style={{
                  width: "100px",
                  marginBottom: "2px",
                  //backgroundColor: "#1e6091"
                }}
                onClick={() => {
                  setisClearFilter(true);
                  settableData(originalCustomerData);
                  setFilters({
                    FromDate: "",
                    ToDate: "",
                  });
                }}
              >
                <div>Clear Filter</div>
              </Button>
            </FlexBox>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
        titleArea={
          <DynamicPageTitle
            className="custom-header"
            style={{
              display: "flex",
              alignItems: "start",
              padding: "1rem",
              width: "100%",
            }}
            breadcrumbs={
              <Breadcrumbs
                design="Standard"
                separators="Slash"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
              >
                <BreadcrumbsItem data-route="/dashboard">Home</BreadcrumbsItem>
                <BreadcrumbsItem>
                  {formDetails && formDetails[0]?.name
                    ? formDetails[0]?.name
                    : formId
                      ? formId
                      : "Sales order List"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            }
            // heading={
            //   <Title>
            //     {formDetails && formDetails[0]?.name
            //       ? formDetails[0]?.name
            //       : formId?formId:"Sales order List"}
            //   </Title>
            // }
            // snappedHeading={
            //   <Title>
            //     {formDetails && formDetails[0]?.name
            //       ? formDetails[0]?.name
            //       : formId?formId:"Sales order List"}
            //   </Title>
            // }
          ></DynamicPageTitle>
        }
      >
        <div className="tab">
          <div>
            {apiError && (
              <MessageStrip
                design="Negative"
                hideCloseButton={false}
                hideIcon={false}
                style={{ marginBottom: "1rem" }}
              >
                {"Data couldn’t be loaded. Refresh to retry."}
              </MessageStrip>
            )}
            <FlexibleColumnLayout
              // style={{ height: "600px" }}
              layout={layout}
              startColumn={
                <FlexBox direction="Column">
                  <div>
                    <FlexBox direction="Column">
                      {console.log(
                        "loading",
                        loading,
                        tableData,
                        "totalRecords",
                        totalRecords,
                        "title",
                        title,
                      )}
                      {console.log("customerorder1", customerorder)}
                      {tableLoading ? (
                        <FlexBox
                          justifyContent="Center"
                          alignItems="Center"
                          style={{ height: "500px", width: "100%" }}
                        >
                          <BusyIndicator active size="M" />
                        </FlexBox>
                      ) : (
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
                            return allQtyZero ? disabledCellStyle : {};
                          }}
                          header={
                            <FlexBox
                              justifyContent="SpaceBetween"
                              alignItems="Center"
                              style={{ width: "100%", padding: "4px 10px" }}
                            >
                              <Title style={{ minWidth: "200px" }}>
                                {`${title} List `}
                              </Title>
                              <Toolbar
                                design="Transparent"
                                style={{ border: "none" }}
                              >
                                {console.log("title", title)}
                                {location === "Contracting-Management" &&
                                formDetails[0]?.name === "Purchase Request" ? (
                                  <></>
                                ) : (
                                  <ToolbarButton
                                    design="default"
                                    onClick={() => {
                                      title === "Material Request" ||
                                      title === "GRPO"
                                        ? navigate(
                                            "/MaterialRequest/create/" +
                                              formId +
                                              "/" +
                                              (tableData.length > 0 &&
                                                tableData[0]?.DocEntry + 1),
                                          )
                                        : navigate(
                                            "/Order/create/" +
                                              formId +
                                              "/" +
                                              (tableData.length > 0 &&
                                                tableData[0]?.DocEntry + 1),
                                          );
                                    }}
                                    text="Create"
                                  />
                                )}
                                <ToolbarButton
                                  design="default"
                                  onClick={handleExportPDF}
                                  text="Export"
                                />
                              </Toolbar>
                            </FlexBox>
                          }
                          selectionMode="Multiple"
                          onRowSelect={handleRowSelect}
                          loading={tableLoading}
                          showOverlay={tableLoading}
                          noDataText={
                            tableLoading ? (
                              <BusyIndicator active size="S" />
                            ) : (
                              "No Data Found"
                            )
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

                            fetchLoadMoreData().finally(() =>
                              setIsLoadingMore(false),
                            );
                          }}
                          onRowExpandChange={() => {}}
                          onSort={() => {}}
                          onTableScroll={() => {}}
                          //selectionBehavior="RowOnly"
                          // tableHooks={[AnalyticalTableHooks.useManualRowSelect("isSelected")]}
                          // markNavigatedRow={markNavigatedRow}
                          // withRowHighlight
                          // adjustTableHeightOnPopIn
                          rowHeight={40}
                          headerRowHeight={50}
                          // retainColumnWidth
                          // alternateRowColor
                          withNavigationHighlight
                        />
                      )}
                      <div style={{ marginTop: "10px" }}>
                        <span>
                          {`Showing ${
                            tableData.length > 0
                              ? `1 to ${tableData.length} of ${totalRecords ?? tableData.length} entries`
                              : "0"
                          }`}
                        </span>
                      </div>
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
                        <Title level="H5">Preview {formDetails[0]?.name}</Title>
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
                    {console.log(
                      "ManageSalesOrderTableCols11",
                      ManageSalesOrderTableCols,
                    )}
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
