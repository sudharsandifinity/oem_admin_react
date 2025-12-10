import {
  Button,
  CheckBox,
  DatePicker,
  Dialog,
  FlexBox,
  Icon,
  Input,
  Label,
  List,
  ListItemStandard,
  Option,
  Select,
  SuggestionItem,
  Text,
  TextArea,
} from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import "@ui5/webcomponents-icons/dist/value-help.js";

export const UserDefinedRenderInput = (
  formName,
  field,
  form,
  handleChange,
  inputvalue,
  setInputValue,
userdefinedData
) => {
  const value = form[field.field_name] ? form[field.field_name] : "";
  {
    console.log("inputvalueuserdefined", inputvalue,value),userdefinedData;
  }
  // Suggestion and dialog items
  const productCollection = [
    { Name: "Person1" },
    { Name: "Person2" },
    { Name: "Person3" },
    { Name: "Person4" },
  ];

  // Handle typing suggestion selection


  // Handle value help button click
  const handleValueHelpRequest = (field_name) => {
    setDialogOpen(true);
  };

  // Handle popup item click
  const handleDialogItemClick = (e) => {
    const selectedItem = e.detail.item.textContent;
    console.log("selectedItem", selectedItem);
    setInputValue(selectedItem);
    setDialogOpen(false);
  };

  const handleSelectChange = (e) => {
    console.log("handleselecchange", e,e.detail.selectedOption.innerText);
    const selectedOption = e.detail.selectedOption;
    setSelectedKey(selectedOption.innerText); // or use selectedOption.getAttribute("data-key")
  };
  console.log("userdefinedData",userdefinedData)
  switch (field.input_type) {
    case "text":
    case "number":
      return (
          <Input
           value={userdefinedData?.[field?.field_name] || ""}
            name={field.field_name}
            style={{width:"300px"}}
            onInput={(e) => handleChange(e, field.field_name, formName)}
            type={field.input_type}
          ></Input>
      );
    case "search":
      return (
        <Input
          placeholder="Search..."
          name={field.field_name}
          type="Search"
          onInput={(e) => console.log("Search input:", e.target.value)}
          onChange={(e) => console.log("Search committed:", e.target.value)}
        />
      );
    case "select":
      return (
        <>
          <Input
            icon={
              <Icon
                name="value-help"
                onClick={() => handleValueHelpRequest(field.field_name)}
              />
            }
            name={field.field_name}
           value={userdefinedData?.[field?.field_name] || ""}

            //onInput={(e) => handleChange(e, field.field_name,formName)}
            type={field.input_type}
            style={{
              width: "380px",
            }}
          >
            {productCollection.map((item, idx) => (
              <SuggestionItem key={idx} text={item.Name} />
            ))}
          </Input>

          <Dialog
            headerText="Select Person"
            open={dialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setDialogOpen(false)}
            footer={<Button onClick={() => setDialogOpen(false)}>Next</Button>}
          >
            <List onItemClick={handleDialogItemClick}>
              {productCollection.map((item, idx) => (
                <ListItemStandard key={idx} value={item.Name}>
                  {item.Name}
                </ListItemStandard>
              ))}
            </List>
          </Dialog>
          {/* <RenderCustomerDialog
            customerdialogOpen={customerdialogOpen}
            setCustomerDialogOpen={setCustomerDialogOpen}
            setInputValue={setInputValue}
          /> */}
        </>
      );
    case "date":
      return (
        <DatePicker
         value={userdefinedData?.[field?.field_name] || ""}
          name={field.field_name}
          onChange={(e) => handleChange(e, field.field_name, formName)}
        />
      );
    case "checkbox":
      return (
        <CheckBox
          checked={value}
          name={field.field_name}
          onChange={(e) => handleChange(e, field.field_name, formName)}
          text="CheckBox"
          valueState="None"
        />
      );
    case "selectdropdown":
      return (
        <>
          <Select
            onClose={function Xs() {}}
            name={field.field_name}
           value={userdefinedData?.[field?.field_name] || ""}

            onLiveChange={function Xs() {}}
            onOpen={function Xs() {}}
            valueState="None"
            onChange={(e) => {
              handleSelectChange(e);
              handleChange(e, field.field_name, formName);
            }}
            style={{
              width: "300px", // fixed width
              marginLeft: "0", // no left margin
              display: "block", // ensure it takes its own line
              textAlign: "left", // text starts from left inside input
            }}
          >
            <Option>Option 1</Option>
            <Option>Option 2</Option>
            <Option>Option 3</Option>
            <Option>Option 4</Option>
            <Option>Option 5</Option>
          </Select>{" "}
          <Label>{selectedKey}</Label>
        </>
      );
    case "textarea":
      return (
        <TextArea
         value={userdefinedData?.[field?.field_name] || ""}

          name={field.field_name}
          onChange={(e) => handleChange(e, field.field_name, formName)}
          onInput={(e) => handleChange(e, field.field_name, formName)}
        />
      );
    default:
      return null;
  }
};
