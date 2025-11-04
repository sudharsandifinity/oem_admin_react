import { useEffect, useState, useRef, useCallback } from "react";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  Page,
  Select,
  Switch,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";
import AppBar from "../../../../Components/Module/Appbar";
import { useSelector } from "react-redux";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Form name is required"),
  display_name: yup.string().required("Display name is required"),
  form_type: yup.string().required("Form type is required"),
  scope: yup.string().required("Scope is required"),
  // companyId: yup.string().when("scope", {
  //   is: "global",
  //   then: yup.string().required("Company ID is required"),
  //   otherwise: yup.string().nullable(),
  // }),
  companyId: yup.string().nullable(),
  branchId: yup.string().required("Branch ID is required"),
  status: yup.string().required("Status name is required"),
});

const Form = ({
  onSubmit,
  //branches,
  //companies,
  defaultValues = {
    scope: "global",
    companyId: "",
    branchId: "",
    form_type: "",
    name: "",
    display_name: "",
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
  const onFormReady = useCallback((form) => {
    console.log("form ready", form);
    formRef.current = form;
  }, []);

  const { branches } = useSelector((state) => state.branches);
  const { companies } = useSelector((state) => state.companies);
  const [assignBranchEnabled, setAssignBranchEnabled] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [currScope, setCurrScope] = useState("global");

  const [selectedBranches, setSelectedBranches] = useState([]);
  const navigate = useNavigate();
const branchList = branches.filter(b => b.companyId === selectedCompany?.value)

const handleselectedForm=(e)=>{
  console.log("handleselectedform",e)
}

  useEffect(() => {
    if (mode === "edit") {
      setAssignBranchEnabled(true);
      setSelectedCompany(defaultValues.company || null);
      setSelectedBranchIds(defaultValues.branchIds || []);
    }
  }, [mode, defaultValues]);

  return (
      <>
        <style>
            {`
              ui5-page::part(content) {
                padding: 15px;
              }
            `}
          </style>
        <FlexBox direction="Column" style={{width: '100%'}}>
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
            <div style={{ width: "200px" }}>
              <Breadcrumbs
                design="Standard"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
                separators="Slash"
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/FormMaster">
                  Forms
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/FormMaster/create">
                  {mode === "edit" ? "Update Form" : "Create Form"}
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Form" : "Create New Form"}
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
                form="formsubmit" /* ← link button to that form id */
                type="Submit"
              >
                {mode === "edit" ? "Update Form" : "Create Form"}
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
      //       <div style={{ width: "200px" }}>
      //         <Breadcrumbs
      //           design="Standard"
      //           onItemClick={(e) => {
      //             const route = e.detail.item.dataset.route;
      //             if (route) navigate(route);
      //           }}
      //           separators="Slash"
      //         >
      //           <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
      //           <BreadcrumbsItem data-route="/admin/FormMaster">
      //             Forms
      //           </BreadcrumbsItem>
      //           <BreadcrumbsItem data-route="/admin/FormMaster/create">
      //             {mode === "edit" ? "Update Form" : "Create Form"}
      //           </BreadcrumbsItem>
      //         </Breadcrumbs>
      //       </div>
      //     }
      //   >
      //     <Title level="h4">
      //       {mode === "edit" ? "Edit Form" : "Create New Form"}
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

      <form
        ref={formRef}
        id="formsubmit"
        onFormReady={onFormReady}
        onSubmit={handleSubmit((formData) => {
          console.log("formDataonsubmit", formData);
          const fullData = {
            ...formData,
          };
          onSubmit(fullData); // you already pass it upward
        })}
      >
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
                    onChange={(e) => { field.onChange(e.target.value); setCurrScope(e.target.value) }}
                    valueState={errors.scope ? "Error" : "None"}
                  >
                    <Option key="" value="">Select</Option>

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
                    onChange={(e) => { field.onChange(e.target.value); setSelectedCompany(e.detail.selectedOption) }}
                    valueState={errors.companyId ? "Error" : "None"}
                  >
                    <Option key="" value="">Select</Option>

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
                      const value = e.detail.selectedOption.value;  // ✅ only the id
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
                <label>FormTab</label>
                <FlexBox label={<Label required>tabId</Label>}>
                  <Controller
                    name="tabId"
                    control={control}
                    render={({ field }) => (
                      <MultiComboBox
                        style={{ width: "80%" }}
                        name="tabId"
                        value={field.value ?? ""}
                        onSelectionChange={(e) => {
                          console.log("e.detail.selectedItems", e.detail.items);
                          const selectedItems = e.detail.items.map((item) =>
                            item.getAttribute("value")
                          );
                          selectedItems.map((item) =>
                            handleselectedForm(item)
                          );

                          field.onChange(selectedItems);
                        }}
                        valueState={errors.tabId ? "Error" : "None"}
                      >
                        {companies
                          .filter((r) => r.status) /* active roles only    */
                          .map((r) => (
                            <MultiComboBoxItem
                              key={r.id}
                              value={r.id}
                              text={r.name}
                              selected={field.value?.includes(r.id)}
                            />
                          ))}
                      </MultiComboBox>
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
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Form Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
                >
                  <Input
                    style={{ width: "80%" }}

                    placeholder="Form Name"
                    name="name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.name ? "Error" : "None"} // red border on error
                  >
                    {errors.name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.name.message}
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

                    placeholder="Display Name"
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
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Form Type</Label>
            <Controller
              name="form_type"
              control={control}
              render={({ field }) => (
                <Select
                  style={{ width: "80%" }}

                  name="form_type"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  valueState={errors.form_type ? "Error" : "None"}
                >
                  <Option key="" value="">Select</Option>
                  <Option value={"Item"}>{"Item"}</Option>
                  <Option value={"Service"}>{"Service"}</Option>
                  <Option value={"Both"}>{"Both"}</Option>
                </Select>
              )}
            />
            {errors.form_type && (
              <span
                slot="valueStateMessage"
                style={{ color: "var(--sapNegativeColor)" }}
              >
                {errors.form_type.message}
              </span>
            )}
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Status</Label>{" "}
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
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </form>
    </Page></FlexBox></>
  );
};

export default Form;
