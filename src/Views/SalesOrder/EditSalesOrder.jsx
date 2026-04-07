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
  Text,
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
import { fetchAttachmentDetailsById, fetchitemprices } from "../../store/slices/salesAdditionalDetailsSlice";
import {
  fetchSalesQuotationById,
  updateSalesQuotation,
} from "../../store/slices/SalesQuotationSlice";
import {
  fetchPurchaseOrderById,
  updatePurchaseOrder,
} from "../../store/slices/purchaseorderSlice";
import {
  fetchPurchaseQuotationById,
  updatePurchaseQuotation,
} from "../../store/slices/PurchaseQuotation";
import CloneSalesOrder from "./CloneSalesOrder";
import "@ui5/webcomponents-icons/dist/copy.js";
import {
  fetchPurchaseRequest,
  fetchPurchaseRequestById,
  updatePurchaseRequest,
} from "../../store/slices/PurchaseRequestSlice";
import BarDesign from "@ui5/webcomponents/dist/types/BarDesign.js";
import {
  fetchPurchaseDeliveryNotesById,
  updatePurchaseDeliveryNotes,
} from "../../store/slices/purDeliveryNoteSlice";
import CopyFromDialog from "./CopyFromDialog/CopyFromDialog";

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
   const [selectedServices, setSelectedServices] = useState({});

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

  const [currencyType, setCurrencyType] = useState("GBP");

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
    const [isCopyFromPurchase, setIsCopyFromPurchase] = useState(false);
      const [opencopyFromDialog, setOpenCopyFromDialog] = useState(false);
      const [requestList, setRequestList] = useState([]);
    
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
    PostingDate: "",
    Remarks: "",
    DocTotal: 0,
    items: [{ ItemCode: "", ItemName: "", Quantity: 0, Price: 0 }],
    cusDetail: [],
    U_Test1: "",
    U_Test2: "",
  });
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
    console.log(
      "copiedformdata",
      data,
      "tabledata",
      itemTabledata,
      summaryData,
      formData,
      "attachment",
      oldAttachmentFiles,
    );
    setCopiedFormData({
      ...data,
      formData: formData,
      copyFrom: formDetails[0]?.name,
      DocumentLines: tabledata,
      summaryData: summaryData,
      freightRowSelection: freightRowSelection,
      DocType: type === "Item" ? "dDocument_Items" : "dDocument_Service",
      AttachmentEntrys: attachmentsList,
      oldAttachmentFiles: oldAttachmentFiles,
      Remark: summaryData.Remark,
      DocTotal: summaryData.DocTotal,
      Rounding: summaryData.Rounding,
      RoundingDiffAmount: summaryData.RoundingDiffAmount,
      DiscountPercent: summaryData.DiscountPercent,
      TotalDiscount: summaryData.TotalDiscount,
      VatSum: summaryData.VatSum,
    });
  };
  const copyFrom = async () => {
      setIsCopyFromPurchase(true);
      const res = await dispatch(fetchPurchaseRequest()).unwrap();
      const currentType =
        type === "Item" ? "dDocument_Items" : "dDocument_Service";
      setRequestList(res?.data.filter((val) => val.DocType === currentType));
      console.log("currentType", currentType, res?.data);
      setOpenCopyFromDialog(true);
    };
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
          
          const newRows = newItems
            .map((item,index) => ({
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

           return [...prev, ...filteredNew];
         //return [...prev, ...newRows];
        });
        setIsCopyFromPurchase(false)
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

           return [...prev, ...filteredNew];
          //return [...prev,...newRows];
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
              fetchSalesQuotationById(id),
            ).unwrap();
            break;

          case "Purchase Order":
            orderListById = await dispatch(fetchPurchaseOrderById(id)).unwrap();
            break;
          case "Purchase Quotation":
            orderListById = await dispatch(
              fetchPurchaseQuotationById(id),
            ).unwrap();
            break;
          case "Purchase Request":
            orderListById = await dispatch(
              fetchPurchaseRequestById(id),
            ).unwrap();
            break;
          case "GRPO":
            orderListById = await dispatch(
              fetchPurchaseDeliveryNotesById(id),
            ).unwrap();
            break;
          default:
            console.warn("Unknown form:", formDetails[0].name);
            return;
        }

        const orderList = await dispatch(fetchOrderItems()).unwrap();
        const serviceList = await dispatch(fetchOrderServices()).unwrap();
        console.log("res,res1", orderListById, orderList, serviceList);
        console.log("orderListByIdedit", orderListById);
        if (orderListById.AttachmentEntry) {
          const attachmentListById = await dispatch(
            fetchAttachmentDetailsById(orderListById.AttachmentEntry),
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
            CustomerRefNo: orderListById.NumAtCard || "",

            CardName: orderListById.CardName,
            DocDueDate: orderListById.DocDueDate
              ? new Date(orderListById.DocDueDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            PostingDate: orderListById.DocDate
              ? new Date(orderListById.DocDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            TaxDate: orderListById.TaxDate
              ? new Date(orderListById.TaxDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            ReqDate: orderListById.RequriedDate
              ? new Date(orderListById.RequriedDate).toISOString().split("T")[0]
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
                      const matched = orderListById.DocumentLines
                      .find(
                        (line) => line.ItemCode === item.ItemCode,
                      );

                      console.log("setitemeditpage", matched);

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
                            TaxRate: matched.TaxPercentagePerRow,
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
                            TaxRate: item.TaxPercentagePerRow,
                            "1_ProfitCenterCode": item.CostingCode,
                            "2_ProfitCenterCode": item.CostingCode2,

                            "3_ProfitCenterCode": item.CostingCode3,
                            "4_ProfitCenterCode": item.CostingCode4,
                            "5_ProfitCenterCode": item.CostingCode5,
                          }; // no placeholder
                    })
                    .filter(Boolean), // remove nulls
              );
              
              setitemTableData(
                () =>
                  orderList.value
                    .map((item) => {
                      const matched = orderListById.DocumentLines.find(
                        (line) => line.ItemCode === item.ItemCode,
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
                            TaxRate: matched.TaxPercentagePerRow,
                            "1_ProfitCenterCode": matched.CostingCode,
                            "2_ProfitCenterCode": matched.CostingCode2,

                            "3_ProfitCenterCode": matched.CostingCode3,
                            "4_ProfitCenterCode": matched.CostingCode4,
                            "5_ProfitCenterCode": matched.CostingCode5,
                          }
                        : null; // no placeholder
                    })
                    .filter(Boolean), // remove nulls
              );
              
              setitemTableData(() =>
                orderListById.DocumentLines.map((line, index) => ({
                  slno: line.LineNum + 1,
                  ItemCode: line.ItemCode,
                  ItemName: line.ItemDescription,
                  quantity: line.Quantity,
                  TaxCode: line.TaxCode,
                  WarehouseCode: line.WarehouseCode,
                  ProjectCode: line.ProjectCode,
                  amount: line.UnitPrice,
                  discount: line.DiscountPercent,
                  TaxRate: line.TaxPercentagePerRow,
                  "1_ProfitCenterCode": line.CostingCode,
                  "2_ProfitCenterCode": line.CostingCode2,
                  "3_ProfitCenterCode": line.CostingCode3,
                  "4_ProfitCenterCode": line.CostingCode4,
                  "5_ProfitCenterCode": line.CostingCode5,
                })),
              );
              if (orderList.value?.length > 0) {
                const preselected = {};
                orderListById.DocumentLines.forEach((line) => {
                  const idx = orderList.value.findIndex(
                    (o) => o.ItemCode === line.ItemCode,
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
                        (line) => line.AccountCode === item.Code,
                      );
                      console.log("editsalesorderservicedata",matched,item)
                      return matched !== undefined
                        ? {
                            slno: index, // usually LineNum is 0-based
                            ServiceCode: matched.AccountCode,
                            ServiceName: matched.ItemDescription,
                            quantity: matched.Quantity,
                            TaxCode: matched.TaxCode,
                            amount: matched.UnitPrice,
                            discount: matched.DiscountPercent,
                            TaxRate: matched.TaxPercentagePerRow,
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
                            TaxRate: item.TaxPercentagePerRow,
                            WarehouseCode: item.WarehouseCode,
                            ProjectCode: item.ProjectCode,
                            "1_ProfitCenterCode": item.CostingCode,
                            "2_ProfitCenterCode": item.CostingCode2,

                            "3_ProfitCenterCode": item.CostingCode3,
                            "4_ProfitCenterCode": item.CostingCode4,
                            "5_ProfitCenterCode": item.CostingCode5,
                          }; // no placeholder
                    })
                    .filter(Boolean), // remove nulls
              );
             
              setserviceTableData(
                () =>
                  serviceList.value
                    .map((item) => {
                      const matched = orderListById.DocumentLines.find(
                        (line) => line.AccountCode === item.Code,
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
                            TaxRate: matched.TaxPercentagePerRow,
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
                    .filter(Boolean), // remove nulls
              );
              setserviceTableData(() =>
                orderListById.DocumentLines.map((line, index) => ({
                  slno: line.LineNum + 1,
                  ServiceCode: line.AccountCode,
                  ServiceName: line.ItemDescription,
                  quantity: line.Quantity,
                  TaxCode: line.TaxCode,
                  WarehouseCode: line.WarehouseCode,
                  ProjectCode: line.ProjectCode,
                  amount: line.UnitPrice,
                  discount: line.DiscountPercent,
                  TaxRate: line.TaxPercentagePerRow,
                  "1_ProfitCenterCode": line.CostingCode,
                  "2_ProfitCenterCode": line.CostingCode2,
                  "3_ProfitCenterCode": line.CostingCode3,
                  "4_ProfitCenterCode": line.CostingCode4,
                  "5_ProfitCenterCode": line.CostingCode5,
                })),
              );
              if (serviceList.value?.length > 0) {
                const preselected = {};
                orderListById.DocumentLines.forEach((line) => {
                  const idx = serviceList.value.findIndex(
                    (o) => o.Code === line.AccountCode,
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
              formData,
            );

            // 3. Preselect rows
          }
          setSummaryData((prev) => ({
            ...prev,
            Remark: orderListById.Comments,
            DocTotal: orderListById.DocTotal,
            Rounding: orderListById.Rounding,
            RoundingDiffAmount: orderListById.RoundingDiffAmount,
            DiscountPercent: orderListById.DiscountPercent,
            TotalDiscount: orderListById.TotalDiscount,
            VatSum: orderListById.VatSum,
          }));
          // set general header edit data
          setFreightRowSelection(
            orderListById.DocumentAdditionalExpenses || [],
          );
          setSummaryDiscountPercent(orderListById.DiscountPercent);
          setRoundingEnabled(orderListById.Rounding === "tYES");
          setRoundOff(orderListById.RoundingDiffAmount);
          setgeneraleditdata({
            CardCode: orderListById.CardCode,
            CardName: orderListById.CardName,
            CustomerRefNo: orderListById.NumAtCard || "",
            TaxDate: orderListById.TaxDate
              ? new Date(orderListById.TaxDate).toISOString().split("T")[0]
              : "",
            PostingDate: orderListById.PostingDate
              ? new Date(orderListById.PostingDate).toISOString().split("T")[0]
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
            tableItem.ItemName === item.ItemName,
        ),
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
          NumAtCard: formData.CustomerRefNo || "",
          DocType: "dDocument_Items",
          DocumentLines: Object.values(itemTabledata).map((line) => ({
            ItemCode: line.ItemCode,
            ItemDescription: line.ItemName, // ✅ rename to ItemDescription
            Quantity: line.quantity,
            UnitPrice: line.amount,
            TaxCode: line.TaxCode,
            WarehouseCode: line.WarehouseCode,
            ProjectCode: line.ProjectCode,
            TaxCode: line.TaxCode,
            VatGroup: line.TaxCode,
            DiscountPercent: line.discount,
            LineTotal: line.total,
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
          //DocTotal: summaryData.DocTotal || 0,
          Rounding: summaryData.Rounding || "tNO",
          RoundingDiffAmount: summaryData.RoundingDiffAmount || 0,
          DiscountPercent: summaryData.DiscountPercent || 0,
          TotalDiscount: summaryData.TotalDiscount || 0,
          Comments: summaryData.Remark || "",
          VatSum: summaryData.VatSum,
          //freight: totalFreightAmount,
          DocumentAdditionalExpenses: Object.values(freightRowSelection).map(
            (freight) => ({
              ExpenseCode: freight.ExpensCode,
              LineTotal: freight.grossTotal,
              Remarks: freight.quantity,
              TaxCode: freight.TaxCode,
              TaxPercent: freight.TaxPercent,
              TaxSum: freight.TotalTaxAmount,
              LineGross: freight.amount,
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
          ...(!isSalesMenu && {
            RequriedDate: formData.ReqDate
              ? new Date(formData.ReqDate)
                  .toISOString()
                  .split("T")[0]
                  .replace(/-/g, "")
              : new Date().toISOString().split("T")[0].replace(/-/g, ""),
          }),
          NumAtCard: formData.CustomerRefNo || "",
          DocumentLines: Object.values(serviceTabledata).map((line) => ({
            AccountCode: line.ServiceCode,
            ItemDescription: line.ServiceName, // ✅ rename to ItemDescription
            TaxCode: line.TaxCode,
            UnitPrice: line.amount,
            TaxCode: line.TaxCode,
            WarehouseCode: line.WarehouseCode,
            ProjectCode: line.ProjectCode,
            TaxCode: line.TaxCode,
            VatGroup: line.TaxCode,
            DiscountPercent: line.discount,
            LineTotal: line.total,
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
          //DocTotal: summaryData.DocTotal || 0,
          Rounding: summaryData.Rounding || "tNO",
          RoundingDiffAmount: summaryData.RoundingDiffAmount || 0,
          DiscountPercent: summaryData.DiscountPercent || 0,
          TotalDiscount: summaryData.TotalDiscount || 0,
          Comments: summaryData.Remark || "",
          VatSum: summaryData.VatSum || 0,
          //freight: totalFreightAmount,
          DocumentAdditionalExpenses: Object.values(freightRowSelection).map(
            (freight) => ({
              ExpenseCode: freight.ExpensCode,
              LineTotal: freight.grossTotal,
              Remarks: freight.quantity,
              TaxCode: freight.TaxCode,
              TaxPercent: freight.TaxPercent,
              TaxSum: freight.TotalTaxAmount,
              LineGross: freight.amount,
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

      console.log("formdatatosend", payload, formDataToSend);
      let res = "";
      if (formDetails[0]?.name === "Sales Order") {
        res = await dispatch(
          updateCustomerOrder({ id, data: formDataToSend }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Sales Quotation") {
        res = await dispatch(
          updateSalesQuotation({ id, data: formDataToSend }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Order") {
        res = await dispatch(
          updatePurchaseOrder({ id, data: formDataToSend }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Quotation") {
        res = await dispatch(
          updatePurchaseQuotation({ id, data: formDataToSend }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Request") {
        res = await dispatch(
          updatePurchaseRequest({ id, data: formDataToSend }),
        ).unwrap();
      } else if (formDetails[0]?.name === "GRPO") {
        res = await dispatch(
          updatePurchaseDeliveryNotes({ id, data: formDataToSend }),
        ).unwrap();
      }
      if (res.message === "Please Login!") {
        navigate("/login");
      }
       res && setApiError(null);
      setOpen(true);
    } catch (err) {
      console.log("Err object:", err);

      // Safely read status
      const statusCode = err?.status || err?.response?.status || 0;
      const message = err?.message || "Failed to load data";

      console.error("c    :", statusCode, "Message:", message);
      setApiError(message);

      // If 401, redirect to login
      if (statusCode === 401) {
        navigate("/login");
      }
      setApiError(err.message || "Failed to load data");
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true); // open success dialog
      }, 500); // ✅ stop loader
    }
  };
  const menuBlocks =
    user?.Roles?.flatMap((role) =>
      role.UserMenus?.filter((menu) =>
        menu.children?.some((child) => child.Form?.id === formId),
      ).map((menu) => ({
        roleId: role.id,
        roleName: role.name,
        ...menu,
      })),
    ) || [];
  const childOptions = menuBlocks.length > 0 ? menuBlocks[0].children : [];
  const getUserFriendlyMessage = (error) => {
    if (!error) return "An unexpected error occurred.";

    if (error.code === "-5002") {
      return "The selected customer is not valid for this document.";
    }

    if (error.code === "-10") {
      return "Tax information is missing or incorrect.";
    }
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
    if (!user) return;

    if (formId !== undefined) {
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
            <>
              {" "}
              <Bar
                style={{ padding: 0.5, marginBottom: "16px" }}
                design={BarDesign.FloatingFooter}
                endContent={
                  <FlexBox style={{ gap: "0.5rem" }}>
                   
                    <Button design="default" onClick={() => handleSubmit()}>
                      Update
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
            </>
          }
          headerArea={
            <DynamicPageHeader
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                //backgroundColor: "#354a5f", // SAP Blue
                // color: "white",
              }}
            >
              <FlexBox
                direction="Row"
                style={{
                  display: "inline-flex",
                  alignItems: "end",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                <FlexBox direction="Column">
                  <Text>Customer</Text>
                </FlexBox>
                <span style={{ width: "4rem" }} />
                <FlexBox direction="Column">
                  <Text>Total:</Text>
                  <ObjectStatus state="None">GBP 0.00</ObjectStatus>
                </FlexBox>
                <span style={{ width: "4rem" }} />
                <FlexBox direction="Column">
                  <Text>Status</Text>
                  <ObjectStatus state="Positive">Open</ObjectStatus>
                </FlexBox>
                <span style={{ width: "4rem" }} />
                <FlexBox direction="Column">
                  <Text>Credit Limit Utilization</Text>
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
            maxHeight: "90vh",
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
                        ? "Update " + formDetails[0]?.name
                        : "Update"}
                    </BreadcrumbsItem>
                  </Breadcrumbs>
                </>
              }
              header={
                <Title level="H2">
                  {formDetails
                    ? formDetails[0]?.name
                    : formId
                      ? formId
                      : "Sales Order"}
                </Title>
              }
              navigationBar={
                 formDetails[0]?.name!=="Purchase Request"&&formDetails[0]?.name!=="GRPO"?
                <Toolbar design="Transparent">
                 <ToolbarButton
                    design="default"
                    onClick={copyForm}
                    icon="sap-icon://copy"
                    text="Copy From"
                  />
                  {console.log("copiesformdataeditsalesorder", copiedFormData)}
                  <Select
                    onChange={(e) => {
                      const selectPage = e.detail.selectedOption.dataset.id;
                      navigate(
                        "/cloneorder/create/" + formId + "/" + selectPage,
                        {
                          state: { copyFormData: copiedFormData },
                        },
                      );
                    }}

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
                 
                </Toolbar> :<></>
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
                setCurrencyType={setCurrencyType}
                currencyType={currencyType}
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
              dimensionData={dimensionData}
              setDimensionData={setDimensionData}
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
              saveItem={saveItem}
              saveService={saveService}
               selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
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
            <Attachments
              onFilesChange={setAttachmentFiles}
              attachmentsList={attachmentsList}
              setAttachmentsList={setAttachmentsList}
              oldAttachmentFiles={oldAttachmentFiles}
              setOldAttachmentFiles={setOldAttachmentFiles}
            />
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
      {isCloneSelected && (
        <CloneSalesOrder copiedFormData={copiedFormData} formId={formId} />
      )}
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
                style={{ fontSize: "2rem", color: "red" }}
              >
                {" "}
              </Icon>
              <h3 style={{ marginTop: "1rem" }}>
                {formDetails[0]?.name + " Not Updated"}
              </h3>
              <p>{getUserFriendlyMessage(apiError)}</p>
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
              apiError ? setOpen(false) : navigate(`/Sales/${formId}`);
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
