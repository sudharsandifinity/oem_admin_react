import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrderItems } from "../../../store/slices/CustomerOrderItemsSlice";
import { set } from "react-hook-form";

const Contents = (props) => {
  const { orderItems, loading, rowSelection, setRowSelection, itemdata, setitemData } =
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

  const [itemForm, setItemForm] = useState([]);
  const [serviceData, setServiceData] = useState(servicedata);
  const [serviceForm, setserviceForm] = useState([]);
  const [viewItem, setViewItem] = useState([]);
  const [viewService, setViewService] = useState([]);

  const addItem = () => { };
  const [layout, setLayout] = useState("OneColumn");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchOrderItems()).unwrap();

        console.log("resusers", res);
        if (res.value?.length > 0) {
          const tableconfig = res.value.map((item) => ({
            ItemCode: item.ItemCode,
            ItemName: item.ItemName
          }));
          setitemData(tableconfig);
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
        .filter(
          (col) => col.accessor !== "SLNo" && col.accessor !== "itemCode" && col.accessor !== "itemName"
        )
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
        width: 250
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
        )
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
        )
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

  return (
    <div>
      <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <Title level="H4">Type - Items</Title>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() { }}
        onTitleToggle={function Xs() { }}
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
                  <div>
                    <AnalyticalTable
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
                    />
                    {/* <Itemtable
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
                      /> */}
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
        </div>
      </DynamicPage>


    </div>
  );
};

export default Contents;
