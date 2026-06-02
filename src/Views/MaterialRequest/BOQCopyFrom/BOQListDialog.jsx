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
import ListBOQItemDialogDialog from "./ListBOQItemDialog";
import ListBOQItemDialog from "./ListBOQItemDialog";
//import ListPurItemDialog from "./ListPurItemDialog";

const BOQListDialog = (props) => {
  const {
    open,
    setOpen,
    boqrequestList,
    saveItem,
    type,
    saveService,
    originalboqrequestList,
    setOriginalboqrequestlist,
    inputValue,
    setBoqRequestList,
    setInputValue,
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
    const filteredList = boqrequestList.filter((item) =>
      item[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(selectedValue.toLowerCase()),
    );
console.log("filteredList", filteredList);
    setBoqRequestList(filteredList);
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
        Header: "Document Entry",
        accessor: "DocEntry",
      },
      {
        Header: "Customer Code",
        accessor: "U_BPCode",
      },
       {
        Header: "Customer Name",
        accessor: "U_BPName",
      },
      {
        Header: "Project Code",
        accessor: "U_PrjCode",
      },
       {
        Header: "Project Name",
        accessor: "U_PrjName",
      },
      {
        Header: "Project Location",
        accessor: "U_PrjLoc",
      },
      {
        Header: "Reference No",
        accessor: "U_RefNo",
      },
      {
        Header: "Currency",
        accessor: "U_Cur",
      },
       {
        Header: "Status",
        accessor: "U_Status",
      },
    ],
    [],
  );
  const clearFilter = () => {
    // Implement clear filter logic here
    setBoqRequestList(originalboqrequestList);
    setInputValue({});
  };
  return (
    <>
      <Dialog
        headerText="BOM List"
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
                setOriginalSelectedBOQList(
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
                {originalboqrequestList?.map((data, idx) => (
                  <ComboBoxItem key={idx} text={String(data.DocEntry)} />
                ))}
              </ComboBox>
            </FlexBox>
            <FlexBox direction="Column">
              {" "}
              <Label>Creator</Label>
              <ComboBox
                filter
                value={inputValue?.Creator || ""}
                onChange={(e) => handleFilterChange(e, "Creator")}
                placeholder="Search Creator..."
              >
                {originalboqrequestList?.map((data, idx) => (
                  <ComboBoxItem key={idx} text={data.Creator} />
                ))}
              </ComboBox>
            </FlexBox>
            <Button style={{ width: "100px" }} onClick={clearFilter}>
              Clear Filter
            </Button>
          </FlexBox>
          {console.log(
            "boqrequestList",
            boqrequestList,
            originalboqrequestList,
          )}
          <AnalyticalTable
            data={boqrequestList}
            columns={itemcolumns}
            //header={`Items (${boqrequestList.length})`}
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
      <ListBOQItemDialog
        openListBOQItem={openListBOQItem}
        setOpenListBOQItem={setOpenListBOQItem}
        setOpen={setOpen}
        selectedBOQList={selectedBOQList}
        setSelectedBOQList={setSelectedBOQList}
        originalSelectedBOQList={originalSelectedBOQList}
        setOriginalSelectedBOQList={setOriginalSelectedBOQList}
        saveItem={saveItem}
        saveService={saveService}
         inputValue={inputValue}
  setInputValue={setInputValue}
        type={type}
      />
    </>
  );
};

export default BOQListDialog;
