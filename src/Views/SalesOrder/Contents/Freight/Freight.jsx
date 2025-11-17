import React, { useEffect, useMemo, useState } from "react";
import FreightTable from "../FreightTable";
import { AnalyticalTable, Button, Dialog, FlexBox } from "@ui5/webcomponents-react";

const Freight = (props) => {
  const {
    mode,
    freightData,
    setFreightData,
    freightdialogOpen,
    setfreightDialogOpen,
    onselectFreightRow,
    itemTabledata,
    onRowSelect,freightRowSelection, setFreightRowSelection
  } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
const[originalfreightData,setOriginalFreightData]= useState([]);
    useEffect(() => {
      console.log("itemdatauseefect1", originalfreightData);
      if (dialogOpen) {
        console.log("itemdatauseefect", freightData);
        setOriginalFreightData(freightData); // backup (for reset/clear filter)
      }
    }, [dialogOpen]);
   const columns = useMemo(
          () => [
            {
              Header: "SL No",
              accessor: "id", // not used for data, but needed for the column
              Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
              width: 80,
            },
            {
              Header: "Name",
              accessor: "Name",
            },
            {
              Header:"Revenues Account",
              accessor: "RevenuesAccount",
            },
            {
              Header: "Expense Account",
              accessor: "ExpenseAccount",
            },
            {
              Header: "TaxLiable",
              accessor: "TaxLiable",
            },
          ],
          []
        );
  return (
    <div style={{ background: "white" }}>
      <FlexBox style={{ justifyContent: "end" }}>
        <Button
          disabled={mode === "view"}
          design="Transparent"
          onClick={()=>setDialogOpen(true)}
          icon="sap-icon://add"
          tooltip="Add Row"
        ></Button>

        <Button
          disabled={mode === "view"}
          design="Transparent"
          //onClick={handleSettingsDialogOpen}
          tooltip="Column Settings"
          icon="sap-icon://settings"
        ></Button>
      </FlexBox>{console.log("onselectFreightRow1",freightRowSelection)}
      <AnalyticalTable
        style={{ borderTop: "1px solid #d6dbe0" }}
        data={Object.values(freightRowSelection || {})}
        columns={columns}
        withNavigationHighlight
        getRowId={(row) => row.original.id.toString()}
        selectionMode="Multiple"
        //selectedRowIds={rowSelection && Object.keys(rowSelection)} // 👈 ensures rows are preselected
        onRowSelect={(e) => onRowSelect(e)}
        // markNavigatedRow={markNavigatedRow}
        visibleRows={10}
      />
      <Dialog
        headerText="Select Item"
        open={dialogOpen}
        onAfterClose={() => setDialogOpen(false)}
      >
        <FreightTable
          freightData={freightData}
          setFreightData={setFreightData}
          freightdialogOpen={freightdialogOpen}
          setfreightDialogOpen={setfreightDialogOpen}
          onselectFreightRow={onselectFreightRow}
          freightRowSelection={freightRowSelection}
          setFreightRowSelection={setFreightRowSelection}
        />
        <Button onClick={() =>{ setFreightData(originalfreightData);setDialogOpen(false);}}>Close</Button>
      </Dialog>
    </div>
  );
};

export default Freight;
