import React, { useEffect, useState } from "react";
import {
  Dialog,
  Button,
  AnalyticalTable,
  FlexBox,
  Label,
  Select,
  Option,
  ComboBox,
  ComboBoxItem,
} from "@ui5/webcomponents-react";

const ProjectCodeDialog = ({
  open,
  setFormData,
  handleProjectDialogClose,
  projectList,
  setProjectList,
  selectedProject,
  setSelectedProject,
  setgeneralData,
  originalProjectdata,
  setOriginalgeneralData,
  inputValue,
  setInputValue,
}) => {
  const [selected, setSelected] = useState(null);

  const columns = [
   
    {
      Header: "Project Code ",
      accessor: "ProjectCode",
      width: 100,
    },
    { Header: "Project Name", accessor: "ProjectName" },
    { Header: "Status", accessor: "status" },
  ];
 const clearFilter = () => {
    // Implement clear filter logic here
     setProjectList(originalProjectdata);
              setInputValue({});
  }
  const handleSelectionChange = (event) => {
    const selectedRow = event.detail.row;
    console.log("selectedRow", selectedRow, event);
    if (selectedRow) {
      setSelected(selectedRow.original);
      //setSelectedProjectCode(selectedRow.original.ProjectCode);
      setFormData((prev) => ({
        ...prev,
        ProjectCode: selectedRow.original.ProjectCode,
        ProjectName: selectedRow.original.ProjectName,
        status: selectedRow.original.status,

      }));
       handleOk();
      setTimeout(() => {
        clearFilter();
        handleProjectDialogClose();
      }, 1000);
    }
  };

  const handleFilterChange = (e, fieldname) => {
    console.log("handleFilterChange", e.target.value);
    const selectedOption = e.target; //e.detail.selectedOption;
    if (!selectedOption) return;

    const selectedValue = selectedOption.value || selectedOption.textContent;
    console.log("Selected value:", selectedValue);

    // ✅ Save selected value for that field
    setInputValue((prev) => ({
      ...prev,
      [fieldname]: selectedValue,
    }));

    // ✅ Optional filtering logic
    const filteredList = generalData.filter((item) =>
      item[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(selectedValue.toLowerCase())
    );

    setgeneralData(filteredList);
  };

  const handleOk = () => {
    if (selected) {
      setSelectedProject(selected); // send full row back
    }
    handleProjectDialogClose();
  };

  return (
    <Dialog
      open={open}
      headerText="Select Project Details"
      footer={
        <>
          <Button
            design="Default"
            style={{ width: "100px", margin: "10px" }}
            onClick={handleOk}
          >
            OK
          </Button>
        </>
      }
      onAfterClose={handleProjectDialogClose}
      style={{ width: "40vw"}}
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
            {" "}
            <Label>Project Code</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "ProjectCode")}
              value={inputValue.ProjectCode || ""}
            >
              <Option value=""></Option>
              {originalProjectdata.map((data, index) => (
                <Option key={index} value={data.ProjectCode}>
                  {data.ProjectCode}
                </Option>
              ))}
            </Select> */}
            <ComboBox
              filter
              value={inputValue.Code || ""}
              onChange={(e) => handleFilterChange(e, "ProjectCode")}
              placeholder="Search Project Code..."
            >
              {originalProjectdata.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.ProjectCode} />
              ))}
            </ComboBox>
          </FlexBox>
          <FlexBox direction="Column">
            {" "}
            <Label>Project Name</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "ProjectName")}
              value={inputValue.ProjectName || ""}
            >
              <Option value=""></Option>
              {originalProjectdata.map((data, index) => (
                <Option key={index} value={data.ProjectName}>
                  {data.ProjectName}
                </Option>
              ))}
            </Select> */}
              <ComboBox
              filter
              value={inputValue.Name || ""}
              onChange={(e) => handleFilterChange(e, "ProjectName")}
              placeholder="Search Project Name..."
            >
              {originalProjectdata.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.ProjectName} />
              ))}
            </ComboBox>
          </FlexBox>
          
          {console.log("originalProjectdata", originalProjectdata)}
          <Button
            style={{ width: "100px" }}
            onClick={clearFilter}
          >
            Clear Filter
          </Button>
        </FlexBox>
        {console.log("projectListanalyticaltable", projectList)}
        <AnalyticalTable
          data={projectList}
          columns={columns}
          selectionMode="Single"
          onRowSelect={handleSelectionChange}
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

export default ProjectCodeDialog;
