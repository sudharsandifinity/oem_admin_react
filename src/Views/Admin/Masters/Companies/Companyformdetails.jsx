import {  useRef } from "react";

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
  Option,
  Page,
  Select,
  Switch,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  company_code: yup.string().required("Company code is required"),
  company_db_name: yup.string().required("Company database name is required"),
  base_url: yup.string().required("Base URL is required"),
  sap_username: yup.string().required("SAP username is required"),
  secret_key: yup.string().required("Secret key is required"),
  status: yup.string().required("Status is required"),
  // is_branch: yup.string().required("is_branch is required"),1
 
});

const Companyformdetails = ({
  onSubmit,
  defaultValues = {
    name: "",
    company_code: "",
    company_db_name: "",
    base_url:"",
    sap_username: "",
    secret_key: "",
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

  const navigate = useNavigate();
  

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
                  {mode === "edit" ? "Update Company" : "Create Company"}
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
            <div style={{ width: "250px" }}>
              <Breadcrumbs
                design="Standard"
                onItemClick={(e) => {
                  const route = e.detail.item.dataset.route;
                  if (route) navigate(route);
                }}
                separators="Slash"
              >
                <BreadcrumbsItem data-route="/admin">Admin</BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/companies">
                  Companies
                </BreadcrumbsItem>
                <BreadcrumbsItem data-route="/admin/companies/create">
            {mode === "edit" ? "Edit Company" : "Create Company"}
                  
                </BreadcrumbsItem>
              </Breadcrumbs>
            </div>
          }
        >
          <Title level="h4">
            {mode === "edit" ? "Edit Company" : "Create Company"}
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
        <FlexBox
          wrap="Wrap" // allow line breaks
          style={{ gap: "1rem", paddingTop: "4rem" }}
        >
          <FlexBox direction="Column" style={{ flex: " 28%"}}>
            <Label>Company Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                 style={{ width: "100%" }}
                >
                  <Input
                    style={{width:"80%"}}
                    placeholder="Company Name"
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
            <Label>Company Db Name</Label>
            <Controller
              name="company_db_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "28%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="Company Db Name"
                    name="company_db_name"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.company_db_name ? "Error" : "None"} // red border on error
                  >
                    {errors.company_db_name && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.company_db_name.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Company Code</Label>
            <Controller
              name="company_code"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "28%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="Company Code"
                    name="company_code"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.company_code ? "Error" : "None"} // red border on error
                  >
                    {errors.company_code && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.company_code.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Base URL</Label>
            <Controller
              name="base_url"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "28%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="Base URL"
                    name="base_url"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.base_url ? "Error" : "None"} // red border on error
                  >
                    {errors.base_url && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.base_url.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>SAP UserName</Label>
            <Controller
              name="sap_username"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "28%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="SAP UserName"
                    name="sap_username"
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.sap_username ? "Error" : "None"} // red border on error
                  >
                    {errors.sap_username && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.sap_username.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>
          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Secret Key</Label>
            <Controller
              name="secret_key"
              control={control}
                rules={{
            required: "Secret Key is required",
            minLength: { value: 8, message: "Must be at least 8 characters" },
          }}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "28%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="Secret Key"
                    name="secret_key"
                    type="password  "
                    value={field.value ?? ""} // controlled value
                    onInput={(e) => field.onChange(e.target.value)} // update RHF
                    valueState={errors.secret_key ? "Error" : "None"} // red border on error
                  >
                    {errors.secret_key && (
                      /* UI5 shows this automatically when valueState="Error" */
                      <span slot="valueStateMessage">
                        {errors.secret_key.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Status</Label>{" "}
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                  style={{width:"26%"}}
                  placeholder="Status"
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
          {/* <FlexBox direction="Column" style={{ flex: " 25%" }}>
            <Label>Is branch</Label>
            <FlexBox label={<Label required>Is Branch</Label>}>
              <Controller
                name="is_branch"
                control={control}
                render={({ field }) => (
                  <Select
                  style={{width:"26%"}}
                    name="is_branch"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.is_branch ? "Error" : "None"}
                  >
                   <Option key="" value="">Select</Option>
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                )}
              />

              {errors.is_branch && (
                <span
                  slot="valueStateMessage"
                  style={{ color: "var(--sapNegativeColor)" }}
                >
                  {errors.is_branch.message}
                </span>
              )}
            </FlexBox>
          </FlexBox> */}
        </FlexBox>
      </form>
    </Page>
  );
};

export default Companyformdetails;
