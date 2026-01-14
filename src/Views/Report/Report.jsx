import {
  AnalyticalTable,
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  ComboBox,
  ComboBoxItem,
  DatePicker,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  FlexibleColumnLayout,
  Label,
  Page,
  Title,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCustomerOrderById } from "../../store/slices/CustomerOrderSlice";
import { fetchSalesQuotationById } from "../../store/slices/SalesQuotationSlice";
import { fetchPurchaseOrderById } from "../../store/slices/PurchaseOrderSlice";
import { fetchPurchaseQuotationById } from "../../store/slices/PurchaseQuotation";
import { fetchPurchaseRequestById } from "../../store/slices/PurchaseRequestSlice";

const Report = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
  
  const [inputValue, setInputValue] = React.useState({});
  const [generalData, setgeneralData] = React.useState([]);
  const [originalGeneralData, setOriginalgeneralData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const { user } = useSelector((state) => state.auth);
  const authUserMenus = user
    ? user.Roles.map((role) => role.UserMenus).flat()
    : [];

  const handleFilterChange = async (e, fieldname) => {
    const selectedOption = e.target; //e.detail.selectedOption;

    console.log("handleFilterChange", e.target.id,e.target.value,selectedOption);
    

    if (!selectedOption) return;
    const value = selectedOption.value;

    setInputValue((prev) => ({
      ...prev,
      [fieldname]: value,
    }));
    // Filter generalData based on inputValue
    const filteredData = originalGeneralData.filter((data) => {
      return Object.keys(inputValue).every((key) => {
        if (key === fieldname) {
          return data[key]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
        const filterValue = inputValue[key];
        return data[key]
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    });
    let orderListById = "";

    const selectedText = selectedOption?.text;     // Menu name
    const selectedId = selectedOption?.value;
    console.log(selectedOption,selectedId,selectedText)
    // ✅ Fetch based on form type
    switch (selectedText) {
      case "Sales Order":
        orderListById = await dispatch(fetchCustomerOrderById(selectedId)).unwrap();
        break;

      case "Sales Quotation":
        orderListById = await dispatch(fetchSalesQuotationById(selectedId)).unwrap();
        break;

      case "Purchase Order":
        orderListById = await dispatch(fetchPurchaseOrderById(selectedId)).unwrap();
        break;
      case "Purchase Quotation":
        orderListById = await dispatch(fetchPurchaseQuotationById(selectedId)).unwrap();
        break;
      case "Purchase Request":
        orderListById = await dispatch(fetchPurchaseRequestById(selectedId)).unwrap();
        break;
      default:
        console.warn("Unknown form:", selectedText);
        return;
    }
    console.log("orderListById", orderListById);
    setgeneralData(filteredData);
  };

  const columns = [
    // Define your table columns here
  ];
  const tableData = generalData; // Use the filtered data for the table

  const onRowSelect = (event) => {
    console.log("Selected Row::", event.detail.row.original);
  };
  useEffect(() => {
    // Fetch initial data here and set it to generalData and originalGeneralData
    const fetchData = async () => {
      setLoading(true);
      // Simulate data fetching
      const menulist = authUserMenus
        .map((menu) =>
          menu.children.map((child) => ({
            MenuItem: child.display_name,
            formId: child.formId,
            menuId: child.id,
          }))
        )
        .flat();
      const data = menulist; // Replace with actual fetched data
      console.log("menulist", data, authUserMenus);

      setgeneralData(data);
      setOriginalgeneralData(data);
      setLoading(false);
    };
    fetchData();
  }, []);
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
          <DynamicPageHeader>
            <FlexBox
              direction="Row"
              style={{
                display: "inline-flex",
                alignItems: "end",
                flexWrap: "wrap",
                gap: "30px",
              }}
            >
              <FlexBox direction="Column">
                {" "}
                <Label>Menu Item</Label>
                <ComboBox
                  filter
                  value={inputValue.MenuItem || ""}
                  onChange={(e) =>handleFilterChange(e, "MenuItem")}
                  placeholder="Search Menu Item..."
                >
                  {originalGeneralData.map((data, idx) => (
                    <ComboBoxItem key={idx} text={data.MenuItem} value={data.menuId} />
                  ))}
                </ComboBox>
              </FlexBox>
              <FlexBox direction="Column">
                {" "}
                <Label>Document Number</Label>
                <ComboBox
                  filter
                  value={inputValue.CardName || ""}
                  onChange={(e) => handleFilterChange(e, "CardName")}
                  placeholder="Search Card Name..."
                >
                  {originalGeneralData.map((data, idx) => (
                    <ComboBoxItem key={idx} text={data.CardName} />
                  ))}
                </ComboBox>
              </FlexBox>
              <FlexBox direction="Column">
                {" "}
                <Label>From Date</Label>
                <DatePicker
                  name={inputValue.FieldName}
                  value={inputValue[inputValue.FieldName]}
                  onChange={(e) => handleChange(e, inputValue.FieldName)}
                />
              </FlexBox>
              <FlexBox direction="Column">
                {" "}
                <Label>To Date</Label>
                <DatePicker
                  name={inputValue.FieldName}
                  value={inputValue[inputValue.FieldName]}
                  onChange={(e) => handleChange(e, inputValue.FieldName)}
                />
              </FlexBox>
              {console.log("originalGeneralData", originalGeneralData)}
              <Button
                style={{ width: "100px" }}
                onClick={() => {
                  setgeneralData(originalGeneralData);
                  setInputValue({});
                }}
              >
                Clear Filter
              </Button>
            </FlexBox>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
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
                <BreadcrumbsItem data-route="/dashboard">Home</BreadcrumbsItem>
                <BreadcrumbsItem>Report</BreadcrumbsItem>
              </Breadcrumbs>
            }
            heading={<Title>Report</Title>}
            snappedHeading={<Title>Report</Title>}
          ></DynamicPageTitle>
        }
      >
        <div className="tab">
          <div>
            <FlexibleColumnLayout
              // style={{ height: "600px" }}
              startColumn={
                <FlexBox direction="Column">
                  <div>
                    <FlexBox direction="Column">
                      <AnalyticalTable
                        columns={columns}
                        data={tableData}
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
                            <Title style={{ minWidth: "150px" }}>List</Title>
                            <Toolbar
                              design="Transparent"
                              style={{ border: "none" }}
                            >
                              <ToolbarButton
                                design="Default"
                                icon="sap-icon://download"
                                text="Export"
                              />
                            </Toolbar>
                          </FlexBox>
                        }
                        loading={loading}
                        showOverlay={page === 0 && loading}
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
                        <Button icon="sap-icon://decline" title="close" />
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
                  ></div>
                </Page>
              }
            />
          </div>
        </div>
      </DynamicPage>
    </div>
  );
};

export default Report;
