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
  Select,
  Option,
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
import { fetchSalesQuotationById, updateSalesQuotation } from "../../store/slices/SalesQuotationSlice";
import { fetchPurchaseOrderById, updatePurchaseOrder } from "../../store/slices/PurchaseOrderSlice";
import { fetchPurchaseQuotationById, updatePurchaseQuotation } from "../../store/slices/PurchaseQuotation";
import CloneSalesOrder from "./CloneSalesOrder";
import "@ui5/webcomponents-icons/dist/copy.js";
import { fetchAttachmentDetailsById } from "../../store/slices/salesAdditionalDetailsSlice";
import { fetchPurchaseRequestById, updatePurchaseRequest } from "../../store/slices/PurchaseRequestSlice";

const ViewSalesOrder = () => {
  const { id, formId } = useParams();
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems } = useSelector((state) => state.orderItems);
  const [apiError, setApiError] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("Item");

  const [attachmentsList, setAttachmentsList] = useState([]);
  
   const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [freightRowSelection, setFreightRowSelection] = useState([]);

  const [userdefinedData, setUserDefinedData] = useState({});

  const [totalFreightAmount, setTotalFreightAmount] = useState(0);
  const [summaryData, setSummaryData] = useState({});
  const [summaryDiscountPercent, setSummaryDiscountPercent] = useState(0);
  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState(0);
  const [roundingEnabled, setRoundingEnabled] = useState(false);
  const [roundOff, setRoundOff] = useState(0);
 const [oldAttachmentFiles, setOldAttachmentFiles] = useState([]);
  
  const [tabList, setTabList] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [generaleditdata, setgeneraleditdata] = useState([]);
        const [selectedcardcode, setSelectedCardCode] = useState([]);
  
          const [dimensionData, setDimensionData] = useState([]);

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
   const [copiedFormData, setCopiedFormData] = useState({});
    const [isCloneSelected, setIsCloneSelected] = useState(false);
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
  const menuRef = useRef();
  const [loading, setLoading] = useState(true);
  const copyForm = () => {
    const tabledata = type === "Item" ? itemTabledata : serviceTabledata;
    const data = {
      ...formData,
      ...tabledata,
      ...summaryData,
      ...freightRowSelection,
    };

    delete data.DocEntry;
    console.log("copiedformdata", data, tabledata, summaryData, formData);
    setCopiedFormData({
      ...data,
      formData: formData,
      DocumentLines: tabledata,
      summaryData: summaryData,
      freightRowSelection: freightRowSelection,
      DocType: type === "Item" ? "dDocument_Items" : "dDocument_Service",
      AttachmentEntrys: attachmentsList,
      oldAttachmentFiles: oldAttachmentFiles,

    });
  };
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
              orderListById = await dispatch(
                fetchSalesQuotationById(id)
              ).unwrap();
              break;
  
            case "Purchase Order":
              orderListById = await dispatch(fetchPurchaseOrderById(id)).unwrap();
              break;
            case "Purchase Quotation":
              orderListById = await dispatch(
                fetchPurchaseQuotationById(id)
              ).unwrap();
              break;
            case "Purchase Request":
              orderListById = await dispatch(
                fetchPurchaseRequestById(id)
              ).unwrap();
              break;
            default:
              console.warn("Unknown form:", formDetails[0].name);
              return;
          }
  
          const orderList = await dispatch(fetchOrderItems()).unwrap();
          const serviceList = await dispatch(fetchOrderServices()).unwrap();
          console.log("res,res1", orderListById, orderList, serviceList);
          if (orderListById.AttachmentEntry) {
            const attachmentListById = await dispatch(
              fetchAttachmentDetailsById(orderListById.AttachmentEntry)
            ).unwrap();
            console.log("attachmentListById", attachmentListById);
            setOldAttachmentFiles((prev) => ({
              ...prev,
              Attachments2_Lines: attachmentListById.Attachments2_Lines,
            }));
          }
          if (orderListById) {
            // 1. Store order header info
            setSelectedCardCode(orderListById.CardCode);
            setFormData({
              docEntry: orderListById.DocEntry,
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
                              WarehouseCode: matched.WarehouseCode,
                              ProjectCode: matched.ProjectCode,
                              discount: matched.DiscountPercent,
                              TaxRate: matched.TaxTotal,
                              "1_ProfitCenterCode": matched.CostingCode,
                              "2_ProfitCenterCode": matched.CostingCode2,
  
                              "3_ProfitCenterCode": matched.CostingCode3,
                              "4_ProfitCenterCode": matched.CostingCode4,
                              "5_ProfitCenterCode": matched.CostingCode5,
                            }
                          : {
                              slno: index, // usually LineNum is 0-based
                              ItemCode: item.ItemCode,
                              ItemName: item.ItemName,
                              quantity: item.Quantity,
                              TaxCode: item.TaxCode,
                              WarehouseCode: item.WarehouseCode,
                              ProjectCode: item.ProjectCode,
                              amount: item.UnitPrice,
                              discount: item.DiscountPercent,
                              TaxRate: item.TaxTotal,
                                "1_ProfitCenterCode": item.CostingCode,
                              "2_ProfitCenterCode": item.CostingCode2,
  
                              "3_ProfitCenterCode": item.CostingCode3,
                              "4_ProfitCenterCode": item.CostingCode4,
                              "5_ProfitCenterCode": item.CostingCode5,
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
                              WarehouseCode: matched.WarehouseCode,
                              ProjectCode: matched.ProjectCode,
                              amount: matched.UnitPrice,
                              discount: matched.DiscountPercent,
                              TaxRate: matched.TaxTotal,
                                "1_ProfitCenterCode": matched.CostingCode,
                              "2_ProfitCenterCode": matched.CostingCode2,
  
                              "3_ProfitCenterCode": matched.CostingCode3,
                              "4_ProfitCenterCode": matched.CostingCode4,
                              "5_ProfitCenterCode": matched.CostingCode5,
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
                               WarehouseCode: matched.WarehouseCode,
                              ProjectCode: matched.ProjectCode,
                              "1_ProfitCenterCode": matched.CostingCode,
                              "2_ProfitCenterCode": matched.CostingCode2,
  
                              "3_ProfitCenterCode": matched.CostingCode3,
                              "4_ProfitCenterCode": matched.CostingCode4,
                              "5_ProfitCenterCode": matched.CostingCode5,
                            
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
                               WarehouseCode: item.WarehouseCode,
                              ProjectCode: item.ProjectCode,
                              "1_ProfitCenterCode": item.CostingCode,
                              "2_ProfitCenterCode": item.CostingCode2,
  
                              "3_ProfitCenterCode": item.CostingCode3,
                              "4_ProfitCenterCode": item.CostingCode4,
                              "5_ProfitCenterCode": item.CostingCode5,
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
                               WarehouseCode: matched.WarehouseCode,
                              ProjectCode: matched.ProjectCode,
                              "1_ProfitCenterCode": matched.CostingCode,
                              "2_ProfitCenterCode": matched.CostingCode2,
  
                              "3_ProfitCenterCode": matched.CostingCode3,
                              "4_ProfitCenterCode": matched.CostingCode4,
                              "5_ProfitCenterCode": matched.CostingCode5,
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
            setFreightRowSelection(
              orderListById.DocumentAdditionalExpenses || []
            );
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
    }, [dispatch, id, formDetails]);

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
    try {
      setLoading(true);
      const payload = {
        CardCode: formData.CardCode,
        DocDueDate: formData.DocDueDate
          ? new Date(formData.DocDueDate)
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "")
          : new Date().toISOString().split("T")[0].replace(/-/g, ""),
        DocumentLines: Object.values(filteredData).map((line) => ({
          ItemCode: line.ItemCode,
          ItemDescription: line.ItemName, // ✅ rename to ItemDescription
          Quantity: line.quantity ? line.quantity : 1,
          UnitPrice: line.amount,
        })),
      };
      console.log("payload", payload);
      let res = "";
      if (formDetails[0]?.name === "Sales Order") {
        res = await dispatch(
          updateCustomerOrder({ id, data: payload })
        ).unwrap();
      } else if(formDetails[0]?.name==="Sales Quotation"){
        res = await dispatch(
          updateSalesQuotation({ id, data: payload })
        ).unwrap();
      }else if(formDetails[0]?.name==="Purchase Order"){
        res = await dispatch(
          updatePurchaseOrder({ id, data: payload })
        ).unwrap();
      }
      else if(formDetails[0]?.name==="Purchase Quotation"){
        res = await dispatch(
          updatePurchaseQuotation({ id, data: payload })
        ).unwrap();
      }
      else if(formDetails[0]?.name==="Purchase Request"){
        res = await dispatch(
          updatePurchaseRequest({ id, data: payload })
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
   const menuBlocks =
      user?.Roles?.flatMap((role) =>
        role.UserMenus?.filter((menu) =>
          menu.children?.some((child) => child.Form?.id === formId)
        ).map((menu) => ({
          roleId: role.id,
          roleName: role.name,
          ...menu,
        }))
      ) || [];
    const childOptions = menuBlocks.length > 0 ? menuBlocks[0].children : [];
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
                    <Button
                      design="Positive"
                      onClick={() => navigate(`/Sales/${formId}`)}
                    >
                      Close
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
                      ? formDetails[0]?.name+" List "
                      : "Sales Orders"}
                    </BreadcrumbsItem>
                    <BreadcrumbsItem>
                      {formDetails
                        ? "View " + formDetails[0]?.name
                        : "View"}
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
                   <ToolbarButton
                  design="default"
                  onClick={copyForm}
                  icon="sap-icon://copy"
                />

                <Select
                  onChange={(e) =>
                    {const selectPage=e.detail.selectedOption.dataset.id;
                     navigate(
                        "/cloneorder/create/" + formId + "/" + selectPage,
                        {
                          state: { copyFormData: copiedFormData },
                        }
                      );
                    }
                  }

                  //setSelectedChild(e.detail.selectedOption.dataset.id)
                >
                  <Option key={""} data-id={""}>
                    Select Action
                  </Option>
                  {childOptions.map((child) => (
                    <Option key={child.id} data-id={child.id}>
                      {child.name}
                    </Option>
                  ))}
                </Select>
                {/* <Select
                  onChange={(e) => {
                    const selected = e.detail.selectedOption.dataset.id;

                    if (selected === "CopyTo") {
                      // store big data for new tab
                      localStorage.setItem(
                        "copyFormData",
                        JSON.stringify(copiedFormData)
                      );

                      window.open(
                        "/cloneorder/create/" + formId + "/" + selectPage,
                        "_blank"
                      );
                    } else if (selected === "MoveTo") {
                      navigate(
                        "/cloneorder/create/" + formId + "/" + selectPage,
                        {
                          state: { copyFormData: copiedFormData },
                        }
                      );
                    }
                  }}
                >
                  <Option data-id="Select">Select</Option>
                  <Option data-id="MoveTo">Move To</Option>
                  <Option data-id="CopyTo">Copy To</Option>
                </Select> */}

                {/* <ToolbarButton
                  design={isCloneSelected ? "Emphasized" : "Transparent"}
                  onClick={() => setIsCloneSelected(!isCloneSelected)}
                  icon="sap-icon://add-document"
                  text="Clone"
                /> */}

                {/* <ToolbarButton
                  onClick={() => navigate(`/Sales/${formId}`)}
                  design="Transparent"
                  icon="decline"
                /> */}
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
          {/* {console.log("tabList", tabList, orderItems, generaleditdata)}
            {
                tabList.length > 0 && tabList.map((tab) => {
                    console.log("object", tab);
                    if (tab.name === "general") {
                        return ( */}
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
                defaultValues={formData} // ✅ now passes edit data properly
                apiError={apiError}
                formDetails={formDetails}
                selectedcardcode={selectedcardcode}
            setSelectedCardCode={setSelectedCardCode}
                mode="view"
              />
            )}
            {/* <General
                                        onSubmit={handleSubmit}
                                        setFormData={setFormData}
                                        formData={formData}
                                        defaultValues={{
                                            CardCode: generaleditdata.CardCode || "",
                                            CardName: generaleditdata.CardName || "",
                                            DocDueDate: generaleditdata.CreationDate || new Date().toISOString().split("T")[0],
                                            DocumentLines: [],
                                        }}
                                        apiError={apiError}
                                    /> */}
          </ObjectPageSection>
          {/* );
                    } else if (tab.name === "contents") {
                        return ( */}
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
              dimensionData={dimensionData}
              setDimensionData={setDimensionData}
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
              formDetails={formDetails}
              mode={"view"}
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
          {/* );
                    } else if (tab.name === "logistics") {
                        return ( */}
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
                    else if (tab.name === "accounting") {
                        return ( */}
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
          {/* );
                    } else if (tab.name === "user-defined-field") {
                        return ( */}
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
              userdefinedData={userdefinedData}
              setUserDefinedData={setUserDefinedData}
               formDetails={formDetails}
              mode={"view"}
              setFormData={setFormData}
              formData={formData}
            />
          </ObjectPageSection>
          {/* );
                    }
                })
             
            } */}
        </ObjectPage>
      </BusyIndicator>
       {isCloneSelected && (
        <CloneSalesOrder copiedFormData={copiedFormData} formId={formId} />
      )}
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

export default ViewSalesOrder;
