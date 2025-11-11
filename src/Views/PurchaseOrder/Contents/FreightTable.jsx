import { AnalyticalTable, Button, Dialog } from '@ui5/webcomponents-react';
import React, { useMemo } from 'react'

const FreightTable = (props) => {
    const { freightData, setFreightData,setfreightDialogOpen,freightdialogOpen,onselectFreightRow } = props;
    const Column = useMemo(
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
    <div>
       <AnalyticalTable
                data={freightData}
                columns={Column}
                header={`Freights (${freightData.length})`}
                selectionMode="Multiple"
               onRowClick={onselectFreightRow}
              />
      {/* <Dialog
              headerText="Select Item"
              open={freightdialogOpen}
              onAfterClose={() => setfreightDialogOpen(false)}
            >
             <AnalyticalTable
                data={freightData}
                columns={Column}
                header={`Freights (${freightData.length})`}
               
              />
              <Button onClick={() => setfreightDialogOpen(false)}>Close</Button>
              <Button
                onClick={() => {
                 // saveItem(selectedRow, selectedRowIndex);
                  setfreightDialogOpen(false);
                }}
              >
                Save
              </Button>
            </Dialog>  */}
       
    </div>
  )
}

export default FreightTable
