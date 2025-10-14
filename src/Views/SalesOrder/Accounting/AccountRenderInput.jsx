import {
  Button,
  CheckBox,
  DatePicker,
  Dialog,
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

export const AccountingRenderInput = (
  field,
  form,
  handleChange,
  inputvalue,
  setInputValue
) => {
  console.log("changeinputselect", form, field);
  const value = form[field.FieldName] || "";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerdialogOpen, setCustomerDialogOpen] = useState(false);

  // Suggestion and dialog items
  const productCollection = [
    { Name: "Person1" },
    { Name: "Person2" },
    { Name: "Person3" },
    { Name: "Person4" },
  ];

  // Handle typing suggestion selection
  const handleSuggestion = (e) => {
    const selectedItem = e.detail.item.textContent;
    setInputValue(selectedItem);
  };

  // Handle value help button click
  const handleValueHelpRequest = (fieldname) => {
    if (fieldname === "Customer") {
      setCustomerDialogOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  // Handle popup item click
  const handleDialogItemClick = (selectedItem) => {
    //const selectedItem = e.detail.item.textContent;
    console.log("selectedItem", selectedItem);
    setInputValue(selectedItem);
    setDialogOpen(false);
  };
  const [selectedKey, setSelectedKey] = useState("");

  const handleSelectChange = (e) => {
    const selectedOption = e.detail.selectedOption;
    setSelectedKey(selectedOption.innerText); // or use selectedOption.getAttribute("data-key")
  };
  switch (field.inputType) {
    case "text":
    case "number":
      return (
        <>
          {console.log("inputvaluetext", inputvalue && inputvalue)}
          <Input
            value={
              (inputvalue && inputvalue.map((val) => val[field.FieldName])) ||
              ""
            }
            name={field.FieldName}
            onInput={(e) => handleChange(e, field.FieldName)}
            type={field.inputType}
          ></Input>
        </>
      );
    case "select":
      return (
        <>
          <Input
            icon={
              <Icon
                name="value-help"
                onClick={() => handleValueHelpRequest(field.FieldName)}
              />
            }
            name={field.FieldName}
            value={(inputvalue && inputvalue.map((val) => val.BPCode)) || value}
            onInput={(e) => handleChange(e, field.FieldName)}
            type={field.inputType}
            style={{
              width: "320px",
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
            footer={<Button onClick={() => setDialogOpen(false)}>Close</Button>}
          >
            <List onItemClick={handleDialogItemClick}>
              {productCollection.map((item, idx) => (
                <ListItemStandard key={idx}>{item.Name}</ListItemStandard>
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
          value={value}
          onChange={(e) => handleChange(e, field.FieldName)}
        />
      );
    case "checkbox":
      return (
        <CheckBox
          onChange={(e) => handleChange(e, field.FieldName)}
          text="CheckBox"
          valueState="None"
        />
      );
    case "selectdropdown":
      return (
        <>
          <Select
            onClose={function Xs() {}}
            value={value}
            onLiveChange={function Xs() {}}
            onOpen={function Xs() {}}
            valueState="None"
            onChange={handleSelectChange}
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
          value={value}
          onInput={(e) => handleChange(e, field.FieldName)}
        />
      );
    default:
      return null;
  }
};
