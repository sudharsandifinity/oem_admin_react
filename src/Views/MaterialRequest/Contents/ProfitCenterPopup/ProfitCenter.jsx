import {
  AnalyticalTable,
  Button,
  Dialog,
  DynamicPage,
  DynamicPageHeader,
  FlexBox,
  Grid,
  Tag,
} from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { profitCentrePopupFilter } from "./profitCentrePopupFilter";
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";

const ProfitCenterDialog = (props) => {
  const {
    isProfitCenterDialogOpen,
    setisProfitCenterDialogOpen,
    profitCenterData,
    setProfitCenterData,
    itemTabledata,
    setitemTableData,
    inputvalue,
    setInputValue,
    profitCenterSelectionRow,clearProfitCenterFilter
  } = props;
  const { profitcentrePopupFilterList } = useContext(FormConfigContext);
  const [originalProfitCenterData, setOriginalProfitCenterData] = useState([]);
  useEffect(() => {
    if (isProfitCenterDialogOpen) {
      setOriginalProfitCenterData(profitCenterData); // backup (for reset/clear filter)
    }
  }, [isProfitCenterDialogOpen]);
  const column = useMemo(
    () => [
      {
        Header: "SL No",
        accessor: "id", // not used for data, but needed for the column
        Cell: ({ row }) => Number(row.id) + 1, // ✅ row.id is 0-based
        width: 80,
      },
      {
        Header: "Center Code",
        accessor: "CenterCode",
      },
      {
        Header: "Center Name",
        accessor: "CenterName",
      },
      {
        Header: "Center Owner",
        accessor: "CenterOwner",
      },
      {
        Header: "CostCenter Type",
        accessor: "CostCenterType",
      },
      {
        Header: "Group Code",
        accessor: "GroupCode",
      },
      {
        Header: "Active",
        accessor: "Active",
        Cell: ({ row }) =>
          row.original.Active === "tYES" ? (
            <Tag children="Yes" design="Positive" size="S" />
          ) : (
            <Tag children="No" design="Negative" size="S" />
          ),
      },
    ],
    [],
  );

 
  return (
    <Dialog
      headerText="Profit Center Details"
      open={isProfitCenterDialogOpen}
      onAfterClose={() => setisProfitCenterDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setisProfitCenterDialogOpen(false);
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
                {profitcentrePopupFilterList.map((field) =>
                  profitCentrePopupFilter(
                    field,
                    profitCenterData,
                    setProfitCenterData,
                    inputvalue,
                    setInputValue,
                  ),
                )}
              </Grid>
              </FlexBox>
              <Button style={{ width: "100px" }} onClick={clearProfitCenterFilter}>
                Clear Filter
              </Button>
            </FlexBox>

       
              <AnalyticalTable
                data={profitCenterData}
                columns={column}
                //header={`Items (${profitCenterData.length})`}
                selectionMode="Single"
                onRowSelect={profitCenterSelectionRow}
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

export default ProfitCenterDialog;
