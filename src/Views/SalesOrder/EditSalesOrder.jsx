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
} from "@ui5/webcomponents-react";
import { FormConfigContext } from "../../Components/Context/FormConfigContext";

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
import {
  fetchCustomerOrderById,
  updateCustomerOrder,
} from "../../store/slices/CustomerOrderSlice";
import { fetchOrderItems } from "../../store/slices/CustomerOrderItemsSlice";
import { fetchOrderServices } from "../../store/slices/CustomerOrderServiceSlice";
import { fetchAttachmentDetailsById } from "../../store/slices/salesAdditionalDetailsSlice";
import {
  fetchSalesQuotationById,
  updateSalesQuotation,
} from "../../store/slices/SalesQuotationSlice";
import { fetchVendorOrderById } from "../../store/slices/VendorOrderSlice";

const EditSalesOrder = () => {
  const { id, formId } = useParams();
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems } = useSelector((state) => state.orderItems);
  const [apiError, setApiError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [attachmentsList, setAttachmentsList] = useState([]);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [oldAttachmentFiles, setOldAttachmentFiles] = useState([]);
  const [freightRowSelection, setFreightRowSelection] = useState([]);

  const [tabList, setTabList] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [userdefinedData, setUserDefinedData] = useState({});

  const [rowSelection, setRowSelection] = useState({});
  const [generaleditdata, setgeneraleditdata] = useState([]);
  const [type, setType] = useState("Item");
  const [totalFreightAmount, setTotalFreightAmount] = useState(0);
  const [summaryData, setSummaryData] = useState({});
  const [summaryDiscountPercent, setSummaryDiscountPercent] = useState(0);
  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState(0);
  const [roundingEnabled, setRoundingEnabled] = useState(false);
      const [selectedcardcode, setSelectedCardCode] = useState([]);
  const [roundOff, setRoundOff] = useState(0);

  const [itemdata, setitemData] = useState([
    {
      slno: 1,
      ItemCode: "",
      ItemName: "",
      quantity: "",
      amount: "",
      TaxCode: "",
    },
  ]);
  const [itemTabledata, setitemTableData] = useState([
    { slno: 1, ItemCode: "", ItemName: "", quantity: "", amount: "" },
  ]);
  const [serviceTabledata, setserviceTableData] = useState([
    { slno: 1, ServiceCode: "", ServiceName: "", quantity: "", amount: "" },
  ]);
  const [servicedata, setserviceData] = useState([
    { slno: 1, ServiceCode: "", ServiceName: "", quantity: "", amount: "" },
  ]);
  const [form, setForm] = useState({
    CardCode: "",
    CardName: "",
    RefNo: "",
    DocNo: "",
    DocDate: "",
    Remarks: "",
    DocTotal: 0,
    items: [{ ItemCode: "", ItemName: "", Quantity: 0, Price: 0 }],
    cusDetail: [],
    U_Test1: "",
    U_Test2: "",
  });
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!formDetails || formDetails.length === 0) return;  
  if (!formDetails[0]?.name) return;                    

  const fetchData = async () => {
    setLoading(true);

    try {
      let orderListById = "";

      // ✅ Fetch based on form type
      switch (formDetails[0].name) {
        case "Sales Order":
          orderListById = await dispatch(fetchCustomerOrderById(id)).unwrap();
          break;

        case "Sales Quotation":
          orderListById = await dispatch(fetchSalesQuotationById(id)).unwrap();
          break;

        case "Purchase Order":
          orderListById = await dispatch(fetchVendorOrderById(id)).unwrap();
          break;

        default:
          console.warn("Unknown form:", formDetails[0].name);
          return;
      }

        const orderList = await dispatch(fetchOrderItems()).unwrap();
        const serviceList = await dispatch(fetchOrderServices()).unwrap();
        console.log("res,res1", orderListById, orderList, serviceList);
        if(orderListById.AttachmentEntry){
          const attachmentListById = await dispatch(fetchAttachmentDetailsById(orderListById.AttachmentEntry)).unwrap();
          console.log("attachmentListById", attachmentListById);
          setOldAttachmentFiles(prev => ({
            ...prev,
            Attachments2_Lines: attachmentListById.Attachments2_Lines
          }));
        }
        if (orderListById) {
          // 1. Store order header info
setSelectedCardCode(orderListById.CardCode);
          setFormData({
            CardCode: orderListById.CardCode,
            CardName: orderListById.CardName,
            DocDueDate: orderListById.DocDueDate
              ? new Date(orderListById.DocDueDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            DocDate: orderListById.DocDate
              ? new Date(orderListById.DocDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            CreationDate: orderListById.CreationDate
              ? new Date(orderListById.CreationDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            DocumentLines: orderListById.DocumentLines || [],
            formData: orderListById.formData,
          });
          // 2. Merge document lines into orderItems
          if (orderListById.DocumentLines?.length > 0) {
            if (orderListById.DocType === "dDocument_Items") {
              setType("Item");
              setitemData(
                () =>
                  orderList.value
                    .map((item, index) => {
                      const matched = orderListById.DocumentLines.find(
                        (line) => line.ItemCode === item.ItemCode
                      );
                      console.log("setitemeditpage", item, matched);
                      return matched !== undefined
                        ? {
                            slno: index, // usually LineNum is 0-based
                            ItemCode: matched.ItemCode,
                            ItemName: matched.ItemDescription,
                            quantity: matched.Quantity,
                            TaxCode: matched.TaxCode,
                            amount: matched.UnitPrice,
                            discount: matched.DiscountPercent,
                            TaxRate: matched.TaxTotal,
                          }
                        : {
                            slno: index, // usually LineNum is 0-based
                            ItemCode: item.ItemCode,
                            ItemName: item.ItemName,
                            quantity: item.Quantity,
                            TaxCode: item.TaxCode,
                            amount: item.UnitPrice,
                            discount: item.DiscountPercent,
                            TaxRate: item.TaxTotal,
                          }; // no placeholder
                    })
                    .filter(Boolean) // remove nulls
              );
              setitemTableData(
                () =>
                  orderList.value
                    .map((item) => {
                      const matched = orderListById.DocumentLines.find(
                        (line) => line.ItemCode === item.ItemCode
                      );

                      return matched
                        ? {
                            slno: matched.LineNum + 1, // usually LineNum is 0-based
                            ItemCode: matched.ItemCode,
                            ItemName: matched.ItemDescription,
                            quantity: matched.Quantity,
                            TaxCode: matched.TaxCode,
                            amount: matched.UnitPrice,
                            discount: matched.DiscountPercent,
                            TaxRate: matched.TaxTotal,
                          }
                        : null; // no placeholder
                    })
                    .filter(Boolean) // remove nulls
              );
              if (orderList.value?.length > 0) {
                const preselected = {};
                orderListById.DocumentLines.forEach((line) => {
                  const idx = orderList.value.findIndex(
                    (o) => o.ItemCode === line.ItemCode
                  );
                  if (idx !== -1) {
                    preselected[idx] = orderList.value[idx];
                  }
                });
                setRowSelection(preselected);
              }
            } else {
              console.log("serviceList", serviceList);
              setType("Service");
              setserviceData(
                () =>
                  serviceList.value
                    .map((item, index) => {
                      const matched = orderListById.DocumentLines.find(
                        (line) => line.AccountCode === item.Code
                      );
                      return matched !== undefined
                        ? {
                            slno: index, // usually LineNum is 0-based
                            ServiceCode: matched.AccountCode,
                            ServiceName: matched.ItemDescription,
                            quantity: matched.Quantity,
                            TaxCode: matched.TaxCode,
                            amount: matched.UnitPrice,
                            discount: matched.DiscountPercent,
                            TaxRate: matched.TaxTotal,
                          }
                        : {
                            slno: index, // usually LineNum is 0-based
                            ServiceCode: item.AccountCode,
                            ServiceName: item.ItemDescription,
                            quantity: item.Quantity,
                            TaxCode: item.TaxCode,
                            amount: item.UnitPrice,
                            discount: item.DiscountPercent,
                            TaxRate: item.TaxTotal,
                          }; // no placeholder
                    })
                    .filter(Boolean) // remove nulls
              );
              setserviceTableData(
                () =>
                  serviceList.value
                    .map((item) => {
                      const matched = orderListById.DocumentLines.find(
                        (line) => line.AccountCode === item.Code
                      );

                      return matched
                        ? {
                            slno: matched.LineNum + 1, // usually LineNum is 0-based
                            ServiceCode: matched.AccountCode,
                            ServiceName: matched.ItemDescription,
                            quantity: matched.Quantity,
                            TaxCode: matched.TaxCode,
                            amount: matched.UnitPrice,
                            discount: matched.DiscountPercent,
                            TaxRate: matched.TaxTotal,
                          }
                        : null; // no placeholder
                    })
                    .filter(Boolean) // remove nulls
              );
              if (serviceList.value?.length > 0) {
                const preselected = {};
                orderListById.DocumentLines.forEach((line) => {
                  const idx = serviceList.value.findIndex(
                    (o) => o.Code === line.AccountCode
                  );
                  if (idx !== -1) {
                    preselected[idx] = orderList.value[idx];
                  }
                });
                setRowSelection(preselected);
              }
            }

            console.log(
              "itemTabledata:->",
              itemTabledata,
              itemdata,
              orderListById.DocumentLines,
              orderListById,
              "formData",
              formData
            );

            // 3. Preselect rows
          }
          setSummaryData((prev) => ({
            ...prev,
            Remark: orderListById.Comments,
          }));
          // set general header edit data
          setSummaryDiscountPercent(orderListById.DiscountPercent);
          setRoundingEnabled(orderListById.Rounding === "tYES");
          setRoundOff(orderListById.RoundingDiffAmount);
          setgeneraleditdata({
            CardCode: orderListById.CardCode,
            CardName: orderListById.CardName,
            PostingDate: orderListById.CreationDate,
            DocDate: orderListById.DocDate
              ? new Date(orderListById.DocDate).toISOString().split("T")[0]
              : "",
            DeliveryDate: orderListById.DocDueDate
              ? new Date(orderListById.DocDueDate).toISOString().split("T")[0]
              : "",
            DocEntry: orderListById.DocEntry,
            DocumentStatus: orderListById.DocumentStatus,
          });
          setUserDefinedData(orderListById.formData);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
}, [dispatch, id, formDetails])

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
  const handleSubmit = async (form) => {
    console.log("Form submitted:", formData, itemTabledata, itemdata);
    let filteredData = [];
    if (itemdata.length === 1 && itemdata[0].ItemCode === "") {
      filteredData = itemTabledata;
    } else {
      filteredData = itemdata.filter((item) =>
        itemTabledata.some(
          (tableItem) =>
            tableItem.ItemCode === item.ItemCode &&
            tableItem.ItemName === item.ItemName
        )
      );
    }
    //   const filteredData = itemdata.filter(item =>
    //   itemTabledata.some(
    //     tableItem =>
    //       tableItem.ItemCode === item.ItemCode &&
    //       tableItem.ItemName === item.ItemName
    //   )
    // );

    let payload = {};
    try {
      setLoading(true);
      if (type === "Item") {
        payload = {
          CardCode: formData.CardCode,
          DocDueDate: formData.DocDueDate
            ? new Date(formData.DocDueDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          DocType: "dDocument_Items",
          DocumentLines: Object.values(itemTabledata).map((line) => ({
            ItemCode: line.ItemCode,
            ItemDescription: line.ItemName, // ✅ rename to ItemDescription
            Quantity: line.quantity,
            UnitPrice: line.amount,
            TaxCode: line.TaxCode,
            VatGroup: line.TaxCode,
            DiscountPercent: line.discount,
            LineTotal: line.total,
          })),
          data: userdefinedData,
          DocTotal: summaryData.DocTotal,
          Rounding: summaryData.Rounding,
          RoundingDiffAmount: summaryData.RoundingDiffAmount,
          DiscountPercent: summaryData.DiscountPercent,
          TotalDiscount: summaryData.TotalDiscount,
          Comments: summaryData.Remark,
          VatSum: summaryData.VatSum,
          //freight: totalFreightAmount,
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
      } else {
        payload = {
          CardCode: formData.CardCode,
          DocType: "dDocument_Service",
          DocDueDate: formData.DocDueDate
            ? new Date(formData.DocDueDate)
                .toISOString()
                .split("T")[0]
                .replace(/-/g, "")
            : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          DocumentLines: Object.values(serviceTabledata).map((line) => ({
            AccountCode: line.ServiceCode,
            ItemDescription: line.ServiceName, // ✅ rename to ItemDescription
            TaxCode: line.TaxCode,
            UnitPrice: line.amount,
          })),
          data: userdefinedData,
          DocTotal: summaryData.DocTotal,
          Rounding: summaryData.Rounding,
          RoundingDiffAmount: summaryData.RoundingDiffAmount,
          DiscountPercent: summaryData.DiscountPercent,
          TotalDiscount: summaryData.TotalDiscount,
          Comments: summaryData.Remark,
          VatSum: summaryData.VatSum,
          //freight: totalFreightAmount,
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
        attachmentsList.forEach(f => {
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
      console.log("formdatatosend", payload, formDataToSend);
      let res = "";
      if (formDetails[0]?.name === "Sales Order") {
        res = await dispatch(
          updateCustomerOrder({ id, data: formDataToSend })
        ).unwrap();
      } else if (formDetails[0]?.name === "Sales Quotation") {
        res = await dispatch(updateSalesQuotation(formDataToSend)).unwrap();
      } else if (formDetails[0]?.name === "Purchase Order") {
        res = await dispatch(
          updateCustomerOrder({ id, data: formDataToSend })
        ).unwrap();
      }

      if (res.message === "Please Login!") {
        navigate("/login");
      }
      setOpen(true);
    } catch (err) {
      setApiError(err?.message || "Failed to create branch");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true); // open success dialog
      }, 2000); // ✅ stop loader
    }
  };
  useEffect(() => {
         if (!user) return;

    if (formId !== undefined) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter((submenu) => submenu.Form.id === formId)
        )
      );
      setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);
      setFormDetails(formDetails);
    } else {
      navigate("/");
    }
  }, [formId]);
  return (
    <>
      <BusyIndicator
        style={{
          width: "100%",
          height: "100%",
        }}
        active={loading}
      >
        <ObjectPage
          footerArea={
            <>
              {" "}
              <Bar
                style={{ padding: 0.5 }}
                design="FloatingFooter"
                endContent={
                  <>
                    <Button design="Positive" onClick={() => handleSubmit()}>
                      Update
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
                        ? formDetails[0]?.name + " List"
                        : "Sales Orders"}
                    </BreadcrumbsItem>
                    <BreadcrumbsItem>
                      {formDetails
                        ? "Create" + formDetails[0]?.name
                        : "Create Sales Order"}
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
                  {/* <ToolbarButton design="Transparent" icon="full-screen" />
              <ToolbarButton design="Transparent" icon="exit-full-screen" /> */}

                  <ToolbarButton
                    onClick={() => navigate(`/Sales/${formId}`)}
                    design="Transparent"
                    icon="decline"
                  />
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
          <ObjectPageSection
            id="section1"
            style={{ height: "100%" }}
            titleText="General"
          >
            {!loading && (
              <General
                onSubmit={handleSubmit}
                setFormData={setFormData}
                formData={formData}
                mode={"edit"}
                defaultValues={formData} // ✅ now passes edit data properly
                 formDetails={formDetails}
                selectedcardcode={selectedcardcode}
            setSelectedCardCode={setSelectedCardCode}
               
                apiError={apiError}
              />
            )}
          </ObjectPageSection>

          <ObjectPageSection
            id="section2"
            style={{
              height: "100%",
            }}
            titleText="Contents"
          >
            {console.log("editpageconytentitemdata", itemdata)}
            <Contents
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              itemdata={itemdata}
              setitemData={setitemData}
              setitemTableData={setitemTableData}
              itemTabledata={itemTabledata}
              servicedata={servicedata}
              setserviceData={setserviceData}
              setserviceTableData={setserviceTableData}
              serviceTabledata={serviceTabledata}
              summaryData={summaryData}
              setSummaryData={setSummaryData}
              orderItems={orderItems}
              loading={loading}
              form={form}
              handleRowChange={handleRowChange}
              deleteRow={deleteRow}
              addRow={addRow}
              SalesOrderRenderInput={SalesOrderRenderInput}
              handleChange={handleChange}
              type={type}
              setType={setType}
              mode={"edit"}
              setTotalFreightAmount={setTotalFreightAmount}
              totalFreightAmount={totalFreightAmount}
              summaryDiscountAmount={summaryDiscountAmount}
              setSummaryDiscountAmount={setSummaryDiscountAmount}
              summaryDiscountPercent={summaryDiscountPercent}
              setSummaryDiscountPercent={setSummaryDiscountPercent}
              roundingEnabled={roundingEnabled}
              setRoundingEnabled={setRoundingEnabled}
              roundOff={roundOff}
              setRoundOff={setRoundOff}
              freightRowSelection={freightRowSelection}
              setFreightRowSelection={setFreightRowSelection}
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
          {/* );
                    } else if (tab.name === "attachments") {
                        return ( */}
          <ObjectPageSection
            id="section5"
            style={{
              height: "100%",
            }}
            titleText="Attachments"
          >
            <Attachments onFilesChange={setAttachmentFiles} attachmentsList={attachmentsList} setAttachmentsList={setAttachmentsList} oldAttachmentFiles={oldAttachmentFiles} setOldAttachmentFiles={setOldAttachmentFiles} />
          </ObjectPageSection>

          <ObjectPageSection
            id="section6"
            style={{
              height: "100%",
            }}
            titleText="User-defined Fields"
          >
            {" "}
            <UserDefinedFields
              form={form}
              handleChange={handleChange}
              userdefinedData={userdefinedData}
              setUserDefinedData={setUserDefinedData}
              mode={"edit"}
               formDetails={formDetails}
              setFormData={setFormData}
              formData={formData}
            />
          </ObjectPageSection>
        </ObjectPage>
      </BusyIndicator>
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
              >
                {" "}
              </Icon>
              <h2 style={{ marginTop: "1rem" }}>Error!</h2>
              <p>{apiError}</p>
            </>
          ) : (
            <>
              <Icon
                name="message-success"
                style={{ fontSize: "2rem", color: "green" }}
              >
                {" "}
              </Icon>
              <h2 style={{ marginTop: "1rem" }}>Success!</h2>
              <p>Your request has been submitted successfully 🎉</p>
            </>
          )}
          <Button
            design="Emphasized"
            onClick={() => {
              navigate(`/Sales/${formId}`);
              setOpen(false);
            }}
          >
            OK
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default EditSalesOrder;