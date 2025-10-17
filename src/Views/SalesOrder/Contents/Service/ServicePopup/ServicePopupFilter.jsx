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
  TextArea,
} from "@ui5/webcomponents-react";
import React, { useEffect, useState } from "react";
import "@ui5/webcomponents-icons/dist/value-help.js";
import ServicePopupFilterDialog from "./ServicePopupFilterDialog";

export const ServicePopupFilter = (
  field,
  servicedata,
  setserviceData,
  handleChange
) => {
  //const value = form[field.FieldName] || "";
  const [value, setvalue] = useState("");
  const [fieldName, setfieldName] = useState(""); 

  const [inputvalue, setInputValue] = useState([]);
  const [filterdialogOpen, setFilterDialogOpen] = useState(false);

  // Suggestion and dialog services
  const productCollection = [
    { Name: "Person1" },
    { Name: "Person2" },
    { Name: "Person3" },
    { Name: "Person4" },
  ];

  // Handle typing suggestion selection
  const handleSuggestion = (e) => {
    const selectedService = e.detail.service.textContent;
    setInputValue(selectedService);
  };

  // Handle value help button click
  const handleValueHelpRequest = (fieldname) => {
    console.log("handleValueHelpRequest", fieldname);
    setFilterDialogOpen(true);
    setfieldName(fieldname);
  };

  // Handle popup service click
  const handleDialogServiceClick = (e, fieldname) => {
    //const selectedService = e.detail.service.textContent;
    const filteredList = servicedata.filter((service) => {
      return service[fieldname]
        ?.toString()
        .toLowerCase()
        .includes(e.detail.item.innerHTML.toLowerCase());
    });
    console.log("filteredList", filteredList);
    console.log(
      "selectedService",
      e.detail.item.innerHTML,
      servicedata,
      fieldname
    );
    setserviceData(filteredList);
    setInputValue(e.detail.item.innerHTML);
    setFilterDialogOpen(false);
  };

  switch (field.inputType) {
    case "text":
    case "number":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <Input
            type={field.inputType}
            value={value}
            onInput={(e) => handleChange(e, field.FieldName,"Service")}
          />
        </FlexBox>
      );
    case "date":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <DatePicker
            value={value}
            onChange={(e) => handleChange(e, field.FieldName,"Service")}
          />
        </FlexBox>
      );
    case "checkbox":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <CheckBox
            onChange={(e) => handleChange(e, field.FieldName,"Service")}
            text="CheckBox"
            valueState="None"
          />
        </FlexBox>
      );
    case "search":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <Input
            placeholder="Search..."
            type="Search"
            onInput={(e) => console.log("Search input:", e.target.value)}
            onChange={(e) => console.log("Search committed:", e.target.value)}
          />
        </FlexBox>
      );
    case "textarea":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <TextArea
            value={value}
            onInput={(e) => handleChange(e, field.FieldName,"Service")}
          />
        </FlexBox>
      );
    case "selectdropdown":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <Select
            onChange={function Xs() {}}
            onClose={function Xs() {}}
            onLiveChange={function Xs() {}}
            onOpen={function Xs() {}}
            valueState="None"
          >
            <Option>Option 1</Option>
            <Option>Option 2</Option>
            <Option>Option 3</Option>
            <Option>Option 4</Option>
            <Option>Option 5</Option>
          </Select>
        </FlexBox>
      );
    case "select":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <Input
            icon={
              <Icon
                name="value-help"
                onClick={() => handleValueHelpRequest(field.FieldName)}
              />
            }
            name={field.FieldName}
            value={inputvalue}
            onInput={(e) => {
              console.log("selectVal", e.target.value);
              handleChange(e, field.FieldName,"Service");
            }}
            type={field.inputType}
          >
            {productCollection.map((service, idx) => (
              <SuggestionItem key={idx} text={service.Name} />
            ))}
          </Input>

          <ServicePopupFilterDialog
            filterdialogOpen={filterdialogOpen}
            setFilterDialogOpen={setFilterDialogOpen}
            servicepopupData={servicedata}
            handleDialogServiceClick={handleDialogServiceClick}
            fieldName={field.FieldName}
          />
        </FlexBox>
      );
    default:
      return null;
  }
};
