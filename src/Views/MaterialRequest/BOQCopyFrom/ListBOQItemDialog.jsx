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

const ListBOQItemDialog = (props) => {
  const {
    openListBOQItem,
    setOpenListBOQItem,
    setOpen,
    selectedBOQList,
    setSelectedBOQList,
    originalSelectedBOQList,
    setOriginalSelectedBOQList,
    setInputValue,
    inputValue,
    saveItem,
    saveService,
    type,
  } = props;
  const [rowSelection, setRowSelection] = useState([]);
  console.log("boqtype", type);
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
    const filteredList = selectedBOQList.filter((item) =>
      item[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(selectedValue.toLowerCase()),
    );

    setSelectedBOQList(filteredList);
  };
  const onitemchildRowSelect = (e) => {
    console.log(
      "e.detail.row.original",
      e.detail,
      "e.detail",
      e.detail.rowsById,
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
        Header: "Item Code",
        accessor: "U_ItemCode",
      },

      {
        Header: "Item Description",
        accessor: "U_Desc",
      },
      {
        Header: "Full Description",
        accessor: "U_FullDesc",
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
  const clearFilter = () => {
    // Implement clear filter logic here
    setSelectedBOQList(originalSelectedBOQList);
    setInputValue({});
  };
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
              saveItem(Object.values(rowSelection));
            }}
          >
            Choose
          </Button>
        </FlexBox>
      }
      style={{ width: "50vw" }}
    >
      {console.log("selectedBOQList", selectedBOQList,originalSelectedBOQList)}
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
              value={inputValue?.U_ItemCode || ""}
              onChange={(e) => handleFilterChange(e, "U_ItemCode")}
              placeholder="Search Item Code..."
            >
              {originalSelectedBOQList?.map((data, idx) => (
                <ComboBoxItem key={idx} text={String(data.U_ItemCode)} />
              ))}
            </ComboBox>
          </FlexBox>
          <FlexBox direction="Column">
            {" "}
            <Label>Item Full Description</Label>
            <ComboBox
              filter
              value={inputValue?.U_FullDesc || ""}
              onChange={(e) => handleFilterChange(e, "U_FullDesc")}
              placeholder="Search Item Description..."
            >
              {originalSelectedBOQList?.map((data, idx) => (
                <ComboBoxItem key={idx} text={String(data.U_FullDesc)} />
              ))}
            </ComboBox>
          </FlexBox>
          <Button style={{ width: "100px" }} onClick={clearFilter}>
            Clear Filter
          </Button>
        </FlexBox>
        <AnalyticalTable
          data={selectedBOQList}
          columns={type === "Item" ? itemcolumns : servicecolumns}
          //header={`Items (${selectedBOQList.length})`}
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

export default ListBOQItemDialog;
