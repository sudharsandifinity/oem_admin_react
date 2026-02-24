import { AnalyticalTable, Button, Dialog, DynamicPage, DynamicPageHeader, FlexBox, Grid, Tag } from "@ui5/webcomponents-react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ProjectPopupFilter } from "./ProjectPopupFilter";
import { FormConfigContext } from "../../../../Components/Context/FormConfigContext";


const ProjectDialog = (props) => {
  const {
    isProjectDialogOpen,
    setisProjectDialogOpen,inputvalue,
    projectData,setProjectData,originalProjectData,setOriginalProjectData,
                                    setInputValue,projectSelectionRow,
                                    clearProjectFilter
  } = props;
    const {
      projectPopupFilterList
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
        Header: "Valid From",
        accessor: "ValidFrom",
      },
      {
        Header:"Active",
        accessor: "Active",
        Cell: ({ row }) =>
          row.original.Active === "tYES" ? (
            <Tag children="Yes" design="Positive" size="S" />
          ) : (
            <Tag children="No" design="Negative" size="S" />
          ),
      },
       
    ],
    []
  );
  
 
  return (
    <Dialog
      headerText="Item Details"
      open={isProjectDialogOpen}
      onAfterClose={() => setisProjectDialogOpen(false)}
      footer={
        <FlexBox direction="Row" gap={20} style={{ marginTop: "10px" }}>
          <Button
            onClick={() => {
              setisProjectDialogOpen(false);
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
                {projectPopupFilterList.map((field) =>
                                  ProjectPopupFilter(
                                    field,
                                    projectData,
                                    setProjectData,
                                    inputvalue,
                                    setInputValue
                                  )
                                )}
              </Grid>
              <Button style={{ width: "100px" }} onClick={clearProjectFilter}>
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
                data={projectData}
                columns={column}
                header={`Items (${projectData.length})`}
                selectionMode="Single"
                onRowSelect={projectSelectionRow}
                visibleRows={6}
              />
            </div>
          </FlexBox>
        </div>
      </DynamicPage>
    </Dialog>
  );
};

export default ProjectDialog;
