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
import CustomerPopupFilterDialog from "./CustomerPopupFilterDialog";

export const CustomerPopupFilterList = (field,tableData,settableData, handleChange) => {
  //const value = form[field.FieldName] || "";
  const [value, setvalue] = useState("");
 
const[selectedFieldname,setSelectedFieldname]=useState("")
  const [inputvalue, setInputValue] = useState([]);
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
    console.log("handleValueHelpRequest",fieldname)
    setSelectedFieldname(fieldname)
    if (fieldname === "Customer") {
      setCustomerDialogOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  // Handle popup item click
  const handleDialogItemClick = (e,fieldname) => {
    //const selectedItem = e.detail.item.textContent;
    console.log("selectedItem", fieldname,tableData);
     const filteredList = tableData.filter((item) => {
  return item[fieldname]
    ?.toString()
    .toLowerCase()
    .includes(e.detail.item.innerHTML.toLowerCase());
});
console.log("filteredList",filteredList)
    console.log("selectedItem", e.detail.item.innerHTML,tableData,fieldname);
    settableData(filteredList)
    setInputValue(e.detail.item.innerHTML);
    //setInputValue(fieldname);
    setDialogOpen(false);
  };
  console.log("inputvalue", field);
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
          <Input
            icon={<Icon name="value-help" onClick={()=>handleValueHelpRequest(field.FieldName)}/>}
            name={field.FieldName}
            value={inputvalue}
            onInput={(e) => handleChange(e, field.FieldName)}
            type={field.inputType}
            
          >
            {productCollection.map((item, idx) => (
              <SuggestionItem key={idx} text={item.Name} />
            ))}
          </Input>
          <CustomerPopupFilterDialog 
          selectedFieldname={selectedFieldname}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          tableData={tableData}
          settableData={settableData}
          handleDialogItemClick={handleDialogItemClick}/>
          
        </FlexBox>
      );
    default:
      return null;
  }
};
