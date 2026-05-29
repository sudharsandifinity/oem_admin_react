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
//import ListPurItemDialog from "./ListPurItemDialog";

const openPurRequestItemsDialog = (props) => {
  const {
    open,
    setOpen,
    selectedPurRequestList,
    saveItem,
    type,
    saveService,
    originalSelectedPurRequestList,
    setOriginalboqrequestlist,
    inputValue,
    setSelectedPurRequestList,
    setInputValue,submitPurchaseRequest
  } = props;
  const [rowSelection, setRowSelection] = useState([]);
  const [openListBOQItem, setOpenListBOQItem] = useState(false);
  const [selectedBOQList, setSelectedBOQList] = useState([]);
  const [originalSelectedBOQList, setOriginalSelectedBOQList] = useState([]);
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
    const filteredList = selectedPurRequestList.filter((item) =>
      item[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(selectedValue.toLowerCase()),
    );
console.log("filteredList", filteredList);
    setSelectedPurRequestList(filteredList);
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
        Header: "Line Id",
        accessor: "LineId", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header:"Item Code",
        accessor:"ItemCode",
      },
      {
        Header:"Item Description",
        accessor:"ItemName",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },{
        Header: "Amount",
        accessor: "amount",
      },{
        Header: "Project Code",
        accessor: "project",
      },
      {
        Header: "Warehouse code",
        accessor: "warehouse",
      },
      {
        Header: "Remarks",
        accessor: "remarks",
      },

      {
        Header: "Item Description",
        accessor: "U_Desc",
      },
    ],
    [],
  );
  const clearFilter = () => {
    // Implement clear filter logic here
    setSelectedPurRequestList(originalSelectedPurRequestList);
    setInputValue({});
  };
  return (
    <>
      <Dialog
        headerText="Material Request Item List"
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
                submitPurchaseRequest(rowSelection);
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
                        <Label>Item Code</Label>
            
                        <ComboBox
                          filter
                          value={inputValue.ItemCode || ""}
                          onChange={(e) => handleFilterChange(e, "ItemCode")}
                          placeholder="Search Item Code..."
                        >
                          {originalSelectedPurRequestList?.map((data, idx) => (
                            <ComboBoxItem key={idx} text={String(data.ItemCode)} />
                          ))}
                        </ComboBox>
                      </FlexBox>
                      <FlexBox direction="Column">
                        {" "}
                        <Label>Item Full Description</Label>
                        <ComboBox
                          filter
                          value={inputValue.ItemName || ""}
                          onChange={(e) => handleFilterChange(e, "ItemName")}
                          placeholder="Search Item Description..."
                        >
                          {originalSelectedPurRequestList?.map((data, idx) => (
                            <ComboBoxItem key={idx} text={String(data.ItemName)} />
                          ))}
                        </ComboBox>
                      </FlexBox>
            <Button style={{ width: "100px" }} onClick={clearFilter}>
              Clear Filter
            </Button>
          </FlexBox>
          {console.log(
            "selectedPurRequestList",
            selectedPurRequestList,
            originalSelectedPurRequestList,
          )}
          <AnalyticalTable
            data={selectedPurRequestList}
            columns={itemcolumns}
            //header={`Items (${selectedPurRequestList.length})`}
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
        </FlexBox>
      </Dialog>
     
    </>
  );
};


export default openPurRequestItemsDialog