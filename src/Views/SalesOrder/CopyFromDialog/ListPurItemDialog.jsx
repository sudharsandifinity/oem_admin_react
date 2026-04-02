import {
  AnalyticalTable,
  Button,
  Dialog,
  FlexBox,
} from "@ui5/webcomponents-react";
import React, { useMemo, useState } from "react";

const ListPurItemDialog = (props) => {
  const { openPurchaseItem,setOpenPurchaseItem, setOpen, selectedPurList, saveItem,saveService,type } = props;
  const [rowSelection, setRowSelection] = useState([]);
  console.log("purtype",type)
  const onitemchildRowSelect = (e) => {

    console.log("e.detail.row.original", e.detail.row);
    const rowId = e.detail.row.id; //original.slno;
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
  const itemcolumns = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Document Entry",
        accessor: "DocEntry",
      },
      {
        Header: "Item Code",
        accessor: "ItemCode",
      
      },
      
     
      {
        Header: "Item Description",
        accessor: "ItemDescription",
      },
    ],
    [],
  );
   const servicecolumns = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Document Entry",
        accessor: "DocEntry",
      },
      {
        Header: "Account Code",
        accessor: "AccountCode",
      },
      
     
      {
        Header: "Item Description",
        accessor: "ItemDescription",
      },
    ],
    [],
  );
  return (
    <Dialog
      headerText="Content Details"
      open={openPurchaseItem}
      onAfterClose={() => setOpenPurchaseItem(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {    
              setOpenPurchaseItem(false);
            }}
          >
            Close
          </Button>

          <Button
            onClick={() => {
              setOpen(false);
              console.log("rowselectionsave", rowSelection);
              setOpenPurchaseItem(false);
              type === "Item" ? saveItem(Object.values(rowSelection)) : saveService(Object.values(rowSelection));
            }}
          >
            Choose
          </Button>
        </FlexBox>
      }
      style={{ width: "50vw" }}
    >
      {console.log("selectedPurList", selectedPurList)}
      <AnalyticalTable
        data={selectedPurList}
        columns={type === "Item" ? itemcolumns : servicecolumns}
        header={`Items (${selectedPurList.length})`}
        selectionMode="MultiSelect"
        selectedRowIds={rowSelection}
        onRowSelect={onitemchildRowSelect}
        visibleRows={6}
        style={{
          border: "1px solid #ccc" /* keeps a grey outline */,
          borderRadius: "4px",
          padding: "0.25rem",
        }}
      />
    </Dialog>
  );
};

export default ListPurItemDialog;
