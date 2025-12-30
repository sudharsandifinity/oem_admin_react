import { useEffect, useState, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  CheckBox,
  FlexBox,
  Input,
  Label,
  List,
  MessageStrip,
  Option,
  Page,
  Select,
  Switch,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import {
  fetchForm,
  fetchGlobalForms,
} from "../../../../store/slices/formmasterSlice";
import { fetchFormSection } from "../../../../store/slices/formsectionSlice";
import AppBar from "../../../../Components/Module/Appbar";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchBranch } from "../../../../store/slices/branchesSlice";

// Validation schema
const schema = yup.object().shape({
  formId: yup.string().required("Form id name is required"),
  subFormId: yup.string().required("Sub Form name is required"),
  formSectionId: yup.string().required("Form Section Id  is required"),
  field_name: yup.string().required("Field Name  is required"),
  display_name: yup.string().required("Display Name  is required"),
  input_type: yup.string().required("Input Type  is required"),
  field_order: yup.string().required("Field Order  is required"),
});

const FormFieldForm = ({
  onSubmit,
  defaultValues = {
    formId: "",
    subFormId: "",
    formSectionId: "",
    field_name: "",
    display_name: "",
    input_type: "",
    field_order: "",
    is_visible: "",
    is_field_data_bind: 0,
    bind_data_by: "NULL",
    status: "",
  },
  mode = "create",
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);

  const { forms, globalForms } = useSelector((state) => state.forms);

  const { branches } = useSelector((state) => state.branches);
  const { companies } = useSelector((state) => state.companies);
  const [assignBranchEnabled, setAssignBranchEnabled] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [currScope, setCurrScope] = useState("global");
  const branchList = branches.filter(
    (b) => b.companyId === selectedCompany?.value
  );
  const formList = forms.filter((f)=>f.Branch?.id===selectedBranchIds)

  const dispatch = useDispatch();
  const { formsection } = useSelector((state) => state.formsection);
  const navigate = useNavigate();
  const [tabList, setTabList] = useState([]);
  const [subFormList, setSubFormList] = useState([]);

  useEffect(() => {
    // dispatch(fetchForm());
    //dispatch(fetchFormSection());
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchForm()).unwrap();
        const res1 = await dispatch(fetchGlobalForms()).unwrap();
        const companyRes=await dispatch(fetchCompanies()).unwrap()
        const branchres=await dispatch(fetchBranch()).unwrap();
        console.log("resusers", res, res1, globalForms,companyRes);
        dispatch(fetchFormSection());
        if (res.message === "Please Login!") {
          navigate("/");
        }
      } catch (err) {
        console.log("Failed to fetch user", err.message);
        err.message && navigate("/");
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <>

      <style>
        {`
                      ui5-page::part(content) {
                        padding: 15px;
                      }
                    `}
      </style>
      <FlexBox direction="Column" style={{ width: "100%" }}>
        <AppBar
          design="Header"
          endContent={
            <Button
              accessibleName="Settings"
              icon="decline"
              title="Go to Settings"
              onClick={() => navigate(-1)} // Go back to previous page
            />
          }
          startContent={
            <div style={{ width: "300px" }}>
              <Breadcrumbs
                design="Standard"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
                separators="Slash"
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/FormFields">
                  FormFields
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="admin/FormFields/create">
                  {mode === "edit" ? "Edit Form Field" : "Create Form Field"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Form Field" : "Create Form Field"}
          </Title>
        </AppBar>
        <Page
          backgroundDesign="Solid"
          footer={
            <Bar
              style={{ padding: 0.5 }}
              design="FloatingFooter"
              endContent={
                <>
                  <Button
                    design="Emphasized"
                    form="form" /* ← link button to that form id */
                    type="Submit"
                  >
                    {mode === "edit"
                      ? "Update Form Field"
                      : "Create Form Field"}
                  </Button>
                </>
              }
            />
          }
          // header={
          //   <AppBar
          //     design="Header"
          //     endContent={
          //       <Button
          //         accessibleName="Settings"
          //         icon="decline"
          //         title="Go to Settings"
          //         onClick={() => navigate(-1)} // Go back to previous page
          //       />
          //     }
          //     startContent={
          //       <div style={{ width: "300px" }}>
          //         <Breadcrumbs
          //           design="Standard"
          //           onItemClick={(e) => {
          //             const route = e.detail.item.dataset.route;
          //             if (route) navigate(route);
          //           }}
          //           separators="Slash"
          //         >
          //           <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
          //           <BreadcrumbsItem data-route="/admin/FormFields">
          //             FormFields
          //           </BreadcrumbsItem>
          //           <BreadcrumbsItem data-route="admin/FormFields/create">
          //             {mode === "edit" ? "Edit Form Field" : "Create Form Field"}
          //           </BreadcrumbsItem>
          //         </Breadcrumbs>
          //       </div>
          //     }
          //   >
          //     <Title level="h4">
          //       {mode === "edit" ? "Edit Form Field" : "Create Form Field"}
          //     </Title>
          //   </AppBar>
          // }
        >
          {apiError && (
            <MessageStrip
              design="Negative"
              hideCloseButton={false}
              hideIcon={false}
              style={{ marginBottom: "1rem" }}
            >
              {apiError}
            </MessageStrip>
          )}
          {console.log("formsection", formsection)}
          <form
            ref={formRef}
            id="form"
            onSubmit={handleSubmit((formData) => {
              const fullData = {
                ...formData,
              };
              onSubmit(fullData); // you already pass it upward
            })}
          >
            {console.log(
              "formsectionselecteddata",
              defaultValues,
              globalForms,
              forms
            )}
            <FlexBox
              wrap="Wrap" // allow line breaks
              style={{ gap: "1rem", paddingTop: "4rem" }}
            >
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Scope</Label>{" "}
                <FlexBox label={<Label required>Scope</Label>}>
                  <Controller
                    name="scope"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="scope"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setCurrScope(e.target.value);
                        }}
                        valueState={errors.scope ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>

                        <Option value="global">Global</Option>
                        <Option value="company">Company</Option>
                        <Option value="branch">Branch</Option>
                      </Select>
                    )}
                  />

                  {errors.scope && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.scope.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Company</Label>{" "}
                <FlexBox label={<Label required>Company</Label>}>
                  <Controller
                    name="companyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        disabled={currScope === "global" ? true : false}
                        name="companyId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setSelectedCompany(e.detail.selectedOption);
                        }}
                        valueState={errors.companyId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
{console.log("companies"  ,companies)}
                        {companies.map((company) => (
                          <Option key={company.id} value={company.id}>
                            {company.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.companyId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.companyId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Branches</Label>{" "}
                <FlexBox label={<Label required>Branches</Label>}>
                  <Controller
                    name="branchId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        disabled={currScope === "global"}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.detail.selectedOption.value; // ✅ only the id
                          setSelectedBranchIds(e.detail.selectedOption.value)
                          field.onChange(value);
                        }}
                        valueState={errors.branchId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        {branchList?.map((b) => (
                          <Option key={b.id} value={b.id}>
                            {b.name}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />

                  {errors.branchId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.branchId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Form</Label>
                <FlexBox label={<Label required>formId</Label>}>
                  <Controller
                    name="formId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="formId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setTabList(
                            formList.find((form) => form.id === e.target.value)
                              .FormTabs || []
                          );
                        }}
                        valueState={errors.formId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        {console.log("forms", forms)}
            {formList.filter((r) => r.status) /* active roles only    */
                          .map((r) => (
                            <Option key={r.id} value={r.id}>
                              {r.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  />

                  {errors.formId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.formId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Tab</Label>
                <FlexBox label={<Label required>tabId</Label>}>
                  <Controller
                    name="tabId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="tabId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setSubFormList(
                            tabList.find((r) => r.id === e.target.value)
                              .SubForms
                          );
                        }}
                        valueState={errors.formId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        {console.log("tablist", tabList)}
                        {tabList
                          ?.filter((form) => form.status)
                          .map((form) => (
                            <Option key={form.id} value={form.id}>
                              {form.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  />

                  {errors.tabId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.tabId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Sub Form</Label>
                <FlexBox label={<Label required>subformId</Label>}>
                  <Controller
                    name="subFormId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="subFormId"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.subFormId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        {subFormList
                          ?.filter((form) => form.status) // only active + matching forms
                          .map((form) => (
                            <Option key={form.id} value={form.id}>
                              {form.name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  />

                  {errors.subFormId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.subFormId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Form section</Label>
                <FlexBox label={<Label required>formSectionId</Label>}>
                  <Controller
                    name="formSectionId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="formSectionId"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.formSectionId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        {formsection
                          .filter((r) => r.status) /* active roles only    */
                          .map((r) => (
                            <Option key={r.id} value={r.id}>
                              {r.section_name}
                            </Option>
                          ))}
                      </Select>
                    )}
                  />

                  {errors.formSectionId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.formSectionId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Field Name </Label>
                <Controller
                  name="field_name"
                  control={control}
                  render={({ field }) => (
                    <FlexBox
                      label={<Label required>Label Text</Label>}
                      style={{ flex: "48%" }}
                    >
                      <Input
                        style={{ width: "80%" }}
                        placeholder="Field Name"
                        name="field_name"
                        value={field.value ?? ""} // controlled value
                        onInput={(e) => field.onChange(e.target.value)} // update RHF
                        valueState={errors.field_name ? "Error" : "None"} // red border on error
                      >
                        {errors.field_name && (
                          /* UI5 shows this automatically when valueState="Error" */
                          <span slot="valueStateMessage">
                            {errors.field_name.message}
                          </span>
                        )}
                      </Input>
                    </FlexBox>
                  )}
                />
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Display Name</Label>
                <Controller
                  name="display_name"
                  control={control}
                  render={({ field }) => (
                    <FlexBox
                      label={<Label required>Diaplay Name</Label>}
                      style={{ flex: "1 1 48%" }}
                    >
                      <Input
                        style={{ width: "80%" }}
                        placeholder="Form Section"
                        name="display_name"
                        value={field.value ?? ""}
                        onInput={(e) => field.onChange(e.target.value)}
                        valueState={errors.display_name ? "Error" : "None"}
                      >
                        {errors.display_name && (
                          <span slot="valueStateMessage">
                            {errors.display_name.message}
                          </span>
                        )}
                      </Input>
                    </FlexBox>
                  )}
                />
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Input Name</Label>
                <FlexBox label={<Label required>input_type</Label>}>
                  <Controller
                    name="input_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="Is Visible"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.input_type ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        <Option key="text" value="text">
                          Text
                        </Option>
                        <Option key="textarea" value="textarea">
                          Text Area
                        </Option>

                        <Option key="date" value="date">
                          Date
                        </Option>
                        <Option key="selectdropdown" value="selectdropdown">
                          Drop Down
                        </Option>
                        <Option key="select" value="select">
                          Dialog
                        </Option>
                        <Option key="email" value="email">
                          Email
                        </Option>
                        <Option key="number" value="number">
                          Phone
                        </Option>
                        <Option key="checkbox" value="checkbox">
                          CheckBox
                        </Option>
                        <Option key="search" value="search">
                          Search
                        </Option>

                        <Option key="radio" value="radio">
                          Radio
                        </Option>
                      </Select>
                    )}
                  />

                  {errors.input_type && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.input_type.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>

              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Field Order</Label>
                <Controller
                  name="field_order"
                  control={control}
                  render={({ field }) => (
                    <FlexBox
                      label={<Label required>Label Text</Label>}
                      style={{ flex: "48%" }}
                    >
                      <Input
                        style={{ width: "80%" }}
                        placeholder="Field Order"
                        name="field_order"
                        value={field.value ?? ""} // controlled value
                        onInput={(e) => field.onChange(e.target.value)} // update RHF
                        valueState={errors.field_order ? "Error" : "None"} // red border on error
                      >
                        {errors.field_order && (
                          /* UI5 shows this automatically when valueState="Error" */
                          <span slot="valueStateMessage">
                            {errors.field_order.message}
                          </span>
                        )}
                      </Input>
                    </FlexBox>
                  )}
                />
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Is Visible</Label>
                <FlexBox label={<Label required>formSectionId</Label>}>
                  <Controller
                    name="is_visible"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="Is Visible"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.formSectionId ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        <Option key="1" value="1">
                          True
                        </Option>
                        <Option key="0" value="0">
                          False
                        </Option>
                      </Select>
                    )}
                  />

                  {errors.formSectionId && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.formSectionId.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Is Field Data Bind</Label>
                <FlexBox label={<Label required>formSectionId</Label>}>
                  <Controller
                    name="is_field_data_bind"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="Is Visible"
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={
                          errors.is_field_data_bind ? "Error" : "None"
                        }
                      >
                        <Option key="" value="">
                          Select
                        </Option>
                        <Option key="1" value="1">
                          True
                        </Option>
                        <Option key="0" value="0">
                          False
                        </Option>
                      </Select>
                    )}
                  />

                  {errors.is_field_data_bind && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.is_field_data_bind.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Bind Data Style</Label>
                <FlexBox label={<Label required>Status</Label>}>
                  <Controller
                    name="bind_data_by"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="bind_data_by"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.bind_data_by ? "Error" : "None"}
                      >
                        <Option>Select</Option>

                        <Option value="dropdown">Dropdown</Option>
                        <Option value="dialog">Dialog</Option>
                      </Select>
                    )}
                  />
                </FlexBox>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Status</Label>
                <FlexBox label={<Label required>Status</Label>}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: "80%" }}
                        name="status"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        valueState={errors.status ? "Error" : "None"}
                      >
                        <Option key="" value="">
                          Select
                        </Option>

                        <Option value="1">Active</Option>
                        <Option value="0">Inactive</Option>
                      </Select>
                    )}
                  />

                  {errors.status && (
                    <span
                      slot="valueStateMessage"
                      style={{ color: "var(--sapNegativeColor)" }}
                    >
                      {errors.status.message}
                    </span>
                  )}
                </FlexBox>
              </FlexBox>
            </FlexBox>
          </form>
        </Page>
      </FlexBox>
    </>
  );
};

export default FormFieldForm;
