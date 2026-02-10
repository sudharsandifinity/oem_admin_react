// DynamicForm.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
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
  BusyIndicator,
  Option,
  Select,
} from "@ui5/webcomponents-react";
import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import api from "../../api/axios";

import { SalesOrderRenderInput } from "../SalesOrder/SalesOrderRenderInput";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { createCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import { createSalesQuotation } from "../../store/slices/SalesQuotationSlice";
import BarDesign from "@ui5/webcomponents/dist/types/BarDesign.js";
import General from "./General/General";
import Contents from "./Contents/Contents";
import Attachments from "./Attachments/Attachments";

import { createPurchaseOrder } from "../../store/slices/PurchaseOrderSlice";
import { createPurchaseQuotation } from "../../store/slices/PurchaseQuotation";
import { createPurchaseRequest } from "../../store/slices/PurchaseRequestSlice";

export default function CreateInventory() {
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems } = useSelector((state) => state.orderItems);
  const [apiError, setApiError] = useState(null);
  const { formId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [formDetails, setFormDetails] = useState([{name:"Inventory",FormTabs:[]}]);
  const [formData, setFormData] = useState({});
  const [freightRowSelection, setFreightRowSelection] = useState([]);
  const [userdefinedData, setUserDefinedData] = useState({});
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Item");
  const [totalFreightAmount, setTotalFreightAmount] = useState(0);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [summaryDiscountPercent, setSummaryDiscountPercent] = useState(0);
  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState(0);
  const [roundingEnabled, setRoundingEnabled] = useState(false);
  const [roundOff, setRoundOff] = useState(0);
  const [selectedcardcode, setSelectedCardCode] = useState([]);

  const [itemTabledata, setitemTableData] = useState([
    {
      slno: 1,
      ItemCode: "",
      ItemName: "",
      quantity: "",
      amount: "",
      TaxCode: "",
      Project: "",
      Warehouse:""
    },
  ]);
  const [summaryData, setSummaryData] = useState({});
  const [itemdata, setitemData] = useState([
    { slno: 1, ItemCode: "", ItemName: "", quantity: "", amount: "" },
  ]);
  const [serviceTabledata, setserviceTableData] = useState([
    {
      slno: 1,
      ServiceCode: "",
      ServiceName: "",
      quantity: "",
      amount: "",
      TaxCode: "",
    },
  ]);
  const [servicedata, setserviceData] = useState([
    { slno: 1, ServiceCode: "", ServiceName: "", quantity: "", amount: "" },
  ]);
  const [form, setForm] = useState({
    CardCode: "",
    CardName: "",
    RefNo: "",
    DocNo: "",
    PostingDate: "",
    Remarks: "",
    DocTotal: 0,
    items: [{ ItemCode: "", ItemName: "", Quantity: 0, Price: 0 }],
    cusDetail: [],
    U_Test1: "",
    U_Test2: "",
  });

  const handleChange = (e, name, formName) => {
    const newValue = e.target.value;
    if (formName === "cusDetail" || formName === "docDetail") {
      setForm((prevForm) => ({
        ...prevForm,
        formName: [{ [name]: newValue }],
      }));
      return;
    } else {
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
    try {
      console.log(
        "itemTabledatahandleSubmit",
        itemTabledata,
        formData,
        freightRowSelection
      );
      setLoading(true);
      let payload = {};
      const isPurchaseQuotation = formDetails[0]?.name === "Purchase Quotation"|| formDetails[0]?.name === "Purchase Request";
      if (type === "Item") {
        payload = {
          CardCode: formData.CardCode,
          DocDate: formData.PostingDate
            ? new Date(formData.PostingDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          DocDueDate: formData.DocDueDate
            ? new Date(formData.DocDueDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          CreationDate: formData.CreationDate
            ? new Date(formData.CreationDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          ...(isPurchaseQuotation && {
            RequriedDate: formData.ReqDate
              ? new Date(formData.ReqDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "")
              : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          }),

          //DocEntry: formData.DocEntry,
          DocumentStatus: "open",
          ContactPerson: formData.ContactPerson,
          DocType: "dDocument_Items",
          DocumentLines: itemTabledata.map((line) => ({
            ItemCode: line.ItemCode,
            ItemDescription: line.ItemName,
            Quantity: line.quantity,
            UnitPrice: line.amount,
            TaxCode: line.TaxCode,
            VatGroup: line.TaxCode,
            DiscountPercent: line.discount,
            LineTotal: line.total,
          })),

          data: userdefinedData,
          Rounding: summaryData.Rounding,
          RoundingDiffAmount: summaryData.RoundingDiffAmount,
          DiscountPercent: summaryData.DiscountPercent,
          TotalDiscount: summaryData.TotalDiscount,
          Comments: summaryData.Remark,
          VatSum: summaryData.VatSum,
          DocumentAdditionalExpenses: Object.values(freightRowSelection).map(
            (freight) => ({
              ExpensCode: freight.ExpensCode,
              LineTotal: freight.LineTotal,
              Remarks: freight.Remarks,
              TaxCode: freight.TaxCode,
              TaxPercent: freight.TaxGroup,
              TaxSum: freight.TotalTaxAmount,
              LineGross: freight.LineGross,
            })
          ),
        };
      } else {
        payload = {
          CardCode: formData.CardCode,
          DocType: "dDocument_Service",
          DocDate: formData.PostingDate
            ? new Date(formData.PostingDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          DocDueDate: formData.DocDueDate
            ? new Date(formData.DocDueDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          CreationDate: formData.CreationDate
            ? new Date(formData.CreationDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          ...(isPurchaseQuotation && {
            RequriedDate: formData.ReqDate
              ? new Date(formData.ReqDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "")
              : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          }),
          //DocEntry: formData.DocEntry,
          DocumentStatus: "open",
          ContactPerson: formData.ContactPerson,

          DocumentLines: serviceTabledata.map((line) => ({
            AccountCode: line.ServiceCode,
            ItemDescription: line.ServiceName,
            TaxCode: line.TaxCode,
            UnitPrice: line.amount,
          })),

          data: userdefinedData,
          DocumentAdditionalExpenses: Object.values(freightRowSelection).map(
            (freight) => ({
              ExpenseCode: freight.ExpensCode,
              LineTotal: freight.grossTotal,
              Remarks: freight.quantity,
              TaxCode: freight.TaxGroup,
              TaxPercent: freight.TaxCode,
              TaxSum: freight.TotalTaxAmount,
              LineGross: freight.amount,
            })
          ),
        };
      }

      const formDataToSend = new FormData();
      attachmentsList.forEach((f) => {
        if (f.rawFile) {
          return formDataToSend.append("Attachments2_Lines", f.rawFile);
        }
      });

      formDataToSend.append(
        "DocumentLines",
        JSON.stringify(payload.DocumentLines)
      );
      formDataToSend.append(
        "DocumentAdditionalExpenses",
        JSON.stringify(payload.DocumentAdditionalExpenses)
      );
      formDataToSend.append("data", JSON.stringify(payload.data));

      Object.keys(payload).forEach((key) => {
        if (
          key !== "DocumentLines" &&
          key !== "data" &&
          key !== "DocumentAdditionalExpenses"
        ) {
          formDataToSend.append(key, payload[key]);
        }
      });
      console.log("formdatatosend", payload, formDataToSend, formDetails);
      let res = "";
      if (formDetails[0]?.name === "Sales Order") {
        res = await dispatch(createCustomerOrder(formDataToSend)).unwrap();
      } else if (formDetails[0]?.name === "Sales Quotation") {
        res = await dispatch(createSalesQuotation(formDataToSend)).unwrap();
      } else if (formDetails[0]?.name === "Purchase Order") {
        //dispatch(createPurchaseOrder(formDataToSend)).unwrap();
        res = await dispatch(createPurchaseOrder(formDataToSend)).unwrap();
      } else if (formDetails[0]?.name === "Purchase Quotation") {
        res = await dispatch(createPurchaseQuotation(formDataToSend)).unwrap();
      } else if (formDetails[0]?.name === "Purchase Request") {
        res = await dispatch(createPurchaseRequest(formDataToSend)).unwrap();
      }

      if (res.message === "Please Login!") {
        //navigate("/login");
        return;
      }

      setOpen(true);
    } catch (err) {
      console.error("Failed to create order:", err);
      setApiError(err.message || "Error creating order");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
      }, 2000);
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
 
  console.log(
    "freightRowSelection",
    freightRowSelection,formDetails
  );
  useEffect(() => {
    if (!user) return;
    if (formId) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter((submenu) => submenu.Form.id === formId)
        )
      );
      setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);
      setFormDetails(formDetails);
    } else {
      //navigate("/");
    }
  }, [formId, user]);
  return (
    <>
      <style>
        {`
            ._footer_17oaz_164{
              position: static
            }
          `}
      </style>
      <ObjectPage
        className="sales-order-page"
        footerArea={
          <Bar
            design={BarDesign.FloatingFooter}
            style={{ padding: 0.5, marginBottom: "16px" }}
            endContent={
              <>
                <Button design="Positive" onClick={() => handleSubmit()}>
                  Submit
                </Button>
                <Button
                  design="Positive"
                  onClick={() => navigate(`/Sales/${formId}`)}
                >
                  Cancel
                </Button>
              </>
            }
          />
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
          maxHeight: "95vh",
        }}
        titleArea={
          <ObjectPageTitle
            breadcrumbs={
              <>
                <Breadcrumbs
                  design="Standard"
                  separators="Slash"
                  onItemClick={(e) => {
                    const route = e.detail.item.dataset.route;
                    if (route) navigate(route);
                  }}
                >
                  <BreadcrumbsItem data-route="/dashboard">
                    Home
                  </BreadcrumbsItem>
                  <BreadcrumbsItem data-route={`/Sales/${formId}`}>
                    {formDetails
                      ? formDetails[0]?.name + " List "
                      : "Sales Orders"}
                  </BreadcrumbsItem>
                  <BreadcrumbsItem>
                    {formDetails
                      ? "Create " + formDetails[0]?.name
                      : "Create"}
                  </BreadcrumbsItem>
                </Breadcrumbs>
              </>
            }
            header={
              <Title level="H2">
                {formDetails ? formDetails[0]?.name : "Sales Order"}
              </Title>
            }
            navigationBar={
              <Toolbar design="Transparent">
               
              </Toolbar>
            }
          >
            <ObjectStatus>
              {/* <Button design="Transparent" icon="navigation-right-arrow"  onClick={openMenu} >
                 Company
              </Button>
            <CustomerSelection menuRef={menuRef}/> */}
            </ObjectStatus>
          </ObjectPageTitle>
        }
      >
        {/* {
      tabList.length > 0 && tabList.map((tab) => {
        console.log("object", tab);
        if (tab.name === "General") {
          return ( */}
        <ObjectPageSection
          id="section1"
          style={{ height: "100%" }}
          titleText="General"
        >
          {/* <General form={form} SubForms={""} handleChange={handleChange} /> */}
          {console.log("generalformdata", formData)}
         
          <General
            onSubmit={handleSubmit}
            setFormData={setFormData}
            formData={formData}
            mode={"create"}
            selectedcardcode={selectedcardcode}
            setSelectedCardCode={setSelectedCardCode}
            formDetails={formDetails}
            defaultValues={{
              CardCode: "",
              DocDueDate: "1",
              taxdate: "",
              PostingDate: "",
              DocumentLines: [],
            }}
            apiError={apiError}
          />
        </ObjectPageSection>
         {/* );
        } else if (tab.name === "Contents") {
          return ( */}
        <ObjectPageSection
          id="section2"
          style={{
            height: "100%",
          }}
          titleText="Contents"
        >
          <Contents
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            itemdata={itemdata}
            setitemData={setitemData}
            setitemTableData={setitemTableData}
            itemTabledata={itemTabledata}
            summaryData={summaryData}
            setSummaryData={setSummaryData}
            servicedata={servicedata}
            setserviceData={setserviceData}
            setserviceTableData={setserviceTableData}
            serviceTabledata={serviceTabledata}
            orderItems={orderItems}
            formDetails={formDetails}
            loading={loading}
            form={form}
            handleRowChange={handleRowChange}
            deleteRow={deleteRow}
            addRow={addRow}
            SalesOrderRenderInput={SalesOrderRenderInput}
            handleChange={handleChange}
            type={type}
            setType={setType}
            mode={"create"}
            totalFreightAmount={totalFreightAmount}
            setTotalFreightAmount={setTotalFreightAmount}
            onSubmit={handleSubmit}
            freightRowSelection={freightRowSelection}
            setFreightRowSelection={setFreightRowSelection}
            summaryDiscountAmount={summaryDiscountAmount}
            setSummaryDiscountAmount={setSummaryDiscountAmount}
            summaryDiscountPercent={summaryDiscountPercent}
            setSummaryDiscountPercent={setSummaryDiscountPercent}
            roundingEnabled={roundingEnabled}
            setRoundingEnabled={setRoundingEnabled}
            roundOff={roundOff}
            setRoundOff={setRoundOff}
          />
        </ObjectPageSection>
         {/* );
        } 
       else if (tab.name === "Attachments") {
          return (  */}
        <ObjectPageSection
          id="section5"
          style={{
            height: "100%",
          }}
          titleText="Attachments"
        >
          <Attachments
            onFilesChange={setAttachmentFiles}
            attachmentsList={attachmentsList}
            setAttachmentsList={setAttachmentsList}
          />
        </ObjectPageSection>
         {/* );
        }
      }) } */}
      </ObjectPage>
      {/* </BusyIndicator> */}
    
      <Dialog open={open} onAfterClose={() => setOpen(false)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {apiError ? (
            <>
              <Icon
                name="message-error"
                style={{ fontSize: "2rem", color: "red" }}
              ></Icon>
              <h2 style={{ marginTop: "1rem" }}>Error!</h2>
              <p>{apiError}</p>
            </>
          ) : (
            <>
              <Icon
                name="message-success"
                style={{ fontSize: "2rem", color: "green" }}
              ></Icon>
              <h2 style={{ marginTop: "1rem" }}>Success!</h2>
              <p>Your request has been submitted successfully 🎉</p>
            </>
          )}
          <Button
            design="Emphasized"
            onClick={() => {
              apiError ? setOpen(false):navigate(`/Sales/${formId}`) ;
            }}
          >
            OK
          </Button>
        </div>
      </Dialog>
    </>
  );
}
