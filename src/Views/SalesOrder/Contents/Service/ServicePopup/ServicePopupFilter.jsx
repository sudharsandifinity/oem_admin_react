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

export const ServicePopupFilter = (field, serviceData,setserviceData,inputvalue, setInputValue, handleChange) => {
  //const value = form[field.FieldName] || "";
  const [value, setvalue] = useState("");
  const [fieldName, setfieldName] = useState("");

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
    console.log("handleValueHelpRequest",fieldname)
    setFilterDialogOpen(true);
    setfieldName(fieldname)
  };

  // Handle popup service click
  const handleDialogServiceClick = (e,fieldname) => {
    //const selectedService = e.detail.service.textContent;\
    console.log("handleDialogServiceClicklog",e.detail.item.innerHTML.toLowerCase())
const filteredList = serviceData.filter((service) => {
  return service[fieldname]
    ?.toString()
    .toLowerCase()
    .includes(e.detail.item.innerHTML.toLowerCase());
});
console.log("filteredList",filteredList)
    console.log("selectedService", e.detail.item.innerHTML.toLowerCase(),serviceData,fieldname);
    setserviceData(filteredList)
   // setInputValue(e.detail.service.innerHTML);
      setInputValue((prev) => ({ ...prev, [fieldname]: e.detail.item.innerHTML }));
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
            onInput={(e) => handleChange(e, field.FieldName)}
          />
        </FlexBox>
      );
    case "date":
      return (
        <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <DatePicker
            value={value}
            onChange={(e) => handleChange(e, field.FieldName)}
          />
        </FlexBox>
      );
      case "checkbox":
        return(
          <FlexBox direction="Column">
          <Label>{field.DisplayName}</Label>
          <CheckBox
            onChange={(e) => handleChange(e, field.FieldName)}
            text="CheckBox"
            valueState="None"
          /></FlexBox>
        )
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
            onInput={(e) => handleChange(e, field.FieldName)}
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
          {console.log("servicepopupfilterinputval",inputvalue)}
          <Input
            icon={
              <Icon
                name="value-help"
                onClick={() => handleValueHelpRequest(field.FieldName)}
              />
            }
            name={field.FieldName}
            value={inputvalue[field.FieldName] || ""}
            onInput={(e) => {console.log("selectVal",e.target.value);handleChange(e, field.FieldName)}}
            type={field.inputType}

          >
            {productCollection.map((service, idx) => (
              <SuggestionItem key={idx} text={service.Name} />
            ))}
          </Input>
{console.log("fieldName",fieldName,serviceData)}
          <ServicePopupFilterDialog
            filterdialogOpen={filterdialogOpen}
            setFilterDialogOpen={setFilterDialogOpen}
            servicepopupData={serviceData}
            handleDialogServiceClick={handleDialogServiceClick}
            fieldName={field.FieldName}
          />
        </FlexBox>
      );
    default:
      return null;
  }
};
