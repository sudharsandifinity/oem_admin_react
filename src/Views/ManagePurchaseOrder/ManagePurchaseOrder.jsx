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
import { fetchBusinessPartner, fetchVendorOrder } from "../../store/slices/VendorOrderSlice";



const ManagePurchaseOrder = () => {
  const {
    ManageSalesOrderTableColumn,
    ManageSalesOrderTableData,
    ManageSalesOderHeaderField,
  } = useContext(FormConfigContext);
  const dispatch = useDispatch();

  const { companyformfield } = useSelector((state) => state.companyformfield);
  const { companyformfielddata } = useSelector(
    (state) => state.companyformfielddata
  );
  const { vendororder, businessPartner, loading, error } = useSelector(
    (state) => state.vendororder
  );
  const [tableData, settableData] = useState([]);
  const placeholderRows = Array(5).fill({
    CustomerCode: "Loading...",
    CustomerName: "Loading...",
    DocumentNo: "-",
    PostingDate: "-",
    Status: "-",
  });
  const settabledata = (vendororder) => {
    if (vendororder?.length > 0) {
      const tableconfig = vendororder.map((item) => ({
        DocEntry:item.DocEntry,
        CustomerCode: item.CardCode,
        CustomerName: item.CardName,
        DocumentNo: item.DocNum,
        PostingDate: item.CreationDate,
        Status: item.DocumentStatus,
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
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchVendorOrder()).unwrap();
        dispatch(fetchBusinessPartner()).unwrap();

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
    fetchData();
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
    console.log("rowData", rowData)
    navigate("/PurchaseOrder/edit/" + formId+"/"+rowData.DocEntry
    );
  }
 const viewRow =async(rowData)=>{
     console.log("rowData", rowData)
    navigate("/PurchaseOrder/view/" + formId+"/"+rowData.DocEntry
    );
  }
  
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
          return (
            <FlexBox alignItems="Center" direction="Row" justifyContent="Center">
              <Button
                icon="edit"
                disabled={isOverlay}
                design="Transparent"

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
                               viewRow(row.original)
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
  const handleChange = (e) => {
    console.log("e", e);
  };
  const { formId, childId } = useParams();
  const [formConfig, setFormConfig] = useState(null);




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
            <FlexBox direction="Row">
              <Grid
                defaultIndent="XL0 L0 M1 S0"
                defaultSpan="XL3 L2 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
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
                    />
                  );
                })}

              </Grid>
              <Button style={{width:"100px"}}  onClick={() => settabledata(vendororder)} >Clear Filter</Button></FlexBox>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() { }}
        onTitleToggle={function Xs() { }}
        style={{
          height: "700px",
        }}
        titleArea={
          <DynamicPageTitle
            actionsBar={
              <Toolbar design="Transparent">
                <ToolbarButton
                  design="Emphasized"
                  onClick={() => navigate("/PurchaseOrder/create/" + formId)}
                  text="Create"
                />
              </Toolbar>
            }
            breadcrumbs={
              <Breadcrumbs design="Standard"
                separators="Slash"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}>
                <BreadcrumbsItem data-route="/UserDashboard">Home</BreadcrumbsItem>
                <BreadcrumbsItem>Manage Purchase Order</BreadcrumbsItem>
              </Breadcrumbs>
            }
            heading={
              <Title
                style={{ fontSize: "var(--sapObjectHeader_Title_FontSize)" }}
              >
                {/* {formConfig && formConfig.display_name} */}
                Manage Purchase Order
              </Title>
            }
            navigationBar={
              <Toolbar design="Transparent">
                <ToolbarButton onClick={() => navigate("/UserDashboard")} design="Transparent" icon="decline" />
              </Toolbar>
            }
            snappedHeading={
              <Title
                style={{
                  fontSize: "var(--sapObjectHeader_Title_SnappedFontSize)",
                }}
              >
                {/* {formConfig && formConfig.display_name} */}
                Manage Purchase Order
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
                    <FlexBox direction="Column">{console.log("tableDataanaly", tableData)}
                      <AnalyticalTable
                        columns={columns.length > 0 ? columns : []}
                        data={loading ? placeholderRows : tableData}
                        header={`(Purchase Order - ${tableData.length})`}
                        loading={loading}
                        showOverlay={loading}
                        noDataText={loading ? "Loading Purchase orders..." : "No Purchase orders found"}
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
                        onGroup={() => { }}
                        onLoadMore={() => { }}
                        onRowClick={(event) => {
                          console.log("Row::", event.detail.row.original._id);
                          //previewFormInModal(event.detail.row.original._id);
                        }}
                        onRowExpandChange={() => { }}
                        onSort={() => { }}
                        onTableScroll={() => { }}
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
