import { AnalyticalTable, Button, Dialog, DynamicPage, DynamicPageHeader, FlexBox, Grid } from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormConfigContext } from "../../../../../Components/Context/FormConfigContext";


const TaxDialog = (props) => {
  const {
    isWarehouseDialogOpen,
    setisWarehouseDialogOpen,
    warehouseData,setWarehouseData,
    itemdata,
    setitemData,itemTabledata,setitemTableData, inputvalue,
                                    setInputValue,warehouseSelectionRow
  } = props;
    const {
      taxPopupFilterList
    } = useContext(FormConfigContext);
      const [originalWarehouseData, setOriginalWarehouseData] = useState([]);
      useEffect(() => {
        console.log("warehousedatauseefect1", originalWarehouseData);
        if (isWarehouseDialogOpen) {
          console.log("itemdatauseefect", warehouseData);
          setOriginalWarehouseData(warehouseData); // backup (for reset/clear filter)
        }
      }, [isWarehouseDialogOpen]);
  const column = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Code",
        accessor: "Code",
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Category",
        accessor: "Category",
      },
      {
        Header:"TaxRegion",
        accessor: "TaxRegion",
      },
      {
        Header: "Rate",
        accessor: "Rate",
        Cell: ({ row }) => row.original.VatGroups_Lines[row.original.VatGroups_Lines.length - 1]?.Rate || 0,
      },    
    ],
    []
  );
  const rowSelection = (e) => {
    console.log("rowSelection", e,itemdata,itemTabledata);
    setitemTableData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)   
          ? { ...r, TaxCode: e.detail.row.original.VatGroups_Lines[e.detail.row.original.VatGroups_Lines.length - 1]?.Rate }
          : r
      )
    );
    setitemData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? { ...r, TaxCode: e.detail.row.original.VatGroups_Lines[e.detail.row.original.VatGroups_Lines.length - 1]?.Rate }
          : r
      )
    );
    setTimeout(() => {
      setisWarehouseDialogOpen(false);
    }, 500);
  };
  const clearFilter = () => {
    // Implement clear filter logic here
      console.log("originalItemData", originalWarehouseData);
    setInputValue([]);
    setWarehouseData(originalWarehouseData);
  }
  return (
    <Dialog
      headerText="Item Details"
      open={isWarehouseDialogOpen}
      onAfterClose={() => setisWarehouseDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setisWarehouseDialogOpen(false);
            }}
          >
            Next
          </Button>

        
        </FlexBox>
      }
      style={{ width: "80%" }}
    >
      <DynamicPage
        headerArea={
          <DynamicPageHeader>
            <FlexBox
              direction="Row"
              alignItems="Center"
              justifyContent="SpaceBetween"
            >
              <Grid
                defaultIndent="XL0 L0 M0 S0"
                defaultSpan="XL4 L4 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
              >
                {/* {taxPopupFilterList.map((field) =>
                                  TaxPopupFilter(
                                    field,
                                    warehouseData,
                                    setWarehouseData,
                                    inputvalue,
                                    setInputValue
                                  )
                                )} */}
              </Grid>
              <Button style={{ width: "100px" }} onClick={clearFilter}>
                Clear Filter
              </Button>
            </FlexBox>

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
            <div>
              <AnalyticalTable
                data={warehouseData}
                columns={column}
                header={`Items (${warehouseData.length})`}
                selectionMode="Single"
                onRowSelect={warehouseSelectionRow}
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage>
    </Dialog>
  );
};

export default TaxDialog;
