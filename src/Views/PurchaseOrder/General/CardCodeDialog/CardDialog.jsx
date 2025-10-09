import React, { useState } from "react";
import { Dialog, Button, AnalyticalTable } from "@ui5/webcomponents-react";

const CardDialog = ({ open,setFormData, handleCardDialogClose, generalData, setSelectedCard,setSelectedCardCode }) => {
  const [selected, setSelected] = useState(null);

  const columns = [
    { Header: "Card Code", accessor: "CardCode" },
    { Header: "Card Name", accessor: "CardName" },
    { Header: "Contact Person", accessor: "ContactPerson" },
    { Header: "Series", accessor: "Series" }
  ];

  const handleSelectionChange = (event) => {
    const selectedRow = event.detail.row;
    console.log("selectedRow",selectedRow,event)
    if (selectedRow) {
      setSelected(selectedRow.original);
      setSelectedCardCode(selectedRow.original.CardCode)
      setFormData((prev) => ({
    ...prev,
    CardCode: selectedRow.original.CardCode,
  }));
    }
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
      headerText="Select Business Partner"
      footer={
        <>
          <Button design="Emphasized" onClick={handleOk}>
            OK
          </Button>
          <Button design="Transparent" onClick={handleCardDialogClose}>
            Cancel
          </Button>
        </>
      }
      onAfterClose={handleCardDialogClose}
      style={{ width: "60vw", height: "70vh" }}
    >
      <AnalyticalTable
        data={generalData}
        columns={columns}
        selectionMode="Single"
        onRowSelect={handleSelectionChange}
        style={{ height: "100%" }}
      />
    </Dialog>
  );
};

export default CardDialog;
