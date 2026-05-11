import { AnalyticalTable, Button, Dialog, DynamicPage, DynamicPageHeader, FlexBox, Grid } from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { TaxPopupFilter } from "./TaxPopupFilter";
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";



const TaxDialog = (props) => {
  const {
    isTaxDialogOpen,
    setisTaxDialogOpen,
    taxData,setTaxData,inputvalue, setInputValue,taxSelectionRow,
    clearTaxFilter,
    setOriginalTaxData,originalTaxData,selectedTaxRowIndex
  } = props;
    const {
      taxPopupFilterList
    } = useContext(FormConfigContext);
      
    
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
  
 
  return (
    <Dialog
      headerText="Tax Details"
      open={isTaxDialogOpen}
      onAfterClose={() => setisTaxDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setisTaxDialogOpen(false);
            }}
          >
            Close
          </Button>

        
        </FlexBox>
      }
      style={{ width: "60vw"}}
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
                {taxPopupFilterList.map((field) =>
                                  TaxPopupFilter(
                                    field,
                                    taxData,
                                    setTaxData,
                                    inputvalue,
                                    setInputValue
                                  )
                                )}
              </Grid>
              </FlexBox>
              <Button style={{ width: "100px" }} onClick={clearTaxFilter}>
                Clear Filter
              </Button>
            </FlexBox>

         
              <AnalyticalTable
                data={taxData}
                columns={column}
                //header={`Items (${taxData.length})`}
                selectionMode="Single"
                onRowSelect={taxSelectionRow}
                selectedRowIds={
    selectedTaxRowIndex
      ? { [taxData.findIndex(r => r === selectedTaxRowIndex)]: true }
      : {}
  }
                selectionBehavior="RowOnly"
                         scaleWidthMode="Grow"
                        visibleRows={6}
                        style={{border: "1px solid #ccc",   /* keeps a grey outline */
                 borderRadius: "4px",padding: "0.25rem"}}
                       />
                     </FlexBox>
    </Dialog>
  );
};

export default TaxDialog;
