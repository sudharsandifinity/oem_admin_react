// DynamicForm.jsx
import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  Text,
  MultiComboBox,
  MultiComboBoxItem,
} from "@ui5/webcomponents-react";
import { FormConfigContext } from "../../Components/Context/FormConfigContext";
import api from "../../api/axios";

import { MaterialRequestRenderInput } from "./MaterialRequestRenderInput";
import General from "./General/General";
// import Contents from "./Contents/Contents";
const Contents = React.lazy(() => import("./Contents/Contents"));
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomerSelection from "./Header/CustomerSelection";
import Attachments from "./Attachments/Attachments";
import { useDispatch, useSelector } from "react-redux";
import { createCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import { createSalesQuotation } from "../../store/slices/SalesQuotationSlice";
import BarDesign from "@ui5/webcomponents/dist/types/BarDesign.js";

import { createPurchaseQuotation } from "../../store/slices/PurchaseQuotation";
import {
  createPurchaseRequest,
  fetchPurchaseRequest,
  fetchPurchaseRequestById,
} from "../../store/slices/PurchaseRequestSlice";
import { createPurchaseDeliveryNotes } from "../../store/slices/purDeliveryNoteSlice";
import CopyFromDialog from "./CopyFromDialog/CopyFromDialog";
import { fetchitemprices } from "../../store/slices/salesAdditionalDetailsSlice";
import BOQListDialog from "./BOQCopyFrom/BOQListDialog";
import { set } from "react-hook-form";
import {
  createGoodsIssue,
  createMaterialRequest,
  fetchBOQList,
} from "../../store/slices/materialRequestSlice";

export default function CloneMaterialRequest() {
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const location = useLocation();
  const formName = location.state.formName;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems } = useSelector((state) => state.orderItems);
  const [apiError, setApiError] = useState(null);
  const { formId,pageId } = useParams();
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
  const [summaryDiscountPercent, setSummaryDiscountPercent] = useState("");
  const [summaryDiscountAmount, setSummaryDiscountAmount] = useState("");
  const [roundingEnabled, setRoundingEnabled] = useState(false);
  const [roundOff, setRoundOff] = useState("");
  const [selectedcardcode, setSelectedCardCode] = useState([]);

  const [dimensionData, setDimensionData] = useState([]);
  const [currencyType, setCurrencyType] = useState("GBP");
  console.log("formId", formId, formDetails);
  const [selectedRequestId, setSelectedRequestId] = useState({});
  const [requestList, setRequestList] = useState([]);
  const [copiedItemDocumentLines, setCopiedItemDocumentLine] = useState([]);
  const [copiedServiceDocumentLines, setCopiedServiceDocumentLine] = useState(
    [],
  );
  const [opencopyFromDialog, setOpenCopyFromDialog] = useState(false);
  const [isCopyFromBOQ, setIsCopyFromBOQ] = useState(false);
  const [selectedItemOwner, setSelectedItemOwner] = useState("");
  const [selectedServiceOwner, setSelectedServiceOwner] = useState("");
  const [selectedServices, setSelectedServices] = useState({});
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
  console.log("selectedItemOwner", selectedItemOwner);
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
  const [isBoqListopem, setisBoqListopem] = useState(false);
  const [boqrequestList, setBoqRequestList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const orderListById = location?.state?.copyFormData || null;

        if (!orderListById) {
          setLoading(false);
          return;
        }

        console.log("orderListById", orderListById);

        // Header Data
        setSelectedCardCode(orderListById.U_CardCode || "");

        setFormData({
          docEntry: orderListById.DocEntry || "",
          docNum: orderListById.DocNum || "",
          RequisitionNo: orderListById.RequisitionNo || "",
          RequisitionDate: orderListById.RequisitionDate || "",
          RequisitionTime: orderListById.RequisitionTime || "",
          RequiredDate: orderListById.RequiredDate || "",
          CusCode: orderListById.CusCode || "",
          ProjectCode: orderListById.ProjectCode || "",
          ProjectName: orderListById.ProjectName || "",
          Remarks: orderListById.Remarks || "",
          CardName: orderListById.CardName || "",
        });

        // Item Lines
        if (orderListById?.DocumentLines?.length > 0) {
          setType("Item");

          const mappedItems = orderListById.DocumentLines.map(
            (item, index) => ({
              id: index + 1,
              slno: index + 1,
              task: item.task || "",
                BoqLineNum: item.BoqLineNum|| "",
              ItemCode: item.ItemCode || "",
              ItemName: item.fulldescription || "",
              fulldescription: item.fulldescription || "",
              quantity: item.quantity || 0,
              amount: item.amount || 0,
              linetotal: item.linetotal || 0,
              project: item.project || "",
              warehouse: item.warehouse || "",
              uom: item.uom || "",
              stage: item.stage || "",
              issuedQty: item.issuedQty || 0,
              inStock: item.inStock || 0,
              availableQty: item.availableQty || 0,
              rateTotal: item.rateTotal || 0,
              remarks: item.remarks || "",
            }),
          );

          setitemData(mappedItems);
          setitemTableData(mappedItems);
        }

        // Summary Data
        setSummaryData((prev) => ({
          ...prev,
          RequestorCode: orderListById.RequestorCode || "",
          RequestorName: orderListById.RequestorName || "",
          eMail:orderListById.eMail||"",
          Department: orderListById.Department || "",
          DocTotal: orderListById.DocTotal || 0,
          ApprovalStatus: orderListById.ApprovalStatus || "",
          ApprovedBy: orderListById.ApprovedBy || "",
          ApprovedDate: orderListById.ApprovedDate || "",
          ApprovedTime: orderListById.ApprovedTime || "",
        }));

        setFreightRowSelection(orderListById.DocumentAdditionalExpenses || []);

        setSummaryDiscountPercent(orderListById.DiscountPercent || 0);

        setRoundingEnabled(orderListById.Rounding === "tYES");

        setRoundOff(orderListById.RoundingDiffAmount || 0);

        setUserDefinedData(orderListById.formData || {});
      } catch (err) {
        console.error("fetchData Error", err);
      } finally {
        setLoading(false);
      }
    };
    if (location.state.formname) {
      fetchData();
    }
  }, []);
  const openBoqList = async () => {
    console.log("openBoqList");
    setIsCopyFromBOQ(true);
     const data={ U_BPCode: formData.CusCode||null, 
      U_PrjCode:formData.ProjectCode||null }
    const res = await dispatch(fetchBOQList(data)).unwrap();
    const currentType =
      type === "Item" ? "dDocument_Items" : "dDocument_Service";
    const raw = res?.data?.value ?? res?.data ?? res?.value ?? res;
    console.log("resraw", res, raw);
    setBoqRequestList(raw);
    console.log("currentType", currentType, res?.data);
    setisBoqListopem(true);
  };
  const closeBoqList = () => {
    setisBoqListopem(false);
  };
  const copyFrom = async () => {
    setIsCopyFromBOQ(true);
    //const res = await dispatch(fetchPurchaseRequest()).unwrap();
    const res = await dispatch(fetchPurchaseOrder()).unwrap();
    const currentType =
      type === "Item" ? "dDocument_Items" : "dDocument_Service";
    const raw = res?.data?.value ?? res?.data ?? res?.value ?? res;

    setRequestList(raw.filter((val) => val.DocType === currentType));
    console.log("currentType", currentType, res?.data);
    setOpenCopyFromDialog(true);
  };
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

  const handleRowChange = useCallback((row) => {
    //const key = tab === "Items" ? "items" : "additional";
    const newRows = [...form[key]];
    newRows[i][name] = value;
    setForm({ ...form, [key]: newRows });
  }, []);

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
    try {
      console.log(
        "itemTabledatahandleSubmit",
        dimensionData,
        "itemTabledata",
        itemTabledata,
        formData,
        freightRowSelection,
      );
      console.log("formDatahandlesubmit", formData);
      setLoading(true);
      let payload = {};

      const formatDate = (date) =>
        date
          ? new Date(date).toISOString().split("T")[0].replace(/-/g, "")
          : new Date().toISOString().split("T")[0].replace(/-/g, "");

      payload = {
        CardCode: formData.CusCode || "",

        DocDate: formatDate(formData.RequisitionDate),

        DocDueDate: formatDate(formData.DocDueDate),

        TaxDate: formatDate(formData.TaxDate),

        RequriedDate: formatDate(formData.RequiredDate),

        // DocEntry: formData.DocEntry,

        DocumentStatus: "open",

        ContactPerson: formData.ContactPerson || "",

        NumAtCard: formData.CustomerRefNo || "",

        DocType: "dDocument_Items",

        DocumentsOwner: summaryData.RequestorName || "",
        RequesterEmail:summaryData.eMail||"",
        DocumentLines: itemTabledata
          // .filter(
          //   (item) =>item.ItemCode && Number(item.quantity || 0) <= Number(item.inStock || 0),
          // )
          .map((line) => {
            console.log("setitemeditpage", line);
            return {
              ItemCode: line.ItemCode || "",
              ItemDescription: line.ItemName || "",
              Quantity: Number(line.quantity || 0),
              UnitPrice: Number(line.amount || 0),
              WarehouseCode: line.warehouse || "",
              //ProjectCode: line.project || "",
              TaxCode: line.TaxCode || "",
              VatGroup: line.TaxCode || "",
              DiscountPercent: Number(line.discount || 0),
              LineTotal: Number(line.linetotal || 0),
              U_MRDocEntry: formData.DocEntry,
              U_MRDocNo: formData.docNum || "",
              U_MRLine:line.BoqLineNum,
              RequiredDate: formatDate(formData.RequiredDate),
            };
          }),
          U_MRNo:formData.docEntry,
        Rounding: summaryData.Rounding || "tNO",

        RoundingDiffAmount: Number(summaryData.RoundingDiffAmount || 0),

        DiscountPercent: Number(summaryData.DiscountPercent || 0),

        TotalDiscount: Number(summaryData.TotalDiscount || 0),

        Comments: summaryData.Remark || "",

        VatSum: Number(summaryData.VatSum || 0),

        DocTotal: Number(summaryData.DocTotal || 0),
      };

      const formDataToSend = new FormData();

      formDataToSend.append(
        "DocumentLines",
        JSON.stringify(payload.DocumentLines),
      );

      formDataToSend.append("data", JSON.stringify(payload.data));

      Object.keys(payload).forEach((key) => {
        if (key !== "DocumentLines" && key !== "data") {
          formDataToSend.append(key, payload[key]);
        }
      });
      console.log(
        "formdatatosendhandlesubmit",
        payload,
        formDataToSend,location.state.formname,
       
      );
      const GoodsissuePayload = {
         DocDate: formatDate(formData.RequisitionDate),
         Comments: summaryData.Remark || "",
         DocumentLines: itemTabledata
          .map((line) => {
            console.log("setitemeditpage", line);
            return {
              LineNum:"1",
              ItemCode: line.ItemCode || "",
              ItemDescription: line.ItemName || "",
              Quantity: Number(line.quantity || 0),
              UnitPrice: Number(line.amount || 0),
              WarehouseCode: line.warehouse || "",
              //ProjectCode: line.project || "",
              TaxCode: line.TaxCode || "",
              VatGroup: line.TaxCode || "",
              DiscountPercent: Number(line.discount || 0),
              LineTotal: Number(line.linetotal || 0),
              U_MRDocEntry: formData.DocEntry,
              U_MRDocNo: formData.docNum || "",
              U_MRLine:line.BoqLineNum,
              //RequiredDate: formatDate(formData.RequiredDate),
            };
          })
      };
      let res = "";
      if(location.state.formname==="Goods Issue"){
       res= await dispatch(createGoodsIssue(GoodsissuePayload)).unwrap();
      }else{
         res = await dispatch(createPurchaseRequest(formDataToSend)).unwrap();
        
      }

      console.log("reshandlesubmit", res);

      if (res.message === "Please Login!") {
        navigate("/login");
        return;
      }
      res && setApiError(null);
      setOpen(true);
    } catch (err) {
      console.error("Failed to create order:", err);
      const statusCode = err?.status || err?.response?.status || 0;
      const message = err || "Failed to load data";

      console.error("c:", statusCode, "Message:", message);
      setApiError(
        "A Material Request converted into "+location.state.formname +"/n"+ message,
      );

      // If 401, redirect to login
      if (statusCode === 401) {
        navigate("/login");
      }
      setApiError(
       
          (err.message || "Error creating order"),
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
      }, 500);
    }
  };
  const handleSubmitClone = async () => {
    try {
      console.log(
        "itemTabledatahandleSubmit",
        dimensionData,
        "itemTabledata",
        itemTabledata,
        formData,
        freightRowSelection,
      );
      console.log("formDatahandlesubmit", formData);
      setLoading(true);

      let payload = {
        U_DocDate: formData.RequisitionDate
          ? new Date(formData.RequisitionDate)
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "")
          : new Date().toISOString().split("T")[0].replace(/-/g, ""),
        U_ReqDate: formData.RequiredDate
          ? new Date(formData.RequiredDate)
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "")
          : new Date().toISOString().split("T")[0].replace(/-/g, ""),
        U_ReqTime: formData.RequisitionTime,
        U_CardCode: formData.CusCode || "",
        U_PrjCode: formData.ProjectCode || "",
        U_PrjDesc: formData.ProjectName || "",
        U_Remark: formData.Remarks || "",
        U_ReqType: "U",
        U_ReqCode: summaryData.RequestorCode || "",
        U_ReqName: summaryData.RequestorName,
        U_Dept: summaryData.Department || "",
        U_DocTotal: summaryData.DocTotal || 0,
        HLB_MRQ1Collection: itemTabledata.map((item) => ({
          U_ItmSerCode: item.ItemCode,
          U_ItemDesc: item.ItemName,
          U_ReqQty: item.quantity || 0,
          U_UOM: item.UOM,
          U_InStock: item.inStock || 0,
          U_Project: item.project || "",
          U_Stage: item.stage || "",
          U_UnitPrice: item.amount || 0,
          U_LineTotal: item.quantity * item.amount || 0,
          U_AvlQty: item.availableQty || 0,
          U_Whs: item.warehouse || "",
          U_SQlineNum: item.BoqLineNum || "",
        })),
      };

      console.log("formdatatosend", payload);
      let res = await dispatch(createMaterialRequest(payload)).unwrap();
      console.log("reshandlesubmit", res);

      if (res.message === "Please Login!") {
        navigate("/login");
        return;
      }
      res && setApiError(null);
      setOpen(true);
    } catch (err) {
      console.error("Failed to create order:", err);
      const statusCode = err?.status || err?.response?.status || 0;
      const message = err || "Failed to load data";

      console.error("c:", statusCode, "Message:", message);
      setApiError(message);

      // If 401, redirect to login
      if (statusCode === 401) {
        navigate("/login");
      }
      setApiError(err.message || "Error creating order");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
      }, 500);
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
    console.log("errorgetUserFriendlyMessage", error);
    if (!error) return "An unexpected error occurred.";

    if (error.code === "-5002") {
      return "The selected customer is not valid for this document.";
    }

    if (error.code === "-10") {
      return "Tax information is missing or incorrect.";
    }
    console.log(
      "formDetails[0]?.name ",
      location.state.formname === "Purchase Request" &&
        summaryData.DocTotal > 1000,
      summaryData.DocTotal,
    );
    // if (
    //   location.state.formname === "Purchase Request" &&
    //   summaryData.DocTotal > 1000
    // ) {
    //   return "Document total must be less than 1000";
    // }
    const message =
      error?.message?.value ||
      error?.message ||
      error?.response?.data?.message ||
      error ||
      "";

    if (message.includes("Network")) {
      return "Unable to connect to the server.";
    }
    console.log("message", message);
    return message || "Please review the details and try again.";
  };

  useEffect(() => {
    //if (!user) return;
    if (user === "null" || user.length === 0) {
      navigate("/login");
    }
    if (formId) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter(
            (submenu) => submenu.Form && submenu.Form.id === formId,
          ),
        ),
      );
      setTabList((formDetails && formDetails[0]?.Form.FormTabs) || []);
      setFormDetails(formDetails);
    } else {
      navigate("/");
    }
  }, [formId, user]);
  const getItemPrice = async (cardCode, itemCode) => {
    try {
      const response = await dispatch(
        fetchitemprices({ cardCode: cardCode, itemCode: itemCode }),
      ).unwrap();

      // SAP returns array in response.value
      if (response?.value?.length > 0) {
        return response.value[0]; // ✅ Correct
      }

      return 0;
    } catch (error) {
      console.error("Price fetch failed", error);
      return 0;
    }
  };
  const saveItem = async (item) => {
    console.log("saveitemitem", item);
    const newItems = Array.isArray(item) ? item : Object.values(item);

    for (const newItem of newItems) {
      const itemresponse = await getItemPrice(
        selectedcardcode,
        newItem.ItemCode,
      );
      const price = itemresponse ? itemresponse.Price : 0;
      const discount = itemresponse ? itemresponse.DiscountPercent : ""; // You can replace this with any logic to determine the default quantity
      console.log("isCopyFromBOQ", isCopyFromBOQ, newItems);

      if (isCopyFromBOQ) {
        console.log("isCopyFromBOQ", isCopyFromBOQ);
        setitemTableData((prev) => {
          setSummaryData((prevSummary) => ({
            ...prevSummary,
            DocTotal:
              prevSummary.DocTotal +
              newItems.reduce(
                (sum, item) => sum + Number(item.U_PCost || 0),
                0,
              ),
          }));

          const newRows = newItems.flatMap((item, index) => ({
            id: index,
            slno: index + 1,
            task: item.U_Task, // usually LineNum is 0-based
            BoqLineNum: item.U_SQlineNum,
            ItemCode: item.U_ItemCode,
            ItemName: item.U_Desc,
            fulldescription: item.U_FullDesc,
            quantity: item.U_PQty,
            amount: item.U_Rate,
            linetotal: item.U_PCost,
            project: item.U_Project,
            warehouse: item.WarehouseCode,
            uom: item.U_UOM,
            stage: item.U_Stage,
            issuedQty: item.U_AQty,
            inStock: item.U_InStock,
            availableQty: item.U_AQty,
            rateTotal: item.U_RateTotal,
            remarks: item.U_HLB_Rmarks,
          }));

          const existingIds = new Set(prev.map((row) => row.id));

          const filteredNew = newRows.filter((row) => !existingIds.has(row.id));

          // return [...prev, ...filteredNew];
          return [...newRows];
        });
        setIsCopyFromBOQ(false);
      } else {
        setitemTableData((prev) => {
          let updated = [...prev];

          if (
            updated.length > 0 &&
            updated[updated.length - 1]?.ItemCode === ""
          ) {
            updated.pop();
          }

          const nextSlno =
            updated.length > 0 ? updated[updated.length - 1].slno + 1 : 0;

          updated.push({
            ...newItem,
            slno: nextSlno,
            amount: price, // 🔥 Auto fill price
            discount: discount,
            //quantity:PriceListNum, // 🔥 Default quantity to 1 or any logic you want
          });

          return updated;
        });
      }
    }
  };
  const saveService = async (item) => {
    console.log("saveitemservice", item);
    //setSelectedServices(rowSelection);
    const newItems = Array.isArray(item) ? item : Object.values(item);

    for (const newItem of newItems) {
      const itemresponse = await getItemPrice(
        selectedcardcode,
        newItem.ServiceCode,
      );
      const price = itemresponse ? itemresponse.Price : 0;
      const discount = itemresponse ? itemresponse.DiscountPercent : ""; // You can replace this with any logic to determine the default quantity
      if (isCopyFromBOQ) {
        console.log("isCopyFromBOQ", isCopyFromBOQ, newItems);
        setserviceTableData((prev) => {
          const newRows = newItems.flatMap((item, index) => ({
            id: index,
            slno: index + 1,
            ServiceCode: item.AccountCode || "",
            ServiceName: item.ItemDescription || "",
            amount: item.UnitPrice || 0,
            quantity: item.Quantity || 0,
            discount: item.DiscountPercent || 0,
            BaseAmount: item.LineTotal || 0,
            TaxCode: item.TaxCode || "",
            TaxRate: item.TaxPercentagePerRow || 0,
            grosstotal: item.GrossTotal || 0,
            ProjectCode: item.ProjectCode || "",
            WarehouseCode: item.WarehouseCode || "",
          }));

          const existingIds = new Set(prev.map((row) => row.id));

          const filteredNew = newRows.filter((row) => !existingIds.has(row.id));

          // return [...prev, ...filteredNew];
          return [...newRows];
        });
        setIsCopyFromBOQ(false);
      } else {
        setserviceTableData((prev) => {
          let updated = [...prev];
          // Remove the last row if it's an empty placeholder
          if (updated[updated.length - 1]?.ServiceCode === "") {
            updated.pop();
          }
          let nextSlno =
            updated.length > 0 ? updated[updated.length - 1].slno + 1 : 0;

          console.log("servicenewitem", newItem);

          updated.push({
            ...newItem,
            slno: nextSlno,
            amount: price, // 🔥 Auto fill price
            discount: discount,
          });

          return updated;
        });
      }
    }
  };

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
            style={{
              padding: "0.5rem 1rem",
              marginBottom: "16px",
            }}
            startContent={
              <FlexBox style={{ gap: "0.5rem" }}>
                {/* <Button design="Default" onClick={() => handleSubmit()}>
              Refresh Stock
            </Button> */}

                {!location.state.formName==="Goods Issue"&&<Button design="Default" disabled={ !formData.CusCode && !formData.ProjectCode} onClick={openBoqList}>
                  BOQ Copy From
                </Button>}

                {/* <Button design="Default" onClick={() => handleSubmit()}>
                  Purchase Request
                </Button>

                <Button design="Default" onClick={() => handleSubmit()}>
                  Goods Issue
                </Button> */}
              </FlexBox>
            }
            endContent={
              <FlexBox style={{ gap: "0.5rem" }}>
                <Button
                  design="Transparent"
                  onClick={() => navigate(`/Sales/${formId}`)}
                >
                  Cancel
                </Button>

                <Button design="default" onClick={() => handleSubmit()}>
                  Save
                </Button>
              </FlexBox>
            }
          />
        }
        // headerArea={
        //   <DynamicPageHeader
        //     className="custom-header"
        //     style={{
        //       display: "flex",
        //       alignItems: "center",
        //       padding: "1rem",
        //       //backgroundColor: "#354a5f", // SAP Blue
        //       // color: "white",
        //     }}
        //   >
        //     <FlexBox
        //       direction="Row"
        //       style={{
        //         display: "inline-flex",
        //         alignItems: "end",
        //         flexWrap: "wrap",
        //         gap: "15px",
        //       }}
        //     >
        //       <FlexBox direction="Column">
        //         <Text>Customer</Text>
        //       </FlexBox>
        //       <span style={{ width: "4rem" }} />
        //       <FlexBox direction="Column">
        //         <Text>Total:</Text>
        //         <ObjectStatus state="None">GBP 0.00</ObjectStatus>
        //       </FlexBox>
        //       <span style={{ width: "4rem" }} />
        //       <FlexBox direction="Column">
        //         <Text>Status</Text>
        //         <ObjectStatus state="Positive">Open</ObjectStatus>
        //       </FlexBox>
        //       <span style={{ width: "4rem" }} />
        //       <FlexBox direction="Column">
        //         <Text>Credit Limit Utilization</Text>
        //         <Slider
        //           min={0}
        //           max={100}
        //           step={1}
        //           //value={value}
        //           showTickmarks
        //           showTooltip
        //           //onInput={handleSliderChange}
        //         />
        //       </FlexBox>
        //     </FlexBox>
        //   </DynamicPageHeader>
        // }
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
            className="custom-header"
            style={{
              // display: "flex",
              //alignItems: "start",
              padding: "1rem",
            }}
            breadcrumbs={
              <div style={{ width: "500px" }}>
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
                    {formDetails.length > 0
                      ?"Material Request List "
                      : formId
                        ? formId
                        : "Sales Orders"}
                  </BreadcrumbsItem>
                  <BreadcrumbsItem>
                    {formDetails.length > 0
                      ? "Create " + location.state.formname
                      : "Create"}
                  </BreadcrumbsItem>
                </Breadcrumbs>
              </div>
            }
            header={
              <Title level="H2">
                {location.state?.formname
                  ? location.state.formname
                  : "Purchase Request"}
              </Title>
            }
          >
            <ObjectStatus></ObjectStatus>
          </ObjectPageTitle>
        }
      >
        <ObjectPageSection
          id="section1"
          style={{ height: "100%" }}
          titleText="General"
        >
          {console.log("formData", formData)}
          <General
            onSubmit={handleSubmit}
            setFormData={setFormData}
            formData={formData}
            mode={"create"}
            pageId={pageId}
            selectedcardcode={selectedcardcode}
            setSelectedCardCode={setSelectedCardCode}
            formDetails={formDetails}
            currencyType={currencyType}
            setCurrencyType={setCurrencyType}
            formName={location.state.formname}
            defaultValues={{
              CusCode: "",
              RequisitionNo: "",
              RequisitionDate: "",
              RequisitionTime: "",
              RequiredDate: "",
              ProjectCode: "",
              ProjectName: "",
              Remarks: "",
              BOQ: "",
              ExcelImport: "",
            }}
            apiError={apiError}
          />
        </ObjectPageSection>

        <ObjectPageSection
          id="section2"
          style={{
            height: "100%",
          }}
          titleText="Contents"
        >
          <Suspense
            fallback={
              <FlexBox
                style={{ height: "300px" }}
                justifyContent="Center"
                alignItems="Center"
              >
                <BusyIndicator size="Medium" active />
              </FlexBox>
            }
          >
            <Contents
              selectedcardcode={selectedcardcode}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              itemdata={itemdata}
              setitemData={setitemData}
              setitemTableData={setitemTableData}
              itemTabledata={itemTabledata}
              summaryData={summaryData}
              setSummaryData={setSummaryData}
              servicedata={servicedata}
              formName={location.state.formname}
              setserviceData={setserviceData}
              setserviceTableData={setserviceTableData}
              serviceTabledata={serviceTabledata}
              selectedItemOwner={selectedItemOwner}
              selectedServiceOwner={selectedServiceOwner}
              setSelectedItemOwner={setSelectedItemOwner}
              setSelectedServiceOwner={setSelectedServiceOwner}
              orderItems={orderItems}
              formDetails={formDetails}
              loading={loading}
              form={form}
              handleRowChange={handleRowChange}
              deleteRow={deleteRow}
              addRow={addRow}
              MaterialRequestRenderInput={MaterialRequestRenderInput}
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
              copiedItemDocumentLines={copiedItemDocumentLines}
              copiedServiceDocumentLines={copiedServiceDocumentLines}
              saveItem={saveItem}
              saveService={saveService}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          </Suspense>
        </ObjectPageSection>
      </ObjectPage>
      {/* </BusyIndicator> */}
      <CopyFromDialog
        open={opencopyFromDialog}
        setOpen={setOpenCopyFromDialog}
        requestList={requestList}
        saveItem={saveItem}
        saveService={saveService}
        type={type}
        setType={setType}
      />
      <BOQListDialog
        open={isBoqListopem}
        setOpen={setisBoqListopem}
        boqrequestList={boqrequestList}
        saveItem={saveItem}
        saveService={saveService}
        type={type}
        setType={setType}
      />
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
                {location.state.formname + " Not Created"}
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
