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

import { SalesOrderRenderInput } from "./SalesOrderRenderInput";
import General from "./General/General";
import Contents from "./Contents/Contents";
import Logistics from "./Logistics/Logistics";
import { useNavigate, useParams } from "react-router-dom";
import CustomerSelection from "./Header/CustomerSelection";
import Accounting from "./Accounting/Accounting";
import Attachments from "./Attachments/Attachments";
import UserDefinedFields from "./User-DefinedFields/UserDefinedFields";
import { useDispatch, useSelector } from "react-redux";
import { createCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import { createSalesQuotation } from "../../store/slices/SalesQuotationSlice";
import BarDesign from "@ui5/webcomponents/dist/types/BarDesign.js";

import { createPurchaseOrder } from "../../store/slices/PurchaseOrderSlice";
import { createPurchaseQuotation } from "../../store/slices/PurchaseQuotation";
import { createPurchaseRequest } from "../../store/slices/PurchaseRequestSlice";

export default function SalesOrder() {
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
  const [formDetails, setFormDetails] = useState([]);
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

  const [dimensionData, setDimensionData] = useState([]);
  const [currencyType, setCurrencyType] = useState("GBP");

  const [itemTabledata, setitemTableData] = useState([
    {
      slno: 1,
      ItemCode: "",
      ItemName: "",
      quantity: "",
      amount: "",
      TaxCode: "",
      Project: "",
      Warehouse: "",
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
      Project: "",
      Warehouse: "",
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
        dimensionData,
        itemTabledata,
        formData,
        freightRowSelection,
      );
      console.log("formDatahandlesubmit", formData);
      setLoading(true);
      let payload = {};
      const isPurchaseQuotation =
        formDetails[0]?.name === "Purchase Order" ||
        formDetails[0]?.name === "Purchase Quotation" ||
        formDetails[0]?.name === "Purchase Request";
      if (type === "Item") {
        payload = {
          CardCode: formData.CardCode || selectedcardcode,
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
          TaxDate: formData.TaxDate
            ? new Date(formData.TaxDate)
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
          ContactPerson: formData.ContactPerson || "",
          NumAtCard: formData.CustomerRefNo || "",
          DocType: "dDocument_Items",
          DocumentLines: itemTabledata.map((line) => ({
            ItemCode: line.ItemCode,
            ItemDescription: line.ItemName,
            Quantity: Number(line.quantity),
            UnitPrice: Number(line.amount),
            WarehouseCode: line.WarehouseCode,
            ProjectCode: line.ProjectCode,
            TaxCode: line.TaxCode,
            VatGroup: line.TaxCode,
            DiscountPercent: Number(line.discount),
            LineTotal: Number(line.total),
            CostingCode: line["1_ProfitCenterCode"] || null,
            CostingCode2: line["2_ProfitCenterCode"] || null,
            CostingCode3: line["3_ProfitCenterCode"] || null,
            CostingCode4: line["4_ProfitCenterCode"] || null,
            CostingCode5: line["5_ProfitCenterCode"] || null,
          })),

          data: userdefinedData || {},
          Rounding: summaryData.Rounding || "tNO",
          RoundingDiffAmount: summaryData.RoundingDiffAmount || 0,
          DiscountPercent: summaryData.DiscountPercent || 0,
          TotalDiscount: summaryData.TotalDiscount || 0,
          Comments: summaryData.Remark || "",
          VatSum: summaryData.VatSum || 0,
          DocumentAdditionalExpenses: Object.values(freightRowSelection).map(
            (freight) => ({
              //ExpensCode: Number(freight.ExpensCode),
              LineTotal: Number(freight.LineTotal),
              Remarks: freight.Remarks,
              TaxCode: freight.TaxCode,
              TaxPercent: Number(freight.TaxGroup),
              TaxSum: Number(freight.TotalTaxAmount),
              LineGross: Number(freight.LineGross),
            }),
          ),
        };
      } else {
        payload = {
          CardCode: formData.CardCode || selectedcardcode,
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
          TaxDate: formData.TaxDate
            ? new Date(formData.TaxDate)
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
          ContactPerson: formData.ContactPerson || "",
          NumAtCard: formData.CustomerRefNo || "",
          DocumentLines: serviceTabledata.map((line) => ({
            AccountCode: line.ServiceCode,
            ItemDescription: line.ServiceName,
            UnitPrice: Number(line.amount),
            WarehouseCode: line.WarehouseCode,
            ProjectCode: line.ProjectCode,
            TaxCode: line.TaxCode,
            VatGroup: line.TaxCode,
            DiscountPercent: Number(line.discount),
            LineTotal: Number(line.total),
            CostingCode: line["1_ProfitCenterCode"] || null,
            CostingCode2: line["2_ProfitCenterCode"] || null,
            CostingCode3: line["3_ProfitCenterCode"] || null,
            CostingCode4: line["4_ProfitCenterCode"] || null,
            CostingCode5: line["5_ProfitCenterCode"] || null,
          })),

          data: userdefinedData || {},
          Rounding: summaryData.Rounding || "tNO",
          RoundingDiffAmount: summaryData.RoundingDiffAmount || 0,
          DiscountPercent: summaryData.DiscountPercent || 0,
          TotalDiscount: summaryData.TotalDiscount || 0,
          Comments: summaryData.Remark || "",
          VatSum: summaryData.VatSum || 0,
          DocumentAdditionalExpenses: Object.values(freightRowSelection).map(
            (freight) => ({
              //ExpenseCode: Number(freight.ExpensCode),
              LineTotal: Number(freight.grossTotal),
              Remarks: freight.quantity,
              TaxCode: freight.TaxGroup,
              TaxPercent: Number(freight.TaxCode),
              TaxSum: Number(freight.TotalTaxAmount),
              LineGross: Number(freight.amount),
            }),
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
        JSON.stringify(payload.DocumentLines),
      );
      formDataToSend.append(
        "DocumentAdditionalExpenses",
        JSON.stringify(payload.DocumentAdditionalExpenses),
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
      setApiError(null);
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
  const getUserFriendlyMessage = (error) => {
    if (!error) return "An unexpected error occurred.";

    if (error.code === "-5002") {
      return "The selected customer is not valid for this document.";
    }

    if (error.code === "-10") {
      return "Tax information is missing or incorrect.";
    }

    if (error.message?.includes("Network")) {
      return "Unable to connect to the server.";
    }

    return "Please review the details and try again.";
  };
  console.log("freightRowSelection", freightRowSelection, formDetails);
  useEffect(() => {
    if (!user) return;
    if (formId) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter((submenu) => submenu.Form.id === formId),
        ),
      );
      setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);
      setFormDetails(formDetails);
    } else {
      navigate("/");
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
                    {formDetails ? "Create " + formDetails[0]?.name : "Create"}
                  </BreadcrumbsItem>
                </Breadcrumbs>
              </>
            }
            header={
              <Title level="H2">
                {formDetails ? formDetails[0]?.name : "Sales Order"}
              </Title>
            }
            navigationBar={<Toolbar design="Transparent"></Toolbar>}
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
          {/* <General form={form} SubForms={tab.SubForms} handleChange={handleChange} /> */}
          {console.log("generalformdata", formData)}
          <General
            onSubmit={handleSubmit}
            setFormData={setFormData}
            formData={formData}
            mode={"create"}
            selectedcardcode={selectedcardcode}
            setSelectedCardCode={setSelectedCardCode}
            formDetails={formDetails}
            currencyType={currencyType}
            setCurrencyType={setCurrencyType}
            defaultValues={{
              CardCode: "",
              DocDueDate: "1",
              TaxDate: "",
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
            dimensionData={dimensionData}
            setDimensionData={setDimensionData}
          />
        </ObjectPageSection>
        {/* );
        } else if (tab.name === "Logistics") { 
          return (  */}
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
        {/* );
        }
        else if (tab.name === "Accounting") {
          return (  */}
        <ObjectPageSection
          id="section4"
          style={{
            height: "100%",
          }}
          titleText="Accounting"
        >
          <Accounting />
        </ObjectPageSection>
        {/* );
        } else if (tab.name === "Attachments") {
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
        } else if (tab.name === "User-defined-field") {
          return (  */}
        <ObjectPageSection
          id="section6"
          style={{
            height: "100%",
          }}
          titleText="User-defined Fields"
        >
          <UserDefinedFields
            form={form}
            handleChange={handleChange}
            defaultValues={{
              CardCode: "",
              DocDueDate: "1",
              DocumentLines: [],
            }}
            formDetails={formDetails}
            apiError={apiError}
            onSubmit={handleSubmit}
            setFormData={setFormData}
            formData={formData}
            mode={"create"}
            userdefinedData={userdefinedData}
            setUserDefinedData={setUserDefinedData}
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
                style={{ fontSize: "1rem", color: "red" }}
              ></Icon>
              <h3 style={{ marginTop: "1rem" }}>
                {formDetails[0]?.name + " Not Created"}
              </h3>
              <p>{getUserFriendlyMessage(apiError)}</p>
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
              apiError ? setOpen(false) : navigate(`/Sales/${formId}`);
            }}
          >
            OK
          </Button>
        </div>
      </Dialog>
    </>
  );
}
