import {
  AnalyticalTable,
  Button,
  Dialog,
  FlexBox,
} from "@ui5/webcomponents-react";
import React, { useMemo, useState } from "react";
import ListPurItemDialog from "./ListPurItemDialog";

const CopyFromDialog = (props) => {
  const { open, setOpen, requestList, saveItem,type,saveService } = props;
  const [rowSelection, setRowSelection] = useState([]);
  const [openPurchaseItem, setOpenPurchaseItem] = useState(false);
  const [selectedPurList, setSelectedPurlist] = useState([]);
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
        Header: "Requester Code",
        accessor: "Requester",
      },
      {
        Header: "Document Date ",
        accessor: "DocDate",
      },
      {
        Header: "Delivery Date",
        accessor: "DocDueDate",
      },
    ],
    [],
  );
  return (
    <>
      <Dialog
        headerText="Request Details"
        open={open}
        onAfterClose={() => setopen(false)}
        footer={
          <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </Button>

            <Button
              onClick={() => {
                //setOpen(false);
                console.log("rowselectionsave", rowSelection);
                setOpenPurchaseItem(true);
                setSelectedPurlist(
                  Object.values(rowSelection).flatMap(
                    (req) => req.DocumentLines || [],
                  ),
                );
                // saveItem(
                //   Object.values(rowSelection).flatMap(
                //     (req) => req.DocumentLines || [],
                //   ),
                // );
              }}
            >
              Choose
            </Button>
          </FlexBox>
        }
        style={{ width: "70vw",minHeight: "70vh", }}
      >
        {console.log("requestList", requestList)}
        <AnalyticalTable
          data={requestList}
          columns={itemcolumns}
          header={`Items (${requestList.length})`}
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
      <ListPurItemDialog
        openPurchaseItem={openPurchaseItem}
        setOpenPurchaseItem={setOpenPurchaseItem}
        setOpen={setOpen}
        selectedPurList={selectedPurList}
        saveItem={saveItem}
        saveService={saveService}
        type={type}
      />
    </>
  );
};

export default CopyFromDialog;
