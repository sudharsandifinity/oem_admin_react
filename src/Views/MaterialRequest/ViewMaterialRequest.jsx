// DynamicForm.jsx
import React, {
  Suspense,
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
  fetchSalesQuotationById,
  updateSalesQuotation,
} from "../../store/slices/SalesQuotationSlice";
import {
  fetchPurchaseQuotationById,
  updatePurchaseQuotation,
} from "../../store/slices/PurchaseQuotation";
import "@ui5/webcomponents-icons/dist/copy.js";
import { fetchAttachmentDetailsById } from "../../store/slices/salesAdditionalDetailsSlice";
import {
  fetchPurchaseRequestById,
  updatePurchaseRequest,
} from "../../store/slices/PurchaseRequestSlice";
import { fetchPurchaseDeliveryNotesById } from "../../store/slices/purDeliveryNoteSlice";
import { fetchMaterialRequestById } from "../../store/slices/materialRequestSlice";

const ViewMaterialRequest = () => {
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
  const [currencyType, setCurrencyType] = useState("GBP");

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
  const [selectedItemOwner, setSelectedItemOwner] = useState("");
  const [selectedServiceOwner, setSelectedServiceOwner] = useState("");

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
    PostingDate: "",
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
    console.log("formDetails[0]?.name",formDetails[0]?.name)

    const fetchData = async () => {
      setLoading(true);

      try {
         let orderListById = "";
        if (formDetails[0]?.name === "Purchase Request") {
          
         orderListById = await dispatch(
          fetchPurchaseRequestById(id),
        ).unwrap();
      }else if(formDetails[0]?.name === "GRPO"){
          orderListById = await dispatch(
            fetchPurchaseDeliveryNotesById(id),
          ).unwrap();
        }else{
          orderListById = await dispatch( fetchMaterialRequestById(id)).unwrap(); 
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
            docNum:orderListById.DocNum,
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
          if (orderListById.HLB_MRQ1Collection||orderListById.DocumentLines?.length > 0) {
            setType("Item");
            setitemData(
              () =>
                orderList.value
                  .map((item, index) => {
                    const matched = orderListById.HLB_MRQ1Collection||orderListById.DocumentLines.find(
                      (line) => line.U_ItmSerCode === item.ItemCode,
                    );

                    console.log("setitemeditpage", matched);

                    return matched !== undefined
                      ? {
                          task: matched.U_Task||matched.Task,
                          BoqLineNum: matched.U_SQlineNum||matched.SQlineNum,
                          ItemCode: matched.U_ItmSerCode||matched.ItemCode,
                          ItemName: matched.U_ItemType||matched.ItemDescription,
                          fulldescription: matched.U_ItemDesc||matched.ItemDescription,
                          quantity: matched.U_ReqQty||matched.Quantity,
                          amount: matched.U_UnitPrice||matched.UnitPrice,
                          linetotal: matched.U_LineTotal||matched.LineTotal,
                          project: matched.U_Project||matched.ProjectCode,
                          warehouse: matched.U_Whs||matched.Warehouse,
                          uom: matched.U_UOM||matched.UoMCode,
                          stage: matched.U_Stage||matched.StgDesc,
                          issuedQty: matched.U_IssuedQty||matched.IssuedQty,
                          inStock: matched.U_InStock||matched.InStock,
                          availableQty: matched.U_AvlQty||matched.AvlQty,
                          rateTotal: matched.U_RateTotal||matched.Rate,
                          remarks: matched.U_HLB_Rmarks||matched.Remarks,
                        }
                      : {
                         task: item.U_Task||item.Task, // usually LineNum is 0-based
                          BoqLineNum: item.U_SQlineNum||item.SQlineNum,
                          ItemCode: item.U_ItmSerCode||item.ItemCode,
                          ItemName: item.U_ItemType||item.ItemDescription,
                          fulldescription: item.U_ItemDesc||item.ItemDescription,
                          quantity: item.U_ReqQty||item.Quantity,
                          amount: item.U_UnitPrice||item.UnitPrice,
                          linetotal: item.U_LineTotal||item.LineTotal,
                          project: item.U_Project||item.ProjectCode,
                          warehouse: item.U_Whs||item.Warehouse,
                          uom: item.U_UOM||item.UoMCode,
                          stage: item.U_Stage||item.StgDesc,
                          issuedQty: item.U_IssuedQty||item.IssuedQty,
                          inStock: item.U_InStock||item.InStock,
                          availableQty: item.U_AvlQty||item.AvlQty,
                          rateTotal: item.U_RateTotal||item.Rate,
                          remarks: item.U_HLB_Rmarks||item.Remarks,
                        }; // no placeholder
                  })
                  .filter(Boolean), // remove nulls
            );

            setitemTableData(
              () =>
                orderList.value
                  .map((item) => {
                    const matched = orderListById.HLB_MRQ1Collection||orderListById.DocumentLines.find(
                      (line) => line.ItemCode === item.U_ItmSerCode,
                    );
                    return matched !== undefined
                      ? {
                         task: matched.U_Task||matched.Task, // usually LineNum is 0-based
                          BoqLineNum: matched.U_SQlineNum||matched.SQlineNum,
                          ItemCode: matched.U_ItmSerCode||matched.ItemCode,
                          ItemName: matched.U_ItemType||matched.ItemDescription,
                          fulldescription: matched.U_ItemDesc||matched.ItemDescription,
                          quantity: matched.U_ReqQty||matched.Quantity,
                          amount: matched.U_UnitPrice||matched.UnitPrice,
                          linetotal: matched.U_LineTotal||matched.LineTotal,
                          project: matched.U_Project||matched.ProjectCode,
                          warehouse: matched.U_Whs||matched.Warehouse,
                          uom: matched.U_UOM||matched.UoMCode,
                          stage: matched.U_Stage||matched.StgDesc,
                          issuedQty: matched.U_IssuedQty||matched.IssuedQty,
                          inStock: matched.U_InStock||matched.InStock,
                          availableQty: matched.U_AvlQty||matched.AvlQty,
                          rateTotal: matched.U_RateTotal||matched.Rate,
                          remarks: matched.U_HLB_Rmarks||matched.Remarks,
                        }
                      : {
                           task: item.U_Task||item.Task, // usually LineNum is 0-based
                          BoqLineNum: item.U_SQlineNum||item.SQlineNum,
                          ItemCode: item.U_ItmSerCode||item.ItemCode,
                          ItemName: item.U_ItemType||item.ItemDescription,
                          fulldescription: item.U_ItemDesc||item.ItemDescription,
                          quantity: item.U_ReqQty||item.Quantity,
                          amount: item.U_UnitPrice||item.UnitPrice,
                          linetotal: item.U_LineTotal||item.LineTotal,
                          project: item.U_Project||item.ProjectCode,
                          warehouse: item.U_Whs||item.Warehouse,
                          uom: item.U_UOM||item.UoMCode,
                          stage: item.U_Stage||item.StgDesc,
                          issuedQty: item.U_IssuedQty||item.IssuedQty,
                          inStock: item.U_InStock||item.InStock,
                          availableQty: item.U_AvlQty||item.AvlQty,
                          rateTotal: item.U_RateTotal||item.Rate,
                          remarks: item.U_HLB_Rmarks||item.Remarks,
                        }; // no placeholder
                  })
                  .filter(Boolean), // remove nulls
            );

            setitemTableData(() =>
              orderListById.HLB_MRQ1Collection||orderListById.DocumentLines.map((item, index) => ({
                task: item.U_Task||item.Task, // usually LineNum is 0-based
                BoqLineNum: item.U_SQlineNum||item.SQlineNum,
                ItemCode: item.U_ItmSerCode||item.ItemCode,
                ItemName: item.U_ItemType||item.ItemDescription,
                fulldescription: item.U_ItemDesc||item.ItemDescription,
                quantity: item.U_ReqQty||item.Quantity,
                amount: item.U_UnitPrice||item.UnitPrice,
                linetotal: item.U_LineTotal||item.LineTotal,
                project: item.U_Project||item.ProjectCode,
                warehouse: item.U_Whs||item.Warehouse,
                uom: item.U_UOM||item.UoMCode,
                stage: item.U_Stage||item.StgDesc,
                issuedQty: item.U_IssuedQty||item.IssuedQty,
                inStock: item.U_InStock||item.InStock,
                availableQty: item.U_AvlQty||item.AvlQty,
                rateTotal: item.U_RateTotal||item.Rate,
                remarks: item.U_HLB_Rmarks||item.Remarks,
              })),
            );
            if (orderList.value?.length > 0) {
              const preselected = {};
              orderListById.HLB_MRQ1Collection||orderListById.DocumentLines.forEach((line) => {
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
              orderListById,
              "formData",
              formData,
            );

            // 3. Preselect rows
          }
          setSummaryData((prev) => ({
            ...prev,
            RequestorCode: orderListById.U_ReqCode,
            RequestorName: orderListById.U_ReqName,
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
          updateCustomerOrder({ id, data: payload }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Sales Quotation") {
        res = await dispatch(
          updateSalesQuotation({ id, data: payload }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Order") {
        res = await dispatch(
          updatePurchaseOrder({ id, data: payload }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Quotation") {
        res = await dispatch(
          updatePurchaseQuotation({ id, data: payload }),
        ).unwrap();
      } else if (formDetails[0]?.name === "Purchase Request") {
        res = await dispatch(
          updatePurchaseRequest({ id, data: payload }),
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
        menu.children?.some((child) => child.Form?.id === formId),
      ).map((menu) => ({
        roleId: role.id,
        roleName: role.name,
        ...menu,
      })),
    ) || [];
  const childOptions = menuBlocks.length > 0 ? menuBlocks[0].children : [];
  useEffect(() => {
    if (!user) return;

    if (formId !== undefined) {
      // Fetch form data based on formId
      const formDetails = user?.Roles?.flatMap((role) =>
        role.UserMenus.flatMap((menu) =>
          menu.children.filter((submenu) => submenu.Form?.id === formId),
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
      <style>
        {`
            ._footer_17oaz_164{
              position: static
            }
          `}
      </style>
      <BusyIndicator
        style={{
          width: "100%",
          height: "100%",
        }}
        active={loading}
      >
        <ObjectPage
          className="sales-order-page"
          footerArea={
            <>
              {" "}
              <Bar
                style={{ padding: 0.5, marginBottom: "16px" }}
                design="FloatingFooter"
                endContent={
                  <>
                    <Button
                      design="default"
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
                        ? formDetails[0]?.name + " List "
                        : "Sales Orders"}
                    </BreadcrumbsItem>
                    <BreadcrumbsItem>
                      {formDetails ? "View " + formDetails[0]?.name : "View"}
                    </BreadcrumbsItem>
                  </Breadcrumbs>
                </>
              }
              header={
                <Title level="H2">
                  {formDetails ? formDetails[0]?.name : "Sales Order"}
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
                formName={"Material Request"}
                defaultValues={formData} // ✅ now passes edit data properly
                apiError={apiError}
                pageId={id}
                setCurrencyType={setCurrencyType}
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
                selectedItemOwner={selectedItemOwner}
                selectedServiceOwner={selectedServiceOwner}
                setSelectedItemOwner={setSelectedItemOwner}
                setSelectedServiceOwner={setSelectedServiceOwner}
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
                MaterialRequestRenderInput={MaterialRequestRenderInput}
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
                //saveItem={saveItem}
              />
            </Suspense>
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

export default ViewMaterialRequest;
