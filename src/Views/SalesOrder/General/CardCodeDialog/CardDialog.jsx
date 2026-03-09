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

const CardDialog = ({
  open,
  setFormData,
  handleCardDialogClose,
  generalData,
  setSelectedCard,
  setSelectedCardCode,
  setgeneralData,
  originalGeneralData,
  setOriginalgeneralData,
  inputValue,
  setInputValue,
}) => {
  const [selected, setSelected] = useState(null);

  const columns = [
   
    {
      Header: "Card Code",
      accessor: "CardCode",
      width: 200,
    },
    { Header: "Card Name", accessor: "CardName" },
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
      setSelectedCardCode(selectedRow.original.CardCode);
      setFormData((prev) => ({
        ...prev,
        CardCode: selectedRow.original.CardCode,
      }));
      setTimeout(() => {
        clearFilter();
        handleCardDialogClose();
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
      setSelectedCard(selected); // send full row back
    }
    handleCardDialogClose();
  };

  return (
    <Dialog
      open={open}
      headerText="Select Card Details"
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
      onAfterClose={handleCardDialogClose}
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
          }}
        >
          <FlexBox direction="Column">
            {" "}
            <Label>Card Code</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "CardCode")}
              value={inputValue.CardCode || ""}
            >
              <Option value=""></Option>
              {originalGeneralData.map((data, index) => (
                <Option key={index} value={data.CardCode}>
                  {data.CardCode}
                </Option>
              ))}
            </Select> */}
            <ComboBox
              filter
              value={inputValue.CardCode || ""}
              onChange={(e) => handleFilterChange(e, "CardCode")}
              placeholder="Search Card Code..."
            >
              {originalGeneralData.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.CardCode} />
              ))}
            </ComboBox>
          </FlexBox>
          <FlexBox direction="Column">
            {" "}
            <Label>Card Name</Label>
            {/* <Select
              onChange={(e) => handleFilterChange(e, "CardName")}
              value={inputValue.CardName || ""}
            >
              <Option value=""></Option>
              {originalGeneralData.map((data, index) => (
                <Option key={index} value={data.CardName}>
                  {data.CardName}
                </Option>
              ))}
            </Select> */}
              <ComboBox
              filter
              value={inputValue.CardName || ""}
              onChange={(e) => handleFilterChange(e, "CardName")}
              placeholder="Search Card Name..."
            >
              {originalGeneralData.map((data, idx) => (
                <ComboBoxItem key={idx} text={data.CardName} />
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
         visibleRows={6}
        />
      </FlexBox>
    </Dialog>
  );
};

export default CardDialog;
