import {
  AnalyticalTable,
  Button,
  ComboBoxItem,ComboBox,
  Dialog,
  FlexBox,
  Label,
} from "@ui5/webcomponents-react";
import React, { useMemo, useState } from "react";

const ListPurItemDialog = (props) => {
  const {
    openPurchaseItem,
    setOpenPurchaseItem,
    setOpen,
    selectedPurList,
    setSelectedPurList,
    originalSelectedPurList,
    setOriginalSelectedPurList,
    inputValue,setInputValue,
    saveItem,
    saveService,
    type,
  } = props;
  const [rowSelection, setRowSelection] = useState([]);
  console.log("purtype", type);
  const handleFilterChange = (e, fieldname) => {
    console.log("handleFilterChange", e.target.value);
    const selectedOption = e.target; //e.detail.selectedOption;
    if (!selectedOption) return;

    const selectedValue = selectedOption.value || selectedOption.textContent;
    console.log("Selected value:", selectedValue);

    // ✅ Save selected value for that field
    setInputValue((prev) => ({
      ...prev,
      [fieldname]: selectedValue,
    }));

    // ✅ Optional filtering logic
    const filteredList = selectedPurList.filter((item) =>
      item[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(selectedValue.toLowerCase()),
    );

    setSelectedPurList(filteredList);
  };
  const onitemchildRowSelect = (e) => {
    console.log(
      "e.detail.row.original",
      e.detail.allRowsSelected,
      "e.detail.row",
      e.detail.row,
    );
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
   const clearFilter = () => {
    // Implement clear filter logic here
    setSelectedPurList(originalSelectedPurList);
    setInputValue({});
  };
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
              type === "Item"
                ? saveItem(Object.values(rowSelection))
                : saveService(Object.values(rowSelection));
            }}
          >
            Choose
          </Button>
        </FlexBox>
      }
      style={{ width: "50vw" }}
    >
      {console.log("selectedPurList", selectedPurList)}
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
              value={inputValue?.ItemCode || ""}
              onChange={(e) => handleFilterChange(e, "ItemCode")}
              placeholder="Search Item Code..."
            >
              {originalSelectedPurList?.map((data, idx) => (
                <ComboBoxItem key={idx} text={String(data?.ItemCode)} />
              ))}
            </ComboBox>
          </FlexBox>
          <FlexBox direction="Column">
            {" "}
            <Label>Item Full Description</Label>
            <ComboBox
              filter
              value={inputValue?.ItemDescription || ""}
              onChange={(e) => handleFilterChange(e, "ItemDescription")}
              placeholder="Search Item Description..."
            >
              {originalSelectedPurList?.map((data, idx) => (
                <ComboBoxItem key={idx} text={String(data?.ItemDescription)} />
              ))}
            </ComboBox>
          </FlexBox>
          <Button style={{ width: "100px" }} onClick={clearFilter}>
            Clear Filter
          </Button>
        </FlexBox>
      <AnalyticalTable
        data={selectedPurList}
        columns={type === "Item" ? itemcolumns : servicecolumns}
        //header={`Items (${selectedPurList.length})`}
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
  );
};

export default ListPurItemDialog;
