import {
  AnalyticalTable,
  Button,
  Dialog,
  FlexBox,
} from "@ui5/webcomponents-react";
import React, { useMemo, useState } from "react";
import ListBOQItemDialogDialog from "./ListBOQItemDialog";
import ListBOQItemDialog from "./ListBOQItemDialog";
//import ListPurItemDialog from "./ListPurItemDialog";

const BOQListDialog = (props) => {
  const { open, setOpen, boqrequestList, saveItem, type, saveService } = props;
  const [rowSelection, setRowSelection] = useState([]);
  const [openListBOQItem, setOpenListBOQItem] = useState(false);
  const [selectedBOQList, setSelectedBOQList] = useState([]);
  const onitemchildRowSelect = (e) => {
    console.log("e.detail.row.original", e.detail.row);
    if (e.detail.allRowsSelected) {
      Object.values(e.detail.rowsById).map((rowid) => {
        const rowId = rowid.id; //original.slno;
        const isSelected = rowid.isSelected;
        setRowSelection((prev) => {
          const updated = { ...prev };
          console.log("onitemrowselect", rowId, isSelected, updated);

          updated[rowId] = rowid.original;

          return updated;
        });
      });
    }else  if (e.detail.allRowsSelected===false&&!e.detail.row){
      setRowSelection([])
    } else {
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
    }
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
        Header: "Creator Code",
        accessor: "Creator",
      },
      {
        Header: "Create Date ",
        accessor: "CreateDate",
      },
      {
        Header: "Document Date",
        accessor: "U_DocDate",
      },
    ],
    [],
  );
  return (
    <>
      <Dialog
        headerText="BOQ List"
        open={open}
        onAfterClose={() => setopen(false)}
        footer={
          <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
            <Button onClick={() => setOpen(false)}>Close</Button>

            <Button
              onClick={() => {
                //setOpen(false);
                console.log("rowselectionsave", rowSelection);
                setOpenListBOQItem(true);
                setSelectedBOQList(
                  Object.values(rowSelection).flatMap(
                    (req) => req.HLB_BOQT1Collection || [],
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
        style={{ width: "70vw" }}
      >
        {console.log("boqrequestList", boqrequestList)}
        <AnalyticalTable
          data={boqrequestList}
          columns={itemcolumns}
          //header={`Items (${boqrequestList.length})`}
          selectionMode="Multiple"
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
      <ListBOQItemDialog
        openListBOQItem={openListBOQItem}
        setOpenListBOQItem={setOpenListBOQItem}
        setOpen={setOpen}
        selectedBOQList={selectedBOQList}
        saveItem={saveItem}
        saveService={saveService}
        type={type}
      />
    </>
  );
};

export default BOQListDialog;
