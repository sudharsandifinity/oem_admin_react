import React, { useCallback, useContext, useMemo, useState } from "react";
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
    setitemData,handleitemRowChange,selectedRowIndex
  } = props;
  const [itemchildrowSelection, setitemChildRowSelection] = useState([]);
  const [tableData,settableData]=useState(itempopupData);
  const onitemchildRowSelect = (e) => {
    console.log("onRowSelect",itemdata,e.detail.row,e.detail.selected, e.detail.row.original);
    //selectionChangeHandler(e.detail.row.original);
    setitemChildRowSelection((prev) => ({
      ...prev,
      [e.detail.row.original.id]: e.detail.row.original,
    }));
  };
  const markNavigatedRow = useCallback(
    (row) => {
      return itemchildrowSelection?.id === row.id;
    },
    [itemchildrowSelection]
  );
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
        //Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
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
      {
        Header: "Quantity",
        accessor: "quantity",
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
              setitemChildRowSelection((prev) => {
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
              setitemChildRowSelection((prev) => {
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
      
    ],
    []
  );
  return (
    <Dialog
      headerText="Item Details"
      open={addItemdialogOpen}
      onAfterClose={() => setAddItemDialogOpen(false)}
      footer={
        <FlexBox direction="Row">
          <Button onClick={() => setAddItemDialogOpen(false)}>Close</Button>
       
          <Button
            onClick={() => {
              setAddItemDialogOpen(false);
              saveItem(itemchildrowSelection,selectedRowIndex)
            }}
          >
            Save
          </Button>
        </FlexBox>
      }
      style={{ width: "80%" }}
    >
      <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <Grid
              defaultIndent="XL0 L0 M0 S0"
              defaultSpan="XL3 L3 M6 S12"
              hSpacing="1rem"
              vSpacing="1rem"
            >
              {/* Custom Filter Field */}
              {ItemPopupFilterList.map((field) => ItemPopupFilter(field,itemdata,setitemData))}

              {/* <FlexBox justifyContent="end">
                <Button
                //onClick={handleSearch}
                >
                  Go
                </Button>
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
      >
        <div className="tab">
          <FlexBox direction="Column">
            <div>{console.log("rowSelection:::=?",itemchildrowSelection,itemdata)}
              <AnalyticalTable
                columns={itemcolumns.length > 0 ? itemcolumns : []}
                data={itemdata}
                header={"Items(" + itemdata.length + ")"}
                selectionMode="Multiple"
                onRowSelect={onitemchildRowSelect}
                selectedRowIds={Object.keys(itemchildrowSelection)}
 
                 markNavigatedRow={markNavigatedRow}
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage>
    </Dialog>
  );
};

export default Additemdialog;
