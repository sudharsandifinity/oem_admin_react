import {
  Button,
  Dialog,
  Input,
  List,
  ListItemStandard,
} from "@ui5/webcomponents-react";
import React, { useState } from "react";

const ProfitCentrePopupFilterDialog = (props) => {
  const {
    setFilterDialogOpen,
    filterdialogOpen,
    itempopupData,
    handleDialogItemClick,
    fieldName,
  } = props;
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Dialog
      headerText={"Select " + fieldName + ""}
      open={filterdialogOpen}
      // style={{ width: "100px" }}
      onAfterClose={() => setFilterDialogOpen(false)}
      footer={<Button onClick={() => setFilterDialogOpen(false)}>Next</Button>}
      style={{height:"50%"}}
    >
      <Input
        placeholder="Search..."
        value={searchTerm}
        onInput={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "0 0 0.5rem 0", width: "100%" }}
      />
     <List onItemClick={(e) => handleDialogItemClick(e, fieldName)}>
             {itempopupData &&
               itempopupData
                 .filter(
                   (item, index, self) =>
                     index === self.findIndex((t) => t[fieldName] === item[fieldName])
                 )
                 .filter((item) =>
                   item[fieldName]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                 )
                 .map((item, idx) => (
                   <ListItemStandard key={idx} value={item[fieldName]}>
                     {item[fieldName]}
                   </ListItemStandard>
                 ))
             }
           </List>
    </Dialog>
  );
};

export default ProfitCentrePopupFilterDialog;
