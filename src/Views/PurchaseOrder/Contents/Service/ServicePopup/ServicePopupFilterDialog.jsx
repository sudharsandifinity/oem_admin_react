import {
  Button,
  Dialog,
  Input,
  List,
  ListItemStandard,
} from "@ui5/webcomponents-react";
import React, { useState } from "react";

const ServicePopupFilterDialog = (props) => {
  const {
    setFilterDialogOpen,
    filterdialogOpen,
    servicepopupData,
    handleDialogServiceClick,
    fieldName,
  } = props;
  console.log("servicepopupData", servicepopupData);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog
      headerText={"Select " + fieldName + ""}
      open={filterdialogOpen}
      // style={{ width: "100px" }}
      onAfterClose={() => setFilterDialogOpen(false)}
      footer={<Button onClick={() => setFilterDialogOpen(false)}>Next</Button>}
    >
      <Input
        placeholder="Search..."
        value={searchTerm}
        onInput={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "0 0 0.5rem 0", width: "100%" }}
      />
      
      <List onItemClick={(e) => handleDialogServiceClick(e, fieldName)}>
        {servicepopupData &&
          servicepopupData
            .filter(
              (service, index, self) =>
                index ===
                self.findIndex((t) => t[fieldName] === service[fieldName])
            )
            .filter((service) =>
              service[fieldName]
                ?.toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((service, idx) => (
              <ListItemStandard key={idx} value={service[fieldName]}>
                {service[fieldName]}
              </ListItemStandard>
            ))}
      </List>
    </Dialog>
  );
};

export default ServicePopupFilterDialog;
