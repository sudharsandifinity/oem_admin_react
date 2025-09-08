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
  Title,
} from "@ui5/webcomponents-react";
import { useNavigate } from "react-router-dom";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("form_name is required"),
  //city: yup.string().required("display_name is required"),
  //address: yup.string().required("display_name is required"),
});

const Companyformdetails = ({
  onSubmit,
  defaultValues = {
    name: "",
    company_code: "",
    company_db_name: "",
    //city: "",
    //address: "",
    //is_branch: "",
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
          <FlexBox direction="Column" style={{ flex: " 48%"}}>
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
          <FlexBox direction="Column" style={{ flex: " 48%" }}>
            <Label>Company Db Name</Label>
            <Controller
              name="company_db_name"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
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
          <FlexBox direction="Column" style={{ flex: " 48%" }}>
            <Label>Company Code</Label>
            <Controller
              name="company_code"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Label Text</Label>}
                  style={{ flex: "48%" }}
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
          {/* <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>City</Label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>City</Label>}
                  style={{ flex: "1 1 48%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="City"
                    name="city"
                    value={field.value ?? ""}
                    onInput={(e) => field.onChange(e.target.value)}
                    valueState={errors.city ? "Error" : "None"}
                  >
                    {errors.city && (
                      <span slot="valueStateMessage">
                        {errors.city.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox>

          <FlexBox direction="Column" style={{ flex: " 28%" }}>
            <Label>Address</Label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <FlexBox
                  label={<Label required>Address</Label>}
                  style={{ flex: "1 1 48%" }}
                >
                  <Input
                  style={{width:"80%"}}
                    placeholder="address"
                    name="address"
                    value={field.value ?? ""}
                    onInput={(e) => field.onChange(e.target.value)}
                    valueState={errors.address ? "Error" : "None"}
                  >
                    {errors.address && (
                      <span slot="valueStateMessage">
                        {errors.address.message}
                      </span>
                    )}
                  </Input>
                </FlexBox>
              )}
            />
          </FlexBox> */}

          <FlexBox direction="Column" style={{ flex: " 48%" }}>
            <Label>Status</Label>{" "}
            <FlexBox label={<Label required>Status</Label>}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                  style={{width:"80%"}}
                    name="status"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    valueState={errors.status ? "Error" : "None"}
                  >
                    <Option>Select</Option>

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
                    <Option>Select</Option>
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
