import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AnalyticalTable,
  Bar,
  Button,
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
  Icon,
  Input,
  Label,
  Option,
  Page,
  Select,
  Title,
} from "@ui5/webcomponents-react";
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";
import { ItemPopupFilter } from "./ItemPopup/ItemPopupFilter";

const Additemdialog = (props) => {
  const {
    fieldConfig,
    CustomerDetails,
    DocumentDetails,
    itemPopupTableColumn,
    ItemPopupFilterList,
    //itemData,
    itempopupData,
  } = useContext(FormConfigContext);
  const {
    addItemdialogOpen,
    setAddItemDialogOpen,
    itemTableColumn,
    renderIteminput,
    form,
    handleChange,
    saveItem,
    itemForm,
    itemdata,
    setitemData,
    handleitemRowChange,
    selectedRowIndex,
    itemTabledata,
    mode,
    itempopupdata,
    isAddnewRow,
    inputvalue,
    setInputValue,
  } = props;

  const [itemchildrowSelection, setitemChildRowSelection] = useState([]);
  const [rowSelection, setRowSelection] = useState([]);
  const [originalItemData, setOriginalItemData] = useState([]);
  // const onitemchildRowSelect = (e) => {
  //   console.log(
  //     "onRowSelect",
  //     itemdata,
  //     e.detail.row,
  //     e.detail.selected,
  //     e.detail.row.original
  //   );
  //   //selectionChangeHandler(e.detail.row.original);
  //   setRowSelection((prev) => ({
  //     ...prev,
  //     [e.detail.row.original.slno]: e.detail.row.original,
  //   }));
  // };
//   const onitemchildRowSelect = (e) => {
//   const row = e.detail.row.original;
//   const rowId = row.ItemCode; // stable unique id
//   const isSelected = e.detail.isSelected;

//   setRowSelection((prev) => {
//     const updated = { ...prev };

//     if (isSelected) {
//       updated[rowId] = row;
//     } else {
//       delete updated[rowId];
//     }

//     return updated;
//   });
// };

  const onitemchildRowSelect = (e) => {
    console.log("e.detail.row.original",e.detail.row)
    const rowId = e.detail.row.original.slno;
    const isSelected = e.detail.isSelected;
    setRowSelection((prev) => {
      const updated = { ...prev };
      console.log("onitemrowselect", rowId, isSelected, updated);
      if (isSelected) {
        // ✅ add selected row
        updated[rowId] = e.detail.row.original;
      } else {
        // ❌ remove deselected row
        delete updated[rowId];
      }

      return updated;
    });
  };

  useEffect(() => {
    if (addItemdialogOpen) {
      setOriginalItemData(itemdata); // backup (for reset/clear filter)
    }
  }, [addItemdialogOpen]);
  // useEffect(() => {
  //   if (mode === "edit" && itemTabledata && itemTabledata.length > 0) {
  //     const selected = {};
  //     itemTabledata.forEach((row) => {
  //       selected[row.id] = true; // use "id" field as key
  //     });
  //     setRowSelection(selected);
  //   }
  // }, [itemTabledata]);

  const dynamcicItemCols = [
    ...(itemTableColumn &&
      itemTableColumn.length &&
      itemTableColumn.map((col) => {
        return {
          Header: col.Header,
          accessor: col.accessor,
        };
      })),
  ];

  const itemcolumns = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Item Name",
        accessor: "ItemName",
      },
      {
        Header: "Item Code",
        accessor: "ItemCode",
      },
      // {
      //   Header: "Foriegn Name",
      //   accessor: "ForeignName",
      // },
      // {
      //   Header: "Quantity",
      //   accessor: "quantity",
      //   Cell: ({ row, value }) => (
      //     <Input
      //       type="Number"
      //       value={value || ""}

      //       onInput={(e) => {
      //         const newValue = e.target.value;
      //         setitemData((prev) =>
      //           prev.map((r, idx) =>
      //             idx === Number(row.id) ? { ...r, Quantity: newValue } : r
      //           )
      //         );

      //         setRowSelection((prev) => {
      //           const updated = { ...prev };
      //           if (updated[row.id]) {
      //             updated[row.id] = { ...updated[row.id], Quantity: newValue };
      //           }
      //           return updated;
      //         });
      //       }}

      //     />
      //   )
      // },
      // {
      //   Header: "Amount",
      //   accessor: "amount",
      //   Cell: ({ row, value }) => (
      //     <Input
      //       type="Number"
      //       value={value || ""}

      //       onInput={(e) => {
      //         const newValue = e.target.value;
      //         setitemData((prev) =>
      //           prev.map((r, idx) =>
      //             idx === Number(row.id) ? { ...r, UnitPrice: newValue } : r
      //           )
      //         );

      //         // also update rowSelection
      //         setRowSelection((prev) => {
      //           const updated = { ...prev };
      //           if (updated[row.id]) {
      //             updated[row.id] = { ...updated[row.id], UnitPrice: newValue };
      //           }
      //           return updated;
      //         });
      //       }}

      //     />
      //   )
      // },
    ],
    []
  );
  const data = [
    { ItemCode: "A001", ItemName: "Pen", Qty: 10 },
    { ItemCode: "A002", ItemName: "Pencil", Qty: 20 },
    { ItemCode: "A003", ItemName: "Book", Qty: 15 },
  ];

  const columns = [
    { Header: "Item Code", accessor: "ItemCode" },
    { Header: "Item Name", accessor: "ItemName" },
    { Header: "Quantity", accessor: "Qty" },
  ];

  // 🔹 Preselect specific rows (e.g., index 0 and 2)
  useEffect(() => {
    if (itemdata?.length && itemTabledata?.length) {
      const preselected = {};

      itemdata.forEach((row) => {
        const found = itemTabledata.find(
          (it) => it.ItemCode === row.ItemCode && it.ItemName === row.ItemName
        );
        if (found) {
          preselected[row.slno] = row;
        }
      });
      if (isAddnewRow) {
        setRowSelection([]);
      } else {
        setRowSelection(preselected);
      }
    }
  }, [itemdata, itemTabledata]);

  const clearFilter = () => {
    const clearedFilters = {};
    // ItemPopupFilterList.forEach((field) => {
    //   clearedFilters[field.name] = ""; // reset each input field
    // });
    setInputValue([]);
    setitemData(originalItemData);
  };
  return (
    <Dialog
      headerText="Item Details"
      open={addItemdialogOpen}
      onAfterClose={() => setAddItemDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setAddItemDialogOpen(false);
              setInputValue([]);
              setitemData(originalItemData);
            }}
          >
            Close
          </Button>

          <Button
            onClick={() => {
              setAddItemDialogOpen(false);
              saveItem(rowSelection, selectedRowIndex);
              setInputValue([]);
              setitemData(originalItemData);
            }}
          >
            Choose
          </Button>
        </FlexBox>
      }
      style={{ width: "40%" }}
    ><FlexBox direction="Column" style={{ height: "100%" }}>
  {/* Header Area */}
  <DynamicPageHeader>
    <FlexBox
      direction="Row"
      alignItems="Center"
      justifyContent="SpaceBetween"
    >
      <Grid
        defaultIndent="XL0 L0 M0 S0"
        defaultSpan="XL4 L4 M6 S12"
        hSpacing="1rem"
        vSpacing="1rem"
      >
        {ItemPopupFilterList.map((field) =>
          ItemPopupFilter(
            field,
            itemdata,
            setitemData,
            inputvalue,
            setInputValue
          )
        )}
      </Grid>

      <Button style={{ width: "100px" }} onClick={clearFilter}>
        Clear Filter
      </Button>
    </FlexBox>
  </DynamicPageHeader>

  {/* Table */}
  <div style={{ flex: 1, overflow: "hidden" }}>
    <AnalyticalTable
      data={itemdata}
      columns={itemcolumns}
      header={`Items (${itemdata.length})`}
      selectionMode="MultiSelect"
      selectedRowIds={rowSelection}
      onRowSelect={onitemchildRowSelect}
      visibleRows={10}
      style={{ height: "100%" }}
    />
  </div>
</FlexBox>
      {/* <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <FlexBox
              direction="Row"
              alignItems="Center"
              justifyContent="SpaceBetween"
            >
              <Grid
                defaultIndent="XL0 L0 M0 S0"
                defaultSpan="XL4 L4 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
              >
                {ItemPopupFilterList.map((field) =>
                  ItemPopupFilter(
                    field,
                    itemdata,
                    setitemData,
                    inputvalue,
                    setInputValue
                  )
                )}

               
              </Grid>
              <Button style={{ width: "100px" }} onClick={clearFilter}>
                Clear Filter
              </Button>
            </FlexBox>
          </DynamicPageHeader>
        }
        onPinButtonToggle={function Xs() {}}
        onTitleToggle={function Xs() {}}
        style={{
          height: "600px",
        }}
      >
        <div className="tab">
          <FlexBox direction="Column">
            <div>
             
           

              <AnalyticalTable
                data={itemdata}
                columns={itemcolumns}
                header={`Items (${itemdata.length})`}
                selectionMode="MultiSelect"
                selectedRowIds={rowSelection}
                onRowSelect={onitemchildRowSelect}

               
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage> */}
    </Dialog>
  );
};

export default Additemdialog;
