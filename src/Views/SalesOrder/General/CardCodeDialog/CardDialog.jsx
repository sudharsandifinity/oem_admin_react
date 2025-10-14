import React, { useEffect, useState } from "react";
import {
  Dialog,
  Button,
  AnalyticalTable,
  FlexBox,
  Label,
  Select,
  Option,
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
  inputValue, setInputValue
}) => {
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      Header: "Card Code",
      accessor: "CardCode",
    },
    { Header: "Card Name", accessor: "CardName" },
    { Header: "Contact Person", accessor: "ContactPerson" },
    { Header: "Series", accessor: "Series" },
  ];

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
        handleCardDialogClose();
      }, 1000);
    }
  };

  const handleFilterChange = (e, fieldname) => {
    const selectedOption = e.detail.selectedOption;
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
          <Button design="Emphasized" onClick={handleOk}>
            OK
          </Button>
        </>
      }
      onAfterClose={handleCardDialogClose}
      style={{ width: "70vw", height: "70vh" }}
    >
      <FlexBox direction="Column">
        <FlexBox direction="Row" style={{ padding: "0.5rem", gap: "2rem" }}>
          <FlexBox direction="Column">
            <Label>CardCode</Label>
            {console.log("inputValue.CardCode ", inputValue)}
            <Select
              onChange={(e) => handleFilterChange(e, "CardCode")}
              value={inputValue.CardCode || ""}
              valueState="None"
            >
              <Option value="">Select</Option>
              {generalData &&
                generalData.map((data, index) => (
                  <Option key={index} value={data.CardCode}>
                    {data.CardCode}
                  </Option>
                ))}
            </Select>
          </FlexBox>

          <FlexBox direction="Column">
            <Label>Card Name</Label>
            <Select
              onChange={(e) => handleFilterChange(e, "CardName")}
              onClose={function Xs() {}}
              onLiveChange={function Xs() {}}
              onOpen={function Xs() {}}
              value={inputValue.CardName || ""}
              valueState="None"
            >
              <Option>Select</Option>
              {generalData &&
                generalData.map((data, index) => (
                  <Option key={index} value={data.CardName}>
                    {data.CardName}
                  </Option>
                ))}
            </Select>
          </FlexBox>
          <FlexBox direction="Column">
            <Label>Contact Person</Label>
            <Select
              onChange={(e) => handleFilterChange(e, "ContactPerson")}
              onClose={function Xs() {}}
              onLiveChange={function Xs() {}}
              onOpen={function Xs() {}}
              value={inputValue.ContactPerson || ""}
              valueState="None"
            >
              <Option>Select</Option>
              {generalData &&
                generalData.map((data, index) => (
                  <Option key={index} value={data.ContactPerson}>
                    {data.ContactPerson}
                  </Option>
                ))}
            </Select>
          </FlexBox>
          {console.log("originalGeneralData", originalGeneralData)}
          <Button
            style={{ width: "100px" }}
            onClick={() => {
              setgeneralData(originalGeneralData);
              setInputValue({});
            }}
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
          getRowProps={(row) => ({
            onDoubleClick: () => handleOk(row),
            style: { cursor: "pointer" }, // optional: visual cue
          })}
          style={{ height: "100%" }}
        />
      </FlexBox>
    </Dialog>
  );
};

export default CardDialog;
