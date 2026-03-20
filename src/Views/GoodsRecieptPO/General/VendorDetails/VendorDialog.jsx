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

const VendorDialog = ({
  open,
  setFormData,
  handleVendorDialogClose,
  generalData,
  setselectedVendor,
  setSelectedVendorCode,
  setgeneralData,
  originalGeneralData,
  setOriginalgeneralData,
  inputValue,
  setInputValue,
}) => {
  const [selected, setSelected] = useState(null);

  const columns = [
   
    {
      Header: "Vendor Code",
      accessor: "Vendor",
      width: 100,
    },
    { Header: "Vendor Name", accessor: "VendorName" },
    { Header: "Contact Person", accessor: "ContactPerson" },
  ];
 const clearFilter = () => {
    // Implement clear filter logic here
     setgeneralData(originalGeneralData);
              setInputValue({});
  }
  const handleSelectionChange = (event) => {
    const selectedRow = event.detail.row;
    console.log("selectedRow", selectedRow, event);
    if (selectedRow) {
      setSelected(selectedRow.original);
      setselectedVendor(selectedRow.original.Vendor);
      setFormData((prev) => ({
        ...prev,
        VendorCode: selectedRow.original.Vendor,
      }));
      setTimeout(() => {
        clearFilter();
        handleVendorDialogClose();
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
      setselectedVendor(selected); // send full row back
    }
    handleVendorDialogClose();
  };

  return (
    <Dialog
      open={open}
      headerText="Select Vendor Details"
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
      onAfterClose={handleVendorDialogClose}
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
            <Label>Vendor Code</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "VendorCode")}
              value={inputValue.VendorCode || ""}
            >
              <Option value=""></Option>
              {originalGeneralData.map((data, index) => (
                <Option key={index} value={data.VendorCode}>
                  {data.VendorCode}
                </Option>
              ))}
            </Select> */}
            <ComboBox
              filter
              value={inputValue.VendorCode || ""}
              onChange={(e) => handleFilterChange(e, "VendorCode")}
              placeholder="Search Vendor Code..."
            >
              {originalGeneralData.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.VendorCode} />
              ))}
            </ComboBox>
          </FlexBox>
          <FlexBox direction="Column">
            {" "}
            <Label>Vendor Name</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "VendorName")}
              value={inputValue.VendorName || ""}
            >
              <Option value=""></Option>
              {originalGeneralData.map((data, index) => (
                <Option key={index} value={data.VendorName}>
                  {data.VendorName}
                </Option>
              ))}
            </Select> */}
              <ComboBox
              filter
              value={inputValue.VendorName || ""}
              onChange={(e) => handleFilterChange(e, "VendorName")}
              placeholder="Search Vendor Name..."
            >
              {originalGeneralData.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.VendorName} />
              ))}
            </ComboBox>
          </FlexBox>
          <FlexBox direction="Column">
            {" "}
            <Label>Contact Person</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "ContactPerson")}
              value={inputValue.ContactPerson || ""}
            >
              <Option value=""></Option>
              {originalGeneralData.map((data, index) => (
                <Option key={index} value={data.ContactPerson}>
                  {data.ContactPerson}
                </Option>
              ))}
            </Select> */}
            <ComboBox
              filter
              value={inputValue.ContactPerson || ""}
              onChange={(e) => handleFilterChange(e, "ContactPerson")}
              placeholder="Search  Contact Person..."
            >
              {originalGeneralData.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.ContactPerson} />
              ))}
            </ComboBox>
          </FlexBox>
          {console.log("originalGeneralData", originalGeneralData)}
          <Button
            style={{ width: "100px" }}
            onClick={clearFilter}
          >
            Clear Filter
          </Button>
        </FlexBox>
        {console.log("generalDtaanalyticaltable", generalData)}
        <AnalyticalTable
          data={generalData}
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



export default VendorDialog