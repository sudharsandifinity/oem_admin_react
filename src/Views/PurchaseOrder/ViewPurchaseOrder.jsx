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

import { PurchaseOrderRenderInput } from "./PurchaseOrderRenderInput";
import General from "./General/General";
import Contents from "./Contents/Contents";
import Logistics from "./Logistics/Logistics";
import { useNavigate, useParams } from "react-router-dom";
import CustomerSelection from "./Header/CustomerSelection";
import Accounting from "./Accounting/Accounting";
import Attachments from "./Attachments/Attachments";
import UserDefinedFields from "./User-DefinedFields/UserDefinedFields";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrderById, updateCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import { fetchOrderItems } from "../../store/slices/CustomerOrderItemsSlice";
import { fetchVendorOrderById } from "../../store/slices/VendorOrderSlice";


const ViewPurchaseOrder = () => {
  const { id, formId } = useParams();
  const { fieldConfig, CustomerDetails, DocumentDetails } =
    useContext(FormConfigContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderItems } = useSelector((state) => state.orderItems);
  const [apiError, setApiError] = useState(null);
  const user = useSelector((state) => state.auth.user);
   const [open, setOpen] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [formDetails, setFormDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [generaleditdata, setgeneraleditdata] = useState([]);
  const [itemdata, setitemData] = useState([
    { slno: 1, ItemCode: "", ItemName: "", quantity: "", amount: "" },
  ]);
  const [itemTabledata, setitemTableData] = useState([
    { slno: 1, ItemCode: "", ItemName: "", quantity: "", amount: "" },
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchVendorOrderById(id)).unwrap();
        const res1 = await dispatch(fetchOrderItems()).unwrap();
        console.log("res,res1", res, res1);
        if (res) {
          // 1. Store order header info
          setFormData({
            CardCode: res.CardCode,
            CardName: res.CardName,
            DocDueDate: res.CreationDate
              ? new Date(res.CreationDate).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            DocumentLines: res.DocumentLines || [],
          });

          // 2. Merge document lines into orderItems
          if (res.DocumentLines?.length > 0) {
            setitemData((prev) =>
              prev.map((item) => {
                const matched = res.DocumentLines.find(
                  (line) => line.ItemCode === item.ItemCode
                );
                return matched
                  ? {
                      ...item,
                      quantity: matched.Quantity,
                      amount: matched.Amount,
                    }
                  : item;
              })
            );
            console.log(
              "itemTabledata:->",
              itemTabledata,
              itemdata,
              res.DocumentLines
            );
            setitemTableData(
              () =>
                res1.value
                  .map((item) => {
                    const matched = res.DocumentLines.find(
                      (line) => line.ItemCode === item.ItemCode
                    );

                    return matched
                      ? {
                          slno: matched.LineNum + 1, // usually LineNum is 0-based
                          ItemCode: matched.ItemCode,
                          ItemName: matched.ItemDescription,
                          quantity: matched.Quantity,
                          amount: matched.Amount,
                        }
                      : null; // no placeholder
                  })
                  .filter(Boolean) // remove nulls
            );

            // 3. Preselect rows
            if (res1.value?.length > 0) {
              const preselected = {};
              res.DocumentLines.forEach((line) => {
                const idx = res1.value.findIndex(
                  (o) => o.ItemCode === line.ItemCode
                );
                if (idx !== -1) {
                  preselected[idx] = res1.value[idx];
                }
              });
              setRowSelection(preselected);
            }
          }

          // set general header edit data
          setgeneraleditdata({
            CardCode: res.CardCode,
            CardName: res.CardName,
            CreationDate: res.CreationDate,
          });
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, id, orderItems]);

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
          Quantity: line.quantity?line.quantity:1,
          UnitPrice: line.amount,
        })),
      };
      console.log("payload", payload);
      const res = await dispatch(
        updateCustomerOrder({ id, data: payload })
      ).unwrap();
      if (res.message === "Please Login!") {
        navigate("/login");
      }
     setOpen(true);
    } catch (err) {
      setApiError(err?.message || "Failed to create branch");
    }
    finally  {
    setLoading(false); // ✅ stop loader
      setTimeout(() => {
      setLoading(false);
      setOpen(true); // open success dialog
    }, 2000);
  }
  };
  useEffect(() => {
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
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column", // stack indicator + message vertically
            alignItems: "center", // center horizontally
            justifyContent: "center", // center vertically
            height: "90vh", // take full viewport height
            width: "100%", // take full width
          }}
        >
          <BusyIndicator active size="M" />
          <span style={{ marginTop: "1rem", fontSize: "1rem", color: "#555" }}>
           Loading please wait.🚀
          </span>
        </div>
      ) : (
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
                      onClick={() => navigate(`/Purchase/${formId}`)}
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
              {/* <FlexBox wrap="Wrap">
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
                    <BreadcrumbsItem data-route="/UserDashboard">
                      Home
                    </BreadcrumbsItem>
                    <BreadcrumbsItem data-route={`/Purchase/${formId}`}>
                      Manage Purchase Order
                    </BreadcrumbsItem>
                    <BreadcrumbsItem>
                      {formDetails ? formDetails[0]?.name : "Purchase Order"}
                    </BreadcrumbsItem>
                  </Breadcrumbs>
                </>
              }
              header={
                <Title level="H2">
                  {formDetails ? formDetails[0]?.name : "Purchase Order"}
                </Title>
              }
              navigationBar={
                <Toolbar design="Transparent">
                  {/* <ToolbarButton design="Transparent" icon="full-screen" />
              <ToolbarButton design="Transparent" icon="exit-full-screen" /> */}

                  <ToolbarButton
                    onClick={() => navigate(`/Purchase/${formId}`)}
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
            <General
              onSubmit={handleSubmit}
              setFormData={setFormData}
              formData={formData}
              defaultValues={formData} // ✅ now passes edit data properly
              apiError={apiError}
              mode="view"
            />
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
            <Contents
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              itemdata={itemdata}
              setitemData={setitemData}
              setitemTableData={setitemTableData}
              itemTabledata={itemTabledata}
              orderItems={orderItems}
              loading={loading}
              form={form}
              handleRowChange={handleRowChange}
              deleteRow={deleteRow}
              addRow={addRow}
              PurchaseOrderRenderInput={PurchaseOrderRenderInput}
              handleChange={handleChange}
              mode="view"
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
              PurchaseOrderRenderInput={PurchaseOrderRenderInput}
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
            <Attachments />
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
            <UserDefinedFields form={form} handleChange={handleChange} />
          </ObjectPageSection>
          {/* );
                    }
                })
             
            } */}
        </ObjectPage>
      )}
       <Dialog open={open} onAfterClose={() => setOpen(false)}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "2rem",
                      textAlign: "center"
                    }}
                  >
                    {apiError ? (
                               <Icon
                                 name="message-error"
                                 style={{ fontSize: "2rem", color: "red" }}
                               >
                                 <h2 style={{ marginTop: "1rem" }}>Error!</h2>
                                 <p>{apiError}</p>
                               </Icon>
                             ) : (
                                <Icon name="message-success" style={{ fontSize: "2rem", color: "green" }} >
                                 <h2 style={{ marginTop: "1rem" }}>Success!</h2>
                                 <p>Your request has been submitted successfully 🎉</p>
                               </Icon>
                             )}  <Button design="Emphasized" onClick={() => {navigate(`/Purchase/${formId}`);;setOpen(false)}}>
                      OK
                    </Button>
                  </div>
                </Dialog>
    </>
  );
};


export default ViewPurchaseOrder
