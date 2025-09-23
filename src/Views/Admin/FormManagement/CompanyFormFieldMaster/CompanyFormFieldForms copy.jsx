import { useCallback, useEffect, formef, useState, useRef } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fetchRoles } from "../../../../store/slices/roleSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  CheckBox,
  FlexBox,
  FormItem,
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
import { fetchForm } from "../../../../store/slices/formmasterSlice";
import { fetchFormSection } from "../../../../store/slices/formsectionSlice";
import Companies from "../../Masters/Companies/Companies";
import { fetchCompanies } from "../../../../store/slices/companiesSlice";
import { fetchFormFields } from "../../../../store/slices/FormFieldSlice";

// Validation schema
const schema = yup.object().shape({
  formId: yup.string().required("Form id name is required"),
  formSectionId: yup.string().required("Form Section Id  is required"),
  field_name: yup.string().required("Field Name  is required"),
  display_name: yup.string().required("Display Name  is required"),
  input_type: yup.string().required("Input Type  is required"),
  field_order: yup.string().required("Field Order  is required"),
});

const CompanyFormFieldForms = ({
  onSubmit,
  defaultValues = {
    companyId: "",
    formId: "",
    formSectionId: "",
    field_name: "",
    display_name: "",
    input_type: "",
    field_order: "",
    is_visible: "",
    is_field_data_bind: "",
    bind_data_by: "NULL",
    status: "",
  },
  mode = "create",
  apiError,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema, { context: { mode } }),
  });
  const formRef = useRef(null);
  const [formfieldId, setformfieldId] = useState("");

  const { forms } = useSelector((state) => state.forms);
  const { companies } = useSelector((state) => state.companies);
  const { formField } = useSelector((state) => state.formField);
  const formFieldValues = formField.find((c) => c.id === formfieldId);

  console.log("formFieldValues", formFieldValues, formField);

  const dispatch = useDispatch();
  const { formsection } = useSelector((state) => state.formsection);

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [assignBranches, setAssignBranches] = useState(true);
  const [company, setCompany] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const navigate = useNavigate();
  const handleCheckboxToggle = (branch) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchFormSection()).unwrap();
        console.log("resusers", res);
        dispatch(fetchForm());
        dispatch(fetchCompanies());
        dispatch(fetchFormFields());
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
  useEffect(() => {
    if (formfieldId) {
      const selectedField = formField.find((f) => f.id === formfieldId);
      console.log("selectedField", selectedField);
      if (selectedField) {
        // Set all relevant fields
        setValue("formId", selectedField.Form?.id || ""); // ✅ Populate formId
        setValue("formSectionId", selectedField.FormSection?.id || "");
        setValue("field_name", selectedField.field_name || "");
        setValue("display_name", selectedField.display_name || "");
        setValue("input_type", selectedField.input_type || "");
        setValue("field_order", selectedField.field_order || "");
        setValue("is_visible", selectedField.is_visible?.toString() || "0");
        setValue(
          "is_field_data_bind",
          selectedField.is_field_data_bind?.toString() || "0"
        );
        setValue("bind_data_by", selectedField.bind_data_by || "NULL");
        setValue("status", selectedField.status?.toString() || "1");
      }
    }
  }, [formfieldId, formField, setValue]);

  return (
    <Page
      backgroundDesign="Solid"
      footer={
        <div>
          <Bar
            design="FloatingFooter"
            endContent={
              <>
                <Button
                  design="Emphasized"
                  form="form" /* ← link button to that form id */
                  type="Submit"
                >
                  {mode === "edit" ? "Update Form Field" : "Create Form Field"}
                </Button>
              </>
            }
          />
        </div>
      }
      header={
        <Bar
          design="Header"
          endContent={
            <Button
              accessibleName="Settings"
              icon="settings"
              title="Go to Settings"
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
                <BreadcrumbsItem data-route="/admin/CompanyFormFields">
                  CompanyFormFields
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/CompanyFormFields/create">
                  Create Form Fields
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Form Field" : "Create Form Field"}
          </Title>
        </Bar>
      }
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
        {console.log("formsectionselecteddata", defaultValues)}
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", paddingTop: "4rem" }}
        >
          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Company</Label>
            <FormItem label={<Label required>companyId</Label>}>
              <Controller
                name="companyId"
                control={control}
                render={({ field }) => (
                  <Select
                    name="formId"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.formId ? "Error" : "None"}
                  >
                    <Option key="" value="">Select</Option>
                    {companies
                      .filter((r) => r.status) /* active roles only    */
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
            </FormItem>
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: "28%" }}>
            <Label>Form Field</Label>
            <FormItem label={<Label required>formId</Label>}>
              <Controller
                name="formfieldId"
                control={control}
                render={({ field }) => (
                  <Select
                    name="formfieldId"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setformfieldId(e.target.value);
                    }}
                    valueState={errors.formfieldId ? "Error" : "None"}
                  >
                 <Option key="" value="">Select</Option>
                    {formField
                      .filter((r) => r.status) /* active roles only    */
                      .map((r) => (
                        <Option key={r.id} value={r.id}>
                          {r.display_name}
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
            </FormItem>
          </FlexBox>

          {formfieldId ? (
            <>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Form</Label>
                <FormItem label={<Label required>formId</Label>}>
                  <Controller
                    name="formId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="formId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("formId", e.target.value || "");
                        }}
                        valueState={errors.formId ? "Error" : "None"}
                      >
                      <Option key="" value="">Select</Option>
                        {forms
                          .filter((r) => r.status) /* active roles only    */
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
                </FormItem>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Form section</Label>
                <FormItem label={<Label required>formSectionId</Label>}>
                  <Controller
                    name="formSectionId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="formSectionId"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("formSectionId", e.target.value || "");
                        }}
                        valueState={errors.formSectionId ? "Error" : "None"}
                      >
                       <Option key="" value="">Select</Option>
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
                </FormItem>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Field Name </Label>
                <Controller
                  name="field_name"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label={<Label required>Label Text</Label>}
                      style={{ flex: "48%" }}
                    >
                      <Input
                        placeholder="Field Name"
                        name="field_name"
                        value={field.value ?? ""} // controlled value
                        onInput={(e) => {
                          field.onChange(e.target.value);
                          setValue("field_name", e.target.value || "");
                        }} // update RHF
                        valueState={errors.field_name ? "Error" : "None"} // red border on error
                      >
                        {errors.field_name && (
                          /* UI5 shows this automatically when valueState="Error" */
                          <span slot="valueStateMessage">
                            {errors.field_name.message}
                          </span>
                        )}
                      </Input>
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Display Name</Label>
                <Controller
                  name="display_name"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label={<Label required>Diaplay Name</Label>}
                      style={{ flex: "1 1 48%" }}
                    >
                      <Input
                        placeholder="Form Section"
                        name="display_name"
                        value={field.value ?? ""}
                        onInput={(e) => {
                          field.onChange(e.target.value);
                          setValue("display_name", e.target.value || "");
                        }}
                        valueState={errors.display_name ? "Error" : "None"}
                      >
                        {errors.display_name && (
                          <span slot="valueStateMessage">
                            {errors.display_name.message}
                          </span>
                        )}
                      </Input>
                    </FormItem>
                  )}
                />
              </FlexBox>

              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Input Name</Label>
                <FormItem label={<Label required>input_type</Label>}>
                  <Controller
                    name="input_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="Is Visible"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("input_type", e.target.value || "");
                        }}
                        valueState={errors.input_type ? "Error" : "None"}
                      >
                        <Option key="" value="">Select</Option>
                        <Option key="text" value="text">
                          Text
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
                        <Option key="textarea" value="textarea">
                          Text Area
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
                </FormItem>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: " 28%" }}>
                <Label>Field Order</Label>
                <Controller
                  name="field_order"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label={<Label required>Label Text</Label>}
                      style={{ flex: "48%" }}
                    >
                      <Input
                        placeholder="Field Order"
                        name="field_order"
                        value={field.value ?? ""} // controlled value
                        onInput={(e) => {
                          field.onChange(e.target.value);
                          setValue("field_order", e.target.value || "");
                        }}
                        valueState={errors.field_order ? "Error" : "None"} // red border on error
                      >
                        {errors.field_order && (
                          /* UI5 shows this automatically when valueState="Error" */
                          <span slot="valueStateMessage">
                            {errors.field_order.message}
                          </span>
                        )}
                      </Input>
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Is Visible</Label>
                <FormItem label={<Label required>formSectionId</Label>}>
                  <Controller
                    name="is_visible"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="Is Visible"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("is_visible", e.target.value || "");
                        }}
                        valueState={errors.formSectionId ? "Error" : "None"}
                      >
                       <Option key="" value="">Select</Option>
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
                </FormItem>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Is Field Data Bind</Label>
                <FormItem label={<Label required>formSectionId</Label>}>
                  <Controller
                    name="is_field_data_bind"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="Is Visible"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("is_field_data_bind", e.target.value || "");
                        }}
                        valueState={
                          errors.is_field_data_bind ? "Error" : "None"
                        }
                      >
                       <Option key="" value="">Select</Option>
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
                </FormItem>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Bind Data Style</Label>
                <FormItem label={<Label required>Status</Label>}>
                  <Controller
                    name="bind_data_by"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="bind_data_by"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("bind_data_by", e.target.value || "");
                        }}
                        valueState={errors.bind_data_by ? "Error" : "None"}
                      >
                       <Option key="" value="">Select</Option>

                        <Option value="dropdown">Dropdown</Option>
                        <Option value="dialog">Dialog</Option>
                      </Select>
                    )}
                  />
                </FormItem>
              </FlexBox>
              <FlexBox direction="Column" style={{ flex: "28%" }}>
                <Label>Status</Label>
                <FormItem label={<Label required>Status</Label>}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="status"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setValue("status", e.target.value || "");
                        }}
                        valueState={errors.status ? "Error" : "None"}
                      >
                       <Option key="" value="">Select</Option>

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
                </FormItem>
              </FlexBox>
            </>
          ) : (
            <></>
          )}
        </FlexBox>
      </form>
    </Page>
  );
};

export default CompanyFormFieldForms;
