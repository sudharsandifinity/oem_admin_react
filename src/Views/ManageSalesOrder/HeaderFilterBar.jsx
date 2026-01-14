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
import HeaderFilterDialog from "./HeaderFilterDialog";

export const HeaderFilterBar = ({
  field,
  tableData,
  settableData,
  handleChange,
  setFilters,
  filters,
  menuChildMap,
  settabledata,customerorder,isClearFilter,setisClearFilter,formDetails
}) => {
  const [value, setvalue] = useState("");
  const [fieldName, setfieldName] = useState("");
  const [filterdialogOpen, setFilterDialogOpen] = useState(false);
 const [inputvalue, setInputValue] = useState([]);
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
useEffect(()=>{
  if(isClearFilter===true){
    setisClearFilter(false)
      setInputValue([])
  }
},[isClearFilter])
  // Handle value help button click
  const handleValueHelpRequest = (fieldname) => {
    console.log("handleValueHelpRequest", fieldname);
    setFilterDialogOpen(true);
    setfieldName(fieldname);
  };

  // Handle popup item click
  const handleDialogItemClick = (e, fieldname) => {
    //const selectedItem = e.detail.item.textContent;
    const filteredList =
      tableData &&
      tableData.filter((item) => {
        return item[fieldname]
          ?.toString()
          .toLowerCase()
          .includes(e.detail.item.innerHTML.toLowerCase());
      });
    console.log("filteredList", filteredList);
    console.log("selectedItem", e.detail.item.innerHTML, tableData, fieldname);
    settableData(filteredList);
    setInputValue(e.detail.item.innerHTML);
    setFilterDialogOpen(false);
  };
  console.log("field", field);
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
              // <FlexBox direction="Column">
              //   <Label>From Date</Label>
              //   <DatePicker
              //     name="FromDate"
              //     value={filters.FromDate}
              //     onChange={(e) => handleChange(e, "FromDate")}
              //   />
              //   <Label>To Date</Label>
      
              //   <DatePicker
              //     name="ToDate"
              //     value={filters.ToDate}
              //     onChange={(e) => handleChange(e, "ToDate")}
              //   />
              // </FlexBox>
               <FlexBox direction="Column">
                <Label>{field.DisplayName}</Label>
                {console.log("filters[field.field_name]",field.FieldName,filters[field.FieldName],filters)}
                <DatePicker
                  name={field.FieldName}
                  value={filters[field.FieldName]}
                  onChange={(e) => handleChange(e, field.FieldName)}
                /></FlexBox>
            );
      
    case "checkbox":
      return (
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
            <Option>Open</Option>
            <Option>Closed</Option>
          </Select>
        </FlexBox>
      );
    case "select":
      return (
        <FlexBox direction="Column">
           <Label>
    {    menuChildMap[0]?.menuName === "Purchase" && field.FieldName === "CustomerCode"
      ? "Vendor Code"
      : menuChildMap[0]?.menuName === "Purchase" && field.FieldName === "CustomerName"
      ? "Vendor Name"
      : field.DisplayName}
  </Label>
          <Input
            icon={
              <Icon
                name="value-help"
                onClick={() => handleValueHelpRequest(field.FieldName)}
              />
            }
            name={field.FieldName}
            value={inputvalue}
            style={{ width: "250px" }}
            onInput={(e) => {
              console.log("selectVal", e.target.value);
              handleChange(e, field.FieldName);
            }}
            type={field.inputType}
          >
            {productCollection
              .filter(
                (item, index, self) =>
                  index === self.findIndex((t) => t.Name === item.Name)
              )
              .map((item, idx) => (
                <SuggestionItem key={idx} text={item.Name} />
              ))}
          </Input>

          <HeaderFilterDialog
            filterdialogOpen={filterdialogOpen}
            setFilterDialogOpen={setFilterDialogOpen}
            itempopupData={tableData}
            handleDialogItemClick={handleDialogItemClick}
            fieldName={field.FieldName}
          />
        </FlexBox>
      );
    default:
      return  null;
  }
  
};
