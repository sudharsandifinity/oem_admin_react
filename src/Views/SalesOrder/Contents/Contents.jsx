import React, { useContext, useMemo, useRef, useState } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import {
  AnalyticalTable,
  Bar,
  Button,
  CheckBox,
  DatePicker,
  Dialog,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  FlexBox,
  FlexibleColumnLayout,
  Form,
  FormGroup,
  FormItem,
  Grid,
  Input,
  Label,
  List,
  ListItemStandard,
  MessageStrip,
  Option,
  Page,
  Select,
  SuggestionItem,
  Tag,
  Text,
  TextArea,
  Title,
  Toolbar,
  ToolbarButton,
} from "@ui5/webcomponents-react";
import Additemdialog from "./Item/Additemdialog";
import AddServiceDialog from "./Service/AddServiceDialog";
import ItemViewPage from "./Item/ItemViewPage";
import ServiceViewpage from "./Service/ServiceViewpage";
import Itemtable from "./Item/Itemtable";
import ServiceTable from "./Service/ServiceTable";

const Contents = (props) => {
  const { form, handleRowChange, addRow, deleteRow, SalesOrderRenderInput } =
    props;
  const {
    fieldConfig,
    CustomerDetails,
    DocumentDetails,
    itemTableColumn,
    serviceTableColumn,
    itemData,
    servicedata,
  } = useContext(FormConfigContext);
  const tableRef = useRef();
  const [companyCode, setCompanyCode] = useState("");
  const [customField, setCustomField] = useState("Item");
  const [addItemdialogOpen, setAddItemDialogOpen] = useState(false);
  const [addServiceDialogOpen, setAddServicedialogOpen] = useState(false);
  const [itemdata, setitemData] = useState(itemData);
  const [itemForm, setItemForm] = useState([]);
  const [serviceData, setServiceData] = useState(servicedata);
  const [serviceForm, setserviceForm] = useState([]);
  const [viewItem, setViewItem] = useState([]);
  const [viewService, setViewService] = useState([]);

  const addItem = () => {};
  const [layout, setLayout] = useState("OneColumn");
  const [rowSelection, setRowSelection] = useState({});

  const handleAdditemClick = () => {
    setAddItemDialogOpen(true);
  };
  const handleAddServiceClick = () => {
    setAddServicedialogOpen(true);
  };
  // Handle popup item click

  const onRowSelect = (e) => {
    console.log("onRowSelect", e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setRowSelection((prev) => ({
      ...prev,
      [e.detail.row.id]: e.detail.row.original,
    }));
  };
  const handleChange = (e, name, SelectedType) => {
    const value = e.target.value;
    // If the field is part of the "additional" section

    // Top-level fields
    if (SelectedType === "Item") {
      setItemForm({ ...itemForm, [name]: value });
    } else {
      setserviceForm({ ...serviceForm, [name]: value });
    }
  };

  const dynamcicItemCols = [
    ...(itemTableColumn &&
      itemTableColumn.length &&
      itemTableColumn
        .filter(
          (col) =>col.accessor!=="SLNo"&& col.accessor !== "itemCode" && col.accessor !== "itemName"
        )
        .map((col) => ({
          Header: col.Header,
          accessor: col.accessor,
        }))),
  ];
  const dynamcicServiceCols = [
    ...(serviceTableColumn &&
      serviceTableColumn.length &&
      serviceTableColumn
        .filter((col) => col.accessor !== "serviceCode"&&col.accessor!=="GLAccount"&&col.accessor!=="GLAccountName")
        .map((col) => ({
          Header: col.Header,
          accessor: col.accessor,
        }))),
  ];
  const itemcolumns = useMemo(
    () => [
      ...dynamcicItemCols,

      {
        Header: "Actions",
        accessor: ".",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 100,
        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
              <Button
                icon="edit"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => setLayout("TwoColumnsMidExpanded")}
              />
              <Button
                icon="sap-icon://navigation-right-arrow"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {
                  setLayout("TwoColumnsMidExpanded");
                  setViewItem(row.original);
                  setViewService([]);
                }}
              />
            </FlexBox>
          );
        },
      },
    ],
    [dynamcicItemCols]
  );
  const servicecolumns = useMemo(
    () => [
      ...dynamcicServiceCols,

      {
        Header: "Actions",
        accessor: ".",
        disableFilters: true,
        disableGroupBy: true,
        disableResizing: true,
        disableSortBy: true,
        id: "actions",
        width: 100,
        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
              <Button
                icon="edit"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {}}
              />
              <Button
                icon="sap-icon://navigation-right-arrow"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => {
                  setViewService(row.original);
                  setViewItem([]);
                  setLayout("TwoColumnsMidExpanded");
                }}
              />
            </FlexBox>
          );
        },
      },
    ],
    [dynamcicServiceCols]
  );
  const [inputvalue, setInputValue] = useState("");
  const productCollection = [
    { Name: "Laptop" },
    { Name: "Mouse" },
    { Name: "Keyboard" },
    { Name: "Monitor" },
  ];
  const renderIteminput = (field, form, handleChange, SelectedType) => {
    console.log("renderIteminputobject", field, form);
    //const value = form&&form[field.accessor] || "";
    switch (field.type) {
      case "text":
      case "number":
        return (
          <Input
            value={inputvalue}
            onInput={(e) => handleChange(e, field.accessor, SelectedType)}
            type={field.type}
          ></Input>
        );
      case "select":
        return (
          <Input
            value={inputvalue}
            onInput={(e) => handleChange(e, field.accessor, SelectedType)}
            type={field.type}
            style={{
              width: "470px",
            }}
          >
            {productCollection.map((item, idx) => (
              <SuggestionItem key={idx} text={item.Name} />
            ))}
          </Input>
        );
      case "date":
        return (
          <DatePicker
            value={inputvalue}
            onChange={(e) => handleChange(e, field.accessor, SelectedType)}
          />
        );
      case "checkbox":
        return (
          <CheckBox
            onChange={(e) => handleChange(e, field.FieldName)}
            text="CheckBox"
            valueState="None"
          />
        );
      case "selectdropdown":
        return (
          <Select
            onChange={function Xs() {}}
            onClose={function Xs() {}}
            onLiveChange={function Xs() {}}
            onOpen={function Xs() {}}
            valueState="None"
          >
            <Option>Option 1</Option>
            <Option>Option 2</Option>
            <Option>Option 3</Option>
            <Option>Option 4</Option>
            <Option>Option 5</Option>
          </Select>
        );
      case "textarea":
        return (
          <TextArea
            value={inputvalue}
            onInput={(e) => handleChange(e, field.accessor, SelectedType)}
          />
        );
      default:
        return null;
    }
  };
  // const saveItem = (item,index) => {
  //   console.log("itemForm", itemForm, item);
  //   setitemData((prev) => {
  //     const updated = [...prev];
  //     console.log("updated", updated);
  //     updated[updated.length - 1].itemCode === ""
  //       ? updated.pop()
  //       : updated.push(); // Remove last item
  //     return [...updated, ...(item ? Object.values(item) : itemForm)];
  //   });
  // };
  const saveItem = (item, index) => {
    console.log("itemForm", itemForm, item);
    setitemData((prev) => {
      const updated = [...prev];

      // Remove the last row if it's an empty placeholder
      if (updated[updated.length - 1]?.itemCode === "") {
        updated.pop();
      }

      // Convert to array if item is in object form like {0: {...}, 1: {...}}
      const newItems = Array.isArray(item) ? item : Object.values(item);

      // Replace the item at the given index
      newItems.forEach((newItem, i) => {
        updated[index + i] = newItem; // replaces existing or extends
      });

      return updated;
    });
  };

  const handleitemRowChange = (item) => {
    console.log("handleitemRowChange", item);
  };
  const saveService = (service, index) => {
    //setServiceData((prev) => [...prev, serviceForm]);
    console.log("serviceform", serviceForm, service);
    setServiceData((prev) => {
      const updated = [...prev];

      // Remove the last row if it's an empty placeholder
      if (updated[updated.length - 1]?.serviceCode === "") {
        updated.pop();
      }

      // Convert to array if item is in object form like {0: {...}, 1: {...}}
      const newServices = Array.isArray(service)
        ? service
        : Object.values(service);

      // Replace the item at the given index
      newServices.forEach((newItem, i) => {
        updated[index + i] = newItem; // replaces existing or extends
      });

      return updated;
    });
  };
  return (
    <div>
      <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <FlexBox direction="Row" style={{ gap: "20rem" }}>
              {/* Custom Filter Field */}
              <div>
                <Label>Currency: </Label>

                <Select
                //value={customField}
                //onChange={(e) => setCustomField(e.target.value)}
                >
                  <Option value="1">Local Currency</Option>
                  <Option value="2">$</Option>
                </Select>
              </div>
              <div>
                <Label>Item/Service Type: </Label>

                <Select
                  value={customField}
                  onChange={(e) => setCustomField(e.target.value)}
                >
                  <Option value="Item">Item</Option>
                  <Option value="Service">Service</Option>
                </Select>
              </div>

              {/* Basic Company Code Search */}

              {/* Basic Company Code Search */}
              <FlexBox direction="Row" gap={10}>
                {/* {customField === "Item" ? (
                   <Button onClick={handleAdditemClick}>Add Item</Button>
                  <></>
                ) : (
                  <Button onClick={handleAddServiceClick}>Add Service</Button>
                )} */}
              </FlexBox>
            </FlexBox>
            {/* <FlexBox style={{ marginTop: "10px" }}>Details</FlexBox> */}
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
        style={{
          height: "600px",
        }}
     
      >
        <div className="tab">
          <div>
            <FlexibleColumnLayout
              // style={{ height: "600px" }}
              layout={layout}
              startColumn={
                <FlexBox direction="Column">
                  {customField === "Item" ? (
                    <div>
                      {/* <AnalyticalTable
                        data={itemdata}
                        columns={itemcolumns}
                        groupBy={[]} // Optional: group by columns
                        scaleWidthMode="Smart"
                        visibleRows={5}
                        selectionMode="SingleSelect"
                      /> */}
                      <Itemtable
                        addItemdialogOpen={addItemdialogOpen}
                        setAddItemDialogOpen={setAddItemDialogOpen}
                        itemTableColumn={itemTableColumn}
                        renderIteminput={renderIteminput}
                        form={form}
                        handleChange={handleChange}
                        saveItem={saveItem}
                        itemdata={itemdata}
                        setitemData={setitemData}
                        dynamcicItemCols={dynamcicItemCols}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        {/* <AnalyticalTable
                          data={serviceData}
                          columns={servicecolumns}
                          groupBy={[]} // Optional: group by columns
                          scaleWidthMode="Smart"
                          visibleRows={5}
                          selectionMode="SingleSelect"
                        /> */}
                        <ServiceTable
                          dynamcicServiceCols={dynamcicServiceCols}
                          serviceTableColumn={serviceTableColumn}
                          renderIteminput={renderIteminput}
                          serviceData={serviceData}
                          setServiceData={setServiceData}
                          handleChange={handleChange}
                          saveService={saveService}
                        />
                      </div>
                    </>
                  )}
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
                    <ItemViewPage viewItem={viewItem} />
                    <ServiceViewpage viewService={viewService} />
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
      {/* <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <FlexBox direction="Column">
          <label
            style={{
              fontWeight: "bold", // makes text bold
              textAlign: "left", // ensures it can align right
              display: "block", // needed for textAlign to work
            }}
          >
            Total Summary
          </label>
          <br></br>
          <Grid
            defaultIndent="XL0 L0 M0 S0"
            defaultSpan="XL3 L3 M6 S12"
            hSpacing="2rem"
            vSpacing="2rem"
          >
            <label
              style={{
                // makes text bold
                textAlign: "center", // ensures it can align right
                display: "block", // needed for textAlign to work
              }}
            >
              Total Before Discount:
            </label>
            <Text>GBP 0.00</Text>
          </Grid>
          <Grid
            defaultIndent="XL0 L0 M0 S0"
            defaultSpan="XL3 L3 M6 S12"
            hSpacing="2rem"
            vSpacing="2rem"
          >
            <label>Discount:</label>
            <Input type="text"></Input>
          </Grid>
          <FlexBox direction="Row">
            <label>Freight:</label>
            <Text>GBP 0.00</Text>
          </FlexBox>
          <Grid
            defaultIndent="XL0 L0 M0 S0"
            defaultSpan="XL3 L3 M6 S12"
            hSpacing="2rem"
            vSpacing="2rem"
          >
            <label>Rounding:</label>
            <CheckBox></CheckBox>
          </Grid>
          <Grid
            defaultIndent="XL0 L0 M0 S0"
            defaultSpan="XL3 L3 M6 S12"
            hSpacing="1rem"
            vSpacing="1rem"
          >
            <label>Tax:</label>
            <Text></Text>
          </Grid>
          <Grid
            defaultIndent="XL0 L0 M0 S0"
            defaultSpan="XL3 L3 M6 S12"
            hSpacing="1rem"
            vSpacing="1rem"
          >
            <label>Total:</label>
            <Text></Text>
          </Grid>
        </FlexBox>
      </div> */}
      <Additemdialog
        addItemdialogOpen={addItemdialogOpen}
        setAddItemDialogOpen={setAddItemDialogOpen}
        itemTableColumn={itemTableColumn}
        renderIteminput={renderIteminput}
        form={form}
        handleChange={handleChange}
        saveItem={saveItem}
        setitemData={setitemData}
        handleitemRowChange={handleitemRowChange}
      />
      <AddServiceDialog
        addServiceDialogOpen={addServiceDialogOpen}
        setAddServicedialogOpen={setAddServicedialogOpen}
        serviceTableColumn={serviceTableColumn}
        renderIteminput={renderIteminput}
        form={form}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Contents;
