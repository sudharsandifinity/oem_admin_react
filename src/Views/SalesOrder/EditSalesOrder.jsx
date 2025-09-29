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
import { fetchCustomerOrderById, updateCustomerOrder } from "../../store/slices/CustomerOrderSlice";
import { fetchOrderItems } from "../../store/slices/CustomerOrderItemsSlice";


const EditSalesOrder = () => {
    const { id, formId } = useParams();
    const { fieldConfig, CustomerDetails, DocumentDetails } =
        useContext(FormConfigContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orderItems } = useSelector((state) => state.orderItems);
    const [apiError, setApiError] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const [tabList, setTabList] = useState([]);
    const [formDetails, setFormDetails] = useState([]);
    const [formData, setFormData] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [generaleditdata, setgeneraleditdata] = useState([]);
    const [itemdata, setitemData] = useState([
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
                const res = await dispatch(fetchCustomerOrderById(id)).unwrap();
                const res1 = await dispatch(fetchOrderItems()).unwrap();
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
        console.log("Form submitted:", form, formData, rowSelection);
        try {
            
            const payload = {
                "CardCode": formData.CardCode,
                "DocDueDate": formData.DocDueDate
                    ? new Date(formData.DocDueDate)
                        .toISOString()
                        .split("T")[0]
                        .replace(/-/g, "")
                    : new Date().toISOString().split("T")[0].replace(/-/g, ""),
                "DocumentLines": Object.values(rowSelection).map(line => ({
                    ItemCode: line.ItemCode,
                    ItemDescription: line.ItemName, // ✅ rename to ItemDescription
                    Quantity: line.Quantity ? line.Quantity : "",
                    UnitPrice: line.UnitPrice ? line.UnitPrice : "",
                })),
            };
             console.log("payload", payload)
            const res = await dispatch(updateCustomerOrder({ id, payload })).unwrap();
            if (res.message === "Please Login!") {
                navigate("/login");
            }
            navigate("/ManageSalesOrder");
        } catch (err) {
            setApiError(err?.message || "Failed to create branch");
        }
    };
    useEffect(() => {
        if (formId !== undefined) {
            // Fetch form data based on formId
            const formDetails = user?.Roles?.flatMap(role =>
                role.UserMenus.flatMap(menu =>
                    menu.children.filter(submenu => submenu.Form.id === formId)
                )
            );
            setTabList(formDetails && formDetails[0]?.Form.FormTabs || []);
            setFormDetails(formDetails);
        } else {
            navigate("/")
        }
    }, [formId])
    return (
        <>{loading ? (
            <BusyIndicator active size="M" />
        ) : (<ObjectPage
            footerArea={
                <>
                    {" "}
                    <Bar
                        style={{ padding: 0.5 }}
                        design="FloatingFooter"
                        endContent={
                            <>
                                <Button design="Positive" onClick={() => handleSubmit()}>
                                    Submit
                                </Button>
                                <Button design="Positive" onClick={() => navigate("/ManageSalesOrder")}>
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
            onBeforeNavigate={function Xs() { }}
            onPinButtonToggle={function Xs() { }}
            onSelectedSectionChange={function Xs() { }}
            onToggleHeaderArea={function Xs() { }}
            selectedSectionId="section1"
            style={{
                height: "700px",
                maxHeight: "90vh",
            }}
            titleArea={
                <ObjectPageTitle
                    breadcrumbs={
                        <>

                            <Breadcrumbs design="Standard"
                                separators="Slash"
                                onItemClick={(e) => {
                                    const route = e.detail.item.dataset.route;
                                    if (route) navigate(route);
                                }}>
                                <BreadcrumbsItem data-route="/UserDashboard">Home</BreadcrumbsItem>
                                <BreadcrumbsItem data-route="/ManageSalesOrder">
                                    Manage Sales Order
                                </BreadcrumbsItem>
                                <BreadcrumbsItem>{formDetails ? formDetails[0]?.name : "Sales Order"}</BreadcrumbsItem>
                            </Breadcrumbs></>
                    }
                    header={<Title level="H2">{formDetails ? formDetails[0]?.name : "Sales Order"}</Title>}
                    navigationBar={
                        <Toolbar design="Transparent">
                            {/* <ToolbarButton design="Transparent" icon="full-screen" />
              <ToolbarButton design="Transparent" icon="exit-full-screen" /> */}


                            <ToolbarButton
                                onClick={() => navigate("/ManageSalesOrder")}
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
        >{console.log("tabList", tabList, orderItems, generaleditdata)}
            {
                tabList.length > 0 && tabList.map((tab) => {
                    console.log("object", tab);
                    if (tab.name === "general") {
                        return (
                            <ObjectPageSection
                                id="section1"
                                style={{ height: "100%" }}
                                titleText="General"
                            >
                                <General
                                    onSubmit={handleSubmit}
                                    setFormData={setFormData}
                                    formData={formData}
                                    defaultValues={formData}  // ✅ now passes edit data properly
                                    apiError={apiError}
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
                        );
                    } else if (tab.name === "contents") {
                        return (
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
                                    orderItems={orderItems}
                                    loading={loading}
                                    form={form}
                                    handleRowChange={handleRowChange}
                                    deleteRow={deleteRow}
                                    addRow={addRow}
                                    SalesOrderRenderInput={SalesOrderRenderInput}
                                    handleChange={handleChange}
                                />
                            </ObjectPageSection>
                        );
                    } else if (tab.name === "logistics") {
                        return (
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
                        );
                    }
                    else if (tab.name === "accounting") {
                        return (
                            <ObjectPageSection
                                id="section4"
                                style={{
                                    height: "100%",
                                }}
                                titleText="Accounting"
                            >
                                <Accounting />
                            </ObjectPageSection>
                        );
                    } else if (tab.name === "attachments") {
                        return (
                            <ObjectPageSection
                                id="section5"
                                style={{
                                    height: "100%",
                                }}
                                titleText="Attachments"
                            >
                                <Attachments />
                            </ObjectPageSection>
                        );
                    } else if (tab.name === "user-defined-field") {
                        return (
                            <ObjectPageSection
                                id="section6"
                                style={{
                                    height: "100%",
                                }}
                                titleText="User-defined Fields"
                            >
                                <UserDefinedFields form={form}
                                    handleChange={handleChange} />
                            </ObjectPageSection>
                        );
                    }
                })
                // <ObjectPageSection
                //   id="section1"
                //   style={{ height: "100%" }}
                //   titleText="General"
                // >
                //   <General form={form} SubForms="" handleChange={handleChange} />
                // </ObjectPageSection><ObjectPageSection
                //   id="section3"
                //   style={{
                //     height: "100%",
                //   }}
                //   titleText="Logistics"
                // >
                //     <Logistics
                //       fieldConfig={fieldConfig}
                //       SalesOrderRenderInput={SalesOrderRenderInput}
                //       form={form}
                //       handleChange={handleChange}
                //     />
                //   </ObjectPageSection><ObjectPageSection
                //     id="section4"
                //     style={{
                //       height: "100%",
                //     }}
                //     titleText="Accounting"
                //   >
                //     <Accounting />
                //   </ObjectPageSection>  <ObjectPageSection
                //     id="section5"
                //     style={{
                //       height: "100%",
                //     }}
                //     titleText="Attachments"
                //   >
                //     <Attachments />
                //   </ObjectPageSection><ObjectPageSection
                //     id="section6"
                //     style={{
                //       height: "100%",
                //     }}
                //     titleText="User-defined Fields"
                //   >
                //     <UserDefinedFields form={form}
                //       handleChange={handleChange} />
                //   </ObjectPageSection>
            }









        </ObjectPage >)}</>
    );
}

export default EditSalesOrder;