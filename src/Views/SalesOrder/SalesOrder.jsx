// DynamicForm.jsx
import React, { useContext, useRef, useState } from "react";
import {
  Form,
  FormItem,
  Input,
  DatePicker,
  TextArea,
  Button,
  ObjectPage,
  Bar,
  ObjectPageHeader,
  FlexBox,
  Link,
  ObjectPageTitle,
  Toolbar,
  ToolbarButton,
  ObjectPageSection,
  Breadcrumbs,
  BreadcrumbsItem,
  Label,
  MessageStrip,
  Title,
  ObjectStatus,
  FormGroup,
  DynamicPageHeader,
  Slider,
  SuggestionItem,
  Dialog,
  List,
  ListItemStandard,
  Icon,
  CheckBox,
  Menu,
  MenuItem,
  MenuSeparator,
} from "@ui5/webcomponents-react";
import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import axios from "axios";
import { SalesOrderRenderInput } from "./SalesOrderRenderInput";
import General from "./General/General";
import Contents from "./Contents/Contents";
import Logistics from "./Logistics/Logistics";
import { useNavigate } from "react-router-dom";
import CustomerSelection from "./Header/CustomerSelection";
import Accounting from "./Accounting/Accounting";
import Attachments from "./Attachments/Attachments";
import UserDefinedFields from "./User-DefinedFields/UserDefinedFields";

export default function SalesOrder() {
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    CardCode: "",
    CardName: "",
    RefNo: "",
    DocNo: "",
    DocDate: "",
    Remarks: "",
    DocTotal: 0,
    items: [{ ItemCode: "", ItemName: "", Quantity: 0, Price: 0 }],
    cusDetail:[],
    U_Test1: "",
    U_Test2: "",
  });
  const menuRef = useRef();

  const openMenu = (e) => {
    menuRef.current.open = true;
    menuRef.current.opener = e.currentTarget;
  };
  const handleChange = (e, name,formName) => {
    const newValue = e.target.value;
    if(formName === "cusDetail" || formName === "docDetail") {
      
      setForm((prevForm) => ({
        ...prevForm,
        formName:[{[name]: newValue}],
      }));
      return;
    } else{
  setForm({ ...form, [name]: newValue });
    }

    // If the field is part of the "additional" section

    // Top-level fields
    
  };

  const handleRowChange = (i, name, key, value) => {
    //const key = tab === "Items" ? "items" : "additional";
    const newRows = [...form[key]];
    newRows[i][name] = value;
    setForm({ ...form, [key]: newRows });
  };

  const addRow = (key) => {
    //const key = tab === "Items" ? "items" : "additional";
    const newRow = { ItemCode: "", ItemName: "", Quantity: 0, Price: 0 };
    setForm({ ...form, [key]: [...form[key], newRow] });
  };

  const deleteRow = (i, key) => {
    //const key = tab === "Items" ? "items" : "additional";
    const newRows = form[key].filter((_, idx) => idx !== i);
    setForm({ ...form, [key]: newRows });
  };
  const handleSubmit = async () => {
    console.log("Form submitted:", form);
    // Post to backend here
    try {
      await axios.post("http://localhost:5000/api/save-form", form);
      alert("Form saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };
  const renderInput = (field) => {
    const value = form[field.FieldName] || "";

    switch (field.inputType) {
      case "text":
      case "number":
        return (
          <Input
            type={field.inputType}
            value={value}
            onInput={(e) => handleChange(e, field.FieldName)}
          />
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

  return (
    <ObjectPage
      footerArea={
        <>
          {" "}
          <Bar
            design="FloatingFooter"
            endContent={
              <>
                <Button design="Positive" onClick={() => handleSubmit()}>
                  Submit
                </Button>
                <Button design="Positive" onClick={() => navigate("/ManageSalesOrder")}>
                  Cancel
                </Button>
              </>
            }
          />
        </>
      }
      headerArea={
        <DynamicPageHeader>
          <FlexBox wrap="Wrap">
            <FlexBox direction="Column">
              <Label>Customer</Label>
            </FlexBox>
            <span style={{ width: "4rem" }} />
            <FlexBox direction="Column">
              <Label>Total:</Label>
              <ObjectStatus state="None">GBP 0.00</ObjectStatus>
            </FlexBox>
            <span style={{ width: "4rem" }} />
            <FlexBox direction="Column">
              <Label>Status</Label>
              <ObjectStatus state="Positive">Open</ObjectStatus>
            </FlexBox>
            <span style={{ width: "4rem" }} />
            <FlexBox direction="Column">
              <Label>Credit Limit Utilization</Label>
              <Slider
                min={0}
                max={100}
                step={1}
                //value={value}
                showTickmarks
                showTooltip
                //onInput={handleSliderChange}
              />
            </FlexBox>
          </FlexBox>
        </DynamicPageHeader>
      }
      // image="https://sap.github.io/ui5-webcomponents-react/v2/assets/Person-B7wHqdJw.png"
      imageShapeCircle
      mode="IconTabBar"
      onBeforeNavigate={function Xs() {}}
      onPinButtonToggle={function Xs() {}}
      onSelectedSectionChange={function Xs() {}}
      onToggleHeaderArea={function Xs() {}}
      selectedSectionId="section1"
      style={{
        height: "700px",
        maxHeight: "90vh",
      }}
      titleArea={
        <ObjectPageTitle
          breadcrumbs={
            <>
              
            <Breadcrumbs design="Standard"
                separators="Slash"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}>
              <BreadcrumbsItem  data-route="/UserDashboard">Home</BreadcrumbsItem>
              <BreadcrumbsItem data-route="/ManageSalesOrder">
                Manage Sales Order
              </BreadcrumbsItem>
              <BreadcrumbsItem>Sales Order</BreadcrumbsItem>
            </Breadcrumbs></>
          }
          header={<Title level="H2">Sales Order</Title>}
          navigationBar={
            <Toolbar design="Transparent">
              <ToolbarButton design="Transparent" icon="full-screen" />
              <ToolbarButton design="Transparent" icon="exit-full-screen" />
              
              
              <ToolbarButton
                onClick={() => navigate("/ManageSalesOrder")}
                design="Transparent"
                icon="decline"
              />
            </Toolbar>
          }
        >
          <ObjectStatus>1316
            {/* <Button design="Transparent" icon="navigation-right-arrow"  onClick={openMenu} >
                 Company
              </Button>
            <CustomerSelection menuRef={menuRef}/> */}
            
              </ObjectStatus>
        </ObjectPageTitle>
      }
    >
      <ObjectPageSection
        id="section1"
        style={{ height: "100%" }}
        titleText="General"
      >
        <General form={form}  handleChange={handleChange} />
      </ObjectPageSection>

      <ObjectPageSection
        id="section2"
        style={{
          height: "100%",
        }}
        titleText="Contents"
      >
        <Contents
          form={form}
          handleRowChange={handleRowChange}
          deleteRow={deleteRow}
          addRow={addRow}
          SalesOrderRenderInput={SalesOrderRenderInput}
          handleChange={handleChange}
        />
      </ObjectPageSection>
      <ObjectPageSection
        id="section3"
        style={{
          height: "100%",
        }}
        titleText="Logistics"
      >
        <Logistics
          fieldConfig={fieldConfig}
          SalesOrderRenderInput={SalesOrderRenderInput}
          form={form}
          handleChange={handleChange}
        />
      </ObjectPageSection>
      <ObjectPageSection
        id="section4"
        style={{
          height: "100%",
        }}
        titleText="Accounting"
      >
        <Accounting />
      </ObjectPageSection>
      <ObjectPageSection
        id="section5"
        style={{
          height: "100%",
        }}
        titleText="Attachments"
      >
        <Attachments />
      </ObjectPageSection>
      <ObjectPageSection
        id="section6"
        style={{
          height: "100%",
        }}
        titleText="User-defined Fields"
      >
        <UserDefinedFields form={form}
          handleChange={handleChange}/>
      </ObjectPageSection>
    </ObjectPage>
  );
}
