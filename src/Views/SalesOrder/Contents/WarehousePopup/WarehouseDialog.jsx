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
            Close
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
              <Button style={{ width: "100px" }} onClick={clearWarehouseFilter}>
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
                visibleRows={6}
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage>
    </Dialog>
  );
};

export default WarehouseDialog;
