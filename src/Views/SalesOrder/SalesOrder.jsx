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

import { SalesOrderRenderInput } from "./SalesOrderRenderInput";
import General from "./General/General";
// import Contents from "./Contents/Contents";
const Contents = React.lazy(() => import("./Contents/Contents"));
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
import {
  createPurchaseRequest,
  fetchPurchaseRequest,
  fetchPurchaseRequestById,
} from "../../store/slices/PurchaseRequestSlice";
import { createPurchaseDeliveryNotes } from "../../store/slices/purDeliveryNoteSlice";
import CopyFromDialog from "./CopyFromDialog/CopyFromDialog";
import { fetchitemprices } from "../../store/slices/salesAdditionalDetailsSlice";

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
  const [isCopyFromPurchase, setIsCopyFromPurchase] = useState(false);
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
  console.log("selectedItemOwner",selectedItemOwner)
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

  const copyFrom = async () => {
    setIsCopyFromPurchase(true);
    const res = await dispatch(fetchPurchaseRequest()).unwrap();
    const currentType =
      type === "Item" ? "dDocument_Items" : "dDocument_Service";
    setRequestList(res?.data.filter((val) => val.DocType === currentType));
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

  const handleSubmit = async () => {
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
      const isSalesMenu =
        formDetails[0]?.name === "Sales Order" ||
        formDetails[0]?.name === "Sales Quotation" ||
        formDetails[0]?.name === "Sales Request";
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

          ...(!isSalesMenu && {
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
          DocumentsOwner: selectedItemOwner || "",
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
            RequiredDate: formData.ReqDate
              ? new Date(formData.ReqDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "")
              : new Date().toISOString().split("T")[0].replace(/-/g, ""),
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
              ExpenseCode: Number(freight.ExpensCode),
              LineTotal: Number(freight.LineTotal),
              Remarks: freight.Remarks,
              TaxCode: freight.TaxCode,
              TaxPercent: Number(freight.TaxPercent),
              TaxSum: Number(freight.TotalTaxAmount),
              LineGross: Number(freight.LineGross),
            }),
          ),
        };
      } else {
        {
          console.log(
            "isSalesMenu",
            isSalesMenu,
            formData.ReqDate,
          );
        }
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

          ...(!isSalesMenu && {
            RequriedDate: formData.ReqDate
              ? new Date(formData.ReqDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "")
              : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          }),
          //DocEntry: formData.DocEntry,
          DocumentStatus: "open",
          DocumentsOwner: selectedServiceOwner || "",
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
            RequiredDate: formData.ReqDate
              ? new Date(formData.ReqDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "")
              : new Date().toISOString().split("T")[0].replace(/-/g, ""),
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
              ExpenseCode: Number(freight.ExpensCode),
              LineTotal: Number(freight.grossTotal),
              Remarks: freight.quantity,
              TaxCode: freight.TaxCode,
              TaxPercent: Number(freight.TaxPercent),
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
      console.log("formdatatosend", payload, formDataToSend, formDetails,"attachmentsList",attachmentsList);
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
        console.log("summaryData.DocTota", summaryData.DocTotal);
        if (summaryData.DocTotal < 1000) {
          res = await dispatch(createPurchaseRequest(formDataToSend)).unwrap();
        } else {
          setApiError("Document total must be less than 1000");
        }
      } else if (formDetails[0]?.name === "GRPO") {
        res = await dispatch(
          createPurchaseDeliveryNotes(formDataToSend),
        ).unwrap();
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
      formDetails[0]?.name === "Purchase Request" &&
        summaryData.DocTotal > 1000,
      summaryData.DocTotal,
    );
    if (
      formDetails[0]?.name === "Purchase Request" &&
      summaryData.DocTotal > 1000
    ) {
      return "Document total must be less than 1000";
    }
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
      if (isCopyFromPurchase) {
        console.log("isCopyFromPurchase", isCopyFromPurchase);
        setitemTableData((prev) => {
          const newRows = newItems.flatMap((item, index) => ({
            id: index,
            slno: index + 1,
            ItemCode: item.ItemCode || "",
            ItemName: item.ItemDescription || "",
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
        setIsCopyFromPurchase(false);
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
      if (isCopyFromPurchase) {
        console.log("isCopyFromPurchase", isCopyFromPurchase, newItems);
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
        setIsCopyFromPurchase(false);
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
  //   useEffect(() => {
  //     const selectedRequests = requestList.filter((req) =>
  //       selectedRequestId.includes(String(req.DocEntry)),
  //     );
  //     console.log("selectedRequestsuseeffect", selectedRequests);
  //     setCopiedItemDocumentLine(
  //       selectedRequests
  //         .filter((r) => r.DocType === "dDocument_Items")
  //         .flatMap((r) =>
  //           (r.DocumentLines || []).map((item, index) => ({
  //             id: `req-${r.DocEntry}-${index}`,
  //             slno: index,
  //             ItemCode: item.ItemCode || "",
  //             ItemName: item.ItemDescription || "",
  //             amount: item.UnitPrice || "",
  //             quantity: item.Quantity || "",
  //             discount: item.DiscountPercent || "",
  //             BaseAmount: item.LineTotal || "",
  //             TaxCode: item.TaxCode || "",
  //             TaxRate: item.TaxPercentagePerRow || "",
  //             grosstotal: item.GrossTotal || "",
  //             ProjectCode: item.ProjectCode || "",
  //             WarehouseCode: item.WarehouseCode || "",
  //           })),
  //         ),
  //     );
  //  setitemTableData((prev) => {
  //   const newRows = selectedRequests
  //     .filter((r) => r.DocType === "dDocument_Items")
  //     .flatMap((r) =>
  //       (r.DocumentLines || []).map((item, index) => ({
  //         id: `req-${r.DocEntry}-${index}`,
  //         slno: index + 1,
  //         ItemCode: item.ItemCode || "",
  //         ItemName: item.ItemDescription || "",
  //         amount: item.UnitPrice || 0,
  //         quantity: item.Quantity || 0,
  //         discount: item.DiscountPercent || 0,
  //         BaseAmount: item.LineTotal || 0,
  //         TaxCode: item.TaxCode || "",
  //         TaxRate: item.TaxPercentagePerRow || 0,
  //         grosstotal: item.GrossTotal || 0,
  //         ProjectCode: item.ProjectCode || "",
  //         WarehouseCode: item.WarehouseCode || "",
  //       }))
  //     );

  //   const existingIds = new Set(prev.map(row => row.id));

  //   const filteredNew = newRows.filter(row => !existingIds.has(row.id));

  //   // return [...prev, ...filteredNew];
  //   return [...newRows]
  // });
  //     setCopiedServiceDocumentLine(
  //       selectedRequests
  //         .filter((r) => r.DocType !== "dDocument_Items")
  //         .flatMap((r) => r.DocumentLines || []),
  //     );
  //   }, [selectedRequestId]);

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
              <FlexBox style={{ gap: "0.5rem" }}>
                {formDetails[0]?.name === "GRPO" && (
                  <Button design="Default" onClick={copyFrom}>
                    Copy From
                  </Button>
                )}
                <Button design="default" onClick={() => handleSubmit()}>
                  Submit
                </Button>
                <Button
                  design="default"
                  onClick={() => navigate(`/Sales/${formId}`)}
                >
                  Cancel
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
                      ? formDetails[0]?.name + " List "
                      : formId
                        ? formId
                        : "Sales Orders"}
                  </BreadcrumbsItem>
                  <BreadcrumbsItem>
                    {formDetails.length > 0
                      ? "Create " + formDetails[0]?.name
                      : "Create"}
                  </BreadcrumbsItem>
                </Breadcrumbs>
              </div>
            }
            header={
              <Title level="H2">
                {formDetails.length > 0 ? formDetails[0]?.name : "Sales Order"}
              </Title>
            }
            //navigationBar={
            // <Toolbar design="Transparent">
            //   {formDetails[0]?.name === "GRPO" ? (
            //     <>
            //       <ToolbarButton
            //         design="default"
            //         onClick={copyFrom}
            //         icon="sap-icon://copy"
            //         text="Copy From"
            //       />
            //       <MultiComboBox
            //         onSelectionChange={(e) => {
            //           const selectedIds = e.detail.items.map((item) =>
            //             item.getAttribute("value"),
            //           );
            //           console.log(
            //             "companyselectedIds",
            //             selectedIds,
            //             e.detail,
            //           );
            //           setSelectedRequestId(selectedIds);
            //         }}
            //         onClose={function fQ() {}}
            //         onInput={function fQ() {}}
            //         onOpen={function fQ() {}}
            //         onValueStateChange={function fQ() {}}
            //         valueState="None"
            //       >
            //         {console.log("requestList", requestList)}
            //         {requestList.map((request) => (
            //           <MultiComboBoxItem
            //             key={request.DocEntry}
            //             value={request.DocEntry}
            //             text={request.DocEntry}
            //           />
            //         ))}
            //       </MultiComboBox>
            //     </>
            //   ) : (
            //     <></>
            //   )}
            // </Toolbar>
            //}
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
              copiedItemDocumentLines={copiedItemDocumentLines}
              copiedServiceDocumentLines={copiedServiceDocumentLines}
              saveItem={saveItem}
              saveService={saveService}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
            />
          </Suspense>
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
            mode={"create"}
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
      <CopyFromDialog
        open={opencopyFromDialog}
        setOpen={setOpenCopyFromDialog}
        requestList={requestList}
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
