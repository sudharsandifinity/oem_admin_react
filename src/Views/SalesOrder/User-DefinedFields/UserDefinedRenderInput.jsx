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
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  Select,
  SuggestionItem,
  Text,
  TextArea,
} from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import "@ui5/webcomponents-icons/dist/value-help.js";
import CardDialog from "./CardCodeDialog/CardDialog";

export const UserDefinedRenderInput = (
  formName,
  field,
  form,
  handleChange,
  inputvalue,
  setInputValue,
  userdefinedData,
  setUserDefinedData,
  dialogOpen,
  setDialogOpen,
  selectedKey,
  mode,
  setSelectedKey,
  setFormData,
  setValue,
  generalData,
  setgeneralData,
  originalGeneralData,
  setOriginalgeneralData,
  selectedcardcode,
  setSelectedCardCode,
  selectedCard,
  setSelectedCard,
) => {
  const value = form[field.field_name] ? form[field.field_name] : "";
  {
    console.log("inputvalueuserdefined", inputvalue, value), userdefinedData;
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
    console.log("handleselecchange", e, e.detail.selectedOption.innerText);
    const selectedOption = e.detail.selectedOption;
    setSelectedKey(selectedOption.innerText); // or use selectedOption.getAttribute("data-key")
  };
  console.log("userdefinedData", userdefinedData);
  
  switch (field.input_type) {
    case "text":
    case "number":
      return (
        <Input
          value={userdefinedData?.[field?.field_name] || ""}
          name={field.field_name}
          disabled={mode === "view"}
          //style={{width:"300px"}}
          //style={{ width: "100%" }}
          onInput={(e) => handleChange(e, field.field_name, formName)}
          type={field.input_type}
        ></Input>
      );
    case "search":
      return (
        <Input
          placeholder="Search..."
          name={field.field_name}
          disabled={mode === "view"}
          type="Search"
          style={{ width: "100%" }}
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
            disabled={mode === "view"}
            name={field.field_name}
            value={userdefinedData?.CardCode || ""}
            //onInput={(e) => handleChange(e, field.field_name,formName)}
            type={field.input_type}
            //style={{ width: "100%" }}
          >
            {productCollection.map((item, idx) => (
              <SuggestionItem key={idx} text={item.Name} />
            ))}
          </Input>
         {originalGeneralData.length>0? <CardDialog
            open={dialogOpen}
            handleCardDialogClose={setDialogOpen}
            generalData={generalData}
            setgeneralData={setgeneralData}
            setSelectedCardCode={setSelectedCardCode}
            setFormData={setFormData}
            originalGeneralData={originalGeneralData}
            setOriginalgeneralData={setOriginalgeneralData}
            inputValue={inputvalue}
            setInputValue={setInputValue}
            userdefinedData={userdefinedData}
            setUserDefinedData={setUserDefinedData}
            setSelectedCard={(card) => {
              setSelectedCard(card);
              setValue("CardCode", card.CardCode); // update RHF field
              setValue("CardName", card.CardName); // fill another field automatically
              setValue("ContactPerson", card.ContactPerson);
              setValue("Series", card.Series);
            }}
          />: null}
          {/* <Dialog
            headerText="Select Person"
            open={dialogOpen}
            // style={{ width: "100px" }}
            onAfterClose={() => setDialogOpen(false)}
            footer={<Button onClick={() => setDialogOpen(false)}>Close</Button>}
          >
            <List onItemClick={handleDialogItemClick}>
              {productCollection.map((item, idx) => (
                <ListItemStandard key={idx} value={item.Name}>
                  {item.Name}
                </ListItemStandard>
              ))}
            </List>
          </Dialog> */}
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
          disabled={mode === "view"}
          style={{ width: "100%" }}
          onChange={(e) => handleChange(e, field.field_name, formName)}
        />
      );
    case "checkbox":
      return (
        <CheckBox
          checked={value}
          disabled={mode === "view"}
          name={field.field_name}
          onChange={(e) => handleChange(e, field.field_name, formName)}
          text="CheckBox"
          valueState="None"
        />
      );
    case "selectdropdown":
      return (
        <MultiComboBox
          onChange={(e) => {
            const selected = e.detail.items.map((i) =>
              i.getAttribute("data-value")
            );
            handleChange(e, field.field_name, formName);
          }}
        >
          <MultiComboBoxItem data-value="us" text="United States" />
          <MultiComboBoxItem data-value="ca" text="Canada" />
          <MultiComboBoxItem data-value="ae" text="UAE" />
        </MultiComboBox>
        // <Select
        //   onClose={function Xs() {}}
        //   name={field.field_name}
        //   value={userdefinedData?.[field?.field_name] || ""}
        //   onLiveChange={function Xs() {}}
        //   onOpen={function Xs() {}}
        //   valueState="None"
        // style={{ width: "100%" }}

        //   onChange={(e) => {
        //     handleSelectChange(e);
        //     handleChange(e, field.field_name, formName);
        //   }}
        // >
        //   <Option>Option 1</Option>
        //   <Option>Option 2</Option>
        //   <Option>Option 3</Option>
        //   <Option>Option 4</Option>
        //   <Option>Option 5</Option>
        // </Select>
      );
    case "textarea":
      return (
        <TextArea
          value={userdefinedData?.[field?.field_name] || ""}
          style={{ width: "100%" }}
          disabled={mode === "view"}
          name={field.field_name}
          onChange={(e) => handleChange(e, field.field_name, formName)}
          onInput={(e) => handleChange(e, field.field_name, formName)}
        />
      );
    default:
      return null;
  }
};
