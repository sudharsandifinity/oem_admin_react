import { AnalyticalTable, Button, Dialog, DynamicPage, DynamicPageHeader, FlexBox, Grid, Tag, Text } from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Form } from "react-router-dom";
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";
import { WareHousePopupFilter } from "./WareHouseFilterDialog";


const WarehouseDialog = (props) => {
  const {
    isWarehouseDialogOpen,
    setisWarehouseDialogOpen,
    warehouseData,setWarehouseData,inputvalue,
    clearWarehouseFilter,
                                    setInputValue,warehouseSelectionRow
  } = props;
  const {warehousePopupFilterList}=useContext(FormConfigContext);
  
      const [originalWarehouseData, setOriginalWarehouseData] = useState([]);
      useEffect(() => {
        if (isWarehouseDialogOpen) {
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
        Header: "Warehouse Code",
        accessor: "WarehouseCode",
      },
      {
        Header: "Warehouse Name",
        accessor: "WarehouseName",
      },
     
      {
        Header:"Inactive",
        accessor: "Inactive",
         Cell: ({ row }) =>
          row.original.Inactive === "tYES" ? (
            <Text children="Yes"  size="S" />
          ) : (
            <Text children="No"  size="S" />
          ),
      },
     
    ],
    []
  );
  const rowSelection = (e) => {
    console.log("rowSelection", e,itemTabledata);
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

  return (
    <Dialog
      headerText="Warehouse Details"
      open={isWarehouseDialogOpen}
      onAfterClose={() => setisWarehouseDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setisWarehouseDialogOpen(false);
            }}
          >
            Close
          </Button>

        
        </FlexBox>
      }
      style={{ width: "50vw"}}
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
              <Grid
                defaultIndent="XL0 L0 M0 S0"
                defaultSpan="XL4 L4 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
              >
                {warehousePopupFilterList.map((field) =>
                                  WareHousePopupFilter(
                                    field,
                                    warehouseData,
                                    setWarehouseData,
                                    inputvalue,
                                    setInputValue
                                  )
                                )}
              </Grid>
              </FlexBox>
                            <Button style={{ width: "100px" }} onClick={clearWarehouseFilter}>
                Clear Filter
              </Button>
            </FlexBox>

         
              <AnalyticalTable
                data={warehouseData}
                columns={column}
                //header={`Items (${warehouseData.length})`}
                selectionMode="Single"
                onRowSelect={warehouseSelectionRow}
                visibleRows={6}
                selectionBehavior="RowOnly"
          scaleWidthMode="Grow"
                style={{border: "1px solid #ccc",   /* keeps a grey outline */
                 borderRadius: "4px",padding: "0.25rem"}}
              />
          </FlexBox>
       
    </Dialog>
  );
};

export default WarehouseDialog;
