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

import { MaterialRequestRenderInput } from "./MaterialRequestRenderInput";
import General from "./General/General";
import Contents from "./Contents/Contents";
import { useNavigate, useParams } from "react-router-dom";
import CustomerSelection from "./Header/CustomerSelection";
import Attachments from "./Attachments/Attachments";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCustomerOrderById,
  updateCustomerOrder,
} from "../../store/slices/CustomerOrderSlice";
import { fetchOrderItems } from "../../store/slices/CustomerOrderItemsSlice";
import { fetchOrderServices } from "../../store/slices/CustomerOrderServiceSlice";
import {
  fetchAttachmentDetailsById,
  fetchitemprices,
} from "../../store/slices/salesAdditionalDetailsSlice";
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
import "@ui5/webcomponents-icons/dist/copy.js";
import {
  createPurchaseRequest,
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
import {
  fetchBOQList,
  fetchMaterialRequestById,
  updateMaterialRequest,
} from "../../store/slices/materialRequestSlice";
import BOQListDialog from "./BOQCopyFrom/BOQListDialog";
import OpenPurRequestItemsDialog from "./openPurRequestItemsDialog";

const EditMaterialRequest = () => {
  const { id, formId } = useParams();
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems } = useSelector((state) => state.orderItems);
  const {userList} = useSelector((state) => state.materialRequests);
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
  const [selectedItemOwner, setSelectedItemOwner] = useState("");
  const [selectedServiceOwner, setSelectedServiceOwner] = useState("");
  const [selectedPurRequestList, setSelectedPurRequestList] = useState([]);
  const [originalSelectedPurRequestList, setOriginalSelectedPurRequestList] = useState([]);

  const [currencyType, setCurrencyType] = useState("GBP");

  const [dimensionData, setDimensionData] = useState([]);
 const [originalboqrequestList,setOriginalboqrequestlist] = useState([]);
  const [inputValue, setInputValue] = useState({});
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
  const [isCopyFromBOQ, setIsCopyFromBOQ] = useState(false);

  const [opencopyFromDialog, setOpenCopyFromDialog] = useState(false);
  const [requestList, setRequestList] = useState([]);

  const [isCloneSelected, setIsCloneSelected] = useState(false);
  const [itemTabledata, setitemTableData] = useState([
    {
      slno: 1,
      task: "",
      BoqLineNum: "",
      ItemCode: "",
      ItemName: "",
      fulldescription: "",
      quantity: "",
      amount: "",
      linetotal: "",
      project: "",
      warehouse: "",
      uom: "",
      stage: "",
      issuedQty: "",
      inStock: "",
      availableQty: "",
      rateTotal: "",
      remarks: "",
    },
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
  const [isBoqListopem, setisBoqListopem] = useState(false);
  const [boqrequestList, setBoqRequestList] = useState([]);
  const [refreshdata, setRefreshData] = useState([]);
  const [openPurRequestItemsDialog, setOpenPurRequestItemsDialog] = useState(false);
  
   const [selectedSectionId, setSelectedSectionId] =
    useState("section1");

  const goodsIssue = async()=>{
      const tabledata = itemTabledata;
    const data = {
      ...formData,
      ...tabledata,
      ...summaryData,
    };

    //delete data.DocEntry;
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
    let cloneFOrmData = { 
      ...data,
      formData: formData,
      copyFrom: formDetails[0]?.name,
      DocumentLines: tabledata.filter(
            (item) =>item.ItemCode && Number(item.quantity || 0) <= Number(item.availableQty || 0),
          ),
      summaryData: summaryData,
      DocType: "dDocument_Items",
      Remark: summaryData.Remark,
      DocTotal: summaryData.DocTotal,
      Rounding: summaryData.Rounding,
      RoundingDiffAmount: summaryData.RoundingDiffAmount,
      DiscountPercent: summaryData.DiscountPercent,
      TotalDiscount: summaryData.TotalDiscount,
      VatSum: summaryData.VatSum,
    };
    setCopiedFormData(cloneFOrmData);
    //HandleSubmitCLoneData(cloneFOrmData);
    navigate(
      "/cloneMaterialRequest/create/" + formId + "/" + formData.docEntry,
      {
        state: { copyFormData: cloneFOrmData, formname: "Goods Issue" },
      },
    );

  }
const refreshStock = async () => {
  try {
    setLoading(true);
 const data={ U_BPCode: formData.CusCode||null, 
      U_PrjCode:formData.ProjectCode||null }
    const res = await dispatch(fetchBOQList(data)).unwrap();

    const currentItemValues = itemTabledata.map((item) => ({
      ItemCode: item.ItemCode,
      quantity: item.quantity, // ✅ FIX: include quantity
      warehouse: item.warehouse,
    }));

    console.log("refreshstock", res, currentItemValues);

    const boqItems = res.flatMap(
      (boqlist) => boqlist.HLB_BOQT1Collection || [],
    );

    setitemTableData((prev) => {
      return prev.map((row) => {
        const matchedCurrent = currentItemValues.find(
          (line) => line.ItemCode === row.ItemCode,
        );

        return {
          ...row,
          quantity: matchedCurrent?.quantity ?? row.quantity ?? 0,
        };
      });
    });
  } catch (error) {
    console.error("refreshStock error:", error);
  } finally {
    setLoading(false);
  }
};
    

  const openBoqList = async () => {
    console.log("openBoqList");
    setSelectedSectionId("section2")
    setIsCopyFromBOQ(true);
     const data={ U_BPCode: formData.CusCode||null, 
      U_PrjCode:formData.ProjectCode||null }
    const res = await dispatch(fetchBOQList(data)).unwrap();
    const currentType =
      type === "Item" ? "dDocument_Items" : "dDocument_Service";
    const raw = res?.data?.value ?? res?.data ?? res?.value ?? res;
    console.log("resraw", res, raw);
    setBoqRequestList(raw);
    setOriginalboqrequestlist(raw);
    console.log("currentType", currentType, res?.data);
    setisBoqListopem(true);
  };
  const openPurRequestItems=async()=>{
      setOpenPurRequestItemsDialog(true);
      console.log("openPurRequestItems",itemTabledata)
      setSelectedPurRequestList( itemTabledata.filter(
            (item) =>item.ItemCode && Number(item.quantity || 0) >= Number(item.availableQty || 0),
          ));
          setOriginalSelectedPurRequestList( itemTabledata.filter(
            (item) =>item.ItemCode && Number(item.quantity || 0) >= Number(item.availableQty || 0),
          ));
  }
  const submitPurchaseRequest = async (selectedRow) => {
    console.log("selectedRow",selectedRow)
    const tabledata = Object.values(selectedRow) || [];
    const data = {
      ...formData,
      ...tabledata,
      ...summaryData,
    };

    //delete data.DocEntry;
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
    let cloneFOrmData = { 
      ...data,
      formData: formData,
      copyFrom: formDetails[0]?.name,
      DocumentLines: tabledata.filter(
            (item) =>item.ItemCode && Number(item.quantity || 0) >= Number(item.availableQty || 0),
          ),
      summaryData: summaryData,
      DocType: "dDocument_Items",
      Remark: summaryData.Remark,
      DocTotal: summaryData.DocTotal,
      Rounding: summaryData.Rounding,
      RoundingDiffAmount: summaryData.RoundingDiffAmount,
      DiscountPercent: summaryData.DiscountPercent,
      TotalDiscount: summaryData.TotalDiscount,
      VatSum: summaryData.VatSum,
    };
    setCopiedFormData(cloneFOrmData);
    HandleSubmitCLoneData(cloneFOrmData);
    navigate(
      "/cloneMaterialRequest/create/" + formId + "/" + formData.docEntry,
      {
        state: { copyFormData: cloneFOrmData, formname: "Purchase Request" },
      },
    );
  };
  const copyFrom = async () => {
    setIsCopyFromBOQ(true);
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
       const newItems = Array.isArray(item) ? item.filter(i=>i.U_ItemCode!==null) : Object.values(item).filter(i=>i.U_ItemCode!==null);


    for (const newItem of newItems) {
      const itemresponse = await getItemPrice(
        selectedcardcode,
        newItem.ItemCode,
      );
      const price = itemresponse ? itemresponse.Price : 0;
      const discount = itemresponse ? itemresponse.DiscountPercent : ""; // You can replace this with any logic to determine the default quantity
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
            warehouse: item.U_Whs,
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
  useEffect(() => {
    if (!formDetails || formDetails.length === 0) return;
    if (!formDetails[0]?.name) return;
console.log("formDetails",formDetails[0]?.name)
    const fetchData = async () => {
      setLoading(true);

      try {
        let orderListById =[];
        if(formDetails[0]?.name === "Material Request"){
         orderListById = await dispatch(
          fetchMaterialRequestById(id),
        ).unwrap();
      }else if(formDetails[0]?.name === "GRPO"){  
          orderListById = await dispatch(
            fetchPurchaseDeliveryNotesById(id),
          ).unwrap();
        }

        const orderList = await dispatch(fetchOrderItems()).unwrap();
        const serviceList = await dispatch(fetchOrderServices()).unwrap();
        console.log("res,res1", orderListById, orderList, serviceList);
        console.log("orderListByIdedit", orderListById);

        if (orderListById) {
          // 1. Store order header info
          setSelectedCardCode(orderListById.U_CardCode);
          setFormData({
            docEntry: orderListById.DocEntry,
            docNum: orderListById.DocNum,
            RequisitionNo: orderListById.U_ReqCode,
            RequisitionDate: orderListById.U_DocDate || "",
            RequisitionTime: orderListById.U_ReqTime || "",
            RequiredDate: orderListById.U_ReqDate || "",
            CusCode: orderListById.U_CardCode,
            ProjectCode: orderListById.U_PrjCode,
            ProjectName: orderListById.U_PrjDesc,
            Remarks: orderListById.U_Remark,
            CardName: orderListById.U_CardName,
          });
          // 2. Merge document lines into orderItems
          if (orderListById.HLB_MRQ1Collection?.length > 0) {
            setType("Item");
            setitemData(
              () =>
                orderList.value
                  .map((item, index) => {
                    const matched = orderListById.HLB_MRQ1Collection.find(
                      (line) => line.U_ItmSerCode === item.ItemCode,
                    );

                    console.log("setitemeditpage", matched);

                    return matched !== undefined
                      ? {
                          task: matched.U_Task, // usually LineNum is 0-based
                          BoqLineNum: matched.U_SQlineNum,
                          LineId:matched.LineId,
                          ItemCode: matched.U_ItmSerCode,
                          ItemName: matched.U_Desc,
                          fulldescription: matched.U_ItemDesc,
                          quantity: matched.U_ReqQty,
                          amount: matched.U_UnitPrice,
                          linetotal: matched.U_LineTotal,
                          project: matched.U_Project,
                          warehouse: matched.U_Whs,
                          uom: matched.U_UOM,
                          stage: matched.U_Stage,
                          issuedQty: matched.U_IssuedQty,
                          inStock: matched.U_InStock,
                          availableQty: matched.U_AvlQty,
                          rateTotal: matched.U_RateTotal,
                          remarks: matched.U_HLB_Rmarks,
                        }
                      : {
                          task: item.U_Task, // usually LineNum is 0-based
                          BoqLineNum: item.U_SQlineNum,
                          LineId:item.LineId,
                          ItemCode: item.U_ItmSerCode,
                          ItemName: item.U_ItemType,
                          fulldescription: item.U_ItemDesc,
                          quantity: item.U_ReqQty,
                          amount: item.U_UnitPrice,
                          linetotal: item.U_LineTotal,
                          project: item.U_Project,
                          warehouse: item.U_Whs,
                          uom: item.U_UOM,
                          stage: item.U_Stage,
                          issuedQty: item.U_IssuedQty,
                          inStock: item.U_InStock,
                          availableQty: item.U_AvlQty,
                          rateTotal: item.U_RateTotal,
                          remarks: item.U_HLB_Rmarks,
                        }; // no placeholder
                  })
                  .filter(Boolean), // remove nulls
            );

            setitemTableData(
              () =>
                orderList.value
                  .map((item) => {
                    const matched = orderListById.HLB_MRQ1Collection.find(
                      (line) => line.ItemCode === item.U_ItmSerCode,
                    );
                    return matched !== undefined
                      ? {
                          task: matched.U_Task, // usually LineNum is 0-based
                          BoqLineNum: matched.U_SQlineNum,
                          LineId:matched.LineId,
                          ItemCode: matched.U_ItmSerCode,
                          ItemName: matched.U_ItemType,
                          fulldescription: matched.U_ItemDesc,
                          quantity: matched.U_ReqQty,
                          amount: matched.U_UnitPrice,
                          linetotal: matched.U_LineTotal,
                          project: matched.U_Project,
                          warehouse: matched.U_Whs,
                          uom: matched.U_UOM,
                          stage: matched.U_Stage,
                          issuedQty: matched.U_IssuedQty,
                          inStock: matched.U_InStock,
                          availableQty: matched.U_AvlQty,
                          rateTotal: matched.U_RateTotal,
                          remarks: matched.U_HLB_Rmarks,
                        }
                      : {
                          task: item.U_Task, // usually LineNum is 0-based
                          BoqLineNum: item.U_SQlineNum,
                          LineId:item.LineId,
                          ItemCode: item.U_ItmSerCode,
                          ItemName: item.U_ItemType,
                          fulldescription: item.U_ItemDesc,
                          quantity: item.U_ReqQty,
                          amount: item.U_UnitPrice,
                          linetotal: item.U_LineTotal,
                          project: item.U_Project,
                          warehouse: item.U_Whs,
                          uom: item.U_UOM,
                          stage: item.U_Stage,
                          issuedQty: item.U_IssuedQty,
                          inStock: item.U_InStock,
                          availableQty: item.U_AvlQty,
                          rateTotal: item.U_RateTotal,
                          remarks: item.U_HLB_Rmarks,
                        }; // no placeholder
                  })
                  .filter(Boolean), // remove nulls
            );

            setitemTableData(() =>
              orderListById.HLB_MRQ1Collection.map((item, index) => ({
                task: item.U_Task, // usually LineNum is 0-based
                BoqLineNum: item.U_SQlineNum,
                LineId:item.LineId,
                ItemCode: item.U_ItmSerCode,
                ItemName: item.U_ItemType,
                fulldescription: item.U_ItemDesc,
                quantity: item.U_ReqQty,
                amount: item.U_UnitPrice,
                linetotal: item.U_LineTotal,
                project: item.U_Project,
                warehouse: item.U_Whs,
                uom: item.U_UOM,
                stage: item.U_Stage,
                issuedQty: item.U_IssuedQty,
                inStock: item.U_InStock,
                availableQty: item.U_AvlQty,
                rateTotal: item.U_RateTotal,
                remarks: item.U_HLB_Rmarks,
              })),
            );
            if (orderList.value?.length > 0) {
              const preselected = {};
              orderListById.HLB_MRQ1Collection.forEach((line) => {
                const idx = orderList.value.findIndex(
                  (o) => o.ItemCode === line.U_ItmSerCode,
                );
                if (idx !== -1) {
                  preselected[idx] = orderList.value[idx];
                }
              });
              setRowSelection(preselected);
            }

            console.log(
              "itemTabledata:->",
              itemTabledata,
              itemdata,
              orderListById.HLB_MRQ1Collection,
              orderListById,
              "formData",
              formData,
            );

            // 3. Preselect rows
          }
          setSummaryData((prev) => ({
            ...prev,
            RequestorCode: orderListById.U_ReqCode,
              InternalKey:String(userList.find(u=>u.UserName === orderListById.U_ReqName)?.InternalKey || ""),
            RequestorName: orderListById.U_ReqName,
            eMail:orderListById.eMail,
            Department: orderListById.U_Dept,
            DocTotal: orderListById.DocTotal,
            ApprovalStatus: orderListById.U_AppStatus,
            ApprovedBy: orderListById.U_AppByName,
            ApprovedDate: orderListById.U_AppDate,
            ApprovedTime: orderListById.U_AppTime,
          }));
          // set general header edit data
          setFreightRowSelection(
            orderListById.DocumentAdditionalExpenses || [],
          );
          setSummaryDiscountPercent(orderListById.DiscountPercent);
          orderListById.DocType === "dDocument_Items"
            ? setSelectedItemOwner(orderListById.DocumentsOwner || "")
            : setSelectedServiceOwner(orderListById.DocumentsOwner || "");
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
  const HandleSubmitCLoneData = async (form) => {
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

        DocumentLines: itemTabledata
          .filter(
            (item) =>
              item.ItemCode &&
              Number(item.quantity || 0) <= Number(item.inStock || 0),
          )
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
              U_MRLine: line.BoqLineNum,
              RequiredDate: formatDate(formData.RequiredDate),
            };
          }),
        U_MRNo: formData.docEntry,
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
        "formdatatosend",
        payload,
        formDataToSend,
        formDetails,
        "attachmentsList",
        attachmentsList,
      );
      let res = "";
      res = await dispatch(createPurchaseRequest(formDataToSend)).unwrap();

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
        "Material Request converted into purchase request." + message,
      );

      // If 401, redirect to login
      if (statusCode === 401) {
        navigate("/login");
      }
      setApiError(
        "Material Request converted into purchase request." +
          (err.message || "Error creating order"),
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
      }, 500);
    }
  };

  const handleSubmit = async (form) => {
    console.log("Form submitted:", formData, itemTabledata, itemdata);
    let filteredData = [];
    if (itemdata.length === 1 && itemdata[0].ItemCode === "") {
      filteredData = itemTabledata;
    } else {
      filteredData = itemTabledata.filter((item) =>
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
      console.log(
        "itemTabledatahandleSubmit",
        dimensionData,
        "itemTabledata",
        itemTabledata,
        formData,
        freightRowSelection,
      );
      console.log("formDatahandlesubmit", filteredData);
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
        HLB_MRQ1Collection: filteredData.map((item) => ({
          LineId:item.LineId,
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

      let res = await dispatch(
        updateMaterialRequest({ id, data: payload }),
      ).unwrap();

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
          menu.children.filter((submenu) => submenu?.Form?.id === formId),
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
            <Bar
              design={BarDesign.FloatingFooter}
              style={{
                padding: "0.5rem 1rem",
                marginBottom: "16px",
              }}
              startContent={
                <FlexBox style={{ gap: "0.5rem" }}>
                  <Button design="Default" onClick={() => refreshStock()}>
                    Refresh Stock
                  </Button>

                  <Button design="Default" disabled={ !formData.CusCode && !formData.ProjectCode} onClick={openBoqList}>
                  Copy From BOM
                  </Button>

                  <Button
                    design="Default"
                    onClick={() =>{ openPurRequestItems()}}
                  >
                    Purchase Request
                  </Button>
                    <Button design="Default" onClick={() => goodsIssue()}>
                    Goods Issue
                  </Button>
                 
                </FlexBox>
              }
              endContent={
                <FlexBox style={{ gap: "0.5rem" }}>
                  <Button design="default" onClick={() => handleSubmit()}>
                    Update
                  </Button>
                  <Button
                    design="default"
                    onClick={() => navigate(`/Contracting-Management/${formId}`)}
                  >
                    Cancel
                  </Button>
                </FlexBox>
              }
            />
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
              {/* <FlexBox
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
              </FlexBox> */}
            </DynamicPageHeader>
          }
          // image="https://sap.github.io/ui5-webcomponents-react/v2/assets/Person-B7wHqdJw.png"
          imageShapeCircle
          mode="IconTabBar"
          onBeforeNavigate={function Xs() {}}
          onPinButtonToggle={function Xs() {}}
          onSelectedSectionChange={function Xs() {}}
          onToggleHeaderArea={function Xs() {}}
           selectedSectionId={selectedSectionId}
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
                    <BreadcrumbsItem data-route={`/Contracting-Management/${formId}`}>
                      {formDetails
                        ? formDetails[0]?.name + " List"
                        : "Contracting Management"}
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
                pageId={id}
                formName={"Material Request"}
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
              formName={"Material Request"}
              formData={formData}
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
        </ObjectPage>
      </BusyIndicator>

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
         setBoqRequestList={setBoqRequestList}
         originalboqrequestList={originalboqrequestList}
  setOriginalboqrequestlist={setOriginalboqrequestlist}
  inputValue={inputValue}
  setInputValue={setInputValue}
      />
      <OpenPurRequestItemsDialog
        open={openPurRequestItemsDialog}
        setOpen={setOpenPurRequestItemsDialog}
        selectedPurRequestList={selectedPurRequestList}
        saveItem={saveItem}
        saveService={saveService}
        type={type}
        setType={setType}
        submitPurchaseRequest={submitPurchaseRequest}
        setSelectedPurRequestList={setSelectedPurRequestList}
         originalSelectedPurRequestList={originalSelectedPurRequestList}
  setOriginalSelectedPurRequestList={setOriginalSelectedPurRequestList}
  inputValue={inputValue}
  setInputValue={setInputValue}
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
              apiError ? setOpen(false) : navigate(`/Contracting-Management/${formId}`);
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

export default EditMaterialRequest;
