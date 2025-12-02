import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormConfigContext } from "../../../Components/Context/FormConfigContext";
import {
  AnalyticalTable,
  Bar,
  Button,
  Card,
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrderItems } from "../../../store/slices/CustomerOrderItemsSlice";
import { set } from "react-hook-form";
import { fetchOrderServices } from "../../../store/slices/CustomerOrderServiceSlice";
import { fetchfreightDetails, fetchPurOrderAddDetails } from "../../../store/slices/salesAdditionalDetailsSlice";


const Contents = (props) => {
  const {
    form,
    orderItems,
    loading,
    rowSelection,
    setRowSelection,
    mode,
    itemdata,
    setitemData,
    setitemTableData,
    itemTabledata,
    servicedata,
    setserviceData,
    setserviceTableData,
    serviceTabledata,
    type,setType,setTotalFreightAmount
  } = props;
  const {
    fieldConfig,
    CustomerDetails,
    DocumentDetails,
    itemTableColumn,
    serviceTableColumn,
    itemData,
    //servicedata,
  } = useContext(FormConfigContext);
  const tableRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const placeholderRows = Array(5).fill({
    ItemCode: "Loading...",
    ItemName: "Loading...",
    quantity: "-",
    amount: "-",
  });
  console.log("orderitem", orderItems);
 
  const [addItemdialogOpen, setAddItemDialogOpen] = useState(false);
  const [addServiceDialogOpen, setAddServicedialogOpen] = useState(false);
  const [taxData,setTaxData]=useState([]);
  const [freightData,setFreightData]=useState([]);
  const [isFreightTableVisible, setIsFreightTableVisible] = useState(false);
  
  const [itemForm, setItemForm] = useState([]);
  const [serviceForm, setserviceForm] = useState([]);
  const [viewItem, setViewItem] = useState([]);
  const [viewService, setViewService] = useState([]);
  const [inputvalue, setInputValue] = useState("");
  const productCollection = [
    { Name: "Laptop" },
    { Name: "Mouse" },
    { Name: "Keyboard" },
    { Name: "Monitor" },
  ];

  const addItem = () => {};
  const [layout, setLayout] = useState("OneColumn");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchOrderItems()).unwrap();
          const purTaxCode = await dispatch(fetchPurOrderAddDetails()).unwrap();
        console.log("resusersfetchitems", res, itemdata,purTaxCode);
       
       const freightData = await dispatch(fetchfreightDetails()).unwrap();
                 setFreightData(freightData.value); if (res.value?.length > 0) {
          const tableconfig = res.value.map((item, index) => ({
            slno: index,
            ItemCode: item.ItemCode,
            ItemName: item.ItemName,
          }));
          mode === "create" && setitemData(tableconfig);
        }
        if(purTaxCode.value?.length>0){
          setTaxData(purTaxCode.value);
        }
       
        const serviceorder = await dispatch(fetchOrderServices()).unwrap();
        console.log("serviceorder",serviceorder)
         if (res.value?.length > 0) {
          const tableconfig = serviceorder.value.map((item, index) => ({
            slno: index,
            ServiceCode: item.Code,
            ServiceName: item.Name,
          }));
          mode === "create" && setserviceData(tableconfig);
        }
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
        // .filter(
        //   (col) =>
        //     col.accessor !== "ItemCode"
        // )
        .map((col) => ({
          Header: col.Header,
          accessor: col.accessor,
        }))),
  ];
  const dynamcicServiceCols = [
    ...(serviceTableColumn &&
      serviceTableColumn.length &&
      serviceTableColumn
        // .filter(
        //   (col) =>
        //     col.accessor !== "ItemCode"
        // )
        .map((col) => ({
          Header: col.Header,
          accessor: col.accessor,
        }))),
  ];

  const itemcolumns = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "slno", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Item Name",
        accessor: "ItemName",
        width: 250,
      },
      {
        Header: "Item Code",
        accessor: "ItemCode",
        width: 250,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        width: 250,
        Cell: ({ row, value }) => (
          <Input
            type="Number"
            value={value || ""}
            // onInput={(e) => {
            //   const newValue = e.target.value;
            //   setitemData((prev) =>
            //     prev.map((r, idx) =>
            //       idx === Number(row.id) ? { ...r, quantity: newValue } : r
            //     )
            //   );
            // }}
            onInput={(e) => {
              const newValue = e.target.value;
              setitemData((prev) =>
                prev.map((r, idx) =>
                  idx === Number(row.id) ? { ...r, Quantity: newValue } : r
                )
              );

              // also update rowSelection
              setRowSelection((prev) => {
                const updated = { ...prev };
                if (updated[row.id]) {
                  updated[row.id] = { ...updated[row.id], Quantity: newValue };
                }
                return updated;
              });
            }}
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        width: 250,
        Cell: ({ row, value }) => (
          <Input
            type="Number"
            value={value || ""}
            // onInput={(e) => {
            //   const newValue = e.target.value;
            //   setitemData((prev) =>
            //     prev.map((r, idx) =>
            //       idx === Number(row.id) ? { ...r, amount: newValue } : r
            //     )
            //   );
            // }}
            onInput={(e) => {
              const newValue = e.target.value;
              setitemData((prev) =>
                prev.map((r, idx) =>
                  idx === Number(row.id) ? { ...r, UnitPrice: newValue } : r
                )
              );

              // also update rowSelection
              setRowSelection((prev) => {
                const updated = { ...prev };
                if (updated[row.id]) {
                  updated[row.id] = { ...updated[row.id], UnitPrice: newValue };
                }
                return updated;
              });
            }}
          />
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
        width: 100,
        Cell: (instance) => {
          const { cell, row, webComponentsReactProperties } = instance;
          const isOverlay = webComponentsReactProperties.showOverlay;
          return (
            <FlexBox alignItems="Center">
              {/* <Button
                icon="edit"
                disabled={isOverlay}
                design="Transparent"
                onClick={() => setLayout("TwoColumnsMidExpanded")}
              /> */}
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
    [setitemData, layout]
  );
  const [selectedServices, setSelectedServices] = useState({});
  const saveService = (item) => {
    setSelectedServices(rowSelection);
    console.log("itemForm", itemForm, item);
    setserviceTableData((prev) => {
      let updated = [...prev];
      console.log("updated", updated);
      // Remove the last row if it's an empty placeholder
      if (updated[updated.length - 1]?.ServiceCode === "") {
        updated.pop();
      }
let nextSlno =
      updated.length > 0 ? updated[updated.length - 1].slno + 1 : 0;

      // Convert to array if item is object form like {0: {...}, 1: {...}}
      const newItems = Array.isArray(item) ? item : Object.values(item);

      newItems.forEach((newItem) => {
      updated.push({
        ...newItem,
        slno: nextSlno, 
      });
      nextSlno++; 
    });

      return updated;
    });
  };
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const [selectedItems, setSelectedItems] = useState({});
  // const saveItem = (item, index) => {
  //   setSelectedItems(rowSelection);
  //   console.log("itemForm", itemForm, item);
  //   setitemTableData((prev) => {
  //     let updated = [...prev];

  //     // Remove the last row if it's an empty placeholder
  //     if (updated[updated.length - 1]?.ItemCode === "") {
  //       updated.pop();
  //     }

  //     // Convert to array if item is object form like {0: {...}, 1: {...}}
  //     const newItems = Array.isArray(item) ? item : Object.values(item);

  //     // ✅ Append new items instead of replacing
  //     updated = [...updated, ...newItems];

  //     return updated;
  //   });

  // };
const saveItem = (item, index) => {
  setSelectedItems(rowSelection);

  setitemTableData((prev) => {
    let updated = [...prev];

    if (updated.length > 0 && updated[updated.length - 1]?.ItemCode === "") {
      updated.pop();
    }

    let nextSlno =
      updated.length > 0 ? updated[updated.length - 1].slno + 1 : 0;

    const newItems = Array.isArray(item) ? item : Object.values(item);

    newItems.forEach((newItem) => {
      updated.push({
        ...newItem,
        slno: nextSlno, 
      });
      nextSlno++; 
    });

    return updated;
  });
}
  const handleitemRowChange = (item) => {
    console.log("handleitemRowChange", item);
  };
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

  return (
    <div>
      {/* <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <Title level="H4">Type - Items</Title>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
        style={{
          height: "600px",
        }}
      > */}
      {/* <div className="tab"> */}
        <Card>
          <FlexBox direction="Column" style={{padding: '40px 30px', gap: '20px'}}>
            <FlexBox alignItems="Center">
              <Label style={{minWidth: "200px"}}>Item/Service Type:</Label>
              <Select value={type} style={{width: "200px"}} >
                <Option onClick={() => setType("Item")}>Item</Option>
                <Option onClick={() => setType("Service")}>Service</Option>
              </Select>
            </FlexBox>
            <div>
              <FlexibleColumnLayout
                // style={{ height: "600px" }}
                layout={layout}
                startColumn={
                  <FlexBox direction="Column">
                    <div>
                      {/* <AnalyticalTable
                          data={loading ? placeholderRows : itemdata ? itemdata : []}
                          columns={itemcolumns}
                          groupBy={[]}
                          scaleWidthMode="Smart"
                          visibleRows={5}
                          selectionMode="MultiSelect"
                          selectedRowIds={rowSelection&&Object.keys(rowSelection)}  // 👈 ensures rows are preselected
                          onRowSelect={(e) => onRowSelect(e)}
                          rowHeight={44}
                          headerRowHeight={48}
                        /> */}
                      {console.log("itemTabledata", itemTabledata, itemdata,type)}
                      {type === "Item" ? (
                        <Itemtable
                          addItemdialogOpen={addItemdialogOpen}
                          setAddItemDialogOpen={setAddItemDialogOpen}
                          itemTableColumn={itemTableColumn}
                          renderIteminput={renderIteminput}
                          form={form}
                          handleChange={handleChange}
                          setRowSelection={setRowSelection}
                          rowSelection={rowSelection}
                          saveItem={saveItem}
                          itemdata={itemdata}
                          setitemData={setitemData}
                          setitemTableData={setitemTableData}
                          itemTabledata={itemTabledata}
                          dynamcicItemCols={dynamcicItemCols}
                          selectedRowIndex={selectedRowIndex}
                          setSelectedRowIndex={setSelectedRowIndex}
                          mode={mode}
                          selectedItems={selectedItems}
                          taxData={taxData}
                          setTaxData={setTaxData}
                          freightData={freightData}
                          setFreightData={setFreightData}
                          setIsFreightTableVisible={setIsFreightTableVisible}
                          isFreightTableVisible={isFreightTableVisible}
                          setTotalFreightAmount={setTotalFreightAmount}
                        />
                      ) : (
                        <ServiceTable
                          addServiceDialogOpen={addServiceDialogOpen}
                          setAddServicedialogOpen={setAddServicedialogOpen}
                          serviceTableColumn={serviceTableColumn}
                          renderIteminput={renderIteminput}
                          form={form}
                          handleChange={handleChange}
                          setRowSelection={setRowSelection}
                          rowSelection={rowSelection}
                          saveService={saveService}
                          servicedata={servicedata}
                          setserviceData={setserviceData}
                          setserviceTableData={setserviceTableData}
                          serviceTabledata={serviceTabledata}
                          dynamcicServiceCols={dynamcicServiceCols}
                          selectedRowIndex={selectedRowIndex}
                          setSelectedRowIndex={setSelectedRowIndex}
                          mode={mode}
                          selectedServices={selectedServices}
                           taxData={taxData}
                          setTaxData={setTaxData}
                          freightData={freightData}
                          setFreightData={setFreightData}
                          setIsFreightTableVisible={setIsFreightTableVisible}
                          isFreightTableVisible={isFreightTableVisible}
                          setTotalFreightAmount={setTotalFreightAmount}
                        />
                      )}
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
                      <ItemViewPage viewItem={viewItem} />
                    </div>
                  </Page>
                }
              />
            </div>
          </FlexBox>
        </Card>
      {/* </div> */}
      {/* </DynamicPage> */}
    </div>
  );
};

export default Contents;
