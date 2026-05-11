import {
  AnalyticalTable,
  Button,
  Dialog,
  DynamicPage,
  DynamicPageHeader,
  FlexBox,
  Grid,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormConfigContext } from "../../../../../Components/Context/FormConfigContext";
import { TaxPopupFilter } from "./TaxPopupFilter";

const TaxDialog = (props) => {
  const {
    isTaxDialogOpen,
    setisTaxDialogOpen,
    taxData,
    setTaxData,
    freightData,
    setFreightData,
    setitemTableData,
    inputvalue,
    setInputValue,
    taxSelectionRow,
  } = props;
  const { taxPopupFilterList } = useContext(FormConfigContext);
  const [originalTaxData, setOriginalTaxData] = useState([]);
  useEffect(() => {
    console.log("taxdatauseefect1", originalTaxData);
    if (isTaxDialogOpen) {
      console.log("freightDatauseefect", taxData);
      setOriginalTaxData(taxData); // backup (for reset/clear filter)
    }
  }, [isTaxDialogOpen]);
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
        Header: "TaxRegion",
        accessor: "TaxRegion",
      },
      {
        Header: "Rate",
        accessor: "Rate",
        Cell: ({ row }) =>
          row.original.VatGroups_Lines[row.original.VatGroups_Lines.length - 1]
            ?.Rate || 0,
      },
    ],
    []
  );
  const rowSelection = (e) => {
    console.log("rowSelection", e, freightData);
    setitemTableData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? {
              ...r,
              TaxCode:
                e.detail.row.original.VatGroups_Lines[
                  e.detail.row.original.VatGroups_Lines.length - 1
                ]?.Rate,
            }
          : r
      )
    );
    setFreightData((prev) =>
      prev.map((r, idx) =>
        idx === Number(e.detail.row.id)
          ? {
              ...r,
              TaxCode:
                e.detail.row.original.VatGroups_Lines[
                  e.detail.row.original.VatGroups_Lines.length - 1
                ]?.Rate,
            }
          : r
      )
    );
    setTimeout(() => {
      setisTaxDialogOpen(false);
    }, 500);
  };
  const clearFilter = () => {
    // Implement clear filter logic here
    console.log("originalfreightData", originalTaxData);
    setInputValue([]);
    setTaxData(originalTaxData);
  };
  return (
    <Dialog
      headerText="Item Details"
      open={isTaxDialogOpen}
      onAfterClose={() => setisTaxDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setisTaxDialogOpen(false);
            }}
          >
            Next
          </Button>
        </FlexBox>
      }
     style={{ width: "40vw"}}
    >
       <FlexBox direction="Column">
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
              <Grid
                defaultIndent="XL0 L0 M0 S0"
                defaultSpan="XL4 L4 M6 S12"
                hSpacing="1rem"
                vSpacing="1rem"
              >
                {taxPopupFilterList.length>0&&taxPopupFilterList.map((field) =>
                  TaxPopupFilter(
                    field,
                    taxData,
                    setTaxData,
                    inputvalue,
                    setInputValue
                  )
                )}
              </Grid>
              <Button style={{ width: "100px" }} onClick={clearFilter}>
                Clear Filter
              </Button>
            </FlexBox>

            {/* Basic Company Code Search */}
       
       
              <AnalyticalTable
                data={taxData}
                columns={column}
                header={`Items (${taxData.length})`}
                selectionMode="Single"
                onRowSelect={taxSelectionRow}
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
