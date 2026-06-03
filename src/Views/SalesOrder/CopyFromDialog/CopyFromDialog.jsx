import {
  AnalyticalTable,
  Button,
  ComboBox,
  ComboBoxItem,
  Dialog,
  FlexBox,
  Label,
} from "@ui5/webcomponents-react";
import React, { useMemo, useState } from "react";
import ListPurItemDialog from "./ListPurItemDialog";

const CopyFromDialog = (props) => {
  const {
    open,
    setOpen,
    requestList,
    setRequestList,
    originalporequestList,
    inputValue,
    setInputValue,
    setOriginalporequestlist,
    saveItem,
    type,
    saveService,
    copyRequestDetails,
  } = props;
  const [rowSelection, setRowSelection] = useState([]);
  const [openPurchaseItem, setOpenPurchaseItem] = useState(false);
  const [selectedPurList, setSelectedPurlist] = useState([]);
  const [originalSelectedPurList, setOriginalSelectedPurList] = useState([]);
  const handleFilterChange = (e, fieldname) => {
    console.log("handleFilterChange", e.target.value);
    const selectedOption = e.target; //e.detail.selectedOption;
    if (!selectedOption) return;

    const selectedValue = selectedOption.value || selectedOption.textContent;
    console.log("Selected value:", selectedValue,fieldname);

    // ✅ Save selected value for that field
    setInputValue((prev) => ({
      ...prev,
      [fieldname]: selectedValue,
    }));

    // ✅ Optional filtering logic
    const filteredList = requestList.filter((item) =>
      item[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(selectedValue.toLowerCase()),
    );
console.log("filteredList", filteredList);
    setRequestList(filteredList);
  };
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
    } else if (e.detail.allRowsSelected === false && !e.detail.row) {
      setRowSelection([]);
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
  const clearFilter = () => {
    // Implement clear filter logic here
    setRequestList(originalporequestList);
    setInputValue({});
  };
  return (
    <>
      <Dialog
        headerText="Purchase Order List"
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
                setOriginalSelectedPurList(
                  Object.values(rowSelection).flatMap(
                    (req) => req.DocumentLines || [],
                  ),
                );
                copyRequestDetails(rowSelection);
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
        <FlexBox direction="Column">
          {/* <FlexBox direction="Row" style={{ padding: "0.5rem", gap: "2rem" }}> */}
          <FlexBox
            direction="Row"
            style={{
              display: "inline-flex",
              alignItems: "end",
              flexWrap: "wrap",
              gap: "15px",
              paddingBottom: "1rem",
            }}
          >
            <FlexBox direction="Column">
              <Label>Document Entry</Label>

              <ComboBox
                filter
                value={inputValue?.DocEntry || ""}
                onChange={(e) => handleFilterChange(e, "DocEntry")}
                placeholder="Search DocEntry..."
              >
                {originalporequestList?.map((data, idx) => (
                  <ComboBoxItem key={idx} text={String(data.DocEntry)} />
                ))}
              </ComboBox>
            </FlexBox>
            <FlexBox direction="Column">
              {" "}
              <Label>Requester Code</Label>
              <ComboBox
                filter
                value={inputValue?.Requester || ""}
                onChange={(e) => handleFilterChange(e, "Requester")}
                placeholder="Search Requester..."
              >
                {originalporequestList?.map((data, idx) => (
                  <ComboBoxItem key={idx} text={data.Requester} />
                ))}
              </ComboBox>
            </FlexBox>
            <Button style={{ width: "100px" }} onClick={clearFilter}>
              Clear Filter
            </Button>
          </FlexBox>
          {console.log("requestList", requestList,originalporequestList)}
          <AnalyticalTable
            data={requestList}
            columns={itemcolumns}
            //header={`Items (${requestList.length})`}
            selectionMode="Single"
            selectedRowIds={rowSelection}
            onRowSelect={onitemchildRowSelect}
            visibleRows={6}
            style={{
              border: "1px solid #ccc" /* keeps a grey outline */,
              borderRadius: "4px",
              padding: "0.25rem",
            }}
          />
        </FlexBox>
      </Dialog>
      <ListPurItemDialog
        openPurchaseItem={openPurchaseItem}
        setOpenPurchaseItem={setOpenPurchaseItem}
        setOpen={setOpen}
        selectedPurList={selectedPurList}
        setSelectedPurList={setSelectedPurlist}
        originalSelectedPurList={originalSelectedPurList}
        setOriginalSelectedPurList={setOriginalSelectedPurList}
        saveItem={saveItem}
        saveService={saveService}
         inputValue={inputValue}
  setInputValue={setInputValue}
        type={type}
      />
    </>
  );
};

export default CopyFromDialog;
