import {
  DatePicker,
  Dialog,
  Grid,
  Icon,
  List,
  ListItemStandard,
  SuggestionItem,
  TextArea,
} from "@ui5/webcomponents-react";
import React, { useContext, useMemo, useState } from "react";
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
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";
import { CustomerPopupFilterList } from "./CustomerPopupFilterList";

const RenderCustomerDialog = (props) => {
  const {
    fieldConfig,
    CustomerDetails,
    DocumentDetails,
    customerpopuptableColumns,customerTableValues,
    customerpopupFilter,
  } = useContext(FormConfigContext);
  const [companyCode, setCompanyCode] = useState("");
  const [customField, setCustomField] = useState("1");
   const[tableData,settableData]=useState(customerTableValues)
  const { customerdialogOpen, setCustomerDialogOpen, setInputValue } = props;
  const [layout, setLayout] = useState("OneColumn");
  const [value, setvalue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const productCollection = [
    { Name: "Person1" },
    { Name: "Person2" },
    { Name: "Person3" },
    { Name: "Person4" },
  ];

  const [rowSelection, setRowSelection] = useState({});

  const handleSearch = () => {};
  const handleDialogItemClick = (selectedItem) => {
    //const selectedItem = e.detail.item.textContent;
    console.log("selectedItem", selectedItem);
    setvalue(selectedItem);
    setDialogOpen(false);
  };
  const onRowSelect = (e) => {
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);

    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
   const dynamcicCustomerTableCols = [
    ...(customerpopuptableColumns &&
      customerpopuptableColumns.length &&
      customerpopuptableColumns.map((col) => {
        return {
          Header: col.Header,
          accessor: col.accessor,
        };
      })),
  ];
  const columns = useMemo(
    () => [
       ...dynamcicCustomerTableCols,
    ],
    []
  );
  const savecustomer = () => {
    const fieldNames = Object.values(rowSelection).map((val) => val.BPCode);
    setInputValue(Object.values(rowSelection));
  };
  const handleChange = () => {};

  

  return (
    <Dialog
      headerText="Business Partners"
      open={customerdialogOpen}
      resizable="true"
      onAfterClose={() => setCustomerDialogOpen(false)}
      footer={
        <FlexBox direction="Row">
          <Button onClick={() => setCustomerDialogOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              setCustomerDialogOpen(false);
              savecustomer();

              //setInputValue(prev => [...prev,Object.values(rowSelection).map(val=>val.DisplayName)])
            }}
          >
            Save
          </Button>
        </FlexBox>
      }
    >
      <div>
        <DynamicPage
          headerArea={
            <DynamicPageHeader>
              <Grid
                defaultIndent="XL0 L0 M0 S0"
                defaultSpan="XL3 L3 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
              >
                {customerpopupFilter.map((field) => CustomerPopupFilterList(field,tableData,settableData))}
                {/* Custom Filter Field */}
               {/* <FlexBox direction="Column">
                  <Label>Search</Label>

                  <Input
                    placeholder="Search..."
                    type="Search"
                    onInput={(e) =>
                      console.log("Search input:", e.target.value)
                    }
                    onChange={(e) =>
                      console.log("Search committed:", e.target.value)
                    }
                  />
                </FlexBox>

                <FlexBox direction="Column">
                  <Label>BP Code</Label>
                  <Input
                    icon={
                      <Icon
                        name="employee"
                        //onClick={() => handleValueHelpRequest(field.FieldName)}
                      />
                    }
                    placeholder="Enter BP code"
                    value={companyCode}
                    onInput={(e) => setCompanyCode(e.target.value)}
                  />
                </FlexBox>
                <FlexBox direction="Column">
                  <Label>BP name</Label>
                  <Input
                    icon={
                      <Icon
                        name="employee"
                        //onClick={() => handleValueHelpRequest(field.FieldName)}
                      />
                    }
                    placeholder="Enter BP Name"
                    value={companyCode}
                    onInput={(e) => setCompanyCode(e.target.value)}
                  />
                </FlexBox>

                <FlexBox direction="Column">
                  <Label>Business Partner Group</Label>
                  <Input
                    placeholder="Enter Business partner Group"
                    value={companyCode}
                    onInput={(e) => setCompanyCode(e.target.value)}
                  />
                </FlexBox>
                <FlexBox direction="Column">
                  <Label>DB Type</Label>
                  <Select
                    value={customField}
                    onChange={(e) => setCustomField(e.target.value)}
                  >
                    <Option value="1">ONE</Option>
                    <Option value="2">TWO</Option>
                    <Option value="3">THREE</Option>
                  </Select>
                </FlexBox>
                <FlexBox direction="Column">
                  <Label>BP Balance</Label>
                  <Input
                    placeholder="Enter Business partner Group"
                    value={companyCode}
                    onInput={(e) => setCompanyCode(e.target.value)}
                  />
                </FlexBox>
                <FlexBox justifyContent="end">
                  <Button onClick={handleSearch}>Go</Button>
                </FlexBox> */}
               
              </Grid>
              {/* Basic Company Code Search */}
            </DynamicPageHeader>
          }
          onPinButtonToggle={function Xs() {}}
          onTitleToggle={function Xs() {}}
          style={{
            height: "600px",
          }}
          titleArea={
            <DynamicPageTitle>
              <Title
                style={{
                  fontSize: "var(--sapObjectHeader_Title_SnappedFontSize)",
                }}
              >
                All Business partners
              </Title>
            </DynamicPageTitle>
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
                      <AnalyticalTable
                        columns={columns.length > 0 ? columns : []}
                        data={tableData}
                        header={"Business Partners(" + fieldConfig.length + ")"}
                         selectionMode="Single" 

                        onRowSelect={onRowSelect}
                      />
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
                        startContent={<Title level="H5">Preview Form</Title>}
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
    </Dialog>
  );
};

export default RenderCustomerDialog;
