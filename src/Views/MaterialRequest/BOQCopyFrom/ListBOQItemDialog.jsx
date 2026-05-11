import {
  AnalyticalTable,
  Button,
  Dialog,
  FlexBox,
} from "@ui5/webcomponents-react";
import React, { useMemo, useState } from "react";

const ListBOQItemDialog = (props) => {
  const { openListBOQItem,setOpenListBOQItem, setOpen, selectedBOQList, saveItem,saveService,type } = props;
  const [rowSelection, setRowSelection] = useState([]);
  console.log("boqtype",type)
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
        accessor: "U_ItemCode",
      
      },
      
     
      {
        Header: "Item Description",
        accessor: "U_Desc",
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
        Header: "Item Code",
        accessor: "U_ItemCode",
      },
      
     
      {
        Header: "Item Description",
        accessor: "U_Desc",
      },
    ],
    [],
  );
  return (
    <Dialog
      headerText="Content Details"
      open={openListBOQItem}
      onAfterClose={() => setOpenListBOQItem(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {    
              setOpenListBOQItem(false);
            }}
          >
            Close
          </Button>

          <Button
            onClick={() => {
              setOpen(false);
              console.log("rowselectionsave", rowSelection);
              setOpenListBOQItem(false);
              saveItem(Object.values(rowSelection))
            }}
          >
            Choose
          </Button>
        </FlexBox>
      }
      style={{ width: "50vw" }}
    >
      {console.log("selectedBOQList", selectedBOQList)}
      <AnalyticalTable
        data={selectedBOQList}
        columns={type === "Item" ? itemcolumns : servicecolumns}
        header={`Items (${selectedBOQList.length})`}
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

export default ListBOQItemDialog;
