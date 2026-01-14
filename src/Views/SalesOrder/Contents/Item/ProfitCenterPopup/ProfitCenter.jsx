import { AnalyticalTable, Button, Dialog, DynamicPage, DynamicPageHeader, FlexBox, Grid } from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { FormConfigContext } from "../../../../../Components/Context/FormConfigContext";


const ProfitCenterDialog = (props) => {
  const {
    isProfitCenterDialogOpen,
    setisProfitCenterDialogOpen,
    profitCenterData,setProfitCenterData,
    itemdata,
    setitemData,itemTabledata,setitemTableData, inputvalue,
                                    setInputValue,profitCenterSelectionRow
  } = props;
    const {
      taxPopupFilterList
    } = useContext(FormConfigContext);
      const [originalProfitCenterData, setOriginalProfitCenterData] = useState([]);
      useEffect(() => {
        console.log("profitCenterdatauseefect1", originalProfitCenterData);
        if (isProfitCenterDialogOpen) {
          console.log("itemdatauseefect", profitCenterData);
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
        Header: "In Which Dimension",
        accessor: "InWhichDimension",
      },
      {
        Header:"Active",
        accessor: "Active",
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
      setisProfitCenterDialogOpen(false);
    }, 500);
  };
  const clearFilter = () => {
    // Implement clear filter logic here
      console.log("originalItemData", originalProfitCenterData);
    setInputValue([]);
    setProfitCenterData(originalProfitCenterData);
  }
  return (
    <Dialog
      headerText="Item Details"
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
                                    profitCenterData,
                                    setProfitCenterData,
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
                data={profitCenterData}
                columns={column}
                header={`Items (${profitCenterData.length})`}
                selectionMode="Single"
                onRowSelect={profitCenterSelectionRow}
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage>
    </Dialog>
  );
};

export default ProfitCenterDialog;
